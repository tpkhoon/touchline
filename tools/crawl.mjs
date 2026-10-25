// Screen crawler: starts a seeded career in a real browser, opens every tab and sub-tab, a sample of players and clubs, the match
// preview and full-time screens, the settings and the title screen, and flags on each:
//   - "undefined", "NaN", "[object Object]" in the words on screen
//   - JavaScript errors (thrown or logged) while the screen was drawn
//   - text that overflows its box or is cut off, and pages wider than the screen
//   - text or fields whose colour is nearly the colour behind them (an invisible field)
//   node tools/crawl.mjs [--device phone|small|tablet] [--players 10] [--clubs 8] [--stress] [--seed 7] [--only tab,tab] [--show]
//   --stress   makes every word 40% longer before looking (German and Vietnamese run longer than English)
//   --show     shows the browser window
// Writes .devtools/crawl/report.json and a screenshot of each screen with a problem. Exit 1 when any screen has one.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from './harness.mjs';
import { openCareer, DEVICES, settle, STORE, ROOT } from './browser.mjs';
import { inspect, problemsOf } from './screencheck.mjs';

const args = parseArgs();
const DEVICE = DEVICES[args.device] || DEVICES.phone;
const stress = 'stress' in args;
// --lang de: the words of data/lang/de.json put in place of the English ones that match exactly (see tools/i18n.mjs)
let map = null;
if (args.lang) {
  const read = (c) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'lang', c + '.json'), 'utf8')).strings || {};
  const en = read('en'),
    tr = read(String(args.lang));
  map = {};
  for (const [k, text] of Object.entries(en)) if (tr[k] && !/\{\d+\}/.test(text)) map[text] = tr[k];
}
const only = args.only ? String(args.only).split(',') : null;
const OUT = path.join(STORE, stress || args.lang ? 'crawl-' + (args.lang || 'stress') : 'crawl');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const h = await openCareer({
  device: DEVICE,
  seed: +(args.seed || 7),
  headless: !('show' in args),
  // (--coverage file: the code the screens ran, for tools/coverage.mjs)
  beforeGoto: args.coverage ? (page) => page.coverage.startJSCoverage({ resetOnNavigation: false }) : undefined,
});
const { page, errors } = h;
const results = [];
// Problems that are known and accepted (tools/crawl-baseline.json), the way the escape check keeps its baseline: they are
// counted but do not fail the run; a new one does. A problem is named by its screen and what it says with the words and numbers
// taken out, so a different player's name on the same screen is the same problem. --write-baseline accepts what is found now.
const BASE_FILE = path.join(ROOT, 'tools', 'crawl-baseline.json');
const baseline = new Set(fs.existsSync(BASE_FILE) ? JSON.parse(fs.readFileSync(BASE_FILE, 'utf8')).known || [] : []);
const keyOf = (name, problem) =>
  `${name.replace(/\b(player|club) \S+/, '$1 *')} | ${problem.replace(/“[^”]*”/g, '“…”').replace(/\d+/g, 'N')}`.slice(
    0,
    200,
  );
let knownCount = 0;
const seenKeys = new Set();

async function look(name, scope, extra = {}) {
  if (only && !only.some((o) => name.startsWith(o))) return;
  const before = errors.length;
  await settle(page, 40);
  const r = await page.evaluate(([s, o]) => window.__inspect(s, o), [scope, { stress, map }]).catch(() => null);
  const errs = errors
    .slice(before)
    .map((e) => `${e.kind === 'error' ? 'JavaScript error' : 'console error'}: ${e.text}`);
  const all = r ? [...problemsOf(r), ...errs] : ['could not be inspected'];
  if (r && !r.text && !extra.allowEmpty) all.push('nothing on screen');
  for (const pr of all) seenKeys.add(keyOf(name, pr));
  const problems = all.filter((pr) => !baseline.has(keyOf(name, pr)));
  knownCount += all.length - problems.length;
  const entry = { name, problems, known: all.length - problems.length, low: r ? r.low : 0, checked: r ? r.checked : 0 };
  results.push(entry);
  if (problems.length) {
    const file = name.replace(/[^\w.-]+/g, '_') + '.png';
    await page.screenshot({ path: path.join(OUT, file) }).catch(() => {});
    entry.shot = file;
    console.log(`✗ ${name}`);
    for (const p of problems.slice(0, 10)) console.log(`    ${p}`);
  }
}

