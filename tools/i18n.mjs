// Translation tooling, ready for when translations start. Three questions, answered from the code and the language files:
//   1. Which screen texts are not in the translation file yet? (the words in the screens' code that a player reads)
//   2. Which translations are missing or out of date, per language?
//   3. Which translations run long? German and Vietnamese text is often much longer than English, and a button has the room
//      it has. --screens shows every screen with each language's words in it and flags the ones that no longer fit.
//   node tools/i18n.mjs [--screens] [--long 1.5] [--list 15] [--extract]
//   --screens   crawls the game once per language file (needs a browser) with the translations put in the words on screen
//   --extract   writes a draft English file of the texts found, to start data/lang/en.json from (.devtools/i18n/en.draft.json)
// The files, in data/lang/:
//   en.json          { "strings": { "<key>": "English text, {0} for a number or name" } }
//   <code>.json      { "lang": "de", "name": "Deutsch", "strings": { "<key>": "…" }, "from": { "<key>": "<hash of the English it was
//                      translated from>" } }  (`from` is how outdated translations are told: the English changed after)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { parseArgs, ROOT } from './harness.mjs';

const args = parseArgs();
const LANG = path.join(ROOT, 'data', 'lang');
const OUT = path.join(ROOT, '.devtools', 'i18n');
const LONG = +(args.long || 1.5);
const LIST = +(args.list || 15);
export const hash = (t) => crypto.createHash('sha1').update(String(t)).digest('hex').slice(0, 8);

// The files that draw screens (as index.html loads them)
const UI_FILES = [
  'ui-core',
  'ui-screens',
  'matchview',
  'ui-extra',
  'ui-alpha',
  'ui-market',
  'ui-follow',
  'ui-youth',
  'ui-editor',
  'ui-training',
  'ui-access',
];

