// Screenshot comparison: a screenshot of each key screen (every tab, a couple of sub-tabs on each, a player, a club, the settings,
// the match preview and full time, the title screen) is kept as a reference in tests/visual/<device>/, and after a change every
// screen is shot again and the ones that look different are named, with the difference marked in red. CSS can break a screen in
// ways no logic test notices.
//   node tools/visual.mjs                    compare with the references (exit 1 when a screen differs or has no reference)
//   node tools/visual.mjs --update           make these screenshots the references (all, or --only name,name)
//   node tools/visual.mjs --device small     another screen size (phone is the default)  --tolerance 0.1  % of pixels allowed to differ
// The career is the seeded one (tools/browser.mjs), the date is frozen and animations are off, so two runs on the same code look
// the same. Fonts are drawn by the machine's browser, so references belong to the machine that made them: tests/visual/<device>/
// is written by whoever runs --update, and the dashboard's Screens tab shows old, new and difference side by side.
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import { parseArgs } from './harness.mjs';
import { openCareer, DEVICES, settle, STORE, ROOT } from './browser.mjs';

const args = parseArgs();
const DEVICE_ID = DEVICES[args.device] ? args.device : 'phone';
const DEVICE = DEVICES[DEVICE_ID];
const UPDATE = 'update' in args;
const TOL = +(args.tolerance ?? 0.1);
const only = args.only ? String(args.only).split(',') : null;
const REF = path.join(ROOT, 'tests', 'visual', DEVICE_ID);
const OUT = path.join(STORE, 'visual');
for (const d of ['now', 'diff']) {
  fs.rmSync(path.join(OUT, d), { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT, d), { recursive: true });
}
fs.mkdirSync(REF, { recursive: true });

const h = await openCareer({ device: DEVICE, seed: +(args.seed || 7), headless: !('show' in args) });
const { page } = h;
// (the day's simulation runs in the page, not in the worker, which has a random generator of its own: the pictures must repeat)
await page.evaluate(() => (FM.SimRunner.broken = true));
const shots = []; // { name, file }
const slug = (t) => t.replace(/[^\w.-]+/g, '-').replace(/^-|-$/g, '');
async function shoot(name) {
  if (only && !only.includes(name)) return;
  await page.evaluate(() => document.querySelectorAll('.toast').forEach((t) => t.remove()));
  await settle(page, 120);
  const file = slug(name) + '.png';
  await page.screenshot({ path: path.join(OUT, 'now', file) });
  shots.push({ name, file });
}
const ev = (fn, arg) => page.evaluate(fn, arg);

const tabs = await ev(() => Object.keys(FM.UI.screens));
for (const tab of tabs) {
  await ev((t) => FM.UI.go(t), tab);
  await shoot(`tab-${tab}`);
  const subs = (
    await ev(() => [...document.querySelectorAll('#main [data-act="sub"]')].map((b) => [b.dataset.k, b.dataset.v]))
  ).slice(1, 3);
  for (const [k, v] of subs) {
    await ev(
      ([k, v]) => document.querySelector(`#main [data-act="sub"][data-k="${k}"][data-v="${v}"]`)?.click(),
      [k, v],
    );
    await shoot(`tab-${tab}--${k}-${v}`);
  }
}
const ids = await ev(() => {
  const W = FM.W,
    sq = W.squad(W.userClub().id).sort((a, b) => b.ca - a.ca);
  const others = Object.values(FM.S.clubs).sort((a, b) => b.rep - a.rep);
  return {
    star: sq[0].id,
    keeper: sq.find((p) => p.pos === 'GK').id,
    top: others[0].id,
    mid: others[others.length >> 1].id,
  };
});
for (const [name, fn, id] of [
  ['player-star', 'playerSheet', ids.star],
  ['player-keeper', 'playerSheet', ids.keeper],
  ['club-top', 'clubSheet', ids.top],
  ['club-mid', 'clubSheet', ids.mid],
]) {
  await ev(([f, i]) => FM.UI[f](i), [fn, id]);
  await shoot(name);
  await ev(() => FM.UI.closeAllSheets());
}
await ev(() => FM.UI.go('home'));
await ev(() => FM.UI.acts.openSettings({}));
await shoot('settings');
await ev(() => FM.UI.closeAllSheets());
await ev(() => FM.UI.acts.preview());
await shoot('match-preview');
await ev(() => FM.UI.closeAllSheets());
await ev(() => FM.UI.acts.instant());
await page.waitForSelector('#postOv', { timeout: 60000 });
await shoot('match-full-time');
await ev(() => FM.UI.acts.postContinue());
await page.waitForFunction(() => !document.getElementById('postOv') && !FM.UI.simBusy, null, { timeout: 120000 });
await ev(() => FM.UI.go('home'));
await shoot('home-after-match');
await ev(() => FM.UI.acts.toTitle());
await shoot('title');
await h.close();

