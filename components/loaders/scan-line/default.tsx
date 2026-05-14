'use client';

import { motion } from 'framer-motion';

interface ScanLineProps {
  width?: number;
  height?: number;
  color?: string;
  trailLength?: number;
  isAnimating?: boolean;
}

export function ScanLine({
  width = 200,
  height = 4,
  color = 'currentColor',
  trailLength = 80,
  isAnimating = true,
}: ScanLineProps) {
  const gradientId = `scan-gradient-${width}-${height}`;

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
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="60%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Faint background track */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={color}
        opacity={0.12}
        rx={height / 2}
      />

      {/* Gradient segment sweeping left to right */}
      <motion.rect
        y={0}
        width={trailLength}
        height={height}
        rx={height / 2}
        fill={`url(#${gradientId})`}
        animate={{ x: isAnimating ? [-trailLength, width] : -trailLength }}
        transition={{
          duration: 1.4,
          repeat: isAnimating ? Infinity : 0,
          ease: 'linear',
          repeatDelay: 0.4,
        }}
      />
    </svg>
  );
}
