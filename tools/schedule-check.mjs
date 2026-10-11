// Rules of a single competition, the season's calendar and hand-fixed fixtures: edit a world definition, build the world the way
// the new-career screen does, and check that each edit reached the game, that bad ones are refused, and that a season plays.
//   node tools/schedule-check.mjs [--seed 7]
import { parseArgs, loadSim } from './harness.mjs';

const args = parseArgs();
const store = {};
const { FM } = loadSim(+(args.seed || 7), {
  getItem: (k) => store[k] ?? null,
  setItem: (k, v) => {
    store[k] = String(v);
  },
  removeItem: (k) => {
    delete store[k];
  },
});
const W = FM.W,
  Sea = FM.Season,
  WD = FM.WorldDef,
  DB = FM.DbImport,
  D = FM.D;
const fails = [];
const check = (ok, msg) => {
  if (!ok) fails.push(msg);
};

// ---------- the definition ----------
const def = WD.fromStatic({ name: 'Schedule test' });
const E = WD.editor(def, null);
const d1 = def.clubs.filter((c) => c.league === 'D1');
const league = def.leagues.find((l) => l.id === 'D1');

// rules of a league: refused when wrong, kept when right
{
  const rules = (patch) => ({ ...league.rules, ...patch });
  check(!E.setLeague('D1', { rules: rules({ play: { win: 4 } }) }).ok, 'four points for a win was accepted');
  check(!E.setLeague('D1', { rules: rules({ play: { subs: 0 } }) }).ok, 'no substitutes was accepted');
  check(
    !E.setLeague('D1', { rules: rules({ play: { goldenGoal: true } }) }).ok,
    'a rule the game does not have was accepted',
  );
  check(!E.setLeague('D1', { rules: rules({ squad: { foreign: -2 } }) }).ok, 'minus two foreign players was accepted');
  check(
    E.setLeague('D1', {
      rules: rules({ play: { win: 2, subs: 7 }, squad: { foreign: 4, matchday: 0 } }),
    }).ok,
    'valid league rules were refused',
  );
}
// a cup: no extra time, away goals, three substitutes; the groups of a continental cup
const cupId = D.DOMESTIC_CUPS[0][0];
const contId = D.CONTINENTALS[0].id;
{
  const f = WD.formatOf(cupId);
  check(!E.setCup(cupId, { format: { ...f, play: { win: 5 } } }).ok, 'five points for a win was accepted in a cup');
  check(
    E.setCup(cupId, { format: { ...f, play: { extraTime: false, awayGoals: true, subs: 3 } } }).ok,
    'valid cup rules were refused',
  );
  const g = WD.formatOf(contId);
  check(E.setCup(contId, { format: { ...g, play: { win: 2 } } }).ok, 'a continental cup refused two points for a win');
}

// the calendar
{
  const cal = WD.calendarNow();
  check(
    cal.preseason === 3 && cal.cup.length === 6 && cal.cont.G1 === 2 && cal.intl.join() === '7,15',
    'the game calendar was misread',
  );
  check(WD.validateCalendar({ ...cal, preseason: 9 }).length > 0, 'nine days of pre-season was accepted');
  check(
    WD.validateCalendar({ ...cal, cont: { ...cal.cont, G2: 1 } }).length > 0,
    'a group day before the one before it was accepted',
  );
  check(WD.validateCalendar({ ...cal, intl: [7, 8] }).length > 0, 'two breaks a round apart were accepted');
  check(
    WD.validateCalendar({ ...cal, cup: [3, 3] }).length > 0,
    'two cup rounds after the same league round were accepted',
  );
  def.calendar = { ...cal, preseason: 5, cup: [2, 5, 8, 12, 16, 20], intl: [6, 14] };
  check(WD.validateCalendar(def.calendar).length === 0, 'a valid calendar was refused');
}

