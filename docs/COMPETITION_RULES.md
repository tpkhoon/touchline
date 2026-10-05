# Competition rules

How each competition in the game follows its real-life rules, and where it simplifies. The data lives in
`js/data.js` (leagues, `TIEBREAK`, `DOMESTIC_CUPS`, `CONTINENTALS`) and `js/registration.js` (squad rules).

## Everywhere

- **Points:** 3 for a win, 1 for a draw, 0 for a defeat in every league and group.
- **Away goals:** counted nowhere. UEFA, CONMEBOL, the AFC and CAF dropped them (2021–22), as did every domestic cup.
- **Knockouts:** a tie level after 90 minutes goes to extra time and then penalties. The first leg of a two-legged
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
`rules` in `js/data.js` (`split`, `torneos`, `zones`, `playoffs`, `conferences`, `mls`).

### Splits

After the regular season the table divides into groups that play each other again. Final positions go group by
group, whatever the points. Points carry over unless noted.

| League | Regular season | Split | After the split |
| --- | --- | --- | --- |
| Scottish Premiership | 33 matches | Top 6 / bottom 6 | 5 matches each, points kept |
| Belgian Pro League | 30 matches | Top 6 / the rest | The top 6 play 10 more with the points halved; the rest finish |
| Danish Superliga | 22 matches | Top 6 / bottom 6 | 10 matches each, points kept |
| Austrian Bundesliga | 22 matches | Top 6 / bottom 6 | 10 matches each, points halved (rounded up) |
| Swiss Super League | 33 matches | Top 6 / bottom 6 | 5 matches each, points kept |
| Czech First League | 30 matches | Top 6 / middle 4 / bottom 6 | 10, 6 and 10 matches, points kept |
| Serbian SuperLiga | 30 matches | Top 8 / bottom 8 | 7 matches each, points kept |
| Super League Greece | 26 matches | Top 6 / bottom 8 | 10 and 7 matches, points halved |
| K League 1 | 33 matches | Top 6 / bottom 6 | 5 matches each, points kept |
| Cymru Premier | 22 matches | Top 6 / bottom 6 | 10 matches each, points kept |

### Two tournaments a year

Liga MX (Apertura and Clausura) and Argentina (Apertura and Clausura) have two champions a year, each tournament its
own table and its own knockout. The season's table is the two together; it decides the continental places after the
champions.

- **Mexico:** 18 clubs play each other once in each tournament (17 matches). The top six go straight to the
  quarter-finals; places 7–10 play in (7th v 10th, 8th v 9th, one match each); then quarter-finals, semi-finals and a
  final, all single matches hosted by the better seed (the real Liguilla uses two legs).
- **Argentina:** 28 clubs in two zones of 14 (split by reputation, snaked), each playing its zone once and one match
  against the other zone (14 matches a tournament). The top eight of each zone play a cross-zone round of 16, then
  quarter-finals, semi-finals and a final at a neutral ground, all single matches.

### Title playoffs

- **MLS (USA):** see the American league above: seven a conference, the top seed skipping Round One, ending in the
  MLS Cup; the best record wins the Supporters' Shield.
- **A-League (Australia):** the top six play off: 3rd v 6th and 4th v 5th (elimination finals), semi-finals (1st and
  2nd against the survivors) and the Grand Final, all single matches hosted by the better seed.

### Relegation play-offs

Germany (Bundesliga and 2. Bundesliga) and France (Ligue 1): the club above the automatic places plays the best
non-promoted club of the division below over two legs. Italy, Spain and England have none in the real top flights;
Serie B's play-out has nowhere to send the loser (there is no Serie C in the game).

## Saudi Arabia and clubs with a signing policy

- **Saudi Pro League (18 clubs):** the top three of the First Division go up and the bottom three go down; the top six
  take Asian Champions Cup places (the real league sends fewer, here it fills the 16-club draw). Ten foreign players per
  squad. Most of the clubs are Oil-Backed, with budgets and ambitions to match. The King's Cup is the domestic cup.
- **Saudi First Division League (18 clubs):** three up; four foreign players.
- **Signing policy (Athletic Club):** Eibar sign only players of Basque heritage and Andorra only Catalan ones. They
  cannot buy, borrow, take on a free transfer, agree a pre-contract with or trial anyone else, and their youth teams and
  squads are made of such players. Other clubs may sign Basque and Catalan players freely.

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

## Continental cups

All have groups of four then knockouts, as the game's scaled-down format.

| Competition | Quarter-finals / semi-finals | Final |
| --- | --- | --- |
| UEFA Champions League, Europa League, Conference League | Two legs | One match, neutral |
| Copa Libertadores, Copa Sudamericana | Two legs | One match, neutral |
| AFC Champions League Elite | Single matches at one centralised venue | One match, neutral |
| AFC Champions League Two | Two legs | One match, neutral |
| CAF Champions League, CAF Confederation Cup | Two legs | Two legs |
| CONCACAF Champions Cup | Two legs | Two legs |

The Club World Cup is single matches at neutral grounds.

## Squad registration (real leagues; `js/registration.js`)

- **England (all four divisions), Italy, Germany (Bundesliga and 2. Bundesliga):** 25-man list of over-21s with 8
  homegrown players (three seasons at the nation's clubs between 15 and 21); Italy also limits non-EU signings from
  abroad to 2 a season.
- **Spain:** 3 non-EU players. **France:** 4 non-EU. In both, players from Cotonou-agreement states (Nigeria, Ghana,
  Senegal and Ivory Coast in the game) and Euro-Med partners (Morocco) count as EU. **Turkey:** 14 foreign registered. **Mexico:** 9. **Thailand:** 7.
  **Korea:** 6. **Argentina:** 6 registered, 5 in a matchday squad. **MLS:** 8 international slots. **A-League:** 5 visa
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

- The UEFA cups have 16 clubs in four groups, not the 36-club league phase with play-offs, and a league's places are
  scaled to fit (Premier League, LaLiga, Bundesliga and Serie A 3 each, Ligue 1 2, Portugal and the Netherlands 1).
- France's Ligue 1 and Ligue 2 have no relegation play-off; Serie B's play-offs are four clubs, not six to eight.
- No league has a split (Scotland, Belgium), play-offs for the title (MLS, Argentina) or an Apertura and Clausura
  (Mexico); each is one table.
- The FA Cup has no replays (the real competition has been dropping them).
- Squad registration for the continental cups follows the club's league rules, not UEFA's A and B lists.
