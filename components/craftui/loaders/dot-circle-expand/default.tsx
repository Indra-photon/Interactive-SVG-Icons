'use client';

import { motion } from 'framer-motion';

interface DotCircleExpandProps {
  width?: number;
  height?: number;
  color?: string;
  centerDotSize?: number;
  cornerDotSize?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function DotCircleExpand({
  width = 40,
  height = 40,
  color = "currentColor",
  centerDotSize = 10,
  cornerDotSize = 9,
  isAnimating = true,
  duration = 1.5,
  ease = [0.3, 1, 0, 1],
}: DotCircleExpandProps) {
  const cx = width / 2;
  const cy = height / 2;
  const cornerR = cornerDotSize / 2;

  // Corner dot positions (centers)
  const quarterX = width * 0.25;
  const quarterY = height * 0.25;
  const threeQuarterX = width * 0.75;
  const threeQuarterY = height * 0.75;

  const cornerPositions = [
    { x: quarterX, y: quarterY },         // TL
    { x: threeQuarterX, y: quarterY },    // TR
    { x: threeQuarterX, y: threeQuarterY }, // BR
    { x: quarterX, y: threeQuarterY },    // BL
  ];

  const expandOffset = width * 0.18;
  const expandedPositions = [
    { x: quarterX - expandOffset, y: quarterY - expandOffset },
    { x: threeQuarterX + expandOffset, y: quarterY - expandOffset },
    { x: threeQuarterX + expandOffset, y: threeQuarterY + expandOffset },
    { x: quarterX - expandOffset, y: threeQuarterY + expandOffset },
  ];

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
      {/* Static center dot */}
      <circle cx={cx} cy={cy} r={centerDotSize / 2} fill={color} />
      {/* Animated corner dots */}
      {cornerPositions.map((pos, i) => (
        <motion.circle
          key={i}
          r={cornerR}
          fill={color}
          animate={{
            cx: [pos.x, expandedPositions[i].x, expandedPositions[i].x, pos.x],
            cy: [pos.y, expandedPositions[i].y, expandedPositions[i].y, pos.y],
          }}
          transition={{
            duration: duration,
            repeat: isAnimating ? Infinity : 0,
            times: [0, 0.33, 0.66, 1],
            ease: ease,
          }}
        />
      ))}
    </svg>
  );
}
