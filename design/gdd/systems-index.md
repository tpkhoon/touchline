# Systems Index: Touchline

> **Status**: Draft
> **Created**: 2026-10-24
> **Last Updated**: 2026-10-24
> **Source Concept**: `docs/GAME_DESIGN_DOCUMENT.md`; the code-derived map is `docs/SYSTEMS.md` (`npm run sysmap`)

---

## Overview

Touchline is a plain JavaScript football management simulation shared on `window.FM`. A career loops through scouting and signing, tactics, the match, reactions and stories, money and reputation, and investment in youth and facilities (see the core loop in the Game Design Document). The simulation modules run in a web worker; the screens are `js/ui-*.js`. This index lists the design systems, their status and their dependencies. For measured links between the code modules, read `docs/SYSTEMS.md`, which is generated; this file is the design view and is kept by hand.

All systems below are implemented in the prototype. "Status" is therefore a design-document status: Approved means the section in `docs/GAME_DESIGN_DOCUMENT.md` (or `docs/COMPETITION_RULES.md`) describes it and matches the code.

---

## Systems Enumeration

| # | System Name | Category | Priority | Status | Design Doc | Depends On |
|---|-------------|----------|----------|--------|------------|------------|
| 1 | Static data (nations, clubs, names, attributes) | Core | MVP | Implemented | GDD: Global database and competitions | — |
| 2 | World and players | Core | MVP | Implemented | GDD: Players and personalities | Static data |
| 3 | Season and calendar | Core | MVP | Implemented | GDD: Season preview and pre-season | World |
| 4 | Match engine | Gameplay | MVP | Implemented | GDD: Match engine | World, Tactics |
| 5 | Tactical system | Gameplay | MVP | Implemented | GDD: Tactical system | World |
| 6 | Competitions (leagues, cups, continental, national teams) | Gameplay | MVP | Implemented | `docs/COMPETITION_RULES.md` | Season, Match engine |
| 7 | Transfers and contracts | Economy | MVP | Implemented | GDD: Scouting and transfers | World, Finances, Registration |
| 8 | Registration rules (work permits, squad lists, salary budgets) | Gameplay | Vertical Slice | Implemented | `docs/COMPETITION_RULES.md` | Competitions, Transfers |
| 9 | Finances | Economy | MVP | Implemented | GDD: Club identity, facilities and staff | World, Competitions |
| 10 | Board and fans | Progression | Vertical Slice | Implemented | GDD: Club identity, facilities and staff | Finances, Season |
| 11 | Scouting | Gameplay | Vertical Slice | Implemented | GDD: Scouting and transfers | World, Transfers |
| 12 | Development and youth | Progression | Vertical Slice | Implemented | GDD: Youth development and university football | World, Season |
| 13 | Training | Progression | Vertical Slice | Implemented | GDD: Players and personalities | World |
| 14 | People and morale (promises, meetings, press) | Gameplay | Vertical Slice | Implemented | GDD: Players and personalities | World, Match engine |
| 15 | Injuries | Gameplay | Alpha | Implemented | GDD: Players and personalities | World |
| 16 | Stories and media | Narrative | Alpha | Implemented | GDD: Living world and football stories | World, Competitions |
| 17 | Records and archive | Progression | Alpha | Implemented | GDD: Legacy and history | World, Season |
| 18 | Club lore and history | Narrative | Alpha | Implemented | GDD: Legacy and history | Records |
| 19 | Career mode and manager identity | Progression | Alpha | Implemented | GDD: Career mode and manager identity | Board, Season |
| 20 | Advice and analytics | Meta | Alpha | Implemented | GDD: Club identity, facilities and staff | Match engine, World |
| 21 | Failure and takeover of clubs | Gameplay | Alpha | Implemented | GDD: Living world and football stories | Finances |
| 22 | Expansion clubs (closed leagues) | Gameplay | Alpha | Implemented | `docs/COMPETITION_RULES.md` | Competitions |
| 23 | World editor and databases | Meta | Alpha | Implemented | GDD: World editor and community sharing | Static data, World |
| 24 | In-game editor and bulk edits | Meta | Alpha | Implemented | GDD: World editor and community sharing | World editor |
| 25 | Simulation runner (web worker, sim forward, sim without stopping) | Core | MVP | Implemented | GDD: Mobile-first UX | Season |
| 26 | Persistence (saves, backups, upgrades) | Persistence | MVP | Implemented | GDD: Prototype status and roadmap | All state |
| 27 | Screens (`js/ui-*.js`) | UI | MVP | Implemented | GDD: Mobile-first UX | All systems |
| 28 | Platform (installable app, Capacitor wrapper, native files) | Meta | Alpha | Partly (device builds pending) | `docs/ROADMAP.md`: Mobile readiness | Persistence, Screens |
| 29 | Accessibility and settings | Meta | Alpha | Implemented | GDD: Mobile-first UX | Screens |
| 30 | Monetisation and cosmetics | Meta | Full Vision | Not Started | GDD: Monetisation and cosmetics | Platform |
| 31 | Historical eras and scenarios | Narrative | Full Vision | Not Started | GDD: Historical eras and scenarios | World editor |

