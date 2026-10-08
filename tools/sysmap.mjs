// System map: how the game's systems feed one another, worked out from the code. A system that nothing else reads is
// either flavour or unfinished, and the design says every system should feed another. Three views:
//   1. Systems by tier (core simulation, the human layer, history, sandbox, interface, data): size, what each uses, what uses it.
//   2. The closed loops the design depends on (the talent economy, the results economy, the human loop, club identity), each
//      hop checked against the code that is supposed to make it.
//   3. State that is written and never read anywhere else: candidates to wire in or cut.
//   node tools/sysmap.mjs [--write docs/SYSTEMS.md] [--fields 40]      (npm run sysmap)
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './harness.mjs';

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .join(' ')
    .split('--')
    .filter(Boolean)
    .map((a) => a.trim().split(/\s+/)),
);
const JS = path.join(ROOT, 'js');
const files = fs
  .readdirSync(JS)
  .filter((f) => f.endsWith('.js') && !['changelog.js', 'sim-worker.js'].includes(f))
  .sort();
const src = Object.fromEntries(files.map((f) => [f, fs.readFileSync(path.join(JS, f), 'utf8')]));
const lines = (f) => src[f].split('\n').length;

// ---- Systems: a name, a tier and the files that make it ----
const TIERS = [
  [
    '1 · Core simulation',
    {
      'Match engine': ['engine.js', 'matchmotion.js'],
      'World and players': ['world.js', 'names.js', 'nations.js', 'names-more.js', 'names-more2.js', 'names-more3.js'],
      'Season and calendar': ['season.js', 'tiers.js', 'regional.js'],
      'Development and youth': ['careers.js', 'youth.js', 'training.js'],
      'Transfers and contracts': ['transfers.js', 'market.js', 'contracts.js', 'registration.js', 'draft.js'],
      Finances: ['finance.js'],
      Competitions: ['cups.js', 'intl.js'],
      Injuries: ['injuries.js'],
    },
  ],
  [
    '2 · Human layer',
    {
      Scouting: ['scouting.js'],
      'People and morale': ['people.js', 'matchday.js', 'mstyle.js'],
      'Board and fans': ['board.js'],
      'Stories and media': ['stories.js', 'media.js'],
      'Advice and analytics': ['advice.js', 'analytics.js'],
    },
  ],
  ['3 · Historical layer', { 'Records and archive': ['records.js'] }],
  ['4 · Sandbox', { 'Databases and editor': ['worlddef.js', 'dbimport.js', 'histimport.js', 'realstats.js'] }],
  [
    'Interface and platform',
    {
      Screens: files.filter((f) => /^ui-|^matchview|^devtools/.test(f)),
      Platform: ['save.js', 'simrun.js', 'native.js'],
    },
  ],
  [
    'Data',
    {
      'Static data': ['core.js', 'data.js', 'clubs.js', 'clubguide.js', 'realstats.js'].filter(
        (f) => f !== 'realstats.js',
      ),
    },
  ],
];
const systemOf = {};
for (const [tier, sys] of TIERS)
  for (const [name, fs_] of Object.entries(sys))
    for (const f of fs_) if (files.includes(f)) systemOf[f] = { name, tier };
for (const f of files) if (!systemOf[f]) systemOf[f] = { name: 'Other', tier: 'Other' };

