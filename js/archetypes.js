// Nationality archetypes: the way a nation's players are made, beyond the nation's own bias (D.NATIONS[x].bias, the whole squad
// leaning one way). An archetype leans each position group its own way (the Brazilian forward and the Brazilian full-back both
// dribble, the Serbian centre-back plays the ball out and tackles hard) and makes some traits likelier (Flair, Engine, Aerial
// Threat ...). A nation has one or more; a nation not listed has its part of the world's. Used when a player is made
// (FM.W.genPlayer), so a new world, the academy intakes and the free agents the world makes all show it.
(function () {
  const FM = window.FM,
    D = FM.D;

  // pos: lean per position group (GK, DEF, MID, ATT; ALL for every outfield group), traits: [chance, the attribute he needs, at least]
  D.ARCHETYPES = {
    flair: {
      label: 'Flair',
      desc: 'Trickery and dribbling everywhere: forwards and wide men who beat a man, and full-backs who go forward.',
      pos: {
        ATT: { dribbling: 1.2, technique: 1, finishing: 0.6, composure: -0.3 },
        MID: { dribbling: 1, technique: 1, vision: 0.5 },
        DEF: { dribbling: 0.8, pace: 0.6, passing: 0.5, tackling: -0.5, positioning: -0.4 },
      },
      traits: { Flair: [0.2, 'dribbling', 11] },
    },
    technicaldef: {
      label: 'Technical and defensive',
      desc: 'Defence first, with the ball played out: composed, ball-playing defenders and tough, technical midfielders.',
      pos: {
        DEF: { tackling: 1.2, positioning: 1.2, composure: 1, passing: 1, technique: 0.8 },
        MID: { tackling: 1, technique: 1, passing: 0.6, composure: 0.6 },
        ATT: { technique: 0.8, strength: 0.6, composure: 0.5 },
        GK: { handling: 0.6, positioning: 0.5 },
      },
      traits: { Consistent: [0.05, null, 0], 'Hatchet Man': [0.04, 'tackling', 10] },
    },
    maestros: {
      label: 'Midfield maestros',
      desc: 'Passers and thinkers: midfielders who see the game early and play it short and quick.',
      pos: {
        MID: { passing: 1.4, vision: 1.4, technique: 1.2, composure: 0.6 },
        ATT: { passing: 0.6, vision: 0.6, technique: 0.5 },
        DEF: { passing: 0.8, vision: 0.5, technique: 0.5 },
      },
      traits: {},
    },
    catenaccio: {
      label: 'Defensive craft',
      desc: 'Defending as an art: reading the game, marking tight and staying calm.',
      pos: {
        DEF: { positioning: 1.6, tackling: 1.4, composure: 1 },
        MID: { positioning: 0.8, tackling: 0.8 },
        ATT: { finishing: 0.5, composure: 0.5 },
        GK: { positioning: 0.8, handling: 0.5 },
      },
      traits: { Clutch: [0.05, 'composure', 11] },
    },
    athletes: {
      label: 'Athletes',
      desc: 'Pace and power in every line: quick, strong players who win races and duels.',
      pos: {
        ATT: { pace: 1.4, strength: 1 },
        DEF: { pace: 1.2, strength: 1 },
        MID: { stamina: 1, strength: 0.8, pace: 0.8 },
      },
      traits: { Engine: [0.07, 'stamina', 12] },
    },
    powerhouse: {
      label: 'Powerhouse',
      desc: 'Big, strong and direct: commanding centre-backs, forwards who hold the ball up, midfielders who win it.',
      pos: {
        DEF: { strength: 1.4, positioning: 0.6 },
        ATT: { strength: 1.2, finishing: 0.4 },
        MID: { strength: 1, workRate: 0.8 },
        GK: { strength: 0.4 },
      },
      traits: { 'Aerial Threat': [0.12, 'strength', 11] },
    },
    engine: {
      label: 'Tireless pressers',
      desc: 'Fit and organised: players who run all day and press as a unit.',
      pos: {
        MID: { stamina: 1.4, workRate: 1.4 },
        ATT: { workRate: 1.2, stamina: 1 },
        DEF: { workRate: 1, stamina: 0.8, positioning: 0.4 },
      },
      traits: { Engine: [0.1, 'stamina', 12] },
    },
    keepers: {
      label: 'Goalkeeping school',
      desc: 'A tradition of good goalkeepers: sharper hands and better positioned.',
      pos: { GK: { reflexes: 1.4, handling: 1.4, positioning: 0.8 } },
      traits: {},
    },
    gaucho: {
      label: 'Grit and skill',
      desc: 'Street football: midfielders who win the ball and forwards who dribble through it.',
      pos: {
        MID: { tackling: 1, workRate: 1, dribbling: 0.6 },
        ATT: { dribbling: 1, composure: 0.6 },
        DEF: { tackling: 0.8, strength: 0.6 },
      },
      traits: { 'Big Game Player': [0.05, null, 0] },
    },
    orient: {
      label: 'Quick and light',
      desc: 'Technical, nimble players who rely on speed, movement and the ball at their feet rather than strength.',
      pos: {
        ATT: { pace: 1, dribbling: 1, technique: 0.8, strength: -1 },
        MID: { technique: 1, passing: 0.8, workRate: 1, strength: -1 },
        DEF: { workRate: 0.8, positioning: 0.6, strength: -1 },
        GK: { reflexes: 0.8 },
      },
      traits: {},
    },
    gulf: {
      label: 'Technical, light',
      desc: 'Skilful on the ball, lighter on the physical side: neat passers and dribblers.',
      pos: {
        ATT: { technique: 1, dribbling: 0.8, strength: -0.8, stamina: -0.5 },
        MID: { technique: 1.2, passing: 0.8, stamina: -0.6 },
        DEF: { technique: 0.6, strength: -0.4 },
      },
      traits: {},
    },
    islander: {
      label: 'Big-bodied',
      desc: 'Large, strong players, less refined with the ball.',
      pos: { ALL: { strength: 1.5, stamina: 0.8, pace: -0.4, technique: -0.5 } },
      traits: { 'Aerial Threat': [0.1, 'strength', 11] },
    },
  };

  // The nations by archetype (a nation can be in several)
  const MEMBERS = {
    flair: 'BRA COL ALG CIV HAI JAM TRI CUB DOM CUW SUR PAN HON GUY BRB',
    technicaldef: 'SRB MNE BIH MKD SVN KOS',
    maestros: 'ESP CRO BEL NED HUN UKR ROU JPN EGY ISR GEO ARM POR BUL',
    catenaccio: 'ITA GRE URU CYP MLT SMR AND GIB TUN',
    athletes:
      'FRA NGA SEN GHA CIV CMR COD MLI BFA GUI GAB ANG ZIM ZAM KEN TAN UGA ETH BEN TOG NIG CHA LBR SLE GAM GNB CPV RWA BDI MOZ CGO EQG SDN MAD USA AUS',
    powerhouse: 'ENG SCO WAL NIR IRL POL NOR SWE DEN ISL FIN CZE SVK AUT RUS GER LTU LVA EST BLR ALB',
    engine: 'GER AUT KOR USA AUS CZE SUI NED SVK JPN SCO FIN',
    keepers: 'GER ITA ENG DEN CZE POL BRA BEL SWE NED SRB ESP IRL',
    gaucho: 'ARG URU CHI PAR PER ECU VEN BOL MEX COL',
    orient: 'THA VIE IDN MYS PHI SGP CAM LAO MYA CHN TPE HKG MAC BRU TLS MNG BHU NEP IND BAN SRI MDV PAK KOR',
    gulf: 'KSA QAT UAE KUW BHR OMA IRQ JOR LBN SYR YEM PLE IRN AFG',
    islander: 'FIJ PNG SOL VAN NCL TAH WSM TGA ASA COK GUM NZL',
  };
  const NATION = {};
  for (const [k, list] of Object.entries(MEMBERS))
    for (const c of list.split(' ')) (NATION[c] = NATION[c] || []).push(k);
  D.NATION_ARCH = NATION;
  // A nation not listed: the part of the world's
  const REGION_DEFAULT = {
    EUR: ['powerhouse'],
    ENG: ['powerhouse'],
    SAM: ['gaucho'],
    AFR: ['athletes'],
    ASIA: ['orient'],
    NAM: ['flair'],
    OFC: ['islander'],
  };
  // The archetypes of a nation (keys), most telling first
  D.archetypesOf = (nat) => {
    const n = D.NATIONS[nat];
    return NATION[nat] || (n && REGION_DEFAULT[n.region]) || [];
  };
  // The lean for a player of this nation in this position: attribute → points to add (summed over the archetypes, kept within ±3)
  const cache = {};
  D.archetypeLean = (nat, pos) => {
    const g = D.POS_GROUP[pos],
      key = nat + '|' + g;
    if (cache[key]) return cache[key];
    const out = {};
    for (const a of D.archetypesOf(nat)) {
      const A = D.ARCHETYPES[a];
      if (!A) continue;
      for (const grp of [g, 'ALL']) for (const [k, v] of Object.entries(A.pos[grp] || {})) out[k] = (out[k] || 0) + v;
    }
    for (const k in out) out[k] = Math.max(-3, Math.min(3, out[k]));
    return (cache[key] = out);
  };
  // A nation's description, for its screen: [{ label, desc }]
  D.archetypeText = (nat) =>
    D.archetypesOf(nat).map((a) => ({ label: D.ARCHETYPES[a].label, desc: D.ARCHETYPES[a].desc }));
  // The traits a player of this nation may be given, with the chance of each: [trait, chance, attribute, at least]
  D.archetypeTraits = (nat) =>
    D.archetypesOf(nat).flatMap((a) =>
      Object.entries((D.ARCHETYPES[a] || {}).traits || {}).map(([t, [p, k, min]]) => [t, p, k, min]),
    );
})();
