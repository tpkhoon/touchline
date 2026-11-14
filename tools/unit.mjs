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

// ---- the editor: tournament frequency, a club's squad as a CSV, youth and homegrown rules ----
{
  const I = FM.Intl,
    WD = FM.WorldDef,
    CS = FM.CsvWorld,
    NL = String.fromCharCode(10);
  const lrules = (squad) => ({ id: 'X', name: 'X', nat: 'ENG', tier: 1, rules: { squad } });
  // (the game's own cycle is unchanged: continental 2024, Trophy 2025, World Championship 2026, a World Club Championship 2027)
  eq(
    [2024, 2025, 2026, 2027].map((y) => I.tournamentFor(y)),
    ['continental', 'confed', 'world', null],
    'the default tournament cycle',
  );
  ok(FM.Cups.cwcYear(2027) && !FM.Cups.cwcYear(2026), 'the World Club Championship year follows the cycle');
  I.EVERY.world = 2;
  ok(I.tournamentFor(2024) === 'world' && I.tournamentFor(2026) === 'world', 'a World Championship every two years');
  I.EVERY.world = 4;
  eq(WD.validateIntl({ every: { world: 2, cwc: 8 } }), [], 'a World Championship every two years is allowed');
  ok(WD.validateIntl({ every: { world: 0 } }).length === 1, 'a frequency of 0 years is refused');
  ok(WD.validateIntl({ every: { nonsense: 2 } }).length === 1, 'an unknown tournament is refused');
  const okRules = { youthMin: 3, youthScope: 'pitch', youthAge: 21, hgMin: 8, hgScope: 'registered' };
  ok(
    WD.validateLeagueRules(lrules(okRules), { clubs: [], leagues: [] }).length === 0,
    'youth and homegrown rules are accepted',
  );
  ok(
    WD.validateLeagueRules(lrules({ youthMin: 21, youthAge: 20, hgScope: 'bench' }), { clubs: [], leagues: [] })
      .length === 3,
    'a youth minimum of 21, a youth age of 20 and a scope of the bench are refused',
  );
  const reqs = FM.Reg.requirements({ youthMin: 3, youthScope: 'xi', youthAge: 19, hgMin: 5 }, { nat: 'ENG' });
  eq(
    reqs.map((q) => [q.kind, q.n, q.scope]),
    [
      ['youth', 3, 'xi'],
      ['hg', 5, 'squad'],
    ],
    'each requirement has a scope (the matchday squad unless set)',
  );
  ok(
    FM.Reg.SCOPES.length === 4 && reqs[0].label.includes('19'),
    'the scopes are the XI, the pitch, the XI and subs and the registered players',
  );
  const def = WD.blank('Unit'),
    lg = FM.D.LEAGUES[0];
  def.clubs.push({
    id: 'c_UT',
    name: 'Unit FC',
    short: 'UTF',
    nick: '',
    city: 'Unit',
    nat: lg.nat,
    colors: ['#112233', '#ffffff'],
    identity: 'historic',
    rep: 60,
    league: lg.id,
    parent: null,
    founded: 1900,
    stadium: { name: 'Park', cap: 9000 },
  });
  const E = WD.editor(def, null);
  for (const [fn, pos, ca] of [
    ['Ann', 'ST', 70],
    ['Ben', 'CB', 65],
    ['Cal', 'GK', 60],
  ])
    E.addPlayer({
      fn,
      ln: 'Test',
      nat: lg.nat,
      pos,
      born: 2000,
      foot: 'Right',
      attrs: WD.suggestAttrs(pos, ca),
      pa: ca + 5,
      club: 'c_UT',
      contract: 2029,
    });
  const head = CS.SQUAD_COLUMNS.join(','),
    ids = def.players.map((p) => p.id);
  eq(CS.squadExport(def, 'c_UT').split(NL)[0].trim(), head, 'the squad CSV has its header');
  const file = [
    head,
    `${ids[0]},,,,,,,80,,2031,12000,9,`,
    `${ids[1]},,,,,,,,,,,,x`,
    `,Dan,Test,${lg.nat},2005,CM,Left,55,70,2030,,,`,
    `,Bad,Row,XXX,1700,ZZ,Up,5,,,,,`,
  ].join(NL);
  const r = CS.squadApply(def, 'c_UT', file);
  eq([r.added, r.updated, r.removed], [1, 1, 1], 'the squad CSV adds, changes and takes out a player');
  ok(
    r.errors.length >= 4 && r.errors.every((e) => e.startsWith('row 5')),
    'a bad row is reported by its row and left out',
  );
  // separate groups (rules.pools): two to nine, made of regions (the clubs that lie nearest each other), named from the north to the
  // south; a club that comes in joins the nearest of the smallest groups
  {
    // (three places of four clubs each: one in the north, one in the middle, one in the south)
    const spots = [
      [60, 10],
      [50, 12],
      [40, 8],
    ];
    const ids = [];
    spots.forEach(([la, lo], s) => {
      for (let i = 0; i < 4; i++) {
        const code = 'ZP' + s + i;
        FM.D.GEO[code] = [la + i * 0.1, lo + i * 0.1];
        ids.push('c_' + code);
      }
    });
    const comp = { rules: { pools: ['A', 'B', 'C'] }, clubs: ids.slice().reverse() };
    const pools = FM.W.poolsOf(comp);
    eq(
      pools.map((p) => p.length),
      [4, 4, 4],
      'twelve clubs in three groups of four',
    );
    eq(
      pools.map((p) => [...new Set(p.map((id) => id.slice(4, 5)))]),
      [['0'], ['1'], ['2']],
      'each group is one region, the first in the north',
    );
    const south = pools[2][0],
      north = pools[0][0];
    comp.clubs = comp.clubs.filter((id) => id !== south && id !== north);
    FM.W.poolsOf(comp);
    comp.clubs.push(south, north);
    const again = FM.W.poolsOf(comp);
    ok(
      again[2].includes(south) && again[0].includes(north) && again.every((p) => p.length === 4),
      'a club that comes in joins the nearest of the smallest groups',
    );
    for (const id of ids) delete FM.D.GEO[id.slice(2)];
    const bad = (pools) =>
      WD.validateLeagueRules(
        { id: 'X', name: 'X', nat: 'ENG', tier: 3, rules: { pools } },
        { clubs: [], leagues: [] },
      ).filter((e) => /groups/.test(e)).length;
    eq(
      [bad(['A', 'B', 'C']), bad(['A', 'B', 'C', 'D', 'E']), bad(['A']), bad(['A', 'A']), bad(['A', ''])],
      [0, 0, 1, 1, 1],
      'two to nine groups, each with a name of its own',
    );
  }
  // the leagues that take clubs of other nations (the cross-border clubs) keep them through a CSV round trip
  {
    const d = WD.fromStatic({ name: 'csv nats' });
    const cross = d.leagues.filter((x) => x.nats && x.nats.length).map((x) => [x.id, x.nats.slice()]);
    ok(cross.length >= 9, 'the world has the leagues with other nations to test (' + cross.length + ')');
    const ex = CS.export(d);
    const bare = WD.fromStatic({ name: 'csv nats 2' });
    for (const x of bare.leagues) delete x.nats;
    const back = CS.apply(bare, [{ name: 'leagues.csv', text: ex.leagues }]);
    eq(back.errors, [], 'the leagues CSV with a nats column is read back whole');
    eq(
      cross.map(([id]) => [id, (bare.leagues.find((x) => x.id === id).nats || []).slice()]),
      cross,
      'a CSV round trip keeps the nations of the leagues with cross-border clubs',
    );
    // an older file without the column leaves the league as it is
    const old = ex.leagues.replace(/,nats(\r?\n)/, ',unused$1');
    ok(old !== ex.leagues, 'the leagues CSV has a nats column to take out');
    const d2 = WD.fromStatic({ name: 'csv nats 3' });
    CS.apply(d2, [{ name: 'leagues.csv', text: old }]);
    eq(
      cross.map(([id]) => (d2.leagues.find((x) => x.id === id).nats || []).slice()),
      cross.map(([, n]) => n),
      'an older leagues CSV without the nats column keeps the nations',
    );
  }
  eq(
    [E.player(ids[0]).wage, E.player(ids[0]).no, E.player(ids[0]).contract],
    [12000, 9, 2031],
    'a changed row sets its cells',
  );
  ok(
    Math.round(FM.W.calcCA({ attrs: E.player(ids[0]).attrs }, 'ST')) === 80,
    'a changed ability makes the attributes again',
  );
  const eve = [head, `,Eve,Test,${lg.nat},2001,W,Right,60,,2030,,,`].join(NL);
  ok(
    CS.squadApply(def, 'c_UT', eve, { replace: true }).removed === 3,
    'replacing the squad takes out everyone the file leaves out',
  );
  ok(
    CS.squadRows(def, 'c_UT')
      .map((x) => x.first_name)
      .join() === 'Eve',
    'and leaves the file as the squad',
  );
}

