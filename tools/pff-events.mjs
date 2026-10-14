// What a World Cup match is made of, counted from the PFF FC / Gradient Sports 2022 World Cup event data (64 matches). It prints, and
// with --write puts the figures the match view uses into the carry table (data/carry-table.json and js/carries.js): set pieces a
// match, take-ons and how they end, ball carries, passes by pressure. Only derived figures are kept (the dataset's terms allow it,
// stated by the project's owner).
//
//   node --max-old-space-size=4096 tools/pff-events.mjs --pff <the "FIFA World Cup 2022" folder> [--matches N] [--write]
//
// The event data holds the positions of the 22 players and the ball at each event, but the broadcast shows the taker of a set piece
// in only about one case in six and the ball is often missing, so layouts of players at restarts are not built from it: counts and
// outcomes are. Codes are from PFF FC Event Data Specification v2.5: setpieceType G goal kick, T throw-in, F free kick, C corner,
// P penalty, K kick-off; possession events PA pass, SH shot, CR cross, CH challenge, BC ball carry, TC touch, CL clearance, RE rebound.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = {};
{
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    if (!a[i].startsWith('--')) continue;
    args[a[i].slice(2)] = a[i + 1] === undefined || a[i + 1].startsWith('--') ? true : a[++i];
  }
}
const inc = (o, k, n = 1) => (o[k] = (o[k] || 0) + n);
const share = (o, k) => {
  const tot = Object.values(o).reduce((a, b) => a + b, 0);
  return tot ? +((o[k] || 0) / tot).toFixed(3) : 0;
};

export function readMatch(file, A) {
  const ev = JSON.parse(fs.readFileSync(file, 'utf8'));
  const seen = new Set();
  for (const e of ev) {
    const g = e.gameEvents || {},
      p = e.possessionEvents || {};
    // set pieces: one per game event (the 90 minutes and extra time both count; periods 1 and 2 only, to be per 90 minutes)
    if (g.period > 2) continue;
    if (g.setpieceType && g.setpieceType !== 'O' && !seen.has(e.gameEventId)) {
      seen.add(e.gameEventId);
      inc(A.setpieces, g.setpieceType);
    }
    const t = p.possessionEventType;
    if (!t || t === 'IT') continue;
    inc(A.types, t);
    if (t === 'PA') {
      inc(A.pressure, p.pressureType || 'N');
      (A.byPressure[p.pressureType || 'N'] = A.byPressure[p.pressureType || 'N'] || {})[p.passOutcomeType] =
        (A.byPressure[p.pressureType || 'N'][p.passOutcomeType] || 0) + 1;
      inc(A.passOutcome, p.passOutcomeType);
      inc(A.passType, p.passType);
    } else if (t === 'CH') {
      inc(A.challengeType, p.challengeType);
      if (p.challengeType === 'D') {
        // a take-on: the carrier wins it if he is the winner of the challenge; how it ends is in the outcome
        const carrier = p.ballCarrierPlayerId || p.carrierPlayerId;
        inc(A.dribble.outcome, p.challengeOutcomeType);
        inc(A.dribble.winner, p.challengeWinnerPlayerId === carrier ? 'carrier' : 'challenger');
        inc(A.dribble.type, p.dribbleType || 'none');
      }
    } else if (t === 'BC') {
      inc(A.carry.type, p.carryType);
      inc(A.carry.outcome, p.ballCarryOutcome);
      inc(A.carry.intent, p.carryIntent);
    } else if (t === 'SH') {
      inc(A.shotOutcome, p.shotOutcomeType);
    }
  }
}

