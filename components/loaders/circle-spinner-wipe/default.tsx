'use client';

import { motion } from 'framer-motion';

interface CircleSpinnerWipeProps {
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  thickness?: number;
  isAnimating?: boolean;
}

export function CircleSpinnerWipe({
  width = 60,
  height = 60,
  color = "currentColor",
  backgroundColor = "#dddddd",
  thickness = 10,
  isAnimating = true,
}: CircleSpinnerWipeProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - thickness / 2;
  const circumference = 2 * Math.PI * radius;

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
      {/* Background track circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        stroke={backgroundColor}
        strokeWidth={thickness}
        fill="none"
      />
      {/* Animated wipe circle - starts from top (rotated -90deg) */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={radius}
        stroke={color}
        strokeWidth={thickness}
        fill="none"
        strokeLinecap="butt"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{
          strokeDashoffset: isAnimating ? [circumference, 0] : circumference,
        }}
        transition={{
          strokeDashoffset: {
            duration: 2,
            repeat: isAnimating ? Infinity : 0,
            ease: 'linear',
          },
        }}
        style={{ transformOrigin: `${centerX}px ${centerY}px`, rotate: -90 }}
      />
    </svg>
  );
}
