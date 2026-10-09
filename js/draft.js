// The college draft of a league that has one (the American league, like MLS): each winter the clubs take turns to pick
// from a class of young prospects, the clubs that missed the playoffs first and the champions last. The AI picks for
// itself as the clock reaches it; your club picks on the Draft screen (or lets the assistant do it). The class is kept
// out of the player pool until it is picked, so no club can sign a prospect early; whoever is left undrafted vanishes.
(function () {
  const FM = window.FM,
    W = FM.W,
    U = FM.U,
    D = FM.D;
  const S = () => FM.S;
  const Dr = (FM.Draft = {});

  const POSW = { GK: 1, FB: 2, CB: 3, WB: 1, DM: 2, CM: 3, WM: 1, AM: 2, W: 2, ST: 3 };
  const posPool = Object.entries(POSW).flatMap(([k, n]) => Array(n).fill(k));

  Dr.leagues = () =>
    W.leagues().filter((c) => (c.rules.mls && c.rules.mls.draftRounds) || (c.rules.uni && c.rules.uni.draftRounds));
  // Japan's university route: graduates of the university leagues are signed straight into the J.League (no Americans' college draft)
  Dr.isUni = (compId) => !!(S().comps[compId] && S().comps[compId].rules.uni);
  Dr.word = (compId) => (Dr.isUni(compId) ? 'graduate draft' : 'draft');
  Dr.current = () => (S().draft && !S().draft.done ? S().draft : null);

  // A club's strength of need: fewer players at a position, and the better a prospect, the keener the pick
  function value(p, club, counts) {
    const gap = Math.max(0, (POSW[p.pos] || 2) + 1 - (counts[p.pos] || 0));
    return p.pa * 0.6 + p.ca * 0.4 + gap * 1.5 + U.rand(-2, 2);
  }
  // What the assistant (and the AI clubs) would take
  Dr.bestFor = function (d, clubId) {
    const counts = {};
    W.squad(clubId).forEach((p) => (counts[p.pos] = (counts[p.pos] || 0) + 1));
    const club = S().clubs[clubId];
    let best = null,
      bv = -1e9;
    for (const p of d.pool) {
      const v = value(p, club, counts);
      if (v > bv) ((bv = v), (best = p));
    }
    return best;
  };

  // the order of the first round, from last season's archive: no playoffs, then knocked out early ... champions last
  Dr.order = function (comp, entry) {
    const e = entry && entry.comps[comp.id];
    const reach = {};
    if (e && e.playoffs) {
      const lost = (k) =>
        (e.playoffs[k] || []).forEach((f) => (reach[f.w === f.h ? f.a : f.h] = { M1: 1, M2: 2, M3: 3, M4: 4 }[k]));
      ['M1', 'M2', 'M3', 'M4'].forEach(lost);
      if (e.champion) reach[e.champion] = 5;
    }
    const pts = Object.fromEntries(((e && e.table) || []).map((r, i) => [r.id, r.pts - i * 0.001]));
    return comp.clubs
      .slice()
      .sort((a, b) => (reach[a] || 0) - (reach[b] || 0) || (pts[a] || 0) - (pts[b] || 0) || (a < b ? -1 : 1));
  };

  Dr.makeClass = function (comp, n) {
    const out = [];
    for (let i = 0; i < n; i++) {
      // the top of the class is much better than the bottom
      const uni = !!comp.rules.uni,
        q = i / n,
        ca = Math.round(U.clamp(U.gauss((uni ? 57 : 54) - q * (uni ? 12 : 14), 3), 28, 68)),
        age = uni ? 22 : U.randi(20, 22);
      const nat = uni
        ? U.chance(0.97)
          ? comp.nat
          : 'KOR'
        : U.chance(0.82)
          ? comp.nat
          : U.pick(['MEX', 'CAN', 'BRA', 'ARG', 'COL', 'ENG', 'GHA', 'NGA', 'FRA']);
      const p = W.genPlayer({
        nat: D.NATIONS[nat] ? nat : comp.nat,
        pos: U.pick(posPool),
        age,
        ca,
        pa: W.potentialFor(ca, age) + U.randi(0, 6),
      });
      p.draftYear = S().year;
      if (uni) p.uni = true;
      out.push(p);
    }
    return out.sort((a, b) => b.pa + b.ca - (a.pa + a.ca));
  };

  // Open a draft for a league (after the new season's squads are set); AI clubs pick until your turn
  Dr.start = function (comp, entry) {
    const R = (comp.rules.mls || comp.rules.uni).draftRounds,
      first = Dr.order(comp, entry),
      order = [];
    for (let r = 0; r < R; r++) first.forEach((id) => order.push(id));
    S().draft = {
      year: S().year,
      comp: comp.id,
      rounds: R,
      size: first.length,
      order,
      pick: 0,
      pool: Dr.makeClass(comp, order.length + 12),
      picks: [],
      done: false,
    };
    Dr.run();
    return S().draft;
  };

  Dr.onClock = () => {
    const d = Dr.current();
    return d && d.pick < d.order.length ? d.order[d.pick] : null;
  };
  Dr.userToPick = () => {
    const c = Dr.onClock();
    return !!c && W.isUser(c);
  };

  function take(d, p, clubId) {
    d.pool = d.pool.filter((x) => x.id !== p.id);
    const club = S().clubs[clubId];
    p.draftClub = clubId;
    S().players[p.id] = p;
    W.startSpell(p, clubId);
    p.contract = S().year + 3;
    FM.Contracts.aiDeal(p, club);
    W.refresh(p);
    d.picks.push({ n: d.pick + 1, round: Math.floor(d.pick / d.size) + 1, club: clubId, pid: p.id });
    d.pick++;
  }

  // The AI picks until your club is on the clock (or the draft ends)
  Dr.run = function () {
    const d = Dr.current();
    if (!d) return;
    while (d.pick < d.order.length && !W.isUser(d.order[d.pick])) {
      const clubId = d.order[d.pick];
      if (!d.pool.length) break;
      take(d, Dr.bestFor(d, clubId), clubId);
    }
    if (d.pick >= d.order.length || !d.pool.length) Dr.finish();
  };

  Dr.userPick = function (pid) {
    const d = Dr.current();
    if (!d || !Dr.userToPick()) return { ok: false, msg: "You're not on the clock." };
    const p = d.pool.find((x) => x.id === pid);
    if (!p) return { ok: false, msg: 'That prospect is gone.' };
    take(d, p, d.order[d.pick]);
    Dr.run();
    return { ok: true, p };
  };

  // Finish the draft: the assistant makes any picks still to come for your club; the rest of the class is released
  Dr.finish = function () {
    const d = Dr.current();
    if (!d) return;
    while (d.pick < d.order.length && d.pool.length) {
      const clubId = d.order[d.pick];
      take(d, Dr.bestFor(d, clubId), clubId);
    }
    d.done = true;
    d.pool = [];
    // the draftees' wages come after the new season's check on the AI's salary budgets: bring those clubs back within it
    if (FM.Reg && FM.Reg.real())
      new Set(d.picks.map((x) => x.club)).forEach((id) => {
        const c = S().clubs[id];
        if (c && !W.isUser(id) && FM.Reg.mls(c)) FM.Reg.mlsComply(c);
      });
    const top = d.picks[0] && S().players[d.picks[0].pid],
      mine = d.picks.filter((x) => W.isUser(x.club));
    if (top)
      FM.News.add({
        type: 'world',
        title: `${W.name(top)} goes first in the draft`,
        body: `${S().clubs[d.picks[0].club].name} used the number one pick on the ${W.age(top)}-year-old ${top.pos}.`,
        clubId: d.picks[0].club,
        pid: top.id,
      });
    if (mine.length)
      FM.News.add({
        type: 'club',
        title: 'Draft complete',
        body: `Your picks: ${mine.map((x) => `${W.name(S().players[x.pid])} (#${x.n})`).join(', ')}.`,
        clubId: mine[0].club,
      });
    S().draftLog = S().draftLog || [];
    S().draftLog.push({ year: d.year, comp: d.comp, picks: d.picks.slice() });
  };

  // Hook into the season roll: a draft opens in each league that has one; advancing the day settles an open one
  const newSeason = FM.Season.newSeason;
  FM.Season.newSeason = function (entry) {
    const r = newSeason.call(this, entry);
    Dr.leagues().forEach((c) => c.clubs.length && Dr.start(c, entry));
    return r;
  };
  const advance = FM.Season.advance;
  FM.Season.advance = function (...a) {
    Dr.finish();
    return advance.apply(this, a);
  };
})();
