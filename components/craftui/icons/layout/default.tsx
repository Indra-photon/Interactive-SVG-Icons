'use client';

import { motion } from 'motion/react';

export interface LayoutDashboardIconProps {
  size?: number;
  color?: string;
  className?: string;
  isHovered?: boolean;
  duration?: number;
  ease?: string | number[];
}

export function IconLayoutDashboard({
  size = 24,
  color = 'currentColor',
  className = '',
  isHovered = false,
  duration = 0.3,
  ease = 'easeInOut',
}: LayoutDashboardIconProps) {
  // Default (idle): top-left + bottom-right filled
  // Hover:          top-right + bottom-left filled
  const filledOpacity = 1;
  const emptyOpacity = 0;

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

      {/* Top-left — tall panel: filled on idle, empty on hover */}
      <motion.path
        d="M5 4h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1"
        fill={color}
        animate={{ fillOpacity: isHovered ? emptyOpacity : filledOpacity }}
        transition={transition}
      />

      {/* Bottom-left — short panel: empty on idle, filled on hover */}
      <motion.path
        d="M5 16h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1"
        fill={color}
        animate={{ fillOpacity: isHovered ? filledOpacity : emptyOpacity }}
        transition={transition}
      />

      {/* Bottom-right — tall panel: filled on idle, empty on hover */}
      <motion.path
        d="M15 12h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1"
        fill={color}
        animate={{ fillOpacity: isHovered ? emptyOpacity : filledOpacity }}
        transition={transition}
      />

      {/* Top-right — short panel: empty on idle, filled on hover */}
      <motion.path
        d="M15 4h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1"
        fill={color}
        animate={{ fillOpacity: isHovered ? filledOpacity : emptyOpacity }}
        transition={transition}
      />
    </svg>
  );
}