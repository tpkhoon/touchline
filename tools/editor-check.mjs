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
def.managers.push({ club: mine, fn: 'Ivor', ln: 'Edit', nat: 'ENG', age: 50, ability: 18 });
def.competitions = [{ id: 'CUPENG', name: 'Editor Test Cup', short: 'ETC', nat: null, type: 'cup' }];
def.rules.win = 2;
def.rules.subs = 3;
// cup formats: a bad one is refused, a good one is kept; a continental cup played in single matches at one venue
check(!E.setCup('CUPENG', { format: { legs: [3], neutral: [] } }).ok, 'a cup with a round of 3 clubs was accepted');
check(
  !E.setCup('AC', { format: { legs: { qf: 3, sf: 1, f: 1 }, central: true } }).ok,
  'a three-legged tie was accepted',
);
check(!E.setCup('CWC', { format: { legs: [2] } }).ok, 'a format for a cup the game gives none was accepted');
check(E.setCup('CUPENG', { format: { legs: [4, 2], neutral: 'all' } }).ok, 'a valid domestic cup format was refused');
check(E.setCup('CUPFRA', { format: { legs: [], neutral: [] } }).ok, 'a valid French cup format was refused');
check(
  E.setCup('AF', { format: { legs: { qf: 1, sf: 1, f: 1 }, central: true } }).ok,
  'a valid continental format was refused',
);
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
  E.addStaff({ role: 'Scout', fn: 'Sam', ln: 'Scout', nat: 'ARG', age: 40, ability: 17, club: mine }).ok,
  'a valid scout was refused',
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
  const fa = Object.values(S.players).filter((p) => p.defId && !p.clubId && p.ln === 'Freeman');
  check(fa.length === 1 && fa[0].contract >= S.year, 'the made free agent is not in the world as one');
  const st = S.staff[S.clubs[mine].manager];
  check(
    st && st.fn === 'Ivor' && st.ln === 'Edit' && st.ability === 18,
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
const n1 = S.comps.D1.clubs.length;
console.log(`D1 has ${n1} clubs`);
{
  check(
    S.comps.CUPENG.opts.neutral === 'all' && S.comps.CUPENG.opts.legs.join() === '4,2',
    'the cup format did not reach the world',
  );
  check(
    S.comps.CUPFRA.opts.legs.length === 0 && S.comps.CUPFRA.opts.neutral.length === 0,
    'the French cup kept its old format',
  );
  const f = FM.Cups.formatOf(S.comps.AF);
  check(
    f.legs.qf === 1 && f.legs.sf === 1 && f.legs.f === 1 && f.central,
    'the African cup format did not reach the world',
  );
  check(FM.Cups.formatOf(S.comps.CC).legs.qf === 2, 'a continental cup that was not edited changed');
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
check(!FM.D.allClubRows().some((row) => row[0] === 'Alphaton'), 'clearing the database left the new club in the data');

console.log(fails.length ? 'FAIL\n' + fails.join('\n') : 'editor check passed');
process.exit(fails.length ? 1 : 0);
