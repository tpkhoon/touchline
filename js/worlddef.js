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
        def.competitions.push({ id: c.id, name: c.name, short: c.short, nat: c.nat || null, type: c.type });
    }
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
    return def;
  };

  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  // What a definition changes in the static data: { leagues: [...], clubs: [...], rivals: [...] }, empty when nothing
  WD.patchOf = function (def) {
    const patch = { leagues: [], clubs: [], rivals: [] };
    const known = staticClubs();
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
    for (const [a, b, name] of def.rivals || []) {
      const x = codeOf(a),
        y = codeOf(b);
      if (!D.RIVALS.some((r) => (r[0] === x && r[1] === y) || (r[0] === y && r[1] === x)))
        patch.rivals.push([x, y, name || 'Derby']);
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
  WD.patchIsEmpty = (p) => !p || !(p.leagues.length || p.clubs.length || p.rivals.length);

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
      rivals: D.RIVALS.length,
      mix: new Set(Object.keys(D.NAT_MIX)),
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
    for (const r of patch.rivals) D.RIVALS.push(r.slice());
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
      D.RIVALS.length = snap.rivals;
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
    const years = new Set();
    for (const s of def.history.seasons) {
      if (!isInt(s.year)) errors.push('A past season has no year');
      else if (s.year >= year) errors.push(`season ${s.year}: past seasons must be before the start year ${year}`);
      if (years.has(s.year)) errors.push(`Two past seasons for ${s.year}`);
      years.add(s.year);
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
        promoted: [],
        relegated: [],
        upsets: [],
        transfers: [],
        user: null,
        imported: true,
      }));
    S.archive = past.concat((S.archive || []).filter((e) => !past.some((p) => p.year === e.year)));
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
      validate: () => WD.validate(def, S),
    };
    return E;
  };
})();
