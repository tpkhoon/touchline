// Database import: the framework that lets a player start a career in a world of their own instead of the built-in one.
// A database is a file (or a few) in some format; an ADAPTER knows one format and turns it into a world definition
// (FM.WorldDef, js/worlddef.js), the one format the game loads. The import runs in four steps, each usable alone:
//
//   FM.DbImport.read(files)      files in ({ name, text } each), a definition out: picks the adapter that recognises them
//   FM.DbImport.check(def)       { ok, errors, warnings, summary }: what is in it and whether it can load
//   FM.DbImport.import(files)    read + check in one go, never throws: the result the new-career screen shows
//   FM.DbImport.build(def, rules) the world itself (FM.WorldDef.load), stamped with where it came from
//
// To support another format (a CSV set, a community pack, another game's export) register an adapter:
//
//   FM.DbImport.register({
//     id: 'my-format', name: 'My format', accepts: '.csv',     // accepts: the file picker's filter
//     help: 'One line on what the file must contain',
//     detect: (files) => boolean,                              // does this adapter recognise these files?
//     parse: (files) => ({ def, notes: [] }),                  // a world definition, and anything worth telling the player
//   });
//
// Two adapters come with the game: the touchline-world JSON (below) and the historical CSV tables (js/histimport.js).
// A definition can change the game's leagues and clubs, add new ones and replace every player; the changes to the game's data
// (FM.WorldDef.patchOf / useStatic) are staged here as soon as a database is chosen, so the club picker shows them, and a
// world built from a database keeps them in its save (S.database.patch), restored on load (restore) and in the worker.
(function () {
  const FM = window.FM,
    WD = FM.WorldDef;
  const DB = (FM.DbImport = {});
  const ADAPTERS = [];

  DB.register = function (a) {
    for (const k of ['id', 'name', 'detect', 'parse']) if (!a || !a[k]) throw new Error(`Adapter needs "${k}"`);
    const i = ADAPTERS.findIndex((x) => x.id === a.id);
    if (i >= 0) ADAPTERS[i] = a;
    else ADAPTERS.push(a);
    return a;
  };
  DB.adapters = () =>
    ADAPTERS.map(({ id, name, accepts, help }) => ({ id, name, accepts: accepts || '', help: help || '' }));
  // The file picker's filter: everything any adapter reads
  DB.accept = () => [...new Set(ADAPTERS.flatMap((a) => (a.accepts || '').split(',').filter(Boolean)))].join(',');
  DB.decode = (bytes) => new TextDecoder('utf-8').decode(bytes).replace(/^\uFEFF/, '');

  // Which adapter reads these files, and the definition they make
  DB.read = function (files) {
    if (!files || !files.length) throw new Error('No file given');
    const a = ADAPTERS.find((x) => {
      try {
        return x.detect(files);
      } catch (e) {
        return false;
      }
    });
    if (!a)
      throw new Error(
        `This file is not in a format the game reads. It reads: ${ADAPTERS.map((x) => `${x.name}${x.help ? ` (${x.help})` : ''}`).join('; ') || 'nothing yet'}.`,
      );
    const out = a.parse(files);
    if (!out || !out.def) throw new Error(`${a.name}: the file made no world`);
    return { adapter: a.id, adapterName: a.name, def: out.def, notes: out.notes || [] };
  };

  // Errors that only mean "this refers to the base world": there is none yet when a database is chosen; the load checks them
  const LATER = /new clubs are not supported|new leagues are not supported|is not in the definition/;
  DB.check = function (def) {
    const v = WD.validate(def, null);
    const errors = v.errors.filter((e) => !LATER.test(e));
    const m = (def && def.meta) || {};
    return {
      ok: errors.length === 0,
      errors,
      warnings: v.warnings,
      summary: {
        name: m.name || 'Untitled database',
        author: m.author || '',
        description: m.description || '',
        startYear: m.startYear || null,
        players: m.players || 'overlay',
        leagues: (def.leagues || []).length,
        clubs: (def.clubs || []).length,
        playerRows: (def.players || []).length,
        managers: (def.managers || []).length,
        seasons: def.history && def.history.seasons ? def.history.seasons.length : 0,
      },
    };
  };

  // Files in, a verdict out: never throws, so a screen can show the reason
  DB.import = function (files) {
    WD.useStatic(null); // an import is judged against the game's own data (whatever was staged before is dropped)
    try {
      const r = DB.read(files);
      return { ...r, ...DB.check(r.def) };
    } catch (e) {
      return { ok: false, def: null, errors: [e.message], warnings: [], notes: [], summary: null };
    }
  };

  // Stage an imported database: the club picker and the league cards then show its clubs and leagues, as the world will have them
  DB.stage = function (res) {
    res.patch = WD.stage(res.def);
    Object.assign(res.summary, {
      newLeagues: res.patch.leagues.filter((l) => l.isNew).length,
      newClubs: res.patch.clubs.filter((c) => c.isNew).length,
      changedClubs: res.patch.clubs.filter((c) => !c.isNew).length,
    });
    return res.patch;
  };
  DB.clear = () => WD.useStatic(null);
  // The world a database describes (call FM.Season.init() after, as with a new world). The world remembers its source, and
  // the changes the database made to the game's leagues and clubs (a save needs them again when it is loaded, and the
  // simulation worker when it runs a day).
  DB.build = function (def, rules = {}) {
    const rep = WD.load(def, rules);
    const m = def.meta || {};
    FM.S.database = { name: m.name || 'Imported database', author: m.author || '', version: m.version || null };
    if (!WD.patchIsEmpty(rep.patch)) FM.S.database.patch = rep.patch;
    return rep;
  };
  // A loaded save: the game's data is put as that world had it (the built-in data for a world that has no database)
  DB.restore = (state) => WD.useStatic((state && state.database && state.database.patch) || null);

  // The world you are playing as a database file: JSON text of a world definition. withPlayers: every player too (the file
  // then replaces the players of any club it gives a squad)
  DB.export = function (opts = {}) {
    const S = FM.S,
      c = S.user && S.clubs[S.user.clubId];
    const def = WD.fromState(S, {
      name: (S.database && S.database.name) || `${c ? c.name : 'My'} world`,
      players: !!opts.withPlayers,
      replace: !!opts.withPlayers,
    });
    def.meta.author = (S.user && S.user.name) || '';
    def.meta.description = `Exported from a career, ${S.year}${opts.withPlayers ? ', with players' : ''}.`;
    return WD.stringify(def);
  };

  // A club data pack (names, crests, kits): put onto the game's own world
  DB.register({
    id: 'touchline-pack',
    name: 'Club data pack',
    accepts: '.json,application/json',
    help: 'a .json pack of club names, crests and kits made in the world editor',
    detect: (files) => files.length === 1 && /^\s*\{/.test(files[0].text) && files[0].text.includes(WD.PACK_FORMAT),
    parse(files) {
      const pack = WD.parsePack(files[0].text);
      WD.useStatic(null);
      const def = WD.fromStatic({ name: pack.meta.name || 'Club data pack' });
      def.meta.author = pack.meta.author || '';
      def.meta.description = pack.meta.description || '';
      const rep = WD.applyPack(def, pack);
      if (rep.errors.length) throw new Error(rep.errors.slice(0, 4).join('; '));
      const notes = [`The pack renames or redraws ${rep.clubs} clubs, ${rep.leagues} leagues and ${rep.cups} cups`];
      if (rep.unmatched.length)
        notes.push(`${rep.unmatched.length} clubs in the pack are not in this world and were left out`);
      return { def, notes };
    },
  });

  // The built-in format: a world definition as JSON
  DB.register({
    id: 'touchline-world',
    name: 'Touchline world definition',
    accepts: '.json,application/json',
    help: 'a .json file exported by the game tools (node tools/worlddef.mjs --export)',
    detect: (files) => files.length === 1 && /^\s*\{/.test(files[0].text) && files[0].text.includes(WD.FORMAT),
    parse: (files) => ({ def: WD.parse(files[0].text), notes: [] }),
  });
})();
