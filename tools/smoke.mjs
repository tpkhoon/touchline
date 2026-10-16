// The smoke test for a built site (run after `npm run build`, in the deploy): does what players will download hang together?
//   - every script, style, icon and manifest the page names is in dist/, and so is every file the service worker caches
//   - the service worker's cache name is the one the build stamped, and its list does not name a file that is not there
//   - the simulation bundle (dist/js/sim.min.js, the code the worker runs) loads in a clean context, builds a world, plays three
//     days with a club taken over, saves and reloads it, and gives the same state back
//   - the screens' bundle (dist/js/ui.min.js) is valid JavaScript and ends by naming the screens the game starts from
//   node tools/smoke.mjs [--dist dist]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const DIST = path.resolve(
  ROOT,
  args[args.indexOf('--dist') + 1] && args.includes('--dist') ? args[args.indexOf('--dist') + 1] : 'dist',
);
const fails = [];
let n = 0;
const ok = (cond, msg) => {
  n++;
  if (!cond) fails.push(msg);
};
const read = (f) => fs.readFileSync(path.join(DIST, f), 'utf8');
ok(fs.existsSync(path.join(DIST, 'index.html')), `${DIST} has no index.html: run npm run build first`);
if (fails.length) {
  console.error(fails.join('\n'));
  process.exit(1);
}

// ---- the page and what it names ----
const html = read('index.html');
const named = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
  .map((m) => m[1].split('?')[0])
  .filter((f) => !/^(https?:|data:|mailto:)/.test(f));
for (const f of new Set(named)) ok(fs.existsSync(path.join(DIST, f)), `index.html names ${f}, which is not in dist`);
ok(
  named.some((f) => /sim\.min\.js$/.test(f)) && named.some((f) => /ui\.min\.js$/.test(f)),
  'index.html does not load both bundles',
);
ok(fs.existsSync(path.join(DIST, 'manifest.webmanifest')), 'no web manifest');
const manifest = JSON.parse(read('manifest.webmanifest'));
for (const i of manifest.icons || [])
  ok(fs.existsSync(path.join(DIST, i.src)), `the manifest names the icon ${i.src}, which is not in dist`);

// ---- the service worker ----
const sw = read('sw.js');
const cache = /CACHEs*=s*["']([^"']+)["']/.exec(sw);
ok(cache && cache[1].length > 3, 'the service worker has no cache name');
const listed = [...sw.matchAll(/["']\.\/([^"']+)["']/g)].map((m) => m[1]);
for (const f of listed) ok(fs.existsSync(path.join(DIST, f)), `the service worker caches ${f}, which is not in dist`);
ok(listed.length > 5, 'the service worker caches almost nothing');

// ---- the simulation bundle, as the worker runs it ----
let seed = 11;
const rng = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const SMath = Object.create(Math);
SMath.random = rng;
const store = {};
const ctx = {
  console,
  Math: SMath,
  setTimeout,
  performance,
  localStorage: {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => (store[k] = String(v)),
    removeItem: (k) => delete store[k],
  },
};
ctx.window = ctx;
ctx.self = ctx;
vm.createContext(ctx);
try {
  vm.runInContext(read('js/sim.min.js'), ctx, { filename: 'sim.min.js' });
  ok(true, '');
} catch (e) {
  ok(false, `the simulation bundle does not load: ${e.message}`);
}
const FM = ctx.FM;
ok(FM && FM.W && FM.Season && FM.Save, 'the simulation bundle lacks its modules');
if (FM && FM.W) {
  try {
    FM.W.newWorld({ win: 3, subs: 5, foreignLimit: 6, twoLegs: true, awayGoals: false });
    FM.Season.init();
    const club = Object.values(FM.S.clubs).find((c) => c.comp === 'D1' && c.rep < 75);
    FM.W.takeCharge(club.id, 'Smoke Test');
    for (let d = 0; d < 3; d++) FM.Season.advance(null);
    ok(FM.S.day >= 3, `three days were played but the world is on day ${FM.S.day}`);
    ok(
      Object.keys(FM.S.players).length > 15000 && Object.keys(FM.S.clubs).length > 900,
      'the world is smaller than the game makes',
    );
    // a save written and read back
    const packed = FM.Save.pack(FM.S);
    const back = FM.Save.unpack(packed).state;
    ok(
      back.year === FM.S.year && back.day === FM.S.day && back.user.clubId === club.id,
      'a save did not come back as it was',
    );
    ok(Object.keys(back.players).length === Object.keys(FM.S.players).length, 'a save came back with other players');
    const p = Object.values(FM.S.players)[100];
    const q = back.players[p.id];
    ok(
      q && q.ln === p.ln && q.ca === p.ca && JSON.stringify(q.attrs) === JSON.stringify(p.attrs),
      'a player did not come back from a save as he was',
    );
  } catch (e) {
    ok(false, `the built simulation could not play: ${e.stack || e.message}`);
  }
}

// ---- the screens' bundle ----
try {
  new vm.Script(read('js/ui.min.js'), { filename: 'ui.min.js' });
  ok(true, '');
} catch (e) {
  ok(false, `the screens' bundle is not valid JavaScript: ${e.message}`);
}
ok(/touchline/i.test(html) && /<div id="app"/.test(html), 'the page has no app container');

console.log(
  fails.length
    ? `FAIL (${fails.length} of ${n})\n - ${fails.join('\n - ')}`
    : `Smoke test: ${n} checks passed on ${path.relative(ROOT, DIST) || '.'}.`,
);
process.exit(fails.length ? 1 : 0);
