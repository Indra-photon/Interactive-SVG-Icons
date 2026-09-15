"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionValue,
  useVelocity,
  useSpring,
  MotionValue,
} from "motion/react";
import Lenis from "lenis";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  StarIcon,
  UserGroupIcon,
  Calendar01Icon,
  Location01Icon,
  Airplane01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

/* ── Type — the akta roles this section uses ──────────────────────────────
 * Size, leading, tracking and weight together, one constant per role, as in
 * akta-hero-01. Sans carries the headline, figures and copy; every label is
 * uppercase mono, which is what makes the panel read as an instrument rather
 * than a brochure. Tracking is in em so a value stays right across a ramp. */
const FONT_SANS =
  "font-[family-name:var(--font-geist-sans),ui-sans-serif,system-ui,sans-serif]";
const FONT_MONO =
  "font-[family-name:var(--font-geist-mono),ui-monospace,SFMono-Regular,Menlo,monospace]";

/* destination name — h2 */
const TYPE_HEADING_48 =
  "text-[32px] leading-[1.12] tracking-[-0.01em] font-normal sm:text-[40px] sm:leading-[1.1] sm:tracking-[-0.03em] lg:text-[48px] lg:leading-[1.08]";
/* price */
const TYPE_HEADING_32 =
  "text-[24px] leading-[1.25] tracking-[-0.05em] font-medium sm:text-[28px] sm:leading-[1.21] lg:text-[32px] lg:leading-[1.19]";
/* stat figures */
const TYPE_HEADING_20 =
  "text-[18px] leading-[1.33] tracking-[-0.02em] font-semibold sm:text-[20px] sm:leading-[1.3]";
/* location line */
const TYPE_COPY_16 =
  "text-[15px] leading-[1.6] tracking-[-0.01em] font-normal sm:text-[16px] sm:leading-[1.625]";
/* tagline — akta's heading-24 size at copy weight: one step under the
 * price, large enough to carry the line rather than caption it */
const TYPE_TAGLINE =
  "text-[20px] leading-[1.4] tracking-[-0.03em] font-normal sm:text-[24px] sm:leading-[1.33]";
/* location line, season */
const TYPE_COPY_14 =
  "text-[13px] leading-[1.54] tracking-[-0.01em] font-normal sm:text-[14px] sm:leading-[1.57]";
/* every label */
const TYPE_LABEL = `${FONT_MONO} text-[12px] leading-[16px] font-normal uppercase`;
/* the section eyebrow — the nav role, a touch more tracked than a label */
const TYPE_NAV = `${FONT_MONO} text-[12px] leading-[20px] tracking-[0.06em] font-normal uppercase sm:text-[13px]`;
/* button labels — sans, not the mono CTA role: a travel pill reads warmer */
const TYPE_CTA = "text-[14px] leading-[20px] tracking-[-0.01em] font-medium";

/* ── Colour ───────────────────────────────────────────────────────────────
 * The panel is a fixed white card, so this is akta's light ramp only. Ink
 * roles for the copy; blue is spent on the primary action and nowhere else. */
const INK = "text-[oklch(0.13_0.028_261.692)]";
const INK_MUTED = "text-[oklch(0.21_0.034_264.665)]";
const INK_LOW = "text-[oklch(0.446_0.03_256.802)]";
/* brand-solid as ink — spent on the plane riding the arc, and nowhere else */
const BRAND = "text-[oklch(0.488_0.243_264.376)]";
/* the arc as SVG paint — track in brand-ui, the flown length in brand-solid */
const STROKE_BRAND_TRACK = "stroke-[oklch(0.932_0.032_255.585)]";
const STROKE_BRAND = "stroke-[oklch(0.488_0.243_264.376)]";

/* ── Buttons ──────────────────────────────────────────────────────────────
 * Rounded pills. The primary is a vertical gradient through akta's blue —
 * the border-hover step on top, brand-solid beneath — lit by one white inset
 * hairline along the top edge. No outer shadow: the card is flat, so the
 * button stays in its plane. Hover shifts the whole ramp one step darker. */
const ON_BRAND = "text-white";
const BG_BRAND_GRADIENT =
  "bg-[linear-gradient(180deg,oklch(0.546_0.245_262.881),oklch(0.488_0.243_264.376))]";
