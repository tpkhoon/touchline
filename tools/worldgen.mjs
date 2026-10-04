// The fictional football world: club, league, cup and derby names that keep the real structure (the same clubs by code,
// leagues, sizes, promotion and relegation, cups and rules) with none of the real identities.
//   node tools/worldgen.mjs [--seed 1] [--out data/fictional-world.json]
// Reads the structure from data/real-world.json (each club's nation, league, kit colours, identity, rank) and writes a
// names database in the same format; `node tools/realworld.mjs apply data/fictional-world.json` puts it into the game.
// Everything is deterministic from the seed, so a world can be regenerated, or another one made with a new seed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { langOf, placeName, stem, TIERS_BY, CUP_BY } from './namelib.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---------------------------------------------------------------- random numbers
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
const DEMONYM = {
  ENG: 'English',
  SCO: 'Scottish',
  WAL: 'Welsh',
  IRL: 'Irish',
  ESP: 'Spanish',
  GER: 'German',
  FRA: 'French',
  BRA: 'Brazilian',
  ITA: 'Italian',
  POR: 'Portuguese',
  NED: 'Dutch',
  ARG: 'Argentine',
  USA: 'American',
  JPN: 'Japanese',
  MEX: 'Mexican',
  KOR: 'Korean',
  THA: 'Thai',
  NGA: 'Nigerian',
  MAR: 'Moroccan',
  SRB: 'Serbian',
  BEL: 'Belgian',
  TUR: 'Turkish',
  CZE: 'Czech',
  GRE: 'Greek',
  NOR: 'Norwegian',
  POL: 'Polish',
  DEN: 'Danish',
  AUT: 'Austrian',
  SUI: 'Swiss',
  AUS: 'Australian',
  HUN: 'Hungarian',
};
const CONTINENT_WORD = {
  Europe: 'European',
  'South America': 'South American',
  Asia: 'Asian',
  Africa: 'African',
  'North America': 'North American',
};
const CONTINENT_SHORT = { Europe: 'EUR', 'South America': 'SAM', Asia: 'ASI', Africa: 'AFR', 'North America': 'NAM' };
const CONT_TIER = {
  1: (r) => `${CONTINENT_WORD[r]} Champions Cup`,
  2: (r) => `${CONTINENT_WORD[r]} Shield`,
  3: (r) => `${CONTINENT_WORD[r]} Trophy`,
};

// ---------------------------------------------------------------- colours
const PALETTE = {
  red: [200, 16, 46],
  blue: [0, 70, 180],
  white: [245, 245, 245],
  black: [25, 25, 25],
  yellow: [250, 210, 20],
  green: [20, 140, 60],
  orange: [240, 120, 20],
  claret: [110, 25, 60],
  sky: [108, 171, 221],
  navy: [20, 35, 90],
};
const colourName = (hex) => {
  const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  let best = 'white',
    bd = Infinity;
  for (const [k, p] of Object.entries(PALETTE)) {
    const d = (v[0] - p[0]) ** 2 + (v[1] - p[1]) ** 2 + (v[2] - p[2]) ** 2;
    if (d < bd) ((bd = d), (best = k));
  }
  return best;
};

