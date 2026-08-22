"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useAnimate,
  useReducedMotion,
} from "motion/react";
import NumberFlow from "@number-flow/react";
import { Drawer } from "vaul";
import { Popover } from "@base-ui-components/react/popover";
import { Select } from "@base-ui-components/react/select";
import { Slider } from "@base-ui-components/react/slider";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Delete02Icon,
  PlusSignIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

/* ==========================================================================
 * Steps Count Block
 *
 * One file, five sections, in dependency order: the colour ramp knows nothing
 * about the log, the log knows nothing about the card, and the card is the
 * only thing that knows about the drawer. Read top to bottom and nothing is
 * ever used before it is defined.
 *
 *   1. Colour        — OKLCH interpolation, the red → amber → green ramp
 *   2. Steps log     — the flat ISO-day → count map and its hook
 *   3. Tuned values  — every measurement, radius and spring on the card
 *   4. Shell         — the vaul drawer the card sits in
 *   5. Card & parts  — the chart itself
 *
 * The registry ships exactly one file per variation, so this is a single
 * module rather than three. The section banners are the module boundaries.
 *
 * Every colour is published once as a `--sc-*` custom property on the two
 * roots that need them (the drawer content and the card), and consumed from
 * Tailwind as `bg-[var(--sc-surface)]` and friends. The values are the same
 * literals as ever — the indirection is what lets the markup be Tailwind
 * instead of a `style` prop on every second element. They are namespaced
 * because this block is installed into someone else's app, where a bare
 * `--ink` or `--hover` would collide with tokens it does not own.
 * ========================================================================== */

/* ─────────────────────────────────────────────────────────
 * 1. Colour
 *
 * A colour is three numbers, so it lerps like anything else:
 * one lerp per channel. Everything below is built out of that
 * one idea plus `mapRange` to squeeze a step count into 0…1.
 * ───────────────────────────────────────────────────────── */

export type RGB = readonly [number, number, number];

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** Squeeze `value` out of one range and into another. Unclamped on purpose —
 *  callers decide whether overshoot is meaningful. */
export const mapRange = (
  value: number,
  [inMin, inMax]: readonly [number, number],
  [outMin, outMax]: readonly [number, number],
) => {
  if (inMax === inMin) return outMin;
  const t = (value - inMin) / (inMax - inMin);
  return outMin + (outMax - outMin) * t;
};

