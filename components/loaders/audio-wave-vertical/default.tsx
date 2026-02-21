'use client';

import { motion } from 'framer-motion';

interface AudioWaveVerticalProps {
  width?: number;
  height?: number;
  color?: string;
  barWidth?: number;
  gap?: number;
  barCount?: number;
  isAnimating?: boolean;
}

export function AudioWaveVertical({
  width = 60,
  height = 60,
  color = "currentColor",
  barWidth = 3,
  gap = 3,
  barCount = 5,
  isAnimating = true
}: AudioWaveVerticalProps) {
  const totalWidth = (barCount * barWidth) + ((barCount - 1) * gap);
  const startX = (width - totalWidth) / 2;

  // Define different height ranges for each bar (center is tallest)
  const bars = Array.from({ length: barCount }, (_, i) => {
    const distanceFromCenter = Math.abs(i - Math.floor(barCount / 2));
    const minHeight = height * 0.2; // 20% min
    const maxHeight = height * (0.9 - distanceFromCenter * 0.15); // Center is tallest
    
    return {
      minHeight,
      maxHeight,
      duration: 0.6 + Math.random() * 0.4, // 0.6-1.0s
      delay: i * 0.1 // Staggered
    };
  });
  
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {bars.map((bar, index) => (
        <motion.rect
          key={index}
          x={startX + (index * (barWidth + gap))}
          width={barWidth}
          fill={color}
          animate={{
            height: [bar.minHeight, bar.maxHeight, bar.minHeight],
            y: [(height - bar.minHeight) / 2, (height - bar.maxHeight) / 2, (height - bar.minHeight) / 2]
          }}
          transition={{
            duration: bar.duration,
            repeat: isAnimating ? Infinity : 0,
            ease: "easeInOut",
            delay: bar.delay
          }}
        />
      ))}
    </svg>
  );
}