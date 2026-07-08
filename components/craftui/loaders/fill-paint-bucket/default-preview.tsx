"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const SIZE = 100;
const BODY_PATH = "M 27 44 L 31 80 Q 31.5 84 35 84 L 65 84 Q 68.5 84 69 80 L 73 44 Z";

export default function FillPaintBucketPreview() {
  const {
    color = "#8b5cf6",
    strokeColor = "#1f1f1f",
    backgroundColor = "#ffffff",
    duration = 3.0,
    ease = "linear",
  } = useLoaderProps();

  const streamControls = useAnimation();
  const levelControls = useAnimation();

  useEffect(() => {
    streamControls.start({
      height: [0, 43, 43, 43],
      opacity: [1, 1, 1, 0],
      transition: { duration, repeat: Infinity, ease: "linear", times: [0, 0.15, 0.85, 1] },
    });
    levelControls.start({
      y: [82, 82, 50, 50],
      height: [0, 0, 32, 32],
      opacity: [1, 1, 1, 0],
      transition: { duration, repeat: Infinity, ease, times: [0, 0.15, 0.85, 1] },
    });
  }, [duration, ease, streamControls, levelControls]);

  return (
    <svg width={SIZE} height={SIZE} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <defs>
        <clipPath id="fillPaintBucketClipPreview">
          <path d="M 30 47 L 33.7 79 Q 34 81.5 36.5 81.5 L 63.5 81.5 Q 66 81.5 66.3 79 L 70 47 Z" />
        </clipPath>
      </defs>
      <motion.rect
        x={46}
        y={4}
        width={8}
        rx={3}
        fill={color}
        initial={{ height: 0, opacity: 1 }}
        animate={streamControls}
      />
      <path d={BODY_PATH} fill={backgroundColor} />
      <g clipPath="url(#fillPaintBucketClipPreview)">
        <motion.rect
          x={28}
          width={44}
          fill={color}
          initial={{ y: 82, height: 0 }}
          animate={levelControls}
        />
      </g>
      <path d={BODY_PATH} stroke={strokeColor} strokeWidth={5} strokeLinejoin="round" fill="none" />
      <line x1={27} y1={44} x2={73} y2={44} stroke={strokeColor} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
}
