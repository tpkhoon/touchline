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
| 02 Leagues | 139 leagues: clubs, rounds, splits, tournaments, play-offs, promotion and relegation, B teams, youth rules | **Started.** Leagues with the right club count and a plain triple or quadruple round-robin now play it (16 leagues: Albania, Armenia, Azerbaijan, Croatia, Estonia, Georgia, Ireland, Kosovo, Latvia, Lithuania, Montenegro, Slovenia 36 matches; Canada 28; Hungary 33; Kuwait 27; Australia 26). Left: 45 leagues whose club count differs (40 need more clubs, 5 fewer), the split and tournament formats, the pro/rel play-offs (43 real, 5 in the game), B teams and youth rules. |
| 03 Domestic cups | 117 cups: entrants, legs, replays, finals | Not started |
| 04 Continental club | 30 continental and regional club competitions | Not started |
| 05 International | 33 national-team tournaments | Not started |
| 06 Regional | 40 regional competition rows | Not started |
| 07 Cross-border clubs | Clubs in another nation's league (Monaco, Welsh clubs in England ...) | **Done as far as the engine allows** (November 2026): 15 clubs renamed in their home nation's style and set in the host league; 12 keep their home nation (four Welsh clubs in England's three divisions below the top, a Northern Ireland club in the Irish league, the English-based club in Wales, three Canadian clubs in the American league, two New Zealand clubs in Australia, the Japanese satellite in Singapore); the 3 whose home is not a nation of the game (the principality in France, the mountain principality in Spain, the Bornean sultanate in Malaysia) keep the host's nationality. Left: the real clubs also enter the host's cups (see below) |
| 08 Cross-nation leagues | MLS, A-League, OFC Pro League and past ones | **Done**: MLS and the A-League through the cross-border clubs above; the OFC Pro League added (eight clubs, one from each of seven Oceania nations and an Australian one; double round-robin; its play-off groups and finals left); the past leagues (Royal League, Baltic League, African Football League, BeNe League, Soviet, Yugoslav and Czechoslovak leagues) are listed on the Cups screen under Past |
| 09 Cross-nation cups | Active and historical cups and super cups | **Done except the regional club cups**: the Leagues Cup (a summer knockout of six American and six Mexican clubs) and the Campeones Cup (the American champion against the Mexican one, a single match) added; the historical cups are listed under Past; the national cups with foreign clubs follow the engine's rule that a club plays its own nation's cup |
| 10 Fictional in Touchline | Competitions with no real equivalent | Reference only |
| 11 Youth tournaments and cups | National-team and club youth competitions | **Done by results** (November 2026): 26 national-team tournaments and 17 club youth cups, played once a season as it ends from the strength of the young players, with winners kept on the Cups screen under Youth. Left: the two school tournaments (Japan, Korea: the game has no school sides), qualifying (the field is a confederation's strongest nations), matches you can play or watch, the Under-23 over-age players |
| 12 to 14 Second, third and fourth tiers | Real divisions below the top flight | **Done as single tables** (November 2026): 47 more second divisions (54 listed, 7 were there), 34 more third (37, 3 were there) and 32 more fourth (33, 1 was there), 113 divisions of fictional clubs (1,702 clubs) in the minimal tier, each linked to the division above by promotion and relegation. Left: regional groups (a real division of three or more groups is one table of a group's size), the zones and tournaments of Argentina and Colombia, and the cross-division play-offs of more than one tie (see below) |
| 15 Qualifying | How teams qualify for tournaments, clubs' cups and domestic cups | Not started |
| 16 Tie rules | Legs, extra time, penalties, replays, finals | Not started |
| 17 International calendar | FIFA windows 2026 to 2030 | Not started (the game has three breaks) |
| 18 Guest nations | Tournaments that invite outside nations | Not started |
| 19 World Cup qualifying | Every stage of each confederation's qualifying | Not started |

## What the engine can and cannot do today

- **Fixtures:** a league plays a double round-robin by default. `rules.rounds` now sets any number of matches: fewer than
  a double round-robin (as before) or more, by playing the round-robin again (triple and quadruple). Not yet with a split,
  zones or conferences.
- **After the regular season:** `split` (groups that play again, points kept or halved), `torneos` (Apertura and Clausura),
  `zones`, `conferences` and `playoffs` of four built-in kinds (`finals6`, `liguilla`, `zones`, MLS). A title play-off is
  four single-match stages at most. A generic "top N knockout" with byes and two legs would unlock most of the Apertura
  and Clausura rows in the sheet and is the next engine piece.
- **Club counts:** a league is as large as its club list; changing it means writing fictional clubs (`js/clubs.js`,
  `tools/newleagues.mjs`) or removing some.
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

## Left to do

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
