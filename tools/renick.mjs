// More nicknames for the clubs. The world's nicknames leaned on colours (111 Reds, 73 Blues, 65 Yellows, 49 Rojos ...) and a nation's
// clubs shared a handful of words. This re-rolls the nickname of every club that has a colour nickname (most of them) or shares a word
// with too many clubs of its nation, from the nation's own words (its library's animals and trades, and a wider list of each language
// below), keeping a third of the colour nicknames where the nation has room. A club keeps its nickname when it is its own: nothing
// else changes. The nicknames are in js/clubs.js (CODE|ABBR|nickname|founded) and data/fictional-world.json.
//   node tools/renick.mjs [--seed 7]          report: the counts before and after, and a sample
//   node tools/renick.mjs --write [--seed 7]  write them
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, ROOT } from './harness.mjs';
import { langOf, nameNick, colourAltFor } from './namelib.mjs';

const args = parseArgs();
const seed = +(args.seed || 7);
const words = (s) =>
  s
    .trim()
    .split(/\s+/)
    .map((w) => w.replace(/_/g, ' '));
// A wider list of each language's club nicknames: animals, trades, people and places that clubs are called after (no real club's)
const EXTRA = {
  eng: words(`Foxes Bulls Stags Badgers Otters Hornets Ravens Owls Kestrels Herons Wolves Bears Swans Rams Cobblers Potters
    Millers Weavers Brewers Colliers Shipbuilders Ironmen Pitmen Rebels Mariners Robins Seasiders Terriers Chargers Minstrels
    Reapers Foresters Lancers Archers Cavaliers Pioneers Quarrymen Fishermen Drovers Miners Steelmen Dockers Lamplighters
    Whalers Smugglers Highwaymen Centurions Crusaders Norsemen Gunners_of_the_Shire Beacons Lighthouses Windmills Sparrows
    Wrens Larks Falcons Stoats Otters Salmon Trout Pike Ospreys Merlins Buzzards Vikings Druids Tinners Cutlers`),
  spa: words(`Halcones Toros Lobos Tiburones Venados Panteras Jaguares Zorros Cóndores Leones Águilas Potros Mineros Marineros
    Cerveceros Cementeros Tigres Gallos Alacranes Pumas Delfines Guerreros Gladiadores Caudillos Charros Arrieros Cañeros
    Pescadores Gauchos Osos Búhos Cuervos Lagartos Toreros Corsarios Cruzados Leñadores Pastores Titanes Rayos Faroleros
    Campesinos Tejedores Vaqueros Segadores Alfareros Alcarraza Arrieros Mulas Linces`),
  por: words(`Leões Tubarões Águias Falcões Onças Lobos Bravos Galos Raposas Jacarés Corsários Mineiros Marujos Pescadores
    Gigantes Imperiais Guerreiros Tigres Panteras Cavaleiros Azulões Touros Cabras Cegonhas Lampiões Ferreiros Oleiros
    Pastores Cruzados Dragões Ursos Foguetes Pioneiros Lavradores Faroleiros`),
  bra: words(`Leões Tubarões Águias Falcões Onças Lobos Galos Raposas Jacarés Corsários Mineiros Marujos Pescadores Gigantes
    Guerreiros Tigres Panteras Cavaleiros Azulões Verdões Touros Bandeirantes Capivaras Tucanos Cangaceiros Jangadeiros
    Garimpeiros Vaqueiros Seringueiros Beija-flores Tamanduás Gaviões Jaguatiricas Colibris Arcos`),
  mex: words(`Halcones Toros Lobos Tiburones Venados Panteras Jaguares Zorros Cóndores Leones Águilas Potros Mineros Marineros
    Cementeros Tigres Gallos Alacranes Pumas Delfines Guerreros Charros Arrieros Cañeros Pescadores Cuervos Coyotes Venadas
    Xolos Gavilanes Pioneros Rayos Cruzados Bravos`),
  arg: words(`Halcones Toros Lobos Tiburones Panteras Zorros Cóndores Leones Águilas Potros Mineros Marineros Tigres Gallos
    Pumas Delfines Guerreros Gauchos Arrieros Pescadores Ñandúes Caranchos Chimangos Cuervos Hornero Ferroviarios Carboneros
    Cerveceros Tamberos Estancieros Albicelestes Millonarios Gigantes`),
  ger: words(`Löwen Adler Wölfe Bären Füchse Falken Stiere Hirsche Schwäne Bergleute Hüttenknappen Brauer Fischer Pioniere Ritter
    Kreuzritter Schanzer Rothirsche Eisenmänner Stahlarbeiter Husaren Dragoner Seeadler Raben Gladiatoren Wikinger Köhler
    Salzsieder Weber Tuchmacher Fuhrleute Steiger Knappen Lotsen Lokomotiven Eisbären Wildschweine Kormorane`),
  nld: words(`Leeuwen Adelaars Wolven Stieren Reuzen Vissers Zeelieden Mijnwerkers Torens Ridders Raven Zwanen Valken Bevers
    Rijders Havenmannen Molenaars Kaasboeren Klompen Dijkwachters Schippers Wevers Brouwers Herten Beren Vikingen Meeuwen`),
  fra: words(`Lions Aigles Loups Corsaires Marins Mineurs Dragons Taureaux Faucons Renards Chevaliers Mousquetaires Canonniers
    Pêcheurs Sangliers Cerfs Hermines Mouettes Corbeaux Gladiateurs Pionniers Ours Comètes Vignerons Forgerons Meuniers
    Bateliers Tisserands Bûcherons Cigognes Sentinelles Chamois Lynx Écureuils`),
  ita: words(`Leoni Aquile Lupi Grifoni Tori Delfini Falchi Cavalieri Minatori Marinai Pescatori Ducali Diavoli Vipere Cinghiali
    Gladiatori Rondinelle Cigni Gabbiani Corvi Birrai Pionieri Orsi Volpi Comete Fabbri Tessitori Vignaioli Alpini Camosci
    Draghi Gufi Cervi Muli Crociati Bersaglieri`),
  nor: words(`Bjørnene Ulvene Ørnene Elgene Hvalene Fiskerne Gruvearbeiderne Vikingene Trollene Jernmennene Skogsmennene
    Sjømennene Måkene Ravnene Hjortene Reinsdyrene Selene Torskene Fyrtårnene Sagbrukene Smedene Bryggerne Gladiatorene`),
  swe: words(`Vikingarna Björnarna Vargarna Älgarna Örnarna Sjömännen Svanarna Lejonen Gruvarbetarna Smederna Fiskarna Skogsmännen
    Lotsarna Falkarna Korparna Renarna Sälarna Hammarna Kämparna`),
  pol: words(`Orły Lwy Wilki Żubry Niedźwiedzie Górnicy Hutnicy Husaria Rycerze Sokoły Żurawie Bobry Rybacy Kowale Flisacy
    Jelenie Rysie Bociany Kruki Piastowie Lisy Mewy`),
  cze: words(`Lvi Orli Vlci Býci Jeleni Horníci Hutníci Rytíři Draci Sokoli Havrani Medvědi Rybáři Kováři Tkalci Sládci Husité
    Lišky Racci Tuři`),
  hun: words(`Oroszlánok Sasok Farkasok Bikák Bányászok Huszárok Sólymok Szarvasok Kovácsok Halászok Sörfőzők Hollók Rókák
    Medvék Lovagok Betyárok`),
  slav: words(`Lavovi Orlovi Vukovi Bikovi Sokolovi Zmajevi Rudari Pivari Pioniri Hajduci Vitezovi Gavranovi Medvedi Ribari
    Kovači Galebovi Lisice Jeleni Čelik Topionice Uskoci`),
  rus: words(`Volki Orly Medvedi Zubry Sokoly Metallurgi Shakhtyory Tigry Bogatyri Kazaki Moryaki Kuznetsy Rybaki Zhuravli Losi
    Kosmonavty Neftyaniki Zheleznodorozhniki Lesorub`),
  tur: words(`Aslanlar Kartallar Kaplanlar Şahinler Kurtlar Boğalar Atmacalar Akıncılar Denizciler Madenciler Fırtına Yıldızlar
    Balıkçılar Demirciler Martılar Kargalar Ayılar Şövalyeler Tilkiler Yeniçeriler`),
  gre: words(`Leóntes Aetoí Lýkoi Drákontes Nautikoí Titánes Spartiátes Alepoúdes Ierakes Taýroi Delfínia Kaloyéroi Ergátes
    Psarádes Ippótes Arkoúdes`),
  arab: words(`Oryx Pearls Divers Dunes Falcons Knights Lions Eagles Horsemen Gazelles Desert_Foxes Camels Hawks Palms Sandstorm
    Dhows Sultans Stallions Nomads Caravans`),
  afr: words(`Lions Éléphants Panthères Léopards Buffles Crocodiles Antilopes Hippopotames Aigles Gazelles Étalons Baobabs
    Hyènes Zèbres Vautours Rhinocéros Pythons Girafes Faucons Chacals`),
  ind: words(`Tigers Elephants Cobras Peacocks Rhinos Lions Jaguars Warriors Nawabs Sultans Titans Panthers Leopards Mariners
    Lotus Hornbills Monsoon Bulls Cheetahs Kings`),
  heb: words(`Lions Eagles Gazelles Knights Foxes Hornets Hawks Cedars Jackals Camels Ibexes Palms Sabras`),
  tha: words(
    `Elephants Tigers Crocodiles Buffaloes Hornbills Dragons Eagles Naga Garudas Lotus Warriors Rockets Sharks Kings`,
  ),
  kor: words(`Tigers Dragons Phoenix Cranes Sharks Eagles Magpies Whales Warriors Rockets Pines Bulls`),
  jpn: words(
    `Cranes Foxes Hawks Wolves Sharks Whales Ravens Tigers Phoenixes Kites Samurai Falcons Lanterns Cherry_Blossoms Koi`,
  ),
  usa: words(
    `Storm Fire Heat Rapids Union Thunder Comets Express Rush Revolution Wolves Bison Stallions Grizzlies Mariners Lumberjacks`,
  ),
};
const KEYMAP = {
  eng: 'eng',
  spa: 'spa',
  por: 'por',
  bra: 'bra',
  mex: 'mex',
  arg: 'arg',
  ger: 'ger',
  nld: 'nld',
  fra: 'fra',
  ita: 'ita',
  nor: 'nor',
  swe: 'swe',
  pol: 'pol',
  cze: 'cze',
  hun: 'hun',
  slav: 'slav',
  rus: 'rus',
  tur: 'tur',
  gre: 'gre',
  arab: 'arab',
  gulf: 'arab',
  egy: 'arab',
  afr: 'afr',
  ind: 'ind',
  pak: 'ind',
  ban: 'ind',
  heb: 'heb',
  tha: 'tha',
  mys: 'tha',
  sgp: 'tha',
  vie: 'tha',
  kor: 'kor',
  chn: 'kor',
  jpn: 'jpn',
};
const extraFor = (L) => EXTRA[KEYMAP[L.key]] || [];

