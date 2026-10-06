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
  check(DB.adapters().length === 2, 'adapters() should list two');

  console.log(
    fails.length
      ? fails.map((f) => '✗ ' + f).join('\n')
      : `✓ database import: ${DB.adapters().length} adapters, round trip of ${nClubs} clubs`,
  );
  process.exit(fails.length ? 1 : 0);
}

console.log('node tools/dbimport.mjs --check file.json | --test');
