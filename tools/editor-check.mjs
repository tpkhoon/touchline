// The world editor's data path, without the screens: edit a definition (rename and recolour a club, change its ground and
// rating, move a club to another league, add new clubs, including one that makes a league an odd size), build the world
// from it the way the new-career screen does, and play a season in it.
//   node tools/editor-check.mjs [--seed 7]
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
  DB = FM.DbImport;
const fails = [];
const check = (ok, msg) => {
  if (!ok) fails.push(msg);
};

const def = WD.fromStatic({ name: 'Editor test' });
const E = WD.editor(def, null);
const d1 = def.clubs.filter((c) => c.league === 'D1');
// edits through the validated calls
let r = E.setClub(d1[0].id, {
  name: 'Renamed Rovers',
  colors: ['#cc0000', '#ffffff'],
  rep: 90,
  stadium: { name: 'The Test', cap: 61000 },
});
check(r.ok, 'a valid club edit was refused: ' + r.errors.join('; '));
// crest, money, facilities and supporters: bad ones are refused, good ones kept
const X = d1[0].id;
check(!E.setClub(X, { crest: [9, 0, 0] }).ok, 'a crest shape that does not exist was accepted');
check(!E.setClub(X, { crest: [0, 0] }).ok, 'a crest of two numbers was accepted');
check(!E.setClub(X, { kit: { home: 'red', away: '#ffffff' } }).ok, 'a shirt colour that is not #rrggbb was accepted');
check(!E.setClub(X, { facilities: { training: 7 } }).ok, 'a facility of level 7 was accepted');
check(!E.setClub(X, { facilities: { pool: 3 } }).ok, 'a facility the game does not have was accepted');
check(!E.setClub(X, { finance: { budget: -5 } }).ok, 'a negative transfer budget was accepted');
check(!E.setClub(X, { attr: { market: 12 } }).ok, 'a market of 12 was accepted');
check(!E.setClub(X, { attr: { own: 'aliens' } }).ok, 'an owner of aliens was accepted');
check(
  E.setClub(X, {
    crest: [1, 4, 6],
    kit: { home: '#123456', away: '#fedcba' },
    finance: { balance: 250e6, budget: 80e6 },
    facilities: { training: 5, academy: 5, medical: 4, analytics: 4, stadium: 3, fanzone: 2, museum: 1 },
    attr: { market: 9, support: 8.5, catchment: 7, own: 'sovereign' },
  }).ok,
  'valid club extras were refused',
);
r = E.setClub(d1[1].id, { colors: ['red', '#ffffff'] });
check(!r.ok, 'a club with a colour that is not #rrggbb was accepted');
r = E.setClub(d1[1].id, { rep: 5 });
check(!r.ok, 'a reputation of 5 was accepted');
r = E.setClub(d1[1].id, { name: '   ' });
check(!r.ok, 'a blank club name was accepted');
// a club moved to another league of its nation, and two new clubs (the Premier Division becomes an odd size)
const moved = def.clubs.find((c) => c.league === 'D2');
check(E.setClub(moved.id, { league: 'D1' }).ok, 'a club could not move league');
const mk = (id, name, lg) => ({
  id,
  name,
  short: name.slice(0, 3).toUpperCase(),
  nick: '',
  city: name,
  nat: 'ENG',
  colors: ['#2a6fdb', '#ffffff'],
  identity: 'historic',
  rep: 60,
  league: lg,
  parent: null,
  founded: 1901,
  stadium: { name: name + ' Park', cap: 9000 },
});
def.clubs.push(mk('c_ZZA1', 'Alphaton', 'D1'), mk('c_ZZB1', 'Betaville', 'D3'));
// players you make: bad ones are refused, and a club given eleven has exactly that squad (the first screen's "replace" choice)
const flat = (v) => Object.fromEntries(FM.D.ATTRS.map((k) => [k, v]));
const mine = def.clubs.find((c) => c.league === 'D1' && c.id !== d1[0].id && c.id !== d1[2].id && !c.parent).id;
const mkP = (i, over = {}) => ({
  fn: 'Maker',
  ln: 'No' + i,
  nat: 'ENG',
  pos: i === 0 ? 'GK' : 'CM',
  born: def.meta.startYear - 25,
  foot: 'Right',
  attrs: flat(10),
  pa: 55,
  club: mine,
  contract: def.meta.startYear + 2,
  ...over,
});
check(!E.addPlayer(mkP(1, { born: def.meta.startYear - 60 })).ok, 'a player aged 60 was accepted');
check(!E.addPlayer(mkP(1, { attrs: flat(25) })).ok, 'attributes of 25 were accepted');
check(!E.addPlayer(mkP(1, { pa: 20 })).ok, 'a potential below his ability was accepted');
check(!E.addPlayer(mkP(1, { club: 'c_NOPE' })).ok, 'a player for a club that does not exist was accepted');
for (let i = 0; i < 11; i++) check(E.addPlayer(mkP(i)).ok, 'a valid player was refused');
// a club of the game's own taken out, and a league in a nation that had none
const d3 = def.clubs.filter((c) => c.league === 'D3' && !c.parent && !/^c_ZZ/.test(c.id));
const gone = d3[d3.length - 1].id;
def.clubs = def.clubs.filter((c) => c.id !== gone);
def.removeClubs.push(gone);
const urus = Array.from({ length: 10 }, (_, i) => ({
  ...mk('c_URU' + (i + 1), 'Montevideo ' + (i + 1), 'URU1'),
  nat: 'URU',
}));
def.leagues.push({
  id: 'URU1',
  name: 'Uruguayan Test League',
  short: 'URU',
  nat: 'URU',
  tier: 1,
  sim: 'light',
  repBand: [70, 45],
  rules: { qualify: { to: 'CL', n: 1 } },
});
def.clubs.push(...urus);
def.meta.players = 'replace';
// a free agent, a manager, a renamed cup and the rules
check(
  E.addPlayer(mkP(20, { club: null, ln: 'Freeman', contract: def.meta.startYear + 1 })).ok,
  'a free agent was refused',
);
// players imported from a spreadsheet: a row with no club is a free agent, a bad position is reported, an unknown club is left out
{
  const csv = [
    'name,nat,born,pos,club,minutes,goals,xg,tackles',
    'Ivan Import,SRB,1998,ST,,2400,15,13.5,20',
    'Bad Row,ENG,1999,XX,,100,1,0.5,2',
    'Lost Club,ENG,1999,CM,Nowhere FC,900,0,0.1,30',
    'Kim Club,KOR,2000,CB,' + def.clubs.find((c) => c.league === 'D2').name + ',2700,1,0.8,60',
  ].join('\n');
  const pr = FM.HistImport.playerRows(def, FM.RealStats.parseCSV(csv), { club: 'column' });
  check(
    pr.unmatched.join() === 'Nowhere FC',
    'a club that is not in the world was not reported: ' + pr.unmatched.join(),
  );
  const res = E.importPlayers(pr.rows);
  check(
    res.added === 2 && res.errors.length === 1,
    `expected two players added and one error, got ${res.added} and ${res.errors.length}`,
  );
  const one = FM.HistImport.playerRows(def, FM.RealStats.parseCSV(csv).slice(0, 1), { club: null });
  check(one.rows.length === 1 && one.rows[0].club === null, 'a row sent to the free agents has a club');
}
def.managers.push({
  club: mine,
  fn: 'Ivor',
  ln: 'Edit',
  nat: 'ENG',
  age: 50,
  ability: 18,
  personality: 'Cautious',
  rep: 85,
  tactic: { formation: '4-4-2', buildup: 'Direct', press: 'Low Block', width: 'Wide' },
});
// managers and agents that are not valid are refused by the definition's check
{
  const bad = JSON.parse(JSON.stringify(def));
  bad.managers[0].rep = 5;
  bad.managers[0].personality = 'Grumpy';
  bad.managers[0].tactic = { formation: '9-9-9', buildup: 'Short', press: 'Mid Block', width: 'Balanced' };
  const errs = WD.validate(bad, null).errors.filter((e) => e.startsWith('manager'));
  check(errs.length === 3, `expected three manager errors, got ${errs.length}`);
  bad.managers = [def.managers[0], { ...def.managers[0] }];
  check(
    WD.validate(bad, null).errors.some((e) => /two managers/.test(e)),
    'two managers for one club were accepted',
  );
  bad.agents = ['Same Agency', 'same agency'];
  check(
    WD.validate(bad, null).errors.some((e) => /agent firms/.test(e)),
    'two agent firms with one name were accepted',
  );
}
def.agents = ['Test Agency One', 'Test Agency Two', 'Test Agency Three'];
def.competitions = [{ id: 'CUPENG', name: 'Editor Test Cup', short: 'ETC', nat: null, type: 'cup' }];
def.rules.win = 2;
def.rules.subs = 3;
// cup formats: a bad one is refused, a good one is kept; a continental cup played in single matches at one venue
check(!E.setCup('CUPENG', { format: { legs: [3], neutral: [] } }).ok, 'a cup with a round of 3 clubs was accepted');
check(
  !E.setCup('AC', { format: { legs: { qf: 3, sf: 1, f: 1 }, central: true, prize: 6e6 } }).ok,
  'a three-legged tie was accepted',
);
check(!E.setCup('CWC', { format: { legs: [2] } }).ok, 'a format for a cup the game gives none was accepted');
check(
  !E.setCup('CUPENG', { format: { legs: [], neutral: [], tiers: 9 } }).ok,
  'a cup open to division nine was accepted',
);
check(!E.setCup('CUPENG', { format: { legs: [], neutral: [], prize: 5 } }).ok, 'a prize of 5 was accepted');
check(
  E.setCup('CUPENG', { format: { legs: [4, 2], neutral: 'all', tiers: 2, prize: 7e6 } }).ok,
  'a valid domestic cup format was refused',
);
// two of the game's own cups taken out of the world, and two invitationals (only the Kirin Cup is kept below)
def.removeCups = ['CUPFRA', 'CUPJPN'];
check(E.setCup('CUPITA', { format: { legs: [], neutral: [] } }).ok, 'a valid Italian cup format was refused');
check(
  E.setCup('AF', { format: { legs: { qf: 1, sf: 1, f: 1 }, central: true, prize: 6e6, groupSize: 3 } }).ok,
  'a valid continental format was refused',
);
check(!E.setCup('NC', { format: { legs: { qf: 2, sf: 2, f: 2 }, groupSize: 7 } }).ok, 'groups of seven were accepted');
check(!E.setCup('NC', { format: { legs: { qf: 2, sf: 2, f: 2 }, groupSize: 2 } }).ok, 'groups of two were accepted');
check(E.setCup('NC', { format: { legs: { qf: 2, sf: 2, f: 2 }, groupSize: 5 } }).ok, 'groups of five were refused');
check(E.setCup('HC', { format: { legs: [], neutral: [2] } }).ok, 'a valid Holders cup format was refused');
// derbies and B teams
const drb = def.clubs.filter((c) => c.league === 'D1' && !c.parent && c.id !== mine);
const builtDerby = def.rivals[0];
check(E.setDerby(drb[0].id, drb[1].id, 'The Editor Derby').ok, 'a derby could not be made');
check(!E.setDerby(drb[0].id, drb[0].id, 'x').ok, 'a club was its own rival');
check(E.derbyOf(drb[1].id)[2] === 'The Editor Derby', 'the derby is not on both clubs');
check(E.clearDerby(builtDerby[0]).ok && !E.derbyOf(builtDerby[0]), 'a derby of the games own was not taken out');
const hasB = new Set(def.clubs.filter((c) => c.parent).map((c) => c.parent));
const parent = drb.find((c) => !hasB.has(c.id) && c.id !== drb[0].id && c.id !== drb[1].id).id;
check(!E.setParent(drb[0].id, drb[1].id).ok, 'a B team in the same division as its parent was accepted');
check(!E.setParent('c_ZZB1', 'c_URU1').ok, 'a B team of a club in another nation was accepted');
check(E.setParent('c_ZZB1', parent).ok, 'a B team could not be made');
// coaches and scouts: a club's own staff, and a coach on offer
const aid = E.addStaff({
  role: 'Assistant Manager',
  fn: 'Ada',
  ln: 'Assist',
  nat: 'ENG',
  age: 52,
  ability: 19,
  club: mine,
});
check(aid.ok, 'a valid assistant was refused');
check(
  E.addStaff({
    role: 'Scout',
    fn: 'Sam',
    ln: 'Scout',
    nat: 'ARG',
    age: 40,
    ability: 17,
    club: mine,
    personality: 'Loyal',
    years: 4,
    wage: 12345,
    regions: { ENG: 0.1, EUR: 0.2, SAM: 0.95, NAM: 0.1, ASIA: 0.1, AFR: 0.2 },
    judge: 16,
  }).ok,
  'a valid scout was refused',
);
check(
  !E.addStaff({ role: 'Scout', fn: 'Moon', ln: 'Scout', nat: 'ENG', age: 40, ability: 10, regions: { MOON: 0.9 } }).ok,
  'a scout who knows the moon was accepted',
);
check(
  !E.addStaff({ role: 'Scout', fn: 'Low', ln: 'Pay', nat: 'ENG', age: 40, ability: 10, wage: 5 }).ok,
  'a wage of 5 was accepted',
);
check(
  !E.addStaff({ role: 'Scout', fn: 'Bad', ln: 'Mood', nat: 'ENG', age: 40, ability: 10, personality: 'Grumpy' }).ok,
  'an unknown personality was accepted',
);
check(
  !E.addStaff({
    role: 'First-Team Coach',
    fn: 'Net',
    ln: 'Work',
    nat: 'ENG',
    age: 40,
    ability: 10,
    regions: { ENG: 0.5 },
  }).ok,
  'a coach with a scouting network was accepted',
);
check(
  !E.addStaff({ role: 'Goalkeeping Coach', fn: 'No', ln: 'Role', nat: 'ENG', age: 40, ability: 10 }).ok,
  'an unknown role was accepted',
);
check(
  !E.addStaff({ role: 'Scout', fn: 'Too', ln: 'Good', nat: 'ENG', age: 40, ability: 25 }).ok,
  'an ability of 25 was accepted',
);
check(
  E.addStaff({ role: 'First-Team Coach', fn: 'Free', ln: 'Coach', nat: 'ESP', age: 44, ability: 20 }).ok,
  'a coach on offer was refused',
);
// national teams
check(!E.setNation('ENG', { coef: 400 }).ok, 'ranking points of 400 were accepted');
check(!E.setNation('XXX', { name: 'Nowhere' }).ok, 'a nation the game does not have was accepted');
check(
  E.setNation('ENG', { name: 'Albion', short: 'ALB', colors: ['#112233', '#ffffff'], coef: 88 }).ok,
  'a national team edit was refused',
);
// competitions: league formats, a play-off pair, a cup of the definition's own
const lg = (id) => def.leagues.find((l) => l.id === id);
check(!E.setLeague('D3', { rules: { ...lg('D3').rules, legs: 3 } }).ok, 'a league played three times was accepted');
check(
  !E.setLeague('D3', { rules: { ...lg('D3').rules, tiebreak: ['luck'] } }).ok,
  'a tie-breaker called luck was accepted',
);
check(
  !E.setLeague('D3', { rules: { ...lg('D3').rules, promote: { to: 'D2', auto: 2, playoff: [4, 7] } } }).ok,
  'a play-off that does not start below the places that go up was accepted',
);
check(
  !E.setLeague('D2', { rules: { ...lg('D2').rules, relegate: { to: 'D3', n: 2, playoff: true } } }).ok,
  'a relegation play-off was accepted when the league below holds no play-off place',
);
check(E.setLeague('ES2', { rules: { ...lg('ES2').rules, legs: 1 } }).ok, 'a league played once each was refused');
check(
  E.setLeague('DE1', { rules: { ...lg('DE1').rules, tiebreak: ['wins', 'gd', 'gf'] } }).ok,
  'a tie-breaker order was refused',
);
check(
  E.setLeague('D3', { rules: { ...lg('D3').rules, promote: { to: 'D2', auto: 2, tie: true } } }).ok,
  'a promotion tie place was refused',
);
check(
  E.setLeague('D2', { rules: { ...lg('D2').rules, relegate: { to: 'D3', n: 2, playoff: true } } }).ok,
  'a relegation play-off was refused',
);
check(E.setLeague('URU1', { repBand: [60, 40] }).ok, 'a league strength was refused');
check(
  !E.addCup({ id: 'CUPXX', nat: 'ENG', name: 'Another English Cup', short: 'AEC' }).ok,
  'a second cup for England was accepted',
);
check(!E.addCup({ id: 'FOO', nat: 'URU', name: 'Bad Id Cup', short: 'BIC' }).ok, 'a cup id without CUP was accepted');
check(
  !E.addCup({ id: 'CUPMAR', nat: 'MAR', name: 'Moroccan Cup', short: 'MC' }).ok,
  'a cup for a nation with no simulated clubs was accepted',
);
check(
  E.addCup({
    id: 'CUPURU',
    nat: 'URU',
    name: 'Uruguayan Test Cup',
    short: 'UTC',
    format: { legs: [4], neutral: [2], prize: 2e6, tiers: 0 },
  }).ok,
  'a cup for Uruguay was refused',
);
// a club data pack: names and looks only, fits another world, and the new-career import reads it too
{
  const base = WD.fromStatic({ name: 'Pack base' });
  const edited = JSON.parse(JSON.stringify(base));
  const pe = WD.editor(edited, null);
  const first = edited.clubs[0].id;
  check(
    pe.setClub(first, {
      name: 'Packed United',
      nick: 'The Packers',
      crest: [2, 3, 4],
      kit: { home: '#aa0000', away: '#0000aa' },
      rep: 77,
    }).ok,
    'the club for the pack was not edited',
  );
  pe.setLeague('D1', { name: 'Pack League', short: 'PKL' });
  pe.setCup('CUPENG', { name: 'Pack Cup', short: 'PKC' });
  const pack = WD.packOf(edited);
  check(!('rep' in pack.clubs[0]) && !('players' in pack), 'a pack carries ratings or players');
  const text = JSON.stringify(pack);
  const fresh = WD.fromStatic({ name: 'fresh' });
  const rp = WD.applyPack(fresh, WD.parsePack(text));
  const fc = fresh.clubs.find((c) => c.id === first),
    bc = base.clubs.find((c) => c.id === first);
  check(
    fc.name === 'Packed United' &&
      fc.nick === 'The Packers' &&
      fc.crest.join() === '2,3,4' &&
      fc.kit.home === '#aa0000',
    'the pack did not rename and redraw the club',
  );
  check(fc.rep === bc.rep && fc.league === bc.league, 'the pack changed a rating or a league');
  check(fresh.leagues.find((l) => l.id === 'D1').name === 'Pack League', 'the pack did not rename the league');
  check(
    (fresh.competitions.find((c) => c.id === 'CUPENG') || {}).name === 'Pack Cup',
    'the pack did not rename the cup',
  );
  check(
    rp.clubs === base.clubs.length && rp.unmatched.length === 0 && rp.errors.length === 0,
    'the pack report is wrong',
  );
  const odd = JSON.parse(text);
  odd.clubs.push({ id: 'c_NOPE', name: 'Nobody FC' });
  check(
    WD.applyPack(WD.fromStatic({ name: 'x' }), odd).unmatched.join() === 'c_NOPE',
    'a club not in the world was not reported',
  );
  let threw = false;
  try {
    WD.parsePack('{"format":"touchline-world"}');
  } catch (e) {
    threw = true;
  }
  check(threw, 'a world file was read as a pack');
  const imp = DB.import([{ name: 'pack.json', text }]);
  check(
    imp.ok && imp.adapter === 'touchline-pack' && imp.def.clubs.find((c) => c.id === first).name === 'Packed United',
    'the new-career import did not read the pack: ' + (imp.errors || []).join('; '),
  );
}
// a league split into groups: bad splits are refused, a good one is played
{
  const pt = def.clubs.filter((c) => c.league === 'PT1').length;
  const base = lg('PT1').rules;
  const split = (over) => ({
    rules: {
      ...base,
      split: {
        after: 34,
        groups: [9, 9],
        rounds: ['single', 'single'],
        names: ['Championship', 'Relegation'],
        halve: true,
        ...over,
      },
    },
  });
  check(!E.setLeague('PT1', split({ groups: [8, 9] })).ok, 'groups that do not add up to the clubs were accepted');
  check(!E.setLeague('PT1', split({ groups: [1, 17] })).ok, 'a group of one club was accepted');
  check(
    !E.setLeague('PT1', split({ rounds: ['single', 'triple'] })).ok,
    'a group playing a triple round-robin was accepted',
  );
  check(!E.setLeague('PT1', split({ names: ['Championship', ''] })).ok, 'a group with no name was accepted');
  check(!E.setLeague('PT1', split({ after: 3 })).ok, 'a split after three rounds was accepted');
  check(
    !E.setLeague('PT1', { rules: { ...base, legs: 1, split: split({}).rules.split } }).ok,
    'a split league played once each was accepted',
  );
  check(pt === 18, `expected eighteen clubs in the Portuguese league, found ${pt}`);
  check(E.setLeague('PT1', split({})).ok, 'a valid split was refused');
}
// a player called up for his country (and too many of them)
{
  const fr = def.players.find((p) => p.ln === 'Freeman');
  check(E.updatePlayer(fr.id, { callup: true }).ok, 'a player could not be called up');
  const bad = JSON.parse(JSON.stringify(def));
  for (let i = 0; i < 27; i++) bad.players.push({ ...fr, id: 'dp_cu' + i, ln: 'Cu' + i, callup: true });
  check(
    WD.validate(bad, null).errors.some((e) => /national team ENG: 2\d players called up/.test(e)),
    'twenty-seven players called up for one nation were accepted',
  );
}
// international football: bad settings are refused, good ones kept
check(!E.setIntl({ cycle: 9 }).ok, 'a World Championship year of 9 was accepted');
check(
  !E.setIntl({ tourns: { EC: { ...WD.intlNow().tourns.EC, qual: 5 } } }).ok,
  'qualifying groups of five were accepted',
);
check(
  !E.setIntl({ tourns: { CT: { name: 'Trophy', slots: [], qual: 3 } } }).ok,
  'qualifying groups for an invitation were accepted',
);
check(
  !E.setIntl({ tourns: { WC: { name: 'Global Cup', slots: [9, 3, 2, 1, 2] } } }).ok,
  'seventeen places in a sixteen-nation cup were accepted',
);
check(!E.setIntl({ tourns: { XX: { name: 'No Such Cup' } } }).ok, 'a tournament the game does not have was accepted');
check(
  !E.setIntl({ invites: [{ id: 'KIR', name: 'Test Invitational', host: 'NOWHERE' }] }).ok,
  'an unknown host nation was accepted',
);
check(
  !E.setNation('ENG', { tactic: { formation: '9-9-9', buildup: 'Short', press: 'Mid Block', width: 'Balanced' } }).ok,
  'a formation of 9-9-9 was accepted',
);
check(
  E.setIntl({
    cycle: 0,
    tourns: {
      WC: { name: 'Global Cup', slots: [8, 4, 2, 1, 1], qual: 3 },
      EC: { ...WD.intlNow().tourns.EC, name: 'Euro Test Cup', qual: 3 },
      SA: { ...WD.intlNow().tourns.SA, qual: 2 },
    },
    invites: [{ id: 'KIR', name: 'Test Invitational', host: 'ESP' }],
  }).ok,
  'valid international settings were refused',
);
check(
  E.setNation('ENG', { tactic: { formation: '4-4-2', buildup: 'Direct', press: 'High Press', width: 'Wide' } }).ok,
  'a national team style was refused',
);
// history: a past season for the Premier Division, with a champion who is not its strongest club
const dd = def.clubs.filter((c) => c.league === 'D1');
const order = dd.map((c) => c.id);
const games = (order.length - 1) * 2;
const tbl = WD.makeTable(order, games, def.rules.win);
check(
  tbl.every((r) => r.p === r.w + r.d + r.l) && tbl.reduce((a, r) => a + r.gf, 0) === tbl.reduce((a, r) => a + r.ga, 0),
  'a made-up table does not add up',
);
check(
  tbl.every((r, i) => i === 0 || tbl[i - 1].pts >= r.pts),
  'a made-up table is not in order',
);
const ranked = [order[3], order[0], ...order.filter((i) => i !== order[3] && i !== order[0])];
check(
  E.addSeason({
    year: def.meta.startYear - 1,
    comps: { D1: { champion: order[3], runnerUp: order[0], table: WD.makeTable(ranked, games, def.rules.win) } },
  }).ok,
  'a valid past season was refused',
);
check(!E.addSeason({ year: def.meta.startYear + 2, comps: {} }).ok, 'a season after the start was accepted');
// a past cup final, and a cup winner who is not in the right nation is refused
const cupClub = def.clubs.find((c) => c.nat === 'ENG' && c.league === 'D1').id;
check(
  E.addSeason({
    year: def.meta.startYear - 2,
    comps: {},
    cups: { CUPENG: { winner: cupClub, runnerUp: null } },
    transfers: [
      { name: 'Cheap Signing', nat: 'ENG', from: null, to: cupClub, fee: 1e6 },
      { name: 'Big Signing', nat: 'BRA', from: d1[3].id, to: cupClub, fee: 90e6 },
    ],
  }).ok,
  'a season with a cup winner was refused',
);
check(
  !E.addSeason({ year: def.meta.startYear - 5, comps: {}, transfers: [{ name: 'Lost', to: 'c_NOPE', fee: 1 }] }).ok,
  'a transfer to a club that does not exist was accepted',
);
check(
  !E.addSeason({ year: def.meta.startYear - 5, comps: {}, transfers: [{ name: 'Free Lunch', to: cupClub, fee: -4 }] })
    .ok,
  'a negative fee was accepted',
);
check(
  !E.addSeason({ year: def.meta.startYear - 3, comps: {}, cups: { NOSUCH: { winner: cupClub } } }).ok,
  'a season with a cup the game does not have was accepted',
);
check(
  E.addSeason({ year: def.meta.startYear - 4, comps: {}, intl: { WC: { winner: 'ARG', runnerUp: 'ARG' } } }).ok ===
    false,
  'a final between a nation and itself was accepted',
);
check(
  E.addSeason({
    year: def.meta.startYear - 4,
    comps: {},
    intl: { WC: { winner: 'ARG', runnerUp: 'BRA' }, EC: { winner: 'ENG' } },
  }).ok,
  'a season with tournament winners was refused',
);
def.meta.fillHistory = true;
const chk = DB.check(def);
// refusing what would break a league
{
  const bad = JSON.parse(JSON.stringify(def));
  const lg = bad.clubs.filter((c) => c.league === 'D4' && !c.parent);
  for (const c of lg.slice(0, 20)) (bad.removeClubs.push(c.id), (bad.clubs = bad.clubs.filter((x) => x.id !== c.id)));
  check(!DB.check(bad).ok, 'removing twenty clubs of a league of 24 was accepted');
}
check(chk.ok, 'the edited definition did not check: ' + chk.errors.join('; '));
const patch = WD.patchOf(def);
check(
  patch.clubs.filter((c) => c.isNew).length === 12,
  `expected twelve new clubs in the patch, got ${patch.clubs.filter((c) => c.isNew).length}`,
);
check(
  patch.clubs.filter((c) => !c.isNew).length === 2,
  `expected two changed clubs, got ${patch.clubs.filter((c) => !c.isNew).length}`,
);

