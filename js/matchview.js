// Live match: top-down pitch with moving dots, highlights, tactical prompts, momentum, post-match analysis.
(function () {
  const FM = window.FM,
    U = FM.U,
    D = FM.D,
    W = FM.W,
    UI = FM.UI,
    C = UI.C;
  const esc = U.esc;
  const MV = (FM.MatchView = {});
  // The view's own random numbers (where a shot is placed, how far a player carries): a stream of their own, so what is
  // drawn on screen can never change how the match itself plays out. The same match plays the same on the pitch, as text
  // and as an instant result.
  let vs = (Date.now() ^ 0x9e3779b9) >>> 0;
  MV.vr = () => {
    vs = (vs + 0x6d2b79f5) | 0;
    let t = Math.imul(vs ^ (vs >>> 15), 1 | vs);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  MV.vrange = (a, b) => a + MV.vr() * (b - a);
  const CL = (id) => FM.clubOf(id);
  const P = (id) => FM.S.players[id];

  // ---------------- Preview ----------------
  // The opposition's likely XI, line by line (from the same pick the match will use for them, unless they have
  // injuries or suspensions by then), with the danger man starred and who they are missing
  MV.predictedXI = function (opp, key) {
    const t = opp.tactic,
      slots = D.FORMATIONS[t.formation] || [];
    const { xi } = W.pickXI(opp.id, t);
    const line = (g) =>
      xi
        .map((p, i) => (p && slots[i] && D.POS_GROUP[slots[i].t] === g ? p : null))
        .filter(Boolean)
        .map(
          (p) =>
            `${C.pname(p, (p.no ? p.no + ' ' : '') + p.ln)}${p === key ? ' <span title="Danger man">★</span>' : ''}`,
        )
        .join(' · ');
    const out = W.squad(opp.id).filter((p) => !W.available(p));
    const row = (l, g) =>
      `<div class="row small" style="margin-top:6px;gap:8px;align-items:flex-start"><span class="dim" style="width:34px">${l}</span><span class="grow" style="line-height:1.7">${line(g)}</span></div>`;
    return `<div class="card"><div class="row"><div class="h3 grow">Predicted XI</div><span class="tiny dim">${esc(t.formation)}</span></div>
      ${row('GK', 'GK')}${row('DEF', 'DEF')}${row('MID', 'MID')}${row('ATT', 'ATT')}
      ${out.length ? `<div class="tiny dim" style="margin-top:8px">Missing: ${out.map((p) => esc(p.ln) + (p.inj ? ' (injured)' : p.service ? ' (military service)' : ' (suspended)')).join(', ')}</div>` : ''}</div>`;
  };
  const DANGER_POS = { ST: 1, W: 0.96, AM: 0.96, WM: 0.9, CM: 0.82, WB: 0.74, FB: 0.7, DM: 0.68, CB: 0.6, GK: 0.2 };
  MV.preview = function () {
    const fx = FM.Season.userFixture();
    if (!fx) return;
    const s = FM.S,
      home = W.isMine(fx.h),
      me = CL(home ? fx.h : fx.a),
      opp = CL(home ? fx.a : fx.h);
    const nt = me.sim === 'nation',
      myTactic = nt ? me.tactic : s.user.tactic;
    const oppXI = W.pickXI(opp.id, opp.tactic).xi.filter(Boolean);
    // the danger man is the one who scores or creates: judged on ability weighted by how attacking his position is,
    // plus what he has done this season, never a keeper or a centre-back just because he is the best-rated
    const threat = (p) => {
      const st = p.season || {},
        g = st.apps >= 3 ? ((st.goals || 0) + 0.6 * (st.ast || 0)) / st.apps : 0;
      return p.ca * (DANGER_POS[p.pos] ?? 0.6) + g * 8;
    };
    const key = oppXI.slice().sort((a, b) => threat(b) - threat(a))[0] || oppXI[0];
    const { xi } = W.pickXI(me.id, myTactic);
    const unavailable = nt
      ? FM.Intl.pool(me.code)
          .slice(0, 23)
          .filter((p) => !W.available(p))
      : W.squad(me.id).filter((p) => !W.available(p));
    const mgr = opp.manager && s.staff[opp.manager];
    const derby = me.rival === opp.id;
    const f1 = fx.first && FM.Cups.findFixture(fx.first);
    const asst = FM.Staff.get('assistant');
    const tip =
      opp.tactic.press === 'High Press'
        ? 'They press high — a Counter build-up could hurt them.'
        : opp.tactic.press === 'Low Block'
          ? 'They sit deep. Patience and width will be key.'
          : opp.tactic.buildup === 'Direct'
            ? 'They go long early. Our centre-backs must win the first ball.'
            : 'A well-balanced side. Control midfield and we control the game.';
    const heat = !derby && FM.Records.heat(me.id, opp.id);
    // Starters playing out of position (the fit bar on the tactics screen shows the same), loudly, before kick-off
    const slots = D.FORMATIONS[myTactic.formation];
    const outOfPos = xi
      .map((p, i) => p && { p, t: slots[i].t, fit: W.fitAt(p, slots[i].t, slots[i], myTactic.roles[i]) })
      .filter((x) => x && x.fit < 0.8);
    UI.sheet(
      `${derby ? `<div class="warnline" style="color:#ff6b6b;background:rgba(255,80,80,.12)">⚔️ ${esc(me.derby)} — the fans will never forget this one, win or lose.</div>` : heat >= FM.Records.EMERGING ? `<div class="warnline">🔥 ${heat >= FM.Records.RIVALRY ? `${esc(opp.name)} are rivals now` : `A rivalry is building with ${esc(opp.name)}`} — expect a big crowd and a few crunching tackles.</div>` : ''}
      <div class="row" style="justify-content:space-around;text-align:center;margin:6px 0 12px"><div>${C.crest(CL(fx.h), 56)}<div class="small b">${esc(CL(fx.h).name)}</div></div><div class="h2">VS</div><div>${C.crest(CL(fx.a), 56)}<div class="small b">${esc(CL(fx.a).name)}</div></div></div>
      <div class="card"><div class="h3">Opposition</div>
        <div class="row small" style="margin-top:8px"><span class="grow dim">Manager</span><b>${mgr ? esc(mgr.fn + ' ' + mgr.ln) : '—'}</b></div>
        <div class="row small" style="margin-top:6px"><span class="grow dim">System</span><b>${opp.tactic.formation} · ${opp.tactic.buildup} · ${opp.tactic.press}</b></div>
        <div class="row small" style="margin-top:6px"><span class="grow dim">Danger man</span><b class="tap" data-act="player" data-id="${key.id}">${C.flag(key.nat)} ${esc(W.name(key))} (${key.pos})</b></div>
        <div class="q" style="margin-top:10px;padding:10px 12px;background:var(--card2);border-radius:12px;font-size:13px;border-left:3px solid var(--acc2)"><b class="tiny dim" style="display:block">${esc(asst.fn + ' ' + asst.ln)} · Assistant</b>“${tip}”</div></div>
      ${MV.predictedXI(opp, key)}
      ${MV.conditions(fx, me, opp, nt)}
      ${f1 && f1.res ? `<div class="warnline" style="margin-bottom:8px">Second leg. First leg: ${esc(CL(f1.h).name)} ${f1.res.hg}–${f1.res.ag} ${esc(CL(f1.a).name)}${s.rules.awayGoals ? ' · away goals count' : ''}. Level on aggregate after 90 minutes → extra time${s.rules.awayGoals ? ' (unless away goals decide it)' : ''}.</div>` : fx.leg === 1 ? '<div class="warnline" style="margin-bottom:8px">First leg — no extra time tonight. The tie is decided in the return match.</div>' : ''}
      <div class="card"><div class="row"><div class="h3 grow">Your XI · ${myTactic.formation}</div><button class="btn sm" data-act="${nt ? 'goNation' : 'goTactics'}">${nt ? 'Squad' : 'Tactics'}</button></div>
        <div class="small muted" style="margin-top:8px;line-height:1.7">${xi
          .filter(Boolean)
          .map(
            (p) =>
              `${C.pname(p, (p.no ? p.no + ' ' : '') + p.ln)}${p.fitness < 75 ? ' <span style="color:var(--warn)">(' + Math.round(p.fitness) + '%)</span>' : ''}`,
          )
          .join(' · ')}</div>
        ${unavailable.length ? `<div class="small" style="margin-top:8px;color:var(--bad)">Unavailable: ${unavailable.map((p) => C.pname(p, p.ln) + (p.inj ? ' (injured)' : p.service ? ' (military service)' : ' (suspended)')).join(', ')}</div>` : ''}</div>
      ${outOfPos.length ? `<div class="warnline" style="color:#ff6b6b;background:rgba(255,80,80,.12)">⚠️ ${outOfPos.length} out of position: ${outOfPos.map((x) => `${esc(x.p.ln)} (${W.posLabel(x.p)} at ${slots[xi.indexOf(x.p)] ? D.slotLabel(slots[xi.indexOf(x.p)]) : x.t})`).join(', ')}.${s.rules.foreignLimit < W.NO_LIMIT && xi.filter((p) => p && p.nat !== me.nat).length >= s.rules.foreignLimit ? ` The ${s.rules.foreignLimit}-foreign-player limit is filled.` : ''} Check your XI in Tactics.</div>` : ''}
      ${MV.reminders(fx, xi.filter(Boolean), nt)}
      ${MV.oppCard(fx)}
      ${MV.talkCard(fx)}
      <div class="sh-foot"><button class="btn pri block" data-act="kickoff">▶ Watch live</button><button class="btn block" data-act="instant">⚡ Instant</button></div>`,
      { title: fx.po || (FM.S.comps[fx.comp] ? FM.S.comps[fx.comp].name : 'International') },
    );
  };
  // Things to check before kick-off: bans one card away, tired starters, contracts, lineup gaps
  MV.reminders = function (fx, xi, nt) {
    const out = [];
    // Bookings count across all club competitions
    xi.filter((p) => p.season.yc % 5 === 4 && !nt).forEach((p) =>
      out.push(['🟨', `${W.short(p)} is one booking from a one-match ban.`]),
    );
    const tired = xi.filter((p) => p.fitness < 70).sort((a, b) => a.fitness - b.fitness);
    if (tired.length)
      out.push([
        '🔋',
        `${tired.map((p) => `${W.short(p)} (${Math.round(p.fitness)}%)`).join(', ')} ${tired.length === 1 ? 'is' : 'are'} short of match fitness — injury risk and a weaker second half.`,
      ]);
    // (players out of position have their own warning above the reminders)
    if (xi.length < 11) out.push(['⚠️', `Only ${xi.length} fit players for the starting XI.`]);
    if (!nt) {
      const leaving = xi.filter((p) => !p.loan && p.contract <= FM.S.year);
      if (leaving.length)
        out.push([
          '⏳',
          `${leaving.map((p) => W.short(p)).join(', ')} ${leaving.length === 1 ? 'is' : 'are'} out of contract this summer.`,
        ]);
    }
    if (!out.length) return '';
    return `<div class="card"><div class="h3">Before kick-off</div>${out.map(([i, t]) => `<div class="phrase" style="padding:6px 0;border-top:1px solid var(--line)"><span>${i}</span><span class="small">${esc(t)}</span></div>`).join('')}</div>`;
  };
  // Pre-match team talk: picked in the preview, delivered as the teams go out (live or instant)
  const TALK_SHORT = {
    calm: 'Calm',
    focus: 'Focus',
    free: 'Relax',
    fire: 'Fire up',
    pressure: 'Demand',
    tactics: 'Tactics',
  };
  // The opposition report and the instructions that answer it (up to two; the assistant pre-selects what the report favours)
  MV.oppCard = function (fx) {
    const Md = FM.Matchday;
    if (fx.intl || !FM.clubOf(W.isMine(fx.h) ? fx.a : fx.h).tactic) return '';
    const rep = Md.opposition(fx);
    MV.rep = rep;
    MV.ins = rep.best.map((a) => a.id);
    const advice = Object.fromEntries(rep.advice.map((a) => [a.id, a]));
    const asst = FM.Staff.get('assistant');
    return `<div class="card"><div class="h3">Their weaknesses</div>
      ${rep.lines.length ? rep.lines.map(([i, t]) => `<div class="phrase" style="padding:6px 0;border-top:1px solid var(--line)"><span>${i}</span><span class="small">${esc(t)}</span></div>`).join('') : '<div class="small muted" style="margin-top:6px">A balanced side with no obvious weakness.</div>'}
      <div class="h3" style="margin-top:12px">Match instructions <span class="tiny dim">(up to two)</span></div>
      <div id="insList">${Object.entries(Md.INS)
        .map(([id, d]) => {
          const a = advice[id];
          return `<button class="btn sm ins ${MV.ins.includes(id) ? 'pri' : ''}" style="margin:4px 4px 0 0" data-act="insPick" data-v="${id}" title="${esc(d.desc)}">${esc(d.short)}${a ? (a.s > 0 ? ' 👍' : ' ⚠️') : ''}</button>`;
        })
        .join('')}</div>
      <div class="small muted" id="insDesc" style="margin-top:8px;line-height:1.45">${MV.insDesc()}</div>
      <div class="tiny dim" style="margin-top:6px">${esc(asst.fn + ' ' + asst.ln)}: ${rep.best.length ? esc(rep.best.map((a) => a.why).join('. ')) + '.' : 'Nothing stands out; play your game.'}</div></div>`;
  };
  MV.insDesc = () => {
    const Md = FM.Matchday,
      adv = Object.fromEntries(((MV.rep && MV.rep.advice) || []).map((a) => [a.id, a]));
    return MV.ins.length
      ? MV.ins
          .map(
            (id) =>
              `<b>${esc(Md.INS[id].label)}.</b> ${esc(Md.INS[id].desc)}.${adv[id] && adv[id].s < 0 ? ` <span style="color:var(--warn)">⚠️ ${esc(adv[id].why)}.</span>` : ''}`,
          )
          .join('<br>')
      : 'No instructions: play the system as set.';
  };
  UI.acts.insPick = (d) => {
    const i = MV.ins.indexOf(d.v);
    if (i >= 0) MV.ins.splice(i, 1);
    else MV.ins = MV.ins.concat([d.v]).slice(-2);
    document
      .querySelectorAll('[data-act=insPick]')
      .forEach((b) => b.classList.toggle('pri', MV.ins.includes(b.dataset.v)));
    const el = document.getElementById('insDesc');
    if (el) el.innerHTML = MV.insDesc();
  };
  MV.talkCard = function (fx) {
    const Md = FM.Matchday,
      ctx = Md.talkContext(fx),
      sugg = Md.suggestTalk(ctx);
    MV.talkCtx = ctx;
    MV.talkSugg = sugg;
    MV.talk = sugg;
    const sd = { club: FM.clubOf(W.isMine(fx.h) ? fx.h : fx.a) };
    const nt = sd.club.sim === 'nation';
    const { xi } = W.pickXI(sd.club.id, nt ? sd.club.tactic : FM.S.user.tactic);
    const capt = Md.armband(
      sd,
      xi.filter(Boolean).map((p) => ({ p })),
    );
    const mood = `${ctx.fav ? 'Favourites' : ctx.under ? 'Underdogs' : 'Evenly matched'}${ctx.derby ? ' · derby' : ctx.big ? ' · big occasion' : ''}`;
    return `<div class="card"><div class="row"><div class="h3 grow">Team talk</div><span class="tiny dim">${mood}</span></div>
      <div class="seg" style="margin-top:8px">${Object.keys(Md.TALKS)
        .map(
          (k) =>
            `<button class="${k === sugg ? 'on' : ''}" data-act="talkPick" data-v="${k}">${TALK_SHORT[k]}</button>`,
        )
        .join('')}</div>
      <div class="small muted" id="talkDesc" style="margin-top:8px;line-height:1.45">${MV.talkDesc(sugg)}</div>
      ${ctx.notes && ctx.notes.length ? `<div class="tiny" style="margin-top:6px;color:var(--warn)">😬 Weighing on the players: ${esc(ctx.notes.join('; '))}.</div>` : ''}
      ${capt ? `<div class="tiny dim" style="margin-top:6px">© ${esc(W.name(capt))} leads the team out${W.hasTrait(capt, 'Leader') ? ' — a Leader keeps heads level if the message misses' : ''}.</div>` : ''}</div>
      <div class="card"><div class="h3">Warm-up</div>
      <div class="seg" style="margin-top:8px">${Object.entries(Md.WARMUPS)
        .map(
          ([k, w]) =>
            `<button class="${k === (MV.warm || 'standard') ? 'on' : ''}" data-act="warmPick" data-v="${k}">${w.label}</button>`,
        )
        .join('')}</div>
      <div class="small muted" id="warmDesc" style="margin-top:8px">${esc(Md.WARMUPS[MV.warm || 'standard'].desc)}.</div></div>`;
  };
  UI.acts.warmPick = (d) => {
    MV.warm = d.v;
    document.querySelectorAll('[data-act=warmPick]').forEach((b) => b.classList.toggle('on', b.dataset.v === d.v));
    const el = document.getElementById('warmDesc');
    if (el) el.textContent = FM.Matchday.WARMUPS[d.v].desc + '.';
  };
  MV.talkDesc = (k) => `${esc(FM.Matchday.TALKS[k].desc)}.${k === MV.talkSugg ? " <b>💡 Assistant's pick.</b>" : ''}`;
  UI.acts.talkPick = (d) => {
    MV.talk = d.v;
    document.querySelectorAll('[data-act=talkPick]').forEach((b) => b.classList.toggle('on', b.dataset.v === d.v));
    const el = document.getElementById('talkDesc');
    if (el) el.innerHTML = MV.talkDesc(d.v);
  };
  UI.acts.goTactics = () => {
    UI.closeAllSheets();
    UI.sub.squad = 'tactics';
    UI.go('squad');
  };
  UI.acts.kickoff = () => {
    UI.closeAllSheets();
    const fx = FM.Season.userFixture();
    FM.Season.startUserMatch(fx);
    UI.save();
    MV.start(fx, false);
  };
  UI.acts.instant = () => {
    UI.closeAllSheets();
    MV.start(FM.Season.userFixture(), true);
  };

  // Conditions before kick-off: the forecast, the crowd (how much home advantage there is) and both sides' form
  MV.conditions = function (fx, me, opp, nt) {
    const wx = FM.Match.forecast(fx),
      note = FM.Match.WEATHER_NOTE[wx[0]];
    const h = FM.clubOf(fx.h),
      a = FM.clubOf(fx.a);
    const hf = fx.neutral ? 0 : FM.Match.homeFactor(h, a, h.rival === a.id || FM.Records.heated(h.id, a.id));
    const crowd = !hf
      ? 'Neutral venue'
      : hf >= 1.25
        ? `${esc(h.name)}'s crowd will be rocking — a big home advantage`
        : hf <= 0.8
          ? `A subdued crowd at ${esc(h.name)} — little home advantage`
          : `Normal home advantage for ${esc(h.name)}`;
    const form = (c) => (c.sim === 'nation' ? '—' : `${FM.Season.confLabel(c)}`);
    return `<div class="card"><div class="h3">Conditions</div>
      <div class="row small" style="margin-top:8px"><span class="grow dim">Weather</span><b>${wx[1]} ${wx[0]}</b></div>${note ? `<div class="tiny dim" style="text-align:right">${note}</div>` : ''}
      <div class="row small" style="margin-top:6px"><span class="grow dim">Crowd</span><b style="text-align:right;max-width:70%">${crowd}</b></div>
      ${nt ? '' : `<div class="row small" style="margin-top:6px"><span class="grow dim">Confidence</span><b>${esc(me.short)} ${form(me)} · ${esc(opp.short)} ${form(opp)}</b></div>`}</div>`;
  };
  // ---------------- Live ----------------
  MV.start = function (fx, instant) {
    // a new match: nothing of the last one's post-match screen is left, and its result is not this one's
    document.getElementById('postOv')?.remove();
    MV.applied = false;
    const m = new FM.Match({
      h: fx.h,
      a: fx.a,
      comp: fx.comp,
      knockout: !!fx.ko,
      neutral: !!fx.neutral,
      live: !instant,
      track: true,
      ...FM.Match.tieOpts(fx),
    });
    MV.m = m;
    MV.fx = fx;
    MV.us = m.sides[0].user ? 0 : 1;
    // Deliver the team talk chosen in the preview (once)
    const talkMsg = MV.talk && MV.talkCtx ? FM.Matchday.applyTalk(m, MV.talk, MV.talkCtx) : null;
    if (MV.warm) FM.Matchday.applyWarmup(m, MV.warm);
    const insMsg = MV.ins && MV.ins.length ? FM.Matchday.applyInstructions(m, MV.ins) : null;
    MV.ins = null;
    MV.warm = null;
    MV.talk = null;
    if (talkMsg) MV.promptLog = (MV.promptLog || []).concat([`Pre-match team talk → ${talkMsg}`]);
    if (insMsg) MV.promptLog = (MV.promptLog || []).concat([insMsg]);
    const capt = P(m.sides[MV.us].capt);
    if (instant) {
      while (!m.finished) m.step();
      return MV.post();
    }
    const [H, A] = m.sides;
    // Text only: the same simulation, with commentary in place of the pitch (lighter on the battery and the processor)
    const text = FM.S.settings.matchView === 'text';
    MV.text = text;
    const ov = document.createElement('div');
    ov.className = 'match' + (text ? ' text' : '');
    ov.id = 'matchOv';
    ov.innerHTML = `<div class="m-top"><div class="m-team">${C.crest(H.club, 30)}<span class="ellip" title="${esc(H.club.name)}">${esc(C.shortName(H.club))}</span></div><div class="m-score" id="mScore">0–0</div><div class="m-team away">${C.crest(A.club, 30)}<span class="ellip" title="${esc(A.club.name)}">${esc(C.shortName(A.club))}</span></div></div>
      <div class="m-clock" id="mClock">KICK-OFF · ${m.weather[1]} ${m.weather[0]}${m.derby ? ' · ⚔️ DERBY' : ''}</div>${m.agg ? `<div class="m-clock" id="mAgg" style="margin-top:-6px;opacity:.8">Aggregate ${m.agg[0]}–${m.agg[1]}</div>` : ''}
      <div class="m-xg"><span id="mXgH">xG 0.00</span><span id="mPoss">Possession 50% – 50%</span><span id="mXgA">xG 0.00</span></div>
      ${text ? '<div class="m-pitchwrap m-textwrap" id="mWrap"><div class="m-goalflash" id="mFlash"></div></div>' : '<div class="m-pitchwrap" id="mWrap"><canvas id="mCanvas"></canvas><div class="m-goalflash" id="mFlash"></div></div>'}
      <div class="m-mom"><svg id="mMom" viewBox="0 0 120 36" preserveAspectRatio="none"></svg></div>
      <div class="m-ticker${text ? ' m-feed' : ''}" id="mTicker"><div>The teams are out${capt ? `, ${esc(W.short(capt))} wearing the armband` : ''}. ${esc(H.club.name)} vs ${esc(A.club.name)}.</div>${talkMsg ? `<div>🗣️ ${esc(talkMsg)}</div>` : ''}</div>
      <div class="m-ctrl"><button id="mPause" data-act="mPause">⏸</button><button id="mSpeed" data-act="mSpeed">${FM.S.settings.speed || 1}×</button><button data-act="mTactics">Tactics</button><button data-act="mShout">📣 Shout</button><button data-act="mSubs">Subs</button><button data-act="mSim">⏭ End</button></div>`;
    document.getElementById('app').appendChild(ov);
    MV.st = {
      paused: false,
      speed: FM.S.settings.speed || 1,
      prompt: null,
      actions: [],
      act: null,
      minuteT: 0,
      minuteMs: 0,
      pendingEv: [],
      done: false,
      dots: [[], []],
      ball: { x: 0.5, y: 0.5, side: 0, slot: m.kickoffSlot(H), h: 0 },
      bannerT: 0,
      trail: [],
      text,
    };
    if (!text) {
      MV.initDots();
      MV.resize();
    }
    MV.stopLoop();
    MV._last = performance.now();
    MV.nextFrame();
    window.addEventListener('resize', MV.resize);
  };

  MV.initDots = function () {
    const m = MV.m;
    m.sides.forEach((sd, k) => {
      MV.st.dots[k] = sd.slots.map((s, i) => {
        const g = MV.toGlobal(k, s.x * 0.9, s.y);
        return { x: g.x, y: g.y };
      });
    });
  };
  MV.toGlobal = (k, x, y) => (k === 0 ? { x, y } : { x: 1 - x, y: 1 - y });
  MV.toFrame = (k, X, Y) => (k === 0 ? { x: X, y: Y } : { x: 1 - X, y: 1 - Y });

  MV.resize = function () {
    const wrap = document.getElementById('mWrap'),
      cv = document.getElementById('mCanvas');
    if (!wrap || !cv) return;
    const aw = wrap.clientWidth - 20,
      ah = wrap.clientHeight - 8;
    let w = aw,
      h = (aw * 105) / 68;
    if (h > ah) {
      h = ah;
      w = (ah * 68) / 105;
    }
    const dpr = window.devicePixelRatio || 1;
    cv.style.width = w + 'px';
    cv.style.height = h + 'px';
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    MV.cw = w;
    MV.ch = h;
    MV.dpr = dpr;
  };
  // global (X along length toward away goal, Y width) → canvas px; user always attacks upward
  MV.px = function (X, Y) {
    const m = 10,
      w = MV.cw - 2 * m,
      h = MV.ch - 2 * m;
    return MV.us === 0 ? [m + Y * w, m + (1 - X) * h] : [m + (1 - Y) * w, m + X * h];
  };

  MV.frame = function (now) {
    const st = MV.st;
    if (!st || !document.getElementById('matchOv')) return;
    // (text only: the clock is checked a few times a second rather than every frame, so a long match costs little)
    const dt = st.text ? U.clamp((now - MV._last) / 1000, 0, 1) : U.clamp((now - MV._last) / 1000, 0, 0.05);
    MV._last = now;
    if (!st.paused && !st.prompt && !st.done) MV.tick(dt * 1000);
    if (!st.text) {
      MV.moveDots(dt);
      MV.draw();
    }
    MV.nextFrame();
  };
  MV.nextFrame = () => {
    MV._raf =
      MV.st && MV.st.text ? setTimeout(() => MV.frame(performance.now()), 250) : requestAnimationFrame(MV.frame);
  };
  MV.stopLoop = () => {
    cancelAnimationFrame(MV._raf);
    clearTimeout(MV._raf);
  };

  MV.tick = function (ms) {
    const st = MV.st;
    if (st.hold > 0) {
      st.hold -= ms;
      return;
    }
    st.minuteT += ms;
    // progress current action
    if (st.act) {
      st.act.t += ms;
      const f = Math.min(1, st.act.t / st.act.dur);
      const e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
      st.ball.x = U.lerp(st.act.x0, st.act.x1, e);
      st.ball.y = U.lerp(st.act.y0, st.act.y1, e);
      st.ball.h = st.act.arc ? Math.sin(f * Math.PI) * st.act.arc : 0;
      if (f >= 1) MV.endAction();
    } else if (st.actions.length) MV.beginAction(st.actions.shift());
    if (!st.act && !st.actions.length && st.minuteT >= st.minuteMs) MV.nextMinute();
  };

  MV.beginAction = function (a) {
    const st = MV.st,
      b = st.ball;
    const dur = Math.max(160, (st.minuteMs * 0.85) / Math.max(1, st.nActions));
    const dotPos = (side, slot) => st.dots[side][slot];
    let x1,
      y1,
      arc = 0,
      d = dur;
    if (a.k === 'pass' || a.k === 'cross' || a.k === 'win' || a.k === 'kickoff') {
      const t = dotPos(a.side, a.to);
      if (a.k === 'kickoff') {
        b.x = 0.5;
        b.y = 0.5;
      }
      x1 = t.x;
      y1 = t.y;
      if (a.k === 'cross') {
        arc = 0.035;
        d = dur * 1.4;
      }
      if (a.fast) d *= 0.8;
    } else if (a.k === 'shot') {
      const outcome = a.outcome;
      const gy = 0.5 + MV.vrange(-0.035, 0.035);
      let gx = 1.005,
        fy = gy;
      if (outcome === 'saved' && a.gk != null) {
        const g = MV.toFrame(a.side, dotPos(1 - a.side, a.gk).x, dotPos(1 - a.side, a.gk).y);
        gx = g.x + 0.01;
        fy = g.y;
      }
      if (outcome === 'wide') {
        gx = 1.03;
        fy = 0.5 + (MV.vr() < 0.5 ? -1 : 1) * MV.vrange(0.06, 0.14);
      }
      if (outcome === 'blocked') {
        const f = MV.toFrame(a.side, b.x, b.y);
        gx = f.x + 0.05;
        fy = f.y + MV.vrange(-0.05, 0.05);
      }
      const g = MV.toGlobal(a.side, gx, fy);
      x1 = g.x;
      y1 = g.y;
      d = Math.max(420, dur * 1.1);
      arc = a.type === 'longshot' ? 0.02 : 0;
      if (a.big) {
        MV.banner(`⚡ ${MV.m.clock}`, MV.pendingChanceText || 'Big chance…', false);
      }
    }
    st.act = { a, t: 0, dur: d, x0: b.x, y0: b.y, x1, y1, arc };
    if (a.k !== 'shot') {
      b.side = a.side;
      b.slot = a.to;
    }
  };
  MV.endAction = function () {
    const st = MV.st,
      a = st.act.a;
    st.act = null;
    if (a.k === 'shot') {
      const ev = st.pendingEv.shift();
      if (ev) MV.showEvent(ev);
      if (a.outcome === 'goal') st.hold = 1500;
      else if (a.big) st.hold = 700;
    }
  };

  MV.nextMinute = function () {
    const st = MV.st,
      m = MV.m;
    // resolve anything still pending from last minute
    st.pendingEv.forEach(MV.showEvent);
    st.pendingEv = [];
    MV.updateHUD();
    if (st.checkPrompt) {
      st.checkPrompt = false;
      const p = FM.Prompts.check(m);
      if (p) return MV.showPrompt(p);
    }
    const out = m.step();
    if (!out) return;
    if (out.ev === 'HT') {
      MV.ticker('⏸ Half-time');
      MV.banner('HALF-TIME', `${m.sides[0].goals}–${m.sides[1].goals}. Time for the team talk.`);
      return MV.showPrompt(FM.Prompts.halftime(m));
    }
    if (out.ev === 'ET') {
      const aggLine = m.agg
        ? `Level on aggregate at ${m.agg[0] + m.sides[0].goals}–${m.agg[1] + m.sides[1].goals}${m.awayGoals ? ', away goals level too' : ''}. `
        : '';
      MV.ticker(m.agg ? '⏱ Level on aggregate — extra time!' : '⏱ Extra time!');
      MV.banner('EXTRA TIME', `${aggLine}Thirty more minutes.`);
      st.hold = 1200;
      return;
    }
    if (out.ev === 'ETHT') {
      st.hold = 800;
      return;
    }
    if (out.ev === 'FT') {
      st.done = true;
      out.events.filter((e) => e.k === 'pens').forEach(MV.showEvent);
      MV.updateHUD();
      MV.banner(
        'FULL-TIME',
        `${m.sides[0].club.short} ${m.sides[0].goals}–${m.sides[1].goals} ${m.sides[1].club.short}${m.pens ? ` (${m.pens[0]}–${m.pens[1]} pens)` : ''}`,
      );
      document.getElementById('mClock').textContent = 'FULL-TIME';
      setTimeout(() => MV.post(), 1800);
      return;
    }
    const big = out.events.some((e) => (e.k === 'chance' || e.k === 'goal') && e.big);
    st.minuteMs = ((st.text ? 600 : 1150) / st.speed) * (big ? 2.4 : 1);
    st.minuteT = 0;
    if (st.text) st.actions = [];
    else MV.planActions(out.script);
    const chanceEvs = out.events.filter((e) => e.k === 'chance' || e.k === 'goal');
    st.pendingEv = chanceEvs;
    MV.pendingChanceText = chanceEvs.length
      ? `${chanceEvs[0].side === MV.us ? 'Chance for us' : 'Danger'} — ${W.short(P(chanceEvs[0].pid))} is in!`
      : null;
    out.events.filter((e) => !(e.k === 'chance' || e.k === 'goal')).forEach(MV.showEvent);
    if (!st.actions.length) (st.pendingEv.forEach(MV.showEvent), (st.pendingEv = []));
    st.checkPrompt = true;
    document.getElementById('mClock').textContent = m.clock;
  };

  MV.showEvent = function (e) {
    if (e.k === 'goal') {
      const mine = e.side === MV.us;
      MV.banner(`GOAL · ${e.min}`, e.text, true, e.side);
      const f = document.getElementById('mFlash');
      f.innerHTML = `<span style="${mine ? '' : 'text-shadow:0 0 40px rgba(255,80,80,.9),0 6px 0 rgba(0,0,0,.4)'}">GOAL!</span>`;
      setTimeout(() => (f.innerHTML = ''), 1700);
      const sc = document.getElementById('mScore');
      sc.classList.remove('pop');
      void sc.offsetWidth;
      sc.classList.add('pop');
      if (mine) FM.Native.haptic('goal');
      MV.ticker(`⚽ ${e.min} ${e.text}`, e.side);
    } else if (e.k === 'chance') {
      if (e.big) MV.banner(`${e.outcome === 'saved' ? 'SAVE' : 'CHANCE'} · ${e.min}`, e.text, false, e.side);
      MV.ticker(`${e.outcome === 'saved' ? '🧤' : '💨'} ${e.min} ${e.text}`, e.side);
    } else if (e.text) {
      if (e.big) MV.banner(`${e.min || ''}`, e.text, false, e.side);
      MV.ticker(`${e.min ? e.min + ' ' : ''}${e.text}`, e.side);
    }
    MV.updateHUD();
  };

  MV.banner = function (k, text, goal, side) {
    const wrap = document.getElementById('mWrap');
    if (!wrap) return;
    wrap.querySelectorAll('.m-banner').forEach((b) => b.remove());
    const b = document.createElement('div');
    b.className = 'm-banner' + (goal ? ' goal' : '');
    b.innerHTML = `<div class="k">${MV.teamTag(MV.m, side)}${esc(k)}</div>${esc(text)}`;
    wrap.appendChild(b);
    clearTimeout(MV._bt);
    MV._bt = setTimeout(() => b.remove(), goal ? 3200 : 2600);
  };
  MV.ticker = function (t, side) {
    const el = document.getElementById('mTicker');
    if (!el) return;
    el.insertAdjacentHTML('afterbegin', `<div>${MV.teamTag(MV.m, side)}${esc(t)}</div>`);
    while (el.children.length > (MV.text ? 80 : 2)) el.lastChild.remove();
  };
  MV.updateHUD = function () {
    const m = MV.m,
      [H, A] = m.sides;
    const g = (id) => document.getElementById(id);
    if (!g('mScore')) return;
    g('mScore').textContent = `${H.goals}–${A.goals}`;
    if (m.agg && g('mAgg'))
      g('mAgg').textContent =
        `Aggregate ${m.agg[0] + H.goals}–${m.agg[1] + A.goals}${m.awayGoals ? ' · away goals' : ''}`;
    g('mXgH').textContent = `xG ${H.xg.toFixed(2)}`;
    g('mXgA').textContent = `xG ${A.xg.toFixed(2)}`;
    const tot = (H.possAcc || 1) + (A.possAcc || 1);
    g('mPoss').textContent =
      `Possession ${Math.round((100 * (H.possAcc || 1)) / tot)}% – ${Math.round((100 * (A.possAcc || 1)) / tot)}%`;
    g('mMom').innerHTML = MV.momSVG(m, 120, 36);
  };
  MV.momSVG = function (m, w, h) {
    const n = Math.max(95, m.momentum.length);
    const bw = w / n,
      mid = h / 2;
    const [H, A] = m.sides;
    const cu = MV.us === 0 ? H.club.colors[0] : A.club.colors[0],
      co = MV.us === 0 ? A.club.colors[0] : H.club.colors[0];
    let s = `<line x1="0" y1="${mid}" x2="${w}" y2="${mid}" stroke="rgba(255,255,255,.2)" stroke-width=".4"/>`;
    m.momentum.forEach((v, i) => {
      const vv = MV.us === 0 ? v : -v;
      const bh = Math.abs(vv) * (mid - 1);
      s += `<rect x="${i * bw}" y="${vv > 0 ? mid - bh : mid}" width="${Math.max(0.3, bw - 0.25)}" height="${bh}" fill="${vv > 0 ? cu : co}" opacity=".9"/>`;
    });
    m.events
      .filter((e) => e.k === 'goal')
      .forEach((e) => {
        const up = e.side === MV.us;
        s += `<rect x="${Math.min(w - 1, (e.mi || 0) * bw)}" y="${up ? 0 : h - 5}" width="${Math.max(0.8, bw)}" height="5" fill="#fff"/>`;
      });
    return s;
  };

  MV.moveDots = function (dt) {
    const st = MV.st,
      m = MV.m,
      b = st.ball;
    if (!st) return;
    const owner = b.side;
    m.sides.forEach((sd, k) => {
      const bf = MV.toFrame(k, b.x, b.y);
      const targets = sd.slots.map((s, i) => {
        const p = FM.Pos(sd, i, owner === k, bf);
        return MV.toGlobal(k, p.x, p.y);
      });
      if (owner !== k) {
        // visible pressing: nearest players close the ball down
        const n = sd.tactic.press === 'High Press' ? 2 : 1,
          pull = { 'High Press': 0.7, 'Mid Block': 0.5, 'Low Block': 0.3 }[sd.tactic.press];
        const near = targets
          .map((t, i) => ({ i, d: (t.x - b.x) ** 2 + (t.y - b.y) ** 2 }))
          .filter((o) => sd.slots[o.i].t !== 'GK')
          .sort((a, c) => a.d - c.d)
          .slice(0, n);
        near.forEach(({ i }) => {
          targets[i].x = U.lerp(targets[i].x, b.x, pull);
          targets[i].y = U.lerp(targets[i].y, b.y, pull);
        });
      } else if (st.act && st.act.a.k !== 'shot' && st.act.a.side === k) {
        // receiver moves to meet the ball
        const t = targets[st.act.a.to];
        t.x = U.lerp(t.x, st.act.x1, 0.5);
        t.y = U.lerp(t.y, st.act.y1, 0.5);
      }
      targets.forEach((t, i) => {
        const d = st.dots[k][i];
        const sp = Math.min(1, dt * 2.6 * Math.max(1, st.speed * 0.7));
        d.x += (t.x - d.x) * sp;
        d.y += (t.y - d.y) * sp;
      });
    });
    if (!st.act) {
      const d = st.dots[b.side] && st.dots[b.side][b.slot];
      if (d) {
        const f = b.side === 0 ? 0.012 : -0.012;
        b.x = U.lerp(b.x, d.x + f, Math.min(1, dt * 10));
        b.y = U.lerp(b.y, d.y, Math.min(1, dt * 10));
      }
    }
    st.trail.push([b.x, b.y]);
    if (st.trail.length > 8) st.trail.shift();
  };

  MV.draw = function () {
    const cv = document.getElementById('mCanvas');
    if (!cv) return;
    const x = cv.getContext('2d'),
      dpr = MV.dpr,
      w = MV.cw,
      h = MV.ch,
      st = MV.st,
      m = MV.m;
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    // grass
    const stripes = 12;
    for (let i = 0; i < stripes; i++) {
      x.fillStyle = i % 2 ? '#23864a' : '#1f7a3f';
      x.fillRect(0, (i * h) / stripes, w, h / stripes + 1);
    }
    const px = MV.px;
    x.strokeStyle = 'rgba(255,255,255,.6)';
    x.lineWidth = 1.5;
    const rect = (x0, y0, x1, y1) => {
      const a = px(x0, y0),
        b = px(x1, y1);
      x.strokeRect(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]));
    };
    rect(0, 0, 1, 1);
    const hl = [px(0.5, 0), px(0.5, 1)];
    x.beginPath();
    x.moveTo(...hl[0]);
    x.lineTo(...hl[1]);
    x.stroke();
    const c = px(0.5, 0.5);
    x.beginPath();
    x.arc(c[0], c[1], w * 0.13, 0, Math.PI * 2);
    x.stroke();
    x.beginPath();
    x.arc(c[0], c[1], 2, 0, Math.PI * 2);
    x.fillStyle = 'rgba(255,255,255,.7)';
    x.fill();
    rect(0, 0.2, 0.157, 0.8);
    rect(0.843, 0.2, 1, 0.8);
    rect(0, 0.37, 0.052, 0.63);
    rect(0.948, 0.37, 1, 0.63);
    x.fillStyle = 'rgba(255,255,255,.85)';
    [
      [0, 0.44, -0.012, 0.56],
      [1, 0.44, 1.012, 0.56],
    ].forEach(([a, b, c2, d2]) => {
      const p1 = px(a, b),
        p2 = px(c2, d2);
      x.fillRect(
        Math.min(p1[0], p2[0]),
        Math.min(p1[1], p2[1]),
        Math.abs(p2[0] - p1[0]) || 2,
        Math.abs(p2[1] - p1[1]) || 2,
      );
    });

    // pressing shapes: connect each team's back line & midfield line
    m.sides.forEach((sd, k) => {
      const col = MV.kit(m, k);
      const lines = [['GK'], ['CB', 'FB', 'WB'], ['DM', 'CM', 'WM']];
      [lines[1], lines[2]].forEach((types) => {
        const pts = sd.slots
          .map((s, i) => ({ s, i }))
          .filter(({ s, i }) => types.includes(s.t) && sd.xi[i] && !sd.sentOff[sd.xi[i].id])
          .map(({ i }) => px(st.dots[k][i].x, st.dots[k][i].y))
          .sort((a, b) => a[0] - b[0]);
        if (pts.length < 2) return;
        x.strokeStyle = col;
        x.globalAlpha = 0.28;
        x.lineWidth = 2;
        x.beginPath();
        x.moveTo(...pts[0]);
        pts.slice(1).forEach((p) => x.lineTo(...p));
        x.stroke();
        x.globalAlpha = 1;
      });
    });
    // players
    const r = Math.max(6, w * 0.022);
    m.sides.forEach((sd, k) => {
      const c1 = MV.kit(m, k),
        green = MV.onGrass(c1),
        ring = green || U.ink(c1) === '#fff' || U.ink(c1) === '#ffffff' ? 'rgba(255,255,255,.95)' : 'rgba(0,0,0,.85)';
      sd.xi.forEach((p, i) => {
        if (!p || sd.sentOff[p.id]) return;
        const d = st.dots[k][i],
          [cx, cy] = px(d.x, d.y);
        x.beginPath();
        x.arc(cx, cy + 1.5, r, 0, Math.PI * 2);
        x.fillStyle = 'rgba(0,0,0,.3)';
        x.fill();
        x.beginPath();
        x.arc(cx, cy, r, 0, Math.PI * 2);
        x.fillStyle = sd.slots[i].t === 'GK' ? (k ? '#f59e0b' : '#a3e635') : c1;
        x.fill();
        x.lineWidth = green && sd.slots[i].t !== 'GK' ? 3.5 : 2.5;
        x.strokeStyle = sd.slots[i].t === 'GK' ? 'rgba(0,0,0,.85)' : ring; // contrasting ring so every dot stands off the grass
        x.stroke();
        if (sd.injured[p.id]) {
          x.fillStyle = '#f87171';
          x.fillRect(cx + r * 0.4, cy - r * 1.2, 4, 4);
        }
        x.fillStyle = U.ink(sd.slots[i].t === 'GK' ? '#a3e635' : c1);
        x.font = `800 ${Math.round(r * 0.95)}px Inter, sans-serif`;
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        x.fillText(String(i + 1), cx, cy + 0.5);
        // Armband: a small gold "C" badge on whoever wears it (it moves if he goes off)
        if (p.id === sd.capt) {
          const bs = Math.max(9, r * 0.9),
            bx = cx - r * 0.95 - bs / 2,
            by = cy - r * 0.95 - bs / 2;
          x.fillStyle = '#f5c542';
          x.fillRect(bx, by, bs, bs);
          x.fillStyle = '#1a1300';
          x.font = `900 ${Math.round(bs * 0.8)}px Inter, sans-serif`;
          x.fillText('C', bx + bs / 2, by + bs / 2 + 0.5);
        }
      });
    });
    // ball carrier label
    const b = st.ball;
    const carrier =
      (!st.act || st.act.kind === 'carry') && !b.inFlight && m.sides[b.side] && m.sides[b.side].xi[b.slot];
    if (carrier) {
      const d = st.dots[b.side][b.slot],
        [cx, cy] = px(d.x, d.y);
      x.font = '700 11px Inter, sans-serif';
      x.textAlign = 'center';
      const t = carrier.ln;
      const tw = x.measureText(t).width + 10;
      x.fillStyle = 'rgba(0,0,0,.6)';
      x.fillRect(cx - tw / 2, cy - r - 20, tw, 15);
      x.fillStyle = '#fff';
      x.fillText(t, cx, cy - r - 12);
    }
    // ball trail + ball
    st.trail.forEach(([tx, ty], i) => {
      const [a, bb] = px(tx, ty);
      x.beginPath();
      x.arc(a, bb, 2 + i * 0.3, 0, Math.PI * 2);
      x.fillStyle = `rgba(255,255,255,${0.04 * i})`;
      x.fill();
    });
    const [bx, by] = px(b.x, b.y);
    const lift = U.clamp(b.h || 0, 0, 0.12) * h;
    // shadow stays on the grass and spreads as the ball rises
    x.beginPath();
    x.ellipse(bx + lift * 0.25, by + 2 + lift * 0.15, 4 + lift * 0.08, 3 + lift * 0.05, 0, 0, Math.PI * 2);
    x.fillStyle = `rgba(0,0,0,${Math.max(0.12, 0.35 - lift * 0.006)})`;
    x.fill();
    x.beginPath();
    x.arc(bx, by - lift, 4.5 + lift * 0.05, 0, Math.PI * 2);
    x.fillStyle = '#fff';
    x.fill();
    x.lineWidth = 1;
    x.strokeStyle = '#111';
    x.stroke();
  };

  // ---------------- Prompts & controls ----------------
  MV.showPrompt = function (p) {
    const st = MV.st;
    st.prompt = p;
    const wrap = document.getElementById('matchOv');
    wrap.querySelectorAll('.prompt').forEach((e) => e.remove());
    const el = document.createElement('div');
    el.className = 'prompt';
    el.innerHTML = `<div class="row"><span class="pi">${p.icon}</span><div class="grow"><div class="tiny" style="color:#8ea0b7;font-weight:800;letter-spacing:1px">TACTICAL MOMENT · ${esc(MV.m.clock)}</div><div class="pt">${esc(p.title)}</div></div></div><div class="pb">${esc(p.body)}</div>${p.quote ? `<div class="q"><b>${esc(p.quote.who)} · ${esc(p.quote.role)}</b>“${esc(p.quote.text)}”</div>` : ''}${p.options.map((o, i) => `<button class="opt" data-act="mOpt" data-i="${i}"><b>${esc(o.label)}</b>${o.desc ? `<span>${esc(o.desc)}</span>` : ''}</button>`).join('')}`;
    wrap.appendChild(el);
  };
  UI.acts.mOpt = (d) => {
    const st = MV.st,
      p = st.prompt,
      o = p.options[+d.i];
    const msg = o.apply(MV.m);
    document.querySelectorAll('#matchOv .prompt').forEach((e) => e.remove());
    st.prompt = null;
    if (msg) MV.ticker('📋 ' + msg);
    if (o.sub !== undefined) MV.subsSheet(o.sub >= 0 ? o.sub : null);
    MV.promptLog = (MV.promptLog || []).concat([`${MV.m.clock} ${p.title} → ${o.label}`]);
  };
  UI.acts.mPause = () => {
    const st = MV.st;
    st.paused = !st.paused;
    document.getElementById('mPause').textContent = st.paused ? '▶' : '⏸';
  };
  UI.acts.mSpeed = () => {
    const st = MV.st;
    st.speed = st.speed === 1 ? 2 : st.speed === 2 ? 4 : 1;
    document.getElementById('mSpeed').textContent = st.speed + '×';
  };
  UI.acts.mSim = () => {
    const st = MV.st,
      m = MV.m;
    st.done = true;
    while (!m.finished) m.step();
    MV.post();
  };
  UI.acts.mTactics = () => {
    const st = MV.st;
    st.paused = true;
    MV.tacticsSheet();
  };
  // Shouts: a call from the touchline (engine: Match.shout); one at a time, with a few minutes between
  UI.acts.mShout = () => {
    MV.st.paused = true;
    MV.shoutSheet();
  };
  MV.shoutSheet = function () {
    const m = MV.m,
      sd = m.sides[MV.us],
      min = m.minute,
      wait = sd.shoutNext != null && min < sd.shoutNext ? sd.shoutNext - min : 0,
      on = sd.shoutExp;
    const html = `<div class="small muted" style="margin-bottom:10px;line-height:1.5">A call from the touchline lasts a few minutes. How well it lands depends on the captain and the mood of the players, and a manager who shouts all game is tuned out.${on ? ` <b>Now: ${esc(FM.Match.SHOUTS[on.kind].label)} (${Math.max(0, on.until - min)} min left).</b>` : ''}</div>
      <div class="list">${Object.entries(FM.Match.SHOUTS)
        .map(
          ([k, x]) =>
            `<div class="prow tap ${wait ? 'dim' : ''}" data-act="mShoutDo" data-k="${k}"><span style="font-size:22px;width:32px">${x.icon}</span><div class="grow"><div class="b">${esc(x.label)}</div><div class="small dim">${esc(x.tip)} · ${x.dur} min</div></div></div>`,
        )
        .join('')}</div>
      ${wait ? `<div class="tiny dim" style="margin-top:8px">The last call needs ${wait} more minute${wait === 1 ? '' : 's'} to sink in.</div>` : ''}
      <button class="btn pri block" style="margin-top:14px" data-act="mResume">Resume</button>`;
    if (document.querySelector('.sheet-wrap')) UI.refreshSheet(html);
    else UI.sheet(html, { title: '📣 Shouts', onClose: () => (MV.st.paused = false) });
  };
  UI.acts.mShoutDo = (d) => {
    const r = MV.m.shout(MV.m.sides[MV.us], d.k);
    if (!r.ok) {
      UI.toast(r.msg, 2500);
      return MV.shoutSheet();
    }
    MV.ticker(`📣 ${r.msg}`);
    UI.acts.mResume();
  };
  MV.tacticsSheet = function () {
    const sd = MV.m.sides[MV.us],
      T = sd.tactic;
    const seg = (k, vals) =>
      `<div class="seg" style="margin:6px 0 14px">${vals.map((v) => `<button class="${T[k] === v ? 'on' : ''}" data-act="mTac" data-k="${k}" data-v="${v}">${v.replace(' Press', '').replace(' Block', '')}</button>`).join('')}</div>`;
    const B = FM.S.user.tactic2,
      planB =
        B && !sd.switched && sd.club.sim !== 'nation'
          ? `<button class="btn block" style="margin-bottom:14px" data-act="mPlanB">🔁 Switch to Plan B · ${B.formation} · ${B.buildup} · ${B.press} (familiarity ${Math.round(B.fam ?? 40)}%)</button>`
          : sd.switched
            ? '<div class="tiny dim" style="margin-bottom:10px">Playing Plan B.</div>'
            : '';
    const html = `${planB}<div class="h3">Build-up</div>${seg('buildup', D.BUILDUP)}<div class="h3">Pressing</div>${seg('press', D.PRESS)}<div class="h3">Width</div>${seg('width', D.WIDTH)}
      <div class="row"><div class="grow h3">Inverted full-backs</div><button class="btn sm ${T.invFB ? 'pri' : ''}" data-act="mInv">${T.invFB ? 'On' : 'Off'}</button></div>
      <div class="small muted" style="margin-top:12px">Energy: ${MV.m
        .onPitch(sd)
        .map(({ p }) => `${esc(p.ln)} ${Math.round(sd.st[p.id])}%`)
        .join(' · ')}</div>
      <button class="btn pri block" style="margin-top:14px" data-act="mResume">Resume</button>`;
    if (document.querySelector('.sheet-wrap')) UI.refreshSheet(html);
    else UI.sheet(html, { title: 'In-game tactics', onClose: () => (MV.st.paused = false) });
  };
  UI.acts.mTac = (d) => {
    MV.m.sides[MV.us].tactic[d.k] = d.v;
    MV.ticker(`📋 Switched to ${d.v}`);
    MV.tacticsSheet();
  };
  UI.acts.mPlanB = () => {
    const sd = MV.m.sides[MV.us],
      B = FM.S.user.tactic2;
    if (!B) return;
    if (MV.m.changeAt == null) MV.m.changeAt = MV.m.momentum.length;
    MV.m.switchTactic(sd, B);
    MV.ticker(`📋 Plan B: ${B.formation}, ${B.buildup}, ${B.press}`);
    MV.tacticsSheet();
  };
  UI.acts.mInv = () => {
    const T = MV.m.sides[MV.us].tactic;
    T.invFB = !T.invFB;
    MV.tacticsSheet();
  };
  UI.acts.mResume = () => {
    UI.closeSheet();
    MV.st.paused = false;
    document.getElementById('mPause').textContent = '⏸';
  };
  UI.acts.mSubs = () => {
    MV.subsSheet(null);
  };

  MV.subsSheet = function (outSlot) {
    const st = MV.st,
      m = MV.m,
      sd = m.sides[MV.us];
    st.paused = true;
    MV._subOut = outSlot;
    const render = () => {
      const on = m.onPitch(sd);
      const bench = sd.bench.filter((p) => !Object.hasOwn(sd.on, p.id));
      return `<div class="small muted">Subs left: <b>${sd.subsLeft}</b> of ${FM.S.rules.subs}</div>
        <div class="h3" style="margin-top:10px">1 · Take off</div><div class="list">${on.map(({ p, i }) => `<div class="prow tap" data-act="mSubOut" data-i="${i}" style="${MV._subOut === i ? 'background:color-mix(in srgb,var(--acc) 14%,transparent);border-radius:10px' : ''}">${C.pos(p)}<div class="grow"><div class="b">${esc(W.short(p))} ${sd.injured[p.id] ? '🚑' : ''}${sd.yc[p.id] ? '🟨' : ''}</div><div class="small dim">${sd.slots[i].t} · rating ${sd.rating[p.id].toFixed(1)}</div></div>${C.fit(Math.round(sd.st[p.id]))}<span class="small b" style="width:36px;text-align:right">${Math.round(sd.st[p.id])}%</span></div>`).join('')}</div>
        <div class="h3" style="margin-top:12px">2 · Bring on</div><div class="list">${bench.map((p) => `<div class="prow tap" data-act="mSubIn" data-id="${p.id}">${C.pos(p)}<div class="grow"><div class="b">${esc(W.short(p))}</div><div class="small dim">${MV._subOut != null ? 'Fit at ' + sd.slots[MV._subOut].t + ': ' + C.starText(W.effAt(p, sd.slots[MV._subOut].t), sd.slots[MV._subOut].t) : 'Select a player to take off first'}</div></div>${C.playerStars(p)}</div>`).join('') || '<div class="dim small">No one left on the bench.</div>'}</div>
        <button class="btn block" style="margin-top:12px" data-act="mResume">Done</button>`;
    };
    MV._subRender = render;
    if (document.querySelector('.sheet-wrap')) UI.refreshSheet(render());
    else UI.sheet(render(), { title: 'Substitutions', onClose: () => (MV.st.paused = false) });
  };
  UI.acts.mSubOut = (d) => {
    MV._subOut = +d.i;
    UI.refreshSheet(MV._subRender());
  };
  UI.acts.mSubIn = (d) => {
    const sd = MV.m.sides[MV.us];
    if (MV._subOut == null) return UI.toast('Pick who comes off first');
    if (!sd.subsLeft) return UI.toast('No substitutions left');
    const i = MV._subOut,
      ev = MV.m.makeSub(sd, i, d.id, null);
    if (ev) {
      MV.ticker(ev.text, ev.side);
      const g = MV.toGlobal(MV.us, sd.slots[i].x, 0.02);
      MV.st.dots[MV.us][i] = { x: g.x, y: g.y };
      if (MV.st.ball.side === MV.us && MV.st.ball.slot === i) MV.st.ball.slot = MV.m.kickoffSlot(sd);
    }
    MV._subOut = null;
    UI.refreshSheet(MV._subRender());
  };

  // ---------------- Post-match ----------------
  // The colour a side wears on the pitch: always its main colour (green clubs too: MV.onGrass gives their dots a
  // white outline instead); only the away side changes, to its second colour, when both teams would look alike
  const GRASS = [31, 122, 63];
  const rgb = (h) => (/^#[0-9a-f]{6}$/i.test(h) ? [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) : null);
  const dist = (a, b) => (a && b ? Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) : 999);
  MV.kit = function (m, k) {
    const home = m.sides[0].club.colors[0];
    if (k === 0) return home;
    const [c1, c2] = m.sides[1].club.colors;
    const clash = (c) => dist(rgb(c), rgb(home)) < 80;
    return clash(c1) && !clash(c2) ? c2 : c1;
  };
  MV.onGrass = (c) => dist(rgb(c), GRASS) < 90; // a kit that blends into the pitch
  // A small pill in the side's kit colour, so every event says at a glance whose it is
  MV.teamTag = function (m, k) {
    if (!m || (k !== 0 && k !== 1)) return '';
    const c = MV.kit(m, k);
    return `<b class="ev-team" style="background:${c};color:${U.ink(c)}">${esc(m.sides[k].club.short)}</b>`;
  };
  MV.post = function () {
    const m = MV.m;
    // The result counts from the final whistle: applied and saved now, not when you leave the post-match screens
    if (!MV.applied) {
      FM.Season.applyUserMatch(m);
      delete FM.S.user.live;
      MV.applied = true;
      UI.save();
    }
    MV.stopLoop();
    window.removeEventListener('resize', MV.resize);
    document.getElementById('matchOv')?.remove();
    UI.closeAllSheets();
    const res = m.result(),
      [H, A] = m.sides,
      us = MV.us,
      me = m.sides[us];
    const ov = document.createElement('div');
    ov.className = 'match';
    ov.id = 'postOv';
    ov.style.background = 'var(--bg)';
    ov.style.color = 'var(--ink)';
    const won = me.goals > m.sides[1 - us].goals || (m.pens && m.pens[us] > m.pens[1 - us]);
    const lost = me.goals < m.sides[1 - us].goals || (m.pens && m.pens[us] < m.pens[1 - us]);
    MV.postTab = 'summary';
    ov.innerHTML = `<div class="hero" style="--c1:${U.heroShade(me.club.colors[0])};--c2:${U.heroShade(won ? '#0b3d20' : lost ? '#3d0b10' : '#1b2533')};border-radius:0;margin:0;padding-top:18px">
        <div class="tag center" style="display:block">${won ? 'VICTORY' : lost ? 'DEFEAT' : 'DRAW'} · FULL-TIME${m.derby ? ' · DERBY' : ''}</div>
        <div class="vs" style="margin:10px 0 6px"><div class="side">${C.crest(H.club, 48)}<span>${esc(H.club.name)}</span></div><div class="mid" style="font-size:46px">${H.goals}–${A.goals}</div><div class="side">${C.crest(A.club, 48)}<span>${esc(A.club.name)}</span></div></div>
        ${m.pens ? `<div class="center small b">Penalties ${m.pens[0]}–${m.pens[1]}</div>` : ''}
        ${m.agg ? `<div class="center small b">Aggregate ${m.agg[0] + H.goals}–${m.agg[1] + A.goals} · ${esc(m.sides[m.tieWinner() ?? 0].club.name)} go through</div>` : ''}
        <div class="row small" style="align-items:flex-start;opacity:.92"><div class="grow">${res.goals
          .filter((g) => g.side === 0)
          .map((g) => `⚽ ${C.pname(P(g.pid))} ${g.min}`)
          .join('<br>')}</div><div class="grow" style="text-align:right">${res.goals
          .filter((g) => g.side === 1)
          .map((g) => `${C.pname(P(g.pid))} ${g.min} ⚽`)
          .join('<br>')}</div></div></div>
      <div style="padding:12px 16px 0"><div class="chips" id="postChips">${[
        ['summary', 'Summary'],
        ['ratings', 'Ratings'],
        ['analysis', 'Analysis'],
      ]
        .map(
          ([k, l]) =>
            `<button class="chip ${k === 'summary' ? 'on' : ''}" data-act="postTab" data-v="${k}">${l}</button>`,
        )
        .join('')}</div></div>
      <div id="postBody" style="flex:1;overflow-y:auto;padding:0 16px 16px"></div>
      <div style="padding:10px 16px calc(14px + env(safe-area-inset-bottom));border-top:1px solid var(--line)"><button class="btn pri block" data-act="postContinue">Continue → reactions</button></div>`;
    document.getElementById('app').appendChild(ov);
    MV.renderPost();
  };
  UI.acts.postTab = (d) => {
    MV.postTab = d.v;
    document.querySelectorAll('#postChips .chip').forEach((c) => c.classList.toggle('on', c.dataset.v === d.v));
    MV.renderPost();
  };
  // The post-match card that reads the result: the headline and the causes behind it (FM.Matchday.why)
  MV.whyCard = function (m) {
    const w = FM.Matchday.why(m, MV.us);
    const col = { good: 'var(--good)', bad: 'var(--bad)', luck: 'var(--warn)', neutral: 'var(--ink2)' };
    return `<div class="card"><div class="h3">Why it went this way</div><div class="small b" style="margin:6px 0 2px;color:${col[w.tone]}">${esc(w.headline)}</div>${w.causes
      .map(
        (c) =>
          `<div class="row small" style="padding:7px 0;border-top:1px solid var(--line);align-items:flex-start;gap:10px"><span style="font-size:18px;width:24px">${c.icon}</span><div class="grow"><div class="b" style="color:${col[c.kind]}">${esc(c.title)}</div><div class="dim" style="line-height:1.4">${esc(c.text)}</div></div></div>`,
      )
      .join('')}${w.causes.length ? '' : '<div class="tiny dim">Nothing stood out: an ordinary match.</div>'}</div>`;
  };
  MV.renderPost = function () {
    const m = MV.m,
      res = m.result(),
      [H, A] = m.sides,
      body = document.getElementById('postBody');
    const t = MV.postTab;
    const sbar = (l, a, b, fmt = (v) => v) => {
      const tot = a + b || 1;
      return `<div class="sbar"><div class="lbl"><b>${fmt(a)}</b><span>${l}</span><b>${fmt(b)}</b></div><div class="tr"><i style="width:${(a / tot) * 100}%;background:${H.club.colors[0]};margin-left:auto"></i><i style="width:${(b / tot) * 100}%;background:${A.club.colors[0] === H.club.colors[0] ? A.club.colors[1] : A.club.colors[0]}"></i></div></div>`;
    };
    if (t === 'summary') {
      const motm = P(m.motm);
      // Goals from dead balls: corners, direct free kicks and penalties
      const spg = [0, 1].map((k) =>
        m.events.filter((e) => e.k === 'goal' && e.side === k && (e.sp || e.type === 'penalty')),
      );
      const spLine = (goals) => {
        const n = { cor: 0, fk: 0, pen: 0 };
        goals.forEach((e) => n[e.type === 'penalty' ? 'pen' : e.sp]++);
        return [
          ['cor', 'corner'],
          ['fk', 'free kick'],
          ['pen', 'penalty'],
        ]
          .filter(([k]) => n[k])
          .map(([k, w]) => `${n[k]} ${w}${n[k] > 1 ? 's' : ''}`)
          .join(', ');
      };
      const spNote =
        spg[0].length + spg[1].length
          ? `<div class="tiny dim" style="margin-top:-2px">${[0, 1]
              .map((k) => (spg[k].length ? `${esc(m.sides[k].club.short)}: ${spLine(spg[k])}` : ''))
              .filter(Boolean)
              .join(' · ')}</div>`
          : '';
      body.innerHTML = `${motm ? `<div class="card row">${C.pos(motm)}<div class="grow"><div class="tiny dim b">PLAYER OF THE MATCH</div><div class="b">${C.pname(motm, W.name(motm))}</div></div>${C.rating(m.sides.find((s) => s.rating[motm.id] != null).rating[motm.id])}</div>` : ''}
        <div class="card">${sbar('Possession', res.poss[0], res.poss[1], (v) => v + '%')}${sbar('Expected goals (xG)', res.xg[0], res.xg[1], (v) => v.toFixed(2))}${sbar('Shots', res.shots[0], res.shots[1])}${sbar('On target', res.sot[0], res.sot[1])}${spg[0].length + spg[1].length ? sbar('Set-piece goals', spg[0].length, spg[1].length) + spNote : ''}${sbar('Passes', m.passStats(0).total, m.passStats(1).total)}${sbar('Pass accuracy', m.passStats(0).acc, m.passStats(1).acc, (v) => v + '%')}${sbar('Yellow cards', Object.keys(H.yc).length, Object.keys(A.yc).length)}</div>
        ${MV.whyCard(m)}
        <div class="card"><div class="h3" style="margin-bottom:6px">Key moments</div>${m.events
          .filter((e) => ['goal', 'red', 'injury', 'sub', 'pens'].includes(e.k) || (e.k === 'chance' && e.big))
          .map(
            (e) =>
              `<div class="row small" style="padding:5px 0;border-top:1px solid var(--line)"><span class="dim" style="width:40px">${e.min || ''}</span><span class="grow">${MV.teamTag(m, e.side)}${e.k === 'goal' ? '⚽ ' : e.k === 'chance' ? (e.outcome === 'saved' ? '🧤 ' : '💨 ') : ''}${esc(e.text)}</span></div>`,
          )
          .join('')}</div>
        ${MV.promptLog && MV.promptLog.length ? `<div class="card"><div class="h3">Your decisions</div>${MV.promptLog.map((l) => `<div class="small muted" style="margin-top:6px">📋 ${esc(l)}</div>`).join('')}</div>` : ''}`;
    } else if (t === 'ratings') {
      const list = (sd) =>
        Object.entries(sd.rating)
          .filter(([pid]) => sd.mins[pid])
          .sort((a, b) => b[1] - a[1])
          .map(
            ([pid, r]) =>
              `<div class="row small" style="padding:6px 0;border-top:1px solid var(--line)"><span class="grow ellip">${C.pname(P(pid))}${pid === m.motm ? ' ⭐' : ''}${res.goals
                .filter((g) => g.pid === pid)
                .map(() => ' ⚽')
                .join('')}${res.goals
                .filter((g) => g.ast === pid)
                .map(() => ' 🅰️')
                .join(
                  '',
                )}</span><span class="dim tiny" style="margin-right:6px">${sd.mins[pid]}'</span>${C.rating(r)}</div>`,
          )
          .join('');
      body.innerHTML = `<div class="row" style="align-items:flex-start;gap:12px"><div class="grow card flat" style="padding:8px 10px"><div class="row b small">${C.crest(H.club, 18)} ${esc(H.club.short)}</div>${list(H)}</div><div class="grow card flat" style="padding:8px 10px"><div class="row b small">${C.crest(A.club, 18)} ${esc(A.club.short)}</div>${list(A)}</div></div>`;
    } else {
      const sd = m.sides[MV.us];
      body.innerHTML = `<div class="card"><div class="h3">Momentum</div><svg viewBox="0 0 120 36" preserveAspectRatio="none" style="width:100%;height:70px;margin-top:8px;background:var(--card2);border-radius:8px">${MV.momSVG(m, 120, 36)}</svg><div class="row tiny dim" style="margin-top:4px"><span>0'</span><span class="grow"></span><span>45'</span><span class="grow"></span><span>90'</span></div></div>
        <div class="card"><div class="h3">Your heat map</div><canvas id="postHeat" class="heat" width="480" height="320" style="margin-top:8px"></canvas><div class="tiny dim" style="margin-top:4px">Where ${esc(sd.club.short)} had the ball · attacking →</div></div>
        <div class="card"><div class="h3">Passing network</div><div class="small dim">Lines show passing combinations. Thicker = more passes.</div>${MV.networkSVG(sd)}</div>`;
      C.heat(document.getElementById('postHeat'), sd.heat);
    }
  };
  MV.networkSVG = function (sd) {
    const w = 320,
      h = 210,
      pad = 18;
    const pos = sd.slots.map((s, i) => {
      const p = FM.Pos(sd, i, true, { x: 0.55, y: 0.5 });
      return [pad + p.x * (w - 2 * pad), pad + p.y * (h - 2 * pad)];
    });
    const max = Math.max(1, ...Object.values(sd.passes));
    let lines = '';
    Object.entries(sd.passes)
      .sort((a, b) => a[1] - b[1])
      .forEach(([k, n]) => {
        const [a, b] = k.split('-').map(Number);
        if (n < max * 0.12) return;
        lines += `<line x1="${pos[a][0]}" y1="${pos[a][1]}" x2="${pos[b][0]}" y2="${pos[b][1]}" stroke="var(--acc)" stroke-opacity="${0.25 + (n / max) * 0.7}" stroke-width="${1 + (n / max) * 6}" stroke-linecap="round"/>`;
      });
    const touches = sd.slots.map((_, i) =>
      U.sum(
        Object.entries(sd.passes).filter(([k]) => k.split('-').map(Number).includes(i)),
        ([, n]) => n,
      ),
    );
    const mt = Math.max(1, ...touches);
    const nodes = sd.slots
      .map((s, i) => {
        const p = sd.xi[i];
        return `<circle cx="${pos[i][0]}" cy="${pos[i][1]}" r="${6 + (touches[i] / mt) * 7}" fill="${sd.club.colors[0]}" stroke="#fff" stroke-width="1.5"/><text x="${pos[i][0]}" y="${pos[i][1] + 20}" text-anchor="middle" font-size="9" font-weight="700" fill="#fff">${p ? esc(p.ln.slice(0, 10)) : ''}</text>`;
      })
      .join('');
    return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;margin-top:8px;background:#1f7a3f;border-radius:10px"><rect x="${pad / 2}" y="${pad / 2}" width="${w - pad}" height="${h - pad}" fill="none" stroke="rgba(255,255,255,.4)"/><line x1="${w / 2}" y1="${pad / 2}" x2="${w / 2}" y2="${h - pad / 2}" stroke="rgba(255,255,255,.4)"/>${lines}${nodes}</svg>`;
  };
  UI.acts.postContinue = async () => {
    const m = MV.m;
    if (UI.simBusy) return;
    document.getElementById('postOv')?.remove();
    MV.promptLog = [];
    // Our result was applied at full time (MV.post); the rest of the world's day runs in the simulation worker
    if (!MV.applied) FM.Season.applyUserMatch(m);
    MV.applied = false;
    MV.m = null;
    const r = await FM.SimRunner.run('day');
    const summary = r && r.summary;
    UI.sub.feed = 'club';
    UI.tab = 'home';
    UI.afterDay(summary);
    document.getElementById('main').scrollTop = 0;
  };
})();
