// Historical data importer: reads historical datasets into a world definition (js/worlddef.js), using the real-stats
// converter (js/realstats.js) for player attributes. The base for historical eras and for club and league packs.
//
//   node tools/import-history.mjs --tables tables.csv [--players players.csv] [--clubs clubs.csv] [--cups cups.csv] [--transfers transfers.csv] [--out world.json]
//   node tools/import-history.mjs --dir data/samples/history [--out world.json]      (tables.csv, players.csv, clubs.csv)
//   node tools/import-history.mjs --test
//
// tables.csv   season, league, pos, club, p, w, d, l, gf, ga, pts     one row per club per season (season = the year it
//                                                                       started: 2023 for 2023/24); league is a league id
//                                                                       (D1) or its name; club is a club id (c_BAY), name
//                                                                       or short name
// players.csv  name, nat, born (or age), pos, club, league, minutes, goals, assists, xg, ... (see tools/realstats.mjs)
//                                                                       each row becomes a player at that club, converted
// clubs.csv    club, name, short, nick, city, colour1, colour2, rep, stadium, capacity     changes to clubs already in the world
// cups.csv     season, cup, winner, runnerup                                     a domestic cup's final (cup: its id or name)
// transfers.csv season, player, from, to, fee, nat                               a season's biggest transfers (fee in millions
//                                                                       up to 2000, else in full; the biggest twenty a season)
//
// Clubs are matched against the base world's clubs; whatever cannot be matched is listed and left out. The result is
// validated before it is written. Nothing here invents data: every number comes from the files. The code is
// js/histimport.js, which the game also uses to import the same CSV files from the new-career screen.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, loadSim } from './harness.mjs';

const args = parseArgs();
const { FM } = loadSim(+(args.seed || 4));
const W = FM.W,
  WD = FM.WorldDef,
  R = FM.RealStats;

// The importer itself is js/histimport.js (FM.HistImport), shared with the app's database import; here it matches against the loaded world.
const importHistory = (x, S = FM.S) => FM.HistImport.import(x, S);
export { importHistory };

const readTable = (f) => {
  const t = fs.readFileSync(f, 'utf8');
  return f.endsWith('.json') ? JSON.parse(t) : R.parseCSV(t);
};
const show = (rep) => {
  console.log(
    `${rep.seasons} past season(s) from ${rep.rows} table rows · ${rep.players} players · ${rep.clubEdits} club edits · ${rep.unmatched.length} unmatched names · ${rep.errors.length} errors · ${rep.warnings.length} warnings`,
  );
  if (rep.unmatched.length) console.log('Unmatched clubs (left out): ' + rep.unmatched.slice(0, 20).join(', '));
  for (const l of rep.skipped.slice(0, 10)) console.log('· ' + l);
  for (const e of rep.errors.slice(0, 15)) console.log('✗ ' + e);
  for (const w of rep.warnings.slice(0, 10)) console.log('· ' + w);
};

