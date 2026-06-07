'use client';

import { motion } from 'framer-motion';

interface BreathProps {
  width?: number;
  height?: number;
  color?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function Breath({
  width = 100,
  height = 100,
  color = 'currentColor',
  isAnimating = true,
  duration = 4.0,
  ease = 'easeInOut',
}: BreathProps) {
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
      {/* Outer glow ring — slightly delayed */}
      <motion.circle
        cx={50}
        cy={50}
        stroke={color}
        strokeWidth={1}
        fill="none"
        animate={{
          r: [14, 28, 14],
          opacity: [0, 0.25, 0],
        }}
        transition={{
          duration: 4,
          repeat: isAnimating ? Infinity : 0,
          ease: ease,
          delay: 0.3,
          times: [0, 0.5, 1],
        }}
      />
      {/* Core breathing circle */}
      <motion.circle
        cx={50}
        cy={50}
        fill={color}
        animate={{
          r: [8, 20, 8],
          opacity: [0.25, 1, 0.25],
        }}
        transition={{
          duration: 4,
          repeat: isAnimating ? Infinity : 0,
          ease: ease,
          times: [0, 0.5, 1],
        }}
      />
    </svg>
  );
}
