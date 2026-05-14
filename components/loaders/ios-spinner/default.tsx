'use client';

import { motion } from 'framer-motion';

interface IosSpinnerProps {
  width?: number;
  height?: number;
  color?: string;
  isAnimating?: boolean;
}

export function IosSpinner({
  width = 100,
  height = 100,
  color = 'currentColor',
  isAnimating = true,
}: IosSpinnerProps) {
  const spokes = 12;

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
        transition={{
          duration: 1,
          repeat: isAnimating ? Infinity : 0,
          ease: 'linear',
        }}
      >
        {Array.from({ length: spokes }).map((_, i) => (
          <rect
            key={i}
            x={48.5}
            y={26}
            width={3}
            height={10}
            rx={1.5}
            fill={color}
            opacity={1 - (i / spokes) * 0.85}
            transform={`rotate(${(360 / spokes) * i}, 50, 50)`}
          />
        ))}
      </motion.g>
    </svg>
  );
}
