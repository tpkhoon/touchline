// League rankings: every league ranked by strength, across the world and within each confederation. A league's rating is the average
// reputation of its best clubs (the number that drives its squads and its money); its continental points (the nation's coefficient,
// js/cups.js) add up to ten more for the top flights, so a league whose clubs do well abroad climbs. The ranking of each season is
// kept in the archive (entry.lrank), which gives each league its movement since last season.
(function () {
  const FM = window.FM,
    W = FM.W,
    S = () => FM.S;
  const R = (FM.Rank = {});
  R.TOP = 14; // the best clubs that make up a league's rating
  R.BONUS = 10; // the most the continental points can add

  R.rating = function (comp) {
    const reps = comp.clubs
      .map((id) => S().clubs[id])
      .filter(Boolean)
      .map((c) => c.rep)
      .sort((a, b) => b - a)
      .slice(0, R.TOP);
    return reps.length ? reps.reduce((t, v) => t + v, 0) / reps.length : 0;
  };
  // (points per club over five seasons: 15 is a nation with no continental record, 60 the best a nation's places can earn)
  R.bonus = (comp) => {
    const coef = FM.Cups && comp.nat ? FM.Cups.coef(comp.nat) : 15;
    return Math.max(0, Math.min(1, (coef - 15) / 45)) * R.BONUS;
  };

  // The leagues in order: { id, name, nat, confed, tier, sim, rating, coef, score, rank, crank }. rank is among all the leagues
  // listed, crank among those of its confederation. `all` lists every division; otherwise the top flights.
  R.table = function ({ all = false } = {}) {
    const rows = W.leagues()
      .filter((l) => all || l.tier === 1)
      .map((l) => {
        const rating = R.rating(l),
          top = l.tier === 1;
        return {
          id: l.id,
          name: l.name,
          nat: l.nat,
          confed: FM.Intl.region(l.nat),
          tier: l.tier,
          sim: l.sim,
          rating,
          coef: top ? FM.Cups.coef(l.nat) : null,
          // (a lower division is rated on its clubs alone: it sits below the top flights of its own nation, whatever it is called)
          score: top ? rating + R.bonus(l) : rating - 8 * (l.tier - 1),
        };
      })
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    const seen = {};
    rows.forEach((r, i) => {
      r.rank = i + 1;
      r.crank = seen[r.confed] = (seen[r.confed] || 0) + 1;
    });
    return rows;
  };

  // The ranking of the top flights this season, for the archive
  R.record = function (entry) {
    entry.lrank = Object.fromEntries(R.table().map((r) => [r.id, r.rank]));
  };
  // Places gained since the last season in the archive (negative: lost), or null when there is none to compare with
  R.movement = function (id, rank) {
    const arch = S().archive || [];
    for (let i = arch.length - 1; i >= 0; i--)
      if (arch[i].lrank) return arch[i].lrank[id] != null ? arch[i].lrank[id] - rank : null;
    return null;
  };
})();