const W = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/fictional-world.json'), 'utf8'));
const hash = (s) => {
  let h = 2166136261;
  for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
};
const rng = (s) => {
  let a = hash(s) || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
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

// every colour word of every nation
const COLOUR_WORDS = new Set();
const nats = [...new Set(Object.values(W.clubs).map((c) => c.nat))];
for (const n of nats) {
  const L = langOf(n);
  for (const v of Object.values(L.colours || {})) COLOUR_WORDS.add(v);
  const alt = colourAltFor(L);
  if (alt) for (const l of Object.values(alt)) for (const v of l) COLOUR_WORDS.add(v);
}
const isColour = (n) => COLOUR_WORDS.has(n);

const out = {};
const taken = {}; // nation -> nickname -> count
const cnt = (nat, n) => (taken[nat] = taken[nat] || {})[n] || 0;
const add = (nat, n) => ((taken[nat] = taken[nat] || {}), (taken[nat][n] = (taken[nat][n] || 0) + 1));
const codes = Object.keys(W.clubs).sort();
const clubsIn = {};
for (const k of codes) clubsIn[W.clubs[k].nat] = (clubsIn[W.clubs[k].nat] || 0) + 1;
// 1. clubs keeping a nickname that is their own (not a colour, not shared by more than two of the nation's clubs)
const before = {};
for (const k of codes)
  ((before[W.clubs[k].nat] = before[W.clubs[k].nat] || {}),
    (before[W.clubs[k].nat][W.clubs[k].nick] = (before[W.clubs[k].nat][W.clubs[k].nick] || 0) + 1));
for (const k of codes) {
  const c = W.clubs[k],
    r = rng(`${seed}|keep|${k}`);
  if (c.row[9]) {
    out[k] = c.nick; // (a B team has no nickname of its own)
    continue;
  }
  const shared = before[c.nat][c.nick] > 2;
  const keepColour =
    isColour(c.nick) && r() < 0.28 && cnt(c.nat, c.nick) < Math.max(2, Math.ceil(clubsIn[c.nat] * 0.2));
  if (c.nick && ((!isColour(c.nick) && !shared) || keepColour) && cnt(c.nat, c.nick) < (isColour(c.nick) ? 99 : 2)) {
    out[k] = c.nick;
    add(c.nat, c.nick);
  }
}
// 2. the rest are re-rolled from the nation's words
for (const k of codes) {
  if (out[k] !== undefined) continue;
  const c = W.clubs[k],
    L = langOf(c.nat),
    r = rng(`${seed}|roll|${k}`);
  const col = L.colours[colourName(c.row[3])];
  const pool = [...new Set([...(L.misc || []), ...extraFor(L)])];
  const hint = nameNick(c.row[0]);
  let pick = null;
  if (hint && cnt(c.nat, hint) < 2 && r() < 0.8) pick = hint;
  if (!pick && col && r() < 0.18 && cnt(c.nat, col) < Math.max(2, Math.ceil(clubsIn[c.nat] * 0.2))) pick = col;
  for (let tries = 0; !pick && tries < 80; tries++) {
    const w = pool[Math.floor(r() * pool.length)];
    if (w && cnt(c.nat, w) < (tries < 40 ? 1 : 2)) pick = w;
  }
  if (!pick) pick = col || pool[0] || c.nick;
  out[k] = pick;
  add(c.nat, pick);
}
const tally = (f) => {
  const m = {};
  for (const k of codes) m[f(k)] = (m[f(k)] || 0) + 1;
  return m;
};
const top = (m, n = 12) =>
  Object.entries(m)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map((x) => x.join(':'))
    .join(' ');
const was = tally((k) => W.clubs[k].nick),
  now = tally((k) => out[k]);
console.log(`before: ${Object.keys(was).length} distinct; ${top(was)}`);
console.log(`after:  ${Object.keys(now).length} distinct; ${top(now)}`);
console.log(`changed ${codes.filter((k) => out[k] !== W.clubs[k].nick).length} of ${codes.length}`);
const perNat = (f) => {
  const m = {};
  for (const k of codes) (m[W.clubs[k].nat] = m[W.clubs[k].nat] || new Set()).add(f(k));
  return m;
};
const pa = perNat((k) => W.clubs[k].nick),
  pb = perNat((k) => out[k]);
console.log(
  'distinct per nation (before → after): ' +
    ['ENG', 'ESP', 'GER', 'FRA', 'BRA', 'USA', 'JPN', 'KEN', 'TRI', 'GUA', 'MNE']
      .map((n) => `${n} ${pa[n].size}→${pb[n].size}`)
      .join(', '),
);
if (!('write' in args)) {
  for (const k of codes.filter((x) => ['ENG', 'ESP', 'BRA', 'JPN'].includes(W.clubs[x].nat)).slice(0, 14))
    console.log(`  ${W.clubs[k].row[0]}: ${W.clubs[k].nick} → ${out[k]}`);
  process.exit(0);
}
// ---------- write ----------
const edit = (file, fn) => {
  const f = path.join(ROOT, file);
  let t = fs.readFileSync(f, 'utf8');
  const crlf = t.includes('\r\n');
  if (crlf) t = t.replace(/\r\n/g, '\n');
  t = fn(t);
  if (crlf) t = t.replace(/\n/g, '\r\n');
  fs.writeFileSync(f, t);
};
edit('js/clubs.js', (t) =>
  t
    .split('\n')
    .map((line) => {
      const m = /^(`?)([A-Z0-9]+)\|([^|]*)\|([^|]*)\|(\d*)(`?)$/.exec(line);
      return m && out[m[2]] !== undefined ? `${m[1]}${m[2]}|${m[3]}|${out[m[2]]}|${m[5]}${m[6]}` : line;
    })
    .join('\n'),
);
for (const k of codes) W.clubs[k].nick = out[k];
fs.writeFileSync(path.join(ROOT, 'data/fictional-world.json'), JSON.stringify(W, null, 1) + '\n');
console.log('written: js/clubs.js, data/fictional-world.json');
