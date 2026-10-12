// Builds the set-piece table the match engine and view use from the Wyscout public soccer-event dataset (Pappalardo and Massucco, 2019,
// CC BY 4.0, https://doi.org/10.6084/m9.figshare.c.4415000). Only the table is kept in the game.
//
//   node --max-old-space-size=6144 tools/wyscout-setpieces.mjs --data <folder with events_*.json> [--out data/setpiece-table.json] [--check]
//
//   corner: how corners are taken: how many a match, how often they are played short, where the delivery goes (near post, middle,
//           far post, or out to the edge of the area), who gets the first touch (the attackers, the defenders, the keeper), what
//           follows (a shot, a clearance, a foul, the ball out, the move carried on), how often a corner ends in a shot and a goal
//           by where it went, and a sample of the corners that did end in a shot as [delivery x, delivery y, shot x, shot y, xG,
//           header], so the engine can take the delivery and the shot of one real corner together.
//   freeKick: where free kicks are taken from (by distance to goal and by how central they are) and what is done with them: a
//           shot, a cross, or a pass; and the places direct shots are taken from and how often they score.
//   penalty: how often a penalty scores.
// All positions are as Wyscout has them (percentages of the pitch from the taking team's side, attacking toward x = 100; y across)
// turned into metres on a 105 x 68 pitch, and the delivery turned so that the corner is taken from the y = 0 side.
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
export const L = 105,
  Wd = 68;
const PERIOD = { '1H': 0, '2H': 1, E1: 2, E2: 3, P: 4 };
const has = (e, id) => e.tags.some((t) => t.id === id);
const WINDOW_S = 10; // seconds after a dead ball in which a shot still comes from it
const SHORT_M = 12; // a corner or free kick played less far than this is a short one
const r3 = (v) => Math.round(v * 1000) / 1000;

// A corner's delivery turned so the corner is taken from the y = 0 side: x in metres from the goal line, y in metres from the
// taking side's touchline across the pitch (0 to 68)
export const norm = (p, flip) => ({ x: (100 - p.x) * (L / 100), y: (flip ? 100 - p.y : p.y) * (Wd / 100) });
// where a delivery landed, from the near post (the side of the corner) to the far post and out to the edge of the area
export function zoneOf(del, dist) {
  if (dist < SHORT_M) return 'short';
  if (del.x > 16.5) return 'edge'; // beyond the edge of the box
  const lat = del.y - 34 + 0; // centre line
  // the near side is the side the corner is taken from (y < 34 after the turn)
  const toward = 34 - del.y; // positive: nearer the corner's touchline
  void lat;
  if (toward > 5.5) return 'near';
  if (toward < -5.5) return 'far';
  return 'centre';
}

