# Competition rules

How each competition in the game follows its real-life rules, and where it simplifies. The data lives in
`js/data.js` (leagues, `TIEBREAK`, `DOMESTIC_CUPS`, `CONTINENTALS`) and `js/registration.js` (squad rules).

## Everywhere

- **Points:** 3 for a win, 1 for a draw, 0 for a defeat in every league and group.
- **Away goals:** counted nowhere. UEFA, CONMEBOL, the AFC and CAF dropped them (2021–22), as did every domestic cup.
- **Knockouts:** a tie level after 90 minutes goes to extra time and then penalties (the Copa Argentina, Copa do Brasil and, outside the final, the Copa Libertadores, Sudamericana and Copa América go straight to penalties). The first leg of a two-legged
  tie has no extra time; the second leg is decided on aggregate, then extra time and penalties.
- **Substitutions:** five per team, nine on the bench.

## League tiebreakers (clubs level on points)

| Rule | Leagues |
| --- | --- |
| Head-to-head (points, then goal difference, then goals), then overall goal difference and goals | LaLiga, Segunda, Primera Federación, Serie A, Serie B, Primeira Liga, Süper Lig, Super League Greece, Ekstraklasa |
| Goal difference, goals scored, then head-to-head | Premier League and the EFL (goal difference, goals scored), Bundesliga, 2. Bundesliga, 3. Liga, Ligue 1, Ligue 2, Eredivisie, J1 League |
| Wins, then goal difference, goals, head-to-head | Brasileirão |
| Wins, then goal difference, goals | MLS |
| Goals scored, then goal difference | K League 1 |
| Goal difference, then goals scored | every other league |

A final tie after all of that is split by the club's name (a real league would hold a play-off or draw lots). Group
tables in the continental cups use UEFA's rule: head-to-head first.

## Promotion, relegation and play-offs

- **England:** Premier League 3 down. Championship: 2 up, play-offs 3rd–6th, 3 down. League One: 2 up, play-offs
  3rd–6th, 4 down. League Two: 3 up, play-offs 4th–7th. Play-off semi-finals over two legs, the final a single match
  at a neutral ground (Wembley).
- **Spain:** LaLiga 3 down. Segunda: 2 up, play-offs 3rd–6th with a two-legged final, 4 down.
- **Germany:** Bundesliga 2 down plus a play-off: 16th plays the 3rd-placed club of the 2. Bundesliga over two legs.
  The 2. Bundesliga does the same with the 3. Liga (2 up, 3rd in the play-off; 2 down, 16th in the play-off). A B
  team can't be promoted into its parent's division, so the next club takes its place.
- **Italy:** Serie A 3 down. Serie B: 2 up, play-offs 3rd–6th with a two-legged final.
- **France:** Ligue 1 2 down plus a play-off: 16th plays the best non-promoted club of Ligue 2 over two legs. Ligue 2: 2 up, the 3rd-placed club in the play-off.

## League formats: splits, tournaments and title playoffs

Where a real league does not simply play a double round-robin, the game follows its format. The data lives in
`rules` in `js/data.js` (`split`, `torneos`, `zones`, `playoffs`, `conferences`, `mls`, `pools`, `intermedio`, `average`).

### Splits

After the regular season the table divides into groups that play each other again. Final positions go group by
group, whatever the points. Points carry over unless noted.

| League | Regular season | Split | After the split |
| --- | --- | --- | --- |
| Scottish Premiership | 33 matches | Top 6 / bottom 6 | 5 matches each, points kept |
| Bulgarian First League | 30 matches | Top 6 / middle 4 / bottom 6 | 5, 3 and 5 matches, points kept |
| Cyprus First Division | 26 matches | Top 6 / bottom 8 | 10 and 7 matches, points kept |
| Israeli Premier League | 26 matches | Top 6 / bottom 8 | 10 and 7 matches, points kept |
| Egyptian Premier League | 21 clubs, 20 matches | Top 7 / bottom 14 | 6 and 13 matches, points kept |
| Ecuadorian Serie A | 30 matches | Top 6 / 5 / 5 | 5 and 4 matches, points kept |
| Danish Superliga | 22 matches | Top 6 / bottom 6 | 10 matches each, points kept |
| Austrian Bundesliga | 22 matches | Top 6 / bottom 6 | 10 matches each, points halved (rounded up) |
| Swiss Super League | 33 matches | Top 6 / bottom 6 | 5 matches each, points kept |
| Czech First League | 30 matches | Top 6 / middle 4 / bottom 6 | 5, 3 and 5 matches, points kept |
| Serbian SuperLiga | 30 matches | Top 8 / bottom 8 | 7 matches each, points kept |
| Super League Greece | 26 matches | Top 4 / 5th–8th / bottom 6 | 6, 6 and 5 matches, points halved |
| K League 1 | 33 matches | Top 6 / bottom 6 | 5 matches each, points kept |
| Cymru Premier | 22 matches | Top 6 / bottom 6 | 10 matches each, points kept |

