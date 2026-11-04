// Youth pipeline realism check: where do academy intakes end up, how old are first-team debutants, how much do the academies' own
// graduates play, and do loans help? It plays the world's seasons on its own and watches every player an academy makes.
// Nothing is tuned here; it measures, so changes to development, minutes and loans can be judged.
//   node tools/youth-check.mjs [--seed 5] [--seasons 6] [--leagues D1,ES1,DE1,IT1,FR1] [--json]
//   --leagues  the leagues played in the light tier (youth sides, loans, a real market); every other league is at the quick tier, which
//              makes no signings and has no youth sides. Without it, the game's own tiers are used (slow: hours for a few seasons).
// Real-world rules of thumb it is held against (rough, from published academy studies; targets to tune toward, not data):
//   about 1 in 10 academy players makes a professional first-team appearance, about 1 in 50 plays in a top flight;
//   first-team debuts at 18 to 20, a breakthrough at 20 to 23; a loan helps a prospect more often than it stalls him.
import { parseArgs, loadSim } from './harness.mjs';

const args = parseArgs();
const SEED = +(args.seed || 5),
  SEASONS = +(args.seasons || 6);
const { FM } = loadSim(SEED);
const W = FM.W,
  D = FM.D;
const focus = args.leagues ? String(args.leagues).split(',') : null;
const sims = focus
  ? Object.fromEntries(D.LEAGUES.map((l) => [l.id, focus.includes(l.id) ? 'light' : 'minimal']))
  : undefined;
W.newWorld({ ...W.REAL_RULES, ...(sims ? { sims } : {}) });
FM.Season.init();
W.newManager('Observer', 38, 'ENG');
if (!FM.S.staffPool) W.refreshStaffPool();
W.goUnemployed('start');
const S = () => FM.S;

// a club whose squad is really played (the quick tier hands out appearances loosely, so its numbers say nothing about minutes)
const played = (c) => !!c && c.sim !== 'minimal';
const tierOf = (c) => {
  const comp = c && c.comp && S().comps[c.comp];
  return comp ? comp.tier || 1 : null;
};
const cohort = new Map(); // id -> what we know about a player an academy made while we watched
const seen = new Set(Object.keys(S().players));
const startCA = new Map(); // id -> ca at the start of the season, for players 17 to 23
const loaned = new Set(); // ids of those who were out on loan at some point this season
const gains = { loan: [], stay: [] }; // ca gained over a season by those who were loaned and those who were not
const minutes = { grad: 0, all: 0 }; // first-team appearances in top flights: players an academy made while we watched, and everyone
const lastApps = new Map();
let year0 = S().year;

function snapshot() {
  const all = S().players;
  for (const id in all) {
    const p = all[id];
    if (!seen.has(id)) {
      seen.add(id);
      // a new player aged 15 to 17 at a club: an academy intake
      if (p.clubId && W.age(p) <= 17 && p.youth && played(S().clubs[p.clubId])) {
        cohort.set(id, {
          y0: S().year,
          club0: p.clubId,
          ca0: p.ca,
          pa0: p.pa,
          debut: null,
          top: false,
          topDebut: null,
          ages: {},
        });
      }
    }
    if (p.retired) continue;
    const a = W.age(p);
    const m = cohort.get(id);
    if (m) {
      m.ages[a] = { ca: p.ca, club: p.clubId, pro: !!p.clubId };
      const c = p.clubId && S().clubs[p.clubId];
      if (m.debut === null && !p.team && played(c) && (p.season.apps || 0) > 0) m.debut = a;
      if (played(c) && tierOf(c) === 1 && !c.parent && !p.team && (p.season.apps || 0) > 0) {
        m.top = true;
        if (m.topDebut === null) m.topDebut = a;
      }
    }
    if (a >= 17 && a <= 23 && p.loan) loaned.add(id);
  }
}
function seasonEnd() {
  const all = S().players;
  for (const id in all) {
    const p = all[id];
    if (p.retired) continue;
    const a = W.age(p);
    if (a >= 17 && a <= 23 && startCA.has(id) && played(S().clubs[p.clubId]))
      (loaned.has(id) ? gains.loan : gains.stay).push(p.ca - startCA.get(id));
    // appearances in a top flight this season: the academies' own graduates against everyone
    const c = p.clubId && S().clubs[p.clubId];
    if (played(c) && tierOf(c) === 1 && !c.parent && !p.team) {
      const d = (p.career.apps || 0) - (lastApps.get(id) || 0);
      if (d > 0 && d < 80) {
        minutes.all += d;
        if (cohort.has(id)) minutes.grad += d;
      }
    }
  }
  startCA.clear();
  loaned.clear();
  for (const id in all) {
    const p = all[id];
    if (!p.retired && W.age(p) >= 17 && W.age(p) <= 23) startCA.set(id, p.ca);
    lastApps.set(id, p.career.apps || 0);
  }
}
seasonEnd();
const t0 = Date.now();
let seasons = 0,
  days = 0;
