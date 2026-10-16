// Win-chance calibration: does the "Win chance" the matchday screen shows come true? Matches are played between clubs of every
// strength, the chance the screen would show is worked out for each (Season.matchOdds, from the two XIs as the home screen does),
// and the matches are grouped by that chance: of the matches shown as 60%, about 60% should be won.
// Three ways of playing are checked, because the manager plays them all:
//   quick     two clubs played by the computer (the way every other match in the world is played)
//   instant   your match played from the preview with "Play instantly" (your assistant takes the decisions)
//   watched   your match watched live, with the manager making no changes (so no substitutions)
//   node tools/winchance.mjs [--matches 1200] [--seed 7] [--modes quick,instant,watched]
// Prints each way's table, and a line per measure for the dashboard: how far the shown chance is from the results overall, and
// the win rate at each shown chance. Exit 1 when a measure is out of range.
import { parseArgs, loadSim } from './harness.mjs';

const args = parseArgs();
const N = +(args.matches || 1200),
  seed = +(args.seed || 7);
const MODES = String(args.modes || 'quick,instant,watched')
  .split(',')
  .filter((m) => ['quick', 'instant', 'watched'].includes(m));
const { FM } = loadSim(seed);
const { W, U } = FM;
const Sea = FM.Season;
W.newWorld(W.REAL_RULES);
Sea.init();
W.takeCharge(Object.values(FM.S.clubs).find((c) => c.comp === 'D1' && c.rep < 70).id, 'Calibration Manager');
const user0 = FM.S.user.clubId,
  tactic0 = FM.S.user.tactic;

// (the world is put back now and then, which makes new objects: clubs are kept by id)
const clubs = Object.values(FM.S.clubs).filter((c) => c.sim === 'full');
let rs = seed * 7919;
const rnd = () => {
  rs = (Math.imul(rs, 1664525) + 1013904223) | 0;
  return (rs >>> 0) / 4294967296;
};
// Clubs that are close in strength make the middle of the table; a draw from all pairs would be mostly mismatches, so half the
// pairs are chosen among the near neighbours by reputation
const byRep = clubs
  .slice()
  .sort((a, b) => a.rep - b.rep)
  .map((c) => c.id);
const pair = () => {
  const i = Math.floor(rnd() * byRep.length);
  const j =
    rnd() < 0.5
      ? Math.min(byRep.length - 1, Math.max(0, i + Math.round((rnd() - 0.5) * 120)))
      : Math.floor(rnd() * byRep.length);
  return i === j ? pair() : [FM.S.clubs[byRep[i]], FM.S.clubs[byRep[j]]];
};

const strength = (c, user) =>
  U.avg(W.pickXI(c.id, user ? FM.S.user.tactic : c.tactic || W.aiTactic(c)).xi.filter(Boolean), (p) => p.ca);

function sample(mode) {
  const [x, y] = pair();
  // "me" is the side the chance is shown for; the home side or the away side
  const meHome = rnd() < 0.6;
  const home = meHome ? x : y,
    away = meHome ? y : x,
    me = x;
  const opp = y;
  const meIsHome = home === me;
  if (mode !== 'quick') {
    FM.S.user.clubId = me.id;
    FM.S.user.tactic = me.tactic || W.aiTactic(me);
  } else {
    FM.S.user.clubId = user0;
    FM.S.user.tactic = tactic0;
  }
  const us = strength(me, mode !== 'quick'),
    them = strength(opp, false);
  const derby = me.rival === opp.id;
  const p = Sea.matchOdds(me, opp, meIsHome, us, them, false, derby);
  const fx = { h: home.id, a: away.id, comp: home.comp };
  let m;
  if (mode === 'quick') m = FM.quickSim(fx, false);
  else {
    m = new FM.Match({
      ...fx,
      knockout: false,
      neutral: false,
      live: mode === 'watched',
      track: true,
      ...FM.Match.tieOpts(fx),
    });
    while (!m.finished) m.step();
  }
  const r = m.result();
  const won = meIsHome ? r.hg > r.ag : r.ag > r.hg;
  return { p, won, draw: r.hg === r.ag, home: meIsHome };
}

