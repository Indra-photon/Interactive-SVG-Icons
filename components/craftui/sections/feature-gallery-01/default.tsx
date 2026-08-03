"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";

export interface GalleryImage {
  label: string;
  description?: string;
  src: string;
  tint: string;
}

export interface FeatureGallery01Props {
  eyebrow?: string;
  heading?: React.ReactNode;
  subheading?: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  images?: GalleryImage[];
  defaultOpenIndex?: number | null;
  countNoun?: string;
  className?: string;
}

const TIMING = {
  expandLabel: 180,
  collapseReset: 60,
};

const MOTION = {
  width: 300,
  label: 240,
};

const EASE = [0.165, 0.84, 0.44, 1] as const;

/**
 * `scroll: false` fills the container — items share the width proportionally
 * via flex-grow, so the strip always spans exactly 100%.
 * `scroll: true` uses fixed pixel widths and overflows horizontally, so every
 * image stays reachable on narrow screens instead of being sliced off.
 */
const BREAKPOINTS = [
  {
    min: 1280,
    collapsedWidth: 54,
    expandedWidth: 320,
    stripHeight: 300,
    gap: 9,
    count: 10,
    scroll: false,
  },
  {
    min: 768,
    collapsedWidth: 48,
    expandedWidth: 300,
    stripHeight: 280,
    gap: 8,
    count: 10,
    scroll: false,
  },
  {
    min: 640,
    collapsedWidth: 40,
    expandedWidth: 260,
    stripHeight: 260,
    gap: 7,
    count: 10,
    scroll: true,
  },
  {
    min: 0,
    collapsedWidth: 34,
    expandedWidth: 180,
    stripHeight: 220,
    gap: 5,
    count: 10,
    scroll: true,
  },
];

const SSR_PRESET = BREAKPOINTS[1];

const RADIUS = "var(--gallery-radius, 4px)";

