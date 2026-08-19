/**
 * Tilted mosaic of pixels that sits in the bottom-left of a hero card preview.
 * Cell opacity is pseudo-random but seeded, so the server and client render
 * identical markup — Math.random() here would trip hydration.
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
 * --pixel is the body colour, --pixel-hi the occasional bright cell.
 *
 * The six hues point at Tailwind's own palette rather than literal hexes, so a
 * card and the HeroTermBadge naming it resolve to one definition instead of two
 * that drift. That matters here: these were hand-written v3 hexes, and v4
 * re-derived the palette in oklch — its sky-400 is #00bcfe, not #38bdf8. The
 * 400 level is the band that survives both themes without a `dark:` override.
 *
 * `black` keeps literals: it has no hue to match, and it's the one theme that
 * must inverts in dark mode, where near-black pixels would vanish.
 *
 * COUPLING: --color-*-400 only reaches the stylesheet because HeroTermBadge
 * generates `bg-*-400/12` and `ring-*-400/30` for these same six hues; Tailwind
 * emits theme variables only for palette entries some utility actually uses.
 * Drop a badge colour and this grid loses it too, so the fallbacks below are
 * the v4 values, not decoration.
 *
 * Key ORDER is load-bearing: the seed below is derived from a key's index, so
 * new themes go on the end. Inserting one earlier reshuffles the mosaic on
 * every card after it.
 */
const THEME_VARS: Record<HeroPixelTheme, string> = {
  sky: "[--pixel:var(--color-sky-400,#00bcfe)] [--pixel-hi:#ffffff]",
  green: "[--pixel:var(--color-green-400,#05df72)] [--pixel-hi:#ffffff]",
  black:
    "[--pixel:#171717] [--pixel-hi:#000000] dark:[--pixel:#e5e5e5] dark:[--pixel-hi:#ffffff]",
  yellow: "[--pixel:var(--color-yellow-400,#fac800)] [--pixel-hi:#ffffff]",
  violet: "[--pixel:var(--color-violet-400,#a685ff)] [--pixel-hi:#ffffff]",
  rose: "[--pixel:var(--color-rose-400,#ff667f)] [--pixel-hi:#ffffff]",
  orange: "[--pixel:var(--color-orange-400,#ff8b1a)] [--pixel-hi:#ffffff]",
};

const COLS = 18;
const ROWS = 10;
const CELL_PX = 13;
const GAP_PX = 2;

/** Integer hash — exact across engines, unlike anything built on Math.sin. */
function seededRandom(seed: number): number {
  let x = Math.imul(seed + 1, 2654435761);
  x ^= x >>> 15;
  x = Math.imul(x, 2246822519);
  x ^= x >>> 13;
  return (x >>> 0) / 4294967296;
}

export function HeroPixelGrid({ theme }: { theme: HeroPixelTheme }) {
  // Offsetting the seed per theme keeps the cards from sharing a pattern.
  const seedBase = Object.keys(THEME_VARS).indexOf(theme) * 7919;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden rounded-lg ${THEME_VARS[theme]}`}
    >
      {/* Washes the whole preview in the card's hue so the mosaic reads as
          sitting on a tinted surface rather than floating on grey. */}
      <div className="absolute inset-0 bg-(--pixel) opacity-[0.07]" />

      {/* Anchored past the bottom-left corner and tilted, so the grid bleeds
          off both edges instead of ending on a visible seam. */}
      <div
        className="absolute -bottom-5 -left-6 origin-bottom-left rotate-[7deg]"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${CELL_PX}px)`,
          gridAutoRows: `${CELL_PX}px`,
          gap: `${GAP_PX}px`,
        }}
      >
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const t = seededRandom(seedBase + i);
          // Roughly one cell in eight is a highlight; the rest sit in a mid
          // band so the bright ones actually read as bright.
          const isHighlight = t > 0.88;
          const rest = isHighlight ? 0.85 + t * 0.15 : 0.16 + t * 0.64;

          // Three more draws per cell, each on its own seed offset, so the
          // blink's direction, tempo, and phase don't correlate with the
          // cell's resting opacity — otherwise the bright cells would all
          // twinkle in step.
          const dir = seededRandom(seedBase + i + 5000);
          const speed = seededRandom(seedBase + i + 9000);
          const phase = seededRandom(seedBase + i + 13000);

          // Half the cells brighten, half dim. Both directions running at once
          // is what reads as twinkling rather than a single pulse.
          const active =
            dir > 0.5 ? Math.min(1, rest + 0.45) : Math.max(0.06, rest - 0.35);

          return (
            <div
              key={i}
              className="hero-pixel rounded-[2px]"
              style={{
                backgroundColor: isHighlight
                  ? "var(--pixel-hi)"
                  : "var(--pixel)",
                ["--pixel-o" as string]: rest,
                ["--pixel-o-active" as string]: active,
                ["--pixel-dur" as string]: `${0.8 + speed * 1.2}s`,
                ["--pixel-delay" as string]: `${phase * 0.9}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
