"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  animate,
  cancelFrame,
  frame,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
  type Transition,
} from "motion/react";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — Curve heading card
 *
 *    0ms   card below the fold. The headline is not a straight
 *          line of text — it is laid out along a bell curve, its
 *          middle held level and both ends drooping away.
 *  enter   card crosses the viewport threshold → card springs up
 * +leadIn  the curve FLATTENS: its amplitude A springs from A₀ to
 *          0. Because every glyph is positioned by the curve
 *          equation, they realign onto a flat baseline for free —
 *          no per-glyph target positions anywhere in this file.
 *   exit   card leaves the viewport → the curve re-bows, so the
 *          whole thing replays on every re-entry. It re-bows towards
 *          whichever edge it left by, so scrolling back up plays the
 *          mirrored pose: card from above, line falling, hump inverted.
 *
 * THE MATH (see `buildBell` / `bellOffset`)
 *   The baseline is a bell curve — a Gaussian — not a circle. Flat tails
 *   at both ends, one smooth hump through the middle:
 *
 *     y(x) = A·(1 − e^(−x²∕2σ²))
 *
 *   Written that way the CENTRE is pinned at y = 0 and the tails sag by
 *   A, which is the shape the reference frame shows: the middle of the
 *   word holds its place while the two ends droop away from it. The
 *   `anchor` dial then slides the whole curve by −anchor·A, so the
 *   middle carries a little travel of its own — anchor = 1 pins the
 *   tails instead and lifts the middle by the full A. Either way the
 *   term is proportional to A, so it resolves to nothing at rest. σ sets
 *   how wide the hump is — small σ gives a narrow bump with long flat
 *   tails, large σ approaches the circular arc this replaced.
 *
 *   Glyphs are distributed along that curve BY ARC LENGTH, so the word
 *   never stretches or compresses along its own baseline — it only
 *   bends. Since a curve is longer than its horizontal span, the text's
 *   horizontal extent has to shrink to keep its length fixed, which is
 *   what makes the bowed word look elastically narrowed. Concretely:
 *
 *     s(x) = ∫₀ˣ √(1 + y′(t)²) dt        cumulative arc length
 *     y′(x) = A·(x∕σ²)·e^(−x²∕2σ²)
 *
 *   `buildBell` tabulates s(x) once per frame and inverts it, so a glyph
 *   whose flat centre sits u·(L/2) along the line is placed at the point
 *   that far ALONG THE CURVE, then rotated by atan(y′) to stay tangent.
 *
 *   A is the single animated value. As A → 0: y → 0, y′ → 0, s(x) → x.
 *   The curve becomes a straight line and every glyph lands exactly
 *   where the browser's own centred layout already put it. That limit is
 *   why the text realigns itself rather than being animated into place.
 *
 *   `spread` optionally delays the outer glyphs, so the ends trail the
 *   middle. At spread = 0 the curve stays rigid and flattens as one.
 * ───────────────────────────────────────────────────────── */

const HEADLINE = "Design Engineer";

const COPY =
  "I am design engineer who loves to craft for details and pixel perfect design.";

/* Tuned in the DialKit panel, then frozen here. Every value that used to
 * be a dial keeps its name and its place in the tree, so the panel can be
 * put back by wrapping this object in useDialKit and restoring the
 * [default, min, max] tuples. */
