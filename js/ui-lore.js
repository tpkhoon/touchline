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
      ? `<div class="tiny dim" style="margin:0 4px 10px">The longest trip in this league: ${esc(pair[0].short)} – ${esc(pair[1].short)}, ${km(far)} km${far >= 1000 ? ' — a day of travel, and tired legs' : ''}.</div>`
      : '';
  };
})();
