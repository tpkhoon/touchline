// The real players' names the generator refuses (a fictional player named like a real footballer). The names themselves live in the
// private folder (real-player-names.txt, one a line); the game carries only 53-bit hashes of them, in REAL_NAME_HASHES in js/world.js.
// Each name is hashed as written, without accents, and (for two words) in the other order, so "Lee Kang-in" blocks "Kang-in Lee" too.
//   node tools/realnames.mjs            report: how many names and hashes, and whether js/world.js holds them all
//   node tools/realnames.mjs --write    rewrite the hash list in js/world.js
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './harness.mjs';
import { privateFile, missing } from './private.mjs';

const hashOf = (str) => {
  let h1 = 0xdeadbeef,
    h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
const fold = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '');
const file = privateFile('real-player-names.txt');
if (!file) {
  console.log(missing('real-player-names.txt'));
  process.exit(0);
}
const names = [
  ...new Set(
    fs
      .readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .map((n) => n.trim())
      .filter(Boolean),
  ),
];
const hashes = new Set();
for (const n of names) {
  const low = n.toLowerCase();
  const forms = [low, fold(low)];
  const parts = low.split(/\s+/);
  if (parts.length === 2) forms.push(`${parts[1]} ${parts[0]}`, fold(`${parts[1]} ${parts[0]}`));
  for (const f of forms) hashes.add(hashOf(f));
}
const sorted = [...hashes].sort((a, b) => a - b);
console.log(`${names.length} names, ${sorted.length} hashes`);
const wf = path.join(ROOT, 'js/world.js');
let text = fs.readFileSync(wf, 'utf8');
const crlf = text.includes('\r\n');
if (crlf) text = text.replace(/\r\n/g, '\n');
const a = text.indexOf('const REAL_NAME_HASHES = new Set(['),
  b = text.indexOf(']);', a);
if (a < 0 || b < 0) throw new Error('REAL_NAME_HASHES not found in js/world.js');
const have = new Set((text.slice(a, b).match(/\d+/g) || []).map(Number));
const missingHashes = sorted.filter((h) => !have.has(h));
console.log(`${missingHashes.length} hashes are not in js/world.js yet`);
if (!process.argv.includes('--write')) process.exit(missingHashes.length ? 1 : 0);
const body = sorted.map((h) => String(h)).join(', ');
text = text.slice(0, a) + `const REAL_NAME_HASHES = new Set([\n${body},\n` + text.slice(b);
if (crlf) text = text.replace(/\n/g, '\r\n');
fs.writeFileSync(wf, text);
console.log('written: js/world.js (run prettier on it)');
