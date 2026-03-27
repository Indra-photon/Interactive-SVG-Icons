'use client';

import { motion } from 'framer-motion';

interface DotsBounceProps {
  width?: number;
  height?: number;
  color?: string;
  dotSize?: number;
  dotCount?: number;
  isAnimating?: boolean;
}

export function DotsBounce({
  width = 60,
  height = 30,
  color = "currentColor",
  dotSize = 8,
  dotCount = 3,
  isAnimating = true,
}: DotsBounceProps) {
  const dotRadius = dotSize / 2;
  const centerY = height / 2;
  const bounceHeight = height * 0.3;
  const totalDotsWidth = dotCount * dotSize;
  const spacing = (width - totalDotsWidth) / (dotCount + 1);

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
      {Array.from({ length: dotCount }).map((_, i) => {
        const cx = spacing * (i + 1) + dotSize * i + dotRadius;
        return (
          <motion.circle
            key={i}
            cx={cx}
            cy={centerY}
            r={dotRadius}
            fill={color}
            animate={{
              y: [0, -bounceHeight, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: isAnimating ? Infinity : 0,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </svg>
  );
}
