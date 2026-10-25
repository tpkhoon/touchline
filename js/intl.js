// International football: national teams picked from the best players of each nationality, a coefficient ranking,
// two international breaks a season (two matchdays each), qualifying groups in the season before a
// tournament, and the summer finals played as calendar days at the end of the season —
// a World Championship every 4 years, continental championships in the years between.
// The human manager can also take a national team job and play these matches live.
(function () {
  const FM = window.FM,
    U = FM.U,
    D = FM.D,
    W = FM.W;
  const I = (FM.Intl = {});
  const S = () => FM.S;
  // Clubs and national teams share the match engine; this resolves either
  FM.clubOf = (id) => FM.S.clubs[id] || (FM.S.nteams && FM.S.nteams[id]);
  const T = (id) => S().nteams[id];
  // Confederations: each nation belongs to one. The game's own are the parts of the world (England is in Europe); a world can
  // rename them, move nations between them and add confederations of its own (S.confeds: { names: { id: name }, members:
  // { nation code: id } }, from the world editor). Qualifying, the continental championships and the Nations League all go by
  // confederation.
  I.CONFEDS = {
    EUR: 'Europe',
    SAM: 'South America',
    AFR: 'Africa',
    ASIA: 'Asia',
    NAM: 'North America',
    OFC: 'Oceania',
  };
  I.REGION_NAME = I.CONFEDS;
  I.baseConfed = (code) => {
    const n = D.NATIONS[code];
    if (n.confed) return n.confed; // (New Zealand and the island nations: Oceania, though their region is Asia for scouting)
    return n.region === 'ENG' ? 'EUR' : n.region;
  };
  I.region = (code) => {
    const c = S() && S().confeds,
      m = c && c.members && c.members[code];
    return m || I.baseConfed(code);
  };
  I.confedName = (id) => (S() && S().confeds && S().confeds.names && S().confeds.names[id]) || I.CONFEDS[id] || id;
  // The game's confederations, then the world's own
  I.confedIds = () => [
    ...Object.keys(I.CONFEDS),
    ...Object.keys((S() && S().confeds && S().confeds.names) || {}).filter((id) => !I.CONFEDS[id]),
  ];

  // The tournaments are played at their real sizes. The World Championship has 48 teams (twelve groups of four; the winners, the
  // runners-up and the eight best third-placed teams go into a round of 32), the European, African and Asian championships 24
  // (six groups; a round of 16 of the winners, runners-up and four best third-placed teams), the South American and North American
  // 16 (four groups, then the quarter-finals) and Oceania's 8 (two groups, then the semi-finals). Teams are drawn from pots by ranking.
  // pools: [[regions], places]. playoff: places filled by the best-ranked teams of the rest of the world left over (the
  // intercontinental play-offs). direct: no qualifying, the best-ranked nations of the pool go.
  I.TOURNS = {
    world: [
      {
        id: 'WC',
        name: 'World Championship',
        size: 48,
        playoff: 2,
        pools: [
          [['EUR'], 16],
          [['AFR'], 9],
          [['ASIA'], 8],
          [['SAM'], 6],
          [['NAM'], 6],
          [['OFC'], 1],
        ],
      },
    ],
    confed: [{ id: 'CT', name: 'Continental Champions Trophy', size: 8, pools: [], confed: true }],
    continental: [
      { id: 'EC', name: 'European Nations Championship', size: 24, pools: [[['EUR'], 24]] },
      { id: 'SA', name: 'South American Nations Cup', size: 16, guests: { from: 'NAM', n: 6 }, pools: [[['SAM'], 10]] },
      { id: 'AF', name: 'African Nations Cup', size: 24, pools: [[['AFR'], 24]] },
      { id: 'AS', name: 'Asian Nations Cup', size: 24, pools: [[['ASIA'], 24]] },
      { id: 'NA', name: 'North American Nations Cup', size: 16, pools: [[['NAM'], 16]] },
      { id: 'OF', name: 'Oceania Nations Cup', size: 8, direct: true, pools: [[['OFC'], 8]] },
    ],
  };
  // The tournaments of a kind in this world: a confederation of the world's own (four nations or more) gets a place at the World
  // Championship, taken from the biggest part of the world, and a continental championship of its own
  I.tournsFor = function (kind) {
    const base = I.TOURNS[kind] || [],
      extra = I.confedIds().filter(
        (id) =>
          !I.CONFEDS[id] && Object.values((S() && S().nteams) || {}).filter((t) => I.region(t.code) === id).length >= 4,
      );
    if (!extra.length) return base;
    if (kind === 'world')
      return base.map((tn) => {
        const pools = tn.pools.map(([r, n]) => [r.slice(), n]);
        let take = extra.length;
        while (take-- > 0) {
          const big = pools.reduce((m, p) => (p[1] > m[1] ? p : m), pools[0]);
          if (big[1] > 1) big[1]--;
        }
        return { ...tn, pools: pools.concat(extra.map((id) => [[id], 1])) };
      });
    if (kind === 'continental')
      return base.concat(
        extra.map((id) => {
          I.TNAME['X' + id] = `${I.confedName(id)} Championship`;
          return { id: 'X' + id, name: I.TNAME['X' + id], size: 4, pools: [[[id], 4]] };
        }),
      );
    return base;
  };
  I.TNAME = {
    WC: 'World Championship',
    EC: 'European Nations Championship',
    SA: 'South American Nations Cup',
    AF: 'African Nations Cup',
    AS: 'Asian Nations Cup',
    NA: 'North American Nations Cup',
    OF: 'Oceania Nations Cup',
    CT: 'Continental Champions Trophy',
    NL: 'Nations League',
  };

  // Invitational tournaments in the international windows: a host and three invited nations play semi-finals on the first day
  // of the second window and a final and third-place match on the second, like Japan's Cherry Blossom Cup. One a season, in turn, if
  // the host and the invited nations have no qualifier those days.
  // A regional tournament has a pool instead of a host and guests of its own: the host rotates through the pool and the guests are the three best
  // ranked nations of the rest of it (the Southeast Asian, Gulf and East Asian tournaments, which give those nations a calendar of their own)
  I.INVITES = [
    { id: 'KIR', name: 'Cherry Blossom Cup', host: 'JPN' },
    { id: 'SEA', name: 'Southeast Asian Nations Cup', pool: ['THA', 'VIE', 'IDN', 'MYS', 'PHI', 'SGP'] },
    { id: 'KGC', name: 'Golden Elephant Cup', host: 'THA' },
    { id: 'GLF', name: 'Gulf Nations Cup', pool: ['KSA', 'QAT', 'UAE', 'IRN', 'IRQ'] },
    { id: 'NEH', name: 'Monsoon Cup', host: 'IND' },
    { id: 'EAS', name: 'East Asian Nations Cup', pool: ['JPN', 'KOR', 'CHN', 'AUS'] },
    { id: 'CEA', name: 'East African Nations Cup', pool: ['KEN', 'UGA', 'TAN', 'ETH'] },
    { id: 'SAF', name: 'Southern African Nations Cup', pool: ['RSA', 'ZAM', 'ZIM', 'MOZ', 'ANG'] },
    {
      id: 'WAF',
      name: 'West African Nations Cup',
      pool: ['NGA', 'GHA', 'SEN', 'CIV', 'MLI', 'BFA', 'GUI', 'TOG', 'CPV'],
    },
    { id: 'NAF', name: 'North African Nations Cup', pool: ['EGY', 'MAR', 'TUN', 'ALG', 'LBY'] },
    {
      id: 'ARB',
      name: 'Arab Nations Cup',
      pool: ['KSA', 'QAT', 'UAE', 'IRQ', 'JOR', 'EGY', 'MAR', 'TUN', 'ALG', 'KUW', 'OMA', 'BHR'],
    },
    { id: 'CAS', name: 'Central Asian Nations Cup', pool: ['UZB', 'KAZ', 'IRN', 'IND', 'PAK'] },
    { id: 'BAL', name: 'Baltic Cup', pool: ['EST', 'LVA', 'LTU', 'FIN'] },
    { id: 'NOR', name: 'Nordic Nations Cup', pool: ['SWE', 'DEN', 'NOR', 'FIN', 'ISL'] },
    { id: 'BLK', name: 'Balkan Cup', pool: ['SRB', 'CRO', 'BIH', 'ALB', 'MKD', 'MNE', 'SVN', 'BUL', 'ROU', 'GRE'] },
    { id: 'CEU', name: 'Central European Cup', pool: ['CZE', 'SVK', 'HUN', 'POL', 'AUT', 'SVN'] },
    { id: 'CEL', name: 'Celtic Nations Cup', pool: ['SCO', 'WAL', 'IRL', 'NIR'] },
    { id: 'CAU', name: 'Caucasus Cup', pool: ['GEO', 'ARM', 'AZE', 'TUR'] },
    { id: 'CCA', name: 'Central American and Caribbean Cup', pool: ['CRC', 'HON', 'PAN', 'GUA', 'SLV', 'JAM', 'TRI'] },
    { id: 'AND', name: 'Andean Cup', pool: ['COL', 'ECU', 'PER', 'BOL', 'VEN', 'CHI'] },
    { id: 'PLA', name: 'River Plate Cup', pool: ['ARG', 'URU', 'PAR', 'BRA', 'CHI'] },
  ];
  I.TNAME.KIR = 'Cherry Blossom Cup';
  I.TNAME.SEA = 'Southeast Asian Nations Cup';
  I.TNAME.KGC = 'Golden Elephant Cup';
  I.TNAME.GLF = 'Gulf Nations Cup';
  I.TNAME.NEH = 'Monsoon Cup';
  I.TNAME.EAS = 'East Asian Nations Cup';
  for (const v of I.INVITES) I.TNAME[v.id] = v.name;
  I.INVITE_IDS = I.INVITES.map((v) => v.id); // (what the game has: a world definition may play fewer, but its history still names them)

  // Every nation can field a team. A nation whose players the world didn't happen to give enough of (Malaysia, the
  // Philippines, a small Balkan side) is topped up with players who play outside the game's leagues: unattached, so they
  // show as free agents (any club can sign them) but still play for their country. Run at the start of a world and each
  // summer, as retirements thin a squad.
  I.MIN_POOL = 18;
  const SLOTS = [
    'GK',
    'GK',
    'CB',
    'CB',
    'FB',
    'FB',
    'DM',
    'CM',
    'CM',
    'AM',
    'W',
    'W',
    'ST',
    'ST',
    'CB',
    'CM',
    'FB',
    'ST',
    'W',
    'DM',
  ];
  I.topUp = function (all) {
    const s = S();
    for (const code in D.NATIONS) {
      if (!D.nationOn(code)) continue;
      if (!all && !(s.nteams && s.nteams['n_' + code])) continue; // (a world's later summers: only nations that have a team)
      const have = I.pool(code).length;
      if (have >= I.MIN_POOL) continue;
      for (let i = 0; i < I.MIN_POOL - have; i++) {
        const age = U.randi(20, 33),
          ca = Math.round(U.clamp(U.gauss(50, 5), 38, 62)),
          p = W.genPlayer({ nat: code, pos: SLOTS[i % SLOTS.length], age, ca, pa: W.potentialFor(ca, age) });
        p.contract = s.year;
        p.freeSince = FM.Season.dayIndex();
        s.players[p.id] = p;
      }
    }
    W.rosterVer++; // (the nations' pools are worked out again: a nation with no players had none cached)
  };
  // Everyone in a national squad (the top 23 of each nation's pool), whether or not he has a club: unattached
  // internationals are not cleared out with the other free agents
  I.squadIds = () =>
    new Set(
      Object.values(S().nteams || {}).flatMap((t) =>
        I.pool(t.code)
          .slice(0, 23)
          .map((p) => p.id),
      ),
    );

  I.setup = function () {
    const s = S();
    s.nteams = {};
    s.intlLog = [];
    I.topUp(true);
    for (const code in D.NATIONS) {
      if (!D.nationOn(code)) continue;
      if ((s.noTeams || []).includes(code)) continue; // (the world gave it no national team)
      const N = D.NATIONS[code];
      // a nation too thin in players to field a squad has no national team in this world (its players still play)
      if (I.pool(code).length < 16) continue;
      s.nteams['n_' + code] = {
        id: 'n_' + code,
        code,
        name: N.name,
        short: code,
        nat: code,
        city: N.name,
        colors: D.NT_COLORS[code] || ['#FFFFFF', '#000000'],
        sim: 'nation',
        rep: 60,
        coef: 50,
        tactic: W.newTactic('4-3-3', 'Short', 'Mid Block'),
        titles: {},
        facilities: { medical: 3 },
        fanMood: 60,
        form: [],
        caps: {},
      };
    }
    Object.values(s.nteams).forEach((t) => {
      t.coef = Math.round(50 + (I.rating(t.code) - 62) * 2.2 * 10) / 10;
      t.rep = I.repFromCoef(t.coef);
    });
    I.seedCaps();
    I.newSeason();
  };
  // A new world starts with national teams that have been playing: the best players of each nation have caps, and the
  // regulars have played most of the last year's games (work permits and the call-up stories read these)
  I.seedCaps = function () {
    const s = S(),
      games = 12;
    s.intlGames = s.intlGames || {};
    for (const code in D.NATIONS) {
      if (!D.nationOn(code)) continue;
      s.intlGames[code] = { [s.year - 1]: games };
      I.pool(code)
        .slice(0, 23)
        .forEach((p, i) => {
          if (p.intl && p.intl.caps) return;
          const regular = i < 14,
            share = regular ? U.rand(0.5, 0.95) : U.rand(0.05, 0.35),
            seasons = Math.max(0, W.age(p) - 19);
          p.intl = {
            caps: Math.round(seasons * games * share * U.rand(0.6, 1)) + Math.round(share * games),
            goals: 0,
            first: s.year - seasons,
            by: { [s.year - 1]: Math.round(share * games) },
          };
          if (p.pos === 'GK') p.intl.cs = Math.round(p.intl.caps * U.rand(0.25, 0.45)); // (about a third of a keeper's games are shut-outs)
        });
    }
  };
  // The ranking is a coefficient: points (about 50 for an average nation, 90 and over for the best) that every
  // match moves, by how much it was worth and how surprising the result was (the Elo method, on a smaller scale)
  // Who a player plays for: his nationality, or the other nation he is eligible for if he has chosen it (p.alleg).
  // The first cap ties him to that nation for good.
  I.nationOf = (p) => p.alleg || p.nat;
  I.uncapped = (p) => !(p.intl && p.intl.caps > 0);
  I.repFromCoef = (c) => U.clamp(Math.round(60 + ((c - 50) * 10) / 12), 30, 97);
  // (a player a world definition called up for his country comes ahead of better players until p.ntUntil)
  // (players grouped by nation once, not found by scanning all of them for every nation; the sorted lists are kept until
  // the roster, the year, the day or a change of allegiance (I.natVer) says they may be out of date)
  I.natVer = 0;
  let poolIdx = { S: null, key: '', by: null, top: {} };
  I.pool = (code) => {
    const s = S(),
      yr = s.year,
      key = `${W.rosterVer},${yr},${s.day},${I.natVer}`;
    if (poolIdx.S !== s || poolIdx.key !== key) {
      const by = {};
      for (const id in s.players) (by[I.nationOf(s.players[id])] ||= []).push(s.players[id]);
      poolIdx = { S: s, key, by, top: {} };
    }
    return (poolIdx.top[code] ||= (poolIdx.by[code] || [])
      .filter((p) => !p.retired && W.age(p) >= 17)
      .sort((a, b) => (b.ntUntil >= yr) - (a.ntUntil >= yr) || b.ca - a.ca)
      .slice(0, 30)).slice();
  };
  I.rating = (code) => {
    const xi = I.pool(code).slice(0, 11);
    return xi.length ? U.avg(xi, (p) => p.ca) : 40;
  };
  // The squad: the user's own call-ups when managing the nation, otherwise the best 23 available
  I.squad = function (code) {
    const t = S().nteams && S().nteams['n_' + code];
    if (t && t.picks && W.isUserNation(t.id)) {
      const picked = t.picks
        .map((id) => S().players[id])
        .filter((p) => p && !p.retired && I.nationOf(p) === code && W.available(p));
      if (picked.length >= 16) return picked.slice(0, 26);
      return picked.concat(I.pool(code).filter((p) => W.available(p) && !picked.includes(p))).slice(0, 23);
    }
    return I.pool(code).filter(W.available).slice(0, 23);
  };
  I.ranked = () => Object.values(S().nteams).sort((a, b) => b.coef - a.coef);
  // Sanctions (S.bans, set in the world editor): a nation out of international competition for some seasons. It keeps its place in
  // the ranking but is left out of qualifying, the Nations League, the invitationals and the tournaments while the ban lasts.
  I.banned = (t, year = S().year) => {
    const code = typeof t === 'string' ? t.replace(/^n_/, '') : t && t.code;
    return (S().bans || []).some((b) => b.kind === 'nation' && b.id === code && year >= b.from && year <= b.to);
  };
  I.openRanked = () => I.ranked().filter((t) => !I.banned(t));

  // ---------- Calendar ----------
  // A World Championship every fourth year, continental championships two years on, and in the year before each World
  // Championship the Continental Champions Trophy (the structure of the Confederations Cup: the continental champions, the
  // world champions and a host)
  // (I.CYCLE: the year of the four, counted from 0, in which the World Championship is played; the continental championships
  // follow two years on and the Trophy comes the year before. A world definition can move it.)
  I.CYCLE = 2;
  I.tournamentFor = (year) => {
    const k = (((year - I.CYCLE) % 4) + 4) % 4;
    return k === 0 ? 'world' : k === 2 ? 'continental' : k === 3 ? 'confed' : null;
  };
  I.kindName = (kind) =>
    ({ world: 'World Championship', continental: 'continental championships', confed: 'Continental Champions Trophy' })[
      kind
    ];
  I.nextTournament = function () {
    for (let y = S().year; y < S().year + 4; y++) {
      const k = I.tournamentFor(y);
      if (k) return { year: y + 1, kind: k };
    }
    return null;
  };
  // (a tournament with fewer teams has no day for the rounds it starts after: the 16-team ones begin at the quarter-finals,
  // Oceania's at the semi-finals)
  I.tournamentStages = (year) =>
    I.tournamentFor(year) === 'world'
      ? ['G1', 'G2', 'G3', 'R32', 'R16', 'QF', 'SF', 'F']
      : I.tournamentFor(year) === 'continental'
        ? ['G1', 'G2', 'G3', 'R16', 'QF', 'SF', 'F']
        : ['G1', 'G2', 'G3', 'SF', 'F'];
  const MD = { I1a: 0, I1b: 1, I2a: 2, I2b: 3 };

  // ---------- Season setup: qualifying groups for the coming summer ----------
  I.newSeason = function () {
    const s = S();
    s.quals = null;
    s.tourns = null;
    s.intlSeason = [];
    s.intlDay = null;
    s.intlBreak = [];
    const kind = I.tournamentFor(s.year);
    if (kind && kind !== 'confed') {
      const q = { kind, year: s.year, groups: [], direct: {}, hosts: {}, pos: {} };
      I.tournsFor(kind).forEach((tn) => {
        // the host qualifies for nothing: it is in, and takes one of its part of the world's places
        const hostPool = tn.pools[0];
        if (hostPool) {
          const cands = I.openRanked().filter((t) => hostPool[0].includes(I.region(t.code)));
          const top = cands.slice(0, Math.max(4, Math.ceil(cands.length * 0.6)));
          if (top.length) q.hosts[tn.id] = [U.pick(top).id];
        }
      });
      I.tournsFor(kind).forEach((tn) =>
        tn.pools.forEach(([regions, places], pi) => {
          const hosts = q.hosts[tn.id] || [];
          const teams = I.openRanked().filter((t) => regions.includes(I.region(t.code)) && !hosts.includes(t.id));
          const slots = Math.max(0, places - hosts.filter((h) => regions.includes(I.region(T(h).code))).length);
          const key = `${tn.id}:${pi}`;
          if (teams.length <= slots || tn.direct) {
            q.direct[key] = teams.slice(0, slots).map((t) => t.id);
            return;
          }
          const g = Math.max(1, Math.ceil(teams.length / (tn.qualSize || 4)));
          const groups = [...Array(g)].map(() => []);
          teams.forEach((t, i) => {
            const row = Math.floor(i / g),
              col = i % g;
            groups[row % 2 ? g - 1 - col : col].push(t.id);
          });
          groups.forEach((ids, gi) => {
            const rr = W.roundRobin(ids);
            const rounds = ids.length === 2 ? rr : rr.slice(0, rr.length / 2); // pairs play home and away; bigger groups once each
            const letter =
              gi < 26
                ? String.fromCharCode(65 + gi)
                : String.fromCharCode(64 + Math.floor(gi / 26)) + String.fromCharCode(65 + (gi % 26));
            const name = `${tn.id === 'WC' ? '' : tn.id + ' '}${I.confedName(regions[0])}${regions.length > 1 ? '+' : ''} ${letter}`;
            q.groups.push({
              key,
              tn: tn.id,
              slots,
              // the last places are played for: the best teams that missed the direct places meet in single matches on the last
              // matchday (the play-offs), as at the European championship
              po:
                g >= 2 * Math.round(slots * (kind === 'world' ? 0.12 : 0.13))
                  ? Math.round(slots * (kind === 'world' ? 0.12 : 0.13))
                  : 0,
              name,
              teams: ids,
              table: Object.fromEntries(
                ids.map((id) => [id, { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, form: [] }]),
              ),
              rounds: rounds.map((rd) => rd.map(([h, a]) => ({ h, a }))),
            });
          });
        }),
      );
      // A nation can't be in two qualifying groups at once (the World Championship takes priority)
      s.quals = q;
    }
    s.nl = I.nlBuild();
    s.invites = I.planInvites();
    s.invite = s.invites[0] || null;
    I.topUp();
    I.allegianceTick();
    I.refreshJobs();
  };

  // ---------- The Nations League ----------
  // Every confederation plays one in the seasons with no qualifying (the year with no tournament and the year of the
  // Continental Champions Trophy): its nations in leagues of sixteen, four groups of four a league, one match against each
  // group-mate on the first three matchdays of the breaks. The group winners of a league go up at the end, the last in each
  // group go down, and the champions are the best group winner of League A. This is what the breaks are for: no friendlies.
  I.NL = { group: 4, groups: 4 };
  I.nlYear = (year) => {
    const k = I.tournamentFor(year);
    return !k || k === 'confed';
  };
  I.nlBuild = function () {
    const s = S();
    if (!I.nlYear(s.year)) return null;
    const by = {};
    Object.values(s.nteams)
      .filter((t) => !I.banned(t))
      .forEach((t) => (by[I.region(t.code)] = by[I.region(t.code)] || []).push(t));
    const nl = { year: s.year, confeds: {} },
      per = I.NL.group * I.NL.groups;
    for (const cid of I.confedIds()) {
      const teams = by[cid] || [];
      if (teams.length < 2) continue;
      // last time's order (promotion and relegation already done); a first time or a changed membership: by ranking
      const prev = (s.nlOrder || {})[cid],
        codes = new Set(teams.map((t) => t.code)),
        order =
          prev && prev.length === teams.length && prev.every((c) => codes.has(c))
            ? prev.map((c) => s.nteams['n_' + c])
            : teams.slice().sort((a, b) => b.coef - a.coef);
      let L = Math.max(1, Math.ceil(order.length / per));
      if (L > 1 && order.length - per * (L - 1) < I.NL.group) L--;
      nl.confeds[cid] = {
        id: cid,
        name: `${I.confedName(cid)} Nations League`,
        order: order.map((t) => t.code),
        leagues: Array.from({ length: L }, (_, li) => {
          const lt = order.slice(li * per, li === L - 1 ? undefined : (li + 1) * per),
            g = Math.max(1, Math.ceil(lt.length / I.NL.group)),
            groups = [...Array(g)].map(() => []),
            letter = String.fromCharCode(65 + li);
          lt.forEach((t, i) => {
            const row = Math.floor(i / g),
              col = i % g;
            groups[row % 2 ? g - 1 - col : col].push(t.id);
          });
          return {
            name: `League ${letter}`,
            groups: groups.map((ids, gi) => {
              const rr = W.roundRobin(ids);
              return {
                name: `${cid}-${letter}${gi + 1}`,
                label: `Group ${gi + 1}`,
                teams: ids,
                table: Object.fromEntries(
                  ids.map((id) => [id, { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, form: [] }]),
                ),
                rounds: (ids.length === 2 ? rr : rr.slice(0, rr.length / 2)).map((rd) =>
                  rd.map(([h, a]) => ({ h, a })),
                ),
              };
            }),
          };
        }),
      };
    }
    return Object.keys(nl.confeds).length ? nl : null;
  };
  I.nlGroups = (nl = S().nl) =>
    nl
      ? Object.values(nl.confeds).flatMap((c) =>
          c.leagues.flatMap((lg, li) => lg.groups.map((g) => ({ ...g, g, league: lg.name, li, confed: c }))),
        )
      : [];
  I.nlGroupOf = (id) => I.nlGroups().find((x) => x.teams.includes(id));
  // At the end of the third matchday: the order for next time (winners up, last down) and the champions
  I.nlFinish = function () {
    const s = S(),
      nl = s.nl;
    if (!nl || nl.done) return;
    nl.done = true;
    s.nlOrder = s.nlOrder || {};
    s.nlHistory = s.nlHistory || [];
    for (const c of Object.values(nl.confeds)) {
      const keys = [],
        winners = [];
      c.leagues.forEach((lg, li) =>
        lg.groups.forEach((g) => {
          const tab = W.sortedTable({ table: g.table });
          g.final = tab.map((r) => r.id);
          if (li === 0) winners.push(tab[0]);
          tab.forEach((r, pos) =>
            keys.push({
              id: r.id,
              pos,
              ppg: r.p ? r.pts / r.p : 0,
              gd: r.gd,
              key: li + (pos === 0 && li > 0 ? -0.6 : pos === tab.length - 1 && li < c.leagues.length - 1 ? 0.45 : 0),
            }),
          );
        }),
      );
      keys.sort(
        (a, b) => a.key - b.key || a.pos - b.pos || b.ppg - a.ppg || b.gd - a.gd || T(b.id).coef - T(a.id).coef,
      );
      s.nlOrder[c.id] = keys.map((k) => T(k.id).code);
      winners.sort(
        (a, b) => b.pts / (b.p || 1) - a.pts / (a.p || 1) || b.gd - a.gd || b.gf - a.gf || T(b.id).coef - T(a.id).coef,
      );
      const champ = winners[0] && T(winners[0].id);
      if (!champ) continue;
      c.winner = champ.id;
      champ.titles.NL = (champ.titles.NL || 0) + 1;
      s.nlHistory.unshift({ year: s.year, confed: c.id, name: c.name, winner: champ.id });
      if (s.nlHistory.length > 60) s.nlHistory.length = 60;
      const mine = s.user && s.user.nation && I.region(T(s.user.nation).code) === c.id;
      FM.News.add({
        type: 'world',
        title: `${champ.name} win the ${c.name}`,
        body: `${champ.name} finish top of their League A group (${U.plural(winners[0].pts, 'point')} from ${U.plural(winners[0].p, 'game')}). Group winners in the other leagues go up; the last in each group go down.`,
        big: !!mine,
      });
    }
  };

  // The Continental Champions Trophy's invitations: the champions of the last continental championships, the world champions and
  // a host from the better nations (the rest of the eight are filled by ranking). A continent without a champion yet sends its
  // best-ranked nation.
  I.CONFED_FROM = { EC: ['EUR'], SA: ['SAM'], AF: ['AFR'], AS: ['ASIA'], NA: ['NAM'], OF: ['OFC'] };
  I.confedTeams = function () {
    const s = S(),
      won = {},
      ids = [];
    for (let i = (s.archive || []).length - 1; i >= 0; i--)
      for (const r of s.archive[i].intl || []) if (r.winner && s.nteams[r.winner] && !won[r.id]) won[r.id] = r.winner;
    const add = (id) => id && !ids.includes(id) && ids.push(id);
    const from = { ...I.CONFED_FROM };
    I.confedIds()
      .filter((id) => !I.CONFEDS[id])
      .forEach((id) => (from['X' + id] = [id]));
    for (const [tid, regions] of Object.entries(from))
      add(
        (won[tid] && !I.banned(won[tid]) && won[tid]) ||
          (I.openRanked().find((t) => regions.includes(I.region(t.code))) || {}).id,
      );
    add((won.WC && !I.banned(won.WC) && won.WC) || (I.openRanked()[0] || {}).id);
    const hosts = I.openRanked()
      .slice(0, 16)
      .filter((t) => !ids.includes(t.id));
    if (hosts.length) add(U.pick(hosts).id);
    return ids;
  };

  // The season's invitational: the host and three guests from different parts of the world, none of whom has a qualifier on
  // the days it is played (null when the host is busy or the world has too few nations)
  // (up to I.PER_SEASON a season, in turn: each takes its own host and guests, and no nation is in two of them)
  I.PER_SEASON = 3;
  I.planInvite = function (k = 0, taken = new Set()) {
    if (!I.INVITES.length) return null; // (a world definition can do without them)
    const s = S(),
      n = I.INVITES.length,
      spec = I.INVITES[(((s.year * I.PER_SEASON + k) % n) + n) % n];
    const teamsOf = (codes) =>
      codes.map((c) => Object.values(s.nteams || {}).find((t) => t.code === c)).filter(Boolean);
    const pool0 = spec.pool ? teamsOf(spec.pool) : null;
    if (pool0 && pool0.length < 4) return null;
    const host = pool0
      ? pool0[Math.floor((s.year * I.PER_SEASON + k) / n) % pool0.length]
      : Object.values(s.nteams || {}).find((t) => t.code === spec.host);
    if (!host) return null;
    const busy = new Set(taken);
    Object.values(s.nteams || {}).forEach((t) => I.banned(t) && busy.add(t.id)); // (a nation under sanction takes no part)
    ((s.quals && s.quals.groups) || []).forEach((g) =>
      [2, 3].forEach((md) => (g.rounds[md] || []).forEach(({ h, a }) => (busy.add(h), busy.add(a)))),
    );
    I.nlGroups().forEach((x) =>
      [2, 3].forEach((md) => (x.g.rounds[md] || []).forEach(({ h, a }) => (busy.add(h), busy.add(a)))),
    );
    if (busy.has(host.id)) return null;
    const pool = pool0
      ? pool0.filter((t) => t !== host && !busy.has(t.id)).sort((a, b) => b.coef - a.coef)
      : U.shuffle(
          I.openRanked()
            .slice(0, 45)
            .filter((t) => t !== host && !busy.has(t.id)),
        );
    const guests = [],
      regions = new Set([I.region(host.code)]);
    // (a regional tournament takes the best of its pool; the others take guests from different parts of the world)
    if (!pool0)
      for (const t of pool) {
        if (guests.length === 3) break;
        if (!regions.has(I.region(t.code))) (guests.push(t), regions.add(I.region(t.code)));
      }
    for (const t of pool) if (guests.length < 3 && !guests.includes(t)) guests.push(t);
    if (guests.length < 3) return null;
    // seeded by rating: the best guest meets the host's side of the draw last
    const teams = [host, ...guests].sort((a, b) => b.coef - a.coef).map((t) => t.id);
    return {
      id: spec.id,
      name: spec.name,
      host: host.id,
      teams,
      sf: null,
      third: null,
      final: null,
      winner: null,
      runnerUp: null,
    };
  };
  I.planInvites = function () {
    const taken = new Set(),
      out = [];
    for (let k = 0; k < I.PER_SEASON; k++) {
      const inv = I.planInvite(k, taken);
      if (inv && !out.some((x) => x.id === inv.id)) {
        inv.teams.forEach((id) => taken.add(id));
        out.push(inv);
      }
    }
    return out;
  };
  // The season's invitationals (an older save has the one)
  const invitesOf = (s) => s.invites || (s.invite ? [s.invite] : []);
  I.invites = () => invitesOf(S());
  // Their fixtures for the window day
  I.inviteDay = function (tag, busy) {
    return invitesOf(S()).flatMap((inv) => I.oneInviteDay(inv, tag, busy));
  };
  // One invitational's fixtures for the window day: semi-finals on the first, the final and the third-place match on the second
  I.oneInviteDay = function (inv, tag, busy) {
    const s = S(),
      out = [];
    if (!inv || inv.winner) return out;
    const mk = (a, b, label, extra = {}) => {
      // the host plays at home; the rest meet on neutral ground
      const [h, aw] = b === inv.host ? [b, a] : [a, b];
      busy.add(h);
      busy.add(aw);
      return mkFx(h, aw, `${inv.name} · ${label}`, {
        kind: 'invite',
        iid: inv.id,
        ko: true,
        neutral: h !== inv.host,
        ...extra,
      });
    };
    const T = inv.teams;
    if (tag === 'I2a' && !inv.sf) {
      inv.sf = [mk(T[0], T[3], 'Semi-final'), mk(T[1], T[2], 'Semi-final')];
      FM.News.add({
        type: 'world',
        title: `${inv.name}: ${s.nteams[inv.host].name} host ${T.filter((id) => id !== inv.host)
          .map((id) => s.nteams[id].name)
          .join(', ')}`,
        body: `An invitational in the international window: semi-finals now, the final and the third-place match next.`,
      });
      out.push(...inv.sf);
    } else if (tag === 'I2a' && inv.sf) out.push(...inv.sf.filter((f) => !f.res));
    else if (tag === 'I2b' && inv.sf && inv.sf.every((f) => f.res) && !inv.final) {
      const w = inv.sf.map((f) => FM.Season.winnerOf(f)),
        l = inv.sf.map((f) => (f.h === FM.Season.winnerOf(f) ? f.a : f.h));
      inv.final = mk(w[0], w[1], 'Final', { final: true });
      inv.third = mk(l[0], l[1], 'Third place', { third: true });
      out.push(inv.final, inv.third);
    } else if (tag === 'I2b' && inv.final) out.push(...[inv.final, inv.third].filter((f) => f && !f.res));
    return out;
  };
  // A match of the invitational is over: the final names the winner
  I.inviteResult = function (fx) {
    const s = S(),
      inv = invitesOf(s).find((x) => x.id === fx.iid);
    if (!inv || !fx.final) return;
    inv.winner = FM.Season.winnerOf(fx);
    inv.runnerUp = fx.h === inv.winner ? fx.a : fx.h;
    const w = s.nteams[inv.winner];
    const r = fx.res,
      hw = fx.h === inv.winner;
    s.intlSeason = (s.intlSeason || []).concat([
      {
        id: inv.id,
        name: inv.name,
        year: s.year,
        winner: inv.winner,
        runnerUp: inv.runnerUp,
        final: `${hw ? r.hg : r.ag}–${hw ? r.ag : r.hg}${r.pens ? ' pens' : ''}`,
        invite: true,
      },
    ]);
    FM.News.add({
      type: 'world',
      title: `${w.name} win the ${inv.name}`,
      body: `${w.name} beat ${s.nteams[inv.runnerUp].name} in the final of the invitational.`,
      big: W.isUserNation(inv.winner),
    });
  };

  // A pool's teams ranked after the groups: group winners first, then runners-up, and so on (points per game, goal difference)
  const rankPool = (key) => {
    const q = S().quals,
      groups = q.groups.filter((g) => g.key === key);
    const rows = groups.flatMap((g) =>
      W.sortedTable({ table: g.table }).map((r, pos) => ({
        ...r,
        pos,
        ppg: r.p ? r.pts / r.p : 0,
        gdg: r.p ? r.gd / r.p : 0,
        gfg: r.p ? r.gf / r.p : 0,
      })),
    );
    rows.sort(
      (a, b) => a.pos - b.pos || b.ppg - a.ppg || b.gdg - a.gdg || b.gfg - a.gfg || T(b.id).coef - T(a.id).coef,
    );
    return { rows, groups };
  };
  // Teams through from a pool: the direct places by the ranking, the last ones by play-off (before the play-offs are played, the
  // ranking stands in)
  I.poolQualifiers = function (key) {
    const q = S().quals;
    if (!q) return [];
    if (q.direct[key]) return q.direct[key];
    if (!q.groups.some((g) => g.key === key)) return [];
    const { rows, groups } = rankPool(key);
    const slots = groups[0].slots,
      P = groups[0].po || 0;
    const direct = rows.slice(0, slots - P).map((r) => r.id),
      po = (q.pos || {})[key];
    if (!P) return direct;
    const won = po && po.length && po.every((f) => f.res) ? po.map((f) => FM.Season.winnerOf(f)) : null;
    return direct.concat(won || rows.slice(slots - P, slots).map((r) => r.id));
  };
  // The play-offs, drawn on the last matchday of the qualifying season: the 2P teams after the direct places, best against worst
  I.playoffDay = function (busy) {
    const q = S().quals,
      out = [];
    if (!q) return out;
    q.pos = q.pos || {};
    for (const key of [...new Set(q.groups.map((g) => g.key))]) {
      const g0 = q.groups.find((g) => g.key === key),
        P = g0.po || 0;
      if (!P || q.pos[key]) continue;
      const rows = rankPool(key).rows.slice(g0.slots - P, g0.slots + P);
      if (rows.length < 2 * P) continue;
      q.pos[key] = [...Array(P)].map((_, i) => {
        const h = rows[i].id,
          a = rows[2 * P - 1 - i].id;
        busy.add(h);
        busy.add(a);
        const f = mkFx(h, a, `${I.TNAME[g0.tn]} qualifying play-off`, { kind: 'qual', group: 'PO ' + key, ko: true });
        out.push(f);
        return f;
      });
    }
    return out;
  };
  I.qualifiedFor = (tnId) => {
    const tn = I.tournsFor(S().quals ? S().quals.kind : 'world').find((x) => x.id === tnId);
    return tn
      ? [...((S().quals.hosts || {})[tnId] || []), ...tn.pools.flatMap((_, pi) => I.poolQualifiers(`${tnId}:${pi}`))]
      : [];
  };

  // ---------- Fixtures for an international or tournament day (built once per day) ----------
  const mkFx = (h, a, po, extra = {}) => ({
    id: FM.nextId('i'),
    comp: 'INTL',
    intl: true,
    h,
    a,
    res: null,
    po,
    ...extra,
  });
  I.dayFixtures = function (cal) {
    const s = S();
    if (s.intlDay && s.intlDay.day === s.day && s.intlDay.year === s.year) {
      // Knockout ties also live in their tournament's bracket. A save/load or the simulation worker's JSON
      // hand-off turns the two into separate copies, so point the cached list back at the bracket's objects
      // (otherwise results land on the copies and the bracket never learns who went through)
      if (cal.type === 'tourn' && s.tourns) {
        const byId = new Map();
        s.tourns.forEach((t) => I.tournKo(t).forEach((f) => byId.set(f.id, f)));
        s.intlDay.fx = s.intlDay.fx.map((f) => byId.get(f.id) || f);
      }
      if (cal.type !== 'tourn' && invitesOf(s).length) {
        const byId = new Map(
          invitesOf(s)
            .flatMap((inv) => [...(inv.sf || []), inv.third, inv.final])
            .filter(Boolean)
            .map((f) => [f.id, f]),
        );
        s.intlDay.fx = s.intlDay.fx.map((f) => byId.get(f.id) || f);
      }
      return s.intlDay.fx;
    }
    const fx = cal.type === 'tourn' ? I.tournamentDay(cal.stage) : I.breakDay(cal.tag);
    s.intlDay = { day: s.day, year: s.year, fx };
    return fx;
  };
  I.breakDay = function (tag) {
    const s = S(),
      md = MD[tag] ?? 0,
      fx = [],
      busy = new Set();
    if (s.quals) {
      s.quals.groups.forEach((g) => {
        (g.rounds[md] || []).forEach(({ h, a }) => {
          if (busy.has(h) || busy.has(a)) return;
          busy.add(h);
          busy.add(a);
          fx.push(mkFx(h, a, `${I.TNAME[g.tn]} qualifier · ${g.name.trim()}`, { kind: 'qual', group: g.name }));
        });
      });
    }
    // the qualifying play-offs, on the last matchday
    if (s.quals && tag === 'I2b') fx.push(...I.playoffDay(busy));
    // The season's invitational, in the second window
    fx.push(...I.inviteDay(tag, busy));
    // The Nations League (no friendlies: a nation with nothing to play in a window rests)
    I.nlGroups().forEach((x) =>
      (x.g.rounds[md] || []).forEach(({ h, a }) => {
        if (busy.has(h) || busy.has(a)) return;
        busy.add(h);
        busy.add(a);
        fx.push(mkFx(h, a, `${x.confed.name} · ${x.league} ${x.label}`, { kind: 'nl', group: x.name }));
      }),
    );
    return fx;
  };

  // ---------- Summer tournaments ----------
  // ---------- The draw: pots ----------
  // The teams are ranked (the hosts first, who take the head of the first groups), cut into four pots of as many teams as there are
  // groups, and every group gets one team from each pot. At the World Championship no two teams from one confederation meet in
  // a group (Europe, with so many, may have two); the continental championships have no such rule. Returns the pots and the groups.
  I.draw = function (teams, hosts, byConfed) {
    const G = Math.max(1, Math.floor(teams.length / 4));
    if (teams.length < 8) return { pots: [teams.map((t) => t.id)], groups: [teams.map((t) => t.id)] };
    const rank = teams.slice().sort((a, b) => b.coef - a.coef);
    const order = [...rank.filter((t) => hosts.includes(t.id)), ...rank.filter((t) => !hosts.includes(t.id))];
    const pots = [0, 1, 2, 3].map((p) => order.slice(p * G, (p + 1) * G));
    const limit = (t) => (I.region(t.code) === 'EUR' ? 2 : 1);
    const tryDraw = (strict) => {
      const groups = pots[0].map((t) => [t]);
      for (let p = 1; p < 4; p++)
        for (const t of U.shuffle(pots[p].slice())) {
          const open = groups
            .map((g, gi) => gi)
            .filter(
              (gi) =>
                groups[gi].length === p &&
                (!strict || groups[gi].filter((x) => I.region(x.code) === I.region(t.code)).length < limit(t)),
            );
          if (!open.length) return null;
          groups[U.pick(open)].push(t);
        }
      return groups;
    };
    let groups = null;
    if (byConfed) for (let i = 0; i < 300 && !groups; i++) groups = tryDraw(true);
    while (!groups) groups = tryDraw(false);
    return { pots: pots.map((p) => p.map((t) => t.id)), groups: groups.map((g) => g.map((t) => t.id)) };
  };
  // The first knockout round: the winners and runners-up of the groups and the best third-placed teams fill the biggest bracket
  // they can (never more than three a group): 2 groups give the semi-finals, 4 the quarter-finals, 6 the round of 16 (four
  // thirds), 12 the round of 32 (eight thirds)
  const KO = ['R32', 'R16', 'QF', 'SF', 'F'];
  const KO_KEY = { R32: 'r32', R16: 'r16', QF: 'qf', SF: 'sf' };
  const KO_NAME = { R32: 'Round of 32', R16: 'Round of 16', QF: 'Quarter-final', SF: 'Semi-final', F: 'Final' };
  const KO_SIZE = { F: 2, SF: 4, QF: 8, R16: 16, R32: 32 };
  const firstKo = (G) => {
    if (G <= 1) return 'F';
    let n = 2;
    while (n * 2 <= 3 * G) n *= 2;
    return { 2: 'F', 4: 'SF', 8: 'QF', 16: 'R16', 32: 'R32' }[n] || 'R32';
  };
  // Every knockout tie of a tournament, in order
  I.tournKo = (t) =>
    [...(t.ko.r32 || []), ...(t.ko.r16 || []), ...(t.ko.qf || []), ...(t.ko.sf || []), t.ko.final].filter(Boolean);
  I.setupTournaments = function () {
    const s = S(),
      kind = I.tournamentFor(s.year),
      tns = I.tournsFor(kind);
    const hostsOf = (tn) => ((s.quals && s.quals.hosts) || {})[tn.id] || [];
    // The South American championship invites the best of North America (they would otherwise be in their own)
    const guestSpec = (tns.find((x) => x.guests) || {}).guests;
    const naTn = guestSpec && tns.find((x) => x.pools.some(([r]) => r.includes(guestSpec.from)));
    const guests = guestSpec
      ? I.openRanked()
          .filter((t) => I.region(t.code) === guestSpec.from && !(naTn && hostsOf(naTn).includes(t.id)))
          .slice(0, guestSpec.n)
      : [];
    s.tourns = tns.map((tn) => {
      let teams = (tn.confed ? I.confedTeams() : I.qualifiedFor(tn.id)).map(T).filter(Boolean);
      const gids = guests.map((t) => t.id);
      if (tn.guests) teams = teams.concat(guests.filter((g) => !teams.includes(g)));
      else if (naTn === tn) teams = teams.filter((t) => !gids.includes(t.id));
      if (teams.length < tn.size) {
        const used = new Set(teams.map((t) => t.id));
        const inPools = (t) => tn.pools.some(([r]) => r.includes(I.region(t.code)));
        // the intercontinental play-offs: the best of the rest of the world who did not qualify
        const extra = I.openRanked().filter(
          (t) =>
            !used.has(t.id) &&
            (tn.confed || (tn.playoff ? I.region(t.code) !== 'EUR' && inPools(t) : inPools(t))) &&
            !(naTn === tn && gids.includes(t.id)),
        );
        teams = teams.concat(extra.slice(0, tn.size - teams.length));
      }
      teams = teams.sort((a, b) => b.coef - a.coef).slice(0, tn.size);
      teams = teams.slice(0, Math.max(4, Math.floor(teams.length / 4) * 4)); // (groups of four)
      const hosts = hostsOf(tn).filter((h) => teams.some((t) => t.id === h));
      const drawn = I.draw(teams, hosts, tn.id === 'WC');
      const G = drawn.groups.length;
      return {
        id: tn.id,
        name: tn.name,
        teams: teams.map((t) => t.id),
        hosts,
        pots: drawn.pots,
        first: firstKo(G),
        games: [],
        groups: drawn.groups.map((ids, gi) => ({
          name: String.fromCharCode(65 + gi),
          teams: ids,
          table: Object.fromEntries(ids.map((id) => [id, { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, form: [] }])),
          rounds: W.roundRobin(ids).slice(0, 3),
        })),
        ko: { r32: [], r16: [], qf: [], sf: [], final: null },
        winner: null,
        runnerUp: null,
      };
    });
    s.tourns = s.tourns.filter((tn) => tn.teams.length >= 4); // (a world with few national teams: a continent left with fewer than four plays no championship)
    // National team job: failing to qualify ends it
    const u = s.user;
    if (u && u.nation && kind !== 'confed' && !s.tourns.some((t) => t.teams.includes(u.nation)))
      I.sackNational(`${T(u.nation).name} failed to qualify for the ${s.tourns.map((t) => t.name).join(' / ')}.`);
    if (s.tourns.length) {
      const flag = (id) => D.NATIONS[T(id).code].flag;
      FM.News.add({
        type: 'world',
        title: `${s.tourns.map((t) => t.name).join(' · ')}: the finals begin`,
        body: s.tourns.map((t) => `${t.name}: ${t.teams.map(flag).join(' ')}`).join('\n'),
        big: true,
      });
      // the draw, for the World Championship, the European championship and any tournament your nation is in
      s.tourns
        .filter(
          (t) =>
            t.pots.length === 4 && (t.id === 'WC' || t.id === 'EC' || (u && u.nation && t.teams.includes(u.nation))),
        )
        .forEach((t) =>
          FM.News.add({
            type: 'world',
            title: `${t.name}: the draw`,
            body: `${t.hosts.length ? `${t.hosts.map((h) => T(h).name).join(', ')} host${t.hosts.length === 1 ? 's' : ''}. ` : ''}${t.pots
              .map((p, i) => `Pot ${i + 1}: ${p.map((id) => `${flag(id)} ${T(id).name}`).join(', ')}`)
              .join('\n')}`,
            keep: true,
          }),
        );
    }
  };
  // The knockout bracket from the groups: the group winners, then the runners-up, then the third-placed teams, ranked by points,
  // goal difference and goals scored; the best fill the bracket by seed (first plays last, and so on) so the best teams meet late,
  // and a group's teams do not meet again in the first round if it can be helped
  I.bracket = function (t) {
    const adv = KO_SIZE[t.first] || 8;
    const tabs = t.groups.map((g) => W.sortedTable({ table: g.table }));
    const cmp = (a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || T(b.id).coef - T(a.id).coef;
    const at = (pos) =>
      tabs
        .map((tab, gi) => tab[pos] && { ...tab[pos], g: gi })
        .filter(Boolean)
        .sort(cmp);
    const ranked = [...at(0), ...at(1), ...at(2)].slice(0, adv);
    if (ranked.length < adv) return [];
    let order = [1];
    while (order.length < adv) {
      const n = order.length * 2;
      order = order.flatMap((x) => [x, n + 1 - x]);
    }
    const pairs = [];
    for (let i = 0; i < order.length; i += 2) pairs.push([ranked[order[i] - 1], ranked[order[i + 1] - 1]]);
    pairs.forEach((p, i) => {
      if (p[0].g !== p[1].g) return;
      const j = pairs.findIndex((q, k) => k !== i && q[1].g !== p[0].g && p[1].g !== q[0].g);
      if (j >= 0) [p[1], pairs[j][1]] = [pairs[j][1], p[1]];
    });
    return pairs.map(([a, b]) => [a.id, b.id]);
  };
  I.tournamentDay = function (stage) {
    const s = S();
    if (!s.tourns) I.setupTournaments();
    const out = [];
    for (const t of s.tourns) {
      const lbl = (x) => `${t.name} · ${x}`;
      if (stage[0] === 'G') {
        const r = +stage.slice(1) - 1;
        t.groups.forEach((g) =>
          (g.rounds[r] || []).forEach(([h, a]) =>
            out.push(mkFx(h, a, lbl(`Group ${g.name}`), { kind: 'tourn', tid: t.id, group: g.name, neutral: true })),
          ),
        );
        continue;
      }
      // (a save from before the 24- and 48-team tournaments has no t.first: four groups began at the quarter-finals, two at the semi-finals)
      const first = t.first || (t.groups.length === 4 ? 'QF' : t.groups.length === 2 ? 'SF' : 'F');
      if (KO.indexOf(stage) < KO.indexOf(first)) continue;
      const key = KO_KEY[stage];
      const have = stage === 'F' ? (t.ko.final ? [t.ko.final] : []) : t.ko[key] || (t.ko[key] = []);
      if (!have.length) {
        let pairs;
        if (stage === first)
          pairs =
            t.groups.length === 1
              ? [
                  W.sortedTable({ table: t.groups[0].table })
                    .slice(0, 2)
                    .map((r) => r.id),
                ]
              : (t.first = first) && I.bracket(t);
        else {
          const prev = KO[KO.indexOf(stage) - 1];
          const before = prev === 'F' ? [] : t.ko[KO_KEY[prev]] || [];
          const w = before.map((f) => FM.Season.winnerOf(f));
          pairs = [];
          for (let i = 0; i + 1 < w.length; i += 2) pairs.push([w[i], w[i + 1]]);
        }
        const made = pairs.map(([h, a]) =>
          mkFx(h, a, lbl(KO_NAME[stage]), {
            kind: 'tourn',
            tid: t.id,
            ko: true,
            neutral: true,
            ...(stage === 'F' ? { final: true } : {}),
          }),
        );
        if (stage === 'F') t.ko.final = made[0] || null;
        else t.ko[key] = made;
        out.push(...made);
      } else out.push(...have);
    }
    return out;
  };

  // ---------- Playing a match ----------
  I.sim = function (fx) {
    const m = new FM.Match({ h: fx.h, a: fx.a, comp: 'INTL', knockout: !!fx.ko, neutral: !!fx.neutral });
    while (!m.finished) m.step();
    return m;
  };
  I.applyFixture = function (fx, m) {
    const s = S(),
      r = m.result(),
      [H, A] = m.sides;
    fx.res = r;
    const tourn = fx.kind === 'tourn';
    const rec = {
      id: fx.id,
      year: s.year,
      day: s.day,
      h: H.club.id,
      a: A.club.id,
      hg: r.hg,
      ag: r.ag,
      pens: r.pens,
      label: fx.po,
      goals: r.goals.map((g) => ({ pid: g.pid, side: g.side, min: g.min })),
    };
    m.sides.forEach((sd, k) => {
      // each national team's games a year, so a player's share of them can be worked out (work permits use it)
      const gm = ((s.intlGames = s.intlGames || {})[sd.club.code] = s.intlGames[sd.club.code] || {});
      gm[s.year] = (gm[s.year] || 0) + 1;
      for (const pid in sd.mins) {
        const p = s.players[pid];
        p.intl = p.intl || { caps: 0, goals: 0, first: s.year };
        const first = p.intl.caps === 0;
        if (tourn && sd.rating && sd.rating[pid] != null) FM.Records.noteComp('T_' + fx.tid, p, sd.rating[pid]);
        if (first) ((p.alleg = sd.club.code), I.natVer++);
        p.intl.caps++;
        (p.intl.by = p.intl.by || {})[s.year] = (p.intl.by[s.year] || 0) + 1;
        // a goalkeeper's record is clean sheets, not goals: kept for a full game (an hour or more) without conceding
        if (p.pos === 'GK' && m.sides[1 - k].goals === 0 && (sd.mins[pid] || 0) >= 60) p.intl.cs = (p.intl.cs || 0) + 1;
        if (!tourn) {
          // players come back tired, occasionally injured, and happier for the call-up
          p.fitness = Math.max(45, Math.round(sd.st[pid] ?? p.fitness) - 6);
          if (sd.injured[pid]) FM.Injury.hurt(p, { where: 'intl' });
          p.morale = Math.min(100, p.morale + 3);
          // your own player picked for your country: he plays for two masters, and the club notices when it costs
          if (W.ownPlayer(p) && W.isUserNation(sd.club.id)) {
            if ((p.intl.by[s.year] || 0) > 4) p.fitness = Math.max(40, p.fitness - 3);
            if (sd.injured[pid]) {
              const club = W.userClub();
              club.fanMood = U.clamp(club.fanMood - 2, 0, 100);
              club.boardConf = U.clamp(club.boardConf - 1.5, 0, 100);
              FM.News.add({
                type: 'club',
                title: `${W.name(p)} hurt on your international duty`,
                body: `The ${club.name} supporters are unhappy that a player picked for your country came back injured.`,
                pid: p.id,
                clubId: club.id,
              });
            }
          }
        } else p.fitness = Math.max(50, Math.round(sd.st[pid] ?? p.fitness));
        if (first && (W.isUser(p.clubId) || W.age(p) <= 19 || W.isUserNation(sd.club.id)))
          FM.Stories.firstCap(p, sd.club, m.sides[1 - k].club);
      }
    });
    r.goals.forEach((g) => {
      const p = s.players[g.pid];
      if (p && p.intl) p.intl.goals++;
      if (tourn) FM.Records.noteGoal(fx, g, 'T_' + fx.tid);
    });
    // Coefficient update (qualifiers and finals count for more than friendlies)
    const exp = 1 / (1 + Math.pow(10, ((A.club.coef - H.club.coef) * 10 - (fx.neutral ? 0 : 60)) / 400));
    const score = r.hg > r.ag ? 1 : r.hg < r.ag ? 0 : r.pens ? (r.pens[0] > r.pens[1] ? 0.6 : 0.4) : 0.5;
    const gd = Math.abs(r.hg - r.ag),
      K =
        (tourn ? 45 : fx.kind === 'qual' ? 35 : fx.kind === 'nl' ? 30 : fx.kind === 'invite' ? 28 : 22) *
        (gd <= 1 ? 1 : gd === 2 ? 1.5 : 1.75);
    const delta = (K * (score - exp)) / 10;
    H.club.coef = Math.round((H.club.coef + delta) * 10) / 10;
    A.club.coef = Math.round((A.club.coef - delta) * 10) / 10;
    H.club.rep = I.repFromCoef(H.club.coef);
    A.club.rep = I.repFromCoef(A.club.coef);
    [H, A].forEach((sd, k) => {
      const won = k ? r.ag > r.hg : r.hg > r.ag,
        lost = k ? r.hg > r.ag : r.ag > r.hg;
      sd.club.form = (sd.club.form || []).concat([won ? 'W' : lost ? 'L' : 'D']).slice(-5);
    });
    rec.winner = r.hg !== r.ag || r.pens ? FM.Season.winnerOf({ h: rec.h, a: rec.a, res: r }) : null;
    rec.motm = m.motm;
    s.intlLog.unshift(rec);
    if (s.intlLog.length > 120) s.intlLog.length = 120;
    // Group tables
    if (fx.kind === 'qual' && s.quals) {
      const g = s.quals.groups.find((x) => x.name === fx.group);
      if (g) FM.Season.updTable(g.table, fx, r);
    }
    if (fx.kind === 'nl') {
      const g = I.nlGroups().find((x) => x.name === fx.group);
      if (g) FM.Season.updTable(g.g.table, fx, r);
    }
    if (tourn) {
      const t = s.tourns.find((x) => x.id === fx.tid);
      t.games.push(rec);
      if (fx.group) FM.Season.updTable(t.groups.find((g) => g.name === fx.group).table, fx, r);
    } else s.intlBreak.push(rec);
    if (fx.kind === 'invite') I.inviteResult(fx);
    if (W.isUserNation(H.club.id) || W.isUserNation(A.club.id)) I.userResult(fx, m, W.isUserNation(H.club.id) ? 0 : 1);
    return rec;
  };

  I.afterDay = function (cal) {
    const s = S();
    if (cal.type === 'intl' && /b$/.test(cal.tag)) {
      FM.Stories.intlWindow(s.intlBreak);
      s.intlBreak = [];
      if (s.user && s.user.nation) I.clubBalance();
    }
    if (cal.type === 'intl' && /a$/.test(cal.tag) && s.user && s.user.nation) I.eligibilityFinds();
    if (cal.type === 'intl' && cal.tag === 'I2a' && s.nl) I.nlFinish();
    if (cal.type === 'tourn' && cal.stage === 'F' && s.tourns)
      s.tourns.forEach((t) => t.ko.final && t.ko.final.res && !t.winner && I.finishTournament(t));
  };

  I.finishTournament = function (t) {
    const s = S(),
      fin = t.ko.final,
      w = FM.Season.winnerOf(fin);
    const champ = T(w),
      runner = T(w === fin.h ? fin.a : fin.h);
    t.winner = champ.id;
    t.runnerUp = runner.id;
    const awards = FM.Records.finishTournament(t); // its awards and team of the tournament
    champ.titles[t.id] = (champ.titles[t.id] || 0) + 1;
    const goals = {};
    t.games.forEach((g) => g.goals.forEach((x) => (goals[x.pid] = (goals[x.pid] || 0) + 1)));
    const top = Object.entries(goals).sort((a, b) => b[1] - a[1])[0];
    I.squad(champ.code).forEach((p) => {
      p.morale = Math.min(100, p.morale + 10);
      p.cult = (p.cult || 0) + 2;
    });
    const hw = fin.res.hg !== fin.res.ag ? fin.res.hg > fin.res.ag : fin.res.pens && fin.res.pens[0] > fin.res.pens[1];
    const [wg, lg] = hw ? [fin.res.hg, fin.res.ag] : [fin.res.ag, fin.res.hg];
    const res = {
      id: t.id,
      name: t.name,
      year: s.year,
      winner: champ.id,
      runnerUp: runner.id,
      final: `${wg}–${lg}${fin.res.pens ? ` (${hw ? fin.res.pens[0] : fin.res.pens[1]}–${hw ? fin.res.pens[1] : fin.res.pens[0]} pens)` : ''}`,
      games: t.games.length,
      awards,
      topScorer:
        top && s.players[top[0]]
          ? { pid: top[0], name: W.name(s.players[top[0]]), goals: top[1], nat: s.players[top[0]].nat }
          : null,
    };
    s.intlSeason.push(res);
    FM.Stories.intlTournament(res, champ);
    const u = s.user;
    if (u && u.nation && t.id !== 'CT' && t.teams.includes(u.nation)) I.judgeTournament(t); // (the Trophy is an invitation: no verdict)
  };
  I.seasonResults = () => (S().intlSeason || []).slice();
  I.seasonEnd = function () {
    const s = S();
    s.tourns = null;
    s.intlDay = null;
  };
  I.findFixture = function (id) {
    const s = S();
    return (s.tourns || []).flatMap((t) => I.tournKo(t)).find((f) => f.id === id) || null;
  };
  // A tournament team's progress, for the national team screen
  I.stageReached = function (t, id) {
    if (t.winner === id) return 'Winners';
    if (t.ko.final && [t.ko.final.h, t.ko.final.a].includes(id)) return 'Final';
    const into = (k) => (t.ko[k] || []).some((f) => f.h === id || f.a === id);
    if (into('sf')) return 'Semi-finals';
    if (into('qf')) return 'Quarter-finals';
    if (into('r16')) return 'Round of 16';
    if (into('r32')) return 'Round of 32';
    return 'Group stage';
  };

  // ---------- National team jobs ----------
  I.badgeNeeded = (t) => (t.rep >= 90 ? 'Continental Pro' : t.rep >= 78 ? 'Continental A' : 'Continental B');
  I.canTake = function (t) {
    const u = S().user;
    const badgeOk = D.BADGES.indexOf(u.badges) >= D.BADGES.indexOf(I.badgeNeeded(t));
    const need = t.rep - 30 - (u.nat === t.code ? 8 : 0); // your own country will take a chance on one of its own
    const repOk = u.rep >= need;
    return {
      ok: badgeOk && repOk,
      why: !badgeOk
        ? `Requires ${U.a(I.badgeNeeded(t))} licence`
        : !repOk
          ? `Your reputation (${U.repText(u.rep)}) is too low — they want ${U.repText(need)} or better`
          : '',
    };
  };
  I.refreshJobs = function () {
    const s = S();
    const pool = Object.values(s.nteams).filter((t) => !(s.user && s.user.nation === t.id));
    // Four vacancies: two from the lower half of the ranking (realistic first jobs), two from anywhere
    const low = U.shuffle(
      pool
        .slice()
        .sort((a, b) => a.coef - b.coef)
        .slice(0, Math.ceil(pool.length / 2)),
    ).slice(0, 2);
    const rest = U.shuffle(pool.filter((t) => !low.includes(t))).slice(0, 2);
    let jobs = low.concat(rest);
    const home = s.user && s.user.nat && s.nteams['n_' + s.user.nat];
    if (home && s.user.nation !== home.id && !jobs.includes(home) && Math.random() < 0.35)
      jobs = jobs.slice(0, 3).concat(home); // your own country comes calling now and then
    s.ntJobs = jobs.map((t) => t.id).sort((a, b) => T(b).coef - T(a).coef);
  };
  I.takeJob = function (id) {
    const s = S(),
      u = s.user,
      t = T(id);
    if (!s.ntJobs.includes(id)) return { ok: false, msg: 'That job is no longer available.' };
    const c = I.canTake(t);
    if (!c.ok) return { ok: false, msg: c.why };
    if (u.nation) I.leaveNational('resigned');
    u.nation = id;
    u.ntStats = { games: 0, w: 0, d: 0, l: 0 };
    u.ntConf = 65;
    u.ntHistory.push({ nation: id, from: s.year, to: null });
    s.ntJobs = s.ntJobs.filter((x) => x !== id);
    t.picks = null;
    const club = W.userClub();
    if (club)
      club.boardConf = U.clamp(
        club.boardConf + (club.identity === 'oil' || club.identity === 'giant' ? -4 : 1),
        0,
        100,
      );
    FM.Stories.share({
      kicker: 'NATIONAL TEAM',
      title: `${u.name} named ${t.name} manager`,
      sub: `${club ? `A dual role alongside ${club.name}.` : 'A full-time international job while you wait for a club.'} ${I.nextTournament() ? `Next up: the ${I.kindName(I.nextTournament().kind)} in ${I.nextTournament().year}.` : ''}`,
      big: D.NATIONS[t.code].flag,
      clubId: club ? club.id : undefined, // (out of work, there is no club to name)
    });
    return { ok: true, msg: `You are the new ${t.name} manager.` };
  };
  I.leaveNational = function (how) {
    const s = S(),
      u = s.user;
    if (!u.nation) return;
    const h = u.ntHistory[u.ntHistory.length - 1];
    if (h) {
      h.to = s.year;
      h.how = how;
      h.stats = u.ntStats;
    }
    const t = T(u.nation);
    t.picks = null;
    u.nation = null;
    if (how === 'resigned')
      FM.News.add({
        type: 'board',
        title: `You step down as ${t.name} manager`,
        body: 'The federation thanks you for your service.',
      });
  };
  I.sackNational = function (why) {
    const u = S().user;
    if (!u.nation) return;
    const t = T(u.nation);
    I.leaveNational('sacked');
    u.rep = Math.max(1, u.rep - 3);
    FM.News.add({
      type: 'board',
      title: `Sacked by ${t.name}`,
      body: `${why} The federation has decided to make a change.`,
      big: true,
    });
  };
  // Expectation: seeds (top quarter by coefficient) should reach the semi-finals, the rest get out of the group
  I.judgeTournament = function (t) {
    const u = S().user,
      id = u.nation;
    if (!id) return;
    const seed =
      t.teams
        .slice()
        .sort((a, b) => T(b).coef - T(a).coef)
        .indexOf(id) < Math.max(1, t.teams.length / 4);
    const st = I.stageReached(t, id),
      rank = ['Group stage', 'Quarter-finals', 'Semi-finals', 'Final', 'Winners'].indexOf(st);
    const target = seed ? (t.teams.length >= 8 ? 2 : 3) : t.teams.length >= 16 ? 1 : t.teams.length >= 8 ? 2 : 3;
    u.ntConf = U.clamp((u.ntConf ?? 65) + (st === 'Winners' ? 25 : rank >= target ? 12 : -10), 0, 100);
    if (st === 'Winners') {
      u.rep = Math.min(99, u.rep + 10);
      u.stats.trophies++;
    } else if (rank >= target) u.rep = Math.min(99, u.rep + 4);
    else if (rank < target - 1)
      I.sackNational(`${T(id).name} went out at the ${st.toLowerCase()} — below expectations.`);
    else u.rep = Math.max(1, u.rep - 1);
    if (u.nation)
      FM.News.add({
        type: 'board',
        title: `${t.name}: ${T(id).name} reach the ${st.toLowerCase()}`,
        body:
          rank >= target
            ? 'The federation is pleased with the campaign.'
            : 'Not quite what the federation hoped for — but your job is safe.',
      });
  };
  // ---------- Switching allegiance ----------
  // A player with two nationalities who has never been capped may choose either nation. Each new season those who
  // are nowhere near their own nation's squad but good enough for the other's may switch; the manager of a national
  // team can also ask an eligible player to commit to his side (I.persuade).
  const switchTo = function (p, code, why) {
    const was = I.nationOf(p);
    p.alleg = code;
    I.natVer++;
    const s = S(),
      nt = s.nteams && s.nteams['n_' + code];
    if (!nt) return;
    if (W.isUser(p.clubId) || (s.user && s.user.nation === 'n_' + code) || p.ca >= 68)
      FM.News.add({
        type: 'club',
        title: `${W.name(p)} chooses to play for ${nt.name}`,
        body: `${why || `${W.short(p)} has switched allegiance from ${D.NATIONS[was] ? D.NATIONS[was].name : was}`} before winning a senior cap.`,
        pid: p.id,
        clubId: p.clubId || undefined,
      });
  };
  // ---------- Naturalisation ----------
  // Years lived abroad count from 18 (p.res: nation -> seasons at its clubs, kept up each year). A federation that wants
  // a player who qualifies pushes his citizenship through (D.NATURALISE), and he becomes eligible as a second nation.
  I.naturalRule = (code, from) => {
    const r = D.NATURALISE[code] || D.NATURALISE_DEFAULT;
    if (r.never) return null;
    return { ...D.NATURALISE_DEFAULT, ...r, need: r.fast && r.fast.from.includes(from) ? r.fast.years : r.years };
  };
  I.residence = (p, code) => (p.res && p.res[code]) || 0;
  I.naturalisationTick = function () {
    const s = S(),
      done = {},
      cut = {},
      seed = !s.resSeeded; // (once, when the world begins: foreigners already abroad are given the years they would have had)
    s.resSeeded = true;
    const bar = (code) => (cut[code] === undefined ? (cut[code] = (I.pool(code)[22] || { ca: 0 }).ca) : cut[code]);
    for (const p of U.shuffle(Object.values(s.players))) {
      if (p.retired || !p.clubId || W.age(p) < 18) continue;
      const club = s.clubs[p.clubId],
        host = club && club.nat;
      if (!host || host === p.nat || host === p.nat2 || !D.NATIONS[host]) continue;
      p.res = p.res || {};
      // a foreigner already at his club when the save began is assumed to have been there a while
      if (p.res[host] === undefined)
        p.res[host] = seed ? U.randi(0, Math.min(8, W.age(p) - 18)) : 0; // a new host starts at 0
      else p.res[host]++;
      if (p.nat2 || !I.uncapped(p) || !s.nteams['n_' + host]) continue;
      const rule = I.naturalRule(host, p.nat);
      if (!rule || p.res[host] < rule.need || (done[host] || 0) >= rule.cap) continue;
      // the federation wants players who would make its squad
      if (p.ca < bar(host) - 3 || Math.random() > rule.rate) continue;
      p.nat2 = host;
      p.natur = { code: host, year: s.year };
      done[host] = (done[host] || 0) + 1;
      if (W.isUser(p.clubId) || p.ca >= 68 || (s.user && s.user.nation === 'n_' + host))
        FM.News.add({
          type: 'club',
          title: `${W.name(p)} granted ${D.NATIONS[host].name} citizenship`,
          body: `After ${U.plural(p.res[host], 'year')} in ${D.NATIONS[host].name}, ${W.short(p)} becomes eligible to play for them${I.nationOf(p) === p.nat ? ` (he may still choose ${D.NATIONS[p.nat] ? D.NATIONS[p.nat].name : p.nat}, as he has not been capped)` : ''}.`,
          pid: p.id,
          clubId: p.clubId,
        });
    }
  };
  I.allegianceTick = function () {
    I.naturalisationTick();
    const s = S(),
      cut = {};
    const info = (code) =>
      (cut[code] =
        cut[code] ||
        (() => {
          const pool = I.pool(code);
          return { ids: new Set(pool.slice(0, 23).map((p) => p.id)), c23: pool[22] ? pool[22].ca : 0 };
        })());
    for (const p of Object.values(s.players)) {
      if (!p.nat2 || p.retired || !I.uncapped(p) || W.age(p) < 18) continue;
      const cur = I.nationOf(p),
        other = cur === p.nat ? p.nat2 : p.nat;
      if (!s.nteams['n_' + other] || !s.nteams['n_' + cur] || info(cur).ids.has(p.id)) continue;
      if (p.ca >= info(other).c23 - 3 && Math.random() < 0.5) switchTo(p, other);
    }
  };
  // Eligible for this nation through his family or birth, but playing for (or free to play for) another, uncapped
  I.eligibleSwitch = (code) =>
    Object.values(S().players)
      .filter(
        (p) =>
          !p.retired &&
          W.age(p) >= 17 &&
          (p.nat === code || p.nat2 === code) &&
          I.nationOf(p) !== code &&
          I.uncapped(p),
      )
      .sort((a, b) => b.ca - a.ca)
      .slice(0, 12);
  // The chance an eligible, uncapped player says yes: better if he is not in his own nation's squad, if we are the
  // stronger side, if we are a bigger name; an ambitious one goes where the better team is
  // What makes him more or less likely to say yes, in points: [reason, change]
  I.persuadeFactors = function (p) {
    const s = S(),
      u = s.user,
      ours = u.nation && T(u.nation);
    if (!ours) return [];
    const cur = T('n_' + I.nationOf(p)),
      rank = I.pool(I.nationOf(p)).indexOf(p);
    const gap = ours.coef - (cur ? cur.coef : 40);
    const out = [['A fair hearing', 25]];
    if (rank < 0 || rank >= 23)
      out.push([
        `He is not in ${D.NATIONS[I.nationOf(p)].name}'s squad: a place with us is a place`,
        25 + (rank < 0 ? 10 : 0),
      ]);
    else out.push([`He is in ${D.NATIONS[I.nationOf(p)].name}'s squad already`, 0]);
    const g = Math.round(U.clamp(gap / 40, -0.2, 0.2) * 100);
    if (g) out.push([g > 0 ? 'We are the stronger side' : 'We are the weaker side', g]);
    const r = Math.round(((u.rep - 50) / 250) * 100);
    if (r) out.push([r > 0 ? 'Your reputation' : 'Your standing is low', r]);
    if (p.hid.amb >= 14)
      out.push([
        gap > 0 ? 'He is ambitious and we are the better team' : 'He is ambitious and wants the better team',
        gap > 0 ? 10 : -10,
      ]);
    return out;
  };
  I.persuadeChance = function (p) {
    const f = I.persuadeFactors(p);
    return f.length ? U.clamp(f.reduce((t, x) => t + x[1], 0) / 100, 0.05, 0.9) : 0;
  };
  // The finds of the federation's scouts: at the start of an international window, an uncapped player of the nation's blood who is
  // good enough for the squad, whom nobody has yet told you about (a better scouting network finds him sooner)
  I.eligibilityFinds = function () {
    const s = S(),
      u = s.user,
      t = u.nation && T(u.nation);
    if (!t) return;
    const found = (u.ntFound = u.ntFound || {});
    const pool = I.pool(t.code),
      bar = pool[22] ? pool[22].ca - 2 : 0;
    const scouts = (u.scouts || []).map((id) => s.staff[id]).filter(Boolean);
    const skill = scouts.length ? U.avg(scouts, (x) => x.judge || x.ability) : 8;
    const list = I.eligibleSwitch(t.code).filter(
      (p) => !found[p.id] && p.ca >= bar && Math.random() < 0.3 + skill / 40,
    );
    if (!list.length) return;
    const p = list[0];
    found[p.id] = s.year;
    const pct = Math.round(I.persuadeChance(p) * 100);
    FM.News.add({
      type: 'report',
      title: `Federation scouts: ${W.name(p)} could play for ${t.name}`,
      body: `${D.NATIONS[p.nat].flag} ${W.name(p)} (${W.age(p)}, ${p.pos}) is eligible through ${p.nat === t.code ? 'birth' : 'his family'}, has not played for a senior side and is good enough for the squad. Our scouts rate the chance he commits at about ${Math.round(pct / 10) * 10}%.`,
      pid: p.id,
    });
  };
  // Running a club and a nation: a manager who picks his own club's players for the country, and sends them back tired or hurt,
  // answers for it at the club; and one who fills the squad with them answers for it at the federation
  I.clubBalance = function () {
    const s = S(),
      u = s.user,
      t = u.nation && T(u.nation),
      c = W.userClub();
    if (!t || !c || !W.employed()) return;
    const mine = I.squad(t.code).filter((p) => W.ownPlayer(p));
    if (mine.length >= 7) {
      u.ntConf = U.clamp((u.ntConf ?? 65) - 4, 0, 100);
      FM.News.add({
        type: 'board',
        title: `${t.name}: questions about your selection`,
        body: `${U.plural(mine.length, 'player')} from ${c.name} in the squad. The federation and the press ask whether the best players are being picked or your own.`,
      });
    }
  };
  I.persuade = function (pid) {
    const s = S(),
      u = s.user,
      p = s.players[pid],
      ours = u.nation && T(u.nation);
    if (!ours || !p) return { ok: false, msg: 'You are not managing a national team.' };
    if (p.nat !== ours.code && p.nat2 !== ours.code)
      return { ok: false, msg: `${W.name(p)} is not eligible for ${ours.name}.` };
    if (I.nationOf(p) === ours.code) return { ok: false, msg: `${W.short(p)} already plays for ${ours.name}.` };
    if (!I.uncapped(p))
      return { ok: false, msg: `${W.short(p)} has played for ${D.NATIONS[I.nationOf(p)].name} and is tied to them.` };
    if (p.askY === s.year) return { ok: false, msg: `You have already asked ${W.short(p)} this year.` };
    p.askY = s.year;
    const chance = I.persuadeChance(p);
    if (Math.random() < chance) {
      switchTo(p, ours.code, `${W.short(p)} accepted ${u.name}'s call and commits to ${ours.name}`);
      return { ok: true, msg: `${W.name(p)} will play for ${ours.name}!` };
    }
    return {
      ok: false,
      msg: `${W.name(p)} wants to keep his options open and turns you down. Ask again next season.`,
    };
  };

  // ---------- The federation ----------
  // What the federation wants this season, how it feels about you (0-100), and what is coming up
  I.objective = function () {
    const s = S(),
      id = s.user.nation,
      t = id && T(id);
    if (!t) return null;
    if (s.tourns) return { text: 'Do well at the finals: the federation expects at least the knockout stage' };
    const g = s.quals && s.quals.groups.find((x) => x.teams.includes(id));
    if (g)
      return {
        text: `Qualify for the ${s.quals.kind === 'world' ? 'World Championship' : 'continental championships'}: ${g.slots} place${g.slots === 1 ? '' : 's'} from ${g.name.trim()}`,
        group: g,
      };
    const nlg = I.nlGroupOf(id);
    if (nlg)
      return {
        text: `${nlg.confed.name}, ${nlg.league}: win ${nlg.label} to go up${nlg.li ? '' : ' and stay among the best'}, and finish above the bottom to stay up`,
        group: nlg.g,
      };
    if (s.quals && Object.values(s.quals.direct).flat().includes(id))
      return { text: 'Already qualified for the finals: a quiet year to build the side' };
    return { text: 'No qualifying this year: a chance to build for the next campaign' };
  };
  // Upcoming international matches for your nation (qualifiers named, friendlies drawn on the day)
  I.upcoming = function () {
    const s = S(),
      id = s.user.nation;
    if (!id) return [];
    const out = [];
    const g = (s.quals && s.quals.groups.find((x) => x.teams.includes(id))) || (I.nlGroupOf(id) || {}).g;
    const label = s.quals && s.quals.groups.includes(g) ? `${I.TNAME[g.tn]} qualifier` : g ? 'Nations League' : '';
    const played = g ? g.table[id].p : 0;
    let ix = 0;
    s.calendar.slice(s.day).forEach((d, k) => {
      if (d.type !== 'intl') return;
      const md = MD[d.tag] ?? 0;
      const fx = g && md >= played && (g.rounds[md] || []).find((f) => f.h === id || f.a === id);
      out.push({
        in: k,
        md: ++ix,
        opp: fx ? T(fx.h === id ? fx.a : fx.h) : null,
        home: fx ? fx.h === id : null,
        label: fx ? label : 'Rest',
      });
    });
    return out.slice(0, 4);
  };
  I.recent = () => (S().intlLog || []).filter((g) => g.h === S().user.nation || g.a === S().user.nation).slice(0, 5);
  I.userResult_conf = function (u, won, lost, fx) {
    // the federation: wins please them, defeats (above all in competitive games) do not
    const w = fx.kind === 'friendly' ? 0.5 : 1;
    u.ntConf = U.clamp((u.ntConf ?? 65) + (won ? 2.5 : lost ? -3.5 : -0.5) * w, 0, 100);
    if (u.ntConf <= 8) I.sackNational('The federation has lost patience after the run of results.');
  };
  I.userResult = function (fx, m, side) {
    const u = S().user,
      r = fx.res,
      me = m.sides[side],
      op = m.sides[1 - side];
    const gf = me.goals,
      ga = op.goals;
    const won = gf > ga || (r.pens && r.pens[side] > r.pens[1 - side]),
      lost = ga > gf || (r.pens && r.pens[side] < r.pens[1 - side]);
    u.ntStats = u.ntStats || { games: 0, w: 0, d: 0, l: 0 };
    u.ntStats.games++;
    won ? u.ntStats.w++ : lost ? u.ntStats.l++ : u.ntStats.d++;
    u.rep = U.clamp(u.rep + (won ? 0.4 : lost ? -0.3 : 0.05) * (fx.kind === 'friendly' ? 0.5 : 1.5), 1, 99);
    const t = me.club;
    FM.News.add({
      type: 'headline',
      paper: 'International Football Weekly',
      title: won
        ? `${t.name} beat ${op.club.name}`
        : lost
          ? `${t.name} lose to ${op.club.name}`
          : `${t.name} held by ${op.club.name}`,
      body: `${fx.po}. ${m.sides[0].club.name} ${r.hg}–${r.ag}${r.pens ? ` (${r.pens[0]}–${r.pens[1]} pens)` : ''} ${m.sides[1].club.name}.${m.motm ? ` Player of the match: ${W.name(S().players[m.motm])}.` : ''}`,
    });
    I.userResult_conf(u, won, lost, fx);
    u.lastMatch = { fxId: fx.id, comp: 'INTL' };
  };
})();
