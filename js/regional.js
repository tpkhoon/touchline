// Regional competitions: the English county cups and the Brazilian state championships. Small early-season
// tournaments among the clubs of one area, played on their own days. A county cup is a knockout among the county's
// clubs from every division (the big clubs send a reserve side, as they do); a state championship is a league phase
// among the area's clubs and then a final between the top two. The clubs are listed by code (the part of an id after
// c_). Where a state has too few clubs of its own in this world, neighbours play together.
(function () {
  const FM = window.FM,
    U = FM.U,
    D = FM.D,
    W = FM.W;
  const Rg = (FM.Regional = {});
  const S = () => FM.S;

  // [id, nation, format ('ko' knockout, 'rr' league phase and a final), name, short, club codes]
  D.REGIONS = [
    [
      'ENG_LON',
      'ENG',
      'ko',
      'Chelington Senior Cup',
      'CHEC',
      'ARS CHE TOT WHU CRY FUL BRE QPR MIL CHA LEY WIM BNT BRO',
    ],
    ['ENG_MAN', 'ENG', 'ko', 'Baywick Senior Cup', 'BAYC', 'MCI MUN SAL OLD STO'],
    ['ENG_LAN', 'ENG', 'ko', 'Ryeworth Senior Cup', 'RYEC', 'BUR BLB PNE BLP BWA WIG ACS FLE BRW'],
    ['ENG_LIV', 'ENG', 'ko', 'Clifwold Senior Cup', 'CLIC', 'LIV EVE TRA'],
    ['ENG_BIR', 'ENG', 'ko', 'Everwich Senior Cup', 'EVEC', 'AVL BIR WBA WOL WAL COV'],
    ['ENG_STA', 'ENG', 'ko', 'South Bexwell Senior Cup', 'SOUC', 'STK PVA BRT CREW SHR'],
    ['ENG_EMD', 'ENG', 'ko', 'Epington Senior Cup', 'EPIC', 'NFO NCO DER LEI MNS CHF LIN GRI NTN'],
    ['ENG_SHF', 'ENG', 'ko', 'North Litworth Senior Cup', 'NORC', 'SHU SHW BNS ROT DON'],
    ['ENG_YOR', 'ENG', 'ko', 'Selstow Senior Cup', 'SELC', 'LEE HUD BFD HARR HUL'],
    ['ENG_NE', 'ENG', 'ko', 'Rodstead Senior Cup', 'RODC', 'NEW SUN MID'],
    ['ENG_SOU', 'ENG', 'ko', 'Calgate Senior Cup', 'CALC', 'SOU POM BOU BHA CRAW'],
    ['ENG_EAS', 'ENG', 'ko', 'Grenwold Senior Cup', 'GREC', 'IPS NCI CAMU COL GILL WAT STV LUT PBO'],
    ['ENG_WES', 'ENG', 'ko', 'Reysey Senior Cup', 'REYC', 'BRC BRR SWI CHT PLY EXE'],
    ['ENG_TV', 'ENG', 'ko', 'Filcombe Senior Cup', 'FILC', 'OXF REA WYC MKD'],
    ['BRA_RJ', 'BRA', 'rr', 'Campeonato Ibipe', 'IBIC', 'FLA BOT FLU VAS'],
    ['BRA_SP', 'BRA', 'rr', 'Campeonato Guarama', 'GUAC', 'PAL COR SAO SAN RBB MSL'],
    ['BRA_RS', 'BRA', 'rr', 'Campeonato Guina', 'GUIC', 'GRE SCI JVD'],
    ['BRA_MG', 'BRA', 'rr', 'Campeonato Pitangaçu', 'PITC', 'CAM CRU'],
    ['BRA_NE', 'BRA', 'rr', 'Campeonato Ubatia', 'UBAC', 'BAH VIT FTZ CEA SPT'],
  ];
  const compId = (r) => 'R_' + r[0];
  Rg.compId = compId;

  // Saves and new worlds both get the competitions; their clubs and draws are made each season
  Rg.ensure = function (s) {
    for (const r of D.REGIONS) {
      const id = compId(r);
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
  const def = (c) => D.REGIONS.find((r) => r[0] === c.region);
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
