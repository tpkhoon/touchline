// Measures carries from optical tracking, the same way for every source, and writes them into the carry table the match view reads
// (data/carry-table.json and js/carries.js, built first by tools/wyscout-carries.mjs). Only the table is kept in the game; the
// tracking is never copied into the repo.
//
//   node --max-old-space-size=4096 tools/tracking-carries.mjs --dfl <folder with the DFL_04_03_positions_raw_observed_*.xml files>
//        [--matches 7] [--check]
//
// Source: the DFL / Sportec open dataset (Bassek, Rein, Weber and Memmert, "An integrated dataset of spatiotemporal and event data
// in elite soccer", Scientific Data 2025, https://doi.org/10.1038/s41597-025-04505-y; CC BY 4.0): seven Bundesliga matches of 2022/23,
// 25 frames a second, metres from the centre spot.
//
// A carry here: a player has the ball while it is within 1.5 m of him and in play (a gap of up to 0.24 s is bridged); the stretch he
// holds it is a possession; a possession of at least 0.4 s is a reception, and if the ball moved 4 m or more between its start and
// its end it is a carry. By the third of the pitch the reception was in (in the direction the side attacks): how often a reception
// is followed by a carry, a sample of the carries (metres forward and across), how long the player holds the ball, how far the
// ball travels. The sides' directions come from the kick-off events (the side on the left in the first half attacks to the right).
import fs from 'node:fs';
const LF = String.fromCharCode(10);
import path from 'node:path';
import readline from 'node:readline';
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
const HZ = 25,
  NEAR = 1.5, // m: the ball is at his feet
  GAP = 6, // frames a possession may lose the ball and still be the same
  MIN_FRAMES = 10, // 0.4 s
  CARRY_M = 4,
  SHORT_M = 1,
  MAX_BALL = 7.5; // m/s
const r1 = (v) => Math.round(v * 10) / 10;
const q = (arr, p) => {
  const s = [...arr].sort((a, b) => a - b);
  return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : 0;
};

