// The world's lore and its map. Everything here is made from what the world already holds (clubs, their reputation paths, the
// generated past seasons in S.archive, the legends) with a random-number generator of its own, so the simulation's dice are never
// disturbed and a world's lore is the same each time it is made:
//   - geography: a place for every club (js/geo.js), distances, the wear and the cost of a long away trip, local derbies
//   - older glory: league titles, top-flight seasons and the best decade before the generated seasons begin
//   - club details: anthem, ground nickname, record attendance, biggest win, most famous match
//   - rivalries: where each began, and the record between the two clubs before the save
//   - competitions: when each began, its trophy, its changes of format, its giant-killings
//   - what kind of club it is (works, police, military, university, reserve side) and what that means
//   - people: legends who are now managers (of the rival, too), chairmen, ambassadors and pundits
// State is S.lore (created by W.seedLegends for a new world, and by L.ensure for a save that has none).
(function () {
  const FM = window.FM,
    U = FM.U,
    D = FM.D,
    W = FM.W;
  const L = (FM.Lore = {});
  const S = () => FM.S;

  // ---------------------------------------------------------------- random numbers of our own
  const hash = (s) => {
    let h = 2166136261;
    for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return h >>> 0;
  };
  const rngOf = (seed) => {
    let s = hash(seed);
    const r = () => {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    r();
    r();
    r.pick = (a) => a[Math.floor(r() * a.length)];
    r.int = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.chance = (p) => r() < p;
    r.wpick = (a, w) => {
      const ws = a.map(w),
        tot = ws.reduce((t, x) => t + x, 0);
      if (!(tot > 0)) return a[Math.floor(r() * a.length)];
      let x = r() * tot;
      for (let i = 0; i < a.length; i++) if ((x -= ws[i]) <= 0) return a[i];
      return a[a.length - 1];
    };
    return r;
  };
  L.hash = hash;
  L.rngOf = rngOf;
  const clubsOf = () => Object.values(S().clubs);
  const real = (c) => c.comp && c.sim !== 'nation' && !c.parent; // (a club of a league; a reserve side has no history of its own)
  const nm = (c) => (typeof c === 'string' ? (S().clubs[c] || {}).name || c : c.name);
  const decade = (y) => `${Math.floor(y / 10) * 10}s`;
  const fmtKm = (km) => `${Math.round(km / 10) * 10 || 10}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // ================================================================ geography
  // A club's place [latitude, longitude]: from js/geo.js (by club code); a club the data has no place for (one an editor added) sits
  // somewhere in its nation
  let placeFor = null,
    placeCache = {},
    midCache = {};
  const fresh = () => {
    if (placeFor !== S()) {
      placeFor = S();
      placeCache = {};
      midCache = {};
    }
  };
  L.codeOf = (id) => String(id).replace(/^c_/, '');
  const natMid = (nat) => {
    if (midCache[nat]) return midCache[nat];
    const pts = clubsOf()
      .filter((c) => c.nat === nat && D.GEO && D.GEO[L.codeOf(c.id)])
      .map((c) => D.GEO[L.codeOf(c.id)]);
    return (midCache[nat] = pts.length
      ? [pts.reduce((t, p) => t + p[0], 0) / pts.length, pts.reduce((t, p) => t + p[1], 0) / pts.length]
      : [20, 0]);
  };
  L.place = function (x) {
    fresh();
    const c = typeof x === 'string' ? S().clubs[x] : x;
    if (!c || c.sim === 'nation') return null;
    if (placeCache[c.id]) return placeCache[c.id];
    const g = D.GEO && D.GEO[L.codeOf(c.id)];
    if (g) return (placeCache[c.id] = g);
    const m = natMid(c.nat),
      h = hash(c.id);
    return (placeCache[c.id] = [m[0] + ((h % 400) - 200) / 100, m[1] + (((h >>> 9) % 400) - 200) / 100]);
  };
  // Distance between two clubs in kilometres (0 when either has no place)
  L.km = function (a, b) {
    const p = L.place(a),
      q = L.place(b);
    if (!p || !q) return 0;
    const r = Math.PI / 180,
      dl = (q[0] - p[0]) * r,
      dn = (q[1] - p[1]) * r;
    const h = Math.sin(dl / 2) ** 2 + Math.cos(p[0] * r) * Math.cos(q[0] * r) * Math.sin(dn / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(h)));
  };
  // A long away trip tires the visitors: nothing up to 350 km, then a point of fitness for every 230 km, up to 9
  L.WEAR_FREE = 350;
  L.WEAR_PER_KM = 1 / 230;
  L.WEAR_MAX = 9;
  L.wear = function (homeId, awayId) {
    const km = L.km(homeId, awayId);
    return km <= L.WEAR_FREE ? 0 : Math.min(L.WEAR_MAX, (km - L.WEAR_FREE) * L.WEAR_PER_KM);
  };
  // What the trip costs the visiting club: a coach for a short way, a charter flight for a long one; bigger clubs travel in
  // more comfort
  L.tripCost = function (awayClub, homeId) {
    const km = L.km(awayClub, homeId);
    if (km < 20) return 0;
    const base = km < 350 ? 2500 + km * 14 : 14000 + km * 32;
    return Math.round((base * (0.55 + (awayClub.rep || 50) / 100)) / 100) * 100;
  };
  L.tripText = function (homeId, awayId) {
    const km = L.km(homeId, awayId);
    if (km < 25) return 'a short trip across town';
    return `${fmtKm(km)} km${km >= 1500 ? ' by air' : km >= L.WEAR_FREE ? ' by road or rail' : ''}${L.wear(homeId, awayId) >= 3 ? ', a long trip that will tire the visitors' : ''}`;
  };
  // The clubs nearest to one (same nation), for local derbies and the map
  L.nearest = function (club, n = 5, maxKm = 1e9) {
    return clubsOf()
      .filter((x) => x.id !== club.id && x.nat === club.nat && real(x))
      .map((x) => ({ c: x, km: L.km(club, x) }))
      .filter((o) => o.km <= maxKm)
      .sort((a, b) => a.km - b.km)
      .slice(0, n);
  };
  // The clubs that are neighbours (within a short distance, in the same nation): the local derby of a club with no named one
  L.LOCAL_KM = 30;

  // ================================================================ older glory
  // When each nation's top flight began (the clubs' great days before the generated seasons fall between this and them)
  L.LEAGUE_START = {
    ENG: 1889,
    SCO: 1891,
    WAL: 1950,
    IRL: 1921,
    ESP: 1929,
    ITA: 1898,
    GER: 1903,
    FRA: 1933,
    NED: 1956,
    POR: 1935,
    BEL: 1896,
    ARG: 1931,
    BRA: 1959,
    URU: 1900,
    MEX: 1943,
    USA: 1996,
    JPN: 1965,
    KOR: 1983,
    THA: 1996,
    NGA: 1972,
    MAR: 1956,
    SRB: 1923,
    TUR: 1959,
    CZE: 1925,
    GRE: 1960,
    NOR: 1937,
    POL: 1927,
    DEN: 1913,
    AUT: 1912,
    SUI: 1898,
    AUS: 1977,
    HUN: 1901,
    SWE: 1925,
    ROU: 1909,
    CRO: 1992,
    CYP: 1935,
    EGY: 1948,
    TUN: 1956,
    ALG: 1963,
    COL: 1948,
    ECU: 1957,
    CAN: 1987,
    CHN: 1994,
    KSA: 1976,
    UAE: 1974,
    IND: 1996,
    CHI: 1933,
    PER: 1966,
    PAR: 1906,
    IRN: 1973,
    QAT: 1963,
    MYS: 1982,
    VIE: 1980,
    IDN: 1979,
    PHI: 2017,
    SGP: 1996,
    RSA: 1996,
    TAN: 1965,
  };
  const WEIGHT_ID = { fallen: 1, giant: 1, historic: 1 };
  // The first season of the generated past (older glory is everything before it)
  L.windowStart = () => (S().archive || []).reduce((m, e) => Math.min(m, e.year), S().year);
  L.earlyHistory = function () {
    const st = S(),
      lore = st.lore,
      end = L.windowStart() - 1;
    lore.early = {};
    lore.champs = {};
    const nations = [
      ...new Set(
        clubsOf()
          .filter(real)
          .map((c) => c.nat),
      ),
    ];
    for (const nat of nations) {
      const start = L.LEAGUE_START[nat] || 1950;
      if (end < start) continue;
      const clubs = clubsOf().filter((c) => real(c) && c.nat === nat);
      const topSize = Math.max(
        6,
        W.leagues()
          .filter((l) => l.nat === nat && l.tier === 1)
          .reduce((t, l) => t + l.clubs.length, 0) || 16,
      );
      const rng = rngOf(`early|${nat}`);
      // the years of a club's best days: fallen giants and the old names had one long peak; the others had no better years
      const peak = {};
      for (const c of clubs) {
        // (a fallen giant's peak comes at least twenty years before the generated seasons, where its fall begins)
        const room = Math.max(1, end - start - (c.identity === 'fallen' ? 30 : 12));
        peak[c.id] = start + 6 + Math.floor(rng() * room);
      }
      // how strong a club stood in a year before the generated seasons: its size, a slow wave of its own, and its best days
      const SHAPE = {
        fallen: (d) => 40 * Math.exp(-((d / 16) ** 2)) - 8,
        historic: (d) => 14 * Math.exp(-((d / 22) ** 2)) + 4,
        giant: (d) => 8 * Math.exp(-((d / 25) ** 2)) + 10,
        oil: () => -30,
        selling: () => -2,
        youth: () => -3,
      };
      const strength = (c, y) => {
        const ago = st.year - y,
          h = hash(c.id);
        const wave = 4.5 * Math.sin(ago / 3.1 + (h % 97)) + 3 * Math.sin(ago / 1.7 + (h % 53));
        return c.rep * 0.8 + wave + (SHAPE[c.identity] ? SHAPE[c.identity](y - peak[c.id]) : 0);
      };
      const titles = {},
        seasons = {},
        champs = {},
        count = {};
      const cap = Math.max(3, Math.round((end - start + 1) * 0.2)); // (no club wins more than a fifth of the seasons)
      let prev = null;
      const topOf = {};
      for (let y = start; y <= end; y++) {
        const pool = clubs.filter((c) => (c.founded || 1900) <= y - 1 && c.identity !== 'military');
        if (pool.length < 2) continue;
        const score = new Map(pool.map((c) => [c, strength(c, y)]));
        const top = pool.sort((a, b) => score.get(b) - score.get(a) || (a.id < b.id ? -1 : 1)).slice(0, topSize);
        topOf[y] = top;
        for (const c of top) seasons[c.id] = (seasons[c.id] || 0) + 1;
        // the champion: the better a side stood, the likelier, but not by a mile; a club in its best years likelier still
        const champ = rng.wpick(top, (c) => {
          const rank = top.indexOf(c);
          return (
            Math.pow(rank + 1, -1.15) *
            (1 + 1.5 * Math.exp(-(((y - peak[c.id]) / 8) ** 2)) * (WEIGHT_ID[c.identity] ? 1 : 0.2)) *
            (prev === c.id ? 1.9 : 1) *
            ((count[c.id] || 0) >= cap ? 0.05 : 1)
          );
        });
        prev = champ.id;
        count[champ.id] = (count[champ.id] || 0) + 1;
        (titles[champ.id] = titles[champ.id] || []).push(y);
        champs[y] = champ.id;
      }
      // every fallen giant has a visible past (three titles at least) and every old name one: a club short of that takes titles
      // from the seasons around its peak in which the champion had several (it was in the top flight then)
      for (const c of clubs.filter((x) => x.identity === 'fallen' || x.identity === 'historic')) {
        const need = c.identity === 'fallen' ? 3 : 1;
        for (let k = (titles[c.id] || []).length; k < need; k++) {
          const lo = Math.max(start, (c.founded || 1900) + 4, peak[c.id] - 8),
            hi = Math.min(end, peak[c.id] + 8);
          const years = [];
          for (let y = lo; y <= hi; y++)
            if (champs[y] && champs[y] !== c.id && (titles[champs[y]] || []).length >= 2) years.push(y);
          const y = years.length ? years[Math.floor(rng() * years.length)] : null;
          if (y == null) break;
          const old = champs[y];
          titles[old] = titles[old].filter((x) => x !== y);
          champs[y] = c.id;
          titles[c.id] = (titles[c.id] || []).concat(y).sort((a, b) => a - b);
          if (!topOf[y] || !topOf[y].includes(c)) seasons[c.id] = (seasons[c.id] || 0) + 1;
        }
      }
      lore.champs[nat] = { start, end, by: champs };
      for (const c of clubs) {
        const t = titles[c.id] || [],
          n = seasons[c.id] || 0;
        if (!t.length && !n) continue;
        // the best decade: the one with the most titles, else the most seasons in the top flight
        const per = {};
        for (const y of t) per[Math.floor(y / 10) * 10] = (per[Math.floor(y / 10) * 10] || 0) + 10;
        const best = Object.entries(per).sort((a, b) => b[1] - a[1] || a[0] - b[0])[0];
        lore.early[c.id] = { t, n, b: best ? +best[0] : null, from: start, to: end };
      }
    }
  };
  // What a club won before the generated seasons: { t: [years], n: seasons in the top flight, b: best decade, from, to } or null
  L.early = (c) => {
    const lore = S().lore;
    return (lore && lore.early && lore.early[typeof c === 'string' ? c : c.id]) || null;
  };
  // All the league titles a club has: the generated seasons' and the older ones
  L.allTitles = function (c) {
    const e = L.early(c),
      st = S();
    const own = Object.entries(c.titles || {}).reduce(
      (t, [k, n]) => t + (st.comps[k] && st.comps[k].type === 'league' && st.comps[k].tier === 1 ? n : 0),
      0,
    );
    return own + (e ? e.t.length : 0);
  };

  // ================================================================ legends: notes with variety
  // The five legends of a club get a story. Four of them take it from the club's past; the others a plain one, from a pool wide enough
  // that no line is seen often, and with a cap per nation (each line at most this many times in a nation before all have been used).
  const PLAIN = [
    (c, y, g, r) => `Cult hero: scored in ${r.pick(['three', 'four', 'five', 'six', 'seven'])} straight derbies`,
    (c, y, g) => `One-club man, ${U.plural(g, 'season')}`,
    (c, y, g) => `Signed on a free in ${y} and stayed ${U.plural(g, 'season')}`,
    (c, y) => `Academy graduate who made his debut in ${y}`,
    (c, y) => `Sold to a bigger club in ${y}, then came home`,
    (c, y) => `Never missed a game in ${y}`,
    (c, y) => `Hat-trick in the ${y} derby, still talked about`,
    (c, y, g) => `Played through ${U.plural(g, 'season')} of rebuilding`,
    (c, y) => `The best the supporters saw in the ${decade(y)}`,
    (c, y) => `Scored on his debut in ${y} and never stopped`,
    (c, y, g) => `Captain for ${U.plural(Math.max(2, Math.round(g / 2)), 'season')}, a leader in the dressing room`,
    (c, y) => `Turned down a move abroad in ${y} to stay`,
    (c, y) => `Carried the club through the ${decade(y)}`,
    (c, y) => `The crowd sang his name from ${y} until the day he left`,
    (c, y, g, r) => `Once scored from ${r.int(38, 62)} yards, and the supporters still measure goals against it`,
    (c, y) => `Played on with a broken wrist in ${y}`,
    (c, y) => `Came on as a substitute in ${y} and changed the season`,
    (c, y, g) => `Won ${U.plural(Math.max(2, Math.round(g / 3)), 'player of the year award')} in the ${decade(y)}`,
    (c, y) => `Took the penalty everyone remembers, in ${y}`,
    (c, y) => `Moved from the right to the left and stayed there, from ${y}`,
    (c, y, g) => `The last of the old school, ${U.plural(g, 'season')} and never a booking`,
    (c, y) => `Brought through the youth team by a manager who was sacked a year later, ${y}`,
    (c, y) => `Played his best football in ${y}, with a broken nose`,
    (c, y, g, r) => `Cleared off the line ${r.pick(['twice', 'three times'])} in one match in ${y}`,
    (c, y) => `The shirt number nobody has worn since ${y + 8}`,
    (c, y) => `Came from the lower leagues in ${y} and outplayed everyone`,
    (c, y, g) => `${U.plural(g, 'season')} of thankless work in midfield, loved by those who watched closely`,
    (c, y) => `Scored the first goal at the new stand in ${y}`,
    (c, y) => `Played with a limp for a year and was still the best on the pitch, ${y}`,
    (c, y) => `A winger who dribbled past everyone in ${y} and was sold the same summer`,
    (c, y, g) => `Spent ${U.plural(g, 'season')} as the reserve keeper's best friend before the break in ${y}`,
    (c, y) => `Missed a penalty in ${y} and scored the rebound, which fans say was the plan`,
    (c, y) => `A half-time substitute in ${y} who stayed for the second half of his career`,
    (c, y) => `Signed from a rival in ${y}; forgiven by the second goal`,
    (c, y) => `The man who held the line in ${y} and rarely got the credit`,
    (c, y) => `Stood in the rain to sign autographs after the ${y} defeat`,
    (c, y, g) => `Played ${U.plural(g * 30, 'game')} and was booked in three of them`,
    (c, y) => `Scored a hat-trick in ${y} against the club that had released him`,
    (c, y) => `Learned the game on the club's own ground and came back as a coach, ${y}`,
    (c, y) => `A free-kick specialist from ${y}; the wall never knew where to look`,
    (c, y) => `Turned a poor ${y} into a good one by himself`,
    (c, y) => `Stayed through the relegation of ${y + 1} when he could have gone`,
    (c, y, g) => `Quiet, tidy and reliable for ${U.plural(g, 'season')}`,
    (c, y) => `The reason the ${y} crowd came early`,
    (c, y) => `Switched from striker to centre-back in ${y} and was better there`,
    (c, y) => `Introduced the club to a diet of porridge in ${y}`,
    (c, y) => `Scored with his first touch for the club in ${y}`,
    (c, y) => `Supporters still argue whether he or the manager won the ${y} season`,
    (c, y, g) => `Retired at the club after ${U.plural(g, 'season')} and was given the keys to the ground`,
    (c, y) => `Wore the armband on a night in ${y} when the floodlights failed`,
    (c, y) => `A defender who scored more than the strikers in ${y}`,
    (c, y) => `Remembered for the one tackle in ${y}`,
    (c, y) => `Played his first game at fifteen minutes' notice, ${y}`,
    (c, y) => `The unlikeliest hero of ${y}`,
    (c, y) => `Went into the stands to celebrate with the fans in ${y}`,
    (c, y) => `His ${y} goal is the one the club plays on the big screen`,
    (c, y, g) => `The engine room for ${U.plural(g, 'season')}`,
    (c, y) => `A local boy who made good in ${y}`,
    (c, y) => `Played every minute of the ${y} season`,
    (c, y) => `Scored the winner in the ${y} derby`,
    (c, y, g, r) => `Sent off ${r.pick(['once', 'twice'])} in ${y} and still voted the supporters' player of the year`,
  ];
  L.PLAIN_COUNT = PLAIN.length;
  // A plain line for a legend. `used` ({ nation: { line: times } }) caps how often any one line appears in a nation: the
  // least-used line goes first
  L.plain = function (c, y, g, used, seed) {
    const r = rngOf(`plain|${c.id}|${seed}`);
    const u = used ? (used[c.nat] = used[c.nat] || {}) : {};
    const min = Math.min(...PLAIN.map((_, i) => u[i] || 0));
    const open = PLAIN.map((_, i) => i).filter((i) => (u[i] || 0) === min);
    const i = open[Math.floor(r() * open.length)];
    u[i] = (u[i] || 0) + 1;
    return PLAIN[i](c, y, g, r);
  };
  // The stories drawn from a club's real past (a title, a cup, a escape from relegation): several wordings each, the least-used first
  const STORY = {
    title: [
      (y) => `Captained the ${y} title winners`,
      (y) => `Lifted the league trophy in ${y} after a final-day win`,
      (y) => `The heartbeat of the ${y} championship side`,
      (y) => `Unbeaten at home through the ${y} title season`,
      (y) => `Scored the goal that won the ${y} title`,
      (y) => `Top scorer for the ${y} champions`,
      (y) => `Kept goal for the ${y} champions, who let in fewer than anyone`,
      (y) => `Led the ${y} champions out of the tunnel`,
      (y) => `Won the league in ${y} at the third attempt`,
      (y) => `Won the title in ${y} and would not leave the pitch`,
      (y) => `Wore the armband when the ${y} championship was won`,
      (y) => `Made more goals than anyone in the ${y} title run`,
      (y) => `Never lost a derby in the ${y} title season`,
      (y) => `Came back from injury to win the ${y} title`,
    ],
    cup: [
      (y) => `Scored in the ${y} cup final`,
      (y) => `Kept goal through the ${y} cup run`,
      (y) => `Won the cup in ${y} with a late winner in extra time`,
      (y) => `Took the decisive penalty in the ${y} cup final shoot-out`,
      (y) => `Scored the semi-final winner on the way to the ${y} cup`,
      (y) => `Lifted the ${y} cup with a bandaged head`,
      (y) => `Man of the match in the ${y} cup final`,
      (y) => `Won the ${y} cup the year after losing the final`,
      (y) => `Beat three top-flight sides on the way to the ${y} cup`,
      (y) => `Scored four goals in the rounds of the ${y} cup`,
    ],
    stay: [
      (y, n) => `Scored the goal against ${n} that kept the club up in ${y}`,
      (y) => `Led the escape from relegation in ${y}`,
      (y) => `Held the defence together when the club stayed up in ${y}`,
      (y, n) => `Saved a penalty against ${n} that kept the club up in ${y}`,
      (y) => `Scored twice on the last day to keep the club up in ${y}`,
      (y) => `Played through injury to keep the club up in ${y}`,
      (y) => `Came back from a loan spell and kept the club up in ${y}`,
      (y, n) => `Won the six-pointer against ${n} in ${y} that decided who went down`,
      (y) => `Made the tackle on the last day that kept the club in the division, ${y}`,
      (y) => `Joined in January ${y} and saved the season`,
      (y) => `Captained the team through the ${y} fight against the drop`,
    ],
  };
  // A story for a legend: kind 'title' | 'cup' | 'stay'; `near` names a neighbouring club for the lines that need one
  L.story = function (kind, c, y, used, seed, near) {
    const list = STORY[kind],
      r = rngOf(`story|${c.id}|${kind}|${seed}`);
    const u = used ? (used[c.nat] = used[c.nat] || {}) : {};
    const key = (i) => `${kind}${i}`;
    const min = Math.min(...list.map((_, i) => u[key(i)] || 0));
    const open = list.map((_, i) => i).filter((i) => (u[key(i)] || 0) === min);
    const i = open[Math.floor(r() * open.length)];
    u[key(i)] = (u[key(i)] || 0) + 1;
    return list[i](y, near ? near(c) : 'the old rivals');
  };
  // The nine lines the first versions of the game wrote (a save made then has them over and over): they are made new, once
  const OLD_PLAIN = [
    /^Cult hero: scored in five straight derbies$/,
    /^One-club man, \d+ seasons?$/,
    /^Signed on a free in \d+ and stayed \d+ seasons?$/,
    /^Academy graduate who made his debut in \d+$/,
    /^Sold to a bigger club in \d+, then came home$/,
    /^Never missed a game in \d+$/,
    /^Hat-trick in the \d+ derby, still talked about$/,
    /^Played through \d+ seasons? of rebuilding$/,
    /^The best the supporters saw in the \d+s$/,
  ];
  L.refreshLegends = function () {
    const lore = S().lore,
      used = {};
    if (lore.legendsV >= 1) return 0;
    let n = 0;
    for (const c of clubsOf()) {
      (c.legends || []).forEach((l, i) => {
        if (!OLD_PLAIN.some((re) => re.test(l.note || ''))) return;
        const m = /^(\d+)[–-](\d+)$/.exec(l.era || '');
        const from = m ? +m[1] : S().year - 20,
          to = m ? +m[2] : from + 8;
        const g = Math.max(1, to - from);
        l.note = L.plain(c, from + 1 + (hash(c.id + i) % Math.max(1, g - 1)), g, used, i);
        n++;
      });
    }
    lore.legendsV = 1;
    return n;
  };

  // ================================================================ club details
  const ANTHEMS = [
    'The {nick} Roar',
    '{city} Forever',
    'Up the {nick}',
    'March of the {nick}',
    'Sing for {city}',
    'The Ballad of {ground}',
    'Stand Up for {city}',
    'Colours on the Hill',
    'We Are {city}',
    'Floodlights over {city}',
    'Hearts of {city}',
    'The Long Road to {ground}',
    'Song of the {nick}',
    'Rise, {city}, Rise',
    'Every Saturday',
  ];
  const ANTHEM_NOTES = [
    'An old music-hall tune with new words',
    'Written by a supporter in {y}',
    'Sung before every home game since {y}',
    'A brass-band march adopted in {y}',
    'Played as the teams walk out',
    'Taken from a folk song and sung since {y}',
    'Written for the club by a local choir in {y}',
    'A hymn tune the terraces borrowed in {y}',
    'Set to a sea shanty the dockers sang on the way to the match',
    "The works band's march, played at the ground since {y}",
    'A schoolboy’s poem set to music for the {y} cup run',
    'Adapted from a regimental march after the club’s first trophy',
    'Started on an away coach in {y} and never stopped',
    'A lullaby the old goalkeeper hummed, now bellowed by twenty thousand',
    'Commissioned by the chairman in {y}; the fans rewrote the second verse',
    'A miners’ choir song, sung in the tunnel before kick-off',
    'Played on a single trumpet at every home game since {y}',
    'Borrowed from a rival’s old song, with the insults changed',
    'Taken from a village dance tune and sung since {y}',
    'A waltz written by the club’s first secretary',
    'Started as a joke in {y} and is now sung with a straight face',
    'A radio jingle from {y} the supporters made their own',
    'Sung only after a win, so the choir has sung less than it would like',
    'Written by the groundsman’s daughter in {y}',
  ];
  const GROUND_BIG = [
    'The Cauldron',
    'The Colosseum',
    'The Bowl',
    'The Fortress',
    'The Furnace',
    'The Citadel',
    'The Amphitheatre',
  ];
  const GROUND_MID = [
    'The Hollow',
    'The Lantern',
    'The Kettle',
    'The Nest',
    'The Orchard',
    'The Quarry',
    'The Anvil',
    'The Cage',
    'The Pocket',
    'The Paddock',
    'The Greenhouse',
    'The Barn',
    'The Cathedral',
  ];
  const GROUND_SMALL = [
    'The Allotment',
    'The Tin Shed',
    'The Garden',
    'The Parlour',
    'The Hutch',
    'The Pasture',
    'The Corner',
    'The Field of Dreams',
    'The Shoebox',
  ];
  const CONTEXTS = [
    'a league derby',
    'a cup tie',
    'the title decider',
    'a promotion play-off',
    'a testimonial',
    'a cup replay',
    'the last home game of the season',
  ];
  const SCORES = [
    [7, 0],
    [8, 0],
    [9, 0],
    [6, 0],
    [8, 1],
    [10, 1],
    [7, 1],
    [11, 0],
    [9, 1],
    [6, 1],
    [8, 2],
    [5, 0],
  ];
  const WINS = ['2–1', '3–2', '1–0', '4–3', '3–1', '2–0', '4–2', '1–0'];

  const ownPool = (c) =>
    (c.policy && D.NAME_POOLS && D.NAME_POOLS[c.policy.heritage]) || D.NATIONS[c.nat] || D.NATIONS.ENG;
  const archiveFacts = function () {
    const won = {},
      cupWon = {},
      down = {},
      up = {},
      runner = {};
    for (const e of S().archive || []) {
      for (const k in e.comps || {}) {
        const x = e.comps[k];
        (won[x.champion] = won[x.champion] || []).push({ y: e.year, comp: k, second: x.runnerUp });
        (runner[x.runnerUp] = runner[x.runnerUp] || []).push({ y: e.year, comp: k, champ: x.champion });
      }
      for (const k in e.cups || {})
        (cupWon[e.cups[k].winner] = cupWon[e.cups[k].winner] || []).push({ y: e.year, comp: k });
      for (const id of e.relegated || []) (down[id] = down[id] || []).push(e.year);
      for (const id of e.promoted || []) (up[id] = up[id] || []).push(e.year);
    }
    return { won, cupWon, down, up, runner };
  };
  // A club that existed in a year and is a believable opponent (same nation)
  let natClubs = null;
  const opponent = (c, y, r, strong) => {
    if (!natClubs) {
      natClubs = {};
      for (const x of clubsOf()) if (real(x)) (natClubs[x.nat] = natClubs[x.nat] || []).push(x);
    }
    const all = natClubs[c.nat] || [],
      pool = [];
    // (a handful of candidates, drawn at random, is plenty)
    for (let k = 0; k < 16 && pool.length < 8; k++) {
      const x = all[Math.floor(r() * all.length)];
      if (x && x.id !== c.id && (x.founded || 1900) <= y - 1 && !pool.includes(x)) pool.push(x);
    }
    if (!pool.length) return null;
    return r.wpick(pool, (x) => Math.exp(((strong ? x.rep : 100 - x.rep) - 50) / 14) + 0.05);
  };
  L.clubDetails = function (c, facts) {
    const st = S(),
      r = rngOf(`club|${c.id}`),
      lore = st.lore;
    const nick = (c.nick || c.name.split(' ').pop()).replace(/^(The|Die|Les|Los|Le|La|El|Il|De) /, '');
    const fill = (t) =>
      t
        .replace(/\{city\}/g, c.city || c.name)
        .replace(/\{nick\}/g, nick)
        .replace(/\{ground\}/g, (c.stadium && c.stadium.name) || 'the ground');
    const yr = (lo, hi) => r.int(Math.max(lo, c.founded || lo), Math.max(hi, (c.founded || lo) + 1));
    const anthem = { title: fill(r.pick(ANTHEMS)), note: r.pick(ANTHEM_NOTES).replace('{y}', yr(1900, 1995)) };
    const cap = (c.stadium && (c.stadium.cap0 || c.stadium.cap)) || 10000;
    const sname = ((c.stadium && c.stadium.name) || '').replace(/^The /, '');
    const wordM = /(Park|Road|Lane|Field|Green|Ground|Stadium)$/.exec(sname);
    const nickGround =
      r.chance(0.3) && wordM
        ? `The ${wordM[1] === 'Stadium' ? sname.split(' ')[0] : wordM[1]}`
        : r.pick(cap > 40000 ? GROUND_BIG : cap > 14000 ? GROUND_MID : GROUND_SMALL);
    // the record crowd: older clubs when grounds had room to stand, newer ones a little over the present capacity
    const standing = (c.founded || 1950) < 1960;
    const attY = standing ? yr(1920, 1989) : yr(1996, Math.max(1997, st.year - 2));
    // (a record from the 1990s on stays within the ground: only the old standing crowds were bigger than today's capacity)
    const now = (c.stadium && c.stadium.cap) || cap;
    const att = {
      n: standing
        ? Math.round((cap * r.int(105, 150)) / 100 / 100) * 100
        : Math.round((Math.min(cap, now) * r.int(90, 100)) / 100 / 100) * 100,
      year: attY,
    };
    const ao = opponent(c, attY, r, true);
    att.vs = ao && ao.id;
    att.what = r.pick(CONTEXTS);
    // the biggest win and the heaviest defeat
    const scale = Math.max(0, (c.rep - 50) / 50);
    const [wg, wl] = r.pick(SCORES.filter(([g]) => g >= 5 + Math.round(scale * 2) || g === 6));
    const winY = yr(1905, Math.max(1990, st.year - 8));
    const wo = opponent(c, winY, r, false);
    const [lg, ll] = r
      .pick(SCORES.filter(([g]) => g <= 9))
      .slice()
      .reverse();
    const lossY = yr(1905, Math.max(1990, st.year - 8));
    const lo = opponent(c, lossY, r, true);
    const bigWin = wo && { gf: wg, ga: wl, vs: wo.id, year: winY };
    const bigLoss = lo && { gf: lg, ga: ll, vs: lo.id, year: lossY };
    // the most famous match: a cup final won, a title decided, a promotion, else an upset
    const early = lore.early && lore.early[c.id];
    const cands = [];
    for (const x of facts.cupWon[c.id] || []) cands.push({ y: x.y, kind: 'cup', comp: x.comp });
    for (const x of facts.won[c.id] || []) cands.push({ y: x.y, kind: 'title', comp: x.comp, opp: x.second });
    for (const y of facts.up[c.id] || []) cands.push({ y, kind: 'up' });
    for (const y of (early && early.t) || []) cands.push({ y, kind: 'title' });
    let famous;
    if (cands.length) {
      const f = r.pick(cands.sort((a, b) => b.y - a.y).slice(0, Math.max(2, Math.ceil(cands.length / 2))));
      const o = f.opp && st.clubs[f.opp] ? st.clubs[f.opp] : opponent(c, f.y, r, true);
      const sc = r.pick(WINS),
        pens = r.chance(0.18);
      const cname =
        f.comp && st.comps[f.comp] ? st.comps[f.comp].name : f.kind === 'title' ? 'the league' : 'the play-off';
      const text =
        f.kind === 'cup'
          ? `the ${f.y} ${cname} final against ${o ? o.name : 'a famous rival'}, won ${pens ? '2–2, 5–4 on penalties' : sc}${!pens && r.chance(0.3) ? ' after extra time' : ''}`
          : f.kind === 'title'
            ? `the ${f.y} title decider against ${o ? o.name : 'the old rivals'}, won ${sc} with the championship at stake`
            : `the ${f.y} promotion decider against ${o ? o.name : 'a fierce rival'}, won ${sc} in front of a ground that was full two hours early`;
      famous = { year: f.y, text, vs: o && o.id };
    } else {
      const y = yr(1950, Math.max(1990, st.year - 5)),
        o = opponent(c, y, r, true);
      famous = {
        year: y,
        text: `the ${y} upset of ${o ? o.name : 'a famous side'}, ${r.pick(WINS)} against all expectation`,
        vs: o && o.id,
      };
    }
    return {
      anthem,
      ground: nickGround,
      att,
      bigWin,
      bigLoss,
      famous,
    };
  };

  // ================================================================ what kind of club
  // Works, police, railway, military and university clubs, and reserve sides, from the name and the club's policy
  const KINDS = [
    {
      key: 'military',
      icon: 'medal',
      label: 'Military club',
      test: (c) => (c.policy && c.policy.military) || /Garrison|Army|Military|Barracks|Dukla|CSKA/i.test(c.name),
      text: 'Players serve here during national service: they are on loan from their own clubs and go back when it ends. The army pays them, so the club pays no wages and keeps no one.',
    },
    {
      key: 'police',
      icon: 'shield',
      label: 'Police / security club',
      test: (c) => /Dinamo|Dynamo|Police|Constabulary|Gendarm/i.test(c.name),
      text: 'Founded as the sports society of the police and security services. Its players were officers once; today it is a normal club with an institutional past, steady money and loyal, older supporters.',
    },
    {
      key: 'railway',
      icon: 'train',
      label: 'Railway club',
      test: (c) => /Lokomotiv|Locomotiv|Railway|Rail\b/i.test(c.name),
      text: 'Founded by railway workers, as railway towns did: a works team that became the town’s team.',
    },
    {
      key: 'works',
      icon: 'factory',
      label: 'Works / company club',
      test: (c) =>
        /\bWorks\b|Colliery|Foundry|Ironworks|Steelworks|Mill\b|Electric|Motors|Brewery|Torpedo|Metallurg|Zenit|Chemic|Textile|Refinery|Shipyard|Mining/i.test(
          c.name,
        ),
      text: 'Founded by the workers of a local company. The company still shapes the club: its name, its money and many of its supporters come from the works.',
    },
    {
      key: 'union',
      icon: 'worker',
      label: 'Trade-union society',
      test: (c) => /Spartak|Trud\b|Avanhard|Burevestnik/i.test(c.name),
      text: 'Founded as a trade-union sports society, one of the great sporting clubs of the old order, with a big, older following.',
    },
    {
      key: 'university',
      icon: 'cap',
      label: 'University club',
      test: (c) => /Universidad|Universit|Academical|Academicals|Students|Studenten|Akadem/i.test(c.name),
      text: 'Founded by students and graduates of a university: amateur in spirit, young in squad and proud of it.',
    },
    {
      key: 'reserve',
      icon: 'puzzle',
      label: 'Reserve side',
      test: (c) => !!c.parent,
      text: null,
    },
  ];
  // { key, icon, label, text } for a club with a kind of its own, else null
  L.kind = function (c) {
    const k = KINDS.find((x) => x.test(c));
    if (!k) return null;
    if (k.key === 'reserve') {
      const p = S().clubs[c.parent];
      return {
        ...k,
        text: `The reserve side of ${p ? p.name : 'a bigger club'}: its players belong to the parent club, it plays a division lower, and it cannot go up above its parent.`,
      };
    }
    return k;
  };

  // The identity of a club as it is shown: a police, union, railway or works club that is "fan-owned" on paper is state-backed,
  // society-owned or company-backed, so the label follows the kind of club (the board's and the money's rules stay the same).
  // c: a club, or { name, policy } for a row not yet in a world
  L.identity = function (key, c) {
    const base = D.IDENTITY[key];
    if (key !== 'fan' || !c) return base;
    const k = KINDS.find((x) => x.test(c));
    const alt = {
      military: [
        'State-Backed',
        'shield',
        'Paid for by the state: steady money, loyal older supporters and no romance.',
      ],
      police: [
        'State-Backed',
        'shield',
        'Backed by the security services: steady money, older supporters and a safe, attacking mid-table side.',
      ],
      union: [
        'Society-Owned',
        'worker',
        'Owned by a trade-union society: a big, older following that wants attacking football and a club that lives within its means.',
      ],
      railway: [
        'Company-Backed',
        'train',
        'Backed by the railway and its workers: modest money, attacking football and a club that lives within its means.',
      ],
      works: [
        'Company-Backed',
        'factory',
        'Backed by the works: modest money, attacking football and a club that lives within its means.',
      ],
    }[k && k.key];
    return alt ? { ...base, label: alt[0], icon: alt[1], fans: alt[2] } : base;
  };
  // ================================================================ rivalries
  const pairKey = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  L.pairKey = pairKey;
  const ORIGIN_SAME = [
    (a, b, y) => `Shared a ground until ${y}, and have not shared anything since`,
    (a, b, y) => `${b.name} was founded in ${y} by members who split from ${a.name} over a quarrel about the committee`,
    (a, b, y) => `One town, two clubs, one derby: the feud began when ${b.name} was founded in ${y}`,
    (a, b, y) => `Born in ${y}, when ${b.name} was founded by players who walked out of ${a.name}`,
  ];
  const ORIGIN_OTHER = [
    (a, b, y) => `Began with a disputed goal in ${y} that neither side has ever accepted`,
    (a, b, y) => `Bitter since ${y}, when a player left one for the other in the middle of the night`,
    (a, b, y) => `A touchline row in ${y} that has lasted a lifetime`,
    (a, b, y) => `Grew from a fixture the clubs argued over in ${y}, and a result nobody has forgotten`,
    (a, b, y) => `The towns have competed for everything since ${y}: markets, rail links, and now this`,
    (a, b, y) => `Started with a cup tie in ${y} that ended with a pitch invasion`,
  ];
  L.rivalry = function (a, b, facts) {
    const st = S(),
      r = rngOf(`rival|${pairKey(a.id, b.id)}`);
    const first = Math.max(a.founded || 1900, b.founded || 1900);
    const km = L.km(a, b);
    let origin, since;
    const races = [
      ...(facts.won[a.id] || []).filter((x) => x.second === b.id).map((x) => ({ y: x.y, champ: a.id })),
      ...(facts.won[b.id] || []).filter((x) => x.second === a.id).map((x) => ({ y: x.y, champ: b.id })),
    ];
    const bothDown = (facts.down[a.id] || []).filter((y) => (facts.down[b.id] || []).includes(y));
    const sameCity = a.city && a.city === b.city;
    const roll = r();
    if (sameCity && roll < 0.7) {
      // (a split, or a second club founded by walk-outs, happens in the year the younger club was founded: the rivalry starts
      // then; only "shared a ground" can come later)
      const younger = (a.founded || 1900) >= (b.founded || 1900) ? a : b,
        older = younger === a ? b : a;
      const i = r.int(0, ORIGIN_SAME.length - 1);
      since = i === 0 ? Math.max(first, r.int(first, Math.max(first + 1, st.year - 40))) : first;
      origin = ORIGIN_SAME[i](older, younger, since);
    } else if (races.length && roll < 0.8) {
      const x = r.pick(races);
      since = x.y;
      origin = r.pick([
        `Bitter since the ${x.y} title race, settled on the last day in ${nm(x.champ)}’s favour`,
        `The ${x.y} title decider is still argued about on both sides`,
      ]);
    } else if (bothDown.length && roll < 0.88) {
      since = bothDown[0];
      origin = `Went down together in ${since}, and each has blamed the other ever since`;
    } else {
      const cupY = [...(facts.cupWon[a.id] || []), ...(facts.cupWon[b.id] || [])].filter((x) => x.y >= first);
      if (cupY.length && roll < 0.95) {
        since = r.pick(cupY).y;
        origin = `Bitter since the ${since} cup final`;
      } else {
        since = r.int(Math.max(first + 1, 1920), Math.max(first + 2, st.year - 20));
        origin = r.pick(ORIGIN_OTHER)(a, b, since);
        if (km > 0 && km < 120 && r.chance(0.4)) origin = `${origin}; they are only ${fmtKm(km)} km apart`;
      }
    }
    // the record before the save: a meeting or two a season in the years both clubs existed
    const years = Math.max(2, L.windowStart() - Math.max(first, since - 1)) + (st.year - L.windowStart()) * 0.5;
    const p = Math.max(4, Math.round(years * r.int(14, 20) * 0.1));
    const pa = U.clamp(0.36 + ((a.rep - b.rep) / 40) * 0.2, 0.15, 0.6),
      pd = 0.26;
    let w = Math.round(p * pa * r.int(92, 108) * 0.01),
      d = Math.round(p * pd * r.int(85, 115) * 0.01);
    w = Math.min(w, p);
    d = Math.min(d, p - w);
    const l = p - w - d;
    const gf = Math.round(w * 2.2 + d * 1.1 + l * 0.8),
      ga = Math.round(l * 2.2 + d * 1.1 + w * 0.8);
    return { origin, since, h2h: { p, w, d, l, gf, ga } };
  };
  // A rivalry of two clubs: { origin, since, h2h from the first club's side } (a.id < b.id)
  L.rival = function (x, y) {
    const k = pairKey(typeof x === 'string' ? x : x.id, typeof y === 'string' ? y : y.id),
      lore = S().lore;
    const e = lore && lore.rivals && lore.rivals[k];
    if (!e) return null;
    const [a] = k.split('|'),
      id = typeof x === 'string' ? x : x.id;
    if (a === id) return e;
    const h = e.h2h;
    return { ...e, h2h: { p: h.p, w: h.l, d: h.d, l: h.w, gf: h.ga, ga: h.gf } };
  };
  // Neighbours with no named rival take each other as their local derby (the nearest club within L.LOCAL_KM, if that
  // club has none either), named for their towns
  L.localDerbies = function () {
    const made = [];
    const cs = clubsOf().filter((c) => real(c) && !c.rival);
    for (const c of cs.sort((a, b) => (a.id < b.id ? -1 : 1))) {
      if (c.rival) continue;
      const near = L.nearest(c, 6, L.LOCAL_KM).find((o) => !o.c.rival);
      if (!near) continue;
      const o = near.c,
        a = c.city === o.city ? `The ${c.city} Derby` : `${[c.city, o.city].sort().join('–')} Derby`;
      c.rival = o.id;
      o.rival = c.id;
      c.derby = o.derby = a;
      made.push(pairKey(c.id, o.id));
    }
    return made;
  };

  // ================================================================ competitions
  L.TITLES_OF = ['Alderman', 'Sir', 'Lord', 'Colonel', 'Reverend', 'Dr', 'Councillor', 'Major'];
  const CONT_FOUNDED = {
    CC: 1956,
    CL: 1960,
    AC: 1967,
    AF: 1964,
    NC: 1962,
    EL: 1971,
    SA: 1992,
    UC: 2009,
    A2: 2004,
    AX: 1975,
    ICC: 1960,
    CWC: 2000,
  };
  const trophyFor = function (comp, r) {
    const nat = D.NATIONS[comp.nat] || D.NATIONS.ENG,
      eng = ['ENG', 'SCO', 'WAL', 'IRL', 'AUS', 'USA', 'RSA', 'CAN'].includes(comp.nat);
    const sur = r.pick(nat.ln || D.NATIONS.ENG.ln),
      first = r.pick(nat.fn || D.NATIONS.ENG.fn);
    const donor = eng
      ? `${r.pick(L.TITLES_OF)} ${first.length > 2 && r.chance(0.5) ? first + ' ' : ''}${sur}`
      : `${first} ${sur}`;
    return {
      donor,
      name:
        comp.type === 'league'
          ? r.pick([`the ${sur} Shield`, `the ${sur} Salver`, `the ${sur} Bowl`])
          : `the ${donor} ${comp.type === 'cup' ? 'Trophy' : 'Cup'}`,
    };
  };
  L.compLore = function (comp, facts) {
    const st = S(),
      r = rngOf(`comp|${comp.id}`),
      lore = st.lore;
    const start = L.LEAGUE_START[comp.nat] || 1950,
      win = L.windowStart();
    const o = { notes: [] };
    if (comp.type === 'league') {
      const tier = typeof comp.tier === 'number' ? comp.tier : 1;
      o.founded = Math.min(win, start + (tier - 1) * r.int(6, 14));
      const n = (comp.clubs || []).length;
      const n0 = Math.max(6, Math.round(n * r.int(45, 70) * 0.01));
      o.notes.push([o.founded, `Founded with ${U.plural(n0, 'club')}${comp.nat ? '' : ''}`]);
      if (n0 < n)
        o.notes.push([r.int(o.founded + 8, Math.max(o.founded + 9, win - 8)), `Grew to ${U.plural(n, 'club')}`]);
      if (comp.rules && comp.rules.relegate)
        o.notes.push([r.int(o.founded + 1, o.founded + 10), 'Promotion and relegation introduced']);
      if (comp.rules && comp.rules.win === 3)
        o.notes.push([r.int(Math.max(o.founded + 1, 1981), Math.max(o.founded + 2, 1995)), 'Three points for a win']);
      if (comp.playoff || (comp.rules && comp.rules.playoffs))
        o.notes.push([r.int(1980, Math.max(1981, win - 5)), 'Play-offs introduced']);
      if (tier === 1 && comp.nat && r.chance(0.7))
        o.notes.push([r.int(1992, 2006), `Renamed the ${comp.name} (formerly the ${W.formerName(comp)})`]);
      // the old champions and the record winners
      const champs = {};
      const early = lore.champs && lore.champs[comp.nat];
      if (tier === 1 && early) for (const y in early.by) champs[early.by[y]] = (champs[early.by[y]] || 0) + 1;
      for (const e of st.archive || [])
        if (e.comps && e.comps[comp.id])
          champs[e.comps[comp.id].champion] = (champs[e.comps[comp.id].champion] || 0) + 1;
      const best = Object.entries(champs).sort((a, b) => b[1] - a[1])[0];
      if (best) o.best = { id: best[0], n: best[1] };
    } else if (comp.type === 'cup') {
      o.founded = Math.min(win, start - r.int(0, 18));
      if (comp.euro) o.founded = r.int(1970, Math.max(1971, win - 4));
      o.notes.push([o.founded, `First played with ${U.plural(r.pick([16, 24, 32, 48]), 'club')}`]);
      o.notes.push([r.int(o.founded + 5, Math.max(o.founded + 6, 1990)), 'The final moved to a neutral ground']);
      o.notes.push([
        r.int(Math.max(o.founded + 10, 1970), Math.max(o.founded + 11, 2000)),
        'Replays replaced by extra time and penalties',
      ]);
      if (r.chance(0.6))
        o.notes.push([r.int(o.founded + 10, Math.max(o.founded + 11, win - 4)), 'Opened to the lower divisions']);
      // giant-killings: a winner from a small club
      const kills = [];
      const pool = clubsOf().filter((c) => real(c) && c.nat === comp.nat);
      const median = pool.map((c) => c.rep).sort((a, b) => a - b)[Math.floor(pool.length / 2)] || 50;
      for (const e of st.archive || [])
        if (e.cups && e.cups[comp.id]) {
          const w = st.clubs[e.cups[comp.id].winner];
          if (w && w.rep <= median - 2) kills.push({ y: e.year, id: w.id });
        }
      o.kills = kills.slice(-3);
      const champs = {};
      for (const e of st.archive || [])
        if (e.cups && e.cups[comp.id]) champs[e.cups[comp.id].winner] = (champs[e.cups[comp.id].winner] || 0) + 1;
      const best = Object.entries(champs).sort((a, b) => b[1] - a[1])[0];
      if (best) o.best = { id: best[0], n: best[1] };
    } else {
      o.founded = CONT_FOUNDED[comp.id] || r.int(1970, 2005);
      if (comp.id === 'ICC')
        o.notes.push(
          [o.founded, 'Began as a meeting of the European and South American champions'],
          [1990, 'Widened to the champion of every continent'],
        );
      else if (comp.id === 'CWC')
        o.notes.push(
          [o.founded, 'Began as a short tournament of the continental champions'],
          [2025, 'Became a 32-club tournament every four years'],
        );
      else {
        o.notes.push([o.founded, 'Began as a straight knockout between the champions of the continent’s leagues']);
        o.notes.push([r.int(o.founded + 8, o.founded + 25), 'A group stage introduced']);
        if (comp.tier > 1 || comp.drop)
          o.notes.push([r.int(1990, 2004), 'Clubs knocked out of the cup above drop into this one']);
      }
    }
    o.notes = o.notes.filter(([y]) => y <= win).sort((a, b) => a[0] - b[0]);
    o.trophy =
      comp.type === 'continental' || comp.type === 'world'
        ? {
            name: `the ${comp.name.replace(/^(FIFA|European|South American|Asian|African|North American) /, '')} trophy`,
            donor: null,
          }
        : trophyFor(comp, r);
    return o;
  };
  L.comp = (id) => (S().lore && S().lore.comps && S().lore.comps[id]) || null;

  // ================================================================ people
  // How old a legend is now: he was about twenty when his era began
  L.born = function (l) {
    if (l.born) return l.born;
    const m = /^(\d+)/.exec(l.era || '');
    return (m ? +m[1] : S().year - 40) - 19 - (hash(l.name) % 5);
  };
  L.eraEnd = (l) => {
    const m = /[–-](\d+)$/.exec(l.era || '');
    return m ? +m[1] : S().year - 10;
  };
  const CHAIR_ROLE = {
    ESP: 'President',
    ITA: 'President',
    POR: 'President',
    BRA: 'President',
    ARG: 'President',
    GER: 'President',
    FRA: 'President',
    JPN: 'President',
    MEX: 'President',
    URU: 'President',
    COL: 'President',
    ECU: 'President',
  };
  L.people = function (opts = {}) {
    const st = S(),
      lore = st.lore;
    lore.people = lore.people || { chair: {}, amb: {}, mgr: [], pundits: [] };
    const P = lore.people;
    const taken = new Set(); // legends already given a role: "clubId:index"
    const legendsOf = (c) =>
      (c.legends || [])
        .map((l, i) => ({ l, i, key: `${c.id}:${i}`, age: st.year - L.born(l) }))
        .filter((x) => x.age >= 40 && x.age <= 72 && st.year - L.eraEnd(x.l) >= 2);
    // chairmen and ambassadors, club by club
    for (const c of clubsOf().filter(real)) {
      if (P.chair[c.id]) continue;
      const rc = rngOf(`people|${c.id}`),
        ls = legendsOf(c).filter((x) => !taken.has(x.key));
      const title = (CHAIR_ROLE[c.nat] || 'Chairman') + (c.identity === 'oil' ? '' : '');
      if (ls.length && rc.chance(0.2)) {
        const x = ls.sort((a, b) => b.l.apps - a.l.apps)[0];
        taken.add(x.key);
        x.l.role = { kind: 'chair', club: c.id };
        P.chair[c.id] = { name: x.l.name, nat: x.l.nat, title, legend: x.i, since: st.year - rc.int(2, 12) };
      } else {
        const pool = ownPool(c);
        P.chair[c.id] = {
          name: `${rc.pick(pool.fn)} ${rc.pick(pool.ln)}`,
          nat: c.nat,
          title,
          legend: null,
          since: st.year - rc.int(1, 25),
        };
      }
      const la = legendsOf(c).filter((x) => !taken.has(x.key));
      if (la.length && rc.chance(0.32)) {
        const x = la.sort((a, b) => b.l.apps - a.l.apps)[0];
        taken.add(x.key);
        x.l.role = { kind: 'ambassador', club: c.id };
        P.amb[c.id] = { legend: x.i };
      }
    }
    if (opts.managers === false) return;
    // managers: a former player of the club's rival (or of the club itself) in the dugout of an AI club
    const cands = clubsOf().filter((c) => real(c) && c.manager && c.sim !== 'minimal' && !W.isUser(c.id));
    for (const c of cands) {
      const rc = rngOf(`people|mgr|${c.id}`);
      if (!rc.chance(0.1)) continue;
      const src = c.rival && st.clubs[c.rival] && rc.chance(0.6) ? st.clubs[c.rival] : c;
      const ls = legendsOf(src).filter((x) => !taken.has(x.key) && x.age <= 66 && x.age >= 42);
      if (!ls.length) continue;
      const x = ls.sort((a, b) => b.l.apps - a.l.apps)[0];
      taken.add(x.key);
      const old = st.staff[c.manager];
      const m = W.genStaff('Manager', x.l.nat, { rep: Math.round(c.rep * 0.95) });
      const parts = x.l.name.split(' ');
      m.fn = parts[0];
      m.ln = parts.slice(1).join(' ') || parts[0];
      m.age = x.age;
      m.lore = { club: src.id, i: x.i, apps: x.l.apps, era: x.l.era };
      x.l.role = { kind: 'manager', club: c.id };
      c.manager = m.id;
      if (old && old.id !== m.id) delete st.staff[old.id];
      P.mgr.push({ club: c.id, from: src.id, i: x.i, id: m.id });
    }
    // pundits: the great names of the big clubs join the Touchline Tonight panel
    if (FM.Media && !P.pundits.length) {
      const media = FM.Media.state();
      const big = clubsOf()
        .filter((c) => real(c) && c.rep >= 72)
        .sort((a, b) => b.rep - a.rep || (a.id < b.id ? -1 : 1));
      const picks = [];
      for (const c of big) {
        const ls = legendsOf(c).filter((x) => !taken.has(x.key));
        if (ls.length) picks.push({ c, x: ls.sort((a, b) => b.l.apps - a.l.apps)[0] });
        if (picks.length >= 12) break;
      }
      // three of them, spread over the nations
      const chosen = [],
        nats = new Set();
      for (const p of picks)
        if (!nats.has(p.c.nat) && chosen.length < 3) {
          nats.add(p.c.nat);
          chosen.push(p);
        }
      for (const { c, x } of chosen) {
        taken.add(x.key);
        x.l.role = { kind: 'pundit', club: c.id };
        media.pundits.push({
          name: x.l.name,
          style: ['sensible', 'contrarian', 'hothead'][hash(x.l.name) % 3],
          cids: { [c.id]: x.l.apps },
          year: st.year,
          lore: true,
          bio: `Former ${D.POS_NAME && D.POS_NAME[x.l.pos] ? D.POS_NAME[x.l.pos].toLowerCase() : 'player'}, ${U.plural(x.l.apps, 'game')} for ${c.name}`,
        });
        P.pundits.push({ name: x.l.name, club: c.id });
      }
      // (the panel keeps six: the made-up names make way first)
      while (media.pundits.length > FM.Media.PANEL_MAX) {
        const i = media.pundits.findIndex((q) => !q.cids);
        media.pundits.splice(i >= 0 ? i : 0, 1);
      }
    }
  };
  // What a legend does now, in words ('' for none)
  L.roleText = function (l) {
    const r = l.role;
    if (!r) return '';
    const c = S().clubs[r.club],
      P = S().lore && S().lore.people;
    const n = c ? c.name : '';
    return r.kind === 'manager'
      ? `Now manages ${n}`
      : r.kind === 'chair'
        ? `Now ${((P && P.chair[r.club] && P.chair[r.club].title) || 'chairman').toLowerCase()} of ${n}`
        : r.kind === 'ambassador'
          ? 'Club ambassador'
          : 'Pundit on Touchline Tonight';
  };
  L.natMid = (nat) => natMid(nat);
  // The people of a club: { chair, amb (a legend), mgr (legend), pundits } for the club sheet
  L.peopleOf = function (c) {
    const lore = S().lore,
      P = lore && lore.people;
    if (!P) return {};
    const lg = (i) => (c.legends || [])[i];
    const mg = c.manager && S().staff[c.manager];
    return {
      chair: P.chair[c.id] || null,
      amb: P.amb[c.id] ? { ...lg(P.amb[c.id].legend), i: P.amb[c.id].legend } : null,
      mgr: mg && mg.lore ? mg : null,
      pundits: (P.pundits || []).filter((p) => p.club === c.id),
    };
  };

  // ================================================================ seeding
  L.SEED_V = 1;
  // Make the lore of a world (a new one, or a save made before the lore existed). `opts.managers === false` leaves the managers as
  // they are (a world already being played)
  L.seed = function (opts = {}) {
    const st = S();
    if (!st || !st.clubs) return;
    placeFor = null;
    natClubs = null;
    st.lore = { v: L.SEED_V, clubs: {}, rivals: {}, comps: {}, people: null, legendsV: opts.fresh ? 1 : 0 };
    const lore = st.lore;
    L.earlyHistory();
    // older saves: the legends' repeated lines are made new
    L.refreshLegends();
    const facts = archiveFacts();
    // neighbours become rivals where they had none
    L.localDerbies();
    for (const c of clubsOf().filter(real)) lore.clubs[c.id] = L.clubDetails(c, facts);
    for (const c of clubsOf()) {
      if (!c.rival || !st.clubs[c.rival] || c.id > c.rival) continue;
      const o = st.clubs[c.rival];
      if (!real(c) || !real(o)) continue;
      lore.rivals[pairKey(c.id, o.id)] = L.rivalry(c, o, facts);
    }
    for (const comp of Object.values(st.comps)) {
      if (!['league', 'cup', 'continental', 'world'].includes(comp.type)) continue;
      lore.comps[comp.id] = L.compLore(comp, facts);
    }
    // (the oldest cup in the world)
    const cups = Object.entries(lore.comps).filter(([id]) => st.comps[id].type === 'cup' && !st.comps[id].euro);
    if (cups.length) cups.sort((a, b) => a[1].founded - b[1].founded)[0][1].oldest = true;
    L.people({ managers: opts.managers });
    return lore;
  };
  // A world that has no lore yet gets it (a save from before; a world made another way)
  // A club that joined the world after it began (an expansion club): its details are made like any club's, with no past to speak of
  L.addClub = function (c) {
    const st = S();
    if (!st.lore || !st.lore.clubs || !c) return;
    c.legends = c.legends || [];
    st.lore.clubs[c.id] = L.clubDetails(c, archiveFacts());
  };
  L.ensure = function () {
    const st = S();
    if (!st || !st.clubs || (st.lore && st.lore.v >= L.SEED_V)) return false;
    // (a world not yet played gets its legends as managers; one being played keeps the managers it has)
    const played = (st.archive || []).some((e) => !e.seeded) || st.day > 5;
    L.seed({ managers: played ? false : undefined });
    return true;
  };
})();