// the world the new-career screen would build
const res = { ...chk, def };
DB.stage(res);
check(
  FM.D.allClubRows().some((row) => row[0] === 'Alphaton'),
  'the staged data does not list the new club',
);
DB.build(def, { ...W.REAL_RULES, win: def.rules.win, subs: def.rules.subs });
Sea.init();
const S = FM.S;
check(
  S.clubs.c_ZZA1 && S.clubs.c_ZZA1.name === 'Alphaton' && S.clubs.c_ZZA1.comp === 'D1',
  'the new Premier Division club is not in the world',
);
check(S.clubs.c_ZZB1 && S.clubs.c_ZZB1.comp === 'D3', 'the new Third Division club is not in the world');
check(W.squad('c_ZZA1').length >= 16, 'the new club has no squad');
const rn = S.clubs[d1[0].id];
check(
  rn.name === 'Renamed Rovers' && rn.colors[0] === '#cc0000' && rn.stadium.cap === 61000,
  'the renamed club did not keep its changes',
);
{
  const x = S.clubs[X];
  check(
    x.crest && x.crest.join() === '1,4,6' && FM.D.CLUB_INFO[X.slice(2)][3].join() === '1,4,6',
    'the crest did not reach the world and the picker',
  );
  check(x.kit && x.kit.home === '#123456' && x.kit.away === '#fedcba', 'the kit did not reach the club');
  check(x.balance === 250e6 && x.budget === 80e6, 'the money did not reach the club');
  check(
    x.facilities.training === 5 && x.facilities.academy === 5 && x.facilities.museum === 1,
    'the facilities did not reach the club',
  );
  check(
    x.attr &&
      x.attr.market === 9 &&
      x.attr.support === 8.5 &&
      x.attr.own === 'sovereign' &&
      x.attr.ceil > x.rep &&
      x.attr.hist === x.rep,
    'the supporters and owner did not reach the club',
  );
  check(!S.clubs[d1[2].id].crest, 'a club with no crest of its own was given one');
}
check(
  S.comps.D1.clubs.includes(moved.id) && !S.comps.D2.clubs.includes(moved.id),
  'the moved club is not in its new league',
);
{
  const sq = W.squad(mine);
  const made = sq.filter((p) => p.defId);
  check(made.length === 11, `the club given eleven players has ${made.length} of them in its squad`);
  check(
    made.every((p) => /^Maker/.test(p.fn)),
    'a made player lost his name',
  );
  // (he has ten midfielders: the generated ones are gone, and the positions he left empty were made up)
  check(
    sq.filter((p) => !p.defId && p.pos === 'CM' && !p.team && !p.youth).length === 0,
    'the generated midfielders were not replaced',
  );
  check(
    sq.filter((p) => !p.defId && !p.team && !p.youth).length >= 8,
    'the squad was not made up where the made players left gaps',
  );
  check(
    sq.some((p) => p.pos === 'GK' && p.defId),
    'the made goalkeeper is missing',
  );
}
{
  {
    const iv = Object.values(S.players).filter((p) => p.defId && p.ln === 'Import');
    check(
      iv.length === 1 && !iv[0].clubId && iv[0].pos === 'ST' && iv[0].ca > 35,
      'the imported striker is not a free agent in the world',
    );
    const kim = Object.values(S.players).filter((p) => p.defId && p.ln === 'Club');
    check(
      kim.length === 1 && kim[0].clubId && S.clubs[kim[0].clubId].comp === 'D2',
      'the imported defender is not at his club',
    );
  }
  const fa = Object.values(S.players).filter((p) => p.defId && !p.clubId && p.ln === 'Freeman');
  check(fa.length === 1 && fa[0].contract >= S.year, 'the made free agent is not in the world as one');
  const st = S.staff[S.clubs[mine].manager];
  check(
    st && st.fn === 'Ivor' && st.ln === 'Edit' && st.ability === 18 && st.personality === 'Cautious' && st.rep === 85,
    'the club has not got the manager made for it',
  );
  check(S.comps.CUPENG.name === 'Editor Test Cup' && S.comps.CUPENG.short === 'ETC', 'the renamed cup kept its name');
  check(S.rules.win === 2 && S.rules.subs === 3, 'the rules the editor set are not those of the world');
}
check(!S.clubs[gone], 'the club taken out is still in the world');
check(
  S.clubs.c_URU1 && S.comps.URU1 && S.comps.URU1.clubs.length === 10,
  'the new league in a new nation is not in the world',
);
check(W.squad('c_URU1').length >= 16, 'a club of the new league has no squad');
check(
  S.comps.CL.clubs.length === 8 && S.comps.CL.groups.length === 2,
  `the South American cup has ${S.comps.CL.clubs.length} clubs in ${S.comps.CL.groups.length} groups with the new league's place`,
);
const n1 = S.comps.D1.clubs.length,
  d2n = S.comps.D2.clubs.length,
  d3n = S.comps.D3.clubs.length;
