// Builds the movement table the match view uses from the Metrica Sports sample data (three games of optical tracking at 25 frames a
// second with synchronised events, https://github.com/metrica-sports/sample-data; the README asks to be responsible with the data and to
// acknowledge the source of anything public). Only the table is kept in the game; the tracking is never copied into the repo.
//
//   node tools/metrica-movement.mjs --data <sample-data/data folder> [--out data/movement-table.json] [--check]
//
//   speed:   how fast outfield players and goalkeepers move: the share of time in each band (walking, jogging, running, high-speed
//            running, sprinting), the percentiles of their speed, and how far an outfield player runs a game.
//   accel:   the fastest a player speeds up and slows down at each speed (the 99th percentile of tangential acceleration in 1 m/s
//            bands): quick from a standstill, hardly any at full pace; and the time to reach 5 and 7 m/s from rest that follows.
//   sprints: how many sprints (over 7 m/s for half a second) an outfield player makes a game and how long they last.
//   ball:    how fast the ball travels over a pass, by the length of the pass (metres a second), and in a shot; and how fast a player
//            runs with the ball (carries, from the game that records them).
// Positions are 0-1 across a 105 x 68 m pitch; players off the pitch are NaN. The goalkeepers are the players whose average
// position is nearest an end line.
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
  HZ = 25,
  DT = 1 / HZ;
export const BANDS = [
  ['walk', 0, 2],
  ['jog', 2, 4],
  ['run', 4, 5.5],
  ['fast', 5.5, 7],
  ['sprint', 7, 99],
];
const MAX_SPEED = 12; // m/s: readings above this are tracking glitches
const SMOOTH = 3; // frames each side the positions are averaged over (0.28 s)
const MIN_ACC = 50000; // readings a speed band needs for its acceleration to be trusted (the fastest bands have a few hundred glitches)
const SPRINT = 7,
  SPRINT_MIN = 0.5; // m/s and seconds

// ---------- Reading the tracking ----------
// returns { players: [ { xs: Float32Array (metres, NaN off), ys }, ... ], periods: [[from, to], ...] } in frames from 0
function readCsv(home, away) {
  const parse = (file) => {
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean);
    const names = lines[2].split(','); // Period,Frame,Time [s],Player11,,Player1,,...,Ball,
    const n = lines.length - 3;
    const cols = [];
    for (let c = 3; c < names.length - 2; c += 2) if (/^Player/.test(names[c])) cols.push(c);
    const players = cols.map(() => ({ xs: new Float32Array(n).fill(NaN), ys: new Float32Array(n).fill(NaN) }));
    const period = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      const f = lines[i + 3].split(',');
      period[i] = +f[0];
      cols.forEach((c, k) => {
        const x = parseFloat(f[c]),
          y = parseFloat(f[c + 1]);
        if (!Number.isNaN(x) && !Number.isNaN(y)) {
          players[k].xs[i] = x * L;
          players[k].ys[i] = y * Wd;
        }
      });
    }
    return { players, period, n };
  };
  const h = parse(home),
    a = parse(away);
  const n = Math.min(h.n, a.n);
  return {
    players: [...h.players, ...a.players].map((p) => ({ xs: p.xs.subarray(0, n), ys: p.ys.subarray(0, n) })),
    period: h.period.subarray(0, n),
    n,
  };
}
function readEpts(dir, base) {
  const text = fs
    .readFileSync(path.join(dir, `${base}_tracking.txt`), 'utf8')
    .split(/\r?\n/)
    .filter(Boolean);
  const meta = fs.readFileSync(path.join(dir, `${base}_metadata.xml`), 'utf8');
  const val = (name) => {
    const m = meta.match(new RegExp(`<Name>${name}</Name>\\s*<Value>(\\d*)</Value>`));
    return m && m[1] ? +m[1] : null;
  };
  const h1 = [val('first_half_start'), val('first_half_end')],
    h2 = [val('second_half_start'), val('second_half_end')];
  const first = +text[0].split(':')[0];
  const n = text.length;
  const nPl = text[0].split(':')[1].split(';').length;
  const players = Array.from({ length: nPl }, () => ({
    xs: new Float32Array(n).fill(NaN),
    ys: new Float32Array(n).fill(NaN),
  }));
  const period = new Uint8Array(n);
  text.forEach((ln, i) => {
    const [fr, pl] = ln.split(':');
    const frame = +fr;
    period[i] = frame >= h1[0] && frame <= h1[1] ? 1 : frame >= h2[0] && frame <= h2[1] ? 2 : 0;
    pl.split(';').forEach((p, k) => {
      const [x, y] = p.split(',').map(parseFloat);
      if (players[k] && !Number.isNaN(x) && !Number.isNaN(y)) {
        players[k].xs[i] = x * L;
        players[k].ys[i] = y * Wd;
      }
    });
  });
  void first;
  return { players, period, n };
}

