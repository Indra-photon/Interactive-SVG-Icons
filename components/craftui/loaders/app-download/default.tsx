'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

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

  const controls = useAnimation();

  useEffect(() => {
    if (isAnimating) {
      controls.start({
        strokeDashoffset: [circumference, 0],
        transition: { duration, repeat: Infinity, ease, repeatDelay },
      });
    } else {
      controls.stop();
      controls.set({ strokeDashoffset: circumference });
    }
  }, [isAnimating, duration, ease, repeatDelay, circumference, controls]);

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
        initial={{ strokeDashoffset: circumference }}
        animate={controls}
      />
    </svg>
  );
}
