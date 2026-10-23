// A world in CSV files: leagues.csv, clubs.csv and players.csv, one row each, to edit in a spreadsheet and start a world from.
//   FM.CsvWorld.export(def)          the three files of a world definition ({ leagues, clubs, players }: CSV text)
//   FM.CsvWorld.template()           the same files with a header and an example row, to fill in
//   FM.CsvWorld.apply(def, files)    put the rows of the files given ({ name, text }) into a world definition: { errors, notes }
//                                    (every problem named by file, row and column; a row with a problem is left out, the rest go in)
// A database made of CSV files is also an adapter of FM.DbImport (id 'world-csv'): the files change the game's own world, a club
// or league whose id is already there is changed (only the columns that are filled in), any other becomes a new one.
(function () {
  const FM = window.FM,
    D = FM.D,
    U = FM.U,
    WD = FM.WorldDef;
  const CS = (FM.CsvWorld = /** @type {any} */ ({}));

  const COLS = {
    leagues: [
      'id',
      'name',
      'short',
      'nat',
      'tier',
      'sim',
      'rep_top',
      'rep_bottom',
      'relegate_to',
      'relegate_n',
      'promote_to',
      'promote_n',
      'qualify_to',
      'qualify_n',
    ],
    clubs: [
      'id',
      'name',
      'short',
      'nick',
      'city',
      'nat',
      'league',
      'colour1',
      'colour2',
      'identity',
      'rep',
      'founded',
      'ground',
      'capacity',
      'remove',
    ],
    players: [
      'first_name',
      'surname',
      'nat',
      'born',
      'position',
      'club',
      'foot',
      'ability',
      'potential',
      'contract',
      'id',
    ],
  };
  CS.COLUMNS = COLS;
  // every column of every file, empty (a file that leaves a column out reads as having it empty)
  const BLANK = Object.fromEntries(
    [...new Set([...COLS.leagues, ...COLS.clubs, ...COLS.players, 'age'])].map((c) => [c, '']),
  );
  const ALIAS = {
    color1: 'colour1',
    color2: 'colour2',
    stadium: 'ground',
    cap: 'capacity',
    pos: 'position',
    fn: 'first_name',
    ln: 'surname',
    firstname: 'first_name',
    lastname: 'surname',
    last_name: 'surname',
    reputation: 'rep',
    tier_up: 'promote_to',
  };
  const noBom = (t) => (String(t).charCodeAt(0) === 0xfeff ? String(t).slice(1) : String(t));
  const norm = (h) => {
    const k = String(h)
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, '_');
    return ALIAS[k] || k;
  };
  const headOf = (text) =>
    noBom(text)
      .split(/\r?\n/, 1)[0]
      .split(/[,;\t]/)
      .map(norm);
  // Which of the three files a CSV is, from its header (null: none of them)
  CS.kind = function (text) {
    const h = headOf(text),
      has = (...k) => k.every((x) => h.includes(x));
    if (has('id', 'name', 'nat', 'tier')) return 'leagues';
    if (has('name', 'league') && !h.includes('season') && !h.includes('club')) return 'clubs';
    if (has('surname', 'position')) return 'players';
    return null;
  };

  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const toCsv = (cols, rows) =>
    [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\r\n') + '\r\n';
  // The cells of a CSV (a quoted cell may hold the separator, a quote doubled, a new line)
  const grid = (text, sep) => {
    const rows = [];
    let cur = [],
      cell = '',
      q = false;
    const t = noBom(text).replace(/\r\n?/g, '\n');
    for (let i = 0; i < t.length; i++) {
      const c = t[i];
      if (q) {
        if (c === '"' && t[i + 1] === '"') {
          cell += '"';
          i++;
        } else if (c === '"') q = false;
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === sep) {
        cur.push(cell);
        cell = '';
      } else if (c === '\n') {
        cur.push(cell);
        rows.push(cur);
        cur = [];
        cell = '';
      } else cell += c;
    }
    if (cell !== '' || cur.length) {
      cur.push(cell);
      rows.push(cur);
    }
    return rows;
  };
  // The rows of a CSV as objects keyed by the normalised header (a semicolon or a tab as the separator works too)
  const rowsOf = (text) => {
    const first = noBom(text).split(/\r?\n/, 1)[0];
    const sep = first.includes(',') ? ',' : first.includes(';') ? ';' : first.includes('\t') ? '\t' : ',';
    const g = grid(text, sep);
    const head = (g[0] || []).map(norm);
    return g
      .slice(1)
      .map((cells, i) => ({
        n: i + 2, // (the row as a spreadsheet numbers it: the header is row 1)
        v: { ...BLANK, ...Object.fromEntries(head.map((h, j) => [h, (cells[j] ?? '').trim()])) },
      }))
      .filter((r) => Object.values(r.v).some((x) => x !== ''));
  };

  // ---------- Out: a definition as three files ----------
  CS.export = function (def) {
    const leagues = (def.leagues || []).map((l) => {
      const r = l.rules || {},
        band = l.repBand || [];
      return {
        id: l.id,
        name: l.name,
        short: l.short,
        nat: l.nat,
        tier: l.tier,
        sim: l.sim,
        rep_top: band[0],
        rep_bottom: band[1],
        relegate_to: r.relegate && r.relegate.to,
        relegate_n: r.relegate && r.relegate.n,
        promote_to: r.promote && r.promote.to,
        promote_n: r.promote && r.promote.auto != null ? r.promote.auto : r.promote && r.promote.n,
        qualify_to: r.qualify && r.qualify.to,
        qualify_n: r.qualify && r.qualify.n,
      };
    });
    const clubs = (def.clubs || []).map((c) => ({
      id: c.id,
      name: c.name,
      short: c.short,
      nick: c.nick,
      city: c.city,
      nat: c.nat,
      league: c.league,
      colour1: (c.colors || [])[0],
      colour2: (c.colors || [])[1],
      identity: c.identity,
      rep: c.rep,
      founded: c.founded,
      ground: c.stadium && c.stadium.name,
      capacity: c.stadium && c.stadium.cap,
      remove: '',
    }));
    const name = (id) => ((def.clubs || []).find((c) => c.id === id) || {}).name || '';
    const players = (def.players || []).map((p) => ({
      first_name: p.fn,
      surname: p.ln,
      nat: p.nat,
      born: p.born,
      position: p.pos,
      club: p.club ? name(p.club) : '',
      foot: p.foot,
      ability: W().calcCA({ attrs: p.attrs }, p.pos),
      potential: p.pa,
      contract: p.contract,
      id: p.id,
    }));
    return {
      leagues: toCsv(COLS.leagues, leagues),
      clubs: toCsv(COLS.clubs, clubs),
      players: toCsv(COLS.players, players),
    };
  };
  const W = () => FM.W;

  // ---------- Templates ----------
  CS.template = function () {
    return {
      leagues: toCsv(COLS.leagues, [
        {
          id: 'XL1',
          name: 'Example Premier League',
          short: 'XL1',
          nat: 'ENG',
          tier: 1,
          sim: 'minimal',
          rep_top: 70,
          rep_bottom: 50,
          relegate_to: '',
          relegate_n: '',
          qualify_to: 'CC',
          qualify_n: 1,
        },
      ]),
      clubs: toCsv(
        COLS.clubs,
        [
          ['Example Town FC', 'EXT', 'The Examples', 'Exampleton', '#cc2222', 60, 1905, 'Example Park', 12000],
          ['Sample United', 'SMU', 'The Samples', 'Sampleford', '#2255cc', 58, 1912, 'Sample Road', 9000],
          ['Demo City', 'DMC', 'The Demos', 'Demoville', '#22aa55', 55, 1898, 'Demo Stadium', 15000],
          ['Test Athletic', 'TSA', 'The Testers', 'Testbridge', '#ddaa22', 52, 1921, 'Test Lane', 7000],
          ['Mock Rovers', 'MKR', 'The Mocks', 'Mockley', '#8844cc', 50, 1933, 'Mock Meadow', 6000],
          ['Trial Wanderers', 'TRW', 'The Trials', 'Trialton', '#333333', 48, 1945, 'Trial Ground', 5000],
        ].map(([name, short, nick, city, colour1, rep, founded, ground, capacity]) => ({
          name,
          short,
          nick,
          city,
          nat: 'ENG',
          league: 'XL1',
          colour1,
          colour2: '#ffffff',
          identity: 'historic',
          rep,
          founded,
          ground,
          capacity,
        })),
      ),
      players: toCsv(COLS.players, [
        {
          first_name: 'Sam',
          surname: 'Example',
          nat: 'ENG',
          born: 2002,
          position: 'ST',
          club: 'Example Town FC',
          foot: 'Right',
          ability: 62,
          potential: 74,
          contract: 2029,
        },
      ]),
    };
  };

  // ---------- In: rows into a definition ----------
  const HEX = /^#[0-9a-f]{6}$/i;
  const intOf = (s) => (/^-?\d+$/.test(String(s).trim()) ? +s : NaN);
  const identityKey = (s) => {
    const t = String(s).trim().toLowerCase();
    return Object.keys(D.IDENTITY).find((k) => k === t || D.IDENTITY[k].label.toLowerCase() === t) || null;
  };
  const compIds = () => [
    ...new Set([...(D.CONTINENTALS || []).map((c) => c.id), ...(D.EURO_CUPS || []).map((c) => c.id)]),
  ];

  // Put the rows of the files into the definition (changed in place). { errors, notes }: an error names the file, the row and the
  // column ("clubs.csv, row 7 (Example Town FC), colour1: ..."); a row with an error is left out and the others go in.
  CS.apply = function (def, files) {
    const errors = [],
      notes = [];
    const bad = (file, row, who, col, msg) =>
      errors.push(`${file}, row ${row}${who ? ` (${who})` : ''}${col ? `, ${col}` : ''}: ${msg}`);
    const kinds = { leagues: null, clubs: null, players: null };
    for (const f of files) {
      const k = CS.kind(f.text);
      if (k) kinds[k] = f;
      else
        errors.push(
          `${f.name}: not one of the three files (leagues.csv has id, name, nat, tier; clubs.csv has name and league; players.csv has surname and position)`,
        );
    }
    const year = (def.meta && def.meta.startYear) || D.SEASON_START;
    const natOk = (n) => !!D.NATIONS[n] || (def.newNations || []).some((x) => x.code === n);
    let nl = 0,
      nc = 0,
      np = 0,
      uc = 0,
      ul = 0;

    // leagues
    if (kinds.leagues) {
      const f = kinds.leagues.name || 'leagues.csv';
      for (const { n, v } of rowsOf(kinds.leagues.text)) {
        const id = v.id.toUpperCase();
        const who = v.name || id;
        const cur = (def.leagues || []).find((l) => l.id === id);
        const e0 = errors.length;
        if (!/^[A-Z0-9]{2,6}$/.test(id)) bad(f, n, who, 'id', `"${v.id}" should be 2 to 6 letters or digits`);
        if (!cur && (v.name.length < 3 || v.name.length > 40))
          bad(f, n, who, 'name', 'a new league needs a name of 3 to 40 characters');
        if (v.name && (v.name.length < 3 || v.name.length > 40))
          bad(f, n, who, 'name', 'the name is 3 to 40 characters');
        const nat = (v.nat || (cur && cur.nat) || '').toUpperCase();
        if (!natOk(nat))
          bad(f, n, who, 'nat', `"${v.nat}" is not a nation of the game (use its three-letter code, such as ENG)`);
        const tier = v.tier === '' && cur ? cur.tier : intOf(v.tier);
        if (!(tier >= 1 && tier <= 6)) bad(f, n, who, 'tier', `"${v.tier}" should be a whole number from 1 to 6`);
        const sim = v.sim ? v.sim.toLowerCase() : (cur && cur.sim) || 'minimal';
        if (!['full', 'light', 'minimal'].includes(sim))
          bad(f, n, who, 'sim', `"${v.sim}" should be full, light or minimal`);
        const band = cur && cur.repBand ? cur.repBand.slice() : [60, 45];
        for (const [col, i] of [
          ['rep_top', 0],
          ['rep_bottom', 1],
        ])
          if (v[col] !== '') {
            const x = intOf(v[col]);
            if (!(x >= 20 && x <= 99)) bad(f, n, who, col, `"${v[col]}" should be a whole number from 20 to 99`);
            else band[i] = x;
          }
        if (band[0] < band[1]) bad(f, n, who, 'rep_top', 'the top of the reputation band is below its bottom');
        const rules = JSON.parse(JSON.stringify((cur && cur.rules) || {}));
        const link = (key, toCol, nCol, extra) => {
          if (v[toCol] === '' && v[nCol] === '') return;
          const to = v[toCol].toUpperCase(),
            k = intOf(v[nCol]);
          if (extra && !extra(to))
            return bad(f, n, who, toCol, `"${v[toCol]}" is not a league or competition of the game or this file`);
          if (!(k >= 1 && k <= 10)) return bad(f, n, who, nCol, `"${v[nCol]}" should be a whole number from 1 to 10`);
          const old = rules[key] || {},
            num = key === 'promote' ? 'auto' : 'n';
          if (old.to === to && old[num] === k) return; // (as it was: its other settings, such as a play-off, stay)
          rules[key] = { ...old, to, [num]: k };
        };
        const known = (to) =>
          (def.leagues || []).some((l) => l.id === to) ||
          rowsOf(kinds.leagues.text).some((r) => r.v.id.toUpperCase() === to);
        link('relegate', 'relegate_to', 'relegate_n', known);
        link('promote', 'promote_to', 'promote_n', known);
        link('qualify', 'qualify_to', 'qualify_n', (to) => compIds().includes(to));
        if (errors.length > e0) continue;
        const next = {
          ...(cur || {}),
          id,
          name: v.name || (cur && cur.name),
          short: (v.short || (cur && cur.short) || id).toUpperCase().slice(0, 6),
          nat,
          tier,
          sim,
          repBand: band,
          rules,
        };
        if (cur) (Object.assign(cur, next), ul++);
        else ((def.leagues = def.leagues || []).push(next), nl++);
      }
    }

    // clubs
    if (kinds.clubs) {
      const f = kinds.clubs.name || 'clubs.csv';
      const used = new Set([...(def.clubs || []).map((c) => c.id), ...D.allClubRows().map((r) => 'c_' + r[1])]);
      const names = new Set((def.clubs || []).map((c) => c.name.toLowerCase()));
      const usedShort = new Set((def.clubs || []).map((c) => c.short));
      for (const { n, v } of rowsOf(kinds.clubs.text)) {
        const who = v.name || v.id;
        const e0 = errors.length;
        let cur = v.id ? (def.clubs || []).find((c) => c.id === v.id) : null;
        if (!cur && !v.id && v.name)
          cur = (def.clubs || []).find(
            (c) => c.name.toLowerCase() === v.name.toLowerCase() && (!v.league || c.league === v.league),
          );
        if (/^(1|yes|y|true|x)$/i.test(v.remove)) {
          if (!cur) bad(f, n, who, 'remove', 'there is no such club to take out');
          else {
            def.clubs = def.clubs.filter((c) => c !== cur);
            def.players = (def.players || []).filter((p) => p.club !== cur.id);
            if (!/^c_/.test(cur.id) || D.allClubRows().some((r) => 'c_' + r[1] === cur.id))
              def.removeClubs = [...new Set([...(def.removeClubs || []), cur.id])];
            uc++;
          }
          continue;
        }
        const name = v.name || (cur && cur.name) || '';
        if (name.length < 2 || name.length > 40) bad(f, n, who, 'name', 'the name is 2 to 40 characters');
        else if (!cur && names.has(name.toLowerCase()))
          bad(f, n, who, 'name', `there is already a club called ${name}`);
        const lg = (def.leagues || []).find((l) => l.id === (v.league || (cur && cur.league)));
        if (!lg) bad(f, n, who, 'league', `"${v.league}" is not a league of the game or of leagues.csv`);
        const nat = (v.nat || (cur && cur.nat) || (lg && lg.nat) || '').toUpperCase();
        if (!natOk(nat) && (lg || v.nat)) bad(f, n, who, 'nat', `"${v.nat}" is not a nation of the game`);
        const colors = cur && cur.colors ? cur.colors.slice() : ['#2a6fdb', '#ffffff'];
        for (const [col, i] of [
          ['colour1', 0],
          ['colour2', 1],
        ])
          if (v[col] !== '') {
            const c = v[col].startsWith('#') ? v[col] : '#' + v[col];
            if (!HEX.test(c)) bad(f, n, who, col, `"${v[col]}" is not a #rrggbb colour`);
            else if (!colors[i] || colors[i].toLowerCase() !== c.toLowerCase()) colors[i] = c.toLowerCase();
          }
        let identity = cur && cur.identity ? cur.identity : 'historic';
        if (v.identity !== '') {
          identity = identityKey(v.identity);
          if (!identity)
            bad(
              f,
              n,
              who,
              'identity',
              `"${v.identity}" is not one of ${Object.values(D.IDENTITY)
                .map((x) => x.label)
                .join(', ')}`,
            );
        }
        let rep = cur ? cur.rep : lg && lg.repBand ? Math.round((lg.repBand[0] + lg.repBand[1]) / 2) : 50;
        if (v.rep !== '') {
          rep = intOf(v.rep);
          if (!(rep >= 20 && rep <= 99)) bad(f, n, who, 'rep', `"${v.rep}" should be a whole number from 20 to 99`);
        }
        let founded = cur ? cur.founded : 1900;
        if (v.founded !== '') {
          founded = intOf(v.founded);
          if (!(founded >= 1800 && founded <= year))
            bad(f, n, who, 'founded', `"${v.founded}" should be a year from 1800 to ${year}`);
        }
        let cap = cur && cur.stadium ? cur.stadium.cap : 8000;
        if (v.capacity !== '') {
          cap = intOf(v.capacity.replace(/[ ,.]/g, ''));
          if (!(cap >= 1000 && cap <= 120000))
            bad(f, n, who, 'capacity', `"${v.capacity}" should be a whole number from 1,000 to 120,000`);
        }
        if (v.id && !cur && !/^c_[A-Za-z0-9]{2,8}$/.test(v.id))
          bad(f, n, who, 'id', `"${v.id}" should be c_ and 2 to 8 letters or digits`);
        if (v.id && !cur && used.has(v.id)) bad(f, n, who, 'id', `${v.id} is already a club of the game`);
        if (errors.length > e0) continue;
        if (cur) {
          Object.assign(cur, {
            name,
            short: v.short ? v.short.toUpperCase().slice(0, 5) : cur.short,
            nick: v.nick !== '' ? v.nick : cur.nick,
            city: v.city !== '' ? v.city : cur.city,
            nat,
            league: lg.id,
            colors,
            identity,
            rep,
            founded,
            stadium: {
              ...(cur.stadium || {}),
              name: v.ground !== '' ? v.ground : (cur.stadium || {}).name || `${name} Ground`,
              cap,
            },
          });
          uc++;
          continue;
        }
        // a new club: an id of three letters of its name and a number, unused anywhere
        let id = v.id;
        if (!id) {
          const base = (name.toUpperCase().replace(/[^A-Z]/g, '') + 'XXX').slice(0, 3);
          for (let i = 0; !id || used.has(id); i++) id = `c_${base}${i ? i : ''}`;
        }
        used.add(id);
        names.add(name.toLowerCase());
        const short =
          (v.short || '').toUpperCase().slice(0, 5) ||
          (U.abbrev ? U.abbrev(name, usedShort, FM.D.isRude) : name.slice(0, 3).toUpperCase());
        usedShort.add(short);
        (def.clubs = def.clubs || []).push({
          id,
          name,
          short,
          nick: v.nick,
          city: v.city || name.split(' ')[0],
          nat,
          colors,
          identity,
          rep,
          league: lg.id,
          parent: null,
          founded,
          crest: null,
          stadium: { name: v.ground || `${name.split(' ')[0]} Ground`, cap },
        });
        nc++;
      }
    }

    // players
    if (kinds.players) {
      const f = kinds.players.name || 'players.csv';
      const E = WD.editor(def, null);
      const byName = new Map();
      for (const c of def.clubs || []) byName.set(c.name.toLowerCase(), c.id);
      for (const { n, v } of rowsOf(kinds.players.text)) {
        const who = `${v.first_name} ${v.surname}`.trim();
        const e0 = errors.length;
        const nat = v.nat.toUpperCase();
        if (!natOk(nat)) bad(f, n, who, 'nat', `"${v.nat}" is not a nation of the game`);
        const pos = v.position.toUpperCase();
        if (!D.POS.includes(pos)) bad(f, n, who, 'position', `"${v.position}" should be one of ${D.POS.join(', ')}`);
        let born = intOf(v.born);
        if (v.born === '' && v.age !== undefined && v.age !== '') born = year - intOf(v.age);
        if (!(year - born >= 15 && year - born <= 45))
          bad(f, n, who, 'born', `"${v.born}" should be a year of birth that makes him 15 to 45 in ${year}`);
        let club = null;
        if (v.club !== '') {
          club = (def.clubs || []).some((c) => c.id === v.club) ? v.club : byName.get(v.club.toLowerCase()) || null;
          if (!club)
            bad(
              f,
              n,
              who,
              'club',
              `"${v.club}" is not a club of the game or of clubs.csv (leave it empty for a free agent)`,
            );
        }
        const foot = v.foot ? v.foot[0].toUpperCase() + v.foot.slice(1).toLowerCase() : 'Right';
        if (!['Left', 'Right', 'Both'].includes(foot))
          bad(f, n, who, 'foot', `"${v.foot}" should be Left, Right or Both`);
        const clubRep = club ? ((def.clubs || []).find((c) => c.id === club) || {}).rep : 50;
        let ca = v.ability !== '' ? intOf(v.ability) : Math.round(FM.W.levelFor ? FM.W.levelFor(clubRep) : 50);
        if (!(ca >= 20 && ca <= 95)) bad(f, n, who, 'ability', `"${v.ability}" should be a whole number from 20 to 95`);
        let pa = v.potential !== '' ? intOf(v.potential) : null;
        if (pa != null && !(pa >= 20 && pa <= 96))
          bad(f, n, who, 'potential', `"${v.potential}" should be a whole number from 20 to 96`);
        let contract = v.contract !== '' ? intOf(v.contract) : null;
        if (contract != null && !(contract >= year && contract <= year + 8))
          bad(f, n, who, 'contract', `"${v.contract}" should be a year from ${year} to ${year + 8}`);
        if (!who) bad(f, n, '', 'surname', 'a player needs a name');
        if (errors.length > e0) continue;
        const attrs = WD.suggestAttrs(pos, ca);
        const real = FM.W.calcCA({ attrs }, pos);
        const spec = {
          fn: v.first_name,
          ln: v.surname,
          nat,
          pos,
          born,
          foot,
          club,
          attrs,
          pa: Math.max(
            real,
            Math.min(96, pa != null ? pa : real + Math.max(0, Math.round((27 - (year - born)) * 1.2))),
          ),
          ...(contract != null ? { contract } : {}),
          ...(v.id ? { id: v.id } : {}),
        };
        const r = E.addPlayer(spec);
        if (!r.ok) for (const m of r.errors) bad(f, n, who, '', m.replace(/^player [^:]*: /, ''));
        else np++;
      }
    }
    if (nl || ul) notes.push(`${U.plural(nl, 'new league')}, ${U.plural(ul, 'league')} changed`);
    if (nc || uc) notes.push(`${U.plural(nc, 'new club')}, ${U.plural(uc, 'club')} changed or taken out`);
    if (np) notes.push(`${U.plural(np, 'player')} added`);
    return { errors, notes, counts: { nl, ul, nc, uc, np } };
  };

  // ---------- The adapter: CSV files as a database ----------
  FM.DbImport.register({
    id: 'world-csv',
    name: 'World CSV files',
    accepts: '.csv,text/csv',
    help: 'leagues.csv (id, name, nat, tier ...), clubs.csv (name, league, colour1 ...) and players.csv (first_name, surname, nat, born, position, club ...); download the templates in the editor',
    detect: (files) =>
      files.length > 0 &&
      files.every((f) => CS.kind(f.text)) &&
      files.some((f) => ['leagues', 'clubs'].includes(CS.kind(f.text))),
    parse(files) {
      const def = WD.fromStatic({ name: 'CSV world' });
      def.meta.base = 'csv';
      const r = CS.apply(def, files);
      if (r.errors.length)
        throw new Error(
          `${U.plural(r.errors.length, 'problem')} in the files:\n${r.errors.slice(0, 20).join('\n')}${r.errors.length > 20 ? `\n… and ${r.errors.length - 20} more` : ''}`,
        );
      return { def, notes: r.notes };
    },
  });
})();
