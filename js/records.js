// The world remembers: club records, all-time head-to-heads, rivalries that grow out of what happens
// on the pitch, player of the month, and injury histories. State lives in S.records (created lazily)
// and in two optional player fields (honours, injHist). No DOM here: the simulation worker loads it.
(function () {
  const FM = window.FM,
    U = FM.U,
    W = FM.W;
  const R = (FM.Records = {});
  const S = () => FM.S;
  const MONTHS = [
    'August',
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
    'April',
    'May',
  ];
  R.MONTHS = MONTHS;

  // ---------- Team of the Week ----------
  // Every league round, the best XI from the match ratings: a 4-3-3 (a keeper, two centre-backs and two full-backs or
  // wing-backs, three midfielders, a striker and two more forwards), each by his natural position, and the manager of the
  // round (the biggest win). Ratings are noted as the matches are played (Records.noteRating, from the engine and the
  // two simulation tiers), picked at the end of the day (Records.totwDay), and kept for the season in S.totw.
  const DEF = new Set(['CB', 'FB', 'WB']),
    MID = new Set(['DM', 'CM', 'WM', 'AM']),
    ATT = new Set(['W', 'ST']);
  R.noteRating = function (fx, p, r) {
    const comp = S().comps[fx.comp];
    if (comp && comp.type !== 'league' && comp.type !== 'friendly') R.noteComp(fx.comp, p, r); // a cup's own stats
    if (!comp || comp.type !== 'league' || fx.ko || fx.leg) return;
    const buf = (S().totwBuf = S().totwBuf || {});
    (buf[fx.comp] = buf[fx.comp] || []).push({
      id: p.id,
      n: W.short(p),
      pos: p.pos,
      lab: W.posLabel(p),
      c: p.clubId,
      r,
    });
  };
  // list: [{ id, n, pos, lab, c, r }] -> the XI in a 4-3-3, or null when there are too few players to make one
  R.pickTeam = function (list) {
    const used = new Set(),
      xi = [];
    const take = (pred, n) =>
      list
        .filter((x) => pred(x) && !used.has(x.id))
        .sort((a, b) => b.r - a.r)
        .slice(0, n)
        .forEach((x) => (used.add(x.id), xi.push(x)));
    take((x) => x.pos === 'GK', 1);
    take((x) => x.pos === 'CB', 2);
    // a left-back and a right-back (a full-back or wing-back each), the best on each flank
    take((x) => (x.pos === 'FB' || x.pos === 'WB') && x.lab[0] === 'L', 1);
    take((x) => (x.pos === 'FB' || x.pos === 'WB') && x.lab[0] === 'R', 1);
    take((x) => DEF.has(x.pos), 4 - xi.filter((x) => DEF.has(x.pos)).length);
    take((x) => MID.has(x.pos), 3);
    take((x) => x.pos === 'ST', 1);
    take((x) => ATT.has(x.pos), 3 - xi.filter((x) => ATT.has(x.pos)).length);
    return xi.length >= 8 ? xi : null;
  };
  R.totwDay = function (cal, fxs) {
    const s = S();
    if (!s.totw || s.totw.year !== s.year) s.totw = { year: s.year, by: {} };
    const buf = s.totwBuf || {},
      user = W.userClub();
    for (const compId of Object.keys(buf)) {
      const comp = s.comps[compId],
        xi = comp && R.pickTeam(buf[compId]);
      if (!xi) continue;
      // manager of the round: the biggest win (then the stronger opponent beaten)
      let mgr = null,
        bestKey = -1;
      for (const fx of fxs || []) {
        if (fx.comp !== compId || !fx.res || fx.ko || fx.leg) continue;
        const d = fx.res.hg - fx.res.ag;
        if (!d) continue;
        const w = d > 0 ? fx.h : fx.a,
          l = d > 0 ? fx.a : fx.h,
          key = Math.abs(d) * 100 + (s.clubs[l] ? s.clubs[l].rep : 0);
        if (key > bestKey) {
          bestKey = key;
          mgr = w;
        }
      }
      const round = W.roundOn(comp, cal.round) + 1;
      const entry = {
        n: round,
        xi: xi.map((x) => ({ id: x.id, n: x.n, pos: x.pos, lab: x.lab, c: x.c, r: Math.round(x.r * 10) / 10 })),
        mgr,
      };
      (s.totw.by[compId] = s.totw.by[compId] || []).push(entry);
      for (const x of xi) {
        const p = s.players[x.id];
        if (!p) continue;
        p.totw = (p.totw || 0) + 1;
        p.totwY = p.totwY && p.totwY[0] === s.year ? [s.year, p.totwY[1] + 1] : [s.year, 1];
      }
      // the feed: your league's team of the week, and a line of its own when one of your players is in it
      if (user && user.comp === compId && !(s.settings || {}).noDigest) {
        const mine = xi.filter((x) => s.players[x.id] && W.ownPlayer(s.players[x.id]));
        FM.News.add({
          type: mine.length ? 'club' : 'world',
          title: `Team of the week · ${comp.short} matchday ${round}`,
          body:
            xi.map((x) => `${x.lab} ${x.n} (${(s.clubs[x.c] || {}).short || '?'}) ${x.r.toFixed(1)}`).join('\n') +
            (mgr && s.clubs[mgr] ? `\nManager of the week: ${s.clubs[mgr].name}` : '') +
            (mine.length ? `\n${mine.map((x) => x.n).join(', ')} ${mine.length > 1 ? 'are' : 'is'} yours.` : ''),
          clubId: mine.length ? user.id : undefined,
        });
      }
    }
    s.totwBuf = {};
  };
  // Team of the season so far (or at its end): by average rating, for players with a fair share of the games
  R.toty = function (compId) {
    const s = S(),
      comp = s.comps[compId];
    if (!comp || !comp.table) return null;
    const games = Math.max(0, ...Object.values(comp.table).map((r) => r.p)),
      min = Math.max(4, Math.round(games * 0.45));
    const list = [];
    for (const id of comp.clubs)
      for (const p of W.squad(id))
        if (p.season.apps >= min)
          list.push({
            id: p.id,
            n: W.short(p),
            pos: p.pos,
            lab: W.posLabel(p),
            c: p.clubId,
            r: Math.round((p.season.rsum / p.season.apps) * 100) / 100,
          });
    const xi = R.pickTeam(list);
    return xi && xi.map((x) => ({ id: x.id, n: x.n, pos: x.pos, lab: x.lab, c: x.c, r: x.r }));
  };
  // The world transfer record starts from history: a fee above anything the current market has paid,
  // so the first seasons' big deals don't all "break" it
  const seedWorld = () => {
    const top = Object.values(S().players).reduce((m, p) => Math.max(m, p.value || 0), 0);
    return {
      transfer: {
        name: 'a transfer before your time',
        fee: U.roundMoney(Math.max(2e7, top * 0.5)),
        year: S().year - 3,
        historic: true,
      },
    };
  };
  const store = () =>
    (S().records = S().records || { since: S().year, clubs: {}, h2h: {}, heat: {}, world: seedWorld() });
  // Club records start with the save, so they only make the news once there is a season to compare with
  const newsworthy = () => S().year > store().since;
  R.store = store;
  const clubRec = (id) => {
    const r = store();
    return (r.clubs[id] = r.clubs[id] || {});
  };
  const club = (id) => S().clubs[id];
  const isFull = (id) => !!(club(id) && club(id).sim === 'full');
  const pairKey = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  const compName = (id) => (S().comps[id] ? S().comps[id].name : '');
  const news = (o) => FM.News.add(o);
  const poss = (name) => (name.endsWith('s') ? `${name}'` : `${name}'s`);

  // ---------- Club match records + head-to-head + rivalry heat (after every engine match) ----------
  const margin = (m) => m.gf - m.ga;
  const beats = (m, old) => margin(m) > margin(old) || (margin(m) === margin(old) && m.gf > old.gf);
  const lossBeats = (m, old) => -margin(m) > -margin(old) || (margin(m) === margin(old) && m.ga > old.ga);
  R.onMatch = function (fx, res) {
    const s = S(),
      comp = s.comps[fx.comp];
    if (!comp || comp.type === 'friendly') return;
    [
      [fx.h, fx.a, res.hg, res.ag],
      [fx.a, fx.h, res.ag, res.hg],
    ].forEach(([id, opp, gf, ga]) => {
      if (!isFull(id)) return;
      const cr = clubRec(id),
        m = { gf, ga, opp, year: s.year, comp: fx.comp };
      if (gf > ga && (!cr.bigWin || beats(m, cr.bigWin))) {
        const prev = cr.bigWin;
        cr.bigWin = m;
        if (prev && W.isUser(id) && newsworthy())
          news({
            type: 'club',
            title: `Club record: ${poss(club(id).name)} biggest win`,
            body: `${gf}–${ga} against ${club(opp).name} beats the ${prev.gf}–${prev.ga} against ${club(prev.opp) ? club(prev.opp).name : '?'} (${prev.year}).`,
            clubId: id,
            fxId: fx.id,
          });
      }
      if (ga > gf && (!cr.bigLoss || lossBeats(m, cr.bigLoss))) {
        const prev = cr.bigLoss;
        cr.bigLoss = m;
        if (prev && W.isUser(id) && newsworthy())
          news({
            type: 'club',
            title: `Unwanted record: ${poss(club(id).name)} heaviest defeat`,
            body: `${gf}–${ga} at the hands of ${club(opp).name} — worse than the ${prev.gf}–${prev.ga} against ${club(prev.opp) ? club(prev.opp).name : '?'} (${prev.year}).`,
            clubId: id,
            fxId: fx.id,
          });
      }
    });
    // Head-to-head for the user's club, across seasons and competitions
    const u = s.user && s.user.clubId;
    if (u && (fx.h === u || fx.a === u)) {
      const home = fx.h === u,
        opp = home ? fx.a : fx.h,
        gf = home ? res.hg : res.ag,
        ga = home ? res.ag : res.hg;
      const key = `${u}|${opp}`,
        h = (store().h2h[key] = store().h2h[key] || { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, last: [] });
      h.p++;
      h.gf += gf;
      h.ga += ga;
      gf > ga ? h.w++ : gf < ga ? h.l++ : h.d++;
      h.last = [[s.year, gf, ga, home ? 1 : 0, fx.comp, res.pens ? (home ? res.pens : [res.pens[1], res.pens[0]]) : 0]]
        .concat(h.last)
        .slice(0, 6);
      R.checkAllTime(u, fx, res, home ? 0 : 1);
    }
    // Rivalry heat: knockouts decided between two clubs, red cards, bad-tempered games
    if (isFull(fx.h) && isFull(fx.a) && club(fx.h).rival !== fx.a) {
      const reds = res.cards.filter((c) => c.k === 'red').length,
        yellows = res.cards.length - reds;
      let add = 2 * reds + (yellows >= 6 ? 1 : 0);
      const why = [];
      if (res.win === 0 || res.win === 1) {
        add += 3;
        why.push(
          `${club(res.win ? fx.a : fx.h).short} knocked ${club(res.win ? fx.h : fx.a).short} out of the ${compName(fx.comp)}`,
        );
      }
      if (reds) why.push(reds === 1 ? 'a red card' : `${reds} red cards`);
      if (add) R.addHeat(fx.h, fx.a, add, why.join(' and '));
    }
  };

  // ---------- Rivalries that grow ----------
  R.EMERGING = 8;
  R.RIVALRY = 14;
  R.heat = (a, b) => {
    const h = S().records && S().records.heat[pairKey(a, b)];
    return h ? h.v : 0;
  };
  R.heated = (a, b) => R.heat(a, b) >= R.EMERGING;
  R.addHeat = function (a, b, n, why) {
    const k = pairKey(a, b),
      h = (store().heat[k] = store().heat[k] || { v: 0, st: 0 });
    h.v += n;
    const mine = W.isUser(a) || W.isUser(b),
      me = W.isUser(a) ? a : b,
      them = me === a ? b : a;
    if (h.st < 1 && h.v >= R.EMERGING) {
      h.st = 1;
      if (mine)
        news({
          type: 'dressing',
          title: `A new rivalry is emerging with ${club(them).name}`,
          body: `${why ? why[0].toUpperCase() + why.slice(1) + '. ' : ''}The fans have noticed — there's needle every time these two meet now. A chant about ${club(them).short} is already doing the rounds on the terraces.`,
          clubId: me,
        });
      else if (Math.random() < 0.3)
        news({
          type: 'world',
          title: `Bad blood: ${club(a).name} v ${club(b).name} is becoming a rivalry`,
          body: why ? `${why[0].toUpperCase() + why.slice(1)}.` : '',
          clubId: a,
        });
    }
    if (h.st < 2 && h.v >= R.RIVALRY) {
      h.st = 2;
      if (mine)
        news({
          type: 'dressing',
          title: `${club(them).name} are now a full-blown rival`,
          body: `Supporters mark this fixture on the calendar now. Expect a hostile atmosphere, more cards, and a crowd that takes the result personally.`,
          clubId: me,
        });
    }
  };
  // New season: rivalries cool unless they are fed
  R.seasonEnd = function () {
    const r = S().records;
    if (!r) return;
    for (const k in r.heat) {
      const h = r.heat[k];
      h.v = Math.round(h.v * 0.6 * 10) / 10;
      const [a, b] = k.split('|'),
        mine = W.isUser(a) || W.isUser(b),
        them = W.isUser(a) ? b : a;
      if (h.st >= 1 && h.v < R.EMERGING * 0.6) {
        h.st = 0;
        if (mine && club(them))
          news({
            type: 'club',
            title: `The rivalry with ${club(them).name} is cooling`,
            body: 'A quiet season between the clubs, and the needle has faded.',
            clubId: S().user.clubId,
            quiet: true,
          });
      }
      if (h.v < 1 && !h.st) delete r.heat[k];
    }
  };

  // ---------- Transfer records ----------
  R.onTransfer = function (p, fromId, toId, fee) {
    if (!(fee > 0)) return;
    const s = S(),
      name = W.name(p),
      rec = { pid: p.id, name, fee, year: s.year };
    const to = club(toId),
      from = fromId && club(fromId);
    if (to) {
      const cr = clubRec(toId),
        prev = cr.sign;
      if (!prev || fee > prev.fee) {
        cr.sign = { ...rec, from: fromId };
        if (prev && W.isUser(toId) && newsworthy())
          news({
            type: 'transfer',
            title: `Club-record signing: ${U.money(fee)} for ${name}`,
            body: `${to.name} break their transfer record${from ? ` to sign him from ${from.name}` : ''}. The previous record was ${U.money(prev.fee)} for ${prev.name} in ${prev.year}.`,
            pid: p.id,
            clubId: toId,
          });
      }
    }
    if (from) {
      const cr = clubRec(fromId),
        prev = cr.sale;
      if (!prev || fee > prev.fee) {
        cr.sale = { ...rec, to: toId };
        if (prev && W.isUser(fromId) && newsworthy())
          news({
            type: 'transfer',
            title: `Club-record sale: ${name} goes for ${U.money(fee)}`,
            body: `The biggest fee ${from.name} have ever received, beating ${U.money(prev.fee)} for ${prev.name} in ${prev.year}.`,
            pid: p.id,
            clubId: fromId,
          });
      }
    }
    const w = store().world,
      prevW = w.transfer;
    if (!prevW || fee > prevW.fee) {
      w.transfer = { ...rec, from: fromId, to: toId };
      if (prevW)
        news({
          type: 'headline',
          paper: 'Football Weekly',
          title: `World-record transfer: ${name} joins ${to ? to.name : '?'} for ${U.money(fee)}`,
          body: `The most expensive transfer in history, beating ${prevW.historic ? `the ${U.money(prevW.fee)} record that had stood since ${prevW.year}` : `${U.money(prevW.fee)} for ${prevW.name} (${prevW.year})`}.`,
          pid: p.id,
          clubId: toId,
        });
    }
  };

  // ---------- All-time lists (players + retired + the club's historical legends) ----------
  R.allTime = function (clubId) {
    const s = S(),
      c = club(clubId);
    const people = Object.values(s.players)
      .map((p) => ({
        id: p.id,
        name: W.name(p),
        nat: p.nat,
        pos: p.pos,
        youth: p.youth,
        cult: p.cult,
        spells: p.career.spells,
        active: true,
        derbyGoals: p.derbyGoals,
      }))
      .concat(
        (s.retired || []).map((r) => ({
          id: r.id,
          name: W.name(r),
          nat: r.nat,
          pos: r.pos,
          youth: r.youth,
          cult: r.cult,
          spells: r.spells || [],
          active: false,
          derbyGoals: r.derbyGoals,
          became: r.became,
        })),
      );
    const withClub = people
      .map((x) => {
        const sp = x.spells.filter((q) => q.c === clubId);
        return { ...x, apps: U.sum(sp, (q) => q.apps), goals: U.sum(sp, (q) => q.goals) };
      })
      .filter((x) => x.apps > 0);
    const legends = ((c && c.legends) || []).map((l) => ({
      name: l.name,
      nat: l.nat,
      pos: l.pos,
      apps: l.apps,
      goals: l.goals,
      note: l.note,
      era: l.era,
      hist: true,
    }));
    const all = withClub.concat(legends);
    return {
      withClub,
      all,
      scorers: all.filter((x) => x.goals).sort((a, b) => b.goals - a.goals),
      apps: all.slice().sort((a, b) => b.apps - a.apps),
    };
  };
  // After our match: did anyone just become the club's all-time top scorer or appearance maker?
  R.checkAllTime = function (clubId, fx, res, side) {
    const at = R.allTime(clubId),
      c = club(clubId);
    const scored = {};
    res.goals.filter((g) => g.side === side).forEach((g) => (scored[g.pid] = (scored[g.pid] || 0) + 1));
    const [s1, s2] = at.scorers;
    if (s1 && s2 && s1.id && scored[s1.id] && s1.goals > s2.goals && s1.goals - scored[s1.id] <= s2.goals)
      news({
        type: 'story',
        kicker: 'CLUB RECORD',
        title: `${s1.name} is ${poss(c.name)} all-time top scorer`,
        sub: `${s1.goals} goals for the club — past ${poss(s2.name)} ${s2.goals}.`,
        big: String(s1.goals),
        clubId,
        pid: s1.id,
      });
    const [a1, a2] = at.apps;
    if (
      a1 &&
      a2 &&
      a1.id &&
      S().players[a1.id] &&
      fx.ratings &&
      fx.ratings[a1.id] != null &&
      a1.apps > a2.apps &&
      a1.apps - 1 <= a2.apps
    )
      news({
        type: 'story',
        kicker: 'CLUB RECORD',
        title: `${a1.name} makes a record ${U.ordinal(a1.apps)} appearance`,
        sub: `No one has played more games for ${c.name} — past ${poss(a2.name)} ${a2.apps}.`,
        big: String(a1.apps),
        clubId,
        pid: a1.id,
      });
  };

  // ---------- Player of the month (every four league rounds, in the user's league) ----------
  R.afterLeagueDay = function (cal) {
    const s = S(),
      u = s.user;
    const b = W.baseRound(cal.round); // monthly, on the 22-round scale
    if (
      !u ||
      u.sacked ||
      !W.employed() ||
      cal.type !== 'league' ||
      (b + 1) % 4 ||
      (cal.round > 0 && W.baseRound(cal.round - 1) === b)
    )
      return;
    const comp = s.comps[W.userClub().comp];
    if (!comp || !comp.fixtures) return;
    const last4 = (p) => U.avg(p.form.slice(-4));
    const pool = comp.clubs.flatMap((id) => W.squad(id)).filter((p) => p.form.length >= 4 && p.season.apps >= 4);
    const best = pool.sort((a, b) => last4(b) - last4(a) || b.season.goals - a.season.goals)[0];
    if (!best) return;
    const month = MONTHS.at((b + 1) / 4 - 1) || 'the month';
    best.honours = (best.honours || []).concat([[s.year, 'potm', comp.id, month]]);
    best.morale = Math.min(100, best.morale + 5);
    news({
      type: 'award',
      title: `${W.name(best)} is ${comp.name} Player of the Month for ${month}`,
      body: `${last4(best).toFixed(2)} average over his last four games for ${club(best.clubId).name}${best.season.goals ? `, with ${best.season.goals} goal${best.season.goals === 1 ? '' : 's'} this season` : ''}.`,
      pid: best.id,
      clubId: best.clubId,
    });
  };

  // ---------- Injury history (players at fully simulated clubs) ----------
  R.noteInjury = function (p) {
    if (!p.inj || !isFull(p.clubId)) return;
    p.injHist = (p.injHist || []).concat([[S().year, p.inj.type, p.inj.out || p.inj.weeks]]).slice(-8);
  };
  // Summary for the player card: [{y, type, weeks}], total weeks, and a recurring problem if any
  R.injurySummary = function (p) {
    const list = (p.injHist || []).map(([y, type, weeks]) => ({ y, type, weeks }));
    if (!list.length) return null;
    const recent = list.filter((x) => x.y >= S().year - 1),
      byPart = {};
    recent.forEach((x) => {
      const part = FM.Injury ? FM.Injury.part(x.type) : x.type.split(' ')[0].toLowerCase();
      byPart[part] = (byPart[part] || 0) + 1;
    });
    const rec = Object.entries(byPart)
      .filter(([part, n]) => n >= 2 && !['knock', 'bruised', 'illness', 'head', 'ribs'].includes(part))
      .sort((a, b) => b[1] - a[1])[0];
    return { list, weeks: U.sum(list, (x) => x.weeks), recurring: rec ? { part: rec[0], n: rec[1] } : null };
  };

  // ---------- Managers move around the world ----------
  // Each manager's career: [clubId, fromYear, toYear|null, how they left]; the world's recent moves in records.moves
  const mgrJoin = (m, clubId) => {
    m.career = (m.career || []).concat([[clubId, S().year, null, null]]);
    delete m.unemployed;
  };
  const mgrLeave = (m, clubId, how) => {
    const last = (m.career || []).at(-1);
    if (last && last[0] === clubId && last[2] == null) {
      last[2] = S().year;
      last[3] = how;
    } else m.career = (m.career || []).concat([[clubId, null, S().year, how]]);
  };
  R.logMove = (m, from, to, kind) => {
    const r = store();
    r.moves = [[S().year, m.id, from || null, to || null, kind]].concat(r.moves || []).slice(0, 80);
  };
  // Who takes a vacant job: a successful manager poached from a smaller club, an out-of-work manager (one who
  // left in an earlier season: nobody is rehired the year he was sacked), or nobody (→ new face)
  R.findManager = function (c, noPoach) {
    const s = S();
    if (!noPoach && Math.random() < 0.45) {
      const cands = Object.values(s.clubs).filter(
        (x) =>
          x !== c &&
          x.sim === 'full' &&
          !W.isUser(x.id) &&
          x.manager &&
          s.staff[x.manager] &&
          x.rep < c.rep - 2 &&
          x.rep >= c.rep - 25 &&
          x.boardConf >= 60,
      );
      const pick = cands.length ? U.wpick(cands, (x) => x.boardConf - 55 + x.rep / 10) : null;
      if (pick) return { m: s.staff[pick.manager], from: pick };
    }
    if (Math.random() < 0.5) {
      const free = Object.values(s.staff).filter(
        (m) =>
          m.role === 'Manager' &&
          m.unemployed &&
          m.age < 68 &&
          ((m.career || []).at(-1) || [])[2] < s.year &&
          (m.rep || 50) >= c.rep - 20,
      );
      if (free.length) return { m: U.pick(free) };
    }
    return null;
  };
  // Bookkeeping when a club changes manager (called from FM.Stories.newManager)
  R.managerChange = function (c, oldM, newM, fromClub) {
    if (oldM) {
      mgrLeave(oldM, c.id, 'left');
      oldM.unemployed = true;
      R.logMove(oldM, c.id, null, 'left');
    }
    if (fromClub) mgrLeave(newM, fromClub.id, 'poached');
    mgrJoin(newM, c.id);
    newM.rep = Math.max(newM.rep || 0, Math.round(c.rep * 0.9));
    R.logMove(
      newM,
      fromClub ? fromClub.id : null,
      c.id,
      fromClub ? 'poached' : newM.career.length > 1 ? 'return' : 'new',
    );
  };
  // The user taking a job displaces its manager; the club the user left hires one
  R.managerLeft = (m, clubId) => {
    mgrLeave(m, clubId, 'replaced');
    m.unemployed = true;
    R.logMove(m, clubId, null, 'left');
  };
  R.managerJoined = (m, clubId) => {
    mgrJoin(m, clubId);
    R.logMove(m, null, clubId, 'new');
  };
  // "Since 2027 · previously Eastport Dockers" for the team overview
  R.managerLine = function (m, clubId) {
    const car = m.career || [],
      cur = car.at(-1),
      prev = car.filter((x) => x[0] !== clubId && S().clubs[x[0]]).at(-1);
    return [
      cur && cur[0] === clubId && cur[1] ? `since ${cur[1]}` : '',
      prev ? `previously ${S().clubs[prev[0]].name}` : '',
    ]
      .filter(Boolean)
      .join(' · ');
  };

  // ---------- Stadium histories ----------
  // Every ground gets an opening year (from its club, deterministic) and a history of capacity changes
  R.stadium = function (c) {
    const st = c.stadium;
    if (!st.opened) st.opened = Math.min(2012, 1880 + (U.hash(c.id + st.name) % 118));
    if (!st.hist) st.hist = [[store().since, 'Capacity', st.cap]]; // seeded before any change it records
    return st;
  };
  // All capacity growth goes through here: history, and a story for the user's club
  R.expandStadium = function (c, add, why) {
    const st = R.stadium(c),
      before = st.cap;
    st.cap += add;
    st.hist.push([S().year, why || 'Expansion', st.cap]);
    const milestone = [20000, 30000, 40000, 50000, 60000, 75000].find((m) => before < m && st.cap >= m);
    if (W.isUser(c.id))
      FM.Stories.share({
        kicker: 'STADIUM',
        title: `${st.name} now holds ${st.cap.toLocaleString()}`,
        sub: `${why || 'Expansion'} complete: ${add.toLocaleString()} more seats${milestone ? ` — past ${milestone.toLocaleString()} for the first time since it opened in ${st.opened}` : ''}.`,
        big: `${Math.round(st.cap / 1000)}K`,
        clubId: c.id,
      });
    return st.cap;
  };

  // ---------- Tournament and season awards ----------
  // Cups, continental cups and the finals keep their own per-player stats while they are played (S.compStats, one entry
  // per competition: appearances, rating total, goals, assists); when a competition ends, its awards are worked out
  // and kept with it: the Golden Boot, best player, best young player, best goalkeeper, most assists and a team of the
  // tournament. Leagues get the same from the season's numbers, and the world gets a best XI.
  const stats = (key) => {
    const s = S();
    if (!s.compStats || s.compStats.year !== s.year) s.compStats = { year: s.year, by: {} };
    return (s.compStats.by[key] = s.compStats.by[key] || {});
  };
  const entryOf = (key, pid) => {
    const m = stats(key);
    return (m[pid] = m[pid] || { a: 0, r: 0, g: 0, s: 0 });
  };
  R.noteComp = function (key, p, r) {
    const e = entryOf(key, p.id);
    e.a++;
    e.r += r;
  };
  // a goal (and its assist) in a match of fx's competition, or in a tournament (key given)
  R.noteGoal = function (fx, g, key) {
    const comp = !key && S().comps[fx.comp];
    if (!key && (!comp || comp.type === 'league' || comp.type === 'friendly')) return;
    const k = key || fx.comp;
    if (S().players[g.pid]) entryOf(k, g.pid).g++;
    if (g.ast && S().players[g.ast]) entryOf(k, g.ast).s++;
  };
  // rows: [{ p, a (appearances), r (rating total), g, s, adj (a rating bonus, default 0), side (club or nation id) }]
  R.awardsOf = function (rows) {
    const maxA = Math.max(0, ...rows.map((x) => x.a)),
      min = Math.max(1, Math.round(maxA * 0.5));
    const avg = (x) => x.r / Math.max(1, x.a) + (x.adj || 0);
    const who = (x, extra = {}) => ({
      pid: x.p.id,
      name: W.name(x.p),
      club: x.side || x.p.clubId,
      pos: x.p.pos,
      ...extra,
    });
    const ok = rows.filter((x) => x.p && x.a >= min);
    const top = (list, key) => list.slice().sort((a, b) => key(b) - key(a))[0];
    const boot = top(
      rows.filter((x) => x.g > 0),
      (x) => x.g * 100 + x.s * 10 - x.a,
    );
    const ast = top(
      rows.filter((x) => x.s > 0),
      (x) => x.s * 100 + x.g * 10 - x.a,
    );
    const player = top(ok, (x) => avg(x) + x.g * 0.02);
    const young = top(
      ok.filter((x) => W.age(x.p) <= 21),
      avg,
    );
    const keeper = top(
      ok.filter((x) => x.p.pos === 'GK'),
      avg,
    );
    const xi = R.pickTeam(
      ok.map((x) => ({
        id: x.p.id,
        n: W.short(x.p),
        pos: x.p.pos,
        lab: W.posLabel(x.p),
        c: x.side || x.p.clubId,
        r: Math.round(avg(x) * 100) / 100,
      })),
    );
    return {
      boot: boot && who(boot, { goals: boot.g, assists: boot.s }),
      assists: ast && who(ast, { assists: ast.s }),
      player: player && who(player, { avg: +(player.r / player.a).toFixed(2) }),
      young: young && who(young, { avg: +(young.r / young.a).toFixed(2) }),
      keeper: keeper && who(keeper, { avg: +(keeper.r / keeper.a).toFixed(2) }),
      xi,
    };
  };
  // A competition's rows from its own stats (the side is the player's club, or his nation's team for the finals)
  const rowsOf = (key, sideOf) => {
    const m = (S().compStats && S().compStats.year === S().year && S().compStats.by[key]) || {};
    return Object.entries(m)
      .map(([pid, e]) => ({
        p: S().players[pid],
        a: e.a,
        r: e.r,
        g: e.g,
        s: e.s,
        side: sideOf && S().players[pid] && sideOf(S().players[pid]),
      }))
      .filter((x) => x.p);
  };
  const awardLines = (aw) =>
    [
      aw.boot && `Golden Boot: ${aw.boot.name} (${aw.boot.goals} goal${aw.boot.goals === 1 ? '' : 's'})`,
      aw.player && `Best player: ${aw.player.name}`,
      aw.young && `Best young player: ${aw.young.name}`,
      aw.keeper && `Best goalkeeper: ${aw.keeper.name}`,
      aw.assists && `Most assists: ${aw.assists.name} (${aw.assists.assists})`,
    ]
      .filter(Boolean)
      .join('\n');
  // A cup or continental competition has just ended: its awards, kept on it, and the news if it matters to you
  R.finishComp = function (c) {
    const aw = R.awardsOf(rowsOf(c.id));
    c.awards = aw.boot || aw.player || aw.xi ? aw : null;
    if (S().compStats && S().compStats.by) delete S().compStats.by[c.id];
    if (!c.awards) return;
    const mine = W.userClub() && c.clubs && c.clubs.includes(W.userClub().id);
    if (mine || c.type === 'continental' || c.type === 'world')
      news({
        type: 'award',
        title: `${c.name}: awards and team of the tournament`,
        body: awardLines(c.awards),
        pid: c.awards.player ? c.awards.player.pid : undefined,
      });
  };
  // The international finals ended (rows: players by nation)
  R.finishTournament = function (t) {
    const key = 'T_' + t.id;
    const aw = R.awardsOf(rowsOf(key, (p) => 'n_' + (FM.Intl ? FM.Intl.nationOf(p) : p.nat)));
    t.awards = aw.boot || aw.player || aw.xi ? aw : null;
    if (S().compStats && S().compStats.by) delete S().compStats.by[key];
    if (!t.awards) return null;
    news({
      type: 'award',
      title: `${t.name}: awards and team of the tournament`,
      body: awardLines(t.awards),
      pid: t.awards.player ? t.awards.player.pid : undefined,
    });
    return t.awards;
  };
  // A league's awards from this season's numbers (so far, or at the end)
  R.leagueAwards = function (compId) {
    const comp = S().comps[compId];
    if (!comp || !comp.table) return null;
    const rows = [];
    for (const id of comp.clubs)
      for (const p of W.squad(id))
        rows.push({ p, a: p.season.apps, r: p.season.rsum, g: p.season.goals, s: p.season.ast });
    const aw = R.awardsOf(rows);
    return aw.boot || aw.player || aw.xi ? aw : null;
  };
  // The world's best XI of the season: every player at a fully or lightly simulated club with a fair share of his
  // league's games, rated on his average, with a little extra for a stronger league. Also the world's best player.
  R.worldXI = function () {
    const s = S(),
      list = [];
    for (const comp of W.leagues()) {
      if (comp.sim === 'minimal') continue;
      const games = Math.max(0, ...Object.values(comp.table).map((r) => r.p)),
        min = Math.max(4, Math.round(games * 0.5));
      for (const id of comp.clubs) {
        const bonus = (W.levelFor(s.clubs[id].rep) - 60) * 0.02;
        for (const p of W.squad(id))
          if (p.season.apps >= min)
            list.push({
              id: p.id,
              n: W.short(p),
              pos: p.pos,
              lab: W.posLabel(p),
              c: p.clubId,
              r: Math.round((p.season.rsum / p.season.apps + bonus) * 100) / 100,
            });
      }
    }
    const xi = R.pickTeam(list);
    const best = list.slice().sort((a, b) => b.r - a.r)[0];
    return xi ? { xi, best: best && { pid: best.id, name: W.name(s.players[best.id]), club: best.c } } : null;
  };

  // Rivalries cool a little every summer
  const endSeason = FM.Season.endSeason;
  FM.Season.endSeason = function () {
    // the awards are worked out from this season's numbers before the season closes them
    const wxi = R.worldXI(),
      lg = {};
    for (const c of W.leagues()) lg[c.id] = R.leagueAwards(c.id);
    const out = endSeason.apply(this, arguments);
    const e = S().archive && S().archive[S().archive.length - 1];
    if (e) {
      e.worldXI = wxi;
      for (const id in e.comps) if (lg[id]) e.comps[id].awards = lg[id];
    }
    if (wxi)
      news({
        type: 'award',
        title: `World best XI of ${e ? e.label : 'the season'}`,
        body: `${wxi.xi.map((x) => x.n).join(', ')}.${wxi.best ? ` Player of the year: ${wxi.best.name}.` : ''}`,
        pid: wxi.best ? wxi.best.pid : undefined,
      });
    R.seasonEnd();
    return out;
  };
})();
