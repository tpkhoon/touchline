// Adds the leagues of newleagues2-data.mjs (in the private folder) to the game: second divisions for Japan, Korea, Thailand, Indonesia and
// Vietnam (each linked to the division above by promotion and relegation) and first divisions for India, Chile, Peru and Paraguay.
// Fictional clubs from the name library are written into js/clubs.js (club rows, abbreviations, nicknames, derbies) and js/data.js (the
// leagues and their nationality mixes), and into the two names databases. A club's code (its id) is made from its fictional name.
//   node tools/newleagues2.mjs [--seed 20]          report (the names it would make, and any name already in the world)
//   node tools/newleagues2.mjs --write [--seed 20]  write the files (once: it stops if the leagues are already there)
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, loadSim, ROOT } from './harness.mjs';
import { generate } from './worldgen.mjs';
import { pathToFileURL } from 'node:url';
import { privateFile, missing } from './private.mjs';

const dataName = (process.argv.join(' ').match(/--data (\S+)/) || [])[1] || 'newleagues2-data.mjs';
const dataFile = privateFile(dataName);
if (!dataFile) {
  console.log(missing(dataName));
  process.exit(0);
}
const { LEAGUES } = await import(pathToFileURL(dataFile).href);

const args = parseArgs();
const seed = +(args.seed || 20);
const { FM } = loadSim(1);
const D = FM.D;
if (D.LEAGUES.some((l) => l.id === LEAGUES[0].id) && !('force' in args)) {
  console.log('the leagues are already in the game');
  process.exit(0);
}

// ---------- the structure, as a "real" world for the generator (temporary codes) ----------
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
for (const lg of LEAGUES) {
  real.leagues[lg.id] = { nat: lg.nat, tier: lg.tier, name: lg.real, short: lg.id };
  for (const c of lg.clubs)
    real.clubs[c.code] = {
      league: lg.id,
      nat: lg.nat,
      row: [c.name, c.code, c.city, c.c1, c.c2, c.idt, c.rep, `${c.city} Stadium`, c.cap],
      short: c.code,
      nick: '',
      founded: '',
    };
}
// derbies: the two biggest clubs of a town (at most three a league)
for (const lg of LEAGUES) {
  const cl = lg.clubs.map((c) => real.clubs[c.code]);
  const byCity = {},
    pairs = [];
  for (const c of cl.slice().sort((p, q) => q.row[6] - p.row[6]))
    (byCity[c.row[2]] = byCity[c.row[2]] || []).push(c.row[1]);
  for (const list of Object.values(byCity)) if (list.length >= 2 && pairs.length < 3) pairs.push([list[0], list[1]]);
  real.rivals.push(...pairs.map(([a, b]) => [a, b, 'Derby']));
}
const avoid = D.allClubRows().flatMap((r) => [r[0], r[2], r[7]]);
const out = generate(real, seed, avoid);

// ---------- the clubs' own codes, from their fictional names ----------
const finalCode = {};
for (const lg of LEAGUES)
  for (const c of lg.clubs) {
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
  }
const fixed = (code) => finalCode[code] || code;
out.rivals = out.rivals.map(([a, b, n]) => [fixed(a), fixed(b), n]);
const reKey = (clubs) => Object.fromEntries(Object.entries(clubs).map(([k, v]) => [fixed(k), v]));
out.clubs = reKey(out.clubs);
real.clubs = reKey(real.clubs);
for (const [k, v] of Object.entries(real.clubs)) v.row[1] = k;
real.rivals = real.rivals.map(([a, b, n]) => [fixed(a), fixed(b), n]);

// ---------- names that clash with the world's ----------
const have = new Set(D.allClubRows().flatMap((r) => [r[0], r[2], r[7]]));
const clash = Object.values(out.clubs).filter((c) => have.has(c.row[0]) || have.has(c.row[7]));
console.log(
  `${Object.keys(out.clubs).length} clubs in ${LEAGUES.length} leagues, seed ${seed}; ${clash.length} names clash with the world's`,
);
for (const c of clash) console.log('  clash:', c.row[0], '/', c.row[7]);
for (const lg of LEAGUES)
  console.log(
    `${lg.id} ${out.leagues[lg.id].name}: ${lg.clubs
      .slice(0, 4)
      .map((c) => out.clubs[fixed(c.code)].row[0])
      .join(', ')}`,
  );
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
    const rows = lg.clubs.map((c) => out.clubs[fixed(c.code)].row.slice(0, 9)).sort((a, b) => b[6] - a[6]);
    return `  FM.D.CLUBS_${lg.id} = [\n${rows.map(rowText).join('\n')}\n  ];\n`;
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
  const rv = t.indexOf('FM.D.RIVALS = [');
  const rend = t.indexOf('\n  ];', rv);
  t =
    t.slice(0, rend) +
    '\n' +
    out.rivals.map(([a, b, n]) => `    [${lit(a)}, ${lit(b)}, ${lit(n)}],`).join('\n') +
    t.slice(rend);
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
      tier: ${lg.tier},
      sim: ${lit(lg.sim)},
      clubs: ${lit('CLUBS_' + lg.id)},
      repBand: [${lg.band.join(', ')}],
      rules: ${JSON.stringify(lg.rules)},
    },`;
  }).join('\n');
  // (after the last league of the list, which ends where the continental cups begin)
  const at = t.indexOf('\n  ];\n  FM.D.CONTINENTALS = [');
  if (at < 0) throw new Error('the end of the league list was not found');
  t = t.slice(0, at) + '\n' + entries + t.slice(at);
  // the nationality mixes: a first division brings its own, a second division plays with its parent's
  const own = LEAGUES.filter((lg) => lg.mix)
    .map((lg) => `    ${lg.id}: ${JSON.stringify(lg.mix).replace(/"/g, '')},`)
    .join('\n');
  const inherit = LEAGUES.filter((lg) => lg.parent)
    .map((lg) => `  FM.D.NAT_MIX.${lg.id} = FM.D.NAT_MIX.${lg.parent};`)
    .join('\n');
  const f = t.indexOf('  FM.D.facts = () => ({');
  t = t.slice(0, f) + `  Object.assign(FM.D.NAT_MIX, {\n${own}\n  });\n${inherit}\n` + t.slice(f);
  return t;
});

// ---------- the names databases ----------
const db = (file, fn) => {
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
});
db('data/fictional-world.json', (j) => {
  Object.assign(j.clubs, out.clubs);
  Object.assign(j.leagues, out.leagues);
  j.rivals.push(...out.rivals);
  for (const [k, v] of Object.entries(real.nations)) j.nations[k] = v;
});
console.log(
  'written: now run tools/abbrevs.mjs --write (club abbreviations: unique, never rude), then edit the promotion and relegation rules of the parent leagues, the continental places and the registration rules, then run the geocoder, the abbreviations and the formatter',
);
