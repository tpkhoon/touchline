// World definition: the world as data, kept apart from a save. A definition describes the leagues, clubs, players,
// managers, competitions and past seasons a new world starts from; a save is what happened after. Everything that will
// edit or ship a world (the world editor, club data packs, the fictional name set, the historical importer, the
// real-stats converter) builds on this one format and one set of functions:
//
//   FM.WorldDef.fromState(S)        the world you have, as a definition
//   FM.WorldDef.validate(def)       { errors, warnings }: nothing loads with errors
//   FM.WorldDef.load(def, rules)    a new world (FM.W.newWorld) with the definition applied; call FM.Season.init() after
//   FM.WorldDef.apply(def)          the same onto a world that was just made
//   FM.WorldDef.editor(def)         editing calls that keep the definition valid (club, player, league, season ...)
//   FM.WorldDef.stringify / parse   text form (JSON, with the format and version checked)
//
// This first version is an overlay: it changes what the base world has (names, colours, ratings, stadiums, managers),
// adds real or invented players to clubs, and loads past seasons into the archive. Adding whole clubs or leagues and
// replacing every player is the next step (the validator says so rather than half-doing it).
(function () {
  const FM = window.FM,
    D = FM.D,
    W = FM.W,
    U = FM.U;
  const WD = (FM.WorldDef = {});
  WD.FORMAT = 'touchline-world';
  WD.VERSION = 1;
  const HEX = /^#[0-9a-fA-F]{6}$/;
  const SIMS = ['full', 'light', 'minimal'];
  const FEET = ['Left', 'Right', 'Both'];

  WD.blank = (name = 'New world') => ({
    format: WD.FORMAT,
    version: WD.VERSION,
    meta: {
      name,
      author: '',
      description: '',
      created: new Date().toISOString().slice(0, 10),
      base: 'touchline',
      startYear: null,
      players: 'overlay',
    },
    rules: { win: 3, subs: 5, reg: 'real', foreignLimit: 99, twoLegs: true, awayGoals: false },
    leagues: [],
    clubs: [],
    players: [],
    managers: [],
    competitions: [],
    rivals: [], // [club id, club id, derby name]
    removeRivals: [], // [club id, club id]: derbies of the game's own the world does without
    removeCups: [], // ids of the game's own domestic cups the world does without
    removeClubs: [], // ids of the game's own clubs the world does without
    expansion: {}, // expansion drafts: { league id: { clubs: [club ids], protect, maxLoss, size } }
    calendar: {}, // the season's calendar: { preseason, cup, cont, world, intl } (empty: the game's own)
    intl: {}, // international football: { cycle, tourns: { id: { name, slots } }, invites: [{ id, name, host }] }
    agents: [], // the names of the agent firms (empty: the game's own)
    staff: [], // coaches, scouts and other staff: { role, fn, ln, nat, age, ability, club } (club: who comes with that job; none: on offer from the start)
    nations: [], // national teams: { code, name, short, colors, coef }
    history: { seasons: [] },
  });

  // ---------- From a world to a definition ----------
  WD.fromState = function (S = FM.S, opts = {}) {
    const def = WD.blank(opts.name || 'Exported world');
    def.meta.startYear = S.year;
    def.meta.base = 'export';
    if (opts.replace && opts.players !== false) def.meta.players = 'replace'; // the file's players are all of them
    def.rules = {
      ...def.rules,
      win: S.rules.win,
      subs: S.rules.subs,
      reg: S.rules.reg,
      foreignLimit: S.rules.foreignLimit,
      twoLegs: S.rules.twoLegs,
      awayGoals: S.rules.awayGoals,
    };
    for (const c of Object.values(S.comps)) {
      if (c.type === 'league')
        def.leagues.push({
          id: c.id,
          name: c.name,
          short: c.short,
          nat: c.nat,
          tier: c.tier,
          sim: c.sim,
          repBand: c.repBand,
          rules: JSON.parse(JSON.stringify(c.rules || {})),
        });
      else if (c.type === 'domestic' || c.type === 'continental' || c.type === 'cup')
        def.competitions.push({
          id: c.id,
          name: c.name,
          short: c.short,
          nat: c.nat || null,
          type: c.type,
          ...(WD.formatOf(c.id) ? { format: WD.formatOf(c.id) } : {}),
        });
    }
    for (const t of Object.values(S.nteams || {}))
      def.nations.push({
        code: t.code,
        name: t.name,
        short: t.short,
        colors: t.colors.slice(0, 2),
        coef: Math.round(Math.max(20, Math.min(100, t.coef)) * 10) / 10, // (the points drift as matches are played: kept in the range the editor allows)
        tactic: {
          formation: t.tactic.formation,
          buildup: t.tactic.buildup,
          press: t.tactic.press,
          width: t.tactic.width,
        },
      });
    def.intl = WD.intlNow();
    def.calendar = WD.calendarNow();
    for (const c of Object.values(S.clubs)) {
      def.clubs.push({
        id: c.id,
        name: c.name,
        short: c.short,
        nick: c.nick || '',
        city: c.city,
        nat: c.nat,
        colors: c.colors.slice(0, 2),
        identity: c.identity,
        rep: c.rep,
        league: c.comp,
        parent: c.parent || null,
        founded: c.founded || null,
        attr: c.attr ? { ...c.attr } : undefined, // market, support, catchment, owner and the ceiling (W.clubAttr)
        crest: c.crest ? c.crest.slice() : null,
        kit: c.kit ? { ...c.kit } : null,
        finance: { balance: Math.round(c.balance), budget: Math.round(c.budget) },
        facilities: { ...c.facilities },
        stadium: { name: c.stadium.name, cap: c.stadium.cap0 || c.stadium.cap },
      });
      if (c.rival && c.id < c.rival) def.rivals.push([c.id, c.rival, c.derby || 'Derby']);
      const m = c.manager && S.staff[c.manager];
      if (m)
        def.managers.push({
          club: c.id,
          fn: m.fn,
          ln: m.ln,
          nat: m.nat,
          age: m.age,
          ability: m.ability,
          personality: m.personality,
          rep: m.rep,
          tactic: c.tactic
            ? { formation: c.tactic.formation, buildup: c.tactic.buildup, press: c.tactic.press, width: c.tactic.width }
            : undefined,
        });
    }
    if (opts.players !== false)
      for (const p of Object.values(S.players)) {
        if (p.retired) continue;
        // (attributes are kept to one decimal, which can move his ability a point: potential never falls below it)
        const attrs = Object.fromEntries(D.ATTRS.map((k) => [k, Math.round(p.attrs[k] * 10) / 10]));
        def.players.push({
          id: 'dp_' + p.id,
          fn: p.fn,
          ln: p.ln,
          nat: p.nat,
          born: p.born,
          pos: p.pos,
          foot: p.foot,
          attrs,
          pa: Math.max(p.pa, W.calcCA({ attrs }, p.pos)),
          ...(p.ntUntil >= S.year ? { callup: true } : {}),
          club: p.clubId || null,
          contract: p.contract,
        });
      }
    for (const e of S.archive || [])
      def.history.seasons.push({
        year: e.year,
        label: e.label,
        comps: Object.fromEntries(
          Object.entries(e.comps || {}).map(([id, c]) => [
            id,
            { champion: c.champion, runnerUp: c.runnerUp, table: c.table },
          ]),
        ),
      });
    return def;
  };

  // ---------- Cup formats ----------
  // A domestic cup (and the European knockout cups) has options: legs = the rounds (by clubs left: 4 = semi-finals) played over two
  // legs, neutral = the rounds played at a neutral ground ('all' for every round). A continental cup has legs per knockout round
  // (qf, sf, f: 1 or 2) and may play its knockouts at one central venue. Both live in the game's data, so a definition that
  // changes one goes into the patch and is in place before the world's calendar is made.
  const euroDef = (id) => (D.EURO_CUPS || []).find((c) => c.id === id);
  // (def: a cup the definition itself adds is a domestic cup too)
  WD.cupKind = (id, def) => {
    const own = ((def && def.competitions) || []).find((c) => c.id === id && c.isNew);
    if (own) return own.kind === 'cont' ? 'cont' : 'opts';
    return D.DOMESTIC_CUPS.some((c) => c[0] === id) || euroDef(id)
      ? 'opts'
      : D.CONTINENTALS.some((c) => c.id === id)
        ? 'cont'
        : null;
  };
  WD.REGIONS = ['Europe', 'South America', 'Asia', 'Africa', 'North America'];
  const cupNow = (id) => {
    const kind = WD.cupKind(id);
    if (kind === 'opts') {
      const o = euroDef(id) ? euroDef(id).opts : D.DOMESTIC_CUPS.find((c) => c[0] === id)[4];
      return {
        legs: ((o && o.legs) || []).slice(),
        neutral: o && o.neutral === 'all' ? 'all' : ((o && o.neutral) || [2]).slice(), // (no list: the final)
        prize: euroDef(id) ? euroDef(id).prize : (o && o.prize) || 3e6,
        tiers: (o && o.tiers) || 0, // the lowest division that enters (0: every division)
        ...(o && o.play ? { play: JSON.parse(JSON.stringify(o.play)) } : {}),
      };
    }
    if (kind === 'cont') {
      const d = D.CONTINENTALS.find((c) => c.id === id);
      return {
        legs: { qf: 2, sf: 2, f: 1, ...(d.legs || {}) },
        central: !!d.central,
        prize: d.prize,
        groupSize: d.groupSize || 4,
        ...(d.feeders ? { feeders: { ...d.feeders } } : {}),
        ...(d.play ? { play: JSON.parse(JSON.stringify(d.play)) } : {}),
      };
    }
    return null;
  };
  WD.formatOf = (id) => cupNow(id);
  // The rules a competition plays by, where it differs from the world's: points for a win (a league and the groups of a
  // cup), substitutes, extra time and away goals (a knockout tie)
  WD.validatePlay = function (p, at) {
    const e = [];
    if (!p || typeof p !== 'object' || Array.isArray(p)) return [`${at}: rules is a list of settings`];
    for (const k of Object.keys(p))
      if (!['win', 'subs', 'extraTime', 'awayGoals'].includes(k)) e.push(`${at}: no rule called "${k}"`);
    if (p.win != null && ![2, 3].includes(p.win)) e.push(`${at}: a win is worth two or three points`);
    if (p.subs != null && !(Number.isInteger(p.subs) && p.subs >= 1 && p.subs <= 11))
      e.push(`${at}: substitutes are one to eleven`);
    for (const k of ['extraTime', 'awayGoals'])
      if (p[k] != null && typeof p[k] !== 'boolean') e.push(`${at}: ${k} is on or off`);
    return e;
  };
  WD.validateFormat = function (id, f, def) {
    const kind = WD.cupKind(id, def),
      at = `cup ${id}`,
      e = [];
    if (!kind) return [`${at}: the game has no such cup to give a format`];
    if (!f || typeof f !== 'object') return [`${at}: no format`];
    const rounds = (v) => Array.isArray(v) && v.every((n) => [2, 4, 8, 16, 32, 64].includes(n));
    if (kind === 'opts') {
      if (!rounds(f.legs || []))
        e.push(`${at}: legs must list rounds by clubs left (2 = the final, 4 = semi-finals, 8 ...)`);
      if (f.neutral !== 'all' && !rounds(f.neutral || [])) e.push(`${at}: neutral must be "all" or a list of rounds`);
      if (f.tiers != null && !(Number.isInteger(f.tiers) && f.tiers >= 0 && f.tiers <= 6))
        e.push(`${at}: tiers is the lowest division that enters (0: every division)`);
    } else {
      for (const k of ['qf', 'sf', 'f'])
        if (![1, 2].includes((f.legs || {})[k])) e.push(`${at}: ${k} is played over one or two legs`);
      if (f.central != null && typeof f.central !== 'boolean') e.push(`${at}: central is true or false`);
      if (f.groupSize != null && ![3, 4, 5, 6].includes(f.groupSize))
        e.push(`${at}: the groups have three, four, five or six clubs`);
      if (f.feeders != null) {
        const ids = new Set([...D.LEAGUES.map((l) => l.id), ...((def && def.leagues) || []).map((l) => l.id)]);
        if (!f.feeders || typeof f.feeders !== 'object' || Array.isArray(f.feeders))
          e.push(`${at}: feeders is a list of leagues and places`);
        else
          for (const [lg, n] of Object.entries(f.feeders))
            if (!ids.has(lg)) e.push(`${at}: feeder "${lg}" is not a league`);
            else if (!(Number.isInteger(n) && n >= 1 && n <= 8)) e.push(`${at}: ${lg} sends one to eight clubs`);
      }
    }
    if (f.prize != null && !(f.prize >= 1e5 && f.prize <= 1e9))
      e.push(`${at}: the prize is between 100,000 and 1,000,000,000`);
    if (f.play != null) e.push(...WD.validatePlay(f.play, at));
    return e;
  };

  const tacticErrors = (k, at) => {
    const e = [];
    if (!D.FORMATIONS[k.formation]) e.push(`${at}: unknown formation "${k.formation}"`);
    if (!D.BUILDUP.includes(k.buildup)) e.push(`${at}: unknown build-up "${k.buildup}"`);
    if (!D.PRESS.includes(k.press)) e.push(`${at}: unknown press "${k.press}"`);
    if (!D.WIDTH.includes(k.width)) e.push(`${at}: unknown width "${k.width}"`);
    return e;
  };

  // ---------- Expansion drafts ----------
  // New clubs that join a league can take their players from the clubs already in it, as a league's expansion teams do. Each
  // existing club protects its best players (spec.protect, 5 to 25) and loses at most spec.maxLoss of the rest; the clubs
  // that join (spec.clubs) pick in turn, the best player they can still take, filling the keepers, defenders, midfielders and
  // attackers a squad needs, until each has spec.size players. A club that loses a player gets a younger one in his place.
  // What the new clubs' own generated squads had is replaced; players the definition made for a club stay with it.
  WD.EXPANSION = { protect: 12, maxLoss: 1, size: 20 };
  WD.validateExpansion = function (lid, x, def) {
    const at = `expansion draft in ${lid}`,
      e = [];
    const league = (def.leagues || []).find((l) => l.id === lid);
    if (!league) return [`${at}: not a league of the world`];
    if (!x || typeof x !== 'object') return [`${at}: nothing to read`];
    const inLeague = new Set(def.clubs.filter((c) => c.league === lid).map((c) => c.id));
    if (!Array.isArray(x.clubs) || !x.clubs.length) e.push(`${at}: needs the clubs that take part`);
    else if (!x.clubs.every((id) => inLeague.has(id))) e.push(`${at}: its clubs must be in the league`);
    const rest = inLeague.size - ((x.clubs || []).length || 0);
    if (rest < 3) e.push(`${at}: needs at least three clubs to draft from`);
    if (!(Number.isInteger(x.protect) && x.protect >= 5 && x.protect <= 25))
      e.push(`${at}: clubs protect 5 to 25 players`);
    if (!(Number.isInteger(x.maxLoss) && x.maxLoss >= 1 && x.maxLoss <= 4))
      e.push(`${at}: a club loses one to four players`);
    if (!(Number.isInteger(x.size) && x.size >= 11 && x.size <= 30))
      e.push(`${at}: the new clubs draft 11 to 30 players each`);
    else if (rest >= 3 && x.clubs && x.size * x.clubs.length > rest * x.maxLoss)
      e.push(
        `${at}: ${x.clubs.length} club(s) drafting ${x.size} each need more than the ${rest * x.maxLoss} players the others can lose`,
      );
    return e;
  };
  WD.expansionDraft = function (S, lid, spec) {
    const taking = (spec.clubs || []).filter((id) => S.clubs[id]);
    const comp = S.comps[lid];
    if (!comp || !taking.length) return 0;
    const from = comp.clubs.filter((id) => !taking.includes(id) && !S.clubs[id].parent);
    // the new clubs' own generated squads go (a player the definition made keeps his place)
    for (const id of taking) for (const p of W.squad(id)) if (!p.defId) delete S.players[p.id];
    W.rosterVer++;
    const safe = new Set();
    for (const id of from) {
      const sq = W.squad(id)
        .filter((p) => !p.team && !p.loan)
        .sort((a, b) => b.ca - a.ca);
      sq.slice(0, spec.protect).forEach((p) => safe.add(p.id));
      for (const p of W.squad(id)) if (p.defId || p.team || p.loan) safe.add(p.id); // (made players, youth sides, loans stay)
    }
    const lost = {},
      mine = Object.fromEntries(taking.map((id) => [id, W.squad(id).filter((p) => !p.team)])),
      log = Object.fromEntries(taking.map((id) => [id, []]));
    const TARGET = { GK: 2, DEF: 6, MID: 6, ATT: 4 };
    const have = (id, g) => mine[id].filter((p) => D.POS_GROUP[p.pos] === g).length;
    let picked = 0;
    for (let round = 0; round < spec.size; round++) {
      let any = false;
      for (const id of U.shuffle(taking)) {
        if (mine[id].length >= spec.size) continue;
        const open = (p) => !safe.has(p.id) && (lost[p.clubId] || 0) < spec.maxLoss;
        const pool = from.flatMap((c) => W.squad(c)).filter(open);
        if (!pool.length) continue;
        const need = Object.keys(TARGET).find((g) => have(id, g) < TARGET[g]);
        const best =
          (need ? pool.filter((p) => D.POS_GROUP[p.pos] === need) : pool).sort((a, b) => b.ca - a.ca)[0] ||
          pool.sort((a, b) => b.ca - a.ca)[0];
        const club = S.clubs[best.clubId];
        lost[club.id] = (lost[club.id] || 0) + 1;
        log[id].push({ pid: best.id, name: W.name(best), from: club.id });
        W.startSpell(best, id);
        best.contract = S.year + U.randi(1, 3);
        best.wage = W.wageFor(best);
        delete best.listed;
        mine[id].push(best);
        // the club that lost him signs a younger player of the same position
        const age = U.randi(20, 24),
          ca = Math.max(35, best.ca - U.randi(3, 8));
        const np = W.genPlayer({
          nat: W.natFor(club),
          pos: best.pos,
          age,
          ca,
          pa: W.potentialFor(ca, age),
          clubId: null,
        });
        S.players[np.id] = np;
        W.startSpell(np, club.id);
        safe.add(np.id);
        picked++;
        any = true;
      }
      if (!any) break;
    }
    for (const id of taking) W.genSquad(S.clubs[id], W.squad(id)); // anything the draft left short: made up as for any club
    S.expansion = (S.expansion || []).concat(
      taking.map((id) => ({ year: S.year, league: lid, club: id, picks: log[id] })),
    );
    if (FM.News && FM.News.add)
      for (const id of taking)
        FM.News.add({
          type: 'world',
          title: `Expansion draft: ${S.clubs[id].name}`,
          body: `${S.clubs[id].name} took ${log[id].length} players from the league's clubs, the best ${log[id]
            .slice(0, 3)
            .map((x) => `${x.name} (${S.clubs[x.from].short})`)
            .join(', ')}.`,
          clubId: id,
        });
    return picked;
  };

  // ---------- The season's calendar ----------
  // Where the competitions fall in the season, counted in league rounds on the game's 22-round scale (0 = after the first
  // round; a longer league season stretches them to fit): the days of pre-season, the domestic cup's rounds, each stage of the
  // continental cups (six group days, then QF1 and QF2, SF1 and SF2, the final), the Club World Cup and the two international
  // breaks. It lives in the game's data, so a definition that changes it goes into the patch like a cup format does.
  WD.CONT_STAGES = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'QF1', 'QF2', 'SF1', 'SF2', 'F'];
  WD.WORLD_STAGES = ['QF', 'SF', 'F'];
  WD.calendarNow = () => ({
    preseason: D.PRESEASON_DAYS,
    cup: Object.keys(D.CUP_AFTER)
      .map(Number)
      .sort((a, b) => a - b),
    cont: Object.fromEntries(Object.entries(D.CC_AFTER).map(([r, st]) => [st, +r])),
    world: Object.fromEntries(Object.entries(D.CWC_AFTER).map(([r, st]) => [st, +r])),
    intl: Object.keys(D.INTL_AFTER)
      .map(Number)
      .sort((a, b) => a - b),
  });
  WD.validateCalendar = function (c) {
    const e = [],
      at = 'calendar',
      round = (r) => Number.isInteger(r) && r >= 0 && r <= 21;
    if (!c || typeof c !== 'object') return [`${at}: nothing to read`];
    if (c.preseason != null && !(Number.isInteger(c.preseason) && c.preseason >= 1 && c.preseason <= 6))
      e.push(`${at}: pre-season is one to six days`);
    if (c.cup != null) {
      if (!Array.isArray(c.cup) || !c.cup.length || c.cup.length > 12 || !c.cup.every(round))
        e.push(`${at}: the domestic cup has one to twelve rounds, each after a league round from 0 to 21`);
      else if (new Set(c.cup).size !== c.cup.length)
        e.push(`${at}: two cup rounds cannot follow the same league round`);
    }
    const ordered = (obj, stages, name) => {
      if (!obj || typeof obj !== 'object') return e.push(`${at}: ${name} needs every stage`);
      let last = -1;
      for (const st of stages) {
        if (!round(obj[st])) return e.push(`${at}: ${name} ${st} must follow a league round from 0 to 21`);
        if (obj[st] <= last) return e.push(`${at}: ${name} ${st} comes after the stage before it`);
        last = obj[st];
      }
    };
    if (c.cont != null) ordered(c.cont, WD.CONT_STAGES, 'the continental cups, stage');
    if (c.world != null) ordered(c.world, WD.WORLD_STAGES, 'the Club World Cup, stage');
    if (c.intl != null) {
      if (!Array.isArray(c.intl) || c.intl.length !== 2 || !c.intl.every(round) || c.intl[1] - c.intl[0] < 2)
        e.push(`${at}: two international breaks, at least two league rounds apart`);
    }
    return e;
  };
  // (what a definition's calendar changes, against the game's own)
  const calendarPatch = (cal) => {
    if (!cal || !Object.keys(cal).length || WD.validateCalendar(cal).length) return null;
    const cur = WD.calendarNow(),
      d = {};
    for (const k of ['preseason', 'cup', 'cont', 'world', 'intl'])
      if (cal[k] != null && !same(cal[k], cur[k])) d[k] = JSON.parse(JSON.stringify(cal[k]));
    return Object.keys(d).length ? d : null;
  };

  // ---------- International football ----------
  // The summer tournaments (names, and the World Championship's places for each part of the world), the year of the four in
  // which the World Championship falls, and the invitational tournaments (name and host). The data lives in FM.Intl, so a
  // definition that changes it goes into the patch like a cup format does.
  const I = () => FM.Intl;
  const tournList = () => Object.values(I().TOURNS).flat();
  WD.intlNow = () => ({
    cycle: I().CYCLE,
    tourns: Object.fromEntries(
      tournList().map((tn) => [
        tn.id,
        { name: tn.name, slots: tn.pools.map(([, n]) => n), ...(tn.pools.length ? { qual: tn.qualSize || 4 } : {}) },
      ]),
    ),
    invites: I().INVITES.map((v) => ({ id: v.id, name: v.name, host: v.host })),
  });
  WD.validateIntl = function (x) {
    const e = [];
    if (!x || typeof x !== 'object') return e;
    if (x.cycle != null && !(Number.isInteger(x.cycle) && x.cycle >= 0 && x.cycle <= 3))
      e.push('international: the World Championship year is 0–3 of the four');
    for (const [id, v] of Object.entries(x.tourns || {})) {
      const tn = tournList().find((t) => t.id === id);
      if (!tn) {
        e.push(`international: the game has no tournament "${id}"`);
        continue;
      }
      if (v.name != null && !String(v.name).trim()) e.push(`tournament ${id}: needs a name`);
      if (v.qual != null && (!tn.pools.length || ![2, 3, 4].includes(v.qual)))
        e.push(`tournament ${id}: qualifying groups have two, three or four nations`);
      if (v.slots) {
        if (
          !Array.isArray(v.slots) ||
          v.slots.length !== tn.pools.length ||
          !v.slots.every((n) => Number.isInteger(n) && n >= 0)
        )
          e.push(`tournament ${id}: one number of places for each part of the world`);
        else if (tn.pools.length && v.slots.reduce((a, n) => a + n, 0) !== tn.size)
          e.push(`tournament ${id}: the places add up to ${v.slots.reduce((a, n) => a + n, 0)}, not ${tn.size}`);
      }
    }
    for (const v of x.invites || []) {
      if (!inviteIds().has(v.id)) e.push(`international: the game has no invitational "${v.id}"`);
      if (!String(v.name || '').trim()) e.push(`invitational ${v.id}: needs a name`);
      if (!D.NATIONS[v.host]) e.push(`invitational ${v.id}: unknown host nation "${v.host}"`);
    }
    return e;
  };
  // (the invitationals the game has, remembered the first time they are asked for: a world that does without one still has them
  // in its past seasons)
  const domIds = () => (WD._dom = WD._dom || new Set(D.DOMESTIC_CUPS.map((c) => c[0])));
  domIds();
  const inviteIds = () => new Set(I().INVITE_IDS);
  const applyIntl = (x) => {
    if (x.cycle != null) I().CYCLE = x.cycle;
    for (const [id, v] of Object.entries(x.tourns || {})) {
      const tn = tournList().find((t) => t.id === id);
      if (!tn) continue;
      if (v.name) ((tn.name = v.name), (I().TNAME[id] = v.name));
      if (v.slots) tn.pools.forEach((p, i) => (p[1] = v.slots[i]));
      if (v.qual) tn.qualSize = v.qual;
    }
    if (x.invitesAll) {
      // the ones the world keeps, in the game's order (the others are taken out)
      const keep = new Set(x.invitesAll.map((v) => v.id));
      I().INVITES.splice(0, I().INVITES.length, ...I().INVITES.filter((o) => keep.has(o.id)));
    }
    for (const v of x.invites || []) {
      const o = I().INVITES.find((i) => i.id === v.id);
      if (o) ((o.name = v.name), (o.host = v.host), (I().TNAME[v.id] = v.name));
    }
  };

  // ---------- The static world: leagues and clubs as the game's data has them ----------
  // A world is built from D.LEAGUES and the club rows (js/data.js, js/clubs.js). A database that adds clubs or leagues, or
  // renames them, changes those rows before the world is made, so the club picker, the world generator and everything else
  // that reads them see the database. The change is a PATCH: only what differs, small enough to keep in the save (a world
  // from a database needs it again on every load, and in the simulation worker) and to undo when another world is chosen.
  const codeOf = (id) => String(id).replace(/^c_/, '');
  const staticClubs = () => {
    const by = new Map();
    for (const l of D.LEAGUES) for (const r of D[l.clubs] || []) by.set(r[1], { row: r, league: l });
    return by;
  };
  const infoOf = (code) => D.CLUB_INFO[code] || [];
  const rowToClub = (r, l) => {
    const info = infoOf(r[1]);
    return {
      id: 'c_' + r[1],
      name: r[0],
      short: info[0] || r[1],
      nick: info[1] || '',
      city: r[2],
      nat: l.nat,
      colors: [r[3], r[4]],
      identity: r[5],
      rep: r[6],
      league: l.id,
      parent: r[9] ? 'c_' + r[9] : null,
      founded: info[2] || null,
      crest: info[3] || null,
      stadium: { name: r[7] || `${r[2]} Stadium`, cap: r[8] || Math.round((8000 + (r[6] - 40) * 900) / 500) * 500 },
    };
  };
  // The definition of the game's own data: no world needed (what the in-app importers match their files against)
  WD.fromStatic = function (opts = {}) {
    const def = WD.blank(opts.name || 'Built-in data');
    def.meta.startYear = D.SEASON_START;
    def.meta.base = 'static';
    for (const l of D.LEAGUES) {
      def.leagues.push({
        id: l.id,
        name: l.name,
        short: l.short,
        nat: l.nat,
        tier: l.tier,
        sim: l.sim,
        repBand: l.repBand.slice(),
        rules: JSON.parse(JSON.stringify(l.rules || {})),
      });
      for (const r of D[l.clubs] || []) def.clubs.push(rowToClub(r, l));
    }
    def.intl = WD.intlNow();
    def.calendar = WD.calendarNow();
    def.agents = D.AGENT_FIRMS.slice();
    const have = new Set(def.clubs.map((c) => c.id));
    for (const [a, b, name] of D.RIVALS)
      if (have.has('c_' + a) && have.has('c_' + b)) def.rivals.push(['c_' + a, 'c_' + b, name]);
    return def;
  };

  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  // What a definition changes in the static data: { leagues: [...], clubs: [...], rivals: [...] }, empty when nothing
  // A league's rules as the world plays them: with promotion and relegation switched off for the world (rules.proRel false), no
  // league sends clubs up or down (and so no play-off for a place)
  const effRules = (def, l) => {
    const r = JSON.parse(JSON.stringify(l.rules || {}));
    if (def.rules && def.rules.proRel === false) {
      delete r.promote;
      delete r.relegate;
    }
    return r;
  };
  WD.patchOf = function (def) {
    const patch = {
      leagues: [],
      clubs: [],
      rivals: [],
      removeRivals: [],
      removed: [],
      cups: [],
      newCups: [],
      removeCups: [],
      newConts: [],
      intl: null,
      agents: null,
      calendar: null,
    };
    patch.calendar = calendarPatch(def.calendar);
    patch.removeCups = (def.removeCups || []).filter((id) => D.DOMESTIC_CUPS.some((c) => c[0] === id));
    {
      const names = (def.agents || []).map((a) => String(a || '').trim()).filter(Boolean);
      if (names.length && !same(names, D.AGENT_FIRMS)) patch.agents = names;
    }
    const known = staticClubs();
    const removed = new Set((def.removeClubs || []).map(codeOf).filter((code) => known.has(code)));
    patch.removed = [...removed];
    const leagueIds = new Set(D.LEAGUES.map((l) => l.id));
    for (const l of def.leagues || []) {
      const cur = D.LEAGUES.find((x) => x.id === l.id);
      if (!cur) {
        patch.leagues.push({
          id: l.id,
          nat: l.nat,
          name: l.name,
          short: l.short || l.id,
          tier: l.tier || 1,
          sim: l.sim || 'full',
          repBand: l.repBand ? l.repBand.slice() : [70, 45],
          rules: effRules(def, l),
          isNew: true,
        });
        continue;
      }
      const d = { id: l.id };
      for (const k of ['name', 'short', 'tier', 'sim', 'repBand', 'rules']) {
        const v = k === 'rules' ? effRules(def, l) : l[k];
        if (v != null && !same(v, cur[k] || (k === 'rules' ? {} : undefined))) d[k] = v;
      }
      if (Object.keys(d).length > 1) patch.leagues.push(d);
    }
    const leagueNat = (id) =>
      ((def.leagues || []).find((l) => l.id === id) || D.LEAGUES.find((l) => l.id === id) || {}).nat;
    for (const c of def.clubs || []) {
      const code = codeOf(c.id),
        cur = known.get(code);
      if (removed.has(code)) continue;
      const base = cur ? rowToClub(cur.row, cur.league) : null;
      const m = { ...(base || { city: c.name, identity: 'historic', stadium: {}, colors: [] }), ...c };
      m.stadium = { ...((base && base.stadium) || {}), ...(c.stadium || {}) };
      const lg = c.league || (base && base.league);
      const row = [
        m.name,
        code,
        m.city || m.name,
        (m.colors || [])[0],
        (m.colors || [])[1],
        m.identity || 'historic',
        m.rep,
        m.stadium.name || `${m.city || m.name} Stadium`,
        m.stadium.cap,
      ];
      if (m.parent) row.push(codeOf(m.parent));
      const info = [m.short || code, m.nick || '', m.founded || 0];
      if (m.crest) info.push(m.crest.slice(0, 3));
      if (cur) {
        const pick = (x) => ({
          n: x.name,
          s: x.short,
          k: x.nick || '',
          c: x.city,
          col: x.colors,
          i: x.identity,
          r: x.rep,
          p: x.parent || null,
          f: x.founded || 0,
          cr: x.crest || null,
          sn: x.stadium.name,
          sc: x.stadium.cap,
        });
        const cand = { ...m, short: info[0], city: row[2], identity: row[5], parent: m.parent || null };
        if (same(pick(base), pick(cand)) && cur.league.id === lg) continue;
      }
      if (!cur && !leagueIds.has(lg) && !patch.leagues.some((l) => l.id === lg)) continue; // (validation reports it)
      patch.clubs.push({ code, league: lg, row, info, nat: leagueNat(lg), isNew: !cur });
    }
    // derbies: a pair the game has with another name is renamed, a new pair is added, a pair taken out is removed
    const pair = (x, y) => (r) => (r[0] === x && r[1] === y) || (r[0] === y && r[1] === x);
    for (const [a, b, name] of def.rivals || []) {
      const x = codeOf(a),
        y = codeOf(b),
        cur = D.RIVALS.find(pair(x, y));
      if (!cur || cur[2] !== (name || 'Derby')) patch.rivals.push([x, y, name || 'Derby']);
    }
    for (const [a, b] of def.removeRivals || []) {
      const x = codeOf(a),
        y = codeOf(b);
      if (D.RIVALS.some(pair(x, y)) && !(def.rivals || []).some((r) => pair(x, y)([codeOf(r[0]), codeOf(r[1])])))
        patch.removeRivals.push([x, y]);
    }
    for (const c of def.competitions || []) {
      if (c.isNew && c.kind === 'cont') {
        const f = c.format || {};
        if (!WD.validateFormat(c.id, f, def).length)
          patch.newConts.push({
            id: c.id,
            region: c.region,
            name: c.name,
            short: c.short || c.id,
            tier: c.tier || 1,
            prize: f.prize || 3e6,
            ...(f.legs ? { legs: { ...f.legs } } : {}),
            ...(f.central ? { central: true } : {}),
            ...(f.groupSize ? { groupSize: f.groupSize } : {}),
            ...(f.feeders && (c.tier || 1) > 1 ? { feeders: { ...f.feeders } } : {}),
            ...(f.play ? { play: JSON.parse(JSON.stringify(f.play)) } : {}),
          });
        continue;
      }
      if (c.isNew) {
        if (!WD.validateFormat(c.id, c.format || {}, def).length)
          patch.newCups.push({
            id: c.id,
            nat: c.nat,
            name: c.name,
            short: c.short || c.id,
            opts: JSON.parse(JSON.stringify(c.format || { legs: [], neutral: [2] })),
          });
        continue;
      }
      if (!c.format || !WD.cupKind(c.id)) continue;
      if (!WD.validateFormat(c.id, c.format).length && !same(c.format, cupNow(c.id)))
        patch.cups.push({ id: c.id, kind: WD.cupKind(c.id), format: JSON.parse(JSON.stringify(c.format)) });
    }
    if (
      def.intl &&
      Object.keys(def.intl).length &&
      !WD.validateIntl(def.intl).length &&
      !same(def.intl, WD.intlNow())
    ) {
      // (only what differs from the game's own)
      const cur = WD.intlNow(),
        d = { tourns: {}, invites: [] };
      if (def.intl.cycle != null && def.intl.cycle !== cur.cycle) d.cycle = def.intl.cycle;
      for (const [id, v] of Object.entries(def.intl.tourns || {})) if (!same(v, cur.tourns[id])) d.tourns[id] = v;
      for (const v of def.intl.invites || []) if (!cur.invites.some((o) => same(o, v))) d.invites.push(v);
      const keptIds = (def.intl.invites || []).map((v) => v.id);
      if (def.intl.invites && keptIds.length < cur.invites.length)
        d.invitesAll = def.intl.invites.map((v) => ({ id: v.id }));
      if (d.cycle != null || Object.keys(d.tourns).length || d.invites.length || d.invitesAll) patch.intl = d;
    }
    return patch;
  };
  // Stage a definition: the static data becomes the game's own plus what it changes (the club picker then shows it)
  WD.stage = function (def) {
    WD.useStatic(null);
    const patch = WD.patchOf(def);
    WD.useStatic(patch);
    return patch;
  };
  WD.patchIsEmpty = (p) =>
    !p ||
    !(
      p.leagues.length ||
      p.clubs.length ||
      p.rivals.length ||
      (p.removed || []).length ||
      (p.removeRivals || []).length ||
      (p.cups || []).length ||
      (p.newCups || []).length ||
      (p.newConts || []).length ||
      (p.removeCups || []).length ||
      p.agents ||
      p.intl ||
      p.calendar
    );

  // Put a patch into the static data; returns what undoes it
  function applyPatch(patch) {
    const keys = D.LEAGUES.map((l) => l.clubs);
    const snap = {
      leagues: D.LEAGUES.map((l) => ({
        o: l,
        c: { ...l, repBand: l.repBand.slice() },
        rules: JSON.parse(JSON.stringify(l.rules || {})),
      })),
      rows: keys.map((k) => ({ k, rows: D[k].map((r) => r.slice()) })),
      info: { ...D.CLUB_INFO },
      rivals: D.RIVALS.map((r) => r.slice()),
      mix: new Set(Object.keys(D.NAT_MIX)),
      cupRows: D.DOMESTIC_CUPS.map((c) => [c[0], c[1], c[2], c[3], JSON.stringify(c[4] || {})]),
      agents: D.AGENT_FIRMS.slice(),
      euro: (D.EURO_CUPS || []).map((c) => JSON.stringify(c.opts || {})),
      conts: D.CONTINENTALS.map((c) => ({
        legs: c.legs && JSON.stringify(c.legs),
        central: c.central,
        prize: c.prize,
        groupSize: c.groupSize,
        play: c.play && JSON.stringify(c.play),
        feeders: c.feeders && JSON.stringify(c.feeders),
      })),
      calendar: JSON.stringify({
        pre: D.PRESEASON_DAYS,
        cup: D.CUP_AFTER,
        cc: D.CC_AFTER,
        cwc: D.CWC_AFTER,
        intl: D.INTL_AFTER,
      }),
      euroPrize: (D.EURO_CUPS || []).map((c) => c.prize),
      intl: JSON.stringify({ t: I().TOURNS, n: I().TNAME, v: I().INVITES, c: I().CYCLE }),
    };
    for (const l of patch.leagues) {
      let cur = D.LEAGUES.find((x) => x.id === l.id);
      if (!cur) {
        cur = { id: l.id, nat: l.nat, clubs: 'CLUBS_' + l.id };
        D.LEAGUES.push(cur);
        D[cur.clubs] = [];
        const twin = D.LEAGUES.find((x) => x !== cur && x.nat === l.nat && D.NAT_MIX[x.id]);
        if (twin && !D.NAT_MIX[l.id]) D.NAT_MIX[l.id] = { ...D.NAT_MIX[twin.id] };
      }
      for (const k of ['name', 'short', 'tier', 'sim', 'repBand', 'rules', 'nat'])
        if (l[k] != null) cur[k] = JSON.parse(JSON.stringify(l[k]));
    }
    const by = staticClubs();
    for (const code of patch.removed || []) {
      const where = by.get(code);
      if (!where) continue;
      D[where.league.clubs].splice(D[where.league.clubs].indexOf(where.row), 1);
      by.delete(code);
    }
    for (const c of patch.clubs) {
      const where = by.get(c.code);
      const target = D.LEAGUES.find((l) => l.id === c.league);
      if (!target) continue;
      if (where && where.league !== target) {
        where.row.splice(0, where.row.length); // moved: leaves its old league's list
        D[where.league.clubs].splice(D[where.league.clubs].indexOf(where.row), 1);
      }
      if (where && where.league === target) where.row.splice(0, where.row.length, ...c.row);
      else {
        const row = c.row.slice();
        D[target.clubs].push(row);
        by.set(c.code, { row, league: target });
      }
      D.CLUB_INFO[c.code] = c.info.slice();
    }
    for (const [x, y] of patch.removeRivals || []) {
      const i = D.RIVALS.findIndex((r) => (r[0] === x && r[1] === y) || (r[0] === y && r[1] === x));
      if (i >= 0) D.RIVALS.splice(i, 1);
    }
    for (const r of patch.rivals) {
      const cur = D.RIVALS.find((o) => (o[0] === r[0] && o[1] === r[1]) || (o[0] === r[1] && o[1] === r[0]));
      if (cur) cur[2] = r[2];
      else D.RIVALS.push(r.slice());
    }
    if (patch.intl) applyIntl(patch.intl);
    if (patch.calendar) {
      const c = patch.calendar,
        swap = (obj, map) => {
          for (const k of Object.keys(obj)) delete obj[k];
          Object.assign(obj, map);
        };
      if (c.preseason) D.PRESEASON_DAYS = c.preseason;
      if (c.cup) swap(D.CUP_AFTER, Object.fromEntries(c.cup.map((r) => [r, 'DC'])));
      if (c.cont) swap(D.CC_AFTER, Object.fromEntries(Object.entries(c.cont).map(([st, r]) => [r, st])));
      if (c.world) swap(D.CWC_AFTER, Object.fromEntries(Object.entries(c.world).map(([st, r]) => [r, st])));
      if (c.intl) swap(D.INTL_AFTER, { [c.intl[0]]: ['I1a', 'I1b'], [c.intl[1]]: ['I2a', 'I2b'] });
    }
    if (patch.agents) D.AGENT_FIRMS.splice(0, D.AGENT_FIRMS.length, ...patch.agents);
    for (const id of patch.removeCups || []) {
      const i = D.DOMESTIC_CUPS.findIndex((x) => x[0] === id);
      if (i >= 0) D.DOMESTIC_CUPS.splice(i, 1);
    }
    for (const c of patch.newCups || [])
      if (!D.DOMESTIC_CUPS.some((x) => x[0] === c.id))
        D.DOMESTIC_CUPS.push([c.id, c.nat, c.name, c.short, JSON.parse(JSON.stringify(c.opts))]);
    for (const c of patch.newConts || [])
      if (!D.CONTINENTALS.some((x) => x.id === c.id)) D.CONTINENTALS.push(JSON.parse(JSON.stringify(c)));
    for (const c of patch.cups || []) {
      if (c.kind === 'cont') {
        const d = D.CONTINENTALS.find((x) => x.id === c.id);
        if (d) ((d.legs = { ...c.format.legs }), (d.central = !!c.format.central));
        if (d && c.format.prize != null) d.prize = c.format.prize;
        if (d && c.format.groupSize) d.groupSize = c.format.groupSize;
        if (d) {
          if (c.format.play) d.play = JSON.parse(JSON.stringify(c.format.play));
          else delete d.play;
          if (c.format.feeders && d.feeders) d.feeders = { ...c.format.feeders };
        }
      } else if (euroDef(c.id)) {
        euroDef(c.id).opts = JSON.parse(JSON.stringify(c.format));
        if (c.format.prize != null) euroDef(c.id).prize = c.format.prize;
      } else {
        const row = D.DOMESTIC_CUPS.find((x) => x[0] === c.id);
        if (row) row[4] = JSON.parse(JSON.stringify(c.format));
      }
    }
    return function undo() {
      D.LEAGUES.length = 0;
      for (const s of snap.leagues) {
        for (const k of Object.keys(s.o)) delete s.o[k];
        Object.assign(s.o, s.c, { rules: s.rules });
        D.LEAGUES.push(s.o);
      }
      for (const { k, rows } of snap.rows) D[k].splice(0, D[k].length, ...rows);
      for (const k of Object.keys(D))
        if (/^CLUBS_/.test(k) && !snap.rows.some((x) => x.k === k) && k !== 'CLUBS_OVERSEAS') delete D[k];
      for (const k of Object.keys(D.CLUB_INFO)) if (!(k in snap.info)) delete D.CLUB_INFO[k];
      Object.assign(D.CLUB_INFO, snap.info);
      D.RIVALS.splice(0, D.RIVALS.length, ...snap.rivals.map((r) => r.slice()));
      {
        const o = JSON.parse(snap.intl);
        for (const [key, val] of [
          ['TOURNS', o.t],
          ['TNAME', o.n],
          ['INVITES', o.v],
        ]) {
          const target = I()[key];
          if (Array.isArray(target)) target.splice(0, target.length, ...val);
          else {
            for (const k of Object.keys(target)) delete target[k];
            Object.assign(target, val);
          }
        }
        I().CYCLE = o.c;
      }
      D.AGENT_FIRMS.splice(0, D.AGENT_FIRMS.length, ...snap.agents);
      D.DOMESTIC_CUPS.splice(
        0,
        D.DOMESTIC_CUPS.length,
        ...snap.cupRows.map((c) => [c[0], c[1], c[2], c[3], JSON.parse(c[4])]),
      );
      (D.EURO_CUPS || []).forEach((c, i) => ((c.opts = JSON.parse(snap.euro[i])), (c.prize = snap.euroPrize[i])));
      D.CONTINENTALS.length = snap.conts.length; // (a continental cup the definition made goes again)
      D.CONTINENTALS.forEach((c, i) => {
        const s = snap.conts[i];
        if (s.legs) c.legs = JSON.parse(s.legs);
        else delete c.legs;
        if (s.central === undefined) delete c.central;
        else c.central = s.central;
        c.prize = s.prize;
        if (s.groupSize === undefined) delete c.groupSize;
        else c.groupSize = s.groupSize;
        if (s.play) c.play = JSON.parse(s.play);
        else delete c.play;
        if (s.feeders) c.feeders = JSON.parse(s.feeders);
      });
      {
        const o = JSON.parse(snap.calendar);
        D.PRESEASON_DAYS = o.pre;
        for (const [obj, val] of [
          [D.CUP_AFTER, o.cup],
          [D.CC_AFTER, o.cc],
          [D.CWC_AFTER, o.cwc],
          [D.INTL_AFTER, o.intl],
        ]) {
          for (const k of Object.keys(obj)) delete obj[k];
          Object.assign(obj, val);
        }
      }
      for (const k of Object.keys(D.NAT_MIX)) if (!snap.mix.has(k)) delete D.NAT_MIX[k];
    };
  }
  // The static data now: the built-in data plus this patch (null: the built-in data alone). Whatever was patched before is undone first.
  WD._undo = null;
  WD._key = '';
  WD.useStatic = function (patch) {
    const key = WD.patchIsEmpty(patch) ? '' : JSON.stringify(patch);
    if (key === WD._key) return; // already so (the simulation worker asks before every day)
    if (WD._undo) WD._undo();
    WD._undo = null;
    WD._key = key;
    if (key) WD._undo = applyPatch(patch);
    if (FM.Guide && FM.Guide.reset) FM.Guide.reset();
  };

  // ---------- League formats ----------
  // How a league is played: once each or home and away (rules.legs), how clubs level on points are split (rules.tiebreak), its
  // simulation tier, and with the league above it the places that go up and down, the play-off for one more place (four clubs,
  // the final over one match or two), or the relegation play-off against the club just above the drop.
  WD.TIEBREAKS = [
    [['gd', 'gf'], 'Goal difference, then goals scored'],
    [['h2h', 'gd', 'gf'], 'Head-to-head, then goal difference'],
    [['gd', 'gf', 'h2h'], 'Goal difference, goals scored, then head-to-head'],
    [['wins', 'gd', 'gf'], 'Most wins, then goal difference'],
    [['gf', 'gd'], 'Goals scored, then goal difference'],
  ];
  // A continental cup of the definition's own: a tier (1 the champions cup of its part of the world, 2 and 3 the cups below it, 4 a
  // regional cup), a part of the world, and where its clubs come from: a tier 1 cup takes the places the leagues send to it
  // (their qualify rule), a lower tier the places named in its feeders (league: how many, after the cups above have theirs)
  WD.TIER_NAMES = { 1: 'Champions Cup', 2: 'Shield', 3: 'Trophy', 4: 'Regional cup' };
  WD.validateNewCont = function (c, def) {
    const at = `competition ${c.id}`,
      e = [];
    if (!/^CN[A-Z0-9]{1,3}$/.test(c.id))
      e.push(`${at}: a new continental cup's id is CN and one to three letters or digits`);
    // (the cup may be staged in the game's data already: the same cup is not a clash)
    if (D.CONTINENTALS.some((x) => x.id === c.id && !(x.name === c.name && x.region === c.region)))
      e.push(`${at}: the game already has a competition with that id`);
    if ((def.competitions || []).some((x) => x !== c && x.id === c.id)) e.push(`${at}: two competitions share an id`);
    if (!String(c.name || '').trim()) e.push(`${at}: needs a name`);
    if (!WD.REGIONS.includes(c.region)) e.push(`${at}: a part of the world: ${WD.REGIONS.join(', ')}`);
    if (!(Number.isInteger(c.tier) && c.tier >= 1 && c.tier <= 4)) e.push(`${at}: the tier is 1 to 4`);
    const shorts = [
      ...D.CONTINENTALS.filter((x) => x.id !== c.id).map((x) => x.short),
      ...(def.competitions || []).filter((x) => x !== c).map((x) => x.short),
    ];
    if (c.short && shorts.includes(c.short)) e.push(`${at}: the short name ${c.short} is taken`);
    const f = c.format || {};
    let n = 0;
    if ((c.tier || 1) === 1)
      n = def.leagues.reduce(
        (t, l) => t + (l.rules && l.rules.qualify && l.rules.qualify.to === c.id ? l.rules.qualify.n : 0),
        0,
      );
    else n = Object.values(f.feeders || {}).reduce((t, x) => t + x, 0);
    if (n < 8)
      e.push(
        `${at}: needs at least eight clubs (${(c.tier || 1) === 1 ? 'the leagues send it' : 'its feeders give it'} ${n})`,
      );
    return e;
  };

  // Fixtures fixed by hand (rules.pins: [{ round, h, a }], round from 1): a league that plays a plain round-robin can have a
  // match put on a given matchday, home side first. The rest of the schedule is the game's own, with the clubs swapped around
  // until the pinned matches fall where they were put (FM.W.pinRounds); a set of pins that no schedule can honour is refused.
  WD.pinLimit = function (l, n) {
    const r = l.rules || {},
      per = n % 2 ? n : n - 1,
      full = per * (r.legs === 1 ? 1 : 2);
    return Math.min(r.split ? r.split.after : r.rounds || full, full);
  };
  WD.validatePins = function (l, def) {
    const r = l.rules || {},
      at = `league ${l.id}`,
      pins = r.pins;
    if (!Array.isArray(pins)) return [`${at}: fixed fixtures are a list`];
    if (r.zones || r.conferences || r.torneos)
      return [`${at}: fixtures cannot be fixed in a league with zones, conferences or two tournaments`];
    const ids = def.clubs.filter((c) => c.league === l.id).map((c) => c.id),
      nm = (id) => (def.clubs.find((c) => c.id === id) || { name: id }).name,
      e = [],
      limit = WD.pinLimit(l, ids.length),
      seen = new Set(),
      busy = new Set();
    for (const p of pins) {
      const tag = `${at}, ${p ? nm(p.h) : '?'} v ${p ? nm(p.a) : '?'}`;
      if (!p || !Number.isInteger(p.round) || p.round < 1 || p.round > limit) {
        e.push(`${tag}: the matchday is 1 to ${limit}`);
        continue;
      }
      if (!ids.includes(p.h) || !ids.includes(p.a) || p.h === p.a) {
        e.push(`${tag}: two different clubs of the league`);
        continue;
      }
      if (seen.has(p.h + '>' + p.a)) e.push(`${tag}: fixed twice`);
      seen.add(p.h + '>' + p.a);
      for (const id of [p.h, p.a]) {
        if (busy.has(p.round + id))
          e.push(`${tag}: a club plays once a matchday (${nm(id)} is fixed twice on matchday ${p.round})`);
        busy.add(p.round + id);
      }
    }
    if (!e.length && pins.length && ids.length >= 2 && FM.W) {
      let ok = false;
      for (let i = 0; i < 6 && !ok; i++)
        ok = !!FM.W.pinRounds(
          FM.W.roundRobin(ids),
          pins.map((p) => ({ round: p.round - 1, h: p.h, a: p.a })),
        );
      if (!ok) e.push(`${at}: no schedule can put those matches on those matchdays together`);
    }
    return e;
  };
  WD.validateLeagueRules = function (l, def) {
    const e = [],
      r = l.rules || {},
      at = `league ${l.id}`;
    if (r.legs != null && ![1, 2].includes(r.legs)) e.push(`${at}: matches are played once each or home and away`);
    if (r.tiebreak != null) {
      if (
        !Array.isArray(r.tiebreak) ||
        !r.tiebreak.length ||
        !r.tiebreak.every((k) => ['h2h', 'wins', 'gd', 'gf'].includes(k))
      )
        e.push(`${at}: the tie-breakers are some of head-to-head, wins, goal difference and goals scored`);
    }
    if (r.split) {
      const s = r.split,
        n = def.clubs.filter((c) => c.league === l.id).length;
      if (r.zones || r.conferences || r.torneos || r.rounds || r.legs)
        e.push(`${at}: a split league cannot also be in zones or conferences, play two tournaments, or play once each`);
      const g = s.groups;
      if (!Array.isArray(g) || g.length < 2 || g.length > 4 || !g.every((x) => Number.isInteger(x) && x >= 2))
        e.push(`${at}: a split makes two to four groups of at least two clubs`);
      else {
        if (n && g.reduce((a, b) => a + b, 0) !== n)
          e.push(`${at}: the groups add up to ${g.reduce((a, b) => a + b, 0)} clubs but the league has ${n}`);
        if (
          !Array.isArray(s.rounds) ||
          s.rounds.length !== g.length ||
          !s.rounds.every((x) => ['none', 'single', 'double'].includes(x))
        )
          e.push(`${at}: each group plays no more games, once each or home and away`);
        if (!Array.isArray(s.names) || s.names.length !== g.length || !s.names.every((x) => String(x || '').trim()))
          e.push(`${at}: each group needs a name`);
      }
      if (!Number.isInteger(s.after) || s.after < 1 || (n && (s.after < n - 1 || s.after > 3 * (n - 1))))
        e.push(`${at}: the table splits after ${n ? `${n - 1} to ${3 * (n - 1)}` : 'a number of'} rounds`);
    }
    if (r.play != null) e.push(...WD.validatePlay(r.play, at));
    {
      const n = def.clubs.filter((c) => c.league === l.id).length;
      if (r.zones) {
        if (r.conferences || r.split) e.push(`${at}: zones cannot go with conferences or a split`);
        if (!r.torneos || (r.playoffs || {}).type !== 'zones')
          e.push(`${at}: zones play two tournaments and finish with the zones' play-off`);
        if (n && n < 16) e.push(`${at}: two zones need at least sixteen clubs (eight a zone for the play-off)`);
      }
      if (r.conferences) {
        const names = Object.keys(r.conferences);
        if (names.length !== 2 || !names.every((x) => String(x).trim()))
          e.push(`${at}: two conferences, each with a name`);
        const ids = def.clubs.filter((c) => c.league === l.id).map((c) => String(c.id).replace(/^c_/, ''));
        // (a club taken out of the league just drops out of its conference)
        const all = Object.values(r.conferences)
          .flat()
          .filter((c) => ids.includes(c));
        if (new Set(Object.values(r.conferences).flat()).size !== Object.values(r.conferences).flat().length)
          e.push(`${at}: a club is in both conferences`);
        for (const [nm, list] of Object.entries(r.conferences)) {
          const size = list.filter((c) => ids.includes(c)).length + (ids.length - all.length) / 2;
          if (size < 7) e.push(`${at}: the ${nm} conference needs at least seven clubs for the play-off`);
        }
        if (!r.mls || r.mls.playoff !== 7) e.push(`${at}: conferences play seven clubs a conference in the play-off`);
        if (
          r.mls &&
          r.mls.draftRounds != null &&
          !(Number.isInteger(r.mls.draftRounds) && r.mls.draftRounds >= 0 && r.mls.draftRounds <= 5)
        )
          e.push(`${at}: the draft is 0 to 5 rounds`);
        if (r.zones || r.torneos || r.split)
          e.push(`${at}: conferences keep one table and cannot split or play two tournaments`);
      }
    }
    {
      const n = def.clubs.filter((c) => c.league === l.id).length;
      if (
        r.rounds != null &&
        !(Number.isInteger(r.rounds) && r.rounds >= 1 && (!n || r.rounds <= 4 * Math.max(1, n - 1)))
      )
        e.push(`${at}: the season is one round up to four times round-robin`);
      if (r.playoffs != null) {
        if (
          !['finals6', 'liguilla'].includes((r.playoffs || {}).type) &&
          !(r.zones && (r.playoffs || {}).type === 'zones') &&
          !(D.LEAGUES.find((x) => x.id === l.id) || { rules: {} }).rules.playoffs
        )
          e.push(`${at}: a title play-off is a finals series (the top six) or a liguilla (the top ten)`);
        else if (n && r.playoffs.type === 'finals6' && n < 6) e.push(`${at}: a finals series needs at least six clubs`);
        else if (n && r.playoffs.type === 'liguilla' && n < 10) e.push(`${at}: a liguilla needs at least ten clubs`);
      }
      if (
        r.torneos != null &&
        !(r.torneos === false) &&
        !(Array.isArray(r.torneos) && r.torneos.length === 2 && r.torneos.every((x) => String(x || '').trim()))
      )
        e.push(`${at}: two tournaments a year, each with a name`);
      if (r.torneos && !r.playoffs) e.push(`${at}: two tournaments a year need a title play-off to finish each`);
    }
    if (r.squad != null) {
      if (typeof r.squad !== 'object' || Array.isArray(r.squad)) e.push(`${at}: squad rules are a list of settings`);
      else
        for (const [k, v] of Object.entries(r.squad)) {
          const num = (hi) => v == null || (Number.isInteger(v) && v >= 0 && v <= hi);
          if (['foreign', 'matchday', 'nonEU', 'nonEUSign', 'asian', 'asean'].includes(k)) {
            if (!num(30)) e.push(`${at}: ${k} is a number of players from 0 (no limit) to 30`);
          } else if (k === 'listSize') {
            if (!num(40)) e.push(`${at}: the squad list is 0 (none) to 40 players`);
          } else if (k === 'homegrown') {
            if (!num(25) || (r.squad.listSize && v > r.squad.listSize))
              e.push(`${at}: homegrown places are 0 to the size of the squad list`);
          } else if (['permit', 'quasi'].includes(k)) {
            if (v != null && typeof v !== 'boolean') e.push(`${at}: ${k} is on or off`);
          } else if (k === 'exempt') {
            if (!Array.isArray(v) || !v.every((n) => D.NATIONS[n]))
              e.push(`${at}: exempt nations are nations the game has`);
          } else if (k === 'mls') {
            if (
              v &&
              !(typeof v === 'object' && ['cap', 'maxCharge', 'dp', 'roster', 'counted'].every((x) => v[x] >= 0))
            )
              e.push(`${at}: a salary budget needs cap, maxCharge, dp, roster and counted`);
          } else e.push(`${at}: no squad rule called "${k}"`);
        }
    }
    if (r.pins != null) e.push(...WD.validatePins(l, def));
    const p = r.promote;
    if (p) {
      if (p.playoff != null) {
        if (!(Array.isArray(p.playoff) && p.playoff[0] === p.auto + 1 && p.playoff[1] === p.auto + 4))
          e.push(`${at}: the play-off is the four clubs just below the places that go up automatically`);
        if (p.tie) e.push(`${at}: a promotion play-off and a relegation play-off cannot share a pair`);
      }
      if (p.finalLegs != null && ![1, 2].includes(p.finalLegs))
        e.push(`${at}: the play-off final is one match or two legs`);
      const n = def.clubs.filter((c) => c.league === l.id).length;
      if (p.playoff && n && n < p.auto + 4)
        e.push(`${at}: a league needs ${p.auto + 4} clubs for ${p.auto} places and a play-off`);
    }
    if (r.relegate && r.relegate.playoff) {
      const lower = def.leagues.find((x) => x.rules && x.rules.promote && x.rules.promote.to === l.id);
      if (!lower || !lower.rules.promote.tie)
        e.push(`${at}: a relegation play-off needs the league below to hold its play-off place`);
    }
    return e;
  };

  // ---------- Validation ----------
  const isInt = (v) => Number.isInteger(v);
  // The crest designs the game draws (shapes, patterns, emblems: see C.crest in js/ui-core.js) and a club's facilities
  WD.CREST = { shapes: 4, patterns: 11, emblems: 15 };
  WD.FACILITIES = ['training', 'academy', 'medical', 'analytics', 'stadium', 'fanzone', 'museum'];
  WD.validateClub = function (c, ctx = {}) {
    const e = [],
      w = [];
    const at = `club ${c.id || '?'}`;
    if (!c.id || typeof c.id !== 'string') e.push(`${at}: no id`);
    if (!c.name || !String(c.name).trim()) e.push(`${at}: no name`);
    if (!c.short || String(c.short).length > 5) w.push(`${at}: the short name should be 1–5 characters`);
    if (!Array.isArray(c.colors) || c.colors.length < 2 || !c.colors.every((x) => HEX.test(x)))
      e.push(`${at}: colours must be two #rrggbb values`);
    if (!(c.rep >= 20 && c.rep <= 99)) e.push(`${at}: rep must be between 20 and 99`);
    if (!c.stadium || !(c.stadium.cap >= 1000)) e.push(`${at}: stadium needs a name and a capacity of at least 1000`);
    if (c.identity && D.IDENTITY && !D.IDENTITY[c.identity]) e.push(`${at}: unknown identity "${c.identity}"`);
    if (c.nat && !D.NATIONS[c.nat]) e.push(`${at}: unknown nation "${c.nat}"`);
    if (c.crest != null) {
      const n = [WD.CREST.shapes, WD.CREST.patterns, WD.CREST.emblems];
      if (!(
        Array.isArray(c.crest) &&
        c.crest.length === 3 &&
        c.crest.every((v, i) => Number.isInteger(v) && v >= -1 && v < n[i])
      ))
        e.push(`${at}: a crest is a shape, a pattern and an emblem (-1: the automatic one)`);
    }
    if (c.kit) {
      for (const k of ['home', 'away'])
        if (c.kit[k] != null && !HEX.test(c.kit[k])) e.push(`${at}: the ${k} shirt must be a #rrggbb colour`);
    }
    if (c.finance) {
      const f = c.finance;
      if (f.balance != null && !(f.balance >= -1e8 && f.balance <= 5e9))
        e.push(`${at}: the cash in the bank is between -100 million and 5 billion`);
      if (f.budget != null && !(f.budget >= 0 && f.budget <= 2e9))
        e.push(`${at}: the transfer budget is between 0 and 2 billion`);
    }
    if (c.facilities)
      for (const [k, v] of Object.entries(c.facilities))
        if (!WD.FACILITIES.includes(k) || !(Number.isInteger(v) && v >= 1 && v <= 5))
          e.push(`${at}: facility "${k}" is a level from 1 to 5`);
    if (c.attr) {
      for (const k of ['market', 'support', 'catchment'])
        if (c.attr[k] != null && !(c.attr[k] >= 1 && c.attr[k] <= 10)) e.push(`${at}: ${k} is from 1 to 10`);
      if (c.attr.own != null && !['private', 'sovereign', 'fans', 'investors'].includes(c.attr.own))
        e.push(`${at}: unknown owner "${c.attr.own}"`);
    }
    if (ctx.leagues && c.league && !ctx.leagues.has(c.league))
      e.push(`${at}: league "${c.league}" is not in the definition`);
    return { errors: e, warnings: w };
  };
  WD.validatePlayer = function (p, ctx = {}) {
    const e = [],
      w = [];
    const at = `player ${p.id || (p.fn || '') + ' ' + (p.ln || '')}`;
    if (!(p.fn || '').trim() && !(p.ln || '').trim()) e.push(`${at}: needs a name`); // (one name is enough: some players go by one)
    if (!D.NATIONS[p.nat]) e.push(`${at}: unknown nation "${p.nat}"`);
    if (!D.POS.includes(p.pos)) e.push(`${at}: unknown position "${p.pos}"`);
    if (!isInt(p.born) || (ctx.year && (ctx.year - p.born < 15 || ctx.year - p.born > 45)))
      e.push(`${at}: born ${p.born} gives an age outside 15–45`);
    if (p.foot && !FEET.includes(p.foot)) e.push(`${at}: foot must be Left, Right or Both`);
    if (p.callup != null && typeof p.callup !== 'boolean') e.push(`${at}: callup is true or false`);
    const a = p.attrs || {};
    for (const k of D.ATTRS)
      if (!(a[k] >= 1 && a[k] <= 20)) e.push(`${at}: attribute ${k} must be 1–20 (it is ${a[k]})`);
    if (D.ATTRS.every((k) => a[k] >= 1 && a[k] <= 20) && D.POS.includes(p.pos)) {
      const ca = W.calcCA({ attrs: a }, p.pos);
      if (p.pa != null && (p.pa < ca || p.pa > 96))
        e.push(`${at}: potential ${p.pa} must be between his ability (${ca}) and 96`);
    }
    if (p.club && ctx.clubs && !ctx.clubs.has(p.club)) e.push(`${at}: club "${p.club}" is not in the definition`);
    if (p.contract != null && ctx.year && p.contract < ctx.year) w.push(`${at}: contract ends before the start year`);
    return { errors: e, warnings: w };
  };
  WD.validate = function (def, S = FM.S) {
    const errors = [],
      warnings = [];
    const push = (r) => {
      errors.push(...r.errors);
      warnings.push(...r.warnings);
    };
    if (!def || def.format !== WD.FORMAT) return { errors: [`Not a ${WD.FORMAT} file`], warnings };
    if (def.version > WD.VERSION)
      return {
        errors: [`Made by a newer version of the game (format ${def.version}, this one reads ${WD.VERSION})`],
        warnings,
      };
    for (const k of ['meta', 'rules', 'leagues', 'clubs', 'players', 'managers', 'competitions', 'history'])
      if (def[k] == null) errors.push(`Missing section "${k}"`);
    if (errors.length) return { errors, warnings };
    if (!['overlay', 'replace'].includes(def.meta.players))
      errors.push(`meta.players "${def.meta.players}": must be "overlay" (add to the world's players) or "replace"`);
    const year = def.meta.startYear || (S && S.year) || D.SEASON_START;
    // what the game's data already has: a definition can leave out what it does not change (and refer to it)
    const staticLeagues = new Set(D.LEAGUES.map((l) => l.id)),
      staticClubIds = new Set([...staticClubs().keys()].map((c) => 'c_' + c));
    const seen = (list, what, key = 'id') => {
      const ids = new Set();
      for (const x of list) {
        if (ids.has(x[key])) errors.push(`Two ${what} with id ${x[key]}`);
        ids.add(x[key]);
      }
      return ids;
    };
    const defLeagues = seen(def.leagues, 'leagues');
    const leagues = new Set([...defLeagues, ...staticLeagues]);
    const perLeague = {};
    for (const c of def.clubs) perLeague[c.league] = (perLeague[c.league] || 0) + 1;
    for (const l of def.leagues) {
      if (!staticLeagues.has(l.id)) {
        // a league the game does not have: it needs everything the built-in ones have
        if (!/^[A-Za-z0-9]{2,6}$/.test(l.id)) errors.push(`league ${l.id}: a new league's id is 2–6 letters or digits`);
        if (!D.NATIONS[l.nat])
          errors.push(`league ${l.id}: a new league needs a nation the game has (${l.nat || 'none given'})`);
        if (!(l.tier >= 1)) errors.push(`league ${l.id}: a new league needs a tier`);
        if (!l.repBand) errors.push(`league ${l.id}: a new league needs a repBand [high, low]`);
        if ((perLeague[l.id] || 0) < 6)
          errors.push(`league ${l.id}: a new league needs at least 6 clubs (it has ${perLeague[l.id] || 0})`);
        const r = l.rules || {};
        for (const k of ['promote', 'relegate'])
          if (r[k] && !leagues.has(r[k].to))
            errors.push(`league ${l.id}: ${k} goes to "${r[k].to}", which is not a league`);
        if (
          r.qualify &&
          !D.CONTINENTALS.some((c) => c.id === r.qualify.to) &&
          !(def.competitions || []).some((c) => c.isNew && c.kind === 'cont' && c.id === r.qualify.to)
        )
          errors.push(`league ${l.id}: qualify goes to "${r.qualify.to}", which is not a continental competition`);
      }
      if (!l.name) errors.push(`league ${l.id}: no name`);
      if (l.sim && !SIMS.includes(l.sim)) errors.push(`league ${l.id}: sim must be full, light or minimal`);
      if (l.tier != null && !(isInt(l.tier) && l.tier >= 1 && l.tier <= 6))
        errors.push(`league ${l.id}: tier must be 1–6`);
      if (l.repBand && !(Array.isArray(l.repBand) && l.repBand[0] >= l.repBand[1]))
        errors.push(`league ${l.id}: repBand must be [high, low]`);
    }
    // clubs of the game's own the definition takes out: nothing may still refer to them, and a league keeps enough clubs
    const removed = new Set((def.removeClubs || []).filter((id) => staticClubIds.has(id)));
    for (const id of removed) staticClubIds.delete(id);
    for (const l of D.LEAGUES) {
      const gone = (D[l.clubs] || []).filter((r) => removed.has('c_' + r[1])).length;
      if (!gone) continue;
      const left =
        D[l.clubs].length -
        gone +
        def.clubs.filter((c) => c.league === l.id && !staticClubIds.has(c.id) && !removed.has(c.id)).length;
      if (left < 8) errors.push(`league ${l.id}: ${left} clubs would be left; a league needs at least 8`);
    }
    for (const c of def.clubs)
      if (c.parent && removed.has(c.parent)) errors.push(`club ${c.id}: its parent ${c.parent} is removed`);
    for (const id of removed) {
      const row = staticClubs().get(String(id).replace(/^c_/, ''));
      if (row)
        for (const r of D[row.league.clubs])
          if (r[9] && 'c_' + r[9] === id && !removed.has('c_' + r[1]))
            errors.push(`club ${id} is removed but ${r[0]} is its B team`);
    }
    const defClubs = seen(def.clubs, 'clubs');
    const clubs = new Set([...defClubs, ...staticClubIds]);
    const names = new Set();
    for (const c of def.clubs) {
      push(WD.validateClub(c, { leagues }));
      if (!staticClubIds.has(c.id) && !/^c_[A-Za-z0-9]{2,6}$/.test(c.id))
        errors.push(`club ${c.id}: a new club's id is c_ and 2–6 letters or digits`);
      if (!c.league && !staticClubIds.has(c.id)) errors.push(`club ${c.id}: a new club needs a league`);
      if (names.has(c.name)) warnings.push(`club ${c.id}: the name "${c.name}" is used twice`);
      names.add(c.name);
    }
    seen(def.players, 'players');
    const perClub = {};
    for (const p of def.players) {
      push(WD.validatePlayer(p, { clubs, year }));
      if (p.club) perClub[p.club] = (perClub[p.club] || 0) + 1;
    }
    {
      const per = {};
      for (const p of def.players) if (p.callup) per[p.nat] = (per[p.nat] || 0) + 1;
      for (const [nat, n] of Object.entries(per))
        if (n > 26) errors.push(`national team ${nat}: ${n} players called up, a squad is at most 26`);
    }
    if (def.meta.players === 'replace') {
      if (!def.players.length) errors.push('meta.players is "replace" but the definition has no players');
      for (const [id, n] of Object.entries(perClub))
        if (n < 18 && n >= 11) warnings.push(`club ${id}: ${n} defined players; the rest of the squad is made up`);
    }
    for (const [id, n] of Object.entries(perClub))
      if (def.meta.players !== 'replace' && n > 12)
        warnings.push(
          `club ${id}: ${n} defined players join it on top of its squad (the weakest at each position make room)`,
        );
    const mgrs = new Set();
    for (const m of def.managers) {
      const at = `manager ${m.fn} ${m.ln}`;
      if (!clubs.has(m.club)) errors.push(`${at}: club "${m.club}" is not in the definition`);
      if (mgrs.has(m.club)) errors.push(`${at}: club "${m.club}" has two managers`);
      mgrs.add(m.club);
      if (m.nat != null && !D.NATIONS[m.nat]) errors.push(`${at}: unknown nation "${m.nat}"`);
      if (m.age != null && !(m.age >= 28 && m.age <= 80)) errors.push(`${at}: age must be 28–80`);
      if (m.ability != null && !(m.ability >= 1 && m.ability <= 20)) errors.push(`${at}: ability must be 1–20`);
      if (m.rep != null && !(m.rep >= 20 && m.rep <= 99)) errors.push(`${at}: reputation must be 20–99`);
      if (m.personality && !D.STAFF_PERSONALITY.includes(m.personality))
        errors.push(`${at}: unknown personality "${m.personality}"`);
      if (m.tactic) errors.push(...tacticErrors(m.tactic, at));
    }
    {
      const names = (def.agents || []).map((a) => String(a || '').trim());
      if (names.length && (names.length > 30 || names.some((a) => !a)))
        errors.push('agent firms: up to 30 names, none empty');
      if (new Set(names.map((a) => a.toLowerCase())).size !== names.length)
        errors.push('agent firms: two firms have one name');
    }
    // where each club plays (the definition's word first, else the game's own), for B teams and derbies
    const where = new Map();
    for (const [code, x] of staticClubs()) where.set('c_' + code, { league: x.league.id, nat: x.league.nat });
    const leagueInfo = (id) => def.leagues.find((l) => l.id === id) || D.LEAGUES.find((l) => l.id === id) || {};
    for (const c of def.clubs) {
      const lg = c.league || (where.get(c.id) || {}).league;
      where.set(c.id, { league: lg, nat: leagueInfo(lg).nat || c.nat });
    }
    for (const id of removed) where.delete(id);
    const tierOf = (id) => leagueInfo((where.get(id) || {}).league).tier;
    const bOf = {};
    for (const c of def.clubs) {
      if (!c.parent) continue;
      const at = `club ${c.id}`,
        p = where.get(c.parent);
      if (!p) errors.push(`${at}: its parent club ${c.parent} is not in the world`);
      else {
        if (p.nat !== (where.get(c.id) || {}).nat) errors.push(`${at}: a B team is in the same nation as its parent`);
        const par = def.clubs.find((x) => x.id === c.parent);
        if (par && par.parent) errors.push(`${at}: its parent ${c.parent} is a B team itself`);
        if (!(tierOf(c.id) > tierOf(c.parent)))
          errors.push(`${at}: a B team plays in a lower division than its parent`);
      }
      if (bOf[c.parent]) errors.push(`club ${c.parent}: has two B teams (${bOf[c.parent]} and ${c.id})`);
      bOf[c.parent] = c.id;
    }
    const derby = new Set();
    for (const [a, b] of def.rivals || []) {
      if (!where.has(a) || !where.has(b)) errors.push(`derby ${a} v ${b}: both clubs must be in the world`);
      else if (a === b) errors.push(`derby ${a}: a club cannot be its own rival`);
      for (const id of [a, b]) {
        if (derby.has(id)) warnings.push(`club ${id}: has more than one derby; the game keeps one`);
        derby.add(id);
      }
    }
    if (def.rules && def.rules.proRel != null && typeof def.rules.proRel !== 'boolean')
      errors.push('rules.proRel: promotion and relegation are on or off');
    if (def.calendar && Object.keys(def.calendar).length) errors.push(...WD.validateCalendar(def.calendar));
    for (const [lid, x] of Object.entries(def.expansion || {})) errors.push(...WD.validateExpansion(lid, x, def));
    for (const c of def.competitions || []) {
      if (c.format) errors.push(...WD.validateFormat(c.id, c.format, def));
      if (!c.isNew) continue;
      if (c.kind === 'cont') {
        errors.push(...WD.validateNewCont(c, def));
        continue;
      }
      const at = `cup ${c.id}`;
      if (!/^CUP[A-Z0-9]{2,5}$/.test(c.id)) errors.push(`${at}: a new cup's id is CUP and 2–5 letters or digits`);
      if (!String(c.name || '').trim()) errors.push(`${at}: needs a name`);
      if (!D.NATIONS[c.nat]) errors.push(`${at}: needs a nation the game has`);
      if (D.DOMESTIC_CUPS.some((x) => x[0] === c.id && x[1] !== c.nat))
        errors.push(`${at}: the game already has a cup with that id`);
      if (
        D.DOMESTIC_CUPS.some((x) => x[1] === c.nat && x[0] !== c.id) ||
        def.competitions.some((x) => x !== c && x.isNew && x.nat === c.nat)
      )
        errors.push(`${at}: that nation has a domestic cup already`);
      const entrants = def.clubs.filter((k) => {
        const lg = leagueInfo(k.league || (where.get(k.id) || {}).league);
        return lg.nat === c.nat && (lg.sim || 'full') !== 'minimal';
      }).length;
      if (entrants < 8)
        errors.push(
          `${at}: a cup needs at least eight clubs in fully or lightly simulated leagues (the nation has ${entrants})`,
        );
    }
    for (const l of def.leagues) errors.push(...WD.validateLeagueRules(l, def));
    errors.push(...WD.validateIntl(def.intl));
    for (const id of def.removeCups || [])
      if (!domIds().has(id)) errors.push(`cup ${id}: the game has no such domestic cup to take out`);
    const ROLES = [
      'Assistant Manager',
      'First-Team Coach',
      'Head of Analytics',
      'Head Physio',
      'Sporting Director',
      'Scout',
    ];
    const perStaff = {};
    for (const s of def.staff || []) {
      const at = `staff ${(s.fn || '') + ' ' + (s.ln || '')}`.trim();
      if (!ROLES.includes(s.role)) errors.push(`${at}: unknown role "${s.role}"`);
      if (!(s.fn || '').trim() && !(s.ln || '').trim()) errors.push(`${at}: needs a name`);
      if (!D.NATIONS[s.nat]) errors.push(`${at}: unknown nation "${s.nat}"`);
      if (!(s.ability >= 1 && s.ability <= 20)) errors.push(`${at}: ability must be 1–20`);
      if (!(s.age >= 25 && s.age <= 80)) errors.push(`${at}: age must be 25–80`);
      if (s.personality && !D.STAFF_PERSONALITY.includes(s.personality))
        errors.push(`${at}: unknown personality "${s.personality}"`);
      if (s.wage != null && !(s.wage >= 50 && s.wage <= 500000))
        errors.push(`${at}: the weekly wage is between 50 and 500,000`);
      if (s.years != null && !(Number.isInteger(s.years) && s.years >= 1 && s.years <= 5))
        errors.push(`${at}: the contract runs 1–5 years`);
      if (s.judge != null && !(s.judge >= 1 && s.judge <= 20)) errors.push(`${at}: judgement must be 1–20`);
      if (s.regions) {
        if (s.role !== 'Scout') errors.push(`${at}: only a scout has a network of regions`);
        for (const [k, v] of Object.entries(s.regions))
          if (!D.REGIONS[k] || !(v >= 0.05 && v <= 1))
            errors.push(`${at}: region "${k}" needs a knowledge between 5% and 100%`);
      }
      if (s.club) {
        if (!clubs.has(s.club)) errors.push(`${at}: club "${s.club}" is not in the definition`);
        const k = s.club + (s.role === 'Scout' ? '#scout' : '#' + s.role);
        perStaff[k] = (perStaff[k] || 0) + 1;
        if (s.role !== 'Scout' && perStaff[k] > 1)
          warnings.push(`club ${s.club}: two staff made as ${s.role}; the first is used`);
        if (s.role === 'Scout' && perStaff[k] > 5) errors.push(`club ${s.club}: more than five scouts`);
      }
    }
    const nts = new Set();
    for (const n of def.nations || []) {
      const at = `national team ${n.code}`;
      if (!D.NATIONS[n.code]) errors.push(`${at}: the game has no such nation`);
      if (nts.has(n.code)) errors.push(`Two national team entries for ${n.code}`);
      nts.add(n.code);
      if (n.colors && !(Array.isArray(n.colors) && n.colors.length >= 2 && n.colors.every((x) => HEX.test(x))))
        errors.push(`${at}: colours must be two #rrggbb values`);
      if (n.coef != null && !(n.coef >= 20 && n.coef <= 100))
        errors.push(`${at}: ranking points must be between 20 and 100`);
      if (n.name != null && !String(n.name).trim()) errors.push(`${at}: a national team needs a name`);
      if (n.tactic) errors.push(...tacticErrors(n.tactic, at));
      if (n.short != null && (!String(n.short).trim() || String(n.short).length > 4))
        errors.push(`${at}: the short name is 1–4 characters`);
    }
    const years = new Set();
    for (const s of def.history.seasons) {
      if (!isInt(s.year)) errors.push('A past season has no year');
      else if (s.year >= year) errors.push(`season ${s.year}: past seasons must be before the start year ${year}`);
      if (years.has(s.year)) errors.push(`Two past seasons for ${s.year}`);
      years.add(s.year);
      if (s.transfers) {
        if (!Array.isArray(s.transfers) || s.transfers.length > 20)
          errors.push(`season ${s.year}: up to twenty transfers`);
        else
          for (const x of s.transfers) {
            const at = `season ${s.year} transfer ${x.name || '?'}`;
            if (!String(x.name || '').trim()) errors.push(`${at}: needs the player's name`);
            if (!(x.fee >= 0 && x.fee <= 1e9)) errors.push(`${at}: the fee is between 0 and 1,000,000,000`);
            if (!clubs.has(x.to)) errors.push(`${at}: the club he joined, "${x.to}", is not in the definition`);
            if (x.from && !clubs.has(x.from))
              errors.push(`${at}: the club he left, "${x.from}", is not in the definition`);
            if (x.nat && !D.NATIONS[x.nat]) errors.push(`${at}: unknown nation "${x.nat}"`);
          }
      }
      for (const [id, c] of Object.entries(s.intl || {})) {
        if (!tournList().some((t) => t.id === id) && !inviteIds().has(id))
          errors.push(`season ${s.year}: "${id}" is not an international tournament the game has`);
        if (!D.NATIONS[c.winner]) errors.push(`season ${s.year} ${id}: winner "${c.winner}" is not a nation`);
        if (c.runnerUp && !D.NATIONS[c.runnerUp])
          errors.push(`season ${s.year} ${id}: runner-up "${c.runnerUp}" is not a nation`);
        if (c.runnerUp && c.runnerUp === c.winner)
          errors.push(`season ${s.year} ${id}: the winner and the runner-up are one nation`);
      }
      for (const [id, c] of Object.entries(s.cups || {})) {
        if (!domIds().has(id) && !(def.competitions || []).some((x) => x.id === id && x.isNew))
          errors.push(`season ${s.year}: "${id}" is not a domestic cup the game has`);
        if (!clubs.has(c.winner)) errors.push(`season ${s.year} ${id}: winner "${c.winner}" is not in the definition`);
        if (c.runnerUp && !clubs.has(c.runnerUp))
          errors.push(`season ${s.year} ${id}: runner-up "${c.runnerUp}" is not in the definition`);
      }
      for (const [id, c] of Object.entries(s.comps || {})) {
        if (!leagues.has(id)) errors.push(`season ${s.year}: league "${id}" is not in the definition`);
        const t = c.table || [];
        if (!t.length) errors.push(`season ${s.year} ${id}: no table`);
        for (const r of t) {
          if (!clubs.has(r.id)) errors.push(`season ${s.year} ${id}: club "${r.id}" is not in the definition`);
          if (r.p !== r.w + r.d + r.l)
            errors.push(`season ${s.year} ${id}: ${r.id} played ${r.p} but won, drew and lost ${r.w + r.d + r.l}`);
        }
        const gf = t.reduce((a, r) => a + r.gf, 0),
          ga = t.reduce((a, r) => a + r.ga, 0);
        if (gf !== ga) warnings.push(`season ${s.year} ${id}: goals for (${gf}) and against (${ga}) differ`);
        if (c.champion && t.length && t[0].id !== c.champion)
          warnings.push(`season ${s.year} ${id}: the champion is not first in the table`);
      }
    }
    return { errors, warnings };
  };

  // ---------- Club data packs ----------
  // A pack is only the look and the names of a world: each club's name, short name, nickname, city, colours, crest, kit and ground,
  // the names of the leagues and cups, and the names and colours of the national teams. No ratings, players or rules, so any pack
  // fits any world; clubs are matched by id. Real-name packs can be made and shared on top of the fictional default.
  WD.PACK_FORMAT = 'touchline-pack';
  WD.packOf = function (def, meta = {}) {
    const m = def.meta || {};
    return {
      format: WD.PACK_FORMAT,
      version: 1,
      meta: {
        name: meta.name || m.name || 'Club data pack',
        author: meta.author ?? m.author ?? '',
        description: meta.description ?? m.description ?? '',
        created: new Date().toISOString().slice(0, 10),
      },
      leagues: def.leagues.map((l) => ({ id: l.id, name: l.name, short: l.short })),
      competitions: (def.competitions || [])
        .filter((c) => !c.isNew)
        .map((c) => ({ id: c.id, name: c.name, short: c.short })),
      clubs: def.clubs.map((c) => ({
        id: c.id,
        name: c.name,
        short: c.short,
        nick: c.nick || '',
        city: c.city,
        colors: c.colors.slice(0, 2),
        crest: c.crest || null,
        kit: c.kit || null,
        stadium: c.stadium ? c.stadium.name : undefined,
      })),
      nations: (def.nations || []).map((n) => ({ code: n.code, name: n.name, short: n.short, colors: n.colors })),
    };
  };
  WD.parsePack = function (text) {
    let p;
    try {
      p = JSON.parse(text);
    } catch (e) {
      throw new Error('Not valid JSON: ' + e.message);
    }
    if (!p || p.format !== WD.PACK_FORMAT) throw new Error(`Not a ${WD.PACK_FORMAT} file`);
    if (p.version > 1) throw new Error(`Made by a newer version of the game (pack format ${p.version})`);
    return p;
  };
  // A pack onto a definition (in place): what it names or draws replaces what the definition has; what it does not know is left.
  WD.applyPack = function (def, pack) {
    const rep = { clubs: 0, leagues: 0, cups: 0, nations: 0, unmatched: [], errors: [] };
    const E = WD.editor(def, null);
    for (const k of pack.clubs || []) {
      const c = def.clubs.find((x) => x.id === k.id);
      if (!c) {
        rep.unmatched.push(k.id);
        continue;
      }
      const patch = {};
      for (const f of ['name', 'short', 'nick', 'city']) if (k[f] != null && k[f] !== '') patch[f] = k[f];
      if (k.colors) patch.colors = k.colors;
      if (k.crest) patch.crest = k.crest;
      if (k.kit) patch.kit = k.kit;
      if (k.stadium) patch.stadium = { name: k.stadium };
      const r = E.setClub(c.id, patch);
      if (r.ok) rep.clubs++;
      else rep.errors.push(...r.errors);
    }
    for (const k of pack.leagues || []) {
      const l = def.leagues.find((x) => x.id === k.id);
      if (!l) continue;
      const r = E.setLeague(l.id, { name: k.name || l.name, short: k.short || l.short });
      if (r.ok) rep.leagues++;
      else rep.errors.push(...r.errors);
    }
    for (const k of pack.competitions || []) {
      if (!WD.cupKind(k.id, def)) continue;
      const r = E.setCup(k.id, { name: k.name, short: k.short });
      if (r.ok) rep.cups++;
      else rep.errors.push(...r.errors);
    }
    for (const k of pack.nations || []) {
      const patch = {};
      for (const f of ['name', 'short', 'colors']) if (k[f]) patch[f] = k[f];
      const r = E.setNation(k.code, patch);
      if (r.ok) rep.nations++;
      else rep.errors.push(...r.errors);
    }
    return rep;
  };

  // ---------- Text form ----------
  WD.stringify = (def) => JSON.stringify(def, null, 1);
  WD.parse = function (text) {
    let def;
    try {
      def = JSON.parse(text);
    } catch (e) {
      throw new Error('Not valid JSON: ' + e.message);
    }
    if (!def || def.format !== WD.FORMAT) throw new Error(`Not a ${WD.FORMAT} file`);
    if (def.version > WD.VERSION) throw new Error(`Made by a newer version (format ${def.version})`);
    return def; // (older versions would be upgraded here)
  };

  // ---------- A definition onto a world ----------
  WD.apply = function (def, S = FM.S) {
    const v = WD.validate(def, S);
    if (v.errors.length) throw new Error('The world definition has errors:\n' + v.errors.slice(0, 12).join('\n'));
    const rep = {
      leagues: 0,
      clubs: 0,
      playersAdded: 0,
      playersReplaced: 0,
      managers: 0,
      staff: 0,
      nations: 0,
      seasons: 0,
      warnings: v.warnings.slice(),
    };
    for (const l of def.leagues) {
      const c = S.comps[l.id];
      if (!c) continue;
      if (l.name) c.name = l.name;
      if (l.short) c.short = l.short;
      if (l.repBand) c.repBand = l.repBand.slice();
      rep.leagues++;
    }
    for (const d of def.competitions) {
      const c = S.comps[d.id];
      if (c) {
        if (d.name) c.name = d.name;
        if (d.short) c.short = d.short;
      }
    }
    for (const d of def.clubs) {
      const c = S.clubs[d.id];
      if (!c) continue;
      for (const k of ['name', 'short', 'nick', 'city']) if (d[k] != null && d[k] !== '') c[k] = d[k];
      if (d.colors) c.colors = d.colors.slice(0, 2);
      if (d.identity) c.identity = d.identity;
      if (d.rep != null) c.rep = d.rep;
      if (
        d.attr &&
        ['market', 'support', 'catchment', 'hist', 'ceil', 'floor'].every((k) => typeof d.attr[k] === 'number')
      )
        c.attr = { ...d.attr };
      else if (d.attr) {
        // some of them given (the editor's): the rest worked out afresh from the club's standing
        delete c.attr;
        const a = W.clubAttr(c);
        for (const k of ['market', 'support', 'catchment']) if (typeof d.attr[k] === 'number') a[k] = d.attr[k];
        if (d.attr.own) a.own = d.attr.own;
        a.ceil = W.repCeiling(a, c.rep);
        a.floor = Math.max(20, c.rep - (6 + a.market * 0.8) * W.REP_SLACK);
      } else if (d.rep != null && c.attr) delete c.attr; // (a new reputation: its attributes are worked out afresh)
      if (d.crest) c.crest = d.crest.slice(0, 3);
      if (d.kit && (d.kit.home || d.kit.away)) c.kit = { home: d.kit.home || null, away: d.kit.away || null };
      if (d.finance) {
        if (d.finance.balance != null) c.balance = d.finance.balance;
        if (d.finance.budget != null) c.budget = d.finance.budget;
      }
      if (d.facilities) Object.assign(c.facilities, d.facilities);
      if (d.stadium) {
        c.stadium.name = d.stadium.name || c.stadium.name;
        if (d.stadium.cap) c.stadium.cap = c.stadium.cap0 = d.stadium.cap;
      }
      rep.clubs++;
    }
    for (const m of def.managers) {
      const c = S.clubs[m.club],
        st = c && c.manager && S.staff[c.manager];
      if (!st) continue;
      st.fn = m.fn;
      st.ln = m.ln;
      if (m.nat && D.NATIONS[m.nat]) st.nat = m.nat;
      if (m.age) st.age = m.age;
      if (m.ability) st.ability = m.ability;
      if (m.personality) st.personality = m.personality;
      if (m.rep) st.rep = m.rep;
      if (m.tactic) c.tactic = W.newTactic(m.tactic.formation, m.tactic.buildup, m.tactic.press, m.tactic.width);
      rep.managers++;
    }
    // national teams: a name, a short name, colours and the ranking points they start with
    for (const n of def.nations || []) {
      const tm = S.nteams && S.nteams['n_' + n.code];
      if (!tm) continue;
      if (n.name) ((tm.name = n.name), (tm.city = n.name));
      if (n.short) tm.short = n.short;
      if (n.tactic) {
        const k = n.tactic;
        tm.tactic = W.newTactic(k.formation, k.buildup, k.press, k.width);
      }
      if (n.colors) tm.colors = n.colors.slice(0, 2);
      if (n.coef != null) {
        tm.coef = Math.round(n.coef * 10) / 10;
        tm.rep = FM.Intl.repFromCoef(tm.coef);
      }
      rep.nations++;
    }
    // staff: kept with the world and handed over when the career begins (WD.seedStaff)
    if ((def.staff || []).length) {
      S.defStaff = { list: JSON.parse(JSON.stringify(def.staff)), pooled: false };
      rep.staff = def.staff.length;
    }
    S.histFill = !!def.meta.fillHistory;
    // players. "replace": every club the file gives a squad (11 or more players) loses its generated players first, and the
    // gaps in the squad it gets are made up; clubs with fewer keep their own and take the file's players as extras
    const replace = def.meta.players === 'replace',
      covered = new Set();
    if (replace) {
      const per = {};
      for (const d of def.players) if (d.club) per[d.club] = (per[d.club] || 0) + 1;
      for (const [id, n] of Object.entries(per)) if (n >= 11 && S.clubs[id]) covered.add(id);
      for (const p of Object.values(S.players))
        if (p.clubId && covered.has(p.clubId)) {
          delete S.players[p.id];
          rep.playersReplaced++;
        }
      W.rosterVer++;
    }
    // overlay: each makes room by taking the place of the weakest first-team player in his position group
    for (const d of def.players) {
      const age = S.year - d.born;
      if (d.club && S.clubs[d.club] && !covered.has(d.club)) {
        const group = D.POS_GROUP[d.pos],
          sq = W.squad(d.club).filter((p) => !p.team && !p.youth && !p.loan && D.POS_GROUP[p.pos] === group);
        const out = sq.sort((a, b) => a.ca - b.ca)[0];
        if (out && !out.defId && W.squad(d.club).length >= 22) {
          delete S.players[out.id];
          W.rosterVer++;
          rep.playersReplaced++;
        }
      }
      const ca = W.calcCA({ attrs: d.attrs }, d.pos);
      const p = W.genPlayer({
        nat: D.NATIONS[d.nat] ? d.nat : 'ENG',
        pos: d.pos,
        age,
        ca,
        pa: d.pa ?? ca,
        clubId: null,
      });
      p.fn = d.fn;
      p.ln = d.ln;
      p.nat = d.nat;
      p.born = d.born;
      p.foot = d.foot || p.foot;
      p.attrs = Object.fromEntries(D.ATTRS.map((k) => [k, d.attrs[k]]));
      p.pa = Math.round(U.clamp(d.pa ?? ca, ca, 96));
      delete p.alt;
      delete p.side;
      W.genAlt(p);
      W.refresh(p);
      p.wage = d.wage || W.wageFor(p);
      if (d.contract) p.contract = d.contract;
      else if (!d.club) p.contract = S.year; // (a free agent, like the ones the world makes)
      p.defId = d.id;
      if (d.callup) p.ntUntil = S.year + 3; // picked for his country ahead of better players for three years
      W.claimName(`${p.fn} ${p.ln}`);
      S.players[p.id] = p;
      if (d.club && S.clubs[d.club]) W.startSpell(p, d.club);
      rep.playersAdded++;
    }
    for (const id of covered) W.genSquad(S.clubs[id], W.squad(id)); // the gaps in a squad the file left short
    rep.drafted = 0;
    for (const [lid, spec] of Object.entries(def.expansion || {})) rep.drafted += WD.expansionDraft(S, lid, spec);
    // past seasons go to the archive, oldest first, before anything the new world has played
    const past = def.history.seasons
      .slice()
      .sort((a, b) => a.year - b.year)
      .map((s) => ({
        year: s.year,
        label: s.label || `${s.year}/${String(s.year + 1).slice(2)}`,
        comps: Object.fromEntries(
          Object.entries(s.comps || {}).map(([id, c]) => {
            const comp = S.comps[id] || {};
            return [
              id,
              {
                name: comp.name || id,
                sim: comp.sim || 'full',
                nat: comp.nat,
                champion: c.champion || c.table[0].id,
                runnerUp: c.runnerUp || (c.table[1] && c.table[1].id),
                table: c.table,
              },
            ];
          }),
        ),
        intl: Object.entries(s.intl || {})
          .filter(([, c]) => S.nteams && S.nteams['n_' + c.winner] && (!c.runnerUp || S.nteams['n_' + c.runnerUp]))
          .map(([id, c]) => ({
            id,
            name: I().TNAME[id] || id,
            year: s.year,
            winner: 'n_' + c.winner,
            runnerUp: c.runnerUp ? 'n_' + c.runnerUp : 'n_' + c.winner,
            final: c.final || '—',
            games: 0,
            awards: null,
            topScorer: null,
          })),
        cups: Object.fromEntries(
          Object.entries(s.cups || {}).map(([id, c]) => [
            id,
            { name: (S.comps[id] || {}).name || id, winner: c.winner, runnerUp: c.runnerUp || null, awards: null },
          ]),
        ),
        promoted: [],
        relegated: [],
        upsets: [],
        transfers: (s.transfers || [])
          .filter((x) => S.clubs[x.to])
          .map((x) => ({
            pid: null,
            name: x.name,
            nat: x.nat || null,
            from: S.clubs[x.from] ? x.from : null,
            to: x.to,
            fee: x.fee,
            intl: !!(S.clubs[x.from] && S.clubs[x.to].nat !== S.clubs[x.from].nat),
            day: 0,
            age: null,
          }))
          .sort((a, b) => b.fee - a.fee),
        user: null,
        imported: true,
      }));
    S.archive = past.concat((S.archive || []).filter((e) => !past.some((p) => p.year === e.year)));
    for (const e of past)
      for (const [id, c] of Object.entries(e.comps)) {
        const club = S.clubs[c.champion];
        if (club) ((club.titles = club.titles || {}), (club.titles[id] = (club.titles[id] || 0) + 1));
      }
    for (const e of past)
      for (const r of e.intl) {
        const t = S.nteams[r.winner];
        if (t) ((t.titles = t.titles || {}), (t.titles[r.id] = (t.titles[r.id] || 0) + 1));
      }
    for (const e of past)
      for (const [id, c] of Object.entries(e.cups)) {
        const club = S.clubs[c.winner];
        if (club) ((club.titles = club.titles || {}), (club.titles[id] = (club.titles[id] || 0) + 1));
      }
    rep.seasons = past.length;
    W.rosterVer++;
    return rep;
  };
  WD.load = function (def, rules = {}) {
    WD.useStatic(null); // (judged against the game's own data, not against a database staged before)
    const v = WD.validate(def, null);
    // (references to the base world are checked again by apply, once there is a world to check against)
    if (v.errors.length) throw new Error('The world definition has errors:\n' + v.errors.slice(0, 12).join('\n'));
    // what the file adds to or changes in the game's leagues and clubs goes into the static data first, then the world is built from it
    const patch = WD.patchOf(def);
    try {
      WD.useStatic(patch);
      W.newWorld({ ...def.rules, ...rules, startYear: def.meta.startYear || undefined });
      const rep = WD.apply(def);
      rep.patch = patch;
      return rep;
    } catch (e) {
      WD.useStatic(null);
      throw e;
    }
  };

  // ---------- Staff the definition made ----------
  // Called when a career begins (W.takeCharge) and when the staff pool is first filled (W.refreshStaffPool). Staff made for
  // the club you take charge of become your assistant, coach, analyst, physio, director and scouts (replacing the ones a new
  // manager is given); staff made with no club are on offer for hire in the first season.
  const SLOT = {
    'Assistant Manager': 'assistant',
    'First-Team Coach': 'coach',
    'Head of Analytics': 'analyst',
    'Head Physio': 'physio',
    'Sporting Director': 'director',
  };
  const makeStaff = (d) => {
    const extra = { fn: d.fn, ln: d.ln, age: d.age, ability: d.ability };
    if (d.personality) extra.personality = d.personality;
    if (d.wage) extra.wage = d.wage;
    if (d.years) extra.contract = FM.S.year + d.years;
    if (d.role === 'Scout' && d.regions) {
      const best = Object.keys(d.regions).sort((a, b) => d.regions[b] - d.regions[a]);
      Object.assign(extra, {
        regions: { ...Object.fromEntries(Object.keys(D.REGIONS).map((r) => [r, 0.1])), ...d.regions },
        judge: d.judge || d.ability,
        note: `Strongest in ${D.REGIONS[best[0]]}${best[1] && d.regions[best[1]] > 0.6 ? ' and ' + D.REGIONS[best[1]] : ''}.`,
      });
    } else if (d.role === 'Scout' && d.judge) extra.judge = d.judge;
    return W.genStaff(d.role, D.NATIONS[d.nat] ? d.nat : 'ENG', extra);
  };
  WD.seedStaff = function (clubId, isNew) {
    const S = FM.S,
      ds = S.defStaff;
    if (!ds || !S.user || !S.user.staff) return;
    if (clubId && isNew && !ds.used) {
      ds.used = true;
      const mine = ds.list.filter((d) => d.club === clubId);
      const done = {};
      for (const d of mine) {
        const slot = SLOT[d.role];
        if (slot && !done[slot]) {
          done[slot] = true;
          delete S.staff[S.user.staff[slot]];
          S.user.staff[slot] = makeStaff(d).id;
        }
      }
      const scouts = mine.filter((d) => d.role === 'Scout').slice(0, W.maxScouts());
      if (scouts.length) {
        const made = scouts.map((d) => makeStaff(d).id),
          keep = S.user.scouts.slice(scouts.length);
        for (const id of S.user.scouts.slice(0, scouts.length)) delete S.staff[id];
        S.user.scouts = made.concat(keep).slice(0, W.maxScouts());
      }
    }
    if (!ds.pooled && S.staffPool) {
      ds.pooled = true;
      for (const d of ds.list.filter((x) => !x.club)) S.staffPool.push(makeStaff(d).id);
    }
  };

  // ---------- A league table for a past season ----------
  // order: club ids, first to last; games: each club's games; win: points for a win. The results are made up to fit the order
  // (a club higher up has won more; goals for and against balance across the table), so a season entered as "who won it" still
  // has a full, consistent table.
  WD.makeTable = function (order, games, win = 3) {
    const n = order.length,
      rows = order.map((id, i) => {
        const share = n > 1 ? i / (n - 1) : 0,
          w = Math.round(games * (0.68 - 0.5 * share)),
          d = Math.min(games - w, Math.round(games * 0.22)),
          l = games - w - d;
        return { id, p: games, w, d, l, pts: w * win + d, gf: 0, ga: 0 };
      });
    const mean = rows.reduce((a, r) => a + r.pts, 0) / Math.max(1, n);
    const gds = rows.map((r) => Math.round((r.pts - mean) * (3 / win) * 0.5));
    const drift = gds.reduce((a, b) => a + b, 0);
    if (n) gds[n - 1] -= drift; // (the goals scored and conceded across the table are the same)
    const base = Math.round(games * 1.35);
    rows.forEach((r, i) => {
      r.gf = Math.max(0, base + Math.round(gds[i] / 2));
      r.ga = Math.max(0, r.gf - gds[i]);
    });
    const gf = rows.reduce((a, r) => a + r.gf, 0),
      ga = rows.reduce((a, r) => a + r.ga, 0);
    if (n && gf !== ga) rows[n - 1].ga += gf - ga;
    return rows;
  };

  // ---------- Editing ----------
  // Calls change the definition in place and refuse anything that would make it invalid; each returns { ok, errors }.
  WD.editor = function (def, S = FM.S) {
    const ctx = () => ({
      leagues: new Set(def.leagues.map((l) => l.id)),
      clubs: new Set(def.clubs.map((c) => c.id)),
      baseClubs: S ? new Set(Object.keys(S.clubs)) : null,
      year: def.meta.startYear || (S && S.year) || D.SEASON_START,
    });
    const result = (errors) => ({ ok: !errors.length, errors });
    const E = {
      meta: (patch) => {
        Object.assign(def.meta, patch);
        return result(WD.validate(def, S).errors);
      },
      club: (id) => def.clubs.find((c) => c.id === id),
      setClub(id, patch) {
        const c = E.club(id);
        if (!c) return result([`No club ${id}`]);
        const next = { ...c, ...patch, stadium: { ...c.stadium, ...(patch.stadium || {}) } };
        const r = WD.validateClub(next, ctx());
        if (r.errors.length) return result(r.errors);
        Object.assign(c, next);
        return result([]);
      },
      setLeague(id, patch) {
        const l = def.leagues.find((x) => x.id === id);
        if (!l) return result([`No league ${id}`]);
        const next = { ...l, ...patch },
          errs = [];
        if (!next.name) errs.push('A league needs a name');
        if (next.repBand && !(next.repBand[0] >= next.repBand[1])) errs.push('repBand must be [high, low]');
        if (next.sim && !SIMS.includes(next.sim)) errs.push('sim must be full, light or minimal');
        const was = { ...l };
        Object.assign(l, next);
        errs.push(...WD.validateLeagueRules(l, def));
        if (errs.length) {
          Object.assign(l, was);
          return result(errs);
        }
        return result([]);
      },
      player: (id) => def.players.find((p) => p.id === id),
      addPlayer(p) {
        const next = {
          id: p.id || `dp_${def.players.length + 1}_${Math.random().toString(36).slice(2, 6)}`,
          foot: 'Right',
          club: null,
          ...p,
        };
        if (def.players.some((x) => x.id === next.id)) return result([`There is already a player ${next.id}`]);
        const r = WD.validatePlayer(next, ctx());
        if (r.errors.length) return result(r.errors);
        def.players.push(next);
        return { ...result([]), id: next.id };
      },
      updatePlayer(id, patch) {
        const p = E.player(id);
        if (!p) return result([`No player ${id}`]);
        const next = { ...p, ...patch, attrs: { ...p.attrs, ...(patch.attrs || {}) } };
        const r = WD.validatePlayer(next, ctx());
        if (r.errors.length) return result(r.errors);
        Object.assign(p, next);
        return result([]);
      },
      removePlayer(id) {
        const i = def.players.findIndex((p) => p.id === id);
        if (i < 0) return result([`No player ${id}`]);
        def.players.splice(i, 1);
        return result([]);
      },
      movePlayer: (id, club) => E.updatePlayer(id, { club }),
      // players straight from the real-stats converter: rows are { name | fn+ln, nat, born, club, foot, ...conversion }
      importPlayers(rows) {
        const errors = [];
        let added = 0;
        for (const r of rows) {
          if (r.error) {
            errors.push(`${r.name || '?'}: ${r.error}`);
            continue;
          }
          const [fn, ...rest] = String(r.name || `${r.fn || ''} ${r.ln || ''}`)
            .trim()
            .split(/\s+/);
          const res = E.addPlayer({
            fn,
            ln: rest.join(' '),
            nat: r.nat,
            born: r.born,
            pos: r.pos,
            foot: r.foot || 'Right',
            attrs: r.attrs,
            pa: r.pa,
            club: r.club || null,
            contract: r.contract,
          });
          if (res.ok) added++;
          else errors.push(...res.errors);
        }
        return { ...result(errors), added };
      },
      addSeason(s) {
        const e = [];
        if (!isInt(s.year)) e.push('A season needs a year');
        if (def.history.seasons.some((x) => x.year === s.year)) e.push(`There is already a season ${s.year}`);
        if (e.length) return result(e);
        def.history.seasons.push(s);
        const v = WD.validate(def, S);
        if (v.errors.length) {
          def.history.seasons.pop();
          return result(v.errors);
        }
        return result([]);
      },
      removeSeason(year) {
        const i = def.history.seasons.findIndex((s) => s.year === year);
        if (i < 0) return result([`No season ${year}`]);
        def.history.seasons.splice(i, 1);
        return result([]);
      },
      // a cup's name and format; the format is checked against what the game has for that cup
      setCup(id, patch) {
        const cur = (def.competitions || []).find((c) => c.id === id);
        const next = { id, type: 'cup', nat: null, ...(cur || {}), ...patch };
        if (next.format) {
          const bad = WD.validateFormat(id, next.format, def);
          if (bad.length) return result(bad);
        }
        if (cur) Object.assign(cur, next);
        else (def.competitions = def.competitions || []).push(next);
        return result([]);
      },
      // a cup of the definition's own for a nation (its id: CUP and letters); removed again with removeCup
      addCup(c) {
        const next = {
          type: 'cup',
          isNew: true,
          format: { legs: [], neutral: [2], prize: 3e6, tiers: 0 },
          ...c,
        };
        (def.competitions = def.competitions || []).push(next);
        const errs = WD.validate(def, S).errors.filter((e) => e.startsWith(`cup ${next.id}:`));
        if (errs.length) {
          def.competitions.pop();
          return result(errs);
        }
        return result([]);
      },
      // a continental cup of the definition's own (its id: CN and letters), of a tier from 1 to 4; its clubs come from the leagues'
      // qualify rules (tier 1) or its feeders (the others), set afterwards
      addContinental(c) {
        const next = {
          type: 'cup',
          isNew: true,
          kind: 'cont',
          region: 'Europe',
          tier: 2,
          format: { legs: { qf: 2, sf: 2, f: 1 }, prize: 2e6, groupSize: 4, feeders: {} },
          ...c,
        };
        (def.competitions = def.competitions || []).push(next);
        const errs = WD.validateNewCont(next, def).filter((e) => !/at least eight/.test(e));
        if (errs.length) {
          def.competitions.pop();
          return result(errs);
        }
        return result([]);
      },
      // an expansion draft for the clubs that join a league (see WD.expansionDraft); null takes it away
      setExpansion(lid, spec) {
        def.expansion = def.expansion || {};
        if (!spec) {
          delete def.expansion[lid];
          return result([]);
        }
        const next = { ...WD.EXPANSION, ...spec };
        const bad = WD.validateExpansion(lid, next, def);
        if (bad.length) return result(bad);
        def.expansion[lid] = next;
        return result([]);
      },
      removeCup(id) {
        const c = (def.competitions || []).find((x) => x.id === id && x.isNew);
        if (!c) return result([`No cup ${id} of the definition's own`]);
        def.competitions.splice(def.competitions.indexOf(c), 1);
        for (const s of def.history.seasons) if (s.cups) delete s.cups[id];
        return result([]);
      },
      // derbies: a club has one; setting one takes the old ones of both clubs out (a pair of the game's own is listed for removal)
      derbyOf: (id) => (def.rivals || []).find((r) => r[0] === id || r[1] === id),
      setDerby(a, b, name) {
        if (a === b) return result(['A club cannot be its own rival']);
        if (!def.clubs.some((c) => c.id === a) || !def.clubs.some((c) => c.id === b))
          return result(['Both clubs must be in the world']);
        E.clearDerby(a);
        E.clearDerby(b);
        (def.rivals = def.rivals || []).push([a, b, String(name || '').trim() || 'Derby']);
        def.removeRivals = (def.removeRivals || []).filter(
          (r) => !((r[0] === a && r[1] === b) || (r[0] === b && r[1] === a)),
        );
        return result([]);
      },
      clearDerby(id) {
        for (const r of (def.rivals || []).filter((x) => x[0] === id || x[1] === id)) {
          def.rivals.splice(def.rivals.indexOf(r), 1);
          (def.removeRivals = def.removeRivals || []).push([r[0], r[1]]);
        }
        return result([]);
      },
      // a B team: the club plays below its parent (null: not a B team)
      setParent(id, parent) {
        const c = E.club(id);
        if (!c) return result([`No club ${id}`]);
        const was = c.parent;
        c.parent = parent || null;
        const errs = WD.validate(def, S).errors.filter(
          (e) => e.startsWith(`club ${id}:`) || e.startsWith(`club ${parent}:`),
        );
        if (errs.length) {
          c.parent = was;
          return result(errs);
        }
        return result([]);
      },
      staff: (id) => (def.staff || []).find((s) => s.id === id),
      addStaff(s) {
        const next = {
          id: s.id || `ds_${(def.staff || []).length + 1}_${Math.random().toString(36).slice(2, 6)}`,
          club: null,
          ...s,
        };
        def.staff = def.staff || [];
        def.staff.push(next);
        const errs = WD.validate(def, S).errors.filter((e) => e.startsWith('staff') || e.includes('scouts'));
        if (errs.length) {
          def.staff.pop();
          return result(errs);
        }
        return { ...result([]), id: next.id };
      },
      updateStaff(id, patch) {
        const s = E.staff(id);
        if (!s) return result([`No staff ${id}`]);
        const was = { ...s };
        Object.assign(s, patch);
        const errs = WD.validate(def, S).errors.filter((e) => e.startsWith('staff') || e.includes('scouts'));
        if (errs.length) {
          Object.assign(s, was);
          return result(errs);
        }
        return result([]);
      },
      removeStaff(id) {
        const i = (def.staff || []).findIndex((s) => s.id === id);
        if (i < 0) return result([`No staff ${id}`]);
        def.staff.splice(i, 1);
        return result([]);
      },
      // a national team: name, short name, colours, ranking points (an entry with nothing in it is dropped)
      setNation(code, patch) {
        if (!D.NATIONS[code]) return result([`No nation ${code}`]);
        const cur = (def.nations = def.nations || []).find((n) => n.code === code),
          next = { ...(cur || { code }), ...patch };
        const test = { ...def, nations: [next] };
        const errs = WD.validate(test, S).errors.filter((e) => e.startsWith('national team'));
        if (errs.length) return result(errs);
        if (cur) Object.assign(cur, next);
        else def.nations.push(next);
        return result([]);
      },
      // international football: the World Championship year, a tournament's name and places, an invitational's name and host
      setIntl(patch) {
        const cur = def.intl && Object.keys(def.intl).length ? def.intl : WD.intlNow();
        const next = {
          cycle: patch.cycle != null ? patch.cycle : cur.cycle,
          tourns: { ...cur.tourns, ...(patch.tourns || {}) },
          invites: patch.invites || cur.invites,
        };
        const errs = WD.validateIntl(next);
        if (errs.length) return result(errs);
        def.intl = next;
        return result([]);
      },
      clearNation(code) {
        def.nations = (def.nations || []).filter((n) => n.code !== code);
        return result([]);
      },
      validate: () => WD.validate(def, S),
    };
    return E;
  };
})();
