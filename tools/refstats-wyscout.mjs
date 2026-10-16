// The Wyscout half of the reference table (tools/refstats.mjs --wyscout <folder with events_*.json>): per 90 minutes, the average
// and spread of the counts the two providers define alike (goals, assists, shots, completed passes, pass completion, key passes,
// progressive passes) for each outfield position group, from the five league seasons of the Wyscout public soccer-event dataset
// (Pappalardo and Massucco, 2019, CC BY 4.0, https://doi.org/10.6084/m9.figshare.c.4415000): 1,826 matches, 2017/18.
//
// The events file has no line-ups, positions or minutes, so they are worked out:
//   position  from where a player acts: his average depth (x, from his own goal) and how far from the middle of the pitch (y); a
//             keeper is whoever makes save attempts or leaves his line. Depth under 38 is a defender (a full-back if wide), 38 to
//             47 a defensive midfielder (a full-back if wide), 47 to 55 a central midfielder (a winger if wide), 55 to 62 an
//             attacking midfielder (a winger if wide), over 62 a striker (a winger if wide).
//   minutes   the span between a player's first and last action in each half, a minute added at each end, then every side's
//             players scaled so that a match adds up to 990 minutes (eleven men for ninety).
// Tackles, interceptions, clearances, dribbles and aerial duels are not taken from here: the providers count them differently.
import fs from 'node:fs';
import path from 'node:path';

const LEAGUES = ['England', 'France', 'Germany', 'Italy', 'Spain'];
const SUMS = ['gls', 'ast', 'sh', 'pas', 'att', 'kp', 'prg'];
const toGoal = ([x, y]) => Math.hypot(120 - x, 40 - y);
const progressive = (from, to) => {
  const d = toGoal(from) - toGoal(to);
  if (from[0] < 60 && to[0] < 60) return d >= 30;
  if (from[0] < 60 && to[0] >= 60) return d >= 15;
  return d >= 10;
};
const has = (e, id) => e.tags.some((t) => t.id === id);
const groupOf = (depth, width) => {
  const wide = width > 28;
  if (depth < 38) return wide ? 'FB' : 'CB';
  if (depth < 47) return wide ? 'FB' : 'DM';
  if (depth < 55) return wide ? 'W' : 'CM';
  if (depth < 62) return wide ? 'W' : 'AM';
  return wide ? 'W' : 'ST';
};

