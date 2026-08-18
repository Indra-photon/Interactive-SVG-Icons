// Extracted from the feature-ai-01 section, where this diagram anchors the
// header. Registry items ship as one self-contained file to a consumer's
// project, so the isometric helpers below are duplicated here rather than
// imported from the section — a shared module would arrive as a second file the
// consumer never asked for, and a dangling import if they install only one.
//
// No motion: the diagram is drawn once and holds still.

interface GpuInfrastructureProps {
  /** Additional classes on the <svg> root. */
  className?: string;
}

// ─── Isometric projection ─────────────────────────────────────────────────────
//
// A true 2:1 isometric would use k = 0.5; 0.866 (cos 30°) gives the taller,
// squarer cabinet look. ISO_S is the unit size in px, ISO_OX/OY the origin —
// tuned so the finished stack sits centred in the 420×450 viewBox.

const ISO_K = 0.8660254;
const ISO_S = 13;
const ISO_OX = 190;
const ISO_OY = 250;

type Pt = readonly [number, number];

const p = (x: number, y: number, z = 0): Pt => [
  (x - y) * ISO_K * ISO_S + ISO_OX,
  ((x + y) / 2 - z) * ISO_S + ISO_OY,
];

const poly = (pts: Pt[], close = true) =>
  pts
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ") + (close ? "Z" : "");

/**
 * Same as poly(), but every corner is cut back by `r` and rejoined with a
 * quadratic through the original vertex. Rounding the projected polygon rather
 * than applying a corner radius in 3D is what keeps the bevel visually equal on
 * all three faces — the faces are foreshortened differently, so a radius
 * applied before projection would come out uneven.
 */
const roundPoly = (pts: Pt[], r = 4) => {
  const n = pts.length;
  const lerp = (a: Pt, b: Pt, t: number): Pt => [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
  ];
  const at = (a: Pt, b: Pt) => {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    return Math.min(0.5, r / (len || 1));
  };
  let d = "";
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n];
    const cur = pts[i];
    const next = pts[(i + 1) % n];
    const a = lerp(cur, prev, at(cur, prev));
    const b = lerp(cur, next, at(cur, next));
    d +=
      i === 0
        ? `M${a[0].toFixed(2)} ${a[1].toFixed(2)}`
        : `L${a[0].toFixed(2)} ${a[1].toFixed(2)}`;
    d += `Q${cur[0].toFixed(2)} ${cur[1].toFixed(2)} ${b[0].toFixed(2)} ${b[1].toFixed(2)}`;
  }
  return d + "Z";
};

const quad = (x: number, y: number, z: number, w: number, d: number) =>
  [p(x, y, z), p(x + w, y, z), p(x + w, y + d, z), p(x, y + d, z)] as Pt[];

/** The three faces of a box that are visible from this camera. */
const boxFaces = (
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number,
) => ({
  top: quad(x, y, z + h, w, d),
  front: [
    p(x, y + d, z),
    p(x + w, y + d, z),
    p(x + w, y + d, z + h),
    p(x, y + d, z + h),
  ] as Pt[],
  flank: [
    p(x + w, y, z),
    p(x + w, y + d, z),
    p(x + w, y + d, z + h),
    p(x + w, y, z + h),
  ] as Pt[],
});

/** A rectangle lying flat on the front face, for vents and ports. */
const onFront = (yc: number, x0: number, x1: number, z0: number, z1: number) =>
  [p(x0, yc, z0), p(x1, yc, z0), p(x1, yc, z1), p(x0, yc, z1)] as Pt[];

/** The same, on the right-hand flank. */
const onFlank = (xc: number, y0: number, y1: number, z0: number, z1: number) =>
  [p(xc, y0, z0), p(xc, y1, z0), p(xc, y1, z1), p(xc, y0, z1)] as Pt[];

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

// ─── Ink ──────────────────────────────────────────────────────────────────────
//
// Three greys for the three faces, lightest on top: the shading is doing the
// work a light source would, so the solid never needs a gradient to read as
// solid. One olive accent, used sparingly enough to stay a highlight.

const ISO_INK = "#243027";
const ACCENT = "#6f7a62";
const TOP = "#ffffff";
const FRONT = "#f3f4f0";
const FLANK = "#e3e5de";

const LINE = {
  stroke: ISO_INK,
  fill: "none",
  strokeLinejoin: "round",
} as const;

/**
 * The dashed footprint and rack posts are the only marks drawn straight onto
 * the page instead of onto a light face, so they are the only ones that have to
 * survive a dark background. In ISO_INK at 30% they measure near-zero contrast
 * on a dark surface and simply vanish — the solid is legible in both themes
 * because its faces carry their own white, but its scaffolding is not.
 *
 * Flipping to the flank grey rather than to white keeps the guides subordinate
 * to the outlines in both themes; the opacity lifts a little in dark because a
 * light ink on a dark ground reads fainter than the reverse at equal alpha.
 *
 * A class rather than cssVars on purpose: cssVars are written into a consumer's
 * stylesheet at install time, so they do nothing for the copy rendering from
 * source in this repo's own gallery. This travels with the file.
 */
