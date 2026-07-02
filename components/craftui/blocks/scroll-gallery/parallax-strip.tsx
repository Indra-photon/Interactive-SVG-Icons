"use client";

import React, { useEffect, useRef, useState } from "react";
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
} from "@hugeicons/core-free-icons";

const slides = [
  {
    name: "Santorini",
    country: "Greece",
    region: "Cyclades Islands",
    tagline: "Where white walls meet infinite blue horizons",
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
    tagline: "Ancient temples hidden in bamboo silence",
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
    tagline: "Overwater villas above crystal-clear lagoons",
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
    tagline: "Raw wilderness at the edge of the world",
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
    tagline: "Cliffside villages draped over turquoise waters",
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

const SLIDE_SPRING = { type: "spring", stiffness: 280, damping: 28 } as const;

function SlideText({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string | number;
}) {
  return (
    <div className="overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={id}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={SLIDE_SPRING}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function parseStatValue(value: string) {
  if (/^\d+\+$/.test(value))
    return { num: parseInt(value), suffix: "+", decimals: 0, isText: false };
  if (/^\d+(\.\d+)?k$/.test(value))
    return { num: parseFloat(value), suffix: "k", decimals: 1, isText: false };
  if (/^\d+\.\d+$/.test(value))
    return { num: parseFloat(value), suffix: "", decimals: 1, isText: false };
  return { num: 0, suffix: "", decimals: 0, isText: true };
}

function AnimatedStat({ value }: { value: string }) {
  const parsed = parseStatValue(value);
  const spring = useSpring(parsed.num, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
  });
  const display = useTransform(spring, (v) =>
    parsed.isText
      ? value
      : parsed.decimals === 0
        ? `${Math.round(v)}${parsed.suffix}`
        : `${v.toFixed(parsed.decimals)}${parsed.suffix}`,
  );

  useEffect(() => {
    if (!parsed.isText) spring.set(parsed.num);
  }, [spring, parsed.num, parsed.isText]);

  if (parsed.isText) return <span>{value}</span>;
  return <motion.span>{display}</motion.span>;
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
      <div className="flex items-center gap-1 text-stone-500">
        {icon && (
          <HugeiconsIcon
            icon={icon}
            size={13}
            strokeWidth={1.5}
            color="currentColor"
          />
        )}
        <p className="text-[13px] tracking-widest uppercase">{label}</p>
      </div>
      <p
        className={`font-medium text-stone-700 ${small ? "text-sm" : "text-xl"}`}
      >
        <AnimatedStat value={value} />
        {suffix && <span className="ml-0.5 text-amber-400">{suffix}</span>}
      </p>
    </div>
  );
}

function LeftPanelContent({
  slide,
  activeIndex,
}: {
  slide: Slide;
  activeIndex: number;
}) {
  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <SlideText id={`name-${activeIndex}`}>
            <h2 className="text-5xl leading-none font-semibold tracking-tight text-stone-900">
              {slide.name}
            </h2>
          </SlideText>
          <SlideText id={`loc-${activeIndex}`}>
            <div className="mt-1 flex items-center gap-1.5 text-stone-700">
              <HugeiconsIcon
                icon={Location01Icon}
                size={15}
                strokeWidth={1.5}
                color="currentColor"
              />
              <p className="text-[15px]">
                {slide.country} · {slide.region}
              </p>
            </div>
          </SlideText>
        </div>
        <SlideText id={`tag-${activeIndex}`}>
          <p className="text-sm leading-relaxed text-stone-500 italic">
            "{slide.tagline}"
          </p>
        </SlideText>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-end gap-3">
          <div>
            <p className="mb-0.5 text-[13px] tracking-widest text-stone-700 uppercase">
              Starting from
            </p>
            <div className="flex items-baseline text-3xl font-semibold text-stone-900">
              <SlideText id={`price-${activeIndex}`}>
                <span>{slide.price}</span>
              </SlideText>
              <span className="ml-1 text-sm font-normal text-stone-500">
                / night
              </span>
            </div>
          </div>
          <SlideText id={`dur-${activeIndex}`}>
            <p className="pb-1 text-xs text-stone-500">{slide.duration}</p>
          </SlideText>
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
          stroke="#E2DDD7"
          strokeWidth="1.5"
          strokeDasharray="2 7"
          strokeLinecap="round"
        />
        <motion.path
          d={arcPath}
          fill="none"
          stroke="#A09890"
          strokeWidth="1.5"
          strokeDasharray="2 7"
          strokeLinecap="round"
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
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="-translate-x-1/2 -translate-y-1/2 text-stone-500"
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

export default function ScrollGallery() {
  const container = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scrollVelocity = useVelocity(scrollYProgress);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setActiveIndex(Math.round(latest * (slides.length - 1)));
  });

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  return (
    <main ref={container} style={{ height: `${slides.length * 100}vh` }}>
      <div className="sticky top-0 flex items-start justify-center bg-[#F0EBE3] pt-8">
        <div className="relative flex h-[78vh] w-[88vw] rounded-[4px] border border-stone-200 bg-white">
          <div className="flex w-[40%] flex-col gap-6 p-10">
            <div className="flex flex-shrink-0 items-center justify-between">
              <div className="flex items-center gap-1.5 text-stone-700">
                <HugeiconsIcon
                  icon={Airplane01Icon}
                  size={15}
                  strokeWidth={1.5}
                  color="currentColor"
                />
                <p className="text-[15px] tracking-[0.25em] uppercase">
                  Destinations
                </p>
              </div>
            </div>
            <div className="relative min-h-0 flex-1 flex flex-col justify-between">
              <LeftPanelContent
                slide={slides[activeIndex]}
                activeIndex={activeIndex}
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
