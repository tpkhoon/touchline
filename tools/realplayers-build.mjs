// Builds a world pack of real clubs and real players, from the cache tools/realplayers-fetch.mjs filled, in the game's own world format
// (FM.WorldDef): load it from "Import a database" on the new-career screen.
//
//   node --max-old-space-size=4096 tools/realplayers-build.mjs --cache <folder> [--out data/packs/real-world.json] [--seed 7]
//
// What the pack holds
//   clubs, leagues, cups and derbies: the real names from data/real-world.json for every club of the game (names, nicknames, towns,
//     colours, grounds), laid over the game's own clubs (their ratings, finances and facilities stay as the game made them);
//   players: for every club whose first-team squad the fetch found, the real squad: name, nation, position, birth year and a rating.
//     A club with no squad found keeps the game's generated players.
// How a rating is made (open data has none): the real players of a club are ordered by how well known they are (Wikipedia language
//   editions, caps for his country, awards, a little less for a veteran), and the club's generated squad (the game's own, which already
//   fits the club's level and the league's strength) lends its ratings in that order: the best-known player gets the club's best rating.
//   So the strength of each club and league is the game's; which player is the star is the real world's. A rating is an estimate: edit
//   it in the world editor or in a CSV when you know better.
// Licences: the squads come from English Wikipedia (CC BY-SA 4.0) and the birth dates and counts from Wikidata (CC0), so the pack is
//   shared under CC BY-SA 4.0 with that attribution (written into the pack's description).
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadSim } from './harness.mjs';

const args = {};
{
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    if (!a[i].startsWith('--')) continue;
    args[a[i].slice(2)] = a[i + 1] === undefined || a[i + 1].startsWith('--') ? true : a[++i];
  }
}
if (!args.cache || args.cache === true) {
  console.log(
    'usage: node --max-old-space-size=4096 tools/realplayers-build.mjs --cache <folder> [--out data/packs/real-world.json] [--seed 7] [--stats <players.json from tools/refstats.mjs --players>]',
  );
  process.exit(1);
}
const CACHE = path.resolve(String(args.cache));
const OUT = path.resolve(ROOT, String(args.out && args.out !== true ? args.out : 'data/packs/real-world.json'));
const load = (f) => JSON.parse(fs.readFileSync(path.join(CACHE, f), 'utf8'));
const squads = load('squads.json'),
  qidOf = load('titles-qid.json'),
  wd = load('wikidata.json');
const real = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/real-world.json'), 'utf8'));
const { FM } = loadSim(+(args.seed || 7));
const W = FM.W,
  D = FM.D,
  WD = FM.WorldDef;
W.newWorld({ win: 3, subs: 5, twoLegs: true, awayGoals: false });
FM.Season.init();
const S = FM.S;

// ---------- the club, league, cup and derby names ----------
const def = WD.fromState(S, { name: 'Real world', players: false });
def.meta.players = 'replace';
def.meta.base = 'touchline';
def.meta.startYear = S.year;
let renamed = 0;
for (const c of def.clubs) {
  const r = real.clubs[c.id.replace(/^c_/, '')];
  if (!r) continue;
  const [name, , city, c1, c2, identity, rep, stadium, cap] = r.row;
  c.name = name;
  c.short = (r.short || c.id.replace(/^c_/, '')).slice(0, 5);
  c.nick = r.nick || '';
  c.city = city;
  c.colors = [c1, c2];
  if (identity) c.identity = identity;
  if (rep) c.rep = rep;
  if (r.founded) c.founded = +r.founded || c.founded;
  if (stadium) c.stadium = { name: stadium, cap: cap || c.stadium.cap };
  renamed++;
}
for (const l of def.leagues) {
  const r = real.leagues[l.id];
  if (r) {
    l.name = r.name;
    l.short = r.short;
  }
}
for (const c of def.competitions) {
  const r = real.cups[c.id] || real.continentals[c.id];
  if (r) {
    c.name = r.name;
    c.short = r.short;
  }
}
def.rivals = real.rivals.map(([a, b, n]) => [`c_${a}`, `c_${b}`, n]).filter(([a, b]) => S.clubs[a] && S.clubs[b]);
console.log(`names: ${renamed} clubs, ${def.leagues.length} leagues, ${def.rivals.length} derbies`);

