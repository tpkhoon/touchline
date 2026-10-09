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
    removeClubs: [], // ids of the game's own clubs the world does without
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
      def.nations.push({ code: t.code, name: t.name, short: t.short, colors: t.colors.slice(0, 2), coef: t.coef });
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
        stadium: { name: c.stadium.name, cap: c.stadium.cap0 || c.stadium.cap },
      });
      if (c.rival && c.id < c.rival) def.rivals.push([c.id, c.rival, c.derby || 'Derby']);
      const m = c.manager && S.staff[c.manager];
      if (m) def.managers.push({ club: c.id, fn: m.fn, ln: m.ln, nat: m.nat, age: m.age, ability: m.ability });
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
  WD.cupKind = (id) =>
    D.DOMESTIC_CUPS.some((c) => c[0] === id) || euroDef(id)
      ? 'opts'
      : D.CONTINENTALS.some((c) => c.id === id)
        ? 'cont'
        : null;
  const cupNow = (id) => {
    const kind = WD.cupKind(id);
    if (kind === 'opts') {
      const o = euroDef(id) ? euroDef(id).opts : D.DOMESTIC_CUPS.find((c) => c[0] === id)[4];
      return {
        legs: ((o && o.legs) || []).slice(),
        neutral: o && o.neutral === 'all' ? 'all' : ((o && o.neutral) || [2]).slice(), // (no list: the final)
        prize: euroDef(id) ? euroDef(id).prize : (o && o.prize) || 3e6,
        tiers: (o && o.tiers) || 0, // the lowest division that enters (0: every division)
      };
    }
    if (kind === 'cont') {
      const d = D.CONTINENTALS.find((c) => c.id === id);
      return { legs: { qf: 2, sf: 2, f: 1, ...(d.legs || {}) }, central: !!d.central, prize: d.prize };
    }
    return null;
  };
  WD.formatOf = (id) => cupNow(id);
  WD.validateFormat = function (id, f) {
    const kind = WD.cupKind(id),
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
    }
    if (f.prize != null && !(f.prize >= 1e5 && f.prize <= 1e9))
      e.push(`${at}: the prize is between 100,000 and 1,000,000,000`);
    return e;
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
    const have = new Set(def.clubs.map((c) => c.id));
    for (const [a, b, name] of D.RIVALS)
      if (have.has('c_' + a) && have.has('c_' + b)) def.rivals.push(['c_' + a, 'c_' + b, name]);
    return def;
  };

  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  // What a definition changes in the static data: { leagues: [...], clubs: [...], rivals: [...] }, empty when nothing
  WD.patchOf = function (def) {
    const patch = { leagues: [], clubs: [], rivals: [], removeRivals: [], removed: [], cups: [] };
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
          rules: JSON.parse(JSON.stringify(l.rules || {})),
          isNew: true,
        });
        continue;
      }
      const d = { id: l.id };
      for (const k of ['name', 'short', 'tier', 'sim', 'repBand', 'rules'])
        if (l[k] != null && !same(l[k], cur[k] || (k === 'rules' ? {} : undefined))) d[k] = l[k];
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
      if (!c.format || !WD.cupKind(c.id)) continue;
      if (!WD.validateFormat(c.id, c.format).length && !same(c.format, cupNow(c.id)))
        patch.cups.push({ id: c.id, kind: WD.cupKind(c.id), format: JSON.parse(JSON.stringify(c.format)) });
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
      (p.cups || []).length
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
      cups: D.DOMESTIC_CUPS.map((c) => JSON.stringify(c[4] || {})),
      euro: (D.EURO_CUPS || []).map((c) => JSON.stringify(c.opts || {})),
      conts: D.CONTINENTALS.map((c) => ({
        legs: c.legs && JSON.stringify(c.legs),
        central: c.central,
        prize: c.prize,
      })),
      euroPrize: (D.EURO_CUPS || []).map((c) => c.prize),
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
    for (const c of patch.cups || []) {
      if (c.kind === 'cont') {
        const d = D.CONTINENTALS.find((x) => x.id === c.id);
        if (d) ((d.legs = { ...c.format.legs }), (d.central = !!c.format.central));
        if (d && c.format.prize != null) d.prize = c.format.prize;
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
      D.DOMESTIC_CUPS.forEach((c, i) => (c[4] = JSON.parse(snap.cups[i])));
      (D.EURO_CUPS || []).forEach((c, i) => ((c.opts = JSON.parse(snap.euro[i])), (c.prize = snap.euroPrize[i])));
      D.CONTINENTALS.forEach((c, i) => {
        const s = snap.conts[i];
        if (s.legs) c.legs = JSON.parse(s.legs);
        else delete c.legs;
        if (s.central === undefined) delete c.central;
        else c.central = s.central;
        c.prize = s.prize;
      });
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

  // ---------- Validation ----------
  const isInt = (v) => Number.isInteger(v);
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
        if (r.qualify && !D.CONTINENTALS.some((c) => c.id === r.qualify.to))
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
    for (const m of def.managers)
      if (!clubs.has(m.club)) errors.push(`manager ${m.fn} ${m.ln}: club "${m.club}" is not in the definition`);
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
    for (const c of def.competitions || []) if (c.format) errors.push(...WD.validateFormat(c.id, c.format));
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
      if (n.short != null && (!String(n.short).trim() || String(n.short).length > 4))
        errors.push(`${at}: the short name is 1–4 characters`);
    }
    const years = new Set();
    for (const s of def.history.seasons) {
      if (!isInt(s.year)) errors.push('A past season has no year');
      else if (s.year >= year) errors.push(`season ${s.year}: past seasons must be before the start year ${year}`);
      if (years.has(s.year)) errors.push(`Two past seasons for ${s.year}`);
      years.add(s.year);
      for (const [id, c] of Object.entries(s.cups || {})) {
        if (!D.DOMESTIC_CUPS.some((x) => x[0] === id))
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
      else if (d.rep != null && c.attr) delete c.attr; // (a new reputation: its attributes are worked out afresh)
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
      rep.managers++;
    }
    // national teams: a name, a short name, colours and the ranking points they start with
    for (const n of def.nations || []) {
      const tm = S.nteams && S.nteams['n_' + n.code];
      if (!tm) continue;
      if (n.name) ((tm.name = n.name), (tm.city = n.name));
      if (n.short) tm.short = n.short;
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
      W.claimName(`${p.fn} ${p.ln}`);
      S.players[p.id] = p;
      if (d.club && S.clubs[d.club]) W.startSpell(p, d.club);
      rep.playersAdded++;
    }
    for (const id of covered) W.genSquad(S.clubs[id], W.squad(id)); // the gaps in a squad the file left short
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
        cups: Object.fromEntries(
          Object.entries(s.cups || {}).map(([id, c]) => [
            id,
            { name: (S.comps[id] || {}).name || id, winner: c.winner, runnerUp: c.runnerUp || null, awards: null },
          ]),
        ),
        promoted: [],
        relegated: [],
        upsets: [],
        transfers: [],
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
  const makeStaff = (d) =>
    W.genStaff(d.role, D.NATIONS[d.nat] ? d.nat : 'ENG', { fn: d.fn, ln: d.ln, age: d.age, ability: d.ability });
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
        if (errs.length) return result(errs);
        Object.assign(l, next);
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
          const bad = WD.validateFormat(id, next.format);
          if (bad.length) return result(bad);
        }
        if (cur) Object.assign(cur, next);
        else (def.competitions = def.competitions || []).push(next);
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
      clearNation(code) {
        def.nations = (def.nations || []).filter((n) => n.code !== code);
        return result([]);
      },
      validate: () => WD.validate(def, S),
    };
    return E;
  };
})();