const CONFIG = {
  card: {
    /* How far below its resting spot the card starts. */
    enterY: 72,
    /* Card opacity while parked. */
    enterOpacity: 0.73,
    /* Visible fraction that arms the sequence — and, falling back
     * through it on the way out, re-arms it. */
    viewportAmount: 0.1,
    spring: { type: "spring", visualDuration: 0.8, bounce: 0.2 } as Transition,
  },
  arc: {
    /* How far the ends of the line droop, in px, before entry.
     * Negative bows the curve upward instead of down. */
    amplitude: 64,
    /* Width of the bell, as a fraction of the line's half-width.
     * Low = a narrow hump through the middle with long flat tails;
     * high = a broad bow approaching a circular arc. */
    sigma: 0.6,
    /* Where the curve hangs from, as a fraction of its amplitude.
     * 0 pins the middle dead still and only the ends move; 1 pins the
     * flat tails and lifts the middle by the full amplitude — the raw
     * bell. In between, the middle gets its own subtle travel that
     * resolves as the curve flattens. */
    anchor: 0.22,
    /* Scales the tangent rotation. 1 = glyphs sit truly tangent to the
     * curve; 0 = they stay upright and only follow its path. */
    tilt: 1,
    /* Whole line's vertical rise, independent of the curvature. */
    riseY: 130,
    /* Extra delay in seconds at the outermost glyph. 0 keeps the curve
     * rigid; higher values let the ends trail the middle. */
    spread: 0.16,
    /* Exponent on the distance ramp — >1 bunches the middle and throws
     * the lag out to the very ends. */
    curve: 1.5,
    /* Gap between the card landing and the curve releasing. */
    leadIn: 0.08,
    spring: { type: "spring", visualDuration: 0.7, bounce: 0.28 } as Transition,
  },
  scroll: {
    enabled: true,
    /* Slope of the map at rest, in px of amplitude per px/s of velocity.
     * A wheel notch is roughly 800px/s. */
    gain: 0.06,
    /* Ceiling the map curves towards but never reaches. Kept in the same
     * neighbourhood as arc.amplitude so a hard scroll bends the word
     * about as far as the entrance does. */
    max: 90,
    /* How the bend chases the scroll and relaxes back to flat. Stiffness
     * has to be high enough to track the peaks — scroll velocity spikes
     * are brief, and a soft spring averages them away into nothing. */
    stiffness: 380,
    damping: 28,
  },
  direction: {
    /* Off = the card always poses the same way, whichever edge it enters
     * from. On = the pose mirrors when entering from the top, so the
     * motion always reads as coming from the scroll. */
    mirrorOnScrollUp: true,
  },
};

const RAD = 180 / Math.PI;

/* Samples used to tabulate the curve's arc length. 128 puts the
 * inversion error well under a tenth of a pixel at display sizes. */
const SAMPLES = 128;

type Metrics = {
  /** Half the natural width of the line, in px. Half the arc length. */
  half: number;
  /** Per-glyph flat centre, normalised to −1…+1 across the line. */
  u: number[];
};

type Bell = {
  /** Height of the curve at horizontal offset x, in px. */
  y: (x: number) => number;
  /** Gradient of the curve at x — the tangent the glyph is rotated to. */
  slope: (x: number) => number;
  /** Inverse arc length: the x that sits `length` px along the curve. */
  xAtLength: (length: number) => number;
};

/* Tabulate one bell curve and its arc length. Amplitude changes every
 * frame, so this is rebuilt constantly — the cache below means glyphs
 * sharing an amplitude (i.e. spread = 0) only pay for it once. */
function buildBell(half: number, amp: number, sigma: number): Bell {
  const s2 = Math.pow(Math.max(sigma * half, 1), 2);

  const y = (x: number) => amp * (1 - Math.exp((-x * x) / (2 * s2)));
  const slope = (x: number) => (amp * x * Math.exp((-x * x) / (2 * s2))) / s2;

  /* Cumulative arc length over [0, half], by trapezoid. Monotonic, so
   * it inverts by a plain binary search. */
  const step = half / SAMPLES;
  const cum = new Float64Array(SAMPLES + 1);
  let prev = Math.sqrt(1 + slope(0) ** 2);

  for (let i = 1; i <= SAMPLES; i++) {
    const next = Math.sqrt(1 + slope(i * step) ** 2);
    cum[i] = cum[i - 1] + ((prev + next) / 2) * step;
    prev = next;
  }

  const xAtLength = (length: number) => {
    if (length <= 0) return 0;
    if (length >= cum[SAMPLES]) return half;

    let lo = 0;
    let hi = SAMPLES;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] > length) hi = mid;
      else lo = mid;
    }

    /* Linear interpolation inside the bracketing sample. */
    const span = cum[hi] - cum[lo] || 1;
    return (lo + (length - cum[lo]) / span) * step;
  };

  return { y, slope, xAtLength };
}

/* Amplitude is a continuous animated value, so the key is quantised to
 * a tenth of a pixel — finer than the curve is ever drawn. */
const bellCache = new Map<string, Bell>();

