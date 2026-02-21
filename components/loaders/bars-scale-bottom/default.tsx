'use client';

import { motion } from 'framer-motion';

interface BarsScaleBottomProps {
  width?: number;
  height?: number;
  color?: string;
  gap?: number;
  isAnimating?: boolean;
}

export function BarsScaleBottom({
  width = 40,
  height = 40,
  color = "currentColor",
  gap = 4,
  isAnimating = true
}: BarsScaleBottomProps) {
  const barWidth = (width - gap * 2) / 3;
  const baseHeight = height / 2;
  const minHeight = height / 4;
  
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
          width={barWidth}
          fill={color}
          animate={{
            height: [baseHeight, minHeight, baseHeight],
            y: [height / 4, height - minHeight, height / 4]
          }}
          transition={{
            duration: 1,
            repeat: isAnimating ? Infinity : 0,
            ease: "easeInOut",
            delay: index * 0.15
          }}
        />
      ))}
    </svg>
  );
}