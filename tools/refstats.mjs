// Builds the "typical player" table of the real-stats converter (js/realstats.js) from real data instead of estimates: for each
// of eight position groups (GK, CB, FB, DM, CM, AM, W, ST) the average and the spread, per 90 minutes, of goals, assists,
// expected goals and assists, shots, completed passes and pass completion, key passes, progressive passes, tackles,
// interceptions, clearances, dribbles, aerial duels, pressures, saves, save % and goals conceded.
//
//   node --max-old-space-size=4096 tools/refstats.mjs --data <folder with events/> [--min 300] [--write]
//
// From the StatsBomb open data (github.com/hudl/open-data; used with the permission the project's owner has; only the derived
// table is kept in the game, never the events): 299 men's matches (the World Cup 2022, Euro 2020 and 2024, La Liga 2020/21, Ligue 1
// 2021/22 and 2022/23, Bundesliga 2023/24, MLS 2023). Minutes and positions come from the starting line-ups, tactical shifts,
// substitutions and red cards of each match, so a player's minutes are counted in the position he played them; every event
// belongs to the position its player held at the time. Defensive counts (tackles, interceptions, clearances, pressures) are scaled
// by how much of the ball the opponent had, per match (0.5 / the opponent's share of the passes), so the typical defender of a team
// that rarely has the ball does not look better than one at a dominant team. A player enters a group's spread with at least --min
// minutes in it; the average is every minute played in the group.
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
const DATA = args.data || 'C:/Users/jerom/Downloads/statsbomb-open-data';
const MIN = +(args.min || 300);
const GROUP = {
  Goalkeeper: 'GK',
  'Center Back': 'CB',
  'Left Center Back': 'CB',
  'Right Center Back': 'CB',
  'Left Back': 'FB',
  'Right Back': 'FB',
  'Left Wing Back': 'FB',
  'Right Wing Back': 'FB',
  'Center Defensive Midfield': 'DM',
  'Left Defensive Midfield': 'DM',
  'Right Defensive Midfield': 'DM',
  'Center Midfield': 'CM',
  'Left Center Midfield': 'CM',
  'Right Center Midfield': 'CM',
  'Left Midfield': 'W',
  'Right Midfield': 'W',
  'Center Attacking Midfield': 'AM',
  'Left Attacking Midfield': 'AM',
  'Right Attacking Midfield': 'AM',
  'Left Wing': 'W',
  'Right Wing': 'W',
  'Center Forward': 'ST',
  'Left Center Forward': 'ST',
  'Right Center Forward': 'ST',
  'Secondary Striker': 'ST',
};
const SUMS = [
  'gls',
  'ast',
  'xg',
  'xa',
  'sh',
  'pas',
  'att',
  'kp',
  'prg',
  'tkl',
  'int',
  'clr',
  'drb',
  'aer',
  'prs',
  'sav',
  'ga',
];
const T = (e) => e.minute + (e.second || 0) / 60;

// ---- progressive pass (the FBref definition, in StatsBomb's 120 x 80 yards: the goal is at x = 120) ----
const toGoal = ([x, y]) => Math.hypot(120 - x, 40 - y);
const progressive = (from, to) => {
  const d = toGoal(from) - toGoal(to);
  if (from[0] < 60 && to[0] < 60) return d >= 30;
  if (from[0] < 60 && to[0] >= 60) return d >= 15;
  return d >= 10;
};

