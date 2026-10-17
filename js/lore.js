// Lore: the world's memory before the save, and the people in it. No DOM here: the simulation worker loads it.
//
//   FM.Geo   where clubs are (the real town each fictional club sits on): distances, away trips (tiredness, cost, the
//            extra edge of a long journey), clubs near each other, and the regions of the world.
//   FM.Lore  everything the world knew before the first match, in two layers:
//              the canon  - history built from the static club data alone (so it is the same in every career, costs
//                           nothing in a save, and can be shown on the club picker before a world exists): honours
//                           before the records began (champions, cup winners, seasons in the top flight, the best
//                           decade, named eras), club details (motto, anthem, mascot, ground nickname, record
//                           attendance, biggest win, most famous match), the origin and head-to-head of each derby, and
//                           the history of every league and cup (founding, trophy, format changes, giant-killings).
//              the state  - what a save adds (S.lore): derby results since the save began, new attendance records, and
//                           the people: legends who became managers, pundits, ambassadors and chairmen.
//
// The canon uses its own seeded random numbers, never Math.random, so nothing here changes how the rest of the world plays out.
(function () {
  const FM = window.FM,
    D = FM.D,
    U = FM.U,
    W = FM.W;
  const S = () => FM.S;
  const Geo = (FM.Geo = {});
  const L = (FM.Lore = {});

  // =============================================================== Geography
  const RAD = Math.PI / 180;
  const codeOf = (c) => (c && c.id ? c.id.slice(2) : null);
  // [latitude, longitude] of a club (or a club id)
  Geo.of = (c) => {
    if (typeof c === 'string') c = S() && S().clubs[c];
    return (c && (c.geo || (D.CLUB_GEO && D.CLUB_GEO[codeOf(c)]))) || null;
  };
  Geo.dist = (p, q) => {
    const a =
      Math.sin(((q[0] - p[0]) * RAD) / 2) ** 2 +
      Math.cos(p[0] * RAD) * Math.cos(q[0] * RAD) * Math.sin(((q[1] - p[1]) * RAD) / 2) ** 2;
    return Math.round(12742 * Math.asin(Math.min(1, Math.sqrt(a))));
  };
  // Kilometres between two clubs (null when either has no coordinates)
  Geo.km = (a, b) => {
    const p = Geo.of(a),
      q = Geo.of(b);
    return p && q ? Geo.dist(p, q) : null;
  };
  Geo.NEAR = 15; // clubs this close, in one country, share a local derby's edge
  Geo.local = (a, b) => {
    if (typeof a === 'string') a = S().clubs[a];
    if (typeof b === 'string') b = S().clubs[b];
    if (!a || !b || a.id === b.id || a.nat !== b.nat) return false;
    const km = Geo.km(a, b);
    return km != null && km <= Geo.NEAR;
  };
  // Starting stamina points an away side loses on a long journey: nothing under 300 km, 8 at most (about 6,500 km)
  Geo.fatigue = (km) => (km == null ? 0 : U.clamp(((km - 300) / 1000) * 1.25, 0, 8));
  // The extra edge a long trip gives the home side, on top of a visit from another country (Match.homeFactor)
  Geo.bonus = (km) => (km == null ? 0 : U.clamp((km - 400) / 16000, 0, 0.2));
  // What an away trip costs the visitors: a coach for the short ones, a charter flight for the long ones
  Geo.cost = (km, club) =>
    km == null || km < 150 ? 0 : Math.round(((1500 + km * 22) * (0.6 + (club ? club.rep : 50) / 100)) / 100) * 100;
  Geo.label = (km) => (km == null ? '' : km < 10 ? 'across town' : `${km.toLocaleString()} km`);
  // The nearest clubs to a club: [{ c, km }], optionally within one country
  Geo.nearest = function (club, n = 5, o = {}) {
    const p = Geo.of(club);
    if (!p) return [];
    return Object.values(S().clubs)
      .filter(
        (x) =>
          x.id !== club.id &&
          x.comp &&
          x.sim !== 'nation' &&
          !x.parent &&
          (!o.sameNat || x.nat === club.nat) &&
          Geo.of(x),
      )
      .map((x) => ({ c: x, km: Geo.dist(p, Geo.of(x)) }))
      .sort((a, b) => a.km - b.km)
      .slice(0, n);
  };
  Geo.regionOf = (nat) => (D.GEO_REGIONS.find((r) => r[2].includes(nat)) || [])[0] || null;
  Geo.regionName = (id) => (D.GEO_REGIONS.find((r) => r[0] === id) || [])[1] || '';
  Geo.regionNats = (id) => (D.GEO_REGIONS.find((r) => r[0] === id) || [])[2] || [];

  // =============================================================== Seeded random numbers
  const mulberry = (a) => () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rngOf = (key) => {
    const f = mulberry(U.hash('lore|' + key));
    f();
    f.int = (a, b) => a + Math.floor(f() * (b - a + 1));
    f.pick = (arr) => arr[Math.floor(f() * arr.length)];
    f.chance = (p) => f() < p;
    f.wpick = (arr, w) => {
      let t = 0;
      const ws = arr.map((x) => (t += Math.max(0, w(x))));
      let x = f() * t;
      for (let i = 0; i < arr.length; i++) if (x < ws[i]) return arr[i];
      return arr[arr.length - 1];
    };
    return f;
  };

  // =============================================================== Static club data
  // A descriptor for every club of the built-in world, from the club rows alone
  const descriptors = () => {
    const out = [];
    D.LEAGUES.forEach((l) =>
      (D[l.clubs] || []).forEach((r) => {
        const i = D.CLUB_INFO[r[1]] || [];
        out.push({
          code: r[1],
          name: r[0],
          city: r[2],
          identity: r[5],
          rep: r[6],
          cap: r[8] || Math.round((8000 + (r[6] - 40) * 900) / 500) * 500,
          ground: r[7] || `${r[2]} Stadium`,
          parent: r[9] || null,
          nat: l.nat,
          comp: l.id,
          tier: l.tier,
          founded: i[2] || null,
          nick: i[1] || '',
        });
      }),
    );
    return out;
  };

  // The year each nation's top flight began (the first national championship, in the real structure the fictional world mirrors)
  // prettier-ignore
  const NAT_LEAGUE = {
    ENG: 1888, SCO: 1890, WAL: 1904, IRL: 1921, ESP: 1929, ITA: 1929, GER: 1903, FRA: 1932, NED: 1898, BEL: 1895,
    POR: 1935, SUI: 1897, AUT: 1912, DEN: 1913, NOR: 1937, POL: 1927, CZE: 1925, HUN: 1901, SRB: 1923, GRE: 1959,
    TUR: 1959, ARG: 1931, BRA: 1959, MEX: 1943, USA: 1921, JPN: 1965, KOR: 1983, AUS: 1977, NGA: 1972, RSA: 1959,
    MAR: 1956, KSA: 1957, THA: 1960, IDN: 1931, MYS: 1921, VIE: 1955, SGP: 1921, PHI: 1946,
  };

  const hrange = (key, a, b) => a + (U.hash(key) % (b - a + 1));

  // =============================================================== The canon
  let CANON = null;
  L.reset = () => {
    CANON = null;
  };
  L.canon = () => CANON || (CANON = buildCanon());
  // A club's canon entry, by club or by code (null for clubs the built-in world does not have)
  L.of = (c) => {
    const code = typeof c === 'string' ? c.replace(/^c_/, '') : codeOf(c);
    return (code && L.canon().clubs[code]) || null;
  };

  function buildCanon() {
    const y1 = D.SEASON_START - 30; // the records begin here: everything before is canon
    const all = descriptors();
    const out = { y1, clubs: {}, nat: {}, comps: {}, rivals: {} };
    const byNat = {};
    all.forEach((c) => {
      if (c.parent) return;
      out.clubs[c.code] = c;
      (byNat[c.nat] = byNat[c.nat] || []).push(c);
    });
    for (const [nat, list] of Object.entries(byNat)) simulateNation(out, nat, list, y1);
    competitions(out, all, y1);
    Object.values(out.clubs).forEach((c) => fluff(out, c, y1, byNat[c.nat]));
    rivalries(out, y1);
    return out;
  }

  // ---------- Honours before the records ----------
  // Year by year from the first championship: each club's strength that year (its standing now, a golden age for some, the
  // giants always strong, new money weak before it arrived) picks a champion and a runner-up, a cup winner, and the sides in the top flight
  function profile(c, r, y1) {
    const span = y1 - c.start;
    const p = { base: c.rep, win: null };
    if (c.identity === 'giant') p.base = Math.max(c.rep, 74);
    else if (c.identity === 'oil') p.base = c.rep - 14;
    else if (c.identity === 'fallen') p.base = Math.max(34, c.rep - 10);
    if (span < 10) return p;
    const win = (peak, len, lo, hi) => {
      const end = hi >= lo ? r.int(lo, hi) : hi;
      return { from: Math.max(c.start, end - len), to: end, peak };
    };
    if (c.identity === 'fallen') p.win = win(r.int(76, 88), r.int(10, 22), c.start + 8, y1 - 7);
    else if (c.identity === 'historic' && r.chance(0.5))
      p.win = win(Math.min(86, c.rep + r.int(8, 16)), r.int(8, 14), c.start + 8, y1 - 3);
    else if (c.identity !== 'oil' && c.identity !== 'giant' && r.chance(0.22))
      p.win = win(Math.min(80, c.rep + r.int(6, 14)), r.int(5, 12), c.start + 4, y1 - 3);
    return p;
  }
  const lvl = (c, y) =>
    (c.prof.win && y >= c.prof.win.from && y <= c.prof.win.to ? c.prof.win.peak : c.prof.base) +
    ((U.hash(c.code + y) % 1000) / 1000 - 0.5) * 8;

  function simulateNation(out, nat, list, y1) {
    const lf = NAT_LEAGUE[nat] || 1950;
    const topL = D.LEAGUES.find((l) => l.nat === nat && l.tier === 1);
    const nTop = topL ? (D[topL.clubs] || []).length : 16;
    const r = rngOf('pre|' + nat);
    list.forEach((c) => {
      c.start = Math.max(lf, (c.founded || lf) + 2);
      c.prof = profile(c, rngOf('prof|' + c.code), y1);
      Object.assign(c, { t: [], cups: [], tf: 0, tfRec: 0, tfy: [] });
    });
    const cf = Math.max(1871, lf - 6 + hrange('cupf|' + nat, 0, 14)); // the national cup began around the league's day
    const nr = (out.nat[nat] = { lf, cf, years: {}, cupYears: {}, top: topL ? topL.id : null });
    let prev = null;
    for (let y = lf; y < D.SEASON_START; y++) {
      const here = list.filter((c) => c.start <= y);
      if (here.length < 2) continue;
      const v = new Map(here.map((c) => [c, lvl(c, y)]));
      const n = Math.min(nTop, Math.max(6, Math.round(6 + (y - lf) * 0.22)));
      const ranked = here
        .slice()
        .sort((a, b) => v.get(b) - v.get(a))
        .slice(0, n);
      if (y < y1) {
        const w = (c) => Math.exp((v.get(c) - 55) / 5) * (prev === c ? 2.2 : 1);
        const champ = r.wpick(ranked, w),
          second = r.wpick(
            ranked.filter((c) => c !== champ),
            w,
          );
        prev = champ;
        champ.t.push(y);
        nr.years[y] = [champ.code, second.code];
        if (y >= cf) {
          const wc = (c) => Math.sqrt(Math.exp((v.get(c) - 55) / 5)) + 0.15;
          const win = r.wpick(here, wc),
            fin = r.wpick(
              here.filter((c) => c !== win),
              wc,
            );
          win.cups.push(y);
          nr.cupYears[y] = [win.code, fin.code];
        }
      }
      ranked.forEach((c) => {
        if (y < y1) {
          c.tf++;
          c.tfy.push(y);
        } else c.tfRec++;
      });
    }
    // A fallen giant has a past worth the name: at least two titles, taken from the years of its golden age
    list
      .filter((c) => c.identity === 'fallen' && c.start < y1 - 10)
      .forEach((c) => {
        const want = rngOf('want|' + c.code).int(2, 4);
        const w = c.prof.win;
        const pool = [];
        for (let y = w ? w.from : c.start; y <= (w ? w.to : y1 - 1); y++)
          if (nr.years[y] && nr.years[y][0] !== c.code) pool.push(y);
        const rr = rngOf('steal|' + c.code);
        while (c.t.length < want && pool.length) {
          const y = pool.splice(rr.int(0, pool.length - 1), 1)[0];
          const old = out.clubs[nr.years[y][0]];
          if (old.t.length <= 1 && old.identity !== 'oil') continue;
          old.t = old.t.filter((x) => x !== y);
          nr.years[y][1] = old.code; // the champion it displaced is the runner-up
          nr.years[y][0] = c.code;
          c.t.push(y);
          if (!c.tfy.includes(y)) {
            c.tfy.push(y);
            c.tf++;
          }
        }
        c.t.sort((a, b) => a - b);
      });
    list.forEach((c) => {
      c.t.sort((a, b) => a - b);
      c.cups.sort((a, b) => a - b);
      c.tfy.sort((a, b) => a - b);
      c.bd = bestDecade(c);
    });
  }
  const bestDecade = (c) => {
    const score = {};
    c.t.forEach((y) => (score[Math.floor(y / 10) * 10] = (score[Math.floor(y / 10) * 10] || 0) + 5));
    c.cups.forEach((y) => (score[Math.floor(y / 10) * 10] = (score[Math.floor(y / 10) * 10] || 0) + 2));
    c.tfy.forEach((y) => (score[Math.floor(y / 10) * 10] = (score[Math.floor(y / 10) * 10] || 0) + 0.3));
    const best = Object.entries(score).sort((a, b) => b[1] - a[1] || a[0] - b[0])[0];
    return best ? +best[0] : null;
  };

  // The years a club was champion: the canon's, plus the save's own recorded seasons
  L.titleYears = function (c) {
    const k = L.of(c),
      s = S();
    const out = k ? k.t.slice() : [];
    if (s && s.archive)
      s.archive.forEach((e) => {
        for (const id in e.comps)
          if (e.comps[id].champion === c.id && s.comps[id] && s.comps[id].tier === 1) out.push(e.year);
      });
    return out;
  };
  L.cupYears = function (c) {
    const k = L.of(c),
      s = S();
    const out = k ? k.cups.slice() : [];
    if (s && s.archive)
      s.archive.forEach((e) => {
        for (const id in e.cups || {})
          if (e.cups[id].winner === c.id && s.comps[id] && s.comps[id].nat === c.nat) out.push(e.year);
      });
    return out;
  };
  L.lastTitle = (c) => L.titleYears(c).sort((a, b) => b - a)[0] || null;

  // Named eras from a list of title years: a run of titles within a few years of each other is a golden age (named for a manager
  // or not); a long gap after a club's last title in the canon is a decline
  const ERA_NAMES = ['The Golden Years', 'The Glory Years', 'The Great Side', 'The {m} Years', 'The {m} Era'];
  L.eras = function (c, years) {
    const k = L.of(c);
    if (!k) return [];
    const ys = (years || L.titleYears(c)).slice().sort((a, b) => a - b),
      clusters = [];
    ys.forEach((y) => {
      const last = clusters[clusters.length - 1];
      if (last && y - last[last.length - 1] <= 6) last.push(y);
      else clusters.push([y]);
    });
    const n = D.NATIONS[k.nat];
    const out = clusters
      .filter((q) => q.length >= 2)
      .sort((a, b) => b.length - a.length)
      .slice(0, 3)
      .map((q) => {
        const r = rngOf(`era|${k.code}|${q[0]}`);
        const nm = r.pick(ERA_NAMES).replace('{m}', n ? r.pick(n.ln) : 'Boss');
        return { name: nm, from: q[0] - 1, to: q[q.length - 1] + 1, titles: q.length };
      });
    const lastY = ys[ys.length - 1],
      nowY = S() ? S().year : D.SEASON_START;
    if (lastY && nowY - lastY >= 14 && (k.identity === 'fallen' || k.identity === 'historic' || k.identity === 'giant'))
      out.push({ name: 'The Long Wait', from: lastY + 1, to: nowY - 1, titles: 0 });
    return out.sort((a, b) => a.from - b.from);
  };
  // "League champions 1931, 1938, 1949" (the last few, with a count for a long list)
  L.yearsText = (ys, max = 10) => {
    const a = ys.slice().sort((x, y) => x - y);
    return a.length > max
      ? `${a.slice(0, max - 2).join(', ')} … ${a.slice(-2).join(', ')} (${a.length} in all)`
      : a.join(', ');
  };
  // The summary a club picker or club page shows for the years before the records: null when the club has no such past
  L.pastGlory = function (c) {
    const k = L.of(c);
    if (!k) return null;
    const t = k.t,
      y1 = L.canon().y1;
    const tf = k.tf + (k.tfRec || 0);
    return {
      titles: t,
      cups: k.cups,
      topFlight: k.tf,
      topFlightAll: tf,
      decade: k.bd,
      from: k.start,
      until: y1 - 1,
      line: t.length
        ? `League champions ${L.yearsText(t, 8)}`
        : k.tf
          ? `${k.tf} season${k.tf === 1 ? '' : 's'} in the top flight before ${y1}, no title`
          : k.cups.length
            ? `Cup winners ${L.yearsText(k.cups, 8)}`
            : null,
    };
  };
  // A one-line past for the club picker (fallen giants and old clubs especially)
  L.pastLine = function (code) {
    const g = L.pastGlory(code);
    if (!g || !g.line) return '';
    return g.decade && g.titles.length ? `${g.line}; the best decade, the ${g.decade}s` : g.line;
  };

  // ---------- Club details ----------
  // prettier-ignore
  const MOTTOS = {
    en: ['Together We Rise', 'Strength in Unity', 'Never Yield', 'Fortune Favours the Bold', 'For {city}, Always', 'Honest Toil, Honest Reward', 'Play Up, Play Fair', 'United We Stand', 'Pride of {city}', 'Courage and Craft', 'First to the Ball', 'Heart and Soul', 'By Hard Work We Prevail', 'Faithful to the End', 'One Town, One Club'],
    la: ['Labor Omnia Vincit', 'Per Aspera Ad Astra', 'Semper Fidelis', 'Unitas Fortior', 'Fortis in Arduis', 'Honor et Virtus', 'Ad Altiora', 'Concordia Victrix', 'Virtute et Labore', 'Pro Patria et Gloria'],
    es: ['Siempre Adelante', 'Honor y Gloria', 'Unidos Venceremos', 'Por {city}, Siempre', 'Con Garra y Corazón', 'Orgullo de {city}'],
    it: ['Sempre Avanti', 'Forza e Onore', 'Uniti si Vince', 'Per {city}, Sempre', 'Con Cuore e Coraggio', 'Orgoglio di {city}'],
    de: ['Treue und Kampf', 'Immer Vorwärts', 'Einigkeit macht Stark', 'Für {city}, Immer', 'Mit Herz und Verstand', 'Stolz von {city}'],
    fr: ['Toujours Plus Haut', 'Unis pour Vaincre', 'Pour {city}, Toujours', 'Cœur et Courage', 'Fierté de {city}', 'Fidèles jusqu’au Bout'],
    pt: ['Sempre Juntos', 'Honra e Glória', 'Por {city}, Sempre', 'Com Garra e Coração', 'Orgulho de {city}', 'Fiéis até ao Fim'],
    nl: ['Eendracht maakt Macht', 'Altijd Vooruit', 'Voor {city}, Altijd', 'Met Hart en Ziel', 'Trots van {city}'],
  };
  // prettier-ignore
  const LANG = {
    ESP: 'es', ARG: 'es', MEX: 'es', ITA: 'it', GER: 'de', AUT: 'de', SUI: 'de', FRA: 'fr', BEL: 'fr', MAR: 'fr',
    POR: 'pt', BRA: 'pt', NED: 'nl',
  };
  // prettier-ignore
  const IDENT_MOTTO = {
    fan: ['Ours, Forever', 'By the Fans, for the Fans', 'The Club Belongs to Us'],
    youth: ['Grow Together', 'Home-Grown, Home-Proud', 'Today’s Boys, Tomorrow’s Men'],
    oil: ['Ambition Without Limit', 'Reach Higher', 'The Future Starts Here'],
    fallen: ['We Will Rise Again', 'Remember Who We Are', 'Glory Is Not Gone'],
    giant: ['Born to Win', 'Only the Best', 'Greatness Is Our Habit'],
    selling: ['Make the Most of It', 'Smart, Sharp, Ready', 'Find the Next One'],
    historic: ['Tradition Never Dies', 'Since Our Beginning', 'The Old Club, Forever'],
  };
  // prettier-ignore
  const ANIMALS = {
    lion: 'Lion', tiger: 'Tiger', eagle: 'Eagle', hawk: 'Hawk', wolf: 'Wolf', wolves: 'Wolf', bear: 'Bear',
    fox: 'Fox', foxes: 'Fox', bull: 'Bull', stag: 'Stag', ram: 'Ram', swan: 'Swan', owl: 'Owl', crow: 'Crow',
    magpie: 'Magpie', bee: 'Bee', cat: 'Cat', dog: 'Dog', dragon: 'Dragon', panther: 'Panther', shark: 'Shark',
    crocodile: 'Crocodile', falcon: 'Falcon', swallow: 'Swallow', crane: 'Crane', sparrow: 'Sparrow', gull: 'Seagull',
    robin: 'Robin', badger: 'Badger', stallion: 'Stallion', horse: 'Horse', rhino: 'Rhino', bluebird: 'Bluebird',
    canary: 'Canary', hornet: 'Hornet', eel: 'Eel', warrior: 'Warrior', hound: 'Hound', cheetah: 'Cheetah',
    leopard: 'Leopard', lynx: 'Lynx', otter: 'Otter', pelican: 'Pelican', heron: 'Heron', dolphin: 'Dolphin',
    jaguar: 'Jaguar', cobra: 'Cobra', phoenix: 'Phoenix', pirate: 'Pirate', miner: 'Miner', sailor: 'Sailor',
    cherry: 'Cherry', hammer: 'Hammer', saint: 'Saint', gunner: 'Gunner', cobbler: 'Cobbler', potter: 'Potter',
    shrimp: 'Shrimp',
  };
  // prettier-ignore
  const MASCOT_FIRST = [
    'Rusty', 'Barnaby', 'Fergus', 'Tilly', 'Gus', 'Nellie', 'Pip', 'Hamish', 'Boomer', 'Bella', 'Wally', 'Ziggy',
    'Maisie', 'Dusty', 'Orson', 'Poppy', 'Bruno', 'Clementine', 'Sparky', 'Winston',
  ];
  // prettier-ignore
  const GROUND_NICK = {
    big: ['The Cauldron', 'The Cathedral', 'The Colosseum', 'The Fortress', 'The Theatre', 'The Bowl', 'The Palace', 'The Amphitheatre'],
    mid: ['The Hothouse', 'The Furnace', 'The Hive', 'The Garden', 'The Lighthouse', 'The Lantern', 'The Pit', 'The Den', 'The Park'],
    small: ['The Shed', 'The Bunker', 'The Allotment', 'The Orchard', 'The Yard', 'The Tin Hat', 'The Cabin', 'The Meadow', 'The Barn'],
  };
  // prettier-ignore
  const ANTHEMS = {
    en: ['Blue Skies Over {city}', 'Sing Up for the {nick}', '{city}, My {city}', 'The {nick} Are Marching', 'Forever {city}', 'Roar for the {nick}', 'Hymn of the {nick}', 'Up the {nick}', 'The Song of {city}', 'Pride of the Terraces'],
    es: ['Himno del {club}', 'Cantemos por {city}', 'Orgullo de {city}'],
    it: ['Inno del {club}', 'Canta, {city}', 'Gloria di {city}'],
    de: ['Das {club}-Lied', 'Unser {city}', 'Vereinshymne {city}'],
    fr: ['L’Hymne de {city}', 'Chantons {city}', 'Allez {city}'],
    pt: ['Hino do {club}', 'Cantemos {city}', 'Orgulho de {city}'],
    nl: ['Het {club}-lied', 'Voor {city}', 'Trots van {city}'],
  };
  const stripArt = (s) => s.replace(/^(The|Die|Les|Los|Le|La|El|Il|De|Het) /i, '');

  function fluff(out, c, y1, nationList) {
    const r = rngOf('fluff|' + c.code),
      lang = LANG[c.nat] || 'en';
    const nick = stripArt(c.nick || c.name.split(' ').pop());
    const fill = (s) =>
      s
        .replace(/\{city\}/g, c.city)
        .replace(/\{nick\}/g, nick)
        .replace(/\{club\}/g, c.name);
    // motto: a Latin one for the older clubs, the club's own language, or what its identity stands for
    const old = c.founded && c.founded < 1925;
    const pool =
      r.chance(0.3) && IDENT_MOTTO[c.identity]
        ? IDENT_MOTTO[c.identity]
        : old && r.chance(0.4)
          ? MOTTOS.la
          : MOTTOS[lang] && r.chance(0.7)
            ? MOTTOS[lang]
            : MOTTOS.en;
    c.motto = fill(r.pick(pool));
    c.anthem = fill(r.pick(ANTHEMS[lang] || ANTHEMS.en));
    const lower = nick.toLowerCase();
    const key = Object.keys(ANIMALS)
      .sort((a, b) => b.length - a.length)
      .find((k) => lower.includes(k));
    const nm = D.NATIONS[c.nat] ? r.pick(D.NATIONS[c.nat].fn) : r.pick(MASCOT_FIRST);
    c.mascot = key
      ? `${nm} the ${ANIMALS[key]}`
      : `${r.pick(MASCOT_FIRST)} the ${r.pick(['Bear', 'Owl', 'Fox', 'Lion', 'Hound', 'Badger'])}`;
    c.gnick = r.pick(c.cap >= 40000 ? GROUND_NICK.big : c.cap >= 15000 ? GROUND_NICK.mid : GROUND_NICK.small);
    const nr = out.nat[c.nat];
    const last = y1 - 1;
    const first = Math.max((c.founded || 1890) + 3, 1900);
    const at = (lo, hi) => (hi >= lo ? r.int(lo, hi) : null);
    const opp = (y) => {
      const here = nationList.filter((x) => x !== c && x.start <= y);
      return here.length ? r.wpick(here, (x) => 1 + x.rep / 20).code : null;
    };
    // the record crowd: before all-seater grounds, the old terraces held more than the stadium does now
    const ry = at(first, c.founded && c.founded > 1965 ? last : Math.min(last, 1975));
    if (ry)
      c.att = {
        n: Math.round((c.cap * (c.founded && c.founded > 1965 ? r.int(100, 115) : r.int(108, 165))) / 100 / 100) * 100,
        y: ry,
        opp: opp(ry),
      };
    // biggest win and heaviest defeat: bigger clubs win bigger
    const wy = at(first, last),
      ly = at(first, last);
    const big = U.clamp(Math.round(4 + c.rep / 30), 5, 8);
    if (wy) c.bigWin = { gf: r.int(big, big + 3), ga: r.int(0, 2), y: wy, opp: opp(wy), comp: nr && nr.top };
    if (ly)
      c.bigLoss = { gf: r.int(0, 2), ga: r.int(Math.max(4, 9 - big), 8), y: ly, opp: opp(ly), comp: nr && nr.top };
    // the most famous match: a title decider, a cup final, a famous cup upset or a famous escape
    const pick = [];
    if (c.t.length) pick.push(['title', r.pick(c.t)]);
    if (c.cups.length) pick.push(['cup', r.pick(c.cups)]);
    const sy = at(first, last);
    if (sy) pick.push([c.rep < 55 ? 'upset' : 'escape', sy]);
    const f = pick.length ? (pick.length > 1 && r.chance(0.75) ? pick[0] : r.pick(pick)) : null;
    if (f) {
      const [kind, y] = f,
        pair = kind === 'title' ? nr.years[y] : kind === 'cup' ? nr.cupYears[y] : null;
      const o = pair ? (pair[0] === c.code ? pair[1] : pair[0]) : opp(y);
      const gf = r.int(1, 4),
        ga = kind === 'escape' ? r.int(0, gf - 1) : r.int(0, Math.max(0, gf - 1));
      c.famous = { kind, y, opp: o, gf, ga };
    }
  }

  // The famous-match line for a club ("1949: beat X 3–1 on the last day to win the title")
  L.famousLine = function (c) {
    const k = L.of(c);
    if (!k || !k.famous) return '';
    const f = k.famous,
      o = oppName(f.opp),
      sc = `${f.gf}–${f.ga}`;
    return {
      title: `${f.y}: beat ${o} ${sc} to clinch the title`,
      cup: `${f.y}: beat ${o} ${sc} in the cup final`,
      upset: `${f.y}: ${sc} over ${o} in a famous cup upset`,
      escape: `${f.y}: a ${sc} win against ${o} kept the club up on the last day`,
    }[f.kind];
  };
  const oppName = (code) => {
    const s = S(),
      c =
        code && ((s && s.clubs['c_' + code]) || (L.canon().clubs[code] ? { name: L.canon().clubs[code].name } : null));
    return c ? c.name : 'a rival';
  };
  L.name = oppName;

  // =============================================================== Derbies
  // Clubs without a rival whose ground is close to another's get one: the two nearest each other, in one country, become a derby
  // (appended to D.RIVALS, so the world and the club picker both pick them up)
  L.addLocalRivals = function () {
    if (L._rivals) return;
    L._rivals = true;
    const all = descriptors().filter((c) => !c.parent && D.CLUB_GEO[c.code]);
    const has = new Set(D.RIVALS.flatMap((x) => [x[0], x[1]]));
    const pairs = [];
    const byNat = {};
    all.forEach((c) => (byNat[c.nat] = byNat[c.nat] || []).push(c));
    for (const list of Object.values(byNat))
      for (let i = 0; i < list.length; i++)
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i],
            b = list[j];
          if (has.has(a.code) || has.has(b.code)) continue;
          const km = Geo.dist(D.CLUB_GEO[a.code], D.CLUB_GEO[b.code]);
          if (km <= 35 && Math.abs(a.rep - b.rep) <= 28) pairs.push([km + Math.abs(a.rep - b.rep) / 10, a, b]);
        }
    pairs.sort((x, y) => x[0] - y[0] || (x[1].code < y[1].code ? -1 : 1));
    const used = new Set(),
      names = new Set(D.RIVALS.map((x) => x[2]));
    pairs.forEach(([, a, b]) => {
      if (used.has(a.code) || used.has(b.code)) return;
      used.add(a.code);
      used.add(b.code);
      const same = a.city === b.city;
      let nm = same ? `${a.city} Derby` : `${a.city}–${b.city} Derby`;
      if (names.has(nm)) nm = `${stripArt(a.nick || a.name)}–${stripArt(b.nick || b.name)} Derby`;
      names.add(nm);
      D.RIVALS.push([a.code, b.code, nm]);
    });
  };

  const ORIGINS = [
    {
      k: 'cup',
      ok: () => true,
      make: (o, a, b, r, y1, nr) => {
        const ys = Object.keys(nr.cupYears)
          .map(Number)
          .filter((y) => nr.cupYears[y].includes(a.code) && nr.cupYears[y].includes(b.code));
        const y = ys.length ? r.pick(ys) : r.int(Math.max(o.minY, nr.cf + 3), y1 - 2);
        const [w, l] = ys.length ? (nr.cupYears[y][0] === a.code ? [a, b] : [b, a]) : r.chance(0.5) ? [a, b] : [b, a];
        return {
          y,
          text: `Bitter since the ${y} cup final, when ${w.name} beat ${l.name} with a goal in the last minute`,
        };
      },
    },
    {
      k: 'ground',
      ok: (a, b, y1, km) => km != null && km < 25,
      make: (o, a, b, r) => {
        const y = r.int(Math.max(o.minY, 1905), Math.max(o.minY + 5, 1960));
        return {
          y,
          text: `Shared a ground until ${y}, and neither has forgiven the other for how the arrangement ended`,
        };
      },
    },
    {
      k: 'split',
      ok: (a, b, y1, km) =>
        km != null && km < 40 && Math.abs((a.founded || 0) - (b.founded || 0)) >= 8 && a.founded && b.founded,
      make: (o, a, b) => {
        const [young, old] = a.founded > b.founded ? [a, b] : [b, a];
        return {
          y: young.founded,
          text: `${young.name} were founded in ${young.founded} by members who walked out of ${old.name}`,
        };
      },
    },
    {
      k: 'title',
      ok: (a, b, y1, km, nr) =>
        Object.values(nr.years).some(
          (p) => (p[0] === a.code && p[1] === b.code) || (p[0] === b.code && p[1] === a.code),
        ),
      make: (o, a, b, r, y1, nr) => {
        const ys = Object.keys(nr.years)
          .map(Number)
          .filter(
            (y) =>
              (nr.years[y][0] === a.code && nr.years[y][1] === b.code) ||
              (nr.years[y][0] === b.code && nr.years[y][1] === a.code),
          );
        const y = r.pick(ys),
          w = nr.years[y][0] === a.code ? a : b,
          l = w === a ? b : a;
        return {
          y,
          text: `Bitter since the ${y} title race, settled on the last day: ${w.name} won it, ${l.name} finished second`,
        };
      },
    },
    {
      k: 'hero',
      ok: () => true,
      make: (o, a, b, r, y1) => {
        const y = r.int(Math.max(o.minY, 1950), y1 - 2);
        const [from, to] = r.chance(0.5) ? [a, b] : [b, a];
        return {
          y,
          text: `Bitter since ${y}, when ${from.name}'s captain crossed the divide and signed for ${to.name}`,
        };
      },
    },
    {
      k: 'town',
      ok: (a, b, y1, km) => km != null && km >= 25 && km <= 120,
      make: (o, a, b, r) => {
        const y = r.int(Math.max(o.minY, 1890), 1935);
        return {
          y,
          text: `The two towns have been arguing since a ${y} dispute over a canal, a market and a cup of tea`,
        };
      },
    },
  ];
  function rivalries(out, y1) {
    L.addLocalRivals();
    D.RIVALS.forEach(([ac, bc, name]) => {
      const a = out.clubs[ac],
        b = out.clubs[bc];
      if (!a || !b) return;
      const r = rngOf(`rival|${ac}|${bc}`);
      const km = D.CLUB_GEO[ac] && D.CLUB_GEO[bc] ? Geo.dist(D.CLUB_GEO[ac], D.CLUB_GEO[bc]) : null;
      const nr = out.nat[a.nat] || { years: {}, cupYears: {}, cf: 1890 };
      const minY = Math.max(a.founded || 1890, b.founded || 1890) + 3;
      const options = ORIGINS.filter((o) => o.ok(a, b, y1, km, nr));
      const o = r.pick(options.length ? options : [ORIGINS[4]]);
      const og = o.make({ minY }, a, b, r, y1, nr);
      if (og.y > y1 - 1) og.y = y1 - 1;
      // the record between them before the save
      const n = U.clamp(Math.round((y1 - Math.max(a.start, b.start)) * 1.6 + r.int(0, 12)), 12, 160);
      const pa = 1 / (1 + Math.exp(-(a.rep - b.rep) / 16));
      const wa = Math.round(n * 0.74 * pa),
        wb = Math.round(n * 0.74 * (1 - pa));
      const big = U.clamp(Math.round(3 + Math.max(a.rep, b.rep) / 35), 4, 7);
      const aw = r.chance(pa);
      out.rivals[key(ac, bc)] = {
        a: ac,
        b: bc,
        name,
        y: og.y,
        kind: o.k,
        text: og.text,
        n,
        wa,
        wb,
        d: n - wa - wb,
        best: { y: r.int(Math.max(minY, 1920), y1 - 1), w: aw ? ac : bc, gf: r.int(big, big + 2), ga: r.int(0, 1) },
        km,
      };
    });
  }
  const key = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  // The story of a derby: { name, text, y, kind, km, a, b, ...record before the save } plus what the save has added
  L.rivalry = function (a, b) {
    const ca = typeof a === 'string' ? a.replace(/^c_/, '') : codeOf(a),
      cb = typeof b === 'string' ? b.replace(/^c_/, '') : codeOf(b);
    const base = L.canon().rivals[key(ca, cb)];
    if (!base) return null;
    const live = (S() && S().lore && S().lore.rivals[key(ca, cb)]) || { w: {}, d: 0, n: 0, last: [] };
    const wa = base.wa + (live.w[base.a] || 0),
      wb = base.wb + (live.w[base.b] || 0);
    return { ...base, wa, wb, d: base.d + live.d, n: base.n + live.n, since: live, key: key(ca, cb) };
  };
  // A line for the press and the match preview about a derby ("Bitter since the 1974 cup final ..."), or ''
  L.derbyLine = function (a, b) {
    const r = L.rivalry(a, b);
    return r ? `${r.text}.` : '';
  };
  // The head-to-head as { w, d, l } for club a
  L.record = function (a, b) {
    const r = L.rivalry(a, b),
      ca = typeof a === 'string' ? a.replace(/^c_/, '') : codeOf(a);
    if (!r) return null;
    return ca === r.a ? { w: r.wa, d: r.d, l: r.wb, n: r.n } : { w: r.wb, d: r.d, l: r.wa, n: r.n };
  };

  // =============================================================== Competitions
  // prettier-ignore
  const TROPHY_TITLES = {
    en: ['Alderman', 'Sir', 'Colonel', 'Councillor', 'Lord', 'Canon'],
    es: ['Don', 'Presidente', 'Doctor'],
    it: ['Cavaliere', 'Commendatore', 'Dottor'],
    de: ['Kommerzienrat', 'Doktor', 'Konsul'],
    fr: ['Maire', 'Docteur', 'Comte'],
    pt: ['Dom', 'Doutor', 'Comendador'],
    nl: ['Burgemeester', 'Dokter', 'Baron'],
  };
  // prettier-ignore
  const FOUNDERS = [
    'a local brewer', 'a mill owner', 'a shipping magnate', 'a newspaper proprietor', 'a solicitor', 'a headmaster',
    'a banker', 'a coal merchant', 'a potter', 'the first president of the football federation',
  ];
  const CUP_NOTES = [
    (r, o) => [o.y + r.int(8, 30), 'Opened to the clubs of the lower divisions'],
    (r, o) => [o.y + r.int(20, 60), 'The first trophy was retired and a new cup was struck'],
    (r, o) => [o.y + r.int(30, 70), 'Seeding introduced, so the giants no longer meet in the first round'],
    (r, o) => [o.y + r.int(40, 80), 'The final became the big day of the season, moved to the national stadium'],
  ];
  function competitions(out, all, y1) {
    const size = {};
    D.LEAGUES.forEach((l) => (size[l.id] = (D[l.clubs] || []).length));
    const person = (nat, id, noun) => {
      const r = rngOf('founder|' + id),
        lang = LANG[nat] || 'en',
        n = D.NATIONS[nat];
      const title = r.pick(TROPHY_TITLES[lang] || TROPHY_TITLES.en);
      const fn = n ? r.pick(n.fn) : 'Arthur',
        ln = n ? r.pick(n.ln) : 'Hartley';
      return { trophy: `the ${title} ${ln} ${noun}`, founder: `${title} ${fn} ${ln}, ${r.pick(FOUNDERS)}` };
    };
    // leagues
    D.LEAGUES.forEach((l) => {
      const nat = out.nat[l.nat],
        lf = (nat && nat.lf) || NAT_LEAGUE[l.nat] || 1950;
      const r = rngOf('league|' + l.id);
      const founded = lf + (l.tier - 1) * hrange('tier|' + l.id, 4, 14);
      const n = size[l.id];
      let sz = Math.max(8, n - r.int(4, 10)),
        y = founded;
      const notes = [[founded, `Founded as a ${sz}-club championship`]];
      while (sz < n) {
        y += r.int(12, 35);
        if (y >= y1) break;
        sz = Math.min(n, sz + r.pick([2, 4]));
        notes.push([y, `Expanded to ${sz} clubs`]);
      }
      const rules = l.rules || {};
      if (rules.relegate)
        notes.push([
          founded + r.int(6, 20),
          'Automatic promotion and relegation replaced the old vote among the clubs',
        ]);
      if (rules.promote && rules.promote.playoff)
        notes.push([y1 - r.int(4, 25), 'Play-offs introduced for the last promotion place']);
      if (rules.split) notes.push([y1 - r.int(2, 12), 'The season now splits into groups after the main round']);
      if (rules.torneos)
        notes.push([y1 - r.int(5, 40), 'Two short tournaments a season, the Apertura and the Clausura']);
      notes.push([Math.max(founded + 10, hrange('three|' + l.id, 1981, 1995)), 'Three points for a win replaced two']);
      out.comps[l.id] = {
        founded,
        ...person(l.nat, l.id, l.tier === 1 ? 'Shield' : 'Trophy'),
        notes: notes.filter((x) => x[0] <= y1 + 25).sort((a, b) => a[0] - b[0]),
        kind: 'league',
        nat: l.nat,
      };
    });
    // cups
    D.DOMESTIC_CUPS.forEach(([id, nat, , ,]) => {
      const nr = out.nat[nat] || { cf: hrange('cf|' + id, 1871, 1935) };
      const r = rngOf('cup|' + id),
        o = { y: nr.cf };
      const notes = [[nr.cf, 'First played, with a knockout draw open to every club in the country']];
      CUP_NOTES.forEach((f) => {
        if (r.chance(0.65)) notes.push(f(r, o));
      });
      out.comps[id] = {
        founded: nr.cf,
        ...person(nat, id, 'Cup'),
        notes: notes.filter((x) => x[0] < y1).sort((a, b) => a[0] - b[0]),
        kind: 'cup',
        nat,
        shocks: shocks(out, nat, id, y1),
      };
    });
    // county cups and state championships: the oldest competitions in the world
    D.AREAS.forEach(([id, nat, , name]) => {
      const rr = rngOf('area|' + id);
      const f = nat === 'ENG' ? rr.int(1867, 1890) : rr.int(1902, 1925);
      out.comps['R_' + id] = {
        founded: f,
        ...person(nat, id, 'Cup'),
        notes: [[f, 'First played among the clubs of the area']],
        kind: 'regional',
        nat,
        shocks: [],
      };
    });
    // continental and world competitions
    const CONT = { CC: 1956, CL: 1960, AC: 1967, AF: 1964, NC: 1962, EL: 1971, SA: 1992, UC: 1995, A2: 1990, AX: 1975 };
    D.CONTINENTALS.forEach((c) => {
      const f = CONT[c.id] || 1980;
      out.comps[c.id] = {
        founded: f,
        ...person('ENG', c.id, 'Trophy'),
        notes: [[f, `First played, among the champions of ${c.region}`]],
        kind: 'continental',
      };
    });
    out.comps.CWC = {
      founded: 2000,
      ...person('ENG', 'CWC', 'Trophy'),
      notes: [[2000, 'First played, between the champions of the continents']],
      kind: 'world',
    };
    // the oldest cup in the world
    out.oldest = Object.entries(out.comps)
      .filter(([, c]) => c.kind === 'cup' || c.kind === 'regional')
      .sort((a, b) => a[1].founded - b[1].founded)[0][0];
  }
  // Giant-killings: a small club beating a big one in a national cup
  function shocks(out, nat, cupId, y1) {
    const list = Object.values(out.clubs).filter((c) => c.nat === nat);
    const big = list.filter((c) => c.rep >= 68),
      small = list.filter((c) => c.rep <= 48);
    if (!big.length || !small.length) return [];
    const r = rngOf('shock|' + cupId),
      cf = out.nat[nat].cf;
    const rounds = ['third round', 'fourth round', 'fifth round', 'quarter-final', 'semi-final'];
    const res = [];
    for (let i = 0; i < 3; i++) {
      const y = r.int(cf + 4, y1 - 1);
      const s = r.pick(small.filter((c) => c.start <= y).length ? small.filter((c) => c.start <= y) : small),
        b = r.pick(big.filter((c) => c.start <= y).length ? big.filter((c) => c.start <= y) : big);
      const sc = r.pick(['1–0', '2–1', '3–2', '2–0', '1–0 after extra time']);
      res.push({
        y,
        small: s.code,
        big: b.code,
        text: `${s.name} (${s.tier ? 'tier ' + s.tier : ''}) beat ${b.name} ${sc} in the ${r.pick(rounds)}`,
      });
    }
    return res.sort((a, b) => a.y - b.y);
  }
  // The history of a competition: { founded, trophy, founder, notes: [[year, text]], shocks, oldest } (null for an unknown id)
  L.compHistory = function (id) {
    const c = L.canon().comps[id];
    if (!c) return null;
    return { ...c, oldest: L.canon().oldest === id };
  };

  // =============================================================== The save's own lore
  L.state = function () {
    const s = S();
    if (!s.lore) s.lore = { v: 1, rivals: {}, att: {} };
    return s.lore;
  };
  // A derby played: the record between the two grows (called from Records.onMatch after every competitive match)
  L.onMatch = function (fx, res) {
    const a = fx.h.slice(2),
      b = fx.a.slice(2),
      k = key(a, b);
    if (!L.canon().rivals[k]) return;
    const st = L.state(),
      e = (st.rivals[k] = st.rivals[k] || { w: {}, d: 0, n: 0, last: [] });
    e.n++;
    if (res.hg === res.ag) e.d++;
    else {
      const w = res.hg > res.ag ? a : b;
      e.w[w] = (e.w[w] || 0) + 1;
    }
    e.last = [[S().year, a, res.hg, res.ag, fx.comp]].concat(e.last).slice(0, 6);
  };
  // The record crowd: the canon's, or the save's if it has been beaten. { n, y, opp } or null
  L.recordCrowd = function (c) {
    const st = S() && S().lore,
      k = L.of(c);
    return (st && st.att[c.id]) || (k && k.att) || null;
  };
  L.noteAttendance = function (c, att, opp) {
    const prev = L.recordCrowd(c);
    if (!prev || att <= prev.n) return;
    L.state().att[c.id] = { n: att, y: S().year, opp: opp ? opp.id.slice(2) : null };
    if (W.isUser(c.id) && FM.News)
      FM.News.add({
        type: 'club',
        title: `Record crowd at ${c.stadium.name}`,
        body: `${att.toLocaleString()} came to see ${c.name}${opp ? ` against ${opp.name}` : ''}: the biggest attendance in the club's history, beating the ${prev.n.toLocaleString()} of ${prev.y}.`,
        clubId: c.id,
      });
  };

  // ---------- Legends ----------
  // Five legends a club, with names of its country (or heritage), two of them forwards, and a note for each that draws on the club's
  // own past (its titles and cups, its rival, its ground) and never repeats inside a club or too often inside a country
  // prettier-ignore
  const GROUP = {
    ST: 'att', W: 'att', AM: 'att', CM: 'mid', DM: 'mid', WM: 'mid', CB: 'def', FB: 'def', WB: 'def', GK: 'gk',
  };
  const NOTES = [
    { id: 'rec1', g: 'att', need: 'top', t: (x) => `Club record goalscorer: ${x.goals} goals in ${x.apps} games` },
    {
      id: 'rec2',
      g: 'att',
      need: 'top',
      t: (x) =>
        [
          'Still the club’s all-time top scorer',
          `The top scorer in the club’s history, with ${x.goals}`,
          'Nobody has scored more for the club',
        ][x.v],
    },
    {
      id: 'rec3',
      g: 'att',
      need: 'top',
      t: (x) => `${x.goals} goals in ${x.yrs} seasons: a record that has stood since ${x.from + x.yrs}`,
    },
    { id: 'cupwin', g: 'att', need: 'cup', t: (x) => `Scored the winner in the ${x.cup} cup final` },
    {
      id: 'hat',
      g: 'att',
      need: 'rival',
      t: (x) => `Hat-trick against ${x.rival} in a derby the fans still talk about`,
    },
    {
      id: 'derby',
      g: 'att',
      need: 'rival',
      t: (x) => `Cult hero: scored in ${x.n} straight derbies against ${x.rival}`,
    },
    { id: 'titlegoal', g: 'att', need: 'title', t: (x) => `Scored the goal that won the ${x.title} title` },
    { id: 'golden', g: 'att', t: (x) => `Top scorer in ${x.from + 3}, the season the club almost won everything` },
    { id: 'capttitle', g: 'mid', need: 'title', t: (x) => `Captained the club to the ${x.title} title` },
    { id: 'captcup', g: 'mid', need: 'cup', t: (x) => `Captain on the day the club lifted the cup in ${x.cup}` },
    { id: 'engine', g: 'mid', t: (x) => `Ran the midfield for ${x.yrs} seasons without a day off` },
    {
      id: 'creator',
      g: 'mid',
      t: (x) =>
        [
          'Created more goals than anyone in the club’s history',
          'Set up more goals than any midfielder before or since',
          `Pulled the strings for ${x.yrs} seasons`,
        ][x.v],
    },
    { id: 'titledef', g: 'def', need: 'title', t: (x) => `Heart of the defence in the ${x.title} title side` },
    { id: 'nose', g: 'def', need: 'rival', t: (x) => `Played on with a broken nose in the derby against ${x.rival}` },
    {
      id: 'clear',
      g: 'def',
      need: 'rival',
      t: (x) => `Cult hero for a last-ditch clearance in the derby with ${x.rival}`,
    },
    { id: 'wall', g: 'def', t: (x) => `Missed ${x.n} league games in ${x.yrs} seasons` },
    { id: 'shoot', g: 'gk', need: 'cup', t: (x) => `Saved two penalties in the ${x.cup} cup final shoot-out` },
    { id: 'cleans', g: 'gk', t: (x) => `Kept ${x.n + 8} clean sheets in a single season` },
    { id: 'titlegk', g: 'gk', need: 'title', t: (x) => `In goal for the ${x.title} champions` },
    { id: 'fort', g: 'gk', t: (x) => `Unbeaten in ${x.n + 10} home games at ${x.ground}` },
    {
      id: 'saved',
      t: (x) =>
        [
          'Scored the goal that saved the club from relegation',
          `Scored in the ${x.from + 6} relegation decider that kept the club up`,
          'His late winner on the last day kept the club in the division',
        ][x.v],
    },
    { id: 'oneclub', t: (x) => `One-club man, ${x.yrs} seasons` },
    {
      id: 'free',
      t: (x) =>
        [
          'The greatest free signing in club history',
          `Arrived on a free transfer in ${x.from}, and cost the club nothing`,
          'Signed for nothing, worth a fortune to the club',
        ][x.v],
    },
    {
      id: 'academy',
      t: (x) =>
        [
          'Academy graduate turned legend',
          `Came through the youth team in ${x.from}, and never left`,
          `The best player the ${x.city} academy ever produced`,
        ][x.v],
    },
    {
      id: 'turned',
      t: (x) =>
        [
          'Turned down a bigger club to stay',
          `Said no to a move abroad in ${x.from + 4}, and stayed for love of the club`,
          'Could have left for a fortune: stayed for the shirt',
        ][x.v],
    },
    { id: 'cross', need: 'rival', t: (x) => `Signed from ${x.rival}, and never looked back` },
    {
      id: 'debut',
      t: (x) =>
        [
          'Scored on his debut and never stopped',
          `Scored twice on his debut in ${x.from}`,
          `Marked his first game at ${x.ground} with a goal in the first minute`,
        ][x.v],
    },
    {
      id: 'sing',
      t: (x) =>
        [
          'The terraces still sing his name',
          `${x.city} still sings his name`,
          `A song about him is still sung at ${x.ground}`,
        ][x.v],
    },
    { id: 'loan', t: (x) => `Arrived on loan and stayed ${x.yrs} seasons` },
    {
      id: 'shirt',
      t: (x) => `${x.nick ? `The ${x.nick}’s` : 'The club’s'} favourite son of the ${Math.floor(x.from / 10) * 10}s`,
    },
    {
      id: 'train',
      t: (x) =>
        [
          'First in, last out of training for a decade',
          'The hardest worker the club ever had',
          `Not the most gifted, but ${x.apps} games say otherwise`,
        ][x.v],
    },
    { id: 'bench', t: (x) => `Never missed a game for ${x.n} months` },
  ];
  L.seedLegends = function () {
    const s = S(),
      now = s.year,
      usedBy = {};
    Object.values(s.clubs)
      .filter((c) => c.comp && c.sim !== 'nation')
      .forEach((c) => {
        const first = Math.max(c.founded || 1950, 1950),
          pool = c.policy && D.NAME_POOLS[c.policy.heritage],
          used = (usedBy[c.nat] = usedBy[c.nat] || {});
        const poss = ['ST', 'W', 'ST', 'AM', 'CM', 'CB', 'GK', 'CM', 'FB'];
        const rv = c.rival && s.clubs[c.rival];
        const titles = L.titleYears(c).filter((y) => y >= first + 3 && y <= 2014),
          cups = L.cupYears(c).filter((y) => y >= first + 3 && y <= 2014);
        const base = [0, 1, 2, 3, 4].map((i) => {
          const nat = U.chance(0.88) ? c.nat : U.pick(Object.keys(D.NATIONS));
          const yrs = U.randi(7, 16),
            from = U.randi(first, Math.max(first, Math.min(2012, now - yrs - 1))),
            pos = i < 2 ? U.pick(['ST', 'ST', 'W', 'AM']) : U.pick(poss);
          const apps = yrs * U.randi(28, 40);
          const nm = pool ? [U.pick(pool.fn), U.pick(pool.ln)] : [U.pick(D.NATIONS[nat].fn), U.pick(D.NATIONS[nat].ln)];
          return {
            name: `${nm[0]} ${nm[1]}`,
            nat: pool ? c.nat : nat,
            pos,
            yrs,
            from,
            apps,
            goals: Math.round(apps * ({ ST: 0.5, W: 0.24, AM: 0.26, CM: 0.1, FB: 0.04, CB: 0.05 }[pos] || 0.005)),
          };
        });
        const top = base.reduce((m, x, i) => (x.goals > base[m].goals ? i : m), 0);
        const taken = new Set();
        c.legends = base
          .map((x, i) => {
            const g = GROUP[x.pos] || 'mid';
            // the years a note refers to pull the legend's career around them
            const ctx = {
              ...x,
              rival: rv ? rv.name : null,
              ground: c.stadium.name,
              nick: c.nick,
              city: c.city,
              n: U.randi(3, 6),
              v: U.randi(0, 2),
              c,
            };
            const ok = NOTES.filter((n) => {
              if (taken.has(n.id) || (n.g && n.g !== g)) return false;
              if (n.need === 'top') return i === top;
              if (n.need === 'rival') return !!ctx.rival;
              if (n.need === 'title') return titles.length > 0;
              if (n.need === 'cup') return cups.length > 0;
              return true;
            });
            const least = Math.min(...ok.map((n) => used[n.id] || 0));
            const note = U.pick(ok.filter((n) => (used[n.id] || 0) === least));
            taken.add(note.id);
            used[note.id] = (used[note.id] || 0) + 1;
            if (note.need === 'title') ctx.title = U.pick(titles);
            if (note.need === 'cup') ctx.cup = U.pick(cups);
            const anchor = ctx.title || ctx.cup;
            if (anchor) ctx.from = Math.max(first, Math.min(2012 - x.yrs, anchor - U.randi(2, Math.max(3, x.yrs - 2))));
            return {
              name: x.name,
              nat: x.nat,
              pos: x.pos,
              era: `${ctx.from}–${ctx.from + x.yrs}`,
              apps: x.apps,
              goals: x.goals,
              note: note.t(ctx),
            };
          })
          .sort((a, b) => b.apps - a.apps);
      });
  };
  W.seedLegends = L.seedLegends;

  // ---------- The people: legends in the present ----------
  // Some of a club's legends are still in the game: the manager of a rival, a pundit on Touchline Tonight, the club's ambassador, its chairman.
  const eraEnd = (l) => +l.era.split('–')[1];
  const split = (name) => {
    const i = name.indexOf(' ');
    return [name.slice(0, i), name.slice(i + 1)];
  };
  L.people = function () {
    const s = S(),
      yr = s.year;
    const clubs = Object.values(s.clubs).filter((c) => c.comp && c.sim !== 'nation' && c.legends && !c.parent);
    const free = (l) => !l.now;
    const manage = (leg, at, origin) => {
      const m = at.manager && s.staff[at.manager];
      if (!m || W.isUser(at.id) || at.sim === 'minimal') return false;
      const [fn, ln] = split(leg.name);
      Object.assign(m, { fn, ln, nat: leg.nat, age: yr - eraEnd(leg) + U.randi(33, 38) });
      m.legendOf = { club: origin.id, name: leg.name, pos: leg.pos, note: leg.note, era: leg.era };
      leg.now = { role: 'manager', at: at.id };
      return true;
    };
    // managers: the legends of a rival now in charge across the divide, and some in charge of their own club
    const ready = (c) => c.legends.filter((l) => free(l) && yr - eraEnd(l) >= 4 && yr - eraEnd(l) <= 24);
    clubs.forEach((c) => {
      const rv = c.rival && s.clubs[c.rival];
      if (rv && U.chance(0.14)) {
        const l = U.pick(ready(c).length ? ready(c) : [{ now: 1 }]);
        if (!l.now) manage(l, rv, c);
      } else if (U.chance(0.04)) {
        const l = U.pick(ready(c).length ? ready(c) : [{ now: 1 }]);
        if (!l.now) manage(l, c, c);
      }
    });
    // ambassadors and chairmen
    clubs.forEach((c) => {
      const old = c.legends.filter((l) => free(l) && yr - eraEnd(l) >= 10 && yr - eraEnd(l) <= 45);
      if (old.length && U.chance(0.04 + (['fan', 'historic', 'fallen', 'selling'].includes(c.identity) ? 0.05 : 0))) {
        const l = U.pick(old);
        l.now = { role: 'chairman' };
      }
      const amb = c.legends.filter((l) => free(l) && yr - eraEnd(l) >= 6);
      if (amb.length && U.chance(0.3)) U.pick(amb).now = { role: 'ambassador' };
    });
    // the panel on Touchline Tonight: a legend of your club, one of its rival and one of the biggest clubs of your country
    if (FM.Media && W.userClub()) {
      const me = W.userClub(),
        st = FM.Media.state();
      const cand = (c) =>
        c
          ? c.legends.filter((l) => yr - eraEnd(l) <= 40 && yr - eraEnd(l) >= 2 && !(l.now && l.now.role === 'manager'))
          : [];
      const big = clubs
        .filter((c) => c.nat === me.nat && c.id !== me.id && c.id !== me.rival)
        .sort((a, b) => b.rep - a.rep)[0];
      const picks = [
        [me, cand(me)],
        [me.rival && s.clubs[me.rival], cand(me.rival && s.clubs[me.rival])],
        [big, cand(big)],
      ];
      let slot = 0;
      picks.forEach(([c, ls]) => {
        if (!c || !ls.length || slot > 2) return;
        const l = ls.slice().sort((a, b) => b.apps - a.apps)[0];
        const style = ['sensible', 'contrarian', 'hothead'][slot];
        st.pundits[slot] = {
          name: l.name,
          style,
          cids: { [c.id]: l.apps },
          year: yr,
          legend: true,
          bio: `Former ${D.POS_NAME[l.pos] ? D.POS_NAME[l.pos].toLowerCase() : 'player'}, ${l.apps} games for ${c.name}`,
        };
        l.now = l.now || { role: 'pundit' };
        slot++;
      });
    }
  };
  // A legend-manager leaves his job (Records.managerChange)
  L.managerLeft = function (m) {
    const lg = m.legendOf;
    if (!lg) return;
    const c = S().clubs[lg.club];
    const l = c && c.legends && c.legends.find((x) => x.name === lg.name);
    if (l && l.now && l.now.role === 'manager') l.now = null;
    m.legendOf = null;
  };
  // What a legend is now, as words ("Manager of Eastport Dockers", "Chairman"), or ''
  L.nowText = function (l) {
    const n = l.now;
    if (!n) return '';
    if (n.role === 'manager') {
      const c = S().clubs[n.at];
      return c ? `Now manager of ${c.name}` : '';
    }
    return (
      {
        chairman: 'Now the club’s chairman',
        ambassador: 'Now a club ambassador',
        pundit: 'Now a pundit on Touchline Tonight',
      }[n.role] || ''
    );
  };
  // The people at a club: { chairman, ambassador, legendManagers: [{ leg, club }] }
  L.peopleOf = function (c) {
    const find = (role) => (c.legends || []).find((l) => l.now && l.now.role === role) || null;
    return { chairman: find('chairman'), ambassador: find('ambassador') };
  };
  // At the start of a career: the feed meets the people (a legend across the divide, your chairman and ambassador)
  L.welcome = function () {
    const s = S(),
      c = W.userClub();
    if (!c || !FM.News) return;
    const out = L.derbyAngles(c.id, c.rival);
    const rv = c.rival && s.clubs[c.rival];
    const mgr = rv && rv.manager && s.staff[rv.manager];
    if (mgr && mgr.legendOf && mgr.legendOf.club === c.id)
      FM.News.add({
        type: 'club',
        title: `${mgr.legendOf.name} is in charge across the divide`,
        body: `${mgr.legendOf.name} (${mgr.legendOf.note.toLowerCase()}) is now the manager of ${rv.name}. ${out[0] || ''} The terraces have not decided whether to cheer or boo him when he comes back.`,
        clubId: c.id,
      });
    const p = L.peopleOf(c);
    if (p.chairman)
      FM.News.add({
        type: 'club',
        title: `${p.chairman.name} chairs the club`,
        body: `The chairman played ${p.chairman.apps} games for ${c.name} (${p.chairman.era}): ${p.chairman.note.toLowerCase()}. He knows what the supporters expect.`,
        clubId: c.id,
        quiet: true,
      });
    else if (p.ambassador)
      FM.News.add({
        type: 'club',
        title: `${p.ambassador.name} welcomes you as club ambassador`,
        body: `${p.ambassador.name} played ${p.ambassador.apps} games for ${c.name} (${p.ambassador.era}): ${p.ambassador.note.toLowerCase()}. He is at the training ground most mornings.`,
        clubId: c.id,
        quiet: true,
      });
  };
  // What makes a derby a story, as lines for the preview and the press: the origin, the record, and who is in the dugout
  L.derbyAngles = function (meId, oppId) {
    const s = S(),
      me = s.clubs[meId],
      opp = s.clubs[oppId];
    if (!me || !opp) return [];
    const out = [],
      r = L.rivalry(me, opp);
    if (r) {
      const rec = L.record(me, opp);
      out.push(`${r.text}.`);
      out.push(`In ${rec.n} meetings, ${me.name} have won ${rec.w}, ${opp.name} ${rec.l}, and ${rec.d} were drawn.`);
    }
    const mgr = opp.manager && s.staff[opp.manager];
    if (mgr && mgr.legendOf && mgr.legendOf.club === me.id)
      out.push(
        `${mgr.legendOf.name}, once of ${me.name} (${mgr.legendOf.note.toLowerCase()}), is the manager in the other dugout.`,
      );
    return out;
  };
  // A club's kind, and what it means
  L.kindNote = function (c) {
    const k = c && c.kind && D.CLUB_KINDS[c.kind];
    if (!k) return null;
    let text = k.blurb;
    if (c.policy && c.policy.military)
      text =
        'Players serve here during national service: the squad is conscripts on loan from their own clubs, paid by the army, and they go back when their service ends.';
    else if (c.kind === 'reserve' && c.parent && S() && S().clubs[c.parent])
      text = `The second team of ${S().clubs[c.parent].name}: a pathway for its academy players, never promoted level with its parent.`;
    return { ...k, text };
  };

  // The label a club wears: its kind when it has one (a military club is not "fan-owned"), else its identity
  L.identityOf = function (c) {
    const base = D.IDENTITY[c.identity],
      k = c.kind && D.CLUB_KINDS[c.kind];
    return k ? { ...base, icon: k.icon, label: k.label, fans: k.fans || base.fans, kind: c.kind } : base;
  };
  // The same for a club row of the static data (the club picker, before a world exists)
  L.identityRow = function (r) {
    const base = D.IDENTITY[r[5]],
      kind = D.clubKind(r[1], r[0], r[9]),
      k = kind && D.CLUB_KINDS[kind];
    return k ? { ...base, icon: k.icon, label: k.label, fans: k.fans || base.fans, kind } : base;
  };
  // Who has won a competition: { first: { y, code }, most: [{ code, name, n }] }, the canon's years and the save's together
  L.compHonours = function (id) {
    const s = S(),
      C = L.canon(),
      comp = s && s.comps[id],
      h = C.comps[id];
    if (!h) return null;
    const tally = {},
      add = (code, n) => (tally[code] = (tally[code] || 0) + n);
    let first = null;
    const nat = comp && comp.nat && C.nat[comp.nat];
    if (h.kind === 'league' && comp && comp.tier === 1 && nat) {
      Object.values(C.clubs)
        .filter((c) => c.nat === comp.nat)
        .forEach((c) => add(c.code, c.t.length));
      const y = Object.keys(nat.years)
        .map(Number)
        .sort((a, b) => a - b)[0];
      if (y) first = { y, code: nat.years[y][0] };
    } else if (h.kind === 'cup' && nat) {
      Object.values(C.clubs)
        .filter((c) => c.nat === comp.nat)
        .forEach((c) => add(c.code, c.cups.length));
      const y = Object.keys(nat.cupYears)
        .map(Number)
        .sort((a, b) => a - b)[0];
      if (y) first = { y, code: nat.cupYears[y][0] };
    }
    if (s)
      Object.values(s.clubs).forEach((c) => {
        const n = (c.titles && c.titles[id]) || 0;
        if (n) add(c.id.slice(2), n);
      });
    const most = Object.entries(tally)
      .filter(([, n]) => n > 0)
      .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
      .slice(0, 5)
      .map(([code, n]) => ({ code, name: oppName(code), n }));
    return { first, most };
  };

  // =============================================================== Putting it into a world
  // A new career: legends, records from before the save, and the people (after the seasons of history)
  L.seed = function () {
    const s = S();
    L.state();
    if (!Object.values(s.clubs).some((c) => c.legends)) L.seedLegends();
    L.people();
  };
  // A club's biggest win and heaviest defeat from before the save: the records its matches may beat (Records.clubRec starts from
  // them, and the club page shows them before its first match)
  L.recordsOf = function (c) {
    const s = S(),
      k = L.of(c),
      out = {};
    if (!k || !c.comp || c.parent) return out;
    const mk = (m) =>
      m && m.opp && s.clubs['c_' + m.opp]
        ? {
            gf: m.gf,
            ga: m.ga,
            opp: 'c_' + m.opp,
            year: m.y,
            comp: m.comp && s.comps[m.comp] ? m.comp : c.comp,
            hist: true,
          }
        : null;
    const w = mk(k.bigWin),
      l = mk(k.bigLoss);
    if (w) out.bigWin = w;
    if (l) out.bigLoss = l;
    return out;
  };
  L.initRecord = function (id, rec) {
    const c = S() && S().clubs[id];
    if (c) Object.assign(rec, L.recordsOf(c));
  };

  // An older save: the lore state, the legends' notes as they were, and the people
  L.ensure = function (s) {
    const prev = FM.S;
    FM.S = s;
    try {
      if (s.lore || !s.clubs || !s.comps) return;
      L.state();
      if (Object.values(s.clubs).some((c) => c.legends)) L.people();
      Object.values(s.clubs).forEach((c) => {
        if (c.kind === undefined) c.kind = D.clubKind(c.id.slice(2), c.name, c.parent && c.parent.slice(2));
      });
    } finally {
      FM.S = prev;
    }
  };

  L.addLocalRivals(); // before any world is made
})();