export function summary(A, matches) {
  const per = (n) => +(n / matches).toFixed(1);
  const d = A.dribble;
  const dTotal = Object.values(d.winner).reduce((a, b) => a + b, 0);
  const pressured = Object.fromEntries(
    Object.entries(A.byPressure).map(([k, o]) => [
      k,
      { n: Object.values(o).reduce((a, b) => a + b, 0), complete: share(o, 'C') },
    ]),
  );
  return {
    matches,
    setpieces: Object.fromEntries(Object.entries(A.setpieces).map(([k, n]) => [k, per(n)])),
    events: Object.fromEntries(Object.entries(A.types).map(([k, n]) => [k, per(n)])),
    takeons: {
      perMatch: per(dTotal),
      carrierWins: +(d.winner.carrier / Math.max(1, dTotal)).toFixed(3),
      outcome: d.outcome,
    },
    ballCarries: {
      perMatch: per(Object.values(A.carry.type).reduce((a, b) => a + b, 0)),
      retained: share(A.carry.outcome, 'R'),
      outcome: A.carry.outcome,
    },
    passes: {
      perMatch: per(A.types.PA || 0),
      complete: share(A.passOutcome, 'C'),
      pressure: Object.fromEntries(Object.keys(A.pressure).map((k) => [k, share(A.pressure, k)])),
      byPressure: pressured,
    },
    shots: { perMatch: per(A.types.SH || 0), outcome: A.shotOutcome },
  };
}

export function report(s) {
  const L = [`PFF World Cup events: ${s.matches} matches, per match (both teams, 90 minutes)`];
  const sp = s.setpieces;
  L.push(
    `  set pieces: goal kicks ${sp.G}, throw-ins ${sp.T}, free kicks ${sp.F}, corners ${sp.C}, penalties ${sp.P || 0}`,
  );
  L.push(
    `  passes ${s.passes.perMatch}, ${(s.passes.complete * 100).toFixed(0)}% complete; pressure none ${(s.passes.pressure.N * 100).toFixed(0)}%, player ${(s.passes.pressure.P * 100).toFixed(0)}%, passing lane ${(s.passes.pressure.L * 100).toFixed(0)}%, attempted ${(s.passes.pressure.A * 100).toFixed(0)}%`,
  );
  L.push(
    `  complete under no pressure ${(s.passes.byPressure.N.complete * 100).toFixed(0)}%, player pressure ${(s.passes.byPressure.P.complete * 100).toFixed(0)}%`,
  );
  L.push(
    `  take-ons ${s.takeons.perMatch}, carrier wins ${(s.takeons.carrierWins * 100).toFixed(0)}%; outcomes ${JSON.stringify(s.takeons.outcome)}`,
  );
  L.push(
    `  recorded ball carries ${s.ballCarries.perMatch}, kept ${(s.ballCarries.retained * 100).toFixed(0)}%; shots ${s.shots.perMatch}; crosses ${s.events.CR}; clearances ${s.events.CL}`,
  );
  return L.join('\n');
}

function main() {
  if (!args.pff || args.pff === true) {
    console.log(
      'usage: node --max-old-space-size=4096 tools/pff-events.mjs --pff <the "FIFA World Cup 2022" folder> [--matches N] [--write]',
    );
    process.exit(1);
  }
  const dir = path.join(path.resolve(String(args.pff)), 'Event Data');
  const files = fs.readdirSync(dir).filter((f) => /^\d+\.json$/.test(f));
  const A = {
    setpieces: {},
    types: {},
    pressure: {},
    byPressure: {},
    passOutcome: {},
    passType: {},
    challengeType: {},
    dribble: { outcome: {}, winner: {}, type: {} },
    carry: { type: {}, outcome: {}, intent: {} },
    shotOutcome: {},
  };
  let matches = 0;
  for (const f of files.slice(0, +args.matches || files.length)) {
    readMatch(path.join(dir, f), A);
    matches++;
  }
  const s = summary(A, matches);
  console.log(report(s));
  if (!args.write) return;
  const file = path.join(ROOT, 'data/carry-table.json');
  const table = JSON.parse(fs.readFileSync(file, 'utf8'));
  table.pffEvents = s;
  fs.writeFileSync(file, JSON.stringify(table));
  const js = fs.readFileSync(path.join(ROOT, 'js/carries.js'), 'utf8').split('\n');
  const i = js.findIndex((l) => l.startsWith('  window.FM.D.CARRIES = '));
  js[i] = `  window.FM.D.CARRIES = ${JSON.stringify(table)};`;
  fs.writeFileSync(path.join(ROOT, 'js/carries.js'), js.join('\n'));
  console.log('\nWrote the figures into data/carry-table.json and js/carries.js');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
