// Builds the shot table the match engine uses from the Wyscout public soccer-event dataset (Pappalardo and Massucco, 2019,
// CC BY 4.0, https://doi.org/10.6084/m9.figshare.c.4415000): where shots are taken from and how likely each is to be a goal,
// for each kind of chance the engine has (through ball, cross, cut-back, long shot, counter-attack, set piece, penalty).
// Only the table is kept in the game; the events themselves are never copied into the repo.
//
//   node --max-old-space-size=6144 tools/wyscout-shots.mjs --data <folder with events_*.json> [--out data/shot-table.json] [--check]
//
// What it measures (every shot turned to attack the goal at x = 1, y = 0.5 on a 105 x 68 m pitch):
//   model: a small logistic model of the chance a shot scores from its distance, the angle the goal makes, whether it is a
//     header and whether it is a direct free kick (the numbers are in the table, so the engine and the report use the same).
//   types: for each kind of chance, a sample of real shots as [x, y, xG] (y folded to one side), the share of shots and
//     goals, the average xG and the observed goal rate. The engine draws a shot from the sample, so the place it is taken
//     from and its xG stay together, and the spread of xG is the real one (many low chances, a few big ones).
//   report: shots and goals per match, xG against the goals scored (calibration by distance), and the kinds' shares.
//
// How a shot is sorted into a kind (the first that fits): a penalty; a direct free kick; a corner or a crossed free kick just
// before it (set piece); a counter-attack tag; a cross just before it (cross); a through ball (Wyscout's smart pass) just
// before it; a pull-back from the byline (cut-back); otherwise a shot from more than 18 m is a long shot and the rest are
// through balls (the engine's open-play chance).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = {};
{
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    if (!a[i].startsWith('--')) continue;
    args[a[i].slice(2)] = a[i + 1] === undefined || a[i + 1].startsWith('--') ? true : a[++i];
  }
}

export const L = 105,
  Wd = 68,
  POST = 7.32;
const SAMPLE = 100; // shots kept per kind
const BEFORE_S = 10; // seconds: how long before a shot a pass or dead ball still counts as what set it up
const LONG_M = 18; // metres: further out than this, an open-play shot with no other cause is a long shot
const TAGS = { goal: 101, counter: 1101, head: 403 };

// A shot's place in metres from the goal it attacks: x along the pitch, y across (Wyscout gives percentages of the pitch from the
// shooting team's point of view, attacking toward x = 100)
export const geom = (px, py) => {
  const dx = (100 - px) * (L / 100),
    dy = (py - 50) * (Wd / 100);
  const dist = Math.hypot(dx, dy);
  // the angle the goal mouth makes from the shot: 0 on the goal line outside the posts, near 180 degrees in front of it
  const angle = Math.atan2(POST * dx, dx * dx + dy * dy - (POST / 2) ** 2);
  return { dist, angle: angle < 0 ? angle + Math.PI : angle };
};

const has = (e, id) => e.tags.some((t) => t.id === id);
const PERIOD = { '1H': 0, '2H': 1, E1: 2, E2: 3, P: 4 };

// ---------- Sorting the shots ----------
export function classify(e, prev, geo) {
  if (e.subEventName === 'Penalty') return 'penalty';
  if (e.subEventName === 'Free kick shot') return 'fk';
  // the last pass or dead ball of the same team in the seconds before
  const p = prev.find(
    (q) =>
      q.teamId === e.teamId &&
      (q.eventName === 'Pass' || q.eventName === 'Free Kick') &&
      e.eventSec - q.eventSec <= BEFORE_S,
  );
  if (p && (p.subEventName === 'Corner' || p.subEventName === 'Free kick cross')) return 'cor';
  if (has(e, TAGS.counter)) return 'counter';
  if (p && p.subEventName === 'Cross') return 'cross';
  if (p && p.subEventName === 'Smart pass') return 'through';
  if (p && p.eventName === 'Pass' && p.positions && p.positions.length >= 2) {
    const [a, b] = p.positions;
    // a pull-back from the byline: started wide and deep in the opponents' end, ended nearer the middle
    if (a.x >= 83 && Math.abs(a.y - 50) >= 18 && Math.abs(b.y - 50) <= Math.abs(a.y - 50) - 10 && b.x <= a.x)
      return 'cutback';
  }
  return geo.dist > LONG_M ? 'longshot' : 'through';
}

