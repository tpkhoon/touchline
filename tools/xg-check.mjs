// Checks the shot model (tools/wyscout-shots.mjs) the way an xG model is judged: fitted on some leagues and scored on a league it has
// not seen, with the scores the xG literature reports (Brier score, log loss, area under the ROC curve, and how the average
// predicted chance compares with the goals scored). It follows the set-up of the open-source soccer_xg package
// (https://github.com/ML-KULeuven/soccer_xg, Apache 2.0): open-play shots only, train on some leagues and validate on another.
//
//   node --max-old-space-size=6144 tools/xg-check.mjs --data <folder with the Wyscout events_*.json>
import fs from 'node:fs';
import path from 'node:path';
import { readShots, fit, prob } from './wyscout-shots.mjs';

const args = {};
{
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++)
    if (a[i].startsWith('--'))
      args[a[i].slice(2)] = a[i + 1] === undefined || a[i + 1].startsWith('--') ? true : a[++i];
}
if (!args.data || args.data === true) {
  console.log(
    'usage: node --max-old-space-size=6144 tools/xg-check.mjs --data <folder with the Wyscout events_*.json>',
  );
  process.exit(1);
}
const dir = path.resolve(String(args.data));
const LEAGUES = ['England', 'Spain', 'Italy', 'Germany', 'France'];

export const score = (shots, w) => {
  const p = shots.map((s) => Math.min(1 - 1e-9, Math.max(1e-9, prob(w, s)))),
    y = shots.map((s) => (s.goal ? 1 : 0));
  const n = shots.length;
  const brier = p.reduce((a, v, i) => a + (v - y[i]) ** 2, 0) / n,
    logloss = -p.reduce((a, v, i) => a + (y[i] ? Math.log(v) : Math.log(1 - v)), 0) / n;
  // area under the ROC curve: the chance a goal was given a higher value than a miss (ties count half)
  const order = p.map((v, i) => [v, y[i]]).sort((a, b) => a[0] - b[0]);
  let rank = 0,
    pos = 0;
  for (let i = 0; i < n;) {
    let j = i;
    while (j < n && order[j][0] === order[i][0]) j++;
    const mid = (i + j + 1) / 2; // average rank (1-based) of the tie
    for (let k = i; k < j; k++) if (order[k][1]) ((rank += mid), pos++);
    i = j;
  }
  const auc = (rank - (pos * (pos + 1)) / 2) / (pos * (n - pos));
  const rate = y.reduce((a, v) => a + v, 0) / n,
    mean = p.reduce((a, v) => a + v, 0) / n;
  return { n, rate, mean, brier, base: rate * (1 - rate), logloss, auc };
};

const by = {};
for (const lg of LEAGUES) {
  const f = path.join(dir, `events_${lg}.json`);
  if (!fs.existsSync(f)) {
    console.error(`missing ${f}`);
    process.exit(1);
  }
  // open-play shots only (as the package's models are): no penalties, no direct free kicks
  by[lg] = readShots(f).shots.filter((s) => s.kind !== 'penalty' && s.kind !== 'fk');
  console.log(`  ${lg}: ${by[lg].length} open-play shots`);
}
console.log('\nFitted on the other four leagues, scored on the one left out (open-play shots):');
console.log('league     shots  goals%  mean xG   Brier  (no-skill)  log loss    AUC');
const rows = [];
for (const lg of LEAGUES) {
  const train = LEAGUES.filter((l) => l !== lg).flatMap((l) => by[l]),
    w = fit(train),
    s = score(by[lg], w);
  rows.push(s);
  console.log(
    `${lg.padEnd(10)} ${String(s.n).padStart(5)}  ${(s.rate * 100).toFixed(1).padStart(5)}%  ${(s.mean * 100).toFixed(1).padStart(6)}%  ${s.brier.toFixed(4)}   ${s.base.toFixed(4)}    ${s.logloss.toFixed(4)}  ${s.auc.toFixed(3)}`,
  );
}
const avg = (k) => rows.reduce((a, r) => a + r[k], 0) / rows.length;
console.log(
  `${'average'.padEnd(10)} ${' '.repeat(5)}  ${(avg('rate') * 100).toFixed(1).padStart(5)}%  ${(avg('mean') * 100).toFixed(1).padStart(6)}%  ${avg('brier').toFixed(4)}   ${avg('base').toFixed(4)}    ${avg('logloss').toFixed(4)}  ${avg('auc').toFixed(3)}`,
);
