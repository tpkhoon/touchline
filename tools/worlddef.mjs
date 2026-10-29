// World definition tool.
//   node tools/worlddef.mjs --export world.json [--no-players]   the base world as a definition
//   node tools/worlddef.mjs --validate world.json               errors and warnings in a definition
//   node tools/worlddef.mjs --test                               self-check (npm run test:worlddef)
import fs from 'node:fs';
import { parseArgs, loadSim } from './harness.mjs';

const args = parseArgs();
const { FM } = loadSim(+(args.seed || 4));
const W = FM.W,
  WD = FM.WorldDef,
  R = FM.RealStats;
const baseWorld = () => {
  W.newWorld(W.REAL_RULES);
  FM.Season.init();
};

if ('export' in args || 'validate' in args) {
  const file = args.export || args.validate;
  baseWorld();
  if ('export' in args) {
    const def = WD.fromState(FM.S, { name: 'Base world', players: !('no-players' in args) });
    fs.writeFileSync(file, WD.stringify(def));
    console.log(
      `Wrote ${def.clubs.length} clubs, ${def.players.length} players, ${def.history.seasons.length} past seasons to ${file}`,
    );
  } else {
    const v = WD.validate(WD.parse(fs.readFileSync(file, 'utf8')), FM.S);
    console.log(`${v.errors.length} errors, ${v.warnings.length} warnings`);
    [...v.errors.map((e) => '✗ ' + e), ...v.warnings.map((w) => '· ' + w)].slice(0, 40).forEach((l) => console.log(l));
    process.exit(v.errors.length ? 1 : 0);
  }
  process.exit(0);
}

