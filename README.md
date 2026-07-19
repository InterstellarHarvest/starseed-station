# Starseed Station

A browser-based **space-agriculture edutainment game** for a middle-school science
minicourse. You're a colony worker aboard an orbital station, raising eight crop plants
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

- **Cadet** — training wheels: extra starting food, a limited seed selection.
- **Commander** — the standard run.
- **Specialist** — deep-space posting: tight food, higher quota, Radiation Dome online.

## Tech

Single-page and DOM-rendered (canvas is used only for particles, gauge needles, and liquid
fills). One shared stylesheet and one shared script; sprites are pixel-art PNGs tinted per
species with CSS filters. Desktop / mouse, on a 1280×720 stage.

---

Built for the classroom. 🛰
