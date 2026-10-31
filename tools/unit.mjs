// Fast unit tests for the pure functions (a few seconds, no world is built): text helpers, name rules, the name generator's
// shares, the signing rules, the escaping, the real-stats converter. The deploy runs these before it publishes (npm run test:unit);
// the long simulation tests (npm run test:quick, test:suite, test:long) stay for before a release.
//   node tools/unit.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadSim } from './harness.mjs';

const { FM } = loadSim(5);
const U = FM.U,
  D = FM.D,
  W = FM.W;
const WD_validatePlayer = (p) => FM.WorldDef.validatePlayer(p, { clubs: new Set(), year: 2026 }).errors;
const fails = [];
let n = 0;
const eq = (got, want, what) => {
  n++;
  if (JSON.stringify(got) !== JSON.stringify(want))
    fails.push(`${what}: got ${JSON.stringify(got)}, wanted ${JSON.stringify(want)}`);
};
const ok = (cond, what) => {
  n++;
  if (!cond) fails.push(what);
};

// ---- text: plurals and a / an ----
eq(U.plural(1, 'point'), '1 point', 'plural of one');
eq(U.plural(0, 'point'), '0 points', 'plural of none');
eq(U.plural(2, 'cap'), '2 caps', 'plural of two');
eq(U.plural(1, 'match', 'matches'), '1 match', 'an irregular plural of one');
eq(U.plural(3, 'match', 'matches'), '3 matches', 'an irregular plural');
eq(U.plural('1', 'goal'), '1 goal', 'plural of a count written as text');
eq(U.a('attacking midfielder'), 'an attacking midfielder', 'an before a vowel');
eq(U.a('giant'), 'a giant', 'a before a consonant');
eq(U.a('ST'), 'an ST', 'an before an acronym said with a vowel (ess-tee)');
eq(U.a('CB'), 'a CB', 'a before an acronym said with a consonant (see-bee)');
eq(U.a('AM'), 'an AM', 'an before AM');
eq(U.a('hour'), 'an hour', 'an before a silent h');
eq(U.a('university'), 'a university', 'a before a yoo sound');
eq(U.a('European'), 'a European', 'a before a yoo sound (Eu)');

// ---- escaping ----
eq(U.esc('<b>"x" & \'y\'</b>'), '&lt;b&gt;&quot;x&quot; &amp; &#39;y&#39;&lt;/b&gt;', 'esc');
eq(String(U.html`<b>${'<script>'}</b>`), '<b>&lt;script&gt;</b>', 'html escapes what goes in');
eq(String(U.html`<i>${U.raw('<u>ok</u>')}</i>`), '<i><u>ok</u></i>', 'raw passes through');
eq(String(U.html`<p>${U.html`<b>${'&'}</b>`}</p>`), '<p><b>&amp;</b></p>', 'html nests without escaping twice');
eq(
  String(U.html`<ul>${['a<', 'b'].map((x) => U.html`<li>${x}</li>`)}</ul>`),
  '<ul><li>a&lt;</li><li>b</li></ul>',
  'html joins lists',
);
eq(String(U.html`${null}${undefined}${0}`), '0', 'html treats nothing as empty and zero as zero');

