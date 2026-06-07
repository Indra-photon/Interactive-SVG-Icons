"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/ui/button";
import {
  IconBolt,
  IconClipboard,
  IconAdjustments,
  IconSparkles,
  IconArrowRight,
  IconBrandGithub,
} from "@tabler/icons-react";

// Loaders
import { BarsBounce } from "@/components/craftui/loaders/bars-bounce/default";
import { AudioBarsGlow } from "@/components/craftui/loaders/audio-bars-glow/default";
import { BarsWave } from "@/components/craftui/loaders/bars-wave/default";
import { DotsRotate } from "@/components/craftui/loaders/dots-rotate/default";
import { BarsCascade } from "@/components/craftui/loaders/bars-cascade/default";
import { DotsCompress } from "@/components/craftui/loaders/dots-compress/default";
import { PulseRing } from "@/components/craftui/loaders/pulse-ring/default";
import { InfinityLoop } from "@/components/craftui/loaders/infinity-loop/default";
import { HeartFill } from "@/components/craftui/loaders/heart-fill/default";
import { ConicSpinner } from "@/components/craftui/loaders/conic-spinner/default";
import { DotsBounce } from "@/components/craftui/loaders/dots-bounce/default";
import { HexagonRotate } from "@/components/craftui/loaders/hexagon-rotate/default";

// Icons
import { TrashIcon } from "@/components/craftui/icons/trash/default";
import { IconHome } from "@/components/craftui/icons/home/default";
import { IconRefresh } from "@/components/craftui/icons/refresh/default";
import { IconMail } from "@/components/craftui/icons/mail/default";
import { IconAlarmRing } from "@/components/craftui/icons/alarm-clock/default";
import { IconBulb } from "@/components/craftui/icons/bulb/default";
import { IconLayoutDashboard } from "@/components/craftui/icons/layout/default";
import { IconShoppingCart } from "@/components/craftui/icons/shopping-cart/default";

// ─── Data ─────────────────────────────────────────────────────────────────────

const LOADER_PREVIEWS = [
  { name: "Bars Bounce", component: BarsBounce },
  { name: "Audio Bars", component: AudioBarsGlow },
  { name: "Bars Wave", component: BarsWave },
  { name: "Dots Rotate", component: DotsRotate },
  { name: "Bars Cascade", component: BarsCascade },
  { name: "Dots Compress", component: DotsCompress },
  { name: "Pulse Ring", component: PulseRing },
  { name: "Infinity Loop", component: InfinityLoop },
  { name: "Heart Fill", component: HeartFill },
  { name: "Conic Spinner", component: ConicSpinner },
  { name: "Dots Bounce", component: DotsBounce },
  { name: "Hexagon Rotate", component: HexagonRotate },
];

const ICON_PREVIEWS = [
  { name: "Trash", Component: TrashIcon, animProp: "isAnimating" },
  { name: "Home", Component: IconHome, animProp: "isSelected" },
  { name: "Refresh", Component: IconRefresh, animProp: "isAnimating" },
  { name: "Mail", Component: IconMail, animProp: "isOpen" },
  { name: "Alarm", Component: IconAlarmRing, animProp: "isHovered" },
  { name: "Bulb", Component: IconBulb, animProp: "isActive" },
  { name: "Dashboard", Component: IconLayoutDashboard, animProp: "isHovered" },
  { name: "Cart", Component: IconShoppingCart, animProp: "isAdding" },
];

