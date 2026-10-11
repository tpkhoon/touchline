// Competitions made in the editor: registration rules of a league, a title play-off and two tournaments a year, a continental
// competition of its own at tiers 1 and 2, and an expansion draft for clubs that join a league. Edit a definition, build the world
// the way the new-career screen does, check each edit reached the game, and play a season.
//   node tools/competition-check.mjs [--seed 7]
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

const def = WD.fromStatic({ name: 'Competition test' });
const E = WD.editor(def, null);
const lg = (id) => def.leagues.find((l) => l.id === id);
const setRules = (id, patch) => E.setLeague(id, { rules: { ...lg(id).rules, ...patch } });

// ---------- registration rules ----------
check(!setRules('ES1', { squad: { nonEU: 99 } }).ok, 'ninety-nine non-EU players was accepted');
check(
  !setRules('ES1', { squad: { homegrown: 30, listSize: 20 } }).ok,
  'more homegrown places than the list was accepted',
);
check(!setRules('ES1', { squad: { permit: 'yes' } }).ok, 'a work permit that is not on or off was accepted');
check(!setRules('ES1', { squad: { exempt: ['XXX'] } }).ok, 'an exempt nation the game does not have was accepted');
check(!setRules('ES1', { squad: { mls: { cap: 1 } } }).ok, 'half a salary budget was accepted');
check(!setRules('ES1', { squad: { luck: 3 } }).ok, 'a squad rule the game does not have was accepted');
check(
  setRules('ES1', { squad: { nonEU: 5, quasi: false, nonEUSign: 1 } }).ok &&
    setRules('D1', { squad: { listSize: 22, homegrown: 6, permit: false, exempt: ['IRL'], matchday: 7 } }).ok &&
    setRules('D2', {
      squad: { mls: { cap: 4e6, maxCharge: 5e5, dp: 2, roster: 28, counted: 18 } },
    }).ok,
  'valid registration rules were refused',
);

// ---------- format: a title play-off, two tournaments a year, matches a club plays ----------
check(!setRules('D3', { playoffs: { type: 'fantasy' } }).ok, 'a title play-off that does not exist was accepted');
check(!setRules('D3', { torneos: ['Only one'] }).ok, 'one tournament was accepted');
check(!setRules('D3', { torneos: ['A', 'B'] }).ok, 'two tournaments without a title play-off were accepted');
check(!setRules('D3', { rounds: 0 }).ok, 'a season of no rounds was accepted');
check(setRules('D2', { playoffs: { type: 'finals6' } }).ok, 'a finals series was refused');
check(
  setRules('D3', { playoffs: { type: 'liguilla' }, torneos: ['Opening', 'Closing'] }).ok,
  'two tournaments with a liguilla were refused',
);

// ---------- continental competitions of the definition's own ----------
{
  check(
    !E.addContinental({ id: 'XX', name: 'Bad id', region: 'Europe', tier: 2 }).ok,
    'a continental id that does not start CN was accepted',
  );
  check(!E.addContinental({ id: 'CN9', name: 'Bad tier', region: 'Europe', tier: 5 }).ok, 'a fifth tier was accepted');
  check(
    !E.addContinental({ id: 'CN9', name: 'Bad region', region: 'Mars', tier: 2 }).ok,
    'a competition on Mars was accepted',
  );
  check(
    !E.addContinental({ id: 'CN9', name: ' ', region: 'Europe', tier: 2 }).ok,
    'a nameless competition was accepted',
  );
  check(
    E.addContinental({ id: 'CN1', name: 'Test Shield', short: 'TSH', region: 'Europe', tier: 2 }).ok,
    'a tier 2 competition was refused',
  );
  check(
    WD.validate(def).errors.some((e) => /CN1/.test(e) && /eight/.test(e)),
    'a tier 2 competition with no feeders was not reported',
  );
  // feeders: leagues of Europe
  const f = WD.validateNewCont(
    def.competitions.find((c) => c.id === 'CN1'),
    def,
  );
  check(f.length > 0, 'the empty competition validated');
  const cn1 = def.competitions.find((c) => c.id === 'CN1');
  cn1.format = {
    ...cn1.format,
    feeders: { D2: 2, D3: 2, SC1: 2, ES2: 2 },
    play: { win: 2 },
  };
  check(
    WD.validate(def).errors.filter((e) => /CN1/.test(e)).length === 0,
    'a competition with eight places was refused: ' +
      WD.validate(def)
        .errors.filter((e) => /CN1/.test(e))
        .join('; '),
  );
  // a tier 1 competition: two leagues send clubs to it
  check(
    E.addContinental({
      id: 'CN2',
      name: 'Test Champions Cup',
      short: 'TCC',
      region: 'Europe',
      tier: 1,
      format: { legs: { qf: 1, sf: 1, f: 1 }, prize: 6e6, groupSize: 4, feeders: {} },
    }).ok,
    'a tier 1 competition was refused',
  );
  setRules('DE1', { qualify: { to: 'CN2', n: 4 } });
  setRules('FR1', { qualify: { to: 'CN2', n: 4 } });
  check(
    WD.validate(def).errors.filter((e) => /CN2/.test(e)).length === 0,
    'a tier 1 competition with eight places was refused',
  );
}

