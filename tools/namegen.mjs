// Name generator: the game's own name libraries on their own, to look at what they make before a world is built.
//   node tools/namegen.mjs --kind players --nat BRA --count 20 --seed 3
// kinds: players (the game's player names, with nationality and heritage), towns, clubs (a town and a pattern, small
// or big), grounds, nicknames, leagues (division names, cups and a sponsor) and sponsors. Every club-world name is
// run through the same checks the world generator uses (rude words, hard to say, too long, too close to a real town
// or club); a flagged name is shown with the reason. The dev dashboard's Names tab calls generateNames().
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  langOf,
  LANG,
  placeName,
  isRude,
  nameChecks,
  hardToSay,
  tooLong,
  quirkFor,
  isSimpleClub,
  clubMoreFor,
  colourAltFor,
  tiersFor,
  cupFor,
  TIERS_BY,
  sponsorsFor,
  libraryNations,
  crossCulture,
  isFantasy,
} from './namelib.mjs';
import { loadSim } from './harness.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
export const KINDS = ['players', 'towns', 'clubs', 'grounds', 'nicknames', 'leagues', 'sponsors'];

const hash = (s) => {
  let h = 2166136261;
  for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
};
const rngOf = (seed) => {
  let s = hash(seed);
  const r = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  (r(), r(), r());
  r.pick = (a) => a[Math.floor(r() * a.length)];
  return r;
};

let real = null,
  checks = null;
function realChecks() {
  if (checks) return checks;
  try {
    real = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/real-world.json'), 'utf8'));
    checks = nameChecks(
      Object.values(real.clubs).flatMap((c) => [c.row[2], c.row[0].split(' ').find((w) => w.length >= 5) || '']),
      Object.values(real.clubs).map((c) => c.row[0]),
    );
  } catch {
    checks = nameChecks([], []);
  }
  return checks;
}

// the problems a name has, as short reasons
export function flagsFor(name, L, kind) {
  const out = [];
  if (isRude(name)) out.push('rude word');
  if (hardToSay(name, L)) out.push('hard to say');
  if (kind === 'clubs' || kind === 'leagues' || kind === 'grounds' ? tooLong(name) : tooLong(name, 16))
    out.push('too long');
  const c = realChecks();
  if (kind === 'towns' && c.closeToTown(name)) out.push('close to a real town');
  if (kind === 'clubs') {
    const w = crossCulture(name, L);
    if (w) out.push(`“${w}” belongs to another culture`);
    if (isFantasy(name)) out.push('reads like fantasy');
  }
  if (kind === 'clubs' && c.closeToClub(name)) out.push('close to a real club');
  return out;
}

// The game for player names (one headless copy per seed)
const sims = new Map();
function simFor(seed) {
  if (!sims.has(seed)) {
    if (sims.size > 4) sims.delete(sims.keys().next().value);
    const { FM } = loadSim(seed);
    FM.S = { year: 2026, nextId: 1, players: {} };
    sims.set(seed, FM);
  }
  return sims.get(seed);
}

// Every nation the library can name: the game's nations, then the ones it only has a library for
export function nations() {
  const FM = simFor(1),
    game = Object.entries(FM.D.NATIONS).map(([code, n]) => ({ code, name: n.name }));
  const have = new Set(game.map((n) => n.code));
  return game.concat(
    libraryNations()
      .filter((c) => !have.has(c))
      .map((code) => ({ code, name: `${code} (library only)` })),
  );
}

