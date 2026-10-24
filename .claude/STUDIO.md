# Studio helpers (from Claude Code Game Studios)

A subset of https://github.com/donchitos/claude-code-game-studios (commit 05ad7c8, MIT licence in `THIRD-PARTY-LICENSE-ccgs.txt`), copied in as it was and set up for Touchline. Nothing here runs by itself: there are no hooks, and `settings.json` is not copied. You call a skill by name, or ask for an agent.

## Skills (slash commands)

Review: `/design-review` (one design document), `/code-review` (a file or folder), `/ux-review` (a screen against the UX spec and accessibility), `/review-all-gdds` (all design documents together), `/consistency-check` (documents against each other), `/scope-check` (is a change growing), `/milestone-review`.

QA: `/qa-plan` (a test plan for a piece of work), `/team-qa` (the whole QA pass, with the QA agents), `/smoke-check` (the critical-path gate before QA), `/regression-suite`, `/test-evidence-review`, `/bug-report`, `/bug-triage`, `/playtest-report`, `/balance-check` (formulas and numbers).

Also: `/tech-debt`, `/estimate`, `/release-checklist` (agents use them).

UI and UX: `/ui-ux-pro-max` (from https://github.com/nextlevelbuilder/ui-ux-pro-max-skill, MIT, licence in the skill folder): a search over 119 UX guidelines, colour, type, chart and motion guidance, run with `python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain ux`. Meant for web and app interfaces; for Touchline use the `ux`, `chart`, `color`, `typography` and `motion` domains, not its landing-page design systems (see the note at the top of its SKILL.md).

## Agents (roles)

creative-director, game-designer, systems-designer, economy-designer, world-builder (the lore module only), ux-designer, accessibility-specialist, localization-lead, lead-programmer, technical-director, performance-analyst, producer, qa-lead, qa-tester. Ask for them by name ("have the economy designer look at the finance model") or let a skill call them.

## Templates

`.claude/docs/templates/` has about 50: game design document, economy model, test plan, test evidence, bug report, post-mortem, sprint plan, UX spec, HUD design, game pillars, systems index, release checklist, patch notes and more. The ones that did not fit (console, Steam and itch certification, art and sound bibles, level and faction design, boss-style difficulty curves, soak tests, the pitch deck and the player journey) were removed, and the engine examples in the architecture, technical design and interaction pattern templates now describe Touchline's stack. The interaction pattern library's section for inventory and health-bar patterns is left as it came. Skills write their output to `design/`, `production/` and `production/qa/`; those folders are created on first use.

## Settings

`project.yaml` is the framework's config. It ships with no `modes:` block, which means the lightest process (`minimal`): collaborative questions, no heavy gates. To get more process (reviews at each step, stricter QA), add a `modes:` block by hand; see `.claude/docs/config-resolution.md`. Touchline's stack and test commands are in `.claude/docs/technical-preferences.md`.

## Caveats

- The skills were written for engine projects (Godot, Unity, Unreal). Where one mentions an engine, scenes or a test framework, read it as the nearest thing here: the screens in `js/ui-*.js`, the `tools/*.mjs` checks. `/smoke-check` will not find an engine test runner; the real smoke test is `npm run test:smoke`.
- Skills and the config helper run through Bash and Python 3 (both present on this machine).
- Do not let a skill replace the deploy gate in `CLAUDE.md`.
