// Builds what the match view takes from the StatsBomb open data (github.com/statsbomb/open-data, now hudl/open-data; used with the
// permission the project's owner has; only derived figures are kept in the game, never the events or the 360 frames). 299 men's matches
// that have the 360 data: the World Cup 2022, Euro 2020 and 2024, La Liga 2020/21, Ligue 1 2021/22 and 2022/23, Bundesliga 2023/24, MLS 2023.
//
//   node --max-old-space-size=4096 tools/statsbomb-events.mjs --data <folder with events/, three-sixty/, matches/> [--matches N] [--write]
//
//   layouts:  corners, free kicks, throw-ins and goal kicks (Pass events of those types), each with the 360 frame of the event: where the
//             players the camera sees stand when the ball is put down, in the frame of the side with the ball (x from its own goal,
//             y across, metres on a 105 x 68 pitch), plus how many players of each side are in the area at a corner and how many
//             men stand in the wall at a free kick, by distance from goal.
//   carries:  from the Carry events: of the receptions (Ball Receipt events), the share followed by a carry of 4 m or more, and
//             by a short touch of 1 to 4 m, by third of the pitch, with a sample (metres forward, metres across): a third measure
//             beside the DFL and PFF tracking. The three are put in the carry table at equal weight.
//   takeons:  Dribble events: how many a match, by third, how often they work (a check on the Wyscout figures).
//   shots:    the players in the 360 freeze frame of each shot: how many attackers and defenders in the area (a check on the crowding
//             of the final third), the mean StatsBomb xG.
// StatsBomb events are 120 x 80 with each team attacking toward x = 120; a 105 x 68 m pitch is assumed (the coordinates scale).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as buildCarries } from './tracking-carries.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const LF = String.fromCharCode(10);
const args = {};
{
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    if (!a[i].startsWith('--')) continue;
    args[a[i].slice(2)] = a[i + 1] === undefined || a[i + 1].startsWith('--') ? true : a[++i];
  }
}
const SX = 105 / 120,
  SY = 68 / 80;
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const q = (arr, p) => {
  const s = [...arr].sort((a, b) => a - b);
  return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : 0;
};
const pt = (l) => ({ x: l[0] * SX, y: l[1] * SY }); // metres
const third = (x) => (x < 105 / 3 ? 0 : x < 210 / 3 ? 1 : 2);
const inBox = (p) => p.x > 105 - 16.5 && Math.abs(p.y - 34) < 20.16;

export function newAcc() {
  return {
    matches: 0,
    rec: [0, 0, 0],
    carries: [[], [], []],
    short: [[], [], []],
    hold: [[], [], []],
    dribble: { n: 0, won: 0, zone: [0, 0, 0], zoneWon: [0, 0, 0] },
    shot: { n: 0, goals: 0, xg: [], att: [], def: [], seen: 0, nearest: [] },
    corners: [],
    frees: [],
    throws: [],
    goalKicks: [],
    counts: { corner: 0, free: 0, throw: 0, goalKick: 0 },
  };
}

// a layout: the ball and the visible players around it, as offsets from the ball (metres), the actor left out
const around = (frame, ball, near) => {
  const mine = [],
    opp = [];
  for (const p of frame.freeze_frame) {
    if (p.actor || p.keeper) continue;
    const l = pt(p.location),
      d = Math.hypot(l.x - ball.x, l.y - ball.y);
    if (d > near) continue;
    (p.teammate ? mine : opp).push([r1(l.x - ball.x), r1(l.y - ball.y), d]);
  }
  mine.sort((a, b) => a[2] - b[2]);
  opp.sort((a, b) => a[2] - b[2]);
  return { mine: mine.map((p) => [p[0], p[1]]), opp: opp.map((p) => [p[0], p[1]]) };
};

