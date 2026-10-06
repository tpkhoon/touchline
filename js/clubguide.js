// The club guide: what a new player needs to choose a club in a world they don't know yet. It works from the static club
// data alone (the world isn't built until the career starts): a difficulty label from squad strength against the league,
// money and what the board will expect, a one-line hook, tags, a likely objective, the rival, the league in a card, and
// a short list of suggestions from three questions.
(function () {
  const FM = window.FM,
    D = FM.D,
    U = FM.U;
  const G = (FM.Guide = {});

  let IDX = null;
  // Clubs ranked by reputation inside their league (B teams aren't yours to manage and are left out)
  G.index = function () {
    if (IDX) return IDX;
    IDX = { byCode: {}, leagues: {} };
    D.LEAGUES.forEach((l) => {
      const rows = (D[l.clubs] || []).filter((r) => !r[9]).sort((a, b) => b[6] - a[6]);
      const n = rows.length;
      IDX.leagues[l.id] = { l, rows, n };
      const caps = rows.map((r) => G.capOf(r)).sort((a, b) => b - a);
      rows.forEach((r, i) => {
        IDX.byCode[r[1]] = {
          row: r,
          l,
          rank: i,
          n,
          pct: n > 1 ? i / (n - 1) : 0.5,
          bigGround: G.capOf(r) >= caps[Math.max(0, Math.round(n * 0.25) - 1)],
        };
      });
    });
    return IDX;
  };
  G.capOf = (r) => r[8] || Math.round((8000 + (r[6] - 40) * 900) / 500) * 500;
  G.entry = (code) => G.index().byCode[code] || null;
  G.name = (code) => (G.entry(code) ? G.entry(code).row[0] : code);

  const KEYS = {
    relaxed: { label: 'Relaxed', color: '#34d399', blurb: 'A strong, well-funded club that is expected to win.' },
    balanced: { label: 'Balanced', color: '#60a5fa', blurb: 'Mid-table with room to grow.' },
    tough: { label: 'Tough', color: '#fbbf24', blurb: 'Expected to struggle, with little money.' },
    brutal: { label: 'Brutal', color: '#f87171', blurb: 'Relegation favourites: for experienced managers.' },
  };
  G.KEYS = KEYS;

  // A score from about -0.3 (cruising) to 1.1 (hopeless): how far down the league the squad sits, less the money,
  // plus the weight of expectations a weak squad of a big name carries
  G.score = function (code) {
    const e = G.entry(code);
    if (!e) return 0.5;
    const idt = D.IDENTITY[e.row[5]];
    let s = e.pct - (idt.budget - 1) * 0.3;
    if (['oil', 'giant', 'fallen'].includes(e.row[5]) && e.pct > 0.5) s += 0.1;
    return s;
  };
  G.diffKey = function (code) {
    const s = G.score(code);
    return s < 0.1 ? 'relaxed' : s < 0.5 ? 'balanced' : s < 0.92 ? 'tough' : 'brutal';
  };
  G.diff = function (code) {
    const e = G.entry(code);
    if (!e) return null;
    const idt = D.IDENTITY[e.row[5]],
      key = G.diffKey(code);
    const rank =
      e.rank === 0
        ? 'The strongest squad in the league'
        : e.rank === e.n - 1
          ? 'The weakest squad in the league'
          : `${U.ordinal(e.rank + 1)} of ${e.n} on squad strength`;
    const money =
      idt.budget >= 1.6
        ? 'deep pockets'
        : idt.budget >= 1.1
          ? 'a healthy budget'
          : idt.budget >= 0.9
            ? 'a modest budget'
            : 'a tight budget';
    return { key, ...KEYS[key], why: `${rank}, ${money}` };
  };

  // What the board will most likely ask (the real objectives are set when you take charge)
  G.objective = function (code) {
    const e = G.entry(code);
    if (!e) return '';
    const r = e.l.rules || {},
      pos = e.rank + 1,
      idt = e.row[5];
    const relN = r.relegate ? r.relegate.n : 0,
      promN = r.promote ? r.promote.auto : 0,
      qual = r.qualify ? r.qualify.n : 0;
    const cont = qual && D.CONTINENTALS.find((c) => c.id === r.qualify.to);
    let o;
    if (pos <= Math.max(1, Math.round(e.n * 0.06))) o = 'Win the league';
    else if (cont && pos <= qual + 1) o = `Qualify for the ${cont.name}`;
    else if (e.l.tier > 1 && promN && pos <= promN + 2) o = 'Win promotion';
    else if (relN && pos > e.n - relN - 2) o = 'Avoid relegation';
    else if (pos <= e.n / 2) o = 'Finish in the top half';
    else o = relN ? 'Stay up and build' : 'Climb the table';
    const twist = { youth: 'play academy graduates', selling: 'turn a profit', fan: 'play attacking football' }[idt];
    return twist ? `${o}, and ${twist}` : o;
  };

  const HOOKS = {
    oil: [
      'Sovereign-wealth money and a squad to match: anything but the title is a failure.',
      'New money, big promises and a squad still catching up with the ambition.',
      'Rich owners want the top; the squad is a long way from it.',
    ],
    giant: [
      'A giant at full strength: the title is the minimum.',
      'A proud name chasing past glory with a middling squad.',
      'A giant in decline: the trophy room is full, the team is not.',
    ],
    historic: [
      'Proud history and a squad finally good enough to live up to it.',
      'A proud old club, comfortable, dreaming of European nights.',
      'Proud history, thin squad: pride alone will not keep them up.',
    ],
    fan: [
      'Fan-owned and flying: the supporters own the dream.',
      'Run by the fans, for the fans, and within their means.',
      'Fan-owned and fragile: every pound counts, every point matters.',
    ],
    youth: [
      'A famous academy and a first team good enough to win with it.',
      'The academy is the pride of the town; the first team is a work in progress.',
      'Kids first, results second: a proper development job.',
    ],
    selling: [
      'Sells well and still wins: a smart club on a strong run.',
      'Buy low, sell high: a club that lives off its eye for talent.',
      'The best players always leave: stay up and find the next gem.',
    ],
    fallen: [
      'A fallen giant back on its feet: the old fans dare to dream.',
      'A fallen giant rebuilding: the glory days are a long way back.',
      'A fallen giant on the floor: huge name, weak squad, a real rebuild.',
    ],
  };
  G.hook = function (code) {
    const e = G.entry(code);
    if (!e) return '';
    const set = HOOKS[e.row[5]] || HOOKS.historic;
    return set[e.pct < 0.25 ? 0 : e.pct < 0.65 ? 1 : 2];
  };

  G.info = (code) => {
    const i = D.CLUB_INFO[code] || [];
    return { nick: i[1] || '', founded: i[2] || 0 };
  };
  G.tradition = (code) => D.TRADITIONS[U.hash(code) % D.TRADITIONS.length];
  G.rival = function (code) {
    const r = D.RIVALS.find((x) => x[0] === code || x[1] === code);
    if (!r) return null;
    const other = r[0] === code ? r[1] : r[0];
    return G.entry(other) ? { code: other, name: G.name(other), derby: r[2], row: G.entry(other).row } : null;
  };
  G.tags = function (code) {
    const e = G.entry(code);
    if (!e) return [];
    const idt = D.IDENTITY[e.row[5]],
      out = [`${idt.icon} ${idt.label}`];
    const pol = D.CLUB_POLICY && D.CLUB_POLICY[code];
    if (pol) out.push(`Only ${pol.label} players`);
    if (G.rival(code)) out.push('Derby club');
    if (e.bigGround) out.push('Big ground');
    const f = G.info(code).founded;
    if (f && f < 1890) out.push(`Est. ${f}`);
    else if (f && f > 1975) out.push('Young club');
    return out.slice(0, 4);
  };

  G.leagueCard = function (l) {
    const x = G.index().leagues[l.id];
    if (!x) return '';
    const r = l.rules || {},
      parts = [`${x.n} clubs`];
    const cont = r.qualify && D.CONTINENTALS.find((c) => c.id === r.qualify.to);
    if (cont) parts.push(`${r.qualify.n} ${cont.name} places`);
    if (r.promote) parts.push(`${r.promote.auto} promoted`);
    if (r.relegate) parts.push(`${r.relegate.n} relegated`);
    const rich = x.rows.filter((c) => c[5] === 'oil' || c[5] === 'giant').length;
    if (rich) parts.push(`${rich} rich or giant club${rich > 1 ? 's' : ''}`);
    const d = { relaxed: 0, brutal: 0 };
    x.rows.forEach((c) => {
      const k = G.diffKey(c[1]);
      if (d[k] !== undefined) d[k]++;
    });
    const top = x.rows[0];
    return `${parts.join(' · ')}. Strongest: ${top[0]}${d.brutal ? `; ${d.brutal} brutal job${d.brutal > 1 ? 's' : ''} for the brave` : ''}.`;
  };

  // ---------- suggestions ----------
  // want: { diff: 'relaxed' | 'balanced' | 'fight', project: 'trophies' | 'rebuild' | 'youth' | 'underdog', where: 'any' | league id | 'nat:XXX' }
  const TARGET = { relaxed: 0.0, balanced: 0.32, fight: 0.8 };
  const PROJECT = {
    trophies: (e) => (['oil', 'giant', 'historic'].includes(e.row[5]) ? 1.2 : 0) + (e.pct < 0.3 ? 1 : 0),
    rebuild: (e) =>
      (['fallen', 'giant', 'historic'].includes(e.row[5]) ? 1.4 : 0) +
      (e.pct > 0.35 ? 0.9 : 0) +
      (e.bigGround ? 0.5 : 0),
    youth: (e) => (['youth', 'selling', 'fan'].includes(e.row[5]) ? 1.8 : 0) + (e.pct > 0.2 ? 0.3 : 0),
    underdog: (e) =>
      (e.pct > 0.5 ? 1 : 0) + (e.l.tier > 1 ? 0.7 : 0) + (['fan', 'selling', 'youth'].includes(e.row[5]) ? 0.4 : 0),
  };
  const WHY = {
    trophies: 'Trophies now',
    rebuild: 'A rebuild',
    youth: 'Develop young players',
    underdog: 'An underdog climb',
  };
  G.reason = function (code, project) {
    const e = G.entry(code),
      rv = G.rival(code),
      d = G.diff(code);
    const bits = [`${G.capOf(e.row).toLocaleString()} seats`, d.why.charAt(0).toLowerCase() + d.why.slice(1)];
    if (rv) bits.push(`the ${rv.derby} against ${rv.name}`);
    return `${bits.join(', ')}. ${WHY[project] || 'A good fit'}.`;
  };
  G.recommend = function (want, skip = []) {
    const t = TARGET[want.diff] ?? 0.32,
      proj = PROJECT[want.project] || PROJECT.underdog;
    const pool = Object.values(G.index().byCode).filter((e) => {
      if (skip.includes(e.row[1])) return false;
      if (want.where && want.where !== 'any') {
        if (want.where.startsWith('nat:') ? e.l.nat !== want.where.slice(4) : e.l.id !== want.where) return false;
      }
      return true;
    });
    const scored = pool
      .map((e) => ({ e, s: proj(e) - Math.abs(G.score(e.row[1]) - t) * 3.2 + Math.random() * 0.6 }))
      .sort((a, b) => b.s - a.s);
    // three clubs, from different leagues where the pool allows it
    const out = [],
      seen = new Set();
    for (const x of scored) {
      if (out.length === 3) break;
      if (seen.has(x.e.l.id) && scored.length > 12 && want.where === 'any') continue;
      seen.add(x.e.l.id);
      out.push({ code: x.e.row[1], reason: G.reason(x.e.row[1], want.project) });
    }
    return out;
  };
})();
