# Game Pillars: Touchline

## Document Status
- **Version**: 1.0
- **Last Updated**: 2026-10-24
- **Approved By**: creative-director (pending)
- **Status**: Draft, written from `docs/GAME_DESIGN_DOCUMENT.md` (Design pillars, Vision and positioning)

---

## Core Fantasy

> You manage a football club for decades on your phone, and the world around it lives: media, fans, rivals, players with personalities and a history that remembers every legend and trophy your save creates. It feels like living inside the football world, not managing a database.

The promise is the one in the Game Design Document: losing a derby should produce angry fans, a headline, a dressing-room conversation and social-media buzz, on a screen you can read in seconds.

---

## Target MDA Aesthetics

| Rank | Aesthetic | How Our Game Delivers It |
| ---- | ---- | ---- |
| 1 | Fantasy | Running a club in a believable world: identity, board, staff, finances, a career that outlives clubs |
| 2 | Narrative | The story feed, headlines, rivalries that emerge and cool, legends and the Archive; stories are emergent, not scripted |
| 3 | Challenge | Squad building under money, wages and registration rules; real competition formats |
| 4 | Discovery | Scouting reports, regens, an unfamiliar world of 117 nations to explore |
| 5 | Expression | The world editor, databases and packs people share |
| N/A | Fellowship, Submission, Sensation | Single-player and offline; no multiplayer. Sensation is served only as touch comfort |

---

## The Pillars

### Pillar 1: Global

**One-Sentence Definition**: Every major footballing nation exists and plays by its own rules, simulated in tiers so the whole world fits on a phone.

**Target Aesthetics Served**: Fantasy, Discovery

**Design Test**: Choosing between a polished feature for the player's league and the same feature working for every league, we choose the one that works everywhere (full, light and minimal tiers), unless it cannot be made to run on a phone.

#### What This Means for Each Department

| Department | This Pillar Says... | Example |
| ---- | ---- | ---- |
| **Game Design** | Each competition uses its real format and registration rules | `docs/COMPETITION_RULES.md`: the American league's salary budget and Designated Players, the English squad list |
| **Art** | Flags, kits and crests are generated, not hand-drawn per club | Crest shapes, patterns and emblems from a club's colours |
| **Audio** | Not applicable yet (no audio) | n/a |
| **Narrative** | Names and stories come from the nation | Name generators by nation and heritage; regional lore |
| **Engineering** | A league day must stay fast across 130+ leagues | Three simulation tiers; the player's league and neighbours always full |

#### Serving This Pillar
- A new nation arrives with its league, cup, national team and name set together.
- A rule from a real league (work permits, homegrown places) is implemented as that league's rule only.

#### Violating This Pillar
- A feature that only works in the top leagues of a few nations.
- A single global rule set that flattens how competitions differ.

---

### Pillar 2: Club depth

**One-Sentence Definition**: A club is an identity with fans, facilities, staff, finances and a board, and these push back on what the manager wants.

**Target Aesthetics Served**: Fantasy, Challenge

**Design Test**: When a system can be a single number or a set of linked consequences, we choose the linked consequences, provided each hop feeds another system (see `docs/SYSTEMS.md`, closed loops).

#### What This Means for Each Department

| Department | This Pillar Says... | Example |
| ---- | ---- | ---- |
| **Game Design** | Identity shapes board demands, budget, recruitment and revenue | Nine hops in the club identity loop |
| **Art** | A club's look comes from its identity | Kits and crests; theme colours follow the club |
| **Audio** | n/a | n/a |
| **Narrative** | Fans, press and board react to the club's situation | Press conferences, board meetings and ultimatums |
| **Engineering** | Money, morale and development are one connected model | The talent, results and human loops |

#### Serving This Pillar
- Facilities that change academy and training quality, paid for by results.
- A wage bill that the board freezes before the club goes into administration.

#### Violating This Pillar
- A system nothing reads (flavour with no consequence).
- A purchase that makes the club stronger with no cost or consequence.

---

### Pillar 3: Living world

**One-Sentence Definition**: The world moves without the player: clubs rise and fall, managers change jobs, rivalries form, and none of it is scripted.

**Target Aesthetics Served**: Narrative, Fantasy

**Design Test**: If an event can come from the simulation instead of a hand-written trigger, it comes from the simulation.

#### What This Means for Each Department

| Department | This Pillar Says... | Example |
| ---- | ---- | ---- |
| **Game Design** | AI clubs follow the same rules as the player | Transfers, contracts, registration and finances for AI clubs |
| **Art** | n/a | n/a |
| **Audio** | n/a | n/a |
| **Narrative** | Stories are found in results, not written for them | Rivalries that emerge and cool; record-breaking news |
| **Engineering** | Long saves stay fast and stable | Twenty-season soak checks (`npm run test:longrun`) |

#### Serving This Pillar
- Clubs that fail, are taken over or are replaced.
- Managers who move between clubs and carry their style.

#### Violating This Pillar
- A fixed storyline that fires on a date.
- An AI club given an advantage the player cannot have.

---

### Pillar 4: Mobile-first

**One-Sentence Definition**: Every screen is readable in seconds with a thumb, and a matchday fits in a few minutes.

**Target Aesthetics Served**: Fantasy, Submission (comfort)

**Design Test**: Choosing between a table of numbers and a card, a chart or a sentence, we choose the card, chart or sentence; the table stays one tap deeper.

#### What This Means for Each Department

| Department | This Pillar Says... | Example |
| ---- | ---- | ---- |
| **Game Design** | Decisions are few, clear and skippable | Staff handle routine work; Sim forward; Sim without stopping |
| **Art** | 44 px tap targets, readable text, no emoji in the interface except nation flags | `CLAUDE.md` working agreements |
| **Audio** | n/a | n/a |
| **Narrative** | Short cards and headlines, not long text | The story feed and shareable cards |
| **Engineering** | Offline-first, fast on mid-range phones | Web workers for simulation; installable offline app; Capacitor wrapper |

