// Finds the first bad day: replays a seeded world (or a save) one day at a time and stops on the first day a world check
// fails, with the state at that point written out so it can be opened on the dashboard's World tab.
//   node tools/firstbad.mjs [--seed 7] [--days 400] [--check any|<check id>] [--every 1] [--save file.touchline] [--list]
//   --list    the check ids that can be asked for
// Exit 1 when a day broke a check (so it can be a job); 0 when 400 days (or --days) pass clean.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { parseArgs, loadSim, ROOT } from './harness.mjs';
import { attach } from './worldchecks.mjs';

const args = parseArgs();
const seed = +(args.seed || 7);
const { ctx, FM } = loadSim(seed);
const W = FM.W,
  Sea = FM.Season;
const checks = attach(ctx);

if (args.save) {
  const buf = fs.readFileSync(args.save);
  let text;
  try {
    text = zlib.gunzipSync(buf).toString('utf8');
  } catch (e) {
    text = buf.toString('utf8');
  }
  const parsed = JSON.parse(text);
  delete parsed.report;
  FM.S = FM.Save.relink(FM.Save.unpack(parsed).state);
  W.rosterVer++;
} else {
  W.newWorld(W.REAL_RULES);
  Sea.init();
  W.takeCharge(Object.values(FM.S.clubs).find((c) => c.comp === 'D1' && c.rep < 70).id, 'Dev Manager');
}
if ('list' in args) {
  for (const c of checks.ids()) console.log(`${c.id}\t${c.label}`);
  process.exit(0);
}

// One day, the way a manager who plays every match would: his fixture is played, a job offer is taken when he is sacked
function play() {
  const S = FM.S;
  const fx = Sea.userFixture();
  if (fx && S.user && !S.user.sacked) Sea.applyUserMatch(FM.quickSim(fx, !!fx.ko));
  Sea.advance(null);
  if (!W.employed() && S.user.offers && S.user.offers.length) W.takeCharge(S.user.offers[0].id, 'Dev Manager', false);
}

const days = +(args.days || 400);
console.log(
  `Replaying ${args.save ? args.save : 'seed ' + seed} for up to ${days} days, checking "${args.check || 'any'}"…`,
);
const r = checks.firstBad(play, {
  check: args.check || 'any',
  maxDays: days,
  every: +(args.every || 1),
  onDay: (n) => n % 50 === 0 && console.log(`  day ${n} played, still clean`),
});
if (!r.found) {
  console.log(
    `All checks passed: ${r.played} days played without a new failure${r.already.length ? ` (already failing at the start: ${r.already.join(', ')})` : ''}.`,
  );
  process.exit(0);
}
const S = FM.S;
console.log(
  `\nFIRST BAD DAY: day ${r.played} of the replay (season ${S.year}, calendar day ${S.day}: ${Sea.dayLabel()})`,
);
for (const f of r.failing)
  console.log(`✗ ${f.label}${f.detail && f.detail.length ? '\n    ' + f.detail.join('\n    ') : ''}`);
const dir = path.join(ROOT, '.devtools', 'firstbad');
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, `seed-${seed}-day-${r.played}.touchline`);
fs.writeFileSync(file, zlib.gzipSync(Buffer.from(FM.Save.pack(FM.S), 'utf8')));
console.log(`\nThe world on that day: ${path.relative(ROOT, file)} (open it with "Open a save" on the World tab)`);
console.log(`Failed: ${r.failing.length} check${r.failing.length === 1 ? '' : 's'}`);
process.exit(1);