function getBell(half: number, amp: number, sigma: number): Bell {
  const key = `${half.toFixed(1)}|${amp.toFixed(1)}|${sigma.toFixed(3)}`;
  const hit = bellCache.get(key);
  if (hit) return hit;

  const bell = buildBell(half, amp, sigma);
  if (bellCache.size > 240) bellCache.clear();
  bellCache.set(key, bell);
  return bell;
}

/* Position of one glyph on the curve, expressed as an offset from where
 * that glyph already sits in flat text flow. */
function bellOffset(
  u: number,
  half: number,
  amp: number,
  sigma: number,
  tilt: number,
  anchor: number,
) {
  /* Flat curve — every term collapses to zero. */
  if (Math.abs(amp) < 0.02 || half === 0) return { dx: 0, dy: 0, rot: 0 };

  const bell = getBell(half, amp, sigma);
  const side = u < 0 ? -1 : 1;
  /* The glyph's flat centre, read as a distance along the curve. */
  const x = bell.xAtLength(Math.abs(u) * half);

  return {
    dx: side * x - u * half,
    /* `anchor` slides the whole curve vertically as a fraction of its
     * own amplitude, so the middle travels too instead of sitting
     * perfectly still. Scaling by amp means it unwinds to zero on its
     * own as the curve flattens. */
    dy: bell.y(x) - anchor * amp,
    rot: Math.atan(side * bell.slope(x)) * RAD * tilt,
  };
}

/* Every colour and metric the block paints with, kept as one table so the
 * card can be re-skinned without hunting hex values through the tree. The
 * fluid `clamp()` sizes of the original stylesheet are laddered across
 * Tailwind's breakpoints here — the endpoints are unchanged, each step is
 * the clamp's own value at that breakpoint. */
const SKIN = {
  /* Olive page ground, near-black card — read off the reference frame. */
  scene: "bg-[#3d4a41]",
  card: "bg-[#0a0a0a] rounded-[20px]",
  headlineInk: "text-white",
  bodyInk: "text-[#9b9b9b]",
  /* Matches the original `var(--font-sans), system-ui, sans-serif`, so the
   * card still falls back cleanly in a project with no --font-sans. */
  font: "font-[var(--font-sans),system-ui,sans-serif]",
  /* clamp(20px, 3.2vw, 44px) */
  cardGap: "gap-5 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-11",
  /* clamp(24px, 5vw, 72px) */
  cardPad: "p-6 sm:p-8 md:p-10 lg:p-13 xl:p-16 2xl:p-18",
  /* clamp(56px, 6.4vw, 88px) — flat until 1024px, where 6.4vw clears 56px.
   * Inherited from the tile this replaced; a bare line drawing carries the
   * same footprint without the filled square's visual weight. */
  markSize: "size-14 lg:size-16 xl:size-20 2xl:size-22",
  /* The one size that can't be a viewport ladder. The line is
   * `whitespace-nowrap` inside a card that is `min(1120px, 100%)` wide, so
   * what it has to fit is the CARD's content box — and a viewport
   * breakpoint doesn't know that width. Drop the card into a gallery well
   * or any narrower shell and a vw-derived size overshoots and the ends of
   * the word get clipped by the card's `overflow-hidden`.
   *
   * `cqw` resolves against the content box of the nearest size container —
   * the card itself, see `@container` on it below — so this is measured
   * against exactly the space the line has, with the padding ladder
   * already subtracted. "Design Engineer" sets ~7.3em wide in Inter at
   * -0.03em tracking, so 13cqw lands the line at ~95% of the content box
   * at every card width, mobile through 2xl, and never needs a step.
   * At the 1120px cap that works out to ~127px — the 132px the original
   * clamp topped out at, minus the bit that was overflowing. */
  headlineSize: "text-[13cqw]",
  /* clamp(11px, 1.05vw, 14px) — 1.05vw only clears 11px past 1048px */
  copySize: "text-[11px] xl:text-[13px] 2xl:text-[14px]",
};