// ---------- positions ----------
const GROUP = { GK: ['GK'], DF: ['CB', 'FB', 'WB'], MF: ['DM', 'CM', 'AM', 'WM'], FW: ['W', 'ST'] };
const LABEL = [
  [/goalkeeper/, 'GK'],
  [/centre-?back|center-?back|central defender|sweeper|stopper/, 'CB'],
  [/wing-?back|wingback/, 'WB'],
  [/full-?back|left-?back|right-?back|left back|right back/, 'FB'],
  [/defensive midfield|holding midfield|anchor|deep-lying/, 'DM'],
  [/attacking midfield|second striker|playmaker|number 10|trequartista/, 'AM'],
  [/wide midfield|left midfield|right midfield|winger-?midfield/, 'WM'],
  [/winger|left wing|right wing|inside forward/, 'W'],
  [/centre-?forward|center-?forward|striker|false nine|target man|forward/, 'ST'],
  [/central midfield|box-to-box|midfielder/, 'CM'],
  [/defender/, 'CB'],
];
const DEFAULT = { GK: 'GK', DF: 'CB', MF: 'CM', FW: 'ST' };
// Wikipedia says goalkeeper, defender, midfielder or forward; Wikidata sometimes says more (a left-back, a winger). Where neither does, the
// shirt number does what it usually does: 2 and 3 are the full-backs, 6 the holding midfielder, 10 the playmaker, 7 and 11 the wingers.
const BY_NUMBER = {
  DF: { 2: 'FB', 3: 'FB' },
  MF: { 6: 'DM', 10: 'AM', 7: 'W', 11: 'W' },
  FW: { 7: 'W', 11: 'W' },
};
const GENERIC = /^(defender|midfielder|forward|footballer|association football player|attacker)$/;
function posOf(wp, labels, no) {
  const g = GROUP[wp] ? wp : 'MF';
  // a specific label from Wikidata (centre-back, left-back, winger, striker) beats the number; a generic one (defender) does not
  for (const l of labels || []) {
    const low = l.toLowerCase();
    if (GENERIC.test(low)) continue;
    for (const [re, pos] of LABEL) if (re.test(low) && GROUP[g].includes(pos)) return pos;
  }
  return (BY_NUMBER[g] && BY_NUMBER[g][no]) || DEFAULT[g];
}
// A squad needs the positions a formation asks for: where a club's list leaves it short of full-backs, wingers or holding midfielders,
// players are moved to them, the ones the number or the group makes likeliest first.
function balance(rows) {
  const count = (p) => rows.filter((r) => r.pos === p).length;
  const move = (from, to, min, prefer) => {
    while (count(to) < min) {
      const cands = rows.filter((r) => from.includes(r.pos) && !r.locked).sort((a, b) => prefer(a) - prefer(b));
      if (!cands.length || cands.length <= 2) return;
      cands[0].pos = to;
      cands[0].locked = true;
    }
  };
  const num = (r) => r.p.no || 99;
  move(['CB'], 'FB', 4, (r) => (num(r) > 11 ? 0 : 1) + r.f / 100); // (the lesser-known, the higher-numbered, the likelier)
  move(['ST', 'AM'], 'W', 3, (r) => (r.p.pos === 'FW' ? 0 : 1) + (num(r) === 9 ? 5 : 0) + r.f / 100);
  move(['CM'], 'DM', 2, (r) => ([4, 5, 6, 8, 14, 15].includes(num(r)) ? 0 : 1) + r.f / 100);
  move(['CM'], 'AM', 1, (r) => (num(r) === 10 ? 0 : 1) - r.f / 50);
}
// ---------- nations ----------
const NAT_FIX = {
  KOS: 'ALB',
  GAB: 'CMR',
  TOG: 'GHA',
  BEN: 'NGA',
  ZIM: 'RSA',
  ZAM: 'RSA',
  MOZ: 'ANG',
  GNB: 'GUI',
  GAM: 'SEN',
  MTN: 'MAR',
  LBY: 'EGY',
  SUD: 'EGY',
  COM: 'MAR',
  EQG: 'CMR',
  CGO: 'COD',
  SLE: 'GUI',
  LBR: 'CIV',
  BDI: 'TAN',
  RWA: 'TAN',
  UGA: 'TAN',
  KEN: 'TAN',
  ETH: 'TAN',
  NAM: 'RSA',
  MAD: 'ANG',
  CUW: 'JAM',
  SUR: 'JAM',
  HAI: 'JAM',
  TRI: 'JAM',
  GRN: 'JAM',
  DOM: 'JAM',
  CUB: 'JAM',
  LUX: 'BEL',
  LIE: 'SUI',
  AND: 'ESP',
  MLT: 'ITA',
  FRO: 'DEN',
  ARM: 'GEO',
  AZE: 'GEO',
  KAZ: 'RUS',
  MDA: 'ROU',
  LVA: 'FIN',
  LTU: 'FIN',
  EST: 'FIN',
  PLE: 'EGY',
  JOR: 'EGY',
  SYR: 'EGY',
  LIB: 'EGY',
  OMA: 'KSA',
  KUW: 'KSA',
  BHR: 'KSA',
  PRK: 'KOR',
  TJK: 'UZB',
  KGZ: 'UZB',
  HKG: 'CHN',
  TPE: 'CHN',
  NCL: 'FRA',
  MTQ: 'FRA',
  GLP: 'FRA',
  GUF: 'FRA',
  REU: 'FRA',
};
const NAT_ALIAS = {
  SPAIN: 'ESP',
  SPA: 'ESP',
  FRANCE: 'FRA',
  DRC: 'COD',
  DNK: 'DEN',
  SWI: 'SUI',
  SLO: 'SVN',
  NIG: 'NGA',
  TGO: 'TOG',
  TOGO: 'TOG',
  LIT: 'LTU',
  LAT: 'LVA',
  SLV: 'CRC',
  CHA: 'CMR',
  GBS: 'GNB',
  CTA: 'CMR',
  SRI: 'IND',
  MLT: 'MLT',
  SER: 'SRB',
  ROM: 'ROU',
  NGR: 'NGA',
  JAP: 'JPN',
  PHL: 'PHI',
  KVX: 'ALB',
  SKN: 'JAM',
  LBN: 'EGY',
  MWI: 'TAN',
  AFG: 'UZB',
  BAN: 'IND',
  GBR: 'ENG',
  ENG: 'ENG',
  SCO: 'SCO',
  WAL: 'WAL',
  NIR: 'NIR',
  IRE: 'IRL',
  RSA: 'RSA',
  ZAF: 'RSA',
  CUR: 'JAM',
};
const unknownNat = {};
const natOf = (code, club) => {
  const c = NAT_ALIAS[code] || code;
  if (D.NATIONS[c]) return c;
  if (NAT_FIX[c] && D.NATIONS[NAT_FIX[c]]) {
    unknownNat[c] = (unknownNat[c] || 0) + 1;
    return NAT_FIX[c];
  }
  unknownNat[c || '?'] = (unknownNat[c || '?'] || 0) + 1;
  return club.nat || 'ENG';
};
// ---------- real match statistics, where there are some ----------
// The players the StatsBomb open data covers (tools/refstats.mjs --players) are rated from their numbers by the real-stats converter
// as well: the converter's ability replaces part of the fame estimate, by how much evidence there is (minutes), and never by more
// than 6 points. Fame says who is a star; the numbers move the players they have seen up or down within the club.
const RS = FM.RealStats;
const norm = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
const STATS =
  args.stats && args.stats !== true ? JSON.parse(fs.readFileSync(path.resolve(String(args.stats)), 'utf8')) : null;
