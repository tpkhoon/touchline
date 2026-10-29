// Cup competitions: domestic knockouts (seeded byes, extra time, penalties), continental cups
// (groups of four, then quarter/semi-finals and a neutral final — two-legged when the world rule is on)
// and the World Club Championship for last season's continental finalists.
// Entrants come from data-driven qualification rules on the leagues (rules.qualify).
(function () {
  const FM = window.FM,
    U = FM.U,
    D = FM.D,
    W = FM.W;
  const Cu = (FM.Cups = {});
  const S = () => FM.S;
  const rep = (id) => S().clubs[id].rep;
  const winnerOf = (f) => FM.Season.winnerOf(f);

  Cu.roundName = (n) => (n === 2 ? 'Final' : n === 4 ? 'Semi-final' : n === 8 ? 'Quarter-final' : `Round of ${n}`);
  const mkTable = (ids) =>
    Object.fromEntries(ids.map((id) => [id, { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, form: [] }]));
  // (UEFA's group tiebreakers: head-to-head points, goal difference and goals, then overall)
  Cu.groupTable = (g) => W.sortedTable({ table: g.table, fixtures: g.fixtures, tiebreak: ['h2h', 'gd', 'gf'] });
  // Top two go through. With the games left, who is already through (or top), and who can no longer make it?
  Cu.groupMarks = function (g, wide, compId) {
    if (wide) return {}; // (the runners-up are ranked across the groups, so a group's own table cannot say)
    const win = W.rule(compId, 'win'),
      left = {};
    g.clubs.forEach((id) => (left[id] = g.fixtures.flat().filter((f) => !f.res && (f.h === id || f.a === id)).length));
    const rows = Cu.groupTable(g).map((r) => ({ id: r.id, pts: r.pts, max: r.pts + left[r.id] * win }));
    const out = {};
    rows.forEach((r) => {
      const others = rows.filter((o) => o !== r);
      if (others.every((o) => o.max < r.pts)) out[r.id] = 'top';
      else if (others.filter((o) => o.max >= r.pts).length <= 1) out[r.id] = 'through';
      else if (others.filter((o) => o.pts > r.max).length >= 2) out[r.id] = 'out';
    });
    return out;
  };
  // A fixture that settles a tie (single matches and second legs; not first legs)
  Cu.decides = (f) => f.leg !== 1;

  // qualified: { CC: [clubIds], ... } from last season's tables, or null in the first season
  // A domestic cup's entrants: every club in that nation's leagues, whatever its simulation tier (the clubs of a nation simulated by scores
  // only play its cup in the full engine, so the cup has real matches and real stories)
  // (a cup's format can keep it to the top divisions: opts.tiers = the lowest division that enters; too few clubs and it is open to all)
  Cu.entrants = (c) => {
    const all = Object.values(S().clubs).filter(
      (x) => x.nat === c.nat && x.comp && S().comps[x.comp] && W.leagueOpen(S().comps[x.comp], c.nat),
    );
    const t = (Cu.optsOf(c) || {}).tiers;
    if (!t) return all;
    const some = all.filter((x) => (S().comps[x.comp].tier || 1) <= t);
    return some.length >= 8 ? some : all;
  };
  Cu.setupSeason = function (qualified) {
    for (const c of W.cups()) {
      // (the European knockout cups take their clubs after the continental cups have, below)
      c.clubs = c.euro
        ? []
        : Cu.entrants(c)
            .sort((a, b) => b.rep - a.rep)
            .map((x) => x.id);
      c.rounds = [];
      c.winner = null;
      c.awards = null;
      c.runnerUp = null;
    }
    // second-tier cups go second, so the main cups' entrants are taken first
    for (const c of W.continentals().sort((a, b) => (a.tier || 1) - (b.tier || 1))) {
      const def0 = D.CONTINENTALS.find((x) => x.id === c.id) || {};
      const def = def0.feeders ? { ...def0, feeders: Cu.feedersOf(def0) } : def0; // (the places as they stand, by coefficient)
      // [league, how many, skipping the first k] for each feeder league
      const feeders = def.feeders
        ? Object.entries(def.feeders)
            .map(([id, n]) => [S().comps[id], n, Cu.skipFor(id, def)])
            .filter(([l]) => l)
        : W.leagues()
            .filter((l) => l.rules.qualify && l.rules.qualify.to === c.id)
            .map((l) => [l, l.rules.qualify.n, 0]);
      const want = feeders.reduce((t, [, n]) => t + n, 0);
      let entrants = (qualified && qualified[c.id]) || [];
      entrants = entrants.filter((id) => S().clubs[id]);
      if (entrants.length < want) {
        const taken = new Set(
          W.continentals()
            .filter((x) => x !== c && x.clubs)
            .flatMap((x) => x.clubs.concat((x.qual && x.qual.pool) || [])),
        );
        entrants = [];
        feeders.forEach(([l, n, skip]) =>
          entrants.push(
            ...l.clubs
              .slice()
              .sort((a, b) => rep(b) - rep(a))
              .filter((id) => !taken.has(id))
              .slice(def.feeders ? 0 : skip, (def.feeders ? 0 : skip) + n),
          ),
        );
      }
      // (groups of four; three groups do not make a bracket, so the weakest four entrants wait for another year)
      // (a cup's format can set groups of three, four, five or six: def.groupSize)
      const GS = def.groupSize || 4;
      const raw = Math.floor(entrants.length / GS),
        G = raw === 3 ? 2 : Math.max(1, raw);
      // (more entrants than places: the weakest wait, whichever league they come from)
      c.clubs = (entrants.length > G * GS ? entrants.slice().sort((a, b) => rep(b) - rep(a)) : entrants).slice(
        0,
        G * GS,
      );
      c.ko = { po: [], qf: [], qf2: null, sf: [], sf2: null, final: null };
      c.dropped = [];
      c.winner = null;
      c.awards = null;
      c.runnerUp = null;
      // The main cups also have a qualifying competition: the champions of the nations with no place of their own play two-legged
      // rounds for the places left in the groups; the groups are drawn when the last round is over
      c.qual = null;
      const main = (c.tier || 1) === 1 && Cu.qualActive(c);
      let pool = [];
      if (main) {
        pool = ((qualified && qualified[c.id + 'Q']) || [])
          .filter((id) => S().clubs[id] && !c.clubs.includes(id))
          .filter((id, i, a) => a.indexOf(id) === i);
        if (pool.length < 8)
          // (the first season of a world, or a pool the table did not fill: the best club of each such nation)
          pool = Cu.qualLeagues(c)
            .map((l) => l.clubs.slice().sort((a, b) => rep(b) - rep(a))[0])
            .filter((id) => id && !c.clubs.includes(id));
      }
      const P = main ? Cu.qualPlaces(c.clubs.length, pool.length, GS) : 0;
      if (P) {
        // (no more than eight groups: the quarter-finals take the group winners and the best runners-up; if the direct places and the
        // qualifiers would make more, the weakest direct entrants play the qualifying rounds too, among the strongest there)
        const over = c.clubs.length + P - 8 * GS;
        if (over > 0) {
          const moved = c.clubs
            .slice()
            .sort((a, b) => rep(a) - rep(b))
            .slice(0, over);
          c.clubs = c.clubs.filter((id) => !moved.includes(id));
          pool = pool.concat(moved);
        }
        pool.sort((a, b) => rep(b) - rep(a));
        // the rounds: while there are more clubs than places, the weakest play each other (the strongest wait for a later round)
        const plan = [];
        for (let cnt = pool.length; cnt > P;) {
          const ties = Math.min(Math.floor(cnt / 2), cnt - P);
          plan.push(ties);
          cnt -= ties;
        }
        c.qual = { pool, places: P, plan, byes: {}, drawn: false, GS };
        c.ko.qa = [];
        c.ko.qa2 = null;
        c.ko.qb = [];
        c.ko.qb2 = null;
        c.ko.qc = [];
        c.ko.qc2 = null;
        c.groups = [];
        c.clubs.forEach((id) => pay(id, c.prize * 0.13, c, 'participation')); // (the direct entrants; the others when they get through)
      } else {
        Cu.makeGroups(c, GS, G);
        c.clubs.forEach((id) => pay(id, c.prize * 0.13, c, 'participation')); // participation fee
      }
    }
    Cu.setupEuro(qualified);
    for (const c of W.worldCups()) Cu.setupWorld(c);
    Cu.ensureSupers(S());
    Cu.setupSupers();
    FM.Regional.setupSeason(); // county cups and state championships
    Cu.licenceCheck();
  };

  // The groups of a continental cup: a seeded draw, pots of G by reputation, one from each pot per group, avoiding same-nation
  // clashes where possible
  Cu.makeGroups = function (c, GS, G) {
    const seeded = c.clubs.slice().sort((a, b) => rep(b) - rep(a));
    const groupsIds = [...Array(G)].map(() => []);
    for (let p = 0; p < seeded.length; p += G) {
      let pot = U.shuffle(seeded.slice(p, p + G)),
        best = pot,
        clashes = 99;
      for (let tries = 0; tries < 30; tries++) {
        const c2 = groupsIds.reduce(
          (t, g, gi) => t + (pot[gi] && g.some((id) => S().clubs[id].nat === S().clubs[pot[gi]].nat) ? 1 : 0),
          0,
        );
        if (c2 < clashes) {
          clashes = c2;
          best = pot;
        }
        if (!c2) break;
        pot = U.shuffle(pot);
      }
      best.forEach((id, gi) => groupsIds[gi].push(id));
    }
    c.groups = groupsIds
      .map((ids, gi) => [String.fromCharCode(65 + gi), ids])
      .map(([name, ids]) => ({
        name,
        clubs: ids,
        table: mkTable(ids),
        fixtures: (GS >= 5 ? W.roundRobin(ids).slice(0, W.roundRobin(ids).length / 2) : W.roundRobin(ids)).map(
          (rd, r) =>
            rd.map(([h, a]) => ({
              id: FM.nextId('f'),
              comp: c.id,
              group: name,
              round: r,
              h,
              a,
              res: null,
              po: `Group ${name} · MD${r + 1}`,
            })),
        ),
      }));
  };

  // ---------- Qualifying rounds ----------
  // The main continental cups (the European, South American, Asian, African and North American champions' cups) hold a qualifying
  // competition, as the Champions League does. The nations with no place of their own in the cup (the places go by coefficient)
  // each send their champion; the champions play two-legged rounds, the strongest waiting for a later round, until as many are
  // left as there are places in the group stage, and the groups are drawn with the clubs that had a direct place. A club that
  // goes out is out of the cup (a nation with places in a lower cup sends its next clubs there instead).
  Cu.mainOf = (region) => W.continentals().find((c) => c.region === region && !((c.tier || 1) > 1));
  // the top flights whose champions play the qualifying rounds of a main cup
  Cu.qualLeagues = (main) =>
    W.leagues().filter(
      (l) =>
        l.tier === 1 &&
        l.nat &&
        Cu.regionName(l.nat) === main.region &&
        !(l.rules.qualify && l.rules.qualify.to === main.id && l.rules.qualify.n > 0),
    );
  // (a part of the world with fewer than eight such nations has no qualifying: the cup is as it was)
  Cu.qualActive = (main) => !!main && Cu.qualLeagues(main).length >= 8;
  // the main cup whose qualifying a league's champion plays, or null
  Cu.qualCup = (league) => {
    if (!league || league.type !== 'league' || league.tier !== 1 || !league.nat) return null;
    const main = Cu.mainOf(Cu.regionName(league.nat));
    return main && (main.tier || 1) === 1 && Cu.qualActive(main) && Cu.qualLeagues(main).includes(league) ? main : null;
  };
  // how many of the places in the groups the qualifying rounds fill: one group's worth for a small field, two for a big one (never
  // a number that makes three groups, which do not make a bracket), and never more than half the field
  Cu.qualPlaces = (direct, poolN, GS) => {
    let P = poolN >= 24 ? 2 * GS : poolN >= 8 ? GS : 0;
    P = Math.min(P, Math.floor(poolN / 2 / GS) * GS);
    if (P && (direct + P) / GS === 3) P = P + GS <= Math.floor(poolN / 2) ? P + GS : P - GS;
    if (P <= 0) return 0;
    // (at most three rounds)
    const rounds = (n) => {
      let k = 0;
      for (let cnt = poolN; cnt > n; k++) cnt -= Math.min(Math.floor(cnt / 2), cnt - n);
      return k;
    };
    while (rounds(P) > 3 && P + GS <= Math.floor(poolN / 2)) P += GS;
    return P;
  };
  const Q_KEYS = ['qa', 'qb', 'qc'];
  Cu.QUAL_LABEL = ['Qualifying round 1', 'Qualifying round 2', 'Qualifying round 3'];
  // the clubs left in the qualifying competition before round k (null while the round before it is not played out)
  Cu.qualField = function (c, k) {
    if (!c.qual) return null;
    if (k === 0) return c.qual.pool.slice();
    const w = Cu.roundWinners(c, Q_KEYS[k - 1]);
    return w ? w.concat(c.qual.byes[k - 1] || []) : null;
  };
  // the ties of round k: the weakest clubs play each other, a stronger half (seeds) against a weaker, one from the same nation
  // only when there is no other; [seed, other] pairs
  Cu.qualPairs = function (c, k) {
    const field = Cu.qualField(c, k);
    const ties = c.qual && c.qual.plan[k];
    if (!field || !ties) return null;
    field.sort((a, b) => rep(b) - rep(a));
    const playing = field.slice(field.length - 2 * ties);
    c.qual.byes[k] = field.slice(0, field.length - 2 * ties);
    const seeds = playing.slice(0, ties),
      others = U.shuffle(playing.slice(ties));
    return seeds.map((id) => {
      const i = others.findIndex((o) => S().clubs[o].nat !== S().clubs[id].nat);
      return [id, others.splice(i < 0 ? 0 : i, 1)[0]];
    });
  };
  // a qualifying day's fixtures: stage QA1 / QA2 (the legs of round 1; QA alone when knockouts are single matches), QB..., QC...
  Cu.qualRound = function (c, stage) {
    const k = 'ABC'.indexOf(stage[1]);
    if (!c.qual || k < 0 || !c.qual.plan[k]) return [];
    const list = koRound(c, Q_KEYS[k], stage, Cu.QUAL_LABEL[k], () => Cu.qualPairs(c, k));
    list.forEach((f) => (f.q = true));
    return list;
  };
  // every qualifying tie so far, round by round (for the screens)
  Cu.qualList = (c) => (c.ko ? Q_KEYS.flatMap((k) => [...(c.ko[k] || []), ...(c.ko[k + '2'] || [])]) : []);
  // The clubs that got through, in time for the group draw (a round that was never played is settled in favour of the stronger club)
  Cu.drawGroups = function (c) {
    if (!c.qual || c.qual.drawn) return;
    const q = c.qual;
    let field = null;
    for (let k = q.plan.length; k >= 0 && !field; k--) field = Cu.qualField(c, k);
    if (!field) field = q.pool.slice();
    field = field.sort((a, b) => rep(b) - rep(a)).slice(0, q.places);
    q.drawn = true;
    q.through = field.slice();
    c.clubs = c.clubs.concat(field.filter((id) => !c.clubs.includes(id)));
    const GS = q.GS || 4;
    Cu.makeGroups(c, GS, Math.max(1, Math.floor(c.clubs.length / GS)));
    field.forEach((id) => pay(id, c.prize * 0.13, c, 'participation'));
    FM.News.add({
      type: 'world',
      title: `${c.name}: the groups are drawn`,
      body: `${U.plural(field.length, 'club')} came through the qualifying rounds to join the ${U.plural(c.clubs.length - field.length, 'club')} with a place already.`,
      cat: 'competitions',
    });
  };

  // ---------- Super cups ----------
  // One match at the start of each season at a neutral ground: in every nation the league champion against the cup winner (the
  // league's runner-up when one club did both), and on each continent the champion of the champions cup against the winner of
  // its Shield. A new world has no last season, so its first season has none.
  Cu.SUPER_CONT = [
    ['SUPEU', 'European Super Cup', 'CC', 'EL'],
    ['SUPSA', 'South American Super Cup', 'CL', 'SA'],
    ['SUPAF', 'African Super Cup', 'AF', 'AX'],
    ['SUPAS', 'Asian Super Cup', 'AC', 'A2'],
    ['SUPNA', 'North American Super Cup', 'NC', 'N2'],
  ];
  Cu.ensureSupers = function (st) {
    const mk = (id, name, nat, short, prize) => {
      if (!st.comps[id]) st.comps[id] = { id, type: 'super', name, short, nat, clubs: [], prize, rounds: [] };
    };
    for (const [id, nat] of D.DOMESTIC_CUPS.map((x) => [x[0].replace(/^CUP/, 'SUP'), x[1]]))
      if (D.NATIONS[nat]) mk(id, `${D.NATIONS[nat].name} Super Cup`, nat, `${nat}S`, 4e5);
    for (const [id, name] of Cu.SUPER_CONT) mk(id, name, '', id.slice(3) + 'S', 2e6);
  };
  Cu.setupSupers = function () {
    const st = S(),
      last = (st.archive || []).filter((e) => e.year === st.year - 1).pop();
    for (const c of Object.values(st.comps)) {
      if (c.type !== 'super') continue;
      c.clubs = [];
      c.winner = c.runnerUp = c.awards = c.fx = null;
      let a = null,
        b = null;
      if (c.nat) {
        const lg = W.leagues().find((l) => l.nat === c.nat && l.tier === 1),
          le = last && lg && last.comps && last.comps[lg.id],
          ce = last && last.cups && last.cups['CUP' + c.nat];
        a = le && le.champion;
        b = ce && ce.winner;
        if (a && b && a === b) b = le.runnerUp;
      } else {
        const def = Cu.SUPER_CONT.find((x) => x[0] === c.id);
        a = def && Cu.lastChampion(def[2]);
        b = def && Cu.lastChampion(def[3]);
      }
      if (a && b && a !== b && st.clubs[a] && st.clubs[b]) {
        c.clubs = [a, b];
        c.fx = {
          id: FM.nextId('f'),
          comp: c.id,
          h: a,
          a: b,
          res: null,
          ko: true,
          final: true,
          neutral: true,
          po: 'Super Cup',
        };
      }
    }
  };
  Cu.supers = () => Object.values(S().comps).filter((c) => c.type === 'super' && c.fx);

  // ---------- European knockout cups: the Holders' Cup and the Summer Cup ----------
  const inContinental = () => new Set(W.continentals().flatMap((x) => x.clubs || []));
  Cu.euroDef = (c) => D.EURO_CUPS.find((x) => x.id === c.id) || {};
  // One club for each European nation: the Holders' Cup has an entrant from every nation with a top flight in Europe
  Cu.euroNations = () => [
    ...new Set(
      D.LEAGUES.filter((l) => l.tier === 1 && ['EUR', 'ENG'].includes(D.NATIONS[l.nat].region)).map((l) => l.nat),
    ),
  ];
  // The entrants a cup would have in the first season, before any cup has been won or table made
  Cu.holdersFallback = function () {
    const taken = inContinental();
    return Cu.euroNations()
      .map((nat) => {
        const clubs = Object.values(S().clubs)
          .filter((x) => x.nat === nat && x.comp && S().comps[x.comp] && S().comps[x.comp].tier === 1 && !x.parent)
          .sort((a, b) => b.rep - a.rep);
        return (clubs.find((x) => !taken.has(x.id)) || clubs[0] || {}).id;
      })
      .filter(Boolean);
  };
  Cu.summerFallback = function (def) {
    const taken = inContinental(),
      out = [];
    for (const [id, n] of Object.entries(def.feeders || {})) {
      const l = S().comps[id];
      if (!l) continue;
      out.push(
        ...l.clubs
          .filter((x) => !taken.has(x))
          .sort((a, b) => rep(b) - rep(a))
          .slice(0, n),
      );
    }
    return out;
  };
  Cu.setupEuro = function (qualified) {
    for (const c of W.cups().filter((x) => x.euro)) {
      const def = Cu.euroDef(c);
      let ids = ((qualified && qualified[c.id]) || []).filter((id) => S().clubs[id]);
      if (!ids.length) ids = c.euro === 'holders' ? Cu.holdersFallback() : Cu.summerFallback(def);
      c.clubs = [...new Set(ids)];
      c.rounds = [];
      c.winner = null;
      c.runnerUp = null;
      c.awards = null;
      c.clubs.forEach((id) => pay(id, c.prize * 0.1, c, 'participation')); // an appearance fee
    }
  };
  // Who the Holders' Cup takes at the end of a season: each nation's domestic cup winner, or the runner-up when the winner is
  // already in the European Champions Cup (a club that wins both hands the place on); a nation with no domestic cup sends
  // its best club that has no other European place
  Cu.holdersFor = function (qualified, entry) {
    const top = new Set(D.CONTINENTALS.filter((x) => !x.tier || x.tier === 1).flatMap((x) => qualified[x.id] || []));
    const used = new Set(Object.values(qualified).flat());
    return Cu.euroNations()
      .map((nat) => {
        const cup = W.cups().find((c) => !c.euro && c.nat === nat && c.winner);
        if (cup) return top.has(cup.winner) && cup.runnerUp && !top.has(cup.runnerUp) ? cup.runnerUp : cup.winner;
        const lg = W.leagues().find((l) => l.nat === nat && l.tier === 1),
          table = (lg && entry.comps[lg.id] && entry.comps[lg.id].table) || [];
        return (table.find((r) => !used.has(r.id)) || table[0] || {}).id;
      })
      .filter(Boolean);
  };
  // The Summer Cup's two finalists take the last places of the cup it feeds (the European Trophy), before its group stage
  // has begun: the lowest-ranked entrants, never your own club, give way
  Cu.summerPlaces = function (c) {
    const def = Cu.euroDef(c),
      uc = S().comps[def.takes];
    if (!uc || !uc.groups || uc.groups.some((g) => g.fixtures.flat().some((f) => f.res))) return;
    const incoming = [c.winner, c.runnerUp].slice(0, def.places || 1).filter((id) => id && !uc.clubs.includes(id));
    const out = uc.clubs
      .filter((id) => !W.isUser(id))
      .sort((a, b) => rep(a) - rep(b))
      .slice(0, incoming.length);
    incoming.forEach((id, i) => {
      Cu.swapEntrant(uc, out[i], id);
      pay(id, uc.prize * 0.13, uc, 'participation');
      FM.News.add({
        type: W.isUser(id) ? 'club' : 'world',
        title: `${S().clubs[id].name} take ${U.a(uc.name)} place`,
        body: `${id === c.winner ? 'Winners' : 'Runners-up'} of the ${c.name}, ${S().clubs[id].name} join the ${uc.name} group stage in place of ${S().clubs[out[i]].name}.`,
        clubId: id,
      });
    });
  };
  // One club takes another's place in a cup whose groups have not started: the draw, the table and the fixtures follow
  Cu.swapEntrant = function (comp, oldId, newId) {
    const sw = (x) => (x === oldId ? newId : x);
    comp.clubs = comp.clubs.map(sw);
    for (const g of comp.groups || []) {
      if (!g.clubs.includes(oldId)) continue;
      g.clubs = g.clubs.map(sw);
      g.table[newId] = g.table[oldId];
      delete g.table[oldId];
      for (const f of g.fixtures.flat()) ((f.h = sw(f.h)), (f.a = sw(f.a)));
    }
  };

  // How many of a league's clubs go to its main continental cup (the second-tier cup takes the next places)
  Cu.mainPlaces = (compId) => {
    const l = (S() && S().comps && S().comps[compId]) || D.LEAGUES.find((x) => x.id === compId);
    return (l && l.rules && l.rules.qualify && l.rules.qualify.n) || 0;
  };
  // Saves made before a competition existed get it (empty until the next season's draw)
  Cu.addDomestic = (s, id, nat, name, short, opts) =>
    (s.comps[id] = {
      id,
      type: 'cup',
      nat,
      name,
      short,
      clubs: [],
      rounds: [],
      prize: (opts && opts.prize) || 3e6,
      opts: opts || {},
    });
  // A European knockout cup (the Holders' Cup, the Summer Cup): a cup of its own with no nation, the entrants chosen by rule
  Cu.addEuro = (s, d) =>
    (s.comps[d.id] = {
      id: d.id,
      type: 'cup',
      euro: d.kind,
      nat: '',
      region: 'Europe',
      name: d.name,
      short: d.short,
      clubs: [],
      rounds: [],
      prize: d.prize,
      opts: d.opts || {},
    });
  Cu.CWC_PRIZE = 2.5e7;
  Cu.newCwc = () => ({
    id: 'CWC',
    type: 'world',
    fmt: 'cwc',
    name: 'World Club Championship',
    short: 'CWC',
    clubs: [],
    prize: Cu.CWC_PRIZE,
    on: false,
  });
  Cu.newIc = () => ({
    id: 'ICC',
    type: 'world',
    fmt: 'ic',
    name: 'Intercontinental Cup',
    short: 'ICC',
    clubs: [],
    prize: 1e7,
  });
  Cu.ensureContinentals = function (s) {
    FM.Regional.ensure(s);
    for (const d of D.EURO_CUPS || []) if (!s.comps[d.id]) Cu.addEuro(s, d);
    for (const c of D.CONTINENTALS) if (!s.comps[c.id]) s.comps[c.id] = { ...c, type: 'continental', clubs: [] };
    // (the Intercontinental Cup, and a World Club Championship of the 32-club format: older saves have the old eight-club one)
    if (!s.comps.ICC) s.comps.ICC = Cu.newIc();
    if (s.comps.CWC && !s.comps.CWC.fmt)
      Object.assign(s.comps.CWC, { fmt: 'cwc', prize: Cu.CWC_PRIZE, on: false, clubs: [] });
    for (const [id, nat, name, short, opts] of D.DOMESTIC_CUPS)
      if (!s.comps[id]) Cu.addDomestic(s, id, nat, name, short, opts);
  };
  // A cup's format (older saves made before formats existed read it from the data)
  Cu.optsOf = (c) => c.opts || (D.DOMESTIC_CUPS.find((x) => x[0] === c.id) || [])[4] || {};
  // Calendar days a domestic cup needs: a round a day, two days for a two-legged one
  Cu.daysNeeded = (c) => {
    const def = c.euro && Cu.euroDef(c),
      euroN =
        def &&
        (c.euro === 'holders' ? Cu.euroNations().length : Object.values(def.feeders || {}).reduce((t, k) => t + k, 0)),
      n = Math.max(2, euroN || Cu.entrants(c).length),
      p = 2 ** Math.floor(Math.log2(n)),
      legs = (Cu.optsOf(c).legs || []).filter((k) => k <= p).length;
    return Math.log2(p) + (n === p ? 0 : 1) + legs;
  };
  // The places a league's clubs skip for a lower continental cup: its main cup's, and those of the cups above this
  // one in the same region (the Conference League takes the places after the Europa League's)
  Cu.skipFor = (compId, cc) => {
    let skip = Cu.mainPlaces(compId);
    // (the champion of a nation with no place in the main cup plays its qualifying rounds, and so is not one of this cup's clubs)
    if ((cc.tier || 1) > 1 && Cu.qualCup(S().comps[compId])) skip += 1;
    for (const x of D.CONTINENTALS)
      if (x.feeders && x.region === cc.region && (x.tier || 1) < (cc.tier || 1)) skip += Cu.feedersOf(x)[compId] || 0;
    return skip;
  };
  // ---------- The two world competitions ----------
  // The Intercontinental Cup is played every season (mid-season): the continental champions of the season before, the Asian and
  // African champions first, the American champions against each other, the winners in the Challenger Cup and the European
  // champion in the final. The World Club Championship is played in the summer of every fourth season: 32 clubs in eight groups of four,
  // then a round of 16, quarter-finals, semi-finals and the final (the same neutral venues all through).
  Cu.cwcYear = (y = S().year) => (((y - (FM.Intl && FM.Intl.CYCLE != null ? FM.Intl.CYCLE : 2)) % 4) + 4) % 4 === 1;
  // The season of the next World Club Championship (the one now, if this is its season)
  Cu.nextCwc = () => {
    let y = S().year;
    while (!Cu.cwcYear(y)) y++;
    return y;
  };
  // Continental points: how far each club went in a continental cup, kept for four seasons (they rank the World Club Championship's places
  // after the champions): winners 10, runners-up 7, semi-finalists 5, quarter-finalists 3, a group stage 1; a second-tier cup half
  Cu.POINTS = {
    Winners: 10,
    'Runners-up': 7,
    'Semi-finals': 5,
    'Quarter-finals': 3,
    'Knockout play-off': 2,
    'Group stage': 1,
  };
  Cu.noteSeason = function (c) {
    const st = S();
    st.contHist = st.contHist || [];
    st.contPts = st.contPts || {};
    const pts = (st.contPts[st.year] = st.contPts[st.year] || {});
    for (const id of c.clubs || []) {
      const run = Cu.runOf(c, id);
      if (run) pts[id] = (pts[id] || 0) + (Cu.POINTS[run] || 0) * ((c.tier || 1) > 1 ? 0.5 : 1);
    }
    for (const y of Object.keys(st.contPts)) if (+y < st.year - 5) delete st.contPts[y];
  };
  Cu.pointsOf = (id, from = S().year - 4, to = S().year - 1) =>
    Object.entries(S().contPts || {}).reduce((t, [y, m]) => t + (y >= from && y <= to ? m[id] || 0 : 0), 0);
  // The champions of a competition, newest first
  Cu.champions = (compId) =>
    (S().contHist || [])
      .filter((h) => h.id === compId)
      .sort((a, b) => b.year - a.year)
      .map((h) => h.w);
  // The last winner of a continental cup (older saves know only the last final)
  Cu.lastChampion = function (compId) {
    const cc = S().comps[compId];
    return Cu.champions(compId)[0] || (cc && cc.lastFinal && cc.lastFinal.w) || null;
  };
  // Who plays the World Club Championship this summer: each continent's quota from its continental cups' champions of the last four
  // seasons (each club once, most recent first), then by continental points, and no nation with more than two of its clubs
  // where there is a choice. A new world has no past: the biggest clubs of the continent's cups fill the places.
  Cu.cwcQualifiers = function () {
    const quota = D.CWC_QUOTA,
      cont = W.continentals(),
      out = [],
      taken = new Set(),
      region = {};
    const take = (id, reg) => {
      if (!id || taken.has(id) || !S().clubs[id] || S().clubs[id].sim === 'nation') return false;
      taken.add(id);
      region[id] = reg;
      out.push(id);
      return true;
    };
    const perNat = (id) => out.filter((x) => S().clubs[x].nat === S().clubs[id].nat).length;
    for (const [reg, n] of Object.entries(quota)) {
      const main = cont.filter((x) => x.region === reg && (x.tier || 1) === 1),
        pool = [...new Set(cont.filter((x) => x.region === reg).flatMap((x) => x.clubs || []))].filter(
          (id) => S().clubs[id],
        );
      if (!main.length) continue;
      let got = 0;
      for (const m of main) for (const id of Cu.champions(m.id).slice(0, 4)) if (got < n && take(id, reg)) got++;
      const rest = pool
        .filter((id) => !taken.has(id))
        .sort((a, b) => Cu.pointsOf(b) - Cu.pointsOf(a) || rep(b) - rep(a) || (a < b ? -1 : 1));
      for (const id of rest) if (got < n && perNat(id) < 2 && take(id, reg)) got++;
      for (const id of rest) if (got < n && take(id, reg)) got++;
    }
    // (a world with fewer continents than the quota: the best of the other entrants fill the 32)
    const want = Object.values(quota).reduce((t, k) => t + k, 0);
    if (out.length < want) {
      const extra = cont
        .flatMap((x) => x.clubs || [])
        .filter((id) => !taken.has(id) && S().clubs[id])
        .sort((a, b) => rep(b) - rep(a));
      for (const id of extra)
        if (out.length < want) take(id, (cont.find((x) => (x.clubs || []).includes(id)) || {}).region);
    }
    return { ids: out, region };
  };
  // Eight groups of four from four pots (the champions and strongest clubs first), a continent kept out of the same group
  // where it can be (Europe may have two in a group)
  Cu.cwcGroups = function (ids, region) {
    const G = ids.length >= 32 ? 8 : ids.length >= 16 ? 4 : 0;
    if (!G) return [];
    const seeded = ids.slice(0, G * 4).sort((a, b) => Cu.pointsOf(b) - Cu.pointsOf(a) + (rep(b) - rep(a)) * 0.01);
    const groups = [...Array(G)].map(() => []);
    for (let p = 0; p < seeded.length; p += G) {
      let pot = U.shuffle(seeded.slice(p, p + G)),
        best = pot,
        worst = 99;
      for (let tries = 0; tries < 60; tries++) {
        const clash = groups.reduce((t, g, gi) => {
          if (!pot[gi]) return t;
          const same = g.filter((x) => region[x] === region[pot[gi]]).length;
          return t + (same >= (region[pot[gi]] === 'Europe' ? 2 : 1) ? 1 : 0);
        }, 0);
        if (clash < worst) {
          worst = clash;
          best = pot;
        }
        if (!clash) break;
        pot = U.shuffle(pot);
      }
      best.forEach((id, gi) => groups[gi].push(id));
    }
    return groups;
  };
  const mkGroups = (c, groupsIds) =>
    groupsIds.map((ids, gi) => ({
      name: String.fromCharCode(65 + gi),
      clubs: ids,
      table: mkTable(ids),
      // (a single round robin: the first half of the home-and-away one)
      fixtures: W.roundRobin(ids)
        .slice(0, W.roundRobin(ids).length / 2)
        .map((rd, r) =>
          rd.map(([h, a]) => ({
            id: FM.nextId('f'),
            comp: c.id,
            group: String.fromCharCode(65 + gi),
            round: r,
            h,
            a,
            res: null,
            neutral: true,
            po: `Group ${String.fromCharCode(65 + gi)} · MD${r + 1}`,
          })),
        ),
    }));
  Cu.setupWorld = function (c) {
    c.fmt = c.fmt || 'cwc';
    c.ko = c.fmt === 'ic' ? { qf: [], sf: [], final: null } : { r16: [], qf: [], sf: [], final: null };
    c.groups = undefined;
    c.winner = null;
    c.awards = null;
    c.runnerUp = null;
    c.clubs = [];
    if (c.fmt === 'ic') {
      // the champions of the season just played (in the first season, each continent's biggest entrant)
      const B = D.IC_BRACKET,
        champ = (cid) => {
          const cc = S().comps[cid];
          if (!cc) return null;
          const last = Cu.lastChampion(cid);
          return last && S().clubs[last] ? last : cc.clubs.slice().sort((a, b) => rep(b) - rep(a))[0] || null;
        };
      const seen = new Set();
      c.ic = {};
      for (const cid of [...B.first, ...B.americas, B.final]) {
        const id = champ(cid);
        if (id && !seen.has(id)) {
          seen.add(id);
          c.ic[cid] = id;
        }
      }
      c.clubs = Object.values(c.ic);
      c.clubs.forEach((id) => pay(id, (c.prize || 0) * 0.2, c, 'participation'));
      return;
    }
    // the World Club Championship: only in its season
    c.on = Cu.cwcYear();
    if (!c.on) return;
    const { ids, region } = Cu.cwcQualifiers();
    const groupsIds = Cu.cwcGroups(ids, region);
    if (!groupsIds.length) {
      c.on = false;
      return;
    }
    c.clubs = groupsIds.flat();
    c.region = region;
    c.groups = mkGroups(c, groupsIds);
    c.clubs.forEach((id) => pay(id, (c.prize || 0) * 0.05, c, 'participation'));
    FM.News.add({
      type: 'world',
      title: `${c.name}: the 32 clubs and the draw`,
      body: c.groups.map((g) => `Group ${g.name}: ${g.clubs.map((id) => S().clubs[id].name).join(', ')}`).join('\n'),
      big: true,
    });
  };

  // Fixtures a cup plays on the current calendar day (draws are made lazily, on the day)
  // A club whose ground is below the competition's licence can't host there: its home games go to a neutral ground
  Cu.unlicensed = (clubId, comp) => {
    const c = S().clubs[clubId],
      min = D.GROUND_MIN[comp.id];
    return !!(c && min && c.stadium && c.stadium.cap < min);
  };
  Cu.fixturesFor = function (comp, cal) {
    if (comp.type === 'cup') return domestic(comp);
    if (comp.type === 'regional') return FM.Regional.fixturesFor(comp);
    if (comp.type === 'world') return world(comp, cal.stage);
    if (comp.type === 'super') return comp.fx ? [comp.fx] : [];
    const list = continental(comp, cal.stage);
    for (const f of list) {
      if (f.res) continue;
      if (f.base === undefined) f.base = !!f.neutral;
      f.neutral = f.base || Cu.unlicensed(f.h, comp);
    }
    return list;
  };
  // The season's draw: tell the user if his ground is below a licence
  Cu.licenceCheck = function () {
    const u = S().user,
      club = u && W.userClub();
    if (!club) return;
    for (const c of W.continentals()) {
      if (!c.clubs || !c.clubs.includes(club.id) || !Cu.unlicensed(club.id, c)) continue;
      FM.News.add({
        type: 'club',
        title: `${club.name}'s ground isn't licensed for the ${c.name}`,
        body: `It holds ${club.stadium.cap.toLocaleString()}; the competition wants ${D.GROUND_MIN[c.id].toLocaleString()}. Until the stadium is built up your home games there are played at a neutral ground: no home advantage, and the fans are not happy about it.`,
        clubId: club.id,
      });
      club.fanMood = Math.max(0, club.fanMood - 3);
    }
  };

  function domestic(c) {
    if (c.winner) return [];
    const last = c.rounds[c.rounds.length - 1];
    if (last) {
      // a two-legged round: the return legs are made on the next cup day, once every first leg is in
      if (last.legs === 2 && !last.ties2) {
        if (last.day === S().day || last.ties.some((f) => !f.res)) return last.ties;
        last.day2 = S().day;
        last.ties2 = last.ties.map((f) => ({
          id: FM.nextId('f'),
          comp: c.id,
          h: f.a,
          a: f.h,
          res: null,
          ko: true,
          leg: 2,
          first: f.id,
          po: `${last.name} · 2nd leg`,
          final: last.n === 2,
          neutral: false,
        }));
        return last.ties2;
      }
      const decider = last.ties2 || last.ties;
      if ((last.ties2 ? last.day2 : last.day) === S().day || decider.some((f) => !f.res)) return decider;
    }
    const alive = last ? last.byes.concat((last.ties2 || last.ties).map(winnerOf)) : c.clubs.slice();
    if (alive.length < 2) return [];
    const n = alive.length,
      p = 2 ** Math.floor(Math.log2(n));
    const seeded = alive.slice().sort((a, b) => rep(b) - rep(a));
    let byes = [],
      playing = seeded;
    if (n !== p) {
      const k = n - p;
      byes = seeded.slice(0, n - 2 * k);
      playing = seeded.slice(n - 2 * k);
    }
    const name = n === p ? Cu.roundName(n) : c.rounds.length ? `Round ${c.rounds.length + 1}` : 'First round';
    const o = Cu.optsOf(c),
      twoLegs = n === p && (o.legs || []).includes(n),
      neutral = !twoLegs && (o.neutral === 'all' || (n === p && (o.neutral || [2]).includes(n)));
    const sh = U.shuffle(playing),
      ties = [];
    for (let i = 0; i + 1 < sh.length; i += 2) {
      // two legs: the better-placed club hosts the second
      const [x, y] = twoLegs && rep(sh[i]) > rep(sh[i + 1]) ? [sh[i + 1], sh[i]] : [sh[i], sh[i + 1]];
      ties.push(
        twoLegs
          ? { id: FM.nextId('f'), comp: c.id, h: x, a: y, res: null, ko: false, leg: 1, po: `${name} · 1st leg` }
          : {
              id: FM.nextId('f'),
              comp: c.id,
              h: x,
              a: y,
              res: null,
              ko: true,
              po: name,
              final: n === 2,
              neutral,
            },
      );
    }
    c.rounds.push({ name, day: S().day, ties, byes, n: p === n ? n : 0, legs: twoLegs ? 2 : 1 });
    return ties;
  }

  Cu.domestic = domestic;

  // Knockout round with optional legs. pairs: [[seeded, unseeded], ...] — the seeded side hosts the decider.
  function koRound(c, key, stage, label, pairsFn, neutral) {
    const leg = stage.endsWith('1') ? 1 : stage.endsWith('2') ? 2 : 0;
    if (leg === 2) {
      if (!c.ko[key + '2']) {
        if (!c.ko[key].length || c.ko[key].some((f) => !f.res)) return [];
        c.ko[key + '2'] = c.ko[key].map((f) => ({
          id: FM.nextId('f'),
          comp: c.id,
          h: f.a,
          a: f.h,
          res: null,
          ko: true,
          leg: 2,
          first: f.id,
          po: `${label} · 2nd leg`,
        }));
      }
      return c.ko[key + '2'];
    }
    if (!c.ko[key].length) {
      const pairs = pairsFn();
      if (!pairs) return [];
      c.ko[key] = pairs.map(([h, a]) =>
        leg === 1
          ? { id: FM.nextId('f'), comp: c.id, h: a, a: h, res: null, ko: false, leg: 1, po: `${label} · 1st leg` }
          : { id: FM.nextId('f'), comp: c.id, h, a, res: null, ko: true, po: label, neutral: !!neutral },
      );
      FM.News.add({
        type: 'world',
        title: `${c.name}: ${label.toLowerCase()} draw`,
        body: pairs.map(([h, a]) => `${S().clubs[h].name} v ${S().clubs[a].name}`).join('\n'),
        big: true,
      });
    }
    return c.ko[key];
  }
  // Winners of a finished knockout round (null while any tie is unresolved)
  // How far a club got in a cup this season, in words (null if it was not in it)
  Cu.runOf = function (c, id) {
    if (c.winner === id) return 'Winners';
    if (c.runnerUp === id) return 'Runners-up';
    if (c.type === 'cup') {
      for (let i = (c.rounds || []).length - 1; i >= 0; i--) {
        const r = c.rounds[i];
        if (
          (r.byes || []).includes(id) ||
          [...(r.ties || []), ...(r.ties2 || [])].some((f) => f.h === id || f.a === id)
        )
          return r.name;
      }
      return c.clubs && c.clubs.includes(id) ? 'First round' : null;
    }
    if (c.type === 'continental' || (c.type === 'world' && c.groups)) {
      const ko = c.ko || {},
        inR = (a) => (a || []).some((f) => f && (f.h === id || f.a === id));
      if (inR(ko.sf) || inR(ko.sf2)) return 'Semi-finals';
      if (inR(ko.qf) || inR(ko.qf2)) return 'Quarter-finals';
      if (inR(ko.r16)) return 'Round of 16';
      if (inR(ko.po)) return 'Knockout play-off';
      if (c.clubs && c.clubs.includes(id)) return 'Group stage';
      if (c.qual && c.qual.pool.includes(id)) {
        const n = [...Cu.qualList(c)].reverse().find((f) => f.h === id || f.a === id);
        return n ? n.po.replace(/ · .*$/, '') : 'Qualifying';
      }
      return null;
    }
    return null;
  };
  Cu.roundWinners = function (c, key) {
    const dec = c.ko[key + '2'] && c.ko[key + '2'].length ? c.ko[key + '2'] : c.ko[key];
    if (!dec || !dec.length || dec.some((f) => !f.res || !Cu.decides(f))) return null;
    return dec.map(winnerOf);
  };

  // A continental cup's knockout format, as in real life: legs per round (qf, sf, f) and whether the knockouts are
  // played at one centralised venue (the AFC Champions League Elite)
  Cu.formatOf = (c) => {
    const d = D.CONTINENTALS.find((x) => x.id === c.id) || {};
    const legs = { qf: 2, sf: 2, f: 1, ...(d.legs || {}) };
    // a season already under way from an older save has no day for a second leg of the final
    if (!(S().calendar || []).some((x) => x.type === 'cup' && x.stage === 'F2')) legs.f = 1;
    return { legs, central: !!d.central };
  };
  // More than four groups (the Asian cup's five): the eight quarter-finalists are the group winners, then the best
  // runners-up to make up the numbers; the best seed meets the eighth, avoiding a rematch from the same group
  Cu.wideQuarters = function (c) {
    const better = (a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || rep(b.id) - rep(a.id);
    const tabs = c.groups.map(Cu.groupTable);
    const winners = tabs.map((t, g) => ({ ...t[0], g })).sort(better);
    const runners = tabs.map((t, g) => ({ ...t[1], g })).sort(better);
    const seeds = winners.concat(runners).slice(0, 8);
    const pairs = [];
    const left = seeds.slice();
    while (left.length > 1) {
      const top = left.shift();
      // the lowest seed left that is not from the same group (the last one if every one is)
      let k = left.length - 1;
      while (k > 0 && left[k].g === top.g) k--;
      pairs.push([top.id, left.splice(k, 1)[0].id]);
    }
    return pairs;
  };
  // Clubs knocked out of a cup drop into the one below (the editor's "drop down": cup.drop names the lower cup). The third-placed
  // clubs of the groups of the cup above play the runners-up of this cup's groups for a place in the quarter-finals: a play-off
  // of single matches at the runner-up's ground, before the quarter-finals. Works for a cup with the classic four groups.
  const better = (a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || rep(b.id) - rep(a.id);
  Cu.dropSources = (c) => W.continentals().filter((x) => x.drop === c.id && x.groups && x.groups.length);
  Cu.dropOn = (c) => !!(c.groups && c.groups.length === 4 && Cu.dropSources(c).length);
  Cu.dropRound = function (c) {
    if (!Cu.dropOn(c)) return [];
    c.ko.po = c.ko.po || [];
    if (c.ko.po.length) return c.ko.po;
    const done = (x) => x.groups.every((g) => g.fixtures.flat().every((f) => f.res));
    if (!done(c) || !Cu.dropSources(c).every(done)) return [];
    const thirds = Cu.dropSources(c)
        .flatMap((x) => x.groups.map((g) => Cu.groupTable(g)[2]))
        .filter(Boolean)
        .sort(better),
      runners = c.groups
        .map((g) => Cu.groupTable(g)[1])
        .filter(Boolean)
        .sort(better),
      n = Math.min(thirds.length, runners.length, 4);
    if (!n) return [];
    const involved = runners.slice(runners.length - n); // the weakest runners-up meet the clubs that dropped
    c.ko.po = involved.map((r, i) => ({
      id: FM.nextId('f'),
      comp: c.id,
      h: r.id,
      a: thirds[n - 1 - i].id, // (the best runner-up of those meets the weakest drop)
      res: null,
      ko: true,
      po: 'Knockout play-off',
    }));
    c.dropped = c.ko.po.map((f) => f.a);
    c.clubs = c.clubs.concat(c.dropped.filter((id) => !c.clubs.includes(id)));
    FM.News.add({
      type: 'world',
      title: `${c.name}: the knockout play-offs`,
      body: c.ko.po
        .map(
          (f) =>
            `${S().clubs[f.h].name} v ${S().clubs[f.a].name} (dropped from the ${Cu.dropSources(c)
              .map((x) => x.name)
              .join('/')})`,
        )
        .join('\n'),
      big: true,
    });
    return c.ko.po;
  };
  // Who a runner-up becomes after the play-off (a club that drew a dropped club may be knocked out by it)
  Cu.afterDrop = (c, id) => {
    const t = ((c.ko && c.ko.po) || []).find((f) => f.h === id);
    return t && t.res ? winnerOf(t) : id;
  };
  function continental(c, stage) {
    if (!stage || !c.groups) return [];
    if (/^Q[ABC][12]?$/.test(stage)) return Cu.qualRound(c, stage);
    if (stage === 'PO') return Cu.dropRound(c);
    if (stage[0] === 'G' && c.qual && !c.qual.drawn) Cu.drawGroups(c); // (the qualifying rounds are over: the groups are drawn)
    if (stage[0] === 'G') return c.groups.flatMap((g) => g.fixtures[+stage.slice(1) - 1] || []);
    const fmt = Cu.formatOf(c);
    const groupsDone = () => c.groups.every((g) => g.fixtures.flat().every((f) => f.res));
    // a round played over one leg uses the first leg's day; its second-leg day is empty
    const round = (key, label, pairsFn) => {
      const one = fmt.legs[key] === 1;
      if (one && stage.endsWith('2')) return [];
      return koRound(c, key, one ? stage.slice(0, -1) : stage, label, pairsFn, one && fmt.central);
    };
    if (stage.startsWith('QF')) {
      if (c.groups.length < 4) return [];
      return round('qf', 'Quarter-final', () => {
        if (!groupsDone()) return null;
        if (c.groups.length > 4) return Cu.wideQuarters(c);
        if (Cu.dropOn(c) && !(c.ko.po || []).length) return null; // (the play-offs are drawn first)
        if ((c.ko.po || []).some((f) => !f.res)) return null;
        const [A, B, Cc, Dd] = c.groups.map(Cu.groupTable),
          up = (r) => Cu.afterDrop(c, r.id);
        return [
          [A[0].id, up(B[1])],
          [B[0].id, up(A[1])],
          [Cc[0].id, up(Dd[1])],
          [Dd[0].id, up(Cc[1])],
        ];
      });
    }
    if (stage.startsWith('SF')) {
      return round('sf', 'Semi-final', () => {
        if (c.groups.length >= 4) {
          const w = Cu.roundWinners(c, 'qf');
          return (
            w && [
              [w[0], w[2]],
              [w[1], w[3]],
            ]
          );
        }
        if (!groupsDone()) return null;
        if (c.groups.length === 1) {
          const A = Cu.groupTable(c.groups[0]);
          return [
            [A[0].id, A[3].id],
            [A[1].id, A[2].id],
          ];
        }
        const [A, B] = c.groups.map(Cu.groupTable);
        return [
          [A[0].id, B[1].id],
          [B[0].id, A[1].id],
        ];
      });
    }
    if (stage === 'F2') {
      // the return leg of a two-legged final
      if (fmt.legs.f !== 2 || !c.ko.final || !c.ko.final.res) return [];
      if (!c.ko.final2) {
        const f1 = c.ko.final;
        c.ko.final2 = {
          id: FM.nextId('f'),
          comp: c.id,
          h: f1.a,
          a: f1.h,
          res: null,
          ko: true,
          leg: 2,
          first: f1.id,
          po: 'Final · 2nd leg',
          final: true,
        };
      }
      return [c.ko.final2];
    }
    if (stage === 'F') {
      if (!c.ko.final) {
        const w = Cu.roundWinners(c, 'sf');
        if (!w) return [];
        if (fmt.legs.f === 2) {
          // the better-placed club hosts the second leg
          const [hi, lo] = rep(w[0]) >= rep(w[1]) ? [w[0], w[1]] : [w[1], w[0]];
          c.ko.final = {
            id: FM.nextId('f'),
            comp: c.id,
            h: lo,
            a: hi,
            res: null,
            ko: false,
            leg: 1,
            po: 'Final · 1st leg',
          };
        } else
          c.ko.final = {
            id: FM.nextId('f'),
            comp: c.id,
            h: w[0],
            a: w[1],
            res: null,
            ko: true,
            po: 'Final',
            final: true,
            neutral: true,
          };
      }
      return [c.ko.final];
    }
    return [];
  }

  // The world competitions' fixtures for a calendar day's stage (single matches at neutral grounds; draws are made on the day)
  function world(c, stage) {
    if (!c.clubs || c.clubs.length < 2) return [];
    const tie = (h, a, po, fin) => ({
      id: FM.nextId('f'),
      comp: c.id,
      h,
      a,
      res: null,
      ko: true,
      po,
      neutral: true,
      final: !!fin,
    });
    const names = (ties) =>
      ties
        .map(
          (f) =>
            `${S().clubs[f.h].name} ${D.NATIONS[S().clubs[f.h].nat].flag} v ${D.NATIONS[S().clubs[f.a].nat].flag} ${S().clubs[f.a].name}`,
        )
        .join('\n');
    const announce = (title, ties) =>
      FM.News.add({ type: 'world', title: `${c.name}: ${title}`, body: names(ties), big: true });
    if (c.fmt === 'ic') {
      const B = D.IC_BRACKET,
        has = (cid) => c.ic && c.ic[cid];
      if (stage === 'QF') {
        if (!c.ko.qf.length) {
          if (has(B.first[0]) && has(B.first[1]))
            c.ko.qf.push(tie(c.ic[B.first[0]], c.ic[B.first[1]], 'African–Asian Cup'));
          if (has(B.americas[0]) && has(B.americas[1]))
            c.ko.qf.push(tie(c.ic[B.americas[0]], c.ic[B.americas[1]], 'Derby of the Americas'));
          if (c.ko.qf.length) announce('first round', c.ko.qf);
        }
        return c.ko.qf;
      }
      // (a side whose partner is missing from a custom world goes straight through)
      const through = (cids) => {
        const f = c.ko.qf.find((x) => cids.some((cid) => c.ic[cid] === x.h));
        return f ? winnerOf(f) : cids.map((cid) => c.ic[cid]).find(Boolean) || null;
      };
      const side = () => (c.ko.qf.some((f) => !f.res) ? null : [through(B.first), through(B.americas)]);
      if (stage === 'SF') {
        if (!c.ko.sf.length) {
          const [x, y] = side() || [];
          if (x && y) {
            c.ko.sf = [tie(y, x, 'Challenger Cup')];
            announce('the Challenger Cup', c.ko.sf);
          }
        }
        return c.ko.sf;
      }
      if (stage === 'F') {
        if (!c.ko.final) {
          const e = c.ic[B.final],
            ch = c.ko.sf.length ? (c.ko.sf[0].res ? winnerOf(c.ko.sf[0]) : null) : (side() || []).find(Boolean);
          if (!e || !ch) return [];
          c.ko.final = tie(e, ch, 'Final', true);
        }
        return [c.ko.final];
      }
      return [];
    }
    // the World Club Championship
    if (!c.on || !c.groups) return [];
    if (stage[0] === 'G') return c.groups.flatMap((g) => g.fixtures[+stage.slice(1) - 1] || []);
    const groupsDone = () => c.groups.every((g) => g.fixtures.flat().every((f) => f.res)),
      tabs = () => c.groups.map(Cu.groupTable),
      winners = (key) => {
        const l = c.ko[key];
        return l.length && l.every((f) => f.res) ? l.map(winnerOf) : null;
      };
    const first = c.groups.length >= 8 ? 'r16' : 'qf';
    if (stage === 'R16' && first === 'r16') {
      if (!c.ko.r16.length && groupsDone()) {
        const t = tabs(),
          pairs = [];
        for (let i = 0; i + 1 < t.length; i += 2)
          pairs.push([t[i][0].id, t[i + 1][1].id], [t[i + 1][0].id, t[i][1].id]);
        c.ko.r16 = pairs.map(([h, a]) => tie(h, a, 'Round of 16'));
        announce('the round of 16', c.ko.r16);
      }
      return c.ko.r16;
    }
    if (stage === 'QF') {
      if (!c.ko.qf.length) {
        let pairs = null;
        if (first === 'r16') {
          const w = winners('r16');
          pairs = w && [0, 2, 4, 6].map((i) => [w[i], w[i + 1]]);
        } else if (groupsDone()) {
          const [A, B, C, Dd] = tabs();
          pairs = [
            [A[0].id, B[1].id],
            [B[0].id, A[1].id],
            [C[0].id, Dd[1].id],
            [Dd[0].id, C[1].id],
          ];
        }
        if (pairs) {
          c.ko.qf = pairs.map(([h, a]) => tie(h, a, 'Quarter-final'));
          announce('the quarter-finals', c.ko.qf);
        }
      }
      return c.ko.qf;
    }
    if (stage === 'SF') {
      if (!c.ko.sf.length) {
        const w = winners('qf');
        if (w) {
          c.ko.sf = [tie(w[0], w[1], 'Semi-final'), tie(w[2], w[3], 'Semi-final')];
          announce('the semi-finals', c.ko.sf);
        }
      }
      return c.ko.sf;
    }
    if (stage === 'F') {
      if (!c.ko.final) {
        const w = winners('sf');
        if (!w) return [];
        c.ko.final = tie(w[0], w[1], 'Final', true);
      }
      return [c.ko.final];
    }
    return [];
  }

  // Called by Season.apply for every cup/continental result
  // What a result is worth. A domestic cup pays its fund down the rounds (FM.Finance.cupPayout); a regional cup a small
  // share of a flat figure; a continental or world cup a part of its prize fund for each group win and knockout win.
  const pay = (id, amt, c, why) => FM.Finance.prize(S().clubs[id], amt, `${c.name} ${why}`);
  Cu.roundOf = (c, fx) =>
    (c.rounds || []).find((r) => [...(r.ties || []), ...(r.ties2 || [])].some((f) => f.id === fx.id));
  Cu.purse = function (c, fx, w) {
    if (c.type === 'regional') return 2e5 * 0.2;
    if (c.type === 'cup') {
      const r = Cu.roundOf(c, fx);
      return FM.Finance.cupPayout(c.prize || 3e6, c.clubs.length, r ? r.ties.length : 8);
    }
    return (c.prize || 0) * 0.25;
  };
  Cu.onResult = function (fx) {
    const c = S().comps[fx.comp],
      r = fx.res;
    Cu.note(c, fx); // (the nation's coefficient)
    if (fx.group) {
      const g = c.groups.find((x) => x.name === fx.group);
      FM.Season.updTable(g.table, fx, r);
      const w = r.hg > r.ag ? fx.h : r.ag > r.hg ? fx.a : null,
        amt = (c.prize || 0) * 0.1;
      if (w) pay(w, amt, c, 'group wins');
      else {
        pay(fx.h, amt / 3, c, 'group wins');
        pay(fx.a, amt / 3, c, 'group wins');
      }
      return;
    }
    if (fx.q) {
      // a qualifying tie: a small purse for the club that goes through
      if (Cu.decides(fx)) pay(winnerOf(fx), (c.prize || 0) * 0.015, c, 'qualifying');
      return;
    }
    if (!Cu.decides(fx)) return; // a first leg: nothing yet
    const w = winnerOf(fx),
      l = w === fx.h ? fx.a : fx.h;
    pay(w, Cu.purse(c, fx, w), c, 'knockout wins'); // (the title's prize is paid in Cu.finish)
    if (fx.final) Cu.finish(c, w, l);
  };
  // (the tail of Cu.finish below: a Summer Cup final hands out its European places)

  Cu.finish = function (c, w, l) {
    const club = S().clubs[w];
    c.winner = w;
    c.runnerUp = l;
    c.lastFinal = { w, r: l, year: S().year };
    if (c.type === 'continental' || c.type === 'world') {
      // (the winners of every season, for the World Club Championship's places and the competition's history)
      S().contHist = S().contHist || [];
      S().contHist.push({ id: c.id, year: S().year, w, r: l });
      if (c.type === 'continental') Cu.noteSeason(c);
    }
    if (FM.Records) FM.Records.finishComp(c); // its awards and team of the tournament
    club.titles[c.id] = (club.titles[c.id] || 0) + 1;
    pay(w, c.type === 'cup' ? (c.prize || 0) * 0.25 : c.prize || 0, c, c.type === 'cup' ? 'winners' : 'title'); // (a domestic cup's ladder has paid most of its fund by now)
    W.nudgeRep(
      club,
      c.type === 'regional' ? 0.5 : c.type === 'super' ? 1 : c.type === 'cup' ? 2 : c.type === 'world' ? 4 : 5,
    );
    club.fanMood = Math.min(100, club.fanMood + 15);
    if (W.isUser(w)) {
      if (c.type !== 'regional') S().user.stats.trophies++; // (a county cup is an honour, not a trophy of the season)
      S().user.rep = Math.min(
        99,
        S().user.rep + (c.type === 'regional' ? 1 : c.type === 'cup' || c.type === 'super' ? 4 : 8),
      );
      club.boardConf = Math.min(100, club.boardConf + 15);
    }
    if (c.euro === 'summer') Cu.summerPlaces(c);
    if (c.type === 'regional' && !W.isUser(w)) return; // (another club's county cup is not news)
    FM.Stories.share({
      kicker:
        c.type === 'world'
          ? 'CHAMPIONS OF THE WORLD'
          : c.type === 'super'
            ? 'SUPER CUP WINNERS'
            : c.type === 'continental'
              ? 'CHAMPIONS OF THE CONTINENT'
              : 'CUP WINNERS',
      title: `${club.name} win the ${c.name}`,
      sub: `${S().clubs[l].name} beaten in the final. Title number ${club.titles[c.id]}.`,
      big: c.type === 'world' ? 'globe' : 'trophy',
      clubId: w,
    });
  };

  // Knockout fixtures of a continental/world cup in order (legs included)
  Cu.koList = (c) =>
    c.ko
      ? [
          ...(c.ko.po || []),
          ...(c.ko.r16 || []),
          ...(c.ko.qf || []),
          ...(c.ko.qf2 || []),
          ...(c.ko.sf || []),
          ...(c.ko.sf2 || []),
          c.ko.final,
          c.ko.final2,
        ].filter(Boolean)
      : [];

  // Everything a club could have played this season (for match reports)
  Cu.allFixtures = function () {
    const out = [];
    for (const c of Object.values(S().comps)) {
      if (c.type === 'league') {
        out.push(...(c.fixtures || []).flat());
        if (c.playoff) out.push(...c.playoff.sf, ...(c.playoff.sf2 || []), c.playoff.final, c.playoff.final2);
      }
      if (c.type === 'cup') (c.rounds || []).forEach((r) => out.push(...r.ties, ...(r.ties2 || [])));
      if (c.type === 'regional') out.push(...FM.Regional.allFixtures(c));
      if (c.type === 'continental' || c.type === 'world')
        (c.groups || []).forEach((g) => out.push(...g.fixtures.flat()));
      if (c.type === 'continental' || c.type === 'world') out.push(...Cu.koList(c), ...Cu.qualList(c));
      if (c.type === 'super' && c.fx) out.push(c.fx);
    }
    return out.filter(Boolean);
  };
  // Knockout-only lookup (cheap: used to find a tie's first leg)
  Cu.findFixture = function (id) {
    for (const c of Object.values(S().comps)) {
      if (c.type === 'league' && c.playoff) {
        const f = [...c.playoff.sf, ...(c.playoff.sf2 || []), c.playoff.final].find((x) => x && x.id === id);
        if (f) return f;
      }
      for (const t of Object.values(S().relTies || {})) {
        const f = [t.leg1, t.leg2].find((x) => x && x.id === id);
        if (f) return f;
      }
      if (c.type === 'continental' || c.type === 'world') {
        const f = [...Cu.koList(c), ...Cu.qualList(c)].find((x) => x.id === id);
        if (f) return f;
      }
    }
    return FM.Intl.findFixture ? FM.Intl.findFixture(id) : null;
  };

  // Which cups a club is still involved in (for home screen chips)
  Cu.status = function (clubId) {
    const out = [];
    const mine = (f) => f.h === clubId || f.a === clubId;
    for (const c of W.cups()) {
      if (!c.clubs.includes(clubId)) continue;
      if (c.winner === clubId) {
        out.push({ c, text: 'Winners' });
        continue;
      }
      const last = c.rounds[c.rounds.length - 1];
      const tie = last && (last.ties2 || last.ties).find(mine);
      const out1 = c.rounds.some((r) => (r.ties2 || r.ties).some((f) => f.res && mine(f) && winnerOf(f) !== clubId));
      out.push({
        c,
        text: out1 ? 'Knocked out' : tie ? last.name : last ? `Through to next round` : 'Awaiting draw',
        alive: !out1,
      });
    }
    for (const c of FM.Regional.regionals()) {
      const st = FM.Regional.status(c, clubId);
      if (st) out.push({ c, ...st });
    }
    for (const c of W.continentals().concat(W.worldCups())) {
      // a club in the qualifying rounds (it is not in the cup until it is through)
      if (c.qual && !c.clubs.includes(clubId) && c.qual.pool.includes(clubId)) {
        const ties = Cu.qualList(c).filter(mine),
          last = ties[ties.length - 1],
          out1 = ties.some((f) => f.res && Cu.decides(f) && winnerOf(f) !== clubId);
        out.push({
          c,
          text: out1 ? 'Out in qualifying' : last ? last.po.replace(/ · .*$/, '') : 'Awaiting the qualifying draw',
          alive: !out1,
        });
        continue;
      }
      if (!c.clubs.includes(clubId)) continue;
      if (c.winner === clubId) {
        out.push({ c, text: 'Winners' });
        continue;
      }
      const ko = Cu.koList(c);
      const koOut = ko.some((f) => f.res && mine(f) && Cu.decides(f) && winnerOf(f) !== clubId);
      const inKO = ko.some(mine);
      const stageName =
        c.ko.final && mine(c.ko.final)
          ? 'Final'
          : [...c.ko.sf, ...(c.ko.sf2 || [])].some(mine)
            ? 'Semi-finals'
            : (c.ko.qf || []).some(mine) || !(c.ko.r16 || []).length
              ? 'Quarter-finals'
              : 'Round of 16';
      if (c.type === 'world' && !(c.groups && c.groups.length)) {
        out.push({ c, text: koOut ? 'Knocked out' : stageName, alive: !koOut });
        continue;
      }
      if (!c.groups || !c.groups.length) {
        // (the groups are not drawn yet: the qualifying rounds come first)
        out.push({ c, text: 'Direct entry to the groups', alive: true });
        continue;
      }
      const g = c.groups.find((x) => x.clubs.includes(clubId));
      const pos = Cu.groupTable(g).findIndex((r) => r.id === clubId) + 1;
      const groupsDone = g.fixtures.flat().every((f) => f.res);
      const mark = !groupsDone && Cu.groupMarks(g, c.groups.length > 4, c.id)[clubId];
      out.push({
        c,
        text: koOut
          ? 'Knocked out'
          : inKO
            ? stageName
            : groupsDone
              ? pos <= 2
                ? 'Through to the knockouts'
                : 'Out in the groups'
              : mark === 'top'
                ? `Group ${g.name}: won`
                : mark === 'through'
                  ? `Group ${g.name}: through`
                  : mark === 'out'
                    ? 'Out in the groups'
                    : `Group ${g.name}: ${U.ordinal(pos)}`,
        alive: !koOut && mark !== 'out' && (inKO || !groupsDone || pos <= 2),
      });
    }
    return out;
  };
  // ---------- Places in the continental cups by nation coefficient ----------
  // A nation's places in its part of the world's cups depend on how its clubs have done there. Every match in a continental cup
  // earns its club's nation points (2 for a win, 1 for a draw); a nation's coefficient is the last five seasons' points divided by
  // the clubs that took part each season (the UEFA method), and a new world starts with five seasons' worth made from its places.
  // At the end of each season the nations are ranked by it and the places (the same set the world began with: the main cup's,
  // the second and third cups') are handed out again in that order, so a nation that does well climbs and one that fails slips.
  // (S.fixedSpots keeps the places a world was given.) Each nation's tuple is [main cup, second cup, third cup...].
  const REGION_OF = {
    EUR: 'Europe',
    SAM: 'South America',
    ASIA: 'Asia',
    AFR: 'Africa',
    NAM: 'North America',
    OFC: 'Asia',
  };
  Cu.regionName = (nat) => REGION_OF[FM.Intl.baseConfed(nat)];
  // the cups of each part of the world, the main cup first
  Cu.spotFamilies = () => {
    const out = {};
    D.CONTINENTALS.filter((cc) => (cc.tier || 1) <= 3).forEach((cc) =>
      (out[cc.region] = out[cc.region] || []).push(cc),
    ); // (the main cup and the next two: the lower cups keep their own places)
    Object.values(out).forEach((a) => a.sort((x, y) => (x.tier || 1) - (y.tier || 1)));
    return out;
  };
  // the places a second or third cup gives each league (a world's own copy once the places have moved)
  Cu.feedersOf = (cc) => {
    const comp = S() && S().comps && S().comps[cc.id];
    return (comp && comp.feeders) || cc.feeders || {}; // (a cup the editor made may name its places by league rule, with no list)
  };
  const ccStore = () => (S().cc = S().cc || { pts: {}, clubs: {}, seed: {} });
  // a continental match: its clubs' nations earn points
  Cu.note = function (c, fx) {
    if (c.type !== 'continental') return;
    const r = fx.res,
      cc = ccStore(),
      y = S().year;
    for (const [id, pts] of [
      [fx.h, r.hg > r.ag ? 2 : r.hg === r.ag ? 1 : 0],
      [fx.a, r.ag > r.hg ? 2 : r.hg === r.ag ? 1 : 0],
    ]) {
      const club = S().clubs[id];
      if (!club || !club.nat) continue;
      const p = (cc.pts[club.nat] = cc.pts[club.nat] || {}),
        k = (cc.clubs[club.nat] = cc.clubs[club.nat] || {});
      p[y] = (p[y] || 0) + pts;
      const list = (k[y] = k[y] || []);
      if (!list.includes(id)) list.push(id);
    }
  };
  // a nation's coefficient: the last five seasons (a season not yet played counts as the nation's starting level)
  Cu.coef = function (nat, year = S().year) {
    const cc = ccStore();
    let sum = 0;
    for (let y = year - 4; y <= year; y++) {
      const pts = cc.pts[nat] && cc.pts[nat][y];
      sum += pts != null ? pts / Math.max(1, cc.clubs[nat][y].length) : cc.seed[nat] != null ? cc.seed[nat] : 3;
    }
    return Math.round(sum * 100) / 100;
  };
  // the leagues that share a part of the world's cups: the top tiers of its nations
  const spotLeagues = (region, main) =>
    W.leagues().filter(
      (l) => l.tier === 1 && Cu.regionName(l.nat) === region && (!l.rules.qualify || l.rules.qualify.to === main.id),
    );
  const tupleOf = (l, cups) =>
    cups.map((cc, i) => (i === 0 ? (l.rules.qualify && l.rules.qualify.n) || 0 : Cu.feedersOf(cc)[l.id] || 0));
  // every league's places now, by part of the world (the first time it is asked, they are the places the world began with)
  Cu.spots = function () {
    const s = S();
    s.spots = s.spots || {};
    const fam = Cu.spotFamilies();
    for (const [region, cups] of Object.entries(fam)) {
      const leagues = spotLeagues(region, cups[0]);
      if (!leagues.length || s.spots[region]) continue;
      const base = leagues.map((l) => tupleOf(l, cups));
      s.spots[region] = base;
      const weight = (t) => t[0] * 3 + (t[1] || 0) * 1.5 + (t[2] || 0) * 0.8;
      const top = Math.max(1, ...base.map(weight));
      leagues.forEach((l, i) => (ccStore().seed[l.nat] = Math.round((3 + (9 * weight(base[i])) / top) * 100) / 100));
    }
    return fam;
  };
  // Hand the places out again by coefficient. Returns what changed: [{ league, region, from, to }]
  Cu.reallocate = function () {
    const s = S();
    if (s.fixedSpots) return [];
    const fam = Cu.spots(),
      changes = [];
    for (const [region, cups] of Object.entries(fam)) {
      const leagues = spotLeagues(region, cups[0]),
        base = s.spots[region];
      if (!base || leagues.length < 2 || base.length !== leagues.length) continue; // (leagues added or taken out since: left as they are)
      const templates = base.map((t) => t.slice());
      templates.sort((a, b) => b[0] - a[0] || (b[1] || 0) - (a[1] || 0) || (b[2] || 0) - (a[2] || 0));
      const ranked = leagues
        .map((l, i) => ({ l, i, c: Cu.coef(l.nat) }))
        .sort((a, b) => b.c - a.c || a.i - b.i)
        .map((x) => x.l);
      ranked.forEach((l, i) => {
        const before = tupleOf(l, cups),
          t = templates[i];
        if (t[0] > 0) l.rules.qualify = { to: cups[0].id, n: t[0] };
        else delete l.rules.qualify;
        cups.slice(1).forEach((cc, k) => {
          const comp = s.comps[cc.id];
          if (!comp) return;
          if (!comp.feeders || comp.feeders === cc.feeders) comp.feeders = { ...cc.feeders };
          if (t[k + 1] > 0) comp.feeders[l.id] = t[k + 1];
          else delete comp.feeders[l.id];
        });
        if (before.join() !== t.join()) changes.push({ league: l, region, from: before, to: t.slice(0, cups.length) });
      });
    }
    Cu.reallocateRegional();
    return changes;
  };
  // The regional club cups (the Carpathian Cup, the Southeast Asian Club Cup, the Gulf Club Cup and the rest, below the main
  // continental cups) hand their places out by coefficient too: the same set of places the world began with, given in the order of
  // the nations' coefficients, so a nation whose clubs do well in them (and in the big cups) climbs the ranking and one whose clubs
  // fail slips. S.spotsRegional keeps the places each cup began with.
  Cu.reallocateRegional = function () {
    const s = S();
    if (s.fixedSpots) return;
    s.spotsRegional = s.spotsRegional || {};
    for (const cc of D.CONTINENTALS) {
      if (!((cc.tier || 1) >= 4 && cc.feeders)) continue;
      const comp = s.comps[cc.id];
      if (!comp) continue;
      const ids = Object.keys(cc.feeders).filter((id) => s.comps[id] && s.comps[id].nat);
      if (ids.length < 2) continue;
      if (!s.spotsRegional[cc.id]) s.spotsRegional[cc.id] = ids.map((id) => cc.feeders[id]);
      const base = s.spotsRegional[cc.id];
      if (base.length !== ids.length) continue; // (leagues added or taken out since: left as they are)
      const places = base.slice().sort((a, b) => b - a);
      const next = {};
      ids
        .map((id, i) => ({ id, i, c: Cu.coef(s.comps[id].nat) }))
        .sort((a, b) => b.c - a.c || a.i - b.i)
        .forEach((x, k) => {
          if (places[k] > 0) next[x.id] = places[k];
        });
      comp.feeders = next;
    }
  };
  // The ranking for a part of the world, best first: [{ league, nat, coef, places: [main, second, third...] }]
  Cu.spotTable = function (region) {
    const fam = Cu.spots(),
      cups = fam[region];
    if (!cups) return [];
    return spotLeagues(region, cups[0])
      .map((l) => ({ league: l, nat: l.nat, coef: Cu.coef(l.nat), places: tupleOf(l, cups) }))
      .sort((a, b) => b.coef - a.coef);
  };
})();
