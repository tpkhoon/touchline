// Economy report: are player values, wages and transfer budgets in proportion to what clubs earn, and do they stay so over
// the years? The world is fictional, so the amounts do not have to match real football: the relationships do. Plays the world on
// its own for some seasons (your club takes part) and reports, from the first season and over the run:
//   - squad value against revenue, for the top clubs and the middle ones (real top squads: one to two and a half years of income)
//   - the most valuable player against the richest club's revenue (a record fee is a fraction of what the richest club earns)
//   - wages against revenue, by league, and the clubs far over the limit
//   - transfer spending against revenue, and whether completed fees stay close to the players' values
//   - how value changes with age and contract (no overnight cliffs), and with position (attackers sell for more)
//   - the same player's wage in a rich league and a poor one
//   - drift: whether average values and wages rise or fall over the seasons, and clubs going into administration
//   node tools/economy.mjs [--seasons 3] [--seed 7] [--list 12]
// Prints a table per top-flight league and the measures the dashboard keeps (✓ in range, ✗ out), exit 1 when one is out.
import { parseArgs, loadSim } from './harness.mjs';

const args = parseArgs();
const SEASONS = +(args.seasons || 3),
  seed = +(args.seed || 7);
const { FM } = loadSim(seed);
const { W, U, D, Season: Sea } = FM;
W.newWorld(W.REAL_RULES);
Sea.init();
W.takeCharge(Object.values(FM.S.clubs).find((c) => c.comp === 'D1' && c.rep < 70).id, 'Economy Manager');

// completed transfers: the fee against the player's value the moment before
const fees = []; // { year, to: club id, fee, value }
const exec = FM.Transfers.execute;
FM.Transfers.execute = function (p, toId, fee) {
  if (fee > 0) fees.push({ year: FM.S.year, to: toId, fee, value: p.value || W.value(p) });
  return exec.apply(this, arguments);
};
let admins = 0;
const news = FM.News.add;
FM.News.add = function (n) {
  if (n && /enter administration/.test(n.title || '')) admins++;
  return news.apply(this, arguments);
};

const med = (a) => (a.length ? a.slice().sort((x, y) => x - y)[a.length >> 1] : 0);
const mean = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);
const M = (v) => (v / 1e6).toFixed(v >= 1e8 ? 0 : 1) + 'M';

// ---------- A snapshot of the economy ----------
function snapshot() {
  const S = FM.S;
  const rows = [];
  for (const comp of W.leagues()) {
    for (const id of comp.clubs) {
      const c = S.clubs[id];
      if (!c) continue;
      const sq = W.squad(id);
      const rev = FM.Finance.revenue(c);
      const val = sq.reduce((t, p) => t + (p.value || 0), 0);
      const wages = FM.Finance.wageBill(c);
      rows.push({
        id,
        comp: comp.id,
        tier: comp.tier,
        nat: c.nat,
        name: c.name,
        rep: c.rep,
        rev,
        val,
        wages,
        budget: c.budget || 0,
        best: Math.max(0, ...sq.map((p) => p.value || 0)),
        sim: c.sim,
        squad: sq.length,
      });
    }
  }
  const players = Object.values(S.players).filter((p) => !p.retired && p.clubId);
  return {
    year: S.year,
    rows,
    // (what a player of a given ability is worth and paid, so that a change in the players themselves does not read as inflation)
    meanValue: mean(players.filter((p) => p.ca >= 60).map((p) => (p.value || 0) / (1000 * Math.pow(1.13, p.ca)))),
    meanWage: mean(players.filter((p) => p.ca >= 60).map((p) => (p.wage || 0) / (1000 * Math.pow(1.13, p.ca)))),
    // what the value is made of, so a drift can be traced to its part
    parts: (() => {
      const d = players.filter((p) => p.ca >= 60 && p.clubId);
      return {
        market: mean(d.map((p) => W.marketFactor(p))),
        contract: mean(d.map((p) => W.contractFactor(p))),
        ageYouth: mean(d.map((p) => W.abilityValue(p) / (1000 * Math.pow(1.13, p.ca)))),
        demand: mean(d.map((p) => W.interestFactor(p) * W.formFactor(p))),
        paidVsGoing: mean(d.map((p) => (p.wage || 0) / Math.max(1, W.wageFor(p)))),
        stale: mean(d.map((p) => Math.abs((p.value || 0) / W.value(p) - 1))),
      };
    })(),
    meanCA: mean(players.filter((p) => p.ca >= 60).map((p) => p.ca)),
    meanAge: mean(players.filter((p) => p.ca >= 60).map((p) => W.age(p))),
  };
}

