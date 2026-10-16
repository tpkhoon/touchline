// Shared by the tools that drive the game in a real browser (the screen crawler, the screenshot comparison, the store
// screenshots, the browser speed test): a static server for the game's files, a browser with a seeded Math.random and a fixed
// date, and a seeded save to start a career from, so every run sees the same game.
//
// The browser is any Chromium-based one that is already on the machine (Chrome, then Edge); a path in TOUCHLINE_BROWSER wins.
// The tools need `playwright-core` (npm install; it does not download a browser).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { ROOT, loadSim, SIM_SCRIPTS } from './harness.mjs';

export { ROOT };
export const STORE = path.join(ROOT, '.devtools');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

// Serves a folder of the game (the source, or a built dist/) on a free port. extra: { '/path': Buffer|string|file } for files that
// are not in the folder (the seeded save).
export function serve(root = ROOT, extra = {}) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (extra[p]) {
        const v = extra[p];
        res.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Cache-Control': 'no-store' });
        return res.end(typeof v === 'string' && fs.existsSync(v) ? fs.readFileSync(v) : v);
      }
      let file = path.normalize(path.join(root, p === '/' ? 'index.html' : p));
      if (!file.startsWith(path.normalize(root)) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404);
        return res.end('Not found');
      }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, '127.0.0.1', () =>
      resolve({ url: `http://127.0.0.1:${server.address().port}/`, close: () => new Promise((r) => server.close(r)) }),
    );
  });
}

export async function playwright() {
  try {
    return await import('playwright-core');
  } catch (e) {
    throw new Error('playwright-core is not installed: run `npm install` first.');
  }
}

// The sizes the stores ask for, and the screens people really have. css: the page's size in CSS pixels; scale: the pixel ratio
export const DEVICES = {
  phone: { w: 390, h: 844, scale: 1, label: 'Phone (390×844)' },
  small: { w: 360, h: 640, scale: 1, label: 'Small phone (360×640)' },
  tablet: { w: 820, h: 1180, scale: 1, label: 'Tablet (820×1180)' },
};
export const STORE_SIZES = {
  'iphone-6.9': { w: 440, h: 956, scale: 3, label: 'iPhone 6.9" (1320×2868)' },
  'iphone-6.5': { w: 428, h: 926, scale: 3, label: 'iPhone 6.5" (1284×2778)' },
  'ipad-13': { w: 1032, h: 1376, scale: 2, label: 'iPad 13" (2064×2752)' },
  'android-phone': { w: 360, h: 640, scale: 3, label: 'Android phone (1080×1920)' },
  'android-tablet': { w: 800, h: 1280, scale: 2, label: 'Android 10" tablet (1600×2560)' },
};

// Runs in the page before anything else: the same Math.random every run, and no network but the game's own server
const INIT = `(() => {
  let s = 0x9e3779b9;
  Math.random = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})();`;
export const QUIET_CSS = `*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important;caret-color:transparent!important;scroll-behavior:auto!important}`;

// Opens a page on the game. opts: { root, extra, device, cpu (CPU slow-down: 4 is about a mid-range phone), seeded, headless }
export async function open(opts = {}) {
  const pw = await playwright();
  const server = await serve(opts.root || ROOT, opts.extra || {});
  const want = process.env.TOUCHLINE_BROWSER;
  let browser = null,
    lastErr = null;
  const tries = want ? [{ executablePath: want }] : [{ channel: 'chrome' }, { channel: 'msedge' }, {}];
  for (const t of tries) {
    try {
      browser = await pw.chromium.launch({
        headless: opts.headless !== false,
        args: ['--enable-precise-memory-info'],
        ...t,
      });
      break;
    } catch (e) {
      lastErr = e;
    }
  }
  if (!browser)
    throw new Error(
      `No Chromium-based browser could be started (set TOUCHLINE_BROWSER to its path): ${lastErr && lastErr.message.split('\n')[0]}`,
    );
  const dev = opts.device || DEVICES.phone;
  const context = await browser.newContext({
    viewport: { width: dev.w, height: dev.h },
    deviceScaleFactor: dev.scale || 1,
    hasTouch: true,
    isMobile: dev.w < 700,
    serviceWorkers: 'block',
    locale: 'en-GB',
    timezoneId: 'UTC',
    colorScheme: opts.colorScheme || 'dark',
  });
  // (the emoji font is fetched from Google; offline runs must look like online ones)
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  if (opts.seeded !== false) await context.addInitScript(INIT);
  const page = await context.newPage();
  if (opts.seeded !== false) await page.clock.setFixedTime(new Date('2026-08-01T12:00:00Z'));
  const errors = [];
  page.on('pageerror', (e) =>
    errors.push({ kind: 'error', text: String(e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e) }),
  );
  page.on('console', (m) => {
    // (the fonts and emoji from other sites are refused on purpose: that is not an error of the game)
    if (
      (m.type() === 'error' && /127\.0\.0\.1/.test(m.location().url || '')) ||
      (m.type() === 'error' && !m.location().url)
    )
      errors.push({ kind: 'console', text: m.text().slice(0, 300) });
  });
  let cdp = null;
  if (opts.cpu && opts.cpu > 1) {
    cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: opts.cpu });
  }
  return {
    pw,
    browser,
    context,
    page,
    server,
    errors,
    cdp: cdp || (await context.newCDPSession(page)),
    cpu: opts.cpu || 1,
    async close() {
      await browser.close().catch(() => {});
      await server.close();
    },
  };
}