const GUIDE_INK =
  "stroke-[#243027] opacity-[0.3] dark:stroke-[#E3E5DE] dark:opacity-[0.45]";

/** One compute unit in the stack. `index` fades the accent bar with depth. */
function DataBox({ z, index }: { z: number; index: number }) {
  const x = 0,
    y = 0,
    w = 11,
    d = 8,
    h = 2.3;
  const f = boxFaces(x, y, z, w, d, h);
  const yf = y + d;

  return (
    <g>
      {/* Fills first, then detail, then the heavy outline on top — the outline
          has to overdraw the vent hatching where they meet. */}
      <path d={roundPoly(f.flank)} fill={FLANK} />
      <path d={roundPoly(f.front)} fill={FRONT} />
      <path d={roundPoly(f.top)} fill={TOP} />

      <g {...LINE} strokeWidth={0.75} opacity={0.45}>
        {range(16).map((i) => {
          const gx = 0.7 + i * 0.42;
          return (
            <path
              key={i}
              d={poly(onFront(yf, gx, gx + 0.2, z + 0.5, z + 1.8))}
            />
          );
        })}
        <path d={roundPoly(onFront(yf, 7.9, 9.1, z + 0.5, z + 1.8), 2)} />
        <path d={roundPoly(onFront(yf, 9.4, 10.4, z + 0.5, z + 1.8), 2)} />
        <path
          d={roundPoly(
            onFlank(x + w, y + 1.1, y + d - 1.1, z + 0.6, z + 1.7),
            2,
          )}
        />
        <path d={roundPoly(quad(x + 0.5, y + 0.5, z + h, w - 1, d - 1), 3)} />
      </g>

      {/* Status strip — the top unit is brightest, so the stack reads top-down */}
      <path
        d={poly(onFront(yf, 0.7, 7.1, z + 2.0, z + 2.15))}
        fill={ACCENT}
        opacity={0.85 - index * 0.25}
      />

      <g {...LINE} strokeWidth={1.3}>
        <path d={roundPoly(f.flank)} />
        <path d={roundPoly(f.front)} />
        <path d={roundPoly(f.top)} />
      </g>
    </g>
  );
}

export function GpuInfrastructure({ className }: GpuInfrastructureProps) {
  const w = 11,
    d = 8;
  const edges = [
    [0, d],
    [w, d],
    [w, 0],
  ] as const;
  const levels = [0, 6, 12];
  const plinth = boxFaces(-2.2, -2.2, -0.9, w + 4.4, d + 4.4, 0.9);

  return (
    // viewBox-driven with no width/height attributes, so the diagram fills
    // whatever box its container reserves and scales down instead of
    // overflowing.
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 420 450"
      className={className}
      fill="none"
      stroke={ISO_INK}
      strokeLinecap="round"
      role="img"
      aria-label="Isometric diagram: three stacked GPU compute units on a plinth"
    >
      {/* Ground plane — a dashed footprint wider than the plinth, so the stack
          sits somewhere rather than floating. */}
      {/* <path
        d={roundPoly(quad(-4, -4, 0, w + 8, d + 8), 14)}
        strokeWidth={1}
        strokeDasharray="6 7"
        className={GUIDE_INK}
      /> */}

      {/* Plinth */}
      <g>
        <path d={roundPoly(plinth.flank)} fill={FLANK} />
        <path d={roundPoly(plinth.front)} fill={FRONT} />
        <path d={roundPoly(plinth.top)} fill={TOP} />
        <g {...LINE} strokeWidth={1.3}>
          <path d={roundPoly(plinth.flank)} />
          <path d={roundPoly(plinth.front)} />
          <path d={roundPoly(plinth.top)} />
        </g>
      </g>

      {/* Rack posts, drawn before the units so each one occludes them */}
      <g strokeWidth={1} strokeDasharray="4 6" className={GUIDE_INK}>
        {edges.map(([ex, ey], i) => {
          const a = p(ex, ey, 0);
          const b = p(ex, ey, levels[2] + 2.3);
          return <path key={i} d={`M${a[0]} ${a[1]}V${b[1]}`} />;
        })}
      </g>

      {/* Painter's algorithm: lowest z first, so upper units overlap correctly */}
      {levels.map((z, i) => (
        <DataBox key={z} z={z} index={levels.length - 1 - i} />
      ))}

      {/* Cable terminations on the front-left corner post */}
      <g fill={ACCENT} stroke="none" opacity={0.6}>
        {[4.4, 10.4].map((z) => {
          const a = p(0, d, z);
          return <circle key={z} cx={a[0]} cy={a[1]} r={2.6} />;
        })}
      </g>
    </svg>
  );
}
