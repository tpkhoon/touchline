// The library of old saves and kept problem reports. A long career is what a player has most to lose, so every release keeps one
// save in the repo (tests/saves/), and every problem report that was turned into a fix is kept as a test case (tests/reports/).
// Each one must still open in the current version, pass the world checks, play a few days without a fault and survive a pack and
// unpack.
//   node tools/savelib.mjs [--days 5] [--only name]       test every file in tests/saves and tests/reports
//   node tools/savelib.mjs --snapshot [--seasons 1]        add a save made by this version (tests/saves/v<version>-save<format>.touchline)
//   node tools/savelib.mjs --add file.touchline [--name n] [--reports]   add a save, or with --reports a problem report, to the library
// A report keeps the note the player sent (its "report" section), so the file says what the bug was.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { parseArgs, loadSim, ROOT } from './harness.mjs';
import { attach } from './worldchecks.mjs';

export const SAVES = path.join(ROOT, 'tests', 'saves');
export const REPORTS = path.join(ROOT, 'tests', 'reports');
const read = (f) => {
  const buf = fs.readFileSync(f);
  try {
    return zlib.gunzipSync(buf).toString('utf8');
  } catch (e) {
    return buf.toString('utf8');
  }
};
const files = (dir) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => /\.(touchline|json)$/.test(f) && !f.endsWith('.meta.json'))
        .sort()
        .map((f) => path.join(dir, f))
    : [];

