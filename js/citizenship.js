// A player's nationality, in pieces. One flag cannot say where a player was born, where he grew up, where his family is from, which
// passports he holds and which national teams he could play for, so each is its own field:
//   p.nat      where he grew up: his football nation, which sets his name's culture, his youth system and the team he plays for
//              unless he chooses another (p.alleg)
//   p.birth    the country he was born in (absent: the one he grew up in)
//   p.origins  his heritage countries, [[country, share]]: 1 both parents, 0.5 one parent, 0.25 a grandparent (absent: none)
//   p.cit      the citizenships he holds (absent: only p.nat's); can leave a heritage country out
//   p.nat2     the one other nation he could represent: kept consistent with the fields above, because the international code, the
//              scouting reports and the player card all read it (W.eligibleFor lists every nation he could play for)
// Only what differs from the default is stored, so a squad of home-grown players carries none of it.
// Phase 2: what each nation's law lets a family claim (D.CITIZENSHIP, a first pass from general knowledge, to be checked against
// current law: the world editor can change each nation's), and which nations a player can play for and why.
(function () {
  const FM = window.FM,
    D = FM.D,
    U = FM.U,
    W = FM.W;

  // ---------- The laws ----------
  // soli: citizenship by being born there: 'full' (unconditional: most of the Americas), 'cond' (born to parents who live there: much of
  //   Europe) or 'none'. descent: how many generations back a claim goes: 1 a parent, 2 a grandparent, 99 any ancestor.
  //   dual: whether its citizens may hold another passport: 'yes', 'limited' (only in some cases, or the other must be given up) or 'no'.
  // Naturalisation by years of residence is D.NATURALISE (js/data.js).
  D.CITIZENSHIP_DEFAULT = { soli: 'none', descent: 1, dual: 'yes' };
  const list = (s) => s.split(' ');
  D.CITIZENSHIP = {};
  const set = (codes, o) => {
    for (const c of list(codes)) D.CITIZENSHIP[c] = { ...(D.CITIZENSHIP[c] || {}), ...o };
  };
  set(
    'USA CAN BRA ARG MEX COL CHI PER URU PAR ECU VEN BOL GUA HON SLV NCA CRC PAN CUB DOM JAM TRI BRB BAH BLZ GUY PAK ATG GRN LCA SKN VIN DMA',
    { soli: 'full' },
  );
  set('GER FRA IRL ENG SCO WAL NIR NED BEL ESP POR GRE AUS NZL RSA LUX', { soli: 'cond' });
  set('ITA IRL ISR ESP POR MNE TUN ALG LBN', { descent: 2 });
  set('POL GRE HUN ARM CRO BUL ROU SRB IRN MAR', { descent: 99 });
  set('IND CHN KSA UAE QAT KUW BHR OMA SGP IDN MYS UKR KAZ UZB TKM KGZ MNG NEP PRK MMR LAO CMR COD ETH TAN EST AZE', {
    dual: 'no',
  });
  set('JPN AUT NED KOR VIE SVK SVN LVA LTU BAN BLR ZIM RSA ZAM MOZ ESP', { dual: 'limited' });
  D.CITIZENSHIP_BASE = JSON.parse(JSON.stringify(D.CITIZENSHIP)); // (the game's own, for the editor to compare with)
  D.law = (code) => ({ ...D.CITIZENSHIP_DEFAULT, ...(D.CITIZENSHIP[code] || {}) });
  // how the laws read in words, for the editor and the player card
  D.LAW_TEXT = {
    soli: { none: 'not by place of birth', cond: 'by birth to parents who live there', full: 'by birth there' },
    dual: {
      yes: 'allows another passport',
      limited: 'allows another passport only in some cases',
      no: 'does not allow another passport',
    },
    descent: (n) => (n >= 99 ? 'any ancestor' : n === 2 ? 'a parent or grandparent' : 'a parent'),
  };

  // ---------- Reading ----------
  W.birthOf = (p) => p.birth || p.nat;
  W.originsOf = (p) => p.origins || [];
  W.citizenships = (p) => (p.cit && p.cit.length ? p.cit : [p.nat]);
  W.holdsPassport = (p, code) => W.citizenships(p).includes(code);
  const genOf = (share) => (share >= 0.5 ? 1 : 2); // (a parent, or a grandparent)
  // The origin that links him to a country, if he has one: [country, share]
  const originOf = (p, code) => W.originsOf(p).find((o) => o[0] === code);
  // Could his family claim the citizenship of a country he does not hold: its law reaches back as far as his link
  W.canClaim = (p, code) => {
    const o = originOf(p, code);
    return !!o && W.law(code).descent >= genOf(o[1]);
  };
  W.law = D.law;
  // Can he play for this nation, and how: { ok, via }, via 'home' (he grew up there), 'passport', 'naturalised', 'birth' (born there),
  // 'descent' (his family could claim its citizenship) or 'family' (an older save's second nation)
  W.canRepresent = (p, code) => {
    if (!code || !D.NATIONS[code]) return { ok: false, via: null };
    if (code === p.nat) return { ok: true, via: 'home' };
    if (p.natur && p.natur.code === code) return { ok: true, via: 'naturalised' };
    if (W.holdsPassport(p, code)) return { ok: true, via: 'passport' };
    if (W.birthOf(p) === code) return { ok: true, via: 'birth' };
    if (W.canClaim(p, code)) return { ok: true, via: 'descent' };
    if (code === p.nat2) return { ok: true, via: 'family' };
    return { ok: false, via: null };
  };
  // Every nation he could represent, the one he grew up in first
  W.eligibleFor = (p) =>
    [
      ...new Set([
        p.nat,
        W.birthOf(p),
        ...W.citizenships(p),
        ...W.originsOf(p).map((o) => o[0]),
        p.nat2,
        p.natur && p.natur.code,
      ]),
    ].filter((c) => W.canRepresent(p, c).ok);
  // In words: "holds a Moroccan passport (one parent from there)", "could claim Algerian citizenship through a grandparent"
  const KIN = { 1: 'both parents', 0.5: 'one parent', 0.25: 'a grandparent' };
  W.eligibilityText = (p, code) => {
    const r = W.canRepresent(p, code),
      o = originOf(p, code),
      kin = o ? ` (${KIN[o[1]] || 'family'} from there)` : '';
    return {
      home: 'grew up there',
      passport: `holds the passport${kin}`,
      naturalised: `naturalised${p.natur && p.natur.year ? ' in ' + p.natur.year : ''}`,
      birth: 'born there',
      descent: `could claim citizenship through ${o ? KIN[o[1]] || 'family' : 'his family'}`,
      family: 'through his family',
    }[r.via];
  };

  // ---------- Making them ----------
  // How a heritage player's family is split (both parents, one, a grandparent). Whether a link is enough to claim the country's
  // citizenship is its law (above); whether he has actually claimed the passport is the draw below.
  D.ORIGIN_SHARE = [
    [1, 0.25],
    [0.5, 0.35],
    [0.25, 0.4],
  ];
  D.ORIGIN_CLAIM = { 1: 0.85, 2: 0.45 }; // (of those the law lets claim: by the generation of the link)
  D.BORN_ABROAD = 0.12; // (of those with a parent from the origin country: born there and brought up here)
  // the share of dual-citizenship laws that let him hold both: a nation that bans or restricts it makes holding both rarer
  const DUAL = { yes: 1, limited: 0.65, no: 0.2 };
  const SOLI_PASSPORT = { full: 0.95, cond: 0.8, none: 0.6 }; // (born there: the passport comes with it, or he has claimed it through a parent)

  // A player made with a heritage: his origin country, where he was born, whether the law lets him play for it and which passports he
  // holds. Sets birth, origins, cit and nat2.
  W.rollOrigin = function (p, nat, heritage, poolKey) {
    delete p.birth;
    delete p.origins;
    delete p.cit;
    p.nat2 = null;
    const origin = heritage ? W.originCountry(nat, heritage, poolKey) : null;
    if (!origin) return;
    const share = U.wpick(D.ORIGIN_SHARE, (x) => x[1])[0],
      lawO = W.law(origin),
      dual = DUAL[lawO.dual] * DUAL[W.law(nat).dual];
    p.origins = [[origin, share]];
    const abroad = share >= 0.5 && Math.random() < D.BORN_ABROAD;
    if (abroad) p.birth = origin;
    if (abroad || lawO.descent >= genOf(share)) {
      p.nat2 = origin;
      const hold = abroad ? SOLI_PASSPORT[lawO.soli] : D.ORIGIN_CLAIM[genOf(share)];
      if (Math.random() < hold * dual) p.cit = [nat, origin];
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
