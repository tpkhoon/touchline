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
| 02 Leagues | 139 leagues: clubs, rounds, splits, tournaments, play-offs, promotion and relegation, B teams, youth rules | **Done as far as the engine goes** (see "Leagues sheet" below). Club counts match the sheet in every league (Spain's third tier is now two groups of 20); the regular phase, splits, Apertura and Clausura play-offs, Uruguay's Intermedio, points-average relegation, Europe play-off knockouts, relegation play-offs against the division below (wherever the game has one), B teams and youth minimums follow the sheet. Left: a few low-confidence formats listed below. |
| 03 Domestic cups | 117 cups: entrants, legs, replays, finals | **Done as far as the engine allows** (November 2026). Legs, neutral finals and extra-time rules follow the sheet for 24 cups; group stages added for 11 cups (Romania, Sweden, Turkey, Russia, Colombia, Kazakhstan, Uzbekistan, Singapore, the Philippines, India, Bangladesh); late entry for the top divisions of England, France, Italy, Japan, Scotland and Spain; every cup winner's continental place is read from the sheet (`D.CUP_PLACE`, 98 cups). Mexico's cup is kept (see below). Left: qualifying rounds for amateur clubs, Chile's regional groups, Brazil's seeded pots, Finland's occasional group stage, Peru's and the other irregular cups. |
| 04 Continental club | 30 continental and regional club competitions | **Started, Europe done.** Final and knockout legs follow the sheet (North American and African Champions Cups single-match finals; Libertadores and Sudamericana extra time in the final only; two-legged finals in the Southeast Asian, Gulf and Central American cups; single matches in the Arab and East African cups). The Intercontinental Cup already follows the sheet (African and Asian champions open, the Americas meet, the European champion joins the final). The European Champions Cup, Shield and Trophy play the 36-club league phase with a knockout play-off and a round of 16 (November 2026, third pass). Left: the Asian West and East league stages, the straight CONCACAF knockout, the Club World Cup (see below). |
| 05 International | 33 national-team tournaments | **Done as far as the engine allows** (November 2026). Sizes already follow the sheet for the confederation finals; the Gold Cup takes a guest and the Copa América plays extra time in the final only; the Southeast Asian pool is all eleven ASEAN nations, the Gulf pool the eight Gulf federation members, the Central Asian pool the CAFA nations. Left: the sizes of the regional nations cups, two-legged ASEAN knockouts, Olympic and Asian Games football (see below). |
| 06 Regional | 40 regional competition rows | Reviewed, **no change**: the game's regional competitions are Brazil's state championships and generated regional cups, which stay as they are (the sheet lists them as fictional or partly fictional). Left: the Copa do Nordeste and Copa Verde, island and regional first stages (Cape Verde, New Zealand, India), real county, district and state cups (see below). |
| 07 Cross-border clubs | Clubs in another nation's league (Monaco, Welsh clubs in England ...) | **Done as far as the engine allows** (November 2026): 15 clubs renamed in their home nation's style and set in the host league; 12 keep their home nation (four Welsh clubs in England's three divisions below the top, a Northern Ireland club in the Irish league, the English-based club in Wales, three Canadian clubs in the American league, two New Zealand clubs in Australia, the Japanese satellite in Singapore); Andorra's and Brunei's clubs now have their own nations (both are nations of the game); only the principality in France keeps the host's nationality (Monaco is not a nation of the game). The clubs of the pyramid below also enter the host's cup (see below) |
| 08 Cross-nation leagues | MLS, A-League, OFC Pro League and past ones | **Done**: MLS and the A-League through the cross-border clubs above; the OFC Pro League added (eight clubs, one from each of seven Oceania nations and an Australian one; double round-robin, then two play-off groups of four and a final); the past leagues (Royal League, Baltic League, African Football League, BeNe League, Soviet, Yugoslav and Czechoslovak leagues) are listed on the Cups screen under Past |
| 09 Cross-nation cups | Active and historical cups and super cups | **Done**: the regional club cups (Southeast Asian, Gulf, Arab, East African, Central American, Atlantic) have the sheet's field sizes and groups; the Leagues Cup (a summer knockout of six American and six Mexican clubs) and the Campeones Cup (the American champion against the Mexican one, a single match) added; the historical cups are listed under Past; the national cups with foreign clubs: a cross-border club also enters the cup of the nation whose league it plays in (`D.CUP_HOSTS`), one tie a day |
| 10 Fictional in Touchline | Competitions with no real equivalent | Reference only |
| 11 Youth tournaments and cups | National-team and club youth competitions | **Done by results** (November 2026): 26 national-team tournaments, 17 club youth cups and the two school tournaments, played once a season as it ends from the strength of the young players, with qualifying for the national ones, three over-age players in the Olympic and Asian Games sides, the open cups topped up with non-league academies, and ten past editions made with a new world. Left: matches you can play or watch |
| 12 to 14 Second, third and fourth tiers | Real divisions below the top flight | **Done as single tables** (November 2026): 47 more second divisions (54 listed, 7 were there), 34 more third (37, 3 were there) and 32 more fourth (33, 1 was there), 113 divisions of fictional clubs (1,702 clubs) in the minimal tier, each linked to the division above by promotion and relegation. Then ten second tiers the sheet does not list (Albania to North Macedonia, 136 clubs) so their top flights could have the relegation play-off the leagues sheet gives. Left: regional groups (a real division of three or more groups is one table of a group's size), the zones and tournaments of Argentina and Colombia, and the cross-division play-offs of more than one tie (see below) |
| 15 Qualifying | How teams qualify for tournaments, clubs' cups and domestic cups | **Partly followed already:** the World Championship, European, African, Asian, North American and Oceania places, the qualifying groups and the play-offs. Added: the winner of a domestic cup takes a continental place. Left: every row on qualifying rounds before a club cup's main stage, a nation's Nations League route, and the real domestic-cup entry rounds. |
| 16 Tie rules | Legs, extra time, penalties, replays, finals | **Started.** Engine support for straight-to-penalties by round (`etFrom`, `etFinalOnly`, `play.extraTime`), legs per round and neutral finals. No cup in the game has replays (the sheet lists them as abolished or "check"). |
| 17 International calendar | FIFA windows 2026 to 2030 | **Done** (November 2026): four windows of 4 + 2 + 2 + 2 matchdays, each named for its real window on the calendar (September and October, November, March, June). Left: real dates (the game's season has no calendar dates for the breaks). |
| 18 Guest nations | Tournaments that invite outside nations | **Done.** The Copa América already took six North American guests; the Gold Cup takes one Asian guest, and the Southern African, East African and Central Asian cups take one outside nation each; the Gulf Cup takes none (its members are the eight Gulf federation nations, Iraq and Yemen included). The CONMEBOL club guests (Mexican clubs 1998 to 2016, Sudamericana mid-2000s) ended and are not in the game. |
| 19 World Cup qualifying | Every stage of each confederation's qualifying | **Started.** Places by confederation already match the sheet (16, 9, 8, 6, 6, 1 and two intercontinental places). Groups of up to four now play home and away (the sheet's group stages), over the first six matchdays of the new calendar; the six 2030 hosts (two European, one African, three South American) qualify automatically. Left: the confederations' own staged rounds (see below). |

## What the engine can and cannot do today

- **Fixtures:** a league plays a double round-robin by default. `rules.rounds` sets any number of rounds: fewer than a double
  round-robin, or more, by playing it again (triple and quadruple). Not with zones or conferences. `rules.pools` makes a division of
  separate tables (two groups, each its own double round-robin; places counted in each group). `rules.intermedio` puts a round-robin
  of two groups between two tournaments of a set length.
- **After the regular season:** `split` (groups that play again, points kept or halved), `torneos` (Apertura and Clausura, with or
  without a play-off), `zones`, `conferences` and `playoffs`: the four built-in kinds (`finals6`, `liguilla`, `zones`, MLS) and two
  generic ones: `ko` (the top n of a table, byes up to a whole bracket, one or two legs per round or for the final, once at the end
  or after each tournament) and `groups4` (cuadrangulares). A title play-off fits in four days (`M1` to `M4`, second legs `N1` to `N4`),
  so a knockout is at most sixteen clubs. With `europe: true` and `from` the knockout is played by the clubs from that rank on (a Europe
  play-off) and only orders them.
- **Relegation play-offs:** `relegate.playoff` against the division below (a number of ties); promotion play-offs inside a division
  (`promote.playoff`). `rules.average` relegates by points average over a number of seasons.
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
  Monaco's club is the one whose home is not a nation of the game, and that is intended, not a gap: Monaco is not a FIFA member, so
  it has no national team, no qualifying places and no confederation place, and its club keeps France's nationality
  (`D.CROSS_BORDER` says what each is). A club also enters the cup of the nation whose league it plays in (`D.CUP_HOSTS`: the Welsh clubs the English cup, the Irish
  league's Northern Irish club the Irish cup, the Canadian clubs the American cup ...), so it is in two cups; the calendar's
  cup days have two spare days, and a tie that would be the club's second match of a day waits for the next cup day
  (`Sea.oneMatchADay`). A winner of either cup takes the place the cup gives.
- **Cross-nation leagues:** the Oceania Professional League (`OC1`, `tools/crossleague.mjs`) is a minimal-tier double round-robin of
  eight clubs from eight nations, then the eight in two play-off groups of four and a final (`playoffs: groups4`). The rounds are
  not staged at central venues; it has no continental places.
- **Youth competitions:** `js/youthcomps.js` plays the sheet's youth tournaments and cups at the end of each season by results:
  entrants chosen as the real competition does as far as the game knows, seeded by the strength of their young players, groups
  and knockouts or a round-robin with goals from the strength gap. A confederation with more nations than finals places plays
  qualifying (the strongest quarter go through, the rest play groups of five); the Olympic and Asian Games sides add three
  over-age players from the nation's senior pool; the two school tournaments (Japan 48, Korea 64) use school sides that are only
  a name, a nation and a strength (`S.youthSides`); the open cups (England, France, Scotland, Brazil) are topped up with
  non-league academies to 128 or 64. No matches are shown or played by you. Winners are kept in the save and listed on the Cups
  screen (Youth tab); with a new world the last ten editions are made so the tab starts with honours.
- **Past competitions:** `D.PAST_GEN` says how each past competition that falls in the game's thirty-year past was won: with
  `W.seedHistory` it picks a winner and runner-up from the top-flight clubs of its nations or regions that were around then,
  keeps them in the season's archive entry (`entry.past`) and on the club (`club.pastTitles`, shown on the club's honours card
  under "Competitions that are over"). The ones that ended before the past begins (the Soviet, Yugoslav and Czechoslovak leagues,
  the Fairs and Latin Cups) stay on the Cups screen's Past tab alone.

## Leagues sheet (02): what was done

- **Club counts:** every league now has the sheet's number of clubs. 165 fictional clubs were added in 40 leagues (Spain's third tier
  grew from 20 to 40) (names, towns and grounds from the name library, reputation at the weak end of the league's band, `tools/realclubs.mjs`),
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
  South Korea (10th and 11th v K League 2 2nd and 3rd) and Vietnam (13th v V.League 2 2nd). The lower divisions added since (sheets 12
  to 14) made the rest possible: Belarus, Bulgaria, Kenya and Tanzania (one tie each), Romania (13th and 14th v Liga II 3rd and 4th),
  Czechia (14th and 15th v 2nd and 3rd), Russia and Ukraine (13th and 14th v 3rd and 4th), Sweden's second tier (13th and 14th v Ettan),
  Norway's second tier and Portugal's second tier (the 14th and 16th v a third-tier club). The lower division promotes the matching
  number of clubs by `promote.tie`.
- **The "check" rows:** France's Ligue 2 now sends its 16th into a two-legged play-off against the third tier's 3rd (the Championnat
  National promotes its top 2 and the play-off tie), and Japan's J2 promotes its top 2 and the winner of a play-off among 3rd to 6th
  (J1 relegates 3). Belgium: see "Left".
- **Ten new second tiers** (Albania, Bolivia, Estonia, Georgia, Kosovo, Latvia, Lithuania, Luxembourg, Montenegro, North Macedonia):
  sheet 12 does not list a second tier for them, so the sizes are the real divisions' as the author knows them, not the sheet's:
  16 clubs (Albania, Bolivia, Luxembourg, North Macedonia), 14 (Kosovo, Latvia), 12 (Lithuania, Montenegro), 10 (Estonia, Georgia, both
  four times round). Each is a minimal single table of fictional clubs (`tools/newtiers.mjs --only ...`), promotes its champion by a
  tie against the club above, and their top flights now play the relegation play-off the sheet gives: the 9th v the 2nd (Estonia,
  Latvia, Lithuania), a play-off against a second-tier club (Albania, Georgia, Kosovo, Luxembourg, North Macedonia, Bolivia) and the 8th
  and 9th v the 2nd and 3rd (Montenegro). All ten second-tier sizes and names are unverified.
- **Spain's third tier** (`rules.pools`): one division of 40 clubs in two groups (North and South, split by where the clubs are in the
  first season). Each group is its own table and plays its own double round-robin (38 matches). The top 2 of each group go up to
  the Segunda (4 in all, as many as it sends down) and the bottom 2 of each go down to the fourth tier, which sends 4 up. A club
  that arrives joins the smaller group. Positions, objectives and the board count inside a club's own group; the champion is the
  better of the two group winners. The sheet's promotion play-off among the next four places is not played.
- **Uruguay's Intermedio** (`rules.intermedio`): 7 matches between the two 15-match tournaments, in two groups of 8 made from the
  Apertura table (alternate places), each playing the other seven once. It counts for the season's table and the points average, not for
  either tournament; its own group tables are on the league screen and the better group winner is named in the news. Uruguay now plays
  the sheet's 37 matches and relegates 3.
- **Points-average relegation** (`rules.average`): Argentina, Colombia and Paraguay (three seasons) and Uruguay (two) relegate the clubs
  with the lowest points a match over this season and those before it in the league, not the bottom of this season's table. The league
  screen shows the average table and marks the relegation places by it. A club new to the league is judged on the seasons it has.
- **Europe play-off knockouts** (`playoffs: { type: 'ko', europe: true, from, n }`): Czechia and Bulgaria play semi-finals and a final
  among the clubs placed 7th to 10th (in the split they have no round-robin), Greece among 5th to 8th over two legs. The winner is ranked
  first of them and the runner-up second; it decides no title and gives no place of its own (the continental places still go by the
  table order).
- **Youth and homegrown minimums** (`FM.Reg.RULES`, `youthMin` / `hgMin`): the "young player on the pitch / in the squad / minutes"
  rows are an under-21 (or under-23) minimum with the scope that fits (`pitch`, `xi`, `squad` or `registered`); Belgium joins England,
  Italy and Germany with a 25-man list of 8 homegrown; Portugal and Japan have a smaller homegrown minimum. They apply to a league whose
  rules are the real ones (`rules.reg === 'real'`).

### Left or simplified (leagues sheet)

- **Spain's third tier** has five groups in real life and a promotion play-off; the game has two groups of 20 and promotes the top 2 of each.
- **Europe play-offs** give no continental place of their own (Czechia, Bulgaria and Greece send clubs by table order as before); the
  Greek and Bulgarian formats are the sheet's "check" rows.
- **Costa Rica's grand final** between the two tournament champions when they differ plays out as the tournament winners' play-off.
- **Points average:** a club promoted into the league starts with only the seasons it has played there (the real league gives it a
  discounted record from the division below); Uruguay's two-season table and the real three-season ones are the sheet's "unverified" rows.
- **Venezuela, Bolivia, Cameroon, DR Congo, Cape Verde, New Zealand, Moldova's second phase** (formats the sheet marks as varying or
  unclear) keep their plain league.
- **Closed leagues** (Australia, Canada, USA, India, Singapore, the Philippines) have no relegation, as before.
- **Belgium's "check" row** (is there still a play-off with the Challenger Pro League? how many go down from 18?) has nothing definite to
  wire: the Pro League stays on plain rules with its champion-for-bottom-club swap, and the Challenger Pro League promotes its champion.
- **B teams by league** beyond Germany's third tier, Spain, the Netherlands and Portugal are as before.
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

## Added in the second pass (November 2026)

**Calendar (17).** `D.INTL_AFTER` has four breaks: the first window of four matchdays (tags I1a to I1d, after round 7), the November
window (I4a, I4b, round 11), the March window (I2a, I2b, round 15: the qualifying play-offs) and the June window (I3a, I3b, round 20:
friendlies, the invitationals and the intercontinental play-offs), ten matchdays in all. A break day's matchday number is its place
among the calendar's international days (`MD` in `js/intl.js`, so an older save or a world definition with fewer breaks still works);
a window ends on its last day (`Intl.windowEnd`); the calendar and the Cups screen name the real window (`D.INTL_WINDOWS`). A world
definition with four breaks gets these tags, one with two or three the older ones. sim-test's "no friendlies" check was stale (the
third break has played them since it was added): it now checks that the user's nation is given none it did not book.

