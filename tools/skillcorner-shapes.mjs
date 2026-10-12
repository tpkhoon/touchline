// Builds the shape table the visual match engine will use for player positioning, from SkillCorner Open Data (tracking at
// 10 frames a second; MIT licence, https://github.com/SkillCorner/opendata). It reads the tracking of the matches you name,
// works out where each position stands for each position of the ball, with and without the ball, and writes a small JSON
// table. Only that table is kept in the game; the tracking data itself is never copied into the repo.
//
//   node tools/skillcorner-shapes.mjs --data <path to opendata/data> [--matches 2017461,2015213] [--step 5] [--out data/shape-table.json]
//
// --data     the `data` folder of a clone of the SkillCorner repo (it holds matches.json and matches/<id>/...)
// --matches  match ids (default: every match in matches.json that has tracking files)
// --step     use every Nth frame (default 5: two frames a second, plenty for averages and fast to read)
// --out      the table to write (default data/shape-table.json)
// --detected use only players the broadcast camera saw in that frame (default: all 22, off-camera ones extrapolated by SkillCorner).
//            The camera follows the ball, so seen players cluster round it and the shape comes out too compact; use this to compare.
// --check    print the table's summary without writing it
//
// What it measures, with every team turned to attack left to right (x 0 = own goal line, 1 = the goal it attacks; y 0..1
// across the pitch) and the ball in the same frame:
//   offsets: for each position (GK CB FB WB DM CM WM AM W ST), with the ball (in) and without it (out), and for each cell of
//     a grid of ball positions (8 along the pitch by 6 across), how far the position's players stand from where they stand on
//     average in that state: dx forward, dy sideways. Cells with few frames are blended toward a plane fitted to the
//     position's other cells, so the table is smooth where the data is thin.
//   home: each position's average place in each state (the base the offsets sit on).
//   shape: how the whole team stands: the depth and width of the outfield players, the heights of the back, midfield and front
//     lines and the gaps between them, in each state and for the ball in each third of the pitch.
//
// Sideways convention: y is mirrored so that a wide player's own wing (his average y is more than 0.12 from the middle) is always
// the high side, and for a central player the ball's side is. The ball's y is in the same mirrored frame (above .5: the ball is
// on that side), so dy positive means toward his own wing, or toward the ball.
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---------- Arguments ----------
const args = {};
{
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    if (!a[i].startsWith('--')) continue;
    const k = a[i].slice(2);
    args[k] = a[i + 1] === undefined || a[i + 1].startsWith('--') ? true : a[++i];
  }
}

// ---------- The table's shape ----------
export const POS = ['GK', 'CB', 'FB', 'WB', 'DM', 'CM', 'WM', 'AM', 'W', 'ST'];
export const GRID = { nx: 8, ny: 6 };
const WIDE = 0.12; // how far from the middle (of the pitch's width) a player's average y must be to count as a wide player
const SHRINK = 150; // frames of weight a cell's own average is given against the plane fitted to the position's cells
const MIN_SHAPE_PLAYERS = 9; // outfield players seen in a frame for it to count towards the team shape

// SkillCorner's position acronyms (player_role.acronym) → the game's positions. Left and right variants are the same position.
const ROLE = {
  GK: 'GK',
  CB: 'CB',
  LCB: 'CB',
  RCB: 'CB',
  LB: 'FB',
  RB: 'FB',
  LWB: 'WB',
  RWB: 'WB',
  DM: 'DM',
  LDM: 'DM',
  RDM: 'DM',
  CM: 'CM',
  LCM: 'CM',
  RCM: 'CM',
  LM: 'WM',
  RM: 'WM',
  AM: 'AM',
  LAM: 'AM',
  RAM: 'AM',
  SS: 'AM',
  LW: 'W',
  RW: 'W',
  LF: 'ST',
  RF: 'ST',
  CF: 'ST',
  ST: 'ST',
};
// (the position group names, when an acronym is one this table does not know)
const GROUP = {
  Goalkeeper: 'GK',
  'Central Defender': 'CB',
  'Full Back': 'FB',
  Midfield: 'CM',
  'Wide Attacker': 'W',
  Center_Forward: 'ST',
  'Center Forward': 'ST',
};
export const gamePos = (role) => (!role ? null : ROLE[role.acronym] || GROUP[role.position_group] || null);
const LINE = {
  CB: 'back',
  FB: 'back',
  WB: 'back',
  DM: 'mid',
  CM: 'mid',
  WM: 'mid',
  AM: 'mid',
  W: 'front',
  ST: 'front',
};

// ---------- Reading a match ----------
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
// Which way the team attacks in a period (+1: toward +x): the home side's entry for the period says where it attacks from
const dirOf = (match, period, isHome) => {
  const side = (match.home_team_side || [])[period - 1] || 'left_to_right';
  const homeDir = side === 'left_to_right' ? 1 : -1;
  return isHome ? homeDir : -homeDir;
};

