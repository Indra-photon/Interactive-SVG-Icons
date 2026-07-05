'use client';

import { motion } from 'motion/react';

interface PulseRingProps {
  width?: number;
  height?: number;
  color?: string;
  ringCount?: number;
  thickness?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function PulseRing({
  width = 60,
  height = 60,
  color = "currentColor",
  ringCount = 3,
  thickness = 3,
  isAnimating = true,
  duration = 1.5,
  ease = 'easeOut',
}: PulseRingProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = Math.min(width, height) * 0.15;
  const maxRadius = Math.min(width, height) * 0.45;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
    >
      {Array.from({ length: ringCount }).map((_, i) => (
        <motion.circle
          key={i}
          cx={centerX}
          cy={centerY}
          stroke={color}
          strokeWidth={thickness}
          fill="none"
          initial={{ r: baseRadius, opacity: 1 }}
          animate={{
            r: [baseRadius, maxRadius],
            opacity: [1, 0],
          }}
          transition={{
            duration,
            repeat: isAnimating ? Infinity : 0,
            delay: (duration / ringCount) * i,
            ease: ease,
          }}
        />
      ))}
    </svg>
  );
}