export const rgb = ([r, g, b]: RGB) =>
  `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;

/* ─────────────────────────────────────────────────────────
 * Interpolating in OKLCH, not in sRGB
 *
 * A per-channel sRGB lerp is a straight line through a space
 * that is not perceptually uniform, and between two hues far
 * apart on the wheel that line cuts through the middle of the
 * gamut — where chroma collapses. Amber → green was the worst
 * case on this card: both endpoints were fine and the midpoint
 * came out #AA9D5F, a dull olive at chroma 0.083, *lower* than
 * either end. That desaturated middle is what read as
 * "blackish green".
 *
 * OKLCH separates lightness, chroma and hue, so interpolating
 * there rotates the hue around the wheel and carries chroma
 * with it instead of driving through the grey centre. The same
 * midpoint becomes #AEB630 at chroma 0.150 — a chartreuse,
 * which is what actually sits between amber and green.
 * ───────────────────────────────────────────────────────── */

/** Lightness 0…1, chroma 0…~0.4, hue in degrees. */
export type OKLCH = readonly [L: number, C: number, H: number];

const gamma = (v: number) =>
  v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;

/** OKLCH → sRGB, via OKLab and linear sRGB (Björn Ottosson's matrices). */
export function oklchToRgb([L, C, H]: OKLCH): RGB {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => clamp(gamma(v) * 255, 0, 255)) as unknown as RGB;
}

/** Shortest way round the wheel — 350° to 10° is 20°, not 340°. */
const mixHue = (a: number, b: number, t: number) => {
  const delta = (((b - a + 540) % 360) - 180) * t;
  return (a + delta + 360) % 360;
};

export const mixOklch = (a: OKLCH, b: OKLCH, t: number): OKLCH => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  mixHue(a[2], b[2], t),
];

/**
 * The ramp, authored in OKLCH so the three stops read as what they are: one
 * lightness arc, one chroma arc, one hue sweep from 32° to 148°.
 *
 * These were red-500, amber-500 and green-500 — stock Tailwind, dropped
 * unmodified into a palette that is otherwise bespoke and warm (#221F1C,
 * #A29C93, #E6E0D6, #FBF9F4). Saturated primaries sit outside that family
 * entirely, and they land on the one element the eye actually goes to. A
 * chart's most important pixel should not be its least designed one.
 *
 * Chroma now climbs across amber → green rather than sagging through it. The
 * green was #7A9A63 at chroma 0.086, which is barely a hue at all —
 * desaturated far enough that it read as dark rather than as green.
 */
const RED: OKLCH = [0.58, 0.135, 32]; // terracotta
const AMBER: OKLCH = [0.77, 0.125, 78]; // ochre
const GREEN: OKLCH = [0.72, 0.175, 148]; // green, and green enough to say so

/**
 * Past this many steps the colour stops moving — the day is simply "done".
 *
 * This was 2,000, which is roughly a walk to the shops. Real daily counts run
 * 3,000–12,000, so at that threshold every genuine day saturated green and the
 * ramp did no work at all; it was calibrated to the demo fixture rather than
 * to the thing it measures. 10,000 is the number people actually carry around.
 */
export const GOAL = 10000;

/** Metres per step, averaged. */
export const STRIDE_METRES = 0.762;

export const kilometres = (steps: number) => (steps * STRIDE_METRES) / 1000;

/**
 * red → amber → green, held flat above `GOAL`.
 *
 * `t` is the same 0…1 as ever. The first half mixes red → amber, the second
 * amber → green, so amber lands exactly at the halfway step count.
 */
export function stepsOklch(steps: number, goal: number = GOAL): OKLCH {
  const t = clamp(mapRange(steps, [0, goal], [0, 1]), 0, 1);
  return t < 0.5
    ? mixOklch(RED, AMBER, t * 2)
    : mixOklch(AMBER, GREEN, t * 2 - 1);
}

export const stepsColor = (steps: number, goal: number = GOAL): RGB =>
  oklchToRgb(stepsOklch(steps, goal));

/**
 * The bar is lit from the top, so its fill runs from a lighter version of the
 * ramp colour down to the colour itself.
 *
 * "Lighter" here is +0.09 lightness in OKLCH with chroma eased back a touch,
 * not a lerp toward white. Mixing with white in sRGB desaturates and cools at
 * the same time, which on the red end turned the terracotta dusty pink.
 */
export function stepsGradient(steps: number, goal: number = GOAL) {
  const base = stepsOklch(steps, goal);
  const lit: OKLCH = [Math.min(1, base[0] + 0.09), base[1] * 0.9, base[2]];
  return `linear-gradient(to bottom, ${rgb(oklchToRgb(lit))}, ${rgb(oklchToRgb(base))})`;
}

/* ─────────────────────────────────────────────────────────
 * 2. Steps log
 * ───────────────────────────────────────────────────────── */

/** A log is a flat map of ISO day → step count. Flat because "delete a day"
 *  then costs one `delete`, and the chart is always derived, never stored. */
export type StepsLog = Record<string, number>;

const pad = (n: number) => String(n).padStart(2, "0");

/** `2026-08-15` */
export const dayKey = (year: number, month: number, day: number) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

export const parseKey = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);
  return { year, month: month - 1, day };
};

export const daysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

export const monthLabel = (year: number, month: number) =>
  new Date(year, month, 1).toLocaleString("en-US", { month: "long" });

/** The 12 months ending with the current one, newest last. */
export function recentMonths(count = 12) {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
}

/**
 * Twelve days of the current month, at counts a person actually walks.
 *
 * The old fixture topped out at 3,680 — under a threshold of 2,000 every one
 * of those days read as "done" and the ramp never moved. These straddle the
 * 10,000 goal in both directions on purpose, so the chart demonstrates the
 * thing it is for: some days short, some days over.
 */
function seed(): StepsLog {
  const now = new Date();
  const counts = [
    6420, 8880, 3200, 11710, 9080, 5340, 7150, 12490, 4960, 10680, 8240, 9910,
  ];
  const log: StepsLog = {};
  counts.forEach((steps, i) => {
    log[dayKey(now.getFullYear(), now.getMonth(), i + 4)] = steps;
  });
  return log;
}

export function useSteps() {
  const [log, setLog] = useState<StepsLog>(seed);

  /** Add and update are the same operation — the key either exists or it
   *  doesn't, and either way the day ends up holding `steps`. */
  const setSteps = useCallback((key: string, steps: number) => {
    setLog((prev) => ({ ...prev, [key]: Math.max(0, Math.round(steps)) }));
  }, []);

  const removeDay = useCallback((key: string) => {
    setLog((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  /** Every entry in one month, oldest first. This drives both the bars and
   *  their density — a month with 31 entries simply returns 31 items. */
  const entriesIn = useCallback(
    (year: number, month: number) =>
      Object.keys(log)
        .filter((key) => {
          const parsed = parseKey(key);
          return parsed.year === year && parsed.month === month;
        })
        .sort()
        .map((key) => ({ key, day: parseKey(key).day, steps: log[key] })),
    [log],
  );

  return { log, setSteps, removeDay, entriesIn };
}

export type StepEntry = ReturnType<
  ReturnType<typeof useSteps>["entriesIn"]
>[number];

/* ─────────────────────────────────────────────────────────
 * 3. Tuned values
 *
 * The radii are the point: `padding` is the gap between the
 * card's outer edge and the plot's, so the plot's radius is
 * the card's minus that gap. Concentric, by construction —
 * change `radius` or `padding` and the inner corners follow.
 * ───────────────────────────────────────────────────────── */

const CARD = {
  width: 420,
  radius: 18,
  padding: 14,
  /** A touch more room top and bottom than at the sides — the header and the
   *  well are both full-bleed horizontally, so the vertical edges are the only
   *  ones that read as cramped.
   *
   *  Measured against `padding`, the gap is now 6 rather than 8: the sides run
   *  14 and the vertical ink sits 20 from both edges once `headerLift` has
   *  paid back the header's leading. */
  paddingBlock: 20,
  /**
   * The header's ink starts ~6px below its box top — a 17px label sits in a
   * 25.5px line box, and half that leading is dead space. `padding` alone
   * therefore measures 12 at the bottom but 18 at the top. Lifting the header
   * by exactly that leading puts ink 12 from both edges.
   */
  headerLift: 6,
  surface: "#FFFFFF",
  ink: "#221F1C",
  muted: "#A29C93",
  /** The well the bars grow out of. Warm rather than grey, and barely there —
   *  it has to sit under `rest` bars without competing with them. */
  plot: "#FBF9F4",
  /** Resting bars stay neutral: the ramp is the *selected* bar's job, and a
   *  whole month of it turns the chart into a fruit salad. */
  rest: "#E6E0D6",
  /**
   * Hover is one shade off the surface, and no more.
   *
   * There were two hover neutrals — #F2EEE7 and #F7F4EF — five values apart
   * per channel and both meaning "this row is hovered": a distinction the eye
   * cannot resolve, and two things to keep in sync for no benefit. They are
   * one token now. The four warm neutrals below run monotonically off the
   * surface — chip, hover, standing state, bars — so every step is one step,
   * and hover reads as *one shade deeper than the chip* rather than as
   * something appearing out of nowhere on white.
   */
  /** The controls' resting chip. They used to be invisible until hovered,
   *  which made three live affordances look like flat text. */
  control: "#F7F4EF",
  hover: "#F0EBE2",
  /**
   * The deeper step, for state that persists after the pointer leaves — a day
   * already on record. This is a real distinction rather than the accidental
   * one above: transient feedback and standing state should not weigh the
   * same, or the standing state stops reading as state.
   */
  selected: "#E9E3D9",
} as const;

/**
 * The drawer around the card.
 *
 * Concentric with it for the same reason the well is concentric with the
 * bars: the sheet's top corners are read against the card's, so its radius is
 * the card's plus the gap between them rather than a number picked by eye.
 */
const SHELL = {
  /**
   * The gutter between the card and the sheet — the same number on all four
   * sides, which is the whole point.
   *
   * It was 10 at the top, 16 at the sides: the handle was sitting *in flow*
   * above the card and adding its own height and margin to whatever the top
   * padding said, so the one edge that looked deliberate was the one nobody
   * had measured. A radius derived from an inconsistent gutter is not
   * concentric with anything — it just happens to agree on two corners.
   *
   * At 9 the sheet reads as a frame around the card rather than as a tray
   * holding it, and the radius chain lands at 27 — close enough to the card's
   * 18 that the two curves read as one nested pair rather than as a soft
   * shape wrapped around a hard one.
   */
  gutter: 9,
  /** Concentric by construction: the sheet's corner is the card's corner plus
   *  the gap between them. Change either and this follows. */
  get radius() {
    return CARD.radius + SHELL.gutter;
  },
  /**
   * Centred inside the top gutter rather than stacked on top of it, so the
   * card still starts exactly `gutter` from the sheet's edge.
   *
   * 4 rather than 6, because the gutter it has to live inside is now 9: at 6
   * it cleared the sheet's top edge by 1.5px, which reads as a mistake rather
   * than as a margin. It is scaled down in both axes — a 40px bar at 4px tall
   * is a different object from a 40px bar at 6px tall — so `handleWidth` moves
   * with it.
   */
  handleHeight: 4,
  handleWidth: 32,
  /** A shade under the card so the card reads as sitting *on* the sheet. */
  surface: "#F4F1EB",
  scrim: "rgb(35 30 25 / 0.4)",
  handle: "#DDD6CA",
} as const;

/**
 * The sheet's own timing, overriding vaul's.
 *
 * Vaul ships 500ms in both directions. That is the top of the 200–500ms band
 * a drawer is allowed, and it is calibrated for a full-height iOS sheet being
 * opened occasionally — this one is a card-sized panel opened from a button
 * you press repeatedly, and at 500ms it reads as slow. The Family drawer
 * makes the same override for the same reason.
 *
 * The curve is kept exactly as vaul's: an extremely steep start that carries
 * most of the distance in the first third, which is what makes a sheet feel
 * like it has weight and is also what lets the duration come down this far
 * without the motion turning into a snap. A weaker curve at 260ms would look
 * like a cut.
 *
 * Out is shorter than in. The sheet on its way in is being read; the sheet on
 * its way out has already been dismissed, and holding someone there is the
 * one part of this interaction with nothing to say.
 */
const SHEET = {
  enterMs: 260,
  exitMs: 200,
  /** Vaul's own curve — an iOS sheet ease, steep enough to afford 260ms. */
  ease: "cubic-bezier(0.32, 0.72, 0, 1)",
} as const;

/**
 * Three overrides and two keyframe pairs, in a real stylesheet because two of
 * them need `@keyframes` and one needs a media query.
 *
 * Specificity is doing deliberate work here. Vaul injects its rules at module
 * load, so source order is not something this can rely on — every selector
 * below carries one more attribute than the vaul rule it is replacing, which
 * makes the outcome independent of which stylesheet lands first. The
 * reduced-motion block is the exception: vaul sets `animation-name` at four
 * attributes, and out-specifying that costs more clarity than `!important`
 * buys back.
 *
 * Hoisted and de-duplicated by React on `href`, so mounting the block twice
 * still yields one <style>.
 */
const SHEET_CSS = `
[data-sc-sheet][data-vaul-drawer] {
  animation-duration: ${SHEET.enterMs}ms;
  animation-timing-function: ${SHEET.ease};
}
[data-sc-sheet][data-vaul-drawer][data-state="closed"] {
  animation-duration: ${SHEET.exitMs}ms;
}
[data-sc-sheet][data-vaul-overlay][data-vaul-snap-points] {
  animation-duration: ${SHEET.enterMs}ms;
  animation-timing-function: ${SHEET.ease};
}
[data-sc-sheet][data-vaul-overlay][data-vaul-snap-points][data-state="closed"] {
  animation-duration: ${SHEET.exitMs}ms;
}
[data-sc-scrim] {
  animation: sc-scrim-in ${SHEET.enterMs}ms ${SHEET.ease};
}
[data-sc-scrim][data-state="closed"] {
  animation: sc-scrim-out ${SHEET.exitMs}ms ${SHEET.ease};
}
@keyframes sc-scrim-in { from { opacity: 0 } }
@keyframes sc-scrim-out { to { opacity: 0 } }
@keyframes sc-sheet-in { from { opacity: 0 } }
@keyframes sc-sheet-out { to { opacity: 0 } }
@media (prefers-reduced-motion: reduce) {
  /* Gentler, not zero: the opacity change survives so the sheet is still
     seen to arrive, and only the full-height travel is dropped. */
  [data-sc-sheet][data-vaul-drawer] { animation-name: sc-sheet-in !important; }
  [data-sc-sheet][data-vaul-drawer][data-state="closed"] { animation-name: sc-sheet-out !important; }
}
`;

/**
 * One rule, at the goal.
 *
 * There were four here, evenly spaced at quarters of `scaleMax` — which is a
 * moving ceiling, so they marked 1,125 / 2,250 / 3,375 / 4,500 and meant
 * nothing. Meanwhile the card was colouring every bar red-to-green against a
 * threshold it never drew. Four rules that said nothing, and the one that said
 * everything left out.
 *
 * Dashed, because a target is a different kind of statement from an axis, and
 * unlabelled, because the caption under the headline names the number — a chip
 * sitting on the line would have to punch an opaque hole through the bars.
 */
const GOAL_LINE = {
  /** The baseline the bars stand on. Kept — it is the axis, and it is the one
   *  horizontal that was always earning its place. */
  axis: "rgb(35 30 25 / 0.07)",
  color: "rgb(35 30 25 / 0.16)",
  dash: "4px",
  gap: "4px",
} as const;

/** The three header controls are one visual set: same size, same weight, same
 *  ink. Drawing them from one place is the only way they stay that way. */
const CONTROL = {
  iconSize: 15,
  /** The select's tick reads at a smaller optical size than a header glyph,
   *  but it is still part of the set — so it is a number here rather than a
   *  literal buried in the menu. */
  tickSize: 13,
  strokeWidth: 1.8,
} as const;

/** The bars are the innermost frame, so the chain is derived from them
 *  outward — see `plotRadius`. The 40% cap is what stops a 10px-wide bar in a
 *  fully logged month from rounding into a pill. */
const BAR = { radius: 4 } as const;

/**
 * The drag handle is the bar's lid, not an object sitting on it: it takes its
 * width from the column and its radius from `--sc-r-bar`, so it reads
 * correctly whether the month has six days or thirty-one.
 *
 * The circle it replaces could not. At a fixed 14px it was less than half the
 * width of a 30px bar in a sparse month and half again *wider* than a 9px bar
 * in a full one — the only measurement on the card that agreed with nothing
 * around it, and the only shape outside the radius chain.
 */
const THUMB = { height: 5 } as const;

const PLOT = {
  height: 132,
  /** The bars inset from the well rather than sitting flush in it — flush, the
   *  outermost bars painted straight over the well's rounded corners. */
  inset: 12,
  /** A zero-step day still gets a stub, so it can be grabbed and dragged. */
  minBar: 8,
} as const;

/**
 * Motion, tuned once so paired elements can't drift apart.
 *
 * `bounce: 0` is the whole point of `SPRING.bar`. Both the column's scaleY
 * entrance and the resting bar's height ride this, and an underdamped spring
 * on either overshoots the value — a bar that springs past its own height is
 * drawing a step count that was never logged. Duration-and-bounce rather than
 * stiffness-and-damping because the two numbers here mean something readable.
 */
const SPRING = { bar: { type: "spring", duration: 0.35, bounce: 0 } } as const;

/**
 * The post-drag rescale, in CSS, because the element it drives is sized by
 * Base UI's inline style rather than by Motion.
 *
 * It has to *match* `SPRING.bar` — the released bar and its neighbours move
 * together, and paired elements that disagree on timing read as a seam. A
 * critically damped spring is a strong ease-out with no overshoot, so
 * ease-out-cubic over the same 350ms is the closest bezier to it. It is an
 * approximation of a spring, not the same curve; worth scrubbing frame by
 * frame before trusting it.
 */
const RESCALE = {
  ms: 350,
  ease: "cubic-bezier(0.215, 0.61, 0.355, 1)",
} as const;

/** ease-out for anything entering or leaving; the quad curve because these are
 *  short fades where a stronger curve just reads as a stall. */
const EASE = { out: [0.25, 0.46, 0.45, 0.94] } as const;

/** The same curve as `EASE.out`, for the CSS side. Said once so the two halves
 *  of the card cannot drift apart. */
const EASE_OUT_CSS = "ease-[cubic-bezier(0.25,0.46,0.45,0.94)]";

/** The three header chips are one control, rendered three ways. One property
 *  list, because `transition-colors` and `transition-transform` both write
 *  `transition-property` and the second would simply win. The press is quicker
 *  than the hover — it has to land inside the click, not after it. */
const CHIP = cn(
  "transition-[background-color,color,scale] duration-[150ms,150ms,100ms]",
  EASE_OUT_CSS,
  "motion-reduce:transition-none",
  "bg-[var(--sc-control)] text-[var(--sc-ink)] hover:bg-[var(--sc-hover)] active:scale-[0.97]",
);

/**
 * The well's radius, derived from the bars outward rather than from the card
 * inward. Both directions are "concentric" and with a radius of 18 over a
 * padding of 12 they disagree — 6 from the card, 18 from the bars. The bars
 * win: they are the thing the eye actually reads the corner against, and the
 * well is a fill behind them rather than a nested frame.
 */
const plotRadius = BAR.radius + PLOT.inset;

/** Density is a pure function of how many days the month has on record: six
 *  entries breathe, a fully logged month packs to hairlines. Bar *width* is
 *  never set — the columns are `flex-1`, so the gap alone does the work. */
const DENSITY = {
  entries: [6, 31] as const,
  gap: [10, 2] as const,
} as const;

const densityGap = (count: number) =>
  clamp(
    mapRange(count, DENSITY.entries, DENSITY.gap),
    DENSITY.gap[1],
    DENSITY.gap[0],
  );

/** One shared ceiling for the bar heights *and* the slider, rounded to a soft
 *  number so it doesn't twitch. Always leaves headroom above the best day. */
const roundUp = (value: number, to: number) => Math.ceil(value / to) * to;
/* The floor is a multiple of the goal so the line always has air above it, and
   1.15 rather than the old 1.6: at a 10,000 goal that floor reserved the top
   37% of the plot for nothing, and the bars paid for it. Rounding to 500 as
   well — 250 was over-precise once the ceiling moved into five figures. */
const scaleFor = (best: number) =>
  roundUp(Math.max(GOAL * 1.15, best * 1.18), 500);

const MONTHS = recentMonths();

/** Sunday-first, to match `Date.getDay()`. Single letters because the cells
 *  are 27px wide and a three-letter abbreviation would not fit one. */
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;

/**
 * The palette, published once.
 *
 * Both roots that need it — the drawer sheet and the card — spread this, so
 * the card still renders correctly when it is used on its own outside the
 * drawer. Namespaced `--sc-*` because this block installs into someone else's
 * stylesheet, where a bare `--ink` or `--hover` is not ours to define.
 *
 * The rule that comes with it: **every portalled root republishes this**, and
 * there are no exceptions. Custom properties inherit down the DOM, and a
 * portal leaves the card's subtree entirely — so a `var(--sc-ink)` inside one
 * resolves to nothing, and a class like `bg-[var(--sc-ink)] text-white` fails
 * to a transparent box with white text on it rather than to a visible
 * fallback. The three `*.Positioner`s below are those roots.
 */
const TOKENS = {
  "--sc-r-card": `${CARD.radius}px`,
  "--sc-pad": `${CARD.padding}px`,
  "--sc-pad-y": `${CARD.paddingBlock}px`,
  /* The concentric chain, expressed once: bars, then the well that clears
     them by `PLOT.inset`. */
  "--sc-r-bar": `${BAR.radius}px`,
  "--sc-r-plot": `${plotRadius}px`,
  "--sc-surface": CARD.surface,
  "--sc-ink": CARD.ink,
  "--sc-muted": CARD.muted,
  "--sc-plot": CARD.plot,
  "--sc-rest": CARD.rest,
  "--sc-control": CARD.control,
  "--sc-hover": CARD.hover,
  "--sc-sel": CARD.selected,
} as React.CSSProperties;

/* ─────────────────────────────────────────────────────────
 * Marks
 * ───────────────────────────────────────────────────────── */

/** Two footprints, tinted with the ramp so the header agrees with the data. */
function FootprintsMark({ color }: { color: string }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      aria-hidden="true"
    >
      <g transform="rotate(-9 4.6 6.4)">
        <ellipse cx="4.6" cy="6.4" rx="2.5" ry="3.9" fill={color} />
        <ellipse
          cx="4.6"
          cy="12"
          rx="1.9"
          ry="1.5"
          fill={color}
          opacity=".55"
        />
      </g>
      <g transform="rotate(9 13.6 9.4)">
        <ellipse cx="13.6" cy="9.4" rx="2.5" ry="3.9" fill={color} />
        <ellipse
          cx="13.6"
          cy="15"
          rx="1.9"
          ry="1.5"
          fill={color}
          opacity=".55"
        />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
 * 4. Shell
 * ───────────────────────────────────────────────────────── */

export interface StepsCountBlockProps {
  /** Rendered as the trigger via `Drawer.Trigger asChild`. Omit it and drive
   *  the drawer with `open` / `onOpenChange` instead. */
  children?: ReactNode;
  /** Controlled open state. When set, the drawer stops tracking its own. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Merged onto the card through `cn`, so width and radius can be overridden
   *  at the call site. */
  className?: string;
  /** The drawer's accessible name and description. Both are visually hidden —
   *  the card's own header already says "Steps" on screen, and a second copy
   *  of it in the sheet chrome would be one heading too many. */
  title?: string;
  description?: string;
  /**
   * Portal target. Defaults to `document.body`, which is what a real bottom
   * sheet wants.
   *
   * Pass an element and the sheet is portalled into it *and* switched from
   * `fixed` to `absolute`, so it fills that element instead of the viewport.
   * The two have to move together — a `fixed` child of a container is still
   * laid out against the viewport, so containing the portal without also
   * containing the positioning just moves the DOM node and changes nothing on
   * screen. The container needs `position: relative` and `overflow: hidden`.
   */
  container?: HTMLElement | null;
  /**
   * `false` drops the scroll lock and the focus trap. Worth turning off when
   * the sheet is demoed inside a page rather than owning the screen —
   * modal-locking a whole documentation page for an inline example is not a
   * trade anyone asked for.
   */
  modal?: boolean;
}

/**
 * The card, in a bottom sheet.
 *
 * `handleOnly` is the load-bearing prop. Vaul's drawer dismisses on a
 * downward drag anywhere in its content, and the selected bar *is* a vertical
 * drag target — without this, pulling a bar down to lower a step count closes
 * the sheet instead, and the one gesture the card exists for is the one
 * gesture it cannot receive. Restricting the dismiss gesture to the grab
 * handle hands every other pixel back to the slider.
 */
export default function StepsCountBlock({
  children,
  open,
  onOpenChange,
  className,
  title = "Steps",
  description = "A month of daily step counts. Tap a bar to select it, then drag to change the count.",
  container,
  modal = true,
}: StepsCountBlockProps) {
  /* One flag, read twice, so the portal target and the positioning can never
     disagree — see the `container` prop. */
  const contained = Boolean(container);

  /* The scrim needs a `data-state` to animate out against, and Radix only
     hands one to its own Overlay and Content. Mirroring the open state here
     covers the uncontrolled case too — vaul calls `onOpenChange` for every
     transition, including a drag dismissal, so the mirror cannot drift. */
  const [selfOpen, setSelfOpen] = useState(false);
  const isOpen = open ?? selfOpen;

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setSelfOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  return (
    <Drawer.Root
      open={open}
      onOpenChange={handleOpenChange}
      handleOnly
      modal={modal}
    >
      {children ? <Drawer.Trigger asChild>{children}</Drawer.Trigger> : null}
      <Drawer.Portal container={container ?? undefined}>
        {/* React hoists this into <head> and de-duplicates it on `href`, so
            two mounted sheets still produce one stylesheet. */}
        <style href="craftui-steps-sheet" precedence="default">
          {SHEET_CSS}
        </style>
        {/* Two scrims, one at a time, because vaul's own overlay is not
            available in both modes.

            `Drawer.Overlay` returns null outright when `modal` is false — it
            is the element vaul uses to lock scroll, so it ships tied to the
            modal path — and vaul additionally cancels outside-press dismissal
            in that mode. Left alone, a non-modal sheet has no scrim and no way
            out but the handle, which is the one dismissal gesture a pointer
            user is least likely to try.

            So the modal path keeps vaul's overlay, for the scroll lock and the
            drag-linked fade, and the non-modal path gets a `Drawer.Close`
            wearing the same colour.

            It is labelled and focusable rather than `aria-hidden`, because
            with no button in the chrome the scrim *is* the close affordance —
            and a dialog whose only exit is an unlabelled surface plus the
            Escape key has no exit in the accessibility tree at all. */}
        {modal ? (
          <Drawer.Overlay
            data-sc-sheet=""
            className={cn("inset-0 z-50", contained ? "absolute" : "fixed")}
            style={{ background: SHELL.scrim }}
          />
        ) : (
          /* `data-state` is written by hand because Radix only gives one to
             its own Overlay and Content. Without it this element has no
             animation, and Presence unmounts anything it cannot see animating
             — so the scrim vanished on the first frame of a 500ms slide. */
          <Drawer.Close
            aria-label="Close"
            data-sc-scrim=""
            data-state={isOpen ? "open" : "closed"}
            className={cn(
              "inset-0 z-50 cursor-default outline-none",
              contained ? "absolute" : "fixed",
            )}
            style={{ background: SHELL.scrim }}
          />
        )}
        <Drawer.Content
          data-sc-sheet=""
          className={cn(
            "inset-x-0 bottom-0 z-50 flex flex-col items-center outline-none",
            contained ? "absolute" : "fixed",
            "bg-[var(--sc-shell)]",
          )}
          style={
            {
              ...TOKENS,
              "--sc-shell": SHELL.surface,
              borderTopLeftRadius: SHELL.radius,
              borderTopRightRadius: SHELL.radius,
              /* One gutter on all four sides. The sides are flush to the
                 viewport, so only the top pair of corners is ever seen — and
                 the bottom keeps painting past the home indicator on iOS,
                 which is added *outside* the gutter rather than replacing it,
                 so the measured gap stays the same on a device that has one
                 and a device that does not. */
              padding: `${SHELL.gutter}px`,
              paddingBottom: `calc(${SHELL.gutter}px + env(safe-area-inset-bottom))`,
            } as React.CSSProperties
          }
        >
          {/* Vaul styles its own handle, but this one has to belong to the
              card's warm neutral family rather than to the library's grey.

              Absolute, and centred *within* the top gutter rather than
              stacked above the card: in flow it added its own height plus a
              margin to the top padding, which is exactly what made the top
              gap disagree with the other three. Out of flow it costs nothing,
              so the card starts one clean `gutter` from every edge. */}
          <Drawer.Handle
            className="!absolute !left-1/2 !-translate-x-1/2 !rounded-full"
            style={{
              top: (SHELL.gutter - SHELL.handleHeight) / 2,
              height: SHELL.handleHeight,
              width: SHELL.handleWidth,
              background: SHELL.handle,
            }}
          />
          <Drawer.Title className="sr-only">{title}</Drawer.Title>
          <Drawer.Description className="sr-only">
            {description}
          </Drawer.Description>
          <StepsCard className={className} />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

/* ─────────────────────────────────────────────────────────
 * 5. Card
 * ───────────────────────────────────────────────────────── */

export function StepsCard({ className }: { className?: string }) {
  const { log, setSteps, removeDay, entriesIn } = useSteps();

  const now = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });
  const [selected, setSelected] = useState<string | null>(null);

  /** Held while a drag is in flight so the whole chart doesn't rescale under
   *  the thumb — the bar you are dragging should track your finger exactly. */
  const [frozenScale, setFrozenScale] = useState<number | null>(null);

  /**
   * True only for the one window where `scaleMax` is actually moving: from
   * releasing a drag until the rescale has landed.
   *
   * The selected bar is sized by Base UI from `max`, so a blanket CSS
   * transition on it would also catch value changes — and arrow-keying the
   * slider would then lag 350ms behind every keypress. Gating on the window
   * instead of on the element means only the rescale glides, and a
   * keyboard-driven change stays instant, which is what it should be.
   */
  const [rescaling, setRescaling] = useState(false);

  useEffect(() => {
    if (!rescaling) return;
    const id = window.setTimeout(() => setRescaling(false), RESCALE.ms);
    return () => window.clearTimeout(id);
  }, [rescaling]);

  const bars = useRef<Record<string, HTMLElement | null>>({});

  /* Two things conspire here. A bar swaps between <RestingBar> and
     <StepSlider> when selected, and React runs the outgoing ref's cleanup
     *after* the incoming one mounts — so cleanup has to check identity or it
     clears the fresh element. And Base UI resolves `anchor` once when the
     popover opens, so an inline getter would go stale the moment the selection
     moves to another bar; the resolved element is held in state instead, which
     changes the prop's value and makes the positioner re-measure. */
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const barRef = useCallback(
    (key: string) => (el: HTMLElement | null) => {
      bars.current[key] = el;
      return () => {
        if (bars.current[key] === el) delete bars.current[key];
      };
    },
    [],
  );

  const entries = entriesIn(cursor.year, cursor.month);
  const best = entries.reduce((max, e) => Math.max(max, e.steps), 0);

  /* The month, which is the question a month view exists to answer. `best` was
     already being computed here and spent entirely on scaling the axis; the
     card knew how the month had gone and never said. */
  const monthTotal = entries.reduce((sum, e) => sum + e.steps, 0);
  const monthAvg = entries.length ? Math.round(monthTotal / entries.length) : 0;
  const daysOver = entries.filter((e) => e.steps >= GOAL).length;

  const todayKey = dayKey(now.getFullYear(), now.getMonth(), now.getDate());
  const viewingThisMonth =
    cursor.year === now.getFullYear() && cursor.month === now.getMonth();
  const todaySteps = log[todayKey] ?? null;
  const scaleMax = frozenScale ?? scaleFor(best);
  const gap = densityGap(entries.length);
  /** At most ~11 labels, so a fully logged month reads as an axis rather than
   *  a row of truncated stumps. Every column stays clickable either way. */
  const labelStride = Math.max(1, Math.ceil(entries.length / 11));

  /**
   * Selection, and only selection.
   *
   * The pill used to follow the pointer — hover won over selection, on the
   * theory that pointing at a bar is a question about that bar. In practice it
   * meant a number chasing the cursor across thirty-one columns on the way to
   * anything else, re-anchoring and re-rendering the whole time. A readout
   * that moves when you were not asking it to is noise. Tapping is the
   * question now, and the pill is the answer.
   */
  const active = selected;

  /* The mark now reports the month's average against the goal, which gives it
     an actual job. Previously it mirrored whatever the headline was showing,
     so two elements carried one signal and the decoration competed with the
     number for it. */
  const accent = rgb(stepsColor(monthAvg));
  /* The pill only renders while `active` is set, so the else-branch is never
     painted — it used to fall back to the headline's day, which is exactly the
     coupling that made two elements report one number. */
  const activeSteps = active
    ? (entries.find((e) => e.key === active)?.steps ?? 0)
    : 0;

  /** Always on screen: `scaleFor` floors the ceiling at 1.15 × the goal. */
  const goalY = (GOAL / scaleMax) * PLOT.height;

  /* A plain function, not a `useCallback`. It is only ever called inline
     during this render, so memoizing it buys nothing — and the React Compiler
     bails out of optimizing the whole component when it cannot prove the
     hand-written memo is safe to keep. Cheaper to let the compiler do it. */
  const heightFor = (steps: number) =>
    Math.max(
      PLOT.minBar,
      mapRange(clamp(steps, 0, scaleMax), [0, scaleMax], [0, PLOT.height]),
    );

  /* `active` alone is not enough. Clicking a bar you are already hovering
     leaves `active` unchanged while the column swaps <RestingBar> for
     <StepSlider> underneath — the stored element detaches and the popover
     falls back to (0, 0). `selected` marks that swap, and `entries.length`
     covers add/delete rebuilding the row. */
  /* The lint rule is right in general and wrong here: this is the documented
     "read an external system after commit" case, the external system being
     the DOM. The element only exists once the row has painted, so there is no
     render-time value to derive this from — and it has to land in *state*
     rather than a ref, because Base UI re-measures on the prop's identity
     changing, which a ref would never do. */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnchorEl(active ? (bars.current[active] ?? null) : null);
  }, [active, selected, entries.length]);

  const select = (key: string) =>
    setSelected((prev) => (prev === key ? null : key));

  const addDay = (day: number) => {
    const key = dayKey(cursor.year, cursor.month, day);
    if (!entries.some((e) => e.key === key)) setSteps(key, 0);
    setSelected(key);
  };

  return (
    /* Motion's half of the reduced-motion story: transform and layout
       animations are dropped, opacity is kept. The CSS transitions carry
       `motion-reduce:transition-none` for the other half. */
    <MotionConfig reducedMotion="user">
      <div
        className={cn("relative w-[420px] max-w-full", className)}
        style={TOKENS}
      >
        <div
          className={cn(
            "flex flex-col bg-[var(--sc-surface)]",
            "rounded-[var(--sc-r-card)] px-[var(--sc-pad)] py-[var(--sc-pad-y)]",
            "shadow-[0_1px_2px_rgb(35_30_25/0.05),0_18px_40px_-18px_rgb(35_30_25/0.18)]",
          )}
        >
          {/* Header ------------------------------------------------------- */}
          <div
            className="flex items-center justify-between"
            style={{ marginTop: -CARD.headerLift }}
          >
            <div className="flex items-center gap-2">
              <FootprintsMark color={accent} />
              <span className="text-[17px] font-medium tracking-[-0.01em] text-[var(--sc-ink)]">
                Steps
              </span>
            </div>

            <div className="flex items-center gap-1">
              {/* `removeDay` had been sitting in the hook unwired since the
                  start — the card could add a day and never take one back, so
                  a mistyped entry was permanent.

                  Rendered always and disabled when it does not apply, rather
                  than mounted on selection: mounting would reflow the two
                  controls beside it every time a bar was clicked, and a header
                  that twitches on the card's most common interaction is worse
                  than a 28px hole. `disabled` also takes it out of the tab
                  order for free. */}
              <button
                type="button"
                aria-label="Remove the selected day"
                disabled={selected === null}
                onClick={() => {
                  if (selected === null) return;
                  removeDay(selected);
                  setSelected(null);
                }}
                className={cn(
                  "grid size-7 place-items-center rounded-md",
                  CHIP,
                  "transition-[background-color,color,scale,opacity] duration-[150ms,150ms,100ms,150ms]",
                  "disabled:pointer-events-none disabled:opacity-0",
                )}
              >
                <HugeiconsIcon
                  icon={Delete02Icon}
                  size={CONTROL.iconSize}
                  strokeWidth={CONTROL.strokeWidth}
                />
              </button>
              <AddDayPopover
                cursor={cursor}
                logged={new Set(entries.map((e) => e.key))}
                onPick={addDay}
              />
              <MonthSelect cursor={cursor} onChange={setCursor} />
            </div>
          </div>

          {/* Headline -----------------------------------------------------
              The month, not a day. This was the selected day's count, which
              the pill already shows at the moment of selection and in a better
              place — attached to the column it describes. Two elements said
              one number while nothing said how the month had gone, and the
              headline carried no date, so on open it silently reported the
              last *logged* day as if it were today. */}
          <div className="mt-4 flex items-end gap-7">
            <Stat value={<NumberFlow value={monthTotal} />} unit="steps" />
            <Stat
              value={
                <NumberFlow
                  value={kilometres(monthTotal)}
                  format={{
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }}
                />
              }
              unit="km"
            />
          </div>

          {/* The threshold, in words. It names the number the ramp judges
              every bar against — the card was colouring days red and green
              against a goal it never once stated. Today leads, because "how am
              I doing" is the question the card gets opened for. */}
          <div className="mt-1 text-[11px] tabular-nums text-[var(--sc-muted)]">
            {viewingThisMonth ? (
              <>
                <span className="text-[var(--sc-ink)]">
                  {todaySteps === null
                    ? ""
                    : todaySteps.toLocaleString("en-US")}
                </span>
              </>
            ) : (
              <>
                Avg{" "}
                <span className="text-[var(--sc-ink)]">
                  {monthAvg.toLocaleString("en-US")}
                </span>
              </>
            )}
            {entries.length > 0 && (
              <>
                {"  ·  "}
                <span className="text-[var(--sc-ink)]">{daysOver}</span> of{" "}
                {entries.length} days past {GOAL.toLocaleString("en-US")}
              </>
            )}
          </div>

          {/* Plot --------------------------------------------------------- */}
          <div
            className={cn(
              "mt-5 flex flex-col bg-[var(--sc-plot)]",
              "rounded-[var(--sc-r-plot)] p-[12px]",
            )}
          >
            <div
              className="relative flex items-end"
              style={{ height: PLOT.height, gap }}
            >
              {/* Behind the bars: absolute and first in the DOM, while the
                  bars are positioned siblings, so they paint over it. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
                style={{ background: GOAL_LINE.axis }}
              />
              {/* The goal. One rule, dashed, at the only height on this chart
                  that carries meaning. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 h-px"
                style={{
                  bottom: goalY,
                  background: `repeating-linear-gradient(to right, ${GOAL_LINE.color} 0 ${GOAL_LINE.dash}, transparent ${GOAL_LINE.dash} calc(${GOAL_LINE.dash} + ${GOAL_LINE.gap}))`,
                }}
              />
              <AnimatePresence initial={false} mode="popLayout">
                {entries.map((entry) => (
                  <motion.div
                    key={entry.key}
                    layout
                    initial={{ opacity: 0, scaleY: 0.4 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    /* Exits run shorter than entrances — the bar is on its way
                     out, and nobody is waiting to read it. */
                    exit={{
                      opacity: 0,
                      scaleY: 0.4,
                      transition: { duration: 0.18, ease: EASE.out },
                    }}
                    /* `bounce: 0` on purpose: overshoot on a bar's scaleY means
                     the column briefly draws a step count that isn't in the
                     data. */
                    transition={SPRING.bar}
                    className="relative min-w-0 flex-1 origin-bottom"
                    style={{ height: PLOT.height }}
                  >
                    {selected === entry.key ? (
                      <StepSlider
                        steps={entry.steps}
                        max={scaleMax}
                        plotHeight={PLOT.height}
                        anchorRef={barRef(entry.key)}
                        rescaling={rescaling}
                        onDragStart={() => {
                          setRescaling(false);
                          setFrozenScale(scaleFor(best));
                        }}
                        onChange={(next) => setSteps(entry.key, next)}
                        onCommit={() => {
                          setFrozenScale(null);
                          setRescaling(true);
                        }}
                      />
                    ) : (
                      <RestingBar
                        height={heightFor(entry.steps)}
                        label={`${entry.steps.toLocaleString()} steps`}
                        onSelect={() => select(entry.key)}
                        anchorRef={barRef(entry.key)}
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {entries.length === 0 && (
                /* The delay is the point. Without it this fades up through
                   the bars still leaving, and the two reads as one muddled
                   crossfade; with it, the row empties and *then* the card
                   says why. */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.12, ease: EASE.out }}
                  className="flex w-full items-center justify-center text-[13px] text-[var(--sc-muted)]"
                  style={{ height: PLOT.height }}
                >
                  No steps logged this month — add a day to start.
                </motion.div>
              )}
            </div>

            {/* Axis, inside the well and sharing its gap so every number stays
              centred under its bar. */}
            <div className="mt-3 flex" style={{ gap }}>
              <AnimatePresence initial={false} mode="popLayout">
                {entries.map((entry, index) => (
                  <motion.button
                    key={entry.key}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    /* A tween, not a spring: a spring's overshoot on opacity
                     just clamps at 0 and 1, so it buys an unpredictable tail
                     and no visible motion. */
                    transition={{ duration: 0.2, ease: EASE.out }}
                    onClick={() => select(entry.key)}
                    /* A press state on Motion's own prop, not CSS: this button
                       carries `layout`, and a CSS transform would be fighting
                       Motion for the same matrix. Opacity rather than scale
                       because 0.97 of a 12px numeral is a third of a pixel —
                       it would not read at all. */
                    whileTap={{ opacity: 0.55 }}
                    className={cn(
                      "min-w-0 flex-1 text-center text-[11px] tabular-nums",
                      "min-h-[18px] transition-colors duration-150",
                      EASE_OUT_CSS,
                      selected === entry.key || entry.key === todayKey
                        ? "text-[var(--sc-ink)]"
                        : "text-[var(--sc-muted)]",
                      selected === entry.key ? "font-semibold" : "font-normal",
                    )}
                  >
                    {/* Today is always labelled, whatever the stride says —
                        the whole point of a marker is that you do not have to
                        count to find it. */}
                    {index % labelStride === 0 ||
                    selected === entry.key ||
                    entry.key === todayKey
                      ? entry.day
                      : ""}
                    {entry.key === todayKey && (
                      <span
                        aria-hidden="true"
                        className="mx-auto mt-[3px] block size-[3px] rounded-full"
                        style={{ background: accent }}
                      />
                    )}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* The count pill. One popover for the whole card, re-anchored to
          whichever bar is selected, rather than 31 popovers that are all
          closed. `initialFocus={false}` keeps the slider's thumb focused. */}
        <Popover.Root
          open={active !== null && anchorEl !== null}
          onOpenChange={(open, details) => {
            if (open || details.reason === "outside-press") return;
            setSelected(null);
          }}
        >
          <Popover.Portal>
            <Popover.Positioner
              side="top"
              align="center"
              sideOffset={16}
              collisionPadding={8}
              anchor={anchorEl}
              /* Every portalled root republishes the palette, without
                 exception — see the note on TOKENS. This one is why the rule
                 exists: the pill is `bg-[var(--sc-ink)]` over `text-white`,
                 and portalled out of the card with nothing defining
                 `--sc-ink`, the background resolved to nothing and left white
                 text on a transparent box. Invisible, and only while dragging,
                 which is the one moment it is being read. */
              style={TOKENS}
              /* The pill is a readout, and it sits directly over the column it
               describes. Without this it captures the pointer, which fires
               pointerleave on the bar, which closes the pill, which hands the
               pointer back — a flicker loop. */
              className={cn(
                "pointer-events-none z-50",
                /* Base UI re-anchors by rewriting this element's `transform` and
                 touches nothing else on it, so transitioning that one property
                 is enough to turn the jump into a glide. A fresh open mounts a
                 new node, and CSS never transitions a first paint — so this
                 only ever animates bar-to-bar, never the entrance. */
                /* ease-in-out, not ease-out: this is an element already on
                 screen travelling from one bar to another, so it should pull
                 away and brake rather than lurch off the mark. */
                "transition-transform duration-200 ease-[cubic-bezier(0.645,0.045,0.355,1)]",
                "motion-reduce:transition-none",
              )}
            >
              <Popover.Popup
                initialFocus={false}
                finalFocus={false}
                className={cn(
                  "rounded-lg bg-[var(--sc-ink)] px-2.5 py-1.5 text-[13px] font-medium text-white tabular-nums",
                  "origin-bottom transition-[transform,scale,opacity] duration-150 ease-out",
                  "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
                  "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
                  "motion-reduce:transition-none",
                )}
              >
                <NumberFlow value={activeSteps} />
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </MotionConfig>
  );
}

/* ─────────────────────────────────────────────────────────
 * Parts
 * ───────────────────────────────────────────────────────── */

function Stat({ value, unit }: { value: ReactNode; unit: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[34px] leading-none font-semibold tracking-[-0.03em] tabular-nums text-[var(--sc-ink)]">
        {value}
      </span>
      <span className="text-[13px] text-[var(--sc-muted)]">{unit}</span>
    </div>
  );
}

/** An unselected day. Plain button — the whole column is the hit area. */
function RestingBar({
  height,
  label,
  onSelect,
  anchorRef,
}: {
  height: number;
  label: string;
  onSelect: () => void;
  anchorRef: (el: HTMLElement | null) => (() => void) | void;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onSelect}
      /* The press squeezes the bar narrower, never shorter.
         Height is the datum — a bar that dips on touch reports a step count
         nobody walked, which is the same objection that put `bounce: 0` on
         `SPRING.bar`. Width carries no meaning here, so it is the one axis
         free to move. Origin is the baseline, so the squeeze reads as the
         column being pressed into the well rather than floating. */
      whileTap={{ scaleX: 0.9 }}
      transition={{ duration: 0.12, ease: EASE.out }}
      className="absolute inset-x-0 bottom-0 flex h-full origin-bottom items-end outline-none"
    >
      <motion.span
        ref={anchorRef}
        layout
        /* Explicitly false, because presence context decides this otherwise
           and it decides differently per column. Columns present when the
           <AnimatePresence initial={false}> mounted inherit "no mount
           animation", so their height snaps — but a column added later is a
           genuinely new presence child, initial is honoured, and with no
           `initial` of its own this span animates up from a rendered height of
           0. That doubled up with the column's own scaleY entrance, which is
           what made only freshly added bars look redrawn. */
        initial={false}
        animate={{ height }}
        /* Same reasoning as the column's scaleY: a bar that overshoots its
           value draws a step count nobody logged. */
        transition={SPRING.bar}
        className={cn(
          "w-full bg-[var(--sc-rest)] rounded-[min(var(--sc-r-bar),40%)]",
          "transition-[filter] hover:brightness-[0.97] motion-reduce:transition-none",
        )}
        /* `height` is a layout property, so this spring costs layout + paint
           per frame rather than a composite. It stays `height` anyway —
           scaleY on a 4px-radius bar visibly distorts its corners — so the
           hint is the mitigation. */
        style={{ willChange: "height" }}
      />
    </motion.button>
  );
}

/**
 * The selected day, as a vertical slider.
 *
 * The track is invisible: what you see filled *is* `Slider.Indicator`, and the
 * thumb rides its top edge, so dragging up grows the bar under your finger.
 * The fill's colour comes straight off the ramp, recomputed every frame.
 *
 * `data-vaul-no-drag` is belt to the shell's braces. `handleOnly` on the
 * drawer already means nothing here can start a dismiss, but this is the
 * element the conflict would actually be about, and it should say so locally
 * rather than depend on a prop three hundred lines away staying set.
 */
function StepSlider({
  steps,
  max,
  plotHeight,
  anchorRef,
  rescaling,
  onChange,
  onCommit,
  onDragStart,
}: {
  steps: number;
  max: number;
  plotHeight: number;
  anchorRef: (el: HTMLElement | null) => (() => void) | void;
  rescaling: boolean;
  onChange: (value: number) => void;
  onCommit: () => void;
  onDragStart: () => void;
}) {
  const dragging = useRef(false);
  const reduceMotion = useReducedMotion();
  /* Ref only. If a pop on select is ever wanted back here it has to be fired
     imperatively: the columns sit inside an <AnimatePresence initial={false}>
     and that flag rides presence context down into every nested motion
     component, so a declarative `initial` is silently ignored. */
  const [fill] = useAnimate();

  return (
    <Slider.Root
      value={steps}
      min={0}
      max={max}
      step={20}
      largeStep={500}
      orientation="vertical"
      onValueChange={(value) => {
        if (!dragging.current) {
          dragging.current = true;
          onDragStart();
        }
        onChange(value as number);
      }}
      onValueCommitted={() => {
        dragging.current = false;
        onCommit();
      }}
      className="absolute inset-0"
    >
      <Slider.Control
        data-vaul-no-drag
        className="relative h-full w-full touch-none select-none"
        style={{ height: plotHeight }}
      >
        {/* The track shows how far there is left to drag, which is only worth
            saying while a drag is happening — sitting there statically it
            reads as a second, taller bar. Base UI flags the drag for us. */}
        <Slider.Track
          className={cn(
            "relative h-full w-full bg-transparent rounded-[min(var(--sc-r-bar),40%)]",
            "transition-colors duration-200 ease-out motion-reduce:transition-none",
            "data-[dragging]:bg-[rgb(35_30_25/0.055)]",
          )}
        >
          {/* The fill is a child of the indicator rather than the indicator
              itself: Base UI's `render` prop rebuilds the element's style each
              render and Motion never gets to drive it, so a `motion.div` there
              stays at `transform: none`. Nesting also keeps the popover's
              anchor (the indicator) still while the fill springs. */}
          {/* Base UI sizes this from `max`, as an inline height percentage.
              That is right during a drag — the bar has to track the finger
              exactly — but on release `frozenScale` clears, `max` jumps, and
              this snapped to its new proportion while every resting bar
              around it sprang. The one bar being watched was the one that
              cut. `rescaling` opens the transition for exactly that window
              and closes it again. */}
          <Slider.Indicator
            ref={anchorRef}
            style={{
              minHeight: PLOT.minBar,
              /* Both guards live in the ternary rather than in a
                 `transition-none` utility, because this is an inline style and
                 only an `!important` class could outrank it. `rescaling` is
                 already false for the whole of a drag — the parent clears it
                 in `onDragStart` — so there is nothing left to guard against
                 there either. */
              transition:
                reduceMotion || !rescaling
                  ? undefined
                  : `height ${RESCALE.ms}ms ${RESCALE.ease}`,
            }}
          >
            {/* Width only — scaling height would move a number the chart is
                using to mean something. Low damping leaves a little
                overshoot. */}
            <div
              ref={fill}
              className="h-full w-full origin-bottom rounded-[min(var(--sc-r-bar),40%)]"
              style={{ background: stepsGradient(steps) }}
            />
          </Slider.Indicator>
          {/* Base UI centres this on the value line (`left: 50%` with
              `translate: -50% 50%`), so a full-width cap straddles the top
              edge of the fill — half above, half below — and reads as the
              bar's lid rather than as a separate object parked on it. */}
          <Slider.Thumb
            getAriaLabel={() => "Steps for the selected day"}
            getAriaValueText={(formatted) => `${formatted} steps`}
            className={cn(
              "w-full bg-white/85 outline-none",
              "shadow-[0_1px_2px_rgb(35_30_25/0.3)]",
              /* The same expression the bars use, so the lid and the box it
                 sits on round together. */
              "rounded-[min(var(--sc-r-bar),40%)]",
              /* Thickens rather than grows. A uniform `scale` on something
                 that is already exactly as wide as its bar would push it out
                 over the gaps on both sides — the precise failure the circle
                 had. Vertical only keeps the width honest. */
              "transition-[scale,background-color] duration-100 ease-out",
              "motion-reduce:transition-none",
              "data-[dragging]:scale-y-125 data-[dragging]:bg-white",
              "focus-visible:ring-2 focus-visible:ring-white/70",
            )}
            style={{ height: THUMB.height }}
          />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
}

/** Picks a day of the current month to start logging. Days already on record
 *  are still clickable — they just select instead of insert. */
function AddDayPopover({
  cursor,
  logged,
  onPick,
}: {
  cursor: { year: number; month: number };
  logged: Set<string>;
  onPick: (day: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const count = daysInMonth(cursor.year, cursor.month);
  /** 0 = Sunday, matching `WEEKDAYS`. */
  const firstWeekday = new Date(cursor.year, cursor.month, 1).getDay();

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label="Add a day"
        className={cn("grid size-7 place-items-center rounded-md", CHIP)}
      >
        <HugeiconsIcon
          icon={PlusSignIcon}
          size={CONTROL.iconSize}
          strokeWidth={CONTROL.strokeWidth}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          side="bottom"
          align="end"
          sideOffset={8}
          className="z-50"
          style={TOKENS}
        >
          <Popover.Popup
            className={cn(
              "w-[212px] rounded-xl bg-white p-2 shadow-[0_2px_6px_rgb(35_30_25/0.08),0_16px_40px_-12px_rgb(35_30_25/0.25)]",
              "origin-top-right transition-[transform,scale,opacity] duration-150 ease-out",
              "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
              "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
              "motion-reduce:transition-none",
            )}
          >
            <div className="mb-2 px-1 text-[11px] text-[var(--sc-muted)]">
              {monthLabel(cursor.year, cursor.month)} {cursor.year}
            </div>
            {/* Seven columns is the universal signal for "calendar", and every
                calendar the reader has ever opened aligns dates to weekday
                columns. This ran 1..N straight into the grid with no offset,
                so the 14th landed wherever arithmetic put it and you had to
                count to find a date instead of reaching for its position. */}
            <div className="mb-1 grid grid-cols-7 gap-0.5 text-[11px] text-[var(--sc-muted)]">
              {WEEKDAYS.map((label, i) => (
                <div key={i} className="grid h-5 place-items-center">
                  {label}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: firstWeekday }, (_, i) => (
                <div key={`pad-${i}`} aria-hidden="true" />
              ))}
              {Array.from({ length: count }, (_, i) => i + 1).map((day) => {
                const has = logged.has(dayKey(cursor.year, cursor.month, day));
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      onPick(day);
                      setOpen(false);
                    }}
                    className={cn(
                      "grid h-7 place-items-center rounded-[6px] text-[11px] tabular-nums",
                      "transition-[background-color,color,scale] duration-[150ms,150ms,100ms]",
                      EASE_OUT_CSS,
                      "motion-reduce:transition-none active:scale-[0.97]",
                      has
                        ? "bg-[var(--sc-sel)] font-medium text-[var(--sc-ink)]"
                        : "text-[var(--sc-muted)] hover:bg-[var(--sc-hover)]",
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function MonthSelect({
  cursor,
  onChange,
}: {
  cursor: { year: number; month: number };
  onChange: (next: { year: number; month: number }) => void;
}) {
  const value = `${cursor.year}-${cursor.month}`;

  /* `items` gives Select.Value a label for the stored key, so the trigger
     reads "August" instead of "2026-7". */
  const items = useMemo(
    () =>
      Object.fromEntries(
        MONTHS.map(({ year, month }) => [
          `${year}-${month}`,
          monthLabel(year, month),
        ]),
      ),
    [],
  );

  return (
    <Select.Root
      items={items}
      value={value}
      onValueChange={(next) => {
        const [year, month] = String(next).split("-").map(Number);
        onChange({ year, month });
      }}
    >
      <Select.Trigger
        className={cn(
          /* `h-7` to match the two icon buttons beside it. Without it this
             trigger was sized by its own line box, so the hover fill was a
             different height from theirs — three controls in a row, three
             backgrounds. The -1px optical nudge that used to live here went
             with it: it was compensating for the missing height, and it also
             dragged the hover fill 1px out of line with its neighbours. */
          /* `pl-2 pr-1.5`, not `px-1.5`. The chevron is a small mark floating
             in a mostly-empty 15px box — about 2.5px of it is transparent on
             each side — so symmetric padding renders as ~6px of gap against
             the "A" and ~8.5px against the arrow. Pad against ink, not against
             bounding boxes. */
          "ml-1 flex h-7 items-center gap-1 rounded-md pr-1.5 pl-2 text-[13px]",
          CHIP,
        )}
      >
        <Select.Value />
        <Select.Icon>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={CONTROL.iconSize}
            strokeWidth={CONTROL.strokeWidth}
            className="pt-0.5"
          />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner
          side="bottom"
          align="end"
          sideOffset={8}
          className="z-50"
          style={TOKENS}
        >
          <Select.Popup
            className={cn(
              "max-h-64 w-[176px] overflow-auto rounded-xl bg-white p-1 shadow-[0_2px_6px_rgb(35_30_25/0.08),0_16px_40px_-12px_rgb(35_30_25/0.25)]",
              "origin-top-right transition-[transform,scale,opacity] duration-150 ease-out",
              "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
              "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
              "motion-reduce:transition-none",
            )}
          >
            <Select.List>
              {MONTHS.map(({ year, month }) => (
                <Select.Item
                  key={`${year}-${month}`}
                  value={`${year}-${month}`}
                  className={cn(
                    "flex cursor-default items-center justify-between rounded-lg px-2.5 py-1.5 text-[13px]",
                    "text-[var(--sc-ink)] data-[highlighted]:bg-[var(--sc-hover)]",
                  )}
                >
                  <Select.ItemText>
                    {monthLabel(year, month)} {year}
                  </Select.ItemText>
                  <Select.ItemIndicator>
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      size={CONTROL.tickSize}
                      strokeWidth={CONTROL.strokeWidth}
                    />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