// the inspector is sent to the page once, under a name, so it can be called with two arguments
await page.evaluate(`window.__inspect = ${inspect.toString()}`);
const run = (name, fn) =>
  fn().catch((e) => {
    results.push({ name, problems: [`could not be opened: ${e.message.split('\n')[0]}`] });
    console.log(`✗ ${name}\n    could not be opened: ${e.message.split('\n')[0]}`);
  });
const evalIn = (fn, arg) => page.evaluate(fn, arg);

// ---- tabs and their sub-tabs ----
const tabs = await evalIn(() => Object.keys(FM.UI.screens));
for (const tab of tabs) {
  await run(`tab ${tab}`, async () => {
    await evalIn((t) => FM.UI.go(t), tab);
    await look(`tab ${tab}`, '#main');
    const seen = new Set();
    for (let depth = 0; depth < 2; depth++) {
      const subs = await evalIn(() =>
        [...document.querySelectorAll('#main [data-act="sub"]')].map((b) => [b.dataset.k, b.dataset.v]),
      );
      const fresh = subs.filter(([k, v]) => !seen.has(k + '=' + v));
      if (!fresh.length) break;
      for (const [k, v] of fresh) {
        seen.add(k + '=' + v);
        const ok = await evalIn(
          ([k, v]) => {
            const b = document.querySelector(`#main [data-act="sub"][data-k="${k}"][data-v="${v}"]`);
            if (!b) return false;
            b.click();
            return true;
          },
          [k, v],
        );
        if (ok) await look(`tab ${tab} › ${k}=${v}`, '#main');
      }
    }
  });
}

// ---- sheets: players and clubs of every kind ----
const people = await evalIn(
  ([np, nc]) => {
    const S = FM.S,
      W = FM.W;
    const mine = W.squad(W.userClub().id),
      others = Object.values(S.players).filter((p) => !p.retired && p.clubId && !W.ownPlayer(p));
    const pick = [
      mine.find((p) => p.pos === 'GK'),
      mine.find((p) => p.pos !== 'GK'),
      mine.find((p) => p.team),
      mine.find((p) => p.inj),
      others.find((p) => p.pos === 'GK'),
      others[0],
      others[others.length >> 1],
      others.find((p) => W.age(p) <= 18),
      others.find((p) => W.age(p) >= 35),
      Object.values(S.players).find((p) => !p.clubId && !p.retired),
    ];
    for (let i = 0; pick.length < np; i++) pick.push(others[Math.floor(((i + 1) * others.length) / (np + 1))]);
    const clubs = Object.values(S.clubs).sort((a, b) => b.rep - a.rep);
    const cs = [clubs[0], clubs[clubs.length >> 1], clubs[clubs.length - 1], W.userClub()];
    for (let i = 0; cs.length < nc; i++) cs.push(clubs[Math.floor(((i + 1) * clubs.length) / (nc + 1))]);
    return {
      players: [...new Set(pick.filter(Boolean).map((p) => p.id))].slice(0, np),
      clubs: [...new Set(cs.map((c) => c.id))].slice(0, nc),
    };
  },
  [+(args.players || 10), +(args.clubs || 8)],
);
for (const id of people.players)
  await run(`player ${id}`, async () => {
    await evalIn((i) => FM.UI.playerSheet(i), id);
    await look(`player ${id}`, 'last:.sheet-wrap');
    await evalIn(() => FM.UI.closeAllSheets());
  });
