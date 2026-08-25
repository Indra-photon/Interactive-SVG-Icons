"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import useMeasure from "react-use-measure";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Airplane01Icon,
  BedDoubleIcon,
  Calendar03Icon,
  CalendarAnalysisIcon,
  Call02Icon,
  Car01Icon,
  GiftIcon,
  Image01Icon,
  Mail01Icon,
  MapsLocation01Icon,
  Message01Icon,
  MusicNote01Icon,
  Note01Icon,
  Restaurant01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════════════════════════════
 * ORCHID AI 01 — split hero
 *
 * Left: a plain greige panel with a corner-notch navbar, the type
 * stack bottom-anchored. Right: a photograph with the stack over it —
 * a screenful of unread work at the top, the Orchid mark in the
 * middle, seven finished things at the bottom.
 *
 * THE FIGURE READS DOWNWARD, and that is the point of it. As a
 * left-to-right row this was a data flow: sources, hub, results —
 * legible to an engineer, moving to nobody. Turned a quarter turn it
 * becomes pressure resolving into relief, which is a thing a person
 * recognises before they have read a single label. Nothing is rotated
 * in the CSS sense; every shape keeps its own orientation and only the
 * arrangement turns, so the chips stay upright and readable.
 *
 *   [ screen: 8 apps — 4 counted, 4 dotted ]
 *                    ↓  stems, from the counted four
 *                 [ hub ]
 *                    ↓  fan
 *   [ 7 chips, 4 across and 3 nested into the gaps ]
 *
 * THE NUMBERS RECONCILE: the counts total seven and there are seven
 * chips. Most people will not check. The ones who do get a figure that
 * holds, instead of decoration wearing the costume of information. The
 * other four apps carry dots rather than counts precisely so they can
 * look alive without entering that sum — see APPS.
 *
 * LAYOUT IS FLEX, NOT A SCALED DESIGN BOX. The earlier revision of
 * this hero solved every node position against a fixed 560×360 box
 * (W, H, TILE, HUB, CARD_W, HUB_X, CARD_X, LANES …) and then scaled
 * the whole thing with a transform to fit its column. That renders,
 * but it is closed to the two things this component still has to
 * grow: `sm:`/`md:`/`lg:` variants and a dark theme. A transform-
 * scaled box cannot take a breakpoint — every size inside it is one
 * number, and changing that number at a breakpoint means re-deriving
 * eight connector paths by hand.
 *
 * The connectors instead MEASURE their own box and put `lanes` at
 * (2i+1)/2n across it (see <Connectors>). At n=3 that is 1/6, 3/6, 5/6
 * — where `grid-rows-3` centres its rows. At n=4 it is 1/8, 3/8, 5/8,
 * 7/8 — where `grid-cols-4` centres its columns. The stems are given
 * the app grid's exact width and the fan the chip row's, so both meet
 * what they point at by construction rather than by a nudge, at any
 * size, in either orientation.
 *
 * BELOW md the connectors are dropped — there is no useful diagonal in
 * a 340px column — and the chip cluster becomes two plain columns,
 * since a staggered grid two items wide is not a stagger, it is a
 * misalignment.
 *
 * EXTERNAL DEPENDENCY: `@property --bevel-angle` and the
 * `bevel-button-spin` keyframes live in globals.css. They have to be
 * declared at parse time — a custom property registered later does
 * not make an already-parsed inline var() animatable — so they cannot
 * live in this file. Without them the buttons still render correctly
 * on the 180deg fallback; the highlight just stops sweeping.
 * ════════════════════════════════════════════════════════════════════ */

/* ── Type scale ──────────────────────────────────────────────────────
 *
 * Seven roles, each pairing size with its leading, weight and tracking,
 * so setting type is one decision instead of four. This replaces nine
 * ad-hoc size declarations, three of which repeated the same value at
 * different weights.
 *
 * THIS IS THE ONE EXCEPTION to the call-site rule this file otherwise
 * follows. Everywhere else the trade is repetition for locality, and
 * repetition is harmless: a rounded corner written twice is two corners
 * that happen to match. A size written twice is a claim that they are
 * the same step, and nothing holds them to it — the moment one moves
 * the hierarchy quietly stops being a scale. Roles are what keep that
 * honest, so they live in one place and are read from it.
 *
 * `ui` is weight 400. Emphasis inside a role is one weight step up,
 * applied at the call site (`font-medium` on the buttons), never a size
 * change — that is what keeps buttons and nav links on the same step
 * instead of drifting into two.
 *
 * `eyebrow` and `ui` deliberately set no leading. They are single-line
 * roles, so their line box only affects the gap below them, and the
 * bottom-anchored stack is measured against what they inherit today. */
const TYPE = {
  display:
    "text-[clamp(32px,4.1vw,58px)] leading-[1.24] font-regular tracking-[-0.03em]",
  eyebrow: "text-[clamp(18px,1.3vw,21px)] font-medium tracking-[-0.005em]",
  body: "text-[clamp(16px,1.15vw,19px)] leading-[1.55] text-pretty",
  brand: "text-[17px] font-semibold tracking-[-0.02em]",
  ui: "text-[16px] tracking-[-0.01em]",
  cardLabel: "text-[15px] leading-[1.33] font-semibold tracking-[-0.01em]",
  cardDetail: "text-[13px] leading-[1.38] font-normal tabular-nums",
} as const;

/* The chip serif. `font-serif` resolves to Tailwind's generic stack —
 * Georgia on most machines — while the app already loads Playfair
 * Display with a real italic and exposes it on <html> (app/layout.tsx).
 * Rendering the system serif meant paying for a display face and not
 * using it.
 *
 * The size drops from 1.02em to 0.96em with the swap. Playfair's
 * x-height is roughly 0.52em against Georgia's 0.48em, so at equal
 * font-size it reads visibly larger next to the Inter around it; this
 * takes the optical size back to where the chip was tuned.
 *
 * THE FALLBACK CHAIN IS NOT DECORATION. `--font-playfair` is defined on
 * <html> by this app's layout and by nothing else, so in an installed
 * copy the variable does not resolve. font-family is inherited, and an
 * unresolved var() in an inherited property does not fall back to the
 * initial value — it inherits, which here means the chip would quietly
 * come out in Inter and stop being a serif at all. The chain inside the
 * var() keeps that case on Georgia, which is where it started.
 *
 * THE LEADING IS DELIBERATELY BELOW 1. Playfair is a display face with
 * tall metrics — its own box runs about 1.34em, and most of that excess
 * sits above the caps. At the 0.9 this used to carry, the serif's inline
 * box still reached higher above the baseline than the icon tile did,
 * while reaching barely at all below it. That box, not the ink, is what
 * a line box is built from, so it was the serif that set the chip's top
 * edge and the tile that set its bottom — which is exactly why the space
 * above the tile came out about twice the space below.
 *
 * 0.45 pulls the box inside the tile's extents at both ends, with enough
 * margin that it stays inside even if Playfair's real ascent differs
 * from the estimate. The tile then sizes the line box on its own and the
 * chip's padding lands equally above and below it. The ink is unchanged
 * — leading moves the box, not the glyphs — so ascenders and descenders
 * still draw at full size, into the padding. */
const CHIP_SERIF =
  "font-[family-name:var(--font-playfair,ui-serif,Georgia,serif)] text-[0.96em] leading-[0.45] italic";

/* ── The chip shell ──────────────────────────────────────────────────
 *
 * WHY inline-block AND NOT inline-flex. The chip sits on the headline's
 * baseline, and an inline-flex box does not have the baseline you would
 * expect: it borrows the first flex item's. The first item here is the
 * icon tile, which holds an SVG and no text, so it has no baseline of
 * its own and the browser synthesizes one from its bottom margin edge.
 * The headline was therefore aligning its baseline to the BOTTOM OF THE
 * ICON, and the serif word rode wherever centring happened to leave it
 * — never on the line the rest of the sentence sits on.
 *
 * As an inline-block the chip's baseline is the baseline of its last
 * line box, which is the serif word. So "text" lands on the same line
 * as "Send one" by construction, and the tile is positioned relative to
 * that rather than defining it.
 *
 * EQUAL SPACE ABOVE AND BELOW COMES FROM ONE RULE: the tile has to be
 * the tallest inline-level box on the line. A line box is the union of
 * every inline box on it, so whichever runs highest sets the top edge
 * and whichever runs lowest sets the bottom. When that is two different
 * boxes the padding cannot be symmetric no matter what it is set to —
 * it is being added to an already-lopsided line.
 *
 * `leading-[0.45]` shrinks the strut inside the tile's extents (0.663em
 * above the baseline, 0.117em below, from `align-middle`), and
 * CHIP_SERIF does the same for the word. With both inside it, the line
 * box IS the tile: 0.78em exactly. `py-[0.14em]` then reads as 0.14em
 * of space above the tile and 0.14em below, because that is now
 * literally what it is.
 *
 * 0.14 rather than 0.10 because of the descender in "day". Playfair's
 * tail drops about 0.246em under the baseline, which is 0.129em past
 * the tile's bottom edge — at 0.10em of padding the y would have hung
 * out of the chip. 0.14 contains it and keeps the chip at the 1.06em it
 * has always been.
 *
 * THE RIM IS A SHADOW, NOT A BORDER, and that is not a stylistic
 * preference here — a real border would undo the work above. Preflight
 * puts everything on `border-box`, so a 1px border takes its pixel out
 * of the padding: the 0.14em top and bottom would become 0.14em minus
 * 1px, and the descender clearance that number was chosen to give would
 * go with it. `inset 0 0 0 1px` paints on the inside of the padding box
 * and costs no layout at all, so the line box, the tile's centring and
 * the equal spacing all stay exactly where they were set.
 *
 * The colour is per chip and lives at the call site, on the same line as
 * the fill it belongs to — same rule as the tile: the chip's own hue, a
 * step or two down from the fill. */
