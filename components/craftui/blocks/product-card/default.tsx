"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, type ComponentProps } from "react";
import useMeasure from "react-use-measure";
import { HugeiconsIcon } from "@hugeicons/react";
import { GridViewIcon, ShoppingBag01Icon } from "@hugeicons/core-free-icons";

type HugeIcon = ComponentProps<typeof HugeiconsIcon>["icon"];

type Stage = 1 | 2;

const CARD_W = 320;

interface ImageFrame {
  top: number;
  left: number;
  width: number;
  height: number;
  rotate: number;
  radius: number;
  zIndex: number;
}

const frameConfig: Record<Stage, ImageFrame[]> = {
  1: [
    {
      top: 70,
      left: 46,
      width: 180,
      height: 240,
      rotate: -8,
      radius: 8,
      zIndex: 1,
    },
    {
      top: 56,
      left: 66,
      width: 190,
      height: 250,
      rotate: 0,
      radius: 8,
      zIndex: 2,
    },
    {
      top: 70,
      left: 94,
      width: 180,
      height: 240,
      rotate: 8,
      radius: 8,
      zIndex: 3,
    },
  ],
  2: [
    {
      top: 24,
      left: 20,
      width: 88,
      height: 150,
      rotate: 0,
      radius: 0,
      zIndex: 1,
    },
    {
      top: 24,
      left: 116,
      width: 88,
      height: 150,
      rotate: 0,
      radius: 0,
      zIndex: 1,
    },
    {
      top: 24,
      left: 212,
      width: 88,
      height: 150,
      rotate: 0,
      radius: 0,
      zIndex: 1,
    },
  ],
};

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=80",
];

export interface ProductCardProps {
  images?: [string, string, string];
  imageAlt?: string;
  title?: string;
  description?: string;
  price?: string;
  tags?: string[];
  viewLabel?: string;
  actionLabel?: string;
  viewIcon?: HugeIcon;
  actionIcon?: HugeIcon;
  onAction?: () => void;
  className?: string;
}

