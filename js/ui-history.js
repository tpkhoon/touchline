// Looking back: the Archive's seasons open into their leagues, cups and tournaments (tables, rounds, every tie), a competition
// can be followed year by year, and any match that was kept opens as a report. The data is FM.History (js/history.js).
(function () {
  const FM = window.FM,
    U = FM.U,
    W = FM.W,
    UI = FM.UI,
    C = UI.C;
  const esc = U.esc,
    S = () => FM.S,
    P = (id) => S().players[id],
    CL = (id) => S().clubs[id],
    NT = (id) => S().nteams && S().nteams[id];
  const H = () => FM.History;

  const entryOf = (y) => (S().archive || []).find((e) => e.year === y);
  const isTourn = (e, id) => (e.tourns || []).some((t) => t.id === id);

  // a side's name and badge: a club's crest, or a national team's flag
  const side = (id, nat) => {
    const x = nat ? NT(id) : CL(id);
    if (!x) return { name: '?', mark: '' };
    return { name: x.name, mark: nat ? C.flag(x.code) : C.crest(x, 18) };
  };

  const label = (m) => {
    if (m.group) return `Group ${m.group}`;
    if (m.po) return m.po.split(' · ')[0];
    return m.round !== undefined ? `Round ${m.round + 1}` : 'Match';
  };

  const line = (m, y, comp, nat) => {
    const r = m.res,
      h = side(m.h, nat),
      a = side(m.a, nat),
      user = (id) => !nat && W.isUser(id);
    const sub = [
      r.agg ? `agg ${r.agg[0]}–${r.agg[1]}` : '',
      r.pens ? `pens ${r.pens[0]}–${r.pens[1]}` : '',
      m.po && /leg/.test(m.po) ? m.po.split(' · ').slice(1).join(' · ') : '',
    ].filter(Boolean);
    return `<div class="tap" data-act="histMatch" data-y="${y}" data-c="${esc(comp)}" data-id="${m.id}" style="border-top:1px solid var(--line);padding:8px 0;min-height:44px"><div class="row small"><span class="grow ellip" style="text-align:right;${user(m.h) ? 'font-weight:800' : ''}">${esc(h.name)}</span>${h.mark}<b style="min-width:44px;text-align:center">${r.hg}–${r.ag}</b>${a.mark}<span class="grow ellip" style="${user(m.a) ? 'font-weight:800' : ''}">${esc(a.name)}</span></div>${sub.length ? `<div class="tiny dim center">${esc(sub.join(' · '))}</div>` : ''}</div>`;
  };

  // matches under their round or stage, in the order they were played
  const rounds = (ms) => {
    const groups = new Map();
    for (const m of ms) {
      const k = label(m);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(m);
    }
    const arr = [...groups.entries()];
    const day = (g) => Math.min(...g[1].map((m) => (m.day === undefined ? Infinity : m.day)));
    if (arr.every((g) => day(g) !== Infinity)) arr.sort((p, q) => day(p) - day(q));
    // (qualifying rounds are listed after the finals in the fixture lists, but come first)
    const pre = arr.filter(([k]) => /qualif|preliminary/i.test(k));
    return pre.concat(arr.filter((g) => !pre.includes(g)));
  };

  const matchList = (ms, y, comp, nat, open) =>
    rounds(ms)
      .map(
        ([k, g], i, all) =>
          `<details class="card flat" style="padding:4px 12px" ${open || i === all.length - 1 ? 'open' : ''}><summary class="row" style="min-height:44px"><span class="h3 grow">${esc(k)}</span><span class="tiny dim">${U.plural(g.length, 'match', 'matches')}</span></summary>${g.map((m) => line(m, y, comp, nat)).join('')}</details>`,
      )
      .join('');

  const table = (rows, nat) =>
    `<div class="card flat" style="padding:6px 10px"><table class="t"><tr><th>#</th><th class="l">${nat ? 'Team' : 'Club'}</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr>${rows
      .map((r, i) => {
        const x = side(r.id, nat);
        return `<tr class="${!nat && W.isUser(r.id) ? 'me' : ''}"><td>${i + 1}</td><td class="l"><div class="row" style="gap:6px">${x.mark}<span class="ellip" style="max-width:130px">${esc(x.name)}</span></div></td><td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf - r.ga > 0 ? '+' : ''}${r.gf - r.ga}</td><td class="b">${r.pts}</td></tr>`;
      })
      .join('')}</table></div>`;

  const winnerRow = (title, w, ru, nat) => {
    const a = side(w, nat),
      b = ru ? side(ru, nat) : null;
    return `<div class="card"><div class="tiny dim" style="text-transform:uppercase;letter-spacing:.6px">${esc(title)}</div><div class="row" style="margin-top:6px">${a.mark}<b class="grow">${esc(a.name)}</b>${b ? `<span class="small dim">runner-up ${esc(b.name)}</span>` : ''}</div></div>`;
  };

  // ---------------------------------------------------------------- one competition in one season
  UI.histSheet = function (y, id) {
    const e = entryOf(y);
    if (!e) return UI.toast('Season no longer in the archive');
    const fx = (e.fx || {})[id] || [];
    let title, html;
    if (isTourn(e, id)) {
      const t = e.tourns.find((x) => x.id === id);
      title = `${t.name} ${e.label}`;
      const groups = t.games.filter((g) => /^group/i.test(g.po || ''));
      const ko = t.games.filter((g) => !groups.includes(g));
      html =
        (t.winner ? winnerRow(t.name, t.winner, t.runnerUp, true) : '') +
        (t.groups || [])
          .map((g) => `<div class="h3" style="margin:10px 4px 4px">Group ${esc(g.name)}</div>${table(g.table, true)}`)
          .join('') +
        (ko.length ? `<div class="sec"><div class="h3">Knockouts</div></div>${matchList(ko, y, id, true, true)}` : '') +
        (groups.length
          ? `<div class="sec"><div class="h3">Group matches</div></div>${matchList(groups, y, id, true, false)}`
          : '');
    } else if (e.comps && e.comps[id]) {
      const x = e.comps[id];
      title = `${x.name} ${e.label}`;
      const torn = (x.torneos || []).map(
        (tn) =>
          `<div class="h3" style="margin:10px 4px 4px">${esc(tn.name)}${tn.champion ? ` · ${esc(side(tn.champion).name)}` : ''}</div>${table(
            tn.table.map((r) => ({ w: 0, d: 0, l: 0, gf: r.gd, ga: 0, ...r })),
            false,
          )}`,
      );
      const league = fx.filter((m) => !m.po),
        playoffs = fx.filter((m) => m.po);
      html =
        winnerRow(x.name, x.champion, x.runnerUp, false) +
        (x.topScorer
          ? `<div class="small" style="margin:0 4px 4px">Top scorer: <b>${esc(x.topScorer.name)}</b> — ${U.plural(x.topScorer.goals, 'goal')}</div>`
          : '') +
        (x.poty
          ? `<div class="small" style="margin:0 4px 8px">Player of the Season: <b>${esc(x.poty.name)}</b> (${x.poty.avg})</div>`
          : '') +
        (torn.length ? torn.join('') : table(x.table, false)) +
        (playoffs.length
          ? `<div class="sec"><div class="h3">Play-offs</div></div>${matchList(playoffs, y, id, false, true)}`
          : '') +
        (league.length
          ? `<div class="sec"><div class="h3">Results</div></div>${matchList(league, y, id, false, false)}`
          : `<div class="tiny dim" style="margin:8px 4px">Match results are kept for your own division. This league keeps its final table.</div>`);
    } else if (e.cups && e.cups[id]) {
      const x = e.cups[id];
      title = `${x.name} ${e.label}`;
      html =
        winnerRow(x.name, x.winner, x.runnerUp, false) +
        (fx.length
          ? matchList(fx, y, id, false, true)
          : `<div class="tiny dim" style="margin:8px 4px">No ties were kept for this season.</div>`);
    } else return UI.toast('Competition not in the archive');
    UI.sheet(html, { title, full: true });
  };

  // ---------------------------------------------------------------- one kept match
  UI.acts.histMatch = (d) => {
    const e = entryOf(+d.y),
      m = e && H().match(e, d.c, d.id);
    if (!m) return UI.toast('Report no longer available');
    const nat = isTourn(e, d.c),
      r = m.res,
      sd = [side(m.h, nat), side(m.a, nat)],
      col = (k) => (nat ? null : (CL(k ? m.a : m.h) || {}).colors);
    const tag = (k) => {
      const c = col(k);
      return `<b class="ev-team" ${c ? `style="background:${c[0]};color:${U.ink(c[0])}"` : ''}>${esc(sd[k].name)}</b>`;
    };
    const who = (pid) => (P(pid) ? C.pname(P(pid)) : '<span class="dim">Unknown</span>');
    const ratings = (k) =>
      Object.entries(m.ratings || {})
        .filter(([pid]) => P(pid) && P(pid).clubId === (k ? m.a : m.h))
        .sort((p, q) => q[1] - p[1]);
    const rated = !nat && m.ratings && Object.keys(m.ratings).length;
    const crest = (k) => (nat ? `<div style="font-size:34px">${sd[k].mark}</div>` : C.crest(CL(k ? m.a : m.h), 48));
    UI.sheet(
      `<div class="center tiny dim" style="margin-bottom:6px">${esc(label(m))}</div>
      <div class="row" style="justify-content:space-around;text-align:center"><div>${crest(0)}<div class="small b">${esc(sd[0].name)}</div></div><div class="h1">${r.hg}–${r.ag}</div><div>${crest(1)}<div class="small b">${esc(sd[1].name)}</div></div></div>
      ${r.pens ? `<div class="center small dim">Penalties ${r.pens[0]}–${r.pens[1]}</div>` : ''}
      ${r.agg ? `<div class="center small b">Aggregate ${r.agg[0]}–${r.agg[1]}</div>` : ''}
      <div class="center small dim" style="margin:6px 0">${[r.xg ? `xG ${r.xg[0]} – ${r.xg[1]}` : '', r.poss ? `Possession ${r.poss[0]}% – ${r.poss[1]}%` : '', r.weather || '', r.att ? `${r.att.toLocaleString()} crowd` : ''].filter(Boolean).join(' · ')}</div>
      <div class="card flat">${(r.goals || []).map((g) => `<div class="row small" style="padding:4px 0;${g.side ? 'flex-direction:row-reverse;text-align:right' : ''}">${tag(g.side)}<b>${who(g.pid)}</b> <span class="dim">${g.min || ''}${g.pen ? ' (pen)' : ''}</span></div>`).join('') || `<div class="dim small center">${r.hg + r.ag ? 'Scorers not recorded' : 'No goals'}</div>`}</div>
      ${r.motm && P(r.motm) ? `<div class="center small" style="margin-bottom:8px">Man of the match: <b>${esc(W.short(P(r.motm)))}</b></div>` : ''}
      ${
        rated
          ? `<div class="row" style="align-items:flex-start;gap:12px">${[0, 1]
              .map(
                (k) =>
                  `<div class="grow">${ratings(k)
                    .map(
                      ([pid, rt]) =>
                        `<div class="row small" style="padding:3px 0" data-act="player" data-id="${pid}"><span class="grow ellip">${esc(W.short(P(pid)))}</span>${C.rating(rt)}</div>`,
                    )
                    .join('')}</div>`,
              )
              .join('')}</div>`
          : ''
      }
      <div class="tiny dim center" style="margin-top:10px">${esc(e.label)}</div>`,
      { title: 'Match report' },
    );
  };

  UI.acts.histComp = (d) => UI.histSheet(+d.y, d.id);
  UI.acts.arcView = (d) => {
    UI._arcView = d.v;
    UI.render();
  };
  UI.acts.arcKind = (d) => {
    UI._arcKind = d.v;
    UI._arcComp = null;
    UI.render();
  };
  UI.acts.arcComp = (d, el) => {
    UI._arcComp = el.value;
    UI.render();
  };

  // ---------------------------------------------------------------- a competition, year by year
  function byCompetition() {
    const kind = UI._arcKind || 'league',
      all = H()
        .competitions()
        .filter((o) => o.kind === kind);
    const chip = (v, l) =>
      `<button class="chip ${kind === v ? 'on' : ''}" data-act="arcKind" data-v="${v}">${l}</button>`;
    const chips = `<div class="chips">${chip('league', 'Leagues')}${chip('cup', 'Cups')}${chip('tourn', 'Tournaments')}</div>`;
    if (!all.length)
      return `${chips}<div class="empty">${kind === 'tourn' ? 'No international tournament has been played yet.' : 'Nothing here yet.'}</div>`;
    const sel = all.find((o) => o.id === UI._arcComp) || all.find((o) => o.id === (W.userClub() || {}).comp) || all[0];
    const opts = all
      .slice()
      .sort((p, q) => p.name.localeCompare(q.name))
      .map((o) => `<option value="${esc(o.id)}" ${o.id === sel.id ? 'selected' : ''}>${esc(o.name)}</option>`)
      .join('');
    const rows = sel.years
      .map((e) => {
        let w,
          ru,
          nat = false;
        if (sel.kind === 'tourn') {
          const t = e.tourns.find((x) => x.id === sel.id);
          ((w = t.winner), (ru = t.runnerUp), (nat = true));
        } else if (sel.kind === 'league') {
          const x = e.comps[sel.id];
          ((w = x.champion), (ru = x.runnerUp));
        } else {
          const x = e.cups[sel.id];
          ((w = x.winner), (ru = x.runnerUp));
        }
        const a = w ? side(w, nat) : null,
          b = ru ? side(ru, nat) : null;
        return `<div class="row small tap" data-act="histComp" data-y="${e.year}" data-id="${esc(sel.id)}" style="padding:8px 0;border-top:1px solid var(--line);min-height:44px"><span class="dim" style="width:64px">${esc(e.label)}</span>${a ? `${a.mark}<b class="grow ellip">${esc(a.name)}</b>` : '<span class="grow dim">No winner</span>'}${b ? `<span class="tiny dim ellip" style="max-width:40%">${esc(b.name)}</span>` : ''}<span class="dim">›</span></div>`;
      })
      .join('');
    return `${chips}<select data-input="arcComp" style="margin:4px 0 10px" aria-label="Competition">${opts}</select>
      <div class="card flat" style="padding:2px 12px"><div class="row" style="padding:10px 0"><div class="h3 grow">${esc(sel.name)}</div><span class="tiny dim">${U.plural(sel.years.length, 'season')}</span></div>${rows}</div>`;
  }

  // the Archive screen: seasons, or a competition year by year
  UI.archiveTabs = function (seasons) {
    if (!(S().archive || []).length) return seasons();
    const v = UI._arcView || 'seasons',
      chip = (k, l) => `<button class="chip ${v === k ? 'on' : ''}" data-act="arcView" data-v="${k}">${l}</button>`;
    return `<div class="chips">${chip('seasons', 'Seasons')}${chip('comps', 'By competition')}</div>${v === 'comps' ? byCompetition() : seasons()}`;
  };
})();