// ---------- The model ----------
// Logistic regression by Newton's method: features f(shot) -> chance of a goal
const solve = (A, b) => {
  const n = b.length,
    M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((r, i) => r[n] / r[i]);
};
export const FEATURES = ['dist', 'dist2', 'angle', 'head', 'fk'];
const feat = (s) => [1, s.dist, (s.dist * s.dist) / 100, s.angle, s.head ? 1 : 0, s.fk ? 1 : 0];
export function fit(shots, iters = 25) {
  const n = 6;
  let w = Array(n).fill(0);
  for (let it = 0; it < iters; it++) {
    const H = Array.from({ length: n }, () => Array(n).fill(0)),
      g = Array(n).fill(0);
    for (const s of shots) {
      const f = feat(s),
        z = f.reduce((a, v, i) => a + v * w[i], 0),
        p = 1 / (1 + Math.exp(-z)),
        y = s.goal ? 1 : 0;
      for (let i = 0; i < n; i++) {
        g[i] += (y - p) * f[i];
        for (let j = 0; j < n; j++) H[i][j] += p * (1 - p) * f[i] * f[j];
      }
    }
    for (let i = 0; i < n; i++) H[i][i] += 1e-6;
    const d = solve(H, g);
    w = w.map((v, i) => v + d[i]);
    if (Math.max(...d.map(Math.abs)) < 1e-7) break;
  }
  return w;
}
export const prob = (w, s) => 1 / (1 + Math.exp(-feat(s).reduce((a, v, i) => a + v * w[i], 0)));

// ---------- Reading the files ----------
export function readShots(file) {
  const ev = JSON.parse(fs.readFileSync(file, 'utf8'));
  const by = new Map();
  for (const e of ev) {
    let a = by.get(e.matchId);
    if (!a) by.set(e.matchId, (a = []));
    a.push(e);
  }
  const shots = [];
  for (const [matchId, list] of by) {
    list.sort((a, b) => (PERIOD[a.matchPeriod] ?? 9) - (PERIOD[b.matchPeriod] ?? 9) || a.eventSec - b.eventSec);
    for (let i = 0; i < list.length; i++) {
      const e = list[i];
      if (e.eventName !== 'Shot' && e.subEventName !== 'Free kick shot' && e.subEventName !== 'Penalty') continue;
      const pos = e.positions && e.positions[0];
      if (!pos) continue;
      // the events just before, nearest first, in the same period
      const prev = [];
      for (let k = i - 1; k >= 0 && prev.length < 6; k--) {
        if (list[k].matchPeriod !== e.matchPeriod || e.eventSec - list[k].eventSec > BEFORE_S) break;
        prev.push(list[k]);
      }
      const g = geom(pos.x, pos.y);
      // (own goals are not shots)
      if (has(e, 102)) continue;
      const kind = classify(e, prev, g);
      shots.push({
        matchId,
        kind,
        x: pos.x / 100,
        y: pos.y / 100,
        ...g,
        head: has(e, TAGS.head),
        fk: kind === 'fk',
        goal: has(e, TAGS.goal),
        onTarget: has(e, 1801),
        blocked: has(e, 2101),
      });
    }
  }
  return { shots, matches: by.size };
}

// ---------- The table ----------
const r3 = (v) => Math.round(v * 1000) / 1000;
export function buildTable(shots, matches, w) {
  const KINDS = ['through', 'cross', 'cutback', 'longshot', 'counter', 'cor', 'fk', 'penalty'];
  const types = {};
  for (const k of KINDS) {
    const ss = shots.filter((s) => s.kind === k);
    if (!ss.length) continue;
    const goalRate = ss.filter((s) => s.goal).length / ss.length,
      mean = k === 'penalty' ? goalRate : ss.reduce((a, s) => a + prob(w, s), 0) / ss.length; // (a penalty is not a function of where it is taken from)
    // a deterministic sample spread through the shots, sorted by xG so the file reads like a distribution
    const step = Math.max(1, ss.length / SAMPLE),
      sample = [];
    for (let i = 0; i < SAMPLE && Math.floor(i * step) < ss.length; i++) {
      const s = ss[Math.floor(i * step)];
      sample.push([r3(s.x), r3(Math.abs(s.y - 0.5) + 0.5), r3(k === 'penalty' ? 0.76 : prob(w, s))]);
    }
    sample.sort((a, b) => a[2] - b[2]);
    types[k] = {
      n: ss.length,
      share: r3(ss.length / shots.length),
      goalRate: r3(goalRate),
      xg: r3(mean),
      sample,
    };
  }
  return {
    source:
      'Derived from the Wyscout public soccer-event dataset (Pappalardo and Massucco, 2019, CC BY 4.0, https://doi.org/10.6084/m9.figshare.c.4415000)',
    built: new Date().toISOString().slice(0, 10),
    matches,
    shots: shots.length,
    goals: shots.filter((s) => s.goal).length,
    model: {
      features: ['1', ...FEATURES],
      coef: w.map((v) => r3(v * 1000) / 1000),
      note: 'z = sum(coef * feature), p = 1/(1+e^-z); dist in metres, dist2 = dist^2/100, angle in radians',
    },
    types,
  };
}

