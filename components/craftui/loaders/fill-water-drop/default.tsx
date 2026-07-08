'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

interface FillWaterDropProps {
  width?: number;
  height?: number;
  color?: string;
  strokeColor?: string;
  backgroundColor?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

// Fixed 100x100 viewBox; width/height scale the svg.
const DROP_PATH = 'M 50 12 C 50 12 26 44 26 61 C 26 74.7 36.7 86 50 86 C 63.3 86 74 74.7 74 61 C 74 44 50 12 50 12 Z';
const BOTTOM = 86;
const RISE = 74; // full rise: from the drop's bottom past its tip
const AMPLITUDE = 6;

// Wave surface at (BOTTOM - yOffset), filled down past the drop's bottom.
const getWavePath = (yOffset: number) => {
  const y = BOTTOM - yOffset;
  return `M -100,${y} Q 25,${y - AMPLITUDE} 50,${y} Q 75,${y + AMPLITUDE} 200,${y} L 200,${BOTTOM + 10} L -100,${BOTTOM + 10} Z`;
};

export function FillWaterDrop({
  width = 60,
  height = 60,
  color = "#38bdf8",
  strokeColor = "#1f1f1f",
  backgroundColor = "#ffffff",
  isAnimating = true,
  duration = 2.5,
  ease = 'linear',
}: FillWaterDropProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (isAnimating) {
      // Rise to full over ~85% of the cycle, then hold the level while the
      // water fades out so the loop restarts at empty without a visible snap.
      controls.start({
        d: [getWavePath(0), getWavePath(RISE / 2), getWavePath(RISE), getWavePath(RISE)],
        opacity: [1, 1, 1, 0],
        transition: { duration, repeat: Infinity, ease, times: [0, 0.425, 0.85, 1] },
      });
    } else {
      controls.stop();
      controls.set({ d: getWavePath(0), opacity: 1 });
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
        <clipPath id={`fill-water-drop-clip-${width}`}>
          <path d={DROP_PATH} />
        </clipPath>
      </defs>
      {/* Drop interior */}
      <path d={DROP_PATH} fill={backgroundColor} />
      {/* Rising water */}
      <g clipPath={`url(#fill-water-drop-clip-${width})`}>
        <motion.path fill={color} initial={{ d: getWavePath(0) }} animate={controls} />
      </g>
      {/* Drop outline */}
      <path
        d={DROP_PATH}
        stroke={strokeColor}
        strokeWidth={5}
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
