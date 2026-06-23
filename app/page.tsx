"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Button } from "@/components/ui/button";
import {
  IconBolt,
  IconClipboard,
  IconAdjustments,
  IconSparkles,
  IconArrowRight,
  IconBrandGithub,
} from "@tabler/icons-react";
import { MorphArrow } from "@/components/ui/morph-arrow";
import { DotsRotate } from "@/components/craftui/loaders/dots-rotate/default";
import { LoaderSection } from "@/components/Homepage/LoaderSection";
import { IconSection } from "@/components/Homepage/IconSection";
import { IllustrationSection } from "@/components/Homepage/IllustrationSection";
import { PatternSection } from "@/components/PatternSection";
import { HeroLoaderGrid } from "@/components/Homepage/HeroLoaderGrid";
import { HeroIconGrid } from "@/components/Homepage/HeroIconGrid";
import { HeroNetworkDiagram } from "@/components/Homepage/HeroNetworkDiagram";
import { HeroComponentTicker } from "@/components/Homepage/HeroComponentTicker";
import { HeroToolConnector } from "@/components/Homepage/HeroToolConnector";
import HeroFolderSVG from "@/components/Homepage/HeroFolderSVG";
import HeroSocialLinks from "@/components/Homepage/HeroSocialLinks";

// ─── Data ─────────────────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [iconsHovered, setIconsHovered] = useState(false);

  return (
    <div className="bg-background">
      {/* ── Hero ── */}
      <div className="max-w-7xl mx-auto">
        <PatternSection hideTopBar>
          <motion.div className="relative flex flex-col items-center gap-6 min-h-screen justify-center text-center">
            <HeroLoaderGrid />
            <HeroIconGrid />
            <HeroNetworkDiagram />
            <HeroToolConnector />
            <HeroSocialLinks />
            <HeroComponentTicker />
            <Heading className="">
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "100%", filter: "blur(12px)", opacity: 0 }}
                  animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                  className="block"
                >
                  Components to craft
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "100%", filter: "blur(12px)", opacity: 0 }}
                  animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.19, 1, 0.22, 1],
                    delay: 0.1,
                  }}
                  className="font-sans font-normal text-primary dark:text-primary block"
                >
                  Interfaces
                </motion.span>
              </span>
            </Heading>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-3 pt-1"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.09, delayChildren: 0.22 },
                },
              }}
              initial="hidden"
              animate="show"
            >
              <motion.div
                variants={{
                  hidden: { y: 18, opacity: 0, filter: "blur(8px)" },
                  show: {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] },
                  },
                }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="corner-squircle rounded-[10px] font-mono tracking-tighter"
                >
                  <Link href="/loaders">
                    Browse Loaders
                    <span className="ml-2">
                      <DotsRotate
                        dotSize={6}
                        width={22}
                        height={24}
                        color="var(--background)"
                        isAnimating
                      />
                    </span>
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { y: 18, opacity: 0, filter: "blur(8px)" },
                  show: {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] },
                  },
                }}
                onMouseEnter={() => setIconsHovered(true)}
                onMouseLeave={() => setIconsHovered(false)}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="corner-squircle rounded-[10px] font-mono tracking-tighter"
                >
                  <Link href="/icons">
                    Browse Icons
                    <span className="bg-primary/70 p-1 rounded-[6px] text-white ml-2">
                      <MorphArrow isHovered={iconsHovered} size={15} />
                    </span>
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { y: 18, opacity: 0, filter: "blur(8px)" },
                  show: {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] },
                  },
                }}
                onMouseEnter={() => setIconsHovered(true)}
                onMouseLeave={() => setIconsHovered(false)}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="corner-squircle rounded-[10px] font-mono tracking-tighter"
                >
                  <Link href="/illustrations">
                    Browse Illustrations
                    <span className="bg-primary/70 p-1 rounded-[6px] text-white ml-2">
                      <MorphArrow isHovered={iconsHovered} size={15} />
                    </span>
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { y: 18, opacity: 0, filter: "blur(8px)" },
                  show: {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] },
                  },
                }}
                onMouseEnter={() => setIconsHovered(true)}
                onMouseLeave={() => setIconsHovered(false)}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="corner-squircle rounded-[10px] font-mono tracking-tighter"
                >
                  <Link href="/blocks">
                    Browse Blocks
                    <span className="bg-primary/70 p-1 rounded-[6px] text-white ml-2">
                      <MorphArrow isHovered={iconsHovered} size={15} />
                    </span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </PatternSection>
      </div>

      {/* <div className="max-w-7xl mx-auto">
        <PatternSection>
          <LoaderSection />
        </PatternSection>

        <PatternSection>
          <IconSection />
        </PatternSection>

        <PatternSection hideBottomBar>
          <IllustrationSection />
        </PatternSection>
      </div> */}

      {/* ── Stats ── */}
      {/* <PatternSection contentClassName="bg-neutral-100">
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
      </PatternSection> */}

      {/* ── Features ── */}
      {/* <PatternSection>
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
                className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 hover:shadow-md transition-[box-shadow]"
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
      </PatternSection> */}

      {/* ── How it works ── */}
      {/* <PatternSection contentClassName="bg-neutral-100">
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
                className="relative rounded-lg border border-neutral-200 bg-white p-6 hover:shadow-md transition-[box-shadow]"
              >
                <span className="text-5xl font-bold text-neutral-100 select-none leading-none">
                  {step}
                </span>
                <h3 className="mt-2 text-sm font-semibold text-foreground">{title}</h3>
                <Paragraph variant="muted" className="mt-1.5 text-neutral-500 text-sm leading-relaxed">
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
      </PatternSection> */}

      {/* ── Final CTA ── */}
      {/* <PatternSection>
        <div className="mx-auto max-w-9xl px-6 py-28 flex flex-col items-center text-center gap-6">
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
      </PatternSection> */}

      {/* ── Footer ── */}
      {/* <PatternSection contentClassName="bg-neutral-50">
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
      </PatternSection> */}
    </div>
  );
}
