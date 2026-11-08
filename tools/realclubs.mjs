// Brings each league's club list to the real club count of docs/real-formats/02-leagues.tsv: adds fictional clubs (names from
// tools/namegen.mjs, in the weaker end of the league's repBand) and removes the surplus weakest ones.
//   node tools/realclubs.mjs [--seed 5]          report what it would do
//   node tools/realclubs.mjs --write [--seed 5]  write js/clubs.js (club rows and CLUB_INFO lines) once
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, loadSim, ROOT } from './harness.mjs';
import { generateNames } from './namegen.mjs';

const args = parseArgs();
const seed = +(args.seed || 5);
const { FM } = loadSim(1);
const D = FM.D;
const sheet = fs
  .readFileSync(path.join(ROOT, 'docs/real-formats/02-leagues.tsv'), 'utf8')
  .split(/\r?\n/)
  .filter(Boolean)
  .map((l) => l.split('\t'))
  .slice(1);
// leagues the sheet's count does not fit by a plain add or remove are left to their own code
const SKIP = new Set(args.skip ? args.skip.split(',') : []);
const rngOf = (s) => {
  let h = 2166136261;
  for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const have = new Set(D.allClubRows().flatMap((r) => [r[0], r[2], r[7]]));
const taken = new Set(D.allClubRows().map((r) => r[1]));
const COL = ['#0057B8', '#FFFFFF', '#E30613', '#00843D', '#FFD100', '#000000'];
const code = (name) => {
  const words = name
    .normalize('NFD')
    .replace(/[^A-Za-z ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const letters = (
    words.length > 1 ? words.map((w) => w[0]).join('') + words.slice(-1)[0] : words[0] || 'XXX'
  ).toUpperCase();
  const base = letters.padEnd(3, 'X').slice(0, 3);
  for (let i = 0; i < 400; i++) {
    const c = i === 0 ? base : base.slice(0, 2) + 'ABCDEFGHJKLMNPQRSTUVWXYZ'[(i - 1) % 24] + (i > 24 ? String(i) : '');
    if (!taken.has(c)) {
      taken.add(c);
      return c;
    }
  }
  throw new Error('no code for ' + name);
};
const rows = {},
  drop = [],
  report = [];
for (const r of sheet) {
  const lg = D.LEAGUES.find((l) => l.id === r[0]);
  const want = +r[6];
  if (!lg || SKIP.has(lg.id)) continue;
  const list = D[lg.clubs].slice().sort((a, b) => b[6] - a[6]);
  if (list.length === want) continue;
  if (list.length > want) {
    const out = list.slice(want);
    out.forEach((c) => drop.push(c[1]));
    report.push(`${lg.id}: remove ${out.map((c) => c[0]).join(', ')}`);
    continue;
  }
  const n = want - list.length,
    R = rngOf(lg.id + seed),
    lo = lg.repBand[1],
    low = Math.min(...list.map((c) => c[6])),
    gens = generateNames({ kind: 'clubs', nat: lg.nat, count: 120, seed }),
    grounds = generateNames({ kind: 'grounds', nat: lg.nat, count: 60, seed }).items.filter((g) => !g.flags.length);
  const add = [];
  for (const g of gens.items) {
    if (add.length >= n) break;
    if (g.flags.length || have.has(g.name) || have.has(g.note) || g.name.length > 26) continue;
    const city = g.note;
    if (add.some((a) => a[2] === city)) continue;
    const rep = Math.max(lo, Math.round(low - 1 - R() * Math.min(5, Math.max(2, (low - lo) * 0.6 + 2))));
    const c1 = COL[Math.floor(R() * COL.length)];
    let c2 = COL[Math.floor(R() * COL.length)];
    while (c2 === c1) c2 = COL[Math.floor(R() * COL.length)];
    const ground =
      R() < 0.5 && grounds.length ? grounds.splice(Math.floor(R() * grounds.length), 1)[0].name : `${city} Stadium`;
    if (have.has(ground)) continue;
    const caps = list.map((c) => c[8]).sort((a, b) => a - b);
    const cap = caps[Math.floor(R() * Math.min(caps.length, Math.max(3, Math.ceil(caps.length * 0.6))))];
    const row = [g.name, code(g.name), city, c1, c2, R() < 0.25 ? 'selling' : 'fan', rep, ground, cap];
    [g.name, city, ground].forEach((x) => have.add(x));
    add.push(row);
  }
  if (add.length < n) throw new Error(`${lg.id}: only ${add.length} of ${n} names`);
  rows[lg.id] = { lg, add };
  report.push(`${lg.id} (${lg.nat}): add ${add.map((a) => `${a[0]} [${a[1]}] ${a[6]}`).join('; ')}`);
}
console.log(report.join('\n'));
console.log(
  `${Object.keys(rows).length} leagues grow (${Object.values(rows).reduce((s, x) => s + x.add.length, 0)} clubs), ${drop.length} clubs go`,
);
if (!('write' in args)) process.exit(0);

const f = path.join(ROOT, 'js/clubs.js');
let t = fs.readFileSync(f, 'utf8');
const crlf = t.includes('\r\n');
if (crlf) t = t.replace(/\r\n/g, '\n');
const lit = (v) => (typeof v === 'string' ? `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'` : String(v));
const block = (lg, list) => {
  const at = t.indexOf(`  FM.D.${lg.clubs} = [`);
  const end = t.indexOf('\n  ];', at);
  if (at < 0 || end < 0) throw new Error('block not found ' + lg.clubs);
  t =
    t.slice(0, at) +
    `  FM.D.${lg.clubs} = [\n${list.map((r) => `    [${r.map(lit).join(', ')}],`).join('\n')}` +
    t.slice(end);
};
for (const { lg, add } of Object.values(rows))
  block(
    lg,
    D[lg.clubs].concat(add).sort((a, b) => b[6] - a[6]),
  );
for (const lg of D.LEAGUES) {
  if (rows[lg.id] || !D[lg.clubs].some((c) => drop.includes(c[1]))) continue;
  block(
    lg,
    D[lg.clubs].filter((c) => !drop.includes(c[1])),
  );
}
// CLUB_INFO: a line for each new club, none for a removed one
const infoAt = t.indexOf('FM.D.CLUB_INFO = Object.fromEntries(');
const open = t.indexOf('`', infoAt) + 1;
const close = t.indexOf('`\n      .split(', infoAt);
let lines = t.slice(open, close).split('\n');
lines = lines.filter((l) => !drop.includes(l.split('|')[0]));
const NICK = [
  'Rovers',
  'Eagles',
  'Lions',
  'Stars',
  'Warriors',
  'Falcons',
  'Tigers',
  'Wolves',
  'Hawks',
  'Bulls',
  'Panthers',
  'Rangers',
];
const nr = rngOf('nick' + seed);
for (const { add } of Object.values(rows))
  for (const a of add)
    lines.push(`${a[1]}|${a[1]}|${NICK[Math.floor(nr() * NICK.length)]}|${1900 + Math.floor(nr() * 90)}`);
t = t.slice(0, open) + lines.join('\n') + t.slice(close);
// derbies naming a removed club
t = t
  .split('\n')
  .filter((l) => !(/^\s+\['[A-Z0-9]+', '[A-Z0-9]+', '[^']*'\],?$/.test(l) && drop.some((c) => l.includes(`'${c}'`))))
  .join('\n');
if (crlf) t = t.replace(/\n/g, '\r\n');
fs.writeFileSync(f, t);

// js/geo.js: a place for each new club (near the league's other clubs), none for a removed one
const gf = path.join(ROOT, 'js/geo.js');
let g = fs.readFileSync(gf, 'utf8');
const gcrlf = g.includes('\r\n');
if (gcrlf) g = g.replace(/\r\n/g, '\n');
g = g
  .split('\n')
  .filter((l) => !drop.some((c) => l.startsWith(c + ':')))
  .join('\n');
const gr = rngOf('geo' + seed);
const lines2 = [];
for (const { lg, add } of Object.values(rows))
  for (const a of add) {
    const near = D[lg.clubs].map((c) => D.GEO[c[1]]).filter(Boolean);
    const [la, lo] = near.length ? near[Math.floor(gr() * near.length)] : [0, 0];
    lines2.push(`${a[1]}:${(la + (gr() - 0.5) * 1.6).toFixed(2)},${(lo + (gr() - 0.5) * 1.6).toFixed(2)}`);
  }
const end = g.lastIndexOf('`;', g.indexOf('FM.D.GEO = Object.fromEntries('));
g = g.slice(0, end) + '\n' + lines2.join('\n') + g.slice(end);
if (gcrlf) g = g.replace(/\n/g, '\r\n');
fs.writeFileSync(gf, g);
console.log('written');