const FEATURES = [
  {
    icon: <IconBolt size={18} />,
    title: "Motion Powered",
    description:
      "Built with Framer Motion for smooth, physics-based animations that feel native and polished.",
  },
  {
    icon: <IconClipboard size={18} />,
    title: "Copy & Paste Ready",
    description:
      "Zero config. Copy the component source and drop it into your project — it works immediately.",
  },
  {
    icon: <IconAdjustments size={18} />,
    title: "Fully Customizable",
    description:
      "Every prop is adjustable: color, size, speed, thickness. Adapts to any design system.",
  },
  {
    icon: <IconSparkles size={18} />,
    title: "Free & Open",
    description:
      "Every component in the library is free. No paywalls, no sign-ups, no surprises.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Browse the library",
    description:
      "Explore 35+ loaders and 50+ icon variants. Filter by category or animation type.",
  },
  {
    step: "02",
    title: "Copy the component",
    description:
      "One click copies the full component source — props, animation config, and all.",
  },
  {
    step: "03",
    title: "Paste into your project",
    description:
      "Drop it in. It picks up your text color via currentColor, or pass any hex you want.",
  },
];

const STATS = [
  { value: "35+", label: "Loaders" },
  { value: "50+", label: "Icon Variants" },
  { value: "100%", label: "Free to use" },
  { value: "0", label: "Config needed" },
];

// ─── Pattern primitives ───────────────────────────────────────────────────────

const HATCH =
  "bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed";