const statTokens = STATS ? STATS.map((p) => ({ p, t: new Set(norm(p.name)) })) : [];
const statsFor = (name) => {
  const t = norm(name);
  if (t.length < 2) return null; // (a one-name player is too easily another man)
  const hits = statTokens.filter((s) => t.every((x) => s.t.has(x)));
  return hits.length === 1 ? hits[0].p : null; // (two men fit: leave him on fame alone)
};
// ---------- the players ----------
const hash = (s) => [...String(s)].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
const fame = (w, age) => {
  if (!w) return 0;
  const base = Math.log(1 + (w.sl || 0)) + 0.45 * Math.log(1 + (w.caps || 0)) + 0.35 * Math.min(w.aw || 0, 6);
  return base - (age >= 33 ? 0.18 * (age - 32) : 0) + (age <= 21 && (w.sl || 0) >= 25 ? 0.3 : 0); // (a veteran's name outlasts his form; a known youngster is rated on his promise)
};
const growth = (age) =>
  age <= 19 ? 14 : age <= 20 ? 11 : age <= 21 ? 8 : age <= 22 ? 6 : age <= 23 ? 4 : age <= 25 ? 2 : 0;
let seen, players, report;
let fit = { a: 0, b: 1 };
const deltas = [],
  moved = [];
