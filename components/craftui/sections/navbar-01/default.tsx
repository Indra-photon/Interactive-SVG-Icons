"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import { useState } from "react";

/* ==================================================================== *
 * The strip
 *
 * One shape, three states. The strip is always the full cell height,
 * bottom-anchored, and `scaleY` squashes it down: to 0 when idle, to a
 * thin bar on the active route, to 1 when filled. Width never changes, so
 * the fill reads as the underline rising rather than as a box appearing.
 *
 * Every end of the range is a known number, so nothing is measured and
 * the only animated property is a transform — it stays on the compositor.
 * Scale is also why the exit is the entrance played backwards: one spring,
 * interruptible mid-flight. Fading instead would race the retraction and
 * make the strip blink away before it finished going down.
 *
 * Mobile runs the same strip turned on its side: rows instead of cells,
 * rising out of each row's rule instead of the bar's. What it cannot run
 * is hover — touch has none — so there the fill *is* the active state and
 * the thin bar is dropped. Two states, same shape, same spring.
 * ==================================================================== */

type NavItem = { label: string; href: string };

type NavbarProps = {
  items?: NavItem[];
  className?: string;
  transition?: Transition;
  labelDuration?: number;
  labelDelay?: number;

  accent?: string;
  labelColorOnFill?: string;
  barHeight?: number;
};

const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

/**
 * The desktop bar's height in pixels. It is `md:h-16` in the markup and the
 * strip's full travel here — `barHeight` is turned into a scale factor
 * against it, which is what keeps the active bar from needing a measurement.
 * Change one and you must change the other.
 */
const NAV_HEIGHT = 64;

/** Separator and bottom rule, as an inset shadow — see the note on <li>. */
const RULE = "rgb(255 255 255 / 0.14)";

/**
 * The panel is the one thing here that animates a layout property, because
 * pushing the page down is the whole point of this pattern — there is no
 * transform that moves everything below it. A tween, not the item spring: a
 * spring's overshoot on height would visibly bounce the page content under
 * it. The ease is a standard decelerating curve, quick out of the gate.
 */
const PANEL_TRANSITION: Transition = {
  duration: 0.28,
  ease: [0.32, 0.72, 0, 1],
};

/** Seconds between adjacent rows on open. */
const ROW_STAGGER = 0.035;

type CellProps = {
  item: NavItem;
  /** Where the strip ends up: 0 hidden, `barScaleY` a thin bar, 1 a full fill. */
  fill: number;
  /** Whether the label sits on the accent and needs the dark ink. */
  inked: boolean;
  accent: string;
  labelColorOnFill: string;
  labelDuration: number;
  labelDelay: number;
  transition: Transition;
  reduceMotion: boolean;
  isActive: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
  /** Rule position differs by axis: a left edge in the row, a top edge stacked. */
  ruleShadow?: string;
  liClassName: string;
  linkClassName: string;
  /** Column rows only — the staggered reveal as the panel opens. */
  reveal?: { open: boolean; index: number };
};

function NavCell({
  item,
  fill,
  inked,
  accent,
  labelColorOnFill,
  labelDuration,
  labelDelay,
  transition,
  reduceMotion,
  isActive,
  onSelect,
  onHover,
  ruleShadow,
  liClassName,
  linkClassName,
  reveal,
}: CellProps) {
  return (
    <motion.li
      animate={
        reveal ? { opacity: reveal.open ? 1 : 0, y: reveal.open ? 0 : -6 } : undefined
      }
      className={`relative isolate ${liClassName}`}
      initial={reveal ? false : undefined}
      style={{ boxShadow: ruleShadow }}
      transition={
        reveal && !reduceMotion
          ? { ...PANEL_TRANSITION, delay: reveal.open ? reveal.index * ROW_STAGGER : 0 }
          : { duration: 0 }
      }
    >
      <a
        aria-current={isActive ? "page" : undefined}
        className={`relative flex items-center text-[11px] font-semibold tracking-[0.18em] text-white uppercase outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-inset ${linkClassName}`}
        href={item.href}
        onBlur={() => onHover(false)}
        onClick={(event) => {
          event.preventDefault();
          onSelect();
        }}
        onFocus={() => onHover(true)}
        // pointerType guards the sticky-hover-after-tap problem on touch,
        // where there is no matching leave event.
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") onHover(true);
        }}
      >
        <motion.span
          animate={{ scaleY: fill }}
          aria-hidden="true"
          // Bottom-anchored: the strip grows upward out of the rule below it
          // and never moves sideways.
          className="absolute inset-x-0 bottom-0 -z-10 h-full origin-bottom"
          style={{ background: accent }}
          transition={reduceMotion ? { duration: 0 } : transition}
        />
        <span
          style={{
            color: inked ? labelColorOnFill : undefined,
            // The ink lands just after the accent arrives, not with it. No
            // delay on the way out, so it clears before the strip retracts.
            transition: reduceMotion
              ? "none"
              : `color ${labelDuration}s ease-out ${inked ? labelDelay : 0}s`,
          }}
        >
          {item.label}
        </span>
      </a>
    </motion.li>
  );
}

