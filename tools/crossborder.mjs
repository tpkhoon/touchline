// Cross-border clubs (real-formats sheet 07): clubs that play in another nation's league. A club of a host league is renamed in
// the style of its home nation (a fictional name, town and ground), given that nation (D.CLUB_NAT, which the engine already reads:
// the club keeps its own nationality, national cup and players) and the league is opened to that nation (`nats` on the league).
// Where the home is not a nation of the game (a principality, a small state, Brunei) the club is named in the style of a neighbour
// and keeps the host's nationality: the table CROSS_BORDER in js/data.js lists it with its real home as a note.
//   node tools/crossborder.mjs           report
//   node tools/crossborder.mjs --write   write js/clubs.js, js/data.js and js/geo.js (once)
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, loadSim, ROOT } from './harness.mjs';
import { generate } from './worldgen.mjs';

// [host league, position in the league's club list (best first), home nation of the game or '', style nation, label for the note]
const PLAN = [
  ['FR1', 5, '', 'FRA', 'A principality on the French coast with no league of its own'],
  ['D2', 10, 'WAL', 'WAL', 'A Welsh club in the English pyramid'],
  ['D2', 3, 'WAL', 'WAL', 'A Welsh club in the English pyramid'],
  ['D3', 8, 'WAL', 'WAL', 'A Welsh club in the English pyramid'],
  ['D4', 12, 'WAL', 'WAL', 'A Welsh club in the English pyramid'],
  ['ES2', 9, '', 'ESP', 'A club from the mountain principality, in the Spanish pyramid'],
  ['IE1', 3, 'NIR', 'NIR', 'A club from Northern Ireland in the League of Ireland'],
  ['WA1', 0, 'ENG', 'ENG', 'An English-based club in the Welsh league'],
  ['US1', 12, 'CAN', 'CAN', 'A Canadian club in the American league'],
  ['US1', 18, 'CAN', 'CAN', 'A Canadian club in the American league'],
  ['US1', 8, 'CAN', 'CAN', 'A Canadian club in the American league'],
  ['AU1', 7, 'NZL', 'NZL', 'A New Zealand club in the Australian league'],
  ['AU1', 4, 'NZL', 'NZL', 'A New Zealand club in the Australian league'],
  ['SG1', 5, 'JPN', 'JPN', 'A satellite of a Japanese club in the Singaporean league'],
  ['MY1', 9, '', 'MYS', 'A club from the small sultanate on Borneo, in the Malaysian league'],
];

const args = parseArgs();
const { FM } = loadSim(1);
const D = FM.D;
if (D.CLUB_NAT && Object.keys(D.CLUB_NAT).length && !('force' in args)) {
  console.log('the cross-border clubs are already in the game');
  process.exit(0);
}
const seed = +(args.seed || 52);
const byLeague = Object.fromEntries(D.LEAGUES.map((l) => [l.id, l]));
const picks = PLAN.map(([host, pos, home, style, label], i) => {
  const lg = byLeague[host];
  const rows = D[lg.clubs].filter((r) => !r[9]);
  const row = rows[Math.min(pos, rows.length - 1)];
  return { host, lg, row, home, style, label, key: `X${String(i).padStart(2, '0')}` };
});
const avoidNames = D.allClubRows().flatMap((r) => [r[0], r[2], r[7]]);
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
for (const p of picks) {
  real.nations[p.style] = (D.NATIONS[p.style] || { name: p.style }).name;
  real.leagues['P' + p.key] = { nat: p.style, tier: 1, name: p.key, short: p.key };
  real.clubs[p.key] = {
    league: 'P' + p.key,
    nat: p.style,
    row: [
      `Club ${p.key}`,
      p.key,
      `Place ${p.key}`,
      p.row[3],
      p.row[4],
      p.row[5],
      p.row[6],
      `Ground ${p.key}`,
      p.row[8],
    ],
    short: p.key,
    nick: '',
    founded: '',
  };
}
const out = generate(real, seed, avoidNames);
for (const p of picks) {
  const o = out.clubs[p.key];
  p.name = o.row[0];
  p.city = o.row[2];
  p.ground = o.row[7];
  p.nick = o.nick || '';
  p.founded = o.founded || '';
  console.log(`${p.host} ${p.row[0]} (${p.row[1]}) -> ${p.name}, ${p.city}, ${p.ground} [${p.home || 'host nation'}]`);
}
if (!('write' in args)) process.exit(0);