const HOVER_BRAND_GRADIENT =
  "hover:bg-[linear-gradient(180deg,oklch(0.488_0.243_264.376),oklch(0.424_0.199_265.638))]";
const INSET_LIGHT = "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35)]";
const BG_CARD = "bg-[oklch(0.967_0.003_264.542)]";
const HOVER_SURFACE = "hover:bg-[oklch(0.928_0.006_264.531)]";
const ACTIVE_SURFACE = "active:bg-[oklch(0.872_0.01_258.338)]";
const RING_BRAND =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.546_0.245_262.881)]";
const RING_GRAY =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.446_0.03_256.802)]";

const slides = [
  {
    name: "Santorini",
    country: "Greece",
    region: "Cyclades Islands",
    tagline:
      "Whitewashed villages stacked above a caldera, where every sunset turns the Aegean gold",
    price: "$420",
    duration: "7 days",
    image: "https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg",
    stats: {
      trips: "120+",
      rating: "4.9",
      travelers: "3.2k",
      season: "Apr – Oct",
    },
  },
  {
    name: "Kyoto",
    country: "Japan",
    region: "Kansai Region",
    tagline:
      "Ancient temples and lantern-lit lanes, hidden in the hush of towering bamboo groves",
    price: "$185",
    duration: "5 days",
    image: "https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg",
    stats: {
      trips: "94+",
      rating: "4.8",
      travelers: "2.7k",
      season: "Mar – May",
    },
  },
  {
    name: "Maldives",
    country: "South Asia",
    region: "Indian Ocean",
    tagline:
      "Overwater villas drifting above lagoons so clear the reef reads like a map beneath you",
    price: "$890",
    duration: "6 days",
    image: "https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg",
    stats: {
      trips: "68+",
      rating: "5.0",
      travelers: "1.9k",
      season: "Nov – Apr",
    },
  },
  {
    name: "Patagonia",
    country: "Argentina",
    region: "Southern Andes",
    tagline:
      "Granite spires, blue glaciers and open steppe — raw wilderness at the edge of the world",
    price: "$290",
    duration: "10 days",
    image: "https://images.pexels.com/photos/2440021/pexels-photo-2440021.jpeg",
    stats: {
      trips: "52+",
      rating: "4.7",
      travelers: "1.1k",
      season: "Nov – Mar",
    },
  },
  {
    name: "Amalfi Coast",
    country: "Italy",
    region: "Campania",
    tagline:
      "Pastel villages draped down sheer cliffs, lemon groves running to turquoise water",
    price: "$340",
    duration: "5 days",
    image: "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg",
    stats: {
      trips: "88+",
      rating: "4.8",
      travelers: "2.4k",
      season: "May – Sep",
    },
  },
];

type Slide = (typeof slides)[0];

/* Crossfade for the destination block. Outgoing and incoming copy are stacked
 * in one grid cell so they fade over each other in place rather than one
 * waiting for the other — a true crossfade, and no layout jump as the exiting
 * block leaves the flow. */
const FADE = { duration: 0.45, ease: [0.16, 1, 0.3, 1] } as const;