export type CurveHeadingProps = {
  /** The line laid along the curve. Split per glyph, so keep it short. */
  headline?: string;
  /** Body copy under the headline. */
  copy?: string;
  /** Extra classes on the card itself. */
  className?: string;
  /**
   * Scrolling ancestor to measure against. Left undefined the block reads
   * the window and the viewport, which is what a real page wants. Point it
   * at an overflow-y container — a gallery well, a modal — and both the
   * entrance trigger and the velocity bend follow that container instead.
   */
  scrollRoot?: React.RefObject<HTMLElement | null>;
  /**
   * Optional nudge centred in the top runway, e.g. "Scroll me". The runway
   * is a blank field of scene colour, so on first paint there is nothing on
   * screen telling you the card is below it. Left undefined the runway stays
   * empty, which is what a real page wants — the page's own content is the
   * cue there.
   */
  hint?: string;
};

export default function CurveHeading({
  headline = HEADLINE,
  copy = COPY,
  className = "",
  scrollRoot,
  hint,
}: CurveHeadingProps = {}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const glyphRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [inView, setInView] = useState(false);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  /* Which side of the viewport the card is parked on: +1 below (it will
   * enter while scrolling down), −1 above (entering while scrolling up).
   * Read from the observer rather than from scroll deltas, so it is the
   * card's actual position that decides, not a guess about intent. */
  const [entrySide, setEntrySide] = useState(1);
  /* Reduced motion strips the movement and keeps the fade: the card
   * still resolves in, but nothing warps, rotates, or tracks scroll. */
  const reduceMotion = useReducedMotion() ?? false;

  const chars = useMemo(() => Array.from(headline), [headline]);
  const charCount = chars.length;

  /* Live scroll velocity, in px/s, mapped to its own slice of curve
   * amplitude. Scrolling down (positive velocity) drags the ends of the
   * word downward — the same sense as the entrance pose — and scrolling
   * up inverts it. Springing the mapped amplitude rather than the raw
   * velocity means it relaxes back to flat on its own the moment the
   * page stops moving. */
  const { scrollY } = useScroll({ container: scrollRoot });
  const velocity = useVelocity(scrollY);

  const dragTarget = useTransform(velocity, (v) => {
    /* Gated at the source: off-screen or reduced-motion, the target
     * holds at 0, the spring settles and stops emitting, and the glyph
     * subscriptions go quiet. Otherwise every scroll anywhere on the
     * page would repaint all fifteen glyphs every frame. */
    if (!CONFIG.scroll.enabled || !inView || reduceMotion) return 0;
    /* Saturating map rather than a hard clamp. A clamp wastes most of
     * its range: ordinary scrolling sits far below the ceiling and only
     * a fling ever reaches it, so the bend reads as barely there. tanh
     * spends the gain where the velocities actually are, curves over
     * smoothly, and can never exceed `max` — no clipping to flat-top. */
    const max = CONFIG.scroll.max;
    if (max <= 0) return 0;
    return max * Math.tanh((v * CONFIG.scroll.gain) / max);
  });

  const dragAmp = useSpring(dragTarget, {
    stiffness: CONFIG.scroll.stiffness,
    damping: CONFIG.scroll.damping,
    mass: 1,
  });

  /* Read the browser's own centred layout for the line: each glyph's
   * flat centre and the natural width of the text. Transforms don't
   * affect offsetLeft/offsetWidth, so this stays valid mid-animation. */
  const measure = useCallback(() => {
    const line = headlineRef.current;
    /* Sliced, not read whole: the ref array keeps its old length when the
     * headline shortens, so the tail would still hold detached nodes. */
    const glyphs = glyphRefs.current.slice(0, charCount);
    const first = glyphs[0];
    const last = glyphs[glyphs.length - 1];
    if (!line || !first || !last) return;

    const width = last.offsetLeft + last.offsetWidth - first.offsetLeft;
    const half = width / 2;
    const mid = first.offsetLeft + half;

    setMetrics({
      half,
      u: glyphs.map((el) =>
        el && half > 0 ? (el.offsetLeft + el.offsetWidth / 2 - mid) / half : 0,
      ),
    });
  }, [charCount]);

  useLayoutEffect(() => {
    measure();

    const line = headlineRef.current;
    if (!line) return;

    /* Webfont swap and container resize both change the layout the arc
     * is derived from. */
    const observer = new ResizeObserver(measure);
    observer.observe(line);
    document.fonts?.ready.then(measure).catch(() => {});

    return () => observer.disconnect();
  }, [measure]);

  /* Hand-rolled observer rather than useInView: it reports which side of
   * the viewport the card is parked on, which useInView does not. */
  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const threshold = Math.min(Math.max(CONFIG.card.viewportAmount, 0), 1);
    const observer = new IntersectionObserver(
      ([entry]) => {
        const armed = entry.intersectionRatio >= threshold;
        /* Compared against the root's own top rather than 0, so the side
         * is read correctly inside a scroll container too — with no root
         * `rootBounds.top` is the viewport's, i.e. 0. */
        const rootTop = entry.rootBounds?.top ?? 0;
        /* Only update the side while the card is parked — once it is on
         * screen the pose is committed and must not flip mid-flight. */
        if (!armed)
          setEntrySide(entry.boundingClientRect.top > rootTop ? 1 : -1);
        setInView(armed);
      },
      {
        root: scrollRoot?.current ?? null,
        threshold: [0, threshold, 1].sort((a, b) => a - b),
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
    /* CONFIG is a module constant, so this only re-runs if the root moves. */
  }, [scrollRoot]);

  /* Everything directional is one multiplier. Entering from the top
   * mirrors the whole pose: the card drops in from above, the line falls
   * rather than rises, and the curve bows the other way — the hump
   * inverts, and with it the tangent rotation and the anchor's counter-
   * move, since both are derived from the signed amplitude. */
  const sign = CONFIG.direction.mirrorOnScrollUp ? entrySide : 1;
  /* One multiplier collapses every travelling value at once, so reduced
   * motion cannot miss one. */
  const travel = reduceMotion ? 0 : sign;

  return (
    <>
      {/* The scene is scrolled past, so it needs runway above and below for
          the card to enter and exit and re-arm the animation. */}
      <div
        className={`flex h-[100svh] items-center justify-center ${SKIN.scene}`}
      >
        {hint && (
          <p
            className={`m-0 flex items-center gap-2 text-[13px] tracking-[0.14em] uppercase ${SKIN.font} text-white/45`}
          >
            {hint}
            {/* Two dots drifting down the same 22px, the second half a beat
                behind, so the cue reads as a direction rather than a pulse.
                Pure CSS — the block's whole JS budget belongs to the curve. */}
            <span
              aria-hidden="true"
              className="relative inline-block h-[22px] w-[3px] overflow-hidden"
            >
              <span className="absolute top-0 left-0 h-[3px] w-[3px] rounded-full bg-white/45 motion-safe:animate-[curve-heading-hint_1.6s_ease-in-out_infinite]" />
              <span className="absolute top-0 left-0 h-[3px] w-[3px] rounded-full bg-white/45 [animation-delay:0.8s] motion-safe:animate-[curve-heading-hint_1.6s_ease-in-out_infinite] motion-reduce:hidden" />
            </span>

            {/* Scoped to the block so it installs with the component — a
                single @keyframes is not worth a stylesheet entry in the
                registry. Under reduced motion nothing references it: the
                lead dot just rests at the top of its track. */}
            <style>{`@keyframes curve-heading-hint {
              0%   { transform: translateY(0);    opacity: 0; }
              25%  { opacity: 1; }
              75%  { opacity: 1; }
              100% { transform: translateY(19px); opacity: 0; }
            }`}</style>
          </p>
        )}
      </div>

      <section
        className={`flex min-h-[100svh] items-center justify-center px-[4vw] py-[6vw] ${SKIN.scene}`}
      >
        <motion.div
          ref={cardRef}
          /* `@container` (container-type: inline-size) is what makes the
             headline's `cqw` size resolve against this card's content box
             rather than the viewport — see SKIN.headlineSize. */
          className={`@container flex aspect-16/10 w-[min(1120px,100%)] flex-col items-center justify-center overflow-hidden ${SKIN.card} ${SKIN.cardGap} ${SKIN.cardPad} ${className}`}
          initial={false}
          animate={{
            /* Full transform string, not the `y` shorthand — this runs
             * while the user is mid-scroll, which is exactly when the
             * shorthand's non-accelerated path costs frames. */
            transform: `translateY(${inView ? 0 : travel * CONFIG.card.enterY}px)`,
            opacity: inView ? 1 : CONFIG.card.enterOpacity,
          }}
          transition={CONFIG.card.spring}
        >
          {/* No tile chrome behind it any more — the mark is a bare line
              drawing, so the rounded-square background would only box it in. */}
          <Mark
            className={`block flex-none ${SKIN.headlineInk} ${SKIN.markSize}`}
          />

          {/* Per-character stagger needs each glyph to be its own box, but
              the line must still break and centre like normal text. */}
          <motion.h1
            ref={headlineRef}
            className={`relative m-0 whitespace-nowrap text-center font-medium leading-[0.95] tracking-[-0.03em] ${SKIN.headlineInk} ${SKIN.font} ${SKIN.headlineSize}`}
            aria-label={headline}
            initial={false}
            animate={{
              transform: `translateY(${inView ? 0 : travel * CONFIG.arc.riseY}px)`,
            }}
            transition={CONFIG.arc.spring}
          >
            {chars.map((char, i) => (
              <Glyph
                key={i}
                char={char}
                ref={(el) => {
                  glyphRefs.current[i] = el;
                }}
                u={metrics?.u[i] ?? 0}
                half={metrics?.half ?? 0}
                straight={inView}
                bowed={travel * CONFIG.arc.amplitude}
                sigma={CONFIG.arc.sigma}
                tilt={CONFIG.arc.tilt}
                anchor={CONFIG.arc.anchor}
                drag={dragAmp}
                delay={
                  CONFIG.arc.leadIn +
                  Math.pow(Math.abs(metrics?.u[i] ?? 0), CONFIG.arc.curve) *
                    CONFIG.arc.spread
                }
                transition={CONFIG.arc.spring}
              />
            ))}
          </motion.h1>

          <p
            className={`m-0 max-w-[46ch] text-center leading-[1.65] tracking-[0.005em] ${SKIN.bodyInk} ${SKIN.font} ${SKIN.copySize}`}
          >
            {copy}
          </p>
        </motion.div>
      </section>

      <div className={`h-[100svh] ${SKIN.scene}`} />
    </>
  );
}

