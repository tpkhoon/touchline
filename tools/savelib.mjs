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