// ---------- Speed and acceleration of one player ----------
const smooth = (a, lo, hi) => {
  const out = new Float32Array(a.length).fill(NaN);
  for (let i = lo; i < hi; i++) {
    let s = 0,
      c = 0;
    for (let k = -SMOOTH; k <= SMOOTH; k++) {
      const v = a[i + k];
      if (v === v && i + k >= lo && i + k < hi) ((s += v), c++);
    }
    if (c === 2 * SMOOTH + 1) out[i] = s / c;
  }
  return out;
};
export function kinematics(p, period) {
  const n = p.xs.length,
    speed = new Float32Array(n).fill(NaN),
    acc = new Float32Array(n).fill(NaN);
  // each period on its own (a half never runs into the next)
  for (const per of [1, 2]) {
    let lo = period.indexOf(per);
    if (lo < 0) continue;
    let hi = lo;
    while (hi < n && period[hi] === per) hi++;
    const sx = smooth(p.xs, lo, hi),
      sy = smooth(p.ys, lo, hi);
    for (let i = lo + 1; i < hi - 1; i++) {
      const dx = sx[i + 1] - sx[i - 1],
        dy = sy[i + 1] - sy[i - 1];
      if (dx === dx && dy === dy) {
        const v = Math.hypot(dx, dy) / (2 * DT);
        if (v <= MAX_SPEED) speed[i] = v;
      }
    }
    const K = 5; // acceleration over +-0.2 s
    for (let i = lo + K; i < hi - K; i++) {
      const a = speed[i + K],
        b = speed[i - K];
      if (a === a && b === b) acc[i] = (a - b) / (2 * K * DT);
    }
  }
  return { speed, acc };
}

const pct = (sorted, q) =>
  sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(q * (sorted.length - 1)))] : null;
const r2 = (v) => Math.round(v * 100) / 100;

