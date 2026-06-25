'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

interface BallBounceSlideProps {
  width?: number;
  height?: number;
  color?: string;
  lineColor?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  strokeWidth?: number;
}

export function BallBounceSlide({
  width = 90,
  height = 45,
  color = "currentColor",
  lineColor = "currentColor",
  isAnimating = true,
  duration = 2.0,
  ease = 'linear',
  strokeWidth = 3,
}: BallBounceSlideProps) {
  const ballRadius = height * 0.15;
  const ballCY = height - ballRadius - 1.5;

  const controlsX = useAnimation();
  const controlsY = useAnimation();

  useEffect(() => {
    if (isAnimating) {
      controlsX.start({
        x: [-width * 5, width * 5],
        transition: { duration, repeat: Infinity, ease },
      });
      controlsY.start({
        y: [0, -height * 0.15, 0],
        transition: { duration: duration * 0.25, repeat: Infinity, times: [0, 0.08, 1], ease: [0.455, 0.03, 0.515, 0.955] },
      });
    } else {
      controlsX.stop();
      controlsX.set({ x: 0 });
      controlsY.stop();
      controlsY.set({ y: 0 });
    }
  }, [isAnimating, duration, ease, width, height, controlsX, controlsY]);

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
        strokeWidth={strokeWidth}
      />
      {/* Outer motion element handles x translation */}
      <motion.g animate={controlsX}>
        {/* Inner motion element handles y (bounce) */}
        <motion.circle
          cx={width * 0.425}
          cy={ballCY}
          r={ballRadius}
          fill={color}
          animate={controlsY}
        />
      </motion.g>
    </svg>
  );
}
