// Real-stats converter, command line. Turns a CSV or JSON file of real players' numbers into game attributes and ability.
//   node tools/realstats.mjs players.csv [--league D1] [--out converted.json]   convert a file
//   node tools/realstats.mjs --test                                              self-check (npm run test:realstats)
// Columns (any that exist are used; names, nat, born and club are carried through):
//   name, nat, born | age, pos, foot, club, league, minutes, goals, assists, xg, xa, shots, passes, passPct, keyPasses,
//   tackles, interceptions, clearances, dribbles, aerials, pressures, saves, savePct, goalsConceded, rating, topSpeed
// Counts are season totals; add a `per90` column of 1 when they are already per 90 minutes.
import fs from 'node:fs';
import { parseArgs, loadSim } from './harness.mjs';

const args = parseArgs();
const { FM } = loadSim(1);
const R = FM.RealStats;

if ('test' in args) {
  const fails = [];
  const check = (ok, msg) => ok || fails.push(msg);
  const st = {
    pos: 'ST',
    age: 25,
    minutes: 2700,
    league: 'D1',
    goals: 15,
    xg: 14,
    shots: 90,
    assists: 4,
    passes: 500,
    passPct: 76,
  };
  const a = R.convert(st),
    more = R.convert({ ...st, goals: 28, xg: 22 }),
    weak = R.convert({ ...st, league: 35 }),
    few = R.convert({ ...st, minutes: 150, goals: 3, xg: 1 }),
    old = R.convert({ ...st, age: 35 }),
    young = R.convert({ ...st, age: 18 });
  check(more.ca > a.ca, 'more goals did not raise ability');
  check(more.attrs.finishing > a.attrs.finishing, 'more goals did not raise finishing');
  check(weak.ca < a.ca - 5, 'the same numbers in a weak league did not come out lower');
  check(
    Math.abs(few.ca - R.baseline(R.leagueStrength('D1'))) < Math.abs(a.ca - R.baseline(R.leagueStrength('D1'))) + 1,
    'few minutes did not pull toward the baseline',
  );
  check(old.attrs.pace < a.attrs.pace, 'a 35-year-old is as quick as a 25-year-old');
  check(young.pa > young.ca && old.pa === old.ca, 'potential: the young should have room, the old none');
  for (const r of [
    a,
    more,
    weak,
    few,
    old,
    young,
    R.convert({ pos: 'GK', age: 28, minutes: 3000, league: 'D1', savePct: 0.78, goalsConceded: 30 }),
  ]) {
    check(
      Object.values(r.attrs).every((v) => v >= 1 && v <= 20),
      `attributes out of range: ${JSON.stringify(r.attrs)}`,
    );
    check(r.ca === FM.W.calcCA({ attrs: r.attrs }, r.pos), 'ability does not follow from the attributes');
    check(r.pa >= r.ca && r.pa <= 96, 'potential below ability or above 96');
  }
  for (const p of ['LB', 'RWB', 'CDM', 'CAM', 'LW', 'CF', 'RM', 'gk', 'ST ', 'DC'])
    check(R.position(p), `position ${p} not understood`);
  check(R.position('QB') === null, 'a made-up position was accepted');
  const csv = R.parseCSV('name,pos,minutes\n"Doe, John",ST,2000\nSmith,CM,900\n');
  check(csv.length === 2 && csv[0].name === 'Doe, John', 'CSV with a quoted comma was misread');
  check(JSON.stringify(R.convert(st)) === JSON.stringify(R.convert(st)), 'conversion is not deterministic');
  // the position groups: a full-back's usual numbers are not judged against centre-backs'
  const fbStats = {
    age: 25,
    minutes: 2700,
    league: 'D1',
    tackles: 62,
    interceptions: 36,
    clearances: 50,
    passes: 1200,
    passPct: 82,
  };
  check(
    R.convert({ ...fbStats, pos: 'FB' }).ca > R.convert({ ...fbStats, pos: 'CB' }).ca,
    'a full-back is judged like a centre-back',
  );
  // defending is read against the ball the side had
  const df = {
    pos: 'CB',
    age: 26,
    minutes: 2700,
    league: 'D1',
    tackles: 45,
    interceptions: 40,
    clearances: 120,
    aerials: 60,
    passPct: 90,
  };
  check(
    R.convert({ ...df, possession: 35 }).ca < R.convert({ ...df, possession: 65 }).ca,
    'possession does not change a defender',
  );
  // expected goals count for more than goals
  const lucky = { pos: 'ST', age: 25, minutes: 2700, league: 'D1', goals: 16, xg: 8, shots: 80 };
  const unlucky = { ...lucky, goals: 8, xg: 16 };
  check(R.convert(unlucky).ca > R.convert(lucky).ca, 'goals count for more than expected goals');
  // progressive passes help a midfielder
  const cm = { pos: 'CM', age: 25, minutes: 2700, league: 'D1', passPct: 86, passes: 1400, keyPasses: 30 };
  check(
    R.convert({ ...cm, progressivePasses: 260 }).ca > R.convert({ ...cm, progressivePasses: 80 }).ca,
    'progressive passes do not count',
  );
  // several seasons: the latest counts most
  const good = { goals: 22, xg: 20, shots: 100 },
    poor = { goals: 6, xg: 7, shots: 60 };
  const base = { pos: 'ST', age: 26, league: 'D1', minutes: 2700 };
  const rising = R.convert({
    ...base,
    seasons: [
      { minutes: 2700, ...good },
      { minutes: 2700, ...poor },
      { minutes: 2700, ...poor },
    ],
  });
  const fading = R.convert({
    ...base,
    seasons: [
      { minutes: 2700, ...poor },
      { minutes: 2700, ...poor },
      { minutes: 2700, ...good },
    ],
  });
  check(rising.ca > fading.ca, 'the latest season does not count most');
  // pace is not guessed from dribbles; it comes from position and age (and a top speed when there is one)
  const wing = { pos: 'W', age: 24, minutes: 2700, league: 'D1', goals: 8, xg: 7 };
  const dr = [R.convert({ ...wing, dribbles: 140 }).attrs, R.convert({ ...wing, dribbles: 20 }).attrs];
  check(
    Math.abs(dr[0].pace - dr[1].pace) < Math.abs(dr[0].dribbling - dr[1].dribbling) / 3,
    'pace still follows dribbles',
  );
  check(
    R.convert({ ...wing, topSpeed: 35.5 }).attrs.pace > R.convert({ ...wing, topSpeed: 31 }).attrs.pace,
    'a measured top speed is ignored',
  );
  check(R.convert({ ...wing, age: 34 }).attrs.pace < R.convert(wing).attrs.pace, 'pace does not fall with age');
  // what cannot be measured is flagged
  const lc = R.convert(wing);
  check(
    lc.lowConfidence.includes('composure') && lc.lowConfidence.includes('pace'),
    'weak proxies are not flagged low confidence',
  );
  check(lc.attrConfidence.finishing > lc.attrConfidence.composure, 'finishing is not trusted more than composure');
  // potential: a range, with a bonus for a young regular in a strong league
  const kid = { pos: 'CM', age: 19, league: 'D1', passPct: 86, passes: 1500 };
  const regular = R.convert({ ...kid, minutes: 2600 }),
    bench = R.convert({ ...kid, minutes: 400 });
  check(regular.paRange[0] <= regular.pa && regular.pa <= regular.paRange[1], 'potential is outside its own range');
  check(regular.paRange[0] >= regular.ca, 'the range starts below his ability');
  check(regular.pa - regular.ca > bench.pa - bench.ca, 'a young regular has no more room than a bench player');
  check(R.convert({ ...kid, minutes: 2600, pa: 80 }).paRange.join() === '80,80', 'a given potential is not exact');
  console.log(fails.length ? 'FAIL\n' + fails.join('\n') : 'Real-stats converter: all checks passed.');
  process.exit(fails.length ? 1 : 0);
}

const file = process.argv[2];
if (!file || file.startsWith('--')) {
  console.log('usage: node tools/realstats.mjs players.csv [--league D1] [--out converted.json] | --test');
  process.exit(1);
}
const text = fs.readFileSync(file, 'utf8');
const rows = file.endsWith('.json') ? JSON.parse(text) : R.parseCSV(text).map(R.clean);
const out = rows.map((r) => {
  try {
    const x = R.convert({ league: args.league, ...r });
    return { name: r.name, nat: r.nat, born: r.born, club: r.club, foot: r.foot, ...x };
  } catch (e) {
    return { name: r.name, error: e.message };
  }
});
const dest = args.out;
if (dest) fs.writeFileSync(dest, JSON.stringify(out, null, 2));
for (const o of out)
  console.log(
    o.error
      ? `✗ ${o.name}: ${o.error}`
      : `${(o.name || '?').padEnd(24)} ${o.pos.padEnd(3)} CA ${o.ca} PA ${o.pa} (${Math.round(o.confidence * 100)}% sure)`,
  );
if (dest) console.log(`\nWrote ${out.length} players to ${dest}`);
