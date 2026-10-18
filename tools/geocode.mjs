// The world's map: a place (latitude, longitude) for every club, so distances, away trips, local derbies and the world map
// are real geography. A fictional club sits on the slot of a real one, and takes that slot's city as its place: the city's
// coordinates are plain facts (Wikidata, CC0), and the names stay fictional. The result is js/geo.js, keyed by club code,
// each place rounded to about a kilometre with a small fixed offset so clubs of one city do not sit on one point.
//   node tools/geocode.mjs            look the cities up (cached in the private folder) and write js/geo.js
//   node tools/geocode.mjs --check    only report the cities that could not be found
// Needs the names database in the private folder (tools/private.mjs): it holds the real city of each slot.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { privateFile, privatePath, missing } from './private.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const db = privateFile('real-world.json');
if (!db) {
  console.log(missing('real-world.json'));
  process.exit(0);
}
const real = JSON.parse(fs.readFileSync(db, 'utf8'));
const CACHE = privatePath('geo-cache.json');
const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
const save = () => fs.writeFileSync(CACHE, JSON.stringify(cache));

// The country names Wikipedia uses in a title ("Reading, England")
const COUNTRY = {
  ENG: 'England',
  SCO: 'Scotland',
  WAL: 'Wales',
  IRL: 'Republic of Ireland',
  USA: 'United States',
  KOR: 'South Korea',
  CZE: 'Czech Republic',
  UAE: 'United Arab Emirates',
  KSA: 'Saudi Arabia',
  RSA: 'South Africa',
  TAN: 'Tanzania',
};
const countryName = (nat) => COUNTRY[nat] || real.nations[nat] || nat;
// A city Wikipedia knows by another title (or one that is a disambiguation page)
const TITLE = {
  'ENG|Newcastle': 'Newcastle upon Tyne',
  'ENG|Hull': 'Kingston upon Hull',
  'ENG|Reading': 'Reading, Berkshire',
  'ENG|Derby': 'Derby',
  'ENG|Newport': 'Newport, Wales',
  'ENG|Oxford': 'Oxford',
  'ENG|Cambridge': 'Cambridge',
  'ENG|Birkenhead': 'Birkenhead',
  'ENG|High Wycombe': 'High Wycombe',
  'ENG|West Bromwich': 'West Bromwich',
  'ENG|Burton upon Trent': 'Burton upon Trent',
  'ENG|London': 'London',
};
// How far from the middle of its nation's cities a place may be and still be believed (degrees), by nation size
const WIDE = {
  USA: 32,
  BRA: 30,
  ARG: 22,
  MEX: 20,
  AUS: 30,
  CHN: 28,
  KSA: 16,
  IRN: 16,
  NGA: 12,
  CAN: 30,
  COL: 12,
  IDN: 25,
  RSA: 14,
  TAN: 12,
  ECU: 8,
  RUS: 40,
  UKR: 14,
  COD: 20,
  ANG: 14,
  NZL: 14,
  KAZ: 30,
};