// ---------- Reading ----------
export function readFile(file, acc) {
  const ev = JSON.parse(fs.readFileSync(file, 'utf8'));
  const by = new Map();
  for (const e of ev) {
    let a = by.get(e.matchId);
    if (!a) by.set(e.matchId, (a = []));
    a.push(e);
  }
  for (const [, list] of by) {
    list.sort((a, b) => (PERIOD[a.matchPeriod] ?? 9) - (PERIOD[b.matchPeriod] ?? 9) || a.eventSec - b.eventSec);
    acc.matches++;
    for (let i = 0; i < list.length; i++) {
      const e = list[i];
      if (e.eventName === 'Free Kick' && e.positions && e.positions.length >= 2) {
        const [a, b] = e.positions;
        if (e.subEventName === 'Corner') acc.corners.push(corner(list, i, a, b));
        else if (
          e.subEventName === 'Free kick cross' ||
          e.subEventName === 'Free Kick' ||
          e.subEventName === 'Free kick shot'
        )
          acc.fks.push(freeKick(list, i, a, b));
      }
      if (e.subEventName === 'Penalty') acc.pens.push({ goal: has(e, 101) });
      else if (e.subEventName === 'Free kick shot' && e.positions && e.positions[0]) {
        const p = e.positions[0];
        acc.fkShots.push({ x: p.x, y: p.y, ...geom(p.x, p.y), head: false, fk: true, goal: has(e, 101) });
      }
    }
  }
}
// What happens after a dead ball: the events of the next seconds, in order
const after = (list, i) => {
  const out = [];
  for (let k = i + 1; k < list.length && out.length < 8; k++) {
    if (list[k].matchPeriod !== list[i].matchPeriod || list[k].eventSec - list[i].eventSec > WINDOW_S) break;
    out.push(list[k]);
  }
  return out;
};
function corner(list, i, a, b) {
  const e = list[i],
    flip = a.y > 50,
    st = norm(a, flip),
    del = norm(b, flip),
    dist = Math.hypot(del.x - st.x, del.y - st.y);
  const next = after(list, i);
  // the first touch: a duel (the winner), a clearance (the defenders), a shot or a pass by the taking team, the keeper coming out
  let first = null;
  for (const n of next) {
    if (n.eventName === 'Duel') {
      const won = has(n, 703),
        lost = has(n, 701);
      if (won || lost) {
        first = (n.teamId === e.teamId) === won ? 'attack' : 'defence';
        break;
      }
    } else if (n.eventName === 'Others on the ball' && n.subEventName === 'Clearance') {
      first = n.teamId === e.teamId ? 'attack' : 'defence';
      break;
    } else if (n.eventName === 'Shot' || (n.eventName === 'Pass' && n.teamId === e.teamId)) {
      first = n.teamId === e.teamId ? 'attack' : 'defence';
      break;
    } else if (n.eventName === 'Goalkeeper leaving line' || n.eventName === 'Save attempt') {
      first = 'keeper';
      break;
    } else if (n.eventName === 'Pass' || n.eventName === 'Others on the ball') {
      first = n.teamId === e.teamId ? 'attack' : 'defence';
      break;
    }
  }
  // what follows within the window
  const shot = next.find((n) => n.eventName === 'Shot' && n.teamId === e.teamId);
  const clear = next.find(
    (n) => n.eventName === 'Others on the ball' && n.subEventName === 'Clearance' && n.teamId !== e.teamId,
  );
  const foul = next.find((n) => n.eventName === 'Foul' || n.eventName === 'Offside');
  const out = next.find((n) => n.eventName === 'Interruption');
  let res = shot ? 'shot' : clear ? 'clearance' : foul ? 'foul' : out ? 'out' : 'other';
  let rec = { zone: zoneOf(del, dist), res, first, start: st, del, dist };
  if (shot && shot.positions && shot.positions[0]) {
    const sp = norm(shot.positions[0], false);
    rec.shot = {
      x: (100 - shot.positions[0].x) * (L / 100),
      y: (flip ? 100 - shot.positions[0].y : shot.positions[0].y) * (Wd / 100),
      ...geom(shot.positions[0].x, shot.positions[0].y),
      head: has(shot, 403),
      fk: false,
      goal: has(shot, 101),
    };
    void sp;
  }
  return rec;
}
function freeKick(list, i, a, b) {
  const e = list[i],
    g = geom(a.x, a.y),
    dist = Math.hypot((b.x - a.x) * (L / 100), (b.y - a.y) * (Wd / 100));
  const next = after(list, i);
  const kind =
    e.subEventName === 'Free kick shot'
      ? 'shot'
      : e.subEventName === 'Free kick cross'
        ? 'cross'
        : dist < 30 && e.subEventName === 'Free Kick'
          ? 'pass'
          : 'pass';
  const shotAfter = kind !== 'shot' && next.find((n) => n.eventName === 'Shot' && n.teamId === e.teamId);
  return {
    kind,
    dist: g.dist,
    central: Math.abs(a.y - 50) * (Wd / 100) < 9,
    x: a.x,
    y: a.y,
    shotAfter: !!shotAfter,
    goalAfter: !!(shotAfter && has(shotAfter, 101)),
  };
}