// ---------- The table ----------
export function analyse(games) {
  const speeds = { out: [], gk: [] },
    bandTime = { out: BANDS.map(() => 0), gk: BANDS.map(() => 0) },
    accBins = Array.from({ length: 11 }, () => ({ up: [], down: [] })),
    perGame = []; // distance per outfield player per 90 (for a check)
  let sprints = 0,
    sprintFrames = 0,
    sprintDist = 0,
    outfieldMinutes = 0;
  for (const g of games) {
    for (const p of g.players) {
      const mean = (() => {
        let s = 0,
          c = 0;
        for (let i = 0; i < p.xs.length; i += 25) if (p.xs[i] === p.xs[i]) ((s += Math.abs(p.xs[i] - L / 2)), c++);
        return c ? s / c : 0;
      })();
      const frames = p.xs.reduce((a, v) => a + (v === v ? 1 : 0), 0);
      if (frames < 25 * 60 * 20) continue; // under twenty minutes on the pitch: not a full set of numbers
      const gk = mean > 40; // average position within 12 m of an end line
      const { speed, acc } = kinematics(p, g.period);
      const key = gk ? 'gk' : 'out';
      let dist = 0,
        run = 0,
        runDist = 0,
        valid = 0;
      for (let i = 0; i < speed.length; i++) {
        const v = speed[i];
        if (v !== v) {
          run = 0;
          continue;
        }
        valid++;
        speeds[key].push(v);
        BANDS.forEach(([, lo, hi], b) => {
          if (v >= lo && v < hi) bandTime[key][b] += DT;
        });
        dist += v * DT;
        if (!gk) {
          if (v > SPRINT) {
            run++;
            runDist += v * DT;
          } else {
            if (run >= SPRINT_MIN * HZ) (sprints++, (sprintFrames += run), (sprintDist += runDist));
            run = 0;
            runDist = 0;
          }
          const a = acc[i];
          if (a === a && Math.abs(a) < 8) {
            const bi = Math.min(10, Math.floor(v));
            (a >= 0 ? accBins[bi].up : accBins[bi].down).push(a);
          }
        }
      }
      if (!gk) {
        outfieldMinutes += (valid * DT) / 60;
        perGame.push((dist / 1000) * ((90 * 60) / (valid * DT)));
      }
    }
  }
  const sum = (a) => a.reduce((x, y) => x + y, 0);
  const share = (t) => t.map((v) => r2(v / sum(t)));
  const sp = {};
  for (const k of ['out', 'gk']) {
    speeds[k].sort((a, b) => a - b);
    sp[k] = {
      p50: r2(pct(speeds[k], 0.5)),
      p90: r2(pct(speeds[k], 0.9)),
      p99: r2(pct(speeds[k], 0.99)),
      p999: r2(pct(speeds[k], 0.999)),
      max: r2(speeds[k][speeds[k].length - 1]),
      bands: share(bandTime[k]),
    };
  }
  // the quickest a player speeds up (99th percentile) and slows down (1st) at each speed, in 1 m/s bands
  const accel = accBins.map((b, i) => {
    b.up.sort((x, y) => x - y);
    b.down.sort((x, y) => x - y);
    return {
      v: i,
      up: b.up.length > MIN_ACC ? r2(pct(b.up, 0.99)) : null,
      down: b.down.length > MIN_ACC ? r2(pct(b.down, 0.01)) : null,
      n: b.up.length + b.down.length,
    };
  });
  // time to reach a speed from rest if a player always accelerates as fast as the 99th percentile allows
  const tReach = (target) => {
    let v = 0,
      t = 0;
    while (v < target && t < 30) {
      // (past the last speed band with enough readings the limit tapers to nothing over three metres a second)
      const bi = Math.min(10, Math.floor(v)),
        last = accel.filter((x) => x.up != null).pop(),
        a = accel[bi].up ?? Math.max(0, last.up * (1 - (v - last.v - 1) / 3));
      if (a <= 0.05) return null;
      v += a * 0.02;
      t += 0.02;
    }
    return r2(t);
  };
  perGame.sort((a, b) => a - b);
  return {
    speed: sp,
    accel,
    timeToReach: { 5: tReach(5), 7: tReach(7) },
    sprints: {
      perPlayer90: r2((sprints / outfieldMinutes) * 90),
      meanSeconds: r2(sprintFrames / HZ / Math.max(1, sprints)),
      meanMetres: r2(sprintDist / Math.max(1, sprints)),
    },
    distanceKm: {
      median: r2(pct(perGame, 0.5)),
      p10: r2(pct(perGame, 0.1)),
      p90: r2(pct(perGame, 0.9)),
      players: perGame.length,
    },
  };
}