/** Diamond marker rendered at the intersection of a line-row and a gutter-col */
function CornerDiamond({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const translate = {
    tl: "-translate-y-1/2  translate-x-1/2  right-0 top-0",
    tr: "-translate-y-1/2 -translate-x-1/2  left-0  top-0",
    bl: "translate-y-1/2  translate-x-1/2  right-0 bottom-0",
    br: "translate-y-1/2 -translate-x-1/2  left-0  bottom-0",
  }[position];

  return (
    <div className="absolute size-2.5 rotate-45 border border-(--pattern-fg) bg-white dark:bg-gray-950" />
  );
}

/**
 * Hero section — 5-column centred layout (matches the shared pattern exactly).
 * Content is vertically + horizontally centred inside the grid.
 */
function HeroPattern({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative max-w-5xl mx-auto grid min-h-[calc(100vh-4rem)] grid-cols-[2.5rem_1fr_2.5rem] grid-rows-[1fr_1px_auto_1px_1fr] bg-white [--pattern-fg:var(--color-gray-950)]/10 dark:bg-gray-950 dark:[--pattern-fg:var(--color-white)]/10">
      {/* ── Content ── */}
      <div className="col-start-2 row-start-3 flex flex-col items-center justify-center gap-6 py-20 px-6 text-center">
        {children}
      </div>

      {/* ── Left gutter ── */}
      <div
        className={`relative col-start-1 row-span-full row-start-1 border-r border-(--pattern-fg) ${HATCH}`}
      />

      {/* ── Right gutter (match left exactly) ── */}
      <div
        className={`relative col-start-3 row-span-full row-start-1 border-l border-(--pattern-fg) ${HATCH}`}
      />

      {/* ── Horizontal dividers ── */}
      {/* <div className="col-span-full row-start-2 h-px bg-(--pattern-fg)" />
      <div className="col-span-full row-start-4 h-px bg-(--pattern-fg)" /> */}

      {/* ── Diamonds ── */}

      {/* Top-left */}
      {/* <div className="col-start-1 row-start-2 relative">
        <div className="absolute size-2.5 rotate-45 -translate-y-1/2 translate-x-1/2 right-0 bottom-0 border border-(--pattern-fg) bg-white dark:bg-gray-950" />
      </div> */}

      {/* Top-right (FIX: use right-0 like left) */}
      {/* <div className="col-start-3 row-start-2 relative">
        <div className="absolute size-2.5 rotate-45 -translate-y-1/2 -translate-x-1/2 right-0 bottom-0 border border-(--pattern-fg) bg-white dark:bg-gray-950" />
      </div> */}

      {/* Bottom-left */}
      {/* <div className="col-start-1 row-start-4 relative">
        <div className="absolute size-2.5 rotate-45 translate-y-1/2 translate-x-1/2 right-0 top-0 border border-(--pattern-fg) bg-white dark:bg-gray-950" />
      </div> */}

      {/* Bottom-right (FIX: use right-0 like left) */}
      {/* <div className="col-start-3 row-start-4 relative">
        <div className="absolute size-2.5 rotate-45 translate-y-1/2 -translate-x-1/2 right-0 top-0 border border-(--pattern-fg) bg-white dark:bg-gray-950" />
      </div> */}
    </div>
  );
}

/**
 * Generic section — 3-column layout with hatched gutters on each side.
 * Every section is fully separated by the decorative top + bottom rules.
 */
function PatternSection({
  children,
  contentClassName = "",
}: {
  children: React.ReactNode;
  contentClassName?: string;
}) {
  return (
    <div className="relative max-w-5xl mx-auto grid grid-cols-[2.5rem_1fr_2.5rem] grid-rows-[1px_auto_1px] bg-white [--pattern-fg:var(--color-gray-950)]/10 dark:bg-gray-950 dark:[--pattern-fg:var(--color-white)]/10">
      {/* ── Content ── */}
      <div className={`col-start-2 row-start-2 ${contentClassName}`}>
        {children}
      </div>

      {/* ── Left hatch gutter ── */}
      <div
        className={`col-start-1 row-span-full row-start-1 border-r border-r-(--pattern-fg) ${HATCH}`}
      />

      {/* ── Right hatch gutter ── */}
      <div
        className={`col-start-3 row-span-full row-start-1 border-l border-l-(--pattern-fg) ${HATCH}`}
      />

      {/* ── Horizontal rules ── */}
      <div className="col-span-full col-start-1 row-start-1 h-px bg-(--pattern-fg)" />
      <div className="col-span-full col-start-1 row-start-3 h-px bg-(--pattern-fg)" />

      {/* ── Corner diamonds: top-left, top-right, bottom-left, bottom-right ── */}
      <div className="col-start-1 row-start-1 relative z-20">
        <div className="absolute size-2.5 rotate-45 -translate-y-1/2 translate-x-1/2  right-0 top-0 border border-(--pattern-fg) bg-[#fd551d] dark:bg-gray-950" />
      </div>
      <div className="col-start-3 row-start-1 relative z-20">
        <div className="absolute size-2.5 rotate-45 -translate-y-1/2 -translate-x-1/2 left-0  top-0 border border-(--pattern-fg) bg-white dark:bg-gray-950" />
      </div>
      <div className="col-start-1 row-start-3 relative z-20">
        <div className="absolute size-2.5 rotate-45  translate-y-1/2  translate-x-1/2  right-0 bottom-0 border border-(--pattern-fg) bg-white dark:bg-gray-950" />
      </div>
      <div className="col-start-3 row-start-3 relative z-20">
        <div className="absolute size-2.5 rotate-45  translate-y-1/2 -translate-x-1/2  left-0  bottom-0 border border-(--pattern-fg) bg-white dark:bg-gray-950" />
      </div>
    </div>
  );
}

// ─── Gallery cards ────────────────────────────────────────────────────────────

function LoaderCard({
  name,
  component: Loader,
}: (typeof LOADER_PREVIEWS)[number]) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
    >
      <Link
        href={`/loaders/${name.toLowerCase().replace(/\s+/g, "-")}`}
        className="border rounded-lg hover:shadow-lg transition-shadow group w-full h-40 flex flex-col items-center justify-center gap-3 bg-white relative overflow-hidden block"
      >
        <Loader width={44} height={44} isAnimating />
        <span className="text-xs text-neutral-500">{name}</span>
        <motion.div
          initial={{ y: "100%" }}
          whileHover={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="absolute bottom-0 left-0 right-0 bg-black/80 text-white py-2 px-3 text-center text-xs font-medium backdrop-blur-sm"
        >
          See in action{" "}
          <IconArrowRight className="inline-block mb-0.5" size={12} />
        </motion.div>
      </Link>
    </motion.div>
  );
}

