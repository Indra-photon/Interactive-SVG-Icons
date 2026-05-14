'use client';

import { motion } from 'framer-motion';

interface ActivityRingsProps {
  width?: number;
  height?: number;
  color?: string;
  isAnimating?: boolean;
}

export function ActivityRings({
  width = 100,
  height = 100,
  color = 'currentColor',
  isAnimating = true,
}: ActivityRingsProps) {
  const rings = [
    { r: 38, speed: 2.4, opacity: 1 },
    { r: 27, speed: 1.8, opacity: 0.7 },
    { r: 16, speed: 1.2, opacity: 0.4 },
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
      {rings.map(({ r, speed, opacity }, i) => {
        const circumference = 2 * Math.PI * r;
        // Show 75% of the arc, hide 25%
        const dashArray = `${circumference * 0.75} ${circumference * 0.25}`;

        return (
          <g key={i}>
            {/* Faint track */}
            <circle
              cx={50}
              cy={50}
              r={r}
              stroke={color}
              strokeWidth={5}
              fill="none"
              opacity={0.1}
            />
            {/* Animated arc — rotates continuously */}
            <motion.g
              style={{ transformOrigin: 'center' }}
              initial={{ rotate: -90 }}
              animate={{ rotate: isAnimating ? 270 : -90 }}
              transition={{
                duration: speed,
                repeat: isAnimating ? Infinity : 0,
                ease: 'linear',
              }}
            >
              <circle
                cx={50}
                cy={50}
                r={r}
                stroke={color}
                strokeWidth={5}
                strokeDasharray={dashArray}
                strokeLinecap="round"
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
