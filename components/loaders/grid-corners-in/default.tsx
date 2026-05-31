'use client';

import { motion } from 'framer-motion';

interface GridCornersInProps {
  width?: number;
  height?: number;
  color?: string;
  dotSize?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  gridSize?: number;
}

export function GridCornersIn({
  width = 100,
  height = 100,
  color = 'currentColor',
  dotSize = 16,
  isAnimating = true,
  duration = 1.4,
  ease = 'easeInOut',
  gridSize = 3,
}: GridCornersInProps) {
  const n = Math.max(2, Math.min(6, gridSize));
  const stride = 100 / (n + 1);
  const dotRadius = Math.min(dotSize, stride * 0.85) / 2;

  // Corners fire first; inward wave via Manhattan distance to nearest corner
  const corners = [[0, 0], [0, n - 1], [n - 1, 0], [n - 1, n - 1]] as const;
  const maxDist = Math.max(1, Math.floor((n - 1) / 2) * 2);
  const step = (duration * 0.43) / maxDist;
  const delays = Array.from({ length: n * n }, (_, i) => {
    const row = Math.floor(i / n), col = i % n;
    const dist = Math.min(...corners.map(([cr, cc]) => Math.abs(row - cr) + Math.abs(col - cc)));
    return dist * step;
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
