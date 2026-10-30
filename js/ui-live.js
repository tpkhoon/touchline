// Editing the world you are playing (Settings → Edit the world): fix a name or a rating in a career in progress, one player or club
// at a time, or change many at once (Bulk edit: players, clubs, prize money, youth ratings), with an Undo for the last bulk edit and a
// switch to turn it all off. It takes effect at once and nothing marks the save. (The world editor for a world before a career
// begins is in ui-editor.js.)
(function () {
  const FM = window.FM,
    D = FM.D,
    U = FM.U,
    UI = FM.UI;
  const esc = U.esc;
  const $ = (s) => document.querySelector(s);

  // ---------- Editing the world you are playing ----------
  // A name, a rating, a colour changed in a career in progress: it takes effect at once and is saved, and nothing marks the save
  // as edited. The player and club sheets carry an Edit button, and Settings has a search for both.
  const live = () => FM.S && FM.S.user && FM.S.players && !(FM.S.settings && FM.S.settings.noLiveEdit);
  const persist = () => {
    if (FM.SimRunner) FM.SimRunner.packed = null; // (a save packed before the edit would bring the old numbers back)
    UI.save();
  };
  const busy = () => {
    if (!UI.simBusy) return false;
    UI.toast('Wait for the matchday to finish first', 2500);
    return true;
  };
  // ---------- Changes made, with undo ----------
  // Every edit keeps what it replaced (the player, club or competition as it was) in S.editLog, newest first, so the Changes list can put
  // it back. A bulk edit that touched thousands of players keeps its copy for this session only (it would bloat the save).
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const logEdit = (type, label, ref, snap, big) => {
    const S = FM.S;
    const e = { id: Date.now() + '-' + Math.floor(Math.random() * 1e6), type, label, ref, y: S.year };
    if (big) (UI._editSnaps = UI._editSnaps || {})[e.id] = snap;
    else e.snap = snap;
    S.editLog = [e, ...(S.editLog || [])].slice(0, 60);
    return e;
  };
  // (puts an object back as it was, in place: other things hold the same object)
  const restore = (obj, snap) => {
    for (const k of Object.keys(obj)) if (!(k in snap)) delete obj[k];
    Object.assign(obj, clone(snap));
  };
  // ---------- One player form for both editors ----------
  // The world editor (before a career) and the in-game editor open the same form: names, nations, position and second positions,
  // foot, age, contract, wage, number, traits, and the attributes that matter for his position (a keeper's reflexes and handling are
  // not shown on a striker), each a whole number with - and + buttons, with his ability, stars and value updating as you change them.
  // The editors pass in what they have (PF.html) and read back what was set (PF.read); what differs is in the options.
  const PF = (UI.PlayerForm = { st: null, after: null });
  const W = () => FM.W;
  const num1 = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(+v || 0)));
  const v$ = (id) => ($('#' + id) || {}).value;
  PF.attrsFor = (pos) =>
    D.ATTRS.filter((k) =>
      pos === 'GK' ? !(D.GK_OUTFIELD && k in D.GK_OUTFIELD) : !['reflexes', 'handling'].includes(k),
    );
  PF.near = (pos) => Object.entries((D.FIT && D.FIT[pos]) || {}).filter(([t, f]) => t !== pos && f >= 0.7);
  PF.ability = () => W().calcCA({ attrs: PF.st.attrs }, PF.st.pos);
  const stepper = (id, label, v, k) =>
    `<div class="row" style="gap:6px;align-items:center;min-height:44px"><span class="small grow">${label}</span><button class="btn sm" style="min-width:44px;min-height:44px" data-act="pfStep" data-k="${k}" data-d="-1" aria-label="Lower ${esc(label)}">−</button><b id="${id}" style="min-width:28px;text-align:center">${v}</b><button class="btn sm" style="min-width:44px;min-height:44px" data-act="pfStep" data-k="${k}" data-d="1" aria-label="Raise ${esc(label)}">+</button></div>`;
  const attrBlock = () => {
    const st = PF.st,
      show = PF.attrsFor(st.pos);
    return Object.entries(st.pos === 'GK' ? D.ATTR_GROUPS_GK : D.ATTR_GROUPS)
      .map(([g, ks]) => [g, ks.filter((k) => show.includes(k))])
      .filter(([, ks]) => ks.length)
      .map(
        ([g, ks]) =>
          `<div class="tiny dim" style="margin-top:8px">${esc(g)}</div>${ks.map((k) => stepper('pf-av-' + k, esc((D.ATTR_LABEL || {})[k] || k), st.attrs[k], k)).join('')}`,
      )
      .join('');
  };
  const toggles = (items, on, act) =>
    `<div class="row" style="gap:6px;flex-wrap:wrap">${items
      .map(
        ([t, label]) =>
          `<button class="btn sm ${on(t) ? 'pri' : ''}" style="min-height:44px" data-act="${act}" data-t="${esc(t)}" aria-pressed="${on(t)}">${esc(label)}</button>`,
      )
      .join('')}</div>`;
  const altBlock = () => {
    const st = PF.st,
      near = PF.near(st.pos);
    return near.length
      ? toggles(
          near.map(([t]) => [t, D.POS_NAME[t] || t]),
          (t) => st.alt[t] != null,
          'pfAlt',
        )
      : '<div class="tiny dim">None: a keeper has no second position.</div>';
  };
  const traitBlock = () =>
    toggles(
      Object.keys(D.TRAITS || {}).map((t) => [t, t]),
      (t) => PF.st.traits.includes(t),
      'pfTrait',
    );
  const sel = (id, opts, cur, attr = '') =>
    `<select id="${id}" ${attr}>${opts.map(([v, t]) => `<option value="${esc(v)}" ${v === cur ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>`;
  const lab = (t) => `<div class="ng-label" style="margin-top:8px">${t}</div>`;
  const nrow = (...cells) =>
    `<div class="row" style="gap:8px">${cells.map((c) => `<div style="flex:1;min-width:0">${c}</div>`).join('')}</div>`;
  const nin = (id, t, v, min, max, extra = '') =>
    `${lab(t)}<input type="number" id="${id}" min="${min}" max="${max}" inputmode="numeric" value="${v ?? ''}" data-input="pfChange" ${extra}>`;
  // m: { fn, ln, nat, nat2, heritage, pos, alt, foot, age, contract, wage, no, pa, attrs, traits, morale, club, injured }
  // o: { mode: 'pre' | 'live', year, nations: [[code, name]], paMax, base, extra }
  PF.html = (m, o) => {
    // (what each attribute was, so only those you changed are written back: showing 7.8 as 8 must not move his ability)
    const shown = Object.fromEntries(D.ATTRS.map((k) => [k, num1(m.attrs[k], 1, 20)]));
    PF.st = {
      orig: { ...shown },
      mode: o.mode,
      pos: m.pos,
      paMax: o.paMax || 96,
      base: o.base || null,
      attrs: Object.fromEntries(D.ATTRS.map((k) => [k, num1(m.attrs[k], 1, 20)])),
      alt: { ...(m.alt || {}) },
      traits: [...(m.traits || [])],
      pa: num1(m.pa, 20, o.paMax || 96),
    };
    const live = o.mode === 'live';
    const her = Object.entries(D.HERITAGE_LABEL || {});
    const posOpts = D.POS.map((k) => [k, D.POS_NAME[k]]);
    return `<div id="pf-warn"></div>
      ${nrow(`${lab('First name')}<input type="text" id="pf-fn" maxlength="24" value="${esc(m.fn || '')}" data-input="pfChange">`, `${lab('Last name')}<input type="text" id="pf-ln" maxlength="32" value="${esc(m.ln || '')}" data-input="pfChange">`)}
      ${nrow(`${lab('Nationality')}${sel('pf-nat', o.nations, m.nat)}`, `${lab('Second nationality')}${sel('pf-nat2', [['', 'None'], ...o.nations], m.nat2 || '')}`)}
      ${lab('Family heritage <span class="tiny dim">· the background his name and second nationality come from</span>')}${sel('pf-her', [['', 'None'], ...her], m.heritage || '')}
      ${nrow(
        `${lab('Position')}${sel('pf-pos', posOpts, m.pos, 'data-input="pfChange"')}`,
        `${lab('Foot')}${sel(
          'pf-foot',
          ['Right', 'Left', 'Both'].map((k) => [k, k]),
          m.foot || 'Right',
        )}`,
      )}
      ${lab('Second positions <span class="tiny dim">· where he can also play</span>')}<div id="pf-alt">${altBlock()}</div>
      ${nrow(nin('pf-age', 'Age', m.age, 15, 45), nin('pf-contract', 'Contract ends', m.contract, o.year, o.year + 8), nin('pf-no', 'Squad number', m.no, 1, 99))}
      ${nrow(nin('pf-wage', 'Wage a week <span class="tiny dim">· 0: the game sets it</span>', m.wage, 0, 1000000, 'step="50"'), live ? nin('pf-morale', 'Morale', m.morale, 0, 100) : '<div></div>')}
      ${live ? `${lab('Club <span class="tiny dim">· type a club\'s name, or Free agent</span>')}<input type="text" id="pf-club" list="le-clubs" value="${esc(m.club || 'Free agent')}" autocomplete="off">${m.injured ? `<label class="row" style="gap:10px;margin-top:10px;min-height:44px"><input type="checkbox" id="pf-heal" style="width:24px;height:24px;flex:none"> <span class="small">Heal his injury (${esc(m.injured)})</span></label>` : ''}` : ''}
      ${lab('Traits')}<div id="pf-traits">${traitBlock()}</div>
      <div class="ng-label">Attributes <span class="tiny dim">· 1 to 20; only those that matter for his position</span></div>
      <div id="pf-sum" class="card flat" style="margin:6px 0;padding:10px 12px"></div>
      <div id="pf-attrs">${attrBlock()}</div>
      ${live ? '' : `${lab('Or set them from an ability')}<div class="row" style="gap:10px;align-items:center"><input type="range" id="pf-ca" min="20" max="95" step="1" value="${PF.ability()}" style="flex:1" data-input="pfChange"><b id="pf-cas" style="min-width:28px;text-align:right">${PF.ability()}</b><button class="btn sm" style="min-height:44px" data-act="pfFill">Fill in</button></div>`}
      ${stepper('pf-pav', 'Potential <span class="tiny dim">· never below his ability</span>', PF.st.pa, 'pa')}
      ${o.extra || ''}`;
  };
  // His ability, stars and (in a career) value, for the numbers on screen
  PF.refresh = () => {
    const st = PF.st;
    if (!st || !$('#pf-sum')) return;
    const ca = PF.ability();
    if (st.pa < ca) st.pa = ca;
    const pav = $('#pf-pav');
    if (pav) pav.textContent = st.pa;
    let stars = '',
      value = '';
    try {
      stars = ` · ${W().stars(ca, st.pos).toFixed(1)} stars`;
    } catch (e) {}
    if (st.mode === 'live' && st.base) {
      try {
        const q = { ...st.base, attrs: { ...st.attrs }, pos: st.pos, pa: st.pa };
        q.ca = W().calcCA(q);
        q.born = FM.S.year - num1(v$('pf-age'), 15, 45);
        q.contract = num1(v$('pf-contract'), FM.S.year, FM.S.year + 8);
        value = ` · worth ${U.money ? U.money(W().value(q)) : Math.round(W().value(q)).toLocaleString('en')}`;
      } catch (e) {}
    }
    $('#pf-sum').innerHTML = `<div class="small">Ability <b>${ca}</b>${stars}${value}</div>`;
  };
  PF.read = () => {
    const st = PF.st,
      alt = Object.fromEntries(Object.entries(st.alt).filter(([t]) => t !== st.pos)); // (one he already had stays, even if the list does not offer it)
    return {
      fn: (v$('pf-fn') || '').trim(),
      ln: (v$('pf-ln') || '').trim(),
      nat: v$('pf-nat'),
      nat2: v$('pf-nat2') || undefined,
      heritage: v$('pf-her') || undefined,
      pos: st.pos,
      foot: v$('pf-foot') || 'Right',
      age: num1(v$('pf-age'), 15, 45),
      contract: Math.round(+v$('pf-contract')) || null,
      no: Math.round(+v$('pf-no')) > 0 ? num1(v$('pf-no'), 1, 99) : undefined,
      wage: Math.max(0, Math.round(+v$('pf-wage') || 0)) || undefined,
      morale: $('#pf-morale') ? num1(v$('pf-morale'), 0, 100) : undefined,
      club: v$('pf-club'),
      heal: !!($('#pf-heal') || {}).checked,
      pa: st.pa,
      attrs: Object.fromEntries(Object.entries(st.attrs).filter(([k, v]) => v !== st.orig[k])),
      alt: Object.keys(alt).length ? alt : undefined,
      traits: [...st.traits],
    };
  };
  const changed = () => {
    PF.refresh();
    if (PF.after) PF.after();
  };
  UI.acts.pfStep = (d) => {
    const st = PF.st;
    if (!st) return;
    const dd = +d.d;
    if (d.k === 'pa') st.pa = num1(st.pa + dd, Math.max(20, PF.ability()), st.paMax);
    else {
      st.attrs[d.k] = num1(st.attrs[d.k] + dd, 1, 20);
      const b = $('#pf-av-' + d.k);
      if (b) b.textContent = st.attrs[d.k];
    }
    changed();
  };
  UI.acts.pfAlt = (d) => {
    const st = PF.st;
    if (st.alt[d.t] != null) delete st.alt[d.t];
    else st.alt[d.t] = Math.round(Math.min(0.96, ((D.FIT[st.pos] || {})[d.t] || 0.7) + 0.08) * 100) / 100;
    $('#pf-alt').innerHTML = altBlock();
    changed();
  };
  UI.acts.pfTrait = (d) => {
    const st = PF.st,
      i = st.traits.indexOf(d.t);
    if (i >= 0) st.traits.splice(i, 1);
    else st.traits.push(d.t);
    $('#pf-traits').innerHTML = traitBlock();
    changed();
  };
  UI.acts.pfFill = () => {
    const st = PF.st,
      a = FM.WorldDef.suggestAttrs(st.pos, num1(v$('pf-ca'), 20, 95));
    for (const k of D.ATTRS) st.attrs[k] = num1(a[k], 1, 20);
    $('#pf-attrs').innerHTML = attrBlock();
    changed();
  };
  // any field: a new position changes the attributes shown and the second positions on offer
  UI.acts.pfChange = (d, el) => {
    const st = PF.st;
    if (!st || !el) return;
    if (el.id === 'pf-pos') {
      st.pos = el.value;
      delete st.alt[st.pos];
      $('#pf-attrs').innerHTML = attrBlock();
      $('#pf-alt').innerHTML = altBlock();
    } else if (el.id === 'pf-ca') {
      const c = $('#pf-cas');
      if (c) c.textContent = el.value;
    }
    changed();
  };

  const num = (id, lo, hi) => Math.max(lo, Math.min(hi, Math.round(+($('#' + id) || {}).value || 0)));
  UI.acts.liveEdit = () => {
    if (!live() || busy()) return;
    const sh = UI.sheet(
      `<div class="tiny dim" style="line-height:1.5">Fix a name or a rating in the world you are playing. A change takes effect at once and nothing marks the save.</div>
      <button class="btn sm block" style="margin-top:10px" data-act="liveBulk">Bulk edit: many players, clubs or prizes at once</button>
      <button class="btn sm block" style="margin-top:8px" data-act="edOpenLive">Full world editor: leagues, cups, rules, nations, staff and more</button>
      <div class="row" style="gap:8px;margin-top:8px"><button class="btn sm grow" data-act="liveNewPlayer">Add a player</button><button class="btn sm grow" data-act="liveRules">World rules</button></div>
      <button class="btn sm block" style="margin-top:8px" data-act="liveCommish">Commissioner: force a transfer or a loan, correct a result</button>
      <button class="btn sm block" style="margin-top:8px" data-act="liveChanges">Changes made${(FM.S.editLog || []).length ? ' (' + FM.S.editLog.length + ')' : ''}, with undo</button>
      <div class="ng-find" style="margin-top:10px"><input type="search" id="le-q" placeholder="A player, club or competition" autocomplete="off"></div>
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
      const comps = Object.values(FM.S.comps)
        .filter((c) => c.name && c.name.toLowerCase().includes(t))
        .slice(0, 6);
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
          comps
            .map(
              (c) =>
                `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="liveEditComp" data-id="${esc(c.id)}"><div class="small b">${esc(c.name)}</div><div class="tiny dim">${c.type === 'league' ? 'League' : 'Cup'}</div></div>`,
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
  // (the value is escaped by the caller)
  const fld = (id, label, value, extra = '') =>
    `<div style="flex:1;min-width:0"><div class="ng-label" style="margin-top:8px">${label}</div><input type="text" id="${id}" value="${value ?? ''}" ${extra}></div>`;
  const natOptions = (cur) =>
    D.nationCodes()
      .slice()
      .sort((a, b) => D.NATIONS[a].name.localeCompare(D.NATIONS[b].name))
      .map((k) => `<option value="${k}" ${k === cur ? 'selected' : ''}>${esc(D.NATIONS[k].name)}</option>`)
      .join('');
  const posOptions = (cur) =>
    Object.keys(D.POS_NAME)
      .map((k) => `<option value="${k}" ${k === cur ? 'selected' : ''}>${esc(D.POS_NAME[k])}</option>`)
      .join('');
  const clubList = () =>
    `<datalist id="le-clubs"><option value="Free agent">${Object.values(FM.S.clubs)
      .filter((c) => c.comp)
      .map((c) => `<option value="${esc(c.name)}">`)
      .join('')}</datalist>`;
  const clubByName = (n) =>
    Object.values(FM.S.clubs).find((c) => c.comp && c.name.toLowerCase() === n.trim().toLowerCase());
  // Moves a player to a club (null: a free agent), closing his spell and clearing him out of the user's line-up
  const movePlayer = (p, to) => {
    const S = FM.S;
    if ((p.clubId || null) === (to ? to.id : null)) return;
    const sp = FM.W.spell(p);
    if (sp) sp.to = S.year;
    if (S.user.tactic && S.user.tactic.lineup)
      S.user.tactic.lineup = S.user.tactic.lineup.map((x) => (x === p.id ? null : x));
    p.loan = undefined;
    p.listed = false;
    if (to) FM.W.startSpell(p, to.id);
    else {
      p.clubId = null;
      p.team = undefined;
      p.freeSince = FM.Season.dayIndex();
    }
  };
  UI.acts.liveEditPlayer = (d) => {
    const p = FM.S.players[d.id];
    if (!p || busy()) return;
    UI.closeSheet();
    const nations = D.nationCodes()
      .slice()
      .sort((x, y) => D.NATIONS[x].name.localeCompare(D.NATIONS[y].name))
      .map((k) => [k, D.NATIONS[k].name]);
    const inj = p.inj ? p.inj.type || p.inj.name || 'injured' : '';
    const sh = UI.sheet(
      `${PF.html(
        {
          fn: p.fn,
          ln: p.ln,
          nat: p.nat,
          nat2: p.nat2,
          heritage: p.heritage,
          pos: p.pos,
          alt: p.alt,
          foot: p.foot,
          age: FM.W.age(p),
          contract: p.contract || FM.S.year,
          wage: Math.round(p.wage),
          no: p.no,
          pa: p.pa,
          attrs: p.attrs,
          traits: p.traits,
          morale: Math.round(p.morale ?? 70),
          club: p.clubId && FM.S.clubs[p.clubId] ? FM.S.clubs[p.clubId].name : 'Free agent',
          injured: inj,
        },
        { mode: 'live', year: FM.S.year, nations, paMax: 99, base: p },
      )}${clubList()}
      <div class="actions" style="margin-top:14px"><button class="btn pri block" data-act="liveSavePlayer" data-id="${esc(p.id)}">Done</button></div>`,
      { title: FM.W.name(p), full: true },
    );
    PF.after = null;
    PF.refresh();
    return sh;
  };
  UI.acts.liveSavePlayer = (d) => {
    const p = FM.S.players[d.id];
    if (!p || busy()) return;
    const f = PF.read();
    if (!f.ln) return UI.toast('He needs a surname', 2500);
    if (D.isRude && (D.isRude(f.fn) || D.isRude(f.ln)))
      return UI.toast('That name contains a word the game will not use', 3000);
    // (the club is checked before anything changes, so a mistyped name leaves him as he was)
    const cn = (f.club || '').trim(),
      to = cn && !/^free agent$/i.test(cn) ? clubByName(cn) : null;
    if (cn && !to && !/^free agent$/i.test(cn)) return UI.toast('No club by that name', 2500);
    const was = p.clubId && FM.S.clubs[p.clubId];
    if (cn && (to ? to.id : null) !== (p.clubId || null) && !d.sure)
      return sure(
        `Move ${FM.W.name(p)} to ${to ? to.name : 'the free agents'}?`,
        `${was ? esc(was.name) + ' lose' : 'He leaves the free agents and'} him at once and his contract stays as written. ${to && to.id === FM.S.user.clubId ? '' : 'The squad and line-up of the club he leaves are not re-picked until its next match.'}`,
        'liveSavePlayer',
        d.id,
      );
    const before = clone(p);
    p.fn = f.fn;
    p.ln = f.ln;
    p.foot = f.foot;
    p.nat = f.nat || p.nat;
    p.nat2 = f.nat2;
    p.heritage = f.heritage;
    if (FM.W.resetNationality) FM.W.resetNationality(p); // (birthplace, origins and passports from the new nations)
    p.pos = f.pos;
    p.born = FM.S.year - f.age;
    p.attrs = { ...p.attrs, ...f.attrs };
    p.contract = f.contract ? Math.max(FM.S.year, Math.min(FM.S.year + 8, f.contract)) : p.contract;
    p.traits = f.traits;
    if (f.alt) p.alt = f.alt;
    else delete p.alt;
    if (f.no) p.no = f.no;
    if (f.morale != null) p.morale = f.morale;
    if (f.heal) p.inj = null;
    if (cn) movePlayer(p, to);
    FM.W.refresh(p); // (his ability, and his value, follow from the attributes)
    if (f.wage) p.wage = f.wage;
    p.pa = Math.max(p.ca, f.pa);
    logEdit('player', `Edited ${FM.W.name(before)}`, p.id, before);
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
      `${fld('le-name', 'Name', esc(c.name), 'maxlength="40"')}
      <div class="row" style="gap:8px">${fld('le-short', 'Short name (up to 5)', esc(c.short), 'maxlength="5"')}${fld('le-nick', 'Nickname', esc(c.nick || ''), 'maxlength="24"')}</div>
      ${fld('le-city', 'City', esc(c.city || ''), 'maxlength="32"')}
      <div class="ng-label">Colours</div>
      <div class="row" style="gap:10px"><input type="color" id="le-c1" value="${esc(c.colors[0])}" style="width:64px;height:44px;padding:2px"><input type="color" id="le-c2" value="${esc(c.colors[1])}" style="width:64px;height:44px;padding:2px"></div>
      ${fld('le-ground', 'Ground', esc(c.stadium.name), 'maxlength="40"')}
      <div class="row" style="gap:8px"><div style="flex:1"><div class="ng-label" style="margin-top:8px">Capacity</div><input type="number" id="le-cap" min="1000" max="120000" step="500" inputmode="numeric" value="${esc(c.stadium.cap)}"></div><div style="flex:1"><div class="ng-label" style="margin-top:8px">Reputation</div><input type="number" id="le-rep" min="20" max="99" inputmode="numeric" value="${c.rep}"></div></div>
      <div class="row" style="gap:8px"><div style="flex:1"><div class="ng-label" style="margin-top:8px">Transfer budget</div><input type="number" id="le-bud" inputmode="numeric" value="${Math.round(c.budget)}"></div><div style="flex:1"><div class="ng-label" style="margin-top:8px">Bank balance</div><input type="number" id="le-bal" inputmode="numeric" value="${Math.round(c.balance)}"></div></div>
      <div class="ng-label">Facilities <span class="tiny dim">· level 1 to 5</span></div>
      <div class="row" style="gap:8px;flex-wrap:wrap">${Object.keys(c.facilities || {})
        .map(
          (k) =>
            `<div style="flex:1 1 30%;min-width:96px"><div class="tiny dim">${esc(k[0].toUpperCase() + k.slice(1))}</div><input type="number" id="le-f-${k}" min="1" max="5" inputmode="numeric" value="${c.facilities[k]}"></div>`,
        )
        .join('')}</div>
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
    const rep = num('le-rep', 20, 99);
    if (Math.abs(rep - c.rep) >= 8 && !d.sure)
      return sure(
        `Change ${c.name}'s reputation from ${c.rep} to ${rep}?`,
        'Reputation sets what the club earns, what it can spend and which players want to join it, so a big change moves its budget and its signings from now on.',
        'liveSaveClub',
        d.id,
      );
    const before = clone(c);
    c.name = name;
    c.short = short || c.short;
    c.nick = v('le-nick');
    c.city = v('le-city');
    c.colors = [v('le-c1') || c.colors[0], v('le-c2') || c.colors[1]];
    c.stadium.name = v('le-ground') || c.stadium.name;
    c.stadium.cap = c.stadium.cap0 = num('le-cap', 1000, 120000);
    c.rep = rep;
    c.budget = Math.max(0, Math.round(+($('#le-bud') || {}).value || 0));
    c.balance = Math.round(+($('#le-bal') || {}).value || 0);
    for (const k of Object.keys(c.facilities || {})) c.facilities[k] = num('le-f-' + k, 1, 5);
    logEdit('club', `Edited ${before.name}`, c.id, before);
    persist();
    UI.closeSheet();
    UI.render();
    UI.toast('Saved', 1500);
  };
  // A competition: its name, prize fund and (a league) points for a win
  UI.acts.liveEditComp = (d) => {
    const c = FM.S.comps[d.id];
    if (!c || busy()) return;
    UI.closeSheet();
    const league = c.type === 'league',
      prize = league ? c.rules && c.rules.prize : c.prize;
    UI.sheet(
      `${fld('le-cname', 'Name', esc(c.name), 'maxlength="48"')}
      <div class="row" style="gap:8px">${prize > 0 ? `<div style="flex:1"><div class="ng-label" style="margin-top:8px">Prize fund</div><input type="number" id="le-cprize" min="0" inputmode="numeric" value="${Math.round(prize)}"></div>` : ''}${league ? `<div style="flex:1"><div class="ng-label" style="margin-top:8px">Points for a win</div><input type="number" id="le-cwin" min="2" max="4" inputmode="numeric" value="${(c.rules && c.rules.win) || FM.S.rules.win}"></div>` : ''}</div>
      <div class="actions" style="margin-top:14px"><button class="btn pri block" data-act="liveSaveComp" data-id="${esc(c.id)}">Save</button></div>`,
      { title: esc(c.name), full: true },
    );
  };
  UI.acts.liveSaveComp = (d) => {
    const c = FM.S.comps[d.id];
    if (!c || busy()) return;
    const name = (($('#le-cname') || {}).value || '').trim();
    if (!name) return UI.toast('A competition needs a name', 2500);
    if (D.isRude && D.isRude(name)) return UI.toast('That name contains a word the game will not use', 3000);
    logEdit('comp', `Edited ${c.name}`, c.id, {
      name: c.name,
      prize: c.prize,
      rules: c.rules ? clone(c.rules) : undefined,
    });
    c.name = name;
    const prize = $('#le-cprize');
    if (prize) {
      const v = Math.max(0, Math.round(+prize.value || 0));
      if (c.type === 'league') c.rules.prize = v;
      else c.prize = v;
    }
    if ($('#le-cwin') && c.rules) c.rules.win = num('le-cwin', 2, 4);
    persist();
    UI.closeSheet();
    UI.render();
    UI.toast('Saved', 1500);
  };
  // The world's rules: points for a win, substitutes, two-legged ties and away goals
  UI.acts.liveRules = () => {
    if (!live() || busy()) return;
    const r = FM.S.rules;
    UI.closeSheet();
    UI.sheet(
      `<div class="row" style="gap:8px"><div style="flex:1"><div class="ng-label" style="margin-top:8px">Points for a win</div><input type="number" id="le-rwin" min="2" max="4" inputmode="numeric" value="${r.win}"></div><div style="flex:1"><div class="ng-label" style="margin-top:8px">Substitutes</div><input type="number" id="le-rsubs" min="3" max="9" inputmode="numeric" value="${r.subs}"></div></div>
      <div class="row" style="margin-top:12px"><span class="grow small">Two-legged ties</span><button class="btn sm ${r.twoLegs ? 'pri' : ''}" data-act="liveRuleToggle" data-k="twoLegs">${r.twoLegs ? 'On' : 'Off'}</button></div>
      <div class="row" style="margin-top:8px"><span class="grow small">Away goals</span><button class="btn sm ${r.awayGoals ? 'pri' : ''}" data-act="liveRuleToggle" data-k="awayGoals">${r.awayGoals ? 'On' : 'Off'}</button></div>
      <div class="actions" style="margin-top:14px"><button class="btn pri block" data-act="liveSaveRules">Save</button></div>`,
      { title: 'World rules' },
    );
  };
  UI.acts.liveRuleToggle = (d) => {
    FM.S.rules.win = num('le-rwin', 2, 4);
    FM.S.rules.subs = num('le-rsubs', 3, 9);
    FM.S.rules[d.k] = !FM.S.rules[d.k];
    persist();
    UI.acts.liveRules();
  };
  UI.acts.liveSaveRules = () => {
    logEdit('rules', 'Changed the world rules', null, clone(FM.S.rules));
    FM.S.rules.win = num('le-rwin', 2, 4);
    FM.S.rules.subs = num('le-rsubs', 3, 9);
    persist();
    UI.closeSheet();
    UI.toast('Saved', 1500);
  };
  // A new player, made as the game makes one, at a club or a free agent
  UI.acts.liveNewPlayer = () => {
    if (!live() || busy()) return;
    UI.closeSheet();
    UI.sheet(
      `<div class="row" style="gap:8px"><div style="flex:1"><div class="ng-label" style="margin-top:8px">Nationality</div><select id="np-nat">${natOptions(FM.W.userClub().nat)}</select></div><div style="flex:1"><div class="ng-label" style="margin-top:8px">Position</div><select id="np-pos">${posOptions('CM')}</select></div></div>
      <div class="row" style="gap:8px"><div style="flex:1"><div class="ng-label" style="margin-top:8px">Age</div><input type="number" id="np-age" min="15" max="40" inputmode="numeric" value="22"></div><div style="flex:1"><div class="ng-label" style="margin-top:8px">Ability (20 to 95)</div><input type="number" id="np-ca" min="20" max="95" inputmode="numeric" value="60"></div></div>
      <div class="ng-label">Club <span class="tiny dim">· type a club's name, or Free agent</span></div>
      <input type="text" id="np-club" list="le-clubs" value="Free agent" autocomplete="off">${clubList()}
      <div class="tiny dim" style="margin-top:8px;line-height:1.5">He is made with a name for his nation and attributes to match; edit him afterwards for anything else.</div>
      <div class="actions" style="margin-top:14px"><button class="btn pri block" data-act="liveMakePlayer">Add him</button></div>`,
      { title: 'Add a player', full: true },
    );
  };
  UI.acts.liveMakePlayer = () => {
    if (busy()) return;
    const cn = (($('#np-club') || {}).value || '').trim(),
      free = !cn || /^free agent$/i.test(cn),
      to = free ? null : clubByName(cn);
    if (!free && !to) return UI.toast('No club by that name', 2500);
    const age = num('np-age', 15, 40),
      ca = num('np-ca', 20, 95);
    const p = FM.W.genPlayer({
      nat: $('#np-nat').value,
      pos: $('#np-pos').value,
      age,
      ca,
      pa: FM.W.potentialFor(ca, age),
      clubId: to ? to.id : null,
    });
    if (!to) p.freeSince = FM.Season.dayIndex();
    FM.S.players[p.id] = p;
    FM.W.rosterVer++;
    logEdit('new', `Added ${FM.W.name(p)}`, p.id, null);
    persist();
    UI.closeSheet();
    UI.render();
    UI.toast('Added', 1500);
    UI.playerSheet(p.id);
  };
  // ---------- Bulk edits in the world you are playing ----------
  // One change to many at once: players (by nation, league, position, age), clubs, league and cup prize money, a nation's
  // youth rating. Like the single edits, it takes effect at once and nothing marks the save.
  const compsOf = (f) => Object.values(FM.S.comps).filter(f);
  const natOpts = () =>
    D.nationCodes()
      .slice()
      .sort((a, b) => D.NATIONS[a].name.localeCompare(D.NATIONS[b].name))
      .map((k) => `<option value="nat:${k}">${esc(D.NATIONS[k].name)}</option>`)
      .join('');
  const leagueOpts = () =>
    compsOf((c) => c.type === 'league')
      .sort((a, b) => a.nat.localeCompare(b.nat) || a.tier - b.tier)
      .map((c) => `<option value="lg:${esc(c.id)}">${esc(c.name)}</option>`)
      .join('');
  const scopeSel = (id, free) =>
    `<select id="${id}"><option value="all">Everyone in the world</option>${free ? '<option value="free">Free agents</option>' : ''}<optgroup label="A nation">${natOpts()}</optgroup><optgroup label="A league">${leagueOpts()}</optgroup></select>`;
  const inClubScope = (c, sc) =>
    sc === 'all' ||
    (sc.startsWith('nat:') && c.nat === sc.slice(4)) ||
    (sc.startsWith('lg:') && c.comp === sc.slice(3));
  const bulkNum = (id, label) =>
    `<div style="flex:1 1 44%;min-width:120px"><div class="tiny dim" style="margin-top:8px">${label}</div><input type="number" id="${id}" inputmode="numeric" placeholder="0"></div>`;
  const bv = (id) => {
    const v = ($('#' + id) || {}).value;
    return v === '' || v == null || isNaN(+v) ? null : +v;
  };
  const bulkPlayers = () => {
    const sc = ($('#bk-pscope') || {}).value || 'all',
      grp = ($('#bk-ppos') || {}).value || '',
      lo = bv('bk-pmin') ?? 0,
      hi = bv('bk-pmax') ?? 99;
    return Object.values(FM.S.players).filter((p) => {
      if (p.retired) return false;
      const c = p.clubId && FM.S.clubs[p.clubId];
      if (sc === 'free') {
        if (p.clubId) return false;
      } else if (sc !== 'all' && !(sc.startsWith('nat:') ? p.nat === sc.slice(4) : c && inClubScope(c, sc)))
        return false;
      if (grp && D.POS_GROUP[p.pos] !== grp) return false;
      const a = FM.W.age(p);
      return a >= lo && a <= hi;
    });
  };
  const bulkClubs = () => {
    const sc = ($('#bk-cscope') || {}).value || 'all';
    return Object.values(FM.S.clubs).filter((c) => c.comp && !FM.W.army(c) && inClubScope(c, sc));
  };
  const bulkComps = () => {
    const sc = ($('#bk-zscope') || {}).value || 'all',
      kind = ($('#bk-zkind') || {}).value || 'both';
    return compsOf((c) => {
      const prize = c.type === 'league' ? c.rules && c.rules.prize : c.prize;
      if (!(prize > 0)) return false;
      if (kind === 'league' ? c.type !== 'league' : kind === 'cup' && c.type === 'league') return false;
      return (
        sc === 'all' ||
        (sc.startsWith('nat:') && c.nat === sc.slice(4)) ||
        (sc.startsWith('lg:') && c.id === sc.slice(3))
      );
    });
  };
  const bulkNations = () => {
    const sc = ($('#bk-nscope') || {}).value || 'all';
    return D.nationCodes().filter((k) => sc === 'all' || FM.Guide.continentOf(k) === sc);
  };
  let bulkKind = 'p';
  const bulkCount = () => {
    const el = $('#bk-count');
    if (!el) return;
    const n = { p: bulkPlayers, c: bulkClubs, z: bulkComps, n: bulkNations }[bulkKind]().length;
    el.textContent = `Apply to ${U.plural(n, { p: 'player', c: 'club', z: 'competition', n: 'nation' }[bulkKind])}`;
  };
  const bulkForm = () => {
    const tabs = [
      ['p', 'Players'],
      ['c', 'Clubs'],
      ['z', 'Prizes'],
      ['n', 'Youth'],
    ]
      .map(([k, n]) => `<button class="${bulkKind === k ? 'on' : ''}" data-act="bulkKind" data-k="${k}">${n}</button>`)
      .join('');
    const body = {
      p: `<div class="ng-label">Who</div>${scopeSel('bk-pscope', true)}
        <div class="row" style="gap:8px;margin-top:8px"><select id="bk-ppos" class="grow"><option value="">Any position</option><option value="GK">Goalkeepers</option><option value="DEF">Defenders</option><option value="MID">Midfielders</option><option value="ATT">Forwards</option></select>
        <input type="number" id="bk-pmin" inputmode="numeric" placeholder="Age from" style="width:90px"><input type="number" id="bk-pmax" inputmode="numeric" placeholder="to" style="width:70px"></div>
        <div class="ng-label">Change <span class="tiny dim">· leave a box empty to leave that alone</span></div>
        <div class="row" style="gap:8px;flex-wrap:wrap">${bulkNum('bk-pattr', 'Every attribute (+ or −, on the 1 to 20 scale)')}${bulkNum('bk-ppa', 'Potential (+ or −)')}${bulkNum('bk-pcon', 'Contract runs for (years from now)')}${bulkNum('bk-pwage', 'Wage change (%)')}${bulkNum('bk-pmor', 'Morale set to (0 to 100)')}</div>
        <label class="row" style="gap:8px;margin-top:10px"><input type="checkbox" id="bk-pheal"> <span class="small">Heal every injury</span></label>`,
      c: `<div class="ng-label">Which clubs</div>${scopeSel('bk-cscope')}
        <div class="ng-label">Change</div>
        <div class="row" style="gap:8px;flex-wrap:wrap">${bulkNum('bk-crep', 'Reputation (+ or −)')}${bulkNum('bk-cbud', 'Transfer budget change (%)')}${bulkNum('bk-cbal', 'Bank balance change (%)')}${bulkNum('bk-ccap', 'Stadium capacity change (%)')}${bulkNum('bk-cacad', 'Academy level (+ or −, 1 to 5)')}${bulkNum('bk-ctrain', 'Training level (+ or −, 1 to 5)')}${bulkNum('bk-cmed', 'Medical level (+ or −, 1 to 5)')}</div>`,
      z: `<div class="ng-label">Which</div>${scopeSel('bk-zscope')}
        <select id="bk-zkind" style="margin-top:8px"><option value="both">Leagues and cups</option><option value="league">Leagues only</option><option value="cup">Cups only</option></select>
        <div class="row" style="gap:8px;flex-wrap:wrap">${bulkNum('bk-zprize', 'Prize money change (%)')}</div>
        <div class="tiny dim" style="margin-top:8px;line-height:1.5">Only competitions with a fixed prize fund are changed; a league that pays by club revenue is left as it is.</div>`,
      n: `<div class="ng-label">Which nations</div><select id="bk-nscope"><option value="all">Every nation</option>${FM.Guide.CONTINENTS.map(([k, n]) => `<option value="${k}">${esc(n)}</option>`).join('')}</select>
        <div class="row" style="gap:8px;flex-wrap:wrap">${bulkNum('bk-nyouth', 'Youth rating (+ or −; 15 to 95, 50 is average)')}</div>
        <div class="tiny dim" style="margin-top:8px;line-height:1.5">A nation's youth rating sets how good the academy intakes of its clubs are. It moves by itself every season.</div>`,
    }[bulkKind];
    const undo = UI._bulkUndo
      ? `<div class="card flat" style="margin-top:12px"><div class="small">↩ Last bulk edit: ${esc(UI._bulkUndo.label)}</div><button class="btn sm" style="margin-top:8px" data-act="bulkUndo">Undo it</button></div>`
      : '';
    return `<div class="seg" style="margin-bottom:6px">${tabs}</div>${body}<div class="actions" style="margin-top:14px"><button class="btn pri block" id="bk-count" data-act="bulkApply">Apply</button></div>${undo}`;
  };
  UI.acts.liveBulk = () => {
    if (!live() || busy()) return;
    bulkKind = 'p';
    UI._bulkUndo = null;
    const sh = UI.sheet(`<div id="bk-body">${bulkForm()}</div>`, { title: 'Bulk edit', full: true });
    sh.addEventListener('input', bulkCount);
    sh.addEventListener('change', bulkCount);
    bulkCount();
  };
  UI.acts.bulkKind = (d) => {
    bulkKind = d.k;
    const b = $('#bk-body');
    if (b) b.innerHTML = bulkForm();
    bulkCount();
  };
  // What each kind of bulk edit can change, copied before it does, so the last one can be undone (while the Bulk edit sheet stays open)
  const PFIELDS = ['pa', 'contract', 'wage', 'morale', 'inj'];
  const snapPlayer = (p) => ({ attrs: { ...p.attrs }, ...Object.fromEntries(PFIELDS.map((k) => [k, p[k]])) });
  const snapClub = (c) => ({
    rep: c.rep,
    budget: c.budget,
    balance: c.balance,
    cap: c.stadium.cap,
    cap0: c.stadium.cap0,
    fac: { ...c.facilities },
  });
  const undoBulk = (u) => {
    const S = FM.S;
    for (const [id, o] of Object.entries(u.players || {})) {
      const p = S.players[id];
      if (!p) continue;
      p.attrs = { ...o.attrs };
      for (const k of PFIELDS) p[k] = o[k];
      FM.W.refresh(p);
      p.pa = o.pa;
    }
    for (const [id, o] of Object.entries(u.clubs || {})) {
      const c = S.clubs[id];
      if (!c) continue;
      Object.assign(c, { rep: o.rep, budget: o.budget, balance: o.balance });
      c.stadium.cap = o.cap;
      c.stadium.cap0 = o.cap0;
      c.facilities = { ...o.fac };
    }
    for (const [id, o] of Object.entries(u.comps || {})) {
      const c = S.comps[id];
      if (!c) continue;
      if (c.type === 'league') c.rules.prize = o;
      else c.prize = o;
    }
    for (const [k, o] of Object.entries(u.nations || {})) S.youthRate[k] = o;
  };
  UI.acts.bulkUndo = () => {
    const u = UI._bulkUndo;
    if (!u || !live() || busy()) return;
    undoBulk(u);
    const label = u.label;
    UI._bulkUndo = null;
    // (the entry in the Changes list goes with it)
    FM.S.editLog = (FM.S.editLog || []).filter((e) => !(e.type === 'bulk' && e.label === `Bulk edit: ${label}`));
    persist();
    UI.render();
    const b = $('#bk-body');
    if (b) b.innerHTML = bulkForm();
    bulkCount();
    UI.toast(`Undone: ${label}`, 2500);
  };
  UI.acts.bulkApply = () => {
    if (!live() || busy()) return;
    const S = FM.S,
      cl = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
    let n = 0;
    const snap = { players: {}, clubs: {}, comps: {}, nations: {}, label: '' };
    if (bulkKind === 'p') {
      const attr = bv('bk-pattr'),
        pa = bv('bk-ppa'),
        con = bv('bk-pcon'),
        wage = bv('bk-pwage'),
        mor = bv('bk-pmor'),
        heal = ($('#bk-pheal') || {}).checked;
      for (const p of bulkPlayers()) {
        let hit = false;
        if (attr || pa || con != null || wage || mor != null || heal) snap.players[p.id] = snapPlayer(p);
        if (attr) {
          for (const k of D.ATTRS) p.attrs[k] = cl(Math.round(p.attrs[k] + attr), 1, 20);
          FM.W.refresh(p);
          if (p.pa < p.ca) p.pa = p.ca;
          hit = true;
        }
        if (pa) {
          p.pa = cl(p.pa + Math.round(pa), p.ca, 99);
          hit = true;
        }
        if (con != null && p.clubId) {
          p.contract = cl(S.year + Math.round(con), S.year, S.year + 8);
          hit = true;
        }
        if (wage) {
          p.wage = Math.max(100, Math.round((p.wage * (100 + wage)) / 100));
          hit = true;
        }
        if (mor != null) {
          p.morale = cl(Math.round(mor), 0, 100);
          hit = true;
        }
        if (heal && p.inj) {
          p.inj = null;
          hit = true;
        }
        if (hit) n++;
      }
    } else if (bulkKind === 'c') {
      const rep = bv('bk-crep'),
        bud = bv('bk-cbud'),
        bal = bv('bk-cbal'),
        cap = bv('bk-ccap'),
        fac = { academy: bv('bk-cacad'), training: bv('bk-ctrain'), medical: bv('bk-cmed') };
      for (const c of bulkClubs()) {
        let hit = false;
        snap.clubs[c.id] = snapClub(c);
        if (rep) {
          c.rep = cl(Math.round(c.rep + rep), 20, 99);
          hit = true;
        }
        if (bud) {
          c.budget = Math.round((c.budget * (100 + bud)) / 100);
          hit = true;
        }
        if (bal) {
          c.balance = Math.round((c.balance * (100 + bal)) / 100);
          hit = true;
        }
        if (cap) {
          c.stadium.cap = c.stadium.cap0 = cl(Math.round((c.stadium.cap * (1 + cap / 100)) / 500) * 500, 1000, 120000);
          hit = true;
        }
        for (const k of Object.keys(fac))
          if (fac[k]) {
            c.facilities[k] = cl(Math.round((c.facilities[k] || 2) + fac[k]), 1, 5);
            hit = true;
          }
        if (hit) n++;
      }
    } else if (bulkKind === 'z') {
      const pct = bv('bk-zprize');
      if (pct)
        for (const c of bulkComps()) {
          snap.comps[c.id] = c.type === 'league' ? c.rules.prize : c.prize;
          if (c.type === 'league') c.rules.prize = Math.round((c.rules.prize * (100 + pct)) / 100);
          else c.prize = Math.round((c.prize * (100 + pct)) / 100);
          n++;
        }
    } else {
      const d = bv('bk-nyouth');
      if (d)
        for (const k of bulkNations()) {
          FM.Season.youthRating(k);
          snap.nations[k] = S.youthRate[k];
          S.youthRate[k] = cl(Math.round((S.youthRate[k] + d) * 10) / 10, 15, 95);
          n++;
        }
    }
    if (!n) return UI.toast('Nothing changed: fill in a change first', 2500);
    snap.label = `${U.plural(n, { p: 'player', c: 'club', z: 'competition', n: 'nation' }[bulkKind])} changed`;
    UI._bulkUndo = snap;
    logEdit('bulk', `Bulk edit: ${snap.label}`, null, snap, Object.keys(snap.players).length > 1500);
    persist();
    UI.render();
    const bb = $('#bk-body');
    if (bb) bb.innerHTML = bulkForm();
    bulkCount();
    UI.toast(`${U.plural(n, 'row')} changed`, 2500);
  };
  // ---------- Commissioner mode ----------
  // Step outside your role: force a transfer or a loan whatever the clubs and the player think, and correct a result that was
  // wrong. (Names, ratings, club details, money and the world's rules are in the edits above; this adds the things a commissioner
  // does to the running season.) A forced transfer goes through the game's own transfer code, so the records, the news and the
  // clubs' books follow; it cannot be undone from the Changes list. A corrected result moves the table; the goals, scorers and
  // statistics of the match as it was played are left as they were.
  UI.acts.liveCommish = () => {
    if (!live() || busy()) return;
    UI.closeSheet();
    UI.sheet(
      `<div class="tiny dim" style="line-height:1.5">The commissioner can change anything in the running career. A forced transfer or loan and a corrected result take effect at once.</div>
      <button class="btn sm block" style="margin-top:10px" data-act="liveForce">Force a transfer or a loan</button>
      <button class="btn sm block" style="margin-top:8px" data-act="liveResult">Correct a league result</button>
      <button class="btn sm block" style="margin-top:8px" data-act="liveRules">Change the world's rules (points for a win, substitutes and more)</button>
      <button class="btn sm block" style="margin-top:8px" data-act="liveBulk">Bulk edit: many players, clubs or prizes at once</button>`,
      { title: 'Commissioner' },
    );
  };
  // -- a forced transfer or loan --
  const CM = (UI._commish = { pid: null, kind: 't' });
  UI.acts.liveForce = () => {
    if (!live() || busy()) return;
    UI.closeSheet();
    CM.pid = null;
    const sh = UI.sheet(
      `<div class="ng-find"><input type="search" id="cm-q" placeholder="Find the player" autocomplete="off"></div><div id="cm-body"></div>`,
      { title: 'Force a transfer or a loan', full: true },
    );
    const q = sh.querySelector('#cm-q');
    q.addEventListener('input', () => {
      const t = q.value.trim().toLowerCase();
      const body = sh.querySelector('#cm-body');
      if (t.length < 2) {
        body.innerHTML = '';
        return;
      }
      const list = Object.values(FM.S.players)
        .filter((p) => !p.retired && FM.W.name(p).toLowerCase().includes(t))
        .sort((a, b) => b.ca - a.ca)
        .slice(0, 12);
      body.innerHTML =
        list
          .map((p) => {
            const c = p.clubId && FM.S.clubs[p.clubId];
            return `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="liveForcePick" data-id="${esc(p.id)}"><div class="small b">${esc(FM.W.name(p))}</div><div class="tiny dim">${esc(p.pos)} · ${FM.W.age(p)} · ${p.ca} · ${esc(c ? c.name : 'free agent')}</div></div>`;
          })
          .join('') || '<div class="empty">No one matches.</div>';
    });
    q.focus();
  };
  const forceForm = () => {
    const p = FM.S.players[CM.pid];
    if (!p) return '';
    const c = p.clubId && FM.S.clubs[p.clubId];
    const seg = [
      ['t', 'A transfer'],
      ['l', 'A loan until the summer'],
    ]
      .map(
        ([k, t]) => `<button class="${CM.kind === k ? 'on' : ''}" data-act="liveForceKind" data-k="${k}">${t}</button>`,
      )
      .join('');
    return `<div class="card flat" style="padding:10px 12px"><div class="small b">${esc(FM.W.name(p))}</div><div class="tiny dim">${esc(p.pos)} · ${FM.W.age(p)} · ${p.ca} · ${esc(c ? c.name : 'free agent')}</div></div>
      <div class="seg" style="margin:10px 0 0">${seg}</div>
      <div class="ng-label">To which club <span class="tiny dim">· type a club's name</span></div>
      <input type="text" id="cm-club" list="le-clubs" placeholder="Club" autocomplete="off">${clubList()}
      <div class="ng-label">${CM.kind === 'l' ? 'Loan fee' : 'Fee'} <span class="tiny dim">· paid by the new club to the old one; 0 for none</span></div>
      <input type="number" id="cm-fee" min="0" inputmode="numeric" value="0">
      <div class="actions" style="margin-top:14px"><button class="btn pri block" data-act="liveForceDo">${CM.kind === 'l' ? 'Send him on loan' : 'Make the transfer'}</button></div>`;
  };
  UI.acts.liveForcePick = (d) => {
    CM.pid = d.id;
    const b = $('#cm-body');
    if (b) b.innerHTML = forceForm();
    const q = $('#cm-q');
    if (q) q.style.display = 'none';
  };
  UI.acts.liveForceKind = (d) => {
    CM.kind = d.k;
    const b = $('#cm-body');
    if (b) b.innerHTML = forceForm();
  };
  UI.acts.liveForceDo = () => {
    const S = FM.S,
      p = S.players[CM.pid];
    if (!p || busy()) return;
    const to = clubByName((($('#cm-club') || {}).value || '').trim());
    if (!to) return UI.toast('No club by that name', 2500);
    if (to.id === p.clubId) return UI.toast('He is at that club already', 2500);
    const fee = Math.max(0, Math.round(+($('#cm-fee') || {}).value || 0));
    const name = FM.W.name(p),
      from = p.clubId && S.clubs[p.clubId];
    if (CM.kind === 'l') {
      if (!from) return UI.toast('A free agent cannot go on loan: make it a transfer', 3000);
      FM.Transfers.loan(p, to.id, 1, fee);
    } else FM.Transfers.execute(p, to.id, fee, p.wage, {});
    logEdit('force', `${CM.kind === 'l' ? 'Loaned' : 'Moved'} ${name} to ${to.name}`, p.id, null);
    FM.W.rosterVer++;
    persist();
    UI.closeSheet();
    UI.render();
    UI.toast(`${name} ${CM.kind === 'l' ? 'is on loan at' : 'has joined'} ${to.name}`, 3000);
  };
  // -- a corrected result --
  const played = (comp, id) => {
    const out = [];
    (comp.fixtures || []).forEach((round, r) =>
      round.forEach((f, i) => {
        if (f.res && !f.ko && !f.leg && (f.h === id || f.a === id)) out.push({ r, i, f });
      }),
    );
    return out;
  };
  // the table moves by what the match changes: the old result comes out, the new one goes in
  const tableMove = (table, fx, hg, ag, sign, win) => {
    const th = table[fx.h],
      ta = table[fx.a];
    if (!th || !ta) return;
    th.p += sign;
    ta.p += sign;
    th.gf += sign * hg;
    th.ga += sign * ag;
    ta.gf += sign * ag;
    ta.ga += sign * hg;
    if (hg > ag) {
      th.w += sign;
      ta.l += sign;
      th.pts += sign * win;
    } else if (hg < ag) {
      ta.w += sign;
      th.l += sign;
      ta.pts += sign * win;
    } else {
      th.d += sign;
      ta.d += sign;
      th.pts += sign;
      ta.pts += sign;
    }
  };
  const setScore = (comp, fx, hg, ag) => {
    const win = FM.W.rule(comp.id, 'win'),
      old = fx.res;
    const tables = [comp.table];
    if (comp.torneos) tables.push(comp.torneos[fx.round >= comp.torneoHalf ? 1 : 0].table);
    for (const t of tables) {
      tableMove(t, fx, old.hg, old.ag, -1, win);
      tableMove(t, fx, hg, ag, 1, win);
    }
    old.hg = hg;
    old.ag = ag;
  };
  UI.acts.liveResult = () => {
    if (!live() || busy()) return;
    UI.closeSheet();
    const sh = UI.sheet(
      `<div class="tiny dim" style="line-height:1.5">Find a club's played league matches, pick one and give it the right score. The table follows; the goals, scorers and player statistics of the match stay as they were played.</div>
      <div class="ng-label">Club <span class="tiny dim">· type a club's name</span></div>
      <input type="text" id="cm-rclub" list="le-clubs" placeholder="Club" autocomplete="off">${clubList()}
      <div class="actions" style="margin-top:10px"><button class="btn sm block" data-act="liveResultFind">Show its played matches</button></div>
      <div id="cm-rbody"></div>`,
      { title: 'Correct a league result', full: true },
    );
    return sh;
  };
  UI.acts.liveResultFind = () => {
    const c = clubByName((($('#cm-rclub') || {}).value || '').trim());
    if (!c) return UI.toast('No club by that name', 2500);
    const comp = FM.S.comps[c.comp];
    if (!comp || comp.type !== 'league') return UI.toast('That club has no league table', 2500);
    CM.club = c.id;
    const list = played(comp, c.id);
    $('#cm-rbody').innerHTML =
      list
        .slice()
        .reverse()
        .map(
          ({ r, i, f }) =>
            `<div class="card tap" style="margin:4px 0;padding:10px 12px" data-act="liveResultPick" data-r="${r}" data-i="${i}"><div class="small b">${esc(FM.clubOf(f.h).name)} ${f.res.hg} – ${f.res.ag} ${esc(FM.clubOf(f.a).name)}</div><div class="tiny dim">Round ${r + 1}</div></div>`,
        )
        .join('') || '<div class="empty">No league match played yet.</div>';
  };
  UI.acts.liveResultPick = (d) => {
    const c = FM.S.clubs[CM.club],
      comp = c && FM.S.comps[c.comp],
      f = comp && comp.fixtures[+d.r] && comp.fixtures[+d.r][+d.i];
    if (!f || !f.res) return;
    $('#cm-rbody').innerHTML =
      `<div class="card flat" style="padding:10px 12px;margin-top:10px"><div class="small b">${esc(FM.clubOf(f.h).name)} against ${esc(FM.clubOf(f.a).name)}</div><div class="tiny dim">Round ${+d.r + 1}, played ${f.res.hg} – ${f.res.ag}</div></div>
      <div class="row" style="gap:8px;margin-top:8px"><div style="flex:1"><div class="ng-label" style="margin-top:0">${esc(FM.clubOf(f.h).short || 'Home')}</div><input type="number" id="cm-hg" min="0" max="30" inputmode="numeric" value="${f.res.hg}"></div><div style="flex:1"><div class="ng-label" style="margin-top:0">${esc(FM.clubOf(f.a).short || 'Away')}</div><input type="number" id="cm-ag" min="0" max="30" inputmode="numeric" value="${f.res.ag}"></div></div>
      <div class="actions" style="margin-top:14px"><button class="btn pri block" data-act="liveResultSave" data-r="${d.r}" data-i="${d.i}">Set the result</button></div>`;
  };
  UI.acts.liveResultSave = (d) => {
    const c = FM.S.clubs[CM.club],
      comp = c && FM.S.comps[c.comp],
      f = comp && comp.fixtures[+d.r] && comp.fixtures[+d.r][+d.i];
    if (!f || !f.res || busy()) return;
    const hg = num('cm-hg', 0, 30),
      ag = num('cm-ag', 0, 30);
    if (hg === f.res.hg && ag === f.res.ag) return UI.toast('That is the score already', 2000);
    const was = { hg: f.res.hg, ag: f.res.ag };
    setScore(comp, f, hg, ag);
    logEdit(
      'result',
      `Result corrected: ${FM.clubOf(f.h).name} ${hg} – ${ag} ${FM.clubOf(f.a).name} (was ${was.hg} – ${was.ag})`,
      comp.id,
      { r: +d.r, i: +d.i, hg: was.hg, ag: was.ag },
    );
    persist();
    UI.closeSheet();
    UI.render();
    UI.toast('Result set; the table is updated', 3000);
  };
  // putting a corrected result back as it was played
  const undoResult = (e) => {
    const comp = FM.S.comps[e.ref],
      f = comp && comp.fixtures[e.snap.r] && comp.fixtures[e.snap.r][e.snap.i];
    if (f && f.res) setScore(comp, f, e.snap.hg, e.snap.ag);
  };
  // ---------- A confirmation for changes with knock-on effects ----------
  const sure = (title, text, act, id) =>
    UI.sheet(
      `<div class="small" style="line-height:1.6">${text}</div>
      <div class="actions" style="margin-top:14px"><button class="btn pri block" data-act="liveSure" data-a="${act}" data-id="${esc(id)}">Yes, make the change</button></div>
      <div class="actions" style="margin-top:8px"><button class="btn block" data-act="closeSheet">No, go back</button></div>`,
      { title },
    );
  UI.acts.liveSure = (d) => {
    UI.closeSheet();
    if (UI.acts[d.a]) UI.acts[d.a]({ id: d.id, sure: true });
  };
  // ---------- The Changes list ----------
  const changesBody = () => {
    const log = FM.S.editLog || [];
    return log.length
      ? log
          .map((e) => {
            const can = !!(e.snap || (UI._editSnaps && UI._editSnaps[e.id])) || e.type === 'new';
            return `<div class="card flat" style="margin:6px 0;padding:10px 12px"><div class="row" style="gap:8px"><div class="grow"><div class="small b">${esc(e.label)}</div><div class="tiny dim">Season ${esc(e.y)}${can || e.type === 'new' ? '' : e.type === 'force' ? ' · cannot be undone' : ' · too large to undo after a reload'}</div></div>${can ? `<button class="btn sm" data-act="liveUndo" data-eid="${esc(e.id)}">Undo</button>` : ''}</div></div>`;
          })
          .join('')
      : '<div class="empty">Nothing has been changed yet.</div>';
  };
  UI.acts.liveChanges = () => {
    UI.closeSheet();
    UI.sheet(
      `<div class="tiny dim" style="line-height:1.5;margin-bottom:6px">Edits made in this career, newest first. Undo puts back what that edit replaced; anything changed since by the game or by later edits of the same thing is overwritten.</div><div id="lc-body">${changesBody()}</div>`,
      { title: 'Changes made', full: true },
    );
  };
  UI.acts.liveUndo = (d) => {
    const S = FM.S,
      e = (S.editLog || []).find((x) => x.id === d.eid);
    if (!e || !live() || busy()) return;
    const snap = e.snap || (UI._editSnaps && UI._editSnaps[e.id]);
    if (!snap && !['new'].includes(e.type)) return UI.toast('That change can no longer be undone', 2500);
    if (e.type === 'player' && S.players[e.ref]) {
      restore(S.players[e.ref], snap);
      FM.W.rosterVer++;
    } else if (e.type === 'club' && S.clubs[e.ref]) restore(S.clubs[e.ref], snap);
    else if (e.type === 'comp' && S.comps[e.ref]) {
      const c = S.comps[e.ref];
      c.name = snap.name;
      if (snap.prize !== undefined) c.prize = snap.prize;
      if (snap.rules && c.rules) restore(c.rules, snap.rules);
    } else if (e.type === 'rules') restore(S.rules, snap);
    else if (e.type === 'new') {
      const p = S.players[e.ref];
      if (p) {
        movePlayer(p, null);
        delete S.players[e.ref];
        FM.W.rosterVer++;
      }
    } else if (e.type === 'result') {
      undoResult(e);
    } else if (e.type === 'bulk') {
      undoBulk(snap);
      if (UI._bulkUndo && UI._bulkUndo.label + '' === (snap.label || '')) UI._bulkUndo = null;
    }
    S.editLog = S.editLog.filter((x) => x !== e);
    if (UI._editSnaps) delete UI._editSnaps[e.id];
    persist();
    UI.render();
    const b = $('#lc-body');
    if (b) b.innerHTML = changesBody();
    UI.toast('Undone', 1500);
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
          `<div class="actions" style="margin:14px 0 4px"><button class="btn sm" data-act="${act}" data-id="${esc(id)}">Edit</button></div>`,
        );
      return r;
    };
  };
  withEdit('playerSheet', 'liveEditPlayer');
  withEdit('clubSheet', 'liveEditClub');
})();
