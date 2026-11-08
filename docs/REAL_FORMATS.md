# Real competition formats: what the game follows and what is left

Source: `touchline-real-formats-2026-27.xlsx` (a first draft of how each competition works in real life at the start of
2026/27, drafted from general football knowledge, High / Medium / Low confidence per row, none yet checked source by
source). A tab-separated copy of every sheet is kept in `docs/real-formats/` (read it with a spreadsheet or `cat`); the
tool that made the copies is `tools/xlsx-dump.mjs` (unzip the .xlsx, then run the tool on the folder).

The game follows each row as closely as its engine allows. Where it cannot yet, the row is listed here with what it
needs. The sheet's own Touchline columns (clubs, matches per club, format) are the starting point for the differences.

## Status by sheet

| Sheet (file in `docs/real-formats/`) | What it covers | Status |
| --- | --- | --- |
| 02 Leagues | 139 leagues: clubs, rounds, splits, tournaments, play-offs, promotion and relegation, B teams, youth rules | **Done as far as the engine goes** (see "Leagues sheet" below). Club counts match the sheet in every league but Spain's third tier; the regular phase, splits, Apertura and Clausura play-offs, relegation play-offs against the division below (where the game has one), B teams and youth minimums follow the sheet. Left: Spain's third tier (two groups of 20), the pro/rel play-offs whose other division the game does not have, and a few low-confidence formats listed below. |
| 03 Domestic cups | 117 cups: entrants, legs, replays, finals | **Started.** Legs, neutral finals and extra-time rules follow the sheet for 24 cups (see below); every cup winner's continental place is read from the sheet (`D.CUP_PLACE`, 98 cups). Left: group-stage cups, entry rounds by division, replays, Mexico's cup that does not exist, irregular cups, the other national cups. |
| 04 Continental club | 30 continental and regional club competitions | **Started.** Final and knockout legs follow the sheet (North American and African Champions Cups single-match finals; Libertadores and Sudamericana extra time in the final only; two-legged finals in the Southeast Asian, Gulf and Central American cups; single matches in the Arab and East African cups). Left: the 36-club league phase, Asian league stage, qualifying rounds, Intercontinental Cup and Club World Cup details. |
| 05 International | 33 national-team tournaments | **Started.** Sizes already follow the sheet for the confederation finals; the Gold Cup takes a guest and the Copa América plays extra time in the final only. Left: the sizes of the regional nations cups, two-legged ASEAN knockouts, Olympic and Asian Games football. |
| 06 Regional | 40 regional competition rows | Reviewed, **no change**: the game's regional competitions are Brazil's state championships and generated regional cups, which stay as they are (the sheet lists them as fictional or partly fictional). Left: the Copa do Nordeste and Copa Verde, island and regional first stages (Cape Verde, New Zealand, India), real county, district and state cups. |
| 07 Cross-border clubs | Clubs in another nation's league (Monaco, Welsh clubs in England ...) | **Done as far as the engine allows** (November 2026): 15 clubs renamed in their home nation's style and set in the host league; 12 keep their home nation (four Welsh clubs in England's three divisions below the top, a Northern Ireland club in the Irish league, the English-based club in Wales, three Canadian clubs in the American league, two New Zealand clubs in Australia, the Japanese satellite in Singapore); the 3 whose home is not a nation of the game (the principality in France, the mountain principality in Spain, the Bornean sultanate in Malaysia) keep the host's nationality. Left: the real clubs also enter the host's cups (see below) |
| 08 Cross-nation leagues | MLS, A-League, OFC Pro League and past ones | **Done**: MLS and the A-League through the cross-border clubs above; the OFC Pro League added (eight clubs, one from each of seven Oceania nations and an Australian one; double round-robin; its play-off groups and finals left); the past leagues (Royal League, Baltic League, African Football League, BeNe League, Soviet, Yugoslav and Czechoslovak leagues) are listed on the Cups screen under Past |
| 09 Cross-nation cups | Active and historical cups and super cups | **Done except the regional club cups**: the Leagues Cup (a summer knockout of six American and six Mexican clubs) and the Campeones Cup (the American champion against the Mexican one, a single match) added; the historical cups are listed under Past; the national cups with foreign clubs follow the engine's rule that a club plays its own nation's cup |
| 10 Fictional in Touchline | Competitions with no real equivalent | Reference only |
| 11 Youth tournaments and cups | National-team and club youth competitions | **Done by results** (November 2026): 26 national-team tournaments and 17 club youth cups, played once a season as it ends from the strength of the young players, with winners kept on the Cups screen under Youth. Left: the two school tournaments (Japan, Korea: the game has no school sides), qualifying (the field is a confederation's strongest nations), matches you can play or watch, the Under-23 over-age players |
| 12 to 14 Second, third and fourth tiers | Real divisions below the top flight | **Done as single tables** (November 2026): 47 more second divisions (54 listed, 7 were there), 34 more third (37, 3 were there) and 32 more fourth (33, 1 was there), 113 divisions of fictional clubs (1,702 clubs) in the minimal tier, each linked to the division above by promotion and relegation. Left: regional groups (a real division of three or more groups is one table of a group's size), the zones and tournaments of Argentina and Colombia, and the cross-division play-offs of more than one tie (see below) |
| 15 Qualifying | How teams qualify for tournaments, clubs' cups and domestic cups | **Partly followed already:** the World Championship, European, African, Asian, North American and Oceania places, the qualifying groups and the play-offs. Added: the winner of a domestic cup takes a continental place. Left: every row on qualifying rounds before a club cup's main stage, a nation's Nations League route, and the real domestic-cup entry rounds. |
| 16 Tie rules | Legs, extra time, penalties, replays, finals | **Started.** Engine support for straight-to-penalties by round (`etFrom`, `etFinalOnly`, `play.extraTime`), legs per round and neutral finals. No cup in the game has replays (the sheet lists them as abolished or "check"). |
| 17 International calendar | FIFA windows 2026 to 2030 | The game has three breaks of two matchdays (six in a season) against the sheet's four windows (4 + 2 + 2 + 2). Left: the extra window and the real dates. |
| 18 Guest nations | Tournaments that invite outside nations | **Started.** The Copa América already took six North American guests; the Gold Cup now takes one Asian guest, and the Southern African, East African and Central Asian cups take one outside nation each. Left: SAFF and the Gulf Cup (no guests in real life, as the sheet says for the Gulf), the CAF and CONMEBOL club guests. |
| 19 World Cup qualifying | Every stage of each confederation's qualifying | Places by confederation already match the sheet (16, 9, 8, 6, 6, 1 and two intercontinental places). Left: the confederations' own rounds (AFC five rounds, CAF play-off, CONCACAF rounds, OFC round 1), and the six 2030 hosts qualifying automatically (the editor takes up to four). |

## What the engine can and cannot do today

- **Fixtures:** a league plays a double round-robin by default. `rules.rounds` sets any number of rounds: fewer than a double
  round-robin, or more, by playing it again (triple and quadruple). Not with zones or conferences.
- **After the regular season:** `split` (groups that play again, points kept or halved), `torneos` (Apertura and Clausura, with or
  without a play-off), `zones`, `conferences` and `playoffs`: the four built-in kinds (`finals6`, `liguilla`, `zones`, MLS) and two
  generic ones: `ko` (the top n of a table, byes up to a whole bracket, one or two legs per round or for the final, once at the end
  or after each tournament) and `groups4` (cuadrangulares). A title play-off fits in four days (`M1` to `M4`, second legs `N1` to `N4`),
  so a knockout is at most sixteen clubs.
- **Relegation play-offs:** `relegate.playoff` against the division below (a number of ties); promotion play-offs inside a division
  (`promote.playoff`).
- **Club counts:** a league is as large as its club list; changing it means writing fictional clubs (`js/clubs.js`,
  `tools/newleagues.mjs`, `tools/realclubs.mjs`) or removing some.
- **Tiers below the top flight:** every nation on sheets 12 to 14 now has the divisions the sheets list, down to a fourth tier
  (England, Spain and Germany had theirs). Each is one table of fictional clubs, `tools/newtiers.mjs` makes them (the table of
  nations, club counts, promoted places and kinds is at the top of the tool). A real division of regional groups is one group
  of the group's size (Italy's Serie C is one table of 20, Spain's Primera Federación one of 20 ...), so the real count of
  clubs in a nation's tier is not matched; the group winners promoted become the places promoted from the one table.
  A promotion is one of four kinds: `a` the places only; `p` plus a play-off among the next four places (Japan's third tier,
  Poland's third, Chile's second); `t` plus one tie against the club above (a champion or runner-up against the top flight's
  relegation-play-off club: Czechia, Scotland, Switzerland ...); `c` a closed league with no promotion or relegation (the American
  and Mexican lower leagues). Rows that name two or three ties against the top flight (Czechia, Russia, Ukraine, Romania ...) play
  one. The Argentine zones and Reducido, the Colombian and Mexican tournaments (Apertura and Clausura with a liguilla) and the
  Romanian single round-robin with play-off and play-out groups are not played: those divisions are a double or single round-robin.
- **Cross-border clubs:** the engine's own cross-nation league form carries them: a league lists the nations whose clubs may play in it
  (`nats`), a club has its own nation (`D.CLUB_NAT`), and its players, foreign-player rules and national cup follow that nation
  (the league's own clubs keep the league's nationality mix). `tools/crossborder.mjs` renamed 15 clubs in their home nation's style.
  The clubs whose home is not a nation of the game keep the host's nationality (the table `D.CROSS_BORDER` says what each is). A club
  plays one national cup, its own nation's (Welsh clubs in England play the Welsh cup, not the English one).
- **Cross-nation leagues:** the Oceania Professional League (`OC1`, `tools/crossleague.mjs`) is a minimal-tier double round-robin of
  eight clubs from eight nations. Its central venues, play-off groups and finals are not played; it has no continental places.
- **Youth competitions:** `js/youthcomps.js` plays the sheet's youth tournaments and cups at the end of each season by results:
  entrants chosen as the real competition does as far as the game knows, seeded by the strength of their young players, groups
  and knockouts or a round-robin with goals from the strength gap. No matches are shown or played by you, there is no qualifying
  and no over-age players. Winners are kept in the save and listed on the Cups screen (Youth tab).

## Leagues sheet (02): what was done

- **Club counts:** every league now has the sheet's number of clubs except Spain's third tier. 145 fictional clubs were added in 39
  leagues (names, towns and grounds from the name library, reputation at the weak end of the league's band, `tools/realclubs.mjs`),
  and the weakest 8 went from Bosnia (2), Honduras (2), Moldova (2), Malaysia (1) and Singapore (1). Netherlands' second tier now holds
  four Jong teams (B teams of the four strongest Eredivisie clubs) and Portugal's two B teams, in place of their weakest clubs.
- **Regular phase:** each league's matches per club follow the sheet: triple and quadruple round-robins (`rules.rounds`), a short
  Panama and Uruguay tournament (`rounds` with `torneos` plays half the rounds in each tournament, the second with the home matches
  reversed), Belgium's plain 34 matches (its split was dropped: the 2026/27 play-offs are abolished).
- **Splits** (`rules.split`): Bulgaria (30, then 6 / 4 / 6), Cyprus and Israel (26, then 6 double / 8 single), Czechia (single rounds,
  6 / 4 / 6), Egypt (21 clubs once, then 7 / 14), Ecuador (30, then 6 / 5 / 5), Greece (26, then 4 / 4 / 6). Austria, Denmark, Finland,
  Iceland, Northern Ireland, Romania, Scotland, Serbia, Slovakia, Switzerland, Wales and South Korea already had theirs.
- **Apertura and Clausura** (`rules.torneos`), each with a champion: Colombia (single round-robin each, then cuadrangulares: the top
  eight in two groups of four, group winners in a two-legged final), Costa Rica (top 4, two legs), El Salvador (top 8, two legs, a
  single final), Guatemala (top 8, two legs), Honduras (top 4, two legs), Panama (top 4), Paraguay (no play-off: the leader of each
  tournament is its champion). Peru and Uruguay play one play-off at the end (`once`): the two tournament winners and the leaders of the
  season table, two legs, the best seed with a bye where there are three. Argentina has its 30 clubs (two zones of 15), Mexico is as it was.
- **Relegation play-offs against the division below** (`relegate.playoff`: `true` is one tie, a number is that many, each club further up
  the table meeting the next club of the lower division): Germany and France as before, and now Portugal (16th v Liga 2 3rd), Netherlands
  (16th v Eerste Divisie 3rd, in place of its promotion play-offs), Norway (14th v OBOS-ligaen 3rd), Sweden (14th v Superettan 3rd),
  South Korea (10th and 11th v K League 2 2nd and 3rd) and Vietnam (13th v V.League 2 2nd). 11 of the sheet's 43 play-offs have their
  other division in the game; the rest need a division the game does not have (Albania, Austria's, Belarus, Bulgaria, Croatia ...).
- **Youth and homegrown minimums** (`FM.Reg.RULES`, `youthMin` / `hgMin`): the "young player on the pitch / in the squad / minutes"
  rows are an under-21 (or under-23) minimum with the scope that fits (`pitch`, `xi`, `squad` or `registered`); Belgium joins England,
  Italy and Germany with a 25-man list of 8 homegrown; Portugal and Japan have a smaller homegrown minimum. They apply to a league whose
  rules are the real ones (`rules.reg === 'real'`).

### Left or simplified (leagues sheet)

- **Spain's third tier** has two groups of 20 in real life; the game has one division of 20. It needs a division with two tables.
- **Europe play-off knockouts** (Czechia 7th to 10th, Bulgaria, Greece) are small round-robins, not the real knockouts. Cyprus's, Israel's
  and Greece's rows are as the sheet gives them; their points-halving is the game's earlier setting where it had one.
- **Uruguay's Intermedio** (two groups of 8 between the two tournaments) is not played: 30 matches, the sheet says 37.
- **Costa Rica's grand final** between the two tournament champions when they differ, and the **points average** relegation of Argentina,
  Colombia, Paraguay and Uruguay, play out as ordinary relegation from the season's table.
- **Venezuela, Bolivia, Cameroon, DR Congo, Cape Verde, New Zealand, Moldova's second phase** (formats the sheet marks as varying or
  unclear) keep their plain league.
- **Closed leagues** (Australia, Canada, USA, India, Singapore, the Philippines) have no relegation, as before.
- **Play-offs with a division the game lacks** and **B teams by league** beyond Germany's third tier, Spain, the Netherlands and Portugal:
  the lower divisions are not in the game yet (see the second-to-fourth-tier sheets).
- **Cycles** (a 13-club league such as Malaysia has byes, a club that finishes level on points is split by the tiebreakers in
  `docs/COMPETITION_RULES.md`) are as before.

## Changes made from sheets 03 to 19 (November 2026)

**Domestic cups (03 and 16).** `legs` (two-legged rounds, by clubs left) now follows the sheet for Albania, Angola, Armenia,
Azerbaijan, Belarus, Belgium, Bosnia, Bulgaria, Canada (every round), Chile, Colombia (every round), Costa Rica, Cyprus, Denmark,
Malaysia, Moldova, Montenegro, North Macedonia, Singapore, Slovenia and Spain (two-legged semi-finals, as the sheet says; the
game had them single). Argentina and Brazil go straight to penalties in every round (`play.extraTime = false`); France plays extra
time from the round of 32 (`etFrom: 32`, unverified). New engine pieces: `etFrom` on a cup, `etFinalOnly` on a continental
cup, `Cups.noExtraTime(fx)` read by `Match.tieOpts`, and the clubs-left count `n` stored on each cup fixture. The rows marked
"check" in the sheet are applied as written.

**Cup winners' continental places (03).** `D.CUP_PLACE` maps each cup to the cup its winner joins (Europa League, Conference League,
Copa Libertadores, Sudamericana, the Asian and African second cups, the CONCACAF Champions Cup). At the season's end a winner
without a place takes the one of the lowest club of his nation in that cup; the number of places a league sends is unchanged.

**Continental cups (04).** North American and African Champions Cup finals are single matches; Libertadores and the South American
Shield play extra time in the final only (two-legged ties go to penalties); the Southeast Asian, Gulf and Central American Cups have
two-legged finals; the Arab and East African Cups single-match knockouts.

**International (05, 16, 18).** The Copa América (South American Nations Cup) has extra time in the final alone. The Gold Cup
(North American Nations Cup) invites one Asian nation (the fourth-best-ranked, `guests.skip: 3`), who leaves the Asian Nations Cup
that year; guest selection now works for any tournament with `guests`. The COSAFA, CECAFA and CAFA invitationals take one nation
from outside their pool (`outsiders`).

## Still to do from these sheets

- **League phase (04):** the 36-club European league phase (8 matches, play-off round), the AFC Elite West/East league stages,
  the Libertadores qualifying stages, the straight knockout of the CONCACAF Champions Cup. The game plays 16 clubs in four
  groups.
- **Domestic cups (03):** group-stage cups (Romania, Sweden, Turkey, Russia, Colombia, Kazakhstan, Uzbekistan, Singapore,
  Philippines, India, Bangladesh), entry rounds by division, replays (none in the game), Mexico's cup that the sheet says
  does not exist (the game keeps it), irregular cups, Italy's and Brazil's seeding.
- **Intercontinental and Club World Cup (04):** the six-team Intercontinental Cup and 2029 Club World Cup details.
- **International (05, 19):** sizes of the regional cups (ASEAN 10, Gulf 8 and the rest are four-team invitationals), two-legged
  ASEAN knockouts, the confederations' own qualifying rounds, six automatic hosts in 2030.
- **Calendar (17):** a fourth window (the game has three breaks of two matchdays) and real dates.

## Left to do (other sheets)

- Regional groups as real groups (sheet 02 owns the split and tournament formats; the lower divisions need them too).
- A division with several cross-division play-off ties, and the Argentine, Colombian and Mexican tournaments in the lower divisions.
- A club that plays its host nation's cup as well as its own (Welsh clubs in the FA Cup, Monaco's and Andorra's clubs in a cup of
  their own), and clubs from non-game nations (Monaco, Andorra, Brunei) with a nation of their own.
- The Oceania Professional League's staged rounds, play-off groups and finals; the regional club cups of sheet 09 as real fields.
- Youth: playable and watched matches, qualifying, the school tournaments of Japan and Korea, a youth cup that is the nation's
  open cup of 300 to 400 academies (the game has fewer clubs), the Under-23 over-age players.
- The past competitions are a reference list; they feed no generated history yet.

## Not checked

Every row is unverified. The sheet's yellow columns (Source, Last verified) are for you to fill in; when a row is checked,
change the game to match and update this file.
