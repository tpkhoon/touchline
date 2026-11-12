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
const WANT = { HC: [12, 60], SM: [8, 8] };
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
    check(want ? n >= want[0] && n <= want[1] : n >= 8 && n <= 20, `${label}: ${id} has ${n} entrants`);
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
// the three European cups play the 36-club league phase (a smaller field, down to 24 clubs, makes a smaller table)
for (const id of ['CC', 'EL', 'UC']) {
  const c = FM.S.comps[id];
  console.log(
    `start ${c.name}: ${c.clubs.length} clubs direct${c.qual ? ` + ${c.qual.places} from qualifying` : ''}, league phase of ${c.lp ? c.lp.N : 'none'}`,
  );
  check(!!c.lp && c.lp.N >= 24, `start: ${id} has no league phase`);
}
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
    // the qualifying rounds of the main cups: the places in the groups go to the clubs that came through, nobody who went out is in the
    // groups, no club is in two cups, and every tie of the rounds was played
    for (const c of W.continentals()) {
      if (!c.qual || !c.qual.drawn || checked.has('Q' + c.id + year)) continue;
      checked.add('Q' + c.id + year);
      const inGroups = new Set(c.groups.flatMap((g) => g.clubs)),
        ties = FM.Cups.qualList(c);
      check(
        c.qual.through.length === c.qual.places && c.qual.through.every((id) => inGroups.has(id)),
        `season ${s + 1}: ${c.id} qualifying sent ${c.qual.through.length} of ${c.qual.places} places to the groups`,
      );
      check(
        ties.length > 0 && ties.every((f) => f.res),
        `season ${s + 1}: ${c.id} has a qualifying tie that was not played`,
      );
      check(
        inGroups.size === c.clubs.length && c.clubs.length % (c.qual.GS || 4) === 0,
        `season ${s + 1}: ${c.id} has ${c.clubs.length} clubs for ${c.groups.length} groups`,
      );
      const elsewhere = W.continentals().filter(
        (x) => x !== c && c.qual.pool.some((id) => (x.clubs || []).includes(id)),
      );
      check(!elsewhere.length, `season ${s + 1}: a ${c.id} qualifier is also in ${elsewhere.map((x) => x.id)}`);
    }
    // every group winner (and with up to four groups, every runner-up) reaches the quarter-finals or semi-finals
    // the league phase of the European cups: one table, every club played its matches, the top eight and the play-off's winners
    // make the round of 16, and the play-off was ninth to 24th
    for (const c of W.continentals()) {
      if (!c.lp || !c.ko.qf || !c.ko.qf.length || checked.has('L' + c.id + year)) continue;
      checked.add('L' + c.id + year);
      const g = c.groups[0],
        t = FM.Cups.groupTable(g).map((r) => r.id),
        ids = (list) => new Set(list.flatMap((f) => [f.h, f.a])),
        r16 = ids(c.ko.r16),
        pp = ids(c.ko.pp);
      const tag = `season ${s + 1}: ${c.id} league phase`;
      check(g.clubs.length === c.lp.N && t.length === c.lp.N, `${tag} has ${t.length} clubs, not ${c.lp.N}`);
      check(
        t.every((id) => g.table[id].p === c.lp.M),
        `${tag}: a club did not play ${c.lp.M} matches`,
      );
      check(
        r16.size === 16 && t.slice(0, 8).every((id) => r16.has(id)),
        `${tag}: the top eight are not in the round of 16`,
      );
      check(pp.size === 16 && t.slice(8, 24).every((id) => pp.has(id)), `${tag}: the play-off is not ninth to 24th`);
      check(ids(c.ko.qf).size === 8, `${tag}: the quarter-finals do not have eight clubs`);
    }
    for (const c of W.continentals()) {
      if (c.lp) continue;
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
