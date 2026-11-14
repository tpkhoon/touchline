// Checks that a generated club's squad belongs to the league's nation: a league mix always has weight for its own nation (a mix of
// zeros once gave Japan's regional leagues Swedish squads), and in every league below the top flight, and at nearly every club, most
// players have the league's nationality or a name from its pool; no foreign nationality dominates a squad.
//   node tools/squadnations.mjs [--seed 7]
import { parseArgs, loadSim } from './harness.mjs';

const args = parseArgs();
const { FM } = loadSim(+(args.seed || 7), { getItem: () => null, setItem() {}, removeItem() {} });
const { W, D } = FM;
W.newWorld({ win: 3, subs: 5, foreignLimit: 6, twoLegs: true, awayGoals: false });
const S = FM.S;
const fails = [];

for (const l of D.LEAGUES) {
  const m = D.NAT_MIX[l.id];
  if (m && !(m[l.nat] > 0)) fails.push(`${l.id}: the mix has no weight for ${l.nat}`);
}

const leagues = {};
for (const c of Object.values(S.clubs)) {
  if (!c.comp || c.sim === 'nation' || c.parent || c.policy) continue;
  const comp = S.comps[c.comp];
  if (!comp || (comp.nats && comp.nats.length) || comp.nat !== c.nat) continue; // (a cross-nation league keeps its own mix)
  const sq = W.squad(c.id).filter((p) => !p.youth);
  if (sq.length < 8) continue;
  const lns = new Set(D.NATIONS[c.nat].ln),
    fns = new Set(D.NATIONS[c.nat].fn);
  const mine = sq.filter((p) => p.nat === c.nat || (lns.has(p.ln) && (!p.fn || fns.has(p.fn))));
  const byNat = {};
  for (const p of sq) if (p.nat !== c.nat) byNat[p.nat] = (byNat[p.nat] || 0) + 1;
  const [topNat, top] = Object.entries(byNat).sort((a, b) => b[1] - a[1])[0] || [null, 0];
  if (top / sq.length > 0.4) fails.push(`${c.name} (${c.nat}): ${top} of ${sq.length} are ${topNat}`);
  if (comp.tier >= 3 && mine.length / sq.length < 0.4)
    fails.push(
      `${c.name} (${c.nat}, tier ${comp.tier}): only ${mine.length} of ${sq.length} have a ${c.nat} nationality or name`,
    );
  const L = (leagues[c.comp] = leagues[c.comp] || { tier: comp.tier, n: 0, mine: 0 });
  L.n += sq.length;
  L.mine += mine.length;
}
for (const [id, L] of Object.entries(leagues)) {
  const need = L.tier >= 3 ? 0.7 : L.tier === 2 ? 0.6 : 0;
  if (L.n && L.mine / L.n < need)
    fails.push(
      `${id}: ${Math.round((100 * L.mine) / L.n)}% of its players are of the nation (at least ${need * 100}%)`,
    );
}

// a player with a family heritage has the passport or origin that goes with his name (a Saudi first name on a Swedish flag has a Saudi origin)
{
  const odd = Object.values(S.players).filter(
    (p) => p.heritage && !p.nat2 && !p.origins && !(p.cit && p.cit.length > 1),
  );
  const tot = Object.values(S.players).filter((p) => p.heritage).length;
  if (tot && odd.length / tot > 0.15)
    fails.push(`${odd.length} of ${tot} players of a heritage have no origin or second nation`);
}
// managers: mostly of the club's own nation (a small share of foreigners, fewer in the lower divisions)
{
  let n = 0,
    foreign = 0,
    lowN = 0,
    lowForeign = 0;
  for (const c of Object.values(S.clubs)) {
    const m = c.manager && S.staff[c.manager];
    if (!m || c.parent || c.sim === 'nation') continue;
    const tier = (S.comps[c.comp] || {}).tier || 1;
    n++;
    if (m.nat !== c.nat) foreign++;
    if (tier >= 3) {
      lowN++;
      if (m.nat !== c.nat) lowForeign++;
    }
  }
  if (foreign / n > 0.25) fails.push(`${Math.round((100 * foreign) / n)}% of managers are foreign (at most 25%)`);
  if (lowN && lowForeign / lowN > 0.15)
    fails.push(
      `${Math.round((100 * lowForeign) / lowN)}% of the managers below the second tier are foreign (at most 15%)`,
    );
}
// a ground opens on or after its club's founding; an old ground dated before it is put right
{
  let early = 0;
  for (const c of Object.values(S.clubs))
    if (c.stadium && c.founded && c.sim === 'full' && FM.Records.stadium(c).opened < c.founded) early++;
  if (early) fails.push(`${early} grounds opened before their club was founded`);
  const old = Object.values(S.clubs).find((c) => c.stadium && c.founded && c.founded > 1900);
  if (old) {
    old.stadium.opened = old.founded - 40;
    if (FM.Records.stadium(old).opened < old.founded) fails.push('a ground dated before its club is not put right');
  }
}
// the board asks for a derby result only where the rival is in the club's league or a cup it plays
{
  const asked = Object.values(S.clubs).filter((c) => {
    const r = c.rival && S.clubs[c.rival];
    return r && r.comp !== c.comp && (c.identity === 'giant' || c.identity === 'historic');
  });
  const rolled = asked.slice(0, 40).filter((c) => {
    try {
      return FM.Board.otherDemands(c).some((d) => d.id === 'derby');
    } catch (e) {
      return false;
    }
  });
  if (rolled.length) fails.push(`${rolled.length} clubs are asked to win a derby against a club of another division`);
}
// club text written for Europe is put in terms of the club's own continent
if (FM.Cups.regional('dreaming of European nights', 'JPN') !== 'dreaming of Asian nights')
  fails.push('regional text: a Japanese club dreams of European nights');
if (FM.Cups.regional('dreaming of European nights', 'ENG') !== 'dreaming of European nights')
  fails.push('regional text: an English club lost its European nights');

if (fails.length) {
  console.log(`FAIL (${fails.length})`);
  fails.slice(0, 60).forEach((f) => console.log('  ' + f));
  process.exit(1);
}
console.log(`ok: ${Object.keys(leagues).length} leagues checked`);