export function readMatch(events, frames, acc) {
  const byId = new Map(frames.map((f) => [f.event_uuid, f]));
  acc.matches++;
  for (let i = 0; i < events.length; i++) {
    const e = events[i],
      t = e.type.name;
    // ---- carries: a reception, then the receiver's carry
    if (t === 'Ball Receipt*' && e.location) {
      const p = pt(e.location),
        z = third(p.x);
      acc.rec[z]++;
      const n = events[i + 1];
      if (
        n &&
        n.type.name === 'Carry' &&
        n.player &&
        e.player &&
        n.player.id === e.player.id &&
        n.carry &&
        n.location
      ) {
        const s = pt(n.location),
          en = pt(n.carry.end_location),
          dx = en.x - s.x,
          dy = en.y - s.y,
          m = Math.hypot(dx, dy);
        if (m >= 4 && m <= 60) acc.carries[z].push([r1(dx), r1(dy), r1(n.duration || 0)]);
        else if (m >= 1) acc.short[z].push([r1(dx), r1(dy), r1(n.duration || 0)]);
        acc.hold[z].push(n.duration || 0);
      }
    }
    // ---- take-ons
    if (t === 'Dribble' && e.location) {
      const z = third(pt(e.location).x),
        won = e.dribble && e.dribble.outcome && e.dribble.outcome.name === 'Complete';
      acc.dribble.n++;
      acc.dribble.zone[z]++;
      if (won) {
        acc.dribble.won++;
        acc.dribble.zoneWon[z]++;
      }
    }
    // ---- shots and their freeze frames
    if (t === 'Shot' && e.shot) {
      acc.shot.n++;
      if (e.shot.outcome && e.shot.outcome.name === 'Goal') acc.shot.goals++;
      if (typeof e.shot.statsbomb_xg === 'number') acc.shot.xg.push(e.shot.statsbomb_xg);
      const ff = e.shot.freeze_frame;
      if (ff && ff.length >= 8 && e.shot.type && e.shot.type.name === 'Open Play') {
        const a = pt(e.location);
        let att = 0,
          def = 0,
          near = 99;
        for (const p of ff) {
          const l = pt(p.location);
          if (p.keeper) continue;
          if (inBox(l)) p.teammate ? att++ : def++;
          if (!p.teammate) near = Math.min(near, Math.hypot(l.x - a.x, l.y - a.y));
        }
        acc.shot.seen++;
        acc.shot.att.push(att);
        acc.shot.def.push(def);
        acc.shot.nearest.push(near);
      }
    }
    // ---- set pieces: Pass events of the type, with the 360 frame
    if (t === 'Pass' && e.pass && e.pass.type && e.location) {
      const pty = e.pass.type.name,
        kind = { Corner: 'corner', 'Free Kick': 'free', 'Throw-in': 'throw', 'Goal Kick': 'goalKick' }[pty];
      if (kind) {
        acc.counts[kind]++;
        const f = byId.get(e.id);
        if (f && f.freeze_frame) {
          const ball = pt(e.location);
          acc[
            kind === 'corner' ? 'corners' : kind === 'free' ? 'frees' : kind === 'throw' ? 'throws' : 'goalKicks'
          ].push({ ball, frame: f, direct: false });
        }
      }
    }
    // a free kick taken as a shot
    if (t === 'Shot' && e.shot && e.shot.type && e.shot.type.name === 'Free Kick' && e.location) {
      acc.counts.free++;
      const f = byId.get(e.id);
      if (f && f.freeze_frame) acc.frees.push({ ball: pt(e.location), frame: f, direct: true });
    }
  }
}

