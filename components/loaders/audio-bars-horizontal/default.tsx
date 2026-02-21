'use client';

import { motion } from 'framer-motion';

interface AudioBarsHorizontalProps {
  width?: number;
  height?: number;
  color?: string;
  barWidth?: number;
  gap?: number;
  isAnimating?: boolean;
}

export function AudioBarsHorizontal({
  width = 60,
  height = 60,
  color = "currentColor",
  barWidth = 4,
  gap = 3,
  isAnimating = true
}: AudioBarsHorizontalProps) {
  const barCount = 6;
  const totalWidth = (barCount * barWidth) + ((barCount - 1) * gap);
  const startX = (width - totalWidth) / 2;

  const minHeight = height * 0.3; // 30% min
  const maxHeight = height * 0.8; // 80% max
  
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from({ length: barCount }).map((_, index) => {
        // Odd positions (0, 2, 4) go short->tall
        // Even positions (1, 3, 5) go tall->short
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
                : [(height - maxHeight) / 2, (height - minHeight) / 2, (height - maxHeight) / 2]
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