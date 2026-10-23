// @ts-check
// Club money by country, attendance, and the pressure of a wage bill: where revenue comes from (TV money in
// England, gate receipts in Germany, player sales in the selling leagues), how full the ground is (results, fan
// mood, ticket prices, the size of the stadium, the occasion), and what the board does when wages outgrow revenue
// (budget cuts, a wage freeze, interest on debt and, at worst, administration).
(function () {
  const FM = window.FM,
    U = FM.U,
    W = FM.W;
  const F = (FM.Finance = /** @type {any} */ ({}));
  const S = () => FM.S;

  // Revenue mix by country: multipliers on the broadcast, commercial and matchday shares of a club's revenue
  // potential (Sea.revenuePotential), and the share of a sale's fee that goes back into the transfer budget
  F.MIX = {
    _: { tv: 1, com: 1, gate: 1, sell: 0.5 },
    ENG: { tv: 1.45, com: 1.05, gate: 0.85 }, // the richest TV deal by far
    ESP: { tv: 1.15, com: 1.05, gate: 0.85 },
    ITA: { tv: 1.1, com: 0.9, gate: 0.85 },
    GER: { tv: 0.75, com: 1.1, gate: 1.3 }, // full stadiums, cheap tickets, 50+1 ownership
    FRA: { tv: 0.85, com: 1, gate: 0.95 },
    NED: { tv: 0.7, com: 0.95, gate: 1.05, sell: 0.75 }, // selling leagues: development and sales pay the bills
    POR: { tv: 0.65, com: 0.85, gate: 0.85, sell: 0.8 },
    BEL: { tv: 0.65, com: 0.9, gate: 0.95, sell: 0.75 },
    BRA: { tv: 0.85, com: 0.85, gate: 0.85, sell: 0.8 },
    ARG: { tv: 0.7, com: 0.8, gate: 1, sell: 0.8 },
    USA: { tv: 0.9, com: 1.2, gate: 1.05 }, // salary-capped, commercially strong
    MEX: { tv: 1, com: 1, gate: 0.95 },
    SGP: { tv: 0.6, com: 0.9, gate: 0.8, sell: 0.5 },
    MYS: { tv: 0.7, com: 0.9, gate: 0.9 },
    VIE: { tv: 0.7, com: 0.9, gate: 0.9 },
    IDN: { tv: 0.75, com: 0.85, gate: 1.0 },
    PHI: { tv: 0.5, com: 0.7, gate: 0.7 },
    RSA: { tv: 0.8, com: 1.0, gate: 0.8, sell: 0.7 },
    KSA: { tv: 1.3, com: 1.6, gate: 0.6, sell: 0.35 }, // state and owner money, small crowds, clubs buy more than they sell
  };
  // What the club's identity does to where its money comes from: an oil-backed club's sponsors pay over the odds, a fan-owned
  // club lives on its gate, a giant sells shirts, a selling club puts more of every sale back into the squad
  F.IDMIX = {
    oil: { com: 1.35, gate: 0.95 },
    fan: { gate: 1.12, com: 0.92 },
    giant: { com: 1.1 },
    historic: { gate: 1.05 },
    selling: { sell: 0.15 },
  };
  F.MARKET_K = 0.01; // how much a club's market size moves its commercial income (per point of the 10)
  F.SELL_K = 0.8; // what a club puts back into its budget of each sale is this share of the country's and the identity's (the money is spent again and again within a season)
  F.ID_SCALE = 0.5; // how far identity moves revenue sources from the country's mix (0 none, 1 as set above)
  F.mix = (c) => {
    const m = { ...F.MIX._, ...(F.MIX[c.nat] || {}) },
      i = F.IDMIX[c.identity] || {};
    return {
      tv: m.tv,
      com: m.com * (1 + ((i.com || 1) - 1) * F.ID_SCALE),
      gate: m.gate * (1 + ((i.gate || 1) - 1) * F.ID_SCALE),
      sell: (m.sell + (i.sell || 0) * F.ID_SCALE) * F.SELL_K,
    };
  };
  F.SHARE = { tv: 0.33, com: 0.25, gate: 0.42 };
  // A season's revenue for a club, by source (before attendance and cup runs move the gate part)
  F.annual = function (c) {
    const R = FM.Season.revenuePotential(c),
      m = F.mix(c),
      comp = S().comps[c.comp],
      tier = comp ? comp.tier : 1;
    const tvTier = tier === 1 ? 1 : tier === 2 ? 0.7 : 0.5;
    return {
      tv: R * F.SHARE.tv * m.tv * tvTier * ((comp && comp.tvBoost) || 1),
      com:
        R *
        F.SHARE.com *
        m.com *
        (1 + (((c.facilities && c.facilities.fanzone) || 1) - 1) * 0.06) *
        (0.9 + W.clubAttr(c).market * 0.02),
      gate: R * F.SHARE.gate * m.gate,
    };
  };
  F.revenue = (c) => {
    const a = F.annual(c);
    return a.tv + a.com + a.gate;
  };

  // ---------- What a club can pay ----------
  // The share of revenue a league's clubs spend on wages (a typical top-flight ratio), moved by who owns the club: an oil-backed
  // owner pays over the odds, a fan-owned club keeps to its gate. The same ability earns a wage in proportion to the club's wage
  // budget (revenue × this ratio) against what a club of its reputation would have in a middling league (half its revenue
  // potential), so wages follow what the league and the club can pay. W.wageFor reads it.
  F.WAGE_RATIO = {
    _: 0.5,
    ENG: 0.58,
    ESP: 0.56,
    ITA: 0.56,
    GER: 0.5,
    FRA: 0.55,
    KSA: 0.78,
    USA: 0.5,
    JPN: 0.45,
    KOR: 0.45,
    NED: 0.48,
    POR: 0.5,
  };
  F.IDWAGE = { oil: 1.3, giant: 1.05, fan: 0.9, selling: 0.9 };
  F.PAY_POWER = 0.75; // how much of the difference in wage budgets reaches a wage (the rest is the club's own reputation, which wageDemand adds)
  let payCache = { S: null, y: null, m: new Map() };
  F.payFactor = function (c) {
    const s = S();
    if (payCache.S !== s || payCache.y !== s.year) payCache = { S: s, y: s.year, m: new Map() };
    let v = payCache.m.get(c.id);
    if (v === undefined) {
      const ratio = (F.WAGE_RATIO[c.nat] || F.WAGE_RATIO._) * (F.IDWAGE[c.identity] || 1);
      v = U.clamp(Math.pow((F.revenue(c) * ratio) / (FM.Season.revenuePotential(c) * 0.5), F.PAY_POWER), 0.45, 2.2);
      payCache.m.set(c.id, v);
    }
    return v;
  };

  // ---------- The transfer budget, from the club's accounts ----------
  // Planned the way a club plans a season: expected revenue, less the wage bill and running costs (facilities, staff, academy,
  // travel), is the surplus; the transfer budget is the share of it the board will spend (an ambitious one spends more), plus a
  // part of any cash well above a season's needs, plus the owner's money where there is some, less a repayment on debt. (Sales
  // during the season add to it as they happen: FM.Transfers.) A club in debt or over its wage limit has little to spend.
  F.RUNNING = 0.14;
  F.budgetFor = function (c) {
    const rev = F.revenue(c),
      idt = FM.D.IDENTITY[c.identity] || { budget: 1 };
    const surplus = rev * (1 - F.RUNNING) - F.wageBill(c);
    // (the richest identities spend a bigger share, but not so much bigger that the same few clubs buy every star)
    const ambition = U.clamp(0.2 + 0.12 * idt.budget, 0.25, 0.5);
    const spare = Math.max(0, c.balance - 0.5 * rev) * 0.05;
    const owner = c.identity === 'oil' ? rev * 0.12 : 0;
    const debt = c.balance < 0 ? -c.balance * 0.25 : 0;
    return Math.max(
      Math.round(rev * 0.02),
      Math.round((Math.max(0, surplus) * ambition + spare + owner - debt) / 1e5) * 1e5,
    );
  };

  // ---------- Prize money ----------
  // Every competition pays: a league by final position, a domestic cup by round, a continental or world cup by results (the
  // fund is the competition's prize, in dollars like all money). A payment goes into the club's balance, its season's income
  // (c.fin.prize) and, for your club, a line in the season's prize list on the Finances tab.
  F.prize = function (c, amt, why) {
    amt = Math.round(amt);
    if (!c || !(amt > 0)) return 0;
    c.balance += amt;
    c.fin = c.fin || { tv: 0, com: 0, gate: 0, att: 0, homes: 0 };
    c.fin.prize = (c.fin.prize || 0) + amt;
    const log = W.isUser(c.id) && S().seasonLog;
    if (log) {
      log.prizes = log.prizes || [];
      const row = log.prizes.find((x) => x.why === why);
      if (row) row.amt += amt;
      else log.prizes.push({ why, amt });
    }
    return amt;
  };
  // A league's prize money by position (best first). The editor can set a fund (comp.rules.prize); otherwise each club's
  // share is a part of its own revenue potential, the richer the club the more it gets. A set fund is shared by position:
  // the champion gets about three times the last club.
  F.LEAGUE_PRIZE = { share: 0.12, spread: 2.2, curve: 1.6 };
  F.leaguePrizes = function (comp, table) {
    const n = table.length,
      fund = comp.rules && comp.rules.prize;
    if (fund > 0) {
      const w = table.map(
          (_, i) => 1 + F.LEAGUE_PRIZE.spread * Math.pow(n > 1 ? (n - 1 - i) / (n - 1) : 1, F.LEAGUE_PRIZE.curve),
        ),
        tot = U.sum(w, (x) => x);
      return w.map((x) => (fund * x) / tot);
    }
    return table.map((r, i) => {
      const c = S().clubs[r.id];
      return c && c.sim === 'full' ? FM.Season.revenuePotential(c) * F.LEAGUE_PRIZE.share * ((n - i) / n) : 0;
    });
  };
  // What a league pays its champion and its last club, for the screens
  F.leaguePrizeRange = function (comp) {
    const fund = comp.rules && comp.rules.prize;
    if (!(fund > 0)) return null;
    const n = Math.max(2, comp.clubs.length),
      a = F.leaguePrizes(
        comp,
        Array.from({ length: n }, () => ({ id: null })),
      );
    return { fund, first: a[0], last: a[n - 1] };
  };
  // A domestic cup's prize ladder: each tie won pays its winner a part of the fund (the final the most), the shares
  // adding up to the fund over the whole cup
  const tieShare = (k) => (k === 1 ? 0.3 : k === 2 ? 0.12 : k === 4 ? 0.06 : 0.03 * Math.pow(8 / k, 1.2));
  F.cupLadder = function (entrants) {
    const rounds = [];
    for (let n = Math.max(2, entrants); n > 1;) {
      const p = 2 ** Math.floor(Math.log2(n)),
        k = n === p ? n / 2 : n - p;
      rounds.push(k);
      n = n === p ? n / 2 : p;
    }
    const z = U.sum(rounds, (k) => k * tieShare(k));
    return { rounds, z };
  };
  // What winning a tie in a round of k ties pays, from a cup of this many entrants
  F.cupPayout = function (fund, entrants, k) {
    const { z } = F.cupLadder(entrants);
    return (fund * tieShare(k)) / z;
  };

  // ---------- Attendance ----------
  F.TICKETS = {
    Low: { fill: 0.08, price: 0.8, mood: 0.2 },
    Normal: { fill: 0, price: 1, mood: 0 },
    High: { fill: -0.1, price: 1.25, mood: -0.25 },
  };
  F.ticket = (c) => (W.isUser(c.id) && S().user.tickets) || 'Normal';
  // How full the ground is for a home game: reputation, fan mood, recent results, the price, the opponent and the
  // occasion; a bigger stadium is harder to fill. Returns { att, fill }.
  F.attendance = function (c, opp, derby) {
    const cap = (c.stadium && c.stadium.cap) || 20000,
      t = F.TICKETS[F.ticket(c)];
    const form = FM.Season.lastResults ? FM.Season.lastResults(c.id) : null;
    let fill =
      0.5 +
      c.rep / 280 +
      ((c.fanMood ?? 60) - 50) / 250 +
      t.fill +
      (opp ? Math.max(0, opp.rep - c.rep) / 300 : 0) +
      (derby ? 0.12 : 0) -
      Math.max(0, Math.log2(cap / (12000 + c.rep * 450))) * 0.12; // a ground built bigger than the club fills less
    if (form && form.length) fill += (form.reduce((s, r) => s + r, 0) / form.length - 0.45) * 0.15;
    fill = U.clamp(fill, 0.25, 1);
    return { att: Math.round(cap * fill), fill };
  };

  // ---------- Wages against revenue ----------
  F.wageBill = (c) =>
    U.sum(W.squad(c.id), (p) => (p.service ? 0 : p.wage) * (p.loan && p.clubId === c.id ? p.loan.share : 1)) *
    FM.D.WAGE_WEEKS;
  F.wageRatio = (c) => F.wageBill(c) / Math.max(1, F.revenue(c));
  F.LIMIT = { cut: 0.7, freeze: 0.85, interest: 0.01 };
  // Weekly: interest on debt for everyone; for your club, the board steps in as the wage bill outgrows revenue
  F.weekly = function () {
    const s = S();
    for (const c of Object.values(s.clubs)) {
      if (c.sim !== 'full') continue;
      if (!W.isUser(c.id) && FM.Reg.real() && FM.Reg.mls(c)) FM.Reg.mlsComply(c); // an MLS club keeps within its salary budget
      if (c.balance < 0) {
        const i = Math.round(-c.balance * F.LIMIT.interest);
        c.balance -= i;
        if (W.isUser(c.id)) FM.Season.spend('interest', i);
      }
      // an AI club deep in the red stops buying and puts its best-paid player up for sale
      if (!W.isUser(c.id) && c.balance < -0.3 * F.revenue(c)) {
        c.budget = 0;
        const top = W.squad(c.id).sort((a, b) => b.wage - a.wage)[0];
        if (top) top.listed = true;
      }
    }
    const uc = W.employed() && W.userClub();
    if (!uc) return;
    const r = F.wageRatio(uc),
      fp = (s.user.finPressure = s.user.finPressure || { year: s.year, cut: false, freeze: false });
    if (fp.year !== s.year) Object.assign(fp, { year: s.year, cut: false, freeze: false, boost: 0 });
    const boost = fp.boost || 0; // the board agreed to tolerate higher wages this season (a board meeting)
    if (r > F.LIMIT.cut + boost && !fp.cut) {
      fp.cut = true;
      const before = uc.budget;
      uc.budget = U.roundMoney(uc.budget * 0.75);
      FM.News.add({
        type: 'board',
        title: 'The board cut the transfer budget',
        body: `Wages are ${Math.round(r * 100)}% of revenue (the board want them under ${Math.round(F.LIMIT.cut * 100)}%). The budget drops from ${U.money(before)} to ${U.money(uc.budget)}.`,
        clubId: uc.id,
      });
    }
    if (r > F.LIMIT.freeze + boost && !fp.freeze) {
      fp.freeze = true;
      FM.News.add({
        type: 'board',
        title: 'Wage freeze',
        body: `Wages have reached ${Math.round(r * 100)}% of revenue. No new contract may add to the wage bill until it falls below ${Math.round(F.LIMIT.freeze * 100)}%. Selling a high earner would help.`,
        clubId: uc.id,
      });
    }
    if (fp.freeze && r < F.LIMIT.freeze + boost - 0.03) {
      fp.freeze = false;
      FM.News.add({
        type: 'board',
        title: 'Wage freeze lifted',
        body: 'The wage bill is back within limits.',
        clubId: uc.id,
      });
    }
  };
  // The board's wage freeze: no new deal may push wages up (renewals at the same wage or less, and sales, are fine)
  F.frozen = (wageAdded) => {
    const fp = S().user && S().user.finPressure;
    return !!(fp && fp.freeze && fp.year === S().year && wageAdded > 0);
  };
  // Administration: debts beyond half a season's revenue (and at least £8M)
  F.adminThreshold = (c) => -Math.max(8e6, 0.5 * F.revenue(c));
  // Title sponsors. The top leagues and the domestic cups carry a sponsor's name ("Corvid Energy English Premier Division") for a
  // few seasons at a time; when a deal ends there is a new sponsor, or for a season none. A competition keeps the name it was
  // given as baseName; comp.name is the name with the sponsor, so everything that shows a competition shows the deal. The brands
  // are invented (a place, a trade); no two competitions of a nation share one. A name the world already gave a sponsor (a
  // database's, or one a manager typed in the world editor) is taken as the base and left as it is.
  const PLACES =
    `Halden Corvid Meridian Vantage Norland Ashgrove Kestrel Bluewater Larkspur Ironbridge Solano Tamarind Brightwell Eastmoor
    Fenwick Granite Harlow Istria Juniper Kingsley Lumen Marlowe Northgate Oakhurst Pennant Quillon Redfern Sable Thornbury Verity
    Westerley Yarrow Zephyr Alder Beacon Cobalt Everest Foxglove Glenmore Hartwell Keystone Lyric Monarch Nimbus Orchid Prism Rowan Sterling
    Talbot Upland Valmont Winslow Aurelia Brookfield Castell Dunmore Elmstead Falconer Garnet Highmoor Ingleby Jarrow Kelmscott Lowther`.split(
      /\s+/,
    );
  const TRADES = [
    'Bank',
    'Energy',
    'Telecom',
    'Airlines',
    'Insurance',
    'Motors',
    'Brewing',
    'Mobile',
    'Foods',
    'Logistics',
    'Steel',
    'Pharma',
    'Stores',
    'Travel',
    'Securities',
    'Water',
    'Media',
    'Homes',
  ];
  const HAS_SPONSOR =
    /\b(bank|energ|energy|telecom|insurance|kredit|credit|mobile|airlines?|motors|brewing|securities)\b/i;
  F.sponsorBrand = (taken) => {
    for (let i = 0; i < 40; i++) {
      const b = `${U.pick(PLACES)} ${U.pick(TRADES)}`;
      if (!taken.has(b)) return b;
    }
    return `${U.pick(PLACES)} ${U.pick(TRADES)}`;
  };
  const eligible = (c) =>
    c.nat &&
    ((c.type === 'league' && c.tier <= 3) || c.type === 'cup') &&
    c.clubs !== undefined &&
    c.type !== 'friendly';
  // a deal's chance of there being one: the top league nearly always, the cups and lower leagues less
  const hasDeal = (c) => {
    const big = c.sim === 'full' ? 1 : c.sim === 'light' ? 0.55 : 0.3; // (the bigger the league, the likelier a sponsor)
    const base = c.type === 'cup' ? 0.4 : c.tier === 1 ? 0.75 : c.tier === 2 ? 0.35 : 0.1;
    return Math.random() < base * (c.type === 'cup' ? Math.max(0.5, big) : big);
  };
  const dealLength = (c) => (c.type === 'cup' ? U.randi(2, 4) : U.randi(3, 5));
  const setName = (c, brand) => {
    c.name = brand ? `${brand} ${c.baseName}` : c.baseName;
    c.sponsorShown = c.name;
  };
  F.sponsorsTick = function (first) {
    const s = S();
    if (s.noSponsors) return;
    const takenBy = {};
    Object.values(s.comps).forEach((c) => {
      if (c.sponsor && c.nat) (takenBy[c.nat] = takenBy[c.nat] || new Set()).add(c.sponsor.brand);
    });
    for (const c of Object.values(s.comps)) {
      if (!eligible(c)) continue;
      // a name changed by hand since the last tick (the world editor) is the new base
      if (c.baseName && c.sponsorShown && c.name !== c.sponsorShown) {
        c.baseName = c.name;
        c.sponsor = undefined;
      }
      if (!c.baseName) {
        c.baseName = c.name;
        if (HAS_SPONSOR.test(c.name)) {
          c.sponsorShown = c.name;
          c.sponsor = { brand: '', from: s.year, until: s.year + 99, own: true }; // (the name already has one: left alone)
          continue;
        }
      }
      if (c.sponsor && c.sponsor.own) continue;
      const taken = (takenBy[c.nat] = takenBy[c.nat] || new Set());
      if (first && !c.sponsor && c.sponsorChecked == null) {
        // a new world starts part-way through deals
        c.sponsorChecked = s.year;
        if (hasDeal(c)) {
          const len = dealLength(c),
            brand = F.sponsorBrand(taken);
          taken.add(brand);
          c.sponsor = { brand, from: s.year - U.randi(0, len - 1), until: s.year + U.randi(0, len - 1) };
          setName(c, brand);
        } else setName(c, '');
        continue;
      }
      if (c.sponsor && c.sponsor.until >= s.year) continue;
      // the deal has run out (or there was none): a new sponsor, or none for a season
      const old = c.sponsor && c.sponsor.brand;
      if (old) taken.delete(old);
      c.sponsor = undefined;
      c.sponsorChecked = s.year;
      if (!hasDeal(c)) {
        setName(c, '');
        continue;
      }
      const brand = F.sponsorBrand(taken);
      taken.add(brand);
      c.sponsor = { brand, from: s.year, until: s.year + dealLength(c) - 1 };
      setName(c, brand);
      if (!first && FM.News && (c.type === 'cup' || c.tier === 1))
        FM.News.add({
          type: 'world',
          title: `${brand} take over the title sponsorship`,
          body: `The ${c.baseName} is now the ${c.name}${old ? `, after ${old}'s deal ended` : ''}.`,
          cat: 'competitions',
        });
    }
  };
  F.sponsorsInit = () => F.sponsorsTick(true);
})();