export function report(shots, matches, w, table) {
  const out = [];
  const goals = shots.filter((s) => s.goal).length;
  out.push(
    `${matches} matches, ${shots.length} shots (${(shots.length / matches).toFixed(1)} a match), ${goals} goals (${(goals / matches).toFixed(2)} a match), ${((goals / shots.length) * 100).toFixed(1)}% of shots`,
  );
  const xg = shots.reduce((a, s) => a + (s.kind === 'penalty' ? 0.76 : prob(w, s)), 0);
  out.push(
    `model xG ${(xg / matches).toFixed(2)} a match against ${(goals / matches).toFixed(2)} goals (the model is fitted on goals, so these agree)`,
  );
  out.push('\nKinds of chance (share of shots, goal rate, mean xG, mean distance):');
  for (const [k, t] of Object.entries(table.types)) {
    const ss = shots.filter((s) => s.kind === k);
    out.push(
      `  ${k.padEnd(9)} ${(t.share * 100).toFixed(1).padStart(5)}%  goals ${(t.goalRate * 100).toFixed(1).padStart(5)}%  xG ${t.xg.toFixed(3)}  ${(ss.reduce((a, s) => a + s.dist, 0) / ss.length).toFixed(1)} m  (${t.n})`,
    );
  }
  out.push('\nCalibration by distance (observed goal rate against model):');
  for (const [lo, hi] of [
    [0, 6],
    [6, 9],
    [9, 12],
    [12, 16],
    [16, 20],
    [20, 25],
    [25, 60],
  ]) {
    const ss = shots.filter((s) => s.kind !== 'penalty' && s.dist >= lo && s.dist < hi);
    if (!ss.length) continue;
    out.push(
      `  ${String(lo).padStart(2)}-${String(hi).padEnd(2)} m  ${((ss.filter((s) => s.goal).length / ss.length) * 100).toFixed(1).padStart(5)}% observed  ${((ss.reduce((a, s) => a + prob(w, s), 0) / ss.length) * 100).toFixed(1).padStart(5)}% model  (${ss.length})`,
    );
  }
  const head = shots.filter((s) => s.head && s.kind !== 'penalty'),
    foot = shots.filter((s) => !s.head && s.kind !== 'penalty');
  out.push(
    `\nHeaders ${((head.length / shots.length) * 100).toFixed(1)}% of shots, scoring ${((head.filter((s) => s.goal).length / head.length) * 100).toFixed(1)}%; feet ${((foot.filter((s) => s.goal).length / foot.length) * 100).toFixed(1)}%`,
  );
  out.push(`Model: ${['1', ...FEATURES].map((n, i) => `${n} ${w[i].toFixed(3)}`).join(', ')}`);
  return out.join('\n');
}

async function main() {
  if (!args.data || args.data === true) {
    console.log(
      'usage: node --max-old-space-size=6144 tools/wyscout-shots.mjs --data <folder with events_*.json> [--out file] [--check]',
    );
    process.exit(1);
  }
  const dir = path.resolve(String(args.data));
  const files = fs.readdirSync(dir).filter((f) => /^events_.*\.json$/.test(f));
  if (!files.length) {
    console.error(`No events_*.json files in ${dir}`);
    process.exit(1);
  }
  let shots = [],
    matches = 0;
  for (const f of files) {
    const r = readShots(path.join(dir, f));
    console.log(`  ${f}: ${r.matches} matches, ${r.shots.length} shots`);
    shots = shots.concat(r.shots);
    matches += r.matches;
  }
  const w = fit(shots.filter((s) => s.kind !== 'penalty'));
  const table = buildTable(shots, matches, w);
  console.log(report(shots, matches, w, table));
  if (args.check) return;
  const out = path.resolve(ROOT, String(args.out && args.out !== true ? args.out : 'data/shot-table.json'));
  fs.writeFileSync(out, JSON.stringify(table));
  fs.writeFileSync(
    path.join(ROOT, 'js/shots.js'),
    [
      '// Generated by tools/wyscout-shots.mjs (npm run shots) from the Wyscout public soccer-event dataset, CC BY 4.0, https://doi.org/10.6084/m9.figshare.c.4415000',
      '// Where shots are taken from and how likely each is to score, for each kind of chance (read by Match.chance in js/engine.js).',
      '(function () {',
      `  window.FM.D.SHOTS = ${JSON.stringify(table)};`,
      '})();',
      '',
    ].join('\n'),
  );
  console.log(`\nWrote ${path.relative(ROOT, out)} and js/shots.js (${(fs.statSync(out).size / 1024).toFixed(1)} KB)`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
