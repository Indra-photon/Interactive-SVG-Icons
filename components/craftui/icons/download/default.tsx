'use client';

import { motion } from 'motion/react';

interface IconDownloadProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  strokeLinecap?: 'round' | 'butt' | 'square';
  isAnimating?: boolean;
  className?: string;
  duration?: number;
  ease?: string | number[];
}

export function IconDownload({
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.5,
  strokeLinecap = 'round',
  isAnimating = false,
  className = '',
  duration = 0.2,
  ease = 'linear',
}: IconDownloadProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.g
        animate={isAnimating ? 'bounce' : 'idle'}
        variants={{
          idle: { y: 0, transition: { duration: 0 } },
          bounce: {
            y: [0, 5, 0],
            transition: { duration, times: [0, 0.5, 1], ease: ease as any },
          },
        }}
      >
        <line x1="12" y1="14" x2="12" y2="4" />
        <polyline points="9,11 12,14 15,11" />
      </motion.g>
      <motion.polyline
        points="5,15 5,19 19,19 19,15"
        animate={isAnimating ? 'hit' : 'idle'}
        variants={{
          idle: { y: 0, transition: { duration: 0 } },
          hit: {
            y: [0, 0, 1.5, -0.4, 0],
            transition: {
              // Tray reacts after the arrow lands; keeps its ratio to the drop
              duration: duration * 2.25,
              times: [0, 0.22, 0.44, 0.7, 1],
              ease: 'easeOut',
            },
          },
        }}
      />
    </svg>
  );
}
