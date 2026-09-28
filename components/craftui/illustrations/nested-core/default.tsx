// A lit core suspended inside an open isometric shell, inside a larger
// construction frame. Registry items ship as one self-contained file to a
// consumer's project, so the isometric helpers below live here rather than in a
// shared module — a shared module would arrive as a second file the consumer
// never asked for.
//
// No motion: the diagram is drawn once and holds still.

interface NestedCoreProps {
  /** Additional classes on the <svg> root. */
  className?: string;
}

// ─── Isometric projection ─────────────────────────────────────────────────────
//
// True isometric: with k = cos 30°, all three axes project to the same screen
// length and sit 120° apart, so a cube comes out 2/√3 taller than it is wide.
// (The 2:1 game-style dimetric would be k = 1.0, giving 26.57° axes.) ISO_S is
// the unit size in px; the origin is placed so that the centre of the shell —
// (5, 5, 5) in cube units — lands dead centre of the 420×450 viewBox.

const ISO_K = 0.8660254;
const ISO_S = 18;
const ISO_OX = 210;
const ISO_OY = 225;

type Pt = readonly [number, number];

const p = (x: number, y: number, z = 0): Pt => [
  (x - y) * ISO_K * ISO_S + ISO_OX,
  ((x + y) / 2 - z) * ISO_S + ISO_OY,
];

const poly = (pts: Pt[]) =>
  pts
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ") + "Z";

const line = (a: Pt, b: Pt) =>
  `M${a[0].toFixed(2)} ${a[1].toFixed(2)}L${b[0].toFixed(2)} ${b[1].toFixed(2)}`;

/** All twelve edges of an axis-aligned cube, as projected segments. */
const cubeEdges = (a: number, b: number): string[] => {
  const out: string[] = [];
  for (const z of [a, b]) {
    out.push(
      line(p(a, a, z), p(b, a, z)),
      line(p(b, a, z), p(b, b, z)),
      line(p(b, b, z), p(a, b, z)),
      line(p(a, b, z), p(a, a, z)),
    );
  }
  for (const [x, y] of [
    [a, a],
    [b, a],
    [b, b],
    [a, b],
  ])
    out.push(line(p(x, y, a), p(x, y, b)));
  return out;
};

/**
 * The six-sided outline a cube casts from this camera, in order: top vertex,
 * upper-right, lower-right, bottom, lower-left, upper-left. Used for the glow,
 * which only needs the silhouette — blurring the three face paths separately
 * would bloom their shared inner edges too.
 */
const hexSilhouette = (a: number, b: number): Pt[] => [
  p(a, a, b),
  p(b, a, b),
  p(b, a, a),
  p(b, b, a),
  p(a, b, a),
  p(a, b, b),
];

// ─── The solid ────────────────────────────────────────────────────────────────
//
// SHELL is a cube with its three camera-facing sides removed, so what reads is
// the inside of the other three: the floor at z = 0 and the two far walls at
// x = 0 and y = 0. CORE is a smaller cube concentric with it, floating clear of
// every interior surface. FRAME is the same cube again at 1.22×, drawn as bare
// edges — big enough that its six silhouette vertices land just inside the
// viewBox, which is what makes it read as a construction frame around the
// subject rather than a second object in the scene.

const SHELL = 10;
const CORE = 3.6;
const CORE_MIN = (SHELL - CORE) / 2;
const CORE_MAX = CORE_MIN + CORE;
const FRAME_HALF = 6.1;
const FRAME_MIN = SHELL / 2 - FRAME_HALF;
const FRAME_MAX = SHELL / 2 + FRAME_HALF;

/**
 * A point on one of the core's three visible faces, from face-local (u, v) in
 * the unit square, v pointing up the face. The three mappings differ so that
 * the emblems mirror each other across the cube's vertical axis the way the
 * faces themselves do, instead of all three shearing the same way.
 */
const onTop = (u: number, v: number) =>
  p(CORE_MIN + u * CORE, CORE_MAX - v * CORE, CORE_MAX);
