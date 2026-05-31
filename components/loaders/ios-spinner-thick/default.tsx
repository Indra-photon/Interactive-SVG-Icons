'use client';

import { motion } from 'framer-motion';

interface IosSpinnerThickProps {
  width?: number;
  height?: number;
  color?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function IosSpinnerThick({
  width = 100,
  height = 100,
  color = 'currentColor',
  isAnimating = true,
  duration = 1.0,
  ease = 'linear',
}: IosSpinnerThickProps) {
  const count = 8;

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
      <motion.g
        style={{ transformOrigin: '50px 50px' }}
        animate={{ rotate: isAnimating ? 360 : 0 }}
        transition={{ duration: 1, repeat: isAnimating ? Infinity : 0, ease: ease }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <rect
            key={i}
            x={46}
            y={22}
            width={8}
            height={16}
            rx={4}
            fill={color}
            opacity={1 - (i / count) * 0.88}
            transform={`rotate(${(360 / count) * i}, 50, 50)`}
          />
        ))}
      </motion.g>
    </svg>
  );
}