// ---------- league structure: zones, conferences and promotion and relegation ----------
{
  const us = lg('US1'),
    ar = lg('AR1');
  check(!setRules('D4', { zones: true }).ok, 'zones without tournaments and a play-off were accepted');
  check(
    !setRules('IE1', { conferences: { East: ['X'], West: ['Y'] }, mls: { playoff: 7 } }).ok,
    'two conferences of too few clubs were accepted',
  );
  check(!setRules('D4', { conferences: { Only: [] } }).ok, 'one conference was accepted');
  // the American league: a club moved to the other conference, the conferences renamed, a draft of four rounds
  const conf = JSON.parse(JSON.stringify(us.rules.conferences));
  const [east, west] = Object.keys(conf);
  const mover = conf[east].pop();
  conf[west].push(mover);
  const renamed = { North: conf[east], South: conf[west] };
  check(
    setRules('US1', { conferences: renamed, mls: { playoff: 7, draftRounds: 4 } }).ok,
    'an edited American structure was refused',
  );
  // Argentina as one table with no zones and no play-off, and zones made for the fourth tier (24 clubs)
  const one = { ...ar.rules };
  delete one.zones;
  delete one.torneos;
  delete one.playoffs;
  check(E.setLeague('AR1', { rules: one }).ok, 'Argentina as one table was refused');
  check(
    setRules('D4', { zones: true, torneos: ['Apertura', 'Clausura'], playoffs: { type: 'zones' } }).ok,
    'zones for a league of twenty-four clubs were refused',
  );
  globalThis.__mover = mover;
}

// ---------- an expansion draft ----------
const mk = (id, name, league) => ({
  id,
  name,
  short: name.slice(0, 3).toUpperCase(),
  nick: '',
  city: name,
  nat: 'ENG',
  colors: ['#2a6fdb', '#ffffff'],
  identity: 'historic',
  rep: 55,
  league,
  parent: null,
  founded: 1999,
  stadium: { name: name + ' Park', cap: 9000 },
});
def.clubs.push(mk('c_ZZE1', 'Expansion Town', 'D4'), mk('c_ZZE2', 'Expansion City', 'D4'));
{
  check(!E.setExpansion('D4', { clubs: [], protect: 12 }).ok, 'a draft with no clubs was accepted');
  check(!E.setExpansion('D4', { clubs: ['c_ZZE1'], protect: 2 }).ok, 'protecting two players was accepted');
  check(!E.setExpansion('D4', { clubs: ['c_ZZE1'], size: 50 }).ok, 'a draft of fifty players was accepted');
  check(!E.setExpansion('D1', { clubs: ['c_ZZE1'] }).ok, 'a club that is not in the league was accepted');
  check(
    !E.setExpansion('D4', { clubs: ['c_ZZE1', 'c_ZZE2'], protect: 12, maxLoss: 1, size: 30 }).ok,
    'more picks than the others can lose were accepted',
  );
  check(
    E.setExpansion('D4', { clubs: ['c_ZZE1', 'c_ZZE2'], protect: 10, maxLoss: 2, size: 16 }).ok,
    'a valid draft was refused',
  );
}
const d4 = def.clubs.filter((c) => c.league === 'D4' && !/^c_ZZE/.test(c.id)).map((c) => c.id);

// promotion and relegation switched off for the world: no league in the patch sends clubs up or down
{
  const off = { ...def, rules: { ...def.rules, proRel: false } };
  const patch = WD.patchOf(off);
  check(
    patch.leagues.length > 10 && patch.leagues.every((l) => !l.rules || (!l.rules.promote && !l.rules.relegate)),
    'a league kept promotion or relegation with the world switch off',
  );
  check(
    !WD.validate({ ...def, rules: { ...def.rules, proRel: 'no' } }).errors.length === false,
    'a promotion switch that is not on or off was accepted',
  );
}

