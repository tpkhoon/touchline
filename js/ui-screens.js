// Main tab screens + player card + tactics + scouting + league + club.
(function () {
  const FM = window.FM,
    U = FM.U,
    D = FM.D,
    W = FM.W,
    UI = FM.UI,
    C = UI.C;
  const esc = U.esc;
  const S = () => FM.S;
  const club = () => W.userClub();
  // Out of work there is no club: views fall back to the first league, and ids to null
  const myComp = () => (club() ? club().comp : W.leagues()[0].id);
  const NOCLUB = { colors: ['#1b2533', '#0c1118'], short: '', name: '' };
  const P = (id) => FM.S.players[id];
  const CL = (id) => FM.S.clubs[id];
  const chips = (k, opts) =>
    `<div class="chips">${opts.map(([v, l]) => `<button class="chip ${UI.sub[k] === v ? 'on' : ''}" data-act="sub" data-k="${k}" data-v="${v}">${l}</button>`).join('')}</div>`;
  UI.screens = {};

  // ======================= HOME =======================
  UI.screens.home = function () {
    const s = S(),
      c = club();
    if (!W.employed()) return unemployedView();
    const fx = FM.Season.userFixture();
    const cal = FM.Season.today();
    let hero;
    if (fx) {
      const TM = FM.clubOf,
        home = W.isMine(fx.h),
        me = TM(home ? fx.h : fx.a),
        opp = TM(home ? fx.a : fx.h);
      const derby = me.rival === opp.id;
      const str = (t) =>
        U.avg(W.pickXI(t.id, W.isUser(t.id) ? s.user.tactic : t.tactic).xi.filter(Boolean), (p) => p.ca);
      const us = str(me),
        them = str(opp);
      const pw = FM.Season.matchOdds(me, opp, home, us, them, fx.neutral, derby);
      const compName = fx.intl ? 'International' : s.comps[fx.comp].name;
      const f1 = fx.first && FM.Cups.findFixture(fx.first);
      const aggNote =
        f1 && f1.res
          ? `First leg: ${TM(f1.h).short} ${f1.res.hg}–${f1.res.ag} ${TM(f1.a).short}${W.rule(f1.comp, 'awayGoals') ? ' · away goals count' : ''}`
          : '';
      // Their last result: clubs keep one; national teams read the international log
      const lr = (() => {
        if (fx.intl) {
          const g = (s.intlLog || []).find((x) => x.h === opp.id || x.a === opp.id);
          return (
            g && {
              opp: g.h === opp.id ? g.a : g.h,
              gf: g.h === opp.id ? g.hg : g.ag,
              ga: g.h === opp.id ? g.ag : g.hg,
              pens: g.pens && (g.h === opp.id ? g.pens : [g.pens[1], g.pens[0]]),
              label: g.label,
            }
          );
        }
        const r = opp.lastResult;
        return r && r.year === s.year && { ...r, label: s.comps[r.comp] ? s.comps[r.comp].name : '' };
      })();
      const lastLine = lr
        ? `Their last: ${lr.gf > lr.ga || (lr.pens && lr.pens[0] > lr.pens[1]) ? 'W' : lr.gf < lr.ga || (lr.pens && lr.pens[0] < lr.pens[1]) ? 'L' : 'D'} ${lr.gf}–${lr.ga}${lr.pens ? ` (${lr.pens[0]}–${lr.pens[1]} pens)` : ''} v ${TM(lr.opp) ? TM(lr.opp).name : '?'}${lr.label ? ` · ${lr.label}` : ''}`
        : '';
      const oppForm = fx.intl
        ? opp.form || []
        : s.comps[opp.comp] && s.comps[opp.comp].table[opp.id]
          ? s.comps[opp.comp].table[opp.id].form
          : [];
      hero = `<div class="hero" style="--c1:${U.heroShade(me.colors[0])};--c2:${U.heroShade(derby ? '#7a0010' : opp.colors[0])}">
        <div class="row"><span class="tag">${fx.po ? esc(fx.po) + ' · ' : cal.type === 'league' ? `${FM.Season.matchdayLabel(cal)} · ` : ''}${esc(compName)}</span><span class="grow"></span>${derby ? `<span class="pill" style="background:#fff;color:#b00020;border:0">⚔️ ${esc(me.derby)}</span>` : ''}</div>
        <div class="vs"><div class="side">${UI.C.crest(TM(fx.h), 54)}<span>${esc(TM(fx.h).name)}</span></div><div class="mid">VS<div class="tiny" style="font-family:var(--font);font-weight:700;opacity:.8">${fx.neutral ? 'NEUTRAL' : home ? 'HOME' : 'AWAY'}</div></div><div class="side">${UI.C.crest(TM(fx.a), 54)}<span>${esc(TM(fx.a).name)}</span></div></div>
        ${aggNote ? `<div class="small center b" style="margin:-4px 0 10px;opacity:.9">${esc(aggNote)}</div>` : ''}
        <div class="row small" style="margin-bottom:${lastLine ? 4 : 12}px;opacity:.9"><span>Win chance ${Math.round(pw * 100)}%</span><span class="grow"></span><span>Their form</span>${C.form(oppForm)}</div>
        ${lastLine ? `<div class="tiny ellip" style="margin-bottom:12px;opacity:.8;text-align:right">${esc(lastLine)}</div>` : ''}
        <div class="row" style="gap:8px"><button class="play grow" data-act="preview">▶ MATCHDAY</button><button class="play" style="background:rgba(255,255,255,.14);color:#fff;flex:none;width:auto;min-width:54px;padding:14px 16px" data-act="simDaysAsk" aria-label="Sim forward some days">📅</button></div></div>`;
    } else if (cal) {
      const others = FM.Season.dayFixtures();
      const away =
        cal.type === 'intl'
          ? W.squad(c.id).filter((p) => FM.S.nteams && FM.Intl.squad(FM.Intl.nationOf(p)).includes(p))
          : [];
      const what =
        cal.type === 'intl'
          ? `International break. ${
              away.length
                ? `${away.length} of your players are called up: ${away
                    .slice(0, 4)
                    .map((p) => W.short(p))
                    .join(', ')}${away.length > 4 ? '…' : ''}.`
                : 'None of your players were called up.'
            }`
          : cal.type === 'playoff'
            ? 'The playoffs are being contested.'
            : cal.type === 'cup'
              ? `${others.length} ${cal.regional ? 'regional ' : ''}ties elsewhere: ${[...new Set(others.map((f) => s.comps[f.comp].name))].join(', ') || 'no games'}.`
              : '';
      const what2 =
        cal.type === 'tourn'
          ? `${(s.tourns || []).map((t) => t.name).join(' · ') || 'The summer tournaments'} — ${others.length} match${others.length === 1 ? '' : 'es'} today.`
          : what;
      hero = `<div class="hero" style="--c1:#1b2533;--c2:#0c1118"><div class="tag">${cal.type === 'playoff' ? 'Playoffs' : cal.type === 'intl' ? '🌍 International break' : cal.type === 'tourn' ? '🏆 Summer tournament' : cal.type === 'cup' ? (cal.super ? 'Super Cups' : cal.world ? 'World Club Championship' : cal.stage ? 'Continental night' : 'Cup day') : 'Matchday'}</div><div class="h2" style="margin:10px 0 14px">No match for ${esc(c.short)} today</div><div class="small" style="opacity:.8;margin-bottom:12px">${esc(what2)}</div><div class="row" style="gap:8px"><button class="play grow" data-act="advance">Advance ▶</button><button class="play grow" style="background:rgba(255,255,255,.14);color:#fff" data-act="skipToMatch">⏩ Next match</button><button class="play" style="background:rgba(255,255,255,.14);color:#fff;flex:none;width:auto;min-width:54px;padding:14px 16px" data-act="simDaysAsk" aria-label="Sim forward some days">📅</button></div></div>`;
    }
    const row = s.comps[c.comp].table[c.id];
    const pos = W.position(c.id);
    const objs = FM.Season.objectives(c);
    // The home feed is about your club; the wider game lives under World (older saves may remember another tab)
    if (!['club', 'reply', 'world'].includes(UI.sub.feed)) UI.sub.feed = 'club';
    const waiting = s.news.filter(UI.isOpenDecision).length;
    return `${hero}
      <div class="kpis">
        <div class="kpi">${FM.Season.gamesPlayed(c.id) ? `<div class="v">${U.ordinal(pos)}</div><div class="l">${esc(s.comps[c.comp].short)} · ${U.pts(row.pts)}</div>` : `<div class="v">—</div><div class="l">${esc(s.comps[c.comp].short)} · season starts soon</div>`}</div>
        <div class="kpi"><div class="v" style="color:${C.moodColor(c.boardConf)}">${Math.round(c.boardConf)}%</div><div class="l">Board</div></div>
        <div class="kpi"><div class="v" style="color:${C.moodColor(c.fanMood)}">${Math.round(c.fanMood)}%</div><div class="l">Fans</div></div>
      </div>
      ${cupPills(c)}
      <div class="card flat"><div class="row"><div class="h3 grow">Objectives</div>${C.form(row.form)}</div>${objs.map((o) => `<div class="row small" style="margin-top:8px"><span>${o.ok ? '✅' : '⏳'}</span><span class="grow">${esc(o.text)}</span><span class="dim">${esc(o.status)}</span></div>`).join('')}</div>
      <div class="sec"><div class="h3">The Feed</div><span class="dim small">${s.news.filter((n) => !n.read).length ? `${s.news.filter((n) => !n.read).length} new · ` : ''}${s.news.length} stories</span>${s.news.some((n) => n.read && !UI.isOpenDecision(n)) ? `<button class="btn sm" style="margin-left:8px" data-act="clearRead">Remove read stories</button>` : ''}</div>
      ${chips('feed', [
        ['club', 'My Club'],
        ['reply', waiting ? `🔔 Needs reply (${waiting})` : 'Needs reply'],
        ['following', '⭐ Following'],
        ['press', '🗞️ Press'],
        ['world', 'World'],
      ])}
      ${UI.sub.feed === 'world' ? chips('wnews', WNEWS) : ''}
      ${feed()}`;
  };

  function cupPills(c) {
    const st = FM.Cups.status(c.id);
    if (!st.length) return '';
    return `<div class="chips noswipe" style="margin-top:-2px">${st.map((x) => `<button class="chip" data-act="goCups" style="${x.text === 'Winners' ? 'border-color:var(--gold);color:var(--gold)' : x.alive === false ? 'opacity:.55' : ''}">${x.c.type === 'continental' ? '⭐' : '🏆'} ${esc(x.c.name)} · ${esc(x.text)}</button>`).join('')}</div>`;
  }
  UI.acts.goCups = () => {
    UI.sub.league = 'cups';
    UI.go('league');
  };

  // World News topics. Items can carry an explicit `cat`; otherwise the topic is read from type and headline
  const WNEWS = [
    ['all', 'Everything'],
    ['transfers', 'Transfers'],
    ['managers', 'Managers'],
    ['competitions', 'Competitions'],
    ['international', 'International'],
    ['records', 'Records'],
  ];
  UI.sub.wnews = UI.sub.wnews || 'all';
  UI.newsCats = function (n) {
    const t = `${n.title || ''} ${n.kicker || ''}`,
      out = [];
    if (n.cat) out.push(n.cat);
    if (
      ['transfer', 'roundup', 'rumour'].includes(n.type) ||
      /transfer|signs for|joins|\bfee\b|\bloan\b|release clause/i.test(t)
    )
      out.push('transfers');
    if (/manager|\bsack|appoint|part ways|takes over|dugout|leaves \w.* for /i.test(t)) out.push('managers');
    if (/international|national team|world championship|qualif|\bcaps?\b|summer finals|nations/i.test(t))
      out.push('international');
    if (/record/i.test(t)) out.push('records');
    if (
      /\bwin|\bwon|champions|\bcup\b|title|promot|relegat|final|player of the month|crowned|trophy|league|round-up|hat-trick|shock|stun|giant-kill|derby/i.test(
        t,
      )
    )
      out.push('competitions');
    return [...new Set(out)];
  };
  function feed() {
    const s = S(),
      f = UI.sub.feed,
      cid = club() ? club().id : null;
    let items = s.news;
    // My Club is only your club; what you follow elsewhere has its own Following feed
    if (f === 'club') items = items.filter((n) => FM.News.isClub(n, cid));
    if (f === 'following') items = items.filter((n) => FM.News.followed(n) && !FM.News.isClub(n, cid));
    if (f === 'reply') items = items.filter(UI.isOpenDecision);
    if (f === 'stories') items = items.filter((n) => n.type === 'story');
    if (f === 'press') items = items.filter((n) => n.outlet || n.type === 'press');
    if (f === 'world') {
      // World News: everything about other clubs and the wider game, filtered by topic
      const w = UI.sub.wnews || 'all';
      items = items.filter(
        (n) =>
          n.clubId !== cid &&
          ['headline', 'world', 'brief', 'award', 'story', 'transfer', 'roundup', 'rumour'].includes(n.type) &&
          (w === 'all' || UI.newsCats(n).includes(w)),
      );
    }
    if (f === 'transfers') items = items.filter((n) => ['transfer', 'roundup', 'rumour', 'bid'].includes(n.type));
    items = items.filter((n) => !n.quiet || f === 'club');
    const top = f === 'following' ? UI.followingPanel() : '';
    if (!items.length)
      return `${top}<div class="empty">${f === 'reply' ? 'Nothing is waiting for your reply.' : f === 'following' ? 'No news from what you follow yet.' : f === 'world' && UI.sub.wnews !== 'all' ? 'No world news on this topic yet.' : 'Nothing here yet. Play some football.'}</div>`;
    // New since you last looked: a dot on the card; everything shown now counts as read
    const shown = items.slice(0, 40);
    shown.forEach((n) => {
      if (!n.read) n._new = true;
    });
    const html = shown.map(UI.newsCard).join('');
    shown.forEach((n) => {
      n.read = true;
      delete n._new;
    });
    return top + html;
  }
  // Open decisions are never cleared: a live bid, an unanswered press conference or meeting
  UI.isOpenDecision = FM.News.isOpen;
  UI.acts.roundupAll = (d) => {
    const n = S().news.find((x) => x.id === d.id);
    if (n) n.open = true;
    UI.render();
  };
  UI.acts.clearRead = () => {
    const s = S(),
      before = s.news.length;
    s.news = s.news.filter((n) => !n.read || UI.isOpenDecision(n));
    UI.save();
    UI.render();
    UI.toast(`${before - s.news.length} read item${before - s.news.length === 1 ? '' : 's'} cleared`);
  };

  const TYPE = {
    roundup: ['🔁', 'Transfer round-up'],
    headline: ['📰', 'Headline'],
    social: ['💬', 'Fans'],
    story: ['', ''],
    press: ['🎙️', 'Press Conference'],
    bid: ['💼', 'Transfer Bid'],
    report: ['🔭', 'Scouting'],
    youth: ['🌱', 'Academy'],
    board: ['🏛️', 'Board'],
    dressing: ['👥', 'Dressing Room'],
    world: ['🌍', 'World'],
    brief: ['⚡', 'Around the league'],
    transfer: ['✍️', 'Transfer'],
    rumour: ['👀', 'Rumour'],
    award: ['🏅', 'Awards'],
    club: ['🏟️', 'Club'],
    meeting: ['🗣️', 'Player meeting'],
    medical: ['🩺', 'Medical'],
    contracts: ['📝', 'Contracts'],
    desk: ['🤝', 'Transfer desk'],
  };
  UI.newsCard = function (n) {
    const s = S();
    const when = `${n.year !== s.year ? n.year + ' · ' : ''}MD ${n.day + 1}`;
    if (n.type === 'story') {
      const c = CL(n.clubId) || club() || NOCLUB;
      return `<div class="story" style="--c1:${U.heroShade(c.colors[0])};--c2:${U.heroShade(c.colors[1])}"><div class="bg"></div><button class="share" data-act="share" data-id="${n.id}" aria-label="Share">⤴</button><div class="in"><span class="kick">${esc(n.kicker)}</span>${n.pid && P(n.pid) ? `<div class="tiny b" style="margin-top:10px;opacity:.85" data-act="player" data-id="${n.pid}">${C.flag(P(n.pid).nat)} ${esc(W.name(P(n.pid)))} ›</div>` : ''}<div class="big">${esc(n.big)}</div><div class="st">${esc(n.title)}</div><div class="ss">${esc(n.sub)}</div><div class="foot"><span>TOUCHLINE STORIES</span><span>${esc(c.short)} · ${n.year}</span></div></div></div>`;
    }
    if (n.type === 'digest' && n.data) return digestCard(n, when);
    if (n.type === 'roundup') {
      const shown = n.open ? n.deals : n.deals.slice(0, 8);
      return `<div class="news" data-nid="${n.id}"><div class="nh">${n._new ? '<span class="dot" title="New"></span>' : ''}🔁 Transfer round-up<span class="grow"></span><span class="tiny dim">${when}</span></div><div class="nb"><div class="nt">${n.deals.length} deal${n.deals.length === 1 ? '' : 's'} around the world</div>${shown
        .map(
          (d) =>
            `<div class="row small tap" data-act="player" data-id="${d.pid}" style="padding:5px 0;border-top:1px solid var(--line);gap:8px">${d.c && CL(d.c) ? C.crest(CL(d.c), 16) : ''}<span class="grow ellip">${esc(d.t)}</span></div>`,
        )
        .join(
          '',
        )}${n.deals.length > shown.length ? `<button class="btn sm" style="margin-top:8px" data-act="roundupAll" data-id="${n.id}">Show all ${n.deals.length}</button>` : ''}</div></div>`;
    }
    const [ic, lab] = TYPE[n.type] || ['•', n.type];
    const c = n.clubId && CL(n.clubId);
    let head = `<div class="nh">${n._new ? '<span class="dot" title="New"></span>' : ''}${ic} ${n.type === 'headline' ? `<span class="paper">${esc(n.paper || 'The Daily Touchline')}</span>` : lab}<span class="grow"></span>${c ? C.crest(c, 16) : ''}<span>${when}</span></div>`;
    let body = '';
    if (n.type === 'social') {
      body = n.posts
        .map(
          (p) =>
            `<div class="post"><div class="av" style="background:${p.rival ? '#3b0d12' : 'var(--card2)'};color:${p.rival ? '#ff8a8a' : 'var(--ink2)'}">${esc(p.h[1].toUpperCase())}</div><div class="grow"><div class="hn">${esc(p.h)}</div><div class="tx">${esc(p.t)}</div><div class="lk">♥ ${p.likes.toLocaleString()} · ↻ ${Math.round(p.likes / 7)}</div></div></div>`,
        )
        .join('');
      return `<div class="news social">${head}<div class="nb"><div class="nt">${esc(n.title)}</div>${body}</div></div>`;
    }
    let extra = '';
    if (n.type === 'meeting' || n.type === 'medical') {
      const act = n.type === 'medical' ? 'medical' : 'meet';
      extra = n.resolved
        ? `<div class="reply">You: “${esc(n.resolved)}” — ${esc(n.reply || '')}</div>`
        : `<div class="choices">${n.choices.map((ch, i) => `<button class="btn sm${n.type === 'medical' && i === n.rec ? ' pri' : ''}" data-act="${act}" data-id="${n.id}" data-i="${i}">${esc(ch.label)}</button>`).join('')}</div>`;
      if (n.pid && P(n.pid))
        extra += `<div style="margin-top:8px"><button class="btn sm" data-act="player" data-id="${n.pid}">View ${esc(W.short(P(n.pid)))} ›</button></div>`;
    }
    if (n.type === 'press') {
      extra = n.resolved
        ? `<div class="reply">You: “${esc(n.resolved)}” — ${esc(n.reply)}</div>`
        : `<div class="choices">${n.choices.map((ch, i) => `<button class="btn sm" data-act="press" data-id="${n.id}" data-i="${i}">${esc(ch.label)}</button>`).join('')}</div>`;
    }
    if (n.type === 'bid') {
      const st = n.data.status;
      extra =
        st === 'open'
          ? UI.bidButtons(n) + (n.reply ? `<div class="reply">${esc(n.reply)}</div>` : '')
          : `<div class="reply">${UI.BID_STATUS[st] || '—'}${n.reply ? ' — ' + esc(n.reply) : ''}</div>`;
    }
    if (n.type === 'desk') extra = UI.deskChoices(n);
    if (n.type === 'contracts' && n.pids)
      extra = `<div class="chips" style="margin:10px 0 0;flex-wrap:wrap">${n.pids
        .filter((id) => P(id) && W.isUser(P(id).clubId))
        .map(
          (id) =>
            `<button class="chip ${P(id).contract > S().year ? 'on' : ''}" data-act="renew" data-id="${id}">${P(id).contract > S().year ? '✅' : '✍️'} ${esc(W.short(P(id)))} · ${C.starText(P(id).ca, P(id).pos)}</button>`,
        )
        .join('')}</div>`;
    if (n.type === 'youth' && n.pids)
      extra = `<div class="chips" style="margin:10px 0 0">${n.pids
        .filter(P)
        .map(
          (id) =>
            `<button class="chip" data-act="player" data-id="${id}">${C.flag(P(id).nat)} ${esc(W.short(P(id)))} · ${W.posLabel(P(id))}</button>`,
        )
        .join('')}</div>`;
    if (['report', 'transfer', 'rumour', 'award', 'dressing'].includes(n.type) && n.pid && P(n.pid))
      extra += `<div style="margin-top:8px"><button class="btn sm" data-act="player" data-id="${n.pid}">View ${esc(W.short(P(n.pid)))} ›</button></div>`;
    if (n.type === 'headline' && n.fxId)
      extra += `<div style="margin-top:8px"><button class="btn sm" data-act="matchReport" data-id="${n.fxId}">Match report ›</button></div>`;
    return `<div class="news ${n.type}" data-nid="${n.id}">${head}<div class="nb"><div class="nt">${UI.linkNames(n.title, n)}</div>${n.body ? `<div class="nx">${UI.linkNames(n.body, n)}</div>` : ''}${extra}</div></div>`;
  };
  // The players a story is about, their names in its text tappable (full name first, then "F. Surname")
  UI.linkNames = function (text, n) {
    let html = esc(text);
    const ids = [n.pid, ...(n.pids || []), ...((n.deals || []).map((d) => d.pid) || [])].filter(
      (id, i, a) => id && a.indexOf(id) === i && P(id),
    );
    for (const id of ids) {
      const p = P(id);
      for (const nm of [W.name(p), W.short(p)]) {
        const e = esc(nm);
        if (!html.includes(e)) continue;
        html = html.split(e).join(`<span class="tap pname" data-act="player" data-id="${id}">${e}</span>`);
        break;
      }
    }
    return html;
  };

  // Weekly round-up of a league matchday: our result, table movement, the rest of the round
  const TM = (id) => FM.clubOf(id);
  const arrow = (mv) =>
    mv > 0
      ? `<span style="color:var(--good)">▲${mv}</span>`
      : mv < 0
        ? `<span style="color:var(--bad)">▼${-mv}</span>`
        : '<span class="dim">–</span>';
  function digestCard(n, when) {
    const d = n.data,
      me = club() ? club().id : null,
      comp = S().comps[d.comp];
    let our = '';
    if (d.mine) {
      const home = d.mine.h === me,
        gf = home ? d.mine.hg : d.mine.ag,
        ga = home ? d.mine.ag : d.mine.hg,
        opp = TM(home ? d.mine.a : d.mine.h);
      const r = gf > ga ? ['W', 'var(--good)'] : gf < ga ? ['L', 'var(--bad)'] : ['D', 'var(--ink3)'];
      our = `<div class="big"><span class="wdl" style="background:${r[1]}">${r[0]}</span><div class="grow" style="min-width:0"><div class="b ellip">${gf}–${ga} v ${opp ? esc(opp.name) : '?'} (${home ? 'H' : 'A'})</div><div class="small dim">Now ${U.ordinal(d.pos)} ${arrow(d.move)} · ${U.pts(d.pts)}${d.top ? ` · ${d.gap ? `${d.gap} clear` : 'top on goal difference'}` : ` · ${d.gap ? `${d.gap} behind the leaders` : 'level on points with the leaders'}`}${d.safety != null ? ` · ${d.inZone ? (d.safety < 0 ? `${U.pts(-d.safety)} from safety` : 'in the drop zone on goal difference') : d.safety > 0 ? `${U.pts(d.safety)} clear of the drop zone` : 'level on points with the drop zone'}` : ''}</div></div></div>`;
    } else
      our = `<div class="small dim" style="margin-top:6px">No league game for us this round. We're ${U.ordinal(d.pos)} ${arrow(d.move)} on ${U.pts(d.pts)}.</div>`;
    const table = `<div class="dsec">${d.table.map(([id, pts, mv], i) => `<div class="dr ${id === me ? 'me' : ''}"><span style="width:18px" class="dim">${i + 1}</span>${C.crest(TM(id), 16)}<span class="grow ellip">${esc(TM(id).name)}</span>${arrow(mv)}<b style="width:28px;text-align:right">${pts}</b></div>`).join('')}${d.pos > d.table.length ? `<div class="dr me"><span style="width:18px">${d.pos}</span>${C.crest(TM(me), 16)}<span class="grow ellip">${esc(TM(me).name)}</span>${arrow(d.move)}<b style="width:28px;text-align:right">${d.pts}</b></div>` : ''}</div>`;
    const results = `<div class="dsec"><div class="tiny b dim">RESULTS</div><div class="res">${d.results
      .map(([h, a, hg, ag]) => {
        const m = h === me || a === me ? 'me' : '';
        return `<span class="ellip ${m}" style="text-align:right">${esc(TM(h).short)}</span><b class="${m}">${hg}–${ag}</b><span class="ellip ${m}">${esc(TM(a).short)}</span>`;
      })
      .join('')}</div></div>`;
    const P2 = (id) => S().players[id];
    const lines = [...d.notes];
    if (d.star && P2(d.star[0]))
      lines.push(
        `⭐ Star of the round: ${W.name(P2(d.star[0]))}${d.star[1] ? ` — ${d.star[1]} goal${d.star[1] > 1 ? 's' : ''}` : ''}${d.star[2] ? `${d.star[1] ? ',' : ' —'} ${d.star[2]} assist${d.star[2] > 1 ? 's' : ''}` : ''}`,
      );
    if (d.scorer && P2(d.scorer[0]))
      lines.push(
        `👟 Top scorer: ${W.name(P2(d.scorer[0]))} (${TM(P2(d.scorer[0]).clubId) ? TM(P2(d.scorer[0]).clubId).short : '—'}) — ${d.scorer[1]} this season`,
      );
    const clubShort = (p) => (TM(p.clubId) ? TM(p.clubId).short : '—');
    if (d.hot && P2(d.hot[0]))
      lines.push(
        `🔥 In form: ${W.name(P2(d.hot[0]))} (${clubShort(P2(d.hot[0]))}) — ${d.hot[1].toFixed(1)} average over his last 3`,
      );
    if (d.cold && P2(d.cold[0]))
      lines.push(
        `🧊 Out of form: ${W.name(P2(d.cold[0]))} (${clubShort(P2(d.cold[0]))}) — ${d.cold[1].toFixed(1)} average over his last 3`,
      );
    if (d.next && TM(d.next.h) && TM(d.next.a)) {
      const home = d.next.h === me;
      lines.push(
        `➡️ Next: ${TM(home ? d.next.a : d.next.h).name} (${home ? 'H' : 'A'}) · matchday ${d.next.round + 1}`,
      );
    }
    return `<div class="news digest" data-nid="${n.id}"><div class="nh">${n._new ? '<span class="dot" title="New"></span>' : ''}🗞️ Matchday digest<span class="grow"></span><span>${when}</span></div><div class="nb"><div class="nt">${esc(n.title)}</div>${our}${table}${results}${lines.length ? `<div class="dsec">${lines.map((l) => `<div class="small" style="padding:2px 0">${esc(l)}</div>`).join('')}</div>` : ''}${comp ? `<div style="margin-top:10px"><button class="btn sm" data-act="digestTable" data-id="${d.comp}">Full table ›</button></div>` : ''}</div></div>`;
  }
  UI.acts.digestTable = (d) => {
    UI.sub.league = d.id;
    UI.go('league');
  };

  UI.acts.medical = (d) => {
    const n = S().news.find((x) => x.id === d.id);
    FM.Injury.resolve(n, +d.i);
    UI.save();
    UI.render();
  };
  UI.acts.meet = (d) => {
    const n = S().news.find((x) => x.id === d.id);
    FM.People.resolveMeeting(n, +d.i);
    UI.save();
    UI.render();
  };
  UI.acts.press = (d) => {
    const n = S().news.find((x) => x.id === d.id);
    FM.Stories.applyPress(n, +d.i);
    UI.save();
    UI.render();
  };
  UI.acts.bid = (d) => {
    const n = S().news.find((x) => x.id === d.id);
    n.reply = FM.Transfers.respondBid(n, d.v === '1');
    UI.toast(n.reply);
    UI.save();
    UI.render();
  };
  UI.acts.share = (d) => UI.shareStory(S().news.find((x) => x.id === d.id));
  UI.acts.advance = async () => {
    const r = await FM.SimRunner.run('day');
    if (r) UI.afterDay(r.summary);
  };
  // Sim through days without a match of ours; stop for our next fixture, a decision in the feed, or the season's end
  UI.acts.skipToMatch = async () => {
    const r = await FM.SimRunner.run('toMatch');
    if (!r) return;
    // stopped for a decision: say what it is and open the list of things waiting for a reply
    if (!r.summary && r.pending && W.employed()) UI.sub.feed = 'reply';
    UI.afterDay(r.summary);
    const days = `${r.n} day${r.n === 1 ? '' : 's'}`;
    if (!r.summary)
      UI.toast(
        r.stopped
          ? `⏹ Stopped after ${days}, as you asked`
          : r.newOffer
            ? `⏩ ${days} simulated — a new job offer has arrived`
            : !W.employed()
              ? `⏩ ${days} simulated — no new offers yet`
              : r.winChange
                ? `⏸ Stopped after ${days}: the transfer window has ${r.win0 ? 'closed' : 'opened'}`
                : r.deadline
                  ? `⏸ Stopped after ${days}: it's deadline day`
                  : r.pending
                    ? `⏸ Stopped after ${days}: ${r.pendingText || 'a decision needs a reply'}`
                    : r.cap
                      ? `⏩ ${days} simulated (the longest skip) — your next match is further off`
                      : `⏩ ${days} simulated`,
        r.pending ? 5000 : 3500,
      );
  };
  // Sim forward a number of days (our own matches are played for us); stops for what needs you
  // The sheet picks how far to go (a number of days, or a target) and shows what will happen; nothing starts until Start
  const SIM_TARGETS = {
    window: 'until the transfer window changes',
    match: 'until your next match',
    season: 'until the end of the season',
  };
  const simPlan = () => {
    const sel = UI._simSel || { n: 7 };
    return sel.u
      ? `Sim ${SIM_TARGETS[sel.u]}`
      : `Sim ${U.plural(Math.max(1, Math.min(120, Math.floor(+sel.n) || 7)), 'day')}`;
  };
  const simSheetHtml = () => {
    const sel = UI._simSel || { n: 7 };
    const chips = [3, 7, 14, 30, 60]
      .map(
        (n) =>
          `<button class="chip ${!sel.u && +sel.n === n ? 'on' : ''}" data-act="simPick" data-n="${n}">${U.plural(n, 'day')}</button>`,
      )
      .join('');
    const until = Object.entries(SIM_TARGETS)
      .map(
        ([k, label]) =>
          `<button class="chip ${sel.u === k ? 'on' : ''}" data-act="simPick" data-u="${k}">⏩ ${label.replace('until ', 'Until ')}</button>`,
      )
      .join('');
    return `<div class="tiny dim" style="margin-bottom:8px;line-height:1.5">Sim forward through the days. Your own matches are played for you as instant results. It stops early for a decision, a transfer window opening or closing, deadline day, the end of the season or a new job offer, and you can stop it yourself while it runs.</div>
      <div class="chips" style="flex-wrap:wrap;margin-bottom:10px">${chips}</div>
      <div class="chips" style="flex-wrap:wrap;margin-bottom:10px">${until}</div>
      <div class="row" style="gap:8px;margin-bottom:12px"><input type="number" id="sim-days" min="1" max="120" value="${sel.u ? '' : +sel.n || 7}" placeholder="days" inputmode="numeric" style="width:90px" data-input="simType"><span class="dim small grow">days (1 to 120)</span></div>
      <div class="card flat" id="simPlan" style="margin-bottom:10px"><div class="small b">${simPlan()}</div><div class="tiny dim" style="margin-top:4px">Nothing happens until you press Start.</div></div>
      <button class="btn pri block" data-act="simGo">▶ Start simming</button>`;
  };
  UI.acts.simDaysAsk = () => {
    UI._simSel = { n: 7 };
    UI.sheet(simSheetHtml(), { title: 'Sim forward' });
  };
  UI.acts.simPick = (d) => {
    UI._simSel = d.u ? { u: d.u } : { n: +d.n };
    const body = [...document.querySelectorAll('.sheet-wrap')].pop()?.querySelector('.sh-body');
    if (body) body.innerHTML = simSheetHtml();
  };
  // typing a number of days picks it
  UI.acts.simType = (d, el) => {
    UI._simSel = { n: +el.value || 7 };
    document
      .querySelectorAll('.sheet [data-act="simPick"]')
      .forEach((b) => b.classList.toggle('on', !b.dataset.u && +b.dataset.n === +el.value));
    document.querySelectorAll('.sheet [data-act="simPick"][data-u]').forEach((b) => b.classList.remove('on'));
    const p = document.querySelector('#simPlan .small');
    if (p) p.textContent = simPlan();
  };
  UI.acts.simGo = () => {
    const sel = UI._simSel || { n: 7 };
    UI.acts.simDays(sel.u ? { n: 400, until: sel.u } : { n: sel.n });
  };
  UI.acts.simStop = () => FM.SimRunner.stop();
  UI.acts.simDays = async (d) => {
    const until = d.until === 'match' || d.until === 'season' || d.until === 'window' ? d.until : null;
    const n = until ? 400 : Math.max(1, Math.min(120, Math.floor(+d.n) || 7));
    UI.closeAllSheets();
    const r = await FM.SimRunner.run('days', until ? { days: n, until } : n);
    if (!r) return;
    if (!r.summary && r.pending && W.employed()) UI.sub.feed = 'reply';
    UI.afterDay(r.summary);
    const days = `${r.n} day${r.n === 1 ? '' : 's'}`;
    if (!r.summary)
      UI.toast(
        r.stopped
          ? `⏹ Stopped after ${days}, as you asked`
          : r.done
            ? `⏩ ${days} simulated`
            : r.newOffer
              ? `⏩ ${days} simulated — a new job offer has arrived`
              : r.winChange
                ? `⏸ Stopped after ${days}: the transfer window has ${r.win0 ? 'closed' : 'opened'}`
                : r.deadline
                  ? `⏸ Stopped after ${days}: it's deadline day`
                  : r.pending
                    ? `⏸ Stopped after ${days}: ${r.pendingText || 'a decision needs a reply'}`
                    : until === 'match'
                      ? `⏩ ${days} simulated: your next match is today`
                      : `⏸ Stopped after ${days} (of ${r.days})`,
        r.pending ? 5000 : 3500,
      );
  };
  // The clubs that will join, each with a button to change its name, look, ground and rating before it does
  const expansionClubRows = (id, q) =>
    `<div style="margin-top:10px">${FM.Season.expansionClubs(id, q)
      .map(
        (r, i) =>
          `<div class="row small tap" data-act="expandEdit" data-id="${id}" data-i="${i}" style="padding:8px 0;border-top:1px solid var(--line);gap:8px"><span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,${esc(r[3])} 50%,${esc(r[4])} 50%);border:1px solid var(--line)"></span><span class="grow ellip"><b>${esc(r[0])}</b> <span class="dim">· ${esc(r[2])} · ${esc(r[7])}</span></span><span class="dim">✏️</span></div>`,
      )
      .join('')}</div>`;
  // A closed league can take new clubs at the start of the next season, with an expansion draft (FM.Season.runExpansions)
  UI.expansionCard = function (comp) {
    const Sea = FM.Season;
    if (!comp || !Sea.isClosed(comp.id)) return '';
    const max = Sea.expansionMax(comp.id),
      q = Sea.expansionQueued(comp.id);
    const draft = Sea.expansionDraft(comp.id);
    const chips = [0, 1, 2, 3]
      .filter((n) => n <= max)
      .map(
        (n) =>
          `<button class="chip ${q === n ? 'on' : ''}" data-act="expandSet" data-id="${comp.id}" data-n="${n}">${n ? `+${n}` : 'None'}</button>`,
      )
      .join('');
    const modes = `<div class="chips" style="flex-wrap:wrap;margin-top:8px"><button class="chip ${draft ? 'on' : ''}" data-act="expandMode" data-id="${comp.id}" data-d="1">With an expansion draft</button><button class="chip ${draft ? '' : 'on'}" data-act="expandMode" data-id="${comp.id}" data-d="0">No draft: start empty</button></div>`;
    return `<div class="card" style="margin-top:10px"><div class="row"><div class="h3 grow">🏟️ Expansion</div><span class="tiny dim">${U.plural(comp.clubs.length, 'club')}</span></div>
      <div class="tiny dim" style="margin:4px 0 8px;line-height:1.5">${max ? `This league has no promotion or relegation, so it can grow. ${draft ? `Clubs added for the next season fill their squads in an expansion draft: each existing club protects its best twelve players and loses at most ${Sea.expansionSpec(comp.clubs.length, q || 1).maxLoss} of the rest${q ? '' : ' (for one new club; more clubs can mean more)'}: ${q ? `${U.plural(q, 'new club')} draft` : 'a new club drafts'} about ${U.plural(Sea.expansionSpec(comp.clubs.length, q || 1).size, 'player')}.` : 'Clubs added for the next season start with no players and no draft: they sign free agents and young players through the pre-season, and nobody is taken from the existing clubs.'}` : 'No expansion clubs are left for this league.'}</div>
      ${max ? `<div class="chips" style="flex-wrap:wrap">${chips}</div>${modes}` : ''}
      ${q ? expansionClubRows(comp.id, q) : ''}
      ${q ? `<div class="small" style="margin-top:8px">✅ ${U.plural(q, 'new club')} join at the start of next season, ${draft ? 'with a draft' : 'with no players and no draft'}.</div>` : ''}</div>`;
  };
  UI.acts.expandEdit = (d) => {
    const Sea = FM.Season,
      i = +d.i,
      r = Sea.expansionClubs(d.id, Sea.expansionQueued(d.id))[i];
    if (!r) return;
    const f = (id, label, v, extra = '') =>
      `<div style="flex:1;min-width:0"><div class="ng-label" style="margin-top:8px">${label}</div><input type="text" id="${id}" value="${esc(v ?? '')}" ${extra}></div>`;
    const idOpts = Object.entries(D.IDENTITY)
      .map(([k, v]) => `<option value="${k}" ${r[5] === k ? 'selected' : ''}>${esc(v.label)}</option>`)
      .join('');
    UI.sheet(
      `${f('xc-name', 'Name', r[0], 'maxlength="40"')}
      <div class="row" style="gap:8px">${f('xc-abbr', 'Short name (up to 5)', r[9], 'maxlength="5"')}${f('xc-nick', 'Nickname', r[10], 'maxlength="24"')}</div>
      <div class="row" style="gap:8px">${f('xc-city', 'Town', r[2], 'maxlength="32"')}${f('xc-ground', 'Ground', r[7], 'maxlength="40"')}</div>
      <div class="ng-label">Colours</div>
      <div class="row" style="gap:10px"><input type="color" id="xc-c1" value="${esc(r[3])}" style="width:64px;height:44px;padding:2px"><input type="color" id="xc-c2" value="${esc(r[4])}" style="width:64px;height:44px;padding:2px"></div>
      <div class="row" style="gap:8px"><div style="flex:1"><div class="ng-label" style="margin-top:8px">Capacity</div><input type="number" id="xc-cap" min="1000" max="120000" step="500" inputmode="numeric" value="${r[8]}"></div><div style="flex:1"><div class="ng-label" style="margin-top:8px">Reputation</div><input type="number" id="xc-rep" min="20" max="99" inputmode="numeric" value="${r[6]}"></div></div>
      <div class="ng-label">Identity</div><select id="xc-identity">${idOpts}</select>
      <div class="actions" style="margin-top:14px;gap:8px"><button class="btn pri grow" data-act="expandSave" data-id="${esc(d.id)}" data-i="${i}">Save</button><button class="btn" data-act="expandReset" data-id="${esc(d.id)}" data-i="${i}">Back to the original</button></div>`,
      { title: 'Customise the new club', full: true },
    );
  };
  UI.acts.expandSave = (d) => {
    const v = (id) => ((document.getElementById(id) || {}).value || '').trim();
    const name = v('xc-name'),
      abbr = v('xc-abbr').toUpperCase();
    if (!name) return UI.toast('A club needs a name', 2500);
    if (D.isRude && (D.isRude(name) || D.isRude(abbr) || D.isRude(v('xc-nick'))))
      return UI.toast('That name contains a word the game will not use', 3000);
    if (Object.values(S().clubs).some((c) => c.name.toLowerCase() === name.toLowerCase()))
      return UI.toast('A club with that name already exists', 3000);
    const num = (id, lo, hi) => Math.max(lo, Math.min(hi, Math.round(+v(id) || 0)));
    FM.Season.customiseExpansion(d.id, +d.i, {
      name,
      abbr: abbr || undefined,
      nick: v('xc-nick'),
      city: v('xc-city'),
      ground: v('xc-ground'),
      c1: v('xc-c1'),
      c2: v('xc-c2'),
      cap: num('xc-cap', 1000, 120000),
      rep: num('xc-rep', 20, 99),
      identity: v('xc-identity'),
    });
    UI.save();
    UI.closeSheet();
    UI.render();
    UI.toast('Saved', 1500);
  };
  UI.acts.expandReset = (d) => {
    FM.Season.customiseExpansion(d.id, +d.i, null);
    UI.save();
    UI.closeSheet();
    UI.render();
  };
  UI.acts.expandMode = (d) => {
    const Sea = FM.Season;
    Sea.setExpansionDraft(d.id, d.d === '1');
    UI.save();
    UI.render();
  };
  UI.acts.expandSet = (d) => {
    FM.Season.queueExpansion(d.id, +d.n);
    UI.save();
    UI.render();
  };
  UI.acts.preview = () => FM.MatchView.preview();

  UI.afterDay = function (summary) {
    if (UI.checkAlerts) UI.checkAlerts(); // saved searches that alert you
    // the save the simulation worker packs after sending the day (a second later, off the main thread)
    FM.SimRunner.afterPack(() => UI.save());
    if (summary) UI.seasonReview(summary);
    UI.render();
    // Rendering marks feed items read; save that a moment later rather than blocking the screen now
    clearTimeout(UI._saveT);
    UI._saveT = setTimeout(() => UI.save(), 2500);
  };

  // Out of work: offers from clubs in your reputation range, time passing while you wait, the world's news
  function unemployedView() {
    if (UI.sub.feed === 'club' || UI.sub.feed === 'reply') UI.sub.feed = 'all';
    const s = S(),
      u = s.user,
      un = u.unemployed || {},
      now = FM.Season.dayIndex();
    const from = un.from && CL(un.from),
      fresh = un.since === s.year && s.day - (un.day || 0) <= 2;
    const title =
      un.reason === 'sacked' && fresh
        ? "You've been sacked."
        : un.reason === 'start' && !u.stats.games
          ? 'Your career starts here.'
          : 'Looking for your next job';
    const line =
      un.reason === 'sacked' && fresh && from
        ? `The board at ${esc(from.name)} have lost patience. Football is cruel — but your reputation still opens doors.`
        : un.reason === 'start' && !u.stats.games
          ? 'No club yet. Clubs in your reputation range will make offers — the struggling ones call first. Take one, or wait for a better one.'
          : `Out of work${from ? ` since leaving ${esc(from.name)}` : ''}. Offers arrive every few days and last about a week.`;
    const fx = FM.Season.userFixture(); // a national team job carries on while you are between clubs
    const offers = (u.offers || []).filter((o) => CL(o.id));
    const card = (o) => {
      const c = CL(o.id),
        comp = s.comps[c.comp],
        obj = FM.Season.objectives(c)[0],
        days = Math.max(1, o.until - now);
      return `<div class="card"><div class="row">${C.crest(c, 42)}<div class="grow" style="min-width:0"><div class="b ellip">${esc(c.name)}</div><div class="small dim ellip">${comp ? `${esc(comp.name)}${comp.table[c.id] && comp.table[c.id].p ? ` · ${U.ordinal(W.position(c.id))}` : ''}` : ''} · ${FM.Lore.identity(c.identity, c).icon} ${esc(FM.Lore.identity(c.identity, c).label)}</div></div><span class="pill">Rep ${U.repText(c.rep)}</span></div>
        <div class="small muted" style="margin-top:8px;line-height:1.5">${esc(o.why === 'struggling' ? 'Struggling and wants a change.' : o.why === 'step up' ? 'A step up for you.' : 'A fresh start.')}${obj ? ` The board expect you to: ${esc(obj.text.toLowerCase())}.` : ''} Budget ${U.money(c.budget || 0)}.</div>
        <div class="row" style="margin-top:10px;gap:8px"><span class="tiny dim grow">Offer open for about ${days} day${days === 1 ? '' : 's'}</span><button class="btn sm" data-act="clubView" data-id="${c.id}">Look closer</button><button class="btn sm pri" data-act="takeJob" data-id="${c.id}">Accept</button></div></div>`;
    };
    return `<div class="hero" style="--c1:${U.heroShade(un.reason === 'sacked' && fresh ? '#5b0b12' : '#1b2533')};--c2:#0c1118"><div class="tag">${un.reason === 'sacked' && fresh ? 'Breaking' : 'Out of work'}</div><div class="h1" style="margin:10px 0">${title}</div><div class="small" style="opacity:.85">${line}</div>
        <div class="small" style="opacity:.75;margin-top:8px">Reputation ${U.repText(u.rep)} · ${esc(u.badges)} licence${u.nation && s.nteams && s.nteams[u.nation] ? ` · ${esc(s.nteams[u.nation].name)} manager` : ''}</div>
        <div class="row" style="gap:8px;margin-top:14px">${fx ? '<button class="play grow" data-act="preview">▶ MATCHDAY</button>' : '<button class="play grow" data-act="advance">Advance ▶</button><button class="play grow" style="background:rgba(255,255,255,.14);color:#fff" data-act="skipToMatch">⏩ Wait for an offer</button>'}${'<button class="play" style="background:rgba(255,255,255,.14);color:#fff;flex:none;width:auto;min-width:54px;padding:14px 16px" data-act="simDaysAsk" aria-label="Sim forward some days">📅</button>'}</div></div>
      <div class="sec"><div class="h3">Job offers</div><span class="dim small">${offers.length ? `${offers.length} on the table` : ''}</span></div>
      ${offers.map(card).join('') || '<div class="empty">No offers right now. Keep waiting — clubs in your range will call.</div>'}
      <div class="sec"><div class="h3">The Feed</div></div>
      ${chips('feed', [
        ['all', 'All'],
        ['stories', 'Stories'],
        ['following', '⭐ Following'],
        ['world', 'World'],
        ['transfers', 'Transfers'],
      ])}
      ${UI.sub.feed === 'world' ? chips('wnews', WNEWS) : ''}
      ${feed()}`;
  }
  UI.acts.takeJob = (d) => {
    const s = S(),
      prev = s.user.unemployed || {},
      from = prev.from && CL(prev.from);
    if (!CL(d.id)) return;
    W.takeCharge(d.id, s.user.name, false);
    FM.Stories.share({
      kicker: 'NEW JOB',
      title: `${s.user.name} takes over at ${CL(d.id).name}`,
      sub: from ? `A fresh start after leaving ${from.name}.` : 'The first job of a new career.',
      big: '🤝',
      clubId: d.id,
    });
    UI.closeAllSheets();
    UI.tab = 'home';
    UI.sub.feed = 'club';
    UI.save();
    UI.render();
    UI.toast(`Welcome to ${CL(d.id).name}`);
  };

  // ---------- Share story as image ----------
  UI.shareStory = async function (n) {
    const c = CL(n.clubId) || club() || NOCLUB;
    const cv = document.createElement('canvas');
    cv.width = 1080;
    cv.height = 1350;
    const x = cv.getContext('2d');
    const g = x.createLinearGradient(0, 0, 1080, 1350);
    g.addColorStop(0, c.colors[0]);
    g.addColorStop(0.5, c.colors[0]);
    g.addColorStop(1.3, c.colors[1]);
    x.fillStyle = g;
    x.fillRect(0, 0, 1080, 1350);
    x.save();
    x.rotate(-0.4);
    x.fillStyle = 'rgba(255,255,255,.06)';
    for (let i = -20; i < 40; i++) x.fillRect(i * 110, -600, 50, 3000);
    x.restore();
    const sh = x.createLinearGradient(0, 400, 0, 1350);
    sh.addColorStop(0, 'rgba(0,0,0,0)');
    sh.addColorStop(1, 'rgba(0,0,0,.75)');
    x.fillStyle = sh;
    x.fillRect(0, 0, 1080, 1350);
    x.fillStyle = '#fff';
    x.fillRect(60, 60, 40 + n.kicker.length * 26, 64);
    x.fillStyle = '#0b0f14';
    x.font = '900 34px Inter, sans-serif';
    x.fillText(n.kicker, 80, 105);
    x.fillStyle = '#fff';
    x.font = '900 260px "Barlow Condensed", Impact, sans-serif';
    x.fillText(n.big, 60, 830);
    x.font = '800 84px "Barlow Condensed", Impact, sans-serif';
    const wrap = (t, maxW, lh, y) => {
      const words = t.toUpperCase().split(' ');
      let line = '';
      for (const w of words) {
        const test = line ? line + ' ' + w : w;
        if (x.measureText(test).width > maxW && line) {
          x.fillText(line, 60, y);
          y += lh;
          line = w;
        } else line = test;
      }
      x.fillText(line, 60, y);
      return y;
    };
    let y = wrap(n.title, 960, 84, 960);
    x.font = '500 38px Inter, sans-serif';
    x.globalAlpha = 0.9;
    const words = n.sub.split(' ');
    let line = '';
    y += 70;
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (x.measureText(t).width > 960 && line) {
        x.fillText(line, 60, y);
        y += 50;
        line = w;
      } else line = t;
    }
    x.fillText(line, 60, y);
    x.globalAlpha = 0.85;
    x.font = '800 30px Inter, sans-serif';
    x.fillText('TOUCHLINE STORIES', 60, 1290);
    x.textAlign = 'right';
    x.fillText(`${c.short} · ${n.year}`, 1020, 1290);
    cv.toBlob(async (blob) => {
      const r = await FM.Native.shareFile({ blob, name: 'touchline-story.png', type: 'image/png', title: n.title });
      if (r === 'saved') UI.toast('Story image saved');
    });
  };

  // ======================= SQUAD =======================
  UI.screens.squad = function () {
    const tab = UI.sub.squad;
    return (
      chips('squad', [
        ['list', 'Squad'],
        ['tactics', 'Tactics'],
        ['academy', 'Academy'],
        ['training', 'Training'],
        ['analytics', 'Analytics'],
        ['promises', 'Promises'],
      ]) +
      (tab === 'tactics'
        ? tacticsView()
        : tab === 'academy'
          ? academyView()
          : tab === 'training'
            ? UI.trainingView()
            : tab === 'analytics'
              ? UI.analyticsView()
              : tab === 'promises'
                ? UI.promisesView()
                : squadView())
    );
  };
  const SQ_DEFAULT = () => ({ text: '', pos: [], age: 'any', nat: 'any', contract: 'any', foot: 'any', level: 'any' });
  UI._sq = { sort: 'pos', filter: 'all', stat: false, alt: false, rev: false, more: false, ...SQ_DEFAULT() };
  // which sorts run low to high by themselves (the rest high to low); the arrow button turns either around
  const SQ_ASC = new Set(['fit', 'age', 'contract']);
  const SQ_SORT = {
    pos: ['Position', (a, b) => b.ca - a.ca],
    ca: ['Ability', (a, b) => b.ca - a.ca],
    pa: ['Potential', (a, b) => b.pa - a.pa || b.ca - a.ca],
    fit: ['Fitness', (a, b) => a.fitness - b.fitness],
    age: ['Age', (a, b) => W.age(a) - W.age(b)],
    wage: ['Wage', (a, b) => b.wage - a.wage],
    value: ['Value', (a, b) => b.value - a.value],
    apps: ['Appearances', (a, b) => (b.season.apps || 0) - (a.season.apps || 0) || b.ca - a.ca],
    goals: [
      'Goals',
      (a, b) => (b.season.goals || 0) - (a.season.goals || 0) || (b.season.ast || 0) - (a.season.ast || 0),
    ],
    contract: ['Contract', (a, b) => a.contract - b.contract || b.ca - a.ca],
    form: [
      'Form',
      (a, b) => (b.form.length ? U.avg(b.form.slice(-5)) : 0) - (a.form.length ? U.avg(a.form.slice(-5)) : 0),
    ],
  };
  const SQ_FILTER = {
    all: ['All', () => true],
    xi: ['Starting XI', (p, xi) => xi.has(p.id)],
    avail: ['Available', (p) => W.available(p)],
    out: ['Injured / banned', (p) => !W.available(p)],
    tired: ['Tired (<75%)', (p) => p.fitness < 75],
    expiring: ['Contract ending', (p) => p.contract <= S().year + 1],
    young: ['21 & under', (p) => W.age(p) <= 21],
    loan: ['On loan to us', (p) => !!p.loan],
    listed: ['Listed', (p) => !!(p.listed || p.loanListed)],
    bench: ['Out of the squad', (p, xi, bench) => !xi.has(p.id) && !bench.has(p.id)],
  };
  const SQ_AGE = {
    any: ['Any age', () => true],
    u21: ['≤21', (a) => a <= 21],
    mid: ['22–26', (a) => a >= 22 && a <= 26],
    prime: ['27–31', (a) => a >= 27 && a <= 31],
    old: ['32+', (a) => a >= 32],
  };
  // the extra filters of the squad screen, all at once: name, positions, age, nationality, contract, foot and role
  const sqActive = () => {
    const q = UI._sq;
    return (
      (q.filter !== 'all') +
      (q.text.trim() !== '') +
      (q.pos.length > 0) +
      ['age', 'nat', 'contract', 'foot', 'level'].filter((k) => q[k] !== 'any').length
    );
  };
  UI.acts.sqText = (d, el) => {
    UI._sq.text = el.value;
    clearTimeout(UI._sqT);
    UI._sqT = setTimeout(() => {
      UI.render();
      const i = document.querySelector('[data-input="sqText"]');
      if (i) {
        i.focus();
        i.setSelectionRange(i.value.length, i.value.length);
      }
    }, 250);
  };
  UI.acts.sqSet = (d) => {
    UI._sq[d.k] = d.v;
    UI.render();
  };
  UI.acts.sqSel = (d, el) => {
    UI._sq[d.k] = el.value;
    UI.render();
  };
  UI.acts.sqPos = (d) => {
    const q = UI._sq;
    q.pos = d.v === 'any' ? [] : q.pos.includes(d.v) ? q.pos.filter((x) => x !== d.v) : [...q.pos, d.v];
    UI.render();
  };
  UI.acts.sqPosGroup = (d) => {
    const q = UI._sq,
      grp = D.POS.filter((x) => D.POS_GROUP[x] === d.v);
    q.pos = grp.every((x) => q.pos.includes(x))
      ? q.pos.filter((x) => !grp.includes(x))
      : [...new Set([...q.pos, ...grp])];
    UI.render();
  };
  UI.acts.sqMore = () => {
    UI._sq.more = !UI._sq.more;
    UI.render();
  };
  UI.acts.sqReset = () => {
    Object.assign(UI._sq, SQ_DEFAULT(), { filter: 'all' });
    UI.render();
  };
  // His standout stat in words, against the players in his position in his league (blank when you know too little of
  // him to say, or nothing stands out): " · Finishing: outstanding"
  UI.standout = (p) => {
    if (!(W.ownPlayer(p) || FM.Scouting.know(p.id) >= 40)) return '';
    const r = FM.Scouting.peers(p),
      top = r.best[0],
      low = r.worst[0];
    const pick = top && (!low || top.pct - 50 >= 50 - low.pct) ? top : low;
    if (!pick) return '';
    const w = FM.Scouting.wordPct(pick.pct);
    const label = D.ATTR_LABEL[pick.k] || pick.k;
    return ` · <span style="${w.cls ? `color:var(--${w.cls})` : ''}">${esc(label)}: ${w.word.toLowerCase()}</span>`;
  };
  UI.acts.sqAlt = () => {
    UI._sq.alt = !UI._sq.alt;
    UI.render();
  };
  UI.acts.sqStat = () => {
    UI._sq.stat = !UI._sq.stat;
    UI.render();
  };
  UI.acts.sqRev = () => {
    UI._sq.rev = !UI._sq.rev;
    UI.render();
  };
  UI.acts.sqSort = (d) => {
    UI._sq.sort = d.v;
    UI.render();
  };
  UI.acts.sqFilter = (d) => {
    UI._sq.filter = d.v;
    UI.render();
  };
  // Contract end: highlighted in the final season, amber with one season to go
  // Shown first on the line (rows truncate at the end); ordinary contract years only when sorting by contract
  const contractTag = (p, all) => {
    const y = S().year;
    return p.loan
      ? ''
      : p.contract <= y
        ? `<span class="tiny b" style="color:var(--bad)">⏳ Expires</span>`
        : p.contract === y + 1
          ? `<span class="tiny b" style="color:var(--warn)">to ${p.contract}</span>`
          : all
            ? `<span class="tiny dim">to ${p.contract}</span>`
            : '';
  };
  const sqMore = (q) => {
    const sel = (k, opts) =>
      `<select data-input="sqSel" data-k="${k}" style="flex:1;min-width:0;padding:8px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--ink)">${opts.map(([v, l]) => `<option value="${v}" ${q[k] === v ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
    return `<div class="row" style="gap:6px;margin-top:6px">${sel('nat', [
      ['any', 'Any nationality'],
      ['home', 'Homegrown nationals'],
      ['foreign', 'Foreign players'],
    ])}${sel('contract', [
      ['any', 'Any contract'],
      ['now', 'Ends this season'],
      ['next', 'Ends within a year'],
      ['long', 'Three years or more'],
    ])}</div>
      <div class="row" style="gap:6px;margin-top:6px">${sel('level', [
        ['any', 'Any role'],
        ['xi', 'Starting XI'],
        ['rotation', 'Rotation players'],
        ['prospect', 'Prospects (21 and under)'],
        ['surplus', 'Surplus: outside the squad'],
      ])}${sel('foot', [
        ['any', 'Any foot'],
        ['Left', 'Left foot'],
        ['Right', 'Right foot'],
        ['Both', 'Two-footed'],
      ])}</div>`;
  };
  function squadView() {
    const sq = W.squad(club().id),
      q = UI._sq;
    const groups = [
      ['GK', 'Goalkeepers'],
      ['DEF', 'Defenders'],
      ['MID', 'Midfielders'],
      ['ATT', 'Attackers'],
    ];
    const { xi } = W.pickXI(club().id, S().user.tactic);
    const starters = new Set(xi.filter(Boolean).map((p) => p.id));
    const foreign = sq.filter((p) => p.nat !== club().nat).length;
    const expiring = sq.filter((p) => !p.loan && p.contract <= S().year).length;
    const extra = (p) =>
      `${q.sort === 'wage' ? ` · ${U.money(p.wage)}/wk` : ''}${q.sort === 'pa' ? ` · potential ${C.starText(p.pa, p.pos)}` : ''}${starters.has(p.id) ? ' · <span style="color:var(--acc)">XI</span>' : ''}${q.alt ? altLine(p) : ''}${q.stat ? UI.standout(p) : ''}${p.form.length ? ' · ' + U.avg(p.form.slice(-5)).toFixed(1) + ' avg' : ''}`;
    const benchIds = new Set(
      W.pickXI(club().id, S().user.tactic)
        .bench.filter(Boolean)
        .map((p) => p.id),
    );
    const t = q.text.trim().toLowerCase(),
      xiAvg = U.avg(xi.filter(Boolean), (p) => p.ca);
    const keep = (p) => {
      if (!SQ_FILTER[q.filter][1](p, starters, benchIds)) return false;
      if (t && !(W.name(p) + ' ' + p.nat).toLowerCase().includes(t)) return false;
      if (q.pos.length && !q.pos.includes(p.pos)) return false;
      if (!SQ_AGE[q.age][1](W.age(p))) return false;
      if (q.nat === 'home' && p.nat !== club().nat) return false;
      if (q.nat === 'foreign' && p.nat === club().nat) return false;
      if (q.contract === 'now' && !(!p.loan && p.contract <= S().year)) return false;
      if (q.contract === 'next' && !(!p.loan && p.contract <= S().year + 1)) return false;
      if (q.contract === 'long' && !(!p.loan && p.contract >= S().year + 3)) return false;
      if (q.foot !== 'any' && p.foot !== q.foot) return false;
      if (q.level === 'xi' && !starters.has(p.id)) return false;
      if (q.level === 'rotation' && !(!starters.has(p.id) && p.ca >= xiAvg - 6)) return false;
      if (q.level === 'prospect' && !(W.age(p) <= 21 && p.pa >= xiAvg)) return false;
      if (q.level === 'surplus' && !(!starters.has(p.id) && !benchIds.has(p.id) && p.ca < xiAvg - 6)) return false;
      return true;
    };
    const list = sq.filter(keep).sort(SQ_SORT[q.sort][1]);
    if (q.rev && q.sort !== 'pos') list.reverse();
    const asc = SQ_ASC.has(q.sort) !== !!(q.rev && q.sort !== 'pos');
    const chipsRow = (act, cur, map, label = '', more = '') =>
      `<div class="chips noswipe">${label ? `<span class="chip-lbl">${label}</span>` : ''}${Object.entries(map)
        .map(
          ([k, [l]]) => `<button class="chip ${cur === k ? 'on' : ''}" data-act="${act}" data-v="${k}">${l}</button>`,
        )
        .join('')}${more}</div>`;
    const body =
      q.sort === 'pos'
        ? groups
            .map(([g, l]) => {
              const ps = list.filter((p) => D.POS_GROUP[p.pos] === g);
              return ps.length
                ? `<div class="sec"><div class="h3">${l}</div><span class="dim small">${ps.length}</span></div><div class="card flat list" style="padding:4px 12px">${ps.map((p) => C.playerRow(p, extra(p), contractTag(p, q.sort === 'contract'))).join('')}</div>`
                : '';
            })
            .join('')
        : `<div class="card flat list" style="padding:4px 12px">${list.map((p) => C.playerRow(p, extra(p), contractTag(p, q.sort === 'contract'))).join('')}</div>`;
    return `<div class="row small dim" style="margin:0 2px 8px"><span>${U.plural(sq.length, 'player')}</span><span>·</span><span>Wages ${U.money(U.sum(sq, (p) => p.wage))}/wk</span><span class="grow"></span><span>Foreign ${foreign}${FM.Reg.real() ? '' : ` (${W.foreignLimitText()} in squad)`}</span></div>${UI.regLine(club())}
      ${expiring ? `<button class="warnline tap" style="width:100%;text-align:left;border:0" data-act="sqFilter" data-v="expiring">⏳ ${expiring} contract${expiring === 1 ? '' : 's'} expire this season — unsigned players leave on a free. Show them ›</button>` : ''}
      <input type="text" placeholder="Search your squad…" value="${esc(q.text)}" data-input="sqText" style="width:100%;padding:10px 14px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--ink);margin-bottom:4px">
      ${chipsRow('sqSort', q.sort, SQ_SORT, 'Sort', q.sort === 'pos' ? '' : `<button class="chip on" data-act="sqRev" title="Reverse the order">${asc ? '↑ Low to high' : '↓ High to low'}</button>`)}${chipsRow('sqFilter', q.filter, SQ_FILTER, 'Show', `<button class="chip ${q.stat ? 'on' : ''}" data-act="sqStat">Stats in words</button><button class="chip ${q.alt ? 'on' : ''}" data-act="sqAlt">Other positions</button>`)}
      ${UI.posFilter(q.pos, 'sqPos', 'sqPosGroup')}
      <div class="chips noswipe">${Object.entries(SQ_AGE)
        .map(
          ([k, [l]]) =>
            `<button class="chip ${q.age === k ? 'on' : ''}" data-act="sqSet" data-k="age" data-v="${k}">${l}</button>`,
        )
        .join('')}</div>
      ${q.more ? sqMore(q) : ''}
      <div class="row" style="margin:6px 0 8px;gap:6px"><button class="btn sm" data-act="sqMore">${q.more ? 'Fewer filters ▴' : 'More filters ▾'}</button><span class="tiny dim grow">${sqActive() ? `${list.length} of ${U.plural(sq.length, 'player')}` : ''}</span>${sqActive() ? `<button class="btn sm" data-act="sqReset">Clear ${sqActive()} filter${sqActive() === 1 ? '' : 's'}</button>` : ''}</div>
      ${list.length ? body : '<div class="empty">No players match these filters.</div>'}`;
  }
  function academyView() {
    const c = club();
    const grads = W.squad(c.id).filter((p) => p.youth === c.id);
    return `<div class="card"><div class="row"><div class="grow"><div class="h3">Youth Academy</div><div class="small dim">Level ${c.facilities.academy} · Intake arrives around matchday ${Math.round(((D.YOUTH_ROUND + 1) / 22) * (FM.S.comps[c.comp] && FM.S.comps[c.comp].fixtures ? FM.S.comps[c.comp].fixtures.length : 22))}</div></div><div class="lvl">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= c.facilities.academy ? 'on' : ''}"></i>`).join('')}</div></div>
      <div class="small muted" style="margin-top:8px">Academy graduates in squad: <b>${grads.length}</b> · Youth debuts under you: <b>${S().user.stats.youthDebuts}</b></div></div>
      ${UI.youthSides(c)}`;
  }

  // ---------- Tactics ----------
  // The tactic being edited: Plan A (the one matches start with) or Plan B (switch to it in a match)
  const TT = () => (UI._planB ? W.secondTactic() : S().user.tactic);
  function tacticsView() {
    const T = TT(),
      c = club();
    const slots = D.FORMATIONS[T.formation];
    const { xi, bench } = W.pickXI(c.id, T);
    const sel = UI._slot;
    const arm = FM.Matchday.armband(
      { club: c },
      xi.filter(Boolean).map((p) => ({ p })),
    );
    const dots = slots
      .map((s, i) => {
        const p = xi[i];
        const fit = p ? W.fitAt(p, s.t, s, T.roles[i]) : 0;
        return `<div class="slot-dot ${sel === i ? 'sel' : ''}" style="left:${U.clamp(s.y * 100, 11, 89)}%;top:${s.t === 'GK' ? 90 : Math.min(74, 6 + (1 - (s.x - 0.04) / 0.76) * 80)}%" data-act="slot" data-i="${i}"><div class="d" style="background:${c.colors[0]};color:${U.ink(c.colors[0])};${fit < 0.8 ? 'border-color:var(--warn)' : ''}">${p ? W.stars(W.slotOverall(p, s.t, s, T.roles[i]), s.t) : '—'}</div><div class="n">${p && p === arm ? '<b class="capt">C</b>' : ''}${p ? esc(p.ln) : 'Empty'}</div>${p ? `<div class="fr"><div class="f"><i style="width:${Math.round(p.fitness)}%;background:${C.fitColor(p.fitness)}"></i></div><span style="color:${C.fitColor(p.fitness)}">${Math.round(p.fitness)}%</span></div>` : ''}<div class="r">${D.slotLabel(s)} · ${esc(T.roles[i])}</div></div>`;
      })
      .join('');
    const seg = (k, vals) =>
      `<div class="seg" style="margin-top:6px">${vals.map((v) => `<button class="${T[k] === v ? 'on' : ''}" data-act="tac" data-k="${k}" data-v="${v}">${v.replace(' Press', '').replace(' Block', '')}</button>`).join('')}</div>`;
    const planB = !!UI._planB,
      A = S().user.tactic,
      B = S().user.tactic2;
    const plans = `<div class="seg" style="margin-bottom:6px"><button class="${planB ? '' : 'on'}" data-act="tacPlan" data-v="A">Plan A · ${Math.round(A.fam ?? 60)}%</button><button class="${planB ? 'on' : ''}" data-act="tacPlan" data-v="B">Plan B${B ? ` · ${Math.round(B.fam ?? 40)}%` : ''}</button></div>
      <div class="tiny dim" style="margin:0 2px 10px">${planB ? 'Plan B: switch to it during a match from Tactics. It has its own familiarity, which grows when you use it.' : 'Plan A starts every match. Set up a Plan B to switch to during a match (a chase, or shutting up shop).'}${planB ? ` <button class="btn sm" data-act="swapPlans">Make Plan B the starting plan</button>` : ''}</div>`;
    return `${plans}<div class="chips">${Object.keys(D.FORMATIONS)
      .map(
        (f) => `<button class="chip ${T.formation === f ? 'on' : ''}" data-act="formation" data-v="${f}">${f}</button>`,
      )
      .join('')}</div>
      <div class="row small dim" style="margin:-4px 2px 8px"><span>${D.shapeOf(T.formation)}</span><span>·</span><span>XI ${C.starText(U.avg(xi.filter(Boolean), (p) => p.ca))}</span><span>·</span><span>Familiarity ${Math.round(T.fam ?? 60)}%</span><span class="grow"></span><button class="btn sm" data-act="autoXI">Auto-pick</button></div>
      <div class="tpitch noswipe">${dots}</div>
      <div class="small dim center" style="margin:6px 0 12px">Tap a player to change him or his role. Orange ring = out of position. Bar = match fitness — auto-pick rests tired players.</div>
      <div class="card"><div class="h3">Build-up</div>${seg('buildup', D.BUILDUP)}
        <div class="h3" style="margin-top:14px">Pressing</div>${seg('press', D.PRESS)}
        <div class="h3" style="margin-top:14px">Width</div>${seg('width', D.WIDTH)}
        <div class="row" style="margin-top:14px"><div class="grow"><div class="h3">Inverted full-backs</div><div class="small dim">Full-backs step into midfield in possession</div></div><button class="btn sm ${T.invFB ? 'pri' : ''}" data-act="invfb">${T.invFB ? 'On' : 'Off'}</button></div>
        <div class="small muted" style="margin-top:12px;line-height:1.5">${tacticHint(T)}</div></div>
      ${coverCard(T)}
      ${leadershipCard(xi, arm)}
      <div class="sec"><div class="h3">Bench</div></div><div class="card flat list" style="padding:4px 12px">${bench.map((p) => C.playerRow(p)).join('')}</div>`;
  }
  // Squad cover: for the formation you play, how many players in your squad are at home (accomplished or better) in each
  // position it needs against the places to fill, and how the other formations would line up with the squad you have
  UI._cover = false;
  UI.acts.coverToggle = () => {
    UI._cover = !UI._cover;
    UI.render();
  };
  function coverCard(T) {
    if (!UI._cover)
      return `<div class="card"><div class="row"><div class="grow"><div class="h3">Squad cover</div><div class="small dim">Where you are thin in this shape, and which formations your squad suits</div></div><button class="btn sm" data-act="coverToggle">Show</button></div></div>`;
    const c = club(),
      sq = W.squad(c.id).filter((p) => !p.team);
    const slots = D.FORMATIONS[T.formation],
      need = {};
    slots.forEach((s) => (need[s.t] = (need[s.t] || 0) + 1));
    const rows = Object.keys(need).map((t) => {
      const have = sq.filter((p) => (t === 'GK' ? p.pos === 'GK' : p.pos !== 'GK' && W.fitAt(p, t) >= 0.9)).length;
      const k = have < need[t] ? 'bad' : have === need[t] ? 'warn' : 'good';
      return `<span class="chip" style="border-color:var(--${k});color:var(--${k})" title="${have} at home there for ${need[t]} place${need[t] > 1 ? 's' : ''}">${t} ${have}/${need[t]}</span>`;
    });
    // each formation with the squad you have: the XI's average overall in its slots, and where it is weakest
    const fits = Object.keys(D.FORMATIONS)
      .map((f) => {
        const t2 = { ...T, formation: f, roles: W.defaultRoles(f), lineup: null };
        const xi = W.pickXI(c.id, t2).xi,
          sl = D.FORMATIONS[f];
        const ovr = xi.map((p, i) => (p ? W.slotOverall(p, sl[i].t, sl[i], t2.roles[i]) : 0));
        const weak = ovr.reduce((m, v, i) => (i > 0 && v < ovr[m] ? i : m), 1);
        return { f, avg: U.avg(ovr), weak: `${D.slotLabel(sl[weak])} ${C.starText(ovr[weak], sl[weak].t)}` };
      })
      .sort((a, b) => b.avg - a.avg);
    const cur = fits.find((x) => x.f === T.formation);
    return `<div class="card"><div class="row"><div class="grow"><div class="h3">Squad cover</div><div class="small dim">Players at home (accomplished or better) against places to fill in ${esc(T.formation)}. Amber: no cover; red: short.</div></div><button class="btn sm" data-act="coverToggle">Hide</button></div>
      <div class="chips" style="flex-wrap:wrap;margin-top:8px">${rows.join('')}</div>
      <div class="small b dim" style="margin:12px 0 4px">YOUR SQUAD IN EACH SHAPE</div>
      ${fits
        .slice(0, 6)
        .map(
          (x) =>
            `<div class="row small" style="padding:5px 0;border-top:1px solid var(--line)"><span class="grow">${x.f}${x.f === T.formation ? ' <span class="pill acc">now</span>' : ''}</span><span class="dim" style="margin-right:10px">weakest ${esc(x.weak)}</span><b>${C.starText(x.avg)}</b></div>`,
        )
        .join('')}
      ${cur && fits[0].f !== T.formation ? `<div class="tiny dim" style="margin-top:6px">${esc(fits[0].f)} suits this squad better (about ${(Math.round(((fits[0].avg - cur.avg) / W.starStep()) * 20) / 20).toFixed(2)} of a star on the XI).</div>` : ''}</div>`;
  }
  function tacticHint(T) {
    const b = {
      Short: 'Patient short passing — good control, fewer but better chances.',
      Direct: 'Get it forward quickly — more crosses and long shots.',
      Counter: 'Absorb and break — deadly against high-pressing teams.',
      Possession: 'Dominate the ball — starves opponents, can lack cutting edge.',
      'Wing Play': 'Get it wide and into the box — lots of crosses; a Target Man feasts on them.',
    }[T.buildup];
    const w = {
      Narrow: 'Narrow: through the middle, more through balls — but it leaves the flanks to them.',
      Wide: 'Wide: stretch them and cross.',
    }[T.width || 'Balanced'];
    const p = {
      'High Press': 'High press wins the ball high up but tires legs and leaves space behind.',
      'Mid Block': 'Balanced mid block.',
      'Low Block': 'Deep block — hard to break down, but invites pressure.',
    }[T.press];
    return `💡 ${b} ${p}${w ? ' ' + w : ''}`;
  }
  // ---------- Captain & set-piece takers ----------
  const spNum = (v) =>
    `<span class="b" style="width:26px;text-align:right;color:${v >= 15 ? 'var(--good)' : v >= 11 ? 'var(--ink)' : 'var(--warn)'}">${Math.round(v)}</span>`;
  function leadershipCard(xi, arm) {
    const Md = FM.Matchday,
      T = S().user.tactic,
      c = club();
    const capt = Md.captainOf(c.id);
    const row = (act, k, icon, label, p, note, right) =>
      `<div class="prow tap" data-act="${act}" ${k ? `data-k="${k}"` : ''}><span style="width:22px;text-align:center">${icon}</span><div class="grow" style="min-width:0"><div class="small dim">${label}</div><div class="b ellip">${p ? esc(W.name(p)) : '—'}</div>${note ? `<div class="tiny dim">${note}</div>` : ''}</div>${right || ''}<span class="dim">›</span></div>`;
    const captNote = !capt
      ? ''
      : `${Md.leadWord(capt)}${W.hasTrait(capt, 'Leader') ? ' · 🎖️ Leader' : ''}${T.capt ? '' : ' · chosen by the squad'}${arm && arm !== capt ? ` · not in the XI — ${esc(W.short(arm))} wears the armband` : ''}`;
    const sp = Object.entries(Md.SP)
      .map(([k, d]) => {
        const t = Md.takerFor(c.id, k, xi),
          id = T.sp && T.sp[k];
        const note =
          id && !t.chosen && S().players[id]
            ? `${esc(W.short(S().players[id]))} isn't in the XI — ${t.p ? esc(W.short(t.p)) : 'best available'} takes them`
            : t.chosen
              ? 'Your choice'
              : 'Auto — best on the pitch';
        return row('spPick', k, d.icon, d.label, t.p, note, t.p ? spNum(Md.spScore(t.p, k)) : '');
      })
      .join('');
    return `<div class="sec"><div class="h3">Captain & set pieces</div></div><div class="card flat list" style="padding:4px 12px">${row('captPick', '', '©', 'Captain', capt, captNote)}${sp}</div>
      <div class="small dim" style="margin:-4px 2px 12px;line-height:1.5">A strong captain lifts the side and softens defeats; a Leader keeps heads level in team talks. Numbers are set-piece ability out of 20.</div>`;
  }
  UI.acts.captPick = () => {
    const Md = FM.Matchday,
      c = club(),
      capt = Md.captainOf(c.id),
      T = S().user.tactic;
    // Regular starters first (the squad's own pick comes from them), then everyone else
    const regs = new Set(
      W.squad(c.id)
        .sort((a, b) => b.ca - a.ca)
        .slice(0, 16),
    );
    const list = W.squad(c.id)
      .sort((a, b) => regs.has(b) - regs.has(a) || Md.captainScore(b) - Md.captainScore(a))
      .slice(0, 22);
    UI.sheet(
      `<div class="small muted" style="margin-bottom:8px;line-height:1.5">The new captain gets a morale boost; the one who loses the armband may take it badly. Changing again within a few weeks unsettles the squad.</div>
      <div class="list">${list.map((p) => `<div class="prow tap" data-act="setCapt" data-id="${p.id}">${C.pos(p)}<div class="grow" style="min-width:0"><div class="b ellip">${esc(W.name(p))}${p === capt ? ' ©' : ''}</div><div class="small dim">${Md.leadWord(p)}${W.hasTrait(p, 'Leader') ? ' · 🎖️ Leader' : ''} · ${W.age(p)} yrs · ${(W.spell(p) && W.spell(p).apps) || 0} apps${regs.has(p) ? '' : ' · fringe'}</div></div><b style="margin-right:6px">${Math.round(p.ca)}</b><span title="Morale">${W.moraleLabel(p.morale)[1]}</span></div>`).join('')}</div>
      ${T.capt ? `<button class="btn block" style="margin-top:10px" data-act="setCapt" data-id="">Let the squad decide</button>` : ''}`,
      { title: 'Choose your captain' },
    );
  };
  UI.acts.setCapt = (d) => {
    const T = S().user.tactic;
    UI.closeSheet();
    if (!d.id) {
      T.capt = null;
      T.captAuto = null; // the squad chooses afresh
      UI.save();
      UI.render();
      return UI.toast('The squad will pick the captain');
    }
    const msg = FM.Matchday.setCaptain(d.id);
    UI.save();
    UI.render();
    UI.toast(msg, 3500);
  };
  UI.acts.spPick = (d) => {
    const Md = FM.Matchday,
      k = d.k,
      c = club(),
      T = S().user.tactic;
    const { xi } = W.pickXI(c.id, T),
      inXI = new Set(xi.filter(Boolean).map((p) => p.id));
    const cur = Md.takerFor(c.id, k, xi);
    const list = W.squad(c.id)
      .filter((p) => p.pos !== 'GK')
      .sort((a, b) => inXI.has(b.id) - inXI.has(a.id) || Md.spScore(b, k) - Md.spScore(a, k));
    UI.sheet(
      `<div class="small muted" style="margin-bottom:8px">If your taker isn't on the pitch, the best one who is steps up.</div>
      <button class="btn block ${T.sp && T.sp[k] ? '' : 'pri'}" style="margin-bottom:10px" data-act="setSp" data-k="${k}" data-id="">Auto — best on the pitch</button>
      <div class="list">${list.map((p) => `<div class="prow tap" data-act="setSp" data-k="${k}" data-id="${p.id}">${C.pos(p)}<div class="grow" style="min-width:0"><div class="b ellip">${esc(W.name(p))}${cur.chosen && cur.p === p ? ' ✓' : ''}</div><div class="small dim">${inXI.has(p.id) ? 'In the XI' : W.available(p) ? 'Not in the XI' : 'Unavailable'}</div></div>${spNum(Md.spScore(p, k))}</div>`).join('')}</div>`,
      { title: Md.SP[k].label },
    );
  };
  UI.acts.setSp = (d) => {
    const T = S().user.tactic,
      Md = FM.Matchday;
    T.sp = Object.assign({}, T.sp, { [d.k]: d.id || null });
    UI.closeSheet();
    UI.save();
    UI.render();
    UI.toast(
      d.id
        ? `${W.short(S().players[d.id])} takes the ${Md.SP[d.k].label.toLowerCase()}`
        : `${Md.SP[d.k].label}: best on the pitch`,
    );
  };
  UI.acts.tacPlan = (d) => {
    UI._planB = d.v === 'B';
    if (UI._planB) W.secondTactic();
    UI._slot = null;
    UI.save();
    UI.render();
  };
  UI.acts.swapPlans = () => {
    W.swapTactics();
    UI._planB = false;
    UI.save();
    UI.render();
    UI.toast('Plan B is now Plan A: matches start with it');
  };
  UI.acts.formation = (d) => {
    const T = TT();
    T.formation = d.v;
    T.roles = W.defaultRoles(d.v);
    T.lineup = null;
    UI._slot = null;
    UI.save();
    UI.render();
  };
  UI.acts.tac = (d) => {
    TT()[d.k] = d.v;
    UI.save();
    UI.render();
  };
  UI.acts.invfb = () => {
    const T = TT();
    T.invFB = !T.invFB;
    UI.save();
    UI.render();
  };
  UI.acts.autoXI = () => {
    const T = TT(),
      id = club().id;
    T.lineup = null;
    // Compare with a pick that ignores fitness: whoever drops out was rested
    const withFit = new Set(
      W.pickXI(id, T)
        .xi.filter(Boolean)
        .map((p) => p.id),
    );
    const fp = W.fitnessPick;
    W.fitnessPick = () => 1;
    const noFit = W.pickXI(id, T).xi.filter(Boolean);
    W.fitnessPick = fp;
    const rested = noFit.filter((p) => !withFit.has(p.id));
    // ...and gives each starter the role that suits him
    const { xi } = W.pickXI(id, T);
    T.roles = FM.bestRoles(xi, D.FORMATIONS[T.formation], W.defaultRoles(T.formation));
    UI.save();
    UI.render();
    UI.toast(
      rested.length
        ? `Best XI, bench and roles set — ${rested.length} rested for fitness: ${rested.map((p) => `${W.short(p)} (${Math.round(p.fitness)}%)`).join(', ')}`
        : 'Best XI, bench and roles set — everyone is fit enough to start',
      4000,
    );
  };
  UI.acts.slot = (d) => UI.slotPicker(+d.i);
  UI.slotPicker = function (i, inMatch) {
    const T = TT(),
      c = club(),
      s = D.FORMATIONS[T.formation][i];
    const { xi } = W.pickXI(c.id, T);
    const cur = xi[i];
    const roles = Object.keys(D.ROLES[s.t]);
    const cands = W.squad(c.id)
      .filter((p) => (s.t === 'GK') === (p.pos === 'GK'))
      .sort((a, b) => W.effAt(b, s.t, s, T.roles[i]) - W.effAt(a, s.t, s, T.roles[i]));
    UI.sheet(
      `<div class="h3">Role</div><div class="chips" style="margin-top:8px;flex-wrap:wrap">${roles.map((r) => `<button class="chip ${T.roles[i] === r ? 'on' : ''}" data-act="role" data-i="${i}" data-v="${r}">${r}</button>`).join('')}</div>
      <div class="tiny dim" style="margin:-2px 2px 8px">${esc((D.ROLES[s.t][T.roles[i]] || {}).desc || '')}${['FB', 'WB', 'WM', 'W'].includes(s.t) && D.slotSide(s) ? ` · ${D.slotSide(s) === 'L' ? 'Left' : 'Right'} flank: ${(s.t === 'W' || s.t === 'WM') && (D.ROLES[s.t][T.roles[i]] || {}).inv ? 'best with a ' + (D.slotSide(s) === 'L' ? 'right' : 'left') + '-footer cutting inside' : 'best with a ' + (D.slotSide(s) === 'L' ? 'left' : 'right') + '-footer'}` : ''}</div>
      <div class="h3" style="margin-top:6px">Player</div><div class="list">${cands
        .map((p) => {
          const inXI = xi.findIndex((q) => q && q.id === p.id);
          const fit = W.fitAt(p, s.t, s, T.roles[i]);
          const tag = !W.available(p)
            ? p.inj
              ? '🚑 Injured'
              : '🟥 Suspended'
            : inXI === i
              ? 'Selected'
              : inXI >= 0
                ? 'In XI (swap)'
                : '';
          return `<div class="prow tap" data-act="pickSlot" data-i="${i}" data-id="${p.id}">${C.pos(p)}<div class="grow"><div class="b ellip">${esc(W.name(p))} ${cur && cur.id === p.id ? '✓' : ''}</div><div class="small dim">${fit >= 1 ? 'Natural' : fit >= 0.8 ? 'Accomplished' : fit >= 0.6 ? 'Awkward' : 'Unfamiliar'}${tag ? ' · ' + tag : ''}</div></div>${C.fitTag(p.fitness)}<div class="b" style="min-width:40px;text-align:right">${C.starText(W.effAt(p, s.t, s, T.roles[i]), s.t)}</div></div>`;
        })
        .join('')}</div>`,
      { title: `${D.slotLabel(s)} · ${D.POS_NAME[s.t] || s.t}` },
    );
  };
  UI.acts.role = (d) => {
    TT().roles[+d.i] = d.v;
    UI.save();
    UI.closeSheet();
    UI.render();
  };
  UI.acts.pickSlot = (d) => {
    const T = TT(),
      c = club(),
      p = P(d.id);
    if (!W.available(p)) return UI.toast(`${W.short(p)} is unavailable`);
    const { xi } = W.pickXI(c.id, T);
    const lineup = xi.map((q) => (q ? q.id : null));
    const i = +d.i,
      j = lineup.indexOf(p.id);
    if (j >= 0) lineup[j] = lineup[i];
    lineup[i] = p.id;
    T.lineup = lineup;
    UI.save();
    UI.closeSheet();
    UI.render();
  };

  // ======================= PLAYER CARD =======================
  UI.acts.player = (d) => UI.playerSheet(d.id);
  UI.playerSheet = function (pid) {
    const p = P(pid);
    if (!p) return UI.toast('That player has retired.');
    UI.sheet(playerHTML(p), { full: true, title: esc(W.name(p)) });
    const rep = S().user.reports[pid];
    if (rep) rep.isNew = false;
  };
  UI.playerHTML = (p) => playerHTML(p);
  // Second positions he can play (learned, or from the start): "also DM, FB (learning)"
  const altLine = (p) => {
    const alt = W.canPlay(p).map(([t, v]) => `${W.altLabel(p, t)}${v < 0.9 ? ' (learning)' : ''}`);
    return alt.length ? ` · also ${alt.join(', ')}` : '';
  };
  // Every position he could be put in, how at home he is there in words and his overall in it (his own position and any
  // he has learned cost nothing; the rest cost him). Positions under "awkward" are left out.
  const positionsCard = (p, v, own) => {
    if (p.pos === 'GK' || !(own || v.k >= 40)) return '';
    const rows = W.positionTable(p, 0.5).filter((x) => x.t !== 'GK');
    if (rows.length < 2) return '';
    const cls = { natural: 'good', accomplished: 'good', competent: '', unconvincing: 'warn', awkward: 'bad' };
    return `<div class="card"><div class="h3">Positions</div><div class="tiny dim" style="margin-bottom:4px">How at home he is in each position and his rating there${own ? '. Playing and training in a position raises it; a position left alone fades.' : ''}</div>${rows
      .map(
        (x) =>
          `<div class="row small" style="padding:3px 0"><b style="width:44px">${esc(x.t === p.pos ? W.posLabel(p) : W.altLabel(p, x.t))}</b><span class="grow" style="${cls[x.fam] ? `color:var(--${cls[x.fam]})` : ''}">${x.fam}</span><b>${C.starText(x.ovr, x.t)}</b></div>`,
      )
      .join('')}</div>`;
  };
  // Best and worst three stats against the other players in his position (FM.Scouting.peers)
  const peerCard = (p, v, own) => {
    if (!(own || v.k >= 40)) return '';
    const r = FM.Scouting.peers(p),
      comp = p.clubId && S().clubs[p.clubId] && S().comps[S().clubs[p.clubId].comp];
    const label = (k) => D.ATTR_LABEL[k] || k.replace(/([A-Z])/g, ' $1').replace(/^./, (x) => x.toUpperCase());
    const where =
      r.scope === 'league' && comp
        ? `in ${comp.name}`
        : r.scope === 'nation'
          ? `in ${D.NATIONS[S().clubs[p.clubId].nat].name}`
          : 'in the world';
    const line = (x, good) => {
      const t = good ? Math.max(1, 100 - x.pct) : Math.max(1, x.pct);
      return `<div class="row small" style="padding:4px 0"><span>${good ? '✅' : '⚠️'}</span><span class="grow" style="margin-left:8px">${esc(label(x.k))}</span><b style="color:var(--${good ? 'good' : 'bad'})">${good ? 'top' : 'bottom'} ${t}%</b></div>`;
    };
    if (!r.best.length && !r.worst.length) return '';
    return `<div class="card"><div class="h3">Against other ${esc((D.POS_NAME[p.pos] || p.pos).toLowerCase())}s ${esc(where)}</div><div class="tiny dim" style="margin-bottom:4px">His best and worst stats among ${U.plural(r.n, 'player')} in his position${!own && v.k < 70 ? ' (approximate)' : ''}</div>${r.factor < 0.97 ? `<div class="tiny" style="color:var(--warn);margin-bottom:4px">A weaker league than yours: these numbers are discounted by ${Math.round((1 - r.factor) * 100)}%.</div>` : ''}${r.best.map((x) => line(x, true)).join('')}${r.worst.map((x) => line(x, false)).join('')}</div>`;
  };
  // The Analyst view's player card: his numbers this season per 90 minutes as percentiles against the players of his position, what they
  // add up to in words, where his shots came from, and the players whose numbers are nearest his (all public: the season's statistics)
  const profileCard = (p) => {
    const A = FM.Analytics.profile(p);
    const head = '<div class="h3">Analyst profile</div>';
    if (A.thin)
      return `<div class="card">${head}<div class="small dim" style="margin-top:6px">${A.mins ? `Only ${U.plural(A.mins, 'minute')} this season: his numbers need ${A.need} before they say much.` : 'No minutes yet this season.'}</div></div>`;
    const comp = p.clubId && S().clubs[p.clubId] && S().comps[S().clubs[p.clubId].comp];
    const where = A.scope === 'league' && comp ? comp.name : A.scope === 'nation' ? 'his nation' : 'the world';
    const pos = (D.POS_NAME[p.pos] || p.pos).toLowerCase();
    const col = (v) => (v >= 70 ? 'var(--good)' : v <= 30 ? 'var(--bad)' : 'var(--warn)');
    const fmt = (r) =>
      r.v == null
        ? '–'
        : r.unit === '%'
          ? Math.round(r.v * 100) + '%'
          : (r.dec ? r.v.toFixed(r.dec) : Math.round(r.v)) + '';
    const order = ['Attacking', 'Creating', 'Passing', 'Defending', 'Goalkeeping', 'Overall'];
    const bars = order
      .map((g) => {
        const rs = A.rows.filter((x) => x.group === g);
        if (!rs.length) return '';
        return `<div class="small b dim" style="margin:10px 0 2px;text-transform:uppercase;letter-spacing:.6px">${g}</div>${rs
          .map(
            (x) =>
              `<div class="row small" style="padding:3px 0;gap:8px"><span style="width:118px;flex:none">${esc(x.label)}</span><span class="dim" style="width:40px;flex:none;text-align:right">${fmt(x)}</span><span class="grow" style="height:8px;background:var(--line);border-radius:4px;overflow:hidden"><i style="display:block;height:100%;width:${x.pct == null ? 0 : Math.max(3, x.pct)}%;background:${x.pct == null ? 'transparent' : col(x.pct)}"></i></span><b style="width:26px;flex:none;text-align:right;color:${x.pct == null ? 'var(--ink3)' : col(x.pct)}">${x.pct == null ? '–' : x.pct}</b></div>`,
          )
          .join('')}`;
      })
      .join('');
    // his shots, on the half of the pitch he attacks: the size is the chance, a filled circle a goal, a ring a shot on target
    const W2 = 300,
      H2 = 180,
      P0 = 8,
      px = (x) => P0 + ((x - 0.5) / 0.5) * (W2 - 2 * P0),
      py = (y) => P0 + y * (H2 - 2 * P0);
    const ln = 'rgba(255,255,255,.55)';
    const shotMap = A.shots.length
      ? `<svg viewBox="0 0 ${W2} ${H2}" style="width:100%;margin-top:6px;background:#1f7a3f;border-radius:10px"><rect x="${P0}" y="${P0}" width="${W2 - 2 * P0}" height="${H2 - 2 * P0}" fill="none" stroke="${ln}"/><rect x="${px(0.843)}" y="${py(0.2)}" width="${px(1) - px(0.843)}" height="${py(0.8) - py(0.2)}" fill="none" stroke="${ln}"/><rect x="${px(0.948)}" y="${py(0.37)}" width="${px(1) - px(0.948)}" height="${py(0.63) - py(0.37)}" fill="none" stroke="${ln}"/><circle cx="${px(0.5)}" cy="${py(0.5)}" r="26" fill="none" stroke="${ln}"/>${A.shots
          .map(
            ([x, y, xg, o]) =>
              `<circle cx="${px(Math.max(0.5, x))}" cy="${py(y)}" r="${3 + xg * 16}" fill="${o === 2 ? '#fff' : 'none'}" fill-opacity="${o === 2 ? 0.95 : 0}" stroke="${o === 2 ? '#e53935' : '#fff'}" stroke-width="${o === 2 ? 1.6 : o === 1 ? 2 : 1.1}" stroke-opacity="${o ? 1 : 0.5}"><title>xG ${xg.toFixed(2)} · ${['off target or blocked', 'saved', 'goal'][o]}</title></circle>`,
          )
          .join(
            '',
          )}</svg><div class="tiny dim" style="margin-top:4px">${U.plural(A.shots.length, 'shot')} ${A.shotsFrom} · ${U.plural(A.shots.filter((s) => s[3] === 2).length, 'goal')} · ${A.shots.reduce((a, s) => a + s[2], 0).toFixed(1)} xG · circle size is the chance, filled is a goal, ringed is on target</div>`
      : '<div class="small dim" style="margin-top:6px">No shots recorded yet.</div>';
    const sim = A.similar
      .map((s) => {
        const q = P(s.id),
          qc = q && q.clubId && CL(q.clubId);
        return q
          ? `<div class="row small tap" data-act="player" data-id="${q.id}" style="padding:6px 0;border-top:1px solid var(--line);gap:8px">${qc ? C.crest(qc, 16) : ''}<span class="grow ellip">${esc(W.name(q))}</span><span class="dim">${esc(qc ? qc.short : '')} · ${W.age(q)}</span><b>${s.match}%</b></div>`
          : '';
      })
      .join('');
    return `<div class="card">${head}<div class="tiny dim" style="margin-top:2px">${U.plural(A.mins, 'minute')} this season, per 90 against ${A.n} ${esc(pos)}${A.exact ? 's' : ' and the like'} in ${esc(where)} (300 minutes or more). Higher is better.</div><div class="small" style="line-height:1.5;margin-top:8px">${esc(A.summary)}</div>${bars}<div class="small b dim" style="margin:14px 0 2px;text-transform:uppercase;letter-spacing:.6px">Shot map</div>${shotMap}${sim ? `<div class="small b dim" style="margin:14px 0 2px;text-transform:uppercase;letter-spacing:.6px">Players like him</div><div class="tiny dim" style="margin-bottom:2px">The nearest in how they played this season (a match of 100% would be the same profile)</div>${sim}` : ''}</div>`;
  };
  function playerHTML(p) {
    const v = FM.Scouting.view(p),
      c = p.clubId && CL(p.clubId),
      own = v.own;
    const col = c ? c.colors[0] : '#334155';
    const age = W.age(p);
    const [ml, me] = W.moraleLabel(p.morale);
    const avg = p.season.apps ? (p.season.rsum / p.season.apps).toFixed(2) : '—';
    // how much his position asks of an attribute: a key one (its weight is high), one it barely uses, or none at all
    const relW = D.RATE_W[p.pos] || {},
      wMax = Math.max(...Object.values(relW)),
      rel = (k) =>
        (relW[k] || 0) >= wMax * 0.6 ? 'key' : (relW[k] || 0) === 0 && !(k === 'stamina' && p.pos !== 'GK') ? 'na' : ''; // (stamina tires every outfield player)
    const attrs = () => {
      if (!(own || v.k >= 40))
        return `<div class="lock">🔒 Attributes unknown — assign a scout to learn more (${Math.round(v.k)}% known)</div>`;
      const unc = own ? 0 : Math.round((1 - v.k / 100) * 6);
      // numbers, or words against his league's players in his position, or against your own ("your level / his level")
      const mode = UI._attrMode || 'num';
      const words = mode === 'league' ? FM.Scouting.peers(p).pct : null,
        yours = mode === 'you' && !own ? FM.Scouting.yourLevel(p) : null;
      const toggle = `<div class="seg" style="margin:6px 0 4px">${[
        ['num', 'Numbers'],
        ['league', 'His league'],
        ...(own ? [] : [['you', 'Your level']]),
      ]
        .map(([m, l]) => `<button class="${mode === m ? 'on' : ''}" data-act="attrMode" data-v="${m}">${l}</button>`)
        .join('')}</div>`;
      return (
        toggle +
        Object.entries(p.pos === 'GK' ? D.ATTR_GROUPS_GK : D.ATTR_GROUPS)
          .filter(([g]) => g !== 'Goalkeeping' || p.pos === 'GK')
          .map(
            ([g, ks]) =>
              `<div class="small b dim" style="margin:10px 0 2px;text-transform:uppercase;letter-spacing:.6px">${g}</div><div class="attr-grid">${ks
                .map((k) => {
                  if (words || yours) {
                    const w = words ? FM.Scouting.wordPct(words[k]) : yours && yours[k];
                    if (w)
                      return `<div class="attr ${rel(k)}"><span class="muted">${D.ATTR_LABEL[k]}</span><span class="v" style="font-size:12px;${w.cls ? `color:var(--${w.cls})` : ''}">${w.word}</span></div>`;
                  }
                  const val = Math.round(p.attrs[k]);
                  const shown = unc ? `${Math.max(1, val - unc)}–${Math.min(20, val + unc)}` : val;
                  return `<div class="attr ${rel(k)}"><span class="muted">${D.ATTR_LABEL[k]}</span><span class="v ${unc ? '' : C.vcls(val)}">${shown}</span></div>`;
                })
                .join('')}</div>`,
          )
          .join('')
      );
    };
    const said = own ? null : FM.Scouting.say(p, v);
    UI._attrPid = p.id;
    const report = own
      ? ''
      : `${said ? `<div class="card flat"><div class="small" style="line-height:1.5">“${esc(said.text)}”</div><div class="tiny dim" style="margin-top:4px">— ${esc(said.who)}</div><div style="margin-top:8px">${C.bar(said.conf, said.conf >= 70 ? 'var(--good)' : said.conf >= 45 ? 'var(--warn)' : 'var(--bad)')}</div><div class="tiny dim" style="margin-top:2px">Confidence ${said.conf}%</div></div>` : ''}${UI.reportCard(p, v)}`;
    const ownActions = own
      ? UI.ownActions(p)
      : p.loan
        ? W.isUser(p.loan.from)
          ? UI.loanLine(p)
          : `<div class="warnline">On loan at ${esc(CL(p.clubId).name)} from ${esc(CL(p.loan.from).name)} until the end of the season.</div>`
        : '';
    // what is driving his mood, each reason with its size
    const moodCard = () => {
      const fs = FM.People.moodFactors(p);
      return `<div class="card"><div class="row"><div class="h3 grow">Mood</div><span class="small">${W.moraleLabel(p.morale)[1]} ${W.moraleLabel(p.morale)[0]}</span></div>${
        fs.length
          ? fs
              .map(
                (f) =>
                  `<div class="row small" style="padding:5px 0;border-top:1px solid var(--line)"><span class="grow">${esc(f.t)}</span><b style="color:var(--${f.d > 0 ? 'good' : 'bad'})">${f.d > 0 ? '+' : '−'}${Math.abs(f.d)}</b></div>`,
              )
              .join('')
          : '<div class="small dim" style="margin-top:6px">Nothing in particular: he is settled.</div>'
      }<div class="tiny dim" style="margin-top:6px">The biggest things moving his mood, with a rough size. Promises and minutes are where you can act.</div></div>`;
    };
    // this season so far comes first, a row for each club he has played for in it (a mid-season move gets two), then the
    // finished seasons, newest first
    const current = W.seasonRows(p, S().year)
      .reverse()
      .map((r) => ({ ...r, now: true }));
    const history = current.concat((p.history || []).slice().reverse());
    // The nation opens its national-team overview (nations without a national team in the world stay plain text)
    const playsFor = FM.Intl.nationOf(p),
      otherNat = playsFor === p.nat ? p.nat2 : p.nat;
    const nt = S().nteams && S().nteams['n_' + playsFor];
    const natLink = (html) =>
      nt
        ? `<span class="tap" data-act="nation" data-id="${nt.id}" style="text-decoration:underline dotted">${html}</span>`
        : html;
    return `<div class="pcard-hero" style="--c1:${U.heroShade(col)}"><div class="row" style="align-items:flex-start"><div class="grow"><div class="tiny b" style="opacity:.85;letter-spacing:1px;text-transform:uppercase">${p.clubId && p.no ? `#${p.no} · ` : ''}${D.POS_NAME[p.pos]}${altLine(p)} · ${p.foot} foot</div><div class="h1" style="margin-top:6px">${p.fn ? `${esc(p.fn)}<br>` : ''}${esc(p.ln)}</div>${own ? '' : `<div style="margin-top:6px">${UI.followBtn('player', p.id, true)}</div>`}<div class="small" style="margin-top:8px;opacity:.9">${natLink(`${C.flag(playsFor)} ${esc(D.NATIONS[playsFor].name)}`)} · <b title="International appearances">${p.intl && p.intl.caps ? `${p.intl.caps} cap${p.intl.caps === 1 ? '' : 's'}` : 'Uncapped'}</b>${p.nat2 && D.NATIONS[otherNat] ? ` · <span title="${p.alleg ? 'Has chosen to play for ' + esc(D.NATIONS[playsFor].name) : p.natur && p.natur.code === otherNat ? 'Naturalised in ' + p.natur.year : 'Eligible through family'}">${C.flag(otherNat)} ${esc(D.NATIONS[otherNat].name)} (${FM.Intl.uncapped(p) ? 'eligible' : 'not available: capped'})</span>` : ''}${p.heritage && D.HERITAGE_LABEL[p.heritage] ? ` · ${esc(D.HERITAGE_LABEL[p.heritage])} heritage` : ''} · ${age} yrs${c ? ` · <span class="tap" data-act="clubView" data-id="${c.id}" style="text-decoration:underline dotted">${esc(c.name)}</span>` : ''}</div></div>${c ? `<span class="tap" data-act="clubView" data-id="${c.id}">${C.crest(c, 48)}</span>` : ''}</div>
      <div class="row" style="margin-top:14px;gap:14px"><div><div class="tiny" style="opacity:.75">RATING</div>${C.playerStars(p)}<div class="tiny" style="opacity:.85" title="Stars are measured against ${esc(S().comps[W.refComp()].name)}, the league you manage in: three and a half is a typical starter there, five among the best. In a lower league the same player rates higher. The faded stars are his potential.">${C.playerOverall(p)} in the ${esc(S().comps[W.refComp()].name)}${own || v.k >= 40 ? ` · ${C.posOveralls(p)}` : ''}${own && p.pa0 !== undefined && Math.abs(p.pa - p.pa0) >= 4 ? ` · <span title="His potential has ${p.pa > p.pa0 ? 'risen' : 'fallen'} since we first assessed him" style="color:${p.pa > p.pa0 ? '#9be37a' : '#ff9d9d'}">potential ${p.pa > p.pa0 ? '▲' : '▼'}</span>` : ''}</div></div><div><div class="tiny" style="opacity:.75">VALUE</div><b>${own || v.k >= 30 ? U.money(p.value) : '?'}</b></div><div><div class="tiny" style="opacity:.75">WAGE</div><b>${own || v.k >= 30 ? U.money(p.wage) + '/wk' : '?'}</b></div>${own ? `<div><div class="tiny" style="opacity:.75">MORALE</div><b>${me} ${ml}</b></div>` : ''}</div></div>
      <div class="sp"></div>
      ${ownActions}
      ${FM.Season.isIcon(p) ? `<div style="margin-bottom:6px"><span class="trait" title="${esc(`${U.plural(p.career.spells.at(-1).apps, 'appearance')} for ${esc(CL(p.clubId).name)}`)}">⭐ Club icon</span></div>` : ''}
      ${v.traits.length || own ? `<div style="margin-bottom:8px">${(own ? p.traits : v.traits).map((t) => `<span class="trait" title="${esc(D.TRAITS[t].desc)}">${D.TRAITS[t].icon} ${t}</span>`).join('')}${own ? `<span class="trait">🧠 ${esc(p.personality)}</span>` : ''}</div>` : ''}
      ${own && p.traits.length ? `<div class="small dim" style="margin:-2px 2px 12px">${p.traits.map((t) => D.TRAITS[t].desc).join(' ')}</div>` : ''}
      ${report}
      <div class="card"><div class="row"><div class="h3 grow">Profile</div>${!own && v.k < 70 ? '<span class="pill warn">Approximate</span>' : ''}</div>${own || v.k >= 40 ? C.radar(p, !own && v.k < 70) : '<div class="lock">🔒 Profile hidden</div>'}${attrs()}</div>
      ${own ? moodCard() : ''}${positionsCard(p, v, own)}${peerCard(p, v, own)}${profileCard(p)}
      ${p.totw ? `<div class="card"><div class="row small"><span class="grow">Team of the week</span><b>${p.totwY && p.totwY[0] === S().year ? p.totwY[1] : 0} this season · ${p.totw} career</b></div></div>` : ''}<div class="card"><div class="row"><div class="h3 grow">Form</div><span class="small dim">last ${p.form.length}</span></div>
        <div class="row" style="align-items:flex-end;gap:5px;height:70px;margin-top:10px">${p.form.length ? p.form.map((r) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px"><div class="tiny b">${r.toFixed(1)}</div><div style="width:100%;border-radius:4px;height:${(r - 4) * 8}px;background:${r >= 7.5 ? 'var(--good)' : r >= 6.5 ? 'var(--acc2)' : 'var(--bad)'}"></div></div>`).join('') : '<div class="dim small">No appearances yet.</div>'}</div>
</div>
      ${UI.statsCard(p, avg)}
      <div class="card"><div class="h3">Career</div><div class="row small" style="margin:8px 0"><span class="grow muted">Total</span><b>${U.plural(p.career.apps, 'game')} · ${p.pos === 'GK' ? gkSheets(p) : `${U.plural(p.career.goals, 'goal')}`}</b></div>
        ${p.career.spells
          .slice()
          .reverse()
          .map(
            (sp) =>
              `<div class="row small" style="padding:6px 0;border-top:1px solid var(--line)">${CL(sp.c) ? C.crest(CL(sp.c), 18) : ''}<span class="grow ${CL(sp.c) ? 'tap' : ''}" ${CL(sp.c) ? `data-act="clubView" data-id="${sp.c}"` : ''}>${esc(CL(sp.c) ? CL(sp.c).name : '—')}</span><span class="dim">${sp.loan ? 'Loan · ' : sp.fee != null ? `${sp.fee ? U.money(sp.fee) : 'Free'} · ` : ''}${sp.to ? seasonSpan(sp.from, sp.to) : `${seasonSpan(sp.from, null)}–now`}</span><b style="margin-left:8px">${sp.apps}/${sp.goals}</b></div>`,
          )
          .join('')}
        <div class="row small" style="margin-top:8px"><span class="grow muted">International</span><b>${p.intl && p.intl.caps ? natLink(`${C.flag(playsFor)} ${p.intl.caps} cap${p.intl.caps === 1 ? '' : 's'} · ${p.pos === 'GK' ? `${p.intl.cs ?? '—'} clean sheets` : `${p.intl.goals} goal${p.intl.goals === 1 ? '' : 's'}`}`) : `<span class="dim" style="font-weight:600">Uncapped${p.nat2 ? ' · free to choose' : ''}</span>`}</b></div>
        ${p.honours && p.honours.length ? `<div class="row small" style="margin-top:8px"><span class="grow muted">Honours</span><b>${honoursLine(p)}</b></div>` : ''}
        ${trainedRows(p)}
        <div class="row small" style="margin-top:8px"><span class="grow muted">Contract</span><b>until ${p.contract}</b></div></div>
      ${persuadeCard(p)}
      ${bioCard(p)}
      ${UI.seasonsCard(p, history)}
      ${injuryCard(p)}`;
  }
  // A keeper's clean sheets are counted only in the seasons the game has a record of: said so when his career is longer
  const gkSheets = (p) => {
    const cs = (p.history || []).reduce((t, h) => t + (h.cs || 0), 0) + (p.season.cs || 0),
      tracked = (p.history || []).reduce((t, h) => t + (h.apps || 0), 0) + (p.season.apps || 0);
    return p.career.apps > tracked + 2
      ? `${cs} clean sheets in ${U.plural(tracked, 'game')} on record`
      : `${cs} clean sheets`;
  };
  // A span of seasons as the season rows write them: his first and last season at a club (years are the seasons' starts)
  const seasonSpan = (from, to) => {
    const lab = (y) => `${y}/${String((y + 1) % 100).padStart(2, '0')}`;
    return to && to !== from ? `${lab(from)}–${lab(to)}` : lab(from);
  };
  UI.seasonSpan = seasonSpan;
  // This season's numbers: keepers their own (clean sheets, saves, save %, goals prevented), outfielders theirs,
  // with per-90 figures where they say more than totals
  UI.statsCard = function (p, avg) {
    const st = p.season,
      gk = p.pos === 'GK',
      m = st.mins || 0,
      p90 = (x) => (m >= 270 ? ((x * 90) / m).toFixed(2) : '—');
    const cell = (v, l, sub) =>
      `<div class="kpi" style="padding:8px 4px"><div class="v" style="font-size:18px">${v}</div><div class="l">${l}</div>${sub ? `<div class="tiny dim">${sub}</div>` : ''}</div>`;
    const faced = (st.sv || 0) + (st.ga || 0);
    const cells = gk
      ? [
          cell(st.apps, 'Apps', `${m} mins`),
          cell(st.cs || 0, 'Clean sheets'),
          cell(st.ga || 0, 'Conceded', m >= 270 ? `${p90(st.ga || 0)} per 90` : ''),
          cell(st.sv || 0, 'Saves'),
          cell(faced ? Math.round((100 * (st.sv || 0)) / faced) + '%' : '—', 'Save %'),
          cell(
            faced ? ((st.xga || 0) - (st.ga || 0) >= 0 ? '+' : '') + ((st.xga || 0) - (st.ga || 0)).toFixed(1) : '—',
            'Goals prevented',
            'xG faced − conceded',
          ),
          cell(avg, 'Avg rating'),
          cell(st.motm, 'MOTM'),
        ]
      : [
          cell(st.apps, 'Apps', `${m} mins`),
          cell(st.goals, 'Goals', p90(st.goals) !== '—' ? `${p90(st.goals)} per 90` : ''),
          cell(st.ast, 'Assists', p90(st.ast) !== '—' ? `${p90(st.ast)} per 90` : ''),
          cell(st.sh || 0, 'Shots', st.sh ? `${st.sot || 0} on target` : ''),
          cell(st.kp || 0, 'Chances made'),
          cell(st.tk || 0, 'Tackles', st.ic ? `${st.ic} interceptions` : ''),
          cell(avg, 'Avg rating'),
          cell(st.motm, 'MOTM', st.yc || st.rc ? `${st.yc}🟨 ${st.rc}🟥` : ''),
        ];
    return `<div class="card"><div class="row"><div class="h3 grow">${FM.Season.seasonLabel()} season</div>${['DEF'].includes(D.POS_GROUP[p.pos]) && st.cs ? `<span class="tiny dim">${st.cs} clean sheets</span>` : ''}</div>
      <div class="kpis" style="grid-template-columns:repeat(4,1fr);margin-top:8px">${cells.join('')}</div>
      <div class="tiny dim" style="margin-top:6px">Shots, chances, tackles, minutes and keeper numbers come from fully simulated matches.</div></div>`;
  };
  // This season so far and every season he has played, a row per club (a mid-season move gets two)
  UI.seasonsCard = function (p, history) {
    const gk = p.pos === 'GK';
    const head = gk ? ['Apps', 'CS', 'Conc', 'Rtg'] : ['Apps', 'G', 'A', 'Rtg'];
    const row = (h) => {
      const c = CL(h.c);
      const v = gk
        ? [h.apps, h.cs || 0, h.ga || 0, h.r ? h.r.toFixed(2) : '—']
        : [h.apps, h.g, h.a || 0, h.r ? h.r.toFixed(2) : '—'];
      return `<tr><td class="l">${h.y}/${String((h.y + 1) % 100).padStart(2, '0')}${h.now ? ' <span class="tiny" style="color:var(--acc)" title="This season so far">now</span>' : ''}</td><td class="l"><span class="row" style="gap:6px">${c ? C.crest(c, 16) : ''}<span class="ellip ${c ? 'tap' : ''}" ${c ? `data-act="clubView" data-id="${c.id}"` : ''} style="max-width:110px">${c ? esc(c.short) : '—'}</span></span></td>${v.map((x) => `<td>${x}</td>`).join('')}</tr>`;
    };
    // The rows only go back as far as the game has a record: what the Career panel counts beyond them (earlier
    // seasons at a club, and his career before that) comes as rows of its own, so the totals agree
    const extra = [];
    const spells = (p.career && p.career.spells) || [];
    for (const club of new Set(spells.map((x) => x.c))) {
      const sp = spells.filter((x) => x.c === club),
        rows = history.filter((h) => h.c === club);
      const apps = sp.reduce((t, x) => t + (x.apps || 0), 0) - rows.reduce((t, h) => t + h.apps, 0),
        g = sp.reduce((t, x) => t + (x.goals || 0), 0) - rows.reduce((t, h) => t + h.g, 0);
      if (apps > 0) extra.push({ c: club, apps, g: Math.max(0, g), earlier: true });
    }
    const shownApps = history.concat(extra).reduce((t, h) => t + h.apps, 0),
      shownG = history.concat(extra).reduce((t, h) => t + h.g, 0);
    if (p.career && p.career.apps > shownApps)
      extra.push({ apps: p.career.apps - shownApps, g: Math.max(0, p.career.goals - shownG), before: true });
    const extraRow = (h) => {
      const c = h.c && CL(h.c);
      return `<tr><td class="l dim">${h.before ? 'Before' : 'Earlier'}</td><td class="l"><span class="row" style="gap:6px">${c ? C.crest(c, 16) : ''}<span class="ellip dim" style="max-width:110px">${c ? esc(c.short) : 'Other clubs'}</span></span></td><td>${h.apps}</td><td>${gk ? '—' : h.g}</td><td>—</td><td>—</td></tr>`;
    };
    if (!history.length && !extra.length) return '';
    const tot = history.concat(extra).reduce(
      (t, h) => ({
        apps: t.apps + h.apps,
        g: t.g + h.g,
        a: t.a + (h.a || 0),
        cs: t.cs + (h.cs || 0),
        ga: t.ga + (h.ga || 0),
      }),
      { apps: 0, g: 0, a: 0, cs: 0, ga: 0 },
    );
    return `<div class="card"><div class="h3">Season by season</div>
      <table class="t" style="margin-top:8px"><tr><th class="l">Season</th><th class="l">Club</th>${head.map((h) => `<th>${h}</th>`).join('')}</tr>
      ${history
        .map((h, i) => {
          // the seasons at a club the rows do not go back to come right after its last row, not at the foot of the table
          const last = history.findLastIndex((x) => x.c === h.c) === i;
          return (
            row(h) +
            (last
              ? extra
                  .filter((x) => x.earlier && x.c === h.c)
                  .map(extraRow)
                  .join('')
              : '')
          );
        })
        .join('')}${extra
        .filter((x) => !x.earlier || !history.some((h) => h.c === x.c))
        .map(extraRow)
        .join('')}
      <tr style="font-weight:700"><td class="l">Total</td><td></td>${(gk ? [tot.apps, tot.cs, tot.ga, ''] : [tot.apps, tot.g, tot.a, '']).map((x) => `<td>${x}</td>`).join('')}</tr></table></div>`;
  };
  // Where he counts as trained and for whom he is homegrown (the registration rules read the same record)
  const trainedRows = (p) => {
    const R = FM.Reg,
      t = R.trained(p);
    const nat = (code) => (D.NATIONS[code] ? `${C.flag(code)} ${esc(D.NATIONS[code].name)}` : esc(code));
    const where = t.club
      ? `<span class="tap" data-act="clubView" data-id="${t.club.id}">${C.crest(t.club, 16)} ${esc(t.club.name)}</span> <span class="dim" style="font-weight:400">(${nat(t.club.nat)})</span>`
      : `<span class="dim" style="font-weight:400">a youth academy in</span> ${nat(t.home)}`;
    const how =
      t.why === 'academy'
        ? 'came through its academy'
        : t.why === 'record'
          ? `${t.seasons} season${t.seasons > 1 ? 's' : ''} there between 15 and 21`
          : 'his youth club, from before the game began';
    const others = t.nations.filter((n) => n !== t.home);
    const hg = `${nat(t.home)}${others.length ? `<div class="tiny dim" style="font-weight:400">also homegrown for ${others.map(nat).join(', ')}</div>` : ''}`;
    const own = p.clubId && CL(p.clubId) && CL(p.clubId).nat;
    const need = own && R.rulesFor(CL(p.clubId)) && R.rulesFor(CL(p.clubId)).squad;
    return `<div class="row small" style="margin-top:8px;align-items:flex-start"><span class="grow muted">Trained</span><b style="text-align:right">${where}<div class="tiny dim" style="font-weight:400">${how}</div></b></div>
        ${p.draftClub && CL(p.draftClub) ? `<div class="row small" style="margin-top:8px"><span class="grow muted">${p.uni ? 'University route' : 'Drafted'}</span><b>${p.draftYear} · ${esc(CL(p.draftClub).name)}</b></div>` : ''}
        <div class="row small" style="margin-top:8px;align-items:flex-start"><span class="grow muted">Homegrown in</span><b style="text-align:right">${hg}${need ? `<div class="tiny" style="font-weight:400;color:var(--${t.nations.includes(own) ? 'good' : 'warn'})">${t.nations.includes(own) ? 'counts as homegrown here' : 'not homegrown here: takes a place on the squad list'}</div>` : ''}</b></div>`;
  };
  // As national team manager: a player eligible for your nation who plays for another (or has not chosen) can be asked
  // to commit, if he has not yet been capped
  function persuadeCard(p) {
    const s = S(),
      t = s.user.nation && s.nteams[s.user.nation];
    if (!t || (p.nat !== t.code && p.nat2 !== t.code) || FM.Intl.nationOf(p) === t.code) return '';
    const live = FM.Intl.uncapped(p) && p.askY !== s.year,
      ch = FM.Intl.persuadeChance(p);
    return `<div class="card"><div class="h3">🌍 Play for ${esc(t.name)}?</div>
      <div class="small muted" style="margin:6px 0 10px">${
        !FM.Intl.uncapped(p)
          ? `${esc(W.short(p))} has played for ${esc(D.NATIONS[FM.Intl.nationOf(p)].name)} and is tied to them.`
          : `${esc(W.short(p))} is eligible for ${esc(t.name)} and has not been capped. Chances of winning him over: <b>${ch >= 0.6 ? 'good' : ch >= 0.35 ? 'fair' : 'slim'}</b>.${p.askY === s.year ? ' You have asked him this year.' : ''}`
      }</div>
      ${live ? `<button class="btn pri block" data-act="ntPersuade" data-id="${p.id}">Ask him to commit to ${esc(t.name)}</button>` : ''}</div>`;
  }
  // His story in words, from what the game has recorded: where he started, each move and what it cost, his totals,
  // caps, honours and his worst injury. (A long career shows the first move and the latest few.)
  function bioCard(p) {
    const nat = D.NATIONS[p.nat],
      cn = (id) => (CL(id) ? CL(id).name : null),
      sp = p.career.spells.filter((x) => cn(x.c)),
      out = [];
    out.push(
      `Born in ${p.born}, ${/^[aeiou]/i.test(D.POS_NAME[p.pos]) ? 'an' : 'a'} ${D.POS_NAME[p.pos].toLowerCase()}${nat ? ` from ${nat.name}` : ''}${p.nat2 && D.NATIONS[p.nat2] ? `, also eligible for ${D.NATIONS[p.nat2].name}` : ''}${p.heritage && D.HERITAGE_LABEL[p.heritage] ? ` of ${D.HERITAGE_LABEL[p.heritage]} heritage` : ''}.`,
    );
    // players made with the world have games from before their recorded clubs
    const earlier = p.career.apps - p.career.spells.reduce((t, x) => t + x.apps, 0);
    const moves = sp.map((x, i) => {
      const club = cn(x.c),
        span = UI.seasonSpan(x.from, x.to);
      if (x.loan) return `On loan at ${club} (${span}).`;
      if (i === 0 && earlier > 30)
        return `By ${x.from} he was at ${club}, with about ${U.plural(earlier, 'game')} already behind him.`;
      if (i === 0)
        return p.youth === x.c ? `Came through ${club}'s academy.` : `Began his career at ${club} in ${x.from}.`;
      if (x.fee != null)
        return `Joined ${club} in ${x.from} ${x.fee ? `for ${U.money(x.fee)}` : 'on a free transfer'}.`;
      return `Moved to ${club} in ${x.from}.`;
    });
    out.push(...(moves.length > 6 ? [moves[0], '…', ...moves.slice(-4)] : moves));
    const gk = p.pos === 'GK',
      cs = (p.history || []).reduce((t, h) => t + (h.cs || 0), 0) + (p.season.cs || 0);
    if (p.career.apps)
      out.push(
        `${U.plural(p.career.apps, 'game')}${gk ? ` and ${cs} clean sheets` : ` and ${U.plural(p.career.goals, 'goal')}`} so far.`,
      );
    if (p.intl && p.intl.caps)
      out.push(`Capped ${p.intl.caps} times by ${nat ? nat.name : 'his country'}, first in ${p.intl.first}.`);
    const potm = (p.honours || []).filter((h) => h[1] === 'potm').length;
    if (potm) out.push(`Player of the Month ${potm > 1 ? `${potm} times` : 'once'}.`);
    const worst = (p.injHist || []).slice().sort((a, b) => b[2] - a[2])[0];
    if (worst && worst[2] >= 8)
      out.push(`His longest layoff: ${worst[1].toLowerCase()}, ${U.plural(worst[2], 'week')} (${worst[0]}).`);
    return `<div class="card"><div class="h3">Story so far</div><div class="small" style="margin-top:8px;line-height:1.6">${out.map(esc).join(' ')}</div></div>`;
  }
  // Player of the month awards, grouped: "🏅 Player of the Month ×2 (Oct 2026, Jan 2027)"
  function honoursLine(p) {
    const potm = p.honours.filter((h) => h[1] === 'potm');
    return potm.length
      ? `🏅 Player of the Month${potm.length > 1 ? ` ×${potm.length}` : ''} <span class="dim" style="font-weight:400">(${potm
          .slice(-3)
          .map((h) => `${esc(String(h[3]).slice(0, 3))} ${h[0]}`)
          .join(', ')})</span>`
      : '';
  }
  // Injury history: every layoff at a fully simulated club, and a warning when one problem keeps coming back
  function injuryCard(p) {
    const inj = FM.Records.injurySummary(p);
    const now = p.inj
      ? `<div class="warnline" style="margin:10px 0 4px">🚑 ${esc(p.inj.type)} — back in ${FM.Injury.range(FM.Injury.weeksLeft(p))}${p.inj.surgery ? ' (after surgery)' : ''}.</div>`
      : W.ownPlayer(p) && p.injRisk
        ? `<div class="warnline" style="margin:10px 0 4px">🩹 Just back from ${p.injRisk.rushed ? 'a rushed return' : 'injury'} — a higher risk of a setback for the next few weeks.</div>`
        : '';
    if (!inj) return now ? `<div class="card"><div class="h3">Fitness</div>${now}</div>` : '';
    // Same rule as the scout report: another club's medical record is known only once he's well scouted
    const v = FM.Scouting.view(p);
    if (!v.own && !v.injury) return '';
    const seasons = new Set(inj.list.map((x) => x.y)).size;
    return `<div class="card"><div class="row"><div class="h3 grow">Injury history</div><span class="small dim">${inj.list.length} injur${inj.list.length === 1 ? 'y' : 'ies'} · ${U.plural(inj.weeks, 'week')} out${seasons > 1 ? ` · ${U.plural(seasons, 'season')}` : ''}</span></div>
      ${now}${inj.recurring ? `<div class="warnline" style="margin:10px 0 4px">⚠️ Recurring ${esc(inj.recurring.part)} problems — ${inj.recurring.n} in the last two seasons. The medical team advise managing his minutes.</div>` : ''}
      ${inj.list
        .slice()
        .reverse()
        .map(
          (x) =>
            `<div class="row small" style="padding:6px 0;border-top:1px solid var(--line)"><span class="dim" style="width:44px">${x.y}</span><span class="grow">${esc(x.type)}</span><b>${x.weeks}w</b></div>`,
        )
        .join('')}</div>`;
  }

  UI.acts.shortlist = (d) => {
    const sl = S().user.shortlist,
      i = sl.indexOf(d.id);
    i >= 0 ? sl.splice(i, 1) : sl.push(d.id);
    UI.refreshSheet(playerHTML(P(d.id)));
    UI.save();
  };
  UI.acts.listPlayer = (d) => {
    const p = P(d.id);
    p.listed = !p.listed;
    UI.toast(p.listed ? 'Transfer listed — bids will come in when the window is open' : 'Removed from transfer list');
    UI.refreshSheet(playerHTML(p));
    UI.save();
  };
  UI.acts.loanList = (d) => {
    const p = P(d.id);
    p.loanListed = !p.loanListed;
    UI.toast(
      p.loanListed ? 'Loan listed: clubs will ask for him when the window is open' : 'Removed from the loan list',
    );
    UI.refreshSheet(playerHTML(p));
    UI.save();
  };
  UI.acts.offerLoan = (d) => {
    const p = P(d.id),
      r = FM.Market.offerLoan(p);
    UI.toast(r.msg, 4000);
    UI.save();
    UI.render();
    if (document.querySelector('.sheet-wrap') && P(d.id)) UI.refreshSheet(playerHTML(p));
  };
  UI.acts.offerClubs = (d) => {
    const p = P(d.id),
      r = FM.Transfers.offerToClubs(p);
    UI.toast(r.msg, 4000);
    UI.save();
    UI.render();
    if (document.querySelector('.sheet-wrap') && P(d.id)) UI.refreshSheet(playerHTML(p));
  };
  UI.acts.renew = (d) => {
    const p = P(d.id),
      c = club();
    const dem = Math.round((FM.Transfers.wageDemand(p, c) * 1.05) / 50) * 50;
    if (W.hasTrait(p, 'Mercenary') && p.morale < 50)
      return UI.toast(`${W.short(p)} won't discuss a new deal right now`);
    p.contract = Math.max(p.contract, S().year) + 2;
    p.wage = Math.max(p.wage, dem);
    p.morale = Math.min(100, p.morale + 6);
    UI.toast(`${W.short(p)} signs until ${p.contract} on ${U.money(p.wage)}/wk`);
    UI.refreshSheet(playerHTML(p));
    UI.save();
  };
  UI.acts.scoutPlayer = (d) => {
    const p = P(d.id),
      s = S();
    const reg = FM.Scouting.region(p);
    UI.sheet(
      `<div class="small muted" style="margin-bottom:10px">Who should watch ${esc(W.name(p))}? (${D.REGIONS[reg]})</div>${s.user.scouts
        .map((id) => {
          const sc = s.staff[id];
          return `<div class="card row tap" data-act="doScoutPlayer" data-s="${id}" data-id="${p.id}"><div class="grow"><div class="b">${C.flag(sc.nat)} ${esc(sc.fn + ' ' + sc.ln)}</div><div class="small dim">${Math.round(sc.regions[reg] * 100)}% knowledge of ${D.REGIONS[reg]} · ${Math.max(1, Math.round(3 - 2 * sc.regions[reg]))} week(s)</div></div>${C.bar(sc.regions[reg] * 100)}</div>`;
        })
        .join('')}`,
      { title: 'Assign scout' },
    );
  };
  UI.acts.doScoutPlayer = (d) => {
    if (!FM.Scouting.scoutable(P(d.id))) {
      UI.closeSheet();
      return UI.toast(`${W.userClub().name} only look at ${W.userClub().policy.label} players`, 3500);
    }
    FM.Scouting.assign(d.s, { type: 'player', pid: d.id });
    UI.save();
    UI.closeSheet();
    UI.toast('Scout assigned — report arrives after matchdays');
  };

  UI.acts.offer = (d) => {
    const p = P(d.id),
      c = club();
    const ask = FM.Transfers.askPrice(p);
    UI._offer = { pid: p.id, fee: ask, wage: FM.Transfers.wageDemand(p, c) };
    offerSheet();
  };
  function offerSheet(msg) {
    const o = UI._offer,
      p = P(o.pid),
      c = club();
    const ask = FM.Transfers.askPrice(p);
    const max = Math.max(ask * 2, 1e6);
    const html = `<div class="row">${C.pos(p)}<div class="grow b">${esc(W.name(p))}</div>${p.clubId ? C.crest(CL(p.clubId), 26) : ''}</div>
      <div class="small dim" style="margin-top:6px">Budget ${U.money(c.budget)} · Window ${FM.Season.windowOpen() ? '<b style="color:var(--acc)">open</b>' : '<b style="color:var(--bad)">closed</b>'}</div>
      ${p.clubId ? `<div class="h3" style="margin-top:16px">Transfer fee: <span id="ofee">${U.money(o.fee)}</span></div><input type="range" min="0" max="${max}" step="50000" value="${o.fee}" style="width:100%" data-input="offerFee">` : '<div class="h3" style="margin-top:16px">Free agent — no fee</div>'}
      <div class="h3" style="margin-top:12px">Wage: <span id="owage">${U.money(o.wage)}</span>/wk</div><input type="range" min="${Math.round(p.wage * 0.5)}" max="${Math.round(Math.max(p.wage, o.wage) * 2.5)}" step="100" value="${o.wage}" style="width:100%" data-input="offerWage">
      ${msg ? `<div class="reply" style="margin-top:12px">${esc(msg)}</div>` : ''}
      <button class="btn pri block" style="margin-top:16px" data-act="submitOffer">Submit offer</button>`;
    if (document.querySelector('.sheet-wrap:last-child #ofee, .sheet-wrap:last-child #owage')) UI.refreshSheet(html);
    else UI.sheet(html, { title: 'Make an offer' });
  }
  UI.acts.offerFee = (d, el) => {
    UI._offer.fee = +el.value;
    document.getElementById('ofee').textContent = U.money(+el.value);
  };
  UI.acts.offerWage = (d, el) => {
    UI._offer.wage = +el.value;
    document.getElementById('owage').textContent = U.money(+el.value);
  };
  UI.acts.submitOffer = () => {
    const o = UI._offer,
      p = P(o.pid);
    const r = FM.Transfers.offer(o.pid, p.clubId ? o.fee : 0, o.wage);
    if (r.ok) {
      UI.closeAllSheets();
      UI.toast(r.msg, 3500);
      UI.save();
      UI.render();
      return;
    }
    if (r.counter) o.fee = r.counter;
    if (r.wageDemand) o.wage = r.wageDemand;
    offerSheet(r.msg);
  };

  // ======================= SCOUTING =======================
  UI.screens.scout = function () {
    const t = UI.sub.scout,
      s = S();
    const newCount = Object.values(s.user.reports).filter((r) => r.isNew).length;
    const win = FM.Season.windowOpen();
    return (
      `<div class="card flat row" style="padding:10px 14px"><span style="font-size:20px">${win ? '🟢' : '🔴'}</span><div class="grow"><div class="b small">Transfer window ${win ? 'OPEN' : 'closed'}</div><div class="tiny dim">${win ? `Deals can be completed now. ${UI.windowLabel()}.` : 'Opens pre-season and matchdays 12–14.'}</div></div><div class="col" style="align-items:flex-end"><div class="tiny dim">Budget</div><b>${U.money(club().budget)}</b></div></div>` +
      chips('scout', [
        ['scouts', 'Scouts'],
        ['reports', `Reports${newCount ? ` (${newCount})` : ''}`],
        ['search', 'Search'],
        ['shortlist', 'Shortlist'],
        ['market', 'Transfer Centre'],
      ]) +
      { scouts: scoutsView, reports: reportsView, search: searchView, shortlist: shortlistView, market: marketView }[
        t
      ]()
    );
  };
  UI._mk = 'all';
  function marketView() {
    const s = S();
    const all = s.seasonLog.transfers.slice().reverse();
    const intl = all.filter((t) => t.intl);
    const land = (id) => (id && CL(id) ? CL(id).nat : null);
    const flows = {};
    intl.forEach((t) => {
      const k = `${land(t.from)}→${land(t.to)}`;
      flows[k] = flows[k] || { n: 0, fee: 0, from: land(t.from), to: land(t.to) };
      flows[k].n++;
      flows[k].fee += t.fee;
    });
    const list =
      UI._mk === 'intl' ? intl : UI._mk === 'mine' ? all.filter((t) => W.isUser(t.to) || W.isUser(t.from)) : all;
    const spend = U.sum(all, (t) => t.fee);
    return `<div class="kpis"><div class="kpi"><div class="v">${all.length}</div><div class="l">Deals</div></div><div class="kpi"><div class="v">${intl.length}</div><div class="l">International</div></div><div class="kpi"><div class="v">${U.money(spend)}</div><div class="l">Total fees</div></div></div>
      ${
        Object.keys(flows).length
          ? `<div class="card flat"><div class="h3" style="margin-bottom:6px">Cross-border flows</div>${Object.values(
              flows,
            )
              .sort((a, b) => b.fee - a.fee)
              .map(
                (f) =>
                  `<div class="row small" style="padding:5px 0"><span>${C.flag(f.from)} → ${C.flag(f.to)}</span><span class="grow dim">${esc(D.NATIONS[f.from].name)} to ${esc(D.NATIONS[f.to].name)}</span><b>${f.n}</b><span class="dim" style="width:64px;text-align:right">${U.money(f.fee)}</span></div>`,
              )
              .join('')}</div>`
          : ''
      }
      <div class="chips">${[
        ['all', 'All deals'],
        ['intl', 'International'],
        ['mine', 'My club'],
      ]
        .map(([k, l]) => `<button class="chip ${UI._mk === k ? 'on' : ''}" data-act="mk" data-v="${k}">${l}</button>`)
        .join('')}</div>
      <div class="card flat" style="padding:2px 12px">${
        list
          .slice(0, 60)
          .map((t) => {
            const from = t.from && CL(t.from),
              to = CL(t.to);
            return `<div class="row small tap" style="padding:9px 0;border-top:1px solid var(--line)" data-act="player" data-id="${t.pid}"><div class="grow" style="min-width:0"><div class="b ellip">${C.flag(t.nat)} ${esc(t.name)} ${t.intl ? '<span class="pill acc">INTL</span>' : ''}</div><div class="tiny dim ellip">${from ? `${C.flag(from.nat)} ${esc(from.short)}` : 'Free agent'} → ${C.flag(to.nat)} ${esc(to.name)}${t.age ? ` · age ${t.age}` : ''}</div></div>${C.fee(t.fee, W.isUser(t.to) ? 'in' : W.isUser(t.from) ? 'out' : null)}</div>`;
          })
          .join('') || '<div class="empty">No deals yet this season. The market moves when the window is open.</div>'
      }</div>`;
  }
  UI.acts.mk = (d) => {
    UI._mk = d.v;
    UI.render();
  };
  function scoutsView() {
    const s = S();
    return (
      `<div class="small muted" style="margin:0 2px 10px">Scouts have regional strengths. A South America specialist uncovers Argentine talent quickly — but struggles in Asia.</div>` +
      s.user.scouts
        .map((id) => {
          const sc = s.staff[id];
          const a = s.user.assignments.find((x) => x.scout === id);
          const task = !a
            ? '<span class="pill">Idle</span>'
            : a.type === 'region'
              ? `<span class="pill acc">Scouting ${D.REGIONS[a.region]} · ${a.pos === 'any' ? 'all' : FM.Scouting.posLabel(a.pos)} · ≤${a.maxAge}</span>`
              : `<span class="pill acc">Watching ${esc(P(a.pid) ? W.short(P(a.pid)) : '?')} · ${a.weeks}w</span>`;
          return `<div class="card"><div class="row"><div style="font-size:30px">${C.flag(sc.nat)}</div><div class="grow"><div class="b">${esc(sc.fn + ' ' + sc.ln)}</div><div class="small dim">Judging ability ${U.staffText(sc.judge)} · ${esc(sc.personality)}</div></div><button class="btn sm pri" data-act="assignScout" data-id="${id}">Assign</button></div>
        <div class="small muted" style="margin:10px 0 6px">${esc(sc.note)}</div>
        ${Object.entries(D.REGIONS)
          .map(
            ([k, l]) =>
              `<div class="row tiny" style="margin:5px 0"><span style="width:92px" class="dim">${l}</span><div class="grow">${C.bar(sc.regions[k] * 100, sc.regions[k] >= 0.8 ? 'var(--good)' : sc.regions[k] >= 0.45 ? 'var(--acc2)' : 'var(--bad)')}</div></div>`,
          )
          .join('')}
        <div style="margin-top:10px">${task}</div></div>`;
        })
        .join('')
    );
  }
  UI._as = { region: 'SAM', pos: 'any', maxAge: 23 };
  UI.acts.assignScout = (d) => {
    UI._as.scout = d.id;
    assignSheet();
  };
  function assignSheet() {
    const a = UI._as,
      sc = S().staff[a.scout];
    const html = `<div class="h3">Region</div><div class="chips" style="flex-wrap:wrap;margin-top:8px">${Object.entries(
      D.REGIONS,
    )
      .map(
        ([k, l]) =>
          `<button class="chip ${a.region === k ? 'on' : ''}" data-act="as" data-k="region" data-v="${k}">${l} · ${Math.round(sc.regions[k] * 100)}%</button>`,
      )
      .join('')}</div>
      <div class="h3">Position</div><div class="chips" style="margin-top:8px">${[
        ['any', 'Any'],
        ['GK', 'GK'],
        ['DEF', 'DEF'],
        ['MID', 'MID'],
        ['ATT', 'ATT'],
      ]
        .map(
          ([k, l]) =>
            `<button class="chip ${a.pos === k ? 'on' : ''}" data-act="as" data-k="pos" data-v="${k}">${l}</button>`,
        )
        .join('')}</div>
      <div class="h3">Max age</div><div class="chips" style="margin-top:8px">${[19, 21, 23, 27, 35].map((v) => `<button class="chip ${a.maxAge === v ? 'on' : ''}" data-act="as" data-k="maxAge" data-v="${v}">≤ ${v}</button>`).join('')}</div>
      <button class="btn pri block" data-act="doAssign" style="margin-top:8px">Send ${esc(sc.fn)} to ${D.REGIONS[a.region]}</button>`;
    if (document.querySelector('.sheet-wrap')) UI.refreshSheet(html);
    else UI.sheet(html, { title: 'Scouting assignment' });
  }
  UI.acts.as = (d) => {
    UI._as[d.k] = d.k === 'maxAge' ? +d.v : d.v;
    assignSheet();
  };
  UI.acts.doAssign = () => {
    const a = UI._as;
    FM.Scouting.assign(a.scout, { type: 'region', region: a.region, pos: a.pos, maxAge: a.maxAge });
    UI.save();
    UI.closeSheet();
    UI.render();
    UI.toast('Reports will arrive after each matchday');
  };

  function reportsView() {
    const s = S();
    const reps = Object.entries(s.user.reports)
      .filter(([pid]) => P(pid) && !W.isUser(P(pid).clubId))
      .sort((a, b) => b[1].year - a[1].year || b[1].day - a[1].day);
    if (!reps.length)
      return '<div class="empty">No reports yet.<br>Assign a scout to a region, then play a matchday.</div>';
    return `<div class="card flat list" style="padding:4px 12px">${reps
      .slice(0, 60)
      .map(([pid, r]) => {
        const p = P(pid);
        const v = FM.Scouting.view(p);
        return C.playerRow(p, ` · ${r.isNew ? '<span style="color:var(--acc)">NEW</span> · ' : ''}${esc(v.verdict)}`);
      })
      .join('')}</div>`;
  }
  UI._q = { text: '', pos: 'any', region: 'any' };
  function searchView() {
    const q = UI._q,
      s = S();
    let ps = Object.values(s.players).filter((p) => !p.retired && !W.ownPlayer(p) && FM.Scouting.scoutable(p));
    if (q.text)
      ps = ps.filter((p) =>
        (W.name(p) + ' ' + (p.clubId ? CL(p.clubId).name : '')).toLowerCase().includes(q.text.toLowerCase()),
      );
    if (q.pos !== 'any') ps = ps.filter((p) => D.POS_GROUP[p.pos] === q.pos);
    if (q.region !== 'any') ps = ps.filter((p) => FM.Scouting.region(p) === q.region);
    ps.sort((a, b) => FM.Scouting.know(b.id) - FM.Scouting.know(a.id) || b.value - a.value);
    return `<input type="text" placeholder="Search players or clubs…" value="${esc(q.text)}" data-input="searchText" style="width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:var(--card);margin-bottom:10px">
      <div class="chips">${[
        ['any', 'All'],
        ['GK', 'GK'],
        ['DEF', 'DEF'],
        ['MID', 'MID'],
        ['ATT', 'ATT'],
      ]
        .map(
          ([k, l]) =>
            `<button class="chip ${q.pos === k ? 'on' : ''}" data-act="q" data-k="pos" data-v="${k}">${l}</button>`,
        )
        .join('')}</div>
      <div class="chips">${[['any', 'Everywhere'], ...Object.entries(D.REGIONS)].map(([k, l]) => `<button class="chip ${q.region === k ? 'on' : ''}" data-act="q" data-k="region" data-v="${k}">${l}</button>`).join('')}</div>
      <div class="card flat list" style="padding:4px 12px" id="searchRes">${
        ps
          .slice(0, 50)
          .map((p) => C.playerRow(p, ` · ${Math.round(FM.Scouting.know(p.id))}% known${UI.standout(p)}`))
          .join('') || '<div class="empty">No matches</div>'
      }</div>`;
  }
  UI.acts.q = (d) => {
    UI._q[d.k] = d.v;
    UI.render();
  };
  let searchT;
  UI.acts.searchText = (d, el) => {
    UI._q.text = el.value;
    clearTimeout(searchT);
    searchT = setTimeout(() => {
      const pos = el.selectionStart;
      UI.render();
      const i = document.querySelector('[data-input="searchText"]');
      i.focus();
      i.setSelectionRange(pos, pos);
    }, 250);
  };
  function shortlistView() {
    const sl = S().user.shortlist.filter(P);
    return sl.length
      ? `<div class="card flat list" style="padding:4px 12px">${sl.map((id) => C.playerRow(P(id), ` · ${Math.round(FM.Scouting.know(id))}% known${UI.standout(P(id))}`)).join('')}</div>`
      : '<div class="empty">Your shortlist is empty. Tap ☆ on a player card.</div>';
  }

  // ======================= LEAGUE =======================
  UI.screens.league = function () {
    const t = UI.sub.league || (UI.sub.league = myComp());
    const mine = myComp(),
      lname = (c) => (c.nat && c.nat !== 'ENG' ? C.flag(c.nat) + ' ' : '') + c.name.replace('The ', '');
    const opts = [[mine, lname(S().comps[mine])]];
    if (S().comps[t] && S().comps[t].type === 'league' && t !== mine) opts.push([t, lname(S().comps[t])]);
    opts.push(['world', '🗺️ All leagues']);
    if (W.cups().length || W.continentals().length) opts.push(['cups', 'Cups']);
    opts.push(
      ['fixtures', 'Fixtures'],
      ['totw', 'Team of the week'],
      ['awards', 'Awards'],
      ['stats', 'Stats'],
      ['charts', '📈 Charts'],
    );
    return (
      chips('league', opts) +
      (t === 'fixtures'
        ? fixturesView()
        : t === 'totw'
          ? totwView()
          : t === 'awards'
            ? awardsView()
            : t === 'charts'
              ? chartsView()
              : t === 'stats'
                ? statsView()
                : t === 'cups'
                  ? cupsView()
                  : t === 'world'
                    ? worldView()
                    : tableView(t))
    );
  };
  // International football has its own tab: national teams, rankings, tournaments and your national job
  UI.screens.intl = () =>
    FM.S.nteams ? UI.intlView() : '<div class="empty">International football starts with your first season.</div>';
  // Every league in the world, grouped by continent, with its simulation tier
  function worldView() {
    const s = S(),
      cont = { EUR: 'Europe', ENG: 'Europe', SAM: 'South America', NAM: 'North America', ASIA: 'Asia', AFR: 'Africa' };
    const by = {};
    W.leagues().forEach((l) => {
      const k = cont[D.NATIONS[l.nat].region];
      (by[k] = by[k] || []).push(l);
    });
    const tierPill = (sim) =>
      `<span class="pill ${sim === 'full' ? 'acc' : ''}" title="${FM.Tiers.LABEL[sim]}" style="font-size:10px">${FM.Tiers.ICON[sim]} ${sim}</span>`;
    return (
      `<div class="small muted" style="margin:0 2px 10px;line-height:1.5">${U.plural(W.leagues().length, 'league')} in three simulation tiers. <b>Full</b>: every match in the engine. <b>Light</b>: every fixture played by a fast statistical model. <b>Minimal</b>: scores only — squads exist for scouting. Tap a league for its table.</div>` +
      ['Europe', 'South America', 'North America', 'Asia', 'Africa']
        .filter((k) => by[k])
        .map(
          (k) =>
            `<div class="sec"><div class="h3">${k}</div></div><div class="card flat" style="padding:2px 12px">${by[k]
              .sort((a, b) => (a.nat + a.tier).localeCompare(b.nat + b.tier))
              .map((l) => {
                const t = W.sortedTable(l)[0];
                return `<div class="row small tap" style="padding:9px 0;border-top:1px solid var(--line)" data-act="sub" data-k="league" data-v="${l.id}"><span style="font-size:18px">${C.flag(l.nat)}</span><div class="grow" style="min-width:0"><div class="b ellip">${esc(l.name)}${club() && l.id === club().comp ? ' <span class="pill acc">You</span>' : ''}</div><div class="tiny dim ellip">Tier ${l.tier} · ${U.plural(l.clubs.length, 'club')}${l.rules.qualify ? ` · top ${l.rules.qualify.n} → ${esc(s.comps[l.rules.qualify.to].short)}` : ''} · leader ${t && t.p ? esc(CL(t.id).short) : '—'}</div></div>${tierPill(l.sim || 'full')}</div>`;
              })
              .join('')}</div>`,
        )
        .join('')
    );
  }
  function tableView(cid) {
    const s = S(),
      comp = s.comps[cid],
      t = W.sortedTable(comp),
      R = comp.rules,
      n = t.length;
    const zone = (i) =>
      R.relegate && i >= n - R.relegate.n
        ? 'zone-down'
        : R.promote && i < R.promote.auto
          ? 'zone-up'
          : R.promote && R.promote.tie && i === R.promote.auto
            ? 'zone-po'
            : R.promote && R.promote.playoff && i + 1 >= R.promote.playoff[0] && i + 1 <= R.promote.playoff[1]
              ? 'zone-po'
              : i === 0
                ? 'zone-up'
                : R.qualify && i < R.qualify.n
                  ? 'zone-po'
                  : '';
    const legend = [
      R.promote ? `🟢 Promotion (${R.promote.auto})` : '🟢 Champion',
      R.promote
        ? R.promote.playoff
          ? `🔵 Playoffs (${R.promote.playoff.join('–')})`
          : R.promote.tie
            ? `🔵 Relegation play-off (${R.promote.auto + 1})`
            : ''
        : R.qualify
          ? `🔵 ${s.comps[R.qualify.to].name} (top ${R.qualify.n})`
          : '',
      R.relegate
        ? `🔴 Relegation (${R.relegate.n})${R.relegate.playoff ? ` · play-off (${n - R.relegate.n})` : ''}`
        : '',
    ].filter(Boolean);
    const po = comp.playoff;
    const tier =
      comp.sim && comp.sim !== 'full'
        ? `<div class="warnline" style="margin-bottom:8px">${FM.Tiers.ICON[comp.sim]} ${FM.Tiers.LABEL[comp.sim]} — ${comp.sim === 'light' ? 'results come from a fast statistical model; player stats are recorded.' : 'scores only; squads exist for scouting.'}</div>`
        : '';
    const tableHTML = (rows, zoneOf, title) =>
      `${title ? `<div class="h3" style="margin:10px 4px 4px">${esc(title)}</div>` : ''}<div class="card flat" style="padding:6px 10px"><table class="t"><tr><th>#</th><th class="l">Club</th><th>P</th><th>GD</th><th>Pts</th><th class="l">Form</th></tr>${rows.map((r, i) => `<tr class="${zoneOf(i)} ${W.isUser(r.id) ? 'me' : ''} tap" data-act="clubView" data-id="${r.id}"><td>${i + 1}</td><td class="l"><div class="row" style="gap:6px">${C.crest(CL(r.id), 18)}<span class="ellip" style="max-width:130px">${esc(CL(r.id).name)}</span></div></td><td>${r.p}</td><td>${r.gd > 0 ? '+' : ''}${r.gd}</td><td class="b">${r.pts}</td><td class="l">${C.form(r.form.slice(-3))}</td></tr>`).join('')}</table></div>`;
    const mls = R.mls && comp.conf;
    const torn = comp.torneos,
      groups = comp.groups && R.split;
    const confNames = mls ? Object.keys(R.conferences) : [];
    const byConf = mls && UI._confView !== 'all';
    // two tournaments a year: the one on show (the second once it has started), or the season's table
    const started2 =
      torn &&
      comp.fixtures
        .slice(comp.torneoHalf)
        .flat()
        .some((f) => f.res);
    const tv = torn ? (UI._torneoView === undefined ? (started2 ? 1 : 0) : UI._torneoView) : null;
    const finals = R.playoffs && R.playoffs.type === 'finals6';
    let tables, shown;
    if (byConf) {
      tables = confNames
        .map((cn) =>
          tableHTML(
            W.confTable(comp, cn),
            (i) => (i < R.mls.playoff ? (i === 0 ? 'zone-up' : 'zone-po') : ''),
            `${cn}ern Conference`,
          ),
        )
        .join('');
      shown = comp.ko && comp.ko[0];
    } else if (torn && tv !== 'all') {
      const cut = comp.zones ? 8 : 6;
      tables = comp.zones
        ? ['A', 'B']
            .map((z) =>
              tableHTML(
                W.torneoTable(comp, tv, z),
                (i) => (i === 0 ? 'zone-up' : i < cut ? 'zone-po' : ''),
                `${torn[tv].name} · Zone ${z}`,
              ),
            )
            .join('')
        : tableHTML(
            W.torneoTable(comp, tv),
            (i) => (i < 6 ? (i === 0 ? 'zone-up' : 'zone-po') : i < 10 ? 'zone-po' : ''),
            torn[tv].name,
          );
      shown = comp.ko && comp.ko[tv];
    } else if (groups) {
      tables = comp.groups
        .map((ids, g) =>
          tableHTML(
            t.filter((r) => ids.includes(r.id)),
            (i) => (g === 0 && i === 0 ? 'zone-up' : ''),
            R.split.names[g],
          ),
        )
        .join('');
    } else {
      tables = tableHTML(t, (i) => (finals && i < 6 && i > 0 ? 'zone-po' : zone(i)));
      if (finals || torn) shown = comp.ko && comp.ko[0];
    }
    const chip = (on, act, v, label) =>
      `<button class="chip ${on ? 'on' : ''}" data-act="${act}" data-v="${v}">${label}</button>`;
    const confChips = mls
      ? `<div class="row" style="gap:6px;margin:0 2px 6px">${chip(byConf, 'confView', 'conf', 'Conferences')}${chip(!byConf, 'confView', 'all', "Overall (Supporters' Shield)")}</div>`
      : torn
        ? `<div class="row" style="gap:6px;margin:0 2px 6px">${torn.map((x, i) => chip(tv === i, 'torneoView', i, esc(x.name))).join('')}${chip(tv === 'all', 'torneoView', 'all', 'Season')}</div>`
        : '';
    const splitNote = groups
      ? `<div class="tiny dim" style="margin:0 4px 8px">${comp.split && comp.split.done ? `Split after round ${R.split.after}` : `Splits after round ${R.split.after} into ${R.split.groups.join(' / ')}`}${R.split.halve ? ': points are halved' : ': points carry over'}.</div>`
      : R.split
        ? `<div class="tiny dim" style="margin:0 4px 8px">Splits after round ${R.split.after} into ${R.split.groups.join(' / ')}${R.split.halve ? ', points halved' : ''}.</div>`
        : '';
    const mlsLegend = mls
      ? byConf
        ? [`🟢 Conference leader`, `🔵 Playoffs (top ${R.mls.playoff})`]
        : [`🟢 Supporters' Shield`, `🔵 ${s.comps[R.qualify.to].name} (top ${R.qualify.n})`]
      : torn && tv !== 'all'
        ? [
            comp.zones ? '🔵 Knockouts (top 8 of each zone)' : '🟢 Direct to the quarter-finals (top 6)',
            ...(comp.zones ? [] : ['🔵 Play-in (7–10)']),
          ]
        : finals
          ? ['🟢 Champion', '🔵 Finals (top 6)']
          : null;
    const bracket = shown ? UI.koBracket(comp, shown) : '';
    return `<div class="row" style="margin:0 2px 6px"><span class="grow"></span>${UI.followBtn('comp', cid, true)}</div>${tier}${confChips}${splitNote}${UI.travelNote ? UI.travelNote(comp) : ''}${tables}${UI.expansionCard(comp)}
      <div class="row tiny dim" style="gap:12px;margin:0 4px 12px;flex-wrap:wrap">${(mlsLegend || legend).map((l) => `<span>${l}</span>`).join('')}</div>
      ${bracket}${po ? `<div class="card"><div class="h3">Playoffs</div>${po.sf.map((f) => fxLine(f)).join('')}${(po.sf2 || []).map((f) => fxLine(f)).join('')}${po.final ? fxLine(po.final) : ''}</div>` : ''}${UI.compHistoryCard ? `<div class="card flat">${UI.compHistoryCard(comp)}</div>` : ''}`;
  }
  // A title playoff bracket: the seeds, then each round's ties
  UI.koBracket = function (comp, M) {
    const type = W.koType(comp),
      rows = [];
    for (const k of ['M1', 'M2', 'M3', 'M4']) {
      const ties = M[k] || [];
      if (!ties.length) continue;
      rows.push(
        `<div class="small b dim" style="margin:10px 0 2px">${esc(FM.Season.KO_ROUNDS[type][k]).toUpperCase()}</div>${ties.map((f) => fxLine(f)).join('')}`,
      );
    }
    const seeds = Object.entries(M.seeds)
      .map(
        ([cn, ids]) =>
          `<div class="tiny dim" style="margin-top:4px">${cn === 'all' ? '' : `<b>${esc(cn)}</b>: `}${ids.map((id, i) => `${i + 1} ${esc(CL(id).short)}`).join(' · ')}</div>`,
      )
      .join('');
    return `<div class="card"><div class="h3">Playoffs</div>${seeds}${rows.join('')}</div>`;
  };
  UI.acts.torneoView = (d) => {
    UI._torneoView = d.v === 'all' ? 'all' : +d.v;
    UI.render();
  };
  UI.acts.confView = (d) => {
    UI._confView = d.v;
    UI.render();
  };
  const stagePill = (po) => {
    const [base, leg] = po.split(' · ');
    const b =
      base === 'Semi-final'
        ? 'SF'
        : base === 'Final' || base === 'Playoff Final'
          ? 'Final'
          : base === 'Quarter-final'
            ? 'QF'
            : base.replace('Round of ', 'R').replace('First round', 'R1').replace('Round ', 'R');
    return b + (leg === '1st leg' ? ' L1' : leg === '2nd leg' ? ' L2' : '');
  };
  UI.stagePill = stagePill;
  function fxLine(f) {
    const r = f.res;
    return `<div class="row small tap" style="padding:8px 0;border-top:1px solid var(--line)" ${r ? `data-act="matchReport" data-id="${f.id}"` : ''}>${f.po && !f.group ? `<span class="pill">${stagePill(f.po)}</span>` : ''}<span class="grow ellip" style="text-align:right;${W.isUser(f.h) ? 'font-weight:800' : ''}" data-act="clubView" data-id="${f.h}">${esc(CL(f.h).name)}</span>${C.crest(CL(f.h), 18)}<b style="min-width:44px;text-align:center">${r ? `${r.hg}–${r.ag}` : 'v'}</b>${C.crest(CL(f.a), 18)}<span class="grow ellip" style="${W.isUser(f.a) ? 'font-weight:800' : ''}" data-act="clubView" data-id="${f.a}">${esc(CL(f.a).name)}</span></div>${r && (r.pens || r.agg) ? `<div class="tiny dim center">${r.agg ? `agg ${r.agg[0]}–${r.agg[1]}${r.pens ? '' : r.agg[0] === r.agg[1] && r.win != null ? ' · away goals' : ''}` : ''}${r.agg && r.pens ? ' · ' : ''}${r.pens ? `pens ${r.pens[0]}–${r.pens[1]}` : ''}</div>` : ''}`;
  }
  UI.fxLine = fxLine;
  // Where your league or cups play by rules of their own (a world definition's), in a line each
  UI.ownRules = () => {
    const c = club(),
      s = S();
    if (!c) return '';
    const lines = [];
    const text = (id, label) => {
      const p = W.playRules(id),
        bits = [];
      if (p.win != null) bits.push(`${U.plural(p.win, 'point')} for a win`);
      if (p.subs != null) bits.push(`${p.subs} substitutes`);
      if (p.extraTime === false) bits.push('no extra time');
      if (p.awayGoals === true) bits.push('away goals count');
      if (bits.length) lines.push(`${label}: <b>${bits.join(', ')}</b>`);
    };
    text(c.comp, esc(s.comps[c.comp].name));
    for (const cc of [...W.cups(), ...W.continentals()]) if (cc.clubs.includes(c.id)) text(cc.id, esc(cc.name));
    return lines.length ? `${lines.join('<br>')}<br>` : '';
  };
  // Your fixtures: the whole season in date order, every competition, with the days of rest before each match
  UI._fx = { comp: 'all', when: 'next' };
  UI.acts.fxSet = (d) => {
    UI._fx[d.k] = d.v;
    UI.render();
  };
  const restPill = (r) =>
    r.rest == null
      ? ''
      : `<span class="tiny b" style="color:var(--${r.rest <= 2 ? 'bad' : r.rest === 3 ? 'warn' : 'dim'})">${r.rest}d rest</span>`;
  function fixturesView() {
    const s = S(),
      c = club();
    if (!c) return '<div class="empty">Take a job to see your fixtures.</div>';
    const all = FM.Season.schedule(c.id),
      q = UI._fx;
    const kindOf = (r) =>
      r.comp.type === 'league'
        ? 'league'
        : r.comp.type === 'continental' || r.comp.type === 'world'
          ? 'continental'
          : 'cups';
    const isPast = (r) => !r.tbd && r.f.res;
    let rows = all.filter((r) => q.comp === 'all' || kindOf(r) === q.comp);
    if (q.when === 'next') rows = rows.filter((r) => !isPast(r));
    else if (q.when === 'played') rows = rows.filter(isPast);
    // the spell ahead: how many matches in the next fortnight, and how short the rest is
    const today = (s.calendar[s.day] || {}).dn ?? 0,
      ahead = all.filter((r) => !r.tbd && !isPast(r) && r.dn <= today + 14);
    const crowded = ahead.filter((r) => r.rest != null && r.rest <= 3).length;
    const spell = `<div class="card flat small"><div class="row"><span class="grow">Next 14 days</span><b>${ahead.length} match${ahead.length === 1 ? '' : 'es'}</b></div>${
      crowded >= 2
        ? `<div class="tiny" style="color:var(--warn);margin-top:6px">⚠️ ${crowded} of them come within three days of another match. Rotate: tired players tire more and get hurt more.</div>`
        : `<div class="tiny dim" style="margin-top:6px">${ahead.length > 2 ? 'A busy spell, but with room to recover.' : 'A light spell: a good time for a friendly or to rest the first team.'}</div>`
    }</div>`;
    const bar = `<div class="chips noswipe">${[
      ['all', 'All'],
      ['league', 'League'],
      ['cups', 'Cups'],
      ['continental', 'Continental'],
    ]
      .map(
        ([v, l]) =>
          `<button class="chip ${q.comp === v ? 'on' : ''}" data-act="fxSet" data-k="comp" data-v="${v}">${l}</button>`,
      )
      .join('')}</div><div class="chips noswipe">${[
      ['next', 'Coming up'],
      ['played', 'Played'],
      ['all', 'Whole season'],
    ]
      .map(
        ([v, l]) =>
          `<button class="chip ${q.when === v ? 'on' : ''}" data-act="fxSet" data-k="when" data-v="${v}">${l}</button>`,
      )
      .join('')}</div>`;
    const line = (r) => {
      const day = W.seasonDate(r.dn),
        wd = day.getUTCDay(),
        mid = wd >= 2 && wd <= 4;
      const left = `<div style="width:70px"><div class="tiny b">${W.dateText(r.dn)}</div><div class="tiny dim">${mid ? 'Midweek' : 'Weekend'}</div></div>`;
      if (r.tbd)
        return `<div class="row small" style="padding:8px 0;border-top:1px solid var(--line);gap:8px">${left}<div class="grow"><div class="b ellip">${esc(r.comp.name)}</div><div class="tiny dim">${esc(r.text || 'Next round')} · opponent not yet drawn</div></div>${restPill(r)}</div>`;
      const f = r.f,
        home = f.h === c.id,
        opp = CL(home ? f.a : f.h),
        res = f.res;
      const out = res
        ? (home ? res.hg : res.ag) > (home ? res.ag : res.hg) || (res.win != null && res.win === (home ? 0 : 1))
          ? ['W', 'good']
          : (home ? res.hg : res.ag) < (home ? res.ag : res.hg)
            ? ['L', 'bad']
            : res.pens
              ? (home ? res.pens[0] > res.pens[1] : res.pens[1] > res.pens[0])
                ? ['W', 'good']
                : ['L', 'bad']
              : ['D', 'dim']
        : null;
      const where =
        r.comp.type === 'league'
          ? ''
          : `${esc(r.comp.short || r.comp.name)}${f.po ? ' · ' + esc(f.po) : f.group ? ' · Group' : ''} · `;
      return `<div class="row small tap" style="padding:8px 0;border-top:1px solid var(--line);gap:8px" ${res ? `data-act="matchReport" data-id="${f.id}"` : `data-act="clubView" data-id="${opp.id}"`}>${left}${C.crest(opp, 22)}<div class="grow" style="min-width:0"><div class="b ellip">${home ? 'v' : 'at'} ${esc(opp.name)}${c.rival === opp.id ? ' ⚔️' : ''}</div><div class="tiny dim ellip">${where}${home ? 'Home' : f.neutral ? 'Neutral' : 'Away'}${r.load >= 4 ? ` · <span style="color:var(--warn)">${U.plural(r.load, 'game')} in 14 days</span>` : ''}</div></div>${res ? `<span class="b" style="color:var(--${out[1]})">${out[0]} ${home ? res.hg : res.ag}–${home ? res.ag : res.hg}</span>` : restPill(r)}</div>`;
    };
    let month = '';
    const body = rows.length
      ? rows
          .map((r) => {
            const m = W.seasonDate(r.dn).toLocaleString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }),
              head = m !== month ? `<div class="tiny b dim" style="padding:12px 0 2px">${m.toUpperCase()}</div>` : '';
            month = m;
            return head + line(r);
          })
          .join('')
      : '<div class="empty">Nothing here.</div>';
    return `${spell}${bar}<div class="card flat" style="padding:2px 12px">${body}</div>`;
  }
  UI._statsComp = null;
  // Team of the week for any league (a round at a time, newest first) and the team of the season so far
  UI.acts.totwComp = (d) => {
    UI._totwComp = d.v;
    UI._totwRound = null;
    UI.render();
  };
  UI.acts.totwRound = (d) => {
    UI._totwRound = +d.v;
    UI.render();
  };
  function totwView() {
    const s = S(),
      cur = UI._totwComp || myComp();
    const pick = `<div class="chips" style="flex-wrap:wrap">${W.leagues()
      .map(
        (c) =>
          `<button class="chip ${c.id === cur ? 'on' : ''}" data-act="totwComp" data-v="${c.id}">${C.flag(c.nat)} ${esc(c.short)}</button>`,
      )
      .join('')}</div>`;
    const rounds = (s.totw && s.totw.year === s.year && s.totw.by[cur]) || [];
    const sel = rounds.find((r) => r.n === UI._totwRound) || rounds[rounds.length - 1];
    const lines = (xi) =>
      ['GK', 'DEF', 'MID', 'ATT']
        .map((g) => {
          const rows = xi.filter((x) => D.POS_GROUP[x.pos] === g);
          return rows.length
            ? `<div class="small b dim" style="margin:10px 0 2px">${{ GK: 'GOALKEEPER', DEF: 'DEFENCE', MID: 'MIDFIELD', ATT: 'ATTACK' }[g]}</div>${rows
                .map((x) => {
                  const pl = P(x.id),
                    own = pl && W.ownPlayer(pl),
                    cl = CL(x.c);
                  return `<div class="row small tap" style="padding:6px 0;border-top:1px solid var(--line)" data-act="player" data-id="${x.id}"><span class="pos ${D.POS_GROUP[x.pos]}" style="min-width:34px;text-align:center">${x.lab}</span><span class="grow ellip" style="margin-left:8px">${own ? '⭐ ' : ''}${esc(x.n)} <span class="dim">· ${cl ? esc(cl.short) : '?'}</span></span><b>${x.r.toFixed(1)}</b></div>`;
                })
                .join('')}`
            : '';
        })
        .join('');
    const toty = FM.Records.toty(cur);
    const mgr = sel && sel.mgr && CL(sel.mgr);
    return `${pick}<div class="card" style="margin-top:10px"><div class="row"><div class="h3 grow">Team of the week</div>${sel ? `<span class="pill acc">Matchday ${sel.n}</span>` : ''}</div>
      ${
        rounds.length > 1
          ? `<div class="chips" style="flex-wrap:wrap;margin-top:8px">${rounds
              .slice()
              .reverse()
              .slice(0, 14)
              .map(
                (r) =>
                  `<button class="chip ${sel && r.n === sel.n ? 'on' : ''}" data-act="totwRound" data-v="${r.n}">MD ${r.n}</button>`,
              )
              .join('')}</div>`
          : ''
      }
      ${sel ? `${lines(sel.xi)}${mgr ? `<div class="row small" style="padding:8px 0;border-top:1px solid var(--line)"><span>🎙️</span><span class="grow" style="margin-left:8px">Manager of the week: <b>${esc(((m) => (m ? `${m} (${esc(mgr.name)})` : mgr.name))(W.isUser(mgr.id) ? s.user.name : s.staff[mgr.manager] ? `${esc(s.staff[mgr.manager].fn)} ${esc(s.staff[mgr.manager].ln)}` : ''))}</b></span></div>` : ''}` : '<div class="small dim" style="margin-top:8px">The first team of the week is picked after the first league matchday.</div>'}</div>
      <div class="card"><div class="row"><div class="h3 grow">Team of the season so far</div></div>${toty ? `<div class="tiny dim">By average rating, for players with a fair share of the games.</div>${lines(toty)}` : '<div class="small dim" style="margin-top:8px">Not enough games played yet.</div>'}</div>`;
  }
  // ---- Awards: the world's best XI, a league's awards, and what a cup or tournament gave out ----
  UI.xiLines = (xi) =>
    ['GK', 'DEF', 'MID', 'ATT']
      .map((g) => {
        const rows = xi.filter((x) => D.POS_GROUP[x.pos] === g);
        return rows.length
          ? `<div class="small b dim" style="margin:10px 0 2px">${{ GK: 'GOALKEEPER', DEF: 'DEFENCE', MID: 'MIDFIELD', ATT: 'ATTACK' }[g]}</div>${rows
              .map((x) => {
                const pl = P(x.id),
                  cl = CL(x.c);
                return `<div class="row small tap" style="padding:6px 0;border-top:1px solid var(--line)" data-act="player" data-id="${x.id}"><span class="pos ${D.POS_GROUP[x.pos]}" style="min-width:34px;text-align:center">${x.lab}</span><span class="grow ellip" style="margin-left:8px">${pl && W.ownPlayer(pl) ? '⭐ ' : ''}${esc(x.n)} <span class="dim">· ${cl ? (cl.sim === 'nation' ? C.flag(cl.code) + ' ' + esc(cl.name) : esc(cl.short)) : '?'}</span></span><b>${x.r.toFixed(1)}</b></div>`;
              })
              .join('')}`
          : '';
      })
      .join('');
  UI.awardsHTML = (aw, xiLabel = 'TEAM OF THE TOURNAMENT') => {
    if (!aw) return '<div class="small dim" style="margin-top:6px">Nothing to give out yet.</div>';
    const side = (id) => {
      const cl = id && CL(id);
      return cl
        ? ` <span class="dim">· ${cl.sim === 'nation' ? C.flag(cl.code) + ' ' + esc(cl.name) : esc(cl.short)}</span>`
        : '';
    };
    const row = (icon, label, a, tail = '') =>
      a
        ? `<div class="row small tap" style="padding:7px 0;border-top:1px solid var(--line);gap:8px" data-act="player" data-id="${a.pid}"><span>${icon}</span><span class="grow ellip"><span class="dim">${label}</span> <b>${esc(a.name)}</b>${side(a.club)}</span><b>${tail}</b></div>`
        : '';
    return `${row('👟', 'Golden Boot', aw.boot, aw.boot ? `${aw.boot.goals} goal${aw.boot.goals === 1 ? '' : 's'}` : '')}${row('⭐', 'Best player', aw.player, aw.player ? aw.player.avg.toFixed(2) : '')}${row('🌱', 'Best young player', aw.young, aw.young ? aw.young.avg.toFixed(2) : '')}${row('🧤', 'Best goalkeeper', aw.keeper, aw.keeper ? aw.keeper.avg.toFixed(2) : '')}${row('🎯', 'Most assists', aw.assists, aw.assists ? aw.assists.assists : '')}
      ${aw.xi ? `<div class="small b dim" style="margin:12px 0 0">${xiLabel}</div>${UI.xiLines(aw.xi)}` : ''}`;
  };
  function awardsView() {
    const s = S(),
      cur = UI._awardsComp || myComp();
    const pick = `<div class="chips" style="flex-wrap:wrap">${W.leagues()
      .map(
        (c) =>
          `<button class="chip ${c.id === cur ? 'on' : ''}" data-act="awardsComp" data-v="${c.id}">${C.flag(c.nat)} ${esc(c.short)}</button>`,
      )
      .join('')}</div>`;
    const world = FM.Records.worldXI(),
      la = FM.Records.leagueAwards(cur);
    const past = s.archive
      .filter((e) => e.worldXI || (e.comps[cur] && e.comps[cur].awards))
      .slice(-4)
      .reverse();
    return `<div class="card"><div class="row"><div class="h3 grow">World best XI</div><span class="pill acc">${esc(FM.Season.seasonLabel())} so far</span></div>
      <div class="tiny dim">The best average ratings in every league played in full or light, with a little extra for the stronger leagues.</div>
      ${world ? `${UI.xiLines(world.xi)}${world.best ? `<div class="row small" style="padding:8px 0;border-top:1px solid var(--line)"><span>🌍</span><span class="grow" style="margin-left:8px">Player of the year so far: <b>${esc(world.best.name)}</b></span></div>` : ''}` : '<div class="small dim" style="margin-top:6px">Awards start once the league seasons are under way.</div>'}</div>
      ${pick}
      <div class="card"><div class="row"><div class="h3 grow">${esc(S().comps[cur].name)} awards</div><span class="pill">so far</span></div>${UI.awardsHTML(la, 'TEAM OF THE SEASON')}</div>
      ${
        past.length
          ? `<div class="sec"><div class="h3">Previous seasons</div></div>${past
              .map(
                (e) =>
                  `<details class="card cupfold" data-cup="aw_${e.year}" ${(UI._cupsOpen || {})['aw_' + e.year] ? 'open' : ''}><summary><div class="row"><div class="h3 grow">${esc(e.label)}</div></div></summary>${
                    e.worldXI
                      ? `<div class="small b dim" style="margin-top:8px">WORLD BEST XI${e.worldXI.best ? ` · player of the year ${esc(e.worldXI.best.name)}` : ''}</div>${UI.xiLines(e.worldXI.xi)}`
                      : ''
                  }${e.comps[cur] && e.comps[cur].awards ? `<div class="small b dim" style="margin-top:12px">${esc(e.comps[cur].name.toUpperCase())}</div>${UI.awardsHTML(e.comps[cur].awards, 'TEAM OF THE SEASON')}` : ''}</details>`,
              )
              .join('')}`
          : ''
      }`;
  }
  UI.acts.awardsComp = (d) => {
    UI._awardsComp = d.v;
    UI.render();
  };
  // ---------- Analyst view: league charts ----------
  // Scatter plots of the clubs (and the scorers) of a league: who creates and allows chances, who scores more than the chances say, how
  // the clubs differ in style. Your club (or your players) is ringed; a tap on a dot opens that club or player.
  UI._chart = 'clx';
  UI._chartsComp = null;
  const CHARTS = {
    clx: {
      label: 'Chances for and against',
      scope: 'club',
      x: 'xf',
      y: 'xa',
      xl: 'Expected goals for, per match',
      yl: 'Expected goals against (fewer at the top)',
      invertY: true,
      quad: ['Solid, but creates little', 'Strong both ways', 'Struggling', 'Open: creates and allows'],
      help: 'The top right is the best place to be: many chances made, few allowed.',
    },
    clfin: {
      label: 'Goals against expected',
      scope: 'club',
      x: 'xf',
      y: 'g',
      xl: 'Expected goals, per match',
      yl: 'Goals scored, per match',
      diag: true,
      quad: ['Scoring more than the chances say', '', '', 'Scoring less than the chances say'],
      help: 'Above the line a club scores more than its chances say it should; below, less.',
    },
    clstyle: {
      label: 'Possession and chance quality',
      scope: 'club',
      x: 'poss',
      y: 'q',
      xl: 'Possession, %',
      yl: 'Expected goals per shot',
      quad: ['Direct and picky', 'Patient and precise', 'Direct and wasteful', 'Patient but wasteful'],
      help: 'How much of the ball a club has, against how good the chances it takes are.',
    },
    clpress: {
      label: 'Pressing and possession',
      scope: 'club',
      x: 'da',
      y: 'poss',
      xl: 'Tackles and interceptions, per match',
      yl: 'Possession, %',
      quad: ['Keeps the ball', 'Wins it and keeps it', 'Sits back and defends', 'Wins it, then gives it away'],
      help: 'How hard a club goes in for the ball, against how much of it it has.',
    },
    plfin: {
      label: 'Scorers: goals against expected',
      scope: 'player',
      x: 'xg',
      y: 'g',
      xl: 'Expected goals, season',
      yl: 'Goals, season',
      diag: true,
      quad: ['Finishing above the chances', '', '', 'Finishing below the chances'],
      help: 'Players with 300 minutes and at least 1 expected goal. Above the line he has scored more than his chances said.',
    },
  };
  function scatter(pts, ch, W2 = 320, H2 = 270) {
    const pad = { l: 36, r: 12, t: 14, b: 34 };
    const xs = pts.map((p) => p.x),
      ys = pts.map((p) => p.y);
    let x0 = Math.min(...xs),
      x1 = Math.max(...xs),
      y0 = Math.min(...ys),
      y1 = Math.max(...ys);
    if (ch.diag) {
      x0 = y0 = Math.min(x0, y0);
      x1 = y1 = Math.max(x1, y1);
    }
    const ex = (x1 - x0) * 0.08 || 1,
      ey = (y1 - y0) * 0.08 || 1;
    x0 -= ex;
    x1 += ex;
    y0 -= ey;
    y1 += ey;
    const X = (v) => pad.l + ((v - x0) / (x1 - x0)) * (W2 - pad.l - pad.r),
      Y = (v) =>
        ch.invertY
          ? pad.t + ((v - y0) / (y1 - y0)) * (H2 - pad.t - pad.b)
          : H2 - pad.b - ((v - y0) / (y1 - y0)) * (H2 - pad.t - pad.b);
    const mx = (x0 + x1) / 2,
      my = (y0 + y1) / 2;
    const tick = (lo, hi) => {
      const span = hi - lo,
        step = span > 20 ? 5 : span > 6 ? 2 : span > 2 ? 0.5 : 0.25;
      const out = [];
      for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) out.push(+v.toFixed(2));
      return out;
    };
    const grid =
      tick(x0, x1)
        .map(
          (v) =>
            `<line x1="${X(v)}" x2="${X(v)}" y1="${pad.t}" y2="${H2 - pad.b}" stroke="var(--line)"/><text x="${X(v)}" y="${H2 - pad.b + 11}" font-size="9" text-anchor="middle" fill="var(--ink3)">${v}</text>`,
        )
        .join('') +
      tick(y0, y1)
        .map(
          (v) =>
            `<line x1="${pad.l}" x2="${W2 - pad.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/><text x="${pad.l - 4}" y="${Y(v) + 3}" font-size="9" text-anchor="end" fill="var(--ink3)">${v}</text>`,
        )
        .join('');
    const diag = ch.diag
      ? `<line x1="${X(x0)}" y1="${Y(x0)}" x2="${X(x1)}" y2="${Y(x1)}" stroke="var(--ink3)" stroke-dasharray="4 3"/>`
      : '';
    // the label of the ringed dot and of the four farthest from the middle
    const far = pts
      .slice()
      .sort(
        (a, b) =>
          Math.hypot((b.x - mx) / (x1 - x0), (b.y - my) / (y1 - y0)) -
          Math.hypot((a.x - mx) / (x1 - x0), (a.y - my) / (y1 - y0)),
      )
      .slice(0, 4);
    const lab = new Set([...far, ...pts.filter((p) => p.hi)]);
    const dots = pts
      .map(
        (p) =>
          `<g class="tap" data-act="${p.act}" data-id="${p.id}"><circle cx="${X(p.x)}" cy="${Y(p.y)}" r="${p.hi ? 6.5 : 4.5}" fill="${p.color}" fill-opacity="0.85" stroke="${p.hi ? 'var(--ink)' : 'rgba(255,255,255,.7)'}" stroke-width="${p.hi ? 2.2 : 1}"><title>${esc(p.tip)}</title></circle></g>`,
      )
      .join('');
    const labels = [...lab]
      .map((p) => {
        const right = X(p.x) < W2 - 90;
        return `<text x="${X(p.x) + (right ? 8 : -8)}" y="${Y(p.y) + 3}" font-size="9" font-weight="${p.hi ? 700 : 500}" text-anchor="${right ? 'start' : 'end'}" fill="var(--ink)" pointer-events="none">${esc(p.label)}</text>`;
      })
      .join('');
    const q = ch.quad || [];
    const quad = [
      [q[0], pad.l + 4, pad.t + 9, 'start'],
      [q[1], W2 - pad.r - 4, pad.t + 9, 'end'],
      [q[2], pad.l + 4, H2 - pad.b - 5, 'start'],
      [q[3], W2 - pad.r - 4, H2 - pad.b - 5, 'end'],
    ]
      .filter((x) => x[0])
      .map(
        ([tx, x, y, a]) =>
          `<text x="${x}" y="${y}" font-size="8" text-anchor="${a}" fill="var(--ink3)" fill-opacity="0.8">${esc(tx)}</text>`,
      )
      .join('');
    return `<svg viewBox="0 0 ${W2} ${H2}" style="width:100%;margin-top:6px">${grid}${diag}${quad}${dots}${labels}<text x="${(pad.l + W2 - pad.r) / 2}" y="${H2 - 4}" font-size="9" text-anchor="middle" fill="var(--ink2)">${esc(ch.xl)}</text><text x="10" y="${(pad.t + H2 - pad.b) / 2}" font-size="9" text-anchor="middle" fill="var(--ink2)" transform="rotate(-90 10 ${(pad.t + H2 - pad.b) / 2})">${esc(ch.yl)}</text></svg>`;
  }
  function chartsView() {
    const s = S(),
      cur = UI._chartsComp && s.comps[UI._chartsComp] ? UI._chartsComp : myComp(),
      ch = CHARTS[UI._chart] || CHARTS.clx;
    const leagues = W.leagues().filter((l) => l.sim === 'full' || l.id === myComp());
    const pickComp = `<div class="chips" style="flex-wrap:wrap">${leagues.map((c) => `<button class="chip ${c.id === cur ? 'on' : ''}" data-act="chartsComp" data-v="${c.id}">${C.flag(c.nat)} ${esc(c.short)}</button>`).join('')}</div>`;
    const pickChart = `<div class="chips" style="flex-wrap:wrap">${Object.entries(CHARTS)
      .map(
        ([k, c]) =>
          `<button class="chip ${k === UI._chart ? 'on' : ''}" data-act="chartsKind" data-v="${k}">${esc(c.label)}</button>`,
      )
      .join('')}</div>`;
    const A = FM.Analytics.charts(cur);
    if (A.none || A.thin)
      return `${pickComp}${pickChart}<div class="card"><div class="small dim">${A.thin ? `Only ${U.plural(A.n, 'club')} have four league matches with details so far: the charts start then.` : esc(A.none)}</div></div>`;
    const me = s.user.clubId;
    let pts,
      lists = '';
    if (ch.scope === 'club') {
      pts = A.clubs.map((c) => ({
        x: c[ch.x],
        y: c[ch.y],
        label: c.short,
        color: c.color,
        hi: c.id === me,
        id: c.id,
        act: 'clubView',
        tip: `${c.name}: ${ch.x === 'poss' ? c.poss.toFixed(0) + '%' : c[ch.x].toFixed(2)} · ${ch.y === 'poss' ? c.poss.toFixed(0) + '%' : c[ch.y].toFixed(2)}`,
      }));
      if (UI._chart === 'clfin') {
        const d = A.clubs.map((c) => ({ c, d: c.g - c.xf })).sort((a, b) => b.d - a.d);
        const row = (x) =>
          `<div class="row small tap" style="padding:5px 0;gap:8px" data-act="clubView" data-id="${x.c.id}">${C.crest(S().clubs[x.c.id], 16)}<span class="grow ellip">${esc(x.c.name)}</span><span class="dim">${x.c.xf.toFixed(2)} xG · ${U.plural(x.c.g.toFixed(2), 'goal')}</span><b style="color:var(--${x.d >= 0 ? 'good' : 'bad'});width:44px;text-align:right">${x.d >= 0 ? '+' : ''}${x.d.toFixed(2)}</b></div>`;
        lists = `<div class="small b dim" style="margin:10px 0 2px">Scoring more than the chances say</div>${d.slice(0, 5).map(row).join('')}<div class="small b dim" style="margin:10px 0 2px">Scoring less than the chances say</div>${d.slice(-5).reverse().map(row).join('')}`;
      }
    } else {
      const myPlayers = (id) => S().players[id] && S().players[id].clubId === me;
      pts = A.players.map((p) => ({
        x: p.xg,
        y: p.g,
        label: p.name,
        color: p.color,
        hi: myPlayers(p.id),
        id: p.id,
        act: 'player',
        tip: `${p.name}: ${p.xg.toFixed(1)} xG, ${U.plural(p.g, 'goal')}`,
      }));
      const d = A.players.map((p) => ({ p, d: p.g - p.xg })).sort((a, b) => b.d - a.d);
      const row = (x, i) =>
        `<div class="row small tap" style="padding:5px 0;gap:8px" data-act="player" data-id="${x.p.id}"><span class="dim" style="width:18px">${i + 1}</span>${C.crest(S().clubs[x.p.club], 16)}<span class="grow ellip">${esc(x.p.name)}</span><span class="dim">${x.p.xg.toFixed(1)} xG · ${U.plural(x.p.g, 'goal')}</span><b style="color:var(--${x.d >= 0 ? 'good' : 'bad'});width:44px;text-align:right">${x.d >= 0 ? '+' : ''}${x.d.toFixed(1)}</b></div>`;
      lists = `<div class="small b dim" style="margin:10px 0 2px">Top ten: most goals above the chances</div>${d.slice(0, 10).map(row).join('')}<div class="small b dim" style="margin:10px 0 2px">Most goals below the chances</div>${d.slice(-5).reverse().map(row).join('')}`;
    }
    if (pts.length < 3)
      return `${pickComp}${pickChart}<div class="card"><div class="small dim">Too few players yet (it needs 300 minutes and 1 expected goal): check back after more matches.</div></div>`;
    return `${pickComp}${pickChart}<div class="card"><div class="h3">${esc(ch.label)}</div><div class="tiny dim">${esc(A.comp)} · ${pts.length} ${ch.scope === 'club' ? 'clubs' : 'players'} · ${esc(ch.help)} Your ${ch.scope === 'club' ? 'club is' : 'players are'} ringed; tap a dot to open it.</div>${scatter(pts, ch)}${lists}</div>`;
  }
  UI.acts.chartsComp = (d) => {
    UI._chartsComp = d.v;
    UI.render();
  };
  UI.acts.chartsKind = (d) => {
    UI._chart = d.v;
    UI.render();
  };
  function statsView() {
    const s = S(),
      cur = UI._statsComp || myComp();
    const pick = `<div class="chips" style="flex-wrap:wrap"><button class="chip ${cur === 'all' ? 'on' : ''}" data-act="statsComp" data-v="all">🌍 All leagues</button>${W.leagues()
      .map(
        (c) =>
          `<button class="chip ${c.id === cur ? 'on' : ''}" data-act="statsComp" data-v="${c.id}">${C.flag(c.nat)} ${esc(c.short)}</button>`,
      )
      .join('')}</div>`;
    if (cur === 'all') {
      // Every league, one list: league shown beside each player; minimal-tier stats are synthetic, so marked
      const ps = Object.values(s.players).filter((p) => p.clubId && CL(p.clubId).comp && s.comps[CL(p.clubId).comp]);
      const lg = (p) => s.comps[CL(p.clubId).comp];
      const list = (arr, f, lab) =>
        `<div class="small b dim" style="margin:10px 0 4px">${lab}</div>${
          arr
            .slice(0, 15)
            .map(
              (p, i) =>
                `<div class="row small tap" style="padding:5px 0" data-act="player" data-id="${p.id}"><span class="dim" style="width:20px">${i + 1}</span>${C.crest(CL(p.clubId), 16)}<span class="grow ellip">${esc(W.name(p))} <span class="dim tiny">${C.flag(lg(p).nat)} ${esc(lg(p).short)}${lg(p).sim === 'minimal' ? '*' : ''}</span></span><b>${f(p)}</b></div>`,
            )
            .join('') || '<div class="dim small">—</div>'
        }`;
      return (
        pick +
        `<div class="card"><div class="h3">All leagues</div>
        ${list(
          ps.filter((p) => p.season.goals).sort((a, b) => b.season.goals - a.season.goals),
          (p) => p.season.goals,
          'Top scorers',
        )}
        ${list(
          ps.filter((p) => p.season.ast).sort((a, b) => b.season.ast - a.season.ast),
          (p) => p.season.ast,
          'Assists',
        )}
        ${list(
          ps
            .filter((p) => p.season.apps >= 8)
            .sort((a, b) => b.season.rsum / b.season.apps - a.season.rsum / a.season.apps),
          (p) => (p.season.rsum / p.season.apps).toFixed(2),
          'Average rating (8+ apps)',
        )}
        <div class="tiny dim" style="margin-top:8px">* Minimal-simulation league: results are real, player stats are estimated.</div></div>`
      );
    }
    return (
      pick +
      [cur]
        .map((cid) => {
          const ps = Object.values(s.players).filter((p) => p.clubId && CL(p.clubId).comp === cid);
          const list = (arr, f, lab) =>
            `<div class="small b dim" style="margin:10px 0 4px">${lab}</div>${
              arr
                .slice(0, 5)
                .map(
                  (p, i) =>
                    `<div class="row small tap" style="padding:5px 0" data-act="player" data-id="${p.id}"><span class="dim" style="width:16px">${i + 1}</span>${C.crest(CL(p.clubId), 16)}<span class="grow ellip">${esc(W.name(p))}</span><b>${f(p)}</b></div>`,
                )
                .join('') || '<div class="dim small">—</div>'
            }`;
          return `<div class="card"><div class="h3">${esc(s.comps[cid].name)}</div>
        ${list(
          ps.filter((p) => p.season.goals).sort((a, b) => b.season.goals - a.season.goals),
          (p) => p.season.goals,
          'Top scorers',
        )}
        ${list(
          ps.filter((p) => p.season.ast).sort((a, b) => b.season.ast - a.season.ast),
          (p) => p.season.ast,
          'Assists',
        )}
        ${list(
          ps
            .filter((p) => p.season.apps >= 3)
            .sort((a, b) => b.season.rsum / b.season.apps - a.season.rsum / a.season.apps),
          (p) => (p.season.rsum / p.season.apps).toFixed(2),
          'Average rating (3+ apps)',
        )}
        ${list(
          ps.filter((p) => p.season.kp).sort((a, b) => b.season.kp - a.season.kp),
          (p) => p.season.kp,
          'Chances made',
        )}
        ${list(
          ps.filter((p) => p.season.tk).sort((a, b) => b.season.tk - a.season.tk),
          (p) => p.season.tk,
          'Tackles won',
        )}</div>
        <div class="card"><div class="h3">Goalkeepers</div>
        ${list(
          ps.filter((p) => p.pos === 'GK' && p.season.cs).sort((a, b) => b.season.cs - a.season.cs),
          (p) => p.season.cs,
          'Clean sheets',
        )}
        ${list(
          ps
            .filter((p) => p.pos === 'GK' && (p.season.sv || 0) + (p.season.ga || 0) >= 20)
            .sort((a, b) => b.season.sv / (b.season.sv + b.season.ga) - a.season.sv / (a.season.sv + a.season.ga)),
          (p) => Math.round((100 * p.season.sv) / (p.season.sv + p.season.ga)) + '%',
          'Save % (20+ shots faced)',
        )}
        ${list(
          ps
            .filter((p) => p.pos === 'GK' && p.season.apps >= 3)
            .sort((a, b) => b.season.xga - b.season.ga - (a.season.xga - a.season.ga)),
          (p) => (p.season.xga - p.season.ga >= 0 ? '+' : '') + (p.season.xga - p.season.ga).toFixed(1),
          'Goals prevented (xG faced − conceded)',
        )}</div>`;
        })
        .join('')
    );
  }
  UI.acts.attrMode = (d) => {
    UI._attrMode = d.v;
    const body = document.querySelector('.sheet-wrap:last-child .sh-body'),
      y = body ? body.scrollTop : 0;
    if (P(UI._attrPid)) UI.refreshSheet(playerHTML(P(UI._attrPid)));
    if (body) body.scrollTop = y;
  };
  UI.acts.statsComp = (d) => {
    UI._statsComp = d.v;
    UI.render();
  };
  UI._cupsView = 'mine';
  UI._cupsOpen = {}; // which tournaments the player has opened or folded away (competition id → open)
  // a tournament's card folds and opens; what the player chose is remembered across redraws
  document.addEventListener(
    'toggle',
    (e) => {
      const d = e.target;
      if (d && d.matches && d.matches('details.cupfold')) UI._cupsOpen[d.dataset.cup] = d.open;
    },
    true,
  );
  UI.acts.cupsFold = (d) => {
    const all = [...W.cups(), ...W.continentals(), ...W.worldCups(), ...FM.Regional.regionals()];
    for (const c of all) UI._cupsOpen[c.id] = d.v === 'open';
    UI.render();
  };
  UI.acts.cupsView = (d) => {
    UI._cupsView = d.v;
    UI.render();
  };
  function cupsView() {
    const s = S(),
      uc = club() ? club().id : null,
      v = UI._cupsView;
    const tabs = `<div class="chips">${[
      ['mine', 'My cups'],
      ['continental', 'Continental'],
      ['domestic', 'Domestic'],
      ['regional', 'Regional'],
      ['world', '🌍 World cups'],
    ]
      .map(([k, l]) => `<button class="chip ${v === k ? 'on' : ''}" data-act="cupsView" data-v="${k}">${l}</button>`)
      .join('')}</div>`;
    const inIt = (c) => c.clubs.includes(uc);
    // each tournament folds away: open by default for those you are in (and the lone World Club Championship), as you left the rest
    const isOpen = (id) => UI._cupsOpen[id] ?? (!!S().comps[id] && (S().comps[id].clubs.includes(uc) || v === 'world'));
    // a finished competition's awards and team of the tournament close its card
    const awardsOf = (c) =>
      c.awards ? `<div class="small b dim" style="margin:14px 0 0">AWARDS</div>${UI.awardsHTML(c.awards)}` : '';
    const foldAll = (html) =>
      html
        .split(/(?=<div class="card" data-cupid=")/)
        .map((card) => {
          const m = card.match(
            /^<div class="card" data-cupid="([^"]+)">(<div class="row">[\s\S]*?<div class="h3 grow">[\s\S]*?<\/div>(?:<span class="pill acc">[\s\S]*?<\/span>)?<\/div>)([\s\S]*)<\/div>$/,
          );
          return m
            ? `<details class="card cupfold" data-cup="${m[1]}" ${isOpen(m[1]) ? 'open' : ''}><summary>${m[2]}</summary>${m[3]}${awardsOf(S().comps[m[1]] || {})}</details>`
            : card;
        })
        .join('');
    const legs = s.rules.twoLegs
      ? 'two-legged knockouts' + (s.rules.awayGoals ? ' (away goals)' : '')
      : 'single-leg knockouts';
    // each cup's own knockout format: the Asian cup plays single matches at one venue, and the African and North
    // American finals are over two legs
    const cupFormat0 = (c) => {
      if (!s.rules.twoLegs) return `${legs} · neutral final`;
      const f = FM.Cups.formatOf(c),
        one = f.legs.qf === 1 && f.legs.sf === 1;
      return `${one ? 'single-match knockouts' + (f.central ? ' at one venue' : '') : legs} · ${f.legs.f === 2 ? 'two-legged final' : 'neutral final'}`;
    };
    const cupFormat = (c) => cupFormat0(c) + (c.prize ? ` · 💰 ${U.money(c.prize)} prize fund` : '');
    const groupsHtml = (c) =>
      (c.groups || [])
        .map(
          (g) =>
            `<div class="small b dim" style="margin:10px 0 2px">GROUP ${esc(g.name)}</div><table class="t"><tr><th>#</th><th class="l">Club</th><th>P</th><th>GD</th><th>Pts</th><th></th></tr>${((
              mk,
            ) =>
              FM.Cups.groupTable(g)
                .map(
                  (r, i) =>
                    `<tr class="${i < 2 ? 'zone-up' : ''} ${W.isUser(r.id) ? 'me' : ''} tap" data-act="clubView" data-id="${r.id}"><td>${i + 1}</td><td class="l"><div class="row" style="gap:6px">${C.crest(CL(r.id), 16)}<span class="ellip" style="max-width:150px">${C.flag(CL(r.id).nat)} ${esc(CL(r.id).name)}</span></div></td><td>${r.p}</td><td>${r.gd > 0 ? '+' : ''}${r.gd}</td><td class="b">${r.pts}</td><td title="${{ top: 'Group won', through: 'Through to the knockouts', out: 'Eliminated' }[mk[r.id]] || ''}" style="color:${mk[r.id] === 'out' ? 'var(--bad)' : 'var(--good)'};font-weight:800">${{ top: '★', through: '✓', out: '✗' }[mk[r.id]] || ''}</td></tr>`,
                )
                .join(''))(FM.Cups.groupMarks(g, c.groups.length > 4, c.id))}</table>`,
        )
        .join('') +
      (c.groups && c.groups.length
        ? '<div class="tiny dim" style="margin-top:6px">★ group won · ✓ through to the knockouts · ✗ eliminated</div>'
        : '');
    const wc = W.worldCups()
      .filter((c) => v === 'world' || (v === 'mine' && inIt(c)))
      .sort((x, y) => (x.fmt === 'ic' ? 0 : 1) - (y.fmt === 'ic' ? 0 : 1))
      .map((c) => {
        const ko = FM.Cups.koList(c),
          isIc = c.fmt === 'ic';
        const note = isIc
          ? 'Every season, mid-season · the continental champions · neutral venues: the Asian and African champions meet, the American champions meet, the winners play the Challenger Cup and the European champion joins them in the final'
          : c.on
            ? '32 clubs in eight groups of four · the top two go through to a round of 16 · played in the summer, once every four seasons · neutral venues'
            : `Once every four seasons, in the summer: 32 clubs in eight groups of four, then a round of 16 and the knockouts. Next: the ${FM.Cups.nextCwc()}/${String((FM.Cups.nextCwc() + 1) % 100).padStart(2, '0')} season. Places by continent: ${Object.entries(
                D.CWC_QUOTA,
              )
                .map(([k, n]) => `${k} ${n}`)
                .join(', ')}`;
        const field = isIc
          ? `<div class="chips" style="flex-wrap:wrap;margin-top:8px">${c.clubs.map((id) => `<span class="chip" style="${W.isUser(id) ? 'border-color:var(--acc)' : ''}">${C.flag(CL(id).nat)} ${esc(CL(id).short)}</span>`).join('')}</div>`
          : '';
        const empty = isIc ? 'The first round is drawn after matchday 10.' : c.on ? '' : 'Not this season.';
        return `<div class="card" data-cupid="${c.id}"><div class="row"><div class="h3 grow">🌍 ${esc(c.name)}</div>${c.winner ? `<span class="pill acc">🏆 ${esc(CL(c.winner).short)}</span>` : ''}</div><div class="tiny dim" style="margin-top:4px;line-height:1.5">${note}</div>${field}${groupsHtml(c)}${ko.length ? `<div class="small b dim" style="margin:12px 0 2px">KNOCKOUT</div>${ko.map(fxLine).join('')}` : empty ? `<div class="small dim" style="margin-top:8px">${empty}</div>` : ''}${UI.compHistoryCard ? UI.compHistoryCard(c) : ''}</div>`;
      })
      .join('');
    const cont = W.continentals()
      .filter((c) => v === 'continental' || (v === 'mine' && inIt(c)))
      .map((c) => {
        const grp = groupsHtml(c);
        const ko = FM.Cups.koList(c);
        return `<div class="card" data-cupid="${c.id}"><div class="row"><div class="h3 grow">⭐ ${esc(c.name)}</div>${c.winner ? `<span class="pill acc">🏆 ${esc(CL(c.winner).short)}</span>` : ''}</div><div class="tiny dim" style="margin-top:4px">${c.region || ''} · ${U.plural(c.clubs.length, 'club')} · ${(c.groups || []).length > 4 ? 'the group winners and the best runners-up make the quarter-finals' : `top 2 in each group reach the ${(c.groups || []).length >= 4 ? 'quarter-finals' : 'semi-finals'}`} · ${cupFormat(c)}</div>${grp}${ko.length ? `<div class="small b dim" style="margin:12px 0 2px">KNOCKOUT</div>${ko.map(fxLine).join('')}` : ''}${UI.compHistoryCard ? UI.compHistoryCard(c) : ''}</div>`;
      })
      .join('');
    // county cups and state championships: the ones you are in, or all of them
    const regional = FM.Regional.regionals()
      .filter((c) => c.clubs.length > 1 && (v === 'regional' || (v === 'mine' && inIt(c))))
      .sort((a, b) => (inIt(b) ? 1 : 0) - (inIt(a) ? 1 : 0) || a.nat.localeCompare(b.nat))
      .map((c) => {
        const g = c.groups && c.groups[0];
        const table = g
          ? `<table class="t" style="margin-top:8px"><tr><th>#</th><th class="l">Club</th><th>P</th><th>GD</th><th>Pts</th></tr>${FM.Cups.groupTable(
              g,
            )
              .map(
                (r, i) =>
                  `<tr class="${i < 2 ? 'zone-up' : ''} ${W.isUser(r.id) ? 'me' : ''} tap" data-act="clubView" data-id="${r.id}"><td>${i + 1}</td><td class="l"><div class="row" style="gap:6px">${C.crest(CL(r.id), 16)}<span class="ellip" style="max-width:150px">${esc(CL(r.id).name)}</span></div></td><td>${r.p}</td><td>${r.gd > 0 ? '+' : ''}${r.gd}</td><td class="b">${r.pts}</td></tr>`,
              )
              .join('')}</table><div class="tiny dim" style="margin-top:6px">The top two meet in the final.</div>`
          : '';
        const fx =
          c.format === 'ko'
            ? (c.rounds || [])
                .slice()
                .reverse()
                .map(
                  (r) =>
                    `<div class="small b dim" style="margin:12px 0 2px">${esc(r.name.toUpperCase())}</div>${r.ties
                      .concat(r.ties2 || [])
                      .map(fxLine)
                      .join('')}`,
                )
                .join('')
            : (c.final ? `<div class="small b dim" style="margin:12px 0 2px">FINAL</div>${fxLine(c.final)}` : '') +
              (g
                ? g.fixtures
                    .flat()
                    .filter((f) => f.res)
                    .reverse()
                    .map(fxLine)
                    .join('')
                : '');
        return `<div class="card" data-cupid="${c.id}"><div class="row"><div class="h3 grow">🏅 ${esc(c.name)} ${C.flag(c.nat)}</div>${c.winner ? `<span class="pill acc">Winners: ${esc(CL(c.winner).short)}</span>` : ''}</div><div class="tiny dim" style="margin-top:4px">${U.plural(c.clubs.length, 'club')} · ${c.format === 'ko' ? 'knockout; the big clubs field reserve sides' : 'league phase, then a final'}</div>${table}${fx || '<div class="small dim" style="margin-top:8px">Not started yet.</div>'}</div>`;
      })
      .join('');
    // the super cups: one match at the start of a season (a nation's champions against its cup winners; the champions cup against its Shield)
    const sup = Object.values(s.comps)
      .filter(
        (c) =>
          c.type === 'super' &&
          c.fx &&
          ((v === 'mine' && c.clubs.includes(uc)) || (v === 'domestic' && c.nat) || (v === 'continental' && !c.nat)),
      )
      .map(
        (c) =>
          `<div class="card" data-cupid="${c.id}"><div class="row"><div class="h3 grow">🥇 ${esc(c.name)}</div>${c.winner ? `<span class="pill acc">🏆 ${esc(CL(c.winner).short)}</span>` : ''}</div><div class="tiny dim" style="margin-top:4px">One match at a neutral ground early in the season: ${c.nat ? 'the league champions against the cup winners' : 'the champions cup winner against the Shield winner'} of last season</div>${fxLine(c.fx)}</div>`,
      )
      .join('');
    // (the European knockout cups, the Holders' and the Summer Cup, sit with the continental ones)
    const dom = W.cups()
      .filter((c) => (v === 'domestic' && !c.euro) || (v === 'continental' && c.euro) || (v === 'mine' && inIt(c)))
      .map((c) => {
        return `<div class="card" data-cupid="${c.id}"><div class="row"><div class="h3 grow">${c.euro ? '⭐' : '🏆'} ${esc(c.name)} ${c.euro ? '' : C.flag(c.nat)}</div>${c.winner ? `<span class="pill acc">Winners: ${esc(CL(c.winner).short)}</span>` : ''}</div><div class="tiny dim" style="margin-top:4px">${c.euro ? 'Europe · ' : ''}${U.plural(c.clubs.length, 'club')} · ${(FM.Cups.optsOf(c).legs || []).length ? 'knockout with two-legged rounds' : 'single-leg knockout'} · extra time & penalties${c.prize ? ` · 💰 ${U.money(c.prize)} fund, paid down the rounds` : ''}</div>
        ${
          (c.rounds || [])
            .slice()
            .reverse()
            .map(
              (r) =>
                `<div class="small b dim" style="margin:12px 0 2px">${esc(r.name.toUpperCase())}${r.byes.length ? ` · ${r.byes.length} byes` : ''}</div>${r.ties
                  .concat(r.ties2 || [])
                  .map(fxLine)
                  .join('')}`,
            )
            .join('') || '<div class="small dim" style="margin-top:8px">The draw has not been made yet.</div>'
        }${UI.compHistoryCard ? UI.compHistoryCard(c) : ''}</div>`;
      })
      .join('');
    return (
      tabs +
      (((cards) =>
        cards
          ? `<div class="row" style="gap:8px;margin:8px 0 4px"><button class="btn sm grow" data-act="cupsFold" data-v="open">Open all</button><button class="btn sm grow" data-act="cupsFold" data-v="close">Fold all</button></div>${cards}`
          : '')(foldAll(wc + cont + sup + dom + regional)) ||
        `<div class="empty">${v === 'mine' ? "Your club isn't in any cup competitions right now." : 'Nothing here yet.'}</div>`)
    );
  }

  UI.acts.matchReport = (d) => {
    const f = FM.Cups.allFixtures().find((x) => x.id === d.id);
    if (!f || !f.res) return UI.toast('Report no longer available');
    const r = f.res;
    const side = (k) =>
      Object.entries(f.ratings || {})
        .filter(([pid]) => P(pid) && P(pid).clubId === (k ? f.a : f.h))
        .sort((a, b) => b[1] - a[1]);
    const tag = (k) => {
      const c = CL(k ? f.a : f.h);
      return `<b class="ev-team" style="background:${c.colors[0]};color:${U.ink(c.colors[0])}">${esc(c.short)}</b>`;
    };
    UI.sheet(
      `<div class="row" style="justify-content:space-around;text-align:center"><div>${C.crest(CL(f.h), 48)}<div class="small b">${esc(CL(f.h).name)}</div></div><div class="h1">${r.hg}–${r.ag}</div><div>${C.crest(CL(f.a), 48)}<div class="small b">${esc(CL(f.a).name)}</div></div></div>
      ${r.pens ? `<div class="center small dim">Penalties ${r.pens[0]}–${r.pens[1]}</div>` : ''}
      ${r.agg ? `<div class="center small b">Aggregate ${r.agg[0]}–${r.agg[1]}</div>` : ''}
      <div class="center small dim" style="margin:6px 0">${r.xg ? `xG ${r.xg[0]} – ${r.xg[1]}` : ''}${r.poss ? ` · Possession ${r.poss[0]}% – ${r.poss[1]}%` : ''}${r.weather ? ` · ${r.weather}` : ''}${r.att ? ` · ${r.att.toLocaleString()} crowd` : ''}${r.sim ? ` · ${FM.Tiers.LABEL[r.sim].toLowerCase()}` : ''}</div>
      <div class="card flat">${r.goals.map((g) => `<div class="row small" style="padding:4px 0;${g.side ? 'flex-direction:row-reverse;text-align:right' : ''}">${tag(g.side)}⚽ <b>${C.pname(P(g.pid))}</b> <span class="dim">${g.min || ''}${g.pen ? ' (pen)' : ''}</span></div>`).join('') || `<div class="dim small center">${r.hg + r.ag ? 'Scorers not recorded' : 'No goals'}</div>`}</div>
      <div class="row" style="align-items:flex-start;gap:12px">${[0, 1]
        .map(
          (k) =>
            `<div class="grow">${side(k)
              .map(
                ([pid, rt]) =>
                  `<div class="row small" style="padding:3px 0" data-act="player" data-id="${pid}"><span class="grow ellip">${esc(W.short(P(pid)))}${pid === r.motm ? ' ⭐' : ''}</span>${C.rating(rt)}</div>`,
              )
              .join('')}</div>`,
        )
        .join('')}</div>`,
      { title: 'Match report' },
    );
  };

  // ======================= CLUB =======================
  // The press room: what each outlet thinks of you, the pressure it puts on the club, and the latest from each
  function pressView() {
    const M = FM.Media,
      st = M.state(),
      mood = M.mood(),
      pr = M.pressure();
    const effect =
      pr <= -0.35
        ? 'A hostile press wears down the board’s confidence and the fans’ patience a little every match.'
        : pr >= 0.35
          ? 'A friendly press props up the board’s confidence and the fans’ mood a little every match.'
          : 'The press is not moving the board or the fans either way.';
    const latest = (id) => S().news.find((n) => n.outlet === id);
    const outlet = (id) => {
      const o = M.OUTLETS[id],
        v = st.att[id],
        n = latest(id);
      return `<div class="card"><div class="row"><span style="font-size:20px">${o.icon}</span><div class="grow" style="margin-left:10px"><div class="h3">${esc(M.name(id, club()))}</div><div class="tiny dim">${esc(o.kind)} · ${esc(o.line)}</div></div><div style="text-align:right"><b style="color:${C.moodColor(50 + v / 2)}">${M.view(id)}</b></div></div>${C.bar(50 + v / 2, C.moodColor(50 + v / 2))}${n ? `<div class="small" style="margin-top:8px">“${esc(n.title)}”</div>` : '<div class="tiny dim" style="margin-top:8px">Nothing printed about you yet.</div>'}</div>`;
    };
    return `<div class="card"><div class="row"><div class="grow"><div class="h3">Press mood</div><div class="small dim">${esc(effect)}</div></div><div style="text-align:right"><div class="kpi"><div class="v" style="color:${C.moodColor(50 + mood / 2)}">${M.moodLabel(mood)}</div></div></div></div>${C.bar(50 + mood / 2, C.moodColor(50 + mood / 2))}<div class="tiny dim" style="margin-top:6px">Results move each outlet at its own speed. Press conferences, big signings and sales do too.</div></div>
      ${M.order.map(outlet).join('')}
      <div class="card flat"><div class="h3">The panel on Touchline Tonight</div>${st.pundits
        .map(
          (p) =>
            `<div class="row small" style="padding:4px 0"><b style="min-width:120px">${esc(p.name)}</b><span class="dim">${p.bio ? `${esc(p.bio)} · ` : ''}${{ sensible: 'measured, talks about shape', contrarian: 'disagrees on principle', hothead: 'says what he feels' }[p.style]}</span></div>`,
        )
        .join('')}</div>`;
  }
  UI.screens.club = function () {
    // Out of work: only your own profile and the settings
    if (!club() && !['manager', 'settings'].includes(UI.sub.club)) UI.sub.club = 'manager';
    const t = UI.sub.club;
    return (
      chips(
        'club',
        club()
          ? [
              ['overview', 'Club'],
              ['staff', 'Staff'],
              ['facilities', 'Facilities'],
              ['finances', 'Finances'],
              ['press', 'Press'],
              ['hof', 'Hall of Fame'],
              ['archive', 'Archive'],
              ['manager', 'Manager'],
              ['settings', 'Settings'],
            ]
          : [
              ['manager', 'Manager'],
              ['settings', 'Settings'],
            ],
      ) +
      {
        overview: overviewView,
        staff: () => UI.staffView(),
        facilities: facilitiesView,
        finances: financesView,
        press: pressView,
        hof: hofView,
        archive: archiveView,
        manager: managerView,
        settings: settingsView,
      }[t]()
    );
  };
  // Club records: match records and transfer records since the save began, all-time lists including history
  UI.clubRecordsCard = function (c) {
    const s = S(),
      r = (s.records && s.records.clubs[c.id]) || {},
      at = FM.Records.allTime(c.id);
    const since = (s.records && s.records.since) || s.year;
    const oppName = (id) => (CL(id) ? CL(id).name : '?');
    const row = (label, main, sub, act) =>
      `<div class="row small" style="padding:7px 0;border-top:1px solid var(--line)"><span class="dim" style="width:118px;flex:none">${label}</span><div class="grow" style="min-width:0"><div class="b ellip ${act ? 'tap' : ''}" ${act || ''}>${main}</div>${sub ? `<div class="tiny dim ellip">${sub}</div>` : ''}</div></div>`;
    const match = (m) =>
      m
        ? [
            `${m.gf}–${m.ga} v ${esc(oppName(m.opp))}`,
            `${m.year} · ${esc(s.comps[m.comp] ? s.comps[m.comp].name : '')}`,
          ]
        : ['—', ''];
    const deal = (d, dir) =>
      d
        ? [
            `${esc(d.name)} · ${U.money(d.fee)}`,
            `${d.year} · ${dir === 'in' ? 'from' : 'to'} ${esc(oppName(dir === 'in' ? d.from : d.to))}`,
            s.players[d.pid] ? `data-act="player" data-id="${d.pid}"` : '',
          ]
        : ['—', '', ''];
    const top = at.scorers[0],
      most = at.apps[0];
    const person = (x, v) =>
      x
        ? [
            `${esc(x.name)} · ${v}`,
            x.era
              ? esc(x.era)
              : x.id && s.players[x.id] && W.isUser(s.players[x.id].clubId)
                ? 'In the squad'
                : x.hist
                  ? ''
                  : 'Former player',
            x.id && s.players[x.id] ? `data-act="player" data-id="${x.id}"` : '',
          ]
        : ['—', '', ''];
    const [w1, w2] = match(r.bigWin),
      [l1, l2] = match(r.bigLoss),
      [s1, s2, s3] = deal(r.sign, 'in'),
      [o1, o2, o3] = deal(r.sale, 'out');
    const [t1, t2, t3] = person(top, `${top ? top.goals : 0} goals`),
      [m1, m2, m3] = person(most, `${most ? most.apps : 0} games`);
    return `<div class="card"><div class="row"><div class="h3 grow">Club records</div><span class="tiny dim">matches & transfers since ${since}</span></div>
      ${row('Biggest win', w1, w2)}${row('Heaviest defeat', l1, l2)}${row('Record signing', s1, s2, s3)}${row('Record sale', o1, o2, o3)}${row('Top scorer', t1, t2, t3)}${row('Most appearances', m1, m2, m3)}</div>`;
  };
  // The ground's story: opened, capacity changes over the save
  UI.stadiumCard = function (c) {
    const st = FM.Records.stadium(c),
      first = st.hist[0];
    const grown = st.cap - first[2];
    return `<div class="card"><div class="row"><div class="h3 grow">${esc(st.name)}</div><span class="small dim">opened ${st.opened}</span></div>
      <div class="row small" style="margin-top:8px"><span class="grow muted">Capacity</span><b>${st.cap.toLocaleString()}</b>${grown > 0 ? `<span class="tiny" style="color:var(--good);margin-left:6px">+${grown.toLocaleString()} since ${first[0]}</span>` : ''}</div>
      ${st.hist
        .slice(1)
        .reverse()
        .map(
          ([y, what, cap]) =>
            `<div class="row small" style="padding:6px 0;border-top:1px solid var(--line)"><span class="dim" style="width:44px">${y}</span><span class="grow">${esc(what)}</span><b>${cap.toLocaleString()}</b></div>`,
        )
        .join('')}</div>`;
  };
  function overviewView() {
    const c = club(),
      I = FM.Lore.identity(c.identity, c);
    const staff = Object.values(D.STAFF_ROLES)
      .filter((r) => r.key !== 'scout')
      .map((r) => FM.Staff.get(r.key));
    return `<div class="hero" style="--c1:${U.heroShade(c.colors[0])};--c2:${U.heroShade(c.colors[1])}"><div class="row">${C.crest(c, 64)}<div class="grow"><div class="h1">${esc(c.name)}</div><div class="small" style="opacity:.85;margin-top:4px">${c.nick ? `“${esc(c.nick)}” · ` : ''}${esc(c.stadium.name)} · ${c.stadium.cap.toLocaleString()}</div><div style="margin-top:8px"><span class="pill" style="background:rgba(0,0,0,.3);color:#fff;border:0">${I.icon} ${esc(I.label)}</span> <span class="pill" style="background:rgba(0,0,0,.3);color:#fff;border:0">Rep ${U.repText(c.rep)}</span> ${UI.kindPill ? UI.kindPill(c) : ''}</div></div></div></div>
      <div class="card"><div class="h3">Club culture</div><div class="row small" style="margin-top:6px;gap:6px"><span>${I.icon}</span><b>${esc(I.label)}</b></div><div class="small muted" style="margin-top:4px;line-height:1.5">${esc(I.fans)}</div>
        ${c.policy ? `<div class="phrase"><span>🏛️</span><span>A <b>${esc(c.policy.label)}</b> club: it signs only players of ${esc(c.policy.label)} heritage, like Athletic Club</span></div>` : ''}
        ${c.rival ? `<div class="phrase"><span>⚔️</span><span>The <b>${esc(c.derby)}</b> vs ${esc(CL(c.rival).name)}</span></div>` : ''}
        <div class="row small" style="margin-top:10px"><span style="width:90px" class="dim">Fan mood</span><div class="grow">${C.bar(c.fanMood, C.moodColor(c.fanMood))}</div></div>
        <div class="row small" style="margin-top:8px"><span style="width:90px" class="dim">Board</span><div class="grow">${C.bar(c.boardConf, C.moodColor(c.boardConf))}</div></div></div>
      ${UI.boardroomCard()}
      ${UI.clubSeasonsCard(c.id)}
      <div class="card"><div class="h3">Board objectives</div>${FM.Season.objectives(c)
        .map(
          (o) =>
            `<div class="row small" style="margin-top:8px;align-items:flex-start"><span>${o.ok ? '✅' : o.minOk ? '🟡' : '⏳'}</span><span class="grow">${esc(o.text)}${o.minText ? `<div class="tiny dim">At the very least: ${esc(o.minText)}</div>` : ''}</span><span class="pill ${o.weight === 'critical' ? 'bad' : o.weight === 'bonus' ? '' : 'warn'}" style="font-size:10px">${esc(FM.Board.WEIGHT[o.weight || 'important'].label)}</span><span class="dim" style="margin-left:6px">${esc(o.status)}</span></div>`,
        )
        .join('')}</div>
      ${UI.honoursCard(c, 'No trophies in this save — yet.')}
      ${UI.loreCard ? UI.loreCard(c) : ''}
      ${UI.clubRecordsCard(c)}
      ${UI.stadiumCard(c)}
      <div class="card"><div class="h3">Backroom staff</div>${staff.map((st) => `<div class="row small" style="padding:8px 0;border-top:1px solid var(--line)"><span>${C.flag(st.nat)}</span><div class="grow"><b>${esc(st.fn + ' ' + st.ln)}</b><div class="dim tiny">${esc(st.role)}</div></div><span class="pill">${esc(st.personality)}</span></div>`).join('')}</div>`;
  }
  function facilitiesView() {
    const c = club(),
      F = FM.Season.FAC;
    return (
      `${c.building ? `<div class="warnline">🏗️ Building: ${esc(F[c.building.k].name)} — ${c.building.weeks} week(s) left</div>` : ''}<div class="card flat list" style="padding:0 14px">` +
      Object.entries(F)
        .map(([k, f]) => {
          const lvl = c.facilities[k],
            cost = FM.Season.facCost(k, lvl);
          return `<div class="fac"><div class="ico">${f.icon}</div><div class="grow"><div class="b">${esc(f.name)}</div><div class="tiny dim">${f.effect}${k === 'training' ? ` · takes a player to about ${FM.Season.devCap(c)}` : ''}</div><div class="lvl">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= lvl ? 'on' : ''}"></i>`).join('')}</div></div>${lvl >= 5 ? '<span class="pill good">MAX</span>' : `<button class="btn sm" data-act="upgrade" data-k="${k}" ${c.building || c.balance < cost ? 'disabled' : ''}>${U.money(cost)}<br><span class="tiny dim">${FM.Season.facWeeks(k, lvl)}w</span></button>`}</div>`;
        })
        .join('') +
      '</div>'
    );
  }
  UI.acts.upgrade = (d) => {
    if (FM.Season.upgrade(d.k)) {
      UI.toast('Construction started');
      UI.save();
      UI.render();
    }
  };
  function financesView() {
    const c = club(),
      s = S(),
      sq = W.squad(c.id);
    const L = c.ledger.slice(-16);
    const mx = Math.max(1, ...L.map((l) => Math.max(l.inc, l.exp)));
    const net = s.seasonLog.net[c.id] || 0;
    return `<div class="kpis"><div class="kpi"><div class="v">${U.money(c.balance)}</div><div class="l">Balance</div></div><div class="kpi"><div class="v">${U.money(c.budget)}</div><div class="l">Transfer budget</div></div><div class="kpi"><div class="v">${U.money(U.sum(sq, (p) => p.wage))}</div><div class="l">Wages / wk</div></div></div>
      <div class="card"><div class="row"><div class="h3 grow">Weekly cash flow</div><span class="tiny"><span style="color:var(--good)">■</span> income <span style="color:var(--bad)">■</span> wages</span></div>
        <div class="row" style="align-items:flex-end;height:${L.length ? 110 : 24}px;gap:4px;margin-top:10px">${L.length ? L.map((l) => `<div class="grow row" style="align-items:flex-end;gap:1px;height:100%"><div class="grow" style="height:${(l.inc / mx) * 100}%;background:var(--good);border-radius:3px 3px 0 0"></div><div class="grow" style="height:${(l.exp / mx) * 100}%;background:var(--bad);border-radius:3px 3px 0 0;opacity:.8"></div></div>`).join('') : '<div class="dim small">Play a matchday to see cash flow.</div>'}</div>
        <div class="small dim" style="margin-top:8px">Home games bring gate receipts — bigger stadium, happier fans, more money.</div></div>
      ${UI.incomeCard(c)}
      ${spendCard(c, s, sq)}
      ${UI.paymentsCard(c)}
      <div class="card"><div class="row"><div class="h3 grow">Transfer activity this season</div><b style="color:${net >= 0 ? 'var(--good)' : 'var(--bad)'}">${net >= 0 ? '+' : ''}${U.money(net)}</b></div>
        ${
          s.seasonLog.transfers
            .filter((t) => W.isUser(t.to) || W.isUser(t.from))
            .map(
              (t) =>
                `<div class="row small tap" data-act="player" data-id="${t.pid}" style="padding:6px 0;border-top:1px solid var(--line)"><span>${W.isUser(t.to) ? '⬅️' : '➡️'}</span><span class="grow">${esc(t.name)}${t.loan ? ' <span class="pill">LOAN</span>' : ''}</span>${C.fee(t.fee, W.isUser(t.to) ? 'in' : 'out', t.loan)}</div>`,
            )
            .join('') || '<div class="small dim" style="margin-top:6px">No deals yet.</div>'
        }</div>`;
  }
  // Wages and bonuses this season, by kind, plus the biggest earners
  function spendCard(c, s, sq) {
    const sp = s.seasonLog.spend || {};
    const rows = [
      ['wages', 'Player wages'],
      ['staff', 'Staff wages'],
      ['app', 'Appearance bonuses'],
      ['goal', 'Goal bonuses'],
      ['signing', 'Signing-on fees'],
      ['agent', 'Agent fees'],
      ['interest', 'Interest on debt'],
      ['travel', 'Away travel'],
    ];
    const total = U.sum(rows, ([k]) => sp[k] || 0),
      mx = Math.max(1, ...rows.map(([k]) => sp[k] || 0));
    const earners = sq
      .slice()
      .sort((a, b) => b.wage - a.wage)
      .slice(0, 5);
    const bits = (p) =>
      [
        p.deal && p.deal.app ? `${U.money(p.deal.app)}/app` : '',
        p.deal && p.deal.goal ? `${U.money(p.deal.goal)}/goal` : '',
      ]
        .filter(Boolean)
        .join(' · ');
    return `<div class="card"><div class="row"><div class="h3 grow">Wages & bonuses this season</div><b>${U.money(total)}</b></div>
      ${rows.map(([k, l]) => `<div class="row small" style="margin-top:8px"><span style="width:130px" class="dim">${l}</span><div class="grow">${C.bar(((sp[k] || 0) / mx) * 100, k === 'wages' || k === 'staff' ? 'var(--acc2)' : 'var(--warn)')}</div><b style="width:72px;text-align:right">${U.money(sp[k] || 0)}</b></div>`).join('')}
      <div class="small b dim" style="margin:14px 0 4px">TOP EARNERS</div>
      ${earners.map((p) => `<div class="row small tap" style="padding:5px 0" data-act="player" data-id="${p.id}"><span class="grow ellip">${esc(W.name(p))}${bits(p) ? ` <span class="tiny dim">${bits(p)}</span>` : ''}</span><b>${U.money(p.wage)}/wk</b></div>`).join('')}
      <div class="tiny dim" style="margin-top:8px">Bonuses and fees come from contract clauses you agree in negotiations.</div></div>`;
  }
  function hofView() {
    const s = S(),
      c = club();
    const { withClub, all } = FM.Records.allTime(c.id);
    const sec = (title, arr, val, sub) =>
      `<div class="sec"><div class="h3">${title}</div></div><div class="card flat" style="padding:2px 14px">${
        arr.length
          ? arr
              .slice(0, 5)
              .map(
                (x, i) =>
                  `<div class="legend-row ${x.id && s.players[x.id] ? 'tap' : ''}" ${x.id && s.players[x.id] ? `data-act="player" data-id="${x.id}"` : ''}><div class="rank">${i + 1}</div><div class="grow"><div class="b">${C.flag(x.nat)} ${esc(x.name)} ${x.active ? '<span class="pill acc">Active</span>' : ''}</div><div class="tiny dim">${esc(sub(x))}</div></div><div class="era">${val(x)}</div></div>`,
              )
              .join('')
          : '<div class="empty">Your save will write this chapter.</div>'
      }</div>`;
    return `${sec(
      'Top scorers',
      all.filter((x) => x.goals).sort((a, b) => b.goals - a.goals),
      (x) => x.goals,
      (x) => `${x.pos} · ${x.apps} apps${x.era ? ' · ' + x.era : ''}`,
    )}
      ${sec(
        'Most appearances',
        all.slice().sort((a, b) => b.apps - a.apps),
        (x) => x.apps,
        (x) =>
          `${x.pos}${x.era ? ' · ' + x.era : ''}${x.note ? ' · ' + x.note : ''}${x.hist && x.became ? ' · ' + x.became : ''}`,
      )}
      ${sec(
        'Academy graduates',
        withClub.filter((x) => x.youth === c.id).sort((a, b) => b.apps - a.apps),
        (x) => x.apps,
        (x) => `${x.pos} · ${U.plural(x.goals, 'goal')}${x.became ? ' · ' + x.became : ''}`,
      )}
      ${sec(
        'Cult heroes',
        withClub.filter((x) => x.cult > 0).sort((a, b) => b.cult - a.cult),
        (x) => '⭐' + x.cult,
        (x) => `${x.derbyGoals} derby goals · ${x.apps} apps`,
      )}
      <div class="sec"><div class="h3">Biggest sales</div></div><div class="card flat" style="padding:2px 14px">${(c.bestSales || []).length ? c.bestSales.map((b, i) => `<div class="legend-row ${P(b.pid) ? 'tap' : ''}" ${P(b.pid) ? `data-act="player" data-id="${b.pid}"` : ''}><div class="rank">${i + 1}</div><div class="grow"><div class="b">${esc(b.name)}</div><div class="tiny dim">to ${esc(CL(b.to).name)} · ${b.year}</div></div><div class="era" style="color:var(--bad)">${U.money(b.fee)}</div></div>`).join('') : '<div class="empty">No big sales yet.</div>'}</div>`;
  }
  function archiveView() {
    const s = S();
    if (!s.archive.length)
      return `<div class="empty">📚 The Football Archive<br><br>Every season you play is recorded here — champions, Golden Boots, upsets, record transfers. Fifty seasons from now, scroll back through your alternate football history.<br><br>Finish your first season to write the first entry.</div>`;
    return s.archive
      .slice()
      .reverse()
      .map(
        (
          e,
        ) => `<div class="card"><div class="row"><div class="era grow">${esc(e.label)}</div>${e.user ? `<span class="pill ${e.user.trophies.length ? 'acc' : ''}">You: ${U.ordinal(e.user.pos)} with ${esc(CL(e.user.club).short)}</span>` : ''}</div>
      ${Object.values(e.comps)
        .filter(W.homeLeague)
        .map(
          (
            x,
          ) => `<div style="margin-top:10px"><div class="small b dim" style="text-transform:uppercase;letter-spacing:.6px">${esc(x.name)}</div>
        <div class="row small" style="margin-top:4px">🏆 ${C.crest(CL(x.champion), 18)} <b class="grow">${esc(CL(x.champion).name)}</b><span class="dim">runner-up ${esc(CL(x.runnerUp).short)}</span></div>
        ${x.topScorer ? `<div class="small" style="margin-top:3px">👟 ${esc(x.topScorer.name)} — ${U.plural(x.topScorer.goals, 'goal')}</div>` : ''}
        ${x.poty ? `<div class="small" style="margin-top:3px">⭐ Player of the Season: ${esc(x.poty.name)} (${x.poty.avg})</div>` : ''}
        ${x.playoffWinner ? `<div class="small" style="margin-top:3px">🎟️ Playoff winners: ${esc(CL(x.playoffWinner).name)}</div>` : ''}</div>`,
        )
        .join('')}
      ${
        Object.values(e.comps).some((x) => !W.homeLeague(x))
          ? `<div style="margin-top:10px"><div class="small b dim" style="text-transform:uppercase;letter-spacing:.6px">Around the world</div>${Object.values(
              e.comps,
            )
              .filter((x) => !W.homeLeague(x))
              .map(
                (x) =>
                  `<div class="row small" style="margin-top:4px">${C.flag(x.nat)} <span class="dim grow ellip">${esc(x.name)}</span>${C.crest(CL(x.champion), 16)} <b>${esc(CL(x.champion).short)}</b></div>`,
              )
              .join('')}</div>`
          : ''
      }
      ${UI.regionalSeason(e, false)}
      ${
        e.cups && Object.keys(e.cups).length
          ? `<div style="margin-top:10px"><div class="small b dim" style="text-transform:uppercase;letter-spacing:.6px">Cups</div>${Object.values(
              e.cups,
            )
              .map(
                (x) =>
                  `<div class="row small" style="margin-top:4px">🏆 <span class="dim">${esc(x.name)}</span><span class="grow"></span>${C.crest(CL(x.winner), 16)} <b>${esc(CL(x.winner).name)}</b></div>`,
              )
              .join('')}</div>`
          : ''
      }
      ${e.intl && e.intl.length ? `<div style="margin-top:10px"><div class="small b dim" style="text-transform:uppercase;letter-spacing:.6px">International</div>${e.intl.map((x) => `<div class="small" style="margin-top:4px">🌍 ${esc(x.name)}: <b>${C.flag(FM.S.nteams[x.winner].code)} ${esc(FM.S.nteams[x.winner].name)}</b> <span class="dim">${esc(x.final)} v ${esc(FM.S.nteams[x.runnerUp].name)}</span></div>`).join('')}</div>` : ''}
      <div class="small" style="margin-top:10px">⬆️ ${e.promoted.map((id) => esc(CL(id).short)).join(', ')} &nbsp; ⬇️ ${e.relegated.map((id) => esc(CL(id).short)).join(', ')}</div>
      ${e.upsets.length ? `<div class="small" style="margin-top:6px">😱 Upset of the season: ${esc(CL(e.upsets[0].w).name)} ${e.upsets[0].score.split('–').sort().reverse().join('–')} ${esc(CL(e.upsets[0].l).name)}</div>` : ''}
      ${e.transfers.length ? `<div class="small" style="margin-top:6px">💰 Record deal: ${esc(e.transfers[0].name)} to ${esc(CL(e.transfers[0].to).short)} for ${U.money(e.transfers[0].fee)}</div>` : ''}</div>`,
      )
      .join('');
  }
  // Pre-match team talks: how they landed, and which talk works best for you
  function teamTalkCard(u) {
    const t = u.teamTalks;
    if (!t || !t.n) return '';
    const kinds = Object.entries(t.kinds)
      .map(([k, v]) => [k, v, v.good / v.n])
      .sort((a, b) => b[2] - a[2] || b[1].n - a[1].n);
    const best = kinds.find(([, v]) => v.n >= 3);
    return `<div class="card"><div class="row"><div class="h3 grow">Team talks</div><span class="small dim">${t.n} before kick-off</span></div>
      <div class="row small" style="margin-top:10px;gap:14px;flex-wrap:wrap"><span>🔥 <b>${t.fired}</b> fired up</span><span>👍 <b>${t.ok}</b> got through</span><span>😐 <b>${t.mixed}</b> mixed</span><span>😞 <b>${t.flat}</b> didn't land</span></div>
      <div class="small dim" style="margin-top:8px;line-height:1.5">${kinds.map(([k, v]) => `${esc(FM.Matchday.TALKS[k].label)} ${v.good}/${v.n}`).join(' · ')}${best ? `<br>Your best: <b>${esc(FM.Matchday.TALKS[best[0]].label)}</b> lands ${Math.round(best[2] * 100)}% of the time.` : ''}</div></div>`;
  }
  function managerView() {
    const s = S(),
      u = s.user,
      st = u.stats;
    const tags = [];
    if (st.youthDebuts >= 3) tags.push(['🌱', 'Youth Developer']);
    if (st.giantKills >= 2) tags.push(['🗡️', 'Giant Killer']);
    if (st.promotions >= 1) tags.push(['📈', 'Promotion Specialist']);
    if (st.trophies >= 2) tags.push(['🏆', 'Serial Winner']);
    if (u.tactic.buildup === 'Possession' && st.w > st.l && st.games >= 10) tags.push(['🧠', 'Tactical Innovator']);
    if (st.sold >= 3) tags.push(['💼', 'Wheeler-Dealer']);
    return `<div class="card"><div class="row" style="gap:12px">${C.avatar(u, 52)}<div class="grow"><div class="h2">${u.nat ? C.flag(u.nat) + ' ' : ''}${esc(u.name)}</div><div class="small dim">${esc(u.badges)} licence · ${club() ? `Manager of ${esc(club().name)}` : 'Out of work'}</div></div></div>
      <div class="row small" style="margin-top:12px"><span style="width:90px" class="dim">Reputation</span><div class="grow">${C.stars(U.repStars(u.rep))}</div></div>
      <div style="margin-top:12px">${tags.length ? tags.map(([i, t]) => `<span class="trait">${i} ${t}</span>`).join('') : '<span class="small dim">Your managerial identity will emerge from how you manage — youth, giant-killing, promotions, tactics.</span>'}</div></div>
      ${teamTalkCard(u)}
      ${UI.careerExtras()}
      ${UI.styleCard()}
      <div class="kpis"><div class="kpi"><div class="v">${st.games}</div><div class="l">Games</div></div><div class="kpi"><div class="v">${st.games ? Math.round((st.w / st.games) * 100) : 0}%</div><div class="l">Win rate</div></div><div class="kpi"><div class="v">${st.trophies}</div><div class="l">Trophies</div></div></div>
      <div class="card flat small"><div class="row"><span class="grow dim">W / D / L</span><b>${st.w} / ${st.d} / ${st.l}</b></div><div class="row" style="margin-top:6px"><span class="grow dim">Youth debuts</span><b>${st.youthDebuts}</b></div><div class="row" style="margin-top:6px"><span class="grow dim">Giant-killings</span><b>${st.giantKills}</b></div><div class="row" style="margin-top:6px"><span class="grow dim">Signings / sales</span><b>${st.bought} / ${st.sold}</b></div></div>
      <div class="sec"><div class="h3">Career</div></div><div class="card flat">${
        u.history.filter((h) => h.year).length
          ? u.history
              .filter((h) => h.year)
              .slice()
              .reverse()
              .map(
                (h) =>
                  `<div class="row small" style="padding:6px 0">${C.crest(CL(h.club), 20)}<span class="grow">${h.year} · ${esc(h.comp)}</span><b>${U.ordinal(h.pos)}</b>${h.trophies.length ? ' 🏆' : ''}${h.promoted ? ' ⬆️' : ''}${h.relegated ? ' ⬇️' : ''}</div>`,
              )
              .join('')
          : '<div class="small dim">First season in progress.</div>'
      }</div>`;
  }
  // Honours of a club: national, continental and world trophies first; county cups and state championships are a
  // category of their own beneath them
  UI.honoursCard = function (c, none) {
    const entries = Object.entries(c.titles || {}).filter(([k]) => S().comps[k]),
      main = entries.filter(([k]) => S().comps[k].type !== 'regional'),
      reg = entries.filter(([k]) => S().comps[k].type === 'regional');
    const line = ([k, n], icon) =>
      `<div class="row small" style="margin-top:6px">${icon} <span class="grow">${esc(S().comps[k].name)}</span><b>${n}</b></div>`;
    if (!entries.length && none)
      return `<div class="card"><div class="h3">Honours</div><div class="small dim" style="margin-top:6px">${none}</div></div>`;
    if (!entries.length) return '';
    return `<div class="card"><div class="h3">Honours</div>${main.map((e) => line(e, '🏆')).join('') || (none ? `<div class="small dim" style="margin-top:6px">${none}</div>` : '')}${
      reg.length
        ? `<div class="small b dim" style="margin-top:12px;text-transform:uppercase;letter-spacing:.6px">Regional</div>${reg.map((e) => line(e, '🏅')).join('')}`
        : ''
    }</div>`;
  };
  // A season's county cups and state championships, tucked away under one heading (the winners of every area; yours first)
  UI.regionalSeason = function (e, card) {
    const list = Object.entries(e.regional || {});
    if (!list.length) return '';
    const mine = (x) => FM.W.isUser(x.winner) || FM.W.isUser(x.runnerUp);
    const rows = list
      .sort((a, b) => (mine(b[1]) ? 1 : 0) - (mine(a[1]) ? 1 : 0))
      .map(
        ([, x]) =>
          `<div class="row small" style="margin-top:6px">🏅 <span class="grow ${mine(x) ? 'b' : 'dim'}">${esc(x.name)}</span>${C.crest(CL(x.winner), 16)} <b>${esc(CL(x.winner).short)}</b></div>`,
      )
      .join('');
    const head = `Regional competitions (${list.length})`;
    return card
      ? `<div class="card flat"><details><summary class="small b dim" style="cursor:pointer">${head}</summary>${rows}</details></div>`
      : `<div style="margin-top:10px"><details><summary class="small b dim" style="cursor:pointer;text-transform:uppercase;letter-spacing:.6px">${head}</summary>${rows}</details></div>`;
  };
  function settingsView() {
    const s = S();
    return `<div class="card"><div class="row"><div class="grow"><div class="h3">Theme</div><div class="small dim">Dark or light UI</div></div><div class="seg" style="width:160px"><button class="${s.settings.theme === 'dark' ? 'on' : ''}" data-act="theme" data-v="dark">Dark</button><button class="${s.settings.theme === 'light' ? 'on' : ''}" data-act="theme" data-v="light">Light</button></div></div></div>
      <div class="card"><div class="row"><div class="grow"><div class="h3">Club colours</div><div class="small dim">Use your club's colours as the app's accent (buttons, highlights); off keeps the standard accent</div></div><div class="seg" style="width:120px"><button class="${!s.settings.noClubAccent ? 'on' : ''}" data-act="setFlag" data-k="noClubAccent" data-v="0">On</button><button class="${s.settings.noClubAccent ? 'on' : ''}" data-act="setFlag" data-k="noClubAccent" data-v="1">Off</button></div></div></div>
      <div class="card"><div class="row"><div class="grow"><div class="h3">Match view</div><div class="small dim">The pitch with moving players, or commentary only: the same match, lighter on the battery</div></div><div class="seg" style="width:150px"><button class="${s.settings.matchView !== 'text' ? 'on' : ''}" data-act="setMatchView" data-v="pitch">Pitch</button><button class="${s.settings.matchView === 'text' ? 'on' : ''}" data-act="setMatchView" data-v="text">Text</button></div></div></div>
      <div class="card"><div class="row"><div class="grow"><div class="h3">Default match speed</div></div><div class="seg" style="width:160px">${[1, 2, 4].map((v) => `<button class="${s.settings.speed === v ? 'on' : ''}" data-act="speedDef" data-v="${v}">${v}×</button>`).join('')}</div></div></div>
      <div class="card"><div class="row"><div class="grow"><div class="h3">Season preview popup</div><div class="small dim">Show it automatically in pre-season (it's always on the Home screen)</div></div><div class="seg" style="width:120px"><button class="${!s.settings.skipPreview ? 'on' : ''}" data-act="setFlag" data-k="skipPreview" data-v="0">On</button><button class="${s.settings.skipPreview ? 'on' : ''}" data-act="setFlag" data-k="skipPreview" data-v="1">Off</button></div></div></div>
      <div class="card"><div class="row"><div class="grow"><div class="h3">Reduced motion</div><div class="small dim">Tones down screen animations, the ball trail and the slow-down on big moments (your device's own setting is always honoured)</div></div><div class="seg" style="width:120px"><button class="${!s.settings.reduceMotion ? 'on' : ''}" data-act="setFlag" data-k="reduceMotion" data-v="0">Off</button><button class="${s.settings.reduceMotion ? 'on' : ''}" data-act="setFlag" data-k="reduceMotion" data-v="1">On</button></div></div></div>
      <div class="card"><div class="row"><div class="grow"><div class="h3">Colour-blind kits</div><div class="small dim">Picks the away shirt so the two sides look different to red-green colour blindness too, and draws the away side's players as squares</div></div><div class="seg" style="width:120px"><button class="${!s.settings.colourBlind ? 'on' : ''}" data-act="setFlag" data-k="colourBlind" data-v="0">Off</button><button class="${s.settings.colourBlind ? 'on' : ''}" data-act="setFlag" data-k="colourBlind" data-v="1">On</button></div></div></div>
      <div class="card"><div class="row"><div class="grow"><div class="h3">Haptics</div><div class="small dim">A light tap on every button (phones that support it)</div></div><div class="seg" style="width:120px"><button class="${!s.settings.noHaptics ? 'on' : ''}" data-act="setFlag" data-k="noHaptics" data-v="0">On</button><button class="${s.settings.noHaptics ? 'on' : ''}" data-act="setFlag" data-k="noHaptics" data-v="1">Off</button></div></div></div>
      <div class="card"><div class="row"><div class="grow"><div class="h3">Matchday digest</div><div class="small dim">A round-up card in the feed after every league matchday</div></div><div class="seg" style="width:120px"><button class="${!s.settings.noDigest ? 'on' : ''}" data-act="setFlag" data-k="noDigest" data-v="0">On</button><button class="${s.settings.noDigest ? 'on' : ''}" data-act="setFlag" data-k="noDigest" data-v="1">Off</button></div></div></div>
      <div class="card"><div class="row"><div class="grow"><div class="h3">Currency</div><div class="small dim">Pounds unless you choose another (Auto uses your club's country's currency); prices are converted at fixed rates (the game keeps its money in dollars)</div></div></div><select data-input="currency" style="width:100%;margin-top:8px"><option value="auto" ${s.settings.currency === 'auto' ? 'selected' : ''}>Auto: the club's own currency</option>${Object.entries(
        U.CURRENCIES,
      )
        .map(
          ([k, c]) =>
            `<option value="${k}" ${(s.settings.currency || 'GBP') === k ? 'selected' : ''}>${esc(c.name)} (${esc(c.sym.trim())})</option>`,
        )
        .join('')}</select></div>
      <div class="card"><div class="h3">World rules</div><div class="small muted" style="margin-top:6px;line-height:1.6">Points for a win: <b>${s.rules.win}</b> · Subs: <b>${s.rules.subs}</b> · Foreign players in squad: <b>${W.foreignLimitText()}</b><br>${UI.ownRules()}Rules may change as the football world evolves.</div></div>
      ${UI.textSizeCard()}
      ${UI.installCard()}
      <div class="card"><div class="row"><div class="grow"><div class="h3">Save slot ${UI.slot}</div><div class="small dim">Autosaves after every matchday and whenever you leave the app · ${esc(FM.Save.backend())}</div></div><button class="btn sm" data-act="saveNow">Save now</button></div>
        <div class="row" style="gap:8px;margin-top:12px"><button class="btn sm grow" data-act="exportSave">⬆️ Export backup</button><button class="btn sm grow" data-act="importSave">⬇️ Import backup</button></div>
        <div class="tiny dim" style="margin-top:8px;line-height:1.5">${backupLine(s)} A backup is one compressed .touchline file. Keep it somewhere safe, or move your career to another device.</div></div>
      <div class="card"><div class="row"><div class="grow"><div class="h3">Edit the world</div><div class="small dim" style="margin-top:4px;line-height:1.5">Fix a name, a rating or a colour in the world you are playing, one at a time or in bulk (players, clubs, prize money, youth ratings). A change takes effect at once, and nothing marks the save. Every player and club sheet has an Edit button too. Switch it off to play without the temptation.</div></div><div class="seg" style="width:120px"><button class="${!s.settings.noLiveEdit ? 'on' : ''}" data-act="setFlag" data-k="noLiveEdit" data-v="0">On</button><button class="${s.settings.noLiveEdit ? 'on' : ''}" data-act="setFlag" data-k="noLiveEdit" data-v="1">Off</button></div></div>
        ${s.settings.noLiveEdit ? '' : '<button class="btn sm block" style="margin-top:10px" data-act="liveEdit">✏️ Find a player or a club</button><button class="btn sm block" style="margin-top:8px" data-act="liveBulk">🧰 Bulk edit</button>'}</div>
      <div class="card"><div class="h3">Database</div><div class="small dim" style="margin-top:4px;line-height:1.5">Take this world out as a database file: its leagues, clubs, colours, ratings and stadiums, and optionally every player. Anyone can start a career in it from the new-career screen, or edit it first.${s.database ? ` This world came from <b>${esc(s.database.name)}</b>.` : ''}</div>
        <div class="row" style="gap:8px;margin-top:10px"><button class="btn sm grow" data-act="exportDb" data-p="0">🗄️ Export clubs</button><button class="btn sm grow" data-act="exportDb" data-p="1">🗄️ Export with players</button></div></div>
      <div class="card"><div class="h3">Help</div><div class="small dim" style="margin-top:4px">Something wrong, or an idea? Tell us — a report carries your game's version and a copy of your save, nothing else.</div>
        <div class="row" style="gap:8px;margin-top:10px"><button class="btn sm grow" data-act="reportProblem">🐞 Report a problem</button><button class="btn sm grow" data-act="sendFeedback">💬 Send feedback</button></div>
        <button class="btn sm block" style="margin-top:8px" data-act="whatsNew">🆕 What's new</button>${UI.helpExtras()}${FM.Dev ? '<button class="btn sm block" style="margin-top:8px" data-act="devPanel">🛠 Developer tools</button>' : ''}</div>
      <button class="btn block" data-act="toTitle" style="margin-bottom:10px">Main menu</button>
      <div class="tiny dim center" style="margin-top:14px;line-height:1.6">TOUCHLINE prototype · one-time purchase · no energy · no packs · no pay-to-win</div>`;
  }
  UI.acts.currency = (d, el) => {
    S().settings.currency = (el && el.value) || d.v;
    UI.save();
    UI.render();
  };
  UI.acts.theme = (d) => {
    S().settings.theme = d.v;
    try {
      localStorage.setItem('touchline.theme', d.v);
    } catch (e) {}
    UI.applyTheme();
    UI.save();
    UI.render();
  };
  UI.acts.setFlag = (d) => {
    S().settings[d.k] = d.v === '1';
    if (d.k === 'noClubAccent') UI.applyClubTheme();
    if (d.k === 'reduceMotion') UI.applyMotion();
    UI.save();
    UI.render();
  };
  UI.acts.setMatchView = (d) => {
    S().settings.matchView = d.v === 'text' ? 'text' : 'pitch';
    UI.save();
    UI.render();
  };
  UI.acts.speedDef = (d) => {
    S().settings.speed = +d.v;
    UI.save();
    UI.render();
  };
  UI.acts.saveNow = () => {
    if (UI.save()) UI.toast('Saved');
  };
  const backupLine = (s) => {
    const b = s.settings.lastBackup;
    if (!b) return '<b>No backup yet.</b>';
    const d = new Date(b.at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    return `<b>Last backup: ${esc(d)}</b> (season ${b.year}/${String((b.year + 1) % 100).padStart(2, '0')}).`;
  };
  // Once a season, at the review: nudge towards a backup if there isn't one from the season just finished
  // (the review opens after the new season has started, so "this season" is S().year - 1)
  UI.backupDue = () => {
    const b = S().settings.lastBackup;
    return !b || b.year < S().year - 1;
  };
  // ---------- Help: report a problem, feedback, what's new ----------
  // What a report carries: the version, the build, the platform and where the save stands: nothing personal
  UI.diagnostics = async function () {
    const s = S(),
      m = FM.Save.metaOf ? FM.Save.metaOf(UI.slot) : null;
    let kb = '';
    try {
      const raw = await FM.Save.read(UI.slot);
      kb = raw ? ` · save ${Math.round(raw.length / 1024)} KB` : '';
    } catch (e) {
      /* no size */
    }
    const build = ((document.querySelector('script[src*="core.js"]') || {}).src || '').match(/v=(\d+)/);
    const cap = window.Capacitor && window.Capacitor.getPlatform ? window.Capacitor.getPlatform() : 'web';
    return [
      `Touchline ${FM.VERSION} (build ${build ? build[1] : '?'}) · ${cap} · save format ${FM.SAVE_VERSION}${kb}`,
      s && s.user
        ? `Season ${s.year}, day ${s.day} of ${(s.calendar || []).length}${m && m.club ? ' · ' + m.club.name : ''}`
        : 'No career open',
      `${navigator.userAgent.slice(0, 120)}`,
    ].join('\n');
  };
  // The parts of the game a report can be about: they go on each report as its area, so the developer can group what comes in
  UI.REPORT_AREAS = [
    'Match day',
    'Squad and tactics',
    'Transfers and contracts',
    'Finances',
    'Youth and training',
    'Fixtures and competitions',
    'Screens and text',
    'Saving and loading',
    'Speed',
    'Something else',
  ];
  // Where a report or a piece of feedback is posted when the game has a private inbox: the address of tools/inbox.mjs (or anything
  // that takes the same POST). Empty: feedback opens the project page, and a report is shared as a file.
  UI.INBOX_URL = '';
  // The tag on everything sent: the version, the build, the platform and the area the player picked
  UI.reportTag = () => {
    const build = ((document.querySelector('script[src*="core.js"]') || {}).src || '').match(/v=(\d+)/);
    return {
      version: FM.VERSION,
      build: build ? +build[1] : null,
      platform: window.Capacitor && window.Capacitor.getPlatform ? window.Capacitor.getPlatform() : 'web',
      saveFormat: FM.SAVE_VERSION,
      area: (document.getElementById('help-area') || {}).value || '',
      at: Date.now(),
    };
  };
  const helpSheet = async (title, intro, ph, buttons, opts = {}) => {
    const diag = await UI.diagnostics();
    UI.sheet(
      `<div class="small dim" style="line-height:1.5">${intro}</div>
      <div class="tiny dim" style="margin-top:10px">What was it about?</div>
      <select id="help-area" style="width:100%;margin-top:4px;padding:10px;border-radius:12px;border:1px solid var(--line2)">${UI.REPORT_AREAS.map((a) => `<option>${esc(a)}</option>`).join('')}</select>
      <textarea id="help-text" rows="5" placeholder="${ph}" style="width:100%;margin-top:10px;padding:10px;border-radius:12px;border:1px solid var(--line2);background:var(--card2);color:var(--ink);font:inherit"></textarea>
      ${opts.contact ? `<input id="help-contact" type="email" autocomplete="email" placeholder="Your email, only if you would like a reply" style="width:100%;margin-top:8px;padding:10px;border-radius:12px;border:1px solid var(--line2);background:var(--card2);color:var(--ink);font:inherit">` : ''}
      <div class="tiny dim" style="margin-top:8px;white-space:pre-line">${esc(diag)}</div>
      ${buttons.map(([act, label, pri]) => `<button class="btn ${pri ? 'pri' : ''} block" style="margin-top:12px" data-act="${act}">${label}</button>`).join('')}`,
      { title },
    );
  };
  // Posts to the inbox; throws when there is none or it does not answer
  UI.postInbox = async (payload) => {
    if (!UI.INBOX_URL) throw new Error('No inbox');
    const r = await fetch(UI.INBOX_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(`The inbox answered ${r.status}`);
  };
  const b64 = (bytes) => {
    let s = '';
    for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  };
  UI.acts.reportProblem = () =>
    helpSheet(
      'Report a problem',
      UI.INBOX_URL
        ? 'Describe what went wrong. The report is sent privately to the developer with your save and the version details below; nothing is made public. You can also keep it as a file to send yourself.'
        : 'Describe what went wrong. The report is your save as a backup file, with the version details below; it goes wherever you share it (email, messages, a file).',
      'What happened, and what were you doing?',
      UI.INBOX_URL
        ? [
            ['sendReport', '⬆️ Send the report', true],
            ['shareReport', '📎 Keep it as a file instead'],
          ]
        : [['shareReport', '⬆️ Share the report', true]],
    );
  // The report is the save with a "report" section: the note, the tag and the details, so the file says what it is about
  UI.makeReport = async (kind) => {
    const note = (document.getElementById('help-text') || {}).value || '';
    if (FM.S && FM.S.user) await FM.Save.write(UI.slot, S());
    const report = { kind, note, ...UI.reportTag(), diag: await UI.diagnostics() };
    const f = await FM.Save.exportFile(UI.slot, report);
    return { report, f, note };
  };
  UI.acts.sendReport = async () => {
    try {
      const { report, f } = await UI.makeReport('problem');
      await UI.postInbox({ ...report, name: f.name, file: b64(f.bytes) });
      UI.closeSheet();
      UI.toast('Report sent. Thank you', 3500);
    } catch (e) {
      console.warn(e);
      UI.toast('⚠️ Could not send it: use “Keep it as a file instead”', 4500);
    }
  };
  UI.acts.shareReport = async () => {
    try {
      const { f, note } = await UI.makeReport('problem');
      const r = await FM.Native.shareFile({
        bytes: f.bytes,
        name: f.name.replace(/^touchline-/, 'touchline-problem-'),
        type: f.type,
        title: 'Touchline problem report',
        text: `${note}\n\n${await UI.diagnostics()}`,
        preferShare: matchMedia('(pointer: coarse)').matches,
      });
      UI.closeSheet();
      if (r !== 'cancelled')
        UI.toast(r === 'saved' ? 'Report saved: send the file to us' : 'Report ready to send', 3500);
    } catch (e) {
      console.warn(e);
      UI.toast('⚠️ ' + (e.message || 'Could not make the report'), 4000);
    }
  };
  UI.FEEDBACK_URL = 'https://github.com/tpkhoon/touchline/issues/new';
  UI.acts.sendFeedback = () =>
    helpSheet(
      'Send feedback',
      UI.INBOX_URL
        ? 'An idea, something confusing, something you loved? It is sent privately to the developer with the version details attached; no save is sent and no account is needed.'
        : 'An idea, something confusing, something you loved? It opens a new note on the project page with the version details attached; no save is sent.',
      'What would make the game better?',
      [['sendFeedbackGo', UI.INBOX_URL ? '💬 Send the feedback' : '💬 Open the feedback page', true]],
      { contact: !!UI.INBOX_URL },
    );
  UI.acts.sendFeedbackGo = async () => {
    const note = (document.getElementById('help-text') || {}).value || '';
    const tag = UI.reportTag();
    if (UI.INBOX_URL) {
      try {
        await UI.postInbox({
          kind: 'feedback',
          note,
          ...tag,
          contact: ((document.getElementById('help-contact') || {}).value || '').slice(0, 120),
          diag: await UI.diagnostics(),
        });
        UI.closeSheet();
        return UI.toast('Thank you: your feedback was sent', 3500);
      } catch (e) {
        console.warn(e);
        UI.toast('⚠️ Could not send it just now. Try again later', 4000);
        return;
      }
    }
    const url = `${UI.FEEDBACK_URL}?title=${encodeURIComponent('Feedback: ' + (note.split('\n')[0].slice(0, 60) || 'my thoughts'))}&body=${encodeURIComponent(`${note}\n\nArea: ${tag.area} · version ${tag.version}\n\n---\n${await UI.diagnostics()}`)}`;
    window.open(url, '_blank', 'noopener');
    UI.closeSheet();
  };
  UI.acts.whatsNew = () =>
    UI.sheet(
      `<div class="tiny dim" style="margin-bottom:8px">The latest builds, newest first.</div>${
        (FM.CHANGELOG || [])
          .map(
            (b) =>
              `<div class="card flat" style="margin-bottom:8px"><div class="b">${esc(b.build)}</div>${
                b.items
                  ? `<ul class="small dim" style="margin:6px 0 0;padding-left:18px;line-height:1.5">${b.items.map((i) => `<li style="margin-bottom:4px">${i.lead ? `<b style="color:var(--ink)">${esc(i.lead)}.</b> ` : ''}${esc(i.text)}</li>`).join('')}</ul>`
                  : `<div class="small dim" style="margin-top:4px;line-height:1.5">${esc(b.text)}</div>`
              }</div>`,
          )
          .join('') || '<div class="empty">Nothing recorded yet.</div>'
      }`,
      { title: "What's new", full: true },
    );
  // ---------- Backups ----------
  // The world as a database file (a world definition: FM.DbImport reads it back)
  UI.acts.exportDb = async (d) => {
    try {
      const withPlayers = d.p === '1';
      const bytes = new TextEncoder().encode(FM.DbImport.export({ withPlayers }));
      const name = `touchline-database-${S().year}${withPlayers ? '-players' : ''}.json`;
      const r = await FM.Native.shareFile({
        bytes,
        name,
        type: 'application/json',
        title: 'Touchline database',
        preferShare: matchMedia('(pointer: coarse)').matches,
      });
      if (r !== 'cancelled')
        UI.toast(
          `Database ${r === 'saved' ? 'saved' : 'ready'}: ${name} (${Math.max(1, Math.round(bytes.length / 1024))} KB)`,
          3500,
        );
    } catch (e) {
      console.warn(e);
      UI.toast('⚠️ ' + (e.message || 'Export failed'), 4000);
    }
  };
  UI.acts.exportSave = async () => {
    try {
      await FM.Save.write(UI.slot, S());
      const f = await FM.Save.exportFile(UI.slot);
      const r = await FM.Native.shareFile({
        bytes: f.bytes,
        name: f.name,
        type: f.type,
        title: 'Touchline backup',
        preferShare: matchMedia('(pointer: coarse)').matches,
      });
      if (r !== 'cancelled') {
        // Remember when (real date and game date) for the Settings line and the season-end reminder
        S().settings.lastBackup = { at: Date.now(), year: S().year, day: S().day };
        UI.save();
        document.getElementById('backupNudge')?.remove();
        if (UI.tab === 'club' && UI.sub.club === 'settings' && !document.querySelector('.sheet-wrap')) UI.render();
        UI.toast(
          `Backup ${r === 'saved' ? 'saved' : 'ready'}: ${f.name} (${Math.max(1, Math.round(f.bytes.length / 1024))} KB)`,
          3500,
        );
      }
    } catch (e) {
      console.warn(e);
      UI.toast('⚠️ ' + (e.message || 'Export failed'), 4000);
    }
  };
  UI.acts.importSave = async () => {
    const bytes = await FM.Native.pickFile('');
    if (!bytes) return;
    let res;
    try {
      res = await FM.Save.importBytes(bytes);
    } catch (e) {
      return UI.toast('⚠️ ' + e.message, 4500);
    }
    UI._import = res.state;
    const st = res.state,
      // (a backup made out of work has no club: shown by the manager's name, with a plain badge)
      c = st.clubs[st.user.clubId] || {
        id: 'none',
        name: `${st.user.name} (out of work)`,
        short: '—',
        colors: ['#334155', '#94a3b8'],
      };
    UI.sheet(
      `<div class="card row">${C.crest(c, 36)}<div class="grow"><div class="b">${esc(c.name)}</div><div class="small dim">${esc(st.user.name)} · ${st.year} · day ${st.day + 1}${res.from < FM.Save.VERSION ? ` · upgraded from v${res.from}` : ''}</div></div></div>
      <div class="h3" style="margin:10px 0 6px">Import into</div>
      <div class="list">${FM.Save.SLOTS.map((n) => {
        const m = UI.slotMeta(n);
        return `<div class="prow tap" data-act="importTo" data-n="${n}"><b style="width:52px">Slot ${n}</b><div class="grow small ${m ? '' : 'dim'}">${m ? `${esc(m.club.name)} · ${m.year} — <span style="color:var(--bad)">will be replaced</span>` : 'Empty'}</div><span class="dim">›</span></div>`;
      }).join('')}</div>`,
      { title: 'Import backup' },
    );
  };
  UI.acts.importTo = async (d) => {
    const st = UI._import,
      n = +d.n;
    if (!st) return;
    try {
      await FM.Save.write(n, st);
      UI._import = null;
      UI.closeAllSheets();
      if (!(await UI.load(n))) return;
      UI.applyTheme();
      UI.tab = 'home';
      UI.mount();
      UI.toast(`Backup imported into slot ${n}`, 3000);
      UI.finishPendingDay();
    } catch (e) {
      console.warn(e);
      UI.toast('⚠️ Could not import: ' + (e.message || 'storage error'), 4500);
    }
  };
  UI.acts.toTitle = () => {
    UI.save();
    UI.title();
  };

  // ---------- Season review ----------
  UI.seasonReview = function (sm) {
    const e = sm.entry;
    const c = e.user ? CL(e.user.club) : NOCLUB; // out of work all season: no club to review
    // only the leagues you follow (and your own) are told about: the whole world's champions would be a long list
    const fol = new Set([...UI.follows().comps, ...(e.user && e.user.comp ? [e.user.comp] : [])]),
      shown = Object.entries(e.comps).filter(([id]) => fol.has(id)),
      cupsShown = Object.entries(e.cups || {}).filter(([id, x]) => fol.has(id) || FM.W.isUser(x.winner));
    UI.sheet(
      `<div class="hero" style="--c1:${U.heroShade(c.colors[0])};--c2:${U.heroShade(c.colors[1])}"><div class="tag">Season review · ${esc(e.label)}</div><div class="h1" style="margin:10px 0">${!e.user ? 'A season out of the dugout' : sm.trophies.length ? '🏆 ' + esc(sm.trophies.join(' & ')) : `Finished ${U.ordinal(sm.userPos)}`}</div><div class="small" style="opacity:.9">${sm.promoted ? `⬆️ Promoted to the ${esc(S().comps[c.comp].name)}!` : sm.relegated ? '⬇️ Relegated. The rebuild starts now.' : esc(c.name)}</div></div>
      ${!e.user ? '<div class="small muted" style="margin:4px 2px 12px">The football world carried on without you. Your offers are on the Home tab.</div>' : ''}
      ${e.user ? `<div class="card"><div class="h3">Board verdict</div>${sm.objs.map((o) => `<div class="row small" style="margin-top:8px"><span>${o.ok || (o.promo && sm.promoted) ? '✅' : '❌'}</span><span class="grow">${esc(o.text)}</span></div>`).join('')}<div class="small muted" style="margin-top:10px">${sm.sacked ? 'The board have seen enough.' : 'Board confidence: ' + Math.round(c.boardConf) + '%'}</div></div>` : ''}
      ${shown
        .map(([, x]) => x)
        .filter(W.homeLeague)
        .map(
          (x) =>
            `<div class="card flat"><div class="small b dim">${esc(x.name.toUpperCase())}</div><div class="row small" style="margin-top:6px">🏆 ${C.crest(CL(x.champion), 18)}<b class="grow">${esc(CL(x.champion).name)}</b></div>${x.topScorer ? `<div class="small" style="margin-top:4px">👟 ${esc(x.topScorer.name)} (${x.topScorer.goals})</div>` : ''}${x.poty ? `<div class="small" style="margin-top:4px">⭐ ${esc(x.poty.name)}</div>` : ''}</div>`,
        )
        .join('')}
      <div class="card flat"><div class="small b dim">LEAGUES YOU FOLLOW</div>${
        shown
          .map(([, x]) => x)
          .filter((x) => !W.homeLeague(x))
          .map(
            (x) =>
              `<div class="row small" style="margin-top:6px">${C.flag(x.nat)} <span class="grow ellip">${esc(x.name)}</span>${C.crest(CL(x.champion), 16)} <b>${esc(CL(x.champion).short)}</b></div>`,
          )
          .join('') ||
        '<div class="tiny dim" style="margin-top:6px">Follow a league (☆ on its screen) to see its champion here.</div>'
      }</div>
      ${UI.regionalSeason(e, true)}
      ${
        cupsShown.length
          ? `<div class="card flat"><div class="small b dim">CUPS</div>${cupsShown
              .map(([, x]) => x)
              .map(
                (x) =>
                  `<div class="row small" style="margin-top:6px">🏆 <span class="grow">${esc(x.name)}</span>${C.crest(CL(x.winner), 16)} <b>${esc(CL(x.winner).short)}</b></div>`,
              )
              .join('')}</div>`
          : ''
      }
      ${e.intl && e.intl.length ? `<div class="card flat"><div class="small b dim">THIS SUMMER</div>${e.intl.map((x) => `<div class="row small" style="margin-top:6px">🌍 <span class="grow">${esc(x.name)}</span><b>${C.flag(FM.S.nteams[x.winner].code)} ${esc(FM.S.nteams[x.winner].name)}</b></div>`).join('')}</div>` : ''}
      ${UI.backupDue() ? `<div class="warnline row" id="backupNudge" style="gap:10px"><span class="grow">💾 A good moment to export a backup of your career — one small file, safe anywhere.</span><button class="btn sm" data-act="exportSave">Export</button></div>` : ''}
      <div class="small muted center" style="margin:10px 0">Everything has been written into the Football Archive.<br>Players have aged, contracts expired, veterans retired, and the world moved on — check the feed.</div>
      <button class="btn pri block" data-act="closeSheet">Start ${FM.Season.seasonLabel()} →</button>`,
      { title: 'End of season' },
    );
  };
})();