// ---- scouting regions: the continents and the named parts of the world ----
{
  const Sc = FM.Scouting;
  ok(
    Sc.partKeys().length >= 30 && !Sc.partKeys().includes('British Isles') && !Sc.partKeys().includes('Oceania'),
    'the parts a scout can be sent to leave out the ones a continent already is',
  );
  ok(
    ['EST', 'LVA', 'LTU'].every((n) => Sc.nationsIn('Baltics').includes(n)) && Sc.nationsIn('Baltics').length === 3,
    'the Baltics are Estonia, Latvia and Lithuania',
  );
  ok(Sc.nationsIn('EUR').includes('DEN') && !Sc.nationsIn('EUR').includes('BRA'), 'a continent is its nations');
  const legacy = { regions: { EUR: 0.9, ASIA: 0.2, AFR: 0.2, SAM: 0.2, NAM: 0.2, OFC: 0.2, ENG: 0.3 } };
  ok(
    Math.abs(Sc.regionKnow(legacy, 'Nordics') - 0.9) < 1e-9 &&
      Math.abs(Sc.regionKnow(legacy, 'Southeast Asia') - 0.2) < 1e-9,
    'a scout made before the parts knows each part as well as its continent',
  );
  const dane = W.scoutProfile('DEN', 14);
  ok(
    dane.regions.Nordics >= 0.8 && dane.regions.Scandinavia >= 0.8,
    'a Danish scout knows the Nordics and Scandinavia best',
  );
  ok(
    Sc.partKeys().every((k) => dane.regions[k] >= 0.1 && dane.regions[k] <= 0.97) &&
      Object.keys(D.REGIONS).every((k) => dane.regions[k] != null),
    'and has a knowledge of every part and continent',
  );
  ok(
    Sc.regionName('SAM') === 'South America' && Sc.regionName('Balkans') === 'Balkans',
    'a region is named by its continent or itself',
  );
}

