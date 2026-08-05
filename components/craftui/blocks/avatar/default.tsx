"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type AvatarMember = {
  id: string;
  name: string;
  /** Role, read out as part of the tile's accessible name. */
  role: string;
  src: string;
  /** 1-indexed [row, column] slot in the grid. */
  cell: [number, number];
};

export interface AvatarGridProps {
  members?: AvatarMember[];
  /** Node rendered in the centre tile — a brand mark by default. */
  logo?: React.ReactNode;
  /** 1-indexed [row, column] of the centre tile. */
  logoCell?: [number, number];
  /** Grid size, in cells. */
  rows?: number;
  columns?: number;
  /**
   * CSS mask applied to the placeholder layer — a circular fade by default.
   * Pass `false` to keep every shell at full strength.
   */
  mask?: string | false;
  className?: string;
}

// ── Default content ──────────────────────────────────────────────────────────

const DEFAULT_MEMBERS: AvatarMember[] = [
  {
    id: "maya",
    name: "Maya Ellis",
    role: "Admin",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    cell: [2, 2],
  },
  {
    id: "noor",
    name: "Noor Haddad",
    role: "Designer",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    cell: [2, 3],
  },
  {
    id: "tom",
    name: "Tom Brandt",
    role: "Engineer",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    cell: [3, 2],
  },
  {
    id: "amir",
    name: "Amir Rahal",
    role: "Support Lead",
    src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80",
    cell: [3, 4],
  },
  {
    id: "dev",
    name: "Dev Sharma",
    role: "Developer",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    cell: [4, 3],
  },
  {
    id: "lena",
    name: "Lena Fischer",
    role: "Content Reviewer",
    src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&auto=format&fit=crop&q=80",
    cell: [4, 4],
  },
];

/**
 * The mark's ink spans 12.5 units of the 24-unit viewBox, so the original
 * x-offsets left it optically shifted toward the left edge of its tile. Fixed
 * in the path itself rather than with a nudge in the component, so the icon
 * stays centred wherever it is used.
 */
const DEFAULT_LOGO = (
  <svg viewBox="0 0 24 24" className="size-1/2" aria-hidden="true">
    <path
      d="M5.75 4h5v5h-5zM5.75 15h5v5h-5zM13.25 9.5h5v5h-5z"
      fill="currentColor"
    />
  </svg>
);

/** Shared so the placeholder layer and the avatar grid never drift apart. */
const GRID_GAP = "gap-2 sm:gap-3";

// ── Motion ────────────────────────────────────────────────────────────────────

/** Hover lift and press. Bounce 0 — overshoot would read as toy-like here. */
const SPRING = { type: "spring", duration: 0.3, bounce: 0 } as const;

/** ease-out-quart. Strong enough that 250ms still lands as "instant". */
const EASE_ENTRANCE = [0.165, 0.84, 0.44, 1] as const;
const ENTRANCE_DURATION = 0.25;
/** Gap between rings. Below ~40ms the wave stops reading; above ~80ms it drags. */
const RING_STAGGER = 0.06;

/**
 * Circular fade: the shells nearest the cluster read at full strength, then
 * fall away to nothing before the grid's corners — which is what keeps the
 * block from looking like it was cropped out of a larger board.
 */
const DEFAULT_MASK =
  "radial-gradient(circle at 50% 50%, #000 32%, rgba(0,0,0,0.55) 52%, rgba(0,0,0,0.15) 68%, transparent 80%)";

// ── Empty tiles ───────────────────────────────────────────────────────────────

/**
 * The empty slots are the backdrop, not content — they are generated from the
 * grid dimensions rather than listed, so changing `rows`/`columns` fills the
 * board without touching any data.
 */
