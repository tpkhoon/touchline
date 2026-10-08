# TOUCHLINE — mobile football manager (prototype)

**The deepest football management experience built for mobile. Your club. Your stories. Your history.**

Full design: [docs/GAME_DESIGN_DOCUMENT.md](docs/GAME_DESIGN_DOCUMENT.md) · [docs/SYSTEMS.md](docs/SYSTEMS.md) · [docs/ROADMAP.md](docs/ROADMAP.md) · [docs/FEATURES.md](docs/FEATURES.md) · [docs/COMPETITION_RULES.md](docs/COMPETITION_RULES.md) · [docs/NAMING_RULES.md](docs/NAMING_RULES.md).

A playable vertical slice: **746 fictional clubs in 42 leagues across 32 nations, in three simulation tiers**. The world is made up (clubs, towns, grounds, nicknames, leagues, cups and derbies all have invented names, and so do the players), but it keeps the real thing's structure: each nation's leagues at their real sizes, with real promotion and relegation, real cup and continental places, real registration rules and kit colours. Club identities and ratings are the game's own. (The real names are kept apart, in `data/real-world.json`, and can come back as an optional pack; see [The world and its names](#the-world-and-its-names).)

Leagues are described by nation and level here, since their names are generated:

- **Full:** England's top two divisions, and the top flights of Spain, Germany, France and Brazil.
- **Light:** England's third and fourth tiers, Spain's second and third, Germany's second and third, Italy's top two, France's second, and the top flights of Portugal, the Netherlands, Argentina, the USA, Japan and Saudi Arabia.
- **Minimal:** the top flights of Belgium, Turkey, Czechia, Greece, Norway, Poland, Denmark, Austria, Switzerland, Scotland, Serbia, Hungary, Ireland, Wales, Australia, Mexico, South Korea, Thailand, Nigeria and Morocco, and Saudi Arabia's second tier.

Your own league and the leagues just above and below it always run in the full engine.

Around the leagues: B teams and U21/U18 sides, twelve domestic cups, ten continental cups (a Champions Cup for each of Europe, South America, Asia, Africa and North America, with a second-tier Shield or Trophy in Europe, South America, Asia and Africa), a Club World Cup, international football with 90 national teams and qualifiers, a live match engine, and the story-driven world around it.

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
- There are 3 slots, with autosave after every matchday and whenever the app goes to the background.
- Older saves are upgraded automatically (the original is kept as a backup); only saves from before Alpha 1 can't be.
- Club → Settings exports a compressed `.touchline` backup and imports one (also from the title screen).

## Develop, test, build

The source runs as-is: no build is needed to play or develop. Node tooling (`npm install` once) adds the commands below.