// fixed fixtures: put the first two clubs' meeting on matchday 1, a derby on matchday 10 (home sides first)
const [a, b, c, d] = d1.map((x) => x.id);
{
  const withPins = (pins) => ({ ...league, rules: { ...league.rules, pins } });
  check(WD.validatePins(withPins([{ round: 0, h: a, a: b }]), def).length > 0, 'matchday 0 was accepted');
  check(
    WD.validatePins(withPins([{ round: 99, h: a, a: b }]), def).length > 0,
    'a matchday that does not exist was accepted',
  );
  check(WD.validatePins(withPins([{ round: 1, h: a, a: a }]), def).length > 0, 'a club against itself was accepted');
  check(
    WD.validatePins(
      withPins([
        { round: 1, h: a, a: b },
        { round: 1, h: a, a: c },
      ]),
      def,
    ).length > 0,
    'a club twice on one matchday was accepted',
  );
  check(
    WD.validatePins(
      withPins([
        { round: 1, h: a, a: b },
        { round: 1, h: b, a: c },
      ]),
      def,
    ).length > 0,
    'a second match for the same clubs on one matchday was accepted',
  );
  check(
    WD.validatePins({ ...league, rules: { ...league.rules, pins: [{ round: 1, h: 'c_NOPE', a: b }] } }, def).length > 0,
    'a club that is not in the league was accepted',
  );
  const pins = [
    { round: 1, h: a, a: b },
    { round: 1, h: c, a: d },
    { round: 10, h: b, a: c },
    { round: 25, h: d, a: a },
  ];
  league.rules = { ...league.rules, pins };
  const bad = WD.validatePins(league, def);
  check(bad.length === 0, 'valid pins were refused: ' + bad.join('; '));
  check(
    WD.validate(def).errors.length === 0,
    'the definition does not validate: ' + WD.validate(def).errors.slice(0, 3).join('; '),
  );
}

// ---------- the world ----------
const chk = DB.check(def);
DB.stage({ ...chk, def });
DB.build(def, { ...W.REAL_RULES, win: def.rules.win, subs: def.rules.subs });
Sea.init();
const S = FM.S;
{
  const p = W.playRules('D1');
  check(p.win === 2 && p.subs === 7, 'the league rules did not reach the competition');
  check(W.rule('D1', 'win') === 2 && W.rule('D2', 'win') === 3, 'a league took another league’s points rule');
  check(W.rule('D1', 'subs') === 7 && W.rule('D2', 'subs') === 5, 'a league took another league’s substitutes');
  check(
    W.rule(cupId, 'extraTime') === false && W.rule(cupId, 'awayGoals') === true && W.rule(cupId, 'subs') === 3,
    'the cup rules did not reach the cup',
  );
  check(
    W.rule(contId, 'win') === 2 && W.rule(cupId, 'win') === 3,
    'the continental cup rule did not reach its group tables',
  );
  check(W.rule('D1', 'extraTime') === true, 'extra time is not on by default');
  const r = FM.Reg.ruleOf('D1');
  check(r && r.foreign === 4 && !r.matchday, 'the foreign-player limit of the league did not reach registration');
  check(
    FM.Reg.ruleOf('D2').squad === 25 || FM.Reg.ruleOf('D2').hg === 8,
    'another league’s registration rules changed',
  );
}

// fixtures: the pins are where they were put, and the schedule is still a round-robin
{
  const comp = S.comps.D1,
    n = comp.clubs.length;
  const find = (r, h, aw) => comp.fixtures[r - 1].some((f) => f.h === h && f.a === aw);
  check(find(1, a, b), 'the first fixed match is not on matchday 1');
  check(find(1, c, d), 'the second fixed match is not on matchday 1');
  check(find(10, b, c), 'the derby is not on matchday 10');
  check(find(25, d, a), 'the fixed match is not on matchday 25');
  const seen = new Set();
  let ok = comp.fixtures.length === (n - 1) * 2;
  for (const rd of comp.fixtures) {
    const clubs = rd.flatMap((f) => [f.h, f.a]);
    ok = ok && new Set(clubs).size === clubs.length && rd.length === n / 2;
    for (const f of rd) seen.add(f.h + '>' + f.a);
  }
  check(ok, 'a round has a club twice, or the wrong number of matches');
  check(seen.size === n * (n - 1), `${seen.size} different fixtures, not ${n * (n - 1)}`);
}

