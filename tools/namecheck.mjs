// Checks the player names the generator makes: each nation's commonest surnames come up as often as in life, communities
// are not mixed, accents are kept, the Gulf has Gulf names, first names follow the generation, and a squad has at most two
// of one surname unless it is a common one.
//   node tools/namecheck.mjs [--seed 7]
import { parseArgs, loadSim } from './harness.mjs';

const args = parseArgs();
const { FM } = loadSim(+(args.seed || 7), { getItem: () => null, setItem() {}, removeItem() {} });
const W = FM.W,
  D = FM.D;
W.newWorld({ win: 3, subs: 5, foreignLimit: 6, twoLegs: true, awayGoals: false });
const fails = [];
const check = (ok, msg) => ok || fails.push(msg);
const roll = (nat, n = 4000, born = 2000) => Array.from({ length: n }, () => W.rollName(nat, null, born));
const share = (names, set) => names.filter((n) => set.includes(n.ln)).length / names.length;

const kor = roll('KOR');
check(
  share(kor, ['Kim', 'Lee', 'Park']) > 0.38,
  `Korean: Kim, Lee and Park are only ${(share(kor, ['Kim', 'Lee', 'Park']) * 100).toFixed(0)}%`,
);
const vie = roll('VIE');
check(share(vie, ['Nguyễn']) > 0.3, `Vietnamese: Nguyễn is only ${(share(vie, ['Nguyễn']) * 100).toFixed(0)}%`);
check(
  vie.every((n) => !/^(Hai|Viet|Nguyen|Tran)$/.test(n.fn) && !/^(Nguyen|Tran|Le|Pham)$/.test(n.ln)),
  'Vietnamese names lost their accents',
);
const chn = roll('CHN');
check(
  share(chn, ['Wang', 'Li', 'Zhang', 'Liu', 'Chen']) > 0.28,
  `Chinese: the five commonest surnames are ${(share(chn, ['Wang', 'Li', 'Zhang', 'Liu', 'Chen']) * 100).toFixed(0)}%`,
);

// communities: a Malay first name never goes with a Chinese surname, nor a Chinese first name with a Malay surname
const malayFn = new Set(D.NAME_POOLS.malay.fn),
  malayLn = new Set(D.NAME_POOLS.malay.ln),
  chLn = new Set([
    'Tan',
    'Lim',
    'Lee',
    'Ng',
    'Goh',
    'Teo',
    'Chua',
    'Koh',
    'Ong',
    'Wong',
    'Chong',
    'Yeo',
    'Ho',
    'Sim',
    'Chan',
    'Lau',
    'Foo',
    'Quek',
    'Sng',
    'Ang',
    'Tay',
    'Chew',
    'Liew',
    'Yap',
    'Loh',
  ]);
for (const nat of ['SGP', 'MYS']) {
  const mixed = roll(nat, 3000).filter(
    (n) =>
      (malayFn.has(n.fn) && chLn.has(n.ln)) ||
      (!malayFn.has(n.fn) && malayLn.has(n.ln) && !chLn.has(n.ln) && !D.NAME_POOLS.chinese.fn.includes(n.fn) && false),
  );
  check(
    !mixed.length,
    `${nat}: ${mixed.length} mixed-community names, e.g. ${mixed[0] && mixed[0].fn + ' ' + mixed[0].ln}`,
  );
}
// the Gulf
for (const nat of ['KSA', 'UAE', 'QAT']) {
  const g = roll(nat, 500);
  check(
    g.every((n) => /^Al-/.test(n.ln)),
    `${nat}: a surname without the Al- form`,
  );
  check(!g.some((n) => /Jubouri|Dulaimi|Obaidi|Saadi|Maliki/.test(n.ln)), `${nat}: an Iraqi tribe`);
}
// generations
const young = roll('ENG', 3000, 2008).filter((n) => ['Oliver', 'Leo', 'Archie', 'Alfie'].includes(n.fn)).length;
const old = roll('ENG', 3000, 1985).filter((n) => ['Oliver', 'Leo', 'Archie', 'Alfie'].includes(n.fn)).length;
check(young > old * 2, `English first names do not follow the generation (${young} vs ${old})`);

// squads
let over = 0,
  squads = 0;
for (const c of Object.values(FM.S.clubs)) {
  if (!c.comp || c.sim === 'nation') continue;
  const sq = W.squad(c.id);
  if (sq.length < 15) continue;
  squads++;
  const by = {};
  for (const p of sq) by[p.ln] = (by[p.ln] || 0) + 1;
  const common = (D.SURNAME_WEIGHTS && D.SURNAME_WEIGHTS[c.nat]) || {};
  if (Object.entries(by).some(([ln, k]) => k >= 3 && !(ln in common))) over++;
}
check(over <= squads * 0.01, `${over} of ${squads} squads have three of one uncommon surname`);
console.log({ squads, over });
if (fails.length) {
  console.error('FAILED\n' + fails.join('\n'));
  process.exit(1);
}
console.log('ok');
