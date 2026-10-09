// 30-year stability test: does the world stay believable over decades?
//   node tools/longrun.mjs [--seasons 30] [--seed 5] [--tier minimal|light] [--check]     (npm run test:longrun)
// Plays the world on its own (the manager is out of work), with every league at the quick tier, and measures how clubs' standing
// changes: how much of the pecking order survives, whether small clubs become giants or giants vanish without a cause, how long
// a dynasty lasts, and whether any club leaves the bounds its market sets. Improbable things may happen, but they need causes.
// Without --check it only reports.
import { parseArgs, loadSim } from './harness.mjs';

const args = parseArgs();
const SEASONS = +(args.seasons || 30),
  SEED = +(args.seed || 5),
  TIER = args.tier || 'minimal';
const { FM } = loadSim(SEED);
const W = FM.W,
  D = FM.D;
const sims = Object.fromEntries(D.LEAGUES.map((l) => [l.id, TIER]));
W.newWorld({ ...W.REAL_RULES, sims });
FM.Season.init();
W.newManager('Observer', 38, 'ENG');
if (!FM.S.staffPool) W.refreshStaffPool();
W.goUnemployed('start');

const S0 = () => FM.S;
const clubs = () => Object.values(S0().clubs).filter((c) => c.comp && c.sim !== 'nation');
const start = Object.fromEntries(
  clubs().map((c) => [c.id, { rep: c.rep, comp: c.comp, tier: S0().comps[c.comp].tier, nat: c.nat }]),
);
const ids = Object.keys(start);
const rank = (vals) => {
  const o = vals.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);
  const r = new Array(vals.length);
  o.forEach(([, i], k) => (r[i] = k));
  return r;
};
const spearman = (a, b) => {
  const ra = rank(a),
    rb = rank(b),
    n = a.length,
    ma = (n - 1) / 2;
  let num = 0,
    da = 0,
    db = 0;
  for (let i = 0; i < n; i++) {
    num += (ra[i] - ma) * (rb[i] - ma);
    da += (ra[i] - ma) ** 2;
    db += (rb[i] - ma) ** 2;
  }
  return num / Math.sqrt(da * db);
};
const startRank = Object.fromEntries(ids.map((id, i) => [id, i]));
const byRep = [...ids].sort((a, b) => start[b].rep - start[a].rep);
const top20 = byRep.slice(0, 20),
  top10 = byRep.slice(0, 10);

const champs = {}; // league -> [champion ids by season]
const relegations = {},
  admins = {};
const log = [];
let seasons = 0,
  days = 0;
const t0 = Date.now();
const snap = (label) => {
  const cur = ids.map((id) => S0().clubs[id].rep);
  const rho = spearman(
    ids.map((id) => start[id].rep),
    cur,
  );
  const nowRank = [...ids].sort((a, b) => S0().clubs[b].rep - S0().clubs[a].rep);
  const pos = Object.fromEntries(nowRank.map((id, i) => [id, i]));
  log.push({ label, rho, top20kept: top20.filter((id) => pos[id] < 60).length });
};
while (seasons < SEASONS && days < SEASONS * 400) {
  const sum = FM.Season.advance(null);
  days++;
  if (!sum) continue;
  seasons++;
  const e = S0().archive[S0().archive.length - 1];
  for (const [cid, c] of Object.entries(e.comps || {}))
    if (c.champion) (champs[cid] = champs[cid] || []).push(c.champion);
  (e.relegated || []).forEach((id) => (relegations[id] = (relegations[id] || 0) + 1));
  clubs().forEach((c) => c.admin && (admins[c.id] = true));
  if (seasons % 10 === 0 || seasons === SEASONS) snap(`year ${seasons}`);
  if (seasons % 5 === 0) console.log(`  … ${seasons} seasons, ${Math.round((Date.now() - t0) / 1000)}s`);
}

