// Every job the developer dashboard can run, in one place: what it is (one line), how it is started, and what numbers can be
// set. The dashboard (tools/devserver.mjs), the bisect tool (tools/bisect.mjs) and the gates all read this list, so a check
// added here is on the Run tab, can be put in a gate, and can be bisected, with nothing else to change.
// params: name → { default, min, max }; they become numeric `--name value` arguments.
export const NODE = process.execPath;

// The groups the Run tab shows, in order
export const GROUPS = [
  ['tests', 'Tests', 'the game plays out and nothing breaks'],
  ['calibration', 'Calibration', 'the game against real football'],
  ['data', 'Data and rules', 'the names, clubs, competitions and the rules they follow'],
  ['browser', 'In a browser', 'the screens and the speed a player sees (needs Chrome or Edge)'],
  ['library', 'Saves and reports', 'old saves still open, kept problem reports stay fixed'],
  ['debug', 'Finding a fault', 'where a problem started, and what the tests do not reach'],
  ['code', 'Code and build', 'lint, formatting, docs and what ships'],
];

export const JOBS = {
  // ---------- Tests ----------
  test: {
    group: 'tests',
    label: 'Regression test',
    note: 'sim-test: seeded seasons, invariants, saves',
    cmd: [NODE, 'tools/sim-test.mjs'],
    params: { seasons: { default: 2, min: 1, max: 6 }, seed: { default: 7, min: 1, max: 9999 } },
  },
  unit: {
    group: 'tests',
    label: 'Unit tests',
    note: 'text helpers, name rules, signing rules, escaping, converter (seconds)',
    cmd: [NODE, 'tools/unit.mjs'],
    params: {},
  },
  suite: {
    group: 'tests',
    label: 'Wider suite',
    note: 'speed, tables, squads, finances, stability',
    cmd: [NODE, 'tools/suite.mjs'],
    params: { seasons: { default: 3, min: 1, max: 30 }, seed: { default: 11, min: 1, max: 9999 } },
  },
  long: {
    group: 'tests',
    label: 'Long run',
    note: '20 seasons without the speed limits',
    cmd: [NODE, 'tools/suite.mjs', '--skip-speed'],
    params: { seasons: { default: 20, min: 4, max: 40 }, seed: { default: 11, min: 1, max: 9999 } },
  },
  longrun: {
    group: 'tests',
    label: 'Thirty-year stability',
    note: 'does the pecking order stay believable over decades (longrun --check)',
    cmd: [NODE, 'tools/longrun.mjs', '--check'],
    params: { seasons: { default: 30, min: 5, max: 60 }, seed: { default: 5, min: 1, max: 9999 } },
  },
  tactics: {
    group: 'tests',
    label: 'Tactic response',
    note: 'does a press, a block or a style change what happens on the pitch',
    cmd: [NODE, 'tools/tactics.mjs'],
    params: { n: { default: 300, min: 50, max: 2000 }, seed: { default: 4, min: 1, max: 9999 } },
  },
  cups: {
    group: 'tests',
    label: 'Cups',
    note: 'continental and regional cups: who enters, groups, a winner',
    cmd: [NODE, 'tools/cups-check.mjs'],
    params: { seasons: { default: 2, min: 1, max: 6 }, seed: { default: 7, min: 1, max: 9999 } },
  },
  asia: {
    group: 'tests',
    label: 'Asia rules',
    note: 'foreign places, military service, Gulf money, the Japanese draft',
    cmd: [NODE, 'tools/asia.mjs'],
    params: { seasons: { default: 4, min: 1, max: 10 }, seed: { default: 6, min: 1, max: 9999 } },
  },
  editor: {
    group: 'tests',
    label: 'World editor data path',
    note: 'edit a definition, build the world from it, play a season',
    cmd: [NODE, 'tools/editor-check.mjs'],
    params: { seed: { default: 7, min: 1, max: 9999 } },
  },
  schedule: {
    group: 'tests',
    label: 'Competition rules and calendar',
    note: 'a competition, the calendar and hand-set fixtures edited and played',
    cmd: [NODE, 'tools/schedule-check.mjs'],
    params: { seed: { default: 7, min: 1, max: 9999 } },
  },
  competitions: {
    group: 'tests',
    label: 'Made competitions',
    note: 'play-offs, tournaments, a continental cup of one’s own, expansion drafts',
    cmd: [NODE, 'tools/competition-check.mjs'],
    params: { seed: { default: 7, min: 1, max: 9999 } },
  },
  regens: {
    group: 'tests',
    label: 'Regens',
    note: 'academy intakes aged year by year',
    cmd: [NODE, 'tools/regens.mjs'],
    params: {},
  },
  bench: {
    group: 'tests',
    label: 'Speed in Node',
    note: 'build a world and play 30 days with a time budget (the browser speed test is under In a browser)',
    cmd: [NODE, 'tools/bench.mjs'],
    params: { days: { default: 30, min: 5, max: 120 }, seed: { default: 7, min: 1, max: 9999 } },
  },

  // ---------- Calibration ----------
  calibrate: {
    group: 'calibration',
    label: 'Calibration',
    note: 'the game against real football',
    cmd: [NODE, 'tools/calibrate.mjs'],
    params: { seasons: { default: 3, min: 1, max: 12 }, seed: { default: 7, min: 1, max: 9999 } },
  },
  winchance: {
    group: 'calibration',
    label: 'Win chance',
    note: 'the chance shown before a match against results, instant and watched (a shown 60% should win about 60%)',
    cmd: [NODE, 'tools/winchance.mjs'],
    params: { matches: { default: 1200, min: 200, max: 6000 }, seed: { default: 7, min: 1, max: 9999 } },
  },
  wonderkids: {
    group: 'calibration',
    label: 'Wonderkids',
    note: 'how the best prospects turn out',
    cmd: [NODE, 'tools/wonderkids.mjs'],
    params: { seasons: { default: 10, min: 3, max: 20 }, seed: { default: 5, min: 1, max: 9999 } },
  },
  transfers: {
    group: 'calibration',
    label: 'Transfer realism',
    note: 'the market against real transfers',
    cmd: [NODE, 'tools/transfer-realism.mjs'],
    params: { seasons: { default: 3, min: 2, max: 8 }, seed: { default: 5, min: 1, max: 9999 } },
  },
  histcheck: {
    group: 'calibration',
    label: 'Generated past',
    note: 'thirty made-up seasons: promotions, titles, legends and record scorers hang together',
    cmd: [NODE, 'tools/histcheck.mjs'],
    params: { seed: { default: 7, min: 1, max: 9999 } },
  },

  // ---------- Data and rules ----------
  namecheck: {
    group: 'data',
    label: 'Name generator',
    note: 'surname shares, communities, accents, first names by generation',
    cmd: [NODE, 'tools/namecheck.mjs'],
    params: { seed: { default: 7, min: 1, max: 9999 } },
  },
  abbrevs: {
    group: 'data',
    label: 'Club abbreviations',
    note: 'three letters, never rude or doubled (abbrevs --check)',
    cmd: [NODE, 'tools/abbrevs.mjs', '--check'],
    params: {},
  },
  realstats: {
    group: 'data',
    label: 'Converter self-test',
    note: 'real-stats converter checks',
    cmd: [NODE, 'tools/realstats.mjs', '--test'],
    params: {},
  },
  worlddef: {
    group: 'data',
    label: 'World definition test',
    note: 'export, validate, edit, load, play',
    cmd: [NODE, 'tools/worlddef.mjs', '--test'],
    params: {},
  },
  import: {
    group: 'data',
    label: 'Importer test',
    note: 'tables, players, clubs into a world',
    cmd: [NODE, 'tools/import-history.mjs', '--test'],
    params: {},
  },
  dbimport: {
    group: 'data',
    label: 'Database import test',
    note: 'database files, cups.csv and transfers.csv into a world',
    cmd: [NODE, 'tools/dbimport.mjs', '--test'],
    params: {},
  },
  i18n: {
    group: 'data',
    label: 'Translations',
    note: 'texts not yet in the translation file, missing and outdated translations, long texts per language',
    cmd: [NODE, 'tools/i18n.mjs'],
    params: {},
  },
  escape: {
    group: 'data',
    label: 'Escape check',
    note: 'names put into markup without escaping (a pack could run code)',
    cmd: [NODE, 'tools/escape-check.mjs'],
    params: {},
  },
  plurals: {
    group: 'data',
    label: 'Plural sweep',
    note: 'a count before a plural word without a singular check',
    cmd: [NODE, 'tools/plural-sweep.mjs', '--check'],
    params: {},
  },

  // ---------- In a browser ----------
  crawl: {
    group: 'browser',
    label: 'Screen crawler',
    note: 'every tab, sub-tab and a sample of players and clubs: undefined/NaN, errors, overflow, unreadable text',
    cmd: [NODE, 'tools/crawl.mjs'],
    params: { players: { default: 10, min: 3, max: 40 }, clubs: { default: 8, min: 3, max: 30 } },
    needs: 'browser',
  },
  crawlstress: {
    group: 'browser',
    label: 'Screens with longer words',
    note: 'the crawler with every word 40% longer, as German or Vietnamese would run',
    cmd: [NODE, 'tools/crawl.mjs', '--stress'],
    params: { players: { default: 4, min: 3, max: 20 }, clubs: { default: 4, min: 3, max: 20 } },
    needs: 'browser',
  },
  visual: {
    group: 'browser',
    label: 'Screenshot comparison',
    note: 'key screens against the reference pictures; the ones that look different are marked',
    cmd: [NODE, 'tools/visual.mjs'],
    params: {},
    needs: 'browser',
  },
  browserbench: {
    group: 'browser',
    label: 'Speed at phone speed',
    note: 'Chromium with a slowed CPU: full time, a matchday, skipping, changing tab, saving, memory',
    cmd: [NODE, 'tools/browser-bench.mjs'],
    params: { cpu: { default: 4, min: 1, max: 20 }, matches: { default: 3, min: 1, max: 10 } },
    needs: 'browser',
  },
  storeshots: {
    group: 'browser',
    label: 'Store screenshots',
    note: 'a match, a transfer, the table and a profile at the app stores’ sizes, into store/screenshots/',
    cmd: [NODE, 'tools/storeshots.mjs'],
    params: {},
    needs: 'browser',
  },

  // ---------- Saves and reports ----------
  savelib: {
    group: 'library',
    label: 'Save library',
    note: 'every saved release and kept report opens, passes the world checks and plays on',
    cmd: [NODE, 'tools/savelib.mjs'],
    params: { days: { default: 5, min: 1, max: 60 } },
  },

  // ---------- Finding a fault ----------
  firstbad: {
    group: 'debug',
    label: 'First bad day',
    note: 'replay a seeded world day by day and stop on the first day a world check fails',
    cmd: [NODE, 'tools/firstbad.mjs'],
    params: { days: { default: 400, min: 1, max: 2000 }, seed: { default: 7, min: 1, max: 9999 } },
  },
  coverage: {
    group: 'debug',
    label: 'Code coverage',
    note: 'which lines the tests and the crawler run; files nothing touches',
    cmd: [NODE, 'tools/coverage.mjs'],
    params: { seasons: { default: 1, min: 1, max: 3 }, browser: { default: 1, min: 0, max: 1 } },
  },
  profile: {
    group: 'debug',
    label: 'CPU profile',
    note: 'a sampling profile of a run: where the time goes, by file and function',
    cmd: [NODE, '--cpu-prof', '--cpu-prof-dir=.devtools/prof', 'tools/suite.mjs', '--skip-speed'],
    params: { seasons: { default: 1, min: 1, max: 3 }, seed: { default: 11, min: 1, max: 9999 } },
  },
  bisect: {
    group: 'debug',
    label: 'Find the change',
    note: 'tests each commit since the last good run and names the first where a job failed or a measure moved (started from the Bisect panel)',
    cmd: [NODE, 'tools/bisect.mjs'],
    params: {},
    hidden: true, // (it needs a job, a measure and two commits: it has its own panel)
  },

  // ---------- Code and build ----------
  docs: {
    group: 'code',
    label: 'Docs check',
    note: 'docs agree with the data',
    cmd: [NODE, 'tools/check-docs.mjs'],
    params: {},
  },
  lint: {
    group: 'code',
    label: 'Lint',
    note: 'eslint',
    cmd: [NODE, 'node_modules/eslint/bin/eslint.js', '.'],
    params: {},
  },
  format: {
    group: 'code',
    label: 'Format check',
    note: 'prettier',
    cmd: [NODE, 'node_modules/prettier/bin/prettier.cjs', '--check', '.'],
    params: {},
  },
  build: {
    group: 'code',
    label: 'Build',
    note: 'dist/ as the store and Pages build',
    cmd: [NODE, 'tools/build.mjs'],
    params: {},
  },
  smoke: {
    group: 'code',
    label: 'Smoke test of the build',
    note: 'the built site hangs together: files, service worker, bundles load and play three days (run Build first)',
    cmd: [NODE, 'tools/smoke.mjs'],
    params: {},
  },
};