The Czech, Bulgarian and Greek groups of four (7th to 10th, 7th to 10th and 5th to 8th) play no round-robin: they play a Europe play-off knockout (semi-finals and a final, Greece over two legs) that ranks them first and second among the four.

The Belgian Pro League plays a plain 34 matches in 2026/27 (the play-offs are abolished). The Romanian and Israeli splits are as in the table of `docs/real-formats/02-leagues.tsv`.

### Two groups, an Intermedio and points average

- **Spain's third tier** is one division of 40 clubs in two groups (`pools`): each group plays its own double round-robin, has its own table, sends its top 2 up and its bottom 2 down.
- **Uruguay's Intermedio** (`intermedio`): 7 matches between the 15-match tournaments, in two groups of 8 made from the Apertura table (1st, 4th, 5th ... against 2nd, 3rd, 6th ...). It counts for the season's table, not for either tournament.
- **Points average** (`average`): Argentina, Colombia and Paraguay relegate by points a match over three seasons, Uruguay over two.

### Two tournaments a year

Liga MX, Argentina, Colombia, Costa Rica, El Salvador, Guatemala, Honduras, Panama and Paraguay (Apertura and Clausura)
have two champions a year, each tournament its own table and its own knockout (Paraguay has none: the leader of each
tournament is its champion); Peru and Uruguay have the two tournaments and one play-off at the end. The season's table is the two together; it decides the continental places after the
champions.

- **Mexico:** 18 clubs play each other once in each tournament (17 matches). The top six go straight to the
  quarter-finals; places 7–10 play in (7th v 10th, 8th v 9th, one match each); then quarter-finals, semi-finals and a
  final, all single matches hosted by the better seed (the real Liguilla uses two legs).
- **Argentina:** 28 clubs in two zones of 14 (split by reputation, snaked), each playing its zone once and one match
  against the other zone (14 matches a tournament). The top eight of each zone play a cross-zone round of 16, then
  quarter-finals, semi-finals and a final at a neutral ground, all single matches.

### Title playoffs

- **Top-n knockout (`ko`):** the top n of a tournament's table (or of the table, for a league with one tournament); with n
  between powers of two the best seeds have a bye, and each round the best surviving seed meets the worst. A round is one match
  hosted by the better seed or two legs (the lower seed hosts the first); the final can have its own number of legs. Costa Rica
  top 4, two legs; El Salvador top 8, two legs, a single final; Guatemala top 8, two legs; Honduras top 4, two legs; Panama top 4,
  two-legged semi-finals and a single final.
- **Cuadrangulares (`groups4`, Colombia):** the top eight of each tournament in two groups of four (seeds 1, 4, 5, 8 and 2, 3, 6, 7),
  each playing the others once; the two group winners play a two-legged final.
- **Peru and Uruguay (`ko` with `once`):** after the Clausura, the two tournament winners and the leaders of the season table
  (four in Peru, three in Uruguay, with a bye for the best seed) play two-legged rounds; the winner is champion.

- **MLS (USA):** see the American league above: seven a conference, the top seed skipping Round One, ending in the
  MLS Cup; the best record wins the Supporters' Shield.
- **MLS roster and salary rules (USA):** a salary budget of $5.2M a year, counted over a club's 20 biggest wage
  charges; no player counts for more than $700K (the maximum charge); up to three Designated Players may earn more than
  that and are charged only that much, and nobody else may earn above it; a senior roster of at most 30; eight
  international slots; a three-round college draft. A signing or renewal that would break any of these is refused, with
  the reason (and a hint when a Designated Player place would fix it); the AI's clubs are trimmed back within the budget
  every week and at the start of a season. Not in the game: allocation money, Generation adidas and the
  under-22 initiative.
