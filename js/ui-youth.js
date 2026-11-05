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
  // What the staff believe of a youngster: the middle of the range they give (the truth for a player they know fully)
  const est = (p) => {
    const v = FM.Scouting.view(p),
      mid = (r) => (r ? (r[0] + r[1]) / 2 : null);
    return v.own
      ? { ca: p.ca, pa: p.pa, sure: true }
      : { ca: mid(v.ca) ?? p.ca, pa: mid(v.pa) ?? mid(v.ca) ?? p.pa, sure: false };
  };
  UI.youthEst = est;
  UI.youthPathway = function (c, p, where) {
    const T = S().user.tactic,
      D = FM.D;
    const slots = (D.FORMATIONS[T.formation] || []).filter((x) => x.t === p.pos).length || 1;
    const same = W.squad(c.id)
      .filter((q) => !q.team && !q.loan && q.pos === p.pos && q.id !== p.id)
      .sort((a, b) => b.ca - a.ca);
    const gate = same[Math.min(slots, same.length) - 1] || null;
    const age = W.age(p),
      e = est(p),
      growth = Math.max(0.6, (e.pa - e.ca) / Math.max(1, 25 - age));
    const gap = gate ? gate.ca - e.ca : 0;
    const out = { where, next: '', blocker: '', tone: '' };
    if (!gate) {
      out.next = `No one ahead of him at ${p.pos}: ready to play as soon as he is picked`;
      out.tone = 'good';
    } else if (gap <= 0) {
      out.next = 'Good enough for the first team now';
      out.tone = 'good';
    } else if (e.pa < gate.ca - 1) {
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
    out.flag = UI.youthFlag(c, p, where, gate, gap);
    return out;
  };
  // The two flags that save scanning every row: "ready to step up" (good enough for the level above) and "needs more minutes" (a
  // prospect who is playing too little for his age and promise, in the first team or the youth sides).
  // A minutes plan for a prospect: what the manager wants for him this season. The share is of his club's league matches he should play.
  UI.PLANS = {
    regular: { label: 'Play regularly', share: 0.5 },
    cover: { label: 'Bench cover', share: 0.15 },
    loan: { label: 'Loan for minutes', share: 0.5 },
  };
  UI.youthFlag = function (c, p, where, gate, gap) {
    const age = W.age(p),
      comp = c.comp && S().comps[c.comp],
      played = comp && comp.table && comp.table[c.id] ? comp.table[c.id].p : 0;
    const ee = est(p),
      promise = ee.pa - ee.ca >= 6 && age <= 21;
    if (p.loan) {
      // out on loan: his games at the other club, against that club's matches
      const lc = S().clubs[p.clubId],
        lcomp = lc && lc.comp && S().comps[lc.comp],
        lp = lcomp && lcomp.table && lcomp.table[lc.id] ? lcomp.table[lc.id].p : 0;
      if (lp >= 8 && p.season.apps < lp * 0.3)
        return {
          key: 'minutes',
          text: `Needs more minutes: ${U.plural(p.season.apps, 'game')} in ${U.plural(lp, 'match', 'matches')} on loan, so he could be recalled or moved`,
        };
      return null;
    }
    if (p.team) {
      const sq = Y.squadOf(c.id, p.team === 'u18' ? 'u21' : 'first').map((q) => q.ca);
      if (p.team === 'u18' && sq.length) {
        const med = sq.slice().sort((a, b) => a - b)[Math.floor(sq.length / 2)];
        if (est(p).ca >= med) return { key: 'ready', text: 'Ready to step up: as good as the middle of the Under-21s' };
      }
      if (p.team === 'u21' && gate && gap <= 0)
        return { key: 'ready', text: 'Ready to step up: good enough for the first team now' };
      if (p.team === 'u21' && gate && gap <= 3 && age >= 19)
        return { key: 'ready', text: `Ready to step up soon: ${U.plural(gap, 'point')} behind ${W.short(gate)}` };
      return null;
    }
    if (where === 'B team' && gate && gap <= 0)
      return { key: 'ready', text: 'Ready to step up: good enough for the first team now' };
    const plan = UI.PLANS[p.plan];
    if (plan && where !== 'B team' && !p.team && !p.loan && age <= 23) {
      if (p.plan === 'loan')
        return {
          key: 'minutes',
          text: 'Plan: loan for minutes, and he is still here. Arrange a loan or change his plan',
        };
      if (played >= 8 && p.season.apps < played * plan.share)
        return {
          key: 'minutes',
          text: `Below plan (${plan.label.toLowerCase()}): ${U.plural(p.season.apps, 'game')} in ${U.plural(played, 'match', 'matches')}, he should play about ${Math.round(plan.share * 100)}% of them`,
        };
      return null;
    }
    if (where !== 'B team' && !p.team && !p.loan && promise && played >= 8 && p.season.apps < played * 0.25 && gap > 0)
      return {
        key: 'minutes',
        text: `Needs more minutes: ${U.plural(p.season.apps, 'game')} in ${U.plural(played, 'match', 'matches')}; a youth game or a loan would help`,
      };
    return null;
  };
  const planChips = (p) =>
    `<div class="row" style="gap:4px;margin-top:6px;flex-wrap:wrap"><span class="tiny dim" style="align-self:center">Plan</span>${Object.entries(
      UI.PLANS,
    )
      .map(
        ([k, v]) =>
          `<button class="chip${p.plan === k ? ' on' : ''}" data-act="youthPlan" data-id="${p.id}" data-v="${k}">${esc(v.label)}</button>`,
      )
      .join('')}</div>`;
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
    list.sort((x, y) => est(y[0]).pa - est(x[0]).pa);
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
      return `<div style="padding-bottom:6px">${C.playerRow(p, ` · ${esc(where)}${p.season.apps ? ` · ${U.plural(p.season.apps, 'game')}` : ''}`)}<div style="margin:0 0 4px 4px">${planChips(p)}${w.flag ? `<div class="tiny" style="margin-top:3px;font-weight:600;color:var(--${w.flag.key === 'ready' ? 'good' : 'warn'})">${esc(w.flag.text)}</div>` : ''}${line(w.next, w.tone)}${w.blocker ? line(`Blocked by ${w.blockNote}`, '') : ''}${moves ? `<div class="row" style="gap:4px;margin-top:6px">${moves}</div>` : ''}</div></div>`;
    });
    const used = Y.academyOf(c.id).length,
      places = Y.places(c);
    return `<div class="sec"><div class="h3">Pathways</div><span class="tiny dim">Academy places ${used} of ${places}</span></div>
      <div class="tiny dim" style="margin:-4px 2px 6px">Your most promising youngsters: where each is, what comes next and who is in his way. The player to beat is the weakest regular in his position; the time is the gap in ability over what he should grow in a year.</div>
      <div class="card flat list" style="padding:4px 12px">${cards.join('')}${list.length > 12 ? `<div class="tiny dim" style="padding:6px 0">and ${list.length - 12} more in the lists below</div>` : ''}</div>`;
  };
  // Who gets the games in a youth side: the manager's brief, handed to the youth coach, who picks the sides under it
  const briefChips = (c, team) => {
    const cur = Y.briefOf(c.id, team);
    const chips = Object.entries(Y.BRIEFS)
      .filter(([k]) => k !== 'minutes' || team === 'u21')
      .map(
        ([k, v]) =>
          `<button class="chip${cur === k ? ' on' : ''}" data-act="youthBrief" data-t="${team}" data-v="${k}">${esc(v.label)}</button>`,
      )
      .join('');
    return `<div class="row" style="gap:4px;margin:2px 2px 6px;flex-wrap:wrap"><span class="tiny dim" style="align-self:center">Brief</span>${chips}</div><div class="tiny dim" style="margin:0 2px 6px">${esc(Y.BRIEFS[cur].note.charAt(0).toUpperCase() + Y.BRIEFS[cur].note.slice(1))}. The coach picks the team; you can still move players between sides.</div>`;
  };
  UI.youthSides = function (c) {
    const out = [];
    for (const [team, def] of Object.entries(Y.TEAMS)) {
      const sq = Y.squadOf(c.id, team).sort((a, b) => b.pa - a.pa);
      out.push(`<div class="sec"><div class="h3">${esc(def.label)}</div>${leagueLine(c, team)}</div>
        ${briefChips(c, team)}
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
  UI.acts.youthBrief = (d) => {
    if (!Y.BRIEFS[d.v] || !Y.TEAMS[d.t]) return;
    const u = S().user;
    u.youthBrief = u.youthBrief || {};
    u.youthBrief[d.t] = d.v;
    UI.save();
    UI.render();
  };
  UI.acts.youthPlan = (d) => {
    const p = S().players[d.id];
    if (!p || !UI.PLANS[d.v]) return;
    p.plan = p.plan === d.v ? undefined : d.v; // (a second tap clears it)
    UI.save();
    UI.render();
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
