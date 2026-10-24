# Risk Register: Touchline

Filled from the template `.claude/docs/templates/risk-register-entry.md` and the "Open questions and risks" section of `docs/ROADMAP.md`. Scores: Probability times Impact. Last reviewed 2026-10-24.

| ID | Risk | Category | Score | Status | Trend |
|----|------|----------|-------|--------|-------|
| RISK-0001 | Naming and licensing | External | High | Mitigating | Stable |
| RISK-0002 | Performance on mid-range phones | Technical | High | Mitigating | Stable |
| RISK-0003 | Balance drifts when ratings change | Quality | Medium | Mitigating | Stable |
| RISK-0004 | Store review slows fixes | External | Medium | Open | Stable |
| RISK-0005 | Scope: editor and history modes are large | Schedule | Medium | Open | Increasing |
| RISK-0006 | Edits to a running world break it | Technical | Medium | Mitigating | Decreasing |
| RISK-0007 | Old saves fail to open after a change | Technical | Medium | Mitigating | Stable |

---

# Risk: Naming and licensing

## Identification
- **ID**: RISK-0001
- **Identified By**: project owner (round 8 decision)
- **Date Identified**: earlier (recorded in the roadmap)
- **Category**: External

## Assessment
- **Probability**: High (club, league and competition names are trademarks)
- **Impact**: Major
- **Risk Score**: High

## Description
Using real names in a shipped game could draw legal claims. The game ships fictional leagues, clubs, competitions and players on the real structure; a name generator blocks known real name combinations.

## Trigger Conditions
- A real name or likeness appears in shipped data or the repository
- A pack with real names is published from the game's own site

## Impact Analysis
### If This Risk Materializes
- **Schedule Impact**: weeks (removal and a store resubmission)
- **Quality Impact**: none
- **Scope Impact**: databases and packs
- **Cost Impact**: legal advice, a rebuild of data

### Affected Systems/Features
- Static data, name generators, World editor and databases, club data packs

## Mitigation Strategy
### Prevention
- Keep the names database and any real pack in a private folder outside the repository
- Block real name combinations in player generation
### Contingency
- Strip the data and ship a fictional build; owner: project owner

## Current Status
- **Status**: Mitigating
- **Last Reviewed**: 2026-10-24
- **Trend**: Stable
- **Notes**: Real names are left to packs people make themselves.

---

# Risk: Performance on mid-range phones

## Identification
- **ID**: RISK-0002
- **Identified By**: roadmap
- **Date Identified**: earlier
- **Category**: Technical

## Assessment
- **Probability**: High (about 34,000 players and 130+ leagues)
- **Impact**: Major
- **Risk Score**: High

## Description
A league day takes about 0.7 to 1.4 s in Node. A phone is slower, and a long save grows. Slow days make Sim forward unpleasant and could crash small devices.

## Trigger Conditions
- A simulated day over a few seconds on a test phone
- Memory warnings or the app reloading mid-sim

## Impact Analysis
### If This Risk Materializes
- **Schedule Impact**: weeks of optimisation before Beta
- **Quality Impact**: poor first impressions in store reviews
- **Scope Impact**: fewer fully simulated leagues by default
- **Cost Impact**: engineering time

### Affected Systems/Features
- Simulation runner, Persistence, Competitions (simulation tiers)

## Mitigation Strategy
### Prevention
- Three simulation tiers; the player's league and neighbours always full
- Simulation in a web worker; compact player format; time per day tracked by `npm run test:longrun`
### Contingency
- Lower the default tier of far leagues; owner: project owner

## Current Status
- **Status**: Mitigating
- **Last Reviewed**: 2026-10-24
- **Trend**: Stable
- **Notes**: Save size is not a constraint for a downloadable app; watch simulation speed only.

---

# Risk: Balance drifts when ratings change

## Identification
- **ID**: RISK-0003
- **Identified By**: roadmap
- **Date Identified**: earlier
- **Category**: Quality

## Assessment
- **Probability**: Medium
- **Impact**: Moderate
- **Risk Score**: Medium

## Description
Calibration is 49 of 50 in range on a three-season run (the miss: champions were a top-3 club 67% of the time against 70 to 90%). Finances and difficulty still need tuning from playtests. A change to growth or attributes can move many results.

## Trigger Conditions
- `npm run calibrate` shows more than a couple of lines out of range
- Playtesters report an elite club improving too fast

## Impact Analysis
### If This Risk Materializes
- **Schedule Impact**: days per tuning pass
- **Quality Impact**: unrealistic careers
- **Scope Impact**: none
- **Cost Impact**: low

### Affected Systems/Features
- Match engine, Development and youth, Finances

## Mitigation Strategy
### Prevention
- Run `calibrate` and `test:wonderkids` after any rating change
### Contingency
- Revert the tuning constant; owner: project owner

