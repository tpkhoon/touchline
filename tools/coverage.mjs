// Code coverage: which lines of the game the tests actually run. Node's own V8 coverage is collected while the unit tests and a
// season of the regression test run (the simulation, loaded the way the tests load it), and, with --browser, while the screen
// crawler opens every screen (the interface, which Node never loads). Files no test touches at all are listed first, then the
// functions that nothing calls.
//   node tools/coverage.mjs [--seasons 1] [--browser 1] [--min 0] [--list 20]
//   --browser 0   the simulation only (no browser needed)   --min N   exit 1 when the total is under N%
// Writes .devtools/coverage/report.json for the dashboard.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseArgs, ROOT, SIM_SCRIPTS } from './harness.mjs';

const args = parseArgs();
const SEASONS = +(args.seasons || 1);
const BROWSER = +(args.browser ?? 1) === 1;
const OUT = path.join(ROOT, '.devtools', 'coverage');
const RAW = path.join(OUT, 'raw');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(RAW, { recursive: true });

// ---------- Collect ----------
const run = (label, argv) => {
  const t = Date.now();
  process.stdout.write(`Running ${label}… `);
  const r = spawnSync(process.execPath, argv, {
    cwd: ROOT,
    env: { ...process.env, NODE_V8_COVERAGE: RAW, FORCE_COLOR: '0' },
    encoding: 'utf8',
    maxBuffer: 1 << 28,
  });
  console.log(`${r.status === 0 ? 'done' : 'exit ' + r.status} (${Math.round((Date.now() - t) / 1000)} s)`);
  return r.status === 0;
};
run('the unit tests', ['tools/unit.mjs']);
run(`the regression test (${SEASONS} season${SEASONS === 1 ? '' : 's'})`, [
  'tools/sim-test.mjs',
  '--seasons',
  String(SEASONS),
  '--seed',
  '7',
]);
const browserFiles = [];
if (BROWSER) {
  // (a relative path: the tools' argument reader splits on spaces, and the project folder may have some)
  const rel = '.devtools/coverage/browser.json';
  const file = path.join(ROOT, rel);
  const ok = run('the screen crawler in a browser', ['tools/crawl.mjs', '--coverage', rel]);
  if (fs.existsSync(file)) browserFiles.push(file);
  else if (!ok) console.log('  (no browser coverage: the crawler could not run here)');
}

// ---------- Merge ----------
// Per script (by file name), a count per character: the innermost range covering it decides
const scripts = new Map(); // name → { len, counts: Float64Array (max over runs), funcs: Map }
const names = new Set([
  ...SIM_SCRIPTS,
  ...fs
    .readdirSync(path.join(ROOT, 'js'))
    .filter((f) => f.endsWith('.js'))
    .map((f) => f.replace(/\.js$/, '')),
]);
const text = (name) => fs.readFileSync(path.join(ROOT, 'js', name + '.js'), 'utf8');
function addEntry(url, functions) {
  const base = String(url).split(/[\\/]/).pop().split('?')[0].replace(/\.js$/, '');
  if (!names.has(base) || /node_modules|\/tools\//.test(String(url))) return;
  const src = text(base);
  if (!scripts.has(base)) scripts.set(base, { len: src.length, counts: new Int32Array(src.length), funcs: new Map() });
  const sc = scripts.get(base);
  const one = new Int32Array(sc.len);
  const ranges = [];
  for (const f of functions)
    for (const [i, r] of f.ranges.entries()) ranges.push({ ...r, fn: f.functionName, first: i === 0 });
  // outer ranges first, so the inner ones overwrite them
  ranges.sort((a, b) => a.startOffset - b.startOffset || b.endOffset - a.endOffset);
  for (const r of ranges) one.fill(r.count, Math.min(sc.len, r.startOffset), Math.min(sc.len, r.endOffset));
  for (let i = 0; i < sc.len; i++) if (one[i] > sc.counts[i]) sc.counts[i] = one[i];
  for (const f of functions) {
    const r = f.ranges[0];
    if (!f.functionName || r.endOffset - r.startOffset < 60) continue;
    const key = `${f.functionName}@${r.startOffset}`;
    const prev = sc.funcs.get(key) || { name: f.functionName, start: r.startOffset, end: r.endOffset, calls: 0 };
    prev.calls = Math.max(prev.calls, r.count);
    sc.funcs.set(key, prev);
  }
}
for (const f of fs.readdirSync(RAW).filter((f) => f.endsWith('.json'))) {
  const j = JSON.parse(fs.readFileSync(path.join(RAW, f), 'utf8'));
  for (const s of j.result || []) addEntry(s.url, s.functions);
}
for (const f of browserFiles) for (const s of JSON.parse(fs.readFileSync(f, 'utf8'))) addEntry(s.url, s.functions);

// ---------- Lines ----------
const report = [];
for (const name of [...names].sort()) {
  if (name === 'devtools' || name === 'changelog') continue;
  const src = text(name);
  const sc = scripts.get(name);
  const lines = src.split('\n');
  let off = 0,
    code = 0,
    hit = 0,
    inBlock = false;
  const uncovered = [];
  for (let n = 0; n < lines.length; n++) {
    const line = lines[n];
    const start = off;
    off += line.length + 1;
    const t = line.trim();
    if (inBlock) {
      if (t.includes('*/')) inBlock = false;
      continue;
    }
    if (t.startsWith('/*')) {
      if (!t.includes('*/')) inBlock = true;
      continue;
    }
    if (!t || t.startsWith('//') || /^[})\]{[(;,]+$/.test(t) || /^\}\)?;?$/.test(t)) continue;
    code++;
    let covered = false;
    if (sc)
      for (let i = start; i < start + line.length; i++)
        if (sc.counts[i] > 0 && !/\s/.test(src[i])) {
          covered = true;
          break;
        }
    if (covered) hit++;
    else uncovered.push(n + 1);
  }
  const funcs = sc ? [...sc.funcs.values()].filter((f) => f.calls === 0) : [];
  report.push({
    file: `${name}.js`,
    loaded: !!sc,
    ui: /^ui-|^matchview|^matchmotion|^native|^simrun|^sim-worker/.test(name),
    code,
    hit,
    pct: code ? Math.round((1000 * hit) / code) / 10 : 100,
    uncoveredFuncs: funcs
      .map((f) => ({
        name: f.name,
        line: src.slice(0, f.start).split('\n').length,
        lines: src.slice(f.start, f.end).split('\n').length,
      }))
      .sort((a, b) => b.lines - a.lines)
      .slice(0, 12),
    uncovered: uncovered.length > 400 ? [] : uncovered,
  });
}
const tot = (rows) => ({ code: rows.reduce((t, r) => t + r.code, 0), hit: rows.reduce((t, r) => t + r.hit, 0) });
const pct = (t) => (t.code ? Math.round((1000 * t.hit) / t.code) / 10 : 0);
const simRows = report.filter((r) => !r.ui),
  uiRows = report.filter((r) => r.ui);
