'use client';

import { motion } from 'framer-motion';

interface AudioBarsSequentialProps {
  width?: number;
  height?: number;
  color?: string;
  barWidth?: number;
  gap?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function AudioBarsSequential({
  width = 60,
  height = 60,
  color = "currentColor",
  barWidth = 4,
  gap = 3,
  isAnimating = true,
  duration = 1.2,
  ease = 'easeInOut',
}: AudioBarsSequentialProps) {
  const barCount = 6;
  const totalWidth = (barCount * barWidth) + ((barCount - 1) * gap);
  const startX = (width - totalWidth) / 2;

  const minHeight = height * 0.3;
  const maxHeight = height * 0.8;
  const delayPerBar = duration / barCount; // Each bar triggers sequentially
  
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from({ length: barCount }).map((_, index) => {
        return (
          <motion.rect
            key={index}
            x={startX + (index * (barWidth + gap))}
            width={barWidth}
            fill={color}
            animate={{
              height: [minHeight, maxHeight, minHeight],
              y: [
                (height - minHeight) / 2, 
                (height - maxHeight) / 2, 
                (height - minHeight) / 2
              ]
            }}
            transition={{
              duration: duration,
              repeat: isAnimating ? Infinity : 0,
              ease: ease,
              delay: index * delayPerBar
            }}
          />
        );
      })}
    </svg>
  );
}