// Tools that need files or choices a button cannot give, so they stay on the command line; listed on the Run tab so that
// every tool is findable in one place
export const CLI_TOOLS = [
  ['namegen', 'npm run names', 'make names, towns, clubs, grounds and sponsors for a nation (also the Names tab)'],
  [
    'xg-check',
    'node tools/xg-check.mjs --data <folder>',
    'judge the shot model like an xG model on a league it has not seen (needs the Wyscout events)',
  ],
  ['realplayers', 'npm run realplayers:fetch / :build', 'fetch and build the real-player data (network, large)'],
  ['refstats', 'npm run refstats', 'refresh the reference statistics tables from the events data'],
  [
    'shots / passes / carries / movement',
    'npm run shots | passes | carries | movement',
    'the data pipelines that fit the match engine to tracking and event data',
  ],
  ['abbrevs --write', 'npm run abbrevs', 'rewrite the club abbreviation column in js/clubs.js'],
  ['sysmap', 'npm run sysmap', 'how the game’s systems feed one another (docs/SYSTEMS.md)'],
  ['changelog', 'npm run changelog', 'the What’s new table from the commit messages'],
  ['inbox', 'node tools/inbox.mjs', 'the private inbox the game posts feedback and reports to'],
  ['docsync', 'npm run docs:sync-status', 'which docs changed since they were last copied to Claude Docs'],
];