// ---------- The ball (from the events) ----------
const BINS = [
  [0, 10],
  [10, 20],
  [20, 35],
  [35, 120],
];
export function ballFromEvents(rows) {
  // rows: { type, subtype, t0, t1, x0, y0, x1, y1 } (metres, seconds)
  const out = { pass: BINS.map(() => []), cross: [], shot: [], head: [], goalKick: [], carry: [] };
  for (const r of rows) {
    if (r.x0 == null || r.x1 == null || r.t1 <= r.t0) continue;
    const d = Math.hypot(r.x1 - r.x0, r.y1 - r.y0),
      s = d / (r.t1 - r.t0);
    if (d < 2 || r.t1 - r.t0 < 0.15 || r.t1 - r.t0 > 8 || s > 40) continue;
    if (r.type === 'PASS') {
      if (r.subtype === 'CROSS') out.cross.push(s);
      else if (r.subtype === 'HEAD') out.head.push(s);
      else if (r.subtype === 'GOAL KICK') out.goalKick.push(s);
      else out.pass[BINS.findIndex(([lo, hi]) => d >= lo && d < hi)].push(s);
    } else if (r.type === 'SHOT') out.shot.push(s);
    else if (r.type === 'CARRY' && s < 12) out.carry.push(s);
  }
  const stat = (a) =>
    a.length >= 10
      ? (a.sort((x, y) => x - y),
        {
          n: a.length,
          mean: r2(a.reduce((x, y) => x + y, 0) / a.length),
          p10: r2(pct(a, 0.1)),
          p50: r2(pct(a, 0.5)),
          p90: r2(pct(a, 0.9)),
        })
      : null;
  return {
    pass: BINS.map(([lo, hi], i) => ({ from: lo, to: hi, ...stat(out.pass[i]) })),
    cross: stat(out.cross),
    head: stat(out.head),
    goalKick: stat(out.goalKick),
    shot: stat(out.shot),
    carry: stat(out.carry),
  };
}
function eventsCsv(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean);
  const h = lines[0].split(','),
    ix = (n) => h.indexOf(n);
  return lines.slice(1).map((ln) => {
    const f = ln.split(','),
      n = (k) => (f[ix(k)] === 'NaN' || f[ix(k)] === '' ? null : +f[ix(k)]);
    return {
      type: f[ix('Type')],
      subtype: f[ix('Subtype')],
      t0: n('Start Time [s]'),
      t1: n('End Time [s]'),
      x0: n('Start X') == null ? null : n('Start X') * L,
      y0: n('Start Y') == null ? null : n('Start Y') * Wd,
      x1: n('End X') == null ? null : n('End X') * L,
      y1: n('End Y') == null ? null : n('End Y') * Wd,
    };
  });
}
function eventsJson(file) {
  const d = JSON.parse(fs.readFileSync(file, 'utf8')).data;
  return d.map((e) => ({
    type: e.type.name,
    subtype:
      e.subtypes && !Array.isArray(e.subtypes)
        ? e.subtypes.name
        : Array.isArray(e.subtypes) && e.subtypes[0]
          ? e.subtypes[0].name
          : '',
    t0: e.start.time,
    t1: e.end.time,
    x0: e.start.x == null ? null : e.start.x * L,
    y0: e.start.y == null ? null : e.start.y * Wd,
    x1: e.end.x == null ? null : e.end.x * L,
    y1: e.end.y == null ? null : e.end.y * Wd,
  }));
}

