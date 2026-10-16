// The library of old saves and kept problem reports. A long career is what a player has most to lose, so every release keeps one
// save in the repo (tests/saves/), and every problem report that was turned into a fix is kept as a test case (tests/reports/).
// Each one must still open in the current version, pass the world checks, play a few days without a fault and survive a pack and
// unpack.
//   node tools/savelib.mjs [--days 5] [--only name]       test every file in tests/saves and tests/reports
//   node tools/savelib.mjs --snapshot [--seasons 1]        add a save made by this version (tests/saves/v<version>-save<format>.touchline)
//   node tools/savelib.mjs --add file.touchline [--name n] [--reports]   add a save, or with --reports a problem report, to the library
// A report keeps the note the player sent (its "report" section), so the file says what the bug was.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { parseArgs, loadSim, ROOT } from './harness.mjs';
import { attach } from './worldchecks.mjs';

export const SAVES = path.join(ROOT, 'tests', 'saves');
export const REPORTS = path.join(ROOT, 'tests', 'reports');
const read = (f) => {
  const buf = fs.readFileSync(f);
  try {
    return zlib.gunzipSync(buf).toString('utf8');
  } catch (e) {
    return buf.toString('utf8');
  }
};
const files = (dir) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => /\.(touchline|json)$/.test(f) && !f.endsWith('.meta.json'))
        .sort()
        .map((f) => path.join(dir, f))
    : [];

// One file: opens, upgrades, checks, plays days, round-trips. Returns { ok, problems, version, ... }
export function testFile(file, { days = 5 } = {}) {
  const problems = [];
  const info = { file: path.relative(ROOT, file), name: path.basename(file), bytes: fs.statSync(file).size };
  let text, parsed;
  try {
    text = read(file);
    parsed = JSON.parse(text);
  } catch (e) {
    return { ...info, ok: false, problems: ['is not a readable save: ' + e.message] };
  }
  info.report = parsed.report || null;
  delete parsed.report;
  info.version = parsed.version;
  info.year = parsed.year;
  const { ctx, FM } = loadSim(7);
  info.current = FM.SAVE_VERSION;
  if (parsed.version > FM.SAVE_VERSION) return { ...info, ok: false, problems: ['was made by a newer version'] };
  if (parsed.version < (FM.Save.OLDEST || 4))
    return { ...info, ok: false, problems: ['is older than the oldest version that is upgraded'] };
  const checks = attach(ctx);
  let state;
  const t0 = Date.now();
  try {
    state = FM.Save.unpack(parsed).state;
    FM.S = FM.Save.relink(state);
    FM.W.rosterVer++;
  } catch (e) {
    return {
      ...info,
      ok: false,
      problems: ['could not be opened: ' + (e.stack || e.message).split('\n').slice(0, 4).join(' | ')],
    };
  }
  info.openMs = Date.now() - t0;
  const before = new Set(checks.failing().map((r) => r.id));
  for (const f of checks.failing())
    problems.push(
      `world check fails after the upgrade: ${f.label}${f.detail.length ? ' (' + f.detail.slice(0, 3).join('; ') + ')' : ''}`,
    );
  const { W, Season: Sea } = FM;
  let played = 0;
  try {
    for (let i = 0; i < days; i++) {
      const S = FM.S;
      const fx = Sea.userFixture();
      if (fx && S.user && !S.user.sacked) Sea.applyUserMatch(FM.quickSim(fx, !!fx.ko));
      Sea.advance(null);
      if (!W.employed() && S.user.offers && S.user.offers.length)
        W.takeCharge(S.user.offers[0].id, 'Library Manager', false);
      played++;
    }
  } catch (e) {
    problems.push(`fault on day ${played + 1}: ${(e.stack || e.message).split('\n').slice(0, 5).join(' | ')}`);
  }
  info.played = played;
  for (const f of checks.failing())
    if (!before.has(f.id)) problems.push(`world check fails after ${played} days: ${f.label}`);
  try {
    const again = FM.Save.unpack(FM.Save.pack(FM.S)).state;
    if (
      Object.keys(again.players).length !== Object.keys(FM.S.players).length ||
      again.year !== FM.S.year ||
      again.day !== FM.S.day
    )
      problems.push('is not the same world after a pack and unpack');
  } catch (e) {
    problems.push('could not be packed and opened again: ' + e.message);
  }
  return { ...info, ok: !problems.length, problems };
}

