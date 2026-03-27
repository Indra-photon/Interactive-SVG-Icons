'use client';

import { motion } from 'framer-motion';

interface BallBounceSlideProps {
  width?: number;
  height?: number;
  color?: string;
  lineColor?: string;
  isAnimating?: boolean;
}

export function BallBounceSlide({
  width = 90,
  height = 45,
  color = "currentColor",
  lineColor = "currentColor",
  isAnimating = true,
}: BallBounceSlideProps) {
  const ballRadius = height * 0.15;
  const ballCY = height - ballRadius - 1.5;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
      style={{ overflow: 'hidden' }}
    >
      <line
        x1={0}
        y1={height - 1.5}
        x2={width}
        y2={height - 1.5}
        stroke={lineColor}
        strokeWidth={3}
      />
      <motion.circle
        cx={width * 0.425}
        cy={ballCY}
        r={ballRadius}
        fill={color}
        animate={{
          x: [-width * 5, width * 5],
          y: [0, -height * 0.15, 0],
        }}
        transition={{
          x: {
            duration: 2,
            repeat: isAnimating ? Infinity : 0,
            ease: 'linear',
          },
          y: {
            duration: 0.5,
            repeat: isAnimating ? Infinity : 0,
            times: [0, 0.08, 1],
            ease: [0.455, 0.03, 0.515, 0.955],
          },
        }}
      />
    </svg>
  );
}