export default function ProductCard({
  images = DEFAULT_IMAGES as [string, string, string],
  imageAlt = "Product photo",
  title = "Aurora Bay Resort",
  description = "A quiet stretch of coastline, three rooms curated for slow mornings and long dinners.",
  price = "$189/night",
  tags = ["Free Cancellation", "Ocean View"],
  viewLabel = "View all rooms",
  actionLabel = "Book Now",
  viewIcon = GridViewIcon,
  actionIcon = ShoppingBag01Icon,
  onAction,
  className,
}: ProductCardProps = {}) {
  const [stage, setStage] = useState<Stage>(1);
  const shouldReduceMotion = useReducedMotion();
  const expanded = stage === 2;
  const frames = frameConfig[stage];

  // Hidden mirrors of each stage's real content, laid out in normal flow so
  // the card's width/height are derived from what's actually inside it
  // (title/description length, tag count) instead of fixed constants.
  const [stage1Ref, stage1Bounds] = useMeasure();
  const [stage2Ref, stage2Bounds] = useMeasure();

  const width = (expanded ? stage2Bounds.width : stage1Bounds.width) || CARD_W;
  const height = (expanded ? stage2Bounds.height : stage1Bounds.height) || 560;

  // Stage 2's CTA is bottom-anchored (76px = 56px button + 20px margin) and
  // full-width, so it tracks the measured height/width rather than a constant.
  const cta =
    stage === 1
      ? { top: 268, left: 228, width: 60, height: 60, radius: 0 }
      : {
          top: height - 76,
          left: 20,
          width: width - 40,
          height: 56,
          radius: 0,
        };

  const toggle = () => {
    if (stage === 2) onAction?.();
    setStage((s) => (s === 1 ? 2 : 1));
  };

  const morphTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        duration: expanded ? 0.22 : 0.18,
        ease: [0.645, 0.045, 0.355, 1] as const,
      };

  const ctaTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        duration: expanded ? 0.22 : 0.18,
        ease: [0.645, 0.045, 0.355, 1] as const,
      };

  const detailTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: expanded ? 0.1 : 0.12, ease: [0.165, 0.84, 0.44, 1] as const };

  // Texts-reveal: staggered blurred rise on entrance, decoupled quiet fade on exit
  // (no stagger, no y/blur) so dismissing doesn't replay the reveal in reverse.
  const detailContainerVariants = {
    hidden: {},
    visible: {
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { staggerChildren: 0.03, delayChildren: 0.18 },
    },
    exit: {
      transition: shouldReduceMotion ? { duration: 0 } : { staggerChildren: 0 },
    },
  };

  const detailLineVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12,
      filter: shouldReduceMotion ? "blur(0px)" : "blur(3px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.28, ease: [0.165, 0.84, 0.44, 1] as const },
    },
    exit: {
      opacity: 0,
      y: 0,
      filter: "blur(0px)",
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.2, ease: "easeOut" as const },
    },
  };

  // Icon-swap: instant cross-fade, no tween — the CTA's own morph carries the motion.
  const iconSwapTransition = { duration: 0 };
  const iconSwapHidden = { opacity: 0 };
  const iconSwapVisible = { opacity: 1 };

  return (
    <div className={`relative select-none ${className ?? ""}`}>
      <div
        ref={stage1Ref}
        aria-hidden
        className="invisible absolute top-0 left-0 -z-10"
        style={{ width: CARD_W }}
      >
        <div style={{ paddingTop: 56, paddingBottom: 24 }}>
          <div style={{ height: 250 }} />
          <div className="mt-5 flex justify-center gap-1.5">
            <span className="h-1.5 w-4" />
            <span className="h-1.5 w-1.5" />
            <span className="h-1.5 w-1.5" />
          </div>
        </div>
      </div>

      <div
        ref={stage2Ref}
        aria-hidden
        className="invisible absolute top-0 left-0 -z-10 px-5"
        style={{ width: CARD_W }}
      >
        <div style={{ height: 24 + 150 }} />
        <div style={{ marginTop: 16 }}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <span className="shrink-0 px-3 py-1 text-sm font-medium">
              {price}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed">{description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 24, height: 56 }} />
        <div style={{ height: 20 }} />
      </div>

      <motion.div
        animate={{ width, height }}
        transition={{ width: morphTransition, height: morphTransition }}
        className="relative overflow-hidden rounded-[8px] bg-white shadow-xl"
      >
        {images.map((src, i) => {
          const f = frames[i];
          return (
            <motion.div
              key={src}
              animate={{
                top: f.top,
                left: f.left,
                width: f.width,
                height: f.height,
                rotate: f.rotate,
                borderRadius: f.radius,
              }}
              style={{ zIndex: f.zIndex }}
              transition={{
                ...morphTransition,
                delay: shouldReduceMotion
                  ? 0
                  : expanded
                    ? i * 0.05
                    : (2 - i) * 0.05,
              }}
              className="absolute overflow-hidden shadow-md"
            >
              <img
                src={src}
                alt={`${imageAlt} ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </motion.div>
          );
        })}

        <motion.div
          animate={{ opacity: expanded ? 0 : 1, y: expanded ? 8 : 0 }}
          transition={detailTransition}
          className="absolute left-1/2 top-[326px] flex -translate-x-1/2 items-center gap-1.5"
        >
          <span className="h-1.5 w-4 rounded-[4px] bg-[oklch(0.215_0.029_243.425)]" />
          <span className="h-1.5 w-1.5 rounded-[4px] bg-[oklch(0.215_0.029_243.425)]/30" />
          <span className="h-1.5 w-1.5 rounded-[4px] bg-[oklch(0.215_0.029_243.425)]/30" />
        </motion.div>

        <div className="absolute inset-x-0 top-[190px] px-5">
          <AnimatePresence>
            {expanded && (
              <motion.div
                variants={detailContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  variants={detailLineVariants}
                  className="flex items-start justify-between gap-3"
                >
                  <h3 className="min-w-0 text-lg font-semibold tracking-tight text-balance text-[oklch(0.215_0.029_243.425)]">
                    {title}
                  </h3>
                  <span className="shrink-0 rounded-[4px] bg-[oklch(0.956_0.004_236.498)] px-3 py-1 text-sm font-medium whitespace-nowrap text-[oklch(0.215_0.029_243.425)] tabular-nums">
                    {price}
                  </span>
                </motion.div>

                <motion.p
                  variants={detailLineVariants}
                  className="mt-2 text-sm leading-relaxed text-pretty text-[oklch(0.502_0.021_250.776)]"
                >
                  {description}
                </motion.p>

                <motion.div
                  variants={detailLineVariants}
                  className="mt-3 flex flex-wrap gap-2"
                >
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-[4px] bg-[oklch(0.956_0.004_236.498)] px-3 py-1 text-xs font-medium whitespace-nowrap text-[oklch(0.215_0.029_243.425)]"
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          onClick={toggle}
          aria-label={expanded ? actionLabel : viewLabel}
          animate={{
            top: cta.top,
            left: cta.left,
            width: cta.width,
            height: cta.height,
            borderRadius: cta.radius,
          }}
          transition={ctaTransition}
          whileTap={{ scale: 0.96 }}
          style={{ zIndex: 10 }}
          className="absolute flex items-center justify-center gap-2 bg-[oklch(0.215_0.029_243.425)] text-white shadow-lg"
        >
          <AnimatePresence mode="wait" initial={false}>
            {expanded ? (
              <motion.span
                key="label"
                initial={iconSwapHidden}
                animate={iconSwapVisible}
                exit={iconSwapHidden}
                transition={iconSwapTransition}
                className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap select-none"
              >
                <HugeiconsIcon
                  icon={actionIcon}
                  size={16}
                  strokeWidth={2}
                  color="white"
                />
                {actionLabel}
              </motion.span>
            ) : (
              <motion.span
                key="icon"
                initial={iconSwapHidden}
                animate={iconSwapVisible}
                exit={iconSwapHidden}
                transition={iconSwapTransition}
              >
                <HugeiconsIcon
                  icon={viewIcon}
                  size={20}
                  strokeWidth={1.7}
                  color="white"
                />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </div>
  );
}
