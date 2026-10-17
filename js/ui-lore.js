// The world's memory on screen: honours from before the records, the club's story (motto, anthem, mascot, records, eras), the
// story of a derby, the people legends became, the history of every league and cup, and the world map with the journeys a
// season asks of a club. The data is in FM.Lore and FM.Geo (js/lore.js).
(function () {
  const FM = window.FM,
    U = FM.U,
    D = FM.D,
    W = FM.W,
    UI = FM.UI,
    C = UI.C;
  const esc = U.esc,
    S = () => FM.S,
    L = FM.Lore,
    Geo = FM.Geo;
  const row = (label, main, sub, act) =>
    `<div class="row small" style="padding:7px 0;border-top:1px solid var(--line)"><span class="dim" style="width:104px;flex:none">${label}</span><div class="grow" style="min-width:0"><div class="b ${act ? 'tap' : ''}" ${act || ''}>${main}</div>${sub ? `<div class="tiny dim">${sub}</div>` : ''}</div></div>`;
  const chipRow = (act, cur, opts) =>
    `<div class="chips" style="flex-wrap:wrap">${opts.map(([v, l]) => `<button class="chip ${String(cur) === String(v) ? 'on' : ''}" data-act="${act}" data-v="${v}">${l}</button>`).join('')}</div>`;
  const clubName = (code) => esc(L.name(code));

  // ======================= The club's kind =======================
  // A military club, a works side, a university, a reserve team: what it is and what that means
  UI.kindCard = function (c) {
    const k = L.kindNote(c);
    if (!k) return '';
    return `<div class="card"><div class="row" style="gap:8px"><span style="font-size:22px">${k.icon}</span><div class="h3 grow">${esc(k.label)}</div></div><div class="small muted" style="margin-top:6px;line-height:1.5">${esc(k.text)}</div></div>`;
  };

  // ======================= Before the records =======================
  // Honours from the years before the save's first season: league titles, cup wins, seasons in the top flight, the best decade
  // and the club's named eras, with the save's own titles added to the eras
  UI.pastCard = function (c) {
    const g = L.pastGlory(c);
    if (!g) return '';
    const eras = L.eras(c);
    const rec = L.canon().y1;
    const lines = [];
    if (g.titles.length) lines.push(['🏆', 'League champions', L.yearsText(g.titles, 12)]);
    if (g.cups.length) lines.push(['🏅', 'Cup winners', L.yearsText(g.cups, 12)]);
    if (g.topFlight)
      lines.push(['📈', 'Top flight', `${g.topFlight} season${g.topFlight === 1 ? '' : 's'} before ${rec}`]);
    if (g.decade && g.titles.length) lines.push(['⭐', 'Best decade', `The ${g.decade}s`]);
    if (!lines.length)
      return `<div class="card"><div class="h3">Before the records</div><div class="small dim" style="margin-top:6px">${c.founded ? `Founded in ${c.founded}; ` : ''}no title or cup before ${rec}. The story starts here.</div></div>`;
    return `<div class="card"><div class="row"><div class="h3 grow">Before the records</div><span class="tiny dim">${g.from}–${rec - 1}</span></div>
      ${lines.map(([i, l, v]) => `<div class="row small" style="margin-top:8px;align-items:flex-start"><span>${i}</span><span class="dim" style="width:104px;flex:none">${l}</span><b class="grow">${esc(v)}</b></div>`).join('')}
      ${eras.length ? `<div class="small b dim" style="margin:12px 0 2px">NAMED ERAS</div>${eras.map((e) => `<div class="row small" style="padding:5px 0;border-top:1px solid var(--line)"><span class="grow">${esc(e.name)}</span><span class="dim">${e.from}–${e.to}</span></div>`).join('')}` : ''}</div>`;
  };

  // ======================= The club's story =======================
  UI.storyCard = function (c) {
    const k = L.of(c);
    if (!k) return '';
    const crowd = L.recordCrowd(c);
    const p = L.peopleOf(c);
    const fam = L.famousLine(c);
    const rows = [
      row('Motto', `“${esc(k.motto)}”`),
      row('Anthem', esc(k.anthem)),
      row('Mascot', esc(k.mascot)),
      row('Ground', `${esc(c.stadium.name)} <span class="dim">· “${esc(k.gnick)}”</span>`),
      crowd
        ? row(
            'Record crowd',
            `${crowd.n.toLocaleString()}`,
            `${crowd.y}${crowd.opp ? ` · v ${clubName(crowd.opp)}` : ''}`,
          )
        : '',
      fam ? row('Most famous match', esc(fam)) : '',
      p.chairman ? row('Chairman', esc(p.chairman.name), `${esc(p.chairman.era)} · ${esc(p.chairman.note)}`) : '',
      p.ambassador
        ? row('Ambassador', esc(p.ambassador.name), `${esc(p.ambassador.era)} · ${esc(p.ambassador.note)}`)
        : '',
    ].join('');
    return `<div class="card"><div class="h3">Club story</div>${rows}</div>`;
  };

  // The club's legends of the past, with what they are now
  UI.pastLegendsCard = function (c) {
    if (!c.legends || !c.legends.length) return '';
    return `<div class="card"><div class="h3">Legends of the past</div>${c.legends
      .map(
        (l) =>
          `<div class="row small" style="padding:7px 0;border-top:1px solid var(--line);align-items:flex-start"><span>${C.flag(l.nat)}</span><div class="grow" style="min-width:0"><div class="b">${esc(l.name)} <span class="tiny dim">${esc(l.pos)} · ${esc(l.era)}</span></div><div class="tiny dim">${esc(l.note)}${l.now ? ` · <b style="color:var(--acc2)">${esc(L.nowText(l))}</b>` : ''}</div></div><span class="tiny dim">${l.apps} games<br>${l.goals} goals</span></div>`,
      )
      .join('')}</div>`;
  };

  // ======================= A derby's story =======================
  UI.rivalryCard = function (c) {
    const rv = c.rival && S().clubs[c.rival];
    if (!rv) return '';
    const r = L.rivalry(c, rv),
      rec = L.record(c, rv);
    if (!r)
      return `<div class="card"><div class="h3">${esc(c.derby || 'Rivalry')}</div><div class="small dim" style="margin-top:6px">The rivalry with ${esc(rv.name)} has no recorded history yet.</div></div>`;
    const best = r.best;
    const winner = best.w === c.id.slice(2) ? c.name : rv.name;
    const last = (r.since.last || [])
      .map(([y, a, hg, ag]) => `${y}: ${clubName(a)} ${hg}–${ag} ${clubName(a === r.a ? r.b : r.a)}`)
      .slice(0, 3);
    const km = Geo.km(c, rv);
    return `<div class="card"><div class="row"><div class="h3 grow">⚔️ ${esc(r.name)}</div>${km != null ? `<span class="tiny dim">${esc(Geo.label(km))} apart</span>` : ''}</div>
      <div class="small muted" style="margin-top:6px;line-height:1.5">${esc(r.text)}.</div>
      ${rec ? `<div class="row small" style="margin-top:10px;gap:6px;text-align:center"><div class="grow card flat" style="margin:0"><div class="b">${rec.w}</div><div class="tiny dim">${esc(c.short)} wins</div></div><div class="grow card flat" style="margin:0"><div class="b">${rec.d}</div><div class="tiny dim">Drawn</div></div><div class="grow card flat" style="margin:0"><div class="b">${rec.l}</div><div class="tiny dim">${esc(rv.short)} wins</div></div></div><div class="tiny dim" style="margin-top:4px;text-align:center">${rec.n} meetings, all competitions</div>` : ''}
      <div class="tiny dim" style="margin-top:8px">Biggest win: ${esc(winner)} ${best.gf}–${best.ga}, ${best.y}</div>
      ${last.length ? `<div class="small b dim" style="margin:10px 0 2px">SINCE THE SAVE BEGAN</div>${last.map((t) => `<div class="tiny dim">${esc(t)}</div>`).join('')}` : ''}</div>`;
  };

  // ======================= Honours: the recorded titles plus the past =======================
  const origHonours = UI.honoursCard;
  UI.honoursCard = function (c, none) {
    const html = origHonours(c, none);
    // (the recorded honours, then the years before them)
    return html + UI.pastCard(c);
  };

  // ======================= The club page and the club sheet =======================
  // Everything lore adds to a club's page, in one block
  UI.loreBlock = function (c) {
    return [UI.kindCard(c), UI.rivalryCard(c), UI.storyCard(c), UI.pastLegendsCard(c)].join('');
  };
  // ======================= League and cup histories =======================
  UI.historyView = function () {
    const s = S(),
      me = W.userClub();
    const comps = [];
    const add = (id) => id && s.comps[id] && !comps.includes(id) && comps.push(id);
    add(me && me.comp);
    Object.values(s.comps)
      .filter((x) => x.nat && me && x.nat === me.nat && x.type === 'league')
      .forEach((x) => add(x.id));
    Object.values(s.comps)
      .filter((x) => x.type === 'cup' && me && x.nat === me.nat)
      .forEach((x) => add(x.id));
    Object.values(s.comps)
      .filter((x) => x.type === 'regional' && me && x.clubs && x.clubs.includes(me.id))
      .forEach((x) => add(x.id));
    Object.values(s.comps)
      .filter((x) => x.type === 'continental' || x.type === 'world')
      .forEach((x) => add(x.id));
    const oldest = L.canon().oldest;
    add(oldest);
    const cur = comps.includes(UI.sub.hist) ? UI.sub.hist : comps[0];
    const h = L.compHistory(cur),
      comp = s.comps[cur];
    const picker = `<div class="chips" style="flex-wrap:wrap">${comps
      .map(
        (id) =>
          `<button class="chip ${cur === id ? 'on' : ''}" data-act="histPick" data-v="${id}">${esc(s.comps[id].short || s.comps[id].name)}</button>`,
      )
      .join('')}</div>`;
    if (!h || !comp) return `${picker}<div class="empty">No history for this competition.</div>`;
    const hon = L.compHonours(cur);
    const first = hon && hon.first;
    const noun = h.kind === 'league' ? 'champions' : 'winners';
    return `${picker}
      <div class="card"><div class="row"><div class="h3 grow">${esc(comp.name)}</div>${h.oldest ? '<span class="pill acc">Oldest cup</span>' : ''}</div>
        <div class="small muted" style="margin-top:6px;line-height:1.5">Founded in ${h.founded}. The trophy is ${esc(h.trophy)}, gifted by ${esc(h.founder)}.${h.oldest ? ' It is the oldest cup in the world.' : ''}</div>
        ${first ? `<div class="row small" style="margin-top:8px"><span class="grow dim">First ${noun}</span><b>${clubName(first.code)} · ${first.y}</b></div>` : ''}</div>
      <div class="card"><div class="h3">How it changed</div>${h.notes.map(([y, t]) => `<div class="row small" style="padding:6px 0;border-top:1px solid var(--line)"><span class="dim" style="width:44px;flex:none">${y}</span><span class="grow">${esc(t)}</span></div>`).join('')}</div>
      ${hon && hon.most.length ? `<div class="card"><div class="h3">Most ${noun === 'champions' ? 'titles' : 'wins'}</div>${hon.most.map((m, i) => `<div class="row small" style="padding:6px 0;border-top:1px solid var(--line)"><span class="dim" style="width:18px">${i + 1}</span><span class="grow">${esc(m.name)}</span><b>${m.n}</b></div>`).join('')}</div>` : ''}
      ${h.shocks && h.shocks.length ? `<div class="card"><div class="h3">Famous giant-killings</div>${h.shocks.map((x) => `<div class="row small" style="padding:6px 0;border-top:1px solid var(--line)"><span class="dim" style="width:44px;flex:none">${x.y}</span><span class="grow">${esc(x.text)}</span></div>`).join('')}</div>` : ''}`;
  };
  UI.acts.histPick = (d) => {
    UI.sub.hist = d.v;
    UI.render();
  };

  // ======================= The world map =======================
  // An equirectangular map of the clubs of a region (every club sits on the real town's coordinates), with your club ringed, its
  // rival linked and the season's journeys listed underneath
  UI.mapView = function () {
    const s = S(),
      me = W.userClub();
    const region = UI.sub.mapRegion || (me && Geo.regionOf(me.nat)) || 'all';
    const nats = region === 'all' ? null : Geo.regionNats(region);
    const clubs = Object.values(s.clubs).filter(
      (c) => c.comp && c.sim !== 'nation' && !c.parent && Geo.of(c) && (!nats || nats.includes(c.nat)),
    );
    const chips = chipRow('mapRegion', region, [['all', '🌍 World'], ...D.GEO_REGIONS.map(([id, n]) => [id, n])]);
    if (!clubs.length) return `${chips}<div class="empty">No clubs in this region.</div>`;
    const pts = clubs.map((c) => Geo.of(c));
    const lat0 = Math.min(...pts.map((p) => p[0])) - 1.5,
      lat1 = Math.max(...pts.map((p) => p[0])) + 1.5,
      lon0 = Math.min(...pts.map((p) => p[1])) - 1.5,
      lon1 = Math.max(...pts.map((p) => p[1])) + 1.5;
    const kx = Math.cos((((lat0 + lat1) / 2) * Math.PI) / 180);
    const Wd = 340;
    const scale = Wd / ((lon1 - lon0) * kx);
    const Ht = Math.min(520, Math.max(150, (lat1 - lat0) * scale));
    const sc = Math.min(scale, Ht / (lat1 - lat0));
    const px = (p) => [(p[1] - lon0) * kx * sc + (Wd - (lon1 - lon0) * kx * sc) / 2, (lat1 - p[0]) * sc];
    const step = region === 'all' ? 30 : lat1 - lat0 < 12 ? 2 : 5;
    let grid = '';
    for (let la = Math.ceil(lat0 / step) * step; la < lat1; la += step)
      grid += `<line x1="0" x2="${Wd}" y1="${px([la, lon0])[1].toFixed(1)}" y2="${px([la, lon0])[1].toFixed(1)}" stroke="var(--line)" stroke-width=".5"/>`;
    for (let lo = Math.ceil(lon0 / step) * step; lo < lon1; lo += step)
      grid += `<line y1="0" y2="${Ht}" x1="${px([lat0, lo])[0].toFixed(1)}" x2="${px([lat0, lo])[0].toFixed(1)}" stroke="var(--line)" stroke-width=".5"/>`;
    const rv = me && me.rival && s.clubs[me.rival];
    const dots = clubs
      .slice()
      .sort(
        (a, b) =>
          (b.comp && s.comps[b.comp] ? s.comps[b.comp].tier : 9) -
          (a.comp && s.comps[a.comp] ? s.comps[a.comp].tier : 9),
      )
      .map((c) => {
        const [x, y] = px(Geo.of(c)),
          tier = (s.comps[c.comp] || {}).tier || 3;
        const r = tier === 1 ? 3.6 : tier === 2 ? 2.8 : 2.2;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${c.colors[0]}" stroke="${c.colors[1]}" stroke-width=".7"><title>${esc(c.name)}</title></circle><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="transparent" data-act="clubView" data-id="${c.id}"/>`;
      })
      .join('');
    let mine = '';
    if (me && Geo.of(me) && clubs.includes(me)) {
      const [x, y] = px(Geo.of(me));
      if (rv && Geo.of(rv) && clubs.includes(rv)) {
        const [x2, y2] = px(Geo.of(rv));
        mine += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--bad)" stroke-width="1" stroke-dasharray="3 2"/><circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="6" fill="none" stroke="var(--bad)" stroke-width="1.2"/>`;
      }
      mine += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="none" stroke="var(--acc)" stroke-width="2"/>`;
    }
    const svg = `<svg viewBox="0 0 ${Wd} ${Ht.toFixed(0)}" width="100%" style="display:block;background:var(--card);border-radius:14px" role="img" aria-label="Map of the clubs in this region">${grid}${mine}${dots}</svg>`;
    return `${chips}<div style="margin:10px 0">${svg}</div>
      <div class="tiny dim" style="margin:0 2px 10px">${clubs.length} clubs. Bigger dots are top-flight clubs; your club is ringed${rv ? ' and its rival marked in red' : ''}. Tap a dot for the club.</div>
      ${UI.journeysCard()}`;
  };
  UI.acts.mapRegion = (d) => {
    UI.sub.mapRegion = d.v;
    UI.render();
  };

  // The season's journeys for your club: the longest away trips, the distance and the bill, and who is near
  UI.journeysCard = function () {
    const s = S(),
      me = W.userClub();
    if (!me || !Geo.of(me)) return '';
    const comp = s.comps[me.comp];
    const opp = ((comp && comp.clubs) || []).map((id) => s.clubs[id]).filter((c) => c && c.id !== me.id && Geo.of(c));
    const trips = opp.map((c) => ({ c, km: Geo.km(me, c) })).sort((a, b) => b.km - a.km);
    const total = U.sum(trips, (t) => t.km),
      cost = U.sum(trips, (t) => Geo.cost(t.km, me));
    const near = Geo.nearest(me, 4);
    const trip = (t) =>
      `<div class="row small tap" style="padding:6px 0;border-top:1px solid var(--line)" data-act="clubView" data-id="${t.c.id}"><span class="grow ellip">${esc(t.c.name)}</span><span class="dim">${esc(Geo.label(t.km))}</span><b style="width:70px;text-align:right">${t.km >= 150 ? U.money(Geo.cost(t.km, me)) : '—'}</b></div>`;
    return `<div class="card"><div class="h3">Your journeys</div>
        <div class="small muted" style="margin-top:4px;line-height:1.5">${trips.length ? `Away trips in the league add up to ${total.toLocaleString()} km and about ${U.money(cost)} in coaches and flights. Past 300 km the visitors arrive tired (the longest trips cost a few points of stamina), and the home crowd gets louder.` : 'No league fixtures to travel to.'}</div>
        ${trips.length ? `<div class="small b dim" style="margin:10px 0 2px">LONGEST AWAY TRIPS</div>${trips.slice(0, 5).map(trip).join('')}` : ''}
        ${near.length ? `<div class="small b dim" style="margin:12px 0 2px">NEAREST CLUBS</div>${near.map((n) => `<div class="row small tap" style="padding:6px 0;border-top:1px solid var(--line)" data-act="clubView" data-id="${n.c.id}"><span class="grow ellip">${esc(n.c.name)}</span><span class="dim">${esc(Geo.label(n.km))}</span></div>`).join('')}` : ''}</div>`;
  };

  // The journey to a fixture, as a short line ("away trip 1,240 km"), for the match preview
  UI.tripText = function (fx) {
    if (!fx || fx.neutral) return '';
    const h = S().clubs[fx.h],
      a = S().clubs[fx.a];
    const km = Geo.km(h, a);
    if (km == null || km < 150) return '';
    return `${esc(a.name)} travel ${km.toLocaleString()} km${km >= 500 ? ` — a long way, and the legs will feel it` : ''}`;
  };
})();
