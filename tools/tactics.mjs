// Tactic-response test: does choosing a tactic change what happens on the pitch, in the way football says it should?
//   node tools/tactics.mjs [--n 300] [--seed 4] [--report]      (npm run test:tactics)
// Two near-equal sides play many matches; one side's tactic is changed in one respect (a high press, a low block, a build-up
// style, width) against the same opponent and baseline. The measures the engine keeps (possession, tackles and interceptions,
// stamina at full time, shots by chance type) are compared with the baseline, and each expectation must hold with both a
// minimum size and a statistical margin. A tactic that moves nothing is a failure, not a pass: the player has to be able to see
// why they won or lost.
import { parseArgs, loadSim } from './harness.mjs';

const args = parseArgs();
const N = +(args.n || 300),
  SEED = +(args.seed || 4);
const { FM } = loadSim(SEED);
const W = FM.W;
W.newWorld(W.REAL_RULES);
FM.Season.init();

// Two clubs of about the same standing, in the same league, and the base tactic they both start from
const d1 = Object.values(FM.S.clubs)
  .filter((c) => c.comp === 'D1')
  .sort((a, b) => b.rep - a.rep);
const [c1, c2] = [d1[7], d1[8]];
const mk = (o = {}) => {
  const t = W.newTactic('4-3-3', o.buildup || 'Short', o.press || 'Mid Block', o.width || 'Balanced');
  t.fam = 60;
  return t;
};

const sum = (o, f) => Object.values(o).reduce((s, x) => s + f(x), 0);
// What one side did in a match
function measure(m, k) {
  const sd = m.sides[k],
    od = m.sides[1 - k];
  const res = m.result();
  const shots = (s, ...types) => types.reduce((n, t) => n + ((s.types && s.types[t] && s.types[t][0]) || 0), 0);
  const share = (s, types) => (s.shots ? shots(s, ...types) / s.shots : 0);
  return {
    poss: res.poss[k],
    tk: sum(sd.ps, (p) => p.tk || 0),
    ic: sum(sd.ps, (p) => p.ic || 0),
    tkic: sum(sd.ps, (p) => (p.tk || 0) + (p.ic || 0)),
    // stamina lost per 90 minutes played, by everyone who played (substitutes would hide it in an average at full time)
    drain:
      (Object.keys(sd.mins).reduce(
        (n, id) => n + (FM.S.players[id].fitness - (sd.st[id] ?? FM.S.players[id].fitness)),
        0,
      ) /
        Math.max(
          1,
          Object.values(sd.mins).reduce((a, b) => a + b, 0),
        )) *
      90,
    // ball-winning per 50% of the match the opponent had the ball
    winRate: (sum(sd.ps, (p) => (p.tk || 0) + (p.ic || 0)) / Math.max(1, 100 - res.poss[k])) * 50,
    xgFor: sd.xg,
    xgAg: od.xg,
    counterFor: shots(sd, 'counter'),
    counterAg: shots(od, 'counter'),
    crossFor: shots(sd, 'cross'),
    crossAg: shots(od, 'cross'),
    centralAg: shots(od, 'through', 'cutback'),
    throughAg: shots(od, 'through'),
    centralFor: shots(sd, 'through', 'cutback'),
    directFor: shots(sd, 'cross', 'longshot'),
    longFor: shots(sd, 'longshot'),
    longAg: shots(od, 'longshot'),
    icShare: sd.ps
      ? sum(sd.ps, (p) => p.ic || 0) /
        Math.max(
          1,
          sum(sd.ps, (p) => (p.tk || 0) + (p.ic || 0)),
        )
      : 0,
    crossShareFor: share(sd, ['cross']),
    centralShareFor: share(sd, ['through', 'cutback']),
    counterShareFor: share(sd, ['counter']),
  };
}
// n matches of `x` (the tactic under test) against `opp`, half of them at home
function run(x, opp = {}, ins = null, oppIns = null) {
  const rows = [];
  for (let i = 0; i < N; i++) {
    const homeX = i % 2 === 0;
    const [h, a] = homeX ? [c1, c2] : [c2, c1];
    h.tactic = homeX ? mk(x) : mk(opp);
    a.tactic = homeX ? mk(opp) : mk(x);
    const m = new FM.Match({ h: h.id, a: a.id, comp: 'D1' });
    const k = homeX ? 0 : 1;
    if (ins) FM.Matchday.applyInstructions(m, ins, m.sides[k]);
    if (oppIns) FM.Matchday.applyInstructions(m, oppIns, m.sides[1 - k]);
    while (!m.finished) m.step();
    rows.push(measure(m, k));
  }
  return rows;
}
const mean = (rows, k) => rows.reduce((s, r) => s + r[k], 0) / rows.length;
const sd = (rows, k) => {
  const mu = mean(rows, k);
  return Math.sqrt(rows.reduce((s, r) => s + (r[k] - mu) ** 2, 0) / (rows.length - 1));
};
// difference of means, its size relative to the baseline, and how many standard errors it is
function diff(a, b, k) {
  const da = mean(a, k) - mean(b, k);
  const se = Math.sqrt(sd(a, k) ** 2 / a.length + sd(b, k) ** 2 / b.length) || 1e-9;
  return { d: da, rel: da / (Math.abs(mean(b, k)) || 1), z: da / se, a: mean(a, k), b: mean(b, k) };
}

