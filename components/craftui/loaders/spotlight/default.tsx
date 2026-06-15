'use client';

import { motion } from 'framer-motion';

interface SpotlightProps {
  width?: number;
  height?: number;
  color?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  repeatDelay?: number;
}

export function Spotlight({
  width = 200,
  height = 60,
  color = 'currentColor',
  isAnimating = true,
  duration = 2.0,
  ease = 'easeInOut',
  repeatDelay = 0.6,
}: SpotlightProps) {
  const gradientId = `spotlight-gradient-${width}-${height}`;

  // Spotlight oval: wide enough to feel like a beam, tall enough to glow
  const spotW = width * 0.45;
  const spotH = height * 0.7;

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
        {/* Radial gradient: bright center, fades to transparent at edges */}
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="45%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Animated spotlight oval drifting left → right, then reset */}
      <motion.ellipse
        cy={height / 2}
        rx={spotW / 2}
        ry={spotH / 2}
        fill={`url(#${gradientId})`}
        animate={{
          cx: isAnimating
            ? [-spotW / 2, width + spotW / 2]
            : -spotW / 2,
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
