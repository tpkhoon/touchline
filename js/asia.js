// Asia: the things that make football there its own game. Korea's military service takes its players away for two seasons in
// their mid-twenties unless a big tournament has exempted them. The best of them join the army's club (Gimcheon Sangmu in real
// life, D.CLUB_POLICY.GIM), a K League club whose squad is nothing but conscripts on loan from their own clubs; they return a
// little rusty. (The AFC's foreign-player places are in registration.js, Japan's university route is the graduate draft in
// draft.js, Gulf money is in transfers.js.)
(function () {
  const FM = window.FM,
    W = FM.W,
    U = FM.U;
  const A = (FM.Asia = {});
  A.SERVICE_YEARS = 2;
  A.CAMP_SIZE = 30; // the army's club takes this many; the rest serve in other units, away from football
  A.serving = (p) => !!p.service;
  // The army's club, if the world has one
  A.camp = () => Object.values(FM.S.clubs).find((c) => c.policy && c.policy.military) || null;
  // A conscript joins the army's club on loan from the club he belongs to (at world creation the player has no club yet: the
  // parent is a K League club picked for him). Nobody pays his wage.
  A.enlist = function (p, camp, parentId, years) {
    const S = FM.S,
      kr = Object.values(S.clubs).filter((c) => c.comp === camp.comp && c.id !== camp.id);
    const from = parentId || (kr.length ? U.pick(kr).id : camp.id);
    p.service = { from: S.year, until: S.year + (years || U.randi(1, A.SERVICE_YEARS)) };
    p.loan = { from, share: 0, fee: 0, year: S.year, wg: 0, wa: 0, military: true };
    p.contract = Math.max(p.contract || 0, p.service.until + 1);
    if (!parentId) p.clubId = camp.id; // (a call-up during the game is moved by the caller)
    p.exempt = false;
  };
  const release = function (p) {
    // service over: back to his own club, a little rusty
    const sp = W.spell(p);
    if (sp) sp.to = FM.S.year;
    const parent = p.loan.from;
    delete p.loan;
    p.team = undefined;
    W.startSpell(p, parent);
  };
  // Called once a summer, after the new season is set up
  A.newSeason = function () {
    const S = FM.S,
      camp = A.camp();
    // back from service
    for (const p of Object.values(S.players)) {
      if (!p.service || p.retired || S.year < p.service.until) continue;
      delete p.service;
      p.exempt = true; // (served: he is not called up again)
      if (p.loan && p.loan.military) release(p);
      p.ca = Math.max(20, p.ca - U.randi(1, 3));
      p.morale = 70;
      if (W.ownPlayer(p) || p.ca >= 72)
        FM.News.add({
          type: 'world',
          title: `${W.short(p)} completes his military service`,
          body: `${W.name(p)} is back after ${A.SERVICE_YEARS} seasons away. He needs time to find his rhythm.`,
          pid: p.id,
          clubId: p.clubId || undefined,
        });
    }
    // this summer's call-ups
    const called = [];
    for (const p of Object.values(S.players)) {
      if (p.nat !== 'KOR' || p.retired || p.service || p.exempt || !p.clubId) continue;
      const age = W.age(p);
      if (age < 26 || age > 28) continue;
      // exempt after a medal at the Asian Games or a deep World Cup run: here, a long international career, or luck
      if ((p.intl && p.intl.caps >= 25 && U.chance(0.6)) || U.chance(0.12)) {
        p.exempt = true;
        if (W.ownPlayer(p) || p.ca >= 72)
          FM.News.add({
            type: 'world',
            title: `${W.short(p)} is exempted from military service`,
            body: `${W.name(p)}'s international success earns him an exemption: he can play on.`,
            pid: p.id,
            clubId: p.clubId,
          });
        continue;
      }
      if (age < 27 && !U.chance(0.5)) continue;
      called.push(p);
    }
    // the army's club takes the best of them (and always keepers, so it can field a side); the rest serve out of the game
    const intake = camp ? W.squad(camp.id).length : 0;
    let room = camp ? Math.max(0, A.CAMP_SIZE - intake) : 0;
    let keepers = camp ? W.squad(camp.id).filter((p) => p.pos === 'GK').length : 0;
    called.sort(
      (a, b) => (b.pos === 'GK' && keepers < 3 ? 1 : 0) - (a.pos === 'GK' && keepers < 3 ? 1 : 0) || b.ca - a.ca,
    );
    for (const p of called) {
      const parent = p.clubId,
        spare = p.pos === 'GK' && keepers >= 4, // (the army's club needs four keepers at most)
        user = W.ownPlayer(p);
      if (camp && room > 0 && !p.loan && !spare) {
        const sp = W.spell(p);
        if (sp) sp.to = S.year;
        A.enlist(p, camp, parent, A.SERVICE_YEARS);
        W.startSpell(p, camp.id); // (a loan spell with the army's club)
        const ns = W.spell(p);
        if (ns) ns.loan = true;
        if (W.isUser(parent) && S.user.tactic.lineup)
          S.user.tactic.lineup = S.user.tactic.lineup.map((x) => (x === p.id ? null : x));
        room--;
        if (p.pos === 'GK') keepers++;
      } else {
        p.service = { from: S.year, until: S.year + A.SERVICE_YEARS };
        p.contract = Math.max(p.contract, p.service.until + 1);
      }
      if (user || p.ca >= 72)
        FM.News.add({
          type: 'world',
          title: `${W.short(p)} begins his military service`,
          body: `${W.name(p)} leaves for ${A.SERVICE_YEARS} seasons of national service${
            p.loan && p.loan.military ? `, on loan to ${camp.name}, the army's club` : ''
          }. He cannot play for ${S.clubs[parent].name} until ${p.service.until}, and his contract has been extended to cover it.`,
          pid: p.id,
          clubId: parent,
        });
    }
  };
})();
