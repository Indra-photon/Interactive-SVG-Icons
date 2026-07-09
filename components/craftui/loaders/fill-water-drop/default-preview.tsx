"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const SIZE = 100;
const DROP_PATH = "M 50 12 C 50 12 26 44 26 61 C 26 74.7 36.7 86 50 86 C 63.3 86 74 74.7 74 61 C 74 44 50 12 50 12 Z";
const BOTTOM = 86;
const RISE = 74;
const AMPLITUDE = 6;

const getWavePath = (yOffset: number) => {
  const y = BOTTOM - yOffset;
  return `M -100,${y} Q 25,${y - AMPLITUDE} 50,${y} Q 75,${y + AMPLITUDE} 200,${y} L 200,${BOTTOM + 10} L -100,${BOTTOM + 10} Z`;
};

export default function FillWaterDropPreview() {
  const {
    color = "#38bdf8",
    strokeColor = "#1f1f1f",
    backgroundColor = "#ffffff",
    duration = 2.5,
    ease = "linear",
  } = useLoaderProps();

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      d: [getWavePath(0), getWavePath(RISE / 2), getWavePath(RISE), getWavePath(RISE)],
      opacity: [1, 1, 1, 0],
      transition: { duration, repeat: Infinity, ease, times: [0, 0.425, 0.85, 1] },
    });
  }, [duration, ease, controls]);

  return (
    <svg width={SIZE} height={SIZE} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <defs>
        <clipPath id="fillWaterDropClipPreview">
          <path d={DROP_PATH} />
        </clipPath>
      </defs>
      <path d={DROP_PATH} fill={backgroundColor} />
      <g clipPath="url(#fillWaterDropClipPreview)">
        <motion.path fill={color} initial={{ d: getWavePath(0) }} animate={controls} />
      </g>
      <path d={DROP_PATH} stroke={strokeColor} strokeWidth={5} strokeLinejoin="round" fill="none" />
    </svg>
  );
}
