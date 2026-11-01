// International football calibration: plays many tournaments from the same starting strengths and compares the numbers with real
// football. Nothing is tuned here; it measures, so changes to national teams can be judged against reality.
//   node tools/intl-calibrate.mjs [--tournaments 60] [--seed 3] [--json]
// What it reports: how often the favourite wins by the gap in strength (group games and knockout ties), who wins the tournaments (the
// spread of winners over many of them), how small nations do, penalty shoot-outs, goals and cards per game, the host's advantage,
// the make-up of the squads, and the injuries and bans a tournament brings. Each tournament starts from the same coefficients and
// fresh players, so the tournaments are independent samples of the same world.
import { parseArgs, loadSim } from './harness.mjs';

const args = parseArgs();
const N = +(args.tournaments || 60),
  SEED = +(args.seed || 3);
const { FM } = loadSim(SEED);
const W = FM.W,
  Sea = FM.Season,
  I = FM.Intl,
  U = FM.U;
W.newWorld({ win: 3, subs: 5, twoLegs: true, awayGoals: false });
Sea.init();
W.takeCharge(Object.values(FM.S.clubs).find((c) => c.comp === 'D1' && c.rep < 75).id, 'Calibration'); // (a manager, for the stories a tournament tells)
const s = FM.S;
const teams = () => Object.values(s.nteams);
// what every tournament starts from
const base = Object.fromEntries(teams().map((t) => [t.id, { coef: t.coef, rep: t.rep }]));
const players = Object.values(s.players);
const reset = () => {
  for (const t of teams()) {
    Object.assign(t, base[t.id]);
    t.cards = {};
    t.banned = [];
    t.aiSq = null;
    t.fam = null;
  }
  for (const p of players) {
    p.inj = null;
    p.susp = 0;
    p.ntBan = 0;
    p.ntRest = null;
    p.fitness = 100;
  }
  I.natVer++;
};

// ---- collectors ----
const bands = [
  [0, 100],
  [100, 200],
  [200, 300],
  [300, 9999],
];
const newBand = () => bands.map(() => ({ n: 0, score: 0, win: 0, draw: 0 }));
const grp = newBand(),
  ko = newBand();
const tot = { games: 0, goals: 0, yellow: 0, red: 0, injured: 0, banned: 0, pens: 0, penFav: 0, koGames: 0 };
const winners = {};
const host = { n: 0, score: 0, exp: 0 };
const small = { n: 0, win: 0, draw: 0, advanced: 0, teams: 0 };
const inj = { players: 0, teamsIn: 0 };
let wcCount = 0;
const startYear = s.year;
const yearFor = (kind) => {
  for (let y = startYear; y < startYear + 4; y++) if (I.tournamentFor(y) === kind) return y;
  return startYear;
};
const rankOf = Object.fromEntries(I.ranked().map((t, i) => [t.id, i + 1]));
const bandOf = (gap) => bands.findIndex(([a, b]) => gap >= a && gap < b);
const expScore = (gapElo) => 1 / (1 + Math.pow(10, -gapElo / 400));

