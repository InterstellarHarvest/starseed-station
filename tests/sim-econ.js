/* Starseed Station — economy simulator (no browser).
   Run:  node tests/sim-econ.js [runs]
   Models the food economy of a run under four player profiles and prints the
   win rate per posting. It is a MODEL of the rules, kept deliberately small:
     food(end) = start − actions + Σ yield,   yield = 10 × pips/5 × poll × light
   Costs: 3 grow actions per batch (substrate/water/light, batches of up to 8/4/9),
   1 pollination session, optional boost rooms. Failure odds per room are the
   profile. Re-run this when quotas, pip costs or base yield change. */
const DIFF = { cadet: { food: 95, quota: 120 }, commander: { food: 80, quota: 110 }, specialist: { food: 60, quota: 110, storms: true } };
const PROFILES = {
  perfect: { substrateStress: 0,    waterFar: 0,    waterNear: 0,   specWrong: 0,    photoMiss: 0,   photoNear: 0,   pollMiss: 0,    boosts: 0, boostFail: 0,   stormShield: 1 },
  good:    { substrateStress: 0.05, waterFar: 0.05, waterNear: 0.2, specWrong: 0.05, photoMiss: 0.1, photoNear: 0.2, pollMiss: 0.05, boosts: 1, boostFail: 0.2, stormShield: 0.75 },
  typical: { substrateStress: 0.15, waterFar: 0.15, waterNear: 0.3, specWrong: 0.2,  photoMiss: 0.3, photoNear: 0.3, pollMiss: 0.15, boosts: 2, boostFail: 0.4, stormShield: 0.5 },
  sloppy:  { substrateStress: 0.3,  waterFar: 0.35, waterNear: 0.3, specWrong: 0.4,  photoMiss: 0.5, photoNear: 0.3, pollMiss: 0.35, boosts: 2, boostFail: 0.6, stormShield: 0.25 },
};
const rnd = () => Math.random();
function simulate(diffId, prof) {
  const d = DIFF[diffId];
  let food = d.food, actions = 0;
  const plants = Array.from({ length: 8 }, () => ({ pips: 5, alive: true, lightCut: false, missed: false, sensitive: rnd() < 0.3 }));
  const hit = (p, n) => { p.pips -= n; if (p.pips <= 0) { p.pips = 0; p.alive = false; } };
  // Substrate: one batch (8 spots); stressed seeds cost a pip and a replant batch.
  let replant = false;
  plants.forEach(p => { if (rnd() < prof.substrateStress) { hit(p, 1); replant = true; } });
  actions += replant ? 2 : 1;
  // Water: batches of 4 → 2 actions.
  plants.forEach(p => { if (!p.alive) return; const r = rnd(); if (r < prof.waterFar) hit(p, 1); });
  actions += 2;
  // Light: one batch (9 spots). Spectrum wrong = −1 (balanced hedge), photoperiod miss = −1 + half yield, near = half yield.
  plants.forEach(p => { if (!p.alive) return;
    if (rnd() < prof.specWrong) hit(p, 1);
    const r = rnd(); if (r < prof.photoMiss) { hit(p, 1); p.lightCut = true; } else if (r < prof.photoMiss + prof.photoNear) p.lightCut = true; });
  actions += 1;
  // Boost rooms the profile bothers with: each 1 action, each failure −1 on ~2 plants.
  for (let b = 0; b < prof.boosts; b++) { actions += 1; if (rnd() < prof.boostFail) plants.filter(p => p.alive).slice(0, 2).forEach(p => hit(p, 1)); }
  // Storms (Specialist): roughly two per run; an unshielded sensitive plant takes −2, moderate −1.
  if (d.storms) for (let st = 0; st < 2; st++) plants.forEach(p => { if (p.alive && rnd() > prof.stormShield) hit(p, p.sensitive ? 2 : 1); });
  // Pollination: 1 action; misses yield nothing.
  plants.forEach(p => { if (p.alive && rnd() < prof.pollMiss) p.missed = true; });
  actions += 1;
  // Harvest.
  let yieldTotal = 0;
  plants.forEach(p => { if (!p.alive || p.missed) return; yieldTotal += Math.round(10 * (p.pips / 5) * (p.lightCut ? 0.5 : 1)); });
  food = food - actions + yieldTotal;
  return { won: food >= d.quota, food, actions, yieldTotal, dead: plants.filter(p => !p.alive).length };
}
const RUNS = +(process.argv[2] || 4000);
console.log(`Starseed Station economy — ${RUNS} runs per cell\n`);
console.log('posting      profile    win%   avg food   avg yield   avg dead');
for (const diffId of Object.keys(DIFF)) for (const [pname, prof] of Object.entries(PROFILES)) {
  let wins = 0, food = 0, y = 0, dead = 0;
  for (let i = 0; i < RUNS; i++) { const r = simulate(diffId, prof); wins += r.won; food += r.food; y += r.yieldTotal; dead += r.dead; }
  console.log(`${diffId.padEnd(12)} ${pname.padEnd(9)} ${String(Math.round(wins / RUNS * 100)).padStart(4)}%   ${(food / RUNS).toFixed(1).padStart(8)}   ${(y / RUNS).toFixed(1).padStart(9)}   ${(dead / RUNS).toFixed(2).padStart(8)}`);
}
console.log('\nTarget: cadet wins for typical play, commander for good play, specialist for near-perfect play.');