// Places Wikipedia has no single article coordinate for (or that sit far from the rest of their nation: islands)
const MANUAL = {
  'ENG|Preston': [53.759, -2.699],
  'ENG|Chesterfield': [53.235, -1.421],
  'ENG|Gillingham': [51.389, 0.549],
  'ESP|Las Palmas': [28.124, -15.43],
  'ESP|Miranda de Ebro': [42.686, -2.947],
  'ESP|Santa Cruz de Tenerife': [28.469, -16.254],
  'GER|Aue': [50.586, 12.699],
  'FRA|Laval': [48.07, -0.77],
  'FRA|Saint-Ouen': [48.912, 2.334],
  'BRA|Caxias do Sul': [-29.168, -51.179],
  'ITA|Frosinone': [41.64, 13.34],
  'POR|Ponta Delgada': [37.741, -25.675],
  'POR|Barcelos': [41.538, -8.616],
  'ARG|Florencio Varela': [-34.8, -58.28],
  'ARG|Victoria': [-34.45, -58.55],
  'ARG|Vicente López': [-34.53, -58.48],
  'ARG|Junín': [-34.585, -60.953],
  'USA|Portland': [45.52, -122.68],
  'JPN|Kashima': [35.97, 140.64],
  'JPN|Machida': [35.54, 139.45],
  'THA|Buriram': [14.99, 103.1],
  'THA|Nakhon Ratchasima': [14.97, 102.1],
  'NOR|Tromsø': [69.65, 18.96],
  'POL|Kraków': [50.06, 19.94],
  'AUS|Campbelltown': [-34.07, 150.81],
  'KSA|Al-Hasa': [25.38, 49.59],
  'KSA|Al Majmaah': [25.9, 45.35],
  'KSA|Saihat': [26.48, 50.04],
  'KSA|Az Zulfi': [26.3, 44.8],
  'KSA|Al Bukayriyah': [26.14, 43.66],
  'SGP|Tanjong Pagar': [1.276, 103.846],
  'MYS|Kota Kinabalu': [5.98, 116.07],
  'VIE|Nam Dinh': [20.42, 106.17],
  'TAN|Singida': [-4.82, 34.74],
  'CYP|Polemidia': [34.69, 33.0],
  'URU|Florida': [-34.1, -56.21],
  'CAN|Langford': [48.45, -123.5],
  'CAN|Langley': [49.1, -122.6],
  'JPN|Tendo': [38.36, 140.37],
  'JPN|Mito': [36.37, 140.47],
  'JPN|Iwaki': [37.05, 140.89],
  'KOR|Hwaseong': [37.2, 126.83],
  'THA|Phrae': [18.14, 100.14],
  'VIE|Tan An': [10.53, 106.41],
  'VIE|Bien Hoa': [10.95, 106.82],
  'VIE|Hoa Binh': [20.81, 105.34],
  'VIE|Buon Ma Thuot': [12.67, 108.04],
  'IND|Kochi': [9.93, 76.27],
  'IND|Ludhiana': [30.9, 75.86],
  'IND|Delhi': [28.61, 77.21],
  'CHI|Calama': [-22.46, -68.93],
  'CHI|Iquique': [-20.21, -70.14],
  'CHI|El Salvador': [-26.25, -69.63],
  'PER|Chongoyape': [-6.64, -79.39],
  'PAR|Juan León Mallorquín': [-25.7, -55.4],
  'GHA|Ayiem': [5.55, -2.2],
  'CIV|San-Pédro': [4.75, -6.63],
  'CMR|Lekié': [4.17, 11.53],
  'MLI|Niarela': [12.62, -7.98],
  'CPV|Sal': [16.76, -22.94],
  'UKR|Kovalivka': [50.25, 30.1],
  'UKR|Odesa': [46.48, 30.73],
  'ALB|Rrogozhinë': [41.07, 19.67],
  'ALB|Laç': [41.63, 19.71],
  'ALB|Kukës': [42.08, 20.42],
  'MNE|Tuzi': [42.37, 19.33],
  'ISL|Garðabær': [64.09, -21.92],
  'GEO|Tskaltubo': [42.34, 42.6],
  'RUS|Krasnodar': [45.04, 38.98],
  'RUS|Grozny': [43.32, 45.69],
  'RUS|Yekaterinburg': [56.84, 60.6],
  'RUS|Orenburg': [51.77, 55.1],
  'RUS|Sochi': [43.6, 39.73],
  'VEN|Puerto Cabello': [10.47, -68.01],
  'CRC|San Isidro': [9.37, -83.7],
  'HON|Tocoa': [15.67, -86.0],
  'PAN|Santiago': [8.1, -80.98],
  'UZB|Zarafshan': [41.57, 64.2],
  'AZE|Aghdam': [39.99, 46.93],
  'AZE|Zira': [40.28, 50.1],
  'AZE|Qabala': [40.98, 47.85],
  'AZE|Tovuz': [40.99, 45.63],
  'KAZ|Aktobe': [50.28, 57.17],
  'KAZ|Atyrau': [47.11, 51.92],
  'MDA|Crihana Veche': [45.5, 28.3],
  'KOS|Gjilan': [42.46, 21.47],
  'KOS|Malishevë': [42.48, 20.75],
  'KOS|Klina': [42.62, 20.58],
  'OMA|Suwaiq': [23.84, 57.43],
  'OMA|Sohar': [24.35, 56.71],
  'KUW|Sahel': [29.37, 48.0],
  'KUW|Burgan': [29.0, 48.0],
  'ZIM|Ngezi': [-18.5, 30.2],
  'ETH|Bahir Dar': [11.59, 37.39],
  'TOG|Fiokpo': [6.6, 1.2],
  'MOZ|Songo': [-15.6, 32.77],
  'TRI|La Horquetta': [10.65, -61.4],
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const wiki = async (titles) => {
  const url =
    'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=coordinates&redirects=1&colimit=max&titles=' +
    encodeURIComponent(titles.join('|'));
  for (let i = 0; i < 6; i++) {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'TouchlineGeo/1.0 (football manager prototype; coordinates only)' },
    });
    if (res.ok) return res.json();
    const wait = +res.headers.get('retry-after') || 3 * (i + 1);
    console.log(`  (${res.status}: waiting ${wait}s)`);
    await sleep(wait * 1000);
  }
  throw new Error('Wikipedia did not answer');
};
// title -> [lat, lon] for the titles that have a place (a redirect is followed; a disambiguation page has none)
const coords = async (titles) => {
  const out = {};
  for (let i = 0; i < titles.length; i += 40) {
    const part = titles.slice(i, i + 40);
    const j = await wiki(part);
    const q = j.query || {};
    const map = {};
    for (const t of part) map[t] = t;
    for (const n of q.normalized || []) for (const t in map) if (map[t] === n.from) map[t] = n.to;
    for (const r of q.redirects || []) for (const t in map) if (map[t] === r.from) map[t] = r.to;
    const byTitle = {};
    for (const p of Object.values(q.pages || {}))
      if (p.coordinates && p.coordinates[0])
        byTitle[p.title] = [+p.coordinates[0].lat.toFixed(3), +p.coordinates[0].lon.toFixed(3)];
    for (const t of part) if (byTitle[map[t]]) out[t] = byTitle[map[t]];
    await sleep(300);
  }
  return out;
};

