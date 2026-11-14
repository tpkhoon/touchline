// The long checks, once, on the world that ships: run after `npm run build:world` (the deploy does), on dist/data/world.touchline. They
// are the checks that used to build a world of their own each: the name rules, the nationality of squads, the generated past, the
// world's own invariants, and the clashes a player would see (two clubs of a league in the same kit, one name for two players, one name
// for two clubs). The deploy stops when one fails.
//   node tools/preparedchecks.mjs [--world dist/data/world.touchline]           (npm run check:prepared)
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { parseArgs, loadSim, cachedWorld, ROOT } from './harness.mjs';
import { attach } from './worldchecks.mjs';

const args = parseArgs();
const world = args.world || 'dist/data/world.touchline';
const fails = [];
const t0 = Date.now();

// the checks that are scripts of their own, each opening the same world
for (const [label, script] of [
  ['the name rules', 'namecheck.mjs'],
  ['the nationality of squads, managers, grounds and derbies', 'squadnations.mjs'],
  ['the generated past', 'histcheck.mjs'],
]) {
  try {
    execFileSync(process.execPath, ['--max-old-space-size=6144', path.join(ROOT, 'tools', script), '--world', world], {
      stdio: 'pipe',
      timeout: 15 * 60 * 1000,
    });
    console.log(`✓ ${label}`);
  } catch (e) {
    const out = `${e.stdout || ''}${e.stderr || ''}`.trim().split('\n').slice(-6).join('\n    ');
    console.log(`✗ ${label}\n    ${out}`);
    fails.push(label);
  }
}

// the world as it is: the panel's invariants, and what a player would see twice
const { FM, ctx } = loadSim(7, { getItem: () => null, setItem() {}, removeItem() {} });
cachedWorld(FM, { world });
const S = FM.S;
const checks = attach(ctx);
const bad = checks.failing(S);
for (const f of bad) {
  console.log(`✗ the world's own checks: ${f.label} ${f.detail.slice(0, 3).join('; ')}`);
  fails.push(f.label);
}
if (!bad.length) console.log("✓ the world's own checks");
const clubs = Object.values(S.clubs).filter((c) => c.comp && c.sim !== 'nation' && !c.parent);
const byLeague = {};
for (const c of clubs) (byLeague[c.comp] = byLeague[c.comp] || []).push(c);
// (a kit shared by two clubs of one league is common in life: it is a clash when they are of one town)
let kitClash = 0;
for (const list of Object.values(byLeague)) {
  const seen = new Set();
  for (const c of list) {
    const k = `${c.city}|${c.colors.join('|')}`.toLowerCase();
    if (seen.has(k)) kitClash++;
    seen.add(k);
  }
}
const names = new Map();
for (const p of Object.values(S.players))
  if (!p.retired) names.set(`${p.fn} ${p.ln}`, (names.get(`${p.fn} ${p.ln}`) || 0) + 1);
const dupNames = [...names.values()].filter((n) => n > 1).length;
// (one name for two clubs of one nation is a clash; two nations may have an "Al Watan")
const clubNames = new Map();
for (const c of clubs) clubNames.set(`${c.nat}|${c.name}`, (clubNames.get(`${c.nat}|${c.name}`) || 0) + 1);
const dupClubs = [...clubNames.values()].filter((n) => n > 1).length;
const nickClash = clubs.filter((c) => c.nick && FM.W.nickClash(c.nick, c.colors)).length;
console.log(
  `  two clubs of a town and league in one kit: ${kitClash}; names of two players: ${dupNames}; names of two clubs: ${dupClubs}; nicknames that name a colour the kit lacks: ${nickClash}`,
);
// (57 clubs share a kit with another of their town and league today, an accident of the generator: the bound keeps it from growing)
const lim = {
  kit: +(args['max-kit'] ?? 60),
  names: +(args['max-names'] ?? Math.ceil(names.size * 0.001)),
  clubs: +(args['max-clubs'] ?? 0),
  nick: 0,
};
if (kitClash > lim.kit)
  fails.push(`${kitClash} clubs share a kit with another club of their town and league (at most ${lim.kit})`);
if (dupNames > lim.names) fails.push(`${dupNames} full names belong to two players (at most ${lim.names})`);
if (dupClubs > lim.clubs) fails.push(`${dupClubs} club names are used twice (at most ${lim.clubs})`);
if (nickClash > lim.nick) fails.push(`${nickClash} nicknames name a colour the kit does not have`);

console.log(
  fails.length
    ? `\nFAIL (${fails.length}):\n  ${fails.join('\n  ')}`
    : `\nAll the long checks passed (${Math.round((Date.now() - t0) / 1000)} s).`,
);
process.exit(fails.length ? 1 : 0);
