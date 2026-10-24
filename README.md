# Starseed Station

A browser-based **space-agriculture educational science game**. You're a colony worker aboard an orbital station, raising eight crop plants
through specialist rooms that each teach a real growing concept — then harvesting enough
food to feed the colony.

Inspired by *The Logical Journey of the Zoombinis*: every room is a hands-on puzzle, and
every plant hides traits you discover by playing.

## Play

No build step, no dependencies. Either:

- **Open `index.html`** directly in a modern browser, or
- **Serve the folder statically** (recommended — avoids `file://` asset quirks):

  ```bash
  python3 -m http.server 8000
  # then visit http://localhost:8000
  ```

Progress saves to `localStorage`, so you can close the tab and pick up where you left off.

## The station

Eight science rooms, each teaching one concept:

| Room | Concept |
|---|---|
| Substrate Lab | Growing media — soil-like / inert / water-only |
| Pipe Maze | Irrigation — matching water to each plant's need |
| Light Lab | Light spectrum & photoperiod (day-length) |
| Mixing Console | N-P-K nutrient ratios |
| Orientation Chamber | Gravitropism in microgravity |
| Solution Tank | Hydroponics — pH & nutrient availability |
| Radiation Dome | Cosmic radiation & shielding |
| Pollination Dome | Pollination in a closed habitat (the only real-time room) |

Plants grow **Seed → Sprout → Vegetative → Flowering → Fruiting**, one stage per room, with
pollination as the required final step before harvest. Some traits are printed on the seed
packet; others — gravity response, pH preference, radiation tolerance, substrate match,
photoperiod trigger — stay hidden until you test them. A plant that dies leaves an autopsy
card explaining the science behind what went wrong.

## Difficulty

- **Cadet** — training wheels: 95 food to start, quota 130, a limited seed selection.
- **Commander** — the standard run: 80 food, quota 110.
- **Specialist** — deep-space posting: 60 food, quota 120, Radiation Dome online.

## Tech

Single-page and DOM-rendered (canvas is used only for particles, gauge needles, and liquid
fills). One shared stylesheet and one shared script; sprites are pixel-art PNGs tinted per
species with CSS filters. Desktop / mouse. The 1280×720 stage scales to fill the window.

## Tests

`tests/smoke.js` is a headless Playwright run: static checks (no duplicate function names,
every sprite path exists), fit-to-window at three sizes, then a full scripted run through
every growth room to the run summary.

```bash
npm i -g playwright && npx playwright install chromium   # once
NODE_PATH="$(npm root -g)" node tests/smoke.js
```

---

Built as an educational science game. 🛰
