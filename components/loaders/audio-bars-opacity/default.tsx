'use client';

import { motion } from 'framer-motion';

interface AudioBarsOpacityProps {
  width?: number;
  height?: number;
  color?: string;
  barWidth?: number;
  gap?: number;
  isAnimating?: boolean;
}

export function AudioBarsOpacity({
  width = 60,
  height = 60,
  color = "currentColor",
  barWidth = 4,
  gap = 3,
  isAnimating = true
}: AudioBarsOpacityProps) {
  const barCount = 6;
  const totalWidth = (barCount * barWidth) + ((barCount - 1) * gap);
  const startX = (width - totalWidth) / 2;

  const minHeight = height * 0.3;
  const maxHeight = height * 0.8;
  
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from({ length: barCount }).map((_, index) => {
        const isOdd = index % 2 === 0;
        
        return (
          <motion.rect
            key={index}
            x={startX + (index * (barWidth + gap))}
            width={barWidth}
            fill={color}
            animate={{
              height: isOdd 
                ? [minHeight, maxHeight, minHeight]
                : [maxHeight, minHeight, maxHeight],
              y: isOdd
                ? [(height - minHeight) / 2, (height - maxHeight) / 2, (height - minHeight) / 2]
                : [(height - maxHeight) / 2, (height - minHeight) / 2, (height - maxHeight) / 2],
              opacity: isOdd
                ? [0.3, 1, 0.3]
                : [1, 0.3, 1]
            }}
            transition={{
              duration: 0.8,
              repeat: isAnimating ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </svg>
  );
}