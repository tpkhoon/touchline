// Builds the pass table and the expected-threat (xT) grid the match view uses from the Wyscout public soccer-event dataset
// (Pappalardo and Massucco, 2019, CC BY 4.0, https://doi.org/10.6084/m9.figshare.c.4415000). Only the tables are kept in the game.
//
//   node --max-old-space-size=6144 tools/wyscout-passes.mjs --data <folder with events_*.json> [--out data/pass-table.json] [--check]
//
//   xt:   how dangerous it is to have the ball in each part of the pitch: the chance a possession that has the ball there
//         ends in a goal soon, worked out as in Singh's expected threat. A grid of 16 along the pitch by 12 across (the
//         shooter's goal at the end of the first axis). In each cell the ball is either shot (worth that cell's chance of
//         scoring, from a small logistic model fitted on all shots) or moved by a pass to another cell, and the values are
//         found by repeating that until they stop changing. A pass that is lost is worth nothing.
//   disp: where passes go from each part of the pitch: for 6 slices along the pitch by 3 across (the middle, the
//         half-spaces, the wings), how the passes split by how far they go forward or back and how far toward the middle or
//         the touchline, as shares. The engine weighs each team-mate by the share of real passes that go where he stands.
//   stats: what the passes look like overall (a check: length, direction, how many reach the receiver).
//
// Wyscout gives the shooting or passing team's pitch with x from 0 (own goal) to 100 and y from 0 to 100 across; a 105 x 68 m pitch
// is assumed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { geom, fit, prob } from './wyscout-shots.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = {};
{
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    if (!a[i].startsWith('--')) continue;
    args[a[i].slice(2)] = a[i + 1] === undefined || a[i + 1].startsWith('--') ? true : a[++i];
  }
}

export const NX = 16,
  NY = 12; // the xT grid
export const L = 105,
  Wd = 68;
// the displacement table: origin slices, then the bins a pass falls into (forward metres, inward metres)
export const ZX = 6,
  ZY = 3;
export const DX_EDGES = [-20, -10, -3, 3, 10, 20, 30, 45]; // 9 bins
export const DY_EDGES = [-20, -8, -2, 2, 8, 20]; // 7 bins
// how wide each bin is in metres (the outer bins are open-ended: given the width a typical long pass fills), so a share can be turned into a
// density: a candidate team-mate in a wide bin is more likely to be there than one in a narrow bin, and the engine weighs by density
export const DX_W = [20, 10, 7, 6, 7, 10, 10, 15, 20];
export const DY_W = [20, 12, 6, 4, 6, 12, 20];
const bin = (v, edges) => {
  let i = 0;
  while (i < edges.length && v >= edges[i]) i++;
  return i;
};
export const zoneY = (y) => {
  const d = Math.abs(y - 50);
  return d < 12 ? 0 : d < 30 ? 1 : 2;
};
const cell = (x, y) => [
  Math.min(NX - 1, Math.max(0, Math.floor((x / 100) * NX))),
  Math.min(NY - 1, Math.max(0, Math.floor((y / 100) * NY))),
];
const idx = (cx, cy) => cx * NY + cy;

// ---------- Reading ----------
const has = (e, id) => e.tags.some((t) => t.id === id);
export function readFile(file, acc) {
  const ev = JSON.parse(fs.readFileSync(file, 'utf8'));
  const matches = new Set();
  for (const e of ev) {
    matches.add(e.matchId);
    const pos = e.positions;
    if (!pos || !pos[0]) continue;
    if (e.eventName === 'Pass' && e.subEventName !== 'Hand pass' && pos.length >= 2) {
      // (open-play passes; hand passes are the keeper's and throw-ins are not in Pass events)
      const ok = has(e, 1801);
      const [a, b] = pos;
      acc.passes.push([a.x, a.y, b.x, b.y, ok ? 1 : 0, e.subEventName === 'Cross' ? 1 : 0]);
    } else if ((e.eventName === 'Shot' || e.subEventName === 'Free kick shot') && e.subEventName !== 'Penalty') {
      if (has(e, 102)) continue;
      const g = geom(pos[0].x, pos[0].y);
      acc.shots.push({
        x: pos[0].x,
        y: pos[0].y,
        ...g,
        head: has(e, 403),
        fk: e.subEventName === 'Free kick shot',
        goal: has(e, 101),
      });
    }
  }
  return matches.size;
}

