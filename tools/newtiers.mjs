// Adds the lower divisions of the real-formats sheets 12 to 14 (docs/real-formats/) to the game: 113 second, third and fourth
// divisions of 47, 34 and 32 nations, each a single table of fictional clubs from the name library, linked to the division above by
// promotion and relegation (and to the one below, once that exists). Everything is fictional and nothing here names a real club, so the
// structure lives in this file (nothing is read from the private folder).
//   node tools/newtiers.mjs [--seed 41]          report (the names it would make, and any name already in the world)
//   node tools/newtiers.mjs --write [--seed 41]  write js/clubs.js, js/data.js and js/geo.js (once: it stops if the leagues are there)
// Afterwards: node tools/abbrevs.mjs --write (club abbreviations), then prettier on the three files.
//
// A line of a tier is  parent-id n auto mode [rounds]:
//   n       clubs in the table (a real division of regional groups is modelled as one group of this size)
//   auto    clubs promoted without a play-off (and relegated from the division above)
//   mode    a = promotion and relegation only; p = plus a play-off among the next four places for one more place;
//           t = plus one tie against the club above (the relegation play-off); t2 = plus two ties (Montenegro: 8th and 9th v
//           2nd and 3rd); c = closed league, no promotion or relegation
// The last ten second tiers (Albania, Bolivia, Estonia, Georgia, Kosovo, Latvia, Lithuania, Luxembourg, Montenegro, North Macedonia)
// are not in the sheets' second-tier list: their sizes are the real divisions' as the author knows them, not from the sheet.
//   --only AL2,BO2 ...   make just these divisions (the others are in the game already)
//   rounds  matches per club when not the double round-robin (a triple or quadruple round-robin, a shortened season)
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, loadSim, ROOT } from './harness.mjs';
import { generate } from './worldgen.mjs';

const T2 = `DZ1 16 2 a|AR1 18 2 a|AT1 16 1 a|BY1 16 2 a|BE1 16 1 a|BG1 18 2 a|CL1 16 1 p|CS1 16 2 a|CO1 16 2 a 15|HR1 10 1 t 36|CY1 16 3 a
|CZ1 16 1 t|DK1 12 2 a|EC1 10 2 a 36|EG1 20 2 a|FI1 10 1 t 27|GH1 16 1 a|GR1 10 1 a|HU1 16 2 a|IN1 12 1 a|IR1 18 2 a|IE1 10 1 t 36
|IL1 16 2 a|KE1 20 2 a|MY1 14 1 a|MX1 16 0 c|MA1 16 2 a|NG1 20 2 a|NI1 12 1 t 33|PY1 16 2 a|PE1 16 1 a|QA1 8 1 t 21|RO1 22 2 a 21
|RU1 18 2 t|SC1 10 1 t 36|RS1 16 2 a|SK1 16 1 t|SI1 16 1 t|ZA1 16 1 t|CH1 10 1 t 36|TZ1 16 2 a|TN1 14 1 a|UA1 16 2 t|AE1 16 2 a
|US1 24 0 c 30|UY1 14 2 a|UZ1 14 1 t
|AL1 16 1 t|BO1 16 1 t|EE1 10 1 t 36|GE1 10 1 t 36|XK1 14 1 t|LV1 14 1 t|LT1 12 1 t|LU1 16 1 t|ME1 12 1 t2|MK1 16 1 t`;
const T3 = `AR2 18 2 a|AT2 16 1 a|BE2 16 1 a|BR2 20 4 a 19|CL2 14 1 a|CS2 12 2 a|CZ2 16 2 a|DK2 12 2 a|FR2 16 2 a|GR2 14 2 a|HU2 16 2 a
|ID2 16 2 a 14|IR2 14 2 a|IT2 20 3 a|JP2 20 2 p|MX2 14 0 c|NL2 18 1 a|NI2 12 1 a|NO2 14 2 a|PL2 18 2 p|PT2 12 2 a|RO2 10 1 a|RU2 18 2 a
|SA2 16 2 a|SC2 10 1 t 36|ZA2 16 2 a|KR2 16 1 a|SE2 16 1 t|CH2 18 1 a|TH2 12 2 a|TR2 18 2 a|UA2 12 2 a|US2 16 0 c|VN2 12 2 a`;
const T4 = `AR3 16 2 a|AT3 16 2 a|BE3 16 2 a|BR3 20 4 a 19|CL3 16 1 a|CS3 12 2 a|CZ3 16 2 a|DK3 12 1 a|FR3 16 2 a|DE3 18 1 a|ID3 12 2 a
|IR3 12 2 a|IT3 18 3 a|JP3 16 1 a|MX3 14 0 c|NL3 18 1 a|NO3 14 2 a|PL3 18 2 a|PT3 14 2 a|RO3 14 2 a|RU3 12 2 a|SA3 10 2 a|SC3 10 1 t 36
|ZA3 14 2 a|KR3 16 2 a|ES3 18 2 a|SE3 14 2 a|CH3 16 2 a|TH3 10 2 a|TR3 18 2 a|US3 14 0 c 14|VN3 8 2 a`;
const parse = (txt, tier) =>
  txt
    .replace(/\n/g, '')
    .split('|')
    .map((s) => s.trim().split(/\s+/))
    .map(([parent, n, auto, mode, rounds]) => ({
      tier,
      parent,
      id: parent.slice(0, 2) + tier,
      n: +n,
      auto: +auto,
      mode,
      rounds: rounds ? +rounds : 0,
    }));
