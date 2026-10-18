// Renames the clubs, towns, grounds, nicknames, leagues and cups of the nations whose names were made with a neighbour's library
// (Slovakia named like Serbia, Finland like Denmark, Kenya and Zambia in plain English ...), now that each has words of its own
// (tools/namelib-new.mjs). Club codes (ids), colours, reputations and founding years stay; only the names change.
// The structure comes from the private folder (the nations' real structure, keyed by the clubs' codes): the real names are only used to
// keep the generator from making a real town or club, and none is written anywhere.
//   node tools/renameclubs.mjs [--seed 31] [--nations SVK,FIN,...]        report: a sample of the new names, and any clash
//   node tools/renameclubs.mjs --write [--seed 31]                        write js/clubs.js, js/data.js and data/fictional-world.json
// The abbreviations are remade from the new names (unique across the world); places are by club code, so the geocoder is not needed.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, loadSim, ROOT } from './harness.mjs';
import { generate } from './worldgen.mjs';
import { privateFile, missing } from './private.mjs';
import { isRude } from './namelib.mjs';

const NATIONS =
  'SVK SVN ALB KOS BUL MDA FIN ISL AZE KAZ EST LVA LTU GEO ARM KEN UGA ETH ZAM ZIM JAM TRI PAK BAN VIE BHR KUW OMA JOR IRQ'.split(
    ' ',
  );
const args = parseArgs();
const nats = new Set(args.nations ? String(args.nations).split(',') : NATIONS);
const seed = +(args.seed || 31);
const realFile = privateFile('real-world.json');
if (!realFile) {
  console.log(missing('real-world.json'));
  process.exit(0);
}
const R = JSON.parse(fs.readFileSync(realFile, 'utf8'));
const { FM } = loadSim(1);
const D = FM.D;

// ---------- the structure of these nations, as a world for the generator ----------
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
for (const [k, c] of Object.entries(R.clubs)) if (nats.has(c.nat)) real.clubs[k] = c;
for (const [k, l] of Object.entries(R.leagues)) if (nats.has(l.nat)) real.leagues[k] = l;
for (const n of nats) {
  real.nations[n] = (D.NATIONS[n] || { name: R.nations[n] || n }).name;
  real.cups['CUP' + n] = { nat: n };
}
real.rivals = R.rivals.filter(([a, b]) => real.clubs[a] && real.clubs[b]);
const missingCodes = [...nats].filter((n) => !Object.values(real.clubs).some((c) => c.nat === n));
if (missingCodes.length) console.log('no clubs in the private structure for', missingCodes.join(' '));

const mine = new Set(Object.keys(real.clubs));
const avoid = D.allClubRows()
  .filter((r) => !mine.has(r[1]))
  .flatMap((r) => [r[0], r[2], r[7]]);
const out = generate(real, seed, avoid);

// ---------- report ----------
const have = new Set(avoid);
const clash = Object.values(out.clubs).filter((c) => have.has(c.row[0]) || have.has(c.row[7]));
console.log(
  `${Object.keys(out.clubs).length} clubs in ${Object.keys(out.leagues).length} leagues, seed ${seed}; ${clash.length} clash with the rest of the world`,
);
const byNat = {};
for (const [k, c] of Object.entries(out.clubs)) (byNat[c.nat] = byNat[c.nat] || []).push(c);
if (!('write' in args))
  for (const n of nats) {
    const cl = byNat[n] || [];
    const lg = Object.values(out.leagues).find((l) => l.nat === n);
    console.log(`\n${n} ${lg ? lg.name : ''}  (${cl.length})`);
    for (const c of cl) console.log(`  ${c.row[0]} | ${c.row[2]} | ${c.row[7]} | ${c.nick}`);
  }
if (!('write' in args)) process.exit(clash.length ? 1 : 0);
if (clash.length) {
  console.log('not written: try another --seed');
  process.exit(1);
}

// ---------- abbreviations: from the new names, unique across the world ----------
const taken = new Set(
  D.allClubRows()
    .filter((r) => !mine.has(r[1]))
    .map((r) => (D.CLUB_INFO[r[1]] || [])[0] || r[1]),
);
const shorts = {};
for (const [k, c] of Object.entries(out.clubs).sort((x, y) => y[1].row[6] - x[1].row[6])) {
  shorts[k] = FM.U.abbrev(c.row[0].replace(/^CLB /, ''), taken, isRude);
  taken.add(shorts[k]);
}