// ---------- Expected threat ----------
export function xtGrid(passes, shots, w) {
  const n = NX * NY;
  const att = new Float64Array(n), // actions from the cell (passes and shots)
    shotN = new Float64Array(n),
    shotG = new Float64Array(n), // model chance of scoring, summed
    passN = new Float64Array(n);
  const T = Array.from({ length: n }, () => new Map()); // successful passes from a cell to another
  for (const s of shots) {
    const [cx, cy] = cell(s.x, s.y),
      i = idx(cx, cy);
    att[i]++;
    shotN[i]++;
    shotG[i] += prob(w, s);
  }
  for (const [x0, y0, x1, y1, ok] of passes) {
    const [cx, cy] = cell(x0, y0),
      i = idx(cx, cy);
    att[i]++;
    passN[i]++;
    if (ok) {
      const [dx, dy] = cell(x1, y1),
        j = idx(dx, dy);
      T[i].set(j, (T[i].get(j) || 0) + 1);
    }
  }
  // fold the grid about the middle line so left and right share what they know (a cell and its mirror image)
  const mirror = (i) => idx(Math.floor(i / NY), NY - 1 - (i % NY));
  const sh = new Float64Array(n),
    mv = new Float64Array(n),
    gl = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const m = mirror(i),
      a = att[i] + att[m] || 1;
    sh[i] = (shotN[i] + shotN[m]) / a;
    mv[i] = (passN[i] + passN[m]) / a;
    gl[i] = shotN[i] + shotN[m] ? (shotG[i] + shotG[m]) / (shotN[i] + shotN[m]) : 0;
  }
  // transitions per origin cell: pooled with the mirror cell (the destination mirrored too)
  const trans = Array.from({ length: n }, () => new Map());
  for (let i = 0; i < n; i++) {
    const m = mirror(i),
      tot = passN[i] + passN[m];
    if (!tot) continue;
    for (const [j, c] of T[i]) trans[i].set(j, (trans[i].get(j) || 0) + c / tot);
    for (const [j, c] of T[m]) trans[i].set(mirror(j), (trans[i].get(mirror(j)) || 0) + c / tot);
  }
  let xt = new Float64Array(n);
  for (let it = 0; it < 60; it++) {
    const next = new Float64Array(n);
    let d = 0;
    for (let i = 0; i < n; i++) {
      let v = sh[i] * gl[i];
      let mv2 = 0;
      for (const [j, p] of trans[i]) mv2 += p * xt[j];
      v += mv[i] * mv2;
      next[i] = v;
      d = Math.max(d, Math.abs(v - xt[i]));
    }
    xt = next;
    if (d < 1e-8) break;
  }
  return xt;
}

// ---------- Where passes go ----------
export function dispTable(passes) {
  const counts = Array.from({ length: ZX * ZY }, () => new Float64Array((DX_EDGES.length + 1) * (DY_EDGES.length + 1)));
  const totals = new Float64Array(ZX * ZY);
  for (const [x0, y0, x1, y1] of passes) {
    const zx = Math.min(ZX - 1, Math.floor((x0 / 100) * ZX)),
      zy = zoneY(y0),
      z = zx * ZY + zy,
      dx = (x1 - x0) * (L / 100),
      di = (y0 <= 50 ? 1 : -1) * (y1 - y0) * (Wd / 100); // metres toward the middle line (a pass from the near side goes inward as y grows)
    counts[z][bin(dx, DX_EDGES) * (DY_EDGES.length + 1) + bin(di, DY_EDGES)]++;
    totals[z]++;
  }
  return counts.map((c, z) => Array.from(c, (v) => Math.round((v / (totals[z] || 1)) * 10000) / 10000));
}

