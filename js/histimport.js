// The historical CSV importer, in the game: season tables, player statistics and club details in, a world definition out
// (js/worlddef.js), with the real-stats converter (js/realstats.js) turning statistics into player attributes. Clubs and
// leagues are matched against the base world's, or against the game's own data when there is no world yet; whatever cannot
// be matched is listed and left out. Nothing here invents data: every number comes from the files.
//
//   tables.csv   season, league, pos, club, p, w, d, l, gf, ga, pts     one row per club per season (season = the year it
//                                                                       started: 2023 for 2023/24); league is a league id
//                                                                       (D1) or its name; club is a club id (c_MCI), name
//                                                                       or short name
//   players.csv  name, nat, born (or age), pos, club, league, minutes, goals, assists, xg, ... (see js/realstats.js)
//   clubs.csv    club, name, short, nick, city, colour1, colour2, rep, stadium, capacity     changes to clubs already there
//
// It is also an adapter of the database import (js/dbimport.js): pick the CSV files together on the new-career screen.
// The command-line tool (tools/import-history.mjs) is the same code.
(function () {
  const FM = window.FM,
    D = FM.D,
    WD = FM.WorldDef,
    R = FM.RealStats;
  const H = (FM.HistImport = {});

  const norm = (s) =>
    String(s || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\b(fc|afc|cf|sc|ac|as|ssc|sv|fk|bk|the)\b/g, '')
      .replace(/[^a-z0-9]/g, '');

  // Player statistics (rows of a CSV, as objects) into rows for the editing API's importPlayers, through the real-stats
  // converter. opts.club: 'column' (each row's own club column, matched against the definition's clubs; a row with none is
  // a free agent), a club id (every row goes there) or null (every row is a free agent). requireClub: a row whose club
  // cannot be matched, or has none, is left out and listed (the historical importer's rule).
  H.playerRows = function (def, rows, opts = {}) {
    const year = opts.year || def.meta.startYear || D.SEASON_START,
      mode = opts.club === undefined ? 'column' : opts.club;
    const byKey = new Map();
    for (const c of def.clubs) for (const k of [c.id, c.name, c.short, c.nick]) if (k) byKey.set(norm(k), c);
    const find = opts.find || ((x) => byKey.get(norm(x)) || byKey.get(norm(String(x).replace(/^c_/, ''))));
    const out = [],
      unmatched = new Set();
    for (const row of rows.map(R.clean)) {
      let c = null;
      if (mode === 'column') {
        c = row.club ? find(row.club) : null;
        if ((row.club || opts.requireClub) && !c) {
          unmatched.add(row.club);
          continue;
        }
      } else if (mode) c = def.clubs.find((x) => x.id === mode) || null;
      try {
        const lg = c && def.leagues.find((l) => l.id === c.league);
        const x = R.convert({
          ...row,
          league: row.league ?? (lg && lg.id) ?? 50,
          age: row.age ?? (row.born ? year - row.born : undefined),
        });
        out.push({
          name: row.name,
          nat: row.nat,
          born: row.born ?? year - (row.age ?? 25),
          club: c ? c.id : null,
          foot: row.foot || 'Right',
          contract: row.contract ?? year + (c ? 2 : 1),
          ...x,
        });
      } catch (e) {
        out.push({ name: row.name, error: e.message });
      }
    }
    return { rows: out, unmatched: [...unmatched] };
  };

  // The importer: texts in, { def, report } out. S is the world it matches clubs and leagues against (none: the game's own data).
  H.import = function ({ tables, players, clubs, name = 'Imported world' }, S = null) {
    // S: a world to match against; none (the app, before a career starts): the game's own data
    const def = S ? WD.fromState(S, { name, players: false }) : WD.fromStatic({ name });
    const year = S ? S.year : D.SEASON_START;
    def.meta.base = 'import';
    const E = WD.editor(def, S);
    const rep = { seasons: 0, rows: 0, players: 0, clubEdits: 0, unmatched: new Set(), skipped: [], errors: [] };
    const byKey = new Map();
    for (const c of def.clubs) for (const k of [c.id, c.name, c.short, c.nick]) if (k) byKey.set(norm(k), c);
    const club = (x) => byKey.get(norm(x)) || byKey.get(norm(String(x).replace(/^c_/, '')));
    const leagueOf = (x) => {
      const n = norm(x);
      return def.leagues.find((l) => norm(l.id) === n || norm(l.name) === n || norm(l.short) === n);
    };

    // tables → past seasons
    const seasons = new Map();
    for (const row of (tables || []).map(R.clean)) {
      const lg = leagueOf(row.league),
        c = club(row.club);
      if (!lg) {
        rep.skipped.push(`table row ${row.season} ${row.league}: unknown league`);
        continue;
      }
      if (!c) {
        rep.unmatched.add(row.club);
        continue;
      }
      const key = `${row.season}|${lg.id}`;
      if (!seasons.has(key)) seasons.set(key, { year: +row.season, league: lg.id, rows: [] });
      const p = row.p ?? row.w + row.d + row.l;
      seasons.get(key).rows.push({
        id: c.id,
        pos: +row.pos || 0,
        p,
        w: row.w,
        d: row.d,
        l: row.l,
        gf: row.gf,
        ga: row.ga,
        pts: row.pts ?? row.w * def.rules.win + row.d,
        gd: row.gf - row.ga,
      });
      rep.rows++;
    }
    const byYear = new Map();
    for (const s of seasons.values()) {
      s.rows.sort((a, b) => a.pos - b.pos || b.pts - a.pts || b.gd - a.gd);
      s.rows.forEach((r) => delete r.pos);
      if (!byYear.has(s.year))
        byYear.set(s.year, { year: s.year, label: `${s.year}/${String(s.year + 1).slice(2)}`, comps: {} });
      byYear.get(s.year).comps[s.league] = {
        champion: s.rows[0].id,
        runnerUp: s.rows[1] && s.rows[1].id,
        table: s.rows,
      };
    }
    for (const s of [...byYear.values()].sort((a, b) => a.year - b.year)) {
      const r = E.addSeason(s);
      if (r.ok) rep.seasons++;
      else rep.errors.push(...r.errors.map((e) => `season ${s.year}: ${e}`));
    }

    // clubs → edits
    for (const row of (clubs || []).map(R.clean)) {
      const c = club(row.club);
      if (!c) {
        rep.unmatched.add(row.club);
        continue;
      }
      const patch = {};
      for (const k of ['name', 'short', 'nick', 'city']) if (row[k]) patch[k] = row[k];
      if (row.colour1 && row.colour2) patch.colors = [row.colour1, row.colour2];
      if (row.rep) patch.rep = row.rep;
      if (row.stadium || row.capacity)
        patch.stadium = {
          ...(row.stadium ? { name: row.stadium } : {}),
          ...(row.capacity ? { cap: row.capacity } : {}),
        };
      const r = E.setClub(c.id, patch);
      if (r.ok) rep.clubEdits++;
      else rep.errors.push(...r.errors);
    }

    // players → converted
    const pr = H.playerRows(def, players || [], { year, requireClub: true, club: 'column', find: club });
    pr.unmatched.forEach((x) => rep.unmatched.add(x));
    const r = E.importPlayers(pr.rows);
    rep.players = r.added;
    rep.errors.push(...r.errors);
    rep.unmatched = [...rep.unmatched];
    const v = WD.validate(def, S);
    rep.errors.push(...v.errors);
    rep.warnings = v.warnings;
    return { def, report: rep };
  };

  // ---------- The database import adapter ----------
  const heads = (text) =>
    String(text)
      .split(/\r?\n/, 1)[0]
      .split(',')
      .map((x) => x.trim().toLowerCase());
  // Which of the three files a CSV is, from its header
  H.kind = function (text) {
    const h = heads(text),
      has = (...k) => k.every((x) => h.includes(x));
    if (has('season', 'league', 'club')) return 'tables';
    if (has('name', 'pos', 'club')) return 'players';
    if (has('club') && !h.includes('season')) return 'clubs';
    return null;
  };
  FM.DbImport.register({
    id: 'history-csv',
    name: 'Historical CSV tables',
    accepts: '.csv,text/csv',
    help: 'tables.csv (season, league, pos, club, p, w, d, l, gf, ga, pts), and optionally players.csv and clubs.csv, picked together',
    detect: (files) =>
      files.length > 0 &&
      files.every((f) => H.kind(f.text)) &&
      files.some((f) => H.kind(f.text) === 'tables' || H.kind(f.text) === 'clubs' || H.kind(f.text) === 'players'),
    parse(files) {
      const of = (k) => {
        const f = files.find((x) => H.kind(x.text) === k);
        return f && R.parseCSV(f.text);
      };
      const { def, report } = H.import({
        tables: of('tables'),
        players: of('players'),
        clubs: of('clubs'),
        name: 'Imported tables',
      });
      if (report.errors.length) throw new Error(report.errors.slice(0, 6).join('; '));
      const notes = [
        `${report.seasons} past season(s) from ${report.rows} table rows, ${report.players} players, ${report.clubEdits} club edits`,
      ];
      if (report.unmatched.length) notes.push(`Clubs not found, left out: ${report.unmatched.slice(0, 12).join(', ')}`);
      return { def, notes };
    },
  });
})();