// (two passes with statistics: the first finds how far the converter's scale sits from the fame estimate's, so that only the
// differences between players, not the scale, move a rating)
for (let pass = 0; pass < (STATS ? 2 : 1); pass++) {
  if (pass) {
    // the line the converter's ability follows against the fame estimate (it is pulled toward the average where there are few minutes):
    // a player is moved only by how far he sits above or below that line
    const n = deltas.length,
      mx = deltas.reduce((s, d) => s + d[0], 0) / n,
      my = deltas.reduce((s, d) => s + d[1], 0) / n;
    const sxx = deltas.reduce((s, d) => s + (d[0] - mx) ** 2, 0),
      sxy = deltas.reduce((s, d) => s + (d[0] - mx) * (d[1] - my), 0);
    const b = sxx ? sxy / sxx : 1;
    fit = { a: my - b * mx, b };
  }
  seen = new Set();
  players = [];
  report = { clubs: 0, players: 0, noDob: 0, noWd: 0, rated: 0 };
  for (const [code, sq] of Object.entries(squads)) {
    const club = S.clubs[`c_${code}`];
    if (!club) continue;
    const gen = W.squad(club.id)
      .filter((p) => !p.team && !p.youth && !p.loan)
      .map((p) => p.ca)
      .sort((a, b) => b - a);
    if (gen.length < 11) continue;
    const rows = [];
    for (const p of sq.players) {
      const q = p.title && qidOf[p.title];
      const key = q || `${code}:${p.name}`;
      if (seen.has(key)) continue; // (a player on two lists stays with the first club)
      seen.add(key);
      const w = q && wd[q];
      let born = w && w.dob ? +w.dob.slice(0, 4) : null;
      if (born && S.year - born > 44) born = S.year - 44; // (the game's oldest player is 44)
      const age = born ? S.year - born : 21 + (hash(key) % 4);
      if (!born) report.noDob++;
      if (!w) report.noWd++;
      rows.push({ p, q, w, born: born || S.year - age, age, f: fame(w, age) });
    }
    rows.sort((a, b) => b.f - a.f || a.age - b.age);
    const squad = rows.slice(0, 34);
    squad.forEach((r) => (r.pos = posOf(r.p.pos, r.w && r.w.pos, r.p.no)));
    balance(squad);
    squad.forEach((r, i) => {
      let ca = i < gen.length ? gen[i] : Math.max(38, gen[gen.length - 1] - 2 * (i - gen.length + 1));
      const age = r.age;
      const pos = r.pos;
      const nat = natOf(r.p.nat, club);
      const m = STATS && statsFor(r.p.name);
      if (m && m.minutes >= 180) {
        const conv = RS.convert({
          pos,
          age,
          league: club.comp,
          minutes: m.minutes,
          goals: m.gls,
          assists: m.ast,
          xg: m.xg,
          xa: m.xa,
          shots: m.sh,
          passes: m.pas,
          passPct: m.att ? (m.pas * 100) / m.att : undefined,
          keyPasses: m.kp,
          progressivePasses: m.prg,
          tackles: m.tkl,
          interceptions: m.int,
          clearances: m.clr,
          dribbles: m.drb,
          aerials: m.aer,
          pressures: m.prs,
          saves: pos === 'GK' ? m.sav : undefined,
          goalsConceded: pos === 'GK' ? m.ga : undefined,
          savePct: pos === 'GK' && m.sav + m.ga ? (m.sav * 100) / (m.sav + m.ga) : undefined,
        });
        if (!pass) deltas.push([ca, conv.ca]);
        else {
          const w = conv.confidence * 0.6;
          const before = ca;
          ca = Math.round(Math.max(ca - 6, Math.min(ca + 6, ca + (conv.ca - (fit.a + fit.b * ca)) * w)));
          moved.push([r.p.name, pos, before, ca, m.minutes]);
          report.rated++;
        }
      }
      const gp = W.genPlayer({
        nat,
        pos,
        age: Math.max(16, Math.min(40, age)),
        ca,
        pa: Math.min(96, ca + growth(age)),
        clubId: null,
      });
      const attrs = Object.fromEntries(
        D.ATTRS.map((k) => [k, Math.max(1, Math.min(20, Math.round(gp.attrs[k] * 10) / 10))]),
      );
      const real_ca = W.calcCA({ attrs }, pos);
      const parts = r.p.name.split(' ');
      const h = hash(r.q || r.p.name);
      players.push({
        id: r.q ? `rp_${r.q}` : `rp_${code}_${i}`,
        fn: parts.length > 1 ? parts[0] : '',
        ln: parts.length > 1 ? parts.slice(1).join(' ') : parts[0],
        nat,
        born: r.born,
        pos,
        foot: ['Right', 'Right', 'Right', 'Left', 'Left', 'Both'][h % 6],
        attrs,
        pa: Math.max(real_ca, Math.min(96, ca + growth(age))),
        club: club.id,
        contract: S.year + 1 + (h % 4),
        _caps: r.w ? r.w.caps : 0,
      });
      report.players++;
    });
    report.clubs++;
  }
}
// the national squads: each nation's best-capped players of the pack are called up (at most 23)
const byNat = {};
for (const p of players) (byNat[p.nat] = byNat[p.nat] || []).push(p);
for (const list of Object.values(byNat))
  list
    .filter((p) => p._caps >= 3)
    .sort((a, b) => b._caps - a._caps)
    .slice(0, 23)
    .forEach((p) => (p.callup = true));