// ---------- The table ----------
const r4 = (v) => Math.round(v * 10000) / 10000;
export function stats(passes, matches) {
  const n = passes.length,
    ok = passes.filter((p) => p[4]).length;
  let len = 0,
    fw = 0,
    sd = 0,
    bk = 0;
  const third = [0, 0, 0],
    thirdOk = [0, 0, 0];
  for (const [x0, y0, x1, y1, o] of passes) {
    const dx = (x1 - x0) * (L / 100),
      dy = (y1 - y0) * (Wd / 100);
    len += Math.hypot(dx, dy);
    if (dx > 3) fw++;
    else if (dx < -3) bk++;
    else sd++;
    const t = x0 < 33.3 ? 0 : x0 < 66.7 ? 1 : 2;
    third[t]++;
    thirdOk[t] += o;
  }
  return {
    perMatch: r4(n / matches),
    avgLength: r4(len / n),
    forward: r4(fw / n),
    sideways: r4(sd / n),
    backward: r4(bk / n),
    accuracy: r4(ok / n),
    accuracyByThird: thirdOk.map((v, i) => r4(v / third[i])),
  };
}
export function buildTable(passes, shots, matches, w) {
  const xt = xtGrid(passes, shots, w);
  return {
    source:
      'Derived from the Wyscout public soccer-event dataset (Pappalardo and Massucco, 2019, CC BY 4.0, https://doi.org/10.6084/m9.figshare.c.4415000)',
    built: new Date().toISOString().slice(0, 10),
    matches,
    passes: passes.length,
    xt: {
      nx: NX,
      ny: NY,
      v: Array.from(xt, (v) => Math.round(v * 100000) / 100000),
      note: 'v[cx * ny + cy]: cx along the pitch toward the goal attacked, cy across; the chance a possession with the ball in the cell ends in a goal',
    },
    disp: {
      zx: ZX,
      zy: ZY,
      dxEdges: DX_EDGES,
      dyEdges: DY_EDGES,
      dxW: DX_W,
      dyW: DY_W,
      note: 'p[zx * zy + zoneY][dxBin * 7 + dyBin]: the share of passes from a slice of the pitch (zoneY 0 the middle, 1 the half-spaces, 2 the wings) by metres forward and metres toward the middle line',
      p: dispTable(passes),
    },
    stats: stats(passes, matches),
  };
}
export function report(t) {
  const out = [`${t.matches} matches, ${t.passes} passes`];
  const s = t.stats;
  out.push(
    `${s.perMatch} passes a match, ${s.avgLength} m on average, ${(s.forward * 100).toFixed(0)}% forward, ${(s.sideways * 100).toFixed(0)}% sideways, ${(s.backward * 100).toFixed(0)}% back; ${(s.accuracy * 100).toFixed(1)}% reach a team-mate (by third: ${s.accuracyByThird.map((v) => (v * 100).toFixed(0) + '%').join(', ')})`,
  );
  out.push('\nExpected threat (x 100) by distance along the pitch, middle of the pitch / wide:');
  const v = (cx, cy) => t.xt.v[cx * t.xt.ny + cy];
  for (let cx = 0; cx < t.xt.nx; cx += 2)
    out.push(
      `  cx ${String(cx).padStart(2)}  middle ${(v(cx, 5) * 100).toFixed(2).padStart(6)}  wide ${(v(cx, 0) * 100).toFixed(2).padStart(6)}`,
    );
  out.push(
    `  best cell ${(Math.max(...t.xt.v) * 100).toFixed(2)}, own box ${(v(0, 5) * 100).toFixed(2)}, centre circle ${(v(8, 5) * 100).toFixed(2)}`,
  );
  out.push('\nWhere passes go: from the middle of the pitch, the middle (forward metres, then share):');
  const d = t.disp;
  [0, 3].forEach((zx) => {
    const row = d.p[zx * d.zy + 0],
      f = Array.from({ length: d.dxEdges.length + 1 }, (_, a) =>
        row.slice(a * (d.dyEdges.length + 1), (a + 1) * (d.dyEdges.length + 1)).reduce((s, x) => s + x, 0),
      );
    out.push(
      `  slice ${zx}: forward-bin shares ${f.map((x) => (x * 100).toFixed(0)).join(' ')} (bins: <-20, -20..-10, -10..-3, -3..3, 3..10, 10..20, 20..30, 30..45, >45 m)`,
    );
  });
  return out.join('\n');
}

async function main() {
  if (!args.data || args.data === true) {
    console.log(
      'usage: node --max-old-space-size=6144 tools/wyscout-passes.mjs --data <folder with events_*.json> [--out file] [--check]',
    );
    process.exit(1);
  }
  const dir = path.resolve(String(args.data)),
    files = fs.readdirSync(dir).filter((f) => /^events_.*\.json$/.test(f));
  if (!files.length) {
    console.error(`No events_*.json files in ${dir}`);
    process.exit(1);
  }
  const acc = { passes: [], shots: [] };
  let matches = 0;
  for (const f of files) {
    const m = readFile(path.join(dir, f), acc);
    matches += m;
    console.log(`  ${f}: ${m} matches (${acc.passes.length} passes so far)`);
  }
  const w = fit(acc.shots);
  const table = buildTable(acc.passes, acc.shots, matches, w);
  console.log(report(table));
  if (args.check) return;
  const out = path.resolve(ROOT, String(args.out && args.out !== true ? args.out : 'data/pass-table.json'));
  fs.writeFileSync(out, JSON.stringify(table));
  fs.writeFileSync(
    path.join(ROOT, 'js/passes.js'),
    [
      '// Generated by tools/wyscout-passes.mjs (npm run passes) from the Wyscout public soccer-event dataset, CC BY 4.0, https://doi.org/10.6084/m9.figshare.c.4415000',
      '// Expected threat for each part of the pitch and where passes go from each (read by Match.circulate in js/engine.js).',
      '(function () {',
      `  window.FM.D.PASSES = ${JSON.stringify(table)};`,
      '})();',
      '',
    ].join('\n'),
  );
  console.log(`\nWrote ${path.relative(ROOT, out)} and js/passes.js (${(fs.statSync(out).size / 1024).toFixed(1)} KB)`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