// ---------- the cup names, as worldgen makes them ----------
const cupName = (nat) => out.cups['CUP' + nat].name;

// ---------- write ----------
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
const seen = new Set();
edit('js/clubs.js', (t) => {
  // a club row: ['Name', 'CODE', 'City', '#c1', '#c2', 'identity', rep, 'Ground', capacity(, parent)] (on one line or wrapped)
  for (const code of Object.keys(out.clubs)) {
    const m = new RegExp(`,\\s*(['"])${code}\\1,\\s*(.*?),\\s*['"]#[0-9A-Fa-f]{6}['"]`).exec(t);
    if (!m) continue;
    const start = t.lastIndexOf('[', m.index),
      end = t.indexOf(']', m.index) + 1;
    const row = Function(`return ${t.slice(start, end)}`)();
    const o = out.clubs[code];
    row[0] = o.row[0];
    row[2] = o.row[2];
    row[7] = o.row[7];
    t = t.slice(0, start) + `[${row.map(lit).join(', ')}]` + t.slice(end);
    seen.add(code);
  }
  const lines = t.split('\n');
  for (let i = 0; i < lines.length; i++) {
    // the club table: CODE|ABBR|nickname|founded
    let m = /^(`?)([A-Z0-9]+)\|([^|]*)\|([^|]*)\|(\d*)(`?)$/.exec(lines[i]);
    if (m && out.clubs[m[2]]) {
      lines[i] = `${m[1]}${m[2]}|${shorts[m[2]]}|${out.clubs[m[2]].nick}|${m[5]}${m[6]}`;
      continue;
    }
    // a derby: ['AAA', 'BBB', 'Name Derby']
    m = /^(\s*)\['([A-Z0-9]+)', '([A-Z0-9]+)', '([^']*)'\],\s*$/.exec(lines[i]);
    if (m && out.clubs[m[2]] && out.clubs[m[3]]) {
      const r = out.rivals.find(([a, b]) => a === m[2] && b === m[3]);
      if (r) lines[i] = `${m[1]}[${lit(m[2])}, ${lit(m[3])}, ${lit(r[2])}],`;
    }
  }
  return lines.join('\n');
});
const unseen = Object.keys(out.clubs).filter((c) => !seen.has(c));
if (unseen.length) console.log('clubs not found in js/clubs.js:', unseen.join(' '));

edit('js/data.js', (t) => {
  for (const [id, l] of Object.entries(out.leagues)) {
    const re = new RegExp(`(\\n\\s*id: '${id}',\\n\\s*nat: '${l.nat}',\\n\\s*name: )'(?:[^'\\\\]|\\\\.)*'`);
    if (!re.test(t)) console.log('league not found in js/data.js:', id);
    t = t.replace(re, `$1${lit(l.name)}`);
  }
  for (const n of nats) {
    const re = new RegExp(`(\\['CUP${n}', '${n}', )'(?:[^'\\\\]|\\\\.)*'`);
    if (!re.test(t)) console.log('cup not found in js/data.js:', n);
    t = t.replace(re, `$1${lit(cupName(n))}`);
  }
  return t;
});

const wf = path.join(ROOT, 'data/fictional-world.json');
const W = JSON.parse(fs.readFileSync(wf, 'utf8'));
for (const [k, c] of Object.entries(out.clubs)) {
  const w = W.clubs[k];
  w.row = w.row.map((v, i) => (i === 0 || i === 2 || i === 7 ? c.row[i] : v));
  w.nick = c.nick;
  w.short = shorts[k];
}
for (const [id, l] of Object.entries(out.leagues)) if (W.leagues[id]) W.leagues[id].name = l.name;
for (const n of nats) if (W.cups['CUP' + n]) W.cups['CUP' + n].name = cupName(n);
W.rivals = W.rivals.map(([a, b, n]) => {
  const r = out.rivals.find(([x, y]) => x === a && y === b);
  return r ? [a, b, r[2]] : [a, b, n];
});
fs.writeFileSync(wf, JSON.stringify(W, null, 1) + '\n');
console.log('written: js/clubs.js, js/data.js, data/fictional-world.json');