const CHIP =
  "mx-[0.12em] inline-block rounded-[0.22em] px-[0.22em] py-[0.14em] align-baseline leading-[0.45]";

/* `align-middle`, so the tile's centre sits half an x-height above the
 * baseline. That is a real typographic relationship rather than a
 * nudge: it tracks the font, and it lands within about 0.02em of the
 * serif's own x-height centre, so the mark and the word read as
 * centred on each other at any size the clamp produces.
 *
 * The inset pair is the outcome-card tile's recipe restated for a
 * saturated fill — a rim and a shadow under the top edge, in the tile's
 * own hue two Tailwind steps down. Those two steps are already in the
 * palette: each chip's serif colour is that darker sibling, so the
 * shadow introduces no new value, it reuses the word's ink.
 *
 * 0.08em, AND NO SQUIRCLE. Both of those are corrections.
 *
 * THE RADIUS. The concentric rule this file uses on the frame and the
 * cards — inner radius = outer radius − padding — needs ONE padding
 * value, and the chip does not have one: `px-[0.22em]` against
 * `py-[0.14em]`, because the horizontal padding is breathing room for
 * a word and the vertical is descender clearance for Playfair's y.
 * Two paddings give two answers, 0 across and 0.08 down.
 *
 * At the 0.18em this carried, the arcs were not merely mismatched,
 * they were unrelated: the chip's corner is struck from a centre
 * 0.22em in on both axes, the tile's from 0.40em across and 0.32em
 * down — 0.206em apart, which is further than either radius is long.
 * There was no sense in which those two curves were parallel, and the
 * tile read as rounder than the box holding it.
 *
 * 0.08 is the vertical answer, and vertical is the axis that shows.
 * The tile's top edge sits 0.14em under the chip's; its left edge sits
 * 0.22em in. The eye compares the two corners across the shorter gap,
 * so that is the one worth being right. A tile at 10% of its own size
 * reads squarer than a chip at 21% of its height, which is not a
 * mistake — an inner shape in a concentric pair is ALWAYS relatively
 * squarer. That is what concentric looks like.
 *
 * THE SQUIRCLE. `corner-squircle` is `corner-shape: squircle`, and it
 * was the only squircle in this headline: the chip around it is a
 * plain round rect. Nesting two different corner families 2–3px apart
 * is the worst place to put that mismatch — the same argument the
 * outcome card makes at its own radius, in reverse. It was also
 * Chrome-only. `corner-shape` has no Safari or Firefox support, so
 * most people were already seeing the round rect this now specifies
 * everywhere, and the tile changed shape by browser for no stated
 * reason. The diagram's tiles keep theirs; they sit on a photograph
 * next to other squircles, not inside a round rect. */
const CHIP_TILE =
  "mr-[0.28em] inline-flex h-[0.78em] w-[0.78em] items-center justify-center rounded-[0.08em] align-middle";

const NAV_LINKS = ["Features", "Use cases", "Pricing", "Integrations"];

/* ── The screen's apps ───────────────────────────────────────────────
 *
 * Eight, in a 4×2 grid, and the ROW MATTERS: the four Orchid reads are
 * row one, the four it leaves alone are row two. That is not a cosmetic
 * sort. The inbound stems drop from row one, and putting those four one
 * per column means their origins land on the grid's own column centres
 * — the same (2i+1)/8 the connector box solves to — so the stems meet
 * the icons by construction rather than by a nudge.
 *
 * TWO KINDS OF BADGE, and the difference is the whole point.
 *
 * Row one carries COUNTS, and they total seven — the number of outcome
 * chips below. Nobody is required to check that and most people will
 * not; the ones who do get a figure that holds up rather than
 * decoration wearing the costume of information.
 *
 * Row two carries DOTS: unread, no number. Row two used to carry
 * nothing at all, which read as four dead apps and made the screen look
 * half-drawn. But numbering them would have broken the sum — eight
 * numbered badges cannot total seven, since the smallest count is one —
 * and the choice was never "reconcile or look populated". A dot is
 * still a notification; it just is not a quantity. So the screen fills
 * out, and the only numbers on it are the ones the figure accounts for.
 *
 * It is also the more honest picture. A real screen has badges on
 * things nobody is going to deal with today. The four with stems are
 * the ones Orchid actually read, and the stems — not the badges — are
 * what say so.
 *
 * The apps are named, which the three anonymous glyphs they replace
 * were not. A 44px envelope does not say whether Orchid reads mail or
 * sends it; "Mail" under it does. Naming is the cheapest information
 * per pixel available in the whole section. */
const APPS: ReadonlyArray<{
  icon: typeof Mail01Icon;
  name: string;
  /* A count, or a bare dot, or neither. `as const` on the array would
   * infer eight separate object shapes rather than one union with
   * optional keys, and `app.badge` would then not exist on half of them
   * — hence the annotation instead. */
  badge?: number;
  dot?: boolean;
}> = [
  { icon: Mail01Icon, name: "Mail", badge: 3 },
  { icon: Message01Icon, name: "Messages", badge: 2 },
  { icon: Calendar03Icon, name: "Calendar", badge: 1 },
  { icon: Note01Icon, name: "Notes", badge: 1 },
  { icon: MapsLocation01Icon, name: "Maps", dot: true },
  { icon: Image01Icon, name: "Photos", dot: true },
  { icon: MusicNote01Icon, name: "Music", dot: true },
  { icon: Call02Icon, name: "Phone", dot: true },
];

/* Seven outcomes, one story: a single message about a trip, handled.
 *
 * `detail` is capped near eighteen characters. The chips sit four
 * across a 540px figure, so each gets about 126px and the detail line
 * has roughly 108px of measure — "SFO → AUA · Thu 6:40a" would have
 * truncated mid-time, and a route that swallows its own departure says
 * nothing at all. Trimmed to what fits, every line is readable; left
 * long, four of seven would end in an ellipsis.
 *
 * `source` NAMES THE APP EACH OUTCOME CAME OUT OF, and it is what turns the
 * reconciliation above from a fact stated in a comment into something the
 * figure performs. Every badge count equals the number of chips citing that
 * app — Mail 3, Messages 2, Calendar 1, Notes 1 — so when a chip's check
 * pops, its source badge can tick down by exactly one, and the four badges
 * reach zero at the moment the seventh check lands. The sum is no longer a
 * thing a careful reader could verify; it is the animation.
 *
 * The strings match APPS[].name. That is checked below rather than typed,
 * because the useful failure is "these two lists drifted", which a type
 * cannot notice — a source can be a perfectly valid app name and still be
 * the wrong COUNT of them, stranding a badge at 1 forever. */
const OUTCOMES = [
  {
    icon: Airplane01Icon,
    label: "Flight booked",
    detail: "SFO → AUA · Thu",
    source: "Mail",
  },
  {
    icon: BedDoubleIcon,
    label: "Hotel held",
    detail: "Bucuti · 3 nights",
    source: "Mail",
  },
  {
    icon: Restaurant01Icon,
    label: "Table reserved",
    detail: "Zeerovers · Fri",
    source: "Messages",
  },
  {
    icon: Car01Icon,
    label: "Airport ride",
    detail: "Thu 4:55a pickup",
    source: "Notes",
  },
  {
    icon: Calendar03Icon,
    label: "Days cleared",
    detail: "Thu–Sun blocked",
    source: "Calendar",
  },
  {
    icon: Mail01Icon,
    label: "Replies drafted",
    detail: "4 for your review",
    source: "Mail",
  },
  {
    icon: GiftIcon,
    label: "Gift ordered",
    detail: "Arrives Wed",
    source: "Messages",
  },
] as const;

/* How many of the first `n` outcomes came out of a given app. This is the
 * whole drain: a badge shows its count minus this, and disappears at zero. */
const spentBy = (name: string, n: number) =>
  OUTCOMES.slice(0, n).filter((o) => o.source === name).length;

/* Where each dotted app falls in the closing sweep. Keyed off the dotted
 * apps alone rather than off the index in APPS, so the sweep starts at 0
 * and stays contiguous no matter how the two rows are ordered or how
 * many of each there are. */
const DOT_ORDER = new Map(
  APPS.filter((a) => a.dot).map((a, k) => [a.name, k] as const),
);