#### Serving This Pillar
- Radar charts and player cards in place of attribute tables.
- A sim button that stops only for what needs the manager.

#### Violating This Pillar
- A desktop-style dense table as the only view.
- A feature needing a keyboard or a hover.

---

### Pillar 5: Stories

**One-Sentence Definition**: The game's output is a history worth telling: shareable cards, an Archive and legends, with personality mattering more than ratings.

**Target Aesthetics Served**: Narrative, Expression

**Design Test**: When recording something costs a little memory or time, we record it if it could appear later in the Archive, a profile or a headline.

#### What This Means for Each Department

| Department | This Pillar Says... | Example |
| ---- | ---- | ---- |
| **Game Design** | Players are people with traits and a career, not an overall | Traits, personality, promises, the career timeline |
| **Art** | Cards made to be shared | Shareable story cards |
| **Audio** | n/a | n/a |
| **Narrative** | History is generated and kept | Records, Hall of Fame, club lore, past seasons |
| **Engineering** | Save size is not a constraint; keep the history | Every season and every club row kept (see the memory note on save size) |

#### Serving This Pillar
- A player page that lists every move, trophy and award.
- A record crowd with its year, like the record win.

#### Violating This Pillar
- Discarding history to keep saves small.
- A rating-only view of a player.

---

## Anti-Pillars (What This Game Is NOT)

- **NOT a pay-to-win or free-to-play game**: one purchase, offline, nothing sold makes a team stronger. It would compromise Stories and Club depth by making results about money.
- **NOT a desktop port**: it does not copy PC management screens; if a view only works at desktop size it moves out of the main flow.
- **NOT a licensed-database game**: it ships fictional clubs, leagues and players on the real structure; real names are left to packs people make themselves.
- **NOT a live-action 3D match game**: the match is a readable top-down view with moving dots, highlights and prompts, because depth lives in decisions, not graphics.
- **NOT an online or multiplayer game**: it is offline-first; sharing is through files and cards.

---

## Pillar Conflict Resolution

| Priority | Pillar | Rationale |
| ---- | ---- | ---- |
| 1 | Mobile-first | If it cannot be used on a phone it does not ship, whatever else it adds |
| 2 | Club depth | The management fantasy is the product |
| 3 | Living world | The world supplies the stories |
| 4 | Stories | Emerge from the three above |
| 5 | Global | Breadth is added as the tiers allow, never at the cost of speed |

**Resolution Process**:
1. Identify which pillars are in tension.
2. Use the priority order above.
3. If the lower pillar can be served partly (a nation simulated in a lighter tier), do so.
4. Record the decision in the relevant section of `docs/GAME_DESIGN_DOCUMENT.md` and a bullet in `docs/ROADMAP.md`.

---

## Player Motivation Alignment

| Need | Which Pillar Serves It | How |
| ---- | ---- | ---- |
| **Autonomy** | Club depth | Tactics, transfers, contracts, facilities and the editor are the player's to decide |
| **Competence** | Club depth, Global | Visible consequences, reports, analytics and real competition rules reward learning |
| **Relatedness** | Stories, Living world | A club, players with personalities and rivals the player comes to care about |

**Gap check**: all three needs are served.

---

## Emotional Arc

### Session Emotional Arc

| Phase | Duration | Target Emotion | Pillar(s) Driving It | Mechanics Delivering It |
| ---- | ---- | ---- | ---- | ---- |
| Opening | 0-1 min | Anticipation | Stories | The home card: next match, the story feed |
| Rising | 1-5 min | Focus | Club depth | Team selection, tactics, a transfer or contract decision |
| Climax | 5-8 min | Tension, then relief or disappointment | Living world | The match: highlights, prompts, live xG |
| Resolution | 8-10 min | Reflection | Stories | Reports, headlines, fan and press reactions |
| Hook | End | Unfinished business | Living world | A rival's result, a bid, a young player nearing a breakthrough |

### Long-Term Emotional Progression

Early seasons are about survival and first signings; the middle of a career is about building a side and an academy; later seasons are about legacy (the Archive, legends who return as managers, the club's records).

---

## Reference Games

| Reference | What We Take From It | What We Do Differently | Which Pillar It Validates |
| ---- | ---- | ---- | ---- |
| Football Manager | Depth of scouting, tactics and contracts | Touch-first screens; a story feed instead of an inbox | Club depth |
| FM Mobile | A streamlined phone flow | The full world, not five nations | Mobile-first, Global |
| Crusader Kings | Emergent stories from simple systems | Football context | Living world, Stories |

**Non-game inspirations**: football journalism and club histories, almanacs of past seasons, supporters' fanzines.

---

## Pillar Validation Checklist

- [x] **Count**: five pillars
- [x] **Falsifiable**: each has a design test
- [x] **Constraining**: each rules out plausible features
- [ ] **Cross-departmental**: art and audio entries are thin (no audio yet)
- [x] **Design-tested**: a test per pillar
- [x] **Anti-pillars defined**: five
- [x] **Priority-ranked**
- [x] **MDA-aligned**
- [x] **SDT coverage**
- [x] **Memorable**: Global, Club depth, Living world, Mobile-first, Stories
- [x] **Core fantasy served**

---

## Next Steps

- [ ] Get pillar approval from creative-director
- [ ] Run each pillar's design test on the next three roadmap items
- [ ] Review after the next playtest round

---

*Written from the existing design document, which stays the source of truth; this file restates the pillars in the template's form. Review after major milestone changes.*
