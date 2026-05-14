'use client';

import { motion } from 'framer-motion';

interface GridSnakeProps {
  width?: number;
  height?: number;
  color?: string;
  dotSize?: number;
  isAnimating?: boolean;
}

export function GridSnake({
  width = 100,
  height = 100,
  color = 'currentColor',
  dotSize = 16,
  isAnimating = true,
}: GridSnakeProps) {
  const stride = 100 / 4;
  const dotRadius = dotSize / 2;

  // Boustrophedon: row 0 L→R, row 1 R→L, row 2 L→R
  const delays = [
    0,    0.12, 0.24,
    0.60, 0.48, 0.36,
    0.72, 0.84, 0.96,
  ];

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
      {Array.from({ length: 3 }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <motion.circle
            key={`${row}-${col}`}
            cx={stride + col * stride}
            cy={stride + row * stride}
            fill={color}
            animate={{
              r: [dotRadius * 0.4, dotRadius, dotRadius * 0.4],
              opacity: [0.15, 1, 0.15],
            }}
            transition={{
              duration: 1.4,
              repeat: isAnimating ? Infinity : 0,
              delay: delays[row * 3 + col],
              ease: 'easeInOut',
              times: [0, 0.35, 1],
            }}
          />
        ))
      )}
    </svg>
  );
}