const simT = tot(simRows),
  uiT = tot(uiRows),
  allT = tot(report);
fs.writeFileSync(
  path.join(OUT, 'report.json'),
  JSON.stringify(
    {
      at: Date.now(),
      seasons: SEASONS,
      browser: BROWSER,
      sim: pct(simT),
      ui: pct(uiT),
      total: pct(allT),
      files: report,
    },
    null,
    1,
  ),
);

// ---------- Report ----------
const untouched = report.filter((r) => r.pct === 0 && r.code > 20);
console.log(
  `\nLine coverage: simulation ${pct(simT)}% (${simT.hit}/${simT.code} lines) · interface ${pct(uiT)}%${BROWSER ? '' : ' (not measured: --browser 0)'} · together ${pct(allT)}%`,
);
if (untouched.length) {
  console.log(`\nFiles no test touches at all (${untouched.length}):`);
  for (const r of untouched.sort((a, b) => b.code - a.code))
    console.log(`  ${r.file.padEnd(22)} ${String(r.code).padStart(5)} lines${r.ui && !BROWSER ? ' (interface)' : ''}`);
}
const low = report
  .filter((r) => r.pct > 0 && r.pct < 40 && r.code > 40)
  .sort((a, b) => a.pct - b.pct)
  .slice(0, +(args.list || 15));
if (low.length) {
  console.log(`\nLeast covered files:`);
  for (const r of low) console.log(`  ${r.file.padEnd(22)} ${String(r.pct).padStart(5)}%  of ${r.code} lines`);
}
const big = report
  .flatMap((r) => r.uncoveredFuncs.map((f) => ({ ...f, file: r.file })))
  .sort((a, b) => b.lines - a.lines)
  .slice(0, +(args.list || 15));
if (big.length) {
  console.log(`\nLargest functions nothing calls:`);
  for (const f of big) console.log(`  ${f.file}:${f.line}  ${f.name}  (${f.lines} lines)`);
}
console.log('');
console.log(`· Line coverage, simulation (%)   ${pct(simT)}   real 0–`);
if (BROWSER) console.log(`· Line coverage, interface (%)   ${pct(uiT)}   real 0–`);
console.log(`· Files no test touches   ${untouched.length}   real 0–`);
for (const r of report.filter((r) => r.code > 40 && (!r.ui || BROWSER)))
  console.log(`· Coverage ${r.file} (%)   ${r.pct}   real 0–`);
const min = +(args.min || 0);
if (min && pct(allT) < min) {
  console.error(`FAIL: ${pct(allT)}% is under the ${min}% asked for`);
  process.exit(1);
}
console.log('All checks passed');
