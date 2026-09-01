"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import {
  IconArrowUpRight,
  IconChartBar,
  IconChevronDown,
  IconCornerDownRight,
  IconFileDescription,
  IconFilter,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
 * akta-hero-01 — "technical drawing on white paper"
 *
 * Every value lives in this file. Nothing is written into globals.css except
 * the six device classes, which do things a utility cannot express: the notch's
 * masked pseudo-element, the hatch gradient, the rolling label's three
 * coordinated elements, the tick field's indexed stagger, the plate, and the
 * entrance keyframes.
 *
 * There is no `@theme` block and no `:root` palette, so nothing here can
 * collide with — or be re-skinned by — the host's stylesheet, and no class can
 * silently do nothing because a token was never installed. The trade is that
 * dark mode is carried by a `dark:` twin on every colour rather than by
 * swapping one variable, which is why the tokens below are grouped constants
 * rather than repeated at each call site.
 *
 * Every className is assembled with `cn()` in a fixed order so a given concern
 * is always in the same argument:
 *
 *     cn( layout , type , colour , state , device )
 *
 * Read design.md (shipped alongside) before building a matching section.
 * ------------------------------------------------------------------------ */

/* ── Type ─────────────────────────────────────────────────────────────────
 * Size, leading, tracking and weight together — one constant per role.
 * Tracking is in `em`, so a single value stays correct at every step of a
 * responsive ramp: -0.06em is -6% of whatever the size currently is, which is
 * the face's own rule. Only the top display step is tightened by hand. */
const FONT_SANS =
  "font-[family-name:var(--font-geist-sans),ui-sans-serif,system-ui,sans-serif]";
const FONT_MONO =
  "font-[family-name:var(--font-geist-mono),ui-monospace,SFMono-Regular,Menlo,monospace]";

const TYPE_DISPLAY =
  "text-[40px] leading-[44px] tracking-[-0.06em] font-normal sm:text-[56px] sm:leading-[56px] md:text-[64px] md:leading-[64px] lg:text-[80px] lg:leading-[80px] xl:text-[96px] xl:leading-[96px] xl:tracking-[-0.07em]";
const TYPE_HEADING_24 =
  "text-[20px] leading-[28px] tracking-[-0.04em] font-semibold sm:text-[24px] sm:leading-[32px]";
const TYPE_HEADING_20 =
  "text-[18px] leading-[24px] tracking-[-0.02em] font-semibold sm:text-[20px] sm:leading-[26px]";
const TYPE_LABEL = `${FONT_MONO} text-[12px] leading-[16px] font-normal uppercase`;
const TYPE_NAV = `${FONT_MONO} text-[12px] leading-[20px] tracking-[0.06em] font-normal uppercase sm:text-[13px]`;
const TYPE_CTA = `${FONT_MONO} text-[11px] leading-[20px] tracking-[0.04em] font-medium uppercase sm:text-[14px] sm:tracking-[0.06em]`;

/* ── Colour ───────────────────────────────────────────────────────────────
 * Literal oklch, light then dark. Two eleven-step semantic ramps reduced to
 * the roles this block actually uses. Blue is a budget: it appears only on
 * primary action, on interactive notches, and on data that has resolved. */

/* surfaces */
const BG_CANVAS = "bg-white dark:bg-black";
const BG_PANEL =
  "bg-[oklch(0.985_0.002_247.839)] dark:bg-[oklch(0.13_0.028_261.692)]";
const BG_CARD =
  "bg-[oklch(0.967_0.003_264.542)] dark:bg-[oklch(0.21_0.034_264.665)]";
const BG_BRAND =
  "bg-[oklch(0.488_0.243_264.376)] dark:bg-[oklch(0.546_0.245_262.881)]";
const BG_BRAND_DEEP =
  "bg-[oklch(0.424_0.199_265.638)] dark:bg-[oklch(0.623_0.214_259.815)]";
const BG_BRAND_TILE =
  "bg-[oklch(0.932_0.032_255.585)] dark:bg-[oklch(0.379_0.146_265.522)]";
const BG_INK =
  "bg-[oklch(0.13_0.028_261.692)] dark:bg-[oklch(0.967_0.003_264.542)]";
