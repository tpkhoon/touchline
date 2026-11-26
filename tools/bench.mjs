// Speed benchmark: builds a world and simulates 30 days with a seeded RNG, prints the times and fails when either
// is over its budget (milliseconds on the machine it runs on: set the budgets from a run of the previous version).
//   node tools/bench.mjs [--days 30] [--seed 7] [--max-world 40000] [--max-days 120000] [--max-open 15000] [--max-pack 8000]
// With a built phone world (npm run build:world) it also times opening it and packing a save of it (--max-open, --max-pack: milliseconds).
import fs from 'node:fs';
import zlib from 'node:zlib';
import { parseArgs, loadSim } from './harness.mjs';

const args = parseArgs();
const DAYS = +(args.days || 30),
  maxWorld = args['max-world'] ? +args['max-world'] : Infinity,
  maxDays = args['max-days'] ? +args['max-days'] : Infinity;
const { FM } = loadSim(+(args.seed || 7), { getItem: () => null, setItem() {}, removeItem() {} });
const W = FM.W;
let t = performance.now();
W.newWorld({ win: 3, subs: 5, foreignLimit: 6, twoLegs: true, awayGoals: false });
const world = Math.round(performance.now() - t);
FM.Season.init();
W.takeCharge(Object.values(FM.S.clubs).find((c) => c.comp === 'D1' && c.rep < 75).id, 'Bench Manager');
t = performance.now();
for (let d = 0; d < DAYS; d++) FM.Season.advance(null);
const days = Math.round(performance.now() - t);
console.log(`build a world: ${world} ms\n${DAYS} days: ${days} ms (${Math.round(days / DAYS)} ms a day)`);
let open = 0,
  pack = 0;
const phone = 'dist/data/world-phone.touchline';
if (fs.existsSync(phone)) {
  t = performance.now();
  const st = FM.Save.unpack(zlib.gunzipSync(fs.readFileSync(phone)).toString('utf8'), { world: true }).state;
  open = Math.round(performance.now() - t);
  FM.S = st;
  t = performance.now();
  const text = FM.Save.pack(st);
  pack = Math.round(performance.now() - t);
  console.log(`open the phone world: ${open} ms\npack it (${(text.length / 1e6).toFixed(1)} MB of text): ${pack} ms`);
}
const maxOpen = args['max-open'] ? +args['max-open'] : Infinity,
  maxPack = args['max-pack'] ? +args['max-pack'] : Infinity;
if (world > maxWorld || days > maxDays || open > maxOpen || pack > maxPack) {
  console.error(`over budget (world ${maxWorld}, days ${maxDays}, open ${maxOpen}, pack ${maxPack})`);
  process.exit(1);
}
