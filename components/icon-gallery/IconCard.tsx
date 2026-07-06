"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { IconExternalLink } from "@tabler/icons-react";
interface IconCardProps {
  icon: {
    slug: string;
    name: string;
    variations: any[];
  };
  isMatched?: boolean;
}

const cardVariants = {
  initial: {},
  hover: {},
};

const PANEL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sliderVariants = {
  initial: {
    y: "100%",
    opacity: 0,
    filter: "blur(2px)",
    transition: { duration: 0.35, ease: PANEL_EASE },
  },
  hover: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: PANEL_EASE },
  },
};

const reducedSliderVariants = {
  initial: { y: "100%", opacity: 0, filter: "blur(0px)", transition: { duration: 0 } },
  hover: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0 } },
};

export function IconCard({ icon, isMatched = true }: IconCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const firstVariation = icon.variations[0]?.name ?? "default";
  const IconComponent = useMemo(
    () =>
      dynamic(
        () =>
          import(`@/components/craftui/icons/${icon.slug}/${firstVariation}.tsx`)
            .then((mod) => {
              const exportedComponent = mod[Object.keys(mod)[0]];
              return { default: exportedComponent };
            })
            .catch(() => {
              return {
                default: ({ size }: { size?: number }) => (
                  <div className="text-6xl">📦</div>
                ),
              };
            }),
        { ssr: false },
      ),
    [icon.slug, firstVariation],
  );

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover={isMatched ? "hover" : undefined}
      className="w-full h-28"
    >
      <Link
        href={`/icons?slug=${icon.slug}`}
        tabIndex={isMatched ? undefined : -1}
        aria-hidden={!isMatched}
        className={`border rounded-lg hover:shadow-lg transition-shadow group w-full h-full flex items-center justify-center bg-white relative overflow-hidden block ${
          isMatched ? "" : "pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-center">
          <IconComponent size={32} />
        </div>

        {/* Gradient overlay */}
        <motion.div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity dark:bg-neutral-900" />

        {/* Slider from bottom */}
        <motion.div
          variants={shouldReduceMotion ? reducedSliderVariants : sliderVariants}
          className="absolute bottom-0 left-0 right-0 bg-black/80 text-white py-1.5 px-2 text-center text-[11px] font-medium backdrop-blur-sm"
        >
          See in action
          <IconExternalLink className="inline-block ml-1 mb-0.5" size={12} />
        </motion.div>

        {/* Non-match mask */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 rounded-lg bg-white/50 dark:bg-black/40 backdrop-blur-[6px] transition-opacity duration-200 ease-out motion-reduce:transition-none ${
            isMatched ? "opacity-0" : "opacity-100"
          }`}
        />
      </Link>
    </motion.div>
  );
}