const onFront = (u: number, v: number) =>
  p(CORE_MIN + u * CORE, CORE_MAX, CORE_MIN + v * CORE);
const onFlank = (u: number, v: number) =>
  p(CORE_MAX, CORE_MIN + u * CORE, CORE_MIN + v * CORE);

/** A chevron in the unit square, inset to the middle half of a face. */
const EMBLEM: Pt[] = [
  [0.08, 0.38],
  [0.5, 0.78],
  [0.92, 0.38],
  [0.72, 0.28],
  [0.5, 0.5],
  [0.28, 0.28],
];

const emblem = (map: (u: number, v: number) => Pt) =>
  poly(EMBLEM.map(([u, v]) => map(0.25 + u * 0.5, 0.25 + v * 0.5)));

// ─── Ink ──────────────────────────────────────────────────────────────────────
//
// The shell is neutral and the core is the only hue on the page, which is the
// whole composition: everything grey is context, the one warm thing is the
// subject. Each set keeps the same three-step ramp — lightest on the up-facing
// plane — so both solids are lit from the same place.
//
// The shell's interior sits a step below the exterior ramp the other isometric
// illustrations use. These planes are inside a closed box; grading them like
// outside faces would light them from nowhere and flatten the opening.
//
// Every colour is a class pair rather than a fill/stroke attribute, because an
// attribute cannot answer to the theme. Classes rather than cssVars on purpose:
// cssVars are written into a consumer's stylesheet at install time, so they do
// nothing for the copy rendering from source in this repo's own gallery. This
// travels with the file. CSS beats a presentation attribute, so the fill="none"
// left on the <svg> root does not fight them.

const INTERIOR = {
  floor: "fill-[#F2F2F2] dark:fill-[#1A1A1A]",
  right: "fill-[#E9E9E9] dark:fill-[#151515]",
  left: "fill-[#DEDEDE] dark:fill-[#0E0E0E]",
} as const;

const CORE_FILL = {
  top: "fill-[#FFB454]",
  front: "fill-[#F7941D]",
  flank: "fill-[#E07C10]",
} as const;

const GLOW = "fill-[#F79420]";
const RIM = "stroke-[#FFD9A6]";
const MARK = "stroke-[#FFFFFF]";

/**
 * Construction lines — the frame, the floor grid and the shell's own edges —
 * land on the background rather than on a face, so they flip like the rest of
 * the ink but stop short of its full strength. The dark values lift a little
 * further than a straight inversion, because light ink on a dark ground reads
 * fainter than the reverse at equal alpha.
 */
const GUIDE = "stroke-[#1A1A1A] opacity-[0.28] dark:stroke-[#A8A8A8] dark:opacity-[0.4]";
const GUIDE_FAINT =
  "stroke-[#1A1A1A] opacity-[0.14] dark:stroke-[#A8A8A8] dark:opacity-[0.22]";
const DOT = "fill-[#1A1A1A] dark:fill-[#E8E8E8]";

const LINE = {
  fill: "none",
  strokeLinejoin: "miter",
  strokeLinecap: "square",
} as const;

