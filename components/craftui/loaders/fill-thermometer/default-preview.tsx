"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const SIZE = 100;
const COLUMN_BOTTOM = 66;
const LOW_Y = 62;
const HIGH_Y = 16;

export default function FillThermometerPreview() {
  const {
    color = "#ef4444",
    strokeColor = "#1f1f1f",
    backgroundColor = "#ffffff",
    duration = 2.5,
    ease = "linear",
  } = useLoaderProps();

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      y: [LOW_Y, HIGH_Y, HIGH_Y],
      height: [COLUMN_BOTTOM - LOW_Y, COLUMN_BOTTOM - HIGH_Y, COLUMN_BOTTOM - HIGH_Y],
      opacity: [1, 1, 0],
      transition: { duration, repeat: Infinity, ease, times: [0, 0.85, 1] },
    });
  }, [duration, ease, controls]);

  return (
    <svg width={SIZE} height={SIZE} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <defs>
        <clipPath id="fillThermometerClipPreview">
          <rect x={46.5} y={13} width={7} height={53} rx={3.5} />
        </clipPath>
      </defs>
      <rect x={44} y={10} width={12} height={58} rx={6} fill={backgroundColor} stroke={strokeColor} strokeWidth={5} />
      <circle cx={50} cy={78} r={13} fill={backgroundColor} stroke={strokeColor} strokeWidth={5} />
      <rect x={46.5} y={63} width={7} height={8} fill={color} />
      <circle cx={50} cy={78} r={9} fill={color} />
      <g clipPath="url(#fillThermometerClipPreview)">
        <motion.rect
          x={46.5}
          width={7}
          fill={color}
          initial={{ y: LOW_Y, height: COLUMN_BOTTOM - LOW_Y }}
          animate={controls}
        />
      </g>
      <line x1={62} y1={20} x2={67} y2={20} stroke={strokeColor} strokeWidth={3} strokeLinecap="round" />
      <line x1={62} y1={32} x2={67} y2={32} stroke={strokeColor} strokeWidth={3} strokeLinecap="round" />
      <line x1={62} y1={44} x2={67} y2={44} stroke={strokeColor} strokeWidth={3} strokeLinecap="round" />
      <line x1={62} y1={56} x2={67} y2={56} stroke={strokeColor} strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}
