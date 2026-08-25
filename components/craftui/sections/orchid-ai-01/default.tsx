"use client";

import Image from "next/image";
import useMeasure from "react-use-measure";
import { motion, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Airplane01Icon,
  Calendar03Icon,
  CalendarAnalysisIcon,
  Mail01Icon,
  Message01Icon,
  Restaurant01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════════════════════════════
 * ORCHID AI 01 — split hero
 *
 * Left: a plain greige panel with a corner-notch navbar, the type
 * stack bottom-anchored. Right: a photograph under a two-layer scrim
 * with the Branches diagram over it.
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
 * So the diagram is a flex row of five columns:
 *
 *   [tiles] [connectors] [hub] [connectors] [cards]
 *
 * The two connector columns are `flex-1`, so they absorb whatever
 * width is left after the fixed columns — which is what makes the
 * whole figure responsive without a scale factor. Sizes are Tailwind
 * classes, so any of them can take `md:` tomorrow.
 *
 * The connectors themselves still need real numbers to draw a path,
 * but they now MEASURE their own column instead of being told its
 * size (see <Connectors>). Lane centres are 1/6, 3/6, 5/6 of the
 * measured height, which is exactly where `grid-rows-3` puts the
 * centre of each row — so the connectors cannot drift out of
 * alignment with the things they connect, the same guarantee the
 * constants used to give, without the constants.
 *
 * BELOW md the row stacks: tiles become a horizontal strip, the hub
 * sits under them, the cards stack full-width, and the connectors are
 * dropped — there is no useful diagonal to draw in a 340px column.
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

const SOURCES = [Message01Icon, Calendar03Icon, Mail01Icon];

const OUTCOMES = [
  {
    icon: Airplane01Icon,
    label: "Flight booked",
    detail: "SFO → AUA · Thu 6:40a",
    done: true,
  },
  {
    icon: Restaurant01Icon,
    label: "Table reserved",
    detail: "Zeerovers · Fri 8:00p",
    done: true,
  },
  {
    icon: Mail01Icon,
    label: "Replies drafted",
    detail: "4 waiting on you",
    done: false,
  },
];

/* Elbow with rounded corners: out horizontally, turn, run vertically,
 * turn, in horizontally. Radius is clamped to half the span so a short
 * connector degrades to a gentler curve instead of self-intersecting —
 * which matters more now than it did at a fixed size, since the column
 * this is drawn into is free to be 40px or 120px wide. */
function elbow(x1: number, y1: number, x2: number, y2: number) {
  const dy = y2 - y1;
  if (Math.abs(dy) < 0.5) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const midX = (x1 + x2) / 2;
  const r = Math.min(14, Math.abs(x2 - x1) / 2 - 1, Math.abs(dy) / 2);
  const d = Math.sign(dy);
  return [
    `M ${x1} ${y1}`,
    `L ${midX - r} ${y1}`,
    `Q ${midX} ${y1} ${midX} ${y1 + d * r}`,
    `L ${midX} ${y2 - d * r}`,
    `Q ${midX} ${y2} ${midX + r} ${y2}`,
    `L ${x2} ${y2}`,
  ].join(" ");
}

/* ── Connector column ────────────────────────────────────────────────
 *
 * A flex column that draws the elbows across its own width. It knows
 * nothing about the tiles or the cards: it measures itself, puts the
 * three lanes at 1/6, 3/6 and 5/6 of its height — the row centres a
 * `grid-rows-3` sibling produces — and fans them to or from its own
 * vertical centre, where the hub is.
 *
 * `in` reads context inward, `out` carries results outward. The
 * travelling pulses only run on `out`, because that is the direction
 * the story goes.
 *
 * Nothing renders until the measurement lands, which is one frame. The
 * column is `flex-1` inside a sized row, so it never collapses while
 * it waits — the layout does not shift when the paths appear. */
function Connectors({
  direction,
  className,
}: {
  direction: "in" | "out";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [ref, { width, height }] = useMeasure();

  const ready = width > 0 && height > 0;
  const lanes = [height / 6, height / 2, (height * 5) / 6];
  const paths = ready
    ? lanes.map((y) =>
        direction === "in"
          ? elbow(0, y, width, height / 2)
          : elbow(0, height / 2, width, y),
      )
    : [];

  return (
    <div ref={ref} className={cn("relative", className)} aria-hidden>
      {ready && (
        <svg
          width={width}
          height={height}
          className={cn("absolute inset-0")}
          fill="none"
        >
          {paths.map((d, i) => (
            <path key={i} d={d} stroke="#DCD8CB" strokeWidth={1.5} />
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

export interface OrchidAi01Props {
  /** Appended to the outer <section>. */
  className?: string;
  /**
   * Photograph behind the right panel, passed to next/image with `fill`.
   *
   * REQUIRED IN PRACTICE, despite the default. The default names a file
   * that only exists in this repo (see HERO_IMAGE), so an installed copy
   * has to pass its own path or put a file at that one. There is no
   * painted fallback and no empty-string mode: next/image needs a
   * non-empty src, and an unresolved path renders its broken state.
   */
  imageSrc?: string;
  /** Alt text for that photograph. Replace it whenever `imageSrc` is. */
  imageAlt?: string;
}

/* The asset this hero was composed against. It lives in this repo's
 * public/ folder and CANNOT travel through the registry: a registry item
 * carries its files as text inside JSON, so a PNG has no way in. An
 * installed copy therefore points at a path its project does not have
 * until someone supplies one, which is what the prop is for.
 *
 * THIS USED TO BE CAUGHT. An `onError` flipped a piece of state and the
 * panel painted a sky-to-meadow gradient instead, so a fresh install
 * never showed a broken image. That ground was removed when the panel
 * was reworked; the state it fed was not, and for a while this file
 * carried a handler that set a flag nothing read.
 *
 * The flag is gone rather than the ground restored, because a fallback
 * has to be maintained as a second design — it was already drifting out
 * of step with the panel around it, and a hero silently substituting a
 * gradient for the image the section was composed against is a worse
 * failure than an obvious one. A missing asset now looks missing, which
 * is a bug report instead of a mystery. */
const HERO_IMAGE = "/paper-image/image01.png";

export default function OrchidAi01({
  className,
  imageSrc = HERO_IMAGE,
  imageAlt = "A lavender meadow in bloom under a wide teal sky",
}: OrchidAi01Props) {
  const reduced = useReducedMotion();

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
          className={cn(
            "relative min-h-[520px] overflow-hidden rounded-[25px] lg:h-full lg:w-1/2",
          )}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={cn("object-cover")}
          />

          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center p-6 sm:p-8",
            )}
          >
            {/* ── BRANCHES — Orchid as the hub ───────────────────────
             *
             * Left: the context it reads. Centre: the mark. Right: what
             * came out, in feed format. The story runs left to right and
             * the connectors carry it, which is why the travelling
             * pulses only run outward.
             *
             * Drawn in light throughout, in both themes: ink connectors
             * at low alpha go nearly invisible against the darkened
             * ground, and the cards stay white because they are opaque
             * enough to hold their own contrast against a photograph.
             *
             * THE ROW. `md:h-[360px]` is what gives `grid-rows-3` three
             * equal rows to divide, which is what puts the lane centres
             * at 1/6, 3/6 and 5/6 — the exact fractions <Connectors>
             * draws to. If that height ever moves, it moves for both
             * columns and the connectors follow it, because they measure
             * rather than assume.
             *
             * The flex ratios below reproduce the old fixed figure at
             * 560px wide (≈91px and ≈70px of connector, ≈246px of card)
             * and then keep those proportions at every other width. */}
            <div
              className={cn(
                "flex w-full max-w-[400px] flex-col items-center gap-5",
                "md:h-[340px] md:max-w-[560px] md:flex-row md:items-stretch md:gap-0",
                "lg:h-[360px]",
                " p-4 rounded-[12px]",
              )}
            >
              {/* ── Left: context it reads ── */}
              <div
                className={cn(
                  "flex shrink-0 gap-3",
                  "md:grid md:grid-rows-3 md:gap-0",
                )}
              >
                {SOURCES.map((icon, i) => (
                  <div
                    key={`src-${i}`}
                    className={cn("flex items-center justify-center")}
                  >
                    <motion.div
                      className={cn(
                        " flex size-[44px] items-center justify-center rounded-[10px] bg-[#DCD8CB]/42",
                        "[box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.8),0_2px_8px_-2px_rgba(13,26,50,0.18)]",
                      )}
                      initial={reduced ? undefined : { opacity: 0, scale: 0.9 }}
                      animate={reduced ? undefined : { opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.45,
                        ease: [0.22, 0.61, 0.36, 1],
                        delay: 0.2 + i * 0.08,
                      }}
                    >
                      <HugeiconsIcon
                        icon={icon}
                        size={20}
                        strokeWidth={1.8}
                        color="#0D1A32"
                      />
                    </motion.div>
                  </div>
                ))}
              </div>

              <Connectors
                direction="in"
                className={cn("hidden md:block md:flex-[1.3]")}
              />

              {/* ── Centre: the mark, with a border that travels ── */}
              <div className={cn("flex shrink-0 items-center")}>
                <motion.div
                  className={cn(
                    "corner-squircle relative size-[88px] overflow-hidden rounded-[28px] md:size-[108px] md:rounded-[34px]",
                    "[box-shadow:0_0_0_1px_rgba(255,255,255,0.12),0_18px_44px_-12px_rgba(0,0,0,0.6)]",
                  )}
                  initial={reduced ? undefined : { opacity: 0, scale: 0.88 }}
                  animate={reduced ? undefined : { opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    visualDuration: 0.5,
                    bounce: 0.22,
                  }}
                >
                  {/* The moving border: a conic gradient spun behind the
                      tile, with the face laid back on top inset by 1.5px
                      so only a hairline of the gradient shows. Sized at
                      160% of the tile in both axes off `inset-[-30%]`,
                      so it stays square and oversized at either tile
                      size without a measured number. Rotation is a
                      transform, so the loop stays on the compositor. */}
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
                      "corner-squircle absolute inset-[1.5px] rounded-[27px] bg-[#131417] md:rounded-[33px]",
                      "[box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.26)]",
                    )}
                  />

                  <OrchidMark
                    className={cn(
                      "absolute inset-0 m-auto size-[38px] text-white md:size-[46px]",
                    )}
                  />
                </motion.div>
              </div>

              <Connectors
                direction="out"
                className={cn("hidden md:block md:flex-1")}
              />

              {/* ── Right: the feed ── */}
              <div
                className={cn(
                  "flex w-full flex-col gap-3",
                  "md:grid md:min-w-0 md:flex-[3.5] md:grid-rows-3 md:gap-0",
                )}
              >
                {OUTCOMES.map((item, i) => (
                  <div key={`out-${i}`} className={cn("flex items-center")}>
                    {/* 12px, and a squircle.
                     *
                     * Two things were wrong with the 16px round rect.
                     * The radius was its own number — the section
                     * otherwise runs 12 on the buttons and 14 on the
                     * source tiles, so 16 read as a fourth value rather
                     * than a step in a scale. And this was the only tile
                     * in the diagram NOT drawing on `corner-squircle`,
                     * while the source tiles and the hub both do. A
                     * squircle and a round rect at the same radius do
                     * not look like the same corner: the squircle stays
                     * flatter for longer and turns late, so a plain
                     * round rect beside them reads as the odd one out
                     * and as rounder than its number.
                     *
                     * 12 rather than 14: the card is the widest surface
                     * in the figure, and radius reads relative to the
                     * edge it interrupts. The same corner that looks
                     * right on a 44px tile looks inflated on a 260px
                     * card. */}
                    <motion.div
                      className={cn(
                        " flex h-[56px] w-full items-center rounded-[12px] bg-[#DCD8CB]/42 px-[14px] backdrop-blur-[14px]",
                        "[box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(13,26,50,0.06),0_10px_24px_-10px_rgba(13,26,50,0.24)]",
                      )}
                      initial={reduced ? undefined : { opacity: 0, x: -10 }}
                      animate={reduced ? undefined : { opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.22, 0.61, 0.36, 1],
                        delay: 0.55 + i * 0.12,
                      }}
                    >
                      {/* ── The row ─────────────────────────────────
                       *
                       * Three columns and two rows: the tile, the text,
                       * and the badge slot. The tile stays inline with
                       * the label, and the detail hangs under the label
                       * rather than under the tile.
                       *
                       * A GRID, NOT NESTED FLEX. The indent the detail
                       * needs is exactly the tile column plus the gap.
                       * Written as flex that is a margin — a number
                       * copied from two other numbers, which goes stale
                       * the first time the tile is resized. Here the
                       * detail simply starts in column 2, so it lines up
                       * with the label because it is in the label's
                       * column, and stays lined up at any tile size.
                       *
                       * `items-center` aligns per row track, so the tile
                       * and the badge centre on the label's line rather
                       * than on the card's midline — the card's midline
                       * falls between the two text lines, which is what
                       * had the badge floating against nothing.
                       *
                       * The badge column is present whether or not it is
                       * occupied, so the two rows with a badge and the
                       * one without still share a text measure: the
                       * label truncates at the same x in all three.
                       *
                       * Both text lines truncate, and both carry
                       * `title`. The demo strings fit; real values do
                       * not — a route like "SFO → AUA · Thu 6:40a" is
                       * already near the limit at the mobile card width,
                       * and truncation that swallows the departure time
                       * leaves the row saying nothing. The title keeps
                       * the full value reachable. */}
                      <div
                        className={cn(
                          "grid min-w-0 flex-1 grid-cols-[22px_1fr_22px] items-center gap-x-[8px] gap-y-[3px]",
                        )}
                      >
                        {/* The tile is the hub's recipe at 1/5 scale and
                            inverted for a light ground. The hub is a
                            dark face with a light hairline set into it;
                            this is a barely-there ink wash with an ink
                            hairline and a soft shadow under the top
                            edge, so it reads as a well pressed into the
                            card rather than a chip laid on top of it.
                            Same squircle, so the family holds at both
                            sizes. */}
                        <div
                          className={cn(
                            "corner-squircle flex size-[22px] items-center justify-center rounded-[7px] bg-[#0D1A32]/[0.05]",
                            "[box-shadow:inset_0_0_0_1px_rgba(13,26,50,0.07),inset_0_1px_2px_rgba(13,26,50,0.07)]",
                          )}
                        >
                          <HugeiconsIcon
                            icon={item.icon}
                            size={13}
                            strokeWidth={2}
                            color="#0D1A32"
                          />
                        </div>

                        {/* `min-w-0` is not redundant here the way it
                            would be on a flex child: a grid item's
                            automatic minimum size is its content, so
                            without this the label refuses to shrink and
                            `truncate` never fires — the 1fr column just
                            grows and pushes the badge out of the card. */}
                        <p
                          title={item.label}
                          className={cn(
                            TYPE.cardLabel,
                            "min-w-0 truncate text-[#0D1A32]",
                          )}
                        >
                          {item.label}
                        </p>

                        <div
                          className={cn(
                            "flex w-[22px] items-center justify-center",
                          )}
                        >
                          {item.done && (
                            <motion.span
                              className={cn(
                                "flex size-[18px] items-center justify-center rounded-full bg-[#2BB673]",
                              )}
                              initial={
                                reduced ? undefined : { opacity: 0, scale: 0.4 }
                              }
                              animate={
                                reduced ? undefined : { opacity: 1, scale: 1 }
                              }
                              transition={{
                                type: "spring",
                                visualDuration: 0.3,
                                bounce: 0.45,
                                delay: 1.5 + i * 0.45,
                              }}
                            >
                              <HugeiconsIcon
                                icon={Tick02Icon}
                                size={11}
                                strokeWidth={3.2}
                                color="#FFFFFF"
                              />
                            </motion.span>
                          )}
                        </div>

                        {/* Row two. `col-start-2` is the whole indent —
                            it puts the detail in the label's column, so
                            the two lines share a left edge because they
                            share a track, not because a margin was set
                            to match one. Spanning to the badge column
                            gives it the width the badge is not using.

                            THE NEGATIVE BOTTOM MARGIN IS THE PADDING
                            FIX. The card centres its content in a fixed
                            56px, so the two boxes were already equally
                            padded — but a box is not what the eye
                            measures. At the top it sees the tile, whose
                            painted edge IS the top of its row. At the
                            bottom it sees a baseline, and the line box
                            keeps going past it: half the leading plus
                            the font's descent, about 0.33em of empty
                            room that reads as extra bottom padding.

                            Pulling that 0.33em back off the row makes
                            the grid end on the baseline, so centring
                            then lands equal ink above and below. In em,
                            so it tracks the detail's own font size — it
                            is a share of the line box, not 4px.

                            Rows whose value ends in a descender sit
                            marginally closer to the floor ("8:00p"),
                            which is correct: optical alignment is judged
                            on the baseline, not on the tail of a p.

                            Tabular figures so the line cannot ripple as
                            values change. They ride on the role:
                            `cardDetail` is only ever used on lines that
                            carry a value. `tabular-nums` is
                            font-variant-numeric, which keeps working
                            when a non-variable fallback renders — the
                            raw `font-feature-settings: 'tnum' 1` that
                            used to sit beside it did the same job and
                            cancelled any other numeric feature set
                            upstream. */}
                        <p
                          title={item.detail}
                          className={cn(
                            TYPE.cardDetail,
                            "col-span-2 col-start-2 -mb-[0.33em] min-w-0 truncate text-[#5A6478]",
                          )}
                        >
                          {item.detail}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
