'use client';

import { motion } from 'motion/react';

interface GridPulseProps {
  width?: number;
  height?: number;
  color?: string;
  dotSize?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  gridSize?: number;
}

export function GridPulse({
  width = 100,
  height = 100,
  color = 'currentColor',
  dotSize = 16,
  isAnimating = true,
  duration = 1.6,
  ease = 'easeInOut',
  gridSize = 3,
}: GridPulseProps) {
  const n = Math.max(2, Math.min(6, gridSize));
  const stride = 100 / (n + 1);
  const dotRadius = Math.min(dotSize, stride * 0.85) / 2;

  // Diagonal wave: top-left fires first, bottom-right last
  const maxDiag = (n - 1) * 2;
  const diagStep = maxDiag > 0 ? (duration * 0.55) / maxDiag : 0;

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
      {Array.from({ length: n }).map((_, row) =>
        Array.from({ length: n }).map((_, col) => {
          const cx = stride + col * stride;
          const cy = stride + row * stride;
          const diagonalDelay = (row + col) * diagStep;

          return (
            <motion.circle
              key={`${row}-${col}`}
              cx={cx}
              cy={cy}
              fill={color}
              initial={{ r: dotRadius * 0.4, opacity: 0.15 }}
              animate={{
                r: [dotRadius * 0.4, dotRadius, dotRadius * 0.4],
                opacity: [0.15, 1, 0.15],
              }}
              transition={{
                duration: duration,
                repeat: isAnimating ? Infinity : 0,
                delay: diagonalDelay,
                ease: ease,
                times: [0, 0.35, 1],
              }}
            />
          );
        })
      )}
    </svg>
  );
}