export function report(t) {
  const out = [`${t.games} games, ${t.playerGames} player-games on the pitch`];
  for (const k of ['out', 'gk']) {
    const s = t.speed[k];
    out.push(
      `${k === 'out' ? 'Outfield' : 'Goalkeepers'}: speed p50 ${s.p50}, p90 ${s.p90}, p99 ${s.p99}, p99.9 ${s.p999}, max ${s.max} m/s; time ${BANDS.map(([n], i) => `${n} ${(s.bands[i] * 100).toFixed(0)}%`).join(', ')}`,
    );
  }
  out.push(
    `Outfield player runs ${t.distanceKm.median} km a game (10th-90th percentile ${t.distanceKm.p10}-${t.distanceKm.p90}); ${t.sprints.perPlayer90} sprints a game of ${t.sprints.meanSeconds} s (${t.sprints.meanMetres} m)`,
  );
  out.push('Fastest acceleration / deceleration by speed (m/s squared):');
  for (const a of t.accel)
    out.push(
      `  ${String(a.v).padStart(2)}-${a.v + 1} m/s  ${a.up == null ? '  - ' : a.up.toFixed(2).padStart(5)}  ${a.down == null ? '  - ' : a.down.toFixed(2).padStart(6)}  (${a.n})`,
    );
  out.push(`From rest to 5 m/s: ${t.timeToReach[5]} s; to 7 m/s: ${t.timeToReach[7]} s`);
  out.push('Ball speed over a pass by length (m/s: mean, 10th-90th percentile):');
  for (const b of t.ball.pass)
    out.push(
      `  ${String(b.from).padStart(2)}-${String(b.to).padEnd(3)} m  ${b.mean == null ? '-' : `${b.mean} (${b.p10}-${b.p90}) n=${b.n}`}`,
    );
  for (const k of ['cross', 'head', 'goalKick', 'shot', 'carry'])
    if (t.ball[k]) out.push(`  ${k.padEnd(8)} ${t.ball[k].mean} (${t.ball[k].p10}-${t.ball[k].p90}) n=${t.ball[k].n}`);
  return out.join('\n');
}

async function main() {
  if (!args.data || args.data === true) {
    console.log('usage: node tools/metrica-movement.mjs --data <sample-data/data folder> [--out file] [--check]');
    process.exit(1);
  }
  const dir = path.resolve(String(args.data));
  const games = [],
    rows = [];
  for (const g of [1, 2]) {
    const d = path.join(dir, `Sample_Game_${g}`);
    if (!fs.existsSync(d)) continue;
    games.push(
      readCsv(
        path.join(d, `Sample_Game_${g}_RawTrackingData_Home_Team.csv`),
        path.join(d, `Sample_Game_${g}_RawTrackingData_Away_Team.csv`),
      ),
    );
    rows.push(...eventsCsv(path.join(d, `Sample_Game_${g}_RawEventsData.csv`)));
    console.log(`  game ${g}: ${games[games.length - 1].n} frames`);
  }
  const d3 = path.join(dir, 'Sample_Game_3');
  if (fs.existsSync(d3)) {
    games.push(readEpts(d3, 'Sample_Game_3'));
    rows.push(...eventsJson(path.join(d3, 'Sample_Game_3_events.json')));
    console.log(`  game 3: ${games[games.length - 1].n} frames`);
  }
  if (!games.length) {
    console.error('No games found: --data is the sample-data/data folder');
    process.exit(1);
  }
  const a = analyse(games);
  const table = {
    source:
      'Derived from the Metrica Sports sample data (https://github.com/metrica-sports/sample-data): optical tracking at 25 frames a second',
    built: new Date().toISOString().slice(0, 10),
    games: games.length,
    playerGames: a.distanceKm.players,
    ...a,
    ball: ballFromEvents(rows),
  };
  console.log(report(table));
  if (args.check) return;
  const out = path.resolve(ROOT, String(args.out && args.out !== true ? args.out : 'data/movement-table.json'));
  fs.writeFileSync(out, JSON.stringify(table));
  fs.writeFileSync(
    path.join(ROOT, 'js/movement.js'),
    [
      '// Generated by tools/metrica-movement.mjs (npm run movement) from the Metrica Sports sample data (https://github.com/metrica-sports/sample-data)',
      '// How fast players run and speed up, and how fast the ball travels over a pass (read by the match view in js/matchmotion.js).',
      '(function () {',
      `  window.FM.D.MOVE = ${JSON.stringify(table)};`,
      '})();',
      '',
    ].join('\n'),
  );
  console.log(
    `\nWrote ${path.relative(ROOT, out)} and js/movement.js (${(fs.statSync(out).size / 1024).toFixed(1)} KB)`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
