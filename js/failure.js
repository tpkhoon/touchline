// @ts-check
// When a club fails: administration (a points deduction and, here, a transfer embargo for the season), and — if the world allows
// it — liquidation, with a phoenix club rising lower down the pyramid. What happens is the world's rule (S.failure, set in the
// world editor: FM.WorldDef def.failure); the defaults are the game's own behaviour (administration, no liquidation).
//
//   FM.Failure.trouble(club)    a full-simulation club whose debts passed the limit at the start of a season
//   FM.Failure.settle()         the liquidations that queued, once every club has been looked at
//   FM.Failure.embargoed(club)  is the club barred from signing players this season?
(function () {
  const FM = window.FM;
  const F = (FM.Failure = /** @type {any} */ ({}));
  const U = FM.U,
    W = FM.W;

  F.DEFAULT = { admin: true, embargo: true, liquidate: false, phoenix: true, deduct: 6, richSafe: false, proof: [] };
  F.rules = () => ({ ...F.DEFAULT, ...((FM.S && FM.S.failure) || {}) });
  // a club in administration may not sign players for the season it starts (a free-agent or a loan too)
  F.embargoed = (c) => !!(c && c.embargo && c.embargo >= FM.S.year);

  let queue = [];
  // Is a club able to fail at all: not the one you manage, not one the world made proof, not a rich owner's if the world says so
  F.canFail = function (c) {
    const r = F.rules();
    if (!r.admin || !c || W.isUserSide(c.id)) return false;
    if ((r.proof || []).includes(c.id)) return false;
    if (r.richSafe && (c.identity === 'oil' || (c.policy && c.policy.military))) return false;
    return true;
  };
  // A club that cannot go down the pyramid and be replaced is not liquidated: a closed league, a B team's parent, the last clubs of a league
  F.canLiquidate = function (c) {
    const S = FM.S,
      r = F.rules(),
      comp = c.comp && S.comps[c.comp];
    if (!r.liquidate || !comp || comp.type !== 'league' || !(comp.rules.relegate || comp.rules.promote)) return false;
    if (Object.values(S.clubs).some((x) => x.parent === c.id)) return false;
    return comp.clubs.length > 10;
  };

  F.trouble = function (c) {
    const S = FM.S,
      r = F.rules();
    if (!F.canFail(c)) return;
    // failing again within four years of the last administration is the end, where the world allows it
    if (c.admin && c.adminYear != null && S.year - c.adminYear <= 4 && F.canLiquidate(c)) {
      if (!queue.includes(c.id)) queue.push(c.id);
      return;
    }
    if (c.admin && !r.liquidate && c.adminYear == null) return; // (a club of an older save: administration once, as it was)
    if (c.admin && c.adminYear === S.year) return;
    c.admin = true;
    c.adminYear = S.year;
    if (r.embargo) c.embargo = S.year;
    if (r.deduct > 0) S.comps[c.comp].deductions = { ...(S.comps[c.comp].deductions || {}), [c.id]: r.deduct };
    FM.News.add({
      type: 'world',
      title: `${c.name} enter administration`,
      body: `Debts of ${U.money(-c.balance)} leave the club facing ${r.deduct > 0 ? `a ${r.deduct}-point deduction, ` : ''}${r.embargo ? 'a transfer embargo for the season and ' : ''}a fire sale.`,
      clubId: c.id,
      big: true,
      keep: true,
    });
    c.balance = 0;
  };

  // The phoenix: the same city, colours and ground, a smaller club, owned by its supporters, in the name its fans would give it
  const phoenixName = (name) => {
    const base = name.replace(/^(A?FC|FK|CF|SC|AC|AS)\s+/i, '');
    return /^AFC\b/i.test(name) ? `New ${name}` : `AFC ${base}`;
  };
  const liquidate = function (c) {
    const S = FM.S,
      r = F.rules(),
      comp = S.comps[c.comp];
    // his players go: out of contract, free agents
    for (const p of Object.values(S.players)) {
      if (p.clubId !== c.id || p.retired) continue;
      W.spell(p).to = S.year - 1;
      p.clubId = null;
      p.team = undefined;
      p.listed = false;
      p.loanListed = false;
      p.loan = undefined;
    }
    W.rosterVer++;
    comp.clubs = comp.clubs.filter((id) => id !== c.id);
    c.dissolved = S.year;
    c.comp = null;
    // the vacancy is filled from the division below, and so on down: the best club of each takes the place above it
    let cur = comp;
    const stepped = [];
    for (let guard = 0; guard < 8; guard++) {
      const down = cur.rules.relegate && S.comps[cur.rules.relegate.to];
      if (!down || down.type !== 'league' || down.clubs.length < 8) break;
      const up = down.clubs
        .map((id) => S.clubs[id])
        .filter((x) => x && !x.parent)
        .sort((a, b) => b.rep - a.rep)[0];
      if (!up) break;
      down.clubs = down.clubs.filter((id) => id !== up.id);
      cur.clubs.push(up.id);
      up.comp = cur.id;
      stepped.push(up);
      cur = down;
    }
    let phoenix = /** @type {any} */ (null);
    if (r.phoenix) {
      const rep = Math.max(24, Math.min(40, Math.round(c.rep * 0.4)));
      const code = (c.id.replace(/^c_/, '').slice(0, 2) + 'P').slice(0, 3).toUpperCase();
      let id = `c_${code}`;
      for (let i = 1; S.clubs[id] || FM.D.allClubRows().some((x) => 'c_' + x[1] === id); i++) id = `c_${code}${i}`;
      const name = phoenixName(c.name);
      const used = new Set(Object.values(S.clubs).map((x) => x.short));
      const abbr = FM.U.abbrev ? FM.U.abbrev(name, used, FM.D.isRude) : name.slice(0, 3).toUpperCase();
      FM.D.CLUB_INFO[id.slice(2)] = [abbr, c.nick || '', S.year];
      phoenix = W.mkClub(
        [
          name,
          id.slice(2),
          c.city,
          c.colors[0],
          c.colors[1],
          'fan',
          rep,
          c.stadium.name,
          Math.min(c.stadium.cap0 || c.stadium.cap, 7000),
        ],
        cur.id,
        cur.nat,
        cur.sim,
      );
      phoenix.short = abbr;
      phoenix.nick = c.nick || '';
      phoenix.founded = S.year;
      phoenix.phoenixOf = c.id;
      c.phoenix = phoenix.id;
      if (FM.Lore && FM.Lore.addClub) FM.Lore.addClub(phoenix);
    }
    FM.News.add({
      type: 'world',
      title: `${c.name} are liquidated`,
      body: `The club that began in ${c.founded || 'the last century'} is wound up with debts of ${U.money(Math.abs(c.balance) + 1e6)}; its players are free agents.${
        phoenix
          ? ` Supporters have formed ${phoenix.name}, who start in ${cur.name} with the same ground and colours.`
          : ''
      }${stepped.length ? ` ${stepped.map((x) => x.name).join(', ')} ${stepped.length === 1 ? 'is' : 'are'} promoted to fill the gap.` : ''}`,
      clubId: c.id,
      big: true,
      keep: true,
    });
  };

  // The liquidations that queued while the clubs were looked at (after the loop: it changes the leagues)
  F.settle = function () {
    const S = FM.S,
      list = queue;
    queue = [];
    for (const id of list) {
      const c = S.clubs[id];
      if (c && c.comp && F.canLiquidate(c)) liquidate(c);
    }
    if (list.length && S.qualified)
      for (const k of Object.keys(S.qualified))
        S.qualified[k] = S.qualified[k].filter((id) => !(S.clubs[id] && S.clubs[id].dissolved));
  };
})();