- **A-League (Australia):** the top six play off: 3rd v 6th and 4th v 5th (elimination finals), semi-finals (1st and
  2nd against the survivors) and the Grand Final, all single matches hosted by the better seed.

### Relegation play-offs

Germany (Bundesliga and 2. Bundesliga), France (Ligue 1), Portugal, the Netherlands, Norway, Sweden, South Korea and Vietnam:
the club above the automatic places plays the best non-promoted club of the division below over two legs (South Korea has two
ties: 10th and 11th against the 2nd and 3rd of K League 2; Vietnam's 13th meets V.League 2's 2nd; the Dutch 16th meets the 3rd of
the Eerste Divisie in place of its promotion play-offs). Italy, Spain and England have none in the real top flights;
Serie B's play-out has nowhere to send the loser (there is no Serie C in the game).

## Southeast Asia and South Africa

Six more top flights, each one division in the game: the **Singapore Premier League** (10 clubs), **Malaysia Super League** (14), **V.League 1** (14), **Liga 1 Indonesia** (18), **Philippines Football League** (10) and South Africa's **Premier Soccer League** (16), every club playing every other twice.

- **Continental places:** Malaysia, Vietnam, Indonesia and Singapore each send their champion to the Asian Champions Cup; those and the Philippines also fill the Asian Shield with one or two more. The Premier Soccer League sends two to the African Champions Cup and two to the African Shield.
- **Foreign players:** Malaysia and Vietnam 3 + 1 Asian + 1 ASEAN, Indonesia 6 + 1 + 1, Singapore 4 + 1 Asian, the Philippines 5, South Africa 7.
- **Domestic cups:** a knockout with the final at a neutral ground for each nation (Singapore Cup, Malaysia Cup, Vietnam Cup, Indonesia Cup, Philippines Cup, Nedbank Cup under invented names).

## Asian rules beyond the squad list

- **Japan's university route:** the J.League holds a two-round graduate draft each winter from a class of 22-year-old university players, in the order of last season's table with the weakest first; the AI picks as the clock reaches it, you pick on the Graduates board or leave it to your assistant.
- **Korea's military service:** a Korean player is called up between 26 and 28 unless he has been exempted (a long international career helps, as the Asian Games and World Championship medals do). He serves two seasons, his contract is extended to cover it and he comes back a point or two rusty. The best go to the army's club, a K League side whose whole squad is conscripts on loan from their own clubs (up to 30, never fewer than three keepers); it signs nobody else and has no academy, and nobody pays the conscripts' wages.
- **Gulf money:** Oil-Backed clubs of the Saudi Pro League pay well above the market in fee and wages for a famous name in his late twenties or thirties, one or two a window.

## Saudi Arabia and clubs with a signing policy

- **Saudi Pro League (18 clubs):** the top three of the First Division go up and the bottom three go down; the top six
  take Asian Champions Cup places (the real league sends fewer, here it fills the 16-club draw). Ten foreign players per
  squad. Most of the clubs are Oil-Backed, with budgets and ambitions to match. The King's Cup is the domestic cup.
- **Saudi First Division League (18 clubs):** three up; four foreign players.
- **Signing policy (Athletic Club):** Eibar sign only players of Basque heritage and Andorra only Catalan ones. They
  cannot buy, borrow, take on a free transfer, agree a pre-contract with or trial anyone else, and their youth teams and
  squads are made of such players. Other clubs may sign Basque and Catalan players freely. Their scouts, the search and the
  suggestions also leave out everyone they could not sign.

## Invitational tournaments

- One a season, in turn: the Cherry Blossom Cup (Japan hosts), the Golden Elephant Cup (Thailand) and the Monsoon Cup (India). The host and three
  invited nations from different parts of the world, none of whom has a qualifier on the days it is played, play semi-finals on
  the first day of the second international window and a final and a third-place match on the second; ties go to penalties.
  They count as friendlies for fitness and call-ups and a little more than a friendly for the national-team coefficient.
  The winner is recorded with the season's international results.

## The Nations League

- Played in the seasons with no qualifying: the year with no tournament and the year of the Continental Champions Trophy.
  Every confederation has one. Its nations are ranked into leagues of sixteen (League A the best), each of four groups of
  four (a last league with fewer nations has groups of three or four, a group of two plays home and away). Each nation plays
  the others in its group once, on the first three matchdays of the breaks; the rest of the ten matchdays have none of it. The
  invitational tournament takes a place only when its nations have no Nations League match that day.
