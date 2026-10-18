// Adds the sixteen top flights of tools/newleagues-data.mjs to the game: fictional clubs from the name library, written into
// js/clubs.js (club rows, abbreviations, nicknames, derbies) and js/data.js (the leagues, their nationality mixes and their
// places in the continental cups), and into the two names databases (data/real-world.json with the real structure,
// data/fictional-world.json with the generated names).
//   node tools/newleagues.mjs [--seed 16]          report (the names it would make, and any name already in the world)
//   node tools/newleagues.mjs --write [--seed 16]  write the files (once: it stops if the leagues are already there)
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, loadSim, ROOT } from './harness.mjs';
import { generate } from './worldgen.mjs';
import { LEAGUES } from './newleagues-data.mjs';
import { privateFile, missing } from './private.mjs';

const args = parseArgs();
const seed = +(args.seed || 16);
const { FM } = loadSim(1);
const D = FM.D;
if (D.LEAGUES.some((l) => l.id === LEAGUES[0].id) && !('force' in args)) {
  console.log('the leagues are already in the game');
  process.exit(0);
}

// ---------- the structure, as a "real" world for the generator ----------
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
const codeOf = new Map();
for (const lg of LEAGUES) {
  real.leagues[lg.id] = { nat: lg.nat, tier: 1, name: lg.real, short: lg.id };
  for (const c of lg.clubs) {
    let code = c.code;
    // (a code the world already has: another letter for the last one)
    for (let i = 0; taken.has(code); i++) code = c.code.slice(0, 2) + 'ABCDEFGHJKLMNPQRSTUVWXYZ'[i];
    taken.add(code);
    codeOf.set(c, code);
    real.clubs[code] = {
      league: lg.id,
      nat: lg.nat,
      row: [c.name, code, c.city, c.c1, c.c2, c.idt, c.rep, `${c.city} Stadium`, c.cap],
      short: code,
      nick: '',
      founded: '',
    };
  }
}
// derbies: the two biggest clubs of a town, and the famous ones
const FAMOUS = [
  ['ALY', 'ZMK'],
  ['EST', 'CAF'],
  ['YAN', 'SIM'],
  ['MCA', 'USA'],
  ['APO', 'OMO'],
  ['DIN', 'HAJ'],
  ['MAL', 'IFK'],
  ['AIK', 'DIF'],
  ['FCS', 'DIB'],
  ['LDU', 'IDV'],
  ['PEN', 'NAC'],
  ['NCL', 'IMD'],
  ['PRS', 'EST'],
  ['AIN', 'SAH'],
  ['SAD', 'DUH'],
  ['SHP', 'SHS'],
];
const byOld = (code) => [...codeOf.entries()].find(([c]) => c.code === code)?.[1] || code;
for (const lg of LEAGUES) {
  const cl = lg.clubs.map((c) => real.clubs[codeOf.get(c)]);
  const pairs = [];
  for (const [a, b] of FAMOUS) {
    const x = cl.find((c) => c.row[1] === byOld(a) && c.league === lg.id),
      y = cl.find((c) => c.row[1] === byOld(b) && c.league === lg.id);
    if (x && y) pairs.push([x.row[1], y.row[1]]);
  }
  const used = new Set(pairs.flat());
  const byCity = {};
  for (const c of cl.slice().sort((p, q) => q.row[6] - p.row[6]))
    (byCity[c.row[2]] = byCity[c.row[2]] || []).push(c.row[1]);
  for (const list of Object.values(byCity)) {
    const free = list.filter((x) => !used.has(x));
    if (free.length >= 2 && pairs.length < 3) {
      pairs.push([free[0], free[1]]);
      free.slice(0, 2).forEach((x) => used.add(x));
    }
  }
  real.rivals.push(...pairs.map(([a, b]) => [a, b, 'Derby']));
}

const avoid = D.allClubRows().flatMap((r) => [r[0], r[2], r[7]]);
const out = generate(real, seed, avoid);

// ---------- names that clash with the world's ----------
const have = new Set(D.allClubRows().flatMap((r) => [r[0], r[2], r[7]]));
const clash = Object.values(out.clubs).filter((c) => have.has(c.row[0]) || have.has(c.row[7]));
console.log(
  `${Object.keys(out.clubs).length} clubs in ${LEAGUES.length} leagues, seed ${seed}; ${clash.length} names clash with the world's`,
);
for (const c of clash) console.log('  clash:', c.row[0], '/', c.row[7]);
for (const lg of LEAGUES) {
  const o = out.leagues[lg.id];
  console.log(
    `${lg.id} ${o.name}: ${lg.clubs
      .slice(0, 4)
      .map((c) => out.clubs[codeOf.get(c)].row[0])
      .join(', ')}`,
  );
}
if (!('write' in args)) process.exit(clash.length ? 1 : 0);
if (clash.length) {
  console.log('not written: try another --seed');
  process.exit(1);
}

