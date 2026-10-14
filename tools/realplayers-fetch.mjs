// Fetches what a real-world database of players is made from, for the clubs of the chosen leagues, and keeps it in a cache folder (never in
// the repo): the current first-team squad of each club from its English Wikipedia article (the Fs player templates: shirt number, nation,
// position, name), then for each player his birth date, positions, number of Wikipedia language editions, awards and caps for his
// country from Wikidata. tools/realplayers-build.mjs turns the cache into a world pack.
//
//   node tools/realplayers-fetch.mjs --cache <folder> [--leagues D1,D2,ES1,ES2,DE1,DE2,IT1,IT2,FR1,FR2] [--clubs N]
//
// Licences: Wikipedia text is CC BY-SA 4.0 and Wikidata is CC0; a pack built from them carries the Wikipedia attribution (the build tool
// writes it into the pack's description). The squads are as the articles hold them the day this runs; a club whose article has no
// squad table, or one the parser does not read, is reported and left to the game's own generated squad.
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
if (!args.cache || args.cache === true) {
  console.log('usage: node tools/realplayers-fetch.mjs --cache <folder> [--leagues D1,D2,...] [--clubs N]');
  process.exit(1);
}
const CACHE = path.resolve(String(args.cache));
fs.mkdirSync(CACHE, { recursive: true });
const LEAGUES = String(
  args.leagues && args.leagues !== true ? args.leagues : 'D1,D2,ES1,ES2,DE1,DE2,IT1,IT2,FR1,FR2',
).split(',');
const UA = { 'User-Agent': 'TouchlineDbBuilder/0.1 (personal project; github.com/tpkhoon/touchline)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const load = (f, d) =>
  fs.existsSync(path.join(CACHE, f)) ? JSON.parse(fs.readFileSync(path.join(CACHE, f), 'utf8')) : d;
const save = (f, v) => fs.writeFileSync(path.join(CACHE, f), JSON.stringify(v));

async function wiki(params, tries = 8) {
  // (the API answers "too many requests" with a page of text, not an error: wait it out and go again)
  for (let t = 0; t < tries; t++) {
    try {
      const r = await fetch(
        'https://en.wikipedia.org/w/api.php?' + new URLSearchParams({ format: 'json', ...params }),
        { headers: UA },
      );
      const text = await r.text();
      if (r.ok && text.startsWith('{')) return JSON.parse(text);
    } catch {
      /* go again */
    }
    await sleep(6000 * (t + 1));
  }
  return null;
}

// ---------- 1. each club's squad ----------
const OK_HEAD = /first.?team|current squad|^squad$|^players$|^team$|first.team squad/i;
const BAD_HEAD =
  /loan|reserve|academy|youth|under|u-?\d\d|b team|women|staff|management|former|notable|retired|internationals|captains|records/i;
export function parseSquad(wt) {
  const lines = wt.split(/\r?\n/);
  let head = '',
    ok = false;
  const out = [];
  for (const ln of lines) {
    const h = /^=+\s*([^=]+?)\s*=+\s*$/.exec(ln);
    if (h) {
      head = h[1];
      ok = OK_HEAD.test(head) && !BAD_HEAD.test(head);
      continue;
    }
    if (!ok) continue;
    const m = /\{\{\s*(?:fs player|football squad player|fs2 player|football squad2 player)\s*\|(.*)\}\}/i.exec(ln);
    if (!m) continue;
    const f = {};
    // (a pipe inside a link, [[Target|shown]], does not end the field)
    const PIPE = String.fromCharCode(1);
    const body = m[1].replace(/\[\[[^\]]*\]\]/g, (x) => x.split('|').join(PIPE));
    for (const part of body.split('|')) {
      const i = part.indexOf('=');
      if (i > 0)
        f[part.slice(0, i).trim().toLowerCase()] = part
          .slice(i + 1)
          .trim()
          .split(PIPE)
          .join('|');
    }
    const nm = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/.exec(f.name || '');
    const plain = (f.name || '').replace(/\[\[|\]\]|'''|''/g, '').trim();
    if (!nm && !plain) continue;
    out.push({
      no: f.no ? +f.no : null,
      nat: (f.nat || '').toUpperCase(),
      pos: (f.pos || '').toUpperCase(),
      title: nm ? nm[1].trim() : null,
      name: nm ? (nm[2] || nm[1]).trim() : plain,
      other: (f.other || '').replace(/\[\[|\]\]/g, '').slice(0, 60),
    });
  }
  return out;
}
const real = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/real-world.json'), 'utf8'));
let clubs = Object.entries(real.clubs).filter(([, c]) => LEAGUES.includes(c.league));
if (args.clubs && args.clubs !== true) clubs = clubs.slice(0, +args.clubs);
const squads = load('squads.json', {});
const titleOf = load('club-titles.json', {});
const failed = [];
async function squadFor(code, c) {
  const name = c.row[0];
  const cands = titleOf[code]
    ? [titleOf[code]]
    : [
        `${name} F.C.`,
        `${name} FC`,
        `${name} CF`,
        name,
        `${name} AFC`,
        `${name} (football club)`,
        `${name} SC`,
        `${name} Calcio`,
        `${name} Football Club`,
      ];
  const tried = new Set();
  const tryTitle = async (title) => {
    if (tried.has(title)) return null;
    tried.add(title);
    const j = await wiki({ action: 'parse', page: title, prop: 'wikitext', redirects: '1' });
    const wt = j && j.parse && j.parse.wikitext && j.parse.wikitext['*'];
    if (!wt) return null;
    const sq = parseSquad(wt);
    return sq.length >= 11 ? { title: j.parse.title, sq } : null;
  };
  for (const t of cands) {
    const r = await tryTitle(t);
    if (r) return r;
  }
  // the search: the club's name and the word football
  const s = await wiki({
    action: 'query',
    list: 'search',
    srsearch: `${name} football club ${c.row[2] || ''}`,
    srlimit: '5',
  });
  for (const hit of (s && s.query && s.query.search) || []) {
    const r = await tryTitle(hit.title);
    if (r) return r;
  }
  return null;
}
let done = 0;
for (const [code, c] of clubs) {
  if (squads[code]) {
    done++;
    continue;
  }
  const r = await squadFor(code, c);
  if (r) {
    squads[code] = { title: r.title, players: r.sq };
    titleOf[code] = r.title;
  } else failed.push(`${code} ${c.row[0]}`);
  done++;
  if (done % 10 === 0) {
    save('squads.json', squads);
    save('club-titles.json', titleOf);
    console.log(`  ${done}/${clubs.length} clubs, ${Object.keys(squads).length} squads`);
  }
  await sleep(500);
}
save('squads.json', squads);
save('club-titles.json', titleOf);
console.log(
  `squads: ${Object.keys(squads).length} of ${clubs.length} clubs; not found: ${failed.join('; ') || 'none'}`,
);

// ---------- 2. the players' Wikidata items ----------
const titles = [...new Set(Object.values(squads).flatMap((s) => s.players.map((p) => p.title).filter(Boolean)))];
const qidOf = load('titles-qid.json', {});
const todo = titles.filter((t) => !(t in qidOf));
for (let i = 0; i < todo.length; i += 50) {
  const batch = todo.slice(i, i + 50);
  const j = await wiki({
    action: 'query',
    prop: 'pageprops',
    ppprop: 'wikibase_item',
    redirects: '1',
    titles: batch.join('|'),
  });
  if (!j || !j.query) continue;
  const norm = Object.fromEntries((j.query.normalized || []).map((n) => [n.from, n.to]));
  const redir = Object.fromEntries((j.query.redirects || []).map((n) => [n.from, n.to]));
  const byTitle = {};
  for (const p of Object.values(j.query.pages || {})) byTitle[p.title] = p.pageprops && p.pageprops.wikibase_item;
  for (const t of batch) {
    let x = norm[t] || t;
    x = redir[x] || x;
    qidOf[t] = byTitle[x] || null;
  }
  if ((i / 50) % 10 === 0) console.log(`  titles ${i + batch.length}/${todo.length}`);
  await sleep(400);
}
save('titles-qid.json', qidOf);
console.log(`players with a Wikidata item: ${Object.values(qidOf).filter(Boolean).length} of ${titles.length}`);

// ---------- 3. Wikidata: birth date, positions, language editions, awards, caps ----------
async function sparql(query) {
  for (let t = 0; t < 5; t++) {
    try {
      const r = await fetch('https://query.wikidata.org/sparql', {
        method: 'POST',
        headers: {
          ...UA,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/sparql-results+json',
        },
        body: new URLSearchParams({ query }).toString(),
      });
      if (r.ok) return (await r.json()).results.bindings;
    } catch {
      /* retry */
    }
    await sleep(2500 * (t + 1));
  }
  return null;
}
const wd = load('wikidata.json', {});
const qids = [...new Set(Object.values(qidOf).filter(Boolean))].filter((q) => !(q in wd));
for (let i = 0; i < qids.length; i += 250) {
  const batch = qids.slice(i, i + 250),
    vals = batch.map((q) => `wd:${q}`).join(' ');
  const a = await sparql(
    `SELECT ?p (SAMPLE(?dob) AS ?d) (MAX(?sl) AS ?sitelinks) (GROUP_CONCAT(DISTINCT ?pl; separator="|") AS ?pos) (COUNT(DISTINCT ?aw) AS ?awards) WHERE { VALUES ?p { ${vals} } ?p wikibase:sitelinks ?sl . OPTIONAL { ?p wdt:P569 ?dob } OPTIONAL { ?p wdt:P413 ?po . ?po rdfs:label ?pl FILTER(lang(?pl) = "en") } OPTIONAL { ?p wdt:P166 ?aw } } GROUP BY ?p`,
  );
  const c = await sparql(
    `SELECT ?p (SUM(?n) AS ?caps) WHERE { VALUES ?p { ${vals} } ?p p:P54 ?st . ?st ps:P54 ?t ; pq:P1350 ?n . ?t wdt:P31 wd:Q6979593 . } GROUP BY ?p`,
  );
  const caps = Object.fromEntries((c || []).map((r) => [r.p.value.split('/').pop(), +r.caps.value]));
  for (const r of a || []) {
    const q = r.p.value.split('/').pop();
    wd[q] = {
      dob: r.d ? r.d.value.slice(0, 10) : null,
      sl: +r.sitelinks.value,
      pos: r.pos.value ? r.pos.value.split('|') : [],
      aw: +r.awards.value,
      caps: caps[q] || 0,
    };
  }
  save('wikidata.json', wd);
  console.log(`  wikidata ${Math.min(i + 250, qids.length)}/${qids.length}`);
  await sleep(1500);
}
console.log(`done: ${Object.keys(wd).length} players with Wikidata facts`);