for (const p of players) delete p._caps;
def.players = players;
def.meta.name = 'Real world (top five leagues)';
def.meta.author = 'Touchline project (tools/realplayers-build.mjs)';
def.meta.version = '1.0';
def.meta.license = 'CC BY-SA 4.0';
def.meta.credits =
  'Squads from the English Wikipedia (CC BY-SA 4.0) with birth dates and fame counts from Wikidata (CC0); 425 ratings moved by StatsBomb open data (derived figures only). Ratings are estimates.';
def.meta.description =
  'Real clubs everywhere; real first-team squads for the top two divisions of England, Spain, Germany, Italy and France. Squads from the English Wikipedia (CC BY-SA 4.0), birth dates and fame counts from Wikidata (CC0). Ratings are estimates: the best-known players of a club get the best ratings the game made for it. Shared under CC BY-SA 4.0.';
const v = WD.validate(def, S);
if (STATS) moved.sort((a, b) => b[3] - b[2] - (a[3] - a[2]));
if (STATS) {
  const show = (l) => l.map((x) => `${x[0]} ${x[1]} ${x[2]}→${x[3]} (${x[4]} min)`).join('; ');
  console.log('up:', show(moved.slice(0, 6)));
  console.log('down:', show(moved.slice(-6)));
  console.log('changed:', moved.filter((x) => x[2] !== x[3]).length, 'of', moved.length);
}
if (STATS)
  console.log(
    `rated with match statistics: ${report.rated} players (the converter's ability follows ${fit.a.toFixed(1)} + ${fit.b.toFixed(2)} x the fame estimate)`,
  );
console.log(
  `players: ${report.players} in ${report.clubs} clubs (${report.noWd} without a Wikidata item, ${report.noDob} without a birth date)`,
);
console.log('nations not in the game (set to a neighbour):', JSON.stringify(unknownNat));
console.log(`validation: ${v.errors.length} errors, ${v.warnings.length} warnings`);
for (const e of v.errors.slice(0, 12)) console.log('  ERROR', e);
for (const w of v.warnings.slice(0, 6)) console.log('  warn', w);
if (v.errors.length) process.exit(1);
if (!args.check) {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, WD.stringify(def));
  console.log(`wrote ${path.relative(ROOT, OUT)} (${(fs.statSync(OUT).size / 1048576).toFixed(1)} MB)`);
}