const photo = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600&h=1200&fit=crop`;

const DEFAULT_IMAGES: GalleryImage[] = [
  {
    label: "Biophilic",
    description: "Living walls and raw timber in a north-facing loft.",
    src: photo(18108651),
    tint: "#6d7a5e",
  },
  {
    label: "Heritage",
    description: "A 1920s terrace restored down to its cornices.",
    src: photo(33803734),
    tint: "#a8757a",
  },
  {
    label: "Quiet Luxury",
    description: "Bouclé, limewash, and nothing that shouts.",
    src: photo(28853343),
    tint: "#b9b2ac",
  },
  {
    label: "Edison Glow",
    description: "Low light, dark walls, warm brass fittings.",
    src: photo(37930117),
    tint: "#17181a",
  },
  {
    label: "Sage Living",
    description: "Muted greens carried from kitchen to garden.",
    src: photo(31737841),
    tint: "#8a9683",
  },
  {
    label: "Velvet Accent",
    description: "One emerald sofa doing all the talking.",
    src: photo(12379606),
    tint: "#14653f",
  },
  {
    label: "Open Loft",
    description: "Two floors opened into a single bright volume.",
    src: photo(28456460),
    tint: "#e3e5e6",
  },
  {
    label: "Powder Room",
    description: "Deep oxblood lacquer in four square metres.",
    src: photo(37859439),
    tint: "#3b1f1c",
  },
  {
    label: "Marble & Brass",
    description: "Carrara counters against unlacquered brass.",
    src: photo(14613821),
    tint: "#cfd3d2",
  },
  {
    label: "Dining",
    description: "A ten-seat table built for long evenings.",
    src: photo(17947888),
    tint: "#6b2b33",
  },
];

const tx = (t: unknown) => t as Transition;

function usePreset() {
  const [state, setState] = useState({ preset: SSR_PRESET, settled: false });

  useEffect(() => {
    const read = () =>
      setState({
        preset:
          BREAKPOINTS.find((b) => window.innerWidth >= b.min) ?? SSR_PRESET,
        settled: true,
      });

    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  return state;
}

export default function FeatureGallery01({
  eyebrow = "What we do",
  heading = (
    <>
      Spaces <span className="font-semibold tracking-tight">designed</span>{" "}
      around how you live
    </>
  ),
  subheading = (
    <>
      We <span>design and build interiors</span> that are{" "}
      <span className="font-semibold text-foreground">tailored</span> to your
      lifestyle,{" "}
      <span className="font-semibold text-foreground">reflecting</span> your
      personality and{" "}
      <span className="font-semibold text-foreground">enhancing</span> your
      daily experiences.
    </>
  ),
  ctaLabel = "Book a consultation",
  ctaHref = "#",
  secondaryLabel = "View all projects",
  secondaryHref = "#",
  images = DEFAULT_IMAGES,
  defaultOpenIndex = 4,
  countNoun = "projects",
  className = "",
}: FeatureGallery01Props) {
  const reduceMotion = useReducedMotion();
  const { preset, settled } = usePreset();

  const { collapsedWidth, expandedWidth, stripHeight, gap, count, scroll } =
    preset;
  const visible = images.slice(0, count);

  const initialOpen =
    defaultOpenIndex === null || defaultOpenIndex >= images.length
      ? null
      : defaultOpenIndex;

  const [selected, setSelected] = useState<number | null>(initialOpen);
  const [geomSelected, setGeomSelected] = useState<number | null>(initialOpen);
  const [labelOn, setLabelOn] = useState(initialOpen !== null);

  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const interacted = useRef(false);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const [stripWidth, setStripWidth] = useState(0);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) =>
      setStripWidth(entry.contentRect.width),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    if (selected === null) {
      const t = setTimeout(() => setGeomSelected(null), TIMING.collapseReset);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => setLabelOn(true), TIMING.expandLabel);
    return () => clearTimeout(t);
  }, [selected, reduceMotion]);

  // Bring the opened panel into view once it has finished widening, so the
  // scroll lands on final geometry rather than mid-animation.
  useEffect(() => {
    if (!scroll || selected === null || !interacted.current) return;

    const t = setTimeout(
      () => {
        itemRefs.current[selected]?.scrollIntoView({
          inline: "nearest",
          block: "nearest",
          behavior: reduceMotion ? "auto" : "smooth",
        });
      },
      reduceMotion ? 0 : MOTION.width,
    );

    return () => clearTimeout(t);
  }, [selected, scroll, reduceMotion]);

  const select = (i: number) => {
    interacted.current = true;
    setSelected(i);
    setLabelOn(false);
    setGeomSelected(i);
  };

  const toggle = (i: number) => {
    if (selected === i) {
      interacted.current = true;
      setSelected(null);
      setLabelOn(false);
      return;
    }
    select(i);
  };

  const activeGeom = reduceMotion ? selected : geomSelected;
  const activeLabelOn = reduceMotion ? selected !== null : labelOn;

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = visible.length - 1;
    let next: number | null = null;

    if (e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;

    if (next !== null) {
      e.preventDefault();
      itemRefs.current[next]?.focus();
      select(next);
    }
  };

  const T = {
    width: tx({ duration: MOTION.width / 1000, ease: EASE }),
    label: tx({ duration: MOTION.label / 1000, ease: EASE }),
  };

  /**
   * `collapsedWidth` and `expandedWidth` are a *ratio* in fill mode, not pixels:
   * cards share the container via flex-grow, so an open card renders wider than
   * `expandedWidth`. The photo and caption are laid out in real pixels, so they
   * need that rendered width — otherwise the card's tint shows down both edges.
   */
  const openWidth =
    scroll || stripWidth === 0
      ? expandedWidth
      : Math.round(
          ((stripWidth - (visible.length - 1) * gap) *
            (expandedWidth / collapsedWidth)) /
            (expandedWidth / collapsedWidth + visible.length - 1),
        );

  return (
    <section
      className={`w-full bg-background px-4 py-16 sm:py-20 md:py-24 ${className}`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-1 text-start lg:grid-cols-12 lg:items-start lg:gap-12">
        <div className="lg:col-span-7">
          <p className="text-xs font-medium tracking-widest uppercase text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-[2.125rem] leading-[1.1] font-medium tracking-tighter text-balance text-foreground sm:text-5xl md:text-6xl">
            {heading}
          </h2>
        </div>

        <div className="lg:col-span-5">
          <p className="max-w-prose text-base text-pretty text-left text-muted-foreground sm:text-lg">
            {subheading}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={ctaHref}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[8px] bg-primary px-3 text-[16px] font-medium whitespace-nowrap text-white shadow-[0_2px_3px_rgba(0,0,0,0.30),0_3px_4px_rgba(0,0,0,0.15),inset_0_2px_2px_rgba(255,255,255,0.28),inset_0_-3px_0_rgba(0,0,0,0.20)] transition duration-150 hover:bg-primary/95 hover:shadow-[0_3px_5px_rgba(0,0,0,0.32),0_6px_10px_rgba(0,0,0,0.16),inset_0_2px_2px_rgba(255,255,255,0.34),inset_0_-3px_0_rgba(0,0,0,0.20)] active:translate-y-[2px] active:shadow-[0_1px_2px_rgba(0,0,0,0.25),inset_0_1px_3px_rgba(0,0,0,0.22),inset_0_-1px_0_rgba(0,0,0,0.10)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none sm:flex-none sm:px-6"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
                className="size-4 shrink-0"
              >
                <path
                  d="M3.5 3.5h9a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1ZM2.5 7h11M5.5 1.75v3M10.5 1.75v3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {ctaLabel}
            </a>
            <a
              href={secondaryHref}
              className="group inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[8px] border border-border bg-background px-3 text-[16px] font-medium whitespace-nowrap text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.16),0_2px_4px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.30),inset_0_-2px_0_rgba(0,0,0,0.10)] transition duration-150 hover:border-foreground/20 hover:bg-accent hover:shadow-[0_2px_4px_rgba(0,0,0,0.18),0_4px_8px_rgba(0,0,0,0.10),inset_0_1px_1px_rgba(255,255,255,0.36),inset_0_-2px_0_rgba(0,0,0,0.10)] active:translate-y-[2px] active:shadow-[0_1px_1px_rgba(0,0,0,0.14),inset_0_1px_2px_rgba(0,0,0,0.14),inset_0_-1px_0_rgba(0,0,0,0.06)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none sm:flex-none sm:px-6"
            >
              {secondaryLabel}
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div ref={stripRef} className="mx-auto mt-12 w-full max-w-6xl sm:mt-16">
        <div
          className={
            scroll
              ? "-mx-4 overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : ""
          }
        >
          <div
            className={`flex items-center ${scroll ? "w-max" : "w-full"}`}
            style={{ gap, height: stripHeight }}
          >
            {visible.map((item, i) => {
              const isWide = activeGeom === i;
              const isLabelled = selected === i && activeLabelOn;

              return (
                <motion.button
                  key={item.label + i}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  type="button"
                  aria-expanded={isWide}
                  aria-label={
                    item.description
                      ? `${item.label}. ${item.description}`
                      : item.label
                  }
                  onClick={() => toggle(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className="relative min-w-0 cursor-pointer overflow-hidden select-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
                  style={{
                    borderRadius: RADIUS,
                    backgroundColor: item.tint,
                    height: stripHeight,
                    flexShrink: 0,
                  }}
                  initial={false}
                  animate={{
                    flexGrow: scroll
                      ? 0
                      : isWide
                        ? expandedWidth / collapsedWidth
                        : 1,
                    // px units are explicit: Motion only auto-appends them for
                    // known length properties, and flexBasis is not one.
                    flexBasis: scroll
                      ? `${isWide ? expandedWidth : collapsedWidth}px`
                      : "0px",
                  }}
                  transition={
                    settled
                      ? { flexGrow: T.width, flexBasis: T.width }
                      : { duration: 0 }
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt=""
                    aria-hidden
                    draggable={false}
                    className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
                    style={{ width: openWidth, height: stripHeight }}
                  />

                  <motion.div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5"
                    style={{
                      backgroundImage:
                        "linear-gradient(to top, var(--gallery-scrim, oklch(0 0 0 / 0.88)) 0%, color-mix(in oklab, var(--gallery-scrim, oklch(0 0 0 / 0.88)) 62%, transparent) 34%, color-mix(in oklab, var(--gallery-scrim, oklch(0 0 0 / 0.88)) 22%, transparent) 64%, transparent 100%)",
                    }}
                    initial={false}
                    animate={{ opacity: isLabelled ? 1 : 0 }}
                    transition={T.label}
                  />
                  <motion.div
                    className="pointer-events-none absolute bottom-3 start-4 text-start"
                    style={{ width: openWidth - 32 }}
                    initial={false}
                    animate={{
                      opacity: isLabelled ? 1 : 0,
                      y: isLabelled ? 0 : 10,
                    }}
                    transition={T.label}
                  >
                    <p
                      className="text-lg font-semibold tracking-tight whitespace-nowrap sm:text-xl"
                      style={{ color: "var(--gallery-label, oklch(1 0 0))" }}
                    >
                      {item.label}
                    </p>
                    {item.description && (
                      <p
                        className="line-clamp-2 text-xs leading-snug text-pretty sm:text-sm"
                        style={{
                          color:
                            "var(--gallery-label-muted, oklch(1 0 0 / 0.74))",
                        }}
                      >
                        {item.description}
                      </p>
                    )}
                  </motion.div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {settled && images.length > visible.length && (
          <p className="mt-4 text-sm tabular-nums text-muted-foreground">
            Showing {visible.length} of {images.length} {countNoun}
          </p>
        )}
      </div>
    </section>
  );
}