// ---- staff attributes and player reputation ----
{
  const roles = Object.keys(D.STAFF_ROLES);
  ok(
    roles.every((r) => (D.STAFF_ATTRS[r] || []).length >= 2) && D.STAFF_ATTRS.Manager.length === 8,
    'every staff role has attributes, a manager eight',
  );
  const a1 = W.rollStaffAttrs('First-Team Coach', 13, 's99'),
    a2 = W.rollStaffAttrs('First-Team Coach', 13, 's99');
  eq(a1, a2, 'the same person always has the same attributes');
  const vals = Object.values(a1);
  ok(
    vals.every((v) => v >= 1 && v <= 20) && Math.abs(vals.reduce((t, v) => t + v, 0) / vals.length - 13) < 0.7,
    'attributes are 1 to 20 around his ability',
  );
  ok(
    Object.keys(a1).join() === D.STAFF_ATTRS['First-Team Coach'].map((x) => x[0]).join(),
    'and are the ones his role is judged on',
  );
  // (with no attributes a role's effects are what its ability always gave)
  const old = FM.Staff.IMPACT.coach(12);
  ok(
    Math.abs(old.dev - 0.24) < 1e-9 && Math.abs(old.learn - 1.1) < 1e-9,
    'a coach with only an ability gives the same effects as before',
  );
  const sharp = FM.Staff.IMPACT.coach(10, { attrs: { youth: 18, goalkeeping: 4 } });
  ok(sharp.young > 1.1 && sharp.gk < 0.9, 'a coach good with the young and poor with keepers shows it');
  ok(
    FM.Staff.IMPACT.physio(10, { attrs: { rehab: 18 } }).layoff < 0.8,
    'a physio good at rehabilitation shortens layoffs',
  );
  // (the editor: attributes of a member of staff and a player's reputation in a definition)
  eq(
    FM.WorldDef.validateStaffAttrs('Head Physio', { rehab: 20, sportsScience: 3 }, 's'),
    [],
    'staff attributes of his role are accepted',
  );
  ok(
    FM.WorldDef.validateStaffAttrs('Head Physio', { goalkeeping: 5 }, 's').length === 1,
    'an attribute his role does not have is refused',
  );
  ok(FM.WorldDef.validateStaffAttrs('Manager', { tactical: 25 }, 's').length === 1, 'an attribute above 20 is refused');
  const part = { role: 'Manager', ability: 12, id: 's77', attrs: { tactical: 19 } };
  const full = W.staffAttrs(part);
  ok(
    full.tactical === 19 && Object.keys(full).length === 8 && full.youth >= 1,
    "a partly set list is completed with the game's own",
  );
  const pdef = {
    id: 'dp_x',
    fn: 'A',
    ln: 'B',
    nat: 'ENG',
    pos: 'ST',
    born: 2000,
    foot: 'Right',
    attrs: Object.fromEntries(D.ATTRS.map((k) => [k, 10])),
    pa: 70,
    club: null,
    contract: 2029,
  };
  eq(
    FM.WorldDef.validatePlayer({ ...pdef, rep: 80 }, { clubs: new Set(), year: 2026 }).errors,
    [],
    'a player with a reputation is accepted',
  );
  ok(
    FM.WorldDef.validatePlayer({ ...pdef, rep: 120 }, { clubs: new Set(), year: 2026 }).errors.length === 1,
    'a reputation above 99 is refused',
  );
  eq(
    [W.repLabel(90), W.repLabel(66), W.repLabel(51), W.repLabel(36), W.repLabel(21), W.repLabel(3)],
    ['World star', 'International name', 'National name', 'Known in the league', 'Local name', 'Unknown'],
    'reputation bands',
  );
}

