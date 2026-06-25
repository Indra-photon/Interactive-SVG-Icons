'use client';

import { motion } from 'motion/react';

interface SquareCornersDanceProps {
  width?: number;
  height?: number;
  color?: string;
  cornerSize?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function SquareCornersDance({
  width = 40,
  height = 40,
  color = "currentColor",
  cornerSize = 16,
  isAnimating = true,
  duration = 1.5,
  ease = [0.3, 1, 0, 1],
}: SquareCornersDanceProps) {
  const gap = Math.min(width, height) - cornerSize * 2;
  // Corners: TL, TR, BR, BL - clockwise rotation positions
  // Initial: TL, TR, BR, BL
  // After rotate: TR, BR, BL, TL
  const positions = [
    { x: 0, y: 0 },                             // TL
    { x: width - cornerSize, y: 0 },            // TR
    { x: width - cornerSize, y: height - cornerSize }, // BR
    { x: 0, y: height - cornerSize },           // BL
  ];

  // Rotated positions (clockwise)
  const rotatedPositions = [
    positions[1], // TL -> TR
    positions[2], // TR -> BR
    positions[3], // BR -> BL
    positions[0], // BL -> TL
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
      {positions.map((pos, i) => (
        <motion.rect
          key={i}
          width={cornerSize}
          height={cornerSize}
          fill={color}
          rx={2}
          animate={{
            x: [pos.x, pos.x, rotatedPositions[i].x, rotatedPositions[i].x],
            y: [pos.y, pos.y, rotatedPositions[i].y, rotatedPositions[i].y],
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