function CrossfadeText({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string | number;
}) {
  return (
    <div className="grid">
      <AnimatePresence initial={false}>
        <motion.div
          key={id}
          className="[grid-area:1/1]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={FADE}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* Primary and secondary action: same pill, same type, same size. The
 * secondary is a flat gray so the gradient reads as the one thing to press.
 * Padding is optical, not symmetric: the arrow sits on the right, so that
 * side runs 2px tighter (18px) than the text side (20px) — equal padding
 * makes the icon look pushed out past the label. */
function CtaRow({
  primary,
  secondary,
}: {
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-wrap gap-3 ml-[-2px]">
      <a
        href={primary.href}
        className={cn(
          "inline-flex items-center gap-2 rounded-[8px] py-2.5 pr-[18px] pl-6",
          TYPE_CTA,
          cn(BG_BRAND_GRADIENT, ON_BRAND, INSET_LIGHT),
          cn(
            "transition-[background,transform] active:scale-[0.98]",
            HOVER_BRAND_GRADIENT,
            RING_BRAND,
          ),
        )}
      >
        {primary.label}
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={16}
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </a>
      {secondary && (
        <a
          href={secondary.href}
          className={cn(
            "inline-flex items-center gap-2 rounded-[8px] py-2.5 pr-[18px] pl-6",
            TYPE_CTA,
            cn(BG_CARD, INK),
            cn(
              "transition-[background,transform] active:scale-[0.98]",
              HOVER_SURFACE,
              ACTIVE_SURFACE,
              RING_GRAY,
            ),
          )}
        >
          {secondary.label}
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            size={16}
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </a>
      )}
    </div>
  );
}

/* Splits a stat into the number the spring drives and the symbols around it.
 * "120+" → 120 "+", "3.2k" → 3.2 "k", "4.9" → 4.9. */
function parseStatValue(value: string) {
  const base = { prefix: "", suffix: "", decimals: 0, isText: false };
  if (/^\d+\+$/.test(value))
    return { ...base, num: parseInt(value), suffix: "+" };
  if (/^\d+(\.\d+)?k$/.test(value))
    return { ...base, num: parseFloat(value), suffix: "k", decimals: 1 };
  if (/^\d+\.\d+$/.test(value))
    return { ...base, num: parseFloat(value), decimals: 1 };
  return { ...base, num: 0, isText: true };
}

/* Air between a figure and the symbol against it — "$ 420", "120 +", "3.2 k".
 * The heading roles carry negative tracking, which eats into any gap set
 * here, so this is a touch more than it looks. In em so it scales with the
 * role it sits in. */
const UNIT_GAP = "0.14em";

/* Splits a figure into its digits and whatever symbol sits against them —
 * "$420" → "$" + "420", "93%" → "93" + "%" — so the symbol can be held off
 * the number rather than set flush to it. */
const FIGURE_PARTS = /^(\D*)([\d.,]+)(\D*)$/;

function Figure({ value }: { value: string }) {
  const parts = FIGURE_PARTS.exec(value);
  if (!parts) return <>{value}</>;
  const [, prefix, digits, suffix] = parts;
  return (
    <>
      {prefix && <span style={{ marginRight: UNIT_GAP }}>{prefix}</span>}
      {digits}
      {suffix && <span style={{ marginLeft: UNIT_GAP }}>{suffix}</span>}
    </>
  );
}

function AnimatedStat({ value }: { value: string }) {
  const parsed = parseStatValue(value);
  const spring = useSpring(parsed.num, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
  });
  /* Digits only — the symbols are static spans beside the counter, so they
   * keep their gap while the number rolls. */
  const digits = useTransform(spring, (v) =>
    parsed.decimals === 0 ? `${Math.round(v)}` : v.toFixed(parsed.decimals),
  );

  useEffect(() => {
    if (!parsed.isText) spring.set(parsed.num);
  }, [spring, parsed.num, parsed.isText]);

  if (parsed.isText) return <span>{value}</span>;
  return (
    <>
      {parsed.prefix && (
        <span style={{ marginRight: UNIT_GAP }}>{parsed.prefix}</span>
      )}
      <motion.span>{digits}</motion.span>
      {parsed.suffix && (
        <span style={{ marginLeft: UNIT_GAP }}>{parsed.suffix}</span>
      )}
    </>
  );
}

function StatCell({
  label,
  value,
  suffix,
  small,
  icon,
}: {
  label: string;
  value: string;
  suffix?: string;
  small?: boolean;
  icon?: React.ComponentProps<typeof HugeiconsIcon>["icon"];
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className={cn("flex items-center gap-1.5", BRAND)}>
        {icon && (
          <HugeiconsIcon
            icon={icon}
            size={13}
            strokeWidth={1.5}
            color="currentColor"
          />
        )}
        <p className={TYPE_LABEL}>{label}</p>
      </div>
      <p
        className={cn(
          "tabular-nums",
          small ? cn(TYPE_COPY_14, "font-medium") : TYPE_HEADING_20,
          INK,
        )}
      >
        <AnimatedStat value={value} />
        {suffix && (
          <span className="text-amber-400" style={{ marginLeft: UNIT_GAP }}>
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}

function LeftPanelContent({
  slide,
  activeIndex,
  cta,
  secondaryCta,
}: {
  slide: Slide;
  activeIndex: number;
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}) {
  return (
    <>
      <CrossfadeText id={`dest-${activeIndex}`}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <h2 className={cn("text-balance", TYPE_HEADING_48, INK)}>
              {slide.name}
            </h2>
            <div className={cn("flex items-center gap-1.5", INK_MUTED)}>
              <HugeiconsIcon
                icon={Location01Icon}
                size={14}
                strokeWidth={1.5}
                color="currentColor"
              />
              <p className={TYPE_COPY_16}>
                {slide.country} · {slide.region}
              </p>
            </div>
          </div>
          <p
            className={cn("max-w-[52ch] text-pretty", TYPE_TAGLINE, INK_MUTED)}
          >
            &ldquo;{slide.tagline}&rdquo;
          </p>
        </div>
      </CrossfadeText>

      <div className="flex flex-col gap-6">
        <div>
          <p className={cn("mb-1", TYPE_LABEL, BRAND)}>Starting from</p>
          <CrossfadeText id={`price-${activeIndex}`}>
            <div className="flex items-baseline gap-3">
              <p
                className={cn("flex items-baseline gap-1.5 tabular-nums", INK)}
              >
                <span className={TYPE_HEADING_32}>
                  <Figure value={slide.price} />
                </span>
                <span className={cn(TYPE_LABEL, INK_LOW)}>/ night</span>
              </p>
              <p className={cn(TYPE_LABEL, INK_LOW)}>{slide.duration}</p>
            </div>
          </CrossfadeText>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <StatCell
            label="Trips done"
            value={slide.stats.trips}
            icon={Airplane01Icon}
          />
          <StatCell
            label="Rating"
            value={slide.stats.rating}
            suffix="★"
            icon={StarIcon}
          />
          <StatCell
            label="Travelers"
            value={slide.stats.travelers}
            icon={UserGroupIcon}
          />
          <StatCell
            label="Best season"
            value={slide.stats.season}
            small
            icon={Calendar01Icon}
          />
        </div>

        <CtaRow primary={cta} secondary={secondaryCta} />
      </div>
    </>
  );
}

function ArcDivider({
  scrollYProgress,
  scrollVelocity,
}: {
  scrollYProgress: MotionValue<number>;
  scrollVelocity: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 1000, h: 600 });

  useEffect(() => {
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    setDims({ w: width, h: height });
  }, []);

  const flipTarget = useMotionValue(0);
  const flip = useSpring(flipTarget, { stiffness: 160, damping: 22 });

  useMotionValueEvent(scrollVelocity, "change", (v) => {
    if (v > 0.005) flipTarget.set(0);
    else if (v < -0.005) flipTarget.set(180);
  });

  const INSET = 10;
  const arcPath = `M ${dims.w * 0.36} ${dims.h - INSET} C ${dims.w * 0.36} ${dims.h * 0.5}, ${dims.w * 0.44} ${dims.h * 0.12}, ${dims.w * 0.5} ${INSET}`;
  const offsetDistance = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0">
      <svg className="absolute inset-0 h-full w-full" overflow="visible">
        <path
          d={arcPath}
          fill="none"
          strokeWidth="1.5"
          strokeDasharray="2 7"
          strokeLinecap="round"
          className={STROKE_BRAND_TRACK}
        />
        <motion.path
          d={arcPath}
          fill="none"
          strokeWidth="1.5"
          strokeDasharray="2 7"
          strokeLinecap="round"
          className={STROKE_BRAND}
          style={{ pathLength: scrollYProgress }}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          offsetPath: `path('${arcPath}')`,
          offsetDistance: offsetDistance as unknown as string,
          offsetRotate: "auto 90deg",
        }}
      >
        <motion.svg
          style={{ rotate: flip }}
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={cn("-translate-x-1/2 -translate-y-1/2", BRAND)}
        >
          <path d="M21 16v-2l-8-5V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </motion.svg>
      </motion.div>
    </div>
  );
}