// ---- measures ----
const endRep = (id) => S0().clubs[id].rep;
const med = (xs) => xs.slice().sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const medOf = Object.fromEntries(
  D.LEAGUES.map((l) => [l.id, med(ids.filter((id) => start[id].comp === l.id).map((id) => start[id].rep))]),
);
const endTop = [...ids].sort((a, b) => endRep(b) - endRep(a)).slice(0, Math.ceil(ids.length * 0.03));
const upstarts = endTop.filter((id) => start[id].rep < medOf[start[id].comp] && start[id].tier >= 1);
const fallen = top10.filter((id) => endRep(id) < medOf[start[id].comp]);
const unexplained = fallen.filter((id) => !admins[id] && (relegations[id] || 0) < 2);
let longest = 0,
  longestIn = '';
for (const [lid, list] of Object.entries(champs)) {
  let run = 1;
  for (let i = 1; i < list.length; i++) {
    run = list[i] === list[i - 1] ? run + 1 : 1;
    if (run > longest) ((longest = run), (longestIn = lid));
  }
  if (list.length === 1 && longest < 1) longest = 1;
}
const outOfBounds = clubs().filter((c) => {
  const a = c.attr;
  return (
    a &&
    (c.rep > Math.max(a.ceil, start[c.id] ? start[c.id].rep : 0) + 0.01 ||
      c.rep < Math.min(a.floor, start[c.id] ? start[c.id].rep : 99) - 6)
  );
});
const bigMovers = ids.filter((id) => Math.abs(endRep(id) - start[id].rep) > 25);
const tierMean = (t, f) => {
  const xs = ids.filter((id) => start[id].tier === t).map(f);
  return xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
};

console.log(
  `\nWorld stability · ${SEASONS} seasons, seed ${SEED}, ${TIER} tier, ${Math.round((Date.now() - t0) / 1000)}s\n`,
);
for (const l of log)
  console.log(
    `${l.label}: ranking correlation with the start ${l.rho.toFixed(2)} · ${l.top20kept} of the 20 biggest clubs still in the top 60`,
  );
console.log(
  `Small clubs that reached the top 3% of the world: ${upstarts.length} (${upstarts.map((id) => `${S0().clubs[id].short} ${start[id].rep}→${Math.round(endRep(id))}`).join(', ') || 'none'})`,
);
console.log(
  `Top-10 clubs that fell below their league's median: ${fallen.length}, without an administration or two relegations: ${unexplained.length}`,
);
console.log(`Longest run of titles in one league: ${longest}${longestIn ? ` (${longestIn})` : ''}`);
console.log(`Clubs that moved more than 25 reputation points: ${bigMovers.length} of ${ids.length}`);
console.log(`Clubs outside the bounds their market sets: ${outOfBounds.length}`);
console.log(
  `Mean reputation by tier, start → end: ${[1, 2, 3, 4].map((t) => `${t}: ${tierMean(t, (id) => start[id].rep).toFixed(1)}→${tierMean(t, endRep).toFixed(1)}`).join(' · ')}`,
);
console.log(`Administrations: ${Object.keys(admins).length}`);

if ('check' in args) {
  const fails = [];
  const last = log[log.length - 1];
  if (last.rho < 0.6) fails.push(`the pecking order is gone (correlation ${last.rho.toFixed(2)})`);
  if (last.rho > 0.96) fails.push(`nothing ever changes (correlation ${last.rho.toFixed(2)})`);
  if (upstarts.length > 3) fails.push(`${upstarts.length} small clubs became giants`);
  if (unexplained.length > 0) fails.push(`${unexplained.length} giants fell with no cause`);
  if (longest > 15) fails.push(`a ${longest}-title dynasty`);
  if (outOfBounds.length) fails.push(`${outOfBounds.length} clubs out of bounds`);
  console.log(fails.length ? '\n' + fails.map((f) => '✗ ' + f).join('\n') : '\nThe world stays believable.');
  process.exit(fails.length ? 1 : 0);
}