const BG_INERT =
  "bg-[oklch(0.872_0.01_258.338)] dark:bg-[oklch(0.373_0.034_259.733)]";

/* text */
const INK =
  "text-[oklch(0.13_0.028_261.692)] dark:text-[oklch(0.967_0.003_264.542)]";
const INK_MUTED =
  "text-[oklch(0.21_0.034_264.665)] dark:text-[oklch(0.707_0.022_261.325)]";
const INK_BRAND =
  "text-[oklch(0.379_0.146_265.522)] dark:text-[oklch(0.707_0.165_254.624)]";
const BRAND =
  "text-[oklch(0.488_0.243_264.376)] dark:text-[oklch(0.546_0.245_262.881)]";
const ON_BRAND = "text-white";

/* interaction */
const HOVER_BRAND =
  "hover:bg-[oklch(0.424_0.199_265.638)] dark:hover:bg-[oklch(0.623_0.214_259.815)]";
const HOVER_SURFACE =
  "hover:bg-[oklch(0.928_0.006_264.531)] dark:hover:bg-[oklch(0.278_0.033_256.848)]";
const HOVER_CARD =
  "hover:bg-[oklch(0.967_0.003_264.542)] dark:hover:bg-[oklch(0.21_0.034_264.665)]";
const ACTIVE_SURFACE =
  "active:bg-[oklch(0.872_0.01_258.338)] dark:active:bg-[oklch(0.373_0.034_259.733)]";
const HOVER_INK =
  "hover:text-[oklch(0.13_0.028_261.692)] dark:hover:text-[oklch(0.967_0.003_264.542)]";

/* focus rings — offset must clear the notch brackets (rest 6px + weight 1.5px) */
const RING_BRAND =
  "focus-visible:outline-2 focus-visible:outline-offset-[10px] focus-visible:outline-[oklch(0.546_0.245_262.881)] dark:focus-visible:outline-[oklch(0.623_0.214_259.815)]";
const RING_GRAY =
  "focus-visible:outline-2 focus-visible:outline-offset-[10px] focus-visible:outline-[oklch(0.446_0.03_256.802)] dark:focus-visible:outline-[oklch(0.551_0.027_264.364)]";
const RING_CHIP =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[oklch(0.546_0.245_262.881)] dark:focus-visible:outline-[oklch(0.623_0.214_259.815)]";

/* notch and hatch colours, set per call site as arbitrary properties */
const NOTCH_GRAY =
  "[--akta-notch-color:oklch(0.707_0.022_261.325)] dark:[--akta-notch-color:oklch(0.373_0.034_259.733)]";
const HATCH_GRAY =
  "[--akta-hatch-color:oklch(0.928_0.006_264.531)] dark:[--akta-hatch-color:oklch(0.278_0.033_256.848)]";

/* ── Depth and separators ─────────────────────────────────────────────────
 * A border used for depth is a layered box-shadow; a separator is a
 * single-edge inset shadow. Both are transparent, so they survive on any
 * background — including a photographic plate — and neither costs layout
 * space. Dark mode collapses the layered stacks to one white ring, because
 * layered depth is invisible on a dark ground.
 *
 * The `lg:` and `sm:` prefixed rules are separate constants: a variant has to
 * be part of the class name, so it cannot be added to a shared string. */
const SHADOW_BORDER =
  "shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_0_rgba(0,0,0,0.04)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]";
const SHADOW_PANEL =
  "shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_8px_16px_-6px_rgba(0,0,0,0.08),0_24px_48px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_24px_48px_-12px_rgba(0,0,0,0.6)]";
/* color-mix(in oklab, C 45%, transparent) is just C at 45% alpha */
const RING_TILE =
  "shadow-[0_0_0_1px_oklch(0.623_0.214_259.815/0.45)] dark:shadow-[0_0_0_1px_oklch(0.546_0.245_262.881/0.6)]";

const RULE_T =
  "shadow-[inset_0_1px_0_0_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]";
const RULE_B =
  "shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.08)] dark:shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.1)]";
const RULE_R =
  "shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.08)] dark:shadow-[inset_-1px_0_0_0_rgba(255,255,255,0.1)]";
const RULE_Y =
  "shadow-[inset_0_1px_0_0_rgba(0,0,0,0.08),inset_0_-1px_0_0_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),inset_0_-1px_0_0_rgba(255,255,255,0.1)]";
