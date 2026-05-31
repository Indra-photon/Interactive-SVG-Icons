'use client';

import { motion } from 'framer-motion';

interface GridRandomProps {
  width?: number;
  height?: number;
  color?: string;
  dotSize?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  gridSize?: number;
}

export function GridRandom({
  width = 100,
  height = 100,
  color = 'currentColor',
  dotSize = 16,
  isAnimating = true,
  duration = 1.4,
  ease = 'easeInOut',
  gridSize = 3,
}: GridRandomProps) {
  const n = Math.max(2, Math.min(6, gridSize));
  const stride = 100 / (n + 1);
  const dotRadius = Math.min(dotSize, stride * 0.85) / 2;

  // Seeded pseudo-random scatter for a consistent look
  let seed = 42;
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0x100000000;
  };
  const totalDots = n * n;
  const step = totalDots > 1 ? (duration * 0.69) / (totalDots - 1) : 0;
  const order = Array.from({ length: totalDots }, (_, i) => i);
  for (let i = totalDots - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const delays = order.map(pos => pos * step);

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
