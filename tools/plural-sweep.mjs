// Finds (and with --write rewrites) every place that writes a count before a plural word without a singular check:
//   `${n} goals`  →  `${U.plural(n, 'goal')}`        (a count of 1 then reads "1 goal")
// so a line such as "Yaw Sarpong — 1 caps" cannot be written. Run with --check in the tests: it fails if a place is left.
//   node tools/plural-sweep.mjs          list the places
//   node tools/plural-sweep.mjs --write  rewrite them
//   node tools/plural-sweep.mjs --check  fail when any is left (npm run test:unit does this)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CR = String.fromCharCode(13),
  LF = String.fromCharCode(10);
// plural word → [singular, irregular plural when it is not singular + "s"]
const WORDS = {
  games: ['game'],
  goals: ['goal'],
  caps: ['cap'],
  points: ['point'],
  assists: ['assist'],
  appearances: ['appearance'],
  seasons: ['season'],
  years: ['year'],
  players: ['player'],
  clubs: ['club'],
  titles: ['title'],
  trophies: ['trophy', 'trophies'],
  wins: ['win'],
  draws: ['draw'],
  defeats: ['defeat'],
  losses: ['loss', 'losses'],
  matches: ['match', 'matches'],
  minutes: ['minute'],
  shots: ['shot'],
  saves: ['save'],
  cards: ['card'],
  days: ['day'],
  weeks: ['week'],
  months: ['month'],
  signings: ['signing'],
  transfers: ['transfer'],
  offers: ['offer'],
  bids: ['bid'],
  trials: ['trial'],
  injuries: ['injury', 'injuries'],
  fixtures: ['fixture'],
  rounds: ['round'],
  teams: ['team'],
  managers: ['manager'],
  places: ['place'],
  positions: ['position'],
  keepers: ['keeper'],
  goalkeepers: ['goalkeeper'],
  strikers: ['striker'],
  youngsters: ['youngster'],
  nations: ['nation'],
  countries: ['country', 'countries'],
  leagues: ['league'],
  cups: ['cup'],
  finals: ['final'],
  derbies: ['derby', 'derbies'],
  appearances_: ['appearance'],
};
const SKIP = new Set([
  'changelog.js',
  'carries.js',
  'layouts.js',
  'refstats.js',
  'sim.min.js',
  'data.js',
  'nations.js',
]);
const word =
  '(' +
  Object.keys(WORDS)
    .filter((w) => !w.endsWith('_'))
    .join('|') +
  ')';
const after = new RegExp('^ ' + word + '(?![A-Za-z])');

// the ${...} whose closing brace is at index close (searching back for its opening)
const findOpen = (s, close) => {
  let d = 1;
  for (let i = close - 1; i > 0; i--) {
    if (s[i] === '}') d++;
    else if (s[i] === '{') {
      d--;
      if (d === 0) return s[i - 1] === '$' ? i - 1 : -1;
    }
  }
  return -1;
};
// an expression that is a number: a name, a property, a call, arithmetic; not a string with a ternary or a template inside
const countLike = (e) =>
  !/[`'"?]/.test(e) && !/U\.(money|plural|pts|ordinal)/.test(e) && !/\.(name|label|title)\b/.test(e);

export function sweep(src) {
  let out = '',
    last = 0,
    n = 0;
  const hits = [];
  for (let i = 0; i < src.length; i++) {
    if (src[i] !== '}') continue;
    const m = after.exec(src.slice(i + 1, i + 24));
    if (!m) continue;
    const open = findOpen(src, i);
    if (open < 0 || open < last) continue;
    const expr = src.slice(open + 2, i);
    if (!countLike(expr) || expr.length > 60) continue;
    // already guarded: the same expression compared with 1 nearby is another style; leave those
    const [sing, irregular] = WORDS[m[1]];
    const call = `\${U.plural(${expr}, '${sing}'${irregular && irregular !== sing + 's' ? `, '${irregular}'` : ''})}`;
    out += src.slice(last, open) + call;
    last = i + 1 + m[0].length;
    hits.push(`${expr} ${m[1]}`);
    n++;
  }
  return { text: out + src.slice(last), n, hits };
}

if (process.argv[1] && process.argv[1].endsWith('plural-sweep.mjs')) {
  const args = process.argv.slice(2);
  let total = 0;
  for (const f of fs.readdirSync(path.join(ROOT, 'js')).filter((x) => x.endsWith('.js') && !SKIP.has(x))) {
    const p = path.join(ROOT, 'js', f);
    const raw = fs.readFileSync(p, 'utf8'),
      crlf = raw.includes(CR + LF);
    const { text, n, hits } = sweep(raw.split(CR + LF).join(LF));
    if (!n) continue;
    total += n;
    if (args.includes('--list')) console.log(`${f}: ${hits.slice(0, 40).join(' | ')}`);
    else if (!args.includes('--write') && !args.includes('--check')) console.log(`${f}: ${n}`);
    if (args.includes('--write')) {
      const hasU = /\bU = FM\.U\b|const U = FM\.U|\bU,\s*$/m.test(raw) || /FM\.U\b/.test(raw.slice(0, 2000));
      fs.writeFileSync(p, crlf ? text.split(LF).join(CR + LF) : text);
      if (!hasU) console.log(`${f}: check that U is defined there`);
    }
  }
  console.log(`${total} place${total === 1 ? '' : 's'} with a count before a plural word`);
  if (args.includes('--check') && total) process.exit(1);
}
