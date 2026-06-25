'use client';

import { motion } from 'motion/react';

interface DownloadBounceProps {
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function DownloadBounce({
  width = 48,
  height = 48,
  color = 'currentColor',
  strokeWidth = 1.5,
  isAnimating = true,
  duration = 1.0,
  ease = 'easeInOut',
}: DownloadBounceProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.g
        animate={{ y: [0, 5, 0] }}
        transition={{
          duration,
          repeat: isAnimating ? Infinity : 0,
          ease,
          times: [0, 0.5, 1],
        }}
      >
        <line x1="12" y1="14" x2="12" y2="4" />
        <polyline points="9,11 12,14 15,11" />
      </motion.g>
      <motion.polyline
        points="5,15 5,19 19,19 19,15"
        animate={{ y: [0, 0, 1.5, -0.4, 0] }}
        transition={{
          duration,
          repeat: isAnimating ? Infinity : 0,
          ease: 'easeOut',
          times: [0, 0.5, 0.65, 0.82, 1],
        }}
      />
    </svg>
  );
}