// A tiny accumulator: count and sums
const acc = () => ({ n: 0, x: 0, y: 0 });
const add = (a, x, y) => {
  a.n++;
  a.x += x;
  a.y += y;
};

export async function readMatch(dir, id, step, tables) {
  const mj = path.join(dir, 'matches', String(id), `${id}_match.json`),
    tj = path.join(dir, 'matches', String(id), `${id}_tracking_extrapolated.jsonl`);
  if (!fs.existsSync(mj) || !fs.existsSync(tj)) return null;
  const match = JSON.parse(fs.readFileSync(mj, 'utf8'));
  const L = num(match.pitch_length) || 105,
    Wd = num(match.pitch_width) || 68;
  const homeId = match.home_team && match.home_team.id;
  // players by the ids tracking may use (his id, or the id of his trackable object)
  const byId = new Map();
  for (const p of match.players || []) {
    const pos = gamePos(p.player_role);
    // the frames he was on the pitch (a substitute who never played, or one off the pitch, is not part of the shape)
    const pt = p.playing_time ? p.playing_time.total : undefined; // (null: never on the pitch; none given: no limit)
    const rec = {
      pos,
      home: p.team_id === homeId,
      unknown: p.player_role ? p.player_role.acronym : null,
      from: pt === undefined ? -1 : pt ? pt.start_frame : null,
      to: pt ? pt.end_frame : null,
    };
    byId.set(p.id, rec);
    if (p.trackable_object != null) byId.set(p.trackable_object, rec);
  }
  // pass 1 is the sampled frames, kept in memory as small arrays so a player's average wing can be found before binning
  const frames = [];
  const sumY = new Map(); // player record → { n, y } of his normalised y
  const stats = { lines: 0, used: 0, noBall: 0, noPoss: 0, unmatched: 0, unmapped: new Set() };
  const rl = readline.createInterface({ input: fs.createReadStream(tj), crlfDelay: Infinity });
  let k = -1;
  for await (const line of rl) {
    if (!line) continue;
    k++;
    stats.lines++;
    if (k % step) continue;
    let f;
    try {
      f = JSON.parse(line);
    } catch (e) {
      continue;
    }
    const period = f.period;
    if (period !== 1 && period !== 2) continue;
    const ball = f.ball_data,
      bx = ball && num(ball.x),
      by = ball && num(ball.y);
    if (bx === null || by === null) {
      stats.noBall++;
      continue;
    }
    const poss = f.possession && f.possession.group ? String(f.possession.group).toLowerCase() : '';
    const homeHas = poss.includes('home') ? true : poss.includes('away') ? false : null;
    if (homeHas === null) {
      stats.noPoss++;
      continue;
    }
    const teams = [
      { home: true, pl: [] },
      { home: false, pl: [] },
    ];
    for (const p of f.player_data || []) {
      if (p.is_detected === false && args.detected) continue; // (extrapolated positions are SkillCorner's estimate of players off camera)
      const x = num(p.x),
        y = num(p.y);
      if (x === null || y === null) continue;
      const rec = byId.get(p.player_id);
      if (rec && (rec.from === null || f.frame < rec.from || (rec.to !== null && f.frame > rec.to))) continue;
      if (!rec) {
        stats.unmatched++;
        continue;
      }
      if (!rec.pos) {
        if (rec.unknown) stats.unmapped.add(rec.unknown);
        continue;
      }
      teams[rec.home ? 0 : 1].pl.push({ rec, x, y });
    }
    for (const t of teams) {
      const dir = dirOf(match, period, t.home);
      const T = {
        inPoss: t.home === homeHas,
        ball: { x: 0.5 + (bx * dir) / L, y: 0.5 + (by * dir) / Wd },
        pl: t.pl.map((p) => ({ rec: p.rec, x: 0.5 + (p.x * dir) / L, y: 0.5 + (p.y * dir) / Wd })),
      };
      for (const p of T.pl) {
        const s = sumY.get(p.rec) || { n: 0, y: 0 };
        s.n++;
        s.y += p.y;
        sumY.set(p.rec, s);
      }
      frames.push(T);
    }
    stats.used++;
  }
  // pass 2: each player's wing, then the bins
  for (const T of frames) {
    const st = T.inPoss ? 'in' : 'out';
    const bThird = T.ball.x < 1 / 3 ? 0 : T.ball.x < 2 / 3 ? 1 : 2;
    const bcx = Math.min(GRID.nx - 1, Math.max(0, Math.floor(T.ball.x * GRID.nx)));
    for (const p of T.pl) {
      const s = sumY.get(p.rec),
        mean = s.y / s.n;
      const w = Math.abs(mean - 0.5) > WIDE ? Math.sign(mean - 0.5) : T.ball.y >= 0.5 ? 1 : -1;
      const ym = 0.5 + w * (p.y - 0.5),
        bym = 0.5 + w * (T.ball.y - 0.5);
      const bcy = Math.min(GRID.ny - 1, Math.max(0, Math.floor(bym * GRID.ny)));
      const key = `${st}|${p.rec.pos}`;
      const tb = tables.pos[key] || (tables.pos[key] = { all: acc(), cell: {} });
      add(tb.all, p.x, ym);
      add((tb.cell[`${bcx},${bcy}`] = tb.cell[`${bcx},${bcy}`] || acc()), p.x, ym);
    }
    // team shape: outfield players only
    const out = T.pl.filter((p) => p.rec.pos !== 'GK');
    if (out.length >= MIN_SHAPE_PLAYERS) {
      const xs = out.map((p) => p.x),
        ys = out.map((p) => p.y),
        line = (name) => {
          const l = out.filter((p) => LINE[p.rec.pos] === name);
          return l.length ? l.reduce((t, p) => t + p.x, 0) / l.length : null;
        };
      const back = line('back'),
        mid = line('mid'),
        front = line('front');
      const row = [
        Math.max(...xs) - Math.min(...xs),
        Math.max(...ys) - Math.min(...ys),
        back,
        mid,
        front,
        back !== null && mid !== null ? mid - back : null,
        mid !== null && front !== null ? front - mid : null,
      ];
      for (const key of [`${st}|all`, `${st}|${bThird}`]) {
        const sh = tables.shape[key] || (tables.shape[key] = { n: 0, sum: row.map(() => 0), cnt: row.map(() => 0) });
        sh.n++;
        row.forEach((v, i) => {
          if (v !== null) {
            sh.sum[i] += v;
            sh.cnt[i]++;
          }
        });
      }
    }
  }
  return stats;
}

