"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
// import { PatternSection } from "@/components/PatternSection";
import { HeroLinksList } from "@/components/Homepage/HeroLinksList";
import { HeroTermBadge } from "@/components/Homepage/HeroTermBadge";
import { ShowcaseSection } from "@/components/Homepage/ShowcaseSection";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [iconsHovered, setIconsHovered] = useState(false);

  return (
    <div className="bg-background">
      {/* ── Hero ── */}
      <div className="max-w-7xl mx-auto">
        {/* <PatternSection hideTopBar hideBottomBar={true} fillHeight shader> */}
        <motion.div className="relative flex flex-col gap-6 py-8">
          {/* Same width and padding as HeroLinksList's own wrapper, so the
              heading's left edge lands on the first card's left edge rather
              than on the wider max-w-7xl shell. */}
          <div className="mx-auto w-full max-w-6xl px-8 sm:px-4">
            {/* sm:text-left overrides Heading's built-in sm:text-center. */}
            <Heading className="sm:text-left">
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "100%", filter: "blur(12px)", opacity: 0 }}
                  animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                  className="block text-foreground"
                >
                  Craft Better Interface
                </motion.span>
              </span>
            </Heading>

            {/* max-w-2xl keeps the measure near 70 characters; the heading is
                free to run wider. */}
            <motion.div
              initial={{ y: 12, filter: "blur(8px)", opacity: 0 }}
              animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
              transition={{
                duration: 0.7,
                ease: [0.19, 1, 0.22, 1],
                delay: 0.2,
              }}
              className="mt-6 flex max-w-3xl flex-col gap-4"
            >
              {/* Each term is tinted to its own hero card, so the intro and
                  the grid below it agree on what colour a catalog is. */}
              <Paragraph variant="body">
                A growing library of{" "}
                <HeroTermBadge theme="black" mark="blocks">
                  Blocks
                </HeroTermBadge>{" "}
                <HeroTermBadge theme="yellow" mark="illustrations">
                  Illustrations
                </HeroTermBadge>{" "}
                <HeroTermBadge theme="rose" mark="ui">
                  UI components
                </HeroTermBadge>{" "}
                <HeroTermBadge theme="orange" mark="designs">
                  Designs
                </HeroTermBadge>{" "}
                <HeroTermBadge theme="sky" mark="loaders">
                  Loaders
                </HeroTermBadge>{" "}
                <HeroTermBadge theme="green" mark="icons">
                  Interactive icons
                </HeroTermBadge>{" "}
                — built with{" "}
                <span className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[16px] text-secondary-foreground">
                  React , Tailwind, and Framer Motion.
                </span>
              </Paragraph>
              <Paragraph variant="body">
                Every component ships as readable source you can copy straight
                into your project. No package to install, no design system to
                adopt. Take what you need and make it yours.
              </Paragraph>
            </motion.div>
          </div>

          <HeroLinksList />
        </motion.div>
        {/* </PatternSection> */}

        <ShowcaseSection />
      </div>
    </div>
  );
}
