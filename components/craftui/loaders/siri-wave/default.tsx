'use client';

import { motion } from 'motion/react';

interface SiriWaveProps {
  width?: number;
  height?: number;
  color?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function SiriWave({
  width = 100,
  height = 100,
  color = 'currentColor',
  isAnimating = true,
  duration = 1.2,
  ease = 'easeInOut',
}: SiriWaveProps) {
  const barWidth = 6;
  const barRx = 3;

  // 5 bars: center tallest, outer shortest
  const bars = [
    { cx: 26, maxH: 22, delay: 0.2 },
    { cx: 38, maxH: 32, delay: 0.1 },
    { cx: 50, maxH: 40, delay: 0   },
    { cx: 62, maxH: 32, delay: 0.1 },
    { cx: 74, maxH: 22, delay: 0.2 },
  ];

  const minH = 6;

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
      {bars.map(({ cx, maxH, delay }, i) => (
        <motion.rect
          key={i}
          x={cx - barWidth / 2}
          rx={barRx}
          width={barWidth}
          fill={color}
          animate={{
            height: [minH, maxH, minH],
            y: [50 - minH / 2, 50 - maxH / 2, 50 - minH / 2],
          }}
          transition={{
            duration: duration,
            repeat: isAnimating ? Infinity : 0,
            delay,
            ease: ease,
            times: [0, 0.5, 1],
          }}
        />
      ))}
    </svg>
  );
}