type GlyphProps = {
  char: string;
  u: number;
  half: number;
  straight: boolean;
  bowed: number;
  sigma: number;
  tilt: number;
  anchor: number;
  drag: MotionValue<number>;
  delay: number;
  transition: Transition;
};

/* One glyph riding the curve. It owns a single scalar — the curve's
 * amplitude in px — and derives its whole transform from it, so the
 * animation only ever has one degree of freedom. */
const Glyph = React.forwardRef<HTMLSpanElement, GlyphProps>(function Glyph(
  {
    char,
    u,
    half,
    straight,
    bowed,
    sigma,
    tilt,
    anchor,
    drag,
    delay,
    transition,
  },
  forwardedRef,
) {
  const innerRef = useRef<HTMLSpanElement>(null);
  /* Starts bowed: the card is below the fold on first paint, so the
   * curve must already be bent rather than animating into its bend. */
  const amp = useMotionValue(bowed);

  /* Tracks whether this glyph is currently promoted, so `will-change` is
   * only written when it actually flips. */
  const promoted = useRef(false);

  /* Paint: amplitude → curve offset → transform. The two amplitudes
   * simply add — the entrance pose and the scroll drag are the same
   * quantity, so one curve carries both and there is still only one
   * shape being solved. Repaints once immediately so a remeasure or a
   * dial change lands without waiting for a frame. */
  useEffect(() => {
    const paint = () => {
      const el = innerRef.current;
      if (!el) return;

      const total = amp.get() + drag.get();
      const { dx, dy, rot } = bellOffset(u, half, total, sigma, tilt, anchor);
      el.style.transform = `translate(${dx.toFixed(3)}px, ${dy.toFixed(3)}px) rotate(${rot.toFixed(3)}deg)`;

      /* Promote only while the curve is actually bent. At rest the line
       * is plain static text and holds no compositor layer — fifteen
       * permanently promoted layers behind a 132px face is not worth
       * paying for, so `will-change` is written from here rather than
       * being set as a class. */
      const active = Math.abs(total) > 0.05;
      if (active !== promoted.current) {
        promoted.current = active;
        el.style.willChange = active ? "transform" : "auto";
      }
    };

    /* Both amplitudes tick every frame, so a direct subscription would
     * solve the curve and write the style twice per frame. Scheduling on
     * the render step coalesces them — `frame` dedupes a callback already
     * queued for this frame. */
    const schedule = () => frame.render(paint, false, true);

    paint();
    const stopAmp = amp.on("change", schedule);
    const stopDrag = drag.on("change", schedule);
    return () => {
      stopAmp();
      stopDrag();
      cancelFrame(paint);
    };
  }, [amp, drag, u, half, sigma, tilt, anchor]);

  /* Drive: flatten the curve to 0, or bow it back to A₀.
   * `transition` is a fresh object every render, so the effect keys off
   * its contents — otherwise every unrelated render would restart the
   * spring from wherever it had got to. */
  const transitionKey = JSON.stringify(transition);

  useEffect(() => {
    const controls = animate(amp, straight ? 0 : bowed, {
      ...(JSON.parse(transitionKey) as Transition),
      delay: straight ? delay : 0,
    });
    return () => controls.stop();
  }, [amp, straight, bowed, delay, transitionKey]);

  return (
    /* Outer span keeps the glyph's untransformed slot in normal text flow —
       it is what the curve geometry is measured from. The inner span carries
       the transform, so measuring and painting never fight. */
    <span
      className="inline-block whitespace-pre"
      ref={forwardedRef}
      aria-hidden="true"
    >
      <span
        className="inline-block origin-center whitespace-pre [backface-visibility:hidden]"
        ref={innerRef}
      >
        {char}
      </span>
    </span>
  );
});

