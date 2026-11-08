// @ts-check
// Youth tournaments and cups (real-formats sheet 11): the national-team youth tournaments (the Under-17, Under-20, Under-21 and
// Under-23 world, continental and regional ones, and the invitationals) and the club youth cups (the continental ones, the invitationals
// and each nation's youth cup). They are played by results only, once a season as it ends: the entrants are chosen the way the real
// tournament does it as far as the game knows (a confederation's nations, a league's clubs, the champions' cup's clubs), seeded by the
// strength of their young players, and a format of groups, knockouts or a round-robin is played through with goals drawn from the gap in
// strength. The winner, the runner-up and the final are kept (S.youthHonours) and show on the Cups screen under Youth; the manager's own
// nation or club in a final makes news. Nothing here changes a player: the Under-21 friendlies in each window (js/intl.js) still bring
// the youngsters on, and the youth leagues still give them their games.
(function () {
  const FM = window.FM,
    U = FM.U,
    D = FM.D;
  const Y = (FM.YouthComps = /** @type {any} */ ({}));
  const S = () => FM.S;

  // ---------- the tournaments ----------
  // National teams. region: the confederation's nations (the game's region codes: EUR and ENG are Europe, ASIA, AFR, SAM South America,
  // NAM North and Central America, OFC), 'WORLD' for every nation with a team, or `nations` for a sub-region. from/every: the first edition
  // the sheet names, and the years between editions. size: teams; groups: [group size, advancing from each group, best of the rest to add];
  // fmt: 'groups' (groups then knockout), 'ko', 'rr' (one round-robin). off: the age group's strength against the Under-21s.
  Y.NATIONAL = [
    {
      id: 'YW17',
      name: 'FIFA U-17 World Cup',
      age: 'Under-17',
      region: 'WORLD',
      size: 48,
      from: 2026,
      every: 1,
      fmt: 'groups',
      groups: [4, 2, 8],
      off: -14,
      major: true,
    },
    {
      id: 'YW20',
      name: 'FIFA U-20 World Cup',
      age: 'Under-20',
      region: 'WORLD',
      size: 24,
      from: 2027,
      every: 2,
      fmt: 'groups',
      groups: [4, 2, 4],
      off: -4,
      major: true,
    },
    {
      id: 'YOLY',
      name: "Olympic men's football",
      age: 'Under-23',
      region: 'WORLD',
      size: 12,
      from: 2028,
      every: 4,
      fmt: 'groups',
      groups: [4, 2, 2],
      off: 5,
      major: true,
    },
    {
      id: 'YE21',
      name: 'UEFA European Under-21 Championship',
      age: 'Under-21',
      region: 'EUR',
      size: 16,
      from: 2027,
      every: 2,
      fmt: 'groups',
      groups: [4, 2, 0],
      off: 0,
      major: true,
    },
    {
      id: 'YE19',
      name: 'UEFA European Under-19 Championship',
      age: 'Under-19',
      region: 'EUR',
      size: 8,
      from: 2026,
      every: 1,
      fmt: 'groups',
      groups: [4, 2, 0],
      off: -8,
    },
    {
      id: 'YE17',
      name: 'UEFA European Under-17 Championship',
      age: 'Under-17',
      region: 'EUR',
      size: 8,
      from: 2026,
      every: 1,
      fmt: 'groups',
      groups: [4, 2, 0],
      off: -14,
    },
    {
      id: 'YA23',
      name: 'AFC U23 Asian Cup',
      age: 'Under-23',
      region: 'ASIA',
      size: 16,
      from: 2026,
      every: 2,
      fmt: 'groups',
      groups: [4, 2, 0],
      off: 4,
    },
    {
      id: 'YA20',
      name: 'AFC U20 Asian Cup',
      age: 'Under-20',
      region: 'ASIA',
      size: 16,
      from: 2027,
      every: 2,
      fmt: 'groups',
      groups: [4, 2, 0],
      off: -4,
    },
    {
      id: 'YA17',
      name: 'AFC U17 Asian Cup',
      age: 'Under-17',
      region: 'ASIA',
      size: 16,
      from: 2026,
      every: 2,
      fmt: 'groups',
      groups: [4, 2, 0],
      off: -14,
    },
    {
      id: 'YASG',
      name: "Asian Games men's football",
      age: 'Under-23',
      region: 'ASIA',
      size: 24,
      from: 2026,
      every: 4,
      fmt: 'groups',
      groups: [4, 2, 4],
      off: 3,
    },
    {
      id: 'YSE23',
      name: 'ASEAN U-23 Championship',
      age: 'Under-23',
      nations: ['IDN', 'MYS', 'THA', 'VIE', 'PHI', 'SGP', 'CAM', 'LAO', 'MYA', 'BRU', 'TLS'],
      size: 11,
      from: 2027,
      every: 2,
      fmt: 'groups',
      groups: [4, 2, 0],
      off: 2,
    },
    {
      id: 'YSE19',
      name: "ASEAN U-19 Boys' Championship",
      age: 'Under-19',
      nations: ['IDN', 'MYS', 'THA', 'VIE', 'PHI', 'SGP', 'CAM', 'LAO', 'MYA', 'BRU', 'TLS'],
      size: 11,
      from: 2026,
      every: 2,
      fmt: 'groups',
      groups: [4, 2, 0],
      off: -8,
    },
    {
      id: 'YSEA',
      name: "SEA Games men's football",
      age: 'Under-22',
      nations: ['IDN', 'MYS', 'THA', 'VIE', 'PHI', 'SGP', 'CAM', 'LAO', 'MYA', 'BRU', 'TLS'],
      size: 11,
      from: 2027,
      every: 2,
      fmt: 'groups',
      groups: [4, 2, 0],
      off: 1,
    },
    {
      id: 'YWAFF',
      name: 'WAFF, SAFF, CAFA and Gulf youth championships',
      age: 'Under-23',
      nations: ['IRN', 'IRQ', 'JOR', 'KSA', 'UAE', 'QAT', 'KUW', 'BHR', 'OMA', 'IND', 'PAK', 'BAN', 'UZB', 'KAZ'],
      size: 8,
      from: 2026,
      every: 1,
      fmt: 'groups',
      groups: [4, 2, 0],
      off: 0,
    },
    {
      id: 'YF23',
      name: 'U-23 Africa Cup of Nations',
      age: 'Under-23',
      region: 'AFR',
      size: 8,
      from: 2027,
      every: 4,
      fmt: 'groups',
      groups: [4, 2, 0],
      off: 2,
    },
    {
      id: 'YF20',
      name: 'U-20 Africa Cup of Nations',
      age: 'Under-20',
      region: 'AFR',
      size: 12,
      from: 2027,
      every: 2,
      fmt: 'groups',
      groups: [4, 2, 2],
      off: -5,
    },
    {
      id: 'YF17',
      name: 'U-17 Africa Cup of Nations',
      age: 'Under-17',
      region: 'AFR',
      size: 12,
      from: 2026,
      every: 2,
      fmt: 'groups',
      groups: [4, 2, 2],
      off: -14,
    },
    {
      id: 'YFR',
      name: 'COSAFA, CECAFA, WAFU and UNAF youth championships',
      age: 'Under-20',
      region: 'AFR',
      size: 8,
      from: 2026,
      every: 1,
      fmt: 'groups',
      groups: [4, 2, 0],
      off: -6,
    },
    {
      id: 'YS20',
      name: 'South American U-20 Championship',
      age: 'Under-20',
      region: 'SAM',
      size: 10,
      from: 2027,
      every: 2,
      fmt: 'rr',
      off: -3,
      major: true,
    },
    {
      id: 'YS17',
      name: 'South American U-17 Championship',
      age: 'Under-17',
      region: 'SAM',
      size: 10,
      from: 2027,
      every: 2,
      fmt: 'rr',
      off: -13,
    },
    {
      id: 'YS23',
      name: 'CONMEBOL Pre-Olympic Tournament',
      age: 'Under-23',
      region: 'SAM',
      size: 10,
      from: 2028,
      every: 4,
      fmt: 'rr',
      off: 4,
    },
    {
      id: 'YC20',
      name: 'CONCACAF U-20 Championship',
      age: 'Under-20',
      region: 'NAM',
      size: 12,
      from: 2026,
      every: 2,
      fmt: 'groups',
      groups: [4, 2, 2],
      off: -5,
    },
    {
      id: 'YC17',
      name: 'CONCACAF U-17 Championship',
      age: 'Under-17',
      region: 'NAM',
      size: 16,
      from: 2026,
      every: 2,
      fmt: 'groups',
      groups: [4, 2, 0],
      off: -14,
    },
    {
      id: 'YO19',
      name: 'OFC U-19 and U-16 Championships',
      age: 'Under-19',
      region: 'OFC',
      size: 8,
      from: 2026,
      every: 2,
      fmt: 'groups',
      groups: [4, 2, 0],
      off: -8,
    },
    {
      id: 'YTOU',
      name: 'Maurice Revello Tournament',
      age: 'Under-23',
      region: 'WORLD',
      size: 10,
      from: 2027,
      every: 1,
      fmt: 'groups',
      groups: [5, 1, 0],
      off: 3,
      invite: true,
    },
    {
      id: 'YCOT',
      name: 'COTIF',
      age: 'Under-20',
      region: 'WORLD',
      size: 8,
      from: 2027,
      every: 1,
      fmt: 'groups',
      groups: [4, 2, 0],
      off: -4,
      invite: true,
    },
  ];
  // Clubs: the youth sides of clubs. who: how the entrants are chosen (see Y.entrants); side: which youth side plays.
  Y.CLUBS = [
    {
      id: 'YUYL',
      name: 'UEFA Youth League',
      age: 'Under-19',
      who: { cup: 'CC', n: 36, region: 'EUR' },
      fmt: 'groups',
      groups: [4, 2, 0],
      off: 0,
      major: true,
    },
    {
      id: 'YLSA',
      name: 'CONMEBOL Libertadores Sub-20',
      age: 'Under-20',
      who: { cup: 'CL', n: 12, region: 'SAM' },
      fmt: 'groups',
      groups: [4, 2, 2],
      off: 0,
      major: true,
    },
    { id: 'YICC', name: 'U20 Intercontinental Cup', age: 'Under-20', pair: ['YUYL', 'YLSA'], fmt: 'ko', off: 0 },
    {
      id: 'YVIA',
      name: 'Torneo di Viareggio',
      age: 'Under-19',
      who: { nat: 'ITA', tier: 2, n: 24, plusWorld: 16 },
      fmt: 'groups',
      groups: [5, 2, 0],
      off: 0,
    },
    {
      id: 'YDAL',
      name: 'Dallas Cup',
      age: 'Under-19',
      who: { nat: 'USA', tier: 1, n: 4, plusWorld: 12 },
      fmt: 'groups',
      groups: [4, 2, 0],
      off: 0,
    },
    {
      id: 'YBLU',
      name: 'Blue Stars/FIFA Youth Cup',
      age: 'Under-19',
      who: { nat: 'SUI', tier: 1, n: 2, plusWorld: 10 },
      fmt: 'groups',
      groups: [4, 2, 2],
      off: 0,
    },
    { id: 'YFAY', name: 'FA Youth Cup', age: 'Under-18', who: { nat: 'ENG', tier: 4 }, fmt: 'ko', off: 0, nat: 'ENG' },
    {
      id: 'YPLC',
      name: 'Premier League Cup',
      age: 'Under-21',
      who: { nat: 'ENG', tier: 2, n: 32 },
      fmt: 'groups',
      groups: [4, 2, 0],
      off: 0,
      nat: 'ENG',
    },
    {
      id: 'YSCY',
      name: 'Scottish Youth Cup',
      age: 'Under-18',
      who: { nat: 'SCO', tier: 9 },
      fmt: 'ko',
      off: 0,
      nat: 'SCO',
    },
    {
      id: 'YCRJ',
      name: 'Copa del Rey Juvenil',
      age: 'Under-19',
      who: { nat: 'ESP', tier: 3, n: 32 },
      fmt: 'ko',
      off: 0,
      nat: 'ESP',
    },
    {
      id: 'YDFB',
      name: 'DFB-Pokal der Junioren',
      age: 'Under-19',
      who: { nat: 'GER', tier: 3, n: 32 },
      fmt: 'ko',
      off: 0,
      nat: 'GER',
    },
    {
      id: 'YCIP',
      name: 'Coppa Italia Primavera',
      age: 'Under-20',
      who: { nat: 'ITA', tier: 2, n: 40 },
      fmt: 'ko',
      off: 0,
      nat: 'ITA',
    },
    {
      id: 'YGAM',
      name: 'Coupe Gambardella',
      age: 'Under-19',
      who: { nat: 'FRA', tier: 9 },
      fmt: 'ko',
      off: 0,
      nat: 'FRA',
    },
    {
      id: 'YREV',
      name: 'Taça Revelação',
      age: 'Under-23',
      who: { nat: 'POR', tier: 2, n: 16 },
      fmt: 'groups',
      groups: [4, 2, 0],
      off: 0,
      nat: 'POR',
    },
    {
      id: 'YCOP',
      name: 'Copa São Paulo de Futebol Júnior',
      age: 'Under-20',
      who: { nat: 'BRA', tier: 9 },
      fmt: 'groups',
      groups: [4, 2, 0],
      off: 0,
      nat: 'BRA',
    },
    {
      id: 'YCBS',
      name: 'Copa do Brasil Sub-20',
      age: 'Under-20',
      who: { nat: 'BRA', tier: 2, n: 32 },
      fmt: 'ko',
      off: 0,
      nat: 'BRA',
    },
    {
      id: 'YJCY',
      name: 'Japan Club Youth (U-18) Football Championship',
      age: 'Under-18',
      who: { nat: 'JPN', tier: 2, n: 32 },
      fmt: 'groups',
      groups: [4, 2, 0],
      off: 0,
      nat: 'JPN',
    },
  ];

  // ---------- strength and matches ----------
  const poisson = (lam) => {
    let k = 0,
      p = 1;
    const L = Math.exp(-lam);
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    return k - 1;
  };
  // A match: goals from the gap in rating; a knockout tie that is level goes to extra time and penalties, the stronger side a little ahead
  Y.match = function (a, b, ko) {
    const d = (a.r - b.r) / 18;
    let ga = poisson(1.3 * Math.exp(d * 0.5)),
      gb = poisson(1.3 * Math.exp(-d * 0.5)),
      note = '';
    if (ko && ga === gb) {
      ga += poisson(0.4 * Math.exp(d * 0.5)) > 0 ? 1 : 0;
      gb += poisson(0.4 * Math.exp(-d * 0.5)) > 0 ? 1 : 0;
      if (ga === gb) {
        const pa = U.clamp(0.5 + d * 0.06, 0.3, 0.7);
        const win = Math.random() < pa;
        note = ' (pens)';
        return { ga, gb, w: win ? a : b, note };
      }
      note = ' (aet)';
    }
    return { ga, gb, w: ga >= gb ? (ga === gb ? (Math.random() < 0.5 ? a : b) : a) : b, note };
  };
  const byPoints = (x, y) => y.pts - x.pts || y.gd - x.gd || y.gf - x.gf || y.r - x.r;
  // Play a competition through: entrants [{ id, name, r }], cfg as above. Returns { winner, runnerUp, final, semis, n }.
  Y.play = function (entrants, cfg) {
    const field = entrants.map((e) => ({ ...e, pts: 0, gd: 0, gf: 0 }));
    const seed = (list) => list.slice().sort((x, y) => y.r + U.gauss(0, 1.5) - (x.r + U.gauss(0, 1.5)));
    const table = (g, ko) => {
      for (let i = 0; i < g.length; i++)
        for (let j = i + 1; j < g.length; j++) {
          const m = Y.match(g[i], g[j], ko);
          g[i].gf += m.ga;
          g[j].gf += m.gb;
          g[i].gd += m.ga - m.gb;
          g[j].gd += m.gb - m.ga;
          if (m.ga === m.gb) (g[i].pts++, g[j].pts++);
          else (m.ga > m.gb ? g[i] : g[j]).pts += 3;
        }
    };
    let through = field;
    if (cfg.fmt === 'rr') {
      table(field, false);
      const t = field.slice().sort(byPoints);
      return { winner: t[0], runnerUp: t[1], final: '', semis: t.slice(0, 4), n: field.length };
    }
    if (cfg.fmt === 'groups' && field.length > 2) {
      const [size, adv, extra] = cfg.groups || [4, 2, 0];
      const k = Math.max(1, Math.round(field.length / size));
      const groups = Array.from({ length: k }, () => /** @type {any[]} */ ([]));
      // (seeded into the groups in a snake: the strongest are kept apart)
      seed(field).forEach((e, i) => {
        const row = Math.floor(i / k);
        groups[row % 2 ? k - 1 - (i % k) : i % k].push(e);
      });
      groups.forEach((g) => table(g, false));
      const adv1 = [],
        rest = [];
      groups.forEach((g) => {
        const t = g.slice().sort(byPoints);
        adv1.push(...t.slice(0, adv));
        rest.push(...t.slice(adv));
      });
      through = adv1.concat(rest.sort(byPoints).slice(0, extra));
    }
    // knockout: seeded by group record (or strength), byes for the best when the field is not a power of two
    let ko = through
      .slice()
      .sort((x, y) => (cfg.fmt === 'groups' ? byPoints(x, y) : y.r + U.gauss(0, 1.5) - (x.r + U.gauss(0, 1.5))));
    let size = 1;
    while (size < ko.length) size *= 2;
    const slots = new Array(size).fill(null);
    // the standard bracket: seed i meets seed size-1-i; missing seeds are byes
    const order = (n) => (n === 1 ? [0] : order(n / 2).flatMap((i) => [i, n - 1 - i]));
    order(size).forEach((seedNo, pos) => (slots[pos] = ko[seedNo] || null));
    let round = slots,
      semis = [],
      last = /** @type {any} */ (null);
    while (round.length > 1) {
      if (round.length === 4) semis = round.filter(Boolean);
      const next = [];
      for (let i = 0; i < round.length; i += 2) {
        const a = round[i],
          b = round[i + 1];
        if (!a || !b) next.push(a || b);
        else {
          const m = Y.match(a, b, true);
          if (round.length === 2) last = { a, b, m };
          next.push(m.w);
        }
      }
      round = next;
    }
    const winner = round[0];
    const finalM = last;
    const runnerUp = finalM ? (finalM.a === winner ? finalM.b : finalM.a) : null;
    return {
      winner,
      runnerUp,
      final: finalM ? `${finalM.m.ga}–${finalM.m.gb}${finalM.m.note}` : '',
      semis,
      n: field.length,
    };
  };

  // ---------- entrants ----------
  // The strength of a club's young players: the average ability of its best youth players (a club without youth sides, in a league the
  // game plays by scores, from its reputation)
  Y._youth = null;
  Y.youthIndex = function () {
    const by = {};
    for (const p of Object.values(S().players)) {
      if (!p.team || p.retired || !p.clubId) continue;
      (by[p.clubId] = by[p.clubId] || []).push(p.ca);
    }
    for (const k of Object.keys(by)) by[k] = by[k].sort((a, b) => b - a).slice(0, 14);
    return by;
  };
  Y.clubRating = (c, idx, off) => {
    const l = idx[c.id];
    return (l && l.length >= 8 ? U.avg(l, (x) => x) : 0.5 * c.rep + 6) + (off || 0) + U.gauss(0, 2);
  };
  const tierOf = (c) => (S().comps[c.comp] && S().comps[c.comp].tier) || 9;
  const real = (c) =>
    c.comp && !c.parent && c.sim !== 'nation' && S().comps[c.comp] && S().comps[c.comp].type === 'league';
  Y.entrants = function (def, idx) {
    const clubs = Object.values(S().clubs).filter(real);
    const w = def.who;
    let list = [];
    if (w.cup) {
      const cup = S().comps[w.cup];
      list = ((cup && cup.clubs) || []).map((id) => S().clubs[id]).filter(Boolean);
      if (list.length < w.n)
        list = clubs
          .filter(
            (c) =>
              (D.NATIONS[c.nat] || {}).region === w.region ||
              (w.region === 'EUR' && (D.NATIONS[c.nat] || {}).region === 'ENG'),
          )
          .sort((a, b) => b.rep - a.rep)
          .slice(0, w.n);
      list = list.slice(0, w.n);
    } else {
      list = clubs.filter((c) => c.nat === w.nat && tierOf(c) <= w.tier).sort((a, b) => b.rep - a.rep);
      if (w.n) list = list.slice(0, w.n);
      if (w.plusWorld) {
        const have = new Set(list.map((c) => c.id));
        list = list.concat(
          clubs
            .filter((c) => !have.has(c.id) && c.nat !== w.nat && tierOf(c) === 1)
            .sort((a, b) => b.rep - a.rep)
            .slice(0, w.plusWorld),
        );
      }
    }
    return list.map((c) => ({ id: c.id, name: c.name, nat: c.nat, r: Y.clubRating(c, idx, def.off) }));
  };
  Y.nationEntrants = function (def) {
    const I = FM.Intl,
      s = S();
    const teams = Object.values(s.nteams || {}).filter((t) => (t.u21 || []).length >= 11 && !I.banned(t));
    let pool = teams;
    if (def.nations) pool = teams.filter((t) => def.nations.includes(t.code));
    else if (def.region !== 'WORLD') {
      const regs = def.region === 'EUR' ? ['EUR', 'ENG'] : [def.region];
      pool = teams.filter((t) => regs.includes((D.NATIONS[t.code] || {}).region));
    }
    // (a confederation's strongest nations qualify: strength with some luck, as a real qualifying route is not a fixed list)
    return pool
      .map((t) => ({ id: t.id, name: t.name, nat: t.code, r: I.u21Rating(t) + (def.off || 0) + U.gauss(0, 2.5) }))
      .sort((a, b) => b.r - a.r)
      .slice(0, def.size);
  };

  // ---------- a season's worth ----------
  Y.honours = () => (S().youthHonours = S().youthHonours || []);
  Y.run = function () {
    const s = S(),
      year = s.year;
    if (!s.nteams) return;
    if (Object.values(s.nteams).some((t) => !t.u21)) FM.Intl.youthTick();
    const out = [];
    const record = (def, res, kind) => {
      if (!res || !res.winner) return;
      const e = {
        y: year,
        id: def.id,
        name: def.name,
        age: def.age,
        kind,
        w: res.winner.name,
        wid: res.winner.id,
        wn: res.winner.nat,
        r: res.runnerUp ? res.runnerUp.name : '',
        rid: res.runnerUp ? res.runnerUp.id : '',
        f: res.final,
        n: res.n,
      };
      Y.honours().push(e);
      out.push(e);
      const mine = [res.winner.id, res.runnerUp && res.runnerUp.id].filter(Boolean);
      const uc = s.user && (s.user.clubId || (s.user.nation && 'n_' + s.user.nation));
      const you =
        mine.includes(uc) || (kind === 'nation' && s.user && s.user.nation && mine.includes('n_' + s.user.nation));
      if (you || def.major)
        FM.News.add({
          type: you ? 'club' : 'world',
          title: `${res.winner.name} win the ${def.name}`,
          body: `${res.winner.name} beat ${res.runnerUp ? res.runnerUp.name : 'the field'}${res.final ? ` (${res.final})` : ''} in the ${def.age} ${def.name}, ${year}.`,
        });
    };
    for (const def of Y.NATIONAL) {
      if (year < def.from || (year - def.from) % def.every) continue;
      const ent = Y.nationEntrants(def);
      if (ent.length < 4) continue;
      record(def, Y.play(ent, def), 'nation');
    }
    const idx = Y.youthIndex();
    const done = {};
    for (const def of Y.CLUBS) {
      if (def.pair) {
        const a = done[def.pair[0]],
          b = done[def.pair[1]];
        if (a && b)
          record(
            def,
            Y.play(
              [
                { ...a.winner, r: a.winner.r },
                { ...b.winner, r: b.winner.r },
              ],
              def,
            ),
            'club',
          );
        continue;
      }
      const ent = Y.entrants(def, idx);
      if (ent.length < 4) continue;
      const res = Y.play(ent, def);
      done[def.id] = res;
      record(def, res, 'club');
    }
    // (kept to a long run of seasons: a few hundred lines)
    if (Y.honours().length > 1500) s.youthHonours = Y.honours().slice(-1500);
    return out;
  };
  Y.seasonEnd = function () {
    try {
      Y.run();
    } catch (e) {
      // (a failure here never stops a season from ending)
      if (typeof console !== 'undefined') console.error('youth tournaments', e);
    }
  };

  // ---------- the Cups screen's Past tab: the real cross-nation leagues and cups that are over (D.PAST_COMPETITIONS) ----------
  Y.pastHtml = function (esc) {
    const card = (c) =>
      `<div class="card"><div class="row"><div class="h3 grow">${esc(c.name)}</div><span class="pill">${esc(c.kind)}</span></div>
        <div class="tiny dim" style="margin-top:4px">${esc(c.years)} · ${esc(c.nations)}${c.clubs ? ` · ${U.plural(c.clubs, 'club')}` : ''}</div>
        <div class="small" style="margin-top:6px">${esc(c.format)}</div>${c.note ? `<div class="small dim" style="margin-top:4px">${esc(c.note)}</div>` : ''}</div>`;
    const all = D.PAST_COMPETITIONS || [];
    return (
      `<div class="tiny dim" style="margin:8px 0">Competitions of the real game that are over. The game's world begins in the present, so none of them is played.</div>` +
      `<div class="small b dim" style="margin:12px 0 4px">CROSS-NATION LEAGUES</div>${all
        .filter((c) => c.kind === 'League')
        .map(card)
        .join('')}` +
      `<div class="small b dim" style="margin:12px 0 4px">CUPS</div>${all
        .filter((c) => c.kind === 'Cup')
        .map(card)
        .join('')}`
    );
  };

  // ---------- the Cups screen's Youth tab ----------
  Y.html = function (esc, flag) {
    const list = Y.honours();
    const last = {};
    for (const e of list) last[e.id] = e;
    const card = (def, kind) => {
      const e = last[def.id];
      const hist = list
        .filter((x) => x.id === def.id)
        .slice(-5)
        .reverse();
      return `<div class="card"><div class="row"><div class="h3 grow">${esc(def.name)}</div>${e ? `<span class="pill acc">${e.wn ? flag(e.wn) + ' ' : ''}${esc(e.w)}</span>` : ''}</div>
        <div class="tiny dim" style="margin-top:4px">${esc(def.age)} · ${kind === 'nation' ? 'national teams' : 'club youth sides'} · ${def.size || (def.who && def.who.n) ? U.plural(def.size || def.who.n, kind === 'nation' ? 'team' : 'club') : "open to the nation's clubs"}${def.every ? ` · ${def.every === 1 ? 'every year' : `every ${U.plural(def.every, 'year')}`}` : ' · every year'}</div>
        ${hist.length ? hist.map((x) => `<div class="small" style="padding:3px 0">${x.y}: <b>${esc(x.w)}</b>${x.r ? ` beat ${esc(x.r)}` : ''}${x.f ? ` (${esc(x.f)})` : ''}</div>`).join('') : '<div class="small dim" style="margin-top:6px">Not played yet: the first edition is at the end of this season or a later one.</div>'}</div>`;
    };
    return (
      `<div class="tiny dim" style="margin:8px 0">Youth competitions are played once a season, as it ends, by results only: the young players of each side, seeded by their strength.</div>` +
      `<div class="small b dim" style="margin:12px 0 4px">NATIONAL TEAMS</div>${Y.NATIONAL.map((d) => card(d, 'nation')).join('')}` +
      `<div class="small b dim" style="margin:12px 0 4px">CLUB YOUTH CUPS</div>${Y.CLUBS.map((d) => card(d, 'club')).join('')}`
    );
  };
})();
