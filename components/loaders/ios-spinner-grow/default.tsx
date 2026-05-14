'use client';

import { motion } from 'framer-motion';

interface IosSpinnerGrowProps {
  width?: number;
  height?: number;
  color?: string;
  isAnimating?: boolean;
}

export function IosSpinnerGrow({
  width = 100,
  height = 100,
  color = 'currentColor',
  isAnimating = true,
}: IosSpinnerGrowProps) {
  const count = 12;
  const duration = 1;

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
      {Array.from({ length: count }).map((_, i) => (
        <g key={i} transform={`rotate(${(360 / count) * i}, 50, 50)`}>
          <motion.rect
            x={48.5}
            width={3}
            rx={1.5}
            fill={color}
            animate={{
              y: [34, 26, 34],
              height: [4, 12, 4],
              opacity: [0.1, 1, 0.1],
            }}
            transition={{
              duration,
              repeat: isAnimating ? Infinity : 0,
              delay: i * (duration / count),
              ease: 'easeInOut',
              times: [0, 0.3, 1],
            }}
          />
        </g>
      ))}
    </svg>
  );
}
