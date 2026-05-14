'use client';

import { motion } from 'framer-motion';

interface GridPulseProps {
  width?: number;
  height?: number;
  color?: string;
  dotSize?: number;
  isAnimating?: boolean;
}

export function GridPulse({
  width = 100,
  height = 100,
  color = 'currentColor',
  dotSize = 16,
  isAnimating = true,
}: GridPulseProps) {
  const ROWS = 3;
  const COLS = 3;

  // Divide the 100×100 viewBox into 4 equal parts — dots sit at 25, 50, 75
  const stride = 100 / 4;
  const dotRadius = dotSize / 2;

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
      {Array.from({ length: ROWS }).map((_, row) =>
        Array.from({ length: COLS }).map((_, col) => {
          const cx = stride + col * stride; // 25, 50, 75
          const cy = stride + row * stride; // 25, 50, 75

          // Diagonal index drives the wave: top-left (0) → bottom-right (4)
          const diagonalDelay = (row + col) * 0.13;

          return (
            <motion.circle
              key={`${row}-${col}`}
              cx={cx}
              cy={cy}
              fill={color}
              animate={{
                r: [dotRadius * 0.4, dotRadius, dotRadius * 0.4],
                opacity: [0.15, 1, 0.15],
              }}
              transition={{
                duration: 1.6,
                repeat: isAnimating ? Infinity : 0,
                delay: diagonalDelay,
                ease: 'easeInOut',
                times: [0, 0.35, 1],
              }}
            />
          );
        })
      )}
    </svg>
  );
}
