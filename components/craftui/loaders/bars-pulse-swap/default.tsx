'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

interface BarsPulseSwapProps {
  width?: number;
  height?: number;
  color?: string;
  barWidth?: number;
  gap?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function BarsPulseSwap({
  width = 45,
  height = 45,
  color = "currentColor",
  barWidth = 9,
  gap = 9,
  isAnimating = true,
  duration = 0.5,
  ease = 'easeInOut',
}: BarsPulseSwapProps) {
  const easeInOutQuad = [.785, .135, .15, .86] as const;

  // 6 bars: 2 at each x position (0%, 50%, 100%)
  const bars = [
    { x: 0, pairIndex: 0, barInPair: 0 },           // Left pair - bar 1
    { x: 0, pairIndex: 0, barInPair: 1 },           // Left pair - bar 2
    { x: barWidth + gap, pairIndex: 1, barInPair: 0 }, // Center pair - bar 1
    { x: barWidth + gap, pairIndex: 1, barInPair: 1 }, // Center pair - bar 2
    { x: (barWidth + gap) * 2, pairIndex: 2, barInPair: 0 }, // Right pair - bar 1
    { x: (barWidth + gap) * 2, pairIndex: 2, barInPair: 1 }  // Right pair - bar 2
  ];

  const tallHeight = height;
  const shortHeight = height * 0.2;

  const controls = useAnimation();

  useEffect(() => {
    if (isAnimating) {
      controls.start((i) => {
        const { pairIndex, barInPair } = bars[i];
        let yPositions: number[];
        if (pairIndex === 0) {
          yPositions = barInPair === 0
            ? [0, height / 2, 0]
            : [height - shortHeight, height / 2, height - shortHeight];
        } else if (pairIndex === 1) {
          yPositions = barInPair === 0
            ? [height / 2, 0, height / 2]
            : [height / 2, height - shortHeight, height / 2];
        } else {
          yPositions = barInPair === 0
            ? [0, height / 2, 0]
            : [height - shortHeight, height / 2, height - shortHeight];
        }
        return {
          height: [tallHeight, shortHeight],
          y: yPositions,
          transition: {
            height: { duration, repeat: Infinity, repeatType: 'reverse', ease: easeInOutQuad },
            y: { duration, repeat: Infinity, ease: easeInOutQuad, times: [0, 0.5, 1] },
          },
        };
      });
    } else {
      controls.stop();
      controls.set((i) => {
        const { pairIndex, barInPair } = bars[i];
        let y: number;
        if (pairIndex === 0 || pairIndex === 2) {
          y = barInPair === 0 ? 0 : height - shortHeight;
        } else {
          y = height / 2;
        }
        return { height: tallHeight, y };
      });
    }
  }, [isAnimating, duration, height, shortHeight, tallHeight, controls]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {bars.map((bar, index) => {
        const { pairIndex, barInPair } = bar;
        let initialY: number;
        if (pairIndex === 0 || pairIndex === 2) {
          initialY = barInPair === 0 ? 0 : height - shortHeight;
        } else {
          initialY = height / 2;
        }
        return (
          <motion.rect
            key={index}
            x={bar.x}
            width={barWidth}
            fill={color}
            custom={index}
            initial={{ height: tallHeight, y: initialY }}
            animate={controls}
          />
        );
      })}
    </svg>
  );
}
