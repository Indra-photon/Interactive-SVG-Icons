'use client';

import { motion } from 'motion/react';

interface BarsScaleProps {
  width?: number;
  height?: number;
  color?: string;
  gap?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  staggerDelay?: number;
}

export function BarsScale({
  width = 40,
  height = 40,
  color = "currentColor",
  gap = 4,
  isAnimating = true,
  duration = 1.0,
  ease = 'easeInOut',
  staggerDelay = 0.15,
}: BarsScaleProps) {
  const barWidth = (width - gap * 2) / 3;
  
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {[0, 1, 2].map((index) => (
        <motion.rect
          key={index}
          x={index * (barWidth + gap)}
          y={height / 4}
          width={barWidth}
          height={height / 2}
          fill={color}
          animate={{
            scaleY: [1, 0.5, 1],
            y: [height / 4, height / 2 - height / 8, height / 4]
          }}
          transition={{
            duration: duration,
            repeat: isAnimating ? Infinity : 0,
            ease: ease,
            delay: index * staggerDelay
          }}
        />
      ))}
    </svg>
  );
}