| Command                                                                 | Purpose                                                                                                                                                  |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run serve`                                                         | Serve the folder on port 5173 (same as the `python -m http.server` above).                                                                                |
| `npm test`                                                              | Headless regression test: two seeded seasons plus invariants, save pack/unpack and migrations (about a minute).                                          |
| `npm run test:quick`                                                    | The same regression test over one season.                                                                                                                |
| `npm run calibrate`                                                     | Calibration report: three seeded seasons compared with real football, 49 measures.                                                                       |
| `npm run test:regens`                                                   | Regen test: academy intakes aged year by year, checked for realistic career shapes (about 20 seconds).                                                   |
| `npm run test:suite`                                                    | Wider suite: a manager plays every match for three seasons, checking speed, tables, squads, finances and world shape.                                    |
| `npm run test:long`                                                     | The wider suite over twenty seasons, without the speed limits.                                                                                           |
| `npm run test:wonderkids`                                               | Wonderkid test: ten seeded seasons following every high-potential prospect.                                                                              |
| `npm run test:realstats`                                                | Tests for the real-stats converter.                                                                                                                      |
| `npm run test:worlddef`                                                 | Tests for the world definition.                                                                                                                          |
| `npm run test:import`                                                   | Tests for the historical importer.                                                                                                                       |
| `npm run test:tactics`                                                  | Tactic-response test: a high press, a low block, build-up, width and the opponent's press must change possession, ball-winning, stamina and chances by type, and the post-match reading must name them. |
| `npm run test:longrun`                                                  | 30-year stability test: the world plays itself and the pecking order, upstarts, falls, dynasties and club bounds are checked (about 25 minutes). |
| `npm run sysmap`                                                        | Systems map: how each system uses the others, the closed loops checked hop by hop, and state nothing reads (writes docs/SYSTEMS.md). |
| `npm run test:dbimport`                                                 | Tests for the database import framework.          |
| `npm run import:history -- --dir data/samples/history --out world.json` | Run the historical importer on a folder of data.                                                                                                         |
| `npm run dev-tools`                                                     | Start the developer dashboard on http://localhost:5190.                                                                                                  |
| `npm run names -- --kind clubs --nat SCO --count 20 --seed 3`           | Name generator (`tools/namegen.mjs`): players, towns, clubs, grounds, nicknames, leagues and sponsors by nation and seed, flagging names that would be rejected. |
| `npm run docs:sync-status`                                              | List docs whose Claude Docs copy has changed since the last sync.                                                                                        |
| `npm run docs:synced`                                                   | Record the docs as synced (run it right after syncing).                                                                                                  |
| `npm run check:docs`                                                    | Check the headline numbers in the README and design document against the data.                                                                           |
| `npm run changelog`                                                     | Regenerate `js/changelog.js` (Settings → What's new) from the Shipped list in `docs/ROADMAP.md`.                                                          |
| `npm run lint`                                                          | ESLint.                                                                                                                                                  |
| `npm run format`                                                        | Prettier (`npm run format:check` only reports).                                                                                                          |
| `npm run build`                                                         | Minified production build in `dist/`.                                                                                                                    |
| `npm run serve:dist`                                                    | Preview the production build.                                                                                                                            |
| `npm run cap:sync`                                                      | Build and copy the web app into the Android and iOS projects.                                                                                            |
| `npm run android` / `npm run ios`                                       | Sync, then open the native project.                                                                                                                      |

### Regression test

`npm test` runs two seasons with a seeded RNG through the same code the app uses (including the Web Worker's JSON hand-off), then checks invariants, save pack/unpack and save migrations. It takes about a minute and exits non-zero on failure. `npm run test:quick` plays one season.

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

It takes about two minutes a season. In the app, the developer panel has the matching UI smoke test: it opens every tab, sub-tab and a sample of sheets and reports what threw or showed a broken value.

### Wonderkid test

`npm run test:wonderkids` runs ten seeded seasons, following every prospect of 19 or under with a potential of 85+, against what real football shows (how many reach world class, stall or flop, and when the best peak).

### Data tools

These serve the editor and club packs (`npm run test:realstats`, `test:worlddef`, `test:import`, `import:history`):

- **Real-stats converter:** `js/realstats.js`, command line `tools/realstats.mjs players.csv`. Turns a real player's numbers into attributes and ability.
- **World definition:** `js/worlddef.js`, command line `tools/worlddef.mjs --export world.json`. The world as data, apart from a save: export, validation, an editing API and loading onto a new world.
- **Historical importer:** `tools/import-history.mjs`. Reads season tables, player stats and club details into a definition through the converter; a synthetic sample is in `data/samples/history`.
- **Database import:** `js/dbimport.js` (`FM.DbImport`), `js/histimport.js` (the CSV adapter, also used by `tools/import-history.mjs`) and `tools/dbimport.mjs` (`--check file.json`, `--test`). The in-app way to start a career in a database of your own: adapters turn a file format into a world definition (`read`, `check`, `stage`, `build`, `export`), and the new-career screen's Database card runs it. A definition can add clubs and leagues, change the game's own and replace every player; the changes to the game's data are a small patch (`FM.WorldDef.patchOf`, `useStatic`) that the picker, the save and the simulation worker apply. Adapters: world-definition JSON (`node tools/worlddef.mjs --export`, or Settings → Database in the game) and historical CSV tables; more register with `FM.DbImport.register`.

### Name generator

`npm run names -- --kind clubs --nat SCO --count 20 --seed 3` (`tools/namegen.mjs`) generates names for players, towns, clubs, grounds, nicknames, leagues and sponsors by nation and seed. It flags names the world generator's checks would reject: rude, hard to say, too long, or close to a real town or club. The dashboard has the same thing as its Names tab.

### Lint and format

ESLint (`eslint.config.mjs`) catches undefined names and unused variables; Prettier (`.prettierrc.json`, 120 columns) formats the code. Run both before committing; `npm run format:check` only reports.

### Build

`npm run build` makes a minified production build in `dist/`: `sim.min.js` (engine, also loaded by the simulation worker) + `ui.min.js`, content-hashed URLs and a regenerated service worker. Preview it with `npm run serve:dist`.

## Developer dashboard

Run `npm run dev-tools` (after `npm install` once), then open http://localhost:5190. It listens on 127.0.0.1 only.

It is a local app (`tools/devserver.mjs`, page in `tools/dev/`) that is not part of the game. It runs the test suites, calibration, wonderkid and transfer tests, lint, docs check and build as jobs with live output and a result history in `.devtools/` (two runs of a job can be compared measure by measure). The tabs, by group:

| Group              | Tabs                                             | What they do                                                      |
| ------------------ | ------------------------------------------------ | ----------------------------------------------------------------- |
| Run and tune       | **Run**, **Gate**, **Trends**, **Seeds**, **Sweep** | Run the jobs and close the tuning loop (details below).           |
| Inside a world     | **World**, **Saves**                             | Browse and test a headless world; inspect save files.             |
| Data tools         | **Converter**, **Importer**, **Definitions**     | Real-stats data and world definitions.                            |
| Names              | **Names**                                        | The name generator, in a tab.                                     |
| Release and health | **Release**, **Profile**                         | Release checklist; CPU profiling.                                 |
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

### Game

**Game** shows the game in a frame with the in-game developer panel switched on. Open **Settings (⚙️) → Help → Developer tools** for the world check, market summary, wonderkid list, speed test, "play a season" (a season on a copy) and the UI smoke test. They run on a copy of your save and put the real one back.

`js/devtools.js` (the panel) is added to the game only inside the dashboard, never to `index.html`, the build, a built app or the Pages site.

## Docs syncing

The roadmap, feature list and design document have copies in Claude Docs, which cannot be read from here. `docs/SYNC.json` holds a hash of each at the moment it was last synced.

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

The game runs on a fictional world: the same 746 clubs, 42 leagues, cups and derbies as the real structure, with generated names.

- `data/real-world.json` holds the real structure and real names, keyed by club code (nation, league, kit colours, identity, rank, derbies). It is the source the fictional world is built from.
- `node tools/worldgen.mjs --seed 1 --out data/fictional-world.json` generates the fictional names from it: towns, clubs, grounds, nicknames, founding years, leagues, cups, sponsors and derbies, by each nation's naming conventions (`tools/namelib.mjs`, rules in [docs/NAMING_RULES.md](docs/NAMING_RULES.md)). It is deterministic from the seed.
- `node tools/realworld.mjs apply data/fictional-world.json` puts a names file into the game (`js/clubs.js` and `js/data.js`). Club codes and ids never change, so saves keep working. Applying `data/real-world.json` instead brings the real names back.
- The players are always fictional: names come from each nation's pools, with known real-name combinations blocked.
- Real club and league names are trademarks, so a store release ships the fictional set; real names are left to optional packs (a database import can carry them).

## What's in the slice

| Brief pillar | In the prototype |
|---|---|
| **Match engine** | Top-down pitch, 22 moving dots, visible pressing lines, ball carrier labels. Minute-by-minute sim; highlights slow down (~every 20–40s at 1×). Live xG, possession, momentum bars, 1×/2×/4× speed, instant result. |
| **Tactical prompts** | Analyst insights, chasing the game, protecting a lead, "pinned back", tired legs, injuries, red cards, half-time team talk (personalities react differently). Assistant has a personality and sometimes disagrees. |
| **Tactical depth** | 6 formations (back 3/4/5), build-up (Short/Direct/Counter/Possession), pressing (High/Mid/Low), inverted full-backs, roles (Segundo Volante, Carrilero, Mezzala, Inverted Winger, False 9, Libero…), each with engine effects. |
| **Players** | 1–20 attributes, star ratings measured against your own league (no overall numbers), family heritage and larger name pools, morale, wage, value, contract, form, traits (Big Game Player, Injury Prone, Late Bloomer, Loyal, Mercenary, Leader, Fair-Weather…), hidden attributes + personality. Radar, form chart, heat map, career history. Realistic career shapes (plus hidden arcs: wonderkids who flop, one-season wonders, early primes, long primes): fast growth in the teens, a peak around 27–29, decline through the thirties (pace first, reading of the game last); keepers and centre-backs age later, every player's clock runs a little early or late, and veterans wind down on one-year deals before retiring at ~33–35. Potential moves each summer until 25 (performance, game time, academy, injuries, luck); Basque and Catalan heritage. |
| **Scouting** | Scouts with regional strengths. Assignments by region or league, filtered by position, age, minimum potential, max fee and focus (undervalued / wonderkids / ready now). Reports are graded A–D, with a Sign / Loan / Monitor / Avoid recommendation, the scout's own words and gradual reveal of personality, injuries and hidden attributes. Target-versus-your-starter comparison. Nationality mixes per league are realistic (35 nations). Fees and wages use fine-grained steppers and exact input. |
| **Youth** | Annual intake shaped by academy level and nationality (Japan = technicians, Brazil = flair, Serbia = defenders, France = athletes). Development depends on age, training facilities, professionalism, minutes and Late Bloomer. U21 and U18 sides play national youth leagues; B teams in Spain and Germany (Castilla, Barça Atlètic, Stuttgart II, ...) play in the lower divisions, can never go up to their parent's division, and their players belong to the parent. |
| **Training & analytics** | Team focus (eight) and intensity (three), individual focus or a new position for any player: development, which attributes grow, training injuries, recovery, set pieces and familiarity. Analytics tab: your season's xG match by match, against the league, chance types, goal times and the analyst's reading. |
| **Competitions** | 42 leagues in three simulation tiers (your league and its neighbours always fully simulated) (full engine / light statistical model / minimal scores-only), promotion, relegation and playoffs, twelve domestic cups (seeded knockouts with byes, extra time and penalties). the European, South American, Asian, African and North American Champions Cups and their second-tier Shields and Trophy, all fed by data-driven rules, plus a mid-season Club World Cup for last season's finalists. Knockouts and playoff semi-finals can be two-legged, with an optional away-goals rule. |
| **Transfers** | Offers, counter-offers, loyal/ambitious refusals, windows, rumours, AI bids for your players. Contract packages: wage, length, squad status, signing-on fee, appearance and goal bonuses, release clause, yearly rise, relegation wage cut. Agents with personalities (Shark, Pragmatic, Family, Showman, Rookie) set demands, patience and fees; release clauses can be paid — by you or by rivals. International market, marquee raids, veterans abroad, Transfer Centre. AI clubs keep their squads moving: they replace their weakest starter (judging ageing players on where they're heading), buy from smaller clubs or at a premium from peers (never from a direct domestic rival), and sell the player who lost his place to a smaller club, so players climb the pyramid as they improve and slide down it as they fade. |
| **Club identity** | 746 fictional clubs in 42 leagues at their real sizes (invented names, towns, grounds, nicknames and derbies; the real kit colours and structure; the game's own ratings), each with an identity: Oil-Backed, Historic Giant, Fan-Owned, Youth-Focused, Selling Club, Fallen Giant. Board demands, fan culture, derbies. The two Spanish second-division clubs that follow Athletic Club's policy sign only Basque or only Catalan players (scouting included); Saudi Pro League and First Division, mostly Oil-Backed. Each club also has a market, supporters, a youth catchment and an owner, which set a ceiling its reputation cannot pass without a cause (a takeover, years of success); identity drives recruitment, what fans expect of your style, players' willingness, the board's patience and revenue. |
| **Stories** | Feed of newspaper headlines, fan social posts (with rival fans on derby day), press conferences with choices, dressing-room events. Instagram-style **shareable story cards** export as 1080×1350 PNG ("26-year-old Brazilian winger scores on debut"). |
| **Living world** | AI sackings, takeovers, administration and points deductions, stadium expansions, rule changes (subs, homegrown rules, TV deals), retirements, legends returning as managers. |
| **People** | One-to-one talks (praise, criticism, promises of minutes, a new contract, a debut, not being sold, or permission to leave). Promises are tracked, kept or broken, and move morale and squad trust. Players ask for meetings when unhappy or underpaid. Board meetings (transfer funds, owner-funded facilities, patience, a youth project), a mid-season review and five-game ultimatums. |
| **International** | 90 national teams, coefficient ranking, qualifying groups in the season before a tournament, two double-header breaks, and the summer finals played as calendar days. Take a national team job alongside your club: pick call-ups, set tactics, play the matches live; failing to qualify ends it. Coaching licences (B → A → Pro) unlock bigger jobs. Invitational tournaments in the windows (Kirin Cup, King's Cup, Nehru Cup). |
| **Career** | Create your manager: first and last name, country, favourite club and avatar (your country knows you; your boyhood club is a homecoming). Start with a club or start unemployed. Out of work (from the start or after a sacking), the world keeps playing and clubs in your reputation range make offers that come and go; a national team job carries on. The club picker gives every club a difficulty (Relaxed to Brutal), opens with three questions and three suggested clubs, shows each club's story and each league in a card, and the first season keeps introducing the world. A database (world-definition JSON or historical CSV tables) can replace the world: new clubs and leagues, renamed clubs, every player; Settings exports the world you play. Your manager profile is discovered, not picked (youth, attack, spending, stability, learned from what you do), boards, players and the job market react to it, and your standing is kept by country. |
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
| **UI** | Mobile-first, swipe between tabs, bottom sheets, dark/light theme, money in your club's currency, tap any club badge for its overview. |
| **Recent (playtest feedback)** | Four more leagues, wide midfielders, position versatility, real transfer flows, a coefficient world ranking, more cups and the real rules of each competition, club abbreviations and nicknames, stats compared with a player's position, contract cost tables and a past for every player; feed of your club with a Needs reply list and a daily transfer round-up; transfer-window rules and deadline day hour by hour; pre-contracts; full bid negotiation; Plan A/Plan B and twelve formations; weather and home advantage; keeper stats and season-by-season history; finances by country and wage pressure; following clubs, competitions, nations and players; training, analytics, B teams and youth sides. Details in [docs/ROADMAP.md](docs/ROADMAP.md). |

## Code map

```
js/core.js       utilities, namespace
js/data.js       nations, leagues, traits, formations, roles, scouting phrases
js/clubs.js      every league's clubs (B teams name their parent), rivalries
js/clubguide.js difficulty, hooks, tags and suggestions for the club picker (before a world exists)
js/names.js     name pools, demographics and heritage; js/nations.js: more cultures (Basque, Catalan, East Slavic ...)
js/world.js      world generation, player model, XI selection, competitions, calendar
js/worlddef.js  the world as data: definitions, validation, patches to the game's clubs and leagues
js/dbimport.js  database import: adapters, staging, building a world from a file, export
js/histimport.js the historical CSV tables adapter
js/realstats.js real statistics to attributes
js/draft.js     the American league's college draft
js/engine.js     match engine (incl. aggregate/away goals), commentary, tactical prompts
js/season.js     matchday loop, finances, facilities, season end
js/careers.js    development curve, career arcs, youth intake, retirement, AI renewals
js/cups.js       domestic knockouts, continental groups + (two-legged) knockouts, Club World Cup
js/intl.js       national teams, Elo, qualifiers, summer finals, national team jobs
js/tiers.js      light and minimal simulation tiers
js/contracts.js  agents, contract clauses, negotiation model, release clauses, bonuses
js/people.js     player talks and promises, meetings, board, coaching licences
js/mstyle.js    the manager's discovered profile and standing by country
js/advice.js     assistant notes, scout picks, season preview, staff market
js/matchmotion.js  fluid on-pitch movement for the live match
js/scouting.js   scouting knowledge and reports
js/transfers.js  transfer market: prices, loans, offers, AI windows, bids for your players
js/market.js     deadline day, trials, loan watch, fee talks, instalments, pre-contracts, transfer reactions
js/registration.js  each league's foreign-player and squad rules, the MLS salary budget, signing policies
js/finance.js    revenue by country, attendance, wage pressure, administration
js/youth.js      B teams, U21 and U18 sides, youth leagues
js/training.js   training focus, intensity and individual training
js/analytics.js  match log and league comparison for the Analytics tab
js/stories.js    news feed, story cards, living-world events
js/ui-*.js       shell, components, screens
js/matchview.js  live pitch renderer + post-match analysis
js/ui-alpha.js   negotiation, talks, boardroom, licences, national team screens
js/matchday.js   captain, set-piece takers, pressure before a match, pre-match team talk, why it went that way, matchday digest
js/records.js    club records, head-to-heads, rivalry heat, Player of the Month, injury history, manager moves, stadiums
js/injuries.js   injury catalogue and risk model, training injuries, recovery, medical decisions (surgery, risk him?)
js/save.js       save format, migrations, storage backends (files / IndexedDB), backup export/import
js/simrun.js     runs matchday simulation in the Web Worker (js/sim-worker.js) with a progress overlay
js/native.js     Capacitor plugins with web fallbacks, back button, background autosave, boot
tools/           namegen.mjs (name generator), sim-test.mjs (regression test), calibrate.mjs (realism report), regens.mjs (career-shape test), harness.mjs (seeded loader they share), build.mjs (production build)
```

## Not yet built (next candidates)

See [docs/ROADMAP.md](docs/ROADMAP.md). Next is the last playtest feedback batch (platform), then Alpha 2: the database and world editor, historical eras and scenarios, the youth pathway, player and manager career histories, relationships, deeper economics and database export/import. The Living world backlog follows (Football World screen, club philosophy, deeper staff, tactical evolution, agents, media); device builds come before Beta.
