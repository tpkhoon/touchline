// Measures carries in the PFF FC / Gradient Sports 2022 World Cup tracking the same way tools/tracking-carries.mjs does for the DFL
// open dataset, to see whether the 64 matches agree with the seven Bundesliga ones. On its own it prints and writes nothing; the
// game's table takes it with the DFL's through `npm run carries:tracking -- --dfl <folder> --pff <folder>` (tracking-carries.mjs
// reads it from here). The dataset is given on request; its terms allow derived figures to be used (stated by the project's owner),
// and only the derived table is kept in the game.
//
//   node --max-old-space-size=4096 tools/pff-carries.mjs --pff <the "FIFA World Cup 2022" folder> [--matches 64]
//
// The tracking is broadcast video turned into positions: about 30 frames a second (29.97), only what the broadcast shows, a ball
// that is often estimated, players who are 'VISIBLE' or 'ESTIMATED'. A possession here needs the ball and the holder both visible,
// and the frames to be consecutive (a cut in the broadcast ends it). It reads the smoothed positions. Each match file is a
// bzip2-compressed line-per-frame JSON, read through the bzip2 program (never unpacked to disk).
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { build, report } from './tracking-carries.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = {};
{
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    if (!a[i].startsWith('--')) continue;
    args[a[i].slice(2)] = a[i + 1] === undefined || a[i + 1].startsWith('--') ? true : a[++i];
  }
}
const HZ = 29.97,
  NEAR = 1.5,
  GAP = 7, // frames
  MIN_FRAMES = 12, // 0.4 s
  CARRY_M = 4,
  MAX_BALL = 7.5; // m/s
const r1 = (v) => Math.round(v * 10) / 10;

async function readMatch(file, meta, out) {
  const bz = spawn('bzip2', ['-dc', file], { stdio: ['ignore', 'pipe', 'ignore'] });
  const rl = readline.createInterface({ input: bz.stdout, crlfDelay: Infinity });
  let prev = null, // the last frame's { n, bx, by }
    holder = null,
    startF = null,
    lastF = null,
    gap = 0,
    frames = 0;
  const close = () => {
    if (holder && lastF.n - startF.n + 1 >= MIN_FRAMES) {
      const dx = (lastF.bx - startF.bx) * holder.dir,
        dy = (lastF.by - startF.by) * holder.dir,
        m = Math.hypot(dx, dy),
        zone = Math.min(2, Math.max(0, Math.floor(((startF.bx * holder.dir + 52.5) / 105) * 3)));
      out.rec[zone]++;
      out.hold[zone].push((lastF.n - startF.n + 1) / HZ);
      if (m >= CARRY_M && m <= 60) out.carries[zone].push([r1(dx), r1(dy), r1((lastF.n - startF.n + 1) / HZ)]);
    }
    holder = null;
  };
  for await (const line of rl) {
    let j;
    try {
      j = JSON.parse(line);
    } catch {
      continue;
    }
    frames++;
    if (j.period !== 1 && j.period !== 2) continue;
    const ball = j.ballsSmoothed;
    const n = j.frameNum;
    if (prev && n !== prev.n + 1) close(); // a cut: the possession ends
    let who = null;
    let bs = 99;
    if (ball && ball.visibility === 'VISIBLE' && ball.z < 1.5) {
      if (prev && prev.n === n - 1 && prev.vis) bs = Math.hypot(ball.x - prev.bx, ball.y - prev.by) * HZ;
      // (the first frame after a cut has no speed: it cannot start a possession, but a possession in progress goes on)
      if (bs < MAX_BALL) {
        let bd = NEAR;
        for (const [list, team] of [
          [j.homePlayersSmoothed, 'home'],
          [j.awayPlayersSmoothed, 'away'],
        ]) {
          for (const p of list || []) {
            if (p.visibility !== 'VISIBLE') continue;
            const d = Math.hypot(p.x - ball.x, p.y - ball.y);
            if (d < bd) {
              bd = d;
              // a side attacks to the right if it started on the left in the first half (the halves switch)
              const left = team === 'home' ? meta.homeTeamStartLeft : !meta.homeTeamStartLeft;
              who = { id: team + p.jerseyNum, dir: (j.period === 1 ? left : !left) ? 1 : -1 };
            }
          }
        }
      }
    }
    const vis = !!(ball && ball.visibility === 'VISIBLE');
    const cur = { n, bx: ball ? ball.x : 0, by: ball ? ball.y : 0, vis };
    if (who && holder && who.id === holder.id) {
      lastF = cur;
      gap = 0;
    } else if (who) {
      close();
      holder = who;
      startF = cur;
      lastF = cur;
      gap = 0;
    } else if (holder && ++gap > GAP) close();
    prev = cur;
  }
  close();
  return frames;
}

// Reads every match of the folder into `out` (the same shape tracking-carries.mjs uses); returns the number of matches read
export async function readPff(dir, out, limit) {
  const trk = path.join(dir, 'Tracking Data');
  const files = fs.readdirSync(trk).filter((f) => /^\d+\.jsonl\.bz2$/.test(f));
  let matches = 0;
  for (const f of files.slice(0, limit || files.length)) {
    const id = f.split('.')[0],
      mf = path.join(dir, 'Metadata', `${id}.json`);
    if (!fs.existsSync(mf)) {
      console.log(`  ${id}: no metadata`);
      continue;
    }
    const meta = JSON.parse(fs.readFileSync(mf, 'utf8'))[0];
    const t0 = Date.now();
    const frames = await readMatch(path.join(trk, f), meta, out);
    matches++;
    console.log(
      `  ${id} ${meta.homeTeam.shortName}-${meta.awayTeam.shortName}: ${frames} frames, ${out.rec.reduce((a, b) => a + b, 0)} receptions so far (${((Date.now() - t0) / 1000).toFixed(0)} s)`,
    );
  }
  return matches;
}

async function main() {
  if (!args.pff || args.pff === true) {
    console.log(
      'usage: node --max-old-space-size=4096 tools/pff-carries.mjs --pff <the "FIFA World Cup 2022" folder> [--matches N]',
    );
    process.exit(1);
  }
  const out = { rec: [0, 0, 0], carries: [[], [], []], hold: [[], [], []] };
  const matches = await readPff(path.resolve(String(args.pff)), out, +args.matches);
  const t = build(out, matches);
  console.log(report(t));
  const dfl = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/carry-table.json'), 'utf8')).carries;
  console.log("For comparison, the DFL open tracking (the game's table):");
  console.log(report(dfl));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