- At the end the winner of each group goes up a league and the last club of each group goes down (the top league has nothing
  above it, the bottom nothing below); the next Nations League starts from that order. The champions are the best League A
  group winner (points per game, goal difference, goals, ranking).
- The coefficient moves a little more than for a friendly (30 against 22), less than for a qualifier (35).
- A nation with nothing to play rests. Friendlies are played only in the last window, by the nations with nothing else on the day.
  In a qualifying year a nation whose pool has already qualified rests.

## The international calendar

Four windows a season, ten matchdays in all (the sheet's 4 + 2 + 2 + 2): September and October (four matchdays, after league round
7), November (two, after round 11), March (two, after round 15: the qualifying play-offs) and June (two, after round 20: friendlies,
the invitationals and the intercontinental play-offs). Qualifying groups of up to four play home and away over the first six
matchdays; a bigger group plays once. The Nations League takes the first three. The summer finals are separate days at the end of
the season. A world definition with four breaks keeps this order; one with two or three has two matchdays each.

## Confederations

- Europe (with England), South America, Africa, Asia and North America, or the world's own (the editor renames them, moves
  nations between them and adds more). A confederation of four nations or more added by the editor has one World Championship
  place (taken from the biggest part of the world) and a continental championship of four nations; a smaller one has only its
  Nations League.

## Prize money

- **League:** at the end of the season, by final position. With no fund set, a club gets a part of its own revenue (12% of its
  potential, scaled by the place: the champion all of it, the last club a small share). With a fund set in the editor the fund
  is shared by position, the champion about three times the last club.
- **Domestic cup:** the fund is paid down the rounds to the winner of each tie (the final the most, 30% of the fund), and the
  holders get a title bonus of 25% on top. A regional cup pays a small flat amount.
- **Continental and world cups:** 13% of the fund for taking part, 10% for a group win (a third for a draw), 25% for each
  knockout win, and the whole fund for the title.
- Each payment goes to the club's balance and, for your club, a line in the season's prize list on the Finances tab.

## Dropping down (the world editor)

- A continental cup can name the cup below it (the same part of the world, a lower tier): the clubs that finish third in a
  group drop into it. They play the runners-up of that cup's groups (the best of the weakest runners-up against the weakest
  dropped club), one match at the runner-up's ground, on a day of its own after the group stage; the winners go on to the
  quarter-finals with the group winners. The cup they drop into needs four groups, and a cup with fewer groups above sends
  fewer clubs. Off in the game's own world.

## Domestic cups

Single matches with extra time and penalties, the lower-division club at home in the real draws (here: random
home draw), the finals at a neutral ground unless noted.

| Cup | Format |
| --- | --- |
| FA Cup | Semi-finals and final at a neutral ground |
| Copa del Rey, DFB-Pokal, Coupe de France, KNVB Cup, Emperor's Cup | Final at a neutral ground |
| Coppa Italia, Taça de Portugal | Two-legged semi-finals, neutral final |
| Copa do Brasil | Two legs from the quarter-finals, including the final |
| Copa Argentina | Every tie at a neutral ground |
| U.S. Open Cup | Final at the better club's ground |
| Copa del Rey, Coppa Italia, Taça de Portugal, Belgian, Bulgarian, Danish and Slovenian cups, Singapore Cup | Two-legged semi-finals |
| Canadian Championship, Copa Colombia | Every round two-legged, including the final |
| Copa Argentina, Copa do Brasil | Every tie that is level goes straight to penalties (no extra time) |
| Coupe de France | Extra time from the round of 32 only |
| Albania, Azerbaijan, Belarus, Bosnia, Malaysia, Montenegro, North Macedonia | Two-legged quarter-finals and semi-finals |
| Angola, Armenia, Cyprus, Chile, Costa Rica, Moldova | Two-legged early or middle rounds, as the sheet lists them (marked "check" there) |

Eleven cups have a group stage (Sweden 16 groups of four, Romania 6, Turkey, Colombia and Uzbekistan 8, Russia and India 4, Kazakhstan
6 of five, Bangladesh 3, Singapore and the Philippines 2 of five): the early rounds thin the field to the groups' size, each group
plays once through, one round a cup day, and the best of each group go into the knockouts. In England, France, Italy, Japan, Scotland
and Spain the top clubs enter late: they wait while the rest play and join once no more of the rest are left than they are. No cup has
replays (the sheet lists none in force). Mexico keeps a fictional cup although the real one has not been played since 2020.