// ---- Edges: which files use which other files' modules (FM.X) ----
const defines = {};
for (const f of files)
  for (const m of src[f].matchAll(/\bFM\.(\w+)\s*=\s*(?:\{|\(|function)|\(FM\.(\w+)\s*=\s*\{\}\)/g))
    defines[m[1] || m[2]] = defines[m[1] || m[2]] || f;
const edges = {}; // from-system -> to-system -> count
for (const f of files) {
  const alias = {};
  for (const m of src[f].matchAll(/\b(\w+)\s*=\s*FM\.(\w+)\b/g)) alias[m[1]] = m[2];
  const uses = {};
  for (const m of src[f].matchAll(/\bFM\.(\w+)\./g)) uses[m[1]] = (uses[m[1]] || 0) + 1;
  for (const [a, mod] of Object.entries(alias))
    uses[mod] = (uses[mod] || 0) + (src[f].match(new RegExp(`\\b${a}\\.`, 'g')) || []).length;
  for (const [mod, n] of Object.entries(uses)) {
    const to = defines[mod];
    if (!to || to === f) continue;
    const A = systemOf[f].name,
      B = systemOf[to].name;
    if (A === B) continue;
    edges[A] = edges[A] || {};
    edges[A][B] = (edges[A][B] || 0) + n;
  }
}
const names = [...new Set(Object.values(systemOf).map((s) => s.name))];
const usesOf = (A) => Object.entries(edges[A] || {}).sort((a, b) => b[1] - a[1]);
const usedBy = (B) =>
  Object.entries(edges)
    .filter(([, t]) => t[B])
    .map(([A, t]) => [A, t[B]])
    .sort((a, b) => b[1] - a[1]);

// ---- Loops: each hop must be visible in the code ----
const has = (f, re) => re.test(src[f] || '');
const LOOPS = [
  [
    'The talent economy',
    [
      ['The academy level decides the quality of the youth intake', 'careers.js', /academy/],
      ['The intake is a new player on the squad', 'careers.js', /genPlayer/],
      ['Minutes and form move a young player’s development and potential', 'careers.js', /season\.apps|rsum/],
      ['Ability and potential set his value', 'world.js', /W\.value = /],
      ['His value sets the transfer price', 'transfers.js', /\.value/],
      ['The fee moves both clubs’ money', 'transfers.js', /balance \+= cash|balance -= cash/],
      ['Money pays for the facilities', 'season.js', /facilities/],
      ['The facilities set the academy and training level', 'careers.js', /facilities/],
    ],
  ],
  [
    'The results economy',
    [
      ['Results move the fans’ mood', 'season.js', /fanMood/],
      ['Mood and standing set the crowd', 'finance.js', /fanMood/],
      ['The crowd, prize money and TV set revenue', 'finance.js', /revenue/],
      ['Revenue sets the budget and the wage ceiling', 'finance.js', /budget|wageRatio/],
      ['The budget limits what the club can buy', 'transfers.js', /\.budget/],
      ['Results set the board’s confidence', 'board.js', /boardConf/],
      ['The board’s confidence decides the manager’s job', 'season.js', /boardConf/],
    ],
  ],
  [
    'The human loop',
    [
      ['Results and playing time move morale', 'season.js', /morale/],
      ['Morale changes how well a player plays', 'engine.js', /morale/],
      ['Morale and promises decide who asks to leave or to renew', 'people.js', /morale/],
      ['Pressure before a match moves morale', 'matchday.js', /pressure/],
      ['Shouts and talks move the side in the match', 'engine.js', /shout\(/],
    ],
  ],
  [
    'Club identity',
    [
      ['The board’s demands follow the club’s identity', 'board.js', /\.identity/],
      ['The youth intake follows it', 'careers.js', /identity/],
      ['Selling prices follow it', 'transfers.js', /IDENTITY/],
      ['The budget starts from it', 'world.js', /idt\.budget/],
      ['Recruitment preferences follow it', 'transfers.js', /identityFit/],
      ['Players’ willingness to join follows it', 'market.js', /identityAppeal/],
      ['The board’s patience follows it', 'board.js', /B\.patience/],
      ['Revenue follows it', 'finance.js', /IDMIX/],
      ['Fans’ style expectations follow it', 'board.js', /styleFit/],
    ],
  ],
  [
    'What a club can become',
    [
      ['A club has a market, supporters, a youth catchment and an owner', 'world.js', /W\.clubAttr = /],
      ['They set a ceiling its reputation cannot pass', 'world.js', /W\.repCeiling/],
      [
        'Each season’s reputation moves toward what standing and history support, by a capped step',
        'season.js',
        /driftRep/,
      ],
      ['Success grows the supporters, and with them the ceiling', 'season.js', /growClub/],
      ['The market sets commercial revenue', 'finance.js', /clubAttr/],
      ['Takeovers need a reason in the club’s attributes', 'stories.js', /clubAttr/],
    ],
  ],
  [
    'The manager you turn out to be',
    [
      ['Who plays, the tactic, the eleven and the big deals shape a profile', 'mstyle.js', /St\.afterMatch/],
      ['The profile is learned from your matches', 'season.js', /Style\.afterMatch/],
      ['The board of a club of your kind gains or loses confidence in you', 'mstyle.js', /St\.seasonEnd/],
      ['Players are drawn to, or put off by, how you manage', 'market.js', /Style\.appealFor/],
      ['The job market looks at your standing in its country and at your kind', 'season.js', /Style\.effectiveRep/],
    ],
  ],
  [
    'The tactical loop',
    [
      ['The tactic changes what the engine does', 'engine.js', /T\.press|tactic\.press/],
      ['The engine counts what happened by chance type, possession and stamina', 'engine.js', /sd\.types/],
      ['The result is read back as causes', 'matchday.js', /Md\.why/],
      ['Opponent-specific patterns shown before the match', 'matchday.js', /Md\.opposition/],
    ],
  ],
];
const loopRows = LOOPS.map(([name, hops]) => ({
  name,
  hops: hops.map(([label, f, re]) => ({ label, f, ok: has(f, re) })),
}));

// ---- State written and never read ----
const WRITE = /\b(?:p|c|club|u|sd|st|me|S\.user|s\.user)\.([a-zA-Z_]\w+)\s*(?:\+|-|\*|\/)?=(?!=)/g;
const written = {};
for (const f of files) for (const m of src[f].matchAll(WRITE)) (written[m[1]] = written[m[1]] || new Set()).add(f);
const all = Object.values(src).join('\n');
const writeOnly = [];
for (const [field, fs_] of Object.entries(written)) {
  const total = (all.match(new RegExp(`\\.${field}\\b`, 'g')) || []).length;
  const asWrite = (all.match(new RegExp(`\\.${field}\\s*(?:\\+|-|\\*|/)?=(?!=)`, 'g')) || []).length;
  const keyed = (all.match(new RegExp(`\\b${field}\\s*:`, 'g')) || []).length; // object literals, defaults, saves
  if (total - asWrite <= 0 && keyed === 0) writeOnly.push([field, [...fs_].join(', '), asWrite]);
}
writeOnly.sort((a, b) => b[2] - a[2]);

// ---- Report ----
const out = [];
const P = (s = '') => out.push(s);
P('# Systems map');
P();
P(
  "Generated by `npm run sysmap` (tools/sysmap.mjs) from the code: how the game's systems feed one another. The design rule is that every system feeds another; a system nothing reads is flavour or unfinished.",
);
P();
for (const [tier, sys] of TIERS) {
  P(`## ${tier}`);
  P();
  P('| System | Files | Lines | Uses | Used by |');
  P('| --- | --- | ---: | --- | --- |');
  for (const name of Object.keys(sys)) {
    const fs_ = files.filter((f) => systemOf[f].name === name);
    if (!fs_.length) continue;
    const top = (l) =>
      l
        .slice(0, 4)
        .map(([n, c]) => `${n} (${c})`)
        .join(', ') || '—';
    P(
      `| ${name} | ${fs_.length} | ${fs_.reduce((n, f) => n + lines(f), 0)} | ${top(usesOf(name))} | ${top(usedBy(name))} |`,
    );
  }
  P();
}
P('## Systems nothing else reads');
P();
const orphan = names.filter(
  (n) =>
    !/Screens|Platform|Static data|Other|Databases and editor/.test(n) &&
    usedBy(n).filter(([A]) => !/Screens|Platform/.test(A)).length === 0,
);
P('(The sandbox tier, the databases and editor, is used from the interface by design, and is left out.)');
P();
P(
  orphan.length
    ? orphan
        .map((n) => `- **${n}**: used by no other system except the interface. Wire it into another system or cut it.`)
        .join('\n')
    : '- None: every system is used by another.',
);
P();
P('## Closed loops');
P();
for (const l of loopRows) {
  const ok = l.hops.filter((h) => h.ok).length;
  P(`### ${l.name} (${ok} of ${l.hops.length} hops in place)`);
  P();
  for (const h of l.hops) P(`- ${h.ok ? '✓' : '✗ **missing:**'} ${h.label} (\`js/${h.f}\`)`);
  P();
}
P(`## State written and never read (${writeOnly.length})`);
P();
P(
  'A heuristic: a field set somewhere and read nowhere, including in saves and object literals. Each one is either dead, or a record for the player to see that no system uses, or the start of a system that is not wired in yet.',
);
P();
P(
  writeOnly
    .slice(0, +(args.fields || 40))
    .map(([f, where, n]) => `- \`${f}\` (${n} write${n === 1 ? '' : 's'}; ${where})`)
    .join('\n') || '- None.',
);
P();
const text = out.join('\n');
if (args.write) {
  fs.writeFileSync(path.resolve(ROOT, args.write), text + '\n');
  console.log(`Wrote ${args.write}`);
}
console.log(text);
const missing = loopRows.reduce((n, l) => n + l.hops.filter((h) => !h.ok).length, 0);
console.log(
  `\n${loopRows.length} loops, ${missing} hop(s) missing; ${orphan.length} orphan system(s); ${writeOnly.length} write-only field(s).`,
);
