'use client';

import { motion } from 'framer-motion';

interface AudioBarsGlowProps {
  width?: number;
  height?: number;
  color?: string;
  barWidth?: number;
  gap?: number;
  isAnimating?: boolean;
}

export function AudioBarsGlow({
  width = 60,
  height = 60,
  color = "#000000", // Default black for gradient
  barWidth = 4,
  gap = 3,
  isAnimating = true
}: AudioBarsGlowProps) {
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
      <defs>
        {/* Gradient definition */}
        <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="50%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
        
        {/* Glow filter */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {Array.from({ length: barCount }).map((_, index) => {
        const isOdd = index % 2 === 0;
        
        return (
          <motion.rect
            key={index}
            x={startX + (index * (barWidth + gap))}
            width={barWidth}
            fill="url(#barGradient)"
            filter="url(#glow)"
            animate={{
              height: isOdd 
                ? [minHeight, maxHeight, minHeight]
                : [maxHeight, minHeight, maxHeight],
              y: isOdd
                ? [(height - minHeight) / 2, (height - maxHeight) / 2, (height - minHeight) / 2]
                : [(height - maxHeight) / 2, (height - minHeight) / 2, (height - maxHeight) / 2],
              opacity: isOdd
                ? [0.5, 1, 0.5]
                : [1, 0.5, 1]
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