function IconCard({
  name,
  Component,
  animProp,
}: (typeof ICON_PREVIEWS)[number]) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/icons/${name.toLowerCase()}`}
        className="border rounded-lg hover:shadow-lg transition-shadow group w-full h-40 flex flex-col items-center justify-center gap-3 bg-white relative overflow-hidden block"
      >
        <Component
          size={32}
          color="currentColor"
          {...{ [animProp]: hovered }}
        />
        <span className="text-xs text-neutral-500">{name}</span>
        <motion.div
          initial={{ y: "100%" }}
          whileHover={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="absolute bottom-0 left-0 right-0 bg-black/80 text-white py-2 px-3 text-center text-xs font-medium backdrop-blur-sm"
        >
          See in action{" "}
          <IconArrowRight className="inline-block mb-0.5" size={12} />
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="bg-white text-foreground">
      {/* ════════════════════════════════════════════════════════════════════
          HERO  —  5-column centred pattern
      ════════════════════════════════════════════════════════════════════ */}
      <HeroPattern>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6"
        >
          <Badge text="35+ Animated SVG Components" href="/loaders" />

          <Heading className="text-foreground text-4xl sm:text-5xl md:text-6xl leading-[1.15]">
            <span className=" block">Beautiful animated SVG</span>
            <span className=" font-normal italic block">for your apps</span>
          </Heading>

          <Paragraph className="max-w-xl font-sans tracking-tighter text-neutral-700 text-base md:text-lg">
            A growing library of free, copy-paste SVG loaders and animated
            icons. Built with Framer Motion. Works with any React project.
          </Paragraph>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Button asChild size="lg" variant="outline" className="px-6">
              <Link href="/loaders">
                Browse Loaders <IconArrowRight size={15} className="ml-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="">
              <Link href="/icons">Browse Icons</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="rounded-full px-5 text-neutral-500"
            >
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandGithub size={17} className="mr-1.5" /> GitHub
              </a>
            </Button>
          </div>

          {/* Live loader strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-4 flex items-center gap-3 overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            {LOADER_PREVIEWS.slice(0, 8).map(({ name, component: Loader }) => (
              <div
                key={name}
                className="flex-shrink-0 flex items-center justify-center border rounded-lg bg-white w-14 h-14"
              >
                <Loader width={28} height={28} isAnimating />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </HeroPattern>

      {/* ════════════════════════════════════════════════════════════════════
          STATS
      ════════════════════════════════════════════════════════════════════ */}
      <PatternSection contentClassName="bg-neutral-100">
        <div className="mx-auto max-w-5xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-3xl font-bold text-foreground">
                {value}
              </span>
              <span className="text-sm text-neutral-500">{label}</span>
            </div>
          ))}
        </div>
      </PatternSection>

      {/* ════════════════════════════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════════════════════════════ */}
      <PatternSection>
        <div className="mx-auto max-w-5xl px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <Heading as="h2" className="text-foreground text-3xl md:text-4xl">
              Everything you need
            </Heading>
            <Paragraph className="mt-3 text-neutral-500 max-w-lg mx-auto">
              Designed for developers who care about the small details.
            </Paragraph>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(({ icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 hover:shadow-md transition-shadow"
              >
                <div className="mb-3 inline-flex items-center justify-center rounded-md border border-neutral-200 bg-white p-2 text-foreground">
                  {icon}
                </div>
                <h3 className="mb-1.5 text-sm font-semibold text-foreground">
                  {title}
                </h3>
                <Paragraph
                  variant="muted"
                  className="text-neutral-500 text-sm leading-relaxed"
                >
                  {description}
                </Paragraph>
              </motion.div>
            ))}
          </div>
        </div>
      </PatternSection>

      {/* ════════════════════════════════════════════════════════════════════
          LOADERS SHOWCASE
      ════════════════════════════════════════════════════════════════════ */}
      <PatternSection contentClassName="bg-neutral-100">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          >
            <div>
              <Heading as="h2" className="text-foreground text-3xl md:text-4xl">
                Loaders
              </Heading>
              <Paragraph className="mt-2 text-neutral-500">
                Smooth, looping animations for every loading state.
              </Paragraph>
            </div>
            <Button
              asChild
              variant="outline"
              className="self-start sm:self-auto rounded-full shrink-0"
            >
              <Link href="/loaders">
                View all loaders <IconArrowRight size={14} className="ml-1" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {LOADER_PREVIEWS.map((item) => (
              <LoaderCard key={item.name} {...item} />
            ))}
          </div>
        </div>
      </PatternSection>

      {/* ════════════════════════════════════════════════════════════════════
          ICONS SHOWCASE
      ════════════════════════════════════════════════════════════════════ */}
      <PatternSection>
        <div className="mx-auto max-w-5xl px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          >
            <div>
              <Heading as="h2" className="text-foreground text-3xl md:text-4xl">
                Icons
              </Heading>
              <Paragraph className="mt-2 text-neutral-500">
                Hover over any icon to see it come alive.
              </Paragraph>
            </div>
            <Button
              asChild
              variant="outline"
              className="self-start sm:self-auto rounded-full shrink-0"
            >
              <Link href="/icons">
                View all icons <IconArrowRight size={14} className="ml-1" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {ICON_PREVIEWS.map((item) => (
              <IconCard key={item.name} {...item} />
            ))}
          </div>
        </div>
      </PatternSection>

      {/* ════════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════════════════════ */}
      <PatternSection contentClassName="bg-neutral-100">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <Heading as="h2" className="text-foreground text-3xl md:text-4xl">
              How it works
            </Heading>
            <Paragraph className="mt-3 text-neutral-500 max-w-md mx-auto">
              From browsing to shipping in under a minute.
            </Paragraph>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STEPS.map(({ step, title, description }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="relative rounded-lg border border-neutral-200 bg-white p-6 hover:shadow-md transition-shadow"
              >
                <span className="text-5xl font-bold text-neutral-100 select-none leading-none">
                  {step}
                </span>
                <h3 className="mt-2 text-sm font-semibold text-foreground">
                  {title}
                </h3>
                <Paragraph
                  variant="muted"
                  className="mt-1.5 text-neutral-500 text-sm leading-relaxed"
                >
                  {description}
                </Paragraph>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    <IconArrowRight size={16} className="text-neutral-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Code snippet */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-6 rounded-lg border border-neutral-200 bg-neutral-900 p-6 font-mono text-sm overflow-x-auto"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <pre className="text-neutral-300 leading-7 whitespace-pre-wrap">{`import { BarsBounce } from '@/components/craftui/loaders/bars-bounce/default';