// ---------- A seeded career to start from ----------
// A world is made headlessly with a fixed seed, a few matchdays are played so the screens have something on them, and it is kept
// (in .devtools/seed/) until the simulation's code changes.
export function simHash() {
  const h = crypto.createHash('sha1');
  for (const f of SIM_SCRIPTS) h.update(fs.readFileSync(path.join(ROOT, 'js', f + '.js')));
  return h.digest('hex').slice(0, 10);
}
export function seedSave({ seed = 7, rounds = 8, log = () => {} } = {}) {
  const dir = path.join(STORE, 'seed');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `seed${seed}-r${rounds}-${simHash()}.touchline`);
  if (fs.existsSync(file)) return file;
  for (const f of fs.readdirSync(dir)) if (f.startsWith(`seed${seed}-`)) fs.rmSync(path.join(dir, f));
  log(`Making the seeded career (seed ${seed}, ${rounds} league rounds): once per change to the simulation…`);
  const { FM } = loadSim(seed);
  const { W, Season: Sea } = FM;
  W.newWorld(W.REAL_RULES);
  Sea.init();
  W.takeCharge(Object.values(FM.S.clubs).find((c) => c.comp === 'D1' && c.rep < 70).id, 'Dev Manager');
  let guard = 400;
  // up to the morning of a league match after `rounds` rounds of the league have been played
  while (guard-- > 0) {
    const cal = Sea.today();
    const fx = Sea.userFixture();
    if (cal && cal.type === 'league' && cal.round >= rounds && fx) break;
    if (fx && !FM.S.user.sacked) Sea.applyUserMatch(FM.quickSim(fx, !!fx.ko));
    Sea.advance(null);
  }
  fs.writeFileSync(file, zlib.gzipSync(Buffer.from(FM.Save.pack(FM.S), 'utf8')));
  return file;
}

// In the page: take the saved career and open it as the Continue button would
export async function startCareer(h, saveFile) {
  const { page } = h;
  if (h.beforeGoto) await h.beforeGoto(page);
  await page.goto(h.server.url, { waitUntil: 'load' });
  await page.waitForFunction(() => window.FM && FM.UI && FM.Save && FM.UI.mount);
  await page.addStyleTag({ content: QUIET_CSS });
  await page.evaluate(async () => {
    const res = await (await fetch('/__seed.touchline')).arrayBuffer();
    const r = await FM.Save.importBytes(new Uint8Array(res));
    await FM.Save.write(1, r.state);
    if (!(await FM.UI.load(1))) throw new Error('the seeded save did not load');
    FM.UI.applyTheme();
    FM.UI.tab = 'home';
    FM.UI.mount();
  });
  await page.waitForSelector('#main');
  await settle(page);
}
// A seeded career in a fresh browser: { h, ... }
export async function openCareer(opts = {}) {
  const saveFile =
    opts.save || seedSave({ seed: opts.seed || 7, rounds: opts.rounds || 8, log: opts.log || console.log });
  const h = await open({ ...opts, extra: { '/__seed.touchline': saveFile } });
  h.beforeGoto = opts.beforeGoto;
  await startCareer(h, saveFile);
  return h;
}
// Two frames and a short wait: the screen has been drawn
export const settle = async (page, ms = 60) => {
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  if (ms) await page.waitForTimeout(ms);
};

export const tmpdir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'touchline-browser-'));
export const here = path.dirname(fileURLToPath(import.meta.url));