// ---------- The table ----------
const share = (arr, f) => arr.filter(f).length / (arr.length || 1);
export function buildTable(acc, w) {
  const C = acc.corners,
    nonShort = C.filter((c) => c.zone !== 'short');
  const zones = ['short', 'near', 'centre', 'far', 'edge'];
  const zone = {};
  for (const z of zones) {
    const cs = C.filter((c) => c.zone === z);
    zone[z] = {
      share: r3(cs.length / C.length),
      shotRate: r3(share(cs, (c) => c.res === 'shot')),
      goalRate: r3(share(cs, (c) => c.shot && c.shot.goal)),
      firstAttack: r3(share(cs, (c) => c.first === 'attack')),
      firstDefence: r3(share(cs, (c) => c.first === 'defence')),
      clearRate: r3(share(cs, (c) => c.res === 'clearance')),
    };
  }
  const withShot = C.filter((c) => c.shot);
  const step = Math.max(1, withShot.length / 150),
    sample = [];
  for (let i = 0; i < 150 && Math.floor(i * step) < withShot.length; i++) {
    const c = withShot[Math.floor(i * step)];
    sample.push([
      r3(c.del.x),
      r3(c.del.y),
      r3(c.shot.x),
      r3(c.shot.y),
      r3(prob(w, c.shot)),
      c.shot.head ? 1 : 0,
      zones.indexOf(c.zone),
    ]);
  }
  sample.sort((a, b) => a[4] - b[4]);
  const firsts = ['attack', 'defence', 'keeper'].map((k) => r3(share(C, (c) => c.first === k)));
  const results = ['shot', 'clearance', 'foul', 'out', 'other'].map((k) => r3(share(C, (c) => c.res === k)));
  // free kicks: by distance bands, what is done with them
  const FK = acc.fks,
    bands = [
      [0, 20],
      [20, 25],
      [25, 30],
      [30, 40],
      [40, 130],
    ];
  const fk = bands.map(([lo, hi]) => {
    const f = FK.filter((x) => x.dist >= lo && x.dist < hi);
    return {
      from: lo,
      to: hi,
      n: f.length,
      shot: r3(share(f, (x) => x.kind === 'shot')),
      cross: r3(share(f, (x) => x.kind === 'cross')),
      pass: r3(share(f, (x) => x.kind === 'pass')),
    };
  });
  const sh = acc.fkShots,
    goalRate = share(sh, (s) => s.goal);
  const step2 = Math.max(1, sh.length / 100);
  const fkSample = [];
  for (let i = 0; i < 100 && Math.floor(i * step2) < sh.length; i++) {
    const s = sh[Math.floor(i * step2)];
    fkSample.push([r3(s.x / 100), r3(Math.abs(s.y / 100 - 0.5) + 0.5), r3(prob(w, s))]);
  }
  return {
    source:
      'Derived from the Wyscout public soccer-event dataset (Pappalardo and Massucco, 2019, CC BY 4.0, https://doi.org/10.6084/m9.figshare.c.4415000)',
    built: new Date().toISOString().slice(0, 10),
    matches: acc.matches,
    corner: {
      n: C.length,
      perMatch: r3(C.length / acc.matches),
      zones: zone,
      zoneNames: zones,
      firstTouch: { attack: firsts[0], defence: firsts[1], keeper: firsts[2] },
      result: { shot: results[0], clearance: results[1], foul: results[2], out: results[3], other: results[4] },
      shotRate: r3(share(C, (c) => c.res === 'shot')),
      goalPerCorner: r3(share(C, (c) => c.shot && c.shot.goal)),
      goalPerShot: r3(withShot.filter((c) => c.shot.goal).length / (withShot.length || 1)),
      headShare: r3(share(withShot, (c) => c.shot.head)),
      sample: {
        note: '[delivery x, delivery y, shot x, shot y, xG, header, zone index]: metres from the goal line, and across from the corner side',
        rows: sample,
      },
      nonShortShotRate: r3(share(nonShort, (c) => c.res === 'shot')),
    },
    freeKick: { n: FK.length, bands: fk, direct: { n: sh.length, goalRate: r3(goalRate), sample: fkSample } },
    penalty: { n: acc.pens.length, goalRate: r3(share(acc.pens, (p) => p.goal)) },
  };
}
export function report(t) {
  const c = t.corner,
    out = [`${t.matches} matches`];
  out.push(
    `Corners: ${c.perMatch} a match; ${(c.shotRate * 100).toFixed(1)}% end in a shot, ${(c.goalPerCorner * 100).toFixed(1)}% in a goal (${(c.goalPerShot * 100).toFixed(1)}% of those shots score, ${(c.headShare * 100).toFixed(0)}% headers)`,
  );
  out.push(
    `  first touch: attackers ${(c.firstTouch.attack * 100).toFixed(0)}%, defenders ${(c.firstTouch.defence * 100).toFixed(0)}%, keeper ${(c.firstTouch.keeper * 100).toFixed(0)}%`,
  );
  out.push(
    `  what follows: ${Object.entries(c.result)
      .map(([k, v]) => `${k} ${(v * 100).toFixed(0)}%`)
      .join(', ')}`,
  );
  out.push('  delivery:        share   shot   goal  attackers first  cleared');
  for (const z of c.zoneNames) {
    const x = c.zones[z];
    out.push(
      `  ${z.padEnd(8)}         ${(x.share * 100).toFixed(0).padStart(3)}%   ${(x.shotRate * 100).toFixed(0).padStart(3)}%  ${(x.goalRate * 100).toFixed(1).padStart(4)}%        ${(x.firstAttack * 100).toFixed(0).padStart(3)}%         ${(x.clearRate * 100).toFixed(0).padStart(3)}%`,
    );
  }
  out.push(
    `Free kicks: ${t.freeKick.n}; direct shots score ${(t.freeKick.direct.goalRate * 100).toFixed(1)}% (${t.freeKick.direct.n} shots)`,
  );
  for (const b of t.freeKick.bands)
    out.push(
      `  ${String(b.from).padStart(3)}-${String(b.to).padEnd(3)} m  ${String(b.n).padStart(5)}  shot ${(b.shot * 100).toFixed(0).padStart(3)}%  cross ${(b.cross * 100).toFixed(0).padStart(3)}%  pass ${(b.pass * 100).toFixed(0).padStart(3)}%`,
    );
  out.push(`Penalties: ${t.penalty.n}, ${(t.penalty.goalRate * 100).toFixed(1)}% scored`);
  return out.join('\n');
}

