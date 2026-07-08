"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const SIZE = 100;
const EMPTY_Y = 56;

export default function FillBeerGlassPreview() {
  const {
    color = "#f2a93b",
    secondaryColor = "#fdf3d8",
    strokeColor = "#1f1f1f",
    backgroundColor = "#ffffff",
    duration = 3.0,
    ease = "linear",
  } = useLoaderProps();

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      y: [EMPTY_Y, 0, 0],
      opacity: [1, 1, 0],
      transition: { duration, repeat: Infinity, ease, times: [0, 0.85, 1] },
    });
  }, [duration, ease, controls]);

  return (
    <svg width={SIZE} height={SIZE} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <defs>
        <clipPath id="fillBeerGlassClipPreview">
          <rect x={27} y={19} width={38} height={56} rx={5} />
        </clipPath>
      </defs>
      <rect x={24} y={16} width={44} height={62} rx={8} fill={backgroundColor} />
      <g clipPath="url(#fillBeerGlassClipPreview)">
        <motion.g initial={{ y: EMPTY_Y }} animate={controls}>
          <circle cx={32} cy={24} r={5} fill={secondaryColor} />
          <circle cx={41.5} cy={22.5} r={5.5} fill={secondaryColor} />
          <circle cx={51} cy={24} r={5} fill={secondaryColor} />
          <circle cx={60} cy={22.5} r={5.5} fill={secondaryColor} />
          <rect x={27} y={24} width={38} height={8} fill={secondaryColor} />
          <rect x={27} y={31} width={38} height={70} fill={color} />
        </motion.g>
      </g>
      <path
        d="M 68 34 C 84 30 90 38 87 48 C 84 56 76 58 68 56"
        stroke={strokeColor}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
      <rect x={24} y={16} width={44} height={62} rx={8} stroke={strokeColor} strokeWidth={5} fill="none" />
      <line x1={18} y1={86} x2={74} y2={86} stroke={strokeColor} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
}