// (the parent of a third tier is the second tier's id, of a fourth the third's: ids are the nation's two letters and the tier)
const ALL = [...parse(T2, 2), ...parse(T3, 3), ...parse(T4, 4)];
const args = parseArgs();
const ONLY = args.only ? new Set(String(args.only).split(',')) : null;
const SPEC = ONLY ? ALL.filter((s) => ONLY.has(s.id)) : ALL;
export { SPEC };

const seed = +(args.seed || 41);
const { FM } = loadSim(1);
const D = FM.D;
if (D.LEAGUES.some((l) => l.id === SPEC[0].id) && !('force' in args)) {
  console.log('the divisions are already in the game');
  process.exit(0);
}

// ---------- numbers: a seeded stream, so the same seed makes the same divisions ----------
let st = seed * 7919 + 13;
const rnd = () => {
  st = (st + 0x6d2b79f5) | 0;
  let t = Math.imul(st ^ (st >>> 15), 1 | st);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pick = (a) => a[Math.floor(rnd() * a.length)];
const COLS = ['#6CACE4', '#6A1B9A', '#00843D', '#FFD100', '#FFFFFF', '#0057B8', '#001F5B', '#E30613', '#000000'];
const IDT = ['fan', 'fan', 'fan', 'historic', 'historic', 'selling', 'youth', 'fallen'];

// ---------- the leagues: nation, parent, rep band, rules ----------
const byId = Object.fromEntries(D.LEAGUES.map((l) => [l.id, l]));
const lg = {}; // new leagues by id, in order
for (const s of SPEC) {
  const par = byId[s.parent] || lg[s.parent];
  if (!par) throw new Error(`no parent ${s.parent} for ${s.id}`);
  const top = byId[s.parent.slice(0, 2) + '1'];
  const band = par.repBand || [50, 38];
  const hi = Math.max(24, Math.min(band[0] - 3, band[1] + 5)),
    lo = Math.max(18, band[1] - 6);
  lg[s.id] = {
    ...s,
    nat: par.nat,
    sim: 'minimal',
    band: [hi, lo],
    parentTop: top && top.id,
    rules: s.rounds ? { rounds: s.rounds } : {},
    lowerOf: par,
  };
  if (s.mode !== 'c') {
    lg[s.id].rules.promote =
      s.mode === 'a'
        ? { to: s.parent, auto: s.auto }
        : s.mode === 'p'
          ? { to: s.parent, auto: s.auto, playoff: [s.auto + 1, s.auto + 4] }
          : { to: s.parent, auto: s.auto, tie: true };
    // the division above sends the same number down (one more where a play-off decides a further place)
    lg[s.id].relegateFromParent =
      s.mode === 'p'
        ? { to: s.id, n: s.auto + 1 }
        : s.mode === 't' || s.mode === 't2'
          ? { to: s.id, n: s.auto, playoff: s.mode === 't2' ? 2 : true }
          : { to: s.id, n: s.auto };
  }
  byId[s.id] = lg[s.id];
}
const LEAGUES = Object.values(lg);

// ---------- the structure, as a "real" world for the generator (placeholder towns, replaced by fictional ones) ----------
const taken = new Set(D.allClubRows().map((r) => r[1]));
const real = {
  clubs: {},
  leagues: {},
  continentals: {},
  cups: {},
  rivals: [],
  nations: {},
  regions: {},
  format: 'touchline-names',
  version: 1,
};
for (const n of new Set(LEAGUES.map((l) => l.nat))) real.nations[n] = (D.NATIONS[n] || { name: n }).name;
for (const l of LEAGUES) {
  real.leagues[l.id] = { nat: l.nat, tier: l.tier, name: l.id, short: l.id };
  l.clubs = [];
  for (let i = 0; i < l.n; i++) {
    const code = `${l.id}${String(i).padStart(2, '0')}`;
    const rep = Math.round(l.band[0] - ((l.band[0] - l.band[1]) * i) / Math.max(1, l.n - 1) + (rnd() - 0.5) * 1.6);
    const c1 = pick(COLS);
    let c2 = pick(COLS);
    while (c2 === c1) c2 = pick(COLS);
    const cap = Math.round((3000 + (rep - 20) * 450 + rnd() * 5000) / 500) * 500;
    l.clubs.push({ code, rep, c1, c2, idt: pick(IDT), cap });
    real.clubs[code] = {
      league: l.id,
      nat: l.nat,
      row: [`Club ${code}`, code, `Place ${code}`, c1, c2, 'fan', rep, `Ground ${code}`, cap],
      short: code,
      nick: '',
      founded: '',
    };
  }
}
const avoid = D.allClubRows().flatMap((r) => [r[0], r[2], r[7]]);
const out = generate(real, seed, avoid);
// (names the generator made that are a real division's own name: replaced by invented ones)
const NAME_FIX = {
  AR2: 'Argentine Liga de Ascenso',
  AR3: 'Argentine Tercera Nacional',
  PY2: 'Paraguayan Segunda Nacional',
  FI2: 'Finnish Toinen Liiga',
  IN2: 'Vantage Second League',
  IR2: 'Kaizen Dovom League',
  ZA2: 'South African Challenge Division',
  CH3: 'Swiss Aufstiegsliga',
  CH2: 'Swiss Zweite Superliga',
  IT3: 'Italian Lega Terza',
  IT4: 'Italian Lega Quarta',
  NL3: 'Dutch Derde Klasse',
  NL4: 'Dutch Vierde Klasse',
  BE2: 'Belgian Tweede Klasse',
  BE3: 'Belgian Derde Klasse',
  BE4: 'Belgian Vierde Klasse',
  FR3: 'French Division Trois',
  FR4: 'French Division Quatre',
  TH3: 'Thai Division 2',
  TH4: 'Thai Division 3',
  CS3: 'Chinese Division Two',
  ID3: 'Indonesian Division 2',
  ID4: 'Indonesian Division 3',
  HR2: 'Croatian Druga Divizija',
  UZ2: 'Uzbekistan First League',
  AT3: 'Austrian Dritte Liga',
  MX2: 'Mexican Liga de Plata',
  MX3: 'Mexican Liga de Fomento',
  KE2: 'Meridian National Division',
  MY2: 'Perdana Group Liga Dua',
  IL2: 'Beacon Second League',
  SC2: 'Scottish League Division',
  EG2: 'Egyptian Second Division A',
  AL2: 'Albanian Lidhja e Dytë',
  EE2: 'Estonian Teine Liiga',
  XK2: 'Kosovan Liga e Dytë',
  LV2: 'Latvian Zelta Līga',
  LT2: 'Lithuanian Aukso Lyga',
  MK2: 'North Macedonian Liga Dva',
};
for (const [k, v] of Object.entries(NAME_FIX)) if (out.leagues[k]) out.leagues[k].name = v;

// ---------- the clubs' own codes, from their fictional names ----------
const finalCode = {};
for (const l of LEAGUES)
  for (const c of l.clubs) {
    const o = out.clubs[c.code];
    let code = String(o.short || o.row[0].slice(0, 3))
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .slice(0, 3);
    for (let i = 0; taken.has(code) || code.length < 3; i++)
      code = (code.slice(0, 2) || 'X') + 'ABCDEFGHJKLMNPQRSTUVWXYZ'[i % 24] + (i >= 24 ? String(i) : '');
    taken.add(code);
    finalCode[c.code] = code;
    o.row[1] = code;
    o.row[5] = c.idt;
  }
const fixed = (code) => finalCode[code] || code;
out.clubs = Object.fromEntries(Object.entries(out.clubs).map(([k, v]) => [fixed(k), v]));

// ---------- names that clash with the world's ----------
const have = new Set(D.allClubRows().flatMap((r) => [r[0], r[2], r[7]]));
const clash = Object.values(out.clubs).filter((c) => have.has(c.row[0]) || have.has(c.row[7]));
console.log(
  `${Object.keys(out.clubs).length} clubs in ${LEAGUES.length} leagues, seed ${seed}; ${clash.length} names clash with the world's`,
);
for (const c of clash) console.log('  clash:', c.row[0], '/', c.row[7]);
for (const l of LEAGUES)
  console.log(
    `${l.id} ${out.leagues[l.id].name}: ${l.clubs
      .slice(0, 3)
      .map((c) => out.clubs[fixed(c.code)].row[0])
      .join(', ')}`,
  );
if (!('write' in args)) process.exit(clash.length ? 1 : 0);
if (clash.length) {
  console.log('not written: try another --seed');
  process.exit(1);
}

// ---------- files ----------
const lit = (v) => (typeof v === 'string' ? `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'` : String(v));
const rowText = (r) => `    [${r.map(lit).join(', ')}],`;
const edit = (file, fn) => {
  const f = path.join(ROOT, file);
  let t = fs.readFileSync(f, 'utf8');
  const crlf = t.includes('\r\n');
  if (crlf) t = t.replace(/\r\n/g, '\n');
  t = fn(t);
  if (crlf) t = t.replace(/\n/g, '\r\n');
  fs.writeFileSync(f, t);
};
const jsKey = (o) =>
  '{ ' +
  Object.entries(o)
    .map(
      ([k, v]) =>
        `${k}: ${Array.isArray(v) ? JSON.stringify(v) : v && typeof v === 'object' ? jsKey(v) : typeof v === 'string' ? lit(v) : v}`,
    )
    .join(', ') +
  ' }';

edit('js/clubs.js', (t) => {
  const blocks = LEAGUES.map((l) => {
    const rows = l.clubs.map((c) => out.clubs[fixed(c.code)].row.slice(0, 9)).sort((a, b) => b[6] - a[6]);
    return `  FM.D.CLUBS_${l.id} = [\n${rows.map(rowText).join('\n')}\n  ];\n`;
  }).join('');
  const at = t.indexOf('  FM.D.CLUB_INFO = Object.fromEntries(');
  if (at < 0) throw new Error('CLUB_INFO not found');
  t = t.slice(0, at) + blocks + t.slice(at);
  const info = Object.values(out.clubs)
    .map((c) => `${c.row[1]}|${c.short}|${c.nick}|${c.founded}`)
    .join('\n');
  const end = t.indexOf(
    '`' + String.fromCharCode(10) + '      .split(',
    t.indexOf('FM.D.CLUB_INFO = Object.fromEntries('),
  );
  if (end < 0) throw new Error('CLUB_INFO end not found');
  t = t.slice(0, end) + '\n' + info + t.slice(end);
  return t;
});

edit('js/data.js', (t) => {
  // the new leagues, after the last of the list
  const entries = LEAGUES.map((l) => {
    const o = out.leagues[l.id];
    return `    {
      id: ${lit(l.id)},
      nat: ${lit(l.nat)},
      name: ${lit(o.name)},
      short: ${lit(l.id)},
      tier: ${l.tier},
      sim: ${lit(l.sim)},
      clubs: ${lit('CLUBS_' + l.id)},
      repBand: [${l.band.join(', ')}],
      rules: ${jsKey(l.rules)},
    },`;
  }).join('\n');
  const at = t.indexOf('\n  ];\n  FM.D.CONTINENTALS = [');
  if (at < 0) throw new Error('the end of the league list was not found');
  t = t.slice(0, at) + '\n' + entries + t.slice(at);
  // the division above sends clubs down: its rules get a relegate entry (a parent already linked downwards is left alone)
  for (const l of LEAGUES) {
    if (!l.relegateFromParent) continue;
    const rel = { ...l.relegateFromParent, to: l.id };
    // (inside the parent's own block only: from its id to the next league's)
    const from = t.indexOf(`\n      id: '${l.parent}',`);
    if (from < 0) throw new Error(`league ${l.parent} not found`);
    const next = t.indexOf('\n    {\n      id:', from + 1);
    const end = next < 0 ? t.indexOf('\n  ];', from) : next;
    const block = t.slice(from, end);
    const r0 = block.indexOf('\n      rules: {');
    if (r0 < 0) throw new Error(`rules of ${l.parent} not found`);
    if (/\n {8}relegate:|rules: \{[^\n]*relegate:/.test(block.slice(r0))) continue; // (already linked downwards)
    const open = from + r0 + '\n      rules: {'.length;
    t = t.slice(0, open) + ` relegate: ${jsKey(rel)},` + t.slice(open);
  }
  // the nationality mixes: a division plays with its top flight's
  const inherit = LEAGUES.map((l) => `  FM.D.NAT_MIX.${l.id} = { ...FM.D.NAT_MIX.${l.id.slice(0, 2)}1 };`).join('\n');
  const f = t.indexOf('  FM.D.facts = () => ({');
  t = t.slice(0, f) + inherit + '\n' + t.slice(f);
  return t;
});

// ---------- the map: each club near one of its nation's existing clubs ----------
const geo = new Map();
for (const line of fs.readFileSync(path.join(ROOT, 'js/geo.js'), 'utf8').split('\n')) {
  const m = /^([A-Z0-9]+):(-?[\d.]+),(-?[\d.]+)$/.exec(line.trim());
  if (m) geo.set(m[1], [+m[2], +m[3]]);
}
const natSpots = {};
for (const l of D.LEAGUES)
  for (const r of D[l.clubs] || []) if (geo.has(r[1])) (natSpots[l.nat] = natSpots[l.nat] || []).push(geo.get(r[1]));
const lines = [];
for (const l of LEAGUES)
  for (const c of l.clubs) {
    const code = fixed(c.code),
      spots = natSpots[l.nat] || [[20, 0]];
    const [la, lo] = pick(spots);
    lines.push(`${code}:${(la + (rnd() - 0.5) * 1.2).toFixed(2)},${(lo + (rnd() - 0.5) * 1.6).toFixed(2)}`);
  }
edit('js/geo.js', (t) => {
  const at = t.lastIndexOf('`;');
  return t.slice(0, at) + '\n' + lines.join('\n') + t.slice(at);
});
console.log('written. Now: node tools/abbrevs.mjs --write, then prettier on js/clubs.js js/data.js js/geo.js');
