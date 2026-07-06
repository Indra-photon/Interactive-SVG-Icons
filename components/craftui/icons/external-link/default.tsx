'use client';

import { motion } from 'motion/react';

export interface ExternalLinkDefaultProps {
  size?: number;
  color?: string;
  className?: string;
  isHovered?: boolean;
  duration?: number;
  ease?: string | number[];
  fillOpacity?: number;
}

export function IconExternalLinkDefault({
  size = 24,
  color = 'currentColor',
  className = '',
  isHovered = false,
  duration = 0.5,
  ease = 'easeInOut',
  fillOpacity = 0.2,
}: ExternalLinkDefaultProps) {
  // Arrow diagonal goes from (11, 13) → (20, 4) = 9px right, 9px up
  // Translation moves it further along that 45° diagonal, then bounces back
  const arrowTranslate = {
    idle: { x: 0, y: 0 },
    hover: {
      x: [0, 4, 0],
      y: [0, -4, 0],
      transition: {
        duration,
        ease: ease as any,
        times: [0, 0.5, 1],
      },
    },
  };

  const boxFill = {
    idle: { opacity: 0 },
    hover: {
      opacity: fillOpacity,
      transition: { duration: duration * 0.6, ease: 'easeOut' as const },
    },
  };

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

      {/* Box outline — always visible */}
      <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />

      {/* Box fill — fades in on hover */}
      <motion.path
        d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"
        fill={color}
        stroke="none"
        animate={isHovered ? 'hover' : 'idle'}
        variants={boxFill}
      />

      {/* Arrow (line + head) — translates diagonally up-right and back */}
      <motion.g
        animate={isHovered ? 'hover' : 'idle'}
        variants={arrowTranslate}
      >
        <path d="M11 13l9 -9" />
        <path d="M15 4h5v5" />
      </motion.g>
    </svg>
  );
}