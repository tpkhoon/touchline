// Detective-style scouting: regions, scout assignments, knowledge and reports. The transfer market is in transfers.js.
(function () {
  const FM = window.FM,
    U = FM.U,
    D = FM.D,
    W = FM.W;

  const Sc = (FM.Scouting = {});
  Sc.region = function (p) {
    const c = p.clubId && FM.S.clubs[p.clubId];
    if (c) return c.nat === 'ENG' ? 'ENG' : D.NATIONS[c.nat].region;
    return D.NATIONS[p.nat].region;
  };
  // A club with a signing policy (the Basque and Catalan clubs) only looks at players it could sign: its scouts, search and
  // suggestions leave everyone else out
  Sc.scoutable = function (p) {
    const c = FM.S.user && FM.S.user.clubId && FM.S.clubs[FM.S.user.clubId];
    return !c || !c.policy || FM.Reg.policy(c, p).ok;
  };
  Sc.know = (pid) => FM.S.user.knowledge[pid] || 0;
  // Average ability of the user's current XI (cached per matchday — used on every report render)
  Sc.level = function () {
    const S = FM.S,
      key = `${S.day}-${S.user.clubId}-${S.year}`;
    if (Sc._lvlKey !== key || Sc._lvlS !== S) {
      // Out of work there is no XI to compare with: judge against the level your reputation would get you
      Sc._lvlS = S;
      Sc._lvlKey = key;
      Sc._lvl = W.employed()
        ? U.avg(W.pickXI(S.user.clubId, S.user.tactic).xi.filter(Boolean), (q) => q.ca)
        : W.levelFor(S.user.rep + 8);
    }
    return Sc._lvl;
  };

  // How a player's stats compare with the other players in his position: the league he plays in (or, if that is too
  // small to mean anything, his country, then the world). Returns { scope, n, best: [{k, pct}], worst: [{k, pct}] },
  // pct = the share of those players he is better than (0–100). What you can see is as exact as what you know of him.
  let peerCache = { key: null, by: {} };
  Sc.peers = function (p) {
    const S = FM.S,
      c = p.clubId && S.clubs[p.clubId],
      key = `${S.year}-${S.day}`;
    if (peerCache.key !== key || peerCache.S !== S) peerCache = { key, S, by: {}, all: Object.values(S.players) };
    const ck = `${c ? c.comp : '-'}|${c ? c.nat : p.nat}|${p.pos}`;
    if (!peerCache.by[ck]) {
      const same = peerCache.all.filter((q) => q.pos === p.pos && q.clubId && !q.retired);
      let scope = 'world',
        list = same;
      const league = c && same.filter((q) => S.clubs[q.clubId] && S.clubs[q.clubId].comp === c.comp);
      const nation = c && same.filter((q) => S.clubs[q.clubId] && S.clubs[q.clubId].nat === c.nat);
      if (league && league.length >= 12) ((scope = 'league'), (list = league));
      else if (nation && nation.length >= 12) ((scope = 'nation'), (list = nation));
      const arrs = {};
      for (const k of D.ATTRS) arrs[k] = list.map((q) => q.attrs[k]).sort((a, b) => a - b);
      peerCache.by[ck] = { scope, n: list.length, arrs };
    }
    const g = peerCache.by[ck];
    const pct = {};
    for (const k of D.ATTRS) {
      const v = Sc.noisy(p, k),
        a = g.arrs[k];
      let less = 0,
        eq = 0;
      for (const x of a) {
        if (x < v - 0.25) less++;
        else if (x <= v + 0.25) eq++;
        else break;
      }
      pct[k] = Math.round(((less + eq / 2) / Math.max(1, a.length)) * 100);
    }
    // best and worst among the stats his position asks for
    const rows = Object.entries(D.RATE_W[p.pos])
      .filter(([, wt]) => wt >= 1.5) // (what his position's rating leans on)
      .map(([k]) => ({ k, pct: pct[k] }))
      .sort((a, b) => b.pct - a.pct);
    return {
      scope: g.scope,
      n: g.n,
      pct,
      best: rows.slice(0, 3).filter((r) => r.pct >= 55),
      worst: rows
        .slice(-3)
        .reverse()
        .filter((r) => r.pct <= 45),
    };
  };
  // An attribute as you read it: exact for your own players, a little off for one you only partly know (the same
  // misreading every time, so it doesn't jump about between screens)
  Sc.noisy = function (p, k) {
    const known = p.clubId === FM.S.user.clubId ? 100 : Sc.know(p.id);
    return p.attrs[k] + ((U.hash(p.id + k) % 200) / 100 - 1) * (1 - known / 100) * 3;
  };
  // In words: how good an attribute is against the players in his position in his league (a percentile), or against
  // yours (the difference from your own players in that position)
  Sc.wordPct = (pct) => {
    const w =
      pct >= 90
        ? ['Outstanding', 'good']
        : pct >= 75
          ? ['Very good', 'good']
          : pct >= 55
            ? ['Good', 'good']
            : pct >= 40
              ? ['Average', '']
              : pct >= 25
                ? ['Below average', 'warn']
                : pct >= 10
                  ? ['Poor', 'bad']
                  : ['Awful', 'bad'];
    return { word: w[0], cls: w[1] };
  };
  // Your level: his attribute against your squad's players in the same position (the best three by ability), or your
  // XI when you have none there
  Sc.yourLevel = function (p) {
    const c = FM.S.clubs[FM.S.user.clubId];
    if (!c) return null;
    const sq = W.squad(c.id).filter((q) => !q.team);
    let ref = sq
      .filter((q) => q.pos === p.pos && q.id !== p.id)
      .sort((a, b) => b.ca - a.ca)
      .slice(0, 3);
    if (!ref.length)
      ref = W.pickXI(c.id, FM.S.user.tactic)
        .xi.filter((q) => q && q.pos !== 'GK' && q.id !== p.id)
        .slice(0, 6);
    if (!ref.length) return null;
    const out = {};
    for (const k of D.ATTRS) {
      const d = Sc.noisy(p, k) - U.avg(ref, (q) => q.attrs[k]);
      out[k] =
        d >= 3
          ? { word: 'Far better than yours', cls: 'good' }
          : d >= 1.5
            ? { word: 'Better than yours', cls: 'good' }
            : d > -1.5
              ? { word: 'Similar to yours', cls: '' }
              : d > -3
                ? { word: 'Worse than yours', cls: 'warn' }
                : { word: 'Far worse than yours', cls: 'bad' };
    }
    return out;
  };
  // What the scout says, in his own voice: how good he is now, where he could get to, and how sure he is. The
  // confidence is how much you know of him, scaled by how good your scout is at judging. Potential narrows as a
  // player ages (a 30-year-old has no ceiling left to guess at).
  const halves = (n) => `${Math.floor(n)}${n % 1 ? '½' : ''}★`;
  Sc.confidenceOf = (v) =>
    v.own ? 100 : Math.round(U.clamp(v.k * (0.82 + 0.36 * (v.scout ? v.scout.judge / 20 : 0.5)), 0, 99));
  Sc.say = function (p, v) {
    if (v.own || !v.ca) return null;
    const conf = Sc.confidenceOf(v),
      now = W.stars((v.ca[0] + v.ca[1]) / 2, p.pos),
      age = W.age(p);
    const sure = conf >= 85 ? "I'm sure of it" : `I'm about ${conf}% sure`;
    let line = `He's a ${halves(now)} player now`;
    if (age <= 26 && v.pa) {
      const lo = W.stars(v.pa[0], p.pos),
        hi = W.stars(v.pa[1], p.pos),
        mid = W.stars((v.pa[0] + v.pa[1]) / 2, p.pos);
      line +=
        mid > now + 0.4
          ? ` and could reach ${halves(mid)}${hi - lo >= 1 ? `, anywhere from ${halves(lo)} to ${halves(hi)}` : ''}`
          : ' and I think he is close to his ceiling';
    } else if (age >= 27) line += ' and what you see is what you get';
    return { text: `${line}. ${sure}.`, conf, who: v.scout ? `${v.scout.fn} ${v.scout.ln}, scout` : 'your scouts' };
  };

  Sc.dismiss = function (pid) {
    const u = FM.S.user;
    (u.dismissed = u.dismissed || {})[pid] = { year: FM.S.year, rep: u.reports[pid] || null };
    delete u.reports[pid];
  };
  // Undo a dismissal: the report comes back as it was, and scouts may pick him up again
  Sc.restore = function (pid) {
    const u = FM.S.user,
      d = u.dismissed && u.dismissed[pid];
    if (!d) return;
    if (d.rep) u.reports[pid] = { ...d.rep, isNew: false };
    delete u.dismissed[pid];
  };
  Sc.assign = function (scoutId, spec) {
    const u = FM.S.user;
    if (spec.type === 'player' && u.dismissed) delete u.dismissed[spec.pid];
    u.assignments = u.assignments.filter((a) => a.scout !== scoutId);
    if (spec.type === 'player') {
      const s = FM.S.staff[scoutId],
        p = FM.S.players[spec.pid];
      spec.weeks = Math.max(1, Math.round(3 - 2 * s.regions[Sc.region(p)]));
    }
    u.assignments.push({ scout: scoutId, since: FM.S.day, ...spec });
  };

  function learn(scout, p, mult = 1) {
    const u = FM.S.user,
      reg = Sc.region(p),
      exp = scout.regions[reg];
    const gain = (6 + 24 * exp + scout.judge * 0.6) * mult;
    const before = u.knowledge[p.id] || 0;
    u.knowledge[p.id] = Math.min(100, before + gain * (1 - before / 140));
    const rep = u.reports[p.id];
    if (!rep)
      u.reports[p.id] = {
        scout: scout.id,
        err: U.gauss(0, 1),
        errP: U.gauss(0, 1),
        day: FM.S.day,
        year: FM.S.year,
        isNew: true,
      };
    else if (rep.scout === scout.id) {
      rep.day = FM.S.day;
      rep.year = FM.S.year;
      rep.isNew = true;
    } else if (rep.second && rep.second.scout === scout.id) {
      rep.second.day = FM.S.day;
      rep.second.year = FM.S.year;
      rep.second.isNew = true;
    } else {
      // a different scout watching the same player: his view is kept beside the first, as a second opinion (the latest
      // other scout replaces an earlier one)
      rep.second = {
        scout: scout.id,
        err: U.gauss(0, 1),
        errP: U.gauss(0, 1),
        day: FM.S.day,
        year: FM.S.year,
        isNew: true,
      };
    }
  }

  // A scout's own (imperfect) read of potential, stable per scout+player
  Sc.scoutPA = (scout, p) => p.pa + ((U.hash(scout.id + p.id) % 1000) / 1000 - 0.5) * 2 * (21 - scout.judge) * 0.8;
  Sc.focusLabel = (a) => {
    const where = a.type === 'league' ? FM.S.comps[a.comp].name : D.REGIONS[a.region];
    const bits = [a.pos === 'any' ? 'all positions' : a.pos, `≤${a.maxAge}`];
    if (a.nat && a.nat !== 'any') bits.push(`${D.NATIONS[a.nat].name} only`);
    if (a.minStars) bits.push(`${a.minStars}★+ potential`);
    if (a.maxFee) bits.push(`under ${U.money(a.maxFee)}`);
    if (a.focus && a.focus !== 'any')
      bits.push({ moneyball: 'undervalued', wonderkid: 'wonderkids', ready: 'ready-made' }[a.focus]);
    return `${where} · ${bits.join(' · ')}`;
  };

  Sc.tick = function () {
    const S = FM.S,
      u = S.user;
    const done = [];
    for (const a of u.assignments) {
      const scout = S.staff[a.scout];
      if (!scout) {
        done.push(a);
        continue;
      }
      if (a.type === 'region' || a.type === 'league') {
        const lvl = U.avg(W.pickXI(u.clubId, u.tactic).xi.filter(Boolean), (q) => q.ca);
        const dis = u.dismissed || {};
        const cands = Object.values(S.players).filter(
          (p) =>
            !p.retired &&
            p.clubId !== u.clubId &&
            !dis[p.id] &&
            Sc.scoutable(p) &&
            (a.type === 'league' ? p.clubId && S.clubs[p.clubId].comp === a.comp : Sc.region(p) === a.region) &&
            (a.pos === 'any' || D.POS_GROUP[p.pos] === a.pos) &&
            (!a.nat || a.nat === 'any' || p.nat === a.nat) &&
            W.age(p) <= a.maxAge &&
            (!a.minStars || W.stars(Sc.scoutPA(scout, p), p.pos) >= a.minStars) &&
            (!a.maxFee || FM.Transfers.askPrice(p) <= a.maxFee * 1.1),
        );
        if (!cands.length) continue;
        const weight = (c) => {
          let w = (1.05 - Sc.know(c.id) / 100) * Math.pow(0.5 + Sc.scoutPA(scout, c) / 100, 4);
          if (a.focus === 'moneyball')
            w *= c.season.apps ? Math.pow(c.season.rsum / c.season.apps / 6.5, 6) * (3e6 / (c.value + 1e6)) : 0.2;
          if (a.focus === 'wonderkid') w *= W.age(c) <= 19 ? Math.pow(Sc.scoutPA(scout, c) / 60, 6) : 0.05;
          if (a.focus === 'ready') w *= c.ca >= lvl - 2 ? 3 : 0.3;
          return w;
        };
        const found = [];
        const n = scout.judge >= 15 ? 3 : 2;
        for (let i = 0; i < n; i++) {
          const pool = cands.filter((c) => !found.includes(c));
          if (!pool.length) break;
          const p = U.wpick(pool, weight);
          if (p) {
            found.push(p);
            learn(scout, p);
          }
        }
        if (found.length) {
          const graded = found.map((p) => ({ p, v: Sc.view(p) })).sort((x, y) => y.v.score - x.v.score);
          const top = graded[0];
          const star = top.v.grade === 'A' || (top.v.grade === 'B' && top.v.rec === 'Loan');
          FM.News.add({
            type: 'report',
            title: star
              ? `${scout.fn} ${scout.ln}: "You need to see ${W.name(top.p)}"`
              : `${scout.fn} ${scout.ln}: new reports — ${Sc.focusLabel(a)}`,
            body: graded
              .map(
                ({ p, v }) =>
                  `${D.NATIONS[p.nat].flag} ${W.name(p)} (${W.age(p)}, ${p.pos}) — grade ${v.grade}: ${v.verdict}`,
              )
              .join('\n'),
            pid: top.p.id,
            pids: graded.map(({ p }) => p.id), // every player named in the blurb is tappable
            quiet: !star,
          });
        }
      } else if (a.type === 'player') {
        const p = S.players[a.pid];
        if (!p) {
          done.push(a);
          continue;
        }
        learn(scout, p, 1.4);
        if (--a.weeks <= 0) {
          done.push(a);
          FM.News.add({
            type: 'report',
            title: `Scout report: ${W.name(p)}`,
            body: `${scout.fn} ${scout.ln} has finished watching ${W.name(p)} of ${p.clubId ? S.clubs[p.clubId].name : 'no club'}. Verdict: ${Sc.view(p).verdict}.`,
            pid: p.id,
          });
        }
      }
    }
    u.assignments = u.assignments.filter((a) => !done.includes(a));
  };

  // What the user can see about a player, given knowledge
  // How much a player's head-room (potential over current ability) counts in a scout's judgement, by age:
  // a teenager is bought for what he'll become, a 26-year-old for what he is
  Sc.potentialWeight = (age) => (age <= 19 ? 0.6 : age <= 21 ? 0.5 : age <= 23 ? 0.35 : age <= 25 ? 0.15 : 0);
  // What a player would do for your side: against the weakest starter in his position (how many slots your shape has there),
  // and whether you are short of players there at all. helps: he would improve the eleven or fill a gap.
  Sc.need = function (p, ca) {
    const club = W.userClub();
    if (!club) return null;
    const tac = FM.S.user.tactic,
      slots = (D.FORMATIONS[tac.formation] || []).filter((x) => x.t === p.pos).length || 1;
    const same = W.squad(club.id)
      .filter((q) => q.pos === p.pos && !(q.loan && q.loan.from === club.id))
      .sort((a, b) => b.ca - a.ca);
    const want = W.squadWant(club)[p.pos] ?? 2;
    const weakest = same[Math.min(slots, same.length) - 1] || null;
    const delta = ca - (weakest ? weakest.ca : 0);
    return {
      delta,
      slots,
      depth: same.length,
      want,
      replaces: weakest,
      helps: delta >= 2 || same.length < want,
      short: same.length < want,
    };
  };
  // Three prices for a target: what the analytics department makes of his value, what his side (or his agent) wants, and what
  // the sporting director thinks you could get him for. They differ, and which to believe is the decision.
  Sc.prices = function (p, k) {
    const club = W.userClub();
    if (!club || p.clubId === club.id || k < 20) return null;
    const T = FM.Transfers,
      ask = T.askPrice(p);
    const an = club.facilities.analytics || 0;
    const noise = (tag, spread) => ((U.hash(p.id + tag) % 2001) / 1000 - 1) * spread;
    const dir = FM.Staff.get('director');
    const dirAbility = dir ? W.staffAbility('director') : 8;
    return {
      free: !p.clubId,
      analytics:
        an >= 1 && k >= 30 ? U.roundMoney(W.baseValue(p) * W.formFactor(p) * (1 + noise('an', 0.2 - an * 0.03))) : null,
      agent: p.clubId ? ask : null,
      director: U.roundMoney(T.userAsk(p) * (1 + noise('dir', Math.max(0.03, 0.2 - dirAbility * 0.01)))),
      directorKnows: dirAbility >= 12 ? 'sure' : dirAbility >= 8 ? 'fairly sure' : 'guessing',
    };
  };

  // ---------- Scouts see differently ----------
  // Each scout has a lean: some are impressed by athletes (pace, stamina, strength), some by technique (dribbling, technique,
  // passing, vision). A scout who judges well leans little. The lean colours his read of a player, so two scouts can disagree
  // about the same man, and each notices different things.
  Sc.bias = function (scout) {
    const mag = U.clamp(1.25 - scout.judge / 20, 0.25, 1);
    return ((U.hash(scout.id) % 2001) / 1000 - 1) * mag;
  };
  // How athletic against technical a player is: about -2 (all technique) to 2 (all athlete)
  Sc.athlete = function (p) {
    if (p.pos === 'GK') return 0;
    const a = p.attrs;
    return ((a.pace + a.stamina + a.strength) / 3 - (a.dribbling + a.technique + a.passing + a.vision) / 4) / 3;
  };
  Sc.leanAdj = (scout, p) => (scout ? Sc.bias(scout) * Sc.athlete(p) * 3 : 0);
  // The attribute a scout would single out: athletes for a physical lean, technique for a technical one
  Sc.notice = function (scout, p) {
    const b = scout ? Sc.bias(scout) : 0,
      pool =
        b >= 0.25
          ? ['pace', 'strength', 'stamina']
          : b <= -0.25
            ? ['technique', 'dribbling', 'passing', 'vision']
            : D.ATTRS.filter((a) => (D.POS_W[p.pos] || {})[a]);
    const best = pool.slice().sort((x, y) => p.attrs[y] - p.attrs[x])[0],
      worst = pool.slice().sort((x, y) => p.attrs[x] - p.attrs[y])[0];
    return { best, worst, lean: b >= 0.25 ? 'physical' : b <= -0.25 ? 'technical' : 'rounded' };
  };

  Sc.view = function (p) {
    const S = FM.S,
      u = S.user,
      own = p.clubId === u.clubId;
    const k = own ? 100 : Sc.know(p.id);
    const rep = u.reports[p.id];
    const scout = rep && S.staff[rep.scout];
    const rep2 = rep && rep.second && S.staff[rep.second.scout] ? rep.second : null,
      scout2 = rep2 && S.staff[rep2.scout];
    const unc = 1 - k / 100;
    // one scout's read of ability and potential: his errors, his knowledge of the region and his lean
    const estOf = (r, sc) => {
      const e = sc ? sc.regions[Sc.region(p)] : 0.4;
      const ca = U.clamp(p.ca + (r ? r.err : 0) * unc * 14 * (1.3 - e) + Sc.leanAdj(sc, p) * unc * 1.2, 20, 99);
      return { ca, pa: U.clamp(Math.max(ca, p.pa + (r ? r.errP : 0) * unc * 22 * (1.3 - e)), 20, 99) };
    };
    const e1 = estOf(rep, scout),
      e2 = rep2 ? estOf(rep2, scout2) : null;
    // two opinions are averaged, and the estimate is a little firmer for it
    const caEst = e2 ? (e1.ca + e2.ca) / 2 : e1.ca,
      paEst = e2 ? (e1.pa + e2.pa) / 2 : e1.pa;
    const age = W.age(p),
      ageK = age <= 19 ? 1 : age >= 28 ? 0.3 : 1 - (age - 19) * 0.078; // the older he is, the less ceiling there is to guess
    const firm = rep2 ? 0.82 : 1,
      wC = (unc * 16 + (k < 100 ? 2 : 0)) * firm,
      wP = (unc * 24 + (k < 100 ? 4 : 0)) * ageK * firm;
    const v = {
      k,
      own,
      scout,
      ca: k >= 10 ? [caEst - wC / 2, caEst + wC / 2] : null,
      pa: k >= 25 ? [paEst - wP / 2, paEst + wP / 2] : null,
      showAttrs: k >= 70,
      attrsApprox: k >= 40 && k < 70,
      strengths: [],
      weaknesses: [],
      personality: k >= 50 ? p.personality : null,
      traits: k >= 60 ? p.traits : k >= 40 ? p.traits.filter((t) => t !== 'Injury Prone').slice(0, 1) : [],
      injury:
        k >= 55
          ? p.hid.inj >= 15
            ? 'Significant injury history — recurring muscle problems'
            : p.hid.inj >= 10
              ? 'Occasional knocks, nothing serious'
              : 'Clean bill of health'
          : null,
      hidden:
        k >= 75
          ? [
              p.hid.cons >= 14
                ? 'Performs consistently week to week'
                : p.hid.cons <= 7
                  ? 'Wildly inconsistent'
                  : 'Reasonably consistent',
              p.hid.big >= 14
                ? 'Thrives on the big occasion'
                : p.hid.big <= 7
                  ? 'Goes missing in big games'
                  : 'Handles pressure okay',
              p.hid.prof >= 15
                ? 'Consummate professional in training'
                : p.hid.prof <= 7
                  ? 'Questionable work ethic off the pitch'
                  : 'Decent attitude in training',
            ]
          : null,
      confidence: k >= 85 ? 'High' : k >= 55 ? 'Medium' : 'Low',
    };
    if (k >= 25) {
      const w = D.POS_W[p.pos];
      const rel = D.ATTRS.filter((a) => w[a] || ['pace', 'stamina', 'composure', 'workRate'].includes(a)).filter(
        (a) => p.pos === 'GK' || !['reflexes', 'handling'].includes(a),
      );
      const sorted = rel.slice().sort((a, b) => p.attrs[b] - p.attrs[a]);
      v.strengths = sorted
        .filter((a) => p.attrs[a] >= 14)
        .slice(0, 3)
        .map((a) => D.PHRASES[a][p.attrs[a] >= 17 ? 0 : 1]);
      v.weaknesses = sorted
        .reverse()
        .filter((a) => p.attrs[a] <= 8)
        .slice(0, 2)
        .map((a) => D.PHRASES[a][2]);
    }
    // Tactical fit against the user's current system
    const T = u.tactic,
      slots = D.FORMATIONS[T.formation];
    let bi = 0,
      bv = 0;
    slots.forEach((s, i) => {
      const e = W.effAt(p, s.t);
      if (e > bv) {
        bv = e;
        bi = i;
      }
    });
    v.fit = { slot: slots[bi].t, role: T.roles[bi], score: W.fitAt(p, slots[bi].t) };
    // Verdict relative to user squad level
    const lvl = Sc.level();
    if (!v.ca) v.verdict = 'Unknown — needs scouting';
    else {
      const c = (v.ca[0] + v.ca[1]) / 2,
        pa = v.pa ? (v.pa[0] + v.pa[1]) / 2 : c;
      if (c >= lvl + 4) v.verdict = 'Would walk into your first XI';
      else if (c >= lvl - 2) v.verdict = 'Good enough to compete for a starting place';
      else if (W.age(p) <= 23 && pa >= lvl + 6) v.verdict = 'One for the future — could become a star';
      else if (c >= lvl - 8) v.verdict = 'Useful squad depth';
      else v.verdict = 'Not at the required level';
    }
    // Moneyball: analytics department highlights undervalued output
    const club = W.userClub();
    if (club && club.facilities.analytics >= 3 && p.season.apps >= 4 && k >= 30) {
      const avg = p.season.rsum / p.season.apps;
      if (avg >= 7.0 && p.value < 4e6)
        v.moneyball = `Analytics flag: averaging ${avg.toFixed(2)} — output of a player worth far more than ${U.money(p.value)}.`;
    }
    v.fee = k >= 20 ? U.roundMoney(FM.Transfers.askPrice(p) * (1 + (rep ? rep.err * 0.1 * unc : 0))) : null;
    // Scout's grade + recommendation: what the scout believes (not the truth), set against what the club needs and can pay. A
    // good player the side does not need, or cannot afford, is one to watch, not one to sign.
    if (v.ca) {
      v.need = own ? null : Sc.need(p, caEst);
      const judge = (c, pa) => {
        let score = c - lvl + Math.max(0, pa - c) * Sc.potentialWeight(age) - (age >= 31 ? (age - 30) * 1.5 : 0);
        if (v.moneyball) score += 3;
        return { score, grade: score >= 4 ? 'A' : score >= -2 ? 'B' : score >= -8 ? 'C' : 'D' };
      };
      const recOf = (g, c, pa) => {
        if (own) return [null];
        if (p.loan) return ['Monitor'];
        if (age <= 21 && pa >= lvl + 4 && c < lvl - 3) return ['Loan'];
        if (g === 'A' || g === 'B') {
          const future = age <= 22 && pa >= lvl + 6;
          if (v.need && !v.need.helps && !future) return ['Monitor', 'covered'];
          if (p.clubId && club && v.fee != null && v.fee > club.budget) return ['Monitor', 'pricey'];
          return ['Sign'];
        }
        return [g === 'C' ? 'Monitor' : 'Avoid'];
      };
      const name = p.fn || p.ln;
      const Q = {
        A: [
          `${name} is the real deal. I'd move now before someone else does.`,
          `Best player I've watched this season. Don't hesitate.`,
          `He'd start for us tomorrow — and he's only getting better.`,
        ],
        B: [
          `A very good player. He'd push for a place straight away.`,
          `Solid, reliable, the kind of signing that wins you points.`,
          `I like him a lot. Worth a serious look.`,
        ],
        C: [
          `Decent — a squad option, not a game-changer.`,
          `He'd do a job, but I wouldn't break the bank.`,
          `Keep him on the list. Not a priority.`,
        ],
        D: [`Not for us, I'm afraid.`, `Honest pro, but not at our level.`, `I'd pass on this one.`],
      };
      // one scout's complete view of the player: his estimate, grade, advice and what he singled out
      const opinion = (sc, e) => {
        const j = judge(e.ca, e.pa),
          [rec, why] = recOf(j.grade, e.ca, e.pa);
        const nt = sc ? Sc.notice(sc, p) : null;
        let line = '';
        if (nt && k >= 25) {
          const a = nt.best,
            w = nt.worst;
          if (p.attrs[a] >= 13) line += ` ${D.PHRASES[a][p.attrs[a] >= 17 ? 0 : 1]}.`;
          if (p.attrs[w] <= 9 && w !== a)
            line += ` ${nt.lean === 'physical' ? 'But' : 'Though'} ${D.PHRASES[w][2].charAt(0).toLowerCase() + D.PHRASES[w][2].slice(1)}.`;
        }
        let quote =
          rec === 'Loan'
            ? `Not ready for our first team, but the talent is obvious. A loan with an eye on the future makes sense.`
            : Q[j.grade][U.hash(p.id + (sc ? sc.id : '')) % 3];
        quote += line;
        if (why === 'covered') quote += ` But we are well covered there: he would not improve the side.`;
        else if (why === 'pricey') quote += ` Trouble is, he is well out of our price range.`;
        else if (v.need && v.need.replaces && v.need.helps && (rec === 'Sign' || rec === 'Loan'))
          quote += ` He would push ${W.short(v.need.replaces)} for a place.`;
        return { scout: sc, grade: j.grade, rec, why, score: j.score, ca: e.ca, quote, lean: nt ? nt.lean : 'rounded' };
      };
      const ops = [opinion(scout, e1)];
      if (e2) ops.push(opinion(scout2, e2));
      // the verdict: one scout's, or the two averaged
      const j = judge(caEst, paEst),
        [rec, why] = recOf(j.grade, caEst, paEst);
      v.score = j.score;
      v.grade = j.grade;
      v.rec = rec;
      v.recWhy = why || null;
      v.pricey = why === 'pricey';
      v.opinions = ops;
      v.disagree = ops.length > 1 && Math.abs(ops[0].score - ops[1].score) >= 5;
      v.quote = e2 ? ops[0].quote : ops[0].quote;
      if (v.traits.includes('Big Game Player') && v.grade !== 'D') v.quote += ' Loves the big occasions, too.';
      if (v.injury && p.hid.inj >= 15) v.quote += ' My one worry is his fitness record.';
    } else {
      v.score = -99;
      v.grade = '?';
      v.rec = 'Scout';
    }
    Sc.deeper(p, v, k);
    return v;
  };
  // What scouting reveals, rung by rung (the report shows what the next rung will add)
  Sc.LADDER = [
    [10, 'an estimate of his ability'],
    [20, 'his stronger foot and second positions'],
    [25, 'an estimate of his potential'],
    [35, 'the role that suits him'],
    [40, 'his attributes, roughly'],
    [50, 'his personality'],
    [55, 'his injury history'],
    [60, 'his traits'],
    [65, 'his situation: happy, unsettled or on his way out'],
    [70, 'his exact attributes'],
    [75, 'hidden attributes: consistency, big games, professionalism'],
    [90, 'his mentality, his wage demands and his agent'],
  ];
  Sc.nextRung = (k) => Sc.LADDER.find(([at]) => at > k) || null;
  Sc.deeper = function (p, v, k) {
    if (k >= 20) {
      v.foot = p.foot;
      v.alt = W.canPlay(p).map(([t]) => W.altLabel(p, t));
    }
    if (k >= 35 && D.ROLES[p.pos]) v.role = FM.bestRole(p, p.pos);
    if (k >= 65) {
      const s = FM.S,
        M = FM.Market;
      v.situation = p.pre
        ? `Has agreed to join ${s.clubs[p.pre.c] ? s.clubs[p.pre.c].name : 'another club'} in the summer`
        : !p.clubId
          ? 'Looking for a club'
          : FM.Transfers.isSettled(p)
            ? 'Settled: he has only just signed or renewed'
            : M.wantsAway(p)
              ? 'Unsettled: he would welcome a move, and his club would sell'
              : p.contract <= s.year
                ? 'Running down his contract: a free in the summer, or a pre-contract now'
                : 'Content where he is';
    }
    if (k >= 90) {
      const h = p.hid,
        word = (x, hi, lo, mid) => (x >= 15 ? hi : x <= 6 ? lo : mid);
      v.mental = [
        word(h.amb, 'Driven to reach the top', 'Happy with his lot', 'Ambitious enough'),
        word(h.loy, 'Fiercely loyal to his club', 'Will go wherever suits him', 'Loyal, within reason'),
        word(h.temp, 'Ice-cool under provocation', 'A short fuse', 'Keeps his head most of the time'),
        word(h.lead, 'A natural leader', 'Keeps himself to himself', 'Talks on the pitch when needed'),
      ];
      const c = FM.S.user && FM.S.clubs[FM.S.user.clubId];
      if (c) v.wageAsk = FM.Transfers.wageDemand(p, c);
      v.agent = FM.Contracts.agentInfo(p);
    }
  };

  // Best targets across all reports, for the scouting home screen and the assistant
  Sc.recommendations = function (limit = 6) {
    const S = FM.S;
    return Object.keys(S.user.reports)
      .map((id) => S.players[id])
      .filter((p) => p && !W.ownPlayer(p) && !p.retired && Sc.scoutable(p))
      .map((p) => ({ p, v: Sc.view(p) }))
      .filter(({ v, p }) => ['A', 'B'].includes(v.grade) && (v.rec === 'Sign' || v.rec === 'Loan'))
      .sort((a, b) => b.v.score - a.v.score)
      .slice(0, limit);
  };
})();
