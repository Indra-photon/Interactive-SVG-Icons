'use client';

import { motion } from 'framer-motion';

interface BarsBounceProps {
  width?: number;
  height?: number;
  color?: string;
  barWidth?: number;
  gap?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function BarsBounce({ 
  width = 45,
  height = 45, 
  color = "currentColor",
  barWidth = 9,
  gap = 9,
  isAnimating = true,
  duration = 1.0,
  ease = 'easeInOut',
}: BarsBounceProps) {
  const bars = [
    { x: 0 },
    { x: barWidth + gap },
    { x: (barWidth + gap) * 2 }
  ];

  // Height animation: 100% -> 40% -> 100%
  const tallHeight = height;
  const shortHeight = height * 0.4;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {bars.map((bar, index) => {
        // Position pattern: [top, bottom, top] -> [bottom, top, bottom]
        const isFirstOrLast = index === 0 || index === 2;
        
        return (
          <motion.rect
            key={index}
            x={bar.x}
            width={barWidth}
            fill={color}
            animate={{
              // All bars: tall -> short -> tall (synchronized)
              height: [tallHeight, shortHeight, tallHeight],
              // Bars 0,2: top->bottom | Bar 1: bottom->top
              y: isFirstOrLast 
                ? [0, height - shortHeight, height - tallHeight]
                : [height - tallHeight, 0, height - tallHeight]
            }}
            transition={{
              duration: duration,
              repeat: isAnimating ? Infinity : 0,
              ease: ease,
              times: [0, 0.5, 1] // Keyframe timing: 0%, 50%, 100%
            }}
          />
        );
      })}
    </svg>
  );
}