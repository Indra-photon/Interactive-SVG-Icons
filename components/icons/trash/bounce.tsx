'use client';

import { motion } from 'motion/react';

export interface TrashIconBounceProps {
  size?: number;
  color?: string;
  className?: string;
  isAnimating?: boolean;
}

export function TrashIconBounce({
  size = 24,
  color = 'currentColor',
  className = '',
  isAnimating = false
}: TrashIconBounceProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ overflow: "visible" }}
    >
      {/* 1. THE LID (The Press) */}
      <motion.g
        animate={isAnimating ? { y: [0, 12, 0] } : { y: 0 }}
        transition={{
          duration: 0.6,
          repeat: isAnimating ? Infinity : 0,
          repeatDelay: 0.5,
          ease: "easeInOut",
        }}
      >
        <path d="M4 7h16" />
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
      </motion.g>

      {/* 2. THE CONTENTS (Vertical Lines) */}
      <motion.g
        animate={
          isAnimating
            ? { opacity: [1, 0, 1], scaleY: [1, 0, 1] }
            : { opacity: 1 }
        }
        style={{ transformOrigin: "bottom" }}
        transition={{
          duration: 0.6,
          repeat: isAnimating ? Infinity : 0,
          repeatDelay: 0.5,
          times: [0, 0.4, 1],
        }}
      >
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </motion.g>

      {/* 3. THE BIN BODY (The Displacement) */}
      <motion.path
        d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
        animate={
          isAnimating
            ? {
                scaleY: [1, 0.5, 1],
                scaleX: [1, 1.15, 1],
              }
            : { scaleY: 1, scaleX: 1 }
        }
        style={{
          transformOrigin: "bottom",
          transformBox: "fill-box",
        }}
        transition={{
          duration: 0.6,
          repeat: isAnimating ? Infinity : 0,
          repeatDelay: 0.5,
          ease: "easeInOut",
        }}
      />
    </svg>
  );
}