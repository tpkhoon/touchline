// The world's lore on screen: club details, older glory, rivalries with a story, competition histories, the kind of club it is,
// the people (legends who became managers, chairmen, ambassadors and pundits), and the world map. The data is FM.Lore (js/lore.js).
(function () {
  const FM = window.FM,
    U = FM.U,
    D = FM.D,
    W = FM.W,
    UI = FM.UI,
    C = UI.C;
  const esc = U.esc,
    S = () => FM.S,
    L = () => FM.Lore;
  const km = (n) => `${Math.round(n / 10) * 10}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const row = (label, html, tap) =>
    `<div class="row small" style="padding:7px 0;border-top:1px solid var(--line);align-items:flex-start;gap:10px"><span class="dim" style="width:104px;flex:none">${label}</span><div class="grow ${tap ? 'tap' : ''}" style="min-width:0" ${tap || ''}>${html}</div></div>`;
  const cname = (id) => (S().clubs[id] ? esc(S().clubs[id].name) : '?');

  // ---------------------------------------------------------------- what kind of club, and its people
  UI.kindPill = function (c) {
    const k = L() && L().kind(c);
    return k
      ? `<span class="pill" title="${esc(k.text)}" style="background:rgba(0,0,0,.3);color:#fff;border:0">${k.icon} ${esc(k.label)}</span>`
      : '';
  };
  const peopleRows = function (c) {
    const P = L().peopleOf(c),
      out = [];
    if (P.chair)
      out.push(
        row(
          P.chair.title,
          `${C.flag(P.chair.nat)} ${esc(P.chair.name)}${P.chair.legend != null ? ' <span class="pill">former player</span>' : ''}<div class="tiny dim">in the post since ${P.chair.since}${P.chair.legend != null && (c.legends || [])[P.chair.legend] ? `; played ${U.plural(c.legends[P.chair.legend].apps, 'game')} for the club` : ''}</div>`,
        ),
      );
    if (P.amb)
      out.push(
        row(
          'Ambassador',
          `${C.flag(P.amb.nat)} ${esc(P.amb.name)}<div class="tiny dim">${esc(P.amb.pos)} · ${esc(P.amb.era)} · ${U.plural(P.amb.apps, 'game')}, ${U.plural(P.amb.goals, 'goal')}. Represents the club at dinners, openings and every big night.</div>`,
        ),
      );
    if (P.mgr) {
      const src = S().clubs[P.mgr.lore.club];
      out.push(
        row(
          'Manager',
          `${C.flag(P.mgr.nat)} ${esc(P.mgr.fn + ' ' + P.mgr.ln)}<div class="tiny dim">${
            src && src.id !== c.id
              ? `Played ${U.plural(P.mgr.lore.apps, 'game')} for ${esc(src.name)} (${esc(P.mgr.lore.era)}), the rivals.`
              : `A club legend: ${U.plural(P.mgr.lore.apps, 'game')} for the club (${esc(P.mgr.lore.era)}).`
          }</div>`,
        ),
      );
    }
    return out.join('');
  };
  UI.peopleRows = peopleRows;

  // ---------------------------------------------------------------- the club's details
  UI.loreCard = function (c) {
    if (!L()) return '';
    L().ensure();
    const d = S().lore && S().lore.clubs[c.id];
    if (!d) return '';
    const o = (id) => (id && S().clubs[id] ? ` v ${cname(id)}` : '');
    const kind = L().kind(c);
    const rv = c.rival && S().clubs[c.rival] ? L().rival(c.id, c.rival) : null;
    const eras = d.eras
      .map(
        (e) =>
          `<div class="tiny" style="margin-top:3px"><b>${esc(e.name)}</b>, ${e.from}–${e.to}${e.note ? ` <span class="dim">· ${esc(e.note)}</span>` : ''}</div>`,
      )
      .join('');
    return `<div class="card"><div class="h3">The club</div>
      ${kind ? `<div class="phrase"><span>${kind.icon}</span><span><b>${esc(kind.label)}.</b> ${esc(kind.text)}</span></div>` : ''}
      ${row('Motto', `<i>“${esc(d.motto)}”</i>`)}
      ${row('Anthem', `${esc(d.anthem.title)}<div class="tiny dim">${esc(d.anthem.note)}</div>`)}
      ${row('Mascot', esc(d.mascot))}
      ${row('Ground', `${esc(d.ground)}${c.stadium ? `<div class="tiny dim">${esc(c.stadium.name)}</div>` : ''}`)}
      ${row('Record crowd', `${d.att.n.toLocaleString()}<div class="tiny dim">${d.att.year}, ${esc(d.att.what)}${o(d.att.vs)}</div>`)}
      ${d.bigWin ? row('Record win', `${d.bigWin.gf}–${d.bigWin.ga}${o(d.bigWin.vs)}<div class="tiny dim">${d.bigWin.year}</div>`) : ''}
      ${d.bigLoss ? row('Heaviest defeat', `${d.bigLoss.gf}–${d.bigLoss.ga}${o(d.bigLoss.vs)}<div class="tiny dim">${d.bigLoss.year}</div>`) : ''}
      ${row('Famous match', `${esc(d.famous.text)}`)}
      ${eras ? row('Eras', eras) : ''}
      ${peopleRows(c)}
      ${
        rv && c.rival
          ? row(
              'Rivalry',
              `<b>${esc(c.derby || 'The derby')}</b> v ${cname(c.rival)}<div class="tiny dim" style="margin-top:2px">${esc(rv.origin)}.</div>${
                rv.h2h.p
                  ? `<div class="tiny dim" style="margin-top:2px">Before the save: P${rv.h2h.p} · ${rv.h2h.w}W ${rv.h2h.d}D ${rv.h2h.l}L · ${rv.h2h.gf}–${rv.h2h.ga}</div>`
                  : ''
              }`,
              `data-act="clubView" data-id="${c.rival}"`,
            )
          : ''
      }
      <div class="tiny dim" style="margin-top:8px">Records of the generated past; the Club records card keeps the numbers since this career began.</div></div>`;
  };

  // ---------------------------------------------------------------- honours before the records
  const years = (ys) => (ys.length > 14 ? `${ys.slice(0, 12).join(', ')} and ${ys.length - 12} more` : ys.join(', '));
  UI.earlyCard = function (c) {
    if (!L()) return '';
    L().ensure();
    const e = L().early(c);
    if (!e) return '';
    const nat = D.NATIONS[c.nat] ? D.NATIONS[c.nat].name : '';
    return `<div class="card"><div class="row"><div class="h3 grow">Honours before the records</div><span class="tiny dim">${e.from}–${e.to}</span></div>
      ${e.t.length ? row('League champions', `${U.plural(e.t.length, 'title')}<div class="tiny dim" style="line-height:1.5">${esc(years(e.t))}</div>`) : row('League champions', '<span class="dim">No title in those years</span>')}
      ${row('Top flight', U.plural(e.n, 'season') + (e.n ? ` of ${e.to - e.from + 1}` : ''))}
      ${e.b ? row('Best decade', `the ${e.b}s`) : ''}
      <div class="tiny dim" style="margin-top:8px">${esc(nat)}’s top flight from ${e.from}: ${esc(c.name)}’s summary before this world’s season-by-season records begin.</div></div>`;
  };
  const baseHonours = UI.honoursCard;
  UI.honoursCard = function (c, none) {
    return baseHonours(c, none) + UI.earlyCard(c);
  };

  // ---------------------------------------------------------------- a competition's history
  UI.compHistoryCard = function (comp) {
    if (!L()) return '';
    L().ensure();
    const d = L().comp(comp.id);
    if (!d) return '';
    const st = S();
    const wins = [];
    if (comp.type === 'continental' || comp.type === 'world')
      for (const h of (st.contHist || [])
        .filter((x) => x.id === comp.id)
        .slice(-6)
        .reverse())
        wins.push(`${h.year}: ${cname(h.w)}`);
    else
      for (const e of (st.archive || []).slice().reverse()) {
        const x = comp.type === 'league' ? e.comps && e.comps[comp.id] : e.cups && e.cups[comp.id];
        if (x) wins.push(`${e.year}: ${cname(x.champion || x.winner)}`);
        if (wins.length >= 6) break;
      }
    return `<details class="small" style="margin-top:10px"><summary class="b dim" style="cursor:pointer">History${d.oldest ? ' · the oldest cup in the world' : ''}</summary>
      <div class="tiny" style="margin-top:6px;line-height:1.55">Founded ${d.founded}.${d.trophy ? ` ${comp.type === 'league' ? 'The title is lifted with' : 'The winners lift'} ${esc(d.trophy.name)}${d.trophy.donor ? `, given by ${esc(d.trophy.donor)}` : ''}.` : ''}</div>
      ${d.notes.map(([y, t]) => `<div class="tiny" style="margin-top:3px"><b>${y}</b> ${esc(t)}</div>`).join('')}
      ${d.best ? `<div class="tiny" style="margin-top:6px">Most titles: <b>${cname(d.best.id)}</b>, ${d.best.n}</div>` : ''}
      ${(d.kills || []).length ? `<div class="tiny" style="margin-top:6px">Giant-killings: ${d.kills.map((k) => `${cname(k.id)} won it in ${k.y}`).join('; ')}</div>` : ''}
      ${wins.length ? `<div class="tiny dim" style="margin-top:6px">Recent winners: ${esc(wins.join(' · '))}</div>` : ''}</details>`;
  };

  // ---------------------------------------------------------------- the people of a legend
  // (hooked into the club's all-time lists: a legend who now manages, chairs or speaks on television says so)
  UI.legendRole = (l) => (L() && l.role ? L().roleText(l) : '');

  // A manager who is a club legend (his old club, or the rival of the one he manages), for the match and club cards
  UI.mgrLegendLine = function (mgr, clubId, myId) {
    if (!mgr || !mgr.lore) return '';
    const src = S().clubs[mgr.lore.club];
    if (!src) return '';
    const own = src.id === clubId;
    return `<div class="tiny dim" style="text-align:right;margin-top:2px">${
      src.id === myId && !own
        ? `A former ${esc(src.name)} player (${U.plural(mgr.lore.apps, 'game')}): a reunion`
        : own
          ? `A club legend: ${U.plural(mgr.lore.apps, 'game')} as a player`
          : `Played ${U.plural(mgr.lore.apps, 'game')} for ${esc(src.name)}, the rivals`
    }</div>`;
  };

  // ---------------------------------------------------------------- a trip, on the match card
  UI.tripLine = function (fx) {
    if (!L() || fx.neutral || !fx.h || !fx.a) return '';
    const kmv = L().km(fx.h, fx.a);
    if (kmv < 25) return '';
    return `<div class="row small" style="margin-top:6px"><span class="grow dim">Journey</span><b style="text-align:right;max-width:70%">${esc(L().tripText(fx.h, fx.a))}</b></div>`;
  };

  // ================================================================ the map
  // Latitude and longitude boxes [west, south, east, north]
  UI.MAP_REGIONS = {
    world: ['World', [-130, -50, 180, 72]],
    europe: ['Europe', [-12, 34, 40, 66]],
    isles: ['British Isles', [-11, 49, 2.5, 59.5]],
    sam: ['South America', [-82, -56, -33, 14]],
    nam: ['North America', [-125, 14, -65, 52]],
    asia: ['Asia', [32, -12, 150, 56]],
    africa: ['Africa', [-20, -36, 52, 38]],
    oceania: ['Australia', [112, -45, 156, -9]],
  };
  // The region of a nation, for the map and for the new-career picker
  UI.mapRegionOf = function (nat) {
    const r = D.NATIONS[nat] && D.NATIONS[nat].region;
    return r === 'ENG' || r === 'EUR'
      ? ['ENG', 'SCO', 'WAL', 'IRL'].includes(nat)
        ? 'isles'
        : 'europe'
      : { SAM: 'sam', NAM: 'nam', ASIA: 'asia', AFR: 'africa' }[r] || 'world';
  };
  // An equirectangular map as SVG. pts: [{ id, lat, lon, color, r, ring, act }]; labels: [{ text, lat, lon }]. A tap on a dot runs `act`.
  UI.mapSvg = function (pts, regionKey, opts = {}) {
    const [, [w, s, e, n]] = UI.MAP_REGIONS[regionKey] || UI.MAP_REGIONS.world;
    const cos = Math.cos((((s + n) / 2) * Math.PI) / 180);
    const X = (lon) => (lon - w) * cos,
      Y = (lat) => n - lat;
    const vw = (e - w) * cos,
      vh = n - s,
      u = Math.max(vw, vh) / (opts.dots || 190);
    let g = '';
    const step = vw > 150 ? 30 : vw > 40 ? 10 : 5;
    for (let lon = Math.ceil(w / step) * step; lon <= e; lon += step)
      g += `<line x1="${X(lon)}" y1="0" x2="${X(lon)}" y2="${vh}"/>`;
    for (let lat = Math.ceil(s / step) * step; lat <= n; lat += step)
      g += `<line x1="0" y1="${Y(lat)}" x2="${vw}" y2="${Y(lat)}"/>`;
    const dots = pts
      .filter((p) => p.lon >= w && p.lon <= e && p.lat >= s && p.lat <= n)
      .map((p) => {
        const r = (p.r || 1) * u;
        return `<circle cx="${X(p.lon).toFixed(2)}" cy="${Y(p.lat).toFixed(2)}" r="${r.toFixed(2)}" fill="${p.color || 'var(--acc)'}" ${p.ring ? `stroke="${p.ring}" stroke-width="${(u * 0.7).toFixed(2)}"` : ''} ${p.act ? `data-act="${p.act}" data-id="${esc(p.id)}" style="cursor:pointer"` : ''}/>`;
      })
      .join('');
    const labels = (opts.labels || [])
      .filter((p) => p.lon >= w && p.lon <= e && p.lat >= s && p.lat <= n)
      .map(
        (p) =>
          `<text x="${X(p.lon).toFixed(2)}" y="${Y(p.lat).toFixed(2)}" font-size="${(u * 3.6).toFixed(2)}" text-anchor="middle" fill="var(--ink3)" opacity=".75" style="pointer-events:none">${esc(p.text)}</text>`,
      )
      .join('');
    return `<svg viewBox="0 0 ${vw.toFixed(1)} ${vh.toFixed(1)}" style="width:100%;height:auto;aspect-ratio:${vw.toFixed(1)}/${vh.toFixed(1)};max-height:70vh;flex:none;display:block;background:var(--card2);border-radius:14px" role="img" aria-label="Map"><g stroke="var(--line)" stroke-width="${(u * 0.18).toFixed(2)}" opacity=".7">${g}</g>${labels}${dots}</svg>`;
  };
  const natLabels = (region) => {
    const [, [w, s, e, n]] = UI.MAP_REGIONS[region];
    const by = {};
    for (const c of Object.values(S().clubs)) {
      if (!c.comp || c.sim === 'nation') continue;
      const p = L().place(c);
      if (p) (by[c.nat] = by[c.nat] || []).push(p);
    }
    return Object.entries(by)
      .map(([nat, ps]) => ({
        text: D.NATIONS[nat] ? D.NATIONS[nat].name : nat,
        lat: ps.reduce((t, p) => t + p[0], 0) / ps.length,
        lon: ps.reduce((t, p) => t + p[1], 0) / ps.length,
      }))
      .filter((p) => p.lon >= w && p.lon <= e && p.lat >= s && p.lat <= n);
  };
  UI._map = UI._map || { region: null, sel: null };
  UI.acts.mapRegion = (d) => {
    UI._map.region = d.v;
    UI._map.sel = null;
    UI.render();
  };
  UI.acts.mapPick = (d) => {
    UI._map.sel = d.id;
    UI.render();
  };
  UI.mapView = function () {
    const st = S(),
      me = W.userClub(),
      m = UI._map;
    if (!m.region) m.region = me ? UI.mapRegionOf(me.nat) : 'world';
    const clubs = Object.values(st.clubs).filter((c) => c.comp && c.sim !== 'nation' && !c.parent);
    const sel = m.sel && st.clubs[m.sel];
    const sameLeague = sel && sel.comp;
    const pts = clubs.map((c) => {
      const p = L().place(c),
        tier = (st.comps[c.comp] || {}).tier || 3;
      return {
        id: c.id,
        lat: p[0],
        lon: p[1],
        color: tier === 1 ? 'var(--acc)' : tier === 2 ? '#5aa9ff' : 'var(--ink3)',
        r: me && c.id === me.id ? 1.9 : sel && c.id === sel.id ? 1.9 : tier === 1 ? 1.15 : 0.85,
        ring:
          me && c.id === me.id
            ? 'var(--good)'
            : sel && c.id === sel.id
              ? '#fff'
              : sel && sameLeague && c.comp === sel.comp
                ? 'var(--warn, #ffb347)'
                : null,
        act: 'mapPick',
      };
    });
    const chips = Object.entries(UI.MAP_REGIONS)
      .map(
        ([k, [name]]) =>
          `<button class="chip ${m.region === k ? 'on' : ''}" data-act="mapRegion" data-v="${k}">${name}</button>`,
      )
      .join('');
    // the picked club, and the ten nearest to the manager's own
    let card = '';
    if (sel) {
      const comp = st.comps[sel.comp];
      const kmv = me ? L().km(me, sel) : 0;
      card = `<div class="card"><div class="row" style="gap:10px">${C.crest(sel, 40)}<div class="grow"><div class="b">${esc(sel.name)}</div><div class="tiny dim">${C.flag(sel.nat)} ${esc(comp ? comp.name : '')} · ${esc(sel.city || '')}</div></div><button class="btn sm" data-act="clubView" data-id="${sel.id}">Open</button></div>
        ${me && sel.id !== me.id ? `<div class="small" style="margin-top:8px">${km(kmv)} km from ${esc(me.name)}${kmv >= 25 ? ` · away trip: ${esc(L().tripText(sel.id, me.id))}` : ' · a short trip'}</div>` : ''}
        ${sel.rival && st.clubs[sel.rival] ? `<div class="tiny dim" style="margin-top:6px">⚔️ ${esc(sel.derby || 'Derby')} v ${cname(sel.rival)} · ${km(L().km(sel, sel.rival))} km</div>` : ''}</div>`;
    }
    let near = '';
    if (me) {
      const ns = L().nearest(me, 8);
      near = `<div class="card"><div class="h3">Closest to ${esc(me.name)}</div>${ns
        .map(
          (o) =>
            `<div class="row small tap" data-act="mapPick" data-id="${o.c.id}" style="padding:6px 0;border-top:1px solid var(--line)">${C.crest(o.c, 18)}<span class="grow ellip" style="margin-left:8px">${esc(o.c.name)}${me.rival === o.c.id ? ' ⚔️' : ''}</span><b>${km(o.km)} km</b></div>`,
        )
        .join('')}</div>`;
    }
    return `<div class="chips" style="flex-wrap:wrap;margin-bottom:8px">${chips}</div>
      ${UI.mapSvg(pts, m.region, { labels: natLabels(m.region), dots: m.region === 'world' ? 150 : 100 })}
      <div class="tiny dim" style="margin:6px 2px 10px"><span style="color:var(--acc)">●</span> top division · <span style="color:#5aa9ff">●</span> second · <span>●</span> lower${me ? ' · <span style="color:var(--good)">◯</span> your club' : ''}. Tap a club.</div>
      ${card}${near}`;
  };
  // Distances matter: the longest away trips of the season in your league, as a note on the table screens
  UI.travelNote = function (comp) {
    if (!L() || !comp || comp.type !== 'league' || comp.clubs.length < 2) return '';
    let far = 0,
      pair = null;
    const cs = comp.clubs.map((id) => S().clubs[id]);
    for (const a of cs)
      for (const b of cs)
        if (a.id < b.id) {
          const k = L().km(a, b);
          if (k > far) ((far = k), (pair = [a, b]));
        }
    return far >= 350
      ? `<div class="tiny dim" style="margin:0 4px 10px">✈️ The longest trip in this league: ${esc(pair[0].short)} – ${esc(pair[1].short)}, ${km(far)} km${far >= 1000 ? ' — a day of travel, and tired legs' : ''}.</div>`
      : '';
  };
})();
