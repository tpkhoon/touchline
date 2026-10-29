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
    ['ENG_1', 'ENG', 'rr', 'Southern England Cup', 'ENGA', 'RED CAL TET QUA CHC'],
    ['ENG_2', 'ENG', 'rr', 'South-Eastern England Cup', 'ENGB', 'CHE FIL BRA TAD EVE'],
    ['ENG_3', 'ENG', 'rr', 'North-Western England Cup', 'ENGC', 'MER EPI CLI CLC BAA'],
    ['ENG_4', 'ENG', 'rr', 'Northern England Cup', 'ENGD', 'BAY RYE SEL CAR ROD'],
    ['ESP_1', 'ESP', 'rr', 'Copa Suroeste', 'ESPA', 'ALC ALB BEN OLC OLM'],
    ['ESP_2', 'ESP', 'rr', 'Copa Noroeste', 'ESPB', 'OSU MOD JUR CUE COR'],
    ['ESP_3', 'ESP', 'rr', 'Copa Sureste', 'ESPC', 'SOR MOF MNT JUC PLA'],
    ['ESP_4', 'ESP', 'rr', 'Copa Noreste', 'ESPD', 'CRV CER JUV ARR LIO'],
    ['GER_1', 'GER', 'rr', 'Südwestpokal', 'GERA', 'FOR BRU GER VID MUH'],
    ['GER_2', 'GER', 'rr', 'Südpokal', 'GERB', 'VIB HAF GEB DIL'],
    ['GER_3', 'GER', 'rr', 'Nordwestpokal', 'GERC', 'FSV UNT TEU BRF BER'],
    ['GER_4', 'GER', 'rr', 'Nordostpokal', 'GERD', 'BRG PRE VIK SPB'],
    ['FRA_1', 'FRA', 'rr', "Coupe de l'Ouest", 'FRAA', 'LAN LUR VEA LUO VAL'],
    ['FRA_2', 'FRA', 'rr', 'Coupe du Nord-Ouest', 'FRAB', 'ESJ QUI QUR EST'],
    ['FRA_3', 'FRA', 'rr', 'Coupe du Sud-Est', 'FRAC', 'LUN ESB AJC JOY ROC'],
    ['FRA_4', 'FRA', 'rr', 'Coupe du Nord-Est', 'FRAD', 'THO VAR ETO USM'],
    ['ITA_1', 'ITA', 'rr', "Coppa dell'Ovest", 'ITAA', 'FRS ORV PRF GUB VIR'],
    ['ITA_2', 'ITA', 'rr', 'Coppa del Nordovest', 'ITAB', 'TRS PRO USP TRE FRA'],
    ['ITA_3', 'ITA', 'rr', 'Coppa del Sudest', 'ITAC', 'VIC MON BEL USB AUM'],
    ['ITA_4', 'ITA', 'rr', 'Coppa del Nordest', 'ITAD', 'USF AUD VIO AUV MIR'],
    ['POR_1', 'POR', 'rr', 'Taça do Sudoeste', 'PORA', 'ALE ESO COV LEI TOM'],
    ['POR_2', 'POR', 'rr', 'Taça do Centro', 'PORB', 'POA POR CVA MAR'],
    ['POR_3', 'POR', 'rr', 'Taça do Nordeste', 'PORC', 'LEF ESP UNI GMR SES'],
    ['POR_4', 'POR', 'rr', 'Taça do Nordeste 2', 'PORD', 'CAM GRP GOU SAN'],
    ['NED_1', 'NED', 'rr', 'Zuidwestbeker', 'NEDA', 'RKH ZAA ADO ZAS NIE'],
    ['NED_2', 'NED', 'rr', 'Zuidoostbeker', 'NEDB', 'KLE DVC VVG VIT'],
    ['NED_3', 'NED', 'rr', 'Noordwestbeker', 'NEDC', 'VVZ RKC KVA LGD EXH'],
    ['NED_4', 'NED', 'rr', 'Noordoostbeker', 'NEDD', 'MAA EXC KLF WAA'],
    ['ARG_1', 'ARG', 'rr', 'Copa Sureste', 'ARGA', 'PUE VEL FRC SPO'],
    ['ARG_2', 'ARG', 'rr', 'Copa Sureste 2', 'ARGB', 'ARC DEP BUS'],
    ['ARG_3', 'ARG', 'rr', 'Copa Sureste 3', 'ARGC', 'IND NAO REQ DEF'],
    ['ARG_4', 'ARG', 'rr', 'Copa Sureste 4', 'ARGD', 'NAD GIM LEZ'],
    ['ARG_5', 'ARG', 'rr', 'Copa Oeste', 'ARGE', 'GAP COF REG QRZ'],
    ['ARG_6', 'ARG', 'rr', 'Copa Sureste 5', 'ARGF', 'URQ PEC INF'],
    ['ARG_7', 'ARG', 'rr', 'Copa Noroeste', 'ARGG', 'GAR CAS DOR DOM'],
    ['ARG_8', 'ARG', 'rr', 'Copa Noroeste 2', 'ARGH', 'DFN TOR NCN'],
    ['USA_1', 'USA', 'rr', 'Western United States Cup', 'USAA', 'CED SIL SIA PRA'],
    ['USA_2', 'USA', 'rr', 'Western United States Cup 2', 'USAB', 'BEA BLU SUN EAG'],
    ['USA_3', 'USA', 'rr', 'Southern United States Cup', 'USAC', 'ASE BLS PIN CAN'],
    ['USA_4', 'USA', 'rr', 'North-Western United States Cup', 'USAD', 'GOP MAP HIC'],
    ['USA_5', 'USA', 'rr', 'South-Eastern United States Cup', 'USAE', 'ASP SPR LAK WHI'],
    ['USA_6', 'USA', 'rr', 'Eastern United States Cup', 'USAF', 'FOF PNF GOR MIL'],
    ['USA_7', 'USA', 'rr', 'Eastern United States Cup 2', 'USAG', 'SUS CHM REN FOS'],
    ['USA_8', 'USA', 'rr', 'Eastern United States Cup 3', 'USAH', 'FRT GRU SUM'],
    ['JPN_1', 'JPN', 'rr', 'Western Japan Cup', 'JPNA', 'KIK SHI NAA NIS MAC'],
    ['JPN_2', 'JPN', 'rr', 'Central Japan Cup', 'JPNB', 'MAT HOK FUJ MTS OKA'],
    ['JPN_3', 'JPN', 'rr', 'Eastern Japan Cup', 'JPNC', 'MAS ASA SAK AKI AKM'],
    ['JPN_4', 'JPN', 'rr', 'Eastern Japan Cup 2', 'JPND', 'SHF HIG HIS NAG KIT'],
    ['KSA_1', 'KSA', 'rr', 'Southern Saudi Arabia Cup', 'KSAA', 'RIA SAQ YAS SAR WAF'],
    ['KSA_2', 'KSA', 'rr', 'Eastern Saudi Arabia Cup', 'KSAB', 'JAN SAH TAQ IBD'],
    ['KSA_3', 'KSA', 'rr', 'North-Western Saudi Arabia Cup', 'KSAC', 'UFU NAK RAY DHI SAA'],
    ['KSA_4', 'KSA', 'rr', 'North-Eastern Saudi Arabia Cup', 'KSAD', 'HAD ASL HAQ FUR'],
  ];
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
