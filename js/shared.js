/* ============================================================================
   STARSEED STATION — shared.js
   Loaded by every demo and the final index.html.

   RULE: before writing ANY new logic, ask "could this be useful in another
   room?" If yes, it goes HERE first, then gets used.

   Contents (built up across demos):
     - ASSETS              preloader manifest (real disk paths)
     - SPECIES             20-species registry with traits
     - SPECIES_FILTERS     CSS filter strings per species  (stub until Demo 14)
     - FAMILY_SHEETS       family → sheet asset key
     - FAMILY_ROWS         family → [speciesIds] for seed bank rendering
     - TOOLTIPS            tooltip content per element type
     - gameState           live state tree
     - preloadAssets()     loads all PNGs before game starts
     - createPlant()       plant factory          (stubbed, filled in Demo 01)
     - showTooltip()       tooltip system         (stubbed, filled in Demo 02)
     - renderTray()        tray render            (stubbed, filled in Demo 01)
   ============================================================================ */


/* ============================================================================
   ASSET_BASE — prefix prepended to every ASSETS path at use time.
   Demos under /demos/ set this to '../'. The eventual index.html at project
   root leaves it as ''. Use assetUrl(key) everywhere instead of raw ASSETS[key]
   when building <img src> or CSS url() strings.
   ============================================================================ */
let ASSET_BASE = '';
function setAssetBase(b) { ASSET_BASE = b; }
function assetUrl(key) {
  const p = ASSETS[key];
  if (!p) { console.warn('Unknown asset key:', key); return ''; }
  return ASSET_BASE + p;
}


/* ============================================================================
   ASSETS — preloader manifest
   Paths verified against on-disk state 2026-06-06.
   The Bible/Handoff manifest is out of date in places (clean hypothetical
   layout vs. actual underscored filenames at root); this is the source of truth.
   ============================================================================ */
const ASSETS = {

  /* --- Hub --------------------------------------------------------------- */
  'hub-color':                'sprites/rooms/hub/hub.png',          // reference only — not used at runtime in Demo 03+
  'hub-dimmed':               'sprites/rooms/hub/hub_locked.png',   // base dimmed layer, always visible
  'hub-label-harvest':        'sprites/rooms/hub/label_harvest_room.png',
  // Per-room cutouts (1280×580 each, transparent except the one room). Stacked
  // on top of hub-dimmed at opacity 0/1 to "unlock" a room visually.
  'hub-room-center':          'sprites/rooms/hub/hub_room_center.png',
  // Glow-only variant for the center room — Seed Bay body without the walkway.
  // Rendered BEHIND the visible center cutout; only its `filter: drop-shadow`
  // is visible (extending past the body's alpha edges). Keeps the harvest pulse
  // hugging the room body instead of running down the walkway to the screen edge.
  'hub-room-center-glow':     'sprites/rooms/hub/hub_room_center_glow.png',
  'hub-room-substrate':       'sprites/rooms/hub/hub_room_substrate.png',
  'hub-room-water':           'sprites/rooms/hub/hub_room_water.png',
  'hub-room-light':           'sprites/rooms/hub/hub_room_light.png',
  'hub-room-nutrients':       'sprites/rooms/hub/hub_room_nutrients.png',
  'hub-room-hydroponics':     'sprites/rooms/hub/hub_room_hydroponics.png',
  'hub-room-orientation':     'sprites/rooms/hub/hub_room_orientation.png',
  'hub-room-radiation':       'sprites/rooms/hub/hub_room_radiation.png',
  'hub-room-pollination':     'sprites/rooms/hub/hub_room_pollination.png',

  /* --- Room backgrounds (1280×580) --------------------------------------- */
  'bg-substrate':             'sprites/rooms/substrate/bg_substrate.jpg',
  'bg-pipe-maze':             'sprites/rooms/pipe_maze/bg_pipe_maze.jpg',
  'bg-light':                 'sprites/rooms/light/bg_light.jpg',
  'bg-mixing-console':        'sprites/rooms/mixing_console/bg_mixing_console.jpg',
  'bg-hydroponic':            'sprites/rooms/hydroponic/bg_hydroponic.jpg',
  'bg-orientation':           'sprites/rooms/orientation/bg_orientation.jpg',
  'bg-orientation-glass':     'sprites/rooms/orientation/bg_orientation_glass.png',
  'bg-radiation':             'sprites/rooms/radiation/bg_radiation.png',
  'bg-pollination':           'sprites/rooms/pollination/bg_pollination.jpg',
  'bg-seedbank':              'sprites/rooms/seed_bank/bg_seedbank.jpg',
  'bg-harvest':               'sprites/rooms/harvest/bg_harvest.jpg',

  /* --- Plant family sheets (3×3 grids, transparent) ---------------------- */
  'plants-leafy-rosette':     'sprites/plants/plant_leafy_rosette.png',
  'plants-round-fruit-bush':  'sprites/plants/plant_fruit_bush.png',
  'plants-tall-stalk':        'sprites/plants/plant_tall_stalk.png',
  'plants-climbing-vine':     'sprites/plants/plant_climbing_vine.png',
  'plants-root-tuber':        'sprites/plants/plant_root_tuber.png',

  /* --- Root-level chrome (CSS 9-slice + generic buttons) ----------------- */
  'tray-bg':                  'sprites/plant_tray.png',
  'tray-slot':                'sprites/plant_slot.png',
  'autopsy-card':             'sprites/plants/autopsy_card.png',
  'dead-tray':                'sprites/plants/dead_tray.png',
  'notification':             'sprites/notification.png',
  'button-up':                'sprites/button_up.png',      // generic action button, NORMAL state
  'button-down':              'sprites/button_down.png',    // generic action button, PRESSED state

  /* --- Icons (badges, deaths, cursors, padlock, complete, bloom) --------- */
  'padlock':                  'sprites/icons/padlock.png',
  'complete':                 'sprites/icons/complete.png',
  'cursor-pointer':           'sprites/icons/cursor_pointer.png',
  'cursor-grab':              'sprites/icons/cursor_grab.png',

  // Tray-slot badges (10×10 px, transparent)
  'badge-substrate-assigned':   'sprites/icons/badge_substrate_assigned.png',
  'badge-substrate-match':      'sprites/icons/badge_substrate_match.png',
  'badge-radiation-tolerance':  'sprites/icons/badge_radiation_tolerance.png',
  'badge-gravity-response':     'sprites/icons/badge_gravity_response.png',
  'badge-ph':                   'sprites/icons/badge_ph.png',
  'badge-photoperiod':          'sprites/icons/badge_photoperiod.png',
  'badge-root-disease':         'sprites/icons/badge_root_disease.png',
  'badge-nutrient-burn':        'sprites/icons/badge_nutrient_burn.png',
  'badge-dna-damage':           'sprites/icons/badge_dna_damage.png',
  'badge-deficiency':           'sprites/icons/badge_deficiency.png',

  // Autopsy cause-of-death icons
  'death-drought':              'sprites/icons/death_drought.png',
  'death-overwater':            'sprites/icons/death_overwater.png',
  'death-wrong-spectrum':       'sprites/icons/death_wrong_spectrum.png',
  'death-radiation':            'sprites/icons/death_radiation.png',
  'death-nutrient-burn':        'sprites/icons/death_nutrient_burn.png',
  'death-nutrient-deficiency':  'sprites/icons/death_nutrient_deficiency.png',
  'death-ph-lockout':           'sprites/icons/death_ph_lockout.png',
  'death-wrong-substrate':      'sprites/icons/death_wrong_substrate.png',
  'death-missed-pollination':   'sprites/icons/death_missed_pollination.png',

  /* --- Run Summary — rank cards (128×160 native ≈ 64×80 art grid ×2; shown
     192×240 = 3× the art grid, crisp). Title banner is baked into the art. */
  'rank-master':   'sprites/icons/rank_master_agronomist.png',
  'rank-provider': 'sprites/icons/rank_colony_provider.png',
  'rank-lean':     'sprites/icons/rank_lean_season.png',
  'rank-hungry':   'sprites/icons/rank_hungry_winter.png',

  // Light Lab bloom burst (4 frames)
  'flower-bloom-1':             'sprites/icons/flower_bloom1.png',
  'flower-bloom-2':             'sprites/icons/flower_bloom2.png',
  'flower-bloom-3':             'sprites/icons/flower_bloom3.png',
  'flower-bloom-4':             'sprites/icons/flower_bloom4.png',

  /* --- Substrate Lab — 6 substrate tiles (128×128, framed) --------------- */
  'substrate-perlite':        'sprites/rooms/substrate/perlite.png',
  'substrate-vermiculite':    'sprites/rooms/substrate/vermiculite.png',
  'substrate-coco':           'sprites/rooms/substrate/coco.png',
  'substrate-regolith':       'sprites/rooms/substrate/regolith.png',
  'substrate-rockwool':       'sprites/rooms/substrate/rockwool.png',
  'substrate-agar':           'sprites/rooms/substrate/agar.png',

  /* --- Pipe Maze --------------------------------------------------------- */
  'valve-wheel-sheet':        'sprites/rooms/pipe_maze/spritesheet_wheel.png',
  // valve coords measured separately — see VALVE_COORDS below.
  // Flood/drought stress badges reuse the cause-of-death icons (no separate art).
  'badge-flood':              'sprites/icons/death_overwater.png',
  'badge-drought':            'sprites/icons/death_drought.png',

  /* --- Light Lab --------------------------------------------------------- */
  'dial-face':                'sprites/rooms/light/dial_face.png',
  'dial-needle':              'sprites/rooms/light/needle.png',
  'slider-handle':            'sprites/rooms/light/slider.png',
  'light-flower-bloom':       'sprites/rooms/light/flower_bloom.png',

  /* --- Mixing Console — needle sheet (40×32, 3 needles horizontal) ------- */
  'needle-sheet':             'sprites/rooms/mixing_console/pointers.png',

  /* --- Hydroponic Bay ---------------------------------------------------- */
  'hydroponic-buttons-pressed': 'sprites/rooms/hydroponic/buttons_pressed.png',

  /* --- Orientation Chamber ----------------------------------------------- */
  // Orientation has its OWN rotate buttons (NOT the root-level generic ones)
  'rotate-button-up':         'sprites/rooms/orientation/button-rotate-up.png',
  'rotate-button-down':       'sprites/rooms/orientation/button-rotate-down.png',

  /* --- Radiation Dome ---------------------------------------------------- */
  // 4 shield materials — icon_*.png for rack display
  'shield-icon-water':        'sprites/rooms/radiation/icon_water.png',
  'shield-icon-plastic':      'sprites/rooms/radiation/icon_plastic.png',
  'shield-icon-aluminum':     'sprites/rooms/radiation/icon_aluminum.png',
  'shield-icon-regolith':     'sprites/rooms/radiation/icon_regolith_bag.png',
  // material_*.jpg → placed behind bg in bay positions as layered composition.
  // Not technically a sprite (JPEGs can't be transparent) — kept here so the
  // preloader still caches them.
  'shield-material-water':    'sprites/rooms/radiation/material_water.jpg',
  'shield-material-plastic':  'sprites/rooms/radiation/material_plastic.jpg',
  'shield-material-aluminum': 'sprites/rooms/radiation/material_aluminum.jpg',
  'shield-material-regolith': 'sprites/rooms/radiation/material_regolith.jpg',
  // Radiation type icons (may or may not get used per Sprite Spec §9C note)
  'radiation-uv':             'sprites/rooms/radiation/radiation_uv.png',
  'radiation-particle':       'sprites/rooms/radiation/radiation_particle.png',
  'radiation-gamma':          'sprites/rooms/radiation/radiation_gamma.png',
  'exposure-clear':           'sprites/rooms/radiation/exposure_clear.png',
  'exposure-damage':          'sprites/rooms/radiation/exposure_damage.png',

  /* --- Pollination Dome -------------------------------------------------- */
  'bee-drone-1':              'sprites/rooms/pollination/bee_drone1.png',
  'bee-drone-2':              'sprites/rooms/pollination/bee_drone2.png',
  'fan-1':                    'sprites/rooms/pollination/fan1.png',
  'fan-2':                    'sprites/rooms/pollination/fan2.png',
  'pollen-brush':             'sprites/rooms/pollination/pollen_brush.png',

  /* --- Seed Bank — 5 family packets + back face + locked overlay --------- */
  'packet-leafy-rosette':     'sprites/rooms/seed_bank/seedinfo_leafy_rosette.png',
  'packet-round-fruit-bush':  'sprites/rooms/seed_bank/seedinfo_fruit_bush.png',
  'packet-tall-stalk':        'sprites/rooms/seed_bank/seedinfo_tall_stalk.png',
  'packet-climbing-vine':     'sprites/rooms/seed_bank/seedinfo_climbing_vine.png',
  'packet-root-tuber':        'sprites/rooms/seed_bank/seedinfo_root_tuber.png',
  'packet-back':              'sprites/rooms/seed_bank/seedinfo_back.png',
  'packet-locked':            'sprites/rooms/seed_bank/seedinfo_locked.png',
  // Seed packet trait icons (visible traits shown on packet front)
  'trait-water':              'sprites/rooms/seed_bank/trait_water.png',
  'trait-spectrum':           'sprites/rooms/seed_bank/trait_spectrum.png',
  'trait-nutrient':           'sprites/rooms/seed_bank/trait_nutrient.png',
  'trait-pollination-self':   'sprites/rooms/seed_bank/trait_self_pollination.png',
  'trait-pollination-insect': 'sprites/rooms/seed_bank/trait_bee_pollination.png',
  'trait-pollination-wind':   'sprites/rooms/seed_bank/trait_wind_pollination.png',

  /* --- Harvest Bay — produce sprites ------------------------------------- */
  'produce-red-fruit':        'sprites/rooms/harvest/produce_red_fruit.png',
  'produce-leafy-green':      'sprites/rooms/harvest/produce_leafy_green.png',
  'produce-root':             'sprites/rooms/harvest/produce_root.png',
  'produce-round':            'sprites/rooms/harvest/produce_round.png',
  'produce-grain':            'sprites/rooms/harvest/produce_grain.png',
};


/* ============================================================================
   Sub-sprite coordinate tables
   Measured from the spritesheets via Demo 00 (or hand-measured where noted).
   ============================================================================ */

// Pipe Maze valve wheel — measured in Demo 00.
// 1×3 grid, cell 260×260, origin (0,0).
/* Valve-wheel sheet — 3 frames, 128×128, packed 1px apart (verified against
   sprites/rooms/pipe_maze/spritesheet_wheel.json; the 260×260 values here before
   were stale). Sheet is 390×130. */
const VALVE_SHEET = { w: 390, h: 130 };
const VALVE_COORDS = {
  closed:  { x:   1, y: 1, w: 128, h: 128 },
  turning: { x: 131, y: 1, w: 128, h: 128 },
  open:    { x: 261, y: 1, w: 128, h: 128 },
};

// Mixing Console rotary needles — measured in Demo 00.
// File is 38×32. 12-wide cells with 1px gap on each side of the center needle:
//   N at 0..11  ·  (gap at 12)  ·  P at 13..24  ·  (gap at 25)  ·  K at 26..37
const NEEDLE_COORDS = {
  N: { x: 0,  y: 0, w: 12, h: 32 },
  P: { x: 13, y: 0, w: 12, h: 32 },
  K: { x: 26, y: 0, w: 12, h: 32 },
};

// Plant family sheet cell sizes — TBD from Demo 00.
// All sheets are 3×3 grids in this cell order:
//   [Seed   ][Sprout ][Vegetative]
//   [Flowering][Fruiting][Stressed]
//   [Critical][Dead   ][Harvested]
const PLANT_STAGES = [
  'seed', 'sprout', 'vegetative',
  'flowering', 'fruiting', 'stressed',
  'critical', 'dead', 'harvested',
];
// Measured in Demo 00 — all 5 family sheets share these dimensions.
const PLANT_CELL = { w: 85, h: 85 };
const PLANT_SHEET_ROWS = 3;
const PLANT_SHEET_COLS = 3;


/* ============================================================================
   SPECIES — 20 species registry
   Visible traits are seed-packet facts (fixed forever).
   Hidden traits filled where the Bible's species notes (§4) state them
   explicitly; the rest are null and will be assigned in a later balance pass.
   ============================================================================ */
const SPECIES = {
  1:  { name: 'Crimson Drift',  family: 'round-fruit-bush', water: 'high',   light: 'balanced',  nutrient: 'medium', pollination: 'self',
        radiation: 'sensitive', gravity: null,        ph: null,       substrate: null,        photoperiod: null,
        notes: 'cherry tomato — ISS favorite' },
  2:  { name: 'Blue Wick',      family: 'leafy-rosette',    water: 'high',   light: 'balanced',  nutrient: 'light',  pollination: 'self',
        radiation: null,         gravity: null,        ph: null,       substrate: 'water-only', photoperiod: null,
        notes: 'lettuce — water-only, fast-growing, forgiving' },
  3:  { name: 'Colonel Mustard',family: 'leafy-rosette',    water: 'medium', light: 'balanced',  nutrient: 'medium', pollination: 'wind',
        radiation: null,         gravity: null,        ph: null,       substrate: null,        photoperiod: 'short-day',
        notes: 'mustard greens — short-day trigger' },
  4:  { name: 'Deep Root',      family: 'root-tuber',       water: 'medium', light: 'balanced',  nutrient: 'heavy',  pollination: 'insect',
        radiation: null,         gravity: 'strict',    ph: null,       substrate: null,        photoperiod: null,
        notes: 'radish — strict gravitropic, heavy feeder' },
  5:  { name: 'Sunpulse',       family: 'tall-stalk',       water: 'medium', light: 'red-heavy', nutrient: 'medium', pollination: 'insect',
        radiation: 'hardy',      gravity: null,        ph: null,       substrate: null,        photoperiod: 'long-day',
        notes: 'sunflower — long-day, radiation hardy' },
  6:  { name: 'Velvet Bean',    family: 'climbing-vine',    water: 'medium', light: 'balanced',  nutrient: 'light',  pollination: 'self',
        radiation: null,         gravity: null,        ph: null,       substrate: null,        photoperiod: 'short-day',
        notes: 'mung bean — nitrogen fixer (lowers effective nutrient need); short-day flowerer (hidden trigger in a day-neutral family)' },
  7:  { name: 'Prism Pepper',   family: 'round-fruit-bush', water: 'medium', light: 'red-heavy', nutrient: 'heavy',  pollination: 'insect',
        radiation: null,         gravity: null,        ph: 'neutral',  substrate: null,        photoperiod: null,
        notes: 'bell pepper — pH sensitive, long cycle' },
  8:  { name: 'Lunar Spud',     family: 'root-tuber',       water: 'high',   light: 'balanced',  nutrient: 'medium', pollination: 'self',
        radiation: null,         gravity: 'indifferent', ph: null,     substrate: 'flexible',  photoperiod: null,
        notes: 'potato — gravity-indifferent, flexible substrate (tolerates any medium)' },
  9:  { name: 'Silkwheat',      family: 'tall-stalk',       water: 'medium', light: 'balanced',  nutrient: 'medium', pollination: 'wind',
        radiation: 'moderate',   gravity: null,        ph: null,       substrate: null,        photoperiod: 'long-day',
        notes: 'dwarf wheat — strict photoperiod' },
  10: { name: 'Comet Kale',     family: 'leafy-rosette',    water: 'medium', light: 'balanced',  nutrient: 'medium', pollination: 'self',
        radiation: 'moderate',   gravity: 'flexible',  ph: 'neutral',  substrate: 'inert',     photoperiod: 'day-neutral',
        notes: 'kale — hardy/forgiving across most traits, beginner plant' },
  11: { name: 'Starbasil',      family: 'leafy-rosette',    water: 'medium', light: 'balanced',  nutrient: 'light',  pollination: 'self',
        radiation: null,         gravity: null,        ph: null,       substrate: null,        photoperiod: null,
        notes: 'basil — heat-sensitive, aromatic' },
  12: { name: 'Fogpea',         family: 'climbing-vine',    water: 'medium', light: 'balanced',  nutrient: 'light',  pollination: 'insect',
        radiation: null,         gravity: null,        ph: 'alkaline', substrate: null,        photoperiod: null,
        notes: 'snow pea — alkaline pH' },
  13: { name: 'Tangleroot',     family: 'root-tuber',       water: 'medium', light: 'balanced',  nutrient: 'heavy',  pollination: 'insect',
        radiation: null,         gravity: 'strict',    ph: null,       substrate: null,        photoperiod: null,
        notes: 'yam — very heavy feeder, slow-growing' },
  14: { name: 'Nebula Cress',   family: 'leafy-rosette',    water: 'high',   light: 'balanced',  nutrient: 'light',  pollination: 'self',
        radiation: 'sensitive',  gravity: null,        ph: null,       substrate: 'water-only', photoperiod: null,
        notes: 'watercress — water-only, radiation sensitive, extremely fast' },
  15: { name: 'Ironleaf',       family: 'root-tuber',       water: 'medium', light: 'red-heavy', nutrient: 'medium', pollination: 'insect',
        radiation: 'hardy',      gravity: 'flexible',  ph: null,       substrate: null,        photoperiod: 'long-day',
        notes: 'sweet potato — radiation hardy, flexible gravity' },
  16: { name: 'Dusk Melon',     family: 'round-fruit-bush', water: 'high',   light: 'red-heavy', nutrient: 'medium', pollination: 'insect',
        radiation: null,         gravity: null,        ph: 'neutral',  substrate: null,        photoperiod: 'short-day',
        notes: 'cantaloupe — short-day, pH sensitive, warm-preferring' },
  17: { name: 'Pale Lantern',   family: 'round-fruit-bush', water: 'medium', light: 'blue-heavy',nutrient: 'medium', pollination: 'self',
        radiation: 'moderate',   gravity: 'flexible',  ph: 'neutral',  substrate: 'inert',     photoperiod: 'day-neutral',
        notes: 'white eggplant — blue-heavy spectrum, moderate across most' },
  18: { name: 'Orbit Squash',   family: 'climbing-vine',    water: 'medium', light: 'balanced',  nutrient: 'heavy',  pollination: 'insect',
        radiation: null,         gravity: 'flexible',  ph: null,       substrate: null,        photoperiod: null,
        notes: 'butternut squash — heavy feeder, flexible gravity, slow' },
  19: { name: 'Frostmint',      family: 'leafy-rosette',    water: 'high',   light: 'balanced',  nutrient: 'light',  pollination: 'self',
        radiation: 'moderate',   gravity: null,        ph: null,       substrate: null,        photoperiod: 'long-day',
        notes: 'peppermint — spreader habit, moderate radiation; long-day flowerer (hidden trigger in a day-neutral family)' },
  20: { name: 'Zero-G Rye',     family: 'tall-stalk',       water: 'low',    light: 'balanced',  nutrient: 'medium', pollination: 'wind',
        radiation: 'hardy',      gravity: 'indifferent', ph: null,     substrate: null,        photoperiod: null,
        notes: 'cereal rye — gravity-indifferent, radiation hardy' },
};


/* Family → sheet asset key (for CSS background-image + position rendering). */
const FAMILY_SHEETS = {
  'leafy-rosette':    'plants-leafy-rosette',
  'round-fruit-bush': 'plants-round-fruit-bush',
  'tall-stalk':       'plants-tall-stalk',
  'climbing-vine':    'plants-climbing-vine',
  'root-tuber':       'plants-root-tuber',
};

/* Family → packet asset key (for Seed Bank packet rendering). */
const FAMILY_PACKETS = {
  'leafy-rosette':    'packet-leafy-rosette',
  'round-fruit-bush': 'packet-round-fruit-bush',
  'tall-stalk':       'packet-tall-stalk',
  'climbing-vine':    'packet-climbing-vine',
  'root-tuber':       'packet-root-tuber',
};

/* Seed Bank row order (Bible §6I). */
const FAMILY_ROWS = {
  'leafy-rosette':    [2, 3, 10, 11, 14, 19],
  'round-fruit-bush': [1, 7, 16, 17],
  'tall-stalk':       [5, 9, 20],
  'climbing-vine':    [6, 12, 18],
  'root-tuber':       [4, 8, 13, 15],
};

/* Seed Bank rack model — 5 family shelves; each row's packets are scattered at
   random x within [rackLeft, rackRight] with >= minGap px between neighbours.
   The game rolls positions ONCE per Seed Bay visit (gameState.seedBank.rackLayout)
   and re-rolls on a new game. Vertical layout is fixed: each shelf sits at
   topRowY + row*rowPitch + nudge. Measured in demos/04a-seedbank-coords.html. */
const SEED_BANK_RACK = {
  rowOrder:   ['leafy-rosette', 'round-fruit-bush', 'tall-stalk', 'climbing-vine', 'root-tuber'],
  rackLeft:   336,   // row left edge (packets stay right of this)
  rackRight:  994,   // row right edge (packets stay left of this)
  topRowY:    112,   // y-center of row 0 (top shelf)
  rowPitch:   58,    // vertical distance between shelves
  rowYAdjust: [21, 32, 43, 54, 66],
  packetW:    36,    // rack-thumbnail packet size (114:175 aspect)
  packetH:    55,
  minGap:     40,    // min px between adjacent packets in a row
  tipFontSize: 9,    // hover name tooltip font px
  tipGap:      8,    // hover name tooltip gap above packet px
};

/* Per-family x shift (px, at rack packetW) of the composited plant sprite inside
   the packet illustration window — corrects family sheets that sit off-centre.
   Scaled proportionally when the packet is drawn larger (the floating card). */
const FAMILY_PLANT_NUDGE = {
  'leafy-rosette':    0,
  'round-fruit-bush': 2,
  'tall-stalk':       0,
  'climbing-vine':    2,
  'root-tuber':       0,
};


/* ============================================================================
   SPECIES_FILTERS — CSS filter strings per species
   User-tuned in demos/14-color-tool.html (Demo 14, baked 2026-07-18). One
   species per family stays 'none' — the look its sheet was painted as
   (Sunpulse, Lunar Spud, Starbasil, Dusk Melon, Orbit Squash). Keep the
   tool's baked defaults in sync when retuning.
   ============================================================================ */
const SPECIES_FILTERS = {
  1:  'hue-rotate(-117deg) saturate(1.83) brightness(0.9)',// Crimson Drift — round-fruit-bush
  2:  'hue-rotate(114deg) saturate(0.99) brightness(0.87)',// Blue Wick — leafy-rosette
  3:  'hue-rotate(-38deg) saturate(1.67) brightness(1.06)',// Colonel Mustard — leafy-rosette
  4:  'hue-rotate(-77deg) saturate(1.48) brightness(1.09)',// Deep Root — root-tuber
  5:  'none',                                         // Sunpulse — tall-stalk (BASE)
  6:  'hue-rotate(180deg) saturate(0.71) brightness(1.12)',// Velvet Bean — climbing-vine
  7:  'hue-rotate(85deg) saturate(1.33) brightness(0.96)',// Prism Pepper — round-fruit-bush
  8:  'none',                                         // Lunar Spud — root-tuber (BASE)
  9:  'hue-rotate(-65deg) saturate(1.49) brightness(0.92)',// Silkwheat — tall-stalk
  10: 'hue-rotate(169deg) saturate(0.47) brightness(1.21)',// Comet Kale — leafy-rosette
  11: 'none',                                         // Starbasil — leafy-rosette (BASE)
  12: 'hue-rotate(108deg) saturate(1.52) brightness(1.16)',// Fogpea — climbing-vine
  13: 'hue-rotate(36deg) saturate(0.62) brightness(1.23)',// Tangleroot — root-tuber
  14: 'hue-rotate(-142deg) saturate(1.52) brightness(0.87)',// Nebula Cress — leafy-rosette
  15: 'hue-rotate(-112deg) saturate(1.36) brightness(1.4)',// Ironleaf — root-tuber
  16: 'none',                                         // Dusk Melon — round-fruit-bush (BASE)
  17: 'hue-rotate(160deg) saturate(0.58) brightness(1.24)',// Pale Lantern — round-fruit-bush
  18: 'none',                                         // Orbit Squash — climbing-vine (BASE)
  19: 'hue-rotate(83deg) saturate(0.79) brightness(1.4)',// Frostmint — leafy-rosette
  20: 'hue-rotate(109deg) brightness(1.32)',          // Zero-G Rye — tall-stalk
};

/* Dead plants are NEVER tinted — species color reads as life, and every family
   sheet's dead cell keeps its painted browns for all species. Route sprite
   filters through this instead of reading plant.cssFilter directly wherever a
   dead plant can render (tray, autopsy card, summary cards). Room benches only
   show health > 0 plants, so their composed filters read cssFilter as-is. */
function plantSpriteFilter(plant, stage) {
  const s = stage || plant.stage;
  if (s === 'dead' || plant.health <= 0) return 'none';
  return plant.cssFilter || 'none';
}


/* ============================================================================
   TOOLTIPS — content table
   Populated as each demo adds its interactive elements.
   Dynamic tooltips (e.g. tray slots) build content at render time instead.
   ============================================================================ */
const TOOLTIPS = {
  // Filled in Demo 02.
};


/* ============================================================================
   gameState — live state tree
   Mirrors Bible §10. Demos mutate this; never replace the top-level reference.
   ============================================================================ */
const gameState = {
  run: {
    actionCount: 0,
    colonyFood: 80,
    colonyQuota: 100,
    foodSpent: 0,      // lifetime food paid for room actions (run-summary ledger)
    foodEarned: 0,     // lifetime food credited by harvests
    difficulty: 'commander',
    scenario: null,
    midRunReseedEnabled: false,
    seedBankSelectionComplete: false,   // set when all 8 tray slots are filled and the player exits
  },
  seedBank: {
    available: Object.keys(SPECIES).map(Number),
    locked: [],
    familyRows: FAMILY_ROWS,
    rackLayout: null,   // resolved per-run packet scatter (rolled on first Seed Bay visit)
  },
  tray: [null, null, null, null, null, null, null, null],
  deadTray: [],
  autopsyLog: [],
  moduleState: {
    // Room status field — 5-state machine:
    //   'locked'      → padlock, cutout hidden, no glow
    //   'unlocking'   → transient: grayscale→color fade-in, then auto → 'ready'
    //   'ready'       → cutout visible, per-room hue pulse (the "click me" cue)
    //   'in-progress' → faster brighter pulse (room visited, not yet completed)
    //   'complete'    → cutout visible, STATIC drop-shadow at 0.75 alpha, no pulse
    // Bible §5 defaults: substrate + water pre-unlocked, everything else locked.
    // Demo 03 overrides this on load via resetHubRooms() to lock everything.
    substrate:   { status: 'ready',  actionsThisSession: 0, hasAgarGelAssignment: false },
    water:       { status: 'ready',  actionsThisSession: 0 },
    light:       { status: 'locked', actionsThisSession: 0 },
    orientation: { status: 'locked', actionsThisSession: 0, gravityRevealed: false },
    nutrients:   { status: 'locked', actionsThisSession: 0 },
    hydroponics: { status: 'locked', actionsThisSession: 0 },
    radiation:   { status: 'locked', actionsThisSession: 0 },
    pollination: { status: 'locked', actionsThisSession: 0 },
  },
  centerRoom: {
    mode: 'seedbank',
    harvestReady: [],
  },
  ui: {
    currentScreen: 'hub',
    notification: null,
    tooltip: { visible: false, content: null, x: 0, y: 0 },
    autopsyOpen: false,
    seedBankFloatingPacket: null,
    selectedSlot: null,     // index of currently-grabbed plant, or null
  },
};


/* ============================================================================
   Preloader — caches every entry in ASSETS before the game starts.
   ============================================================================ */
const LOADED = {}; // logical-name → HTMLImageElement

function preloadAssets(manifest, onDone, onProgress) {
  const entries = Object.entries(manifest);
  let done = 0;
  const total = entries.length;
  if (total === 0) { onDone && onDone(LOADED); return; }
  entries.forEach(([key, path]) => {
    const img = new Image();
    img.onload = img.onerror = () => {
      LOADED[key] = img;
      done++;
      onProgress && onProgress(done, total, key);
      if (done === total) onDone && onDone(LOADED);
    };
    img.src = path;
  });
}


/* ============================================================================
   Plant factory — creates a plant object for a tray slot
   Built in Demo 01. Stub here so room files can call it without errors.
   ============================================================================ */
function createPlant(speciesId, slotIndex) {
  const s = SPECIES[speciesId];
  if (!s) throw new Error(`Unknown speciesId: ${speciesId}`);
  return {
    slotIndex,
    speciesId,
    name: s.name,
    spriteFamily: s.family,
    cssFilter: SPECIES_FILTERS[speciesId] || 'none',
    health: 5,
    maxHealth: 5,
    actionAge: 0,   // +1 per *successful* room action — see project_starseed_station memory
    stage: 'seed',
    flowered: false,
    pollinated: false,

    // Visible traits (copied from species)
    waterNeed:        s.water,
    lightSpectrum:    s.light,
    nutrientHunger:   s.nutrient,
    pollinationType:  s.pollination,

    // Hidden traits — start null even if SPECIES has a value;
    // they get revealed through room play and copied in via revealTrait().
    radiationTolerance: null,
    gravityResponse:    null,
    phPreference:       null,
    substrateMatch:     null,
    photoperiodTrigger: null,

    // Assignments
    assignedSubstrate: null,
    isHydroponic:      false,
    gravityHighRisk:   false,

    revealed:       [],
    badges:         [],
    stressMarkers: [],
    moduleHistory: [],
  };
}


/* ============================================================================
   Tooltip system (Demo 01 / Demo 02)
   Single lazily-created .tooltip div appended to <body>.
   - First hover: TOOLTIP_DELAY_MS appear delay (mutable via setTooltipDelay()).
   - Already-visible: switching to another tooltipped element updates content
     and position IMMEDIATELY (no delay) — feels like the tooltip "carries"
     between adjacent elements instead of flickering off-on.
   - Hide is debounced by GRACE_MS so leaving one element and entering another
     in quick succession cancels the hide entirely.
   - Position is flipped/clamped so it never clips off-screen.
   - Suppressed entirely while a mouse button is held down (drag in progress).
   - Suppressed when the contentFn returns null/empty (e.g., the currently-
     selected slot — you've already committed; tooltip would be redundant).
   ============================================================================ */
let TOOLTIP_DELAY_MS = 350;
const TOOLTIP_GRACE_MS = 80;   // hide debounce — cancels if a new enter fires
let TOOLTIP_GAP_PX = 8;        // gap between tooltip's bottom edge and element's top edge
let TOOLTIP_SCALE_WITH_STAGE = true;   // true → tooltip lives inside #stage and inherits the fullscreen transform
function setTooltipDelay(ms) { TOOLTIP_DELAY_MS = ms; }
function setTooltipGap(px)   { TOOLTIP_GAP_PX = px; }
function setTooltipScaleWithStage(yes) {
  TOOLTIP_SCALE_WITH_STAGE = !!yes;
  if (!_tooltipEl) return;
  const stage = document.getElementById('stage');
  const want = TOOLTIP_SCALE_WITH_STAGE && stage ? stage : document.body;
  if (_tooltipEl.parentElement !== want) want.appendChild(_tooltipEl);
}

let _tooltipEl = null;
let _showTimer = null;
let _hideTimer = null;
let _mouseDown = false;        // suppress tooltips during drag

// Register drag-suppression once, at module load. Capture-phase so we catch
// the press even if a child stops propagation.
document.addEventListener('mousedown', () => { _mouseDown = true; hideTooltip(); }, true);
document.addEventListener('mouseup',   () => { _mouseDown = false; }, true);

function _ensureTooltipEl() {
  if (_tooltipEl) return _tooltipEl;
  _tooltipEl = document.createElement('div');
  _tooltipEl.className = 'tooltip';
  const stage = document.getElementById('stage');
  ((TOOLTIP_SCALE_WITH_STAGE && stage) || document.body).appendChild(_tooltipEl);
  return _tooltipEl;
}

/* Place the tooltip centered above the hovered ELEMENT (not the cursor).
   Tooltip's bottom edge sits TOOLTIP_GAP_PX above the element's top.
   Clamps to the STAGE's bounds (not the viewport) so a tooltip on the
   leftmost slot doesn't extend off into dead space beside the stage.
   Flips below the element if it would clip the stage's top.
   When TOOLTIP_SCALE_WITH_STAGE is on (tooltip lives inside #stage), the
   viewport-coords computed here are converted to stage-local CSS coords
   by undoing the fullscreen scale and subtracting the stage origin. */
function _placeTooltipAboveElement(el) {
  const tr = _tooltipEl.getBoundingClientRect();
  const er = el.getBoundingClientRect();
  const stage = document.getElementById('stage');
  const sr = stage ? stage.getBoundingClientRect()
                   : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };

  // Desired position in VIEWPORT coords (always).
  let vx = er.left + er.width / 2 - tr.width / 2;
  let vy = er.top  - tr.height - TOOLTIP_GAP_PX;
  if (vy < sr.top + 4)             vy = er.bottom + TOOLTIP_GAP_PX;
  if (vx + tr.width > sr.right - 4) vx = sr.right - tr.width - 4;
  if (vx < sr.left + 4)             vx = sr.left + 4;

  // Translate viewport coords → tooltip's local CSS coords. When the tooltip
  // is a child of #stage and #stage has a transform: scale(--fs-scale), we
  // need to undo that scale and subtract the stage's viewport-origin to land
  // at the right CSS left/top inside the stage's local coordinate space.
  const inStage = stage && _tooltipEl.parentElement === stage;
  if (inStage) {
    const scale = parseFloat(getComputedStyle(document.documentElement)
                  .getPropertyValue('--fs-scale')) || 1;
    _tooltipEl.style.left = ((vx - sr.left) / scale) + 'px';
    _tooltipEl.style.top  = ((vy - sr.top)  / scale) + 'px';
  } else {
    _tooltipEl.style.left = vx + 'px';
    _tooltipEl.style.top  = vy + 'px';
  }
}

/* Place the tooltip to the LEFT of the element (right edge a gap left of the
   element's left edge), vertically centered; flips to the right if there's no
   room. Used by rooms that want side-anchored tips (e.g. Pipe Maze ports). */
function _placeTooltipLeftOfElement(el) {
  const tr = _tooltipEl.getBoundingClientRect();
  const er = el.getBoundingClientRect();
  const stage = document.getElementById('stage');
  const sr = stage ? stage.getBoundingClientRect()
                   : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
  let vx = er.left - tr.width - TOOLTIP_GAP_PX;
  let vy = er.top + er.height / 2 - tr.height / 2;
  if (vx < sr.left + 4)              vx = er.right + TOOLTIP_GAP_PX;   // flip to the right
  if (vy < sr.top + 4)               vy = sr.top + 4;
  if (vy + tr.height > sr.bottom - 4) vy = sr.bottom - tr.height - 4;
  const inStage = stage && _tooltipEl.parentElement === stage;
  if (inStage) {
    const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fs-scale')) || 1;
    _tooltipEl.style.left = ((vx - sr.left) / scale) + 'px';
    _tooltipEl.style.top  = ((vy - sr.top)  / scale) + 'px';
  } else {
    _tooltipEl.style.left = vx + 'px';
    _tooltipEl.style.top  = vy + 'px';
  }
}

function _renderTooltipForElement(el, content, placement) {
  if (typeof content === 'string') _tooltipEl.innerHTML = content;
  else { _tooltipEl.innerHTML = ''; _tooltipEl.appendChild(content); }
  _tooltipEl.classList.add('visible');
  (placement === 'left' ? _placeTooltipLeftOfElement : _placeTooltipAboveElement)(el);
}

/* Show the tooltip anchored above `el`. Drag-suppression + empty-content
   suppression + carry-over (instant swap when already visible) all preserved. */
function showTooltipFor(el, content, placement) {
  if (_mouseDown) return;
  if (!content) { hideTooltip(); return; }
  _ensureTooltipEl();
  clearTimeout(_showTimer);
  clearTimeout(_hideTimer);
  const alreadyVisible = _tooltipEl.classList.contains('visible');
  if (alreadyVisible) {
    _renderTooltipForElement(el, content, placement);
    return;
  }
  _showTimer = setTimeout(() => _renderTooltipForElement(el, content, placement), TOOLTIP_DELAY_MS);
}

/* Show a tooltip immediately (no appear delay, ignores the drag-suppression
   guard). For cases where a click must KEEP a tooltip up — e.g. clicking a
   locked seed packet, where the global mousedown handler just hid it. Cancels
   the pending hide so there's no flicker. */
function showTooltipImmediately(el, content) {
  if (!content) return;
  _ensureTooltipEl();
  clearTimeout(_showTimer);
  clearTimeout(_hideTimer);
  _renderTooltipForElement(el, content);
}

function hideTooltip() {
  clearTimeout(_showTimer);
  clearTimeout(_hideTimer);
  _hideTimer = setTimeout(() => {
    if (_tooltipEl) _tooltipEl.classList.remove('visible');
  }, TOOLTIP_GRACE_MS);
}

/* Attach hover-tooltip behavior to an element. `contentFn` is called each
   hover so dynamic state stays fresh. Position is anchored to the element
   itself — cursor movement inside the element doesn't move the tooltip. */
function attachTooltip(el, contentFn, placement) {
  el.addEventListener('mouseenter', () => showTooltipFor(el, contentFn(), placement));
  el.addEventListener('mouseleave', hideTooltip);
}


/* ============================================================================
   Tray rendering (Demo 01)
   Builds 8 slot DOM nodes once, then mutates them on subsequent calls.
   Expects a #tray element in the DOM (placed by the demo's HTML).
   ============================================================================ */

const BADGE_ASSET = {
  // hidden-trait reveal badges
  'radiation':   { asset: 'badge-radiation-tolerance', name: 'Radiation tolerance' },
  'gravity':     { asset: 'badge-gravity-response',    name: 'Gravity response' },
  'ph':          { asset: 'badge-ph',                  name: 'pH preference' },
  'substrate':   { asset: 'badge-substrate-match',     name: 'Substrate match' },
  'photoperiod': { asset: 'badge-photoperiod',         name: 'Photoperiod trigger' },
  // substrate assignment (not a trait reveal — just a record of what's planted)
  'substrate-assigned': { asset: 'badge-substrate-assigned', name: 'Substrate assigned' },
  // stress markers — NEGATIVE: their tooltip title renders red, not green
  'root-disease':  { asset: 'badge-root-disease',  name: 'Root disease',        negative: true },
  'nutrient-burn': { asset: 'badge-nutrient-burn', name: 'Nutrient burn',       negative: true },
  'dna-damage':    { asset: 'badge-dna-damage',    name: 'DNA damage',          negative: true },
  'deficiency':    { asset: 'badge-deficiency',    name: 'Nutrient deficiency', negative: true },
  'flood':         { asset: 'badge-flood',         name: 'Flood damage',        negative: true },
  'drought':       { asset: 'badge-drought',       name: 'Drought stress',      negative: true },
  'wrong-spectrum':{ asset: 'death-wrong-spectrum', name: 'Wrong light', negative: true },   // covers spectrum AND photoperiod (user wording 2026-07-19)
  'disorientation':{ asset: 'badge-root-disease',  name: 'Disorientation',      negative: true },   // strict gravitropic left wrong (reuses root-disease icon)
  'ph-lockout':    { asset: 'death-ph-lockout',     name: 'pH lockout',          negative: true },   // Solution Tank: pH out of safe band → nutrient lockout
  'missed-pollination': { asset: 'death-missed-pollination', name: 'Missed pollination', negative: true },   // Pollination Dome: flower closed → no fruit, no yield (pipCost 0 — the plant lives)
};

function renderTray(state) {
  const trayEl = document.getElementById('tray');
  if (!trayEl) return;

  // First call — build the static skeleton.
  let slotsWrap = trayEl.querySelector('.slots');
  if (!slotsWrap) {
    slotsWrap = document.createElement('div');
    slotsWrap.className = 'slots';
    for (let i = 0; i < 8; i++) {
      const slot = document.createElement('div');
      slot.className = 'slot';
      slot.dataset.idx = i;
      slot.innerHTML = `
        <div class="plant-clip"><div class="plant-sprite"></div></div>
        <div class="pip-bar"></div>
        <div class="badge-stack"></div>
      `;
      attachTooltip(slot, () => slotTooltipContent(gameState.tray[+slot.dataset.idx], +slot.dataset.idx));
      // Click toggles selection — clicking the already-selected slot deselects.
      // Universal behavior across hub and every room (rooms can hook the
      // selectedSlot change to drive their own "plant being placed" logic).
      slot.addEventListener('click', () => toggleSlotSelection(+slot.dataset.idx));
      slotsWrap.appendChild(slot);
    }
    trayEl.appendChild(slotsWrap);

    // Dead-tray container — always present, click opens autopsy modal.
    const deadTray = document.createElement('div');
    deadTray.className = 'dead-tray';
    deadTray.innerHTML = `<div class="dead-tray-badge">0</div>`;
    deadTray.addEventListener('click', openAutopsyReview);
    attachTooltip(deadTray, () => {
      const n = gameState.deadTray.length;
      if (n === 0) return `<span class="tt-name">Dead tray</span><span class="tt-row">No plants have died yet.</span>`;
      return `<span class="tt-name">Dead tray</span><span class="tt-row">${n} death${n === 1 ? '' : 's'}. Click to review autopsies.</span>`;
    });
    trayEl.appendChild(deadTray);

    // Action zone — empty placeholder. setActionZone() populates it when a
    // demo or room wants the commit button(s).
    const actionZone = document.createElement('div');
    actionZone.className = 'action-zone empty';
    trayEl.appendChild(actionZone);
  }

  // Update dead-tray badge.
  updateDeadTrayBadge(state.deadTray.length);

  // Update each slot from state.
  slotsWrap.querySelectorAll('.slot').forEach((slot, i) => {
    const plant = state.tray[i];
    slot.classList.remove('empty', 'dead', 'harvestable', 'harvested', 'selected');
    if (state.ui.selectedSlot === i) slot.classList.add('selected');
    const sprite = slot.querySelector('.plant-sprite');
    const pipBar = slot.querySelector('.pip-bar');
    const badges = slot.querySelector('.badge-stack');

    if (!plant) {
      slot.classList.add('empty');
      sprite.style.backgroundImage = 'none';
      pipBar.innerHTML = '';
      badges.innerHTML = '';
      return;
    }

    // Plant sprite — pick the cell for the current stage.
    // We set --plant-col / --plant-row as CSS vars so background-position is
    // computed in CSS from --plant-size. That keeps the plant-size slider
    // live (no need to re-render every frame).
    const stageIdx = spriteCellForStage(plant.stage);
    const col = stageIdx % PLANT_SHEET_COLS;
    const row = (stageIdx / PLANT_SHEET_COLS) | 0;
    const sheetKey = FAMILY_SHEETS[plant.spriteFamily];
    sprite.style.backgroundImage = `url('${assetUrl(sheetKey)}')`;
    sprite.style.setProperty('--plant-col', col);
    sprite.style.setProperty('--plant-row', row);
    sprite.style.filter = plantSpriteFilter(plant);

    renderHealthPips(plant, pipBar);
    renderBadges(plant, badges);

    if (plant.health <= 0)                slot.classList.add('dead');
    // Harvested plants show the family sheet's stub cell (row 3 col 3) — the
    // slot reads "consumed, fed the colony", not empty (Bible §6J).
    else if (plant.stage === 'harvested') slot.classList.add('harvested');
    // Fruiting IS harvest-ready now (pollination is the final step; see
    // onStageAdvanced / harvestBayHarvestable) — both fruiting and the vestigial
    // 'harvestable' stage get the green "ready" pulse.
    else if (plant.stage === 'harvestable' || plant.stage === 'fruiting') {
      slot.classList.add('harvestable');
    }
  });
}

/* ============================================================================
   Tray slot-lock primitive (generalized from the Hydroponic-Bay non-Agar lock).
   A room calls syncTraySlotLocks(reasonFor) from its render/tray-sync pass:
   reasonFor(plant, idx) returns a short "why not" string (two lines ok, use
   <br>) for a slot the room can't accept, or null if the slot is allowed. The
   slot dims + gets an on-slot ✕ and reason; the room's tray-click handler should
   independently refuse the same plants (refuse-flash). clearTraySlotLocks()
   removes all of it on room exit. Living plants only — empty/dead slots are
   never locked. Shared so every grow room (and future rooms) reuse one look. */
function syncTraySlotLocks(reasonFor) {
  document.querySelectorAll('#tray .slot').forEach(slot => {
    const idx = +slot.dataset.idx;
    const plant = gameState.tray[idx];
    const reason = (plant && plant.health > 0) ? reasonFor(plant, idx) : null;
    slot.classList.toggle('slot-locked', !!reason);
    let mark = slot.querySelector('.slot-lock-mark');
    if (reason) {
      if (!mark) {
        mark = document.createElement('div');
        mark.className = 'slot-lock-mark';
        slot.appendChild(mark);
      }
      mark.innerHTML = `<div class="slm-x">✕</div><div class="slm-why">${reason}</div>`;
    } else if (mark) { mark.remove(); }
  });
}
function clearTraySlotLocks() {
  document.querySelectorAll('#tray .slot.slot-locked').forEach(s => s.classList.remove('slot-locked'));
  document.querySelectorAll('.slot-lock-mark').forEach(m => m.remove());
}

function renderHealthPips(plant, container) {
  container.innerHTML = '';
  // Vertical bar drains TOP→BOTTOM: the first (maxHealth − health) pips (topmost)
  // show as lost, the remaining health pips stay full at the bottom.
  const lost = plant.maxHealth - plant.health;
  for (let i = 0; i < plant.maxHealth; i++) {
    const pip = document.createElement('div');
    pip.className = 'pip' + (i < lost ? ' lost' : '');
    container.appendChild(pip);
  }
  container.classList.toggle('critical', plant.health > 0 && plant.health <= 2);
}

function renderBadges(plant, container) {
  container.innerHTML = '';
  (plant.badges || []).forEach(b => {
    const def = BADGE_ASSET[b.kind];
    if (!def) return;
    const el = document.createElement('div');
    el.className = 'badge';
    el.style.backgroundImage = `url('${assetUrl(def.asset)}')`;
    // Badges float ABOVE the slot but are DOM children of it — stop click
    // from bubbling so it doesn't trigger the slot's select handler.
    el.addEventListener('click', e => e.stopPropagation());
    attachTooltip(el, () => {
      const lines = [`<span class="tt-name${def.negative ? ' tt-bad' : ''}">${def.name}</span>`];
      if (b.value)  lines.push(`<span class="tt-row">Value: ${b.value}</span>`);
      if (b.detail) lines.push(`<span class="tt-row">${b.detail}</span>`);
      return lines.join('');
    });
    container.appendChild(el);
  });
}

/* Slot-click override hook. A room can register a handler that intercepts tray
   clicks; returning true suppresses the default select-toggle. Seed Bank uses it
   to return a planted seed to the rack. setSlotClickHandler(null) restores
   default behavior (rooms MUST clear it on exit). */
let _slotClickHandler = null;
function setSlotClickHandler(fn) { _slotClickHandler = fn; }

/* Optional one-line hint appended to a planted slot's tooltip (e.g. the Seed
   Bank's "Click to put back"). Rooms set it on enter, clear it on exit. */
let _trayClickHint = null;
function setTrayClickHint(text) { _trayClickHint = text; }

/* Slot selection — toggle behavior. Clicking the already-selected slot
   deselects it; clicking any other slot switches selection. Empty slots
   can be clicked but produce no selection (nothing to grab). */
function toggleSlotSelection(idx) {
  if (_slotClickHandler && _slotClickHandler(idx) === true) return;
  const plant = gameState.tray[idx];
  if (!plant) {
    gameState.ui.selectedSlot = null;
  } else {
    gameState.ui.selectedSlot = (gameState.ui.selectedSlot === idx) ? null : idx;
  }
  renderTray(gameState);
}
function selectSlot(idx)        { gameState.ui.selectedSlot = idx;  renderTray(gameState); }
function clearSlotSelection()   { gameState.ui.selectedSlot = null; renderTray(gameState); }
function getSelectedSlot()      { return gameState.ui.selectedSlot; }
function getSelectedPlant()     { return gameState.tray[gameState.ui.selectedSlot]; }


/* Compose the hover tooltip body for a tray slot, dynamic from current state.
   Each label gets a category-specific color via .tt-cat-* classes; values stay
   white. Each label : value pair is its own line for scannability. */
const tlv = (cat, label, value) =>
  `<span class="tt-row"><span class="tt-label tt-cat-${cat}">${label}</span>` +
  `<span class="tt-value">${value}</span></span>`;

function slotTooltipContent(plant, idx) {
  // Suppress the tooltip on the currently-selected slot — the player has
  // already committed to that plant; the tooltip would just be in the way.
  // (Other 7 slots keep showing tooltips so the player can still compare.)
  if (gameState.ui.selectedSlot === idx) return null;
  if (!plant) {
    return `<span class="tt-name">Slot ${idx + 1}</span>` +
           `<span class="tt-row"><span class="tt-label">Empty</span></span>`;
  }
  // Visible traits — always shown (these are on the seed packet too).
  const lines = [
    `<span class="tt-name">${plant.name}</span>`,
    tlv('health',      'Health',      `${plant.health}/${plant.maxHealth}`),
    tlv('stage',       'Stage',       plant.stage),
    tlv('water',       'Water',       plant.waterNeed),
    tlv('light',       'Light',       plant.lightSpectrum),
    tlv('nutrient',    'Nutrient',    plant.nutrientHunger),
    tlv('pollination', 'Pollination', plant.pollinationType),
  ];
  // Hidden traits — only shown if the player has revealed them via room play.
  // Each one has a category color so the eye picks up "this used to be a ???".
  const revealed = plant.revealed || [];
  const showIf = (key, cat, label, value) =>
    revealed.includes(key) && value != null ? lines.push(tlv(cat, label, value)) : null;
  showIf('radiation',   'revealed',  'Radiation',   plant.radiationTolerance);
  showIf('gravity',     'revealed',  'Gravity',     plant.gravityResponse);
  showIf('ph',          'revealed',  'pH',          plant.phPreference);
  showIf('substrate',   'revealed',  'Substr. pref',plant.substrateMatch);
  showIf('photoperiod', 'revealed',  'Photoperiod', plant.photoperiodTrigger);
  // Substrate assignment (set in Substrate Lab — not a trait reveal).
  if (plant.assignedSubstrate) lines.push(tlv('substrate', 'Planted in', plant.assignedSubstrate));
  // Room-supplied action hint (e.g. Seed Bank's "Click to put back").
  if (_trayClickHint) lines.push(`<span class="tt-row hub-unlock-hint">${_trayClickHint}</span>`);
  return lines.join('');
}


/* ============================================================================
   Death + dead tray + autopsy modal (Demo 01)
   killPlant — moves a plant out of the live tray into deadTray with a cause
               record, then triggers a tray re-render.
   updateDeadTrayBadge — toggles visibility and shows count.
   openAutopsyReview / closeAutopsyReview — fanned-card modal over game panel.
   ============================================================================ */

// Map of cause keys → death icon asset key + human label.
const DEATH_CAUSES = {
  'drought':              { asset: 'death-drought',             label: 'Drought' },
  'overwater':            { asset: 'death-overwater',           label: 'Over-watered' },
  'wrong-spectrum':       { asset: 'death-wrong-spectrum',      label: 'Wrong light' },   // covers spectrum AND photoperiod (user wording 2026-07-19)
  'radiation':            { asset: 'death-radiation',           label: 'Radiation damage' },
  'nutrient-burn':        { asset: 'death-nutrient-burn',       label: 'Nutrient burn' },
  'nutrient-deficiency':  { asset: 'death-nutrient-deficiency', label: 'Nutrient deficiency' },
  'ph-lockout':           { asset: 'death-ph-lockout',          label: 'pH lockout' },
  'wrong-substrate':      { asset: 'death-wrong-substrate',     label: 'Wrong substrate' },
  'missed-pollination':   { asset: 'death-missed-pollination',  label: 'Missed pollination' },
  'disorientation':       { asset: 'badge-root-disease',        label: 'Disorientation (root failure)' },
};

/* ============================================================================
   DEATH_LESSONS — the per-cause educational modal content (Demo 16). Keyed by
   the same cause strings as DEATH_CAUSES. Each entry teaches, at a middle-school
   level, the science of that death: `concept` (the topic tag), `what` (why it
   died), `signs` (what the player could have caught), `fix` (what to do next
   time), and `space` (the real spaceflight-agriculture connection). Rendered by
   openAutopsyLesson; a cause with no entry falls back to a short generic note.
   Copy is static/authored (no user input) — apostrophes use ’ so they sit safely
   inside single-quoted strings.
   ============================================================================ */
const DEATH_LESSONS = {
  'drought': {
    concept: 'Water & irrigation',
    what: 'Without enough water a plant’s cells lose their internal pressure and go limp — it wilts, stops making food, and dries out. Water also carries nutrients up from the roots, so a thirsty plant starves as well.',
    signs: 'The water gauge sat below the plant’s need, and its tray tooltip showed MEDIUM or HIGH thirst. Wilting, pale, papery leaves are the first clue.',
    fix: 'Turn the dial UP for thirsty plants. Check each plant’s water need in its tooltip and aim the gauge into its target band before you pressurize.',
    space: 'On the ISS, water is precious and recycled — growers meter every drop, because there is no rain in orbit.',
  },
  'overwater': {
    concept: 'Water & root oxygen',
    what: 'Roots need to breathe. Drown them in too much water and they cannot reach oxygen — they suffocate and rot. More water is NOT always better.',
    signs: 'The gauge ran above the plant’s need. Over-watered plants look yellow and mushy at the base, not crisp.',
    fix: 'Ease the dial DOWN. A low-water plant flooded on a high setting drowns just as surely as a thirsty one dries out — aim for its band, not the maximum.',
    space: 'In microgravity, water clings in blobs around roots instead of draining away, so space growers battle over-watering more than drought.',
  },
  'wrong-spectrum': {
    concept: 'Light: spectrum & day-length',
    what: 'Plants do not use every colour of light equally: blue light drives leafy growth, red light triggers flowering, and the LENGTH of the day tells many plants when to bloom. The wrong colour or the wrong day-length leaves a plant unable to grow or flower, and it wastes away.',
    signs: 'Under the wrong spectrum a plant pales or stretches; a plant whose day-length never matched its hidden trigger simply never bloomed.',
    fix: 'Match each zone’s spectrum to the plant (balanced is the safe hedge), and set the day-length dial into the plant’s window — short-day plants want about 8–11h, long-day plants about 14–18h.',
    space: 'Space farms use tuned LED panels — often pink-purple (red + blue together) — because reproducing all of sunlight’s colours would waste power.',
  },
  'radiation': {
    concept: 'Cosmic radiation & shielding',
    what: 'Beyond Earth’s atmosphere, high-energy particles and rays tear through cells and damage DNA. A radiation-sensitive plant left unshielded takes hits it cannot repair, and dies.',
    signs: 'A DNA-damage badge appeared after an exposure. Sensitive plants (often leafy ones) are hurt by even a moderate dose.',
    fix: 'Shield sensitive plants with the strongest material — water and regolith (packed lunar/planetary soil) absorb radiation surprisingly well, protecting even a sensitive plant from the worst event.',
    space: 'Real Mars-habitat designs bury greenhouses under regolith or water tanks for exactly this reason — mass between the crop and space IS the shield.',
  },
  'nutrient-burn': {
    concept: 'Nutrients: too much',
    what: 'Fertiliser is salt. Pile on too much and the concentration outside the roots climbs so high it pulls water back OUT of them — the plant dries from the inside even in a wet tank. Leaf tips scorch brown: “nutrient burn.”',
    signs: 'A dial pushed well past the plant’s hunger tier, and crispy, burnt leaf edges at resolve.',
    fix: 'Feed to the plant’s appetite, not the maximum. Light feeders want a gentle dose; only heavy feeders take a big one. Overshooting burns.',
    space: 'Hydroponic crews measure feed strength constantly — in a sealed loop there is no soil to buffer a mistake, so an overdose hits fast.',
  },
  'nutrient-deficiency': {
    concept: 'Nutrients: too little',
    what: 'Nitrogen builds leaves and green chlorophyll, phosphorus powers roots and energy, potassium keeps the whole plant healthy. Starve a plant of these and it yellows, stunts, and eventually cannot sustain itself.',
    signs: 'A dial set below the plant’s hunger, with yellowing, undersized growth at resolve.',
    fix: 'Read the plant’s hunger tier and raise the N-P-K dials to meet it. Heavy feeders in particular need a full dose.',
    space: 'Every gram of fertiliser is carried up from Earth, so space growers aim for the exact dose — enough to thrive, nothing wasted.',
  },
  'ph-lockout': {
    concept: 'Hydroponics: pH & availability',
    what: 'pH decides whether nutrients stay dissolved and reachable. Push it too far acidic or too alkaline and the nutrients “lock out” — they are still in the tank, but the roots can no longer take them up. The plant starves surrounded by food.',
    signs: 'The pH meter drifted outside the safe band (about 5–9) at Lock In. Mashing the buttons overshoots the target.',
    fix: 'Nudge pH gently and let the meter settle — it drifts after each press. Keep it inside the safe band, then fine-tune toward the plant’s preferred zone once you learn it.',
    space: 'Hydroponic systems have no soil to steady the pH, so it is watched and corrected constantly — one small slip locks out the entire feed.',
  },
  'wrong-substrate': {
    concept: 'Growing media (substrate)',
    what: 'The substrate sets the balance of water, air, and support around the roots. A water-only plant packed into dense soil rots; a soil plant with no medium cannot anchor or drink. The wrong medium fails the roots.',
    signs: 'A root-disease badge appeared after planting, and the substrate flashed red (a stress mismatch) instead of green.',
    fix: 'Match the medium to the plant’s hidden preference — some crops want soil-like media, some inert media, some water-only. Flexible plants tolerate most; the fussy ones do not.',
    space: 'Space gardens test clay pellets, gel, and water-only “aeroponics” because hauling heavy soil to orbit is costly — the medium has to earn its mass.',
  },
  'missed-pollination': {
    concept: 'Pollination in a closed habitat',
    what: 'No pollination, no fruit. Pollen must reach the flower to fertilise it; if the bloom closes untouched, the plant sets no fruit and that harvest is lost. On Earth, wind and insects do this for free — in a sealed station, they do not.',
    signs: 'The bloom timer ran out before the right tool reached the flower, leaving a missed-pollination badge.',
    fix: 'Match the tool to the flower before its timer empties: brush for self-pollinators, the bee-bot for insect flowers, the fan for wind flowers.',
    space: 'Orbital greenhouses really do hand-pollinate or run small fans — with no bees or breeze, someone has to move the pollen.',
  },
  'disorientation': {
    concept: 'Gravity & gravitropism',
    what: 'Plants feel gravity to send roots DOWN and shoots UP — that sense is called gravitropism. A strict plant grown the wrong way up sends its roots and shoots in the wrong directions and never establishes.',
    signs: 'A strict-gravity plant was confirmed at a wrong rotation — the status screen flashed red and a disorientation badge appeared.',
    fix: 'Keep strict-gravity plants upright. Flexible and indifferent plants shrug off any orientation, but strict ones must point the right way.',
    space: 'In orbit there is no “down,” so real experiments use spinning centrifuges or one-sided lighting to give roots a direction to grow toward.',
  },
};

/* killPlant — the canonical "this plant has died" flow.
   - Sets health=0, stage='dead' on the live plant
   - Snapshots the plant data into the autopsy entry BEFORE clearing badges,
     so the autopsy card retains what the player had learned about it
   - Clears badges on the live plant (dead-slot bible spec: "no badges")
   - Leaves the plant IN ITS SLOT — the dead-state CSS shows the skull and
     dims the cell, signaling "this slot is consumed for the run." A future
     reseedSlot(idx) helper will be the only way to clear and refill it.
   - Records the autopsy entry in gameState.deadTray for the review modal. */
function killPlant(plant, cause) {
  if (!plant || plant.health <= 0) return;   // idempotent — don't double-record
  plant.health = 0;
  plant.stage  = 'dead';
  gameState.deadTray.push({
    plant: { ...plant, badges: [...(plant.badges || [])] },  // snapshot for autopsy
    cause,
    causeLabel: (DEATH_CAUSES[cause] || { label: cause }).label,
    room: gameState.ui.currentScreen,
  });
  plant.badges = [];                          // clear from the live slot view
  renderTray(gameState);
  maybeEndRun();   // last living plant gone → every slot spent → run over
}

function updateDeadTrayBadge(count) {
  const dt = document.querySelector('.dead-tray');
  if (!dt) return;
  dt.classList.toggle('has-deaths', count > 0);
  const badge = dt.querySelector('.dead-tray-badge');
  if (badge) badge.textContent = String(count);
}

function openAutopsyReview() {
  if (document.querySelector('.autopsy-modal')) return; // already open
  const host = document.getElementById('game-panel') || document.getElementById('stage');
  if (!host) return;
  // Make sure game-panel is positioned so the modal can absolutely-cover it.
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';

  const modal = document.createElement('div');
  modal.className = 'autopsy-modal';
  modal.innerHTML = `<button class="autopsy-close">Close ✕</button>`;

  // Empty state
  if (gameState.deadTray.length === 0) {
    const msg = document.createElement('div');
    msg.className = 'autopsy-empty';
    msg.textContent = 'No plants have died yet.';
    modal.appendChild(msg);
  } else {
    const stack = document.createElement('div');
    stack.className = 'autopsy-card-stack';
    const entries = gameState.deadTray;
    const n = entries.length;
    // Max 4 per row; rows wrap upward as the count grows. Last card is the
    // bottom-right of the grid (most recent death).
    const cols = Math.min(4, n);
    stack.style.setProperty('--card-cols', cols);
    entries.forEach((entry, i) => {
      const card = buildAutopsyCard(entry);
      card.dataset.idx = i;
      card.addEventListener('click', e => {
        e.stopPropagation();
        openAutopsyLesson(entry);
      });
      stack.appendChild(card);
    });
    modal.appendChild(stack);
  }

  modal.querySelector('.autopsy-close').addEventListener('click', closeAutopsyReview);
  modal.addEventListener('click', e => { if (e.target === modal) closeAutopsyReview(); });
  host.appendChild(modal);

  // ESC to close
  const escHandler = e => { if (e.key === 'Escape') closeAutopsyReview(); };
  document.addEventListener('keydown', escHandler);
  modal.dataset.escHandler = '1';
  modal._escHandler = escHandler;
}

function buildAutopsyCard(entry) {
  const card = document.createElement('div');
  card.className = 'autopsy-card';
  const plant = entry.plant;
  const sheetKey = FAMILY_SHEETS[plant.spriteFamily];
  // Show the "dead" stage cell.
  const stageIdx = PLANT_STAGES.indexOf('dead');
  const col = stageIdx % PLANT_SHEET_COLS;
  const row = (stageIdx / PLANT_SHEET_COLS) | 0;
  const cause = DEATH_CAUSES[entry.cause];
  // One trait per row, with the same category-color treatment as tooltips.
  const row1 = (cat, label, value) =>
    `<div class="ac-row"><span class="tt-label tt-cat-${cat}">${label}</span>` +
    `<span class="tt-value">${value}</span></div>`;
  card.innerHTML = `
    <div class="ac-plant" style="
      background-image: url('${assetUrl(sheetKey)}');
      --ac-plant-col: ${col};
      --ac-plant-row: ${row};
      filter: ${plantSpriteFilter(plant, 'dead')};
    "></div>
    <div class="ac-name">${plant.name}</div>
    ${cause ? `<div class="ac-cause-icon" style="background-image: url('${assetUrl(cause.asset)}')"></div>` : ''}
    <div class="ac-cause-label">${entry.causeLabel || ''}</div>
    <div class="ac-details">
      ${row1('water',    'Water',    plant.waterNeed)}
      ${row1('light',    'Light',    plant.lightSpectrum)}
      ${row1('nutrient', 'Nutrient', plant.nutrientHunger)}
      ${entry.room ? row1('room', 'Died in', entry.room) : ''}
    </div>
  `;
  return card;
}

function closeAutopsyReview() {
  const modal = document.querySelector('.autopsy-modal');
  if (!modal) return;
  if (modal._escHandler) document.removeEventListener('keydown', modal._escHandler);
  modal.remove();
}


/* ============================================================================
   openAutopsyLesson — stub for Demo 16 (cause-of-death educational modal).
   For now, opens a placeholder "coming soon" panel so the click path is wired.
   When Demo 16 lands, replace the body with the real per-cause explanation
   pulled from a future DEATH_LESSONS table.
   ============================================================================ */
function openAutopsyLesson(entry) {
  closeAutopsyLesson();
  const host = document.querySelector('.autopsy-modal') || document.getElementById('game-panel');
  if (!host) return;
  const cause = DEATH_CAUSES[entry.cause];
  const L = DEATH_LESSONS[entry.cause];
  const body = L ? `
      <div class="al-concept">${L.concept}</div>
      <div class="al-lesson">
        <div class="al-section"><div class="al-sec-head">What happened</div><p>${L.what}</p></div>
        <div class="al-section"><div class="al-sec-head">Warning signs</div><p>${L.signs}</p></div>
        <div class="al-section"><div class="al-sec-head">Next time</div><p>${L.fix}</p></div>
        ${L.space ? `<div class="al-space">🛰 ${L.space}</div>` : ''}
      </div>`
    : `<div class="al-lesson"><div class="al-section"><p>This plant was lost to
        ${entry.causeLabel || entry.cause}. Review the room that caused it and try a
        gentler setting next run.</p></div></div>`;
  const lesson = document.createElement('div');
  lesson.className = 'autopsy-lesson';
  lesson.innerHTML = `
    <button class="autopsy-lesson-close">Back ✕</button>
    <div class="autopsy-lesson-body">
      <div class="al-title">${entry.plant.name}</div>
      <div class="al-cause">
        ${cause ? `<div class="al-cause-icon" style="background-image: url('${assetUrl(cause.asset)}')"></div>` : ''}
        <div class="al-cause-label">${entry.causeLabel || entry.cause}</div>
      </div>
      ${body}
    </div>
  `;
  lesson.querySelector('.autopsy-lesson-close').addEventListener('click', closeAutopsyLesson);
  lesson.addEventListener('click', e => { if (e.target === lesson) closeAutopsyLesson(); });
  host.appendChild(lesson);
}
function closeAutopsyLesson() {
  const ex = document.querySelector('.autopsy-lesson');
  if (ex) ex.remove();
}


/* ============================================================================
   Action zone — the right end of the tray where rooms mount commit buttons.
   Empty in the hub. setActionZone() lets demos/rooms populate it.

   buttons: array of { label, onClick }
     1 entry → single wide button (zone gets no extra class)
     2 entries → stacked side-by-side via .two-btn class
   ============================================================================ */
function setActionZone(buttons) {
  const zone = document.querySelector('.action-zone');
  if (!zone) return;
  zone.innerHTML = '';
  zone.classList.remove('empty', 'two-btn');
  if (!buttons || buttons.length === 0) {
    zone.classList.add('empty');
    return;
  }
  if (buttons.length === 2) zone.classList.add('two-btn');
  buttons.slice(0, 2).forEach(b => {
    const btn = document.createElement('button');
    btn.className = 'action-btn';
    // Label wrapped in a span so we can translate it independently of the
    // background-image swap (the press visual lives in the label shift).
    btn.innerHTML = `<span class="action-btn-label">${b.label}</span>`;
    if (b.onClick) btn.addEventListener('click', b.onClick);
    zone.appendChild(btn);
  });
}


/* ============================================================================
   Devtools — right-side sidebar of sliders, color pickers, action buttons
   Used by every demo. Each control either mutates a CSS custom property on
   <html> (--badge-size etc.) or fires a JS callback (test actions).

   Values persist to localStorage per-demo so reloads keep your tweaks.
   "Fullscreen" hides the sidebar and scales the stage to fit the viewport.

   Usage in a demo:
     Devtools.mount({
       demoName: 'demo-01',
       onWrapStage: true,   // wraps body content in .dt-page; pass true once
       sections: [
         { title: 'Layout', controls: [
           { kind: 'slider', label: 'Slot height', cssVar: '--slot-h',
             min: 60, max: 100, step: 1, default: 80, unit: 'px' },
           { kind: 'color',  label: 'Pip healthy', cssVar: '--pip-healthy',
             default: '#44dd44' },
         ]},
         { title: 'Actions', controls: [
           { kind: 'button', label: 'Reset', danger: false, onClick: () => {...} },
         ]},
       ],
     });
   ============================================================================ */
/* ============================================================================
   Starfield — reusable canvas background. Per bible §9: "Space/void: #0a0a1a
   with static star dots". Adds a <canvas> into the target container, draws N
   dots at deterministic random positions, optionally animates a subtle alpha
   twinkle on a subset of them.

   Usage:
     mountStarfield(document.body, { count: 240, twinkle: true });
     // returns a controller: { destroy(), setCount(n), setTwinkle(bool) }

   The canvas is positioned absolutely to fill its parent, behind any sibling
   content. Caller is responsible for making sure the parent is position:relative
   or otherwise establishes a containing block. The body works as-is.
   ============================================================================ */
function mountStarfield(container, opts = {}) {
  const cfg = {
    count:     opts.count    != null ? opts.count    : 200,
    twinkle:   opts.twinkle  != null ? opts.twinkle  : true,
    color:     opts.color    || 'rgba(255, 255, 255, 1)',
    minSize:   opts.minSize  != null ? opts.minSize  : 0.5,
    maxSize:   opts.maxSize  != null ? opts.maxSize  : 1.8,
    twinkleFraction: opts.twinkleFraction != null ? opts.twinkleFraction : 0.35,
    twinklePeriodMs: opts.twinklePeriodMs != null ? opts.twinklePeriodMs : 3500,
    seed:      opts.seed     || 1337,
  };

  // Deterministic PRNG (mulberry32) so the star layout stays stable between
  // reloads and tweaks — players don't see stars hop around on every refresh.
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'starfield';
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  // Insert as the FIRST child so siblings paint on top.
  if (container.firstChild) container.insertBefore(canvas, container.firstChild);
  else container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let stars = [];
  let rafId = null;
  let startTs = performance.now();

  function regenerate() {
    const rng = mulberry32(cfg.seed);
    stars = [];
    for (let i = 0; i < cfg.count; i++) {
      stars.push({
        x: rng(),                                    // 0..1, scaled at draw time
        y: rng(),
        size: cfg.minSize + rng() * (cfg.maxSize - cfg.minSize),
        baseAlpha: 0.3 + rng() * 0.7,
        twinkles: rng() < cfg.twinkleFraction,
        phase: rng() * Math.PI * 2,                  // random offset so twinklers don't sync
      });
    }
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth  || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    canvas.width  = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw() {
    const w = canvas.width  / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, w, h);
    const t = (performance.now() - startTs) / cfg.twinklePeriodMs;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      let alpha = s.baseAlpha;
      if (cfg.twinkle && s.twinkles) {
        // Sinusoidal alpha oscillation; keeps a non-zero floor so stars never
        // fully blink out. Range: 40% → 100% of baseAlpha (more swing than the
        // first pass, still subtle enough to read as ambient depth).
        const osc = 0.5 + 0.5 * Math.sin((t * 2 * Math.PI) + s.phase);
        alpha = s.baseAlpha * (0.4 + 0.6 * osc);
      }
      ctx.globalAlpha = alpha;
      ctx.fillStyle = cfg.color;
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (cfg.twinkle) rafId = requestAnimationFrame(draw);
  }

  function start() {
    if (rafId) cancelAnimationFrame(rafId);
    if (cfg.twinkle) rafId = requestAnimationFrame(draw);
    else draw(); // single static paint
  }

  function onResize() { resize(); draw(); }
  window.addEventListener('resize', onResize);

  resize();
  regenerate();
  start();

  return {
    destroy() {
      window.removeEventListener('resize', onResize);
      if (rafId) cancelAnimationFrame(rafId);
      canvas.remove();
    },
    setCount(n) { cfg.count = Math.max(0, n | 0); regenerate(); draw(); },
    setTwinkle(yes) {
      cfg.twinkle = !!yes;
      if (cfg.twinkle) start();
      else { if (rafId) cancelAnimationFrame(rafId); draw(); }
    },
  };
}


const Devtools = (function () {
  let root = null;        // sidebar element
  let demoName = '';
  let controlRegistry = []; // [{ctrl, valEl, applyDefault}]

  function storageKey() { return `starseed-devtools-${demoName}`; }

  function loadOverrides() {
    try { return JSON.parse(localStorage.getItem(storageKey())) || {}; }
    catch (_) { return {}; }
  }
  function saveOverrides(map) {
    try { localStorage.setItem(storageKey(), JSON.stringify(map)); } catch (_) {}
  }
  function clearOverrides() {
    try { localStorage.removeItem(storageKey()); } catch (_) {}
  }
  function setOverride(key, value) {
    const m = loadOverrides();
    if (value === null) delete m[key]; else m[key] = value;
    saveOverrides(m);
  }

  function applyCssVar(cssVar, value) {
    document.documentElement.style.setProperty(cssVar, value);
  }

  /* --- wrap existing body content in a .dt-page flex container so the
         sidebar sits beside the stage --------------------------------- */
  function wrapStage() {
    if (document.querySelector('.dt-page')) return;
    const wrap = document.createElement('div');
    wrap.className = 'dt-page';
    while (document.body.firstChild) wrap.appendChild(document.body.firstChild);
    document.body.appendChild(wrap);
  }

  function buildRow(ctrl, idx) {
    const row = document.createElement('div');
    row.className = 'dt-row';

    if (ctrl.kind === 'slider') {
      const id = `dt-${idx}`;
      const overrides = loadOverrides();
      const initial = overrides[ctrl.cssVar] != null
        ? parseFloat(overrides[ctrl.cssVar])
        : ctrl.default;
      const unit = ctrl.unit || '';
      row.innerHTML = `
        <label for="${id}">${ctrl.label}</label>
        <input type="range" id="${id}" min="${ctrl.min}" max="${ctrl.max}" step="${ctrl.step || 1}" value="${initial}">
        <span class="val">${initial}${unit}</span>`;
      const input = row.querySelector('input');
      const valEl = row.querySelector('.val');
      const apply = (v, fromUser) => {
        valEl.textContent = `${v}${unit}`;
        applyCssVar(ctrl.cssVar, `${v}${unit}`);
        valEl.classList.toggle('modified', +v !== ctrl.default);
        if (fromUser) setOverride(ctrl.cssVar, `${v}${unit}`);
        if (ctrl.onChange) ctrl.onChange(v);
      };
      input.addEventListener('input', e => apply(+e.target.value, true));
      apply(initial, false);
      controlRegistry.push({
        ctrl, valEl, reset: () => { input.value = ctrl.default; apply(ctrl.default, false); }
      });

    } else if (ctrl.kind === 'color') {
      const id = `dt-${idx}`;
      const overrides = loadOverrides();
      const initial = overrides[ctrl.cssVar] || ctrl.default;
      row.innerHTML = `
        <label for="${id}">${ctrl.label}</label>
        <input type="color" id="${id}" value="${initial}">
        <span class="val">${initial}</span>`;
      const input = row.querySelector('input');
      const valEl = row.querySelector('.val');
      const apply = (v, fromUser) => {
        valEl.textContent = v;
        applyCssVar(ctrl.cssVar, v);
        valEl.classList.toggle('modified', v.toLowerCase() !== ctrl.default.toLowerCase());
        if (fromUser) setOverride(ctrl.cssVar, v);
        if (ctrl.onChange) ctrl.onChange(v);
      };
      input.addEventListener('input', e => apply(e.target.value, true));
      apply(initial, false);
      controlRegistry.push({
        ctrl, valEl, reset: () => { input.value = ctrl.default; apply(ctrl.default, false); }
      });

    } else if (ctrl.kind === 'select') {
      const id = `dt-${idx}`;
      const overrides = loadOverrides();
      const persistKey = ctrl.persistKey || `select:${idx}`;
      const initial = overrides[persistKey] || ctrl.default;
      const opts = ctrl.options.map(o =>
        `<option value="${o.value}" ${o.value === initial ? 'selected' : ''}>${o.label}</option>`
      ).join('');
      row.innerHTML = `
        <label for="${id}">${ctrl.label}</label>
        <select id="${id}">${opts}</select>`;
      const select = row.querySelector('select');
      select.addEventListener('change', e => {
        setOverride(persistKey, e.target.value);
        if (ctrl.onChange) ctrl.onChange(e.target.value);
      });
      if (ctrl.onChange) ctrl.onChange(initial);

    } else if (ctrl.kind === 'note') {
      row.className = 'dt-note';
      row.textContent = ctrl.text;
    }
    return row;
  }

  function buildButtonRow(controls) {
    const row = document.createElement('div');
    row.className = 'dt-btn-row';
    controls.forEach(ctrl => {
      const b = document.createElement('button');
      b.className = 'dt-btn' + (ctrl.danger ? ' danger' : ctrl.go ? ' go' : '');
      b.textContent = ctrl.label;
      b.addEventListener('click', ctrl.onClick);
      row.appendChild(b);
    });
    return row;
  }

  function mount(opts) {
    demoName = opts.demoName || 'unknown';
    controlRegistry = [];

    if (opts.onWrapStage !== false) wrapStage();

    if (root) root.remove();
    root = document.createElement('div');
    root.className = 'devtools-sidebar';

    // Header — title + fullscreen + reset
    root.innerHTML = `
      <h2>Devtools</h2>
      <div class="dt-header-row">
        <button class="dt-btn go" id="dt-fullscreen">⛶ Fullscreen</button>
        <button class="dt-btn danger" id="dt-reset-all">↺ Reset all</button>
      </div>`;

    (opts.sections || []).forEach(section => {
      const h3 = document.createElement('h3');
      h3.textContent = section.title;
      root.appendChild(h3);

      // Buttons grouped into a button row; sliders/colors/selects each get their own row.
      const buttons = section.controls.filter(c => c.kind === 'button');
      const others  = section.controls.filter(c => c.kind !== 'button');

      others.forEach((c, i) => root.appendChild(buildRow(c, `${section.title}-${i}`)));
      if (buttons.length) root.appendChild(buildButtonRow(buttons));
    });

    // Sidebar must live inside .dt-page so it participates in the flex layout
    // and sits next to the stage. (Earlier bug: appending to body left it
    // stacked below the stage, hidden by overflow.)
    const flexTarget = document.querySelector('.dt-page') || document.body;
    flexTarget.appendChild(root);

    // Fullscreen button + floating exit button
    const fsBtn = root.querySelector('#dt-fullscreen');
    fsBtn.addEventListener('click', toggleFullscreen);

    if (!document.querySelector('.fs-exit')) {
      const fsExit = document.createElement('button');
      fsExit.className = 'dt-btn go fs-exit';
      fsExit.textContent = '⛶ Exit fullscreen';
      fsExit.addEventListener('click', toggleFullscreen);
      document.body.appendChild(fsExit);
    }

    // Reset all button
    root.querySelector('#dt-reset-all').addEventListener('click', () => {
      clearOverrides();
      controlRegistry.forEach(r => r.reset());
    });
  }

  function applyFullscreenScale() {
    if (!document.body.classList.contains('fullscreen-mode')) {
      document.documentElement.style.setProperty('--fs-scale', '1');
      return;
    }
    const sw = window.innerWidth  / 1280;
    const sh = window.innerHeight / 720;
    document.documentElement.style.setProperty('--fs-scale', Math.min(sw, sh));
  }

  function toggleFullscreen() {
    document.body.classList.toggle('fullscreen-mode');
    applyFullscreenScale();
  }

  // Keep scale in sync with viewport while fullscreen is active.
  window.addEventListener('resize', applyFullscreenScale);

  return { mount, toggleFullscreen, applyFullscreenScale };
})();


/* ============================================================================
   Remaining stubs — real bodies arrive in their respective demos.
   ============================================================================ */
/* IMPORTANT: do not declare stubs with the same name as a real implementation
   elsewhere in this file. function declarations are hoisted with the LAST
   winning, so a later stub silently overrides the real function. (Spent
   half a debugging session on this — Demo 01's kill buttons stayed silent
   because a stub `function killPlant() {}` lived below the real one.)
   Remove a stub line as soon as you implement that function above. */
/* deductFood / agePlant / revealTrait / addStressMarker + the resolveRoomAction
   wrapper and substrate trait data are implemented in the "Room action
   resolution" section below (Demo 05). Implemented there, not stubbed here, to
   avoid the hoisting trap this comment warns about. */
/* saveState / loadState are implemented in the "Demo 15 — Full integration"
   section at the end of this file (localStorage key 'starseed-station-save'). */


/* ============================================================================
   Room action resolution (Demo 05 — SHARED; every room 06+ reuses this)
   The bible's "press the action button" flow: deduct one colony-food unit, age
   each participating plant that succeeded, resolve per-plant outcomes (success /
   tolerated / stress, trait reveals, badges). Built here so the Substrate Lab
   and every later room share one implementation.
   ============================================================================ */

/* Growth ladder — the gameplay stages a plant climbs as it accumulates
   *successful* room actions (per project memory: +1 actionAge per positive
   action; 5 → harvestable). Distinct from PLANT_STAGES, which is the 3×3 sprite
   sheet cell order and also holds the stress/dead/harvested cells. */
const GROWTH_STAGES = ['seed', 'sprout', 'vegetative', 'flowering', 'fruiting', 'harvestable'];

/* Which sprite-sheet cell to draw for a gameplay stage. 'harvestable' has no
   dedicated cell — it shows the ripe 'fruiting' sprite (renderTray layers the
   green harvest pulse on top). Unknown stages fall back to cell 0. */
function spriteCellForStage(stage) {
  if (stage === 'harvestable') return PLANT_STAGES.indexOf('fruiting');
  const i = PLANT_STAGES.indexOf(stage);
  return i < 0 ? 0 : i;
}

/* ============================================================================
   GROWTH-SPINE STAGE GATE (content pass step 2 — user model 2026-07-18)
   One grow room per stage; each advances a plant exactly one stage and accepts
   ONLY plants at its input stage. Because a plant ages OUT of that input stage
   the moment the room processes it, exact-stage gating enforces "used once per
   room" for free — no per-plant done-flag needed. Pollination is the required
   FINAL step: it advances flowering → fruiting, and fruiting IS harvest-ready
   (see onStageAdvanced / harvestBayHarvestable). Boost rooms (mixing / hydro /
   orientation / radiation) are NOT gated here — they don't age and self-limit
   via their own eligibility (isHydroponic, hydroDone, oriented, …).
   ============================================================================ */
const ROOM_INPUT_STAGE = {
  substrate:   'seed',        // plant the seed → sprout
  water:       'sprout',      // water the seedling → vegetative
  light:       'vegetative',  // light cycle → flowering
  // pollination is gated by its own auto-populate eligibility (flowering + not
  // yet pollinated), so it needs no entry here.
};
const STAGE_LABEL = {
  seed: 'Seed', sprout: 'Sprout', vegetative: 'Vegetative',
  flowering: 'Flowering', fruiting: 'Fruiting', harvestable: 'Harvestable',
};
/* Does `roomKey` accept `plant` at its current stage? Non-gated rooms accept
   everything. Dead plants never qualify. */
function roomAcceptsStage(roomKey, plant) {
  const need = ROOM_INPUT_STAGE[roomKey];
  if (!need) return true;
  return !!plant && plant.health > 0 && plant.stage === need;
}
/* Soft-lock reason for a plant a grow room can't accept, or null if it can (or
   is already in-progress this visit via `done`). Two short lines for the on-slot
   mark, e.g. "Needs<br>Sprout". */
function stageLockReason(roomKey, plant, done) {
  if (done || roomAcceptsStage(roomKey, plant)) return null;
  const need = ROOM_INPUT_STAGE[roomKey];
  return need ? `Needs<br>${STAGE_LABEL[need] || need}` : null;
}
/* Living plants a grow room still has business with this visit: those at its
   input stage (processable) OR already processed (`doneFlag` truthy on the
   plant). A living plant of another stage can't enter, so it must NOT block the
   room's "all done" check — this is the deferred Demo 06 last-<4-batch gap,
   generalized to the stage gate: room-complete = returned list non-empty AND
   every member done. */
function stageInPlay(roomKey, doneFlag) {
  return gameState.tray.filter(p => p && p.health > 0 &&
    (roomAcceptsStage(roomKey, p) || p[doneFlag]));
}

/* deductFood — the single choke point for "a room action happened." Subtracts
   `amount` (default 1) colony food, bumps the action counter, and refreshes the
   top bar (the food fill self-colors warn/critical as it drains). */
function deductFood(amount = 1) {
  const run = gameState.run;
  run.colonyFood  = Math.max(0, run.colonyFood - (amount || 0));
  run.actionCount = (run.actionCount || 0) + 1;
  run.foodSpent   = (run.foodSpent || 0) + (amount || 0);
  updateFoodBar(run.colonyFood, run.colonyQuota);
  if (run.colonyFood <= 0) maybeEndRun();
  return run.colonyFood;
}

/* addFood — the harvest counterpart. Produce landing in the bin credits the
   colony. No action-counter bump: collecting is a result, not an action. */
function addFood(amount = 1) {
  const run = gameState.run;
  run.colonyFood += (amount || 0);
  run.foodEarned = (run.foodEarned || 0) + (amount || 0);
  updateFoodBar(run.colonyFood, run.colonyQuota);
  return run.colonyFood;
}

/* agePlant — advance one growth step. Call ONCE per plant per *successful*
   action (failed actions don't age — see memory). Dead plants don't age.
   Returns { from, to } for callers that fire stage-change effects. */
function agePlant(plant) {
  if (!plant || plant.health <= 0) return null;
  const from = plant.stage;
  plant.actionAge = (plant.actionAge || 0) + 1;
  plant.stage = GROWTH_STAGES[Math.min(plant.actionAge, GROWTH_STAGES.length - 1)];
  if (plant.stage === 'flowering') plant.flowered = true;
  if (from !== plant.stage) onStageAdvanced(plant, from, plant.stage);
  return { from, to: plant.stage };
}

/* Trait key → (SPECIES field, plant field, reveal-badge kind). Drives
   revealTrait generically for all five hidden traits. */
const TRAIT_FIELD = {
  radiation:   { species: 'radiation',   plant: 'radiationTolerance', badge: 'radiation' },
  gravity:     { species: 'gravity',     plant: 'gravityResponse',    badge: 'gravity' },
  ph:          { species: 'ph',          plant: 'phPreference',       badge: 'ph' },
  substrate:   { species: 'substrate',   plant: 'substrateMatch',     badge: 'substrate' },
  photoperiod: { species: 'photoperiod', plant: 'photoperiodTrigger', badge: 'photoperiod' },
};

/* revealTrait — flip a hidden trait from null to its real value, record it in
   plant.revealed (so slotTooltipContent shows it), and add the trait's reveal
   badge. Idempotent. For 'substrate' the effective value is COMPUTED
   (family-default rule + flexible plants), not read raw from SPECIES. */
function revealTrait(plant, key) {
  const f = TRAIT_FIELD[key];
  if (!plant || !f) return;
  const value = (key === 'substrate')
    ? substratePreferenceOf(plant)
    : (key === 'gravity')
    ? gravityResponseOf(plant)            // 13 null species resolve via family default
    : (key === 'ph')
    ? phPreferenceOf(plant)               // null species resolve via family default (Hydroponic Bay)
    : (key === 'radiation')
    ? radiationToleranceOf(plant)         // ~11 null species resolve via family default (Radiation Dome)
    : (key === 'photoperiod')
    ? photoperiodTriggerOf(plant)         // null species resolve via family default (Light Lab)
    : SPECIES[plant.speciesId][f.species];
  plant[f.plant] = value;
  if (!plant.revealed.includes(key)) plant.revealed.push(key);
  if (!plant.badges.some(b => b.kind === f.badge))
    plant.badges.push({ kind: f.badge, value });
  renderTray(gameState);
}

/* Stress markers that, on lethal pip loss, map to an autopsy cause. */
const MARKER_DEATH_CAUSE = {
  'root-disease':  'wrong-substrate',
  'nutrient-burn': 'nutrient-burn',
  'deficiency':    'nutrient-deficiency',
  'dna-damage':    'radiation',
  'flood':         'overwater',
  'drought':       'drought',
  'disorientation':'disorientation',
  'ph-lockout':    'ph-lockout',
  'missed-pollination': 'missed-pollination',
};

/* addStressMarker — record an active damage condition (badge + stressMarkers)
   and optionally cost pips. `marker` is a kind string or
   { kind, value?, detail?, pipCost?, deathCause? }. If pips hit 0 the plant is
   killed with the marker's mapped cause. */
function addStressMarker(plant, marker) {
  if (!plant) return;
  const m = (typeof marker === 'string') ? { kind: marker } : (marker || {});
  if (!m.kind) return;
  plant.stressMarkers = plant.stressMarkers || [];
  plant.stressMarkers.push({ kind: m.kind, detail: m.detail || null });
  if (!plant.badges.some(b => b.kind === m.kind))
    plant.badges.push({ kind: m.kind, value: m.value || null, detail: m.detail || null });
  const pip = m.pipCost || 0;
  if (pip > 0) {
    if (plant.health - pip <= 0) {
      // Lethal — killPlant does the zeroing (its guard rejects health<=0, so we
      // must NOT pre-zero). It snapshots badges into the autopsy before clearing.
      killPlant(plant, m.deathCause || MARKER_DEATH_CAUSE[m.kind] || m.kind);
    } else {
      plant.health -= pip;
    }
  }
  renderTray(gameState);
}

/* resolveRoomAction — the shared "press the action button" wrapper. Deducts
   food once, then for each participating plant calls the room's per-plant
   outcome callback; a truthy return means the action SUCCEEDED for that plant
   (→ it ages). Reveals/stress happen inside the callback, BEFORE aging, so a
   failure can both mark damage and decline to age.

     plants   — participating plant objects
     perPlant — (plant) => boolean : true = success (plant ages)
     foodCost — colony food to spend (default 1)
   Returns { aged: [...], total }. */
function resolveRoomAction({ plants = [], perPlant, foodCost = 1 } = {}) {
  deductFood(foodCost);
  const aged = [];
  plants.forEach(p => {
    if (!p) return;
    const ok = perPlant ? perPlant(p) : true;
    if (ok && p.health > 0) { agePlant(p); aged.push(p); }
  });
  renderTray(gameState);
  return { aged, total: plants.filter(Boolean).length };
}


/* ============================================================================
   Substrate trait data (Demo 05 — SHARED; plant-trait domain, like SPECIES)
   The 6 physical substrates map to the 3 hidden substrateMatch categories
   (soil-like / inert / water-only). Coco coir is treated as an inert hydroponic
   medium. Property readouts are real-horticulture approximations, shown on Easy
   difficulty. In-game pixel positions live in SUBSTRATE_RACK / SUBSTRATE_CIRCLES
   (measured in demos/05a-substrate-coords.html, pasted into the room file).
   ============================================================================ */
const SUBSTRATE_META = {
  perlite:     { label: 'Perlite',     category: 'inert',      asset: 'substrate-perlite',     ph: 7.0, drainage: 'High', aeration: 'High',
                 desc: 'Expanded volcanic glass. Sterile, sharp drainage, lots of air.' },
  vermiculite: { label: 'Vermiculite', category: 'inert',      asset: 'substrate-vermiculite', ph: 7.0, drainage: 'Low',  aeration: 'Med',
                 desc: 'Expanded mica. Holds water and nutrients; pairs with perlite.' },
  coco:        { label: 'Coco Coir',   category: 'inert',      asset: 'substrate-coco',        ph: 6.0, drainage: 'Med',  aeration: 'High',
                 desc: 'Coconut husk fibre. Inert hydroponic medium — good air + water.' },
  regolith:    { label: 'Regolith',    category: 'soil-like',  asset: 'substrate-regolith',    ph: 8.5, drainage: 'Low',  aeration: 'Low',
                 desc: 'Crushed lunar/Mars rock. Alkaline, dense, poor drainage.' },
  rockwool:    { label: 'Rockwool',    category: 'inert',      asset: 'substrate-rockwool',    ph: 7.5, drainage: 'Med',  aeration: 'High',
                 desc: 'Spun basalt fibre. Hydroponic staple; high pH, needs buffering.' },
  agar:        { label: 'Agar Gel',    category: 'water-only', asset: 'substrate-agar',        ph: 6.0, drainage: '—',    aeration: 'Low',
                 desc: 'Nutrient gel. Water-culture medium — the hydroponic route.' },
};
const SUBSTRATE_ORDER = ['perlite', 'vermiculite', 'coco', 'regolith', 'rockwool', 'agar'];

/* Family → default substrateMatch category, used when a species has no explicit
   SPECIES.substrate value. Explicit values (incl. 'flexible') override. */
const FAMILY_SUBSTRATE_DEFAULT = {
  'leafy-rosette':    'soil-like',   // basil/mint/mustard/kale are soil crops; the two
                                     // genuine water crops (Blue Wick, Nebula Cress) are
                                     // named explicitly so water-only stays a rare reveal.
  'root-tuber':       'soil-like',
  'tall-stalk':       'soil-like',
  'climbing-vine':    'inert',
  'round-fruit-bush': 'inert',
};

/* Effective substrate preference for a plant: explicit species value (incl.
   'flexible') wins, else the family default. Returns one of
   'soil-like' | 'inert' | 'water-only' | 'flexible'. */
function substratePreferenceOf(plant) {
  const s = SPECIES[plant.speciesId];
  return s.substrate || FAMILY_SUBSTRATE_DEFAULT[s.family] || 'inert';
}

/* Outcome of planting `plant` in substrate `subId`:
   'correct' (green) | 'tolerated' (amber) | 'stress' (red).
   - flexible plants tolerate everything (correct in solids, tolerated in gel)
   - exact category match → correct
   - solid↔solid mismatch (soil-like vs inert) → tolerated
   - any mismatch involving water-only → stress (the discovery moment) */
function substrateOutcome(plant, subId) {
  const pref = substratePreferenceOf(plant);
  const cat  = SUBSTRATE_META[subId].category;
  if (pref === 'flexible')          return cat === 'water-only' ? 'tolerated' : 'correct';
  if (pref === cat)                 return 'correct';
  if (pref !== 'water-only' && cat !== 'water-only') return 'tolerated';
  return 'stress';
}


/* ============================================================================
   pH / EC trait data (Demo 10 — Hydroponic Bay; plant-trait domain, like
   SUBSTRATE_META). pH is taught on the science-true scale (7 = neutral, below =
   acidic, above = alkaline). The three hidden preferences map to thrive zones
   inside a universal safe band; outside the safe band → nutrient lockout.
   Numbers are fudged for clarity (real hydroponics lives ~5.5–6.5) — see the
   Bible §6E balance table.
   ============================================================================ */
const PH_SAFE  = { lo: 5.0, hi: 9.0 };          // outside this at Lock In → lockout (−2)
const PH_BANDS = {                              // thrive zone per hidden preference
  acidic:   { lo: 5.0, hi: 6.5 },
  neutral:  { lo: 6.5, hi: 7.5 },
  alkaline: { lo: 7.5, hi: 9.0 },
};
const PH_PREF_TARGET = { acidic: 5.7, neutral: 7.0, alkaline: 8.3 };   // ideal centers
const EC_BAND  = { lo: 1.5, hi: 2.5 };          // thrive EC window (of the 0–5 scale)
const EC_HIGH  = 2.9;                           // above this → EC-too-high salt stress (−1)

/* Family → default pH preference, used when a species has no explicit SPECIES.ph.
   Mirrors FAMILY_SUBSTRATE_DEFAULT / FAMILY_GRAVITY_DEFAULT. */
const FAMILY_PH_DEFAULT = {
  'leafy-rosette':    'neutral',
  'root-tuber':       'acidic',
  'tall-stalk':       'neutral',
  'climbing-vine':    'alkaline',
  'round-fruit-bush': 'neutral',
};

/* Effective pH preference for a plant: explicit species value wins, else family
   default. Returns 'acidic' | 'neutral' | 'alkaline'. */
function phPreferenceOf(plant) {
  const s = SPECIES[plant.speciesId];
  return s.ph || FAMILY_PH_DEFAULT[s.family] || 'neutral';
}


/* ============================================================================
   ROOMS — hub coordinates per room
   Measured in demos/03a-hub-coords.html. `hotspot` is the click/hover rect; the
   visual reveal uses the cutout PNG at full 1280×580 (no offset). `dir` drives
   the slide-in/out direction relative to hub center.
   ============================================================================ */
const ROOMS = {
  center     : { label: 'Seed Bay',            dir: 'center',     hotspot: { x: 495, y: 156, w: 288, h: 220 }, glowAsset: 'hub-room-center-glow', roomLabel: 'SEED BANK' },
  substrate  : { label: 'Substrate Lab',       dir: 'up-left',    hotspot: { x: 217, y:  10, w: 272, h: 141 } },
  water      : { label: 'Pipe Maze',           dir: 'up-right',   hotspot: { x: 784, y:  10, w: 263, h: 141 } },
  light      : { label: 'Light Lab',           dir: 'right',      hotspot: { x: 892, y: 157, w: 243, h: 141 } },
  nutrients  : { label: 'Mixing Console',      dir: 'down-right', hotspot: { x: 898, y: 309, w: 235, h: 139 } },
  hydroponics: { label: 'Solution Tank',       dir: 'down',       hotspot: { x: 373, y: 441, w: 226, h: 107 }, padlockOffset: { x: -15, y: 0 } },
  orientation: { label: 'Orientation Chamber', dir: 'down-left',  hotspot: { x: 132, y: 310, w: 240, h: 141 } },
  radiation  : { label: 'Radiation Dome',      dir: 'down',       hotspot: { x: 670, y: 442, w: 227, h: 109 }, padlockOffset: { x:  15, y: 0 } },
  pollination: { label: 'Pollination Dome',    dir: 'left',       hotspot: { x: 131, y: 158, w: 253, h: 140 } },
};

/* Complete-state ✓ anchors per room, in panel coordinates (same space as the
   hotspots). Tuned via the Demo 03 anchor-tuning UI to land each ✓ at the
   end of its room's title banner. Mutated by setCompleteAnchor() at runtime
   and exported via dumpCompleteAnchors() for paste-back into this table. */
const COMPLETE_ANCHORS = {
  center     : { x:  759, y: 160 },
  substrate  : { x:  418, y:  12 },
  water      : { x:  972, y:  12 },
  light      : { x: 1056, y: 158 },
  nutrients  : { x: 1077, y: 310 },
  hydroponics: { x:  525, y: 430 },
  orientation: { x:  349, y: 310 },
  radiation  : { x:  864, y: 430 },
  pollination: { x:  328, y: 158 },
};

function setCompleteAnchor(key, x, y) {
  if (!COMPLETE_ANCHORS[key]) return;
  COMPLETE_ANCHORS[key] = { x: Math.round(x), y: Math.round(y) };
  renderHub(gameState);
}
/* Print all anchors to console in a paste-ready format. Used by the "Export"
   button in Devtools — you copy the console output and hand it back. */
function dumpCompleteAnchors() {
  const lines = ['const COMPLETE_ANCHORS_OVERRIDES = {'];
  Object.entries(COMPLETE_ANCHORS).forEach(([k, a]) => {
    lines.push(`  ${k.padEnd(11)}: { x: ${String(a.x).padStart(4)}, y: ${String(a.y).padStart(3)} },`);
  });
  lines.push('};');
  const out = lines.join('\n');
  console.log(out);
  return out;
}

/* Bible §5 unlock conditions — shown as tooltip text on locked rooms. */
const UNLOCK_HINTS = {
  substrate:   'Unlocks after Seed Bank selection complete.',
  water:       'Unlocks after Seed Bank selection complete.',
  light:       'Unlocks after first room action in any module.',
  orientation: 'Unlocks after Substrate Lab completed once.',
  nutrients:   'Unlocks after Light Lab first visited.',
  hydroponics: 'Unlocks when a plant is assigned Agar Gel AND a gravity response is revealed.',
  radiation:   'Scenario-dependent — not unlocked in the default run.',
  pollination: 'Unlocks when a plant reaches Flowering stage.',
};


/* ============================================================================
   Demo 03 — Hub, top bar, and screen transitions
   ============================================================================ */

const SLIDE_MS = 300;
const UNLOCK_FADE_MS = 800;   // matches --unlock-fade-period in shared.css

/* Room state machine — one field per moduleState entry, five possible values.
   See gameState.moduleState defaults for the table. Transitions go through:

     locked  →  unlocking (animation)  →  ready  →  in-progress  →  complete
                                           ↑
                                  scenarios start here

   The full gameplay-flow helpers (markComplete, unlockRoomDelayed) live below
   unlockRoom and are used by later room demos to chain "this room done → next
   room unlocks with animation" on return-to-hub. */
const ROOM_STATUSES = ['locked', 'unlocking', 'ready', 'in-progress', 'complete'];

/* Reset hub-related state to "fresh run" — every module room locked. Center is
   always implicitly available (it isn't in moduleState; centerRoom.mode drives
   its display). `clearTray` also wipes the plant tray + autopsy log (the
   "Reset all" button in the action zone uses this). */
function resetHubRooms(state, { clearTray = false } = {}) {
  Object.keys(state.moduleState).forEach(k => {
    state.moduleState[k].status = 'locked';
    state.moduleState[k].actionsThisSession = 0;
  });
  if (state.moduleState.substrate)   state.moduleState.substrate.hasAgarGelAssignment = false;
  if (state.moduleState.orientation) state.moduleState.orientation.gravityRevealed = false;
  state.centerRoom.mode = 'seedbank';
  state.centerRoom.harvestReady = [];
  state.run.actionCount = 0;
  state.run.colonyFood = 80;
  state.run.colonyQuota = 100;
  // New run → re-roll the seed rack scatter on next Seed Bay visit, and clear the
  // selection-complete flag (Bible §5 unlock trigger).
  state.run.seedBankSelectionComplete = false;
  state.seedBank.rackLayout = null;
  state.substrateLab = null;   // discard any in-progress Substrate Lab bench
  state.pipeMaze = null;       // discard any in-progress Pipe Maze bench
  state.lightLab = null;       // discard any in-progress Light Lab bench
  state.mixingConsole = null;  // discard any in-progress Mixing Console batch
  state.orientationChamber = null;  // discard any in-progress Orientation Chamber batch
  state.hydroponicBay = null;       // discard any in-progress Hydroponic Bay channels
  state.radiationDome = null;       // discard any in-progress Radiation Dome batch
  state.pollinationDome = null;     // discard any in-progress Pollination Dome session
  state.harvestBay = null;          // discard any in-progress Harvest Bay delivery
  state.run.foodSpent  = 0;
  state.run.foodEarned = 0;
  // Tutorials re-fire every new run (classroom rule — shared machines).
  state.run.tutorialSeen = {};
  state.run.tutorialSkipAll = false;
  if (clearTray) {
    state.tray = [null, null, null, null, null, null, null, null];
    state.deadTray = [];
    state.autopsyLog = [];
    state.ui.selectedSlot = null;
  }
}

/* Unlock a single room. With animate:true (default), plays the locked →
   unlocking → ready fade. With animate:false, jumps straight to ready (used by
   scenario init where rooms start pre-unlocked without the entrance fanfare).
   No-op on rooms that are already past locked. */
function unlockRoom(key, { animate = true } = {}) {
  const m = gameState.moduleState[key];
  if (!m || m.status !== 'locked') return;
  if (!animate) {
    m.status = 'ready';
    renderHub(gameState);
    return;
  }
  m.status = 'unlocking';
  renderHub(gameState);
  // Auto-advance to ready after the unlock animation completes. Re-check the
  // status in the timer — if something else changed it (Devtools override,
  // scenario logic), don't clobber it.
  setTimeout(() => {
    if (m.status === 'unlocking') {
      m.status = 'ready';
      renderHub(gameState);
    }
  }, UNLOCK_FADE_MS + 60);
}

/* Defer an unlock by `delayMs`. Used by room demos when returning to the hub
   after completing a room: the hub slides in over SLIDE_MS, then "pause a few
   frames" before the next room runs its unlocking animation. Callers pass the
   total delay (default: slide + a small buffer). */
function unlockRoomDelayed(key, delayMs) {
  setTimeout(() => unlockRoom(key), delayMs != null ? delayMs : (SLIDE_MS + 150));
}

/* Generic status setter — direct write, no transition. Used by Devtools and by
   scenario init. Pass any value in ROOM_STATUSES. */
function setRoomStatus(key, status) {
  const m = gameState.moduleState[key];
  if (!m) return;
  m.status = status;
  renderHub(gameState);
}

/* Convenience wrappers around setRoomStatus for the two most common gameplay
   transitions. */
function markInProgress(key) { setRoomStatus(key, 'in-progress'); }
function markComplete(key)   { setRoomStatus(key, 'complete'); }


/* ============================================================================
   Snapshot / restore — devtools state-management helpers. Used to capture and
   replay arbitrary game states without going through the unlock sequence,
   reproducing bugs, or sharing a specific configuration between team
   members. Demo 15 will own real persistence; these are testing-only utilities.

   Storage layout: localStorage entries `starseed-snapshot-<slot>` hold the
   JSON-stringified gameState. dumpGameState() prints to console for sharing
   between sessions / users. loadGameStateFromString() accepts either a JSON
   string or a parsed object, merging properties into the live gameState (NOT
   reassigning it, so existing references stay valid).
   ============================================================================ */
function dumpGameState() {
  const json = JSON.stringify(gameState, null, 2);
  console.log('--- gameState snapshot ---');
  console.log(json);
  return json;
}

function loadGameStateFromString(input) {
  const parsed = typeof input === 'string' ? JSON.parse(input) : input;
  Object.assign(gameState.run, parsed.run || {});
  if (parsed.tray)        gameState.tray = parsed.tray;
  if (parsed.deadTray)    gameState.deadTray = parsed.deadTray;
  if (parsed.autopsyLog)  gameState.autopsyLog = parsed.autopsyLog;
  Object.keys(parsed.moduleState || {}).forEach(k => {
    if (gameState.moduleState[k]) {
      Object.assign(gameState.moduleState[k], parsed.moduleState[k]);
    }
  });
  Object.assign(gameState.centerRoom, parsed.centerRoom || {});
  Object.assign(gameState.ui,         parsed.ui         || {});
  // Re-render everything that's visible on a hub-style demo.
  renderHub(gameState);
  renderTray(gameState);
  // Top bar room name follows the current screen.
  const screen = gameState.ui.currentScreen || 'hub';
  const roomName = screen === 'hub'
    ? 'STATION HUB'
    : (ROOMS[screen.replace(/^room:/, '')]?.label || 'STATION HUB');
  renderTopBar({
    roomName,
    food:        gameState.run.colonyFood,
    quota:       gameState.run.colonyQuota,
    actionCount: gameState.run.actionCount,
  });
}

function saveStateToSlot(slot) {
  try {
    localStorage.setItem('starseed-snapshot-' + slot, JSON.stringify(gameState));
    return true;
  } catch (e) {
    console.error('Save failed:', e);
    return false;
  }
}

function loadStateFromSlot(slot) {
  const s = localStorage.getItem('starseed-snapshot-' + slot);
  if (!s) return false;
  try {
    loadGameStateFromString(s);
    return true;
  } catch (e) {
    console.error('Load failed:', e);
    return false;
  }
}

function hasStateInSlot(slot) {
  return localStorage.getItem('starseed-snapshot-' + slot) != null;
}

/* Center room mode toggle. 'seedbank' = default, 'harvest' = green pulse +
   label_harvest_room.png overlay. Center isn't in moduleState; its display
   status is derived from centerRoom.mode (see computeRoomStatus). */
function setCenterMode(mode) {
  gameState.centerRoom.mode = mode;
  renderHub(gameState);
}

/* Read the display status for a room. For center, derive from centerRoom.mode;
   for module rooms, return the stored status field directly. */
function computeRoomStatus(state, key) {
  if (key === 'center') {
    return state.centerRoom.mode === 'harvest' ? 'harvest-ready' : 'ready';
  }
  const m = state.moduleState[key];
  return m ? m.status : 'locked';
}

/* Hub tooltip content. Locked rooms surface the bible §5 unlock condition;
   unlocked rooms show name + current state. Returns an HTML string to match
   the convention used by slotTooltipContent. */
function hubRoomTooltipContent(key, state) {
  const room = ROOMS[key];
  const status = computeRoomStatus(state, key);
  let body = '';
  if (key === 'center') {
    body = state.centerRoom.mode === 'harvest'
      ? `<span class="tt-row"><span class="tt-label tt-cat-pollination">Harvest ready</span><span class="tt-value">collect produce</span></span>`
      : `<span class="tt-row"><span class="tt-label tt-cat-substrate">Seed Bank</span><span class="tt-value">pick starting plants</span></span>`;
  } else if (status === 'locked') {
    const hint = UNLOCK_HINTS[key] || 'Unlock condition not specified.';
    body = `<span class="tt-row"><span class="tt-label tt-cat-cause">Locked</span></span>` +
           `<span class="tt-row hub-unlock-hint">${hint}</span>`;
  } else {
    const phrase = ({
      unlocking:     { cat: 'stage',  label: 'Unlocking',   value: 'coming online' },
      ready:         { cat: 'stage',  label: 'Ready',       value: 'click to enter' },
      'in-progress': { cat: 'water',  label: 'In progress', value: 'work in progress' },
      complete:      { cat: 'health', label: 'Complete',    value: 'this session' },
    })[status] || { cat: 'stage', label: 'Ready', value: 'click to enter' };
    body = `<span class="tt-row"><span class="tt-label tt-cat-${phrase.cat}">${phrase.label}</span>` +
           `<span class="tt-value">${phrase.value}</span></span>`;
  }
  return `<span class="tt-name">${room.label}</span>${body}`;
}

/* Status → cutout CSS class composition. See gameState.moduleState defaults
   for the table. `glow-*` classes carry filter:drop-shadow animations;
   `unlocked` toggles opacity 0 → 1; `unlocking` runs the one-shot fade in. */
const STATUS_CLASSES = {
  'locked':        '',
  'unlocking':     'unlocking',
  'ready':         'unlocked glow-ready',
  'in-progress':   'unlocked glow-in-progress',
  'complete':      'unlocked status-complete',
  'harvest-ready': 'unlocked glow-harvest',
};

/* Diff-based class setter — only adds/removes classes that actually differ
   from the current set. Critical for renderHub: setting `el.className = '...'`
   restarts CSS animations even when the resulting class list is identical
   (the browser treats it as a fresh assignment). classList.add/remove of an
   already-present/already-absent class is a no-op and does NOT restart
   animations, so an unchanged room's pulse keeps its phase across re-renders. */
function setClasses(el, classes) {
  const desired = new Set(classes.filter(Boolean));
  Array.from(el.classList).forEach(c => { if (!desired.has(c)) el.classList.remove(c); });
  desired.forEach(c => { if (!el.classList.contains(c)) el.classList.add(c); });
}

/* Render (or update) the hub map. INCREMENTAL — reuses existing DOM nodes,
   only mutates classes/contents on rooms whose state changed. Re-rendering
   the hub no longer restarts animations on unchanged rooms.

   First call (empty #hub-layer): seeds the base layer; subsequent calls
   reuse it. Per-room: ensure cutout / optional glow-source / hotspot exist,
   then sync their classes against the current status. Harvest label and
   per-state padlock/complete-icon presence are toggled the same way. */
function renderHub(state) {
  const host = document.getElementById('hub-layer');
  if (!host) return;

  // First render: drop in the dimmed base layer. All other elements are
  // created lazily inside the per-room loop below.
  if (!host.querySelector('.hub-base')) {
    const base = document.createElement('img');
    base.className = 'hub-base';
    base.src = assetUrl('hub-dimmed');
    host.appendChild(base);
  }

  Object.entries(ROOMS).forEach(([key, room]) => {
    const status = computeRoomStatus(state, key);
    let stateCls = STATUS_CLASSES[status] || '';
    // Center pulses at run start while it's the only room in play — i.e. until
    // the Seed Bank selection is complete (Bible §5: "center room highlighted →
    // player enters Seed Bank"; also re-pulses if the player left with fewer
    // than 8 picks, since nothing else unlocks until they finish). Once the
    // run is underway the idle ready pulse is stripped as before.
    if (key === 'center' && status === 'ready' && state.run.seedBankSelectionComplete) {
      stateCls = 'unlocked';
    }
    const glowCls = stateCls.split(' ').find(c => c.startsWith('glow-') || c === 'status-complete') || '';

    /* Cutout — the visible PNG. Inserted before any hotspot so z-order is
       cutouts→harvest-label→hotspots (paint order via DOM, hotspots also
       carry z-index:5). */
    let cutout = host.querySelector(`img.hub-room-img[data-key="${key}"]:not(.hub-room-glow-src)`);
    if (!cutout) {
      cutout = document.createElement('img');
      cutout.dataset.key = key;
      cutout.src = assetUrl('hub-room-' + key);
      const firstHotspot = host.querySelector('.hub-room');
      host.insertBefore(cutout, firstHotspot || null);
    }
    const cutoutCls = (room.glowAsset && glowCls)
      ? stateCls.replace(glowCls, '').replace(/\s+/g, ' ').trim()
      : stateCls;
    setClasses(cutout, ['hub-room-img', ...cutoutCls.split(/\s+/).filter(Boolean)]);

    /* Glow source — separate PNG behind the cutout, used only by rooms whose
       cutout includes structure (walkways, corridor stubs) we want excluded
       from the glow halo. Created/removed on demand. */
    if (room.glowAsset) {
      let glowImg = host.querySelector(`.hub-room-glow-src[data-key="${key}"]`);
      if (glowCls) {
        if (!glowImg) {
          glowImg = document.createElement('img');
          glowImg.dataset.key = key;
          glowImg.src = assetUrl(room.glowAsset);
          host.insertBefore(glowImg, cutout);
        }
        setClasses(glowImg, ['hub-room-img', 'hub-room-glow-src', 'unlocked', glowCls]);
      } else if (glowImg) {
        glowImg.remove();
      }
    }

    /* Hotspot div — created once. Click handler reads status at click time
       so it stays correct as state changes (no need to re-attach). Tooltip
       contentFn closure captures `gameState` (live), so it sees current state
       on every hover without re-attaching. */
    let hotspot = host.querySelector(`.hub-room[data-key="${key}"]`);
    if (!hotspot) {
      hotspot = document.createElement('div');
      hotspot.dataset.key = key;
      hotspot.style.left   = room.hotspot.x + 'px';
      hotspot.style.top    = room.hotspot.y + 'px';
      hotspot.style.width  = room.hotspot.w + 'px';
      hotspot.style.height = room.hotspot.h + 'px';
      hotspot.addEventListener('click', () => {
        if (computeRoomStatus(gameState, key) === 'locked') return;
        transitionTo('room:' + key, room.dir);
      });
      attachTooltip(hotspot, () => hubRoomTooltipContent(key, gameState));
      host.appendChild(hotspot);
    }
    setClasses(hotspot, ['hub-room', 'hub-room-' + status]);
    hotspot.style.cursor = status === 'locked' ? '' : 'pointer';

    /* Padlock — visible while locked OR unlocking. The .fading-out class
       added during 'unlocking' fades it in parallel with the cutout's
       grayscale-to-color fade-in (both keyed off --unlock-fade-period). */
    let padlock = hotspot.querySelector('.hub-padlock');
    const wantPadlock = status === 'locked' || status === 'unlocking';
    if (wantPadlock && !padlock) {
      padlock = document.createElement('img');
      padlock.className = 'hub-padlock';
      padlock.src = assetUrl('padlock');
      const off = room.padlockOffset;
      if (off && (off.x || off.y)) {
        padlock.style.transform = `translate(calc(-50% + ${off.x || 0}px), calc(-50% + ${off.y || 0}px))`;
      }
      hotspot.appendChild(padlock);
    } else if (!wantPadlock && padlock) {
      padlock.remove();
      padlock = null;
    }
    if (padlock) padlock.classList.toggle('fading-out', status === 'unlocking');

    /* Complete icon — present only while status === 'complete'. Positioned
       absolutely on the HUB LAYER (not inside the hotspot) using per-room
       COMPLETE_ANCHORS coords, so it can sit at the end of each room's title
       banner regardless of where the rectangular hotspot edges fall. */
    let completeIcon = host.querySelector(`.hub-status-icon[data-key="${key}"]`);
    if (status === 'complete') {
      if (!completeIcon) {
        completeIcon = document.createElement('img');
        completeIcon.className = 'hub-status-icon';
        completeIcon.dataset.key = key;
        completeIcon.src = assetUrl('complete');
        host.appendChild(completeIcon);
      }
      const anchor = COMPLETE_ANCHORS[key];
      if (anchor) {
        completeIcon.style.left = anchor.x + 'px';
        completeIcon.style.top  = anchor.y + 'px';
      }
    } else if (completeIcon) {
      completeIcon.remove();
    }
  });

  /* Harvest label — single element, present only when center is in harvest
     mode. Inserted between cutouts and hotspots so it paints above all room
     interiors but below the (z-index:5) hotspots. */
  const wantHarvest = state.centerRoom.mode === 'harvest';
  let harvestLabel = host.querySelector('.hub-harvest-label');
  if (wantHarvest && !harvestLabel) {
    harvestLabel = document.createElement('img');
    harvestLabel.className = 'hub-harvest-label';
    harvestLabel.src = assetUrl('hub-label-harvest');
    const firstHotspot = host.querySelector('.hub-room');
    host.insertBefore(harvestLabel, firstHotspot || null);
  } else if (!wantHarvest && harvestLabel) {
    harvestLabel.remove();
  }
}

/* Generic two-layer slide engine. Both #hub-layer and the destination .screen-
   layer move together in opposite directions: "walking through the door" —
   the room appears from `dir`, the hub recedes the opposite way. Entering and
   returning are symmetric.

   screenId formats:
     'hub'          → return to hub
     'room:<key>'   → enter a placeholder room                                   */
function transitionTo(screenId, dir) {
  const panel = document.getElementById('game-panel');
  if (!panel) return;
  const hub = document.getElementById('hub-layer');
  if (!hub) return;

  const isReturn = screenId === 'hub';

  if (!isReturn) {
    const key = screenId.slice(5);
    // Set the screen BEFORE building — room builders run their tray sync during
    // build, and the syncs are screen-guarded (they no-op unless their room is
    // current, so a pending fly-back render can't resurrect tags after exit).
    gameState.ui.currentScreen = screenId;
    // Real room implementations register a builder via registerRoomBuilder();
    // everything else still gets the generic Demo 03 placeholder.
    const screen = (ROOM_BUILDERS[key] || buildPlaceholderRoom)(key);
    screen.classList.add('screen-layer', 'slide-from-' + dir);
    panel.appendChild(screen);

    // Force reflow so the starting transform is applied before we remove it
    void screen.offsetWidth;

    hub.classList.add('slide-to-' + invertDir(dir));
    screen.classList.remove('slide-from-' + dir);

    setTimeout(() => { hub.style.display = 'none'; }, SLIDE_MS);

    renderTopBar({
      // The center room is dual-role (Bible §5): its top-bar name follows the mode.
      roomName:    (key === 'center' && gameState.centerRoom.mode === 'harvest')
                     ? 'HARVEST BAY'
                     : ROOMS[key].roomLabel || ROOMS[key].label,
      food:        gameState.run.colonyFood,
      quota:       gameState.run.colonyQuota,
      actionCount: gameState.run.actionCount,
    });
    // Demo 15b — first visit to a room raises its coach-marks tour (game only).
    const tourKey = tutTourKeyForScreen(screenId);
    setTimeout(() => {
      if (gameState.ui.currentScreen === screenId) maybeShowTour(tourKey);
    }, SLIDE_MS + 150);
  } else {
    // Return — slide current screen-layer back out, hub slides back in
    const screen = panel.querySelector('.screen-layer');
    hub.style.display = '';
    // Force a layout pass so the browser registers the slid-out hub position
    // BEFORE we remove the slide-to class — otherwise the two style mutations
    // get batched and the transition is skipped entirely.
    void hub.offsetWidth;
    hub.classList.remove('slide-to-' + invertDir(dir));

    if (screen) {
      void screen.offsetWidth;
      screen.classList.add('slide-from-' + dir);
      setTimeout(() => screen.remove(), SLIDE_MS);
    }

    renderTopBar({
      roomName:    'STATION HUB',
      food:        gameState.run.colonyFood,
      quota:       gameState.run.colonyQuota,
      actionCount: gameState.run.actionCount,
    });
    gameState.ui.currentScreen = 'hub';
    onHubArrival();   // Demo 15 — flush queued stage-unlocks + autosave
  }
}

function invertDir(dir) {
  if (dir === 'center') return 'center';
  return ({
    'left':       'right',
    'right':      'left',
    'up':         'down',
    'down':       'up',
    'up-left':    'down-right',
    'up-right':   'down-left',
    'down-left':  'up-right',
    'down-right': 'up-left',
  })[dir] || 'right';
}

/* Generic placeholder for any room. Demo 03 mounts these for all 9 rooms;
   later demos replace them with real room implementations one at a time. */
function buildPlaceholderRoom(key) {
  const room = ROOMS[key];
  const wrap = document.createElement('div');
  wrap.className = 'screen-placeholder';
  wrap.dataset.key = key;

  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'back-to-hub';
  back.textContent = '← Back to hub';
  back.addEventListener('click', () => transitionTo('hub', room.dir));
  wrap.appendChild(back);

  const title = document.createElement('div');
  title.className = 'screen-title';
  title.textContent = room.label;
  wrap.appendChild(title);

  const sub = document.createElement('div');
  sub.className = 'screen-sub';
  sub.textContent = 'Placeholder · Demo 03';
  wrap.appendChild(sub);

  return wrap;
}

/* Top bar — present on every screen. Rebuilds the full strip on each call;
   cheap enough since the bar is shallow. */
function renderTopBar({ roomName, food, quota, actionCount }) {
  const bar = document.getElementById('top-bar');
  if (!bar) return;
  bar.innerHTML = '';

  const name = document.createElement('span');
  name.className = 'tb-room-name';
  name.textContent = roomName;
  bar.appendChild(name);

  const foodWrap = document.createElement('div');
  foodWrap.className = 'tb-food';
  const label = document.createElement('span');
  label.className = 'tb-food-label';
  label.textContent = 'FOOD';
  foodWrap.appendChild(label);

  const track = document.createElement('div');
  track.className = 'food-bar';
  const fill = document.createElement('div');
  fill.className = 'food-fill';
  const pct = quota > 0 ? Math.max(0, Math.min(100, (food / quota) * 100)) : 0;
  fill.style.width = pct + '%';
  if (pct < 25)       fill.classList.add('critical');
  else if (pct < 50)  fill.classList.add('warn');
  track.appendChild(fill);
  foodWrap.appendChild(track);

  const num = document.createElement('span');
  num.className = 'tb-food-num';
  num.textContent = food + ' / ' + quota;
  foodWrap.appendChild(num);

  bar.appendChild(foodWrap);

  const ac = document.createElement('span');
  ac.className = 'tb-action-count';
  ac.textContent = 'ACTIONS: ' + actionCount;
  bar.appendChild(ac);

  // Demo 15b — game-only help button: replays the current screen's tour.
  if (_gameMode) {
    const help = document.createElement('button');
    help.type = 'button';
    help.className = 'tb-help';
    help.textContent = '?';
    help.addEventListener('click', replayCurrentTour);
    attachTooltip(help, () =>
      `<span class="tt-name">Tutorial</span>` +
      `<span class="tt-row hub-unlock-hint">Replay this screen's walkthrough</span>`);
    bar.appendChild(help);
  }
}

/* Convenience — for room screens that change food during play. Updates state
   and re-renders the top bar without losing the current room name. */
function updateFoodBar(food, quota) {
  gameState.run.colonyFood = food;
  if (quota != null) gameState.run.colonyQuota = quota;
  const nameEl = document.querySelector('.tb-room-name');
  renderTopBar({
    roomName:    nameEl ? nameEl.textContent : 'STATION HUB',
    food:        gameState.run.colonyFood,
    quota:       gameState.run.colonyQuota,
    actionCount: gameState.run.actionCount,
  });
}


/* ============================================================================
   Room-builder registry (Demo 04)
   transitionTo() calls the registered builder for a room key if present, else
   falls back to buildPlaceholderRoom. This is the seam every real room demo
   (05+) plugs into: registerRoomBuilder('<key>', fn) where fn(key) returns the
   screen-layer DOM element.
   ============================================================================ */
const ROOM_BUILDERS = {};
function registerRoomBuilder(key, fn) { ROOM_BUILDERS[key] = fn; }

/* Convert an element's viewport rect into #stage-local CSS coords (undoing the
   fullscreen --fs-scale). Used to fly the floating packet between the rack and
   the tray, which live in different containers on the stage. */
function stageLocalRect(el) {
  const stage = document.getElementById('stage');
  const sr = stage.getBoundingClientRect();
  const er = el.getBoundingClientRect();
  const scale = parseFloat(getComputedStyle(document.documentElement)
                .getPropertyValue('--fs-scale')) || 1;
  return {
    left: (er.left - sr.left) / scale,
    top:  (er.top  - sr.top)  / scale,
    w:    er.width  / scale,
    h:    er.height / scale,
  };
}


/* ============================================================================
   Demo 04 — Seed Bank (center room, seedbank mode)

   Layout: the 20 species sit as small packet thumbnails scattered across 5
   family shelves (positions from SEED_BANK_RACK, rolled once per run). Clicking
   a packet floats a large card to screen centre with Take It / Put Back buttons;
   clicking the card flips it (rotateY) to a trait info back face. Take It flies
   the packet into the next empty tray slot; clicking a planted tray slot returns
   it to the rack. "Done picking" exits to the hub and (when all 8 are filled)
   fires the Bible §5 substrate + water unlocks.
   ============================================================================ */

/* Floating-card size (front and back share it — it's one flipping element). */
const SEED_BANK_FLOAT = { w: 215, h: 330 };
const SB_FLOAT_MS = 380;   // fly + scale duration; keep in sync with CSS

/* Packet sub-layout, as fractions of the packet's own w/h (tunable). */
const PACKET_WINDOW    = { l: 0.14, r: 0.86, t: 0.24, b: 0.78 };  // plant illustration window
// Front trait boxes — PIXELS relative to the floating card (SEED_BANK_FLOAT
// 215×330). Only the detailed floating card draws these, so absolute px give the
// finest control. cy = row center Y; firstCx/stepCx = box-center X start + pitch.
const PACKET_TRAIT_ROW = { cy: 293, boxW: 34, boxH: 39, firstCx: 42, stepCx: 43 };

/* 3 icon+pip trait boxes; the 4th box is the pollination variant sprite.
   `cat` matches the tray-tooltip category colors (tt-cat-*) so the packet and
   the tooltip read the same. */
const PACKET_TRAITS = [
  { field: 'water',    icon: 'trait-water',    cat: 'water',    levels: { low: 1, medium: 2, high: 3 } },
  { field: 'light',    icon: 'trait-spectrum', cat: 'light',    levels: { 'red-heavy': 1, balanced: 2, 'blue-heavy': 3 } },
  { field: 'nutrient', icon: 'trait-nutrient', cat: 'nutrient', levels: { light: 1, medium: 2, heavy: 3 } },
];
const POLLINATION_ICON = {
  self:   'trait-pollination-self',
  insect: 'trait-pollination-insect',
  wind:   'trait-pollination-wind',
};

/* Back-face rows: 4 visible (bright, with values) + 4 hidden (dimmed ???).
   Photoperiod is intentionally omitted to fit the 8-band back-face art. */
const SEED_BANK_VISIBLE = [
  { field: 'water',       label: 'Water',       cat: 'water' },
  { field: 'light',       label: 'Light',       cat: 'light' },
  { field: 'nutrient',    label: 'Nutrient',    cat: 'nutrient' },
  { field: 'pollination', label: 'Pollination', cat: 'pollination' },
];
const SEED_BANK_HIDDEN = [
  { label: 'Radiation', cat: 'revealed' },
  { label: 'Gravity',   cat: 'revealed' },
  { label: 'pH',        cat: 'revealed' },
  { label: 'Substrate', cat: 'revealed' },
];

const VEG_STAGE_IDX = PLANT_STAGES.indexOf('vegetative');

function isSpeciesLocked(id) { return gameState.seedBank.locked.includes(+id); }

/* Roll the horizontal scatter for all 5 rows. Same algorithm as the 04a tool:
   n sorted uniforms expanded so neighbours keep >= minGap and stay in bounds. */
function computeSeedBankLayout() {
  const R = SEED_BANK_RACK;
  const pw = R.packetW;
  const layout = [];
  R.rowOrder.forEach((family, r) => {
    const ids = FAMILY_ROWS[family];
    const n = ids.length;
    const cy = R.topRowY + r * R.rowPitch + (R.rowYAdjust[r] || 0);
    const L = R.rackLeft, Rr = R.rackRight;
    const span = (Rr - pw) - L;
    let xs;
    if (n <= 1) {
      xs = [L + Math.random() * Math.max(0, span)];
    } else {
      const stride = pw + R.minGap;
      const free = span - (n - 1) * stride;
      if (free < 0) {
        const step = span / (n - 1);
        xs = ids.map((_, i) => L + i * step);
      } else {
        const us = ids.map(() => Math.random()).sort((a, b) => a - b);
        xs = us.map((u, i) => L + u * free + i * stride);
      }
    }
    ids.forEach((speciesId, c) => {
      layout.push({ speciesId, family, row: r, col: c, x: Math.round(xs[c]), y: Math.round(cy) });
    });
  });
  return layout;
}
function ensureSeedBankLayout(state) {
  if (!state.seedBank.rackLayout) state.seedBank.rackLayout = computeSeedBankLayout();
  return state.seedBank.rackLayout;
}

/* Compose a packet face (frame + composited vegetative plant). detailed=true
   also draws the name label + 4 trait boxes (the big floating front face). */
function buildPacketFace(speciesId, family, w, h, detailed) {
  const sp = SPECIES[speciesId];
  const face = document.createElement('div');
  face.className = 'sb-packet-face';
  face.style.width  = w + 'px';
  face.style.height = h + 'px';
  face.style.backgroundImage = `url('${assetUrl(FAMILY_PACKETS[family])}')`;

  // Vegetative plant sprite in the illustration window.
  const win = PACKET_WINDOW;
  const cw = (win.r - win.l) * w;
  const ch = (win.b - win.t) * h;
  const nudge = (FAMILY_PLANT_NUDGE[family] || 0) * (w / SEED_BANK_RACK.packetW);
  const col = VEG_STAGE_IDX % PLANT_SHEET_COLS;
  const row = (VEG_STAGE_IDX / PLANT_SHEET_COLS) | 0;
  const plant = document.createElement('div');
  plant.className = 'sb-packet-plant';
  plant.style.left = (win.l * w + nudge) + 'px';
  plant.style.top  = (win.t * h) + 'px';
  plant.style.width  = cw + 'px';
  plant.style.height = ch + 'px';
  plant.style.backgroundImage = `url('${assetUrl(FAMILY_SHEETS[family])}')`;
  plant.style.backgroundSize  = `${cw * PLANT_SHEET_COLS}px ${ch * PLANT_SHEET_ROWS}px`;
  plant.style.backgroundPosition = `-${col * cw}px -${row * ch}px`;
  plant.style.filter = SPECIES_FILTERS[speciesId] || 'none';
  face.appendChild(plant);

  if (detailed) {
    // Name lives in a band positioned/sized by CSS vars; the inner <span> is the
    // measured text so fitSeedBankName() can shrink it to fit the label.
    const nm = document.createElement('div');
    nm.className = 'sb-card-name';
    const nmText = document.createElement('span');
    nmText.textContent = sp.name;
    nm.appendChild(nmText);
    face.appendChild(nm);

    const tr = PACKET_TRAIT_ROW;     // pixel coords (relative to the float card)
    const boxW = tr.boxW, boxH = tr.boxH, cyy = tr.cy;
    for (let i = 0; i < 4; i++) {
      const cx = tr.firstCx + i * tr.stepCx;
      const box = document.createElement('div');
      box.className = 'sb-trait-box';
      box.style.left   = (cx - boxW / 2) + 'px';
      box.style.top    = (cyy - boxH / 2) + 'px';
      box.style.width  = boxW + 'px';
      box.style.height = boxH + 'px';
      if (i < 3) {
        const t = PACKET_TRAITS[i];
        box.classList.add('tt-cat-' + t.cat);   // category color → drives the pips
        const icon = document.createElement('div');
        icon.className = 'sb-trait-icon';
        icon.style.backgroundImage = `url('${assetUrl(t.icon)}')`;
        box.appendChild(icon);
        const pips = document.createElement('div');
        pips.className = 'sb-trait-pips';
        const lvl = t.levels[sp[t.field]] || 0;
        for (let p = 0; p < 3; p++) {
          const pip = document.createElement('span');
          pip.className = 'sb-pip' + (p < lvl ? ' on' : '');
          pips.appendChild(pip);
        }
        box.appendChild(pips);
      } else {
        const icon = document.createElement('div');
        icon.className = 'sb-trait-icon poll';
        icon.style.backgroundImage =
          `url('${assetUrl(POLLINATION_ICON[sp.pollination] || 'trait-pollination-self')}')`;
        box.appendChild(icon);
      }
      face.appendChild(box);
    }
  }
  return face;
}

/* The card's back face: seedinfo_back.png frame + JS-rendered trait rows. */
function buildPacketBack(speciesId, w, h) {
  const sp = SPECIES[speciesId];
  const back = document.createElement('div');
  back.className = 'sb-packet-back';
  back.style.width  = w + 'px';
  back.style.height = h + 'px';
  back.style.backgroundImage = `url('${assetUrl('packet-back')}')`;

  const title = document.createElement('div');
  title.className = 'sb-back-title';
  title.textContent = sp.name;
  back.appendChild(title);

  // Two independently-positioned groups — the back-face art puts a wider divider
  // between the top 4 (visible) and bottom 4 (hidden) bands, so even spacing of
  // all 8 won't line up.
  const topRows = document.createElement('div');
  topRows.className = 'sb-back-rows group-top';
  const botRows = document.createElement('div');
  botRows.className = 'sb-back-rows group-bottom';
  const addRow = (container, label, value, dim, cat) => {
    const row = document.createElement('div');
    row.className = 'sb-back-row' + (dim ? ' dim' : '');
    row.innerHTML = `<span class="sb-back-label tt-cat-${cat}">${label}</span>` +
                    `<span class="sb-back-value">${value}</span>`;
    container.appendChild(row);
  };
  SEED_BANK_VISIBLE.forEach(t => addRow(topRows, t.label, sp[t.field], false, t.cat));
  SEED_BANK_HIDDEN.forEach(t  => addRow(botRows, t.label, '???', true, t.cat));
  back.appendChild(topRows);
  back.appendChild(botRows);
  return back;
}

function seedPacketTooltip(id) {
  const sp = SPECIES[id];
  if (isSpeciesLocked(id)) {
    return `<span class="tt-name">${sp.name}</span>` +
           `<span class="tt-row"><span class="tt-label tt-cat-cause">Locked</span></span>` +
           `<span class="tt-row">Not available in this scenario.</span>`;
  }
  return `<span class="tt-name">${sp.name}</span>` +
         `<span class="tt-row">${sp.notes || ''}</span>`;
}

/* Builder + incremental renderer ------------------------------------------- */
function buildSeedBankRoom(key) {
  // The center room is mode-aware (Bible §5 dual role): 'harvest' mode swaps
  // in the Harvest Bay (Demo 13); default is the Seed Bank below.
  if (gameState.centerRoom.mode === 'harvest') return buildHarvestBay(key);

  const wrap = document.createElement('div');
  wrap.className = 'seedbank-screen';
  wrap.dataset.key = key;

  const bg = document.createElement('img');
  bg.className = 'sb-bg';
  bg.src = assetUrl('bg-seedbank');
  wrap.appendChild(bg);

  const rack = document.createElement('div');
  rack.className = 'sb-rack';
  wrap.appendChild(rack);

  // Seed-bank-only tray behavior + exit button.
  setSlotClickHandler(seedBankSlotClick);
  setTrayClickHint('Click to put back');
  updateSeedBankExitButton();

  renderSeedBank(gameState, wrap);
  return wrap;
}

/* Incremental — builds the 20 rack packets once, then only syncs lock state on
   re-renders (the rack itself never moves within a run). */
function renderSeedBank(state, screenEl) {
  const wrap = screenEl || document.querySelector('.seedbank-screen');
  if (!wrap) return;
  const rack = wrap.querySelector('.sb-rack');
  const layout = ensureSeedBankLayout(state);
  const R = SEED_BANK_RACK;

  if (!rack.querySelector('.sb-rack-packet')) {
    layout.forEach(entry => {
      const pk = document.createElement('div');
      pk.className = 'sb-rack-packet';
      pk.dataset.species = entry.speciesId;
      pk.style.left   = entry.x + 'px';
      pk.style.top    = (entry.y - R.packetH / 2) + 'px';
      pk.style.width  = R.packetW + 'px';
      pk.style.height = R.packetH + 'px';
      pk.appendChild(buildPacketFace(entry.speciesId, entry.family, R.packetW, R.packetH, false));

      const lock = document.createElement('div');
      lock.className = 'sb-lock';
      lock.style.backgroundImage = `url('${assetUrl('packet-locked')}')`;
      pk.appendChild(lock);

      pk.addEventListener('click', () => {
        if (isSpeciesLocked(entry.speciesId)) {
          // Clicking does nothing for a locked species — but the global mousedown
          // handler just hid the tooltip; re-assert the "why locked" hint.
          showTooltipImmediately(pk, seedPacketTooltip(entry.speciesId));
          return;
        }
        openFloatingPacket(entry, pk);
      });
      attachTooltip(pk, () => seedPacketTooltip(entry.speciesId));
      rack.appendChild(pk);
    });
  }

  rack.querySelectorAll('.sb-rack-packet').forEach(pk => {
    pk.classList.toggle('locked', isSpeciesLocked(+pk.dataset.species));
  });
}

/* Floating card ------------------------------------------------------------- */
function openFloatingPacket(entry, rackEl) {
  if (gameState.ui.seedBankFloatingPacket) return;  // one at a time
  const stage = document.getElementById('stage');
  if (!stage) return;
  const FLOAT = SEED_BANK_FLOAT;

  const layer = document.createElement('div');
  layer.className = 'sb-float-layer';

  const backdrop = document.createElement('div');
  backdrop.className = 'sb-float-backdrop';
  backdrop.addEventListener('click', putBackFloating);
  layer.appendChild(backdrop);

  const cardLeft = Math.round((1280 - FLOAT.w) / 2);
  const cardTop  = 60 + Math.round((580 - FLOAT.h) / 2) - 20;

  const wrap = document.createElement('div');
  wrap.className = 'sb-float-wrap';
  wrap.style.left   = cardLeft + 'px';
  wrap.style.top    = cardTop + 'px';
  wrap.style.width  = FLOAT.w + 'px';
  wrap.style.height = FLOAT.h + 'px';

  const flip = document.createElement('div');
  flip.className = 'card-flip';
  const front = document.createElement('div');
  front.className = 'card-face front';
  front.appendChild(buildPacketFace(entry.speciesId, entry.family, FLOAT.w, FLOAT.h, true));
  const back = document.createElement('div');
  back.className = 'card-face back';
  back.appendChild(buildPacketBack(entry.speciesId, FLOAT.w, FLOAT.h));
  flip.appendChild(front);
  flip.appendChild(back);
  flip.addEventListener('click', () => flip.classList.toggle('flipped'));
  wrap.appendChild(flip);
  layer.appendChild(wrap);

  const btns = document.createElement('div');
  btns.className = 'sb-float-buttons';
  btns.style.left  = cardLeft + 'px';
  btns.style.top   = (cardTop + FLOAT.h + 14) + 'px';
  btns.style.width = FLOAT.w + 'px';
  btns.innerHTML = `<button class="sb-float-btn take">Take It</button>` +
                   `<button class="sb-float-btn put">Put Back</button>`;
  btns.querySelector('.take').addEventListener('click', takeFloating);
  btns.querySelector('.put').addEventListener('click', putBackFloating);
  layer.appendChild(btns);

  stage.appendChild(layer);
  fitSeedBankName();   // shrink the name to its label now that it's laid out

  // FLIP fly-in: start the card scaled/translated onto the rack thumbnail, then
  // release to its centred resting transform.
  const from = stageLocalRect(rackEl);
  const s  = from.w / FLOAT.w;
  const tx = from.left - cardLeft;
  const ty = from.top  - cardTop;
  wrap.style.transformOrigin = 'top left';
  // Seed the start transform with the transition OFF so it snaps onto the rack
  // thumbnail, then re-enable and release to centre — a clean zoom-in that's the
  // exact reverse of Put Back.
  wrap.style.transition = 'none';
  wrap.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
  void wrap.offsetWidth;
  wrap.style.transition = '';
  requestAnimationFrame(() => {
    layer.classList.add('open');
    wrap.style.transform = 'translate(0, 0) scale(1)';
  });

  gameState.ui.seedBankFloatingPacket = { entry, layer, wrap, btns, backdrop, cardLeft, cardTop, scale: s, tx, ty, closing: false };
}

function putBackFloating() {
  const f = gameState.ui.seedBankFloatingPacket;
  if (!f || f.closing) return;
  f.closing = true;
  f.layer.classList.remove('open');
  f.wrap.querySelector('.card-flip').classList.remove('flipped');
  // Morph the card back into the plain rack thumbnail: the frame + plant shrink
  // exactly onto the rack packet beneath, while the extra detail (name + trait
  // boxes) fades out — so the final removal has nothing to "pop".
  f.wrap.classList.add('putting-back');
  f.wrap.style.transform = `translate(${f.tx}px, ${f.ty}px) scale(${f.scale})`;
  setTimeout(() => {
    f.layer.remove();
    gameState.ui.seedBankFloatingPacket = null;
  }, SB_FLOAT_MS);
}

/* Auto-shrink the open card's name to fit its label band. --sb-name-fs is the
   MAX size; if the text overflows the band (width or height) it steps down until
   it fits (floor 6px). Runs on open, on front rebuild, and on name devtools. */
function fitSeedBankName() {
  const box = document.querySelector('.sb-float-wrap .card-face.front .sb-card-name');
  const span = box && box.firstElementChild;
  if (!span) return;
  const maxFs = parseFloat(getComputedStyle(document.documentElement)
                .getPropertyValue('--sb-name-fs')) || 15;
  let fs = maxFs;
  span.style.fontSize = fs + 'px';
  // span fills the band (block, width:100%): scrollWidth > clientWidth means a
  // word is wider than the band; offsetHeight > box height means too many lines.
  let guard = 100;
  while (guard-- > 0 && fs > 6 &&
         (span.scrollWidth > span.clientWidth + 0.5 || span.offsetHeight > box.clientHeight + 0.5)) {
    fs -= 0.5;
    span.style.fontSize = fs + 'px';
  }
}

/* Rebuild the open card's front face in place — used by the trait-placement
   devtools so PACKET_TRAIT_ROW tweaks preview live. No-op if nothing is open. */
function refreshFloatingFront() {
  const f = gameState.ui.seedBankFloatingPacket;
  if (!f) return;
  const front = f.wrap.querySelector('.card-face.front');
  if (!front) return;
  front.innerHTML = '';
  front.appendChild(buildPacketFace(f.entry.speciesId, f.entry.family, SEED_BANK_FLOAT.w, SEED_BANK_FLOAT.h, true));
  fitSeedBankName();
}

function takeFloating() {
  const f = gameState.ui.seedBankFloatingPacket;
  if (!f || f.closing) return;
  const slot = gameState.tray.findIndex(p => !p);
  if (slot === -1) { putBackFloating(); return; }   // tray full
  f.closing = true;

  const slotEl = document.querySelector(`#tray .slot[data-idx="${slot}"]`);
  const to = slotEl ? stageLocalRect(slotEl)
                    : { left: f.cardLeft, top: f.cardTop + 420, w: 60, h: 60 };
  const s  = to.w / SEED_BANK_FLOAT.w;
  const tx = to.left - f.cardLeft + (to.w - SEED_BANK_FLOAT.w * s) / 2;
  const ty = to.top  - f.cardTop;

  f.wrap.querySelector('.card-flip').classList.remove('flipped');
  f.layer.classList.add('taking');   // fade out backdrop + buttons
  f.wrap.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
  f.wrap.style.opacity = '0';

  setTimeout(() => {
    f.layer.remove();
    gameState.ui.seedBankFloatingPacket = null;
    gameState.tray[slot] = createPlant(f.entry.speciesId, slot);
    renderTray(gameState);
    updateSeedBankExitButton();
  }, SB_FLOAT_MS);
}

/* Tray click in the Seed Bank = return that plant to the rack (free the slot),
   with a fly-back animation that mirrors Take It. */
function seedBankSlotClick(idx) {
  if (gameState.tray[idx]) returnSeedToRack(idx);
  return true;   // suppress the default select-toggle while in the Seed Bank
}

/* Free the slot immediately, then fly a small packet from the slot back up to
   its species' shelf position, fading as it lands (the rack packet is always
   there underneath). */
function returnSeedToRack(idx) {
  const plant = gameState.tray[idx];
  if (!plant) return;
  const stage  = document.getElementById('stage');
  const slotEl = document.querySelector(`#tray .slot[data-idx="${idx}"]`);
  const rackEl = document.querySelector(`.sb-rack-packet[data-species="${plant.speciesId}"]`);

  // Free the slot right away.
  gameState.tray[idx] = null;
  gameState.ui.selectedSlot = null;
  renderTray(gameState);
  updateSeedBankExitButton();

  if (!stage || !slotEl || !rackEl) return;   // can't animate — removal already done

  const to   = stageLocalRect(rackEl);   // resting place = the shelf packet
  const from = stageLocalRect(slotEl);   // start = the tray slot

  const fly = document.createElement('div');
  fly.className = 'sb-return-fly';
  fly.style.left   = to.left + 'px';
  fly.style.top    = to.top + 'px';
  fly.style.width  = to.w + 'px';
  fly.style.height = to.h + 'px';
  fly.appendChild(buildPacketFace(plant.speciesId, plant.spriteFamily, to.w, to.h, false));
  stage.appendChild(fly);

  // Start the packet scaled/translated onto the tray slot, then release to the
  // shelf while fading out.
  const s  = from.h / to.h;
  const tx = (from.left + from.w / 2) - (to.left + to.w * s / 2);
  const ty = (from.top  + from.h / 2) - (to.top  + to.h * s / 2);
  fly.style.transformOrigin = 'top left';
  fly.style.transition = 'none';
  fly.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
  void fly.offsetWidth;
  fly.style.transition = 'transform 320ms cubic-bezier(0.2, 0.8, 0.25, 1), opacity 320ms ease';
  requestAnimationFrame(() => {
    fly.style.transform = 'translate(0, 0) scale(1)';
    fly.style.opacity = '0';
  });
  setTimeout(() => fly.remove(), 340);
}

/* Exit ---------------------------------------------------------------------- */
function updateSeedBankExitButton() {
  const filled = gameState.tray.filter(Boolean).length;
  setActionZone([{ label: `Done picking<br>${filled}/8`, onClick: exitSeedBank }]);
}

/* Gatekeeper for the Done-picking button: ALWAYS confirms. With all 8 filled
   it's a "ready to begin?" confirmation; with fewer it becomes a warning —
   the button shakes + flashes red first, then the same dialog opens in warn
   mode. The actual leave happens in doExitSeedBank(). */
function exitSeedBank() {
  const filled = gameState.tray.filter(Boolean).length;
  if (filled < 8) {
    shakeExitButton();
    setTimeout(() => openExitConfirm(filled), 420);   // let the shake play first
  } else {
    openExitConfirm(filled);
  }
}

function shakeExitButton() {
  const btn = document.querySelector('.action-zone .action-btn');
  if (!btn) return;
  btn.classList.remove('sb-warn');
  void btn.offsetWidth;          // restart the animation
  btn.classList.add('sb-warn');
  setTimeout(() => btn.classList.remove('sb-warn'), 650);
}

function openExitConfirm(filled) {
  if (document.querySelector('.sb-confirm-layer')) return;
  const stage = document.getElementById('stage');
  if (!stage) return;
  const warn = filled < 8;

  const layer = document.createElement('div');
  layer.className = 'sb-confirm-layer';
  const panel = document.createElement('div');
  panel.className = 'sb-confirm' + (warn ? ' warn' : '');
  const title = warn ? 'Hold on!' : 'Ready to begin?';
  const msg = warn
    ? `You've picked <b>${filled} of 8</b> plants. Empty slots mean fewer crops for the colony. Leave the Seed Bank anyway?`
    : `These are your <b>8</b> plants for the run — once you leave, you'll start growing them. Sure about this cohort?`;
  panel.innerHTML = `
    <div class="sb-confirm-title">${title}</div>
    <div class="sb-confirm-msg">${msg}</div>
    <div class="sb-confirm-btns">
      <button class="sb-confirm-btn cancel">Keep picking</button>
      <button class="sb-confirm-btn ok">${warn ? 'Leave anyway' : 'Begin run'}</button>
    </div>`;
  layer.appendChild(panel);
  panel.querySelector('.cancel').addEventListener('click', closeExitConfirm);
  panel.querySelector('.ok').addEventListener('click', () => { closeExitConfirm(); doExitSeedBank(); });
  stage.appendChild(layer);
  // Intentionally NO backdrop-click or ESC dismissal — unlike every other modal,
  // this confirmation can ONLY be closed by its two buttons.
}

function closeExitConfirm() {
  const l = document.querySelector('.sb-confirm-layer');
  if (l) l.remove();
}

/* The actual leave. Only marks selection complete + fires the Bible §5
   substrate/water unlocks when all 8 slots are filled. */
function doExitSeedBank() {
  const complete = gameState.tray.filter(Boolean).length >= 8;
  if (complete) gameState.run.seedBankSelectionComplete = true;

  closeExitConfirm();
  if (gameState.ui.seedBankFloatingPacket) {
    gameState.ui.seedBankFloatingPacket.layer.remove();
    gameState.ui.seedBankFloatingPacket = null;
  }
  setSlotClickHandler(null);
  setTrayClickHint(null);
  setActionZone([]);

  transitionTo('hub', 'center');

  if (complete) {
    unlockRoomDelayed('substrate');
    unlockRoomDelayed('water');
  }
}

registerRoomBuilder('center', buildSeedBankRoom);


/* ============================================================================
   Demo 05 — Substrate Lab (first gameplay room)

   Flow: click a rack panel → that substrate is "held" (selection ring); click a
   bench circle to drop its icon there. Click a tray plant (default selection) →
   click a circle to set that plant on it. Reassign freely. "Plant Seeds" (action
   zone) resolves every circle that has BOTH a plant and a substrate:
     - green (correct) / amber (tolerated) / red (stress) flash per circle
     - plant tagged with assignedSubstrate; Agar Gel sets isHydroponic
     - stress → revealTrait('substrate') + root-disease badge + −1 pip (no aging)
     - seedlings fly back to the tray
   Win (all participating correct/tolerated) → markComplete + return to hub +
   unlock Orientation. First press → unlock Light. Early leave → markInProgress.

   Positions: SUBSTRATE_CIRCLES / SUBSTRATE_RACK below were measured in
   demos/05a-substrate-coords.html against bg_substrate.jpg.
   ============================================================================ */

/* Bench recesses are ovals — each is {x,y} CENTER + {w,h} ellipse size. The
   substrate fills the oval (masked by border-radius); the seedling sits on top
   at SUB_TUNE.seedlingSize. Re-measure w/h in demos/05a-substrate-coords.html.
   (w/h here are sensible starting ovals over the measured centers.) */
const SUBSTRATE_CIRCLES = [
  { x:  404, y: 355, w: 154, h: 36 },   // circle 1
  { x:  625, y: 354, w: 144, h: 36 },   // circle 2
  { x:  840, y: 355, w: 144, h: 36 },   // circle 3
  { x:  356, y: 413, w: 168, h: 42 },   // circle 4
  { x:  878, y: 413, w: 166, h: 42 },   // circle 5
  { x:  313, y: 474, w: 182, h: 42 },   // circle 6
  { x:  616, y: 474, w: 184, h: 44 },   // circle 7
  { x:  914, y: 474, w: 180, h: 46 },   // circle 8
];

/* Runtime-tunable bench rendering knobs (Demo 05 Devtools drives these). */
let SUB_TUNE = {
  seedlingSize: 64, fillZoom: 115,        // seedling px; substrate fill zoom %
  outline: 1.5, outlineColor: '#feffff',  // seedling outline px + color
  dim: 1, pop: 1,                         // substrate-fill brightness; seedling vividness
};
function setSubstrateSeedlingSize(px)    { SUB_TUNE.seedlingSize = px; renderSubstrateLab(gameState); }
function setSubstrateFillZoom(pct)       { SUB_TUNE.fillZoom = pct;    renderSubstrateLab(gameState); }
function setSubstrateSeedlingOutline(px) { SUB_TUNE.outline = px;      renderSubstrateLab(gameState); }
function setSubstrateOutlineColor(c)     { SUB_TUNE.outlineColor = c;  renderSubstrateLab(gameState); }
function setSubstrateDim(mult)           { SUB_TUNE.dim = mult;        renderSubstrateLab(gameState); }
function setSubstratePop(mult)           { SUB_TUNE.pop = mult;        renderSubstrateLab(gameState); }

/* Compose the bench seedling's filter: species color filter (none for now) +
   an optional vividness "pop" + a thin outline tracing the sprite's alpha
   (4-way drop-shadow) + a soft contact shadow — so the plant reads clearly on a
   same-toned substrate. */
function seedlingFilter(plant) {
  const base = (plant.cssFilter && plant.cssFilter !== 'none') ? plant.cssFilter + ' ' : '';
  const pop = SUB_TUNE.pop || 1;
  const popF = pop !== 1 ? `saturate(${pop}) brightness(${(1 + (pop - 1) * 0.35).toFixed(3)}) ` : '';
  const r = SUB_TUNE.outline || 0;
  const c = SUB_TUNE.outlineColor || '#0a0e0a';
  const outline = r > 0
    ? `drop-shadow(${r}px 0 0 ${c}) drop-shadow(-${r}px 0 0 ${c}) ` +
      `drop-shadow(0 ${r}px 0 ${c}) drop-shadow(0 -${r}px 0 ${c}) `
    : '';
  return base + popF + outline + 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))';
}

/* Rack panels are POLYGONS (clip-path) tracing each baked substrate tile, so the
   click area + the brighten-on-select highlight follow the real shape, not a
   rectangle. Rockwool needs 5 points (the table clips a corner). Measured in
   demos/05a-substrate-coords.html; the values below are rect-derived placeholders
   until re-measured as polygons. */
const SUBSTRATE_RACK = {
  perlite:     { points: [[959,106],[1075,106],[1075,170],[959,170]] },
  vermiculite: { points: [[1102,106],[1225,107],[1225,173],[1102,171]] },
  coco:        { points: [[959,208],[1076,209],[1076,272],[959,268]] },
  regolith:    { points: [[1102,210],[1225,212],[1225,280],[1102,273]] },
  rockwool:    { points: [[960,306],[1076,312],[1076,378],[1003,372],[960,344]] },
  agar:        { points: [[1102,314],[1226,321],[1226,391],[1101,381]] },
};

/* Bounding box of a polygon + its clip-path string (points as % of the bbox). */
function polyBBox(points) {
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}
function polyClipPath(points, bb) {
  const pct = points.map(([px, py]) =>
    `${(bb.w ? ((px - bb.x) / bb.w) * 100 : 0).toFixed(2)}% ` +
    `${(bb.h ? ((py - bb.y) / bb.h) * 100 : 0).toFixed(2)}%`);
  return `polygon(${pct.join(', ')})`;
}

/* applyPlantSpriteCell — paint a plant's current-stage sprite cell onto any
   square element at `size` px (background-image + isolated 3×3 cell + species
   filter). Reusable across rooms (bench seedlings, fly ghosts, future puzzle
   areas). */
function applyPlantSpriteCell(el, plant, size) {
  const idx = spriteCellForStage(plant.stage);
  const col = idx % PLANT_SHEET_COLS;
  const row = (idx / PLANT_SHEET_COLS) | 0;
  el.style.width  = size + 'px';
  el.style.height = size + 'px';
  el.style.backgroundImage    = `url('${assetUrl(FAMILY_SHEETS[plant.spriteFamily])}')`;
  el.style.backgroundSize      = `${size * PLANT_SHEET_COLS}px ${size * PLANT_SHEET_ROWS}px`;
  el.style.backgroundPosition  = `-${col * size}px -${row * size}px`;
  el.style.filter = plantSpriteFilter(plant);
}

function ensureSubstrateLabState() {
  if (!gameState.substrateLab) {
    gameState.substrateLab = {
      activeSpot: null,   // index of the bench oval being set up, or null
      circles: Array.from({ length: 8 }, () => ({ subId: null, slotIndex: null })),
    };
  }
  return gameState.substrateLab;
}

function buildSubstrateLab(key) {
  ensureSubstrateLabState();

  const wrap = document.createElement('div');
  wrap.className = 'substrate-screen';
  wrap.dataset.key = key;

  const bg = document.createElement('img');
  bg.className = 'sub-bg';
  bg.src = assetUrl('bg-substrate');
  wrap.appendChild(bg);

  const rack = document.createElement('div');
  rack.className = 'sub-rack';
  wrap.appendChild(rack);

  const bench = document.createElement('div');
  bench.className = 'sub-bench';
  wrap.appendChild(bench);

  const banner = document.createElement('div');
  banner.className = 'sub-banner';
  wrap.appendChild(banner);

  // Clicking empty bench/background (not a panel/oval/✕) deselects the active spot.
  wrap.addEventListener('click', (e) => {
    if (e.target.closest('.sub-panel, .sub-circle, .sub-clear')) return;
    const lab = gameState.substrateLab;
    if (!lab || lab.activeSpot == null) return;
    if (activeSpotSeedOnly()) { flashBanner(); return; }   // choose a substrate first
    lab.activeSpot = null;
    renderSubstrateLab(gameState);
  });

  // Tray plant clicks plant into the active spot (intercept the default select).
  setSlotClickHandler(substrateTraySeedClick);

  // Action zone: Plant Seeds + Back to hub (early leave), stacked side-by-side.
  setActionZone([
    { label: 'Plant Seeds',  onClick: plantSeeds },
    { label: 'Back to hub',  onClick: () => exitSubstrateLab(false) },
  ]);

  renderSubstrateLab(gameState, wrap);
  return wrap;
}

/* Incremental — builds the 6 polygon panels + 8 ovals once, then syncs the
   active spot, placed substrate/seedlings, and the guidance state each call. */
function renderSubstrateLab(state, screenEl) {
  const wrap = screenEl || document.querySelector('.substrate-screen');
  if (!wrap) return;
  const lab = ensureSubstrateLabState();
  const rack = wrap.querySelector('.sub-rack');
  const bench = wrap.querySelector('.sub-bench');

  if (!rack.querySelector('.sub-panel')) {
    SUBSTRATE_ORDER.forEach(id => {
      const poly = SUBSTRATE_RACK[id];
      if (!poly) return;
      const bb = polyBBox(poly.points);
      const p = document.createElement('div');
      p.className = 'sub-panel';
      p.dataset.sub = id;
      p.style.left = bb.x + 'px';
      p.style.top  = bb.y + 'px';
      p.style.width  = bb.w + 'px';
      p.style.height = bb.h + 'px';
      p.style.clipPath = polyClipPath(poly.points, bb);
      p.addEventListener('click', () => substrateSelectSub(id));
      attachTooltip(p, () => substratePanelTooltip(id));
      rack.appendChild(p);
    });
    SUBSTRATE_CIRCLES.forEach((c, i) => {
      const el = document.createElement('div');
      el.className = 'sub-circle';
      el.dataset.idx = i;
      el.style.left = c.x + 'px';
      el.style.top  = c.y + 'px';
      el.style.width  = c.w + 'px';
      el.style.height = c.h + 'px';
      el.addEventListener('click', (e) => { e.stopPropagation(); substrateCircleClick(i); });
      attachTooltip(el, () => substrateCircleTooltip(i));
      bench.appendChild(el);
    });
  }

  // Rack panel that holds the active spot's substrate stays brightened.
  const activeSub = (lab.activeSpot != null) ? lab.circles[lab.activeSpot].subId : null;
  rack.querySelectorAll('.sub-panel').forEach(p =>
    p.classList.toggle('chosen', p.dataset.sub === activeSub));

  bench.querySelectorAll('.sub-circle').forEach((el, i) => {
    const c = lab.circles[i];
    const isActive = lab.activeSpot === i;
    el.classList.toggle('active', isActive);

    // substrate fill — zoomed past the oval edge so the PNG frame is cropped out
    let icon = el.querySelector('.sub-icon');
    if (c.subId) {
      if (!icon) { icon = document.createElement('div'); icon.className = 'sub-icon'; el.insertBefore(icon, el.firstChild); }
      icon.style.backgroundImage = `url('${assetUrl(SUBSTRATE_META[c.subId].asset)}')`;
      icon.style.backgroundSize  = SUB_TUNE.fillZoom + '%';
      icon.style.filter = (SUB_TUNE.dim !== 1) ? `brightness(${SUB_TUNE.dim})` : '';
    } else if (icon) { icon.remove(); }

    // seedling (the plant assigned to this spot) — sits on top, tunable size
    let sd = el.querySelector('.sub-seedling');
    const plant = (c.slotIndex != null) ? state.tray[c.slotIndex] : null;
    if (plant && plant.health > 0) {
      if (!sd) { sd = document.createElement('div'); sd.className = 'sub-seedling'; el.appendChild(sd); }
      sd.style.visibility = 'visible';
      applyPlantSpriteCell(sd, plant, SUB_TUNE.seedlingSize);
      sd.style.filter = seedlingFilter(plant);   // outline + contact shadow over the substrate
    } else if (sd) { sd.remove(); }

    // clear ✕ — only on the active spot, only when a seed is in it (removes the seed)
    let x = el.querySelector('.sub-clear');
    if (isActive && c.slotIndex != null) {
      if (!x) {
        x = document.createElement('div');
        x.className = 'sub-clear';
        x.textContent = '×';
        x.addEventListener('click', (e) => { e.stopPropagation(); clearActiveSpot(); });
        attachTooltip(x, () => `<span class="tt-name">Clear this spot</span>` +
                               `<span class="tt-row">Remove the substrate &amp; seed</span>`);
        el.appendChild(x);
      }
    } else if (x) { x.remove(); }
  });

  updateSubstrateGuide(wrap);
}

/* --- guided flow --------------------------------------------------------- */
/* The current step is derived purely from the active spot's state. */
function substrateStep() {
  const lab = ensureSubstrateLabState();
  if (lab.activeSpot == null) return 'spot';
  const c = lab.circles[lab.activeSpot];
  if (c.subId && c.slotIndex != null) return 'edit';   // FULL + selected → change either
  if (c.subId)                        return 'seed';   // substrate set, needs a seed
  return 'substrate';                                  // empty → choose a substrate
}

/* Update the banner text and the per-step pulse cues (ovals / substrates /
   Plant Seeds button / tray seeds). `root` is the screen element — passed in
   during the initial build (when it isn't attached to the document yet), so the
   banner/ovals/panels are queried within it rather than via document. */
function updateSubstrateGuide(root) {
  root = root || document.querySelector('.substrate-screen') || document;
  const lab = ensureSubstrateLabState();
  const active = lab.activeSpot != null;
  const step = substrateStep();   // 'spot' | 'substrate' | 'seed' | 'ready'

  // Only SEED-stage plants can be planted (stage gate) — an already-planted
  // sprout can't re-enter, so it must not block DONE (Demo 06 gap, generalized).
  const eligibleCount = gameState.tray.filter(p => p && p.health > 0 && roomAcceptsStage('substrate', p)).length;
  const fullCount  = lab.circles.filter(c => c.subId && c.slotIndex != null &&
    gameState.tray[c.slotIndex] && gameState.tray[c.slotIndex].health > 0).length;
  const anyPlaced  = lab.circles.some(c => c.subId || c.slotIndex != null);
  // DONE when every plantable (seed) plant sits on a full spot. (A leftover
  // substrate-only spot can't block — if all seeds are full-placed, none half-set.)
  const done = eligibleCount > 0 && fullCount === eligibleCount;

  // Soft-lock tray plants that aren't seeds (already planted) — skip ones on a spot.
  syncTraySlotLocks((p, i) => lab.circles.some(c => c.slotIndex === i) ? null : stageLockReason('substrate', p, false));

  const banner = root.querySelector('.sub-banner');
  if (banner) {
    banner.innerHTML =
      done    ? 'All set — press Plant Seeds' :
      !active ? (anyPlaced ? 'Choose a spot' : 'Choose a spot to begin') :
      step === 'seed' ? 'Choose a seed for this spot' :
      step === 'edit' ? 'Choose a substrate<br>or choose a seed' :
                        'Choose a substrate for this spot';
  }

  // While choosing a spot (none active, not done), the not-yet-full ovals pulse.
  // Nothing pulses while a spot is selected.
  const chooseSpot = !active && !done;
  root.querySelectorAll('.sub-circle').forEach((el, i) => {
    const c = lab.circles[i];
    const full = c.subId && c.slotIndex != null;
    el.classList.toggle('pulse', chooseSpot && !full);
  });
  // Substrate shapes pulse when the active spot wants a substrate (or in edit mode).
  root.querySelectorAll('.sub-panel').forEach(p =>
    p.classList.toggle('pulse', active && (step === 'substrate' || step === 'edit')));
  // Plant Seeds pulses only when everything is done.
  const plantBtn = document.querySelector('.action-zone .action-btn');
  if (plantBtn) plantBtn.classList.toggle('pulse', done);
  // Tray seeds pulse when the active spot wants a seed (or in edit mode).
  syncTrayPulse(active && (step === 'seed' || step === 'edit'));
}

/* Sync tray-slot decoration for the substrate room: dim plants already used on a
   bench spot (`.sub-used`), and pulse the still-available ones when a seed is
   needed (`.seed-pulse`). Only unused seeds can be planted. */
function syncTrayPulse(on) {
  // Screen guard: a return-plant fly-back re-renders this room ~440ms later;
  // if the player has already exited, that pending render must NOT resurrect
  // this room's tray tags after the exit cleanup (QA sweep catch 2026-07-19).
  if (gameState.ui.currentScreen !== 'room:substrate') return;
  const lab = ensureSubstrateLabState();
  const assigned = new Set(lab.circles.map(c => c.slotIndex).filter(s => s != null));
  document.querySelectorAll('#tray .slot').forEach(slot => {
    const idx = +slot.dataset.idx;
    const plant = gameState.tray[idx];
    const used = !!(plant && assigned.has(idx));
    slot.classList.toggle('sub-used', used);
    slot.classList.toggle('seed-pulse', !!(on && plant && plant.health > 0 && !used));
  });
}

function flashBanner() {
  const b = document.querySelector('.sub-banner');
  if (!b) return;
  b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash');
}

/* --- interactions -------------------------------------------------------- */
/* A spot becomes "done" once it has both a substrate and a seed → auto-deselect
   so the flow returns to "choose a spot" for the next one. */
function maybeCompleteActiveSpot() {
  const lab = gameState.substrateLab;
  if (lab.activeSpot == null) return;
  const c = lab.circles[lab.activeSpot];
  if (c.subId && c.slotIndex != null) lab.activeSpot = null;
}

/* A spot must never hold a seed without a substrate (the flow is blank →
   substrate → seed; you can't skip step 2). This guards every deselect path. */
function activeSpotSeedOnly() {
  const lab = gameState.substrateLab;
  if (!lab || lab.activeSpot == null) return false;
  const c = lab.circles[lab.activeSpot];
  return c.slotIndex != null && !c.subId;
}

function substrateCircleClick(i) {
  const lab = ensureSubstrateLabState();
  if (activeSpotSeedOnly()) { flashBanner(); return; }   // choose a substrate first
  // Toggle off, or switch/select. Selecting a FULL spot keeps its substrate +
  // seed and enters "change the substrate" mode (banner → choose a substrate,
  // and the ✕ shows so the seed can be removed instead).
  lab.activeSpot = (lab.activeSpot === i) ? null : i;
  renderSubstrateLab(gameState);
}

function substrateSelectSub(id) {
  const lab = ensureSubstrateLabState();
  if (lab.activeSpot == null) { flashBanner(); return; }   // pick a spot first
  lab.circles[lab.activeSpot].subId = id;                  // set / swap
  maybeCompleteActiveSpot();
  renderSubstrateLab(gameState);
}

/* Tray-slot click handler (registered via setSlotClickHandler). Plants an
   UNUSED tray plant into the active spot; returns true to suppress the default
   tray selection. A seed already on a spot is locked until it's put back. */
function substrateTraySeedClick(idx) {
  const lab = ensureSubstrateLabState();
  const plant = gameState.tray[idx];
  if (!plant || plant.health <= 0) return true;
  if (!roomAcceptsStage('substrate', plant)) { flashBanner(); return true; }       // wrong stage (needs seed / already planted)
  if (lab.circles.some(c => c.slotIndex === idx)) { flashBanner(); return true; }  // already used
  if (lab.activeSpot == null) { flashBanner(); return true; }
  if (!lab.circles[lab.activeSpot].subId) { flashBanner(); return true; }          // substrate first
  lab.circles[lab.activeSpot].slotIndex = idx;
  maybeCompleteActiveSpot();
  renderSubstrateLab(gameState);
  return true;
}

function clearActiveSpot() {
  const lab = ensureSubstrateLabState();
  if (lab.activeSpot == null) return;
  lab.circles[lab.activeSpot] = { subId: null, slotIndex: null };  // reset the whole spot
  renderSubstrateLab(gameState);   // stays selected → back to "choose a substrate"
}

function substratePanelTooltip(id) {
  const m = SUBSTRATE_META[id];
  const lab = gameState.substrateLab;
  const active = lab && lab.activeSpot != null;
  const isChosen = active && lab.circles[lab.activeSpot].subId === id;
  return [
    `<span class="tt-name">${m.label}</span>`,
    `<span class="tt-row">${m.desc}</span>`,
    tlv('water',    'pH',       m.ph.toFixed(1)),
    tlv('water',    'Drainage', m.drainage),
    tlv('water',    'Aeration', m.aeration),
    `<span class="tt-row hub-unlock-hint">${
      active ? (isChosen ? 'In the selected spot' : 'Click to use for the selected spot')
             : 'Choose a bench spot first'}</span>`,
  ].join('');
}

function substrateCircleTooltip(i) {
  const lab = gameState.substrateLab;
  if (!lab) return null;
  const c = lab.circles[i];
  const plant = (c.slotIndex != null) ? gameState.tray[c.slotIndex] : null;
  const lines = [`<span class="tt-name">Bench ${i + 1}</span>`];
  if (plant)  lines.push(tlv('stage', 'Plant', plant.name));
  if (c.subId) lines.push(tlv('substrate', 'Substrate', SUBSTRATE_META[c.subId].label));
  if (!plant && !c.subId) lines.push(`<span class="tt-row">Empty recess</span>`);
  lines.push(`<span class="tt-row hub-unlock-hint">${
    lab.activeSpot === i ? 'Selected — click again to deselect' : 'Click to select this spot'}</span>`);
  return lines.join('');
}

function clearCircleFlashes() {
  document.querySelectorAll('.sub-circle').forEach(el =>
    el.classList.remove('flash-correct', 'flash-tolerated', 'flash-stress'));
}

function shakeActionButton() {
  const b = document.querySelector('.action-btn');
  if (!b) return;
  b.classList.remove('nope');
  void b.offsetWidth;
  b.classList.add('nope');
}

function plantSeeds() {
  const lab = ensureSubstrateLabState();
  clearCircleFlashes();

  // Fully-assigned circles: a live plant AND a substrate.
  const ready = lab.circles
    .map((c, i) => ({ c, i }))
    .filter(o => o.c.subId && o.c.slotIndex != null &&
                 gameState.tray[o.c.slotIndex] && gameState.tray[o.c.slotIndex].health > 0);

  if (ready.length === 0) {
    // Plants placed but missing substrate → nudge those recesses; else shake.
    const needSub = lab.circles
      .map((c, i) => ({ c, i }))
      .filter(o => o.c.slotIndex != null && !o.c.subId);
    if (needSub.length) {
      needSub.forEach(o => {
        const el = document.querySelector(`.sub-circle[data-idx="${o.i}"]`);
        if (el) { void el.offsetWidth; el.classList.add('flash-stress'); }
      });
      setTimeout(clearCircleFlashes, 640);
    } else {
      shakeActionButton();
    }
    return;
  }

  const subBySlot = {};
  ready.forEach(o => { subBySlot[o.c.slotIndex] = o.c.subId; });
  const outcomes = {};   // slotIndex → 'correct' | 'tolerated' | 'stress'
  const plants = ready.map(o => gameState.tray[o.c.slotIndex]);

  resolveRoomAction({
    plants,
    foodCost: 1,
    perPlant: (plant) => {
      const subId = subBySlot[plant.slotIndex];
      const outcome = substrateOutcome(plant, subId);
      outcomes[plant.slotIndex] = outcome;

      plant.assignedSubstrate = SUBSTRATE_META[subId].label;
      if (!plant.badges.some(b => b.kind === 'substrate-assigned'))
        plant.badges.push({ kind: 'substrate-assigned', value: SUBSTRATE_META[subId].label });
      if (subId === 'agar') {
        plant.isHydroponic = true;
        gameState.moduleState.substrate.hasAgarGelAssignment = true;
      }
      if (outcome === 'stress') {
        revealTrait(plant, 'substrate');
        addStressMarker(plant, {
          kind: 'root-disease', pipCost: 1,
          detail: 'Planted in ' + SUBSTRATE_META[subId].label + ' — wrong medium.',
        });
        return false;   // failures don't age
      }
      return true;       // correct / tolerated → age
    },
  });

  gameState.moduleState.substrate.actionsThisSession++;

  // Flash each resolved circle by outcome.
  ready.forEach(o => {
    const el = document.querySelector(`.sub-circle[data-idx="${o.i}"]`);
    if (el) { void el.offsetWidth; el.classList.add('flash-' + outcomes[o.c.slotIndex]); }
  });

  const win = !ready.some(o => outcomes[o.c.slotIndex] === 'stress');

  // After the flash, fly the seedlings back to the tray, clear circles, finish.
  setTimeout(() => {
    flySeedlingsBack(ready, () => {
      ready.forEach(o => { lab.circles[o.i] = { subId: null, slotIndex: null }; });
      lab.activeSpot = null;
      clearCircleFlashes();
      if (win) exitSubstrateLab(true);
      else     renderSubstrateLab(gameState);
    });
  }, 640);
}

/* Cosmetic bench→tray seedling fly. The plant already lives in its tray slot
   (it was never removed), so this is a ghost sprite sliding home + fading. Lives
   on #stage so it isn't clipped by #game-panel / occluded by #tray. */
function flySeedlingsBack(ready, done) {
  const stage = document.getElementById('stage');
  const items = ready.map(o => {
    const plant = gameState.tray[o.c.slotIndex];
    const circleEl = document.querySelector(`.sub-circle[data-idx="${o.i}"]`);
    const sd = circleEl && circleEl.querySelector('.sub-seedling');
    const slotSprite = document.querySelector(`#tray .slot[data-idx="${o.c.slotIndex}"] .plant-sprite`);
    return (plant && sd && slotSprite) ? { plant, sd, slotSprite } : null;
  }).filter(Boolean);

  if (!stage || items.length === 0) { done && done(); return; }

  let pending = items.length;
  items.forEach(({ plant, sd, slotSprite }) => {
    const from = stageLocalRect(sd);
    const to   = stageLocalRect(slotSprite);
    const fly = document.createElement('div');
    fly.className = 'sub-fly';
    applyPlantSpriteCell(fly, plant, Math.round(from.w));
    fly.style.left = from.left + 'px';
    fly.style.top  = from.top + 'px';
    stage.appendChild(fly);
    sd.style.visibility = 'hidden';   // hide the bench copy while the ghost flies

    const tx = to.left + to.w / 2 - from.w / 2;
    const ty = to.top  + to.h / 2 - from.w / 2;
    void fly.offsetWidth;
    requestAnimationFrame(() => {
      fly.style.left = tx + 'px';
      fly.style.top  = ty + 'px';
      fly.style.opacity = '0.15';
    });
    setTimeout(() => { fly.remove(); if (--pending === 0) done && done(); }, 440);
  });
}

function exitSubstrateLab(win) {
  setActionZone([]);
  setSlotClickHandler(null);
  clearSlotSelection();
  // Clear all substrate-room tray decoration (assignments are about to be wiped).
  document.querySelectorAll('#tray .slot').forEach(s => s.classList.remove('sub-used', 'seed-pulse'));
  clearTraySlotLocks();
  const ms = gameState.moduleState.substrate;
  const acted = ms.actionsThisSession > 0;

  if (win) markComplete('substrate');
  else     markInProgress('substrate');

  // Early leave preserves the bench so you can resume; a win starts fresh.
  if (win) gameState.substrateLab = null;
  transitionTo('hub', 'up-left');

  // Light Lab unlocks after the first room action in ANY module (Bible §5).
  if (acted && gameState.moduleState.light.status === 'locked') unlockRoomDelayed('light');
  if (acted) maybeUnlockRadiation();   // Specialist-only (Demo 15 difficulty gate)
  // Orientation Chamber unlocks after the Substrate Lab is completed once.
  if (win) unlockRoomDelayed('orientation');
}

registerRoomBuilder('substrate', buildSubstrateLab);


/* ============================================================================
   Demo 06 — Pipe Maze (Water Delivery)  ·  Bible §6B
   Second gameplay room (state key 'water'; ROOMS.water dir 'up-right'). Water
   need is a VISIBLE trait → no reveal here; the player GUESSES the dial.

   ONE-SHOT, batches of 4 (phase machine: setup → running → resolved):
     - Place all 4 ports, then tune each dial blind (the gauge shows a neutral
       BLUE preview at the dial's %, no target marks; the only hint is the tray
       tooltip's low/med/high). Dials lock until all 4 are placed.
     - Pressurize (requires all 4) drains the per-run reservoir by the sum of the
       dials, animates water to the gauges, then reveals each gauge's grade by
       proximity to the hidden target (pipeGrade → ok/near/far = green/yellow/red),
       then grows EVERY plant one stage (good or bad).
     - The player clicks each grown plant to return it; only a far miss
       (flood >target / drought <target) leaves a −1-pip badge. Room completes
       when every living plant is watered. Limited water: no refill until a new
       run, so over-watering can run you dry.
   Valves are baked into the bg (no interaction) — pm.valves stays all-open; a
   scenario can still close one to drought a branch. Coords from 06a.

   SHARED PRIMITIVES below (renderGauge / dialAngle+drag / animatePipeFlow /
   particleBurst; applyValveFrame kept for future valve scenarios) are generic
   for reuse by the Light Lab, Mixing Console, and Hydroponic Bay.
   ============================================================================ */

/* --- measured coords (06a) ------------------------------------------------- */
const PIPE_VALVES = {
  V1: { x: 500, y: 355 }, V2: { x: 581, y: 238 }, V3: { x: 602, y: 483 },
};
const PIPE_RESTRICTORS = {
  D1: { x: 723, y: 118 }, D2: { x: 723, y: 236 }, D3: { x: 723, y: 410 }, D4: { x: 723, y: 517 },
};
const PIPE_SOURCE = { id: 'SRC', x: 159, y: 365 };
const PIPE_PORTS = {
  P1: { x: 1095, y:  40, w: 77, h: 77 }, P2: { x: 1095, y: 185, w: 77, h: 77 },
  P3: { x: 1095, y: 324, w: 77, h: 77 }, P4: { x: 1095, y: 459, w: 77, h: 77 },
};
const PIPE_GAUGES = {
  G1: { x: 1036, y:  39, w: 28, h: 87 }, G2: { x: 1036, y: 175, w: 28, h: 88 },
  G3: { x: 1036, y: 310, w: 28, h: 89 }, G4: { x: 1036, y: 445, w: 28, h: 89 },
};
const PIPE_PATHS = {
  SRC_V1: { from: 'SRC', to: 'V1', points: [[295,355],[500,355]] },
  V1_V2:  { from: 'V1',  to: 'V2', points: [[500,355],[500,238],[581,238]] },
  V1_V3:  { from: 'V1',  to: 'V3', points: [[500,355],[500,485],[602,483]] },
  V2_P1:  { from: 'V2',  to: 'P1', points: [[581,238],[582,119],[980,118]] },
  V2_P2:  { from: 'V2',  to: 'P2', points: [[581,238],[980,225]] },
  V3_P3:  { from: 'V3',  to: 'P3', points: [[602,483],[611,410],[980,409]] },
  V3_P4:  { from: 'V3',  to: 'P4', points: [[602,483],[612,521],[979,517]] },
};
const PIPE_TOPOLOGY = {
  source: 'SRC',
  edges: { SRC: ['V1'], V1: ['V2', 'V3'], V2: ['P1', 'P2'], V3: ['P3', 'P4'] },
  portDial: { P1: 'D1', P2: 'D2', P3: 'D3', P4: 'D4' },
};

/* Water need (visible) → target gauge fill window [lo,hi] %, decided this demo. */
const WATER_TARGET = {
  low:    { lo: 20, hi: 40 },
  medium: { lo: 45, hi: 65 },
  high:   { lo: 75, hi: 95 },
};

/* child → parent map from the topology (built once). */
const PIPE_PARENT = {};
Object.entries(PIPE_TOPOLOGY.edges).forEach(([p, kids]) => kids.forEach(k => { PIPE_PARENT[k] = p; }));

/* Runtime-tunable rendering knobs (Devtools drives these). flowSpeed is px/ms —
   a CONSTANT speed so the water head flows seamlessly across segment joints
   (each fork starts exactly when its parent segment's head arrives). */
let PIPE_TUNE = {
  valveSize: 56, dialSize: 48, sourceSize: 46, flowSpeed: 0.85,
  tankCapacity: 600,   // total fill-units of water per RUN (one tankful, no refill)
  yellowPad: 12,       // ± window outside a plant's target that still grades "near" (tolerated)
};
function setPipeValveSize(px)  { PIPE_TUNE.valveSize  = px; renderPipeMaze(gameState); }
function setPipeDialSize(px)   { PIPE_TUNE.dialSize   = px; renderPipeMaze(gameState); }
function setPipeSourceSize(px) { PIPE_TUNE.sourceSize = px; renderPipeMaze(gameState); }
function setPipeTankCapacity(n){ PIPE_TUNE.tankCapacity = n; const pm = gameState.pipeMaze; if (pm) { pm.tankMax = n; pm.tank = Math.min(pm.tank, n); } renderPipeMaze(gameState); }

/* Wasted-water spray tunables (canvas particles). The DIAL setting (intensity
   0-100) scales power (launch speed/distance), count, and life toward these
   maxima; gravity/size/spread/fade are absolute. */
let SPRAY_TUNE = { power: 6, gravity: 0.2, count: 70, life: 1800, size: 3, spread: 2.6, fade: 0.85 };
function setSprayTune(key, v) { SPRAY_TUNE[key] = v; }

/* --- flow resolver --------------------------------------------------------- */
/* Valves on the root-path up from a node (the node itself if it's a valve). */
function pipeChainValves(nodeId) {
  const vs = []; let n = nodeId;
  while (n) { if (PIPE_VALVES[n]) vs.push(n); n = PIPE_PARENT[n]; }
  return vs;
}
/* Ports downstream of a valve (its whole subtree's leaves). */
function valveDownstreamPorts(vid) {
  const out = [], stack = [...(PIPE_TOPOLOGY.edges[vid] || [])];
  while (stack.length) {
    const n = stack.pop();
    if (PIPE_PORTS[n]) out.push(n);
    else (PIPE_TOPOLOGY.edges[n] || []).forEach(c => stack.push(c));
  }
  return out;
}
function portDialId(pid)  { return PIPE_TOPOLOGY.portDial[pid] || null; }
function dialPortId(did)  { return Object.keys(PIPE_TOPOLOGY.portDial).find(p => PIPE_TOPOLOGY.portDial[p] === did) || null; }

/* Per-port flow: powered (all path valves open) + the gauge fill % its dial sets. */
function computePipeFlow(state) {
  const pm = state.pipeMaze || ensurePipeMazeState();
  const out = {};
  Object.keys(PIPE_PORTS).forEach(pid => {
    const powered = pipeChainValves(pid).every(v => pm.valves[v] !== false);
    const did = portDialId(pid);
    const dial = (did != null && pm.dials[did] != null) ? pm.dials[did] : 100;
    out[pid] = { powered, dial: Math.round(dial), fill: powered ? Math.round(dial) : 0 };
  });
  return out;
}
/* Grade a delivered gauge fill against a plant's (hidden) water-need window.
   Returns { grade, outcome } — grade drives the gauge color (ok/near/far),
   outcome drives the result (correct success / tolerated success / flood/drought
   stress). The player only sees the low/med/high hint in the tray; they guess
   the dial and the color reveals how close they got on Pressurize. */
function pipeGrade(plant, fill) {
  const t = WATER_TARGET[plant.waterNeed] || WATER_TARGET.medium;
  const pad = PIPE_TUNE.yellowPad;
  if (fill >= t.lo && fill <= t.hi)            return { grade: 'ok',   outcome: 'correct' };
  if (fill >= t.lo - pad && fill <= t.hi + pad) return { grade: 'near', outcome: 'tolerated' };
  return { grade: 'far', outcome: fill > t.hi ? 'flood' : 'drought' };
}

/* --- shared primitives (reusable across water/light/nutrient rooms) -------- */
/* Paint a valve-wheel frame ('closed'|'turning'|'open') onto a square element. */
function applyValveFrame(el, frame, size) {
  const f = VALVE_COORDS[frame] || VALVE_COORDS.closed;
  const scale = size / f.w;
  el.style.width = size + 'px';
  el.style.height = size + 'px';
  el.style.backgroundImage = `url('${assetUrl('valve-wheel-sheet')}')`;
  el.style.backgroundSize = `${VALVE_SHEET.w * scale}px ${VALVE_SHEET.h * scale}px`;
  el.style.backgroundPosition = `-${f.x * scale}px -${f.y * scale}px`;
  el.style.backgroundRepeat = 'no-repeat';
}
/* pct (0-100) → needle angle, full 360° clockwise from up. 0/100% point up
   (seam at top), 25% = 3 o'clock, 50% = straight down, 75% = 9 o'clock. Full
   sweep so any position (incl. straight down) is reachable with no dead zone. */
function dialAngle(pct) { return (pct / 100) * 360; }

/* Render a vertical gauge fill. No target marks — `color` is one of:
   'preview' (neutral blue, while the player sets the dial), or a resolved grade
   'ok' | 'near' | 'far' (green / yellow / red, revealed on Pressurize). */
function renderGauge(el, fillPct, color) {
  let fill = el.querySelector('.gauge-fill');
  if (!fill) { fill = document.createElement('div'); fill.className = 'gauge-fill'; el.appendChild(fill); }
  fill.style.height = Math.max(0, Math.min(100, fillPct)) + '%';
  fill.classList.remove('preview', 'ok', 'near', 'far');
  fill.classList.add(color || 'preview');
}

/* Animate a bright water "head" traveling along an SVG polyline (left→right). */
function animatePipeFlow(polylineEl, durationMs, delayMs) {
  if (!polylineEl) return;
  const len = polylineEl.getTotalLength ? polylineEl.getTotalLength() : 1200;
  polylineEl.style.transition = 'none';
  polylineEl.style.strokeDasharray = len;
  polylineEl.style.strokeDashoffset = len;
  polylineEl.style.opacity = '1';
  void polylineEl.getBoundingClientRect();
  requestAnimationFrame(() => {
    polylineEl.style.transition = `stroke-dashoffset ${durationMs}ms linear ${delayMs || 0}ms`;
    polylineEl.style.strokeDashoffset = '0';
  });
}

/* Reusable canvas particle burst on #stage (stage-local coords). Used for the
   gauge overflow spray; generic enough for any room's burst effect. */
function particleBurst(opts = {}) {
  const stage = document.getElementById('stage');
  if (!stage) return;
  const { x = 0, y = 0, count = 20, color = '120,200,255', life = 700,
          spread = 2.6, gravity = 0.14, size = 3 } = opts;
  const cv = document.createElement('canvas');
  cv.className = 'fx-burst';
  cv.width = 1280; cv.height = 720;
  stage.appendChild(cv);
  const ctx = cv.getContext('2d');
  const parts = Array.from({ length: count }, (_, i) => {
    const a = (Math.PI * 2 * i) / count + (i % 3) * 0.3;     // deterministic spread (no Math.random)
    const sp = spread * (0.5 + ((i * 37) % 10) / 10);
    return { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.4, r: size * (0.6 + ((i * 13) % 8) / 10) };
  });
  let t = 0;
  function frame() {
    t += 16;
    ctx.clearRect(0, 0, cv.width, cv.height);
    const alpha = Math.max(0, 1 - t / life);
    parts.forEach(p => {
      p.vy += gravity; p.x += p.vx; p.y += p.vy;
      ctx.fillStyle = `rgba(${color},${(alpha * 0.9).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });
    if (t < life) requestAnimationFrame(frame);
    else cv.remove();
  }
  requestAnimationFrame(frame);
}

/* ----------------------------------------------------------------------------
   Vertical bar-meter + trough-liquid primitives (Demo 10 — Hydroponic Bay).
   Generic enough for any future room with a baked vertical scale or a canvas
   liquid fill (Harvest food meter, etc.).
   ---------------------------------------------------------------------------- */

/* Pointer fraction (0 = top, 1 = bottom) for value `v` against a meter's `cal`
   anchor list [[value, fractionFromTop], ...] (ascending by value), measured in
   demos/10a. Piecewise-linear so the needle tracks the printed (non-linear)
   scale exactly. */
function interpCal(cal, v) {
  if (!cal || !cal.length) return 0;
  if (v <= cal[0][0]) return cal[0][1];
  const last = cal[cal.length - 1];
  if (v >= last[0]) return last[1];
  for (let i = 0; i < cal.length - 1; i++) {
    const a = cal[i], b = cal[i + 1];
    if (v >= a[0] && v <= b[0]) { const t = (v - a[0]) / (b[0] - a[0]); return a[1] + t * (b[1] - a[1]); }
  }
  return last[1];
}

/* Position a DOM needle on a vertical bar meter. `def` = { x, y, w, h, cal };
   the needle's CSS `top` transition (set in .hydro-needle) IS the propagation
   lag — the value updates instantly, the visible needle drifts to it. */
function renderBarMeter(needleEl, def, value) {
  if (!needleEl || !def) return;
  needleEl.style.top = (def.y + def.h * interpCal(def.cal, value)) + 'px';
}

/* Trace a polygon path (array of [x,y]) onto a 2D context (no fill/stroke). */
function tracePolygon(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
}

/* Fill a trough `polygon` with translucent `rgb` liquid, then punch OVAL pot
   holes ({x,y,rx,ry}) back out with destination-out. Caller clears the canvas
   and calls once per channel. */
function renderTroughLiquid(ctx, polygon, holes, rgb, alpha = 0.42) {
  ctx.save();
  tracePolygon(ctx, polygon);
  ctx.fillStyle = `rgba(${rgb},${alpha})`;
  ctx.fill();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0,0,0,1)';
  (holes || []).forEach(h => { ctx.beginPath(); ctx.ellipse(h.x, h.y, h.rx, h.ry, 0, 0, Math.PI * 2); ctx.fill(); });
  ctx.restore();
}

/* --- room state ------------------------------------------------------------ */
function ensurePipeMazeState() {
  if (!gameState.pipeMaze) {
    gameState.pipeMaze = {
      phase: 'setup',   // 'setup' = place 4 + tune dials; 'resolved' = grown, click to return
      activePort: null,
      // Valves are baked into the bg now (no interaction) — kept all-open so the
      // flow/animation helpers still treat every branch as live.
      valves: Object.fromEntries(Object.keys(PIPE_VALVES).map(v => [v, true])),
      dials:  Object.fromEntries(Object.keys(PIPE_RESTRICTORS).map(d => [d, 50])), // 50%
      // port: { slotIndex, grade ('ok'|'near'|'far' after a press), lastFill
      //         (delivered % shown after a press), outcome ('correct'|'tolerated'|
      //         'flood'|'drought' — applied as a badge when the player returns it) }
      ports:  Object.fromEntries(Object.keys(PIPE_PORTS).map(p => [p, { slotIndex: null, grade: null, lastFill: 0, outcome: null }])),
      tankMax: PIPE_TUNE.tankCapacity,   // per-run water; depletes as delivered, no refill
      tank:    PIPE_TUNE.tankCapacity,
    };
  }
  return gameState.pipeMaze;
}

/* --- DOM helpers ----------------------------------------------------------- */
function pipeScreen() { return document.querySelector('.pipe-screen'); }
function valveEl(id)  { const s = pipeScreen(); return s && s.querySelector(`.pipe-valve[data-id="${id}"]`); }
function dialEl(id)   { const s = pipeScreen(); return s && s.querySelector(`.pipe-dial[data-id="${id}"]`); }
function portEl(id)   { const s = pipeScreen(); return s && s.querySelector(`.pipe-port[data-id="${id}"]`); }
function gaugeEl(id)  { const s = pipeScreen(); return s && s.querySelector(`.pipe-gauge[data-id="${id}"]`); }

/* --- build / render -------------------------------------------------------- */
function buildPipeMaze(key) {
  ensurePipeMazeState();

  const wrap = document.createElement('div');
  wrap.className = 'pipe-screen';
  wrap.dataset.key = key;

  const bg = document.createElement('img');
  bg.className = 'pipe-bg';
  bg.src = assetUrl('bg-pipe-maze');
  wrap.appendChild(bg);

  // SVG traveling-fill layer (one bright polyline per pipe segment).
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'pipe-paths');
  svg.setAttribute('viewBox', '0 0 1280 580');
  svg.setAttribute('preserveAspectRatio', 'none');
  Object.entries(PIPE_PATHS).forEach(([id, path]) => {
    const pl = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    pl.setAttribute('class', 'pipe-flow');
    pl.setAttribute('data-id', id);
    pl.setAttribute('points', path.points.map(p => p.join(',')).join(' '));
    svg.appendChild(pl);
  });
  wrap.appendChild(svg);

  const overlay = document.createElement('div');
  overlay.className = 'pipe-overlay';
  wrap.appendChild(overlay);

  // Reservoir tank readout (not interactive): a draining liquid disc + a needle
  // that sweeps from full (12 o'clock) clockwise toward empty as the run's water
  // depletes. The valve wheels stay baked into the bg — no interaction.
  const src = document.createElement('div');
  src.className = 'pipe-source';
  src.style.left = PIPE_SOURCE.x + 'px';
  src.style.top  = PIPE_SOURCE.y + 'px';
  src.innerHTML = '<div class="tank-disc"><div class="tank-level"></div></div><div class="needle"></div><div class="hub"></div>';
  attachTooltip(src, () => tankTooltip(), 'left');
  overlay.appendChild(src);

  // Floating live % readout shown above a dial while it's being tuned.
  const readout = document.createElement('div');
  readout.className = 'dial-readout';
  overlay.appendChild(readout);

  // Permanent live "remaining/capacity" label under the reservoir tank.
  const tankLabel = document.createElement('div');
  tankLabel.className = 'tank-label';
  overlay.appendChild(tankLabel);

  // Restrictor dials (4) — click-drag to set 0-100%.
  Object.keys(PIPE_RESTRICTORS).forEach(id => {
    const c = PIPE_RESTRICTORS[id];
    const el = document.createElement('div');
    el.className = 'pipe-dial';
    el.dataset.id = id;
    el.style.left = c.x + 'px';
    el.style.top  = c.y + 'px';
    el.innerHTML = '<div class="needle"></div><div class="hub"></div>';
    el.addEventListener('mousedown', (e) => { e.stopPropagation(); startDialDrag(e, id); });
    attachTooltip(el, () => dialTooltip(id), 'left');
    overlay.appendChild(el);
  });

  // Gauges (4).
  Object.keys(PIPE_GAUGES).forEach(id => {
    const r = PIPE_GAUGES[id];
    const el = document.createElement('div');
    el.className = 'pipe-gauge';
    el.dataset.id = id;
    el.style.left = r.x + 'px';
    el.style.top  = r.y + 'px';
    el.style.width = r.w + 'px';
    el.style.height = r.h + 'px';
    overlay.appendChild(el);
  });

  // Ports (4) — click to select, then place a tray plant.
  Object.keys(PIPE_PORTS).forEach(id => {
    const r = PIPE_PORTS[id];
    const el = document.createElement('div');
    el.className = 'pipe-port';
    el.dataset.id = id;
    el.style.left = r.x + 'px';
    el.style.top  = r.y + 'px';
    el.style.width = r.w + 'px';
    el.style.height = r.h + 'px';
    el.addEventListener('click', (e) => { e.stopPropagation(); pipePortClick(id); });
    attachTooltip(el, () => portTooltip(id), 'left');
    overlay.appendChild(el);
  });

  const banner = document.createElement('div');
  banner.className = 'room-banner';
  wrap.appendChild(banner);

  // Click empty bg/overlay (not a control) deselects the active port.
  wrap.addEventListener('click', (e) => {
    if (e.target.closest('.pipe-dial, .pipe-port, .pipe-clear, .pipe-source')) return;
    const pm = gameState.pipeMaze;
    if (pm && pm.activePort != null) { pm.activePort = null; renderPipeMaze(gameState); }
  });

  setSlotClickHandler(pipeTraySeedClick);
  setActionZone([
    { label: 'Pressurize', onClick: pressurize },
    { label: 'Back to hub', onClick: () => exitPipeMaze() },
  ]);

  renderPipeMaze(gameState, wrap);
  return wrap;
}

/* Incremental sync — valve frames, dial needles, gauge fills, port plants, guide. */
function renderPipeMaze(state, screenEl) {
  const wrap = screenEl || pipeScreen();
  if (!wrap) return;
  const pm = ensurePipeMazeState();

  // Reservoir tank: needle sweeps full (12 o'clock) → empty (≈358° clockwise);
  // liquid disc drains top-down. Both driven by remaining water this run.
  const srcEl = wrap.querySelector('.pipe-source');
  if (srcEl) {
    srcEl.style.width = PIPE_TUNE.sourceSize + 'px';
    srcEl.style.height = PIPE_TUNE.sourceSize + 'px';
    const frac = pm.tankMax ? Math.max(0, Math.min(1, pm.tank / pm.tankMax)) : 0;
    const n = srcEl.querySelector('.needle');
    if (n) n.style.transform = `translate(-50%, -100%) rotate(${(1 - frac) * 358}deg)`;
    const lvl = srcEl.querySelector('.tank-level');
    if (lvl) lvl.style.height = (frac * 100) + '%';
  }
  // Permanent capacity label under the tank (live).
  const tankLabel = wrap.querySelector('.tank-label');
  if (tankLabel) {
    tankLabel.textContent = `${Math.round(pm.tank)}/${pm.tankMax}`;
    tankLabel.style.left = PIPE_SOURCE.x + 'px';
    tankLabel.style.top  = (PIPE_SOURCE.y + PIPE_TUNE.sourceSize / 2 + 6) + 'px';
  }

  // Dials — needle reflects the set %.
  wrap.querySelectorAll('.pipe-dial').forEach(el => {
    const id = el.dataset.id;
    el.style.width = PIPE_TUNE.dialSize + 'px';
    el.style.height = PIPE_TUNE.dialSize + 'px';
    const n = el.querySelector('.needle');
    if (n) n.style.transform = `translate(-50%, -100%) rotate(${dialAngle(pm.dials[id] || 0)}deg)`;
  });

  // Gauges — blue preview at the dial setting, OR the graded reveal after a press.
  wrap.querySelectorAll('.pipe-gauge').forEach(el => {
    const gid = el.dataset.id;
    const pid = 'P' + gid.slice(1);                     // G1↔P1 …
    const port = pm.ports[pid];
    const plant = port && port.slotIndex != null ? state.tray[port.slotIndex] : null;
    if (port && port.grade) {
      renderGauge(el, port.lastFill, port.grade);       // resolved: green/yellow/red
    } else {
      const did = portDialId(pid);                      // always mirror the dial (empty ports too)
      renderGauge(el, did != null ? (pm.dials[did] || 0) : 0, 'preview');   // neutral blue
    }
    el.classList.toggle('has-plant', !!(plant && plant.health > 0));
  });

  // Ports — plant sprite + active + clear ✕.
  wrap.querySelectorAll('.pipe-port').forEach(el => {
    const id = el.dataset.id;
    const port = pm.ports[id];
    const isActive = pm.activePort === id;
    el.classList.toggle('active', isActive);

    const plant = port.slotIndex != null ? state.tray[port.slotIndex] : null;
    let sd = el.querySelector('.port-plant');
    if (plant && plant.health > 0) {
      if (!sd) { sd = document.createElement('div'); sd.className = 'port-plant'; el.appendChild(sd); }
      applyPlantSpriteCell(sd, plant, Math.round(PIPE_PORTS[id].w * 0.78));
      sd.style.filter = 'drop-shadow(0 2px 2px rgba(0,0,0,0.55))';
    } else if (sd) { sd.remove(); }

    let x = el.querySelector('.pipe-clear');
    if (isActive && port.slotIndex != null) {
      if (!x) {
        x = document.createElement('div');
        x.className = 'pipe-clear';
        x.textContent = '×';
        x.addEventListener('click', (e) => { e.stopPropagation(); clearActivePort(); });
        attachTooltip(x, () => `<span class="tt-name">Clear this port</span><span class="tt-row">Take the plant back to the tray</span>`);
        el.appendChild(x);
      }
    } else if (x) { x.remove(); }
  });

  // Reset traveling-fill polylines to hidden at rest (Pressurize animates them).
  wrap.querySelectorAll('.pipe-flow').forEach(pl => {
    if (!pl.dataset.animating) { pl.style.transition = 'none'; pl.style.opacity = '0'; }
  });

  updatePipeGuide(wrap);
}

/* --- guided flow ----------------------------------------------------------- */
function pipeStep() {
  const pm = ensurePipeMazeState();
  if (pm.activePort != null && pm.ports[pm.activePort].slotIndex == null) return 'seed';
  const anyEmpty   = Object.keys(PIPE_PORTS).some(p => pm.ports[p].slotIndex == null);
  const anyFree    = gameState.tray.some((pl, i) => pl && pl.health > 0 && !portUsesSlot(i));
  if (anyEmpty && anyFree) return 'place';
  return 'tune';
}
function portUsesSlot(idx) {
  const pm = gameState.pipeMaze;
  return !!pm && Object.values(pm.ports).some(p => p.slotIndex === idx);
}

function updatePipeGuide(root) {
  root = root || pipeScreen() || document;
  const pm = ensurePipeMazeState();
  const ports = Object.keys(PIPE_PORTS);
  const filledCount = ports.filter(p => {
    const si = pm.ports[p].slotIndex, pl = si != null ? gameState.tray[si] : null;
    return pl && pl.health > 0;
  }).length;
  const anyPlant  = filledCount > 0;
  const setup     = pm.phase === 'setup';
  const resolved  = pm.phase === 'resolved';
  const running   = pm.phase === 'running';
  const seeding   = setup && pm.activePort != null && pm.ports[pm.activePort].slotIndex == null;

  const inPlay = stageInPlay('water', 'watered');
  const allWatered = inPlay.length > 0 && inPlay.every(p => p.watered);

  // Dim + mark tray plants that are the wrong stage for this room (soft lock),
  // skipping ones already watered or in a port (they show their own state).
  syncTraySlotLocks((p, i) => (p.watered || portUsesSlot(i)) ? null : stageLockReason('water', p, false));

  const banner = root.querySelector('.room-banner');
  if (banner) {
    banner.innerHTML =
      running    ? 'Watering…' :
      allWatered ? 'All plants watered —<br>Back to hub' :
      resolved   ? 'Click each plant to<br>return it to the tray' :
      seeding    ? 'Choose a plant for this port' :
      !anyPlant  ? 'Click a port, then a plant' :
                   'Set the dials, then Pressurize<br>(zero any empty pipe)';
  }

  // Ports pulse: empty ones invite a plant (setup); grown ones invite a click home (resolved).
  root.querySelectorAll('.pipe-port').forEach(el => {
    const id = el.dataset.id;
    const empty = pm.ports[id].slotIndex == null;
    el.classList.toggle('pulse',
      (resolved && !!pm.ports[id].grade) ||
      (setup && !allWatered && empty && pm.activePort == null && !anyPlant));
  });
  // Dials + Pressurize pulse once at least one plant is placed (no longer needs all 4).
  root.querySelectorAll('.pipe-dial').forEach(el =>
    el.classList.toggle('pulse', setup && anyPlant && !allWatered));
  const btns = document.querySelectorAll('.action-zone .action-btn');
  if (btns[0]) btns[0].classList.toggle('pulse', setup && anyPlant && !allWatered);
  if (btns[1]) btns[1].classList.toggle('pulse', allWatered);
  // Tray seeds pulse when a port is waiting for a plant.
  syncPipeTrayPulse(seeding);
}

function syncPipeTrayPulse(on) {
  // Screen guard: a return-plant fly-back re-renders this room ~440ms later;
  // if the player has already exited, that pending render must NOT resurrect
  // this room's tray tags after the exit cleanup (QA sweep catch 2026-07-19).
  if (gameState.ui.currentScreen !== 'room:water') return;
  document.querySelectorAll('#tray .slot').forEach(slot => {
    const idx = +slot.dataset.idx;
    const plant = gameState.tray[idx];
    const done   = !!(plant && plant.watered);            // irrigated this visit — locked + tagged
    const inport = !!(plant && !done && portUsesSlot(idx)); // currently sitting in a port — dimmed
    slot.classList.toggle('pipe-done', done);
    slot.classList.toggle('pipe-inport', inport);
    slot.classList.toggle('seed-pulse', !!(on && plant && plant.health > 0 && !done && !inport));
  });
}

function flashRoomBanner() {
  const b = pipeScreen() && pipeScreen().querySelector('.room-banner');
  if (!b) return;
  b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash');
}

/* --- interactions ---------------------------------------------------------- */
function pipePortClick(id) {
  const pm = ensurePipeMazeState();
  if (pm.phase !== 'setup') {                     // 'resolved' → click a grown plant to send it home
    if (pm.phase === 'resolved' && pm.ports[id].grade) returnWateredPlant(id);
    return;                                        // 'running' → ignore
  }
  pm.activePort = (pm.activePort === id) ? null : id;
  renderPipeMaze(gameState);
}
/* Plant an unused tray plant into the active port (intercepts default select). */
function pipeTraySeedClick(idx) {
  const pm = ensurePipeMazeState();
  if (pm.phase !== 'setup') { flashRoomBanner(); return true; }   // return grown plants first / mid-run
  const plant = gameState.tray[idx];
  if (!plant || plant.health <= 0) return true;
  if (!roomAcceptsStage('water', plant)) { flashRoomBanner(); return true; }  // wrong stage (needs sprout)
  if (plant.watered) { flashRoomBanner(); return true; }           // already watered this visit
  if (portUsesSlot(idx)) { flashRoomBanner(); return true; }       // already in a port
  if (pm.activePort == null) { flashRoomBanner(); return true; }   // pick a port first
  pm.ports[pm.activePort].slotIndex = idx;
  pm.activePort = null;                                            // auto-advance
  renderPipeMaze(gameState);
  return true;
}
function clearActivePort() {
  const pm = ensurePipeMazeState();
  if (pm.activePort == null) return;
  pm.ports[pm.activePort].slotIndex = null;
  renderPipeMaze(gameState);
}
function toggleValve(id) {
  const pm = ensurePipeMazeState();
  pm.valves[id] = !(pm.valves[id] !== false);   // flip
  const el = valveEl(id);
  if (el) {                                      // brief "turning" frame
    el.classList.add('turning');
    applyValveFrame(el, 'turning', PIPE_TUNE.valveSize);
    setTimeout(() => { el.classList.remove('turning'); renderPipeMaze(gameState); }, 150);
  }
  renderPipeMaze(gameState);
}
/* Floating "42%" readout above the dial while tuning; fades out on release. */
function showDialReadout(id, pct) {
  const wrap = pipeScreen();
  const el = wrap && wrap.querySelector('.dial-readout');
  if (!el) return;
  const c = PIPE_RESTRICTORS[id];
  const below = (id === 'D1' || id === 'D3');   // D1/D3 below, D2/D4 above — clears the center banner
  const off = PIPE_TUNE.dialSize / 2 + 6;
  el.style.left = c.x + 'px';
  el.style.top  = (below ? c.y + off : c.y - off) + 'px';
  el.style.transform = below ? 'translate(-50%, 0)' : 'translate(-50%, -100%)';
  el.textContent = pct + '%';
  el.classList.remove('fading');
  el.classList.add('show');
}
function fadeDialReadout() {
  const wrap = pipeScreen();
  const el = wrap && wrap.querySelector('.dial-readout');
  if (!el) return;
  el.classList.remove('show');
  el.classList.add('fading');   // CSS transitions opacity 1 → 0
}

function startDialDrag(ev, id) {
  const pm = ensurePipeMazeState();
  if (pm.phase !== 'setup') return;   // dials locked only during the run / until plants returned
  ev.preventDefault();
  const overlay = (dialEl(id) || ev.currentTarget).parentElement;
  const c = PIPE_RESTRICTORS[id];
  function toPct(e) {
    const rect = overlay.getBoundingClientRect();
    const scale = (rect.width / 1280) || 1;
    const dx = (e.clientX - rect.left) / scale - c.x;
    const dy = (e.clientY - rect.top) / scale - c.y;
    const ang = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;  // 0..360 clockwise from up
    gameState.pipeMaze.dials[id] = Math.max(0, Math.min(100, Math.round(ang / 3.6)));
    const pid = dialPortId(id);                       // re-tuning clears the last reveal → blue preview
    if (pid && gameState.pipeMaze.ports[pid]) gameState.pipeMaze.ports[pid].grade = null;
    showDialReadout(id, gameState.pipeMaze.dials[id]);
    renderPipeMaze(gameState);
  }
  toPct(ev);
  function up() { window.removeEventListener('mousemove', toPct); window.removeEventListener('mouseup', up); fadeDialReadout(); }
  window.addEventListener('mousemove', toPct);
  window.addEventListener('mouseup', up);
}

/* --- Pressurize ------------------------------------------------------------ */
function clearGaugeFlashes() {
  document.querySelectorAll('.pipe-gauge, .pipe-port').forEach(el =>
    el.classList.remove('flash-ok', 'flash-near', 'flash-far'));
}
/* Animate water along every LIVE edge at a constant pixel speed, chaining each
   segment's start to when its parent segment finishes — so the head crosses
   joints with no visible seam. Returns the total animation length (ms). */
function animatePoweredFlow() {
  const wrap = pipeScreen();
  if (!wrap) return 600;
  const pm = gameState.pipeMaze;
  const speed = PIPE_TUNE.flowSpeed || 0.85;       // px per ms
  const pathByTo = {};                              // node id → the edge ending there
  Object.entries(PIPE_PATHS).forEach(([id, p]) => { pathByTo[p.to] = id; });

  const dur = {};
  Object.keys(PIPE_PATHS).forEach(id => {
    const el = wrap.querySelector(`.pipe-flow[data-id="${id}"]`);
    const len = el && el.getTotalLength ? el.getTotalLength() : 300;
    dur[id] = Math.max(120, Math.round(len / speed));
  });
  const delayMemo = {};
  function delayOf(id) {
    if (delayMemo[id] != null) return delayMemo[id];
    const parent = pathByTo[PIPE_PATHS[id].from];   // the segment feeding this one's start
    delayMemo[id] = parent ? (delayOf(parent) + dur[parent]) : 0;
    return delayMemo[id];
  }

  let maxEnd = 0;
  Object.entries(PIPE_PATHS).forEach(([id, path]) => {
    const el = wrap.querySelector(`.pipe-flow[data-id="${id}"]`);
    if (!el) return;
    const live = pipeChainValves(path.from).every(v => pm.valves[v] !== false);
    if (!live) { el.style.transition = 'none'; el.style.opacity = '0'; return; }
    el.dataset.animating = '1';
    const d = delayOf(id);
    animatePipeFlow(el, dur[id], d);
    maxEnd = Math.max(maxEnd, d + dur[id]);
  });
  return maxEnd || 600;
}
function burstAtGauge(pid) {
  const gid = 'G' + pid.slice(1);
  const el = gaugeEl(gid);
  if (!el) return;
  const r = stageLocalRect(el);
  particleBurst({ x: r.left + r.w / 2, y: r.top + 4, count: 22, color: '120,200,255' });
}

/* Wasted-water spray out an empty pipe's open end (no plant there). Origin = the
   run's terminal fitting (the path's last point); intensity = the dial % drives
   how hard/far it sprays. Lives on #stage (panel coords + 60px top-bar offset). */
function sprayFromPort(pid, intensity) {
  const path = Object.values(PIPE_PATHS).find(p => p.to === pid);
  if (!path) return;
  const end = path.points[path.points.length - 1];
  particleSpray({ x: end[0], y: end[1] + 60, intensity: intensity || 0 });
}

/* Directional water spray: shoots out to the right and arcs down under gravity,
   fading. Reusable (canvas on #stage, stage-local coords). */
function particleSpray(opts = {}) {
  const stage = document.getElementById('stage');
  if (!stage) return;
  const { x = 0, y = 0, intensity = 50, color = '127,212,255' } = opts;
  const T = SPRAY_TUNE;
  const frac  = Math.max(0.15, Math.min(1, intensity / 100));   // dial → 0.15..1
  const count = Math.max(4, Math.round(T.count * frac));        // dial scales density
  const life  = T.life * (0.45 + 0.55 * frac);                  // dial scales duration
  const speed = T.power * frac;                                 // dial scales launch speed/distance
  const cv = document.createElement('canvas');
  cv.className = 'fx-burst';
  cv.width = 1280; cv.height = 720;
  stage.appendChild(cv);
  const ctx = cv.getContext('2d');
  const parts = Array.from({ length: count }, (_, i) => {
    const fan = i / count - 0.5;                                // -0.5..0.5 vertical fan
    return {
      x, y,
      vx: speed * (0.7 + ((i * 17) % 10) / 14),                 // rightward, out the pipe
      vy: -T.spread * 0.5 + fan * T.spread,                     // upward fan, then gravity takes over
      r: T.size * (0.7 + ((i * 7) % 6) / 8),
    };
  });
  let t = 0;
  function frame() {
    t += 16;
    ctx.clearRect(0, 0, cv.width, cv.height);
    const alpha = Math.max(0, 1 - t / life);
    parts.forEach(p => {
      p.vy += T.gravity; p.x += p.vx; p.y += p.vy;              // gravity arc
      ctx.fillStyle = `rgba(${color},${(alpha * T.fade).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });
    if (t < life) requestAnimationFrame(frame); else cv.remove();
  }
  requestAnimationFrame(frame);
}

/* One-shot pressurize. Requires ALL FOUR ports filled (else shake + banner).
   Sequence: drain the tank by the 4 dial settings → water travels → (beat) gauges
   reveal their graded fill → (beat) every plant grows one stage (even over/under-
   watered ones) → enter 'resolved' phase where the player clicks each plant to
   return it to the tray (badges land then). */
function pressurize() {
  const pm = ensurePipeMazeState();
  if (pm.phase !== 'setup') { shakeActionButton(); flashRoomBanner(); return; }   // mid-run, or return plants first

  const ports = Object.keys(PIPE_PORTS);
  const isPlant = pid => {
    const si = pm.ports[pid].slotIndex, pl = si != null ? gameState.tray[si] : null;
    return pl && pl.health > 0;
  };
  const plantPorts = ports.filter(isPlant);
  if (plantPorts.length === 0) { shakeActionButton(); flashRoomBanner(); return; }  // need ≥1 plant
  pm.phase = 'running';   // lock placement/dials/re-press during the animation

  // Limited reservoir: EVERY port with a dial > 0 draws water — including empty
  // ones, whose water sprays out the open pipe (wasted). Scale down if short.
  const flow = computePipeFlow(gameState);
  const active = ports.filter(pid => flow[pid].fill > 0);
  const requested = active.reduce((s, pid) => s + flow[pid].fill, 0);
  const avail = pm.tank;
  const scale = (requested > avail && requested > 0) ? (avail / requested) : 1;

  const delivered = {};
  let spent = 0;
  active.forEach(pid => { const d = Math.round(flow[pid].fill * scale); delivered[pid] = d; spent += d; });

  plantPorts.forEach(pid => {
    const d = delivered[pid] || 0;
    const g = pipeGrade(gameState.tray[pm.ports[pid].slotIndex], d);
    pm.ports[pid].lastFill = d;
    pm.ports[pid].outcome  = g.outcome;
    pm.ports[pid]._pending = g.grade;     // gauge color held back until the reveal beat
    pm.ports[pid].grade    = null;
  });
  deductFood(1);
  pm.tank = Math.max(0, avail - spent);
  gameState.moduleState.water.actionsThisSession++;
  renderPipeMaze(gameState);              // tank drains + food updates now; gauges still blue

  const settle = animatePoweredFlow();
  const sprayPorts = active.filter(pid => !isPlant(pid));   // empty pipes that wasted water

  // Beat 1 — water arrives: plant gauges reveal their grade; empty pipes spray.
  setTimeout(() => {
    plantPorts.forEach(pid => { pm.ports[pid].grade = pm.ports[pid]._pending; delete pm.ports[pid]._pending; });
    renderPipeMaze(gameState);
    plantPorts.forEach(pid => {
      const g = gaugeEl('G' + pid.slice(1));
      if (g) { void g.offsetWidth; g.classList.add('flash-' + pm.ports[pid].grade); }
      if (pm.ports[pid].outcome === 'flood') burstAtGauge(pid);
    });
    sprayPorts.forEach(pid => sprayFromPort(pid, delivered[pid]));

    // Beat 2 — the plants visibly grow one stage (all of them, good or bad).
    setTimeout(() => {
      clearGaugeFlashes();
      pipeScreen() && pipeScreen().querySelectorAll('.pipe-flow').forEach(pl => { delete pl.dataset.animating; });
      plantPorts.forEach(pid => { const pl = gameState.tray[pm.ports[pid].slotIndex]; if (pl && pl.health > 0) agePlant(pl); });
      renderTray(gameState);
      renderPipeMaze(gameState);            // re-paints port sprites at their new stage
      plantPorts.forEach(pid => {
        const sd = portEl(pid) && portEl(pid).querySelector('.port-plant');
        if (sd) { sd.classList.remove('grow-pop'); void sd.offsetWidth; sd.classList.add('grow-pop'); }
      });

      // Beat 3 — hand control back: click each plant to return it to the tray.
      setTimeout(() => { pm.phase = 'resolved'; pm.activePort = null; renderPipeMaze(gameState); }, 360);
    }, 540);
  }, settle + 220);
}

/* Return one grown plant to the tray (player-driven, 'resolved' phase). The badge
   — only the negative ones (flood/drought, −1 pip); a good watering leaves no
   badge — lands now, so the player sees how they did as the plant goes back. */
function returnWateredPlant(id) {
  const pm = gameState.pipeMaze;
  const port = pm.ports[id];
  const plant = port.slotIndex != null ? gameState.tray[port.slotIndex] : null;
  if (plant) {
    if (port.outcome === 'flood')
      addStressMarker(plant, { kind: 'flood', pipCost: 1, deathCause: 'overwater',
        detail: `Gauge ${port.lastFill}% — flooded a ${plant.waterNeed}-water plant.` });
    else if (port.outcome === 'drought')
      addStressMarker(plant, { kind: 'drought', pipCost: 1, deathCause: 'drought',
        detail: `Gauge ${port.lastFill}% — ${plant.waterNeed}-water plant left thirsty.` });
    // green/yellow = success → no badge (only the negative flood/drought marks).
    plant.watered = true;
  }
  flyPortPlantsToTray([id], () => {
    port.slotIndex = null; port.grade = null; port.lastFill = 0; port.outcome = null;
    // Batch done once no port still holds a graded plant → back to setup for the next 4.
    if (!Object.values(pm.ports).some(p => p.grade)) pm.phase = 'setup';
    renderPipeMaze(gameState);
  });
}

/* Cosmetic port→tray fly for watered plants (the plant already lives in its tray
   slot; this is a ghost sliding home + fading). Lives on #stage. */
function flyPortPlantsToTray(portIds, done) {
  const stage = document.getElementById('stage');
  const pm = gameState.pipeMaze;
  const items = portIds.map(pid => {
    const si = pm.ports[pid].slotIndex;
    const plant = si != null ? gameState.tray[si] : null;
    const pe = portEl(pid);
    const sd = pe && pe.querySelector('.port-plant');
    const slotSprite = document.querySelector(`#tray .slot[data-idx="${si}"] .plant-sprite`);
    return (plant && sd && slotSprite) ? { plant, sd, slotSprite } : null;
  }).filter(Boolean);
  if (!stage || items.length === 0) { done && done(); return; }

  let pending = items.length;
  items.forEach(({ plant, sd, slotSprite }) => {
    const from = stageLocalRect(sd), to = stageLocalRect(slotSprite);
    const fly = document.createElement('div');
    fly.className = 'sub-fly';
    applyPlantSpriteCell(fly, plant, Math.round(from.w));
    fly.style.left = from.left + 'px';
    fly.style.top  = from.top + 'px';
    stage.appendChild(fly);
    sd.style.visibility = 'hidden';
    const tx = to.left + to.w / 2 - from.w / 2;
    const ty = to.top  + to.h / 2 - from.w / 2;
    void fly.offsetWidth;
    requestAnimationFrame(() => { fly.style.left = tx + 'px'; fly.style.top = ty + 'px'; fly.style.opacity = '0.15'; });
    setTimeout(() => { fly.remove(); if (--pending === 0) done && done(); }, 440);
  });
}

/* --- tooltips -------------------------------------------------------------- */
function valveTooltip(id) {
  const pm = gameState.pipeMaze;
  const open = pm && pm.valves[id] !== false;
  const ports = valveDownstreamPorts(id).map(p => 'Plant ' + p.slice(1)).join(', ');
  return [
    `<span class="tt-name">Valve ${id}</span>`,
    `<span class="tt-row">${open ? 'OPEN — routing flow' : 'CLOSED — branch blocked'}</span>`,
    `<span class="tt-row">Feeds: ${ports || '—'}</span>`,
    `<span class="tt-row hub-unlock-hint">Click to ${open ? 'close' : 'open'}</span>`,
  ].join('');
}
function tankTooltip() {
  const pm = gameState.pipeMaze;
  if (!pm) return null;
  const pct = pm.tankMax ? Math.round(pm.tank / pm.tankMax * 100) : 0;
  return [
    `<span class="tt-name">Water Reservoir</span>`,
    tlv('water', 'Remaining', `${Math.round(pm.tank)} / ${pm.tankMax}`),
    `<span class="tt-row">One tankful per run — over-watering wastes it.</span>`,
    pct <= 20 ? `<span class="tt-row hub-unlock-hint">Running low!</span>` : '',
  ].join('');
}
function dialTooltip(id) {
  const pm = gameState.pipeMaze;
  const pid = dialPortId(id);
  const pct = pm ? Math.round(pm.dials[id] || 0) : 0;
  return [
    `<span class="tt-name">Restrictor ${id.slice(1)}</span>`,
    tlv('water', 'Open', pct + '%'),
    `<span class="tt-row">Sets the water for Plant ${pid ? pid.slice(1) : '—'}</span>`,
    `<span class="tt-row hub-unlock-hint">Drag to adjust</span>`,
  ].join('');
}
/* Port (in-room plant) tooltip — ONLY after the plant has been watered + grown a
   stage (grade set). Shows what you dialed vs. what the plant wanted, so the
   player learns how they did as they return it. Hidden during setup. */
function portTooltip(id) {
  const pm = gameState.pipeMaze;
  const port = pm && pm.ports[id];
  if (!port || !port.grade) return null;                   // suppressed until grown
  const plant = port.slotIndex != null ? gameState.tray[port.slotIndex] : null;
  if (!plant) return null;
  const t = WATER_TARGET[plant.waterNeed] || WATER_TARGET.medium;
  const verdict = port.outcome === 'correct'   ? 'On target' :
                  port.outcome === 'tolerated' ? 'Close enough' :
                  port.outcome === 'flood'     ? 'Over-watered' : 'Under-watered';
  // Colorize the verdict by how close the setting was so it pops vs. the hint.
  const verdictColor = port.grade === 'ok'   ? 'var(--accent-go)'
                     : port.grade === 'near' ? 'var(--accent-warn)'
                     : 'var(--accent-stop)';
  return [
    `<span class="tt-name">${plant.name}</span>`,
    tlv('water', 'Water need',   `${plant.waterNeed} (${t.lo}–${t.hi}%)`),
    tlv('water', 'Your setting', `${port.lastFill}%`),
    `<span class="tt-row"><b style="color:${verdictColor};">${verdict}</b> — click to return</span>`,
  ].join('');
}

/* --- exit ------------------------------------------------------------------ */
/* Leave the room. Completion is derived from progress, not a single press: the
   Pipe Maze is COMPLETE once every living plant has been watered (the room runs
   plants in batches of 4 ports); otherwise leaving marks it in-progress so the
   bench resumes next visit. */
function exitPipeMaze() {
  // Don't let the player bail mid-Pressurize — the staged beats are still queued
  // (they'd age plants / advance the phase after we'd left). The run is brief.
  if (gameState.pipeMaze && gameState.pipeMaze.phase === 'running') return;
  setActionZone([]);
  setSlotClickHandler(null);
  clearSlotSelection();
  document.querySelectorAll('#tray .slot').forEach(s =>
    s.classList.remove('pipe-done', 'pipe-inport', 'seed-pulse'));
  clearTraySlotLocks();
  clearGaugeFlashes();

  const inPlay = stageInPlay('water', 'watered');
  const allWatered = inPlay.length > 0 && inPlay.every(p => p.watered);
  const acted = gameState.moduleState.water.actionsThisSession > 0;

  if (allWatered) markComplete('water');
  else            markInProgress('water');

  if (allWatered) gameState.pipeMaze = null;   // done → fresh next time; else resume
  transitionTo('hub', 'up-right');

  // Light Lab unlocks after the first room action in ANY module (Bible §5).
  if (acted && gameState.moduleState.light.status === 'locked') unlockRoomDelayed('light');
  if (acted) maybeUnlockRadiation();   // Specialist-only (Demo 15 difficulty gate)
}

registerRoomBuilder('water', buildPipeMaze);


/* ============================================================================
   GENERIC CONTROL PRIMITIVES (Demo 07 — reusable by Light / Mixing / Hydroponics)
   Built shared-first so the Mixing Console's rotary needles and any future
   continuous control reuse them rather than re-implementing drag math.
     renderSlider / startSliderDrag — a discrete-snap handle riding a 2-pt rail
     renderNeedleDial + pointerAngleAt + nearestStopByAngle — a sprite needle dial
     playBloom — a 4-frame flower burst over any element
     setZoneTint — set an element's --zone-rgb tint color
   ============================================================================ */

/* Point at stop `idx` (of nStops) along a 2-pt rail {x1,y1,x2,y2}. */
function sliderStopPoint(track, idx, nStops) {
  const t = nStops > 1 ? idx / (nStops - 1) : 0;
  return [track.x1 + (track.x2 - track.x1) * t, track.y1 + (track.y2 - track.y1) * t];
}
/* Place a slider handle element (left/top = CENTER) at its stop. */
function renderSlider(el, track, idx, nStops) {
  const [x, y] = sliderStopPoint(track, idx, nStops);
  el.style.left = x + 'px';
  el.style.top  = y + 'px';
}
/* Drag a handle along its rail; projects the pointer onto the segment, snaps to
   the nearest of nStops, and calls onPick(idx) live. The handle's parent is the
   overlay used for stage-local coordinates (works at any --fs-scale). */
function startSliderDrag(ev, track, nStops, onPick) {
  ev.preventDefault();
  const overlay = ev.currentTarget.parentElement;
  function pick(e) {
    const rect = overlay.getBoundingClientRect();
    const scale = (rect.width / 1280) || 1;
    const mx = (e.clientX - rect.left) / scale, my = (e.clientY - rect.top) / scale;
    const dx = track.x2 - track.x1, dy = track.y2 - track.y1;
    const len2 = dx * dx + dy * dy || 1;
    let t = ((mx - track.x1) * dx + (my - track.y1) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    onPick(Math.round(t * (nStops - 1)));
  }
  pick(ev);
  function up() { window.removeEventListener('mousemove', pick); window.removeEventListener('mouseup', up); }
  window.addEventListener('mousemove', pick);
  window.addEventListener('mouseup', up);
}

/* Paint a sprite dial: dial-face background + a rotating needle child. opts.face
   / opts.needle override the asset keys (Mixing Console passes its own needles). */
function renderNeedleDial(el, angleDeg, opts = {}) {
  // opts.face === null → dial face is baked into the room bg, draw only the needle.
  if (opts.face === null) el.style.backgroundImage = 'none';
  else el.style.backgroundImage = `url('${assetUrl(opts.face || 'dial-face')}')`;
  let n = el.querySelector('.needle');
  if (!n) { n = document.createElement('div'); n.className = 'needle'; el.appendChild(n); }
  n.style.backgroundImage = `url('${assetUrl(opts.needle || 'dial-needle')}')`;
  // opts.cell = show ONE cell of a sprite-sheet needle (Mixing's N/P/K share
  // pointers.png). { x,y,w,h } = cell rect in the sheet; sheetW/sheetH = sheet
  // size; boxW/boxH = the needle element's px size. Reusable for any sheet needle.
  if (opts.cell) {
    const c = opts.cell;
    n.style.backgroundRepeat = 'no-repeat';
    n.style.backgroundSize = `${c.sheetW / c.w * c.boxW}px ${c.sheetH / c.h * c.boxH}px`;
    n.style.backgroundPosition = `${-(c.x / c.w) * c.boxW}px ${-(c.y / c.h) * c.boxH}px`;
  } else {
    n.style.backgroundRepeat = ''; n.style.backgroundSize = ''; n.style.backgroundPosition = '';
  }
  // pivot = fraction down the needle that sits at the dial center and acts as the
  // rotation hub (1 = bottom edge; the light needle's hub is ~0.87, not the edge).
  const pivot = (opts.pivot != null ? opts.pivot : 1) * 100;
  n.style.transformOrigin = `50% ${pivot}%`;
  n.style.transform = `translate(-50%, -${pivot}%) rotate(${angleDeg}deg)`;
}
/* Pointer angle (0..360, clockwise from straight up) about a center, stage-local. */
function pointerAngleAt(e, overlay, cx, cy) {
  const rect = overlay.getBoundingClientRect();
  const scale = (rect.width / 1280) || 1;
  const dx = (e.clientX - rect.left) / scale - cx;
  const dy = (e.clientY - rect.top) / scale - cy;
  return (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
}
function angDist(a, b) { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; }
/* Index of the stop whose .angle is closest to `angle` (circular). */
function nearestStopByAngle(angle, stops) {
  let best = 0, bd = Infinity;
  stops.forEach((s, i) => { const d = angDist(angle, s.angle); if (d < bd) { bd = d; best = i; } });
  return best;
}

/* 4-frame flower bloom burst over an element (icons flower-bloom-1..4). dy nudges
   it vertically from the element center (negative = up, toward a tall plant's top).
   opts.reverse plays the frames 4→1 (a flower CLOSING — Pollination Dome miss);
   opts.cssClass adds a class to the burst element (e.g. a wilt tint). */
function playBloom(targetEl, size = 60, dy = 0, opts = {}) {
  if (!targetEl) return;
  const seq = ['flower-bloom-1', 'flower-bloom-2', 'flower-bloom-3', 'flower-bloom-4'];
  const frames = opts.reverse ? seq.slice().reverse() : seq;
  const b = document.createElement('div');
  b.className = 'light-bloom' + (opts.cssClass ? ' ' + opts.cssClass : '');
  b.style.width = size + 'px';
  b.style.height = size + 'px';
  b.style.top = `calc(50% + ${dy}px)`;
  b.style.backgroundImage = `url('${assetUrl(frames[0])}')`;
  targetEl.appendChild(b);
  let i = 0;
  const iv = setInterval(() => {
    i++;
    if (i >= frames.length) { clearInterval(iv); b.remove(); return; }
    b.style.backgroundImage = `url('${assetUrl(frames[i])}')`;
  }, 130);
}
/* Set an element's tint color (consumed by .light-zone fill / any --zone-rgb use). */
function setZoneTint(el, rgb) { el.style.setProperty('--zone-rgb', rgb); }

/* --- CSS quad warp (perspective) ------------------------------------------
   Map a flat w×h element onto an arbitrary 4-corner QUAD (a screen on an
   angled wall). Returns a `matrix3d(...)` transform string: compute the 2D
   homography from the element's local rect (0,0)-(w,h) to the destination quad
   [TL,TR,BR,BL] (coords in the element's positioned parent), then expand the
   3×3 to CSS's column-major 4×4. The element must be `transform-origin: 0 0`,
   positioned at the parent's origin, sized w×h. Reusable for any angled wall
   readout (Mixing terminal, Radiation data log, Harvest results screen). */
function mat3Adjugate(m) {
  return [
    m[4]*m[8]-m[5]*m[7], m[2]*m[7]-m[1]*m[8], m[1]*m[5]-m[2]*m[4],
    m[5]*m[6]-m[3]*m[8], m[0]*m[8]-m[2]*m[6], m[2]*m[3]-m[0]*m[5],
    m[3]*m[7]-m[4]*m[6], m[1]*m[6]-m[0]*m[7], m[0]*m[4]-m[1]*m[3],
  ];
}
function mat3Mul(a, b) {
  const c = new Array(9);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    let s = 0; for (let k = 0; k < 3; k++) s += a[3*i+k] * b[3*k+j];
    c[3*i+j] = s;
  }
  return c;
}
function mat3MulVec(m, v) {
  return [m[0]*v[0]+m[1]*v[1]+m[2]*v[2], m[3]*v[0]+m[4]*v[1]+m[5]*v[2], m[6]*v[0]+m[7]*v[1]+m[8]*v[2]];
}
/* Basis mapping the unit triangle to four points (p1,p2,p3 columns scaled to hit p4). */
function quadBasis(x1,y1,x2,y2,x3,y3,x4,y4) {
  const m = [x1,x2,x3, y1,y2,y3, 1,1,1];
  const v = mat3MulVec(mat3Adjugate(m), [x4,y4,1]);
  return mat3Mul(m, [v[0],0,0, 0,v[1],0, 0,0,v[2]]);
}
/* Projective transform mapping source quad → dest quad (8 point pairs). */
function quadProjection(s, d) {
  return mat3Mul(quadBasis(d[0],d[1],d[2],d[3],d[4],d[5],d[6],d[7]),
                 mat3Adjugate(quadBasis(s[0],s[1],s[2],s[3],s[4],s[5],s[6],s[7])));
}
/* matrix3d that warps a w×h element onto dest quad [TL,TR,BR,BL]. */
function cssQuadWarp(w, h, quad) {
  const [TL, TR, BR, BL] = quad;
  const t = quadProjection(
    [0,0, w,0, w,h, 0,h],
    [TL[0],TL[1], TR[0],TR[1], BR[0],BR[1], BL[0],BL[1]]
  );
  for (let i = 0; i < 9; i++) t[i] = t[i] / t[8];
  const m = [t[0],t[3],0,t[6], t[1],t[4],0,t[7], 0,0,1,0, t[2],t[5],0,t[8]];
  return 'matrix3d(' + m.join(',') + ')';
}
/* Axis-aligned bounding box of a points array [[x,y],...] → {x,y,w,h}. */
function quadBBox(points) {
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}
/* N anchor points interpolated across a 4-corner quad [TL,TR,BR,BL]. `fracs` =
   positions across the top↔bottom edges (default 0.25/0.5/0.75 — even spread,
   edge-margins = inter-point gaps); `v` = fraction down (default 0.70). Follows
   the perspective so points stay parallel to the slanted edges. Matches the 08a
   tool's traySlots; used to seat Mixing Console plants in the isometric pans. */
function quadSlots(quad, fracs = [0.25, 0.5, 0.75], v = 0.70) {
  const [TL, TR, BR, BL] = quad.points;
  return fracs.map(u => {
    const tx = TL[0] + (TR[0] - TL[0]) * u, ty = TL[1] + (TR[1] - TL[1]) * u;
    const bx = BL[0] + (BR[0] - BL[0]) * u, by = BL[1] + (BR[1] - BL[1]) * u;
    return [Math.round(tx + (bx - tx) * v), Math.round(ty + (by - ty) * v)];
  });
}
/* Shrink el's font-size from maxPx until its content fits its own box in BOTH
   dimensions (down to minPx). Works on warped/transformed elements —
   scrollWidth/Height measure the untransformed layout box, so call it BEFORE or
   after applying a matrix3d, either way. el must already be in the DOM and have
   a fixed width/height + overflow:hidden. Returns the chosen px. */
function fitTextToBox(el, maxPx, minPx = 6) {
  let fs = Math.max(minPx, maxPx), guard = 0;
  el.style.fontSize = fs + 'px';
  while (fs > minPx && (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) && guard++ < 240) {
    fs -= 0.5;
    el.style.fontSize = fs + 'px';
  }
  return fs;
}


/* ============================================================================
   Demo 07 — Light Lab  ·  Bible §6C
   Third growth room (state key 'light'; ROOMS.light dir 'right'). Two traits:
     - Light spectrum (VISIBLE: red-heavy/balanced/blue-heavy) — set per zone by
       a 3-stop spectrum SLIDER. Match = content; mismatch = stress (−1 pip). The
       skill is sorting the 8 plants into the 3 zones by their known spectrum.
     - Photoperiod trigger (HIDDEN: short-day/day-neutral/long-day/none) — set per
       zone by a 3-stop photoperiod DIAL (guess-the-dial). For a TRIGGERED plant
       (short/long), a match blooms + reveals the trait + full yield; a miss still
       reveals it but gives no flower, a reduced-yield flag, AND −1 pip (decided).
       day-neutral / untriggered plants have no requirement.
   ONE-SHOT, batches: click a bench spot → click a tray plant; Run Cycle resolves
   ALL placed plants and ADVANCES each survivor one stage (vegetative→flowering,
   the growth-spine step), then the player clicks each grown plant home. Room
   COMPLETE once every living plant has been lit. Coords measured in 07a.
   Reuses the generic primitives above + resolveRoomAction atoms / room-banner /
   particle / fly helpers established by the Substrate Lab and Pipe Maze.
   ============================================================================ */

/* --- measured coords (07a, against bg_light.jpg 1280×580) ------------------ */
const LIGHT_ZONES = {
  Z1: { points: [[17,36],[30,19],[400,19],[414,36],[414,536],[17,536]] },
  Z2: { points: [[460,19],[819,19],[833,38],[832,535],[445,535],[445,36]] },
  Z3: { points: [[879,19],[1249,19],[1264,36],[1264,535],[865,535],[864,36]] },
};
const LIGHT_SPOTS = {
  Z1: [[115,454], [222,454], [331,454]],
  Z2: [[532,455], [640,454], [748,454]],
  Z3: [[950,454], [1058,454], [1167,454]],
};
const LIGHT_SLIDERS = {
  Z1: { x1:  298, y1:  99, x2:  298, y2: 167 },
  Z2: { x1:  718, y1: 100, x2:  718, y2: 167 },
  Z3: { x1: 1136, y1: 100, x2: 1136, y2: 166 },
};
const LIGHT_DIALS = {
  Z1: { x:  347, y: 139 }, Z2: { x:  766, y: 139 }, Z3: { x: 1185, y: 139 },
};
/* spotW/spotH = the OVAL bench-spot footprint (its border-radius:50% box drives
   the pulse/flash glow shape). sprite = the plant sprite size, INDEPENDENT of
   the oval. Sprites are BOTTOM-CENTER anchored, so growing `sprite` makes a
   plant taller "up" out of the bench without sinking into it. */
const LIGHT_SIZES = { spotW: 92, spotH: 54, dial: 52, handle: 24, sprite: 128 };
/* Per-FAMILY sprite nudge {dx,dy} of the bottom-anchor point — each family sheet
   sits differently in its cell, so a single offset won't seat all 5. Tuned per
   family in the room Devtools; bottom-anchor sits at (spot center + dx, + dy). */
const LIGHT_SPRITE_NUDGE = {
  'leafy-rosette':    { dx:  2, dy: 51 },
  'round-fruit-bush': { dx:  8, dy: 19 },
  'tall-stalk':       { dx: -5, dy: 17 },
  'climbing-vine':    { dx: 17, dy: 12 },
  'root-tuber':       { dx:  0, dy: 36 },
};

/* Spectrum slider stops — VERTICAL rail, top→bottom = Blue → Balanced → Red
   (cool-up / warm-down). Indexed 0,1,2. */
const LIGHT_SPECTRA = ['blue-heavy', 'balanced', 'red-heavy'];
const SPECTRUM_RGB = { 'blue-heavy': '90,160,255', 'balanced': '255,240,214', 'red-heavy': '255,96,74' };
const SPECTRUM_DESC = {
  'red-heavy':  'Warm light — drives fruiting & flowering.',
  'balanced':   'Full spectrum — steady all-round growth.',
  'blue-heavy': 'Cool light — drives leafy vegetative growth.',
};
/* Photoperiod = a CONTINUOUS 24-hour dial (1–24h light), read like a 24-hour
   clock face: 24h/0 at the top, 6h at 3 o'clock, 12h straight down, 18h at
   9 o'clock. The plant's needed window is HIDDEN — the player guesses the hours
   (guess-the-dial, like the Pipe Maze gauge). Only short-day / long-day plants
   HAVE a flowering window; day-neutral / untriggered plants flower at any
   setting. 24h ("always-on") is just the top of the dial — it lands outside
   every window, so constant light never flowers a triggered crop. */
const PHOTO_TARGET = {
  'short-day': { lo:  8, hi: 11 },   // flowers only under short days (long nights)
  'long-day':  { lo: 14, hi: 18 },   // flowers only under long days
};
const PHOTO_DEFAULT_HOURS = 12;                         // zone default — neutral midday
const PHOTO_GRACE = 1;                                  // hours outside the window that still cost NO pip (just no bloom)
const hoursToAngle = (h) => (h / 24) * 360;             // 24h/0 = up (clock seam at top)
/* Hours outside a trigger's flowering window (0 = inside). */
const photoDistance = (h, trigger) => {
  const w = PHOTO_TARGET[trigger]; if (!w) return 0;
  return h < w.lo ? w.lo - h : h > w.hi ? h - w.hi : 0;
};

/* Family → default photoperiod trigger, used when a species has no explicit
   SPECIES.photoperiod. Mirrors FAMILY_SUBSTRATE/GRAVITY/PH/RADIATION_DEFAULT.
   Tall cereals & sunflowers are long-day; root/tuber crops tuberize under short
   days; leafy / fruit / vine families flower day-neutral by default. Named
   exceptions (Ironleaf long-day, Frostmint long-day, Velvet Bean short-day) live
   in SPECIES so the "easy" day-neutral families still hide a discoverable
   trigger — a player can't assume leafy/fruit/vine is always dial-safe. */
const FAMILY_PHOTOPERIOD_DEFAULT = {
  'leafy-rosette':    'day-neutral',
  'round-fruit-bush': 'day-neutral',
  'climbing-vine':    'day-neutral',
  'tall-stalk':       'long-day',
  'root-tuber':       'short-day',
};
/* Effective photoperiod trigger: explicit species value wins, else family
   default. Returns 'short-day' | 'long-day' | 'day-neutral' (never null).
   'day-neutral' has no PHOTO_TARGET window, so it flowers at any dial setting. */
function photoperiodTriggerOf(plant) {
  const s = SPECIES[plant.speciesId];
  return (s && s.photoperiod) || (s && FAMILY_PHOTOPERIOD_DEFAULT[s.family]) || 'day-neutral';
}
/* Spectrum penalty (pips): exact match = 0; a mismatch involving balanced = 1;
   the opposite extremes (red↔blue) = 2. Balanced (plant OR zone) caps the loss
   at 1 — so balanced is the safe hedge and red/blue are higher-stakes. */
const spectrumPenalty = (plantSpec, zoneSpec) => {
  if (plantSpec === zoneSpec) return 0;
  const opp = (plantSpec === 'red-heavy'  && zoneSpec === 'blue-heavy') ||
              (plantSpec === 'blue-heavy' && zoneSpec === 'red-heavy');
  return opp ? 2 : 1;
};
const labelOf = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

/* Devtools live size tuning — any LIGHT_SIZES key (spotW/spotH/dial/handle/
   sprite). renderLightLab re-applies them all to the overlay. */
function setLightSize(key, v) { LIGHT_SIZES[key] = v; renderLightLab(gameState); }
/* Devtools per-family sprite nudge (axis = 'dx' | 'dy'). */
function setLightNudge(family, axis, v) {
  if (!LIGHT_SPRITE_NUDGE[family]) LIGHT_SPRITE_NUDGE[family] = { dx: 0, dy: 0 };
  LIGHT_SPRITE_NUDGE[family][axis] = v;
  renderLightLab(gameState);
}

/* Spectrum-rail decoration (helps the Blue-top / Red-bottom read inside the
   baked black control box). railStyle: 'none' | 'bands' (3 discrete stops) |
   'gradient' (smooth) | 'dots' (blue top + red bottom). handleTint glows the
   handle in the current spectrum color. Toggled in Devtools; tuning later. */
let LIGHT_TUNE = { railStyle: 'gradient', handleTint: false, needlePivot: 0.87 };
function setLightRailStyle(s) { LIGHT_TUNE.railStyle = s; renderLightLab(gameState); }
function setLightHandleTint(on) { LIGHT_TUNE.handleTint = !!on; renderLightLab(gameState); }
function setLightNeedlePivot(pct) { LIGHT_TUNE.needlePivot = pct / 100; renderLightLab(gameState); }
/* CSS background for the rail strip in each style (Blue top → Red bottom). */
function railBackground(style) {
  const b = SPECTRUM_RGB['blue-heavy'], w = SPECTRUM_RGB['balanced'], r = SPECTRUM_RGB['red-heavy'];
  if (style === 'gradient') return `linear-gradient(to bottom, rgb(${b}), rgb(${w}), rgb(${r}))`;
  if (style === 'bands')    return `linear-gradient(to bottom, rgb(${b}) 0 33.33%, rgb(${w}) 33.33% 66.66%, rgb(${r}) 66.66% 100%)`;
  if (style === 'dots')     return `radial-gradient(circle at 50% 9%, rgb(${b}) 0 5px, transparent 6px), radial-gradient(circle at 50% 91%, rgb(${r}) 0 5px, transparent 6px)`;
  return 'none';
}

/* --- room state ------------------------------------------------------------ */
function ensureLightLabState() {
  if (!gameState.lightLab) {
    gameState.lightLab = {
      phase: 'setup',      // 'setup' = place + tune ; 'running' = animating ; 'resolved' = click home
      activeSpot: null,    // 'Z1_0'
      // per-zone control settings (balanced spectrum + 12h neutral day-length)
      zones: Object.fromEntries(Object.keys(LIGHT_ZONES).map(z => [z, { spectrum: 1, photo: PHOTO_DEFAULT_HOURS }])),
      // per-spot: { slotIndex, graded, flash, specOutcome, photoOutcome }
      spots: {},
    };
    Object.keys(LIGHT_SPOTS).forEach(z => LIGHT_SPOTS[z].forEach((_, i) => {
      gameState.lightLab.spots[`${z}_${i}`] = { slotIndex: null, graded: false, flash: null, specOutcome: null, photoOutcome: null, pendingReveal: null, pendingMarkers: [], pendingYield: false };
    }));
  }
  return gameState.lightLab;
}

/* --- DOM helpers ----------------------------------------------------------- */
function lightScreen()    { return document.querySelector('.light-screen'); }
function lightSpotEl(id)  { const s = lightScreen(); return s && s.querySelector(`.light-spot[data-id="${id}"]`); }
function spotZoneOf(id)   { return id.split('_')[0]; }
function zoneSpectrum(z)  { return LIGHT_SPECTRA[gameState.lightLab.zones[z].spectrum]; }
function zoneHours(z)     { return gameState.lightLab.zones[z].photo; }
function spotUsesSlot(idx){ const ll = gameState.lightLab; return !!ll && Object.values(ll.spots).some(s => s.slotIndex === idx); }

/* --- build / render -------------------------------------------------------- */
function buildLightLab(key) {
  ensureLightLabState();

  const wrap = document.createElement('div');
  wrap.className = 'light-screen';
  wrap.dataset.key = key;

  const bg = document.createElement('img');
  bg.className = 'light-bg';
  bg.src = assetUrl('bg-light');
  wrap.appendChild(bg);

  // Zone tint polygons (SVG, under the overlay).
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'light-zones');
  svg.setAttribute('viewBox', '0 0 1280 580');
  svg.setAttribute('preserveAspectRatio', 'none');
  Object.entries(LIGHT_ZONES).forEach(([z, zn]) => {
    const pg = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    pg.setAttribute('class', 'light-zone');
    pg.setAttribute('data-zone', z);
    pg.setAttribute('points', zn.points.map(p => p.join(',')).join(' '));
    svg.appendChild(pg);
  });
  wrap.appendChild(svg);

  const overlay = document.createElement('div');
  overlay.className = 'light-overlay';
  wrap.appendChild(overlay);

  // Floating readout shown while tuning a slider/dial (reuses .dial-readout look).
  const readout = document.createElement('div');
  readout.className = 'dial-readout';
  overlay.appendChild(readout);

  // Per-zone spectrum slider + photoperiod dial.
  Object.keys(LIGHT_ZONES).forEach(z => {
    // Spectrum-rail decoration strip (behind the handle; styled in render).
    const rail = document.createElement('div');
    rail.className = 'light-srail';
    rail.dataset.zone = z;
    overlay.appendChild(rail);

    const sl = document.createElement('div');
    sl.className = 'light-slider';
    sl.dataset.zone = z;
    sl.style.backgroundImage = `url('${assetUrl('slider-handle')}')`;
    sl.addEventListener('mousedown', (e) => { e.stopPropagation(); startLightSliderDrag(e, z); });
    attachTooltip(sl, () => spectrumTooltip(z), 'left');
    overlay.appendChild(sl);

    const di = document.createElement('div');
    di.className = 'light-dial';
    di.dataset.zone = z;
    di.addEventListener('mousedown', (e) => { e.stopPropagation(); startLightDialDrag(e, z); });
    attachTooltip(di, () => photoTooltip(z), 'left');
    overlay.appendChild(di);
  });

  // Bench spots (3 per zone). Sizes/positions applied in renderLightLab.
  Object.keys(LIGHT_SPOTS).forEach(z => LIGHT_SPOTS[z].forEach((p, i) => {
    const id = `${z}_${i}`;
    const el = document.createElement('div');
    el.className = 'light-spot';
    el.dataset.id = id;
    el.style.left = p[0] + 'px';
    el.style.top  = p[1] + 'px';
    el.addEventListener('click', (e) => { e.stopPropagation(); lightSpotClick(id); });
    attachTooltip(el, () => spotTooltip(id), 'left');
    overlay.appendChild(el);
  }));

  const banner = document.createElement('div');
  banner.className = 'room-banner';
  wrap.appendChild(banner);

  // Click empty bg/overlay deselects the active spot.
  wrap.addEventListener('click', (e) => {
    if (e.target.closest('.light-slider, .light-dial, .light-spot, .spot-clear')) return;
    const ll = gameState.lightLab;
    if (ll && ll.activeSpot != null) { ll.activeSpot = null; renderLightLab(gameState); }
  });

  setSlotClickHandler(lightTraySeedClick);
  setActionZone([
    { label: 'Run Cycle', onClick: runCycle },
    { label: 'Back to hub', onClick: () => exitLightLab() },
  ]);

  renderLightLab(gameState, wrap);
  return wrap;
}

/* Incremental sync — zone tints, slider/dial positions, spot plants, guide. */
function renderLightLab(state, screenEl) {
  const wrap = screenEl || lightScreen();
  if (!wrap) return;
  const ll = ensureLightLabState();

  // Zone tint color from each zone's set spectrum (faint at rest; pulses on Run).
  wrap.querySelectorAll('.light-zone').forEach(el => setZoneTint(el, SPECTRUM_RGB[zoneSpectrum(el.dataset.zone)]));

  // Spectrum-rail decoration strip (assumes ~vertical rails, Blue top→Red bottom).
  wrap.querySelectorAll('.light-srail').forEach(el => {
    const t = LIGHT_SLIDERS[el.dataset.zone];
    if (LIGHT_TUNE.railStyle === 'none') { el.style.display = 'none'; return; }
    el.style.display = 'block';
    const W = 12;
    el.style.left   = ((t.x1 + t.x2) / 2 - W / 2) + 'px';
    el.style.top    = Math.min(t.y1, t.y2) + 'px';
    el.style.width  = W + 'px';
    el.style.height = Math.hypot(t.x2 - t.x1, t.y2 - t.y1) + 'px';
    el.style.background = railBackground(LIGHT_TUNE.railStyle);
  });

  // Sliders — sized + placed at their spectrum stop; optional spectrum-color glow.
  wrap.querySelectorAll('.light-slider').forEach(el => {
    el.style.width = LIGHT_SIZES.handle + 'px';
    el.style.height = LIGHT_SIZES.handle + 'px';
    el.style.boxShadow = LIGHT_TUNE.handleTint
      ? `0 0 8px 2px rgba(${SPECTRUM_RGB[zoneSpectrum(el.dataset.zone)]},0.95)` : '';
    renderSlider(el, LIGHT_SLIDERS[el.dataset.zone], ll.zones[el.dataset.zone].spectrum, LIGHT_SPECTRA.length);
  });

  // Dials — sized + needle at the set hours (continuous 24h clock).
  wrap.querySelectorAll('.light-dial').forEach(el => {
    const z = el.dataset.zone, d = LIGHT_DIALS[z];
    el.style.left = d.x + 'px';
    el.style.top  = d.y + 'px';
    el.style.width = LIGHT_SIZES.dial + 'px';
    el.style.height = LIGHT_SIZES.dial + 'px';
    el.style.setProperty('--needle-w', Math.round(LIGHT_SIZES.dial * 0.26) + 'px');
    el.style.setProperty('--needle-h', Math.round(LIGHT_SIZES.dial * 0.42) + 'px');
    renderNeedleDial(el, hoursToAngle(ll.zones[z].photo), { pivot: LIGHT_TUNE.needlePivot });
  });

  // Spots — OVAL footprint (drives the glow shape), plant sprite (independent
  // size + Y nudge), active + clear ✕.
  wrap.querySelectorAll('.light-spot').forEach(el => {
    const id = el.dataset.id;
    const spot = ll.spots[id];
    const isActive = ll.activeSpot === id;
    el.style.width = LIGHT_SIZES.spotW + 'px';
    el.style.height = LIGHT_SIZES.spotH + 'px';
    el.classList.toggle('active', isActive);

    const plant = spot.slotIndex != null ? state.tray[spot.slotIndex] : null;
    let sd = el.querySelector('.spot-plant');
    if (plant && plant.health > 0) {
      if (!sd) { sd = document.createElement('div'); sd.className = 'spot-plant'; el.appendChild(sd); }
      applyPlantSpriteCell(sd, plant, Math.round(LIGHT_SIZES.sprite));   // square cell; CSS anchors it bottom-center
      const nud = LIGHT_SPRITE_NUDGE[plant.spriteFamily] || { dx: 0, dy: 0 };
      sd.style.left = `calc(50% + ${nud.dx}px)`;
      sd.style.top  = `calc(50% + ${nud.dy}px)`;
      // keep the species hue filter applyPlantSpriteCell set; layer the shadow on top
      const hue = (plant.cssFilter && plant.cssFilter !== 'none') ? plant.cssFilter + ' ' : '';
      sd.style.filter = hue + 'drop-shadow(0 3px 2px rgba(0,0,0,0.5))';
    } else if (sd) { sd.remove(); }

    let x = el.querySelector('.spot-clear');
    if (isActive && spot.slotIndex != null) {
      if (!x) {
        x = document.createElement('div');
        x.className = 'spot-clear';
        x.textContent = '×';
        x.addEventListener('click', (e) => { e.stopPropagation(); clearActiveSpot(); });
        attachTooltip(x, () => `<span class="tt-name">Clear this spot</span><span class="tt-row">Take the plant back to the tray</span>`);
        el.appendChild(x);
      }
    } else if (x) { x.remove(); }
  });

  updateLightGuide(wrap);
}

/* --- guided flow ----------------------------------------------------------- */
function updateLightGuide(root) {
  root = root || lightScreen() || document;
  const ll = ensureLightLabState();
  const setup = ll.phase === 'setup', running = ll.phase === 'running', resolved = ll.phase === 'resolved';
  const placed = Object.values(ll.spots).filter(s => {
    const pl = s.slotIndex != null ? gameState.tray[s.slotIndex] : null; return pl && pl.health > 0;
  }).length;
  const seeding = setup && ll.activeSpot != null && ll.spots[ll.activeSpot].slotIndex == null;
  const inPlay = stageInPlay('light', 'lit');
  const allLit = inPlay.length > 0 && inPlay.every(p => p.lit);

  // Soft-lock wrong-stage tray plants (skip ones already lit or on a bench).
  syncTraySlotLocks((p, i) => (p.lit || spotUsesSlot(i)) ? null : stageLockReason('light', p, false));

  const banner = root.querySelector('.room-banner');
  if (banner) {
    banner.innerHTML =
      running    ? 'Running light cycle…' :
      allLit     ? 'All plants lit —<br>Back to hub' :
      resolved   ? 'Click each plant to<br>return it to the tray' :
      seeding    ? 'Choose a plant for this spot' :
      placed === 0 ? 'Click a bench spot, then a plant' :
                   'Set each zone’s spectrum &amp; day-length,<br>then Run Cycle';
  }

  root.querySelectorAll('.light-spot').forEach(el => {
    const id = el.dataset.id;
    const empty = ll.spots[id].slotIndex == null;
    el.classList.toggle('pulse',
      (resolved && ll.spots[id].graded) ||
      (setup && !allLit && empty && ll.activeSpot == null && placed === 0));
  });
  root.querySelectorAll('.light-slider, .light-dial').forEach(el =>
    el.classList.toggle('pulse', setup && placed > 0 && !allLit));
  const btns = document.querySelectorAll('.action-zone .action-btn');
  if (btns[0]) btns[0].classList.toggle('pulse', setup && placed > 0 && !allLit);
  if (btns[1]) btns[1].classList.toggle('pulse', allLit);

  syncLightTrayPulse(seeding);
}
function syncLightTrayPulse(on) {
  // Screen guard: a return-plant fly-back re-renders this room ~440ms later;
  // if the player has already exited, that pending render must NOT resurrect
  // this room's tray tags after the exit cleanup (QA sweep catch 2026-07-19).
  if (gameState.ui.currentScreen !== 'room:light') return;
  document.querySelectorAll('#tray .slot').forEach(slot => {
    const idx = +slot.dataset.idx;
    const plant = gameState.tray[idx];
    const done = !!(plant && plant.lit);
    const inzone = !!(plant && !done && spotUsesSlot(idx));
    slot.classList.toggle('light-done', done);
    slot.classList.toggle('light-inzone', inzone);
    slot.classList.toggle('seed-pulse', !!(on && plant && plant.health > 0 && !done && !inzone));
  });
}
function flashLightBanner() {
  const b = lightScreen() && lightScreen().querySelector('.room-banner');
  if (!b) return;
  b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash');
}

/* --- tuning readout (shared .dial-readout element) ------------------------- */
function showLightReadout(px, py, text, placement) {
  const el = lightScreen() && lightScreen().querySelector('.dial-readout');
  if (!el) return;
  if (placement === 'left') {        // slider: sit it left of the handle, vertically centered
    el.style.left = px + 'px';
    el.style.top  = py + 'px';
    el.style.transform = 'translate(-100%, -50%)';
  } else {                           // dial: float above
    el.style.left = px + 'px';
    el.style.top  = (py - 8) + 'px';
    el.style.transform = 'translate(-50%, -100%)';
  }
  el.textContent = text;
  el.classList.remove('fading'); el.classList.add('show');
}
function fadeLightReadout() {
  const el = lightScreen() && lightScreen().querySelector('.dial-readout');
  if (!el) return;
  el.classList.remove('show'); el.classList.add('fading');
}

/* --- interactions ---------------------------------------------------------- */
function lightSpotClick(id) {
  const ll = ensureLightLabState();
  if (ll.phase !== 'setup') {
    if (ll.phase === 'resolved' && ll.spots[id].graded) returnLitPlant(id);   // click grown plant home
    return;
  }
  ll.activeSpot = (ll.activeSpot === id) ? null : id;
  renderLightLab(gameState);
}
function lightTraySeedClick(idx) {
  const ll = ensureLightLabState();
  if (ll.phase !== 'setup') { flashLightBanner(); return true; }
  const plant = gameState.tray[idx];
  if (!plant || plant.health <= 0) return true;
  if (!roomAcceptsStage('light', plant)) { flashLightBanner(); return true; }  // wrong stage (needs vegetative)
  if (plant.lit) { flashLightBanner(); return true; }                // already lit this visit
  if (spotUsesSlot(idx)) { flashLightBanner(); return true; }        // already on a bench
  if (ll.activeSpot == null) { flashLightBanner(); return true; }    // pick a spot first
  ll.spots[ll.activeSpot].slotIndex = idx;
  ll.activeSpot = null;
  renderLightLab(gameState);
  return true;
}
function clearActiveSpot() {
  const ll = ensureLightLabState();
  if (ll.activeSpot == null) return;
  ll.spots[ll.activeSpot].slotIndex = null;
  renderLightLab(gameState);
}
function startLightSliderDrag(ev, z) {
  const ll = ensureLightLabState();
  if (ll.phase !== 'setup') return;
  startSliderDrag(ev, LIGHT_SLIDERS[z], LIGHT_SPECTRA.length, (idx) => {
    ll.zones[z].spectrum = idx;
    const [hx, hy] = sliderStopPoint(LIGHT_SLIDERS[z], idx, LIGHT_SPECTRA.length);
    showLightReadout(hx - LIGHT_SIZES.handle / 2 - 8, hy, labelOf(zoneSpectrum(z)), 'left');
    renderLightLab(gameState);
  });
  window.addEventListener('mouseup', fadeLightReadout, { once: true });
}
function startLightDialDrag(ev, z) {
  const ll = ensureLightLabState();
  if (ll.phase !== 'setup') return;
  ev.preventDefault();
  const overlay = ev.currentTarget.parentElement;
  const c = LIGHT_DIALS[z];
  function pick(e) {
    let h = Math.round(pointerAngleAt(e, overlay, c.x, c.y) / 360 * 24);
    if (h <= 0) h = 24;                         // top seam reads as 24h (always-on)
    ll.zones[z].photo = h;
    showLightReadout(c.x, c.y - LIGHT_SIZES.dial / 2, `${h}h light`);
    renderLightLab(gameState);
  }
  pick(ev);
  function up() { window.removeEventListener('mousemove', pick); window.removeEventListener('mouseup', up); fadeLightReadout(); }
  window.addEventListener('mousemove', pick);
  window.addEventListener('mouseup', up);
}

/* --- Run Cycle (one-shot, staged beats) ------------------------------------ */
function runCycle() {
  const ll = ensureLightLabState();
  if (ll.phase !== 'setup') { shakeActionButton(); flashLightBanner(); return; }

  const placedIds = Object.keys(ll.spots).filter(id => {
    const si = ll.spots[id].slotIndex, pl = si != null ? gameState.tray[si] : null;
    return pl && pl.health > 0;
  });
  if (placedIds.length === 0) { shakeActionButton(); flashLightBanner(); return; }   // need ≥1 plant

  ll.phase = 'running';
  deductFood(1);
  gameState.moduleState.light.actionsThisSession++;

  const wrap = lightScreen();
  if (wrap) wrap.querySelectorAll('.light-zone').forEach(el => el.classList.add('glow'));   // lights on
  renderLightLab(gameState);

  // Beat 1 — resolve spectrum + photoperiod; reveal/bloom/stress; flash spots.
  setTimeout(() => {
    placedIds.forEach(id => {
      const z = spotZoneOf(id);
      const spot = ll.spots[id];
      const plant = gameState.tray[spot.slotIndex];
      if (!plant || plant.health <= 0) return;

      const spec = zoneSpectrum(z);
      const specPip = spectrumPenalty(plant.lightSpectrum, spec);        // 0 ok / 1 balanced-involved / 2 opposite
      const specOk = specPip === 0;

      const truePhoto = photoperiodTriggerOf(plant);                     // truth (hidden; null species resolve via family default)
      const triggered = truePhoto === 'short-day' || truePhoto === 'long-day';
      // photoState: 'none' (untriggered) | 'bloom' (in window) | 'near' (≤grace
      // outside: no flower, no pip) | 'miss' (further out: no flower, −1 pip).
      let photoState = 'none';
      if (triggered) {
        const dist = photoDistance(zoneHours(z), truePhoto);
        photoState = dist === 0 ? 'bloom' : dist <= PHOTO_GRACE ? 'near' : 'miss';
      }

      // Pipe-Maze style: the verdict is shown now (flash/bloom/tooltip), but the
      // trait reveal, badges/pips and yield flag are APPLIED when the plant is
      // returned to the tray (returnLitPlant) — stashed on the spot until then.
      spot.pendingReveal = 'photoperiod';   // a cycle teaches the trait (incl. "it's day-neutral")
      spot.pendingMarkers = [];
      spot.pendingYield = (photoState === 'near' || photoState === 'miss');
      if (!specOk) spot.pendingMarkers.push({
        kind: 'wrong-spectrum', pipCost: specPip, deathCause: 'wrong-spectrum',
        detail: `Lit ${labelOf(spec)} — wants ${labelOf(plant.lightSpectrum)} (−${specPip}).`,
      });
      if (photoState === 'miss') {
        const w = PHOTO_TARGET[truePhoto];
        spot.pendingMarkers.push({                                       // reuse the light-failure badge (covers spectrum OR day-length)
          kind: 'wrong-spectrum', pipCost: 1, deathCause: 'wrong-spectrum',
          detail: `${zoneHours(z)}h light — a ${truePhoto} plant wants ${w.lo}–${w.hi}h. No flower, −1.`,
        });
      }

      spot.graded = true;
      spot.specOutcome  = specOk ? 'content' : 'stress';
      spot.photoOutcome = photoState;                                    // 'none'|'bloom'|'near'|'miss'
      spot.flash = (!specOk || photoState === 'miss') ? 'far'            // any pip loss → red
                 : photoState === 'near' ? 'near'                        // no-pip near-miss → amber
                 : 'ok';                                                 // all good → green
    });
    renderLightLab(gameState);
    placedIds.forEach(id => {
      const el = lightSpotEl(id);
      if (el && ll.spots[id].flash) { void el.offsetWidth; el.classList.add('flash-' + ll.spots[id].flash); }
    });

    // Beat 2 — survivors grow one stage (veg→flowering); pop; bloom on a match.
    setTimeout(() => {
      placedIds.forEach(id => { const el = lightSpotEl(id); if (el) el.classList.remove('flash-ok', 'flash-near', 'flash-far'); });
      placedIds.forEach(id => { const pl = gameState.tray[ll.spots[id].slotIndex]; if (pl && pl.health > 0) agePlant(pl); });
      renderTray(gameState);
      renderLightLab(gameState);
      placedIds.forEach(id => {
        const el = lightSpotEl(id);
        const sd = el && el.querySelector('.spot-plant');
        if (sd) { sd.classList.remove('grow-pop'); void sd.offsetWidth; sd.classList.add('grow-pop'); }
        const pl = gameState.tray[ll.spots[id].slotIndex];
        // bloom up near the (tall, bottom-anchored) plant's flowering top
        if (el && pl && pl.health > 0 && ll.spots[id].photoOutcome === 'bloom') playBloom(el, Math.round(LIGHT_SIZES.sprite * 0.6), -Math.round(LIGHT_SIZES.sprite * 0.55));
      });

      // Beat 3 — resolved: auto-clear any spot whose plant died; click the rest home.
      setTimeout(() => {
        if (wrap) wrap.querySelectorAll('.light-zone').forEach(el => el.classList.remove('glow'));
        placedIds.forEach(id => {
          const pl = gameState.tray[ll.spots[id].slotIndex];
          if (!pl || pl.health <= 0) { const s = ll.spots[id]; s.slotIndex = null; s.graded = false; s.flash = null; }
        });
        ll.phase = 'resolved';
        ll.activeSpot = null;
        renderLightLab(gameState);
      }, 420);
    }, 560);
  }, 620);
}

/* Return one grown plant to the tray (player-driven, 'resolved' phase). The
   verdict was shown at resolve, but the reveal, badges/pips and yield flag are
   APPLIED NOW (Pipe-Maze style) — a clean cycle leaves no badge. */
function returnLitPlant(id) {
  const ll = gameState.lightLab;
  const spot = ll.spots[id];
  const plant = spot.slotIndex != null ? gameState.tray[spot.slotIndex] : null;
  if (plant) {
    if (spot.pendingReveal) revealTrait(plant, spot.pendingReveal);             // a cycle teaches the trait
    if (spot.pendingYield) plant.lightYieldReduced = true;
    (spot.pendingMarkers || []).forEach(m => addStressMarker(plant, m));        // killPlant self-renders if lethal
    plant.lit = true;
  }
  flyLightPlantsToTray([id], () => {
    spot.slotIndex = null; spot.graded = false; spot.flash = null; spot.specOutcome = null; spot.photoOutcome = null;
    spot.pendingReveal = null; spot.pendingMarkers = []; spot.pendingYield = false;
    if (!Object.values(ll.spots).some(s => s.graded)) ll.phase = 'setup';   // batch done → next batch
    renderLightLab(gameState);
  });
}
/* Cosmetic spot→tray fly (the plant already lives in its slot). Lives on #stage. */
function flyLightPlantsToTray(ids, done) {
  const stage = document.getElementById('stage');
  const ll = gameState.lightLab;
  const items = ids.map(id => {
    const si = ll.spots[id].slotIndex;
    const plant = si != null ? gameState.tray[si] : null;
    const se = lightSpotEl(id);
    const sd = se && se.querySelector('.spot-plant');
    const slotSprite = document.querySelector(`#tray .slot[data-idx="${si}"] .plant-sprite`);
    return (plant && sd && slotSprite) ? { plant, sd, slotSprite } : null;
  }).filter(Boolean);
  if (!stage || items.length === 0) { done && done(); return; }
  let pending = items.length;
  items.forEach(({ plant, sd, slotSprite }) => {
    const from = stageLocalRect(sd), to = stageLocalRect(slotSprite);
    const fly = document.createElement('div');
    fly.className = 'sub-fly';
    applyPlantSpriteCell(fly, plant, Math.round(from.w));
    fly.style.left = from.left + 'px';
    fly.style.top  = from.top + 'px';
    stage.appendChild(fly);
    sd.style.visibility = 'hidden';
    const tx = to.left + to.w / 2 - from.w / 2;
    const ty = to.top  + to.h / 2 - from.w / 2;
    void fly.offsetWidth;
    requestAnimationFrame(() => { fly.style.left = tx + 'px'; fly.style.top = ty + 'px'; fly.style.opacity = '0.15'; });
    setTimeout(() => { fly.remove(); if (--pending === 0) done && done(); }, 440);
  });
}

/* --- tooltips -------------------------------------------------------------- */
function spectrumTooltip(z) {
  const spec = zoneSpectrum(z);
  return [
    `<span class="tt-name">Spectrum — Zone ${z.slice(1)}</span>`,
    tlv('light', 'Set to', labelOf(spec)),
    `<span class="tt-row">${SPECTRUM_DESC[spec]}</span>`,
    `<span class="tt-row hub-unlock-hint">Drag: Blue / Balanced / Red</span>`,
  ].join('');
}
function photoTooltip(z) {
  const h = zoneHours(z);
  return [
    `<span class="tt-name">Day-length — Zone ${z.slice(1)}</span>`,
    tlv('revealed', 'Set to', `${h}h light`),
    `<span class="tt-row">Triggers flowering — each plant flowers only inside its own hour window.</span>`,
    `<span class="tt-row hub-unlock-hint">Drag: 1–24h</span>`,
  ].join('');
}
function spotTooltip(id) {
  const ll = gameState.lightLab;
  const spot = ll && ll.spots[id];
  if (!spot) return null;
  if (ll.phase === 'setup') {
    if (id === ll.activeSpot && spot.slotIndex == null)
      return `<span class="tt-name">Bench spot</span><span class="tt-row">Click a plant in the tray to place it here.</span>`;
    return null;   // planted slots show their own tray tooltip
  }
  if (!spot.graded) return null;
  const plant = spot.slotIndex != null ? gameState.tray[spot.slotIndex] : null;
  if (!plant) return null;
  const z = spotZoneOf(id);
  const specColor = spot.specOutcome === 'content' ? 'var(--accent-go)' : 'var(--accent-stop)';
  const lines = [
    `<span class="tt-name">${plant.name}</span>`,
    tlv('light', 'Spectrum', `${labelOf(plant.lightSpectrum)} vs ${labelOf(zoneSpectrum(z))}`),
    `<span class="tt-row"><b style="color:${specColor};">${spot.specOutcome === 'content' ? 'Right spectrum' : 'Wrong spectrum'}</b></span>`,
  ];
  if (spot.photoOutcome !== 'none') {
    const w = PHOTO_TARGET[photoperiodTriggerOf(plant)];   // truth — reveal lands on return
    lines.push(tlv('revealed', 'Day-length', `wants ${w ? w.lo + '–' + w.hi + 'h' : 'any'}, set ${zoneHours(z)}h`));
    const msg = spot.photoOutcome === 'bloom' ? 'Bloomed!'
              : spot.photoOutcome === 'near'  ? 'No flower (just off)'
              : 'No flower — wrong day-length';
    const col = spot.photoOutcome === 'bloom' ? 'var(--accent-go)'
              : spot.photoOutcome === 'near'  ? 'var(--accent-warn)'
              : 'var(--accent-stop)';
    lines.push(`<span class="tt-row"><b style="color:${col};">${msg}</b></span>`);
  }
  lines.push(`<span class="tt-row hub-unlock-hint">Click to return to tray</span>`);
  return lines.join('');
}

/* --- exit ------------------------------------------------------------------ */
function exitLightLab() {
  const ll = gameState.lightLab;
  if (ll && ll.phase === 'running') return;   // don't bail mid-cycle (beats still queued)
  setActionZone([]);
  setSlotClickHandler(null);
  clearSlotSelection();
  document.querySelectorAll('#tray .slot').forEach(s => s.classList.remove('light-done', 'light-inzone', 'seed-pulse'));
  clearTraySlotLocks();

  const inPlay = stageInPlay('light', 'lit');
  const allLit = inPlay.length > 0 && inPlay.every(p => p.lit);

  if (allLit) markComplete('light');
  else        markInProgress('light');
  if (allLit) gameState.lightLab = null;   // done → fresh next time; else resume

  transitionTo('hub', 'right');

  // Mixing Console unlocks after the Light Lab is first VISITED (Bible §5).
  if (gameState.moduleState.nutrients.status === 'locked') unlockRoomDelayed('nutrients');
  // Pollination Dome unlocks when a plant first reaches Flowering (we advance veg→flower).
  const anyFlowering = gameState.tray.some(p => p && p.health > 0 &&
    ['flowering', 'fruiting', 'harvestable'].includes(p.stage));
  if (anyFlowering && gameState.moduleState.pollination.status === 'locked') unlockRoomDelayed('pollination');
}

registerRoomBuilder('light', buildLightLab);


/* ============================================================================
   Demo 08 — Mixing Console  ·  Bible §6D
   Fourth specialist room (state key 'nutrients'; ROOMS.nutrients dir
   'down-right'). NOT a growth-spine room — Feed is a QUALITY/HEALTH boost and
   never advances a stage (mirrors hydroponics/orientation/radiation). Unlocks
   after the Light Lab is first visited (wired in exitLightLab).

   THE PUZZLE (Zoombinis sorting): 3 feeding zones, each delivers ONE N-P-K mix
   (its 3 dials) to up to 3 plants. Each plant has a HIDDEN per-nutrient target
   (magnitude from its VISIBLE hunger tier; N-vs-PK skew from its growth stage),
   so you GROUP compatible plants into a zone, then calibrate that zone's mix
   blind (guess-the-dial ×3, like the Pipe Maze gauge). No trait reveal — hunger
   is already visible; only failure badges. Per plant on Feed:
     all 3 nutrients within ±tol  → positive growth (green, no badge)
     ANY nutrient over target     → nutrient burn  (−2 pips, crispy)  [burn wins]
     else any nutrient under       → deficiency      (−1 pip, yellowing)
   ONE-SHOT, batches: click a zone tray → click a tray plant (fills the next of
   3 slots); tune the 9 dials; Feed resolves every placed plant, then the player
   clicks each fed plant home. Room COMPLETE once every living plant is fed.
   Reuses renderNeedleDial (sheet-cell needles) + animatePipeFlow + setZoneTint +
   cssQuadWarp/fitTextToBox + resolveRoomAction atoms / room-banner / fly helpers.
   Coords measured in 08a. The dial faces are baked into the bg (face:null).
   ============================================================================ */

/* --- measured coords (08a, against bg_mixing_console.jpg 1280×580) --------- */
const MIXING_DIALS = {
  Z1: { N: { x:  268, y: 397 }, P: { x:  338, y: 397 }, K: { x:  406, y: 397 } },
  Z2: { N: { x:  562, y: 397 }, P: { x:  634, y: 397 }, K: { x:  704, y: 397 } },
  Z3: { N: { x:  862, y: 397 }, P: { x:  932, y: 397 }, K: { x: 1002, y: 397 } },
};
const MIXING_PIPES = {
  Z1: { N: [[265,178],[266,353]], P: [[336,177],[337,352]], K: [[406,177],[407,352]] },
  Z2: { N: [[562,179],[563,354]], P: [[634,178],[634,353]], K: [[704,177],[704,352]] },
  Z3: { N: [[862,177],[862,352]], P: [[932,178],[932,353]], K: [[1002,178],[1002,353]] },
};
const MIXING_TRAYS = {
  Z1: { points: [[240,433],[440,433],[408,490],[182,490]] },
  Z2: { points: [[531,433],[737,433],[756,490],[512,490]] },
  Z3: { points: [[838,433],[1032,433],[1090,490],[864,490]] },
};
const MIXING_TERMINAL = { points: [[1173,260],[1257,258],[1257,358],[1173,350]] };
const MIXING_SIZES = { dial: 32, sprite: 96, spotW: 64, spotH: 38 };
const MIXING_SLOTS = { spread: 0.34, v: 0.76 };   // 3 plant-slot positions per tray (08a-tunable)

const MIX_NUT = ['N', 'P', 'K'];
const MIX_NUT_RGB  = { N: '68,136,255', P: '255,136,0', K: '68,204,68' };   // blue / orange / green (Bible §9)
const MIX_TERM_PHOSPHOR = '52,207,17';   // CRT green (#34cf11) the terminal readings are tinted toward
/* Blend an "r,g,b" string toward the phosphor green by `amt` (0 = pure nutrient
   color, 1 = pure green) → keeps N/P/K distinguishable but reading as green CRT. */
function phosphorTint(rgbStr, amt) {
  const [r, g, b] = rgbStr.split(',').map(Number);
  const [pr, pg, pb] = MIX_TERM_PHOSPHOR.split(',').map(Number);
  const mix = (a, p) => Math.round(a * (1 - amt) + p * amt);
  return `${mix(r, pr)},${mix(g, pg)},${mix(b, pb)}`;
}
const MIX_NUT_NAME = { N: 'Nitrogen', P: 'Phosphorus', K: 'Potassium' };
const MIX_NUT_ROLE = {
  N: 'Drives leafy, vegetative growth.',
  P: 'Drives roots, flowers & fruit set.',
  K: 'Overall vigor, hardiness & quality.',
};
/* Per-FAMILY sprite nudge {dx,dy} of the bottom-anchor (mirrors LIGHT). */
const MIX_SPRITE_NUDGE = {
  'leafy-rosette':    { dx: 0, dy: 24 },
  'round-fruit-bush': { dx: 0, dy: 17 },
  'tall-stalk':       { dx: 0, dy: 11 },
  'climbing-vine':    { dx: 9, dy: 7 },
  'root-tuber':       { dx: 0, dy: 19 },
};

/* --- balance (Devtools-tunable; baked defaults from the Demo 08 plan) ------ */
let MIX_TUNE = {
  base:    { light: 25, medium: 50, heavy: 75 },  // target magnitude from hunger tier
  vegBoost: 1.3, vegCut: 0.7,                      // vegetative → high N, low P/K
  flowerBoost: 1.3, flowerCut: 0.7,               // flowering+ → high P/K, low N
  earlyMul: 0.6,                                   // seed/sprout → light feeding all round
  nfixMul: 0.5,                                    // nitrogen fixers need less N
  tol: 15,                                         // ± window per nutrient (the guess-the-dial band)
  burnPip: 2, defPip: 1,                           // over = burn (−2); under = deficiency (−1)
  needlePivot: 0.82,
  termTint: 0.2,                                    // how far the terminal N/P/K readings blend toward phosphor green
};
const MIX_NFIXERS = new Set([6]);                  // Velvet Bean (mung bean) — lowers effective N need

/* Hidden per-nutrient target {N,P,K} (0–100) for a plant. */
function nutrientTarget(plant) {
  const baseV = MIX_TUNE.base[plant.nutrientHunger] != null ? MIX_TUNE.base[plant.nutrientHunger] : 50;
  let N = baseV, P = baseV, K = baseV;
  const st = plant.stage;
  if (st === 'seed' || st === 'sprout') { N *= MIX_TUNE.earlyMul; P *= MIX_TUNE.earlyMul; K *= MIX_TUNE.earlyMul; }
  else if (st === 'vegetative')         { N *= MIX_TUNE.vegBoost;  P *= MIX_TUNE.vegCut;    K *= MIX_TUNE.vegCut; }
  else                                  { N *= MIX_TUNE.flowerCut; P *= MIX_TUNE.flowerBoost; K *= MIX_TUNE.flowerBoost; }
  if (MIX_NFIXERS.has(plant.speciesId)) N *= MIX_TUNE.nfixMul;
  const cl = v => Math.max(5, Math.min(100, Math.round(v)));
  return { N: cl(N), P: cl(P), K: cl(K) };
}
/* Resolve a delivered mix {N,P,K} against a plant's hidden target. Over (burn)
   beats under (deficiency); all-in-band = positive. Returns offending nutrients. */
function mixOutcome(plant, mix) {
  const t = nutrientTarget(plant), tol = MIX_TUNE.tol;
  const over = [], under = [];
  MIX_NUT.forEach(nu => {
    if (mix[nu] > t[nu] + tol) over.push(nu);
    else if (mix[nu] < t[nu] - tol) under.push(nu);
  });
  if (over.length)  return { outcome: 'burn',       pip: MIX_TUNE.burnPip, offenders: over.map(nu => ({ nu, dir: 'over' })) };
  if (under.length) return { outcome: 'deficiency', pip: MIX_TUNE.defPip,  offenders: under.map(nu => ({ nu, dir: 'under' })) };
  return { outcome: 'good', pip: 0, offenders: [] };
}

/* Devtools setters. */
function setMixSize(key, v) { MIXING_SIZES[key] = v; renderMixingConsole(gameState); }
function setMixNeedlePivot(pct) { MIX_TUNE.needlePivot = pct / 100; renderMixingConsole(gameState); }
function setMixSlots(key, v) { MIXING_SLOTS[key] = v; renderMixingConsole(gameState); }
function setMixTune(key, v) { MIX_TUNE[key] = v; renderMixingConsole(gameState); }
function setMixTermTint(pct) { MIX_TUNE.termTint = pct / 100; renderMixingConsole(gameState); }
function setMixNudge(family, axis, v) {
  if (!MIX_SPRITE_NUDGE[family]) MIX_SPRITE_NUDGE[family] = { dx: 0, dy: 0 };
  MIX_SPRITE_NUDGE[family][axis] = v; renderMixingConsole(gameState);
}

/* --- room state ------------------------------------------------------------ */
function ensureMixingState() {
  if (!gameState.mixingConsole) {
    gameState.mixingConsole = {
      phase: 'setup',        // 'setup' = place + tune ; 'running' = feeding ; 'resolved' = click home
      activeZone: null,      // 'Z1' selected to receive the next placed plant
      feedLog: null,         // step-by-step terminal lines during/after a Feed (null = show live mixes)
      zones: Object.fromEntries(Object.keys(MIXING_DIALS).map(z => [z, { N: 50, P: 50, K: 50 }])),
      slots: {},             // 'Z1_0'.. → { slotIndex, graded, flash, outcome, offenders }
    };
    Object.keys(MIXING_TRAYS).forEach(z => [0, 1, 2].forEach(i => {
      gameState.mixingConsole.slots[`${z}_${i}`] = { slotIndex: null, graded: false, flash: null, outcome: null, offenders: [], pendingMarker: null };
    }));
  }
  return gameState.mixingConsole;
}

/* --- DOM / data helpers ---------------------------------------------------- */
function mixScreen()        { return document.querySelector('.mix-screen'); }
function mixSpotEl(id)      { const s = mixScreen(); return s && s.querySelector(`.mix-spot[data-id="${id}"]`); }
function mixTrayEl(z)       { const s = mixScreen(); return s && s.querySelector(`.mix-tray[data-zone="${z}"]`); }
function mixZoneOf(id)      { return id.split('_')[0]; }
function zoneSlotIds(z)     { return [0, 1, 2].map(i => `${z}_${i}`); }
function mixSpotPoint(id)   { const [z, i] = id.split('_'); return quadSlots(MIXING_TRAYS[z], [0.5 - MIXING_SLOTS.spread, 0.5, 0.5 + MIXING_SLOTS.spread], MIXING_SLOTS.v)[+i]; }
function mixUsesSlot(idx)   { const mc = gameState.mixingConsole; return !!mc && Object.values(mc.slots).some(s => s.slotIndex === idx); }
function mixZoneFirstEmpty(z) { const mc = gameState.mixingConsole; return zoneSlotIds(z).find(id => mc.slots[id].slotIndex == null); }
function mixZoneLivingCount(z) {
  const mc = gameState.mixingConsole;
  return zoneSlotIds(z).filter(id => { const si = mc.slots[id].slotIndex; const p = si != null ? gameState.tray[si] : null; return p && p.health > 0; }).length;
}
/* Aggregate Feed result for a tray (worst of its plants): burn > deficiency > ok. */
function zoneFeedResult(z) {
  const mc = gameState.mixingConsole;
  const outs = zoneSlotIds(z).map(id => mc.slots[id]).filter(s => s.graded && s.slotIndex != null).map(s => s.outcome);
  if (!outs.length) return null;
  if (outs.includes('burn')) return 'BURN';
  if (outs.includes('deficiency')) return 'LOW';
  return 'OK';
}
/* Weighted blend of the zone's N/P/K colors by their dial values → the mix tint. */
function zoneMixRgb(z) {
  const m = gameState.mixingConsole.zones[z];
  let r = 0, g = 0, b = 0, tot = 0;
  MIX_NUT.forEach(nu => { const w = m[nu]; const [cr, cg, cb] = MIX_NUT_RGB[nu].split(',').map(Number); r += cr * w; g += cg * w; b += cb * w; tot += w; });
  if (tot <= 0) return '120,120,130';
  return `${Math.round(r / tot)},${Math.round(g / tot)},${Math.round(b / tot)}`;
}

/* --- build ----------------------------------------------------------------- */
function buildMixingConsole(key) {
  ensureMixingState();
  const NS = 'http://www.w3.org/2000/svg';

  const wrap = document.createElement('div');
  wrap.className = 'mix-screen';
  wrap.dataset.key = key;

  const bg = document.createElement('img');
  bg.className = 'mix-bg';
  bg.src = assetUrl('bg-mixing-console');
  wrap.appendChild(bg);

  // Zone tray tint polygons (SVG, under everything) — glow the mix color on Feed.
  const traysSvg = document.createElementNS(NS, 'svg');
  traysSvg.setAttribute('class', 'mix-trays');
  traysSvg.setAttribute('viewBox', '0 0 1280 580');
  traysSvg.setAttribute('preserveAspectRatio', 'none');
  Object.entries(MIXING_TRAYS).forEach(([z, q]) => {
    const pg = document.createElementNS(NS, 'polygon');
    pg.setAttribute('class', 'mix-tray');
    pg.setAttribute('data-zone', z);
    pg.setAttribute('points', q.points.map(p => p.join(',')).join(' '));
    pg.addEventListener('click', (e) => { e.stopPropagation(); mixZoneClick(z); });
    attachTooltip(pg, () => zoneTooltip(z), 'left');
    traysSvg.appendChild(pg);
  });
  wrap.appendChild(traysSvg);

  // Pipe flow layer (SVG) — colored N/P/K polylines, traveling fill on Feed.
  const pipesSvg = document.createElementNS(NS, 'svg');
  pipesSvg.setAttribute('class', 'mix-pipes');
  pipesSvg.setAttribute('viewBox', '0 0 1280 580');
  pipesSvg.setAttribute('preserveAspectRatio', 'none');
  Object.entries(MIXING_PIPES).forEach(([z, pp]) => MIX_NUT.forEach(nu => {
    const pl = document.createElementNS(NS, 'polyline');
    pl.setAttribute('class', 'mix-flow');
    pl.setAttribute('data-id', `${z}_${nu}`);
    pl.setAttribute('points', pp[nu].map(p => p.join(',')).join(' '));
    pl.style.stroke = `rgb(${MIX_NUT_RGB[nu]})`;
    pipesSvg.appendChild(pl);
  }));
  wrap.appendChild(pipesSvg);

  const overlay = document.createElement('div');
  overlay.className = 'mix-overlay';
  wrap.appendChild(overlay);

  // Floating tuning readout (reuses .dial-readout) + warped terminal screen.
  const readout = document.createElement('div');
  readout.className = 'dial-readout';
  overlay.appendChild(readout);
  const term = document.createElement('div');
  term.className = 'mix-term';
  overlay.appendChild(term);

  // 9 dials.
  Object.keys(MIXING_DIALS).forEach(z => MIX_NUT.forEach(nu => {
    const di = document.createElement('div');
    di.className = 'mix-dial';
    di.dataset.zone = z; di.dataset.nut = nu;
    di.addEventListener('mousedown', (e) => { e.stopPropagation(); startMixDialDrag(e, z, nu); });
    attachTooltip(di, () => dialTooltip(z, nu), 'left');
    overlay.appendChild(di);
  }));

  // Plant spots — 3 per zone, at the interpolated tray-slot points.
  Object.keys(MIXING_TRAYS).forEach(z => [0, 1, 2].forEach(i => {
    const id = `${z}_${i}`;
    const el = document.createElement('div');
    el.className = 'mix-spot';
    el.dataset.id = id;
    el.addEventListener('click', (e) => { e.stopPropagation(); mixSpotClick(id); });
    attachTooltip(el, () => spotMixTooltip(id), 'left');
    overlay.appendChild(el);
  }));

  const banner = document.createElement('div');
  banner.className = 'room-banner';
  wrap.appendChild(banner);

  // Click empty bg deselects the active zone.
  wrap.addEventListener('click', (e) => {
    if (e.target.closest('.mix-dial, .mix-spot, .mix-tray')) return;
    const mc = gameState.mixingConsole;
    if (mc && mc.activeZone != null) { mc.activeZone = null; renderMixingConsole(gameState); }
  });

  setSlotClickHandler(mixTraySeedClick);
  setActionZone([
    { label: 'Feed', onClick: feedZones },
    { label: 'Back to hub', onClick: () => exitMixingConsole() },
  ]);

  renderMixingConsole(gameState, wrap);
  return wrap;
}

/* --- render (incremental) -------------------------------------------------- */
function renderMixingConsole(state, screenEl) {
  const wrap = screenEl || mixScreen();
  if (!wrap) return;
  const mc = ensureMixingState();

  renderMixTerminal(wrap);

  // Zone tint = the weighted mix color; 'active' ring when selected for placing.
  wrap.querySelectorAll('.mix-tray').forEach(el => {
    const z = el.dataset.zone;
    setZoneTint(el, zoneMixRgb(z));
    el.classList.toggle('active', mc.activeZone === z);
  });

  // Dials — size, place, needle cell (N/P/K from pointers.png) at the set value.
  const dialPx = MIXING_SIZES.dial;
  const needleH = Math.round(dialPx * 0.95), needleW = Math.max(4, Math.round(needleH * (12 / 32)));
  wrap.querySelectorAll('.mix-dial').forEach(el => {
    const z = el.dataset.zone, nu = el.dataset.nut, d = MIXING_DIALS[z][nu];
    el.style.left = d.x + 'px';
    el.style.top  = d.y + 'px';
    el.style.width = dialPx + 'px';
    el.style.height = dialPx + 'px';
    el.style.setProperty('--needle-w', needleW + 'px');
    el.style.setProperty('--needle-h', needleH + 'px');
    const nc = NEEDLE_COORDS[nu];
    renderNeedleDial(el, mc.zones[z][nu] / 100 * 360, {
      face: null, needle: 'needle-sheet', pivot: MIX_TUNE.needlePivot,
      cell: { x: nc.x, y: nc.y, w: nc.w, h: nc.h, sheetW: 38, sheetH: 32, boxW: needleW, boxH: needleH },
    });
  });

  // Spots — position at tray-slot point; paint plant sprite (bottom-anchored).
  wrap.querySelectorAll('.mix-spot').forEach(el => {
    const id = el.dataset.id;
    const spot = mc.slots[id];
    const pt = mixSpotPoint(id);
    el.style.left = pt[0] + 'px';
    el.style.top  = pt[1] + 'px';
    el.style.width  = MIXING_SIZES.spotW + 'px';
    el.style.height = MIXING_SIZES.spotH + 'px';

    const plant = spot.slotIndex != null ? state.tray[spot.slotIndex] : null;
    let sd = el.querySelector('.spot-plant');
    if (plant && plant.health > 0) {
      if (!sd) { sd = document.createElement('div'); sd.className = 'spot-plant'; el.appendChild(sd); }
      applyPlantSpriteCell(sd, plant, Math.round(MIXING_SIZES.sprite));
      const nud = MIX_SPRITE_NUDGE[plant.spriteFamily] || { dx: 0, dy: 0 };
      sd.style.left = `calc(50% + ${nud.dx}px)`;
      sd.style.top  = `calc(50% + ${nud.dy}px)`;
      const hue = (plant.cssFilter && plant.cssFilter !== 'none') ? plant.cssFilter + ' ' : '';
      sd.style.filter = hue + 'drop-shadow(0 3px 2px rgba(0,0,0,0.5))';
      el.classList.add('filled');
    } else { if (sd) sd.remove(); el.classList.remove('filled'); }
  });

  updateMixGuide(wrap);
}

/* A tray's N/P/K reading — each value in its nutrient color, tinted toward the
   phosphor green (green glow is inherited from .mix-term's text-shadow). */
function mixReadingHTML(m) {
  return MIX_NUT.map(nu => `<span style="color:rgb(${phosphorTint(MIX_NUT_RGB[nu], MIX_TUNE.termTint)})">${nu}${m[nu]}</span>`).join(' ');
}

/* Warped delivered-mix readout on the angled wall terminal (cssQuadWarp + fit). */
function renderMixTerminal(wrap) {
  const el = (wrap || mixScreen()).querySelector('.mix-term');
  if (!el) return;
  const mc = gameState.mixingConsole;
  const bb = quadBBox(MIXING_TERMINAL.points);
  el.style.width = bb.w + 'px';
  el.style.height = bb.h + 'px';
  if (mc.feedLog && mc.feedLog.length) {
    el.innerHTML = mc.feedLog.join('<br>');             // step-by-step during/after a Feed
  } else {                                              // idle: per-tray group (# label + NPK line)
    el.innerHTML = Object.keys(MIXING_DIALS).map(z => {
      const m = mc.zones[z];
      return `<div class="mix-grp"><div class="mix-tlabel">Tray&nbsp;${z.slice(1)}</div><div class="mix-tnpk">${mixReadingHTML(m)}</div></div>`;
    }).join('');
  }
  // Font sizes + group gap are CSS-var driven (Devtools sliders); the quad warp
  // maps the bb-sized element onto the wall and needs no layout.
  el.style.transform = cssQuadWarp(bb.w, bb.h, MIXING_TERMINAL.points);
}

/* --- guided flow ----------------------------------------------------------- */
function updateMixGuide(root) {
  root = root || mixScreen() || document;
  const mc = ensureMixingState();
  const setup = mc.phase === 'setup', running = mc.phase === 'running', resolved = mc.phase === 'resolved';
  const placed = Object.values(mc.slots).filter(s => { const p = s.slotIndex != null ? gameState.tray[s.slotIndex] : null; return p && p.health > 0; }).length;
  const seeding = setup && mc.activeZone != null && mixZoneFirstEmpty(mc.activeZone) != null;
  const living = gameState.tray.filter(p => p && p.health > 0);
  const allFed = living.length > 0 && living.every(p => p.fed);

  const banner = root.querySelector('.room-banner');
  if (banner) {
    banner.innerHTML =
      running    ? 'Feeding…' :
      allFed     ? 'All plants fed —<br>Back to hub' :
      resolved   ? 'Click each plant to<br>return it to the tray' :
      seeding    ? 'Choose a plant for this tray' :
      placed === 0 ? 'Click a feeding tray, then a plant' :
                   'Set each tray’s N-P-K mix,<br>then Feed';
  }

  root.querySelectorAll('.mix-tray').forEach(el => {
    const z = el.dataset.zone;
    el.classList.toggle('pulse', setup && !allFed && mc.activeZone == null && placed === 0 && mixZoneLivingCount(z) < 3);
  });
  root.querySelectorAll('.mix-dial').forEach(el => el.classList.toggle('pulse', setup && placed > 0 && !allFed));
  root.querySelectorAll('.mix-spot').forEach(el => el.classList.toggle('pulse', resolved && mc.slots[el.dataset.id].graded));
  const btns = document.querySelectorAll('.action-zone .action-btn');
  if (btns[0]) btns[0].classList.toggle('pulse', setup && placed > 0 && !allFed);
  if (btns[1]) btns[1].classList.toggle('pulse', allFed);

  syncMixTrayPulse(seeding);
}
function syncMixTrayPulse(on) {
  // Screen guard: a return-plant fly-back re-renders this room ~440ms later;
  // if the player has already exited, that pending render must NOT resurrect
  // this room's tray tags after the exit cleanup (QA sweep catch 2026-07-19).
  if (gameState.ui.currentScreen !== 'room:nutrients') return;
  document.querySelectorAll('#tray .slot').forEach(slot => {
    const idx = +slot.dataset.idx;
    const plant = gameState.tray[idx];
    const done = !!(plant && plant.fed);
    const inzone = !!(plant && !done && mixUsesSlot(idx));
    slot.classList.toggle('mix-done', done);
    slot.classList.toggle('mix-inzone', inzone);
    slot.classList.toggle('seed-pulse', !!(on && plant && plant.health > 0 && !done && !inzone));
  });
}
function flashMixBanner() {
  const b = mixScreen() && mixScreen().querySelector('.room-banner');
  if (!b) return;
  b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash');
}

/* --- tuning readout (shared .dial-readout element) ------------------------- */
function showMixReadout(px, py, text) {
  const el = mixScreen() && mixScreen().querySelector('.dial-readout');
  if (!el) return;
  el.style.left = px + 'px';
  el.style.top  = (py - 8) + 'px';
  el.style.transform = 'translate(-50%, -100%)';
  el.textContent = text;
  el.classList.remove('fading'); el.classList.add('show');
}
function fadeMixReadout() {
  const el = mixScreen() && mixScreen().querySelector('.dial-readout');
  if (!el) return;
  el.classList.remove('show'); el.classList.add('fading');
}

/* --- interactions ---------------------------------------------------------- */
function mixZoneClick(z) {
  const mc = ensureMixingState();
  if (mc.phase !== 'setup') return;
  mc.activeZone = (mc.activeZone === z) ? null : z;
  renderMixingConsole(gameState);
}
function mixTraySeedClick(idx) {
  const mc = ensureMixingState();
  if (mc.phase !== 'setup') { flashMixBanner(); return true; }
  const plant = gameState.tray[idx];
  if (!plant || plant.health <= 0) return true;
  if (plant.fed) { flashMixBanner(); return true; }           // already fed this visit
  if (mixUsesSlot(idx)) { flashMixBanner(); return true; }    // already in a zone
  if (mc.activeZone == null) { flashMixBanner(); return true; }
  const empty = mixZoneFirstEmpty(mc.activeZone);
  if (empty == null) { flashMixBanner(); return true; }       // zone full (3)
  mc.slots[empty].slotIndex = idx;
  if (mixZoneFirstEmpty(mc.activeZone) == null) mc.activeZone = null;   // zone full → deselect
  renderMixingConsole(gameState);
  return true;
}
function mixSpotClick(id) {
  const mc = ensureMixingState();
  const spot = mc.slots[id];
  if (mc.phase === 'resolved') { if (spot.graded) returnFedPlant(id); return; }
  if (mc.phase !== 'setup') return;
  if (spot.slotIndex == null) { mixZoneClick(mixZoneOf(id)); return; }   // empty spot → select its zone
  spot.slotIndex = null;                                                  // planted → take it back
  renderMixingConsole(gameState);
}
function startMixDialDrag(ev, z, nu) {
  const mc = ensureMixingState();
  if (mc.phase !== 'setup') return;
  ev.preventDefault();
  const overlay = ev.currentTarget.parentElement;
  const c = MIXING_DIALS[z][nu];
  function pick(e) {
    let pct = Math.round(pointerAngleAt(e, overlay, c.x, c.y) / 360 * 100);
    pct = Math.max(0, Math.min(100, pct));
    mc.zones[z][nu] = pct;
    showMixReadout(c.x, c.y - MIXING_SIZES.dial / 2, `${nu} ${pct}`);
    renderMixingConsole(gameState);
  }
  pick(ev);
  function up() { window.removeEventListener('mousemove', pick); window.removeEventListener('mouseup', up); fadeMixReadout(); }
  window.addEventListener('mousemove', pick);
  window.addEventListener('mouseup', up);
}

/* Pipe feed animation. Each active pipe fills full (top→bottom) on the SAME beat,
   holds full for a duration ∝ its dial (more to deliver = stays full longer), then
   drains downward (the column slides out the bottom). Returns the total ms. */
const MIX_FEED = { fill: 240, drain: 420, holdMin: 140, holdRange: 650 };
function animateMixFeed(wrap, mc) {
  let maxEnd = 0;
  Object.keys(MIXING_PIPES).forEach(z => MIX_NUT.forEach(nu => {
    const val = mc.zones[z][nu];
    const fl = wrap.querySelector(`.mix-flow[data-id="${z}_${nu}"]`);
    if (!fl) return;
    if (val <= 0) { fl.style.transition = 'none'; fl.style.opacity = '0'; return; }   // 0 = nothing delivered
    const len = fl.getTotalLength ? fl.getTotalLength() : 200;
    const hold = MIX_FEED.holdMin + (val / 100) * MIX_FEED.holdRange;
    // Fill in: dash off→on (len→0).
    fl.style.transition = 'none';
    fl.style.strokeDasharray = len;
    fl.style.strokeDashoffset = len;
    fl.style.opacity = '1';
    void fl.getBoundingClientRect();
    requestAnimationFrame(() => {
      fl.style.transition = `stroke-dashoffset ${MIX_FEED.fill}ms linear`;
      fl.style.strokeDashoffset = '0';
    });
    // Drain after the hold: keep shifting the dash past the end (0→−len) so the
    // fill empties out the bottom (top clears first), then fade.
    const drainAt = MIX_FEED.fill + hold;
    setTimeout(() => {
      fl.style.transition = `stroke-dashoffset ${MIX_FEED.drain}ms ease-in`;
      fl.style.strokeDashoffset = -len;
    }, drainAt);
    setTimeout(() => { fl.style.opacity = '0'; }, drainAt + MIX_FEED.drain);
    maxEnd = Math.max(maxEnd, drainAt + MIX_FEED.drain);
  }));
  return maxEnd || 600;
}

/* --- Feed (one-shot, staged beats) ----------------------------------------- */
function feedZones() {
  const mc = ensureMixingState();
  if (mc.phase !== 'setup') { shakeActionButton(); flashMixBanner(); return; }

  const placedIds = Object.keys(mc.slots).filter(id => {
    const si = mc.slots[id].slotIndex, p = si != null ? gameState.tray[si] : null;
    return p && p.health > 0;
  });
  if (placedIds.length === 0) { shakeActionButton(); flashMixBanner(); return; }   // need ≥1 plant

  mc.phase = 'running';
  deductFood(1);
  gameState.moduleState.nutrients.actionsThisSession++;

  const activeZones = Object.keys(MIXING_DIALS).filter(z => mixZoneLivingCount(z) > 0);
  mc.feedLog = ['&gt; FEEDING'].concat(activeZones.map(z => `T${z.slice(1)} ${mixReadingHTML(mc.zones[z])}`));

  const wrap = mixScreen();
  // Pipe feed animation: all pipes fill full together, hold (longer = more dosed),
  // then drain downward — higher dial holds full longer before draining.
  let maxFlow = 0;
  if (wrap) {
    wrap.querySelectorAll('.mix-tray').forEach(el => el.classList.add('glow'));
    maxFlow = animateMixFeed(wrap, mc);
  }
  renderMixingConsole(gameState);

  // Beat 1 — resolve each plant against its zone mix; flash + store the verdict.
  // The badge/pip is NOT applied now — it lands when the plant is returned to the
  // tray (Pipe-Maze style). We stash the marker spec on the spot for that moment.
  setTimeout(() => {
    placedIds.forEach(id => {
      const z = mixZoneOf(id);
      const spot = mc.slots[id];
      const plant = gameState.tray[spot.slotIndex];
      if (!plant || plant.health <= 0) return;
      const res = mixOutcome(plant, mc.zones[z]);
      spot.graded = true;
      spot.outcome = res.outcome;
      spot.offenders = res.offenders;
      spot.flash = res.outcome === 'good' ? 'ok' : res.outcome === 'deficiency' ? 'near' : 'far';

      if (res.outcome !== 'good') {
        const names = res.offenders.map(o => MIX_NUT_NAME[o.nu]).join(', ');
        const dir = res.offenders[0].dir === 'over' ? 'Too much' : 'Too little';
        spot.pendingMarker = {
          kind: res.outcome === 'burn' ? 'nutrient-burn' : 'deficiency',
          pipCost: res.pip,
          deathCause: res.outcome === 'burn' ? 'nutrient-burn' : 'nutrient-deficiency',
          detail: `${dir} ${names} (−${res.pip}).`,
        };
      } else {
        spot.pendingMarker = null;
      }
    });
    // Terminal switches from "feeding" to a per-tray result readout.
    mc.feedLog = ['&gt; RESULTS'].concat(activeZones.map(z => `Tray ${z.slice(1)}: ${zoneFeedResult(z) || '—'}`));
    renderTray(gameState);
    renderMixingConsole(gameState);
    placedIds.forEach(id => {
      const el = mixSpotEl(id);
      if (el && mc.slots[id].flash) { void el.offsetWidth; el.classList.add('flash-' + mc.slots[id].flash); }
    });

    // Beat 2 — a healthy feed pops; clear the flash.
    setTimeout(() => {
      placedIds.forEach(id => { const el = mixSpotEl(id); if (el) el.classList.remove('flash-ok', 'flash-near', 'flash-far'); });
      placedIds.forEach(id => {
        const el = mixSpotEl(id), sd = el && el.querySelector('.spot-plant');
        if (sd && mc.slots[id].outcome === 'good') { sd.classList.remove('grow-pop'); void sd.offsetWidth; sd.classList.add('grow-pop'); }
      });

      // Beat 3 — resolved: drop dead plants' spots; click the rest home.
      setTimeout(() => {
        if (wrap) wrap.querySelectorAll('.mix-tray').forEach(el => el.classList.remove('glow'));
        placedIds.forEach(id => {
          const pl = gameState.tray[mc.slots[id].slotIndex];
          if (!pl || pl.health <= 0) { const s = mc.slots[id]; s.slotIndex = null; s.graded = false; s.flash = null; }
        });
        mc.phase = 'resolved';
        mc.activeZone = null;
        renderMixingConsole(gameState);
      }, 420);
    }, 520);
  }, Math.max(360, maxFlow + 200));
}

/* Return one fed plant to the tray (player-driven, 'resolved'). The verdict was
   shown at resolve, but the badge/pip is APPLIED NOW (Pipe-Maze style) — a good
   feed leaves no badge; burn/deficiency stamps the marker (may be lethal). */
function returnFedPlant(id) {
  const mc = gameState.mixingConsole;
  const spot = mc.slots[id];
  const plant = spot.slotIndex != null ? gameState.tray[spot.slotIndex] : null;
  if (plant) {
    if (spot.pendingMarker) addStressMarker(plant, spot.pendingMarker);   // killPlant self-renders if lethal
    plant.fed = true;
  }
  flyMixPlantsToTray([id], () => {
    spot.slotIndex = null; spot.graded = false; spot.flash = null; spot.outcome = null; spot.offenders = []; spot.pendingMarker = null;
    if (!Object.values(mc.slots).some(s => s.graded)) { mc.phase = 'setup'; mc.feedLog = null; }   // batch done → live mixes again
    renderMixingConsole(gameState);
  });
}
/* Cosmetic spot→tray fly (the plant already lives in its slot). Lives on #stage. */
function flyMixPlantsToTray(ids, done) {
  const stage = document.getElementById('stage');
  const mc = gameState.mixingConsole;
  const items = ids.map(id => {
    const si = mc.slots[id].slotIndex;
    const plant = si != null ? gameState.tray[si] : null;
    const se = mixSpotEl(id);
    const sd = se && se.querySelector('.spot-plant');
    const slotSprite = document.querySelector(`#tray .slot[data-idx="${si}"] .plant-sprite`);
    return (plant && sd && slotSprite) ? { plant, sd, slotSprite } : null;
  }).filter(Boolean);
  if (!stage || items.length === 0) { done && done(); return; }
  let pending = items.length;
  items.forEach(({ plant, sd, slotSprite }) => {
    const from = stageLocalRect(sd), to = stageLocalRect(slotSprite);
    const fly = document.createElement('div');
    fly.className = 'sub-fly';
    applyPlantSpriteCell(fly, plant, Math.round(from.w));
    fly.style.left = from.left + 'px';
    fly.style.top  = from.top + 'px';
    stage.appendChild(fly);
    sd.style.visibility = 'hidden';
    const tx = to.left + to.w / 2 - from.w / 2;
    const ty = to.top  + to.h / 2 - from.w / 2;
    void fly.offsetWidth;
    requestAnimationFrame(() => { fly.style.left = tx + 'px'; fly.style.top = ty + 'px'; fly.style.opacity = '0.15'; });
    setTimeout(() => { fly.remove(); if (--pending === 0) done && done(); }, 440);
  });
}

/* --- tooltips -------------------------------------------------------------- */
function dialTooltip(z, nu) {
  const v = gameState.mixingConsole.zones[z][nu];
  return [
    `<span class="tt-name">${MIX_NUT_NAME[nu]} (${nu}) — Tray ${z.slice(1)}</span>`,
    tlv('nutrient', 'Dose', `${v}`),
    `<span class="tt-row">${MIX_NUT_ROLE[nu]}</span>`,
    `<span class="tt-row hub-unlock-hint">Drag: 0–100. Exact need is hidden — read the plant’s hunger.</span>`,
  ].join('');
}
function zoneTooltip(z) {
  const mc = gameState.mixingConsole;
  if (!mc) return null;
  if (mc.phase === 'setup') {
    const m = mc.zones[z], n = mixZoneLivingCount(z);
    return [
      `<span class="tt-name">Feeding Tray ${z.slice(1)}</span>`,
      `<span class="tt-row">Mix: N ${m.N} · P ${m.P} · K ${m.K}</span>`,
      `<span class="tt-row">${n}/3 plants — all share this one mix.</span>`,
      `<span class="tt-row hub-unlock-hint">Click to select, then click a plant.</span>`,
    ].join('');
  }
  return null;
}
function spotMixTooltip(id) {
  const mc = gameState.mixingConsole;
  const spot = mc && mc.slots[id];
  if (!spot) return null;
  if (mc.phase === 'setup') {
    if (spot.slotIndex == null) return null;
    const pl = gameState.tray[spot.slotIndex];
    return pl ? `<span class="tt-name">${pl.name}</span><span class="tt-row hub-unlock-hint">Click to take back to the tray</span>` : null;
  }
  if (!spot.graded) return null;
  const plant = spot.slotIndex != null ? gameState.tray[spot.slotIndex] : null;
  if (!plant) return null;
  const z = mixZoneOf(id), m = mc.zones[z];
  const col = spot.outcome === 'good' ? 'var(--accent-go)' : spot.outcome === 'deficiency' ? 'var(--accent-warn)' : 'var(--accent-stop)';
  const verdict = spot.outcome === 'good' ? 'Well fed' : spot.outcome === 'deficiency' ? 'Deficiency' : 'Nutrient burn';
  const lines = [
    `<span class="tt-name">${plant.name}</span>`,
    tlv('nutrient', 'Hunger', labelOf(plant.nutrientHunger)),
    `<span class="tt-row">Fed N ${m.N} · P ${m.P} · K ${m.K}</span>`,
    `<span class="tt-row"><b style="color:${col};">${verdict}</b></span>`,
  ];
  if (spot.offenders && spot.offenders.length) {
    const names = spot.offenders.map(o => MIX_NUT_NAME[o.nu]).join(', ');
    const dir = spot.offenders[0].dir === 'over' ? 'Too much' : 'Too little';
    lines.push(`<span class="tt-row" style="color:${col};">${dir} ${names}</span>`);
  }
  lines.push(`<span class="tt-row hub-unlock-hint">Click to return to tray</span>`);
  return lines.join('');
}

/* --- exit ------------------------------------------------------------------ */
function exitMixingConsole() {
  const mc = gameState.mixingConsole;
  if (mc && mc.phase === 'running') return;   // don't bail mid-feed (beats still queued)
  setActionZone([]);
  setSlotClickHandler(null);
  clearSlotSelection();
  document.querySelectorAll('#tray .slot').forEach(s => s.classList.remove('mix-done', 'mix-inzone', 'seed-pulse'));

  const living = gameState.tray.filter(p => p && p.health > 0);
  const allFed = living.length > 0 && living.every(p => p.fed);

  if (allFed) markComplete('nutrients');
  else        markInProgress('nutrients');
  if (allFed) gameState.mixingConsole = null;   // done → fresh next time; else resume

  transitionTo('hub', 'down-right');
  // Mixing Console unlocks nothing downstream (Bible §5).
}

registerRoomBuilder('nutrients', buildMixingConsole);


/* ============================================================================
   Demo 09 — Orientation Chamber (Gravity)  ·  Bible §6F
   BOOST/discovery room (state key 'orientation'; ROOMS.orientation dir 'down-left').
   Reveals each plant's hidden GRAVITY RESPONSE (strict / flexible / indifferent).
   4 glass tubes; load a plant, rotate it 90° CW until the shoot points UP:
     • strict      → only happy UPRIGHT (rot 0). Left wrong on Confirm = −1 pip +
                     gravityHighRisk; flagged high-risk in the Hydroponic Bay either way.
     • flexible /
       indifferent → fine at ANY rotation (no penalty).
   Discovery is by LIVE FEEDBACK: rotating sparkles green (happy) / red (wrong) and
   the angled left-wall status screens mirror it. Confirm Orientations costs 1 food
   and does NOT advance a stage (mirrors Mixing/Hydroponics/Radiation). Per the global
   convention the verdict shows at resolve but the reveal/badge/pip APPLY on return.
   Gates the Hydroponic Bay (needs a revealed gravity trait + an Agar-Gel plant).
   Reuses: cssQuadWarp/quadBBox for the status screens, particleBurst for sparkle,
   applyPlantSpriteCell (CENTER-anchored + rotated), the shared .room-banner / fly
   helpers, and the on-return badge convention. Coords measured in 09a.
   ============================================================================ */

/* --- measured coords (09a, against bg_orientation.jpg 1280×580) ------------ */
const ORIENT_TUBES = {
  T1: { x:  378, y: 262 },
  T2: { x:  537, y: 262 },
  T3: { x:  696, y: 262 },
  T4: { x:  855, y: 262 },
};
const ORIENT_BUTTONS = {
  T1: { x:  378, y: 415 },
  T2: { x:  537, y: 415 },
  T3: { x:  696, y: 415 },
  T4: { x:  855, y: 415 },
};
const ORIENT_STATUS = {
  T1: { points: [[35,178],[85,182],[85,266],[36,268]] },
  T2: { points: [[105,184],[147,187],[147,265],[104,266]] },
  T3: { points: [[166,189],[201,191],[201,262],[165,262]] },
  T4: { points: [[219,195],[251,197],[252,258],[219,260]] },
};
const ORIENT_SIZES = { plant: 96, button: 72, tubeW: 76, tubeH: 166 };   // tubeW/H = click/pulse/flash box (the cylinder); plant = sprite footprint
const ORIENT_TUBE_KEYS = Object.keys(ORIENT_TUBES);
const ORIENT_INIT_ROTS = [0, 90, 180, 270];   // random "microgravity disorientation" on load
const ORIENT_FX_DY = 60;                       // panel→stage offset for particleBurst (top bar)

/* --- gravity-response resolver (family default + explicit SPECIES override) -
   Mirrors substratePreferenceOf: the 13 species with gravity:null fall back to a
   family default (root crops & tall stalks lean strict; vines & fruit flexible;
   leafy rosettes indifferent). Root-tuber is already fully explicit in SPECIES. */
const FAMILY_GRAVITY_DEFAULT = {
  'leafy-rosette':    'indifferent',
  'round-fruit-bush': 'flexible',
  'climbing-vine':    'flexible',
  'tall-stalk':       'strict',
  'root-tuber':       'strict',
};
function gravityResponseOf(plant) {
  const s = SPECIES[plant.speciesId];
  return (s && s.gravity) || FAMILY_GRAVITY_DEFAULT[plant.spriteFamily] || 'indifferent';
}
/* A tube is "happy" when its plant's shoot points up enough for its gravity type:
   strict needs UPRIGHT (rot 0); flexible/indifferent are content at any rotation. */
function orientHappy(plant, rot) {
  return gravityResponseOf(plant) === 'strict' ? (rot % 360 === 0) : true;
}
const ORIENT_RESPONSE_DESC = {
  strict:      'Strict gravitropic — needs gravity to root & grow upright.',
  flexible:    'Flexible — copes without a strong gravity cue.',
  indifferent: 'Indifferent — grows fine in any orientation.',
};

/* Devtools setters. */
function setOrientSize(key, v) { ORIENT_SIZES[key] = v; renderOrientationChamber(gameState); }

/* --- room state ------------------------------------------------------------ */
function ensureOrientationState() {
  if (!gameState.orientationChamber) {
    gameState.orientationChamber = {
      phase: 'setup',       // 'setup' = load + rotate ; 'running' = confirming ; 'resolved' = click home
      activeTube: null,     // 'T1' selected to receive the next placed plant
      tubes: Object.fromEntries(ORIENT_TUBE_KEYS.map(t => [t, {
        slotIndex: null,    // tray index of the loaded plant
        rot: 0,             // 0/90/180/270, clockwise; 0 = shoot up
        graded: false,      // confirmed this batch → click home in 'resolved'
        outcome: null,      // 'aligned' | 'free' | 'wrong'
        light: 'empty',     // status-screen state: 'empty' | 'ok' | 'wrong'
        pendingReveal: false,
        pendingHighRisk: false,
        pendingMarker: null,
      }])),
    };
  }
  return gameState.orientationChamber;
}

/* --- DOM / data helpers ---------------------------------------------------- */
function orientScreen()   { return document.querySelector('.orient-screen'); }
function orientTubeEl(t)  { const s = orientScreen(); return s && s.querySelector(`.orient-tube[data-id="${t}"]`); }
function orientUsesSlot(idx) { const oc = gameState.orientationChamber; return !!oc && Object.values(oc.tubes).some(tt => tt.slotIndex === idx); }
function orientFirstEmpty()  { const oc = gameState.orientationChamber; return ORIENT_TUBE_KEYS.find(t => oc.tubes[t].slotIndex == null); }
function orientLivingPlaced() {
  const oc = gameState.orientationChamber;
  return ORIENT_TUBE_KEYS.filter(t => { const si = oc.tubes[t].slotIndex; const p = si != null ? gameState.tray[si] : null; return p && p.health > 0; });
}
/* Status-screen state for a tube (live in setup, locked verdict once resolved). */
function orientStatusState(t) {
  const oc = gameState.orientationChamber, tt = oc.tubes[t];
  const p = tt.slotIndex != null ? gameState.tray[tt.slotIndex] : null;
  if (!p || p.health <= 0) return 'empty';
  if (oc.phase === 'resolved' || tt.graded) return tt.light;
  return orientHappy(p, tt.rot) ? 'ok' : 'wrong';
}

/* --- build ----------------------------------------------------------------- */
function buildOrientationChamber(key) {
  ensureOrientationState();

  const wrap = document.createElement('div');
  wrap.className = 'orient-screen';
  wrap.dataset.key = key;

  const bg = document.createElement('img');
  bg.className = 'orient-bg';
  bg.src = assetUrl('bg-orientation');
  wrap.appendChild(bg);

  // Plant layer (UNDER the glass) — tube plant sprites live here.
  const overlay = document.createElement('div');
  overlay.className = 'orient-overlay';
  wrap.appendChild(overlay);
  ORIENT_TUBE_KEYS.forEach(t => {
    const el = document.createElement('div');
    el.className = 'orient-tube';
    el.dataset.id = t;
    el.addEventListener('click', (e) => { e.stopPropagation(); orientTubeClick(t); });
    attachTooltip(el, () => orientTubeTooltip(t), 'left');
    overlay.appendChild(el);
  });

  // Full-screen glass sheen overlay (plants read as "behind the glass").
  const glass = document.createElement('img');
  glass.className = 'orient-glass';
  glass.src = assetUrl('bg-orientation-glass');
  wrap.appendChild(glass);

  // Status screens (warped onto the angled left-wall panel) — ABOVE the glass.
  const statusLayer = document.createElement('div');
  statusLayer.className = 'orient-status-layer';
  ORIENT_TUBE_KEYS.forEach(t => {
    const s = document.createElement('div');
    s.className = 'orient-stat';
    s.dataset.id = t;
    statusLayer.appendChild(s);
  });
  wrap.appendChild(statusLayer);

  // Rotate buttons (ABOVE the glass) — one below each tube; sprite frame swap.
  const btnLayer = document.createElement('div');
  btnLayer.className = 'orient-btn-layer';
  ORIENT_TUBE_KEYS.forEach(t => {
    const b = document.createElement('div');
    b.className = 'orient-rbtn';
    b.dataset.id = t;
    b.style.backgroundImage = `url('${assetUrl('rotate-button-up')}')`;
    b.addEventListener('click', (e) => { e.stopPropagation(); orientRotateClick(t); });
    attachTooltip(b, () => orientButtonTooltip(t), 'left');
    btnLayer.appendChild(b);
  });
  wrap.appendChild(btnLayer);

  const banner = document.createElement('div');
  banner.className = 'room-banner';
  wrap.appendChild(banner);

  // Click empty bg deselects the active tube.
  wrap.addEventListener('click', (e) => {
    if (e.target.closest('.orient-tube, .orient-rbtn')) return;
    const oc = gameState.orientationChamber;
    if (oc && oc.activeTube != null) { oc.activeTube = null; renderOrientationChamber(gameState); }
  });

  setSlotClickHandler(orientTraySeedClick);
  setActionZone([
    { label: 'Confirm Orientations', onClick: confirmOrientations },
    { label: 'Back to hub', onClick: () => exitOrientationChamber() },
  ]);

  renderOrientationChamber(gameState, wrap);
  return wrap;
}

/* --- render (incremental) -------------------------------------------------- */
function renderOrientationChamber(state, screenEl) {
  const wrap = screenEl || orientScreen();
  if (!wrap) return;
  const oc = ensureOrientationState();

  // Tubes — the tube BOX (tubeW×tubeH = click/pulse/flash target) centered on the
  // anchor; the rotated plant SPRITE (plant px) centers inside it.
  const ps = ORIENT_SIZES.plant, tw = ORIENT_SIZES.tubeW, th = ORIENT_SIZES.tubeH;
  wrap.querySelectorAll('.orient-tube').forEach(el => {
    const t = el.dataset.id, tube = oc.tubes[t], c = ORIENT_TUBES[t];
    el.style.left = c.x + 'px';
    el.style.top  = c.y + 'px';
    el.style.width  = tw + 'px';
    el.style.height = th + 'px';
    el.classList.toggle('active', oc.activeTube === t);

    const plant = tube.slotIndex != null ? state.tray[tube.slotIndex] : null;
    let sd = el.querySelector('.orient-plant');
    if (plant && plant.health > 0) {
      if (!sd) { sd = document.createElement('div'); sd.className = 'orient-plant'; el.appendChild(sd); }
      applyPlantSpriteCell(sd, plant, ps);   // CENTER-anchored (CSS left/top:50%); no per-family nudge needed
      const hue = (plant.cssFilter && plant.cssFilter !== 'none') ? plant.cssFilter + ' ' : '';
      sd.style.filter = hue + 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))';
      sd.style.transform = `translate(-50%, -50%) rotate(${tube.rot}deg)`;
      el.classList.add('filled');
    } else { if (sd) sd.remove(); el.classList.remove('filled'); }
  });

  // Rotate buttons — position, size, usability dim.
  const bw = ORIENT_SIZES.button, bh = Math.round(bw * 62 / 78);
  wrap.querySelectorAll('.orient-rbtn').forEach(el => {
    const t = el.dataset.id, c = ORIENT_BUTTONS[t], tube = oc.tubes[t];
    el.style.left = c.x + 'px';
    el.style.top  = c.y + 'px';
    el.style.width  = bw + 'px';
    el.style.height = bh + 'px';
    const plant = tube.slotIndex != null ? state.tray[tube.slotIndex] : null;
    el.classList.toggle('disabled', !(plant && plant.health > 0 && oc.phase === 'setup'));
  });

  renderOrientStatus(wrap);
  updateOrientGuide(wrap);
}

/* Status screens warped onto the angled left-wall panel (cssQuadWarp). Each lights
   its tube state — off / OK (green) / ADJUST (red) — a persistent mirror of the
   live sparkle feedback. */
function renderOrientStatus(wrap) {
  wrap = wrap || orientScreen();
  if (!wrap) return;
  ORIENT_TUBE_KEYS.forEach((t, i) => {
    const el = wrap.querySelector(`.orient-stat[data-id="${t}"]`);
    if (!el) return;
    const bb = quadBBox(ORIENT_STATUS[t].points);
    el.style.width = bb.w + 'px';
    el.style.height = bb.h + 'px';
    const st = orientStatusState(t);
    el.classList.toggle('on', st !== 'empty');
    el.classList.toggle('ok', st === 'ok');
    el.classList.toggle('wrong', st === 'wrong');
    const word = st === 'ok' ? 'OK' : st === 'wrong' ? 'ADJUST' : '';
    el.innerHTML = `<div class="os-num">${i + 1}</div><div class="os-word">${word}</div>`;
    el.style.transform = cssQuadWarp(bb.w, bb.h, ORIENT_STATUS[t].points);
  });
}

/* --- guided flow ----------------------------------------------------------- */
function updateOrientGuide(root) {
  root = root || orientScreen() || document;
  const oc = ensureOrientationState();
  const setup = oc.phase === 'setup', running = oc.phase === 'running', resolved = oc.phase === 'resolved';
  const placed = orientLivingPlaced().length;
  const selecting = setup && oc.activeTube != null && oc.tubes[oc.activeTube].slotIndex == null;
  const living = gameState.tray.filter(p => p && p.health > 0);
  const allDone = living.length > 0 && living.every(p => p.oriented);

  const banner = root.querySelector('.room-banner');
  if (banner) {
    banner.innerHTML =
      running    ? 'Calibrating…' :
      allDone    ? 'All plants confirmed —<br>Back to hub' :
      resolved   ? 'Click each plant to<br>return it to the tray' :
      selecting  ? 'Choose a plant for this tube' :
      placed === 0 ? 'Click a tube, then a plant' :
                   'Rotate each shoot UP,<br>then Confirm Orientations';
  }

  root.querySelectorAll('.orient-tube').forEach(el => {
    const t = el.dataset.id, empty = oc.tubes[t].slotIndex == null;
    el.classList.toggle('pulse', setup && !allDone && oc.activeTube == null && placed === 0 && empty);
    el.classList.toggle('pulse-resolved', resolved && oc.tubes[t].graded);
  });
  root.querySelectorAll('.orient-rbtn').forEach(el => {
    const tube = oc.tubes[el.dataset.id];
    el.classList.toggle('pulse', setup && tube.slotIndex != null && !allDone);
  });
  const btns = document.querySelectorAll('.action-zone .action-btn');
  if (btns[0]) btns[0].classList.toggle('pulse', setup && placed > 0 && !allDone);
  if (btns[1]) btns[1].classList.toggle('pulse', allDone);

  syncOrientTrayPulse(selecting);
}
function syncOrientTrayPulse(on) {
  // Screen guard: a return-plant fly-back re-renders this room ~440ms later;
  // if the player has already exited, that pending render must NOT resurrect
  // this room's tray tags after the exit cleanup (QA sweep catch 2026-07-19).
  if (gameState.ui.currentScreen !== 'room:orientation') return;
  document.querySelectorAll('#tray .slot').forEach(slot => {
    const idx = +slot.dataset.idx;
    const plant = gameState.tray[idx];
    const done = !!(plant && plant.oriented);
    const intube = !!(plant && !done && orientUsesSlot(idx));
    slot.classList.toggle('orient-done', done);
    slot.classList.toggle('orient-intube', intube);
    slot.classList.toggle('seed-pulse', !!(on && plant && plant.health > 0 && !done && !intube));
  });
}
function flashOrientBanner() {
  const b = orientScreen() && orientScreen().querySelector('.room-banner');
  if (!b) return;
  b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash');
}

/* --- interactions ---------------------------------------------------------- */
function orientTubeClick(t) {
  const oc = ensureOrientationState();
  const tube = oc.tubes[t];
  if (oc.phase === 'resolved') { if (tube.graded) returnOrientedPlant(t); return; }
  if (oc.phase !== 'setup') return;
  if (tube.slotIndex != null) {                       // filled → take the plant back
    tube.slotIndex = null; tube.rot = 0; tube.light = 'empty';
    renderOrientationChamber(gameState);
    return;
  }
  oc.activeTube = (oc.activeTube === t) ? null : t;    // empty → select to load
  renderOrientationChamber(gameState);
}
function orientTraySeedClick(idx) {
  const oc = ensureOrientationState();
  if (oc.phase !== 'setup') { flashOrientBanner(); return true; }
  const plant = gameState.tray[idx];
  if (!plant || plant.health <= 0) return true;
  if (plant.oriented) { flashOrientBanner(); return true; }       // already confirmed this visit
  if (orientUsesSlot(idx)) { flashOrientBanner(); return true; }  // already in a tube
  let t = oc.activeTube;
  if (t == null || oc.tubes[t].slotIndex != null) t = orientFirstEmpty();
  if (t == null) { flashOrientBanner(); return true; }            // all tubes full
  const tube = oc.tubes[t];
  tube.slotIndex = idx;
  tube.rot = ORIENT_INIT_ROTS[Math.floor(Math.random() * 4)];     // microgravity disorientation
  oc.activeTube = orientFirstEmpty();                             // auto-advance selection
  renderOrientationChamber(gameState);
  orientSparkle(t);                                               // immediate feedback
  return true;
}
function orientRotateClick(t) {
  const oc = ensureOrientationState();
  if (oc.phase !== 'setup') return;
  const tube = oc.tubes[t];
  const plant = tube.slotIndex != null ? gameState.tray[tube.slotIndex] : null;
  if (!plant || plant.health <= 0) { flashOrientBanner(); return; }
  tube.rot += 90;                       // accumulate (no mod) so the spin is always CW; alignment tests use %360
  pressRotateButton(t);
  renderOrientationChamber(gameState);
  orientSparkle(t);
}
/* Brief sprite-frame swap on the rotate button (up → down → up). */
function pressRotateButton(t) {
  const el = orientScreen() && orientScreen().querySelector(`.orient-rbtn[data-id="${t}"]`);
  if (!el) return;
  el.style.backgroundImage = `url('${assetUrl('rotate-button-down')}')`;
  el.classList.add('pressed');
  setTimeout(() => { el.style.backgroundImage = `url('${assetUrl('rotate-button-up')}')`; el.classList.remove('pressed'); }, 130);
}
/* Live sparkle around a tube — green when the plant is happy, red when disoriented. */
function orientSparkle(t) {
  const oc = gameState.orientationChamber, tube = oc.tubes[t];
  const plant = tube.slotIndex != null ? gameState.tray[tube.slotIndex] : null;
  if (!plant) return;
  const happy = orientHappy(plant, tube.rot), c = ORIENT_TUBES[t];
  particleBurst({
    x: c.x, y: c.y + ORIENT_FX_DY,
    count: happy ? 16 : 14, color: happy ? '120,230,150' : '235,90,90',
    life: happy ? 700 : 540, spread: 1.8, gravity: happy ? 0.05 : 0.12, size: 2.5,
  });
}

/* --- Confirm (one-shot; BOOST room → NO agePlant) -------------------------- */
function confirmOrientations() {
  const oc = ensureOrientationState();
  if (oc.phase !== 'setup') { shakeActionButton(); flashOrientBanner(); return; }
  const placed = orientLivingPlaced();
  if (placed.length === 0) { shakeActionButton(); flashOrientBanner(); return; }

  oc.phase = 'running';
  deductFood(1);
  gameState.moduleState.orientation.actionsThisSession++;

  // Resolve each tube; show the verdict (status light) now, but STASH the reveal /
  // high-risk flag / pip for when the plant is returned (global convention).
  placed.forEach(t => {
    const tube = oc.tubes[t];
    const plant = gameState.tray[tube.slotIndex];
    const resp = gravityResponseOf(plant);
    const aligned = (tube.rot % 360 === 0);
    const wrong = (resp === 'strict' && !aligned);
    tube.graded = true;
    tube.outcome = resp === 'strict' ? (aligned ? 'aligned' : 'wrong') : 'free';
    tube.light = wrong ? 'wrong' : 'ok';
    tube.pendingReveal = true;
    tube.pendingHighRisk = (resp === 'strict');       // ALL strict → high-risk in Hydroponic Bay
    tube.pendingMarker = wrong
      ? { kind: 'disorientation', pipCost: 1, deathCause: 'disorientation', detail: 'Strict gravitropic — left disoriented (−1).' }
      : null;
  });

  renderOrientationChamber(gameState);

  // Confirmation sparkle pass + tube flash, then settle into 'resolved'.
  setTimeout(() => {
    placed.forEach(t => {
      const tube = oc.tubes[t], c = ORIENT_TUBES[t], ok = tube.light === 'ok';
      particleBurst({
        x: c.x, y: c.y + ORIENT_FX_DY,
        count: ok ? 22 : 18, color: ok ? '120,230,150' : '235,90,90',
        life: ok ? 820 : 620, spread: 2.2, gravity: ok ? 0.04 : 0.12, size: 3,
      });
      const el = orientTubeEl(t);
      if (el) { void el.offsetWidth; el.classList.add(ok ? 'flash-ok' : 'flash-far'); }
    });
    setTimeout(() => {
      placed.forEach(t => { const el = orientTubeEl(t); if (el) el.classList.remove('flash-ok', 'flash-far'); });
      oc.phase = 'resolved';
      oc.activeTube = null;
      renderOrientationChamber(gameState);
    }, 640);
  }, 260);
}

/* Return one confirmed plant — APPLY the reveal/flag/pip NOW (on-return convention).
   A non-strict (or correctly-aligned strict) plant leaves only the gravity badge;
   a strict plant left disoriented also takes −1 pip (may be lethal). */
function returnOrientedPlant(t) {
  const oc = gameState.orientationChamber;
  const tube = oc.tubes[t];
  const plant = tube.slotIndex != null ? gameState.tray[tube.slotIndex] : null;
  if (plant) {
    if (tube.pendingReveal) {
      revealTrait(plant, 'gravity');                  // family-resolved value + badge
      gameState.moduleState.orientation.gravityRevealed = true;
    }
    if (tube.pendingHighRisk) plant.gravityHighRisk = true;
    if (tube.pendingMarker) addStressMarker(plant, tube.pendingMarker);   // killPlant self-renders if lethal
    plant.oriented = true;
  }
  flyOrientPlantToTray(t, () => {
    tube.slotIndex = null; tube.rot = 0; tube.graded = false; tube.light = 'empty';
    tube.outcome = null; tube.pendingReveal = false; tube.pendingHighRisk = false; tube.pendingMarker = null;
    if (!Object.values(oc.tubes).some(x => x.graded)) oc.phase = 'setup';   // batch done → next batch
    renderOrientationChamber(gameState);
  });
}
/* Cosmetic tube→tray fly (the plant already lives in its slot). Lives on #stage. */
function flyOrientPlantToTray(t, done) {
  const stage = document.getElementById('stage');
  const oc = gameState.orientationChamber, tube = oc.tubes[t];
  const si = tube.slotIndex;
  const plant = si != null ? gameState.tray[si] : null;
  const te = orientTubeEl(t);
  const sd = te && te.querySelector('.orient-plant');
  const slotSprite = document.querySelector(`#tray .slot[data-idx="${si}"] .plant-sprite`);
  if (!stage || !plant || !sd || !slotSprite) { done && done(); return; }
  const from = stageLocalRect(sd), to = stageLocalRect(slotSprite);
  const fly = document.createElement('div');
  fly.className = 'sub-fly';
  applyPlantSpriteCell(fly, plant, Math.round(from.w));
  fly.style.left = from.left + 'px';
  fly.style.top  = from.top + 'px';
  stage.appendChild(fly);
  sd.style.visibility = 'hidden';
  const tx = to.left + to.w / 2 - from.w / 2;
  const ty = to.top  + to.h / 2 - from.w / 2;
  void fly.offsetWidth;
  requestAnimationFrame(() => { fly.style.left = tx + 'px'; fly.style.top = ty + 'px'; fly.style.opacity = '0.15'; });
  setTimeout(() => { fly.remove(); done && done(); }, 440);
}

/* --- tooltips -------------------------------------------------------------- */
function orientTubeTooltip(t) {
  const oc = gameState.orientationChamber;
  if (!oc) return null;
  const tube = oc.tubes[t];
  const plant = tube.slotIndex != null ? gameState.tray[tube.slotIndex] : null;
  if (oc.phase === 'setup') {
    if (!plant) return `<span class="tt-name">Tube ${t.slice(1)}</span><span class="tt-row hub-unlock-hint">Click to select, then click a plant.</span>`;
    const happy = orientHappy(plant, tube.rot);
    const shown = ((tube.rot % 360) + 360) % 360;
    return [
      `<span class="tt-name">${plant.name}</span>`,
      `<span class="tt-row">Orientation: ${shown}°${shown === 0 ? ' (upright)' : ''}</span>`,
      `<span class="tt-row" style="color:${happy ? 'var(--accent-go)' : 'var(--accent-stop)'};">${happy ? 'Shoot points up' : 'Disoriented'}</span>`,
      `<span class="tt-row hub-unlock-hint">Rotate below · click tube to take back</span>`,
    ].join('');
  }
  if (!tube.graded || !plant) return null;
  const resp = gravityResponseOf(plant);
  const col = tube.outcome === 'wrong' ? 'var(--accent-stop)' : 'var(--accent-go)';
  const verdict = tube.outcome === 'aligned' ? 'Aligned' : tube.outcome === 'free' ? 'Unaffected by gravity' : 'Left disoriented (−1)';
  return [
    `<span class="tt-name">${plant.name}</span>`,
    tlv('revealed', 'Gravity', labelOf(resp)),
    `<span class="tt-row">${ORIENT_RESPONSE_DESC[resp]}</span>`,
    `<span class="tt-row"><b style="color:${col};">${verdict}</b></span>`,
    `<span class="tt-row hub-unlock-hint">Click to return to tray</span>`,
  ].join('');
}
function orientButtonTooltip(t) {
  const oc = gameState.orientationChamber;
  if (!oc || oc.phase !== 'setup') return null;
  const tube = oc.tubes[t];
  if (tube.slotIndex == null) return null;
  return `<span class="tt-name">Rotate Tube ${t.slice(1)}</span><span class="tt-row">Turn the plant 90° clockwise.</span><span class="tt-row hub-unlock-hint">Point the shoot toward the ↑ arrow.</span>`;
}

/* --- exit ------------------------------------------------------------------ */
function exitOrientationChamber() {
  const oc = gameState.orientationChamber;
  if (oc && oc.phase === 'running') return;   // don't bail mid-confirm (beats queued)
  setActionZone([]);
  setSlotClickHandler(null);
  clearSlotSelection();
  document.querySelectorAll('#tray .slot').forEach(s => s.classList.remove('orient-done', 'orient-intube', 'seed-pulse'));

  const living = gameState.tray.filter(p => p && p.health > 0);
  const allDone = living.length > 0 && living.every(p => p.oriented);

  if (allDone) markComplete('orientation');
  else         markInProgress('orientation');
  if (allDone) gameState.orientationChamber = null;   // done → fresh next time; else resume

  transitionTo('hub', 'down-left');

  // Hydroponic Bay gate: an Agar-Gel plant AND a revealed gravity trait (Bible §5/§6E).
  maybeUnlockHydroponics();
}
/* Unlock the Hydroponic Bay once both upstream conditions hold (looser "any plant"
   rule per the resolved-ambiguities note: agar assigned AND a gravity reveal). */
function maybeUnlockHydroponics() {
  const ms = gameState.moduleState;
  const agar = !!(ms.substrate && ms.substrate.hasAgarGelAssignment);
  const grav = !!(ms.orientation && ms.orientation.gravityRevealed);
  if (agar && grav && ms.hydroponics && ms.hydroponics.status === 'locked') unlockRoomDelayed('hydroponics');
}

registerRoomBuilder('orientation', buildOrientationChamber);


/* ============================================================================
   Demo 10 — Hydroponic Bay (Solution Tank)  ·  Bible §6E
   Sixth specialist room (state key 'hydroponics'; ROOMS.hydroponics dir 'down').
   BOOST/quality room — Lock In costs 1 food, does NOT advance stage (joins
   mixing/orientation/radiation) and unlocks nothing downstream. Only Agar-Gel
   (isHydroponic) plants enter; strict-gravitropic (gravityHighRisk) plants are
   allowed but take −1. Two independent channels, each pH+EC tuned by 3 buttons
   with display-lag; the canvas trough liquid colors by pH (green/amber/red).
   Verdict shows at resolve; reveal/badges/pips apply on RETURN (global rule).
   Coords measured in demos/10a-hydroponic-coords.html.
   ============================================================================ */

/* --- measured coords (10a, against bg_hydroponic.jpg 1280×580) ------------- */
const HYDRO_TROUGHS = {
  back:  { points: [[225,243],[1061,244],[1091,258],[198,258]] },
  front: { points: [[111,370],[1175,371],[1230,400],[56,400]] },
};
const HYDRO_POTS = {
  back:  [{ x:  328, y: 251 }, { x:  524, y: 251 }, { x:  745, y: 251 }, { x:  950, y: 251 }],
  front: [{ x:  248, y: 386 }, { x:  509, y: 387 }, { x:  770, y: 387 }, { x: 1026, y: 387 }],
};
const HYDRO_METERS = {
  backPh:  { x: 391, y: 108, w:  8, h: 98, kind: 'ph', cal: [[0,1],[4,0.7686],[7,0.5212],[10,0.2627],[14,0]] },
  backEc:  { x: 486, y: 108, w: 11, h: 98, kind: 'ec', cal: [[0,1],[1,0.8048],[2,0.622],[3,0.4266],[4,0.2375],[5,0]] },
  frontPh: { x: 823, y: 107, w:  7, h: 99, kind: 'ph', cal: [[0,1],[4,0.7607],[7,0.5212],[10,0.269],[14,0]] },
  frontEc: { x: 915, y: 108, w: 10, h: 98, kind: 'ec', cal: [[0,1],[1,0.8048],[2,0.622],[3,0.4329],[4,0.2375],[5,0]] },
};
const HYDRO_BUTTONS = {
  backUp:    { x: 589, y: 291, ch: 'back',  role: 'phUp' },
  backDown:  { x: 653, y: 292, ch: 'back',  role: 'phDown' },
  backNut:   { x: 714, y: 292, ch: 'back',  role: 'nutrient' },
  frontUp:   { x: 559, y: 452, ch: 'front', role: 'phUp' },
  frontDown: { x: 653, y: 452, ch: 'front', role: 'phDown' },
  frontNut:  { x: 746, y: 453, ch: 'front', role: 'nutrient' },
};
const HYDRO_SIZES = { plant: 96, backRx: 28, backRy: 8, frontRx: 38, frontRy: 14, backBtnW: 37, backBtnH: 34, frontBtnW: 57, frontBtnH: 48, pointer: 13 };

const HYDRO_CH        = ['back', 'front'];
const HYDRO_ALL_POTS  = ['back0', 'back1', 'back2', 'back3', 'front0', 'front1', 'front2', 'front3'];
const HYDRO_METER_KEYS = ['backPh', 'backEc', 'frontPh', 'frontEc'];
const HYDRO_BTN_KEYS   = ['backUp', 'backDown', 'backNut', 'frontUp', 'frontDown', 'frontNut'];

/* Per-family sprite seat inside the pot (baked here; tuned live via Devtools). */
const HYDRO_SPRITE_NUDGE = {
  'leafy-rosette':    { dx:  2, dy: 35 },
  'root-tuber':       { dx:  0, dy: 18 },
  'tall-stalk':       { dx: -2, dy:  9 },
  'climbing-vine':    { dx: 13, dy:  5 },
  'round-fruit-bush': { dx:  7, dy: 11 },
};
/* Live-tunable knobs. startPh/startEc = the solution each channel begins at;
   phStep/ecStep = per-press increment (lag hides where it lands → overshoot). */
const HYDRO_TUNE = { startPh: 7.0, startEc: 1.0, phStep: 0.3, ecStep: 0.25,
                     hzW: 79, hzH: 157, hzDx: -11, hzDy: -5,   // meter hover-zone size + offset from the bar-rect center
                     ttMaxW: 320 };                            // tooltip box width while in this room (the pH/EC explainers are wordy)
const HYDRO_FX_DY = 60;                          // panel→stage offset for particleBurst (top bar)

function setHydroSize(key, v)  { HYDRO_SIZES[key] = v; renderHydroponicBay(gameState); }
function setHydroNudge(family, axis, v) {
  if (!HYDRO_SPRITE_NUDGE[family]) HYDRO_SPRITE_NUDGE[family] = { dx: 0, dy: 0 };
  HYDRO_SPRITE_NUDGE[family][axis] = v; renderHydroponicBay(gameState);
}
function setHydroTune(key, v)  { HYDRO_TUNE[key] = v; renderHydroponicBay(gameState); }

/* --- helpers --------------------------------------------------------------- */
function hydroScreen()       { return document.querySelector('.hydro-screen'); }
function hydroPotEl(k)       { const s = hydroScreen(); return s && s.querySelector(`.hydro-pot[data-id="${k}"]`); }
function hydroChannelOf(k)   { return k.startsWith('back') ? 'back' : 'front'; }
function hydroPotCenter(k)   { return HYDRO_POTS[hydroChannelOf(k)][+k.slice(-1)]; }
function hydroPotRadii(ch)   { return ch === 'back' ? { rx: HYDRO_SIZES.backRx, ry: HYDRO_SIZES.backRy } : { rx: HYDRO_SIZES.frontRx, ry: HYDRO_SIZES.frontRy }; }
function hydroPotHoles(ch)   { const r = hydroPotRadii(ch); return HYDRO_POTS[ch].map(p => ({ x: p.x, y: p.y, rx: r.rx, ry: r.ry })); }
function hydroUsesSlot(idx)  { const hb = gameState.hydroponicBay; return !!hb && HYDRO_ALL_POTS.some(k => hb.pots[k].slotIndex === idx); }
function hydroFirstEmptyPot(){ const hb = gameState.hydroponicBay; return HYDRO_ALL_POTS.find(k => hb.pots[k].slotIndex == null); }
function hydroEligible()     { return gameState.tray.filter(p => p && p.health > 0 && p.isHydroponic); }
function hydroPlacedPots()   {
  const hb = gameState.hydroponicBay;
  return HYDRO_ALL_POTS.filter(k => { const p = hb.pots[k].slotIndex != null ? gameState.tray[hb.pots[k].slotIndex] : null; return p && p.health > 0; });
}

/* --- room state ------------------------------------------------------------ */
function ensureHydroState() {
  if (!gameState.hydroponicBay) {
    const pots = {};
    HYDRO_ALL_POTS.forEach(k => { pots[k] = { slotIndex: null, graded: false, flash: null, outcome: null, pendingReveal: null, pendingMarkers: [], pendingThrive: false }; });
    gameState.hydroponicBay = {
      phase: 'setup',
      activePot: null,
      channels: { back: { ph: HYDRO_TUNE.startPh, ec: HYDRO_TUNE.startEc }, front: { ph: HYDRO_TUNE.startPh, ec: HYDRO_TUNE.startEc } },
      pots,
    };
  }
  return gameState.hydroponicBay;
}

/* --- build ----------------------------------------------------------------- */
function buildHydroponicBay(key) {
  ensureHydroState();
  document.documentElement.style.setProperty('--tt-max-width', HYDRO_TUNE.ttMaxW + 'px');   // wider tooltips for the pH/EC explainers (cleared on exit)

  const wrap = document.createElement('div');
  wrap.className = 'hydro-screen';
  wrap.dataset.key = key;

  const bg = document.createElement('img');
  bg.className = 'hydro-bg';
  bg.src = assetUrl('bg-hydroponic');
  wrap.appendChild(bg);

  // Canvas trough liquid (panel-local 1280×580; under the pots).
  const cv = document.createElement('canvas');
  cv.className = 'hydro-liquid';
  cv.width = 1280; cv.height = 580;
  wrap.appendChild(cv);

  // Pressed-buttons overlay (clip-revealed per button on press).
  const pressed = document.createElement('img');
  pressed.className = 'hydro-pressed';
  pressed.src = assetUrl('hydroponic-buttons-pressed');
  wrap.appendChild(pressed);

  // Pot click targets (oval) + their plant sprites.
  HYDRO_ALL_POTS.forEach(k => {
    const el = document.createElement('div');
    el.className = 'hydro-pot';
    el.dataset.id = k;
    el.addEventListener('click', (e) => { e.stopPropagation(); hydroPotClick(k); });
    attachTooltip(el, () => hydroPotTooltip(k));
    wrap.appendChild(el);
  });

  // Meter needles (DOM pointers; CSS top-transition = propagation lag).
  HYDRO_METER_KEYS.forEach(m => {
    const n = document.createElement('div');
    n.className = 'hydro-needle';
    n.dataset.id = m;
    wrap.appendChild(n);
  });

  // Meter hover zones — hover the pH/EC scale to learn what it is + the live
  // reading (same explainer per meter type; reading is that channel's).
  HYDRO_METER_KEYS.forEach(m => {
    const el = document.createElement('div');
    el.className = 'hydro-meter-hz';
    el.dataset.id = m;
    attachTooltip(el, () => hydroMeterTooltip(m));
    wrap.appendChild(el);
  });

  // Button hotzones.
  HYDRO_BTN_KEYS.forEach(b => {
    const el = document.createElement('div');
    el.className = 'hydro-btn';
    el.dataset.id = b;
    el.addEventListener('click', (e) => { e.stopPropagation(); hydroButtonClick(b); });
    attachTooltip(el, () => hydroButtonTooltip(b));
    wrap.appendChild(el);
  });

  const banner = document.createElement('div');
  banner.className = 'room-banner';
  wrap.appendChild(banner);

  // Click empty bg deselects the active pot.
  wrap.addEventListener('click', (e) => {
    if (e.target.closest('.hydro-pot, .hydro-btn')) return;
    const hb = gameState.hydroponicBay;
    if (hb && hb.activePot != null) { hb.activePot = null; renderHydroponicBay(gameState); }
  });

  setSlotClickHandler(hydroTraySeedClick);
  setActionZone([
    { label: 'Lock In', onClick: hydroLockIn },
    { label: 'Back to hub', onClick: () => exitHydroponicBay() },
  ]);

  renderHydroponicBay(gameState, wrap);
  return wrap;
}

/* --- render (incremental) -------------------------------------------------- */
function renderHydroponicBay(state, screenEl) {
  const wrap = screenEl || hydroScreen();
  if (!wrap) return;
  const hb = ensureHydroState();

  // Pots — oval box (click/flash target) + bottom-anchored plant sprite.
  HYDRO_ALL_POTS.forEach(k => {
    const el = wrap.querySelector(`.hydro-pot[data-id="${k}"]`);
    if (!el) return;
    const ch = hydroChannelOf(k), { rx, ry } = hydroPotRadii(ch), c = hydroPotCenter(k);
    el.style.left = (c.x - rx) + 'px';
    el.style.top  = (c.y - ry) + 'px';
    el.style.width  = (rx * 2) + 'px';
    el.style.height = (ry * 2) + 'px';
    el.classList.toggle('active', hb.activePot === k);

    const pot = hb.pots[k];
    const plant = pot.slotIndex != null ? state.tray[pot.slotIndex] : null;
    let sd = el.querySelector('.hydro-plant');
    if (plant && plant.health > 0) {
      if (!sd) { sd = document.createElement('div'); sd.className = 'hydro-plant'; el.appendChild(sd); }
      applyPlantSpriteCell(sd, plant, Math.round(HYDRO_SIZES.plant));   // square cell; CSS anchors bottom-center
      const nud = HYDRO_SPRITE_NUDGE[plant.spriteFamily] || { dx: 0, dy: 0 };
      sd.style.left = `calc(50% + ${nud.dx}px)`;
      sd.style.top  = `calc(50% + ${nud.dy}px)`;
      const hue = (plant.cssFilter && plant.cssFilter !== 'none') ? plant.cssFilter + ' ' : '';
      sd.style.filter = hue + 'drop-shadow(0 3px 2px rgba(0,0,0,0.5))';
      el.classList.add('filled');
    } else { if (sd) sd.remove(); el.classList.remove('filled'); }
  });

  // Needles — placed on each meter's bar; value drifts via CSS top-transition.
  HYDRO_METER_KEYS.forEach(m => {
    const n = wrap.querySelector(`.hydro-needle[data-id="${m}"]`);
    if (!n) return;
    const def = HYDRO_METERS[m], ch = def.kind === 'ph' ? (m.startsWith('back') ? 'back' : 'front') : (m.startsWith('back') ? 'back' : 'front');
    const val = def.kind === 'ph' ? hb.channels[ch].ph : hb.channels[ch].ec;
    n.style.left = (def.x - 5) + 'px';
    n.style.width = (def.w + 10) + 'px';
    renderBarMeter(n, def, val);
  });

  // Meter hover zones — a box of size hzW×hzH centered on each bar rect (covers
  // the printed scale panel).
  const { hzW, hzH, hzDx, hzDy } = HYDRO_TUNE;
  HYDRO_METER_KEYS.forEach(m => {
    const el = wrap.querySelector(`.hydro-meter-hz[data-id="${m}"]`);
    if (!el) return;
    const def = HYDRO_METERS[m];
    const cx = def.x + def.w / 2, cy = def.y + def.h / 2;
    el.style.left = (cx - hzW / 2 + hzDx) + 'px';
    el.style.top  = (cy - hzH / 2 + hzDy) + 'px';
    el.style.width  = hzW + 'px';
    el.style.height = hzH + 'px';
  });

  // Buttons — placed + disabled outside setup.
  HYDRO_BTN_KEYS.forEach(b => {
    const el = wrap.querySelector(`.hydro-btn[data-id="${b}"]`);
    if (!el) return;
    const def = HYDRO_BUTTONS[b];
    const bw = def.ch === 'back' ? HYDRO_SIZES.backBtnW : HYDRO_SIZES.frontBtnW;
    const bh = def.ch === 'back' ? HYDRO_SIZES.backBtnH : HYDRO_SIZES.frontBtnH;
    el.style.left = (def.x - bw / 2) + 'px';
    el.style.top  = (def.y - bh / 2) + 'px';
    el.style.width = bw + 'px';
    el.style.height = bh + 'px';
    el.classList.toggle('disabled', hb.phase !== 'setup');
  });

  drawHydroLiquid(wrap);
  updateHydroGuide(wrap);
}

/* Canvas pass — fill each channel's trough by its pH health color, holes cut. */
function drawHydroLiquid(wrap) {
  wrap = wrap || hydroScreen();
  if (!wrap) return;
  const cv = wrap.querySelector('.hydro-liquid');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, 1280, 580);
  const hb = ensureHydroState();
  HYDRO_CH.forEach(ch => renderTroughLiquid(ctx, HYDRO_TROUGHS[ch].points, hydroPotHoles(ch), phLiquidColor(hb.channels[ch].ph)));
}
/* pH → solution color: green safe, amber near the band edge, red lockout. */
function phLiquidColor(ph) {
  if (ph < PH_SAFE.lo || ph > PH_SAFE.hi) return '210,72,60';
  const margin = Math.min(ph - PH_SAFE.lo, PH_SAFE.hi - ph);
  if (margin < 0.7) return '222,170,60';
  return '86,188,120';
}

/* --- guided flow ----------------------------------------------------------- */
function updateHydroGuide(root) {
  root = root || hydroScreen() || document;
  const hb = ensureHydroState();
  const setup = hb.phase === 'setup', running = hb.phase === 'running', resolved = hb.phase === 'resolved';
  const placed = hydroPlacedPots().length;
  const selecting = setup && hb.activePot != null && hb.pots[hb.activePot].slotIndex == null;
  const eligible = hydroEligible();
  const allDone = eligible.length > 0 && eligible.every(p => p.hydroDone);

  const banner = root.querySelector('.room-banner');
  if (banner) {
    banner.innerHTML =
      running    ? 'Circulating solution…' :
      allDone    ? 'All plants locked in —<br>Back to hub' :
      resolved   ? 'Click each plant to<br>return it to the tray' :
      selecting  ? 'Choose an Agar-Gel plant for this pot' :
      placed === 0 ? 'Click a pot, then a plant' :
                   'Tune each channel’s pH &amp; EC,<br>then Lock In';
  }

  // Still more Agar-Gel plants to seat AND a pot to seat them in? → keep pots
  // pulsing (no auto-select). Once done placing, the buttons take over the hint.
  const emptyPotExists = HYDRO_ALL_POTS.some(k => hb.pots[k].slotIndex == null);
  const unplacedEligible = gameState.tray.some((p, idx) => p && p.health > 0 && p.isHydroponic && !p.hydroDone && !hydroUsesSlot(idx));
  const wantPlace = emptyPotExists && unplacedEligible;

  root.querySelectorAll('.hydro-pot').forEach(el => {
    const k = el.dataset.id, pot = hb.pots[k], empty = pot.slotIndex == null;
    el.classList.toggle('pulse', setup && !allDone && hb.activePot == null && empty && wantPlace);
    // Post-resolve: tint the oval by outcome (green ok / yellow survive / red stressed).
    const graded = resolved && pot.graded;
    el.classList.toggle('cond-ok',   graded && pot.flash === 'ok');
    el.classList.toggle('cond-near', graded && pot.flash === 'near');
    el.classList.toggle('cond-far',  graded && pot.flash === 'far');
  });
  root.querySelectorAll('.hydro-btn').forEach(el => el.classList.toggle('pulse', setup && placed > 0 && !allDone && !wantPlace));
  const btns = document.querySelectorAll('.action-zone .action-btn');
  if (btns[0]) btns[0].classList.toggle('pulse', setup && placed > 0 && !allDone && !wantPlace);
  if (btns[1]) btns[1].classList.toggle('pulse', allDone);

  syncHydroTrayPulse(selecting);
}
function syncHydroTrayPulse(on) {
  // Screen guard: a return-plant fly-back re-renders this room ~440ms later;
  // if the player has already exited, that pending render must NOT resurrect
  // this room's tray tags after the exit cleanup (QA sweep catch 2026-07-19).
  if (gameState.ui.currentScreen !== 'room:hydroponics') return;
  document.querySelectorAll('#tray .slot').forEach(slot => {
    const idx = +slot.dataset.idx;
    const plant = gameState.tray[idx];
    const done = !!(plant && plant.hydroDone);
    const inpot = !!(plant && !done && hydroUsesSlot(idx));
    const locked = !!(plant && plant.health > 0 && !plant.isHydroponic);   // non-hydroponic → can't enter
    slot.classList.toggle('hydro-done', done);
    slot.classList.toggle('hydro-inpot', inpot);
    slot.classList.toggle('hydro-locked', locked);
    slot.classList.toggle('seed-pulse', !!(on && plant && plant.health > 0 && plant.isHydroponic && !done && !inpot));

    // Locked plants get an on-slot ✕ + reason (the hover tooltip is taken by the
    // plant's own info, so the "why" lives here). Injected/removed as a real child.
    let mark = slot.querySelector('.hydro-lock-mark');
    if (locked) {
      if (!mark) {
        mark = document.createElement('div');
        mark.className = 'hydro-lock-mark';
        mark.innerHTML = `<div class="hlm-x">✕</div><div class="hlm-why">Needs<br>Agar&nbsp;Gel</div>`;
        slot.appendChild(mark);
      }
    } else if (mark) { mark.remove(); }
  });
}
function flashHydroBanner() {
  const b = hydroScreen() && hydroScreen().querySelector('.room-banner');
  if (!b) return;
  b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash');
}

/* --- interactions ---------------------------------------------------------- */
function hydroPotClick(k) {
  const hb = ensureHydroState();
  const pot = hb.pots[k];
  if (hb.phase === 'resolved') { if (pot.graded) returnHydroPlant(k); return; }
  if (hb.phase !== 'setup') return;
  if (pot.slotIndex != null) { pot.slotIndex = null; renderHydroponicBay(gameState); return; }   // take plant back
  hb.activePot = (hb.activePot === k) ? null : k;
  renderHydroponicBay(gameState);
}
function hydroTraySeedClick(idx) {
  const hb = ensureHydroState();
  if (hb.phase !== 'setup') { flashHydroBanner(); return true; }
  const plant = gameState.tray[idx];
  if (!plant || plant.health <= 0) return true;
  if (!plant.isHydroponic) { flashHydroBanner(); return true; }   // gate: only Agar-Gel plants
  if (plant.hydroDone) { flashHydroBanner(); return true; }
  if (hydroUsesSlot(idx)) { flashHydroBanner(); return true; }
  let k = hb.activePot;
  if (k == null || hb.pots[k].slotIndex != null) k = hydroFirstEmptyPot();
  if (k == null) { flashHydroBanner(); return true; }
  hb.pots[k].slotIndex = idx;
  hb.activePot = null;                 // deselect → remaining empty pots pulse again (pick the next one)
  renderHydroponicBay(gameState);
  return true;
}
function hydroButtonClick(b) {
  const hb = ensureHydroState();
  if (hb.phase !== 'setup') { flashHydroBanner(); return; }
  const def = HYDRO_BUTTONS[b], chan = hb.channels[def.ch];
  if (def.role === 'phUp')        chan.ph = Math.min(14, +(chan.ph + HYDRO_TUNE.phStep).toFixed(2));
  else if (def.role === 'phDown') chan.ph = Math.max(0,  +(chan.ph - HYDRO_TUNE.phStep).toFixed(2));
  else                            chan.ec = Math.min(5,  +(chan.ec + HYDRO_TUNE.ecStep).toFixed(2));
  pressHydroButton(b);
  renderHydroponicBay(gameState);
}
/* Briefly reveal the baked pressed-button art by clipping the overlay to the
   button's rect. */
function pressHydroButton(b) {
  const wrap = hydroScreen();
  if (!wrap) return;
  const img = wrap.querySelector('.hydro-pressed');
  if (!img) return;
  const def = HYDRO_BUTTONS[b];
  const bw = def.ch === 'back' ? HYDRO_SIZES.backBtnW : HYDRO_SIZES.frontBtnW;
  const bh = def.ch === 'back' ? HYDRO_SIZES.backBtnH : HYDRO_SIZES.frontBtnH;
  const top = def.y - bh / 2, left = def.x - bw / 2, right = 1280 - (def.x + bw / 2), bottom = 580 - (def.y + bh / 2);
  img.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;
  img.classList.add('show');
  clearTimeout(img._t); img._t = setTimeout(() => img.classList.remove('show'), 150);
}

/* --- Lock In (one-shot; BOOST room → NO agePlant) -------------------------- */
function hydroLockIn() {
  const hb = ensureHydroState();
  if (hb.phase !== 'setup') { shakeActionButton(); flashHydroBanner(); return; }
  const placed = hydroPlacedPots();
  if (placed.length === 0) { shakeActionButton(); flashHydroBanner(); return; }

  hb.phase = 'running';
  deductFood(1);
  gameState.moduleState.hydroponics.actionsThisSession++;

  // Resolve each placed pot; show verdict now, STASH reveal/markers for return.
  placed.forEach(k => {
    const ch = hydroChannelOf(k), chan = hb.channels[ch], pot = hb.pots[k];
    const plant = gameState.tray[pot.slotIndex];
    const pref = phPreferenceOf(plant);
    const lockout  = chan.ph < PH_SAFE.lo || chan.ph > PH_SAFE.hi;
    const inPhBand = !lockout && chan.ph >= PH_BANDS[pref].lo && chan.ph <= PH_BANDS[pref].hi;
    const ecHigh   = chan.ec > EC_HIGH;
    const ecInBand = chan.ec >= EC_BAND.lo && chan.ec <= EC_BAND.hi;
    const strict   = !!plant.gravityHighRisk;

    const markers = [];
    if (lockout) markers.push({ kind: 'ph-lockout', pipCost: 2, deathCause: 'ph-lockout', detail: `pH ${chan.ph.toFixed(1)} outside the safe 5–9 band — nutrient lockout (−2).` });
    if (ecHigh)  markers.push({ kind: 'nutrient-burn', pipCost: 1, deathCause: 'nutrient-burn', detail: `EC ${chan.ec.toFixed(1)} too high — salt stress (−1).` });
    if (strict)  markers.push({ kind: 'disorientation', pipCost: 1, deathCause: 'disorientation', detail: 'Gravity-dependent roots — reduced hydroponic uptake (−1).' });

    const thrive = !lockout && inPhBand && ecInBand && !strict;
    pot.graded = true;
    pot.pendingReveal = 'ph';
    pot.pendingMarkers = markers;
    pot.pendingThrive = thrive;
    pot.outcome = lockout ? 'lockout' : markers.length ? 'stress' : thrive ? 'thrive' : 'survive';
    pot.flash = markers.length ? 'far' : thrive ? 'ok' : 'near';
  });

  renderHydroponicBay(gameState);

  // Beat: flash pots + particle burst, then settle into 'resolved'.
  setTimeout(() => {
    placed.forEach(k => {
      const pot = hb.pots[k], el = hydroPotEl(k), c = hydroPotCenter(k);
      if (el && pot.flash) { void el.offsetWidth; el.classList.add('flash-' + pot.flash); }
      const col = pot.flash === 'far' ? '235,90,90' : pot.flash === 'near' ? '235,200,90' : '120,230,150';
      particleBurst({ x: c.x, y: c.y + HYDRO_FX_DY, count: pot.flash === 'ok' ? 20 : 16, color: col, life: pot.flash === 'ok' ? 760 : 560, spread: 2, gravity: pot.flash === 'ok' ? 0.05 : 0.12, size: 2.6 });
    });
    setTimeout(() => {
      placed.forEach(k => { const el = hydroPotEl(k); if (el) el.classList.remove('flash-ok', 'flash-near', 'flash-far'); });
      hb.phase = 'resolved';
      hb.activePot = null;
      renderHydroponicBay(gameState);
    }, 680);
  }, 420);
}

/* Return one resolved plant — APPLY reveal/markers NOW (on-return convention).
   A clean solution leaves only the pH-preference badge; lockout/EC/strict cost
   pips (may be lethal → killPlant self-renders). */
function returnHydroPlant(k) {
  const hb = gameState.hydroponicBay;
  const pot = hb.pots[k];
  const plant = pot.slotIndex != null ? gameState.tray[pot.slotIndex] : null;
  if (plant) {
    if (pot.pendingReveal) revealTrait(plant, pot.pendingReveal);   // the bay teaches pH preference
    (pot.pendingMarkers || []).forEach(m => { if (plant.health > 0) addStressMarker(plant, m); });   // stop once dead (no stray badges on a dead slot)
    plant.hydroDone = true;
  }
  flyHydroPlantToTray(k, () => {
    pot.slotIndex = null; pot.graded = false; pot.flash = null; pot.outcome = null;
    pot.pendingReveal = null; pot.pendingMarkers = []; pot.pendingThrive = false;
    if (!HYDRO_ALL_POTS.some(x => hb.pots[x].graded)) hb.phase = 'setup';   // batch done → next batch
    renderHydroponicBay(gameState);
  });
}
/* Cosmetic pot→tray fly (the plant already lives in its slot). Lives on #stage. */
function flyHydroPlantToTray(k, done) {
  const stage = document.getElementById('stage');
  const hb = gameState.hydroponicBay, pot = hb.pots[k], si = pot.slotIndex;
  const plant = si != null ? gameState.tray[si] : null;
  const pe = hydroPotEl(k);
  const sd = pe && pe.querySelector('.hydro-plant');
  const slotSprite = document.querySelector(`#tray .slot[data-idx="${si}"] .plant-sprite`);
  if (!stage || !plant || !sd || !slotSprite) { done && done(); return; }
  const from = stageLocalRect(sd), to = stageLocalRect(slotSprite);
  const fly = document.createElement('div');
  fly.className = 'sub-fly';
  applyPlantSpriteCell(fly, plant, Math.round(from.w));
  fly.style.left = from.left + 'px';
  fly.style.top  = from.top + 'px';
  stage.appendChild(fly);
  sd.style.visibility = 'hidden';
  const tx = to.left + to.w / 2 - from.w / 2;
  const ty = to.top  + to.h / 2 - from.w / 2;
  void fly.offsetWidth;
  requestAnimationFrame(() => { fly.style.left = tx + 'px'; fly.style.top = ty + 'px'; fly.style.opacity = '0.15'; });
  setTimeout(() => { fly.remove(); done && done(); }, 440);
}

/* --- tooltips -------------------------------------------------------------- */
function hydroPotTooltip(k) {
  const hb = gameState.hydroponicBay;
  if (!hb) return null;
  const pot = hb.pots[k], ch = hydroChannelOf(k);
  const plant = pot.slotIndex != null ? gameState.tray[pot.slotIndex] : null;
  const chName = ch === 'back' ? 'Back' : 'Front';
  if (hb.phase === 'setup') {
    if (!plant) return `<span class="tt-name">${chName} channel · pot ${(+k.slice(-1)) + 1}</span><span class="tt-row hub-unlock-hint">Click to select, then click an Agar-Gel plant.</span>`;
    const lines = [`<span class="tt-name">${plant.name}</span>`, tlv('water', 'Channel', chName)];
    if (plant.gravityHighRisk) lines.push(`<span class="tt-row" style="color:var(--accent-stop);">⚠ Gravity-dependent roots — hydroponic performance may be reduced.</span>`);
    lines.push(`<span class="tt-row hub-unlock-hint">Click pot to take back · tune pH/EC below</span>`);
    return lines.join('');
  }
  if (!pot.graded || !plant) return null;
  const chan = hb.channels[ch], pref = phPreferenceOf(plant);
  const col = pot.outcome === 'thrive' ? 'var(--accent-go)' : pot.outcome === 'survive' ? 'var(--accent-warn)' : 'var(--accent-stop)';
  const verdict = pot.outcome === 'thrive' ? 'Thriving — ideal solution'
                : pot.outcome === 'survive' ? 'Surviving (off preference)'
                : pot.outcome === 'lockout' ? 'Nutrient lockout (−2)'
                : 'Stressed';
  return [
    `<span class="tt-name">${plant.name}</span>`,
    tlv('revealed', 'pH pref', labelOf(pref)),
    tlv('water', 'Solution', `pH ${chan.ph.toFixed(1)} · EC ${chan.ec.toFixed(1)}`),
    `<span class="tt-row"><b style="color:${col};">${verdict}</b></span>`,
    `<span class="tt-row hub-unlock-hint">Click to return to tray</span>`,
  ].join('');
}
/* Meter hover explainer — same copy per meter type; the reading is that
   channel's live value (what the arrow points to). */
function hydroMeterTooltip(m) {
  const hb = ensureHydroState();
  const ch = m.startsWith('back') ? 'back' : 'front';
  const chName = ch === 'back' ? 'Back' : 'Front';
  if (HYDRO_METERS[m].kind === 'ph') {
    return [
      `<span class="tt-name">pH — acidity</span>`,
      tlv('revealed', `${chName} reading`, hb.channels[ch].ph.toFixed(1)),
      `<span class="tt-row">How acidic (below 7) or alkaline (above 7) the water is. It decides which nutrients the roots can actually absorb.</span>`,
      `<span class="tt-row">Keep it in the safe band <b>5–9</b> — drift outside and nutrients lock out. Each plant also has a favorite zone (acidic / neutral / alkaline).</span>`,
    ].join('');
  }
  return [
    `<span class="tt-name">EC — nutrient strength</span>`,
    tlv('nutrient', `${chName} reading`, hb.channels[ch].ec.toFixed(1)),
    `<span class="tt-row">Electrical conductivity: how much dissolved nutrient (salt) is in the water — i.e. how strong the feed is.</span>`,
    `<span class="tt-row">Aim for <b>1.5–2.5</b>. Too low and the plant starves; too high and it burns (salt stress).</span>`,
  ].join('');
}
function hydroButtonTooltip(b) {
  const hb = gameState.hydroponicBay;
  if (!hb || hb.phase !== 'setup') return null;
  const def = HYDRO_BUTTONS[b], chan = hb.channels[def.ch];
  const name = def.role === 'phUp' ? 'pH Up' : def.role === 'phDown' ? 'pH Down' : 'Nutrient';
  const cur  = def.role === 'nutrient' ? `EC ${chan.ec.toFixed(1)}` : `pH ${chan.ph.toFixed(1)}`;
  const eff  = def.role === 'phUp' ? `+${HYDRO_TUNE.phStep} pH` : def.role === 'phDown' ? `−${HYDRO_TUNE.phStep} pH` : `+${HYDRO_TUNE.ecStep} EC`;
  const band = def.role === 'nutrient' ? 'Aim EC 1.5–2.5' : 'Safe pH 5–9';
  return [
    `<span class="tt-name">${def.ch === 'back' ? 'Back' : 'Front'} · ${name}</span>`,
    tlv('water', 'Now', cur),
    `<span class="tt-row">${eff} per press.</span>`,
    `<span class="tt-row">${band}</span>`,
  ].join('');
}

/* --- exit ------------------------------------------------------------------ */
function exitHydroponicBay() {
  const hb = gameState.hydroponicBay;
  if (hb && hb.phase === 'running') return;   // don't bail mid-resolve (beats queued)
  document.documentElement.style.removeProperty('--tt-max-width');   // restore the default tooltip width for other rooms
  setActionZone([]);
  setSlotClickHandler(null);
  clearSlotSelection();
  document.querySelectorAll('#tray .slot').forEach(s => s.classList.remove('hydro-done', 'hydro-inpot', 'hydro-locked', 'seed-pulse'));
  document.querySelectorAll('.hydro-lock-mark').forEach(m => m.remove());

  const eligible = hydroEligible();
  const allDone = eligible.length > 0 && eligible.every(p => p.hydroDone);

  if (allDone) markComplete('hydroponics');
  else         markInProgress('hydroponics');
  if (allDone) gameState.hydroponicBay = null;   // done → fresh next time; else resume

  transitionTo('hub', 'down');
  // BOOST room: unlocks nothing downstream (Bible §5).
}

registerRoomBuilder('hydroponics', buildHydroponicBay);


/* ============================================================================
   Demo 11 — Radiation Dome  ·  Bible §6G
   Seventh specialist room (state key 'radiation'; ROOMS.radiation dir 'down').
   BOOST/DISCOVERY room — Run Exposure costs 1 food, does NOT advance a stage
   (joins mixing/orientation/hydroponics) and unlocks nothing downstream. It is
   scenario-gated in the real game (advanced/deep-space); the demo enters directly.

   PUZZLE (single-ranking + type-as-dose, decided with the user):
     - 4 shield materials, each a CONSTANT shield rating (hidden → deduced from
       results): Water 3 / Regolith 3 (excellent), Polyethylene 2 (good),
       Aluminum 1 (moderate), none 0. "Water is a great shield" is the memorable
       counter-intuitive lesson.
     - Each plant has a HIDDEN radiation tolerance (sensitive 0 / moderate 1 /
       hardy 2) → protection P = shield + tolerance.
     - Each Run Exposure fires one radiation TYPE (announced up-front) whose DOSE
       is the bar to clear: UV 2 / particle 3 / gamma 3. Shielded if P >= dose;
       else damage — shortfall >=2 → −2 else −1, plus a DNA-damage badge.
       Water/regolith fully protect even a sensitive plant against the worst event,
       so shielding the sensitive bays is always achievable.
   Bracket plates in bg_radiation.png are TRANSPARENT alpha windows — the material
   strip renders BEHIND the bg and shows through (RAD layering below).
   Verdict shows at resolve; reveal/badges/pips apply on RETURN (global rule).
   Return-each-batch like the Hydroponic Bay (one exposure per seating). The
   Bible's "2 consecutive exposures" win is a scenario-level concern; here the
   room's success is "sensitive plants shielded on their exposure" and completion
   is coverage (all living plants exposed). Coords measured in 11a-radiation-coords.
   ============================================================================ */

/* --- measured coords (11a, against bg_radiation.png 1280×580) -------------- */
const RAD_BAY_SHAPE = [[-1, 28], [11, 14], [121, 15], [133, 30], [133, 170], [0, 170]];
const RAD_BAY_SEAT  = { dx: 68, dy: 162 };
const RAD_BAYS = [{ x: 277, y: 276 }, { x: 446, y: 275 }, { x: 617, y: 276 }, { x: 790, y: 276 }];
const RAD_BRACKETS = [
  { x: 289, y: 232, w: 108, h: 42 },
  { x: 459, y: 231, w: 108, h: 42 },
  { x: 632, y: 233, w: 108, h: 42 },
  { x: 801, y: 231, w: 108, h: 42 },
];
const RAD_RACK = {
  water:    { points: [[93, 90], [196, 110], [195, 171], [94, 159]] },
  plastic:  { points: [[94, 182], [196, 191], [195, 253], [93, 250]] },
  aluminum: { points: [[93, 276], [194, 276], [194, 335], [93, 342]] },
  regolith: { points: [[93, 372], [195, 361], [195, 420], [93, 445]] },
};
const RAD_TERMINAL = { x: 1007, y: 144, w: 181, h: 171 };
const RAD_LIGHTS = [{ x: 1022, y: 411 }, { x: 1072, y: 411 }, { x: 1122, y: 410 }, { x: 1171, y: 411 }];
const RAD_SIZES = { plant: 96, lightR: 10, rackLabelDy: 2 };
const RAD_SOURCE = { x: 640, y: 150 };           // radiation-hatch center (ray origin)

/* --- shielding model ------------------------------------------------------- */
const RAD_TOL_SHIELD = { sensitive: 0, moderate: 1, hardy: 2 };
const RAD_TOL_LABEL  = { sensitive: 'Sensitive', moderate: 'Moderate', hardy: 'Hardy' };
/* Rack order = door top→bottom (matches RAD_RACK keys). shield = constant rating. */
const RAD_RACK_ORDER = ['water', 'plastic', 'aluminum', 'regolith'];
const RAD_MATERIALS = {
  water:    { label: 'Water Pouches',  short: 'Water',    code: 'Water', shield: 3, icon: 'shield-icon-water',    jpg: 'shield-material-water',
              bio: 'Water is packed with hydrogen — a surprisingly excellent radiation shield.' },
  plastic:  { label: 'Polyethylene',   short: 'Plastic',  code: 'Poly',  shield: 2, icon: 'shield-icon-plastic',  jpg: 'shield-material-plastic',
              bio: 'Hydrogen-rich plastic sheet — good shielding for its light weight.' },
  aluminum: { label: 'Aluminum Panel', short: 'Aluminum', code: 'Alum',  shield: 1, icon: 'shield-icon-aluminum', jpg: 'shield-material-aluminum',
              bio: 'A light metal panel — only moderate shielding; thin for its mass.' },
  regolith: { label: 'Regolith Bag',   short: 'Regolith', code: 'Rego',  shield: 3, icon: 'shield-icon-regolith', jpg: 'shield-material-regolith',
              bio: 'Bagged lunar/Mars soil — dense and thick; excellent all-round shielding.' },
};
const RAD_SHIELD_WORD = { 0: 'None', 1: 'Moderate', 2: 'Good', 3: 'Excellent' };

/* Radiation event types — dose is the bar to clear. Announced before exposure. */
const RAD_TYPE_ORDER = ['uv', 'particle', 'gamma'];
const RAD_TYPES = {
  uv:       { label: 'UV Burst',       dose: 2, icon: 'radiation-uv',       color: '170,120,255',
              bio: 'Ultraviolet — scorches leaf-surface cells and DNA. Almost any opaque shield blocks it.' },
  particle: { label: 'Particle Storm', dose: 3, icon: 'radiation-particle', color: '120,200,255',
              bio: 'Solar energetic particles (protons) — penetrating. Hydrogen-rich shields stop them best.' },
  gamma:    { label: 'Gamma Flare',    dose: 3, icon: 'radiation-gamma',    color: '150,255,150',
              bio: 'High-energy gamma rays — very penetrating. Needs dense mass (water, regolith) to absorb.' },
};

const RAD_BAY_KEYS = [0, 1, 2, 3];
const RAD_FX_DY = 60;                             // panel→stage offset for particleBurst (top bar)

/* Live-tunable knobs (Devtools). */
const RAD_TUNE = { ttMaxW: 320 };

/* --- geometry helpers ------------------------------------------------------ */
function radBayAbs(i)      { const a = RAD_BAYS[i]; return RAD_BAY_SHAPE.map(p => [a.x + p[0], a.y + p[1]]); }
function radBaySeat(i)     { const a = RAD_BAYS[i]; return { x: a.x + RAD_BAY_SEAT.dx, y: a.y + RAD_BAY_SEAT.dy }; }
function radBBox(points)   { return quadBBox(points); }
/* clip-path polygon() string for a shape given as ABS points, relative to a bbox. */
function radClipPath(points, bb) {
  return 'polygon(' + points.map(p => `${(p[0] - bb.x).toFixed(1)}px ${(p[1] - bb.y).toFixed(1)}px`).join(', ') + ')';
}

/* --- radiation tolerance trait (mirrors substrate/gravity/ph resolvers) ----
   ~11 of 20 species have radiation:null; they fall back to a family default
   (leafy/thin-leaved = sensitive; root crops & tall cereals = hardy; the rest
   moderate). Explicit SPECIES.radiation values always win. revealTrait('radiation')
   routes through this. First-pass balance — see Bible §6G. */
const FAMILY_RADIATION_DEFAULT = {
  'leafy-rosette':    'sensitive',
  'round-fruit-bush': 'moderate',
  'tall-stalk':       'hardy',
  'climbing-vine':    'moderate',
  'root-tuber':       'hardy',
};
function radiationToleranceOf(plant) {
  const s = SPECIES[plant.speciesId];
  return (s && s.radiation) || FAMILY_RADIATION_DEFAULT[plant.spriteFamily] || 'moderate';
}

/* Outcome of one exposure of `plant` (shielded by materialKey|null) to typeKey. */
function radOutcome(plant, materialKey, typeKey) {
  const S = materialKey ? RAD_MATERIALS[materialKey].shield : 0;
  const T = RAD_TOL_SHIELD[radiationToleranceOf(plant)];
  const dose = RAD_TYPES[typeKey].dose;
  const protection = S + T;
  const shielded = protection >= dose;
  const shortfall = shielded ? 0 : dose - protection;
  const pip = shortfall >= 2 ? 2 : shortfall >= 1 ? 1 : 0;
  return { shielded, shortfall, pip, S, T, dose };
}

/* --- room state ------------------------------------------------------------ */
function ensureRadState() {
  if (!gameState.radiationDome) {
    const bays = {};
    RAD_BAY_KEYS.forEach(k => { bays[k] = { slotIndex: null, material: null, graded: false, flash: null, outcome: null, pendingReveal: null, pendingMarkers: [] }; });
    gameState.radiationDome = {
      phase: 'setup',
      activeBay: null,            // the bay currently being set up (guided flow)
      eventType: 'particle',      // first announced event
      exposures: 0,
      known: {},                  // material key → true once its rating is observed
      log: null,                  // last exposure's result lines
      bays,
    };
    radPickEvent(gameState.radiationDome);
  }
  return gameState.radiationDome;
}
/* Rotate the announced radiation type (deterministic — no Math.random). */
function radPickEvent(rd) {
  rd.eventType = RAD_TYPE_ORDER[rd.exposures % RAD_TYPE_ORDER.length];
}

function radScreen()   { return document.querySelector('.rad-screen'); }
function radBayEl(k)   { const s = radScreen(); return s && s.querySelector(`.rad-bay[data-id="${k}"]`); }
function radEligible() { return gameState.tray.filter(p => p && p.health > 0); }
function radUsesSlot(idx) { const rd = gameState.radiationDome; return !!rd && RAD_BAY_KEYS.some(k => rd.bays[k].slotIndex === idx); }
function radFirstEmptyBay() { const rd = gameState.radiationDome; return RAD_BAY_KEYS.find(k => rd.bays[k].slotIndex == null); }
function radPlacedBays() {
  const rd = gameState.radiationDome;
  return RAD_BAY_KEYS.filter(k => { const p = rd.bays[k].slotIndex != null ? gameState.tray[rd.bays[k].slotIndex] : null; return p && p.health > 0; });
}

/* --- build ----------------------------------------------------------------- */
function buildRadiationDome(key) {
  ensureRadState();
  document.documentElement.style.setProperty('--tt-max-width', RAD_TUNE.ttMaxW + 'px');

  const wrap = document.createElement('div');
  wrap.className = 'rad-screen';
  wrap.dataset.key = key;

  // Material strips BEHIND the bg (peek through the transparent bracket windows).
  RAD_BAY_KEYS.forEach(k => {
    const img = document.createElement('img');
    img.className = 'rad-strip';
    img.dataset.id = k;
    wrap.appendChild(img);
  });

  const bg = document.createElement('img');
  bg.className = 'rad-bg';
  bg.src = assetUrl('bg-radiation');
  wrap.appendChild(bg);

  // Canvas ray lines (drawn during the exposure flash).
  const cv = document.createElement('canvas');
  cv.className = 'rad-rays';
  cv.width = 1280; cv.height = 580;
  wrap.appendChild(cv);

  // Bay alcoves (clip-path polygon click/flash targets) + plant sprites.
  RAD_BAY_KEYS.forEach(k => {
    const el = document.createElement('div');
    el.className = 'rad-bay';
    el.dataset.id = k;
    el.addEventListener('click', (e) => { e.stopPropagation(); radBayClick(k); });
    attachTooltip(el, () => radBayTooltip(k));
    wrap.appendChild(el);
    const spr = document.createElement('div');
    spr.className = 'rad-plant';
    spr.dataset.id = k;
    spr.addEventListener('click', (e) => { e.stopPropagation(); radBayClick(k); });
    wrap.appendChild(spr);
  });

  // Bracket click targets (over the transparent windows).
  RAD_BAY_KEYS.forEach(k => {
    const el = document.createElement('div');
    el.className = 'rad-bracket';
    el.dataset.id = k;
    el.addEventListener('click', (e) => { e.stopPropagation(); radBracketClick(k); });
    attachTooltip(el, () => radBracketTooltip(k));
    wrap.appendChild(el);
  });

  // Rack material sources (clip-path quads) + warped labels.
  RAD_RACK_ORDER.forEach(mk => {
    const el = document.createElement('div');
    el.className = 'rad-rack';
    el.dataset.id = mk;
    el.addEventListener('click', (e) => { e.stopPropagation(); radRackClick(mk); });
    attachTooltip(el, () => radRackTooltip(mk));
    wrap.appendChild(el);
    const lab = document.createElement('div');
    lab.className = 'rad-rack-label';
    lab.dataset.id = mk;
    wrap.appendChild(lab);
  });

  // Bay result lights (squares).
  RAD_BAY_KEYS.forEach(k => {
    const el = document.createElement('div');
    el.className = 'rad-light';
    el.dataset.id = k;
    wrap.appendChild(el);
  });

  // Data Log terminal (flat).
  const term = document.createElement('div');
  term.className = 'rad-term';
  wrap.appendChild(term);

  // White exposure flash overlay.
  const flash = document.createElement('div');
  flash.className = 'rad-flash';
  wrap.appendChild(flash);

  const banner = document.createElement('div');
  banner.className = 'room-banner';
  wrap.appendChild(banner);

  // Click empty bg → drop the current bay focus (guidance re-derives the step).
  wrap.addEventListener('click', (e) => {
    if (e.target.closest('.rad-bay, .rad-plant, .rad-bracket, .rad-rack')) return;
    const rd = gameState.radiationDome;
    if (rd && rd.activeBay != null) { rd.activeBay = null; renderRadiationDome(gameState); }
  });

  setSlotClickHandler(radTraySeedClick);
  setActionZone([
    { label: 'Run Exposure', onClick: radRunExposure },
    { label: 'Back to hub', onClick: () => exitRadiationDome() },
  ]);

  renderRadiationDome(gameState, wrap);
  return wrap;
}

/* --- render (incremental) -------------------------------------------------- */
function renderRadiationDome(state, screenEl) {
  const wrap = screenEl || radScreen();
  if (!wrap) return;
  const rd = ensureRadState();

  // Bay alcoves — clip-path polygon; tint by post-resolve outcome.
  RAD_BAY_KEYS.forEach(k => {
    const el = wrap.querySelector(`.rad-bay[data-id="${k}"]`);
    if (!el) return;
    const abs = radBayAbs(k), bb = radBBox(abs);
    el.style.left = bb.x + 'px'; el.style.top = bb.y + 'px';
    el.style.width = bb.w + 'px'; el.style.height = bb.h + 'px';
    el.style.clipPath = radClipPath(abs, bb);
    el.classList.toggle('active', rd.activeBay === k);

    const bay = rd.bays[k];
    const graded = rd.phase === 'resolved' && bay.graded;
    el.classList.toggle('cond-ok',  graded && bay.flash === 'ok');
    el.classList.toggle('cond-far', graded && bay.flash === 'far');

    // Plant sprite (bottom-anchored at the seat; sibling, not clipped).
    const spr = wrap.querySelector(`.rad-plant[data-id="${k}"]`);
    const plant = bay.slotIndex != null ? state.tray[bay.slotIndex] : null;
    if (spr) {
      if (plant && plant.health > 0) {
        const seat = radBaySeat(k);
        applyPlantSpriteCell(spr, plant, Math.round(RAD_SIZES.plant));
        spr.style.left = seat.x + 'px';
        spr.style.top  = seat.y + 'px';
        const hue = (plant.cssFilter && plant.cssFilter !== 'none') ? plant.cssFilter + ' ' : '';
        spr.style.filter = hue + 'drop-shadow(0 3px 3px rgba(0,0,0,0.6))';
        spr.style.display = 'block';
      } else { spr.style.display = 'none'; }
    }
  });

  // Material strips behind bg — visible only where a bay has a placed material.
  RAD_BAY_KEYS.forEach(k => {
    const img = wrap.querySelector(`.rad-strip[data-id="${k}"]`);
    if (!img) return;
    const mk = rd.bays[k].material;
    const r = RAD_BRACKETS[k];
    if (mk) {
      img.src = assetUrl(RAD_MATERIALS[mk].jpg);
      img.style.left = r.x + 'px'; img.style.top = r.y + 'px';
      img.style.width = r.w + 'px'; img.style.height = r.h + 'px';
      img.style.display = 'block';
    } else { img.style.display = 'none'; }
  });

  // Bracket click targets.
  RAD_BAY_KEYS.forEach(k => {
    const el = wrap.querySelector(`.rad-bracket[data-id="${k}"]`);
    if (!el) return;
    const r = RAD_BRACKETS[k];
    el.style.left = r.x + 'px'; el.style.top = r.y + 'px';
    el.style.width = r.w + 'px'; el.style.height = r.h + 'px';
    el.classList.toggle('filled', !!rd.bays[k].material);
  });

  // Rack quads + warped labels (highlight active only via the guide's pulse).
  RAD_RACK_ORDER.forEach(mk => {
    const el = wrap.querySelector(`.rad-rack[data-id="${mk}"]`);
    const pts = RAD_RACK[mk].points, bb = radBBox(pts);
    if (el) {
      el.style.left = bb.x + 'px'; el.style.top = bb.y + 'px';
      el.style.width = bb.w + 'px'; el.style.height = bb.h + 'px';
      el.style.clipPath = radClipPath(pts, bb);
    }
    const lab = wrap.querySelector(`.rad-rack-label[data-id="${mk}"]`);
    if (lab) {
      const [TL, TR] = pts, lift = RAD_SIZES.rackLabelDy, bandH = 18;
      const band = [[TL[0], TL[1] - lift - bandH], [TR[0], TR[1] - lift - bandH], [TR[0], TR[1] - lift], [TL[0], TL[1] - lift]];
      const edgeLen = Math.round(Math.hypot(TR[0] - TL[0], TR[1] - TL[1]));
      lab.textContent = RAD_MATERIALS[mk].short;
      lab.style.width = edgeLen + 'px'; lab.style.height = bandH + 'px';
      lab.style.transform = cssQuadWarp(edgeLen, bandH, band);
    }
  });

  // Bay lights (squares).
  RAD_BAY_KEYS.forEach(k => {
    const el = wrap.querySelector(`.rad-light[data-id="${k}"]`);
    if (!el) return;
    const s = RAD_SIZES.lightR, c = RAD_LIGHTS[k];
    el.style.left = (c.x - s) + 'px'; el.style.top = (c.y - s) + 'px';
    el.style.width = (s * 2) + 'px'; el.style.height = (s * 2) + 'px';
    const bay = rd.bays[k];
    const on = rd.phase !== 'setup' && bay.graded;
    el.classList.toggle('lit-ok',  on && bay.outcome === 'shielded');
    el.classList.toggle('lit-bad', on && bay.outcome === 'damaged');
  });

  const term = wrap.querySelector('.rad-term');
  if (term) {
    term.style.left = RAD_TERMINAL.x + 'px'; term.style.top = RAD_TERMINAL.y + 'px';
    term.style.width = RAD_TERMINAL.w + 'px'; term.style.height = RAD_TERMINAL.h + 'px';
    term.innerHTML = radTerminalHTML();
  }

  updateRadGuide(wrap);
}

/* Terminal copy — idle shows the incoming event + dose; post-exposure shows the
   per-bay result lines. */
function radTerminalHTML() {
  const rd = ensureRadState();
  const t = RAD_TYPES[rd.eventType];
  if (rd.log && rd.log.length) {
    return `<div class="rt-head">◈ EXPOSURE LOG</div>` + rd.log.join('');
  }
  const dots = RAD_TYPE_ORDER.map(() => '').join('');
  return [
    `<div class="rt-head">◈ INCOMING EVENT</div>`,
    `<div class="rt-evt">${t.label.toUpperCase()}</div>`,
    `<div class="rt-line">Dose ${radDoseBar(t.dose)}</div>`,
    `<div class="rt-instr"><div class="rt-dim">Shield the bays, then</div><div class="rt-dim">RUN EXPOSURE.</div></div>`,
  ].join('');
}
function radDoseBar(d) { return '█'.repeat(d) + '░'.repeat(Math.max(0, 4 - d)); }

/* --- guided flow ----------------------------------------------------------- */
/* Guided per-bay flow: for each bay the player clicks a BAY, then a PLANT, then a
   SHIELD MATERIAL from the wall; the banner + pulses walk them through each micro-
   step and repeat until every fillable bay is ready, then → Run Exposure. */
function updateRadGuide(root) {
  root = root || radScreen() || document;
  const rd = ensureRadState();
  const setup = rd.phase === 'setup', running = rd.phase === 'running', resolved = rd.phase === 'resolved';
  const eligible = radEligible();
  const allDone = eligible.length > 0 && eligible.every(p => p.radDone);

  const ab = rd.activeBay;
  const stepPlant  = setup && ab != null && rd.bays[ab].slotIndex == null;
  const stepShield = setup && ab != null && rd.bays[ab].slotIndex != null && !rd.bays[ab].material;

  // Bays that hold a living plant but still need a shield.
  const pendingShieldBays = RAD_BAY_KEYS.filter(k => { const b = rd.bays[k], p = b.slotIndex != null ? gameState.tray[b.slotIndex] : null; return p && p.health > 0 && !b.material; });
  const readyBays = radPlacedBays().filter(k => !!rd.bays[k].material);
  const emptyBayExists = RAD_BAY_KEYS.some(k => rd.bays[k].slotIndex == null);
  const unplacedEligible = gameState.tray.some((p, idx) => p && p.health > 0 && !p.radDone && !radUsesSlot(idx));
  const canStartNew = emptyBayExists && unplacedEligible;

  const shieldNeeded = setup && (stepShield || (ab == null && pendingShieldBays.length > 0));
  const targetBay = radShieldTargetBay();               // bay a rack-click would shield right now
  const setupReady = setup && !stepPlant && !shieldNeeded && !canStartNew && readyBays.length > 0;
  const pulseEmptyBays = setup && !allDone && ab == null && !shieldNeeded && canStartNew;

  const banner = root.querySelector('.room-banner');
  if (banner) {
    banner.innerHTML =
      running      ? 'Exposing…' :
      allDone      ? 'All plants exposed —<br>Back to hub' :
      resolved     ? 'Click each plant to<br>return it to the tray' :
      stepPlant    ? `Bay ${ab + 1}: choose a plant` :
      shieldNeeded ? `Bay ${(targetBay != null ? targetBay : 0) + 1}: choose a<br>shield material` :
      setupReady   ? 'Ready — Run Exposure' :
      canStartNew  ? (readyBays.length > 0 ? 'Click the next bay' : 'Click a bay to begin') :
                     'Click a bay to begin';
  }

  root.querySelectorAll('.rad-bay').forEach(el => {
    const k = +el.dataset.id, empty = rd.bays[k].slotIndex == null;
    el.classList.toggle('pulse', pulseEmptyBays && empty);
  });
  // The target bay's bracket highlights + pulses while its shield is being chosen.
  root.querySelectorAll('.rad-bracket').forEach(el => {
    const k = +el.dataset.id, hot = shieldNeeded && targetBay === k;
    el.classList.toggle('target', hot);
    el.classList.toggle('pulse', hot);
  });
  // Rack materials pulse during the shield step.
  root.querySelectorAll('.rad-rack').forEach(el => el.classList.toggle('pulse', shieldNeeded));

  const btns = document.querySelectorAll('.action-zone .action-btn');
  if (btns[0]) btns[0].classList.toggle('pulse', setupReady);
  if (btns[1]) btns[1].classList.toggle('pulse', allDone);

  syncRadTrayPulse(stepPlant);
}
/* Which bay a rack-click shields right now: the active bay if it's mid-shield,
   else the first living-plant bay still lacking a shield. */
function radShieldTargetBay() {
  const rd = gameState.radiationDome;
  if (!rd) return null;
  const ab = rd.activeBay;
  if (ab != null && rd.bays[ab].slotIndex != null && !rd.bays[ab].material) return ab;
  const k = RAD_BAY_KEYS.find(k => { const b = rd.bays[k], p = b.slotIndex != null ? gameState.tray[b.slotIndex] : null; return p && p.health > 0 && !b.material; });
  return k == null ? null : k;
}
function syncRadTrayPulse(on) {
  // Screen guard: a return-plant fly-back re-renders this room ~440ms later;
  // if the player has already exited, that pending render must NOT resurrect
  // this room's tray tags after the exit cleanup (QA sweep catch 2026-07-19).
  if (gameState.ui.currentScreen !== 'room:radiation') return;
  document.querySelectorAll('#tray .slot').forEach(slot => {
    const idx = +slot.dataset.idx;
    const plant = gameState.tray[idx];
    const done = !!(plant && plant.radDone);
    const inbay = !!(plant && !done && radUsesSlot(idx));
    slot.classList.toggle('rad-done', done);
    slot.classList.toggle('rad-inbay', inbay);
    slot.classList.toggle('seed-pulse', !!(on && plant && plant.health > 0 && !done && !inbay));
  });
}
function flashRadBanner() {
  const b = radScreen() && radScreen().querySelector('.room-banner');
  if (!b) return;
  b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash');
}

/* --- interactions (guided per-bay flow) ------------------------------------ */
function radBayClick(k) {
  const rd = ensureRadState();
  const bay = rd.bays[k];
  if (rd.phase === 'resolved') { if (bay.graded) returnRadPlant(k); return; }
  if (rd.phase !== 'setup') return;
  if (bay.slotIndex != null) {          // undo this bay — plant back to the tray, shield cleared
    bay.slotIndex = null; bay.material = null;
    rd.activeBay = k;                    // re-focus so it prompts for a plant again
  } else {                              // start (or toggle) this bay → 'choose a plant'
    rd.activeBay = (rd.activeBay === k) ? null : k;
  }
  renderRadiationDome(gameState);
}
/* Bracket = focus this bay's shield step (or clear its shield to re-pick). */
function radBracketClick(k) {
  const rd = ensureRadState();
  if (rd.phase !== 'setup') { flashRadBanner(); return; }
  const bay = rd.bays[k];
  if (bay.slotIndex == null) { flashRadBanner(); return; }   // no plant to shield yet
  if (bay.material) bay.material = null;                      // clear → re-pick
  rd.activeBay = k;                                           // focus the shield step
  renderRadiationDome(gameState);
}
/* Rack material → fit it on the bay currently awaiting a shield. */
function radRackClick(mk) {
  const rd = ensureRadState();
  if (rd.phase !== 'setup') { flashRadBanner(); return; }
  const target = radShieldTargetBay();
  if (target == null) { flashRadBanner(); return; }           // nothing awaiting a shield → seat a plant first
  rd.bays[target].material = mk;
  rd.activeBay = null;                                        // bay complete → guide moves on
  renderRadiationDome(gameState);
}
function radTraySeedClick(idx) {
  const rd = ensureRadState();
  if (rd.phase !== 'setup') { flashRadBanner(); return true; }
  const plant = gameState.tray[idx];
  if (!plant || plant.health <= 0) return true;
  if (plant.radDone) { flashRadBanner(); return true; }
  if (radUsesSlot(idx)) { flashRadBanner(); return true; }
  let k = rd.activeBay;
  if (k == null || rd.bays[k].slotIndex != null) k = radFirstEmptyBay();
  if (k == null) { flashRadBanner(); return true; }
  rd.bays[k].slotIndex = idx;
  rd.activeBay = k;                    // stay on this bay → next micro-step is 'choose a shield'
  renderRadiationDome(gameState);
  return true;
}

/* --- Run Exposure (one-shot; BOOST room → NO agePlant) --------------------- */
function radRunExposure() {
  const rd = ensureRadState();
  if (rd.phase !== 'setup') { shakeActionButton(); flashRadBanner(); return; }
  const placed = radPlacedBays();
  if (placed.length === 0) { shakeActionButton(); flashRadBanner(); return; }
  if (placed.some(k => !rd.bays[k].material)) { shakeActionButton(); flashRadBanner(); return; }  // finish shielding every seated bay first

  rd.phase = 'running';
  deductFood(1);
  rd.exposures++;
  gameState.moduleState.radiation.actionsThisSession++;

  const typeKey = rd.eventType, tinfo = RAD_TYPES[typeKey];
  const log = [`<div class="rt-evt">${tinfo.label.toUpperCase()}</div>`, `<div class="rt-line">Dose ${radDoseBar(tinfo.dose)}</div>`, `<div class="rt-sep"></div>`];

  placed.forEach(k => {
    const bay = rd.bays[k];
    const plant = gameState.tray[bay.slotIndex];
    const mk = bay.material;
    const o = radOutcome(plant, mk, typeKey);
    if (mk) rd.known[mk] = true;                       // seeing a material work/fail reveals its rating

    bay.graded = true;
    bay.pendingReveal = 'radiation';
    bay.pendingMarkers = [];
    if (o.shielded) {
      bay.outcome = 'shielded'; bay.flash = 'ok';
    } else {
      bay.outcome = 'damaged'; bay.flash = 'far';
      bay.pendingMarkers.push({ kind: 'dna-damage', pipCost: o.pip, deathCause: 'radiation',
        detail: `${tinfo.label} — ${mk ? RAD_MATERIALS[mk].short + ' shield too weak' : 'unshielded'} (−${o.pip}) + DNA damage.` });
    }
    const shieldCode = mk ? RAD_MATERIALS[mk].code : '—';
    const status = o.shielded ? `<span class="rt-ok">✓</span>` : `<span class="rt-bad">✗ −${o.pip}</span>`;
    log.push(`<div class="rt-bay">B${k + 1} <span class="rt-mat">${shieldCode}</span> ${status}</div>`);
  });
  rd.log = log;

  renderRadiationDome(gameState);

  // Beat: white flash + rays, pop particles per bay, settle into 'resolved'.
  radFlashAndRays(typeKey);
  setTimeout(() => {
    placed.forEach(k => {
      const bay = rd.bays[k], el = radBayEl(k), seat = radBaySeat(k);
      if (el && bay.flash) { void el.offsetWidth; el.classList.add('flash-' + bay.flash); }
      const col = bay.flash === 'far' ? '235,90,90' : '120,230,150';
      particleBurst({ x: seat.x, y: seat.y - 40 + RAD_FX_DY, count: bay.flash === 'ok' ? 20 : 16, color: col, life: bay.flash === 'ok' ? 760 : 560, spread: 2, gravity: bay.flash === 'ok' ? 0.05 : 0.12, size: 2.6 });
    });
    setTimeout(() => {
      placed.forEach(k => { const el = radBayEl(k); if (el) el.classList.remove('flash-ok', 'flash-far'); });
      rd.phase = 'resolved';
      rd.activeBay = null;
      renderRadiationDome(gameState);
    }, 700);
  }, 520);
}

/* Full-screen white flash + canvas rays streaking from the source hatch. */
function radFlashAndRays(typeKey) {
  const wrap = radScreen();
  if (!wrap) return;
  const flash = wrap.querySelector('.rad-flash');
  if (flash) { flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go'); }
  const cv = wrap.querySelector('.rad-rays');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const col = RAD_TYPES[typeKey].color;
  const ox = RAD_SOURCE.x, oy = RAD_SOURCE.y;
  const rays = Array.from({ length: 22 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 22 + (i % 2 ? 0.12 : 0);
    return { a, len: 380 + (i % 5) * 40 };
  });
  const start = performance.now(), dur = 620;
  function frame(now) {
    const t = Math.min(1, (now - start) / dur);
    ctx.clearRect(0, 0, 1280, 580);
    const alpha = Math.sin(t * Math.PI);
    ctx.lineWidth = 2;
    rays.forEach(r => {
      const reach = r.len * t;
      ctx.strokeStyle = `rgba(${col},${(alpha * 0.85).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(ox + Math.cos(r.a) * 30, oy + Math.sin(r.a) * 30);
      ctx.lineTo(ox + Math.cos(r.a) * reach, oy + Math.sin(r.a) * reach);
      ctx.stroke();
    });
    if (t < 1) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, 1280, 580);
  }
  requestAnimationFrame(frame);
}

/* Return one resolved plant — APPLY reveal/markers NOW (on-return convention). */
function returnRadPlant(k) {
  const rd = gameState.radiationDome;
  const bay = rd.bays[k];
  const plant = bay.slotIndex != null ? gameState.tray[bay.slotIndex] : null;
  if (plant) {
    if (bay.pendingReveal) revealTrait(plant, bay.pendingReveal);           // the dome teaches radiation tolerance
    (bay.pendingMarkers || []).forEach(m => { if (plant.health > 0) addStressMarker(plant, m); });
    plant.radDone = true;
  }
  flyRadPlantToTray(k, () => {
    bay.graded = false; bay.flash = null; bay.outcome = null;
    bay.pendingReveal = null; bay.pendingMarkers = []; bay.slotIndex = null; bay.material = null;   // full reset → next batch re-guides bay→plant→shield
    if (!RAD_BAY_KEYS.some(x => rd.bays[x].graded)) {   // whole batch returned → next event
      rd.phase = 'setup';
      radPickEvent(rd);
      rd.log = null;
    }
    renderRadiationDome(gameState);
  });
}
/* Cosmetic bay→tray fly. */
function flyRadPlantToTray(k, done) {
  const stage = document.getElementById('stage');
  const rd = gameState.radiationDome, bay = rd.bays[k], si = bay.slotIndex;
  const plant = si != null ? gameState.tray[si] : null;
  const spr = radScreen() && radScreen().querySelector(`.rad-plant[data-id="${k}"]`);
  const slotSprite = document.querySelector(`#tray .slot[data-idx="${si}"] .plant-sprite`);
  if (!stage || !plant || !spr || !slotSprite) { done && done(); return; }
  const from = stageLocalRect(spr), to = stageLocalRect(slotSprite);
  const fly = document.createElement('div');
  fly.className = 'sub-fly';
  applyPlantSpriteCell(fly, plant, Math.round(from.w));
  fly.style.left = from.left + 'px';
  fly.style.top  = from.top + 'px';
  stage.appendChild(fly);
  spr.style.visibility = 'hidden';
  const tx = to.left + to.w / 2 - from.w / 2;
  const ty = to.top  + to.h / 2 - from.w / 2;
  void fly.offsetWidth;
  requestAnimationFrame(() => { fly.style.left = tx + 'px'; fly.style.top = ty + 'px'; fly.style.opacity = '0.15'; });
  setTimeout(() => { fly.remove(); spr.style.visibility = ''; done && done(); }, 440);
}

/* --- tooltips -------------------------------------------------------------- */
function radBayTooltip(k) {
  const rd = gameState.radiationDome;
  if (!rd) return null;
  const bay = rd.bays[k];
  const plant = bay.slotIndex != null ? gameState.tray[bay.slotIndex] : null;
  if (rd.phase === 'setup') {
    if (!plant) return `<span class="tt-name">Bay ${k + 1}</span><span class="tt-row hub-unlock-hint">Click the bay, then choose a plant for it.</span>`;
    const lines = [`<span class="tt-name">${plant.name}</span>`];
    if (plant.revealed.includes('radiation')) lines.push(tlv('revealed', 'Radiation', RAD_TOL_LABEL[radiationToleranceOf(plant)]));
    else lines.push(`<span class="tt-row">Radiation tolerance: <b>unknown</b> — expose to find out.</span>`);
    lines.push(tlv('water', 'Shield', bay.material ? RAD_MATERIALS[bay.material].short : 'none — choose one'));
    lines.push(`<span class="tt-row hub-unlock-hint">Click the bay to take the plant back</span>`);
    return lines.join('');
  }
  if (!bay.graded || !plant) return null;
  const shielded = bay.outcome === 'shielded';
  const col = shielded ? 'var(--accent-go)' : 'var(--accent-stop)';
  return [
    `<span class="tt-name">${plant.name}</span>`,
    tlv('revealed', 'Radiation', RAD_TOL_LABEL[radiationToleranceOf(plant)]),
    tlv('water', 'Shield', bay.material ? RAD_MATERIALS[bay.material].short : 'none'),
    `<span class="tt-row"><b style="color:${col};">${shielded ? 'Shielded — no damage' : 'Damaged — DNA hit'}</b></span>`,
    `<span class="tt-row hub-unlock-hint">Click to return to tray</span>`,
  ].join('');
}
function radBracketTooltip(k) {
  const rd = gameState.radiationDome;
  if (!rd || rd.phase !== 'setup') return null;
  const bay = rd.bays[k], mk = bay.material;
  if (!mk) {
    const hint = bay.slotIndex != null ? 'Choose a shield material from the wall.' : 'Add a plant to this bay first.';
    return `<span class="tt-name">Bay ${k + 1} shield</span><span class="tt-row hub-unlock-hint">${hint}</span>`;
  }
  const m = RAD_MATERIALS[mk];
  const rating = rd.known[mk] ? RAD_SHIELD_WORD[m.shield] : 'Unknown';
  return [
    `<span class="tt-name">${m.label}</span>`,
    tlv('water', 'Shielding', rating),
    `<span class="tt-row">${m.bio}</span>`,
    `<span class="tt-row hub-unlock-hint">Click to change the shield</span>`,
  ].join('');
}
function radRackTooltip(mk) {
  const rd = gameState.radiationDome;
  if (!rd) return null;
  const m = RAD_MATERIALS[mk];
  const rating = rd.known[mk] ? RAD_SHIELD_WORD[m.shield] : 'Unknown — deduce it';
  const canFit = rd.phase === 'setup' && radShieldTargetBay() != null;
  return [
    `<span class="tt-name">${m.label}</span>`,
    tlv('water', 'Shielding', rating),
    `<span class="tt-row">${m.bio}</span>`,
    canFit ? `<span class="tt-row hub-unlock-hint">Click to fit this shield above the bay</span>` : '',
  ].join('');
}

/* --- exit ------------------------------------------------------------------ */
function exitRadiationDome() {
  const rd = gameState.radiationDome;
  if (rd && rd.phase === 'running') return;   // don't bail mid-resolve
  document.documentElement.style.removeProperty('--tt-max-width');
  setActionZone([]);
  setSlotClickHandler(null);
  clearSlotSelection();
  document.querySelectorAll('#tray .slot').forEach(s => s.classList.remove('rad-done', 'rad-inbay', 'seed-pulse'));

  const eligible = radEligible();
  const allDone = eligible.length > 0 && eligible.every(p => p.radDone);
  if (allDone) markComplete('radiation');
  else         markInProgress('radiation');
  if (allDone) gameState.radiationDome = null;   // done → fresh next time; else resume

  transitionTo('hub', 'down');
  // BOOST room: unlocks nothing downstream (Bible §5).
}

registerRoomBuilder('radiation', buildRadiationDome);


/* ============================================================================
   Shared real-time primitives (Demo 12 — SHARED; room-agnostic)
   The Pollination Dome is the game's ONLY real-time room; these primitives are
   authored shared so later rooms (Harvest arc timing, FX loops) can reuse them
   WITHOUT making the turn-based rooms real-time — a ticker only exists while
   the room that created it is mounted.
   ============================================================================ */

/* createTicker — pausable delta-time rAF loop bound to a root element.
   - onFrame(dt, now) gets dt in SECONDS, clamped to 0.1s: when the tab is
     hidden rAF stops firing, so the first frame back would carry a huge dt —
     the clamp turns that into an effective auto-pause (no timer skips).
   - Self-cancels when rootEl leaves the DOM (transitionTo removes room screens
     without an unmount hook — the ticker notices and dies on its own).
   - pause()/resume() skip onFrame without killing the loop (phase gating). */
function createTicker(rootEl, onFrame) {
  let rafId = null, last = null, paused = false, dead = false;
  function frame(now) {
    rafId = null;
    if (dead || !rootEl.isConnected) { dead = true; return; }
    if (last == null) last = now;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (!paused) onFrame(dt, now);
    rafId = requestAnimationFrame(frame);
  }
  return {
    start()  { if (!dead && rafId == null) { last = null; rafId = requestAnimationFrame(frame); } },
    pause()  { paused = true; },
    resume() { paused = false; },
    stop()   { dead = true; if (rafId != null) cancelAnimationFrame(rafId); rafId = null; },
    get running() { return !dead && rafId != null && !paused; },
  };
}

/* drawCountdownRing — canvas shrinking-arc countdown (green → amber → red).
   frac = fraction REMAINING (1 → full ring, 0 → empty). Draws a dark track
   circle + the remaining arc clockwise from 12 o'clock. Returns the arc color
   so callers can sync other FX to the urgency tier.
   opts: width (stroke px), thresholds {hi, low} (frac cutoffs), colors
   {hi, mid, low}, track (track style), alpha (arc alpha — pulse the red). */
function drawCountdownRing(ctx, x, y, r, frac, opts = {}) {
  const w  = opts.width || 5;
  const th = opts.thresholds || { hi: 0.5, low: 0.22 };
  const cols = opts.colors || { hi: '#4ade68', mid: '#ffb84a', low: '#ff4455' };
  const col = frac > th.hi ? cols.hi : frac > th.low ? cols.mid : cols.low;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = opts.track || 'rgba(0,0,0,0.55)';
  ctx.lineWidth = w + 3;
  ctx.stroke();
  if (frac > 0) {
    ctx.beginPath();
    ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0, Math.min(1, frac)));
    ctx.globalAlpha = opts.alpha != null ? opts.alpha : 1;
    ctx.strokeStyle = col;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  return col;
}

/* pointInPolygon — ray-cast test, pts = [[x,y], ...]. (Fan placement zone.) */
function pointInPolygon(x, y, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}


/* ============================================================================
   Demo 12 — Pollination Dome  ·  Bible §6H
   Eighth specialist room (state key 'pollination'; ROOMS.pollination dir 'left').
   THE ONLY REAL-TIME ROOM — a deliberate pattern-breaker. pollinationType is a
   VISIBLE trait (no deduction): the puzzle is tool↔type matching + execution
   under time pressure. STRICT matching — Brush=self / Bee-Bot=insect / Fan=wind.

   PHASES  setup (bench auto-populated from flowering+ plants, timers frozen —
   read + plan) → Begin Pollination → running (ticker live; simultaneous
   per-type countdowns; all 3 tools usable at once) → resolved (all flowers
   settled; 1 food charged at session close; click each plant home).
   Selection modes (brush cursor / bee arming / fan placing) are mutually
   exclusive, but DISPATCHED tools run concurrently (bee flying + fan blowing
   + brush clicking).

   CONSEQUENCES on click-home (global badges-on-return rule, Light-Lab style):
   pollinated → plant.pollinated + agePlant flowering→fruiting (fruit set — the
   biology lesson); missed → plant.missedPollination + a pip-free
   'missed-pollination' badge (the plant LIVES; Harvest yields nothing).

   LAYOUT (user-tuned in 12a): plants on the curved perimeter bench; the FAN
   ZONE is the UPPER WALL BAND above the bench (wall-mounted circulator above
   the canopy — art faces LEFT, flip scaleX(-1) when x<640 so it faces center);
   the open floor is the Bee-Bot's exclusive flight area; the bee DOCKS in its
   rack slot (TOOL 2). flower_closed.png does not exist — a miss plays the
   bloom frames REVERSED with a wilt tint. Coords measured in 12a.
   ============================================================================ */

/* --- measured coords (12a, against bg_pollination.jpg 1280×580) ------------- */
const POLL_BENCH = [
  { x:  191, y: 382 }, { x:  318, y: 357 }, { x:  451, y: 352 }, { x:  582, y: 349 },
  { x:  696, y: 350 }, { x:  827, y: 345 }, { x:  956, y: 365 }, { x: 1094, y: 383 },
];
const POLL_RINGS = [
  { x:  190, y: 283 }, { x:  318, y: 259 }, { x:  451, y: 254 }, { x:  582, y: 251 },
  { x:  696, y: 252 }, { x:  827, y: 247 }, { x:  956, y: 267 }, { x: 1094, y: 285 },
];
const POLL_RACK = {
  brush:  { points: [[38,113],[93,127],[92,183],[39,175]] },
  bee:    { points: [[37,218],[94,223],[92,282],[38,281]] },
  fan:    { points: [[38,330],[92,327],[92,385],[39,395]] },
};
const POLL_BEE = {
  dock:  { x: 66, y: 251 },
  spine: [[236,463], [378,474], [485,453], [571,484], [643,470], [759,444], [885,494], [1078,487]],
};
const POLL_FAN_ZONE = [[126,134], [385,173], [638,185], [931,171], [1160,126], [1158,235], [930,248], [634,250], [342,244], [124,232]];
const POLL_SIZES = { plant: 88, ringR: 15, beeW: 46, fanW: 72, fanRange: 190 };

/* Live-tunable knobs (Devtools — keep demo slider defaults synced). */
const POLL_TUNE = {
  selfSec: 25, insectSec: 45, windSec: 35,   // ring duration per pollination type
  jitterSec: 3,                              // ± deterministic per-spot stagger
  beeSpeed: 170,                             // px/s along the waypoint path
  beeCooldown: 3,                            // s at the dock between sorties
  fanSpinup: 1.5,                            // s before the airflow engages
  ringW: 5,                                  // ring stroke width
  ttMaxW: 300,
};

const POLL_TOOL_ORDER = ['brush', 'bee', 'fan'];
const POLL_TOOLS = {
  brush: { label: 'Pollen Brush',   type: 'self',
           bio: 'Hand-pollination — ISS astronauts really do brush tomato flowers by hand.' },
  bee:   { label: 'Bee-Bot',        type: 'insect',
           bio: 'A drone stand-in for bees — insect pollinators carry pollen flower to flower.' },
  fan:   { label: 'Air Circulator', type: 'wind',
           bio: 'Moving air does what wind does outdoors — carries light pollen on the breeze.' },
};
const POLL_TYPE_LABEL = { self: 'Self-pollinating', insect: 'Insect-pollinated', wind: 'Wind-pollinated' };
const POLL_TYPE_TOOL_LABEL = { self: 'Pollen Brush', insect: 'Bee-Bot', wind: 'Air Circulator' };
const POLL_TYPE_RGB = { self: '67,214,192', insect: '90,169,255', wind: '199,146,234' };
const POLL_STAGES_ELIGIBLE = ['flowering', 'fruiting', 'harvestable'];
const POLL_FX_DY = 60;                       // panel→stage offset for particleBurst (top bar)

/* --- room state ------------------------------------------------------------ */
function ensurePollState() {
  if (!gameState.pollinationDome) {
    gameState.pollinationDome = {
      phase: 'setup',            // setup → running → resolved
      spots: {},                 // tray idx → { slotIndex, status:'waiting'|'ok'|'missed', t, dur }
      brushActive: false,
      bee: { state: 'docked',    // docked | armed | flying | returning | cooldown
             x: POLL_BEE.dock.x, y: POLL_BEE.dock.y,
             queue: [],          // tray idxs still to visit — queue[0] is the current stop
             path: null, pathLen: 0, dist: 0, cdT: 0, animT: 0 },
      fans: [],                  // mounted circulators: { x, y, state:'spinning'|'blast'|'spent', spinT, blastT, animT }
      fanPlacing: { on: false, x: 640, y: 210 },   // the ghost-in-hand
      counts: null,              // { ok, missed } — set at session close
      hint: null,                // transient banner override (wrong-tool teach)
    };
    pollPopulateBench();
  }
  return gameState.pollinationDome;
}

function pollEligiblePlant(p) {
  return !!(p && p.health > 0 && !p.pollinated && !p.missedPollination &&
            POLL_STAGES_ELIGIBLE.includes(p.stage));
}
/* Bench auto-populates: spot i ↔ tray slot i (NO click-to-seat — the flowers
   are ready whether you are or not). */
function pollPopulateBench() {
  const pd = gameState.pollinationDome;
  pd.spots = {};
  gameState.tray.forEach((p, i) => {
    if (pollEligiblePlant(p)) pd.spots[i] = { slotIndex: i, status: 'waiting', t: 0, dur: 0 };
  });
}
function pollSpotKeys() { return Object.keys(gameState.pollinationDome.spots).map(Number); }
function pollScreen()   { return document.querySelector('.poll-screen'); }
function pollWaiting()  { const pd = gameState.pollinationDome; return pollSpotKeys().filter(i => pd.spots[i].status === 'waiting'); }

/* Ring duration: per-type base ± a deterministic per-spot jitter so expiries
   stagger without Math.random (replayable, testable). */
function pollDurFor(plant, i) {
  const base = { self: POLL_TUNE.selfSec, insect: POLL_TUNE.insectSec, wind: POLL_TUNE.windSec }[plant.pollinationType] || 30;
  const span = POLL_TUNE.jitterSec;
  const j = span ? ((i * 5) % (span * 2 + 1)) - span : 0;
  return Math.max(6, base + j);
}

/* --- build ------------------------------------------------------------------ */
function buildPollinationDome(key) {
  ensurePollState();
  document.documentElement.style.setProperty('--tt-max-width', POLL_TUNE.ttMaxW + 'px');

  const wrap = document.createElement('div');
  wrap.className = 'poll-screen';
  wrap.dataset.key = key;

  const bg = document.createElement('img');
  bg.className = 'poll-bg';
  bg.src = assetUrl('bg-pollination');
  wrap.appendChild(bg);

  // One canvas for all per-frame drawing: countdown rings, type halos, the fan
  // range circle, the bee cooldown arc, the placement-zone preview.
  const cv = document.createElement('canvas');
  cv.className = 'poll-canvas';
  cv.width = 1280; cv.height = 580;
  wrap.appendChild(cv);

  // Bench plants (bottom-anchored sprites) + flower/ring click targets.
  for (let i = 0; i < 8; i++) {
    const spr = document.createElement('div');
    spr.className = 'poll-plant';
    spr.dataset.idx = i;
    spr.addEventListener('click', (e) => { e.stopPropagation(); pollPlantClick(i); });
    attachTooltip(spr, () => pollPlantTooltip(i));
    wrap.appendChild(spr);

    const fl = document.createElement('div');
    fl.className = 'poll-flower';
    fl.dataset.idx = i;
    fl.addEventListener('click', (e) => { e.stopPropagation(); pollPlantClick(i); });
    attachTooltip(fl, () => pollPlantTooltip(i));
    wrap.appendChild(fl);
  }

  // Tool rack quads (clip-path click targets) + brush/fan slot icons. The bee
  // has no slot icon — the .poll-beebot sprite itself sits at the dock.
  POLL_TOOL_ORDER.forEach(tk => {
    const el = document.createElement('div');
    el.className = 'poll-rack';
    el.dataset.id = tk;
    el.addEventListener('click', (e) => { e.stopPropagation(); pollRackClick(tk); });
    attachTooltip(el, () => pollRackTooltip(tk));
    wrap.appendChild(el);
  });
  ['brush', 'fan'].forEach(tk => {
    const icon = document.createElement('img');
    icon.className = 'poll-rack-icon';
    icon.dataset.id = tk;
    icon.src = assetUrl(tk === 'brush' ? 'pollen-brush' : 'fan-1');
    wrap.appendChild(icon);
  });

  const bee = document.createElement('img');
  bee.className = 'poll-beebot';
  bee.src = assetUrl('bee-drone-1');
  wrap.appendChild(bee);

  // Ghost circulator that follows the cursor while placing. Mounted fans get
  // their own .poll-fan.placed imgs, synced to pd.fans in render.
  const fan = document.createElement('img');
  fan.className = 'poll-fan ghost';
  fan.src = assetUrl('fan-1');
  wrap.appendChild(fan);

  const banner = document.createElement('div');
  banner.className = 'room-banner';
  wrap.appendChild(banner);

  // Fan-placement ghost follows the cursor; empty-bg clicks place it (in-zone)
  // or cancel the current selection mode.
  wrap.addEventListener('mousemove', pollMouseMove);
  wrap.addEventListener('click', pollScreenClick);

  setSlotClickHandler(pollTrayClick);
  setActionZone([
    { label: 'Begin Pollination', onClick: pollBegin },
    { label: 'Back to hub', onClick: exitPollinationDome },
  ]);

  renderPollinationDome(gameState, wrap);

  // The room's rAF loop — mounted with the screen, self-cancels when the
  // screen unmounts. Countdown timers only advance during phase 'running';
  // sprite animation (bee wings, fan blades) runs whenever visible.
  wrap._ticker = createTicker(wrap, pollFrame);
  wrap._ticker.start();
  return wrap;
}

/* --- per-frame loop ---------------------------------------------------------- */
function pollFrame(dt) {
  const pd = gameState.pollinationDome;
  if (!pd) return;

  if (pd.phase === 'running') {
    pollWaiting().forEach(i => {
      const s = gameState.pollinationDome.spots[i];
      s.t -= dt;
      if (s.t <= 0) { s.t = 0; pollMiss(i); }
    });
  }
  // Bee + fan keep stepping in 'resolved' so a mid-flight bee glides home.
  pollBeeStep(dt);
  pollFanStep(dt);
  if (pd.phase === 'running') pollCheckEnd();

  pollDrawCanvas();
  pollAnimSprites(dt);
}

/* --- countdown / outcome ----------------------------------------------------- */
function pollBegin() {
  const pd = ensurePollState();
  if (pd.phase !== 'setup' || pollSpotKeys().length === 0) { shakeActionButton(); flashPollBanner(); return; }
  pollSpotKeys().forEach(i => {
    const s = pd.spots[i], plant = gameState.tray[s.slotIndex];
    s.dur = s.t = pollDurFor(plant, i);
  });
  pd.phase = 'running';
  renderPollinationDome(gameState);
}

function pollPollinate(i) {
  const pd = gameState.pollinationDome;
  const s = pd.spots[i];
  if (!s || s.status !== 'waiting') return;
  s.status = 'ok';
  const fl = pollScreen() && pollScreen().querySelector(`.poll-flower[data-idx="${i}"]`);
  if (fl) playBloom(fl, 64);
  particleBurst({ x: POLL_RINGS[i].x, y: POLL_RINGS[i].y + POLL_FX_DY, count: 18,
                  color: '255,215,120', life: 720, spread: 1.8, gravity: 0.05, size: 2.4 });
  renderPollinationDome(gameState);   // swap the bench sprite to fruiting under the bloom
  updatePollGuide();
}

function pollMiss(i) {
  const pd = gameState.pollinationDome;
  const s = pd.spots[i];
  if (!s || s.status !== 'waiting') return;
  s.status = 'missed';
  const scr = pollScreen();
  const fl  = scr && scr.querySelector(`.poll-flower[data-idx="${i}"]`);
  const spr = scr && scr.querySelector(`.poll-plant[data-idx="${i}"]`);
  if (fl) playBloom(fl, 56, 0, { reverse: true, cssClass: 'bloom-wilt' });   // flower CLOSES
  if (spr) spr.classList.add('wilt');
  particleBurst({ x: POLL_RINGS[i].x, y: POLL_RINGS[i].y + POLL_FX_DY, count: 10,
                  color: '160,120,110', life: 520, spread: 1.2, gravity: 0.16, size: 2 });
  updatePollGuide();
}

/* Session ends the moment no flower is still waiting. 1 food at session CLOSE
   (not per action), win or lose — Bible §6H. */
function pollCheckEnd() {
  const pd = gameState.pollinationDome;
  if (pd.phase !== 'running' || pollWaiting().length > 0) return;
  pd.phase = 'resolved';
  deductFood(1);
  gameState.moduleState.pollination.actionsThisSession++;
  const keys = pollSpotKeys();
  pd.counts = {
    ok:     keys.filter(i => pd.spots[i].status === 'ok').length,
    missed: keys.filter(i => pd.spots[i].status === 'missed').length,
  };
  pd.brushActive = false;
  pd.fanPlacing.on = false;
  if (pd.bee.state === 'armed') pd.bee.state = 'docked';
  renderPollinationDome(gameState);
}

/* --- Bee-Bot ------------------------------------------------------------------ */
function pollNearestSpineIdx(pt) {
  let best = 0, bd = Infinity;
  POLL_BEE.spine.forEach((n, i) => {
    const d = Math.hypot(pt.x - n[0], pt.y - n[1]);
    if (d < bd) { bd = d; best = i; }
  });
  return best;
}
/* Waypoint route (NOT pathfinding): current pos → nearest spine node → along
   the spine → node nearest the target → the flower's ring anchor. Nearby
   targets (<260px) skip the spine and hop direct. The raw polyline is then
   Catmull-Rom-smoothed and flown with a per-leg lateral wobble so the flight
   reads as a bee, not a rail. */
function pollBeePathTo(from, toPt) {
  let raw;
  if (Math.hypot(toPt.x - from.x, toPt.y - from.y) < 260) {
    raw = [[from.x, from.y], [toPt.x, toPt.y]];
  } else {
    const a = pollNearestSpineIdx(from), b = pollNearestSpineIdx(toPt);
    const pts = [[from.x, from.y]];
    const step = a <= b ? 1 : -1;
    for (let i = a; i !== b + step; i += step) pts.push(POLL_BEE.spine[i]);
    pts.push([toPt.x, toPt.y]);
    raw = pts.filter((p, i) => i === 0 || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > 1);
  }
  const dense = pollSmoothPath(raw);
  let len = 0;
  for (let i = 1; i < dense.length; i++) len += Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]);
  return {
    pts: dense, len,
    // Two-frequency lateral sway, randomized per leg — cosmetic only, outcomes
    // are unaffected (the envelope in pollPathPoint zeroes it at both ends).
    wob: { a1: 8 + Math.random() * 8,          a2: 3 + Math.random() * 4,
           f1: 0.010 + Math.random() * 0.008,  f2: 0.030 + Math.random() * 0.015,
           p1: Math.random() * Math.PI * 2,    p2: Math.random() * Math.PI * 2 },
  };
}
/* Catmull-Rom through the polyline, sampled every ~18px — rounds the corners. */
function pollSmoothPath(raw) {
  if (raw.length < 3) return raw.map(p => p.slice());
  const out = [];
  for (let i = 0; i < raw.length - 1; i++) {
    const p0 = raw[Math.max(0, i - 1)], p1 = raw[i], p2 = raw[i + 1], p3 = raw[Math.min(raw.length - 1, i + 2)];
    const n = Math.max(1, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 18));
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(raw[raw.length - 1].slice());
  return out;
}
/* Point along the smoothed path + wobble perpendicular to the local tangent.
   The envelope ramps to zero over the first/last 70px so take-off and landing
   stay pixel-exact on the dock/flower. */
function pollPathPoint(path, dist) {
  const pts = path.pts;
  let d = dist;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1];
    const seg = Math.hypot(dx, dy);
    if (d <= seg || i === pts.length - 1) {
      const t = seg ? Math.min(1, d / seg) : 1;
      let x = pts[i - 1][0] + dx * t, y = pts[i - 1][1] + dy * t;
      const w = path.wob;
      if (w && seg) {
        const env = Math.max(0, Math.min(1, dist / 70, (path.len - dist) / 70));
        const off = env * (w.a1 * Math.sin(dist * w.f1 + w.p1) + w.a2 * Math.sin(dist * w.f2 + w.p2));
        x += (-dy / seg) * off;
        y += ( dx / seg) * off;
      }
      return { x, y };
    }
    d -= seg;
  }
  const last = pts[pts.length - 1];
  return { x: last[0], y: last[1] };
}
/* First insect click launches the bee; further clicks queue stops in click
   order. The route closes the moment it turns for home — then it's recharge. */
function pollDispatchBee(i) {
  const pd = gameState.pollinationDome, bee = pd.bee;
  bee.queue = [i];
  bee.path = pollBeePathTo({ x: bee.x, y: bee.y }, POLL_RINGS[i]);
  bee.pathLen = bee.path.len;
  bee.dist = 0;
  bee.state = 'flying';
  updatePollGuide();
}
function pollQueueBee(i) {
  const pd = gameState.pollinationDome, bee = pd.bee;
  if (bee.queue.includes(i)) { pollHint('Already on the Bee-Bot\'s route'); return; }
  bee.queue.push(i);
  particleBurst({ x: POLL_RINGS[i].x, y: POLL_RINGS[i].y + POLL_FX_DY, count: 8,
                  color: '90,169,255', life: 480, spread: 1.2, gravity: 0.02, size: 2 });
}
function pollBeeStep(dt) {
  const pd = gameState.pollinationDome, bee = pd.bee;
  if (bee.state === 'flying' || bee.state === 'returning') {
    bee.dist += POLL_TUNE.beeSpeed * dt;
    const p = pollPathPoint(bee.path, Math.min(bee.dist, bee.pathLen));
    bee.x = p.x; bee.y = p.y;
    if (bee.dist >= bee.pathLen) {
      if (bee.state === 'flying') {
        // At the flower — pollinate if it's still open (it may have closed
        // mid-flight), then on to the next queued stop, or home.
        if (pd.phase === 'running') pollPollinate(bee.queue[0]);
        bee.queue.shift();
        while (bee.queue.length && (!pd.spots[bee.queue[0]] || pd.spots[bee.queue[0]].status !== 'waiting')) bee.queue.shift();
        if (bee.queue.length) {
          bee.path = pollBeePathTo({ x: bee.x, y: bee.y }, POLL_RINGS[bee.queue[0]]);
        } else {
          bee.path = pollBeePathTo({ x: bee.x, y: bee.y }, POLL_BEE.dock);
          bee.state = 'returning';
        }
        bee.pathLen = bee.path.len; bee.dist = 0;
      } else {
        bee.state = 'cooldown';
        bee.cdT = POLL_TUNE.beeCooldown;
        bee.x = POLL_BEE.dock.x; bee.y = POLL_BEE.dock.y;
      }
    }
  } else if (bee.state === 'cooldown') {
    bee.cdT -= dt;
    if (bee.cdT <= 0) { bee.cdT = 0; bee.state = 'docked'; updatePollGuide(); }
  }
}

/* --- Air Circulator ------------------------------------------------------------ */
/* ONE GUST PER UNIT: a mounted fan spins up, pollinates every open wind flower
   in range ONCE, then locks in place spent — no pickup, no range circle, just
   a wall prop until the session closes. Need more coverage? Grab another from
   the rack (unlimited dispenser) and repeat. */
function pollFanStep(dt) {
  const pd = gameState.pollinationDome;
  pd.fans.forEach(f => {
    if (f.state === 'spinning') {
      f.spinT -= dt;
      if (f.spinT <= 0) {
        f.spinT = 0;
        f.state = 'blast';
        f.blastT = 0.9;
        if (pd.phase === 'running') {
          pollWaiting().forEach(i => {
            const plant = gameState.tray[pd.spots[i].slotIndex];
            if (plant.pollinationType !== 'wind') return;
            if (Math.hypot(POLL_RINGS[i].x - f.x, POLL_RINGS[i].y - f.y) <= POLL_SIZES.fanRange)
              pollPollinate(i);
          });
        }
      }
    } else if (f.state === 'blast') {
      f.blastT -= dt;
      if (f.blastT <= 0) { f.blastT = 0; f.state = 'spent'; }
    }
  });
}
function pollPlaceFan(x, y) {
  const pd = gameState.pollinationDome;
  pd.fans.push({ x, y, state: 'spinning', spinT: POLL_TUNE.fanSpinup, blastT: 0, animT: 0 });
  pd.fanPlacing.on = false;
  renderPollinationDome(gameState);
}
/* Fresh-session tool reset: bee back to its dock, wall cleared of spent fans. */
function pollResetTools(pd) {
  pd.brushActive = false;
  pd.fanPlacing.on = false;
  pd.fans = [];                              // sprite sync removes the imgs
  pd.bee = { state: 'docked', x: POLL_BEE.dock.x, y: POLL_BEE.dock.y,
             queue: [], path: null, pathLen: 0, dist: 0, cdT: 0, animT: 0 };
}

/* --- interactions ---------------------------------------------------------------- */
/* Selection modes are mutually exclusive (dispatched tools still run together). */
function pollRackClick(tk) {
  const pd = ensurePollState();
  if (pd.phase !== 'running') { pollHint(pd.phase === 'setup' ? 'Begin Pollination first —<br>then grab a tool' : null); return; }
  if (tk === 'brush') {
    pd.brushActive = !pd.brushActive;
    if (pd.brushActive) { if (pd.bee.state === 'armed') pd.bee.state = 'docked'; pd.fanPlacing.on = false; }
  } else if (tk === 'bee') {
    const bee = pd.bee;
    if      (bee.state === 'docked')    { bee.state = 'armed'; pd.brushActive = false; pd.fanPlacing.on = false; }
    else if (bee.state === 'armed')     { bee.state = 'docked'; }
    else if (bee.state === 'flying')    { pollHint('Bee-Bot is out — click more<br>insect flowers to add stops'); }
    else if (bee.state === 'returning') { pollHint('Bee-Bot is heading home —<br>it can fly again after recharge'); }
    else { pollHint(`Bee-Bot is recharging —<br>${Math.ceil(bee.cdT)}s`); }
  } else if (tk === 'fan') {
    // Unlimited dispenser — mounted units are spent props; grab a fresh one.
    pd.fanPlacing.on = !pd.fanPlacing.on;
    if (pd.fanPlacing.on) { pd.brushActive = false; if (pd.bee.state === 'armed') pd.bee.state = 'docked'; }
  }
  renderPollinationDome(gameState);
}

function pollPlantClick(i) {
  const pd = ensurePollState();
  const s = pd.spots[i];
  if (!s) return;
  if (pd.phase === 'resolved') { pollReturnPlant(i); return; }
  if (pd.phase !== 'running') { flashPollBanner(); return; }
  if (s.status !== 'waiting') return;
  const plant = gameState.tray[s.slotIndex];
  const type = plant.pollinationType;

  if (pd.brushActive) {
    if (type === 'self') pollPollinate(i);
    else pollWrongTool(i, type, 'The brush only works on<br>self-pollinating flowers');
    return;
  }
  if (pd.bee.state === 'armed') {
    if (type === 'insect') pollDispatchBee(i);
    else pollWrongTool(i, type, 'The Bee-Bot only visits<br>insect-pollinated flowers');
    return;
  }
  if (pd.bee.state === 'flying' && type === 'insect') { pollQueueBee(i); return; }   // mid-route: add a stop
  if ((pd.bee.state === 'returning' || pd.bee.state === 'cooldown') && type === 'insect') {
    pollHint('Bee-Bot is heading home —<br>wait for its recharge'); return;
  }
  if (pd.fanPlacing.on) return;   // placement clicks are handled on the screen
  pollHint(`Needs the ${POLL_TYPE_TOOL_LABEL[type]} —<br>grab it from the rack`);
}

function pollWrongTool(i, type, msg) {
  const spr = pollScreen() && pollScreen().querySelector(`.poll-plant[data-idx="${i}"]`);
  if (spr) { spr.classList.remove('shake'); void spr.offsetWidth; spr.classList.add('shake'); }
  pollHint(`${msg}.<br>This one is ${POLL_TYPE_LABEL[type].toLowerCase()}`);
}

/* Empty-bg click: place the fan (in-zone) or drop the current selection mode. */
function pollScreenClick(e) {
  if (e.target.closest('.poll-plant, .poll-flower, .poll-rack, .poll-fan, .poll-beebot')) return;
  const pd = ensurePollState();
  if (pd.fanPlacing.on) {
    const p = pollStageXY(e);
    if (pointInPolygon(p.x, p.y, POLL_FAN_ZONE)) pollPlaceFan(p.x, p.y);
    else pollHint('Mount the circulator on the<br>wall band above the bench');
    return;
  }
  if (pd.brushActive || pd.bee.state === 'armed') {
    pd.brushActive = false;
    if (pd.bee.state === 'armed') pd.bee.state = 'docked';
    renderPollinationDome(gameState);
  }
}
function pollMouseMove(e) {
  const pd = gameState.pollinationDome;
  if (!pd || !pd.fanPlacing.on) return;
  const p = pollStageXY(e);
  pd.fanPlacing.x = p.x; pd.fanPlacing.y = p.y;   // ticker positions the ghost each frame
}
function pollStageXY(e) {
  const wrap = pollScreen();
  const r = wrap.getBoundingClientRect();
  const scale = (r.width / 1280) || 1;
  return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale };
}

/* Tray clicks: bench population is automatic — no seating. Swallow selection. */
function pollTrayClick(idx) {
  const pd = ensurePollState();
  if (pd.spots[idx]) flashPollBanner();
  return true;
}

/* --- return home (consequences applied HERE — badges-on-return, like Light Lab) */
function pollReturnPlant(i) {
  const pd = gameState.pollinationDome;
  const s = pd.spots[i];
  const plant = s ? gameState.tray[s.slotIndex] : null;
  if (!plant) return;
  if (s.status === 'ok') {
    plant.pollinated = true;
    if (plant.stage === 'flowering') agePlant(plant);    // fruit set: flowering → fruiting
  } else if (s.status === 'missed') {
    plant.missedPollination = true;
    addStressMarker(plant, { kind: 'missed-pollination', pipCost: 0,
      detail: 'Flower closed unpollinated — no fruit, no harvest yield.' });
  }
  renderTray(gameState);
  pollFlyPlantToTray(i, () => {
    delete pd.spots[i];
    if (pollSpotKeys().length === 0) {      // whole bench home → session over
      pd.phase = 'setup';
      pd.counts = null;
      pollResetTools(pd);                   // bee to dock; spent fans off the wall
      pollPopulateBench();                  // usually empty now; fresh flowerers re-bench
    }
    renderPollinationDome(gameState);
  });
}
/* Cosmetic bench→tray fly (mirrors flyRadPlantToTray). */
function pollFlyPlantToTray(i, done) {
  const stage = document.getElementById('stage');
  const pd = gameState.pollinationDome, s = pd.spots[i];
  const plant = s ? gameState.tray[s.slotIndex] : null;
  const spr = pollScreen() && pollScreen().querySelector(`.poll-plant[data-idx="${i}"]`);
  const slotSprite = document.querySelector(`#tray .slot[data-idx="${s ? s.slotIndex : -1}"] .plant-sprite`);
  if (!stage || !plant || !spr || !slotSprite) { done && done(); return; }
  const from = stageLocalRect(spr), to = stageLocalRect(slotSprite);
  const fly = document.createElement('div');
  fly.className = 'sub-fly';
  applyPlantSpriteCell(fly, plant, Math.round(from.w));
  fly.style.left = from.left + 'px';
  fly.style.top  = from.top + 'px';
  stage.appendChild(fly);
  spr.style.visibility = 'hidden';
  void fly.offsetWidth;
  requestAnimationFrame(() => {
    fly.style.left = (to.left + to.w / 2 - from.w / 2) + 'px';
    fly.style.top  = (to.top  + to.h / 2 - from.w / 2) + 'px';
    fly.style.opacity = '0.15';
  });
  setTimeout(() => { fly.remove(); spr.style.visibility = ''; done && done(); }, 440);
}

/* --- render (incremental; the ticker handles per-frame motion) ---------------- */
function renderPollinationDome(state, screenEl) {
  const wrap = screenEl || pollScreen();
  if (!wrap) return;
  const pd = ensurePollState();

  for (let i = 0; i < 8; i++) {
    const s = pd.spots[i];
    const plant = s ? state.tray[s.slotIndex] : null;
    const spr = wrap.querySelector(`.poll-plant[data-idx="${i}"]`);
    if (spr) {
      if (plant && plant.health > 0) {
        // Live fruit-set preview: a pollinated flowering plant shows its NEXT
        // stage sprite the moment the bloom pops. The real agePlant still
        // happens on click-home (badges-on-return) — this is display only.
        const shown = (s.status === 'ok' && plant.stage === 'flowering')
          ? { ...plant, stage: 'fruiting' } : plant;
        applyPlantSpriteCell(spr, shown, Math.round(POLL_SIZES.plant));
        spr.style.left = POLL_BENCH[i].x + 'px';
        spr.style.top  = POLL_BENCH[i].y + 'px';
        const hue = (plant.cssFilter && plant.cssFilter !== 'none') ? plant.cssFilter + ' ' : '';
        spr.style.filter = hue + 'drop-shadow(0 3px 3px rgba(0,0,0,0.6))';
        spr.classList.toggle('wilt', s.status === 'missed');
        spr.style.display = 'block';
      } else { spr.style.display = 'none'; spr.classList.remove('wilt'); }
    }
    const fl = wrap.querySelector(`.poll-flower[data-idx="${i}"]`);
    if (fl) {
      const r = POLL_SIZES.ringR + 9;
      fl.style.left = (POLL_RINGS[i].x - r) + 'px';
      fl.style.top  = (POLL_RINGS[i].y - r) + 'px';
      fl.style.width = fl.style.height = (r * 2) + 'px';
      fl.style.display = (plant && plant.health > 0) ? 'block' : 'none';
    }
  }

  POLL_TOOL_ORDER.forEach(tk => {
    const el = wrap.querySelector(`.poll-rack[data-id="${tk}"]`);
    if (!el) return;
    const pts = POLL_RACK[tk].points, bb = quadBBox(pts);
    el.style.left = bb.x + 'px'; el.style.top = bb.y + 'px';
    el.style.width = bb.w + 'px'; el.style.height = bb.h + 'px';
    el.style.clipPath = radClipPath(pts, bb);
    const selecting = (tk === 'brush' && pd.brushActive) ||
                      (tk === 'bee'   && pd.bee.state === 'armed') ||
                      (tk === 'fan'   && pd.fanPlacing.on);
    el.classList.toggle('active', selecting);
  });
  const brushIcon = wrap.querySelector(`.poll-rack-icon[data-id="brush"]`);
  if (brushIcon) {
    const bb = quadBBox(POLL_RACK.brush.points);
    brushIcon.style.left = (bb.x + bb.w / 2 - 14) + 'px';
    brushIcon.style.top  = (bb.y + bb.h / 2 - 21) + 'px';
    brushIcon.style.width = '28px';
    brushIcon.style.opacity = pd.brushActive ? 0.25 : 1;
  }
  const fanIcon = wrap.querySelector(`.poll-rack-icon[data-id="fan"]`);
  if (fanIcon) {
    const bb = quadBBox(POLL_RACK.fan.points);
    const w = Math.min(POLL_SIZES.fanW, bb.w - 8), h = Math.round(w * 68 / 85);
    fanIcon.style.left = (bb.x + bb.w / 2 - w / 2) + 'px';
    fanIcon.style.top  = (bb.y + bb.h / 2 - h / 2) + 'px';
    fanIcon.style.width = w + 'px';
    fanIcon.style.opacity = pd.fanPlacing.on ? 0.25 : 1;   // dispenser never empties
  }

  const bee = wrap.querySelector('.poll-beebot');
  if (bee) {
    bee.style.width = POLL_SIZES.beeW + 'px';
    bee.classList.toggle('armed', pd.bee.state === 'armed');
  }
  const ghost = wrap.querySelector('.poll-fan.ghost');
  if (ghost) {
    ghost.style.width = POLL_SIZES.fanW + 'px';
    ghost.style.display = pd.fanPlacing.on ? 'block' : 'none';
  }
  // Mounted circulators — one .placed img per pd.fans entry (they persist as
  // wall props until the session fully closes; the anim sync prunes extras).
  pd.fans.forEach((f, fi) => {
    let img = wrap.querySelector(`.poll-fan.placed[data-fi="${fi}"]`);
    if (!img) {
      img = document.createElement('img');
      img.className = 'poll-fan placed';
      img.dataset.fi = fi;
      img.src = assetUrl('fan-1');
      wrap.appendChild(img);
    }
    img.style.width = POLL_SIZES.fanW + 'px';
    img.style.left = f.x + 'px';
    img.style.top  = f.y + 'px';
    img.style.transform = `translate(-50%,-50%)${f.x < 640 ? ' scaleX(-1)' : ''}`;
    img.classList.toggle('spent', f.state === 'spent');
  });

  wrap.classList.toggle('tool-brush', !!pd.brushActive);
  syncPollTray();
  updatePollGuide(wrap);
}

/* Tray decoration: living bench plants dim with an ON BENCH tag. */
function syncPollTray() {
  // Screen guard: a return-plant fly-back re-renders this room ~440ms later;
  // if the player has already exited, that pending render must NOT resurrect
  // this room's tray tags after the exit cleanup (QA sweep catch 2026-07-19).
  if (gameState.ui.currentScreen !== 'room:pollination') return;
  const pd = gameState.pollinationDome;
  document.querySelectorAll('#tray .slot').forEach(slot => {
    const idx = +slot.dataset.idx;
    slot.classList.toggle('poll-onbench', !!(pd && pd.spots[idx] && gameState.tray[idx] && gameState.tray[idx].health > 0));
  });
}

/* --- per-frame drawing + sprite animation ------------------------------------- */
function pollDrawCanvas() {
  const wrap = pollScreen();
  const cv = wrap && wrap.querySelector('.poll-canvas');
  if (!cv) return;
  const pd = gameState.pollinationDome;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, 1280, 580);
  if (!pd) return;
  const now = performance.now();

  // Selection-mode assists: highlight the matching type's open flowers, and
  // preview the placement band while the fan is in hand. Insect flowers stay
  // queueable for the whole flight, so the bee's halo persists while it's out.
  const beeSelecting = pd.bee.state === 'armed' || pd.bee.state === 'flying';
  const selType = pd.brushActive ? 'self' : beeSelecting ? 'insect' : pd.fanPlacing.on ? 'wind' : null;
  if (pd.fanPlacing.on) {
    ctx.beginPath();
    POLL_FAN_ZONE.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
    ctx.closePath();
    ctx.fillStyle = 'rgba(199,146,234,0.10)';
    ctx.fill();
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = 'rgba(199,146,234,0.75)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
    // Ghost range preview at the cursor.
    ctx.beginPath();
    ctx.arc(pd.fanPlacing.x, pd.fanPlacing.y, POLL_SIZES.fanRange, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(199,146,234,0.10)';
    ctx.fill();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(199,146,234,0.55)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Mounted fans: spin-up shows a faint range + progress ring; the gust itself
  // is a bright flash that fades; spent fans draw nothing — furniture now.
  pd.fans.forEach(f => {
    if (f.state === 'spinning') {
      ctx.beginPath();
      ctx.arc(f.x, f.y, POLL_SIZES.fanRange, 0, Math.PI * 2);
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(199,146,234,0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);
      drawCountdownRing(ctx, f.x, f.y, Math.max(20, POLL_SIZES.fanW * 0.55), 1 - f.spinT / Math.max(0.01, POLL_TUNE.fanSpinup),
                        { width: 3, colors: { hi: '#c792ea', mid: '#c792ea', low: '#c792ea' } });
    } else if (f.state === 'blast') {
      const fade = f.blastT / 0.9;
      ctx.beginPath();
      ctx.arc(f.x, f.y, POLL_SIZES.fanRange, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(199,146,234,${(0.28 * fade).toFixed(3)})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(199,146,234,${(0.85 * fade).toFixed(3)})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
  });

  // Countdown rings + verdict discs.
  pollSpotKeys().forEach(i => {
    const s = pd.spots[i];
    const plant = gameState.tray[s.slotIndex];
    if (!plant || plant.health <= 0) return;
    const { x, y } = POLL_RINGS[i], r = POLL_SIZES.ringR;

    const queued = selType === 'insect' && pd.bee.queue.includes(i);
    if (selType && s.status === 'waiting' && plant.pollinationType === selType && !queued) {
      const halo = 0.16 + 0.12 * Math.sin(now / 260);
      ctx.beginPath(); ctx.arc(x, y, r + 9, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${POLL_TYPE_RGB[selType]},${halo.toFixed(3)})`;
      ctx.fill();
    }

    if (s.status === 'waiting') {
      const frac = pd.phase === 'running' ? (s.dur ? s.t / s.dur : 1) : 1;
      const urgent = pd.phase === 'running' && frac <= 0.22;
      drawCountdownRing(ctx, x, y, r, frac, {
        width: POLL_TUNE.ringW,
        alpha: urgent ? 0.65 + 0.35 * Math.sin(now / 110) : 1,
      });
    } else {
      const ok = s.status === 'ok';
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = ok ? 'rgba(35,80,45,0.85)' : 'rgba(85,30,35,0.85)';
      ctx.fill();
      ctx.strokeStyle = ok ? '#4ade68' : '#ff4455';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = ok ? '#4ade68' : '#ff4455';
      ctx.font = `bold ${Math.round(r * 1.2)}px monospace`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(ok ? '✓' : '✕', x, y + 1);
    }
  });

  // Bee route badges — numbered stops over each queued flower.
  if (pd.bee.state === 'flying') {
    pd.bee.queue.forEach((qi, n) => {
      const s = pd.spots[qi];
      if (!s || s.status !== 'waiting') return;
      const bx = POLL_RINGS[qi].x + POLL_SIZES.ringR + 7, by = POLL_RINGS[qi].y - POLL_SIZES.ringR - 7;
      ctx.beginPath(); ctx.arc(bx, by, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(90,169,255,0.92)'; ctx.fill();
      ctx.strokeStyle = '#dceaff'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = '#081222';
      ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(n + 1), bx, by + 0.5);
    });
  }

  // Bee cooldown arc at the dock.
  const bee = pd.bee;
  if (bee.state === 'cooldown' && POLL_TUNE.beeCooldown > 0) {
    drawCountdownRing(ctx, POLL_BEE.dock.x, POLL_BEE.dock.y, Math.max(16, POLL_SIZES.beeW * 0.55),
                      bee.cdT / POLL_TUNE.beeCooldown,
                      { width: 3, colors: { hi: '#5aa9ff', mid: '#5aa9ff', low: '#5aa9ff' } });
  }
}

/* Bee wing flap (2 frames, ~7fps + a hover bob) and fan blade spin (2 frames). */
function pollAnimSprites(dt) {
  const wrap = pollScreen();
  if (!wrap) return;
  const pd = gameState.pollinationDome;
  const bee = wrap.querySelector('.poll-beebot');
  if (bee && pd) {
    const b = pd.bee;
    b.animT += dt;
    const airborne = b.state === 'flying' || b.state === 'returning';
    const frame = airborne || b.state === 'armed' ? (Math.floor(b.animT / 0.14) % 2) : 0;
    if (b._frame !== frame) { b._frame = frame; bee.src = assetUrl(frame ? 'bee-drone-2' : 'bee-drone-1'); }
    const bob = airborne ? Math.sin(b.animT * 6) * 3 : 0;
    bee.style.left = b.x + 'px';
    bee.style.top  = (b.y + bob) + 'px';
  }
  if (pd) {
    const ghost = wrap.querySelector('.poll-fan.ghost');
    if (ghost && pd.fanPlacing.on) {
      ghost.style.left = pd.fanPlacing.x + 'px';
      ghost.style.top  = pd.fanPlacing.y + 'px';
      // Fan art faces LEFT natively — flip left of center so it faces the bench.
      ghost.style.transform = `translate(-50%,-50%)${pd.fanPlacing.x < 640 ? ' scaleX(-1)' : ''}`;
    }
    wrap.querySelectorAll('.poll-fan.placed').forEach(img => {
      const f = pd.fans[+img.dataset.fi];
      if (!f) { img.remove(); return; }        // session reset pruned the state
      f.animT += dt;
      // Spent fans keep idling — slower blade swap than an active gust, purely
      // ambience: still locked, no range, no pollination.
      const rate = f.state === 'spent' ? 0.16 : 0.09;
      const frame = Math.floor(f.animT / rate) % 2;
      if (f._frame !== frame) { f._frame = frame; img.src = assetUrl(frame ? 'fan-2' : 'fan-1'); }
      // The blast expires between renders — sync the locked/spent look here.
      img.classList.toggle('spent', f.state === 'spent');
    });
  }
}

/* --- guide banner --------------------------------------------------------------- */
function updatePollGuide(root) {
  root = root || pollScreen();
  if (!root) return;
  const pd = ensurePollState();
  const banner = root.querySelector('.room-banner');
  const spots = pollSpotKeys();
  const waiting = pollWaiting().length;
  const processedAny = gameState.tray.some(p => p && (p.pollinated || p.missedPollination));

  if (banner) {
    banner.innerHTML =
      pd.hint                          ? pd.hint :
      pd.phase === 'running'           ? `${waiting} flower${waiting === 1 ? '' : 's'} open —<br>match tool to type!` :
      pd.phase === 'resolved'          ? `${pd.counts.ok} pollinated · ${pd.counts.missed} missed —<br>click each plant home` :
      spots.length > 0                 ? 'Hover each flower to read its<br>type, then Begin Pollination' :
      processedAny                     ? 'All flowers handled —<br>Back to hub' :
                                         'No flowers ready — grow<br>plants to Flowering first';
  }

  const btns = document.querySelectorAll('.action-zone .action-btn');
  if (btns[0]) btns[0].classList.toggle('pulse', pd.phase === 'setup' && spots.length > 0);
  if (btns[1]) btns[1].classList.toggle('pulse', pd.phase === 'setup' && spots.length === 0 && processedAny);
}
function flashPollBanner() {
  const b = pollScreen() && pollScreen().querySelector('.room-banner');
  if (!b) return;
  b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash');
}
/* Transient banner override — the wrong-tool teach line. */
function pollHint(text) {
  const pd = gameState.pollinationDome;
  if (!pd) return;
  if (!text) { flashPollBanner(); return; }
  pd.hint = text;
  updatePollGuide();
  flashPollBanner();
  clearTimeout(pd._hintTimer);
  pd._hintTimer = setTimeout(() => { if (gameState.pollinationDome === pd) { pd.hint = null; updatePollGuide(); } }, 2400);
}

/* --- tooltips --------------------------------------------------------------------- */
function pollPlantTooltip(i) {
  const pd = gameState.pollinationDome;
  const s = pd && pd.spots[i];
  const plant = s ? gameState.tray[s.slotIndex] : null;
  if (!plant) return null;
  const type = plant.pollinationType;
  const lines = [
    `<span class="tt-name">${plant.name}</span>`,
    tlv('pollination', 'Pollination', POLL_TYPE_LABEL[type]),
    `<span class="tt-row">Tool: <b style="color:rgb(${POLL_TYPE_RGB[type]});">${POLL_TYPE_TOOL_LABEL[type]}</b></span>`,
  ];
  if (s.status === 'waiting' && pd.phase === 'running')
    lines.push(`<span class="tt-row">Time left: <b>${Math.ceil(s.t)}s</b></span>`);
  if (s.status === 'waiting' && pd.bee.queue.includes(i))
    lines.push(`<span class="tt-row"><b style="color:rgb(90,169,255);">Bee-Bot stop #${pd.bee.queue.indexOf(i) + 1}</b></span>`);
  if (s.status === 'ok')
    lines.push(`<span class="tt-row"><b style="color:var(--accent-go);">Pollinated — fruit is setting</b></span>`);
  if (s.status === 'missed')
    lines.push(`<span class="tt-row"><b style="color:var(--accent-stop);">Flower closed — no fruit this run</b></span>`);
  if (pd.phase === 'resolved')
    lines.push(`<span class="tt-row hub-unlock-hint">Click to return to tray</span>`);
  return lines.join('');
}
function pollRackTooltip(tk) {
  const pd = gameState.pollinationDome;
  if (!pd) return null;
  const t = POLL_TOOLS[tk];
  const lines = [
    `<span class="tt-name">${t.label}</span>`,
    tlv('pollination', 'Serves', POLL_TYPE_LABEL[t.type]),
    `<span class="tt-row">${t.bio}</span>`,
  ];
  if (tk === 'bee') {
    lines.push(`<span class="tt-row">First click launches it — keep clicking insect flowers to queue stops until it heads home. ${POLL_TUNE.beeCooldown}s recharge per route.</span>`);
    if (pd.bee.state === 'flying')   lines.push(`<span class="tt-row"><b>Out on a route — ${pd.bee.queue.length} stop${pd.bee.queue.length === 1 ? '' : 's'} left</b></span>`);
    if (pd.bee.state === 'cooldown') lines.push(`<span class="tt-row"><b>Recharging — ${Math.ceil(pd.bee.cdT)}s</b></span>`);
  }
  if (tk === 'fan') lines.push(`<span class="tt-row">One gust per unit: mount it on the wall band, it spins up, pollinates wind flowers in range, then locks in place. Grab another for the next spot.</span>`);
  if (pd.phase === 'running') lines.push(`<span class="tt-row hub-unlock-hint">${
    tk === 'brush' ? (pd.brushActive ? 'Click again to put it back' : 'Click to take the brush') :
    tk === 'bee'   ? (pd.bee.state === 'armed' ? 'Now click insect flowers — first click launches it' : 'Click to wake the Bee-Bot') :
                     (pd.fanPlacing.on ? 'Now click a spot on the wall band' : 'Click to grab a circulator')
  }</span>`);
  return lines.join('');
}

/* --- exit -------------------------------------------------------------------------- */
function exitPollinationDome() {
  const pd = gameState.pollinationDome;
  if (pd && pd.phase === 'running') { pollHint('The flowers are open —<br>finish the session first!'); shakeActionButton(); return; }
  document.documentElement.style.removeProperty('--tt-max-width');
  setActionZone([]);
  setSlotClickHandler(null);
  clearSlotSelection();
  document.querySelectorAll('#tray .slot').forEach(s => s.classList.remove('poll-onbench'));

  const anyEligible = gameState.tray.some(pollEligiblePlant);
  const processedAny = gameState.tray.some(p => p && (p.pollinated || p.missedPollination));
  if (!anyEligible && processedAny) markComplete('pollination');
  else                              markInProgress('pollination');
  if (!anyEligible) gameState.pollinationDome = null;   // clean state; fresh flowerers re-bench next visit

  transitionTo('hub', 'left');
}

registerRoomBuilder('pollination', buildPollinationDome);


/* ============================================================================
   Demo 13 — Harvest Bay  ·  Bible §6J
   THE CENTER ROOM in mode 'harvest' (no own state key — buildSeedBankRoom
   branches here on gameState.centerRoom.mode). A RESULTS room, not a puzzle:
   Collect Harvest cashes out every harvestable plant at once. No food cost,
   no aging — collecting is a consequence, not an action.

   THE YIELD MODEL (locked with the user, 2026-07-17):
     units = round(baseYield × health/maxHealth × pollMod × lightMod)
       baseYield 10, FLAT across families (family identity = the sprite).
       pips stand in for "clean actions" (§6J): failures cost pips and only
       successes age, so a separate clean-action term would double-count.
       pollMod: pollinated 1 · missedPollination 0 (ALL families — every
       species has a pollinationType) · neither flag (dome never visited) 0.5.
       lightMod: lightYieldReduced 0.5 (Light Lab photoperiod miss).
     Dead plants are not harvested (they keep their slot + autopsy card).
     1 falling produce sprite per 2 units (last carries the remainder);
     each landing credits its units to colony food (addFood — meter animates).

   SEQUENCE (ticker-driven, createTicker): per plant in tray order — produce
   pops in at a random point on the SPAWN line (dim, deep in the chute mouth),
   slides down the ramp KEEPING ITS LANE (same fraction along the LIP line),
   launches a true parabolic arc (linear-x quadratic-y Bézier = projectile) to
   a random bilinear point in the bin quad, squash-bounces, and joins the
   pile. Zero-yield plants get the missed-pollination icon sinking at their
   chute lane instead. When a plant's batch settles it turns to its tray STUB
   (stage 'harvested', family sheet cell 8) and its report line feeds the
   right-wall screen (negatives on indented salmon sub-lines).

   WIN / END: colonyFood ≥ colonyQuota at resolve → quota-met banner. Run is
   OVER when every tray plant is dead or harvested, or food ≤ 0 → the View
   Run Summary action rebuilds the screen as the end-of-run summary (Bible
   §6J): survived/died, per-room failure bars, final score, autopsy review
   (openAutopsyReview from Demo 01). Exit returns center to Seed Bank mode.
   ============================================================================ */

/* --- measured coords (13a, against bg_harvest.jpg 1280×580) ----------------- */
const HARV_CHUTE = {
  spawn: [[530, 138], [735, 138]],
  lip:   [[502, 250], [767, 250]],
};
const HARV_BIN    = { points: [[387, 368], [885, 367], [941, 413], [326, 413]] };
const HARV_METER  = { points: [[84, 150], [136, 153], [133, 421], [84, 427]], tilt: 1 };
const HARV_SCREEN = { x: 1010, y: 125, w: 219, h: 176 };
const HARV_SIZES  = { produce: 44, arcPeak: 60 };

/* --- tuning (Devtools live-tunable; keep demo slider defaults in sync) ------ */
const HARV_TUNE = {
  baseYield: 10,        // per-plant base units (flat across families)
  unitsPerProduce: 2,   // units each falling sprite carries (last = remainder)
  lightMod: 0.5,        // lightYieldReduced
  popMs: 150, slideMs: 260, arcMs: 620, bounceMs: 230,
  launchGapMs: 380,     // stagger between produce launches
  meterLerp: 3.2,       // meter fill chase rate (per second)
};

/* Family → produce sprite (confirmed mapping). */
const HARV_PRODUCE = {
  'leafy-rosette':   'produce-leafy-green',
  'tall-stalk':      'produce-grain',
  'root-tuber':      'produce-root',
  'round-fruit-bush':'produce-red-fruit',
  'climbing-vine':   'produce-round',
};

/* Stress-marker kind → room label (end-of-run failure chart). */
const HARV_FAIL_ROOM = {
  'root-disease':       'Substrate',
  'flood':              'Pipe Maze',
  'drought':            'Pipe Maze',
  'wrong-spectrum':     'Light Lab',
  'nutrient-burn':      'Mixing',
  'deficiency':         'Mixing',
  'disorientation':     'Orientation',
  'ph-lockout':         'Hydroponics',
  'dna-damage':         'Radiation',
  'missed-pollination': 'Pollination',
};

/* --- geometry helpers -------------------------------------------------------- */
function harvLerp(a, b, t) { return a + (b - a) * t; }
function harvSegPoint(seg, f) {
  return { x: harvLerp(seg[0][0], seg[1][0], f), y: harvLerp(seg[0][1], seg[1][1], f) };
}
/* Random bilinear point inside the bin quad — the landing pick. */
function harvBinPoint() {
  const [TL, TR, BR, BL] = HARV_BIN.points;
  const u = Math.random(), v = Math.random();
  return {
    x: harvLerp(harvLerp(TL[0], TR[0], u), harvLerp(BL[0], BR[0], u), v),
    y: harvLerp(harvLerp(TL[1], TR[1], u), harvLerp(BL[1], BR[1], u), v),
  };
}
/* Meter level line at fill fraction t (0 bottom → 1 top): lerp of the quad's
   bottom/top edges, plus the user-tuned perspective tilt on the RIGHT end. */
function harvMeterLevel(t) {
  const [TL, TR, BR, BL] = HARV_METER.points;
  return {
    L: { x: harvLerp(BL[0], TL[0], t), y: harvLerp(BL[1], TL[1], t) },
    R: { x: harvLerp(BR[0], TR[0], t), y: harvLerp(BR[1], TR[1], t) + HARV_METER.tilt },
  };
}
/* Quadratic Bézier whose control point puts the apex `peak` px above the
   higher endpoint at t=0.5. x(t) comes out LINEAR and y(t) quadratic —
   constant horizontal velocity + gravity, so linear t IS the physics. */
function harvArcCtrl(a, b, peak) {
  const apexY = Math.min(a.y, b.y) - peak;
  return { x: (a.x + b.x) / 2, y: 2 * apexY - 0.5 * (a.y + b.y) };
}
function harvArcPoint(a, b, c, t) {
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
           y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
}

/* --- yield ------------------------------------------------------------------- */
/* harvestYieldFor — the §6J cash-out. Returns null for dead/missing plants. */
function harvestYieldFor(plant) {
  if (!plant || plant.health <= 0) return null;
  const pipFrac  = plant.health / plant.maxHealth;
  // Pollination is now the required final step, so a harvested plant is ALWAYS
  // pollinated (pollMod 1). Missed keeps 0 defensively (missed plants can't reach
  // harvest, but the summary PLANTS card may still call this). The old
  // "dome never visited → 0.5" tier is retired — you can't harvest without it.
  const pollMod  = plant.missedPollination ? 0 : 1;
  const lightMod = plant.lightYieldReduced ? HARV_TUNE.lightMod : 1;
  const units = Math.round(HARV_TUNE.baseYield * pipFrac * pollMod * lightMod);
  const reasons = [];
  if (plant.missedPollination)      reasons.push('no fruit set');
  if (plant.lightYieldReduced)      reasons.push('light stress ↓');
  if (pipFrac < 1)                  reasons.push(`health ↓ ${plant.health}/${plant.maxHealth}`);
  return { units, pipFrac, pollMod, lightMod, reasons };
}
function harvHarvestable() {
  // Fruiting IS harvest-ready (pollination = the final step); 'harvestable' is
  // the vestigial 6th stage and still qualifies defensively.
  return gameState.tray.filter(p => p && p.health > 0 &&
    (p.stage === 'fruiting' || p.stage === 'harvestable'));
}
/* Run is over when the quota is MET (§6J: "meets or exceeds quota = run won"
   — winning ends the game even with plants still growing), when every planted
   slot is spent (dead or harvested), or when the colony is starving. */
function harvRunOver() {
  const run = gameState.run;
  if (run.colonyFood >= run.colonyQuota) return true;
  const planted = gameState.tray.filter(Boolean);
  // A plant is "spent" if it's dead, harvested, OR permanently stuck: a
  // missed-pollination plant stays at flowering forever (the dome won't re-accept
  // it) and can never reach harvest, so it must not block run-over indefinitely.
  // (Un-pollinated flowering plants that HAVEN'T missed are NOT spent — the
  // player can still take them to the dome.)
  const allSpent = planted.length > 0 &&
    planted.every(p => p.health <= 0 || p.stage === 'harvested' || p.missedPollination);
  return allSpent || run.colonyFood <= 0;
}

/* --- state ------------------------------------------------------------------- */
function ensureHarvState() {
  if (!gameState.harvestBay) {
    gameState.harvestBay = {
      phase: 'setup',        // setup → running → resolved
      queue: [],             // per-plant entries awaiting launch
      active: null,          // entry currently launching
      settling: [],          // fully-launched entries waiting for landings
      flying: [],            // in-flight produce
      launchTimer: 0,
      displayFood: gameState.run.colonyFood,   // animated meter value
      totalUnits: 0,
    };
  }
  return gameState.harvestBay;
}

/* --- builder ------------------------------------------------------------------ */
function buildHarvestBay(key) {
  const hb = ensureHarvState();
  hb.displayFood = gameState.run.colonyFood;

  const wrap = document.createElement('div');
  wrap.className = 'harv-screen';
  wrap.dataset.key = key;

  const bg = document.createElement('img');
  bg.className = 'harv-bg';
  bg.src = assetUrl('bg-harvest');
  wrap.appendChild(bg);

  // One canvas: meter fill polygon + quota line (redrawn per frame).
  const cv = document.createElement('canvas');
  cv.className = 'harv-canvas';
  cv.width = 1280; cv.height = 580;
  wrap.appendChild(cv);

  // Right-wall report screen (flat — plain positioned div, no cssQuadWarp).
  const report = document.createElement('div');
  report.className = 'harv-report';
  report.style.left = HARV_SCREEN.x + 'px';
  report.style.top  = HARV_SCREEN.y + 'px';
  report.style.width  = HARV_SCREEN.w + 'px';
  report.style.height = HARV_SCREEN.h + 'px';
  report.innerHTML = `<div class="harv-title">HARVEST REPORT</div>`;
  attachTooltip(report, () =>
    `<span class="tt-name">Harvest report</span>` +
    `<span class="tt-row">Yield per plant = base ${HARV_TUNE.baseYield}</span>` +
    `<span class="tt-row">× health pips × pollination × light</span>` +
    `<span class="tt-row">Missed pollination = no yield.</span>`);
  wrap.appendChild(report);

  // Invisible hotspots over baked-in art: the gauge + the bin.
  const meterBox = harvQuadBBox(HARV_METER.points);
  const meterHot = document.createElement('div');
  meterHot.className = 'harv-hotspot';
  meterHot.style.left = (meterBox.x - 8) + 'px';
  meterHot.style.top = (meterBox.y - 8) + 'px';
  meterHot.style.width = (meterBox.w + 16) + 'px';
  meterHot.style.height = (meterBox.h + 16) + 'px';
  attachTooltip(meterHot, () => {
    const run = gameState.run;
    const need = Math.max(0, run.colonyQuota - run.colonyFood);
    return `<span class="tt-name">Colony food supply</span>` +
      `<span class="tt-row"><span class="tt-label">Food</span><span class="tt-value">${run.colonyFood} / ${run.colonyQuota} quota</span></span>` +
      `<span class="tt-row">${need > 0 ? need + ' more to feed the colony.' : 'Quota met — the colony is fed!'}</span>`;
  });
  wrap.appendChild(meterHot);

  const binBox = harvQuadBBox(HARV_BIN.points);
  const binHot = document.createElement('div');
  binHot.className = 'harv-hotspot';
  binHot.style.left = binBox.x + 'px';
  binHot.style.top = binBox.y + 'px';
  binHot.style.width = binBox.w + 'px';
  binHot.style.height = binBox.h + 'px';
  attachTooltip(binHot, () => {
    const hb2 = gameState.harvestBay;
    return `<span class="tt-name">Collection bin</span>` +
      `<span class="tt-row"><span class="tt-label">Collected</span><span class="tt-value">+${hb2 ? hb2.totalUnits : 0} food this visit</span></span>`;
  });
  wrap.appendChild(binHot);

  const banner = document.createElement('div');
  banner.className = 'room-banner';
  wrap.appendChild(banner);

  // Nothing in this room is picked up or placed — tray slots are read-only
  // (returning true swallows the default select-toggle; tooltips still work).
  setSlotClickHandler(() => true);
  setTrayClickHint(null);
  clearSlotSelection();
  harvSyncActions();
  harvUpdateBanner(wrap);

  wrap._ticker = createTicker(wrap, harvFrame);
  wrap._ticker.start();
  return wrap;
}
function harvQuadBBox(pts) {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}
function harvScreen()   { return document.querySelector('.harv-screen'); }
function harvReportEl() { const s = harvScreen(); return s && s.querySelector('.harv-report'); }
function harvSlotEl(i)  { return document.querySelector(`#tray .slot[data-idx="${i}"]`); }

/* The tray mirrors the chute: a slot pulses HARVESTING while its plant's
   batch is in the air (renderTray leaves unknown classes alone, so the class
   survives re-renders; harvBegin/exit clean up). */
function harvMarkSlot(entry, on) {
  const el = harvSlotEl(entry.plant.slotIndex);
  if (el) el.classList.toggle('harv-active', !!on);
}
function harvClearSlotFx() {
  document.querySelectorAll('#tray .slot').forEach(s => {
    s.classList.remove('harv-active', 'harv-stubpop');
    s.querySelectorAll('.harv-slot-miss').forEach(m => m.remove());
  });
}

/* --- action zone / banner ----------------------------------------------------- */
function harvSyncActions() {
  const hb = gameState.harvestBay;
  if (!hb) return;
  if (hb.phase === 'setup') {
    const n = harvHarvestable().length;
    setActionZone(n
      ? [{ label: 'Collect Harvest', onClick: harvBegin },
         { label: 'Back to hub', onClick: exitHarvestBay }]
      : [{ label: 'Back to hub', onClick: exitHarvestBay }]);
  } else if (hb.phase === 'running') {
    setActionZone([{ label: 'Collecting…', onClick: shakeActionButton }]);
  } else {
    const btns = [];
    if (harvRunOver())
      btns.push({ label: 'View Run Summary', onClick: openRunSummary });
    btns.push({ label: 'Return to hub', onClick: exitHarvestBay });
    setActionZone(btns);
  }
}
function harvUpdateBanner(rootEl) {
  const root = rootEl || harvScreen();
  const banner = root && root.querySelector('.room-banner');
  if (!banner) return;
  const hb = gameState.harvestBay;
  let msg;
  if (!hb || hb.phase === 'setup') {
    const n = harvHarvestable().length;
    msg = n ? `HARVEST BAY — ${n} plant${n > 1 ? 's' : ''} ready · press Collect Harvest`
            : `HARVEST BAY — nothing is ready to harvest`;
  } else if (hb.phase === 'running') {
    msg = 'Collecting produce…';
  } else if (gameState.run.colonyFood >= gameState.run.colonyQuota) {
    msg = `QUOTA MET — the colony is fed! (+${hb.totalUnits} food)`;
  } else if (harvRunOver()) {
    msg = 'Run complete — view the summary';
  } else {
    msg = `Harvest collected — +${hb.totalUnits} food`;
  }
  banner.innerHTML = msg;
}

/* --- collect ------------------------------------------------------------------ */
function harvBegin() {
  const hb = ensureHarvState();
  if (hb.phase !== 'setup') return;
  const list = harvHarvestable();
  if (!list.length) return;
  hb.queue = list.map(p => {
    const info = harvestYieldFor(p);
    const payloads = [];
    let left = info.units;
    while (left > 0) {
      const v = Math.min(HARV_TUNE.unitsPerProduce, left);
      payloads.push(v); left -= v;
    }
    return { plant: p, info, payloads, launched: 0, landed: 0, missTimer: 0 };
  });
  hb.phase = 'running';
  hb.launchTimer = 0.45;   // a breath before the first drop
  harvClearSlotFx();       // stale beat classes from a prior visit/reset
  harvSyncActions();
  harvUpdateBanner();
}

/* --- per-frame loop ----------------------------------------------------------- */
function harvFrame(dt) {
  const hb = gameState.harvestBay;
  const wrap = harvScreen();
  if (!hb || !wrap) return;

  if (hb.phase === 'running') {
    hb.launchTimer -= dt;

    // Promote the next queued plant once the current one has fully launched.
    if (!hb.active && hb.queue.length) {
      hb.active = hb.queue.shift();
      harvMarkSlot(hb.active, true);   // tray slot pulses while its batch delivers
      if (hb.active.payloads.length === 0) {
        hb.active.missTimer = 1.15;
        harvSpawnMissMark(wrap, hb.active.plant);
      }
      hb.launchTimer = Math.max(hb.launchTimer, 0.15);
    }
    const a = hb.active;
    if (a) {
      if (a.payloads.length === 0) {
        a.missTimer -= dt;
        if (a.missTimer <= 0) { harvFinalizeEntry(a); hb.active = null; }
      } else if (a.launched < a.payloads.length) {
        if (hb.launchTimer <= 0) {
          harvLaunchProduce(wrap, a, a.payloads[a.launched]);
          a.launched++;
          hb.launchTimer = HARV_TUNE.launchGapMs / 1000;
        }
      } else {
        hb.settling.push(a);   // all launched — land while the next plant runs
        hb.active = null;
      }
    }
    // Entries whose whole batch has landed turn to tray stubs + report lines.
    for (let i = hb.settling.length - 1; i >= 0; i--) {
      const e = hb.settling[i];
      if (e.landed >= e.payloads.length) {
        harvFinalizeEntry(e);
        hb.settling.splice(i, 1);
      }
    }
    if (!hb.active && !hb.queue.length && !hb.settling.length && !hb.flying.length) {
      harvResolve();
    }
  }

  harvStepFlyers(dt);

  // Meter chases the real value (addFood applies instantly; the gauge glides).
  const target = gameState.run.colonyFood;
  hb.displayFood += (target - hb.displayFood) * Math.min(1, dt * HARV_TUNE.meterLerp);
  if (Math.abs(target - hb.displayFood) < 0.05) hb.displayFood = target;
  harvDrawCanvas(wrap);
}

function harvLaunchProduce(wrap, entry, value) {
  const hb = gameState.harvestBay;
  const lane = Math.random();
  const spawn = harvSegPoint(HARV_CHUTE.spawn, lane);
  const lip   = harvSegPoint(HARV_CHUTE.lip, lane);
  const target = harvBinPoint();
  const img = document.createElement('img');
  img.className = 'harv-produce';
  img.src = assetUrl(HARV_PRODUCE[entry.plant.spriteFamily] || 'produce-round');
  wrap.appendChild(img);
  hb.flying.push({
    img, entry, value, t: 0, phase: 'pop',
    spawn, lip, target,
    ctrl: harvArcCtrl(lip, target, HARV_SIZES.arcPeak),
    drift: (Math.random() < 0.5 ? -1 : 1) * (4 + Math.random() * 6),  // bounce drift px
  });
}

/* Bottom-anchored placement (produce "sits" on lip and pile like the room). */
function harvPutProduce(f, p, scale, bright, squashY) {
  const h = HARV_SIZES.produce * scale;
  f.img.style.height = (h * (squashY || 1)) + 'px';
  f.img.style.width = 'auto';
  f.img.style.left = (p.x - h / 2) + 'px';
  f.img.style.top  = (p.y - h * (squashY || 1)) + 'px';
  f.img.style.filter = bright < 1 ? `brightness(${bright})` : '';
}

function harvStepFlyers(dt) {
  const hb = gameState.harvestBay;
  if (!hb || !hb.flying.length) return;
  const T = HARV_TUNE;
  for (let i = hb.flying.length - 1; i >= 0; i--) {
    const f = hb.flying[i];
    f.t += dt * 1000;
    if (f.phase === 'pop') {
      const t = Math.min(1, f.t / T.popMs);
      harvPutProduce(f, f.spawn, harvLerp(0.6, 0.72, t), 0.55, 1);
      if (t >= 1) { f.phase = 'slide'; f.t = 0; }
    } else if (f.phase === 'slide') {
      const t = Math.min(1, f.t / T.slideMs), e = t * t;   // ease-in: gravity feed
      harvPutProduce(f,
        { x: harvLerp(f.spawn.x, f.lip.x, e), y: harvLerp(f.spawn.y, f.lip.y, e) },
        harvLerp(0.72, 1, e), harvLerp(0.55, 1, e), 1);
      if (t >= 1) { f.phase = 'arc'; f.t = 0; }
    } else if (f.phase === 'arc') {
      const t = Math.min(1, f.t / T.arcMs);
      harvPutProduce(f, harvArcPoint(f.lip, f.target, f.ctrl, t), harvLerp(1, 1.06, t), 1, 1);
      if (t >= 1) { f.phase = 'bounce'; f.t = 0; }
    } else if (f.phase === 'bounce') {
      const t = Math.min(1, f.t / T.bounceMs);
      const hop = Math.max(10, HARV_SIZES.arcPeak * 0.15) * 4 * t * (1 - t);
      const squash = (t < 0.12 || t > 0.88) ? 0.82 : 1;
      harvPutProduce(f, { x: f.target.x + f.drift * t, y: f.target.y - hop }, 1.06, 1, squash);
      if (t >= 1) {
        // Landed: retire to the pile, credit the colony.
        harvPutProduce(f, { x: f.target.x + f.drift, y: f.target.y }, 1.06, 1, 1);
        f.entry.landed++;
        hb.totalUnits += f.value;
        addFood(f.value);
        hb.flying.splice(i, 1);   // img stays in the DOM — that IS the pile
      }
    }
  }
}

function harvSpawnMissMark(wrap, plant) {
  const lane = 0.2 + Math.random() * 0.6;
  const lip = harvSegPoint(HARV_CHUTE.lip, lane);
  const mark = document.createElement('img');
  mark.className = 'harv-missmark';
  mark.src = assetUrl('death-missed-pollination');
  mark.style.height = '26px';
  mark.style.left = lip.x + 'px';
  mark.style.top  = (lip.y - 26) + 'px';
  wrap.appendChild(mark);
  mark.addEventListener('animationend', () => mark.remove());
}

function harvFinalizeEntry(entry) {
  harvMarkSlot(entry, false);
  entry.plant.stage = 'harvested';
  renderTray(gameState);
  // The slot's harvest beat resolves: stub pops in; a zero-yield plant first
  // releases the missed-pollination icon — "this plant produced nothing".
  const slot = harvSlotEl(entry.plant.slotIndex);
  if (slot) {
    slot.classList.remove('harv-stubpop');
    void slot.offsetWidth;               // restart the animation
    slot.classList.add('harv-stubpop');
    if (entry.info.units === 0) {
      const mark = document.createElement('img');
      mark.className = 'harv-slot-miss';
      mark.src = assetUrl('death-missed-pollination');
      slot.appendChild(mark);
      mark.addEventListener('animationend', () => mark.remove());
    }
  }
  const el = harvReportEl();
  if (!el) return;
  const line = document.createElement('div');
  line.className = 'harv-line';
  line.innerHTML =
    `${entry.plant.name} <span class="harv-dim">·</span> ${entry.info.units > 0 ? '+' + entry.info.units : '0'}` +
    entry.info.reasons.map(r => `<span class="harv-neg">${r}</span>`).join('');
  el.appendChild(line);
}

function harvResolve() {
  const hb = gameState.harvestBay;
  if (!hb || hb.phase !== 'running') return;
  hb.phase = 'resolved';
  const el = harvReportEl();
  if (el) {
    const div = document.createElement('div');
    div.className = 'harv-dim';
    div.textContent = '─────────────';
    el.appendChild(div);
    const total = document.createElement('div');
    total.className = 'harv-total';
    total.innerHTML = `TOTAL +${hb.totalUnits} FOOD`;
    el.appendChild(total);
    if (gameState.run.colonyFood >= gameState.run.colonyQuota) {
      const win = document.createElement('div');
      win.className = 'harv-win';
      win.textContent = '★ QUOTA MET — COLONY FED ★';
      el.appendChild(win);
    }
  }
  harvSyncActions();
  harvUpdateBanner();
}

/* ============================================================================
   Run Summary — the end-of-run debrief (Bible §6J, expanded per user
   2026-07-17): a FULL-SCREEN tabbed modal that ends the game, not the little
   wall screen (that keeps the live harvest feed). Three tabs:
     COLONY  — verdict + rank title, food vs quota, the colony LEDGER (food
               spent on actions vs earned at harvest — agriculture as an
               energy budget), traits discovered, a real-world space-ag fact.
     PLANTS  — one card per tray plant: sprite, fate, and the yield math
               spelled out (10 × pips × poll × light = N) with the cutting
               factors in salmon — plus the Liebig's-Law line the model
               embodies (a zero anywhere zeroes everything).
     SCIENCE — failures-by-room bars + takeaways ONLY for causes this player
               actually hit (their run's story, not a generic recap).
   Opened from the Harvest Bay action zone once harvRunOver(); reopenable.
   "New Run" appears when a handler is registered (setNewRunHandler — the
   demo resets its scenario; Demo 15 wires a real restart). The autopsy
   modal (z1000) opens ABOVE this modal (z900) from the actions row.
   ============================================================================ */

/* Per-cause science one-liners. Kinds match stressMarkers; the two pseudo-
   kinds (photoperiod-miss / unpollinated) are derived from plant flags. */
const HARV_TAKEAWAYS = {
  'flood':           { icon: 'badge-flood',              line: '<b>Overwatering drowns roots.</b> Roots need air as much as water — soggy substrate suffocates them.' },
  'drought':         { icon: 'badge-drought',            line: '<b>Water is the delivery truck.</b> Too little and nutrients can\'t move — the plant wilts even in rich soil.' },
  'root-disease':    { icon: 'badge-root-disease',       line: '<b>Match the medium to the plant.</b> The wrong substrate starves roots or rots them.' },
  'wrong-spectrum':  { icon: 'death-wrong-spectrum',     line: '<b>Light color is a signal.</b> Red light drives flowering; blue drives leafy growth — plants read the spectrum.' },
  'nutrient-burn':   { icon: 'badge-nutrient-burn',      line: '<b>More fertilizer is not better.</b> Excess nutrients pull water OUT of roots and burn them.' },
  'deficiency':      { icon: 'badge-deficiency',         line: '<b>N, P and K do different jobs.</b> Nitrogen builds leaves, phosphorus roots and fruit, potassium overall health.' },
  'disorientation':  { icon: 'badge-root-disease',       line: '<b>Plants sense gravity.</b> Roots grow down, shoots grow up — and some plants can\'t recover from being flipped.' },
  'ph-lockout':      { icon: 'death-ph-lockout',         line: '<b>pH is the gatekeeper.</b> At the wrong pH, nutrients are present in the water but LOCKED away from the plant.' },
  'dna-damage':      { icon: 'badge-dna-damage',         line: '<b>Radiation shreds DNA.</b> And plain water is a surprisingly good shield — real Mars habitat designs put water tanks overhead.' },
  'missed-pollination': { icon: 'death-missed-pollination', line: '<b>No pollination, no fruit.</b> Flowers aren\'t decoration — they\'re a job posting for pollen carriers.' },
  'photoperiod-miss':{ icon: 'death-wrong-spectrum',     line: '<b>Day length is a calendar.</b> Many plants count hours of light to decide when to flower — miss it and yield drops.' },
  'unpollinated':    { icon: 'trait-pollination-self',   line: '<b>Half a harvest.</b> Flowers that never met the Pollination Dome set far less fruit — even self-pollinators do better with help.' },
};

/* Real-world space-agriculture hooks (COLONY tab; deterministic pick). */
const HARV_FACTS = [
  'Real astronauts garden too: NASA\'s <b>Veggie</b> chamber on the ISS has grown lettuce, radishes and zinnias in orbit — fresh food AND fresh morale matter on long missions.',
  'On the ISS, plants grow in <b>clay pillows with wicking mats</b> — in microgravity, water sticks to everything, so plain watering cans are useless.',
  'A Mars colony can\'t wait 9 months for groceries: every food run costs about <b>$10,000 per kilogram</b> to launch. Growing on-site is the only plan that scales.',
  'Plants on the ISS still know which way is "down" — they follow the <b>light</b> instead of gravity. Phototropism takes over when gravitropism has nothing to pull on.',
];

/* Failure data shared by the chart + takeaways. Dead plants stay IN the tray
   (killPlant clears badges, not stressMarkers) — a deadTray snapshot only
   counts when its slot was since reseeded (Demo 15), else it double-counts. */
function hsFailureData() {
  const counts = {}, kinds = new Set();
  const tally = p => (p.stressMarkers || []).forEach(m => {
    const room = HARV_FAIL_ROOM[m.kind] || 'Other';
    counts[room] = (counts[room] || 0) + 1;
    kinds.add(m.kind);
  });
  const planted = gameState.tray.filter(Boolean);
  planted.forEach(tally);
  gameState.deadTray.forEach(e => {
    const cur = gameState.tray[e.plant.slotIndex];
    const stillInSlot = cur && cur.health <= 0 && cur.speciesId === e.plant.speciesId;
    if (!stillInSlot) tally(e.plant);
  });
  // Pseudo-kinds from flags (no stress marker exists for these).
  if (planted.some(p => p.lightYieldReduced)) kinds.add('photoperiod-miss');
  if (planted.some(p => p.stage === 'harvested' && !p.pollinated && !p.missedPollination)) kinds.add('unpollinated');
  return { counts, kinds, planted };
}

/* Rank title from quota + husbandry. */
function hsRunRank() {
  const run = gameState.run;
  const planted = gameState.tray.filter(Boolean);
  const harvested = planted.filter(p => p.stage === 'harvested').length;
  const died = planted.filter(p => p.health <= 0).length;
  const won = run.colonyFood >= run.colonyQuota;
  if (won && died === 0 && harvested === planted.length && planted.length > 0)
    return { title: '★ MASTER AGRONOMIST ★', sub: 'Quota met, every plant brought home. Flawless.', art: 'rank-master' };
  if (won)  return { title: 'COLONY PROVIDER', sub: 'The quota is met — the colony eats this season.', art: 'rank-provider' };
  if (harvested > 0)
    return { title: 'LEAN SEASON', sub: 'Some harvest came in, but not enough. Rations are cut.', art: 'rank-lean' };
  return { title: 'HUNGRY WINTER', sub: 'Nothing reached the bin. The colony survives on reserves.', art: 'rank-hungry' };
}

/* New Run hook — the game layer decides what restarting means. */
let _newRunHandler = null;
function setNewRunHandler(fn) { _newRunHandler = fn; }

function openRunSummary() {
  if (document.querySelector('.harv-summary-modal')) return;
  const host = document.getElementById('game-panel') || document.getElementById('stage');
  if (!host) return;
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';

  const modal = document.createElement('div');
  modal.className = 'harv-summary-modal';
  const panel = document.createElement('div');
  panel.className = 'hs-panel';
  modal.appendChild(panel);

  const TABS = [
    { key: 'colony',  label: 'COLONY',  build: hsBuildColony },
    { key: 'plants',  label: 'PLANTS',  build: hsBuildPlants },
    { key: 'science', label: 'SCIENCE', build: hsBuildScience },
  ];
  const tabsRow = document.createElement('div');
  tabsRow.className = 'hs-tabs';
  const body = document.createElement('div');
  body.className = 'hs-body';
  TABS.forEach((t, i) => {
    const b = document.createElement('button');
    b.className = 'hs-tab' + (i === 0 ? ' active' : '');
    b.textContent = t.label;
    b.addEventListener('click', () => {
      tabsRow.querySelectorAll('.hs-tab').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      body.innerHTML = '';
      t.build(body);
    });
    tabsRow.appendChild(b);
  });
  panel.appendChild(tabsRow);
  panel.appendChild(body);

  const actions = document.createElement('div');
  actions.className = 'hs-actions';
  if (gameState.deadTray.length) {
    const ab = document.createElement('button');
    ab.className = 'hs-btn';
    ab.textContent = 'Review autopsy cards';
    ab.addEventListener('click', openAutopsyReview);   // opens above (z1000)
    actions.appendChild(ab);
  }
  // A genuinely-over run is FINAL — no Close; New Run (restart to the game's
  // beginning) is the only way forward. Close appears only when the modal was
  // opened on a still-live run (dev force-open / mid-run peek), or as a
  // fallback when no restart handler is registered.
  if (!harvRunOver() || !_newRunHandler) {
    const close = document.createElement('button');
    close.className = 'hs-btn';
    close.textContent = 'Close ✕';
    close.addEventListener('click', () => modal.remove());
    actions.appendChild(close);
  }
  if (_newRunHandler) {
    const nb = document.createElement('button');
    nb.className = 'hs-btn primary';
    nb.textContent = '▶ New Run';
    nb.addEventListener('click', () => { modal.remove(); _newRunHandler(); });
    actions.appendChild(nb);
  }
  panel.appendChild(actions);

  hsBuildColony(body);
  host.appendChild(modal);
}

/* — COLONY tab — */
function hsBuildColony(body) {
  const run = gameState.run;
  const planted = gameState.tray.filter(Boolean);
  const harvested = planted.filter(p => p.stage === 'harvested').length;
  const died = planted.filter(p => p.health <= 0).length;
  const growing = planted.length - harvested - died;
  const won = run.colonyFood >= run.colonyQuota;
  const rank = hsRunRank();
  const traitsFound = planted.reduce((n, p) => n + (p.revealed || []).length, 0);
  const traitsMax = planted.length * 5;
  const net = (run.foodEarned || 0) - (run.foodSpent || 0);
  const fact = HARV_FACTS[((run.actionCount || 0) + planted.length) % HARV_FACTS.length];

  // Two columns (user layout call): the readout shifts left, still center-
  // aligned within itself; the rank card fills the right-hand space.
  body.innerHTML =
    `<div class="hs-colony-cols">` +
    `<div class="hs-colony-main">` +
      `<div class="hs-verdict ${won ? '' : 'lost'}">${won ? 'THE COLONY IS FED' : 'THE COLONY GOES HUNGRY'}</div>` +
      `<div class="hs-rank-sub">${rank.sub}</div>` +
      `<div class="hs-score">FOOD ${run.colonyFood} / ${run.colonyQuota} QUOTA</div>` +
      `<div class="hs-stats">` +
        `<div class="hs-stat"><div class="hs-stat-label">PLANTS</div>` +
          `<div class="hs-stat-value">${harvested} harvested</div>` +
          `<div class="hs-stat-value${died ? ' bad' : ''}">${died} lost</div>` +
          `<div class="hs-stat-value">${growing} unfinished</div></div>` +
        `<div class="hs-stat"><div class="hs-stat-label">COLONY LEDGER</div>` +
          `<div class="hs-stat-value">spent ${run.foodSpent || 0}</div>` +
          `<div class="hs-stat-value">earned ${run.foodEarned || 0}</div>` +
          `<div class="hs-stat-value${net < 0 ? ' bad' : ''}">net ${net >= 0 ? '+' : ''}${net}</div></div>` +
        `<div class="hs-stat"><div class="hs-stat-label">TRAITS DISCOVERED</div>` +
          `<div class="hs-stat-value">${traitsFound} of ${traitsMax}</div></div>` +
      `</div>` +
      `<div class="hs-fact">${fact}</div>` +
    `</div>` +
    `<div class="hs-colony-side"><img class="hs-rank-art" src="${assetUrl(rank.art)}" alt="${rank.title}"></div>` +
    `</div>`;
}

/* — PLANTS tab — */
/* Card sprite size is live-tunable (Devtools): applyPlantSpriteCell bakes
   inline px, so the setter re-renders the tab if it's the one on screen. */
let _hsCardSprite = 85;   // user-baked 2026-07-17 — integer-perfect (85×85 native cells)
function setHsCardSpriteSize(v) {
  _hsCardSprite = v;
  const body = document.querySelector('.harv-summary-modal .hs-body');
  if (body && body.querySelector('.hs-cards')) {
    body.innerHTML = '';
    hsBuildPlants(body);
  }
}

function hsBuildPlants(body) {
  const wrap = document.createElement('div');
  wrap.className = 'hs-cards';
  gameState.tray.forEach((p, i) => {
    if (!p) return;
    const card = document.createElement('div');
    card.className = 'hs-card';
    const spr = document.createElement('div');
    spr.className = 'hs-card-sprite';
    applyPlantSpriteCell(spr, p, _hsCardSprite);
    card.appendChild(spr);

    let fate, math = '';
    if (p.health <= 0) {
      const entry = gameState.deadTray.find(e => e.plant.slotIndex === i && e.plant.speciesId === p.speciesId);
      fate = `<div class="hs-card-fate dead">Died — ${entry ? entry.causeLabel : 'unknown'}</div>`;
    } else if (p.stage === 'harvested') {
      const y = harvestYieldFor(p);
      fate = `<div class="hs-card-fate">Harvested · +${y.units} food</div>`;
      const f = (v, cut) => cut ? `<span class="cut">${v}</span>` : v;
      math = `<div class="hs-math">${HARV_TUNE.baseYield} × ${f(`${p.health}/${p.maxHealth}`, p.health < p.maxHealth)}` +
             ` × ${f(`${y.pollMod}`, y.pollMod < 1)} × ${f(`${y.lightMod}`, y.lightMod < 1)} = ${y.units}</div>`;
    } else if (p.missedPollination) {
      // Stuck at flowering — the dome won't re-accept it, so it never fruits.
      fate = `<div class="hs-card-fate growing">No fruit — missed pollination</div>`;
    } else {
      fate = `<div class="hs-card-fate growing">Still growing — ${p.stage}</div>`;
    }
    card.innerHTML += `<div class="hs-card-name">${p.name}</div>` + fate + math;
    wrap.appendChild(card);
  });
  body.appendChild(wrap);
  const liebig = document.createElement('div');
  liebig.className = 'hs-liebig';
  liebig.innerHTML = `<b>Liebig's Law of the Minimum:</b> a plant only does as well as its ` +
    `worst-treated need. The factors MULTIPLY — great light can't rescue missed ` +
    `pollination, because anything × 0 is 0.`;
  body.appendChild(liebig);
}

/* — SCIENCE tab — */
function hsBuildScience(body) {
  const { counts, kinds } = hsFailureData();
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const maxN = rows.length ? rows[0][1] : 1;

  if (rows.length) {
    const head = document.createElement('div');
    head.innerHTML =
      `<div class="hs-chart-title">WHERE THINGS WENT WRONG</div>` +
      `<div class="hs-chart-sub">stress events each room logged this run — longer bar = more trouble</div>`;
    body.appendChild(head);
    const bars = document.createElement('div');
    bars.className = 'hs-bars';
    bars.innerHTML = rows.map(([room, n]) =>
      `<div class="hs-bar-row"><span>${room}</span>` +
      `<span class="hs-bar" style="width:${Math.round(n / maxN * 100)}%"></span>` +
      `<span>×${n}</span></div>`).join('');
    body.appendChild(bars);
  }
  const takes = document.createElement('div');
  takes.className = 'hs-takes';
  let any = false;
  Object.keys(HARV_TAKEAWAYS).forEach(kind => {
    if (!kinds.has(kind)) return;   // experienced-only — this run's story
    any = true;
    const t = HARV_TAKEAWAYS[kind];
    const row = document.createElement('div');
    row.className = 'hs-take';
    row.innerHTML = `<img src="${assetUrl(t.icon)}" alt=""><div class="hs-take-text">${t.line}</div>`;
    takes.appendChild(row);
  });
  if (!any) {
    takes.innerHTML = `<div class="hs-flawless">Flawless husbandry — every plant got what it ` +
      `needed, every step. That's not luck, that's agronomy. ★</div>`;
  }
  body.appendChild(takes);
}

/* --- canvas: meter fill + quota line ------------------------------------------ */
function harvDrawCanvas(wrap) {
  const cv = wrap.querySelector('.harv-canvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, 1280, 580);
  const hb = gameState.harvestBay;
  const [, , BR, BL] = HARV_METER.points;

  // Fill polygon: bottom edge up to the (tilted) level line. Gauge maps 0–100.
  const frac = Math.max(0, Math.min(1, (hb ? hb.displayFood : gameState.run.colonyFood) / 100));
  if (frac > 0) {
    const { L, R } = harvMeterLevel(frac);
    ctx.beginPath();
    ctx.moveTo(BL[0], BL[1]); ctx.lineTo(BR[0], BR[1]);
    ctx.lineTo(R.x, R.y); ctx.lineTo(L.x, L.y);
    ctx.closePath();
    const full = gameState.run.colonyFood >= gameState.run.colonyQuota;
    ctx.fillStyle = full ? 'rgba(140, 240, 165, 0.9)' : 'rgba(110, 220, 140, 0.82)';
    ctx.fill();
    // Bright top line — the moving level the player reads.
    ctx.beginPath();
    ctx.moveTo(L.x, L.y); ctx.lineTo(R.x, R.y);
    ctx.strokeStyle = '#c9ffd6';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // Quota marker (amber dashes) — where "colony fed" sits on the gauge.
  const qf = Math.min(1, gameState.run.colonyQuota / 100);
  const q = harvMeterLevel(qf);
  ctx.beginPath();
  ctx.setLineDash([4, 3]);
  ctx.moveTo(q.L.x - 3, q.L.y); ctx.lineTo(q.R.x + 3, q.R.y);
  ctx.strokeStyle = 'rgba(255, 184, 74, 0.9)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);
}

/* --- exit --------------------------------------------------------------------- */
function exitHarvestBay() {
  const hb = gameState.harvestBay;
  if (hb && hb.phase === 'running') { shakeActionButton(); return; }
  setActionZone([]);
  setSlotClickHandler(null);
  setTrayClickHint(null);
  harvClearSlotFx();
  gameState.harvestBay = null;        // pile/report are DOM-local; screen unmounts
  // Bible §6J: back to Seed Bank after collection — but if the player left
  // WITHOUT collecting (or new plants ripened mid-visit), stay in harvest mode.
  setCenterMode(harvHarvestable().length ? 'harvest' : 'seedbank');
  transitionTo('hub', 'center');
}


/* ============================================================================
   Demo 15 — Full integration
   The game layer: difficulty presets, run lifecycle (new run / run over),
   localStorage save+load, the queued stage-unlock spine, and the startup
   title screen. index.html calls enableGameMode() to switch the persistent /
   run-ending behaviors on; demo pages never do, so their scenarios keep
   behaving exactly as before (and never touch the real save key).
   ============================================================================ */

const SAVE_KEY     = 'starseed-station-save';    // Bible §0: one key, JSON gameState
const PREFS_KEY    = 'starseed-station-prefs';   // survives New Run (difficulty choice)
const SAVE_VERSION = 1;

/* Transient per-visit room benches — never persisted; a resume always starts
   at the hub (mid-room state is discarded, matching the autosave-at-hub rule). */
const TRANSIENT_KEYS = ['substrateLab', 'pipeMaze', 'lightLab', 'mixingConsole',
  'orientationChamber', 'hydroponicBay', 'radiationDome', 'pollinationDome', 'harvestBay'];

/* --- difficulty -------------------------------------------------------------
   Starting food is the runway (distance to starving); quota − food is the net
   yield the run must earn. Cadet also pulls the four trickiest species out of
   the rack (strict gravitropes / strict photoperiod / heavy-slow growers) and
   nobody but Specialist ever sees the Radiation Dome. */
const DIFFICULTY = {
  // Balance (content pass step 3, 2026-07-19 — tuned against sim-econ.js ground
  // truth over perfect/good/typical/sloppy player profiles; baseYield stays
  // LOCKED per user, so start-food + quota are the only levers):
  //  · cadet 95/100 — even a sloppy run (2 dead, 2 missed poll) still clears
  //    (101); only a near-total wipe loses → training-wheels tier. Start stays
  //    BELOW quota on purpose: start == quota would make maybeEndRun's win-guard
  //    (food >= quota) treat a fresh run as already-won and suppress the lose
  //    summary when all plants die.
  //  · commander 80/100 — reference: typical play wins tight (+10), sloppy loses.
  //  · specialist 60/115 — a GOOD run (67 yield) wins +5, typical (38) loses;
  //    hard but off the razor's edge (was 120 = exactly 0 margin for a good run,
  //    made harsher once step 2 zeroed missed-pollination yield).
  cadet: {
    label: 'CADET', sub: 'first posting', rgb: '0, 255, 136',
    food: 95, quota: 100, lockedSpecies: [9, 13, 16, 18], radiation: false,
    lines: ['Start 95 food', 'Limited seeds'],
  },
  commander: {
    label: 'COMMANDER', sub: 'the standard run', rgb: '255, 204, 0',
    food: 80, quota: 100, lockedSpecies: [], radiation: false,
    lines: ['Start 80 food', 'All seeds available'],
  },
  specialist: {
    label: 'SPECIALIST', sub: 'deep-space posting', rgb: '255, 68, 85',
    food: 60, quota: 115, lockedSpecies: [], radiation: true,
    lines: ['Start 60 food', 'Higher quota', 'Radiation Dome online'],
  },
};

function applyDifficulty(id) {
  const d = DIFFICULTY[id] || DIFFICULTY.commander;
  gameState.run.difficulty  = DIFFICULTY[id] ? id : 'commander';
  gameState.run.colonyFood  = d.food;
  gameState.run.colonyQuota = d.quota;
  gameState.seedBank.locked = d.lockedSpecies.slice();
}

/* Radiation Dome gate — called next to the first-action Light unlock in the
   Substrate Lab / Pipe Maze exits. No-op unless the difficulty says so. */
function maybeUnlockRadiation() {
  const d = DIFFICULTY[gameState.run.difficulty];
  if (d && d.radiation && gameState.moduleState.radiation &&
      gameState.moduleState.radiation.status === 'locked') {
    unlockRoomDelayed('radiation');
  }
}

/* --- game mode gate ---------------------------------------------------------
   index.html (the real game) turns this on. It gates autosave and the global
   run-over trigger so demo scenario pages keep their sandbox behavior. */
let _gameMode = false;
function enableGameMode() { _gameMode = true; }

/* --- the stage-advance spine -------------------------------------------------
   agePlant calls this on every real stage change, whichever room did the aging.
   Hub unlocks are QUEUED (the hub is hidden mid-room; queuing lets the unlock
   fade play where the player can see it) and flushed on return-to-hub.
   Harvest mode flips immediately — it's state, not an animation. */
const _pendingHubUnlocks = [];
function queueHubUnlock(key) {
  const m = gameState.moduleState[key];
  if (m && m.status === 'locked' && !_pendingHubUnlocks.includes(key)) {
    _pendingHubUnlocks.push(key);
  }
}

function onStageAdvanced(plant, from, to) {
  // Pollination Dome unlocks when the FIRST plant reaches Flowering (Bible §5)
  // — from any room's aging, not just the Light Lab's bloom flow.
  if (to === 'flowering') queueHubUnlock('pollination');
  // FRUITING is harvest-ready (pollination is the required final step; the fruit
  // set IS the ripe state — user model 2026-07-18). The center room becomes the
  // Harvest Bay and the hub center pulses green until visited (Bible §5). The
  // vestigial 'harvestable' stage still qualifies defensively.
  if (to === 'fruiting' || to === 'harvestable') {
    const hr = gameState.centerRoom.harvestReady;
    if (!hr.includes(plant.slotIndex)) hr.push(plant.slotIndex);
    if (gameState.centerRoom.mode !== 'harvest') setCenterMode('harvest');
  }
}

/* Runs inside transitionTo() every time the hub slides back in. */
function onHubArrival() {
  while (_pendingHubUnlocks.length) unlockRoomDelayed(_pendingHubUnlocks.shift());
  autosave();
}

/* --- save / load ------------------------------------------------------------ */
function saveState() {
  try {
    const s = gameState;
    const moduleState = {};
    Object.keys(s.moduleState).forEach(k => {
      const m = Object.assign({}, s.moduleState[k]);
      if (m.status === 'unlocking') m.status = 'ready';   // never persist a transient
      moduleState[k] = m;
    });
    const snap = {
      version:    SAVE_VERSION,
      run:        Object.assign({}, s.run),
      tray:       s.tray,
      deadTray:   s.deadTray,
      autopsyLog: s.autopsyLog,
      moduleState,
      centerRoom: Object.assign({}, s.centerRoom),
      seedBank: {
        available:  s.seedBank.available,
        locked:     s.seedBank.locked,
        rackLayout: s.seedBank.rackLayout,
      },
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(snap));
    return true;
  } catch (e) {
    console.error('saveState failed:', e);
    return false;
  }
}

function loadState() {
  let snap;
  try { snap = JSON.parse(localStorage.getItem(SAVE_KEY)); }
  catch (_) { return false; }
  if (!snap || !snap.run) return false;

  Object.assign(gameState.run, snap.run);
  gameState.tray       = snap.tray       || [null, null, null, null, null, null, null, null];
  gameState.deadTray   = snap.deadTray   || [];
  gameState.autopsyLog = snap.autopsyLog || [];
  Object.keys(snap.moduleState || {}).forEach(k => {
    if (gameState.moduleState[k]) Object.assign(gameState.moduleState[k], snap.moduleState[k]);
  });
  Object.assign(gameState.centerRoom, snap.centerRoom || {});
  if (snap.seedBank) {
    if (snap.seedBank.available) gameState.seedBank.available = snap.seedBank.available;
    gameState.seedBank.locked     = snap.seedBank.locked || [];
    gameState.seedBank.rackLayout = snap.seedBank.rackLayout || null;
  }
  TRANSIENT_KEYS.forEach(k => { gameState[k] = null; });
  gameState.ui.currentScreen = 'hub';
  gameState.ui.selectedSlot  = null;
  return true;
}

function hasSaveState()  { try { return localStorage.getItem(SAVE_KEY) != null; } catch (_) { return false; } }
function clearSaveState(){ try { localStorage.removeItem(SAVE_KEY); } catch (_) {} }
function autosave()      { if (_gameMode) saveState(); }

function loadPrefs()  { try { return JSON.parse(localStorage.getItem(PREFS_KEY)) || {}; } catch (_) { return {}; } }
function savePrefs(p) { try { localStorage.setItem(PREFS_KEY, JSON.stringify(Object.assign(loadPrefs(), p))); } catch (_) {} }

/* --- run lifecycle ------------------------------------------------------------ */

/* Re-render every always-on surface against the current gameState. Used after
   loadState() and startNewRun(). */
function refreshAllSurfaces() {
  renderHub(gameState);
  renderTray(gameState);
  renderTopBar({
    roomName:    'STATION HUB',
    food:        gameState.run.colonyFood,
    quota:       gameState.run.colonyQuota,
    actionCount: gameState.run.actionCount,
  });
  updateDeadTrayBadge(gameState.deadTray.length);
}

/* Tear the DOM back to a clean hub, wherever the player currently is —
   removes any room screen-layer + the run-summary modal, un-slides the hub. */
function resetStageToHub() {
  hideTooltip();
  const modal = document.querySelector('.harv-summary-modal');
  if (modal) modal.remove();
  closeAutopsyReview();
  const panel = document.getElementById('game-panel');
  if (panel) panel.querySelectorAll('.screen-layer').forEach(el => el.remove());
  const hub = document.getElementById('hub-layer');
  if (hub) {
    hub.style.display = '';
    Array.from(hub.classList).forEach(c => { if (c.startsWith('slide-to-')) hub.classList.remove(c); });
  }
  setActionZone([]);
  setSlotClickHandler(null);
  setTrayClickHint(null);
  gameState.ui.currentScreen = 'hub';
  gameState.ui.selectedSlot  = null;
}

/* Full restart-to-beginning: wipe the run AND the save, apply difficulty,
   land on a fresh hub with only the Seed Bank open. */
function startNewRun(difficultyId) {
  _runOverFired = false;
  _pendingHubUnlocks.length = 0;
  resetStageToHub();
  resetHubRooms(gameState, { clearTray: true });
  applyDifficulty(difficultyId || loadPrefs().difficulty || 'commander');
  savePrefs({ difficulty: gameState.run.difficulty });
  clearSaveState();
  refreshAllSurfaces();
  autosave();
}

/* Global lose watcher — deductFood (starved) and killPlant (last plant gone)
   call this from ANY room. The Harvest Bay owns its own end-of-run beat
   (collection animation → "View Run Summary" button), and a met quota is a
   WIN that only the Harvest Bay can produce, so both are excluded here. */
let _runOverFired = false;
function maybeEndRun(delayMs = 1400) {
  if (!_gameMode || _runOverFired) return;
  if (!gameState.tray.some(Boolean)) return;                            // run not started
  if (gameState.run.colonyFood >= gameState.run.colonyQuota) return;    // win — Harvest Bay's beat
  if (gameState.ui.currentScreen === 'room:center' &&
      gameState.centerRoom.mode === 'harvest') return;                  // Harvest Bay's beat
  if (!harvRunOver()) return;
  _runOverFired = true;
  setTimeout(() => { autosave(); openRunSummary(); }, delayMs);  // let death/resolve fx land
}

/* --- startup screen -----------------------------------------------------------
   Full-stage overlay: starfield + title + ▶ Continue (when a save exists) /
   ★ New Run → inline difficulty pick. Smallest thing that works (user call
   2026-07-18). opts.onStart('continue' | 'new') fires after the fade-out. */
function mountStartupScreen(opts = {}) {
  const stage = document.getElementById('stage');
  if (!stage) return null;
  const prev = stage.querySelector('.startup-layer');
  if (prev) prev.remove();

  const layer = document.createElement('div');
  layer.className = 'startup-layer';
  // Difficulty tooltips are single-line-per-fact (user call 2026-07-18) — widen
  // the tooltip cap while the title screen is up so no line wraps; restore after.
  stage.style.setProperty('--tt-max-width', '220px');

  const stars = document.createElement('div');
  stars.className = 'startup-stars';
  layer.appendChild(stars);

  const inner = document.createElement('div');
  inner.className = 'startup-inner';
  inner.innerHTML = `
    <div class="startup-kicker">COLONY AGRICULTURE PROGRAM</div>
    <div class="startup-title">STARSEED<br>STATION</div>
    <div class="startup-sub">grow the food · learn the science · feed the colony</div>
    <div class="startup-menu"></div>
  `;
  layer.appendChild(inner);
  const menu = inner.querySelector('.startup-menu');

  function dismiss(then) {
    layer.classList.add('fading');
    stage.style.removeProperty('--tt-max-width');
    setTimeout(() => { layer.remove(); if (then) then(); }, 650);
  }

  function showMainMenu() {
    menu.innerHTML = '';
    if (hasSaveState()) {
      const c = document.createElement('button');
      c.className = 'startup-btn primary';
      c.innerHTML = '▶ CONTINUE';
      c.addEventListener('click', () => {
        if (!loadState()) { showMainMenu(); return; }
        refreshAllSurfaces();
        dismiss(() => opts.onStart && opts.onStart('continue'));
      });
      menu.appendChild(c);
    }
    const n = document.createElement('button');
    n.className = 'startup-btn' + (hasSaveState() ? '' : ' primary');
    n.innerHTML = '★ NEW RUN';
    n.addEventListener('click', showDifficulty);
    menu.appendChild(n);
  }

  function showDifficulty() {
    menu.innerHTML = '<div class="startup-diff-label">CHOOSE YOUR POSTING</div>';
    const row = document.createElement('div');
    row.className = 'startup-diff-row';
    const current = loadPrefs().difficulty || 'commander';
    Object.entries(DIFFICULTY).forEach(([id, d]) => {
      const b = document.createElement('button');
      b.className = 'startup-btn diff' + (id === current ? ' suggested' : '');
      b.style.setProperty('--diff-rgb', d.rgb);
      b.innerHTML = `<span class="startup-btn-label">${d.label}</span>` +
                    `<span class="startup-btn-sub">${d.sub}</span>`;
      attachTooltip(b, () =>
        `<span class="tt-name" style="color: rgb(${d.rgb})">${d.label}</span>` +
        d.lines.map(l => `<span class="tt-row tt-line">${l}</span>`).join(''));
      b.addEventListener('click', () => {
        hideTooltip();
        startNewRun(id);
        dismiss(() => opts.onStart && opts.onStart('new'));
      });
      row.appendChild(b);
    });
    menu.appendChild(row);
    const back = document.createElement('button');
    back.className = 'startup-back';
    back.textContent = '← back';
    back.addEventListener('click', showMainMenu);
    menu.appendChild(back);
  }

  showMainMenu();
  stage.appendChild(layer);
  mountStarfield(stars, { count: 240, twinkle: true });
  return layer;
}


/* ============================================================================
   Demo 15b — Tutorial (coach-marks) system
   Spotlight scrim (SVG mask cutouts in any shape) + pixel text boxes with
   leader lines. Data-driven: TUTORIALS below is the whole content layer —
   steps reference live DOM ({el}) or baked stage coords ({rect|circle|poly}).
   Fires on FIRST visit per screen (seen-flags live in run state → saved with
   the run, wiped by New Run — classroom rule, user call 2026-07-18). Gated on
   _gameMode, so demo pages never see it. The top-bar ? replays the current
   screen's tour any time; SKIP ends one tour; the hub tour carries a one-time
   "skip all tutorials" link.
   ============================================================================ */

/* All coords are STAGE space (1280×720; game panel spans y 60–640).
   Shape kinds: {el:'.selector'} (resolved live, padded), {rect:{x,y,w,h}},
   {circle:{cx,cy,r}}, {poly:[[x,y],…]}. box:{x,y} overrides auto-placement. */
const TUTORIALS = {
  hub: [
    { shapes: [], box: { x: 474, y: 231 },
      text: '<b>WELCOME TO STARSEED STATION.</b><br>The colony is counting on you: raise 8 crop plants through the station\'s science rooms and harvest enough food to hit quota.' },
    { shapes: [{ el: '.tb-food' }],
      text: '<b>COLONY FOOD</b> is your budget AND your goal. Every room action costs 1 food. Reach the quota to win — if food hits 0 first, the colony starves.' },
    { shapes: [{ el: '#tray' }],
      text: 'Your plants ride here in <b>THE TRAY</b> — on every screen, always. Green pips are health; badges appear as you discover each plant\'s hidden traits.' },
    { shapes: [{ rect: { x: 495, y: 216, w: 288, h: 220 } }],
      text: 'Rooms unlock as you work. Start at the <b>SEED BANK</b> in the center — choose the 8 seeds you\'ll grow this run.' },
  ],
  'center-seedbank': [
    { shapes: [{ rect: { x: 210, y: 150, w: 826, h: 358 } }], box: { x: 378, y: 538 }, w: 520,
      text: 'Seed packets show a species\' <b>VISIBLE traits</b> — water, light, appetite, pollination. The rest stay hidden until you experiment in the rooms.' },
    { shapes: [{ el: '#tray' }],
      text: 'Click a packet to study it, then plant it into a tray slot. Fill all <b>8 slots</b>, then head back to the hub to begin the run.' },
  ],
  substrate: [
    { shapes: [],
      text: '<b>SUBSTRATE LAB</b> — what are we growing in? Space farms can\'t haul soil from Earth, so you pick each plant\'s growing medium.' },
    { shapes: [{ rect: { x: 217, y: 386, w: 797, h: 180 } }],
      text: 'Choose a spot, then a <b>SUBSTRATE</b>, then a seed. A wrong medium stresses roots — each plant\'s preference is learned by trying.' },
    { shapes: [{ el: '.action-zone' }], box: { x: 730, y: 517 },
      text: '<b>PLANT SEEDS</b> runs the experiment. It costs 1 food, and every participating plant grows one stage.' },
  ],
  water: [
    { shapes: [],
      text: '<b>PIPE MAZE</b> — water the crops from the station\'s recycled supply. Drought AND flood both hurt: match each plant\'s thirst.' },
    { shapes: [{ rect: { x: 80, y: 310, w: 150, h: 215 } }],
      text: 'The <b>WATER RESERVOIR</b> is your whole run\'s supply — the counter shows what\'s left, and every drop you send is gone for good.' },
    { shapes: [{ circle: { cx: 723, cy: 178, r: 42 } }, { circle: { cx: 723, cy: 296, r: 42 } },
               { circle: { cx: 723, cy: 470, r: 42 } }, { circle: { cx: 723, cy: 577, r: 42 } }],
      box: { x: 800, y: 300 },
      text: 'Set each port\'s <b>DIAL</b> to choose how much water that plant gets — its gauge previews the level in blue. No target marks: read the plant\'s thirst from its tray tooltip.' },
    { shapes: [{ el: '.action-zone' }],
      text: '<b>PRESSURIZE</b> sends the water: 1 food, and every watered plant grows a stage.' },
  ],
  light: [
    { shapes: [],
      text: '<b>LIGHT LAB</b> — plants eat light. Spectrum color AND day-length both matter here.' },
    { shapes: [{ poly: [[17, 96], [30, 79], [400, 79], [414, 96], [414, 596], [17, 596]] },
               { poly: [[460, 79], [819, 79], [833, 98], [832, 595], [445, 595], [445, 96]] },
               { poly: [[879, 79], [1249, 79], [1264, 96], [1264, 595], [865, 595], [864, 96]] }],
      box: { x: 480, y: 280 },
      text: 'The lab has <b>THREE ZONES</b>, each with its own light recipe. Click a bench spot, then a plant — up to three plants per zone, and everyone in a zone shares its settings.' },
    { shapes: [{ rect: { x: 276, y: 147, w: 44, h: 92 } }, { rect: { x: 696, y: 147, w: 44, h: 92 } },
               { rect: { x: 1114, y: 147, w: 44, h: 92 } }],
      box: { x: 450, y: 300 }, line: false,
      text: 'Each zone\'s <b>SPECTRUM slider</b>: Blue at the top, Balanced in the middle, Red at the bottom. Match what the plant asks for — Balanced is the safe hedge.' },
    { shapes: [{ circle: { cx: 347, cy: 199, r: 36 } }, { circle: { cx: 766, cy: 199, r: 36 } },
               { circle: { cx: 1185, cy: 199, r: 36 } }],
      box: { x: 450, y: 300 }, line: false,
      text: 'The <b>24-HOUR DIAL</b> sets each zone\'s day-length. Some plants only flower at the right hours — and that trigger stays hidden until you find it.' },
    { shapes: [{ el: '.action-zone' }],
      text: '<b>RUN LIGHT CYCLE</b>: 1 food, and participating plants grow a stage.' },
  ],
  nutrients: [
    { shapes: [], box: { x: 481, y: 265 },
      text: '<b>MIXING CONSOLE</b> — fertilizer chemistry. N-P-K: nitrogen for leaves, phosphorus for roots, potassium for fruit.' },
    { shapes: [{ rect: { x: 230, y: 422, w: 214, h: 70 } }, { rect: { x: 524, y: 422, w: 218, h: 70 } },
               { rect: { x: 824, y: 422, w: 216, h: 70 } }],
      box: { x: 480, y: 200 }, line: false,
      text: 'Each feeding zone mixes ONE recipe with its three <b>N-P-K DIALS</b>. Group plants with similar <b>APPETITE</b> into a zone, then dial its mix — underfeeding causes deficiency; overfeeding BURNS roots.' },
    { shapes: [{ el: '.action-zone' }], box: { x: 731, y: 531 },
      text: '<b>FEED</b> delivers the batch. This is a boost room — it costs 1 food, but plants do NOT age here.' },
  ],
  orientation: [
    { shapes: [], box: { x: 458, y: 271 },
      text: '<b>ORIENTATION CHAMBER</b> — which way is up? Roots follow gravity, and in orbit some plants get confused.' },
    { shapes: [{ circle: { cx: 378, cy: 475, r: 42 } }, { circle: { cx: 537, cy: 475, r: 42 } },
               { circle: { cx: 696, cy: 475, r: 42 } }, { circle: { cx: 855, cy: 475, r: 42 } }],
      box: { x: 458, y: 170 }, line: false,
      text: 'Press a chamber\'s <b>ROTATE button</b> to turn the PLANT inside it — the chamber stays put, the plant spins. Set each one the way it likes, then confirm to reveal its <b>gravity response</b>. A boost room: no aging.' },
  ],
  hydroponics: [
    { shapes: [], box: { x: 494, y: 194 },
      text: '<b>HYDROPONIC BAY</b> — soil-free growing in nutrient water. Only plants raised on <b>AGAR GEL</b> with a known gravity response may enter.' },
    { shapes: [{ rect: { x: 346, y: 135, w: 174, h: 159 } }, { rect: { x: 778, y: 135, w: 171, h: 159 } }],
      box: { x: 493, y: 317 }, line: false,
      text: 'Each channel\'s wall gauges track <b>pH</b> and <b>EC</b>. pH = how acidic or alkaline the water is — too far off and roots can\'t take up nutrients at all. EC = how concentrated those nutrients are.' },
    { shapes: [{ rect: { x: 555, y: 319, w: 193, h: 64 } }, { rect: { x: 515, y: 473, w: 275, h: 78 } }],
      box: { x: 205, y: 283 }, line: false,
      text: 'Each channel has its own set of <b>adjustment buttons</b> — tap them to nudge that channel\'s pH and EC, and watch the gauges respond.' },
    { shapes: [{ el: '.action-zone' }], box: { x: 728, y: 551 },
      text: '<b>LOCK IN</b> commits your tune-up. Boost room: 1 food, no aging.' },
  ],
  radiation: [
    { shapes: [], box: { x: 478, y: 314 },
      text: '<b>RADIATION DOME</b> — deep space is hostile. Test your shielding before the storms test it for you.' },
    { shapes: [{ rect: { x: 275, y: 349, w: 136, h: 158 } }, { rect: { x: 444, y: 348, w: 136, h: 158 } },
               { rect: { x: 615, y: 349, w: 136, h: 158 } }, { rect: { x: 788, y: 349, w: 136, h: 158 } }],
      box: { x: 436, y: 162 }, line: false,
      text: 'Click a <b>BAY</b>, then a plant to seat it — each of the four bays holds one plant for the exposure test.' },
    { shapes: [{ poly: [[79, 120], [203, 149], [204, 507], [79, 543]] }], box: { x: 234, y: 232 },
      text: 'Then pick a <b>SHIELD MATERIAL</b> from the wall rack to cover that bay. Materials block different amounts — water and regolith are the surprise champions.' },
    { shapes: [{ el: '.action-zone' }], box: { x: 723, y: 517 },
      text: '<b>RUN EXPOSURE</b> fires the source and reveals radiation tolerance. Unshielded bays are a gamble.' },
  ],
  pollination: [
    { shapes: [], box: { x: 480, y: 282 },
      text: '<b>POLLINATION DOME</b> — no bees in space unless you bring them. This is the station\'s only <b>REAL-TIME</b> room.' },
    { shapes: [{ circle: { cx: 190, cy: 343, r: 26 } }, { circle: { cx: 318, cy: 319, r: 26 } },
               { circle: { cx: 451, cy: 314, r: 26 } }, { circle: { cx: 582, cy: 311, r: 26 } },
               { circle: { cx: 696, cy: 312, r: 26 } }, { circle: { cx: 827, cy: 307, r: 26 } },
               { circle: { cx: 956, cy: 327, r: 26 } }, { circle: { cx: 1094, cy: 345, r: 26 } }],
      box: { x: 486, y: 369 }, line: false,
      text: 'Every plant gets a <b>BLOOM TIMER</b> — the ring above it drains green → amber → red while its flower is open. Pollinate before it empties: a bloom that closes unpollinated sets <b>NO fruit, ever</b>.' },
    { shapes: [{ poly: [[30, 161], [102, 175], [102, 457], [30, 469]] }], w: 400,
      text: 'Three <b>TOOLS</b>, one per pollinator type. <b>Brush</b> — click it, then a self-pollinating bloom. <b>Bee-Bot</b> — click insect blooms to queue a flight. <b>Fan</b> — mounts above the bench and gusts the wind blooms. Wrong tool, no effect.' },
    { shapes: [{ el: '.action-zone' }], box: { x: 730, y: 551 },
      text: '<b>BEGIN</b> starts every timer at once. Miss a bloom and that plant sets NO fruit — ever.' },
  ],
  'center-harvest': [
    { shapes: [], box: { x: 477, y: 203 },
      text: '<b>HARVEST ROOM</b> — payday. Ripe plants send their produce down the chute, and the colony meter fills.' },
    { shapes: [{ el: '.action-zone' }], box: { x: 730, y: 499 },
      text: '<b>COLLECT HARVEST</b> cashes out every harvestable plant — free, no aging. Yield = health × pollination × light care. Hit quota and the colony eats.' },
  ],
};

const TUT_PAD = 8;          // padding around {el} highlights
const TUT_BOX_W = 320;      // default text-box width

/* Live tour state — exposed (with tutRerenderStep) for the 15b tuning tool. */
let _tutState = null;   // { key, idx, layer, svg }

function tutTourKeyForScreen(screenId) {
  if (!screenId || screenId === 'hub') return 'hub';
  const key = screenId.replace(/^room:/, '');
  if (key === 'center') {
    return gameState.centerRoom.mode === 'harvest' ? 'center-harvest' : 'center-seedbank';
  }
  return key;
}

/* Resolve one authored shape into stage coords (or null if unresolvable). */
function tutResolveShape(shape) {
  if (shape.el) {
    const el = document.querySelector(shape.el);
    if (!el) return null;
    const r = stageLocalRect(el);
    if (!r || r.w < 2 || r.h < 2) return null;
    return { kind: 'rect', x: r.left - TUT_PAD, y: r.top - TUT_PAD, w: r.w + TUT_PAD * 2, h: r.h + TUT_PAD * 2 };
  }
  if (shape.rect)   return { kind: 'rect',   x: shape.rect.x, y: shape.rect.y, w: shape.rect.w, h: shape.rect.h };
  if (shape.circle) return { kind: 'circle', cx: shape.circle.cx, cy: shape.circle.cy, r: shape.circle.r };
  if (shape.poly)   return { kind: 'poly',   points: shape.poly };
  return null;
}

function tutShapeBBox(s) {
  if (s.kind === 'rect')   return { x: s.x, y: s.y, w: s.w, h: s.h };
  if (s.kind === 'circle') return { x: s.cx - s.r, y: s.cy - s.r, w: s.r * 2, h: s.r * 2 };
  const xs = s.points.map(p => p[0]), ys = s.points.map(p => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

function tutShapeSvg(s, attrs) {
  if (s.kind === 'rect')
    return `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="8" ${attrs}/>`;
  if (s.kind === 'circle')
    return `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" ${attrs}/>`;
  return `<polygon points="${s.points.map(p => p.join(',')).join(' ')}" ${attrs}/>`;
}

/* maybeShowTour — the gated entry point. First visit per screen, game only. */
function maybeShowTour(key) {
  if (!_gameMode) return;
  if (!TUTORIALS[key] || !TUTORIALS[key].length) return;
  const run = gameState.run;
  if (run.tutorialSkipAll) return;
  if (run.tutorialSeen && run.tutorialSeen[key]) return;
  if (document.querySelector('.startup-layer')) return;      // title card is up
  if (document.querySelector('.harv-summary-modal')) return; // run-over beat owns the screen
  if (_tutState) return;                                     // a tour is already open
  showTour(key);
}

/* showTour — build the overlay and walk the steps. Replay-safe (the top-bar ?
   calls this directly, bypassing seen-flags). Marks the tour seen on OPEN so a
   mid-tour skip still counts. */
function showTour(key) {
  const steps = TUTORIALS[key];
  const stage = document.getElementById('stage');
  if (!steps || !steps.length || !stage) return;
  closeTour();

  if (!gameState.run.tutorialSeen) gameState.run.tutorialSeen = {};
  gameState.run.tutorialSeen[key] = true;

  const layer = document.createElement('div');
  layer.className = 'tut-layer';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 1280 720');
  svg.setAttribute('class', 'tut-svg');
  layer.appendChild(svg);
  stage.appendChild(layer);

  _tutState = { key, idx: 0, layer, svg };
  layer.addEventListener('click', e => {
    // Scrim clicks advance (standard coach-marks); box buttons handle themselves.
    if (e.target === layer || e.target === svg || e.target.classList.contains('tut-scrim')) tutNext();
  });
  document.addEventListener('keydown', tutKeydown);
  tutRerenderStep();
}

function tutKeydown(e) {
  if (!_tutState) return;
  if (e.key === 'Escape') { e.preventDefault(); closeTour(); }
  else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tutNext(); }
}

function tutNext() {
  if (!_tutState) return;
  if (_tutState.idx >= TUTORIALS[_tutState.key].length - 1) { closeTour(); return; }
  _tutState.idx += 1;
  tutRerenderStep();
}

function closeTour() {
  if (!_tutState) return;
  document.removeEventListener('keydown', tutKeydown);
  _tutState.layer.remove();
  _tutState = null;
  autosave();
}

/* Render the current step: scrim with mask holes + pulsing outlines + text box
   + leader line. Re-entrant — the 15b tool calls it after mutating step data. */
function tutRerenderStep() {
  if (!_tutState) return;
  const { key, idx, layer, svg } = _tutState;
  const steps = TUTORIALS[key];
  const step = steps[idx];
  const shapes = (step.shapes || []).map(tutResolveShape).filter(Boolean);

  const holes    = shapes.map(s => tutShapeSvg(s, 'fill="#000"')).join('');
  const outlines = shapes.map(s =>
    tutShapeSvg(s, 'class="tut-halo" fill="none"') +
    tutShapeSvg(s, 'class="tut-outline" fill="none"')).join('');
  svg.innerHTML =
    `<defs><mask id="tut-mask">` +
    `<rect x="0" y="0" width="1280" height="720" fill="#fff"/>${holes}</mask></defs>` +
    `<rect class="tut-scrim" x="0" y="0" width="1280" height="720" mask="url(#tut-mask)"/>` +
    outlines;

  // --- text box -------------------------------------------------------------
  let box = layer.querySelector('.tut-box');
  if (box) box.remove();
  box = document.createElement('div');
  box.className = 'tut-box';
  const last = idx === steps.length - 1;
  const dots = steps.length > 1
    ? `<div class="tut-dots">${steps.map((_, i) => `<span class="${i === idx ? 'on' : ''}"></span>`).join('')}</div>`
    : '';
  box.innerHTML =
    `<div class="tut-text">${step.text}</div>${dots}` +
    `<div class="tut-btns">` +
    `<button class="tut-skip" type="button">SKIP</button>` +
    `<button class="tut-next" type="button">${last ? '✓ GOT IT' : 'NEXT ▸'}</button>` +
    `</div>` +
    (key === 'hub' ? `<button class="tut-skip-all" type="button">skip all tutorials</button>` : '');
  box.style.width = (step.w || TUT_BOX_W) + 'px';
  layer.appendChild(box);
  box.querySelector('.tut-next').addEventListener('click', tutNext);
  box.querySelector('.tut-skip').addEventListener('click', closeTour);
  const skipAll = box.querySelector('.tut-skip-all');
  if (skipAll) skipAll.addEventListener('click', () => {
    gameState.run.tutorialSkipAll = true;
    closeTour();
  });

  // --- placement --------------------------------------------------------------
  const bw = box.offsetWidth, bh = box.offsetHeight;
  let bx, by;
  if (step.box) {
    bx = step.box.x; by = step.box.y;
  } else if (shapes.length) {
    const bb = tutShapeBBox(shapes[0]);
    bx = bb.x + bb.w + 26;                                   // try right of the highlight
    by = Math.round(bb.y + bb.h / 2 - bh / 2);
    if (bx + bw > 1268) bx = bb.x - 26 - bw;                 // …else left
    if (bx < 12) {                                            // …else below / above
      bx = Math.round(Math.min(Math.max(bb.x + bb.w / 2 - bw / 2, 12), 1268 - bw));
      by = bb.y + bb.h + 26;
      if (by + bh > 708) by = bb.y - 26 - bh;
    }
    by = Math.min(Math.max(by, 70), 708 - bh);
  } else {
    bx = Math.round((1280 - bw) / 2);                        // no target — center card
    by = Math.round(280 - bh / 2);
  }
  box.style.left = bx + 'px';
  box.style.top  = by + 'px';

  // --- leader line (per-step opt-out: line: false) -------------------------------
  if (shapes.length && step.line !== false) {
    const bb = tutShapeBBox(shapes[0]);
    const ax = Math.min(Math.max(bb.x + bb.w / 2, bx), bx + bw);      // box anchor nearest target
    const ay = Math.min(Math.max(bb.y + bb.h / 2, by), by + bh);
    const tx = Math.min(Math.max(ax, bb.x), bb.x + bb.w);             // target perimeter point
    const ty = Math.min(Math.max(ay, bb.y), bb.y + bb.h);
    if (Math.hypot(tx - ax, ty - ay) > 18) {
      svg.innerHTML += `<line class="tut-line" x1="${ax}" y1="${ay}" x2="${tx}" y2="${ty}"/>` +
                       `<circle class="tut-line-dot" cx="${tx}" cy="${ty}" r="3.5"/>`;
    }
  }
}

/* Replay the current screen's tour on demand — the top-bar ? button. */
function replayCurrentTour() {
  const key = tutTourKeyForScreen(gameState.ui.currentScreen);
  if (TUTORIALS[key]) showTour(key);
}
