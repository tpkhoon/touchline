// Where on the pitch players take a man on, and how often it works, from the Wyscout public soccer-event dataset (Pappalardo and
// Massucco, 2019, CC BY 4.0, https://doi.org/10.6084/m9.figshare.c.4415000), put into the carry table the match view reads
// (data/carry-table.json and js/carries.js) next to the figures from the PFF World Cup events (tools/pff-events.mjs). It changes only
// the `takeons` block, so it can be run after the other tools.
//
//   node --max-old-space-size=6144 tools/wyscout-takeons.mjs --data <folder with the Wyscout events_*.json> [--check]
//
// A take-on is a 'Ground attacking duel' with a take-on tag (503 left, 504 right); won is tag 703 (lost 701, neutral 702). Wyscout
// gives the acting side's pitch with x from 0 (own goal) to 100 and y across 0 to 100.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const LF = String.fromCharCode(10);
const args = {};
{
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    if (!a[i].startsWith('--')) continue;
    args[a[i].slice(2)] = a[i + 1] === undefined || a[i + 1].startsWith('--') ? true : a[++i];
  }
}
if (!args.data || args.data === true) {
  console.log(
    'usage: node --max-old-space-size=6144 tools/wyscout-takeons.mjs --data <folder with the Wyscout events_*.json> [--check]',
  );
  process.exit(1);
}
const dir = path.resolve(String(args.data));
const files = fs.readdirSync(dir).filter((f) => /^events_.*\.json$/.test(f));
const has = (e, id) => e.tags.some((t) => t.id === id);
const zone = [0, 0, 0],
  won = [0, 0, 0],
  across = [0, 0, 0]; // by third; the share in the middle of the pitch is kept by lane
const lane = [0, 0, 0]; // wing, half-space, centre
let matches = 0;
for (const f of files) {
  const ev = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const m = new Set();
  for (const e of ev) {
    m.add(e.matchId);
    if (e.eventName !== 'Duel' || e.subEventName !== 'Ground attacking duel' || !e.positions || !e.positions[0])
      continue;
    if (!has(e, 503) && !has(e, 504)) continue;
    const z = e.positions[0].x < 33.3 ? 0 : e.positions[0].x < 66.7 ? 1 : 2;
    zone[z]++;
    if (has(e, 703)) won[z]++;
    const d = Math.abs(e.positions[0].y - 50);
    lane[d < 12 ? 2 : d < 30 ? 1 : 0]++;
  }
  matches += m.size;
  console.log(`  ${f}: ${matches} matches so far`);
}
void across;
const total = zone.reduce((a, b) => a + b, 0);
const takeons = {
  matches,
  perMatch: +(total / matches).toFixed(1),
  won: +(won.reduce((a, b) => a + b, 0) / Math.max(1, total)).toFixed(3),
  zones: zone.map((n, i) => ({ share: +(n / total).toFixed(3), won: +(won[i] / Math.max(1, n)).toFixed(3) })),
  lanes: lane.map((n) => +(n / total).toFixed(3)), // wing, half-space, centre
};
console.log(
  `take-ons ${takeons.perMatch} a match, ${(takeons.won * 100).toFixed(0)}% won; by third ${takeons.zones.map((z) => (z.share * 100).toFixed(0) + '% (' + (z.won * 100).toFixed(0) + '% won)').join(', ')}; by lane (wing, half-space, centre) ${takeons.lanes.map((v) => (v * 100).toFixed(0) + '%').join(', ')}`,
);
if (args.check) process.exit(0);
const file = path.join(ROOT, 'data/carry-table.json');
const table = JSON.parse(fs.readFileSync(file, 'utf8'));
table.takeons = takeons;
fs.writeFileSync(file, JSON.stringify(table));
const jsFile = path.join(ROOT, 'js/carries.js');
const js = fs.readFileSync(jsFile, 'utf8').split(LF);
const i = js.findIndex((l) => l.startsWith('  window.FM.D.CARRIES = '));
js[i] = `  window.FM.D.CARRIES = ${JSON.stringify(table)};`;
fs.writeFileSync(jsFile, js.join(LF));
console.log('Wrote the take-ons into data/carry-table.json and js/carries.js');