const years = [yearFor('world'), yearFor('continental')];
let tourns = 0;
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  reset();
  s.year = years[i % 2];
  s.tourns = null;
  s.intlLog = [];
  I.setupTournaments();
  const advanced = new Set();
  if (I.tournamentFor(s.year) === 'world') wcCount++;
  for (const stage of I.tournamentStages(s.year)) {
    for (const fx of I.tournamentDay(stage)) {
      if (fx.res) continue;
      const H = s.nteams[fx.h],
        A = s.nteams[fx.a];
      const gap = (H.coef - A.coef) * 10; // (Elo points: a coefficient point is ten)
      const m = new FM.Match({ h: fx.h, a: fx.a, comp: 'INTL', knockout: !!fx.ko, neutral: true });
      while (!m.finished) m.step();
      const r = m.result();
      tot.games++;
      tot.goals += r.hg + r.ag;
      tot.yellow += m.events.filter((e) => e.k === 'yellow').length;
      tot.red += m.events.filter((e) => e.k === 'red').length;
      for (const sd of m.sides) tot.injured += Object.keys(sd.injured).length;
      // favourite's result
      const favHome = gap >= 0;
      const fh = favHome ? r.hg : r.ag,
        fa = favHome ? r.ag : r.hg,
        b = bandOf(Math.abs(gap));
      const fWon = fh > fa || (fh === fa && r.pens && (favHome ? r.pens[0] > r.pens[1] : r.pens[1] > r.pens[0]));
      const target = fx.ko ? ko : grp;
      target[b].n++;
      target[b].score += fh > fa ? 1 : fh === fa ? (fx.ko ? (fWon ? 0.6 : 0.4) : 0.5) : 0;
      if (fWon) target[b].win++;
      if (fh === fa && !fx.ko) target[b].draw++;
      if (fx.ko) {
        tot.koGames++;
        if (r.pens) {
          tot.pens++;
          if (fWon) tot.penFav++;
        }
        advanced.add(FM.Season.winnerOf({ h: fx.h, a: fx.a, res: r }));
      }
      // hosts: their score against what the strength gap says
      const hostIds = ((s.quals && s.quals.hosts) || {})[fx.tid] || [];
      for (const [id, goalsFor, goalsAg, g] of [
        [fx.h, r.hg, r.ag, gap],
        [fx.a, r.ag, r.hg, -gap],
      ])
        if (hostIds.includes(id) && !fx.ko) {
          host.n++;
          host.score += goalsFor > goalsAg ? 1 : goalsFor === goalsAg ? 0.5 : 0;
          host.exp += expScore(g);
        }
      // small nations against the top sixteen
      const lo = rankOf[fx.h] > rankOf[fx.a] ? [fx.h, r.hg, r.ag] : [fx.a, r.ag, r.hg];
      const hi = lo[0] === fx.h ? fx.a : fx.h;
      if (rankOf[lo[0]] > 100 && rankOf[hi] <= 16 && !fx.ko) {
        small.n++;
        if (lo[1] > lo[2]) small.win++;
        else if (lo[1] === lo[2]) small.draw++;
      }
      I.applyFixture(fx, m);
    }
  }
  // who went through the groups: the ones that played a knockout tie
  const list = s.tourns;
  for (const t of list) {
    const inKo = new Set(I.tournKo(t).flatMap((f) => [f.h, f.a]));
    t.teams.forEach((id) => {
      if (rankOf[id] > 100) {
        small.teams++;
        if (inKo.has(id)) small.advanced++;
      }
    });
    // players left injured by the tournament, per team that played it
    inj.teamsIn += t.teams.length;
    for (const id of t.teams) inj.players += I.pool(s.nteams[id].code).filter((p) => p.inj).length;
    I.finishTournament(t);
    if (I.tournamentFor(s.year) === 'world' && t.id === list[0].id) winners[t.winner] = (winners[t.winner] || 0) + 1;
  }
  tot.banned += teams().reduce((n, t) => n + (t.banned || []).length, 0);
  tourns++;
}
const secs = Math.round((Date.now() - t0) / 1000);

// ---- squads: age, players at clubs abroad, spread over leagues (the strongest sixteen nations) ----
reset();
const squads = I.ranked()
  .slice(0, 16)
  .map((t) => I.squad(t.code));
const ages = squads.flat().map((p) => W.age(p));
const abroad = squads
  .flat()
  .filter((p) => p.clubId && s.clubs[p.clubId] && s.clubs[p.clubId].nat !== I.nationOf(p)).length;
const leagues = squads.map(
  (sq) => new Set(sq.map((p) => (p.clubId && s.clubs[p.clubId] ? s.clubs[p.clubId].comp : 'free'))).size,
);