export function build(acc) {
  const pick = (arr, n) => {
    const out = [];
    for (let k = 0; k < n && arr.length; k++) out.push(arr[Math.floor(((k + 0.5) * arr.length) / n)]);
    return out;
  };
  const perMatch = (n) => +(n / acc.matches).toFixed(1);
  // corners: the ball at a flag; count the visible players in the area
  const co = acc.corners.filter((c) => Math.abs(c.ball.x - 105) < 3 && (c.ball.y < 3 || c.ball.y > 65));
  const coLay = co
    .map((c) => {
      const flip = c.ball.y > 34;
      const rel = (l) => {
        const p = pt(l);
        return { x: p.x, y: flip ? 68 - p.y : p.y };
      };
      const mine = [],
        opp = [];
      let keeper = null;
      for (const p of c.frame.freeze_frame) {
        const l = rel(p.location);
        if (p.actor) continue;
        if (p.keeper && !p.teammate) keeper = [r1(l.x), r1(l.y)];
        else if (p.keeper) continue;
        else if (l.x > 105 - 30) (p.teammate ? mine : opp).push([r1(l.x), r1(l.y)]);
      }
      return { att: mine, def: opp, keeper, n: mine.length + opp.length };
    })
    .filter((c) => c.n >= 10);
  // the area at a corner (the visible players, so a floor)
  const area = (c, key) => c[key].filter(([x, y]) => x > 105 - 16.5 && Math.abs(y - 34) < 20.16 && true).length;
  const coBox = coLay.map((c) => ({ att: area(c, 'att'), def: area(c, 'def') }));

  // free kicks in the attacking half: the wall is the opponents 6 to 13 m from the ball in a narrow cone toward the goal
  const fk = acc.frees.filter((c) => c.ball.x > 105 * 0.55);
  const goalD = (c) => Math.hypot(105 - c.ball.x, 34 - c.ball.y);
  const band = (d) => (d < 20 ? 0 : d < 26 ? 1 : d < 32 ? 2 : 3);
  const wallOf = (c) => {
    const gx = 105 - c.ball.x,
      gy = 34 - c.ball.y,
      gd = Math.hypot(gx, gy) || 1;
    return c.frame.freeze_frame.filter((p) => {
      if (p.teammate || p.keeper) return false;
      const l = pt(p.location),
        dx = l.x - c.ball.x,
        dy = l.y - c.ball.y,
        d = Math.hypot(dx, dy);
      return d >= 6 && d <= 13 && (dx * gx + dy * gy) / (d * gd) > 0.94;
    });
  };
  const fkBands = [0, 1, 2, 3].map((b) => {
    const list = fk.filter((c) => band(goalD(c)) === b && goalD(c) < 40);
    const walls = list.map((c) => ({ c, w: wallOf(c) })).filter((x) => x.w.length >= 1);
    // (a wall shows in the frame when the camera sees the area; the share is of all free kicks in the band)
    return {
      n: list.length,
      direct: +(list.filter((c) => c.direct).length / Math.max(1, list.length)).toFixed(2),
      wallShare: list.length ? +(walls.length / list.length).toFixed(2) : 0,
      wallMen: r2(mean(walls.map((x) => x.w.length))),
      wallDist: r2(
        mean(
          walls.map((x) =>
            mean(
              x.w.map((p) => {
                const l = pt(p.location);
                return Math.hypot(l.x - x.c.ball.x, l.y - x.c.ball.y);
              }),
            ),
          ),
        ),
      ),
    };
  });
  const lay = (list, near, need, n) =>
    pick(
      list
        .map((c) => ({ ball: [r1(c.ball.x), r1(c.ball.y)], ...around(c.frame, c.ball, near) }))
        .filter((l) => l.mine.length + l.opp.length >= need),
      n,
    );
  const thr = acc.throws.filter((c) => c.ball.y < 4 || c.ball.y > 64);
  const thirds = (list, k) => list.filter((c) => third(c.ball.x) === k);
  const dr = acc.dribble;
  const sh = acc.shot;
  return {
    source:
      "Derived from the StatsBomb open data (299 men's matches with 360 data); only derived figures are kept (used with the permission the project's owner has)",
    built: new Date().toISOString().slice(0, 10),
    matches: acc.matches,
    perMatch: Object.fromEntries(Object.entries(acc.counts).map(([k, n]) => [k, perMatch(n)])),
    corner: {
      attackers: r2(mean(coBox.map((c) => c.att))),
      defenders: r2(mean(coBox.map((c) => c.def))),
      layouts: pick(coLay, 70).map((c) => ({ att: c.att, def: c.def, keeper: c.keeper })),
    },
    freekick: {
      bands: fkBands,
      layouts: [0, 1, 2, 3].map((b) =>
        lay(
          fk.filter((c) => band(goalD(c)) === b && goalD(c) < 40),
          35,
          8,
          30,
        ),
      ),
    },
    throwin: {
      byThird: [0, 1, 2].map((k) => +(thirds(thr, k).length / Math.max(1, thr.length)).toFixed(3)),
      layouts: [0, 1, 2].map((k) => lay(thirds(thr, k), 25, 6, 40)),
    },
    goalkick: { layouts: lay(acc.goalKicks, 60, 12, 40) },
    takeons: {
      perMatch: perMatch(dr.n),
      won: +(dr.won / Math.max(1, dr.n)).toFixed(3),
      zones: dr.zone.map((n, i) => ({
        share: +(n / Math.max(1, dr.n)).toFixed(3),
        won: +(dr.zoneWon[i] / Math.max(1, n)).toFixed(3),
      })),
    },
    shots: {
      perMatch: perMatch(sh.n),
      goal: +(sh.goals / Math.max(1, sh.n)).toFixed(3),
      meanXg: r2(mean(sh.xg)),
      inFrame: sh.seen,
      attackersInArea: r2(mean(sh.att)),
      defendersInArea: r2(mean(sh.def)),
      nearestDefender: r1(q(sh.nearest, 0.5)),
    },
  };
}