// ---- text from other people's files ----
eq(
  U.clean('<img src=x onerror=alert(1)>"Bob"'),
  'img src=x onerror=alert(1)Bob',
  'clean takes out < > " and control characters',
);
eq(U.clean("O'Neill & Sons"), "O'Neill & Sons", 'clean leaves apostrophes and ampersands');
{
  const bad = {
    clubs: [{ name: '<b>Evil</b>', nick: 'He said "hi"', ok: 'Fine', n: 3 }],
    deep: { a: [{ b: ['<x>'] }] },
  };
  const changed = U.cleanDeep(bad);
  eq(
    [changed, bad.clubs[0].name, bad.clubs[0].nick, bad.deep.a[0].b[0], bad.clubs[0].ok],
    [3, 'bEvil/b', 'He said hi', 'x', 'Fine'],
    'cleanDeep cleans nested text',
  );
}
{
  // a malicious database file is cleaned as it is read, whatever its format
  const def = JSON.parse(JSON.stringify(FM.WorldDef.blank('<script>alert(1)</script>')));
  def.meta.author = 'a"onmouseover="x';
  const read = FM.DbImport.read([{ name: 'x.json', text: JSON.stringify(def) }]);
  ok(!/[<>"]/.test(read.def.meta.name + read.def.meta.author), 'a database name or author keeps a < > or "');
  ok(
    read.notes.some((x) => /taken out/.test(x)),
    'the reader says it took characters out',
  );
}

// ---- names ----
ok(D.isRude('Fuck City') && D.isRude('SEX') && D.isRude('Mierda FC'), 'rude names are caught');
ok(!D.isRude('Dickens United') && !D.isRude('Cocker Town') && !D.isRude('Baywick United'), 'real names are not rude');
ok(W.nickClash('Canaries', ['#6cabdd', '#1c2c5b']), 'a Canaries nickname on a blue kit clashes');
ok(!W.nickClash('Canaries', ['#ffd100', '#111111']), 'a Canaries nickname on a yellow kit fits');
ok(!W.nickClash('Hammers', ['#6cabdd', '#1c2c5b']), 'a nickname that names no colour never clashes');
const roll = (nat, k = 3000) => Array.from({ length: k }, () => W.pickSurname(nat));
const share = (list, set) => list.filter((x) => set.includes(x)).length / list.length;
ok(share(roll('KOR'), ['Kim', 'Lee', 'Park']) > 0.38, 'Korean surnames follow their real shares');
ok(share(roll('VIE'), ['Nguyễn']) > 0.3, 'Nguyễn is the commonest Vietnamese surname');
ok(
  roll('VIE').every((x) => !/^(Nguyen|Tran|Pham)$/.test(x)),
  'Vietnamese surnames keep their accents',
);
for (const nat of Object.keys(D.SURNAME_WEIGHTS)) {
  const total = Object.values(D.SURNAME_WEIGHTS[nat]).reduce((a, b) => a + b, 0);
  ok(total > 0 && total < 100, `${nat}: the listed surname shares add up to ${total}`);
}
const dup = (nat) => {
  const N = D.NATIONS[nat];
  return N.fn.length === new Set(N.fn).size && N.ln.length === new Set(N.ln).size;
};
ok(['ENG', 'ESP', 'KOR', 'VIE', 'SGP'].every(dup), 'a nation lists a name twice');
// communities: no Malay first name with a Chinese surname
const malayFn = new Set(D.NAME_POOLS.malay.fn);
const chinese = new Set(['Tan', 'Lim', 'Lee', 'Ng', 'Goh', 'Teo', 'Chua', 'Koh', 'Ong', 'Wong']);
ok(
  Array.from({ length: 1500 }, () => W.rollName('SGP', null, 2000)).every(
    (x) => !(malayFn.has(x.fn) && chinese.has(x.ln)),
  ),
  'Singapore mixes communities in a name',
);
ok(
  Array.from({ length: 300 }, () => W.rollName('KSA', null, 2000)).every((x) => /^Al-/.test(x.ln)),
  'a Saudi surname without Al-',
);

// ---- signing rules ----
const club = (policy) => ({ name: 'Test FC', policy });
const man = (o) => ({ nat: 'AUT', nat2: null, heritage: null, ...o });
const R = FM.Reg;
ok(R.policy(club(null), man({})).ok, 'a club without a rule signs anyone');
ok(R.policy(club({ nat: 'AUT', label: 'Austrian' }), man({})).ok, 'a nation rule takes its own nation');
ok(!R.policy(club({ nat: 'AUT', label: 'Austrian' }), man({ nat: 'GER' })).ok, 'a nation rule refuses another nation');
ok(
  R.policy(club({ nat: 'AUT', label: 'Austrian' }), man({ nat: 'GER', nat2: 'AUT' })).ok,
  'a nation rule takes a second nationality',
);
ok(
  R.policy(club({ region: 'AFR', label: 'African' }), man({ nat: 'NGA' })).ok,
  'a region rule takes a player of that region',
);
ok(
  !R.policy(club({ region: 'AFR', label: 'African' }), man({ nat: 'ENG' })).ok,
  'a region rule refuses another region',
);
ok(
  R.policy(club({ heritage: 'basque', label: 'Basque' }), man({ nat: 'ESP', heritage: 'basque' })).ok,
  'a heritage rule takes that heritage',
);
ok(!R.policy(club({ heritage: 'basque', label: 'Basque' }), man({ nat: 'ESP' })).ok, 'a heritage rule refuses another');

// ---- the real-stats converter and the reference table ----
const rs = FM.RealStats;
const g = D.REFSTATS && D.REFSTATS.groups;
ok(
  g && ['GK', 'CB', 'FB', 'DM', 'CM', 'AM', 'W', 'ST'].every((k) => g[k]),
  'the reference table lacks a position group',
);
ok(g && g.ST.gls[0] > g.CB.gls[0] * 4, 'strikers score far more than centre-backs in the table');
ok(g && g.CB.clr[0] > g.FB.clr[0], 'centre-backs clear more than full-backs in the table');
eq(rs.position('LWB'), 'WB', 'a position alias');
const st = { pos: 'ST', age: 25, minutes: 2700, league: 'D1', goals: 15, xg: 14, shots: 90, passes: 500, passPct: 76 };
eq(JSON.stringify(rs.convert(st)), JSON.stringify(rs.convert(st)), 'the converter is deterministic');
ok(rs.convert({ ...st, goals: 25, xg: 22 }).ca > rs.convert(st).ca, 'more goals, a better striker');
ok(
  rs.convert({ ...st, age: 19, minutes: 2500 }).paRange[1] > rs.convert({ ...st, age: 30 }).paRange[1] - 1,
  'a young regular has room to grow',
);
// no place writes a count before a plural word without the singular check ("1 caps")
try {
  execFileSync(process.execPath, [fileURLToPath(new URL('./plural-sweep.mjs', import.meta.url)), '--check'], {
    stdio: 'pipe',
  });
  n++;
} catch (e) {
  fails.push(
    'a count is written before a plural word without U.plural: node tools/plural-sweep.mjs --write fixes it. ' +
      String(e.stdout || '').slice(0, 200),
  );
}
// the converter's own command-line test (the same suite the dashboard runs)
try {
  execFileSync(process.execPath, [fileURLToPath(new URL('./realstats.mjs', import.meta.url)), '--test'], {
    stdio: 'pipe',
  });
  n++;
} catch (e) {
  fails.push('tools/realstats.mjs --test failed: ' + String(e.stdout || e.message).slice(0, 200));
}

// the generator refuses real players' names, which the game keeps only as hashes (the list itself is in the private folder, and is
// checked when it is here)
{
  ok(
    typeof W.isRealName === 'function' && !W.isRealName('Quentin Fictionaire'),
    'a made-up name is taken for a real one',
  );
  const list = (await import('./private.mjs')).privateFile('real-player-names.txt');
  if (list) {
    const names = fs.readFileSync(list, 'utf8').split(/\r?\n/).filter(Boolean);
    eq(
      names.filter((n) => !W.isRealName(n)),
      [],
      'a real name is not refused by the generator',
    );
  }
}
// the private inbox: what the game posts is kept and grouped by version and area; nonsense is refused
{
  const { startInbox, readInbox, groupInbox } = await import('./inbox.mjs');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'touchline-inbox-'));
  const server = await startInbox({ port: 0, dir, perHour: 4 });
  const url = `http://127.0.0.1:${server.address().port}/`;
  const post = (body) =>
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const tag = { version: '0.5.0', build: 147, platform: 'web', saveFormat: 7, area: 'Match day', at: 1 };
  eq((await post({ kind: 'feedback', note: 'More tactics', ...tag })).status, 200, 'the inbox takes feedback');
  eq(
    (await post({ kind: 'problem', note: 'It froze', ...tag, file: Buffer.from('a save').toString('base64') })).status,
    200,
    'the inbox takes a problem report',
  );
  eq((await post({ kind: 'spam', note: 'x' })).status, 400, 'the inbox refuses an unknown kind');
  const rows = readInbox(dir);
  eq(rows.length, 2, 'both items are kept');
  ok(
    rows.some((r) => r.kind === 'problem' && r.hasFile),
    'a problem report keeps its file',
  );
  eq(
    groupInbox(rows).map((g) => [g.version, g.area, g.problems, g.feedback]),
    [['0.5.0', 'Match day', 1, 1]],
    'items are grouped by version and area',
  );
  await post({ kind: 'feedback', note: 'a', ...tag });
  await post({ kind: 'feedback', note: 'b', ...tag });
  eq(
    (await post({ kind: 'feedback', note: 'c', ...tag })).status,
    429,
    'the inbox limits what one address can send in an hour',
  );
  server.closeAllConnections();
  await new Promise((r) => server.close(r));
  fs.rmSync(dir, { recursive: true, force: true });
}

