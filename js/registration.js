// Squad registration: each real league's rules on foreign players, simplified to what matters for squad building.
// England and Italy: a 25-man list of over-21s with at least 8 homegrown players (trained in the country for three
// years before 21). Spain and France: a cap on non-EU players. Italy: at most two non-EU signings from abroad a
// season. MLS: eight international slots. Brazil and Japan: a cap on foreigners in the matchday squad. Argentina,
// Mexico, Korea, Thailand and Turkey: a cap on registered foreigners.
// Britain's Governing Body Endorsement (work permit) for England, Scotland and Wales; Germany's eight locally trained
// players; Spain and France count players from Cotonou-agreement and Euro-Med partner countries as EU-like for the
// non-EU limit.
// rules.reg === 'real' turns these on (new worlds); otherwise the one world-wide rules.foreignLimit applies.
(function () {
  const FM = window.FM,
    D = FM.D,
    W = FM.W;
  const R = (FM.Reg = {});

  R.EU = new Set([
    'FRA',
    'ESP',
    'POR',
    'NED',
    'GER',
    'BEL',
    'IRL',
    'DEN',
    'CRO',
    'ITA',
    'CZE',
    'GRE',
    'POL',
    'AUT',
    'HUN',
    // the rest of the EU, and the EEA and Switzerland, whose players count as EU for the non-EU limits
    'SWE',
    'FIN',
    'ROU',
    'SVK',
    'SVN',
    'BUL',
    'CYP',
    'NOR',
    'ISL',
    'SUI',
  ]);
  // Nations whose players Spanish and French clubs do not count against the non-EU limit: the Cotonou Agreement's
  // African, Caribbean and Pacific states, and the Euro-Mediterranean partners
  R.COTONOU = new Set(['NGA', 'GHA', 'SEN', 'CIV', 'CMR', 'COD', 'MLI', 'BFA', 'GUI', 'CPV', 'RSA', 'ANG', 'JAM']);
  R.EUROMED = new Set(['MAR', 'ALG', 'TUN', 'EGY', 'ISR']);
  const HG = { squad: 25, hg: 8 };
  // By league id. domestic: nations that count as local; exempt: partner nations that don't use a foreign place
  R.RULES = {
    D1: { ...HG, permit: true },
    D2: { ...HG, permit: true },
    D3: { ...HG, permit: true },
    D4: { ...HG, permit: true },
    SC1: { permit: true },
    WA1: { permit: true },
    DE1: { ...HG },
    DE2: { ...HG },
    ES3: { nonEU: 3, quasi: true },
    FR2: { nonEU: 4, quasi: true },
    IT1: { ...HG, nonEUSign: 2 },
    ES1: { nonEU: 3, quasi: true },
    ES2: { nonEU: 3, quasi: true },
    FR1: { nonEU: 4, quasi: true },
    AU1: { foreign: 5 }, // five visa players
    // MLS: eight international slots, a salary budget with a maximum charge per player and three Designated Players above it, and a
    // senior roster of at most 30 (amounts are annual wages; the budget counts the 20 biggest charges)
    US1: { foreign: 8, mls: { cap: 5.2e6, maxCharge: 7e5, dp: 3, roster: 30, counted: 20 } },
    BR1: { matchday: 9 },
    JP1: { matchday: 5, exempt: ['THA'] },
    AR1: { foreign: 6, matchday: 5 },
    MX1: { foreign: 9 },
    KR1: { foreign: 3, asian: 1, asean: 1 }, // the AFC's 3 + 1, with a place for an ASEAN player
    TH1: { foreign: 5, asian: 1, asean: 1 },
    TR1: { foreign: 14 },
    MY1: { foreign: 3, asian: 1, asean: 1 },
    VN1: { foreign: 3, asian: 1, asean: 1 },
    ID1: { foreign: 6, asian: 1, asean: 1 },
    SG1: { foreign: 4, asian: 1 },
    PH1: { foreign: 5 },
    ZA1: { foreign: 7 },
    SA1: { foreign: 10 }, // ten foreign players on the squad list
    SA2: { foreign: 4 },
  };
  // In words: what a league's registration rules ask of a squad (for the new-career screen and the rules pages)
  R.describe = function (id) {
    const r = R.RULES[id];
    if (!r) return ['No foreign-player limits: a club can field and register any number of foreign players.'];
    const nm = (code) => (D.NATIONS[code] ? D.NATIONS[code].name : code);
    const out = [];
    if (r.squad)
      out.push(
        `A ${r.squad}-player squad list of players over 21, at least ${r.hg} of them homegrown (three seasons at the nation's clubs between 15 and 21). Under-21s do not count against the list.`,
      );
    if (r.permit)
      out.push(
        "Work permits: a player from outside the British Isles needs a Governing Body Endorsement (EU players too since Brexit) unless he already plays or has played in Britain. It is automatic once he has played 30% (top-10 nation) to 70% (up to 70th) of his national team's games in two years; otherwise he needs 15 points from those games and his club minutes, weighted by his league. An exceptional talent is endorsed regardless.",
      );
    if (r.nonEU)
      out.push(
        `At most ${r.nonEU} non-EU players${r.quasi ? ' (players from Cotonou-agreement and Euro-Med partner countries count as EU)' : ''}.`,
      );
    if (r.nonEUSign) out.push(`No more than ${r.nonEUSign} non-EU signings from abroad in a season.`);
    if (r.foreign && (r.asian || r.asean))
      out.push(
        `At most ${r.foreign + (r.asian || 0) + (r.asean || 0)} foreign players on the books: ${r.foreign} of any nationality${r.asian ? `, one more place only an Asian player can fill (the AFC's 3 + 1)` : ''}${r.asean ? ', and one more for a player from an ASEAN nation (Thailand, Malaysia, Vietnam, Indonesia, the Philippines, Singapore)' : ''}.`,
      );
    else if (r.foreign)
      out.push(`At most ${r.foreign} ${id === 'US1' ? 'international slots' : 'foreign players'} on the books.`);
    if (r.matchday) out.push(`No more than ${r.matchday} foreign players in a matchday squad.`);
    if (r.mls)
      out.push(
        `Salary budget: the 20 biggest wage charges add up to at most ${U.money(r.mls.cap)} a year. No player counts for more than ${U.money(r.mls.maxCharge)}, and up to ${r.mls.dp} Designated Players may earn above that and still count only that much; nobody else may earn more. A senior roster of at most ${r.mls.roster}.`,
      );
    if (r.exempt) out.push(`Players from ${r.exempt.map(nm).join(', ')} do not count as foreign.`);
    return out;
  };
  R.real = () => FM.S.rules.reg === 'real';
  R.rulesFor = (c) => (R.real() && c && c.comp && R.RULES[c.comp]) || null;

  R.isEU = (p) => R.EU.has(p.nat);
  // Does he count against the non-EU limit at this club? (Spain and France exempt Cotonou and Euro-Med nationals)
  R.nonEUNat = (nat, club) => {
    if (R.EU.has(nat)) return false;
    const r = club && R.rulesFor(club);
    return !(r && r.quasi && (R.COTONOU.has(nat) || R.EUROMED.has(nat)));
  };
  R.nonEU = (p, club) => R.nonEUNat(p.nat, club);
  // Asia: the AFC's foreign-player places are "3 + 1": three of any nationality and one more that only an Asian player can fill; some
  // leagues add an ASEAN place on top. Modelled as nested groups: all foreigners, those who are not Asian, those who are not ASEAN.
  R.ASEAN = new Set(['THA', 'MYS', 'VIE', 'IDN', 'PHI', 'SGP', 'MYA', 'KHM']);
  R.isAsian = (nat) => nat === 'AUS' || (D.NATIONS[nat] && D.NATIONS[nat].region === 'ASIA');
  R.foreignGroups = function (c, r) {
    if (!r || !r.foreign) return [];
    const f = (p) => R.isForeign(p, c, r),
      asian = r.asian || 0,
      asean = r.asean || 0;
    const out = [
      { label: c.comp === 'US1' ? 'international players' : 'foreign players', f, cap: r.foreign + asian + asean },
    ];
    if (asian) out.push({ label: 'non-Asian foreign players', f: (p) => f(p) && !R.isAsian(p.nat), cap: r.foreign });
    if (asean)
      out.push({
        label: 'foreign players outside ASEAN',
        f: (p) => f(p) && !R.ASEAN.has(p.nat),
        cap: r.foreign + asian,
      });
    return out;
  };
  R.isForeign = (p, c, r) => p.nat !== c.nat && !(r && r.exempt && r.exempt.includes(p.nat));
  // Where a player grew up as a youth (his home nation) and the club that trained him: players made with the world have
  // no youth record, so each is given one when first needed (W.assignYouth): usually a club of his own nation, for a
  // young player often the club he is at now.
  R.home = function (p) {
    if (p.homeNat === undefined) W.assignYouth(p, p.clubId);
    return p.homeNat;
  };
  R.youthClub = function (p) {
    const S = FM.S;
    if (p.youth && S.clubs[p.youth]) return S.clubs[p.youth];
    if (p.homeNat === undefined) W.assignYouth(p, p.clubId);
    return p.trainedAt && S.clubs[p.trainedAt] ? S.clubs[p.trainedAt] : null;
  };
  // Homegrown for a nation: three seasons at its clubs between 15 and 21, or the youth years he is given as a player
  // made with the world (his home nation).
  R.homegrown = function (p, nat) {
    const S = FM.S,
      sp = p.career.spells;
    if (p.youth && S.clubs[p.youth] && S.clubs[p.youth].nat === nat) return true;
    if (!sp.length || sp[0].from - p.born > 18) return R.home(p) === nat;
    let yrs = 0;
    for (const s of sp) {
      const c = S.clubs[s.c];
      if (!c || c.nat !== nat) continue;
      const a = Math.max(s.from, p.born + 15),
        b = Math.min(s.to == null ? S.year : s.to, p.born + 21);
      if (b >= a) yrs += b - a + 1;
    }
    return yrs >= 3;
  };
  // The club that trained him and the nation(s) he is homegrown for: { club, home, why, years, nations }.
  // club: his youth club: the academy that produced him ('academy'), the club where he spent most of his years between
  // 15 and 21 ('record'), or the youth club he was given with the world ('given'); null if his nation has no club in
  // this world. home: the nation he is homegrown in; nations: every nation he counts as homegrown for (home first).
  R.trained = function (p) {
    const S = FM.S,
      sp = p.career.spells,
      years = {},
      byClub = {};
    for (const s of sp) {
      const c = S.clubs[s.c];
      if (!c) continue;
      const a = Math.max(s.from, p.born + 15),
        b = Math.min(s.to == null ? S.year : s.to, p.born + 21);
      if (b >= a) {
        years[c.nat] = (years[c.nat] || 0) + (b - a + 1);
        byClub[c.id] = (byClub[c.id] || 0) + (b - a + 1);
      }
    }
    const home = R.home(p),
      yc = R.youthClub(p);
    const cand = new Set([home, p.nat, ...Object.keys(years)]);
    if (yc) cand.add(yc.nat);
    const nations = [...cand].filter((n) => R.homegrown(p, n)).sort((x, y) => (y === home) - (x === home));
    if (p.youth && S.clubs[p.youth]) return { club: S.clubs[p.youth], home, why: 'academy', years, nations };
    if (sp.length && sp[0].from - p.born <= 18) {
      const best = Object.entries(byClub).sort((x, y) => y[1] - x[1])[0];
      if (best) return { club: S.clubs[best[0]], home, why: 'record', years, nations, seasons: best[1] };
    }
    return { club: yc, home, why: 'given', years, nations };
  };
  const senior = (p) => W.age(p) > 21;

  // Where a squad stands against its league's rules (loanees out don't count; loanees in do)
  R.status = function (c, without) {
    const r = R.rulesFor(c);
    if (!r) return null;
    const sq = W.squad(c.id).filter((p) => p.id !== without);
    const st = { r, n: sq.length };
    if (r.squad) st.nonHG = sq.filter((p) => senior(p) && !R.homegrown(p, c.nat)).length;
    if (r.nonEU) st.nonEU = sq.filter((p) => R.nonEU(p, c)).length;
    if (r.foreign || r.matchday) st.foreign = sq.filter((p) => R.isForeign(p, c, r)).length;
    if (r.foreign) st.groups = R.foreignGroups(c, r).map((g) => ({ ...g, n: sq.filter(g.f).length }));
    if (r.nonEUSign) st.nonEUSigned = R.nonEUSigned(c);
    return st;
  };
  // Non-EU players this club has brought in from abroad this season (transfers and loans)
  R.nonEUSigned = (c) =>
    ((FM.S.seasonLog && FM.S.seasonLog.transfers) || []).filter(
      (t) => t.to === c.id && t.from && FM.S.clubs[t.from] && FM.S.clubs[t.from].nat !== c.nat && !R.EU.has(t.nat),
    ).length;
  // Could the club register this player? { ok, why }. st: a status from R.status, to check many candidates quickly
  // Work permits in Britain (the Governing Body Endorsement, as the Football Association applies it since Brexit): every
  // player from outside the British Isles needs one, from the EU as well, unless he already plays or has played in
  // Britain. Two ways through.
  //  1. Automatic: he has played enough of his national team's games over the last two years, the share depending on
  //     where that team stands in the world ranking: 30% for the top ten, 40% to 20th, 50% to 30th, 60% to 50th,
  //     70% to 70th. Teams outside the top 70 have no automatic route.
  //  2. Points: 15 needed. Up to 8 for those international games (in proportion to the share required), and up to 8
  //     for minutes at his club(s) over two seasons, counted at what the league he plays in is worth: a regular in a
  //     top league scores most, one in a weak league little.
  // A player rated far above the league's best is endorsed as an exceptional talent whatever his numbers.
  R.UK = new Set(['ENG', 'SCO', 'WAL', 'IRL']);
  let rankCache = { key: null, map: null };
  const natRank = (code) => {
    const s = FM.S,
      key = `${s.year}-${s.day}`;
    if (rankCache.key !== key || rankCache.S !== s) {
      rankCache = { key, S: s, map: {} };
      if (s.nteams) FM.Intl.ranked().forEach((t, i) => (rankCache.map[t.code] = i));
    }
    return rankCache.map[code] ?? 99;
  };
  R.permitNeeded = (p) => {
    const cl = FM.S.clubs;
    return (
      !R.UK.has(p.nat) &&
      !(p.clubId && cl[p.clubId] && R.UK.has(cl[p.clubId].nat)) &&
      !p.career.spells.some((sp) => cl[sp.c] && R.UK.has(cl[sp.c].nat))
    );
  };
  // The share of his national team's games he played in the last two years that the automatic route asks for
  R.gbeShare = (rank) =>
    rank < 10 ? 0.3 : rank < 20 ? 0.4 : rank < 30 ? 0.5 : rank < 50 ? 0.6 : rank < 70 ? 0.7 : null;
  R.gbe = function (p, c) {
    const S = FM.S,
      rank = natRank(p.nat),
      need = R.gbeShare(rank);
    const by = (p.intl && p.intl.by) || {},
      games = (S.intlGames && S.intlGames[p.nat]) || {};
    const y = S.year;
    const recentCaps = (by[y] || 0) + (by[y - 1] || 0) || (p.intl && !p.intl.by ? Math.min(p.intl.caps || 0, 10) : 0);
    const teamGames = (games[y] || 0) + (games[y - 1] || 0) || 20; // (a new world has no record yet: a normal two years)
    const share = Math.min(1, recentCaps / teamGames);
    const out = { rank, need, share, intl: 0, club: 0, points: 0, auto: false, exceptional: false };
    out.intl = Math.min(8, Math.round((8 * share) / (need ?? 0.7))); // (a team outside the top 70 is judged against 70%)
    out.auto = need != null && share >= need;
    // minutes over two seasons at a share of the club's games, counted at the league's worth next to the top flight's
    const sp = p.season || {},
      last = (p.history || []).slice(-1)[0],
      mins = (sp.mins || (sp.apps || 0) * 75) + ((last && (last.mins || (last.apps || 0) * 75)) || 0); // (no minutes recorded: about 75 a game)
    const comp = p.clubId && S.clubs[p.clubId] && S.clubs[p.clubId].comp;
    const rounds = ((comp && S.comps[comp] && S.comps[comp].clubs.length) || 20) * 2 - 2;
    const minShare = Math.min(1, mins / (rounds * 2 * 90 * 0.9));
    const top = W.leagueLevel('D1'),
      here = comp ? W.leagueLevel(comp) : top - 12;
    out.club = Math.round(8 * minShare * U.clamp((here - 30) / (top - 30), 0.2, 1));
    out.points = out.intl + out.club;
    out.exceptional = p.ca >= W.leagueLevel(c.comp) + 14;
    out.ok = out.auto || out.points >= R.PERMIT_NEED || out.exceptional;
    return out;
  };
  const U = FM.U;
  R.PERMIT_NEED = 15;
  // A club's signing policy (Basque-only, Catalan-only): who it will not take
  R.policy = function (c, p) {
    const pol = c && c.policy;
    if (!pol || p.heritage === pol.heritage) return { ok: true };
    return { ok: false, why: `${c.name} only signs ${pol.label} players: it fields players of ${pol.label} heritage.` };
  };
  // ---------- MLS: the salary budget, Designated Players and the roster ----------
  const WKS = () => D.WAGE_WEEKS;
  R.mls = (c) => {
    const r = R.rulesFor(c);
    return r && r.mls ? r.mls : null;
  };
  // Wage charges for a list of annual wages: the top earners above the maximum count as Designated Players (up to the limit)
  // and are charged the maximum; anyone else above it is illegal and counts in full. The budget is the biggest 20 charges.
  R.mlsCharges = function (m, wages) {
    const w = wages.slice().sort((a, b) => b - a);
    const charges = w.map((x, i) => (i < m.dp && x > m.maxCharge ? m.maxCharge : x));
    return {
      dps: w.filter((x, i) => i < m.dp && x > m.maxCharge).length,
      illegal: w.filter((x, i) => i >= m.dp && x > m.maxCharge + 1).length,
      charge: U.sum(charges.sort((a, b) => b - a).slice(0, m.counted), (x) => x),
    };
  };
  R.mlsStatus = function (c, swap) {
    const m = R.mls(c);
    if (!m) return null;
    const sq = W.squad(c.id).filter((p) => !p.team && !(p.loan && p.loan.from === c.id));
    const wages = sq.filter((p) => !swap || p.id !== swap.id).map((p) => p.wage * WKS());
    return { m, roster: sq.length, wages, ...R.mlsCharges(m, wages) };
  };
  // Would signing (or renewing) him on this annual wage keep the club within the rules? renew: he is already on the books
  R.mlsCheck = function (c, p, annual, renew) {
    const m = R.mls(c);
    if (!m) return { ok: true };
    const st = R.mlsStatus(c, renew ? p : null);
    if (!renew && st.roster >= m.roster)
      return { ok: false, why: `The senior roster is full: ${st.roster} of ${m.roster}.` };
    const after = R.mlsCharges(m, st.wages.concat([annual]));
    const dpLeft = m.dp - st.dps;
    if (after.illegal)
      return {
        ok: false,
        why: `Only ${m.dp} Designated Players may earn more than ${U.money(m.maxCharge)} a year (${st.dps} are on the books). He would need to earn less.`,
      };
    if (after.charge > m.cap)
      return {
        ok: false,
        why: `The salary budget would be ${U.money(after.charge)}, over the ${U.money(m.cap)} limit${annual > m.maxCharge && dpLeft <= 0 ? '' : annual > m.maxCharge ? '' : dpLeft > 0 ? `. A Designated Player (${st.dps} of ${m.dp} used) counts for only ${U.money(m.maxCharge)}` : ''}.`,
      };
    return { ok: true };
  };
  // An AI club's squad brought within the rules: anyone above the maximum who is not a Designated Player is cut to it, and if the
  // budget is still over, the rest are trimmed in proportion
  R.mlsComply = function (c) {
    const m = R.mls(c);
    if (!m) return;
    const sq = W.squad(c.id)
      .filter((p) => !p.team && !(p.loan && p.loan.from === c.id))
      .sort((a, b) => b.wage - a.wage);
    const WK = WKS();
    sq.forEach((p, i) => {
      if (i >= m.dp && p.wage * WK > m.maxCharge) p.wage = Math.floor(m.maxCharge / WK);
    });
    let over = R.mlsStatus(c).charge - m.cap;
    for (let k = 0; over > 0 && k < 6; k++) {
      const body = sq.filter((p, i) => !(i < m.dp && p.wage * WK > m.maxCharge));
      const sum = U.sum(body.slice(0, m.counted), (p) => p.wage * WK);
      const f = Math.max(0.5, (sum - over) / sum);
      body.forEach((p) => (p.wage = Math.max(1, Math.floor(p.wage * f))));
      over = R.mlsStatus(c).charge - m.cap;
    }
  };
  R.canSign = function (c, p, st) {
    const pc = R.policy(c, p);
    if (!pc.ok) return pc;
    st = st || R.status(c, p.id);
    if (!st) return { ok: true };
    const r = st.r;
    if (r.permit && R.permitNeeded(p)) {
      const g = R.gbe(p, c);
      if (!g.ok)
        return {
          ok: false,
          why: `No work permit (Governing Body Endorsement): ${g.need == null ? `${D.NATIONS[p.nat].name} are outside the top 70, so there is no automatic route` : `he has played ${Math.round(g.share * 100)}% of ${D.NATIONS[p.nat].name}'s games in two years and ${Math.round(g.need * 100)}% would be automatic`}; on points he has ${g.points} of the ${R.PERMIT_NEED} needed (${g.intl} for international games, ${g.club} for his minutes).`,
        };
    }
    if (r.squad && senior(p) && !R.homegrown(p, c.nat) && st.nonHG >= r.squad - r.hg)
      return {
        ok: false,
        why: `No room on the squad list: ${st.nonHG} of ${r.squad - r.hg} places for non-homegrown over-21s are taken.`,
      };
    if (r.nonEU && R.nonEU(p, c) && st.nonEU >= r.nonEU)
      return { ok: false, why: `All ${r.nonEU} non-EU places are taken.` };
    const full = (st.groups || []).find((g) => g.f(p) && g.n >= g.cap);
    if (full)
      return {
        ok: false,
        why: `All ${full.cap} ${full.label === 'international players' ? 'international slots' : full.label === 'foreign players' ? 'foreign-player places' : `places for ${full.label}`} are taken.`,
      };
    // a matchday cap needs a squad to match: at most five more foreigners than the matchday allows
    if (r.matchday && !r.foreign && R.isForeign(p, c, r) && st.foreign >= r.matchday + 5)
      return { ok: false, why: `Too many foreign players for the ${r.matchday}-a-matchday rule.` };
    if (r.nonEUSign && !R.isEU(p) && p.clubId && FM.S.clubs[p.clubId].nat !== c.nat && st.nonEUSigned >= r.nonEUSign)
      return { ok: false, why: `The ${r.nonEUSign} non-EU signings from abroad allowed this season have been made.` };
    if (r.mls) return R.mlsCheck(c, p, W.wageFor(p) * WKS(), false);
    return { ok: true };
  };
  // World generation: a nationality for a new squad member that keeps the club within its league's rules.
  // made: [{ nat, age }] of the players generated so far; pick: draws a nationality from the league's mix
  R.genNat = function (club, made, age, pick) {
    const r = R.rulesFor(club);
    if (!r) return pick();
    for (let i = 0; i < 10; i++) {
      const n = pick();
      if (
        r.squad &&
        age > 21 &&
        n !== club.nat &&
        made.filter((x) => x.age > 21 && x.nat !== club.nat).length >= r.squad - r.hg
      )
        continue;
      if (r.nonEU && R.nonEUNat(n, club) && made.filter((x) => R.nonEUNat(x.nat, club)).length >= r.nonEU) continue;
      if (R.foreignGroups(club, r).some((g) => g.f({ nat: n }) && made.filter(g.f).length >= g.cap)) continue;
      return n;
    }
    return club.nat;
  };
  // Limits on the matchday squad (XI and bench) for W.pickXI: [{ f: counts against it, cap }]
  const limCache = new Map();
  R.matchdayLimits = function (club) {
    if (club.sim === 'nation') return [];
    if (!R.real()) {
      const cap = club.sim === 'full' ? FM.S.rules.foreignLimit : Infinity;
      return cap < W.NO_LIMIT ? [{ f: (p) => p.nat !== club.nat, cap }] : [];
    }
    const r = R.rulesFor(club);
    if (!r) return [];
    if (limCache.S !== FM.S) {
      limCache.clear();
      limCache.S = FM.S;
    }
    const key = club.id + '|' + club.comp;
    let out = limCache.get(key);
    if (!out) {
      out = [];
      // registration caps apply on matchday too: anyone over them can't have been registered
      if (r.nonEU) out.push({ f: (p) => R.nonEU(p, club), cap: r.nonEU });
      R.foreignGroups(club, r).forEach((g) => out.push({ f: g.f, cap: g.cap }));
      if (r.matchday) out.push({ f: (p) => R.isForeign(p, club, r), cap: r.matchday });
      limCache.set(key, out);
    }
    return out;
  };
  // One line for the squad screen: "Non-EU 2/3", "Homegrown rule: 15/17 non-homegrown over-21s", ...
  R.summary = function (c) {
    const st = R.status(c);
    if (!st) return null;
    const r = st.r,
      bits = [];
    if (r.squad) bits.push(`non-homegrown over-21s ${st.nonHG}/${r.squad - r.hg}`);
    if (r.nonEU) bits.push(`non-EU ${st.nonEU}/${r.nonEU}`);
    (st.groups || []).forEach((g, i) =>
      bits.push(`${i ? g.label : c.comp === 'US1' ? 'international slots' : 'foreigners'} ${g.n}/${g.cap}`),
    );
    if (r.nonEUSign) bits.push(`non-EU signings from abroad ${st.nonEUSigned}/${r.nonEUSign}`);
    if (r.mls) {
      const ms = R.mlsStatus(c);
      bits.push(
        `salary budget ${U.money(ms.charge)} of ${U.money(r.mls.cap)}`,
        `Designated Players ${ms.dps}/${r.mls.dp}`,
        `roster ${ms.roster}/${r.mls.roster}`,
      );
    }
    if (r.permit) bits.push('work permits for players from outside the British Isles');
    if (r.matchday) bits.push(`max ${r.matchday} foreigners in a matchday squad`);
    return bits.join(' · ');
  };
  // Your squad against the rules: each limit you are over, with the players in that group (weakest first)
  R.over = function (c) {
    const st = R.status(c);
    if (!st) return [];
    const r = st.r,
      sq = W.squad(c.id),
      out = [];
    const add = (label, cap, f) => {
      const ps = sq.filter(f).sort((a, b) => a.ca - b.ca);
      if (ps.length > cap) out.push({ label, cap, n: ps.length, players: ps });
    };
    if (r.squad) add('non-homegrown over-21s', r.squad - r.hg, (p) => senior(p) && !R.homegrown(p, c.nat));
    if (r.nonEU) add('non-EU players', r.nonEU, (p) => R.nonEU(p, c));
    R.foreignGroups(c, r).forEach((g) => add(g.label, g.cap, g.f));
    return out;
  };
  // Days to the registration deadline: the last day of the transfer window (null while it is shut)
  R.deadlineIn = () => (FM.Season.windowOpen() ? FM.Market.daysLeft() : null);
  // At the deadline your squad is registered within the rules: players you chose to leave out go first, then the
  // weakest in each group over its limit. Anyone left out can't play until the next window's deadline.
  R.registerSquad = function (c) {
    for (const p of W.squad(c.id)) delete p.unreg;
    const out = [];
    for (const g of R.over(c)) {
      let excess = g.n - g.cap;
      const order = g.players.slice().sort((a, b) => (b.leaveOut ? 1 : 0) - (a.leaveOut ? 1 : 0) || a.ca - b.ca);
      for (const p of order) {
        if (excess <= 0) break;
        if (p.unreg) {
          excess--;
          continue;
        }
        p.unreg = true;
        out.push(p);
        excess--;
      }
    }
    for (const p of W.squad(c.id)) delete p.leaveOut;
    if (out.length)
      FM.News.add({
        type: 'club',
        title: `Squad registered: ${out.length} left out`,
        body: `Over the league's limits at the deadline, so these players can't play until the next window closes: ${out.map((p) => W.name(p)).join(', ')}.`,
        clubId: c.id,
        big: true,
      });
    return out;
  };
  // A new season: the AI's MLS clubs start it within the salary budget (contracts were renewed on the way)
  const newSeason = FM.Season.newSeason;
  FM.Season.newSeason = function (entry) {
    const r = newSeason.call(this, entry);
    if (R.real()) for (const c of Object.values(FM.S.clubs)) if (c.comp && !W.isUser(c.id) && R.mls(c)) R.mlsComply(c);
    return r;
  };
})();
