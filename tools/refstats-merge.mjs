// Puts the Wyscout figures into the shipped reference table (js/refstats.js) without the StatsBomb events, which are large:
//   node --max-old-space-size=6144 tools/refstats-merge.mjs <folder with Wyscout events_*.json>
// (tools/refstats.mjs --wyscout does the same while making the table from the StatsBomb data; either way once only.)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { wyscoutGroups, mergeWyscout } from './refstats-wyscout.mjs';

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'js', 'refstats.js');
const text = fs.readFileSync(file, 'utf8');
const a = text.indexOf('FM.D.REFSTATS = ') + 'FM.D.REFSTATS = '.length,
  b = text.lastIndexOf(';\n})();');
const out = JSON.parse(text.slice(a, b));
mergeWyscout(out, wyscoutGroups(process.argv[2] || 'C:/Users/jerom/Downloads/wyscout-events2/data'));
const head = text
  .slice(0, a)
  .replace(
    /\n\/\/ What is typical/,
    '\n// The goals, assists, shots and pass completion are the average of the StatsBomb figures and those of the Wyscout public dataset (CC BY 4.0).\n// What is typical',
  );
fs.writeFileSync(file, head + JSON.stringify(out) + text.slice(b));
console.log('merged', out.meta.wyscout.matches, 'Wyscout matches into', path.relative(process.cwd(), file));