// ---- the report ----
const pct = (a, b) => (b ? Math.round((a / b) * 1000) / 10 : 0);
const lines = [];
const say = (text) => lines.push(text);
const verdict = (v, lo, hi) => (v < lo ? 'LOW' : v > hi ? 'HIGH' : 'ok');
say(`International calibration: ${tourns} tournaments (${secs}s), seed ${SEED}\n`);
say(
  'Favourites by strength gap (Elo points), score = wins + half the draws; real football follows the Elo expectation',
);
const REAL = [0.55, 0.64, 0.76, 0.87];
bands.forEach(([a, b], k) => {
  const row = (name, d) =>
    d[k].n
      ? `${name.padEnd(9)} ${String(d[k].n).padStart(5)} games  favourite score ${pct(d[k].score, d[k].n)}%  wins ${pct(d[k].win, d[k].n)}%  draws ${pct(d[k].draw, d[k].n)}%`
      : '';
  const flag = (d) =>
    d[k].n >= 30 && Math.abs(d[k].score / d[k].n - REAL[k]) > 0.07
      ? d[k].score / d[k].n > REAL[k]
        ? '  HIGH'
        : '  LOW'
      : '';
  say(`  gap ${a}-${b === 9999 ? '+' : b}  (Elo expects about ${Math.round(REAL[k] * 100)}%)`);
  [row('groups', grp) + flag(grp), row('knockouts', ko) + flag(ko)]
    .filter((l) => l.trim())
    .forEach((l) => say('    ' + l));
});
const wl = Object.entries(winners).sort((x, y) => y[1] - x[1]);
const topShare = wl.length ? wl[0][1] / (wcCount || 1) : 0,
  top3 = wl.slice(0, 3).reduce((n, x) => n + x[1], 0) / (wcCount || 1);
say(
  `\nWorld Championship winners: ${wl.length} different nations in ${wcCount} tournaments; the best won ${pct(wl[0] ? wl[0][1] : 0, wcCount)}% (${wl[0] ? s.nteams[wl[0][0]].code : '-'}), the top three ${pct(top3 * (wcCount || 1), wcCount)}%`,
);
say(
  `  ${wl
    .slice(0, 8)
    .map(([id, n]) => `${s.nteams[id].code} ${n}`)
    .join(' · ')}   [real football: about 15-25% for the best nation, a handful of dynasties]`,
);
say(
  `\nSmall nations (ranked below 100th) against the top sixteen in groups: ${small.n} games, win ${pct(small.win, small.n)}%, draw ${pct(small.draw, small.n)}%`,
);
say(
  `  ${small.teams ? pct(small.advanced, small.teams) : 0}% of small nations that qualify reach a knockout tie (${small.teams} entries)`,
);
say(
  `\nShoot-outs: ${tot.pens} in ${tot.koGames} knockout games (${pct(tot.pens, tot.koGames)}%); the stronger side won ${pct(tot.penFav, tot.pens)}% of them  [real: about 50-56%]`,
);
const gpg = tot.goals / tot.games,
  ypg = tot.yellow / tot.games,
  rpg = tot.red / tot.games;
say(`\nGoals per game ${gpg.toFixed(2)} [real tournaments 2.4-2.8] ${verdict(gpg, 2.3, 2.9)}`);
say(
  `Yellow cards per game ${ypg.toFixed(2)} [real about 3-4] ${verdict(ypg, 2.8, 4.2)}, red cards ${rpg.toFixed(2)} [real about 0.08-0.15] ${verdict(rpg, 0.05, 0.2)}`,
);
const ipt = inj.players / (inj.teamsIn || 1);
say(
  `Injured at the end of a tournament: ${ipt.toFixed(1)} players per team of the nation's best thirty [real: about 1-2 withdrawals a team] ${verdict(ipt, 0.5, 2.5)}; injuries in matches ${(tot.injured / tot.games).toFixed(2)} a game (both sides); bans standing ${(tot.banned / tourns).toFixed(1)}`,
);
say(
  `\nHost advantage: ${host.n} group games of hosts; they scored ${pct(host.score, host.n)}% against ${pct(host.exp, host.n)}% expected from strength  (${(host.score - host.exp) / (host.n || 1) > 0.03 ? 'a host edge exists' : 'no host edge is modelled: every tournament game is played as neutral'})`,
);
say(
  `\nSquads of the strongest 16 nations: average age ${U.avg(ages).toFixed(1)} [real 26-28], ${pct(abroad, squads.flat().length)}% play for clubs abroad [real about 50-70%], ${U.avg(leagues).toFixed(1)} different leagues a squad`,
);
console.log(lines.join('\n'));
if (args.json !== undefined)
  console.log(
    JSON.stringify({ tournaments: tourns, grp, ko, winners: wl.length, topShare, small, tot, host }, null, 1),
  );
