// The world checks of the in-game developer panel (Dev.invariants in js/devtools.js), run headlessly on a world that is
// loaded in a harness context, plus a few that only matter over a long run. Used by the problem-report inspector, the
// first-bad-day finder and the save library, so the same list of checks answers "is this world sound?" everywhere.
//
//   import { attach } from './worldchecks.mjs';
//   const checks = attach(ctx);            // ctx from loadSim()
//   checks.run(FM.S)                       // [{ id, label, ok, detail }]  (the panel's checks and the long-run ones)
//   checks.failing(FM.S)                   // only those that fail
//   checks.firstBad(play, opts)            // play day by day until a check fails
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { ROOT } from './harness.mjs';

export function attach(ctx) {
  const FM = ctx.FM;
  // The panel file is browser code; it only needs a place to hang its buttons. Loaded once per context.
  if (!FM.Dev) {
    const stub = !FM.UI;
    if (stub) FM.UI = { acts: {}, screens: {} };
    vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/devtools.js'), 'utf8'), ctx, { filename: 'devtools.js' });
    if (stub) delete FM.UI;
  }
  const { W, D } = FM;
  const slug = (t) =>
    t
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  // Checks that the panel does not have: they cost more, or only a long run breaks them
  const extra = (s) => {
    const out = [];
    const chk = (label, bad, detail) => out.push({ id: slug(label), label, ok: !bad.length, detail: detail(bad) });
    const players = Object.values(s.players).filter((p) => !p.retired);
    chk(
      'every attribute is a number from 1 to 20',
      players.filter((p) => D.ATTRS.some((k) => !(p.attrs[k] >= 1 && p.attrs[k] <= 20.5))),
      (b) => b.slice(0, 5).map((p) => `${W.name(p)} (${p.id})`),
    );
    chk(
      'nobody still plays at 41 or more',
      players.filter((p) => p.clubId && W.age(p) >= 41),
      (b) => b.slice(0, 5).map((p) => `${W.name(p)} (${W.age(p)})`),
    );
    chk(
      'every full club has a legal side and bench',
      Object.values(s.clubs).filter((c) => {
        if (c.sim !== 'full') return false;
        const sq = W.squad(c.id);
        const { xi, bench } = W.pickXI(c.id, W.isUser(c.id) ? s.user.tactic : c.tactic || W.aiTactic(c));
        return (
          !(xi.length === 11 && xi.every(Boolean)) || bench.length < 3 || sq.filter((p) => p.pos === 'GK').length < 2
        );
      }),
      (b) => b.slice(0, 5).map((c) => c.name),
    );
    chk(
      'no club is in impossible debt',
      Object.values(s.clubs).filter((c) => c.sim === 'full' && c.balance < -8 * FM.Season.revenuePotential(c) - 5e7),
      (b) => b.slice(0, 5).map((c) => `${c.name}: ${Math.round(c.balance)}`),
    );
    chk(
      'no player has a contract that ended and no loan',
      players.filter((p) => p.clubId && p.contract < s.year - 1 && !p.loan),
      (b) => b.slice(0, 5).map((p) => `${W.name(p)}: ${p.contract}`),
    );
    return out;
  };

  const run = (s = FM.S) => {
    const rows = FM.Dev.invariants(s).map(([label, ok]) => ({ id: slug(label), label, ok, detail: [] }));
    return rows.concat(extra(s));
  };
  const failing = (s = FM.S) => run(s).filter((r) => !r.ok);

  // Play until a check fails. play() advances the world one day (the caller knows how: a user match is played, an offer taken);
  // opts: { check: id | 'any', maxDays, every }. Returns { found, day, year, days, failing, played } with the world left on
  // the day it failed, so it can be looked at (and written out) from there.
  function firstBad(play, { check = 'any', maxDays = 400, every = 1, onDay } = {}) {
    const S = () => FM.S;
    const bad = () => {
      const f = failing(S());
      return check === 'any' ? f : f.filter((r) => r.id === check);
    };
    const start = bad();
    // (a check that already fails on the first day is not a day that broke it)
    const already = new Set(start.map((r) => r.id));
    let played = 0;
    const t0 = Date.now();
    while (played < maxDays) {
      play();
      played++;
      if (onDay) onDay(played, S());
      if (played % every === 0) {
        const f = bad().filter((r) => !already.has(r.id));
        if (f.length) return { found: true, year: S().year, day: S().day, played, failing: f, ms: Date.now() - t0 };
      }
    }
    return { found: false, played, failing: [], already: [...already], ms: Date.now() - t0 };
  }
  return { run, failing, firstBad, ids: () => run(FM.S).map((r) => ({ id: r.id, label: r.label })) };
}