/* Dev-only reconciliation check. Stripped in production builds.
 *
 * The drain is silent when it breaks. Add an eighth outcome, or retarget one
 * from Mail to Notes, and nothing throws — a badge simply sits at 1 after the
 * sequence ends, which looks like a rendering bug and is really a bookkeeping
 * one. Two lines here name it at the point of the mistake. */
if (process.env.NODE_ENV !== "production") {
  for (const app of APPS) {
    if (
      app.badge !== undefined &&
      app.badge !== spentBy(app.name, OUTCOMES.length)
    )
      console.warn(
        `[orchid-ai-01] ${app.name} has a badge of ${app.badge} but ${spentBy(app.name, OUTCOMES.length)} outcome(s) cite it. The badge will not reach zero.`,
      );
  }
}

/* Elbow with rounded corners: out along the RUN axis, turn, cross on
 * the other axis, turn, back onto the run axis. Radius is clamped to
 * half of each span so a short connector degrades to a gentler curve
 * instead of self-intersecting — which matters more than it did at a
 * fixed size, since the box this is drawn into is free to be 40px or
 * 120px across.
 *
 * `axis` is which way the connector RUNS end to end. "x" is the
 * original: out horizontally, step vertically, in horizontally. "y" is
 * the same figure turned a quarter turn, which is what the vertical
 * layout needs — and it is written as a coordinate swap rather than a
 * second function, so there is one elbow to get right instead of two
 * that have to be kept in agreement. */
function elbow(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  axis: "x" | "y" = "x",
) {
  /* Solve every elbow in run-major space — u runs, v crosses — then put
   * the pair back in the caller's order on the way out. */
  const [u1, v1, u2, v2] = axis === "x" ? [x1, y1, x2, y2] : [y1, x1, y2, x2];
  const pt = (u: number, v: number) =>
    axis === "x" ? `${u} ${v}` : `${v} ${u}`;

  const dv = v2 - v1;
  if (Math.abs(dv) < 0.5) return `M ${pt(u1, v1)} L ${pt(u2, v2)}`;

  const midU = (u1 + u2) / 2;
  const r = Math.min(14, Math.abs(u2 - u1) / 2 - 1, Math.abs(dv) / 2);
  const d = Math.sign(dv);
  return [
    `M ${pt(u1, v1)}`,
    `L ${pt(midU - r, v1)}`,
    `Q ${pt(midU, v1)} ${pt(midU, v1 + d * r)}`,
    `L ${pt(midU, v2 - d * r)}`,
    `Q ${pt(midU, v2)} ${pt(midU + r, v2)}`,
    `L ${pt(u2, v2)}`,
  ].join(" ");
}

/* ── Connector box ───────────────────────────────────────────────────
 *
 * Draws the elbows across its own box. It knows nothing about the
 * tiles, the screen or the chips: it measures itself, spaces `lanes`
 * evenly across the CROSS axis, and fans them to or from the centre of
 * that axis, where the hub is.
 *
 * LANE CENTRES ARE (2i+1)/2n. For three lanes that is 1/6, 3/6, 5/6 —
 * exactly where `grid-rows-3` puts each row's centre. For four it is
 * 1/8, 3/8, 5/8, 7/8, which is exactly where `grid-cols-4` puts each
 * column's centre. One formula covers both, so the connectors cannot
 * drift out of alignment with whatever grid they are pointing at, at
 * any count, without anyone restating the fractions.
 *
 * `axis` is the direction of travel: "x" for the original left-to-right
 * figure, "y" for the vertical one, where the fan runs top to bottom
 * and the lanes spread across the width.
 *
 * `in` reads context inward, `out` carries results outward. The
 * travelling pulses only run on `out`, because that is the direction
 * the story goes.
 *
 * Nothing renders until the measurement lands, which is one frame. The
 * box is given a size by its parent, so it never collapses while it
 * waits — the layout does not shift when the paths appear. */
