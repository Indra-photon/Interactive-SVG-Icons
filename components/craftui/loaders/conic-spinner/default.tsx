'use client';

import { motion } from 'framer-motion';

interface ConicSpinnerProps {
  width?: number;
  height?: number;
  color?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function ConicSpinner({
  width = 60,
  height = 60,
  color = "currentColor",
  isAnimating = true,
  duration = 2.0,
  ease = 'linear',
}: ConicSpinnerProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 2;
  const circumference = 2 * Math.PI * radius;

  // 8 steps, each 12.5% of duration fills 45deg more
  const dashSteps = Array.from({ length: 9 }).map((_, i) => {
    return (circumference * i) / 8;
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
    >
      {/* Background circle */}
      <circle cx={centerX} cy={centerY} r={radius} fill="none" />
      {/* Filling arc using strokeDasharray */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill={color}
        stroke="none"
        animate={{
          clipPath: [
            `polygon(50% 50%, 50% 0%, 50% 0%)`,
            `polygon(50% 50%, 50% 0%, 100% 0%)`,
            `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%)`,
            `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%)`,
            `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)`,
            `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)`,
          ],
        }}
        transition={{
          duration: duration,
          repeat: isAnimating ? Infinity : 0,
          times: [0, 0.25, 0.5, 0.75, 0.875, 1],
          ease: ease,
        }}
      />
    </svg>
  );
}