async function main() {
  if (!args.data || args.data === true) {
    console.log(
      'usage: node --max-old-space-size=6144 tools/wyscout-setpieces.mjs --data <folder with events_*.json> [--out file] [--check]',
    );
    process.exit(1);
  }
  const dir = path.resolve(String(args.data)),
    files = fs.readdirSync(dir).filter((f) => /^events_.*\.json$/.test(f));
  if (!files.length) {
    console.error(`No events_*.json files in ${dir}`);
    process.exit(1);
  }
  const acc = { matches: 0, corners: [], fks: [], fkShots: [], pens: [] };
  for (const f of files) {
    readFile(path.join(dir, f), acc);
    console.log(`  ${f}: ${acc.matches} matches so far, ${acc.corners.length} corners`);
  }
  // the xG model, for the chance of each shot in the samples
  const shots = acc.corners
    .filter((c) => c.shot)
    .map((c) => c.shot)
    .concat(acc.fkShots);
  const w = fit(shots);
  const table = buildTable(acc, w);
  console.log(report(table));
  if (args.check) return;
  const out = path.resolve(ROOT, String(args.out && args.out !== true ? args.out : 'data/setpiece-table.json'));
  fs.writeFileSync(out, JSON.stringify(table));
  fs.writeFileSync(
    path.join(ROOT, 'js/setpieces.js'),
    [
      '// Generated by tools/wyscout-setpieces.mjs (npm run setpieces) from the Wyscout public soccer-event dataset, CC BY 4.0, https://doi.org/10.6084/m9.figshare.c.4415000',
      '// How corners and free kicks are taken and what comes of them (read by Match.chance in js/engine.js and the match view).',
      '(function () {',
      `  window.FM.D.SETPIECES = ${JSON.stringify(table)};`,
      '})();',
      '',
    ].join('\n'),
  );
  console.log(
    `\nWrote ${path.relative(ROOT, out)} and js/setpieces.js (${(fs.statSync(out).size / 1024).toFixed(1)} KB)`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
