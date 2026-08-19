/**
 * The mosaic programme.
 *
 * Every hero card's preview is the same design executed with different
 * parameters, rather than seven designs that happen to share a colour. What
 * makes them read as one family is the set of things that DON'T vary:
 *
 *   · square cells with hard 2px corners — the pixel is the atom
 *   · the grid bleeds off two edges, never sits as a contained rectangle
 *   · sparse white highlights as the single bright accent
 *   · motion is hover-gated — a reward, never ambience
 *   · one hue per card; colour identifies, geometry differentiates
 *
 * Break one of those and it stops being a system. Everything below is what's
 * allowed to move.
 *
 * NB `density` is authored per catalog as a character value — deliberately NOT
 * derived from how many items the catalog holds. A mark whose weight drifts as
 * the library grows is a readout, not an identity.
 */

export type HeroPixelTheme =
  | "sky"
  | "green"
  | "black"
  | "yellow"
  | "violet"
  | "rose"
  | "orange";

/**
 * How a mosaic behaves on hover. Each kind is a different rule for deriving the
 * three per-cell CSS variables the keyframe reads, not a different keyframe —
 * so adding one costs arithmetic, not stylesheet.
 */
export type MosaicMotion =
  | "wave" // delay from angle about the centre — rotational
  | "sweep-row" // delay from row index — horizontal bands
  | "burst" // delay quantised to a few buckets — groups fire together
  | "cluster" // delay per rectangular super-block — assembly
  | "toggle" // two buckets, opposite directions — discrete states
  | "drift" // long and shallow — painterly
  | "none"; // holds still, on purpose

export interface MosaicProgramme {
  /** Tailwind arbitrary-property string setting --pixel and --pixel-hi. */
  hue: string;
  cols: number;
  rows: number;
  /** Cell edge in px. `cellW` overrides the horizontal edge where they differ. */
  cell: number;
  cellW?: number;
  gap: number;
  /** Degrees. 0 reads static — which is the point for `designs`. */
  tilt: number;
  /** 0–1. Proportion of cells sitting in the upper half of the opacity band. */
  density: number;
  /** 0–1. Cells above this draw as a bright highlight. Higher = rarer. */
  highlight: number;
  motion: MosaicMotion;
  /**
   * Explicit, so the pattern is pinned to the catalog rather than to this
   * object's key order. The previous version derived it from an indexOf(), which
   * silently reshuffled every card after any theme inserted above it.
   */
  seed: number;
}

/**
 * --pixel is the body colour, --pixel-hi the occasional bright cell.
 *
 * The six hues point at Tailwind's own palette rather than literal hexes, so a
 * card and the HeroTermBadge naming it resolve to one definition instead of two
 * that drift — v4 re-derived the palette in oklch, so its sky-400 is #00bcfe,
 * not v3's #38bdf8. The 400 level survives both themes without a `dark:`
 * override.
 *
 * `black` keeps literals: no hue to match, and it's the one theme that must
 * invert in dark mode, where near-black pixels would vanish.
 *
 * COUPLING: --color-*-400 only reaches the stylesheet because HeroTermBadge
 * generates `bg-*-400/12` and `ring-*-400/30` for these same six hues; Tailwind
 * emits a theme variable only for palette entries some utility actually uses.
 * Drop a badge colour and this grid falls back, so the hex fallbacks are load
 * bearing, not decoration.
 */
const HUES: Record<HeroPixelTheme, string> = {
  sky: "[--pixel:var(--color-sky-400,#00bcfe)] [--pixel-hi:#ffffff]",
  green: "[--pixel:var(--color-green-400,#05df72)] [--pixel-hi:#ffffff]",
  black:
    "[--pixel:#171717] [--pixel-hi:#000000] dark:[--pixel:#e5e5e5] dark:[--pixel-hi:#ffffff]",
  yellow: "[--pixel:var(--color-yellow-400,#fac800)] [--pixel-hi:#ffffff]",
  violet: "[--pixel:var(--color-violet-400,#a685ff)] [--pixel-hi:#ffffff]",
  rose: "[--pixel:var(--color-rose-400,#ff667f)] [--pixel-hi:#ffffff]",
  orange: "[--pixel:var(--color-orange-400,#ff8b1a)] [--pixel-hi:#ffffff]",
};

/**
 * One parameter set per catalog. The theme key is the catalog's colour name for
 * historical reasons; the comment on each row names the catalog it dresses.
 *
 * Cell budget: these total ~1,150 nodes across the seven, against ~1,440 before.
 * Keep it under ~1,600 — every cell is a DOM node with four inline custom
 * properties, and they all mount on first paint.
 */
export const MOSAIC_PROGRAMMES: Record<HeroPixelTheme, MosaicProgramme> = {
  // Blocks — few large units, assembling into rectangles.
  black: {
    hue: HUES.black,
    cols: 8,
    rows: 5,
    cell: 20,
    gap: 3,
    tilt: 6,
    density: 0.55,
    highlight: 0.88,
    motion: "cluster",
    seed: 0,
  },
  // Sections — wide flat bands, page-width by definition.
  violet: {
    hue: HUES.violet,
    cols: 6,
    rows: 9,
    cell: 9,
    cellW: 22,
    gap: 2,
    tilt: 3,
    density: 0.7,
    highlight: 0.9,
    motion: "sweep-row",
    seed: 7919,
  },
  // Icons — many small marks, blinking in bursts.
  green: {
    hue: HUES.green,
    cols: 22,
    rows: 12,
    cell: 9,
    gap: 2,
    tilt: 8,
    density: 0.45,
    highlight: 0.86,
    motion: "burst",
    seed: 15838,
  },
  // Loaders — rotational and continuous.
  sky: {
    hue: HUES.sky,
    cols: 16,
    rows: 10,
    cell: 13,
    gap: 2,
    tilt: 10,
    density: 0.6,
    highlight: 0.88,
    motion: "wave",
    seed: 23757,
  },
  // UI components — mixed scale, discrete on/off states.
  rose: {
    hue: HUES.rose,
    cols: 12,
    rows: 7,
    cell: 15,
    gap: 3,
    tilt: 5,
    density: 0.65,
    highlight: 0.87,
    motion: "toggle",
    seed: 31676,
  },
  // Illustrations — loose and painterly, barely moving.
  yellow: {
    hue: HUES.yellow,
    cols: 10,
    rows: 6,
    cell: 18,
    gap: 4,
    tilt: 2,
    density: 0.8,
    highlight: 0.92,
    motion: "drift",
    seed: 39595,
  },
  // Designs — the static catalog. Holding still IS the statement: this is the
  // one that ships no JavaScript, and the card says so by refusing to move.
  orange: {
    hue: HUES.orange,
    cols: 10,
    rows: 6,
    cell: 18,
    gap: 4,
    tilt: 0,
    density: 0.85,
    highlight: 0.93,
    motion: "none",
    seed: 47514,
  },
};
