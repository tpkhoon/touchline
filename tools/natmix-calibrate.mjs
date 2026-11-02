// Nationality calibration: how many of each league's players are foreign, from where, how varied a squad is, how it changes with age and
// position, whether every nation has enough players for a national team, and (with --seasons) whether the mix drifts over a long save.
// Nothing is tuned here; it measures, so changes to how squads are made and how the market moves players can be judged.
//   node tools/natmix-calibrate.mjs [--seed 5] [--seasons 0] [--json]
//   --seasons 20   plays 20 seasons of the world on its own (every league at the quick tier) and reports the drift of each top flight's foreign share
// The target shares below are ROUGH figures from general knowledge (the big leagues' foreign share in recent seasons), to be replaced by
// the CIES Football Observatory or Transfermarkt figures; a league with no target is measured but not judged.
import { parseArgs, loadSim } from './harness.mjs';

const args = parseArgs();
const SEED = +(args.seed || 5),
  SEASONS = +(args.seasons || 0);
const { FM } = loadSim(SEED);
const W = FM.W,
  D = FM.D,
  U = FM.U;
const sims = Object.fromEntries(D.LEAGUES.map((l) => [l.id, 'minimal']));
W.newWorld({ ...W.REAL_RULES, sims });
FM.Season.init();
W.newManager('Observer', 38, 'ENG');
if (!FM.S.staffPool) W.refreshStaffPool();
W.goUnemployed('start');
const S = () => FM.S;

// league id -> [low, high] share of foreign players in the first-team squads (rough)
const TARGETS = {
  D1: [0.58, 0.7],
  ES1: [0.35, 0.47],
  DE1: [0.45, 0.58],
  IT1: [0.5, 0.64],
  FR1: [0.4, 0.52],
  PT1: [0.55, 0.68],
  NL1: [0.35, 0.5],
  BR1: [0.05, 0.16],
  JP1: [0.08, 0.2],
  AR1: [0.05, 0.16],
  US1: [0.3, 0.5],
  TR1: [0.35, 0.5],
  BE1: [0.5, 0.65],
  SC1: [0.4, 0.58],
};

const posGroup = (p) => D.POS_GROUP[p.pos];
const firstTeam = (c) => W.squad(c.id).filter((p) => !p.team);
// all the numbers at this moment
function measure() {
  const comps = W.leagues().filter((l) => l.clubs && l.clubs.length);
  const leagues = {};
  const age = { '≤21': [0, 0], '22-25': [0, 0], '26-30': [0, 0], '31+': [0, 0] },
    pos = { GK: [0, 0], DEF: [0, 0], MID: [0, 0], ATT: [0, 0] };
  const variety = {}; // tier -> { squads, distinct, maxOne }
  for (const l of comps) {
    const L = (leagues[l.id] = {
      name: l.name,
      tier: l.tier,
      nat: l.nat,
      n: 0,
      foreign: 0,
      origins: {},
      squads: 0,
      distinct: 0,
      maxOne: 0,
      maxOneWorst: 0,
    });
    for (const id of l.clubs) {
      const c = S().clubs[id];
      if (!c) continue;
      const sq = firstTeam(c);
      if (!sq.length) continue;
      const nats = {};
      for (const p of sq) {
        L.n++;
        const f = p.nat !== c.nat;
        if (f) {
          L.foreign++;
          L.origins[p.nat] = (L.origins[p.nat] || 0) + 1;
        }
        nats[p.nat] = (nats[p.nat] || 0) + 1;
        if (l.tier === 1) {
          const a = W.age(p),
            k = a <= 21 ? '≤21' : a <= 25 ? '22-25' : a <= 30 ? '26-30' : '31+';
          age[k][0] += f ? 1 : 0;
          age[k][1]++;
          pos[posGroup(p)][0] += f ? 1 : 0;
          pos[posGroup(p)][1]++;
        }
      }
      const foreignNats = Object.entries(nats).filter(([n]) => n !== c.nat);
      const maxOne = foreignNats.reduce((m, [, v]) => Math.max(m, v), 0);
      L.squads++;
      L.distinct += Object.keys(nats).length;
      L.maxOne += maxOne;
      L.maxOneWorst = Math.max(L.maxOneWorst, maxOne);
      const V = (variety[l.tier] = variety[l.tier] || { squads: 0, distinct: 0, maxOne: 0, worst: 0, lo: 99, hi: 0 });
      V.squads++;
      V.distinct += Object.keys(nats).length;
      V.maxOne += maxOne;
      V.worst = Math.max(V.worst, maxOne);
      V.lo = Math.min(V.lo, Object.keys(nats).length);
      V.hi = Math.max(V.hi, Object.keys(nats).length);
    }
  }
  return { leagues, age, pos, variety };
}

