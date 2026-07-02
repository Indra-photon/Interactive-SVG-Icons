"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type Stage = 1 | 2 | 3;

const stageConfig: Record<
  Stage,
  {
    imageW: number;
    imageH: number;
    imageRadius: number;
    fontSize: number;
    rotate: number;
  }
> = {
  1: {
    imageW: 54,
    imageH: 80,
    imageRadius: 27,
    fontSize: 88,
    rotate: 0,
  },
  2: {
    imageW: 620,
    imageH: 400,
    imageRadius: 20,
    fontSize: 176,
    rotate: -3,
  },
  3: {
    imageW: 260,
    imageH: 500,
    imageRadius: 28,
    fontSize: 144,
    rotate: 4,
  },
};

const IMAGE_URL =
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&auto=format&fit=crop&q=80";

const stageLabel = (s: Stage) => `Stage 0${s} — click to advance`;

// ease-in-out-quart — for on-screen morphing elements
const morph = {
  ease: [0.77, 0, 0.175, 1] as const,
  duration: 0.65,
};

export default function MorphingImageEffect() {
  const [stage, setStage] = useState<Stage>(1);
  const cfg = stageConfig[stage];

  const advance = () => setStage((s) => ((s % 3) + 1) as Stage);

  return (
    <div
      onClick={advance}
      className="flex min-h-screen cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#eceae4] w-full select-none"
    >
      {/* Grid: 1fr [image auto] 1fr — P and ST always adjacent to image */}
      <div
        className="grid w-full items-center px-8"
        style={{ gridTemplateColumns: "1fr auto 1fr", gap: "0 1rem" }}
      >
        {/* P — right-aligned so it touches the image's left edge */}
        <motion.span
          animate={{ fontSize: cfg.fontSize }}
          transition={{ ...morph, delay: 0.04 }}
          className="text-right font-sans font-normal leading-none tracking-tighter text-[#111]"
        >
          P
        </motion.span>

        {/* Image — CSS t-resize owns width/height, Motion owns borderRadius + rotate */}
        <motion.div
          animate={{ borderRadius: cfg.imageRadius, rotate: cfg.rotate }}
          style={{ width: cfg.imageW, height: cfg.imageH }}
          transition={morph}
          className="t-resize shrink-0 overflow-hidden"
        >
          <img
            src={IMAGE_URL}
            alt="interior"
            className="block h-full w-full object-cover"
          />
        </motion.div>

        {/* ST — left-aligned so it touches the image's right edge */}
        <motion.span
          animate={{ fontSize: cfg.fontSize }}
          transition={{ ...morph, delay: 0.04 }}
          className="text-left font-sans font-normal leading-none tracking-tighter text-[#111]"
        >
          ST
        </motion.span>
      </div>
    </div>
  );
}
