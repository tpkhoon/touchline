// Speed in a real browser at phone speed. tools/bench.mjs times the simulation in Node on this computer; a phone is slower, and
// much of what a player waits for only happens in a browser (the worker's copy of the world, drawing a screen, saving). This
// plays the seeded career in Chromium with its CPU slowed down (Chrome's own CPU throttling: 4× is about a mid-range phone, 6×
// a budget one) and times what a player feels: the full-time screen, a day with a match, skipping to the next match, changing
// tab, saving, and the most memory the page and its worker held.
//   node tools/browser-bench.mjs [--cpu 4] [--matches 3] [--seed 7] [--max-day 40000] [--max-screen 1500] [--max-save 20000] [--max-mb 1500]
// Every measure has a budget (the --max flags, in ms and MB, set for the slowed-down browser, and loose: the point is the trend
// across runs, which the dashboard keeps on its Profile tab); exit 1 when one is over.
import { parseArgs } from './harness.mjs';
import { openCareer, DEVICES, settle } from './browser.mjs';

const args = parseArgs();
const CPU = +(args.cpu || 4);
const MATCHES = +(args.matches || 3);
const B = {
  day: +(args['max-day'] || 40000),
  skip: +(args['max-skip'] || 90000),
  fulltime: +(args['max-fulltime'] || 15000),
  screen: +(args['max-screen'] || 1500),
  save: +(args['max-save'] || 20000),
  mb: +(args['max-mb'] || 1500),
};
const h = await openCareer({ device: DEVICES.phone, seed: +(args.seed || 7), cpu: CPU });
const { page } = h;
console.log(`Chromium at ${CPU}× slower CPU, ${DEVICES.phone.label}, seeded career`);

// The most memory the page's JavaScript held: the browser is asked every 250 ms (it answers between the page's tasks), and the
// worker's heap is read after each step (it is where the simulation's copy of the world lives)
let mainPeak = 0;
const sampler = setInterval(async () => {
  try {
    const u = (await h.cdp.send('Runtime.getHeapUsage')).usedSize;
    if (u > mainPeak) mainPeak = u;
  } catch (e) {
    /* the page is busy: the next sample */
  }
}, 250);
const workerMB = async () => {
  let best = 0;
  for (const w of page.workers()) {
    const v = await w.evaluate(() => (performance.memory ? performance.memory.usedJSHeapSize : 0)).catch(() => 0);
    best = Math.max(best, v);
  }
  return best / 1048576;
};
let workerPeak = 0;
const ev = (fn, arg) => page.evaluate(fn, arg);
const timed = async (fn, arg) => {
  const t = Date.now();
  await fn(arg);
  return Date.now() - t;
};

// ---- changing screen: the tab is drawn and painted ----
const tabs = await ev(() => Object.keys(FM.UI.screens));
const screens = [];
for (const tab of tabs) {
  const ms = await ev(
    (t) =>
      new Promise((resolve) => {
        const t0 = performance.now();
        FM.UI.go(t);
        requestAnimationFrame(() => requestAnimationFrame(() => resolve(Math.round(performance.now() - t0))));
      }),
    tab,
  );
  screens.push([tab, ms]);
}
screens.sort((a, b) => a[1] - b[1]);
const median = screens[screens.length >> 1][1],
  slowest = screens[screens.length - 1];

// ---- a match, the day after it, and the days to the next one ----
const full = [],
  days = [],
  skips = [],
  perDay = [];
for (let i = 0; i < MATCHES; i++) {
  await ev(() => FM.UI.go('home'));
  full.push(
    await timed(async () => {
      await ev(() => FM.UI.acts.instant());
      await page.waitForSelector('#postOv', { timeout: 120000 });
    }),
  );
  workerPeak = Math.max(workerPeak, await workerMB());
  days.push(
    await timed(async () => {
      await ev(() => FM.UI.acts.postContinue());
      await page.waitForFunction(() => !document.getElementById('postOv') && !FM.UI.simBusy, null, { timeout: 300000 });
    }),
  );
  workerPeak = Math.max(workerPeak, await workerMB());
  // the days before the next match (the ones that skip more than a day are the ones worth timing)
  const d0 = await ev(() => FM.S.day);
  const t0 = Date.now();
  await ev(() => FM.UI.acts.skipToMatch());
  await page.waitForFunction(() => !FM.UI.simBusy, null, { timeout: 300000 });
  const gone = (await ev(() => FM.S.day)) - d0;
  if (gone >= 2) {
    skips.push(Date.now() - t0);
    const last = await ev(() => FM.SimRunner.last);
    if (last) perDay.push(Math.round(last.ms / gone));
  }
  workerPeak = Math.max(workerPeak, await workerMB());
}
const mid = (a) => (a.length ? a.slice().sort((x, y) => x - y)[a.length >> 1] : 0);

// ---- saving ----
const save = [];
for (let i = 0; i < 2; i++)
  save.push(
    await ev(async () => {
      const t0 = performance.now();
      await FM.Save.write(FM.UI.slot, FM.S);
      return Math.round(performance.now() - t0);
    }),
  );
await settle(page, 0);
clearInterval(sampler);
const mainMB = mainPeak / 1048576;
const peakMB = Math.round(mainMB + workerPeak);
const errs = h.errors.length;
const errList = h.errors
  .slice(0, 3)
  .map((e) => e.text.slice(0, 160))
  .join(' | ');
await h.close();

const row = (ok, name, v, hi) => `${ok ? '✓' : '✗'} ${name}   ${v}   real 0–${hi}`;
const dayMs = mid(days),
  fullMs = mid(full),
  skipMs = mid(skips),
  saveMs = Math.max(...save);
const lines = [
  row(fullMs <= B.fulltime, `Full-time screen (ms, ${CPU}× slower)`, fullMs, B.fulltime),
  row(dayMs <= B.day, `Day with a match (ms, ${CPU}× slower)`, dayMs, B.day),
  skips.length ? row(skipMs <= B.skip, `Skip to the next match (ms, ${CPU}× slower)`, skipMs, B.skip) : null,
  row(median <= B.screen, `Changing tab, typical (ms, ${CPU}× slower)`, median, B.screen),
  row(
    slowest[1] <= B.screen * 2,
    `Changing tab, slowest: ${slowest[0]} (ms, ${CPU}× slower)`,
    slowest[1],
    B.screen * 2,
  ),
  row(saveMs <= B.save, `Saving (ms, ${CPU}× slower)`, saveMs, B.save),
  row(peakMB <= B.mb, `Peak memory, page and worker (MB)`, peakMB, B.mb),
].filter(Boolean);
console.log('\n' + lines.join('\n'));
if (perDay.length)
  console.log(`\nA day with no match for us: ${perDay.map((v) => v + ' ms').join(', ')} in the worker`);
console.log(`Tabs: ${screens.map(([t, ms]) => `${t} ${ms}`).join(' · ')}`);
if (errs) console.log(`${errs} error${errs === 1 ? '' : 's'} logged by the page: ${errList}`);
console.log(
  `\nBrowser speed: cpu ${CPU} · fulltime ${fullMs} ms · day ${dayMs} ms · skip ${skipMs} ms · tab ${median} ms · save ${saveMs} ms · memory ${peakMB} MB`,
);
const bad = lines.filter((l) => l[0] === '✗').length;
console.log(`${lines.length - bad}/${lines.length} in range`);
if (bad) {
  console.error('FAIL: over budget at phone speed');
  process.exit(1);
}
console.log('All checks passed');