// ---------- the world ----------
const chk = DB.check(def);
check(chk.errors.length === 0, 'the definition does not check: ' + chk.errors.slice(0, 4).join('; '));
DB.stage({ ...chk, def });
DB.build(def, { ...W.REAL_RULES, win: def.rules.win, subs: def.rules.subs });
Sea.init();
const S = FM.S;
{
  const es = FM.Reg.ruleOf('ES1'),
    d1 = FM.Reg.ruleOf('D1'),
    d2 = FM.Reg.ruleOf('D2');
  check(es && es.nonEU === 5 && !es.quasi && es.nonEUSign === 1, 'the Spanish rules did not take the new limits');
  check(
    d1 && d1.squad === 22 && d1.hg === 6 && !d1.permit && d1.exempt.join() === 'IRL' && d1.matchday === 7,
    'the English rules did not take the squad list, permits and exemption',
  );
  check(d2 && d2.mls && d2.mls.cap === 4e6 && d2.mls.dp === 2, 'a league did not get its salary budget');
  check(FM.Reg.ruleOf('FR1').nonEU === 4, 'a league nobody changed lost its registration rules');
  check(S.comps.D2.rules.playoffs.type === 'finals6', 'the finals series did not reach the league');
  check(
    S.comps.D3.torneos && S.comps.D3.torneos.length === 2 && S.comps.D3.rules.playoffs.type === 'liguilla',
    'two tournaments did not reach the league',
  );
  const t = S.comps.CN1,
    c2 = S.comps.CN2;
  check(
    t && t.type === 'continental' && t.tier === 2 && t.region === 'Europe',
    'the tier 2 competition is not in the world',
  );
  check(
    t && t.clubs.length >= 8 && (t.groups || []).length >= 2,
    `the tier 2 competition has ${t && t.clubs.length} clubs`,
  );
  check(t && W.rule('CN1', 'win') === 2, 'the competition did not take its own points rule');
  check(c2 && c2.clubs.length >= 8 && c2.tier === 1, `the tier 1 competition has ${c2 && c2.clubs.length} clubs`);
  check(
    c2 && c2.clubs.every((id) => ['DE1', 'FR1'].includes(S.clubs[id].comp)),
    'a club from outside the two leagues is in the tier 1 competition',
  );
  check(
    D.CONTINENTALS.some((c) => c.id === 'CN1'),
    'the game data lacks the new competition',
  );
  // the expansion draft
  const clubs = ['c_ZZE1', 'c_ZZE2'];
  for (const id of clubs)
    check(
      W.squad(id).filter((p) => !p.team).length >= 16,
      `${id} has a squad of ${W.squad(id).length} after the draft`,
    );
  check(S.expansion && S.expansion.length === 2, 'the draft was not logged');
  const picks = (S.expansion || []).flatMap((x) => x.picks);
  check(picks.length >= 20, `the draft made ${picks.length} picks`);
  check(
    picks.every((x) => S.players[x.pid] && clubs.includes(S.players[x.pid].clubId)),
    'a drafted player is not with the club that took him',
  );
  const lost = {};
  for (const x of picks) lost[x.from] = (lost[x.from] || 0) + 1;
  check(
    Object.values(lost).every((n) => n <= 2),
    'a club lost more than two players',
  );
  check(
    Object.keys(lost).every((id) => d4.includes(id)),
    'a player was drafted from outside the league',
  );
  for (const id of d4) check(W.squad(id).length >= 18, `${id} was left with ${W.squad(id).length} players`);
}

{
  const us = S.comps.US1;
  check(
    us.rules.conferences.North && us.rules.conferences.South && us.rules.mls.draftRounds === 4,
    'the American structure did not reach the league',
  );
  check(
    S.comps.US1.conf && S.comps.US1.conf['c_' + globalThis.__mover] === 'South',
    'a moved club is not in its new conference',
  );
  check(!S.comps.AR1.zones && !S.comps.AR1.torneos && !S.comps.AR1.rules.zones, 'Argentina kept its zones');
  check(
    S.comps.D4.zones &&
      Object.keys(S.comps.D4.zones).length === S.comps.D4.clubs.length &&
      S.comps.D4.torneos.length === 2,
    'the zones did not reach the fourth tier',
  );
}

// play a season: both new competitions, the finals series and the two tournaments are played to the end
W.takeCharge(Object.values(S.clubs).find((x) => x.comp === 'D1').id, 'Test Manager');
W.goUnemployed('test');
const year = S.year;
let g = 0;
while (S.year === year && g++ < 600) Sea.advance(null);
check(S.year === year + 1, 'the season never ended');
const arch = S.archive.at(-1);
check(JSON.stringify(arch).includes('"CN1"'), 'the tier 2 competition left no record');
check(arch.comps.D2 && arch.comps.D2.champion, 'the league with a finals series had no champion');
check(arch.comps.D3 && arch.comps.D3.champion, 'the league with two tournaments had no champion');

console.log(fails.length ? 'FAIL\n' + fails.join('\n') : 'competition check passed');
process.exit(fails.length ? 1 : 0);