// ---------- Reading one match ----------
// returns { halves: [ { ball: {x, y, z, st}, players: [ { team, id, x, y, s } ], n } ], home, left: first-half left team }
async function readMatch(positionsFile, eventsFile) {
  const halves = {};
  let cur = null;
  const rl = readline.createInterface({
    input: fs.createReadStream(positionsFile, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });
  const reF = /<FrameSet GameSection="(\w+)" MatchId="[^"]*" TeamId="([^"]+)" PersonId="([^"]+)"/;
  const reN = /N="(\d+)"/,
    reX = /X="(-?[\d.]+)"/,
    reY = /Y="(-?[\d.]+)"/,
    reZ = /Z="(-?[\d.]+)"/,
    reS = /S="(-?[\d.]+)"/,
    reB = /BallStatus="(\d)"/;
  for await (const line of rl) {
    if (line.startsWith('<FrameSet')) {
      const m = reF.exec(line);
      if (!m || m[2] === 'referee') {
        cur = null;
        continue;
      }
      const H = (halves[m[1]] = halves[m[1]] || { ball: null, players: [] });
      cur = { team: m[2], id: m[3], n: [], x: [], y: [], z: [], s: [], st: [] };
      if (m[2] === 'BALL') H.ball = cur;
      else H.players.push(cur);
    } else if (cur && line.startsWith('<Frame ')) {
      cur.n.push(+reN.exec(line)[1]);
      cur.x.push(+reX.exec(line)[1]);
      cur.y.push(+reY.exec(line)[1]);
      cur.s.push(+(reS.exec(line) || [0, 0])[1]);
      if (cur.team === 'BALL') {
        cur.z.push(+(reZ.exec(line) || [0, 0])[1]);
        cur.st.push(+(reB.exec(line) || [0, 1])[1]);
      }
    }
  }
  // who is on the left in the first half: the kick-off event says
  const ev = fs.readFileSync(eventsFile, 'utf8');
  const ko = /<KickOff TeamLeft="([^"]+)" TeamRight="([^"]+)" GameSection="firstHalf"/.exec(ev);
  return { halves, left: ko ? ko[1] : null };
}

// ---------- Possessions and carries ----------
export function carriesOf(match, out) {
  for (const [section, H] of Object.entries(match.halves)) {
    const ball = H.ball;
    if (!ball || !H.players.length) continue;
    const n0 = ball.n[0],
      N = ball.n.length;
    // a side attacks to the right (+1) in the first half if it is not on the left; the halves switch
    const dirOf = (team) => {
      const leftFirst = match.left === team;
      return (section === 'firstHalf' ? leftFirst : !leftFirst) ? 1 : -1;
    };
    // each player's index by frame (players may have fewer frames: the ones who come on or go off)
    const pl = H.players.map((p) => ({ team: p.team, id: p.id, off: p.n[0] - n0, x: p.x, y: p.y, dir: dirOf(p.team) }));
    let holder = null,
      start = 0,
      last = 0,
      lost = 0;
    const close = () => {
      if (!holder) return;
      const len = last - start + 1;
      if (len >= MIN_FRAMES) {
        const sx = ball.x[start],
          sy = ball.y[start],
          ex = ball.x[last],
          ey = ball.y[last],
          dx = (ex - sx) * holder.dir,
          dy = (ey - sy) * holder.dir, // across: seen from the side attacking
          m = Math.hypot(dx, dy),
          zone = Math.min(2, Math.max(0, Math.floor(((sx * holder.dir + 52.5) / 105) * 3)));
        out.rec[zone]++;
        out.hold[zone].push(len / HZ);
        if (m >= CARRY_M && m <= 60) out.carries[zone].push([r1(dx), r1(dy), r1(len / HZ)]);
        else if (m >= SHORT_M && m < CARRY_M) out.short[zone].push([r1(dx), r1(dy), r1(len / HZ)]); // (a short touch: 1 to 4 m)
      }
      holder = null;
    };
    for (let i = 0; i < N; i++) {
      let who = null;
      // (a ball faster than a player can run it is a pass or a shot, not a carry)
      const bs =
        i > 0 && i < N - 1 ? Math.hypot(ball.x[i + 1] - ball.x[i - 1], ball.y[i + 1] - ball.y[i - 1]) * (HZ / 2) : 99;
      if (ball.st[i] === 1 && ball.z[i] < 1.5 && bs < MAX_BALL) {
        let bd = NEAR;
        for (const p of pl) {
          const j = i - p.off;
          if (j < 0 || j >= p.x.length) continue;
          const d = Math.hypot(p.x[j] - ball.x[i], p.y[j] - ball.y[i]);
          if (d < bd) {
            bd = d;
            who = p;
          }
        }
      }
      if (who && holder && who.id === holder.id) {
        last = i;
        lost = 0;
      } else if (who) {
        close();
        holder = who;
        start = i;
        last = i;
        lost = 0;
      } else if (holder && ++lost > GAP) close();
    }
    close();
    // speeds of the outfield players (for a check against the Metrica figures)
    for (const p of H.players) {
      if (p.team === 'BALL') continue;
      for (let j = 0; j < p.x.length; j += 5) out.speeds.push(p.s[j] / 3.6); // (DFL gives km/h)
    }
  }
}

export function build(out, matches) {
  const zones = [0, 1, 2].map((z) => {
    const c = out.carries[z],
      len = c.map(([dx, dy]) => Math.hypot(dx, dy)),
      sorted = [...c].sort((a, b) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1])),
      sample = [];
    for (let k = 0; k < 120 && sorted.length; k++)
      sample.push(sorted[Math.floor(((k + 0.5) * sorted.length) / 120)].slice(0, 2));
    return {
      receptions: out.rec[z],
      carried: c.length,
      share: +(c.length / Math.max(1, out.rec[z])).toFixed(3),
      median: r1(q(len, 0.5)),
      p90: r1(q(len, 0.9)),
      forward: +(c.filter(([dx]) => dx > 1).length / Math.max(1, c.length)).toFixed(3),
      holdMedian: r1(q(out.hold[z], 0.5)),
      sample,
    };
  });
  return {
    matches,
    zones,
    note: 'from tracking, measured one way for every source: a possession of 0.4 s or more is a reception, a carry is 4 m or more of ball travel while the same player holds it',
  };
}

