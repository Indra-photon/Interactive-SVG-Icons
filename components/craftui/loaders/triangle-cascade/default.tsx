'use client';

import { motion } from 'motion/react';

interface TriangleCascadeProps {
  width?: number;
  height?: number;
  color?: string;
  bars?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  strokeWidth?: number;
  staggerDelay?: number;
}

export function TriangleCascade({
  width = 80,
  height = 69,
  color = "currentColor",
  bars = 5,
  isAnimating = true,
  duration = 2.0,
  ease = 'easeInOut',
  strokeWidth = 1,
  staggerDelay = 0.4,
}: TriangleCascadeProps) {
  const barHeight = height / bars + 1;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
    >
      <defs>
        <clipPath id={`triangle-clip-${width}`}>
          <polygon points={`${width / 2},0 ${width},${height} 0,${height}`} />
        </clipPath>
      </defs>
      {/* Triangle outline */}
      <polygon
        points={`${width / 2},0 ${width},${height} 0,${height}`}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        opacity={0.2}
      />
      {/* Cascading bars clipped to triangle */}
      <g clipPath={`url(#triangle-clip-${width})`}>
        {Array.from({ length: bars }).map((_, i) => {
          const barY = height - (i + 1) * barHeight;
          return (
            <motion.rect
              key={i}
              x={0}
              width={width}
              height={barHeight}
              fill={color}
              animate={{
                y: [-barHeight, barY],
              }}
              transition={{
                duration: duration,
                repeat: isAnimating ? Infinity : 0,
                delay: i * staggerDelay,
                ease: ease,
                times: [0, 1],
              }}
            />
          );
        })}
      </g>
    </svg>
  );
}
