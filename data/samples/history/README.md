# Sample history dataset

Synthetic numbers in the importer's format, to show the columns. They are not real statistics. Run:

    npm run import:history -- --dir data/samples/history --out sample-world.json

`cups.csv` (season, cup, winner, runnerup) puts a domestic cup final in each season, and `transfers.csv` (season, player, from, to, fee, nat) a season's biggest moves (a fee up to 2000 is in millions).

See `tools/import-history.mjs` for the format and `tools/realstats.mjs` for the player columns.
