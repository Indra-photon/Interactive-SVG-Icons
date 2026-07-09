'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

interface FillThermometerProps {
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
// Mercury column bottom stays anchored at y=66 (the bulb neck) while
// y and height animate together so only the top edge rises.
const COLUMN_BOTTOM = 66;
const LOW_Y = 62;
const HIGH_Y = 16;

export function FillThermometer({
  width = 60,
  height = 60,
  color = "#ef4444",
  strokeColor = "#1f1f1f",
  backgroundColor = "#ffffff",
  isAnimating = true,
  duration = 2.5,
  ease = 'linear',
}: FillThermometerProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (isAnimating) {
      // Rise over ~85% of the cycle, then hold while the column fades out so
      // the loop restarts at the low mark without a visible snap.
      controls.start({
        y: [LOW_Y, HIGH_Y, HIGH_Y],
        height: [COLUMN_BOTTOM - LOW_Y, COLUMN_BOTTOM - HIGH_Y, COLUMN_BOTTOM - HIGH_Y],
        opacity: [1, 1, 0],
        transition: { duration, repeat: Infinity, ease, times: [0, 0.85, 1] },
      });
    } else {
      controls.stop();
      controls.set({ y: LOW_Y, height: COLUMN_BOTTOM - LOW_Y, opacity: 1 });
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
        <clipPath id={`fill-thermometer-clip-${width}`}>
          <rect x={46.5} y={13} width={7} height={53} rx={3.5} />
        </clipPath>
      </defs>
      {/* Stem */}
      <rect x={44} y={10} width={12} height={58} rx={6} fill={backgroundColor} stroke={strokeColor} strokeWidth={5} />
      {/* Bulb */}
      <circle cx={50} cy={78} r={13} fill={backgroundColor} stroke={strokeColor} strokeWidth={5} />
      {/* Neck bridge + bulb mercury */}
      <rect x={46.5} y={63} width={7} height={8} fill={color} />
      <circle cx={50} cy={78} r={9} fill={color} />
      {/* Rising column */}
      <g clipPath={`url(#fill-thermometer-clip-${width})`}>
        <motion.rect
          x={46.5}
          width={7}
          fill={color}
          initial={{ y: LOW_Y, height: COLUMN_BOTTOM - LOW_Y }}
          animate={controls}
        />
      </g>
      {/* Tick marks */}
      <line x1={62} y1={20} x2={67} y2={20} stroke={strokeColor} strokeWidth={3} strokeLinecap="round" />
      <line x1={62} y1={32} x2={67} y2={32} stroke={strokeColor} strokeWidth={3} strokeLinecap="round" />
      <line x1={62} y1={44} x2={67} y2={44} stroke={strokeColor} strokeWidth={3} strokeLinecap="round" />
      <line x1={62} y1={56} x2={67} y2={56} stroke={strokeColor} strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}