// ---------- From the sums to a table ----------
const r3 = (v) => Math.round(v * 1000) / 1000;
// Least squares of v on (bx - .5, by - .5), weighted by n: returns a plane [a, b, c] (v = a + b*bx + c*by)
const plane = (pts) => {
  let s = 0,
    sx = 0,
    sy = 0,
    sxx = 0,
    sxy = 0,
    syy = 0,
    sv = 0,
    sxv = 0,
    syv = 0;
  for (const { n, bx, by, v } of pts) {
    s += n;
    sx += n * bx;
    sy += n * by;
    sxx += n * bx * bx;
    sxy += n * bx * by;
    syy += n * by * by;
    sv += n * v;
    sxv += n * bx * v;
    syv += n * by * v;
  }
  // solve the 3x3 normal equations by Cramer's rule
  const M = [
      [s, sx, sy],
      [sx, sxx, sxy],
      [sy, sxy, syy],
    ],
    R = [sv, sxv, syv];
  const det = (m) =>
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const d = det(M);
  if (Math.abs(d) < 1e-9) return [s ? sv / s : 0, 0, 0];
  const col = (i) => det(M.map((row, r) => row.map((x, c) => (c === i ? R[r] : x))));
  return [col(0) / d, col(1) / d, col(2) / d];
};

