"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const SIZE = 100;
const FULL_WIDTH = 58;

export default function FillBatteryPreview() {
  const {
    color = "#4ade80",
    strokeColor = "#1f1f1f",
    backgroundColor = "#ffffff",
    duration = 2.5,
    ease = "linear",
  } = useLoaderProps();

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      width: [0, FULL_WIDTH, FULL_WIDTH],
      opacity: [1, 1, 0],
      transition: { duration, repeat: Infinity, ease, times: [0, 0.85, 1] },
    });
  }, [duration, ease, controls]);

  return (
    <svg width={SIZE} height={SIZE} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <defs>
        <clipPath id="fillBatteryClipPreview">
          <rect x={16} y={36} width={FULL_WIDTH} height={28} rx={5} />
        </clipPath>
      </defs>
      <rect x={12} y={32} width={66} height={36} rx={8} fill={backgroundColor} />
      <g clipPath="url(#fillBatteryClipPreview)">
        <motion.rect
          x={16}
          y={36}
          height={28}
          rx={5}
          fill={color}
          initial={{ width: 0 }}
          animate={controls}
        />
      </g>
      <rect x={12} y={32} width={66} height={36} rx={8} stroke={strokeColor} strokeWidth={5} fill="none" />
      <rect x={83} y={42} width={8} height={16} rx={3} fill={strokeColor} />
    </svg>
  );
}