A cup winner who has no continental place takes the one the cup carries (the Europa League for most of Europe, the Conference League
for the smaller nations, the Copa Libertadores or Sudamericana, the Asian and African second cups, the CONCACAF Champions Cup),
replacing the lowest club of his nation in that cup. Cups with no place in the game's continental cups give none.

## Guest nations

The South American Nations Cup invites six North American nations (the Copa América of 2024) and plays extra time in the final only.
The North American Nations Cup invites one Asian nation (not the strongest: the fourth best ranked), who misses the Asian Nations
Cup that year. The Southern African, East African and Central Asian invitationals take one nation from outside their region. The Gulf
Cup takes none: its eight nations are the Gulf federation's members, Iraq and Yemen included. The six hosts of the 2030 World
Championship (two European, one African, three South American) qualify without playing.

## Continental Champions Trophy

- Played in the summer before each World Championship (one season in four), in the same calendar days as the other summer finals.
  Eight nations: the winners of the last continental championships (a continent that has not had one sends its best-ranked
  nation), the world champions, a host picked from the sixteen best-ranked nations, and the best-ranked others to make up the
  eight. Two groups of four, semi-finals and a final at neutral grounds; ties go to penalties.
- It is an invitation: a national team manager whose nation is not invited is not sacked for missing it, and one who plays
  is not judged on the result.

## Continental cups

