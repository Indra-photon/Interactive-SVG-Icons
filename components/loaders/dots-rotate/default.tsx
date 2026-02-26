'use client';

import { motion } from 'framer-motion';

interface DotsRotateProps {
  width?: number;
  height?: number;
  color?: string;
  dotSize?: number;
  isAnimating?: boolean;
}

export function DotsRotate({ 
  width = 40,
  height = 46, // aspect-ratio 1.154 (40 * 1.154 ≈ 46)
  color = "currentColor",
  dotSize = 14, // 35% of 40px
  isAnimating = true
}: DotsRotateProps) {
  const easeInOutCubic = [0.645, 0.045, 0.355, 1] as const;

  // Dot positions forming a triangle
  const positions = [
    { x: width / 2, y: dotSize / 2 },        // Top center
    { x: dotSize / 2, y: height - dotSize / 2 },    // Bottom left
    { x: width - dotSize / 2, y: height - dotSize / 2 }  // Bottom right
  ];

  const dots = [
    { id: 0, startPos: 0 }, // Starts at top
    { id: 1, startPos: 1 }, // Starts at bottom left
    { id: 2, startPos: 2 }  // Starts at bottom right
  ];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {dots.map((dot) => {
        // Each dot rotates to next position (0→2, 1→0, 2→1)
        const nextPos = (dot.startPos + 2) % 3;
        
        return (
          <motion.circle
            key={dot.id}
            r={dotSize / 2}
            fill={color}
            animate={{
              cx: [positions[dot.startPos].x, positions[nextPos].x],
              cy: [positions[dot.startPos].y, positions[nextPos].y]
            }}
            transition={{
              duration: 1,
              repeat: isAnimating ? Infinity : 0,
              ease: easeInOutCubic,
              times: [0, 1]
            }}
          />
        );
      })}
    </svg>
  );
}