const cities = new Map();
for (const c of Object.values(real.clubs)) {
  const city = c.row[2];
  if (city) cities.set(`${c.nat}|${city}`, [c.nat, city]);
}
console.log(`${cities.size} cities to place`);
for (const [k, p] of Object.entries(MANUAL)) if (cities.has(k)) cache[k] = p;
const todo = [...cities.entries()].filter(([k]) => cache[k] === undefined);
const attempt = async (variants) => {
  // variants: (key) -> title; look up what is still open
  const open = todo.filter(([k]) => !cache[k]);
  const titles = [...new Set(open.map(([k, [nat, city]]) => variants(k, nat, city)))];
  const got = await coords(titles);
  for (const [k, [nat, city]] of open) {
    const p = got[variants(k, nat, city)];
    if (p) cache[k] = p;
  }
  save();
};
await attempt((k, nat, city) => TITLE[k] || city);
// believe only places near the rest of their nation (a name shared with a town on another continent is not the city)
const sane = () => {
  const by = {};
  for (const [k, p] of Object.entries(cache)) if (p) (by[k.split('|')[0]] = by[k.split('|')[0]] || []).push(p);
  const med = (l, i) => l.map((p) => p[i]).sort((a, b) => a - b)[Math.floor(l.length / 2)];
  for (const [k, p] of Object.entries(cache)) {
    if (!p || MANUAL[k]) continue;
    const nat = k.split('|')[0],
      l = by[nat],
      tol = WIDE[nat] || 9;
    if (l.length >= 4 && (Math.abs(p[0] - med(l, 0)) > tol || Math.abs(p[1] - med(l, 1)) > tol * 1.5)) {
      console.log('  doubtful', k, p);
      delete cache[k];
    }
  }
};
sane();
await attempt((k, nat, city) => `${TITLE[k] || city}, ${countryName(nat)}`);
sane();
await attempt((k, nat, city) => `${TITLE[k] || city} (${countryName(nat)})`);
sane();
await attempt((k, nat, city) => `${TITLE[k] || city} (city)`);
sane();
for (const [k] of todo) if (cache[k] === undefined) cache[k] = null;
save();
const missed = [...cities.keys()].filter((k) => !cache[k]);
console.log(`${missed.length} cities not found:`, missed.join('; '));
if (process.argv.includes('--check')) process.exit(0);

// a nation's own centre, for a city that was not found (the middle of the cities that were)
const centre = {};
for (const [key] of cities) {
  const nat = key.split('|')[0];
  if (cache[key]) (centre[nat] = centre[nat] || []).push(cache[key]);
}
const mid = (nat) => {
  const l = centre[nat] || [[20, 0]];
  return [l.reduce((t, p) => t + p[0], 0) / l.length, l.reduce((t, p) => t + p[1], 0) / l.length];
};
const hash = (s) => {
  let h = 2166136261;
  for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
};
const out = {};
for (const [code, c] of Object.entries(real.clubs)) {
  let p = cache[`${c.nat}|${c.row[2]}`];
  if (!p) {
    const m = mid(c.nat),
      h = hash(code);
    p = [m[0] + ((h % 600) - 300) / 100, m[1] + (((h >>> 8) % 600) - 300) / 100]; // (a scatter of up to 3 degrees)
  }
  // a B team shares its parent's ground; clubs of one city sit a few kilometres apart
  const h = hash('geo' + code);
  const jitter = c.row[9] ? 0 : 0.035;
  out[code] = [
    +(p[0] + ((h % 1000) / 1000 - 0.5) * 2 * jitter).toFixed(2),
    +(p[1] + (((h >>> 10) % 1000) / 1000 - 0.5) * 2 * jitter).toFixed(2),
  ];
}
for (const [code, c] of Object.entries(real.clubs)) if (c.row[9] && out[c.row[9]]) out[code] = out[c.row[9]];
const lines = Object.entries(out).map(([k, v]) => `${k}:${v[0]},${v[1]}`);
const body = `// Where each club is (latitude, longitude, to about a kilometre), by club code. Made by tools/geocode.mjs from the places of the
// slots the fictional clubs sit on; the names are fictional, the coordinates are plain facts.
(function () {
  const FM = window.FM;
  FM.D.GEO_RAW = \`
${lines.join('\n')}\`;
  FM.D.GEO = Object.fromEntries(
    FM.D.GEO_RAW.trim()
      .split('\\n')
      .map((l) => {
        const [k, v] = l.split(':');
        return [k, v.split(',').map(Number)];
      }),
  );
})();
`;
fs.writeFileSync(path.join(ROOT, 'js/geo.js'), body);
console.log(`wrote js/geo.js: ${lines.length} clubs`);
