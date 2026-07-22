"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Button } from "@/components/ui/button";
// import { PatternSection } from "@/components/PatternSection";
import HeroSocialLinks from "@/components/Homepage/HeroSocialLinks";
import { HeroLinksList } from "@/components/Homepage/HeroLinksList";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [iconsHovered, setIconsHovered] = useState(false);

  return (
    <div className="bg-background">
      {/* ── Hero ── */}
      <div className="max-w-7xl mx-auto">
        {/* <PatternSection hideTopBar hideBottomBar={true} fillHeight shader> */}
        <motion.div className="relative flex flex-col items-center gap-6 min-h-dvh justify-center text-center">
          <HeroSocialLinks />
          <Heading className="">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "100%", filter: "blur(12px)", opacity: 0 }}
                animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                className="block text-foreground/70 font-light"
              >
                Craft Better Interface
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
                className="tracking-tighter"
              >
                for modern web.
              </motion.span>
            </span>
          </Heading>

          {/* <motion.div
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
            </motion.div> */}

          <HeroLinksList />
        </motion.div>
        {/* </PatternSection> */}
      </div>
    </div>
  );
}
