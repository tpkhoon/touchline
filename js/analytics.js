// Match analytics for your club: one compact row per competitive match (xG, shots, possession, chance types and
// goal times), kept for this season and the last, and league averages worked out from the league's results.
(function () {
  const FM = window.FM,
    W = FM.W;
  const An = (FM.Analytics = {});
  const S = () => FM.S;
  const r2 = (v) => Math.round(v * 100) / 100;

  An.TYPES = ['through', 'cross', 'cutback', 'longshot', 'counter', 'setpiece', 'penalty'];
  // After one of your matches: a row in this season's log
  An.record = function (fx, m, side) {
    const u = S().user,
      comp = S().comps[fx.comp];
    if (!u || !comp || comp.type === 'friendly') return;
    const res = fx.res || m.result(),
      o = 1 - side;
    // chance types: [shots, goals, xG] for and against
    const types = [side, o].map((k) => {
      const t = {};
      for (const [ty, v] of Object.entries(m.sides[k].types || {})) t[ty] = [v[0], v[1], r2(v[2])];
      return t;
    });
    (u.log = u.log || []).push({
      y: S().year,
      d: S().day,
      comp: fx.comp,
      opp: side === 0 ? fx.a : fx.h,
      home: side === 0,
      gf: side === 0 ? res.hg : res.ag,
      ga: side === 0 ? res.ag : res.hg,
      xf: res.xg[side],
      xa: res.xg[o],
      poss: res.poss[side],
      sh: [res.shots[side], res.shots[o]],
      sot: [res.sot[side], res.sot[o]],
      types,
      gm: res.goals.map((g) => [g.side === side ? 1 : 0, parseInt(g.min, 10) || 0]),
    });
  };
  An.newSeason = function () {
    const u = S().user;
    if (!u) return;
    u.logPrev = u.log || [];
    u.log = [];
  };
  // League averages per club per match (xG for, shots, possession is 50 by definition) from the league's results
  An.leagueAvg = function (compId) {
    const comp = S().comps[compId];
    let n = 0,
      xg = 0,
      sh = 0,
      sot = 0,
      g = 0;
    for (const f of (comp && comp.fixtures ? comp.fixtures.flat() : []).filter((f) => f && f.res && f.res.xg)) {
      n += 2;
      xg += f.res.xg[0] + f.res.xg[1];
      g += f.res.hg + f.res.ag;
      if (f.res.shots) sh += f.res.shots[0] + f.res.shots[1];
      if (f.res.sot) sot += f.res.sot[0] + f.res.sot[1];
    }
    return n ? { n: n / 2, xg: xg / n, g: g / n, sh: sh / n, sot: sot / n } : null;
  };
  // Per-club numbers in a league (xG for and against per match), for the league ranking
  An.leagueClubs = function (compId) {
    const comp = S().comps[compId],
      by = {};
    for (const f of (comp && comp.fixtures ? comp.fixtures.flat() : []).filter((f) => f && f.res && f.res.xg)) {
      for (const [id, i] of [
        [f.h, 0],
        [f.a, 1],
      ]) {
        const r = (by[id] = by[id] || { id, n: 0, xf: 0, xa: 0 });
        r.n++;
        r.xf += f.res.xg[i];
        r.xa += f.res.xg[1 - i];
      }
    }
    return Object.values(by).map((r) => ({ ...r, xf: r.xf / r.n, xa: r.xa / r.n }));
  };
  An.club = () => W.userClub();

  // ---------- The player profile (the Analyst view's player card) ----------
  // A player's numbers this season per 90 minutes, each as a percentile against the other players of his position who have played
  // enough (a place in the league, widening to the nation and the world when there are too few), what he is good and poor at in
  // words, and the players whose numbers are nearest his. Everything here is public (the season's statistics), not scouted.
  const MIN_MINS = 300; // below this the numbers say little
  const MIN_PEERS = 15;
  const M = {
    g90: ['g90', 'Goals', 'Attacking', (s, n) => s.goals / n, 2],
    xg90: ['xg90', 'Expected goals', 'Attacking', (s, n) => (s.xg || 0) / n, 2],
    sh90: ['sh90', 'Shots', 'Attacking', (s, n) => s.sh / n, 1],
    sotp: ['sotp', 'Shots on target', 'Attacking', (s) => (s.sh >= 5 ? s.sot / s.sh : null), 0, '%'],
    fin: ['fin', 'Goals beyond xG', 'Attacking', (s, n) => (s.goals - (s.xg || 0)) / n, 2],
    a90: ['a90', 'Assists', 'Creating', (s, n) => s.ast / n, 2],
    xa90: ['xa90', 'Expected assists', 'Creating', (s, n) => (s.xa || 0) / n, 2],
    kp90: ['kp90', 'Key passes', 'Creating', (s, n) => s.kp / n, 1],
    tk90: ['tk90', 'Tackles', 'Defending', (s, n) => s.tk / n, 1],
    ic90: ['ic90', 'Interceptions', 'Defending', (s, n) => s.ic / n, 1],
    csp: ['csp', 'Clean sheets', 'Defending', (s) => (s.apps ? s.cs / s.apps : null), 0, '%'],
    rt: ['rt', 'Average rating', 'Overall', (s) => (s.apps ? s.rsum / s.apps : null), 2],
    sv90: ['sv90', 'Saves', 'Goalkeeping', (s, n) => (s.sv || 0) / n, 1],
    svp: ['svp', 'Save percentage', 'Goalkeeping', (s) => (s.sv + s.ga > 0 ? s.sv / (s.sv + s.ga) : null), 0, '%'],
    gp90: ['gp90', 'Goals prevented', 'Goalkeeping', (s, n) => ((s.xga || 0) - (s.ga || 0)) / n, 2],
  };
  An.METRICS = {
    GK: [M.sv90, M.svp, M.gp90, ['csp', 'Clean sheets', 'Goalkeeping', M.csp[3], 0, '%'], M.rt],
    DEF: [M.tk90, M.ic90, M.csp, M.kp90, M.a90, M.g90, M.rt],
    MID: [M.g90, M.xg90, M.sh90, M.a90, M.xa90, M.kp90, M.tk90, M.ic90, M.rt],
    ATT: [M.g90, M.xg90, M.sh90, M.sotp, M.fin, M.a90, M.xa90, M.kp90, M.rt],
  };
  const grpOf = (p) => FM.D.POS_GROUP[p.pos] || p.pos;
  const valueOf = (m, s) => {
    const n = (s.mins || 0) / 90;
    return n > 0 ? m[3](s, n) : null;
  };
  let peerCache = {};
  // the players he is compared with: his position (then his group) in his league, widening to his nation and the world
  An.peers = function (p) {
    const S = S_(),
      c = p.clubId && S.clubs[p.clubId],
      g = grpOf(p),
      key = `${S.year}-${S.day}`;
    if (peerCache.key !== key || peerCache.S !== S)
      peerCache = {
        key,
        S,
        by: {},
        all: Object.values(S.players).filter((q) => q.clubId && !q.retired && q.season && q.season.mins >= MIN_MINS),
      };
    const ck = `${c ? c.comp : '-'}|${c ? c.nat : p.nat}|${p.pos}`;
    if (!peerCache.by[ck]) {
      const club = (q) => S.clubs[q.clubId],
        same = peerCache.all.filter((q) => grpOf(q) === g);
      const tries = [
        ['league', same.filter((q) => q.pos === p.pos && c && club(q) && club(q).comp === c.comp), true],
        ['league', same.filter((q) => c && club(q) && club(q).comp === c.comp), false],
        ['nation', same.filter((q) => c && club(q) && club(q).nat === c.nat), false],
        ['world', same, false],
      ];
      let pick = tries.find(([, list]) => list.length >= MIN_PEERS) || tries[3];
      const [scope, list, exact] = pick;
      const metrics = An.METRICS[g] || An.METRICS.MID,
        arrs = {};
      for (const m of metrics)
        arrs[m[0]] = list
          .map((q) => valueOf(m, q.season))
          .filter((v) => v != null)
          .sort((a, b) => a - b);
      peerCache.by[ck] = { scope, exact, n: list.length, list, arrs, metrics };
    }
    return peerCache.by[ck];
  };
  const S_ = () => FM.S;
  const pctOf = (arr, v) => {
    if (v == null || !arr.length) return null;
    let less = 0,
      eq = 0;
    for (const x of arr) {
      if (x < v - 1e-9) less++;
      else if (x <= v + 1e-9) eq++;
      else break;
    }
    return Math.round(((less + eq / 2) / arr.length) * 100);
  };
  const lc = (s) => s.charAt(0).toLowerCase() + s.slice(1); // (a label in the middle of a sentence: 'Goals beyond xG' becomes 'goals beyond xG')
  const GROUP_WORD = {
    Attacking: 'goals and shots',
    Creating: 'creating chances',
    Passing: 'passing',
    Defending: 'defending',
    Goalkeeping: 'shot-stopping',
  };
  An.profile = function (p) {
    const s = p.season || {},
      mins = s.mins || 0;
    if (mins < MIN_MINS) return { thin: true, mins, need: MIN_MINS };
    const pe = An.peers(p),
      rows = pe.metrics.map((m) => {
        const v = valueOf(m, s);
        return { k: m[0], label: m[1], group: m[2], dec: m[4], unit: m[5] || '', v, pct: pctOf(pe.arrs[m[0]], v) };
      });
    // in words: what he does best and worst (the rating is the sum of the rest, so it is left out)
    const body = rows.filter((r) => r.pct != null && r.k !== 'rt');
    const best = body
        .filter((r) => r.pct >= 80)
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 3),
      worst = body
        .filter((r) => r.pct <= 20)
        .sort((a, b) => a.pct - b.pct)
        .slice(0, 2);
    const top = (r) => `top ${Math.max(1, 100 - r.pct)}% for ${lc(r.label)}`,
      low = (r) => `bottom ${Math.max(1, r.pct)}% for ${lc(r.label)}`;
    let summary;
    if (best.length) {
      summary = `Stands out for ${GROUP_WORD[best[0].group] || best[0].group.toLowerCase()}: ${best.map(top).join(', ')}.`;
      if (worst.length) summary += ` Weaker on ${worst.map((r) => lc(r.label)).join(' and ')} (${low(worst[0])}).`;
    } else if (worst.length)
      summary = `Nothing stands out yet, and he is weak on ${worst.map((r) => lc(r.label)).join(' and ')} (${low(worst[0])}).`;
    else summary = 'A middle-of-the-road season by the numbers: nothing stands out and nothing is poor.';
    // the players whose numbers are nearest his (the distance between their percentile profiles)
    const use = rows.filter((r) => r.pct != null),
      pv = use.map((r) => r.pct);
    const sim = pe.list
      .filter((q) => q.id !== p.id)
      .map((q) => {
        let d = 0,
          c = 0;
        use.forEach((r, i) => {
          const m = pe.metrics.find((x) => x[0] === r.k),
            qp = pctOf(pe.arrs[r.k], valueOf(m, q.season));
          if (qp != null) {
            d += (qp - pv[i]) ** 2;
            c++;
          }
        });
        return { q, d: c >= use.length * 0.7 ? Math.sqrt(d / c) : 99 };
      })
      .filter((x) => x.d < 99)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .map((x) => ({ id: x.q.id, match: Math.round(100 - x.d) }));
    const current = p.shots && p.shots.length >= 8;
    return {
      thin: false,
      mins,
      rows,
      summary,
      similar: sim,
      scope: pe.scope,
      exact: pe.exact,
      n: pe.n,
      shots: current ? p.shots : p.shotsPrev || p.shots || [],
      shotsFrom: current ? 'this season' : p.shotsPrev && p.shotsPrev.length ? 'last season' : 'this season',
    };
  };

  // ---------- The team profile (the Analyst view's club card) ----------
  // A club's season in its league, per match: how much of the ball, the chances it makes and allows, how it presses, each ranked among the
  // league's clubs; what its style is in words (its tactic and what the numbers add to it); the formations it used; the run of its xG.
  // Worked out from the league's results (every match keeps its xG, shots and possession), so it works for any club in a league played in full.
  const MIN_PLAYED = 4;
  const ordinal = (n) => n + (['th', 'st', 'nd', 'rd'][((n % 100) >> 3) ^ 1 && n % 10 < 4 ? n % 10 : 0] || 'th');
  An.teamProfile = function (id) {
    const S = FM.S,
      c = S.clubs[id],
      comp = c && S.comps[c.comp];
    if (!comp || comp.type !== 'league' || !comp.fixtures)
      return { none: 'This club plays in no league with match details.' };
    const by = {};
    const rounds = comp.fixtures;
    rounds.forEach((rd, ri) => {
      for (const f of rd || []) {
        if (!f || !f.res || !f.res.xg || !f.res.shots || !f.res.poss || f.ko) continue;
        [0, 1].forEach((k) => {
          const cid = k ? f.a : f.h,
            r = (by[cid] = by[cid] || { n: 0, xf: 0, xa: 0, sh: 0, sha: 0, sot: 0, g: 0, ga: 0, poss: 0, run: [] });
          r.n++;
          r.xf += f.res.xg[k];
          r.xa += f.res.xg[1 - k];
          r.sh += f.res.shots[k];
          r.sha += f.res.shots[1 - k];
          r.sot += f.res.sot ? f.res.sot[k] : 0;
          r.g += k ? f.res.ag : f.res.hg;
          r.ga += k ? f.res.hg : f.res.ag;
          r.poss += f.res.poss[k];
          r.run.push([f.res.xg[k], f.res.xg[1 - k], ri]);
        });
      }
    });
    const mine = by[id];
    if (!mine || mine.n < MIN_PLAYED) return { thin: true, n: mine ? mine.n : 0, need: MIN_PLAYED };
    // tackles and interceptions per match, from the clubs' players (how much a side goes in for the ball)
    const da = {};
    for (const p of Object.values(S.players))
      if (p.clubId && by[p.clubId] && p.season)
        da[p.clubId] = (da[p.clubId] || 0) + (p.season.tk || 0) + (p.season.ic || 0);
    const rows = Object.entries(by)
      .filter(([, r]) => r.n >= MIN_PLAYED)
      .map(([cid, r]) => ({
        cid,
        poss: r.poss / r.n,
        xf: r.xf / r.n,
        xa: r.xa / r.n,
        sh: r.sh / r.n,
        sha: r.sha / r.n,
        sot: r.sot / r.n,
        g: r.g / r.n,
        ga: r.ga / r.n,
        q: r.sh ? r.xf / r.sh : 0,
        da: (da[cid] || 0) / r.n,
        fin: (r.g - r.xf) / r.n,
        diff: (r.xf - r.xa) / r.n,
      }));
    const me = rows.find((r) => r.cid === id),
      N = rows.length;
    // [key, label, higher is better, decimals, unit]
    const defs = [
      ['poss', 'Possession', true, 0, '%'],
      ['xf', 'Expected goals for', true, 2],
      ['sh', 'Shots', true, 1],
      ['sot', 'Shots on target', true, 1],
      ['q', 'Expected goals per shot', true, 2],
      ['g', 'Goals scored', true, 2],
      ['fin', 'Goals beyond expected', true, 2],
      ['xa', 'Expected goals against', false, 2],
      ['sha', 'Shots against', false, 1],
      ['ga', 'Goals conceded', false, 2],
      ['da', 'Tackles and interceptions', true, 1],
      ['diff', 'Expected goal difference', true, 2],
    ];
    const metrics = defs.map(([k, label, up, dec, unit]) => {
      const better = rows.filter((r) => (up ? r[k] > me[k] + 1e-9 : r[k] < me[k] - 1e-9)).length,
        rank = better + 1;
      return {
        k,
        label,
        v: me[k],
        dec,
        unit: unit || '',
        rank,
        of: N,
        pct: N > 1 ? Math.round(((N - rank) / (N - 1)) * 100) : 50,
        text: ordinal(rank),
      };
    });
    const m = (k) => metrics.find((x) => x.k === k);
    const radar = [
      ['Possession', m('poss').pct],
      ['Attack', m('xf').pct],
      ['Shot quality', m('q').pct],
      ['Defence', m('xa').pct],
      ['Pressing', m('da').pct],
      ['Finishing', m('fin').pct],
    ];
    // the style in words: the tactic first, then what the league table of numbers says
    const tac = W.isUser(id) ? S.user.tactic : c.tactic || {};
    const style =
      {
        Possession: 'a possession-based side',
        Short: 'a short-passing side',
        Direct: 'a direct side',
        Counter: 'a counter-attacking side',
        'Wing Play': 'a side that attacks down the flanks',
      }[tac.buildup] || 'a side';
    const press =
      { 'High Press': 'presses high', 'Mid Block': 'defends in a mid block', 'Low Block': 'defends deep' }[tac.press] ||
      '';
    const rankable = metrics
      .filter((x) => ['poss', 'xf', 'q', 'xa', 'da', 'fin', 'diff'].includes(x.k))
      .sort((a, b) => b.pct - a.pct);
    const strong = rankable.filter((x) => x.pct >= 75).slice(0, 2),
      weak = rankable.filter((x) => x.pct <= 25).slice(-1);
    const nm = (x) => x.label.charAt(0).toLowerCase() + x.label.slice(1);
    let summary = `${style.charAt(0).toUpperCase() + style.slice(1)}${press ? ' that ' + press : ''}${tac.formation ? ', in a ' + tac.formation : ''}.`;
    if (strong.length) summary += ` Strongest on ${strong.map((x) => `${nm(x)} (${x.text} of ${N})`).join(' and ')}.`;
    if (weak.length) summary += ` Weakest on ${nm(weak[0])} (${weak[0].text} of ${N}).`;
    if (!strong.length && !weak.length) summary += ' Close to the middle of the league on everything.';
    // the formations used this season
    const forms = Object.entries(c.forms || {}).sort((a, b) => b[1] - a[1]),
      total = forms.reduce((a, [, n]) => a + n, 0);
    // attack by kind of chance (your own club: each match keeps it)
    let mix = null;
    if (W.isUser(id) && S.user.log && S.user.log.length) {
      const o = {};
      for (const row of S.user.log)
        for (const [ty, v] of Object.entries(row.types[0] || {})) {
          o[ty] = o[ty] || [0, 0, 0];
          o[ty][0] += v[0];
          o[ty][1] += v[1];
          o[ty][2] += v[2];
        }
      const xt = Object.values(o).reduce((a, v) => a + v[2], 0);
      if (xt > 0)
        mix = Object.entries(o)
          .map(([ty, v]) => ({ ty, n: v[0], g: v[1], xg: v[2], share: v[2] / xt }))
          .sort((a, b) => b.share - a.share);
    }
    return {
      thin: false,
      n: mine.n,
      of: N,
      comp: comp.name,
      metrics,
      radar,
      summary,
      forms: forms.slice(0, 3).map(([f, n]) => ({ f, n, share: n / Math.max(1, total) })),
      run: mine.run,
      mix,
    };
  };
})();
