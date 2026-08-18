// A cube with one corner block cut out and set down beside it. Registry items
// ship as one self-contained file to a consumer's project, so the isometric
// helpers below live here rather than in a shared module — a shared module
// would arrive as a second file the consumer never asked for.
//
// No motion: the diagram is drawn once and holds still.

interface ModularBlockProps {
  /** Additional classes on the <svg> root. */
  className?: string;
}

// ─── Isometric projection ─────────────────────────────────────────────────────
//
// A true 2:1 isometric would use k = 0.5; 0.866 (cos 30°) gives the taller,
// squarer look shared with the other isometric illustrations. ISO_S is the unit
// size in px, ISO_OX/OY the origin — tuned so the cube plus the detached block
// sit centred in the 420×450 viewBox.

const ISO_K = 0.8660254;
const ISO_S = 18;
const ISO_OX = 190;
const ISO_OY = 225;

type Pt = readonly [number, number];

const p = (x: number, y: number, z = 0): Pt => [
  (x - y) * ISO_K * ISO_S + ISO_OX,
  ((x + y) / 2 - z) * ISO_S + ISO_OY,
];

/** Sharp corners on purpose — every vertex is a hard miter, no bevel. */
const poly = (pts: Pt[]) =>
  pts
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ") + "Z";

// ─── The solid ────────────────────────────────────────────────────────────────
//
// C is the cube's edge, N where the notch starts on all three axes, so the
// removed piece is the cube x,y,z ∈ [N, C] — the corner that projects nearest
// the viewer. OFF slides that piece out along +x and −y by equal amounts, which
// on screen is pure horizontal travel: (x − y) grows while (x + y) / 2 holds, so
// the block moves right without drifting up or down out of its own socket.

const C = 10;
const N = 5.5;
const OFF = 4;

