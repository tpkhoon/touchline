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
      view: 'home',
      lid: null,
      cid: null,
      q: '',
      err: [],
    };
    // (a definition made from the built-in data, with nothing changed, is still the built-in world)
    if (!ED.def.meta.name || ED.def.meta.name === 'Built-in data') ED.def.meta.name = 'My world';
    UI.worldEditor();
  };
  UI.acts.edClose = () => {
    ED = null;
    const cur = UI._ng().db;
    if (cur && cur.ok) DB.stage(cur);
    UI.newCareer();
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
      short: (v('short') || '').trim().toUpperCase(),
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

  const homeView = () => {
    const s = status(),
      m = ED.def.meta;
    const nations = [...new Set(ED.def.leagues.map((l) => l.nat))];
    const bad = s.chk.errors.length;
    return `<div class="h1" style="margin-top:3vh">World editor</div><div class="tag">Change the clubs and leagues your world starts from. Nothing changes in the game until you use the world.</div>
      <div class="ng-label">Name of this world</div><input type="text" id="ed-wname" maxlength="40" value="${esc(m.name || '')}">
      <div class="ng-label">Author</div><input type="text" id="ed-wauthor" maxlength="40" value="${esc(m.author || '')}">
      <div class="ng-label">Description</div><input type="text" id="ed-wdesc" maxlength="120" value="${esc(m.description || '')}">
      <div class="small" style="margin-top:14px;color:${bad ? '#f87171' : '#c8ff3d'}">${bad ? `⚠️ ${bad} problem${bad > 1 ? 's' : ''} to fix` : '✅ Ready to use'} <span style="color:#9fb0c5">· ${s.changed} club${s.changed === 1 ? '' : 's'} changed${s.added ? `, ${s.added} added` : ''}${s.leaguesAdded ? ` · ${s.leaguesAdded} league${s.leaguesAdded === 1 ? '' : 's'} added` : ''}${s.leaguesChanged ? ` · ${s.leaguesChanged} league${s.leaguesChanged === 1 ? '' : 's'} changed` : ''}${(ED.def.removeClubs || []).length ? ` · ${ED.def.removeClubs.length} taken out` : ''}</span></div>
      ${
        bad
          ? `<div class="tiny" style="color:#9fb0c5;margin-top:6px;line-height:1.5">${s.chk.errors
              .slice(0, 5)
              .map((e) => `• ${esc(e)}`)
              .join('<br>')}</div>`
          : ''
      }
      ${errBox()}
      <div class="ng-label">Rules</div>
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
      <div class="ng-label">Beyond the clubs</div>
      ${[
        ['cups', '🏆 Cups', `${(ED.def.competitions || []).length} changed · names and formats`],
        [
          'staffhub',
          '🧑‍🏫 Staff, managers and agents',
          `${(ED.def.staff || []).length} coaches and scouts · ${(ED.def.managers || []).length} managers`,
        ],
        ['intl', '🌍 International football', `tournaments, national teams and their history`],
        [
          'history',
          '📜 History',
          `${ED.def.history.seasons.length} past season${ED.def.history.seasons.length === 1 ? '' : 's'}`,
        ],
      ]
        .map(
          ([v, t, s]) =>
            `<div class="card tap" style="margin:6px 0;padding:10px 12px" data-act="edView" data-v="${v}"><div class="row"><div class="grow"><div class="small b">${t}</div><div class="tiny dim">${s}</div></div><span class="dim">›</span></div></div>`,
        )
        .join('')}
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
      <div class="card tap" style="margin:12px 0 0;padding:10px 12px" data-act="edSquad" data-cid="${FREE}"><div class="row"><div class="grow"><div class="small b">🆓 Free agents</div><div class="tiny dim">${playersOf(FREE).length} made</div></div><span class="dim">›</span></div></div>
      <div class="ng-label">Leagues — tap one to edit its clubs</div>
      ${nations
        .map((nat) => {
          const n = D.NATIONS[nat] || { flag: '', name: nat };
          return `<div class="tiny" style="color:#9fb0c5;margin:12px 0 4px">${n.flag} ${esc(n.name)}</div>${ED.def.leagues
            .filter((l) => l.nat === nat)
            .map(
              (l) =>
                `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edView" data-v="league" data-lid="${esc(l.id)}"><div class="row"><div class="grow"><div class="small b">${esc(l.name)}</div><div class="tiny dim">Tier ${l.tier} · ${clubsOf(l.id).length} clubs</div></div><span class="dim">›</span></div></div>`,
            )
            .join('')}`;
        })
        .join('')}
      <div class="actions" style="margin-top:16px"><button class="btn sm" data-act="edNewLeague">＋ Add a league</button><button class="btn sm" data-act="edReset">Start again from the built-in world</button></div>
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
    const opts = WD.TIEBREAKS.slice();
    if (!opts.some(([k]) => k.join() === tbKey(l))) opts.push([tbKey(l).split(','), 'As the game has it']);
    return `<div class="ng-label">Matches</div>${
      fixed
        ? '<div class="tiny dim" style="line-height:1.5">This league has a format of its own (a split, zones, conferences or two tournaments), which stays.</div>'
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
  const leagueRules = (l) => {
    const r = l.rules || {},
      up = upperOf(l),
      out = [leagueFormat(l)];
    if (up) {
      const pr = pairOf(l, up);
      out.push(
        `<div class="ng-label">Promotion and relegation with the ${esc(up.name)}</div>${segN('edUpDown', pr.n, [0, 1, 2, 3, 4])}${
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
        cc = D.CONTINENTALS.find(
          (c) => c.id === ((r.qualify && r.qualify.to) || CONT[(D.NATIONS[l.nat] || {}).region]),
        );
      out.push(
        `<div class="ng-label">Places in the ${esc(cc ? cc.name : 'continental cup')}</div>${cc ? segN('edQualify', cur, [0, 1, 2, 3, 4, 5, 6]) : '<div class="tiny dim">No continental cup for this part of the world.</div>'}`,
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
    const nations = Object.entries(D.NATIONS).sort((a, b) => a[1].name.localeCompare(b[1].name));
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
    return `<div class="h1" style="margin-top:2vh">${n.flag} ${esc(l.name)}</div><div class="tag">Tier ${l.tier} · ${clubsOf(l.id).length} clubs. Tap a club to change it.</div>
      <div class="ng-label">League name</div><div class="ng-names" style="margin-top:0"><input type="text" id="ed-lname" maxlength="48" value="${esc(l.name)}"><input type="text" id="ed-lshort" maxlength="6" style="max-width:90px" value="${esc(l.short || l.id)}"></div>
      ${leagueRules(l)}
      <div class="actions" style="margin-top:12px"><button class="btn sm pri" data-act="edSaveLeague">Save the league</button></div>
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
  const managerOf = (cid) => (ED.def.managers || []).find((m) => m.club === cid);
  const managerFields = (c) => {
    const m = managerOf(c.id) || {};
    const nations = Object.entries(D.NATIONS).sort((a, b) => a[1].name.localeCompare(b[1].name));
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
    for (const k of ['crest', 'finance', 'facilities']) c[k] = null;
    if (base && base.attr) c.attr = base.attr;
    else delete c.attr;
    ED.view = 'club';
    UI.worldEditor();
  };
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
      <div class="ng-label">Name</div><input type="text" id="ed-name" maxlength="40" value="${esc(c.name)}">
      <div class="ng-names"><div style="flex:1"><div class="ng-label" style="margin-top:0">Short name (up to 5)</div><input type="text" id="ed-short" maxlength="5" value="${esc(c.short || '')}"></div><div style="flex:1"><div class="ng-label" style="margin-top:0">Nickname</div><input type="text" id="ed-nick" maxlength="24" value="${esc(c.nick || '')}"></div></div>
      <div class="ng-label">City</div><input type="text" id="ed-city" maxlength="32" value="${esc(c.city || '')}">
      <div class="ng-label">Colours</div>
      <div class="row" style="gap:10px"><input type="color" id="ed-c1" value="${esc(c.colors[0])}" style="width:64px;height:44px;padding:2px"><input type="color" id="ed-c2" value="${esc(c.colors[1])}" style="width:64px;height:44px;padding:2px"><span class="tiny dim">home kit, and the second colour</span></div>
      <div class="ng-label">Identity</div><select id="ed-identity">${idOpts}</select>
      <div class="ng-label">Reputation <b id="ed-repv" style="color:#e6edf6">${c.rep}</b> <span class="tiny dim">(${stars(c.rep)} — decides the squad and the money)</span></div>
      <input type="range" id="ed-rep" min="20" max="99" step="1" value="${c.rep}" style="width:100%">
      <div class="ng-label">Ground</div><input type="text" id="ed-stadium" maxlength="40" value="${esc(c.stadium.name)}">
      <div class="ng-names"><div style="flex:1"><div class="ng-label" style="margin-top:0">Capacity</div><input type="number" id="ed-cap" min="1000" max="120000" step="500" inputmode="numeric" value="${c.stadium.cap}"></div><div style="flex:1"><div class="ng-label" style="margin-top:0">Founded</div><input type="number" id="ed-founded" min="1800" max="2030" inputmode="numeric" value="${c.founded || ''}"></div></div>
      ${sameNat.length > 1 ? `<div class="ng-label">League</div><select id="ed-league">${lgOpts}</select>` : ''}
      ${managerFields(c)}
      ${derbyFields(c)}
      <div class="card tap" style="margin:16px 0 0;padding:10px 12px" data-act="edView" data-v="clubx" data-cid="${esc(c.id)}"><div class="row" style="gap:10px"><div style="flex:none">${UI.C.crest(c, 28)}</div><div class="grow"><div class="small b">Crest, money, facilities and supporters</div><div class="tiny dim">${[c.crest ? 'own crest' : '', c.finance ? 'own money' : '', c.facilities ? 'own facilities' : '', c.attr ? 'own supporters' : ''].filter(Boolean).join(' · ') || 'As the game works them out'}</div></div><span class="dim">›</span></div></div>
      <div class="card tap" style="margin:10px 0 0;padding:10px 12px" data-act="edStaff" data-cid="${esc(c.id)}"><div class="row"><div class="grow"><div class="small b">Coaches and scouts</div><div class="tiny dim">${(ED.def.staff || []).filter((s) => s.club === c.id).length} come with this job</div></div><span class="dim">›</span></div></div>
      <div class="card tap" style="margin:10px 0 0;padding:10px 12px" data-act="edSquad" data-cid="${esc(c.id)}"><div class="row"><div class="grow"><div class="small b">Players</div><div class="tiny dim">${playersOf(c.id).length} made for this club</div></div><span class="dim">›</span></div></div>
      ${!added ? '<div class="actions" style="margin-top:14px"><button class="btn sm" data-act="edRevertClub">Put the game\'s version back</button></div>' : ''}
      <div class="actions" style="margin-top:14px"><button class="btn sm" data-act="edDelClub">${added ? 'Delete this club' : 'Take this club out of the world'}</button></div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="league" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edSaveClub">Save club</button></div>`;
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
  const domCups = () => [
    ...D.DOMESTIC_CUPS.map(([id, nat, name, short]) => ({ id, nat, name, short })),
    ...(ED.def.competitions || [])
      .filter((c) => c.isNew)
      .map((c) => ({ id: c.id, nat: c.nat, name: c.name, short: c.short, isNew: true })),
  ];
  const cupList = () => [
    ...domCups().map((c) => ({
      id: c.id,
      name: c.name,
      short: c.short,
      isNew: c.isNew,
      group: (D.NATIONS[c.nat] || {}).name || c.nat,
    })),
    ...D.CONTINENTALS.map((c) => ({ id: c.id, name: c.name, short: c.short, group: 'Continental' })),
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
    WD.editor(ED.def, null).removeCup(ED.cup);
    ED.view = 'cups';
    UI.worldEditor();
  };
  // A cup for a nation that has none (it needs eight clubs in fully or lightly simulated leagues)
  const cupNations = () => {
    const have = new Set(domCups().map((c) => c.nat));
    return Object.entries(D.NATIONS)
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
    const nats = cupNations();
    return `<div class="h1" style="margin-top:2vh">Add a cup</div><div class="tag">A knockout cup for a nation that has none. Every club in its fully or lightly simulated leagues enters.</div>
      ${errBox()}
      ${
        nats.length
          ? `<div class="ng-label">Nation</div><select id="ed-ncnat">${nats.map(([k, n, c]) => `<option value="${k}">${n.flag} ${esc(n.name)} · ${c} clubs</option>`).join('')}</select>
      <div class="ng-label">Name</div><input type="text" id="ed-ncname" maxlength="48" placeholder="e.g. National Cup">
      <div class="ng-label">Short name</div><input type="text" id="ed-ncshort" maxlength="6" placeholder="e.g. NC">`
          : '<div class="empty">Every nation with eight or more clubs in simulated leagues has a cup already.</div>'
      }
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="cups" aria-label="Back">←</button>${nats.length ? '<button class="btn sm pri grow" data-act="edCreateCup">Add the cup</button>' : ''}</div>`;
  };
  UI.acts.edCupReset = () => {
    ED.def.competitions = (ED.def.competitions || []).filter((x) => x.id !== ED.cup);
    ED.view = 'cups';
    UI.worldEditor();
  };
  // The names are saved as you type them (an empty name keeps the last one)
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
          return `${head}<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edCup" data-cup="${c.id}"><div class="row"><div class="grow"><div class="small b">${esc(o.name)}</div><div class="tiny dim">${esc(fmtLine(c.id))}</div></div><span class="dim">›</span></div></div>`;
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
        <div class="tiny dim" style="margin:10px 0 4px">Knockouts at one venue</div>${seg('edCupCentral', !!f.central, [
          [false, 'No'],
          [true, 'Yes'],
        ])}
        <div class="tiny dim" style="margin-top:8px;line-height:1.5">The group stage is the same everywhere. Two-legged ties need the world's two-legged knockouts rule (on the first screen); without it every tie is one match.</div>`;
    }
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
    return `<div class="h1" style="margin-top:2vh">${esc(o.name)}</div><div class="tag">${esc(c.group)}</div>
      ${errBox()}
      <div class="ng-names"><input type="text" id="ed-cupname" maxlength="48" value="${esc(o.name)}"><input type="text" id="ed-cupshort" maxlength="6" style="max-width:84px" value="${esc(o.short || c.short)}"></div>
      ${body}
      ${entry}
      ${prize}
      <div class="actions" style="margin-top:14px">${
        c.isNew
          ? '<button class="btn sm" data-act="edDelCup">Delete this cup</button>'
          : '<button class="btn sm" data-act="edCupReset">Put the game\'s name and format back</button>'
      }</div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="cups" aria-label="Back">←</button></div>`;
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
    const nations = Object.entries(D.NATIONS).sort((a, b) => a[1].name.localeCompare(b[1].name));
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
      };
    }
    const invites = FM.Intl.INVITES.map((o) => ({
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
      nations = Object.entries(D.NATIONS).sort((a, b) => a[1].name.localeCompare(b[1].name));
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
              return `<div class="tiny dim" style="margin:12px 0 4px">${kinds[kind]} · ${tn.size} nations</div><input type="text" id="ed-iname-${tn.id}" maxlength="48" value="${esc(v.name)}">${
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
      <div class="ng-label">Invitational tournaments <span class="tiny dim">· one a season, in turn: a host and three guests</span></div>
      ${cur.invites
        .map(
          (v) =>
            `<div class="ng-names" style="margin-top:6px"><input type="text" id="ed-iname-${v.id}" maxlength="40" value="${esc(v.name)}"><select id="ed-ihost-${v.id}" style="max-width:150px">${nations
              .map(
                ([k, n]) => `<option value="${k}" ${v.host === k ? 'selected' : ''}>${n.flag} ${esc(n.name)}</option>`,
              )
              .join('')}</select></div>`,
        )
        .join('')}
      <div class="actions" style="margin-top:12px"><button class="btn sm pri" data-act="edSaveIntl">Save the tournaments</button></div>
      <div class="card tap" style="margin:16px 0 0;padding:10px 12px" data-act="edView" data-v="nations"><div class="row"><div class="grow"><div class="small b">National teams</div><div class="tiny dim">${(ED.def.nations || []).length} changed · name, colours, ranking points, how they play</div></div><span class="dim">›</span></div></div>
      <div class="card tap" style="margin:6px 0 0;padding:10px 12px" data-act="edView" data-v="history"><div class="row"><div class="grow"><div class="small b">Past tournaments</div><div class="tiny dim">Who won each one is entered with the past seasons</div></div><span class="dim">›</span></div></div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="home" aria-label="Back">←</button></div>`;
  };

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
  UI.acts.edClearNation = () => {
    WD.editor(ED.def, null).clearNation(ED.code);
    ED.view = 'nations';
    UI.worldEditor();
  };
  const nationsView = () => {
    const by = {};
    for (const [code, n] of Object.entries(D.NATIONS)) (by[n.region] = by[n.region] || []).push([code, n]);
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
            .filter((k) => k.nat === nat)
            .map((k) => {
              const e = (s.cups || {})[k.id];
              return `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edSeasonCup" data-cup="${k.id}"><div class="row"><div class="grow"><div class="small b">${esc((compOf(k.id) || k).name)}</div><div class="tiny dim">${e ? `🏆 ${esc(nameOf(e.winner))}` : 'Not filled in'}</div></div><span class="dim">›</span></div></div>`;
            })
            .join('')}`;
        })
        .join('')}
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
    const nats = Object.entries(D.NATIONS).sort((a, b) => a[1].name.localeCompare(b[1].name));
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
            return `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edPlayer" data-pid="${esc(p.id)}"><div class="row"><div class="grow"><div class="small b">${esc(((p.fn || '') + ' ' + (p.ln || '')).trim())}</div><div class="tiny dim">${esc(D.POS_NAME[p.pos] || p.pos)} · ${year - p.born} · ability ${ca} · potential ${p.pa ?? ca}</div></div><span class="dim">›</span></div></div>`;
          })
          .join('') || `<div class="empty">No players made ${free ? 'as free agents' : 'for this club'} yet.</div>`
      }
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="${free ? 'home' : 'club'}" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edAddPlayer">＋ Add a player</button></div>`;
  };

  const playerView = () => {
    const p = ED.def.players.find((x) => x.id === ED.pid);
    if (!p) return squadView();
    const year = yearOf(),
      ca = abilityOf(p.attrs, p.pos),
      nations = Object.entries(D.NATIONS).sort((a, b) => a[1].name.localeCompare(b[1].name));
    const sl = (k) =>
      `<div class="row" style="gap:10px;align-items:center"><span class="small" style="width:96px;flex:none">${esc(D.ATTR_LABEL[k])}</span><input type="range" id="ed-a-${k}" min="1" max="20" step="1" value="${p.attrs[k]}" style="flex:1"><b id="ed-av-${k}" style="width:22px;text-align:right">${p.attrs[k]}</b></div>`;
    return `<div class="h1" style="margin-top:2vh">${esc(((p.fn || '') + ' ' + (p.ln || '')).trim() || 'New player')}</div><div class="tag">A player of your own. The game builds the rest of him (wage, personality, second positions) when the world starts.</div>
      ${errBox()}
      <div class="ng-names"><div style="flex:1"><div class="ng-label" style="margin-top:0">First name</div><input type="text" id="ed-fn" maxlength="24" value="${esc(p.fn || '')}"></div><div style="flex:1"><div class="ng-label" style="margin-top:0">Last name</div><input type="text" id="ed-ln" maxlength="28" value="${esc(p.ln || '')}"></div></div>
      <div class="ng-label">Nationality</div><select id="ed-nat">${nations.map(([k, n]) => `<option value="${k}" ${p.nat === k ? 'selected' : ''}>${n.flag} ${esc(n.name)}</option>`).join('')}</select>
      <div class="ng-names"><div style="flex:1"><div class="ng-label" style="margin-top:0">Position</div><select id="ed-pos">${D.POS.map((k) => `<option value="${k}" ${p.pos === k ? 'selected' : ''}>${esc(D.POS_NAME[k])}</option>`).join('')}</select></div><div style="flex:1"><div class="ng-label" style="margin-top:0">Foot</div><select id="ed-foot">${['Right', 'Left', 'Both'].map((k) => `<option ${p.foot === k ? 'selected' : ''}>${k}</option>`).join('')}</select></div></div>
      <div class="ng-names"><div style="flex:1"><div class="ng-label" style="margin-top:0">Age at the start</div><input type="number" id="ed-age" min="15" max="45" inputmode="numeric" value="${year - p.born}"></div><div style="flex:1"><div class="ng-label" style="margin-top:0">Contract ends</div><input type="number" id="ed-contract" min="${year}" max="${year + 8}" inputmode="numeric" value="${p.contract || ''}"></div></div>
      <div class="ng-label">Attributes <span class="tiny dim">· ability <b id="ed-cav" style="color:#e6edf6">${ca}</b></span></div>
      <div style="display:grid;gap:6px">${D.ATTRS.map(sl).join('')}</div>
      <div class="ng-label">Or set them from an ability</div>
      <div class="row" style="gap:10px;align-items:center"><input type="range" id="ed-ca" min="20" max="95" step="1" value="${ca}" style="flex:1"><b id="ed-cas" style="width:28px;text-align:right">${ca}</b><button class="btn sm" data-act="edSuggest">Fill in</button></div>
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
      clubx: clubxView,
      squad: squadView,
      player: playerView,
      cups: cupsView,
      cup: cupView,
      newcup: newCupView,
      staff: staffView,
      staffhub: staffHubView,
      managers: managersView,
      agents: agentsView,
      staffer: stafferView,
      nations: nationsView,
      nation: nationView,
      history: historyView,
      season: seasonView,
      seasoncup: seasonCupView,
      seasonintl: seasonIntlView,
      intl: intlView,
      seasonleague: seasonLeagueView,
      newleague: newLeagueView,
    };
    const body = (views[ED.view] || homeView)();
    app.innerHTML = `<div class="title">${body}</div>`;
    window.scrollTo(0, 0);
    // fields that update the definition as you type
    const bind = (id, fn) => {
      const el = $('#' + id);
      if (el) el.addEventListener('input', () => fn(el.value));
    };
    bind('ed-wname', (v) => (ED.def.meta.name = v));
    bind('ed-wauthor', (v) => (ED.def.meta.author = v));
    bind('ed-wdesc', (v) => (ED.def.meta.description = v));
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
    if (ED.view === 'clubx') {
      for (const id of ['xcs', 'xcp', 'xce']) bind('ed-' + id, () => ($('#ed-crestprev').innerHTML = draftCrest()));
      for (const k of WD.FACILITIES) bind('ed-xf-' + k, (v) => ($('#ed-xf-' + k + 'v').textContent = v));
      for (const k of ['market', 'support', 'catchment'])
        bind('ed-xa-' + k, (v) => ($('#ed-xa-' + k + 'v').textContent = v));
    }
    bind('ed-sjudge', (v) => ($('#ed-sjudgev').textContent = v));
    for (const r of Object.keys(D.REGIONS)) bind('ed-sreg-' + r, (v) => ($('#ed-sregv-' + r).textContent = v + '%'));
    bind('ed-ncoef', (v) => ($('#ed-ncoefv').textContent = v));
    bind('ed-cupprize', () => saveCupPrize());
    bind('ed-cupname', () => saveCupNames());
    bind('ed-cupshort', () => saveCupNames());
    if (ED.view === 'player') {
      for (const k of D.ATTRS)
        bind('ed-a-' + k, (v) => {
          $('#ed-av-' + k).textContent = v;
          showAbility();
        });
      bind('ed-pos', () => showAbility());
      bind('ed-ca', (v) => ($('#ed-cas').textContent = v));
      bind('ed-pa', (v) => ($('#ed-pav').textContent = v));
    }
  };
  // (the tap targets carry their league and club in data attributes: the act handler reads them as strings)
})();