// ---------- Play ----------
const snaps = [snapshot()];
const startYear = FM.S.year;
let guard = 4000;
while (FM.S.year < startYear + SEASONS && guard-- > 0) {
  const y = FM.S.year;
  const fx = Sea.userFixture();
  if (fx && !FM.S.user.sacked) Sea.applyUserMatch(FM.quickSim(fx, !!fx.ko));
  Sea.advance(null);
  if (!W.employed() && FM.S.user.offers && FM.S.user.offers.length)
    W.takeCharge(FM.S.user.offers[0].id, 'Economy Manager', false);
  if (FM.S.year !== y) {
    snaps.push(snapshot());
    console.log(`  season ${y} played`);
  }
}

// ---------- Report ----------
const out = [];
const check = (ok, name, v, lo, hi) =>
  out.push(
    `${ok ? '✓' : '✗'} ${name}   ${typeof v === 'number' ? +v.toFixed(2) : v}   real ${lo}–${hi == null ? '' : hi}`,
  );
const inRange = (name, v, lo, hi) => check(v >= lo && (hi == null || v <= hi), name, v, lo, hi);

const s0 = snaps[0],
  sN = snaps[snaps.length - 1];
const top = (rows) => rows.filter((r) => r.tier === 1 && r.sim !== 'minimal');
console.log(`\nTop flights at the start (${s0.year}): amounts in the game's own money`);
console.log('  league  revenue   richest club (revenue · squad value · wages)   best player · budget');
const byLeague = new Map();
for (const r of top(s0.rows)) {
  if (!byLeague.has(r.comp)) byLeague.set(r.comp, []);
  byLeague.get(r.comp).push(r);
}
const listN = +(args.list || 12);
const leagueRows = [...byLeague.entries()]
  .map(([id, rs]) => ({ id, rs, rev: rs.reduce((t, r) => t + r.rev, 0) }))
  .sort((a, b) => b.rev - a.rev);
for (const { id, rs, rev } of leagueRows.slice(0, listN)) {
  const rich = rs.slice().sort((a, b) => b.rev - a.rev)[0];
  const best = Math.max(...rs.map((r) => r.best));
  console.log(
    `  ${id.padEnd(6)} ${M(rev).padStart(7)}   ${rich.name.slice(0, 22).padEnd(22)} ${M(rich.rev).padStart(6)} · ${M(rich.val).padStart(6)} (${(rich.val / rich.rev).toFixed(1)}×) · ${M(rich.wages).padStart(6)} (${Math.round((100 * rich.wages) / rich.rev)}%)   ${M(best)} · ${M(rich.budget)}`,
  );
}

const measure = (snap, label) => {
  const T = top(snap.rows);
  const sortedByRev = T.slice().sort((a, b) => b.rev - a.rev);
  const topClubs = sortedByRev.slice(0, 20);
  const richest = sortedByRev[0];
  const bestAll = Math.max(...T.map((r) => r.best));
  const ratios = T.map((r) => r.val / r.rev);
  const wr = T.map((r) => r.wages / r.rev);
  const all = snap.rows.filter((r) => r.sim !== 'minimal');
  return {
    label,
    topSquad: med(topClubs.map((r) => r.val / r.rev)),
    midSquad: med(ratios),
    richestSquad: richest.val / richest.rev,
    bestVsRich: bestAll / richest.rev,
    wageMed: med(wr),
    wageLo: med(wr) && wr.slice().sort((a, b) => a - b)[Math.floor(wr.length * 0.1)],
    wageHi: wr.slice().sort((a, b) => a - b)[Math.floor(wr.length * 0.9)],
    over100: (100 * all.filter((r) => r.wages > r.rev).length) / all.length,
    budgetShare: med(T.map((r) => r.budget / r.rev)),
  };
};
const m0 = measure(s0, 'start'),
  mN = measure(sN, 'end');
console.log(
  `\nStart: top squads ${m0.topSquad.toFixed(2)}× revenue, middle ${m0.midSquad.toFixed(2)}×, best player ${(100 * m0.bestVsRich).toFixed(0)}% of the richest club's revenue, wages ${(100 * m0.wageMed).toFixed(0)}% of revenue (10th–90th ${(100 * m0.wageLo).toFixed(0)}–${(100 * m0.wageHi).toFixed(0)}%)`,
);
console.log(
  `End:   top squads ${mN.topSquad.toFixed(2)}× revenue, middle ${mN.midSquad.toFixed(2)}×, best player ${(100 * mN.bestVsRich).toFixed(0)}% of the richest club's revenue, wages ${(100 * mN.wageMed).toFixed(0)}% of revenue`,
);

const tierMed = (snap, t) =>
  med(snap.rows.filter((r) => r.tier === t && r.sim !== 'minimal').map((r) => r.wages / r.rev));
