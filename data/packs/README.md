# Packs

The game ships no packs and no real club or player names: its world is fictional (club, league and competition names are trademarks).
A **pack** is a world file in the game's own format (`touchline-world`: club names, short names, nicknames, towns, colours, grounds, leagues,
cups, derbies and, optionally, players) that a player opens from **Import a database…** on the new-career screen or in the world editor.
`index.json` in this folder lists the packs the game's site offers in the editor's library (Library, files and packs → Look for packs); it
is empty. Nothing is fetched from anywhere else.

## Build a pack of your own

Two tools build a pack of real clubs and squads from openly licensed sources. They need a names database, `real-world.json` (each club's
nation, league, kit colours, identity, rank and derbies, keyed by club code), which you make or keep in a **private folder**: `touchline-private/`
beside the repository, or wherever `TOUCHLINE_PRIVATE` points (`tools/private.mjs`). Where the folder is missing the tools say so and stop.

```bash
npm run realplayers:fetch -- --cache <folder>     # reads squads (English Wikipedia, CC BY-SA 4.0) and facts (Wikidata, CC0) into a cache; about an hour, it waits out the API's rate limit
npm run realplayers:build -- --cache <folder>     # makes touchline-private/packs/real-world.json from the cache with the game's own player generator
```

`--leagues D1,D2,ES1,...` on the fetch chooses the leagues; the build uses every club the cache holds; `--out <file>` writes the pack elsewhere.

## How ratings are made

Open data has no ratings, so they are estimates. A club's players are ordered by how well known they are (language editions of their
Wikipedia article, caps for their country, awards, a little less for a veteran) and the club's generated squad, which already fits the club's
level and its league, lends its ratings in that order: the best-known player gets the club's best rating. The strength of each club and league
is the game's. Edit a rating in the world editor or a CSV when you know better. For players a match dataset has seen, the real-stats converter
(`js/realstats.js`; `npm run refstats`) can move a rating by up to 6 points by how far their numbers sit from what the fame estimate predicts.
Positions come from specific Wikidata labels, then shirt numbers, and every squad is topped up with the full-backs, wingers and holding
midfielders a formation needs.

## Licence

Squads from Wikipedia are CC BY-SA 4.0: a pack built from them carries that licence and attribution to the articles it used. Wikidata is CC0.
Club and league names are trademarks of their owners, which is why the game itself does not ship them and why a pack you build is for your own
use unless you have the rights to share it.
