// Finds markup built from text without escaping it: in the screens (js/ui-*.js and the other files that build HTML), a
// `${...}` inside a template literal that holds markup and reads a name-like value (a club's name, a player's name, a nickname, a
// title, a pack's author ...) without esc(), U.esc() or U.html around it. Databases made by other people are imported, so one such
// place is a way for a pack to run code in the game.
//   node tools/escape-check.mjs            report, and fail when there are more than the baseline (tools/escape-baseline.json)
//   node tools/escape-check.mjs --list     every place
//   node tools/escape-check.mjs --update   write the baseline (when places are fixed: it only ever goes down)
// The new way to write markup is U.html`<b>${name}</b>`, which escapes what goes into it (js/core.js).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = path.join(ROOT, 'tools', 'escape-baseline.json');
const NAMEY =
  /\.(name|short|nick|city|title|label|fn|ln|desc|description|author|credits|license|stadium|why|bio|note)\b|W\.name\(|W\.short\(|W\.shirt\(/;
const SAFE =
  /\besc\(|U\.esc\(|C\.pname\(|UI\.linkNames\(|U\.html|\.toFixed|\.toLocaleString|Math\.|\.length|\.map\(|U\.money|U\.plural|U\.ordinal|\bnumber\b/;
const args = process.argv.slice(2);

// the ${...} expressions of a line (braces balanced)
const exprs = (line) => {
  const out = [];
  for (let i = line.indexOf('${'); i >= 0; i = line.indexOf('${', i + 2)) {
    let d = 1,
      j = i + 2;
    while (j < line.length && d) {
      if (line[j] === '{') d++;
      else if (line[j] === '}') d--;
      j++;
    }
    out.push(line.slice(i + 2, j - 1));
  }
  return out;
};
const found = {};
const files = fs
  .readdirSync(path.join(ROOT, 'js'))
  .filter(
    (f) => f.endsWith('.js') && !['changelog.js', 'carries.js', 'layouts.js', 'refstats.js', 'sim.min.js'].includes(f),
  );
for (const f of files) {
  const lines = fs.readFileSync(path.join(ROOT, 'js', f), 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    if (!line.includes('${') || !/<[a-z/]/i.test(line)) return; // (a line of markup)
    for (const e of exprs(line))
      if (NAMEY.test(e) && !SAFE.test(e)) {
        (found[f] = found[f] || []).push(`${f}:${i + 1}  \${${e.slice(0, 70)}}`);
      }
  });
}
const counts = Object.fromEntries(Object.entries(found).map(([f, l]) => [f, l.length]));
const total = Object.values(counts).reduce((a, b) => a + b, 0);
if (args.includes('--list')) for (const l of Object.values(found).flat()) console.log(l);
if (args.includes('--update')) {
  fs.writeFileSync(BASE, JSON.stringify({ total, files: counts }, null, 1) + '\n');
  console.log(`baseline written: ${total} places`);
  process.exit(0);
}
const base = fs.existsSync(BASE) ? JSON.parse(fs.readFileSync(BASE, 'utf8')) : { total: Infinity, files: {} };
const worse = Object.entries(counts).filter(([f, n]) => n > (base.files[f] || 0));
console.log(
  `${total} places that put a name-like value into markup without escaping it (baseline ${base.total === Infinity ? 'none' : base.total})`,
);
if (worse.length) {
  console.error(
    'More than the baseline in: ' + worse.map(([f, n]) => `${f} (${n}, was ${base.files[f] || 0})`).join(', '),
  );
  console.error(
    'Wrap the value in esc(...) or write the markup with U.html`...`; node tools/escape-check.mjs --list shows where.',
  );
  process.exit(1);
}
