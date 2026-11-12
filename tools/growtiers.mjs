// Grows divisions that are a single table in the game to the real total of their regional groups (docs/real-formats/ sheets 12 to
// 14): Italy's Serie C is three groups of 20, so IT3 grows from 20 to 60 fictional clubs and the division plays as three tables
// (rules.pools, see js/data.js). The new clubs are made like tools/newtiers.mjs makes them (names from the name library, none that
// the world already has), spread over the division's reputation band, and put near the nation's existing clubs on the map.
//   node tools/growtiers.mjs [--seed 43]          report (the names it would make, and any name already in the world)
//   node tools/growtiers.mjs --write [--seed 43]  write js/clubs.js and js/geo.js (a division already at its size is left alone)
// Afterwards: node tools/abbrevs.mjs --write (club abbreviations), then prettier on js/clubs.js and js/geo.js.
//   --only IT3,FR4 ...   grow just these divisions
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, loadSim, ROOT } from './harness.mjs';
import { generate } from './worldgen.mjs';

// division id -> clubs in all its groups (the real total; the sheet's group sizes, rounded to the game's)
export const GROW = {
  IT3: 60, // Serie C: three groups of 20
  FR4: 48, // National 2: three groups of 16
  DE4: 90, // Regionalliga: five leagues of 18
  ES4: 90, // Segunda Federación: five groups of 18
  AT3: 48, // Regionalliga: three groups of 16
  HU3: 48, // NB III: three groups of 16
  PL4: 72, // III liga: four groups of 18
  CZ3: 32, // ČFL and MSFL: two groups of 16
  NO3: 28, // 2. divisjon: two groups of 14
  SE3: 32, // Ettan: two groups of 16
  PT3: 24, // Liga 3: two groups of 12
  AR2: 36, // Primera Nacional: two zones of 18
};

const args = parseArgs();
const ONLY = args.only ? new Set(String(args.only).split(',')) : null;
const seed = +(args.seed || 43);
const { FM } = loadSim(1);
const D = FM.D;

// ---------- numbers: a seeded stream, so the same seed makes the same clubs ----------
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

const byId = Object.fromEntries(D.LEAGUES.map((l) => [l.id, l]));
const todo = [];
for (const [id, total] of Object.entries(GROW)) {
  if (ONLY && !ONLY.has(id)) continue;
  const l = byId[id];
  if (!l) throw new Error(`no league ${id}`);
  const have = (D[l.clubs] || []).length;
  if (have >= total) continue;
  todo.push({ id, nat: l.nat, tier: l.tier, band: l.repBand || [40, 30], have, total, rows: D[l.clubs] });
}
if (!todo.length) {
  console.log('the divisions are already at their sizes');
  process.exit(0);
}

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
for (const n of new Set(todo.map((l) => l.nat))) real.nations[n] = (D.NATIONS[n] || { name: n }).name;
for (const l of todo) {
  real.leagues[l.id] = { nat: l.nat, tier: l.tier, name: l.id, short: l.id };
  l.added = [];
  for (let i = l.have; i < l.total; i++) {
    const code = `${l.id}${String(i).padStart(2, '0')}`;
    const [hi, lo] = l.band;
    const rep = Math.round(lo + (hi - lo) * rnd());
    const c1 = pick(COLS);
    let c2 = pick(COLS);
    while (c2 === c1) c2 = pick(COLS);
    const cap = Math.round((3000 + (rep - 20) * 450 + rnd() * 5000) / 500) * 500;
    l.added.push({ code, rep, c1, c2, idt: pick(IDT), cap });
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

// ---------- the clubs' own codes, from their fictional names ----------
const finalCode = {};
for (const l of todo)
  for (const c of l.added) {
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

const have = new Set(D.allClubRows().flatMap((r) => [r[0], r[2], r[7]]));
const clash = Object.values(out.clubs).filter((c) => have.has(c.row[0]) || have.has(c.row[7]));
console.log(
  `${Object.keys(out.clubs).length} clubs added to ${todo.length} divisions, seed ${seed}; ${clash.length} names clash with the world's`,
);
for (const c of clash) console.log('  clash:', c.row[0], '/', c.row[7]);
for (const l of todo)
  console.log(
    `${l.id} ${l.have} -> ${l.total}: ${l.added
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

edit('js/clubs.js', (t) => {
  for (const l of todo) {
    const head = `  FM.D.CLUBS_${l.id} = [\n`;
    const at = t.indexOf(head);
    if (at < 0) throw new Error(`CLUBS_${l.id} not found`);
    const end = t.indexOf('\n  ];\n', at);
    // (the whole table again, the best clubs first as in the other divisions)
    const rows = l.rows
      .map((r) => r.slice(0, 9))
      .concat(l.added.map((c) => out.clubs[fixed(c.code)].row.slice(0, 9)))
      .sort((a, b) => b[6] - a[6]);
    t = t.slice(0, at) + head + rows.map(rowText).join('\n') + t.slice(end);
  }
  const info = Object.values(out.clubs)
    .map((c) => `${c.row[1]}|${c.short}|${c.nick}|${c.founded}`)
    .join('\n');
  const end = t.indexOf(
    '`' + String.fromCharCode(10) + '      .split(',
    t.indexOf('FM.D.CLUB_INFO = Object.fromEntries('),
  );
  if (end < 0) throw new Error('CLUB_INFO end not found');
  return t.slice(0, end) + '\n' + info + t.slice(end);
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
for (const l of todo)
  for (const c of l.added) {
    const code = fixed(c.code),
      spots = natSpots[l.nat] || [[20, 0]];
    const [la, lo] = pick(spots);
    lines.push(`${code}:${(la + (rnd() - 0.5) * 1.2).toFixed(2)},${(lo + (rnd() - 0.5) * 1.6).toFixed(2)}`);
  }
edit('js/geo.js', (t) => {
  const at = t.lastIndexOf('`;');
  return t.slice(0, at) + '\n' + lines.join('\n') + t.slice(at);
});
console.log('written. Now: node tools/abbrevs.mjs --write, then prettier on js/clubs.js js/geo.js');
