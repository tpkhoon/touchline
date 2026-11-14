// Shared by the headless tools (sim-test, calibrate, regens): loads the simulation scripts — the same list the Web
// Worker uses, FM.SimRunner.SCRIPTS in js/simrun.js — into a VM context whose Math.random is a seeded generator,
// so every run with the same seed plays out identically.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// --seasons 3 --seed 7 --json  →  { seasons: '3', seed: '7', json: undefined }
export const parseArgs = (argv = process.argv.slice(2)) =>
  Object.fromEntries(
    argv
      .join(' ')
      .split('--')
      .filter(Boolean)
      .map((a) => a.trim().split(/\s+/)),
  );

export const SIM_SCRIPTS = fs
  .readFileSync(path.join(ROOT, 'js/simrun.js'), 'utf8')
  .match(/R\.SCRIPTS = \[([^\]]+)\]/)[1]
  .match(/'([^']+)'/g)
  .map((s) => s.slice(1, -1));

// Load the simulation with a seeded Math.random. localStorage defaults to a no-op stand-in.
export function loadSim(seed, localStorage = { getItem: () => null, setItem() {}, removeItem() {} }) {
  let s = seed;
  const rng = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const SMath = Object.create(Math);
  SMath.random = rng;
  const ctx = { console, Math: SMath, setTimeout, performance, localStorage };
  ctx.window = ctx;
  vm.createContext(ctx);
  for (const f of SIM_SCRIPTS)
    vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', f + '.js'), 'utf8'), ctx, { filename: f + '.js' });
  const FM = ctx.FM;
  applyTune(FM, process.env.TOUCHLINE_TUNE);
  return { ctx, FM };
}

// Tuning constants can be overridden for one run without editing the source, to try a value (the developer dashboard's
// parameter sweeps do this): TOUCHLINE_TUNE='{"Transfers.HOME_SCALE":1.2,"Season.LEARN.step":0.02}'. A path names a
// number that already exists under FM; anything else is refused, so a typo cannot silently do nothing.
export function applyTune(FM, text) {
  if (!text) return;
  const tune = typeof text === 'string' ? JSON.parse(text) : text;
  for (const [p, v] of Object.entries(tune)) {
    const parts = p.split('.');
    const key = parts.pop();
    const target = parts.reduce((o, k) => (o == null ? o : o[k]), FM);
    if (!target || typeof target[key] !== 'number' || typeof v !== 'number')
      throw new Error(`Cannot tune "${p}": not a number in the game`);
    target[key] = v;
  }
}

// Every number the game exposes as a tuning constant: capitalised numbers on a module (FM.Transfers.OFFLOAD) and the
// numbers inside capitalised objects (FM.Season.LEARN.step), with their current values.
export function listTunables(FM) {
  const out = [];
  for (const [mod, obj] of Object.entries(FM)) {
    if (!obj || typeof obj !== 'object' || ['D', 'S', 'U', 'Dev'].includes(mod)) continue;
    for (const [k, v] of Object.entries(obj)) {
      if (!/^[A-Z][A-Z0-9_]*$/.test(k)) continue;
      if (typeof v === 'number') out.push({ path: `${mod}.${k}`, value: v });
      else if (v && typeof v === 'object' && !Array.isArray(v))
        for (const [k2, v2] of Object.entries(v))
          if (typeof v2 === 'number') out.push({ path: `${mod}.${k}.${k2}`, value: v2 });
    }
  }
  return out.sort((a, b) => a.path.localeCompare(b.path));
}

// ---------- A prepared world for the tests ----------
// Making the world takes minutes (a hundred seconds at best), and every check that began with W.newWorld made its own. The first call
// makes the world as the build does (tools/buildworld.mjs: every league in the light tier, the thirty seasons of history and the clubs'
// legends) and keeps it in .devtools/worlds, named by the seed and by a hash of the simulation's source, so any change to the code makes
// a new one; every call after that opens it in a few seconds. Returns { cached, ms }. The state is in FM.S, as after W.newWorld and
// Season.init and seedHistory: a check that wants a manager takes charge of a club, as it did.
//   const { FM } = loadSim(7); cachedWorld(FM, { seed: 7 });
export function sourceKey() {
  const h = crypto.createHash('sha1');
  for (const f of SIM_SCRIPTS) h.update(fs.readFileSync(path.join(ROOT, 'js', f + '.js')));
  return h.digest('hex').slice(0, 10);
}
// world: the path of a world file to open as it is (the prepared world the build made, dist/data/world.touchline), for the checks that run on
// the world that ships; none: the kept one for this source, made when it is not there.
export function cachedWorld(FM, { seed = 7, sims, world } = {}) {
  const t0 = Date.now(),
    dir = path.join(ROOT, '.devtools', 'worlds'),
    file = world ? path.resolve(ROOT, world) : path.join(dir, `world-${sourceKey()}-${seed}.touchline`);
  const W = FM.W;
  const light = Object.fromEntries(FM.D.LEAGUES.map((l) => [l.id, 'light']));
  let cached = false;
  if (fs.existsSync(file)) {
    const state = FM.Save.unpack(zlib.gunzipSync(fs.readFileSync(file)).toString('utf8'), { world: true }).state;
    if (FM.DbImport && FM.DbImport.restore) FM.DbImport.restore(state);
    FM.S = FM.Save.relink(state);
    W.rosterVer++;
    W.fitPreparedWorld(sims || light);
    cached = true;
  } else {
    if (world) throw new Error(`No prepared world at ${file}: run npm run build:world.`);
    W.newWorld({ ...W.REAL_RULES, sims: light });
    FM.Season.init();
    W.seedHistory();
    W.seedLegends();
    FM.S.prepared = { seed, sim: sourceKey() };
    fs.mkdirSync(dir, { recursive: true });
    for (const old of fs.readdirSync(dir)) if (old.endsWith(`-${seed}.touchline`)) fs.unlinkSync(path.join(dir, old)); // (the worlds of older sources)
    fs.writeFileSync(file, zlib.gzipSync(Buffer.from(FM.Save.pack(FM.S), 'utf8'), { level: 6 }));
    if (sims) W.fitPreparedWorld(sims);
  }
  return { cached, ms: Date.now() - t0 };
}
