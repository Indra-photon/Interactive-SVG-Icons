'use client';

import { motion } from 'motion/react';

interface GridWaveRowProps {
  width?: number;
  height?: number;
  color?: string;
  dotSize?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  gridSize?: number;
}

export function GridWaveRow({
  width = 100,
  height = 100,
  color = 'currentColor',
  dotSize = 16,
  isAnimating = true,
  duration = 1.4,
  ease = 'easeInOut',
  gridSize = 3,
}: GridWaveRowProps) {
  const n = Math.max(2, Math.min(6, gridSize));
  const stride = 100 / (n + 1);
  const dotRadius = Math.min(dotSize, stride * 0.85) / 2;
  const totalCells = n * n;
  const waveStep = totalCells > 1 ? (duration * 0.57) / (totalCells - 1) : 0;

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
          const idx = row * n + col;
          const delay = idx * waveStep;
          return (
            <motion.circle
              key={`${row}-${col}`}
              cx={stride + col * stride}
              cy={stride + row * stride}
              fill={color}
              initial={{ r: dotRadius * 0.4, opacity: 0.15 }}
              animate={
                isAnimating
                  ? { r: [dotRadius * 0.4, dotRadius, dotRadius * 0.4], opacity: [0.15, 1, 0.15] }
                  : { r: dotRadius * 0.4, opacity: 0.15 }
              }
              transition={{ duration, repeat: isAnimating ? Infinity : 0, delay, ease, times: [0, 0.35, 1] }}
            />
          );
        })
      )}
    </svg>
  );
}