export function list() {
  return [
    ...files(SAVES).map((f) => ({ kind: 'release', file: f })),
    ...files(REPORTS).map((f) => ({ kind: 'report', file: f })),
  ];
}

// ---------- Command line ----------
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  const args = parseArgs();
  if ('snapshot' in args) {
    const { FM } = loadSim(7);
    const { W, Season: Sea } = FM;
    W.newWorld(W.REAL_RULES);
    Sea.init();
    W.takeCharge(Object.values(FM.S.clubs).find((c) => c.comp === 'D1' && c.rep < 70).id, 'Library Manager');
    const seasons = +(args.seasons || 1);
    const start = FM.S.year;
    let guard = 2000;
    // a career that has been going a while: the seasons asked for, and a few weeks of the next
    while (guard-- > 0 && (FM.S.year < start + seasons || FM.S.day < 40)) {
      const fx = Sea.userFixture();
      if (fx && !FM.S.user.sacked) Sea.applyUserMatch(FM.quickSim(fx, !!fx.ko));
      Sea.advance(null);
      if (!W.employed() && FM.S.user.offers && FM.S.user.offers.length)
        W.takeCharge(FM.S.user.offers[0].id, 'Library Manager', false);
    }
    fs.mkdirSync(SAVES, { recursive: true });
    const name = `v${FM.VERSION}-save${FM.SAVE_VERSION}.touchline`;
    const out = path.join(SAVES, name);
    fs.writeFileSync(out, zlib.gzipSync(Buffer.from(FM.Save.pack(FM.S), 'utf8'), { level: 9 }));
    console.log(
      `Added ${path.relative(ROOT, out)} (${(fs.statSync(out).size / 1048576).toFixed(1)} MB): season ${FM.S.year}, day ${FM.S.day}, ${seasons} season${seasons === 1 ? '' : 's'} played`,
    );
    process.exit(0);
  }
  if (args.add) {
    const src = String(args.add).trim();
    if (!fs.existsSync(src)) {
      console.error('No such file: ' + src);
      process.exit(1);
    }
    const dir = 'reports' in args ? REPORTS : SAVES;
    fs.mkdirSync(dir, { recursive: true });
    const t = testFile(src, { days: 0 });
    const name =
      String(args.name || '').replace(/[^\w.-]/g, '') ||
      `${'reports' in args ? 'report' : 'v'}${t.version ?? 'x'}-${path.basename(src).replace(/\.[^.]+$/, '')}`;
    const out = path.join(dir, name.replace(/\.touchline$/, '') + '.touchline');
    fs.copyFileSync(src, out);
    console.log(`Added ${path.relative(ROOT, out)}`);
    process.exit(0);
  }
  const all = list().filter((x) => !args.only || x.file.includes(String(args.only)));
  if (!all.length) {
    console.log(
      "The library is empty: add this version's save with --snapshot (and reports from the dashboard's Reports tab).",
    );
    console.log('· Saves in the library   0   real 1–');
    process.exit(1);
  }
  let good = 0;
  for (const x of all) {
    const r = testFile(x.file, { days: +(args.days || 5) });
    if (r.ok) good++;
    console.log(
      `${r.ok ? '✓' : '✗'} ${r.name} (${x.kind}; format ${r.version ?? '?'} → ${r.current ?? '?'}, ${(r.bytes / 1048576).toFixed(1)} MB${r.played != null ? `, ${r.played} days played` : ''})${
        r.report && r.report.note ? `\n    report: ${String(r.report.note).split('\n')[0].slice(0, 120)}` : ''
      }`,
    );
    for (const p of r.problems) console.log(`    ${p}`);
  }
  console.log(`\n${good}/${all.length} saves open and play on`);
  console.log(`${good === all.length ? '✓' : '✗'} Saves that open and play on   ${good}   real ${all.length}–`);
  console.log(`· Saves in the library   ${all.length}   real 1–`);
  if (good === all.length) console.log('All checks passed');
  process.exit(good === all.length ? 0 : 1);
}