console.log(
  `Wages / revenue by tier, start → end: ${[1, 2, 3, 4].map((t) => `tier ${t} ${Math.round(100 * tierMed(s0, t))}% → ${Math.round(100 * tierMed(sN, t))}%`).join(' · ')}`,
);
// what a tier's wage bill is made of, to trace a drift: revenue, squad size, wage per player (medians)
for (const t of [2, 3]) {
  const f = (snap, k, g = (r) => r[k]) => med(snap.rows.filter((r) => r.tier === t && r.sim !== 'minimal').map(g));
  console.log(
    `Tier ${t}, start → end: reputation ${f(s0, 'rep').toFixed(0)} → ${f(sN, 'rep').toFixed(0)} · revenue ${M(f(s0, 'rev'))} → ${M(f(sN, 'rev'))} · squad ${f(s0, 'squad')} → ${f(sN, 'squad')} · wage per player ${(f(s0, 'wages') / f(s0, 'squad') / 43 / 1000).toFixed(1)}k → ${(f(sN, 'wages') / f(sN, 'squad') / 43 / 1000).toFixed(1)}k a week`,
  );
}
// wage ratio by league, across every tier: the extremes
const byL = new Map();
for (const r of snaps[snaps.length - 1].rows.filter((r) => r.sim !== 'minimal')) {
  if (!byL.has(r.comp)) byL.set(r.comp, []);
  byL.get(r.comp).push(r.wages / r.rev);
}
const wl = [...byL.entries()].map(([id, a]) => [id, med(a)]).sort((a, b) => a[1] - b[1]);
console.log(
  `Wages / revenue by league: lowest ${wl
    .slice(0, 3)
    .map(([i, v]) => `${i} ${Math.round(v * 100)}%`)
    .join(', ')}; highest ${wl
    .slice(-3)
    .map(([i, v]) => `${i} ${Math.round(v * 100)}%`)
    .join(', ')}`,
);

inRange('Top clubs: squad value / revenue (years, start)', m0.topSquad, 1, 2.5);
inRange('Middle clubs: squad value / revenue (years, start)', m0.midSquad, 0.5, 2);
inRange('Richest club: squad value / revenue (years, start)', m0.richestSquad, 1, 3);
inRange('Most valuable player / richest club revenue (start)', m0.bestVsRich, 0, 0.5);
inRange('Top-flight clubs: wages / revenue, median (start)', m0.wageMed, 0.42, 0.75);
inRange('Top-flight clubs: wages / revenue, 90th percentile (start)', m0.wageHi, 0, 0.95);
// (prize money and cup runs come on top of the estimate, and owners of lower-league clubs do cover losses: some are over 100%, few by much)
inRange('Clubs with wages over revenue, all leagues (%, end)', mN.over100, 0, 8);
const richBudget = top(s0.rows)
  .sort((a, b) => b.rev - a.rev)
  .slice(0, 10);
inRange(
  'Richest ten clubs: transfer budget / the best player in their league (start)',
  med(
    richBudget.map(
      (r) =>
        r.budget /
        Math.max(
          1,
          ...top(s0.rows)
            .filter((x) => x.comp === r.comp)
            .map((x) => x.best),
        ),
    ),
  ),
  0.5,
  2,
);
inRange('Transfer budget / revenue, top-flight median (start)', m0.budgetShare, 0.08, 0.5);

// transfers: fees against values, and spending against revenue (per season, top flights)
const fr = fees.filter((f) => f.value > 0).map((f) => f.fee / f.value);
if (fr.length >= 30) inRange("Fee / the player's value, median", med(fr), 0.8, 1.3);
const spendBy = new Map();
for (const f of fees) {
  const c = FM.S.clubs[f.to];
  if (!c || !FM.S.comps[c.comp] || FM.S.comps[c.comp].tier !== 1) continue;
  spendBy.set(f.year, (spendBy.get(f.year) || 0) + f.fee);
}
const revTop = top(s0.rows).reduce((t, r) => t + r.rev, 0);
const spendShare = [...spendBy.values()].map((v) => v / revTop);
if (spendShare.length) {
  console.log(
    `Transfer fees paid by top-flight clubs: ${spendShare.map((v) => (100 * v).toFixed(0) + '% of revenue').join(', ')} (${fees.length} fees in all)`,
  );
  inRange('Transfer fees paid / revenue, top flights (% a season)', 100 * med(spendShare), 10, 50);
}