for (const id of people.clubs)
  await run(`club ${id}`, async () => {
    await evalIn((i) => FM.UI.clubSheet(i), id);
    await look(`club ${id}`, 'last:.sheet-wrap');
    await evalIn(() => FM.UI.closeAllSheets());
  });

// ---- the sheets that are not about a person ----
for (const act of ['openSettings', 'reportProblem', 'sendFeedback'])
  await run(`sheet ${act}`, async () => {
    await evalIn((a) => FM.UI.acts[a]({}), act);
    await look(`sheet ${act}`, 'last:.sheet-wrap');
    await evalIn(() => FM.UI.closeAllSheets());
  });

// ---- the match: preview, full time and its tabs ----
await run('match preview', async () => {
  await evalIn(() => FM.UI.acts.preview());
  await look('match preview', 'last:.sheet-wrap');
  await evalIn(() => FM.UI.closeAllSheets());
});
await run('match full time', async () => {
  await evalIn(() => FM.UI.acts.instant());
  await page.waitForSelector('#postOv', { timeout: 60000 });
  await look('match full time', '#postOv');
  const chips = await evalIn(() =>
    [...document.querySelectorAll('#postChips [data-act]')].map((b) => [
      b.dataset.act,
      b.dataset.v || b.dataset.k || '',
    ]),
  );
  for (const [act, v] of chips.slice(0, 8)) {
    await evalIn(
      ([a, v]) => {
        const b = [...document.querySelectorAll('#postChips [data-act]')].find(
          (x) => x.dataset.act === a && (x.dataset.v || x.dataset.k || '') === v,
        );
        if (b) b.click();
      },
      [act, v],
    );
    await look(`match full time › ${v || act}`, '#postOv');
  }
  await evalIn(() => FM.UI.acts.postContinue());
  await page.waitForFunction(() => !document.getElementById('postOv') && !FM.UI.simBusy, null, { timeout: 120000 });
});
await run('home after the match', async () => {
  await evalIn(() => FM.UI.go('home'));
  await look('home after the match', '#main');
});

// ---- the title screen and the start of a new career ----
await run('title screen', async () => {
  await evalIn(() => FM.UI.acts.toTitle());
  await look('title screen', '#app');
});
await run('new career', async () => {
  await evalIn(() => FM.UI.acts.newCareer({}));
  await look('new career', '#app');
});

if (args.coverage) {
  const entries = await page.coverage.stopJSCoverage();
  fs.writeFileSync(String(args.coverage), JSON.stringify(entries.map((e) => ({ url: e.url, functions: e.functions }))));
}
await h.close();
const bad = results.filter((r) => r.problems.length);
if ('write-baseline' in args) {
  fs.writeFileSync(BASE_FILE, JSON.stringify({ known: [...seenKeys].sort() }, null, 1) + '\n');
  console.log(`Accepted ${seenKeys.size} known problems in tools/crawl-baseline.json`);
}
fs.writeFileSync(
  path.join(OUT, 'report.json'),
  JSON.stringify({ at: Date.now(), device: DEVICE.label, stress, results }, null, 1),
);
const low = results.reduce((t, r) => t + (r.low || 0), 0);
console.log(
  `\nCrawled ${results.length} screens at ${DEVICE.label}${stress ? ' with every word 40% longer' : ''}: ${bad.length ? bad.length + ' with problems' : 'all clean'}${knownCount ? ` (${knownCount} known problems accepted in tools/crawl-baseline.json)` : ''}${low ? ` · ${low} places with weak contrast (under 3:1)` : ''}`,
);
console.log(
  `${stress ? '·' : bad.length ? '✗' : '✓'} Screens with a problem${stress ? ' (longer words)' : ''}   ${bad.length}   real 0–0`,
);
console.log(`· Screens crawled${stress ? ' (longer words)' : ''}   ${results.length}   real 20–`);
if (!bad.length) console.log('All checks passed');
process.exit(bad.length && !stress ? 1 : 0);
