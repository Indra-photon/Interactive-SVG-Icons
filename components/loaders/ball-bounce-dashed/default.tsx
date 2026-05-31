'use client';

import { motion } from 'framer-motion';

interface BallBounceDashedProps {
  width?: number;
  height?: number;
  color?: string;
  lineColor?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  strokeWidth?: number;
}

export function BallBounceDashed({
  width = 90,
  height = 45,
  color = "currentColor",
  lineColor = "currentColor",
  isAnimating = true,
  duration = 0.75,
  ease = 'linear',
  strokeWidth = 3,
}: BallBounceDashedProps) {
  const ballRadius = height * 0.15;
  const ballCY = height - ballRadius - 1.5;
  const dashLength = width * 0.5;

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
      {/* Animated dashed ground line */}
      <motion.line
        x1={0}
        y1={height - 1.5}
        x2={width}
        y2={height - 1.5}
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dashLength} ${dashLength}`}
        animate={{
          strokeDashoffset: [0, -width],
        }}
        transition={{
          duration: duration,
          repeat: isAnimating ? Infinity : 0,
          ease: ease,
        }}
      />
      {/* Ball bounces in place */}
      <motion.circle
        cx={width * 0.5}
        cy={ballCY}
        r={ballRadius}
        fill={color}
        animate={{
          y: [0, -height * 0.15, 0],
        }}
        transition={{
          duration: duration,
          repeat: isAnimating ? Infinity : 0,
          times: [0, 0.08, 1],
          ease: [0.455, 0.03, 0.515, 0.955],
        }}
      />
    </svg>
  );
}
