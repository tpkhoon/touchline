// Club abbreviations, rebuilt from the clubs' names: three letters from the first word that is not a generic one (Little,
// Real, Club, Associazione, Atlético ...), never a rude or silly code, and unique across the world. A B team is its parent's
// first two letters and B. The code is FM.U.abbrev (js/core.js); this tool rewrites the abbreviation column of the club
// table in js/clubs.js (CODE|ABBR|nickname|founded).
//   node tools/abbrevs.mjs            report (what would change, and the checks)
//   node tools/abbrevs.mjs --write    rewrite js/clubs.js
//   node tools/abbrevs.mjs --check    exit 1 if any abbreviation is rude, silly, doubled or built from a generic word
import fs from 'node:fs';
import { parseArgs, loadSim } from './harness.mjs';
import { isRude } from './namelib.mjs';

const args = parseArgs();
const { FM } = loadSim(1);
const D = FM.D,
  U = FM.U;

const rows = D.LEAGUES.flatMap((l) =>
  (D[l.clubs] || []).map((r) => ({ name: r[0], code: r[1], rep: r[6], parent: r[9] || null })),
);
const old = (c) => (D.CLUB_INFO[c.code] || [])[0] || c.code;
const taken = new Set();
const next = {};
// the big clubs choose first; a B team follows its parent
for (const c of rows.filter((x) => !x.parent).sort((a, b) => b.rep - a.rep || a.name.localeCompare(b.name))) {
  next[c.code] = U.abbrev(c.name, taken, isRude);
  taken.add(next[c.code]);
}
for (const c of rows.filter((x) => x.parent)) {
  const p = next[c.parent] || c.parent;
  let a = p.slice(0, 2) + 'B';
  if (taken.has(a) || isRude(a)) a = U.abbrev(c.name, taken, isRude);
  next[c.code] = a;
  taken.add(a);
}

const changed = rows.filter((c) => old(c) !== next[c.code]);
console.log(`${rows.length} clubs, ${changed.length} abbreviations change`);
for (const n of ['Little Tarncaster City', 'Associazione Calcio Orvola', 'Atlético Porteiro'])
  console.log(`  ${n}: ${next[(rows.find((r) => r.name === n) || {}).code]}`);

// the checks: rude or silly, doubled, or the first letters of a generic word
const GENERIC_FIRST = new Set(
  'little great new old real club associazione atletico athletic north south east west calcio sporting'.split(' '),
);
const firstWord = (n) =>
  n
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean)[0] || '';
const problems = [];
const seen = new Map();
for (const c of rows) {
  const a = next[c.code];
  if (isRude(a)) problems.push(`${c.name}: ${a} is rude`);
  if (seen.has(a)) problems.push(`${c.name} and ${seen.get(a)} share ${a}`);
  seen.set(a, c.name);
  if (!/^[A-Z]{3}$/.test(a)) problems.push(`${c.name}: ${a} is not three letters`);
  if (!c.parent && GENERIC_FIRST.has(firstWord(c.name)) && a === firstWord(c.name).slice(0, 3).toUpperCase())
    problems.push(`${c.name}: ${a} is built from a generic first word`);
}
console.log(problems.length ? 'PROBLEMS\n' + problems.slice(0, 20).join('\n') : 'no problems');

if ('check' in args) {
  // the data as it stands
  const bad = rows.filter((c) => isRude(old(c)) || /^(LIE|ASS|POO)$/.test(old(c)));
  const dup = rows.filter((c, i) => rows.findIndex((o) => old(o) === old(c)) !== i);
  console.log(`${bad.length} rude or silly now, ${dup.length} doubled now`);
  process.exit(bad.length || dup.length ? 1 : 0);
}
if ('write' in args) {
  const file = 'js/clubs.js';
  let t = fs.readFileSync(file, 'utf8');
  const crlf = t.includes('\r\n');
  if (crlf) t = t.replace(/\r\n/g, '\n');
  let n = 0;
  t = t
    .split('\n')
    .map((line) => {
      const m = /^(`?)([A-Z0-9]+)\|([A-Z0-9]*)\|/.exec(line);
      if (!m || !(m[2] in next)) return line;
      n++;
      return line.replace(/^(`?[A-Z0-9]+\|)([A-Z0-9]*)\|/, `$1${next[m[2]]}|`);
    })
    .join('\n');
  if (crlf) t = t.replace(/\n/g, '\r\n');
  fs.writeFileSync(file, t);
  console.log(`rewrote ${n} lines of ${file}`);
}
process.exit(problems.length ? 1 : 0);
