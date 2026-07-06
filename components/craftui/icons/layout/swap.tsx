'use client';

import { motion } from 'motion/react';

export interface LayoutDashboardSwapProps {
  size?: number;
  color?: string;
  className?: string;
  isHovered?: boolean;
  duration?: number;
  ease?: string | number[];
}

// Idle state: top-left (tall) + bottom-right (tall) are filled
// Hover state: filled boxes morph into bottom-left (short) + top-right (short)

const paths = {
  topLeftTall:    'M5 4h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1',
  bottomLeftShort:'M5 16h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1',
  bottomRightTall:'M15 12h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1',
  topRightShort:  'M15 4h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1',
};

export function IconLayoutDashboardSwap({
  size = 24,
  color = 'currentColor',
  className = '',
  isHovered = false,
  duration = 0.4,
  ease = 'easeInOut',
}: LayoutDashboardSwapProps) {
  const transition = { duration, ease: ease as any };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />

      {/* Static stroke outlines — always visible */}
      <path d={paths.topLeftTall} />
      <path d={paths.bottomLeftShort} />
      <path d={paths.bottomRightTall} />
      <path d={paths.topRightShort} />

      {/* Filled box 1: morphs from top-left tall → bottom-left short */}
      <motion.path
        fill={color}
        stroke="none"
        animate={{ d: isHovered ? paths.bottomLeftShort : paths.topLeftTall }}
        transition={transition}
      />

      {/* Filled box 2: morphs from bottom-right tall → top-right short */}
      <motion.path
        fill={color}
        stroke="none"
        animate={{ d: isHovered ? paths.topRightShort : paths.bottomRightTall }}
        transition={transition}
      />
    </svg>
  );
}