export function buildTable(tables, meta) {
  const out = {
    source: 'Derived from SkillCorner Open Data (MIT licence, https://github.com/SkillCorner/opendata)',
    built: meta.built,
    matches: meta.matches,
    frames: meta.frames,
    grid: GRID,
    note: "Teams attack left to right; x 0 = own goal line, 1 = the goal attacked; y mirrored toward the player's own wing (wide players) or the ball side (central players). offsets[state][pos][cell] = [dx, dy, n], cell = ballX * ny + ballY (ball in the same frame); home[state][pos] = [x, y, n].",
    home: { in: {}, out: {} },
    offsets: { in: {}, out: {} },
    shape: {},
  };
  for (const [key, tb] of Object.entries(tables.pos)) {
    const [st, pos] = key.split('|');
    if (tb.all.n < 50) continue;
    const mx = tb.all.x / tb.all.n,
      my = tb.all.y / tb.all.n;
    out.home[st][pos] = [r3(mx), r3(my), tb.all.n];
    // each cell's average position, as the offset from the position's own average
    const cells = [];
    for (const [c, a] of Object.entries(tb.cell)) {
      const [cx, cy] = c.split(',').map(Number);
      cells.push({
        cx,
        cy,
        n: a.n,
        bx: (cx + 0.5) / GRID.nx - 0.5,
        by: (cy + 0.5) / GRID.ny - 0.5,
        dx: a.x / a.n - mx,
        dy: a.y / a.n - my,
      });
    }
    const px = plane(cells.map((c) => ({ n: c.n, bx: c.bx, by: c.by, v: c.dx }))),
      py = plane(cells.map((c) => ({ n: c.n, bx: c.bx, by: c.by, v: c.dy })));
    const arr = [];
    for (let cx = 0; cx < GRID.nx; cx++)
      for (let cy = 0; cy < GRID.ny; cy++) {
        const c = cells.find((q) => q.cx === cx && q.cy === cy),
          bx = (cx + 0.5) / GRID.nx - 0.5,
          by = (cy + 0.5) / GRID.ny - 0.5;
        const fx = px[0] + px[1] * bx + px[2] * by,
          fy = py[0] + py[1] * bx + py[2] * by;
        const n = c ? c.n : 0,
          w = n / (n + SHRINK);
        arr.push([r3(c ? w * c.dx + (1 - w) * fx : fx), r3(c ? w * c.dy + (1 - w) * fy : fy), n]);
      }
    out.offsets[st][pos] = arr;
  }
  const names = ['depth', 'width', 'back', 'mid', 'front', 'backToMid', 'midToFront'];
  for (const [key, sh] of Object.entries(tables.shape))
    out.shape[key] = {
      n: sh.n,
      ...Object.fromEntries(names.map((nm, i) => [nm, sh.cnt[i] ? r3(sh.sum[i] / sh.cnt[i]) : null])),
    };
  return out;
}

export const emptyTables = () => ({ pos: {}, shape: {} });

// A short report: where each position stands, and how the team is shaped
export function summary(t) {
  const lines = [`${t.matches.length} matches, ${t.frames} sampled frames`];
  for (const st of ['in', 'out']) {
    lines.push(`\n${st === 'in' ? 'With the ball' : 'Without the ball'} (average x, y):`);
    for (const p of POS) {
      const h = t.home[st][p];
      if (h) lines.push(`  ${p.padEnd(3)} x ${h[0].toFixed(3)}  y ${h[1].toFixed(3)}  (${h[2]} frames)`);
    }
  }
  lines.push('\nTeam shape (depth, width, back, mid, front):');
  for (const [k, s] of Object.entries(t.shape))
    lines.push(
      `  ${k.padEnd(6)} ${['depth', 'width', 'back', 'mid', 'front'].map((nm) => (s[nm] === null ? '—' : s[nm].toFixed(3))).join('  ')}  (${s.n})`,
    );
  return lines.join('\n');
}

// ---------- Main ----------
async function main() {
  if (!args.data) {
    console.log(
      'usage: node tools/skillcorner-shapes.mjs --data <opendata/data> [--matches ids] [--step 5] [--out file] [--check]',
    );
    process.exit(1);
  }
  const dir = path.resolve(String(args.data)),
    step = Math.max(1, +(args.step || 5));
  let ids;
  if (args.matches && args.matches !== true)
    ids = String(args.matches)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  else {
    const mf = path.join(dir, 'matches.json');
    if (!fs.existsSync(mf)) {
      console.error(`No matches.json in ${dir}: --data is the "data" folder of the SkillCorner repo`);
      process.exit(1);
    }
    ids = JSON.parse(fs.readFileSync(mf, 'utf8')).map((m) => m.id);
  }
  const tables = emptyTables(),
    done = [],
    unmapped = new Set();
  let frames = 0,
    unmatched = 0;
  for (const id of ids) {
    const s = await readMatch(dir, id, step, tables);
    if (!s) {
      console.log(`  ${id}: no tracking files, skipped`);
      continue;
    }
    done.push(id);
    frames += s.used;
    unmatched += s.unmatched;
    s.unmapped.forEach((u) => unmapped.add(u));
    console.log(
      `  ${id}: ${s.used} frames used of ${s.lines} (${s.noBall} without a ball, ${s.noPoss} without possession)`,
    );
  }
  if (!done.length) {
    console.error('No match had tracking data. Is --data the "data" folder, and are the .jsonl files there?');
    process.exit(1);
  }
  if (unmatched) console.log(`! ${unmatched} player readings had an id no player in match.json has (skipped)`);
  if (unmapped.size) console.log(`! positions this script does not know (skipped): ${[...unmapped].join(', ')}`);
  const table = buildTable(tables, { built: new Date().toISOString().slice(0, 10), matches: done.map(Number), frames });
  console.log(summary(table));
  if (args.check) return;
  const out = path.resolve(ROOT, String(args.out && args.out !== true ? args.out : 'data/shape-table.json'));
  fs.writeFileSync(out, JSON.stringify(table));
  console.log(`\nWrote ${path.relative(ROOT, out)} (${(fs.statSync(out).size / 1024).toFixed(1)} KB)`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
