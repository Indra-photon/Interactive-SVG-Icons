'use client';

import { motion } from 'motion/react';

export interface TrashIconProps {
  size?: number;
  color?: string;
  className?: string;
  isAnimating?: boolean;
}

export function TrashIcon({
  size = 24,
  color = 'currentColor',
  className = '',
  isAnimating = false
}: TrashIconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      animate={isAnimating ? "shake" : "idle"}
      variants={{
        idle: {
          x: 0,
          transition: { duration: 0 }
        },
        shake: {
          x: [0, -2, 2, -2, 2, -1, 1, 0],
          transition: {
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 0.1,
            ease: "easeInOut"
          }
        }
      }}
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
    </motion.svg>
  );
}