// ---- nationality archetypes: how a nation's players are made ----
{
  const lean = (nat, pos, k) => D.archetypeLean(nat, pos)[k] || 0;
  ok(
    lean('BRA', 'ST', 'dribbling') > 0.8 && lean('BRA', 'ST', 'technique') > 0.5,
    'a Brazilian forward leans to dribbling and technique',
  );
  ok(lean('BRA', 'FB', 'dribbling') > 0.5 && lean('BRA', 'CB', 'tackling') < 0, 'a Brazilian defender is adventurous');
  ok(
    lean('SRB', 'CB', 'tackling') > 1 && lean('SRB', 'CB', 'passing') > 0.5,
    'a Serbian defender tackles hard and plays the ball out',
  );
  ok(lean('SRB', 'CM', 'technique') > 0.5, 'a Serbian midfielder is technical');
  ok(
    lean('GER', 'GK', 'handling') > 0.5 && lean('THA', 'GK', 'handling') <= 0.3,
    'Germany has a goalkeeping school, Thailand has none',
  );
  ok(lean('ITA', 'CB', 'positioning') > 1.2, 'an Italian centre-back reads the game');
  ok(
    D.archetypesOf('KOR').includes('engine') && D.archetypesOf('KOR').includes('orient'),
    'Korea is in two archetypes',
  );
  ok(
    D.archetypesOf('SOM').length > 0 && D.archetypeText('SOM').every((a) => a.label && a.desc),
    "a nation outside the lists has its part of the world's archetype",
  );
  ok(
    D.archetypeTraits('BRA').some(([t]) => t === 'Flair') &&
      D.archetypeTraits('DEN').some(([t]) => t === 'Aerial Threat'),
    'Flair for Brazil, Aerial Threat for Denmark',
  );
  const worst = Object.keys(D.NATIONS).filter(
    (c) => Math.abs(Object.values(D.archetypeLean(c, 'CM')).reduce((t, v) => t + Math.abs(v), 0)) > 12,
  );
  ok(!worst.length, `an archetype leans too far: ${worst.slice(0, 3)}`);
}

