'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

interface BallBounceBoxProps {
  width?: number;
  height?: number;
  color?: string;
  boxColor?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  strokeWidth?: number;
}

export function BallBounceBox({
  width = 60,
  height = 60,
  color = "currentColor",
  boxColor = "currentColor",
  isAnimating = true,
  duration = 0.5,
  ease = 'easeOut',
  strokeWidth = 3,
}: BallBounceBoxProps) {
  const ballRadius = width * 0.15;
  const ballX = width * 0.35 + ballRadius;
  const ballY = height - ballRadius - strokeWidth;

  // Increase viewBox to accommodate rotation and bounce
  const viewBoxPadding = width * 0.2;
  const viewBoxSize = width + (viewBoxPadding * 2);
  const offset = viewBoxPadding;

  const controlsBox = useAnimation();
  const controlsBall = useAnimation();

  useEffect(() => {
    if (isAnimating) {
      controlsBox.start({
        rotate: [0, 0, 90, 90],
        transition: { duration, repeat: Infinity, times: [0, 0.2, 0.8, 1], ease },
      });
      controlsBall.start({
        y: [0, -height * 0.4, 0],
        transition: { duration, repeat: Infinity, times: [0, 0.08, 1], ease },
      });
    } else {
      controlsBox.stop();
      controlsBox.set({ rotate: 0 });
      controlsBall.stop();
      controlsBall.set({ y: 0 });
    }
  }, [isAnimating, duration, ease, height, controlsBox, controlsBall]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`${-offset} ${-offset} ${viewBoxSize} ${viewBoxSize}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
    >
      {/* Rotating box outline */}
      <motion.rect
        x={strokeWidth / 2}
        y={strokeWidth / 2}
        width={width - strokeWidth}
        height={height - strokeWidth}
        stroke={boxColor}
        strokeWidth={strokeWidth}
        fill="none"
        initial={{ rotate: 0 }}
        animate={controlsBox}
        style={{ originX: `${width / 2}px`, originY: `${height / 2}px` }}
      />
      {/* Bouncing ball */}
      <motion.circle
        cx={ballX}
        cy={ballY}
        r={ballRadius}
        fill={color}
        initial={{ y: 0 }}
        animate={controlsBall}
      />
    </svg>
  );
}
