'use client';

import { motion } from 'framer-motion';

interface AppDownloadProps {
  width?: number;
  height?: number;
  color?: string;
  trackOpacity?: number;
  isAnimating?: boolean;
}

export function AppDownload({
  width = 100,
  height = 100,
  color = 'currentColor',
  trackOpacity = 0.12,
  isAnimating = true,
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
        strokeWidth={5}
        fill="none"
        opacity={trackOpacity}
      />

      {/* Arc draws itself from 12 o'clock clockwise */}
      <motion.circle
        cx={50}
        cy={50}
        r={r}
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
        transform="rotate(-90, 50, 50)"
        strokeDasharray={circumference}
        animate={{
          strokeDashoffset: isAnimating ? [circumference, 0] : circumference,
        }}
        transition={{
          duration: 1.5,
          repeat: isAnimating ? Infinity : 0,
          ease: 'easeInOut',
          repeatDelay: 0.4,
        }}
      />
    </svg>
  );
}
