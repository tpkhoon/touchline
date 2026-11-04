// The squad depth planner (Squad > Depth): for the formation you play, each position's first choices, cover and prospects, as the
// squad stands and as it will be next season (contracts that end, loans that go back, players who will be 37), with where you are
// thin, whose contract to renew and a shortcut to send a scout looking for the position.
(function () {
  const FM = window.FM,
    UI = FM.UI,
    U = FM.U,
    D = FM.D,
    W = FM.W,
    C = UI.C;
  const S = () => FM.S;
  const esc = U.esc;

  const TYPES = ['GK', 'CB', 'FB', 'WB', 'DM', 'CM', 'WM', 'AM', 'W', 'ST'];
  const LABEL = {
    GK: 'Goalkeepers',
    CB: 'Centre-backs',
    FB: 'Full-backs',
    WB: 'Wing-backs',
    DM: 'Defensive midfielders',
    CM: 'Central midfielders',
    WM: 'Wide midfielders',
    AM: 'Attacking midfielders',
    W: 'Wingers',
    ST: 'Strikers',
  };
  UI._depthNext = false;
  // Is he a player for this position: his own, or one he plays at home (accomplished or better)
  const covers = (p, t) => (t === 'GK' ? p.pos === 'GK' : p.pos !== 'GK' && W.fitAt(p, t) >= 0.8);
  // Will he be gone for next season: a contract that ends this year, a loan that goes back, a player who will be 37
  const leaves = (p) => (p.loan && !W.isUser(p.loan.from)) || (!p.loan && p.contract <= S().year) || W.age(p) + 1 >= 37;
  const why = (p) =>
    p.loan && !W.isUser(p.loan.from)
      ? 'loan ends'
      : !p.loan && p.contract <= S().year
        ? 'contract ends'
        : W.age(p) + 1 >= 37
          ? 'retiring'
          : '';

  // The plan: for each position the formation uses, who covers it and how deep that is (this season, or next)
  UI.depthPlan = function (c, T, next) {
    const sq = W.squad(c.id).filter((p) => !p.team),
      youth = W.squad(c.id).filter((p) => p.team && !p.loan),
      slots = D.FORMATIONS[T.formation],
      need = {};
    slots.forEach((s) => (need[s.t] = (need[s.t] || 0) + 1));
    const rows = TYPES.filter((t) => need[t]).map((t) => {
      const all = sq.filter((p) => covers(p, t)).sort((a, b) => W.effAt(b, t) - W.effAt(a, t));
      const staying = all.filter((p) => !(next && leaves(p)));
      const target = need[t] + 1,
        have = staying.length;
      const prospects = youth
        .filter((p) => covers(p, t) && W.age(p) <= 21)
        .sort((a, b) => b.pa - a.pa)
        .slice(0, 2);
      return {
        t,
        need: need[t],
        target,
        have,
        all,
        staying,
        prospects,
        status: have < need[t] ? 'bad' : have < target ? 'warn' : 'good',
      };
    });
    const size = sq.length,
      sizeNext = sq.filter((p) => !leaves(p)).length;
    return { rows, size, sizeNext, leaving: sq.filter(leaves), ages: ageBands(sq, next) };
  };
  // How old the squad is: players in each age band (a year on, for next season)
  const BANDS = [
    ['Under 22', 0, 21],
    ['22 to 28', 22, 28],
    ['29 to 32', 29, 32],
    ['33 and over', 33, 99],
  ];
  const ageBands = (sq, next) =>
    BANDS.map(([label, lo, hi]) => [
      label,
      sq
        .filter((p) => !(next && leaves(p)))
        .filter((p) => W.age(p) + (next ? 1 : 0) >= lo && W.age(p) + (next ? 1 : 0) <= hi).length,
    ]);

  const playerLine = (p, t, i, need, next) => {
    const starter = i < need,
      age = W.age(p) + (next ? 1 : 0),
      gone = next && leaves(p),
      tags = [];
    if (p.pos !== t) tags.push(`<span class="pill">also</span>`);
    if (gone) tags.push(`<span class="pill bad">${esc(why(p))}</span>`);
    else if (!next && !p.loan && p.contract <= S().year)
      tags.push(
        `<button class="btn sm" style="margin-left:2px" data-act="renew" data-id="${p.id}" title="His contract ends this season">Renew</button>`,
      );
    else if (!p.loan && p.contract === S().year + 1 && !next)
      tags.push(`<span class="pill warn">to ${p.contract}</span>`);
    if (age >= 33 && !gone) tags.push(`<span class="pill warn">${age}</span>`);
    if (p.inj) tags.push(`<span class="pill bad">${FM.Injury.weeksLeft(p)}w</span>`);
    return `<div class="row small tap" style="padding:6px 0;border-top:1px solid var(--line);gap:8px;${gone ? 'opacity:.5' : ''}" data-act="player" data-id="${p.id}"><span class="tiny b" style="width:56px;flex:none;color:var(--${starter ? 'acc' : 'dim'})">${starter ? 'Starter' : 'Cover'}</span><span class="grow ellip">${esc(W.short(p))} <span class="dim">${age}</span></span><span class="prow-tags" style="gap:4px">${tags.join('')}</span>${C.starText(W.effAt(p, t), t)}</div>`;
  };

  UI.depthView = function () {
    const c = W.userClub(),
      T = S().user.tactic,
      next = !!UI._depthNext,
      plan = UI.depthPlan(c, T, next);
    const short = plan.rows.filter((r) => r.status === 'bad'),
      thin = plan.rows.filter((r) => r.status === 'warn');
    const seg = `<div class="seg" style="margin:0 0 10px"><button class="${next ? '' : 'on'}" data-act="depthWhen" data-v="now">This season</button><button class="${next ? 'on' : ''}" data-act="depthWhen" data-v="next">Next season</button></div>`;
    const head = `<div class="card"><div class="row"><div class="grow"><div class="h3">Depth plan · ${esc(T.formation)}</div><div class="small dim">${next ? 'The squad as it will be if nobody is renewed or signed: contracts that end, loans that go back and players of 37 are gone.' : 'Who covers each position you play, and how thin you are.'}</div></div></div>
      <div class="row small" style="margin-top:8px;gap:12px;flex-wrap:wrap"><span><b>${next ? plan.sizeNext : plan.size}</b> first-team players${next && plan.sizeNext !== plan.size ? ` <span class="dim">(${plan.size} now)</span>` : ''}</span><span style="color:var(--${short.length ? 'bad' : 'good'})"><b>${short.length}</b> ${short.length === 1 ? 'position' : 'positions'} short</span><span style="color:var(--${thin.length ? 'warn' : 'good'})"><b>${thin.length}</b> without cover</span></div>
      <div class="tiny dim" style="margin:10px 0 4px;letter-spacing:1px">AGES</div><div class="row" style="gap:6px">${plan.ages.map(([l, n]) => `<div class="kpi grow" style="padding:6px 2px"><div class="v" style="font-size:17px">${n}</div><div class="l">${l}</div></div>`).join('')}</div></div>`;
    const needs = plan.rows.filter((r) => r.status !== 'good');
    const shopping = needs.length
      ? `<div class="card"><div class="h3">Where to add</div>${needs
          .map((r) => {
            const n = r.target - r.have;
            return `<div class="row small" style="padding:6px 0;border-top:1px solid var(--line);gap:8px"><span class="grow">${esc(LABEL[r.t])}: ${U.plural(n, 'more player')} <span class="dim">(${r.have} of ${r.target}${r.status === 'bad' ? ', not enough to start' : ''})</span></span><button class="btn sm" data-act="depthScout" data-t="${r.t}">Scout</button></div>`;
          })
          .join('')}</div>`
      : '<div class="card"><div class="small" style="color:var(--good)">Every position you play has a starter and cover.</div></div>';
    const leaving = next
      ? ''
      : (() => {
          const gone = plan.leaving.filter((p) => !p.loan);
          return gone.length
            ? `<div class="card"><div class="h3">Leaving next summer</div><div class="small dim" style="margin:2px 0 6px">Contracts that end this season: renew them, or plan the gap.</div>${gone
                .map(
                  (p) =>
                    `<div class="row small" style="padding:5px 0;border-top:1px solid var(--line);gap:8px"><span class="grow ellip tap" data-act="player" data-id="${p.id}">${esc(W.short(p))} <span class="dim">${W.posLabel(p)} · ${W.age(p)}</span></span><span class="dim">${why(p)}</span></div>`,
                )
                .join('')}</div>`
            : '';
        })();
    const rows = plan.rows
      .map((r) => {
        const col = r.status;
        return `<div class="card"><div class="row"><div class="h3 grow">${esc(LABEL[r.t])}</div><span class="chip" style="border-color:var(--${col});color:var(--${col});flex:none" title="${r.have} cover this for ${U.plural(r.need, 'place')}, ${r.target} is a starter's place and cover">${r.have}/${r.target}</span></div>
        ${r.all.length ? r.all.map((p, i) => playerLine(p, r.t, i, r.need, next)).join('') : '<div class="small dim" style="padding:6px 0">Nobody in the first team plays here.</div>'}
        ${r.prospects.length ? `<div class="tiny dim" style="margin-top:6px">FROM THE ACADEMY</div>${r.prospects.map((p) => `<div class="row small tap" style="padding:5px 0;gap:8px" data-act="player" data-id="${p.id}"><span class="grow ellip">${esc(W.short(p))} <span class="dim">${W.age(p) + (next ? 1 : 0)} · ${esc(p.team)}</span></span>${C.starText(W.effAt(p, r.t), r.t)}</div>`).join('')}` : ''}</div>`;
      })
      .join('');
    return `${seg}${head}${shopping}${leaving}${rows}`;
  };
  UI.acts.depthWhen = (d) => {
    UI._depthNext = d.v === 'next';
    UI.render();
  };
  // Send a scout looking for a position: the assignment opens with it chosen
  UI.acts.depthScout = (d) => {
    const s = S(),
      id = s.user.scouts[0];
    if (!id) return UI.toast('Hire a scout first (Squad, then Staff)', 3000);
    UI._as = { ...UI._as, type: 'region', pos: [d.t], role: null, scout: id, maxAge: 29 };
    UI.assignSheet();
  };
})();
