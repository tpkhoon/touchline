# Technical Preferences

Touchline's own settings, filled in for the studio skills (they read this file for engine, platform, naming and testing).

## Engine & Language

- **Engine**: none. A plain browser app; the same code is wrapped for Android and iOS with Capacitor.
- **Language**: JavaScript (plain scripts, not modules), type-checked with `// @ts-check` and `jsconfig.json` (`npm run typecheck`).
- **Rendering**: DOM and CSS (`css/app.css`); small canvases for crests and charts. The live match has a text view (the pitch view is switched off).
- **Structure**: every script shares `window.FM`. Simulation scripts (listed in `js/simrun.js`, `index.html` and `sw.js`) also load in a Web Worker and in the Node test harness (`tools/harness.mjs`); UI scripts (`js/ui-*.js`) do not.

## Input & Platform

- **Target Platforms**: phones first (Android, iOS, installable web app), also any browser.
- **Input Methods**: touch.
- **Primary Input**: touch. Tap targets 44px, body text 13px or more, five bottom tabs.
- **Platform Notes**: one handed use, small Android screens, no hover; works offline (`sw.js`, bump `CACHE` when files change).

## Naming Conventions

- **Files**: lower-case, hyphenated (`ui-editor.js`, `matchview.js`).
- **Functions and variables**: camelCase; namespaces on `FM` (`FM.Season`, `FM.Intl`); ids are strings (`c_ELA` for clubs, `n_ENG` for national teams).
- **Constants**: UPPER_SNAKE (`MIN_POOL`).
- **Actions**: UI buttons use `data-act="name"` handled by `UI.acts.name`.

## Performance Budgets

- **Simulation**: a season day simulates in seconds; building a new world takes under a minute on a phone. Watch any change that adds work per player or per match.
- **Save size**: not a constraint (keep histories); simulation speed is.

## Testing

- **Framework**: Node scripts in `tools/` (no test runner). `npm run test:unit`, `test:saves`, `test:smoke`, `test:editor`, `test:cups`, `test:competitions`, and the screen crawl `test:crawl`.
- **Deploy gate** (what GitHub Pages runs, and what to run before every push): `npm run lint`, `format:check`, `typecheck`, `test:unit`, `test:saves`, `check:escape`, `build`, `test:smoke`.
- **Required Tests**: anything that changes the simulation or a save needs `test:saves`; world editor changes need `test:editor` (slow, about 4 to 10 minutes).

## Forbidden Patterns

- Putting a name, club or any user-entered value into markup without `esc()` (`npm run check:escape` fails it).
- A count written before a plural word without `U.plural` (the unit test fails it).
- Emoji in the interface, except nation flags.
- New simulation scripts that are not registered in `index.html`, `js/simrun.js` and `sw.js`.

## Allowed Libraries / Addons

- None at run time (no framework, no bundle). Dev tools only: ESLint, Prettier, TypeScript, Playwright (screen crawl), Capacitor.