/** The three faces of a box that are visible from this camera. */
const boxFaces = (
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number,
) => ({
  top: [
    p(x, y, z + h),
    p(x + w, y, z + h),
    p(x + w, y + d, z + h),
    p(x, y + d, z + h),
  ] as Pt[],
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

// ─── Ink ──────────────────────────────────────────────────────────────────────
//
// Neutral greys, no hue at all. Light keeps the simple three-step ramp — one
// value per face orientation, lightest on the up-facing planes — so the shading
// does the work a light source would and the solid never needs a gradient.
//
// Dark does NOT reuse that ramp. It is lifted value-for-value from the Paper
// file ("SVG Frame 01"), where the three groups were graded apart rather than
// sharing one palette: the extracted piece and the socket it came out of keep a
// bright #3A3A3A up-face, while the host cube's top is knocked back to #282828.
// That gap is the whole idea — the eye lands on the piece and the hole first,
// and the big form recedes. The two inner walls go darker still, and the left
// one darkest of all, which is what gives the socket its depth.
//
// In Paper these came out of a base fill plus a black overlay on the outline
// path; the overlays only ever darken, so each pair is folded into one flat
// value here. Same pixels, half the paths, no alpha stacking to reason about.
//
// Every colour is a class pair rather than a fill/stroke attribute, because an
// attribute cannot answer to the theme.
//
// Classes rather than cssVars on purpose: cssVars are written into a consumer's
// stylesheet at install time, so they do nothing for the copy rendering from
// source in this repo's own gallery. This travels with the file. CSS beats a
// presentation attribute, so the fill="none" left on the <svg> root does not
// fight them.

const INK = "stroke-[#1A1A1A] dark:stroke-[#A8A8A8]";

/** The one warm edge in the drawing — the host cube's lower-left silhouette. */
const INK_WARM = "stroke-[#1A1A1A] dark:stroke-[#D7CECD]";

const SURFACE = {
  cubeTop: "fill-[#FFFFFF] dark:fill-[#282828]",
  cubeFront: "fill-[#EFEFEF] dark:fill-[#131313]",
  cubeFlank: "fill-[#DADADA] dark:fill-[#0D0D0D]",

  notchFloor: "fill-[#FFFFFF] dark:fill-[#3A3A3A]",
  notchFront: "fill-[#EFEFEF] dark:fill-[#131313]",
  notchFlank: "fill-[#DADADA] dark:fill-[#060606]",

  pieceTop: "fill-[#FFFFFF] dark:fill-[#3A3A3A]",
  pieceFront: "fill-[#EFEFEF] dark:fill-[#131313]",
  pieceFlank: "fill-[#DADADA] dark:fill-[#141414]",
} as const;

const LINE = {
  fill: "none",
  strokeLinejoin: "miter",
  strokeLinecap: "square",
} as const;

export function ModularBlock({ className }: ModularBlockProps) {
  // Outer skin. Each of the three visible faces loses the same square corner to
  // the notch, so all three are L-shaped rather than plain quads.
  const topFace: Pt[] = [
    p(0, 0, C),
    p(C, 0, C),
    p(C, N, C),
    p(N, N, C),
    p(N, C, C),
    p(0, C, C),
  ];
  const frontFace: Pt[] = [
    p(0, C, 0),
    p(C, C, 0),
    p(C, C, N),
    p(N, C, N),
    p(N, C, C),
    p(0, C, C),
  ];
  const flankFace: Pt[] = [
    p(C, 0, 0),
    p(C, C, 0),
    p(C, C, N),
    p(C, N, N),
    p(C, N, C),
    p(C, 0, C),
  ];

  // Cut surfaces inside the notch: a floor and the two walls that face the
  // camera. The third wall of the socket points away and is never seen.
  const notchFloor: Pt[] = [p(N, N, N), p(C, N, N), p(C, C, N), p(N, C, N)];
  const notchFlank: Pt[] = [p(N, N, N), p(N, C, N), p(N, C, C), p(N, N, C)];
  const notchFront: Pt[] = [p(N, N, N), p(C, N, N), p(C, N, C), p(N, N, C)];

  // The removed piece, slid out of its socket along the screen horizontal.
  const size = C - N;
  const piece = boxFaces(N + OFF, N - OFF, N, size, size, size);

  return (
    // viewBox-driven with no width/height attributes, so the diagram fills
    // whatever box its container reserves and scales down instead of
    // overflowing.
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 420 450"
      className={className}
      fill="none"
      role="img"
      aria-label="Isometric diagram: a cube with one corner block cut out and set beside it"
    >
      {/* Painter's algorithm. The recessed cut surfaces are farthest from the
          camera, so they go down first; the outer skin overdraws them where the
          two meet; the detached piece is nearest and lands last. Fills for a
          group precede its outlines, because the outlines have to survive the
          next fill that touches them. */}
      <g>
        <path d={poly(notchFlank)} className={SURFACE.notchFlank} />
        <path d={poly(notchFront)} className={SURFACE.notchFront} />
        <path d={poly(notchFloor)} className={SURFACE.notchFloor} />
        <g {...LINE} className={INK} strokeWidth={1.3}>
          <path d={poly(notchFlank)} />
          <path d={poly(notchFront)} />
          <path d={poly(notchFloor)} />
        </g>
      </g>

      <g>
        <path d={poly(flankFace)} className={SURFACE.cubeFlank} />
        <path d={poly(frontFace)} className={SURFACE.cubeFront} />
        <path d={poly(topFace)} className={SURFACE.cubeTop} />
        <g {...LINE} strokeWidth={1.3}>
          <path d={poly(flankFace)} className={INK} />
          <path d={poly(frontFace)} className={INK_WARM} />
          <path d={poly(topFace)} className={INK} />
        </g>
      </g>

      <g>
        <path d={poly(piece.flank)} className={SURFACE.pieceFlank} />
        <path d={poly(piece.front)} className={SURFACE.pieceFront} />
        <path d={poly(piece.top)} className={SURFACE.pieceTop} />
        <g {...LINE} className={INK} strokeWidth={1.3}>
          <path d={poly(piece.flank)} />
          <path d={poly(piece.front)} />
          <path d={poly(piece.top)} />
        </g>
      </g>
    </svg>
  );
}