// ---------- Compare ----------
const read = (f) => PNG.sync.read(fs.readFileSync(f));
const results = [];
for (const s of shots) {
  const now = path.join(OUT, 'now', s.file),
    ref = path.join(REF, s.file);
  if (UPDATE) {
    fs.copyFileSync(now, ref);
    results.push({ ...s, status: 'updated' });
    continue;
  }
  if (!fs.existsSync(ref)) {
    results.push({ ...s, status: 'new' });
    continue;
  }
  const a = read(ref),
    b = read(now);
  if (a.width !== b.width || a.height !== b.height) {
    results.push({ ...s, status: 'size', note: `${a.width}×${a.height} → ${b.width}×${b.height}` });
    continue;
  }
  const diff = new PNG({ width: a.width, height: a.height });
  let n = 0,
    x0 = a.width,
    y0 = a.height,
    x1 = 0,
    y1 = 0;
  for (let y = 0; y < a.height; y++)
    for (let x = 0; x < a.width; x++) {
      const i = (y * a.width + x) * 4;
      const d = Math.max(
        Math.abs(a.data[i] - b.data[i]),
        Math.abs(a.data[i + 1] - b.data[i + 1]),
        Math.abs(a.data[i + 2] - b.data[i + 2]),
      );
      if (d > 24) {
        n++;
        x0 = Math.min(x0, x);
        y0 = Math.min(y0, y);
        x1 = Math.max(x1, x);
        y1 = Math.max(y1, y);
        diff.data[i] = 255;
        diff.data[i + 1] = 0;
        diff.data[i + 2] = 60;
        diff.data[i + 3] = 255;
      } else {
        const g = Math.round((a.data[i] + a.data[i + 1] + a.data[i + 2]) / 3 / 3 + 150);
        diff.data[i] = diff.data[i + 1] = diff.data[i + 2] = g;
        diff.data[i + 3] = 255;
      }
    }
  const pct = (100 * n) / (a.width * a.height);
  if (pct > TOL) {
    fs.writeFileSync(path.join(OUT, 'diff', s.file), PNG.sync.write(diff));
    results.push({ ...s, status: 'different', pct: +pct.toFixed(2), box: [x0, y0, x1, y1] });
  } else results.push({ ...s, status: 'same', pct: +pct.toFixed(3) });
}
fs.writeFileSync(
  path.join(OUT, 'report.json'),
  JSON.stringify({ at: Date.now(), device: DEVICE_ID, update: UPDATE, tolerance: TOL, results }, null, 1),
);
const count = (st) => results.filter((r) => r.status === st).length;
for (const r of results) {
  if (r.status === 'different') console.log(`✗ ${r.name}: ${r.pct}% of the screen differs (${r.box.join(',')})`);
  else if (r.status === 'size') console.log(`✗ ${r.name}: the picture is another size (${r.note})`);
  else if (r.status === 'new') console.log(`· ${r.name}: no reference yet`);
}
if (UPDATE) {
  console.log(`\nReferences written: ${results.length} screens in ${path.relative(ROOT, REF)}`);
  process.exit(0);
}
const bad = count('different') + count('size'),
  fresh = count('new');
console.log(
  `\n${results.length} screens at ${DEVICE.label}: ${count('same')} the same, ${bad} different, ${fresh} without a reference`,
);
console.log(`${bad ? '✗' : '✓'} Screens that look different   ${bad}   real 0–0`);
console.log(`· Screens without a reference   ${fresh}   real 0–0`);
if (!bad && !fresh) console.log('All checks passed');
else if (fresh && !bad) console.log(`Run "node tools/visual.mjs --update" to keep these screens as the references.`);
process.exit(bad || fresh ? 1 : 0);