// Two sources, each with the same weight: the DFL is complete but seven matches, the PFF is sixty-four but broadcast video (a possession
// is cut short when the ball or the player leaves the picture, which lowers the share of carries and leans the direction forward). Per
// third: the share is the mean of the two, the carries a half of each source's sample, so neither outweighs the other.
export function mix(a, b) {
  const zones = a.zones.map((za, z) => {
    const zb = b.zones[z],
      sample = za.sample.filter((_, i) => i % 2 === 0).concat(zb.sample.filter((_, i) => i % 2 === 0)),
      len = sample.map(([dx, dy]) => Math.hypot(dx, dy));
    return {
      receptions: za.receptions + zb.receptions,
      carried: za.carried + zb.carried,
      share: +((za.share + zb.share) / 2).toFixed(3),
      median: r1(q(len, 0.5)),
      p90: r1(q(len, 0.9)),
      forward: +(sample.filter(([dx]) => dx > 1).length / Math.max(1, sample.length)).toFixed(3),
      holdMedian: r1((za.holdMedian + zb.holdMedian) / 2),
      sample,
    };
  });
  return {
    matches: a.matches + b.matches,
    zones,
    note: 'the DFL and the PFF tracking with equal weight (see tools/tracking-carries.mjs)',
  };
}

export function report(t) {
  const names = ['own third', 'middle third', 'final third'];
  const lines = [`Tracking: ${t.matches} matches`];
  t.zones.forEach((z, i) =>
    lines.push(
      `  ${names[i].padEnd(12)} ${z.carried} of ${z.receptions} receptions (${(z.share * 100).toFixed(1)}%) carried 4 m or more; median ${z.median} m, 90th ${z.p90} m, ${(z.forward * 100).toFixed(0)}% forward, held ${z.holdMedian} s (median)`,
    ),
  );
  return lines.join('\n');
}