// ---- parts of the world: every nation is in at least one (D.SUBREGIONS, D.subregionsOf) ----
{
  const listed = new Set(Object.values(D.SUBREGIONS).flatMap((v) => v.split(' ')));
  eq(
    Object.keys(D.NATIONS).filter((c) => !listed.has(c)),
    [],
    'every nation is in at least one named part of the world',
  );
  eq(
    [...listed].filter((c) => !D.NATIONS[c]),
    [],
    'every code in a part of the world is a nation',
  );
  eq(D.subregionsOf('DEN'), ['Nordics', 'Scandinavia'], 'Denmark is in the Nordics and in Scandinavia');
  eq(D.subregionsOf('VIE'), ['Southeast Asia'], 'Vietnam is in Southeast Asia');
  ok(D.subregionsOf('XXX').length === 0, 'an unknown nation is in none');
  // (the editor changes a nation's regions and gives a new nation its own: setSubregions, and what it replaced puts it back)
  const was = D.explicitSubregions('DEN');
  D.setSubregions('DEN', ['Nordics', 'Baltic Sea']);
  eq(D.subregionsOf('DEN'), ['Nordics', 'Baltic Sea'], 'a nation can be given other regions, a new one among them');
  ok(
    !D.SUBREGIONS.Scandinavia.split(' ').includes('DEN') && D.SUBREGIONS['Baltic Sea'] === 'DEN',
    'and the regions list it',
  );
  D.setSubregions('DEN', was);
  eq(D.subregionsOf('DEN'), ['Nordics', 'Scandinavia'], 'giving it back what it had restores it');
  ok(D.SUBREGIONS['Baltic Sea'] === undefined, 'a region left with no nation is gone');
  eq(FM.WorldDef.validateParts(['Nordics', 'Baltic Sea'], 'n'), [], 'regions of a nation are accepted');
  ok(FM.WorldDef.validateParts(['X'], 'n').length === 1, 'a region name of one letter is refused');
  ok(FM.WorldDef.validateParts(new Array(9).fill('Region'), 'n').length === 1, 'more than eight regions are refused');
}

