// The manager you turn out to be. Nothing is picked at the start: four slow-moving axes are worked out from what you do, and a
// profile appears once there is enough to go on.
//   youth    develops youngsters .......... buys established players   (who plays: the share of minutes to under-22s)
//   attack   attacking and aggressive ..... cautious and pragmatic     (the tactic you pick: press, build-up, width)
//   spend    buys big ..................... sells and develops         (large signings and sales)
//   stable   keeps the same eleven ........ tinkers every week         (changes to the starting eleven)
// Each axis runs from -1 to 1 and moves a few per cent a match. The profile is read by the board (a youth club likes a manager
// who plays youngsters, a fan-owned club one who attacks, an oil-backed club one who spends), by players (a teenager is drawn to
// a manager who plays teenagers) and by the job market (clubs of a kind look at managers of that kind). The manager also has a
// standing in each country: success in Japan makes a name in Japan, and a smaller one elsewhere.
(function () {
  const FM = window.FM,
    U = FM.U,
    W = FM.W;
  const St = (FM.Style = {});
  St.MIN_GAMES = 10; // before this the profile says nothing
  St.AXES = {
    youth: ['Buys established players', 'Develops youngsters'],
    attack: ['Cautious and pragmatic', 'Attacking and aggressive'],
    spend: ['Sells and develops', 'Buys big'],
    stable: ['Tinkers every week', 'Keeps the same eleven'],
  };
  St.get = (u) => (u.style = u.style || { youth: 0, attack: 0, spend: 0, stable: 0, n: 0, prev: null });
  const move = (st, k, v, a) => (st[k] = U.clamp(st[k] + (v - st[k]) * a, -1, 1));

  // After one of your matches: who played, the tactic, and how much the eleven changed
  St.afterMatch = function (club, m, side) {
    const u = FM.S.user,
      st = St.get(u),
      sd = m.sides[side];
    st.n++;
    const mins = sd.mins || {};
    const total = U.sum(Object.values(mins), (x) => x) || 1;
    const young = U.sum(Object.entries(mins), ([pid, x]) => (W.age(FM.S.players[pid]) <= 21 ? x : 0));
    move(st, 'youth', U.clamp((young / total - 0.1) * 5, -1, 1), 0.03);
    const t = sd.tactic || {};
    const aggro =
      ({ 'High Press': 1, 'Mid Block': 0, 'Low Block': -1 }[t.press] || 0) * 0.6 +
      ({ Possession: 0.3, 'Wing Play': 0.4, Short: 0.1, Direct: 0, Counter: -0.4 }[t.buildup] || 0) +
      ({ Wide: 0.3, Narrow: -0.1 }[t.width] || 0);
    move(st, 'attack', U.clamp(aggro, -1, 1), 0.03);
    const xi = sd.xi.filter(Boolean).map((p) => p.id);
    if (st.prev) {
      const changed = xi.filter((id) => !st.prev.includes(id)).length;
      move(st, 'stable', U.clamp(1 - changed / 3, -1, 1), 0.05); // none changed: 1; three changed: 0; six: -1
    }
    st.prev = xi;
  };
  // A big signing or sale (a tenth of the club's yearly revenue potential or more)
  St.afterTransfer = function (club, p, fee, buying) {
    const st = St.get(FM.S.user);
    if (fee < 0.1 * FM.Season.revenuePotential(club)) return;
    move(st, 'spend', buying ? 1 : -1, 0.12);
  };
  St.ready = (u) => St.get(u).n >= St.MIN_GAMES;
  // The words for an axis: its end if it is far enough from the middle, else null
  St.word = function (st, k) {
    const v = st[k];
    return v >= 0.3 ? St.AXES[k][1] : v <= -0.3 ? St.AXES[k][0] : null;
  };
  // How well a club's kind fits the manager (-1 to 1): the board's wishes against the profile
  St.match = function (club) {
    const u = FM.S.user;
    if (!u || !St.ready(u)) return 0;
    const st = St.get(u);
    return (
      {
        youth: st.youth,
        fan: st.attack * 0.7 + st.stable * 0.2,
        oil: st.spend * 0.7 + st.attack * 0.2,
        giant: st.attack * 0.4 + st.spend * 0.3,
        selling: -st.spend * 0.6 + st.youth * 0.3,
        historic: st.stable * 0.4,
        fallen: st.attack * 0.4 + st.stable * 0.3,
      }[club.identity] || 0
    );
  };
  // What a player makes of the manager (parts of M.appeal): a teenager wants a manager who plays teenagers, a veteran does not;
  // a forward likes an attacking one, a defender a cautious one
  St.appealFor = function (p) {
    const u = FM.S.user;
    if (!u || !St.ready(u)) return 0;
    const st = St.get(u),
      age = W.age(p),
      g = FM.D.POS_GROUP[p.pos];
    let a = 0;
    if (age <= 21) a += st.youth * 0.6;
    else if (age >= 31) a -= st.youth * 0.3;
    if (g === 'ATT' || g === 'MID') a += st.attack * 0.25;
    else if (g === 'DEF') a -= st.attack * 0.2;
    return a;
  };
  // The end of a season: a board of the manager's kind gains or loses a little confidence in him
  St.seasonEnd = function (club) {
    const m = St.match(club);
    if (Math.abs(m) < 0.25) return;
    // (the axes that are clear enough to name; a profile that only just clears the board's bar may have none)
    const words = ['youth', 'attack', 'spend', 'stable']
      .map((k) => St.word(St.get(FM.S.user), k))
      .filter(Boolean)
      .join(', ')
      .toLowerCase();
    club.boardConf = U.clamp(club.boardConf + m * 3, 0, 100);
    FM.News.add({
      type: 'board',
      title: m > 0 ? 'The board like how you run the club' : 'The board are uneasy about your approach',
      body:
        m > 0
          ? `Your approach${words ? ` (${words})` : ''} is what a club like ${club.name} wants.`
          : `Your approach is not what a club like ${club.name} is looking for, and it shows in the chairman's confidence.`,
      clubId: club.id,
    });
  };

  // ---------- Standing by country ----------
  // A name made in one country carries less in another. After each result your standing in the club's country moves a little
  // more than your general reputation does.
  // Standing in a club's country before there is a record there: your own country knows you, a neighbour a little, the rest less
  St.defaultStanding = function (club) {
    const u = FM.S.user,
      N = FM.D.NATIONS;
    if (u.nat === club.nat) return u.rep;
    const same = N[club.nat] && N[u.nat] && N[club.nat].region === N[u.nat].region;
    return u.rep - (same ? 4 : 8);
  };
  St.afterResult = function (club, d) {
    const u = FM.S.user;
    u.repNat = u.repNat || {};
    const cur = u.repNat[club.nat] ?? St.defaultStanding(club);
    u.repNat[club.nat] = U.clamp(cur + d * 1.3, 1, 99);
  };
  // What a club thinks of you when it looks at a manager: mostly the standing in its country, partly your name in general
  St.effectiveRep = function (club) {
    const u = FM.S.user;
    return 0.6 * ((u.repNat && u.repNat[club.nat]) ?? St.defaultStanding(club)) + 0.4 * u.rep;
  };
})();
