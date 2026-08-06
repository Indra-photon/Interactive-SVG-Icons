"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

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
  /**
   * Arbitrary tiles dropped into named cells — a "we're hiring" slot, say.
   * They occupy their cell, so no placeholder shell is drawn underneath.
   */
  extraTiles?: { cell: [number, number]; content: React.ReactNode }[];
  /**
   * Renders the active member's role as a pointer badge beside their tile.
   * Off by default: standalone, the cluster is a picture of a team and the
   * roles live in each tile's accessible name.
   */
  roleBadges?: boolean;
  /**
   * Custom badge contents. Defaults to the member's role; pass this to put a
   * name, a bio, anything the caller wants inside the same pill.
   */
  renderBadge?: (member: AvatarMember) => React.ReactNode;
  /** Member selected before anyone interacts. Null leaves the cluster at rest. */
  defaultSelectedId?: string | null;
  /**
   * Controlled selection. Pass it and the caller owns which member is picked —
   * the grid stops keeping its own copy, so a list outside the grid and the
   * grid itself can't drift apart. Hover still previews on top of it.
   */
  selectedId?: string | null;
  /** Fires when a tile is clicked. Required to make `selectedId` do anything. */
  onSelect?: (id: string) => void;
  /**
   * Fires whenever the active member changes — hover preview or committed
   * click. Lets a caller render name, role and bio outside the grid without
   * the grid having to know anything about how they are laid out.
   */
  onActiveChange?: (id: string | null) => void;
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

/**
 * Shared so the placeholder layer and the avatar grid never drift apart. Steps
 * down on small screens: five columns of gutter is the one place where a phone
 * can win a few pixels per tile back without changing the layout.
 */
const GRID_GAP = "gap-1.5 sm:gap-2 md:gap-3";

// ── Motion ────────────────────────────────────────────────────────────────────

/** Hover lift and press. Bounce 0 — overshoot would read as toy-like here. */
const SPRING = { type: "spring", duration: 0.3, bounce: 0 } as const;

/** ease-out-quart. Strong enough that 250ms still lands as "instant". */
const EASE_ENTRANCE = [0.165, 0.84, 0.44, 1] as const;
/** ease-out-quad. Fades and small badge travel — a fade should read as a fade. */
const EASE_FADE = [0.25, 0.46, 0.45, 0.94] as const;
const ENTRANCE_DURATION = 0.25;
/** Gap between rings. Below ~40ms the wave stops reading; above ~80ms it drags. */
const RING_STAGGER = 0.06;

/**
 * How far the unselected faces step back once someone is active. 0.5 is enough
 * to make the active face the only thing the eye lands on; below ~0.4 the rest
 * of the team stops reading as present at all, which is the wrong message for
 * a group portrait.
 */
const DIM_OPACITY = 0.5;

/**
 * Circular fade: the shells nearest the cluster read at full strength, then
 * fall away to nothing before the grid's corners — which is what keeps the
 * block from looking like it was cropped out of a larger board.
 */
const DEFAULT_MASK =
  "radial-gradient(circle at 50% 50%, oklch(0 0 0) 32%, oklch(0 0 0 / 0.55) 52%, oklch(0 0 0 / 0.15) 68%, transparent 80%)";

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
      // variant reassigns, and the gradient itself stays theme-agnostic. White
      // at 4.5% would vanish on near-black, so dark mode gets more than a
      // straight inversion. The outline is `--avatar-border`, which already
      // carries its own per-theme value.
      className="size-full rounded-[26%] border border-dashed border-[var(--avatar-border)] [--hatch-ink:oklch(0_0_0_/_0.045)] dark:[--hatch-ink:oklch(1_0_0_/_0.1)]"
      style={{
        gridRow: cell[0],
        gridColumn: cell[1],
        backgroundImage:
          "repeating-linear-gradient(45deg, var(--hatch-ink) 0 1px, transparent 1px 6px)",
      }}
    />
  );
}

// ── Role badge ────────────────────────────────────────────────────────────────

/**
 * The active member's role, on a pointer pill anchored to their tile. It sits
 * outside the tile and is `pointer-events-none`, so it can never intercept the
 * hover that summoned it — a badge that eats its own trigger flickers forever.
 *
 * Entering, so ease-out; the arrow and pill share one transform, because two
 * halves of one badge arriving on different timings reads as a glitch.
 */