/* Mark above the headline — the same little pressed-flower drawing the
 * insight-card design uses for its brand lockup, so the two read as one
 * library. Drawn rather than sourced, so the block still has no image and
 * no icon-package dependency.
 *
 * Every path is `currentColor`, so the mark takes its colour from the
 * `text-` class at the call site — white here, matching the headline. */
function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.35}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="presentation"
    >
      {/* five petals */}
      <path d="M12.00 2.65C12.80 2.65 13.45 3.57 13.45 4.70C13.45 5.83 12.80 6.75 12.00 6.75C11.20 6.75 10.55 5.83 10.55 4.70C10.55 3.57 11.20 2.65 12.00 2.65ZM16.54 6.14C16.78 6.84 16.15 7.70 15.13 8.05C14.12 8.40 13.09 8.11 12.85 7.41C12.61 6.70 13.24 5.85 14.26 5.50C15.27 5.15 16.30 5.43 16.54 6.14ZM15.17 11.76C14.52 12.27 13.41 11.94 12.70 11.03C11.98 10.11 11.93 8.96 12.58 8.45C13.24 7.94 14.35 8.27 15.06 9.18C15.77 10.09 15.82 11.25 15.17 11.76ZM9.37 11.60C8.75 11.18 8.73 10.14 9.32 9.27C9.90 8.40 10.88 8.03 11.50 8.45C12.11 8.86 12.14 9.91 11.55 10.78C10.97 11.65 9.99 12.01 9.37 11.60ZM7.24 6.34C7.45 5.59 8.49 5.24 9.55 5.54C10.61 5.85 11.30 6.69 11.09 7.44C10.87 8.18 9.84 8.54 8.78 8.23C7.72 7.93 7.03 7.08 7.24 6.34Z" />
      {/* pistil */}
      <circle cx="12" cy="7.7" r="1.15" fill="currentColor" stroke="none" />
      {/* stem, leaf, and the pressed-under ground lines */}
      <path d="M12.15 12.4c-.35 2.2-.25 4.4 0 6.1" />
      <path
        d="M12.05 17.1C9.85 16.7 8.3 15.15 7.95 13.05C10.35 13.15 11.75 14.85 12.05 17.1Z"
        fill="currentColor"
        stroke="none"
      />
      <path d="M4.9 19.1c2.3-.45 4.4.2 7.2.15 2.5-.05 4.7-.55 7-.3" />
      <path d="M7.6 21.2c.95-.15 1.75-.1 2.5 0M14.2 21.15c.85-.1 1.55-.05 2.25.05" />
    </svg>
  );
}
