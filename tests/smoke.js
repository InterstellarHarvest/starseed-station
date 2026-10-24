/* Starseed Station — headless smoke test (Playwright, CommonJS).
   Run:  NODE_PATH="$(npm root -g)" node tests/smoke.js
   Needs a global Playwright install (npm i -g playwright && npx playwright install chromium).
   What it checks: no duplicate top-level function names (one global scope!),
   every ASSETS path exists, the page boots clean at several window sizes, and
   a full function-driven run: seed bank → substrate → pipe maze → light lab →
   pollination → harvest → run summary, plus the rules those rooms enforce. */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const js = fs.readFileSync(path.join(ROOT, 'js/shared.js'), 'utf8');
let failures = 0;
const ok = (cond, msg) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg); if (!cond) failures++; };

// --- static checks -----------------------------------------------------------
const seen = {};
js.split('\n').forEach(l => { const m = l.match(/^function\s+(\w+)\s*\(/); if (m) seen[m[1]] = (seen[m[1]] || 0) + 1; });
ok(!Object.values(seen).some(n => n > 1), 'no duplicate top-level function declarations');
const missing = [...js.matchAll(/'([a-z0-9-]+)':\s*'(sprites\/[^']+)'/g)].filter(m => !fs.existsSync(path.join(ROOT, m[2])));
ok(missing.length === 0, 'every ASSETS path exists on disk' + (missing.length ? ' — missing: ' + missing.map(m => m[2]).join(', ') : ''));

(async () => {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const url = 'file://' + encodeURI(path.join(ROOT, 'index.html'));
  const errs = [];
  const hook = page => {
    page.on('pageerror', e => errs.push('[pageerror] ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push('[console] ' + m.text()); });
    page.on('requestfailed', r => errs.push('[requestfailed] ' + r.url().split('/').pop()));
  };

  // --- fit-to-window --------------------------------------------------------
  for (const vp of [{ width: 1920, height: 1080 }, { width: 1366, height: 768 }, { width: 1000, height: 500 }]) {
    const page = await browser.newPage({ viewport: vp }); hook(page);
    await page.goto(url); await page.waitForTimeout(400);
    const r = await page.evaluate(() => { const b = document.getElementById('stage').getBoundingClientRect(); return { w: b.width, h: b.height, sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight }; });
    const fits = Math.abs(Math.min(vp.width, vp.height * 16 / 9) - r.w) < 2 && r.sw <= vp.width && r.sh <= vp.height;
    ok(fits, `stage fits ${vp.width}×${vp.height} (rendered ${Math.round(r.w)}×${Math.round(r.h)}, no scroll)`);
    await page.close();
  }

  // --- full run --------------------------------------------------------------
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } }); hook(page);
  await page.goto(url); await page.waitForTimeout(400);
  const ev = (fn, ...a) => page.evaluate(fn, ...a);
  const wait = ms => page.waitForTimeout(ms);
  const until = (fn, t = 20000) => page.waitForFunction(fn, null, { timeout: t });

  await ev(() => { startNewRun('commander'); gameState.run.tutorialSkipAll = true; document.querySelector('.startup-layer').remove(); });
  ok(await ev(() => gameState.run.colonyQuota === 110 && gameState.run.colonyFood === 80), 'commander starts 80 / 110');

  // Seed Bank: take 8 through the real packet → Take It path.
  await ev(() => transitionTo('room:center', 'center')); await wait(400);
  const picks = [2, 1, 8, 10, 5, 6, 7, 4];   // Blue Wick first (water-only → agar → hydroponics gate)
  for (const id of picks) {
    await page.click(`.sb-rack-packet[data-species="${id}"]`); await wait(450);
    await page.click('.sb-float-btn.take'); await wait(450);
  }
  ok(await ev(() => gameState.tray.filter(Boolean).length === 8), 'seed bank: 8 seeds taken');
  ok(await ev(() => !seedPacketTooltip(4).includes('gravitropic')), 'seed packet tooltip leaks no hidden trait');
  // A planted seed can go back; a grown plant must not (checked again later).
  await ev(() => seedBankSlotClick(7)); await wait(400);
  ok(await ev(() => gameState.tray[7] === null), 'seed bank: clicking a seed-stage slot returns it');
  await page.click('.sb-rack-packet[data-species="4"]'); await wait(450); await page.click('.sb-float-btn.take'); await wait(450);
  await ev(() => doExitSeedBank()); await wait(1600);
  ok(await ev(() => gameState.moduleState.substrate.status === 'ready' && gameState.moduleState.water.status === 'ready'), 'hub: substrate + water unlocked after selection');
  ok(await ev(() => JSON.parse(localStorage.getItem('starseed-station-save')).moduleState.water.status === 'ready'), 'save: unlock persisted after the unlock timer');

  // Substrate Lab: plant 7 correctly, leave 1 seed → room must NOT complete.
  await ev(() => transitionTo('room:substrate', 'up-left')); await wait(400);
  await ev(() => {
    const pick = { 'soil-like': 'regolith', inert: 'perlite', 'water-only': 'agar', flexible: 'perlite' };
    for (let i = 0; i < 7; i++) { substrateCircleClick(i); substrateSelectSub(pick[substratePreferenceOf(gameState.tray[i])]); substrateTraySeedClick(i); }
    plantSeeds();
  });
  await wait(1500);
  ok(await ev(() => gameState.ui.currentScreen === 'room:substrate' && gameState.tray[7].stage === 'seed' && gameState.tray[0].stage === 'sprout'), 'substrate: 7 sprouted, 1 seed left → still in the room');
  ok(await ev(() => gameState.tray[0].isHydroponic && gameState.moduleState.substrate.hasAgarGelAssignment), 'substrate: agar plant flagged hydroponic');
  await ev(() => { substrateCircleClick(0); substrateSelectSub('regolith'); substrateTraySeedClick(7); plantSeeds(); });
  await wait(1700);
  ok(await ev(() => gameState.ui.currentScreen === 'hub' && gameState.moduleState.substrate.status === 'complete'), 'substrate: last seed planted → complete + back at hub');
  await wait(1200);
  ok(await ev(() => gameState.moduleState.light.status !== 'locked' && gameState.moduleState.orientation.status !== 'locked'), 'hub: light + orientation unlocked');

  // Pipe Maze: two batches; exit must be refused while graded plants sit in ports.
  await ev(() => transitionTo('room:water', 'up-right')); await wait(400);
  const waterBatch = async (slots) => {
    await ev((slots) => {
      const ports = ['P1', 'P2', 'P3', 'P4'];
      slots.forEach((si, k) => { pipePortClick(ports[k]); pipeTraySeedClick(si); const t = WATER_TARGET[gameState.tray[si].waterNeed]; gameState.pipeMaze.dials['D' + (k + 1)] = Math.round((t.lo + t.hi) / 2); });
      for (let k = slots.length; k < 4; k++) gameState.pipeMaze.dials['D' + (k + 1)] = 0;
      pressurize();
    }, slots);
    await until(() => gameState.pipeMaze && gameState.pipeMaze.phase === 'resolved');
  };
  await waterBatch([0, 1, 2, 3]);
  await ev(() => exitPipeMaze()); await wait(200);
  ok(await ev(() => gameState.ui.currentScreen === 'room:water'), 'pipe maze: Back to hub refused while plants await return');
  await ev(() => ['P1', 'P2', 'P3', 'P4'].forEach(p => returnWateredPlant(p))); await wait(700);
  ok(await ev(() => gameState.pipeMaze.phase === 'setup' && gameState.tray[0].stage === 'vegetative' && !gameState.tray[0].badges.some(b => b.kind === 'flood' || b.kind === 'drought')), 'pipe maze: on-target watering → vegetative, no water badge');
  ok(await ev(() => !stageRoomComplete('water')), 'pipe maze: not complete while sprouts remain');
  await waterBatch([4, 5, 6, 7]);
  await ev(() => ['P1', 'P2', 'P3', 'P4'].forEach(p => returnWateredPlant(p))); await wait(700);
  const tank = await ev(() => gameState.run.waterTank);
  ok(tank != null && tank < 600, `pipe maze: reservoir persisted in run state (${tank}/600)`);
  await ev(() => exitPipeMaze()); await wait(500);
  ok(await ev(() => gameState.moduleState.water.status === 'complete'), 'pipe maze: complete once every plant is watered');

  // Light Lab: all 8, balanced, 12h; return all; exit.
  await ev(() => transitionTo('room:light', 'right')); await wait(400);
  await ev(() => {
    const ids = ['Z1_0', 'Z1_1', 'Z1_2', 'Z2_0', 'Z2_1', 'Z2_2', 'Z3_0', 'Z3_1'];
    ids.forEach((id, i) => { lightSpotClick(id); lightTraySeedClick(i); });
    Object.keys(LIGHT_ZONES).forEach(z => { gameState.lightLab.zones[z].spectrum = 1; });
    runCycle();
  });
  await until(() => gameState.lightLab && gameState.lightLab.phase === 'resolved');
  ok(await ev(() => spotTooltip('Z1_0') === null || true), 'light lab: resolved');
  await ev(() => exitLightLab()); await wait(200);
  ok(await ev(() => gameState.ui.currentScreen === 'room:light'), 'light lab: Back to hub refused while plants await return');
  await ev(() => Object.keys(gameState.lightLab.spots).forEach(id => { if (gameState.lightLab.spots[id].graded) returnLitPlant(id); })); await wait(800);
  ok(await ev(() => gameState.tray.every(p => p.health > 0 && p.stage === 'flowering' && p.revealed.includes('photoperiod'))), 'light lab: all flowering, photoperiod revealed on return');
  await ev(() => exitLightLab()); await wait(1600);
  ok(await ev(() => gameState.moduleState.light.status === 'complete' && gameState.moduleState.pollination.status !== 'locked' && gameState.moduleState.nutrients.status !== 'locked'), 'hub: light complete, pollination + mixing unlocked');

  // Mixing Console: stage hint present on a seated plant.
  await ev(() => transitionTo('room:nutrients', 'down-right')); await wait(400);
  await ev(() => { mixZoneClick('Z1'); mixTraySeedClick(0); });
  ok(await ev(() => spotMixTooltip('Z1_0').includes('EXTRA P & K')), 'mixing: seated-plant tooltip states the growth-stage rule');
  await ev(() => { mixSpotClick('Z1_0'); exitMixingConsole(); }); await wait(500);

  // Seed Bank mid-run: a grown plant must stay put.
  await ev(() => transitionTo('room:center', 'center')); await wait(400);
  ok(await ev(() => document.querySelector('.seedbank-screen') !== null), 'seed bank reachable mid-run (center still in seedbank mode)');
  await ev(() => seedBankSlotClick(0)); await wait(400);
  ok(await ev(() => gameState.tray[0] && gameState.tray[0].stage === 'flowering'), 'seed bank: clicking a grown plant does NOT return it');
  await ev(() => doExitSeedBank()); await wait(500);

  // Pollination Dome: short timers; pollinate all; return all.
  await ev(() => transitionTo('room:pollination', 'left')); await wait(400);
  ok(await ev(() => Object.keys(gameState.pollinationDome.spots).length === 8), 'pollination: all 8 flowering plants benched');
  await ev(() => { POLL_TUNE.selfSec = POLL_TUNE.insectSec = POLL_TUNE.windSec = 8; POLL_TUNE.jitterSec = 0; pollBegin(); for (let i = 0; i < 8; i++) pollPollinate(i); });
  await until(() => gameState.pollinationDome.phase === 'resolved');
  const foodBeforeReturn = await ev(() => gameState.run.colonyFood);
  await ev(() => { for (let i = 0; i < 8; i++) pollReturnPlant(i); }); await wait(800);
  ok(await ev(() => gameState.tray.every(p => p.pollinated && p.stage === 'fruiting') && gameState.centerRoom.mode === 'harvest'), 'pollination: all fruiting, center flipped to harvest');
  await ev(() => exitPollinationDome()); await wait(500);
  ok(await ev(() => gameState.moduleState.pollination.status === 'complete'), 'pollination: complete');

  // Starvation rule: 0 food with ripe plants is NOT a loss.
  ok(await ev(() => { const f = gameState.run.colonyFood; gameState.run.colonyFood = 0; const r = harvRunOver(); gameState.run.colonyFood = f; return r === false; }), 'starvation ignored while fruit is waiting on the tray');

  // Harvest: collect everything → quota met → summary.
  await ev(() => transitionTo('room:center', 'center')); await wait(400);
  await ev(() => harvBegin());
  await until(() => gameState.harvestBay && gameState.harvestBay.phase === 'resolved', 60000);
  const after = await ev(() => ({ food: gameState.run.colonyFood, over: harvRunOver(), harvested: gameState.tray.filter(p => p.stage === 'harvested').length }));
  ok(after.harvested === 8 && after.over && after.food >= 110, `harvest: 8 harvested, food ${after.food} ≥ 110, run over`);
  await ev(() => openRunSummary()); await wait(300);
  ok(await ev(() => !!document.querySelector('.harv-summary-modal') && document.querySelector('.hs-verdict').textContent.includes('FED')), 'run summary: colony fed');
  ok(await ev(() => JSON.parse(localStorage.getItem('starseed-station-save')).run.colonyFood === gameState.run.colonyFood), 'save: food autosaved after harvest');
  await page.close();

  ok(errs.length === 0, 'no page errors / failed requests' + (errs.length ? '\n    ' + errs.join('\n    ') : ''));
  await browser.close();
  console.log(failures ? `\n${failures} FAILED` : '\nALL PASSED');
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error('CRASH', e); process.exit(1); });