function RoleBadge({
  member,
  renderBadge,
  side,
  reduceMotion,
}: {
  member: AvatarMember;
  renderBadge?: (member: AvatarMember) => React.ReactNode;
  side: "left" | "right";
  reduceMotion: boolean | null;
}) {
  const content = renderBadge ? renderBadge(member) : member.role;
  const isLeft = side === "left";
  const offset = isLeft ? 8 : -8;
  return (
    <motion.div
      initial={
        reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, x: offset }
      }
      animate={
        reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, x: 0 }
      }
      exit={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.92, x: offset * 0.75 }
      }
      transition={{ duration: 0.18, ease: EASE_FADE }}
      // Hook for callers that want the badge at some breakpoints only — a
      // section that renders roles in its own copy column can hide these with
      // one CSS rule instead of a resize listener and a re-render.
      data-role-badge=""
      className={`pointer-events-none absolute top-1/2 z-20 -translate-y-1/2 ${
        isLeft
          ? "right-[88%] origin-right"
          : "left-[88%] origin-left"
      }`}
    >
      <div className="relative">
        {/* Cursor arrow, tucked into the corner nearest the tile it points at */}
        <svg
          viewBox="0 0 12 14"
          className={`absolute -top-2 size-2.5 text-[var(--avatar-fg)] sm:size-3 ${
            isLeft ? "-right-1 scale-x-[-1]" : "-left-1"
          }`}
          aria-hidden="true"
        >
          <path d="M0 0l12 5.5-5 1.5L4.5 14z" fill="currentColor" />
        </svg>
        <span className="block rounded-full bg-[var(--avatar-fg)] px-2.5 py-1 text-[10px] leading-none font-medium whitespace-nowrap text-[var(--avatar-surface)] shadow-sm sm:px-3.5 sm:py-1.5 sm:text-xs">
          {content}
        </span>
      </div>
    </motion.div>
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
  extraTiles = [],
  roleBadges = false,
  renderBadge,
  defaultSelectedId = null,
  selectedId: selectedIdProp,
  onSelect,
  onActiveChange,
  className,
}: AvatarGridProps = {}) {
  const scopeId = React.useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();
  // Split state, the same way contact-reveal-card does it: hover is a preview,
  // click commits. Without the committed half there is no way to pick a member
  // on a touch device, where hover doesn't exist.
  const [uncontrolledSelectedId, setUncontrolledSelectedId] = React.useState<
    string | null
  >(defaultSelectedId);
  // Controlled when the prop is passed at all — including as null, which is a
  // caller saying "nothing is selected", not "you decide".
  const isControlled = selectedIdProp !== undefined;
  const selectedId = isControlled ? selectedIdProp : uncontrolledSelectedId;
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const activeId = hoveredId ?? selectedId;

  const select = (id: string) => {
    if (!isControlled) setUncontrolledSelectedId(id);
    onSelect?.(id);
  };

  // Held in a ref, and kept current in its own effect rather than during
  // render, so a caller passing an inline arrow function doesn't re-fire the
  // callback on every render.
  const onActiveChangeRef = React.useRef(onActiveChange);
  React.useEffect(() => {
    onActiveChangeRef.current = onActiveChange;
  });
  React.useEffect(() => {
    onActiveChangeRef.current?.(activeId);
  }, [activeId]);

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
    for (const tile of extraTiles) taken.add(`${tile.cell[0]}-${tile.cell[1]}`);
    return taken;
  }, [members, logoCell, extraTiles]);

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
      className={`flex h-full w-full items-center justify-center bg-[var(--avatar-surface)] p-6 ${className ?? ""}`}
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
                0px 0px 0px 1px oklch(0 0 0 / 0.06),
                0px 1px 2px -1px oklch(0 0 0 / 0.06),
                0px 2px 4px 0px oklch(0 0 0 / 0.04);
            }
            .dark .tile-${scopeId} {
              box-shadow: 0 0 0 1px oklch(1 0 0 / 0.08);
            }
            /* Gated on a real pointer: touch fires :hover on tap and then has
               no way to un-fire it, which would leave a tapped tile stuck in
               its hover shadow. */
            @media (hover: hover) and (pointer: fine) {
              .tile-${scopeId}:hover {
                box-shadow:
                  0px 0px 0px 1px oklch(0 0 0 / 0.08),
                  0px 1px 2px -1px oklch(0 0 0 / 0.08),
                  0px 2px 4px 0px oklch(0 0 0 / 0.06);
              }
              .dark .tile-${scopeId}:hover {
                box-shadow: 0 0 0 1px oklch(1 0 0 / 0.13);
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
              /* Tuned against the tile's own muted fill, not against the
                 page: a 55% white would be swallowed by the grey. */
              --edge-a: oklch(1 0 0 / 0.95);
              --edge-b: oklch(0 0 0 / 0.28);
            }
            /* The tile sits on a dark muted fill in dark mode, where a black ink is
               invisible — so both inks go white and the corner alternation
               comes from alpha rather than from hue. */
            .dark .logo-edge-${scopeId} {
              --edge-a: oklch(1 0 0 / 0.38);
              --edge-b: oklch(1 0 0 / 0.07);
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
          className={`tile-${scopeId} relative flex items-center justify-center rounded-[26%] bg-[var(--avatar-muted)] text-[var(--avatar-fg)]`}
          initial={enter.initial}
          animate={enter.animate}
          transition={enter.transition(0)}
        >
          {logo}
          <span aria-hidden="true" className={`logo-edge-${scopeId}`} />
        </motion.div>

        {extraTiles.map((tile) => (
          <div
            key={`extra-${tile.cell[0]}-${tile.cell[1]}`}
            style={{ gridRow: tile.cell[0], gridColumn: tile.cell[1] }}
            className="relative"
          >
            {tile.content}
          </div>
        ))}

        {members.map((member) => {
          const isActive = activeId === member.id;
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
                animate={{ scale: reduceMotion ? 1 : isActive ? 1.03 : 1 }}
                // Press wins over the hover lift — Motion gives gesture props
                // priority over `animate`, so the two never fight.
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                transition={SPRING}
              >
                <button
                  type="button"
                  aria-label={`${member.name} — ${member.role}`}
                  aria-pressed={selectedId === member.id}
                  onClick={() => select(member.id)}
                  className={`tile-${scopeId} relative block size-full cursor-pointer overflow-hidden rounded-[26%] transition-[box-shadow] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--avatar-ring)]`}
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
                    className="size-full rounded-[26%] object-cover object-center outline-1 -outline-offset-1 outline-black/10 transition-[filter,opacity] duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] dark:outline-white/10"
                    // Two-part state, one gesture: the active face gains its
                    // colour and the rest step back. The dim only applies once
                    // something is active — at rest every face sits at full
                    // strength, so the cluster still reads as a group portrait
                    // rather than a permanently deselected list.
                    style={{
                      filter: isActive ? "none" : "grayscale(1)",
                      opacity: !activeId || isActive ? 1 : DIM_OPACITY,
                    }}
                    draggable={false}
                  />
                </button>
              </motion.div>

              {/* Outside the hover layer on purpose: nested in it, the badge
                  would inherit the 1.08 lift and its text would scale with the
                  photo. Side follows the tile's column so a badge on a
                  left-hand tile points inward, never off the grid. */}
              <AnimatePresence initial={false}>
                {roleBadges && isActive && (
                  <RoleBadge
                    key={member.id}
                    // The caller's render function is handed down rather than
                    // called here: invoking opaque code with a member in this
                    // scope makes the React Compiler treat `members` as
                    // possibly mutated, and it bails out of memoizing
                    // everything derived from it. Inside the badge — a
                    // component with no memoization to lose — it costs nothing.
                    member={member}
                    renderBadge={renderBadge}
                    // Outermost columns always point inward — a badge hung off
                    // column 1 has nothing to hang into and leaves the grid
                    // entirely, which is what happens on a compact 3-wide
                    // layout where every tile is an edge tile. Everything in
                    // between points away from the centre, so badges don't
                    // land on top of the brand mark.
                    side={
                      member.cell[1] === 1
                        ? "right"
                        : member.cell[1] === columns
                          ? "left"
                          : member.cell[1] <= logoCell[1]
                            ? "left"
                            : "right"
                    }
                    reduceMotion={reduceMotion}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