// ---- national-team depth: players of each nation, and how strong the pool is ----
function depth() {
  const by = {};
  for (const p of Object.values(S().players)) if (!p.retired && W.age(p) >= 17) (by[p.nat] ||= []).push(p);
  const rows = Object.keys(D.NATIONS)
    .filter((c) => D.nationOn(c))
    .map((code) => {
      const l = (by[code] || []).sort((a, b) => b.ca - a.ca);
      return { code, n: l.length, top11: l.length ? U.avg(l.slice(0, 11), (p) => p.ca) : 0 };
    });
  return rows;
}

const start = measure();
const startDepth = depth();
let end = null,
  endDepth = null;
const drift = [];
if (SEASONS > 0) {
  let seasons = 0,
    days = 0;
  const t0 = Date.now();
  while (seasons < SEASONS && days < SEASONS * 400) {
    const sum = FM.Season.advance(null);
    days++;
    if (!sum) continue;
    seasons++;
    if (seasons % 5 === 0 || seasons === SEASONS) {
      const m = measure();
      drift.push([
        seasons,
        Object.fromEntries(
          Object.entries(m.leagues)
            .filter(([, L]) => L.tier === 1)
            .map(([id, L]) => [id, L.n ? L.foreign / L.n : 0]),
        ),
      ]);
      // (each checkpoint prints its own drift, so a run stopped early still tells what it found)
      const d = Object.entries(m.leagues)
        .filter(([id, L]) => L.tier === 1 && L.n && start.leagues[id] && start.leagues[id].n)
        .map(([id, L]) => [id, (L.foreign / L.n - start.leagues[id].foreign / start.leagues[id].n) * 100])
        .sort((x, y) => Math.abs(y[1]) - Math.abs(x[1]));
      process.stderr.write(
        `season ${seasons} done (${Math.round((Date.now() - t0) / 1000)}s): ${d.filter((x) => Math.abs(x[1]) > 5).length} of ${d.length} top flights moved more than 5 points; the largest ${d
          .slice(0, 6)
          .map(([id, v]) => `${id} ${v >= 0 ? '+' : ''}${v.toFixed(1)}`)
          .join(' ')}\n`,
      );
    }
  }
  end = measure();
  endDepth = depth();
}

// ---- the report ----
const pct = (a, b) => (b ? Math.round((a / b) * 1000) / 10 : 0);
const lines = [];
const say = (t) => lines.push(t);
const top = (L, n = 5) =>
  Object.entries(L.origins)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k, v]) => `${k} ${pct(v, L.n)}%`)
    .join(' ');
say(
  `Nationality calibration: seed ${SEED}${SEASONS ? `, ${SEASONS} seasons played` : ', at the start of a new world'}\n`,
);
say('Foreign share of first-team squads, top flights (target figures are rough and unchecked)');
const tier1 = Object.entries(start.leagues)
  .filter(([, L]) => L.tier === 1 && L.n)
  .sort((a, b) => b[1].foreign / b[1].n - a[1].foreign / a[1].n);
let judged = 0,
  inRange = 0;
// (the leagues with a target, the ten with the most foreign players and the five with the fewest; --all lists every one)
const shown = new Set(
  tier1.filter(([id], i) => 'all' in args || TARGETS[id] || i < 10 || i >= tier1.length - 5).map(([id]) => id),
);
for (const [id, L] of tier1) {
  if (!shown.has(id)) continue;
  const sh = L.foreign / L.n,
    t = TARGETS[id];
  let flag = '';
  if (t) {
    judged++;
    if (sh >= t[0] && sh <= t[1]) inRange++;
    flag =
      sh < t[0]
        ? `  LOW (target ${Math.round(t[0] * 100)}-${Math.round(t[1] * 100)}%)`
        : sh > t[1]
          ? `  HIGH (target ${Math.round(t[0] * 100)}-${Math.round(t[1] * 100)}%)`
          : `  ok (${Math.round(t[0] * 100)}-${Math.round(t[1] * 100)}%)`;
  }
  say(
    `  ${id.padEnd(5)} ${(L.name || '').slice(0, 30).padEnd(30)} ${String(pct(L.foreign, L.n)).padStart(5)}%  ${top(L, 4)}${flag}`,
  );
}
say(`  ${inRange} of the ${judged} leagues with a target are in range`);

say('\nForeign share by tier of each nation (lower divisions should be more domestic)');
const byNat = {};
for (const L of Object.values(start.leagues)) (byNat[L.nat] ||= {})[L.tier] = L;
let tierOk = 0,
  tierBad = [];