// the carries as the carry table keeps them (zones with share, lengths, a sample)
export function carriesTable(acc) {
  const t = buildCarries({ rec: acc.rec, carries: acc.carries, hold: acc.hold }, acc.matches);
  t.zones.forEach((z, i) => {
    const s = acc.short[i],
      sorted = [...s].sort((a, b) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1])),
      sample = [];
    for (let k = 0; k < 120 && sorted.length; k++)
      sample.push(sorted[Math.floor(((k + 0.5) * sorted.length) / 120)].slice(0, 2));
    z.shortShare = +(s.length / Math.max(1, acc.rec[i])).toFixed(3);
    z.shortSample = sample;
  });
  return t;
}

export function report(t, c) {
  const names = ['own third', 'middle third', 'final third'];
  const L = [`StatsBomb: ${t.matches} matches (with 360)`];
  const pm = t.perMatch;
  L.push(
    `  per match (both teams): corners ${pm.corner}, free kicks ${pm.free}, throw-ins ${pm.throw}, goal kicks ${pm.goalKick}`,
  );
  L.push(
    `  corner: ${t.corner.layouts.length} layouts; ${t.corner.attackers} attackers and ${t.corner.defenders} defenders seen in the area (a floor: the camera shows part of the box)`,
  );
  t.freekick.bands.forEach((b, i) =>
    L.push(
      `  free kicks ${['under 20 m', '20 to 26 m', '26 to 32 m', '32 to 40 m'][i].padEnd(11)} ${String(b.n).padStart(4)}: ${(b.direct * 100).toFixed(0)}% shots, wall seen in ${(b.wallShare * 100).toFixed(0)}%: ${b.wallMen} men, ${b.wallDist} m from the ball`,
    ),
  );
  L.push(
    `  throw-ins by third ${t.throwin.byThird.map((v) => (v * 100).toFixed(0) + '%').join(' / ')}; layouts ${t.throwin.layouts.map((l) => l.length).join(' / ')}; goal-kick layouts ${t.goalkick.layouts.length}`,
  );
  L.push(
    `  take-ons ${t.takeons.perMatch} a match, ${(t.takeons.won * 100).toFixed(0)}% won; by third ${t.takeons.zones.map((z) => (z.share * 100).toFixed(0) + '% (' + (z.won * 100).toFixed(0) + '% won)').join(', ')}`,
  );
  L.push(
    `  shots ${t.shots.perMatch} a match, ${(t.shots.goal * 100).toFixed(1)}% goals, mean xG ${t.shots.meanXg}; open-play shots seen: ${t.shots.inFrame}, ${t.shots.attackersInArea} attackers and ${t.shots.defendersInArea} defenders in the area, nearest defender ${t.shots.nearestDefender} m (visible players only)`,
  );
  c.zones.forEach((z, i) =>
    L.push(
      `  carries ${names[i].padEnd(12)} ${z.carried} of ${z.receptions} receptions (${(z.share * 100).toFixed(1)}%) carried 4 m or more, median ${z.median} m, 90th ${z.p90} m, ${(z.forward * 100).toFixed(0)}% forward; short touches ${(z.shortShare * 100).toFixed(1)}%`,
    ),
  );
  return L.join(LF);
}

