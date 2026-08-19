"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { IconExternalLink } from "@tabler/icons-react";
import { Paragraph } from "@/components/Paragraph";
import {
  hoverOrchestrator,
  sliderVariants,
  reducedSliderVariants,
} from "@/lib/motion";
interface IconCardProps {
  icon: {
    slug: string;
    name: string;
    variations: any[];
  };
  isMatched?: boolean;
}

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
      variants={hoverOrchestrator}
      initial="initial"
      whileHover={isMatched ? "hover" : undefined}
      className="w-full h-28"
    >
      <Link
        href={`/icons?slug=${icon.slug}`}
        tabIndex={isMatched ? undefined : -1}
        aria-hidden={!isMatched}
        className={`border rounded-lg hover:shadow-lg transition-shadow group w-full h-full flex items-center justify-center bg-card text-card-foreground relative overflow-hidden block ${
          isMatched ? "" : "pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-center">
          <IconComponent size={32} />
        </div>

        {/* Gradient overlay — dark mode darkens further rather than swapping
            the gradient for a flat fill. */}
        <motion.div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent dark:from-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Slider from bottom — foreground/background invert together, so the
            bar stays legible in both themes. */}
        <motion.div
          variants={shouldReduceMotion ? reducedSliderVariants : sliderVariants}
          className="absolute bottom-0 left-0 right-0 bg-foreground/85 text-background py-1.5 px-2 text-center backdrop-blur-sm"
        >
          <Paragraph
            as="span"
            variant="body"
            className="block text-background"
          >
            See in action
            <IconExternalLink className="inline-block ml-1 mb-0.5" size={12} />
          </Paragraph>
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