const agg = {}; // playerId|group → { minutes, ...sums }
let matches = 0;
const files = fs.readdirSync(path.join(DATA, 'events')).filter((f) => f.endsWith('.json'));
for (const f of files) {
  const ev = JSON.parse(fs.readFileSync(path.join(DATA, 'events', f), 'utf8'));
  matches++;
  const end = Math.max(...ev.filter((e) => e.period <= 4).map(T));
  // ---- who was on the pitch, in which position, from when to when ----
  const seg = {}; // playerId → [{ g, from, to }]
  const open = (id, pos, at, team) => {
    const g = GROUP[pos];
    (seg[id] = seg[id] || []).push({ g, pos, from: at, to: null, team });
  };
  const cur = (id) => (seg[id] || []).find((s) => s.to === null);
  const close = (id, at) => {
    const s = cur(id);
    if (s) s.to = at;
  };
  for (const e of ev) {
    const t = e.type.name;
    if (t === 'Starting XI') for (const l of e.tactics.lineup) open(l.player.id, l.position.name, 0, e.team.id);
    else if (t === 'Tactical Shift') {
      const at = T(e);
      for (const l of e.tactics.lineup) {
        const s = cur(l.player.id);
        if (!s) open(l.player.id, l.position.name, at, e.team.id);
        else if (s.pos !== l.position.name) {
          close(l.player.id, at);
          open(l.player.id, l.position.name, at, e.team.id);
        }
      }
    } else if (t === 'Substitution') {
      const at = T(e),
        s = cur(e.player.id);
      close(e.player.id, at);
      open(e.substitution.replacement.id, s ? s.pos : e.position.name, at, e.team.id);
    } else if (
      (t === 'Foul Committed' &&
        e.foul_committed &&
        e.foul_committed.card &&
        /Red|Second/.test(e.foul_committed.card.name)) ||
      (t === 'Bad Behaviour' && e.bad_behaviour && e.bad_behaviour.card && /Red|Second/.test(e.bad_behaviour.card.name))
    )
      close(e.player.id, T(e));
  }
  for (const id in seg) for (const s of seg[id]) if (s.to === null) s.to = end;
  // ---- possession per team (the share of the passes) ----
  const passes = {};
  for (const e of ev) if (e.type.name === 'Pass') passes[e.team.id] = (passes[e.team.id] || 0) + 1;
  const teams = Object.keys(passes);
  const total = teams.reduce((n, k) => n + passes[k], 0) || 1;
  const adj = {};
  for (const k of teams) adj[k] = 0.5 / Math.max(0.2, 1 - passes[k] / total);
  // ---- shots, to give an assist its expected value ----
  const xgOf = {};
  for (const e of ev) if (e.type.name === 'Shot') xgOf[e.id] = e.shot.statsbomb_xg || 0;
  // ---- the match's counts, per player and group ----
  const rec = (id, g) => {
    const k = `${id}|${g}`;
    return (agg[k] = agg[k] || { minutes: 0, ...Object.fromEntries(SUMS.map((s) => [s, 0])) });
  };
  for (const id in seg) for (const s of seg[id]) if (s.g) rec(id, s.g).minutes += Math.max(0, s.to - s.from);
  const goalsAgainst = []; // [team that conceded, time]
  for (const e of ev) {
    if (e.type.name === 'Shot' && e.shot.outcome.name === 'Goal' && e.period <= 4) {
      const other = teams.find((k) => +k !== e.team.id);
      if (other) goalsAgainst.push([+other, T(e)]);
    }
  }
  for (const e of ev) {
    if (!e.player || e.period > 4) continue;
    const g = GROUP[e.position && e.position.name];
    if (!g) continue;
    const r = rec(e.player.id, g),
      k = adj[e.team.id] || 1,
      t = e.type.name;
    if (t === 'Shot') {
      r.sh++;
      r.xg += e.shot.statsbomb_xg || 0;
      if (e.shot.outcome.name === 'Goal') r.gls++;
      if (e.shot.aerial_won) r.aer++;
    } else if (t === 'Pass') {
      const p = e.pass,
        done = !p.outcome;
      r.att++;
      if (done) {
        r.pas++;
        if (progressive(e.location, p.end_location)) r.prg++;
      }
      if (p.shot_assist || p.goal_assist) {
        r.kp++;
        if (p.assisted_shot_id) r.xa += xgOf[p.assisted_shot_id] || 0;
      }
      if (p.goal_assist) r.ast++;
      if (p.aerial_won) r.aer++;
    } else if (t === 'Duel') {
      if (e.duel.type && e.duel.type.name === 'Tackle') r.tkl += k;
    } else if (t === 'Interception') r.int += k;
    else if (t === 'Clearance') {
      r.clr += k;
      if (e.clearance && e.clearance.aerial_won) r.aer++;
    } else if (t === 'Dribble') {
      if (e.dribble.outcome && e.dribble.outcome.name === 'Complete') r.drb++;
    } else if (t === 'Pressure') r.prs += k;
    else if (t === 'Goal Keeper') {
      const n = e.goalkeeper && e.goalkeeper.type && e.goalkeeper.type.name;
      if (n === 'Shot Saved' || n === 'Save') r.sav++;
    }
  }
  // goals conceded while a keeper was on the pitch
  for (const id in seg)
    for (const s of seg[id])
      if (s.g === 'GK')
        for (const [team, at] of goalsAgainst) if (team === s.team && at >= s.from && at <= s.to) rec(id, 'GK').ga++;
  if (matches % 50 === 0) console.error(`${matches}/${files.length} matches`);
}