async function main() {
  if (!args.dfl || args.dfl === true) {
    console.log(
      'usage: node --max-old-space-size=4096 tools/tracking-carries.mjs --dfl <folder with the DFL position files> [--pff <the "FIFA World Cup 2022" folder>] [--check]',
    );
    process.exit(1);
  }
  const dir = path.resolve(String(args.dfl));
  const files = fs.readdirSync(dir).filter((f) => /^DFL_04_03_positions_raw_observed_.*\.xml$/.test(f));
  const out = { rec: [0, 0, 0], carries: [[], [], []], short: [[], [], []], hold: [[], [], []], speeds: [] };
  let matches = 0;
  for (const f of files.slice(0, +args.matches || files.length)) {
    const id = /DFL-MAT-(\w+)\.xml$/.exec(f)[1];
    const ev = fs.readdirSync(dir).find((e) => e.includes('events_raw') && e.includes(id));
    if (fs.statSync(path.join(dir, f)).size < 1e8 || !ev) {
      console.log(`  skipping ${f} (incomplete)`);
      continue;
    }
    const m = await readMatch(path.join(dir, f), path.join(dir, ev));
    carriesOf(m, out);
    matches++;
    console.log(`  match ${id}: ${out.rec.reduce((a, b) => a + b, 0)} receptions so far`);
  }
  // --short: only the short touches, from the DFL tracking, put into the table beside the carries (the PFF's ball is placed at the
  // carrier by its own smoothing, so it says nothing about a touch of a metre or two)
  if (args.short) {
    const zones = [0, 1, 2].map((z) => {
      const s = out.short[z],
        sorted = [...s].sort((a, b) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1])),
        sample = [];
      for (let k = 0; k < 120 && sorted.length; k++)
        sample.push(sorted[Math.floor(((k + 0.5) * sorted.length) / 120)].slice(0, 2));
      return {
        touched: s.length,
        share: +(s.length / Math.max(1, out.rec[z])).toFixed(3),
        median: r1(
          q(
            s.map(([dx, dy]) => Math.hypot(dx, dy)),
            0.5,
          ),
        ),
        forward: +(s.filter(([dx]) => dx > 0.3).length / Math.max(1, s.length)).toFixed(3),
        sample,
      };
    });
    const short = {
      matches,
      zones,
      note: 'receptions whose ball travelled 1 to 4 m while the player held it (the DFL tracking)',
    };
    console.log('Short touches (DFL):');
    zones.forEach((z, i) =>
      console.log(
        `  ${['own third', 'middle third', 'final third'][i].padEnd(12)} ${z.touched} of ${out.rec[i]} receptions (${(z.share * 100).toFixed(1)}%); median ${z.median} m, ${(z.forward * 100).toFixed(0)}% forward`,
      ),
    );
    if (args.check) return;
    const file = path.join(ROOT, 'data/carry-table.json');
    const table = JSON.parse(fs.readFileSync(file, 'utf8'));
    table.carries.short = short;
    fs.writeFileSync(file, JSON.stringify(table));
    const js = fs.readFileSync(path.join(ROOT, 'js/carries.js'), 'utf8').split(LF);
    const i = js.findIndex((l) => l.startsWith('  window.FM.D.CARRIES = '));
    js[i] = `  window.FM.D.CARRIES = ${JSON.stringify(table)};`;
    fs.writeFileSync(path.join(ROOT, 'js/carries.js'), js.join(LF));
    console.log('Wrote the short touches into data/carry-table.json and js/carries.js');
    return;
  }
  // the PFF FC / Gradient Sports World Cup tracking, if given: read the same way and pooled with the DFL's (each source is also kept
  // on its own in the table so the two can be compared)
  let pff = null;
  if (args.pff && args.pff !== true) {
    const { readPff } = await import('./pff-carries.mjs');
    pff = { rec: [0, 0, 0], carries: [[], [], []], hold: [[], [], []] };
    pff.matches = await readPff(path.resolve(String(args.pff)), pff, +args.pffMatches);
  }
  const dflOnly = build(out, matches);
  const pffOnly = pff ? build(pff, pff.matches) : null;
  const t = pff ? mix(dflOnly, pffOnly) : dflOnly;
  if (pff) t.sources = { dfl: dflOnly, pff: pffOnly };
  const sp = out.speeds.filter((v) => v === v).sort((a, b) => a - b);
  t.speed = { p50: r1(q(sp, 0.5)), p99: +q(sp, 0.99).toFixed(2), p999: +q(sp, 0.999).toFixed(2) };
  if (pff) {
    console.log('DFL alone:');
    console.log(report(dflOnly));
    console.log('PFF alone:');
    console.log(report(t.sources.pff));
    console.log('Equal weight (the table):');
  }
  console.log(report(t));
  console.log(`  speed (all players, sampled): p50 ${t.speed.p50}, p99 ${t.speed.p99}, p99.9 ${t.speed.p999} m/s`);
  if (args.check) return;
  const file = path.join(ROOT, 'data/carry-table.json');
  const table = JSON.parse(fs.readFileSync(file, 'utf8'));
  table.carries = {
    ...t,
    previous: table.carries.previous || table.carries, // (the single Metrica game's, kept for comparison)
  };
  const base = table.source.split('; the DFL')[0].split('; PFF')[0];
  table.source =
    base +
    '; the DFL / Sportec open dataset (Bassek, Rein, Weber and Memmert 2025, CC BY 4.0, https://doi.org/10.1038/s41597-025-04505-y)' +
    (pff
      ? '; PFF FC / Gradient Sports 2022 World Cup tracking (derived figures only, used with permission of its terms)'
      : '');
  fs.writeFileSync(file, JSON.stringify(table));
  fs.writeFileSync(
    path.join(ROOT, 'js/carries.js'),
    [
      '// Generated by tools/wyscout-carries.mjs and tools/tracking-carries.mjs (npm run carries) from the Wyscout public soccer-event dataset (CC BY 4.0, https://doi.org/10.6084/m9.figshare.c.4415000), the Metrica Sports sample data, the DFL / Sportec open dataset (CC BY 4.0, https://doi.org/10.1038/s41597-025-04505-y) and the PFF FC / Gradient Sports 2022 World Cup tracking (derived figures only)',
      '// How far and how often players carry the ball, and how goal kicks and throw-ins are taken (read by the match view in js/matchmotion.js and Match.circulate in js/engine.js).',
      '(function () {',
      `  window.FM.D.CARRIES = ${JSON.stringify(table)};`,
      '})();',
      '',
    ].join('\n'),
  );
  console.log(`\nWrote the carries of ${t.matches} matches into data/carry-table.json and js/carries.js`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