export function generateNames({ kind = 'clubs', nat = 'ENG', count = 20, seed = 1, size = 'any' } = {}) {
  count = Math.max(1, Math.min(200, +count || 20));
  if (!KINDS.includes(kind)) throw new Error(`Unknown kind "${kind}" (${KINDS.join(', ')})`);
  const L = langOf(nat),
    r = rngOf(`${kind}|${nat}|${seed}|${size}`),
    items = [],
    seen = new Set();
  const add = (name, extra = {}) => {
    if (seen.has(name)) return false;
    seen.add(name);
    items.push({ name, flags: flagsFor(name, L, kind), ...extra });
    return true;
  };
  if (kind === 'players') {
    const FM = simFor(+seed || 1);
    if (!FM.D.NATIONS[nat]) throw new Error(`No player names for ${nat}`);
    for (let i = 0; items.length < count && i < count * 10; i++) {
      const age = 17 + Math.floor(r() * 20);
      const p = FM.W.genPlayer({ nat, pos: 'CM', age, ca: 60, pa: 70 });
      const second = p.nat2 && FM.D.NATIONS[p.nat2] ? p.nat2 : null;
      const label = p.fn ? `${p.fn} ${p.ln}` : p.ln;
      if (seen.has(label)) continue;
      seen.add(label);
      items.push({
        name: label,
        flags: isRude(label) ? ['rude word'] : [],
        note: [p.fn ? '' : 'one word', p.heritage ? `${p.heritage} heritage` : '', second ? `also ${second}` : '']
          .filter(Boolean)
          .join(' · '),
      });
    }
  } else if (kind === 'towns') {
    for (let i = 0; items.length < count && i < count * 20; i++) add(placeName(L, r));
  } else if (kind === 'clubs') {
    const quirk = quirkFor(L),
      more = clubMoreFor(L);
    for (let i = 0; items.length < count && i < count * 20; i++) {
      let base = placeName(L, r);
      if (size === 'small' && quirk.length && !/[ -]/.test(base) && r() < 0.35) {
        const q = r.pick(quirk);
        base = q.endsWith('-') ? q + base : `${q} ${base}`;
      }
      const patterns = size === 'big' ? L.club.filter(isSimpleClub) : L.club;
      let name = r.pick(patterns).replace('{c}', base);
      if (size !== 'big' && more.length && r() < 0.3) name = r.pick(more).replace('{c}', base);
      add(name, { note: base });
    }
  } else if (kind === 'grounds') {
    for (let i = 0; items.length < count && i < count * 20; i++)
      add(
        r
          .pick(L.ground)
          .replace('{c}', placeName(L, r))
          .replace('{x}', placeName(L, r))
          .replace('{p}', placeName(L, r)),
      );
  } else if (kind === 'nicknames') {
    const alt = colourAltFor(L),
      colours = Object.entries(L.colours);
    for (let i = 0; items.length < count && i < count * 20; i++) {
      if (r() < 0.55) {
        const [c, n] = r.pick(colours);
        add(alt && alt[c] && r() < 0.5 ? r.pick(alt[c]) : n, { note: `${c} kit` });
      } else add(r.pick(L.misc));
    }
  } else if (kind === 'leagues') {
    const tiers = TIERS_BY[nat] || tiersFor(L, r);
    tiers.forEach((t, i) => add(t, { note: `division ${i + 1}` }));
    for (let i = 0; i < 4; i++) add(cupFor(L, r), { note: 'cup' });
    const sp = sponsorsFor(nat);
    for (let i = 0; i < 3; i++) add(`${r.pick(sp)} ${tiers[0]}`, { note: 'sponsored top flight' });
  } else if (kind === 'sponsors') {
    const sp = sponsorsFor(nat);
    for (let i = 0; items.length < Math.min(count, sp.length) && i < count * 20; i++) add(r.pick(sp));
  }
  return { kind, nat, seed: +seed || 1, language: L.key, items, flagged: items.filter((x) => x.flags.length).length };
}

// ---- command line ----
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const a = Object.fromEntries(
    process.argv
      .slice(2)
      .join(' ')
      .split('--')
      .filter(Boolean)
      .map((x) => x.trim().split(/\s+/)),
  );
  if (a.help || a.h) {
    console.log(
      `kinds: ${KINDS.join(', ')}\nnations: ${Object.keys(LANG).length} languages; --nat takes a nation code`,
    );
    process.exit(0);
  }
  const res = generateNames({
    kind: a.kind || 'clubs',
    nat: (a.nat || 'ENG').toUpperCase(),
    count: a.count,
    seed: a.seed,
    size: a.size,
  });
  console.log(`${res.kind} for ${res.nat} (${res.language}), seed ${res.seed}`);
  for (const it of res.items)
    console.log(
      `  ${it.name}${it.note ? `  — ${it.note}` : ''}${it.flags.length ? `   ⚠ ${it.flags.join(', ')}` : ''}`,
    );
  console.log(`${res.items.length} names, ${res.flagged} flagged`);
}
