'use client';

import { motion } from 'motion/react';

interface IosSpinnerPulseProps {
  width?: number;
  height?: number;
  color?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function IosSpinnerPulse({
  width = 100,
  height = 100,
  color = 'currentColor',
  isAnimating = true,
  duration = 1.0,
  ease = 'easeOut',
}: IosSpinnerPulseProps) {
  const count = 12;
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
      {Array.from({ length: count }).map((_, i) => (
        <motion.rect
          key={i}
          x={48.5}
          y={26}
          width={3}
          height={10}
          rx={1.5}
          fill={color}
          transform={`rotate(${(360 / count) * i}, 50, 50)`}
          animate={{ opacity: [0.1, 1, 0.35, 0.1] }}
          transition={{
            duration,
            repeat: isAnimating ? Infinity : 0,
            delay: i * (duration / count),
            ease: ease,
            times: [0, 0.08, 0.3, 1],
          }}
        />
      ))}
    </svg>
  );
}
