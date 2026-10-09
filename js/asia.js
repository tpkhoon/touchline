// Asia: the things that make football there its own game. Korea's military service takes its players away for a stretch in
// their mid-twenties unless a big tournament has exempted them; they return a little rusty. (The AFC's foreign-player places
// are in registration.js, Japan's university route is the graduate draft in draft.js, Gulf money is in transfers.js.)
(function () {
  const FM = window.FM,
    W = FM.W,
    U = FM.U;
  const A = (FM.Asia = {});
  // South Korean men serve about eighteen months; modelled as two seasons away from the squad
  A.SERVICE_YEARS = 2;
  A.serving = (p) => !!p.service;
  // Called once a summer, after the new season is set up
  A.newSeason = function () {
    const S = FM.S;
    for (const p of Object.values(S.players)) {
      if (p.nat !== 'KOR' || p.retired) continue;
      if (p.service && S.year >= p.service.until) {
        // back from service: rusty, and the contract he left on
        delete p.service;
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
        continue;
      }
      if (p.service || p.exempt || !p.clubId) continue;
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
      p.service = { from: S.year, until: S.year + A.SERVICE_YEARS };
      p.contract = Math.max(p.contract, S.year + A.SERVICE_YEARS + 1);
      if (W.ownPlayer(p) || p.ca >= 72)
        FM.News.add({
          type: 'world',
          title: `${W.short(p)} begins his military service`,
          body: `${W.name(p)} leaves for ${A.SERVICE_YEARS} seasons of national service. He cannot play for ${S.clubs[p.clubId].name} until ${p.service.until}, and his contract has been extended to cover it.`,
          pid: p.id,
          clubId: p.clubId,
        });
    }
  };
})();
