'use client';

import { motion } from 'motion/react';

interface GridCheckerProps {
  width?: number;
  height?: number;
  color?: string;
  dotSize?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  gridSize?: number;
}

export function GridChecker({
  width = 100,
  height = 100,
  color = 'currentColor',
  dotSize = 16,
  isAnimating = true,
  duration = 1.4,
  ease = 'easeInOut',
  gridSize = 3,
}: GridCheckerProps) {
  const n = Math.max(2, Math.min(6, gridSize));
  const stride = 100 / (n + 1);
  const dotRadius = Math.min(dotSize, stride * 0.85) / 2;

  // Checkerboard: alternating sets fire half a cycle apart
  const delays = Array.from({ length: n * n }, (_, i) => {
    const row = Math.floor(i / n), col = i % n;
    return (row + col) % 2 === 0 ? 0 : duration * 0.5;
  });

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
        Array.from({ length: n }).map((_, col) => (
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
              duration: duration,
              repeat: isAnimating ? Infinity : 0,
              delay: delays[row * n + col],
              ease: ease,
              times: [0, 0.35, 1],
            }}
          />
        ))
      )}
    </svg>
  );
}
