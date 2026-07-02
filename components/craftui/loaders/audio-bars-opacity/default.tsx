'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

interface AudioBarsOpacityProps {
  width?: number;
  height?: number;
  color?: string;
  barWidth?: number;
  gap?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function AudioBarsOpacity({
  width = 60,
  height = 60,
  color = "currentColor",
  barWidth = 4,
  gap = 3,
  isAnimating = true,
  duration = 0.8,
  ease = 'easeInOut',
}: AudioBarsOpacityProps) {
  const barCount = 6;
  const totalWidth = (barCount * barWidth) + ((barCount - 1) * gap);
  const startX = (width - totalWidth) / 2;

  const minHeight = height * 0.3;
  const maxHeight = height * 0.8;

  const controls = useAnimation();

  useEffect(() => {
    if (isAnimating) {
      controls.start((i) => {
        const isOdd = i % 2 === 0;
        return {
          height: isOdd ? [minHeight, maxHeight, minHeight] : [maxHeight, minHeight, maxHeight],
          y: isOdd
            ? [(height - minHeight) / 2, (height - maxHeight) / 2, (height - minHeight) / 2]
            : [(height - maxHeight) / 2, (height - minHeight) / 2, (height - maxHeight) / 2],
          opacity: isOdd ? [0.3, 1, 0.3] : [1, 0.3, 1],
          transition: { duration, repeat: Infinity, ease },
        };
      });
    } else {
      controls.stop();
      controls.set((i) => {
        const isOdd = i % 2 === 0;
        return {
          height: isOdd ? minHeight : maxHeight,
          y: isOdd ? (height - minHeight) / 2 : (height - maxHeight) / 2,
          opacity: isOdd ? 0.3 : 1,
        };
      });
    }
  }, [isAnimating, duration, ease, minHeight, maxHeight, height, controls]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from({ length: barCount }).map((_, index) => {
        const isOdd = index % 2 === 0;
        return (
          <motion.rect
            key={index}
            x={startX + (index * (barWidth + gap))}
            width={barWidth}
            fill={color}
            custom={index}
            initial={{
              height: isOdd ? minHeight : maxHeight,
              y: isOdd ? (height - minHeight) / 2 : (height - maxHeight) / 2,
              opacity: isOdd ? 0.3 : 1,
            }}
            animate={controls}
          />
        );
      })}
    </svg>
  );
}
