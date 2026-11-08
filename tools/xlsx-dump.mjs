import fs from 'node:fs';
// Dump every sheet of an unzipped .xlsx as tab-separated text.
//   node tools/xlsx-dump.mjs <folder the .xlsx was unzipped into> <folder for the .txt files>
const src = process.argv[2];
const sp = (process.argv[3] || '.') + '/';
const x = src + '/xl/';
const un = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
const ss = [...fs.readFileSync(x + 'sharedStrings.xml', 'utf8').matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) =>
  un([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join('')),
);
const wb = fs.readFileSync(x + 'workbook.xml', 'utf8');
const names = [...wb.matchAll(/<sheet [^>]*name="([^"]*)"[^>]*r:id="([^"]*)"/g)].map((m) => [un(m[1]), m[2]]);
const rels = Object.fromEntries(
  [...fs.readFileSync(x + '_rels/workbook.xml.rels', 'utf8').matchAll(/<Relationship [^>]*>/g)].map((m) => [
    /Id="([^"]*)"/.exec(m[0])[1],
    /Target="([^"]*)"/.exec(m[0])[1],
  ]),
);
const colN = (c) => c.split('').reduce((a, ch) => a * 26 + ch.charCodeAt(0) - 64, 0) - 1;
let i = 0;
for (const [name, rid] of names) {
  i++;
  const xml = fs.readFileSync(x + rels[rid].replace(/^\/?(xl\/)?/, ''), 'utf8');
  const rows = [];
  for (const r of xml.matchAll(/<row [^>]*>([\s\S]*?)<\/row>/g)) {
    const cells = [];
    for (const c of r[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const t = /t="(\w+)"/.exec(c[2]);
      const v = /<v>([\s\S]*?)<\/v>/.exec(c[3] || '');
      const is = /<is>[\s\S]*?<t[^>]*>([\s\S]*?)<\/t>/.exec(c[3] || '');
      let val = v ? v[1] : is ? un(is[1]) : '';
      if (t && t[1] === 's') val = ss[+val];
      cells[colN(c[1])] = val;
    }
    if (cells.some((v) => v)) rows.push(Array.from(cells, (v) => v || '').join('\t'));
  }
  fs.writeFileSync(sp + `sheet_${String(i).padStart(2, '0')}.txt`, rows.join('\n'));
  console.log(i, name, rows.length, 'rows');
}
