'use client';

import { motion } from 'motion/react';

interface ActivityRingsProps {
  width?: number;
  height?: number;
  color?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  strokeWidth?: number;
  strokeLinecap?: 'round' | 'butt' | 'square';
}

export function ActivityRings({
  width = 100,
  height = 100,
  color = 'currentColor',
  isAnimating = true,
  duration = 2.4,
  ease = 'linear',
  strokeWidth = 5,
  strokeLinecap = 'round',
}: ActivityRingsProps) {
  const rings = [
    { r: 38, speed: duration, opacity: 1 },
    { r: 27, speed: duration * 0.75, opacity: 0.7 },
    { r: 16, speed: duration * 0.5, opacity: 0.4 },
  ];

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
      {rings.map(({ r, opacity, speed }, i) => {
        const circumference = 2 * Math.PI * r;
        const dashArray = `${circumference * 0.75} ${circumference * 0.25}`;

        return (
          <g key={i}>
            <circle
              cx={50}
              cy={50}
              r={r}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              opacity={0.1}
            />
            <motion.g
              style={{ transformOrigin: 'center' }}
              initial={{ rotate: -90 }}
              animate={isAnimating ? { rotate: 270 } : { rotate: -90 }}
              transition={{ duration: speed, repeat: isAnimating ? Infinity : 0, ease, repeatType: 'loop' }}
            >
              <circle
                cx={50}
                cy={50}
                r={r}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                strokeLinecap={strokeLinecap}
                fill="none"
                opacity={opacity}
              />
            </motion.g>
          </g>
        );
      })}
    </svg>
  );
}
