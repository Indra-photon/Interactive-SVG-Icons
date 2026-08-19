/**
 * Tilted mosaic of pixels in the corner of a hero card preview.
 *
 * This file is only the executor — every value it draws with comes from
 * lib/mosaic-programme.ts, where the seven parameter sets live alongside the
 * invariants they're allowed to vary against.
 *
 * Cell opacity is pseudo-random but seeded, so server and client render
 * identical markup — Math.random() here would trip hydration.
 */

import {
  MOSAIC_PROGRAMMES,
  type HeroPixelTheme,
  type MosaicMotion,
  type MosaicProgramme,
} from "@/lib/mosaic-programme";

export type { HeroPixelTheme };

/** Integer hash — exact across engines, unlike anything built on Math.sin. */
function seededRandom(seed: number): number {
  let x = Math.imul(seed + 1, 2654435761);
  x ^= x >>> 15;
  x = Math.imul(x, 2246822519);
  x ^= x >>> 13;
  return (x >>> 0) / 4294967296;
}

/** Per-cell animation timing. `null` means this cell never animates. */
interface CellMotion {
  durationS: number;
  delayS: number;
  /** true = brightens on hover, false = dims. */
  brightens: boolean;
}

/**
 * Turn a cell's grid position and its own random draws into timing.
 *
 * Every kind writes the same three CSS variables the keyframe reads — what
 * changes is where the delay comes from, and that's the whole difference
 * between twinkling, sweeping and assembling. Keeping it arithmetic rather than
 * seven keyframes is what makes adding a kind cheap.
 */
function cellMotion(
  motion: MosaicMotion,
  { col, row, cols, rows }: { col: number; row: number; cols: number; rows: number },
  draws: { dir: number; speed: number; phase: number },
): CellMotion | null {
  const { dir, speed, phase } = draws;

  switch (motion) {
    // Delay from the angle about the grid's centre, so brightness travels
    // round rather than across — the only kind that reads as rotation.
    case "wave": {
      const angle = Math.atan2(row - (rows - 1) / 2, col - (cols - 1) / 2);
      const turns = (angle + Math.PI) / (2 * Math.PI); // 0..1
      return { durationS: 1.1, delayS: turns * 1.2, brightens: true };
    }

    // Delay from the row alone. Whole bands move together, which is what a
    // page-width section is.
    case "sweep-row":
      return {
        durationS: 1.0,
        delayS: (row / Math.max(1, rows - 1)) * 0.9,
        brightens: true,
      };

    // Delay quantised to four buckets so cells fire in groups, not as a
    // continuous shimmer. Short and sharp.
    case "burst": {
      const bucket = Math.floor(phase * 4);
      return { durationS: 0.45, delayS: bucket * 0.22, brightens: dir > 0.4 };
    }

    // Delay per rectangular super-block, so the grid assembles in chunks the
    // size of the blocks it stands for.
    case "cluster": {
      const block = Math.floor(col / 3) + Math.floor(row / 2) * 3;
      return { durationS: 0.9, delayS: (block % 5) * 0.14, brightens: true };
    }

    // Two buckets running opposite directions — half on, half off, switching.
    case "toggle":
      return {
        durationS: 0.85,
        delayS: phase > 0.5 ? 0.3 : 0,
        brightens: phase > 0.5,
      };

    // Long and shallow. Present, but you have to look to catch it.
    case "drift":
      return { durationS: 2.6 + speed * 1.4, delayS: phase * 2.0, brightens: dir > 0.5 };

    case "none":
      return null;
  }
}

export function HeroPixelGrid({ theme }: { theme: HeroPixelTheme }) {
  const p: MosaicProgramme = MOSAIC_PROGRAMMES[theme];
  const cellW = p.cellW ?? p.cell;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden rounded-lg ${p.hue}`}
    >
      {/* Washes the whole preview in the card's hue so the mosaic reads as
          sitting on a tinted surface rather than floating on grey. */}
      <div className="absolute inset-0 bg-(--pixel) opacity-[0.07]" />

      {/* Anchored past the bottom-left corner and tilted, so the grid bleeds
          off both edges instead of ending on a visible seam.
          Tilt is an inline style, not `rotate-[Ndeg]`: an interpolated Tailwind
          class is never generated, because the JIT scans source text. */}
      <div
        className="absolute -bottom-5 -left-6 origin-bottom-left"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${p.cols}, ${cellW}px)`,
          gridAutoRows: `${p.cell}px`,
          gap: `${p.gap}px`,
          transform: `rotate(${p.tilt}deg)`,
        }}
      >
        {Array.from({ length: p.cols * p.rows }, (_, i) => {
          const col = i % p.cols;
          const row = Math.floor(i / p.cols);

          const t = seededRandom(p.seed + i);
          const isHighlight = t > p.highlight;

          // `density` biases where the body cells sit in the opacity band: at
          // 0.45 most are faint and the mosaic reads sparse, at 0.85 most are
          // near-solid and it reads dense. The band never collapses, so even
          // the densest set keeps some internal texture.
          const floor = 0.1 + p.density * 0.35;
          const span = 0.28 + p.density * 0.42;
          const rest = isHighlight ? 0.85 + t * 0.15 : floor + t * span;

          // Three more draws, each on its own seed offset, so a cell's tempo
          // and phase don't correlate with its resting opacity — otherwise the
          // bright cells would all move in step.
          const dir = seededRandom(p.seed + i + 5000);
          const speed = seededRandom(p.seed + i + 9000);
          const phase = seededRandom(p.seed + i + 13000);

          const m = cellMotion(
            p.motion,
            { col, row, cols: p.cols, rows: p.rows },
            { dir, speed, phase },
          );

          const active = m?.brightens
            ? Math.min(1, rest + 0.45)
            : Math.max(0.06, rest - 0.35);

          return (
            <div
              key={i}
              className={`hero-pixel rounded-[2px]${m ? "" : " hero-pixel--still"}`}
              style={{
                backgroundColor: isHighlight
                  ? "var(--pixel-hi)"
                  : "var(--pixel)",
                ["--pixel-o" as string]: rest,
                // Timing vars only when the cell actually moves. Omitting them
                // is not enough on its own to stop it — the keyframe's `to`
                // falls back to opacity 1 — hence the --still class above.
                ...(m && {
                  ["--pixel-o-active" as string]: active,
                  ["--pixel-dur" as string]: `${m.durationS}s`,
                  ["--pixel-delay" as string]: `${m.delayS}s`,
                }),
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