/* right + bottom in one value, so a wrapping grid separates at any column count */
const RULE_CELL =
  "shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.08),inset_0_-1px_0_0_rgba(0,0,0,0.08)] dark:shadow-[inset_-1px_0_0_0_rgba(255,255,255,0.1),inset_0_-1px_0_0_rgba(255,255,255,0.1)]";

const RULE_X_LG =
  "lg:shadow-[inset_1px_0_0_0_rgba(0,0,0,0.08),inset_-1px_0_0_0_rgba(0,0,0,0.08)] dark:lg:shadow-[inset_1px_0_0_0_rgba(255,255,255,0.1),inset_-1px_0_0_0_rgba(255,255,255,0.1)]";
const RULE_L_LG =
  "lg:shadow-[inset_1px_0_0_0_rgba(0,0,0,0.08)] dark:lg:shadow-[inset_1px_0_0_0_rgba(255,255,255,0.1)]";
const RULE_R_LG =
  "lg:shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.08)] dark:lg:shadow-[inset_-1px_0_0_0_rgba(255,255,255,0.1)]";
const RULE_L_SM =
  "sm:shadow-[inset_1px_0_0_0_rgba(0,0,0,0.08)] dark:sm:shadow-[inset_1px_0_0_0_rgba(255,255,255,0.1)]";

/* ── Layout ───────────────────────────────────────────────────────────────
 * The 1440 grid. A band whose rules must cross the whole viewport is a
 * sibling of this container, never a child. */
const GRID = "mx-auto w-full max-w-[90rem]";

/* ── Content ──────────────────────────────────────────────────────────── */

type Mark = { label: string; className: string };

const NAV = [
  { label: "Data", caret: true },
  { label: "Benchmarks" },
  { label: "Pricing" },
  { label: "Resources", caret: true },
  { label: "API Docs", external: true },
];

/* Customer wordmarks, typeset rather than dropped in as logo SVGs — swap each
 * for the real mark when the assets land. They sit on the system's own heading
 * roles, so the block ships no third font family and the wall stays coherent
 * even where Geist never loaded. */
const LOGOS: Mark[] = [
  { label: "KPMG", className: cn(TYPE_HEADING_24, "tracking-tight") },
  { label: "Adobe", className: TYPE_HEADING_24 },
  { label: "JLL", className: cn(TYPE_HEADING_24, "tracking-[0.08em]") },
  { label: "Chicago Booth", className: TYPE_HEADING_20 },
  { label: "BabyAGI", className: TYPE_HEADING_20 },
];

const TAGLINE = [
  "Pay-as-you-go",
  "Built for AI agents",
  "Universal entity resolution",
];

/* One resolved company, shown as a datasheet rather than as JSON. */
const RECORD: [string, string][] = [
  ["ENTITY", "ACME_CORP"],
  ["SECTOR", "SaaS · Fintech"],
  ["HEADCOUNT", "−12%"],
  ["LAST SIGNAL", "4m ago"],
  ["SOURCES", "4"],
];

/* The noise field. Deterministic rather than Math.random() so the server and
 * the client render byte-identical markup — a random field hydrates with a
 * mismatch warning and a visible repaint. 197 of 1,000 articles survive the
 * filter, so ~19.7% of ticks are signal. */
const TICK_COUNT = 168;

function hash(i: number) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const TICKS = Array.from({ length: TICK_COUNT }, (_, i) => {
  const r = hash(i);
  return { height: 22 + hash(i + 991) * 78, signal: r > 0.803 };
});

/* ── Pieces ───────────────────────────────────────────────────────────── */

/* A button label that re-states itself on hover: the visible face rolls up and
 * an identical copy arrives from below. The duplicate is aria-hidden so the
 * accessible name stays single. */
function RollLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="akta-roll whitespace-nowrap">
      <span className="akta-roll-face">{children}</span>
      <span className="akta-roll-face akta-roll-face-next" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

/* One logo-wall cell, cycling through the full set of marks. `offset` staggers
 * both the starting mark and the interval so the six cells never flip in
 * lockstep. Gated on in-view — an interval firing against an off-screen
 * element is pure battery cost. */