if ('test' in args) {
  W.newWorld(W.REAL_RULES);
  FM.Season.init();
  const d1 = Object.values(FM.S.clubs).filter((c) => c.comp === 'D1');
  const mk = (year) =>
    ['season,league,pos,club,p,w,d,l,gf,ga,pts']
      .concat(
        d1.map(
          (c, i) =>
            `${year},D1,${i + 1},${i % 2 ? c.name : c.id},38,${20 - i},8,${10 + i},${60 - i},${40 + i},${68 - 3 * i}`,
        ),
      )
      .join('\n');
  const tables = R.parseCSV(
    mk(2022) + '\n' + mk(2023).split('\n').slice(1).join('\n') + '\n2023,D1,99,Not A Real Club,38,1,1,36,5,90,4',
  );
  const players = R.parseCSV(
    `name,nat,born,pos,club,minutes,goals,assists,xg,shots,passes,passPct\nTest Striker,ENG,${FM.S.year - 25},ST,${d1[3].short},2700,20,4,16,95,480,75\nBad Row,ENG,2000,QB,${d1[0].id},900,1,1,1,1,1,70`,
  );
  const clubs = R.parseCSV(`club,name,colour1,colour2,capacity\n${d1[1].id},Renamed Albion,#223344,#eeeeee,40000`);
  const cupRows = R.parseCSV(
    `season,cup,winner,runnerup
2022,${FM.D.DOMESTIC_CUPS[0][0]},${d1[0].id},${d1[1].name}
2022,Not A Cup,${d1[0].id},
2024,${FM.D.DOMESTIC_CUPS[0][2]},${d1[2].short},${d1[0].id}`,
  );
  const moveRows = R.parseCSV(
    `season,player,from,to,fee,nat
2022,Big Signing,${d1[1].id},${d1[0].id},85,BRA
2022,Free Move,,${d1[2].id},0,ENG
2022,Lost Man,Unknown FC,${d1[0].id},5,ENG
2021,Old Deal,${d1[3].id},${d1[4].id},12000000,GER`,
  );
  const { def, report } = importHistory({
    tables,
    players,
    clubs,
    cups: cupRows,
    transfers: moveRows,
    name: 'Test import',
  });
  const fails = [];
  const check = (ok, msg) => ok || fails.push(msg);
  check(report.seasons === 4, `seasons ${report.seasons} (two with tables, two with only cups or transfers)`);
  check(report.cups === 2, `cup finals ${report.cups}`);
  check(
    report.skipped.some((x) => /Not A Cup/.test(x)),
    'a cup the game does not have was not reported',
  );
  const s22 = def.history.seasons.find((s) => s.year === 2022),
    s21 = def.history.seasons.find((s) => s.year === 2021);
  check(
    s22 &&
      s22.cups[FM.D.DOMESTIC_CUPS[0][0]].winner === d1[0].id &&
      s22.cups[FM.D.DOMESTIC_CUPS[0][0]].runnerUp === d1[1].id,
    'the cup final is not in the season',
  );
  check(
    s22 && s22.transfers.length === 2 && s22.transfers[0].name === 'Big Signing' && s22.transfers[0].fee === 85e6,
    'the big transfer is not first, in full',
  );
  check(s22 && s22.transfers[1].from === null, 'a move from no club kept a club');
  check(s21 && s21.transfers[0].fee === 12e6, 'a fee given in full was changed');
  check(report.unmatched.includes('Unknown FC'), 'the club he left, unknown, was not reported');
  check(report.unmatched.includes('Not A Real Club'), 'the unknown club was not reported');
  check(
    report.players === 1 && report.errors.some((e) => /Bad Row/.test(e)),
    'player rows: ' + JSON.stringify(report.errors.slice(0, 3)),
  );
  check(
    report.clubEdits === 1 && def.clubs.find((c) => c.id === d1[1].id).name === 'Renamed Albion',
    'the club edit was not made',
  );
  check(
    def.history.seasons.length === 4 &&
      def.history.seasons.find((s) => s.year === 2022).comps.D1.table.length === d1.length,
    'the seasons are not in the definition',
  );
  check(
    def.history.seasons.find((s) => s.year === 2022).comps.D1.champion === d1[0].id,
    'the champion is not the club on top of the table',
  );
  // it loads
  const out = WD.load(JSON.parse(WD.stringify(def)));
  check(out.seasons === 4 && out.playersAdded === 1, `loaded ${JSON.stringify(out)}`);
  console.log(fails.length ? 'FAIL\n' + fails.join('\n') : 'Historical importer: all checks passed.');
  process.exit(fails.length ? 1 : 0);
}

const dir = args.dir;
const file = (k, f) => args[k] || (dir && fs.existsSync(path.join(dir, f)) ? path.join(dir, f) : null);
const tf = file('tables', 'tables.csv'),
  pf = file('players', 'players.csv'),
  cf = file('clubs', 'clubs.csv'),
  cupf = file('cups', 'cups.csv'),
  trf = file('transfers', 'transfers.csv');
if (!tf && !pf && !cf && !cupf && !trf) {
  console.log(
    'usage: node tools/import-history.mjs --tables t.csv [--players p.csv] [--clubs c.csv] [--out world.json] | --dir folder | --test',
  );
  process.exit(1);
}
W.newWorld(W.REAL_RULES);
FM.Season.init();
const { def, report } = importHistory({
  tables: tf && readTable(tf),
  players: pf && readTable(pf),
  clubs: cf && readTable(cf),
  cups: cupf && readTable(cupf),
  transfers: trf && readTable(trf),
  name: args.name || 'Imported world',
});
show(report);
if (args.out && !report.errors.length) {
  fs.writeFileSync(args.out, WD.stringify(def));
  console.log(`Wrote ${args.out}`);
}
process.exit(report.errors.length ? 1 : 0);
