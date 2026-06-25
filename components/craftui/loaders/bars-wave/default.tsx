'use client';

import { motion } from 'motion/react';

interface BarsWaveProps {
  width?: number;
  height?: number;
  color?: string;
  barWidth?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function BarsWave({
  width = 100,
  height = 100,
  color = "currentColor",
  barWidth = 3,
  isAnimating = true,
  duration = 1.0,
  ease = 'easeInOut',
}: BarsWaveProps) {
  const bars = [
    { x: 0, delay: 0 },
    { x: 10, delay: 0.1 },
    { x: 20, delay: 0.3 },
    { x: 30, delay: 0.5 },
    { x: 40, delay: 0.1 }
  ];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 100 100`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {bars.map((bar, index) => (
        <motion.rect
          key={index}
          x={bar.x}
          width={barWidth}
          fill={color}
          initial={{ height: 30, y: 70 }}
          animate={isAnimating ? { height: [30, 100, 30], y: [70, 0, 70] } : { height: 30, y: 70 }}
          transition={{ duration, repeat: isAnimating ? Infinity : 0, ease, delay: bar.delay }}
        />
      ))}
    </svg>
  );
}
