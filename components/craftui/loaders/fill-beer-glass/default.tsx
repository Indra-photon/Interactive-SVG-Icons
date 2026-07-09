'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

interface FillBeerGlassProps {
  width?: number;
  height?: number;
  color?: string;
  secondaryColor?: string;
  strokeColor?: string;
  backgroundColor?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

// Fixed 100x100 viewBox; width/height scale the svg.
// Beer + foam live in one group that rises from the bottom of the mug.
const EMPTY_Y = 56;

export function FillBeerGlass({
  width = 60,
  height = 60,
  color = "#f2a93b",
  secondaryColor = "#fdf3d8",
  strokeColor = "#1f1f1f",
  backgroundColor = "#ffffff",
  isAnimating = true,
  duration = 3.0,
  ease = 'linear',
}: FillBeerGlassProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (isAnimating) {
      // Fill over ~85% of the cycle, then hold while the beer fades out so
      // the loop restarts at empty without a visible snap.
      controls.start({
        y: [EMPTY_Y, 0, 0],
        opacity: [1, 1, 0],
        transition: { duration, repeat: Infinity, ease, times: [0, 0.85, 1] },
      });
    } else {
      controls.stop();
      controls.set({ y: EMPTY_Y, opacity: 1 });
    }
  }, [isAnimating, duration, ease, controls]);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
    >
      <defs>
        <clipPath id={`fill-beer-glass-clip-${width}`}>
          <rect x={27} y={19} width={38} height={56} rx={5} />
        </clipPath>
      </defs>
      {/* Mug interior */}
      <rect x={24} y={16} width={44} height={62} rx={8} fill={backgroundColor} />
      {/* Rising beer with foam cap */}
      <g clipPath={`url(#fill-beer-glass-clip-${width})`}>
        <motion.g initial={{ y: EMPTY_Y }} animate={controls}>
          <circle cx={32} cy={24} r={5} fill={secondaryColor} />
          <circle cx={41.5} cy={22.5} r={5.5} fill={secondaryColor} />
          <circle cx={51} cy={24} r={5} fill={secondaryColor} />
          <circle cx={60} cy={22.5} r={5.5} fill={secondaryColor} />
          <rect x={27} y={24} width={38} height={8} fill={secondaryColor} />
          <rect x={27} y={31} width={38} height={70} fill={color} />
        </motion.g>
      </g>
      {/* Handle */}
      <path
        d="M 68 34 C 84 30 90 38 87 48 C 84 56 76 58 68 56"
        stroke={strokeColor}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
      {/* Mug outline */}
      <rect
        x={24}
        y={16}
        width={44}
        height={62}
        rx={8}
        stroke={strokeColor}
        strokeWidth={5}
        fill="none"
      />
      {/* Base line */}
      <line x1={18} y1={86} x2={74} y2={86} stroke={strokeColor} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
}
