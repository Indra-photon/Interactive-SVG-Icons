'use client';

import { motion } from 'framer-motion';

interface IosSpinnerDotsProps {
  width?: number;
  height?: number;
  color?: string;
  isAnimating?: boolean;
}

export function IosSpinnerDots({
  width = 100,
  height = 100,
  color = 'currentColor',
  isAnimating = true,
}: IosSpinnerDotsProps) {
  const count = 12;
  const orbitRadius = 22;

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
        transition={{ duration: 1, repeat: isAnimating ? Infinity : 0, ease: 'linear' }}
      >
        {Array.from({ length: count }).map((_, i) => {
          const angle = (2 * Math.PI * i) / count - Math.PI / 2;
          const cx = 50 + orbitRadius * Math.cos(angle);
          const cy = 50 + orbitRadius * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={3.5}
              fill={color}
              opacity={1 - (i / count) * 0.88}
            />
          );
        })}
      </motion.g>
    </svg>
  );
}
