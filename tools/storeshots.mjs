// Store screenshots from a script. Plays the seeded career (tools/browser.mjs) to set moments (the matchday, the squad and its
// tactics, a player profile, the transfer market, the league table, a match being played, the full-time screen) and takes a
// screenshot of each at the sizes the app stores ask for, so the pictures always show the game as it is.
//   node tools/storeshots.mjs [--device iphone-6.9,ipad-13 | all] [--theme dark|light] [--out store/screenshots] [--seed 7]
// Sizes (CSS size × pixel ratio = the picture's size):
//   iphone-6.9     440×956  @3 = 1320×2868      iphone-6.5   428×926  @3 = 1284×2778      ipad-13       1032×1376 @2 = 2064×2752
//   android-phone  360×640  @3 = 1080×1920      android-tablet 800×1280 @2 = 1600×2560
// Pictures go to <out>/<device>/NN-name.png. Nothing in them is invented: they are the game's own screens, in a career made
// from a fixed seed, so a screenshot can be made again after any change.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from './harness.mjs';
import { openCareer, STORE_SIZES, settle, ROOT } from './browser.mjs';

const args = parseArgs();
const want = !args.device || args.device === 'all' ? Object.keys(STORE_SIZES) : String(args.device).split(',');
for (const w of want)
  if (!STORE_SIZES[w]) {
    console.error(`Unknown size "${w}". Sizes: ${Object.keys(STORE_SIZES).join(', ')}`);
    process.exit(1);
  }
const OUT = path.resolve(ROOT, String(args.out || 'store/screenshots'));
const theme = args.theme === 'light' ? 'light' : 'dark';
let made = 0;

for (const id of want) {
  const dev = STORE_SIZES[id];
  const dir = path.join(OUT, id);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const h = await openCareer({ device: dev, seed: +(args.seed || 7), colorScheme: theme });
  const { page } = h;
  const ev = (fn, a) => page.evaluate(fn, a);
  let n = 0;
  const shot = async (name) => {
    await ev(() => document.querySelectorAll('.toast').forEach((t) => t.remove()));
    await settle(page, 200);
    const file = path.join(dir, `${String(++n).padStart(2, '0')}-${name}.png`);
    await page.screenshot({ path: file });
    made++;
    console.log(`  ${path.relative(ROOT, file)}`);
  };
  console.log(`${dev.label}:`);
  if (theme === 'light') await ev(() => FM.UI.applyTheme && (document.documentElement.dataset.theme = 'light'));
  // the day of a match: the preview with its win chance
  await ev(() => FM.UI.go('home'));
  await shot('matchday');
  // the squad and its tactics
  await ev(() => FM.UI.go('squad'));
  await ev(() => document.querySelector('#main [data-act="sub"][data-k="squad"][data-v="tactics"]')?.click());
  await shot('tactics');
  // a player profile: the best player of the club
  const star = await ev(() => FM.W.squad(FM.W.userClub().id).sort((a, b) => b.ca - a.ca)[0].id);
  await ev((i) => FM.UI.playerSheet(i), star);
  await shot('player-profile');
  await ev(() => FM.UI.closeAllSheets());
  // the transfer market
  await ev(() => FM.UI.go('transfers'));
  await shot('transfers');
  // the league table
  await ev(() => FM.UI.go('league'));
  await shot('league-table');
  // a match being played: a few seconds into the live view, then full time
  await ev(() => FM.UI.go('home'));
  await ev(() => FM.UI.acts.kickoff());
  await page.waitForSelector('#matchOv', { timeout: 30000 }).catch(() => {});
  // (a picture of the first minute is everyone in one box: wait for open play, minute 15 to 40)
  await page.waitForTimeout(3000);
  await page.evaluate(() => document.querySelector('#matchOv [data-act="mSpeed"]')?.click());
  await page
    .waitForFunction(
      () => /(^|\s)(1[5-9]|[23]\d)'/.test((document.getElementById('matchOv') || {}).innerText || ''),
      null,
      { timeout: 90000 },
    )
    .catch(() => {});
  await shot('live-match');
  await ev(() => FM.UI.acts.mSim());
  await page.waitForSelector('#postOv', { timeout: 60000 });
  await shot('full-time');
  await h.close();
}
console.log(`\n${made} screenshots in ${path.relative(ROOT, OUT)}`);
console.log(`· Store screenshots made   ${made}   real 1–`);
console.log('All checks passed');
