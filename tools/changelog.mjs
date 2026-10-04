// Writes js/changelog.js (the "What's new" list in Settings) from the Shipped table in docs/ROADMAP.md, newest first, so
// there is one place to write what changed. Run `npm run changelog` after adding a row there.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './harness.mjs';

const text = fs.readFileSync(path.join(ROOT, 'docs/ROADMAP.md'), 'utf8').replace(/\r\n/g, '\n');
const shipped = text.slice(text.indexOf('## Shipped'), text.indexOf('## Next'));
// Two shapes, newest first: a table row `| Build | What shipped |` (the header and its rule are skipped), or a
// `### Build` heading followed by `- ` bullets (joined with spaces, for builds too long for a table row).
const entries = []; // { build, cell } for a table row, { build, bullets } for a heading
for (const l of shipped.split('\n')) {
  const last = entries[entries.length - 1];
  if (l.startsWith('### ')) entries.push({ build: l.slice(4).trim(), bullets: [] });
  else if (l.startsWith('- ') && last?.bullets) last.bullets.push(l.slice(2).trim());
  else if (l.startsWith('| ') && !l.startsWith('| Build') && !l.startsWith('| ---')) {
    const c = l.split(/ \| /).map((x) => x.replace(/^\| /, '').replace(/ \|$/, '').trim());
    if (c.length >= 2) entries.push({ build: c[0], cell: c.slice(1).join(' | ') });
  }
}
const rows = entries.slice(0, 10).map(({ build, bullets, cell }) => ({
  build,
  text: (cell ?? bullets.join(' '))
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links to plain text
    .replace(/\*\*/g, ''),
}));
const out = `// Generated from docs/ROADMAP.md by tools/changelog.mjs (npm run changelog): the newest builds, for Settings → What's new.
window.FM = window.FM || {};
window.FM.CHANGELOG = ${JSON.stringify(rows, null, 2)};
`;
fs.writeFileSync(path.join(ROOT, 'js/changelog.js'), out);
console.log(`js/changelog.js: ${rows.length} builds, newest "${rows[0].build}"`);