## Current Status
- **Status**: Mitigating
- **Last Reviewed**: 2026-10-24
- **Trend**: Stable
- **Notes**: Ten-season wonderkid test is 8 of 8 in range.

---

# Risk: Store review slows fixes

## Identification
- **ID**: RISK-0004
- **Identified By**: roadmap
- **Date Identified**: earlier
- **Category**: External

## Assessment
- **Probability**: Medium
- **Impact**: Moderate
- **Risk Score**: Medium

## Description
JavaScript updates normally go through store review, so a broken release cannot be fixed at once. The web build is not affected.

## Trigger Conditions
- A defect found after a store release

## Impact Analysis
### If This Risk Materializes
- **Schedule Impact**: days to a week per fix
- **Quality Impact**: players on a bad build meanwhile
- **Scope Impact**: none
- **Cost Impact**: low

### Affected Systems/Features
- Platform

## Mitigation Strategy
### Prevention
- The full deploy gate, the release checklist and the save-compatibility check before submitting
### Contingency
- Ship a fix build with expedited review; keep the web build as a fallback; owner: project owner

## Current Status
- **Status**: Open
- **Last Reviewed**: 2026-10-24
- **Trend**: Stable
- **Notes**: Matters from the first store release.

---

# Risk: Scope of the editor and history modes

## Identification
- **ID**: RISK-0005
- **Identified By**: roadmap
- **Date Identified**: earlier
- **Category**: Schedule

## Assessment
- **Probability**: Medium
- **Impact**: Moderate
- **Risk Score**: Medium

## Description
The world editor (now also inside a career), databases, historical eras and scenarios are large. They may need to ship after 1.0.

## Trigger Conditions
- Editor work keeps displacing Beta items (device builds, store listing)

## Impact Analysis
### If This Risk Materializes
- **Schedule Impact**: weeks of delay to Beta
- **Quality Impact**: unfinished tools
- **Scope Impact**: eras and scenarios cut from 1.0
- **Cost Impact**: opportunity cost

### Affected Systems/Features
- World editor and databases, In-game editor, Historical eras and scenarios

## Mitigation Strategy
### Prevention
- Run `/scope-check` before adding editor features
### Contingency
- Move eras and scenarios to a post-launch update; owner: project owner

## Current Status
- **Status**: Open
- **Last Reviewed**: 2026-10-24
- **Trend**: Increasing
- **Notes**: Round 24 added the full editor inside a career.

---

# Risk: Edits to a running world break it

## Identification
- **ID**: RISK-0006
- **Identified By**: engineering review
- **Date Identified**: 2026-10-24
- **Category**: Technical

## Assessment
- **Probability**: Medium
- **Impact**: Moderate
- **Risk Score**: Medium

## Description
The in-game editors change a world that has fixtures, cups and squads already made. A format or squad change at the wrong moment could leave a competition inconsistent.

## Trigger Conditions
- A fixture list that no longer matches a league's rules
- A player with no club who is still in a squad list

## Impact Analysis
### If This Risk Materializes
- **Schedule Impact**: days
- **Quality Impact**: corrupted career
- **Scope Impact**: editor features
- **Cost Impact**: low

### Affected Systems/Features
- In-game editor and bulk edits, World editor, Competitions

## Mitigation Strategy
### Prevention
- Edits go through validated calls; league formats, cups and the calendar wait for the new season; additions that need a new world are refused
- The editor can be switched off for a career; a career made with it off has no editing or expansion
### Contingency
- Undo for the last bulk edit; players can restore a backup save; owner: project owner

## Current Status
- **Status**: Mitigating
- **Last Reviewed**: 2026-10-24
- **Trend**: Decreasing
- **Notes**: Applying a cup or calendar change on a live career is not yet tested.

---

# Risk: Old saves fail to open after a change

## Identification
- **ID**: RISK-0007
- **Identified By**: engineering review
- **Date Identified**: 2026-10-24
- **Category**: Technical

## Assessment
- **Probability**: Medium
- **Impact**: Major
- **Risk Score**: Medium

## Description
Every new field on a player, club or the state must have a default, or a long save will not open or will misbehave.

## Trigger Conditions
- `npm run test:saves` fails
- A playtester reports a save that will not load

## Impact Analysis
### If This Risk Materializes
- **Schedule Impact**: days
- **Quality Impact**: lost long saves, the worst outcome for this audience
- **Scope Impact**: none
- **Cost Impact**: trust

### Affected Systems/Features
- Persistence, every system that adds state

## Mitigation Strategy
### Prevention
- Save upgrades on load; `test:saves`; compressed backups
### Contingency
- Ship a repair on load for the broken field; owner: project owner

## Current Status
- **Status**: Mitigating
- **Last Reviewed**: 2026-10-24
- **Trend**: Stable
- **Notes**: None.