function Connectors({
  direction,
  axis = "x",
  lanes = 3,
  className,
}: {
  direction: "in" | "out";
  axis?: "x" | "y";
  lanes?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [ref, { width, height }] = useMeasure();

  const ready = width > 0 && height > 0;

  /* run = the axis the connector travels along, cross = the one the
   * lanes spread across. Naming them keeps the two directions from
   * being two near-identical blocks of coordinate arithmetic. */
  const run = axis === "x" ? width : height;
  const cross = axis === "x" ? height : width;
  const at = (i: number) => ((2 * i + 1) / (2 * lanes)) * cross;

  const paths = ready
    ? Array.from({ length: lanes }, (_, i) =>
        direction === "in"
          ? axis === "x"
            ? elbow(0, at(i), run, cross / 2, "x")
            : elbow(at(i), 0, cross / 2, run, "y")
          : axis === "x"
            ? elbow(0, cross / 2, run, at(i), "x")
            : elbow(cross / 2, 0, at(i), run, "y"),
      )
    : [];

  return (
    <div ref={ref} className={cn("relative", className)} aria-hidden>
      {ready && (
        <svg
          width={width}
          height={height}
          className={cn(
            "absolute inset-0",
            "[filter:drop-shadow(0_1px_1.5px_rgba(13,26,50,0.42))]",
          )}
          fill="none"
        >
          {/* ONE PASS, AND THE SEPARATION IS A SHADOW.
           *
           * A #DCD8CB hairline is the frame's own greige — the right
           * colour, and no guarantee of contrast, since it is a light
           * value laid straight onto a photograph. Over the pale sky at
           * the top of this image it disappeared outright.
           *
           * The first fix was a casing: the same path drawn twice, a
           * wider dark stroke under a narrower light one. It solved the
           * contrast and cost the line its character — a cased stroke
           * has two visible edges, so at 1.5px it stops reading as a
           * line and starts reading as a thin pipe with dark walls.
           * That is the correct technique for a map label and the wrong
           * one for a hairline this fine.
           *
           * A drop shadow does the same job with no second edge. The
           * line keeps exactly its own 1.5px; the shadow darkens the
           * ground a pixel below and behind it, which is enough to
           * separate the greige from the sky without anything being
           * drawn that a reader could point at. It sits on the <svg>
           * rather than each path so the travelling pulses get it too,
           * for one filter instead of eight. */}
          {paths.map((d, i) => (
            <path
              key={i}
              d={d}
              stroke="#DCD8CB"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          ))}

          {/* Travelling pulses. pathLength={1} normalises every path to
              the same 0–1 scale, so one dash length and one offset
              animation work on all three regardless of how far each
              runs — and keep working when the column resizes. */}
          {!reduced &&
            direction === "out" &&
            paths.map((d, i) => (
              <motion.path
                key={`pulse-${i}`}
                d={d}
                pathLength={1}
                stroke="#FFFFFF"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeDasharray="0.14 1"
                initial={{ strokeDashoffset: 1.14, opacity: 0 }}
                animate={{ strokeDashoffset: 0, opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 1.6,
                  ease: "linear",
                  repeat: Infinity,
                  repeatDelay: 1.4,
                  delay: 1 + i * 0.45,
                }}
              />
            ))}
        </svg>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * ANIMATION STORYBOARD — the vertical figure
 *
 *     0ms  the screen fades up
 *   420ms  badges pop on, 110ms apart — this is the PRESSURE beat, and
 *          it wants to land before anything else moves, because the
 *          whole figure is an answer to it
 *   900ms  the four stems draw down from the badged apps
 *  1180ms  the hub springs in
 *  1400ms  the outbound fan draws, and the travelling pulses start
 *  1560ms  the seven chips land — four, then the offset three, 90ms
 *          apart
 *  2200ms  THE DRAIN. Seven times, 240ms apart: a check pops on a
 *          chip, and 200ms later the badge on the app that chip came
 *          out of ticks down by one. The four badges hit zero and
 *          vanish exactly as the seventh check lands.
 *  3990ms  the four dots sweep out, 70ms apart — the exhale
 *  4400ms  rest — an empty screen above, seven finished things below,
 *          and only the pulses still moving.
 *
 * THE DOTS GO LAST, AND THEY GO AS A GROUP. They are the one thing on
 * the screen the drain cannot account for: no outcome cites them, so
 * nothing ticks them down, and left alone they sat there after
 * everything else had cleared — four unresolved marks under an empty
 * row, which read as a sequence that had not finished rather than as
 * a deliberate remainder.
 *
 * The cost of clearing them is real and worth naming: the figure now
 * says Orchid emptied the whole screen, where before it said Orchid
 * handled the seven things that mattered and left the rest. The
 * second is the more honest claim. The first is the one the
 * composition can actually deliver — a screen that half-clears reads
 * as a bug at a glance and as nuance only on the second viewing, and
 * almost nobody gives it a second viewing.
 *
 * So they sweep, fast and together, AFTER the last tick rather than
 * among them. Interleaved they would have looked like part of the
 * count and put the reconciliation back in doubt; as a separate beat
 * at the end they are clearly a different kind of thing being cleared
 * — which is what they always were.
 *
 * THE DRAIN IS THE POINT OF THE WHOLE FIGURE. Everything before it is
 * setup: this is the top emptying into the bottom, which is the
 * product in one gesture. An earlier pass cut it, on the grounds that
 * an entrance plays once and would leave a resting state with no
 * counts in it — a screen of apps with nothing to say, seen by
 * everyone who scrolls back after 2.5s.
 *
 * Two things answer that, and neither is "don't do it".
 *
 * FIRST, THE SEQUENCE IS NOW TIED TO THE VIEWPORT, not to mount. It
 * arms when the panel comes into view and REARMS every time it comes
 * back, so scrolling away and returning replays it from full badges.
 * It is not a thing that gets spent.
 *
 * SECOND, THE DRAINED STATE IS THE BETTER RESTING STATE. An empty
 * inbox over seven completed things is not information the figure
 * lost, it is the claim the section is making. The old objection held
 * when the chips were decoration; they carry the story now.
 *
 * WHY THE CHECK STAGGER TRIPLED. At 100ms the seven checks were one
 * event — a ripple. The drain needs them to be seven, because each one
 * has to be read as CAUSING the tick that follows it 200ms later. Below
 * about 200ms apart the check of chip n+1 lands on top of the tick from
 * chip n and the causal chain reads as noise. 240 leaves each pair its
 * own moment and puts the whole run at 3.8s, which is long for product
 * UI and correct for a hero: this is the payoff, not a transition
 * somebody is waiting through to get somewhere.
 * ════════════════════════════════════════════════════════════════════ */
const T = {
  screen: 0,
  badges: 420,
  badgeStagger: 110,
  stems: 900,
  hub: 1180,
  fan: 1400,
  chips: 1560,
  chipStagger: 90,
  checks: 2200,
  checkStagger: 240,
  /* How far the badge tick trails the check that causes it. Long enough
   * to read as consequence rather than coincidence, short enough that
   * the two are still one event. */
  tick: 200,
  /* The dots' exhale, measured from the last tick rather than from
   * zero, so it stays attached to the end of the drain if any of the
   * timings above move. Tighter stagger than anything else in the
   * figure: this is a sweep, not seven separate moments. */
  dotsLag: 150,
  dotStagger: 70,
} as const;

/* ── The screen ──────────────────────────────────────────────────────
 *
 * A 4:3 device face holding the app grid. Same greige glass as
 * everything else in the diagram, so it joins the family rather than
 * introducing a third surface.
 *
 * NO NOTCH, deliberately. The left panel's navbar is already a notch
 * stamped into its corner, and a second notch across the seam would be
 * two unrelated things wearing one shape. The top strip does the
 * device work instead — three dots and a hairline, which is enough
 * cue at this size and costs nothing structurally.
 *
 * THE GRID IS THE CONNECTOR'S RULER. Four columns, and the badged apps
 * occupy the whole first row, so their centres sit at 1/8, 3/8, 5/8 and
 * 7/8 of the grid's width. The stem box below is given exactly the
 * grid's width, so its lanes resolve to the same fractions and the
 * stems leave from under the icons without a measured offset.
 *
 * `drained` is how many outcomes have been ticked off below. It is the
 * only thing connecting this half of the figure to the other, and it is
 * deliberately a single number rather than a list of per-app states: the
 * chips complete in one fixed order, so the position in that order is the
 * whole truth, and each badge derives its own count from it. */
function Screen({
  reduced,
  drained,
}: {
  reduced: boolean | null;
  drained: number;
}) {
  return (
    <motion.div
      className={cn(
        "corner-squircle relative w-full max-w-[380px] overflow-hidden rounded-[18px] bg-[#DCD8CB]/42 p-4 backdrop-blur-[14px]",
        "[box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(13,26,50,0.06),0_14px_30px_-12px_rgba(13,26,50,0.28)]",
      )}
      style={{ aspectRatio: "4 / 3" }}
      initial={reduced ? undefined : { opacity: 0, y: -10, scale: 0.97 }}
      animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        visualDuration: 0.55,
        bounce: 0.18,
        delay: T.screen / 1000,
      }}
    >
      {/* The device strip. Three dots and a rule — a window chrome cue
          rather than a drawn menu bar, since anything more literal
          starts asking to be readable at 420px and cannot be. */}
      <div className={cn("flex items-center gap-[5px] pb-3")} aria-hidden>
        <span className={cn("size-[7px] rounded-full bg-[#0D1A32]/16")} />
        <span className={cn("size-[7px] rounded-full bg-[#0D1A32]/12")} />
        <span className={cn("size-[7px] rounded-full bg-[#0D1A32]/10")} />
        <span className={cn("ml-2 h-px flex-1 bg-[#0D1A32]/8")} />
      </div>

      {/* Row one is the badged four, row two the rest — see APPS. */}
      <div
        className={cn(
          "grid h-[calc(100%-1.75rem)] grid-cols-4 content-center gap-x-3 gap-y-4 sm:gap-x-5",
        )}
      >
        {APPS.map((app, i) => {
          /* What this app still has outstanding. `undefined` for the
           * dotted four, which never carried a quantity and so have
           * nothing to drain — see APPS. */
          const left =
            app.badge === undefined
              ? undefined
              : app.badge - spentBy(app.name, drained);

          /* The dots have no count to run down, so their cue is the
           * drain being over rather than any step inside it. */
          const swept = drained >= OUTCOMES.length;

          return (
            <div
              key={app.name}
              className={cn("flex flex-col items-center gap-[6px]")}
            >
              <motion.div
                className={cn(
                  "corner-squircle relative flex size-[44px] items-center justify-center rounded-[12px] bg-white/88 sm:size-[52px] sm:rounded-[14px]",
                  "[box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.9),0_1px_2px_rgba(13,26,50,0.08),0_4px_10px_-4px_rgba(13,26,50,0.18)]",
                )}
                initial={reduced ? undefined : { opacity: 0, scale: 0.88 }}
                animate={reduced ? undefined : { opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  visualDuration: 0.4,
                  bounce: 0.26,
                  delay: (T.screen + 160 + i * 45) / 1000,
                }}
              >
                <HugeiconsIcon
                  icon={app.icon}
                  size={22}
                  strokeWidth={1.8}
                  color="#0D1A32"
                />

                {/* The badge. Orange rather than iOS red — red would be a
                  hue this section does not own, and the orange is
                  already carried by the headline's second chip, so the
                  count reads as "unread" without importing a colour.
                  The ring is the screen's own greige rather than white,
                  so the badge punches out of the surface it sits on.
                  Tabular figures so a 1 and a 3 occupy the same width
                  and the four badges cannot come out different sizes.

                  IT POPS IN, COUNTS DOWN, AND IS CONSUMED. The count
                  is `left`, not `app.badge` — what this app still has
                  outstanding once the chips below start completing —
                  so a badge of 3 goes 3 → 2 → 1 → gone across the
                  drain, one step per outcome that cites it.

                  THREE PIECES OF MOTION, AND THEY ARE DIFFERENT ON
                  PURPOSE:

                  THE POP is the entrance, unchanged: a spring on a
                  delay, the pressure beat landing before anything else
                  moves.

                  THE DIGIT ROLLS. The outgoing number leaves upward and
                  the incoming one rises from below, inside a clipped
                  pill — an odometer, which is the one figure everybody
                  already reads as "this is counting". A crossfade in
                  place would have been cheaper and would have read as a
                  glitch: two digits occupying one spot with no account
                  of where the first went.

                  Both digits are absolutely positioned so they can
                  overlap during the roll, which costs the pill the
                  content that used to size it — hence the explicit
                  h-[18px] where `leading-[18px]` used to do that job.
                  min-w-[18px] and tabular-nums keep it the same circle
                  it was.

                  THE VANISH IS NOT A FADE. `scale: 0.4` with the
                  opacity, on 200ms ease-out — the badge collapses
                  toward its own centre rather than dissolving, which
                  reads as consumed instead of as forgotten. A fade
                  alone at this size looks like a rendering failure.
                  Exit-only timing, so it does not inherit the
                  entrance's delayed spring and sit still for two
                  seconds before leaving. */}
                <AnimatePresence>
                  {((app.dot && !swept) || (left ?? 0) > 0) && (
                    <motion.span
                      key="badge"
                      className={cn(
                        "absolute -top-[5px] -right-[5px] rounded-full bg-[#F0563C]",
                        "[box-shadow:0_0_0_2px_rgba(220,216,203,0.95),0_2px_5px_rgba(13,26,50,0.3)]",
                        app.badge !== undefined
                          ? "flex h-[18px] min-w-[18px] items-center justify-center overflow-hidden px-[5px] text-[11px] font-semibold tabular-nums text-white"
                          : /* The dot is 10px against the count's 18 — small
                             enough that it never reads as a number that
                             failed to load, which a same-sized empty pill
                             would. It sits on the same corner and the same
                             ring, so the two are obviously the same family
                             at two weights. It does not COUNT DOWN — it was
                             never a quantity — but it does clear, in one
                             sweep once the counts are gone. See the exit
                             below, and T.dotsLag. */
                            "block size-[10px]",
                      )}
                      initial={
                        reduced ? undefined : { opacity: 0, scale: 0.3, y: -3 }
                      }
                      animate={
                        reduced ? undefined : { opacity: 1, scale: 1, y: 0 }
                      }
                      /* The counts leave the instant they hit zero;
                         the dots leave on a delay, because all four
                         of them are told to go on the same frame and
                         a delay is the only thing making it a sweep
                         instead of a blink. Same collapse either way
                         — one exit, two schedules. */
                      exit={{
                        opacity: 0,
                        scale: 0.4,
                        transition: {
                          duration: 0.2,
                          ease: [0.215, 0.61, 0.355, 1],
                          delay: app.dot
                            ? (T.dotsLag +
                                (DOT_ORDER.get(app.name) ?? 0) * T.dotStagger) /
                              1000
                            : 0,
                        },
                      }}
                      transition={{
                        type: "spring",
                        visualDuration: 0.34,
                        bounce: 0.5,
                        delay: (T.badges + i * T.badgeStagger) / 1000,
                      }}
                    >
                      {/* `initial={false}` so the first digit is simply
                        there when the pill pops, rather than rolling in
                        underneath an entrance that is already moving. */}
                      {left !== undefined && (
                        <AnimatePresence initial={false}>
                          <motion.span
                            key={left}
                            className={cn(
                              "absolute inset-0 flex items-center justify-center leading-none",
                            )}
                            initial={{ y: 9, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -9, opacity: 0 }}
                            transition={{
                              duration: 0.18,
                              ease: [0.215, 0.61, 0.355, 1],
                            }}
                          >
                            {left}
                          </motion.span>
                        </AnimatePresence>
                      )}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              <span
                className={cn(
                  "truncate text-[10px] leading-none font-medium tracking-[-0.01em] text-[#5A6478] sm:text-[11px]",
                )}
              >
                {app.name}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* The five-petal mark. Used at two sizes — the nav wordmark and the
 * hub — so it takes its size from the class it is given. */
function OrchidMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn(className)}>
      <ellipse cx="12" cy="5.6" rx="3.1" ry="4.4" />
      <ellipse
        cx="5.9"
        cy="10.1"
        rx="3.1"
        ry="4.4"
        transform="rotate(-72 5.9 10.1)"
      />
      <ellipse
        cx="8.2"
        cy="17.6"
        rx="3.1"
        ry="4.4"
        transform="rotate(-144 8.2 17.6)"
      />
      <ellipse
        cx="15.8"
        cy="17.6"
        rx="3.1"
        ry="4.4"
        transform="rotate(144 15.8 17.6)"
      />
      <ellipse
        cx="18.1"
        cy="10.1"
        rx="3.1"
        ry="4.4"
        transform="rotate(72 18.1 10.1)"
      />
    </svg>
  );
}

/* ── The figure ──────────────────────────────────────────────────────
 *
 * The whole right-panel stack, and the clock that drives its second
 * half. It is a component ONLY so that it can be remounted: the parent
 * keys it on a run counter, and a key change resets every delay-based
 * entrance in here plus both counters below, in one move, without
 * anything having to know it is being replayed.
 *
 * That is also why the counters are `useState(0)` and nothing ever
 * resets them. There is no reset — there is only a new mount.
 *
 * TWO COUNTERS, NOT ONE. `checked` drives the ticks on the chips,
 * `drained` drives the badges on the screen, and the second trails the
 * first by T.tick. One number would fire both on the same frame, and
 * simultaneous is exactly what this beat must not be: the check has to
 * be SEEN to cause the tick. Two things that happen together read as
 * one thing happening, not as one thing answering another.
 *
 * Under reduced motion the clock never starts, so both stay at 0 —
 * full badges above, all seven checks already present below, nothing
 * moving. The drain is the one beat that gets no reduced variant, and
 * deliberately: it is a quantity changing over time, so there is no
 * still frame that carries it, and jump-cutting seven counts to zero
 * would be worse for a motion-sensitive reader than not running. */
function Figure({ reduced }: { reduced: boolean | null }) {
  const [checked, setChecked] = useState(0);
  const [drained, setDrained] = useState(0);

  useEffect(() => {
    if (reduced) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    OUTCOMES.forEach((_, n) => {
      const at = T.checks + n * T.checkStagger;
      timers.push(setTimeout(() => setChecked(n + 1), at));
      timers.push(setTimeout(() => setDrained(n + 1), at + T.tick));
    });

    return () => timers.forEach(clearTimeout);
  }, [reduced]);

  return (
    <div className={cn("flex w-full flex-col items-center")}>
      <Screen reduced={reduced} drained={drained} />

      {/* ── Stems: the badged apps into the hub ──
       *
       * This box is given the APP GRID's width, not the
       * figure's — `max-w-[420px]` with the screen's own `p-4`
       * restated as `px-4`. That is the whole alignment
       * mechanism: the box is exactly as wide as the four
       * columns above it, so its lanes land at the same 1/8,
       * 3/8, 5/8, 7/8 the grid puts its icons on, and the stems
       * leave from under the badges without a single measured
       * offset. Change the screen's padding and both move
       * together. */}
      <motion.div
        className={cn("hidden w-full max-w-[380px] px-4 md:block")}
        initial={reduced ? undefined : { opacity: 0 }}
        animate={reduced ? undefined : { opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.32, 0.72, 0.3, 1],
          delay: T.stems / 1000,
        }}
      >
        <Connectors
          direction="in"
          axis="y"
          lanes={4}
          className={cn("h-[40px] w-full")}
        />
      </motion.div>

      {/* Below md the connectors are gone, so the stack needs
      its own breathing room where they used to be. */}
      <div className={cn("h-7 md:hidden")} />

      {/* ── Centre: the mark, with a border that travels ── */}
      <motion.div
        className={cn(
          "corner-squircle relative size-[84px] shrink-0 overflow-hidden rounded-[26px] md:size-[92px] md:rounded-[29px]",
          "[box-shadow:0_0_0_1px_rgba(255,255,255,0.5),0_18px_44px_-14px_rgba(13,26,50,0.45)]",
        )}
        initial={reduced ? undefined : { opacity: 0, scale: 0.86 }}
        animate={reduced ? undefined : { opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          visualDuration: 0.5,
          bounce: 0.24,
          delay: T.hub / 1000,
        }}
      >
        {/* The moving border: a conic gradient spun behind the
        tile, with the face laid back on top inset by 1.5px
        so only a hairline of the gradient shows. Sized at
        160% of the tile in both axes off `inset-[-30%]`, so
        it stays square and oversized at either tile size
        without a measured number. Rotation is a transform,
        so the loop stays on the compositor. */}
        {!reduced && (
          <motion.div
            aria-hidden
            className={cn(
              "absolute inset-[-30%]",
              "bg-[conic-gradient(from_0deg,rgba(255,255,255,0)_0deg,rgba(255,255,255,0)_250deg,rgba(255,255,255,0.85)_320deg,rgba(255,255,255,0)_360deg)]",
            )}
            animate={{ rotate: 360 }}
            transition={{
              duration: 4,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        )}

        {/* Face */}
        <div
          className={cn(
            "corner-squircle absolute inset-[1.5px] rounded-[25px] bg-[#131417] md:rounded-[28px]",
            "[box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.26)]",
          )}
        />

        <OrchidMark
          className={cn(
            "absolute inset-0 m-auto size-[36px] text-white md:size-[40px]",
          )}
        />
      </motion.div>

      {/* ── Fan: the hub out to the first chip row ──
       *
       * Four lanes across the FIGURE's full width, which is
       * exactly the four columns row one is about to lay down,
       * so the fan meets the chips the same way the stems meet
       * the icons.
       *
       * It fans to row one only. Seven lines into a staggered
       * cluster is spaghetti, and the second row does not need
       * a wire to be understood as more of the same thing — it
       * is nested into the gaps of the row above it, which is
       * its own kind of connection. */}
      <motion.div
        className={cn("hidden w-full md:block")}
        initial={reduced ? undefined : { opacity: 0 }}
        animate={reduced ? undefined : { opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.32, 0.72, 0.3, 1],
          delay: T.fan / 1000,
        }}
      >
        <Connectors
          direction="out"
          axis="y"
          lanes={4}
          className={cn("h-[40px] w-full")}
        />
      </motion.div>

      <div className={cn("h-7 md:hidden")} />

      {/* ── The cluster ──
       *
       * Row one is four across, row two is three nested into
       * its gaps. Both rows are FULL-WIDTH four-column grids —
       * row two simply leaves its fourth cell empty and slides
       * over.
       *
       * THE OFFSET IS A TRANSFORM, NOT A MARGIN, and that is
       * the one thing here that had to be got right. A margin
       * would shrink row two's box, which would shrink its
       * columns, which would make its chips narrower than row
       * one's — the stagger would land but the sizes would not
       * match, and mismatched sizes read as a bug where a
       * stagger reads as a pattern. A transform moves the
       * painted result and leaves the box alone, so both rows
       * solve identical columns.
       *
       * Half a column plus half a gap, in the grid's own terms:
       * a column is (100% − 3 gaps)/4, so half of it plus half
       * a gap is (100% − 2.25rem)/8 + 0.375rem. Written that
       * way it tracks the figure at every width instead of
       * being a pixel that was right once at 540. */}
      <div className={cn("w-full")}>
        {[OUTCOMES.slice(0, 4), OUTCOMES.slice(4)].map((row, r) => (
          <div
            key={`row-${r}`}
            className={cn(
              "grid grid-cols-2 gap-3 md:grid-cols-4",
              r === 1 &&
                "mt-3 md:translate-x-[calc((100%_-_2.25rem)/8_+_0.375rem)]",
            )}
          >
            {row.map((item, i) => {
              /* One running index across both rows, so the
             entrance stagger and the check stagger carry
             straight through the break instead of
             restarting and making row two look like a
             second, separate event. */
              const n = r * 4 + i;
              return (
                <motion.div
                  key={item.label}
                  className={cn(
                    "corner-squircle relative flex h-[56px] w-full flex-col justify-center rounded-[12px] bg-[#DCD8CB]/42 px-[10px] backdrop-blur-[14px]",
                    "[box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(13,26,50,0.06),0_10px_24px_-10px_rgba(13,26,50,0.24)]",
                  )}
                  initial={
                    reduced ? undefined : { opacity: 0, y: -8, scale: 0.94 }
                  }
                  animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    visualDuration: 0.42,
                    bounce: 0.2,
                    delay: (T.chips + n * T.chipStagger) / 1000,
                  }}
                >
                  {/* Tile and label share a line; the detail
                  gets its own, INDENTED TO THE LABEL'S left
                  edge rather than starting back at the chip's
                  padding.

                  This reverses an earlier call, and the
                  earlier reasoning was not wrong so much as
                  it was weighing the wrong thing. It ran:
                  a chip is ~126px, so ~106px of measure, and
                  starting 27px in leaves 79px — not enough
                  for a date and a place, so lose the indent
                  and keep the line. True as arithmetic. But
                  what it bought was a chip with two left
                  edges, and a text block that starts in two
                  different places is not a smaller problem
                  than a truncated word; it is a more visible
                  one. Seven of these sit in a grid, so every
                  ragged edge is repeated seven times and the
                  cluster stops reading as a set of cards and
                  starts reading as a set of accidents.

                  The details were already written to about
                  eighteen characters (see OUTCOMES), which
                  is what makes the trade affordable — most
                  clear 79px, and `truncate` plus the `title`
                  below catches the ones that do not. An
                  ellipsis on one line in one chip costs less
                  than a misalignment in all seven. */}
                  <div className={cn("flex items-center gap-[7px]")}>
                    <div
                      className={cn(
                        "corner-squircle flex size-[20px] shrink-0 items-center justify-center rounded-[6px] bg-[#0D1A32]/[0.05]",
                        "[box-shadow:inset_0_0_0_1px_rgba(13,26,50,0.07),inset_0_1px_2px_rgba(13,26,50,0.07)]",
                      )}
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        size={12}
                        strokeWidth={2}
                        color="#0D1A32"
                      />
                    </div>

                    <p
                      title={item.label}
                      className={cn(
                        "min-w-0 truncate text-[11px] leading-[1.25] font-semibold tracking-[-0.01em] text-[#0D1A32]",
                      )}
                    >
                      {item.label}
                    </p>
                  </div>

                  {/* 27px is the tile plus the gap above it —
                      `size-[20px]` and `gap-[7px]`, restated. It
                      is written as one number rather than
                      derived because the two values it comes
                      from are three lines up and the row it has
                      to match is a flex row, which has no
                      grid-column to inherit. If either moves,
                      this moves with it.

                      #323A4E is two steps down the same neutral
                      ramp the section already uses: #5A6478 on
                      the panel, #464F63 where the nav sits on
                      the darker notch, and this where 10.5px
                      type sits on a photograph. That last case
                      is the one that needed it — #5A6478 over
                      this chip's ground measures about 3.9:1,
                      which is under the bar for text this size
                      and was the quietest failure in the
                      figure. #323A4E clears 7:1 and still reads
                      as secondary against the label's #0D1A32,
                      which is the whole job. */}
                  <p
                    title={item.detail}
                    className={cn(
                      "mt-[3px] truncate pl-[27px] text-[10.5px] leading-[1.3] tabular-nums text-[#323A4E]",
                    )}
                  >
                    {item.detail}
                  </p>

                  {/* The check rides the corner, half outside.
                  A status ON the card rather than a column
                  IN it — the wide card could afford a 22px
                  badge track, a 126px chip cannot give up a
                  fifth of its label to one.

                  IT IS STATE NOW, NOT A DELAY. The pop used
                  to be a transition delay of
                  T.checks + n·T.checkStagger; it is now
                  driven by `n < checked`, with the timing
                  moved up into the controller. Same moment
                  on the clock, but the badge tick 200ms
                  later has to be scheduled against the same
                  clock — and two independent delays cannot
                  be kept in step through a replay. One
                  source of truth, two readers. */}
                  <motion.span
                    className={cn(
                      "absolute -top-[6px] -right-[6px] flex size-[17px] items-center justify-center rounded-full bg-[#2BB673]",
                      "[box-shadow:0_0_0_2px_rgba(242,241,236,0.9),0_2px_5px_rgba(13,26,50,0.28)]",
                    )}
                    initial={reduced ? undefined : { opacity: 0, scale: 0.3 }}
                    animate={
                      reduced || n < checked
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.3 }
                    }
                    transition={{
                      type: "spring",
                      visualDuration: 0.3,
                      bounce: 0.45,
                    }}
                  >
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      size={10}
                      strokeWidth={3.4}
                      color="#FFFFFF"
                    />
                  </motion.span>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export interface OrchidAi01Props {
  /** Appended to the outer <section>. */
  className?: string;
  /**
   * Photograph behind the right panel. Pass an empty string to force the
   * painted meadow-under-sky ground instead. If the file is simply
   * missing the panel falls back to that ground on its own — see
   * `imageBroken` below.
   */
  imageSrc?: string;
  imageAlt?: string;
}

/* The asset this hero was composed against. It lives in this repo's
 * public/ folder and CANNOT travel through the registry: a registry item
 * carries its files as text inside JSON, so a PNG has no way in.
 *
 * That used to mean an installed copy pointed at a path its project did
 * not have and rendered a broken image — and the painted fallback never
 * ran, because a default this component ships is a truthy imageSrc and
 * the fallback only triggered on an empty one.
 *
 * So the default stays (this site gets the photograph, and so does
 * anyone who copies the file across) but a failed load is now treated as
 * no image at all. The gap between "you have the asset" and "you do not"
 * closes itself instead of needing a prop. */
const HERO_IMAGE = "/paper-image/image.png";

export default function OrchidAi01({
  className,
  imageSrc = HERO_IMAGE,
  imageAlt = "A lavender meadow in bloom under a wide teal sky",
}: OrchidAi01Props) {
  const reduced = useReducedMotion();
  const [imageBroken, setImageBroken] = useState(false);
  const showPhoto = Boolean(imageSrc) && !imageBroken;

  /* ── The sequence controller ───────────────────────────────────────
   *
   * ARMING. The figure runs on viewport entry, not on mount. Below lg
   * it sits roughly 700px down the page, so mount-timing burned the
   * whole 3.8s storyboard before anyone had scrolled to it — the
   * drain, which is the only beat that matters, played to an empty
   * room every time on mobile.
   *
   * `runId` increments on each entry and never on exit, and it keys
   * the figure's subtree. A key change is a remount, which is what
   * replays every delay-based entrance in here without any of them
   * having to learn about the viewport — one number, and the screen,
   * the badges, the stems, the hub, the fan and the chips all start
   * over. That is the entire reason the drain is affordable: it can
   * spend the badges because scrolling back mints them again.
   *
   * THE OBSERVER IS ON THE PANEL, not on the figure. The figure is
   * unmounted until armed, and an element with no box never satisfies
   * an intersection threshold — it would have sat waiting for itself
   * forever. The panel always has its min-h.
   *
   * THE INCREMENT HAPPENS DURING RENDER, which looks alarming and is
   * the sanctioned way to do this. React's own guidance is to adjust
   * state during rendering when it derives from something that
   * changed, rather than in an effect: setting it here re-runs this
   * component before anything is committed, so the DOM never sees the
   * stale value. In an effect it would have been a second commit — a
   * frame of the old figure, then the new one — and the lint rule
   * that flags it is right to.
   *
   * The previous value is held in STATE rather than in a ref, which is
   * the part that is easy to get wrong. A ref written during render is
   * a real hazard — it survives a discarded render pass, so a run that
   * React throws away can still have consumed the edge, and the
   * replay silently goes missing. State is rolled back with the pass
   * that produced it. It also keeps this from looping: `inView` is a
   * boolean, so the guard is false on the re-render and the pair
   * settles in one extra pass. Edge detection, not synchronisation. */
  const panelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(panelRef, { amount: 0.3 });
  const [wasInView, setWasInView] = useState(false);
  const [runId, setRunId] = useState(0);

  if (inView !== wasInView) {
    setWasInView(inView);
    if (inView) setRunId((r) => r + 1);
  }

  /* Reduced motion arms it immediately and unconditionally: there is
   * no entrance to wait for, so making someone scroll to reveal a
   * static figure would be a cost with nothing bought. */
  const armed = Boolean(reduced) || runId > 0;

  return (
    <section
      className={cn(
        "min-h-screen bg-white p-3 lg:h-screen lg:p-4 dark:bg-[#0A0B0E]",
        className,
      )}
    >
      {/* ── The frame ───────────────────────────────────────────────
       *
       * Holds both panels, caps its width and centres itself, so past
       * ~1600px the composition stops stretching.
       *
       * CONCENTRIC CORNERS. The frame's radius, its padding and the
       * cards' radius are one equation, not three free numbers:
       *
       *     card radius = frame radius − frame padding
       *     25          = 32           − 7
       *
       * That keeps the curves parallel — every point on a card's corner
       * stays exactly 7px from the frame's. Move the padding and the
       * card radius has to move the same amount the other way.
       *
       * Its background is the seam: it shows only as the 7px border
       * around the pair, the 4px channel between them (kept narrower on
       * purpose), and the corner notch the navbar sits in. */}
      <div
        className={cn(
          "mx-auto flex h-full w-full max-w-[1600px] flex-col gap-1 rounded-[32px] bg-[#DCD8CB] p-[7px] lg:flex-row dark:bg-[#22242A]",
        )}
      >
        {/* ── LEFT PANEL ──────────────────────────────────────────────
         *
         * Plain greige card, everything bottom-anchored: the notch pins
         * to the top, a flex spacer eats the middle, and the type stack
         * sits on the floor. The large empty band is the composition,
         * not leftover padding — which is exactly why it is now empty.
         *
         * There used to be a 24px dot grid painted across it. It was
         * cheap (a repeating radial-gradient, no asset, one paint) but
         * cheap is not the same as free: the chips carry the only
         * texture this side is supposed to have, and a field of dots
         * behind them competed with that instead of supporting it. The
         * empty band does more work empty. */}
        <div
          className={cn(
            "relative flex min-h-[560px] flex-col overflow-hidden rounded-[25px] bg-[#F2F1EC] p-7 lg:h-full lg:w-1/2 lg:p-9 dark:bg-[#121418]",
          )}
        >
          {/* ── Corner notch ──────────────────────────────────────────
           *
           * The navbar is a bar stamped into the panel's top-left
           * corner, showing the frame colour behind it rather than
           * sitting on the panel as a pill. Absolutely placed so it
           * escapes the panel's own padding; the panel's rounded
           * overflow-hidden clips its outer corner for free.
           *
           * A notch flush to two edges has three corners: the outer
           * top-left (the panel's own 25px radius, nothing to do), the
           * inner bottom-right (one convex round, below), and the two
           * junctions where the bar meets the panel's top and left
           * edges — those get the flares. */}
          <nav
            className={cn(
              "absolute top-0 left-0 z-20 flex h-[59px] w-fit items-center gap-1 rounded-br-[25px] bg-[#DCD8CB] pr-6 pl-7 lg:pl-9 dark:bg-[#22242A]",
            )}
          >
            {/* ── Why the row sat low ──────────────────────────────
             *
             * `items-center` centres a flex item by its LINE BOX, and a
             * line box is the font's whole content box: ascent above the
             * caps, descent below the baseline, present whether or not
             * the string has a descender. "Orchid" and "Features" have
             * none, so the box being centred is taller than the ink
             * inside it and the letters land below the bar's middle.
             *
             * It was uneven, too. The wordmark is 17px and the links are
             * 16px with `py-1`, so each was centred against a different
             * line box and pushed down by a different amount — the two
             * halves of the row were not even on one optical line.
             *
             * `text-box: trim-both cap alphabetic` trims the box to the
             * cap height on top and the baseline on the bottom, so what
             * gets centred is exactly the block of ink the eye sees, at
             * any size and in any font. The text has to be wrapped to
             * take it: this <a> is a flex container, so "Orchid" would
             * otherwise be an anonymous flex item with no element to
             * carry the property.
             *
             * Chromium 133+ and Safari 18.2+. Firefox ignores it and
             * keeps today's rendering — nothing breaks, it just does not
             * get the correction. */}
            <a
              href="#"
              className={cn(
                TYPE.brand,
                "flex items-center gap-2 pr-3 text-[#0D1A32] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D1A32] dark:text-[#E8EBF0] dark:focus-visible:outline-[#E8EBF0]",
              )}
            >
              <OrchidMark className={cn("size-[20px]")} />
              <span className={cn("[text-box:trim-both_cap_alphabetic]")}>
                Orchid
              </span>
            </a>

            {/* The links are the one part of the notch that cannot
             * survive a 340px panel — four of them plus the wordmark
             * overruns the panel width and the bar stops being a notch.
             * Below md the bar is the wordmark alone. */}
            <div className={cn("hidden items-center gap-1 md:flex")}>
              <span
                className={cn("mr-1 h-5 w-px bg-[#0D1A32]/12 dark:bg-white/15")}
              />

              {/* #464F63, not the body's #5A6478: that colour is tuned
               * for the panel's #F2F1EC where it reads 5.27:1, and on
               * the notch's darker ground it falls to 4.18:1 — under the
               * bar for 16px text. This sits near 5.8:1.
               *
               * There used to be a `translate-y-[2px]` here, described
               * as an optical nudge. It was compensating for the
               * line-box problem above, but in the wrong direction —
               * pushing the links further down, and only the links, so
               * they fell 2px below a wordmark that was already low. The
               * trim removes the reason it existed.
               *
               * The padding goes 4px → 8px with it. `py-1` was padding a
               * full line box; once the box is trimmed to the caps it is
               * padding roughly 5px less text, and the hover pill would
               * have come out that much shorter than it is today. 8px
               * lands it back at ~28px. Where the trim is unsupported
               * the pill is a little taller than before instead — which
               * is a hover affordance being generous, not a break. */}
              {NAV_LINKS.map((l) => (
                <a
                  key={l}
                  href="#"
                  className={cn(
                    TYPE.ui,
                    "rounded-full px-2.5 py-2 text-[#464F63] transition-colors [text-box:trim-both_cap_alphabetic] hover:bg-[#0D1A32]/6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D1A32] dark:text-[#B4BCCA] dark:hover:bg-white/8 dark:focus-visible:outline-[#E8EBF0]",
                  )}
                >
                  {l}
                </a>
              ))}
            </div>

            {/* The two flares — 9×9 each, so the ellipse is a circle and
             * the junction a plain concave fillet.
             *
             * `farthest-side` makes the ellipse's radii equal the tile's
             * own width and height, so the tile size IS the curve.
             * Anchored at `100% 100%` — the corner away from the bar —
             * with the stops inverted so the frame colour sits outside
             * the ellipse. That anchor is what decides which end is
             * tangent: here it leaves the frame's border horizontally
             * and meets the bar's edge vertically, so both ends are
             * tangent-continuous. Anchored at `0 0` the tangents swap
             * and it kinks against the border. */}
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute top-0 left-full h-[9px] w-[9px]",
                "bg-[radial-gradient(farthest-side_at_100%_100%,transparent_99%,#DCD8CB_100%)]",
                "dark:bg-[radial-gradient(farthest-side_at_100%_100%,transparent_99%,#22242A_100%)]",
              )}
            />
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute top-full left-0 h-[9px] w-[9px]",
                "bg-[radial-gradient(farthest-side_at_100%_100%,transparent_99%,#DCD8CB_100%)]",
                "dark:bg-[radial-gradient(farthest-side_at_100%_100%,transparent_99%,#22242A_100%)]",
              )}
            />
          </nav>

          {/* The empty middle. */}
          <div className={cn("min-h-10 flex-1")} />

          <div>
            {/* Two lines, and they have to stay two lines — the chips are
             * the composition, and a headline that wraps to four turns
             * them into scattered stickers.
             *
             * Each chip is an inline-block run on the headline's own
             * baseline, so it displaces the line the way a word would
             * instead of being positioned over it — see CHIP for why the
             * box is inline-block and not inline-flex. Its box is sized
             * in em throughout, so tile and glyph track the clamp()
             * rather than needing their own breakpoints. */}
            <h1
              className={cn(TYPE.display, "text-[#0D1A32] dark:text-[#E8EBF0]")}
            >
              Send one{" "}
              <span
                className={cn(
                  CHIP,
                  "bg-[#DDF6E4] dark:bg-[#10301D]",
                  "[box-shadow:inset_0_0_0_1px_#A7E4BC] dark:[box-shadow:inset_0_0_0_1px_#1D5233]",
                )}
              >
                <span
                  className={cn(
                    CHIP_TILE,
                    "bg-[#34C759]",
                    "[box-shadow:inset_0_0_0_1px_#15803D,inset_0_1px_2px_0_rgba(21,128,61,0.75)]",
                  )}
                >
                  <HugeiconsIcon
                    icon={Message01Icon}
                    className={cn("size-[0.56em]")}
                    strokeWidth={1.8}
                    color="#FFFFFF"
                  />
                </span>
                <span
                  className={cn(
                    CHIP_SERIF,
                    "text-[#15803D] dark:text-[#86E8A5]",
                  )}
                >
                  text
                </span>
              </span>
              {/* The chip carries mx-[0.12em] for breathing room against
               * the words either side, but a full stop is not a word — it
               * has to sit tight. This cancels exactly that much, so the
               * period tracks the chip at any size. */}
              <br />
              Orchid gets it{" "}
              <span
                className={cn(
                  CHIP,
                  "bg-[#FCE6D2] dark:bg-[#3B2617]",
                  "[box-shadow:inset_0_0_0_1px_#F5C69B] dark:[box-shadow:inset_0_0_0_1px_#59391F]",
                )}
              >
                <span
                  className={cn(
                    CHIP_TILE,
                    "bg-[#F26F21]",
                    "[box-shadow:inset_0_0_0_1px_#D2521A,inset_0_1px_2px_0_rgba(210,82,26,0.75)]",
                  )}
                >
                  <HugeiconsIcon
                    icon={CalendarAnalysisIcon}
                    className={cn("size-[0.56em]")}
                    strokeWidth={1.8}
                    color="#FFFFFF"
                  />
                </span>
                <span
                  className={cn(
                    CHIP_SERIF,
                    "text-[#D2521A] dark:text-[#F6A76A]",
                  )}
                >
                  done
                </span>
              </span>
            </h1>

            {/* max-w is in em, so the measure holds at ~60 characters
             * across the whole clamp rather than growing with the size.
             * The clamp floors at 16px, not 15: this is body copy, and
             * 1.15vw only clears 16px past a 1400px viewport — every
             * laptop would have read it at the floor. No tracking, since
             * negative letter-spacing is for display sizes and only
             * tightens an already-small measure here. `text-pretty`
             * keeps "manage." off a line of its own. */}
            <p
              className={cn(
                TYPE.body,
                "mt-7 max-w-[30em] text-[#5A6478] dark:text-[#9AA4B6]",
              )}
            >
              Orchid is a personal assistant that helps you stay organized, find
              information, and get things done. All through messages.
            </p>

            {/* ── CTA pair ────────────────────────────────────────────
             *
             * Two shadcn <Button>s. Everything that makes them look like
             * this is passed at the call site — the base component is
             * untouched, which is the point: a section should not be a
             * reason to edit components/ui/button.tsx.
             *
             * The bevel is a fill painted to padding-box and a gradient
             * rim painted to border-box, the rim's angle driven by
             * --bevel-angle so the highlight sweeps. The secondary is
             * the primary's recipe mirrored — a near-white fill, the rim
             * redrawn in ink instead of white, and the two inset shadows
             * swapped so the light one sits on top. One custom property
             * drives both, so they sweep in sync.
             *
             * WHY `!` ON THE BACKGROUND. The button's cva base carries
             * `bg-clip-padding`. That is a background-clip longhand, and
             * it would override the per-layer `padding-box` /
             * `border-box` clips written inside this shorthand —
             * collapsing both layers onto the same clip and painting the
             * opaque fill straight over the rim. tailwind-merge cannot
             * catch it (a shorthand and a longhand are different
             * groups), so the shorthand is marked important to win
             * outright. */}
            <div className={cn("mt-8 flex flex-wrap items-center gap-3")}>
              <Button
                size="lg"
                className={cn(
                  TYPE.ui,
                  "h-11 rounded-[12px] border border-solid border-transparent px-8 font-medium text-white",
                  "[background:linear-gradient(#2d2d2d,#2d2d2d)_padding-box,linear-gradient(var(--bevel-angle,180deg),rgba(255,255,255,0.65)_0%,rgba(255,255,255,0.08)_38%,rgba(0,0,0,1)_100%)_border-box]!",
                  "[box-shadow:inset_0px_-2px_2.6px_0px_rgba(0,0,0,0.57),inset_0px_1px_1.7px_0px_rgba(255,255,255,0.25)]",
                  "[animation:bevel-button-spin_3000ms_linear_infinite]",
                )}
              >
                Text Orchid
              </Button>

              <Button
                size="lg"
                className={cn(
                  TYPE.ui,
                  "h-11 rounded-[12px] border border-solid border-transparent px-5 font-medium text-[#0D1A32] dark:text-[#E8EBF0]",
                  "[background:linear-gradient(#FAF9F5,#FAF9F5)_padding-box,linear-gradient(var(--bevel-angle,180deg),rgba(13,26,50,0.45)_0%,rgba(13,26,50,0.10)_38%,rgba(13,26,50,0.03)_100%)_border-box]!",
                  "dark:[background:linear-gradient(#1B1E24,#1B1E24)_padding-box,linear-gradient(var(--bevel-angle,180deg),rgba(255,255,255,0.40)_0%,rgba(255,255,255,0.10)_38%,rgba(255,255,255,0.03)_100%)_border-box]!",
                  "[box-shadow:inset_0px_-2px_2.6px_0px_rgba(13,26,50,0.10),inset_0px_1px_1.7px_0px_rgba(255,255,255,0.90)]",
                  "dark:[box-shadow:inset_0px_-2px_2.6px_0px_rgba(0,0,0,0.45),inset_0px_1px_1.7px_0px_rgba(255,255,255,0.12)]",
                  "[animation:bevel-button-spin_3000ms_linear_infinite]",
                )}
              >
                See how it works
              </Button>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────────────────
         *
         * The photograph, a two-layer scrim, and the diagram over it.
         *
         * THE SCRIM. Two multiply layers over the photo. Under multiply
         * a colour only darkens by however far it sits below white, so
         * the tint's own luminance caps what the scrim can do — the
         * near-white grey this started as removed about 7% no matter
         * what strength was dialled, and white type measured 2.04:1
         * against it. This blue is mid-luminance: it cools the sky
         * toward the brand hue and keeps the pastel quality rather than
         * pulling the ground down the way an ink tint would.
         *
         * Both were authored against a full-width section. In a
         * half-width panel the left gradient falls across the diagram
         * rather than beside it, which helps: measured behind the
         * connectors this ground sits at 4.14:1 against white where the
         * full-width version sits at 3.22:1.
         *
         * The panel does not take a dark variant. It is a photograph
         * under a fixed scrim in both themes, and the diagram over it
         * is drawn in light throughout — see below. */}
        <div
          ref={panelRef}
          className={cn(
            /* The figure runs about 700px tall at md and above —
             * screen 315, stems 54, hub 104, fan 54, two chip rows 124,
             * plus the gaps — so 520 clipped it. Below md the
             * connectors drop and the cluster goes two columns, which
             * trades ~110px of connector for two extra chip rows and
             * lands near the same place. */
            "relative min-h-[680px] overflow-hidden rounded-[25px] sm:min-h-[760px] lg:h-full lg:w-1/2",
          )}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={cn("object-cover")}
            onError={() => setImageBroken(true)}
          />

          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center p-6 sm:p-8",
            )}
          >
            {/* ── THE STACK — pressure above, resolution below ────────
             *
             * The same five parts as before, turned a quarter turn: the
             * context Orchid reads is now ON TOP, the mark in the
             * middle, what came out at the BOTTOM. Nothing is rotated
             * in the CSS sense — every shape keeps its own orientation
             * and only the arrangement turns, which is why the chips
             * and labels stay upright and readable.
             *
             * TURNING IT BUYS A STORY THE ROW COULD NOT TELL. Read
             * left-to-right this was a data flow, which is a thing
             * engineers find legible and nobody finds moving. Read top
             * to bottom it is a screen full of unread badges resolving
             * into a set of finished things — pressure, then relief.
             * Down reads as settling; sideways reads as plumbing.
             *
             * The figure also WIDENS as it descends: the screen caps at
             * 420px, the chip cluster runs the full 540px. That is not
             * an accident of content, it is the shape of the claim —
             * one crowded inbox opening out into seven done things.
             *
             * BELOW md the connectors drop and the cluster becomes two
             * plain columns. A 340px panel cannot hold four chips
             * across at a width their detail lines survive, and a
             * staggered grid two items wide is not a stagger, it is a
             * misalignment. */}
            <div
              className={cn("flex w-full max-w-[540px] flex-col items-center")}
              role="img"
              aria-label="Four apps holding seven unread items — Mail, Messages, Calendar and Notes — feeding into Orchid, which returns seven completed tasks: flight booked, hotel held, table reserved, airport ride, days cleared, replies drafted and gift ordered."
            >
              {/* `role="img"` on the parent makes this whole subtree
                  presentational, so nothing here is announced and the
                  label above stands for all of it — which is why the
                  figure can be absent before it arms without costing a
                  screen reader anything. */}
              {armed && <Figure key={runId} reduced={reduced} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