while (seasons < SEASONS && days < SEASONS * 420) {
  const sum = FM.Season.advance(null);
  days++;
  if (days % 20 === 0) snapshot();
  if (!sum) continue;
  snapshot();
  seasonEnd();
  seasons++;
  process.stderr.write(
    `season ${seasons} of ${SEASONS} done (${Math.round((Date.now() - t0) / 1000)}s), watching ${cohort.size} academy players\n`,
  );
}
snapshot();

// ---- report ----
const out = {};
const share = (n, d) => (d ? n / d : 0);
const pct = (x) => `${(x * 100).toFixed(1)}%`;
const median = (a) => (a.length ? a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)] : null);
const mean = (a) => (a.length ? a.reduce((t, x) => t + x, 0) / a.length : 0);
const say = (s) => console.log(s);

say(
  `Youth pipeline check: seed ${SEED}, ${seasons} seasons played from ${year0}${focus ? `, light tier in ${focus.join(' ')}` : ', the game own tiers'}\n`,
);
const ids = [...cohort.keys()];
say(`Academy players watched: ${ids.length} (made in ${year0} to ${S().year})`);
// by the age reached: those who got there and what became of them
for (const age of [19, 21]) {
  const reached = ids.filter((id) => Object.keys(cohort.get(id).ages).some((a) => +a >= age));
  if (reached.length < 30) {
    say(`  by ${age}: too few have reached it in ${seasons} seasons (${reached.length})`);
    continue;
  }
  const deb = reached.filter((id) => cohort.get(id).debut !== null && cohort.get(id).debut <= age).length;
  const top = reached.filter((id) => cohort.get(id).top && cohort.get(id).topDebut <= age).length;
  const still = reached.filter((id) => cohort.get(id).ages[age] && cohort.get(id).ages[age].pro).length;
  say(
    `  by ${age} (${reached.length} reached it): ${pct(share(deb, reached.length))} have played a senior game [real: about 5 to 12% by 21], ${pct(share(top, reached.length))} in a top flight [real: about 1 to 4%], ${pct(share(still, reached.length))} still at a club`,
  );
  out[`by${age}`] = {
    n: reached.length,
    debut: share(deb, reached.length),
    top: share(top, reached.length),
    still: share(still, reached.length),
  };
}
const debuts = ids.map((id) => cohort.get(id).debut).filter((x) => x !== null);
const topDebuts = ids.map((id) => cohort.get(id).topDebut).filter((x) => x !== null);
say(
  `  age at a first senior game: median ${median(debuts)} over ${debuts.length} [real: 18 to 20]; at a first top-flight game: median ${median(topDebuts)} over ${topDebuts.length} [real: 19 to 22]`,
);
say(
  `  top-flight appearances played by academy players watched here: ${pct(share(minutes.grad, minutes.all))} (only those made since the start, so it grows as the seasons pass; real top flights: 10 to 25% homegrown club graduates)`,
);
out.debutMedian = median(debuts);

const g = (a) => ({
  n: a.length,
  mean: mean(a),
  up: share(a.filter((x) => x >= 2).length, a.length),
  stall: share(a.filter((x) => x <= 0).length, a.length),
});
const L = g(gains.loan),
  N = g(gains.stay);
say(`\nLoans (players 17 to 23, ability gained over a season)`);
say(
  `  on loan:     ${L.n} player-seasons, +${L.mean.toFixed(2)} on average, ${pct(L.up)} improved by 2 or more, ${pct(L.stall)} stalled or fell`,
);
say(
  `  not on loan: ${N.n} player-seasons, +${N.mean.toFixed(2)} on average, ${pct(N.up)} improved by 2 or more, ${pct(N.stall)} stalled or fell`,
);
say(
  `  (a loan should help a prospect more often than it stalls him, and mean about as much as staying at a club where he plays)`,
);
out.loans = { loan: L, stay: N };

// the reserve sides: how the world's youth leagues and B teams end
const bs = Object.values(S().clubs).filter((c) => c.parent);
say(`\nB teams: ${bs.length}; none is promoted into its parent's division (a rule of the game, not measured)`);
if (args.json) console.log(JSON.stringify(out));