**Home and away qualifying (19).** A qualifying group of up to four plays home and away (six matchdays, the first six of the ten); a
bigger group (a world definition can set it) plays once. The Nations League groups still play once.

**Group-stage cups (03).** `opts.groups = { n, size, up }` on a domestic cup: the early knockout rounds thin the field to n x size
(a smaller field goes straight to the groups), the clubs are drawn into snake-seeded groups, each group plays once through, one round
a cup day, and the `up` best of each group go into the knockouts. Sweden 16 groups of 4 (winners through), Romania 6 of 4, Turkey,
Colombia and Uzbekistan 8 of 4, Russia and India 4 of 4, Kazakhstan 6 of 5, Bangladesh 3 of 4, Singapore and the Philippines 2 of 5
(the top two through). The Cups screen shows the group tables and the club chips say "Group stage".

**Late entry (03).** `opts.entry = { tier }` or `{ top }`: the clubs of that division and above (or that many of the strongest) wait
while the rest play, and join once no more of the rest are left than they are. England (top two divisions), France, Japan, Scotland and
Spain (the top flight) and Italy (the eight strongest). The sheet's exact rounds (third round proper, round of 64 ...) are approximated
by this rule.

**Replays (03, 16).** The sheet lists none in force (England abolished them from 2024-25, Scotland and Ireland "check"), so no replay
engine was built; a replay would be a drawn tie that makes a second fixture on the next cup day (`domestic()` in `js/cups.js`).

