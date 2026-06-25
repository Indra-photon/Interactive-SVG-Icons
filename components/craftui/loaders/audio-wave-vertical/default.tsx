'use client';

import { useEffect, useMemo } from 'react';
import { motion, useAnimation } from 'motion/react';

interface AudioWaveVerticalProps {
  width?: number;
  height?: number;
  color?: string;
  barWidth?: number;
  gap?: number;
  barCount?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  staggerDelay?: number;
}

export function AudioWaveVertical({
  width = 60,
  height = 60,
  color = "currentColor",
  barWidth = 3,
  gap = 3,
  barCount = 5,
  isAnimating = true,
  duration = 0.6,
  ease = 'easeInOut',
  staggerDelay = 0.1,
}: AudioWaveVerticalProps) {
  const totalWidth = (barCount * barWidth) + ((barCount - 1) * gap);
  const startX = (width - totalWidth) / 2;

  // Define different height ranges for each bar (center is tallest)
  // Use useMemo to stabilize bars across renders
  const bars = useMemo(() => Array.from({ length: barCount }, (_, i) => {
    const distanceFromCenter = Math.abs(i - Math.floor(barCount / 2));
    const minHeight = height * 0.2; // 20% min
    const maxHeight = height * (0.9 - distanceFromCenter * 0.15); // Center is tallest

    return {
      minHeight,
      maxHeight,
      duration: 0.6 + (i * 0.08), // deterministic per-bar duration
      delay: i * 0.1, // Staggered
    };
  }), [barCount, height]);

  const controls = useAnimation();

  useEffect(() => {
    if (isAnimating) {
      controls.start((i) => ({
        height: [bars[i].minHeight, bars[i].maxHeight, bars[i].minHeight],
        y: [(height - bars[i].minHeight) / 2, (height - bars[i].maxHeight) / 2, (height - bars[i].minHeight) / 2],
        transition: { duration: bars[i].duration, repeat: Infinity, ease, delay: bars[i].delay },
      }));
    } else {
      controls.stop();
      controls.set((i) => ({
        height: bars[i].minHeight,
        y: (height - bars[i].minHeight) / 2,
      }));
    }
  }, [isAnimating, ease, height, bars, controls]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {bars.map((bar, index) => (
        <motion.rect
          key={index}
          x={startX + (index * (barWidth + gap))}
          width={barWidth}
          fill={color}
          custom={index}
          initial={{ height: bar.minHeight, y: (height - bar.minHeight) / 2 }}
          animate={controls}
        />
      ))}
    </svg>
  );
}
