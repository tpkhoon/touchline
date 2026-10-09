// Database import tool and self-check for the framework (js/dbimport.js).
//   node tools/dbimport.mjs --check file.json     what the game would make of a database file
//   node tools/dbimport.mjs --test                self-check (npm run test:dbimport)
import fs from 'node:fs';
import { parseArgs, loadSim } from './harness.mjs';

const args = parseArgs();
const { FM } = loadSim(+(args.seed || 4));
const DB = FM.DbImport,
  W = FM.W,
  WD = FM.WorldDef;

if ('check' in args) {
  const r = DB.import([{ name: args.check, text: fs.readFileSync(args.check, 'utf8') }]);
  console.log(r.ok ? `✓ ${r.adapterName}: loads` : '✗ cannot load');
  if (r.summary) console.log(r.summary);
  [...r.errors.map((e) => '✗ ' + e), ...r.warnings.map((w) => '· ' + w)].slice(0, 40).forEach((l) => console.log(l));
  process.exit(r.ok ? 0 : 1);
}

if ('test' in args) {
  const fails = [];
  const check = (ok, msg) => {
    if (!ok) fails.push(msg);
  };
  W.newWorld(W.REAL_RULES);
  FM.Season.init();
  const base = FM.S;
  const nClubs = Object.keys(base.clubs).length;
  const def = WD.fromState(base, { name: 'Round trip', players: false });
  def.meta.author = 'test';
  def.meta.version = '1.0';
  const text = WD.stringify(def);

  // a world definition reads, checks and builds a world of the same size
  const r = DB.import([{ name: 'w.json', text }]);
  check(r.ok && r.adapter === 'touchline-world', `a world definition did not import: ${r.errors}`);
  check(
    r.summary && r.summary.clubs === nClubs,
    `summary has ${r.summary && r.summary.clubs} clubs, expected ${nClubs}`,
  );
  // a renamed club comes through to the world, and the world remembers its source
  const first = def.clubs[0];
  first.name = 'Imported Rovers';
  const r2 = DB.import([{ name: 'w.json', text: WD.stringify(def) }]);
  check(r2.ok, `edited definition did not import: ${r2.errors}`);
  DB.build(r2.def, W.REAL_RULES);
  FM.Season.init();
  check(FM.S.clubs[first.id].name === 'Imported Rovers', 'the renamed club did not reach the world');
  check(Object.keys(FM.S.clubs).length === nClubs, 'the imported world has a different number of clubs');
  check(FM.S.database && FM.S.database.name === 'Round trip', 'the world does not remember its database');

  // refusals are reasons, not exceptions
  for (const [name, t] of [
    ['empty', ''],
    ['not json', 'hello'],
    ['other json', '{"a":1}'],
    ['newer format', JSON.stringify({ ...def, version: 99 })],
    ['broken definition', JSON.stringify({ ...def, clubs: [{ id: 'c_x' }] })],
  ]) {
    const x = DB.import([{ name, text: t }]);
    check(!x.ok && x.errors.length, `"${name}" was not refused`);
  }
  check(!DB.import([]).ok, 'no files was not refused');

  // adapters are pluggable: a new one is found, and re-registering replaces it
  DB.register({
    id: 'test-fmt',
    name: 'Test format',
    accepts: '.tst',
    detect: (f) => /\.tst$/.test(f[0].name),
    parse: () => ({ def: JSON.parse(text), notes: ['converted'] }),
  });
  const x = DB.import([{ name: 'a.tst', text: 'x' }]);
  check(
    x.ok && x.adapter === 'test-fmt' && x.notes[0] === 'converted',
    `a registered adapter was not used: ${x.errors}`,
  );
  check(DB.accept().includes('.tst') && DB.accept().includes('.json'), 'accept() misses a format');
  check(DB.adapters().length === 4, 'adapters() should list four (world, pack, tables, the test one)');

  // ---- new clubs and leagues, staged into the game's data, built, saved and restored ----
  const D = FM.D;
  const nLeagues = D.LEAGUES.length,
    nRows = D.allClubRows().length;
  const sdef = WD.fromStatic({ name: 'Extra league' });
  sdef.meta.author = 'test';
  sdef.leagues.push({
    id: 'XL1',
    name: 'Test Premier',
    short: 'TST',
    nat: 'ENG',
    tier: 5,
    sim: 'full',
    repBand: [40, 30],
    rules: {},
  });
  for (let i = 1; i <= 8; i++)
    sdef.clubs.push({
      id: 'c_TL' + i,
      name: `Testville ${i}`,
      short: 'TL' + i,
      nick: 'Testers',
      city: `Testville ${i}`,
      colors: ['#112233', '#ffeedd'],
      identity: 'historic',
      rep: 36,
      league: 'XL1',
      stadium: { name: `Test Park ${i}`, cap: 6000 },
    });
  sdef.clubs.find((c) => c.id === 'c_MCI').name = 'Renamed City';
  const sr = DB.import([{ name: 's.json', text: WD.stringify(sdef) }]);
  check(sr.ok, `a world with a new league did not import: ${sr.errors}`);
  DB.stage(sr);
  check(
    D.LEAGUES.length === nLeagues + 1 && D.allClubRows().length === nRows + 8,
    'staging did not add the league and its clubs',
  );
  check(sr.summary.newLeagues === 1 && sr.summary.newClubs === 8, `summary: ${JSON.stringify(sr.summary)}`);
  check(
    D.allClubRows().some((r) => r[0] === 'Renamed City'),
    'the staged data lacks the renamed club',
  );
  DB.clear();
  check(D.LEAGUES.length === nLeagues && D.allClubRows().length === nRows, 'clearing did not undo the staging');
  check(
    !D.allClubRows().some((r) => r[0] === 'Renamed City') && !D.CLUB_INFO.TL1,
    'clearing left the rename or the new club info',
  );
  DB.stage(DB.import([{ name: 's.json', text: WD.stringify(sdef) }]));
  DB.build(sdef, W.REAL_RULES);
  FM.Season.init();
  check(FM.S.comps.XL1 && FM.S.comps.XL1.clubs.length === 8, 'the new league has no clubs in the world');
  check(
    FM.S.clubs.c_TL1 && FM.S.clubs.c_TL1.name === 'Testville 1' && W.squad('c_TL1').length >= 18,
    'the new club has no squad',
  );
  check(FM.S.clubs.c_MCI.name === 'Renamed City', 'the rename did not reach the world');
  check(FM.S.database.patch && FM.S.database.patch.leagues.length === 1, 'the world did not keep the patch');
  W.takeCharge('c_TL1', 'Test Manager');
  W.seedLegends();
  for (let d = 0; d < 12; d++) FM.Season.advance(null); // football in the new league
  // a saved world brings its data back on load, and a world without a database puts the built-in data back
  const saved = JSON.parse(JSON.stringify(FM.S));
  DB.clear();
  DB.restore(saved);
  check(D.LEAGUES.length === nLeagues + 1 && D.CLUB_INFO.TL1, 'restoring a save did not bring its leagues back');
  DB.restore({ ...saved, database: undefined });
  check(
    D.LEAGUES.length === nLeagues && D.allClubRows().length === nRows,
    'restoring a plain save did not put the built-in data back',
  );
  // exporting the world you play gives a file that imports
  DB.restore(saved);
  const ex = DB.import([{ name: 'e.json', text: DB.export({ withPlayers: false }) }]);
  check(
    ex.ok && ex.summary.clubs === nRows + 8,
    `the export did not import: ${ex.errors} ${ex.summary && ex.summary.clubs}`,
  );
  DB.clear();

  // ---- replacing every player ----
  W.newWorld(W.REAL_RULES);
  FM.Season.init();
  const pdef = WD.fromState(FM.S, { name: 'Players', players: true, replace: true });
  check(pdef.meta.players === 'replace', 'the export with players is not in replace mode');
  const some = pdef.clubs[3].id;
  let n = 0;
  pdef.players = pdef.players.filter((p) => p.club !== some || n++ % 3 !== 0); // a club left with a short squad
  const firstP = pdef.players.find((p) => p.club === some);
  firstP.fn = 'Replaced';
  firstP.ln = 'Player';
  const pr = DB.import([{ name: 'p.json', text: WD.stringify(pdef) }]);
  check(pr.ok, `a replace definition did not import: ${pr.errors}`);
  DB.build(pr.def, W.REAL_RULES);
  const sq = W.squad(some);
  check(
    sq.some((p) => p.fn === 'Replaced' && p.defId),
    'the defined player is not in the squad',
  );
  check(sq.length >= 18, `the short squad was not made up: ${sq.length}`);
  check(
    sq.filter((p) => p.defId).length === pdef.players.filter((p) => p.club === some).length,
    'the club kept generated players beside the defined ones',
  );
  DB.clear();

  // ---- the CSV adapter ----
  const csv = ['season,league,pos,club,p,w,d,l,gf,ga,pts']
    .concat(
      D.CLUBS_D1.map((r, i) => `2023,D1,${i + 1},c_${r[1]},38,${20 - i},8,${10 + i},${60 - i},${40 + i},${68 - 3 * i}`),
    )
    .join('\n');
  const cr = DB.import([{ name: 'tables.csv', text: csv }]);
  check(
    cr.ok && cr.adapter === 'history-csv' && cr.summary.seasons === 1,
    `the CSV tables did not import: ${cr.errors} ${cr.adapter}`,
  );
  check(!DB.import([{ name: 'x.csv', text: 'a,b\n1,2' }]).ok, 'an unknown CSV was not refused');

  console.log(
    fails.length
      ? fails.map((f) => '✗ ' + f).join('\n')
      : `✓ database import: ${DB.adapters().length} adapters, round trip of ${nClubs} clubs`,
  );
  process.exit(fails.length ? 1 : 0);
}

console.log('node tools/dbimport.mjs --check file.json | --test');