// One file: opens, upgrades, checks, plays days, round-trips. Returns { ok, problems, version, ... }
export function testFile(file, { days = 5 } = {}) {
  const problems = [];
  const info = { file: path.relative(ROOT, file), name: path.basename(file), bytes: fs.statSync(file).size };
  let text, parsed;
  try {
    text = read(file);
    parsed = JSON.parse(text);
  } catch (e) {
    return { ...info, ok: false, problems: ['is not a readable save: ' + e.message] };
  }
  info.report = parsed.report || null;
  delete parsed.report;
  info.version = parsed.version;
  info.year = parsed.year;
  const { ctx, FM } = loadSim(7);
  info.current = FM.SAVE_VERSION;
  if (parsed.version > FM.SAVE_VERSION) return { ...info, ok: false, problems: ['was made by a newer version'] };
  if (parsed.version < (FM.Save.OLDEST || 4))
    return { ...info, ok: false, problems: ['is older than the oldest version that is upgraded'] };
  const checks = attach(ctx);
  let state;
  const t0 = Date.now();
  try {
    state = FM.Save.unpack(parsed).state;
    FM.S = FM.Save.relink(state);
    FM.W.rosterVer++;
  } catch (e) {
    return {
      ...info,
      ok: false,
      problems: ['could not be opened: ' + (e.stack || e.message).split('\n').slice(0, 4).join(' | ')],
    };
  }
  info.openMs = Date.now() - t0;
  // a save made while a division's nationality mix was empty has its squads of one foreign nation made of the club's own (js/save.js)
  {
    const D = FM.D,
      S = FM.S,
      mixed = [];
    const by = {};
    for (const p of Object.values(S.players)) if (p.clubId && !p.retired) (by[p.clubId] = by[p.clubId] || []).push(p);
    for (const c of Object.values(S.clubs)) {
      const sq = by[c.id] || [];
      if (!D.BROKEN_MIX[c.comp] || c.policy || c.sim === 'nation' || sq.length < 8) continue;
      const n = {};
      for (const p of sq) if (p.nat !== c.nat) n[p.nat] = (n[p.nat] || 0) + 1;
      const top = Math.max(0, ...Object.values(n));
      if (top >= 0.4 * sq.length) mixed.push(c.name);
    }
    if (mixed.length)
      problems.push(
        `${mixed.length} squads are still of one foreign nation after the upgrade (${mixed.slice(0, 3).join(', ')})`,
      );
    if (FM.Save.repairSquadNations(S)) problems.push('the squad nationality repair is not idempotent');
  }
  const before = new Set(checks.failing().map((r) => r.id));
  for (const f of checks.failing())
    problems.push(
      `world check fails after the upgrade: ${f.label}${f.detail.length ? ' (' + f.detail.slice(0, 3).join('; ') + ')' : ''}`,
    );
  const { W, Season: Sea } = FM;
  let played = 0;
  try {
    for (let i = 0; i < days; i++) {
      const S = FM.S;
      const fx = Sea.userFixture();
      if (fx && S.user && !S.user.sacked) Sea.applyUserMatch(FM.quickSim(fx, !!fx.ko));
      Sea.advance(null);
      if (!W.employed() && S.user.offers && S.user.offers.length)
        W.takeCharge(S.user.offers[0].id, 'Library Manager', false);
      played++;
    }
  } catch (e) {
    problems.push(`fault on day ${played + 1}: ${(e.stack || e.message).split('\n').slice(0, 5).join(' | ')}`);
  }
  info.played = played;
  // the first day of a season puts a league preview, a pre-season note and a rumour in the feed (an employed manager of a league club)
  if (W.employed() && FM.S.comps[W.userClub().comp] && FM.S.comps[W.userClub().comp].type === 'league' && played > 0) {
    if (!FM.S.news.some((x) => / preview: /.test(x.title))) problems.push('no league preview in the feed');
  }
  // scouting: the unseen badge is the list's own count, and a finished watch leaves one report that is listed
  try {
    const S = FM.S,
      Sc = FM.Scouting;
    if (W.employed() && S.user.scouts && S.user.scouts.length) {
      const others = Object.values(S.players).filter((p) => p.clubId && !W.ownPlayer(p));
      const own = Object.values(S.players).find((p) => W.ownPlayer(p));
      S.user.reports = {};
      const before = Sc.unseen();
      S.user.reports[own.id] = { scout: S.user.scouts[0], err: 0, errP: 0, day: S.day, year: S.year, isNew: true };
      if (Sc.unseen() !== before) problems.push('a report on his own player is counted in the unseen badge');
      const target = others[0];
      Sc.assign(S.user.scouts[0], { type: 'player', pid: target.id });
      const a = S.user.assignments.find((x) => x.pid === target.id);
      for (let i = 0; i < 45 && FM.S.user.assignments.includes(a); i++) {
        const fx = FM.Season.userFixture();
        if (fx && !FM.S.user.sacked) FM.Season.applyUserMatch(FM.quickSim(fx, !!fx.ko));
        FM.Season.advance(null);
      }
      if (FM.S.user.assignments.includes(a)) problems.push('a watch of one player never finished');
      else if (!FM.S.user.reports[target.id] || !S.user.reports[target.id].isNew)
        problems.push('a finished watch left no new report');
      else if (Sc.unseen() !== before + 1) problems.push('a finished watch is not counted once in the unseen badge');
    }
  } catch (e) {
    problems.push('the scouting check failed: ' + e.message);
  }
  // every way of making an offer answers with a result that says something (never undefined), a player who has just moved is held with a
  // date and a reason, and after the hold the price carries the premium
  try {
    const S = FM.S,
      T = FM.Transfers,
      uc = W.userClub();
    if (W.employed() && uc) {
      const targets = Object.values(S.players)
        .filter((p) => p.clubId && !p.loan && !W.ownPlayer(p) && S.clubs[p.clubId].sim !== 'nation')
        .slice(0, 12);
      const was = uc.budget;
      uc.budget = 0;
      for (const p of targets)
        for (const [fee, wage] of [
          [0, 0],
          [1, 1],
          [T.userAsk(p), 1],
          [T.userAsk(p) * 3, 1e9],
        ]) {
          const r = T.offer(p.id, fee, wage);
          if (!r || typeof r !== 'object' || typeof r.msg !== 'string' || !r.msg)
            problems.push(`an offer for ${p.id} answered ${JSON.stringify(r)}`);
        }
      uc.budget = was;
      const q = targets.find((p) => p.clubId !== uc.id);
      delete q.settled;
      const base = T.userAsk(q);
      T.settle(q);
      if (!T.blockOf(q) || !/until/.test(T.blockOf(q)))
        problems.push('a player who has just moved is not held with a date');
      const wo = FM.Season.windowOpen;
      FM.Season.windowOpen = () => true; // (the hold is about the player: the test is made in any part of the season)
      const r = T.offer(q.id, 1e12, 1e9);
      FM.Season.windowOpen = wo;
      if (r.ok || !r.block) problems.push('an offer for a player who has just moved was not refused with a reason');
      q.movedDn -= 61;
      if (T.blockOf(q)) problems.push('the hold on a recent move does not lift after 60 days');
      if (T.userAsk(q) < base * 1.3) problems.push('after the hold a recent signing does not cost a premium');
    }
  } catch (e) {
    problems.push('the offer check failed: ' + e.message);
  }
  // the window speaks in dates from the calendar, and a bid still open when it closes is void (nothing completes after the deadline)
  try {
    const S = FM.S,
      M = FM.Market,
      w = M.windowInfo();
    if (!/\d/.test(w.text) && w.text.indexOf('Opens again') < 0)
      problems.push(`the window text has no date: ${w.text}`);
    if (W.employed() && W.userClub()) {
      const mine = W.squad(W.userClub().id).find((p) => W.ownPlayer(p)),
        buyer = Object.values(S.clubs).find((c) => c.id !== W.userClub().id && c.comp && c.sim !== 'nation');
      const n = FM.News.add({
        type: 'bid',
        title: 'late bid',
        body: '',
        pid: mine.id,
        clubId: buyer.id,
        data: { pid: mine.id, from: buyer.id, fee: 1e6, max: 2e6, status: 'open', rounds: 0 },
      });
      const wo = FM.Season.windowOpen;
      FM.Season.windowOpen = () => false;
      const r = FM.Transfers.respondBid(n, true);
      FM.Season.windowOpen = wo;
      if (n.data.status === 'accepted' || mine.clubId === buyer.id)
        problems.push('a bid answered after the window closed went through');
      if (typeof r !== 'string' && !(r && r.msg))
        problems.push('a bid answered after the window closed gave no answer');
    }
  } catch (e) {
    problems.push('the window check failed: ' + e.message);
  }
  // international football as a world sets it: the Himalaya Cup, competitions turned off, Nations Leagues of several confederations and with
  // tiers of the world's own size, and the ways of drawing groups
  try {
    const I = FM.Intl,
      S = FM.S,
      hid = I.INVITES.find((v) => v.id === 'HIM');
    if (!hid || I.invitePool(hid).length !== 10)
      problems.push('the Himalaya Cup is not in the game with its ten nations');
    else if (!hid.pool.every((c) => FM.D.NATIONS[c])) problems.push('a nation of the Himalaya Cup is not in the game');
    else {
      // (a world from an older build has fewer national teams: the rest are made up for the check, as clones of one, and taken out again)
      const proto = Object.values(S.nteams)[0],
        made = [];
      hid.pool.forEach((c, i) => {
        if (!Object.values(S.nteams).some((x) => x.code === c)) {
          S.nteams['n_' + c] = { ...proto, id: 'n_' + c, code: c, coef: 30 + i };
          made.push('n_' + c);
        }
      });
      const saved = I.INVITES.slice(),
        nowY = S.year;
      I.INVITES.splice(0, I.INVITES.length, hid);
      S.year = 0; // (the cup in turn: the only one there is)
      const inv = I.planInvite(0, new Set());
      I.INVITES.splice(0, I.INVITES.length, ...saved);
      S.year = nowY;
      const codes = inv && inv.teams.map((id) => S.nteams[id].code);
      if (!inv || inv.teams.length !== 4 || !codes.every((c) => hid.pool.includes(c)))
        problems.push('the Himalaya Cup is not played by four of its nations');
      made.forEach((id) => delete S.nteams[id]);
    }
    const oldYear = I.nlYear,
      oldCfg = I.NLCFG,
      oldOff = { ...I.OFF };
    I.nlYear = () => true;
    I.NLCFG = {
      confeds: { 'ASIA+OFC': { group: 3, groups: 2, leagues: 2 }, EUR: { on: false } },
      links: [['ASIA', 'OFC']],
    };
    const nl = I.nlBuild();
    I.nlYear = oldYear;
    I.NLCFG = oldCfg;
    if (!nl || !nl.confeds['ASIA+OFC']) problems.push('two confederations did not make one Nations League');
    else {
      const c = nl.confeds['ASIA+OFC'];
      if (c.leagues.length > 2) problems.push(`a Nations League set to two tiers has ${c.leagues.length}`);
      if (c.leagues.some((lg) => lg.groups.some((g) => g.teams.length > 4)))
        problems.push('a Nations League group is bigger than the set size allows');
      const regions = new Set(
        c.leagues.flatMap((lg) => lg.groups.flatMap((g) => g.teams.map((id) => I.region(S.nteams[id].code)))),
      );
      if (!(regions.has('ASIA') && regions.has('OFC')))
        problems.push('the combined Nations League has nations of only one confederation');
    }
    if (nl && nl.confeds.EUR) problems.push('a confederation turned off still plays a Nations League');
    I.OFF.world = true;
    if (I.heldIn('world', 2026) || I.heldIn('world', 2028) || I.heldIn('world', 2030))
      problems.push('a tournament turned off is still played');
    I.OFF.nl = true;
    if (I.nlYear(2027)) problems.push('a Nations League turned off is still played');
    for (const k of Object.keys(I.OFF)) delete I.OFF[k];
    Object.assign(I.OFF, oldOff);
    const eight = Object.values(S.nteams).slice(0, 16);
    for (const m of I.DRAW_METHODS) {
      const d = I.draw(eight, [], false, m);
      const all = d.groups.flat();
      if (d.groups.length !== 4 || new Set(all).size !== 16)
        problems.push(`the ${m} draw did not make four groups of sixteen distinct teams`);
    }
  } catch (e) {
    problems.push('the international check failed: ' + e.message);
  }
  // the interview before a job: answers that fit the club impress the board and add trust and budget; answers against its grain leave a
  // doubtful board with less of both; nobody is turned away
  try {
    const S = FM.S,
      Pe = FM.People,
      c = Object.values(S.clubs).find((x) => x.comp && x.sim !== 'nation' && !x.parent && x.id !== S.user.clubId);
    const saved = c.identity,
      rep = S.user.rep;
    S.user.rep = Math.max(S.user.rep, c.rep);
    c.identity = 'oil';
    const good = Pe.interviewResult(c, { plan: 'ambitious', money: 'spend', style: 'attack' });
    c.identity = 'fan';
    const bad = Pe.interviewResult(c, { plan: 'ambitious', money: 'spend', style: 'solid' });
    c.identity = saved;
    S.user.rep = rep;
    if (
      good.outcome !== 'impressed' ||
      bad.outcome !== 'doubtful' ||
      good.trust <= bad.trust ||
      good.budget <= bad.budget
    )
      problems.push(`the interview does not tell fitting answers from poor ones (${good.outcome}, ${bad.outcome})`);
    const conf = c.boardConf,
      bud = c.budget;
    Pe.interviewApply(c, bad);
    if (!(c.boardConf < conf) || !(c.budget <= bud))
      problems.push('a doubtful interview leaves the club trust and budget as they were');
    c.boardConf = conf;
    c.budget = bud;
  } catch (e) {
    problems.push('the interview check failed: ' + e.message);
  }
  // a cup with replays: a tie level after ninety minutes is replayed with the grounds swapped, and the replay decides it
  try {
    const S = FM.S,
      cup = Object.values(S.comps).find((c) => c.type === 'cup' && !c.euro && c.clubs && c.clubs.length > 4);
    if (cup) {
      const [h, a] = cup.clubs,
        was = cup.opts,
        onRes = FM.Cups.onResult;
      cup.opts = { legs: [], neutral: [2], replay: true };
      FM.Cups.onResult = () => {};
      let drew = null;
      for (let i = 0; i < 300 && !drew; i++) {
        const fx = { id: 'f_replay_test', comp: cup.id, h, a, res: null, ko: true, n: 8, po: 'Round of 8' };
        const m = FM.quickSim(fx, true);
        if (m.result().hg === m.result().ag && !m.result().pens) drew = { fx, m };
      }
      if (!drew) problems.push('a cup tie with replays was never left level after ninety minutes');
      else {
        FM.Season.apply(drew.fx, drew.m);
        const r = drew.fx.res;
        if (!r.replay || r.replay.h !== a || r.replay.a !== h)
          problems.push('a drawn tie of a cup with replays was not replayed with the grounds swapped');
        if (!(r.win === 0 || r.win === 1) || ![h, a].includes(FM.Season.winnerOf(drew.fx)))
          problems.push('the replay did not decide the tie');
        const fx2 = { id: 'f_noreplay_test', comp: cup.id, h, a, res: null, ko: true, n: 8 };
        cup.opts = { legs: [], neutral: [2] };
        let decided = false;
        for (let i = 0; i < 300 && !decided; i++) {
          const m = FM.quickSim(fx2, true);
          if (m.result().hg === m.result().ag) decided = !!m.result().pens;
        }
        if (!decided) problems.push('a cup without replays does not settle a level tie on penalties');
      }
      cup.opts = was;
      if (was === undefined) delete cup.opts;
      FM.Cups.onResult = onRes;
    }
  } catch (e) {
    problems.push('the replay check failed: ' + e.message);
  }
  // a manager in a job is paid a little each day, and what he has kept shows
  if (W.employed() && played > 0 && !(FM.S.user.savings > 0))
    problems.push('a manager in a job has kept nothing of his pay');
  // an offer left unanswered lapses with a line in the feed (it is not found gone), and the head physio's decision is his, not the manager's
  try {
    const S = FM.S,
      uc = W.userClub();
    if (uc && !S.user.sacked) {
      const mine = W.squad(uc.id).find((p) => W.ownPlayer(p)),
        buyer = Object.values(S.clubs).find((c) => c.id !== uc.id && c.comp && c.sim !== 'nation');
      FM.News.add({
        type: 'bid',
        title: 'test bid',
        body: '',
        pid: mine.id,
        clubId: buyer.id,
        data: { pid: mine.id, from: buyer.id, fee: 1e6, status: 'open', max: 1e6, rounds: 0 },
      });
      FM.Market.BID_DAYS = 0;
      FM.Market.expireBids();
      const n = S.news.find((x) => x.title === 'test bid');
      if (n.data.status !== 'expired') problems.push('an unanswered bid did not lapse');
      if (!S.news.some((x) => /lapsed$/.test(x.title) && x.pid === mine.id))
        problems.push('a lapsed bid left no line in the feed');
      FM.News.add({
        type: 'medical',
        title: 'test medical',
        body: '',
        pid: mine.id,
        clubId: uc.id,
        choices: [{ k: 'rehab', label: 'Rehab' }],
        rec: 0,
      });
      FM.Injury.expireDecisions(true);
      const m = S.news.find((x) => x.title === 'test medical');
      if (m.resolved && m.handledBy !== 'physio')
        problems.push("the head physio's decision is recorded as the manager's");
    }
  } catch (e) {
    problems.push('the lapse check failed: ' + e.message);
  }
  for (const f of checks.failing())
    if (!before.has(f.id)) problems.push(`world check fails after ${played} days: ${f.label}`);
  try {
    const again = FM.Save.unpack(FM.Save.pack(FM.S), { world: true }).state;
    if (
      Object.keys(again.players).length !== Object.keys(FM.S.players).length ||
      again.year !== FM.S.year ||
      again.day !== FM.S.day
    )
      problems.push('is not the same world after a pack and unpack');
  } catch (e) {
    problems.push('could not be packed and opened again: ' + e.message);
  }
  return { ...info, ok: !problems.length, problems };
}

