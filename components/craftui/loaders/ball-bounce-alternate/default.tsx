'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

interface BallBounceAlternateProps {
  width?: number;
  height?: number;
  color?: string;
  lineColor?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  strokeWidth?: number;
}

export function BallBounceAlternate({
  width = 90,
  height = 45,
  color = "currentColor",
  lineColor = "currentColor",
  isAnimating = true,
  duration = 2.0,
  ease = 'linear',
  strokeWidth = 3,
}: BallBounceAlternateProps) {
  const ballRadius = height * 0.15;
  const ballCY = height - ballRadius - 1.5;

  const controls = useAnimation();

  useEffect(() => {
    if (isAnimating) {
      // x and y have different durations — animate them independently via separate sequences
      // We use a combined animate call; motion handles each property's transition separately
      controls.start({
        x: [-width * 5, width * 5],
        transition: {
          duration,
          repeat: Infinity,
          repeatType: 'reverse',
          ease,
        },
      });
    } else {
      controls.stop();
      controls.set({ x: 0, y: 0 });
    }
  }, [isAnimating, duration, ease, width, height, controls]);

  const controlsY = useAnimation();

  useEffect(() => {
    if (isAnimating) {
      controlsY.start({
        y: [0, -height * 0.15, 0],
        transition: {
          duration: duration * 0.25,
          repeat: Infinity,
          times: [0, 0.08, 1],
          ease: [0.455, 0.03, 0.515, 0.955],
        },
      });
    } else {
      controlsY.stop();
      controlsY.set({ y: 0 });
    }
  }, [isAnimating, duration, height, controlsY]);

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
      <motion.g animate={controls}>
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
