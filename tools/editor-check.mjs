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
def.meta.players = 'replace';
const chk = DB.check(def);
check(chk.ok, 'the edited definition did not check: ' + chk.errors.join('; '));
const patch = WD.patchOf(def);
check(
  patch.clubs.filter((c) => c.isNew).length === 2,
  `expected two new clubs in the patch, got ${patch.clubs.filter((c) => c.isNew).length}`,
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
DB.build(def, { ...W.REAL_RULES });
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
const n1 = S.comps.D1.clubs.length;
console.log(`D1 has ${n1} clubs`);
W.takeCharge(d1[2].id, 'Test Manager');
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
// a save keeps the database, and a plain new world afterwards has none of it
check(FM.S.database && FM.S.database.name === 'Editor test', 'the world does not remember its database');
DB.clear();
check(!FM.D.allClubRows().some((row) => row[0] === 'Alphaton'), 'clearing the database left the new club in the data');

console.log(fails.length ? 'FAIL\n' + fails.join('\n') : 'editor check passed');
process.exit(fails.length ? 1 : 0);