// ---------- write js/clubs.js ----------
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
edit('js/clubs.js', (t) => {
  const blocks = LEAGUES.map((lg) => {
    const rows = lg.clubs.map((c) => out.clubs[codeOf.get(c)].row.slice(0, 9)).sort((a, b) => b[6] - a[6]);
    return `  FM.D.CLUBS_${lg.id} = [\n${rows.map(rowText).join('\n')}\n  ];\n`;
  }).join('');
  const at = t.indexOf('  FM.D.CLUB_INFO = Object.fromEntries(');
  if (at < 0) throw new Error('CLUB_INFO not found');
  t = t.slice(0, at) + blocks + t.slice(at);
  // the abbreviation, nickname and founding year of each club
  const info = Object.values(out.clubs)
    .map((c) => `${c.row[1]}|${c.short}|${c.nick}|${c.founded}`)
    .join('\n');
  const end = t.indexOf(
    '`' + String.fromCharCode(10) + '      .split(',
    t.indexOf('FM.D.CLUB_INFO = Object.fromEntries('),
  );
  if (end < 0) throw new Error('CLUB_INFO end not found');
  t = t.slice(0, end) + '\n' + info + t.slice(end);
  // derbies
  const rv = t.indexOf('FM.D.RIVALS = [');
  const rend = t.indexOf('\n  ];', rv);
  const lines = out.rivals.map(([a, b, n]) => `    [${lit(a)}, ${lit(b)}, ${lit(n)}],`).join('\n');
  t = t.slice(0, rend) + '\n' + lines + t.slice(rend);
  return t;
});

// ---------- write js/data.js ----------
edit('js/data.js', (t) => {
  const entries = LEAGUES.map((lg) => {
    const o = out.leagues[lg.id];
    return `    {
      id: ${lit(lg.id)},
      nat: ${lit(lg.nat)},
      name: ${lit(o.name)},
      short: ${lit(lg.id)},
      tier: 1,
      sim: ${lit(lg.sim)},
      clubs: ${lit('CLUBS_' + lg.id)},
      repBand: [${lg.band.join(', ')}],
      rules: ${JSON.stringify(lg.rules)},
    },`;
  }).join('\n');
  // after the last league of the list (the South African one)
  const at = t.indexOf("      id: 'ZA1',");
  if (at < 0) throw new Error('ZA1 not found');
  const close = t.indexOf('\n    },\n', at) + '\n    },\n'.length;
  t = t.slice(0, close) + entries + '\n' + t.slice(close);
  // the nationality mix of each league
  const mix = LEAGUES.map((lg) => {
    const m = Object.fromEntries(Object.entries(lg.mix).filter(([n, w]) => w > 0 && (D.NATIONS[n] || n === 'TAN')));
    return `    ${lg.id}: ${JSON.stringify(m).replace(/"/g, '')},`;
  }).join('\n');
  const sa2 = t.indexOf('    SA2: {', t.indexOf('NAT_MIX'));
  const sa2end = t.indexOf('\n    },', sa2) + '\n    },'.length;
  // (SA2's own mix is written over several lines or one: find the end of the entry either way)
  const lineEnd = t.slice(sa2, t.indexOf('\n', sa2)).trimEnd().endsWith('},') ? t.indexOf('\n', sa2) : sa2end;
  t = t.slice(0, lineEnd) + '\n' + mix + t.slice(lineEnd);
  return t;
});

// ---------- the names databases ----------
const db = (file, fn) => {
  // (data/real-world.json is in the private folder now; where it is not, only the fictional names are written)
  const f = file === 'data/real-world.json' ? privateFile('real-world.json') : path.join(ROOT, file);
  if (!f) return console.log('skipped ' + file + ': ' + missing('real-world.json'));
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  fn(j);
  fs.writeFileSync(f, JSON.stringify(j, null, 1) + '\n');
};
db('data/real-world.json', (j) => {
  Object.assign(j.clubs, real.clubs);
  Object.assign(j.leagues, real.leagues);
  j.rivals.push(...real.rivals);
  for (const [k, v] of Object.entries(real.nations)) j.nations[k] = v;
  j.nations.TAN = 'Tanzania';
});
db('data/fictional-world.json', (j) => {
  Object.assign(j.clubs, out.clubs);
  Object.assign(j.leagues, out.leagues);
  j.rivals.push(...out.rivals);
  for (const [k, v] of Object.entries(real.nations)) j.nations[k] = v;
  j.nations.TAN = 'Tanzania';
});
console.log('written: now edit the continental places and registration rules, run the abbreviations and format');
