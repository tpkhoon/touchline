# TOUCHLINE — mobile football manager (prototype)

Oct 21, 2026 · Source: [Claude Docs version](https://claude.ai/code/artifact/0b6aa68e-a100-4929-839e-2dd1d3cdc28f)

**The deepest football management experience built for mobile. Your club. Your stories. Your history.**

**Docs:** [design document](docs/GAME_DESIGN_DOCUMENT.md) · [systems](docs/SYSTEMS.md) · [roadmap](docs/ROADMAP.md) · [changelog](docs/CHANGELOG.md) · [feature list](docs/FEATURES.md) · [competition rules](docs/COMPETITION_RULES.md) · [naming rules](docs/NAMING_RULES.md). The game's own **Settings → Help → What's new** lists the latest builds.

A playable vertical slice: **1877 fictional clubs in 132 leagues across 117 nations, in three simulation tiers**. The world is made up (clubs, towns, grounds, nicknames, leagues, cups and derbies all have invented names, and so do the players), but it keeps the real thing's structure: each nation's leagues at their real sizes, with real promotion and relegation, real cup and continental places, real registration rules and kit colours. Club identities and ratings are the game's own. (The real names are kept apart, in `data/real-world.json`, and can come back as an optional pack; see [The world and its names](#the-world-and-its-names).)

Leagues are described by nation and level here, since their names are generated:

- **Full:** England's top two divisions, and the top flights of Spain, Germany, France and Brazil.
- **Light:** England's third and fourth tiers, Spain's second and third, Germany's second and third, Italy's top two, France's second, and the top flights of Portugal, the Netherlands, Argentina, the USA, Japan and Saudi Arabia, and the second divisions of Japan, South Korea, Thailand, Indonesia and Vietnam.
- **Minimal:** the top flights of Belgium, Turkey, Czechia, Greece, Norway, Poland, Denmark, Austria, Switzerland, Scotland, Serbia, Hungary, Ireland, Wales, Australia, Mexico, South Korea, Thailand, Singapore, Malaysia, Vietnam, Indonesia, the Philippines, Nigeria, Morocco, South Africa, Egypt, Tunisia, Tanzania, Algeria, Cyprus, Croatia, Sweden, Romania, Ecuador, Uruguay, Colombia, Canada, the United Arab Emirates, Iran, Qatar, China, India, Chile, Peru, Paraguay, Senegal, Ghana, Ivory Coast, Cameroon, DR Congo, Mali, Burkina Faso, Guinea, Cape Verde, Angola, Ukraine, Slovakia, Slovenia, Bosnia and Herzegovina, Albania, North Macedonia, Montenegro, Bulgaria, Finland, Iceland, Georgia, Israel, Russia, Belarus, Northern Ireland, Venezuela, Bolivia, Costa Rica, Jamaica, Honduras, Panama, Uzbekistan, New Zealand, Iraq, Estonia, Latvia, Lithuania, Armenia, Azerbaijan, Kazakhstan, Moldova, Kosovo, Luxembourg, Jordan, Oman, Bahrain, Kuwait, Pakistan, Bangladesh, Zambia, Zimbabwe, Kenya, Uganda, Ethiopia, Togo, Mozambique, Guatemala, El Salvador and Trinidad and Tobago, and Saudi Arabia's second tier.

Your own league and the leagues just above and below it always run in the full engine.

Around the leagues: B teams and U21/U18 sides, 117 domestic cups, 22 continental cups (a Champions Cup for each of Europe, South America, Asia, Africa and North America, with a second-tier Shield or Trophy in Europe, South America, Asia and Africa), a World Club Championship, international football with 182 national teams and qualifiers, a live match engine, and the story-driven world around it.

## Contents

- [Quick start](#quick-start)
- [Saves](#saves)
- [Develop, test, build](#develop-test-build)
- [Developer dashboard](#developer-dashboard)
- [Docs syncing](#docs-syncing)
- [GitHub Pages and save format changes](#github-pages-and-save-format-changes)
- [Native app (Capacitor 8)](#native-app-capacitor-8)
- [Install it as an app (offline)](#install-it-as-an-app-offline)
- [The world and its names](#the-world-and-its-names)
- [What's in the slice](#whats-in-the-slice)
- [Code map](#code-map)
- [Not yet built](#not-yet-built-next-candidates)

## Quick start

No build step. Serve the folder and open it at phone width (or on a phone on the same network):

```bash
python -m http.server 5173
```

Then open http://localhost:5173.

## Saves

- Saves go to IndexedDB in the browser, or to real files in the native app.
- There are 5 slots, with autosave after every matchday and whenever the app goes to the background.
- Older saves are upgraded automatically (the original is kept as a backup); only saves from before Alpha 1 can't be.
- Club → Settings exports a compressed `.touchline` backup and imports one (also from the title screen).

## Develop, test, build

The source runs as-is: no build is needed to play or develop. Node tooling (`npm install` once) adds the commands below.

| Command                                                                 | Purpose                                                                                                                                                  |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run serve`                                                         | Serve the folder on port 5173 (same as the `python -m http.server` above).                                                                                |
| `npm test`                                                              | Headless regression test: two seeded seasons plus invariants, save pack/unpack and migrations (slow: ten minutes or more).                                          |
| `npm run test:quick`                                                    | The same regression test over one season.                                                                                                                |
| `npm run calibrate`                                                     | Calibration report: three seeded seasons compared with real football, 49 measures.                                                                       |
| `npm run test:regens`                                                   | Regen test: academy intakes aged year by year, checked for realistic career shapes (about 20 seconds).                                                   |
| `npm run test:suite`                                                    | Wider suite: a manager plays every match for three seasons, checking speed, tables, squads, finances and world shape.                                    |
| `npm run test:long`                                                     | The wider suite over twenty seasons, without the speed limits.                                                                                           |
| `npm run test:wonderkids`                                               | Wonderkid test: ten seeded seasons following every high-potential prospect.                                                                              |
| `npm run test:realstats`                                                | Tests for the real-stats converter.                                                                                                                      |
| `npm run test:worlddef`                                                 | Tests for the world definition.                                                                                                                          |
| `npm run test:import`                                                   | Tests for the historical importer.                                                                                                                       |
| `npm run test:asia`                                                     | Asia test: the AFC's foreign-player places hold on matchday, Korean players go into military service and come back, Gulf money buys famous names for Saudi clubs, Japan's graduate draft signs players, part-time clubs are recognised and every story start finds a club. |
| `npm run test:tactics`                                                  | Tactic-response test: a high press, a low block, build-up, width and the opponent's press must change possession, ball-winning, stamina and chances by type; match instructions must pay against the side they answer and cost against the wrong one; the post-match reading must name them. |
| `npm run test:longrun`                                                  | 30-year stability test: the world plays itself and the pecking order, upstarts, falls, dynasties and club bounds are checked (about 25 minutes). |
| `npm run sysmap`                                                        | Systems map: how each system uses the others, the closed loops checked hop by hop, and state nothing reads (writes docs/SYSTEMS.md). |
| `npm run test:dbimport`                                                 | Tests for the database import framework.                                                                                    |
| `npm run test:editor`                                                   | World editor test: an edited world (clubs, leagues, cups, players, staff, national teams, history, packs) is built the way the new-career screen builds it and plays a season. Slow: several minutes. |
| `npm run test:schedule`                                                 | Schedule test: the rules of one league and one cup (points, substitutes, extra time, foreign-player limits), a changed season calendar and hand-fixed fixtures are built into a world, which plays a season. Slow: a few minutes.|
| `npm run test:competitions`                                             | Competition test: registration rules, a title play-off and two tournaments, tiered continental competitions made in the editor and an expansion draft are built into a world, which plays a season. Slow: a few minutes.         |
| `npm run abbrevs`                                                       | Rebuild the club abbreviations from the clubs' names (`-- --write` rewrites js/clubs.js; the rule is `FM.U.abbrev`).        |
| `npm run test:abbrevs`                                                  | Check that no club abbreviation is rude, silly, doubled or built from a generic first word.                                  |
| `npm run import:history -- --dir data/samples/history --out world.json` | Run the historical importer on a folder of data.                                                                                                         |
| `npm run dev-tools`                                                     | Start the developer dashboard on http://localhost:5190.                                                                                                  |
| `npm run test:crawl`                                                     | Screen crawler: every screen in a browser, flagging broken text, errors, overflow and unreadable text (`-- --stress`, `-- --lang de`). |
| `npm run test:visual` / `npm run visual:update`                         | Compare 26 key screens with the reference pictures / make the references.                                                   |
| `npm run bench:browser`                                                 | Speed in Chromium with a slowed CPU: full time, a matchday, changing tab, saving, memory.                                   |
| `npm run test:winchance`                                                | Does the win chance shown before a match come true (quick, instant and watched)?                                            |
| `npm run test:economy`                                                  | Values, wages and transfer budgets against club revenue, and their drift over the seasons (`-- --seasons 6`).               |
| `npm run test:saves` / `npm run saves:snapshot`                         | Test every saved release and kept report / add this version's save to `tests/saves/`.                                       |
| `npm run shots:store`                                                   | Store screenshots at the app stores' sizes into `store/screenshots/`.                                                       |
| `npm run firstbad`                                                      | Replay a seeded world and stop on the first day a world check fails.                                                        |
| `npm run coverage`                                                      | Which lines the tests (and, in a browser, the crawler) run.                                                                 |
| `npm run i18n`                                                          | Translation report: texts not moved, missing and outdated translations, long texts.                                         |
| `npm run inbox`                                                         | The private inbox the game posts feedback and problem reports to.                                                           |
| `npm run names -- --kind clubs --nat SCO --count 20 --seed 3`           | Name generator (`tools/namegen.mjs`): players, towns, clubs, grounds, nicknames, leagues and sponsors by nation and seed, flagging names that would be rejected. |
| `npm run docs:sync-status`                                              | List docs whose Claude Docs copy has changed since the last sync.                                                                                        |
| `npm run docs:synced`                                                   | Record the docs as synced (run it right after syncing).                                                                                                  |
| `npm run check:docs`                                                    | Check the headline numbers in the README and design document against the data.                                                                           |
| `npm run changelog`                                                     | Regenerate `js/changelog.js` and `docs/CHANGELOG.md` (Settings → Help → What's new, with each bullet of a build listed) from the Shipped list in `docs/ROADMAP.md`; start a bullet with a bold lead-in such as `**Scouting:**`.                                                          |
| `npm run typecheck` | TypeScript over the files marked `// @ts-check` (twenty modules so far; a missing field or a wrong shape fails the deploy). |
| `npm run lint`                                                          | ESLint.                                                                                                                                                  |
| `npm run format`                                                        | Prettier (`npm run format:check` only reports).                                                                                                          |
| `npm run build`                                                         | Minified production build in `dist/`.                                                                                                                    |
| `npm run serve:dist`                                                    | Preview the production build.                                                                                                                            |
| `npm run cap:sync`                                                      | Build and copy the web app into the Android and iOS projects.                                                                                            |
| `npm run android` / `npm run ios`                                       | Sync, then open the native project.                                                                                                                      |

### Regression test

`npm test` runs two seasons with a seeded RNG through the same code the app uses (including the Web Worker's JSON hand-off), then checks invariants, save pack/unpack and save migrations. It exits non-zero on failure and is slow: a season takes several minutes on a laptop (five to ten on a slow machine), so two seasons is a wait of ten minutes or more. `npm run test:quick` plays one season.

### Calibration

`npm run calibrate` is a calibration report: three seeded seasons compared with real football, 49 measures in four groups:

- **Matches:** goals, home/draw/away split, shots, xG, set pieces, penalties, cards, title races, cup upsets, light-league scores, goals trend.
- **Player careers:** age profile of top-flight minutes, keeper ages, top-100 age, peak ages, retirement ages, academy-grown vs generated player shape, world elite trend, top-flight squad turnover, plus the ability-change-by-age curve.
- **Injuries:** rate per club, share of squads out, layoff lengths, long-term injuries, match vs training, muscle and hamstring shares, re-injuries, age effect.
- **The market:** top-flight loans out, loanees' games, how long free agents wait, players created from nowhere.

The report ends with each league's champions' pre-season rank, to spot a league that is too predictable. Trend measures need `--seasons 8` or more (use it for any long-run question).

Where the tuning knobs live:

- The engine's knobs are in `FM.CAL` at the top of `js/engine.js`. Try values with `node tools/calibrate.mjs --set chanceRate=0.15,homeAtt=1.1`, or any setting by path such as `--set Season.ELITE.growth=0.6`. `targetGoals` is the level the tactical equilibrium settles back toward, via `S.era`.
- AI managers' ability (`FM.CAL.mgr`) and AI tactical familiarity (`FM.CAL.aiFam`) are also engine knobs.
- Injury rates are in `FM.Injury.CAL` (`js/injuries.js`).
- The career curve is in `CURVE` and academy potential in `Sea.YOUTH` (`js/careers.js`), together with elite growth (`Sea.ELITE`), veteran renewals (`Sea.VET`) and unattached veterans retiring (`Sea.FA_RETIRE`).

### Regen test

`npm run test:regens` ages five academy intakes (plus the world's generated youngsters) year by year through the real development code, in about 20 seconds. It reports career shapes with examples and checks each against an expected range; it exits non-zero on failure. The shapes:

- prospects who deliver;
- flops (stalled, plateaued, burned out);
- one-season wonders;
- early primes (at their best by 18–19);
- long primes (still at their best at 33–34).

The rates live in `Sea.ARCS` (`js/careers.js`).

### Wider suite

The wider suite (`tools/suite.mjs`) has a manager play every match for three seasons (`test:long`: twenty, without the speed limits). It checks:

- speed (a league day, a pre-season day and a season against a budget; `--budget 2` for a slower machine);
- that every league table adds up, leagues keep their size and as many clubs go up as down;
- that every full-simulation club can field a legal side all season;
- that no club drifts into impossible debt or wealth;
- that the world keeps its size and shape.

It takes several minutes a season. In the app, the developer panel has the matching UI smoke test: it opens every tab, sub-tab and a sample of sheets and reports what threw or showed a broken value.

### Wonderkid test

`npm run test:wonderkids` runs ten seeded seasons, following every prospect of 19 or under with a potential of 85+, against what real football shows (how many reach world class, stall or flop, and when the best peak).

### Data tools

These serve the editor and club packs (`npm run test:realstats`, `test:worlddef`, `test:import`, `test:editor`, `import:history`):

- **Real-stats converter:** `js/realstats.js`, command line `tools/realstats.mjs players.csv`. Turns a real player's numbers into attributes and ability.
- **World definition:** `js/worlddef.js`, command line `tools/worlddef.mjs --export world.json`. The world as data, apart from a save: export, validation, an editing API and loading onto a new world.
- **Historical importer:** `tools/import-history.mjs`. Reads season tables, player stats and club details into a definition through the converter; a synthetic sample is in `data/samples/history`.
- **Database import:** `js/dbimport.js` (`FM.DbImport`), `js/histimport.js` (the CSV adapter, also used by `tools/import-history.mjs`) and `tools/dbimport.mjs` (`--check file.json`, `--test`). The in-app way to start a career in a database of your own: adapters turn a file format into a world definition (`read`, `check`, `stage`, `build`, `export`), and the new-career screen's Database card runs it. A definition can add clubs and leagues, change the game's own and replace every player; the changes to the game's data are a small patch (`FM.WorldDef.patchOf`, `useStatic`) that the picker, the save and the simulation worker apply. Adapters: world-definition JSON (`node tools/worlddef.mjs --export`, or Settings → Database in the game) and historical CSV tables; more register with `FM.DbImport.register`.
- **World editor:** `js/ui-editor.js`, opened from the Database card on the new-career screen (Edit this world). It edits a world definition through the validated calls of `FM.WorldDef.editor` and hands it back as the database the career is made from, or saves it as a file. It covers leagues (formats, tie-breakers, splits, promotion, relegation and play-offs, continental places, simulation tier), clubs (names, looks, crest, kit shirts, ground, ratings, money, facilities, supporters, derbies, B teams, managers), players and free agents (also imported from a spreadsheet through the real-stats converter), coaches, scouts and agent firms, the rules, the cups (names, formats, prize funds, entry, new cups, cups taken out), international football (tournaments, qualifying, national teams, squads), past seasons (tables, cup and tournament winners, big transfers), a library of worlds kept on the device, and club data packs (names and looks only, which fit any world). `tools/editor-check.mjs` (`npm run test:editor`) is its test.

### Name generator

`npm run names -- --kind clubs --nat SCO --count 20 --seed 3` (`tools/namegen.mjs`) generates names for players, towns, clubs, grounds, nicknames, leagues and sponsors by nation and seed. It flags names the world generator's checks would reject: rude, hard to say, too long, or close to a real town or club. The dashboard has the same thing as its Names tab.

### Lint and format

ESLint (`eslint.config.mjs`) catches undefined names and unused variables; Prettier (`.prettierrc.json`, 120 columns) formats the code. Run both before committing; `npm run format:check` only reports.

### Build

`npm run build` makes a minified production build in `dist/`: `sim.min.js` (engine, also loaded by the simulation worker) + `ui.min.js`, content-hashed URLs and a regenerated service worker. Preview it with `npm run serve:dist`.

## Developer dashboard

Run `npm run dev-tools` (after `npm install` once), then open http://localhost:5190. It listens on 127.0.0.1 only.

It is a local app (`tools/devserver.mjs`, page in `tools/dev/`) that is not part of the game. It runs every check in the project as a job with live output and a result history in `.devtools/` (two runs of a job can be compared measure by measure): the test suites, calibration, the win-chance check, the data and rule checks, the browser jobs, the save library, lint, docs and build. The **Run** tab groups them (tests, calibration, data and rules, in a browser, saves and reports, finding a fault, code and build) with a one-line description of each, and lists the tools that stay on the command line. The tabs, by group:

| Group              | Tabs                                             | What they do                                                      |
| ------------------ | ------------------------------------------------ | ----------------------------------------------------------------- |
| Run and tune       | **Run**, **Gate**, **Trends**, **Seeds**, **Sweep** | Run the jobs and close the tuning loop (details below).           |
| Inside a world     | **World**, **Saves**                             | Browse and test a headless world; inspect save files.             |
| Data tools         | **Converter**, **Importer**, **Definitions**     | Real-stats data and world definitions.                            |
| Names              | **Names**                                        | The name generator, in a tab.                                     |
| Release and health | **Release**, **Profile**                         | Release checklist; CPU profiling and speed at phone speed.        |
| After launch       | **Reports**, **Screens**, **Debug**              | Players' reports, the screens in a browser, finding a fault.      |
| The game           | **Game**                                         | The game in a frame with the in-game developer panel.             |

### Run, Gate, Trends, Seeds, Sweep

- **Run** starts the test suites, calibration, lint and the rest as jobs with live output and a history.
- **Gate** runs a quick or full set of jobs, compares them with pinned baselines, and fails when a job fails or a measure leaves its range.
- **Trends** shows each measure across every run, with the real range as a band.
- **Seeds** (seed matrix) runs one job on several seeds, with mean, spread and how many seeds are in range.
- **Sweep** tries a tuning constant at several values on the same seeds, next to the game's own value. Any capitalised number the game exposes works, and a run reads it from `TOUCHLINE_TUNE` without touching the source.

### World and Saves

- **World** keeps one headless world in memory (`tools/worldhost.mjs`) to browse clubs, players, tables and the feed. It can:
  - run a scan for things that should not be (clubs that cannot field a side, flat attribute spreads, expired contracts, duplicate names …);
  - step days, or run until a condition holds (a club with no keeper, impossible debt, an injury wave), with charts of what happened each day;
  - run a **match lab** that simulates one fixture hundreds of times with an optional tactic change.
- **Saves** reports a save file's version, where its bytes go, what an upgrade adds or removes and whether it survives a pack and unpack.

### Converter, Importer, Definitions

- **Converter** and **Importer** host the real-stats converter and the historical importer (paste or upload CSV/JSON, download the result), plus a world-definition validator.
- **Definitions** edits a world definition in forms (club names, colours, ratings, stadiums, players added through the converter, past seasons) with live validation against the base world and a button to try it in a new world.
- **Converter calibration:** give it players with the ability you expect, in an `expected` column, and it shows the error, the bias by position group and the offset and spread that fit best (`RS.TUNE` in `js/realstats.js`). A synthetic sample is in `data/samples/converter`.
- **Column mapper:** turns a messy CSV (any column names, comma, semicolon or tab) into the importer's format, matching club names to the base world's clubs with suggestions.

### Names

The **Names** tab is the name generator: players, towns, clubs, grounds, nicknames, leagues and sponsors by nation and seed, flagging names the world generator's checks would reject (rude, hard to say, too long, close to a real town or club). The same generator runs from the command line, see [Name generator](#name-generator).

### Release and Profile

- **Release** is one checklist and a one-click release check: working tree clean and pushed, the Pages deploy for this commit, the live site up and on the build you expect, docs, lint, format and the tool tests, a build with its size against the last one, the 1-season suite, the latest gate, the UI smoke test run from the Game tab, and whether the Claude Docs copies are in step.
- **Profile** takes a real CPU profile of a headless run (`node --cpu-prof`) and shows time by file, functions by their own time and a call icicle, with the `.cpuprofile` to download for Chrome's Performance panel, plus the speed numbers of every suite run as trends.

### Reports, Screens, Debug

The tools for after launch. The browser jobs drive Chrome or Edge (already on the machine) with `playwright-core` (`npm install` once; no browser is downloaded, or set `TOUCHLINE_BROWSER` to a browser's path). They start a seeded career (`tools/browser.mjs` makes it once per change to the simulation and keeps it in `.devtools/seed/`), with a fixed date, a seeded `Math.random` and no animation, so two runs on the same code look the same.

- **Reports** opens a player's problem report. _Report a problem_ in the game sends the save as a backup file with a `report` section after it (the player's note, the version, build and platform, and the area they picked: match day, transfers, finances …); the file still opens as an ordinary backup. Drop one on the tab (or open it from the inbox) to read the note and diagnostics, load the save and run the in-game panel's world checks plus the scan, and play the next days on a copy to try to reproduce it (a fault in those days is shown with its stack). _Explore this world_ leaves it open on the World tab; _Keep as a test case_ copies it to `tests/reports/` once the bug is fixed, and the save library (below) then opens it with every release.
  - **The private inbox** (`node tools/inbox.mjs`, or _Listen here_ on the tab): a small server the game can post feedback and reports to, so a player needs no GitHub account and nothing is public. It keeps each item in `.devtools/inbox/`, rate-limits by address and size-limits what it takes. Set `UI.INBOX_URL` in `js/ui-screens.js` to its (https) address; empty, _Send feedback_ still opens a GitHub issue and _Report a problem_ still shares a file. Each item carries a tag (version, build, platform, save format, area), and the tab groups what arrives by version and area, with a status (open, fixed, won't fix).
- **Screens** runs the browser jobs and shows what they found:
  - **Screen crawler** (`npm run test:crawl`): every tab and sub-tab, a sample of players and clubs, the match preview and full-time screens, the settings and the title screen; flags `undefined`/`NaN`/`[object Object]` in the words on screen, JavaScript errors, text that overflows or is cut off, pages wider than the screen, and text or fields whose colour is nearly the colour behind them (it found a currency menu with pale text on white). Problems already known are in `tools/crawl-baseline.json` and do not fail the run; a new one does (`--write-baseline` accepts what is found now). `--stress` makes every word 40% longer first, to see which screens would break in German or Vietnamese, and `--lang de` puts a language file's words in the screens.
  - **Screenshot comparison** (`npm run test:visual`): 26 key screens against the reference pictures in `tests/visual/<device>/`; the ones that differ are named, with the difference marked in red and _Accept_ to take the new picture as the reference (`npm run visual:update` makes them all). Fonts are drawn by the machine's own browser, so make the references on the machine that checks them.
  - **Store screenshots** (`npm run shots:store`): the matchday, tactics, a player profile, the transfer market, the league table, a match being played and full time, at the stores' sizes (iPhone 6.9" and 6.5", iPad 13", Android phone and tablet) into `store/screenshots/`.
- **Debug**:
  - **Find the change** (`tools/bisect.mjs`): when a job fails or a measure gets worse, pick the last good commit and the first bad one; it tests the commits between by halving, each in a separate checkout under `.devtools/bisect/` (your files are not touched), and names the first commit where the job failed or the measure left its range or moved by more than a set share of it.
  - **First bad day** (`npm run firstbad`): replays a seeded world day by day, running the world checks after each, and stops on the first day one fails, with the world left on that day for the World tab.
  - **Code coverage** (`npm run coverage`): Node's V8 coverage while the unit tests and a season of the regression test run, and the crawler (the interface) in a browser; per file, the files no test touches, and the largest functions nothing calls.
  - **Tests that do not give the same answer twice**: every run records the commit and a hash of any uncommitted change; runs of a job on the same code and settings that disagree (one passed, one failed, or a seeded measure came out differently) are listed, and a flaky job is marked on the gate.
  - **Translations** (`npm run i18n`): the screen texts in the code not yet in `data/lang/en.json`, missing, out-of-date and wrong-placeholder translations per language (`data/lang/<code>.json`, with a hash of the English each was made from) and texts that run long.

The jobs added for them: **Win chance** (`npm run test:winchance`) plays matches between clubs of every strength and checks the chance the matchday screen shows against the results, played the computer's way, instantly from the preview, watched live taking the assistant's offers to change a tired player, and watched live ignoring them (a shown 60% should win about 60%); **Save library** (`npm run test:saves`) opens every release's save in `tests/saves/` (`npm run saves:snapshot` adds this version's) and every kept report, checks them, plays a few days and packs them again; **Speed at phone speed** (`npm run bench:browser`) plays the career in Chromium with its CPU slowed (4× is about a mid-range phone) and times the full-time screen, a day with a match, skipping, changing tab, saving and the memory held, kept as a trend on the Profile tab. The **Economy** job (`npm run test:economy`, under Calibration) plays the world on for some seasons and checks the proportions: squad value against revenue for the top and middle clubs, the most valuable player against the richest club's revenue, wages against revenue by league and tier, transfer fees against values and against revenue, the largest one-year step in value with age and with contract length, a striker against a keeper of the same ability, the same player's wage in Saudi Arabia and Korea, the drift in the value and the wage of a given ability, and clubs entering administration. The full gate runs economy, win chance, the save library, the crawler and the screenshot comparison where a browser is found.

### Game

**Game** shows the game in a frame with the in-game developer panel switched on. Open **Settings (⚙️) → Help → Developer tools** for the world check, market summary, wonderkid list, speed test, "play a season" (a season on a copy) and the UI smoke test. They run on a copy of your save and put the real one back.

`js/devtools.js` (the panel) is added to the game only inside the dashboard, never to `index.html`, the build, a built app or the Pages site.

## Docs syncing

The roadmap, feature list, design document, README and changelog have copies in Claude Docs, which cannot be read from here. `docs/SYNC.json` holds a hash of each at the moment it was last synced.

- `npm run docs:sync-status` lists the ones that have changed since.
- `npm run docs:synced` records them as synced (run it right after syncing).

The dashboard's Release tab reads the same record.

## GitHub Pages and save format changes

**GitHub Pages:** `.github/workflows/pages.yml` builds `dist/` and publishes it on every push to `main`. One-time setup: in the repository's Settings → Pages, set Source to "GitHub Actions". The game is then at `https://<user>.github.io/<repo>/` (all paths are relative, so the subpath works, and it installs as an offline web app from there).

**Save format changes:** bump `FM.SAVE_VERSION` in `js/core.js` and add a migration to `MIG` in `js/save.js` (from the previous version). Never edit a shipped migration; `npm test` checks every version has an upgrade path.

## Native app (Capacitor 8)

`android/` and `ios/` are Capacitor projects that package `dist/`. `npm run cap:sync` builds and copies the web app into both.

- **Android:** needs Android Studio (Android SDK) and JDK 21. `npm run android` opens the project; build or run it from there.
- **iOS:** needs a Mac with Xcode. Copy the project over, run `npm install`, then `npm run ios`.
- The app id is `app.touchline.manager` (change it in `capacitor.config.json` before the first store upload). App icons and splash screens are still Capacitor's defaults.
- In the app, saves are files in the app's private data folder (written to a temp file, then renamed); haptics, share and the status bar use the native plugins; the Android back button closes the top-most sheet; phones are locked to portrait (tablets rotate).

## Install it as an app (offline)

Touchline is an installable web app: it has a manifest, app icons and a service worker, and bundles its fonts, so once it has loaded it plays with no internet connection.

- **On this computer:** open http://localhost:5173 in Chrome or Edge and use *Install* (address bar icon, or Club → Settings → Install as an app).
- **On a phone:** browsers only allow installing and offline play over **https**, so the game has to be hosted — any static host works (GitHub Pages, Netlify, Cloudflare Pages); just upload the folder. Then Android: Chrome menu → *Install app*; iPhone: Safari → Share → *Add to Home Screen*. Over plain `http://` on your local network the game still runs, but can't be installed or go offline.
- **Updating:** the service worker fetches fresh files whenever you're online and only falls back to its cache when offline, so edits show up on the next load. When you **add** a new file, add it to the `FILES` list in `sw.js` and bump `CACHE`.

## The world and its names

The game runs on a fictional world: the same 1877 clubs, 132 leagues, cups and derbies as the real structure, with generated names.

- The tools that need real names (`worldgen`, `realworld`, `newleagues`, `realplayers:fetch`, `realplayers:build`, and the name generator's check against real clubs and towns) read them from a private folder, `touchline-private/` beside the repository (or wherever `TOUCHLINE_PRIVATE` points; `tools/private.mjs`). It holds a names database, `real-world.json`, keyed by club code (nation, league, kit colours, identity, rank, derbies). It is not in the repository or its site; where it is missing (as in CI) these tools say so and skip.
- `node tools/worldgen.mjs --seed 1 --out data/fictional-world.json` generates the fictional names from that database: towns, clubs, grounds, nicknames, founding years, leagues, cups, sponsors and derbies, by each nation's naming conventions (`tools/namelib.mjs`, rules in [docs/NAMING_RULES.md](docs/NAMING_RULES.md)). It is deterministic from the seed.
- The names are refined by tools: `tools/renameclubs.mjs` (a nation's clubs, towns, grounds and competitions in its own words, from `tools/namelib-new.mjs`), `tools/renick.mjs` (club nicknames, varied per nation) and `tools/expansionpool.mjs` (the clubs that can join a closed league).
- `node tools/realworld.mjs apply data/fictional-world.json` puts a names file into the game (`js/clubs.js` and `js/data.js`). A club's id is `c_` and its code, which is the club's own abbreviation. The ids were renamed once, in save format 9 (they had been the real clubs' abbreviations), so saves from before it cannot be opened; otherwise ids never change, so saves keep working.
- The players are fictional in the game itself: names come from each nation's pools, with known real-name combinations blocked. A player who wants a world of real clubs and squads can build a pack of their own with the tools to build a pack of your own (`npm run realplayers:fetch` and `realplayers:build`, which read openly licensed sources into a cache folder and write a world pack in the game's own format to a private folder outside the repository; the game ships none); it opens from Import a database on the new-career screen. See `data/packs/README.md`.
- Real club and league names are trademarks, so the game ships the fictional set and no real names or players; packs people build themselves stay on their own machines.

## What's in the slice

| Brief pillar | In the prototype |
|---|---|
| **Match engine** | Matches play as live commentary, a text view of the same simulation (the top-down pitch with 22 moving dots, pressing lines and ball carrier labels is still in the code, switched off: `FM.MatchView.VISUAL` in `js/matchview.js`). Minute-by-minute sim; highlights slow down (~every 20–40s at 1×). Live xG, possession, momentum bars, 1×/2×/4× speed, instant result. |
| **Tactical prompts** | Analyst insights, chasing the game, protecting a lead, "pinned back", tired legs, injuries, red cards, half-time team talk (personalities react differently). Assistant has a personality and sometimes disagrees. |
| **Tactical depth** | 6 formations (back 3/4/5), build-up (Short/Direct/Counter/Possession), pressing (High/Mid/Low), inverted full-backs, roles (Segundo Volante, Carrilero, Mezzala, Inverted Winger, False 9, Libero…), each with engine effects. |
| **Players** | 1–20 attributes, star ratings measured against your own league (no overall numbers), family heritage and larger name pools, morale, wage, value, contract, form, traits (Big Game Player, Injury Prone, Late Bloomer, Loyal, Mercenary, Leader, Fair-Weather…), hidden attributes + personality. Radar, form chart, heat map, career history. Realistic career shapes (plus hidden arcs: wonderkids who flop, one-season wonders, early primes, long primes): fast growth in the teens, a peak around 27–29, decline through the thirties (pace first, reading of the game last); keepers and centre-backs age later, every player's clock runs a little early or late, and veterans wind down on one-year deals before retiring at ~33–35. Potential moves each summer until 25 (performance, game time, academy, injuries, luck); Basque and Catalan heritage. |
| **Scouting** | Scouts with regional strengths. Assignments by region or league, filtered by position, age, minimum potential, max fee and focus (undervalued / wonderkids / ready now). Reports are graded A–D, with a Sign / Loan / Monitor / Avoid recommendation, the scout's own words and gradual reveal of personality, injuries and hidden attributes. Target-versus-your-starter comparison. Assignments can target one exact position (ST, LW, RB, CB ...) or a type of player (a ball-playing centre-back, a regista, a target man). Nationality mixes per league are realistic (35 nations), and a new manager's scouts come from his club's own part of the world. Fees and wages use fine-grained steppers and exact input. |
| **Youth** | Annual intake shaped by academy level, nationality (Japan = technicians, Brazil = flair, Serbia = defenders, France = athletes) and the nation's youth rating, which moves each season with its national team, academies and prospects. AI clubs give their wonderkids minutes or loan them out. Development depends on age, training facilities, professionalism, minutes and Late Bloomer. U21 and U18 sides play national youth leagues; B teams in Spain and Germany (a club's second side) play in the lower divisions, can never go up to their parent's division, and their players belong to the parent. |
| **Training & analytics** | Team focus (eight) and intensity (three), individual focus or a new position for any player: development, which attributes grow, training injuries, recovery, set pieces and familiarity. Analytics tab: your season's xG match by match, against the league, chance types, goal times and the analyst's reading. |
| **Competitions** | 132 leagues in three simulation tiers (your league and its neighbours always fully simulated) (full engine / light statistical model / minimal scores-only), promotion, relegation and playoffs, 117 domestic cups (seeded knockouts with byes, extra time and penalties). the European, South American, Asian, African and North American Champions Cups and their second-tier Shields and Trophy, all fed by data-driven rules, plus a mid-season World Club Championship for last season's finalists. Knockouts and playoff semi-finals can be two-legged, with an optional away-goals rule. A closed league can grow by one to three clubs a season, each filling its squad in an expansion draft (or starting with no players and signing its own, if you choose no draft). |
| **Transfers** | Offers, counter-offers, loyal/ambitious refusals, windows, rumours, AI bids for your players. Contract packages: wage, length, squad status, signing-on fee, appearance and goal bonuses, release clause, yearly rise, relegation wage cut. Agents with personalities (Shark, Pragmatic, Family, Showman, Rookie) set demands, patience and fees; release clauses can be paid — by you or by rivals. International market, marquee raids, veterans abroad, Transfer Centre. AI clubs keep their squads moving: they replace their weakest starter (judging ageing players on where they're heading), buy from smaller clubs or at a premium from peers (never from a direct domestic rival), and sell the player who lost his place to a smaller club, so players climb the pyramid as they improve and slide down it as they fade. |
| **Club identity** | 1877 fictional clubs in 132 leagues at their real sizes (invented names, towns, grounds, nicknames and derbies; the real kit colours and structure; the game's own ratings), each with an identity: Oil-Backed, Historic Giant, Fan-Owned, Youth-Focused, Selling Club, Fallen Giant. Board demands, fan culture, derbies. The two Spanish second-division clubs that follow Athletic Club's policy sign only Basque or only Catalan players (scouting included); Saudi Pro League and First Division, mostly Oil-Backed. Each club also has a market, supporters, a youth catchment and an owner, which set a ceiling its reputation cannot pass without a cause (a takeover, years of success); identity drives recruitment, what fans expect of your style, players' willingness, the board's patience and revenue. |
| **Stories** | Feed of newspaper headlines, fan social posts (with rival fans on derby day), press conferences with choices, dressing-room events. Instagram-style **shareable story cards** export as 1080×1350 PNG ("26-year-old Brazilian winger scores on debut"). |
| **Living world** | AI sackings, takeovers, administration and points deductions (and, if the world allows, liquidation and phoenix clubs), stadium expansions, rule changes (subs, homegrown rules, TV deals), retirements, legends returning as managers. |
| **People** | One-to-one talks (praise, criticism, promises of minutes, a new contract, a debut, not being sold, or permission to leave). Promises are tracked, kept or broken, and move morale and squad trust. Players ask for meetings when unhappy or underpaid. Board meetings (transfer funds, owner-funded facilities, patience, a youth project), a mid-season review and five-game ultimatums. |
| **International** | 182 national teams, coefficient ranking, qualifying groups in the season before a tournament, two double-header breaks, and the summer finals played as calendar days. Take a national team job alongside your club: pick call-ups, set tactics, play the matches live; failing to qualify ends it. Coaching licences (B → A → Pro) unlock bigger jobs. Invitational tournaments in the windows (Cherry Blossom Cup, Golden Elephant Cup, Monsoon Cup). |
| **Career** | Create your manager: first and last name, country and avatar (your country knows you). Start with a club or start unemployed. Out of work (from the start or after a sacking), the world keeps playing and clubs in your reputation range make offers that come and go; a national team job carries on. The club picker gives every club a difficulty (Relaxed to Brutal), opens with three questions and three suggested clubs, shows each club's story and each league in a card, and the first season keeps introducing the world. Sim forward a set number of days, to your next match or to the season's end, stopping for anything that needs you (and when you press Stop; Next match can ask first too). A database (world-definition JSON or historical CSV tables) can replace the world: new clubs and leagues, renamed clubs, every player; Settings exports the world you play. Your manager profile is discovered, not picked (youth, attack, spending, stability, learned from what you do), boards, players and the job market react to it, and your standing is kept by country. |
| **Legacy** | Hall of Fame (top scorers, appearances, academy graduates, cult heroes, biggest sales + seeded historic legends), Football Archive per season, manager identity tags (Youth Developer, Giant Killer…), sacking and job offers. Every club's season by season (league, position, record, top scorer, most appearances, cup runs, honours) and a Club legends card with the all-time top five scorers and appearance makers. |
| **Real rules** | Every career plays by each competition's real rules (kept under the fictional names): three points, five substitutions, each league's foreign-player rules, two-legged continental knockouts and play-off semi-finals, no away goals. Competitions use data-driven rules (`promote`/`relegate`/`playoff` relationships in `js/world.js`), not hardcoded leagues. MLS has its own: a salary budget (the 20 biggest wage charges up to $5.2M, no more than $700K counted for any player), three Designated Players above that, a 30-man senior roster, eight international slots and a three-round draft; the AI's clubs are kept within it. |
| **Board** | Demands set each season: a league aim and a minimum ("Qualify for the European Champions Cup — at the very least a European Shield place"), cup targets that fit the club, finances (wages against revenue, debt) and the club's identity, each critical, important or a bonus. Four board meetings a season: the board's view and its own demands, then one request (transfer funds, a wage budget, facilities, a stadium expansion, a youth project, a marquee signing, a lower target, patience, a training camp), answered on confidence, money, form, your reputation and what you asked before. |
| **Injuries** | 23 real injury types (hamstring strains to ACL ruptures) with realistic layoffs; risk from proneness, age, fatigue, match fitness and a recent return; training knocks and illness; re-injuries; long injuries cost development and sometimes pace. Your players: medical news, surgery-or-rehab decisions, "risk him?" before big games, return-to-fitness news. Rates match real football (~35 injuries a club-season, ~9% of a squad out at any time). |
| **Staff** | Hire and fire an assistant, coach, analyst, physio, sporting director and up to 5 scouts from a market that refreshes each season. Ability has effects: development speed, injury length, analysis depth, negotiated fees. Vacant roles fall to a caretaker. |
| **Advice** | The assistant's notes on the Squad tab cover lineup issues, fatigue, unhappy players, youngsters ready to play, loan candidates, weak areas, expiring contracts and deadwood, with one-tap actions. Scouts' picks on the Scouting hub. |
| **Season preview** | Predicted table, predicted finish, bookmaker title odds, pre-season best XI, key man, one to watch. |
| **Pre-season** | 3 days before matchday 1: book friendlies (home gate / away fee) or camps (fitness, tactical, youth, commercial tour). Tactical familiarity grows with matches and camps. |
| **Loans & free agents** | Loan in (wage share + optional fee), loan out (offers from AI clubs), AI development loans; loans end at season end. Transfers and loans happen only while the window is open; free agents sign any time for a signing-on bonus. |
| **Post-match** | Summary, analyst insights (xG verdict, chance sources, half comparison, impact of your tactical change, fatigue, pressing), shot map, xG race, chance-type table, per-player stats, ratings, shape. |
| **Matchday** | Captain choice (armband boost, Leader effects), penalty / free-kick / corner takers used by the engine, pre-match team talk with the assistant's pick, weekly matchday digest in the feed. Pressure before a match (an opponent in form, a full house away) weighs on nervy players; shouts in a live match (Push up, Hold shape, Get stuck in, Calm down, Concentrate, Encourage, Slow it down) for a few minutes at a time. |
| **The world remembers** | Club records and record-breaking news (club, all-time, world transfer), all-time head-to-heads, rivalries that emerge from knockouts and red cards and cool if not fed, Player of the Month, injury histories, transfer fees on career timelines, managers who move between clubs, stadium histories, World News filters. |
| **Saves & platform** | Installable offline web app; saves upgrade automatically between versions; compressed backup export/import; matchday simulation in a Web Worker; autosave when backgrounded; back button, safe areas, haptics and share sheet; Capacitor projects for Android and iOS. |
| **Editing** | A world editor for leagues, clubs, players, cups, national teams (which nations have one) and whole nations, with drafts saved as you go. In a career in progress, Settings → Edit the world fixes one player or club, or changes many at once (players, clubs, prize money, youth ratings); it can be switched off. |
| **UI** | Mobile-first, swipe between tabs, bottom sheets, dark/light theme, money in your club's currency, tap any club badge for its overview. |
| **Recent (playtest feedback)** | Sim forward, expansion drafts, starting loans, prospect management, exact-position scouting, nation youth ratings, bulk editing, a nation creator, names of their own for more than thirty nations, realistic player histories, pounds by default, colour-blind kits and reduced motion; before them wide midfielders, real transfer flows, a coefficient world ranking, the real rules of each competition, transfer-window and deadline-day detail, pre-contracts, full bid negotiation, twelve formations, weather, following clubs and players, and B teams and youth sides. Details in [docs/ROADMAP.md](docs/ROADMAP.md). |

## Code map

```
Core and data
js/core.js        utilities, namespace, save version
js/data.js        nations, leagues, traits, formations, roles, scouting phrases
js/clubs.js       every league's clubs (B teams name their parent), rivalries
js/expansion.js   ready-made clubs for expansion drafts in closed leagues (tools/expansionpool.mjs)
js/names.js       name pools, demographics and heritage (names-more*.js, nations.js: more cultures and nations)
js/geo.js         a place for every club (tools/geocode.mjs); js/lore.js: distances, away trips, club details, rivalries, histories
js/clubguide.js   difficulty, hooks, tags and suggestions for the club picker (before a world exists)

The world and the season
js/world.js       world generation, player model, XI selection, competitions, calendar
js/season.js      matchday loop, finances, facilities, season end, expansion drafts, sim forward
js/careers.js     development curve, career arcs, youth intake and nations' youth ratings, retirement, AI renewals
js/cups.js        domestic knockouts, continental groups and knockouts, the Intercontinental Cup, the World Club Championship
js/regional.js    the Brazilian state championships
js/intl.js        national teams, coefficient ranking, qualifiers, summer finals, national team jobs
js/tiers.js       light and minimal simulation tiers
js/youth.js       B teams, U21 and U18 sides, youth leagues
js/draft.js       the American league's college draft
js/asia.js        Korea's military service (AFC places are in registration.js, Gulf money in transfers.js)

Clubs, players and money
js/transfers.js   transfer market: prices, loans, offers, AI windows, bids for your players
js/market.js      deadline day, trials, loan watch, fee talks, instalments, pre-contracts
js/contracts.js   agents, contract clauses, negotiation model, release clauses, bonuses
js/registration.js each league's foreign-player and squad rules, the MLS salary budget, signing policies
js/finance.js     revenue by country, attendance, wage pressure, administration; js/failure.js: administration, embargo, liquidation and phoenix clubs
js/scouting.js    scouting assignments (by region, league, group or exact position), knowledge and reports
js/training.js    training focus, intensity and individual training
js/injuries.js    injury catalogue and risk model, training injuries, recovery, medical decisions
js/people.js      player talks and promises, meetings, board, coaching licences
js/board.js       board demands and meetings
js/mstyle.js      the manager's discovered profile and standing by country
js/advice.js      assistant notes, scout picks, season preview, staff market
js/analytics.js   match log and league comparison for the Analytics tab
js/stories.js     news feed, story cards, living-world events; js/media.js: the five outlets
js/records.js     club records, head-to-heads, rivalry heat, Player of the Month, injury history, stadiums

The match
js/engine.js      match engine (aggregate and away goals), commentary, tactical prompts
js/matchday.js    captain, set-piece takers, pressure, pre-match team talk, digest
js/matchmotion.js fluid on-pitch movement for the live match
js/matchview.js   live pitch renderer and post-match analysis
js/carries.js, movement.js, passes.js, setpieces.js, shapes.js, shots.js, layouts.js, refstats.js
                  tables generated from open football data (their headers name the source and the tool)

World data and the editor
js/worlddef.js    the world as data: definitions, validation, patches to the game's clubs and leagues
js/dbimport.js    database import: adapters, staging, building a world from a file, export
js/histimport.js  the historical CSV tables adapter; js/csvworld.js: a world as leagues.csv, clubs.csv and players.csv; js/realstats.js: real statistics to attributes
js/ui-editor.js   the world editor (from the new-career screen); js/ui-live.js: editing the world you play (Settings)

Interface and platform
js/ui-core.js     shell, components, sheets, navigation, title and new-career flow
js/ui-screens.js  main tabs, player card, tactics, scouting, league, club, Settings; js/ui-help.js: help, backups, the season review
js/ui-extra.js, ui-alpha.js, ui-market.js, ui-training.js, ui-youth.js, ui-follow.js, ui-lore.js, ui-access.js
                  further screens: previews, negotiation and boardroom, market depth, training and analytics, academy, following, lore cards, accessibility
js/save.js        save format, migrations, storage backends (files / IndexedDB), backup export and import
js/simrun.js      runs the matchday simulation in a Web Worker (js/sim-worker.js) with a progress overlay
js/native.js      Capacitor plugins with web fallbacks, back button, background autosave, boot
js/changelog.js   "What's new" (with docs/CHANGELOG.md, generated from docs/ROADMAP.md by tools/changelog.mjs)

tools/            namegen, namelib*, worldgen, renameclubs, renick, expansionpool (the world's names and clubs);
                  sim-test, calibrate, regens, suite and the other checks, all on harness.mjs (the seeded loader); build.mjs (production build)
```

## Not yet built (next candidates)

See [docs/ROADMAP.md](docs/ROADMAP.md). Next is the platform batch of playtest feedback, then Alpha 2: the rest of the world editor (zones, conferences and two-tournament formats as choices), historical eras and scenarios, the youth pathway, player and manager career histories, relationships, deeper economics and database export and import. The living-world backlog follows (Football World screen, club philosophy, deeper staff, tactical evolution, agents, media); device builds come before Beta.
