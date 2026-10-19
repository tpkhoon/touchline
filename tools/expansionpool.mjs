// The expansion clubs: for every closed league (no promotion or relegation, nothing coming up or down) a few ready-made fictional clubs that
// can join it at the start of a new season (Sea.runExpansions, with an expansion draft). Made with the same name libraries as the
// rest of the world (tools/namelib.mjs, tools/worldgen.mjs), each row [name, code, city, colour 1, colour 2, identity, reputation,
// ground, capacity, abbreviation, nickname], written to js/expansion.js (FM.D.EXPANSION, by league id).
//   node tools/expansionpool.mjs [--seed 41] [--per 4]          report
//   node tools/expansionpool.mjs --write [--seed 41] [--per 4]  write js/expansion.js
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, loadSim, ROOT } from './harness.mjs';
import { generate } from './worldgen.mjs';
import { isRude } from './namelib.mjs';

const args = parseArgs();
const seed = +(args.seed || 41),
  per = +(args.per || 4);
const { FM } = loadSim(1);
const D = FM.D;

// a league is closed when nothing is promoted or relegated into or out of it
const inbound = new Set(
  D.LEAGUES.flatMap((l) => [
    l.rules && l.rules.promote && l.rules.promote.to,
    l.rules && l.rules.relegate && l.rules.relegate.to,
  ]).filter(Boolean),
);
const closed = D.LEAGUES.filter((l) => !(l.rules && (l.rules.promote || l.rules.relegate)) && !inbound.has(l.id));

const COLOURS = [
  '#C8102E',
  '#003DA5',
  '#FFFFFF',
  '#000000',
  '#FFD100',
  '#00843D',
  '#F26522',
  '#6A1B9A',
  '#6CACE4',
  '#8A1538',
  '#001F5B',
];
const IDS = ['selling', 'fan', 'youth', 'selling', 'historic'];
const hash = (s) => {
  let h = 2166136261;
  for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
};

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
const meta = {};
for (const l of closed) {
  const reps = D[l.clubs].map((r) => r[6]).sort((a, b) => a - b);
  const base = reps[Math.floor(reps.length * 0.25)] - 3;
  real.leagues[l.id] = { nat: l.nat, tier: 1, name: l.name, short: l.id };
  real.nations[l.nat] = (D.NATIONS[l.nat] || { name: l.nat }).name;
  for (let i = 0; i < per; i++) {
    const code = `x${l.id}${i}`;
    const c1 = COLOURS[hash(code + 'a') % COLOURS.length];
    let c2 = COLOURS[hash(code + 'b') % COLOURS.length];
    if (c2 === c1) c2 = c1 === '#FFFFFF' ? '#000000' : '#FFFFFF';
    const rep = Math.max(30, Math.min(80, base - i));
    const cap = Math.max(5000, Math.round((8000 + (rep - 40) * 900) / 500) * 500);
    meta[code] = { lid: l.id, i };
    real.clubs[code] = {
      league: l.id,
      nat: l.nat,
      row: [
        `Club ${code}`,
        code,
        `Town ${code}`,
        c1,
        c2,
        IDS[hash(code + 'i') % IDS.length],
        rep,
        `Ground ${code}`,
        cap,
      ],
      short: code,
      nick: '',
      founded: '',
    };
  }
}
const avoid = D.allClubRows().flatMap((r) => [r[0], r[2], r[7]]);
const out = generate(real, seed, avoid);

// ids and abbreviations of their own, from the names
const usedAbbr = new Set(D.allClubRows().map((r) => (D.CLUB_INFO[r[1]] || [])[0] || r[1]));
const rows = {};
for (const [tmp, c] of Object.entries(out.clubs)) {
  const o = c.row;
  let code = String(c.short || o[0].slice(0, 3))
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 3);
  for (let i = 0; taken.has(code) || code.length < 3; i++)
    code = (code.slice(0, 2) || 'X') + 'ABCDEFGHJKLMNPQRSTUVWXYZ'[i % 24] + (i >= 24 ? String(i) : '');
  taken.add(code);
  const abbr = FM.U.abbrev(o[0], usedAbbr, isRude);
  usedAbbr.add(abbr);
  (rows[meta[tmp].lid] = rows[meta[tmp].lid] || []).push([
    o[0],
    code,
    o[2],
    o[3],
    o[4],
    o[5],
    o[6],
    o[7],
    o[8],
    abbr,
    c.nick || '',
  ]);
}
const clash = Object.values(rows)
  .flat()
  .filter((r) => avoid.includes(r[0]) || avoid.includes(r[7]));
console.log(
  `${closed.length} closed leagues, ${Object.values(rows).flat().length} clubs, seed ${seed}; ${clash.length} names clash with the world`,
);
if (!('write' in args)) {
  for (const l of closed.slice(0, 8)) console.log(l.id, (rows[l.id] || []).map((r) => `${r[0]} (${r[9]})`).join(' | '));
  process.exit(clash.length ? 1 : 0);
}
if (clash.length) {
  console.log('not written: try another --seed');
  process.exit(1);
}
const lit = (v) => (typeof v === 'string' ? `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'` : String(v));
let text = `// The expansion clubs: ready-made fictional clubs that can join a closed league at the start of a new season, with an expansion draft
// (Sea.runExpansions in js/season.js). A row: [name, code, city, colour 1, colour 2, identity, reputation, ground, capacity, abbreviation,
// nickname]. Made by tools/expansionpool.mjs from the same name libraries as the rest of the world.
(function () {
  FM.D.EXPANSION = {
`;
for (const l of closed)
  text += `    ${l.id}: [\n${(rows[l.id] || []).map((r) => `      [${r.map(lit).join(', ')}],`).join('\n')}\n    ],\n`;
text += '  };\n})();\n';
fs.writeFileSync(path.join(ROOT, 'js/expansion.js'), text);
console.log('written: js/expansion.js');
