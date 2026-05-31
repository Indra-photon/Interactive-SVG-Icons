'use client';

import { motion } from 'framer-motion';

interface AppDownloadProps {
  width?: number;
  height?: number;
  color?: string;
  trackOpacity?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  strokeWidth?: number;
  strokeLinecap?: 'round' | 'butt' | 'square';
  repeatDelay?: number;
}

export function AppDownload({
  width = 100,
  height = 100,
  color = 'currentColor',
  trackOpacity = 0.12,
  isAnimating = true,
  duration = 1.5,
  ease = 'easeInOut',
  strokeWidth = 5,
  strokeLinecap = 'round',
  repeatDelay = 0.4,
}: AppDownloadProps) {
  const r = 38;
  const circumference = 2 * Math.PI * r;

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
      {/* Faint background track */}
      <circle
        cx={50}
        cy={50}
        r={r}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        opacity={trackOpacity}
      />

      {/* Arc draws itself from 12 o'clock clockwise */}
      <motion.circle
        cx={50}
        cy={50}
        r={r}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        fill="none"
        transform="rotate(-90, 50, 50)"
        strokeDasharray={circumference}
        animate={{
          strokeDashoffset: isAnimating ? [circumference, 0] : circumference,
        }}
        transition={{
          duration: duration,
          repeat: isAnimating ? Infinity : 0,
          ease: ease,
          repeatDelay: repeatDelay,
        }}
      />
    </svg>
  );
}
