'use client';

import { motion } from 'motion/react';

export interface TrashIconDissolveProps {
  size?: number;
  color?: string;
  className?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: string | number[];
}

export function TrashIconDissolve({
  size = 24,
  color = 'currentColor',
  className = '',
  isAnimating = false,
  duration = 0.8,
  ease = 'easeOut',
}: TrashIconDissolveProps) {
  // Parts dissolve bottom-up; the stagger scales with duration
  const step = duration * 0.1875;

  const dissolveVariants = {
    idle: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    dissolving: {
      y: -8,
      opacity: 0,
      transition: {
        duration,
        ease: ease as any,
        repeat: Infinity,
        repeatDelay: 0.2
      }
    }
  };

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
    >
      {/* Animated lid - dissolves last (delay: 0.45s) */}
      <motion.path
        d="M4 7h16"
        animate={isAnimating ? "dissolving" : "idle"}
        variants={dissolveVariants}
        transition={{
          ...dissolveVariants.dissolving.transition,
          delay: step * 3
        }}
      />

      {/* Animated top handle - dissolves third (delay: 0.3s) */}
      <motion.path
        d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"
        animate={isAnimating ? "dissolving" : "idle"}
        variants={dissolveVariants}
        transition={{
          ...dissolveVariants.dissolving.transition,
          delay: step * 2
        }}
      />

      {/* Animated left vertical line - dissolves second (delay: 0.15s) */}
      <motion.path
        d="M10 11v6"
        animate={isAnimating ? "dissolving" : "idle"}
        variants={dissolveVariants}
        transition={{
          ...dissolveVariants.dissolving.transition,
          delay: step
        }}
      />

      {/* Animated right vertical line - dissolves second (delay: 0.15s) */}
      <motion.path
        d="M14 11v6"
        animate={isAnimating ? "dissolving" : "idle"}
        variants={dissolveVariants}
        transition={{
          ...dissolveVariants.dissolving.transition,
          delay: step
        }}
      />

      {/* Animated trash body - dissolves first (no delay) */}
      <motion.path
        d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
        animate={isAnimating ? "dissolving" : "idle"}
        variants={dissolveVariants}
        transition={{
          ...dissolveVariants.dissolving.transition,
          delay: 0
        }}
      />
    </svg>
  );
}