const snap = JSON.stringify(FM.S);
const restore = () => {
  FM.S = FM.Save.relink(JSON.parse(snap));
  W.rosterVer++;
};
const BIN = 0.1;
const out = [];
let failed = false;
const t0 = Date.now();
for (const mode of MODES) {
  const rows = [];
  for (let i = 0; i < N; i++) {
    rows.push(sample(mode));
    if (i % 250 === 249) {
      // (a match leaves marks on the players who played it: put the world back so no club is worn out by being drawn often)
      restore();
    }
  }
  // bins of 10 points, centred on 20, 30 … 80
  const bins = new Map();
  for (const r of rows) {
    const k = Math.min(8, Math.max(1, Math.round(r.p / BIN)));
    if (!bins.has(k)) bins.set(k, { n: 0, won: 0, p: 0 });
    const b = bins.get(k);
    b.n++;
    b.won += r.won ? 1 : 0;
    b.p += r.p;
  }
  const brier = rows.reduce((t, r) => t + (r.p - (r.won ? 1 : 0)) ** 2, 0) / rows.length;
  let excess = 0;
  console.log(
    `\n${mode.toUpperCase()}: ${rows.length} matches (${rows.filter((r) => r.home).length} with the chance shown for the home side)`,
  );
  console.log('  shown     matches   won     gap');
  for (const k of [...bins.keys()].sort((a, b) => a - b)) {
    const b = bins.get(k),
      shown = (100 * b.p) / b.n,
      obs = (100 * b.won) / b.n,
      se = 100 * Math.sqrt(((b.won / b.n) * (1 - b.won / b.n)) / b.n);
    excess += Math.max(0, Math.abs(obs - shown) - 1.96 * se) * b.n;
    console.log(
      `  ${shown.toFixed(1).padStart(5)}%   ${String(b.n).padStart(6)}   ${obs.toFixed(1).padStart(5)}%  ${(obs - shown >= 0 ? '+' : '') + (obs - shown).toFixed(1)} (±${(1.96 * se).toFixed(1)})`,
    );
    if (b.n >= 60) {
      const tol = Math.max(6, 2 * 1.96 * se);
      const ok = Math.abs(obs - shown) <= tol;
      if (!ok) failed = true;
      out.push(
        `${ok ? '✓' : '✗'} Win rate when ${k * 10}% is shown (${mode})   ${obs.toFixed(1)}   real ${Math.max(0, k * 10 - Math.round(tol))}–${k * 10 + Math.round(tol)}`,
      );
    }
  }
  // (sampling noise is taken out: a gap inside a bin's own margin of error does not count)
  const meanExcess = excess / rows.length;
  const okGap = meanExcess <= 2;
  if (!okGap) failed = true;
  out.push(
    `${okGap ? '✓' : '✗'} Gap between shown chance and results beyond chance (${mode})   ${meanExcess.toFixed(1)}   real 0–2`,
  );
  const shownAll = (100 * rows.reduce((t, r) => t + r.p, 0)) / rows.length,
    wonAll = (100 * rows.filter((r) => r.won).length) / rows.length;
  const tolAll = Math.max(2, 2 * 100 * Math.sqrt(0.2 / rows.length));
  const okAll = Math.abs(shownAll - wonAll) <= tolAll;
  if (!okAll) failed = true;
  out.push(
    `${okAll ? '✓' : '✗'} Wins above the chance shown, all matches (${mode})   ${(wonAll - shownAll).toFixed(1)}   real ${(-tolAll).toFixed(1)}–${tolAll.toFixed(1)}`,
  );
  out.push(`· Brier score (${mode})   ${brier.toFixed(3)}   real 0–0.25`);
  const draws = rows.filter((r) => r.draw).length;
  out.push(`· Draws (${mode})   ${((100 * draws) / rows.length).toFixed(1)}   real 15–35`);
}
console.log('\n' + out.join('\n'));
console.log(
  `\n${out.filter((l) => l[0] === '✓').length}/${out.filter((l) => /^[✓✗]/.test(l)).length} in range · ${Math.round((Date.now() - t0) / 1000)} s`,
);
if (failed) {
  console.error('FAIL: the chance shown on the matchday screen does not match the results.');
  process.exit(1);
}
console.log('All checks passed');
