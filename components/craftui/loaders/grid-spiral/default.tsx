'use client';

import { motion } from 'motion/react';

interface GridSpiralProps {
  width?: number;
  height?: number;
  color?: string;
  dotSize?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  gridSize?: number;
}

export function GridSpiral({
  width = 100,
  height = 100,
  color = 'currentColor',
  dotSize = 16,
  isAnimating = true,
  duration = 1.4,
  ease = 'easeInOut',
  gridSize = 3,
}: GridSpiralProps) {
  const n = Math.max(2, Math.min(6, gridSize));
  const stride = 100 / (n + 1);
  const dotRadius = Math.min(dotSize, stride * 0.85) / 2;

  // Clockwise spiral from top-left corner
  const spiralOrder = new Array(n * n).fill(0);
  let top = 0, bottom = n - 1, left = 0, right = n - 1, seq = 0;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) spiralOrder[top * n + c] = seq++;
    top++;
    for (let r = top; r <= bottom; r++) spiralOrder[r * n + right] = seq++;
    right--;
    if (top <= bottom) { for (let c = right; c >= left; c--) spiralOrder[bottom * n + c] = seq++; bottom--; }
    if (left <= right) { for (let r = bottom; r >= top; r--) spiralOrder[r * n + left] = seq++; left++; }
  }
  const spiralMax = n * n - 1;
  const spiralStep = spiralMax > 0 ? (duration * 0.69) / spiralMax : 0;
  const delays = spiralOrder.map(pos => pos * spiralStep);

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
            initial={{ r: dotRadius * 0.4, opacity: 0.15 }}
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
