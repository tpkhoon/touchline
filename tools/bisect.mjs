// Finds the change that caused a problem. When a job fails or a measure in the comparison view gets worse, this tests the commits
// between the last good one and the bad one (the way `git bisect` does, by halving) and names the first commit where it
// changed. The job is one the dashboard already runs (tools/jobs.mjs), run on each commit in a separate checkout under
// .devtools/bisect/, so your working folder is never touched.
//   node tools/bisect.mjs --job suite --good <commit> [--bad HEAD] [--measure "Goals per match"] [--delta 15] [--set seasons=1 --set seed=11]
// What counts as bad:
//   without --measure   the job fails (exit code not 0)
//   with --measure      the job fails, or that measure is out of its range, or it has moved from the good commit's value by more
//                       than --delta percent of its range's width (of its value, when it has no range)
// Exit 0 with the commit named; exit 2 when there is no change between the two ends; exit 1 on a mistake (the good end is bad).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync, spawn } from 'node:child_process';
import { ROOT } from './harness.mjs';
import { JOBS } from './jobs.mjs';

// (argv read as it was given: names with spaces stay whole)
const argv = process.argv.slice(2);
const opt = (name, def) => {
  const i = argv.indexOf('--' + name);
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : def;
};
const many = (name) => argv.flatMap((a, i) => (a === '--' + name && argv[i + 1] ? [argv[i + 1]] : []));
const jobId = opt('job');
const job = JOBS[jobId];
if (!job || job.hidden) {
  console.error(
    `Unknown job "${jobId}". Jobs: ${Object.keys(JOBS)
      .filter((j) => !JOBS[j].hidden)
      .join(', ')}`,
  );
  process.exit(1);
}
const git = (args, cwd = ROOT) => {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 1 << 26 });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${(r.stderr || '').trim()}`);
  return r.stdout.trim();
};
const sha = (rev) => {
  if (!/^[\w./~^-]{1,80}$/.test(String(rev))) throw new Error(`Not a commit: ${rev}`);
  return git(['rev-parse', '--verify', rev + '^{commit}']);
};
const good = sha(opt('good', ''));
const bad = sha(opt('bad', 'HEAD'));
const measure = opt('measure', '');
const delta = +opt('delta', 15) / 100;
const settings = Object.fromEntries(many('set').map((kv) => kv.split('=')));

// The commits after the good one up to the bad one, oldest first
const between = git(['rev-list', '--reverse', '--first-parent', `${good}..${bad}`])
  .split('\n')
  .filter(Boolean);
if (!between.length) {
  console.error('There are no commits between those two.');
  process.exit(1);
}
console.log(
  `${between.length} commit${between.length === 1 ? '' : 's'} between ${good.slice(0, 7)} (good) and ${bad.slice(0, 7)} (bad); about ${Math.ceil(Math.log2(between.length + 1)) + 2} runs of ${job.label}.`,
);

// ---------- A separate checkout ----------
const WT = path.join(ROOT, '.devtools', 'bisect', 'wt');
const cleanup = () => {
  try {
    spawnSync('git', ['worktree', 'remove', '--force', WT], { cwd: ROOT });
    spawnSync('git', ['worktree', 'prune'], { cwd: ROOT });
  } catch (e) {
    /* nothing to remove */
  }
};
cleanup();
fs.mkdirSync(path.dirname(WT), { recursive: true });
git(['worktree', 'add', '--detach', '--force', WT, good]);
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => (cleanup(), process.exit(130)));
// (the checkout shares the installed packages and the dashboard's saved files)
const link = (name) => {
  const to = path.join(WT, name);
  if (!fs.existsSync(to) && fs.existsSync(path.join(ROOT, name))) fs.symlinkSync(path.join(ROOT, name), to, 'junction');
};
link('node_modules');

const METRIC = /^([✓✗·])\s+(.+?)\s{2,}(-?\d[\d.,]*|—)\s+real\s+(.+)$/;
const num = (v) => parseFloat(String(v).replace(/,/g, ''));
const parseRange = (r) => {
  const m = String(r).match(/^(-?[\d.]+)\s*[–-]\s*(-?[\d.]*)\s*$/);
  return m ? [parseFloat(m[1]), m[2] === '' ? Infinity : parseFloat(m[2])] : null;
};
function runJob() {
  const a = [];
  for (const [k, p] of Object.entries(job.params)) a.push('--' + k, String(settings[k] ?? p.default));
  return new Promise((resolve) => {
    const p = spawn(job.cmd[0], [...job.cmd.slice(1), ...a], { cwd: WT, env: { ...process.env, FORCE_COLOR: '0' } });
    let out = '';
    p.stdout.on('data', (d) => (out += d));
    p.stderr.on('data', (d) => (out += d));
    p.on('close', (code) => resolve({ code, out }));
  });
}
const metricOf = (out) => {
  if (!measure) return null;
  for (const line of out.split('\n')) {
    const m = line.match(METRIC);
    if (m && m[2].trim() === measure)
      return { ok: m[1] === '✓' ? true : m[1] === '✗' ? false : null, value: num(m[3]), range: parseRange(m[4]) };
  }
  return null;
};
const subject = (c) => git(['log', '-1', '--format=%h %s (%an, %ad)', '--date=short', c]);
let reference = null; // the good commit's measure
const cache = new Map();
async function isBad(c) {
  if (cache.has(c)) return cache.get(c);
  git(['checkout', '--detach', '--force', c], WT);
  link('node_modules');
  process.stdout.write(`  testing ${subject(c).slice(0, 100)} … `);
  const t = Date.now();
  const r = await runJob();
  const m = metricOf(r.out);
  let verdict = r.code !== 0;
  let why = r.code !== 0 ? `the job failed (exit ${r.code})` : 'passes';
  if (measure) {
    if (!m) {
      verdict = verdict || false;
      why += `; measure "${measure}" not in the output`;
    } else {
      const width =
        m.range && Number.isFinite(m.range[1])
          ? m.range[1] - m.range[0]
          : Math.abs(reference ? reference.value : m.value) * 0.5;
      if (m.ok === false) {
        verdict = true;
        why = `${measure} is out of range: ${m.value}`;
      } else if (reference && width > 0 && Math.abs(m.value - reference.value) > delta * width) {
        verdict = true;
        why = `${measure} moved: ${reference.value} → ${m.value}`;
      } else if (!verdict) why = `${measure} ${m.value}`;
    }
  }
  console.log(`${verdict ? 'BAD' : 'good'} (${why}, ${Math.round((Date.now() - t) / 1000)} s)`);
  const res = { bad: verdict, why, m };
  cache.set(c, res);
  return res;
}

try {
  // the ends first: a search between two ends that agree finds nothing
  console.log('The good end:');
  const g = await isBad(good);
  reference = g.m;
  if (g.bad) {
    console.log(`\nThe commit marked good is already bad (${g.why}): pick an earlier one.`);
    process.exitCode = 1;
  } else {
    console.log('The bad end:');
    const b = await isBad(bad);
    if (!b.bad) {
      console.log(`\nNo change: the bad end is not bad any more (${b.why}). Nothing to find.`);
      process.exitCode = 2;
    } else {
      let lo = 0,
        hi = between.length - 1; // between[hi] is bad; everything before between[lo] is good
      console.log('Halving:');
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if ((await isBad(between[mid])).bad) hi = mid;
        else lo = mid + 1;
      }
      const first = between[lo];
      const why = cache.get(first).why;
      console.log(`\nFIRST BAD COMMIT: ${subject(first)}`);
      console.log(`  ${why}`);
      console.log(git(['show', '--stat', '--format=', first]).split('\n').slice(-12).join('\n'));
    }
  }
} finally {
  cleanup();
}
