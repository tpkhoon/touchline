// The Academy tab's youth sides and B team: U21 and U18 squads with their league positions, the B team (when the
// club has one) and moving players between them and the first team.
(function () {
  const FM = window.FM,
    UI = FM.UI,
    U = FM.U,
    W = FM.W,
    C = UI.C,
    Y = FM.Youth;
  const S = () => FM.S;
  const esc = U.esc;

  const btn = (id, to, label) =>
    `<button class="btn sm" style="padding:4px 8px" data-act="youthMove" data-id="${id}" data-v="${to}">${label}</button>`;
  const leagueLine = (c, team) => {
    const t = Y.table(c.nat, team),
      i = t.findIndex((r) => r.id === c.id),
      lg = S().youth && S().youth[c.nat] && S().youth[c.nat][team],
      last = lg && lg.last[c.id],
      opp = last && S().clubs[last.opp];
    return i < 0
      ? '<span class="tiny dim">Youth league starts with the season</span>'
      : `<span class="tiny dim">${U.ordinal(i + 1)} of ${t.length} · ${U.pts(t[i].pts)}${last && opp ? ` · last: ${last.gf}–${last.ga} ${last.home ? 'v' : 'at'} ${esc(opp.name)}` : ''}</span>`;
  };
  // ---------- Pathways: one card for each youngster ----------
  // Where he is, what comes next, and who is in his way. The player to beat is the weakest regular of his position in the first team (the
  // places the formation has for it); the time to get there is the gap in ability over what he is likely to grow in a year.
  UI.youthPathway = function (c, p, where) {
    const T = S().user.tactic,
      D = FM.D;
    const slots = (D.FORMATIONS[T.formation] || []).filter((x) => x.t === p.pos).length || 1;
    const same = W.squad(c.id)
      .filter((q) => !q.team && !q.loan && q.pos === p.pos && q.id !== p.id)
      .sort((a, b) => b.ca - a.ca);
    const gate = same[Math.min(slots, same.length) - 1] || null;
    const age = W.age(p),
      growth = Math.max(0.6, (p.pa - p.ca) / Math.max(1, 25 - age));
    const gap = gate ? gate.ca - p.ca : 0;
    const out = { where, next: '', blocker: '', tone: '' };
    if (!gate) {
      out.next = `No one ahead of him at ${p.pos}: ready to play as soon as he is picked`;
      out.tone = 'good';
    } else if (gap <= 0) {
      out.next = 'Good enough for the first team now';
      out.tone = 'good';
    } else if (p.pa < gate.ca - 1) {
      out.next = `Unlikely to get past ${W.short(gate)} here: a loan or a sale would suit him`;
      out.tone = 'bad';
      out.blocker = gate;
    } else {
      const years = gap / growth;
      out.next =
        years <= 1
          ? 'Ready for first-team minutes in about a year'
          : years <= 2.5
            ? 'About two years from the first team'
            : `About ${U.plural(Math.round(years), 'year')} from the first team`;
      out.tone = years <= 1 ? 'good' : '';
      out.blocker = gate;
    }
    if (out.blocker) {
      const g = out.blocker,
        yrsLeft = g.contract - S().year;
      out.blockNote = `${W.short(g)} (${W.age(g)})${W.age(g) >= 31 ? ', who will need replacing soon' : yrsLeft <= 0 ? ', whose contract ends this season' : yrsLeft === 1 ? ', whose contract ends next season' : ''}`;
    }
    return out;
  };
  UI.youthHub = function (c) {
    const list = [];
    for (const [team, def] of Object.entries(Y.TEAMS))
      for (const p of Y.squadOf(c.id, team)) list.push([p, def.label, team]);
    for (const p of W.squad(c.id))
      if (!p.team && !p.loan && W.age(p) <= 21) list.push([p, 'First-team squad', 'first']);
    const b = Y.bTeamOf(c.id);
    if (b) for (const p of W.squad(b.id)) if (!p.loan && W.age(p) <= 21) list.push([p, 'B team', 'b']);
    for (const p of Object.values(S().players))
      if (p.loan && p.loan.from === c.id && !p.retired && W.age(p) <= 21)
        list.push([p, `On loan at ${S().clubs[p.clubId] ? S().clubs[p.clubId].name : 'another club'}`, 'loan']);
    if (!list.length) return '';
    list.sort((x, y) => y[0].pa - x[0].pa);
    const cards = list.slice(0, 12).map(([p, where, team]) => {
      const w = UI.youthPathway(c, p, where);
      const moves =
        team === 'u21'
          ? btn(p.id, 'first', '↑ First team') + btn(p.id, 'u18', '↓ U18')
          : team === 'u18'
            ? btn(p.id, 'first', '↑ First team') + btn(p.id, 'u21', '↑ U21')
            : team === 'first'
              ? btn(p.id, W.age(p) <= 18 ? 'u18' : 'u21', W.age(p) <= 18 ? '↓ U18' : '↓ U21')
              : '';
      const line = (t, tone) =>
        `<div class="tiny" style="margin-top:3px;${tone ? `color:var(--${tone})` : 'opacity:.8'}">${esc(t)}</div>`;
      return `<div style="padding-bottom:6px">${C.playerRow(p, ` · ${esc(where)}${p.season.apps ? ` · ${U.plural(p.season.apps, 'game')}` : ''}`)}<div style="margin:0 0 4px 4px">${line(w.next, w.tone)}${w.blocker ? line(`Blocked by ${w.blockNote}`, '') : ''}${moves ? `<div class="row" style="gap:4px;margin-top:6px">${moves}</div>` : ''}</div></div>`;
    });
    return `<div class="sec"><div class="h3">Pathways</div></div>
      <div class="tiny dim" style="margin:-4px 2px 6px">Your most promising youngsters: where each is, what comes next and who is in his way. The player to beat is the weakest regular in his position; the time is the gap in ability over what he should grow in a year.</div>
      <div class="card flat list" style="padding:4px 12px">${cards.join('')}${list.length > 12 ? `<div class="tiny dim" style="padding:6px 0">and ${list.length - 12} more in the lists below</div>` : ''}</div>`;
  };
  UI.youthSides = function (c) {
    const out = [];
    for (const [team, def] of Object.entries(Y.TEAMS)) {
      const sq = Y.squadOf(c.id, team).sort((a, b) => b.pa - a.pa);
      out.push(`<div class="sec"><div class="h3">${esc(def.label)}</div>${leagueLine(c, team)}</div>
        <div class="card flat list" style="padding:4px 12px">${
          sq
            .map((p) =>
              C.playerRow(
                p,
                p.season.yapps ? ` · ${p.season.yapps} youth games` : '',
                `<div class="row" style="gap:4px;margin-top:4px">${btn(p.id, 'first', '↑ First team')}${btn(p.id, team === 'u21' ? 'u18' : 'u21', team === 'u21' ? '↓ U18' : '↑ U21')}</div>`,
              ),
            )
            .join('') || `<div class="empty">Nobody in the ${esc(def.label)} squad.</div>`
        }</div>`);
    }
    // young first-team players who could get games in the youth sides
    const young = W.squad(c.id).filter((p) => !p.team && !p.loan && W.age(p) <= 21);
    if (young.length)
      out.push(`<div class="sec"><div class="h3">Young players in the first-team squad</div></div>
        <div class="card flat list" style="padding:4px 12px">${young
          .map((p) =>
            C.playerRow(
              p,
              ` · ${p.season.apps} apps`,
              `<div class="row" style="gap:4px;margin-top:4px">${btn(p.id, W.age(p) <= 18 ? 'u18' : 'u21', W.age(p) <= 18 ? '↓ U18' : '↓ U21')}</div>`,
            ),
          )
          .join('')}</div>`);
    // the B team
    const b = Y.bTeamOf(c.id);
    if (b) {
      const comp = S().comps[b.comp],
        pos = comp && comp.table && comp.table[b.id] ? W.position(b.id) : null;
      const bs = W.squad(b.id)
        .filter((p) => !p.loan)
        .sort((a, x) => x.ca - a.ca);
      out.push(`<div class="sec"><div class="h3">B team · ${esc(b.name)}</div><span class="tiny dim">${comp ? `${esc(comp.name)}${pos ? ` · ${U.ordinal(pos)}` : ''}` : ''}</span></div>
        <div class="tiny dim" style="margin:-4px 2px 6px">Your players, on your wages: move them between the two any time. A B team can never go up into your division.</div>
        <div class="card flat list" style="padding:4px 12px">${bs
          .map((p) =>
            C.playerRow(
              p,
              ` · ${p.season.apps} apps`,
              `<div class="row" style="gap:4px;margin-top:4px">${btn(p.id, 'up', '↑ First team')}</div>`,
            ),
          )
          .join('')}</div>`);
      const spare = W.squad(c.id).filter((p) => !p.loan && !p.team && W.age(p) <= 23);
      if (spare.length)
        out.push(
          `<div class="tiny dim" style="margin:6px 2px">Send down to ${esc(b.name)}: ${spare
            .slice(0, 12)
            .map(
              (p) =>
                `<button class="chip" data-act="youthMove" data-id="${p.id}" data-v="b">${esc(W.short(p))}</button>`,
            )
            .join(' ')}</div>`,
        );
    }
    return out.join('');
  };
  UI.acts.youthMove = (d) => {
    const s = S(),
      p = s.players[d.id],
      c = W.userClub();
    if (!p || !c) return;
    if (d.v === 'b') {
      const b = Y.bTeamOf(c.id);
      if (b) Y.move(p, b.id);
    } else if (d.v === 'up') Y.move(p, c.id);
    else {
      p.team = d.v === 'first' ? undefined : d.v;
      if (s.user.tactic.lineup && p.team)
        s.user.tactic.lineup = s.user.tactic.lineup.map((x) => (x === p.id ? null : x));
    }
    p.teamSet = true;
    UI.save();
    UI.render();
  };
})();
