// World generation + player/club model helpers.
(function () {
  const FM = window.FM,
    U = FM.U,
    D = FM.D;
  const W = (FM.W = {});

  // ---------------- Player model ----------------
  W.age = (p) => FM.S.year - p.born;
  // (a one-word name, like a Brazilian footballer's, has no first name: his single name is in ln)
  // Names are stored given name first (fn) and family name (ln); a nation that writes the family name first shows it so
  // (Kim Min-jae, Wu Lei, Nguyễn Quang Hải), a Vietnamese player (Trần Văn Hiếu) is known by his given name, which his shirt carries too
  const famFirst = (p) => !!p.fn && !p.heritage && !!FM.D.FAMILY_FIRST && FM.D.FAMILY_FIRST.includes(p.nat);
  W.name = (p) => (famFirst(p) ? `${p.ln} ${p.fn}` : p.fn ? `${p.fn} ${p.ln}` : p.ln);
  W.short = (p) =>
    famFirst(p)
      ? p.nat === 'VIE'
        ? p.fn.split(' ').pop()
        : `${p.ln} ${p.fn[0]}.`
      : p.fn
        ? `${p.fn[0]}. ${p.ln}`
        : p.ln;
  W.shirt = (p) => (famFirst(p) && p.nat === 'VIE' ? p.fn.split(' ').pop() : p.ln);

  W.calcCA = function (p, pos = p.pos) {
    // a natural wing-back is judged on wing-back weights; anyone else in a wing-back slot as a full-back (the slot
    // asks the same of him, and the match engine is calibrated on it)
    const key = pos === 'WB' && p.pos !== 'WB' ? 'FB' : pos,
      w = D.RATE_W[key];
    let s = 0,
      t = 0;
    for (const k in w) {
      s += p.attrs[k] * w[k];
      t += w[k];
    }
    return Math.round((s / t) * 5 + (D.RATE_OFF[key] || 0));
  };
  W.refresh = function (p) {
    p.ca = W.calcCA(p);
    if (p.pa < p.ca) p.pa = p.ca; // generation rounding can nudge ability past potential
    p.value = W.value(p);
  };
  // Market value: what the player is worth on the market (fees, asking prices, release clauses, scouting).
  // The ability-and-age base (W.baseValue, which wages follow) scaled by where he plays, how much he is wanted and
  // his form: a player at a big club in a strong league costs more than the same player in a small league.
  W.value = function (p) {
    return Math.max(10000, U.roundMoney(W.baseValue(p) * W.marketFactor(p) * W.interestFactor(p) * W.formFactor(p)));
  };
  let leagueTop = null; // the top of each league's reputation band: how strong the league is
  W.marketFactor = function (p) {
    const c = p.clubId && FM.S.clubs[p.clubId];
    if (!c) return 0.8;
    leagueTop = leagueTop || Object.fromEntries(D.LEAGUES.map((l) => [l.id, l.repBand[0]]));
    const top = leagueTop[c.comp] || 60;
    return U.clamp((0.75 + (c.rep - 50) * 0.012) * (0.85 + (top - 60) * 0.008), 0.55, 1.5);
  };
  // Transfer interest: every rumour or bid adds to it; it halves each season
  W.interest = (p) => (p.buzz ? p.buzz * 0.5 ** (FM.S.year - (p.buzzY || FM.S.year)) : 0);
  W.addInterest = function (p, n = 1) {
    p.buzz = Math.round((W.interest(p) + n) * 100) / 100;
    p.buzzY = FM.S.year;
  };
  W.interestFactor = (p) => 1 + Math.min(0.3, W.interest(p) * 0.06);
  // Recent form (last matches' ratings): ±10–15%
  W.formFactor = (p) => (p.form && p.form.length >= 4 ? 1 + U.clamp((U.avg(p.form) - 6.7) * 0.15, -0.1, 0.15) : 1);
  // ---------- What a player is worth, and what he is paid ----------
  // Ability sets the price on an exponential curve (the best are worth disproportionately more); everything else is a smooth factor,
  // so a value never jumps on a birthday or the day a contract year turns over:
  //   age        flat to 27, then a gradual decline (an S-curve: 29 ≈ 0.95, 31 ≈ 0.76, 33 ≈ 0.52, 35 ≈ 0.34)
  //   potential  a youth premium that fades from 18 to 25 and grows with the gap between potential and ability
  //   contract   rises with the time left, levelling off at three or four years, with the steep part in the last year
  //   position   attackers sell for more, keepers for less
  // The whole scale is W.VALUE_SCALE: the world is fictional, so what matters is that values are in proportion to what clubs earn
  // (a top squad is worth one to two years of its revenue, a record fee a fraction of the richest club's income): wages are set
  // on the ability scale and do not move with it.
  W.VALUE_SCALE = 0.35;
  W.POS_VALUE = { ST: 1.2, W: 1.15, AM: 1.15, WM: 1.05, CM: 1, DM: 0.97, WB: 0.95, FB: 0.92, CB: 0.95, GK: 0.75 };
  W.ageCurve = (age) => (age <= 27 ? 1 : 1 / (1 + Math.pow((age - 27) / 6.2, 2.6)));
  W.youthPremium = (age, gap) => 1 + U.clamp((25 - age) / 7, 0, 1) * (0.3 + Math.max(0, gap) / 25);
  // The time left on his deal in seasons: a deal that ends this summer has what is left of this season
  W.contractLeft = function (p) {
    const S = FM.S,
      len = (S.calendar && S.calendar.length) || 0;
    return p.contract - S.year + (len ? 1 - S.day / len : 0.5);
  };
  W.contractFactor = (p) => (p.contract < FM.S.year ? 0.35 : 1 - 0.65 * Math.exp(-1.1 * W.contractLeft(p)));
  // On the ability scale, before the contract and the market: what wages follow
  W.abilityValue = function (p) {
    const age = W.age(p);
    let v = 1000 * Math.pow(1.13, p.ca) * W.ageCurve(age) * W.youthPremium(age, p.pa - p.ca);
    if (p.hid.cons >= 15) v *= 1.05;
    return v;
  };
  W.baseValue = (p) => W.abilityValue(p) * W.contractFactor(p) * (W.POS_VALUE[p.pos] || 1) * W.VALUE_SCALE;
  // Star ratings are measured against the league you manage in (see W.stars below). A Championship regular is four or five stars
  // in League Two and two or three in the top flight. (The old absolute scale is W.starsAbs.) Out of work: the league
  // you last managed in, or the top flight.
  W.starsAbs = (ca) => U.clamp(Math.round(((ca - 30) / 55) * 10) / 2, 0.5, 5);
  W.refComp = function () {
    const S = FM.S,
      c = S && S.user && S.user.clubId && S.clubs[S.user.clubId];
    if (c && c.comp) {
      S.user.lastComp = c.comp;
      return c.comp;
    }
    return (S && S.user && S.user.lastComp) || 'D1';
  };
  // (one entry per league: work-permit checks ask about three leagues in turn, thousands of times a season)
  let lvlCache = { stamp: null, S: null, v: new Map() };
  // What a typical starter in a league is worth: the best eleven of each club, averaged over the league
  W.leagueLevel = function (compId) {
    const S = FM.S,
      stamp = `${S.year}.${Math.floor(S.day / 10)}`;
    if (lvlCache.stamp !== stamp || lvlCache.S !== S) lvlCache = { stamp, S, v: new Map() };
    if (lvlCache.v.has(compId)) return lvlCache.v.get(compId);
    const comp = S.comps[compId];
    let v = 0;
    if (comp && comp.clubs && comp.clubs.length) {
      const xs = comp.clubs.map((id) => {
        const top = W.squad(id)
          .map((p) => p.ca)
          .sort((a, b) => b - a)
          .slice(0, 11);
        return top.length ? U.avg(top) : 0;
      });
      v = U.avg(xs.filter((x) => x > 0));
    }
    v = v || 66;
    lvlCache.v.set(compId, v);
    return v;
  };
  // Stars are a player measured against the regular starters of the league you manage in, at his own end of the pitch:
  // keepers against keepers, defenders against defenders, and so on (strikers' ability numbers run lower than keepers',
  // so one scale for everyone made a typical striker look like a worse player than a typical keeper). Each league's
  // own spread sets the size of a star: a star is a little under one standard deviation of its starters' ability,
  // so a division where everyone is close together still has its best and worst players, and 3 stars is a typical
  // starter, five the best few in the league, two a fringe player.
  W.STAR_GROUPS = {
    GK: 'GK',
    CB: 'DEF',
    FB: 'DEF',
    WB: 'DEF',
    DM: 'MID',
    CM: 'MID',
    WM: 'MID',
    AM: 'MID',
    W: 'ATT',
    ST: 'ATT',
  };
  W.STAR_CENTER = 3.1; // the stars of a player exactly at his league's average starter
  W.STAR_SLOPE = 0.85; // stars per standard deviation
  W.STAR_MIN_SD = 3.5; // a very tight league does not turn small differences into big ones
  let refCache = { stamp: null, S: null, by: new Map() };
  // The ability of a league's starters, overall and by group: { mean, sd, n } for GK, DEF, MID, ATT and ALL
  W.starRef = function (compId) {
    const S = FM.S,
      stamp = `${S.year}.${Math.floor(S.day / 10)}`;
    if (refCache.stamp !== stamp || refCache.S !== S) refCache = { stamp, S, by: new Map() };
    if (refCache.by.has(compId)) return refCache.by.get(compId);
    const comp = S.comps[compId],
      lists = { GK: [], DEF: [], MID: [], ATT: [], ALL: [] };
    if (comp && comp.clubs)
      for (const id of comp.clubs) {
        // the players who would start for the club: its eleven, in whatever shape it plays (who a club starts is who
        // the league's regulars are, so each group is measured against the players who really fill it)
        const club = S.clubs[id];
        for (const p of W.pickXI(id, W.isUser(id) ? S.user.tactic : club.tactic).xi) {
          const g = p && W.STAR_GROUPS[p.pos];
          if (g) {
            lists[g].push(p.ca);
            lists.ALL.push(p.ca);
          }
        }
      }
    const out = {};
    for (const g in lists) {
      const a = lists[g],
        n = a.length,
        mean = n ? a.reduce((t, x) => t + x, 0) / n : 66,
        sd = n > 1 ? Math.sqrt(a.reduce((t, x) => t + (x - mean) ** 2, 0) / (n - 1)) : 6;
      out[g] = { mean, sd: Math.max(W.STAR_MIN_SD, sd), n };
    }
    refCache.by.set(compId, out);
    return out;
  };
  // How many points of ability make one star in the league you manage in (a wider league needs more)
  W.starStep = () => W.starRef(W.refComp()).ALL.sd / W.STAR_SLOPE;
  // Stars (0.5–5) for an ability value, in a position (any position of the pitch; without one, against all starters)
  W.stars = function (ca, pos) {
    const ref = W.starRef(W.refComp()),
      g = pos && W.STAR_GROUPS[pos],
      r = g && ref[g].n >= 8 ? ref[g] : ref.ALL;
    return U.clamp(Math.round((W.STAR_CENTER + (W.STAR_SLOPE * (ca - r.mean)) / r.sd) * 2) / 2, 0.5, 5);
  };
  // How well a player fits a slot (0–1): his natural position's table, or a second position he has learned
  // (p.alt). Given the slot itself, its side counts on the flanks: a full-back or wing-back is at home on the side
  // of his stronger foot, a winger too unless his role cuts inside (inv), when he wants the other flank.
  W.SIDE_FIT = 0.93; // full-back or wing-back on his weaker side
  W.SIDE_FIT_W = 0.95; // winger on the side his role doesn't want
  W.fitAt = (p, slotType, slot, role) => {
    let f = (D.FIT[p.pos] && D.FIT[p.pos][slotType]) || (p.pos === slotType ? 1 : 0.4);
    if (p.alt && p.alt[slotType] > f) f = p.alt[slotType];
    if (slot && (slotType === 'FB' || slotType === 'WB' || slotType === 'W' || slotType === 'WM')) {
      const side = D.slotSide(slot);
      if (side) {
        // a full-back, winger or wide midfielder has a natural side (LB/RB, LW/RW, LM/RM); the other flank costs
        // him, unless he is two-footed. A winger on an inverted role likes the side of his weaker foot instead.
        const nat = W.side(p),
          wide = slotType === 'W' || slotType === 'WM';
        const inv = wide && role && (D.ROLES[slotType][role] || {}).inv;
        const want = inv && p.foot !== 'Both' ? (p.foot === 'Left' ? 'R' : 'L') : nat;
        if (nat && p.foot !== 'Both' && side !== want) f *= wide ? W.SIDE_FIT_W : W.SIDE_FIT;
      }
    }
    return f;
  };
  // A full-back's, winger's or wide midfielder's natural side: chosen when he is made (mostly his stronger foot;
  // wingers are often inverted), or worked out once from his foot for older saves
  W.FLANK = ['FB', 'WB', 'WM', 'W'];
  W.side = function (p) {
    if (!W.FLANK.includes(p.pos)) return '';
    if (!p.side) {
      const h = (parseInt(String(p.id).replace(/\D/g, ''), 10) || 0) % 100;
      const strong = p.foot === 'Left' ? 'L' : p.foot === 'Right' ? 'R' : h % 2 ? 'L' : 'R';
      const keep = p.pos === 'W' ? 60 : p.pos === 'WM' ? 72 : 85; // share on their stronger foot's side
      p.side = h < keep ? strong : strong === 'L' ? 'R' : 'L';
    }
    return p.side;
  };
  // What his position is called: LB/RB, LWB/RWB, LM/RM and LW/RW on the flanks, the rest as they are
  const FLANK_LABEL = { FB: 'B', WB: 'WB', WM: 'M', W: 'W' };
  W.posLabel = (p) => (FLANK_LABEL[p.pos] ? W.side(p) + FLANK_LABEL[p.pos] : p.pos);
  // Everywhere else he can play: a position he has learned to 0.8 or better, or one his own position fits at 0.9 or
  // better (a full-back at wing-back, a winger at wide midfield), best first. Under 0.9 he is still learning it.
  W.canPlay = function (p) {
    if (p.pos === 'GK') return [];
    return D.POS.filter((t) => t !== p.pos && t !== 'GK')
      .map((t) => [t, W.fitAt(p, t)])
      .filter(([t, f]) => f >= ((p.alt && p.alt[t]) >= 0.8 ? 0.8 : 0.9))
      .sort((a, b) => b[1] - a[1]);
  };
  // How at home he is in a position, in words (his familiarity: natural, accomplished, competent, unconvincing, awkward)
  W.famLabel = (f) =>
    f >= 0.97 ? 'natural' : f >= 0.9 ? 'accomplished' : f >= 0.8 ? 'competent' : f >= 0.65 ? 'unconvincing' : 'awkward';
  // Every position he can fill at all: [{ t, fit, fam, ovr }], best first; ovr = his overall there, less the cost of it
  W.positionTable = function (p, min = 0.65) {
    if (p.pos === 'GK') return [];
    return D.POS.filter((t) => t !== 'GK')
      .map((t) => {
        const fit = W.fitAt(p, t);
        return { t, fit, fam: W.famLabel(fit), ovr: Math.round(W.calcCA(p, t) * (0.62 + 0.38 * fit)) };
      })
      .filter((x) => x.fit >= min)
      .sort((a, b) => b.fit - a.fit || b.ovr - a.ovr);
  };
  // A second position as he'd be listed there: LWB for a left-back, LM for a left winger
  W.altLabel = (p, t) => (FLANK_LABEL[t] && FLANK_LABEL[p.pos] ? W.side(p) + FLANK_LABEL[t] : t);
  // Second positions (p.alt, how well he plays there, 0–1). A third of outfield players start with one, a few
  // with two, and about one in eight is a utility player with up to three. They come from the positions next to
  // his own (the FIT table: a centre-back covers at holding midfield, a winger at wide midfield or up front, a
  // full-back at wing-back), a little better than a stranger's fit; playing there teaches more (Sea.learnPositions).
  W.UTILITY = 0.12;
  W.genAlt = function (p) {
    if (p.pos === 'GK') return;
    const utility = Math.random() < W.UTILITY,
      has = Math.random() < 0.35;
    if (!utility && !has) return;
    const near = Object.entries(D.FIT[p.pos] || {}).filter(([t, f]) => t !== p.pos && f >= 0.7);
    const n = utility ? U.randi(2, 3) : Math.random() < 0.25 ? 2 : 1;
    // the closer positions are the likelier second ones
    const picked = [];
    while (picked.length < n && near.length > picked.length) {
      const rest = near.filter(([t]) => !picked.includes(t));
      picked.push(U.wpick(rest, ([, f]) => f * f * f)[0]);
    }
    for (const t of picked) {
      const base = D.FIT[p.pos][t];
      (p.alt = p.alt || {})[t] =
        Math.round(Math.min(utility ? 0.98 : 0.96, base + U.rand(0.05, utility ? 0.18 : 0.13)) * 100) / 100;
    }
  };
  // His overall in a slot: his ability at that position, less what playing out of position costs him (his own position
  // and any he has learned: no cost). The number on the pitch, so an improvised full-back reads lower than the same
  // player in his own place. (Fitness and morale are form, not ability, and are left out.)
  W.slotOverall = (p, slotType, slot, role) =>
    Math.round(W.calcCA(p, slotType) * (0.62 + 0.38 * W.fitAt(p, slotType, slot, role)));
  W.effAt = function (p, slotType, slot, role) {
    const fit = W.fitAt(p, slotType, slot, role);
    return W.calcCA(p, slotType) * (0.62 + 0.38 * fit) * (0.8 + 0.2 * (p.fitness / 100)) * (0.95 + p.morale / 1000);
  };
  // (a player doing military service is away unless he is with the army's club)
  W.available = (p) => !p.inj && !p.susp && !p.retired && (!p.service || !!(p.loan && p.loan.military));
  // Selection weight for match fitness: fresh players are preferred, tired ones rested
  W.fitnessPick = (p) => {
    const f = p.fitness;
    return f >= 90 ? 1 : f >= 75 ? 1 - (90 - f) * 0.008 : 0.88 - (75 - f) * 0.016;
  };
  W.hasTrait = (p, t) => p.traits.includes(t);
  W.personality = function (h) {
    if (h.prof >= 16 && h.amb >= 13) return 'Model Professional';
    if (h.loy >= 16) return 'Loyal Servant';
    if (h.amb >= 16 && h.loy <= 8) return 'Mercenary';
    if (h.temp <= 5) return 'Volatile';
    if (h.prof <= 6) return 'Laid Back';
    if (h.amb >= 16) return 'Ambitious';
    if (h.prof >= 15) return 'Professional';
    return 'Balanced';
  };
  W.moraleLabel = (m) =>
    m >= 85
      ? ['Superb', 'grin']
      : m >= 70
        ? ['Good', 'smile']
        : m >= 50
          ? ['Okay', 'neutral']
          : m >= 30
            ? ['Poor', 'unsure']
            : ['Very Poor', 'angry'];

  function genAttrs(pos, nat, target) {
    const b = target / 5,
      w = D.POS_W[pos],
      bias = D.NATIONS[nat].bias,
      a = {};
    for (const k of D.ATTRS) {
      const wt = w[k] || 0;
      let mean = wt >= 1.5 ? b + 1.2 : wt > 0 ? b : b - 2.5;
      if ((k === 'reflexes' || k === 'handling') && pos !== 'GK') mean = U.rand(1, 4);
      if (pos === 'GK' && k === 'vision') mean = b - 4;
      a[k] = U.clamp(U.gauss(mean, 1.8) + (bias[k] || 0) * (pos === 'GK' && !wt ? 0.3 : 1), 1, 20);
      const lim = pos === 'GK' && D.GK_OUTFIELD[k];
      if (lim) a[k] = U.rand(lim[0], lim[1]); // a keeper's finishing, tackling, dribbling: a keeper's
    }
    const tmp = { attrs: a };
    for (let i = 0; i < 4; i++) {
      const diff = (target - W.calcCA(tmp, pos)) / 5;
      for (const k in w) a[k] = U.clamp(a[k] + diff, 1, 20);
    }
    // (two decimals: sixteen of them made the players 30 MB of a 33 MB state, and copying that is what costs time and memory)
    for (const k in a) a[k] = Math.round(a[k] * 100) / 100;
    return a;
  }

  // The traits added after the first dozen: what the player is made of (his attributes and hidden character) decides
  // which of them he can have. Also used once on older saves, which are given them on load.
  W.rollNewTraits = function (p, t) {
    const h = p.hid,
      A = p.attrs,
      age = W.age(p),
      add = (name, ok, chance = 1) => ok && !t.includes(name) && U.chance(chance) && t.push(name);
    add('Engine', A.stamina >= 14, 0.5);
    add(
      'Set-Piece Expert',
      p.pos !== 'GK' && Math.max(...['pen', 'fk', 'cor'].map((k) => FM.Matchday.spScore(p, k))) >= 13.5,
      0.5,
    );
    add('Clutch', h.big >= 12 && A.composure >= 12, 0.5);
    add('Aerial Threat', A.strength >= 13 && A.positioning >= 10 && ['ST', 'CB'].includes(p.pos), 0.6);
    add('Hatchet Man', h.temp <= 10 && A.tackling >= 11 && ['DM', 'CB', 'CM', 'FB', 'WB'].includes(p.pos), 0.5);
    add('Slow Starter', true, 0.04);
    add('Cup Specialist', h.big >= 13, 0.1);
    add('Big-Match Nerves', h.big <= 4);
    add('Model Professional', h.prof >= 17);
    add('Low Work Ethic', h.prof <= 4);
    add('Versatile', true, 0.05);
    add('Mentor', age >= 29 && h.lead >= 13 && h.prof >= 13, 0.5);
    add('Homesick', h.loy >= 13 && h.amb <= 8, 0.5);
    add('Needs Game Time', h.temp <= 7 && h.amb >= 13, 0.5);
    return t;
  };

  function genTraits(p) {
    const h = p.hid,
      t = [];
    if (h.inj >= 16) t.push('Injury Prone');
    if (h.loy >= 16) t.push('Loyal');
    else if (h.amb >= 15 && h.loy <= 7) t.push('Mercenary');
    if (h.lead >= 16) t.push('Leader');
    if (h.temp <= 4) t.push('Temperamental');
    if (h.big >= 17) t.push('Big Game Player');
    if (h.cons >= 17) t.push('Consistent');
    if (U.chance(0.08)) t.push('Late Bloomer');
    if (U.chance(0.07)) t.push('Media Friendly');
    if (U.chance(0.05)) t.push('Derby Specialist');
    if (U.chance(0.06)) t.push('Fair-Weather');
    if (p.attrs.dribbling >= 14 && U.chance(0.25)) t.push('Flair');
    W.rollNewTraits(p, t);
    return U.shuffle(t).slice(0, 3);
  }

  // Every full name in the world (active + retired legends), rebuilt when a different save is loaded
  let nameSet = null,
    nameWorld = null;
  W.nameTaken = function (n) {
    if (nameWorld !== FM.S) {
      nameWorld = FM.S;
      nameSet = new Set(
        Object.values(FM.S.players || {})
          .map((q) => `${q.fn} ${q.ln}`)
          .concat((FM.S.retired || []).map((r) => `${r.fn} ${r.ln}`)),
      );
    }
    return nameSet.has(n);
  };
  W.claimName = (n) => {
    W.nameTaken(n);
    nameSet.add(n);
  };
  // Real players' names the generator must not make (a fictional player named like a real one). Kept as hashes of the lower-case name
  // (a 53-bit hash), so the game carries no list of real people: it can only recognise a name it is asked about.
  const nameHash = (str) => {
    let h1 = 0xdeadbeef,
      h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  };
  const REAL_NAME_HASHES = new Set([
    12995083506132, 45485239864087, 79325753345652, 110775110442088, 112567415447933, 116792303564227, 121442416193223,
    125759145650391, 131533890000151, 142184139675824, 149885569491070, 165579031563852, 172937874131788,
    176777212112549, 181898825414705, 196551253366271, 196556564186080, 206488007154298, 214543692057889,
    215250797178646, 217645167687439, 219867976978197, 222077368115081, 222838287235885, 245781445390902,
    248371283152726, 259797017646458, 263979927688442, 267814699573044, 299085954400259, 306630967273478,
    323762080249327, 332055532494162, 342198087021114, 367898431531633, 369589360107193, 377706097078262,
    379720980619615, 392907455092664, 394949732519664, 400669323732995, 433595956358099, 446448298005510,
    466844522761456, 469464272706164, 471321332135429, 483759900669653, 497855457444483, 501188977353211,
    506407259682526, 507990807232878, 508557836189403, 511095952380310, 511274532768564, 516020374951599,
    518123655815311, 519674763205878, 546421216733006, 547723827200124, 561516678865220, 566144267262640,
    568709335986115, 570378433236306, 570968207127999, 570986989313047, 581000086103987, 590275923968753,
    600217283089227, 608403667710091, 609128250539064, 610447875287659, 614717414603115, 617322427317128,
    626151745099061, 634486478215270, 638843551113571, 639216746787362, 645088015278777, 657547417156754,
    667704976957323, 679021122206931, 681714976118878, 684858169031157, 702796909223873, 708281187072570,
    715262552013151, 727147468925307, 733657574941937, 743334780205748, 744791523193044, 760997405620561,
    762981711571250, 766911308773409, 786430358395144, 787308039204704, 799507643303750, 799785352081656,
    809212568334664, 814334649700319, 815246836166953, 838669935608142, 842846149528531, 852394625308710,
    874623929176212, 883060841645912, 889319075319534, 893782105625408, 898302372208716, 913058270404774,
    916827894057616, 939252775279185, 950520625374662, 964816938773830, 970961651891475, 988012153535502,
    989318533864983, 1015248454436979, 1020635244186749, 1040899517486859, 1048618955232625, 1066710499824993,
    1067855965432802, 1080449197579060, 1090780153348395, 1091192735347602, 1101898221979417, 1106057820624869,
    1111602531349976, 1111915007644951, 1112648771451824, 1136600217078474, 1137145126461839, 1137658179361958,
    1142473529992186, 1142801256596644, 1156770422949528, 1166908554515852, 1169114451496289, 1176012290595556,
    1180041000603935, 1199757789941911, 1207024046030194, 1211608883499372, 1222683146698120, 1229632123441033,
    1230239788937243, 1235559393169035, 1238841738871111, 1243285831921844, 1259797917041607, 1274903890170176,
    1293019493377514, 1297977000709875, 1300696010241648, 1312190866720863, 1326170155278401, 1341687449261621,
    1354546005789278, 1356248941581838, 1359449119849144, 1361358597934248, 1367739694136319, 1369430580155466,
    1380631049642959, 1386727666412637, 1387011494685014, 1394947664966272, 1397687173098575, 1399493902099965,
    1404864275962063, 1405210955074202, 1418064760025661, 1423086078792878, 1425164080542475, 1428290751152179,
    1431975948954969, 1438025288529019, 1452740062562375, 1463912826609281, 1464097328457324, 1471070050532706,
    1474206736035218, 1474940468871337, 1477871994177827, 1482334111575723, 1498194206406372, 1500767294295624,
    1504576306375829, 1506151991856656, 1511287880269093, 1513574398733495, 1523457096647278, 1525062844110609,
    1528639598007372, 1529743638730927, 1536637685696227, 1538978011335193, 1548010109326571, 1560519440257271,
    1568701515360815, 1591628375394551, 1593730315137270, 1611747926543436, 1637556489014018, 1641098487197985,
    1656861061463503, 1667981254424360, 1676612501386651, 1691620021426363, 1694771158840476, 1697602903922311,
    1710662290384139, 1731414694418107, 1734158065102993, 1743435188739651, 1774890824701756, 1775012834035408,
    1781276524343822, 1785609937583128, 1789544301949492, 1795598512433962, 1803349275192651, 1809782067839715,
    1816289513503501, 1816548169083643, 1817100363861582, 1817285540385867, 1832674076826027, 1863856445931450,
    1893808164140214, 1894208243636268, 1906638916491375, 1910078661368456, 1930451618186383, 1938723919376009,
    1942061862896158, 1943710637746944, 1950217172019297, 1954379900888804, 1954533720532834, 1954826084709324,
    1965065703246822, 1977857636059930, 1988223566180081, 1988721746127429, 1997565990042856, 2003022842233829,
    2008769004097248, 2030688158549071, 2031109891675149, 2041806218998338, 2051612686462781, 2068226197960490,
    2072038720590102, 2082197950131052, 2082834700985514, 2087548722328177, 2091503799073739, 2098517170944695,
    2099792830982295, 2119616351940821, 2126723846701039, 2153507970261626, 2156790480283008, 2171548309379991,
    2177366559962182, 2178846825367952, 2186495981435428, 2208404975549072, 2214404286262658, 2222027400668196,
    2223372029972251, 2238141777658267, 2244620986154701, 2264099469360910, 2264402949136840, 2274173114626434,
    2276563712459778, 2287145597286391, 2294530998966855, 2304060137341040, 2344149229054180, 2347079184643792,
    2372272925434228, 2380280581306462, 2388576932376608, 2390868853790270, 2391533706525484, 2397048640929747,
    2399278046904372, 2409923260302692, 2411038517150796, 2422980776537651, 2424562262319486, 2428404122718630,
    2435080876215535, 2438365427240644, 2454806098617644, 2462437376863704, 2475641940213316, 2481715096029121,
    2485431214386828, 2489471368902191, 2494922829136923, 2508114680468104, 2512682034259112, 2522100215855944,
    2525030728682249, 2534054525042985, 2551933380281823, 2554028909050262, 2572092246920896, 2575572685267722,
    2584545855760384, 2595313764838294, 2599321468385423, 2599451908636394, 2602261564816586, 2605903701558625,
    2606938961406867, 2614583356337246, 2620645622967968, 2628026410362935, 2635121910499728, 2646182756190842,
    2661659115757270, 2686939695713124, 2688168474451963, 2688504628358347, 2691572215031533, 2698731217014477,
    2706887405974291, 2713683064126173, 2729515613912572, 2729730185217590, 2731881942334311, 2733447796437369,
    2738188207439708, 2742864270716553, 2746942593837949, 2752796547030264, 2763347906384718, 2769900305801702,
    2778695538021070, 2778808556392116, 2789329551087786, 2791431138120669, 2795628752166585, 2803063006062455,
    2806987932644331, 2839404486047078, 2848195852451001, 2856122091627053, 2858177058385431, 2877597538164827,
    2886412346572321, 2893398735395824, 2916409601435655, 2923559563091904, 2927099179847141, 2930967948582666,
    2931698873232033, 2937944805792694, 2949331341454599, 2952868134097320, 2954536819956352, 2955348870540945,
    2998330039681203, 3003831084258881, 3007722273592596, 3014114687677070, 3015870478858566, 3017150187473762,
    3038416317862343, 3041493561258305, 3049637583298802, 3058209778421208, 3082631768231106, 3100408790048042,
    3101552137384089, 3113364500127222, 3120593122430236, 3120665493575814, 3124808225671722, 3125310150161013,
    3145990911804034, 3148275987950447, 3155241265466401, 3158176927526988, 3167360271663831, 3168825160773608,
    3178265482952330, 3181020963466640, 3190543873636231, 3194063439392404, 3208083747509805, 3230709798342324,
    3231836046833596, 3240246499473123, 3242902653829863, 3246058100844037, 3259640866257283, 3263837332821780,
    3264116401146629, 3270509552148961, 3271155066009428, 3272588910151691, 3278542286643162, 3295628697930509,
    3299116721486656, 3300215315471375, 3314965805287855, 3315936051875002, 3316593578771452, 3319820909364857,
    3323335435054920, 3323852253532427, 3330103423016851, 3345055484687482, 3352559592756753, 3364444083866095,
    3370614024009966, 3389260454044152, 3390225414746365, 3390414857575905, 3394124033856113, 3406828241087621,
    3418386222553844, 3418993082943677, 3432306948116188, 3434152719519789, 3436095691129420, 3444838975746374,
    3450685262016701, 3460307035186860, 3466267576976305, 3476626581373897, 3496285173453055, 3498632168308586,
    3502026324677039, 3528092072945686, 3533535742876512, 3541787854689461, 3552268276929956, 3555802557870545,
    3557588456037002, 3560747526407796, 3564076171700665, 3564871246413742, 3566476676783879, 3567571856184076,
    3575662644257040, 3579355350362072, 3580979378058381, 3586126004936889, 3587766640759339, 3589723000480422,
    3596198206366072, 3604520352670211, 3630906519751509, 3650217195505868, 3659230836448003, 3667870167646557,
    3691426465640306, 3714438980524446, 3714530876592916, 3740412168829655, 3764545719746028, 3770018184413708,
    3800125916521531, 3816399382801621, 3824601293700275, 3833811340995667, 3838326565770240, 3845852146894827,
    3873394708439274, 3888130535073598, 3888829149058197, 3893266441755718, 3896736457048137, 3910821811431314,
    3915162060938051, 3930549852344848, 3934795479670803, 3937476894590680, 3938947946159251, 3974591254219786,
    3980447938698463, 3984948557292871, 4007891842343111, 4058063904238203, 4061243393376270, 4068027224593496,
    4086602198103414, 4087299376601017, 4089392773499798, 4114174212054942, 4120422971481126, 4141925067489884,
    4148303448980519, 4156787299859725, 4162759637044882, 4164046661909050, 4173697737328291, 4175480516219779,
    4189740225900510, 4201109263994757, 4213965001817703, 4218518130419390, 4235515002071205, 4240180379059845,
    4240979428357700, 4262330721186578, 4273740986899891, 4275642989374017, 4285572376445726, 4290517152690341,
    4294863405005721, 4303951829123801, 4305527204228726, 4322063871578992, 4328456394533431, 4329109457684296,
    4331671050076036, 4333709030034968, 4348215088324266, 4355702784024704, 4355863962430076, 4356992900630039,
    4362699904770500, 4365482208511225, 4377358682131522, 4378822926486012, 4404048063510729, 4405249315588954,
    4408863176510015, 4415743911076437, 4416168616486286, 4425620490381955, 4428635107296331, 4430652510821839,
    4440955509831330, 4441833711235489, 4442312177384091, 4443468541079802, 4454187067674395, 4455863677126887,
    4461895118372432, 4471438391807078, 4471591838227897, 4475162259664013, 4483719079586527, 4501118363515223,
    4502412344056932, 4504698201475356, 4526941633405239, 4539664026714654, 4544078439440718, 4557445231479975,
    4564713500458256, 4569928282543870, 4577286827207396, 4577363691095248, 4581900143644472, 4586468611046407,
    4592312794829855, 4600456904967804, 4602835008408204, 4604779250228880, 4612505604063764, 4613306110557699,
    4615537012637783, 4621644157325464, 4627298992348597, 4645028410417208, 4665086321615628, 4671156510802417,
    4704472833408825, 4710962447229464, 4746661843600520, 4754297751624190, 4756921847145808, 4763529220848808,
    4782533664273465, 4782932418042587, 4788964343399260, 4794066385819953, 4794400002335571, 4798226357302185,
    4805526580774244, 4828353721755416, 4829475304882151, 4832157656818292, 4840162264152040, 4862476248395036,
    4899868776127410, 4905959729211101, 4906496508499860, 4915473186187219, 4915773488451084, 4916422482873910,
    4923421566353600, 4949550104821444, 4954748119198955, 4962590908348558, 4974126759699977, 4980189424891514,
    4982379931306698, 4982400295630227, 4989780441873183, 4990717964856968, 4998194465185978, 4999702189938563,
    5000804296784343, 5002648758496058, 5016734211945801, 5024648825774350, 5024849113586552, 5065356855678344,
    5072138554282485, 5072735664374709, 5094097156953202, 5108770174932099, 5110479649403594, 5113836388749635,
    5113960208859722, 5117659173480026, 5127898320510987, 5135526026627304, 5136994123515709, 5137913454365187,
    5150660075140232, 5155627926144446, 5174966499446121, 5183975706666908, 5200824631036493, 5203342715566425,
    5211191066225357, 5230977604958026, 5236353256765965, 5240212871248597, 5241353822711260, 5246514082703324,
    5253046287444459, 5268237441795396, 5273171124620305, 5286044614165239, 5287142700167262, 5291619886115466,
    5293205207456813, 5301122974427533, 5305135523340243, 5307909297142521, 5314764697193275, 5332272366646233,
    5355639430326611, 5357988500442209, 5374890889503602, 5379463629331683, 5383187537099172, 5398825761790065,
    5420924054643657, 5424922932091493, 5434870103695698, 5435214593639157, 5437996288727024, 5438640421467656,
    5441137035532981, 5454517907077056, 5462943392769911, 5468489109628518, 5487099221413324, 5492803784702043,
    5501471936953636, 5504254885747255, 5511582881029784, 5521690293726275, 5535811168460873, 5540737670814741,
    5545001309499686, 5545773560478714, 5553630793993415, 5560029296026331, 5570743826264873, 5593247172281632,
    5603735726205910, 5607761362990017, 5612227627937431, 5612828172629209, 5630417222981512, 5631784203562145,
    5640458144478564, 5643488241134278, 5680363613709856, 5686350689060037, 5687158530439522, 5694185852629221,
    5696830919967472, 5699428414152200, 5704509807443139, 5708134376027500, 5735933550089072, 5752503279083183,
    5753884575502978, 5758382933710248, 5772674837485101, 5779753747594976, 5780440704690605, 5799298566313262,
    5825000310462493, 5825375300496665, 5834081909077643, 5855049713768631, 5889720086144289, 5894430249350161,
    5929655465069713, 5936869365674020, 5939156314456107, 5939531892545747, 5943002993779415, 5943958540042237,
    5962466957713476, 5962956346001500, 5968257215251243, 5972333193412021, 5982863339533313, 5983336254149866,
    5995006950502474, 6032980336016528, 6037839710518707, 6051447646964057, 6060174542314175, 6063843495210789,
    6067326507732026, 6069296025863929, 6072224271985633, 6083312682639668, 6096439501755809, 6104301621556430,
    6109670497056564, 6116474908245609, 6118390851260093, 6131432251113636, 6134698316408589, 6152708535047668,
    6155575153511215, 6164745963618775, 6187978596799413, 6192037950165103, 6203253793171842, 6220764496921044,
    6225616037784391, 6230646208053411, 6236504419905209, 6241542934367776, 6253444071740928, 6256424497597730,
    6256593477904139, 6277783097901826, 6302788370492246, 6309918345934130, 6324514878134130, 6359386158401854,
    6362129787874651, 6365406810401367, 6367260215578747, 6369707830457756, 6370276840661539, 6372110640570887,
    6374969808911034, 6382169712949488, 6391495780751703, 6402690070399580, 6425060614387716, 6426414328270661,
    6426871474687317, 6431850045613067, 6439079836203186, 6442403087653590, 6450409586963121, 6457851063701813,
    6470853241256057, 6474895265115976, 6478855771174506, 6485460053307352, 6491221490344280, 6501192093081362,
    6501285800425763, 6503217952215614, 6512698432143699, 6530237382506030, 6553075848807390, 6570808436572822,
    6571150996521496, 6586285696607603, 6587563043868210, 6594173674013353, 6597165963488216, 6612280585418817,
    6613261045428716, 6619111210635269, 6621847704003441, 6624228096469478, 6643638793338012, 6679687007317987,
    6680607154349158, 6692422901869178, 6699188919423239, 6705835715789733, 6707454992993608, 6716068104390440,
    6722693694609200, 6731804039557036, 6734170078978797, 6740915865295732, 6757266617790819, 6763571244868503,
    6790962190995799, 6791985863776844, 6800416881483314, 6801674049266808, 6803557271056301, 6804070026697313,
    6804464762352986, 6807069591917573, 6811585168494636, 6814415747762892, 6817652913209806, 6817715369694085,
    6824716818715812, 6831335903267261, 6855184768384918, 6860460149600559, 6868181377312568, 6873055063213935,
    6876298800938731, 6880783733807624, 6880798867298490, 6882136897860098, 6889322116713071, 6903062143913007,
    6905457692437042, 6916111583118165, 6916130287143771, 6917909937653776, 6922262557861937, 6929992787139597,
    6933152982807072, 6946343616885728, 6946790788469920, 6949099400621537, 6951796800906598, 6954971453560714,
    6965619295414521, 6966775637678289, 6971876916628473, 6974071064220401, 6976344288759257, 6989388909931057,
    6991057878566310, 6996844094498043, 7007521165806906, 7013181550141965, 7026604176687532, 7035930543747429,
    7038758063624939, 7045999852678687, 7082260819095483, 7087647337051005, 7111890847699258, 7119414787555762,
    7124615406561834, 7137040178305949, 7141439665339845, 7155648715869191, 7161878605735102, 7201796478168052,
    7206931887110287, 7212606958873034, 7234299685506166, 7235987810201866, 7238375691261099, 7243098462566032,
    7248743308717845, 7249515157718847, 7250482894736247, 7259576552668567, 7272646837625138, 7272950401980465,
    7276296752357103, 7287546855366076, 7300700774390393, 7302728237437185, 7317569505595070, 7335063159534375,
    7335079043305732, 7335284269868505, 7343905684797728, 7345284511550760, 7352761550354731, 7358761376540574,
    7365979902809046, 7369693719068989, 7372331308223800, 7376346378280573, 7385200986591968, 7388845693024204,
    7393529444477912, 7402072130202977, 7409025381067625, 7410883820500195, 7411711276106091, 7430815392939956,
    7432382599723993, 7435204623952669, 7440491179152910, 7441718760700165, 7450370137824340, 7454503762009715,
    7460611964519433, 7476620278111541, 7480589858045640, 7486806640379694, 7492447900053786, 7494232395787390,
    7504345855173009, 7518405938607685, 7521901350414518, 7522022170769436, 7523544222313067, 7526029551626547,
    7531105801551956, 7545930063517592, 7549308216888467, 7550425613544488, 7557376986815796, 7559851895981436,
    7585453175521100, 7590452064017933, 7593221434221733, 7594617767982193, 7601113792407617, 7601898842208956,
    7613451687778229, 7618530042909990, 7620953209542047, 7621507947408852, 7632862357659277, 7645088372398233,
    7653982093701482, 7655433307738582, 7678852829100859, 7686765255131601, 7692671552415074, 7692995133681180,
    7693285568927159, 7726552834058461, 7732266846236767, 7734513120368796, 7735576585819912, 7743621368718383,
    7756593227352486, 7769088749086479, 7769334284806926, 7775470286666095, 7776585854555065, 7784729454086086,
    7788989238800040, 7814947438808639, 7828735563910978, 7835113777953703, 7841123734626867, 7842287819971128,
    7847607767133359, 7849835409160860, 7858600385760468, 7863598248209272, 7867505948340571, 7867952995660040,
    7873536936079199, 7885233972277414, 7886271120984698, 7886894361605758, 7888351685139121, 7899916853712937,
    7900474049889358, 7903772726924893, 7909152382231539, 7939340949256482, 7940415266482640, 7941502288173716,
    7948792763353200, 7975348701601678, 7980514748749967, 7987433417564815, 7992335094513471, 8002456966969359,
    8003218120276659, 8009473306319141, 8014996552439000, 8020168261798546, 8024087368023273, 8035929610253169,
    8052253016029077, 8060644529384435, 8061362869902709, 8067562698519370, 8069404829110721, 8070596238311375,
    8083220599980777, 8084896257731256, 8086925125673239, 8089673135020952, 8102192877126843, 8105999062065535,
    8115162132993076, 8116335879605433, 8116993724335002, 8127784028183509, 8138937548523715, 8139174338648171,
    8165777087451891, 8166233133808262, 8166579288140704, 8166866788590745, 8167812318060127, 8206269846830870,
    8211292358238781, 8236270991215274, 8243157182209513, 8246646093753879, 8247059367004865, 8251848575445459,
    8252002208124342, 8263539256833866, 8263722843350780, 8267634213439232, 8272818840513919, 8274672170027846,
    8275157508368315, 8275508517426298, 8284467855551479, 8292700453178557, 8294480725854009, 8307758795062307,
    8314996067439868, 8317574521436784, 8324206998011964, 8340222690070571, 8345456667840886, 8346723917711183,
    8373921588571607, 8388573403407058, 8394941222085772, 8407838295360832, 8412155800206317, 8418290646223588,
    8434187475930492, 8436414209108583, 8443905896037264, 8444556500986196, 8454365750550718, 8456753483640816,
    8477487657767751, 8498516426494048, 8502745481584726, 8506972497945568, 8515480857820187, 8517259675732622,
    8519253092715709, 8527717939344464, 8529885841319619, 8537209627749927, 8583982862743633, 8592983623962973,
    8596676476718125, 8610037967810751, 8615500616623485, 8618856071378476, 8625277848099586, 8649169878233600,
    8664934309190384, 8677321423663323, 8681056697667291, 8681620483665651, 8683755673829044, 8686965358591469,
    8701188793189977, 8707345013316981, 8710039231840742, 8715021923982539, 8718336435305670, 8722237758051257,
    8744440099601912, 8745332468375874, 8757244888318535, 8769888399118969, 8776482791688771, 8779519982566351,
    8802380228035019, 8825152140476617, 8836232220800876, 8838028424816761, 8843614407362468, 8853446099194019,
    8854908311134792, 8856134072756339, 8887034275781635, 8887371139643718, 8899650970721367, 8900472150102674,
    8904347271364382, 8920248208557492, 8921096102804115, 8933301222488331, 8938597271704221, 8942460859343983,
    8944398445849398, 8946101729722336, 8957626878978696, 8966158891787595, 8966179560791969, 8966408419704180,
    8988048858392873, 8988663124640006, 9003960499303434,
  ]);
  const isRealName = (n) => REAL_NAME_HASHES.has(nameHash(String(n).toLowerCase()));
  W.isRealName = isRealName;
  // Family heritage: most players are of their nation's own culture (no heritage set); the rest descend from elsewhere,
  // in roughly the proportions of their country's professional players (D.DEMOGRAPHICS, js/names.js)
  W.pickHeritage = function (nat) {
    const t = D.DEMOGRAPHICS && D.DEMOGRAPHICS[nat];
    if (!t) return null;
    let r = Math.random() * t.reduce((s, x) => s + x[1], 0);
    for (const [k, w] of t) if ((r -= w) < 0) return k === 'native' ? null : k;
    return null;
  };
  // A name for a player of this nation and heritage: a first name from his heritage's pool, a surname from it (most of
  // the time) or from the nation's (families that have settled)
  // A surname of the nation: where a few names cover much of the country (D.SURNAME_WEIGHTS) they come up as often as they do
  // in life, the rest of the list sharing what is left
  W.pickSurname = function (nat) {
    const N = D.NATIONS[nat],
      w = D.SURNAME_WEIGHTS && D.SURNAME_WEIGHTS[nat];
    if (!w) return U.pick(N.ln);
    const names = Object.keys(w),
      total = names.reduce((s, k) => s + w[k], 0);
    let r = Math.random() * 100;
    if (r < total) {
      for (const k of names) if ((r -= w[k]) < 0) return k;
    }
    return U.pick(N.ln.filter((x) => !(x in w)));
  };
  // A first name: the nation's list, with the names of his generation favoured where the nation has them (born after 1998
  // or before 1992)
  W.pickGiven = function (nat, born) {
    const N = D.NATIONS[nat],
      e = D.GIVEN_ERA && D.GIVEN_ERA[nat];
    if (e && born != null && Math.random() < 0.6) {
      if (born >= 1998) return U.pick(e.young);
      if (born <= 1992) return U.pick(e.old);
    }
    return U.pick(N.fn);
  };
  W.rollName = function (nat, heritage, born) {
    const pool = heritage && D.heritagePool ? D.heritagePool(heritage, Math.random) : null;
    if (pool) {
      // (a surname of the nation's own culture, not of the other communities in its list: a Samoan first name goes with a Samoan or
      // an English surname, never a South Asian one)
      const own = D.NAME_POOLS[D.NATIVE_POOL[nat]];
      return { fn: U.pick(pool.fn), ln: Math.random() < 0.7 || !own ? U.pick(pool.ln) : U.pick(own.ln) };
    }
    const com = D.COMMUNITIES && D.COMMUNITIES[nat];
    if (com) {
      let r = Math.random() * com.reduce((s, c) => s + c[0], 0);
      const c = (com.find((x) => (r -= x[0]) < 0) || com[0])[1];
      return { fn: U.pick(c.fn), ln: U.pick(c.ln) };
    }
    return { fn: W.pickGiven(nat, born), ln: W.pickSurname(nat) };
  };
  // A second nationality he is eligible for through his family (most players of a heritage have one): the nation his
  // name's culture belongs to, never his own. null when there is none.
  W.dualNat = function (nat, heritage, poolKey) {
    if (!heritage || Math.random() > 0.7) return null;
    if (!poolKey) poolKey = D.HERITAGE_POOL[heritage] ? U.pick(D.HERITAGE_POOL[heritage]) : heritage;
    const list = (D.POOL_NATS[poolKey] || []).filter((n) => n !== nat && D.nationOn(n));
    return list.length ? U.pick(list) : null;
  };
  // One-word names, as Brazilian and Portuguese players often have: a diminutive or a nickname made from his first name
  // ("Rafael" → "Rafinha", "Pedro" → "Pedrinho", "Carlos" → "Cacá"), never one of the famous ones
  const MONO_RATE = { BRA: 0.16, POR: 0.05 };
  const MONO_BLOCK = new Set(
    `kaka pepe nani raphinha dudu juninho fred hulk oscar willian ronaldinho rivaldo romario bebeto cafu ederson alisson
    fabinho casemiro marquinhos richarlison rafinha rafinho neymar pele zico socrates garrincha jo rodrygo vinicius
    antony vitinho pedrinho gabigol bruninho paulinho robinho adriano elano denilson edmilson dida taffarel claudinho
    firmino lulinha danilo thiago bernard bruno everton hernanes ramires lucio fernandinho kleber dede cacau`.split(
      /\s+/,
    ),
  );
  const plain = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const ACCENT = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };
  W.mononym = function (first) {
    const base = plain(String(first).split(' ')[0]);
    if (base.length < 3) return null;
    const vowel = (c) => 'aeiou'.includes(c.toLowerCase());
    let i = 3;
    while (i < base.length && vowel(base[i - 1])) i++; // the first syllable up to a consonant: Raf, Heit, Pedr
    const clip = base.slice(0, i).replace(/[aeiou]+$/i, ''), // (Caio → Ca: too short for a suffix)
      open = base.slice(0, i + 1); // ... and the vowel after it: Rafa, Pedro
    const hard = (stem) => (/g$/i.test(stem) ? stem + 'u' : /c$/i.test(stem) ? stem.slice(0, -1) + 'qu' : stem); // Marc → Marquinho
    const r = Math.random();
    let out = null;
    if (r < 0.45 && clip.length >= 3 && !/h$/i.test(clip)) out = hard(clip) + 'inho';
    else if (r < 0.65 && clip.length >= 3) out = hard(clip) + 'ão';
    else if (r < 0.8) {
      // a doubled syllable, the last accented: Cacá, Dedé, Zezé
      const m = base.match(/^([^aeiou]*)([aeiou])/i);
      out = m && m[1].length === 1 ? m[1] + m[2] + m[1] + ACCENT[m[2].toLowerCase()] : null;
    } else if (/[ao]$/i.test(open) && open.length >= 4 && open.length < base.length) out = open; // Rafa, Duda
    if (!out || out.length < 3) return null;
    out = out.charAt(0).toUpperCase() + out.slice(1).toLowerCase();
    return MONO_BLOCK.has(plain(out).toLowerCase()) ? null : out;
  };
  // Youth years for a player made with the world: the nation he grew up in (his own, now and then where he plays now if
  // he moved young) and the club there that trained him (for a young player often his current club; B teams belong to
  // their parent). A nation with no club in this world leaves the club empty.
  let youthPool = { S: null, n: 0, by: {} };
  W.assignYouth = function (p, clubId) {
    const S = FM.S,
      age = W.age(p),
      here = clubId && S.clubs[clubId];
    if (youthPool.S !== S || youthPool.n !== Object.keys(S.clubs).length) {
      const by = {};
      for (const c of Object.values(S.clubs))
        if (c.comp && !c.parent && c.sim !== 'nation') (by[c.nat] = by[c.nat] || []).push(c);
      youthPool = { S, n: Object.keys(S.clubs).length, by };
    }
    if (p.youth && S.clubs[p.youth]) {
      p.homeNat = S.clubs[p.youth].nat;
      p.trainedAt = p.youth;
      return;
    }
    let home = p.nat;
    if (here && here.nat !== p.nat && age <= 24 && Math.random() < 0.12) home = here.nat; // moved abroad as a teenager
    p.homeNat = home;
    const pool = youthPool.by[home] || [];
    const own = here && (here.parent ? S.clubs[here.parent] : here);
    if (own && own.nat === home && age <= 22 && Math.random() < 0.6) p.trainedAt = own.id;
    else if (pool.length) {
      let r = Math.random() * pool.reduce((t, c) => t + c.rep, 0);
      p.trainedAt = (pool.find((c) => (r -= c.rep) < 0) || pool[0]).id;
    } else p.trainedAt = null;
  };
  // A nation of a part of the world (D.REGIONS), at random: the home of a club that signs only players from there
  W.regionNation = (region) => {
    const list = D.nationCodes().filter((n) => D.NATIONS[n].region === region);
    return list.length ? U.pick(list) : null;
  };
  W.genPlayer = function ({ nat, pos, age, ca, pa, clubId = null, youthClub = null }) {
    const N = D.NATIONS[nat];
    // a club with a heritage policy (Basque-only, Catalan-only) fields players of that heritage and its own nation
    const pol = clubId && FM.S.clubs && FM.S.clubs[clubId] && FM.S.clubs[clubId].policy;
    if (pol) nat = pol.nat || (pol.region && W.regionNation(pol.region)) || FM.S.clubs[clubId].nat;
    const heritage = pol && pol.heritage ? pol.heritage : pol && (pol.nat || pol.region) ? null : W.pickHeritage(nat),
      nm = W.rollName(nat, heritage, FM.S.year - age);
    const hid = {};
    ['cons', 'inj', 'prof', 'amb', 'loy', 'temp', 'big', 'lead'].forEach(
      (k) => (hid[k] = Math.round(U.clamp(U.gauss(11, 4), 1, 20))),
    );
    const p = {
      id: FM.nextId('p'),
      fn: nm.fn,
      ln: nm.ln,
      nat,
      born: FM.S.year - age,
      pos,
      foot: U.chance(0.72) ? 'Right' : U.chance(0.85) ? 'Left' : 'Both',
      attrs: genAttrs(pos, nat, ca),
      pa: Math.round(U.clamp(pa, ca, 96)),
      ca: 0,
      value: 0,
      morale: U.randi(60, 80),
      form: [],
      fitness: 100,
      inj: null,
      susp: 0,
      wage: 0,
      contract: FM.S.year + U.randi(1, 4),
      traits: [],
      hid,
      clubId,
      youth: youthClub,
      season: W.blankSeason(),
      career: { apps: 0, goals: 0, spells: [] },
      cult: 0,
      derbyGoals: 0,
    };
    // a share of Brazilians and Portuguese go by one name
    if (!heritage && Math.random() < (MONO_RATE[nat] || 0)) {
      const one = W.mononym(nm.fn);
      if (one && !isRealName(one) && !W.nameTaken(` ${one}`)) {
        p.fn = '';
        p.ln = one;
      }
    }
    W.genAlt(p);
    // Unique names (and never a famous real player). Retry combinations, then fall back to a second surname.
    let tries = 0;
    while ((isRealName(`${p.fn} ${p.ln}`) || W.nameTaken(`${p.fn} ${p.ln}`)) && tries++ < 60) {
      const again = W.rollName(nat, heritage, FM.S.year - age);
      p.fn = again.fn;
      p.ln = again.ln;
    }
    while (isRealName(`${p.fn} ${p.ln}`) || W.nameTaken(`${p.fn} ${p.ln}`)) {
      const second = U.pick(N.ln.filter((x) => x !== p.ln));
      p.ln = D.TWO_SURNAMES.includes(nat) ? `${p.ln.split(' ')[0]} ${second}` : `${p.ln.split('-')[0]}-${second}`;
    }
    // no more than two of one surname in a squad, unless it is a very common one in the nation (Kim, Nguyễn)
    if (clubId && p.fn && !heritage) {
      const common = (D.SURNAME_WEIGHTS && D.SURNAME_WEIGHTS[nat]) || {};
      for (let k = 0; k < 8 && !(p.ln in common) && W.squad(clubId).filter((q) => q.ln === p.ln).length >= 2; k++) {
        const again = W.rollName(nat, heritage, FM.S.year - age);
        if (!isRealName(`${again.fn} ${again.ln}`) && !W.nameTaken(`${again.fn} ${again.ln}`)) {
          p.fn = again.fn;
          p.ln = again.ln;
        }
      }
    }
    W.claimName(`${p.fn} ${p.ln}`);
    if (heritage) {
      p.heritage = heritage;
      p.nat2 = W.dualNat(nat, heritage, D.lastPoolKey);
    }
    p.traits = genTraits(p);
    p.personality = W.personality(hid);
    // Plausible prior career for older players (so "600 games" veterans can exist)
    const yrs = Math.max(0, age - 18);
    p.career.apps = Math.round(yrs * U.rand(18, 34));
    p.career.goals = Math.round(
      p.career.apps * ({ ST: 0.35, W: 0.2, WM: 0.13, AM: 0.18, CM: 0.07, DM: 0.03 }[pos] || 0.02) * U.rand(0.5, 1.4),
    );
    W.refresh(p);
    p.wage = W.wageFor(p, clubId && FM.S.clubs && FM.S.clubs[clubId]);
    FM.Season.assignArc(p, age); // hidden career arc: most players have none
    if (clubId) W.startSpell(p, clubId);
    return p;
  };
  // A season's numbers. From fully simulated matches also minutes, shots, key passes, tackles and passes, clean
  // sheets, and for keepers saves, goals conceded and the xG of the shots they faced.
  W.blankSeason = () => ({
    apps: 0,
    goals: 0,
    ast: 0,
    rsum: 0,
    motm: 0,
    yc: 0,
    rc: 0,
    mins: 0,
    sh: 0,
    sot: 0,
    kp: 0,
    tk: 0,
    pas: 0,
    cs: 0,
    sv: 0,
    ga: 0,
    xga: 0,
    yapps: 0,
    ic: 0,
    xg: 0,
    xa: 0,
  });
  W.STAT_KEYS = Object.keys(W.blankSeason());
  // One history row per season and club from a season's numbers ({ y, c, apps, g, a, r, ... })
  W.seasonRow = (y, c, st) => ({
    y,
    c,
    apps: st.apps,
    g: st.goals,
    a: st.ast,
    r: st.apps ? +(st.rsum / st.apps).toFixed(2) : 0,
    mins: st.mins,
    sh: st.sh,
    kp: st.kp,
    tk: st.tk,
    ic: st.ic,
    cs: st.cs,
    sv: st.sv,
    ga: st.ga,
    xga: Math.round(st.xga * 10) / 10,
    motm: st.motm,
    yc: st.yc,
    rc: st.rc,
  });
  // The season's rows: a player who moved mid-season (a transfer, a loan, back from loan) gets one per club
  W.seasonRows = function (p, y) {
    const rows = [];
    let prev = W.blankSeason();
    const diff = (a, b) => Object.fromEntries(W.STAT_KEYS.map((k) => [k, (a[k] || 0) - (b[k] || 0)]));
    for (const sp of p.splits || []) {
      const d = diff(sp.s, prev);
      if (d.apps > 0) rows.push(W.seasonRow(y, sp.c, d));
      prev = sp.s;
    }
    const last = diff(p.season, prev);
    if (last.apps > 0) rows.push(W.seasonRow(y, p.clubId, last));
    return rows;
  };
  // A wage follows ability, age and position (half the market's position premium), not market swings or the contract, and what the
  // club can pay: its revenue and the league's way of paying (FM.Finance.payFactor). The same player earns more at an oil-backed
  // Saudi club than at a Korean one. A floor (450 a week, less where a club earns little) keeps part-time leagues paying very little.
  W.WAGE_K = 0.0032;
  W.wageFor = function (p, club) {
    if (club === undefined) club = p.clubId && FM.S.clubs[p.clubId];
    const pay = club && FM.Finance ? FM.Finance.payFactor(club) : 1;
    // (a veteran's wage falls away faster than his market value: his club is not paying for resale)
    const v = W.abilityValue(p) * Math.sqrt(W.ageCurve(W.age(p)) * (W.POS_VALUE[p.pos] || 1));
    return Math.max(Math.round(450 * Math.min(1, pay)), Math.round((v * W.WAGE_K * pay) / 50) * 50);
  };
  W.startSpell = function (p, clubId) {
    // a move in the middle of a season: remember the numbers so far, for a history row with the old club
    if (p.clubId && p.clubId !== clubId && p.season && p.season.apps > 0)
      (p.splits = p.splits || []).push({ c: p.clubId, s: { ...p.season } });
    p.clubId = clubId;
    if (p.team) p.team = undefined; // a new club (or a loan): he joins its first-team squad, not a youth side
    delete p.teamSet;
    delete p.unreg; // registration is the new club's to sort out
    delete p.leaveOut;
    const fresh = sqIdx.S === FM.S && sqIdx.ver === W.rosterVer;
    W.rosterVer++;
    if (fresh) {
      const b = (sqIdx.by[clubId] = sqIdx.by[clubId] || []);
      if (!b.includes(p)) b.push(p);
      sqIdx.ver = W.rosterVer; // still complete: squads filter out anyone who has since left
    }
    p.career.spells.push({ c: clubId, from: FM.S.year, to: null, apps: 0, goals: 0 });
    W.assignNo(p, clubId);
  };
  // Squad numbers: a player keeps his number when it is free at his new club, otherwise takes one that suits his
  // position (a keeper 1, a striker 9, a left-back 3...). Teenagers start from 30.
  const NO_PREF = {
    GK: [1, 13, 12, 25],
    CB: [4, 5, 6, 15, 16, 26],
    FB: [2, 3, 12, 15, 16, 22],
    WB: [3, 2, 15, 16, 17, 21],
    DM: [6, 4, 8, 14, 18, 24],
    CM: [8, 6, 4, 14, 16, 18, 20],
    AM: [10, 8, 14, 20, 21, 22],
    WM: [11, 7, 17, 19, 20, 21],
    W: [7, 11, 17, 19, 21, 22],
    ST: [9, 10, 19, 18, 20, 23, 25],
  };
  W.pickNo = function (p, taken) {
    let list = NO_PREF[p.pos] || [];
    if (p.pos === 'FB' || p.pos === 'WB')
      list = p.side === 'L' || p.foot === 'Left' ? [3, 2, ...list] : [2, 3, ...list];
    const senior = W.age(p) > 18;
    if (senior) for (const n of list) if (!taken.has(n)) return n;
    let n = senior ? 12 : 30; // (past the shirts the positions want: a spare winger is not number 9)
    while (taken.has(n)) n++;
    return n;
  };
  // Number a whole squad at once, best players choosing first; existing unique numbers stay
  W.numberSquad = function (list) {
    const taken = new Set(),
      todo = [];
    for (const p of list) {
      if (p.no > 0 && !taken.has(p.no)) taken.add(p.no);
      else todo.push(p);
    }
    todo.sort((a, b) => b.ca - a.ca);
    for (const p of todo) {
      p.no = W.pickNo(p, taken);
      taken.add(p.no);
    }
  };
  // Everyone at a club who has no number yet (new academy players and regens, old saves): club by club, from a full
  // scan so it doesn't depend on the squad index
  W.numberAll = function (players) {
    const by = {},
      dirty = new Set();
    for (const id in players) {
      const p = players[id];
      if (!p.clubId || p.retired) continue;
      (by[p.clubId] = by[p.clubId] || []).push(p);
      if (!(p.no > 0)) dirty.add(p.clubId);
    }
    for (const c of dirty) W.numberSquad(by[c]);
    if (dirty.size) W.rosterVer++; // (players made straight into a club are not in the squad index until it is rebuilt)
  };
  W.assignNo = function (p, clubId) {
    const taken = new Set(
      W.squad(clubId)
        .filter((x) => x !== p && x.no)
        .map((x) => x.no),
    );
    if (!(p.no > 0 && !taken.has(p.no))) p.no = W.pickNo(p, taken);
  };
  W.spell = (p) => p.career.spells[p.career.spells.length - 1];
  // A past for a player of a new world: his last three seasons as history rows (appearances by how good he is for his
  // club, goals and assists by position and finishing), most at his current club, now and then with an earlier one. The
  // current spell, his career totals and the rows agree. Young players have fewer seasons, and those at fewer games.
  const HIST_RATES = {
    // per appearance: goals, assists, shots, key passes, tackles, interceptions
    ST: [0.42, 0.12, 2.6, 0.9, 0.5, 0.2],
    W: [0.24, 0.2, 1.8, 1.6, 0.9, 0.4],
    WM: [0.15, 0.17, 1.3, 1.5, 1.1, 0.6],
    AM: [0.2, 0.22, 1.7, 2.0, 0.8, 0.5],
    CM: [0.08, 0.12, 0.9, 1.3, 1.9, 1.0],
    DM: [0.04, 0.06, 0.5, 0.8, 2.5, 1.6],
    WB: [0.04, 0.12, 0.5, 1.1, 2.0, 1.2],
    FB: [0.03, 0.1, 0.4, 0.9, 2.1, 1.3],
    CB: [0.05, 0.03, 0.4, 0.2, 1.5, 2.1],
    GK: [0, 0, 0, 0, 0, 0],
  };
  W.backfillHistory = function (p) {
    const S = FM.S,
      c = p.clubId && S.clubs[p.clubId],
      age = W.age(p);
    if (!c || age < 18 || p.history) return;
    const seasons = Math.min(3, age - 17),
      sp = W.spell(p);
    if (!sp) return;
    // the young came through here; an older player who arrived recently has an earlier club for the seasons before
    let here = Math.min(seasons, Math.max(0, S.year - sp.from));
    if (age < 22) {
      here = seasons;
      sp.from = Math.min(sp.from, S.year - seasons);
    }
    let prev = null;
    if (here < seasons) {
      const near = Object.values(S.clubs).filter(
        (x) => x.nat === c.nat && x.id !== c.id && x.sim !== 'nation' && Math.abs(x.rep - c.rep) <= 10 && !x.parent,
      );
      prev = near.length ? U.pick(near) : null;
    }
    const lvl = W.levelFor(c.rep),
      rate = HIST_RATES[p.pos] || HIST_RATES.CM,
      comp = c.comp && S.comps[c.comp],
      games = (comp && comp.fixtures && comp.fixtures.length) || 38;
    const rows = [],
      spellAt = {};
    // where he ranks in his position at his club decides his games: a starter plays most of the matches, the next man in about half,
    // then a rotation place, then the fringe (the players of his own group at the club, by ability)
    const grp = D.POS_GROUP[p.pos],
      starters = { GK: 1, DEF: 4, MID: 3, ATT: 3 }[grp] || 3,
      mates = W.squad(c.id).filter((q) => q !== p && !q.team && D.POS_GROUP[q.pos] === grp);
    for (let k = seasons; k >= 1; k--) {
      const y = S.year - k;
      const club = k <= here || !prev ? c : prev,
        young = age - k < 21;
      // he was weaker then, if he was still growing (about two points a year before 23)
      const then = p.ca - Math.max(0, Math.min(k, 23 - (age - k))) * 2;
      const clubLvl = club === c ? lvl : W.levelFor(prev.rep);
      const rel = then - clubLvl;
      let share;
      if (club === c) {
        const rank = mates.filter((q) => q.ca > then).length;
        share = rank < starters ? 0.8 : rank === starters ? 0.55 : rank === starters + 1 ? 0.35 : 0.15;
        if (then >= lvl + 6) share = Math.max(share, 0.86); // a class above his club's level: always in the team
      } else share = U.clamp(0.55 + rel * 0.025, 0.1, 0.88);
      if (age - k < 19) share *= 0.6;
      else if (young) share *= 0.85;
      const apps = U.clamp(Math.round(U.gauss(games * share, games * 0.09)), 0, games);
      const finish = 0.6 + p.attrs.finishing / 25;
      const g = Math.round(apps * rate[0] * finish * U.rand(0.6, 1.4));
      const a = Math.round(apps * rate[1] * U.rand(0.6, 1.4));
      const gk = p.pos === 'GK';
      const ga = gk ? Math.round(apps * U.rand(1.0, 1.5)) : 0;
      rows.push({
        y,
        c: club.id,
        apps,
        g,
        a,
        r: apps
          ? +U.clamp(
              6.62 + U.clamp(rel * 0.04, -0.5, 0.9) + U.gauss(0, 0.12) + (g + a) / Math.max(1, apps) / 6,
              5.8,
              7.9,
            ).toFixed(2)
          : 0,
        mins: apps * Math.round(share >= 0.7 ? U.rand(78, 90) : U.rand(55, 80)),
        sh: Math.round(apps * rate[2] * U.rand(0.7, 1.3)),
        kp: Math.round(apps * rate[3] * U.rand(0.7, 1.3)),
        tk: Math.round(apps * rate[4] * U.rand(0.7, 1.3)),
        ic: Math.round(apps * rate[5] * U.rand(0.7, 1.3)),
        cs: gk ? Math.round(apps * U.rand(0.22, 0.38)) : 0,
        sv: gk ? Math.round(ga * U.rand(2, 3.2)) : 0,
        ga,
        xga: gk ? Math.round(ga * U.rand(0.85, 1.15) * 10) / 10 : 0,
        motm: Math.round(apps * 0.02 * Math.max(0, 1 + rel * 0.08) * U.rand(0, 2)),
        yc: Math.round(
          apps * ({ CB: 0.16, DM: 0.2, CM: 0.12, FB: 0.12, WB: 0.12, GK: 0.02 }[p.pos] || 0.07) * U.rand(0.4, 1.6),
        ),
        rc: Math.random() < 0.04 ? 1 : 0,
      });
      const sk = club.id;
      spellAt[sk] = spellAt[sk] || { apps: 0, goals: 0, from: null };
      if (apps > 0 && spellAt[sk].from === null) spellAt[sk].from = y; // (his first season with games: the rows, not a year without)
      spellAt[sk].apps += apps;
      spellAt[sk].goals += g;
    }
    p.history = rows.filter((r) => r.apps > 0); // (a season without a game is no row, as in a played world)
    // spells and career totals agree with the rows: the current spell covers at least its rows, an earlier club gets one
    const mine = spellAt[c.id];
    if (mine) {
      // a spell that began inside the rows (he came from another club) is exactly its rows; one that began before them
      // (a long-serving player) also has the seasons the rows do not go back to
      // (a spell that starts at the first stored season is covered by the rows too, not "before" them)
      const exact = here < seasons || sp.from >= S.year - seasons;
      if (mine.apps > sp.apps || exact) {
        p.career.apps += mine.apps - sp.apps;
        sp.apps = mine.apps;
      }
      sp.goals = exact ? mine.goals : Math.max(sp.goals || 0, mine.goals);
    }
    if (prev && spellAt[prev.id] && spellAt[prev.id].apps > 0) {
      const e = spellAt[prev.id];
      p.career.spells.splice(-1, 0, {
        c: prev.id,
        from: e.from ?? sp.from - 1,
        to: sp.from - 1,
        apps: e.apps,
        goals: e.goals,
      });
      p.career.apps += e.apps;
      p.career.goals += e.goals;
    }
    if (mine) p.career.goals += mine.goals;
  };
  // Your player: at your club or at your B team (whose players belong to you)
  // Your club or your B team (whose wages you pay): never an AI buyer, borrower or bidder
  W.isUserSide = (clubId) => W.isUser(clubId) || (!!FM.Youth && W.isUser(FM.Youth.owner(clubId)));
  W.ownPlayer = (p) => !!(p && p.clubId) && W.isUser(FM.Youth ? FM.Youth.owner(p.clubId) : p.clubId);
  // Move a player within a club family (a parent and its B team): no transfer, no new career spell
  W.moveWithin = function (p, clubId) {
    p.clubId = clubId;
    W.assignNo(p, clubId);
    const fresh = sqIdx.S === FM.S && sqIdx.ver === W.rosterVer;
    W.rosterVer++;
    if (fresh) {
      const b = (sqIdx.by[clubId] = sqIdx.by[clubId] || []);
      if (!b.includes(p)) b.push(p);
      sqIdx.ver = W.rosterVer;
    }
  };

  function randomPos(counts) {
    const out = [];
    for (const k in counts) for (let i = 0; i < counts[k]; i++) out.push(k);
    return out;
  }
  const SQUAD = D.SQUAD_TIER.full;
  // Squad size an AI club aims for, by simulation tier
  // The positions a club's squad is built from: its tier's numbers, with the flank places split by its formation
  // (a back-five side carries wing-backs, a back four full-backs)
  W.squadWant = function (c) {
    const base = { ...(D.SQUAD_TIER[c && c.sim] || SQUAD) },
      flank = (base.FB || 0) + (base.WB || 0),
      back5 = !!(c && c.tactic && (D.FORMATIONS[c.tactic.formation] || []).some((s) => s.t === 'WB'));
    base.WB = Math.min(flank, back5 ? 2 : flank >= 3 ? 1 : 0);
    base.FB = flank - base.WB;
    // the wide places in midfield and attack split by formation: a flat midfield four wants wide midfielders, a
    // front three wingers
    const slots = (c && c.tactic && D.FORMATIONS[c.tactic.formation]) || [],
      wm = slots.filter((s) => s.t === 'WM').length,
      wf = slots.filter((s) => s.t === 'W').length,
      wide = (base.W || 0) + (base.WM || 0);
    if (wide >= 2) {
      const share = wm && !wf ? 0.65 : wf && !wm ? 0.25 : 0.5;
      base.WM = U.clamp(Math.round(wide * share), 1, wide - 1);
      base.W = wide - base.WM;
    }
    return base;
  };
  W.squadTarget = (c) => U.sum(Object.values(D.SQUAD_TIER[c.sim] || SQUAD)) + 2;
  // How far short of his prime a generated player is at each age (ability peaks ~26–30)
  const AGE_GAP = {
    18: 12,
    19: 10.5,
    20: 9,
    21: 7,
    22: 5,
    23: 3.5,
    24: 2.2,
    25: 1.2,
    26: 0.5,
    27: 0,
    28: 0,
    29: 0,
    30: 0.3,
    31: 1,
    32: 2,
    33: 3,
    34: 4,
    35: 5,
    36: 6,
    37: 7,
  };
  // Squad ages follow the shape the simulated world settles into over many seasons (so a new world doesn't
  // carry an age bulge that ages through it for a decade). Keepers skew older: they mature later and play on longer.
  const AGES = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37];
  const AGE_W = { 18: 3, 19: 3, 20: 3, 21: 4.5, 30: 3.8, 31: 3.4, 32: 3, 33: 2.2, 34: 1.5, 35: 0.9, 36: 0.4, 37: 0 };
  function pickAge(pos) {
    if (pos === 'GK') return U.wpick(AGES, (a) => (a < 21 ? 1.5 : a <= 24 ? 4 : a <= 33 ? 5 : a <= 35 ? 2.5 : 1));
    return U.wpick(AGES, (a) => AGE_W[a] ?? 5);
  }
  // Potential of a generated player: roughly how far he is from his prime at this age (AGE_GAP), with a spread
  // that is wider the younger he is. Centring it on the ageing curve keeps the next generation's elite about as
  // strong as today's; a flat bonus (up to +30) made every generation outgrow the last.
  W.potentialFor = function (ca, age) {
    const gap = age >= 26 ? AGE_GAP[Math.min(age, 26)] || 0 : AGE_GAP[Math.max(18, age)] + Math.max(0, 18 - age) * 2;
    return ca + Math.max(0, Math.round(gap + U.gauss(0, 1.5 + gap * 0.4)));
  };
  // ---------- What a club can become: its attributes and its ceiling ----------
  // A club's reputation is not free to go anywhere. Each club has a market (the size of its city and its catchment), a support
  // base, a youth catchment and an owner, worked out from its ground, its standing and its identity (and kept on the club, so a
  // database can set them). They give it a historical reputation that moves slowly, a ceiling it cannot rise above without a
  // cause (a takeover, years of success growing its support) and a floor it does not sink below at once. Rises and falls in
  // a season are also capped, so a small club does not become a giant in a few years, or a giant a nobody.
  W.REP_STEP = 4.5; // the most a club's reputation moves in a season from its results
  W.REP_STANDING = 0.8; // how much of its yearly target comes from this season's standing (the rest from its history)
  W.REP_HEAD = 1.8; // a multiplier on the headroom its market, supporters and owner allow
  W.REP_SLACK = 1.6; // a multiplier on how far below its history a club may sink
  const BIG_NATION = {
    ENG: 1,
    ESP: 1,
    GER: 1,
    FRA: 1,
    ITA: 1,
    BRA: 1,
    USA: 1,
    JPN: 0.5,
    MEX: 0.5,
    TUR: 0.5,
    ARG: 0.5,
    KSA: 0.4,
    NED: 0.2,
    POR: 0.2,
    RUS: 0.6,
  };
  const SUPPORT_BY_IDENTITY = {
    giant: 2,
    fan: 1.5,
    historic: 1,
    fallen: 1.5,
    oil: -1,
    selling: -0.5,
    youth: 0,
    military: 0.5,
  };
  W.clubAttr = function (c) {
    if (c.attr) return c.attr;
    const h = U.hash(c.id),
      cap = (c.stadium && (c.stadium.cap0 || c.stadium.cap)) || 15000;
    const scale = (Math.log(cap) - Math.log(3000)) / (Math.log(80000) - Math.log(3000));
    const market = U.clamp(1 + scale * 7.5 + ((h % 5) - 2) * 0.35 + (BIG_NATION[c.nat] || 0) * 0.8, 1, 10);
    const support = U.clamp(market * 0.6 + (c.rep - 40) / 12 + (SUPPORT_BY_IDENTITY[c.identity] || 0), 1, 10);
    const catchment = U.clamp(market * 0.7 + (c.identity === 'youth' ? 1.5 : 0) + (((h >> 3) % 3) - 1) * 0.5, 1, 10);
    let own = { oil: 'sovereign', fan: 'fans', selling: 'investors' }[c.identity] || 'private';
    // (a police, army, union, railway or works club is not owned by its fans: the owner follows the kind of club)
    const kind = own === 'fans' && FM.Lore && FM.Lore.kind ? FM.Lore.kind(c) : null;
    if (kind)
      own =
        { military: 'state', police: 'state', union: 'society', railway: 'company', works: 'company' }[kind.key] || own;
    const a = { market, support, catchment, own, hist: c.rep };
    a.ceil = W.repCeiling(a, c.rep);
    a.floor = Math.max(20, c.rep - (6 + market * 0.8) * W.REP_SLACK);
    c.attr = a;
    return a;
  };
  // The most a club can be: its standing now (it is never above its own ceiling), plus what its market, supporters and owner allow
  W.repCeiling = (a, rep) =>
    Math.min(
      99,
      rep +
        (1.5 + 1.9 * a.market + 1.1 * a.support) * W.REP_HEAD +
        (a.own === 'sovereign' ? 8 : a.own === 'state' ? 2 : a.own === 'fans' ? -1.5 : a.own === 'society' ? -1 : 0),
    );
  // A change to a club's reputation, held to its ceiling and floor (national teams and clubs outside the leagues have none)
  W.nudgeRep = function (c, d) {
    if (!c || !c.comp || c.sim === 'nation') {
      if (c) c.rep = U.clamp(c.rep + d, 20, 99);
      return;
    }
    const a = W.clubAttr(c);
    c.rep = U.clamp(c.rep + d, a.floor, Math.max(a.ceil, c.rep));
  };
  // A season ends: the club's reputation moves toward what its standing and its history support, by a capped step, and its
  // history follows slowly. Success also grows the club (supporters, then the ceiling); a long slump shrinks it.
  W.driftRep = function (c, standing) {
    const a = W.clubAttr(c);
    const target = U.clamp(W.REP_STANDING * standing + (1 - W.REP_STANDING) * a.hist, a.floor, a.ceil);
    c.rep = U.clamp(c.rep + U.clamp((target - c.rep) * 0.18, -W.REP_STEP, W.REP_STEP), 20, Math.max(a.ceil, c.rep));
    a.hist += (c.rep - a.hist) * 0.05;
    a.floor = Math.max(20, Math.min(a.floor + 0.2, a.hist - (6 + a.market * 0.8) * W.REP_SLACK));
  };
  W.growClub = function (c, d) {
    const a = W.clubAttr(c);
    a.support = U.clamp(a.support + d, 1, 10);
    a.ceil = Math.min(99, a.ceil + d * 3);
  };

  W.levelFor = (rep) => 25 + rep * 0.58;
  // Ability of an unattached player the world invents (a new world's free agents, a thin summer market): mostly
  // lower-league standard; only rarely someone good enough for a top flight
  // Free agents the world generates (world start, summer top-up): mostly journeymen; a genuinely good one is rare
  W.freeAgentCA = () => (Math.random() < 0.01 ? U.randi(60, 70) : Math.round(U.clamp(U.gauss(42, 6), 30, 56)));

  // Nationality for a new player at a club: league mix where one exists, mostly local elsewhere
  W.natFor = function (club) {
    const mix = club.comp && D.NAT_MIX[club.comp];
    if (mix) return D.pickNat(mix);
    return Math.random() < 0.88 ? club.nat : U.pick(D.nationCodes());
  };
  W.youthNat = (club) =>
    D.YOUTH_MIX[club.nat]
      ? D.pickNat(D.YOUTH_MIX[club.nat])
      : Math.random() < 0.95
        ? club.nat
        : U.pick(D.nationCodes());

  // A squad for a club. `have`: players it already has (a database that fixes some of them): only the gaps are filled
  function genSquad(club, have = []) {
    const lvl = W.levelFor(club.rep);
    const positions = randomPos(W.squadWant(club));
    for (const h of have) {
      const i = positions.indexOf(h.pos);
      if (i >= 0 && !h.youth) positions.splice(i, 1);
    }
    const made = []; // nationality and age of each player so far: the squad starts within its league's rules
    have.forEach((h) => made.push({ nat: h.nat, age: W.age(h) }));
    const nat = (age, pick) => {
      const n = FM.Reg.genNat(club, made, age, pick);
      made.push({ nat: n, age });
      return n;
    };
    const mil = !!(club.policy && club.policy.military); // the army's club: conscripts on loan, no academy
    const sidesMade = {},
      mine = have.slice();
    positions.forEach((pos, i) => {
      // a B team is a young side: mostly 18 to 23, with a few older heads
      const age = mil
        ? U.randi(24, 27)
        : club.parent
          ? Math.random() < 0.85
            ? U.randi(18, 23)
            : U.randi(24, 27)
          : pickAge(pos);
      const starter = i % 2 === 0;
      let ca = Math.round(
        U.clamp(
          U.gauss(lvl + (starter ? 3 : -4) - AGE_GAP[pos === 'GK' ? Math.round(20 + (age - 20) * 0.7) : age], 4),
          30,
          92,
        ),
      );
      const p = W.genPlayer({
        nat: mil ? 'KOR' : nat(age, () => W.natFor(club)),
        pos,
        age,
        ca,
        pa: W.potentialFor(ca, age),
        clubId: club.id,
      });
      if (mil) FM.Asia.enlist(p, club);
      if (W.FLANK.includes(pos)) {
        // left and right in turn, the foot to match (most full-backs; wingers are often inverted)
        const n = (sidesMade[pos] = (sidesMade[pos] || 0) + 1);
        p.side = n % 2 ? 'L' : 'R';
        if (p.foot !== 'Both' && Math.random() < (pos === 'W' ? 0.55 : pos === 'WM' ? 0.7 : 0.85))
          p.foot = p.side === 'L' ? 'Left' : 'Right';
      }
      FM.S.players[p.id] = p;
      mine.push(p);
    });
    // Academy prospects
    for (let i = 0; i < (mil ? 0 : (D.ACADEMY_TIER[club.sim] ?? 2) - have.filter((h) => h.youth).length); i++) {
      const age = U.randi(17, 19),
        pos = U.pick(['CB', 'CM', 'W', 'ST', 'FB', 'AM', 'WB', 'WM']);
      const ca = Math.round(lvl - U.randi(12, 20));
      const p = W.genPlayer({
        nat: nat(age, () => W.youthNat(club)),
        pos,
        age,
        ca,
        pa: ca + U.randi(15, 35),
        clubId: club.id,
        youthClub: club.id,
      });
      FM.S.players[p.id] = p;
      mine.push(p);
    }
    mine.forEach((p) => (p.no = 0)); // (numbers handed out as each player was made go back: the best choose first)
    W.numberSquad(mine);
    W.rosterVer++; // (these players went straight into the club: any squad index built before now is out of date)
  }

  W.genSquad = genSquad;

  // Squads come from an index rebuilt whenever someone joins a club (W.startSpell bumps rosterVer).
  // Leavers, retirees and deleted players are filtered out on read, so the index never goes stale.
  let sqIdx = { S: null, ver: -1, by: null };
  W.rosterVer = 0;
  W.squad = function (clubId) {
    const S = FM.S;
    if (sqIdx.S !== S || sqIdx.ver !== W.rosterVer) {
      const by = {};
      for (const id in S.players) {
        const p = S.players[id];
        if (p.clubId) (by[p.clubId] = by[p.clubId] || []).push(p);
      }
      sqIdx = { S, ver: W.rosterVer, by };
    }
    return (sqIdx.by[clubId] || []).filter((p) => p.clubId === clubId && !p.retired && S.players[p.id] === p);
  };

  // ---------------- Staff ----------------
  W.genStaff = function (role, nat = 'ENG', extra = {}) {
    const N = D.NATIONS[nat];
    const s = {
      id: FM.nextId('s'),
      role,
      fn: U.pick(N.fn),
      ln: U.pick(N.ln),
      nat,
      age: U.randi(34, 64),
      personality: U.pick(D.STAFF_PERSONALITY),
      ability: U.randi(8, 17),
      ...extra,
    };
    if (s.role === 'Scout' && !s.regions) Object.assign(s, W.scoutProfile(nat, s.ability));
    s.wage = s.wage || W.staffWage(s);
    s.contract = s.contract || FM.S.year + U.randi(1, 3);
    FM.S.staff[s.id] = s;
    return s;
  };
  W.staffWage = (s) => Math.round((200 + Math.pow(s.judge || s.ability, 2.4) * 9) / 50) * 50;
  // Which parts of the world a region's staff come from after their own: where its football looks (a South American
  // club's staff are South Americans, some Spaniards and Portuguese, a few from the rest), nearest first
  W.REGION_TIES = {
    ENG: ['EUR', 'AFR', 'NAM'],
    EUR: ['ENG', 'AFR', 'SAM'],
    SAM: ['EUR', 'NAM', 'AFR'],
    NAM: ['SAM', 'ENG', 'EUR'],
    ASIA: ['AFR', 'EUR', 'NAM'],
    AFR: ['EUR', 'ENG', 'ASIA'],
    OFC: ['ASIA', 'ENG', 'EUR'],
  };
  // The nationality of a member of staff (or a scout) a club in `nat` would hire: mostly the club's own part of the world
  // (a fifth the club's own nation), then the regions it has ties with, and now and then anyone
  W.staffNation = function (nat) {
    const home = (D.NATIONS[nat] || D.NATIONS.ENG).region,
      all = D.nationCodes(),
      inRegion = (r) => all.filter((n) => D.NATIONS[n].region === r);
    const roll = Math.random();
    if (roll < 0.2) return nat;
    if (roll < 0.65) return U.pick(inRegion(home).concat([nat]));
    const ties = W.REGION_TIES[home] || [];
    if (roll < 0.9 && ties.length) {
      const r = ties[Math.random() < 0.6 ? 0 : Math.random() < 0.6 ? 1 : ties.length - 1];
      const list = inRegion(r);
      if (list.length) return U.pick(list);
    }
    return U.pick(all);
  };
  // A scout knows their home region best, the regions their home has ties with a little, the rest hardly
  W.scoutProfile = function (nat, ability) {
    const home = D.NATIONS[nat].region;
    const ties = W.REGION_TIES[home] || [];
    const regions = {};
    for (const r in D.REGIONS) regions[r] = U.clamp(U.rand(0.1, 0.35) + (r === home ? 0.6 : 0), 0.1, 0.97);
    // (one near region is a second home: the first tie most often)
    const second = Math.random() < 0.65 ? ties[0] : U.pick(ties);
    if (second && D.REGIONS[second]) regions[second] = Math.max(regions[second], U.rand(0.5, 0.75));
    const judge = U.clamp(Math.round(ability + U.randi(-2, 2)), 6, 19);
    const best = Object.keys(regions).sort((a, b) => regions[b] - regions[a]);
    return {
      regions,
      judge,
      note: `Strongest in ${D.REGIONS[best[0]]}${regions[best[1]] > 0.6 ? ' and ' + D.REGIONS[best[1]] : ''}. Weak in ${D.REGIONS[best[best.length - 1]]}.`,
    };
  };
  // Staff available for hire (refreshed each season and during windows)
  W.refreshStaffPool = function () {
    const S = FM.S;
    (S.staffPool || []).forEach((id) => {
      if (!Object.values(S.user.staff).includes(id) && !S.user.scouts.includes(id)) delete S.staff[id];
    });
    const roles = [
      'Assistant Manager',
      'First-Team Coach',
      'Head of Analytics',
      'Head Physio',
      'Sporting Director',
      'Scout',
      'Scout',
      'Scout',
      'Scout',
    ];
    S.staffPool = [];
    roles.forEach((r) => {
      for (let i = 0; i < 2; i++) {
        const nat = W.staffNation(
          S.user && S.user.clubId && S.clubs[S.user.clubId]
            ? S.clubs[S.user.clubId].nat
            : (S.user && S.user.nat) || 'ENG',
        );
        const st = W.genStaff(r, nat, { ability: Math.round(U.clamp(U.gauss(12, 3.5), 5, 20)) });
        if (r === 'Scout') (Object.assign(st, W.scoutProfile(nat, st.ability)), (st.wage = W.staffWage(st)));
        S.staffPool.push(st.id);
      }
    });
    if (FM.WorldDef) FM.WorldDef.seedStaff(null, false); // staff a world definition put on offer
  };
  W.userStaff = () =>
    Object.values(FM.S.user.staff)
      .map((id) => FM.S.staff[id])
      .concat(FM.S.user.scouts.map((id) => FM.S.staff[id]))
      .filter(Boolean);
  W.staffAbility = (key) => {
    const id = FM.S.user.staff[key];
    return id && FM.S.staff[id] ? FM.S.staff[id].ability : 6;
  };

  // ---------------- Tactics ----------------
  W.defaultRoles = (formation) => D.FORMATIONS[formation].map((s) => Object.keys(D.ROLES[s.t])[0]);
  // How an AI club sets up: formation from the usual mix, build-up from its identity, big clubs press high.
  // Used for new worlds and every new manager alike, so the world's tactical mix (and its goals per game) stays
  // steady over long saves instead of drifting toward a uniform, more open mix as managers come and go.
  W.AI_FORMATIONS = {
    '4-3-3': 2,
    '4-2-3-1': 2,
    '4-4-2': 1,
    '3-5-2': 0.8,
    '5-3-2': 0.6,
    '4-1-4-1': 0.8,
    '4-4-1-1': 0.6,
    '3-4-2-1': 0.6,
    '4-1-2-1-2': 0.3,
    '4-3-1-2': 0.3,
    '5-4-1': 0.4,
  };
  W.aiTactic = (c) =>
    W.newTactic(
      U.wpick(Object.keys(W.AI_FORMATIONS), (f) => W.AI_FORMATIONS[f]),
      { fan: 'Short', giant: 'Possession', oil: 'Possession', youth: 'Short' }[c.identity] ||
        (c.rep < 60 ? 'Counter' : U.pick(D.BUILDUP)),
      c.rep > 75 ? 'High Press' : U.pick(D.PRESS),
      U.wpick(D.WIDTH, (w) => (w === 'Balanced' ? 3 : 1)),
    );
  W.newTactic = (formation = '4-3-3', buildup = 'Short', press = 'Mid Block', width = 'Balanced') => ({
    formation,
    buildup,
    press,
    width,
    roles: W.defaultRoles(formation),
    invFB: false,
    lineup: null,
  });
  // The user's second tactic (Plan B), made on first use from the first one; it has its own familiarity
  W.secondTactic = function () {
    const u = FM.S.user;
    if (!u.tactic2) {
      u.tactic2 = JSON.parse(JSON.stringify(u.tactic));
      u.tactic2.fam = Math.round((u.tactic.fam ?? 55) * 0.6);
      u.tactic2.lineup = null;
    }
    return u.tactic2;
  };
  // Swap: Plan B becomes the tactic you start with. Captain and set-piece takers stay with the team, not the plan.
  W.swapTactics = function () {
    const u = FM.S.user,
      a = u.tactic,
      b = W.secondTactic();
    for (const k of ['capt', 'captAuto', 'sp']) {
      b[k] = a[k];
      delete a[k];
    }
    u.tactic = b;
    u.tactic2 = a;
    const c = W.userClub();
    if (c) c.tactic = u.tactic;
  };
  // Weather on the day, by the home side's climate and the time of the season (the calendar runs August–May)
  W.weatherFor = function (club) {
    const f = FM.S.calendar && FM.S.calendar.length ? FM.S.day / FM.S.calendar.length : 0.5,
      nat = club && club.nat,
      C = D.CLIMATE,
      winter = f > 0.3 && f < 0.7,
      edge = f < 0.15 || f > 0.85;
    const w = { Clear: 0.55, Cloudy: 0.2, Rain: 0.2, Snow: 0, Hot: 0 };
    if (C.wet.includes(nat)) w.Rain = 0.3;
    if (C.warm.includes(nat) || C.tropical.includes(nat)) w.Rain = 0.12;
    if (C.cold.includes(nat) && winter) w.Snow = 0.12;
    if (C.tropical.includes(nat)) w.Hot = winter ? 0.15 : 0.35;
    else if (C.warm.includes(nat) && edge) w.Hot = 0.3;
    const k = U.wpick(Object.keys(w), (x) => w[x]);
    return D.WEATHER.find((x) => x[0] === k);
  };

  // Picks an XI (respecting a saved user lineup when valid) and a bench
  W.NO_LIMIT = 99; // rules.foreignLimit value for "no limit on foreign players"
  W.foreignLimitText = () =>
    FM.S.rules.reg === 'real'
      ? "each league's own rules"
      : FM.S.rules.foreignLimit >= W.NO_LIMIT
        ? 'no limit'
        : `max ${FM.S.rules.foreignLimit}`;
  // The order a quick pick fills the places in: the thinnest positions first
  const PICK_ORDER = ['GK', 'ST', 'CB', 'DM', 'CM', 'FB', 'WB', 'WM', 'W', 'AM'];
  W.pickXI = function (clubId, tactic, squad) {
    const slots = D.FORMATIONS[tactic.formation];
    const club = FM.clubOf(clubId);
    let pool = (squad || (club.sim === 'nation' ? FM.Intl.squad(club.code) : W.squad(clubId))).filter(
      (p) => W.available(p) && (club.sim === 'nation' || !p.unreg), // left off the registered squad: can't play
    );
    // Youth-side players (U21, U18) only step up when the first-team squad is short
    // (a loanee is never one of them: he came to play for the first team)
    const youth = (p) => p.team && !p.loan;
    if (club.sim !== 'nation' && pool.some(youth)) {
      const first = pool.filter((p) => !youth(p));
      pool =
        first.length >= 16
          ? first
          : first.concat(
              pool
                .filter(youth)
                .sort((a, b) => b.ca - a.ca)
                .slice(0, 16 - first.length),
            );
    }
    // Registration rules: caps on foreign (or non-EU) players in the matchday squad, XI and bench (FM.Reg)
    const lims = FM.Reg.matchdayLimits(club);
    const limited = (p) => lims.some((l) => l.f(p));
    const over = (list) => lims.some((l) => list.filter((p) => p && l.f(p)).length > l.cap);
    const used = new Set();
    const xi = new Array(slots.length).fill(null);
    if (tactic.lineup) {
      tactic.lineup.forEach((pid, i) => {
        const p = FM.S.players[pid];
        if (p && p.clubId === clubId && W.available(p) && !used.has(pid) && i < slots.length) {
          xi[i] = p;
          used.add(pid);
        }
      });
    }
    const order = slots
      .map((s, i) => i)
      .sort((a, b) => PICK_ORDER.indexOf(slots[a].t) - PICK_ORDER.indexOf(slots[b].t));
    for (const i of order) {
      if (xi[i]) continue;
      let best = null,
        bv = -1;
      for (const p of pool) {
        if (used.has(p.id)) continue;
        if (slots[i].t === 'GK' ? p.pos !== 'GK' : p.pos === 'GK') continue;
        // a loanee his parent club insisted should play gets the benefit of the doubt
        const v =
          W.effAt(p, slots[i].t, slots[i], tactic.roles && tactic.roles[i]) *
          W.fitnessPick(p) *
          (p.loan && p.loan.promised ? 1.1 : 1) *
          (p.minutesPlan ? 1.07 : 1); // a prospect his club wants to see play
        if (v > bv) {
          bv = v;
          best = p;
        }
      }
      if (!best) best = pool.find((p) => !used.has(p.id));
      if (best) {
        xi[i] = best;
        used.add(best.id);
      }
    }
    // Your club: improve the quick pick by swapping players between positions, or bringing in an unused player,
    // while the team's total fit rises (players you placed yourself stay put). AI clubs keep the quick pick: it runs
    // thousands of times a day and the match balance is calibrated on it.
    if (W.isUser(clubId)) {
      const locked = new Set(
        (tactic.lineup || []).map((pid, i) => (xi[i] && xi[i].id === pid ? i : -1)).filter((i) => i >= 0),
      );
      // a natural (or accomplished) player is preferred: an improvised one starts only when nobody fits the slot
      // (the assistant flags anyone out of position with a natural within 4% of him)
      const natural = (p, i) => {
        const f = W.fitAt(p, slots[i].t, slots[i], tactic.roles && tactic.roles[i]);
        return f >= 0.95 ? 1 : f < 0.8 ? 0.5 : 0.97;
      };
      const val = (p, i) =>
        !p || (slots[i].t === 'GK') !== (p.pos === 'GK')
          ? 0
          : W.effAt(p, slots[i].t, slots[i], tactic.roles && tactic.roles[i]) * W.fitnessPick(p) * natural(p, i);
      // a slot nobody in the first-team squad fits: a natural from the U21 or U18 side may step up for it
      if (club.sim !== 'nation' && !squad) {
        const youth = W.squad(clubId).filter((p) => p.team && !p.loan && W.available(p) && !pool.includes(p));
        slots.forEach((sl, i) => {
          if (sl.t === 'GK' || !xi[i] || W.fitAt(xi[i], sl.t, sl) >= 0.8) return;
          if (pool.some((p) => !xi.includes(p) && W.fitAt(p, sl.t, sl) >= 0.95)) return;
          for (const p of youth) if (W.fitAt(p, sl.t, sl) >= 0.95 && !pool.includes(p)) pool.push(p);
        });
      }
      for (let pass = 0, better = true; better && pass < 4; pass++) {
        better = false;
        for (let i = 0; i < slots.length; i++) {
          if (locked.has(i)) continue;
          for (let j = i + 1; j < slots.length; j++) {
            if (locked.has(j)) continue;
            if (val(xi[j], i) + val(xi[i], j) > val(xi[i], i) + val(xi[j], j) + 1e-9) {
              [xi[i], xi[j]] = [xi[j], xi[i]];
              better = true;
            }
          }
          for (const q of pool) {
            if (used.has(q.id) || val(q, i) <= val(xi[i], i) + 1e-9) continue;
            if (xi[i]) used.delete(xi[i].id);
            used.add(q.id);
            xi[i] = q;
            better = true;
          }
        }
      }
    } else {
      // Every other club: the quick pick, then swaps between the places it filled while the team's total rises (the
      // greedy fill can give a good all-rounder a place a specialist should have had). Each player-and-place pair is
      // worked out once, so it costs little.
      const memo = new Map();
      // (a national side you manage keeps the players you placed)
      const locked = new Set(
        (tactic.lineup || []).map((pid, i) => (xi[i] && xi[i].id === pid ? i : -1)).filter((i) => i >= 0),
      );
      const val = (p, i) => {
        if (!p || (slots[i].t === 'GK') !== (p.pos === 'GK')) return 0;
        const key = p.id + ':' + i;
        let v = memo.get(key);
        if (v === undefined) {
          v =
            W.effAt(p, slots[i].t, slots[i], tactic.roles && tactic.roles[i]) *
            W.fitnessPick(p) *
            (p.loan && p.loan.promised ? 1.1 : 1);
          memo.set(key, v);
        }
        return v;
      };
      for (let pass = 0, better = true; better && pass < 3; pass++) {
        better = false;
        for (let i = 1; i < slots.length; i++)
          for (let j = i + 1; j < slots.length; j++)
            if (
              !locked.has(i) &&
              !locked.has(j) &&
              xi[i] &&
              xi[j] &&
              val(xi[j], i) + val(xi[i], j) > val(xi[i], i) + val(xi[j], j) + 1e-9
            ) {
              [xi[i], xi[j]] = [xi[j], xi[i]];
              better = true;
            }
      }
    }
    // Over a limit: take out the limited starter whose best unlimited replacement costs the least at his position,
    // until the XI is within every limit (so the cap costs a little quality, not a keeper at wing-back)
    const slotVal = (p, i) =>
      !p || (slots[i].t === 'GK') !== (p.pos === 'GK') ? 0 : W.effAt(p, slots[i].t) * W.fitnessPick(p);
    while (lims.length && over(xi)) {
      let pick = null;
      xi.forEach((p, i) => {
        if (!p || !lims.some((l) => l.f(p) && xi.filter((q) => q && l.f(q)).length > l.cap)) return;
        const sub = pool
          .filter((q) => !used.has(q.id) && !limited(q))
          .reduce((b, q) => (slotVal(q, i) > slotVal(b, i) ? q : b), null);
        const loss = slotVal(p, i) - slotVal(sub, i) + (sub ? 0 : 1e6);
        if (!pick || loss < pick.loss) pick = { i, sub, loss };
      });
      if (!pick || !pick.sub) break; // no domestic player left to bring in
      used.delete(xi[pick.i].id);
      used.add(pick.sub.id);
      xi[pick.i] = pick.sub;
    }
    const left = lims.map((l) => l.cap - xi.filter((p) => p && l.f(p)).length);
    // Bench: a keeper, then cover for defence, midfield and attack, then the best of the rest (within the limits)
    const rest = pool.filter((p) => !used.has(p.id)).sort((a, b) => b.ca - a.ca);
    const bench = [];
    const add = (p) => {
      if (!p || bench.includes(p) || bench.length >= 9 || lims.some((l, k) => l.f(p) && left[k] <= 0)) return;
      bench.push(p);
      lims.forEach((l, k) => l.f(p) && left[k]--);
    };
    add(rest.find((p) => p.pos === 'GK'));
    // cover for each area: the best of the rest who can play there, by his own position or one he has learned
    for (const t of ['CB', 'FB', 'CM', 'W', 'ST'])
      add(rest.find((p) => p.pos !== 'GK' && !bench.includes(p) && W.fitAt(p, t) >= 0.85));
    for (const g of ['DEF', 'MID', 'ATT']) add(rest.find((p) => !bench.includes(p) && D.POS_GROUP[p.pos] === g));
    for (const p of rest) if (p.pos !== 'GK') add(p);
    for (const p of rest) add(p); // a second keeper only if places are left
    return { xi, bench };
  };

  // ---------------- Competitions ----------------
  W.roundRobin = function (ids) {
    const t = U.shuffle(ids);
    if (t.length % 2) t.push(null);
    const n = t.length,
      rounds = [];
    for (let r = 0; r < n - 1; r++) {
      const rd = [];
      for (let i = 0; i < n / 2; i++) {
        const a = t[i],
          b = t[n - 1 - i];
        if (a && b) rd.push(r % 2 ? [a, b] : [b, a]);
      }
      rounds.push(rd);
      t.splice(1, 0, t.pop());
    }
    const second = rounds.map((rd) => rd.map(([h, a]) => [a, h]));
    return rounds.concat(second);
  };

  // Fixtures put where the manager wanted them (a world definition's pins: { round, h, a }, round counted from 0). Swapping
  // the clubs of a round-robin around keeps it a round-robin, so the pinned matches are placed by choosing which club plays
  // which part of the pattern: a search over the pins in turn. Returns the rounds with the clubs swapped, or null.
  W.pinRounds = function (rounds, pins) {
    const map = {},
      used = {};
    const place = (i) => {
      if (i === pins.length) return true;
      const p = pins[i];
      for (const [x, y] of rounds[p.round] || []) {
        if ((map[x] ?? p.h) !== p.h || (map[y] ?? p.a) !== p.a) continue;
        const setX = map[x] === undefined,
          setY = map[y] === undefined;
        if ((setX && used[p.h] !== undefined) || (setY && used[p.a] !== undefined)) continue;
        if (setX) ((map[x] = p.h), (used[p.h] = x));
        if (setY) ((map[y] = p.a), (used[p.a] = y));
        if (place(i + 1)) return true;
        if (setX) (delete map[x], delete used[p.h]);
        if (setY) (delete map[y], delete used[p.a]);
      }
      return false;
    };
    if (!place(0)) return null;
    const ids = [...new Set(rounds.flat(2))],
      free = ids.filter((id) => used[id] === undefined);
    ids.filter((id) => map[id] === undefined).forEach((id, i) => (map[id] = free[i]));
    return rounds.map((rd) => rd.map(([h, a]) => [map[h], map[a]]));
  };

  // Conference membership of a league's clubs (comp.conf: club id -> conference). Clubs the rules don't name (a club
  // that arrived by promotion, say) join the smaller conference.
  W.conferenceOf = function (comp) {
    const names = Object.keys(comp.rules.conferences);
    comp.conf = comp.conf || {};
    for (const [n, codes] of Object.entries(comp.rules.conferences))
      for (const code of codes) if (comp.clubs.includes('c_' + code)) comp.conf['c_' + code] = n;
    for (const id of Object.keys(comp.conf)) if (!comp.clubs.includes(id)) delete comp.conf[id];
    const size = (n) => comp.clubs.filter((id) => comp.conf[id] === n).length;
    for (const id of comp.clubs) if (!comp.conf[id]) comp.conf[id] = names.slice().sort((a, b) => size(a) - size(b))[0];
    return comp.conf;
  };
  // one conference's standings (the table's order, restricted to its clubs)
  W.confTable = (comp, n) => W.sortedTable(comp).filter((r) => comp.conf && comp.conf[r.id] === n);
  W.confClubs = (comp, n) => comp.clubs.filter((id) => comp.conf && comp.conf[id] === n);

  // An MLS-style schedule: each conference plays a double round-robin among itself (the odd club out each round meets
  // its counterpart from the other conference), and four more rounds are played entirely across the conferences.
  W.conferenceRounds = function (comp) {
    W.conferenceOf(comp);
    const names = Object.keys(comp.rules.conferences),
      A = W.confClubs(comp, names[0]),
      B = W.confClubs(comp, names[1]);
    const rrA = W.roundRobin(A),
      rrB = W.roundRobin(B);
    const n = Math.max(rrA.length, rrB.length);
    const used = new Set();
    const key = (x, y) => (x < y ? x + '|' + y : y + '|' + x);
    const flip = (x, y) => (Math.random() < 0.5 ? [x, y] : [y, x]);
    const rounds = [];
    for (let r = 0; r < n; r++) {
      const rd = [...(rrA[r] || []), ...(rrB[r] || [])];
      const idle = (grp, lst) => {
        const playing = new Set((lst[r] || []).flat());
        return grp.filter((id) => !playing.has(id));
      };
      const ia = idle(A, rrA),
        ib = idle(B, rrB);
      for (let i = 0; i < Math.min(ia.length, ib.length); i++) {
        rd.push(flip(ia[i], ib[i]));
        used.add(key(ia[i], ib[i]));
      }
      rounds.push(rd);
    }
    // cross-conference rounds: a random perfect matching that avoids repeating a pairing where it can
    const crossRounds = [];
    const extra = Math.max(0, (comp.rules.rounds || 34) - n);
    for (let k = 0; k < extra; k++) {
      let best = null;
      for (let tries = 0; tries < 30; tries++) {
        const a = U.shuffle(A),
          b = U.shuffle(B),
          m = Math.min(a.length, b.length);
        const pairs = a.slice(0, m).map((id, i) => [id, b[i]]);
        const dup = pairs.filter(([x, y]) => used.has(key(x, y))).length;
        if (!best || dup < best.dup) best = { pairs, dup };
        if (!dup) break;
      }
      best.pairs.forEach(([x, y]) => used.add(key(x, y)));
      crossRounds.push(best.pairs.map(([x, y]) => flip(x, y)));
    }
    // the extra rounds are spread through the season rather than bunched at the end
    crossRounds.forEach((rd, k) =>
      rounds.splice(Math.round(((k + 1) * (rounds.length + 1)) / (crossRounds.length + 1)) + k, 0, rd),
    );
    return rounds;
  };

  const blankRow = (pts = 0) => ({ p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts, form: [] });

  // Argentina's format: two zones of equal size (snaked by reputation), each playing its zone once and then a
  // cross-zone round, twice a year: the Apertura, then the Clausura with the home matches reversed.
  W.zoneRounds = function (comp) {
    const ids = comp.clubs.slice().sort((a, b) => FM.clubOf(b).rep - FM.clubOf(a).rep),
      A = [],
      B = [];
    ids.forEach((id, i) => (i % 4 === 0 || i % 4 === 3 ? A : B).push(id));
    comp.zones = {};
    A.forEach((id) => (comp.zones[id] = 'A'));
    B.forEach((id) => (comp.zones[id] = 'B'));
    const rrA = W.roundRobin(A),
      rrB = W.roundRobin(B),
      hA = rrA.length / 2,
      hB = rrB.length / 2,
      h = Math.max(hA, hB);
    const cross = A.slice(0, Math.min(A.length, B.length)).map((a, i) => (Math.random() < 0.5 ? [a, B[i]] : [B[i], a]));
    const t1 = [],
      t2 = [];
    // (each zone's two halves from its own length, so zones of different sizes keep their second half)
    for (let r = 0; r < h; r++) {
      t1.push([...(rrA[r] && r < hA ? rrA[r] : []), ...(rrB[r] && r < hB ? rrB[r] : [])]);
      t2.push([...(r < hA ? rrA[hA + r] || [] : []), ...(r < hB ? rrB[hB + r] || [] : [])]);
    }
    t1.push(cross);
    t2.push(cross.map(([x, y]) => [y, x]));
    return t1.concat(t2);
  };

  // The rounds played after a league splits (a round per index, the groups' matches side by side)
  W.splitRounds = (sp) =>
    Math.max(
      0,
      ...sp.groups.map((n, i) =>
        sp.rounds[i] === 'none' ? 0 : (n % 2 ? n : n - 1) * (sp.rounds[i] === 'double' ? 2 : 1),
      ),
    );

  W.setupSeasonFixtures = function (comp) {
    const R = comp.rules || {};
    comp.table = {};
    comp.clubs.forEach((id) => (comp.table[id] = blankRow(comp.deductions?.[id] ? -comp.deductions[id] : 0)));
    comp.deductions = {};
    let rounds = R.conferences ? W.conferenceRounds(comp) : R.zones ? W.zoneRounds(comp) : W.roundRobin(comp.clubs);
    if (R.rounds)
      rounds = rounds.slice(0, R.rounds); // formats shorter than a double round-robin
    else if (R.legs === 1 && !R.zones && !R.conferences && !R.split)
      rounds = rounds.slice(0, Math.ceil(rounds.length / 2)); // once each
    comp.groupOf = null;
    comp.groups = null;
    comp.split = null;
    if (R.split) {
      // a regular season of `after` rounds (a third time round for the 33-game leagues), then the split
      while (rounds.length < R.split.after) {
        const rr = W.roundRobin(comp.clubs);
        rounds = rounds.concat(rr.slice(0, rr.length / 2));
      }
      rounds = rounds.slice(0, R.split.after);
      for (let i = W.splitRounds(R.split); i > 0; i--) rounds.push([]);
      comp.split = { done: false };
    }
    // matches fixed by hand: those whose clubs are in the league and whose matchday exists (the rest of the pins give way
    // one at a time if no schedule can hold them all)
    if (R.pins && R.pins.length && !R.conferences && !R.zones) {
      const regular = R.split ? R.split.after : rounds.length;
      let pins = R.pins
        .filter((p) => comp.clubs.includes(p.h) && comp.clubs.includes(p.a) && p.round >= 1 && p.round <= regular)
        .map((p) => ({ round: p.round - 1, h: p.h, a: p.a }));
      for (; pins.length; pins.pop())
        for (let i = 0; i < 6; i++) {
          const fixed = W.pinRounds(rounds, pins);
          if (fixed) {
            rounds = fixed;
            pins = [];
            break;
          }
        }
    }
    comp.fixtures = rounds.map((rd, r) =>
      rd.map(([h, a]) => ({ id: FM.nextId('f'), comp: comp.id, round: r, h, a, res: null })),
    );
    // two tournaments a year (Apertura and Clausura): each its own table, the season's table the two together
    comp.torneos = R.torneos
      ? R.torneos.map((name) => ({ name, table: Object.fromEntries(comp.clubs.map((id) => [id, blankRow()])) }))
      : null;
    comp.torneoHalf = comp.torneos ? Math.ceil(comp.fixtures.length / 2) : 0;
    comp.playoff = null;
    comp.ko = null;
  };

  // The split: after the regular season the table divides into groups (the top six, the rest ...) that play each other
  // again; the points carry over, or are halved (rounded up) where the real league does. Final positions go group
  // by group, whatever the points.
  W.doSplit = function (c) {
    const sp = c.rules.split,
      t = W.sortedTable(c);
    c.groupOf = {};
    c.groups = [];
    let at = 0;
    sp.groups.forEach((n, g) => {
      const ids = t.slice(at, at + n).map((r) => r.id);
      at += n;
      ids.forEach((id) => (c.groupOf[id] = g));
      c.groups.push(ids);
    });
    if (sp.halve) for (const id of c.clubs) c.table[id].pts = Math.ceil(c.table[id].pts / 2);
    const per = c.groups.map((ids, g) => {
      if (sp.rounds[g] === 'none' || ids.length < 2) return [];
      const rr = W.roundRobin(ids);
      return sp.rounds[g] === 'double' ? rr : rr.slice(0, rr.length / 2);
    });
    for (let j = 0; j < c.fixtures.length - sp.after; j++)
      c.fixtures[sp.after + j] = per.flatMap((rds) =>
        (rds[j] || []).map(([h, a]) => ({ id: FM.nextId('f'), comp: c.id, round: sp.after + j, h, a, res: null })),
      );
    c.split.done = true;
    const uc = FM.S.user && W.userClub(); // (a world with no manager yet, as in the developer tools, has none)
    if (uc && uc.comp === c.id)
      FM.News.add({
        type: 'world',
        title: `${c.name} splits`,
        body: `${sp.names
          .map(
            (n, g) =>
              `${n}: ${c.groups[g]
                .slice(0, 3)
                .map((id) => FM.clubOf(id).name)
                .join(', ')}${c.groups[g].length > 3 ? '…' : ''}`,
          )
          .join(' · ')}.${sp.halve ? ' Points are halved.' : ' Points carry over.'}`,
        big: false,
      });
  };

  // A table in order: points, then the competition's own tiebreakers (D.TIEBREAK: head-to-head, wins, goal
  // difference, goals scored, in the order its real rules use), then the club's name. comp: a league, or a group
  // ({ table, fixtures, tiebreak }) — head-to-head reads the results from its fixtures.
  W.sortedTable = function (comp) {
    const grp = (id) => (comp.groupOf && comp.groupOf[id]) || 0; // a split league: group by group
    const rows = Object.entries(comp.table)
      .map(([id, r]) => ({ id, ...r, gd: r.gf - r.ga }))
      .sort(
        (a, b) => grp(a.id) - grp(b.id) || b.pts - a.pts || FM.clubOf(a.id).name.localeCompare(FM.clubOf(b.id).name),
      );
    const rule = comp.tiebreak || (comp.rules && comp.rules.tiebreak) || D.TIEBREAK[comp.id] || D.TIEBREAK_DEFAULT;
    for (let i = 0; i < rows.length;) {
      let j = i + 1;
      while (j < rows.length && rows[j].pts === rows[i].pts && grp(rows[j].id) === grp(rows[i].id)) j++;
      if (j - i > 1) {
        const run = rows.slice(i, j);
        // head-to-head among the clubs level on points (only worked out when a rule asks for it)
        let mini = null;
        if (rule.includes('h2h') && comp.fixtures) {
          const ids = new Set(run.map((r) => r.id));
          mini = Object.fromEntries(run.map((r) => [r.id, { pts: 0, gd: 0, gf: 0 }]));
          for (const f of comp.fixtures.flat()) {
            if (!f.res || !ids.has(f.h) || !ids.has(f.a)) continue;
            const H = mini[f.h],
              A = mini[f.a],
              win = W.rule(comp.id, 'win');
            H.gf += f.res.hg;
            A.gf += f.res.ag;
            H.gd += f.res.hg - f.res.ag;
            A.gd += f.res.ag - f.res.hg;
            if (f.res.hg > f.res.ag) H.pts += win;
            else if (f.res.hg < f.res.ag) A.pts += win;
            else {
              H.pts++;
              A.pts++;
            }
          }
        }
        const by = {
          gd: (a, b) => b.gd - a.gd,
          gf: (a, b) => b.gf - a.gf,
          wins: (a, b) => b.w - a.w,
          h2h: (a, b) =>
            mini
              ? mini[b.id].pts - mini[a.id].pts || mini[b.id].gd - mini[a.id].gd || mini[b.id].gf - mini[a.id].gf
              : 0,
        };
        run.sort(
          (a, b) =>
            rule.reduce((v, k) => v || by[k](a, b), 0) || FM.clubOf(a.id).name.localeCompare(FM.clubOf(b.id).name),
        );
        rows.splice(i, run.length, ...run);
      }
      i = j;
    }
    return rows;
  };
  // one tournament's table (Apertura / Clausura), and one zone of it (Argentina)
  W.torneoTable = function (comp, t, zone) {
    const half = comp.torneoHalf,
      fx = (t ? comp.fixtures.slice(half) : comp.fixtures.slice(0, half)).flat();
    const rows = W.sortedTable({ id: comp.id, rules: comp.rules, table: comp.torneos[t].table, fixtures: [fx] });
    return zone ? rows.filter((r) => comp.zones && comp.zones[r.id] === zone) : rows;
  };
  W.position = (clubId) => {
    const c = FM.S.clubs[clubId];
    return W.sortedTable(FM.S.comps[c.comp]).findIndex((r) => r.id === clubId) + 1;
  };

  W.leagues = () => Object.values(FM.S.comps).filter((c) => c.type === 'league');
  W.cups = () => Object.values(FM.S.comps).filter((c) => c.type === 'cup');
  // the domestic cups: the European knockout cups (Holders', Summer) have days of their own
  W.domesticCups = () => W.cups().filter((c) => !c.euro);
  W.continentals = () => Object.values(FM.S.comps).filter((c) => c.type === 'continental');

  W.worldCups = () => Object.values(FM.S.comps).filter((c) => c.type === 'world');
  // A competition's own rules: points for a win and substitutes (leagues and group tables), extra time and away goals (cups
  // and play-offs). Each is the world's rule unless the competition has set its own (a world definition's, in rules.play for
  // a league, opts.play for a domestic cup, play for a continental cup)
  W.playRules = (compId) => {
    const c = FM.S.comps[compId];
    return (
      (c && (c.type === 'league' ? c.rules && c.rules.play : c.type === 'cup' ? c.opts && c.opts.play : c.play)) || {}
    );
  };
  W.rule = (compId, key) => {
    const v = W.playRules(compId)[key];
    return v != null ? v : key === 'extraTime' ? true : FM.S.rules[key];
  };
  W.simOf = (compId) => (FM.S.comps[compId] && FM.S.comps[compId].sim) || 'full';

  // The season has as many league days as the longest league has rounds (S.rounds). Every league spreads its own
  // rounds evenly across them, so a 38-round and a 46-round league both start in August and finish in May.
  // Calendar events were designed on a 22-round season; W.scaleRound / W.baseRound convert between the two.
  W.scaleRound = (r) => Math.round((r * ((FM.S.rounds || 22) - 1)) / 21);
  W.baseRound = (r) => Math.round((r * 21) / ((FM.S.rounds || 22) - 1));
  W.dayScale = () => 21 / ((FM.S.rounds || 22) - 1); // per-day rates tuned on 22 league days
  // A league's own round on league day r (-1: it doesn't play that day), its fixtures, and rounds before day r
  W.roundOn = (c, r) => (c.onDay ? (c.onDay[r] ?? -1) : r);
  W.roundFixtures = (c, r) => {
    const k = W.roundOn(c, r);
    if (k < 0) return null;
    // a split league makes its post-split rounds once every regular-season match is in
    const sp = c.rules.split;
    if (sp && c.split && !c.split.done && k >= sp.after) {
      if (c.fixtures.slice(0, sp.after).every((rd) => rd.every((f) => f.res))) W.doSplit(c);
      else return [];
    }
    return c.fixtures[k] || null;
  };
  W.roundsBefore = (c, r) => {
    if (!c.onDay) return Math.min(r, c.fixtures.length);
    let n = 0;
    for (let i = 0; i < r && i < c.onDay.length; i++) if (c.onDay[i] >= 0) n++;
    return n;
  };

  // League days with midweek cup, continental, World Club Championship and international days slotted in between.
  // Two-legged knockouts add a second leg day; tournament summers append the finals at the end.
  const KO_STAGES = ['M1', 'M2', 'M3', 'M4'];
  // the kind of title playoff a league has: 'mls', 'finals6', 'liguilla' or 'zones' (none: null)
  W.koType = (c) => (c.rules.playoffs && c.rules.playoffs.type) || (c.rules.mls ? 'mls' : null);
  W.buildCalendar = function () {
    const S = FM.S,
      rounds = Math.max(...W.leagues().map((c) => c.fixtures.length));
    S.rounds = rounds;
    for (const c of W.leagues()) {
      const n = c.fixtures.length;
      c.onDay = Array(rounds).fill(-1);
      for (let k = 0; k < n; k++) c.onDay[n > 1 ? Math.round((k * (rounds - 1)) / (n - 1)) : 0] = k;
    }
    const at = (map) => {
      const out = {};
      for (const [k, v] of Object.entries(map)) {
        let r = W.scaleRound(+k);
        while (out[r] !== undefined) r++;
        out[r] = v;
      }
      return out;
    };
    let CC = at(D.CC_AFTER);
    const CWC = at(D.CWC_AFTER),
      INTL = at(D.INTL_AFTER);
    // Clubs that drop down from a continental cup into the one below play a knockout play-off before the quarter-finals: a
    // day of its own where the quarter-finals began, and the rest of the knockouts a day later
    if (W.continentals().some((c) => c.drop && S.comps[c.drop])) {
      const seq = Object.entries(CC)
          .map(([k, st]) => [+k, st])
          .sort((a, b) => a[0] - b[0]),
        qi = seq.findIndex(([, st]) => /^(QF|SF)/.test(st));
      if (qi >= 0) {
        seq.splice(qi, 0, [seq[qi][0], 'PO']);
        const moved = {};
        let last = -1;
        for (const [k, st] of seq) {
          const at2 = Math.max(k, last + 1);
          moved[at2] = st;
          last = at2;
        }
        CC = moved;
      }
    }
    // Domestic cup days: enough rounds for the biggest cup (byes even out the first round), spread through the season
    const cupDays = Math.max(Object.keys(D.CUP_AFTER).length, ...W.domesticCups().map((c) => FM.Cups.daysNeeded(c)));
    const CUP = {},
      c0 = W.scaleRound(1),
      c1 = W.scaleRound(19);
    for (let i = 0; i < cupDays; i++) {
      let r = Math.round(c0 + (i * (c1 - c0)) / Math.max(1, cupDays - 1));
      while (CUP[r]) r++;
      CUP[r] = 'DC';
    }
    // Regional cups (county cups, state championships) get days of their own early in the season
    const RC = {},
      rcDays = FM.Regional.daysNeeded();
    for (let i = 0; i < rcDays; i++) {
      let r = W.scaleRound(2 + 2 * i);
      while (RC[r]) r++;
      RC[r] = true;
    }
    // The European knockout cups: the Summer Cup in the first rounds (its final before the Trophy's group stage begins), the
    // Holders' Cup spread through the season
    const EURO = {};
    for (const c of W.cups().filter((x) => x.euro)) {
      const n = FM.Cups.daysNeeded(c);
      const map = {};
      for (let i = 0; i < n; i++)
        map[c.euro === 'summer' ? Math.min(i, 2) : Math.round(3 + (i * 17) / Math.max(1, n - 1))] = c.id;
      // (two days that land on the same round follow one another)
      for (const [k, id] of Object.entries(map)) {
        let r = W.scaleRound(+k);
        while ((EURO[r] || []).includes(id)) r++;
        (EURO[r] = EURO[r] || []).push(id);
      }
    }
    const legs = !!S.rules.twoLegs;
    const mid = W.leagues().filter((c) => W.koType(c) && c.torneos);
    const cal = [];
    for (let i = 0; i < D.PRESEASON_DAYS; i++) cal.push({ type: 'pre', idx: i });
    // The super cups, in one day before the first league round
    const sup = FM.Cups.supers();
    if (sup.length) cal.push({ type: 'cup', comps: sup.map((c) => c.id), stage: 'SUP', super: true });
    for (let r = 0; r < rounds; r++) {
      cal.push({ type: 'league', round: r });
      // the first tournament's knockouts follow its last round
      if (mid.some((c) => c.onDay[r] === c.torneoHalf - 1))
        for (const m of KO_STAGES) cal.push({ type: 'playoff', stage: m, torneo: 0 });
      for (const id of EURO[r] || []) cal.push({ type: 'cup', comps: [id] });
      let st = CC[r];
      if (st && !legs) st = /2$/.test(st) && st !== 'G2' ? null : st.replace(/^(QF|SF)1$/, '$1');
      if (st && W.continentals().length) cal.push({ type: 'cup', comps: W.continentals().map((c) => c.id), stage: st });
      // a final played over two legs (the CAF and CONCACAF cups) has its return on the next day
      if (st === 'F' && legs && W.continentals().length)
        cal.push({ type: 'cup', comps: W.continentals().map((c) => c.id), stage: 'F2' });
      // the Intercontinental Cup, mid-season (the World Club Championship has its own days in the summer, below)
      if (CWC[r] && W.worldCups().some((c) => c.fmt === 'ic'))
        cal.push({
          type: 'cup',
          comps: W.worldCups()
            .filter((c) => c.fmt === 'ic')
            .map((c) => c.id),
          stage: CWC[r],
          world: true,
        });
      if (CUP[r] && W.domesticCups().length) cal.push({ type: 'cup', comps: W.domesticCups().map((c) => c.id) });
      if (RC[r]) cal.push({ type: 'cup', regional: true, comps: FM.Regional.regionals().map((c) => c.id) });
      if (INTL[r] && S.nteams) INTL[r].forEach((tag) => cal.push({ type: 'intl', tag }));
    }
    // Title playoffs (the MLS Cup, A-League finals, the Liguilla, Argentina's knockouts): four days, the last tournament's at the
    // end of the season (a league with one tournament uses days with no tournament set)
    if (W.leagues().some((c) => W.koType(c) && !c.torneos))
      for (const m of KO_STAGES) cal.push({ type: 'playoff', stage: m });
    if (W.leagues().some((c) => W.koType(c) && c.torneos))
      for (const m of KO_STAGES) cal.push({ type: 'playoff', stage: m, torneo: 1 });
    if (legs)
      cal.push(
        { type: 'playoff', stage: 'SF1' },
        { type: 'playoff', stage: 'SF2' },
        { type: 'playoff', stage: 'F' },
        { type: 'playoff', stage: 'F2' },
      );
    else cal.push({ type: 'playoff', stage: 'SF' }, { type: 'playoff', stage: 'F' });
    // The World Club Championship: every fourth summer, after the playoffs (seven days: three of groups, then the knockouts)
    const cwc = W.worldCups().filter((c) => c.fmt === 'cwc' && c.on && c.groups);
    if (cwc.length)
      for (const stage of D.CWC_SUMMER)
        if (stage !== 'R16' || cwc.some((c) => c.groups.length >= 8))
          cal.push({ type: 'cup', comps: cwc.map((c) => c.id), stage, world: true, summer: true });
    // International tournament finals in the summer at the end of this season
    if (S.nteams && FM.Intl.tournamentFor(S.year))
      FM.Intl.tournamentStages(S.year).forEach((stage) => cal.push({ type: 'tourn', stage }));
    return W.dateCalendar(W.spreadCalendar(cal));
  };

  // Midweek football. A club's league games are the weekend and its cups are midweek, so at most one cup day sits in the gap
  // between two league rounds: a cup day that would follow another one (or that falls on an international break) moves to
  // the next gap, in the same order, so no club plays three days in a row because several competitions share a round. What
  // is left over after the last league round is played on consecutive midweeks before the play-offs.
  W.spreadCalendar = function (cal) {
    let last = -1;
    cal.forEach((e, i) => {
      if (e.type === 'league') last = i;
    });
    if (last < 0) return cal;
    const out = [],
      queue = [];
    for (let i = 0; i <= last; i++) {
      const e = cal[i];
      if (e.type === 'cup') {
        queue.push(e);
        continue;
      }
      out.push(e);
      if (e.type === 'league' && queue.length) out.push(queue.shift());
    }
    let i = last + 1;
    while (i < cal.length && cal[i].type === 'cup') queue.push(cal[i++]);
    out.push(...queue, ...cal.slice(i));
    return out;
  };

  // Every day of the calendar gets a date: dn = days since the first league day (a Saturday at the start of August). A league day
  // follows the last by a week and a cup day sits three or four days from a league day, so a long season is squeezed
  // into early August to the end of May; each day then goes to the nearest weekday that suits it (league games Friday to
  // Sunday, cups Tuesday to Thursday, international breaks Thursday and Monday).
  W.CAL_BUDGET = 300; // days from the first league day to the last
  const DAYS = { L: [5, 6, 0], C: [2, 3, 4], I: [4, 1], X: [0, 1, 2, 3, 4, 5, 6] },
    TIGHT = [3, 5, 6, 0]; // (a season too long for a week a round plays some league rounds midweek)
  W.dateCalendar = function (cal, year = FM.S.year) {
    const kind = (e) => (e.type === 'league' ? 'L' : e.type === 'cup' ? 'C' : e.type === 'intl' ? 'I' : 'X');
    const pre = cal.filter((e) => e.type === 'pre');
    const main = cal.filter((e) => e.type !== 'pre');
    const lastL = main.reduce((m, e, i) => (e.type === 'league' ? i : m), 0);
    const base = (d) => W.seasonDate(d, year).getUTCDay();
    const gaps = main.map((e, i) => {
      const a = i ? kind(main[i - 1]) : null,
        b = kind(e);
      return !a
        ? 0
        : a === 'L' && b === 'L'
          ? 7
          : a === 'L' && b === 'C'
            ? 3
            : a === 'C' && b === 'L'
              ? 4
              : a === 'C' && b === 'C'
                ? 2
                : a === 'I' && b === 'I'
                  ? 3
                  : a === 'I' || b === 'I'
                    ? 4
                    : e.type === 'playoff' || e.type === 'tourn'
                      ? 2
                      : 3;
    });
    const total = gaps.slice(0, lastL + 1).reduce((s, g) => s + g, 0);
    const f = Math.min(1, W.CAL_BUDGET / total);
    let prev = -1,
      at = 0;
    main.forEach((e, i) => {
      at = i <= lastL ? at + gaps[i] * f : prev + gaps[i]; // (after the last league day, from where it fell)
      const k = kind(e),
        pk = i ? kind(main[i - 1]) : null,
        from = prev + (k === 'L' && pk === 'L' ? 3 : pk && k !== 'X' && pk !== 'X' && pk !== k ? 2 : 1);
      let best = Math.max(Math.round(at), from);
      if (e.type !== 'playoff' && e.type !== 'tourn') {
        let dist = 99;
        for (let d = from; d <= Math.max(Math.round(at), from) + 6; d++) {
          // (a Saturday is the day for a league game, a Friday or Sunday next to it)
          const off = Math.abs(d - at) + (k === 'L' && base(d) !== 6 ? 1.2 : 0);
          if ((f < 1 && k === 'L' ? TIGHT : DAYS[k]).includes(base(d)) && off < dist) {
            best = d;
            dist = off;
          }
        }
      }
      e.dn = prev = best;
    });
    pre.forEach((e, i) => (e.dn = -(pre.length - i) * 4));
    return cal;
  };
  // The date of a day number: the first Saturday on or after 1 August of the season's year
  W.seasonDate = function (dn, year = FM.S.year) {
    const d = new Date(Date.UTC(year, 7, 1));
    d.setUTCDate(1 + ((6 - d.getUTCDay() + 7) % 7) + dn);
    return d;
  };
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  W.dateText = function (dn, year = FM.S.year) {
    const d = W.seasonDate(dn, year);
    return `${DOW[d.getUTCDay()]} ${d.getUTCDate()} ${MON[d.getUTCMonth()]}`;
  };

  // ---------------- New world ----------------
  // One club of the world from its row (name, code, city, colours, identity, reputation, ground, capacity): the club itself,
  // its manager, attributes and a squad. Used for every club of a new world and for the clubs an expansion adds
  W.mkClub = function (row, compId, nat, sim) {
    const S = FM.S;
    const [name, code, city, c1, c2, identity, rep] = row;
    const info = D.CLUB_INFO[code] || [],
      short = info[0] || code.replace(/([A-Z]{3,})\d$/, '$1'); // what the game shows: the club's real abbreviation
    const stadium =
      row[7] || { MEX: `Estadio ${city}`, MAR: `Stade de ${city}`, SRB: `Stadion ${city}` }[nat] || `${city} Stadium`;
    const cap = row[8] || Math.round((8000 + (rep - 40) * 900) / 500) * 500;
    const id = 'c_' + code,
      parent = row[9] ? 'c_' + row[9] : null; // a B team's parent club
    const idt = D.IDENTITY[identity];
    // (a first season's budget, from what the club earns: the ambition of its identity and its revenue; later ones follow its accounts)
    const budget =
      Math.round((FM.Season.revenuePotential({ rep }) * 0.15 * idt.budget) / 1e5) *
      1e5 *
      (sim === 'full' ? 1 : sim === 'light' ? 0.6 : 0.3);
    const club = {
      id,
      name,
      short,
      nick: W.nickClash(info[1], [c1, c2]) ? '' : info[1] || '', // its nickname, where it has a well-known one that fits its colours
      founded: info[2] || null, // the year it was founded, where the world has one
      crest: info[3] || null, // a design of its own: [shape, pattern, emblem] (a world definition's)
      city,
      nat,
      colors: [c1, c2],
      identity,
      policy: D.CLUB_POLICY[code] || null, // who the club will sign (the Basque and Catalan clubs of Spain's second division)
      rep,
      parent,
      stadium: { name: stadium, cap, cap0: cap },
      comp: compId,
      sim,
      balance: budget * 2.5 + 4e6,
      budget,
      fanMood: 60,
      boardConf: 65,
      facilities: {
        training: U.randi(2, 4),
        academy: identity === 'youth' ? 4 : U.randi(1, 3),
        medical: U.randi(2, 3),
        analytics: U.randi(1, 3),
        stadium: 1,
        fanzone: U.randi(1, 2),
        museum: rep > 70 ? 2 : 1,
      },
      tactic: W.aiTactic({ identity, rep }),
      chant: U.pick(D.CHANTS)
        .replace('{city}', city)
        .replace('{short}', short)
        .replace('{nick}', (info[1] || name.split(' ').pop()).replace(/^(The|Die|Les|Los|Los|Le|La|El|Il|De) /, '')),
      tradition: D.TRADITIONS[U.hash(code) % D.TRADITIONS.length], // fixed by the club, so the picker can show it first
      rival: null,
      derby: null,
      titles: {},
      ledger: [],
      bestSales: [],
      manager:
        sim === 'minimal'
          ? null
          : W.genStaff('Manager', U.chance(0.75) ? nat : U.pick(D.nationCodes()), {
              rep: Math.round(rep * U.rand(0.8, 1.05)),
            }).id,
    };
    S.clubs[id] = club;
    S.comps[compId].clubs.push(id);
    W.clubAttr(club);
    genSquad(club);
    return club;
  };

  W.newWorld = function (opts) {
    FM.S = {
      version: FM.SAVE_VERSION,
      nextId: 1,
      year: opts.startYear || D.SEASON_START, // groundwork for saves that start in a past season
      day: 0,
      players: {},
      clubs: {},
      comps: {},
      staff: {},
      news: [],
      archive: [],
      retired: [],
      wbPos: 2, // wing-backs are a position from the start (older saves convert theirs on load)
      wmPos: 1, // so are wide midfielders (LM/RM)
      traitsV2: 1,
      policyV1: 1,
      intro: { year: opts.startYear || D.SEASON_START, n: 0, derby: false, met: {} }, // the first season introduces the world as it goes
      compRules: 3, // and each league's real promotion, relegation and play-off rules
      clubAbbr: 3, // clubs show their real abbreviations and nicknames
      rules: {
        win: opts.win || 3,
        subs: opts.subs || 5,
        foreignLimit: opts.foreignLimit ?? W.NO_LIMIT, // some real leagues have no cap: none unless chosen
        reg: opts.reg === undefined ? 'real' : opts.reg, // 'real': each league's own registration rules (FM.Reg)
        twoLegs: opts.twoLegs ?? true,
        awayGoals: !!opts.awayGoals,
        v: 2, // rules version: older saves move to the real rules on load (Sv.repair)
      },
      user: null,
      // the confederations a world adds or changes (names, and which confederation a nation is in): { names, members }
      confeds:
        opts.confeds && (Object.keys(opts.confeds.names || {}).length || Object.keys(opts.confeds.members || {}).length)
          ? JSON.parse(JSON.stringify({ names: opts.confeds.names || {}, members: opts.confeds.members || {} }))
          : null,
      // nations the world gives no national team (a world with its own set: the others still have players and leagues)
      noTeams: Array.isArray(opts.noTeams) && opts.noTeams.length ? opts.noTeams.slice() : null,
      settings: FM.S?.settings || { theme: 'dark', speed: 1 },
      // how much of the world each league is simulated in (full, light, minimal) where the player chose it before the
      // save began; a league not listed runs at its default tier from the data
      simPrefs: Object.fromEntries(
        Object.entries(opts.sims || {}).filter(([, v]) => ['full', 'light', 'minimal'].includes(v)),
      ),
    };
    const S = FM.S;
    const simOf = (l) => S.simPrefs[l.id] || l.sim;
    // Competitions are data: relationships (relegate/promote/qualify) drive the season, nothing is hardcoded
    D.LEAGUES.forEach(
      (l) =>
        (S.comps[l.id] = {
          id: l.id,
          type: 'league',
          nat: l.nat,
          name: l.name,
          short: l.short,
          tier: l.tier,
          sim: simOf(l),
          repBand: l.repBand,
          clubs: [],
          rules: JSON.parse(JSON.stringify(l.rules)),
        }),
    );
    D.DOMESTIC_CUPS.forEach(([id, nat, name, short, opts]) => FM.Cups.addDomestic(S, id, nat, name, short, opts));
    S.comps.FR = { id: 'FR', type: 'friendly', name: 'Pre-season friendly', short: 'FR', clubs: [] };
    D.CONTINENTALS.forEach((c) => (S.comps[c.id] = { ...c, type: 'continental', clubs: [] }));
    D.EURO_CUPS.forEach((d) => FM.Cups.addEuro(S, d));
    S.comps.CWC = FM.Cups.newCwc();
    S.comps.ICC = FM.Cups.newIc();

    const mkClub = W.mkClub;
    D.LEAGUES.forEach((l) => D[l.clubs].forEach((r) => mkClub(r, l.id, l.nat, simOf(l))));
    D.RIVALS.forEach(([a, b, name]) => {
      if (!S.clubs['c_' + a] || !S.clubs['c_' + b]) return;
      S.clubs['c_' + a].rival = 'c_' + b;
      S.clubs['c_' + b].rival = 'c_' + a;
      S.clubs['c_' + a].derby = S.clubs['c_' + b].derby = name;
    });
    D.CLUBS_OVERSEAS.forEach(([name, short, nat, c1, c2, rep]) => {
      const id = 'c_' + short;
      const club = {
        id,
        name,
        short,
        city: name,
        nat,
        colors: [c1, c2],
        identity: 'selling',
        rep,
        comp: null,
        sim: 'minimal',
        fanMood: 50,
        boardConf: 50,
        balance: 5e6,
        budget: 0,
        facilities: { academy: 2 },
        tactic: W.newTactic(),
        titles: {},
        bestSales: [],
      };
      S.clubs[id] = club;
      genSquad(club);
    });
    // Some unattached free agents
    for (let i = 0; i < 45; i++) {
      const age = U.randi(19, 34),
        ca = W.freeAgentCA(),
        pos = U.pick(D.POS);
      const p = W.genPlayer({ nat: U.pick(D.nationCodes()), pos, age, ca, pa: W.potentialFor(ca, age) });
      p.contract = S.year;
      S.players[p.id] = p;
    }
    for (const id in S.players) W.assignYouth(S.players[id], S.players[id].clubId); // where each grew up and who trained him
    FM.Contracts.seedWorld();
    W.leagues().forEach(W.setupSeasonFixtures);
    FM.Intl.setup();
    FM.Cups.setupSeason(null);
    S.calendar = W.buildCalendar();
    // A world with a past: players of 22+ have been at their club for a while (most 1–3 seasons, a few long-servers
    // a decade), with appearances to match their standing, so long-serving captains are club icons from day one
    for (const id in S.players) {
      const p = S.players[id],
        c = p.clubId && S.clubs[p.clubId],
        age = W.age(p);
      if (!c || age < 22) continue;
      const yrs = Math.min(age - 18, Math.floor(-Math.log(1 - Math.random()) * 3));
      if (yrs <= 0) continue;
      const share = p.ca >= W.levelFor(c.rep) - 2 ? 0.85 : p.ca >= W.levelFor(c.rep) - 10 ? 0.5 : 0.2;
      const sp = W.spell(p);
      sp.from = S.year - yrs;
      sp.apps = Math.round(yrs * 40 * share * U.rand(0.8, 1.1));
      p.career.apps += sp.apps;
    }
    for (const id in S.players) W.backfillHistory(S.players[id]); // up to three seasons of stats behind each player
    for (const id in S.players) S.players[id].value = W.value(S.players[id]); // priced with their final club and contract
    FM.Youth.assignAll(); // U21 and U18 squads from the start
    FM.Transfers.seedLoans(); // lower-division clubs start with players on loan from the better clubs
    return S;
  };

  // Attach the human manager to a club
  // The manager's own profile, independent of any club (a new career creates it; it survives every job)
  // who: a name, or a profile { fn, ln, nat, avatar: { e, bg } } from the new-career screen
  W.newManager = function (who, rep, nat) {
    const S = FM.S,
      prof = typeof who === 'string' ? { name: who } : who || {};
    const mgrName = prof.fn || prof.ln ? `${prof.fn || ''} ${prof.ln || ''}`.trim() : prof.name || 'New Manager';
    // The first three scouts come from where the club's football looks: one from its own nation, two from its part of the world
    // (or a region it has ties with), each knowing their home region and a near one
    const home = D.NATIONS[nat] ? nat : 'ENG',
      region = D.NATIONS[home].region,
      same = D.nationCodes().filter((n) => D.NATIONS[n].region === region && n !== home);
    const startNat = [
      home,
      U.pick(same.length ? same : [home]),
      Math.random() < 0.7 && same.length ? U.pick(same) : W.staffNation(home),
    ];
    const scouts = [15, 13, 12].map((ability, i) => W.genStaff('Scout', startNat[i], { ability }));
    S.user = {
      name: mgrName,
      fn: prof.fn || mgrName.split(' ')[0],
      ln: prof.ln || mgrName.split(' ').slice(1).join(' '),
      nat: prof.nat || nat,
      avatar: prof.avatar || null,
      clubId: null,
      rep: Math.round(rep),
      joined: S.year,
      badges: 'Continental B',
      stats: {
        games: 0,
        w: 0,
        d: 0,
        l: 0,
        youthDebuts: 0,
        giantKills: 0,
        promotions: 0,
        trophies: 0,
        bought: 0,
        sold: 0,
      },
      history: [],
      scouts: scouts.map((s) => s.id),
      assignments: [],
      knowledge: {},
      reports: {},
      shortlist: [],
      staff: {
        assistant: W.genStaff('Assistant Manager', nat).id,
        coach: W.genStaff('First-Team Coach', nat).id,
        analyst: W.genStaff('Head of Analytics', nat).id,
        physio: W.genStaff('Head Physio', nat).id,
        director: W.genStaff('Sporting Director', nat).id,
      },
      lastMatch: null,
      pendingPrompts: [],
      promises: [],
      talks: {},
      trust: 60,
      board: { year: S.year, meetings: 0 },
      nation: null,
      ntHistory: [],
      course: null,
      tactic: W.newTactic(),
      preseason: {},
      offers: [],
    };
    return S.user;
  };
  // A club's simulation tier follows its league (promotion from League One makes it fully simulated, and so on),
  // except the club you manage, which is always fully simulated: finances, squad size, records, the lot
  W.syncSim = function (c) {
    const comp = c && c.comp && FM.S.comps[c.comp];
    if (c) c.sim = W.isUser(c.id) ? 'full' : comp && comp.sim ? comp.sim : c.sim;
  };
  // Your league, the league above it and the league below it always play in the full engine (a light league becomes
  // full the moment it matters to you: relegated from the top flight, the third tier is suddenly next door). Every
  // other league runs at its base tier from the data. Re-applied when you take a job, lose one, and after promotion
  // and relegation.
  // The rules every career plays by: each competition's real ones (no world-rules choice at a new game)
  W.REAL_RULES = { win: 3, subs: 5, reg: 'real', foreignLimit: 99, twoLegs: true, awayGoals: false };
  W.applySimFocus = function () {
    const S = FM.S,
      uc = W.employed() && W.userClub(),
      my = uc && S.comps[uc.comp];
    const focus = new Set();
    if (my) {
      focus.add(my.id);
      const r = my.rules || {};
      if (r.promote) focus.add(r.promote.to);
      if (r.relegate) focus.add(r.relegate.to);
    }
    for (const c of W.leagues()) {
      if (!c.baseSim)
        c.baseSim = (S.simPrefs && S.simPrefs[c.id]) || (D.LEAGUES.find((l) => l.id === c.id) || {}).sim || c.sim;
      c.sim = focus.has(c.id) && c.baseSim !== 'minimal' ? 'full' : c.baseSim;
    }
    Object.values(S.clubs).forEach(W.syncSim);
  };
  // Avatars for the manager profile
  W.AVATARS = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '🏽',
    '🏾',
    '🏿',
    '🏻',
    '🏼‍',
    '🏽‍',
    '🏿‍',
    '',
    '',
  ];
  W.AVATAR_BG = ['#1f6feb', '#c8102e', '#0b8a3e', '#6a1b9a', '#f59e0b', '#0f172a', '#e11d48', '#0891b2'];
  W.homeLeague = (x) => !x.sim || x.sim === 'full' || D.LEAGUES.some((l) => l.nat === x.nat && l.sim === 'full');
  W.employed = () => !!(FM.S.user && FM.S.user.clubId && FM.S.clubs[FM.S.user.clubId]);
  // Out of work (sacked, resigned, or a career that starts without a club): the old club hires a successor,
  // time keeps passing, and job offers arrive through FM.Season.jobMarket
  W.goUnemployed = function (reason) {
    const S = FM.S,
      u = S.user,
      old = W.userClub();
    if (old) {
      const successor = W.genStaff('Manager', old.nat, { rep: old.rep });
      old.manager = successor.id;
      old.tactic = JSON.parse(JSON.stringify(u.tactic)); // the club keeps playing the way it was set up
      delete old.tactic.lineup;
      delete old.tactic.capt;
      delete old.tactic.captAuto;
      delete old.tactic.sp;
      if (FM.Records) FM.Records.managerJoined(successor, old.id);
      u.history.push({ club: old.id, left: S.year, reason });
    }
    (u.promises || []).forEach((x) => {
      if (x.state === 'open') {
        x.state = 'void';
        x.closed = S.day;
      }
    });
    // Decisions still waiting in the feed belonged to the old job
    S.news.forEach((n) => {
      if (n.type === 'bid' && n.data && n.data.status === 'open') {
        n.data.status = 'void';
        n.reply = 'You left the club before answering.';
      }
      if ((n.type === 'press' || n.type === 'meeting') && !n.resolved) {
        n.resolved = '—';
        n.reply = 'You left the club before answering.';
      }
    });
    u.clubId = null;
    u.sacked = false;
    u.nation = u.nation || null;
    W.applySimFocus(); // leagues return to their own tiers
    u.unemployed = { since: S.year, day: S.day, from: old ? old.id : null, reason };
    u.tactic = W.newTactic();
    u.preseason = {};
    u.offers = [];
    u.lastMatch = null;
    u.building = null;
    u.neg = {};
    u.talks = {};
    u.contractRem = null;
    if (FM.Season.jobMarket) FM.Season.jobMarket(true);
  };
  W.takeCharge = function (clubId, mgrName, isNew = true) {
    const S = FM.S,
      club = S.clubs[clubId];
    if (isNew) W.newManager(mgrName, club.rep * 0.55, club.nat);
    S.user.clubId = clubId;
    W.applySimFocus(); // your league and its neighbours in the full engine
    S.user.history.push({ club: clubId, from: S.year });
    // A new job wipes the slate: promises, talks and board business belonged to the old club
    (S.user.promises || []).forEach((x) => {
      if (x.state === 'open') {
        x.state = 'void';
        x.closed = S.day;
      }
    });
    S.user.neg = {};
    S.user.talks = {};
    S.user.contractRem = null;
    S.user.adviceDone = {};
    S.user.board = { year: S.year, meetings: 0 };
    S.user.trust = 60;
    S.user.sacked = false;
    delete S.user.unemployed;
    S.user.offers = [];
    if (club.manager && S.staff[club.manager] && FM.Records) FM.Records.managerLeft(S.staff[club.manager], clubId);
    club.manager = null;
    club.boardConf = 70;
    S.user.joinedClubYear = S.year;
    S.user.tactic = club.tactic;
    if (S.user.tactic.fam == null) S.user.tactic.fam = 55; // tactical familiarity 0–100
    S.user.preseason = S.user.preseason || {};
    if (!S.staffPool) W.refreshStaffPool();
    if (FM.WorldDef) FM.WorldDef.seedStaff(clubId, isNew); // the staff a world definition made for this club come with the job
    // Own-club and same-league players are partially known
    Object.values(S.players).forEach((p) => {
      if (p.clubId === clubId) S.user.knowledge[p.id] = 100;
      else if (p.clubId && S.clubs[p.clubId].comp)
        S.user.knowledge[p.id] = Math.max(S.user.knowledge[p.id] || 0, S.clubs[p.clubId].comp === club.comp ? 35 : 20);
    });
  };

  // Every club's own history before the save: five legends, from the years the club existed, with names of its own
  // country (or heritage), two of them forwards so the club has a scorer to beat. Their stories come from the club's past
  // (W.seedHistory, run first): the captain of a title side only where the club won a title, with that year; the record
  // scorer with his real total; the man who scored the goal that kept the club up in a year it did stay up.
  W.seedLegends = function () {
    const S = FM.S,
      now = S.year;
    // what the archive says about each club: the years of its league titles and cups, and the years it went down
    const won = {},
      cupWon = {},
      down = {};
    for (const e of S.archive || []) {
      for (const k in e.comps || {}) (won[e.comps[k].champion] = won[e.comps[k].champion] || []).push(e.year);
      for (const k in e.cups || {}) (cupWon[e.cups[k].winner] = cupWon[e.cups[k].winner] || []).push(e.year);
      for (const id of e.relegated || []) (down[id] = down[id] || []).push(e.year);
    }
    const near = (c) => {
      const rivals = Object.values(S.clubs).filter((x) => x.comp === c.comp && x.id !== c.id && x.sim !== 'nation');
      return rivals.length ? U.pick(rivals).name : 'the old rivals';
    };
    // [needs, text]: a story with details from the club's real past
    const stories = {
      title: [
        (c, y) => `Captained the ${y} title winners`,
        (c, y) => `Lifted the league trophy in ${y} after a final-day win`,
        (c, y) => `The heartbeat of the ${y} championship side`,
        (c, y) => `Unbeaten at home through the ${y} title season`,
      ],
      cup: [
        (c, y) => `Scored in the ${y} cup final`,
        (c, y) => `Kept goal through the ${y} cup run`,
        (c, y) => `Won the cup in ${y} with a late winner in extra time`,
      ],
      stay: [
        (c, y) => `Scored the goal against ${near(c)} that kept the club up in ${y}`,
        (c, y) => `Led the escape from relegation in ${y}`,
        (c, y) => `Held the defence together when the club stayed up in ${y}`,
      ],
      plain: [
        (c, y, g) => `Cult hero: scored in five straight derbies`,
        (c, y, g) => `One-club man, ${U.plural(g, 'season')}`,
        (c, y, g) => `Signed on a free in ${y} and stayed ${U.plural(g, 'season')}`,
        (c, y, g) => `Academy graduate who made his debut in ${y}`,
        (c, y, g) => `Sold to a bigger club in ${y}, then came home`,
        (c, y, g) => `Never missed a game in ${y}`,
        (c, y, g) => `Hat-trick in the ${y} derby, still talked about`,
        (c, y, g) => `Played through ${U.plural(g, 'season')} of rebuilding`,
        (c, y, g) => `The best the supporters saw in the ${y}s`,
      ],
    };
    const used = {}; // (each plain line is used once in a nation before any is used twice: FM.Lore.plain)
    const story = (kind, c, y, i) => (FM.Lore ? FM.Lore.story(kind, c, y, used, i, near) : U.pick(stories[kind])(c, y));
    const plain = (c, y, g, i) => (FM.Lore ? FM.Lore.plain(c, y, g, used, i) : U.pick(stories.plain)(c, y, g));
    Object.values(S.clubs)
      .filter((c) => c.comp && c.sim !== 'nation')
      .forEach((c) => {
        const first = Math.max(c.founded || 1950, 1950),
          pool = c.policy && D.NAME_POOLS[c.policy.heritage];
        const poss = ['ST', 'W', 'ST', 'AM', 'CM', 'CB', 'GK', 'CM', 'FB'];
        const titles = (won[c.id] || []).filter((y) => y >= first),
          cups = (cupWon[c.id] || []).filter((y) => y >= first),
          downs = new Set(down[c.id] || []);
        c.legends = [0, 1, 2, 3, 4].map((i) => {
          const nat = U.chance(0.88) ? c.nat : U.pick(D.nationCodes());
          const yrs = U.randi(7, 16);
          let from = U.randi(first, Math.max(first, Math.min(2012, now - yrs - 1)));
          const pos = i < 2 ? U.pick(['ST', 'ST', 'W', 'AM']) : U.pick(poss);
          const apps = yrs * U.randi(28, 40);
          const nm = pool ? [U.pick(pool.fn), U.pick(pool.ln)] : [U.pick(D.NATIONS[nat].fn), U.pick(D.NATIONS[nat].ln)];
          const goals = Math.round(apps * ({ ST: 0.5, W: 0.24, AM: 0.26, CM: 0.1, FB: 0.04, CB: 0.05 }[pos] || 0.005));
          // the story, from what really happened here; a first pick of the club's past, else a plain one
          let note;
          const kind = i === 0 ? 'title' : i === 1 ? 'record' : i === 2 ? 'cup' : i === 3 ? 'stay' : 'plain';
          if (kind === 'title' && titles.length) {
            const y = U.pick(titles);
            from = Math.max(first, Math.min(from, y - 2));
            note = story('title', c, y, i);
          } else if (kind === 'record') note = `Club record goalscorer with ${U.plural(Math.max(goals, 90), 'goal')}`;
          else if (kind === 'cup' && cups.length) note = story('cup', c, U.pick(cups), i);
          else if (kind === 'stay') {
            const ys = [];
            for (let y = from + 1; y < from + yrs && y < now; y++) if (!downs.has(y)) ys.push(y);
            note = ys.length ? story('stay', c, U.pick(ys), i) : plain(c, from + 2, yrs, i);
          } else note = plain(c, from + U.randi(1, Math.max(1, yrs - 1)), yrs, i);
          return {
            name: `${nm[0]} ${nm[1]}`,
            nat: pool ? c.nat : nat,
            pos,
            era: `${from}–${from + yrs}`,
            apps,
            goals: kind === 'record' ? Math.max(goals, 90) : goals,
            note,
            ...(kind === 'record' ? { record: true } : {}),
          };
        });
        // the record scorer really has the most goals of the five
        const rec = c.legends.find((l) => l.record);
        const most = Math.max(...c.legends.map((l) => l.goals));
        if (rec && rec.goals < most) {
          rec.goals = most + U.randi(3, 20);
          rec.note = `Club record goalscorer with ${U.plural(rec.goals, 'goal')}`;
        }
        c.legends.sort((a, b) => b.apps - a.apps);
      });
    // the rest of the world's lore: older glory, club details, rivalries, competitions, the people (FM.Lore)
    if (FM.Lore) FM.Lore.seed({ fresh: true });
  };

  // A nickname that names a colour must be one of the club's colours (a real club's "Canaries" do not fit a red and blue
  // kit): the names of a colour the kit has none of are dropped
  const NICK_COLOURS = {
    Canaries: ['yellow'],
    Robins: ['red'],
    Bluebirds: ['blue'],
    Magpies: ['black', 'white'],
    Whites: ['white'],
    Reds: ['red'],
    Blues: ['blue'],
    Greens: ['green'],
    Blacks: ['black'],
    Yellows: ['yellow'],
    Hornets: ['yellow'],
    Oranje: ['orange'],
  };
  const colourName = (hex) => {
    const n = parseInt(String(hex).slice(1), 16),
      r = (n >> 16) & 255,
      g = (n >> 8) & 255,
      b = n & 255,
      mx = Math.max(r, g, b),
      mn = Math.min(r, g, b);
    if (mn > 200) return 'white';
    if (mx < 70) return 'black';
    if (mx - mn < 30) return 'grey';
    const d = mx - mn,
      h = mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4,
      deg = h * 60;
    return deg < 15 || deg >= 345
      ? 'red'
      : deg < 40
        ? 'orange'
        : deg < 70
          ? 'yellow'
          : deg < 170
            ? 'green'
            : deg < 260
              ? 'blue'
              : 'purple';
  };
  W.nickClash = (nick, colors) => {
    const need = NICK_COLOURS[nick];
    if (!need) return false;
    const have = colors.map(colourName);
    return !need.some((x) => have.includes(x));
  };

  // How a club's standing changed over the years, shaped by who it is: a fallen giant was high decades ago and has declined,
  // an oil-backed club was low until a recent jump, the old names always stood fairly high; every club also rises and falls
  // a little (a slow wave of its own, from its id). The path ends at today's reputation, so the past leads to the present.
  const smooth = (x) => {
    const t = U.clamp(x, 0, 1);
    return t * t * (3 - 2 * t);
  };
  W.repPath = function (c, ago) {
    const h = U.hash(c.id);
    const shape =
      { fallen: 24 * smooth((ago - 4) / 14), oil: -26 * smooth(ago / 20), historic: 6, giant: 4, youth: -2 }[
        c.identity
      ] || 0;
    const wave = 4.5 * Math.sin(ago / 3.1 + (h % 97)) + 3 * Math.sin(ago / 1.7 + (h % 53)) * smooth(ago / 3);
    return c.rep + shape + wave;
  };

  // Thirty seasons of league champions, runners-up and domestic cup winners before the save begins, so the archive, the club pages
  // and the honours cards have a past. Each club has a reputation path (W.repPath) ending at today's; every season the clubs of a
  // country are ranked by where their path stood then, the best filling the top division, the next the second and so on, with the
  // present league structure as the ending (the last few seasons keep today's divisions), so clubs go up and down, a fallen giant
  // has titles from the years it stood high, and a club cannot win before it was founded. A champion tends to win again (a dynasty).
  W.seedHistory = function (years = 30) {
    const S = FM.S;
    // (a world with past seasons of its own has no generated ones, unless its definition asks for the years before to be made up)
    if (S.archive.length && !(S.histFill && S.archive.every((e) => e.imported))) return 0;
    const have = new Set(S.archive.map((e) => e.year));
    const clubs = Object.values(S.clubs).filter((c) => c.comp && c.sim !== 'nation' && !c.parent);
    const leagues = W.leagues();
    // each country's ladder: its divisions from the top, as long as there is one division on a level
    const ladders = {};
    for (const comp of leagues) {
      if (typeof comp.tier !== 'number') continue;
      const lad = (ladders[comp.nat] = ladders[comp.nat] || {});
      (lad[comp.tier] = lad[comp.tier] || []).push(comp);
    }
    const ladder = {};
    for (const nat in ladders) {
      const rungs = [];
      for (let t = 1; ladders[nat][t] && ladders[nat][t].length === 1; t++) rungs.push(ladders[nat][t][0]);
      if (rungs.length > 1) ladder[nat] = rungs;
    }
    const tierOf = (c) => {
      const lad = ladder[c.nat];
      return lad ? lad.findIndex((x) => x.id === c.comp) : -1;
    };
    // who stood in which division in a season (year `ago` seasons back): a map from division id to its clubs
    const season = (year) => {
      const ago = S.year - year,
        by = {};
      for (const comp of leagues) by[comp.id] = [];
      const loose = [];
      for (const c of clubs) {
        if (tierOf(c) < 0 || (c.founded && c.founded > year)) loose.push(c);
      }
      const free = new Set(loose.map((c) => c.id));
      for (const c of loose) if (!c.founded || c.founded <= year) by[c.comp].push(c); // (outside a ladder: where it is today)
      for (const nat in ladder) {
        const lad = ladder[nat],
          score = (c) => W.repPath(c, ago) - tierOf(c) * 200 * Math.max(0, 1 - ago / 8);
        const here = clubs
          .filter((c) => c.nat === nat && !free.has(c.id))
          .sort((a, b) => score(b) - score(a) || (a.id < b.id ? -1 : 1));
        // each division keeps today's size (a club not yet founded leaves a place for the next one)
        let at = 0;
        for (const comp of lad) {
          const size = clubs.filter((c) => c.comp === comp.id).length;
          by[comp.id] = here.slice(at, at + size);
          at += size;
        }
      }
      return by;
    };
    const prev = {};
    const cups = Object.values(S.comps).filter((x) => x.type === 'cup' && x.nat);
    const out = [];
    for (let i = years; i >= 1; i--) {
      if (have.has(S.year - i)) continue;
      const year = S.year - i,
        ago = i,
        divs = season(year),
        next = season(year + 1);
      const entry = {
        year,
        label: `${year}/${String(year + 1).slice(2)}`,
        comps: {},
        cups: {},
        promoted: [],
        relegated: [],
        upsets: [],
        transfers: [],
        user: null,
        seeded: true,
      };
      // the clubs that changed division at the end of the season
      for (const nat in ladder) {
        const lad = ladder[nat];
        lad.forEach((comp, ti) => {
          const was = new Set(divs[comp.id].map((c) => c.id));
          if (ti > 0) for (const c of next[lad[ti - 1].id]) if (was.has(c.id)) entry.promoted.push(c.id);
          if (ti < lad.length - 1) for (const c of next[lad[ti + 1].id]) if (was.has(c.id)) entry.relegated.push(c.id);
        });
      }
      for (const comp of leagues) {
        const pool = divs[comp.id];
        if (pool.length < 2) continue;
        const w = (c) => Math.exp((W.repPath(c, ago) - 55) / 8) * (prev[comp.id] === c.id ? 2.4 : 1);
        const champ = U.wpick(pool, w) || pool[0];
        const second = U.wpick(
          pool.filter((c) => c.id !== champ.id),
          w,
        );
        prev[comp.id] = champ.id;
        champ.titles = champ.titles || {};
        champ.titles[comp.id] = (champ.titles[comp.id] || 0) + 1;
        entry.comps[comp.id] = {
          name: comp.name,
          sim: comp.sim || 'full',
          nat: comp.nat,
          champion: champ.id,
          runnerUp: second.id,
        };
      }
      for (const cup of cups) {
        const pool = clubs.filter((c) => c.nat === cup.nat && !(c.founded && c.founded > year));
        if (pool.length < 2) continue;
        // a cup is kinder to the small: the weight is flattened
        const w = (c) => Math.sqrt(Math.exp((W.repPath(c, ago) - 55) / 8)) + 0.2;
        const win = U.wpick(pool, w);
        entry.cups[cup.id] = { name: cup.name, winner: win.id };
        win.titles = win.titles || {};
        win.titles[cup.id] = (win.titles[cup.id] || 0) + 1;
      }
      out.push(entry);
    }
    S.archive = out.concat(S.archive).sort((a, b) => a.year - b.year);
    return out.length;
  };

  // ---------------- Compact save format ----------------
  // Players are ~80% of a save. Attributes, hidden attributes, season stats, career spells and history are
  // stored as arrays, common keys are shortened, defaults are dropped, and derived fields (ability, value,
  // personality) are recomputed on load. Unknown keys pass through untouched.
  const HID = ['cons', 'inj', 'prof', 'amb', 'loy', 'temp', 'big', 'lead'];
  const HIST = [
    'y',
    'c',
    'apps',
    'g',
    'r',
    'a',
    'mins',
    'sh',
    'kp',
    'tk',
    'cs',
    'sv',
    'ga',
    'xga',
    'motm',
    'yc',
    'rc',
    'ic',
  ]; // history row fields, packed in this order (old saves: the first five)
  const SEASON = [
    'apps',
    'goals',
    'ast',
    'rsum',
    'motm',
    'yc',
    'rc',
    'lapps',
    'mins',
    'sh',
    'sot',
    'kp',
    'tk',
    'pas',
    'cs',
    'sv',
    'ga',
    'xga',
    'yapps',
    'ic',
    'xg',
    'xa',
  ];
  const KEYS = {
    fn: 'f',
    ln: 'l',
    nat: 'n',
    born: 'b',
    pos: 'p',
    foot: 'ft',
    morale: 'm',
    form: 'fo',
    fitness: 'fi',
    inj: 'i',
    susp: 's',
    wage: 'w',
    contract: 'c',
    traits: 't',
    clubId: 'cl',
    youth: 'y',
    cult: 'cu',
    derbyGoals: 'dg',
    intl: 'in',
    deal: 'de',
    agent: 'ag',
    lastGrowth: 'lg',
    flagMinutes: 'fm',
    loan: 'lo',
    listed: 'li',
    debuted: 'db',
    wantsOut: 'wo',
    askedRaise: 'ar',
    injRisk: 'ir',
    arc: 'ac',
    settled: 'st',
    buzz: 'bz',
    buzzY: 'by',
  };
  const UNKEY = Object.fromEntries(Object.entries(KEYS).map(([k, v]) => [v, k]));
  const DEFAULTS = {
    inj: null,
    susp: 0,
    youth: null,
    cult: 0,
    derbyGoals: 0,
    lastGrowth: 0,
    flagMinutes: false,
    listed: false,
  };
  const DROP = new Set([
    'ca',
    'value',
    'personality',
    'attrs',
    'hid',
    'season',
    'career',
    'history',
    '_heat',
    '_riskPlayOn',
  ]);
  const r2 = (v) => Math.round(v * 100) / 100;
  W.packPlayer = function (p) {
    // C: current ability as it was, so rounding the attributes can never shift a rating across a save/load
    const o = { A: D.ATTRS.map((k) => r2(p.attrs[k])), H: HID.map((k) => p.hid[k]), C: p.ca };
    if (SEASON.some((k) => p.season[k])) o.Z = SEASON.map((k) => r2(p.season[k] || 0));
    o.K = [
      p.career.apps,
      p.career.goals,
      p.career.spells.map((s) => {
        const a = [s.c, s.from, s.to, s.apps, s.goals, (s.loan ? 1 : 0) + (s.signed ? 2 : 0)];
        if (s.fee != null) a.push(s.fee);
        return a;
      }),
    ];
    if (p.history && p.history.length) o.Y = p.history.map((h) => HIST.map((k) => h[k] ?? 0));
    for (const k in p) {
      if (DROP.has(k) || p[k] === undefined) continue;
      if (k in DEFAULTS && p[k] === DEFAULTS[k]) continue;
      o[KEYS[k] || k] = p[k];
    }
    return o;
  };
  W.unpackPlayer = function (o) {
    const p = { ...DEFAULTS };
    for (const k in o) if (!['A', 'H', 'Z', 'K', 'Y', 'C'].includes(k)) p[UNKEY[k] || k] = o[k];
    p.attrs = Object.fromEntries(D.ATTRS.map((k, i) => [k, o.A[i]]));
    p.hid = Object.fromEntries(HID.map((k, i) => [k, o.H[i]]));
    p.season = W.blankSeason();
    if (o.Z)
      SEASON.forEach((k, i) => {
        if (o.Z[i] || (k !== 'lapps' && o.Z[i] != null)) p.season[k] = o.Z[i]; // older saves have fewer fields
      });
    p.career = {
      apps: o.K[0],
      goals: o.K[1],
      spells: o.K[2].map(([c, from, to, apps, goals, f, fee]) => ({
        c,
        from,
        to,
        apps,
        goals,
        ...(f & 1 ? { loan: true } : {}),
        ...(f & 2 ? { signed: true } : {}),
        ...(fee != null ? { fee } : {}),
      })),
    };
    if (o.Y) p.history = o.Y.map((a) => Object.fromEntries(HIST.map((k, i) => [k, a[i] ?? 0])));
    p.personality = W.personality(p.hid);
    W.refresh(p);
    if (o.C != null && o.C !== p.ca) {
      p.ca = o.C;
      if (p.pa < p.ca) p.pa = p.ca;
      p.value = W.value(p);
    }
    return p;
  };
  W.packPlayers = (players) => {
    const out = {};
    for (const id in players) out[id] = W.packPlayer(players[id]);
    return out;
  };
  W.unpackPlayers = (packed) => {
    const out = {};
    for (const id in packed) out[id] = W.unpackPlayer(packed[id]);
    return out;
  };

  W.userClub = () => FM.S.clubs[FM.S.user.clubId];
  // The army's club (Bujeong Garrison): its squad is conscripts, so nothing tops it up
  W.army = (c) => !!(c && c.policy && c.policy.military);
  // Lower-league realism: a part-time club (the fourth tier and below, or a tiny club) trains in the evenings, has no scouting
  // network to speak of (two scouts at most) and pays what a community club can
  W.partTime = (c) =>
    !!c && c.sim !== 'nation' && D.partTime(c.nat, (FM.S.comps[c.comp] && FM.S.comps[c.comp].tier) || 1, c.rep);
  W.maxScouts = () => (W.partTime(W.userClub()) ? 2 : 5);
  W.isUser = (clubId) => FM.S.user && FM.S.user.clubId === clubId;
  W.isUserNation = (id) => !!(FM.S.user && FM.S.user.nation && FM.S.user.nation === id);
  W.isMine = (id) => W.isUser(id) || W.isUserNation(id);
})();
