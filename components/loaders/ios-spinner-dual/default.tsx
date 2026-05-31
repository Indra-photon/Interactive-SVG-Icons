'use client';

import { motion } from 'framer-motion';

interface IosSpinnerDualProps {
  width?: number;
  height?: number;
  color?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function IosSpinnerDual({
  width = 100,
  height = 100,
  color = 'currentColor',
  isAnimating = true,
  duration = 1.2,
  ease = 'linear',
}: IosSpinnerDualProps) {
  const outer = { count: 12, y: 26, height: 10, width: 3 };
  const inner = { count: 8,  y: 34, height: 6,  width: 2.5 };

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
        transition={{ duration: duration, repeat: isAnimating ? Infinity : 0, ease: ease }}
      >
        {Array.from({ length: outer.count }).map((_, i) => (
          <rect
            key={i}
            x={50 - outer.width / 2}
            y={outer.y}
            width={outer.width}
            height={outer.height}
            rx={outer.width / 2}
            fill={color}
            opacity={1 - (i / outer.count) * 0.88}
            transform={`rotate(${(360 / outer.count) * i}, 50, 50)`}
          />
        ))}
      </motion.g>

      <motion.g
        style={{ transformOrigin: '50px 50px' }}
        animate={{ rotate: isAnimating ? -360 : 0 }}
        transition={{ duration: duration * 0.75, repeat: isAnimating ? Infinity : 0, ease: ease }}
      >
        {Array.from({ length: inner.count }).map((_, i) => (
          <rect
            key={i}
            x={50 - inner.width / 2}
            y={inner.y}
            width={inner.width}
            height={inner.height}
            rx={inner.width / 2}
            fill={color}
            opacity={1 - (i / inner.count) * 0.88}
            transform={`rotate(${(360 / inner.count) * i}, 50, 50)`}
          />
        ))}
      </motion.g>
    </svg>
  );
}
