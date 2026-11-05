// @ts-check
// B teams and youth sides. A B team (a club's second side, "X B" or "X II") is a reserve side
// in the lower divisions: it can never go up into its parent's division or above, its players belong to the
// parent (who pays them and takes the fee if one is sold) and they move freely between the two. Every club in the
// full and light leagues also has U21 and U18 squads (p.team) that play in national youth leagues each league
// day, so young players outside the first-team squad still get games.
(function () {
  const FM = window.FM,
    U = FM.U,
    W = FM.W;
  const Y = (FM.Youth = /** @type {any} */ ({}));
  const S = () => FM.S;

  // ---------- B teams ----------
  Y.parentOf = (c) => c && c.parent && S().clubs[c.parent];
  Y.bTeamOf = (clubId) => Object.values(S().clubs).find((c) => c.parent === clubId) || null;
  // The club that pays a player and sells him: the parent for a B-team player
  Y.owner = (clubId) => {
    const c = clubId && S().clubs[clubId];
    return c && c.parent && S().clubs[c.parent] ? c.parent : clubId;
  };
  const tier = (compId) => (S().comps[compId] ? S().comps[compId].tier : 99);
  // Can this club go up into compId? Not a B team whose parent plays there or lower down.
  Y.canGoUp = (clubId, compId) => {
    const me = S().clubs[clubId];
    if (me && me.policy && me.policy.maxAge) return false; // (a national development side stays where it is)
    const p = Y.parentOf(me);
    return !p || !p.comp || tier(p.comp) < tier(compId);
  };
  // The league's table in order, with clubs that can't be promoted left out (auto promotion and play-off seeds)
  Y.promotable = (comp, rows) => rows.filter((r) => Y.canGoUp(r.id, comp.rules.promote.to));
  // After promotion and relegation: a B team now level with or above its parent drops a division, and the best
  // eligible club below goes up in its place (league sizes stay the same). Returns the extra moves made.
  Y.fixBTeams = function () {
    const s = S(),
      out = [];
    for (const b of Object.values(s.clubs)) {
      const p = Y.parentOf(b);
      if (!p || !b.comp || !p.comp || tier(b.comp) > tier(p.comp)) continue;
      const comp = s.comps[b.comp],
        down = comp.rules && comp.rules.relegate && comp.rules.relegate.to;
      if (!down || !s.comps[down]) continue;
      const lower = s.comps[down];
      // the best placed club still in the lower league (its table also lists the clubs just promoted out of it)
      const up = W.sortedTable(lower)
        .map((r) => r.id)
        .find(
          (id) =>
            id !== b.id &&
            s.clubs[id] &&
            s.clubs[id].comp === down &&
            Y.canGoUp(id, comp.id) &&
            !out.some((m) => m[0] === id),
        );
      if (!up) continue;
      out.push([b.id, comp.id, down], [up, down, comp.id]);
    }
    return out;
  };
  // Move a player between a parent and its B team (no transfer: the same contract and career spell)
  Y.move = function (p, toId) {
    if (!p || !S().clubs[toId]) return;
    W.moveWithin(p, toId);
    p.team = undefined;
    const u = S().user;
    if (u && u.tactic && u.tactic.lineup) u.tactic.lineup = u.tactic.lineup.map((x) => (x === p.id ? null : x));
  };
  // AI parents keep their B team stocked: surplus young players go down, B-team players good enough come up
  Y.rebalance = function () {
    const s = S();
    for (const b of Object.values(s.clubs)) {
      const p = Y.parentOf(b);
      if (!p || W.isUser(p.id)) continue;
      const first = W.squad(p.id).filter((q) => !q.loan),
        reserve = W.squad(b.id).filter((q) => !q.loan),
        target = W.squadTarget(p);
      const ranked = first.slice().sort((a, c) => c.ca - a.ca);
      // down: young players outside the parent's best 22 while the squad is over its size
      for (const q of ranked.slice(22).filter((x) => W.age(x) <= 22)) {
        if (W.squad(p.id).length <= target) break;
        if (W.squad(b.id).length >= W.squadTarget(b) + 4) break;
        Y.move(q, b.id);
      }
      // up: a B-team player better than the parent's 18th, while the parent has room
      const eighteenth = ranked[17] ? ranked[17].ca : 0;
      for (const q of reserve.filter((x) => x.ca > eighteenth + 2).sort((a, c) => c.ca - a.ca)) {
        if (W.squad(p.id).length >= target + 2) break;
        Y.move(q, p.id);
      }
    }
  };

  // ---------- U21 and U18 squads, and their leagues ----------
  Y.TEAMS = { u21: { label: 'U21', max: 21 }, u18: { label: 'U18', max: 18 } };
  Y.hasYouth = (c) => c && (c.sim === 'full' || c.sim === 'light') && !c.parent;
  // AI clubs (and yours, until you choose) put young players outside the first-team squad in the youth sides
  Y.assign = function (c, force) {
    if (!Y.hasYouth(c)) {
      // no youth sides here (a club that was fully simulated while you managed it keeps no youth tags)
      for (const p of W.squad(c.id)) if (p.team) p.team = undefined;
      return;
    }
    const mine = W.isUser(c.id) && !force; // your club: only players you haven't placed yourself
    const sq = W.squad(c.id).filter((p) => !p.loan),
      top = new Set(
        sq
          .slice()
          .sort((a, b) => b.ca - a.ca)
          .slice(0, 22)
          .map((p) => p.id),
      );
    for (const p of sq) {
      if (mine && p.teamSet && W.age(p) <= 21) continue; // (too old for the U21s: back to the first team)
      const a = W.age(p);
      p.team = top.has(p.id) || a > 21 ? undefined : a <= 18 ? 'u18' : 'u21';
    }
  };
  Y.assignAll = () => Object.values(S().clubs).forEach((c) => Y.assign(c));
  Y.squadOf = (clubId, team) => W.squad(clubId).filter((p) => p.team === team && !p.loan);
  // The brief a youth side plays under: who gets the games. Yours is set on the Academy tab (S.user.youthBrief, a side each); a youth-focused
  // AI club develops its youngsters, the rest play to win.
  //   win:     the strongest players play (the best results)
  //   develop: the players with the fewest games play first, so every youngster gets football
  //   minutes: young players of the first-team squad who are not playing play first (the Under-21s only), then the strongest
  Y.BRIEFS = {
    win: { label: 'Win matches', note: 'the strongest players play' },
    develop: { label: 'Develop youngsters', note: 'the players with the fewest games play first' },
    minutes: {
      label: 'Minutes for promoted players',
      note: 'young first-team players who are not playing get Under-21 games first',
    },
  };
  Y.briefOf = (clubId, team) => {
    const c = S().clubs[clubId];
    const mine = W.isUser(clubId) && S().user.youthBrief && S().user.youthBrief[team];
    if (mine && Y.BRIEFS[mine]) return mine;
    return c && c.identity === 'youth' ? 'develop' : 'win';
  };
  // ---------- Eligibility, call-ups and clashes ----------
  // The rules of the youth sides, kept simple and visible:
  //   Under-18s: players of 18 or under who have played ten senior games or fewer this season (more and he has outgrown them)
  //   Under-21s: players of 21 or under, and up to three overage players of 22 to 24 on the fringe of the first team (five senior games
  //     or fewer this season), who can play to find their fitness or minutes
  //   a call-up: a youth-side player named for the first team stays in his youth side (dual registration); the first team has priority,
  //     so he cannot play for his youth side the same matchday, and a player who has played a senior match that day cannot either
  //   B team: it may carry no more than three players of 23 or over
  Y.U18_SENIOR_MAX = 10;
  Y.OVERAGE_MAX = 3;
  Y.OVERAGE_GAMES = 5;
  Y.B_OVERAGE_MAX = 3;
  Y.rulesText = (team) =>
    team === 'u18'
      ? 'Players of 18 or under with ' +
        Y.U18_SENIOR_MAX +
        ' senior games or fewer this season. A call-up to the first team comes first.'
      : 'Players of 21 or under, and up to ' +
        Y.OVERAGE_MAX +
        ' overage players (22 to 24) on the fringe of the first team (' +
        Y.OVERAGE_GAMES +
        ' senior games or fewer). A call-up to the first team comes first.';
  Y.clash = function (p) {
    if (p.callup) return 'called up to the first team';
    if (p.lastSenior === S().day) return 'played for the first team today';
    return null;
  };
  // Why a youth-side player cannot play for his side now (null when he can)
  Y.eligible = function (p, team) {
    const a = W.age(p);
    if (team === 'u18') {
      if (a > 18) return 'too old for the Under-18s';
      if ((p.season.apps || 0) > Y.U18_SENIOR_MAX)
        return 'has played ' + U.plural(p.season.apps, 'senior game') + ', too many for the Under-18s';
    } else if (a > 21) return 'too old for the Under-21s';
    return Y.clash(p);
  };
  // First-team players who may play for the Under-21s as overage guests
  Y.overage = (clubId) =>
    W.squad(clubId)
      .filter(
        (p) =>
          !p.team &&
          !p.loan &&
          W.age(p) >= 22 &&
          W.age(p) <= 21 + (Y.OVERAGE_MAX + 0) &&
          (p.season.apps || 0) <= Y.OVERAGE_GAMES &&
          W.available(p) &&
          !Y.clash(p),
      )
      .sort((a, b) => b.ca - a.ca)
      .slice(0, Y.OVERAGE_MAX);
  Y.callUp = function (p) {
    if (!p.team) return { ok: false, msg: 'He is already in the first team.' };
    p.callup = !p.callup;
    return {
      ok: true,
      msg: p.callup
        ? W.short(p) + ' is called up for the next first-team match: he cannot play for his youth side that day.'
        : W.short(p) + ' is released back to his youth side.',
    };
  };
  // A B team carries no more than three players of 23 or over
  Y.canSendDown = function (p, bId) {
    if (W.age(p) < 23) return { ok: true };
    const old = W.squad(bId).filter((q) => !q.loan && W.age(q) >= 23).length;
    return old >= Y.B_OVERAGE_MAX
      ? {
          ok: false,
          msg:
            'A B team can carry only ' +
            Y.B_OVERAGE_MAX +
            ' players of 23 or over, and ' +
            S().clubs[bId].name +
            ' already has ' +
            old +
            '.',
        }
      : { ok: true };
  };
  // How good the club's youth coaching is, -1 (poor) to 1 (excellent): your coach's way with the young, or for another club its training ground
  Y.coachSkill = function (clubId) {
    const c = S().clubs[clubId];
    if (!c) return 0;
    if (W.isUser(clubId)) return U.clamp((FM.Staff.impact('coach').young - 1) / 0.15, -1, 1);
    return U.clamp((((c.facilities && c.facilities.training) || 2) - 3) / 2, -1, 1);
  };
  // The thirteen (eleven and two substitutes) who play a youth match for the club's side, under its brief. Your own pick, when you
  // have made one (S.user.youthPick), comes first; a better coach picks the strongest more reliably (a poor one is fooled by a
  // good training week)
  Y.matchSquad = function (clubId, team) {
    const brief = Y.briefOf(clubId, team);
    let pool = Y.squadOf(clubId, team).filter((p) => W.available(p) && !Y.eligible(p, team));
    if (team === 'u21' && pool.length < 13) pool = pool.concat(Y.overage(clubId)); // (overage guests, when the side is short)
    if (brief === 'minutes' && team === 'u21')
      pool = pool.concat(
        W.squad(clubId).filter(
          (p) => !p.team && !p.loan && W.age(p) <= 21 && (p.season.apps || 0) < 6 && W.available(p),
        ),
      );
    const sigma = 3 - 2.5 * Y.coachSkill(clubId),
      day = S().day;
    const fuzz = (p) => ((U.hash(p.id + day) % 2000) / 1000 - 1) * sigma * 1.7; // (the same all day, so the side stays the same)
    const by =
      brief === 'develop'
        ? (a, b) => (a.season.yapps || 0) - (b.season.yapps || 0) || b.pa - a.pa
        : brief === 'minutes'
          ? (a, b) => (a.team ? 1 : 0) - (b.team ? 1 : 0) || b.ca + fuzz(b) - (a.ca + fuzz(a))
          : (a, b) => b.ca + fuzz(b) - (a.ca + fuzz(a));
    // your own pick: the players you chose, who are fit and still in the pool, come first
    const picked = W.isUser(clubId) && S().user.youthPick && S().user.youthPick[team];
    if (picked && picked.length) {
      const chosen = picked.map((id) => pool.find((p) => p.id === id)).filter(Boolean);
      const rest = pool.filter((p) => !chosen.includes(p)).sort(by);
      return chosen.concat(rest).slice(0, 13);
    }
    return pool.sort(by).slice(0, 13);
  };
  // A youth side's level: its real players, topped up to eleven by the academy's general standard (clubs don't
  // carry full youth squads in the database; only the real players record appearances)
  const strength = (clubId, team) => {
    const c = S().clubs[clubId],
      real = Y.matchSquad(clubId, team)
        .slice(0, 11)
        .map((p) => p.ca);
    const base = W.levelFor(c.rep) - (team === 'u21' ? 16 : 24) + ((c.facilities && c.facilities.academy) || 2) * 2;
    while (real.length < 11) real.push(base);
    // youth football is streaky: each side has a good or bad year of its own, so the top academies don't win everything
    const yf = (S().youthForm = S().youthForm || {}),
      k = clubId + team;
    if (yf[k] === undefined) yf[k] = U.gauss(0, 4);
    return U.avg(real, (x) => x) + yf[k] + Y.coachSkill(clubId) * 1.5; // (good coaching is worth a point or two to a youth side)
  };
  // One round of every nation's youth leagues: clubs paired at random, a result from the two sides' level
  Y.round = function () {
    const s = S();
    s.youth = s.youth || {};
    const byNat = {};
    for (const c of Object.values(s.clubs)) if (Y.hasYouth(c)) (byNat[c.nat] = byNat[c.nat] || []).push(c.id);
    for (const nat in byNat) {
      for (const team of Object.keys(Y.TEAMS)) {
        const lg = ((s.youth[nat] = s.youth[nat] || {})[team] = s.youth[nat][team] || { table: {}, last: {} });
        const ids = U.shuffle(byNat[nat]);
        for (let i = 0; i + 1 < ids.length; i += 2) {
          const [h, a] = [ids[i], ids[i + 1]],
            sh = strength(h, team),
            sa = strength(a, team);
          const hg = U.poisson(Math.max(0.3, 1.45 + (sh - sa) / 38)),
            ag = U.poisson(Math.max(0.3, 1.2 + (sa - sh) / 38));
          for (const [id, gf, ga] of [
            [h, hg, ag],
            [a, ag, hg],
          ]) {
            const r = (lg.table[id] = lg.table[id] || { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });
            r.p++;
            r.gf += gf;
            r.ga += ga;
            if (gf > ga) (r.w++, (r.pts += FM.S.rules.win));
            else if (gf === ga) (r.d++, r.pts++);
            else r.l++;
          }
          lg.last[h] = { opp: a, gf: hg, ga: ag, home: true };
          lg.last[a] = { opp: h, gf: ag, ga: hg, home: false };
          // (a first-team call-up costs the side the player: the manager is told which of his went)
          if (W.isUser(h) || W.isUser(a)) {
            const mine = W.isUser(h) ? h : a;
            const away = Y.squadOf(mine, team).filter((p) => Y.clash(p));
            lg.last[mine].note = away.length
              ? away.map((p) => W.short(p) + ' (' + Y.clash(p) + ')').join(', ') + ' missed it.'
              : '';
          }
          // the players who played get a youth appearance (counted toward development)
          for (const id of [h, a]) Y.matchSquad(id, team).forEach((p) => (p.season.yapps = (p.season.yapps || 0) + 1));
        }
      }
    }
  };
  // (the day is done: the call-ups for it are spent)
  Y.clearCallups = () => Object.values(S().players).forEach((p) => p.callup && delete p.callup);
  Y.table = (nat, team) => {
    const lg = S().youth && S().youth[nat] && S().youth[nat][team];
    return lg ? W.sortedTable({ table: lg.table }) : [];
  };
  // The places in an academy: its level sets how many youngsters it can carry in the Under-18s and Under-21s
  Y.places = (c) => 12 + 4 * ((c.facilities && c.facilities.academy) || 2);
  Y.academyOf = (clubId) => W.squad(clubId).filter((p) => p.team && !p.loan);
  // The academy review at the start of a season: the youngsters at a decision (sixteen: a scholarship, eighteen: a first professional
  // deal, twenty-one: the last year of the Under-21s) and, when the academy is over its places, a prompt to make room. Their reports
  // are still a range, so a release is a judgement that can turn out wrong. Yours only: the AI clubs rebalance their sides.
  Y.review = function () {
    const uc = W.userClub();
    if (!uc || !Y.hasYouth(uc)) return;
    const sq = Y.academyOf(uc.id),
      places = Y.places(uc),
      over = Math.max(0, sq.length - places);
    const due = sq.filter((p) => {
      const a = W.age(p);
      return a === 16 || a === 18 || (a === 21 && p.contract <= S().year + 1);
    });
    if (!due.length && !over) return;
    FM.News.add({
      type: 'youth',
      review: true,
      title: 'Academy review: ' + U.plural(due.length, 'youngster') + ' at a decision',
      body:
        'The academy has ' +
        sq.length +
        ' of its ' +
        places +
        ' places' +
        (over ? ': ' + U.plural(over, 'place') + ' too many, so some must go to make room' : '') +
        '. Sixteen-year-olds are offered a scholarship, eighteen-year-olds a first professional deal, and the Under-21s are in their last year. The staff reports on the young ones are still a range: let go of one too early and he may come back to haunt you.',
      pids: due.map((p) => p.id),
      clubId: uc.id,
    });
  };
  // The academy report at the end of a season, for your club: how each side finished, who took the biggest step, who stood still, who is
  // now in the first team and who broke through this season. Run as the year turns, before the seasons' figures are cleared; it also
  // marks each young player's ability, for the next report to measure against.
  Y.seasonReport = function () {
    const s = S(),
      uc = W.userClub();
    if (!uc) return;
    const label = s.year - 1 + '/' + String(s.year).slice(2);
    const lines = [];
    for (const [team, def] of Object.entries(Y.TEAMS)) {
      const t = Y.table(uc.nat, team),
        i = t.findIndex((r) => r.id === uc.id);
      if (i >= 0)
        lines.push(
          def.label +
            ': ' +
            U.ordinal(i + 1) +
            ' of ' +
            t.length +
            ' (' +
            U.plural(t[i].w, 'win') +
            ', ' +
            U.plural(t[i].d, 'draw') +
            ', ' +
            U.plural(t[i].l, 'defeat') +
            ')',
        );
    }
    const b = Y.bTeamOf(uc.id),
      bc = b && s.comps[b.comp];
    if (bc && bc.table && bc.table[b.id]) lines.push(b.name + ': ' + U.ordinal(W.position(b.id)) + ' in ' + bc.name);
    const mine = W.squad(uc.id)
      .filter((p) => !p.loan)
      .concat(Object.values(s.players).filter((p) => p.loan && p.loan.from === uc.id && !p.retired));
    const young = mine.filter((p) => W.age(p) <= 21 && p.caStart != null);
    const groups = [];
    const add = (label2, ps) => ps.length && groups.push({ label: label2, pids: ps.slice(0, 4).map((p) => p.id) });
    add(
      'Took the biggest step',
      young.filter((p) => p.ca - p.caStart >= 3).sort((a, b2) => b2.ca - b2.caStart - (a.ca - a.caStart)),
    );
    add(
      'Stood still',
      young.filter((p) => W.age(p) <= 19 && p.ca - p.caStart <= 0).sort((a, b2) => b2.pa - a.pa),
    );
    add(
      'Broke into the first team',
      mine
        .filter((p) => p.youth === uc.id && !p.team && W.age(p) <= 21 && p.season.apps >= 15)
        .sort((a, b2) => b2.season.apps - a.season.apps),
    );
    add(
      'Made a first appearance',
      mine.filter((p) => p.youth === uc.id && !p.team && W.age(p) <= 21 && p.season.apps >= 1 && p.season.apps < 15),
    );
    const st = s.user.stats,
      debuts = (st.youthDebuts || 0) - (s.user.youthDebutsAtStart || 0);
    s.user.youthDebutsAtStart = st.youthDebuts || 0;
    if (debuts > 0) lines.push(U.plural(debuts, 'academy debut') + ' for the first team');
    if (lines.length || groups.length)
      FM.News.add({
        type: 'youth',
        report: true,
        title: 'Academy report ' + label,
        body: lines.length ? lines.join('. ') + '.' : 'A quiet year for the academy.',
        groups,
        clubId: uc.id,
      });
    for (const p of Object.values(s.players)) if (!p.retired && W.age(p) <= 23) p.caStart = p.ca;
  };
  // New season: fresh youth tables, squads re-sorted (B teams restocked too)
  Y.newSeason = function () {
    const s = S();
    s.youth = {};
    s.youthForm = {};
    Y.assignAll();
    Y.rebalance();
    Y.review();
  };
})();