**Mexico's cup (03).** The sheet says Copa MX ended after 2019-20. The game keeps its Mexican cup: every nation has a domestic cup
(`tools/check-docs.mjs` counts 117) and the Mexican cup winner plays the Campeon de Campeones super cup. It is a fictional cup, as the
sheet notes.

**Hosts of the World Championship (19).** `hostSpread` on the world tournament picks the hosts by part of the world: two European, one
African and three South American (the 2030 hosts: Spain and Portugal, Morocco, Uruguay, Argentina and Paraguay), each drawn from the
better ranked nations of its part. A world definition that sets two or more co-hosts, or fixes the hosts, keeps its own.

**Pools (05, 18).** The Southeast Asian cup draws from the eleven ASEAN nations, the Gulf cup from the eight Gulf federation members
(Iran no longer plays it), the Central Asian cup from the CAFA nations.

## Added in the third pass (November 2026)

**The 36-club league phase (04).** The European Champions Cup, Shield and Trophy (the sheet's Champions, Europa and Conference
Leagues) each play one table of 36 clubs (`leaguePhase: { size: 36, matches: 8 }`, the Trophy six matches). The clubs are drawn into
four pots by reputation and each plays two opponents from every pot, one at home and one away (the Trophy's six leave one pot
pair out), so a club plays eight (six) different opponents, four (three) at home. The draw tries 400 pot orders, keeps those
with the fewest clashes of clubs from one nation and puts the matches into rounds (`Cu.lpEdges`, `Cu.lpColour`, `Cu.makeLeaguePhase`).
The top eight go to the round of 16, ninth to 24th play a two-legged knockout play-off (the seeded club hosts the decider: ninth to
16th against 24th to 17th), and the round of 16 pairs the top eight with the play-off winners (the best seed with the winner of the
weakest seeded tie). Quarter-finals, semi-finals and the final are as before. A table is a multiple of four clubs, 24 at least: a
field that does not fill 36 makes a smaller one, and a field under 24 (or a cup whose format sets a group size of its own, or a
calendar without the new days) keeps the groups of four. The calendar has eight league-phase matchdays (`G1` to `G8`, `G7` and
`G8` empty for the cups with six group matchdays), two play-off days (`PP1`, `PP2`) and two round-of-16 days (`R161`, `R162`)
before the quarter-finals; a world definition saved with the older eleven stages keeps the old calendar (and the groups of four).
The places: the Champions Cup takes four clubs from England, Spain, Germany and Italy, three from France, two from Portugal and
the Netherlands, one from four smaller leagues, and the rest of the 36 through the qualifying rounds (the nations with no place send
their champions: up to nine); the Shield takes 36 (three from each big league, two from Portugal, the Netherlands, Belgium and
Turkey, one from 13 more); the Trophy 36. The places are still handed out by coefficient (`Cu.spots`).

