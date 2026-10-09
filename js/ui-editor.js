// The world editor: change the clubs and leagues the game starts from, before a career begins. It works on a world
// definition (FM.WorldDef, js/worlddef.js): the built-in world, or the database you loaded, is copied into the editor,
// edited through the same validated calls the importers use, and handed back to the new-career screen as the database the
// world is made from (or saved as a file to share). Opened from the Database card on the new-career screen.
//
// This first version edits what a club and a league are: names, colours, grounds, ratings, identities, which league a club
// plays in, and adds new clubs. Players, staff and competitions come next (the definition already carries them).
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
  UI.acts.edDelClub = () => {
    const i = ED.def.clubs.findIndex((c) => c.id === ED.cid);
    if (i < 0 || !isNew(ED.cid)) return;
    ED.def.clubs.splice(i, 1);
    ED.def.players = (ED.def.players || []).filter((p) => p.club !== ED.cid);
    ED.view = 'league';
    ED.err = [];
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
    ED.lid = lg;
    ED.view = 'league';
    ED.err = [];
    UI.toast('Club saved', 1500);
    UI.worldEditor();
  };

  // ---------- Leagues ----------
  UI.acts.edSaveLeague = () => {
    const r = WD.editor(ED.def, null).setLeague(ED.lid, {
      name: ($('#ed-lname') || {}).value.trim(),
      short: (($('#ed-lshort') || {}).value || '').trim().toUpperCase() || ED.lid,
    });
    ED.err = r.ok ? [] : r.errors;
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
      <div class="small" style="margin-top:14px;color:${bad ? '#f87171' : '#c8ff3d'}">${bad ? `⚠️ ${bad} problem${bad > 1 ? 's' : ''} to fix` : '✅ Ready to use'} <span style="color:#9fb0c5">· ${s.changed} club${s.changed === 1 ? '' : 's'} changed${s.added ? `, ${s.added} added` : ''}${s.leaguesChanged ? ` · ${s.leaguesChanged} league${s.leaguesChanged === 1 ? '' : 's'} changed` : ''}</span></div>
      ${
        bad
          ? `<div class="tiny" style="color:#9fb0c5;margin-top:6px;line-height:1.5">${s.chk.errors
              .slice(0, 5)
              .map((e) => `• ${esc(e)}`)
              .join('<br>')}</div>`
          : ''
      }
      ${errBox()}
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
      <div class="actions" style="margin-top:16px"><button class="btn sm" data-act="edReset">Start again from the built-in world</button></div>
      <div class="actions ng-foot"><button class="btn sm" data-act="edClose" aria-label="Back">←</button><button class="btn sm" data-act="edExport">⬆️ Save as file</button><button class="btn sm pri grow" data-act="edUse">Use this world</button></div>`;
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
      <div class="actions" style="margin-top:8px"><button class="btn sm" data-act="edSaveLeague">Save league name</button></div>
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
      <div class="card tap" style="margin:16px 0 0;padding:10px 12px" data-act="edSquad" data-cid="${esc(c.id)}"><div class="row"><div class="grow"><div class="small b">Players</div><div class="tiny dim">${playersOf(c.id).length} made for this club</div></div><span class="dim">›</span></div></div>
      ${!added ? '<div class="actions" style="margin-top:14px"><button class="btn sm" data-act="edRevertClub">Put the game\'s version back</button></div>' : ''}
      ${added ? '<div class="actions" style="margin-top:14px"><button class="btn sm" data-act="edDelClub">Delete this club</button></div>' : ''}
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="league" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edSaveClub">Save club</button></div>`;
  };

  // ---------- Players ----------
  // A club's players in the definition (the ones you made: the game's own are generated when the world is built). Each added
  // player takes the place of the weakest in his position group once the squad is full; a club given 11 or more players
  // loses its generated squad when the world "replaces" squads (the choice on the first screen).
  const playersOf = (cid) => ED.def.players.filter((p) => p.club === cid);
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
    const c = ED.def.clubs.find((x) => x.id === ED.cid),
      year = yearOf(),
      pos = 'CM',
      ca = Math.max(25, Math.min(85, Math.round(c.rep * 0.8)));
    const r = WD.editor(ED.def, null).addPlayer({
      fn: 'New',
      ln: 'Player',
      nat: c.nat || 'ENG',
      pos,
      born: year - 24,
      foot: 'Right',
      attrs: suggest(pos, ca),
      pa: ca + 4,
      club: c.id,
      contract: year + 3,
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
  UI.acts.edSquadMode = (d) => {
    ED.def.meta.players = d.v;
    UI.worldEditor();
  };

  const squadView = () => {
    const c = ED.def.clubs.find((x) => x.id === ED.cid),
      list = playersOf(c.id).sort((a, b) => abilityOf(b.attrs, b.pos) - abilityOf(a.attrs, a.pos)),
      year = yearOf(),
      replace = ED.def.meta.players === 'replace';
    return `<div class="h1" style="margin-top:2vh">${crestDot(c)} ${esc(c.name)}: players</div><div class="tag">The players you make for this club. ${replace ? 'A club with 11 or more of them gets exactly this squad (any gaps are made up).' : 'Each one takes the place of the weakest player in his position once the squad is full.'}</div>
      ${errBox()}
      ${
        list
          .map((p) => {
            const ca = abilityOf(p.attrs, p.pos);
            return `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="edPlayer" data-pid="${esc(p.id)}"><div class="row"><div class="grow"><div class="small b">${esc(((p.fn || '') + ' ' + (p.ln || '')).trim())}</div><div class="tiny dim">${esc(D.POS_NAME[p.pos] || p.pos)} · ${year - p.born} · ability ${ca} · potential ${p.pa ?? ca}</div></div><span class="dim">›</span></div></div>`;
          })
          .join('') || '<div class="empty">No players made for this club yet.</div>'
      }
      <div class="actions ng-foot"><button class="btn sm" data-act="edView" data-v="club" aria-label="Back">←</button><button class="btn sm pri grow" data-act="edAddPlayer">＋ Add a player</button></div>`;
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
    const body =
      ED.view === 'league'
        ? leagueView()
        : ED.view === 'club'
          ? clubView()
          : ED.view === 'squad'
            ? squadView()
            : ED.view === 'player'
              ? playerView()
              : homeView();
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