if ('test' in args) {
  const fails = [];
  const check = (ok, msg) => ok || fails.push(msg);
  baseWorld();
  const S0 = FM.S;
  const nClubs = Object.keys(S0.clubs).length;
  const def = WD.fromState(S0, { name: 'Test', players: false });
  const v0 = WD.validate(def, S0);
  check(!v0.errors.length, `the base world's own definition has errors: ${v0.errors.slice(0, 3)}`);
  check(def.clubs.length === nClubs, 'export dropped clubs');
  check(
    JSON.stringify(WD.parse(WD.stringify(def))) === JSON.stringify(def),
    'the definition changed through stringify/parse',
  );

  // refusals
  check(WD.validate({}, S0).errors.length > 0, 'an empty object was accepted');
  const bad = JSON.parse(JSON.stringify(def));
  bad.clubs[0].colors = ['red', 'blue'];
  bad.clubs.push(
    { ...bad.clubs[1], id: 'c_NEWFC', name: 'Brand New FC' },
    { ...bad.clubs[1], id: 'bad id', name: 'Bad Id FC' },
  );
  bad.meta.players = 'replace';
  const vb = WD.validate(bad, S0);
  check(
    vb.errors.some((e) => /colours/.test(e)),
    'bad colours were accepted',
  );
  check(
    !vb.errors.some((e) => /c_NEWFC/.test(e)) && vb.errors.some((e) => /bad id.*new club's id/.test(e)),
    'a good new club was refused, or a bad id accepted',
  );
  check(
    vb.errors.some((e) => /replace/.test(e)),
    'replace mode was accepted',
  );
  let threw = false;
  try {
    WD.parse(JSON.stringify({ ...def, version: 99 }));
  } catch (e) {
    threw = true;
  }
  check(threw, 'a newer format was read');

  // editing keeps the definition valid
  const E = WD.editor(def, S0);
  const club = def.clubs.find((c) => c.league === 'D1');
  check(!E.setClub(club.id, { rep: 5 }).ok, 'a club rating of 5 was accepted');
  check(
    E.setClub(club.id, {
      name: 'Test Rovers',
      colors: ['#112233', '#ffffff'],
      stadium: { name: 'Test Park', cap: 33333 },
    }).ok,
    'a good club edit was refused',
  );
  const conv = R.convert({
    pos: 'ST',
    age: 24,
    minutes: 2800,
    league: 'D1',
    goals: 22,
    xg: 17,
    shots: 100,
    assists: 5,
    passes: 520,
    passPct: 77,
    keyPasses: 28,
    dribbles: 45,
  });
  const res = E.importPlayers([
    { name: 'Alex Testwood', nat: 'ENG', born: S0.year - 24, club: club.id, ...conv },
    { name: 'No Position', error: 'x' },
  ]);
  check(res.added === 1 && res.errors.length === 1, 'importing converted players: ' + JSON.stringify(res));
  check(
    !E.addPlayer({ fn: 'A', ln: 'B', nat: 'ENG', born: S0.year - 24, pos: 'ST', attrs: { ...conv.attrs, pace: 99 } })
      .ok,
    'attribute 99 was accepted',
  );
  const tbl = def.clubs.filter((c) => c.league === 'D1').map((c) => c.id);
  const past = {
    year: S0.year - 1,
    label: 'Past',
    comps: {
      D1: {
        champion: tbl[0],
        runnerUp: tbl[1],
        table: tbl.map((id, i) => ({
          id,
          p: 38,
          w: 20 - i,
          d: 8,
          l: 10 + i,
          gf: 60 - i,
          ga: 40 + i,
          pts: 68 - 3 * i,
          gd: 20 - 2 * i,
        })),
      },
    },
  };
  check(
    E.addSeason(past).ok,
    'a good past season was refused: ' + JSON.stringify(E.addSeason(past).errors.slice(0, 2)),
  );
  check(E.validate().errors.length === 0, 'the edited definition has errors: ' + E.validate().errors.slice(0, 3));

  // load it into a new world
  const before = FM.S;
  const rep = WD.load(JSON.parse(WD.stringify(def)));
  const S = FM.S;
  check(S !== before, 'load did not make a new world');
  check(
    S.clubs[club.id].name === 'Test Rovers' && S.clubs[club.id].colors[0] === '#112233',
    'the club edit did not reach the world',
  );
  check(
    S.clubs[club.id].stadium.name === 'Test Park' && S.clubs[club.id].stadium.cap === 33333,
    'the stadium edit did not reach the world',
  );
  const p = Object.values(S.players).find((x) => x.fn === 'Alex' && x.ln === 'Testwood');
  check(p && p.clubId === club.id && p.pos === 'ST', 'the imported player is not at his club');
  check(p && Math.abs(p.ca - conv.ca) <= 1, `the imported player's ability is ${p && p.ca}, converted ${conv.ca}`);
  check(rep.playersAdded === 1, `playersAdded ${rep.playersAdded}`);
  const size = W.squad(club.id).length;
  check(size >= 16 && size <= 45, `${club.id} squad is ${size}`);
  check(
    S.archive.length >= 1 && S.archive[0].year === S.year - 1 && S.archive[0].comps.D1.table.length === tbl.length,
    'the past season did not reach the archive',
  );
  FM.Season.init();
  W.takeCharge(club.id, 'Definition Test');
  FM.Season.advance(null);
  FM.Season.advance(null);
  check(FM.S.day >= 2, 'the loaded world would not play');
  // a signing rule of its own: a club that may only sign players of one nation
  {
    baseWorld();
    const S2 = FM.S;
    const spanish = Object.values(S2.clubs).find((c) => c.comp && c.nat === 'ESP' && !c.policy && c.sim === 'full');
    const d2 = WD.fromState(S2, { name: 'Rule test', players: false });
    const entry = () => d2.clubs.find((c) => c.id === spanish.id);
    entry().policy = { nat: 'FRA', label: 'French' };
    check(WD.validate(d2, S2).errors.length === 0, 'a signing rule by nation did not validate');
    entry().policy = { nat: 'XXX' };
    check(WD.validate(d2, S2).errors.length > 0, 'a signing rule with an unknown nation was accepted');
    entry().policy = { nat: 'FRA', label: 'French' };
    baseWorld();
    WD.apply(d2, FM.S);
    const c2 = FM.S.clubs[spanish.id];
    check(
      c2.policy && c2.policy.nat === 'FRA' && c2.policy.label === 'French',
      'the signing rule did not reach the club',
    );
    check(
      W.squad(c2.id).every((x) => x.nat === 'FRA'),
      "the squad was not made of players of the rule's nation",
    );
    const other = Object.values(FM.S.players).find((x) => x.nat === 'ESP' && x.clubId !== c2.id);
    check(!FM.Reg.policy(c2, other).ok, 'the club may sign a player of another nation');
    check(FM.Reg.policy(c2, W.squad(c2.id)[0]).ok, 'the club may not sign a player of its own nation');
    const back = WD.fromState(FM.S, { name: 'Round trip', players: false }).clubs.find((c) => c.id === spanish.id);
    check(back.policy && back.policy.nat === 'FRA', 'the signing rule did not survive a round trip');
    // by part of the world, and by family heritage
    for (const [policy, test] of [
      [{ region: 'AFR' }, (x) => [x.nat, x.nat2].some((n) => n && FM.D.NATIONS[n] && FM.D.NATIONS[n].region === 'AFR')],
      [{ heritage: 'latin' }, (x) => x.heritage === 'latin'],
    ]) {
      baseWorld();
      const d3 = WD.fromState(FM.S, { name: 'Rule test', players: false });
      d3.clubs.find((c) => c.id === spanish.id).policy = policy;
      check(WD.validate(d3, FM.S).errors.length === 0, `a signing rule ${JSON.stringify(policy)} did not validate`);
      WD.apply(d3, FM.S);
      const c3 = FM.S.clubs[spanish.id];
      check(
        W.squad(c3.id).length > 15 && W.squad(c3.id).every(test),
        `the squad does not fit the rule ${JSON.stringify(policy)}`,
      );
      check(c3.policy && c3.policy.label, `the rule ${JSON.stringify(policy)} has no name`);
      const outsider = Object.values(FM.S.players).find((x) => !test(x) && x.clubId !== c3.id);
      check(!FM.Reg.policy(c3, outsider).ok, `the rule ${JSON.stringify(policy)} lets an outsider in`);
      check(FM.Reg.policy(c3, W.squad(c3.id)[0]).ok, `the rule ${JSON.stringify(policy)} refuses its own player`);
      const gen = Array.from({ length: 30 }, () =>
        W.genPlayer({ nat: 'ESP', pos: 'CM', age: 22, ca: 50, pa: 55, clubId: c3.id }),
      );
      check(gen.every(test), `new players for a club with ${JSON.stringify(policy)} do not fit it`);
    }
    // the squads kept in the definition: a fresh world built from it has the same players at a club
    {
      baseWorld();
      const club = Object.values(FM.S.clubs).find((c) => c.comp && c.sim === 'full');
      // (attributes are kept to one decimal, which can move a player's ability a point: that is not a change)
      const names = (id) => W.squad(id).map((x) => ({ n: `${x.fn} ${x.ln} ${x.pos}`, ca: x.ca }));
      const before = names(club.id);
      const d5 = WD.fromState(FM.S, { name: 'Squads', players: true, replace: true });
      check(d5.players.length > 15000 && d5.meta.players === 'replace', 'the squads were not kept in the definition');
      baseWorld();
      WD.apply(d5, FM.S);
      // (every player kept comes back as he was; the academy makes its young players afresh)
      const after = names(club.id);
      check(
        before.every((x) => after.some((y) => y.n === x.n && Math.abs(y.ca - x.ca) <= 1)),
        'a world built from kept squads has lost or changed players at a club',
      );
    }
    {
      baseWorld();
      const d4 = WD.fromState(FM.S, { name: 'Rule test', players: false });
      d4.clubs.find((c) => c.id === spanish.id).policy = { region: 'MOON' };
      check(WD.validate(d4, FM.S).errors.length > 0, 'a signing rule with an unknown part of the world was accepted');
    }
  }
  // regional cups in a definition: a club plays one, a list replaces the game's, and the game's own comes back
  {
    const D = FM.D,
      before = D.AREAS.length;
    const d6 = WD.fromStatic({ name: 'Regional test' });
    check(d6.regionals.length === before, 'the static definition does not list the regional cups');
    const d2 = d6.clubs
      .filter((c) => c.league === 'D2')
      .slice(0, 4)
      .map((c) => c.id.replace(/^c_/, ''));
    d6.regionals = d6.regionals.filter((a) => a.id !== 'BRA_NE');
    d6.regionals.push({ id: 'ENG_X1', nat: 'ENG', format: 'ko', name: 'Test Cup', short: 'TST', clubs: d2 });
    check(!WD.validate(d6, null).errors.length, 'a valid regional cup was refused');
    const p6 = WD.patchOf(d6);
    WD.useStatic(p6);
    check(
      D.AREAS.some((r) => r[0] === 'ENG_X1') && !D.AREAS.some((r) => r[0] === 'BRA_NE'),
      'regional cups were not applied',
    );
    WD.useStatic(null);
    check(D.AREAS.length === before && D.AREAS.some((r) => r[0] === 'BRA_NE'), 'the regional cups were not put back');
    d6.regionals[0].clubs = [...d6.regionals[0].clubs, ...d2.slice(0, 1)];
    check(
      WD.validate(d6, null).errors.some((e) => /also in/.test(e)),
      'a club in two regional cups was accepted',
    );
  }
  // a cross-nation league: its clubs keep their own nation, their national cup, and their players
  {
    const D = FM.D,
      d7 = WD.fromStatic({ name: 'Cross-nation test' });
    d7.leagues.push({
      id: 'NAF',
      name: 'North African League',
      short: 'NAF',
      nat: 'MAR',
      nats: ['ALG', 'TUN'],
      tier: 1,
      sim: 'light',
      repBand: [60, 40],
      rules: {},
    });
    const take = (nat, n) =>
      d7.clubs
        .filter((c) => c.nat === nat && !c.parent)
        .sort((a, b) => b.rep - a.rep)
        .slice(0, n);
    const moved = [...take('MAR', 4), ...take('ALG', 3), ...take('TUN', 3)];
    for (const c of moved) c.league = 'NAF';
    d7.regionals = d7.regionals
      .map((a) => ({ ...a, clubs: a.clubs.filter((code) => !moved.some((m) => m.id === 'c_' + code)) }))
      .filter((a) => a.clubs.length >= 2);
    check(
      !WD.validate(d7, null).errors.length,
      'a cross-nation league was refused: ' + WD.validate(d7, null).errors.slice(0, 2),
    );
    const bad = JSON.parse(JSON.stringify(d7));
    bad.leagues.find((l) => l.id === 'NAF').nats = ['MAR'];
    check(
      WD.validate(bad, null).errors.some((e) => /listed once/.test(e)),
      'a league open to its own nation was accepted',
    );
    WD.useStatic(WD.patchOf(d7));
    W.newWorld(W.REAL_RULES);
    FM.Season.init();
    const naf = FM.S.comps.NAF,
      nats = naf.clubs.map((id) => FM.S.clubs[id].nat);
    check(
      naf.nats && naf.nats.length === 2 && nats.includes('ALG') && nats.includes('TUN') && nats.includes('MAR'),
      "the cross-nation league did not keep its clubs' nations",
    );
    const cup = Object.values(FM.S.comps).find((c) => c.type === 'cup' && c.nat === 'MAR');
    check(
      cup && FM.Cups.entrants(cup).filter((c) => c.comp === 'NAF').length === 4,
      'the Moroccan clubs of the cross-nation league are not in the Moroccan cup',
    );
    WD.useStatic(null);
    check(
      !D.LEAGUES.some((l) => l.id === 'NAF') && !Object.keys(D.CLUB_NAT).length,
      'the cross-nation league was not taken out again',
    );
  }
  // a schedule made by hand: a CSV round trip, bad rows refused, the world played to it
  {
    const d8 = WD.fromStatic({ name: 'Schedule test' }),
      lg = d8.leagues.find((x) => x.id === 'IE1'),
      ids = d8.clubs.filter((c) => c.league === 'IE1').map((c) => c.id);
    const rr = W.roundRobin(ids).slice().reverse();
    lg.rules = lg.rules || {};
    lg.rules.schedule = rr.flatMap((rd, i) => rd.map(([h, a]) => ({ round: i + 1, h, a })));
    check(!WD.validateSchedule(lg, d8).length, 'a complete schedule was refused');
    const csv = FM.CsvWorld.scheduleCsv(d8, 'IE1');
    delete lg.rules.schedule;
    const got = FM.CsvWorld.applySchedule(d8, csv, 'IE1');
    check(
      !got.errors.length && lg.rules.schedule.length === ids.length * (ids.length - 1),
      'the schedule CSV did not come back whole',
    );
    const nm = (id) => d8.clubs.find((c) => c.id === id).name;
    const keep = lg.rules.schedule;
    const bad = FM.CsvWorld.applySchedule(
      d8,
      `league,round,home,away\nIE1,1,${nm(ids[0])},${nm(ids[1])}\nIE1,1,${nm(ids[0])},${nm(ids[2])}\n`,
      'IE1',
    );
    check(
      bad.errors.length && lg.rules.schedule === keep,
      'a club twice on a matchday was accepted, or the old schedule was lost',
    );
    WD.useStatic(WD.patchOf(d8));
    W.newWorld(W.REAL_RULES);
    FM.Season.init();
    const first = rr[0]
      .map(([h, a]) => h + '>' + a)
      .sort()
      .join();
    check(
      FM.S.comps.IE1.fixtures[0]
        .map((f) => f.h + '>' + f.a)
        .sort()
        .join() === first,
      'the league did not play the schedule made by hand',
    );
    WD.useStatic(null);
  }
  console.log(fails.length ? 'FAIL\n' + fails.join('\n') : 'World definition: all checks passed.');
  process.exit(fails.length ? 1 : 0);
}
console.log('usage: node tools/worlddef.mjs --export f.json | --validate f.json | --test');
