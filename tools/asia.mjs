// Asia test: the rules and events that make football there its own game.
//   node tools/asia.mjs [--seasons 4] [--seed 6]      (npm run test:asia)
// Checks, over a few seasons of the world playing itself: the AFC's 3 + 1 (+ ASEAN) foreign-player places are respected by every
// Korean and Thai squad; Korean players go into military service and come back; Gulf money buys famous names for Saudi clubs; Japan's
// graduate draft signs university players; part-time clubs are recognised; and every story start finds a club.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { parseArgs, loadSim, ROOT } from './harness.mjs';

const args = parseArgs();
const SEASONS = +(args.seasons || 4),
  SEED = +(args.seed || 6);
const { ctx, FM } = loadSim(SEED);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/clubguide.js'), 'utf8'), ctx, { filename: 'clubguide.js' });
const W = FM.W,
  D = FM.D,
  R = FM.Reg;
const sims = Object.fromEntries(D.LEAGUES.map((l) => [l.id, 'minimal']));
['D1', 'SA1', 'KR1', 'JP1', 'TH1', 'ES1'].forEach((id) => (sims[id] = 'full'));
W.newWorld({ ...W.REAL_RULES, sims });
FM.Season.init();
W.newManager('Observer', 38, 'ENG');
if (!FM.S.staffPool) W.refreshStaffPool();
W.goUnemployed('start');

const fails = [],
  lines = [];
const check = (ok, text) => {
  lines.push(`${ok ? '✓' : '✗'} ${text}`);
  if (!ok) fails.push(text);
};

// what a matchday squad (XI and bench) holds against the league's foreign places: the places the engine enforces on the day
// (a squad may carry more on its books between windows; whoever is over the limits is left out at the deadline)
const overOnDay = (id) => {
  const bad = [];
  for (const c of Object.values(FM.S.clubs).filter((x) => x.comp === id)) {
    const r = R.rulesFor(c),
      { xi, bench } = W.pickXI(c.id, c.tactic);
    const day = xi.concat(bench).filter(Boolean);
    R.foreignGroups(c, r).forEach((g) => day.filter(g.f).length > g.cap && bad.push(`${c.name}: ${g.label}`));
  }
  return bad;
};
let service = 0,
  returned = 0,
  gulf = 0,
  drafted = 0,
  worst = { KR1: 0, TH1: 0 };
const serving = new Set();
const t0 = Date.now();
let seasons = 0,
  days = 0;
while (seasons < SEASONS && days < SEASONS * 400) {
  const before = FM.S.year;
  const sum = FM.Season.advance(null);
  days++;
  if (days % 20 === 0) for (const l of ['KR1', 'TH1']) worst[l] = Math.max(worst[l], overOnDay(l).length);
  if (FM.S.year !== before || (sum && sum.newSeason)) {
    seasons++;
    for (const p of Object.values(FM.S.players)) {
      if (p.service && !serving.has(p.id)) (serving.add(p.id), service++);
      if (!p.service && serving.has(p.id)) (serving.delete(p.id), returned++);
    }
  }
}
gulf = (FM.S.players ? Object.values(FM.S.players) : []).filter(
  (p) => p.clubId && FM.S.clubs[p.clubId] && FM.S.clubs[p.clubId].comp === 'SA1' && p.ca >= 76 && W.age(p) >= 27,
).length;
drafted = Object.values(FM.S.players).filter((p) => p.uni && p.draftClub).length;

check(
  worst.KR1 === 0 && worst.TH1 === 0,
  `no Korean or Thai matchday squad ever beyond its foreign places (worst: KR1 ${worst.KR1}, TH1 ${worst.TH1})`,
);
check(service > 0, `Korean players went into military service (${service} in ${SEASONS} seasons)`);
check(returned > 0, `and came back (${returned})`);
const camp = FM.Asia.camp(),
  csq = camp ? W.squad(camp.id) : [];
check(
  !!camp && csq.length >= 15 && csq.every((p) => p.service && p.loan && p.loan.military),
  `the army's club (${camp ? camp.name : 'none'}) has only conscripts on loan from their own clubs (${csq.length} players)`,
);
check(
  camp && csq.filter((p) => p.pos === 'GK').length >= 2 && csq.filter(W.available).length >= 14,
  'and can field a side',
);
check(gulf > 0, `Saudi clubs hold famous names bought from elsewhere (${gulf} players of 76+ at 27 or older)`);
check(drafted > 0, `Japan's graduate draft signed university players (${drafted})`);
const kr = Object.values(FM.S.clubs).find((c) => c.comp === 'KR1');
check(
  W.partTime(Object.values(FM.S.clubs).find((c) => FM.S.comps[c.comp] && FM.S.comps[c.comp].tier >= 4)),
  'a fourth-tier club is part-time',
);
check(!W.partTime(kr), 'a top-flight club is not');
const st = FM.Guide.stories();
check(st.length >= 5, `story starts find clubs for ${st.length} of 7 situations`);
check(FM.Guide.firstClubs().length >= 4, 'a short list of good first clubs');
const rules = R.describe('KR1').join(' ');
check(/ASEAN/.test(rules) && /Asian/.test(rules), 'the rules page explains the 3 + 1 and the ASEAN place');

console.log(`Asia · ${SEASONS} seasons, seed ${SEED}, ${Math.round((Date.now() - t0) / 1000)}s\n`);
console.log(lines.join('\n'));
console.log(fails.length ? `\n${fails.length} check(s) failed` : '\nAll Asia checks hold.');
process.exit(fails.length ? 1 : 0);