// ---- nationality in pieces: birth, heritage origins, passports (js/citizenship.js) ----
{
  const plain = { id: 'p1', nat: 'ENG' };
  eq(W.birthOf(plain), 'ENG', 'a player with no birthplace was born where he grew up');
  eq(W.citizenships(plain), ['ENG'], 'a player with no passports list holds the passport of his own nation');
  eq(W.originsOf(plain), [], 'a player with no origins has none');
  eq(W.eligibleFor(plain), ['ENG'], 'a home-grown player is eligible for his own nation only');
  const dual = { id: 'p2', nat: 'FRA', birth: 'COD', cit: ['FRA', 'COD'], origins: [['COD', 1]], nat2: 'COD' };
  eq(W.eligibleFor(dual), ['FRA', 'COD'], 'born in DR Congo, raised in France: eligible for both');
  ok(W.holdsPassport(dual, 'COD') && !W.holdsPassport(dual, 'MAR'), 'a passport held, and one not');
  // an older player: his heritage and second nation give his origin; a naturalised player holds the new passport
  const old = { id: 'p3', nat: 'FRA', nat2: 'MAR', heritage: 'maghrebi' };
  W.migrateNationality(old);
  eq(old.origins, [['MAR', 0.5]], 'the heritage of an older player becomes an origin');
  const before = JSON.stringify(old);
  W.migrateNationality(old);
  eq(JSON.stringify(old), before, 'migrating twice changes nothing');
  const nat = { id: 'p4', nat: 'ENG', nat2: 'ESP', natur: { code: 'ESP', year: 2020 } };
  W.migrateNationality(nat);
  ok(W.holdsPassport(nat, 'ESP'), 'a naturalised player holds the new passport');
  const plain2 = { id: 'p5', nat: 'ENG' };
  W.migrateNationality(plain2);
  eq(Object.keys(plain2), ['id', 'nat'], 'a home-grown player keeps no extra field');
  // the draw for a player of heritage: about seven in ten of those with an origin country can play for it
  let withOrigin = 0,
    eligible = 0,
    held = 0,
    abroad = 0;
  for (let i = 0; i < 4000; i++) {
    const p = { id: 'q' + i, nat: 'FRA' };
    W.rollOrigin(p, 'FRA', 'maghrebi', null);
    if (p.origins) withOrigin++;
    if (p.nat2) eligible++;
    if (p.cit) held++;
    if (p.birth) abroad++;
    if (p.nat2) ok(W.eligibleFor(p).includes(p.nat2), 'a second nation is in his eligible list');
    if (p.cit) ok(p.cit.includes('FRA') && p.nat2, 'a heritage passport comes with eligibility');
  }
  ok(withOrigin === 4000, 'a Maghrebi heritage always has an origin country');
  ok(
    eligible / withOrigin > 0.95,
    `Morocco's law reaches any ancestor, so every Maghrebi origin can play for it (${(eligible / withOrigin).toFixed(2)})`,
  );
  ok(
    held < eligible && held / eligible > 0.5 && held / eligible < 0.85,
    `most of those eligible hold the passport, not all (${(held / eligible).toFixed(2)})`,
  );
  ok(
    abroad / withOrigin > 0.04 && abroad / withOrigin < 0.1,
    `some are born abroad (${(abroad / withOrigin).toFixed(2)})`,
  );
  // the laws decide who can claim: a parent is enough nearly everywhere, a grandparent in some nations, and a nation that bans another passport makes holding both rare
  ok(
    W.canRepresent({ id: 'a', nat: 'ENG', origins: [['IND', 0.5]] }, 'IND').via === 'descent',
    'one Indian parent: could claim Indian citizenship',
  );
  ok(
    !W.canRepresent({ id: 'b', nat: 'ENG', origins: [['IND', 0.25]] }, 'IND').ok,
    "an Indian grandparent is not enough: India's law reaches back one generation",
  );
  ok(
    W.canRepresent({ id: 'c', nat: 'ENG', origins: [['ITA', 0.25]] }, 'ITA').via === 'descent',
    'an Italian grandparent is enough',
  );
  ok(
    W.canRepresent({ id: 'd', nat: 'FRA', cit: ['FRA', 'MAR'] }, 'MAR').via === 'passport',
    'a Moroccan passport is held',
  );
  ok(
    W.canRepresent({ id: 'e', nat: 'FRA', birth: 'COD' }, 'COD').via === 'birth',
    'born in DR Congo: eligible through birth',
  );
  ok(
    W.canRepresent({ id: 'f', nat: 'ENG', nat2: 'ESP' }, 'ESP').via === 'family',
    "an older save's second nation is still eligible",
  );
  ok(!W.canRepresent({ id: 'g', nat: 'ENG' }, 'ESP').ok, 'no link, no eligibility');
  eq(W.law('XXX'), { soli: 'none', descent: 1, dual: 'yes' }, 'a nation with no listed law has the default');
  {
    // patronymics and fathers' names
    eq(
      ['Jón', 'Guðmundur', 'Árni', 'Magnús', 'Gunnar', 'Sigurður'].map(W.patronym),
      ['Jónsson', 'Guðmundsson', 'Árnason', 'Magnússon', 'Gunnarsson', 'Sigurðsson'],
      'Icelandic surnames come from the father',
    );
    const is = Array.from({ length: 300 }, () => W.rollName('ISL', null, 2000).ln);
    ok(
      is.every((x) => /(son|sson)$/.test(x)),
      'every Icelandic surname is a patronymic',
    );
    ok(new Set(is).size > 40, 'the surnames vary with the fathers');
    const ks = Array.from({ length: 600 }, () => W.rollName('KSA', null, 2000));
    ok(
      ks.some((x) => x.fn.includes(' ')) && ks.some((x) => !x.fn.includes(' ')),
      'some Saudi players carry the father name',
    );
  }
  {
    // surnames come up as often as they do in life where the game has the shares
    for (const [c, w] of Object.entries(D.SURNAME_WEIGHTS))
      ok(
        Object.values(w).reduce((x, y) => x + y, 0) < 100,
        c + ': the shares of the commonest surnames add up to less than all of them',
      );
    const n = { ESP: 0, tail: 0 };
    for (let i = 0; i < 4000; i++) {
      const s = W.pickSurname('ESP');
      if (s === 'García') n.ESP++;
      else if (!(s in D.SURNAME_WEIGHTS.ESP)) n.tail++;
    }
    ok(n.ESP > (n.tail / (D.NATIONS.ESP.ln.length - 20)) * 3, 'García is far commoner than a name in the tail');
  }
  {
    // phase 4: a second passport changes how registration sees a player
    const R = FM.Reg,
      club = { nat: 'ESP' };
    ok(R.isForeign({ id: 'x1', nat: 'ARG' }, club, null), 'an Argentine is foreign in Spain');
    ok(!R.isForeign({ id: 'x2', nat: 'ARG', cit: ['ARG', 'ESP'] }, club, null), 'with a Spanish passport he is local');
    ok(!R.isEU({ id: 'x3', nat: 'ARG' }), 'an Argentine is not an EU player');
    ok(R.isEU({ id: 'x4', nat: 'ARG', cit: ['ARG', 'ITA'] }), 'with an Italian passport he is an EU player');
    ok(
      R.isForeign({ id: 'x5', nat: 'ARG', cit: ['ARG', 'ITA'] }, club, null),
      'an EU passport does not make him Spanish',
    );
  }
  {
    const rate = (nat, her) => {
      let e = 0,
        h = 0;
      for (let i = 0; i < 3000; i++) {
        const p = { id: 'r' + i, nat };
        W.rollOrigin(p, nat, her, null);
        if (p.nat2) e++;
        if (p.cit) h++;
      }
      return h / e;
    };
    ok(
      rate('AUS', 'southasian') < rate('ENG', 'caribbean') * 0.5,
      'an Australian of Indian family rarely holds both passports: India bans another',
    );
  }
  ok(
    WD_validatePlayer({ id: 'x', fn: 'A', ln: 'B', nat: 'ENG', pos: 'ST', born: 2000, birth: 'XXX' }).length > 0,
    'an unknown birth country is refused',
  );
  ok(
    WD_validatePlayer({ id: 'x', fn: 'A', ln: 'B', nat: 'ENG', pos: 'ST', born: 2000, origins: [['ENG', 1.5]] })
      .length > 0,
    'an origin share above 1 is refused',
  );
}

console.log(
  fails.length ? `FAIL (${fails.length} of ${n})\n - ${fails.join('\n - ')}` : `Unit tests: ${n} checks passed.`,
);
// (the exit code is set, not forced: ending the process with a socket still closing crashes Node on Windows)
process.exitCode = fails.length ? 1 : 0;