// ---------- Values by age, contract and position ----------
// a copy of an average starter, changed one thing at a time
const probe = (over) => {
  const base = Object.values(FM.S.players).find((p) => !p.retired && p.pos === 'CM' && p.ca >= 70 && p.clubId);
  const p = JSON.parse(JSON.stringify(base));
  p.born = FM.S.year - 25;
  p.contract = FM.S.year + 3;
  p.ca = 74;
  p.pa = 74;
  p.hid = { ...p.hid, cons: 10 };
  return Object.assign(p, over);
};
let worstAge = 0,
  worstAt = 0;
for (const ca of [60, 75, 85]) {
  let prev = null;
  for (let a = 17; a <= 38; a++) {
    const v = W.baseValue(
      probe({ born: FM.S.year - a, ca, pa: Math.max(ca, Math.min(90, ca + Math.max(0, 24 - a) * 2)) }),
    );
    if (prev) {
      const step = Math.abs(v / prev - 1);
      if (step > worstAge) ((worstAge = step), (worstAt = a));
    }
    prev = v;
  }
}
console.log(`Largest change in value from one age to the next: ${(100 * worstAge).toFixed(0)}% (at ${worstAt})`);
inRange('Largest one-year step in value with age (%)', 100 * worstAge, 0, 22);
const cv = [0, 1, 2, 3, 4].map((y) => W.baseValue(probe({ contract: FM.S.year + y })));
let worstC = 0;
for (let i = 1; i < cv.length; i++) worstC = Math.max(worstC, Math.abs(cv[i] / cv[i - 1] - 1));
console.log(`Value by years left on the contract (0 to 4): ${cv.map((v) => (v / cv[3]).toFixed(2)).join(' ')}`);
inRange('Largest step in value with contract length (%)', 100 * worstC, 0, 45);
const st = W.baseValue(probe({ pos: 'ST' })) * 1;
const gk = W.baseValue(probe({ pos: 'GK' }));
const stV = W.value(probe({ pos: 'ST' })),
  gkV = W.value(probe({ pos: 'GK' }));
console.log(
  `Same ability: a striker is worth ${(stV / gkV).toFixed(2)}× a goalkeeper (${(st / gk).toFixed(2)}× on the base)`,
);
inRange('Striker value / goalkeeper value, same ability', stV / gkV, 1.2, 2);

// wages: the same player in a rich league and a poor one, at a club of the same reputation
const mid = (id) =>
  Object.values(FM.S.clubs).find((c) => c.nat === id && c.rep >= 70 && c.rep <= 76 && c.sim === 'full');
const wageAt = (c) => {
  const p = probe({ clubId: c.id });
  return FM.Transfers.wageDemand ? FM.Transfers.wageDemand(p, c) : W.wageFor(p);
};
const ksa = mid('KSA'),
  kor = mid('KOR') || mid('JPN');
if (ksa && kor) {
  const r = wageAt(ksa) / wageAt(kor);
  console.log(
    `The same player's wage at a ${ksa.nat} club against a ${kor.nat} club of similar standing: ${r.toFixed(2)}×`,
  );
  inRange('Same player, wage in Saudi Arabia / in Korea or Japan', r, 1.3, 4);
}

// ---------- Drift ----------
if (snaps.length > 2) {
  const years = snaps.length - 1;
  const dv = Math.pow(sN.meanValue / s0.meanValue, 1 / years) - 1,
    dw = Math.pow(sN.meanWage / s0.meanWage, 1 / years) - 1;
  console.log(
    `Parts of a value, start → end: ${Object.keys(s0.parts)
      .map((k) => `${k} ${s0.parts[k].toFixed(2)} → ${sN.parts[k].toFixed(2)}`)
      .join(' · ')}`,
  );
  console.log(
    `Per season: value for a given ability ${(100 * dv).toFixed(1)}%, wage for a given ability ${(100 * dw).toFixed(1)}% (players of ability 60 or more: average ability ${s0.meanCA.toFixed(1)} → ${sN.meanCA.toFixed(1)}, average age ${s0.meanAge.toFixed(1)} → ${sN.meanAge.toFixed(1)})`,
  );
  inRange('Drift in the value of a given ability (% a season)', 100 * dv, -4, 4);
  inRange('Drift in the wage of a given ability (% a season)', 100 * dw, -4, 4);
}
// (a veteran's ability falls faster than his wage: the average rises a little and settles)
inRange('Wages paid against what the club pays for his ability (end)', sN.parts.paidVsGoing, 0.9, 1.5);
inRange('Clubs entering administration (a season)', admins / SEASONS, 0, 6);

console.log('\n' + out.join('\n'));
const bad = out.filter((l) => l[0] === '✗').length;
console.log(`\n${out.length - bad}/${out.length} in range`);
if (bad) {
  console.error('FAIL: the economy is out of proportion');
  process.exit(1);
}
console.log('All checks passed');