// the calendar: five days of pre-season, dates that only ever go forward, one cup day between two league rounds
{
  const cal = S.calendar;
  check(cal.filter((e) => e.type === 'pre').length === 5, 'the calendar does not have five days of pre-season');
  check(
    cal.every((e) => Number.isInteger(e.dn)),
    'a calendar day has no date',
  );
  let up = true;
  for (let i = 1; i < cal.length; i++) up = up && cal[i].dn > cal[i - 1].dn;
  check(up, 'two days of the calendar fall on the same date, or go backwards');
  const lastL = cal.reduce((m, e, i) => (e.type === 'league' ? i : m), 0);
  let run = 0,
    worst = 0;
  for (let i = 0; i <= lastL; i++) {
    run = cal[i].type === 'cup' ? run + 1 : 0;
    worst = Math.max(worst, run);
  }
  check(worst <= 1, `${worst} cup days in a row between league rounds`);
  const lg = cal.filter((e) => e.type === 'league');
  check(lg.length === S.rounds, 'the calendar lost a league round');
  const first = cal.findIndex(
    (e) => e.type === 'cup' && e.comps.some((id) => S.comps[id].type === 'cup' && !S.comps[id].euro),
  );
  check(first > 0, 'the domestic cup has no day');
  const brk = cal.findIndex((e) => e.type === 'intl');
  const leagueBefore = cal.slice(0, brk).filter((e) => e.type === 'league').length;
  check(
    leagueBefore === W.scaleRound(6) + 1,
    `the first international break is after round ${leagueBefore}, not ${W.scaleRound(6) + 1}`,
  );
}

// a season: it plays, the table follows the league's own points, extra time is dropped in the cup, and rest days are counted
const user = Object.values(S.clubs).find((x) => x.comp === 'D1' && x.rep < 75);
W.takeCharge(user.id, 'Test Manager');
let restSeen = 0;
const year = S.year;
let g = 0;
while (S.year === year && g++ < 500) {
  const t = Sea.today();
  if (t && t.type !== 'league' && t.type !== 'pre' && S.user.clubId && g % 7 === 0) {
    const rows = Sea.schedule(user.id);
    check(
      rows.every((r, i) => i === 0 || r.d >= rows[i - 1].d),
      'the club schedule is not in date order',
    );
    restSeen += rows.filter((r) => r.rest != null).length ? 1 : 0;
  }
  Sea.advance(null);
}
check(S.year === year + 1, 'the season never ended');
check(restSeen > 0, 'the club schedule never counted a day of rest');
const arch = S.archive.at(-1);
{
  const t = arch.comps.D1.table;
  check(
    t.every((r) => r.pts === r.w * 2 + r.d),
    'the league table does not give two points for a win',
  );
  const t2 = arch.comps.D2.table;
  check(
    t2.every((r) => r.pts === r.w * 3 + r.d),
    'another league’s table does not give three points for a win',
  );
}
check(arch.cups && arch.cups[cupId] && arch.cups[cupId].winner, 'the cup was not played to a winner');

// a match played under a cup without extra time goes to penalties at 90 minutes
{
  FM.S.comps[cupId].opts.play = { extraTime: false };
  const clubs = Object.values(FM.S.clubs).filter((x) => x.comp === 'D1');
  let level = 0,
    longer = 0;
  for (let i = 0; i < 60 && level < 8; i++) {
    const m = new FM.Match({ h: clubs[0].id, a: clubs[1].id, comp: cupId, knockout: true });
    while (!m.finished) m.step();
    if (m.pens) {
      level++;
      if (m.events.some((e) => /Extra time/.test(e.text || ''))) longer++;
    }
  }
  check(level > 0, 'no tie went to penalties in sixty tries');
  check(longer === 0, 'a cup without extra time played extra time');
}

console.log(fails.length ? 'FAIL\n' + fails.join('\n') : 'schedule check passed');
process.exit(fails.length ? 1 : 0);
