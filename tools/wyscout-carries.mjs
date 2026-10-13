// Builds the carry and restart tables the match view uses, from two open datasets. Only the tables are kept in the game.
//
//   node --max-old-space-size=6144 tools/wyscout-carries.mjs --data <Wyscout folder with events_*.json> --metrica <Metrica sample-data/data folder>
//        [--out data/carry-table.json] [--check]
//
// From the Metrica Sports sample data (https://github.com/metrica-sports/sample-data; the README asks to be responsible with the data and to
// acknowledge the source), game 3, whose events include carries (1,395 of them, with where each starts and ends):
//   carries:  how often a player who has received a pass takes the ball on before he plays it, and how far: by third of the pitch (own,
//             middle, final, in the direction the side attacks), the share of receptions followed by a carry of 4 m or more, and a
//             sample of those carries (metres forward and across), and how long the ball is held.
// From the Wyscout public soccer-event dataset (Pappalardo and Massucco, 2019, CC BY 4.0, https://doi.org/10.6084/m9.figshare.c.4415000):
//   takeons:  how often a player tries to take a man on, and how often it works (ground attacking duels with a take-on tag).
//   goalkick: how goal kicks are played: the share that go short (under 30 m) and a sample of where they land.
//   throwin:  where throw-ins are taken (how far up the pitch), how many a match, and how far they go.
//
// Wyscout gives the acting team's pitch with x from 0 (own goal) to 100 and y from 0 to 100 across; Metrica 0 to 1 on both axes; a
// 105 x 68 m pitch is assumed for both.
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
const L = 105,
  Wd = 68;
const has = (e, id) => e.tags.some((t) => t.id === id);
const r1 = (v) => Math.round(v * 10) / 10;
const q = (arr, p) => {
  const s = [...arr].sort((a, b) => a - b);
  return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : 0;
};
const spread = (sorted, n, f) => {
  const out = [];
  for (let k = 0; k < n && sorted.length; k++) out.push(f(sorted[Math.floor(((k + 0.5) * sorted.length) / n)]));
  return out;
};

// ---------- Wyscout: take-ons, goal kicks, throw-ins ----------
export function readWyscout(file, acc) {
  const ev = JSON.parse(fs.readFileSync(file, 'utf8'));
  const matches = new Set();
  for (const A of ev) {
    matches.add(A.matchId);
    const pos = A.positions;
    if (!pos || !pos[0]) continue;
    if (A.eventName === 'Free Kick' && A.subEventName === 'Goal kick' && pos.length >= 2)
      acc.gk.push([
        pos[1].x,
        pos[1].y,
        ((pos[1].x - pos[0].x) * L) / 100,
        ((pos[1].y - pos[0].y) * Wd) / 100,
        has(A, 1801) ? 1 : 0,
      ]);
    if (A.eventName === 'Free Kick' && A.subEventName === 'Throw in' && pos.length >= 2)
      acc.throws.push([pos[0].x, pos[0].y, ((pos[1].x - pos[0].x) * L) / 100, ((pos[1].y - pos[0].y) * Wd) / 100]);
    // a ground attacking duel with a take-on tag (503 left, 504 right), won (703)
    if (A.eventName === 'Duel' && A.subEventName === 'Ground attacking duel' && (has(A, 503) || has(A, 504))) {
      acc.takeons++;
      if (has(A, 703)) acc.takeonsWon++;
    }
  }
  acc.matches += matches.size;
}

