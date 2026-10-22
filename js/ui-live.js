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
  const num = (id, lo, hi) => Math.max(lo, Math.min(hi, Math.round(+($('#' + id) || {}).value || 0)));
  UI.acts.liveEdit = () => {
    if (!live() || busy()) return;
    const sh = UI.sheet(
      `<div class="tiny dim" style="line-height:1.5">Fix a name or a rating in the world you are playing. A change takes effect at once and nothing marks the save.</div>
      <button class="btn sm block" style="margin-top:10px" data-act="liveBulk">🧰 Bulk edit: many players, clubs or prizes at once</button>
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
      ? `<div class="card flat" style="margin-top:12px"><div class="small">↩️ Last bulk edit: ${esc(UI._bulkUndo.label)}</div><button class="btn sm" style="margin-top:8px" data-act="bulkUndo">Undo it</button></div>`
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
  UI.acts.bulkUndo = () => {
    const u = UI._bulkUndo,
      S = FM.S;
    if (!u || !live() || busy()) return;
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
    const label = u.label;
    UI._bulkUndo = null;
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
    persist();
    UI.render();
    const bb = $('#bk-body');
    if (bb) bb.innerHTML = bulkForm();
    bulkCount();
    UI.toast(`${U.plural(n, 'row')} changed`, 2500);
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