// A world made while Japan's (and some eighty other) lower divisions had an empty nationality mix: squads of one foreign nation.
// The mix is made by hand here the way the old build left it, and the save must come back with the clubs' own nations and names.
export function testSquadNationRepair() {
  const problems = [];
  const { FM } = loadSim(7);
  const { W, D } = FM;
  W.newWorld({ win: 3, subs: 5, foreignLimit: 6, twoLegs: true, awayGoals: false });
  const clubs = Object.values(FM.S.clubs).filter((c) => D.BROKEN_MIX[c.comp] && c.sim !== 'nation' && !c.policy);
  if (!clubs.length) return ['no club in a league that had a broken mix'];
  const hit = clubs.slice(0, 12);
  const old = {};
  for (const c of hit)
    for (const p of W.squad(c.id)) {
      const nm = W.rollName('SWE', null, p.born);
      old[p.id] = { id: p.id, ca: p.ca, fn: nm.fn, ln: nm.ln };
      Object.assign(p, { nat: 'SWE', nat2: null, fn: nm.fn, ln: nm.ln });
      delete p.heritage;
    }
  const state = FM.Save.unpack(FM.Save.pack(FM.S), { world: true }).state;
  for (const c of hit) {
    const sq = Object.values(state.players).filter((p) => p.clubId === c.id && !p.retired);
    const home = sq.filter((p) => p.nat === c.nat).length;
    if (home < 0.8 * sq.length) problems.push(`${c.name}: ${home} of ${sq.length} are ${c.nat} after the upgrade`);
    for (const p of sq) {
      if (p.nat === 'SWE') problems.push(`${c.name}: ${p.fn} ${p.ln} is still Swedish`);
      if (old[p.id] && old[p.id].ca !== p.ca) problems.push(`${p.fn} ${p.ln}: his ability changed`);
      if (old[p.id] && p.nat === c.nat && `${p.fn} ${p.ln}` === `${old[p.id].fn} ${old[p.id].ln}`)
        problems.push(`${c.name}: ${p.fn} ${p.ln} kept his old name`);
    }
  }
  if (FM.Save.repairSquadNations(state)) problems.push('the repair is not idempotent');
  return problems.slice(0, 10);
}

