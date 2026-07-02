'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

interface AudioBarsSequentialProps {
  width?: number;
  height?: number;
  color?: string;
  barWidth?: number;
  gap?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function AudioBarsSequential({
  width = 60,
  height = 60,
  color = "currentColor",
  barWidth = 4,
  gap = 3,
  isAnimating = true,
  duration = 1.2,
  ease = 'easeInOut',
}: AudioBarsSequentialProps) {
  const barCount = 6;
  const totalWidth = (barCount * barWidth) + ((barCount - 1) * gap);
  const startX = (width - totalWidth) / 2;

  const minHeight = height * 0.3;
  const maxHeight = height * 0.8;

  const controls = useAnimation();

  useEffect(() => {
    const delayPerBar = duration / barCount;
    if (isAnimating) {
      controls.start((i) => ({
        height: [minHeight, maxHeight, minHeight],
        y: [(height - minHeight) / 2, (height - maxHeight) / 2, (height - minHeight) / 2],
        transition: { duration, repeat: Infinity, ease, delay: i * delayPerBar },
      }));
    } else {
      controls.stop();
      controls.set({ height: minHeight, y: (height - minHeight) / 2 });
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
        return (
          <motion.rect
            key={index}
            x={startX + (index * (barWidth + gap))}
            width={barWidth}
            fill={color}
            custom={index}
            initial={{ height: minHeight, y: (height - minHeight) / 2 }}
            animate={controls}
          />
        );
      })}
    </svg>
  );
}