function main() {
  if (!args.data || args.data === true) {
    console.log(
      'usage: node --max-old-space-size=4096 tools/statsbomb-events.mjs --data <folder with events/, three-sixty/, matches/> [--matches N] [--write]',
    );
    process.exit(1);
  }
  const dir = path.resolve(String(args.data)),
    ev = path.join(dir, 'events'),
    th = path.join(dir, 'three-sixty');
  const ids = fs
    .readdirSync(th)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''))
    .slice(0, +args.matches || 9999);
  const acc = newAcc();
  for (const id of ids) {
    const f = path.join(ev, `${id}.json`);
    if (!fs.existsSync(f)) continue;
    readMatch(
      JSON.parse(fs.readFileSync(f, 'utf8')),
      JSON.parse(fs.readFileSync(path.join(th, `${id}.json`), 'utf8')),
      acc,
    );
    if (acc.matches % 50 === 0) console.log(`  ${acc.matches} matches`);
  }
  const t = build(acc),
    c = carriesTable(acc);
  console.log(report(t, c));
  if (!args.write) return;
  // the layouts go to their own file for the match view (js/layouts.js, data/layout-table.json)
  const lay = {
    source: t.source,
    built: t.built,
    matches: t.matches,
    perMatch: t.perMatch,
    corner: t.corner,
    freekick: t.freekick,
    throwin: t.throwin,
    goalkick: t.goalkick,
    shots: t.shots,
    takeons: t.takeons,
  };
  fs.writeFileSync(path.join(ROOT, 'data/layout-table.json'), JSON.stringify(lay));
  fs.writeFileSync(
    path.join(ROOT, 'js/layouts.js'),
    [
      "// Generated by tools/statsbomb-events.mjs (npm run layouts) from the StatsBomb open data (299 men's matches with 360 data; derived figures only)",
      '// Where the visible players stand at corners, free kicks, throw-ins and goal kicks (read by the match view in js/matchmotion.js).',
      '(function () {',
      `  window.FM.D.LAYOUTS = ${JSON.stringify(lay)};`,
      '})();',
      '',
    ].join(LF),
  );
  // the carries: the StatsBomb measure joins the DFL and PFF at equal weight in the carry table
  const file = path.join(ROOT, 'data/carry-table.json');
  const table = JSON.parse(fs.readFileSync(file, 'utf8'));
  const srcs = table.carries.sources || {};
  srcs.statsbomb = c;
  const list = [srcs.dfl, srcs.pff, srcs.statsbomb].filter(Boolean);
  const nSrc = list.length;
  const zones = [0, 1, 2].map((z) => {
    const zs = list.map((s) => s.zones[z]),
      sample = zs.flatMap((s, k) => s.sample.filter((_, i) => i % nSrc === k % nSrc)),
      len = sample.map(([dx, dy]) => Math.hypot(dx, dy)),
      shortS = srcs.statsbomb.zones[z].shortSample;
    void shortS;
    return {
      receptions: zs.reduce((a, s) => a + s.receptions, 0),
      carried: zs.reduce((a, s) => a + s.carried, 0),
      share: +mean(zs.map((s) => s.share)).toFixed(3),
      median: r1(q(len, 0.5)),
      p90: r1(q(len, 0.9)),
      forward: +(sample.filter(([dx]) => dx > 1).length / Math.max(1, sample.length)).toFixed(3),
      holdMedian: r1(mean(zs.map((s) => s.holdMedian).filter((v) => v))),
      sample,
    };
  });
  const keep = table.carries;
  table.carries = {
    matches: list.reduce((a, s) => a + s.matches, 0),
    zones,
    note: 'the DFL, PFF and StatsBomb measures with equal weight (see tools/tracking-carries.mjs and tools/statsbomb-events.mjs)',
    sources: srcs,
    speed: keep.speed,
    previous: keep.previous,
    short: keep.short,
  };
  table.sbEvents = { takeons: t.takeons, shots: t.shots, perMatch: t.perMatch };
  // the take-ons: Wyscout (tools/wyscout-takeons.mjs), StatsBomb and PFF count them differently (27, 30 and 30 a match; 60%, 54% and 51%
  // won), so the table takes their mean: the count and the share won from the three, the places from Wyscout and StatsBomb
  const wy = table.takeons.sources ? table.takeons.sources.wyscout : table.takeons,
    pf = table.pffEvents && table.pffEvents.takeons;
  const per = [wy.perMatch, t.takeons.perMatch, pf && pf.perMatch].filter((v) => v);
  const won = [wy.won, t.takeons.won, pf && pf.carrierWins].filter((v) => v);
  table.takeons = {
    matches: wy.matches,
    perMatch: r1(mean(per)),
    won: +mean(won).toFixed(3),
    zones: wy.zones.map((z, i) => ({
      share: +((z.share + t.takeons.zones[i].share) / 2).toFixed(3),
      won: +((z.won + t.takeons.zones[i].won) / 2).toFixed(3),
    })),
    lanes: wy.lanes,
    sources: { wyscout: wy, statsbomb: t.takeons, pff: pf },
  };
  table.source = table.source.split('; StatsBomb')[0] + '; StatsBomb open data (derived figures only)';
  fs.writeFileSync(file, JSON.stringify(table));
  const jsFile = path.join(ROOT, 'js/carries.js');
  const js = fs.readFileSync(jsFile, 'utf8').split(LF);
  const i = js.findIndex((l) => l.startsWith('  window.FM.D.CARRIES = '));
  js[i] = `  window.FM.D.CARRIES = ${JSON.stringify(table)};`;
  fs.writeFileSync(jsFile, js.join(LF));
  console.log(
    '\nWrote data/layout-table.json, js/layouts.js, and the carries into data/carry-table.json and js/carries.js',
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