// ---- the table ----
const per90 = (a, s) => (a.minutes ? (a[s] * 90) / a.minutes : 0);
const stats = {
  gls: (a) => per90(a, 'gls'),
  ast: (a) => per90(a, 'ast'),
  xg: (a) => per90(a, 'xg'),
  xa: (a) => per90(a, 'xa'),
  sh: (a) => per90(a, 'sh'),
  pas: (a) => per90(a, 'pas'),
  pct: (a) => (a.att ? (a.pas * 100) / a.att : null),
  kp: (a) => per90(a, 'kp'),
  prg: (a) => per90(a, 'prg'),
  tkl: (a) => per90(a, 'tkl'),
  int: (a) => per90(a, 'int'),
  clr: (a) => per90(a, 'clr'),
  drb: (a) => per90(a, 'drb'),
  aer: (a) => per90(a, 'aer'),
  prs: (a) => per90(a, 'prs'),
  sav: (a) => per90(a, 'sav'),
  svp: (a) => (a.sav + a.ga ? (a.sav * 100) / (a.sav + a.ga) : null),
  cgp: (a) => per90(a, 'ga'),
};
const GK_ONLY = new Set(['sav', 'svp', 'cgp']);
const r2 = (v) => Math.round(v * 100) / 100;
const out = { meta: { matches, source: 'StatsBomb open data (derived figures only)', min: MIN }, groups: {} };
for (const g of ['GK', 'CB', 'FB', 'DM', 'CM', 'AM', 'W', 'ST']) {
  const rows = Object.entries(agg)
    .filter(([k, a]) => k.endsWith('|' + g) && a.minutes >= MIN)
    .map(([, a]) => a);
  const all = Object.entries(agg)
    .filter(([k]) => k.endsWith('|' + g))
    .map(([, a]) => a);
  const pooled = { minutes: 0, ...Object.fromEntries(SUMS.map((s) => [s, 0])) };
  for (const a of all) for (const k of ['minutes', ...SUMS]) pooled[k] += a[k];
  const G = { players: rows.length, minutes: Math.round(pooled.minutes) };
  for (const [m, fn] of Object.entries(stats)) {
    if (GK_ONLY.has(m) !== (g === 'GK') && GK_ONLY.has(m)) continue;
    const mean = fn(pooled);
    const vals = rows.map((a) => [fn(a), a.minutes]).filter(([v]) => v != null);
    if (mean == null || vals.length < 8) continue;
    const w = vals.reduce((n, [, x]) => n + x, 0);
    const mu = vals.reduce((n, [v, x]) => n + v * x, 0) / w;
    const sd = Math.sqrt(vals.reduce((n, [v, x]) => n + x * (v - mu) ** 2, 0) / w);
    G[m] = [r2(mean), r2(Math.max(sd, 0.01))];
  }
  out.groups[g] = G;
}
console.log(JSON.stringify(out, null, 1));
if (args.write) {
  const js = `// Generated by tools/refstats.mjs (npm run refstats) from the StatsBomb open data (derived figures only; ${matches} men's matches).
// What is typical per 90 minutes in each position group, [mean, spread]: read by the real-stats converter (js/realstats.js).
(function () {
  window.FM.D.REFSTATS = ${JSON.stringify(out)};
})();
`;
  fs.writeFileSync(path.join(ROOT, 'js', 'refstats.js'), js);
  console.error('written js/refstats.js');
}