// ---- managers and staff: where they come from (W.foreignNation, W.managerNation) ----
{
  const pickMany = (host, n = 3000) => {
    const m = {};
    for (let i = 0; i < n; i++) {
      const x = W.foreignNation(host);
      m[x] = (m[x] || 0) + 1;
    }
    return m;
  };
  const tog = pickMany('TOG'),
    ger = pickMany('GER');
  ok(tog.FRA > tog.ENG && tog.FRA > 300, 'a Frenchman is the likeliest foreign manager for Togo');
  ok((ger.FIJ || 0) <= 3, 'a Fijian almost never manages in Germany');
  ok(!pickMany('GER').GER, 'a foreign pick is never the host nation');
  ok(W.mgrTie('TOG', 'FRA') > W.mgrTie('TOG', 'FIJ'), 'France is closer to Togo than Fiji is');
  ok(W.mgrTie('BUL', 'BRA') >= 1.6 && W.mgrExport('BRA') >= 6, 'a Brazilian can manage anywhere (the big exporters)');
  let foreign = 0;
  for (let i = 0; i < 4000; i++) if (W.managerNation('BUL', 60) !== 'BUL') foreign++;
  ok(
    foreign > 4000 * 0.08 && foreign < 4000 * 0.22,
    `about one club in seven have a foreign manager (${foreign} of 4000)`,
  );
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
    // comparing two worlds
    const WD = FM.WorldDef,
      A = {
        meta: { name: 'One' },
        rules: { win: 3, subs: 5 },
        leagues: [{ id: 'L1', name: 'Top', tier: 1 }],
        clubs: [
          { id: 'a', name: 'Alpha', league: 'L1', rep: 50 },
          { id: 'b', name: 'Beta', league: 'L1', rep: 50 },
        ],
        players: [{ fn: 'Jo', ln: 'Bo', born: 2000, club: 'a' }],
        rivals: [['a', 'b', 'Derby']],
      },
      B = JSON.parse(JSON.stringify(A));
    eq(WD.diff(A, B).total, 0, 'a world against itself has no differences');
    B.meta.name = 'Two';
    B.rules.win = 2;
    B.clubs[0].rep = 60;
    B.clubs[0].name = 'Alpha Town';
    B.clubs.push({ id: 'c', name: 'Gamma', league: 'L1' });
    B.leagues[0].name = 'Premier';
    B.players.push({ fn: 'Al', ln: 'Cy', born: 1999, club: 'c' });
    B.rivals = [];
    const t = WD.diff(A, B)
      .sections.map((s) => s.title + ': ' + s.lines.join(' / '))
      .join(' || ');
    ok(/Name: One to Two/.test(t) && /Rule win: 3 to 2/.test(t), 'the name and the rules show');
    ok(
      /1 club added: Gamma/.test(t) && /1 club changed: Alpha Town \((name|rep)/.test(t),
      'clubs added and changed show with their fields',
    );
    ok(/1 league changed: Premier \(name\)/.test(t), 'a league change names the field');
    ok(/1 player added: Al Cy \(1999\)/.test(t), 'a player added shows by name and birth year');
    ok(/Derbies: 1 to 0/.test(t), 'a list that differs says how many each holds');
  }
  {
    // what depends on a league, a cup, a club
    const WD = FM.WorldDef,
      def = {
        leagues: [
          { id: 'X1', name: 'Top', rules: { relegate: { to: 'X2' }, qualify: { to: 'CUPX', n: 2 } } },
          { id: 'X2', name: 'Second', rules: { schedule: [{ round: 1, h: 'a', a: 'b' }] } },
        ],
        clubs: [
          { id: 'a', league: 'X2' },
          { id: 'b', league: 'X2' },
          { id: 'c', league: 'X1' },
        ],
        players: [{ club: 'a' }, { club: 'a' }, { club: 'c' }],
        rivals: [['a', 'b', 'Derby']],
        regionals: [{ id: 'r', clubs: ['a'] }],
        history: { seasons: [{ comps: { X2: {} } }] },
        failure: { proof: ['a'] },
      };
    const l2 = WD.dependents(def, 'league', 'X2').join(' | ');
    ok(
      /2 clubs/.test(l2) &&
        /2 players/.test(l2) &&
        /Top relegates clubs into it/.test(l2) &&
        /custom schedule/.test(l2) &&
        /1 past season/.test(l2) &&
        /1 derby/.test(l2) &&
        /1 regional cup/.test(l2),
      'a league lists its clubs, players, links, schedule, history and derbies',
    );
    ok(
      WD.dependents(def, 'cup', 'CUPX').join(' ').includes('Top sends 2 clubs to it'),
      'a cup lists the leagues that send clubs to it',
    );
    ok(
      WD.dependents(def, 'club', 'a').join(' | ').includes('unable to fail'),
      'a club listed as unable to fail says so',
    );
    eq(WD.dependents(def, 'club', 'zzz'), [], 'a club nothing refers to has no dependents');
    eq(WD.dependents(def, 'league', 'nope'), [], 'a league nothing refers to has no dependents');
  }
  {
    // the way a competition is said, and what it was called before
    const lg = (name, extra = {}) => ({ type: 'league', name, ...extra });
    eq(W.compShort(lg('English Premier Division')), 'Premier Division', 'the league without its place');
    eq(W.compShort(lg('Spanish Liga de Honor')), 'Liga de Honor', 'a three-word name keeps its words');
    eq(W.compShort(lg('Fruška Gora Energo Prva Liga')), 'Prva Liga', 'a long name is cut to the last two words');
    eq(W.compShort(lg('Portucale Superliga')), 'Superliga', 'a one-word rest is kept when it says something');
    eq(W.compShort(lg('Welsh League')), 'Welsh League', 'a name that would become generic stays');
    eq(W.compShort({ type: 'cup', name: 'Welsh Cup' }), 'Welsh Cup', 'cups keep their name');
    eq(W.compShort(lg('Whatever', { spoken: 'The Big One' })), 'The Big One', 'a competition can carry its own');
    eq(
      W.formerName(lg('English Premier Division')),
      'English First Division',
      'a Premier Division was a First Division',
    );
    ok(
      ['Neckar Meisterliga', 'Thai Super League', 'Welsh Uwch Division'].every((n) => W.formerName(lg(n)) !== n),
      'a former name is never the name',
    );
  }
  {
    // known by one name
    const mk = (nat, i, fn = 'Francisco') => ({ id: 'kn' + i, nat, fn, ln: 'García' });
    const sp = Array.from({ length: 2000 }, (_, i) => mk('ESP', i)),
      known = sp.filter((p) => W.knownAs(p));
    ok(known.length > 150 && known.length < 330, 'about one Spaniard in eight goes by one name');
    ok(
      known.every((p) => W.knownAs(p) === 'Paco' && W.short(p) === 'Paco' && W.shirt(p) === 'Paco'),
      'Francisco is Paco on the shirt',
    );
    ok(
      known.every((p) => W.name(p) === 'Francisco García'),
      'the full name stays',
    );
    ok(
      !W.knownAs(mk('BRA', 1)) && !W.knownAs(mk('ENG', 1)) && !W.knownAs({ ...mk('ESP', 1), heritage: 'x' }),
      'only the nations with two surnames, and not heritage players',
    );
    ok(W.knownAs(mk('ESP', 7)) === W.knownAs(mk('ESP', 7)), 'the same every time');
  }
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

// the past seasons of a player (W.pastSeason): rates of the match engine, injuries, minutes, and totals that agree
{
  const W = FM.W;
  const club = { id: 'c_x', rep: 70 };
  const mk = (pos) => ({ pos, hid: { inj: 11 }, attrs: { finishing: 12, vision: 12 } });
  const run = (pos, n = 600, rel = 0) => {
    const p = mk(pos),
      form = { v: 0 };
    let g = 0,
      m = 0,
      apps = 0,
      yc = 0;
    const per = [];
    for (let i = 0; i < n; i++) {
      const r = W.pastSeason(p, { y: 2020, a: 26, k: 2, club, then: 60, rel, share: 0.86, games: 46, cap: 50, form });
      g += r.g;
      m += (r.mins || 0) / 90;
      apps += r.apps;
      yc += r.yc || 0;
      per.push(r.apps);
    }
    return { g90: g / m, apps: apps / n, per, mpa: (m * 90) / apps, yc90: yc / m };
  };
  const st = run('ST'),
    cb = run('CB');
  ok(st.g90 > 0.34 && st.g90 < 0.5, `a regular striker's past goals per 90 are ${st.g90.toFixed(2)}, not about 0.42`);
  ok(cb.g90 > 0.05 && cb.g90 < 0.11, `a centre-back's past goals per 90 are ${cb.g90.toFixed(2)}, not about 0.08`);
  ok(cb.yc90 > 0.18 && cb.yc90 < 0.34, 'a centre-back collects about a yellow card every four games');
  ok(
    st.apps > 30 && st.apps < 44,
    `a regular starter plays ${st.apps.toFixed(0)} games a season in the past, not about 38`,
  );
  ok(
    Math.min(...st.per) < 22 && Math.max(...st.per) <= 50,
    'a season now and then lost to injury, never past the club cap',
  );
  ok(st.mpa > 65 && st.mpa < 82, 'minutes per appearance of a regular are about 70 to 80');
  ok(run('ST', 400, 8).g90 > st.g90 * 1.2, 'a striker well above his club level scores more');
  const gk = run('GK', 200);
  ok(gk.mpa > 86, 'a keeper plays the whole match');
}

// ---- lower divisions, cross-border clubs and youth tournaments (real-formats sheets 07, 08, 11, 12 to 14) ----
{
  const L = Object.fromEntries(D.LEAGUES.map((l) => [l.id, l]));
  const codes = new Set();
  let dup = 0;
  for (const l of D.LEAGUES)
    for (const r of D[l.clubs] || []) {
      if (codes.has(r[1])) dup++;
      codes.add(r[1]);
    }
  eq(dup, 0, 'no club code is used twice');
  const bad = [];
  for (const l of D.LEAGUES) {
    ok((D[l.clubs] || []).length >= 4, `${l.id} has clubs`);
    const pr = l.rules.promote,
      rel = l.rules.relegate;
    if (pr) {
      const up = L[pr.to],
        down = up && up.rules.relegate;
      // the division above sends down as many as come up (one more when a play-off decides a further place)
      // (a division of separate groups counts its places in each group)
      const groups = (x) => (x.rules.pools ? x.rules.pools.length : 1);
      // (a promotion play-off over the groups' places sends up a club a group, or one in all; promote.best only the best winners)
      const po = l.rules.playoffs && l.rules.playoffs.promo,
        want =
          (pr.best != null ? pr.best : pr.auto * groups(l)) +
          (pr.playoff ? groups(l) : 0) +
          (po ? (po === 'groups' ? groups(l) : 1) : 0);
      if (!up || !down || down.to !== l.id || down.n * groups(up) !== want || !!down.playoff !== !!pr.tie)
        bad.push(l.id);
      else if (up.nat !== l.nat) bad.push(l.id + ' (nation)');
    }
    if (rel && !(L[rel.to] && L[rel.to].rules.promote && L[rel.to].rules.promote.to === l.id))
      bad.push(l.id + ' (down)');
  }
  eq(bad, [], 'every promotion has the matching relegation, in the same nation');
  for (const [code, nat] of Object.entries(D.CLUB_NAT || {})) {
    ok(D.NATIONS[nat] && codes.has(code), `cross-border club ${code} is a club and its nation ${nat} is a nation`);
    const home = D.LEAGUES.find((l) => (D[l.clubs] || []).some((r) => r[1] === code));
    ok(home && (home.nat === nat || (home.nats || []).includes(nat)), `the league of ${code} is open to ${nat}`);
  }
  const YC = FM.YouthComps;
  const field = (n) => Array.from({ length: n }, (_, i) => ({ id: 't' + i, name: 'T' + i, nat: 'XXX', r: 60 - i }));
  for (const [n, cfg] of [
    [48, { fmt: 'groups', groups: [4, 2, 8] }],
    [16, { fmt: 'groups', groups: [4, 2, 0] }],
    [10, { fmt: 'rr' }],
    [37, { fmt: 'ko' }],
    [10, { fmt: 'groups', groups: [5, 1, 0] }],
  ]) {
    const r = YC.play(field(n), cfg);
    ok(
      r.winner && r.runnerUp && r.winner.id !== r.runnerUp.id,
      `a youth competition of ${n} (${cfg.fmt}) has a winner and a runner-up`,
    );
  }
  let top = 0;
  for (let i = 0; i < 200; i++) if (YC.play(field(16), { fmt: 'groups', groups: [4, 2, 0] }).winner.id === 't0') top++;
  ok(top > 200 / 16, 'the strongest side wins a youth tournament more often than a one in sixteen chance');
  ok(YC.NATIONAL.length === 26 && YC.CLUBS.length === 17, 'the youth competitions are all listed');
  // qualifying: more teams than places, the places filled, no team twice
  {
    const q = YC.qualify(field(54), 16);
    eq(q.teams.length, 16, 'qualifying fills the places');
    eq(new Set(q.teams.map((e) => e.id)).size, 16, 'a team qualifies once');
    ok(
      q.teams.some((e) => e.id === 't0'),
      'the strongest team is through',
    );
    eq(YC.qualify(field(10), 16).teams.length, 10, 'a field smaller than the places needs no qualifying');
  }
  ok(YC.SCHOOLS.length === 2, 'the Japanese and Korean school tournaments are listed');
  for (const [code, host] of Object.entries(D.CUP_HOSTS)) {
    ok(
      codes.has(code) && D.CLUB_NAT[code] && D.NATIONS[host],
      `cup-host club ${code} is a cross-border club in a nation`,
    );
    ok(D.CLUB_NAT[code] !== host, `${code} has a home nation other than the one whose cup it also enters`);
  }
  ok(
    L.OC1 && L.OC1.rules.playoffs && L.OC1.clubs && (D[L.OC1.clubs] || []).length === 8,
    'the Oceania league has eight clubs and play-off groups',
  );
}

// ---- saves: a big world's save is stored in pieces (browsers refuse one IndexedDB value over about 127 MiB) ----
{
  const Sv = FM.Save;
  eq(Sv.splitValue('short'), null, 'a short save is stored whole');
  eq(Sv.splitValue(null), null, 'nothing to split is nothing');
  const long = 'ā'.repeat(Sv.CHUNK * 2 + 5); // (accented text counts two bytes a character in a stored value)
  const parts = Sv.splitValue(long);
  ok(parts && parts.length === 3, 'a save of two chunks and a little more is three pieces');
  ok(parts && parts.join('') === long, 'the pieces put back together are the save');
  ok(parts && parts.every((p) => p.length <= Sv.CHUNK && p.length * 2 < 64e6), 'no piece is near the browser limit');
  // (a packed world is about 130 MB: it must come out in pieces, none over the limit)
  ok(Sv.CHUNK * 2 * 4 < 133169152, 'a handful of chunks in one transaction stays far under the value limit');
}

// ---- derby names: one article ("win the The Old Firm" was in two playtest reports) ----
eq(U.theName('Dorrez Derby'), 'the Dorrez Derby', 'a derby name without an article gets one');
eq(U.theName('The Old Firm'), 'the Old Firm', 'a derby name with its article is not given a second');
eq(U.theName('the Salt Road Derby'), 'the Salt Road Derby', 'a lower-case article is kept once');

console.log(
  fails.length ? `FAIL (${fails.length} of ${n})\n - ${fails.join('\n - ')}` : `Unit tests: ${n} checks passed.`,
);
// (the exit code is set, not forced: ending the process with a socket still closing crashes Node on Windows)
process.exitCode = fails.length ? 1 : 0;