// ---------------------------------------------------------------- the world
export function generate(real, seed = 1) {
  const out = JSON.parse(JSON.stringify(real));
  const usedPlace = new Set(Object.values(real.clubs).flatMap((c) => [c.row[2], c.row[0]])), // never a real town or club
    usedName = new Set(),
    usedShort = new Set(),
    usedGround = new Set();
  const placeFor = new Map(),
    perPlace = {},
    done = {};

  const makePlace = (nat, realCity) => {
    const key = `${nat}|${realCity}`;
    if (placeFor.has(key)) return placeFor.get(key);
    const L = langOf(nat),
      r = rngOf(`${seed}|${key}`);
    let place,
      n = 0;
    do place = placeName(L, r);
    while (usedPlace.has(place) && ++n < 500);
    if (usedPlace.has(place)) place += n;
    usedPlace.add(place);
    placeFor.set(key, place);
    return place;
  };
  const shortOf = (place) => {
    const base = place.replace(/[^A-Za-zÀ-ÿ]/g, '').toUpperCase();
    for (const s of [base.slice(0, 3), base.slice(0, 2) + base.slice(-1), base[0] + base.slice(-2), base.slice(0, 4)])
      if (s.length >= 3 && !usedShort.has(s)) return (usedShort.add(s), s);
    for (let i = 2; ; i++) {
      const s = base.slice(0, 3) + i;
      if (!usedShort.has(s)) return (usedShort.add(s), s);
    }
  };
  const surname = (L, r) => stem(L, r);
  const nickOf = (c, r, L, taken) => {
    // most clubs are known by their colours; some by an animal or a trade
    const [c1, c2] = [colourName(c.row[3]), colourName(c.row[4])];
    const byColour = L.colours[c1] === L.colours[c2] ? L.colours[c1] : L.colours[c1];
    let n = r() < 0.62 ? byColour : r.pick(L.misc);
    if (taken.has(n)) n = r.pick(L.misc);
    return n;
  };

  const doClub = (code) => {
    if (done[code]) return done[code];
    const c = out.clubs[code],
      row = c.row,
      parent = row[9] && out.clubs[row[9]];
    if (parent) {
      const p = doClub(row[9]);
      return (done[code] = {
        name: `${p.name} B`,
        city: p.city,
        stadium: p.stadium,
        short: (p.short + 'B').slice(0, 4),
        nick: '',
      });
    }
    const L = langOf(c.nat),
      place = makePlace(c.nat, row[2]),
      key = `${c.nat}|${place}`,
      k = (perPlace[key] = (perPlace[key] || 0) + 1),
      r = rngOf(`${seed}|${code}`);
    // a big city's later clubs are named for their districts, as London's are (the city stays the club's town)
    let base = place;
    if (k >= 3) {
      const rd = rngOf(`${seed}|district|${code}`);
      let d,
        dt = 0;
      do d = surname(L, rd);
      while (usedPlace.has(d) && ++dt < 100);
      usedPlace.add(d);
      base = d;
    }
    let name,
      tries = 0;
    do {
      // the first club in a town takes the plain town name more often than a second one does
      name = L.club[(Math.floor(r() * L.club.length) + (k - 1) * 3 + tries) % L.club.length].replace('{c}', base);
      tries++;
    } while (usedName.has(name) && tries < L.club.length * 2);
    if (usedName.has(name)) name = `${place} ${k + 1}`;
    usedName.add(name);
    let ground,
      gt = 0;
    do ground = r.pick(L.ground).replace('{c}', place).replace('{x}', surname(L, r)).replace('{p}', surname(L, r));
    while (usedGround.has(ground) && ++gt < 30);
    usedGround.add(ground);
    return (done[code] = { name, city: place, stadium: ground, short: shortOf(place), nick: '' });
  };
  // when each club was founded: the old giants and historic clubs of the old football countries first, clubs of the
  // newer football countries a good deal later; a B team shares its parent's
  const OLD = new Set('ENG SCO WAL IRL GER AUT SUI NED BEL FRA ITA ESP POR DEN NOR SWE'.split(' ')),
    BY_IDENTITY = {
      giant: [1862, 1905],
      historic: [1862, 1905],
      fallen: [1865, 1908],
      fan: [1875, 1955],
      selling: [1885, 1992],
      youth: [1885, 1985],
      oil: [1880, 1970],
    };
  const foundedOf = (c, code) => {
    const [lo, hi] = BY_IDENTITY[c.row[5]] || [1880, 1960],
      r = rngOf(`${seed}|founded|${code}`),
      shift = OLD.has(c.nat) ? 0 : ['BRA', 'ARG', 'URU', 'MEX', 'CHI', 'COL'].includes(c.nat) ? 18 : 35;
    return Math.min(2008, Math.round(lo + shift + r() * (hi - lo)));
  };
  for (const code of Object.keys(out.clubs)) doClub(code);
  for (const code of Object.keys(out.clubs))
    if (!out.clubs[code].row[9]) done[code].founded = foundedOf(out.clubs[code], code);
  for (const code of Object.keys(out.clubs)) {
    const parent = out.clubs[code].row[9];
    if (parent)
      done[code].founded = Math.min(2008, done[parent].founded + 25 + Math.floor(rngOf(`${seed}|bf|${code}`)() * 40));
  }
  // nicknames (after names, so a town's clubs can differ from each other)
  const nickTaken = {};
  for (const code of Object.keys(out.clubs)) {
    const c = out.clubs[code];
    if (c.row[9]) continue;
    const L = langOf(c.nat),
      place = done[code].city,
      taken = (nickTaken[`${c.nat}|${place}`] = nickTaken[`${c.nat}|${place}`] || new Set());
    done[code].nick = nickOf(c, rngOf(`${seed}|nick|${code}`), L, taken);
    taken.add(done[code].nick);
  }
  for (const code of Object.keys(out.clubs)) {
    const i = done[code],
      row = out.clubs[code].row.slice();
    row[0] = i.name;
    row[2] = i.city;
    row[7] = i.stadium;
    out.clubs[code].row = row;
    out.clubs[code].short = i.short;
    out.clubs[code].nick = i.nick;
    out.clubs[code].founded = i.founded;
  }
  // leagues and cups keep their ids, formats and rules; only the name changes
  for (const [id, l] of Object.entries(out.leagues)) {
    const dem = DEMONYM[l.nat] || real.nations[l.nat] || l.nat,
      tiers = TIERS_BY[l.nat] || langOf(l.nat).tiers;
    l.name = `${dem} ${tiers[l.tier - 1] || `Division ${l.tier}`}`;
    l.short = id;
  }
  const seen = new Set();
  for (const c of Object.values(out.continentals)) {
    c.name = (CONT_TIER[c.tier] || CONT_TIER[1])(c.region);
    if (seen.has(c.name)) c.name += ' II';
    seen.add(c.name);
    c.short = `${CONTINENT_SHORT[c.region] || c.region.slice(0, 3).toUpperCase()}${c.tier}`;
  }
  for (const c of Object.values(out.cups)) {
    c.name = `${DEMONYM[c.nat] || real.nations[c.nat] || c.nat} ${CUP_BY[c.nat] || langOf(c.nat).cup}`;
    c.short = `${c.nat}C`;
  }
  // county cups and state championships take the name of the area's biggest club's town
  if (real.regions) {
    const shorts = new Set();
    for (const [id, r] of Object.entries(out.regions)) {
      const top = r.clubs
          .split(' ')
          .map((code) => out.clubs[code])
          .filter(Boolean)
          .sort((a, b) => b.row[6] - a.row[6])[0],
        place = top ? top.row[2] : id;
      const base = place.split(/-| de | del | do | da | das | sur /)[0];
      r.name = r.nat === 'BRA' ? `Campeonato ${base}` : `${base} Senior Cup`;
      let sh =
        place
          .replace(/[^A-Za-z]/g, '')
          .slice(0, 3)
          .toUpperCase() + 'C';
      for (let i = 2; shorts.has(sh); i++) sh = sh.slice(0, 3) + i;
      shorts.add(sh);
      r.short = sh;
    }
  }
  out.rivals = real.rivals.map(([a, b]) => {
    const ca = out.clubs[a],
      cb = out.clubs[b];
    if (!ca || !cb) return [a, b, 'Derby'];
    const pa = ca.row[2],
      pb = cb.row[2];
    return [a, b, pa === pb ? `${pa} Derby` : `${pa}–${pb} Derby`];
  });
  out.format = 'touchline-names';
  out.version = 1;
  out.seed = seed;
  out.note = `A fictional world (seed ${seed}): the real structure, rules and club codes with generated names. The real names are in data/real-world.json.`;
  return out;
}

// ---------------------------------------------------------------- command line
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const opt = (k, d) => (args.includes(`--${k}`) ? args[args.indexOf(`--${k}`) + 1] : d);
  const real = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/real-world.json'), 'utf8'));
  const outFile = path.resolve(ROOT, opt('out', 'data/fictional-world.json'));
  const world = generate(real, +opt('seed', 1));
  fs.writeFileSync(outFile, JSON.stringify(world, null, 1) + '\n');
  console.log(`Wrote ${path.relative(ROOT, outFile)} (seed ${world.seed}): ${Object.keys(world.clubs).length} clubs.`);
}