// ---------- Metrica: carries after a reception ----------
export function readMetricaCarries(file, acc) {
  const d = JSON.parse(fs.readFileSync(file, 'utf8')).data;
  // the way each side attacks in each half: the two sides' passes drift opposite ways, forward more than back
  const drift = {};
  for (const e of d)
    if (e.type.name === 'PASS' && e.end.x != null) {
      const k = `${e.team.id}:${e.period}`;
      drift[k] = (drift[k] || 0) + (e.end.x - e.start.x);
    }
  const dir = (team, period) => {
    const mine = drift[`${team}:${period}`] || 0,
      other = Object.entries(drift).find(([k]) => k.endsWith(`:${period}`) && !k.startsWith(`${team}:`));
    return mine - (other ? other[1] : 0) >= 0 ? 1 : -1;
  };
  for (let i = 0; i < d.length; i++) {
    const P = d[i];
    if (P.type.name !== 'PASS' || !P.to || P.end.x == null) continue;
    const who = P.to.id,
      dr = dir(P.team.id, P.period);
    // the carries by the receiver straight after (nothing else in between)
    let j = i + 1,
      start = null,
      end = null,
      secs = 0;
    for (; j < d.length && d[j].type.name === 'CARRY' && d[j].from && d[j].from.id === who; j++) {
      if (!start) start = d[j].start;
      end = d[j].end;
      secs += d[j].end.time - d[j].start.time;
    }
    const ax = dr > 0 ? P.end.x : 1 - P.end.x,
      zone = ax < 1 / 3 ? 0 : ax < 2 / 3 ? 1 : 2;
    acc.rec[zone]++;
    if (!start) continue;
    const dx = (end.x - start.x) * L * dr,
      dy = (end.y - start.y) * Wd,
      m = Math.hypot(dx, dy);
    if (m >= 4 && m <= 45) acc.carries[zone].push([r1(dx), r1(dy), r1(secs)]);
  }
}

export function buildTable(acc) {
  const zones = [0, 1, 2].map((z) => {
    const c = acc.carries[z];
    const len = c.map(([dx, dy]) => Math.hypot(dx, dy));
    const sorted = [...c].sort((a, b) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1]));
    return {
      receptions: acc.rec[z],
      carried: c.length,
      share: +(c.length / Math.max(1, acc.rec[z])).toFixed(3),
      median: r1(q(len, 0.5)),
      p90: r1(q(len, 0.9)),
      forward: +(c.filter(([dx]) => dx > 1).length / Math.max(1, c.length)).toFixed(3),
      sample: spread(sorted, 60, (s) => [s[0], s[1]]),
    };
  });
  const gk = acc.gk,
    shortGk = gk.filter((g) => Math.hypot(g[2], g[3]) < 30),
    longGk = gk.filter((g) => Math.hypot(g[2], g[3]) >= 30);
  const th = acc.throws;
  return {
    source:
      'Derived from the Wyscout public soccer-event dataset (Pappalardo and Massucco, 2019, CC BY 4.0, https://doi.org/10.6084/m9.figshare.c.4415000) and the Metrica Sports sample data (https://github.com/metrica-sports/sample-data)',
    built: new Date().toISOString().slice(0, 10),
    matches: acc.matches,
    carries: {
      zones,
      note: 'from Metrica sample game 3: a reception followed by a carry of 4 m or more, by third of the pitch in the side’s attacking direction',
    },
    takeons: {
      perMatch: +(acc.takeons / acc.matches).toFixed(1),
      won: +(acc.takeonsWon / Math.max(1, acc.takeons)).toFixed(3),
    },
    goalkick: {
      n: gk.length,
      perMatch: +(gk.length / acc.matches).toFixed(1),
      short: +(shortGk.length / Math.max(1, gk.length)).toFixed(3),
      // the landing place (x along the pitch 0 to 1, y across 0 to 1) of long kicks and of short ones
      long: spread(
        [...longGk].sort((a, b) => a[0] - b[0]),
        60,
        (g) => [g[0] / 100, g[1] / 100],
      ),
      shortTo: spread(
        [...shortGk].sort((a, b) => a[0] - b[0]),
        40,
        (g) => [g[0] / 100, g[1] / 100],
      ),
    },
    throwin: {
      n: th.length,
      perMatch: +(th.length / acc.matches).toFixed(1),
      // where along the pitch they are taken (own goal 0 to the opponent's goal 1), by tenth
      byTenth: Array.from(
        { length: 10 },
        (_, k) =>
          +(th.filter((t) => Math.min(9, Math.floor(t[0] / 10)) === k).length / Math.max(1, th.length)).toFixed(3),
      ),
      inFinalThird: +(th.filter((t) => t[0] > 66.7).length / Math.max(1, th.length)).toFixed(3),
      length: r1(
        q(
          th.map((t) => Math.hypot(t[2], t[3])),
          0.5,
        ),
      ),
    },
  };
}