const fails = [],
  lines = [];
// expect(label, experiment rows, baseline rows, measure, 'up'|'down', minimum size in measure units or (rel) fraction)
function expect(label, a, b, k, dir, min, relative = false) {
  const x = diff(a, b, k);
  const size = relative ? x.rel : x.d;
  const ok = dir === 'up' ? size >= min && x.z >= 2 : -size >= min && x.z <= -2;
  lines.push(
    `${ok ? '✓' : '✗'} ${label}: ${x.b.toFixed(2)} → ${x.a.toFixed(2)} (${relative ? (x.rel * 100).toFixed(0) + '%' : x.d.toFixed(2)}, z ${x.z.toFixed(1)})`,
  );
  if (!ok) fails.push(label);
}

const t0 = Date.now();
const base = run({});
const high = run({ press: 'High Press' }),
  low = run({ press: 'Low Block' });
lines.push('— A high press, against a mid block');
expect('the opponent has less of the ball (our possession up, points)', high, base, 'poss', 'up', 0.8);
expect(
  'more ball-winning for each minute the opponent has it (tackles and interceptions)',
  high,
  base,
  'winRate',
  'up',
  0.04,
  true,
);
expect('our players lose more stamina per 90 minutes (points)', high, base, 'drain', 'up', 3);
expect(
  'the opponent gets more counter-attack chances (space behind the press)',
  high,
  base,
  'counterAg',
  'up',
  0.08,
  true,
);
lines.push('— A low block, against a mid block');
expect('we have less of the ball (possession down, points)', low, base, 'poss', 'down', 1.5);
expect('more of our ball-winning is interceptions (share)', low, base, 'icShare', 'up', 0.01);
expect('fewer through-ball chances for the opponent', low, base, 'throughAg', 'down', 0.05, true);
expect('more counter-attack chances for us', low, base, 'counterFor', 'up', 0.05, true);
expect('our players lose less stamina per 90 minutes (points)', low, base, 'drain', 'down', 1);
lines.push('— Build-up and width');
const counter = run({ buildup: 'Counter' }),
  direct = run({ buildup: 'Direct' }),
  wing = run({ buildup: 'Wing Play' }),
  poss = run({ buildup: 'Possession' }),
  wide = run({ width: 'Wide' }),
  narrow = run({ width: 'Narrow' });
expect('Counter build-up: more counter chances for us', counter, base, 'counterFor', 'up', 0.2, true);
expect('Direct build-up: more crosses and long shots', direct, base, 'directFor', 'up', 0.05, true);
expect('Wing Play: more crosses', wing, base, 'crossFor', 'up', 0.1, true);
expect('Possession build-up: more of the ball (points)', poss, base, 'poss', 'up', 0.5);
expect('Wide: more crosses', wide, base, 'crossFor', 'up', 0.05, true);
expect('Narrow: fewer crosses', narrow, base, 'crossFor', 'down', 0.05, true);
expect('Narrow: more through balls and cutbacks', narrow, base, 'centralFor', 'up', 0.03, true);
lines.push('— The opponent’s tactic changes what we get');
const vsHigh = run({ buildup: 'Counter' }, { press: 'High Press' });
expect(
  'Counter build-up against a high press: more counter chances than against a mid block',
  vsHigh,
  counter,
  'counterFor',
  'up',
  0.03,
  true,
);

// Match instructions: each answers one thing in the opposition report, so it should pay against the side it is meant for and
// cost (or do nothing) against the side it is not. The report's own advice must agree with the engine.
lines.push('— Match instructions answer the opposition');
const hp = { press: 'High Press' },
  lb = { press: 'Low Block' },
  nar = { width: 'Narrow' };
const baseHP = run({}, hp),
  counterHP = run({}, hp, ['counter']),
  baseLB = run({}, lb),
  counterLB = run({}, lb, ['counter']),
  patLB = run({}, lb, ['patience']),
  patHP = run({}, hp, ['patience']),
  baseN = run({}, nar),
  crossN = run({}, nar, ['crosses']);
