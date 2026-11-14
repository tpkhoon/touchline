// The time budget on a late-season save: opens the newest save in the library (a career with seasons behind it), plays a number of days
// with the sim the game runs, and fails when a day takes longer than its budget; it also prints what grows in a long save (the feed, the
// scout reports, the per-player histories, the size of the packed save) and fails when one of them has run away.
//   node tools/budget.mjs [--days 10] [--max-ms-day 4000] [--max-news 400] [--max-hist 60]      (npm run test:budget)
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import { parseArgs, loadSim } from './harness.mjs';
import { SAVES } from './savelib.mjs';

const args = parseArgs();
const DAYS = +(args.days || 10),
  MAX_MS_DAY = +(args['max-ms-day'] || 4000),
  MAX_NEWS = +(args['max-news'] || 400),
  MAX_HIST = +(args['max-hist'] || 60);
const files = fs
  .readdirSync(SAVES)
  .filter((f) => f.endsWith('.touchline'))
  .sort();
if (!files.length) {
  console.log('No save in the library to measure.');
  process.exit(1);
}
const file = path.join(SAVES, files.at(-1));
const buf = fs.readFileSync(file);
let text;
try {
  text = zlib.gunzipSync(buf).toString('utf8');
} catch (e) {
  text = buf.toString('utf8');
}
const parsed = JSON.parse(text);
delete parsed.report;
const { FM } = loadSim(7);
const Sea = FM.Season,
  W = FM.W;
const t0 = performance.now();
FM.S = FM.Save.relink(FM.Save.unpack(parsed).state);
W.rosterVer++;
const openMs = Math.round(performance.now() - t0);
const fails = [];
let played = 0;
const t1 = performance.now();
for (let i = 0; i < DAYS; i++) {
  const fx = Sea.userFixture();
  if (fx && FM.S.user && !FM.S.user.sacked) Sea.applyUserMatch(FM.quickSim(fx, !!fx.ko));
  Sea.advance(null);
  if (!W.employed() && FM.S.user.offers && FM.S.user.offers.length)
    W.takeCharge(FM.S.user.offers[0].id, 'Budget Manager', false);
  played++;
}
const perDay = Math.round((performance.now() - t1) / played);
const S = FM.S;
const hist = Object.values(S.players).reduce((m, p) => Math.max(m, (p.history || []).length), 0);
const grow = {
  players: Object.keys(S.players).length,
  'news items': S.news.length,
  'scout reports': Object.keys(S.user.reports || {}).length,
  'longest player history (seasons)': hist,
  'packed save (MB)': +(FM.Save.pack(S).length / 1048576).toFixed(1),
};
console.log(`${path.basename(file)}: opened in ${openMs} ms; ${played} days at ${perDay} ms a day`);
for (const [k, v] of Object.entries(grow)) console.log(`  ${k}: ${v}`);
if (perDay > MAX_MS_DAY) fails.push(`a day takes ${perDay} ms (budget ${MAX_MS_DAY})`);
if (S.news.length > MAX_NEWS) fails.push(`the feed holds ${S.news.length} items (budget ${MAX_NEWS})`);
if (hist > MAX_HIST) fails.push(`a player history has ${hist} seasons (budget ${MAX_HIST})`);
if (fails.length) {
  console.log('FAIL\n  ' + fails.join('\n  '));
  process.exit(1);
}
console.log('ok: within budget');