export function NestedCore({ className }: NestedCoreProps) {
  const floor: Pt[] = [
    p(0, 0, 0),
    p(SHELL, 0, 0),
    p(SHELL, SHELL, 0),
    p(0, SHELL, 0),
  ];
  const wallRight: Pt[] = [
    p(0, 0, 0),
    p(SHELL, 0, 0),
    p(SHELL, 0, SHELL),
    p(0, 0, SHELL),
  ];
  const wallLeft: Pt[] = [
    p(0, 0, 0),
    p(0, SHELL, 0),
    p(0, SHELL, SHELL),
    p(0, 0, SHELL),
  ];

  // Four divisions each way. Drawn only on the floor: gridding the walls as
  // well turns the interior into graph paper and the core stops being the
  // brightest thing in the box.
  const grid = [2, 4, 6, 8].flatMap((t) => [
    line(p(t, 0, 0), p(t, SHELL, 0)),
    line(p(0, t, 0), p(SHELL, t, 0)),
  ]);

  // The three silhouette extremes of the opening, plus the near bottom vertex —
  // the points a viewer uses to read the box's shape.
  const vertices: Pt[] = [
    p(0, 0, SHELL),
    p(SHELL, 0, SHELL),
    p(0, SHELL, SHELL),
    p(SHELL, SHELL, 0),
  ];

  const coreTop: Pt[] = [
    p(CORE_MIN, CORE_MIN, CORE_MAX),
    p(CORE_MAX, CORE_MIN, CORE_MAX),
    p(CORE_MAX, CORE_MAX, CORE_MAX),
    p(CORE_MIN, CORE_MAX, CORE_MAX),
  ];
  const coreFront: Pt[] = [
    p(CORE_MIN, CORE_MAX, CORE_MIN),
    p(CORE_MAX, CORE_MAX, CORE_MIN),
    p(CORE_MAX, CORE_MAX, CORE_MAX),
    p(CORE_MIN, CORE_MAX, CORE_MAX),
  ];
  const coreFlank: Pt[] = [
    p(CORE_MAX, CORE_MIN, CORE_MIN),
    p(CORE_MAX, CORE_MAX, CORE_MIN),
    p(CORE_MAX, CORE_MAX, CORE_MAX),
    p(CORE_MAX, CORE_MIN, CORE_MAX),
  ];

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
      aria-label="Isometric diagram: a lit cube suspended inside an open cube, inside a larger wireframe frame"
    >
      {/* Painter's algorithm, back to front: the construction frame sits behind
          everything, then the shell's interior, then its edges, and the core
          lands last because it is nearest the camera. */}
      <g {...LINE} className={GUIDE_FAINT} strokeWidth={1}>
        {cubeEdges(FRAME_MIN, FRAME_MAX).map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      <g>
        <path d={poly(wallLeft)} className={INTERIOR.left} />
        <path d={poly(wallRight)} className={INTERIOR.right} />
        <path d={poly(floor)} className={INTERIOR.floor} />
      </g>

      <g {...LINE} className={GUIDE_FAINT} strokeWidth={0.9} strokeDasharray="1 5">
        {grid.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      <g {...LINE} className={GUIDE} strokeWidth={1.1}>
        {cubeEdges(0, SHELL).map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      <g className={DOT} stroke="none">
        {vertices.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={2.2} />
        ))}
      </g>

      {/* Bloom. Two passes of the silhouette rather than of the three faces:
          blurring the faces separately would bloom the inner edges they share
          and print a seam across the middle of the core. */}
      <g className={GLOW} stroke="none">
        <path
          d={poly(hexSilhouette(CORE_MIN - 0.5, CORE_MAX + 0.5))}
          className="blur-[22px] opacity-[0.55]"
        />
        <path
          d={poly(hexSilhouette(CORE_MIN, CORE_MAX))}
          className="blur-[9px] opacity-[0.75]"
        />
      </g>

      <g>
        <path d={poly(coreFlank)} className={CORE_FILL.flank} />
        <path d={poly(coreFront)} className={CORE_FILL.front} />
        <path d={poly(coreTop)} className={CORE_FILL.top} />

        {/* Emblems sit on the faces, not over them: each is projected through
            its own face mapping, so it foreshortens with the plane it is on. */}
        <g {...LINE} className={MARK} strokeWidth={1.4} opacity={0.92}>
          <path d={emblem(onTop)} />
          <path d={emblem(onFront)} />
          <path d={emblem(onFlank)} />
        </g>

        <g {...LINE} className={RIM} strokeWidth={1.2} opacity={0.85}>
          <path d={poly(coreFlank)} />
          <path d={poly(coreFront)} />
          <path d={poly(coreTop)} />
        </g>
      </g>
    </svg>
  );
}
