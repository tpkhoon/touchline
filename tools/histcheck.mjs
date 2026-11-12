// Checks the generated past against the clubs of today: the world is built, its thirty seasons are made, and
//   - clubs move between divisions (promotions and relegations are recorded),
//   - a club outside the top flight can have won a top-flight title (and a fallen giant mostly has),
//   - a legend who captained a title side belongs to a club with a title,
//   - the record scorer of a club has the most goals of its legends.
//   node tools/histcheck.mjs [--seed 7]
import { parseArgs, loadSim } from './harness.mjs';

const args = parseArgs();
const { FM } = loadSim(+(args.seed || 7), { getItem: () => null, setItem() {}, removeItem() {} });
const W = FM.W,
  S0 = () => FM.S;
W.newWorld({ win: 3, subs: 5, foreignLimit: 6, twoLegs: true, awayGoals: false });
FM.Season.init();
W.takeCharge(Object.values(S0().clubs).find((c) => c.comp === 'D1' && c.rep < 75).id, 'Check Manager');
W.seedHistory();
W.seedLegends();
const S = S0();
const fails = [];
const check = (ok, msg) => ok || fails.push(msg);
const clubs = Object.values(S.clubs).filter((c) => c.comp && c.sim !== 'nation' && !c.parent);
const top = (c) => S.comps[c.comp] && S.comps[c.comp].tier === 1;
const moves = S.archive.reduce((n, e) => n + e.promoted.length + e.relegated.length, 0);
check(moves > 300, `only ${moves} promotions and relegations in the generated past`);
const topTitles = (c) =>
  S.archive.filter((e) =>
    Object.values(e.comps).some(
      (x) => x.champion === c.id && S.comps[Object.keys(e.comps).find((k) => e.comps[k] === x)]?.tier === 1,
    ),
  ).length;
const lower = clubs.filter((c) => !top(c) && S.comps[c.comp] && S.comps[c.comp].tier > 1);
const formerChamps = lower.filter((c) => topTitles(c) > 0).length;
check(formerChamps > 5, `only ${formerChamps} clubs outside the top flight ever won a top-flight title`);
const fallen = clubs.filter((c) => c.identity === 'fallen');
const noGlory = fallen.filter((c) => !Object.values(c.titles || {}).some((n) => n > 0));
check(noGlory.length <= fallen.length * 0.2, `${noGlory.length} of ${fallen.length} fallen giants won nothing`);
let badLegends = 0,
  badRecord = 0;
for (const c of clubs) {
  const has = Object.values(c.titles || {}).some((n) => n > 0);
  for (const l of c.legends || []) if (/title|championship|league trophy/i.test(l.note) && !has) badLegends++;
  const r = (c.legends || []).find((l) => l.record);
  if (r && r.goals < Math.max(...c.legends.map((l) => l.goals))) badRecord++;
}
check(!badLegends, `${badLegends} legends claim a title their club never won`);
check(!badRecord, `${badRecord} record scorers are out-scored by another legend`);
const clash = clubs.filter((c) => c.nick && W.nickClash(c.nick, c.colors));
check(
  !clash.length,
  `${clash.length} nicknames name a colour the kit does not have: ${clash
    .slice(0, 5)
    .map((c) => c.name + ' ' + c.nick)
    .join(', ')}`,
);
// the past competitions of the real game that are over feed the generated past: their winners are clubs that were around then
const D = FM.D;
const past = S.archive.flatMap((e) => Object.entries(e.past || {}).map(([id, x]) => ({ id, y: e.year, ...x })));
check(past.length > 20, 'only ' + past.length + ' past-competition winners in the generated past');
check(
  past.every((x) => S.clubs[x.winner] && !(S.clubs[x.winner].founded > x.y)),
  'a past competition won by a club that did not exist yet',
);
const gen = D.PAST_GEN.filter((g) => g.to < S.year && g.from >= S.year - 30);
check(
  gen.every((g) => past.some((x) => x.id === g.id)),
  'a past competition with no winner in the generated past',
);
const pastTitles = clubs.reduce((n, c) => n + Object.values(c.pastTitles || {}).reduce((a, b) => a + b, 0), 0);
check(
  pastTitles === past.length,
  'club honours (' + pastTitles + ') and the archive (' + past.length + ') disagree on past competitions',
);
const youth = (S.youthHonours || []).length;
check(youth > 100, 'only ' + youth + ' youth-tournament honours in the generated past');
const notes = new Set(clubs.flatMap((c) => (c.legends || []).map((l) => l.note)));
console.log({
  clubs: clubs.length,
  moves,
  formerChamps,
  fallen: fallen.length,
  noGlory: noGlory.length,
  distinctNotes: notes.size,
  past: past.length,
  youth,
});
if (fails.length) {
  console.error('FAILED\n' + fails.join('\n'));
  process.exit(1);
}
console.log('ok');