console.log(`D1 has ${n1} clubs`);
{
  check(
    S.comps.CUPENG.opts.neutral === 'all' && S.comps.CUPENG.opts.legs.join() === '4,2',
    'the cup format did not reach the world',
  );
  check(
    S.comps.CUPITA.opts.legs.length === 0 && S.comps.CUPITA.opts.neutral.length === 0,
    'the Italian cup kept its old format',
  );
  check(
    S.comps.PT1.rules.split && S.comps.PT1.rules.split.halve && S.comps.PT1.rules.split.groups.join() === '9,9',
    'the split did not reach the league',
  );
  check(
    S.comps.AF.groups.length >= 2 &&
      S.comps.AF.groups.every((g) => g.clubs.length === 3) &&
      S.comps.AF.groups[0].fixtures.length === 6,
    'the African cup does not play in groups of three',
  );
  check(
    S.comps.NC.groups.every((g) => g.clubs.length === 5) && S.comps.NC.groups[0].fixtures.length === 5,
    'the North American cup does not play groups of five once each',
  );
  check(
    S.quals &&
      S.quals.groups.some((g) => g.tn === 'SA') &&
      S.quals.groups.filter((g) => g.tn === 'SA').every((g) => g.teams.length <= 2) &&
      S.quals.groups.filter((g) => g.tn === 'EC').every((g) => g.teams.length <= 3),
    'the qualifying groups are not the size set',
  );
  check(
    FM.Intl.squad('ENG').some((p) => p.ln === 'Freeman') && FM.Intl.pool('ENG')[0].ln === 'Freeman',
    'the player called up is not first in his nations pool',
  );
  check(!S.comps.CUPFRA && !S.comps.CUPJPN && S.comps.CUPENG, 'the cups taken out are still in the world');
  check(
    FM.Intl.INVITES.length === 1 && FM.Intl.INVITES[0].id === 'KIR',
    'the invitationals taken out are still played: ' + FM.Intl.INVITES.map((v) => v.id).join(),
  );
  const f = FM.Cups.formatOf(S.comps.AF);
  check(
    f.legs.qf === 1 && f.legs.sf === 1 && f.legs.f === 1 && f.central,
    'the African cup format did not reach the world',
  );
  check(FM.Cups.formatOf(S.comps.CC).legs.qf === 2, 'a continental cup that was not edited changed');
  check(
    FM.Intl.CYCLE === 0 &&
      FM.Intl.tournamentFor(S.year) === 'continental' &&
      FM.Intl.tournamentFor(S.year + 2) === 'world',
    'the World Championship year did not reach the world',
  );
  check(
    FM.Intl.TOURNS.world[0].name === 'Global Cup' &&
      FM.Intl.TOURNS.world[0].pools[0][1] === 8 &&
      FM.Intl.TNAME.WC === 'Global Cup',
    'the tournament name and places did not reach the world',
  );
  check(
    FM.Intl.INVITES[0].name === 'Test Invitational' && FM.Intl.INVITES[0].host === 'ESP',
    'the invitational did not change',
  );
  check(
    S.nteams.n_ENG.tactic.formation === '4-4-2' && S.nteams.n_ENG.tactic.width === 'Wide',
    'the national team style did not reach the world',
  );
  check(
    S.nteams.n_ARG.titles.WC >= 1 &&
      S.archive.some((e) => e.intl && e.intl.some((r) => r.id === 'WC' && r.winner === 'n_ARG')),
    'the past World Championship is not in the archive and the nations titles',
  );
  check(
    S.comps.CUPURU &&
      S.comps.CUPURU.name === 'Uruguayan Test Cup' &&
      S.comps.CUPURU.clubs.length === 10 &&
      S.comps.CUPURU.prize === 2e6,
    'the definitions own cup is not in the world',
  );
  check(
    S.comps.ES2.rules.legs === 1 && S.comps.DE1.rules.tiebreak.join() === 'wins,gd,gf',
    'the league formats did not reach the world',
  );
  check(
    S.comps.D3.rules.promote.tie && S.comps.D2.rules.relegate.playoff,
    'the relegation play-off pair did not reach the world',
  );
  check(
    S.comps.ES2.fixtures.length === S.comps.ES2.clubs.length - 1,
    'a league played once each does not have a single round-robin',
  );
  check(S.comps.CUPENG.prize === 7e6 && S.comps.AF.prize === 6e6, 'the prize funds did not reach the world');
  check(
    S.comps.CUPENG.clubs.length > 8 &&
      S.comps.CUPENG.clubs.every((id) => S.comps[S.clubs[id].comp].tier <= 2) &&
      S.comps.CUPESP.clubs.some((id) => S.comps[S.clubs[id].comp].tier > 2),
    'the cup kept to the top two divisions did not, or another cup was cut down',
  );
  check(
    S.archive.some((e) => e.year === S.year - 2 && e.cups.CUPENG && e.cups.CUPENG.winner === cupClub) &&
      S.clubs[cupClub].titles.CUPENG >= 1,
    'the past cup winner is not in the archive and the honours',
  );
  {
    const tr = (S.archive.find((e) => e.year === S.year - 2) || {}).transfers || [];
    check(
      tr.length === 2 &&
        tr[0].name === 'Big Signing' &&
        tr[0].fee === 90e6 &&
        !tr[0].intl &&
        tr[0].to === cupClub &&
        tr[1].from === null,
      'the past season transfers are not in the archive, biggest first',
    );
  }
  check(
    S.clubs[drb[0].id].rival === drb[1].id && S.clubs[drb[0].id].derby === 'The Editor Derby',
    'the new derby is not in the world',
  );
  check(!S.clubs[builtDerby[0]] || !S.clubs[builtDerby[0]].rival, 'a derby taken out is still in the world');
  check(S.clubs.c_ZZB1.parent === parent, 'the B team has not got its parent');
  const tn = S.nteams.n_ENG;
  check(
    tn && tn.name === 'Albion' && tn.short === 'ALB' && tn.coef === 88 && tn.colors[0] === '#112233',
    'the national team edit did not reach the world',
  );
  check(
    S.archive.some((e) => e.year === S.year - 1 && e.imported && e.comps.D1.champion === order[3]),
    'the past season is not in the archive',
  );
  check(S.clubs[order[3]].titles && S.clubs[order[3]].titles.D1 >= 1, 'the champion of a past season has no title');
}
W.takeCharge(mine, 'Test Manager');
{
  const u = S.user;
  check(
    S.staff[u.staff.assistant].fn === 'Ada' && S.staff[u.staff.assistant].ability === 19,
    'the assistant made for the club did not come with the job',
  );
  check(
    S.staff[u.scouts[0]].fn === 'Sam' && u.scouts.length === 3,
    'the scout made for the club did not come with the job',
  );
  check(S.staff[u.staff.coach].fn !== 'Free', 'a coach on offer was given to the club');
  {
    const sc = S.staff[u.scouts[0]];
    check(
      sc.personality === 'Loyal' &&
        sc.wage === 12345 &&
        sc.contract === S.year + 4 &&
        sc.regions.SAM === 0.95 &&
        sc.judge === 16,
      'the scout details did not come with the job',
    );
    check(
      S.clubs[mine].tactic.formation === '4-4-2' && S.clubs[mine].tactic.press === 'Low Block',
      'the managers system did not reach the club',
    );
    check(
      FM.D.AGENT_FIRMS.length === 3 && FM.D.AGENT_FIRMS[0] === 'Test Agency One',
      'the agent firms did not reach the game',
    );
  }
  check(
    S.staffPool.some((id) => S.staff[id].fn === 'Free' && S.staff[id].role === 'First-Team Coach'),
    'the coach on offer is not in the staff market',
  );
}
W.seedHistory();
{
  const ys = S.archive.map((e) => e.year);
  check(
    ys.length === 30 && new Set(ys).size === 30 && ys.every((y, i) => i === 0 || y > ys[i - 1]),
    `filling the years before gave ${ys.length} seasons, not 30 in order`,
  );
  check(
    S.archive.find((e) => e.year === S.year - 1).imported,
    'the season entered by hand was replaced by an invented one',
  );
}
W.goUnemployed('test');
const year = S.year;
let g = 0;
while (FM.S.year === year && g++ < 500) Sea.advance(null);
check(FM.S.year === year + 1, 'the season never ended');
const arch = FM.S.archive.at(-1);
const t = arch && arch.comps.D1 && arch.comps.D1.table;
check(t && t.length === n1, `the archived Premier Division table has ${t && t.length} rows, not ${n1}`);
check(
  t && t.every((row) => row.p === (n1 - 1) * 2),
  `clubs played ${t && [...new Set(t.map((x) => x.p))].join('/')} games, not ${(n1 - 1) * 2}`,
);
check(
  arch && arch.cups && arch.cups.CUPURU && arch.cups.CUPURU.winner && FM.S.comps.CUPURU.clubs.length === 10,
  'the definitions own cup was not played',
);
{
  const es2 = arch && arch.comps.ES2 && arch.comps.ES2.table;
  check(
    es2 && es2.every((r) => r.p === es2.length - 1),
    'the league played once each did not play a single round-robin',
  );
  check(
    FM.S.comps.D2.clubs.length === d2n && FM.S.comps.D3.clubs.length === d3n,
    'the relegation play-off pair changed the sizes of its leagues',
  );
}
{
  const pt = arch && arch.comps.PT1 && arch.comps.PT1.table;
  check(
    pt && pt.length === 18 && pt.every((r) => r.p === 42),
    'the split league did not play 34 rounds and then eight more: ' +
      (pt && [...new Set(pt.map((r) => r.p))].join('/')),
  );
  check(
    pt &&
      arch.comps.PT1.split &&
      arch.comps.PT1.split.groups.length === 2 &&
      arch.comps.PT1.split.names[0] === 'Championship',
    'the archive has no record of the split',
  );
}
check(FM.S.comps.D1.clubs.length === n1, `the Premier Division changed size (${n1} to ${FM.S.comps.D1.clubs.length})`);
{
  const u = arch && arch.comps.URU1 && arch.comps.URU1.table;
  check(u && u.length === 10 && u.every((r) => r.p === 18), 'the new league did not play its season');
  const t3 = arch && arch.comps.D3 && arch.comps.D3.table;
  check(
    t3 && t3.length === 24 && t3.every((r) => r.p === 46),
    'the third division (one out, one in) did not play 46 games each',
  );
}
// a save keeps the database, and a plain new world afterwards has none of it
check(FM.S.database && FM.S.database.name === 'Editor test', 'the world does not remember its database');
DB.clear();
check(
  FM.D.DOMESTIC_CUPS.some((c) => c[0] === 'CUPFRA') &&
    FM.D.DOMESTIC_CUPS.some((c) => c[0] === 'CUPJPN') &&
    FM.Intl.INVITES.length === 3,
  'clearing the database did not bring back the cups and invitationals taken out',
);
check(!(FM.D.CLUB_INFO[X.slice(2)] || [])[3], 'clearing the database left the crest in the picker data');
check(
  FM.D.AGENT_FIRMS.length === 12 && FM.D.AGENT_FIRMS[0] === 'Apex Sports Group',
  'clearing the database left the agent firms changed',
);
check(
  FM.Intl.CYCLE === 2 &&
    FM.Intl.TOURNS.world[0].name === 'FIFA World Cup' &&
    FM.Intl.TOURNS.world[0].pools[0][1] === 9 &&
    FM.Intl.TNAME.WC === 'FIFA World Cup' &&
    FM.Intl.INVITES[0].host === 'JPN',
  'clearing the database left the international settings changed',
);
check(!FM.D.allClubRows().some((row) => row[0] === 'Alphaton'), 'clearing the database left the new club in the data');

console.log(fails.length ? 'FAIL\n' + fails.join('\n') : 'editor check passed');
process.exit(fails.length ? 1 : 0);
