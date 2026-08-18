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
const roundPoly = (pts: Pt[], r = 2) => {
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
// Neutral greys, no hue at all: white in light, black in dark, three steps of
// it for the three faces, lightest on top. The shading is doing the work a light
// source would, so the solid never needs a gradient to read as solid, and the
// accent is a mid grey that separates from every face in both themes.
//
// Every colour is a class pair rather than a fill/stroke attribute, because an
// attribute cannot answer to the theme. In dark the faces darken and the ink
// lifts, but the light keeps coming from the same place — the top face is still
// the lightest of the three, so the solid reads the same way in both themes.
//
// Classes rather than cssVars on purpose: cssVars are written into a consumer's
// stylesheet at install time, so they do nothing for the copy rendering from
// source in this repo's own gallery. This travels with the file. CSS beats a
// presentation attribute, so the fill="none" left on the <svg> root does not
// fight them.

const INK = "stroke-[#1A1A1A] dark:stroke-[#A8A8A8] dark:stroke-opacity-[0.9]";
const ACCENT = "fill-[#6B6B6B] dark:fill-[#B4B4B4]";
const TOP = "fill-[#FFFFFF] dark:fill-[#3A3A3A]";
const FRONT = "fill-[#EFEFEF] dark:fill-[#2A2A2A]";
const FLANK = "fill-[#DADADA] dark:fill-[#1C1C1C]";

const LINE = {
  fill: "none",
  strokeLinejoin: "round",
} as const;

/**
 * The dashed footprint and rack posts are drawn straight onto the page rather
 * than onto a face, so they are the only marks that meet the background
 * directly. They flip like the rest of the ink, but land short of it — a step
 * in from the full lift — which keeps the guides subordinate to the outlines in
 * both themes. The opacity rises a little in dark because a light ink on a dark
 * ground reads fainter than the reverse at equal alpha.
 */
const GUIDE_INK =
  "stroke-[#1A1A1A] opacity-[0.3] dark:stroke-[#A8A8A8] dark:opacity-[0.45]";

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
      <path d={roundPoly(f.flank)} className={FLANK} />
      <path d={roundPoly(f.front)} className={FRONT} />
      <path d={roundPoly(f.top)} className={TOP} />

      <g {...LINE} className={INK} strokeWidth={0.75} opacity={0.45}>
        {range(10).map((i) => {
          const gx = 0.7 + i * 0.7;
          return (
            <path
              key={i}
              d={poly(onFront(yf, gx, gx + 0.4, z + 0.5, z + 1.8))}
            />
          );
        })}
        <path
          d={roundPoly(
            onFlank(x + w, y + 1.1, y + d - 1.1, z + 0.6, z + 1.7),
            2,
          )}
        />
        <path d={roundPoly(quad(x + 0.5, y + 0.5, z + h, w - 1, d - 1), 2)} />
      </g>

      <g {...LINE} className={INK} strokeWidth={1.3}>
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
      strokeLinecap="round"
      role="img"
      aria-label="Isometric diagram: three stacked GPU compute units on a plinth"
    >
      {/* Plinth */}
      <g>
        <path d={roundPoly(plinth.flank)} className={FLANK} />
        <path d={roundPoly(plinth.front)} className={FRONT} />
        <path d={roundPoly(plinth.top)} className={TOP} />
        <g {...LINE} className={INK} strokeWidth={0.8}>
          <path d={roundPoly(plinth.flank)} />
          <path d={roundPoly(plinth.front)} />
          <path d={roundPoly(plinth.top)} />
        </g>
      </g>

      {/* Rack posts, drawn before the units so each one occludes them */}
      {/* <g strokeWidth={1} strokeDasharray="4 6" className={GUIDE_INK}>
        {edges.map(([ex, ey], i) => {
          const a = p(ex, ey, 0);
          const b = p(ex, ey, levels[2] + 2.3);
          return <path key={i} d={`M${a[0]} ${a[1]}V${b[1]}`} />;
        })}
      </g> */}

      {/* Painter's algorithm: lowest z first, so upper units overlap correctly */}
      {levels.map((z, i) => (
        <DataBox key={z} z={z} index={levels.length - 1 - i} />
      ))}

      {/* Cable terminations on the front-left corner post */}
      {/* <g className={ACCENT} stroke="none" opacity={0.6}>
        {[4.4, 10.4].map((z) => {
          const a = p(0, d, z);
          return <circle key={z} cx={a[0]} cy={a[1]} r={2.6} />;
        })}
      </g> */}
    </svg>
  );
}