function EmptyTile({ cell }: { cell: [number, number] }) {
  return (
    <div
      // Placement lives on the tile itself, not on a wrapper — a wrapper
      // stretches to the grid track but the tile inside it would keep auto
      // height and collapse to a single dashed line.
      // The hatch colour has to flip with the theme, and a gradient can't be
      // written as a `dark:` utility — so the ink is a variable the `dark:`
      // variant reassigns, and the gradient itself stays theme-agnostic.
      // White at 4.5% would vanish on near-black, so dark mode gets a stronger
      // ink and a lighter border than a straight inversion would give.
      className="size-full rounded-[26%] border border-dashed border-neutral-200/90 [--hatch-ink:rgba(0,0,0,0.045)] dark:border-neutral-700/70 dark:[--hatch-ink:rgba(255,255,255,0.10)]"
      style={{
        gridRow: cell[0],
        gridColumn: cell[1],
        backgroundImage:
          "repeating-linear-gradient(45deg, var(--hatch-ink) 0 1px, transparent 1px 6px)",
      }}
    />
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function AvatarGrid({
  members = DEFAULT_MEMBERS,
  logo = DEFAULT_LOGO,
  logoCell = [3, 3],
  rows = 5,
  columns = 5,
  mask = DEFAULT_MASK,
  className,
}: AvatarGridProps = {}) {
  const scopeId = React.useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  /**
   * Reduced motion keeps the fade and drops the scale — the entrance still
   * explains that the cluster is built outward from the mark, it just stops
   * moving to say so. Same for the hover lift and the press, handled below.
   */
  const enter = {
    initial: reduceMotion
      ? { opacity: 0 }
      : // 0.95, never 0 — nothing appears from nothing.
        { opacity: 0, scale: 0.95 },
    animate: reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 },
    transition: (rank: number) => ({
      duration: ENTRANCE_DURATION,
      ease: EASE_ENTRANCE,
      delay: rank * RING_STAGGER,
    }),
  };

  /**
   * Tiles are grouped into rings by their distance from the mark, so members
   * equidistant from the centre arrive together and the entrance reads as a
   * wave outward rather than as six unrelated fades. Ranking by list order
   * instead would stagger by nothing the eye can see.
   */
  const ringRank = React.useMemo(() => {
    const distance = (cell: [number, number]) =>
      Math.round(
        Math.hypot(cell[0] - logoCell[0], cell[1] - logoCell[1]) * 100,
      ) / 100;
    const rings = Array.from(
      new Set(members.map((member) => distance(member.cell))),
    ).sort((a, b) => a - b);
    return new Map(
      members.map((member) => [
        member.id,
        // +1 leaves rank 0 to the brand mark at the centre.
        rings.indexOf(distance(member.cell)) + 1,
      ]),
    );
  }, [members, logoCell]);

  // Both layers must resolve to identical tracks or the shells drift off the
  // grid the avatars sit on.
  const gridTemplate: React.CSSProperties = {
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
  };

  const occupied = React.useMemo(() => {
    const taken = new Set<string>([`${logoCell[0]}-${logoCell[1]}`]);
    for (const member of members) taken.add(`${member.cell[0]}-${member.cell[1]}`);
    return taken;
  }, [members, logoCell]);

  const emptyCells = React.useMemo(() => {
    const cells: Array<[number, number]> = [];
    for (let row = 1; row <= rows; row++) {
      for (let column = 1; column <= columns; column++) {
        if (!occupied.has(`${row}-${column}`)) cells.push([row, column]);
      }
    }
    return cells;
  }, [rows, columns, occupied]);

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-white p-6 dark:bg-neutral-950 ${className ?? ""}`}
    >
      <div
        className={`relative grid aspect-square w-full max-w-[460px] ${GRID_GAP}`}
        style={gridTemplate}
        onMouseLeave={() => setHoveredId(null)}
      >
        {/*
          Depth is a layered box-shadow, not a border: the ring layer reads as
          the 1px edge while the two soft layers do the lift, and because every
          layer is transparent it holds up over any background the block is
          dropped onto. Dark mode collapses to a single white ring — soft black
          depth layers are invisible on a dark surface. Written as a scoped
          style block because a three-layer shadow with commas doesn't survive
          Tailwind's arbitrary-value syntax cleanly.
        */}
        <style>
          {`
            .tile-${scopeId} {
              box-shadow:
                0px 0px 0px 1px rgba(0, 0, 0, 0.06),
                0px 1px 2px -1px rgba(0, 0, 0, 0.06),
                0px 2px 4px 0px rgba(0, 0, 0, 0.04);
            }
            .dark .tile-${scopeId} {
              box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08);
            }
            /* Gated on a real pointer: touch fires :hover on tap and then has
               no way to un-fire it, which would leave a tapped tile stuck in
               its hover shadow. */
            @media (hover: hover) and (pointer: fine) {
              .tile-${scopeId}:hover {
                box-shadow:
                  0px 0px 0px 1px rgba(0, 0, 0, 0.08),
                  0px 1px 2px -1px rgba(0, 0, 0, 0.08),
                  0px 2px 4px 0px rgba(0, 0, 0, 0.06);
              }
              .dark .tile-${scopeId}:hover {
                box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.13);
              }
            }

            /*
              The brand tile's edge — the one tile with no photo of its own to
              define it, so it gets a conic gradient masked down to a 1px band
              instead of the flat outline the avatars use. The two masks are
              the border box and the content box; compositing them with exclude
              erases the middle and leaves only the ring, with no wrapper and
              no concentric-radius math.

              'from 45deg' puts gradient angle 0 on the top-right corner, so
              the stops at 0/90/180/270 land exactly on the four corners and
              alternate light, dark, light, dark around them. Rotate that one
              value to move which corner catches the highlight.
            */
            .logo-edge-${scopeId} {
              position: absolute;
              inset: 0;
              box-sizing: border-box;
              padding: 1px;
              border-radius: 26%;
              pointer-events: none;
              background: conic-gradient(
                from 45deg,
                var(--edge-a) 0deg,
                var(--edge-b) 90deg,
                var(--edge-a) 180deg,
                var(--edge-b) 270deg,
                var(--edge-a) 360deg
              );
              -webkit-mask:
                linear-gradient(#000 0 0) content-box,
                linear-gradient(#000 0 0);
              -webkit-mask-composite: xor;
              mask:
                linear-gradient(#000 0 0) content-box,
                linear-gradient(#000 0 0);
              mask-composite: exclude;
              /* Tuned against the tile's own neutral-100 fill, not against the
                 page: a 55% white would be swallowed by the grey. */
              --edge-a: rgba(255, 255, 255, 0.95);
              --edge-b: rgba(0, 0, 0, 0.28);
            }
            /* The tile sits on neutral-900 in dark mode, where a black ink is
               invisible — so both inks go white and the corner alternation
               comes from alpha rather than from hue. */
            .dark .logo-edge-${scopeId} {
              --edge-a: rgba(255, 255, 255, 0.38);
              --edge-b: rgba(255, 255, 255, 0.07);
            }
          `}
        </style>

        {/*
          Placeholder shells live on their own layer so the radial mask can fade
          them out towards the edges without touching the avatars stacked above
          — masking the whole grid would dim the outer cards with them. The
          layer mirrors the parent's tracks and gap exactly, so the shells stay
          on the same grid they would have occupied inline.
        */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 grid ${GRID_GAP}`}
          style={{
            ...gridTemplate,
            maskImage: mask || undefined,
            WebkitMaskImage: mask || undefined,
          }}
        >
          {emptyCells.map(([row, column]) => (
            <EmptyTile key={`empty-${row}-${column}`} cell={[row, column]} />
          ))}
        </div>

        {/* Brand mark — same tile geometry as an avatar, so the cluster stays
            on grid. Rank 0 of the entrance: the cluster is built around it, so
            it is the thing the eye should be given first. */}
        <motion.div
          style={{ gridRow: logoCell[0], gridColumn: logoCell[1] }}
          className={`tile-${scopeId} relative flex items-center justify-center rounded-[26%] bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100`}
          initial={enter.initial}
          animate={enter.animate}
          transition={enter.transition(0)}
        >
          {logo}
          <span aria-hidden="true" className={`logo-edge-${scopeId}`} />
        </motion.div>

        {members.map((member) => {
          const isActive = hoveredId === member.id;
          return (
            // Two layers on purpose: the outer one owns the entrance, the
            // inner one owns hover and press. Sharing a single element would
            // mean one `transition` serving a delayed tween and an
            // interruptible spring at once, and the entrance delay would leak
            // into every hover.
            <motion.div
              key={member.id}
              style={{ gridRow: member.cell[0], gridColumn: member.cell[1] }}
              // z-index has to jump on hover or the lifted tile slides under
              // its neighbours mid-animation.
              className={`relative ${isActive ? "z-10" : "z-0"}`}
              initial={enter.initial}
              animate={enter.animate}
              transition={enter.transition(ringRank.get(member.id) ?? 1)}
            >
              <motion.div
                className="size-full"
                // Hover only ever comes from a real pointer. On touch, tapping
                // fires enter with no matching leave, which would strand a
                // tile lifted and in colour until something else was tapped.
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setHoveredId(member.id);
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === "mouse") setHoveredId(null);
                }}
                onFocusCapture={() => setHoveredId(member.id)}
                onBlurCapture={() => setHoveredId(null)}
                animate={{ scale: reduceMotion ? 1 : isActive ? 1.08 : 1 }}
                // Press wins over the hover lift — Motion gives gesture props
                // priority over `animate`, so the two never fight.
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                transition={SPRING}
              >
                <button
                  type="button"
                  aria-label={`${member.name} — ${member.role}`}
                  className={`tile-${scopeId} relative block size-full cursor-pointer overflow-hidden rounded-[26%] transition-[box-shadow] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100`}
                >
                  <img
                    src={member.src}
                    alt=""
                    // outline, not border or ring: it sits inset without adding
                    // to the layout, and it follows the border-radius. Pure
                    // black/white at 10% — a tinted neutral picks up the surface
                    // underneath and reads as dirt on the photo edge.
                    //
                    // The filter timing is tuned to the lift's spring rather
                    // than left on Tailwind's default: colour and lift are one
                    // object answering one hover, so they have to land together.
                    className="size-full rounded-[26%] object-cover object-center outline-1 -outline-offset-1 outline-black/10 transition-[filter] duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] dark:outline-white/10"
                    style={{ filter: isActive ? "none" : "grayscale(1)" }}
                    draggable={false}
                  />
                </button>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
