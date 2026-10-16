# Real world pack

`real-world.json` is a world pack in the game's own format (`touchline-world`): real clubs, leagues, cups and derbies everywhere, and the
real first-team squads of the top two divisions of England, Spain, Germany, Italy and France (198 clubs, 5,338 players).

## Use it

On the new-career screen choose **Import a database…** and pick `data/packs/real-world.json`. The club picker then shows the real clubs.
The game still ships with its fictional world; this is the optional real one.

## What is in it

- **Names:** every club of the game's 1,066 gets its real name, abbreviation, nickname, town, colours and ground from
  `data/real-world.json`, and the leagues, cups and derbies their real names. The clubs' ratings, finances and facilities stay as the game made them.
- **Players:** for each of the 198 clubs the first-team squad as English Wikipedia lists it: name, nation, position and shirt number; the birth
  date, positions, caps and fame counts come from Wikidata. A club's squad is up to 34 players.
- **Ratings are estimates.** Open data has no ratings. The real players of a club are ordered by how well known they are (language editions of
  their Wikipedia article, caps for their country, awards, a little less for a veteran) and the club's generated squad, which already fits the
  club's level and its league, lends its ratings in that order: the best-known player gets the club's best rating. So the strength of each club
  and league is the game's, and which player is the star is the real world's. Edit a rating in the world editor or a CSV when you know better.
  For the 425 players the StatsBomb open data (github.com/hudl/open-data) has seen in its 299 men's matches (World Cup 2022, Euro 2020 and 2024 and
  the league seasons it covers), the real-stats converter (`js/realstats.js`) also reads their numbers: it moves a rating up or down by up to 6
  points, by how many minutes there are to go on, and only by how far the numbers sit above or below what the fame estimate predicts (so the
  scale stays the game's). Mbappé, Xhaka and Donnarumma went up, Juan Bernat and Álvaro Morata down. Only the resulting ratings are in the pack;
  StatsBomb is the source of the match data (derived figures only). Built with `npm run realplayers:build -- --stats <file from npm run refstats>`.
- **Positions:** Wikipedia gives goalkeeper, defender, midfielder or forward. A specific label from Wikidata (centre-back, left-back, winger)
  is used where there is one; otherwise the shirt number (2 and 3 full-back, 6 holding midfielder, 10 playmaker, 7 and 11 winger); and each
  squad is topped up with the full-backs, wingers and holding midfielders a formation needs.
- Players from nations the game does not have are given a neighbouring nation (about 170 of them); players with no Wikidata item (about 780,
  mostly youngsters) get an estimated age.

## Sources and licence

The squads are from the English Wikipedia (CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0/); birth dates, positions, caps and
language-edition counts are from Wikidata (CC0). The pack is a derivative of Wikipedia's text, so **it is shared under CC BY-SA 4.0**, with
attribution to the Wikipedia articles of the clubs (listed in `real-world-sources.txt`), and anything built from it must carry the
same licence. The code that builds it is the game's own licence. Club and league names are trademarks of their owners; this is why the shipped
game is fictional and the real names are a pack.

## Rebuild it (squads change)

```bash
npm run realplayers:fetch -- --cache <folder>     # reads the Wikipedia squads and the Wikidata facts into a cache (about an hour: it waits out the API's rate limit)
npm run realplayers:build -- --cache <folder>     # makes data/packs/real-world.json from the cache with the game's own player generator
```

`--leagues D1,D2,ES1,...` on the fetch chooses other leagues of `data/real-world.json`; the build uses every club the cache holds.