// A career that starts with no club, in a world where every league is Minimal (the least a world can hold): it is saved, opened and played
// through its first weeks without a fault, and over those weeks offers come to a manager of modest name (an out-of-work career had no way
// back into the game once). Every day the sim runs is in this test: a skip that goes round without end is caught by the harness's cap.
export function testNoClubCareer({ days = 45, minOffers = 2 } = {}) {
  const problems = [];
  const { FM } = loadSim(7);
  const { W, D, Season: Sea } = FM;
  try {
    const sims = Object.fromEntries(D.LEAGUES.map((l) => [l.id, 'minimal']));
    W.newWorld({ ...W.REAL_RULES, sims });
    Sea.init();
    W.newManager({ fn: 'Test', ln: 'Manager', nat: 'ENG', avatar: 0 }, 38, 'ENG');
    if (!FM.S.staffPool) W.refreshStaffPool();
    W.goUnemployed('start');
    const { state } = FM.Save.unpack(FM.Save.pack(FM.S));
    if (state.user.clubId !== null) problems.push('a career with no club does not open as one');
    FM.S = FM.Save.relink(state);
    FM.W.rosterVer++;
    const seen = new Set((FM.S.user.offers || []).map((o) => o.id));
    let waited = 0,
      guard = 0;
    while (waited < days && guard++ < 60) {
      const r = Sea.skipToMatch();
      waited += Math.max(1, r.n);
      for (const o of FM.S.user.offers || []) seen.add(o.id);
      if (r.summary) break;
    }
    if (seen.size < minOffers) problems.push(`${seen.size} job offers in ${waited} days (at least ${minOffers})`);
  } catch (e) {
    problems.push(
      'a career with no club failed: ' + (e.stack || e.message).split(String.fromCharCode(10)).slice(0, 4).join(' | '),
    );
  }
  return problems;
}

