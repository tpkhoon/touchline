// The phone's world (dist/data/world-phone.touchline): it opens inside a heap a phone's browser engine can give a page (this is run
// under --max-old-space-size by tools/preparedchecks.mjs, and dies when the world needs more), it has the clubs of the full world and
// most of the players, it has no season-by-season past, and a career can start in it and play a few days.
//   node --max-old-space-size=450 tools/phonecheck.mjs --open-only        (just opening it: what the heap limit is for)
//   node tools/phonecheck.mjs                                             (and starting a career, a few days, a save: no limit)
import fs from 'node:fs';
import zlib from 'node:zlib';
import { parseArgs, loadSim } from './harness.mjs';

const args = parseArgs();
const file = args.world || 'dist/data/world-phone.touchline';
const meta = JSON.parse(fs.readFileSync('dist/data/world.json', 'utf8'));
const { FM } = loadSim(3);
const W = FM.W,
  Sea = FM.Season;
const fails = [];
const check = (ok, msg) => ok || fails.push(msg);
let state = FM.Save.unpack(zlib.gunzipSync(fs.readFileSync(file)).toString('utf8'), { world: true }).state;
FM.DbImport && FM.DbImport.restore(state);
FM.S = state;
const heap = Math.round(process.memoryUsage().heapUsed / 1048576);
const players = Object.values(FM.S.players);
check(Object.keys(FM.S.clubs).length === meta.clubs, 'the phone world has other clubs than the full world');
check(players.length >= meta.players * 0.7, `the phone world has ${players.length} of ${meta.players} players`);
check(
  players.every((p) => !(p.history && p.history.length)),
  'a player of the phone world has a season-by-season past',
);
check(!state.user, 'the phone world has a manager');
if ('open-only' in args) {
  if (fails.length) {
    console.error('FAILED\n' + fails.join('\n'));
    process.exit(1);
  }
  console.log(`ok: opens, ${players.length} players, ${heap} MB of heap`);
  process.exit(0);
}
W.fitPreparedWorld(Object.fromEntries(FM.D.LEAGUES.map((l) => [l.id, 'minimal'])));
const club = Object.values(FM.S.clubs).find((c) => c.comp === 'D1' && c.rep < 75);
W.takeCharge(club.id, 'Phone Check');
W.topUpFullSquads();
check(W.squad(club.id).length >= 20, 'the club taken has a squad of ' + W.squad(club.id).length);
for (let i = 0; i < 4; i++) {
  const fx = Sea.userFixture();
  if (fx) Sea.applyUserMatch(FM.quickSim(fx, !!fx.ko));
  Sea.advance(null);
}
check(FM.S.day >= 3, 'the phone world would not play');
const p = W.squad(club.id)[0];
check(W.fullHistory(p, (p.history || []).slice().reverse()).length >= 1, 'a player has no career table');
const back = FM.Save.unpack(FM.Save.pack(FM.S)).state;
check(
  !!back.user && Object.keys(back.players).length === Object.keys(FM.S.players).length,
  'a save of the phone world does not open again',
);
if (fails.length) {
  console.error('FAILED\n' + fails.join('\n'));
  process.exit(1);
}
console.log(`ok: ${players.length} players, ${heap} MB of heap once open`);
