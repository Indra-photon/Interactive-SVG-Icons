'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

interface BarsFillSequentialProps {
  width?: number;
  height?: number;
  color?: string;
  barWidth?: number;
  gap?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  repeatDelay?: number;
}

export function BarsFillSequential({
  width = 45,
  height = 45,
  color = "currentColor",
  barWidth = 9,
  gap = 9,
  isAnimating = true,
  duration = 0.5,
  ease = [0.215, 0.61, 0.355, 1],
  repeatDelay = 0.5,
}: BarsFillSequentialProps) {
  const bars = [
    { x: 0, delay: 0 },
    { x: barWidth + gap, delay: 0.17 },
    { x: (barWidth + gap) * 2, delay: 0.33 }
  ];

  const controls = useAnimation();

  useEffect(() => {
    if (isAnimating) {
      controls.start((i) => ({
        y: [height, 0],
        transition: { duration, delay: bars[i].delay, repeat: Infinity, repeatDelay, ease },
      }));
    } else {
      controls.stop();
      controls.set({ y: height });
    }
  }, [isAnimating, duration, ease, repeatDelay, height, controls]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {bars.map((bar, index) => {
        return (
          <motion.rect
            key={index}
            x={bar.x}
            width={barWidth}
            height={height}
            fill={color}
            custom={index}
            initial={{ y: height }}
            animate={controls}
          />
        );
      })}
    </svg>
  );
}