export function report(t) {
  const names = ['own third', 'middle third', 'final third'];
  const out = [`Wyscout: ${t.matches} matches`];
  t.carries.zones.forEach((z, i) =>
    out.push(
      `  carries, ${names[i].padEnd(12)}: ${z.carried} of ${z.receptions} receptions (${(z.share * 100).toFixed(1)}%) followed by a carry of 4 m or more; median ${z.median} m, 90th ${z.p90} m, ${(z.forward * 100).toFixed(0)}% forward`,
    ),
  );
  out.push(`  take-ons: ${t.takeons.perMatch} a match, ${(t.takeons.won * 100).toFixed(0)}% won`);
  out.push(`  goal kicks: ${t.goalkick.perMatch} a match, ${(t.goalkick.short * 100).toFixed(0)}% short (under 30 m)`);
  out.push(
    `  throw-ins: ${t.throwin.perMatch} a match, ${(t.throwin.inFinalThird * 100).toFixed(0)}% in the final third, median length ${t.throwin.length} m`,
  );
  return out.join('\n');
}

function main() {
  if (!args.data || args.data === true || !args.metrica || args.metrica === true) {
    console.log(
      'usage: node --max-old-space-size=6144 tools/wyscout-carries.mjs --data <Wyscout events_*.json folder> --metrica <Metrica sample-data/data folder>',
    );
    process.exit(1);
  }
  const dir = path.resolve(String(args.data)),
    files = fs.readdirSync(dir).filter((f) => /^events_.*\.json$/.test(f));
  if (!files.length) {
    console.error(`No events_*.json files in ${dir}`);
    process.exit(1);
  }
  const m3 = path.join(path.resolve(String(args.metrica)), 'Sample_Game_3', 'Sample_Game_3_events.json');
  if (!fs.existsSync(m3)) {
    console.error(`No ${m3}`);
    process.exit(1);
  }
  const acc = { matches: 0, rec: [0, 0, 0], carries: [[], [], []], gk: [], throws: [], takeons: 0, takeonsWon: 0 };
  for (const f of files) {
    readWyscout(path.join(dir, f), acc);
    console.log(`  ${f}: ${acc.matches} matches so far`);
  }
  readMetricaCarries(m3, acc);
  const table = buildTable(acc);
  console.log(report(table));
  if (args.check) return;
  const out = path.resolve(ROOT, String(args.out && args.out !== true ? args.out : 'data/carry-table.json'));
  fs.writeFileSync(out, JSON.stringify(table));
  fs.writeFileSync(
    path.join(ROOT, 'js/carries.js'),
    [
      '// Generated by tools/wyscout-carries.mjs (npm run carries) from the Wyscout public soccer-event dataset (CC BY 4.0, https://doi.org/10.6084/m9.figshare.c.4415000) and the Metrica Sports sample data',
      '// How far and how often players carry the ball, and how goal kicks and throw-ins are taken (read by the match view in js/matchmotion.js and Match.circulate in js/engine.js).',
      '(function () {',
      `  window.FM.D.CARRIES = ${JSON.stringify(table)};`,
      '})();',
      '',
    ].join('\n'),
  );
  console.log(
    `\nWrote ${path.relative(ROOT, out)} and js/carries.js (${(fs.statSync(out).size / 1024).toFixed(1)} KB)`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