export default function Page() {
  return (
    <BarsBounce
      color="currentColor"
      width={48}
      height={48}
      isAnimating
    />
  );
}`}</pre>
          </motion.div>
        </div>
      </PatternSection>

      {/* ════════════════════════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════════════════════════ */}
      <PatternSection>
        <div className="mx-auto max-w-xl px-6 py-28 flex flex-col items-center text-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <Heading className="text-foreground text-3xl md:text-5xl">
              Start building today
            </Heading>
            <Paragraph className="text-neutral-500 max-w-md text-base md:text-lg">
              All components are free. Browse the full library, copy what you
              need, and ship something great.
            </Paragraph>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/loaders">
                  Get started <IconArrowRight size={15} className="ml-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="rounded-full px-6 text-neutral-500"
              >
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandGithub size={17} className="mr-1.5" /> Star on
                  GitHub
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </PatternSection>

      {/* ════════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════════ */}
      <PatternSection contentClassName="bg-neutral-50">
        <div className="mx-auto max-w-5xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Paragraph variant="muted" className="text-neutral-400 text-xs">
            © {new Date().getFullYear()} SVG Components Library. Free for
            personal and commercial use.
          </Paragraph>
          <div className="flex items-center gap-5 text-xs text-neutral-400">
            <Link
              href="/loaders"
              className="hover:text-foreground transition-colors"
            >
              Loaders
            </Link>
            <Link
              href="/icons"
              className="hover:text-foreground transition-colors"
            >
              Icons
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </PatternSection>
    </div>
  );
}