function LogoFlip({ marks, offset }: { marks: Mark[]; offset: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduced = useReducedMotion();
  const [n, setN] = useState(offset);

  useEffect(() => {
    if (!inView || reduced) return;
    const id = setInterval(() => setN((v) => v + 1), 2600 + offset * 180);
    return () => clearInterval(id);
  }, [inView, reduced, offset]);

  const mark = marks[n % marks.length];

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="relative flex h-9 w-full items-center justify-center overflow-hidden"
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={n}
          initial={{ y: "110%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-110%" }}
          transition={{ type: "spring", duration: 0.5, bounce: 0 }}
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            mark.className,
          )}
        >
          {mark.label}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* Reduced-motion as an external store rather than an effect, so the phase below
 * can be derived during render instead of written back from a second pass. The
 * server snapshot is `false` — motion is never assumed until the client has
 * actually asked. */
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void) {
  const mql = window.matchMedia(REDUCE_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

const motionAllowed = () => !window.matchMedia(REDUCE_QUERY).matches;
const motionAllowedOnServer = () => false;

/* The panel's noise field. Resting state is the *filtered* field, so a no-JS or
 * reduced-motion visitor meets the truthful end state rather than a wall of
 * undifferentiated ticks. Only once motion is confirmed allowed does it arm the
 * raw state, then sweep it back when the panel scrolls into view.
 *
 * All three phases are derived, never assigned: "rest" until motion is
 * confirmed, "armed" once it is, "run" the first time the panel is in view.
 * `once: true` latches that last step, so the field denoises exactly one time. */
function SignalField() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const canMove = useSyncExternalStore(
    subscribeMotion,
    motionAllowed,
    motionAllowedOnServer,
  );

  const phase = !canMove ? "rest" : inView ? "run" : "armed";

  return (
    <div
      ref={ref}
      data-akta-signal={phase}
      aria-hidden="true"
      className="flex h-32 items-end gap-[3px] overflow-hidden px-4 py-5 sm:h-40 sm:px-5 sm:py-6"
    >
      {TICKS.map((tick, i) => (
        <span
          key={i}
          style={
            {
              height: `${tick.height}%`,
              "--akta-i": i,
            } as React.CSSProperties
          }
          className={cn(
            "akta-tick w-[2px]",
            tick.signal ? BG_BRAND : cn("akta-tick-noise", BG_INK),
          )}
        />
      ))}
    </div>
  );
}

export interface AktaHero01Props {
  /* The photographic plate behind the panel cluster. Purely decorative and
   * painted as a CSS background layer, not an <img>: if the file is absent the
   * layer simply does not paint and the hatch beneath it shows through, so the
   * block never ships a broken image. Pass `null` to force the hatch. */
  plateImage?: string | null;
  className?: string;
}

function AktaHero01({
  plateImage = "/paper-image/AIHero01.png",
  className = "",
}: AktaHero01Props) {
  return (
    <section
      className={cn(
        "relative isolate min-h-screen overflow-hidden",
        FONT_SANS,
        BG_CANVAS,
        INK,
        className,
      )}
    >
      <div className={cn(GRID, "relative", RULE_X_LG)}>
        {/* nav — three cells separated by rules, not by padding */}
        <header className="flex items-stretch justify-between">
          <div
            className={cn(
              "flex items-center px-4 py-4 sm:px-6 sm:py-5 lg:px-10",
              RULE_R_LG,
            )}
          >
            <span className={cn(TYPE_HEADING_20, INK)}>
              akta<span className={INK_BRAND}>.pro</span>
            </span>
          </div>

          <nav className="hidden items-center gap-9 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.label}
                href="#"
                className={cn(
                  "flex items-center gap-1.5",
                  TYPE_NAV,
                  INK_MUTED,
                  cn("transition-colors", HOVER_INK),
                )}
              >
                {item.label}
                {item.caret && (
                  <IconChevronDown className="size-3.5" aria-hidden="true" />
                )}
                {item.external && (
                  <IconArrowUpRight className="size-3.5" aria-hidden="true" />
                )}
              </a>
            ))}
          </nav>

          <div className={cn("flex items-center p-2 sm:p-3", RULE_L_LG)}>
            <a
              href="#"
              className={cn(
                "flex items-center px-3 py-2.5 sm:px-5 sm:py-3",
                TYPE_CTA,
                cn(BG_BRAND, ON_BRAND),
                cn("transition-colors", HOVER_BRAND, RING_BRAND),
                "akta-roll-host akta-notch akta-notch-reveal",
              )}
            >
              <RollLabel>
                <IconCornerDownRight className="size-4" aria-hidden="true" />
                Try for free
              </RollLabel>
            </a>
          </div>
        </header>
      </div>

      {/* announcement — the band is full-bleed so its two rules cross the whole
          viewport past the 1440 grid, while the hatch fill and the corner
          notches stay on the grid. The notches land exactly where the vertical
          rails meet the full-bleed rules, marking the junction instead of
          running the rails through the band. */}
      <div className={cn("relative", RULE_Y)}>
        <div
          className={cn(
            cn(
              GRID,
              "flex items-center justify-center px-4 py-3 sm:px-6 sm:py-5",
            ),
            "akta-hatch akta-notch",
            HATCH_GRAY,
            cn(
              NOTCH_GRAY,
              "[--akta-notch-arm:0px] [--akta-notch-inset:0px] [--akta-notch-weight:1px] lg:[--akta-notch-arm:14px]",
            ),
          )}
        >
          <a
            href="#"
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 sm:gap-3 sm:px-4 sm:py-2",
              BG_PANEL,
              SHADOW_BORDER,
              cn("transition-colors", HOVER_CARD, RING_CHIP),
              "akta-roll-host",
            )}
          >
            <span className={cn(TYPE_NAV, INK)}>
              We&apos;re live on <strong>Product Hunt</strong>
            </span>
            <span
              className={cn(
                "akta-roll akta-roll-diagonal size-7 shrink-0 items-center justify-center",
                BG_BRAND,
                ON_BRAND,
              )}
              aria-hidden="true"
            >
              <span className="akta-roll-face">
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={16}
                  strokeWidth={2}
                />
              </span>
              <span className="akta-roll-face akta-roll-face-next">
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={16}
                  strokeWidth={2}
                />
              </span>
            </span>
          </a>
        </div>
      </div>

      <div className={cn(GRID, "relative", RULE_X_LG)}>
        {/* hero */}
        <div className="flex flex-col items-center gap-12 px-4 py-6 text-center sm:gap-16 sm:px-6 sm:py-16 md:py-6 lg:gap-20 lg:px-10 lg:py-8 xl:gap-24 xl:py-10">
          <div className="w-full">
            <h1
              data-akta-enter="1"
              className={cn(
                "mx-auto mt-6 max-w-md text-balance sm:mt-8 sm:max-w-xl md:max-w-2xl xl:max-w-4xl",
                TYPE_DISPLAY,
                INK,
              )}
            >
              Private company data and signals API
            </h1>

            <div
              data-akta-enter="2"
              className="mt-5 flex flex-wrap items-center justify-center gap-y-1 sm:mt-7"
            >
              {/* Separated by rules, not by a pipe glyph. A "|" is a character:
                  it carries its own font metrics, so it sits on a different
                  line-height from the mono labels either side and throws the
                  row's vertical centring.

                  A wrapped row at every width: 59 characters of mono need about
                  470px, so below sm the phrases reflow onto two lines. The
                  rules only appear from sm, where they all fit on one line — a
                  left rule on an item that has wrapped to the start of a new
                  line reads as a stray tick with nothing to its left. */}
              {TAGLINE.map((item, i) => (
                <span
                  key={item}
                  className={cn(
                    "px-2 py-1 md:px-3 lg:px-4",
                    TYPE_NAV,
                    INK_MUTED,
                    i > 0 && RULE_L_SM,
                  )}
                >
                  {item}
                </span>
              ))}
            </div>

            <div
              data-akta-enter="3"
              className="mt-8 flex flex-nowrap justify-center gap-3 sm:mt-12 sm:gap-6"
            >
              <a
                href="#"
                className={cn(
                  "flex items-center px-3 py-2.5 sm:px-6 sm:py-3.5",
                  TYPE_CTA,
                  cn(BG_BRAND, ON_BRAND),
                  cn("transition-colors", HOVER_BRAND, RING_BRAND),
                  "akta-roll-host akta-notch akta-notch-reveal",
                )}
              >
                <RollLabel>
                  <IconCornerDownRight className="size-4" aria-hidden="true" />
                  Try for free
                </RollLabel>
              </a>
              <a
                href="#"
                className={cn(
                  "flex items-center px-3 py-2.5 sm:px-6 sm:py-3.5",
                  TYPE_CTA,
                  cn(BG_CARD, INK),
                  cn(
                    "transition-colors",
                    HOVER_SURFACE,
                    ACTIVE_SURFACE,
                    RING_GRAY,
                  ),
                  /* grey brackets are the only thing separating this from
                     primary — same shape, same type, same size */
                  cn("akta-roll-host akta-notch akta-notch-reveal", NOTCH_GRAY),
                )}
              >
                <RollLabel>Talk to an engineer</RollLabel>
              </a>
            </div>
          </div>

          {/* panels — the panel sits in flow and sets the stage height; the two
              cards flank it, overlapping its edges */}
          <div className="relative isolate flex w-full max-w-2xl flex-col gap-4 text-left sm:gap-6 md:max-w-4xl lg:block lg:max-w-5xl">
            {/* Background plate — a mat the cluster sits on, bled past the stage
                so it frames the panel rather than hiding behind it. No scrim:
                the panel and both cards are opaque, so the texture only ever
                shows in the margin.

                It bleeds to the full width of the 1440 grid: stage, grid and
                viewport share a centre line, so `left-1/2 -translate-x-1/2`
                plus `w-screen` lands it on the rails at every width. It clips
                inside its own wrapper rather than on the stage, because the
                cards and the panel's brackets sit outside the stage box.

                The bottom bleed stays at 40px while the top grows to 64px. It
                is deliberately asymmetric: above the stage is more of the same
                section, but below it is the logo wall, and the plate must stop
                inside the hero's bottom padding. Bleed past that and the
                photograph lands on the wall's top rule — an 8%-black hairline,
                invisible against a dark image — so the wall reads as having no
                separator at all. */}
            <div
              className="akta-plate absolute -top-10 -bottom-10 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden sm:-top-16"
              style={
                plateImage
                  ? ({
                      "--akta-plate-image": `url(${plateImage})`,
                    } as React.CSSProperties)
                  : undefined
              }
              aria-hidden="true"
            />

            <div
              data-akta-enter="5"
              className={cn(
                "z-20 order-2 w-full p-4 lg:absolute lg:-top-6 lg:left-0 lg:order-none lg:w-56",
                BG_CARD,
                SHADOW_PANEL,
              )}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex size-7 items-center justify-center",
                    BG_BRAND_TILE,
                    RING_TILE,
                  )}
                >
                  <IconChartBar
                    className={cn("size-4", INK_BRAND)}
                    aria-hidden="true"
                  />
                </span>
                <span className={cn(TYPE_LABEL, INK)}>
                  Sentiment
                  <br />
                  analysis
                </span>
              </div>
              <div
                className="mt-4 flex h-10 items-end gap-2"
                aria-hidden="true"
              >
                {[40, 65, 100, 55, 30, 70].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}%` }}
                    className={cn(
                      "w-1.5",
                      h === 100 ? BG_BRAND_DEEP : BG_INERT,
                    )}
                  />
                ))}
              </div>
              <p className={cn("mt-3", TYPE_LABEL, INK_BRAND)}>
                Positive trend detected
              </p>
            </div>

            <div
              data-akta-enter="4"
              className={cn(
                "relative z-10 order-1 mx-auto w-full lg:order-none lg:max-w-2xl",
                BG_PANEL,
                SHADOW_PANEL,
                "akta-notch akta-notch-diagonal [--akta-notch-arm:22px] [--akta-notch-inset:10px]",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5",
                  BG_CARD,
                  RULE_B,
                )}
              >
                <span
                  className={cn("flex items-center gap-2", TYPE_LABEL, INK)}
                >
                  <IconFilter
                    className={cn("size-4", BRAND)}
                    aria-hidden="true"
                  />
                  Signal extraction
                </span>
                <span className={cn(TYPE_LABEL, INK_MUTED)}>Last 24h</span>
              </div>

              <SignalField />

              <p className="sr-only">
                Of 1,000 articles ingested in the last 24 hours, 197 were
                retained as signals — 80 percent were filtered out as noise.
              </p>

              <div className={cn("grid grid-cols-2", RULE_T)}>
                <div className={cn("px-4 py-3 sm:px-5 sm:py-4", RULE_R)}>
                  <p className={cn(TYPE_LABEL, INK_MUTED)}>Articles ingested</p>
                  <p className={cn("mt-1 tabular-nums", TYPE_HEADING_24, INK)}>
                    1,000
                  </p>
                </div>
                <div className="px-4 py-3 sm:px-5 sm:py-4">
                  <p className={cn(TYPE_LABEL, INK_BRAND)}>Signals retained</p>
                  <p
                    className={cn("mt-1 tabular-nums", TYPE_HEADING_24, BRAND)}
                  >
                    197
                  </p>
                </div>
              </div>
            </div>

            <div
              data-akta-enter="6"
              className={cn(
                "z-20 order-3 w-full p-4 lg:absolute lg:right-0 lg:-bottom-6 lg:order-none lg:w-64",
                BG_CARD,
                SHADOW_PANEL,
              )}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex size-7 items-center justify-center",
                    BG_BRAND_TILE,
                    RING_TILE,
                  )}
                >
                  <IconFileDescription
                    className={cn("size-4", INK_BRAND)}
                    aria-hidden="true"
                  />
                </span>
                <span className={cn(TYPE_LABEL, INK)}>Canonical record</span>
              </div>
              <dl className={cn("mt-4 space-y-1.5", TYPE_LABEL, INK_MUTED)}>
                {RECORD.map(([field, value]) => (
                  <div key={field} className="flex justify-between gap-4">
                    <dt>{field}</dt>
                    <dd className={cn("tabular-nums", INK)}>{value}</dd>
                  </div>
                ))}
              </dl>
              <p className={cn("mt-3 pt-3", TYPE_LABEL, INK_BRAND, RULE_T)}>
                + 65 more data points
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* logo wall — the row is full-bleed so its rules cross the viewport,
          while the cells sit on the 1440 grid. Every cell carries a flush
          notch, so each divider is bracketed top and bottom where it meets the
          row's rules. The wall is opaque and raised so it cleanly clips the
          plate bleeding down from the stage above. */}
      <div className={cn("relative z-10 px-2 sm:px-0", BG_PANEL, RULE_T)}>
        <div
          className={cn(GRID, "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6")}
        >
          <div
            className={cn(
              "flex flex-col justify-center gap-1 px-4 py-6 text-left sm:px-6 sm:py-8",
              RULE_CELL,
              cn(
                "akta-notch",
                NOTCH_GRAY,
                "[--akta-notch-arm:8px] [--akta-notch-inset:0px] [--akta-notch-weight:1px] lg:[--akta-notch-arm:10px]",
              ),
            )}
          >
            <span className={cn(TYPE_LABEL, INK_MUTED)}>
              Trusted by{" "}
              <span className={cn("tabular-nums", BRAND)}>5,000+</span> top
              companies
            </span>
          </div>

          {LOGOS.map((mark, i) => (
            <div
              key={mark.label}
              className={cn(
                "flex items-center justify-center gap-2 px-3 py-6 sm:px-4 sm:py-8",
                INK,
                RULE_CELL,
                cn(
                  "akta-notch",
                  NOTCH_GRAY,
                  "[--akta-notch-arm:8px] [--akta-notch-inset:0px] [--akta-notch-weight:1px] lg:[--akta-notch-arm:10px]",
                ),
              )}
            >
              <LogoFlip marks={LOGOS} offset={i} />
            </div>
          ))}
        </div>

        {/* The wall's cells flip through the marks and are aria-hidden, so the
            customer names are stated once here for assistive tech. */}
        <p className="sr-only">
          Trusted by 5,000+ top companies, including{" "}
          {LOGOS.map((m) => m.label).join(", ")}.
        </p>
      </div>

      {/* hatch seam closing the wall */}
      <div className={cn("relative z-10", BG_PANEL, RULE_Y)}>
        <div className={cn(GRID, "akta-hatch h-6 sm:h-9", HATCH_GRAY)} />
      </div>
    </section>
  );
}

export default AktaHero01;