function ImageItem({
  src,
  index,
  total,
  scrollYProgress,
}: {
  src: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const offset = useTransform(
    scrollYProgress,
    [0, 1],
    [index, index - (total - 1)],
  );
  const scale = useTransform(
    offset,
    [-3, -2, -1, 0, 1, 2, 3],
    [0.2, 0.45, 0.68, 1, 0.68, 0.45, 0.2],
  );
  const y = useTransform(
    offset,
    [-3, -2, -1, 0, 1, 2, 3],
    ["-200%", "-120%", "-72%", "0%", "72%", "120%", "200%"],
  );
  const rotate = useTransform(offset, [-2, -1, 0, 1, 2], [-8, -4, 0, 4, 8]);

  return (
    <motion.div
      style={{ scale, y, rotate }}
      className="absolute inset-x-6 top-[10%] h-[80%] origin-center"
    >
      <div className="relative h-full w-full overflow-hidden rounded-sm">
        <Image src={src} alt="" fill className="object-cover" />
      </div>
    </motion.div>
  );
}

/* Nearest ancestor that actually scrolls. Falls back to documentElement,
 * which motion treats as "the window". Needed because this section is not
 * always on the page scroll — a gallery preview renders it inside its own
 * `overflow-y-auto` frame, and tracking the window there reads a constant 0. */
function findScrollParent(node: HTMLElement | null): HTMLElement {
  let el = node?.parentElement ?? null;
  while (el && el !== document.body) {
    const { overflowY } = getComputedStyle(el);
    if (/(auto|scroll|overlay)/.test(overflowY)) return el;
    el = el.parentElement;
  }
  return document.documentElement;
}

export interface FeatureGallery02Props {
  /* Section eyebrow, top-left of the panel. */
  eyebrow?: string;
  /* Primary action under the stats. Blue, notched, rolling label. */
  ctaLabel?: string;
  ctaHref?: string;
  /* Optional secondary action beside it. Pass `null` to render only one. */
  secondaryLabel?: string | null;
  secondaryHref?: string;
  className?: string;
}

export default function FeatureGallery02({
  eyebrow = "Destinations",
  ctaLabel = "Book this trip",
  ctaHref = "#",
  secondaryLabel = "View itinerary",
  secondaryHref = "#",
  className = "",
}: FeatureGallery02Props) {
  const container = useRef<HTMLElement>(null);
  const scroller = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  /* Hydrated before useScroll's own effect runs, so motion measures the
   * target against the frame that scrolls rather than against the window. */
  useLayoutEffect(() => {
    scroller.current = findScrollParent(container.current);
  }, []);

  const { scrollYProgress } = useScroll({
    target: container,
    container: scroller,
    offset: ["start start", "end end"],
  });

  const scrollVelocity = useVelocity(scrollYProgress);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setActiveIndex(Math.round(latest * (slides.length - 1)));
  });

  useEffect(() => {
    const wrapper = scroller.current;
    const onWindow = !wrapper || wrapper === document.documentElement;
    const lenis = onWindow
      ? new Lenis()
      : new Lenis({ wrapper, content: wrapper.firstElementChild ?? wrapper });
    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    /* Sized in container-query units so the section fills whatever frame it is
     * scrolled in — a preview card or the page — edge to edge, like the other
     * sections. With no `container-type` ancestor, cq units fall back to the
     * small viewport, so on a real page this is the same as 100vh. */
    <main
      ref={container}
      className={cn(FONT_SANS, INK, className)}
      style={{ height: `${slides.length * 100}cqh` }}
    >
      <div className="sticky top-0 h-[100cqh] w-full bg-[#F0EBE3]">
        <div className="relative flex size-full bg-white">
          <div className="flex w-[40%] flex-col gap-6 p-10">
            <div className="flex flex-shrink-0 items-center justify-between">
              <div className={cn("flex items-center gap-2", BRAND)}>
                <HugeiconsIcon
                  icon={Airplane01Icon}
                  size={14}
                  strokeWidth={1.5}
                  color="currentColor"
                />
                <p className={TYPE_NAV}>{eyebrow}</p>
              </div>
            </div>
            <div className="relative flex min-h-0 flex-1 flex-col justify-between">
              <LeftPanelContent
                slide={slides[activeIndex]}
                activeIndex={activeIndex}
                cta={{ label: ctaLabel, href: ctaHref }}
                secondaryCta={
                  secondaryLabel
                    ? { label: secondaryLabel, href: secondaryHref }
                    : undefined
                }
              />
            </div>
          </div>

          <ArcDivider
            scrollYProgress={scrollYProgress}
            scrollVelocity={scrollVelocity}
          />

          <div
            className="relative flex-1"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
            }}
          >
            {slides.map((slide, i) => (
              <ImageItem
                key={slide.name}
                src={slide.image}
                index={i}
                total={slides.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
