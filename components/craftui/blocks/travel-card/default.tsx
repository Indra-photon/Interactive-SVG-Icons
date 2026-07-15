"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, type ComponentProps } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlaneIcon, Sun01Icon } from "@hugeicons/core-free-icons";

type HugeIcon = ComponentProps<typeof HugeiconsIcon>["icon"];

type Stage = 1 | 2;

const CARD_W = 400;
const CARD_H = 550;

const stageConfig: Record<
  Stage,
  {
    imageTop: number;
    imageLeft: number;
    imageWidth: number;
    imageHeight: number;
    imageRadius: number;
    cardBg: string;
    ctaTop: number;
    ctaLeft: number;
    ctaWidth: number;
    ctaHeight: number;
    ctaRadius: number;
  }
> = {
  1: {
    imageTop: 0,
    imageLeft: 0,
    imageWidth: CARD_W,
    imageHeight: CARD_H,
    imageRadius: 8,
    cardBg: "rgb(13, 27, 38)",
    ctaTop: CARD_H - 64,
    ctaLeft: CARD_W - 146,
    ctaWidth: 130,
    ctaHeight: 48,
    ctaRadius: 0,
  },
  2: {
    imageTop: 20,
    imageLeft: 20,
    imageWidth: CARD_W - 40,
    imageHeight: 280,
    imageRadius: 0,
    cardBg: "rgb(255, 255, 255)",
    ctaTop: CARD_H - 68,
    ctaLeft: 20,
    ctaWidth: CARD_W - 40,
    ctaHeight: 48,
    ctaRadius: 0,
  },
};

const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=900&auto=format&fit=crop&q=80";

const FLIGHT_PATH = "M 286 510 Q 240 320 290 328";

export interface TravelCardProps {
  imageUrl?: string;
  imageAlt?: string;
  title?: string;
  description?: string;
  price?: string;
  availabilityText?: string;
  tagText?: string;
  tagIcon?: HugeIcon;
  exploreLabel?: string;
  addToCartLabel?: string;
  onAddToCart?: () => void;
  className?: string;
}

