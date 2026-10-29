// Looking back: the matches of a finished season are kept in its archive entry (entry.fx by competition, entry.tourns for the
// international tournaments), so a past league, cup or tournament can be opened round by round and any match read again.
// A league keeps its results for the manager's own division only (every other league keeps its table); cups, continental
// competitions and tournaments keep every tie. Ratings and the fuller report are kept for matches that had them.
(function () {
  const FM = window.FM,
    W = FM.W,
    S = () => FM.S;
  const H = (FM.History = {});

  const KEEP_TYPES = ['cup', 'continental', 'world', 'super'];

  // a match, trimmed to what a report shows
  const trim = (f) => {
    const r = f.res,
      res = { hg: r.hg, ag: r.ag };
    if (r.pens) res.pens = r.pens;
    if (r.agg) res.agg = r.agg;
    if (r.win != null) res.win = r.win;
    if (r.motm != null) res.motm = r.motm;
    if (r.att) res.att = r.att;
    if (r.sim) res.sim = r.sim;
    if (r.goals && r.goals.length)
      res.goals = r.goals.map((g) => ({ pid: g.pid, side: g.side, min: g.min, ...(g.pen ? { pen: 1 } : {}) }));
    if (f.ratings) {
      // (the fuller report: kept for matches that had player ratings)
      if (r.xg) res.xg = r.xg;
      if (r.poss) res.poss = r.poss;
      if (r.weather) res.weather = r.weather;
    }
    const out = { id: f.id, comp: f.comp, h: f.h, a: f.a, res };
    if (f.po) out.po = f.po;
    if (f.round !== undefined) out.round = f.round;
    if (f.group) out.group = f.group;
    if (f.day !== undefined) out.day = f.day;
    if (f.ratings) {
      out.ratings = {};
      for (const pid in f.ratings) if (f.ratings[pid] != null) out.ratings[pid] = Math.round(f.ratings[pid] * 10) / 10;
    }
    return out;
  };

  // called when the season is entered in the archive, before the competitions are cleared
  H.capture = function (entry) {
    const s = S(),
      userComp = entry.user && entry.user.comp,
      by = {};
    for (const f of FM.Cups.allFixtures()) {
      if (!f.res) continue;
      const c = s.comps[f.comp];
      if (!c) continue;
      const ok = c.type === 'league' ? c.id === userComp || !!f.po : KEEP_TYPES.includes(c.type);
      if (ok) (by[f.comp] = by[f.comp] || []).push(trim(f));
    }
    entry.fx = by;
    entry.tourns = (s.tourns || []).map((t) => ({
      id: t.id,
      name: t.name,
      winner: t.winner,
      runnerUp: t.runnerUp,
      groups: t.groups.map((g) => ({
        name: g.name,
        table: W.sortedTable({ table: g.table }).map((r) => ({
          id: r.id,
          p: r.p,
          w: r.w,
          d: r.d,
          l: r.l,
          gf: r.gf,
          ga: r.ga,
          pts: r.pts,
        })),
      })),
      games: t.games.map((g) => ({
        id: g.id,
        h: g.h,
        a: g.a,
        po: String(g.label || '').replace(t.name + ' · ', ''), // (the stage; the tournament is already named)
        res: {
          hg: g.hg,
          ag: g.ag,
          ...(g.pens ? { pens: g.pens } : {}),
          ...(g.motm != null ? { motm: g.motm } : {}),
          goals: (g.goals || []).map((x) => ({ pid: x.pid, side: x.side, min: x.min })),
        },
      })),
    }));
  };

  // Every competition the archive can open, newest season first within each: [{ id, name, kind, years: [entry…] }]
  H.competitions = function () {
    const out = new Map();
    const add = (id, name, kind, e, nat) => {
      if (!out.has(id)) out.set(id, { id, name, kind, nat, years: [] });
      const o = out.get(id);
      o.name = name;
      o.years.push(e);
    };
    for (const e of S().archive || []) {
      for (const [id, x] of Object.entries(e.comps || {})) add(id, x.name, 'league', e, x.nat);
      for (const [id, x] of Object.entries(e.cups || {})) add(id, x.name, 'cup', e);
      for (const t of e.tourns || []) add(t.id, t.name, 'tourn', e);
    }
    const all = [...out.values()];
    all.forEach((o) => o.years.reverse());
    return all;
  };

  // A match by its id within one season of one competition
  H.match = function (entry, compId, id) {
    const t = (entry.tourns || []).find((x) => x.id === compId);
    return ((t ? t.games : (entry.fx || {})[compId]) || []).find((m) => m.id === id) || null;
  };
})();
