'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

interface FillBatteryProps {
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
const FULL_WIDTH = 58;

export function FillBattery({
  width = 60,
  height = 60,
  color = "#4ade80",
  strokeColor = "#1f1f1f",
  backgroundColor = "#ffffff",
  isAnimating = true,
  duration = 2.5,
  ease = 'linear',
}: FillBatteryProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (isAnimating) {
      // Charge over ~85% of the cycle, then hold full while the level fades
      // out so the loop restarts at empty without a visible snap.
      controls.start({
        width: [0, FULL_WIDTH, FULL_WIDTH],
        opacity: [1, 1, 0],
        transition: { duration, repeat: Infinity, ease, times: [0, 0.85, 1] },
      });
    } else {
      controls.stop();
      controls.set({ width: 0, opacity: 1 });
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
        <clipPath id={`fill-battery-clip-${width}`}>
          <rect x={16} y={36} width={FULL_WIDTH} height={28} rx={5} />
        </clipPath>
      </defs>
      {/* Body interior */}
      <rect x={12} y={32} width={66} height={36} rx={8} fill={backgroundColor} />
      {/* Charge level */}
      <g clipPath={`url(#fill-battery-clip-${width})`}>
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
      {/* Body outline */}
      <rect
        x={12}
        y={32}
        width={66}
        height={36}
        rx={8}
        stroke={strokeColor}
        strokeWidth={5}
        fill="none"
      />
      {/* Terminal nub */}
      <rect x={83} y={42} width={8} height={16} rx={3} fill={strokeColor} />
    </svg>
  );
}