export function list() {
  return [
    ...files(SAVES).map((f) => ({ kind: 'release', file: f })),
    ...files(REPORTS).map((f) => ({ kind: 'report', file: f })),
  ];
}

// ---------- Command line ----------
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  const args = parseArgs();
  if ('snapshot' in args) {
    const { FM } = loadSim(7);
    const { W, Season: Sea } = FM;
    W.newWorld(W.REAL_RULES);
    Sea.init();
    W.takeCharge(Object.values(FM.S.clubs).find((c) => c.comp === 'D1' && c.rep < 70).id, 'Library Manager');
    const seasons = +(args.seasons || 1);
    const start = FM.S.year;
    let guard = 2000;
    // a career that has been going a while: the seasons asked for, and a few weeks of the next
    while (guard-- > 0 && (FM.S.year < start + seasons || FM.S.day < 40)) {
      const fx = Sea.userFixture();
      if (fx && !FM.S.user.sacked) Sea.applyUserMatch(FM.quickSim(fx, !!fx.ko));
      Sea.advance(null);
      if (!W.employed() && FM.S.user.offers && FM.S.user.offers.length)
        W.takeCharge(FM.S.user.offers[0].id, 'Library Manager', false);
    }
    fs.mkdirSync(SAVES, { recursive: true });
    const name = `v${FM.VERSION}-save${FM.SAVE_VERSION}.touchline`;
    const out = path.join(SAVES, name);
    fs.writeFileSync(out, zlib.gzipSync(Buffer.from(FM.Save.pack(FM.S), 'utf8'), { level: 9 }));
    console.log(
      `Added ${path.relative(ROOT, out)} (${(fs.statSync(out).size / 1048576).toFixed(1)} MB): season ${FM.S.year}, day ${FM.S.day}, ${seasons} season${seasons === 1 ? '' : 's'} played`,
    );
    process.exit(0);
  }
  if (args.add) {
    const src = String(args.add).trim();
    if (!fs.existsSync(src)) {
      console.error('No such file: ' + src);
      process.exit(1);
    }
    const dir = 'reports' in args ? REPORTS : SAVES;
    fs.mkdirSync(dir, { recursive: true });
    const t = testFile(src, { days: 0 });
    const name =
      String(args.name || '').replace(/[^\w.-]/g, '') ||
      `${'reports' in args ? 'report' : 'v'}${t.version ?? 'x'}-${path.basename(src).replace(/\.[^.]+$/, '')}`;
    const out = path.join(dir, name.replace(/\.touchline$/, '') + '.touchline');
    fs.copyFileSync(src, out);
    console.log(`Added ${path.relative(ROOT, out)}`);
    process.exit(0);
  }
  const repair = testSquadNationRepair();
  console.log(`${repair.length ? '✗' : '✓'} Squads of one foreign nation are repaired on load`);
  repair.forEach((p) => console.log('    ' + p));
  const noClub = 'noclub' in args || !args.only ? testNoClubCareer() : [];
  console.log(`${noClub.length ? '✗' : '✓'} A career with no club opens, plays and gets offers (every league Minimal)`);
  noClub.forEach((p) => console.log('    ' + p));
  repair.push(...noClub);
  const all = list().filter((x) => !args.only || x.file.includes(String(args.only)));
  if (!all.length) {
    console.log(
      "The library is empty: add this version's save with --snapshot (and reports from the dashboard's Reports tab).",
    );
    console.log('· Saves in the library   0   real 1–');
    process.exit(1);
  }
  let good = 0;
  for (const x of all) {
    const r = testFile(x.file, { days: +(args.days || 5) });
    if (r.ok) good++;
    console.log(
      `${r.ok ? '✓' : '✗'} ${r.name} (${x.kind}; format ${r.version ?? '?'} → ${r.current ?? '?'}, ${(r.bytes / 1048576).toFixed(1)} MB${r.played != null ? `, ${r.played} days played` : ''})${
        r.report && r.report.note ? `\n    report: ${String(r.report.note).split('\n')[0].slice(0, 120)}` : ''
      }`,
    );
    for (const p of r.problems) console.log(`    ${p}`);
  }
  console.log(`\n${good}/${all.length} saves open and play on`);
  console.log(`${good === all.length ? '✓' : '✗'} Saves that open and play on   ${good}   real ${all.length}–`);
  console.log(`· Saves in the library   ${all.length}   real 1–`);
  if (good === all.length && !repair.length) console.log('All checks passed');
  process.exit(good === all.length && !repair.length ? 0 : 1);
}
