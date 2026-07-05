'use client';

import { motion } from 'motion/react';

interface BarsFadeProps {
  size?: number;
  color?: string;
  gap?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  staggerDelay?: number;
}

export function BarsFade({
  size = 40,
  color = "currentColor",
  gap = 4,
  isAnimating = true,
  duration = 1.2,
  ease = 'easeInOut',
  staggerDelay = 0.2,
}: BarsFadeProps) {
  const barWidth = (size - gap * 2) / 3;
  
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {[0, 1, 2].map((index) => (
        <motion.rect
          key={index}
          x={index * (barWidth + gap)}
          y={size / 4}
          width={barWidth}
          height={size / 2}
          fill={color}
          initial={{ opacity: 1 }}
          animate={{
            opacity: [1, 0.3, 1]
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