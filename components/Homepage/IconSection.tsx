"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  // animate,
  // useMotionValue,
  // useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";

// Icons
import { TrashIcon } from "@/components/craftui/icons/trash/default";
import { IconHome } from "@/components/craftui/icons/home/default";
import { IconRefresh } from "@/components/craftui/icons/refresh/default";
import { IconMail } from "@/components/craftui/icons/mail/default";
import { IconAlarmRing } from "@/components/craftui/icons/alarm-clock/default";
import { IconBulb } from "@/components/craftui/icons/bulb/default";
import { IconLayoutDashboard } from "@/components/craftui/icons/layout/default";
import { IconShoppingCart } from "@/components/craftui/icons/shopping-cart/default";
import { IconDownload } from "@/components/craftui/icons/download/default";
import { IconExternalLinkDefault } from "@/components/craftui/icons/external-link/default";
import { IconLockShowPassword } from "@/components/craftui/icons/lock-glass/default";
import { IconTabOpenDefault } from "@/components/craftui/icons/tab-open/default";

// ─── Data ─────────────────────────────────────────────────────────────────────

const ICON_PREVIEWS = [
  { name: "Trash", Component: TrashIcon, animProp: "isAnimating" },
  { name: "Home", Component: IconHome, animProp: "isSelected" },
  { name: "Refresh", Component: IconRefresh, animProp: "isAnimating" },
  { name: "Mail", Component: IconMail, animProp: "isOpen" },
  { name: "Alarm", Component: IconAlarmRing, animProp: "isHovered" },
  { name: "Bulb", Component: IconBulb, animProp: "isActive" },
  { name: "Dashboard", Component: IconLayoutDashboard, animProp: "isHovered" },
  { name: "Cart", Component: IconShoppingCart, animProp: "isAdding" },
  { name: "Download", Component: IconDownload, animProp: "isAnimating" },
  { name: "Link", Component: IconExternalLinkDefault, animProp: "isHovered" },
  { name: "Lock", Component: IconLockShowPassword, animProp: "isUnlocked" },
  { name: "Tab", Component: IconTabOpenDefault, animProp: "isHovered" },
];

const ICON_FEATURES = [
  {
    title: "Hover to Animate",
    description:
      "Every icon wakes on hover — physics-based springs fire the moment your cursor lands, not a CSS timeout.",
  },
  {
    title: "Copy & Paste Ready",
    description:
      "One click copies the full component. Drop it in and pass one boolean prop to drive the entire animation.",
  },
  {
    title: "Color & Size via Props",
    description:
      "Pass any hex or CSS variable for color. Width, height, and stroke adapt to any icon size your design calls for.",
  },
  {
    title: "Pure SVG, Zero Deps",
    description:
      "Raw SVG paths animated with Framer Motion springs. No icon fonts, no sprite sheets, no runtime overhead.",
  },
];

// SVG path from viewBox 0 0 1048 594 — starts left, loops back through center, exits bottom-right.
// Horizontally mirrored path (x = 1048 - x_original): starts top-right,
// loops on the right side, exits bottom-left.
const SVG_PATH =
  "M1047.402 50.924805C1030.539 143.2965 950.148 293.141 763.492 353.548C607.172 399.056 464.161 294.067 547.382 184.7492C630.603 75.4309 809.783 282.098 548.742 441.668C496.087 477.802 230.532 561.26 1.57 565.235";

// ─── Path icon card ───────────────────────────────────────────────────────────