The European cups (the Champions, Shield and Trophy: UEFA's Champions, Europa and Conference Leagues) play a league phase of 36
clubs in one table: the clubs are drawn into four pots by reputation and each plays two opponents from every pot, one at home and
one away (eight matches; the Trophy six), with as few meetings of clubs from one nation as the draw allows. The top eight go to the
round of 16, ninth to 24th play a two-legged knockout play-off (ninth to 16th seeded, hosting the second leg) for the other eight
places, and the rest are out; quarter-finals, semi-finals and the final follow. The Champions Cup fills the places the leagues
do not have through qualifying rounds. A field smaller than 36 makes a table of the nearest multiple of four (24 at least); under
24 clubs, or in a world whose cup has a group size of its own, the cup plays groups of four. Every other continental cup has
groups of four (or the format its row below gives) then knockouts, as the game's scaled-down format.

| Competition | Quarter-finals / semi-finals | Final |
| --- | --- | --- |
| UEFA Champions League, Europa League, Conference League | Two legs | One match, neutral |
| Copa Libertadores, Copa Sudamericana | Two legs, no extra time (penalties after the second leg); extra time only in the final | One match, neutral |
| AFC Champions League Elite | Single matches at one centralised venue | One match, neutral |
| AFC Champions League Two | Two legs | One match, neutral |
| CAF Champions League | Two legs | One match, neutral |
| CAF Confederation Cup | Two legs | Two legs |
| CONCACAF Champions Cup | Two legs | One match, neutral |
| North American Shield | Two legs | Two legs |
| Southeast Asian, Gulf and Central American Cups | Two legs | Two legs |
| Arab Cup, East African Cup | Single matches | One match, neutral |
| Adriatic Cup, Carpathian Cup, Northern Cup (regional cups) | Two legs | One match, neutral |
| European Holders' Cup (a knockout from the first round) | Semi-finals over two legs, other rounds single matches | One match, neutral |
| European Summer Cup | Single matches | One match, neutral |

### Cups in every nation, and the regional ones

Every nation with a league (all 92) has a domestic cup: a seeded single-leg knockout for all its clubs (every division), extra time and
penalties, the final at a neutral ground. Asia has two regional club cups after the Asian cups: the Southeast Asian Cup
(Thailand, Vietnam, Indonesia, Malaysia three clubs each, Singapore and the Philippines two) and the Gulf Cup (Saudi Arabia,
the UAE, Qatar and Iran four each): groups of four, then the knockouts. Nations also meet in the Southeast Asian, Gulf and East Asian
Nations Cups, invitational tournaments in the international windows with a host that rotates through the region.

### Super cups and the other regional competitions

At the start of each season every nation plays a Super Cup: the league champions against the cup winners of the season before (the
league's runner-up when one club won both), one match at a neutral ground with extra time and penalties. Each continent has one too:
the champions cup winner against the winner of its Shield. Besides the Asian regional club cups above, there are the Arab, West
African, East and Southern African, Central American, Andean and Atlantic Cups (groups of four, then the knockouts). Three
regional tournaments for nations are played each season in turn (the Southeast Asian, Gulf, East Asian, East, Southern, West and North
African, Arab, Central Asian, Baltic, Nordic, Balkan, Central European, Celtic, Caucasus, Central American and Caribbean, Andean and
River Plate cups, and the Cherry Blossom, Golden Elephant and Monsoon Cups): a host rotating through the region's nations, the three
best-ranked others, semi-finals and a final in the international windows.

### The two world competitions

Both are single matches at neutral grounds (extra time and penalties in the knockouts).

- **Intercontinental Cup** (every season, mid-season, three days): the African and Asian champions meet (the African–Asian
  Cup) and the South American and North American champions meet (the Derby of the Americas); the winners play the
  Challenger Cup; the European champion joins the winner in the final. The entrants are the continental champions of the
  season before (in the first season, each continent's biggest entrant).
- **World Club Championship** (the summer of every fourth season, the year before the World Championship, seven days after the playoffs): 32
  clubs in eight groups of four, each a single round robin (three matchdays), the top two going on to a round of 16,
  then quarter-finals, semi-finals and the final. A group winner meets the runner-up of its neighbouring group. Places by
  continent: Europe 12, South America 6, Asia 5, Africa 4, North America 5. The continental champions of the last four
  seasons come first (most recent first, each club once), then the rest by continental points kept for four seasons
  (winners 10, runners-up 7, semi-finalists 5, quarter-finalists 3, a group stage 1; a second-tier cup counts half),
  with no more than two clubs of a nation where there is a choice. Four pots (by points and reputation) make the draw, and a
  continent does not meet itself in a group except Europe, which may have two clubs in one.

### Second-tier and regional cups

Entrants are the places just below the main cups in each league; a club is never in two continental cups.

| Competition | Entrants |
| --- | --- |
| North American Shield | Places 5–8 of the American league and of Mexico's league (the Champions Cup takes the top four); 8 clubs in two groups |
| Adriatic Cup | Serbia 3, Greece 2, Turkey 3 (after their European places); 8 clubs in two groups |
| Carpathian Cup | Czechia, Poland, Hungary and Austria 4 each; 16 clubs in four groups |
| Northern Cup | Norway 4, Denmark 4; 8 clubs in two groups |
| European Holders' Cup | One club from each European nation: its domestic cup winner, or the runner-up when the winner is in the European Champions Cup; a nation with no domestic cup sends its best club with no other European place. Knockout from the first round (byes for the top seeds) |
| European Summer Cup | The next place after the European Trophy's in England, Spain, Germany, Italy, France, Portugal, the Netherlands and Belgium; 8 clubs in a knockout before the Trophy's group stage. The two finalists take the places of the Trophy's lowest-ranked entrants (never the user's club) |

## Squad registration (real leagues; `js/registration.js`)

- **England (all four divisions), Italy, Germany (Bundesliga and 2. Bundesliga):** 25-man list of over-21s with 8
  homegrown players (three seasons at the nation's clubs between 15 and 21); Italy also limits non-EU signings from
  abroad to 2 a season.
- **Spain:** 3 non-EU players. **France:** 4 non-EU. In both, players from Cotonou-agreement states (Nigeria, Ghana,
  Senegal and Ivory Coast in the game) and Euro-Med partners (Morocco) count as EU. **Turkey:** 14 foreign registered. **Mexico:** 9. **Thailand:** 5 + 1 Asian + 1 ASEAN.
  **Korea:** 3 + 1 Asian + 1 ASEAN (the AFC's "3 + 1": the extra place can only be filled by a player from an Asian nation, the ASEAN place by one from Thailand, Malaysia, Vietnam, Indonesia, the Philippines or Singapore). **Argentina:** 6 registered, 5 in a matchday squad. **MLS:** 8 international slots. **A-League:** 5 visa
  players. **Brazil:** 9 foreign in a matchday squad. **J1:** 5 in a matchday squad (Thai players exempt).
- Leagues with a matchday cap also keep the squad within five of it, so a team can always field a legal side.

### Work permits in Britain (Governing Body Endorsement)

A player from outside the British Isles needs a work permit to sign for a club in England, Scotland or Wales, from the
EU as well since Brexit, unless he already plays, or has played, at a club in Britain. Irish players are exempt. Two
ways through, as the Football Association applies it:

1. **Automatic:** he has played enough of his national team's games over the last two years. The share needed depends on
   where that team stands in the world ranking: 30% for the top ten, 40% to 20th, 50% to 30th, 60% to 50th, 70% to
   70th. Teams ranked outside the top 70 have no automatic route.
2. **Points:** 15 needed, up to 8 for international games (in proportion to the share required) and up to 8 for his
   minutes at his clubs over two seasons, counted at what the league he plays in is worth next to the top flight's.

A player rated far above the league's best (about 14 ability points above its typical starter) is endorsed as an
exceptional talent whatever his numbers. The game simplifies the real points table, which weighs more factors (the
quality of the selling club among them); the structure and the automatic thresholds follow the real rule. A refused
signing says how far short he fell.
- Other leagues have no foreign-player limit in the game.

## Naturalisation (`D.NATURALISE` in `js/data.js`)

A player who has lived in a country for a number of seasons after turning 18 can be granted its citizenship.

- **Residence:** FIFA's own minimum of five years is the default. Spain asks 10 years, but 2 for players from Argentina, Uruguay, Colombia, Mexico and Portugal. Portugal asks 6, or 3 for Brazilians. Italy asks 10, or 4 for EU citizens. France asks 5 and Germany 8.
- **Never allowed:** Japan, Korea, Thailand, Nigeria, Ghana, Senegal and the Ivory Coast do not naturalise players.
- **Rate and cap:** each country has a yearly chance that its federation pushes a player through and a cap on how many it naturalises in a season.
- **Who:** only uncapped players the federation wants, meaning players good enough for its squad.
- **Result:** he becomes eligible as a second nation (a second flag, and "Naturalised in <year>" on his profile), with news for notable cases. He may switch allegiance as other dual nationals do.

## Where the game simplifies

- The UEFA cups play the 36-club league phase with a two-legged play-off for ninth to 24th and a round of 16; the pots, the nation clashes and the places a league sends are the game's own simplification (see Continental cups above).
- France's Ligue 1 and Ligue 2 have no relegation play-off; Serie B's play-offs are four clubs, not six to eight.
- No league has a split (Scotland, Belgium), play-offs for the title (MLS, Argentina) or an Apertura and Clausura
  (Mexico); each is one table.
- The FA Cup has no replays (the real competition has been dropping them).
- Squad registration for the continental cups follows the club's league rules, not UEFA's A and B lists.

## Rules of a single competition

The rules above are the world's. A world definition (the editor) can give a league or a cup rules of its own, and
everything else keeps the world's:

- **League:** points for a win (2 or 3), substitutes, and the foreign-player limits (places on the books, and in a
  matchday squad), which apply where the world follows each league's own registration rules.
- **Cup:** substitutes, extra time (or straight to penalties when a knockout tie is level after 90 minutes), away goals
  in a two-legged tie (off everywhere by default), and, in a continental cup, points for a win in the groups.
- **Fixtures:** a league that plays a plain round-robin can have a match put on a matchday by hand; the rest of the
  schedule is built around it.
- **Calendar:** the days of pre-season, the domestic cup's rounds, each stage of the continental cups, the
  Intercontinental Cup and the four international windows can be moved (the World Club Championship keeps its summer days). A league day falls Friday to Sunday (some midweek in a long season), a
  cup day Tuesday to Thursday, and at most one cup day sits between two league rounds.

- **Registration (a league):** the squad list and its homegrown places, work permits, non-EU limits and signings from abroad,
  foreign players on the books and in a matchday squad, the Asian and Southeast Asian places, the nations that never count
  as foreign and a salary budget can each be set or taken away for a league.
- **Format (a league):** the matches a club plays, a title play-off (a finals series of the top six, or a liguilla of the top
  ten) and two tournaments a year.
- **Competitions of their own:** a continental competition at a tier from 1 to 4 for any part of the world. Tier 1 takes the
  places leagues send to it; tiers 2 to 4 take the places named in their feeders, after the cups above have their clubs.
- **Expansion draft:** clubs added to a league can draft their players from the others, which protect their best.
- **Structure (a league):** one table, two zones (Argentina's format) or two conferences (the American league's). Promotion
  and relegation can be switched off for a pair of leagues or for the whole world.