---

## Categories

| Category | Description | Systems |
|----------|-------------|---------|
| **Core** | Foundations everything uses | 1, 2, 3, 25 |
| **Gameplay** | What the manager plays | 4, 5, 6, 8, 11, 14, 15, 21, 22 |
| **Progression** | How a career grows | 10, 12, 13, 17, 19 |
| **Economy** | Money and contracts | 7, 9 |
| **Persistence** | Saves | 26 |
| **UI** | What the player sees | 27 |
| **Narrative** | Stories and history | 16, 18, 31 |
| **Meta** | Tools, platform, settings | 20, 23, 24, 28, 29, 30 |

(Audio is not a category: the game has no audio yet.)

---

## Priority Tiers

| Tier | Definition | Target Milestone | Design Urgency |
|------|------------|------------------|----------------|
| **MVP** | The core loop works | Prototypes 1 to 3 (done) | Design first |
| **Vertical Slice** | A complete, deep club experience | Prototype 3 (done) | Design second |
| **Alpha** | Whole world and tools present | Alpha 1 (done), Alpha 2 (editor and history, in progress) | Design third |
| **Full Vision** | Eras, scenarios, store content | Beta and 1.0 | As needed |

---

## Dependency Map

### Foundation Layer (no dependencies)

1. Static data: every nation, club, name and attribute table starts here.

### Core Layer

1. World and players, depends on: Static data.
2. Season and calendar, depends on: World.
3. Simulation runner, depends on: Season.
4. Persistence, depends on: all state.

### Feature Layer

1. Match engine and Tactical system, depends on: World.
2. Competitions and Registration rules, depends on: Season, Match engine.
3. Transfers and contracts, Finances, Board and fans, depends on: World, Competitions.
4. Scouting, Development and youth, Training, People and morale, Injuries, depends on: World, Season.
5. Failure and takeover, Expansion clubs, depends on: Finances, Competitions.

### Presentation Layer

1. Stories and media, Records and archive, Club lore, Career mode, Advice and analytics, depends on: the feature layer.
2. Screens, depends on: everything above.

### Polish Layer

1. World editor and in-game editor, Platform, Accessibility, Monetisation, Eras and scenarios, depends on: everything.

---

## Circular Dependencies

- **Transfers and Finances**: fees move money and the budget limits fees. Resolved by one-way data flow per day: the transfer decision reads last settled budget; settlement writes after. Documented as the "talent economy" loop in `docs/SYSTEMS.md`.
- **Board and Finances**: results set board confidence, which sets the budget. Resolved the same way (the "results economy" loop).

---

## Recommended Design Order

Because every system above is implemented, the order matters for what is next:

| Order | System | Priority | Layer | Why Now |
|-------|--------|----------|-------|---------|
| 1 | In-game editor and bulk edits | Alpha | Polish | Alpha 2 work in progress |
| 2 | Platform (device builds) | Alpha | Polish | Blocks Beta |
| 3 | Historical eras and scenarios | Full Vision | Presentation | Planned after the editor and history modes |
| 4 | Monetisation and cosmetics | Full Vision | Polish | Needs the store build |

---

## High-Risk Systems

| System | Risk Type | Risk Description | Mitigation |
|--------|-----------|-----------------|------------|
| Simulation runner and Persistence | Technical | Long saves and 130+ leagues must stay fast on mid-range phones | `npm run test:longrun`, `test:suite`, tiered simulation, worker |
| Competitions and Registration | Design | Real rules are intricate and easy to get wrong | `docs/COMPETITION_RULES.md`, `npm run test:competitions` |
| In-game editor | Technical | Edits to a running world can break fixtures or squads | Applied through validated calls; formats wait for the new season |
| Match engine | Design | Balance drifts when anything touches ratings | `npm run calibrate`, `test:wonderkids` |

---

## Progress Tracker

| Metric | Count |
|--------|-------|
| Total systems identified | 31 |
| Implemented | 28 |
| Partly | 1 |
| Not started | 2 |

---

## Next Steps

- [ ] Add the Not Started systems to `docs/ROADMAP.md` as they are scheduled
- [ ] Re-run `npm run sysmap` when modules move, and update the table above
- [ ] Run `/consistency-check` against `docs/GAME_DESIGN_DOCUMENT.md`