function PathIconCard({
  name,
  Component,
  animProp,
  pos,
  index,
  isVisible,
}: {
  name: string;
  Component: (typeof ICON_PREVIEWS)[number]["Component"];
  animProp: string;
  pos: { x: number; y: number };
  index: number;
  isVisible: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const n = ICON_PREVIEWS.length;

  return (
    <div
      style={{
        position: "absolute",
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: hovered ? 10 : 1,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={
          isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
        }
        transition={
          isVisible
            ? {
                type: "spring",
                stiffness: 380,
                damping: 22,
                delay: index * 0.07,
              }
            : { duration: 0.15, delay: (n - 1 - index) * 0.03 }
        }
        whileHover={{ scale: 1.18 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link
          href={`/icons/${name.toLowerCase()}`}
          className="w-14 h-14 flex flex-col items-center justify-center gap-1 bg-white rounded-xl shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_2px_-1px_rgba(0,0,0,0.06),0px_2px_4px_0px_rgba(0,0,0,0.04)] hover:shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_1px_2px_-1px_rgba(0,0,0,0.08),0px_2px_4px_0px_rgba(0,0,0,0.06)] transition-[box-shadow] duration-150 block"
        >
          <Component
            size={20}
            color="var(--primary)"
            {...{ [animProp]: hovered }}
          />
          <span className="text-[8px] text-neutral-400 tracking-wide leading-none">
            {name}
          </span>
        </Link>
      </motion.div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function IconSection() {
  const iconSectionRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLDivElement>(null);
  // const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  // const activeFeatureRef = useRef<number>(-999);
  const svgPathRef = useRef<SVGPathElement>(null);

  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  const [iconPositions, setIconPositions] = useState<
    { x: number; y: number }[]
  >([]);

  // const squareY = useMotionValue(0);
  // const squareScale = useMotionValue(1);
  // const squareOpacity = useMotionValue(0);

  // Distribute 8 icons evenly along the SVG path using arc-length parameterization.
  useEffect(() => {
    const path = svgPathRef.current;
    if (!path) return;
    const totalLength = path.getTotalLength();
    const n = ICON_PREVIEWS.length;
    setIconPositions(
      Array.from({ length: n }, (_, i) => {
        const pt = path.getPointAtLength(((i + 0.5) / n) * totalLength);
        return { x: (pt.x / 1048) * 100, y: (pt.y / 594) * 100 };
      }),
    );
  }, []);

  const { scrollYProgress: iconProgress } = useScroll({
    target: iconSectionRef,
    offset: ["start 65%", "end 30%"],
  });

  // useMotionValueEvent(iconProgress, "change", (p) => {
  //   const HALF = 10;
  //   const n = ICON_FEATURES.length;
  //   const para = paragraphRef.current;
  //
  //   if (p < 0.04) {
  //     if (activeFeatureRef.current !== -1) {
  //       activeFeatureRef.current = -1;
  //       if (para) squareY.set(para.offsetTop + para.offsetHeight / 2 - HALF);
  //       squareOpacity.set(0);
  //       squareScale.set(1);
  //     }
  //     return;
  //   }
  //
  //   if (p >= 0.91) {
  //     if (activeFeatureRef.current !== n) {
  //       activeFeatureRef.current = n;
  //       animate(squareScale, 0, { type: "spring", stiffness: 400, damping: 30 });
  //       animate(squareOpacity, 0, { duration: 0.2 });
  //     }
  //     return;
  //   }
  //
  //   const normalized = (p - 0.04) / 0.87;
  //   const newIndex = Math.min(Math.floor(normalized * n), n - 1);
  //
  //   if (newIndex === activeFeatureRef.current) return;
  //   activeFeatureRef.current = newIndex;
  //
  //   if (newIndex === 0) {
  //     animate(squareOpacity, 1, { duration: 0.25 });
  //     animate(squareScale, 1, { duration: 0.15 });
  //   }
  //
  //   const el = featureRefs.current[newIndex];
  //   if (!el) return;
  //
  //   const targetY = el.offsetTop + el.offsetHeight / 2 - HALF;
  //   animate(squareY, targetY, { type: "spring", stiffness: 280, damping: 22, mass: 0.9 });
  // });

  return (
    <div
      ref={iconSectionRef}
      className="relative w-full min-h-dvh py-24 flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsGalleryHovered(true)}
      onMouseLeave={() => setIsGalleryHovered(false)}
    >
      {/* ── Full-section SVG path + animated marquee text ── */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
        viewBox="0 0 1048 594"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          ref={svgPathRef}
          id="icon-section-curve"
          d={SVG_PATH}
          stroke="var(--primary)"
          strokeWidth="1"
          strokeDasharray="3 12"
          strokeLinecap="round"
        />
        {/* "Hover here" marquee — animates along the full path */}
        <text
          fill="var(--primary)"
          fontSize="10"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          letterSpacing="4"
        >
          <textPath href="#icon-section-curve" startOffset="0%">
            HOVER HERE · HOVER HERE · HOVER HERE · HOVER HERE · HOVER HERE ·
            HOVER HERE ·
            <animate
              attributeName="startOffset"
              from="0%"
              to="100%"
              dur="12s"
              repeatCount="indefinite"
            />
          </textPath>
        </text>
      </svg>

      {/* ── Content grid ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start w-full">
        {/* Left: header + features + CTA */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
          className="relative flex flex-col gap-8 lg:sticky lg:top-24 pl-7"
        >
          {/* Spring-driven square indicator */}
          {/* <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 size-5 bg-primary hidden lg:block"
            style={{ y: squareY, scale: squareScale, opacity: squareOpacity }}
          /> */}

          {/* Heading + paragraph — square originates here */}
          <div ref={paragraphRef} className="flex flex-col gap-3">
            <Heading as="h2" className="flex items-center gap-3">
              <IconBulb size={64} color="var(--primary)" isActive />
              Icons
            </Heading>
            <Paragraph className="text-primary max-w-xl">
              Icons that animates on interaction.
            </Paragraph>
          </div>

          {/* Feature list */}
          {/* <div className="flex flex-col divide-y divide-neutral-100 ml-3 py-10">
            {ICON_FEATURES.map(({ title, description }, i) => (
              <div
                key={title}
                ref={(el) => {
                  featureRefs.current[i] = el;
                }}
                className="py-5 first:pt-0"
              >
                <Paragraph
                  variant="body"
                  className="font-medium text-foreground/70 max-w-2xl"
                >
                  {description}
                </Paragraph>
              </div>
            ))}
          </div> */}

          <Button
            asChild
            size="lg"
            variant="secondary"
            className="corner-squircle rounded-[10px] w-4/5 font-mono tracking-tighter self-start"
          >
            <Link href="/icons">
              Browse Icons
              <IconArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </motion.div>

        {/* Right: spacer — icons live on the full-section absolute layer */}
        <div className="hidden lg:block min-h-[520px]" />
      </div>

      {/* ── Icons distributed along the full-section path ── */}
      {iconPositions.map((pos, i) => (
        <PathIconCard
          key={ICON_PREVIEWS[i].name}
          {...ICON_PREVIEWS[i]}
          pos={pos}
          index={i}
          isVisible={isGalleryHovered}
        />
      ))}
    </div>
  );
}