## Still to do from these sheets

- **League phase (04), Europe done; the Asian league stage and CONCACAF not:** the three European cups play the 36-club league phase
  (see below). The Asian league stage (two regions of 12) needs a split of the Asian clubs into regions, which the engine does not
  have (a cup's league phase is one table of the whole field). The Libertadores qualifying rounds exist for the main cups with eight
  qualifying nations (`Cu.qualActive`) but are not the sheet's three fixed stages. The CONCACAF Champions Cup is a group cup in the
  game and a straight knockout in the sheet (a continental with qualifying rounds and no groups, as the Club World Cup bracket works).
- **Club World Cup (04):** the 2029 edition is 32 clubs in eight groups of four, then knockouts; the game plays its own World Club
  Championship: its field and groups are not checked against the sheet.
- **Domestic cups (03):** qualifying rounds of amateur clubs below the leagues' lowest division (the game's fields are the leagues'
  clubs), Chile's regional groups, Brazil's seeded draws, Finland's occasional group stage, Peru and the other irregular cups.
- **International (05, 19):** sizes of the regional cups (ASEAN 10, Gulf 8, Arab 16, Central Asian 8, East African 10, Southern African
  14, West African 12): the invitationals are four-team tournaments played on the two days of the June window, so a bigger field needs
  more days there or a tournament played by results; two-legged ASEAN knockouts need a third day. The confederations' staged
  qualifying (the AFC first round and play-offs, the CAF play-off of four, CONCACAF's first round and its six groups of five, OFC round
  one, the CONMEBOL league of 18 matchdays, the European play-off paths) needs rounds before the groups and groups drawn after them;
  the game draws every group at the start of the season. Olympic and Asian Games football (Under-23).
- **Regional (06):** the Copa do Nordeste and Copa Verde (a Brazilian club has one regional competition in the engine), the island
  and regional first stages (Cape Verde, New Zealand, India), and the real county, district and state cups of the sheet's category C
  (lower and amateur clubs, which the game's nations do not have).
- **Verification:** every row remains unverified (the sheet's Source and Last verified columns).

## Left to do (other sheets)

- Regional groups as real groups (sheet 02 owns the split and tournament formats; the lower divisions need them too).
- A division with several cross-division play-off ties, and the Argentine, Colombian and Mexican tournaments in the lower divisions.
- A club in two cups plays them on shared cup days (the tie that waited longest goes first); a real second-cup calendar of its own
  would need the cup days split by nation.
- Youth: matches you can play or watch (a final of your own nation is only news), school sides with players of their own, the
  non-league academies of the open cups as clubs.
- The past competitions have winners but no matches, tables or rounds in the archive.

## Not checked

Every row is unverified. The sheet's yellow columns (Source, Last verified) are for you to fill in; when a row is checked,
change the game to match and update this file.
