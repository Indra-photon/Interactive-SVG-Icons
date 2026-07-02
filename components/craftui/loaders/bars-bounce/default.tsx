'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

interface BarsBounceProps {
  width?: number;
  height?: number;
  color?: string;
  barWidth?: number;
  gap?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function BarsBounce({
  width = 45,
  height = 45,
  color = "currentColor",
  barWidth = 9,
  gap = 9,
  isAnimating = true,
  duration = 1.0,
  ease = 'easeInOut',
}: BarsBounceProps) {
  const bars = [
    { x: 0 },
    { x: barWidth + gap },
    { x: (barWidth + gap) * 2 }
  ];

  // Height animation: 100% -> 40% -> 100%
  const tallHeight = height;
  const shortHeight = height * 0.4;

  const controls = useAnimation();

  useEffect(() => {
    if (isAnimating) {
      controls.start((i) => {
        const isFirstOrLast = i === 0 || i === 2;
        return {
          height: [tallHeight, shortHeight, tallHeight],
          y: isFirstOrLast
            ? [0, height - shortHeight, height - tallHeight]
            : [height - tallHeight, 0, height - tallHeight],
          transition: { duration, repeat: Infinity, ease, times: [0, 0.5, 1] },
        };
      });
    } else {
      controls.stop();
      controls.set((i) => {
        const isFirstOrLast = i === 0 || i === 2;
        return {
          height: tallHeight,
          y: isFirstOrLast ? 0 : height - tallHeight,
        };
      });
    }
  }, [isAnimating, duration, ease, tallHeight, shortHeight, height, controls]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {bars.map((bar, index) => {
        const isFirstOrLast = index === 0 || index === 2;
        return (
          <motion.rect
            key={index}
            x={bar.x}
            width={barWidth}
            fill={color}
            custom={index}
            initial={{
              height: tallHeight,
              y: isFirstOrLast ? 0 : height - tallHeight,
            }}
            animate={controls}
          />
        );
      })}
    </svg>
  );
}
