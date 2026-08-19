import type { HeroPixelTheme } from "@/components/Homepage/HeroPixelGrid";
import {
  HeroTermIcon,
  type HeroTermMark,
} from "@/components/Homepage/HeroTermIcon";
import { cn } from "@/lib/utils";

/**
 * One entry per HeroPixelTheme, so a term in the intro carries the same hue as
 * the card it names. Keyed by that type rather than a local union, so adding a
 * catalog card without giving its term a colour is a type error.
 *
 * Written as full static class strings because Tailwind scans source text — an
 * interpolated `bg-${theme}-400/12` would never be generated.
 *
 * These utilities are also what puts --color-*-400 in the stylesheet at all:
 * Tailwind emits a theme variable only when some utility uses it, and
 * HeroPixelGrid reads those same six variables to colour its mosaic. Removing a
 * colour here therefore drops the matching card's pixels to their fallback.
 * Keep the two lists in step.
 *
 * Text sits at 700 in light and 300 in dark: the 400 level that reads well as a
 * mosaic pixel fails contrast as small text on a pale tint. `black` tracks the
 * foreground token instead, which already inverts.
 */
const TERM_THEME_VARS: Record<HeroPixelTheme, string> = {
  sky: "bg-sky-400/12 text-sky-700 ring-sky-400/30 dark:text-sky-300",
  green: "bg-green-400/12 text-green-700 ring-green-400/30 dark:text-green-300",
  black: "bg-foreground/8 text-foreground ring-foreground/20",
  yellow:
    "bg-yellow-400/15 text-yellow-700 ring-yellow-400/30 dark:text-yellow-300",
  violet:
    "bg-violet-400/12 text-violet-700 ring-violet-400/30 dark:text-violet-300",
  rose: "bg-rose-400/12 text-rose-700 ring-rose-400/30 dark:text-rose-300",
  orange:
    "bg-orange-400/12 text-orange-700 ring-orange-400/30 dark:text-orange-300",
};

/**
 * A catalog name inside running prose, tinted to match its hero card.
 *
 * Not the shared <Badge>: that one is `h-5 text-xs rounded-4xl`, which fixes a
 * height and font size against the paragraph it would sit in. This inherits
 * both, so it tracks Paragraph's responsive body scale, and takes the
 * rounded-[10px] the hero card CTAs use.
 *
 * whitespace-nowrap keeps the two-word terms ("UI components", "Interactive
 * icons") from breaking across lines, which would split a badge in half.
 *
 * `mark` and `theme` stay separate props even though the intro pairs them 1:1:
 * one names a subject, the other a hue, and folding them together would mean a
 * badge could never be recoloured without redrawing it.
 */
export function HeroTermBadge({
  theme,
  mark,
  children,
  className,
}: {
  theme: HeroPixelTheme;
  mark?: HeroTermMark;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        // align-[-0.06em] is not a nudge to taste — it is an exact correction.
        // An inline-flex box takes its baseline from its FIRST flex item, and
        // an <svg> has none, so one is synthesised from its bottom edge. That
        // puts the reported baseline at (1.5em + icon)/2 from the top while
        // Inter's real one sits at 1.114em, and the browser aligns the wrong
        // number to the paragraph. At the 0.85em icon below the error is
        // (1.5 + 0.85)/2 - 1.114 = 0.061em, and this cancels it. Resize the
        // icon and this value must be recomputed.
        //
        // No py by design: this is an inline chip in a multi-line paragraph, so
        // any vertical padding pushes it past its 21px line box and the lines
        // carrying a badge grow taller than the lines that don't. leading-normal
        // already leaves 0.386em above the caps. For more air, raise the
        // paragraph's line-height rather than padding here.
        //
        // rounded-full, not rounded-[40px]: the browser clamps any radius to
        // half the height anyway, so they render identically and this one says
        // what it means.
        "corner-squircle inline-flex items-center gap-[3px] rounded-full pr-[6px] font-medium whitespace-nowrap tracking-normal ring-1 ring-inset align-[-0.06em]",
        // Optical gap = padding + the glyph's own side bearing, which averages
        // ~1px across the six marks — so 5px here lands the ink 6px off the
        // edge, matching the 6px the text gets on the right after its own
        // ~0.4px bearing. gap-[3px] reads as ~5px between them: deliberately
        // tighter than the outer padding, so mark and text bind as one unit.
        mark ? "pl-[5px]" : "pl-[6px]",
        TERM_THEME_VARS[theme],
        className,
      )}
    >
      {/* 0.85em, in em so it tracks Paragraph's responsive body scale. The
          value is measured, not picked: the six glyphs ink out at a mean 0.839
          of their 24 box, so 0.85em renders ink at 0.713em — 1.00x Inter's
          0.727em cap height, which is where an icon stops competing with the
          text beside it. No padding on this element: it is border-box, so
          padding would shrink the glyph inside the box rather than space it. */}
      {mark && <HeroTermIcon mark={mark} className="size-[0.85em] shrink-0" />}
      {children}
    </span>
  );
}