// ---------- 1. Texts in the code ----------
// Words a player reads: the text between tags in the markup the screens build, and the strings of toasts, titles, placeholders
// and tooltips. `${…}` in a text becomes {0}, {1}… The texts are found by pattern, so the list is a close guide, not a proof.
function findTexts() {
  const found = new Map(); // text → { n, file, line }
  const add = (raw, file, line) => {
    let i = 0;
    let t = raw
      .replace(/\$\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, () => `{${i++}}`)
      .replace(/&nbsp;|&middot;|&times;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (
      !/[A-Za-z]{3}/.test(t) ||
      /[=;()<>[\]]|&&|\|\||=>|\?\s*['"`]|['"`]\s*:|^[{}0-9 .,%·–—:+-]+$/.test(t) ||
      /^\{\d+\}$/.test(t)
    )
      return;
    if (/^(var|px|rem|em|vh|vw|rgb|rgba|http|data-|#|\.|\/)/.test(t) || /\b(function|return|const|let)\b/.test(t))
      return;
    if (t.length > 300) return;
    const e = found.get(t);
    if (e) e.n++;
    else found.set(t, { n: 1, file, line });
  };
  for (const name of UI_FILES) {
    const file = `js/${name}.js`;
    if (!fs.existsSync(path.join(ROOT, file))) continue;
    const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const lineAt = (idx) => src.slice(0, idx).split('\n').length;
    for (const m of src.matchAll(/>([^<>`]{3,200}?)</g)) add(m[1], file, lineAt(m.index));
    for (const m of src.matchAll(/(?:toast|alert)\(\s*(['"`])((?:\\.|(?!\1).){3,200})\1/g))
      add(m[2], file, lineAt(m.index));
    for (const m of src.matchAll(/(?:placeholder|title|aria-label|alt)="([^"<>]{3,120})"/g))
      add(m[1], file, lineAt(m.index));
    for (const m of src.matchAll(/\btitle:\s*(['"])((?:\\.|(?!\1).){3,80})\1/g)) add(m[2], file, lineAt(m.index));
  }
  return found;
}

// ---------- Language files ----------
function readLangs() {
  const langs = {};
  if (!fs.existsSync(LANG)) return { en: null, langs };
  for (const f of fs.readdirSync(LANG).filter((x) => x.endsWith('.json'))) {
    try {
      langs[f.replace(/\.json$/, '')] = JSON.parse(fs.readFileSync(path.join(LANG, f), 'utf8'));
    } catch (e) {
      console.log(`✗ data/lang/${f} is not valid JSON: ${e.message}`);
      process.exitCode = 1;
    }
  }
  const en = langs.en || null;
  delete langs.en;
  return { en, langs };
}
const slots = (t) => (String(t).match(/\{\d+\}/g) || []).sort().join('');

const found = findTexts();
const { en, langs } = readLangs();
const enStrings = en ? en.strings || {} : {};
const known = new Set(Object.values(enStrings));
const todo = [...found].filter(([t]) => !known.has(t));
const byFile = {};
for (const [, v] of todo) byFile[v.file] = (byFile[v.file] || 0) + 1;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(
  path.join(OUT, 'untranslated.json'),
  JSON.stringify(
    todo.map(([text, v]) => ({ text, ...v })),
    null,
    1,
  ),
);
if ('extract' in args) {
  const draft = { strings: {} };
  for (const [t, v] of found) {
    const key = `${v.file.replace(/^js\/|\.js$/g, '')}.${t
      .toLowerCase()
      .replace(/\{\d+\}/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 32)}.${hash(t).slice(0, 4)}`;
    draft.strings[key] = t;
  }
  fs.writeFileSync(path.join(OUT, 'en.draft.json'), JSON.stringify(draft, null, 1));
  console.log(
    `Draft English file: ${Object.keys(draft.strings).length} texts in .devtools/i18n/en.draft.json (review it, then move it to data/lang/en.json)`,
  );
}

console.log(
  `1. Screen texts in the code: about ${found.size} different texts in ${UI_FILES.length} files; ${found.size - todo.length} are in data/lang/en.json, ${todo.length} are not.`,
);
for (const [f, n] of Object.entries(byFile)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8))
  console.log(`     ${f.padEnd(22)} ${String(n).padStart(5)} not yet moved`);
for (const [t, v] of todo.slice(0, LIST))
  console.log(`     ${v.file}:${v.line}  “${t.slice(0, 70)}”${v.n > 1 ? ` ×${v.n}` : ''}`);
if (todo.length > LIST)
  console.log(`     … and ${todo.length - LIST} more (the full list: .devtools/i18n/untranslated.json)`);

// ---------- 2 and 3. Languages ----------
const codes = Object.keys(langs);
let missingTotal = 0,
  outdatedTotal = 0,
  longTotal = 0,
  badTotal = 0;
console.log(
  `\n2. Languages: ${codes.length ? codes.join(', ') : 'none yet (add data/lang/en.json, then data/lang/<code>.json for each language)'}`,
);
const summary = [];
for (const code of codes) {
  const L = langs[code],
    S = L.strings || {},
    from = L.from || {};
  const keys = Object.keys(enStrings);
  const missing = keys.filter((k) => S[k] == null || S[k] === '');
  const outdated = keys.filter((k) => S[k] != null && S[k] !== '' && from[k] !== hash(enStrings[k]));
  const unused = Object.keys(S).filter((k) => !(k in enStrings));
  const slotBad = keys.filter((k) => S[k] && slots(S[k]) !== slots(enStrings[k]));
  const ratios = keys
    .filter((k) => S[k] && enStrings[k].length >= 6)
    .map((k) => ({ k, r: S[k].length / enStrings[k].length, en: enStrings[k], tr: S[k] }));
  const long = ratios.filter((x) => x.r > LONG).sort((a, b) => b.r - a.r);
  const mean = ratios.length ? ratios.reduce((t, x) => t + x.r, 0) / ratios.length : 0;
  missingTotal += missing.length;
  outdatedTotal += outdated.length;
  longTotal += long.length;
  badTotal += slotBad.length;
  summary.push({
    code,
    name: L.name || code,
    missing: missing.length,
    outdated: outdated.length,
    long: long.length,
    mean: +mean.toFixed(2),
  });
  console.log(
    `   ${code} (${L.name || code}): ${keys.length - missing.length}/${keys.length} translated · ${missing.length} missing · ${outdated.length} out of date · ${unused.length} no longer used · mean length ${mean ? mean.toFixed(2) + '× English' : '—'}`,
  );
  for (const k of missing.slice(0, 5)) console.log(`     missing   ${k}: “${enStrings[k].slice(0, 60)}”`);
  for (const k of outdated.slice(0, 5)) console.log(`     outdated  ${k}: English now “${enStrings[k].slice(0, 60)}”`);
  for (const k of slotBad.slice(0, 5)) console.log(`     ✗ ${k}: the {0} places differ from the English`);
  for (const x of long.slice(0, 5))
    console.log(`     long      ${x.r.toFixed(1)}×  “${x.en.slice(0, 40)}” → “${x.tr.slice(0, 50)}”`);
}
fs.writeFileSync(
  path.join(OUT, 'report.json'),
  JSON.stringify({ at: Date.now(), texts: found.size, notMoved: todo.length, byFile, languages: summary }, null, 1),
);

// ---------- 3b. Screens in each language ----------
let screenProblems = 0;
if ('screens' in args) {
  if (!codes.length)
    console.log(
      '\n3. Screens: no language files yet. The crawler can already show the effect of longer words: node tools/crawl.mjs --stress',
    );
  for (const code of codes) {
    console.log(`\n3. Screens in ${code}:`);
    const r = spawnSync(process.execPath, ['tools/crawl.mjs', '--lang', code, '--players', '4', '--clubs', '4'], {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 1 << 26,
    });
    const out = r.stdout.split('\n').filter((l) => /^(✗| {4}|Crawled)/.test(l));
    console.log(out.map((l) => '   ' + l).join('\n'));
    screenProblems += out.filter((l) => l.startsWith('✗')).length;
  }
}

console.log('');
console.log(`· Screen texts not in the translation file   ${todo.length}   real 0–`);
if (codes.length) {
  console.log(`${missingTotal ? '✗' : '✓'} Translations missing   ${missingTotal}   real 0–0`);
  console.log(`${outdatedTotal ? '✗' : '✓'} Translations out of date   ${outdatedTotal}   real 0–0`);
  console.log(`${badTotal ? '✗' : '✓'} Translations with the wrong {0} places   ${badTotal}   real 0–0`);
  console.log(`· Translations over ${LONG}× the English length   ${longTotal}   real 0–`);
}
if ('screens' in args)
  console.log(`${screenProblems ? '✗' : '✓'} Screens that break in a language   ${screenProblems}   real 0–0`);
const failed = missingTotal || outdatedTotal || badTotal || screenProblems;
if (!failed) console.log('All checks passed');
process.exit(failed ? 1 : 0);