for (const [nat, t] of Object.entries(byNat)) {
  const tiers = Object.keys(t)
    .map(Number)
    .sort((a, b) => a - b);
  if (tiers.length < 3) continue;
  const sh = tiers.map((k) => (t[k].n ? t[k].foreign / t[k].n : 0));
  const ok = sh.every((v, i) => i === 0 || v <= sh[i - 1] + 0.03);
  ok ? tierOk++ : tierBad.push(`${nat} ${sh.map((v) => Math.round(v * 100)).join('/')}`);
}
say(
  `  ${tierOk} nations with three or more divisions fall steadily; the exceptions: ${tierBad.slice(0, 8).join(', ') || 'none'}`,
);

say(
  "\nA squad's variety by tier (nationalities in a first-team squad; real top flights 8-15, lower leagues 3-6) and the most from one foreign country",
);
for (const k of Object.keys(start.variety)
  .sort((a, b) => a - b)
  .slice(0, 5)) {
  const V = start.variety[k];
  const avg = V.distinct / V.squads;
  const real = k == 1 ? [8, 15] : [3, 6];
  say(
    `  tier ${k}: ${avg.toFixed(1)} nationalities a squad (range ${V.lo}-${V.hi}) ${k <= 2 ? (avg < real[0] ? 'LOW' : avg > real[1] ? 'HIGH' : 'ok') : ''}; most from one foreign country ${(V.maxOne / V.squads).toFixed(1)} on average, ${V.worst} at worst`,
  );
}

// (the real range of 8-15 is for the leagues with a lot of foreign players; the others have fewer nationalities)
const lots = tier1.filter(([, L]) => L.foreign / L.n >= 0.45),
  few1 = tier1.filter(([, L]) => L.foreign / L.n < 0.45);
const vAvg = (list) => (list.length ? list.reduce((t, [, L]) => t + L.distinct / L.squads, 0) / list.length : 0);
say(
  `  top flights with 45% or more foreign players (${lots.length}): ${vAvg(lots).toFixed(1)} nationalities a squad [real 8-15] ${vAvg(lots) < 8 ? 'LOW' : 'ok'}; the others (${few1.length}): ${vAvg(few1).toFixed(1)} [real about 5-9]`,
);
say('\nTop-flight foreign share by age and by position');
say(
  '  age:      ' +
    Object.entries(start.age)
      .map(([k, [f, n]]) => `${k} ${pct(f, n)}%`)
      .join('   ') +
    '   [real: rises from the young to the prime years, then falls]',
);
say(
  '  position: ' +
    Object.entries(start.pos)
      .map(([k, [f, n]]) => `${k} ${pct(f, n)}%`)
      .join('   ') +
    '   [real: goalkeepers the most domestic]',
);

say('\nNational-team depth (players of each nation, aged 17 or more)');
const few = startDepth.filter((r) => r.n < 23).sort((a, b) => a.n - b.n);
const ranked = startDepth.slice().sort((a, b) => b.top11 - a.top11);
say(
  `  nations with fewer than 23 players: ${few.length}${
    few.length
      ? ' (' +
        few
          .slice(0, 8)
          .map((r) => `${r.code} ${r.n}`)
          .join(', ') +
        ')'
      : ''
  }`,
);
say(
  `  strongest pools (top eleven's average ability): ${ranked
    .slice(0, 8)
    .map((r) => `${r.code} ${r.top11.toFixed(0)}`)
    .join(' ')}`,
);
const smallStrong = startDepth.filter((r) => r.n >= 1 && r.n < 60 && r.top11 > ranked[19].top11);
say(
  `  small nations (under 60 players) with a pool stronger than the 20th best: ${smallStrong.length}${smallStrong.length ? ' (' + smallStrong.map((r) => `${r.code} ${r.n} players, ${r.top11.toFixed(0)}`).join(', ') + ')' : ''}`,
);

if (SEASONS > 0) {
  say(
    `\nDrift of each top flight's foreign share over ${SEASONS} seasons (percentage points from the start; more than 5 is flagged)`,
  );
  const rows = tier1.map(([id, L]) => {
    const now = end.leagues[id];
    const d = now && now.n ? (now.foreign / now.n - L.foreign / L.n) * 100 : 0;
    return [id, d];
  });
  rows
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 12)
    .forEach(([id, d]) =>
      say(`  ${id.padEnd(5)} ${d >= 0 ? '+' : ''}${d.toFixed(1)}${Math.abs(d) > 5 ? '  DRIFT' : ''}`),
    );
  say(`  ${rows.filter((r) => Math.abs(r[1]) > 5).length} of ${rows.length} top flights drifted more than 5 points`);
  say(
    `  national pools after ${SEASONS} seasons: ${endDepth.filter((r) => r.n < 23).length} nations under 23 players (${few.length} at the start)`,
  );
}
console.log(lines.join('\n'));
if (args.json !== undefined) console.log(JSON.stringify({ start: start.leagues, drift }, null, 1));