expect('counter plan against a high press: more counter chances', counterHP, baseHP, 'counterFor', 'up', 0.3, true);
expect('counter plan against a low block gains far less (no space)', counterLB, baseLB, 'counterFor', 'up', 0, true);
if (
  mean(counterHP, 'counterFor') - mean(baseHP, 'counterFor') <=
  1.5 * (mean(counterLB, 'counterFor') - mean(baseLB, 'counterFor'))
) {
  lines.push('✗ the counter plan should pay clearly more against a press than against a block');
  fails.push('counter plan fit');
} else lines.push('✓ the counter plan pays clearly more against a press than against a block');
expect('patience against a low block: more through balls and cutbacks', patLB, baseLB, 'centralFor', 'up', 0.08, true);
expect('patience against a high press: more counters against us', patHP, baseHP, 'counterAg', 'up', 0.1, true);
expect('wide play against a narrow side: more crosses', crossN, baseN, 'crossFor', 'up', 0.15, true);
const dropped = run({}, { buildup: 'Direct' }, ['drop']),
  baseD = run({}, { buildup: 'Direct' });
expect('dropping the line: fewer through balls against us', dropped, baseD, 'throughAg', 'down', 0.1, true);
// the report: against a high press it recommends the counter plan and warns against patience; against a block the reverse
const advise = (press) => {
  return FM.Matchday.INS.counter.fit({ press, width: 'Balanced', fb: { gap: 0 }, lead: 4, pace: 13 })[0];
};
const advOk =
  advise('High Press') > 0 && advise('Low Block') < 0 && FM.Matchday.INS.patience.fit({ press: 'Low Block' })[0] > 0;
lines.push(
  `${advOk ? '✓' : '✗'} the report’s advice agrees with the engine (counter for a press, patience for a block)`,
);
if (!advOk) fails.push('report advice');
// an instruction is named in the post-match reading
{
  let named = 0;
  for (let i = 0; i < 60; i++) {
    c1.tactic = mk();
    c2.tactic = mk();
    const m = new FM.Match({ h: c1.id, a: c2.id, comp: 'D1' });
    FM.Matchday.applyInstructions(m, ['crosses', 'patience'], m.sides[0]);
    while (!m.finished) m.step();
    if (FM.Matchday.why(m, 0).causes.some((c) => c.tag === 'instruction')) named++;
  }
  const ok = named >= 20;
  lines.push(`${ok ? '✓' : '✗'} instructions are judged in the post-match reading: ${named}/60 matches`);
  if (!ok) fails.push('instruction reading');
}

// The post-match reading: it must always return a headline and causes in the right shape, and it must name the tactic when the
// tactic left a mark (a high press that conceded counters, a low block that held or broke, tired legs)
lines.push('— Why it went that way (FM.Matchday.why)');
const tagged = (x, tags) => {
  let hit = 0,
    shape = 0;
  for (let i = 0; i < 120; i++) {
    const homeX = i % 2 === 0,
      [h, a] = homeX ? [c1, c2] : [c2, c1];
    h.tactic = mk(homeX ? x : {});
    a.tactic = mk(homeX ? {} : x);
    const m = new FM.Match({ h: h.id, a: a.id, comp: 'D1' });
    while (!m.finished) m.step();
    const w = FM.Matchday.why(m, homeX ? 0 : 1);
    if (typeof w.headline === 'string' && Array.isArray(w.causes) && w.causes.every((c) => c.title && c.text && c.kind))
      shape++;
    if (w.causes.some((c) => tags.includes(c.tag))) hit++;
  }
  return { hit: hit / 120, shape: shape / 120 };
};
for (const [label, x, tags, min] of [
  ['a high press is named in the reading', { press: 'High Press' }, ['press', 'fatigue'], 0.5],
  ['a low block is named in the reading', { press: 'Low Block' }, ['block'], 0.5],
  ['a narrow shape is named when it leaves its mark', { width: 'Narrow' }, ['width'], 0.15],
]) {
  const r = tagged(x, tags);
  const ok = r.shape === 1 && r.hit >= min;
  lines.push(
    `${ok ? '✓' : '✗'} ${label}: ${(r.hit * 100).toFixed(0)}% of matches (at least ${min * 100}%), every reading well-formed: ${r.shape === 1}`,
  );
  if (!ok) fails.push(label);
}

console.log(`Tactic response · ${N} matches a measure, seed ${SEED}, ${Math.round((Date.now() - t0) / 1000)}s\n`);
console.log(lines.join('\n'));
console.log(fails.length ? `\n${fails.length} expectation(s) not met` : '\nAll tactic expectations hold.');
process.exit(fails.length ? 1 : 0);