const lit = (v) => (typeof v === 'string' ? `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'` : String(v));
const edit = (file, fn) => {
  const f = path.join(ROOT, file);
  let t = fs.readFileSync(f, 'utf8');
  const crlf = t.includes('\r\n');
  if (crlf) t = t.replace(/\r\n/g, '\n');
  t = fn(t);
  if (crlf) t = t.replace(/\n/g, '\r\n');
  fs.writeFileSync(f, t);
};
// abbreviations: the first three letters of the first word that is not generic, unique across the world
const usedAbbr = new Set(Object.values(D.CLUB_INFO).map((i) => i[0]));
const GENERIC = new Set([
  'FC',
  'FK',
  'SK',
  'CF',
  'CD',
  'AC',
  'AS',
  'SC',
  'BK',
  'IF',
  'IK',
  'UD',
  'KV',
  'FF',
  'IL',
  'AFC',
  'RC',
  'CA',
  'US',
  'SV',
  'SD',
  'UE',
  'NK',
]);
for (const p of picks) {
  const word = (p.name.split(/\s+/).find((w) => !GENERIC.has(w.toUpperCase()) && w.length >= 3) || p.name)
    .normalize('NFD')
    .replace(/[^A-Za-z]/g, '');
  let a = word.slice(0, 3).toUpperCase();
  const L = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  for (let i = 0; usedAbbr.has(a) && i < 576; i++)
    a = i < 24 ? a.slice(0, 2) + L[i] : a[0] + L[Math.floor(i / 24) % 24] + L[i % 24];
  usedAbbr.add(a);
  p.abbr = a;
}

edit('js/clubs.js', (t) => {
  for (const p of picks) {
    const code = p.row[1];
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const q = (v) => `(?:${esc(lit(v))}|${esc(JSON.stringify(v))})`;
    const re = new RegExp(
      `\\[\\s*${q(p.row[0])},\\s*'${code}',\\s*${q(p.row[2])},\\s*([\\s\\S]*?),\\s*${q(p.row[7])}(?:,\\s*(\\d+))?,?\\s*\\],`,
    );
    if (!re.test(t)) throw new Error('row not found: ' + p.row[0]);
    t = t.replace(
      re,
      (m, mid, cap) => `[${lit(p.name)}, '${code}', ${lit(p.city)}, ${mid}, ${lit(p.ground)}${cap ? `, ${cap}` : ''}],`,
    );
    // its line in the club table: new abbreviation, nickname and founding year
    const infoRe = new RegExp(`^${code}\\|[^|\\n]*\\|[^|\\n]*\\|[^\\n]*$`, 'm');
    if (infoRe.test(t)) t = t.replace(infoRe, `${code}|${p.abbr}|${p.nick}|${p.founded}`);
    // its old derby: the pair goes (the other club keeps no rival)
    t = t.replace(
      new RegExp(`^\\s*\\[(?:'${code}', '[A-Z0-9]+'|'[A-Z0-9]+', '${code}'), (?:'[^'\\n]*'|"[^"\\n]*")\\],\\n`, 'm'),
      '',
    );
  }
  return t;
});

// where each is: near a club of its home nation
const geoText = fs.readFileSync(path.join(ROOT, 'js/geo.js'), 'utf8');
const geo = new Map();
for (const line of geoText.split('\n')) {
  const m = /^([A-Z0-9]+):(-?[\d.]+),(-?[\d.]+)$/.exec(line.trim());
  if (m) geo.set(m[1], [+m[2], +m[3]]);
}
const spotsOf = (nat) =>
  D.LEAGUES.filter((l) => l.nat === nat).flatMap((l) => D[l.clubs].map((r) => geo.get(r[1])).filter(Boolean));
let st = 99;
const rnd = () => (st = (st * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
edit('js/geo.js', (t) => {
  for (const p of picks) {
    if (!p.home) continue; // (a principality stays on its host's coast)
    const spots = spotsOf(p.home);
    if (!spots.length) continue;
    const [la, lo] = spots[Math.floor(rnd() * spots.length)];
    const code = p.row[1];
    t = t.replace(
      new RegExp(`^${code}:[^\\n]*$`, 'm'),
      `${code}:${(la + (rnd() - 0.5) * 0.5).toFixed(2)},${(lo + (rnd() - 0.5) * 0.7).toFixed(2)}`,
    );
  }
  return t;
});

edit('js/data.js', (t) => {
  // the host leagues are open to the home nations
  const hosts = {};
  for (const p of picks) if (p.home) (hosts[p.host] = hosts[p.host] || new Set()).add(p.home);
  for (const [id, nats] of Object.entries(hosts)) {
    const re = new RegExp(`(id: '${id}',[\\s\\S]*?\\n      repBand: [^\\n]*\\n)`);
    const m = re.exec(t);
    if (!m) throw new Error('league not found: ' + id);
    t = t.replace(re, `${m[1]}      nats: [${[...nats].map(lit).join(', ')}],\n`);
  }
  const clubNat = picks
    .filter((p) => p.home)
    .map((p) => `    ${p.row[1]}: ${lit(p.home)},`)
    .join('\n');
  const note = picks.map((p) => `    ${p.row[1]}: ${lit(p.label)},`).join('\n');
  const f = t.indexOf('  FM.D.facts = () => ({');
  t =
    t.slice(0, f) +
    `  // Clubs that play in another nation's league (sheet 07): the club's own nation, where it is a nation of the game (the engine reads\n  // CLUB_NAT: the club keeps its nationality, national cup and players), and a note on each\n  FM.D.CLUB_NAT = {\n${clubNat}\n  };\n  FM.D.CROSS_BORDER = {\n${note}\n  };\n` +
    t.slice(f);
  return t;
});
console.log('written: run prettier on js/clubs.js js/data.js js/geo.js');
