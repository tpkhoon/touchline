// @ts-check
// Regional competitions: the Brazilian state championships and regional cups in England, Spain, Germany, France, Italy, Portugal,
// the Netherlands, Argentina, the United States, Japan and Saudi Arabia (the top flight split by geography into areas of up to six).
// Small early-season tournaments among the clubs of one area, played on their own days. A state championship is a league phase among the area's clubs and then a final
// between the top two (an area can also be a knockout, 'ko', as the English county cups were: none is left). The clubs
// are listed by code (the part of an id after c_). Where a state has too few clubs of its own in this world, neighbours play together.
(function () {
  const FM = window.FM,
    U = FM.U,
    D = FM.D,
    W = FM.W;
  const Rg = (FM.Regional = /** @type {any} */ ({}));
  const S = () => FM.S;

  // [id, nation, format ('ko' knockout, 'rr' league phase and a final), name, short, club codes]
  D.AREAS = [
    ['BRA_RJ', 'BRA', 'rr', 'Campeonato Vila Maramirim', 'VILC', 'VIL VIM UNP NAC'],
    ['BRA_SP', 'BRA', 'rr', 'Campeonato Guarama', 'GUAC', 'GUA GUF GRE URU IPA CAT'],
    ['BRA_RS', 'BRA', 'rr', 'Campeonato Guina', 'GUIC', 'UNG GUI GRA'],
    ['BRA_MG', 'BRA', 'rr', 'Campeonato Pitangaçu', 'PITC', 'PIT PIA'],
    ['BRA_NE', 'BRA', 'rr', 'Campeonato Ubatia', 'UBAC', 'UBA UBE JAB JAC JAF'],
  ];
  // The regional cups of the countries beyond Brazil: a nation's top flight grouped by the real region of each club (js/regions.js).
  // A region with three to six clubs is a cup of its own; a larger one is split in two or more along its longer side, and a region
  // with fewer joins its nearest neighbour (up to six clubs), so a cup is named for the regions it covers: the Bavarian Cup, the
  // Yorkshire and North East Cup, the Corsican clubs with Provence.
  const REGIONAL_NATS = {
    ENG: 'en',
    ESP: 'es',
    GER: 'de',
    FRA: 'fr',
    ITA: 'it',
    POR: 'pt',
    NED: 'nl',
    ARG: 'es',
    USA: 'en',
    JPN: 'en',
    KSA: 'en',
  };
  const CUP_NAME = {
    en: (r) => `${r} Cup`,
    es: (r) => `Copa ${r}`,
    de: (r) => `${r} Pokal`,
    fr: (r) => `Coupe ${r}`,
    it: (r) => `Coppa ${r}`,
    pt: (r) => `Taça ${r}`,
    nl: (r) => `${r} Beker`,
  };
  const joinNames = (a) => (a.length < 2 ? a[0] : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
  const centre = (g) => [
    g.cs.reduce((t, c) => t + c.g[0], 0) / g.cs.length,
    g.cs.reduce((t, c) => t + c.g[1], 0) / g.cs.length,
  ];
  const apart = (a, b) => {
    const p = centre(a),
      q = centre(b);
    return Math.hypot(p[0] - q[0], (p[1] - q[1]) * 0.7);
  };
  const halve = (g) => {
    if (g.cs.length <= 6) return [g];
    const lat = g.cs.map((c) => c.g[0]),
      lng = g.cs.map((c) => c.g[1]),
      k = (Math.max(...lng) - Math.min(...lng)) * 0.7 >= Math.max(...lat) - Math.min(...lat) ? 1 : 0;
    const sorted = g.cs.slice().sort((a, b) => a.g[k] - b.g[k]),
      h = Math.ceil(sorted.length / 2);
    return [...halve({ names: g.names, cs: sorted.slice(0, h) }), ...halve({ names: g.names, cs: sorted.slice(h) })];
  };
  const regionalAreas = () => {
    const out = [];
    for (const l of D.LEAGUES) {
      const lang = REGIONAL_NATS[l.nat];
      if (l.tier !== 1 || !lang || !D.clubRegion) continue;
      const by = new Map();
      for (const r of (D[l.clubs] || []).filter((x) => !x[9])) {
        const g = D.GEO && D.GEO[r[1]],
          region = D.clubRegion({ id: 'c_' + r[1], nat: l.nat });
        if (g && region) by.set(region, (by.get(region) || []).concat([{ code: r[1], g }]));
      }
      let groups = [...by].flatMap(([name, cs]) => halve({ names: [name], cs }));
      const stuck = new Set();
      for (;;) {
        const small = groups
          .filter((g) => g.cs.length < 3 && !stuck.has(g))
          .sort((a, b) => a.cs.length - b.cs.length)[0];
        if (!small) break;
        const near = groups
          .filter(
            (g) =>
              g !== small &&
              g.cs.length + small.cs.length <= 6 &&
              new Set([...g.names, ...small.names]).size <= 3 &&
              apart(small, g) <= 9, // (not across a country: Texas does not join Florida)
          )
          .sort((a, b) => apart(small, a) - apart(small, b))[0];
        if (!near) {
          stuck.add(small);
          continue;
        }
        near.names = [...new Set([...near.names, ...small.names])];
        near.cs = near.cs.concat(small.cs);
        groups = groups.filter((g) => g !== small);
      }
      groups = groups.filter((g) => g.cs.length >= 2).sort((a, b) => a.names.join().localeCompare(b.names.join()));
      // (the pieces of one large region are numbered: Buenos Aires I, II, III)
      const key = (g) => g.names.join('|'),
        pieces = {};
      groups.forEach((g) => (pieces[key(g)] = (pieces[key(g)] || 0) + 1));
      const at = {},
        ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
      groups.forEach((g, i) => {
        const n = (at[key(g)] = (at[key(g)] || 0) + 1);
        out.push([
          `${l.nat}_${i + 1}`,
          l.nat,
          'rr',
          CUP_NAME[lang](joinNames(g.names) + (pieces[key(g)] > 1 ? ' ' + ROMAN[n - 1] : '')),
          l.nat + 'ABCDEFGHIJ'[i],
          g.cs.map((c) => c.code).join(' '),
        ]);
      });
    }
    return out;
  };
  D.AREAS.push(...regionalAreas());
  const compId = (r) => 'R_' + r[0];
  Rg.compId = compId;

  // Saves and new worlds both get the competitions; their clubs and draws are made each season
  Rg.ensure = function (s) {
    // (a competition the world no longer has, the English county cups of older saves, goes)
    for (const id of Object.keys(s.comps))
      if (s.comps[id].type === 'regional' && !D.AREAS.some((r) => compId(r) === id)) delete s.comps[id];
    for (const d of s.calendar || []) if (d.regional && d.comps) d.comps = d.comps.filter((id) => s.comps[id]);
    for (const r of D.AREAS) {
      const id = compId(r);
      if (s.comps[id]) Object.assign(s.comps[id], { name: r[3], short: r[4] }); // (a save from before the regions has the older names)
      if (!s.comps[id])
        s.comps[id] = {
          id,
          type: 'regional',
          region: r[0],
          nat: r[1],
          format: r[2],
          name: r[3],
          short: r[4],
          prize: r[2] === 'ko' ? 1e5 : 8e5,
          clubs: [],
          rounds: [],
          rotate: r[2] === 'ko', // the big clubs of a county field a reserve side
        };
    }
  };
  const def = (c) => D.AREAS.find((r) => r[0] === c.region);
  // The clubs of a region that play in this world (fully or lightly simulated; the minimal leagues have no squads)
  Rg.members = function (c) {
    const r = def(c);
    if (!r) return [];
    return r[5]
      .split(' ')
      .map((code) => S().clubs['c_' + code])
      .filter((x) => x && x.comp && x.sim !== 'minimal' && !x.parent)
      .sort((a, b) => b.rep - a.rep);
  };
  // Calendar days a competition needs
  Rg.daysFor = function (c) {
    const n = Rg.members(c).length;
    if (n < 2) return 0;
    if (c.format === 'ko') {
      const p = 2 ** Math.floor(Math.log2(n));
      return Math.log2(p) + (n === p ? 0 : 1);
    }
    return n === 2 ? 1 : (n % 2 ? n : n - 1) + 1;
  };
  Rg.daysNeeded = () => Math.max(0, ...Rg.regionals().map(Rg.daysFor));
  Rg.regionals = () => Object.values(S().comps).filter((c) => c.type === 'regional');

  const mkTable = (ids) =>
    Object.fromEntries(ids.map((id) => [id, { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, form: [] }]));
  // A new season: fresh entrants and a fresh draw (a state's league phase is drawn now, its final on the day)
  Rg.setupSeason = function () {
    Rg.ensure(S());
    for (const c of Rg.regionals()) {
      c.clubs = Rg.members(c).map((x) => x.id);
      c.rounds = [];
      c.winner = null;
      c.awards = null;
      c.runnerUp = null;
      c.final = null;
      c.cursor = -1;
      c.curDay = -1;
      c.groups = null;
      if (c.format === 'rr' && c.clubs.length >= 3)
        c.groups = [
          {
            name: 'A',
            clubs: c.clubs.slice(),
            table: mkTable(c.clubs),
            fixtures: W.roundRobin(c.clubs)
              .slice(0, c.clubs.length + (c.clubs.length % 2) - 1) // (one leg: the first half of the home-and-away list)
              .map((rd, i) =>
                rd.map(([h, a]) => ({
                  id: FM.nextId('f'),
                  comp: c.id,
                  group: 'A',
                  round: i,
                  h,
                  a,
                  res: null,
                  po: `${c.name} · matchday ${i + 1}`,
                })),
              ),
          },
        ];
    }
  };

  // A reserve side: everyone but the first-choice eleven, when that leaves enough (a keeper among them)
  Rg.reserves = function (clubId) {
    const sq = W.squad(clubId),
      ranked = sq.slice().sort((a, b) => b.ca - a.ca),
      core = new Set(ranked.slice(0, 11)),
      rest = ranked.filter((p) => !core.has(p));
    // a keeper from the senior squad (youth-side players only step up when the first team is short)
    const senior = (p) => p.pos === 'GK' && !(p.team && !p.loan);
    if (!rest.some(senior)) {
      const gk = ranked.filter(senior).pop();
      if (gk) rest.push(gk);
    }
    return rest.length >= 14 && rest.some(senior) ? rest : sq;
  };

  // The fixtures a regional competition plays today
  Rg.fixturesFor = function (c) {
    if (c.winner || c.clubs.length < 2) return [];
    if (c.format === 'ko') {
      const ties = FM.Cups.domestic(c);
      for (const f of ties) if (c.rotate) f.rotate = true;
      return ties;
    }
    const g = c.groups && c.groups[0],
      md = g ? g.fixtures : [],
      day = S().day;
    const current = () => (c.cursor < md.length ? md[c.cursor] : c.final ? [c.final] : []);
    if (c.curDay === day) return current();
    // a new day: move on once what was played last time is finished
    if (c.cursor >= 0 && current().some((f) => !f.res)) return current();
    if (c.cursor + 1 < md.length) {
      c.cursor++;
      c.curDay = day;
      return md[c.cursor];
    }
    if (!c.final) {
      const top = g ? FM.Cups.groupTable(g).map((r) => r.id) : c.clubs,
        [h, a] = [top[0], top[1]];
      c.final = {
        id: FM.nextId('f'),
        comp: c.id,
        h,
        a,
        res: null,
        ko: true,
        final: true,
        po: `${c.name} · final`,
        neutral: false,
      };
      c.cursor = md.length;
      c.curDay = day;
      return [c.final];
    }
    return [];
  };
  // Every fixture of a competition (match reports look them up)
  Rg.allFixtures = (c) =>
    c.format === 'ko'
      ? (c.rounds || []).flatMap((r) => [...r.ties, ...(r.ties2 || [])])
      : [...((c.groups && c.groups[0] && c.groups[0].fixtures.flat()) || []), c.final].filter(Boolean);
  // Where a club stands, for the home screen
  Rg.status = function (c, clubId) {
    if (!c.clubs.includes(clubId)) return null;
    if (c.winner === clubId) return { text: 'Winners', alive: false };
    if (c.winner) return { text: c.runnerUp === clubId ? 'Lost the final' : 'Out', alive: false };
    const mine = (f) => f.h === clubId || f.a === clubId;
    if (c.format === 'ko') {
      const last = c.rounds[c.rounds.length - 1];
      const out = c.rounds.some((r) =>
        (r.ties2 || r.ties).some((f) => f.res && mine(f) && FM.Season.winnerOf(f) !== clubId),
      );
      return {
        text: out ? 'Knocked out' : last ? last.name : 'Awaiting draw',
        alive: !out,
      };
    }
    const g = c.groups && c.groups[0];
    if (c.final) return { text: mine(c.final) ? 'In the final' : 'Out', alive: mine(c.final) };
    if (!g) return { text: 'Final to come', alive: true };
    const pos = FM.Cups.groupTable(g).findIndex((r) => r.id === clubId) + 1;
    return { text: `League phase: ${U.ordinal(pos)}`, alive: true };
  };
})();
