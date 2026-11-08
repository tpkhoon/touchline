// The OFC Pro League (real-formats sheet 08): an eight-club league of the Oceania confederation, one club from each of seven nations
// of the region plus an Australian one, in the engine's cross-nation league form (the league `nats` and D.CLUB_NAT: each club keeps its
// own nation, national cup and players). Fictional clubs from the name library.
//   node tools/crossleague.mjs           report
//   node tools/crossleague.mjs --write   write js/clubs.js, js/data.js and js/geo.js (once)
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, loadSim, ROOT } from './harness.mjs';
import { generate } from './worldgen.mjs';

const NATS = ['NZL', 'FIJ', 'SOL', 'VAN', 'PNG', 'TAH', 'NCL', 'AUS'];
const REPS = [36, 34, 31, 30, 30, 29, 28, 33];
const COLS = ['#0057B8', '#E30613', '#00843D', '#FFD100', '#001F5B', '#6CACE4', '#000000', '#6A1B9A'];
const args = parseArgs();
const { FM } = loadSim(1);
const D = FM.D;
if (D.LEAGUES.some((l) => l.id === 'OC1') && !('force' in args)) {
  console.log('the OFC Pro League is already in the game');
  process.exit(0);
}
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
NATS.forEach((n, i) => {
  const key = `Y${i}`;
  real.nations[n] = D.NATIONS[n].name;
  real.leagues['P' + key] = { nat: n, tier: 1, name: key, short: key };
  real.clubs[key] = {
    league: 'P' + key,
    nat: n,
    row: [`Club ${key}`, key, `Place ${key}`, COLS[i], COLS[(i + 3) % 8], 'fan', REPS[i], `Ground ${key}`, 6000],
    short: key,
    nick: '',
    founded: '',
  };
});
const out = generate(
  real,
  +(args.seed || 61),
  D.allClubRows().flatMap((r) => [r[0], r[2], r[7]]),
);
const taken = new Set(D.allClubRows().map((r) => r[1])),
  used = new Set(Object.values(D.CLUB_INFO).map((i) => i[0]));
const GENERIC = new Set(['FC', 'AS', 'AC', 'SC', 'CS', 'FA']);
const clubs = NATS.map((n, i) => {
  const o = out.clubs[`Y${i}`];
  const word = (o.row[0].split(/\s+/).find((w) => !GENERIC.has(w.toUpperCase()) && w.length >= 3) || o.row[0])
    .normalize('NFD')
    .replace(/[^A-Za-z]/g, '');
  let a = word.slice(0, 3).toUpperCase();
  const L = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  for (let k = 0; (taken.has(a) || used.has(a)) && k < 576; k++)
    a = k < 24 ? a.slice(0, 2) + L[k] : a[0] + L[Math.floor(k / 24) % 24] + L[k % 24];
  taken.add(a);
  used.add(a);
  const row = [
    o.row[0],
    a,
    o.row[2],
    COLS[i],
    COLS[(i + 3) % 8],
    'fan',
    REPS[i],
    o.row[7],
    4000 + Math.round(((REPS[i] - 20) * 250) / 500) * 500,
  ];
  console.log(n, row.slice(0, 3).join(' / '));
  return { nat: n, row, abbr: a, nick: o.nick || '', founded: o.founded || '' };
});
if (!('write' in args)) process.exit(0);
const lit = (v) => (typeof v === 'string' ? `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'` : String(v));
const edit = (file, fn) => {
  const f = path.join(ROOT, file);
  let t = fs.readFileSync(f, 'utf8');
  const crlf = t.includes('\r\n');
  if (crlf) t = t.replace(/\r\n/g, '\n');
  t = fn(t);
  fs.writeFileSync(f, crlf ? t.replace(/\n/g, '\r\n') : t);
};
edit('js/clubs.js', (t) => {
  const rows = clubs.map((c) => `    [${c.row.map(lit).join(', ')}],`).join('\n');
  const at = t.indexOf('  FM.D.CLUB_INFO = Object.fromEntries(');
  t = t.slice(0, at) + `  FM.D.CLUBS_OC1 = [\n${rows}\n  ];\n` + t.slice(at);
  const end = t.indexOf(
    '`' + String.fromCharCode(10) + '      .split(',
    t.indexOf('FM.D.CLUB_INFO = Object.fromEntries('),
  );
  return (
    t.slice(0, end) + '\n' + clubs.map((c) => `${c.row[1]}|${c.abbr}|${c.nick}|${c.founded}`).join('\n') + t.slice(end)
  );
});
const geoText = fs.readFileSync(path.join(ROOT, 'js/geo.js'), 'utf8');
const geo = new Map();
for (const line of geoText.split('\n')) {
  const m = /^([A-Z0-9]+):(-?[\d.]+),(-?[\d.]+)$/.exec(line.trim());
  if (m) geo.set(m[1], [+m[2], +m[3]]);
}
let st = 7;
const rnd = () => (st = (st * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
edit('js/geo.js', (t) => {
  const lines = clubs.map((c) => {
    const spots = D.LEAGUES.filter((l) => l.nat === c.nat && l.id !== 'OC1').flatMap((l) =>
      D[l.clubs].map((r) => geo.get(r[1])).filter(Boolean),
    );
    const [la, lo] = spots.length ? spots[Math.floor(rnd() * spots.length)] : [-18, 178];
    return `${c.row[1]}:${(la + (rnd() - 0.5) * 0.3).toFixed(2)},${(lo + (rnd() - 0.5) * 0.3).toFixed(2)}`;
  });
  const at = t.lastIndexOf('`;');
  return t.slice(0, at) + '\n' + lines.join('\n') + t.slice(at);
});
edit('js/data.js', (t) => {
  const entry = `    {
      id: 'OC1',
      nat: 'NZL',
      name: 'Oceania Professional League',
      short: 'OC1',
      tier: 2,
      sim: 'minimal',
      clubs: 'CLUBS_OC1',
      repBand: [36, 28],
      nats: [${NATS.slice(1).map(lit).join(', ')}],
      rules: { rounds: 14 },
    },`;
  const at = t.indexOf('\n  ];\n  FM.D.CONTINENTALS = [');
  t = t.slice(0, at) + '\n' + entry + t.slice(at);
  // (each club keeps its own nation)
  t = t.replace(
    '  FM.D.CLUB_NAT = {\n',
    `  FM.D.CLUB_NAT = {\n${clubs.map((c) => `    ${c.row[1]}: ${lit(c.nat)},`).join('\n')}\n`,
  );
  const f = t.indexOf('  FM.D.facts = () => ({');
  return t.slice(0, f) + '  FM.D.NAT_MIX.OC1 = {};\n' + t.slice(f);
});
console.log('written: run prettier on the three files');
