// The world editor: change the clubs and leagues the game starts from, before a career begins. It works on a world
// definition (FM.WorldDef, js/worlddef.js): the built-in world, or the database you loaded, is copied into the editor,
// edited through the same validated calls the importers use, and handed back to the new-career screen as the database the
// world is made from (or saved as a file to share). Opened from the Database card on the new-career screen.
//
// It edits what a club and a league are (names, colours, grounds, ratings, identities, which league a club plays in, new
// clubs and leagues, promotion, relegation and continental places), the players and free agents, a manager for each club, the
// rules, the cups (names and formats), derbies and B teams, coaches and scouts, national teams and past seasons.
(function () {
  const FM = window.FM,
    D = FM.D,
    U = FM.U,
    UI = FM.UI,
    WD = FM.WorldDef,
    DB = FM.DbImport;
  const esc = U.esc;
  const $ = (s) => document.querySelector(s);

  // The editor's state: the definition being edited, and where in it you are
  let ED = null;

  const clone = (o) => JSON.parse(JSON.stringify(o));
  // The nations of the game (Catalonia and the Basque Country only when the world adds them)
  const natEntries = () =>
    Object.entries(D.NATIONS).filter(([, n]) => !n.optional || (ED && ED.def.rules.regionNations));
  const natOf = (l) => D.NATIONS[l.nat] || { flag: '', name: l.nat };
  const clubsOf = (lid) => ED.def.clubs.filter((c) => c.league === lid);
  const leagueOf = (id) => ED.def.leagues.find((l) => l.id === id);
  // What the definition changes in the game's own data, and whether it can load
  const status = () => {
    const chk = DB.check(ED.def),
      patch = WD.patchOf(ED.def);
    return {
      chk,
      changed: patch.clubs.filter((c) => !c.isNew).length,
      added: patch.clubs.filter((c) => c.isNew).length,
      leaguesAdded: patch.leagues.filter((l) => l.isNew).length,
      leaguesChanged: patch.leagues.filter((l) => !l.isNew).length,
    };
  };
  // The game's own clubs, as the built-in data has them: what a club of the definition is compared with
  const builtIn = () => (ED.base = ED.base || new Map(WD.fromStatic().clubs.map((c) => [c.id, c])));
  const stars = (rep) => `${(Math.round((rep / 100) * 10) / 2).toFixed(1)}★`;

  // ---------- Opening and closing ----------
  UI.acts.edOpen = () => {
    const cur = UI._ng().db;
    WD.useStatic(null); // (the game's own data while you edit: a database staged for the club picker is put back when you leave)
    ED = {
      base: null,
      def: cur && cur.ok && cur.def ? clone(cur.def) : WD.fromStatic({ name: 'My world' }),
      start: null, // the world as it was when the editor opened: what the Changes screen compares with
      hq: '',
      tab: 'world',
      view: 'home',
      lid: null,
      cid: null,
      q: '',
      err: [],
    };
    // (a definition made from the built-in data, with nothing changed, is still the built-in world)
    if (!ED.def.meta.name || ED.def.meta.name === 'Built-in data') ED.def.meta.name = 'My world';
    ED.start = clone(ED.def);
    UI.worldEditor();
  };
  // From the title screen: the same editor, and Back returns there
  UI.acts.edOpenTitle = () => {
    UI.acts.edOpen();
    if (ED) ED.fromTitle = true;
  };
  UI.acts.edClose = () => {
    const toTitle = ED && ED.fromTitle;
    ED = null;
    const cur = UI._ng().db;
    if (cur && cur.ok) DB.stage(cur);
    if (toTitle) UI.title();
    else UI.newCareer();
  };
  // Hand the edited world back: the new-career screen now builds the world from it
  UI.acts.edUse = () => {
    const s = status();
    if (!s.chk.ok) {
      ED.err = s.chk.errors;
      return UI.worldEditor();
    }
    const res = { ...s.chk, def: ED.def, adapter: 'editor', adapterName: 'World editor', notes: [] };
    DB.stage(res);
    UI._ng().db = res;
    UI._ng().dbErr = [];
    UI._ngDataChanged();
    ED = null;
    UI.newCareer();
  };
  UI.acts.edExport = async () => {
    try {
      ED.def.meta.changes = changesList()
        .map((x) => x.text)
        .slice(0, 300); // (what this pack changed from the world it started as)
      ED.def.meta.gameVersion = FM.VERSION; // (what the pack was made with: an import warns when the game differs)
      const bytes = new TextEncoder().encode(WD.stringify(ED.def));
      const name = `touchline-${String(ED.def.meta.name || 'world')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}.json`;
      const r = await FM.Native.shareFile({
        bytes,
        name,
        type: 'application/json',
        title: 'Touchline database',
        preferShare: matchMedia('(pointer: coarse)').matches,
      });
      if (r !== 'cancelled') UI.toast(`Database ${r === 'saved' ? 'saved' : 'ready'}: ${name}`, 3500);
    } catch (e) {
      UI.toast('⚠️ ' + (e.message || 'Export failed'), 4000);
    }
  };
  UI.acts.edReset = () => {
    ED.def = WD.fromStatic({ name: ED.def.meta.name });
    ED.view = 'home';
    ED.err = [];
    UI.worldEditor();
  };
  UI.acts.edView = (d) => {
    ED.view = d.v;
    ED.err = [];
    if (d.lid !== undefined) ED.lid = d.lid;
    if (d.cid !== undefined) ED.cid = d.cid;
    if (d.v === 'league') ED.q = '';
    UI.worldEditor();
  };

  // ---------- Clubs ----------
  // A code for a new club: three letters of its name and a number, unused by any club (the game's or the definition's)
  const newCode = (name) => {
    const base =
      String(name || 'NEW')
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
        .slice(0, 3)
        .padEnd(3, 'X') || 'NEW';
    const used = new Set(ED.def.clubs.map((c) => String(c.id).replace(/^c_/, '')));
    for (let i = 1; ; i++) if (!used.has(base + i)) return base + i;
  };
  const saveManager = (cid) => {
    const fn = (($('#ed-mfn') || {}).value || '').trim(),
      ln = (($('#ed-mln') || {}).value || '').trim();
    ED.def.managers = (ED.def.managers || []).filter((m) => m.club !== cid);
    if (fn || ln)
      ED.def.managers.push({
        club: cid,
        fn,
        ln,
        nat: $('#ed-mnat').value,
        age: Math.max(28, Math.min(80, Math.round(+$('#ed-mage').value) || 48)),
        ability: Math.round(+$('#ed-mab').value),
        rep: Math.round(+$('#ed-mrep').value),
        ...($('#ed-mpers').value ? { personality: $('#ed-mpers').value } : {}),
        ...($('#ed-mform').value
          ? {
              tactic: {
                formation: $('#ed-mform').value,
                buildup: $('#ed-mbuild').value,
                press: $('#ed-mpress').value,
                width: $('#ed-mwidth').value,
              },
            }
          : {}),
      });
  };
  // A club the definition adds is first made with a placeholder id; once it has a name its id follows it (the club's own
  // players and derbies follow too)
  const renameToName = (id, name) => {
    if (!isNew(id)) return;
    const letters = String(name || '')
      .toUpperCase()
      .replace(/[^A-Z]/g, '');
    const code = id.replace(/^c_/, '');
    if (letters.length >= 3 && code.startsWith(letters.slice(0, 3))) return;
    const next = 'c_' + newCode(name);
    const c = ED.def.clubs.find((x) => x.id === id);
    c.id = next;
    for (const p of ED.def.players) if (p.club === id) p.club = next;
    for (const m of ED.def.managers || []) if (m.club === id) m.club = next;
    for (const s of ED.def.staff || []) if (s.club === id) s.club = next;
    for (const o of ED.def.clubs) if (o.parent === id) o.parent = next;
    for (const r of ED.def.rivals || []) for (let i = 0; i < 2; i++) if (r[i] === id) r[i] = next;
    if (ED.cid === id) ED.cid = next;
  };
  UI.acts.edAddClub = () => {
    const l = leagueOf(ED.lid),
      rows = clubsOf(l.id),
      mid = rows.length ? Math.round(rows.reduce((t, c) => t + c.rep, 0) / rows.length) : 50;
    const code = newCode('New Club');
    const c = {
      id: 'c_' + code,
      name: 'New Club',
      short: 'NEW',
      nick: '',
      city: 'Newtown',
      nat: l.nat,
      colors: ['#2a6fdb', '#ffffff'],
      identity: 'historic',
      rep: Math.max(20, Math.min(99, mid)),
      league: l.id,
      parent: null,
      founded: 1900,
      stadium: { name: 'Newtown Stadium', cap: 8000 },
    };
    ED.def.clubs.push(c);
    ED.view = 'club';
    ED.cid = c.id;
    ED.err = [];
    UI.worldEditor();
  };
  // Only a club the definition added can be taken out again (the game's own clubs can be changed, not deleted)
  const isNew = (id) => !builtIn().has(id);
  // Take a club out: one you added is simply gone; one of the game's own is taken out of the world (it can be put back from
  // its league's screen). A league keeps at least eight clubs, and a club with a B team cannot go before the B team.
  const dropClub = (id) => {
    const def = ED.def;
    def.clubs = def.clubs.filter((c) => c.id !== id);
    def.players = (def.players || []).filter((p) => p.club !== id);
    def.managers = (def.managers || []).filter((m) => m.club !== id);
    def.staff = (def.staff || []).filter((s) => s.club !== id);
    for (const r of def.rivals || [])
      if (r[0] === id || r[1] === id) def.removeRivals = [...(def.removeRivals || []), [r[0], r[1]]];
    def.rivals = (def.rivals || []).filter((r) => r[0] !== id && r[1] !== id);
    if (builtIn().has(id)) def.removeClubs = [...new Set([...(def.removeClubs || []), id])];
  };
  UI.acts.edDelClub = () => {
    if (!ED.def.clubs.some((c) => c.id === ED.cid)) return;
    const was = clone(ED.def);
    dropClub(ED.cid);
    const chk = DB.check(ED.def);
    if (!chk.ok) {
      ED.def = was;
      ED.err = chk.errors;
      return UI.worldEditor();
    }
    ED.view = 'league';
    ED.err = [];
    UI.worldEditor();
  };
  UI.acts.edRestoreClub = (d) => {
    const base = builtIn().get(d.cid);
    if (!base) return;
    ED.def.removeClubs = (ED.def.removeClubs || []).filter((id) => id !== d.cid);
    if (!ED.def.clubs.some((c) => c.id === d.cid)) ED.def.clubs.push(clone(base));
    UI.worldEditor();
  };
  UI.acts.edRevertClub = () => {
    const base = builtIn().get(ED.cid);
    const i = ED.def.clubs.findIndex((c) => c.id === ED.cid);
    if (!base || i < 0) return;
    ED.def.clubs[i] = clone(base);
    ED.err = [];
    UI.worldEditor();
  };
  UI.acts.edSaveClub = () => {
    const v = (id) => ($('#ed-' + id) || {}).value;
    const lg = v('league') || ED.lid;
    const patch = {
      name: (v('name') || '').trim(),
      short:
        (v('short') || '').trim().toUpperCase() ||
        U.abbrev(v('name'), new Set(ED.def.clubs.filter((x) => x.id !== ED.cid).map((x) => x.short))),
      nick: (v('nick') || '').trim(),
      city: (v('city') || '').trim(),
      colors: [v('c1'), v('c2')],
      identity: v('identity'),
      rep: Math.round(+v('rep')),
      league: lg,
      nat: (leagueOf(lg) || {}).nat,
      founded: Math.round(+v('founded')) || null,
      stadium: { name: (v('stadium') || '').trim(), cap: Math.round(+v('cap')) },
    };
    // (a rule of the game's own is left alone: the fields are not on the screen)
    if ($('#ed-polnat')) {
      const pn = v('polnat');
      const [kind, key] = pn ? pn.split(':') : [];
      const name =
        kind === 'nat'
          ? D.NATIONS[key].name
          : kind === 'region'
            ? D.REGIONS[key]
            : (D.HERITAGE_LABEL || {})[key] || key;
      const label = (v('pollabel') || '').trim() || name;
      patch.policy = !pn
        ? null
        : kind === 'nat'
          ? { nat: key, label }
          : kind === 'region'
            ? { region: key, label }
            : { heritage: key, label };
    }
    const r = WD.editor(ED.def, null).setClub(ED.cid, patch);
    if (!r.ok) {
      ED.err = r.errors;
      return UI.worldEditor();
    }
    saveManager(ED.cid);
    const E = WD.editor(ED.def, null),
      rival = v('derby'),
      b = E.setParent(ED.cid, v('parent') || null);
    if (!b.ok) {
      ED.err = b.errors;
      return UI.worldEditor();
    }
    if (rival) E.setDerby(ED.cid, rival, v('derbyname'));
    else if (E.derbyOf(ED.cid)) E.clearDerby(ED.cid);
    renameToName(ED.cid, patch.name);
    ED.lid = lg;
    ED.view = 'league';
    ED.err = [];
    UI.toast('Club saved', 1500);
    UI.worldEditor();
  };

  // ---------- Leagues ----------
  UI.acts.edSaveLeague = (d) => {
    const v = (id) => ($('#ed-' + id) || {}).value;
    const l = leagueOf(ED.lid),
      rules = clone(l.rules || {});
    const tb = (v('tb') || '').split(',');
    const game = (D.TIEBREAK[l.id] || D.TIEBREAK_DEFAULT).join();
    if (tb.join() === game) delete rules.tiebreak;
    else rules.tiebreak = tb;
    if ($('#ed-lprize')) {
      const n = parseFloat(v('lprize'));
      if (n > 0) rules.prize = Math.round(n * 1e6);
      else delete rules.prize;
    }
    if ($('#ed-spa')) {
      const count = document.querySelectorAll('[id^=ed-spg-]').length;
      const each = (id, f) => Array.from({ length: count }, (_, i) => f(v(`${id}-${i}`)));
      rules.split = {
        after: Math.round(+v('spa')),
        groups: each('spg', (x) => Math.round(+x)),
        rounds: each('spr', (x) => x),
        names: each('spn', (x) => String(x || '').trim()),
        halve: v('sph') === 'yes',
      };
    }
    if (rules.conferences && $('#ed-cn0')) {
      const old = Object.keys(rules.conferences),
        nu = [v('cn0'), v('cn1')].map((x, i) => (x || '').trim() || old[i]);
      if (nu[0] !== nu[1]) rules.conferences = Object.fromEntries(old.map((k, i) => [nu[i], rules.conferences[k]]));
    }
    const r = WD.editor(ED.def, null).setLeague(ED.lid, {
      name: (v('lname') || '').trim(),
      short: (v('lshort') || '').trim().toUpperCase() || ED.lid,
      sim: v('lsim'),
      repBand: [Math.round(+v('lhigh')), Math.round(+v('llow'))],
      rules,
    });
    ED.err = r.ok ? [] : r.errors;
    if (d && d.quiet) return;
    if (r.ok) UI.toast('League saved', 1500);
    UI.worldEditor();
  };

  // ---------- Screens ----------
  const crestDot = (c) =>
    `<span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,${esc(c.colors[0])} 50%,${esc(c.colors[1])} 50%);border:1px solid #243042;vertical-align:middle;flex:none"></span>`;
  const errBox = () =>
    ED.err && ED.err.length
      ? `<div class="tiny" style="color:#f87171;margin:10px 0;line-height:1.5">${ED.err
          .slice(0, 6)
          .map((e) => `• ${esc(e)}`)
          .join('<br>')}</div>`
      : '';

  // ---------- Find, changes and checks as you type ----------
  // A search over the whole world from the home screen: clubs (name, short name, city, nickname), leagues and nations
  const homeFind = (q) => {
    q = q.trim().toLowerCase();
    if (!q) return '';
    const clubs = ED.def.clubs
      .filter((c) => [c.name, c.short, c.city, c.nick].some((x) => (x || '').toLowerCase().includes(q)))
      .sort((a, b) => b.rep - a.rep);
    const leagues = ED.def.leagues.filter(
      (l) => l.name.toLowerCase().includes(q) || (natOf(l).name || '').toLowerCase().includes(q),
    );
    const lg = (l) =>
      `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edView" data-v="league" data-lid="${esc(l.id)}"><div class="row"><div class="grow"><div class="small b">${natOf(l).flag} ${esc(l.name)}</div><div class="tiny dim">Tier ${l.tier} · ${U.plural(clubsOf(l.id).length, 'club')}</div></div><span class="dim">›</span></div></div>`;
    const club = (c) =>
      `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edView" data-v="club" data-cid="${esc(c.id)}" data-lid="${esc(c.league)}"><div class="row" style="gap:10px">${crestDot(c)}<div class="grow"><div class="small b">${esc(c.name)}</div><div class="tiny dim">${esc((leagueOf(c.league) || {}).name || '')} · ${stars(c.rep)}</div></div><span class="dim">›</span></div></div>`;
    const players = (ED.def.players || []).filter((p) => `${p.fn} ${p.ln}`.toLowerCase().includes(q)).slice(0, 10);
    const comps = [
      ...D.DOMESTIC_CUPS.map(([, , name]) => name),
      ...(ED.def.competitions || []).map((c) => c.name),
    ].filter((n, i, a) => n && n.toLowerCase().includes(q) && a.indexOf(n) === i);
    const player = (p) =>
      `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edFindPlayer" data-pid="${esc(p.id)}" data-cid="${esc(p.club || FREE)}"><div class="row"><div class="grow"><div class="small b">${esc(p.fn)} ${esc(p.ln)}</div><div class="tiny dim">${esc(p.pos)} · ${esc((ED.def.clubs.find((c) => c.id === p.club) || {}).name || 'free agent')}</div></div><span class="dim">›</span></div></div>`;
    const cup = (n) =>
      `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edView" data-v="cups"><div class="row"><div class="grow"><div class="small b">🏆 ${esc(n)}</div><div class="tiny dim">Cup</div></div><span class="dim">›</span></div></div>`;
    if (!clubs.length && !leagues.length && !players.length && !comps.length)
      return '<div class="empty">Nothing matches.</div>';
    return `${leagues.slice(0, 8).map(lg).join('')}${comps.slice(0, 6).map(cup).join('')}${players.map(player).join('')}${clubs.slice(0, 12).map(club).join('')}${clubs.length > 12 ? `<div class="tiny dim" style="margin:4px 0">${clubs.length - 12} more: type more of the name.</div>` : ''}`;
  };
  // What changed since the editor opened, club by club and field by field, each with the value it had
  const CLUB_FIELDS = [
    ['name', 'Name'],
    ['short', 'Short name'],
    ['nick', 'Nickname'],
    ['city', 'City'],
    ['colors', 'Colours'],
    ['identity', 'Identity'],
    ['rep', 'Reputation'],
    ['league', 'League'],
    ['founded', 'Founded'],
    ['stadium.name', 'Ground'],
    ['stadium.cap', 'Capacity'],
    ['policy', 'Signing rule'],
  ];
  const pathGet = (o, p) => p.split('.').reduce((x, k) => (x == null ? x : x[k]), o);
  const showVal = (k, v) =>
    v == null || v === ''
      ? 'none'
      : k === 'colors'
        ? v.join(' / ')
        : k === 'stadium.cap'
          ? Number(v).toLocaleString('en')
          : k === 'league'
            ? (leagueOf(v) || {}).name || v
            : k === 'policy'
              ? `only ${v.label}`
              : String(v);
  const changesList = () => {
    const out = [];
    const start = (ED.start && ED.start.clubs) || [];
    for (const c of ED.def.clubs) {
      const s = start.find((x) => x.id === c.id);
      if (!s) {
        out.push({ text: `${c.name}: a club you added`, kind: 'added', cid: c.id });
        continue;
      }
      for (const [k, label] of CLUB_FIELDS) {
        const a = pathGet(s, k),
          b = pathGet(c, k);
        const same = (v) => (k === 'colors' ? JSON.stringify(v ?? null).toLowerCase() : JSON.stringify(v ?? null));
        if (same(a) !== same(b))
          out.push({ text: `${s.name}: ${label} ${showVal(k, a)} → ${showVal(k, b)}`, cid: c.id, k });
      }
    }
    for (const s of start)
      if (!ED.def.clubs.some((c) => c.id === s.id))
        out.push({ text: `${s.name}: taken out of the world`, kind: 'putback', cid: s.id });
    for (const l of ED.def.leagues) {
      const s = ((ED.start && ED.start.leagues) || []).find((x) => x.id === l.id);
      if (!s) continue;
      for (const [k, label] of [
        ['name', 'Name'],
        ['short', 'Short name'],
      ])
        if (s[k] !== l[k])
          out.push({
            text: `${s.name}: league ${label.toLowerCase()} ${s[k]} → ${l[k]}`,
            kind: 'league',
            lid: l.id,
            k,
          });
    }
    for (const k of Object.keys(ED.def.rules || {}))
      if (JSON.stringify(ED.def.rules[k]) !== JSON.stringify(((ED.start && ED.start.rules) || {})[k]))
        out.push({
          text: `World rule ${k}: ${JSON.stringify(((ED.start && ED.start.rules) || {})[k])} → ${JSON.stringify(ED.def.rules[k])}`,
          kind: 'rule',
          k,
        });
    // cups and competitions, and managers: by id, each put back as it was
    const byId = (list, key) => new Map((list || []).map((x) => [key(x), x]));
    for (const [coll, key, label, nameOf] of [
      ['competitions', (x) => x.id, 'competition', (x) => x.name || x.id],
      ['staff', (x) => x.id, 'coach or scout', (x) => `${x.fn || ''} ${x.ln || ''}`.trim() || x.id],
      ['nations', (x) => x.code, 'national team', (x) => x.name || x.code],
      ['history.seasons', (x) => x.year, 'past season', (x) => `Season ${x.label || x.year}`],
      [
        'managers',
        (x) => x.club,
        'manager',
        (x) => `${(ED.def.clubs.find((c) => c.id === x.club) || {}).name || x.club}: manager ${x.fn} ${x.ln}`,
      ],
    ]) {
      const was = byId(pathGet(ED.start, coll), key),
        now = byId(pathGet(ED.def, coll), key);
      for (const [id, x] of now) {
        const s = was.get(id);
        if (!s) out.push({ text: `${nameOf(x)}: ${label} added`, kind: 'item', coll, id });
        else if (JSON.stringify(s) !== JSON.stringify(x))
          out.push({ text: `${nameOf(x)}: ${label} changed`, kind: 'item', coll, id });
      }
      for (const [id, s] of was)
        if (!now.has(id)) out.push({ text: `${nameOf(s)}: ${label} removed`, kind: 'item', coll, id });
    }
    if (JSON.stringify(ED.def.calendar || null) !== JSON.stringify(ED.start.calendar || null))
      out.push({ text: 'The season calendar changed', kind: 'calendar' });
    // players: one by one while there are few, else as a whole
    const sig = (p) =>
      [
        p.fn,
        p.ln,
        p.nat,
        p.born,
        p.pos,
        p.foot,
        p.club,
        p.contract,
        p.pa,
        p.callup ? 1 : 0,
        ...Object.values(p.attrs || {}),
      ].join('|');
    const wasP = byId(ED.start.players, (p) => p.id),
      nowP = byId(ED.def.players, (p) => p.id);
    const pch = [];
    for (const [id, p] of nowP) {
      const s = wasP.get(id);
      if (!s) pch.push({ text: `${p.fn} ${p.ln}: a player you made`, kind: 'item', coll: 'players', id });
      else if (s !== p && sig(s) !== sig(p))
        pch.push({ text: `${p.fn} ${p.ln}: player changed`, kind: 'item', coll: 'players', id });
    }
    for (const [id, s] of wasP)
      if (!nowP.has(id)) pch.push({ text: `${s.fn} ${s.ln}: player removed`, kind: 'item', coll: 'players', id });
    if (pch.length <= 40) out.push(...pch);
    else out.push({ text: `Players made or changed: ${pch.length} of them`, kind: 'players' });
    return out;
  };
  const changeSummary = () => {
    const n = changesList().length;
    return n ? `${n} change${n === 1 ? '' : 's'} since you opened the editor` : 'nothing changed yet';
  };
  // Undo of the changes that are not a club's field: a league's name, a world rule, the players, a club put back or taken out again
  UI.acts.edUndoMore = (d) => {
    const st = ED.start;
    if (d.kind === 'league') {
      const l = leagueOf(d.lid),
        s = st.leagues.find((x) => x.id === d.lid);
      if (l && s) l[d.k] = s[d.k];
    } else if (d.kind === 'rule') {
      if (st.rules[d.k] === undefined) delete ED.def.rules[d.k];
      else ED.def.rules[d.k] = clone(st.rules[d.k]);
    } else if (d.kind === 'item') {
      const key = { managers: 'club', nations: 'code', 'history.seasons': 'year' }[d.coll] || 'id';
      const parts = d.coll.split('.'),
        last = parts.pop();
      const holder = parts.reduce((o, k) => o[k], ED.def);
      const arr = (holder[last] = holder[last] || []);
      const i = arr.findIndex((x) => String(x[key]) === String(d.id)),
        s = (pathGet(st, d.coll) || []).find((x) => String(x[key]) === String(d.id));
      if (i >= 0) arr.splice(i, 1);
      if (s) arr.push(clone(s));
    } else if (d.kind === 'calendar') {
      if (st.calendar === undefined) delete ED.def.calendar;
      else ED.def.calendar = clone(st.calendar);
    } else if (d.kind === 'players') {
      ED.def.players = clone(st.players || []);
      ED.def.meta.players = st.meta.players;
    } else if (d.kind === 'putback') {
      const s = st.clubs.find((x) => x.id === d.cid);
      if (s && !ED.def.clubs.some((c) => c.id === d.cid)) ED.def.clubs.push(clone(s));
      ED.def.removeClubs = (ED.def.removeClubs || []).filter((id) => id !== d.cid);
    } else if (d.kind === 'added') {
      dropClub(d.cid);
    }
    ED.err = [];
    UI.worldEditor();
  };
  UI.acts.edUndo = (d) => {
    const s = ED.start.clubs.find((x) => x.id === d.cid),
      c = ED.def.clubs.find((x) => x.id === d.cid);
    if (!s || !c) return;
    const k = d.k;
    const patch = k.startsWith('stadium.')
      ? { stadium: { ...c.stadium, [k.slice(8)]: pathGet(s, k) } }
      : k === 'league'
        ? { league: s.league, nat: s.nat }
        : { [k]: clone(s[k]) };
    const r = WD.editor(ED.def, null).setClub(d.cid, patch);
    ED.err = r.ok ? [] : r.errors;
    UI.worldEditor();
  };
  const changesView = () => {
    const list = changesList();
    return `<div class="h1" style="margin-top:2vh">Changes made</div><div class="tag">Everything you changed since you opened the editor, with the value it had. Undo puts a single change back.</div>
      ${errBox()}
      ${
        list.length
          ? list
              .map(
                (x) =>
                  `<div class="card" style="margin:4px 0;padding:10px 12px"><div class="row" style="gap:10px"><div class="grow small">${esc(x.text)}</div>${x.kind ? `<button class="btn sm" data-act="edUndoMore" data-kind="${x.kind}" data-coll="${esc(x.coll || '')}" data-id="${esc(x.id || '')}" data-cid="${esc(x.cid || '')}" data-lid="${esc(x.lid || '')}" data-k="${esc(x.k || '')}">Undo</button>` : x.k ? `<button class="btn sm" data-act="edUndo" data-cid="${esc(x.cid)}" data-k="${esc(x.k)}">Undo</button>` : ''}</div></div>`,
              )
              .join('')
          : '<div class="empty">Nothing changed yet.</div>'
      }
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="home" aria-label="Back">←</button></div>`;
  };
  // Problems with a club, found as you type: a name or short name another club of the league has, a nickname that names a colour
  // the kit does not have, home and away colours too alike to tell apart
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(String(h).slice(i, i + 2), 16) || 0);
  // The same for a league (a name another league of the country has, a rude word) and a player (a rude name, a potential below his
  // ability, an age the game does not have)
  const leagueWarn = (l) => {
    const name = String((($('#ed-lname') || {}).value ?? l.name) || '').trim();
    const w = [];
    if (
      name &&
      ED.def.leagues.some((x) => x.id !== l.id && x.nat === l.nat && x.name.toLowerCase() === name.toLowerCase())
    )
      w.push('Another league of this country has the same name.');
    if (D.isRude(name)) w.push('That name is one the game will not use: it contains a rude word.');
    if (clubsOf(l.id).length < 8) w.push(`A league needs at least eight clubs; this one has ${clubsOf(l.id).length}.`);
    return w.length
      ? `<div class="tiny" style="color:#fbbf24;margin:6px 0;line-height:1.5">${w.map((x) => `⚠️ ${esc(x)}`).join('<br>')}</div>`
      : '';
  };
  const playerWarn = (p) => {
    const v = (id, d) => ($('#ed-' + id) || {}).value ?? d;
    const fn = String(v('fn', p.fn || '')).trim(),
      ln = String(v('ln', p.ln || '')).trim();
    const w = [];
    if (D.isRude(fn) || D.isRude(ln)) w.push('That name is one the game will not use: it contains a rude word.');
    const attrs = D.ATTRS.map((k) => +v('a-' + k, p.attrs[k]));
    const pos = v('pos', p.pos);
    const ca = abilityOf(Object.fromEntries(D.ATTRS.map((k, i) => [k, attrs[i]])), pos);
    if (+v('pa', p.pa) < ca) w.push(`His potential is below his ability (${ca}): the game raises it to match.`);
    const age = yearOf() - (+v('born', p.born) || p.born);
    if (age < 15 || age > 44) w.push(`An age of ${age} is outside what the game plays (15 to 44).`);
    return w.length
      ? `<div class="tiny" style="color:#fbbf24;margin:6px 0;line-height:1.5">${w.map((x) => `⚠️ ${esc(x)}`).join('<br>')}</div>`
      : '';
  };
  const clubWarn = (c) => {
    const v = (id, d) => ($('#ed-' + id) || {}).value ?? d;
    const name = String(v('name', c.name)).trim(),
      short = String(v('short', c.short || ''))
        .trim()
        .toUpperCase(),
      nick = String(v('nick', c.nick || '')).trim(),
      cols = [v('c1', c.colors[0]), v('c2', c.colors[1])],
      lg = v('league', c.league) || c.league;
    const others = ED.def.clubs.filter((x) => x.id !== c.id && x.league === lg);
    const w = [];
    if (name && others.some((x) => x.name.toLowerCase() === name.toLowerCase()))
      w.push('Another club of this league has the same name.');
    if (short && others.some((x) => (x.short || '').toUpperCase() === short))
      w.push(`Another club of this league is already "${short}".`);
    if (D.isRude(name) || D.isRude(short)) w.push('That name is one the game will not use: it contains a rude word.');
    if (nick && FM.W.nickClash(nick, cols)) w.push(`The nickname "${nick}" names a colour the kit does not have.`);
    const [a, b] = [rgb(cols[0]), rgb(cols[1])];
    if (Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 60) w.push('The two colours are too alike to tell apart.');
    return w.length
      ? `<div class="tiny" style="color:#fbbf24;margin:6px 0;line-height:1.5">${w.map((x) => `⚠️ ${esc(x)}`).join('<br>')}</div>`
      : '';
  };

  // The home screen in five tabs, so a world of 64 leagues is not one long page
  const TABS = [
    ['world', 'World'],
    ['clubs', 'Clubs'],
    ['players', 'Players'],
    ['comp', 'Competitions'],
    ['history', 'History'],
  ];
  const hide = (k) => (ED.tab === k ? '' : 'display:none;');
  const BEYOND_TAB = {
    cups: 'comp',
    calendar: 'comp',
    staffhub: 'comp',
    intl: 'comp',
    library: 'history',
    history: 'history',
    changes: 'world',
  };
  UI.acts.edTab = (d) => {
    ED.tab = d.v;
    UI.worldEditor();
  };
  // A problem the checks found, as a row that opens the club or league it is about
  const problemRow = (e) => {
    const cm = /\b(c_[A-Za-z0-9_]+)/.exec(e),
      c = cm && ED.def.clubs.find((x) => x.id === cm[1]);
    const lm = !c && /\bleague "?([A-Za-z0-9_]+)/.exec(e),
      l = lm && leagueOf(lm[1]);
    const go = c
      ? `data-act="edView" data-v="club" data-cid="${esc(c.id)}" data-lid="${esc(c.league)}"`
      : l
        ? `data-act="edView" data-v="league" data-lid="${esc(l.id)}"`
        : '';
    return go
      ? `<div class="tap" ${go} style="padding:3px 0">• ${esc(e)} <span class="dim">›</span></div>`
      : `<div style="padding:3px 0">• ${esc(e)}</div>`;
  };
  const homeView = () => {
    const s = status(),
      m = ED.def.meta;
    const nations = [...new Set(ED.def.leagues.map((l) => l.nat))];
    const bad = s.chk.errors.length;
    return `<div class="h1" style="margin-top:3vh">World editor</div><div class="tag">Change the clubs and leagues your world starts from. Nothing changes in the game until you use the world.</div>
      <div class="seg" style="margin:10px 0 0;overflow-x:auto">${TABS.map(([k, t]) => `<button class="${ED.tab === k ? 'on' : ''}" data-act="edTab" data-v="${k}">${t}</button>`).join('')}</div>
      <div style="${hide('world')}">
      <div class="ng-label">Name of this world</div><input type="text" id="ed-wname" maxlength="40" value="${esc(m.name || '')}">
      <div class="ng-label">Author</div><input type="text" id="ed-wauthor" maxlength="40" value="${esc(m.author || '')}">
      <div class="ng-label">Description</div><input type="text" id="ed-wdesc" maxlength="120" value="${esc(m.description || '')}">
      <div class="ng-names"><div style="flex:1"><div class="ng-label">Version</div><input type="text" id="ed-wver" maxlength="12" placeholder="1.0" value="${esc(m.version || '')}"></div><div style="flex:2"><div class="ng-label">Licence</div><input type="text" id="ed-wlic" maxlength="60" placeholder="e.g. CC BY-SA 4.0" value="${esc(m.license || '')}"></div></div>
      <div class="ng-label">Credits and sources <span class="tiny dim">· who made it, where real data came from; who is responsible for what it says</span></div><input type="text" id="ed-wcred" maxlength="200" value="${esc(m.credits || '')}">
      <div class="small" style="margin-top:14px;color:${bad ? '#f87171' : '#c8ff3d'}">${bad ? `⚠️ ${bad} problem${bad > 1 ? 's' : ''} to fix` : '✅ Ready to use'} <span style="color:#9fb0c5">· ${s.changed} club${s.changed === 1 ? '' : 's'} changed${s.added ? `, ${s.added} added` : ''}${s.leaguesAdded ? ` · ${s.leaguesAdded} league${s.leaguesAdded === 1 ? '' : 's'} added` : ''}${s.leaguesChanged ? ` · ${s.leaguesChanged} league${s.leaguesChanged === 1 ? '' : 's'} changed` : ''}${(ED.def.removeClubs || []).length ? ` · ${ED.def.removeClubs.length} taken out` : ''}</span></div>
      ${
        bad
          ? `<div class="tiny" style="color:#9fb0c5;margin-top:6px;line-height:1.5">${s.chk.errors
              .slice(0, 5)
              .map(problemRow)
              .join('')}</div>`
          : ''
      }
      ${errBox()}
      <div class="ng-label">Rules <span class="tiny dim">· for every league and cup; each can have its own on its screen</span></div>
      ${[
        [
          'win',
          'Points for a win',
          [
            [3, '3'],
            [2, '2'],
          ],
        ],
        [
          'subs',
          'Substitutions',
          [
            [3, '3'],
            [5, '5'],
            [7, '7'],
          ],
        ],
        [
          'twoLegs',
          'Two-legged knockouts',
          [
            [true, 'Yes'],
            [false, 'No'],
          ],
        ],
        ...(ED.def.rules.twoLegs
          ? [
              [
                'awayGoals',
                'Away goals count',
                [
                  [false, 'No'],
                  [true, 'Yes'],
                ],
              ],
            ]
          : []),
      ]
        .map(
          ([k, label, opts]) =>
            `<div class="tiny dim" style="margin:8px 0 4px">${label}</div><div class="seg" style="margin:0">${opts
              .map(
                ([v, t]) =>
                  `<button class="${ED.def.rules[k] === v ? 'on' : ''}" data-act="edRule" data-k="${k}" data-v="${v}">${t}</button>`,
              )
              .join('')}</div>`,
        )
        .join('')}
      <div class="ng-label">Catalonia and the Basque Country <span class="tiny dim">· as nations of their own: players of Catalan or Basque family can choose them, and they field national teams</span></div>
      <div class="seg" style="margin:0">${[
        [false, 'Part of Spain'],
        [true, 'Nations'],
      ]
        .map(
          ([v, t]) =>
            `<button class="${!!ED.def.rules.regionNations === v ? 'on' : ''}" data-act="edRule" data-k="regionNations" data-v="${v}">${t}</button>`,
        )
        .join('')}</div>
      <div class="ng-label">Promotion and relegation <span class="tiny dim">· for every league; each pair of leagues has its own switch too</span></div>
      ${segV('edWorldProRel', ED.def.rules.proRel === false ? 'off' : 'on', [
        ['on', 'On'],
        ['off', 'Off: closed leagues'],
      ])}
      </div>
      ${[
        ['cups', '🏆 Cups', `${(ED.def.competitions || []).length} changed · names, formats and rules`],
        ['calendar', '📅 Season calendar', calendarSummary()],
        ['library', '📚 Library, files and packs', 'worlds kept on this device, files, and club data packs'],
        [
          'staffhub',
          '🧑‍🏫 Staff, managers and agents',
          `${(ED.def.staff || []).length} coaches and scouts · ${U.plural((ED.def.managers || []).length, 'manager')}`,
        ],
        ['intl', '🌍 International football', `tournaments, national teams and their history`],
        [
          'history',
          '📜 History',
          `${ED.def.history.seasons.length} past season${ED.def.history.seasons.length === 1 ? '' : 's'}`,
        ],
        ['changes', '📝 Changes made', changeSummary()],
      ]
        .map(
          ([v, t, s]) =>
            `<div class="card tap" style="margin:6px 0;padding:10px 12px;${hide(BEYOND_TAB[v])}" data-act="${v === 'library' ? 'edLibrary' : 'edView'}" data-v="${v}"><div class="row"><div class="grow"><div class="small b">${t}</div><div class="tiny dim">${s}</div></div><span class="dim">›</span></div></div>`,
        )
        .join('')}
      <div style="${hide('players')}">
      <div class="ng-label">Players you make</div>
      <div class="seg" style="margin:0">${[
        ['overlay', 'Add to the squads'],
        ['replace', 'Replace squads of 11+'],
      ]
        .map(
          ([k, t]) =>
            `<button class="${m.players === k ? 'on' : ''}" data-act="edSquadMode" data-v="${k}">${t}</button>`,
        )
        .join('')}</div>
      <div class="tiny dim" style="margin-top:6px;line-height:1.5">${(ED.def.players || []).length} player${(ED.def.players || []).length === 1 ? '' : 's'} made so far. Open a club, then Players.</div>
      ${squadsCard()}
      <div class="card tap" style="margin:12px 0 0;padding:10px 12px" data-act="edImportPlayers" data-from="home"><div class="row"><div class="grow"><div class="small b">⬇️ Import players from a file</div><div class="tiny dim">A spreadsheet of real players' numbers, turned into players of your world</div></div><span class="dim">›</span></div></div>
      <div class="card tap" style="margin:12px 0 0;padding:10px 12px" data-act="edSquad" data-cid="${FREE}"><div class="row"><div class="grow"><div class="small b">🆓 Free agents</div><div class="tiny dim">${playersOf(FREE).length} made</div></div><span class="dim">›</span></div></div>
      </div>
      <div style="${hide('clubs')}">
      <div class="ng-label">Find</div><div class="ng-find"><input type="search" id="ed-hq" placeholder="Find a club, league or nation" value="${esc(ED.hq || '')}" autocomplete="off"></div>
      <div id="ed-hres">${homeFind(ED.hq || '')}</div>
      <div class="ng-label">Leagues — tap one to edit its clubs</div>
      ${nations
        .map((nat) => {
          const n = D.NATIONS[nat] || { flag: '', name: nat };
          return `<div class="tiny" style="color:#9fb0c5;margin:12px 0 4px">${n.flag} ${esc(n.name)}</div>${ED.def.leagues
            .filter((l) => l.nat === nat)
            .map(
              (l) =>
                `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edView" data-v="league" data-lid="${esc(l.id)}"><div class="row"><div class="grow"><div class="small b">${esc(l.name)}</div><div class="tiny dim">Tier ${l.tier} · ${U.plural(clubsOf(l.id).length, 'club')}</div></div><span class="dim">›</span></div></div>`,
            )
            .join('')}`;
        })
        .join('')}
      <div class="actions" style="margin-top:16px"><button class="btn sm" data-act="edNewLeague">＋ Add a league</button><button class="btn sm" data-act="edReset">Start again from the built-in world</button></div>
      </div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edClose" aria-label="Back">←</button><button class="btn sm" data-act="edExport">⬆️ Save as file</button><button class="btn sm pri grow" data-act="edUse">Use this world</button></div>`;
  };

  // ---------- League rules and new leagues ----------
  const CONT = { EUR: 'CC', ENG: 'CC', SAM: 'CL', ASIA: 'AC', AFR: 'AF', NAM: 'NC' };
  const upperOf = (l) => ED.def.leagues.find((x) => x.nat === l.nat && x.tier === l.tier - 1);
  const removedHere = (lid) => {
    const list = (ED.def.removeClubs || []).map((id) => builtIn().get(id)).filter((c) => c && c.league === lid);
    return list.length
      ? `<div class="ng-label">Taken out of this league</div>${list
          .map(
            (c) =>
              `<div class="row" style="gap:10px;margin:4px 0">${crestDot(c)}<div class="grow small">${esc(c.name)}</div><button class="btn sm" data-act="edRestoreClub" data-cid="${esc(c.id)}">Put back</button></div>`,
          )
          .join('')}`
      : '';
  };
  const segN = (act, cur, vals) =>
    `<div class="seg" style="margin:0">${vals.map((n) => `<button class="${cur === n ? 'on' : ''}" data-act="${act}" data-n="${n}">${n || 'None'}</button>`).join('')}</div>`;
  // How the pair of leagues is linked: n clubs go up and down; a play-off for one more place (four clubs); or a relegation play-off
  const pairOf = (l, up) => {
    const r = l.rules || {},
      p = r.promote && r.promote.to === up.id ? r.promote : null;
    return {
      n: p ? p.auto || 0 : 0,
      mode: !p ? 'auto' : p.playoff ? 'playoff' : p.tie ? 'reltie' : 'auto',
      legs: (p && p.finalLegs) || 1,
    };
  };
  const setPair = (l, up, { n, mode, legs }) => {
    const was = [clone(l.rules || {}), clone(up.rules || {})];
    l.rules = l.rules || {};
    up.rules = up.rules || {};
    if (n) {
      l.rules.promote = {
        to: up.id,
        auto: n,
        ...(mode === 'playoff' ? { playoff: [n + 1, n + 4], finalLegs: legs } : mode === 'reltie' ? { tie: true } : {}),
      };
      up.rules.relegate = { to: l.id, n, ...(mode === 'reltie' ? { playoff: true } : {}) };
    } else {
      delete l.rules.promote;
      delete up.rules.relegate;
    }
    const errs = [...WD.validateLeagueRules(l, ED.def), ...WD.validateLeagueRules(up, ED.def)];
    if (errs.length) {
      l.rules = was[0];
      up.rules = was[1];
    }
    ED.err = errs;
  };
  const tbKey = (l) => ((l.rules && l.rules.tiebreak) || D.TIEBREAK[l.id] || D.TIEBREAK_DEFAULT).join();
  const leagueFormat = (l) => {
    const r = l.rules || {},
      fixed = r.split || r.zones || r.conferences || r.rounds || r.torneos;
    const canSplit = !(r.zones || r.conferences || r.torneos || r.rounds || r.legs);
    const n = clubsOf(l.id).length,
      sp = r.split;
    const splitBox = !canSplit
      ? ''
      : !sp
        ? `<div class="ng-label">Split</div><div class="tiny dim" style="line-height:1.5">After the regular season the table can divide into groups (a championship group and a relegation group, say) that play each other again.</div><div class="actions" style="margin-top:6px"><button class="btn sm" data-act="edSplitOn">Split this league</button></div>`
        : `<div class="ng-label">Split <span class="tiny dim">· ${U.plural(n, 'club')}</span></div>
      <div class="ng-names" style="margin-top:0"><div style="flex:1"><div class="tiny dim">Regular season rounds</div><input type="number" id="ed-spa" min="${Math.max(1, n - 1)}" max="${3 * Math.max(1, n - 1)}" inputmode="numeric" value="${sp.after}"></div><div style="flex:1"><div class="tiny dim">Points at the split</div><select id="ed-sph"><option value="no" ${sp.halve ? '' : 'selected'}>Carry over</option><option value="yes" ${sp.halve ? 'selected' : ''}>Halved</option></select></div></div>
      ${sp.groups
        .map(
          (g, i) =>
            `<div class="ng-names" style="margin-top:6px"><input type="text" id="ed-spn-${i}" maxlength="24" value="${esc(sp.names[i] || '')}"><input type="number" id="ed-spg-${i}" min="2" max="${n}" inputmode="numeric" style="max-width:70px" value="${g}" aria-label="Clubs"><select id="ed-spr-${i}" style="max-width:120px">${[
              ['single', 'Once each'],
              ['double', 'Home and away'],
              ['none', 'No more games'],
            ]
              .map(([k, t]) => `<option value="${k}" ${sp.rounds[i] === k ? 'selected' : ''}>${t}</option>`)
              .join('')}</select></div>`,
        )
        .join('')}
      <div class="tiny dim" style="margin:6px 0 4px">Groups (from the top of the table down)</div>${segV(
        'edSplitN',
        sp.groups.length,
        [
          [2, 'Two'],
          [3, 'Three'],
          [4, 'Four'],
        ],
      )}
      <div class="actions" style="margin-top:8px"><button class="btn sm" data-act="edSplitOff">No split</button></div>`;
    const opts = WD.TIEBREAKS.slice();
    if (!opts.some(([k]) => k.join() === tbKey(l))) opts.push([tbKey(l).split(','), 'As the game has it']);
    return `${splitBox}<div class="ng-label">Matches</div>${
      fixed && !canSplit
        ? '<div class="tiny dim" style="line-height:1.5">This league has a format of its own (zones or conferences), set under League structure below.</div>'
        : r.split
          ? '<div class="tiny dim" style="line-height:1.5">A split league plays its regular season home and away.</div>'
          : segV('edLegs', r.legs || 2, [
              [2, 'Home and away'],
              [1, 'Once each'],
            ])
    }
      <div class="ng-label">Level on points</div><select id="ed-tb">${opts
        .map(([k, t]) => `<option value="${k.join()}" ${k.join() === tbKey(l) ? 'selected' : ''}>${esc(t)}</option>`)
        .join('')}</select>
      <div class="ng-label">Simulation</div><select id="ed-lsim">${[
        ['full', 'Full: every match played out'],
        ['light', 'Light: results from the engine, less detail'],
        ['minimal', 'Minimal: quick results'],
      ]
        .map(([k, t]) => `<option value="${k}" ${(l.sim || 'full') === k ? 'selected' : ''}>${esc(t)}</option>`)
        .join('')}</select>
      <div class="ng-label">Strength <span class="tiny dim">· the reputation its clubs drift between (top, bottom)</span></div>
      <div class="ng-names" style="margin-top:0"><input type="number" id="ed-lhigh" min="20" max="99" inputmode="numeric" value="${(l.repBand || [70, 45])[0]}"><input type="number" id="ed-llow" min="20" max="99" inputmode="numeric" value="${(l.repBand || [70, 45])[1]}"></div>`;
  };
  const segV = (act, cur, vals) =>
    `<div class="seg" style="margin:0">${vals.map(([v, t]) => `<button class="${cur === v ? 'on' : ''}" data-act="${act}" data-v="${v}">${t}</button>`).join('')}</div>`;
  // The rules a competition plays by where they differ from the world's: a choice for each, "As the world has it" being none
  const playSeg = (act, k, cur, vals, extra = '', first = 'As the world') =>
    `<div class="seg" style="margin:0">${[['', first]]
      .concat(vals)
      .map(
        ([v, t]) =>
          `<button class="${String(cur ?? '') === String(v) ? 'on' : ''}" data-act="${act}" data-k="${k}" data-v="${v}" ${extra}>${t}</button>`,
      )
      .join('')}</div>`;
  const worldRule = (k) => ED.def.rules[k];
  const leaguePlay = (l) => {
    const r = l.rules || {},
      p = r.play || {},
      sq = r.squad || {},
      game = FM.Reg.RULES[l.id] || {};
    const KEY = { listSize: 'squad', homegrown: 'hg' };
    const gameVal = (k) => game[KEY[k] || k];
    const gameText = (k, unit = '') => `the game has ${gameVal(k) ? gameVal(k) + unit : 'none'}`;
    const lbl = (t, extra = '') =>
      `<div class="tiny dim" style="margin:10px 0 4px">${t}${extra ? ` <span>(${extra})</span>` : ''}</div>`;
    const reg = (k, label, vals) =>
      `${lbl(label, gameText(k))}${playSeg('edPlaySquad', k, sq[k], [[0, 'None'], ...vals.map((n) => [n, String(n)])], '', 'As the game')}`;
    const flag = (k, label, on, off) =>
      `${lbl(label, game[KEY[k] || k] ? 'the game has it on' : 'the game has it off')}${playSeg(
        'edPlaySquad',
        k,
        sq[k],
        [
          [true, on],
          [false, off],
        ],
        '',
        'As the game',
      )}`;
    const exempt = sq.exempt || game.exempt || [];
    const nations = natEntries().sort((a, b) => a[1].name.localeCompare(b[1].name));
    const mls = sq.mls != null ? sq.mls : game.mls;
    const poType = (r.playoffs || {}).type;
    const poBuiltIn = (D.LEAGUES.find((x) => x.id === l.id) || { rules: {} }).rules.playoffs;
    const fixedFormat = r.zones || r.conferences;
    const n = clubsOf(l.id).length;
    const exp = (ED.def.expansion || {})[l.id];
    return `<div class="ng-label">Rules of this league <span class="tiny dim">· the world has ${worldRule('win')} points for a win and ${worldRule('subs')} substitutes</span></div>
      ${lbl('Points for a win')}${playSeg('edPlay', 'win', p.win, [
        [2, '2'],
        [3, '3'],
      ])}
      ${lbl('Substitutes')}${playSeg('edPlay', 'subs', p.subs, [
        [3, '3'],
        [5, '5'],
        [7, '7'],
      ])}
      ${lbl('Matches a club plays', r.rounds ? `${r.rounds} set` : `${(n % 2 ? n : n - 1) * (r.legs === 1 ? 1 : 2)} in a full season`)}
      <div class="row" style="gap:6px"><input type="number" id="ed-lrounds" min="1" max="${4 * Math.max(1, n - 1)}" inputmode="numeric" placeholder="Full season" value="${r.rounds || ''}" style="flex:1"><button class="btn sm" data-act="edRounds">Set</button></div>
      <div class="ng-label">League structure</div>
      ${segV('edStructure', r.zones ? 'zones' : r.conferences ? 'conf' : 'single', [
        ['single', 'One table'],
        ['zones', 'Two zones'],
        ['conf', 'Two conferences'],
      ])}
      ${structureBox(l, r)}
      ${
        fixedFormat
          ? ''
          : `${lbl('Title play-off', poBuiltIn ? `the game has a ${poBuiltIn.type} play-off` : 'the game has none')}${playSeg(
              'edFormat',
              'playoffs',
              poType || (poBuiltIn ? '' : 'none'),
              [
                ['none', 'None'],
                ['finals6', 'Finals series: the top six'],
                ['liguilla', 'Liguilla: the top ten'],
              ],
              '',
              'As the game',
            )}
        ${lbl('Two tournaments a year', r.torneos ? `${r.torneos.join(' and ')}` : 'one table')}${segV(
          'edTorneos',
          r.torneos ? 'on' : 'off',
          [
            ['off', 'One table'],
            ['on', 'Apertura and Clausura'],
          ],
        )}
        <div class="tiny dim" style="margin-top:4px;line-height:1.5">Two tournaments each play half the season and finish with the title play-off, so they need one.</div>`
      }
      <div class="ng-label">Registration rules <span class="tiny dim">· who a club may sign and field</span></div>
      <div class="tiny dim" style="line-height:1.5">${FM.Reg.describe(l.id).join(' ')}</div>
      ${reg('listSize', 'Squad list of players over 21', [20, 23, 25, 28])}
      ${sq.listSize || (game.squad && sq.listSize == null) ? reg('homegrown', 'Homegrown places on the list', [4, 6, 8, 10, 12]) : ''}
      ${flag('permit', 'Work permits for players from abroad', 'Needed', 'Not needed')}
      ${reg('nonEU', 'Players from outside the EU on the books', [2, 3, 4, 5, 6])}
      ${flag('quasi', 'Players from partner nations count as EU', 'They do', 'They do not')}
      ${reg('nonEUSign', 'Non-EU signings from abroad in a season', [1, 2, 3])}
      ${reg('foreign', 'Foreign players on the books', [3, 4, 5, 6, 8, 10, 12, 14])}
      ${reg('asian', 'Extra place only an Asian player can fill', [1, 2])}
      ${reg('asean', 'Extra place only a Southeast Asian player can fill', [1])}
      ${reg('matchday', 'Foreign players in a matchday squad', [3, 5, 9])}
      ${lbl('Nations that never count as foreign', 'the game has ' + (game.exempt ? game.exempt.join(', ') : 'none'))}
      <div class="chips" style="flex-wrap:wrap">${exempt
        .map(
          (c) =>
            `<button class="chip on" data-act="edExemptDel" data-c="${c}">${(D.NATIONS[c] || {}).flag || ''} ${esc((D.NATIONS[c] || { name: c }).name)} ✕</button>`,
        )
        .join('')}</div>
      <div class="row" style="gap:6px;margin-top:6px"><select data-input="edExemptAdd" style="flex:1;min-width:0"><option value="">Add a nation…</option>${nations
        .filter(([c]) => !exempt.includes(c))
        .map(([c, x]) => `<option value="${c}">${x.flag} ${esc(x.name)}</option>`)
        .join(
          '',
        )}</select>${sq.exempt ? '<button class="btn sm" data-act="edExemptReset">As the game</button>' : ''}</div>
      ${lbl('Salary budget', mls ? `${U.money(mls.cap)} over the ${mls.counted} biggest charges` : game.mls ? 'the game has one' : 'the game has none')}
      ${segV('edBudget', sq.mls === undefined ? 'game' : sq.mls ? 'on' : 'off', [
        ['game', 'As the game'],
        ['off', 'None'],
        ['on', 'A salary budget'],
      ])}
      ${
        sq.mls
          ? `<div class="ng-names" style="margin-top:6px">${[
              ['cap', 'Budget (M a year)', sq.mls.cap / 1e6, 0.5],
              ['maxCharge', 'Max charge (K)', sq.mls.maxCharge / 1e3, 10],
              ['dp', 'Designated players', sq.mls.dp, 1],
              ['roster', 'Roster size', sq.mls.roster, 1],
              ['counted', 'Charges counted', sq.mls.counted, 1],
            ]
              .map(
                ([k, t, v, st]) =>
                  `<div style="flex:1;min-width:80px"><div class="tiny dim">${t}</div><input type="number" id="ed-mls-${k}" step="${st}" min="0" inputmode="decimal" value="${v}"></div>`,
              )
              .join(
                '',
              )}</div><div class="actions" style="margin-top:6px"><button class="btn sm" data-act="edBudgetSave">Save the budget</button></div>`
          : ''
      }
      <div class="tiny dim" style="margin-top:6px;line-height:1.5">Registration rules apply where the world follows each league's own rules (the default), a setting of None takes a rule away, and a cup's own rules are on its screen.</div>
      <div class="ng-label">Expansion draft <span class="tiny dim">· for clubs that join this league</span></div>
      ${segV('edExp', exp ? 'on' : 'off', [
        ['off', 'No draft'],
        ['on', 'Draft from the others'],
      ])}
      ${
        exp
          ? `<div class="tiny dim" style="margin:8px 0 4px">The clubs that take part</div><div class="chips" style="flex-wrap:wrap">${clubsOf(
              l.id,
            )
              .slice()
              .sort((a, b) => b.rep - a.rep)
              .map(
                (c) =>
                  `<button class="chip ${exp.clubs.includes(c.id) ? 'on' : ''}" data-act="edExpClub" data-cid="${esc(c.id)}">${esc(c.short || c.name)}</button>`,
              )
              .join('')}</div>
        ${lbl('Players each of the others protects')}${seg(
          'edExpSet',
          exp.protect,
          [8, 10, 12, 15, 18].map((x) => [x, String(x)]),
          'data-k="protect"',
          'n',
        )}
        ${lbl('Most players one club can lose')}${seg(
          'edExpSet',
          exp.maxLoss,
          [1, 2, 3].map((x) => [x, String(x)]),
          'data-k="maxLoss"',
          'n',
        )}
        ${lbl('Players each new club drafts')}${seg(
          'edExpSet',
          exp.size,
          [14, 18, 20, 23, 25].map((x) => [x, String(x)]),
          'data-k="size"',
          'n',
        )}
        <div class="tiny dim" style="margin-top:6px;line-height:1.5">Each club that takes part picks in turn, the best player it can take (keeping a balanced squad), until it has that many; a club that loses a player signs a younger one. What the new club's own squad had is replaced, and players you made for it stay.</div>`
          : `<div class="tiny dim" style="margin-top:6px;line-height:1.5">A club you add to the league can start with players taken from the clubs already in it, as expansion teams do.</div>`
      }
      <div class="card tap" style="margin:12px 0 0;padding:10px 12px" data-act="edView" data-v="pins" data-lid="${esc(l.id)}"><div class="row"><div class="grow"><div class="small b">📌 Fixed fixtures</div><div class="tiny dim">${(r.pins || []).length ? `${r.pins.length} match${r.pins.length === 1 ? '' : 'es'} put on a matchday` : 'Put a derby or the opening day where you want it'}</div></div><span class="dim">›</span></div></div>`;
  };
  // Two zones (Argentina's format: the clubs split into two zones by reputation, two tournaments a year, a play-off of the top
  // eight of each zone) or two conferences (the American league's: a table of its own for each, cross-conference matches, seven
  // clubs a conference in the play-off, a college draft)
  const confCode = (id) => String(id).replace(/^c_/, '');
  const autoConfs = (l, names) => {
    const sorted = clubsOf(l.id)
      .slice()
      .sort((a, b) => b.rep - a.rep);
    const out = { [names[0]]: [], [names[1]]: [] };
    sorted.forEach((c, i) => out[names[i % 4 === 0 || i % 4 === 3 ? 0 : 1]].push(confCode(c.id)));
    return out;
  };
  const structureBox = (l, r) => {
    if (r.zones)
      return `<div class="tiny dim" style="margin-top:6px;line-height:1.5">The clubs split into two zones by reputation (best clubs spread across both). Each zone plays itself once and the other zone once, twice a year (${(r.torneos || []).join(' and ')}), and the top eight of each zone play off for the title. Needs at least sixteen clubs.</div>`;
    if (!r.conferences) return '';
    const names = Object.keys(r.conferences);
    const inOf = (c) => names.find((n) => r.conferences[n].includes(confCode(c.id)));
    return `<div class="ng-names" style="margin-top:8px">${names.map((n, i) => `<input type="text" id="ed-cn${i}" maxlength="20" value="${esc(n)}">`).join('')}</div>
      <div class="chips" style="flex-wrap:wrap;margin-top:6px">${clubsOf(l.id)
        .slice()
        .sort((a, b) => b.rep - a.rep)
        .map((c) => {
          const n = inOf(c);
          return `<button class="chip ${n === names[1] ? 'on' : ''}" data-act="edConfClub" data-cid="${esc(c.id)}">${esc(c.short || c.name)} · ${n ? esc(n.slice(0, 1)) : names[0].slice(0, 1) + '?'}</button>`;
        })
        .join('')}</div>
      <div class="tiny dim" style="margin-top:4px">${names.map((n) => `${esc(n)} ${r.conferences[n].filter((x) => clubsOf(l.id).some((c) => confCode(c.id) === x)).length}`).join(' · ')} · tap a club to move it to the other conference</div>
      <div class="actions" style="margin-top:6px"><button class="btn sm" data-act="edConfSplit">Split them by reputation again</button></div>
      <div class="tiny dim" style="margin:10px 0 4px">College draft rounds</div>${seg(
        'edConfDraft',
        (r.mls || {}).draftRounds || 0,
        [0, 1, 2, 3, 4].map((n) => [n, String(n)]),
        '',
        'n',
      )}
      <div class="tiny dim" style="margin-top:6px;line-height:1.5">Each conference plays a table of its own, a conference round-robin plus cross-conference matches (up to the matches a club plays, set above), and seven clubs a conference go to the play-off, which ends in a cup final. Each conference needs at least seven clubs.</div>`;
  };
  // the league's rules changed through a function; refused (with the reasons) when the league no longer validates
  const tryRules = (change) => {
    stashLeague();
    const l = leagueOf(ED.lid),
      was = clone(l.rules || {});
    l.rules = clone(l.rules || {});
    change(l.rules, l);
    const errs = WD.validateLeagueRules(l, ED.def);
    if (errs.length) l.rules = was;
    ED.err = errs;
    UI.worldEditor();
  };
  UI.acts.edStructure = (d) =>
    tryRules((r, l) => {
      const was = r.zones ? 'zones' : r.conferences ? 'conf' : 'single';
      if (d.v === was) return;
      if (was === 'zones') {
        delete r.zones;
        delete r.torneos;
        delete r.playoffs;
      }
      if (was === 'conf') {
        delete r.conferences;
        delete r.mls;
      }
      if (d.v === 'zones') {
        r.zones = true;
        r.torneos = ['Apertura', 'Clausura'];
        r.playoffs = { type: 'zones' };
        for (const k of ['split', 'legs', 'rounds']) delete r[k];
      } else if (d.v === 'conf') {
        r.conferences = autoConfs(l, ['East', 'West']);
        r.mls = { playoff: 7, draftRounds: 0 };
        for (const k of ['split', 'legs', 'torneos', 'playoffs']) delete r[k];
        r.rounds = r.rounds || 34;
      }
    });
  UI.acts.edConfClub = (d) =>
    tryRules((r) => {
      const names = Object.keys(r.conferences),
        code = confCode(d.cid);
      const from = names.find((n) => r.conferences[n].includes(code));
      const to = from === names[1] ? names[0] : names[1];
      if (from) r.conferences[from] = r.conferences[from].filter((x) => x !== code);
      r.conferences[to].push(code);
    });
  UI.acts.edConfSplit = () => tryRules((r, l) => (r.conferences = autoConfs(l, Object.keys(r.conferences))));
  UI.acts.edConfDraft = (d) =>
    tryRules((r) => {
      r.mls = { ...(r.mls || { playoff: 7 }), draftRounds: +d.n };
    });
  // Promotion and relegation: off for a pair (the places are kept for turning it on again), or for the whole world
  UI.acts.edProRel = (d) => {
    stashLeague();
    const l = leagueOf(ED.lid),
      up = upperOf(l);
    if (!up) return;
    const pr = pairOf(l, up);
    ED.prevPR = ED.prevPR || {};
    if (d.v === 'off') {
      ED.prevPR[l.id] = pr.n;
      setPair(l, up, { n: 0, mode: 'auto', legs: pr.legs });
    } else setPair(l, up, { n: ED.prevPR[l.id] || 2, mode: pr.mode, legs: pr.legs });
    UI.worldEditor();
  };
  UI.acts.edWorldProRel = (d) => {
    ED.def.rules.proRel = d.v !== 'off';
    UI.worldEditor();
  };
  UI.acts.edPlay = (d) => {
    stashLeague();
    const l = leagueOf(ED.lid);
    l.rules = l.rules || {};
    const p = (l.rules.play = l.rules.play || {});
    if (d.v === '') delete p[d.k];
    else p[d.k] = +d.v;
    if (!Object.keys(p).length) delete l.rules.play;
    UI.worldEditor();
  };
  // A registration rule: a number, on or off, or the game's own (the League's setting is dropped)
  UI.acts.edPlaySquad = (d) => {
    stashLeague();
    const l = leagueOf(ED.lid);
    l.rules = l.rules || {};
    const p = (l.rules.squad = l.rules.squad || {});
    if (d.v === '') delete p[d.k];
    else p[d.k] = d.v === 'true' ? true : d.v === 'false' ? false : +d.v;
    if (d.k === 'listSize' && p.listSize && p.homegrown == null) p.homegrown = 8;
    if (!Object.keys(p).length) delete l.rules.squad;
    UI.worldEditor();
  };
  const squadRules = () => {
    const l = leagueOf(ED.lid);
    l.rules = l.rules || {};
    return (l.rules.squad = l.rules.squad || {});
  };
  const dropEmptySquad = () => {
    const l = leagueOf(ED.lid);
    if (l.rules.squad && !Object.keys(l.rules.squad).length) delete l.rules.squad;
  };
  UI.acts.edExemptAdd = (d, el) => {
    if (!el.value) return;
    stashLeague();
    const sq = squadRules(),
      game = FM.Reg.RULES[ED.lid] || {};
    sq.exempt = [...new Set([...(sq.exempt || game.exempt || []), el.value])];
    UI.worldEditor();
  };
  UI.acts.edExemptDel = (d) => {
    stashLeague();
    const sq = squadRules(),
      game = FM.Reg.RULES[ED.lid] || {};
    sq.exempt = (sq.exempt || game.exempt || []).filter((c) => c !== d.c);
    UI.worldEditor();
  };
  UI.acts.edExemptReset = () => {
    stashLeague();
    delete squadRules().exempt;
    dropEmptySquad();
    UI.worldEditor();
  };
  UI.acts.edBudget = (d) => {
    stashLeague();
    const sq = squadRules();
    if (d.v === 'game') delete sq.mls;
    else if (d.v === 'off') sq.mls = 0;
    else sq.mls = sq.mls || { cap: 5.2e6, maxCharge: 7e5, dp: 3, roster: 30, counted: 20 };
    dropEmptySquad();
    UI.worldEditor();
  };
  UI.acts.edBudgetSave = () => {
    const sq = squadRules(),
      v = (k) => +($('#ed-mls-' + k) || {}).value;
    sq.mls = {
      cap: v('cap') * 1e6,
      maxCharge: v('maxCharge') * 1e3,
      dp: Math.round(v('dp')),
      roster: Math.round(v('roster')),
      counted: Math.round(v('counted')),
    };
    UI.worldEditor();
  };
  // How many matches a club plays, the title play-off and two tournaments a year
  UI.acts.edRounds = () => {
    stashLeague();
    const l = leagueOf(ED.lid),
      v = Math.round(+($('#ed-lrounds') || {}).value);
    l.rules = l.rules || {};
    if (v >= 1) l.rules.rounds = v;
    else delete l.rules.rounds;
    UI.worldEditor();
  };
  UI.acts.edFormat = (d) => {
    stashLeague();
    const l = leagueOf(ED.lid),
      game = (D.LEAGUES.find((x) => x.id === l.id) || { rules: {} }).rules;
    l.rules = l.rules || {};
    if (d.k === 'playoffs') {
      if (d.v === '' && game.playoffs) l.rules.playoffs = clone(game.playoffs);
      else if (d.v === 'none' || d.v === '') {
        delete l.rules.playoffs;
        delete l.rules.torneos; // (two tournaments need a title play-off)
      } else l.rules.playoffs = { type: d.v };
    }
    UI.worldEditor();
  };
  UI.acts.edTorneos = (d) => {
    stashLeague();
    const l = leagueOf(ED.lid);
    l.rules = l.rules || {};
    if (d.v === 'on') {
      l.rules.torneos = ['Apertura', 'Clausura'];
      l.rules.playoffs = l.rules.playoffs || { type: 'liguilla' };
      delete l.rules.split;
      delete l.rules.legs;
    } else delete l.rules.torneos;
    UI.worldEditor();
  };
  // The expansion draft of a league: on (the clubs the world added to it take part), off, and its settings
  const expSet = (spec) => {
    const r = WD.editor(ED.def, null).setExpansion(ED.lid, spec);
    ED.err = r.ok ? [] : r.errors;
    UI.worldEditor();
  };
  UI.acts.edExp = (d) => {
    stashLeague();
    if (d.v === 'off') return expSet(null);
    const added = clubsOf(ED.lid)
      .filter((c) => isNew(c.id))
      .map((c) => c.id);
    const clubs = added.length ? added : [];
    // (without a club of its own to take part, the draft is held but refused until one is chosen)
    ED.def.expansion = ED.def.expansion || {};
    ED.def.expansion[ED.lid] = { ...WD.EXPANSION, clubs };
    ED.err = clubs.length ? [] : ['Choose the clubs that take part in the draft'];
    UI.worldEditor();
  };
  UI.acts.edExpClub = (d) => {
    stashLeague();
    const x = ED.def.expansion[ED.lid];
    x.clubs = x.clubs.includes(d.cid) ? x.clubs.filter((c) => c !== d.cid) : [...x.clubs, d.cid];
    ED.err = WD.validateExpansion(ED.lid, x, ED.def);
    UI.worldEditor();
  };
  UI.acts.edExpSet = (d) => {
    stashLeague();
    const x = ED.def.expansion[ED.lid];
    x[d.k] = +d.n;
    ED.err = WD.validateExpansion(ED.lid, x, ED.def);
    UI.worldEditor();
  };
  const leagueRules = (l) => {
    const r = l.rules || {},
      up = upperOf(l),
      out = [
        leagueFormat(l),
        leaguePlay(l),
        `<div class="ng-label">Prize money <span class="tiny dim">· millions, shared out by final position; empty: automatic (a part of each club's own revenue)</span></div><input type="number" id="ed-lprize" min="0.1" max="20000" step="0.5" inputmode="decimal" placeholder="Automatic" value="${r.prize ? r.prize / 1e6 : ''}">`,
      ];
    if (up) {
      const pr = pairOf(l, up);
      out.push(
        `<div class="ng-label">Promotion and relegation with the ${esc(up.name)}</div>${segV(
          'edProRel',
          pr.n ? 'on' : 'off',
          [
            ['on', 'On'],
            ['off', 'Off'],
          ],
        )}${pr.n ? `<div class="tiny dim" style="margin:10px 0 4px">Places</div>${segN('edUpDown', pr.n, [1, 2, 3, 4])}` : ''}${
          pr.n
            ? `<div class="tiny dim" style="margin:10px 0 4px">After those ${pr.n}</div>${segV('edPairMode', pr.mode, [
                ['auto', 'Nothing more'],
                ['playoff', 'Play-off for one more place'],
                ['reltie', 'Relegation play-off'],
              ])}${
                pr.mode === 'playoff'
                  ? `<div class="tiny dim" style="margin:10px 0 4px">The play-off final (four clubs, semi-finals first)</div>${segV(
                      'edPairLegs',
                      pr.legs,
                      [
                        [1, 'One match'],
                        [2, 'Two legs'],
                      ],
                    )}`
                  : ''
              }<div class="tiny dim" style="margin-top:6px;line-height:1.5">${
                pr.mode === 'playoff'
                  ? 'The clubs just below the places that go up play for one more place.'
                  : pr.mode === 'reltie'
                    ? 'The club just above the drop plays the best of those who missed promotion below, over two legs.'
                    : 'Only the clubs in the places go up and down.'
              }</div>`
            : ''
        }`,
      );
    }
    if (l.tier === 1) {
      const cur = r.qualify ? r.qualify.n : 0,
        region = regionOfLeague(l),
        options = contsOf(region, 1),
        toId = (r.qualify && r.qualify.to) || CONT[(D.NATIONS[l.nat] || {}).region],
        cc = options.find((c) => c.id === toId) || options[0];
      out.push(
        `<div class="ng-label">Places in the ${esc(cc ? cc.name : 'continental cup')}</div>${cc ? segN('edQualify', cur, [0, 1, 2, 3, 4, 5, 6]) : '<div class="tiny dim">No continental cup for this part of the world.</div>'}${
          options.length > 1
            ? `<div class="row" style="gap:6px;margin-top:6px"><select data-input="edQualifyTo" style="flex:1;min-width:0">${options.map((c) => `<option value="${c.id}" ${cc && cc.id === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></div>`
            : ''
        }`,
      );
    }
    if (!D.LEAGUES.some((x) => x.id === l.id))
      out.push(
        '<div class="actions" style="margin-top:14px"><button class="btn sm" data-act="edDelLeague">Delete this league and its clubs</button></div>',
      );
    return out.join('');
  };
  // (the fields typed on the league screen are kept when a button on it redraws the screen)
  const stashLeague = () => {
    if (!$('#ed-lname')) return;
    const keep = ED.err;
    UI.acts.edSaveLeague({ quiet: true });
    ED.err = keep;
  };
  // The split of a league: default groups for a number of them (the clubs shared out evenly from the top)
  const SPLIT_NAMES = {
    2: ['Championship', 'Relegation'],
    3: ['Championship', 'Middle', 'Relegation'],
    4: ['Championship', 'Upper middle', 'Lower middle', 'Relegation'],
  };
  const defaultSplit = (n, k, after) => {
    const sizes = Array.from({ length: k }, (_, i) => Math.floor(n / k) + (i < n % k ? 1 : 0));
    return {
      after: after || (n <= 14 ? 2 * (n - 1) : n - 1),
      groups: sizes,
      rounds: sizes.map(() => 'single'),
      names: SPLIT_NAMES[k],
      halve: false,
    };
  };
  UI.acts.edSplitOn = () => {
    stashLeague();
    const l = leagueOf(ED.lid);
    l.rules = l.rules || {};
    l.rules.split = defaultSplit(clubsOf(l.id).length, 2);
    ED.err = WD.validateLeagueRules(l, ED.def);
    UI.worldEditor();
  };
  UI.acts.edSplitOff = () => {
    stashLeague();
    const l = leagueOf(ED.lid);
    if (l.rules) delete l.rules.split;
    UI.worldEditor();
  };
  UI.acts.edSplitN = (d) => {
    stashLeague();
    const l = leagueOf(ED.lid);
    l.rules.split = defaultSplit(clubsOf(l.id).length, +d.v, l.rules.split && l.rules.split.after);
    ED.err = WD.validateLeagueRules(l, ED.def);
    UI.worldEditor();
  };
  UI.acts.edUpDown = (d) => {
    stashLeague();
    const l = leagueOf(ED.lid),
      up = upperOf(l);
    if (!up) return;
    const pr = pairOf(l, up);
    setPair(l, up, { n: +d.n, mode: pr.mode, legs: pr.legs });
    UI.worldEditor();
  };
  UI.acts.edPairMode = (d) => {
    stashLeague();
    const l = leagueOf(ED.lid),
      up = upperOf(l);
    if (!up) return;
    setPair(l, up, { ...pairOf(l, up), mode: d.v });
    UI.worldEditor();
  };
  UI.acts.edPairLegs = (d) => {
    stashLeague();
    const l = leagueOf(ED.lid),
      up = upperOf(l);
    if (!up) return;
    setPair(l, up, { ...pairOf(l, up), legs: +d.v });
    UI.worldEditor();
  };
  UI.acts.edLegs = (d) => {
    stashLeague();
    const l = leagueOf(ED.lid);
    l.rules = l.rules || {};
    if (+d.v === 1) l.rules.legs = 1;
    else delete l.rules.legs;
    UI.worldEditor();
  };
  UI.acts.edQualify = (d) => {
    stashLeague();
    const l = leagueOf(ED.lid),
      n = +d.n;
    l.rules = l.rules || {};
    const to = (l.rules.qualify && l.rules.qualify.to) || CONT[(D.NATIONS[l.nat] || {}).region];
    if (n) l.rules.qualify = { to, n };
    else delete l.rules.qualify;
    UI.worldEditor();
  };
  UI.acts.edDelLeague = () => {
    const l = leagueOf(ED.lid);
    if (!l || D.LEAGUES.some((x) => x.id === l.id)) return;
    for (const c of clubsOf(l.id)) dropClub(c.id);
    for (const o of ED.def.leagues)
      for (const k of ['promote', 'relegate']) if (o.rules && o.rules[k] && o.rules[k].to === l.id) delete o.rules[k];
    ED.def.leagues = ED.def.leagues.filter((x) => x.id !== l.id);
    ED.view = 'home';
    ED.err = [];
    UI.worldEditor();
  };
  // A league of your own, in a nation that has one or in one that has none: its clubs are made with placeholder names for you
  // to change
  const PALETTE = [
    ['#c8102e', '#ffffff'],
    ['#0b3d91', '#ffffff'],
    ['#00843d', '#ffffff'],
    ['#f2a900', '#111111'],
    ['#111111', '#ffffff'],
    ['#6a1b9a', '#ffffff'],
    ['#00a3e0', '#ffffff'],
    ['#e8590c', '#ffffff'],
    ['#2e7d32', '#f2a900'],
    ['#7b1e2b', '#f4e1c1'],
    ['#1d4e89', '#f2a900'],
    ['#444444', '#c8102e'],
  ];
  UI.acts.edNewLeague = () => {
    ED.view = 'newleague';
    ED.err = [];
    UI.worldEditor();
  };
  UI.acts.edCreateLeague = () => {
    const v = (id) => ($('#ed-' + id) || {}).value;
    const nat = v('nlnat'),
      name = (v('nlname') || '').trim(),
      tier = Math.max(1, Math.min(6, Math.round(+v('nltier')) || 1)),
      count = Math.max(8, Math.min(24, Math.round(+v('nlcount')) || 12));
    const short = (v('nlshort') || '').trim().toUpperCase();
    if (!name) {
      ED.err = ['The league needs a name'];
      return UI.worldEditor();
    }
    const stem =
      (short || nat)
        .replace(/[^A-Z0-9]/gi, '')
        .toUpperCase()
        .slice(0, 4) || nat;
    const taken = new Set([...ED.def.leagues.map((l) => l.id), ...D.LEAGUES.map((l) => l.id)]);
    let id = stem;
    for (let i = 1; taken.has(id); i++) id = stem.slice(0, 4) + i;
    const band = tier === 1 ? [70, 45] : tier === 2 ? [52, 38] : [44, 32];
    const league = { id, name, short: short || id, nat, tier, sim: v('nlsim') || 'minimal', repBand: band, rules: {} };
    const cont = CONT[(D.NATIONS[nat] || {}).region];
    if (tier === 1 && cont) league.rules.qualify = { to: cont, n: 1 };
    ED.def.leagues.push(league);
    const used = new Set(ED.def.clubs.map((c) => String(c.id).replace(/^c_/, '')));
    for (let i = 0; i < count; i++) {
      let code = id.slice(0, 4) + (i + 1);
      for (let k = 1; used.has(code); k++) code = id.slice(0, 3) + (i + 1) + 'x'.repeat(k);
      used.add(code);
      const rep = Math.round(band[0] - ((band[0] - band[1]) * i) / Math.max(1, count - 1)),
        col = PALETTE[i % PALETTE.length];
      ED.def.clubs.push({
        id: 'c_' + code,
        name: `${short || id} Club ${i + 1}`,
        short: String(i + 1).padStart(2, '0'),
        nick: '',
        city: `${short || id} Town ${i + 1}`,
        nat,
        colors: col.slice(),
        identity: 'historic',
        rep,
        league: id,
        parent: null,
        founded: 1900 + ((i * 7) % 60),
        stadium: {
          name: `${short || id} Park ${i + 1}`,
          cap: Math.max(1500, Math.round((8000 + (rep - 40) * 900) / 500) * 500),
        },
      });
    }
    ED.lid = id;
    ED.view = 'league';
    ED.err = [];
    UI.worldEditor();
  };
  const newLeagueView = () => {
    const nations = natEntries().sort((a, b) => a[1].name.localeCompare(b[1].name));
    const has = new Set(ED.def.leagues.map((l) => l.nat));
    return `<div class="h1" style="margin-top:2vh">Add a league</div><div class="tag">Its clubs are made for you with placeholder names: open each one to name it. A nation with no league yet gets its first.</div>
      ${errBox()}
      <div class="ng-label">Nation</div><select id="ed-nlnat">${nations.map(([k, n]) => `<option value="${k}">${n.flag} ${esc(n.name)}${has.has(k) ? '' : ' · no league yet'}</option>`).join('')}</select>
      <div class="ng-label">League name</div><input type="text" id="ed-nlname" maxlength="48" placeholder="e.g. Premier Division">
      <div class="ng-names"><div style="flex:1"><div class="ng-label" style="margin-top:0">Short name</div><input type="text" id="ed-nlshort" maxlength="6" placeholder="e.g. PD"></div><div style="flex:1"><div class="ng-label" style="margin-top:0">Tier</div><input type="number" id="ed-nltier" min="1" max="6" inputmode="numeric" value="1"></div></div>
      <div class="ng-names"><div style="flex:1"><div class="ng-label" style="margin-top:0">Clubs (8–24)</div><input type="number" id="ed-nlcount" min="8" max="24" inputmode="numeric" value="12"></div><div style="flex:1"><div class="ng-label" style="margin-top:0">Simulation</div><select id="ed-nlsim"><option value="minimal">Minimal (fast)</option><option value="light">Light</option><option value="full">Full</option></select></div></div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="home" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edCreateLeague">Add the league</button></div>`;
  };
  const leagueView = () => {
    const l = leagueOf(ED.lid),
      n = natOf(l);
    const q = ED.q.trim().toLowerCase();
    const rows = clubsOf(l.id)
      .filter((c) => !q || c.name.toLowerCase().includes(q) || (c.city || '').toLowerCase().includes(q))
      .sort((a, b) => b.rep - a.rep);
    return `<div class="h1" style="margin-top:2vh">${n.flag} ${esc(l.name)}</div><div class="tag">Tier ${l.tier} · ${U.plural(clubsOf(l.id).length, 'club')}. Tap a club to change it.</div>
      <div id="ed-lwarn">${leagueWarn(l)}</div>
      <div class="ng-label">League name</div><div class="ng-names" style="margin-top:0"><input type="text" id="ed-lname" maxlength="48" value="${esc(l.name)}"><input type="text" id="ed-lshort" maxlength="6" style="max-width:90px" value="${esc(l.short || l.id)}"></div>
      ${leagueRules(l)}
      <div class="actions" style="margin-top:12px"><button class="btn sm pri" data-act="edSaveLeague">Save the league</button></div>
      ${bulkTools()}
      ${removedHere(l.id)}
      ${errBox()}
      <div class="ng-find"><input type="search" id="ed-q" placeholder="Search clubs" value="${esc(ED.q)}" autocomplete="off"></div>
      <div id="ed-list">${listRows(rows)}</div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="home" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edAddClub">＋ Add a club</button></div>`;
  };
  const listRows = (rows) =>
    rows
      .map(
        (c) =>
          `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edView" data-v="club" data-cid="${esc(c.id)}"><div class="row" style="gap:10px">${crestDot(c)}<div class="grow"><div class="small b">${esc(c.name)}</div><div class="tiny dim">${esc(c.city || '')} · ${esc(c.stadium.name)} (${c.stadium.cap.toLocaleString()}) · ${stars(c.rep)}</div></div><span class="dim">›</span></div></div>`,
      )
      .join('') || '<div class="empty">No club matches.</div>';

  // The manager of a club (an entry in the definition's managers; a club with none keeps the one the world gives it)
  // Who a club may sign: anyone, or only players of one nation (the built-in rules of Eibar, Andorra and the army club stay as they are)
  const polName = (sel) => {
    const [kind, key] = String(sel).split(':');
    return kind === 'nat'
      ? (D.NATIONS[key] || {}).name
      : kind === 'region'
        ? D.REGIONS[key]
        : kind === 'her'
          ? (D.HERITAGE_LABEL || {})[key] || key
          : '';
  };
  const policyFields = (c) => {
    const p = c.policy;
    if (p && p.military)
      return `<div class="ng-label">Signing rule</div><div class="tiny dim" style="line-height:1.5">Only ${esc(p.label || '')} players: a rule the game gives this club.</div>`;
    const cur = p ? (p.nat ? 'nat:' + p.nat : p.region ? 'region:' + p.region : 'her:' + p.heritage) : '';
    // (a name typed by hand stays in the box; the name the game would give anyway is not copied there, or it would stick to the next choice)
    const typed = p && p.label && p.label !== polName(cur) ? p.label : '';
    const o = (v, t) => `<option value="${v}" ${cur === v ? 'selected' : ''}>${t}</option>`;
    const opts = `<optgroup label="Nation">${natEntries()
      .map(([k, n]) => o('nat:' + k, `${n.flag} ${esc(n.name)}`))
      .join('')}</optgroup><optgroup label="Part of the world">${Object.entries(D.REGIONS)
      .map(([k, n]) => o('region:' + k, esc(n)))
      .join(
        '',
      )}</optgroup><optgroup label="Family heritage (players of that background, whatever their nation)">${Object.entries(
      D.HERITAGE_LABEL || {},
    )
      .map(([k, n]) => o('her:' + k, esc(n)))
      .join('')}</optgroup>`;
    return `<div class="ng-label">Signing rule <span class="tiny dim">· who the club may sign</span></div>
      <select id="ed-polnat"><option value="">Anyone</option>${opts}</select>
      <input type="text" id="ed-pollabel" maxlength="30" placeholder="What to call them, e.g. Andorran" value="${esc(typed)}" style="margin-top:6px">`;
  };
  // ---------- The clubs' own squads ----------
  // The game makes every squad when the world is built, after editing ends, so the editor only ever saw the players you add. Building
  // the world here (the same way a new career does) and keeping its players in the definition makes every squad one you can open
  // and change, and a fixed world: the same players every time it is used.
  const squadsCard = () => {
    const fixed = ED.def.meta.players === 'replace' && (ED.def.players || []).length > 2000;
    return fixed
      ? `<div class="card" style="margin:12px 0 0;padding:10px 12px"><div class="small b">🧬 The squads are in this world</div><div class="tiny dim" style="line-height:1.5">${(ED.def.players || []).length.toLocaleString('en')} players: open a club, then Players, to change any of them. The world gives the same players every time.</div><div class="actions" style="margin-top:8px"><button class="btn sm" data-act="edClearSquads">Go back to squads made fresh each time</button></div></div>`
      : `<div class="card tap" style="margin:12px 0 0;padding:10px 12px" data-act="edBuildSquads"><div class="row"><div class="grow"><div class="small b">🧬 Build the squads to edit them</div><div class="tiny dim">Makes every club's squad now (about half a minute), so each player can be changed and the world keeps them</div></div><span class="dim">›</span></div></div>`;
  };
  UI.acts.edBuildSquads = () => {
    UI.toast('Building the world… this takes a little while', 60000);
    setTimeout(() => {
      const keep = FM.S;
      try {
        WD.load(clone(ED.def), { ...FM.W.REAL_RULES, ...UI._dbRules(ED.def) });
        const made = WD.fromState(FM.S, { name: ED.def.meta.name, players: true, replace: true });
        ED.def.players = made.players;
        ED.def.meta.players = 'replace';
        ED.err = [];
      } catch (e) {
        ED.err = [String(e.message || e).split('\n')[0]];
      } finally {
        FM.S = keep;
        WD.useStatic(null);
      }
      UI.worldEditor();
      UI.toast(
        ED.err.length ? 'The squads could not be built' : 'The squads are in the world: open a club, then Players',
        4000,
      );
    }, 60);
  };
  UI.acts.edClearSquads = () => {
    ED.def.players = [];
    ED.def.meta.players = 'overlay';
    UI.worldEditor();
  };

  // ---------- Bulk tools ----------
  // Every club of a league at once: its reputation up or down, a word replaced in the names; and one club copied, or swapped with
  // a club of another league of its country
  const bulkTools = () =>
    `<div class="ng-label">Bulk tools <span class="tiny dim">· every club of this league at once</span></div>
      <div class="row" style="gap:6px;flex-wrap:wrap"><span class="small dim grow">Reputation of every club</span>${[-5, -2, 2, 5].map((n) => `<button class="btn sm" data-act="edBulkRep" data-n="${n}">${n > 0 ? '+' : '−'}${Math.abs(n)}</button>`).join('')}</div>
      <div class="ng-names" style="margin-top:10px"><input type="text" id="ed-find" maxlength="30" placeholder="Find in names"><input type="text" id="ed-repl" maxlength="30" placeholder="Replace with"></div>
      <div class="actions" style="margin-top:6px"><button class="btn sm" data-act="edFindRepl">Replace in names, towns and grounds</button></div>`;
  UI.acts.edBulkRep = (d) => {
    const n = +d.n,
      errs = [];
    for (const c of clubsOf(ED.lid)) {
      const r = WD.editor(ED.def, null).setClub(c.id, { rep: Math.max(20, Math.min(99, c.rep + n)) });
      if (!r.ok) errs.push(...r.errors);
    }
    ED.err = errs;
    UI.worldEditor();
    if (!errs.length) UI.toast(`Every club's reputation ${n > 0 ? 'up' : 'down'} ${Math.abs(n)}`, 2500);
  };
  UI.acts.edFindRepl = () => {
    const find = ($('#ed-find') || {}).value || '',
      to = ($('#ed-repl') || {}).value || '';
    if (!find) return UI.toast('Type what to find first', 2500);
    let n = 0;
    const errs = [];
    for (const c of clubsOf(ED.lid)) {
      const patch = {};
      for (const k of ['name', 'nick', 'city']) if (c[k] && c[k].includes(find)) patch[k] = c[k].split(find).join(to);
      if (c.stadium.name.includes(find)) patch.stadium = { name: c.stadium.name.split(find).join(to) };
      if (!Object.keys(patch).length) continue;
      const r = WD.editor(ED.def, null).setClub(c.id, patch);
      if (r.ok) n++;
      else errs.push(...r.errors);
    }
    ED.err = errs;
    UI.worldEditor();
    UI.toast(`${n} club${n === 1 ? '' : 's'} changed`, 2500);
  };
  const clubTools = (c, sameNat) => {
    const others = ED.def.clubs
      .filter((x) => x.league !== c.league && sameNat.some((l) => l.id === x.league))
      .sort((a, b) => tierOfLeague(a.league) - tierOfLeague(b.league) || a.name.localeCompare(b.name));
    return `<div class="ng-label">Copy or swap</div>
      <div class="actions" style="margin-top:0"><button class="btn sm" data-act="edCopyClub">Copy this club</button></div>
      ${
        others.length
          ? `<div class="row" style="gap:8px;margin-top:8px"><select id="ed-swap" class="grow"><option value="">Swap leagues with…</option>${others.map((x) => `<option value="${esc(x.id)}">${esc(x.name)} (${esc((leagueOf(x.league) || {}).name || '')})</option>`).join('')}</select><button class="btn sm" data-act="edSwapClub">Swap</button></div>`
          : ''
      }`;
  };
  UI.acts.edCopyClub = () => {
    const c0 = ED.def.clubs.find((x) => x.id === ED.cid);
    if (!c0) return;
    const name = `${c0.name} II`;
    const taken = new Set(ED.def.clubs.filter((x) => x.league === c0.league).map((x) => x.short));
    const c = clone(c0);
    c.id = 'c_' + newCode(name);
    c.name = name;
    c.short = U.abbrev(name, taken);
    c.nick = '';
    ED.def.clubs.push(c);
    ED.cid = c.id;
    ED.err = [];
    UI.worldEditor();
    UI.toast('A copy of the club (its players and manager are not copied)', 3000);
  };
  UI.acts.edSwapClub = () => {
    const other = ED.def.clubs.find((x) => x.id === ($('#ed-swap') || {}).value),
      mine = ED.def.clubs.find((x) => x.id === ED.cid);
    if (!other || !mine) return UI.toast('Choose a club to swap with', 2500);
    const E = WD.editor(ED.def, null);
    const was = { l: mine.league, n: mine.nat };
    const a = E.setClub(mine.id, { league: other.league, nat: other.nat });
    const b = a.ok ? E.setClub(other.id, { league: was.l, nat: was.n }) : a;
    if (!b.ok) {
      if (a.ok) E.setClub(mine.id, { league: was.l, nat: was.n });
      ED.err = b.errors;
    } else {
      ED.lid = other.league;
      ED.err = [];
      UI.toast(`${mine.name} and ${other.name} swapped leagues`, 3000);
    }
    UI.worldEditor();
  };
  const managerOf = (cid) => (ED.def.managers || []).find((m) => m.club === cid);
  const managerFields = (c) => {
    const m = managerOf(c.id) || {};
    const nations = natEntries().sort((a, b) => a[1].name.localeCompare(b[1].name));
    return `<div class="ng-label">Manager <span class="tiny dim">· leave the names empty to keep the one the game gives the club</span></div>
      <div class="ng-names" style="margin-top:0"><input type="text" id="ed-mfn" maxlength="24" placeholder="First name" value="${esc(m.fn || '')}"><input type="text" id="ed-mln" maxlength="28" placeholder="Last name" value="${esc(m.ln || '')}"></div>
      <div class="ng-names"><select id="ed-mnat" style="flex:1">${nations.map(([k, n]) => `<option value="${k}" ${(m.nat || c.nat) === k ? 'selected' : ''}>${n.flag} ${esc(n.name)}</option>`).join('')}</select><input type="number" id="ed-mage" min="28" max="80" inputmode="numeric" style="max-width:84px" value="${m.age || 48}" aria-label="Age"></div>
      <div class="ng-label" style="margin-top:8px">Ability <b id="ed-mabv" style="color:#e6edf6">${m.ability || 12}</b> <span class="tiny dim">(1–20)</span></div><input type="range" id="ed-mab" min="1" max="20" step="1" value="${m.ability || 12}" style="width:100%">
      <div class="ng-label" style="margin-top:8px">Reputation <b id="ed-mrepv" style="color:#e6edf6">${m.rep || c.rep}</b> <span class="tiny dim">(how the wider game rates them)</span></div><input type="range" id="ed-mrep" min="20" max="99" step="1" value="${m.rep || c.rep}" style="width:100%">
      <div class="ng-label">Personality</div><select id="ed-mpers"><option value="">As the game gives</option>${D.STAFF_PERSONALITY.map((k) => `<option ${m.personality === k ? 'selected' : ''}>${k}</option>`).join('')}</select>
      <div class="ng-label">How their team plays <span class="tiny dim">· the system they set the club up in</span></div>
      <select id="ed-mform"><option value="">As the game sets the club up</option>${Object.keys(D.FORMATIONS)
        .map((k) => `<option ${(m.tactic || {}).formation === k ? 'selected' : ''}>${k}</option>`)
        .join('')}</select>
      <div class="ng-names"><select id="ed-mbuild" style="flex:1">${D.BUILDUP.map((k) => `<option ${((m.tactic || {}).buildup || 'Short') === k ? 'selected' : ''}>${k}</option>`).join('')}</select><select id="ed-mpress" style="flex:1">${D.PRESS.map((k) => `<option ${((m.tactic || {}).press || 'Mid Block') === k ? 'selected' : ''}>${k}</option>`).join('')}</select><select id="ed-mwidth" style="flex:1">${D.WIDTH.map((k) => `<option ${((m.tactic || {}).width || 'Balanced') === k ? 'selected' : ''}>${k}</option>`).join('')}</select></div>`;
  };
  // Derby and B team: a club has one derby rival (any club of its nation) and may be the B team of a club of a higher division
  const tierOfLeague = (lid) => (leagueOf(lid) || {}).tier || 1;
  const clubGroups = (nat, sel, ok) =>
    ED.def.leagues
      .filter((l) => l.nat === nat)
      .map((l) => {
        const rows = clubsOf(l.id)
          .filter(ok)
          .sort((a, b) => a.name.localeCompare(b.name));
        return rows.length
          ? `<optgroup label="${esc(l.name)}">${rows.map((c) => `<option value="${esc(c.id)}" ${c.id === sel ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</optgroup>`
          : '';
      })
      .join('');
  const derbyFields = (c) => {
    const r = WD.editor(ED.def, null).derbyOf(c.id),
      other = r ? (r[0] === c.id ? r[1] : r[0]) : '';
    const tier = tierOfLeague(c.league),
      taken = new Set(ED.def.clubs.filter((x) => x.parent && x.id !== c.id).map((x) => x.parent));
    const parents = clubGroups(
      c.nat,
      c.parent,
      (x) => x.id !== c.id && !x.parent && tierOfLeague(x.league) < tier && !taken.has(x.id),
    );
    return `<div class="ng-label">Derby <span class="tiny dim">· the club's great rivalry</span></div>
      <select id="ed-derby"><option value="">No derby</option>${clubGroups(c.nat, other, (x) => x.id !== c.id)}</select>
      <input type="text" id="ed-derbyname" maxlength="40" placeholder="Name of the derby" style="margin-top:6px" value="${esc(r ? r[2] : '')}">
      ${
        parents || c.parent
          ? `<div class="ng-label">B team of <span class="tiny dim">· plays below its parent, which owns its players</span></div><select id="ed-parent"><option value="">Not a B team</option>${parents}</select>`
          : ''
      }`;
  };
  // ---------- Crest, money, facilities and supporters ----------
  // A club's own crest design, its cash and transfer budget, its facilities and the size of its supporters and market. Left alone,
  // the game works each of them out from the club's reputation, identity and ground.
  const CREST_NAMES = {
    shape: ['Classic shield', 'Round badge', 'Flat-topped heater', 'Rounded plaque'],
    pattern: [
      'Top band',
      'Twin stripes',
      'Sash',
      'Halves',
      'Hoops',
      'Quarters',
      'Pinstripes',
      'Centre stripe',
      'Cross',
      'Chevron',
      'Bottom band',
    ],
    emblem: [
      'Ball',
      'Star',
      'Crown',
      'Tower',
      'Diamond',
      'Ring',
      'Paw',
      'Wings',
      'Anchor',
      'Tree',
      'Crossed hammers',
      'Sun',
      'Sailing boat',
      'Mountains',
      'Waves',
    ],
  };
  const FACILITY_NAMES = {
    training: 'Training ground',
    academy: 'Academy',
    medical: 'Medical centre',
    analytics: 'Analytics',
    stadium: 'Stadium',
    fanzone: 'Fan zone',
    museum: 'Museum',
  };
  const OWNERS = [
    ['private', 'A private owner'],
    ['sovereign', 'A state or sovereign wealth fund'],
    ['fans', 'The supporters'],
    ['investors', 'An investment group'],
  ];
  const draftCrest = () => {
    const c = ED.def.clubs.find((x) => x.id === ED.cid);
    const v = (id) => +(($('#ed-' + id) || {}).value ?? -1);
    return UI.C.crest({ ...c, crest: [v('xcs'), v('xcp'), v('xce')] }, 72);
  };
  UI.acts.edSaveClubX = () => {
    const v = (id) => ($('#ed-' + id) || {}).value;
    const crest = [+v('xcs'), +v('xcp'), +v('xce')];
    const money = (id) => (v(id) === '' ? undefined : Math.round(+v(id) * 1e6));
    const finance = { balance: money('xbal'), budget: money('xbud') };
    const r = WD.editor(ED.def, null).setClub(ED.cid, {
      crest: crest.every((n) => n < 0) ? null : crest,
      kit: $('#ed-xkiton').checked ? { home: v('xkh'), away: v('xka') } : null,
      finance: finance.balance == null && finance.budget == null ? null : finance,
      facilities: $('#ed-xfacon').checked
        ? Object.fromEntries(WD.FACILITIES.map((k) => [k, Math.round(+v('xf-' + k))]))
        : null,
      attr: $('#ed-xattron').checked
        ? {
            market: +v('xa-market'),
            support: +v('xa-support'),
            catchment: +v('xa-catchment'),
            own: v('xown'),
          }
        : undefined,
    });
    if (!r.ok) {
      ED.err = r.errors;
      return UI.worldEditor();
    }
    ED.view = 'club';
    ED.err = [];
    UI.toast('Saved', 1500);
    UI.worldEditor();
  };
  UI.acts.edClearClubX = () => {
    const c = ED.def.clubs.find((x) => x.id === ED.cid);
    const base = builtIn().get(ED.cid);
    for (const k of ['crest', 'kit', 'finance', 'facilities']) c[k] = null;
    if (base && base.attr) c.attr = base.attr;
    else delete c.attr;
    ED.view = 'club';
    UI.worldEditor();
  };
  const shirtSvg = (col) =>
    `<svg width="54" height="50" viewBox="0 0 54 50" aria-hidden="true"><path d="M17 3 L4 12 L10 22 L16 19 V47 H38 V19 L44 22 L50 12 L37 3 Q27 10 17 3Z" fill="${esc(col)}" stroke="rgba(255,255,255,.5)" stroke-width="1.4"/></svg>`;
  const clubxView = () => {
    const c = ED.def.clubs.find((x) => x.id === ED.cid);
    if (!c) return leagueView();
    const cr = c.crest || [-1, -1, -1],
      fin = c.finance || {},
      fac = c.facilities || {},
      at = c.attr || {};
    const sel = (id, list, cur) =>
      `<select id="ed-${id}"><option value="-1" ${cur < 0 ? 'selected' : ''}>The game's choice</option>${list.map((n, i) => `<option value="${i}" ${cur === i ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select>`;
    const slider = (id, label, min, max, step, val, suffix = '') =>
      `<div class="row" style="gap:10px;align-items:center;margin-top:6px"><span class="small" style="width:120px;flex:none">${esc(label)}</span><input type="range" id="ed-${id}" min="${min}" max="${max}" step="${step}" value="${val}" style="flex:1"><b id="ed-${id}v" style="width:34px;text-align:right">${val}${suffix}</b></div>`;
    return `<div class="h1" style="margin-top:2vh">${esc(c.name)}</div><div class="tag">The crest, the money, the facilities and the supporters. Anything you leave alone the game works out from the club's reputation, identity and ground.</div>
      ${errBox()}
      <div class="ng-label">Crest</div>
      <div class="row" style="gap:14px;align-items:center"><div id="ed-crestprev" style="flex:none">${UI.C.crest({ ...c, crest: cr }, 72)}</div><div class="grow">
        ${sel('xcs', CREST_NAMES.shape, cr[0])}<div style="height:6px"></div>${sel('xcp', CREST_NAMES.pattern, cr[1])}<div style="height:6px"></div>${sel('xce', CREST_NAMES.emblem, cr[2])}</div></div>
      <div class="ng-label">Kit <span class="tiny dim">· the shirt colours worn in matches</span></div>
      <label class="small" style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="ed-xkiton" ${c.kit ? 'checked' : ''}> My own shirts (otherwise the club's two colours, and the second when the first clashes)</label>
      <div class="row" style="gap:14px;align-items:center;margin-top:8px"><div style="text-align:center"><div id="ed-kithome">${shirtSvg((c.kit || {}).home || c.colors[0])}</div><input type="color" id="ed-xkh" value="${esc((c.kit || {}).home || c.colors[0])}" style="width:56px;height:36px;padding:2px"><div class="tiny dim">Home</div></div><div style="text-align:center"><div id="ed-kitaway">${shirtSvg((c.kit || {}).away || c.colors[1])}</div><input type="color" id="ed-xka" value="${esc((c.kit || {}).away || c.colors[1])}" style="width:56px;height:36px;padding:2px"><div class="tiny dim">Away</div></div></div>
      <div class="ng-label">Money <span class="tiny dim">· millions; empty: the game's figure</span></div>
      <div class="ng-names" style="margin-top:0"><div style="flex:1"><div class="tiny dim">Cash in the bank</div><input type="number" id="ed-xbal" step="0.5" inputmode="decimal" value="${fin.balance != null ? fin.balance / 1e6 : ''}"></div><div style="flex:1"><div class="tiny dim">Transfer budget</div><input type="number" id="ed-xbud" step="0.5" min="0" inputmode="decimal" value="${fin.budget != null ? fin.budget / 1e6 : ''}"></div></div>
      <div class="ng-label">Facilities</div>
      <label class="small" style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="ed-xfacon" ${c.facilities ? 'checked' : ''}> I set them (otherwise the game gives each a level of its own)</label>
      ${WD.FACILITIES.map((k) => slider('xf-' + k, FACILITY_NAMES[k], 1, 5, 1, fac[k] || 3)).join('')}
      <div class="ng-label">Supporters and owner</div>
      <label class="small" style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="ed-xattron" ${c.attr ? 'checked' : ''}> I set them (otherwise the game works them out)</label>
      ${slider('xa-market', 'Market', 1, 10, 0.5, at.market ?? 5)}
      ${slider('xa-support', 'Supporters', 1, 10, 0.5, at.support ?? 5)}
      ${slider('xa-catchment', 'Youth catchment', 1, 10, 0.5, at.catchment ?? 5)}
      <div class="tiny dim" style="margin-top:6px;line-height:1.5">The market is the size of the town and its commercial pull, supporters how many there are and how loyal, and the catchment how many young players the area brings. Together with the owner they set how high the club can grow.</div>
      <div class="ng-label">Owner</div><select id="ed-xown">${OWNERS.map(([k, n]) => `<option value="${k}" ${(at.own || 'private') === k ? 'selected' : ''}>${n}</option>`).join('')}</select>
      <div class="actions" style="margin-top:14px"><button class="btn sm" data-act="edClearClubX">Back to the game's figures</button></div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="club" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edSaveClubX">Save</button></div>`;
  };
  // Kit colour pairs to start from (home, trim): the colours clubs most often play in
  const KIT_PRESETS = [
    ['#d71920', '#ffffff'],
    ['#1d4fa3', '#ffffff'],
    ['#ffffff', '#1d2a5b'],
    ['#111111', '#ffffff'],
    ['#ffd100', '#111111'],
    ['#0a8f3c', '#ffffff'],
    ['#7a1f3d', '#7fc6e8'],
    ['#f26522', '#111111'],
    ['#6cabdd', '#ffffff'],
    ['#6d2077', '#ffffff'],
    ['#d71920', '#111111'],
    ['#1d4fa3', '#d71920'],
  ];
  UI.acts.edPreset = (d) => {
    for (const [id, v] of [
      ['ed-c1', d.a],
      ['ed-c2', d.b],
    ]) {
      const el = $('#' + id);
      if (el) {
        el.value = v;
        el.dispatchEvent(new Event('input'));
      }
    }
  };
  const clubView = () => {
    const c = ED.def.clubs.find((x) => x.id === ED.cid);
    if (!c) return leagueView();
    const added = !builtIn().has(c.id);
    const idOpts = Object.entries(D.IDENTITY)
      .map(([k, v]) => `<option value="${k}" ${c.identity === k ? 'selected' : ''}>${v.icon} ${esc(v.label)}</option>`)
      .join('');
    const sameNat = ED.def.leagues.filter((l) => l.nat === c.nat);
    const lgOpts = sameNat
      .map((l) => `<option value="${esc(l.id)}" ${c.league === l.id ? 'selected' : ''}>${esc(l.name)}</option>`)
      .join('');
    return `<div class="h1" style="margin-top:2vh">${crestDot(c)} ${esc(c.name)}</div><div class="tag">${added ? 'A club you added.' : "One of the game's clubs: your changes replace what it has."}</div>
      ${errBox()}
      <details class="edsec" open><summary>Identity</summary>
      <div class="ng-label">Name</div><input type="text" id="ed-name" maxlength="40" value="${esc(c.name)}">
      <div id="ed-warn">${clubWarn(c)}</div>
      <div class="ng-names"><div style="flex:1"><div class="ng-label" style="margin-top:0">Short name (up to 5)</div><input type="text" id="ed-short" maxlength="5" value="${esc(c.short || '')}"></div><div style="flex:1"><div class="ng-label" style="margin-top:0">Nickname</div><input type="text" id="ed-nick" maxlength="24" value="${esc(c.nick || '')}"></div></div>
      <div class="ng-label">City</div><input type="text" id="ed-city" maxlength="32" value="${esc(c.city || '')}">
      <div class="ng-label">Colours <span class="tiny dim">· a preset, or pick your own</span></div>
      <div class="row" style="gap:6px;flex-wrap:wrap;margin-bottom:8px">${KIT_PRESETS.map(([a, b]) => `<button type="button" class="btn sm" style="padding:0;width:34px;height:34px;border-radius:50%;border:1px solid #243042;background:linear-gradient(135deg,${a} 50%,${b} 50%)" data-act="edPreset" data-a="${a}" data-b="${b}" aria-label="Colours ${a} and ${b}"></button>`).join('')}</div>
      <div class="row" style="gap:10px"><input type="color" id="ed-c1" value="${esc(c.colors[0])}" style="width:64px;height:44px;padding:2px"><input type="color" id="ed-c2" value="${esc(c.colors[1])}" style="width:64px;height:44px;padding:2px"><span class="tiny dim">home kit, and the second colour</span></div>
      <div class="ng-label">Identity</div><select id="ed-identity">${idOpts}</select>
      <div class="ng-label">Reputation <b id="ed-repv" style="color:#e6edf6">${c.rep}</b> <span class="tiny dim">(${stars(c.rep)} — decides the squad and the money)</span></div>
      <input type="range" id="ed-rep" min="20" max="99" step="1" value="${c.rep}" style="width:100%">
      </details>
      <details class="edsec"><summary>Ground</summary>
      <div class="ng-label">Ground</div><input type="text" id="ed-stadium" maxlength="40" value="${esc(c.stadium.name)}">
      <div class="ng-names"><div style="flex:1"><div class="ng-label" style="margin-top:0">Capacity</div><input type="number" id="ed-cap" min="1000" max="120000" step="500" inputmode="numeric" value="${esc(c.stadium.cap)}"></div><div style="flex:1"><div class="ng-label" style="margin-top:0">Founded</div><input type="number" id="ed-founded" min="1800" max="2030" inputmode="numeric" value="${c.founded || ''}"></div></div>
      </details>
      <details class="edsec"><summary>League and signing rule</summary>
      ${sameNat.length > 1 ? `<div class="ng-label">League</div><select id="ed-league">${lgOpts}</select>` : ''}
      ${policyFields(c)}
      </details>
      <details class="edsec"><summary>Manager and rival</summary>
      ${managerFields(c)}
      ${derbyFields(c)}
      </details>
      <div class="card tap" style="margin:16px 0 0;padding:10px 12px" data-act="edView" data-v="clubx" data-cid="${esc(c.id)}"><div class="row" style="gap:10px"><div style="flex:none">${UI.C.crest(c, 28)}</div><div class="grow"><div class="small b">Crest, money, facilities and supporters</div><div class="tiny dim">${[c.crest ? 'own crest' : '', c.finance ? 'own money' : '', c.facilities ? 'own facilities' : '', c.attr ? 'own supporters' : ''].filter(Boolean).join(' · ') || 'As the game works them out'}</div></div><span class="dim">›</span></div></div>
      <div class="card tap" style="margin:10px 0 0;padding:10px 12px" data-act="edStaff" data-cid="${esc(c.id)}"><div class="row"><div class="grow"><div class="small b">Coaches and scouts</div><div class="tiny dim">${(ED.def.staff || []).filter((s) => s.club === c.id).length} come with this job</div></div><span class="dim">›</span></div></div>
      <div class="card tap" style="margin:10px 0 0;padding:10px 12px" data-act="edSquad" data-cid="${esc(c.id)}"><div class="row"><div class="grow"><div class="small b">Players</div><div class="tiny dim">${playersOf(c.id).length} made for this club</div></div><span class="dim">›</span></div></div>
      ${clubTools(c, sameNat)}
      ${!added ? '<div class="actions" style="margin-top:14px"><button class="btn sm" data-act="edRevertClub">Put the game\'s version back</button></div>' : ''}
      <div class="actions" style="margin-top:14px"><button class="btn sm" data-act="edDelClub">${added ? 'Delete this club' : 'Take this club out of the world'}</button></div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="league" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edSaveClub">Save club</button></div>`;
  };

  // ---------- Library, files and club data packs ----------
  // Worlds kept on this device (in the same storage as saves), a world opened from a file, and club data packs: only the names,
  // crests, kits and grounds of a world, which fit any world and can be made and shared on their own.
  const LIB = 'dblib_';
  const libStore = () => FM.Save.store();
  const libIndex = async () => {
    try {
      return JSON.parse((await libStore().get(LIB + 'index')) || '[]');
    } catch (e) {
      return [];
    }
  };
  const fileName = (name, ext) =>
    `touchline-${String(name || 'world')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')}${ext}`;
  const shareJson = async (text, name, title) => {
    try {
      const r = await FM.Native.shareFile({
        bytes: new TextEncoder().encode(text),
        name,
        type: 'application/json',
        title,
        preferShare: matchMedia('(pointer: coarse)').matches,
      });
      if (r !== 'cancelled') UI.toast(`${r === 'saved' ? 'Saved' : 'Ready'}: ${name}`, 3500);
    } catch (e) {
      UI.toast('⚠️ ' + (e.message || 'Could not save the file'), 4000);
    }
  };
  UI.acts.edLibrary = async () => {
    ED.lib = await libIndex();
    ED.view = 'library';
    ED.err = [];
    UI.worldEditor();
  };
  UI.acts.edLibSave = async () => {
    try {
      const idx = await libIndex(),
        m = ED.def.meta,
        id = 'w' + Date.now().toString(36);
      await libStore().put(LIB + id, WD.stringify(ED.def));
      idx.unshift({
        id,
        name: m.name || 'My world',
        author: m.author || '',
        saved: new Date().toISOString().slice(0, 10),
        clubs: ED.def.clubs.length,
        players: (ED.def.players || []).length,
      });
      await libStore().put(LIB + 'index', JSON.stringify(idx));
      ED.lib = idx;
      ED.err = [];
      UI.toast('Kept in the library', 2000);
    } catch (e) {
      ED.err = ['Could not keep it: ' + (e.message || e)];
    }
    UI.worldEditor();
  };
  UI.acts.edLibOpen = async (d) => {
    try {
      const text = await libStore().get(LIB + d.id);
      if (!text) throw new Error('It is not there any more');
      const def = WD.parse(text);
      const v = WD.validate(def, null);
      if (v.errors.length && !v.errors.every((e) => /is not in the definition|are not supported/.test(e)))
        throw new Error(v.errors[0]);
      ED.def = def;
      ED.view = 'home';
      ED.err = [];
      UI.toast('Opened in the editor', 2000);
    } catch (e) {
      ED.err = ['Could not open it: ' + (e.message || e)];
    }
    UI.worldEditor();
  };
  UI.acts.edLibDel = async (d) => {
    const idx = (await libIndex()).filter((x) => x.id !== d.id);
    await libStore().del(LIB + d.id);
    await libStore().put(LIB + 'index', JSON.stringify(idx));
    ED.lib = idx;
    UI.worldEditor();
  };
  // A world from a file (the same files the new-career screen reads)
  UI.acts.edOpenFile = async () => {
    const picked = await FM.Native.pickFiles(FM.DbImport.accept());
    if (!picked.length) return;
    const r = FM.DbImport.import(picked.map((x) => ({ name: x.name, text: FM.DbImport.decode(x.bytes) })));
    WD.useStatic(null); // (the editor works on the game's own data)
    if (!r.ok) {
      ED.err = r.errors.slice(0, 4);
      return UI.worldEditor();
    }
    ED.def = r.def;
    ED.view = 'home';
    ED.err = [];
    UI.toast(r.notes && r.notes[0] ? r.notes[0] : 'Opened in the editor', 3000);
    UI.worldEditor();
  };
  UI.acts.edPackSave = () =>
    shareJson(
      JSON.stringify(WD.packOf(ED.def), null, 1),
      fileName((ED.def.meta.name || 'world') + '-pack', '.json'),
      'Touchline club data pack',
    );
  UI.acts.edPackApply = async () => {
    const picked = await FM.Native.pickFiles('.json,application/json');
    if (!picked.length) return;
    try {
      const pack = WD.parsePack(FM.DbImport.decode(picked[0].bytes));
      const was = clone(ED.def);
      const rep = WD.applyPack(ED.def, pack);
      if (rep.errors.length) {
        ED.def = was;
        throw new Error(rep.errors[0]);
      }
      ED.err = [];
      UI.toast(
        `Pack applied: ${U.plural(rep.clubs, 'club')}, ${U.plural(rep.leagues, 'league')}, ${U.plural(rep.cups, 'cup')}${rep.unmatched.length ? `; ${U.plural(rep.unmatched.length, 'club')} not in this world` : ''}`,
        4500,
      );
    } catch (e) {
      ED.err = ['Could not apply the pack: ' + (e.message || e)];
    }
    UI.worldEditor();
  };
  // A library of packs: data/packs/index.json on the game's own site lists them, each with its version, author, licence and
  // credits; a pack is added to the library by adding it to that folder. Nothing is fetched until you ask, and nothing from anywhere
  // else (packs a player builds stay on their device: the editor opens them from a file).
  const PACK_INDEXES = ['data/packs/index.json'];
  const packsList = () => {
    if (!ED.packs)
      return `<div class="actions" style="margin-top:0"><button class="btn sm" data-act="edPacksLook">🔎 Look for packs</button></div>`;
    if (ED.packs.error) return `<div class="tiny" style="color:#f87171;line-height:1.5">${esc(ED.packs.error)}</div>`;
    return (
      ED.packs.list
        .map(
          (x, i) =>
            `<div class="card" style="margin:4px 0;padding:10px 12px"><div class="small b">${esc(x.name)} <span class="dim">${esc(x.version || '')}</span></div><div class="tiny dim" style="line-height:1.5">${esc(x.description || '')}</div><div class="tiny" style="margin-top:4px;line-height:1.5">By ${esc(x.author || 'unknown')} · licence ${esc(x.license || 'not stated')}${x.bytes ? ` · ${(x.bytes / 1048576).toFixed(1)} MB` : ''}</div><div class="tiny dim" style="line-height:1.5">${esc(x.credits || '')}</div><div class="actions" style="margin-top:6px"><button class="btn sm pri" data-act="edPackGet" data-i="${i}">Open in the editor</button></div></div>`,
        )
        .join('') || '<div class="empty">No packs are listed.</div>'
    );
  };
  UI.acts.edPacksLook = async () => {
    UI.toast('Looking…', 1500);
    let list = null,
      base = '';
    for (const url of PACK_INDEXES) {
      try {
        const r = await fetch(url);
        if (!r.ok) continue;
        list = await r.json();
        base = url.replace(/index.json$/, '');
        break;
      } catch (e) {
        /* try the next address */
      }
    }
    ED.packs =
      list && Array.isArray(list)
        ? { list, base }
        : { error: 'No list of packs could be reached. Check the connection, or open a pack from a file.' };
    UI.worldEditor();
  };
  UI.acts.edPackGet = async (d) => {
    const x = ED.packs && ED.packs.list[+d.i];
    if (!x) return;
    UI.toast(`Downloading ${x.name}…`, 4000);
    try {
      const r = await fetch(ED.packs.base + x.file);
      if (!r.ok) throw new Error(`the file could not be reached (${r.status})`);
      const res = FM.DbImport.import([{ name: x.file, text: await r.text() }]);
      WD.useStatic(null);
      if (!res.ok) throw new Error(res.errors[0]);
      ED.def = res.def;
      ED.start = clone(ED.def);
      ED.view = 'home';
      ED.tab = 'world';
      ED.err = [];
      UI.toast(`${x.name} ${x.version || ''} opened. Licence: ${x.license || 'not stated'}`, 4500);
    } catch (e) {
      ED.err = ['Could not open the pack: ' + (e.message || e)];
    }
    UI.worldEditor();
  };
  const libraryView =
    () => `<div class="h1" style="margin-top:2vh">Library, files and packs</div><div class="tag">Keep worlds on this device, open one from a file, or share just the names and looks.</div>
      ${errBox()}
      <div class="ng-label">Worlds kept on this device</div>
      ${
        (ED.lib || [])
          .map(
            (x) =>
              `<div class="card" style="margin:4px 0;padding:10px 12px"><div class="row" style="gap:8px"><div class="grow"><div class="small b">${esc(x.name)}</div><div class="tiny dim">${U.plural(x.clubs, 'club')} · ${U.plural(x.players, 'player')} made · kept ${esc(x.saved)}${x.author ? ' · ' + esc(x.author) : ''}</div></div><button class="btn sm" data-act="edLibOpen" data-id="${esc(x.id)}">Open</button><button class="btn sm" data-act="edLibDel" data-id="${esc(x.id)}" aria-label="Delete">✕</button></div></div>`,
          )
          .join('') || '<div class="empty">Nothing kept yet.</div>'
      }
      <div class="actions" style="margin-top:8px"><button class="btn sm pri" data-act="edLibSave">Keep this world here</button></div>
      <div class="ng-label">Files</div>
      <div class="actions" style="margin-top:0"><button class="btn sm" data-act="edOpenFile">📂 Open a world from a file…</button><button class="btn sm" data-act="edExport">⬆️ Save this world as a file</button></div>
      <div class="tiny dim" style="margin-top:6px;line-height:1.5">A world file holds everything you made. Send it to a friend, who opens it here or on the new-career screen.</div>
      <div class="ng-label">Packs to download <span class="tiny dim">· worlds other people made, listed in the game's packs folder</span></div>
      ${packsList()}
      <div class="ng-label">Club data packs</div>
      <div class="actions" style="margin-top:0"><button class="btn sm" data-act="edPackApply">Apply a pack…</button><button class="btn sm" data-act="edPackSave">Make a pack of this world</button></div>
      <div class="tiny dim" style="margin-top:6px;line-height:1.5">A pack holds only the names, short names, nicknames, cities, colours, crests, kits and grounds of the clubs, the names of the leagues and cups, and the national teams' names and colours. It fits any world: clubs are matched by id, and nothing about ratings, players or rules changes. A pack of real club names can be made once and shared.</div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="home" aria-label="Back">←</button></div>`;

  // ---------- Importing players ----------
  // A CSV (or a JSON list) of real players' season numbers becomes players through the real-stats converter (js/realstats.js):
  // columns name, pos, nat, born or age, club, foot, contract, minutes, goals, assists, xg, passes, tackles, saves and so on.
  const SAMPLE_CSV = [
    'name,nat,born,pos,club,minutes,goals,assists,xg,passes,tackles',
    'Marco Verdi,ITA,1999,ST,,2400,16,5,14.2,310,18',
    'Jonas Berg,GER,2001,CM,,2900,4,7,3.1,1650,70',
    'Sam Okoro,NGA,1996,CB,,3100,2,1,1.4,1400,55',
  ].join('\n');
  UI.acts.edImportPlayers = (d) => {
    const here = ED.view === 'squad' && d.from !== 'home' ? ED.cid : 'column';
    ED.imp = { from: ED.view, target: here, text: ED.imp ? ED.imp.text : '', report: null };
    ED.view = 'importp';
    ED.err = [];
    UI.worldEditor();
  };
  UI.acts.edImpSample = () => {
    $('#ed-imptext').value = SAMPLE_CSV;
  };
  UI.acts.edImpRun = () => {
    const text = (($('#ed-imptext') || {}).value || '').trim();
    ED.imp.text = text;
    ED.imp.target = $('#ed-imptarget').value;
    if (!text) {
      ED.err = ['Paste a CSV or pick a file first'];
      return UI.worldEditor();
    }
    let rows;
    try {
      rows = text.startsWith('[') || text.startsWith('{') ? [].concat(JSON.parse(text)) : FM.RealStats.parseCSV(text);
    } catch (e) {
      ED.err = ['The file could not be read: ' + e.message];
      return UI.worldEditor();
    }
    const target = ED.imp.target === 'column' ? 'column' : ED.imp.target === FREE ? null : ED.imp.target;
    const pr = FM.HistImport.playerRows(ED.def, rows, { year: yearOf(), club: target });
    const r = WD.editor(ED.def, null).importPlayers(pr.rows);
    ED.imp.report = { added: r.added, unmatched: pr.unmatched, errors: r.errors, rows: rows.length };
    ED.err = [];
    UI.worldEditor();
  };
  const importView = () => {
    const imp = ED.imp || { target: 'column', text: '', report: null },
      c = ED.def.clubs.find((x) => x.id === imp.target);
    const rp = imp.report;
    return `<div class="h1" style="margin-top:2vh">Import players</div><div class="tag">A spreadsheet (CSV) or JSON list of real players' season numbers. Each row becomes a player: the converter turns the numbers into attributes, ability and potential, judged against the strength of his league.</div>
      ${errBox()}
      <div class="ng-label">Where they go</div>
      <select id="ed-imptarget"><option value="column" ${imp.target === 'column' ? 'selected' : ''}>The club in each row (no club: a free agent)</option><option value="${FREE}" ${imp.target === FREE ? 'selected' : ''}>Free agents</option>${c ? `<option value="${esc(c.id)}" selected>${esc(c.name)}</option>` : ''}</select>
      <div class="ng-label">The file</div>
      <input type="file" id="ed-impfile" accept=".csv,.json,text/csv,application/json">
      <textarea id="ed-imptext" rows="8" spellcheck="false" placeholder="name,nat,born,pos,club,minutes,goals,assists,xg,passes,tackles" style="width:100%;margin-top:8px;font-family:monospace;font-size:12px">${esc(imp.text)}</textarea>
      <div class="tiny dim" style="margin-top:6px;line-height:1.5">Columns: name, pos (ST, W, AM, CM, DM, FB, CB, GK or the usual abbreviations), nat, born or age, club (its name, short name or id), foot, contract, and the numbers you have: minutes, goals, assists, xg, xa, shots, passes, passPct, keyPasses, tackles, interceptions, clearances, dribbles, aerials, pressures, saves, savePct, goalsConceded, rating. Counts are season totals.</div>
      ${
        rp
          ? `<div class="card" style="margin-top:12px;padding:10px 12px"><div class="small b">${rp.added} of ${U.plural(rp.rows, 'player')} added</div>${
              rp.unmatched.length
                ? `<div class="tiny" style="color:#fbbf24;margin-top:6px;line-height:1.5">Clubs not found, rows left out: ${esc(rp.unmatched.slice(0, 10).join(', '))}</div>`
                : ''
            }${
              rp.errors.length
                ? `<div class="tiny" style="color:#f87171;margin-top:6px;line-height:1.5">${rp.errors
                    .slice(0, 6)
                    .map((e) => '• ' + esc(e))
                    .join('<br>')}${rp.errors.length > 6 ? `<br>… and ${rp.errors.length - 6} more` : ''}</div>`
                : ''
            }</div>`
          : ''
      }
      <div class="actions" style="margin-top:12px"><button class="btn sm" data-act="edImpSample">Fill in a sample</button></div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="${imp.from === 'squad' ? 'squad' : 'home'}" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edImpRun">Import</button></div>`;
  };

  // ---------- Players ----------
  // A club's players in the definition (the ones you made: the game's own are generated when the world is built). Each added
  // player takes the place of the weakest in his position group once the squad is full; a club given 11 or more players
  // loses its generated squad when the world "replaces" squads (the choice on the first screen).
  const FREE = '__free__'; // the squad screen's "club" for players who have none
  const playersOf = (cid) => ED.def.players.filter((p) => (p.club || null) === (cid === FREE ? null : cid));
  const yearOf = () => ED.def.meta.startYear || D.SEASON_START;
  const abilityOf = (attrs, pos) => FM.W.calcCA({ attrs }, pos);
  // Attributes for a position at an ability: the ones the position's rating weighs most come out highest
  const suggest = (pos, ca) => {
    const w = D.RATE_W[pos] || D.RATE_W.CM,
      max = Math.max(...Object.values(w));
    const avg = (ca - (D.RATE_OFF[pos] || 0)) / 5;
    const attrs = {};
    for (const k of D.ATTRS) attrs[k] = Math.max(1, Math.min(20, Math.round(avg + ((w[k] || 0) / max - 0.45) * 5)));
    // nudge the attributes one step at a time, the ones that matter most for the position first, until the rating matches
    const keys = D.ATTRS.filter((k) => (w[k] || 0) > 0.2).sort((x, y) => w[y] - w[x]),
      start = { ...attrs };
    for (let i = 0; i < 400; i++) {
      const diff = ca - abilityOf(attrs, pos);
      if (!diff) break;
      const up = diff > 0;
      // the attribute that has moved least from its starting value (in the direction wanted), heavier weights first
      const k = keys
        .filter((x) => (up ? attrs[x] < 20 : attrs[x] > 1))
        .sort((x, y) =>
          up ? attrs[x] - start[x] - (attrs[y] - start[y]) : attrs[y] - start[y] - (attrs[x] - start[x]),
        )[0];
      if (!k) break;
      attrs[k] += up ? 1 : -1;
      if (Math.abs(ca - abilityOf(attrs, pos)) > Math.abs(diff)) {
        attrs[k] -= up ? 1 : -1;
        break;
      }
    }
    return attrs;
  };
  UI.acts.edSquad = (d) => {
    ED.view = 'squad';
    if (d.cid !== undefined) ED.cid = d.cid;
    ED.err = [];
    UI.worldEditor();
  };
  UI.acts.edAddPlayer = () => {
    const c = ED.cid === FREE ? null : ED.def.clubs.find((x) => x.id === ED.cid),
      year = yearOf(),
      pos = 'CM',
      ca = c ? Math.max(25, Math.min(85, Math.round(c.rep * 0.8))) : 50;
    const r = WD.editor(ED.def, null).addPlayer({
      fn: 'New',
      ln: 'Player',
      nat: (c && c.nat) || 'ENG',
      pos,
      born: year - 24,
      foot: 'Right',
      attrs: suggest(pos, ca),
      pa: ca + 4,
      club: c ? c.id : null,
      contract: year + (c ? 3 : 1),
    });
    ED.err = r.ok ? [] : r.errors;
    if (r.ok) ((ED.view = 'player'), (ED.pid = r.id));
    UI.worldEditor();
  };
  UI.acts.edFindPlayer = (d) => {
    ED.cid = d.cid;
    UI.acts.edPlayer(d);
  };
  UI.acts.edPlayer = (d) => {
    ED.view = 'player';
    ED.pid = d.pid;
    ED.err = [];
    UI.worldEditor();
  };
  UI.acts.edDelPlayer = () => {
    WD.editor(ED.def, null).removePlayer(ED.pid);
    ED.view = 'squad';
    ED.err = [];
    UI.worldEditor();
  };
  // Fill the attribute sliders for the position and ability on screen (nothing is saved until Save player)
  UI.acts.edSuggest = () => {
    const pos = $('#ed-pos').value,
      ca = Math.round(+$('#ed-ca').value);
    const a = suggest(pos, ca);
    for (const k of D.ATTRS) {
      $('#ed-a-' + k).value = a[k];
      $('#ed-av-' + k).textContent = a[k];
    }
    showAbility();
  };
  const readAttrs = () => Object.fromEntries(D.ATTRS.map((k) => [k, Math.round(+$('#ed-a-' + k).value)]));
  const showAbility = () => {
    const ca = abilityOf(readAttrs(), $('#ed-pos').value),
      pa = $('#ed-pa');
    $('#ed-cav').textContent = ca;
    if (+pa.value < ca) {
      pa.value = ca;
      $('#ed-pav').textContent = ca;
    }
    pa.min = ca;
  };
  UI.acts.edSavePlayer = () => {
    const v = (id) => ($('#ed-' + id) || {}).value;
    const r = WD.editor(ED.def, null).updatePlayer(ED.pid, {
      fn: (v('fn') || '').trim(),
      ln: (v('ln') || '').trim(),
      nat: v('nat'),
      pos: v('pos'),
      born: yearOf() - Math.round(+v('age')),
      foot: v('foot'),
      contract: Math.round(+v('contract')) || null,
      pa: Math.round(+v('pa')),
      callup: $('#ed-pcall').checked || undefined,
      attrs: readAttrs(),
    });
    if (!r.ok) {
      ED.err = r.errors;
      return UI.worldEditor();
    }
    ED.view = 'squad';
    ED.err = [];
    UI.toast('Player saved', 1500);
    UI.worldEditor();
  };
  UI.acts.edRule = (d) => {
    const v = d.v === 'true' ? true : d.v === 'false' ? false : +d.v;
    ED.def.rules[d.k] = v;
    UI.worldEditor();
  };
  // Cup names: the domestic cups, the continental cups and the Club World Cup, renamed through the definition's competitions
  // (domestic cups: the game's, then the ones the definition adds)
  const outCups = () => new Set(ED.def.removeCups || []);
  const domCups = () => [
    ...D.DOMESTIC_CUPS.map(([id, nat, name, short]) => ({ id, nat, name, short, removed: outCups().has(id) })),
    ...(ED.def.competitions || [])
      .filter((c) => c.isNew && c.kind !== 'cont')
      .map((c) => ({ id: c.id, nat: c.nat, name: c.name, short: c.short, isNew: true })),
  ];
  const cupList = () => [
    ...domCups().map((c) => ({
      id: c.id,
      name: c.name,
      short: c.short,
      isNew: c.isNew,
      removed: c.removed,
      group: (D.NATIONS[c.nat] || {}).name || c.nat,
    })),
    ...D.CONTINENTALS.map((c) => ({ id: c.id, name: c.name, short: c.short, group: 'Continental' })),
    ...(ED.def.competitions || [])
      .filter((c) => c.isNew && c.kind === 'cont')
      .map((c) => ({ id: c.id, name: c.name, short: c.short, isNew: true, group: 'Continental' })),
    ...D.EURO_CUPS.map((c) => ({ id: c.id, name: c.name, short: c.short, group: 'Continental' })),
    { id: 'CWC', name: 'FIFA Club World Cup', short: 'CWC', group: 'Continental' },
  ];
  // The cup's entry in the definition (its name, short name and, for the cups that have one, its format)
  const compOf = (id) => (ED.def.competitions || []).find((c) => c.id === id);
  const ROUND = { 2: 'Final', 4: 'Semi-finals', 8: 'Quarter-finals', 16: 'Round of 16' };
  const fmtNow = (id) => (compOf(id) && compOf(id).format) || WD.formatOf(id);
  const roundList = (list) =>
    [...list]
      .sort((a, b) => b - a)
      .map((n) => ROUND[n] || `last ${n}`)
      .join(', ');
  const fmtLine = (id) => {
    const f = fmtNow(id),
      kind = WD.cupKind(id, ED.def);
    if (!f) return 'Name only';
    if (kind === 'cont') {
      const leg = (k, n) => `${n} ${f.legs[k] === 2 ? 'two legs' : 'one leg'}`;
      return `${leg('qf', 'QF')} · ${leg('sf', 'SF')} · ${leg('f', 'final')}${f.central ? ' · one venue' : ''}`;
    }
    const bits = [];
    if ((f.legs || []).length) bits.push('two legs: ' + roundList(f.legs));
    if (f.neutral === 'all') bits.push('every tie neutral');
    else if ((f.neutral || []).length) bits.push('neutral: ' + roundList(f.neutral));
    return bits.join(' · ') || 'Single matches at the home ground';
  };
  UI.acts.edCup = (d) => {
    ED.view = 'cup';
    ED.cup = d.cup;
    ED.err = [];
    UI.worldEditor();
  };
  // Change a cup's format through the validated call; the screen draws again
  const setFormat = (format) => {
    const r = WD.editor(ED.def, null).setCup(ED.cup, { format });
    ED.err = r.ok ? [] : r.errors;
    UI.worldEditor();
  };
  UI.acts.edCupRound = (d) => {
    const f = clone(fmtNow(ED.cup)),
      r = +d.r,
      earlier = f.neutral === 'all';
    f.legs = (f.legs || []).filter((n) => n !== r);
    const neutral = (earlier ? [16, 8, 4, 2] : (f.neutral || []).slice()).filter((n) => n !== r);
    if (d.v === 'two') f.legs.push(r);
    else if (d.v === 'neutral') neutral.push(r);
    // (every tie neutral covers every round: one round put back to a home ground ends that)
    f.neutral = earlier && d.v !== 'single' ? 'all' : neutral;
    setFormat(f);
  };
  UI.acts.edCupEarlier = (d) => {
    const f = clone(fmtNow(ED.cup));
    if (d.v === 'neutral') f.neutral = 'all';
    else if (f.neutral === 'all') f.neutral = [16, 8, 4, 2].filter((n) => !(f.legs || []).includes(n));
    setFormat(f);
  };
  UI.acts.edCupLegs = (d) => {
    const f = clone(fmtNow(ED.cup));
    f.legs[d.k] = +d.n;
    setFormat(f);
  };
  UI.acts.edCupPlay = (d) => {
    const f = clone(fmtNow(ED.cup));
    f.play = f.play || {};
    if (d.v === '') delete f.play[d.k];
    else f.play[d.k] = d.v === 'true' ? true : d.v === 'false' ? false : +d.v;
    if (!Object.keys(f.play).length) delete f.play;
    setFormat(f);
  };
  UI.acts.edCupGroup = (d) => {
    const f = clone(fmtNow(ED.cup));
    f.groupSize = +d.n;
    setFormat(f);
  };
  UI.acts.edCupDrop = (d, el) => {
    const f = clone(fmtNow(ED.cup));
    if (el.value) f.drop = el.value;
    else delete f.drop;
    setFormat(f);
  };
  UI.acts.edCupCentral = (d) => {
    const f = clone(fmtNow(ED.cup));
    f.central = d.v === 'true';
    setFormat(f);
  };
  UI.acts.edCupTiers = (d) => {
    const f = clone(fmtNow(ED.cup));
    f.tiers = +d.n;
    setFormat(f);
  };
  // The prize fund is saved as you type it
  const saveCupPrize = () => {
    const v = +(($('#ed-cupprize') || {}).value || 0) * 1e6;
    if (!(v >= 1e5 && v <= 1e9)) return;
    WD.editor(ED.def, null).setCup(ED.cup, { format: { ...clone(fmtNow(ED.cup)), prize: v } });
  };
  UI.acts.edDelCup = () => {
    for (const l of ED.def.leagues)
      if (l.rules && l.rules.qualify && l.rules.qualify.to === ED.cup) delete l.rules.qualify;
    WD.editor(ED.def, null).removeCup(ED.cup);
    ED.view = 'cups';
    UI.worldEditor();
  };
  // A cup for a nation that has none (it needs eight clubs in fully or lightly simulated leagues)
  const cupNations = () => {
    const have = new Set(
      domCups()
        .filter((c) => !c.removed)
        .map((c) => c.nat),
    );
    return natEntries()
      .filter(([code]) => !have.has(code))
      .map(([code, n]) => {
        const lgs = new Set(
          ED.def.leagues.filter((l) => l.nat === code && (l.sim || 'full') !== 'minimal').map((l) => l.id),
        );
        return [code, n, ED.def.clubs.filter((c) => lgs.has(c.league)).length];
      })
      .filter(([, , n]) => n >= 8)
      .sort((a, b) => a[1].name.localeCompare(b[1].name));
  };
  UI.acts.edNewCup = () => {
    ED.view = 'newcup';
    ED.newKind = 'domestic';
    ED.err = [];
    UI.worldEditor();
  };
  UI.acts.edCreateCup = () => {
    const v = (id) => ($('#ed-' + id) || {}).value;
    const nat = v('ncnat'),
      name = (v('ncname') || '').trim(),
      short = (v('ncshort') || '').trim().toUpperCase();
    let id = 'CUP' + nat;
    for (let i = 2; ED.def.competitions.some((c) => c.id === id) || D.DOMESTIC_CUPS.some((c) => c[0] === id); i++)
      id = 'CUP' + nat + i;
    const r = WD.editor(ED.def, null).addCup({ id, nat, name, short: short || id.slice(3, 7) });
    ED.err = r.ok ? [] : r.errors;
    if (r.ok) ((ED.view = 'cup'), (ED.cup = id));
    UI.worldEditor();
  };
  const newCupView = () => {
    const nats = cupNations(),
      kind = ED.newKind || 'domestic';
    const kinds = segV('edNewKind', kind, [
      ['domestic', 'A cup for a nation'],
      ['cont', 'A continental competition'],
    ]);
    if (kind === 'cont')
      return `<div class="h1" style="margin-top:2vh">Add a competition</div><div class="tag">A continental competition of a part of the world, in one of four tiers.</div>
      ${kinds}
      ${errBox()}
      <div class="ng-label">Name</div><input type="text" id="ed-ccname" maxlength="48" placeholder="e.g. Pacific Champions League">
      <div class="ng-label">Short name</div><input type="text" id="ed-ccshort" maxlength="6" placeholder="e.g. PAC1">
      <div class="ng-label">Part of the world</div><select id="ed-ccregion">${WD.REGIONS.map((r) => `<option>${r}</option>`).join('')}</select>
      <div class="ng-label">Tier</div><select id="ed-cctier">${[1, 2, 3, 4].map((t) => `<option value="${t}" ${t === 2 ? 'selected' : ''}>Tier ${t} · ${['Champions Cup', 'Shield (the next places)', 'Trophy (the places after that)', 'Regional cup'][t - 1]}</option>`).join('')}</select>
      <div class="tiny dim" style="margin-top:6px;line-height:1.5">Tier 1 takes the places leagues send to it (set on each league's screen, like the Champions Cup). Tiers 2 to 4 name the leagues that feed them and how many clubs each sends, after the cups above have taken theirs: tier 2 is the Europa League's place, tier 3 the Conference League's, tier 4 a small regional cup. Every cup has a group stage and knockouts.</div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="cups" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edCreateCont">Add the competition</button></div>`;
    return `<div class="h1" style="margin-top:2vh">Add a competition</div><div class="tag">A knockout cup for a nation that has none. Every club in its fully or lightly simulated leagues enters.</div>
      ${kinds}
      ${errBox()}
      ${
        nats.length
          ? `<div class="ng-label">Nation</div><select id="ed-ncnat">${nats.map(([k, n, c]) => `<option value="${k}">${n.flag} ${esc(n.name)} · ${U.plural(c, 'club')}</option>`).join('')}</select>
      <div class="ng-label">Name</div><input type="text" id="ed-ncname" maxlength="48" placeholder="e.g. National Cup">
      <div class="ng-label">Short name</div><input type="text" id="ed-ncshort" maxlength="6" placeholder="e.g. NC">`
          : '<div class="empty">Every nation with eight or more clubs in simulated leagues has a cup already.</div>'
      }
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="cups" aria-label="Back">←</button>${nats.length ? '<button class="btn sm pri grow" data-act="edCreateCup">Add the cup</button>' : ''}</div>`;
  };
  // A domestic cup of the game's own taken out of the world, or put back
  UI.acts.edCupOut = () => {
    ED.def.removeCups = [...new Set([...(ED.def.removeCups || []), ED.cup])];
    ED.def.competitions = (ED.def.competitions || []).filter((x) => x.id !== ED.cup);
    UI.worldEditor();
  };
  UI.acts.edCupBack = () => {
    ED.def.removeCups = (ED.def.removeCups || []).filter((id) => id !== ED.cup);
    UI.worldEditor();
  };
  UI.acts.edCupReset = () => {
    ED.def.competitions = (ED.def.competitions || []).filter((x) => x.id !== ED.cup);
    ED.view = 'cups';
    UI.worldEditor();
  };
  // The names are saved as you type them (an empty name keeps the last one)
  // A cup's name checked as it is typed: a rude word, a name or short name another cup has
  const cupWarn = (c) => {
    const name = String((($('#ed-cupname') || {}).value ?? c.name) || '').trim(),
      short = String((($('#ed-cupshort') || {}).value ?? c.short) || '')
        .trim()
        .toUpperCase();
    const others = cupList().filter((x) => x.id !== c.id && !x.removed);
    const w = [];
    if (name && others.some((x) => x.name.toLowerCase() === name.toLowerCase()))
      w.push('Another cup has the same name.');
    if (short && others.some((x) => (x.short || '').toUpperCase() === short))
      w.push(`Another cup is already "${short}".`);
    if (D.isRude(name) || D.isRude(short)) w.push('That name is one the game will not use: it contains a rude word.');
    return w.length
      ? `<div class="tiny" style="color:#fbbf24;margin:6px 0;line-height:1.5">${w.map((x) => `⚠️ ${esc(x)}`).join('<br>')}</div>`
      : '';
  };
  const saveCupNames = () => {
    const name = (($('#ed-cupname') || {}).value || '').trim(),
      short = (($('#ed-cupshort') || {}).value || '').trim();
    const c = cupList().find((x) => x.id === ED.cup);
    if (!c || !name) return;
    const o = compOf(c.id);
    if (!o && name === c.name && (!short || short === c.short)) return;
    WD.editor(ED.def, null).setCup(c.id, { name, short: short || c.short });
  };
  const cupsView = () => {
    let last = '';
    return `<div class="h1" style="margin-top:2vh">Cups</div><div class="tag">Rename a cup or change how its knockouts are played. Tap one.</div>
      ${cupList()
        .map((c) => {
          const o = compOf(c.id) || c,
            head = c.group !== last ? `<div class="ng-label">${esc(c.group)}</div>` : '';
          last = c.group;
          return `${head}<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edCup" data-cup="${c.id}"><div class="row"><div class="grow"><div class="small b">${esc(o.name)}</div><div class="tiny dim">${c.removed ? 'Taken out of the world' : esc(fmtLine(c.id))}</div></div><span class="dim">›</span></div></div>`;
        })
        .join('')}
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="home" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edNewCup">＋ Add a cup</button></div>`;
  };
  const seg = (act, cur, opts, extra = '', key = 'v') =>
    `<div class="seg" style="margin:0">${opts.map(([v, t]) => `<button class="${cur === v ? 'on' : ''}" data-act="${act}" ${extra} data-${key}="${v}">${t}</button>`).join('')}</div>`;
  const cupView = () => {
    const c = cupList().find((x) => x.id === ED.cup);
    if (!c) return cupsView();
    const o = compOf(c.id) || c,
      kind = WD.cupKind(c.id, ED.def),
      f = fmtNow(c.id);
    let body = '<div class="tiny dim" style="line-height:1.5;margin-top:10px">This cup has no format to change.</div>';
    if (kind === 'opts') {
      const all = f.neutral === 'all';
      body = `<div class="ng-label">Earlier rounds <span class="tiny dim">· before the round of 16</span></div>${seg(
        'edCupEarlier',
        all ? 'neutral' : 'single',
        [
          ['single', 'At the home ground'],
          ['neutral', 'Neutral ground'],
        ],
      )}
        ${[16, 8, 4, 2]
          .map((r) => {
            const cur = (f.legs || []).includes(r)
              ? 'two'
              : all || (f.neutral || []).includes(r)
                ? 'neutral'
                : 'single';
            return `<div class="tiny dim" style="margin:10px 0 4px">${ROUND[r]}</div>${seg(
              'edCupRound',
              cur,
              [
                ['single', 'One match'],
                ['neutral', 'Neutral'],
                ['two', 'Two legs'],
              ],
              `data-r="${r}"`,
            )}`;
          })
          .join('')}
        <div class="tiny dim" style="margin-top:8px;line-height:1.5">One match is played at the home of the club drawn first, with extra time and penalties. A neutral match is the same at a neutral ground. Two legs are home and away. The calendar makes room for the extra days.</div>`;
    } else if (kind === 'cont') {
      body = `${[
        ['qf', 'Quarter-finals'],
        ['sf', 'Semi-finals'],
        ['f', 'Final'],
      ]
        .map(
          ([k, t]) =>
            `<div class="tiny dim" style="margin:10px 0 4px">${t}</div>${seg(
              'edCupLegs',
              f.legs[k],
              [
                [1, 'One match'],
                [2, 'Two legs'],
              ],
              `data-k="${k}"`,
              'n',
            )}`,
        )
        .join('')}
        <div class="tiny dim" style="margin:10px 0 4px">Clubs in a group</div>${seg(
          'edCupGroup',
          f.groupSize || 4,
          [
            [3, 'Three'],
            [4, 'Four'],
            [5, 'Five'],
            [6, 'Six'],
          ],
          '',
          'n',
        )}<div class="tiny dim" style="margin-top:4px;line-height:1.5">Groups of three and four play home and away, five and six once each (the six group days). The two best of each group go through; with eight groups or more the best runners-up fill the quarter-finals. Clubs beyond whole groups wait for another year.</div>
        <div class="tiny dim" style="margin:10px 0 4px">Knockouts at one venue</div>${seg('edCupCentral', !!f.central, [
          [false, 'No'],
          [true, 'Yes'],
        ])}
        ${(() => {
          const reg = contRegion(c.id),
            tier = contTier(c.id),
            below = [1, 2, 3, 4].filter((t) => t > tier).flatMap((t) => contsOf(reg, t));
          return below.length
            ? `<div class="tiny dim" style="margin:10px 0 4px">Clubs that finish third in a group</div><select data-input="edCupDrop" style="width:100%"><option value="">Are out of the competition</option>${below
                .map(
                  (x) =>
                    `<option value="${x.id}" ${f.drop === x.id ? 'selected' : ''}>Drop into the ${esc(x.name)}</option>`,
                )
                .join(
                  '',
                )}</select><div class="tiny dim" style="margin-top:4px;line-height:1.5">The third-placed clubs play the runners-up of the other cup's groups, one match at the runner-up's ground, for a place in its quarter-finals (a day of its own before the knockouts). The cup they drop into needs four groups.</div>`
            : '';
        })()}
        <div class="tiny dim" style="margin-top:8px;line-height:1.5">The group stage is the same everywhere. Two-legged ties need the world's two-legged knockouts rule (on the first screen); without it every tie is one match.</div>`;
    }
    // the competition's own rules, where they differ from the world's
    const pl = f && f.play ? f.play : {};
    const rules = kind
      ? `<div class="ng-label">Rules of this cup <span class="tiny dim">· the world has ${worldRule('win')} points for a win and ${worldRule('subs')} substitutes</span></div>
        <div class="tiny dim" style="margin:6px 0 4px">Substitutes</div>${playSeg('edCupPlay', 'subs', pl.subs, [
          [3, '3'],
          [5, '5'],
          [7, '7'],
        ])}
        <div class="tiny dim" style="margin:10px 0 4px">Level after 90 minutes</div>${playSeg(
          'edCupPlay',
          'extraTime',
          pl.extraTime,
          [
            [true, 'Extra time'],
            [false, 'Straight to penalties'],
          ],
        )}
        <div class="tiny dim" style="margin:10px 0 4px">Away goals in a two-legged tie</div>${playSeg(
          'edCupPlay',
          'awayGoals',
          pl.awayGoals,
          [
            [false, 'Do not count'],
            [true, 'Count'],
          ],
        )}
        ${
          kind === 'cont'
            ? `<div class="tiny dim" style="margin:10px 0 4px">Points for a win in the groups</div>${playSeg(
                'edCupPlay',
                'win',
                pl.win,
                [
                  [2, '2'],
                  [3, '3'],
                ],
              )}`
            : ''
        }
        <div class="tiny dim" style="margin-top:6px;line-height:1.5">Away goals only matter where a round is played over two legs, and a round played over two legs needs the world's two-legged knockouts rule.</div>`
      : '';
    const entry =
      kind === 'opts' && c.group !== 'Continental'
        ? `<div class="ng-label">Who enters</div>${seg(
            'edCupTiers',
            f.tiers || 0,
            [
              [0, 'Every division'],
              [1, 'Top flight'],
              [2, 'Top two'],
              [3, 'Top three'],
            ],
            '',
            'n',
          )}<div class="tiny dim" style="margin-top:6px;line-height:1.5">Clubs of minimal leagues never enter. With fewer than eight clubs in the chosen divisions the cup is open to all.</div>`
        : '';
    const prize = kind
      ? `<div class="ng-label">Prize fund <span class="tiny dim">· millions; the winner and the clubs that play share it</span></div><input type="number" id="ed-cupprize" min="0.1" max="1000" step="0.5" inputmode="decimal" value="${(f.prize || 3e6) / 1e6}">`
      : '';
    return `<div class="h1" style="margin-top:2vh">${esc(o.name)}</div><div class="tag">${esc(c.group)}${kind === 'cont' ? ` · tier ${contTier(c.id)} · ${esc(contRegion(c.id) || '')}` : ''}</div>
      ${errBox()}
      <div id="ed-cupwarn">${cupWarn(c)}</div>
      <div class="ng-names"><input type="text" id="ed-cupname" maxlength="48" value="${esc(o.name)}"><input type="text" id="ed-cupshort" maxlength="6" style="max-width:84px" value="${esc(o.short || c.short)}"></div>
      ${body}
      ${kind === 'cont' ? contFeeders(c, f) : ''}
      ${rules}
      ${entry}
      ${prize}
      <div class="actions" style="margin-top:14px">${
        c.isNew
          ? '<button class="btn sm" data-act="edDelCup">Delete this cup</button>'
          : c.removed
            ? '<button class="btn sm" data-act="edCupBack">Put this cup back in the world</button>'
            : '<button class="btn sm" data-act="edCupReset">Put the game\'s name and format back</button>' +
              (kind === 'opts' && c.group !== 'Continental'
                ? ' <button class="btn sm" data-act="edCupOut">Take this cup out of the world</button>'
                : '')
      }</div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="cups" aria-label="Back">←</button></div>`;
  };

  // ---------- The season calendar ----------
  // When each competition is played, in league rounds on the game's 22-round scale (the season's days stretch to a longer league
  // season, and a competition's days that would fall together spread over the following weeks). Kept in the definition as
  // calendar { preseason, cup, cont, world, intl }.
  const calNow = () => clone({ ...WD.calendarNow(), ...(ED.def.calendar || {}) });
  const calSet = (c) => {
    const bad = WD.validateCalendar(c);
    ED.err = bad;
    if (!bad.length) ED.def.calendar = c;
    UI.worldEditor();
  };
  const calendarSummary = () => {
    const c = ED.def.calendar,
      cur = WD.calendarNow();
    return c && Object.keys(c).some((k) => JSON.stringify(c[k]) !== JSON.stringify(cur[k]))
      ? 'changed · pre-season, cups, continental stages and breaks'
      : 'when the cups and breaks are played';
  };
  const CONT_NAME = {
    G1: 'Group day 1',
    G2: 'Group day 2',
    G3: 'Group day 3',
    G4: 'Group day 4',
    G5: 'Group day 5',
    G6: 'Group day 6',
    QF1: 'Quarter-final, first leg',
    QF2: 'Quarter-final, second leg',
    SF1: 'Semi-final, first leg',
    SF2: 'Semi-final, second leg',
    F: 'Final',
  };
  const WORLD_NAME = { QF: 'Quarter-finals', SF: 'Semi-finals', F: 'Final' };
  const calendarView = () => {
    const c = calNow(),
      cur = WD.calendarNow();
    const mover = (kind, key, round, label) =>
      `<div class="row" style="gap:8px;margin:4px 0"><div class="grow small">${esc(label)}</div><button class="btn sm" data-act="edCalMove" data-kind="${kind}" data-key="${esc(key)}" data-d="-1" aria-label="Earlier">‹</button><b style="min-width:92px;text-align:center" class="small">after round ${round + 1}</b><button class="btn sm" data-act="edCalMove" data-kind="${kind}" data-key="${esc(key)}" data-d="1" aria-label="Later">›</button></div>`;
    // the season at a glance: what falls after each round
    const at = Array.from({ length: 22 }, () => []);
    c.cup.forEach((r) => at[r].push('Cup'));
    Object.entries(c.cont).forEach(([st, r]) => at[r].push(st));
    Object.entries(c.world).forEach(([st, r]) => at[r].push('CWC ' + st));
    c.intl.forEach((r) => at[r].push('Break'));
    const glance = `<div class="card flat" style="padding:4px 10px;margin-top:6px">${at
      .map(
        (ev, r) =>
          `<div class="row tiny" style="padding:3px 0;border-top:${r ? '1px solid var(--line)' : '0'}"><span class="dim" style="width:64px">Round ${r + 1}</span><span class="grow">${ev.length ? ev.map(esc).join(' · ') : '<span class="dim">·</span>'}</span></div>`,
      )
      .join('')}</div>`;
    return `<div class="h1" style="margin-top:2vh">Season calendar</div><div class="tag">When the cups and international breaks fall. Rounds are counted on the game's 22-round scale; a longer league season stretches them to fit.</div>
      ${errBox()}
      <div class="ng-label">Pre-season</div>${seg(
        'edCalPre',
        c.preseason,
        [1, 2, 3, 4, 5, 6].map((n) => [n, `${n} day${n === 1 ? '' : 's'}`]),
        '',
        'n',
      )}
      <div class="ng-label">Domestic cup rounds <span class="tiny dim">· ${c.cup.length}</span></div>
      ${c.cup.map((r, i) => mover('cup', String(i), r, `Round ${i + 1}`)).join('')}
      <div class="actions" style="margin-top:6px"><button class="btn sm" data-act="edCalCup" data-d="1">＋ Add a cup round</button><button class="btn sm" data-act="edCalCup" data-d="-1">− Take the last away</button></div>
      <div class="tiny dim" style="margin-top:4px;line-height:1.5">The biggest cup needs a day for each of its rounds; the game adds days when a cup has more than you give it.</div>
      <div class="ng-label">Continental club cups</div>
      ${WD.CONT_STAGES.map((st) => mover('cont', st, c.cont[st], CONT_NAME[st])).join('')}
      <div class="ng-label">Club World Cup</div>
      ${WD.WORLD_STAGES.map((st) => mover('world', st, c.world[st], WORLD_NAME[st])).join('')}
      <div class="ng-label">International breaks <span class="tiny dim">· two matchdays each</span></div>
      ${c.intl.map((r, i) => mover('intl', String(i), r, `Break ${i + 1}`)).join('')}
      <div class="ng-label">The season at a glance</div>${glance}
      <div class="tiny dim" style="margin-top:8px;line-height:1.5">${JSON.stringify(c) === JSON.stringify(cur) ? 'As the game has it.' : "Changed from the game's own calendar."} At most one cup day falls between two league rounds: a day that would fall with another moves to the next gap.</div>
      <div class="actions" style="margin-top:12px"><button class="btn sm" data-act="edCalReset">Put the game's calendar back</button></div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="home" aria-label="Back">←</button></div>`;
  };
  UI.acts.edCalPre = (d) => {
    const c = calNow();
    c.preseason = +d.n;
    calSet(c);
  };
  UI.acts.edCalMove = (d) => {
    const c = calNow(),
      step = +d.d;
    if (d.kind === 'cup' || d.kind === 'intl') {
      c[d.kind][+d.key] += step;
      if (d.kind === 'cup') c.cup.sort((a, b) => a - b);
    } else c[d.kind][d.key] += step;
    calSet(c);
  };
  UI.acts.edCalCup = (d) => {
    const c = calNow();
    if (+d.d > 0) {
      const free = Array.from({ length: 22 }, (_, i) => i).find((i) => i > Math.max(...c.cup) && !c.cup.includes(i));
      if (free === undefined) {
        ED.err = ['The season has no later round to add a cup round to'];
        return UI.worldEditor();
      }
      c.cup.push(free);
    } else c.cup.pop();
    calSet(c);
  };
  UI.acts.edCalReset = () => {
    delete ED.def.calendar;
    ED.err = [];
    UI.worldEditor();
  };

  // ---------- Fixed fixtures ----------
  // Matches put on a matchday by hand (rules.pins), kept per league
  const pinsView = () => {
    const l = leagueOf(ED.lid),
      r = l.rules || {},
      pins = (r.pins || []).slice().sort((a, b) => a.round - b.round),
      cl = clubsOf(l.id)
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));
    const name = (id) => (cl.find((c) => c.id === id) || { name: id }).name;
    const limit = WD.pinLimit(l, cl.length);
    const blocked = r.zones || r.conferences || r.torneos;
    const sel = (id) =>
      `<select id="${id}" style="flex:1;min-width:0">${cl.map((c) => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('')}</select>`;
    return `<div class="h1" style="margin-top:2vh">Fixed fixtures</div><div class="tag">${esc(l.name)} · ${U.plural(cl.length, 'club')} · ${limit} matchdays</div>
      ${errBox()}
      ${
        blocked
          ? '<div class="tiny dim" style="line-height:1.5">This league has zones, conferences or two tournaments, so its schedule is made by the game.</div>'
          : `<div class="tiny dim" style="line-height:1.5;margin-top:6px">Put a match on a matchday, the home side first. The game makes the rest of the schedule around it each season (a club that has left the league drops its fixtures). If no schedule can hold every match you fix, the form refuses it.</div>
      <div class="ng-label">Fix a match</div>
      <div class="ng-names" style="margin-top:0"><div style="flex:1"><div class="tiny dim">Matchday</div><input type="number" id="ed-pinr" min="1" max="${limit}" inputmode="numeric" value="1"></div></div>
      <div class="ng-names" style="margin-top:6px"><div style="flex:1"><div class="tiny dim">Home</div>${sel('ed-pinh')}</div><div style="flex:1"><div class="tiny dim">Away</div>${sel('ed-pina')}</div></div>
      <div class="actions" style="margin-top:8px"><button class="btn sm pri" data-act="edAddPin">Fix this match</button></div>
      <div class="ng-label">Matches fixed <span class="tiny dim">· ${pins.length}</span></div>
      ${
        pins.length
          ? pins
              .map(
                (p, i) =>
                  `<div class="row small" style="gap:8px;padding:6px 0;border-top:${i ? '1px solid var(--line)' : '0'}"><span class="dim" style="width:84px">Matchday ${p.round}</span><span class="grow ellip">${esc(name(p.h))} v ${esc(name(p.a))}</span><button class="btn sm" data-act="edDelPin" data-i="${r.pins.indexOf(p)}" aria-label="Remove">✕</button></div>`,
              )
              .join('')
          : '<div class="tiny dim">None yet.</div>'
      }`
      }
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="league" data-lid="${esc(l.id)}" aria-label="Back">←</button></div>`;
  };
  UI.acts.edAddPin = () => {
    const l = leagueOf(ED.lid);
    l.rules = l.rules || {};
    const pin = { round: Math.round(+$('#ed-pinr').value), h: $('#ed-pinh').value, a: $('#ed-pina').value };
    const before = l.rules.pins;
    l.rules.pins = [...(before || []), pin];
    const bad = WD.validatePins(l, ED.def);
    if (bad.length) {
      if (before) l.rules.pins = before;
      else delete l.rules.pins;
    }
    ED.err = bad;
    UI.worldEditor();
  };
  UI.acts.edDelPin = (d) => {
    const l = leagueOf(ED.lid);
    l.rules.pins.splice(+d.i, 1);
    if (!l.rules.pins.length) delete l.rules.pins;
    ED.err = [];
    UI.worldEditor();
  };

  // ---------- Continental cups of the definition's own ----------
  // A tier from 1 to 4: a champions cup (its places come from the leagues' qualify rules), a shield, a trophy, or a regional cup
  // (these take the places named in their feeders, after the cups above them have taken theirs)
  const REGION_OF = {
    EUR: 'Europe',
    ENG: 'Europe',
    SAM: 'South America',
    ASIA: 'Asia',
    AFR: 'Africa',
    NAM: 'North America',
  };
  const regionOfLeague = (l) => REGION_OF[(D.NATIONS[l.nat] || {}).region];
  const contTier = (id) => {
    const own = compOf(id);
    if (own && own.kind === 'cont') return own.tier || 1;
    return (D.CONTINENTALS.find((c) => c.id === id) || {}).tier || 1;
  };
  const contRegion = (id) => {
    const own = compOf(id);
    return own && own.kind === 'cont' ? own.region : (D.CONTINENTALS.find((c) => c.id === id) || {}).region;
  };
  // the continental cups of a tier in a part of the world (the game's and the definition's)
  const contsOf = (region, tier) => [
    ...D.CONTINENTALS.filter((c) => c.region === region && (c.tier || 1) === tier).map((c) => ({
      id: c.id,
      name: c.name,
    })),
    ...(ED.def.competitions || [])
      .filter((c) => c.isNew && c.kind === 'cont' && c.region === region && (c.tier || 1) === tier)
      .map((c) => ({ id: c.id, name: c.name })),
  ];
  const contFeeders = (c, f) => {
    const region = contRegion(c.id),
      tier = contTier(c.id);
    if (tier === 1) {
      const sending = ED.def.leagues.filter((l) => l.rules && l.rules.qualify && l.rules.qualify.to === c.id);
      const total = sending.reduce((t, l) => t + l.rules.qualify.n, 0);
      return `<div class="ng-label">Where its clubs come from <span class="tiny dim">· ${U.plural(total, 'place')}</span></div>
        <div class="tiny dim" style="line-height:1.5">A tier 1 cup takes the places that leagues send to it. Open a league and choose it under "Places in the continental cup".</div>
        ${sending.map((l) => `<div class="small" style="padding:4px 0">${natOf(l).flag} ${esc(l.name)} · <b>${l.rules.qualify.n}</b></div>`).join('') || '<div class="tiny" style="color:#f87171">No league sends clubs to it yet.</div>'}`;
    }
    const feeders = f.feeders || {};
    const total = Object.values(feeders).reduce((t, x) => t + x, 0);
    const leagues = ED.def.leagues.filter(
      (l) => (regionOfLeague(l) === region && (l.sim || 'full') !== 'minimal') || feeders[l.id],
    );
    return `<div class="ng-label">Where its clubs come from <span class="tiny dim">· ${U.plural(total, 'place')}, after the cups above have their clubs</span></div>
      ${leagues
        .map(
          (l) =>
            `<div class="row" style="gap:8px;margin:4px 0"><div class="grow small ellip">${natOf(l).flag} ${esc(l.name)}</div><select data-input="edFeed" data-lid="${esc(l.id)}" style="width:70px">${[0, 1, 2, 3, 4, 5, 6, 8].map((n) => `<option value="${n}" ${(feeders[l.id] || 0) === n ? 'selected' : ''}>${n}</option>`).join('')}</select></div>`,
        )
        .join('')}
      <div class="tiny dim" style="margin-top:4px;line-height:1.5">A league's places in a cup go to the clubs that finish next below the places it sends to the cups above (tier ${tier - 1} first). Fewer than eight clubs in all and the world cannot be used.</div>`;
  };
  UI.acts.edFeed = (d, el) => {
    const f = clone(fmtNow(ED.cup));
    f.feeders = f.feeders || {};
    if (+el.value > 0) f.feeders[d.lid] = +el.value;
    else delete f.feeders[d.lid];
    setFormat(f);
  };
  // Add a competition: a cup for a nation, or a continental cup of a chosen tier
  UI.acts.edNewKind = (d) => {
    ED.newKind = d.v;
    ED.err = [];
    UI.worldEditor();
  };
  UI.acts.edCreateCont = () => {
    const v = (id) => ($('#ed-' + id) || {}).value;
    const name = (v('ccname') || '').trim(),
      short = (v('ccshort') || '').trim().toUpperCase(),
      region = v('ccregion'),
      tier = +v('cctier');
    const used = new Set([...D.CONTINENTALS.map((c) => c.id), ...ED.def.competitions.map((c) => c.id)]);
    let id = 'CN1';
    for (let i = 2; used.has(id); i++) id = 'CN' + i;
    const prize = { 1: 8e6, 2: 4e6, 3: 2.5e6, 4: 1.2e6 }[tier];
    const r = WD.editor(ED.def, null).addContinental({
      id,
      name,
      short: short || id,
      region,
      tier,
      format: { legs: { qf: 2, sf: 2, f: 1 }, prize, groupSize: 4, feeders: {} },
    });
    ED.err = r.ok ? [] : r.errors;
    if (r.ok) ((ED.view = 'cup'), (ED.cup = id));
    UI.worldEditor();
  };
  // A league's qualify rule can name any tier 1 cup of its part of the world
  UI.acts.edQualifyTo = (d, el) => {
    stashLeague();
    const l = leagueOf(ED.lid);
    l.rules = l.rules || {};
    l.rules.qualify = { to: el.value, n: (l.rules.qualify && l.rules.qualify.n) || 1 };
    UI.worldEditor();
  };
  // ---------- Coaches and scouts ----------
  // Staff made for a club come with the job when you take charge of it (they replace the ones a new manager is given); staff made
  // with no club are on offer for hire in the first season.
  const STAFF_ROLES = [
    'Assistant Manager',
    'First-Team Coach',
    'Head of Analytics',
    'Head Physio',
    'Sporting Director',
    'Scout',
  ];
  const staffHubView =
    () => `<div class="h1" style="margin-top:2vh">Staff, managers and agents</div><div class="tag">The people around the clubs.</div>
      <div class="card tap" style="margin:6px 0;padding:10px 12px" data-act="edStaff" data-cid="${FREE}"><div class="row"><div class="grow"><div class="small b">Coaches and scouts for hire</div><div class="tiny dim">${(ED.def.staff || []).filter((s) => !s.club).length} on offer from the first day. Staff for one club are made on that club's screen.</div></div><span class="dim">›</span></div></div>
      <div class="card tap" style="margin:6px 0;padding:10px 12px" data-act="edView" data-v="managers"><div class="row"><div class="grow"><div class="small b">Managers</div><div class="tiny dim">${(ED.def.managers || []).length} made · each is set on the club's screen</div></div><span class="dim">›</span></div></div>
      <div class="card tap" style="margin:6px 0;padding:10px 12px" data-act="edView" data-v="agents"><div class="row"><div class="grow"><div class="small b">Agent firms</div><div class="tiny dim">${agentsNow().length} firms represent the players</div></div><span class="dim">›</span></div></div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="home" aria-label="Back">←</button></div>`;
  const managersView = () => {
    const list = (ED.def.managers || []).slice().sort((a, b) => (a.ln || '').localeCompare(b.ln || ''));
    return `<div class="h1" style="margin-top:2vh">Managers</div><div class="tag">Every manager you made. A club with none keeps the one the game gives it. Tap one to change them on the club's screen.</div>
      ${
        list
          .map((m) => {
            const c = ED.def.clubs.find((x) => x.id === m.club);
            return c
              ? `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edView" data-v="club" data-cid="${esc(c.id)}"><div class="row" style="gap:10px">${crestDot(c)}<div class="grow"><div class="small b">${esc(((m.fn || '') + ' ' + (m.ln || '')).trim())}</div><div class="tiny dim">${esc(c.name)} · ability ${m.ability}${m.tactic ? ' · ' + esc(m.tactic.formation) : ''}</div></div><span class="dim">›</span></div></div>`
              : '';
          })
          .join('') || '<div class="empty">None made yet. Open a club to make its manager.</div>'
      }
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="staffhub" aria-label="Back">←</button></div>`;
  };
  // Agent firms: the names players' agents work for (the game's own twelve until you change them)
  const agentsNow = () => (ED.def.agents && ED.def.agents.length ? ED.def.agents : D.AGENT_FIRMS);
  const readAgents = () => agentsNow().map((a, i) => (($('#ed-ag-' + i) || {}).value ?? a).trim());
  UI.acts.edSaveAgents = (d) => {
    ED.def.agents = readAgents().filter(Boolean);
    const errs = WD.validate(ED.def, null).errors.filter((e) => e.startsWith('agent firms'));
    if (errs.length) {
      ED.err = errs;
      ED.def.agents = [];
    } else ED.err = [];
    if (d && d.quiet) return;
    if (!errs.length) UI.toast('Saved', 1500);
    UI.worldEditor();
  };
  UI.acts.edAddAgent = () => {
    const names = readAgents().filter(Boolean);
    ED.def.agents = [...names, 'New Sports Agency'];
    UI.worldEditor();
  };
  UI.acts.edDelAgent = (d) => {
    const names = readAgents();
    names.splice(+d.i, 1);
    ED.def.agents = names.filter(Boolean);
    if (!ED.def.agents.length) ED.def.agents = [];
    UI.worldEditor();
  };
  UI.acts.edResetAgents = () => {
    ED.def.agents = D.AGENT_FIRMS.slice();
    ED.err = [];
    UI.worldEditor();
  };
  const agentsView =
    () => `<div class="h1" style="margin-top:2vh">Agent firms</div><div class="tag">The firms players' agents work for. Players from some nations also get an agency named after their agent.</div>
      ${errBox()}
      ${agentsNow()
        .map(
          (a, i) =>
            `<div class="ng-names" style="margin-top:6px"><input type="text" id="ed-ag-${i}" maxlength="40" value="${esc(a)}"><button class="btn sm" data-act="edDelAgent" data-i="${i}" aria-label="Remove">✕</button></div>`,
        )
        .join('')}
      <div class="actions" style="margin-top:12px"><button class="btn sm" data-act="edAddAgent">＋ Add a firm</button><button class="btn sm" data-act="edResetAgents">Back to the game's twelve</button></div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="staffhub" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edSaveAgents">Save</button></div>`;
  const staffHere = () =>
    (ED.def.staff || []).filter((s) => (s.club || null) === (ED.sclub === FREE ? null : ED.sclub));
  UI.acts.edStaff = (d) => {
    ED.view = 'staff';
    if (d.cid !== undefined) ED.sclub = d.cid;
    ED.err = [];
    UI.worldEditor();
  };
  UI.acts.edAddStaff = () => {
    const c = ED.sclub === FREE ? null : ED.def.clubs.find((x) => x.id === ED.sclub);
    const taken = new Set(staffHere().map((s) => s.role));
    const role = (c && STAFF_ROLES.find((r) => r !== 'Scout' && !taken.has(r))) || 'Scout';
    const r = WD.editor(ED.def, null).addStaff({
      role,
      fn: 'New',
      ln: 'Staff',
      nat: (c && c.nat) || 'ENG',
      age: 45,
      ability: 12,
      club: c ? c.id : null,
    });
    ED.err = r.ok ? [] : r.errors;
    if (r.ok) ((ED.view = 'staffer'), (ED.sid = r.id));
    UI.worldEditor();
  };
  UI.acts.edStaffer = (d) => {
    ED.view = 'staffer';
    ED.sid = d.sid;
    ED.err = [];
    UI.worldEditor();
  };
  // The scout's network as set on the screen (nothing when the game is to make it, or the person is not a scout)
  const scoutNet = (role) => {
    if (role !== 'Scout' || !($('#ed-scustom') || {}).checked) return { regions: undefined, judge: undefined };
    return {
      regions: Object.fromEntries(Object.keys(D.REGIONS).map((r) => [r, Math.round(+$('#ed-sreg-' + r).value) / 100])),
      judge: Math.round(+$('#ed-sjudge').value),
    };
  };
  // A network made up from the scout's nation and ability, as the game would (shown on the sliders, saved with Save)
  UI.acts.edScoutNet = () => {
    const p = FM.W.scoutProfile($('#ed-snat').value, Math.round(+$('#ed-sab').value));
    $('#ed-scustom').checked = true;
    for (const r of Object.keys(D.REGIONS)) {
      $('#ed-sreg-' + r).value = Math.round(p.regions[r] * 100);
      $('#ed-sregv-' + r).textContent = Math.round(p.regions[r] * 100) + '%';
    }
    $('#ed-sjudge').value = p.judge;
    $('#ed-sjudgev').textContent = p.judge;
  };
  UI.acts.edSaveStaff = () => {
    const v = (id) => ($('#ed-' + id) || {}).value;
    const r = WD.editor(ED.def, null).updateStaff(ED.sid, {
      role: v('srole'),
      fn: (v('sfn') || '').trim(),
      ln: (v('sln') || '').trim(),
      nat: v('snat'),
      age: Math.round(+v('sage')),
      ability: Math.round(+v('sab')),
      personality: v('spers') || undefined,
      years: Math.round(+v('syears')) || undefined,
      wage: Math.round(+v('swage')) || undefined,
      ...scoutNet(v('srole')),
    });
    if (!r.ok) {
      ED.err = r.errors;
      return UI.worldEditor();
    }
    ED.view = 'staff';
    ED.err = [];
    UI.toast('Saved', 1500);
    UI.worldEditor();
  };
  UI.acts.edDelStaff = () => {
    WD.editor(ED.def, null).removeStaff(ED.sid);
    ED.view = 'staff';
    UI.worldEditor();
  };
  const staffView = () => {
    const free = ED.sclub === FREE,
      c = free ? null : ED.def.clubs.find((x) => x.id === ED.sclub),
      list = staffHere();
    return `<div class="h1" style="margin-top:2vh">${free ? '🧑‍🏫 Coaches and scouts for hire' : `${crestDot(c)} ${esc(c.name)}: staff`}</div><div class="tag">${free ? 'People who are on offer in the staff market from the first day.' : 'These come with the job when you take charge of this club: an assistant, a coach, an analyst, a physio, a director and up to five scouts. They replace the ones a new manager is given.'}</div>
      ${errBox()}
      ${
        list
          .map(
            (s) =>
              `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edStaffer" data-sid="${esc(s.id)}"><div class="row"><div class="grow"><div class="small b">${esc(((s.fn || '') + ' ' + (s.ln || '')).trim())}</div><div class="tiny dim">${esc(s.role)} · ${(D.NATIONS[s.nat] || {}).flag || ''} · age ${s.age} · ability ${s.ability}</div></div><span class="dim">›</span></div></div>`,
          )
          .join('') || '<div class="empty">None made yet.</div>'
      }
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="${free ? 'staffhub' : 'club'}" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edAddStaff">＋ Add a person</button></div>`;
  };
  const stafferView = () => {
    const s = (ED.def.staff || []).find((x) => x.id === ED.sid);
    if (!s) return staffView();
    const nations = natEntries().sort((a, b) => a[1].name.localeCompare(b[1].name));
    return `<div class="h1" style="margin-top:2vh">${esc(((s.fn || '') + ' ' + (s.ln || '')).trim() || 'New staff')}</div><div class="tag">${s.role === 'Scout' ? 'A scout knows the region they come from best; the game works out the rest of the network.' : 'The better the ability, the more the club gets from the role.'}</div>
      ${errBox()}
      <div class="ng-label">Role</div><select id="ed-srole">${STAFF_ROLES.map((r) => `<option ${s.role === r ? 'selected' : ''}>${r}</option>`).join('')}</select>
      <div class="ng-names"><div style="flex:1"><div class="ng-label" style="margin-top:0">First name</div><input type="text" id="ed-sfn" maxlength="24" value="${esc(s.fn || '')}"></div><div style="flex:1"><div class="ng-label" style="margin-top:0">Last name</div><input type="text" id="ed-sln" maxlength="28" value="${esc(s.ln || '')}"></div></div>
      <div class="ng-names"><select id="ed-snat" style="flex:1">${nations.map(([k, n]) => `<option value="${k}" ${s.nat === k ? 'selected' : ''}>${n.flag} ${esc(n.name)}</option>`).join('')}</select><input type="number" id="ed-sage" min="25" max="80" inputmode="numeric" style="max-width:84px" value="${s.age}" aria-label="Age"></div>
      <div class="ng-label">Ability <b id="ed-sabv" style="color:#e6edf6">${s.ability}</b> <span class="tiny dim">(1–20)</span></div><input type="range" id="ed-sab" min="1" max="20" step="1" value="${s.ability}" style="width:100%">
      <div class="ng-label">Personality</div><select id="ed-spers"><option value="">As the game gives</option>${D.STAFF_PERSONALITY.map((k) => `<option ${s.personality === k ? 'selected' : ''}>${k}</option>`).join('')}</select>
      <div class="ng-names"><div style="flex:1"><div class="ng-label" style="margin-top:0">Contract (years)</div><input type="number" id="ed-syears" min="1" max="5" inputmode="numeric" placeholder="Game's" value="${s.years || ''}"></div><div style="flex:1"><div class="ng-label" style="margin-top:0">Wage a week</div><input type="number" id="ed-swage" min="50" max="500000" inputmode="numeric" placeholder="Game's" value="${s.wage || ''}"></div></div>
      <div class="ng-label">Scout's network <span class="tiny dim">· scouts only</span></div>
      <label class="small" style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="ed-scustom" ${s.regions ? 'checked' : ''}> I set it (otherwise the game makes it from where they come from)</label>
      ${Object.entries(D.REGIONS)
        .map(
          ([r, name]) =>
            `<div class="row" style="gap:10px;align-items:center;margin-top:6px"><span class="small" style="width:110px;flex:none">${esc(name)}</span><input type="range" id="ed-sreg-${r}" min="5" max="100" step="5" value="${Math.round(((s.regions || {})[r] || 0.3) * 100)}" style="flex:1"><b id="ed-sregv-${r}" style="width:42px;text-align:right">${Math.round(((s.regions || {})[r] || 0.3) * 100)}%</b></div>`,
        )
        .join('')}
      <div class="ng-label">Judgement <b id="ed-sjudgev" style="color:#e6edf6">${s.judge || s.ability}</b> <span class="tiny dim">(how well they read a player, 1–20)</span></div><input type="range" id="ed-sjudge" min="1" max="20" step="1" value="${s.judge || s.ability}" style="width:100%">
      <div class="actions" style="margin-top:8px"><button class="btn sm" data-act="edScoutNet">Make up a network</button></div>
      <div class="actions" style="margin-top:14px"><button class="btn sm" data-act="edDelStaff">Delete this person</button></div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edStaff" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edSaveStaff">Save</button></div>`;
  };

  // ---------- International football ----------
  // The summer tournaments, the year of the cycle the World Championship falls in, the invitationals, and links to the national
  // teams and their history
  const intlNow = () => (ED.def.intl && Object.keys(ED.def.intl).length ? ED.def.intl : WD.intlNow());
  const tName = (id) => {
    const i = intlNow();
    return (i.tourns[id] || i.invites.find((v) => v.id === id) || {}).name || '';
  };
  const REGION = { EUR: 'Europe', SAM: 'South America', AFR: 'Africa', ASIA: 'Asia', NAM: 'North America' };
  UI.acts.edSaveIntl = () => {
    const v = (id) => ($('#ed-' + id) || {}).value;
    const now = WD.intlNow(),
      tourns = {};
    for (const tn of Object.values(FM.Intl.TOURNS).flat()) {
      const slots =
        tn.pools.length > 1 ? tn.pools.map((_, i) => Math.round(+v(`islot-${tn.id}-${i}`))) : now.tourns[tn.id].slots;
      tourns[tn.id] = {
        name: (v('iname-' + tn.id) || '').trim(),
        slots,
        ...(tn.pools.length ? { qual: Math.round(+v('iqual-' + tn.id)) || 4 } : {}),
      };
    }
    const invites = FM.Intl.INVITES.filter((o) => ($('#ed-iinc-' + o.id) || {}).checked).map((o) => ({
      id: o.id,
      name: (v('iname-' + o.id) || '').trim(),
      host: v('ihost-' + o.id),
    }));
    const r = WD.editor(ED.def, null).setIntl({ cycle: Math.round(+v('icycle')), tourns, invites });
    ED.err = r.ok ? [] : r.errors;
    if (r.ok) UI.toast('Saved', 1500);
    UI.worldEditor();
  };
  const intlView = () => {
    const cur = intlNow(),
      nations = natEntries().sort((a, b) => a[1].name.localeCompare(b[1].name));
    const kinds = {
      world: 'Every four years',
      continental: 'Two years on',
      confed: 'The year before the World Championship',
    };
    return `<div class="h1" style="margin-top:2vh">International football</div><div class="tag">The summer tournaments, the national teams and their history.</div>
      ${errBox()}
      <div class="ng-label">The World Championship is played in</div>
      <select id="ed-icycle">${[0, 1, 2, 3]
        .map(
          (k) =>
            `<option value="${k}" ${cur.cycle === k ? 'selected' : ''}>${k === 0 ? 'The first year of the four' : ['', 'The second', 'The third', 'The fourth'][k] + ' year of the four'}</option>`,
        )
        .join('')}</select>
      <div class="tiny dim" style="margin-top:6px;line-height:1.5">Counted from the year 0 of each four (a year that divides by four). The continental championships follow two years on, and the Continental Champions Trophy comes the year before the World Championship. Your first season plays the qualifiers for whichever is next.</div>
      <div class="ng-label">Tournaments</div>
      ${Object.entries(FM.Intl.TOURNS)
        .map(([kind, list]) =>
          list
            .map((tn) => {
              const v = cur.tourns[tn.id] || { name: tn.name, slots: tn.pools.map(([, n]) => n) };
              return `<div class="tiny dim" style="margin:12px 0 4px">${kinds[kind]} · ${U.plural(tn.size, 'nation')}</div><input type="text" id="ed-iname-${tn.id}" maxlength="48" value="${esc(v.name)}">${
                tn.pools.length > 1
                  ? `<div class="tiny dim" style="margin:6px 0 4px">Places by part of the world (they add up to ${tn.size})</div><div class="ng-names" style="margin-top:0;flex-wrap:wrap">${tn.pools
                      .map(
                        ([regions], i) =>
                          `<div style="flex:1;min-width:84px"><div class="tiny dim">${esc(regions.map((r) => REGION[r] || r).join(' + '))}</div><input type="number" id="ed-islot-${tn.id}-${i}" min="0" max="${tn.size}" inputmode="numeric" value="${v.slots[i]}"></div>`,
                      )
                      .join('')}</div>`
                  : ''
              }`;
            })
            .join(''),
        )
        .join('')}
      <div class="ng-label">Qualifying <span class="tiny dim">· how the nations of a part of the world play for their places</span></div>
      ${Object.values(FM.Intl.TOURNS)
        .flat()
        .filter((tn) => tn.pools.length)
        .map(
          (tn) =>
            `<div class="ng-names" style="margin-top:6px;align-items:center"><div class="small grow">${esc(cur.tourns[tn.id] ? cur.tourns[tn.id].name : tn.name)}</div><select id="ed-iqual-${tn.id}" style="max-width:190px">${[
              [4, 'Groups of four'],
              [3, 'Groups of three'],
              [2, 'Pairs, home and away'],
            ]
              .map(
                ([k, t]) =>
                  `<option value="${k}" ${((cur.tourns[tn.id] || {}).qual || 4) === k ? 'selected' : ''}>${t}</option>`,
              )
              .join('')}</select></div>`,
        )
        .join('')}
      <div class="tiny dim" style="margin-top:6px;line-height:1.5">The nations of each part of the world are drawn into groups by ranking, and the group winners go through first, then the runners-up, until the places are filled. Groups of four and three play each other once, pairs home and away; the two windows of the season have four match days.</div>
      <div class="ng-label">Invitational tournaments <span class="tiny dim">· one a season, in turn: a host and three guests</span></div>
      ${FM.Intl.INVITES.map((o) => {
        const have = cur.invites.find((x) => x.id === o.id);
        return { ...o, ...(have || {}), kept: !!have };
      })
        .map(
          (v) =>
            `<label class="tiny" style="display:flex;gap:6px;align-items:center;margin-top:10px"><input type="checkbox" id="ed-iinc-${v.id}" ${v.kept ? 'checked' : ''}> Played in this world</label><div class="ng-names" style="margin-top:4px"><input type="text" id="ed-iname-${v.id}" maxlength="40" value="${esc(v.name)}"><select id="ed-ihost-${v.id}" style="max-width:150px">${nations
              .map(
                ([k, n]) => `<option value="${k}" ${v.host === k ? 'selected' : ''}>${n.flag} ${esc(n.name)}</option>`,
              )
              .join('')}</select></div>`,
        )
        .join('')}
      <div class="actions" style="margin-top:12px"><button class="btn sm pri" data-act="edSaveIntl">Save the tournaments</button></div>
      <div class="card tap" style="margin:16px 0 0;padding:10px 12px" data-act="edView" data-v="confeds"><div class="row"><div class="grow"><div class="small b">Confederations</div><div class="tiny dim">${confedSummary()}</div></div><span class="dim">›</span></div></div>
      <div class="card tap" style="margin:6px 0 0;padding:10px 12px" data-act="edView" data-v="nations"><div class="row"><div class="grow"><div class="small b">National teams</div><div class="tiny dim">${(ED.def.nations || []).length} changed · name, colours, ranking points, how they play</div></div><span class="dim">›</span></div></div>
      <div class="card tap" style="margin:6px 0 0;padding:10px 12px" data-act="edView" data-v="history"><div class="row"><div class="grow"><div class="small b">Past tournaments</div><div class="tiny dim">Who won each one is entered with the past seasons</div></div><span class="dim">›</span></div></div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="home" aria-label="Back">←</button></div>`;
  };

  // ---------- Confederations ----------
  // Which confederation each nation is in, and the confederations a world adds. Qualifying for the World Championship, the
  // continental championships and the Nations League go by confederation; a new one with four nations or more gets a place at
  // the World Championship and a championship of its own.
  const CF = () => (ED.def.confeds = ED.def.confeds || { names: {}, members: {} });
  const I_ = () => FM.Intl;
  const cfBase = (code) => I_().baseConfed(code);
  const cfOf = (code) => CF().members[code] || cfBase(code);
  const cfName = (id) => CF().names[id] || I_().CONFEDS[id] || id;
  const cfIds = () => [...Object.keys(I_().CONFEDS), ...Object.keys(CF().names).filter((id) => !I_().CONFEDS[id])];
  const cfNations = () => natEntries().filter(([code]) => D.NATIONS[code]);
  const cfMembers = (id) => cfNations().filter(([code]) => cfOf(code) === id);
  const confedSummary = () => {
    const c = CF(),
      n = Object.keys(c.members).length,
      k = Object.keys(c.names).filter((id) => !I_().CONFEDS[id]).length;
    return k || n
      ? `${k} added · ${n} nation${n === 1 ? '' : 's'} moved`
      : 'Europe, South America, Africa, Asia and North America · add your own and move nations between them';
  };
  UI.acts.edNewConfed = () => {
    const v = (id) => (($('#ed-' + id) || {}).value || '').trim();
    const id = v('cfid').toUpperCase(),
      name = v('cfname');
    const errs = [];
    if (!/^[A-Z0-9]{2,6}$/.test(id)) errs.push('The short name is 2 to 6 letters or digits');
    else if (cfIds().includes(id)) errs.push(`There is already a confederation called ${id}`);
    if (!name) errs.push('A confederation needs a name');
    if (errs.length) {
      ED.err = errs;
      return UI.worldEditor();
    }
    CF().names[id] = name;
    ED.err = [];
    UI.worldEditor();
  };
  UI.acts.edRenameConfed = (d, el) => {
    const name = (el.value || '').trim();
    if (!name) return;
    if (name === I_().CONFEDS[d.id]) delete CF().names[d.id];
    else CF().names[d.id] = name;
  };
  UI.acts.edDelConfed = (d) => {
    const c = CF();
    delete c.names[d.id];
    for (const [code, id] of Object.entries(c.members)) if (id === d.id) delete c.members[code];
    UI.worldEditor();
  };
  UI.acts.edNationConfed = (d, el) => {
    const c = CF();
    if (el.value === cfBase(d.code)) delete c.members[d.code];
    else c.members[d.code] = el.value;
    const open = document.querySelector('details[data-cf][open]');
    ED.cfOpen = open ? open.dataset.cf : null;
    const y = window.scrollY;
    UI.worldEditor();
    window.scrollTo(0, y);
  };
  UI.acts.edResetConfeds = () => {
    ED.def.confeds = { names: {}, members: {} };
    UI.worldEditor();
  };
  const confedsView = () => {
    const ids = cfIds(),
      c = CF();
    return `<div class="h1" style="margin-top:2vh">Confederations</div><div class="tag">Which confederation each nation is in. A nation's confederation sets who it qualifies with, its Nations League and its continental championship.</div>
      ${errBox()}
      ${ids
        .map((id) => {
          const mem = cfMembers(id),
            custom = !I_().CONFEDS[id];
          return `<details class="card" data-cf="${id}" style="margin:8px 0;padding:10px 12px" ${ED.cfOpen === id ? 'open' : ''}><summary class="small b">${esc(cfName(id))} <span class="tiny dim">· ${id} · ${mem.length} nation${mem.length === 1 ? '' : 's'}${custom && mem.length < 4 ? ' · needs 4 for a championship' : ''}</span></summary>
            <div class="row" style="gap:6px;margin-top:10px"><input type="text" maxlength="40" value="${esc(cfName(id))}" data-input="edRenameConfed" data-id="${id}" style="flex:1;min-width:0">${custom ? `<button class="btn sm" data-act="edDelConfed" data-id="${id}">Remove</button>` : ''}</div>
            ${
              mem
                .sort((a, b) => a[1].name.localeCompare(b[1].name))
                .map(
                  ([code, n]) =>
                    `<div class="row" style="gap:8px;margin-top:6px;align-items:center"><div class="grow small ellip">${C_flag(code)} ${esc(n.name)}${c.members[code] ? ' <span class="tiny dim">· moved</span>' : ''}</div><select data-input="edNationConfed" data-code="${code}" style="max-width:150px">${ids
                      .map((x) => `<option value="${x}" ${x === id ? 'selected' : ''}>${esc(cfName(x))}</option>`)
                      .join('')}</select></div>`,
                )
                .join('') || '<div class="tiny dim" style="margin-top:8px">No nations.</div>'
            }</details>`;
        })
        .join('')}
      <div class="ng-label">A new confederation</div>
      <div class="ng-names" style="margin-top:0"><div style="flex:1"><input type="text" id="ed-cfname" maxlength="40" placeholder="Name, for example Oceania"></div><div style="flex:1;max-width:110px"><input type="text" id="ed-cfid" maxlength="6" placeholder="Short, OFC" style="text-transform:uppercase"></div></div>
      <div class="actions" style="margin-top:8px"><button class="btn sm" data-act="edNewConfed">＋ Add it</button>${Object.keys(c.names).length || Object.keys(c.members).length ? '<button class="btn sm" data-act="edResetConfeds">Put the game’s back</button>' : ''}</div>
      <div class="tiny dim" style="margin-top:8px;line-height:1.5">Open one, then use the lists to move a nation in or out. A confederation of four nations or more gets one place at the World Championship (taken from the biggest part of the world) and a championship of its own; a smaller one just plays its Nations League.</div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="intl" aria-label="Back">←</button></div>`;
  };
  const C_flag = (code) => UI.C.flag(code);

  // ---------- National teams ----------
  // The name, short name, colours and ranking points a national team starts with (a nation too thin in players to field a team
  // keeps none; its entry is ignored)
  const ntOf = (code) => (ED.def.nations || []).find((n) => n.code === code);
  const NT_TACTIC = { formation: '4-3-3', buildup: 'Short', press: 'Mid Block', width: 'Balanced' }; // (how the game sets a national team up)
  const sameColours = (a, b) =>
    a.length === b.length && a.every((x, i) => String(x).toLowerCase() === String(b[i]).toLowerCase());
  UI.acts.edNation = (d) => {
    ED.view = 'nation';
    ED.code = d.code;
    ED.err = [];
    UI.worldEditor();
  };
  UI.acts.edSaveNation = () => {
    const v = (id) => ($('#ed-' + id) || {}).value;
    const N = D.NATIONS[ED.code],
      E = WD.editor(ED.def, null);
    const patch = {
      name: (v('nname') || '').trim(),
      short: (v('nshort') || '').trim().toUpperCase(),
      colors: [v('nc1'), v('nc2')],
      coef: +v('ncoef') === 50 ? null : Math.round(+v('ncoef') * 10) / 10, // (50: the game works the points out)
      tactic: { formation: v('nform'), buildup: v('nbuild'), press: v('npress'), width: v('nwidth') },
    };
    if (JSON.stringify(patch.tactic) === JSON.stringify(NT_TACTIC)) patch.tactic = null;
    const r = E.setNation(ED.code, patch);
    if (!r.ok) {
      ED.err = r.errors;
      return UI.worldEditor();
    }
    if (
      patch.name === N.name &&
      patch.short === ED.code &&
      patch.coef == null &&
      !patch.tactic &&
      sameColours(patch.colors, D.NT_COLORS[ED.code] || ['#ffffff', '#000000'])
    )
      E.clearNation(ED.code);
    ED.view = 'nations';
    ED.err = [];
    UI.toast('National team saved', 1500);
    UI.worldEditor();
  };
  const madeFor = (code) =>
    (ED.def.players || [])
      .filter((p) => p.nat === code)
      .sort((a, b) => abilityOf(b.attrs, b.pos) - abilityOf(a.attrs, a.pos))
      .slice(0, 60);
  UI.acts.edToggleCall = (d) => {
    const p = ED.def.players.find((x) => x.id === d.pid);
    if (!p) return;
    const r = WD.editor(ED.def, null).updatePlayer(p.id, { callup: p.callup ? undefined : true });
    ED.err = r.ok ? [] : r.errors;
    UI.worldEditor();
  };
  UI.acts.edClearNation = () => {
    WD.editor(ED.def, null).clearNation(ED.code);
    ED.view = 'nations';
    UI.worldEditor();
  };
  const nationsView = () => {
    const by = {};
    for (const [code, n] of natEntries()) (by[n.region] = by[n.region] || []).push([code, n]);
    return `<div class="h1" style="margin-top:2vh">National teams</div><div class="tag">Name, colours and ranking points of each national team. Tap one. A nation with too few players to field a squad has no team in the world.</div>
      ${Object.entries(by)
        .map(
          ([region, list]) =>
            `<div class="ng-label">${esc((D.REGIONS || {})[region] || region)}</div>${list
              .sort((a, b) => a[1].name.localeCompare(b[1].name))
              .map(([code, n]) => {
                const o = ntOf(code);
                return `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edNation" data-code="${code}"><div class="row"><div class="grow"><div class="small b">${n.flag} ${esc((o && o.name) || n.name)}</div><div class="tiny dim">${o ? 'Changed' : 'As the game has it'}${o && o.coef != null ? ` · ${o.coef} ranking points` : ''}</div></div><span class="dim">›</span></div></div>`;
              })
              .join('')}`,
        )
        .join('')}
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="intl" aria-label="Back">←</button></div>`;
  };
  const nationView = () => {
    const N = D.NATIONS[ED.code];
    if (!N) return nationsView();
    const o = ntOf(ED.code) || {},
      cols = o.colors || D.NT_COLORS[ED.code] || ['#ffffff', '#000000'],
      coef = o.coef != null ? o.coef : 50,
      tac = o.tactic || NT_TACTIC;
    return `<div class="h1" style="margin-top:2vh">${N.flag} ${esc(o.name || N.name)}</div><div class="tag">The national team of ${esc(N.name)}.</div>
      ${errBox()}
      <div class="ng-names"><div style="flex:1"><div class="ng-label" style="margin-top:0">Name</div><input type="text" id="ed-nname" maxlength="32" value="${esc(o.name || N.name)}"></div><div style="flex:1;max-width:100px"><div class="ng-label" style="margin-top:0">Short</div><input type="text" id="ed-nshort" maxlength="4" value="${esc(o.short || ED.code)}"></div></div>
      <div class="ng-label">Colours</div>
      <div class="row" style="gap:10px"><input type="color" id="ed-nc1" value="${esc(cols[0])}" style="width:64px;height:44px;padding:2px"><input type="color" id="ed-nc2" value="${esc(cols[1])}" style="width:64px;height:44px;padding:2px"><span class="tiny dim">shirt, and the second colour</span></div>
      <div class="ng-label">Ranking points <b id="ed-ncoefv" style="color:#e6edf6">${coef}</b> <span class="tiny dim">(about 50 for an average nation, 90 and over for the best; every match moves them)</span></div>
      <input type="range" id="ed-ncoef" min="20" max="100" step="0.5" value="${coef}" style="width:100%">
      <div class="tiny dim" style="margin-top:6px;line-height:1.5">Left at 50 the game works the points out from the nation's players, as it does without the editor.</div>
      <div class="ng-label">How they play</div>
      <div class="ng-names" style="margin-top:0"><select id="ed-nform" style="flex:1">${Object.keys(D.FORMATIONS)
        .map((k) => `<option ${tac.formation === k ? 'selected' : ''}>${k}</option>`)
        .join(
          '',
        )}</select><select id="ed-nbuild" style="flex:1">${D.BUILDUP.map((k) => `<option ${tac.buildup === k ? 'selected' : ''}>${k}</option>`).join('')}</select></div>
      <div class="ng-names"><select id="ed-npress" style="flex:1">${D.PRESS.map((k) => `<option ${tac.press === k ? 'selected' : ''}>${k}</option>`).join('')}</select><select id="ed-nwidth" style="flex:1">${D.WIDTH.map((k) => `<option ${tac.width === k ? 'selected' : ''}>${k}</option>`).join('')}</select></div>
      <div class="ng-label">Squad <span class="tiny dim">· players you made for this country</span></div>
      ${
        madeFor(ED.code)
          .map(
            (p) =>
              `<div class="row" style="gap:10px;margin:4px 0;align-items:center"><button class="btn sm" data-act="edToggleCall" data-pid="${esc(p.id)}" aria-label="Call up">${p.callup ? '🌐' : '＋'}</button><div class="grow small"><b>${esc(((p.fn || '') + ' ' + (p.ln || '')).trim())}</b> <span class="tiny dim">${esc(D.POS_NAME[p.pos] || p.pos)} · ability ${abilityOf(p.attrs, p.pos)}${p.callup ? ' · called up' : ''}</span></div></div>`,
          )
          .join('') ||
        '<div class="tiny dim" style="line-height:1.5">None yet. The squad is the nation\'s best twenty-three players. Players you make for this country (on a club\'s Players screen) can be called up here: they are picked ahead of better players for three years.</div>'
      }
      <div class="actions" style="margin-top:14px"><button class="btn sm" data-act="edClearNation">Put the game's version back</button></div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="nations" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edSaveNation">Save</button></div>`;
  };

  // ---------- History ----------
  // Past seasons: who won each league. A season entered as champion, runner-up and third gets a full table made to fit (a club
  // higher up has won more), and the champion's honours are counted. Past seasons come before the first one you play.
  const seasonOf = (y) => ED.def.history.seasons.find((s) => s.year === y);
  UI.acts.edAddSeason = () => {
    const v = Math.round(+($('#ed-hyear') || {}).value);
    const r = WD.editor(ED.def, null).addSeason({ year: v, label: `${v}/${String(v + 1).slice(2)}`, comps: {} });
    ED.err = r.ok ? [] : r.errors;
    if (r.ok) ((ED.view = 'season'), (ED.hy = v));
    UI.worldEditor();
  };
  UI.acts.edSeason = (d) => {
    ED.view = 'season';
    if (d.y !== undefined) ED.hy = +d.y;
    ED.err = [];
    UI.worldEditor();
  };
  UI.acts.edDelSeason = () => {
    WD.editor(ED.def, null).removeSeason(ED.hy);
    ED.view = 'history';
    UI.worldEditor();
  };
  UI.acts.edSeasonLeague = (d) => {
    ED.view = 'seasonleague';
    ED.hl = d.lid;
    ED.err = [];
    UI.worldEditor();
  };
  UI.acts.edSeasonCup = (d) => {
    ED.view = 'seasoncup';
    ED.hc = d.cup;
    ED.err = [];
    UI.worldEditor();
  };
  UI.acts.edSaveSeasonCup = () => {
    const v = (id) => ($('#ed-' + id) || {}).value;
    const s = seasonOf(ED.hy);
    s.cups = s.cups || {};
    if (!v('cw')) delete s.cups[ED.hc];
    else if (v('cw') === v('cr')) {
      ED.err = ['The winner and the runner-up are different clubs'];
      return UI.worldEditor();
    } else s.cups[ED.hc] = { winner: v('cw'), runnerUp: v('cr') || null };
    ED.view = 'season';
    ED.err = [];
    UI.toast('Saved', 1500);
    UI.worldEditor();
  };
  UI.acts.edFillHistory = (d) => {
    ED.def.meta.fillHistory = d.v === 'true';
    UI.worldEditor();
  };
  UI.acts.edSaveSeasonLeague = () => {
    const v = (id) => ($('#ed-' + id) || {}).value;
    const s = seasonOf(ED.hy),
      l = leagueOf(ED.hl),
      champ = v('hc'),
      second = v('hr'),
      third = v('ht');
    if (!champ) {
      delete s.comps[l.id];
      ED.view = 'season';
      ED.err = [];
      return UI.worldEditor();
    }
    const top = [champ, second, third].filter(Boolean);
    if (!second || new Set(top).size !== top.length) {
      ED.err = [
        !second ? 'Choose a runner-up as well' : 'The champion, runner-up and third place are three different clubs',
      ];
      return UI.worldEditor();
    }
    const clubs = clubsOf(l.id).sort((a, b) => b.rep - a.rep),
      order = top.concat(clubs.map((c) => c.id).filter((id) => !top.includes(id))),
      games = (l.rules && l.rules.rounds) || 2 * (clubs.length - 1);
    s.comps[l.id] = {
      champion: champ,
      runnerUp: second,
      third: third || null,
      table: WD.makeTable(order, games, ED.def.rules.win),
    };
    const bad = WD.validate(ED.def, null).errors.filter((e) => e.startsWith(`season ${s.year}`));
    if (bad.length) {
      delete s.comps[l.id];
      ED.err = bad;
      return UI.worldEditor();
    }
    ED.view = 'season';
    ED.err = [];
    UI.toast('Saved', 1500);
    UI.worldEditor();
  };
  const yy = (y) => `${y}/${String(y + 1).slice(2)}`;
  const historyView = () => {
    const seasons = ED.def.history.seasons.slice().sort((a, b) => b.year - a.year),
      start = yearOf(),
      next = seasons.length ? seasons[seasons.length - 1].year - 1 : start - 1;
    return `<div class="h1" style="margin-top:2vh">History</div><div class="tag">Past seasons before the one you start in (${yy(start)}). They fill the archive, club honours and the record books.</div>
      ${errBox()}
      ${
        seasons
          .map(
            (s) =>
              `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edSeason" data-y="${s.year}"><div class="row"><div class="grow"><div class="small b">${yy(s.year)}</div><div class="tiny dim">${Object.keys(s.comps).length} league${Object.keys(s.comps).length === 1 ? '' : 's'} filled in</div></div><span class="dim">›</span></div></div>`,
          )
          .join('') || '<div class="empty">No past seasons yet.</div>'
      }
      <div class="ng-label">Seasons you have not entered</div>
      <div class="seg" style="margin:0">${[
        [false, 'Leave empty'],
        [true, 'Make them up'],
      ]
        .map(
          ([k, t]) =>
            `<button class="${!!ED.def.meta.fillHistory === k ? 'on' : ''}" data-act="edFillHistory" data-v="${k}">${t}</button>`,
        )
        .join('')}</div>
      <div class="tiny dim" style="margin-top:6px;line-height:1.5">With "make them up" the game invents the thirty years before the start that you have not entered, as it does for a world without the editor.</div>
      <div class="ng-label">Add a season <span class="tiny dim">· the year it started</span></div>
      <div class="ng-names" style="margin-top:0"><input type="number" id="ed-hyear" inputmode="numeric" value="${next}" style="max-width:120px"><button class="btn sm pri grow" data-act="edAddSeason">Add</button></div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="home" aria-label="Back">←</button></div>`;
  };
  const seasonView = () => {
    const s = seasonOf(ED.hy);
    if (!s) return historyView();
    const nameOf = (id) => (ED.def.clubs.find((c) => c.id === id) || { name: id }).name;
    const nations = [...new Set(ED.def.leagues.map((l) => l.nat))];
    const tourns = [...Object.keys(intlNow().tourns), ...intlNow().invites.map((v) => v.id)];
    return `<div class="h1" style="margin-top:2vh">${yy(s.year)}</div><div class="tag">Tap a league, a cup or a tournament to say who won it.</div>
      ${errBox()}
      ${nations
        .map((nat) => {
          const n = D.NATIONS[nat] || { flag: '', name: nat };
          return `<div class="tiny" style="color:#9fb0c5;margin:12px 0 4px">${n.flag} ${esc(n.name)}</div>${ED.def.leagues
            .filter((l) => l.nat === nat)
            .map((l) => {
              const e = s.comps[l.id];
              return `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edSeasonLeague" data-lid="${esc(l.id)}"><div class="row"><div class="grow"><div class="small b">${esc(l.name)}</div><div class="tiny dim">${e ? `🏆 ${esc(nameOf(e.champion))} · ${esc(nameOf(e.runnerUp))}` : 'Not filled in'}</div></div><span class="dim">›</span></div></div>`;
            })
            .join('')}${domCups()
            .filter((k) => k.nat === nat && !k.removed)
            .map((k) => {
              const e = (s.cups || {})[k.id];
              return `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edSeasonCup" data-cup="${k.id}"><div class="row"><div class="grow"><div class="small b">${esc((compOf(k.id) || k).name)}</div><div class="tiny dim">${e ? `🏆 ${esc(nameOf(e.winner))}` : 'Not filled in'}</div></div><span class="dim">›</span></div></div>`;
            })
            .join('')}`;
        })
        .join('')}
      <div class="card tap" style="margin:12px 0 4px;padding:10px 12px" data-act="edSeasonTransfers"><div class="row"><div class="grow"><div class="small b">💰 Big transfers</div><div class="tiny dim">${(s.transfers || []).length ? `${s.transfers.length} entered` : 'None entered'}</div></div><span class="dim">›</span></div></div>
      <div class="tiny" style="color:#9fb0c5;margin:12px 0 4px">🌍 International</div>
      ${tourns
        .map((id) => {
          const e = (s.intl || {})[id];
          return `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edSeasonIntl" data-tid="${id}"><div class="row"><div class="grow"><div class="small b">${esc(tName(id))}</div><div class="tiny dim">${e ? `🏆 ${(D.NATIONS[e.winner] || {}).flag || ''} ${esc((ntOf(e.winner) || D.NATIONS[e.winner] || { name: e.winner }).name)}` : 'Not filled in'}</div></div><span class="dim">›</span></div></div>`;
        })
        .join('')}
      <div class="actions" style="margin-top:14px"><button class="btn sm" data-act="edDelSeason">Delete this season</button></div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="history" aria-label="Back">←</button></div>`;
  };
  const seasonCupView = () => {
    const s = seasonOf(ED.hy),
      k = domCups().find((x) => x.id === ED.hc);
    if (!s || !k) return historyView();
    const e = (s.cups || {})[k.id] || {};
    const clubs = ED.def.clubs.filter((c) => c.nat === k.nat).sort((a, b) => a.name.localeCompare(b.name));
    const sel = (id, cur, none) =>
      `<select id="ed-${id}"><option value="">${none}</option>${clubs.map((c) => `<option value="${esc(c.id)}" ${c.id === cur ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select>`;
    return `<div class="h1" style="margin-top:2vh">${esc((compOf(k.id) || k).name)}</div><div class="tag">${yy(s.year)}. The winner's cup titles are counted in the club's honours.</div>
      ${errBox()}
      <div class="ng-label">Winner</div>${sel('cw', e.winner, 'Not filled in')}
      <div class="ng-label">Runner-up <span class="tiny dim">· optional</span></div>${sel('cr', e.runnerUp, 'Not chosen')}
      <div class="actions ng-foot"><button class="btn sm" data-act="edSeason" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edSaveSeasonCup">Save</button></div>`;
  };
  // The season's big transfers (the record deals the club pages and the archive show): player, nation, the clubs and the fee
  UI.acts.edSeasonTransfers = () => {
    ED.view = 'seasontransfers';
    ED.err = [];
    UI.worldEditor();
  };
  const clubByName = (text) => {
    const q = String(text || '')
      .trim()
      .toLowerCase();
    return q
      ? ED.def.clubs.find(
          (c) => c.name.toLowerCase() === q || c.id.toLowerCase() === q || (c.short || '').toLowerCase() === q,
        )
      : null;
  };
  UI.acts.edAddTransfer = () => {
    const v = (id) => ($('#ed-' + id) || {}).value;
    const s = seasonOf(ED.hy),
      to = clubByName(v('trto')),
      from = clubByName(v('trfrom'));
    const fail = (m) => {
      ED.err = [m];
      UI.worldEditor();
    };
    if (!(v('trname') || '').trim()) return fail('Give the player a name');
    if (!to) return fail('The club he joined is not one of the clubs of this world (type its name)');
    if ((v('trfrom') || '').trim() && !from)
      return fail('The club he left is not one of the clubs of this world (leave it empty for a free signing)');
    s.transfers = s.transfers || [];
    s.transfers.push({
      name: v('trname').trim(),
      nat: v('trnat') || null,
      from: from ? from.id : null,
      to: to.id,
      fee: Math.round(+v('trfee') * 1e6) || 0,
    });
    const bad = WD.validate(ED.def, null).errors.filter((e) => e.startsWith(`season ${s.year}`));
    if (bad.length) {
      s.transfers.pop();
      return fail(bad[0]);
    }
    ED.err = [];
    UI.worldEditor();
  };
  UI.acts.edDelTransfer = (d) => {
    seasonOf(ED.hy).transfers.splice(+d.i, 1);
    UI.worldEditor();
  };
  const seasonTransfersView = () => {
    const s = seasonOf(ED.hy);
    if (!s) return historyView();
    const nameOf = (id) => (ED.def.clubs.find((c) => c.id === id) || { name: id || 'free' }).name;
    const nats = natEntries().sort((a, b) => a[1].name.localeCompare(b[1].name));
    return `<div class="h1" style="margin-top:2vh">Big transfers</div><div class="tag">${yy(s.year)}. The biggest deals of the season: the archive shows the record deal. Up to twenty.</div>
      ${errBox()}
      ${
        (s.transfers || [])
          .map(
            (x, i) =>
              `<div class="card" style="margin:4px 0;padding:10px 12px"><div class="row"><div class="grow"><div class="small b">${(D.NATIONS[x.nat] || {}).flag || ''} ${esc(x.name)}</div><div class="tiny dim">${esc(nameOf(x.from))} → ${esc(nameOf(x.to))} · ${U.money(x.fee)}</div></div><button class="btn sm" data-act="edDelTransfer" data-i="${i}" aria-label="Remove">✕</button></div></div>`,
          )
          .join('') || '<div class="empty">None entered.</div>'
      }
      <div class="ng-label">Add a transfer</div>
      <datalist id="ed-clublist">${ED.def.clubs.map((c) => `<option value="${esc(c.name)}"></option>`).join('')}</datalist>
      <input type="text" id="ed-trname" maxlength="40" placeholder="Player's name">
      <div class="ng-names"><select id="ed-trnat" style="flex:1"><option value="">Nation</option>${nats.map(([k, n]) => `<option value="${k}">${n.flag} ${esc(n.name)}</option>`).join('')}</select><input type="number" id="ed-trfee" min="0" step="0.5" inputmode="decimal" placeholder="Fee, millions" style="max-width:130px"></div>
      <input type="text" id="ed-trfrom" list="ed-clublist" placeholder="Club he left (empty: free)" autocomplete="off" style="margin-top:8px">
      <input type="text" id="ed-trto" list="ed-clublist" placeholder="Club he joined" autocomplete="off" style="margin-top:8px">
      <div class="actions ng-foot"><button class="btn sm" data-act="edSeason" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edAddTransfer">Add the transfer</button></div>`;
  };
  UI.acts.edSeasonIntl = (d) => {
    ED.view = 'seasonintl';
    ED.ht = d.tid;
    ED.err = [];
    UI.worldEditor();
  };
  UI.acts.edSaveSeasonIntl = () => {
    const v = (id) => ($('#ed-' + id) || {}).value;
    const s = seasonOf(ED.hy);
    s.intl = s.intl || {};
    if (!v('iw')) delete s.intl[ED.ht];
    else if (v('iw') === v('ir')) {
      ED.err = ['The winner and the runner-up are different nations'];
      return UI.worldEditor();
    } else s.intl[ED.ht] = { winner: v('iw'), runnerUp: v('ir') || null };
    ED.view = 'season';
    ED.err = [];
    UI.toast('Saved', 1500);
    UI.worldEditor();
  };
  const seasonIntlView = () => {
    const s = seasonOf(ED.hy);
    if (!s || !tName(ED.ht)) return historyView();
    const e = (s.intl || {})[ED.ht] || {};
    const nats = natEntries().sort((a, b) => a[1].name.localeCompare(b[1].name));
    const sel = (id, cur, none) =>
      `<select id="ed-${id}"><option value="">${none}</option>${nats.map(([k, n]) => `<option value="${k}" ${k === cur ? 'selected' : ''}>${n.flag} ${esc(n.name)}</option>`).join('')}</select>`;
    return `<div class="h1" style="margin-top:2vh">${esc(tName(ED.ht))}</div><div class="tag">${yy(s.year)}. The winner counts a title for the nation, and the Continental Champions Trophy invites the continental champions.</div>
      ${errBox()}
      <div class="ng-label">Winner</div>${sel('iw', e.winner, 'Not filled in')}
      <div class="ng-label">Runner-up <span class="tiny dim">· optional</span></div>${sel('ir', e.runnerUp, 'Not chosen')}
      <div class="actions ng-foot"><button class="btn sm" data-act="edSeason" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edSaveSeasonIntl">Save</button></div>`;
  };
  const seasonLeagueView = () => {
    const s = seasonOf(ED.hy),
      l = leagueOf(ED.hl);
    if (!s || !l) return historyView();
    const e = s.comps[l.id] || {};
    const clubs = clubsOf(l.id).sort((a, b) => a.name.localeCompare(b.name));
    const sel = (id, cur, none) =>
      `<select id="ed-${id}"><option value="">${none}</option>${clubs.map((c) => `<option value="${esc(c.id)}" ${c.id === cur ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select>`;
    return `<div class="h1" style="margin-top:2vh">${esc(l.name)}</div><div class="tag">${yy(s.year)}. The rest of the table is made up to fit.</div>
      ${errBox()}
      <div class="ng-label">Champion</div>${sel('hc', e.champion, 'Not filled in')}
      <div class="ng-label">Runner-up</div>${sel('hr', e.runnerUp, 'Choose')}
      <div class="ng-label">Third <span class="tiny dim">· optional</span></div>${sel('ht', e.third, 'Not chosen')}
      <div class="actions ng-foot"><button class="btn sm" data-act="edSeason" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edSaveSeasonLeague">Save</button></div>`;
  };
  UI.acts.edSquadMode = (d) => {
    ED.def.meta.players = d.v;
    UI.worldEditor();
  };

  const squadView = () => {
    const free = ED.cid === FREE,
      c = free ? null : ED.def.clubs.find((x) => x.id === ED.cid),
      list = playersOf(ED.cid).sort((a, b) => abilityOf(b.attrs, b.pos) - abilityOf(a.attrs, a.pos)),
      year = yearOf(),
      replace = ED.def.meta.players === 'replace';
    return `<div class="h1" style="margin-top:2vh">${free ? '🆓 Free agents' : `${crestDot(c)} ${esc(c.name)}: players`}</div><div class="tag">${free ? 'Players with no club. Every club can sign them, and they wait in the free agent list from the first day.' : `The players you make for this club. ${replace ? 'A club with 11 or more of them gets exactly this squad (any gaps are made up).' : 'Each one takes the place of the weakest player in his position once the squad is full.'}`}</div>
      ${errBox()}
      ${
        list
          .map((p) => {
            const ca = abilityOf(p.attrs, p.pos);
            return `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edPlayer" data-pid="${esc(p.id)}"><div class="row"><div class="grow"><div class="small b">${esc(((p.fn || '') + ' ' + (p.ln || '')).trim())}</div><div class="tiny dim">${p.callup ? '🌐 ' : ''}${esc(D.POS_NAME[p.pos] || p.pos)} · ${year - p.born} · ability ${ca} · potential ${p.pa ?? ca}</div></div><span class="dim">›</span></div></div>`;
          })
          .join('') || `<div class="empty">No players made ${free ? 'as free agents' : 'for this club'} yet.</div>`
      }
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="${free ? 'home' : 'club'}" aria-label="Back">←</button><button class="btn sm" data-act="edImportPlayers">⬇️ Import</button><button class="btn sm pri grow" data-act="edAddPlayer">＋ Add a player</button></div>`;
  };

  const playerView = () => {
    const p = ED.def.players.find((x) => x.id === ED.pid);
    if (!p) return squadView();
    const year = yearOf(),
      ca = abilityOf(p.attrs, p.pos),
      nations = natEntries().sort((a, b) => a[1].name.localeCompare(b[1].name));
    const sl = (k) =>
      `<div class="row" style="gap:10px;align-items:center"><span class="small" style="width:96px;flex:none">${esc(D.ATTR_LABEL[k])}</span><input type="range" id="ed-a-${k}" min="1" max="20" step="1" value="${p.attrs[k]}" style="flex:1"><b id="ed-av-${k}" style="width:22px;text-align:right">${p.attrs[k]}</b></div>`;
    return `<div class="h1" style="margin-top:2vh">${esc(((p.fn || '') + ' ' + (p.ln || '')).trim() || 'New player')}</div><div class="tag">A player of your own. The game builds the rest of him (wage, personality, second positions) when the world starts.</div>
      ${errBox()}
      <div id="ed-pwarn">${playerWarn(p)}</div>
      <div class="ng-names"><div style="flex:1"><div class="ng-label" style="margin-top:0">First name</div><input type="text" id="ed-fn" maxlength="24" value="${esc(p.fn || '')}"></div><div style="flex:1"><div class="ng-label" style="margin-top:0">Last name</div><input type="text" id="ed-ln" maxlength="28" value="${esc(p.ln || '')}"></div></div>
      <div class="ng-label">Nationality</div><select id="ed-nat">${nations.map(([k, n]) => `<option value="${k}" ${p.nat === k ? 'selected' : ''}>${n.flag} ${esc(n.name)}</option>`).join('')}</select>
      <div class="ng-names"><div style="flex:1"><div class="ng-label" style="margin-top:0">Position</div><select id="ed-pos">${D.POS.map((k) => `<option value="${k}" ${p.pos === k ? 'selected' : ''}>${esc(D.POS_NAME[k])}</option>`).join('')}</select></div><div style="flex:1"><div class="ng-label" style="margin-top:0">Foot</div><select id="ed-foot">${['Right', 'Left', 'Both'].map((k) => `<option ${p.foot === k ? 'selected' : ''}>${k}</option>`).join('')}</select></div></div>
      <div class="ng-names"><div style="flex:1"><div class="ng-label" style="margin-top:0">Age at the start</div><input type="number" id="ed-age" min="15" max="45" inputmode="numeric" value="${year - p.born}"></div><div style="flex:1"><div class="ng-label" style="margin-top:0">Contract ends</div><input type="number" id="ed-contract" min="${year}" max="${year + 8}" inputmode="numeric" value="${p.contract || ''}"></div></div>
      <div class="ng-label">Attributes <span class="tiny dim">· ability <b id="ed-cav" style="color:#e6edf6">${ca}</b></span></div>
      <div style="display:grid;gap:6px">${D.ATTRS.map(sl).join('')}</div>
      <div class="ng-label">Or set them from an ability</div>
      <div class="row" style="gap:10px;align-items:center"><input type="range" id="ed-ca" min="20" max="95" step="1" value="${ca}" style="flex:1"><b id="ed-cas" style="width:28px;text-align:right">${ca}</b><button class="btn sm" data-act="edSuggest">Fill in</button></div>
      <label class="small" style="display:flex;gap:8px;align-items:center;margin-top:12px"><input type="checkbox" id="ed-pcall" ${p.callup ? 'checked' : ''}> Called up by ${esc((D.NATIONS[p.nat] || { name: 'his country' }).name)} <span class="tiny dim">(picked ahead of better players for three years)</span></label>
      <div class="ng-label">Potential <b id="ed-pav" style="color:#e6edf6">${p.pa ?? ca}</b> <span class="tiny dim">(never below his ability)</span></div>
      <input type="range" id="ed-pa" min="${ca}" max="96" step="1" value="${Math.max(ca, p.pa ?? ca)}" style="width:100%">
      <div class="actions" style="margin-top:14px"><button class="btn sm" data-act="edDelPlayer">Delete this player</button></div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edSquad" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edSavePlayer">Save player</button></div>`;
  };

  UI.worldEditor = function () {
    if (!ED) return UI.newCareer();
    const app = $('#app');
    const views = {
      league: leagueView,
      club: clubView,
      importp: importView,
      library: libraryView,
      clubx: clubxView,
      squad: squadView,
      player: playerView,
      cups: cupsView,
      cup: cupView,
      calendar: calendarView,
      pins: pinsView,
      newcup: newCupView,
      staff: staffView,
      staffhub: staffHubView,
      managers: managersView,
      agents: agentsView,
      staffer: stafferView,
      nations: nationsView,
      confeds: confedsView,
      nation: nationView,
      history: historyView,
      season: seasonView,
      seasoncup: seasonCupView,
      seasonintl: seasonIntlView,
      seasontransfers: seasonTransfersView,
      intl: intlView,
      seasonleague: seasonLeagueView,
      newleague: newLeagueView,
      changes: changesView,
    };
    const body = (views[ED.view] || homeView)();
    app.innerHTML = `<div class="title ed-wide">${body}</div>`;
    // a long list to pick from (the 90 nations) gets a box to type in
    document.querySelectorAll('.title select').forEach((sel) => {
      if (sel.options.length < 40 || sel.dataset.found) return;
      sel.dataset.found = '1';
      const all = [...sel.options].map((o) => [o.value, o.textContent, o.selected]);
      const box = document.createElement('input');
      box.type = 'search';
      box.placeholder = 'Type to find…';
      box.style.marginBottom = '6px';
      box.addEventListener('input', () => {
        const t = box.value.trim().toLowerCase(),
          keep = sel.value;
        const show = all.filter(([v, n]) => !t || n.toLowerCase().includes(t) || v === keep);
        sel.innerHTML = show
          .map(([v, n]) => `<option value="${esc(v)}" ${v === keep ? 'selected' : ''}>${esc(n)}</option>`)
          .join('');
      });
      sel.parentNode.insertBefore(box, sel);
    });
    window.scrollTo(0, 0);
    // fields that update the definition as you type
    const bind = (id, fn) => {
      const el = $('#' + id);
      if (el) el.addEventListener('input', () => fn(el.value));
    };
    bind('ed-wname', (v) => (ED.def.meta.name = v));
    bind('ed-wauthor', (v) => (ED.def.meta.author = v));
    bind('ed-wdesc', (v) => (ED.def.meta.description = v));
    bind('ed-wver', (v) => (ED.def.meta.version = v));
    bind('ed-wlic', (v) => (ED.def.meta.license = v));
    bind('ed-wcred', (v) => (ED.def.meta.credits = v));
    bind('ed-hq', (v) => {
      ED.hq = v;
      $('#ed-hres').innerHTML = homeFind(v);
    });
    if (ED.view === 'league') {
      const cur = leagueOf(ED.lid);
      bind('ed-lname', () => cur && ($('#ed-lwarn').innerHTML = leagueWarn(cur)));
    }
    if (ED.view === 'club') {
      const cur = ED.def.clubs.find((x) => x.id === ED.cid);
      for (const id of ['name', 'short', 'nick', 'c1', 'c2', 'league'])
        bind('ed-' + id, () => cur && ($('#ed-warn').innerHTML = clubWarn(cur)));
    }
    bind('ed-q', (v) => {
      ED.q = v;
      const q = v.trim().toLowerCase();
      $('#ed-list').innerHTML = listRows(
        clubsOf(ED.lid)
          .filter((c) => !q || c.name.toLowerCase().includes(q) || (c.city || '').toLowerCase().includes(q))
          .sort((a, b) => b.rep - a.rep),
      );
    });
    bind('ed-rep', (v) => ($('#ed-repv').textContent = v));
    bind('ed-mab', (v) => ($('#ed-mabv').textContent = v));
    bind('ed-sab', (v) => ($('#ed-sabv').textContent = v));
    bind('ed-mrep', (v) => ($('#ed-mrepv').textContent = v));
    if (ED.view === 'importp' && $('#ed-impfile'))
      $('#ed-impfile').addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) $('#ed-imptext').value = await file.text();
      });
    if (ED.view === 'clubx') {
      for (const id of ['xcs', 'xcp', 'xce']) bind('ed-' + id, () => ($('#ed-crestprev').innerHTML = draftCrest()));
      bind('ed-xkh', (v) => (($('#ed-kithome').innerHTML = shirtSvg(v)), ($('#ed-xkiton').checked = true)));
      bind('ed-xka', (v) => (($('#ed-kitaway').innerHTML = shirtSvg(v)), ($('#ed-xkiton').checked = true)));
      for (const k of WD.FACILITIES) bind('ed-xf-' + k, (v) => ($('#ed-xf-' + k + 'v').textContent = v));
      for (const k of ['market', 'support', 'catchment'])
        bind('ed-xa-' + k, (v) => ($('#ed-xa-' + k + 'v').textContent = v));
    }
    bind('ed-sjudge', (v) => ($('#ed-sjudgev').textContent = v));
    for (const r of Object.keys(D.REGIONS)) bind('ed-sreg-' + r, (v) => ($('#ed-sregv-' + r).textContent = v + '%'));
    bind('ed-ncoef', (v) => ($('#ed-ncoefv').textContent = v));
    const showCupWarn = () => {
      const c = cupList().find((x) => x.id === ED.cup);
      if (c && $('#ed-cupwarn')) $('#ed-cupwarn').innerHTML = cupWarn(c);
    };
    bind('ed-cupprize', () => saveCupPrize());
    bind('ed-cupname', () => (saveCupNames(), showCupWarn()));
    bind('ed-cupshort', () => (saveCupNames(), showCupWarn()));
    if (ED.view === 'player') {
      for (const k of D.ATTRS)
        bind('ed-a-' + k, (v) => {
          $('#ed-av-' + k).textContent = v;
          showAbility();
        });
      const pcur = ED.def.players.find((x) => x.id === ED.pid);
      for (const id of ['fn', 'ln', 'pos', 'pa', 'born', ...D.ATTRS.map((k) => 'a-' + k)])
        bind('ed-' + id, () => pcur && $('#ed-pwarn') && ($('#ed-pwarn').innerHTML = playerWarn(pcur)));
      bind('ed-pos', () => showAbility());
      bind('ed-ca', (v) => ($('#ed-cas').textContent = v));
      bind('ed-pa', (v) => ($('#ed-pav').textContent = v));
    }
  };
  // (the tap targets carry their league and club in data attributes: the act handler reads them as strings)

  // ---------- Editing the world you are playing ----------
  // A name, a rating, a colour changed in a career in progress: it takes effect at once and is saved, and nothing marks the save
  // as edited. The player and club sheets carry an Edit button, and Settings has a search for both.
  const live = () => FM.S && FM.S.user && FM.S.players;
  const persist = () => {
    if (FM.SimRunner) FM.SimRunner.packed = null; // (a save packed before the edit would bring the old numbers back)
    UI.save();
  };
  const busy = () => {
    if (!UI.simBusy) return false;
    UI.toast('Wait for the matchday to finish first', 2500);
    return true;
  };
  const num = (id, lo, hi) => Math.max(lo, Math.min(hi, Math.round(+($('#' + id) || {}).value || 0)));
  UI.acts.liveEdit = () => {
    if (!live() || busy()) return;
    const sh = UI.sheet(
      `<div class="tiny dim" style="line-height:1.5">Fix a name or a rating in the world you are playing. A change takes effect at once and nothing marks the save.</div>
      <div class="ng-find" style="margin-top:10px"><input type="search" id="le-q" placeholder="A player or a club" autocomplete="off"></div>
      <div id="le-res"></div>`,
      { title: 'Edit the world' },
    );
    const q = sh.querySelector('#le-q');
    q.addEventListener('input', () => {
      const t = q.value.trim().toLowerCase();
      const res = sh.querySelector('#le-res');
      if (t.length < 2) {
        res.innerHTML = '';
        return;
      }
      const clubs = Object.values(FM.S.clubs)
        .filter((c) => c.comp && [c.name, c.short, c.city].some((x) => (x || '').toLowerCase().includes(t)))
        .slice(0, 8);
      const players = Object.values(FM.S.players)
        .filter((p) => !p.retired && FM.W.name(p).toLowerCase().includes(t))
        .sort((a, b) => b.ca - a.ca)
        .slice(0, 12);
      res.innerHTML =
        clubs
          .map(
            (c) =>
              `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="liveEditClub" data-id="${esc(c.id)}"><div class="small b">${esc(c.name)}</div><div class="tiny dim">Club · ${esc(c.city || '')}</div></div>`,
          )
          .join('') +
          players
            .map((p) => {
              const c = p.clubId && FM.S.clubs[p.clubId];
              return `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="liveEditPlayer" data-id="${esc(p.id)}"><div class="small b">${esc(FM.W.name(p))}</div><div class="tiny dim">${esc(p.pos)} · ${FM.W.age(p)} · ${p.ca} · ${esc(c ? c.name : 'free agent')}</div></div>`;
            })
            .join('') || '<div class="empty">No one matches.</div>';
    });
    q.focus();
  };
  const fld = (id, label, value, extra = '') =>
    `<div style="flex:1;min-width:0"><div class="ng-label" style="margin-top:8px">${label}</div><input type="text" id="${id}" value="${esc(value ?? '')}" ${extra}></div>`;
  UI.acts.liveEditPlayer = (d) => {
    const p = FM.S.players[d.id];
    if (!p || busy()) return;
    UI.closeSheet();
    const attrs = D.ATTRS.map(
      (k) =>
        `<div style="flex:1 1 30%;min-width:96px"><div class="tiny dim">${esc((D.ATTR_LABEL || {})[k] || k)}</div><input type="number" id="le-a-${k}" min="1" max="20" inputmode="numeric" value="${Math.round(p.attrs[k])}"></div>`,
    ).join('');
    UI.sheet(
      `<div class="row" style="gap:8px">${esc(fld('le-fn', 'First name', p.fn, 'maxlength="24"'))}${esc(fld('le-ln', 'Surname', p.ln, 'maxlength="32"'))}</div>
      <div class="row" style="gap:8px;margin-top:4px">
        <div style="flex:1"><div class="ng-label" style="margin-top:8px">Foot</div><select id="le-foot">${['Right', 'Left', 'Both'].map((f) => `<option ${p.foot === f ? 'selected' : ''}>${f}</option>`).join('')}</select></div>
        <div style="flex:1"><div class="ng-label" style="margin-top:8px">Potential</div><input type="number" id="le-pa" min="20" max="99" inputmode="numeric" value="${p.pa}"></div>
        <div style="flex:1"><div class="ng-label" style="margin-top:8px">Contract to</div><input type="number" id="le-ct" inputmode="numeric" value="${p.contract || FM.S.year}"></div>
      </div>
      <div class="ng-label">Attributes <span class="tiny dim">· 1 to 20; his ability follows from them</span></div>
      <div class="row" style="gap:8px;flex-wrap:wrap">${attrs}</div>
      <div class="actions" style="margin-top:14px"><button class="btn pri block" data-act="liveSavePlayer" data-id="${esc(p.id)}">Save</button></div>`,
      { title: esc(FM.W.name(p)), full: true },
    );
  };
  UI.acts.liveSavePlayer = (d) => {
    const p = FM.S.players[d.id];
    if (!p || busy()) return;
    const fn = (($('#le-fn') || {}).value || '').trim(),
      ln = (($('#le-ln') || {}).value || '').trim();
    if (!ln) return UI.toast('He needs a surname', 2500);
    if (D.isRude && (D.isRude(fn) || D.isRude(ln)))
      return UI.toast('That name contains a word the game will not use', 3000);
    p.fn = fn;
    p.ln = ln;
    p.foot = ($('#le-foot') || {}).value || p.foot;
    for (const k of D.ATTRS) p.attrs[k] = num('le-a-' + k, 1, 20);
    p.contract = num('le-ct', FM.S.year, FM.S.year + 8);
    FM.W.refresh(p); // (his ability, and his value, follow from the attributes)
    p.pa = Math.max(p.ca, num('le-pa', 20, 99));
    persist();
    UI.closeSheet();
    UI.render();
    UI.toast('Saved', 1500);
    UI.playerSheet(p.id);
  };
  UI.acts.liveEditClub = (d) => {
    const c = FM.S.clubs[d.id];
    if (!c || busy()) return;
    UI.closeSheet();
    UI.sheet(
      `${fld('le-name', 'Name', c.name, 'maxlength="40"')}
      <div class="row" style="gap:8px">${esc(fld('le-short', 'Short name (up to 5)', c.short, 'maxlength="5"'))}${esc(fld('le-nick', 'Nickname', c.nick || '', 'maxlength="24"'))}</div>
      ${fld('le-city', 'City', c.city || '', 'maxlength="32"')}
      <div class="ng-label">Colours</div>
      <div class="row" style="gap:10px"><input type="color" id="le-c1" value="${esc(c.colors[0])}" style="width:64px;height:44px;padding:2px"><input type="color" id="le-c2" value="${esc(c.colors[1])}" style="width:64px;height:44px;padding:2px"></div>
      ${fld('le-ground', 'Ground', c.stadium.name, 'maxlength="40"')}
      <div class="row" style="gap:8px"><div style="flex:1"><div class="ng-label" style="margin-top:8px">Capacity</div><input type="number" id="le-cap" min="1000" max="120000" step="500" inputmode="numeric" value="${esc(c.stadium.cap)}"></div><div style="flex:1"><div class="ng-label" style="margin-top:8px">Reputation</div><input type="number" id="le-rep" min="20" max="99" inputmode="numeric" value="${c.rep}"></div></div>
      <div class="actions" style="margin-top:14px"><button class="btn pri block" data-act="liveSaveClub" data-id="${esc(c.id)}">Save</button></div>`,
      { title: esc(c.name), full: true },
    );
  };
  UI.acts.liveSaveClub = (d) => {
    const c = FM.S.clubs[d.id];
    if (!c || busy()) return;
    const v = (id) => (($('#' + id) || {}).value || '').trim();
    const name = v('le-name'),
      short = v('le-short').toUpperCase();
    if (!name) return UI.toast('A club needs a name', 2500);
    if (D.isRude && (D.isRude(name) || D.isRude(short)))
      return UI.toast('That name contains a word the game will not use', 3000);
    c.name = name;
    c.short = short || c.short;
    c.nick = v('le-nick');
    c.city = v('le-city');
    c.colors = [v('le-c1') || c.colors[0], v('le-c2') || c.colors[1]];
    c.stadium.name = v('le-ground') || c.stadium.name;
    c.stadium.cap = c.stadium.cap0 = num('le-cap', 1000, 120000);
    c.rep = num('le-rep', 20, 99);
    persist();
    UI.closeSheet();
    UI.render();
    UI.toast('Saved', 1500);
  };
  // An Edit button at the foot of every player and club sheet
  const withEdit = (name, act) => {
    const open = UI[name];
    UI[name] = function (id, ...rest) {
      const r = open.call(this, id, ...rest);
      const sheets = document.querySelectorAll('.sheet-wrap .sh-body');
      const body = sheets[sheets.length - 1];
      if (live() && body && !body.querySelector('[data-act="' + act + '"]'))
        body.insertAdjacentHTML(
          'beforeend',
          `<div class="actions" style="margin:14px 0 4px"><button class="btn sm" data-act="${act}" data-id="${esc(id)}">✏️ Edit</button></div>`,
        );
      return r;
    };
  };
  withEdit('playerSheet', 'liveEditPlayer');
  withEdit('clubSheet', 'liveEditClub');
})();
