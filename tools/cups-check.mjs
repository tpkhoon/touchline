// Checks the continental and regional cups: who enters each, their groups, and that each one plays out to a winner.
//   node tools/cups-check.mjs [--seasons 2] [--seed 7]
import { parseArgs, loadSim } from './harness.mjs';

const args = parseArgs();
const SEASONS = +(args.seasons || 2),
  SEED = +(args.seed || 7);
const store = {};
const { FM } = loadSim(SEED, {
  getItem: (k) => store[k] ?? null,
  setItem: (k, v) => {
    store[k] = String(v);
  },
  removeItem: (k) => {
    delete store[k];
  },
});
const W = FM.W,
  Sea = FM.Season;
const fails = [],
  checked = new Set();
const check = (ok, msg) => {
  if (!ok) fails.push(msg);
};

W.newWorld({ win: 3, subs: 5, foreignLimit: 6, twoLegs: true, awayGoals: false });
Sea.init();
W.takeCharge(Object.values(FM.S.clubs).find((c) => c.comp === 'D1' && c.rep < 75).id, 'Test Manager');
W.goUnemployed('test');

const NEW = ['N2', 'AA', 'CT', 'NR', 'HC', 'SM'];
// (the European knockout cups: the Holders' Cup takes each nation's cup winner, the Summer Cup eight clubs)
const WANT = { HC: [12, 24], SM: [8, 8] };
const report = (label) => {
  for (const id of NEW) {
    const c = FM.S.comps[id];
    check(!!c, `${label}: ${id} missing from the world`);
    if (!c) continue;
    const nats = {};
    (c.clubs || []).forEach((x) => (nats[FM.S.clubs[x].nat] = (nats[FM.S.clubs[x].nat] || 0) + 1));
    console.log(
      `${label} ${c.name}: ${(c.clubs || []).length} clubs, ${(c.groups || []).length} groups`,
      JSON.stringify(nats),
    );
    const n = (c.clubs || []).length,
      want = WANT[id];
    check(want ? n >= want[0] && n <= want[1] : [8, 16].includes(n), `${label}: ${id} has ${n} entrants`);
    check(n === new Set(c.clubs).size, `${label}: ${id} has a club twice`);
    // (the continental cups share no club; the Holders' Cup clubs may also be in the Shield or the Trophy)
    if (id !== 'HC' && id !== 'SM') {
      const seen = new Set();
      for (const other of W.continentals()) {
        if (other.id === id) continue;
        for (const x of c.clubs || []) if ((other.clubs || []).includes(x)) seen.add(x);
      }
      check(!seen.size, `${label}: ${id} shares ${seen.size} clubs with another continental cup`);
    }
  }
};
report('start');
for (let s = 0; s < SEASONS; s++) {
  const year = FM.S.year,
    won = {};
  let guard = 0;
  while (FM.S.year === year && guard++ < 400) {
    Sea.advance(null);
    for (const id of NEW) {
      const c = FM.S.comps[id];
      if (c && c.winner && !won[id]) won[id] = FM.S.clubs[c.winner].name;
    }
    // the Summer Cup's two finalists have the Trophy places it promised (its final comes before the group stage)
    {
      const sm = FM.S.comps.SM,
        uc = FM.S.comps.UC;
      if (sm && sm.winner && uc && !checked.has('SM' + year)) {
        checked.add('SM' + year);
        check(
          uc.clubs.includes(sm.winner) && uc.clubs.includes(sm.runnerUp),
          `season ${s + 1}: the Summer Cup finalists are not in the Trophy`,
        );
        check(uc.clubs.length === new Set(uc.clubs).size, `season ${s + 1}: the Trophy has a club twice`);
      }
    }
    // every group winner (and with up to four groups, every runner-up) reaches the quarter-finals or semi-finals
    for (const c of W.continentals()) {
      const first = c.groups.length >= 4 ? c.ko.qf : c.ko.sf;
      if (!first || !first.length || checked.has(c.id + year)) continue;
      checked.add(c.id + year);
      const inKO = new Set(first.flatMap((f) => [f.h, f.a]));
      c.groups.forEach((g) => {
        const t = FM.Cups.groupTable(g);
        check(inKO.has(t[0].id), `season ${s + 1}: ${c.id} group ${g.name} winner is not in the knockouts`);
        if (c.groups.length <= 4)
          check(inKO.has(t[1].id), `season ${s + 1}: ${c.id} group ${g.name} runner-up is not in the knockouts`);
      });
      check(
        inKO.size === (c.groups.length >= 4 ? 8 : 4),
        `season ${s + 1}: ${c.id} has ${inKO.size} knockout clubs from ${c.groups.length} groups`,
      );
    }
  }
  check(FM.S.year === year + 1, `season ${s + 1} never ended`);
  for (const id of NEW) {
    console.log(`season ${s + 1} ${FM.S.comps[id].name}: winner ${won[id] || 'none'}`);
    check(won[id], `season ${s + 1}: ${id} has no winner`);
  }
  report(`after season ${s + 1}`);
}
console.log(fails.length ? 'FAIL\n' + fails.join('\n') : 'cups check passed');
process.exit(fails.length ? 1 : 0);
