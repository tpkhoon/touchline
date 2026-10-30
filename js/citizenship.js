// A player's nationality, in pieces. One flag cannot say where a player was born, where he grew up, where his family is from, which
// passports he holds and which national teams he could play for, so each is its own field:
//   p.nat      where he grew up: his football nation, which sets his name's culture, his youth system and the team he plays for
//              unless he chooses another (p.alleg)
//   p.birth    the country he was born in (absent: the one he grew up in)
//   p.origins  his heritage countries, [[country, share]]: 1 both parents, 0.5 one parent, 0.25 a grandparent (absent: none)
//   p.cit      the citizenships he holds (absent: only p.nat's); can leave a heritage country out
//   p.nat2     the one other nation he could represent: kept consistent with the fields above, because the international code, the
//              scouting reports and the player card all read it (W.eligibleFor lists every nation he could play for)
// Only what differs from the default is stored, so a squad of home-grown players carries none of it. Phase 1: the fields and their
// generation; the nations' citizenship laws and the football eligibility rules come next, as data.
(function () {
  const FM = window.FM,
    D = FM.D,
    U = FM.U,
    W = FM.W;

  // ---------- Reading ----------
  W.birthOf = (p) => p.birth || p.nat;
  W.originsOf = (p) => p.origins || [];
  W.citizenships = (p) => (p.cit && p.cit.length ? p.cit : [p.nat]);
  W.holdsPassport = (p, code) => W.citizenships(p).includes(code);
  // Every nation he could represent, the one he grew up in first
  W.eligibleFor = (p) =>
    [...new Set([p.nat, W.birthOf(p), ...W.citizenships(p), p.nat2, p.natur && p.natur.code])].filter(
      (c) => c && D.NATIONS[c],
    );

  // ---------- Making them ----------
  // How a heritage player's family is split (both parents, one, a grandparent), and how likely it is that the link makes him
  // eligible for the origin country and that he holds its passport. These are the data the nations' own citizenship laws will replace.
  D.ORIGIN_SHARE = [
    [1, 0.3],
    [0.5, 0.4],
    [0.25, 0.3],
  ];
  D.ORIGIN_ELIGIBLE = { 1: 0.95, 0.5: 0.75, 0.25: 0.3 }; // (overall about 0.7 of heritage players are eligible for another nation, as before)
  D.ORIGIN_PASSPORT = { 1: 0.9, 0.5: 0.75, 0.25: 0.4 }; // (of those who are eligible)
  D.BORN_ABROAD = 0.12; // (of those with a parent from the origin country: born there and brought up here)

  // A player made with a heritage: his origin country, where he was born, which passports he holds and whether he could play for
  // the origin country. Sets birth, origins, cit and nat2.
  W.rollOrigin = function (p, nat, heritage, poolKey) {
    delete p.birth;
    delete p.origins;
    delete p.cit;
    p.nat2 = null;
    const origin = heritage ? W.originCountry(nat, heritage, poolKey) : null;
    if (!origin) return;
    const share = U.wpick(D.ORIGIN_SHARE, (x) => x[1])[0];
    p.origins = [[origin, share]];
    const abroad = share >= 0.5 && Math.random() < D.BORN_ABROAD,
      eligible = abroad || Math.random() < D.ORIGIN_ELIGIBLE[share];
    if (abroad) p.birth = origin;
    if (eligible) {
      p.nat2 = origin;
      if (abroad || Math.random() < D.ORIGIN_PASSPORT[share]) p.cit = [nat, origin];
    }
  };

  // ---------- Older players ----------
  // A player made before these fields: his heritage and second nation give his origin, a naturalised player holds the new passport,
  // and of those eligible through family about two in three hold the passport (decided by his id, so it is the same every time).
  W.migrateNationality = function (p) {
    if (p.origins !== undefined || p.cit !== undefined || p.birth !== undefined) return; // (a player with nothing to record keeps no field at all)
    const cit = [p.nat];
    if (p.nat2 && D.NATIONS[p.nat2]) {
      if (p.heritage) p.origins = [[p.nat2, 0.5]];
      if (p.natur || U.hash(p.id) % 100 < 65) cit.push(p.nat2);
    }
    if (p.natur && p.natur.code && !cit.includes(p.natur.code)) cit.push(p.natur.code);
    if (cit.length > 1) p.cit = cit;
  };
  // Start his nationality again from what he is now (a nation changed by an editor or by a club's signing rule)
  W.resetNationality = function (p) {
    delete p.birth;
    delete p.origins;
    delete p.cit;
    W.migrateNationality(p);
  };
})();
