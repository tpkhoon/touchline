// The prepared world: the world a new career starts in, made once at build time instead of on the player's device.
//   node tools/buildworld.mjs [--seed 20261] [--out dist/data]        needs `npm run build` first (it names the simulation it fits)
// It runs the generator with a fixed seed (the same seed always makes the same world), adds the world's own past (the
// seasons before the save, the clubs' legends), packs it as a save without a manager and gzips it: data/world.touchline,
// with data/world.json beside it (which simulation build it fits, its size, what it holds). The game loads it when it is for
// the simulation it is running, and makes a world the old way when it is not (or when the player asks for a random one).
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { parseArgs, loadSim, ROOT } from './harness.mjs';

const args = parseArgs();
const seed = +(args.seed || 20261);
const outDir = path.resolve(ROOT, args.out || 'dist/data');
const simFile = path.join(ROOT, 'dist', 'js', 'sim.min.js');
if (!fs.existsSync(simFile)) {
  console.error('dist/js/sim.min.js is missing: run npm run build first.');
  process.exit(1);
}
// (the same hash tools/build.mjs puts on the script's address: what the game compares to know the world fits it)
const simHash = crypto.createHash('sha256').update(fs.readFileSync(simFile, 'utf8')).digest('hex').slice(0, 10);

const t0 = Date.now();
const { FM } = loadSim(seed);
const W = FM.W;
// (every league in the light tier, which is what a new career starts every league it did not pick in; the leagues a career plays in full are filled up when it starts)
W.newWorld({ ...W.REAL_RULES, sims: Object.fromEntries(FM.D.LEAGUES.map((l) => [l.id, 'light'])) });
FM.Season.init();
W.seedHistory();
W.seedLegends();
const S = FM.S;
S.prepared = { seed, sim: simHash };
const raw = FM.Save.pack(S);
const gz = zlib.gzipSync(raw, { level: 9 });
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'world.touchline'), gz);
const meta = {
  format: 1,
  sim: simHash,
  seed,
  version: S.version,
  year: S.year,
  clubs: Object.keys(S.clubs).length,
  players: Object.keys(S.players).length,
  leagues: W.leagues().length,
  rawBytes: raw.length,
  bytes: gz.length,
  sha1: crypto.createHash('sha1').update(raw).digest('hex'),
};
// The phone's world: the same world with the players' season-by-season past left out (a profile's career table rebuilds it from his
// clubs and his totals, as it does for a player made later). The past is most of what a world weighs once it is open, and a phone's
// browser engine closes the app when a page needs more than a few hundred megabytes: the full world peaks at about 1.3 GB.
let history = 0,
  trimmed = 0;
for (const p of Object.values(S.players)) {
  history += (p.history || []).length;
  p.history = [];
}
// ... and the squads cut to sixteen, as a Minimal league's are (the league a career plays in is filled up again when it starts,
// W.topUpFullSquads): the best sixteen stay, with two goalkeepers at least
for (const c of Object.values(S.clubs)) {
  if (!c.comp || c.sim === 'nation') continue;
  const sq = W.squad(c.id)
    .filter((p) => !p.loan)
    .sort((a, b) => b.ca - a.ca);
  if (sq.length <= 16) continue;
  const keep = new Set(sq.slice(0, 16));
  const gks = sq.filter((p) => p.pos === 'GK');
  if (gks.length >= 2 && [...keep].filter((p) => p.pos === 'GK').length < 2) {
    const out = [...keep].reverse().find((p) => p.pos !== 'GK');
    keep.delete(out);
    keep.add(gks.find((g) => !keep.has(g)));
  }
  for (const p of sq)
    if (!keep.has(p)) {
      delete S.players[p.id];
      trimmed++;
    }
}
W.rosterVer++;
const rawPhone = FM.Save.pack(S);
const gzPhone = zlib.gzipSync(rawPhone, { level: 9 });
fs.writeFileSync(path.join(outDir, 'world-phone.touchline'), gzPhone);
meta.phone = {
  file: 'world-phone.touchline',
  rawBytes: rawPhone.length,
  bytes: gzPhone.length,
  sha1: crypto.createHash('sha1').update(rawPhone).digest('hex'),
  historyRowsLeftOut: history,
  playersLeftOut: trimmed,
  players: Object.keys(S.players).length,
};
fs.writeFileSync(path.join(outDir, 'world.json'), JSON.stringify(meta, null, 1));
console.log(
  `Phone world: the same without ${history} season rows and ${trimmed} reserve players, ${(rawPhone.length / 1e6).toFixed(1)} MB packed, ${(gzPhone.length / 1e6).toFixed(1)} MB gzipped`,
);
console.log(
  `Prepared world: ${meta.clubs} clubs, ${meta.players} players, ${(raw.length / 1e6).toFixed(1)} MB packed, ` +
    `${(gz.length / 1e6).toFixed(1)} MB gzipped, for simulation ${simHash} (${Math.round((Date.now() - t0) / 1000)} s)`,
);

// It must open again: unpacked it has the same clubs and players, and no manager
const back = FM.Save.unpack(zlib.gunzipSync(gz).toString('utf8'), { world: true }).state;
const same = Object.keys(back.clubs).length === meta.clubs && Object.keys(back.players).length === meta.players;
if (!same || back.user) {
  console.error('The prepared world did not open again as it was made.');
  process.exit(1);
}
console.log('It opens again as made (same clubs and players, no manager).');