export default function Navbar01({
  items = navItems,
  className,
  transition = { type: "spring", stiffness: 440, damping: 36, mass: 0.4 },
  labelDuration = 0.07,
  labelDelay = 0.04,

  accent = "oklch(0.935 0.198 111.5)",
  labelColorOnFill = "oklch(0.145 0 0)",
  barHeight = 3,
}: NavbarProps) {
  const [activeHref, setActiveHref] = useState(items[0]?.href);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  const barScaleY = Math.min(barHeight / NAV_HEIGHT, 1);

  const shared = {
    accent,
    labelColorOnFill,
    labelDuration,
    labelDelay,
    transition,
    reduceMotion,
  };

  return (
    <nav
      // `md:pr-6` mirrors the brand's left gutter, and it is also what makes
      // the last item's right rule visible: flush against the container the
      // 1px shadow sits on the clipping edge, where a fractional width or an
      // ancestor's `overflow-hidden` swallows it.
      className={`w-full shadow-[inset_0_-1px_0_0_rgb(255_255_255/0.14)] md:flex md:h-16 md:items-center md:justify-between md:pr-6 ${className ?? ""}`}
      // The whole bar clears the hover so leaving sideways doesn't strand a fill.
      onPointerLeave={() => setHoveredHref(null)}
    >
      <div className="flex h-16 items-center justify-between pr-4 pl-6 md:h-full md:pr-0">
        <a
          className="flex items-center gap-2.5 text-[18px] font-semibold tracking-tight text-white"
          href={items[0]?.href ?? "#"}
        >
          {/* Dropped below md: with the mark gone the wordmark starts at the
              row padding itself, which is the same 24px the stacked labels
              use — one text edge down the open menu, nothing hanging in the
              gutter to line it up against. */}
          <svg
            aria-hidden="true"
            className="hidden size-5 shrink-0 md:block"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="6" r="3.4" />
            <circle cx="6" cy="15.5" r="3.4" />
            <circle cx="18" cy="15.5" r="3.4" />
          </svg>
          <span>MP2 Collective</span>
        </a>

        <button
          aria-controls="navbar-01-panel"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="-mr-2 flex size-10 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:hidden"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          {/* Two bars that cross into an ✕. Both rotate about the same centre,
              so the close state is the open state folded rather than a second
              icon swapped in. */}
          <span aria-hidden="true" className="relative block h-4 w-5">
            {[-4, 4].map((offset, index) => (
              <motion.span
                animate={{
                  rotate: isOpen ? (index === 0 ? 45 : -45) : 0,
                  y: isOpen ? 0 : offset,
                }}
                className="absolute top-1/2 left-0 block h-0.5 w-full -translate-y-1/2 rounded-full bg-white"
                key={offset}
                transition={reduceMotion ? { duration: 0 } : transition}
              />
            ))}
          </span>
        </button>
      </div>

      {/* Desktop: the original row, cells side by side. */}
      <ul className="hidden h-full md:flex md:items-stretch">
        {items.map((item, index) => {
          const isActive = activeHref === item.href;
          const isFilled = hoveredHref === item.href;

          return (
            <NavCell
              {...shared}
              fill={isFilled ? 1 : isActive ? barScaleY : 0}
              inked={isFilled}
              isActive={isActive}
              item={item}
              key={item.href}
              liClassName="h-full"
              linkClassName="h-full px-7"
              onHover={(hovered) => setHoveredHref(hovered ? item.href : null)}
              onSelect={() => setActiveHref(item.href)}
              // Separators are `inset` box-shadows, not borders: an inset
              // shadow paints inside the box instead of adding a pixel to it,
              // so item widths stay exactly what the padding says — which is
              // what the strip is sized from. A left edge on every item gives
              // the lines *between* items and closes the run at its start;
              // the last item adds a right edge so it doesn't trail off.
              ruleShadow={[
                `inset 1px 0 0 0 ${RULE}`,
                index === items.length - 1 && `inset -1px 0 0 0 ${RULE}`,
              ]
                .filter(Boolean)
                .join(", ")}
            />
          );
        })}
      </ul>

      {/* Mobile: the same cells stacked, unrolled inside the bar so the page
          is pushed down rather than covered. `height: auto` is measured by
          Motion, so the panel never needs a hardcoded open height. */}
      <motion.div
        animate={{ height: isOpen ? "auto" : 0 }}
        className="overflow-hidden md:hidden"
        id="navbar-01-panel"
        initial={false}
        transition={reduceMotion ? { duration: 0 } : PANEL_TRANSITION}
      >
        <ul className="flex flex-col">
          {items.map((item, index) => {
            const isActive = activeHref === item.href;

            return (
              <NavCell
                {...shared}
                // No hover on touch, so the fill is the active state outright
                // and the thin bar has nothing left to mark.
                fill={isActive ? 1 : 0}
                inked={isActive}
                isActive={isActive}
                item={item}
                key={item.href}
                liClassName=""
                linkClassName="h-14 px-6"
                onHover={() => {}}
                onSelect={() => {
                  setActiveHref(item.href);
                  setIsOpen(false);
                }}
                reveal={{ index, open: isOpen }}
                // Stacked, the rule moves to the top edge of every row —
                // including the first, which is what separates the list from
                // the brand row above it. The first row also carries a left
                // edge and the last a right edge, so the column is bracketed
                // rather than left running open at both ends.
                ruleShadow={[
                  `inset 0 1px 0 0 ${RULE}`,
                  index === 0 && `inset 1px 0 0 0 ${RULE}`,
                  index === items.length - 1 && `inset -1px 0 0 0 ${RULE}`,
                ]
                  .filter(Boolean)
                  .join(", ")}
              />
            );
          })}
        </ul>
      </motion.div>
    </nav>
  );
}