export default function TravelCard({
  imageUrl = DEFAULT_IMAGE_URL,
  imageAlt = "Deep Blue Nights",
  title = "Deep Blue Nights",
  description = "For those who crave peace louder than the city. This view isn’t just scenery, it’s a whole reset.",
  price = "$2,999",
  availabilityText = "9 seats left",
  tagText = "Perfect for summer",
  tagIcon = Sun01Icon,
  exploreLabel = "Explore",
  addToCartLabel = "Add to Cart",
  onAddToCart,
  className,
}: TravelCardProps = {}) {
  const [stage, setStage] = useState<Stage>(1);
  const shouldReduceMotion = useReducedMotion();
  const cfg = stageConfig[stage];
  const expanded = stage === 2;

  const toggle = () => {
    if (stage === 2) onAddToCart?.();
    setStage((s) => (s === 1 ? 2 : 1));
  };

  const morphTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        type: "spring" as const,
        duration: expanded ? 0.5 : 0.45,
        bounce: 0.25,
      };

  const ctaTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        type: "spring" as const,
        duration: expanded ? 0.35 : 0.25,
        bounce: 0.25,
      };

  const detailTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: expanded ? 0.15 : 0.08, ease: [0.77, 0, 0.175, 1] as const };

  const planeTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        offsetDistance: {
          type: "spring" as const,
          duration: expanded ? 0.9 : 0.18,
          bounce: 0.25,
          delay: expanded ? 0 : 0.05,
        },
        scale: {
          type: "spring" as const,
          duration: expanded ? 0.5 : 0.45,
          bounce: 0.25,
          delay: expanded ? 0 : 0.05,
        },
        opacity: expanded
          ? { duration: 0.9 }
          : { duration: 0.45, delay: 0.05, times: [0, 0.15, 0.85, 1] },
      };

  return (
    <div
      className={`relative select-none ${className ?? ""}`}
      style={{ width: CARD_W, height: CARD_H }}
    >
      <motion.div
        animate={{ backgroundColor: cfg.cardBg }}
        transition={{
          backgroundColor: {
            duration: 0.02,
            ease: "easeOut",
            delay: shouldReduceMotion ? 0 : expanded ? 0 : 0.35,
          },
        }}
        className="absolute inset-0 overflow-hidden rounded-[8px] shadow-xl"
      >
        <motion.div
          animate={{
            top: cfg.imageTop,
            left: cfg.imageLeft,
            width: cfg.imageWidth,
            height: cfg.imageHeight,
            borderRadius: cfg.imageRadius,
          }}
          transition={morphTransition}
          className="absolute overflow-hidden"
        >
          <img
            src={imageUrl}
            alt={imageAlt}
            className="h-full w-full object-cover outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
          />
        </motion.div>

        <motion.div
          animate={{ top: cfg.imageTop + cfg.imageHeight + 16 }}
          transition={detailTransition}
          className="absolute inset-x-0 px-5"
        >
          <motion.div
            animate={{
              opacity: expanded ? 1 : 0,
              filter: expanded ? "blur(0px)" : "blur(2px)",
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.12,
              ease: "easeOut",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 line-clamp-2 text-lg font-semibold tracking-tight text-balance text-[oklch(0.215_0.029_243.425)]">
                {title}
              </h3>

              <span className="flex shrink-0 items-center gap-1.5 rounded-[4px] bg-[oklch(0.956_0.004_236.498)] py-1 ps-1 pe-3 text-xs font-medium whitespace-nowrap text-[oklch(0.215_0.029_243.425)] tabular-nums">
                <span className="h-4 w-4 shrink-0" />
                {availabilityText}
              </span>
            </div>
          </motion.div>

          <motion.p
            animate={{
              opacity: expanded ? 1 : 0,
              filter: expanded ? "blur(0px)" : "blur(2px)",
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.12,
              ease: "easeOut",
              delay: shouldReduceMotion ? 0 : expanded ? 0.08 : 0,
            }}
            className="mt-2 line-clamp-2 text-sm leading-relaxed text-pretty text-[oklch(0.502_0.021_250.776)]"
          >
            {description}
          </motion.p>

          <motion.div
            animate={{
              opacity: expanded ? 1 : 0,
              filter: expanded ? "blur(0px)" : "blur(2px)",
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.12,
              ease: "easeOut",
              delay: shouldReduceMotion ? 0 : expanded ? 0.16 : 0,
            }}
            className="mt-3 flex items-center gap-2"
          >
            <span className="rounded-[4px] bg-[oklch(0.956_0.004_236.498)] px-3 py-1 text-sm font-medium whitespace-nowrap text-[oklch(0.215_0.029_243.425)] tabular-nums">
              {price}
            </span>
            <span className="flex items-center gap-1 rounded-[4px] bg-[oklch(0.956_0.004_236.498)] px-3 py-1 text-xs font-medium whitespace-nowrap text-[oklch(0.215_0.029_243.425)]">
              <HugeiconsIcon
                icon={tagIcon}
                size={12}
                strokeWidth={2}
                color="oklch(0.215 0.029 243.425)"
              />
              {tagText}
            </span>
          </motion.div>
        </motion.div>

        <motion.button
          type="button"
          onClick={toggle}
          aria-label={expanded ? "Add to cart" : "View details"}
          animate={{
            top: cfg.ctaTop,
            left: cfg.ctaLeft,
            width: cfg.ctaWidth,
            height: cfg.ctaHeight,
            borderRadius: cfg.ctaRadius,
          }}
          transition={ctaTransition}
          whileTap={{ scale: 0.96 }}
          className="absolute flex items-center justify-center gap-2 bg-[oklch(0.215_0.029_243.425)] text-white shadow-lg"
        >
          {!expanded && <span className="h-6 w-6 shrink-0" />}

          <AnimatePresence mode="popLayout" initial={false}>
            {expanded ? (
              <motion.span
                key="cart-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.05 }}
                className="text-sm font-semibold whitespace-nowrap select-none"
              >
                {addToCartLabel}
              </motion.span>
            ) : (
              <motion.span
                key="explore-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.05 }}
                className="text-sm font-semibold whitespace-nowrap select-none"
              >
                {exploreLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <AnimatePresence>
          <motion.span
            key={stage}
            aria-hidden
            style={{
              offsetPath: `path("${FLIGHT_PATH}")`,
              offsetRotate: "0deg",
            }}
            initial={{
              offsetDistance: expanded ? "0%" : "100%",
              scale: expanded ? 1.4 : 0.9,
              opacity: 1,
            }}
            animate={{
              offsetDistance: expanded ? "100%" : "0%",
              scale: expanded ? 0.9 : 1.4,
              opacity: expanded ? 1 : [1, 0, 0.9, 1],
            }}
            transition={planeTransition}
            className="absolute flex h-4 w-4 items-center justify-center rounded-[4px] bg-[oklch(0.215_0.029_243.425)]"
          >
            <HugeiconsIcon
              icon={PlaneIcon}
              size={12}
              strokeWidth={2}
              color="oklch(1 0 0)"
            />
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