export function wyscoutGroups(dir, min = 450) {
  const out = {};
  let matches = 0;
  for (const lg of LEAGUES) {
    const ev = JSON.parse(fs.readFileSync(path.join(dir, `events_${lg}.json`), 'utf8'));
    const players = {}; // id → { depth, width, n, gk, minutes, ...sums }
    const spans = {}; // matchId|teamId|playerId|period → [first, last]
    for (const e of ev) {
      const id = `${lg}${e.playerId}`;
      if (!e.playerId) continue;
      const p = (players[id] = players[id] || {
        n: 0,
        depth: 0,
        width: 0,
        gk: 0,
        minutes: 0,
        ...Object.fromEntries(SUMS.map((s) => [s, 0])),
      });
      const k = `${e.matchId}|${e.teamId}|${id}|${e.matchPeriod}`;
      const s = spans[k];
      if (!s) spans[k] = [e.eventSec, e.eventSec];
      else {
        if (e.eventSec < s[0]) s[0] = e.eventSec;
        if (e.eventSec > s[1]) s[1] = e.eventSec;
      }
      if (e.eventId === 9 || e.eventId === 4) p.gk++;
      if (e.positions && e.positions[0] && e.eventId !== 3) {
        p.depth += e.positions[0].x;
        p.width += Math.abs(e.positions[0].y - 50);
        p.n++;
      }
      const shot = e.eventId === 10 || (e.eventId === 3 && (e.subEventId === 33 || e.subEventId === 35));
      if (shot) {
        p.sh++;
        if (has(e, 101)) p.gls++;
      }
      if (e.eventId === 8 || (e.eventId === 3 && (e.subEventId === 30 || e.subEventId === 31 || e.subEventId === 32))) {
        if (has(e, 301)) p.ast++;
        if (has(e, 302)) p.kp++;
      }
      if (e.eventId === 8) {
        p.att++;
        if (has(e, 1801)) {
          p.pas++;
          const [a, b] = e.positions || [];
          if (a && b && progressive([a.x * 1.2, a.y * 0.8], [b.x * 1.2, b.y * 0.8])) p.prg++;
        }
      }
    }
    // minutes: the spans, scaled to eleven men for ninety per side
    const sideSum = {};
    const mins = {};
    for (const [k, [a, b]] of Object.entries(spans)) {
      const [m, t, id] = k.split('|');
      const v = (b - a) / 60 + 2;
      mins[`${m}|${t}|${id}`] = (mins[`${m}|${t}|${id}`] || 0) + v;
      sideSum[`${m}|${t}`] = (sideSum[`${m}|${t}`] || 0) + v;
    }
    for (const [k, v] of Object.entries(mins)) {
      const [m, t, id] = k.split('|');
      const f = Math.min(1.6, Math.max(0.8, 990 / sideSum[`${m}|${t}`]));
      players[id].minutes += v * f;
    }
    matches += new Set(ev.map((e) => e.matchId)).size;
    out[lg] = players;
  }
  // per group
  const by = {};
  for (const lg of LEAGUES)
    for (const p of Object.values(out[lg])) {
      if (p.gk >= 3 || p.n < 30) continue;
      const g = groupOf(p.depth / p.n, p.width / p.n);
      (by[g] = by[g] || []).push(p);
    }
  const per90 = {
    gls: (a) => (a.gls * 90) / a.minutes,
    ast: (a) => (a.ast * 90) / a.minutes,
    sh: (a) => (a.sh * 90) / a.minutes,
    pas: (a) => (a.pas * 90) / a.minutes,
    pct: (a) => (a.att ? (a.pas * 100) / a.att : null),
    kp: (a) => (a.kp * 90) / a.minutes,
    prg: (a) => (a.prg * 90) / a.minutes,
  };
  const groups = {};
  for (const [g, list] of Object.entries(by)) {
    const rows = list.filter((p) => p.minutes >= min);
    const pooled = { minutes: 0, ...Object.fromEntries(SUMS.map((s) => [s, 0])) };
    for (const p of list) for (const k of ['minutes', ...SUMS]) pooled[k] += p[k];
    const G = { players: rows.length, minutes: Math.round(pooled.minutes) };
    for (const [m, fn] of Object.entries(per90)) {
      const mean = fn(pooled);
      const vals = rows.map((a) => [fn(a), a.minutes]).filter(([v]) => v != null);
      if (vals.length < 8) continue;
      const w = vals.reduce((n, [, x]) => n + x, 0);
      const mu = vals.reduce((n, [v, x]) => n + v * x, 0) / w;
      const sd = Math.sqrt(vals.reduce((n, [v, x]) => n + x * (v - mu) ** 2, 0) / w);
      G[m] = [mean, sd];
    }
    groups[g] = G;
  }
  return { matches, groups };
}

// Put the Wyscout figures into a table made from the StatsBomb data: the four counts the providers define alike, each the average of
// the two sources by minutes, the spread pooled. (tools/refstats.mjs --wyscout, or tools/refstats-merge.mjs on the shipped table)
export function mergeWyscout(out, wy, round = (v) => Math.round(v * 100) / 100) {
  if (out.meta.wyscout)
    throw new Error('This table already has the Wyscout figures in it: make it again from the StatsBomb data');
  out.meta.wyscout = {
    matches: wy.matches,
    source: 'Wyscout public soccer-event dataset (CC BY 4.0)',
    metrics: ['gls', 'ast', 'sh', 'pct'],
  };
  for (const [g, G] of Object.entries(out.groups)) {
    const w = wy.groups[g];
    if (!w || g === 'GK') continue;
    G.playersWyscout = w.players;
    for (const m of ['gls', 'ast', 'sh', 'pct']) {
      if (!G[m] || !w[m]) continue;
      const [ma, sa] = G[m],
        [mb, sb] = w[m],
        wa = G.minutes,
        wb = w.minutes;
      const mean = (ma * wa + mb * wb) / (wa + wb);
      const sd = Math.sqrt((wa * (sa ** 2 + (ma - mean) ** 2) + wb * (sb ** 2 + (mb - mean) ** 2)) / (wa + wb));
      G[m] = [round(mean), round(Math.max(sd, 0.01))];
    }
  }
  return out;
}

if (process.argv[1] && process.argv[1].endsWith('refstats-wyscout.mjs')) {
  const dir = process.argv[2] || 'C:/Users/jerom/Downloads/wyscout-events2/data';
  const { matches, groups } = wyscoutGroups(dir);
  console.log(matches, 'matches');
  for (const [g, G] of Object.entries(groups))
    console.log(
      g.padEnd(3),
      String(G.players).padStart(4),
      ['gls', 'ast', 'sh', 'pas', 'pct', 'kp', 'prg']
        .map((m) => (G[m] ? `${m} ${G[m][0].toFixed(2)}/${G[m][1].toFixed(2)}` : '-'))
        .join('  '),
    );
}
