# Touchline

A mobile football manager: a deep management sim for phones. Plain JavaScript, no framework, shared on `window.FM`; offline-first; wrapped with Capacitor for Android and iOS.

## Where things are

- `js/` game code (simulation: `engine.js`, `season.js`, `intl.js`, `cups.js`, `world.js` ...; screens: `js/ui-*.js`). Data: `js/data.js`, `js/clubs.js`, `js/nations.js`.
- `css/app.css`, `index.html`, `sw.js` (offline cache: bump `CACHE` when files change).
- `tools/` build, tests and checks (see `package.json`). `docs/` ROADMAP, FEATURES, README, GAME_DESIGN_DOCUMENT, CHANGELOG (the changelog is generated: `node tools/changelog.mjs`).

## Before a push

Run the deploy gate: `npm run lint && npm run format:check && npm run typecheck && npm run test:unit && npm run test:saves && npm run check:escape && npm run build && npm run test:smoke`. A failing gate silently stops the site deploying. After pushing, check `gh run list --limit 1`.

## Working agreements

- Docs travel with the code: add a bullet to `docs/ROADMAP.md`, keep `docs/FEATURES.md` (the "yet to be added" count too), then `node tools/docsync.mjs --mark`. The Claude Docs copies are mirrored when asked.
- Commit and push only when asked.
- No emoji in the interface except nation flags. Phone first: 44px tap targets, readable text.
- Escape every user-entered or generated name in markup (`esc()`); use `U.plural` for counts before plural words.
- Tools that take minutes (editor check, competition check) are slow on this machine; run one at a time.

## Game studio helpers

`.claude/` holds a subset of [Claude Code Game Studios](https://github.com/donchitos/claude-code-game-studios) (MIT, see `.claude/THIRD-PARTY-LICENSE-ccgs.txt`): review and QA skills, agent roles and document templates. Read `.claude/STUDIO.md` for what is there and how to use it. Project settings for those skills are in `project.yaml` and `.claude/docs/technical-preferences.md`.
