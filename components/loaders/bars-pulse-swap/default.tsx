'use client';

import { motion } from 'framer-motion';

interface BarsPulseSwapProps {
  width?: number;
  height?: number;
  color?: string;
  barWidth?: number;
  gap?: number;
  isAnimating?: boolean;
}

export function BarsPulseSwap({ 
  width = 45,
  height = 45, 
  color = "currentColor",
  barWidth = 9,
  gap = 9,
  isAnimating = true
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
        
        // Position animation pattern based on pair and time
        // Phase 1 (0-50%): Left=spread, Center=together, Right=spread
        // Phase 2 (50-100%): Left=together, Center=spread, Right=together
        
        let yPositions;
        if (pairIndex === 0) { // Left pair
          yPositions = barInPair === 0 
            ? [0, height / 2, 0]           // top -> middle -> top
            : [height - shortHeight, height / 2, height - shortHeight]; // bottom -> middle -> bottom
        } else if (pairIndex === 1) { // Center pair
          yPositions = barInPair === 0
            ? [height / 2, 0, height / 2]  // middle -> top -> middle
            : [height / 2, height - shortHeight, height / 2]; // middle -> bottom -> middle
        } else { // Right pair
          yPositions = barInPair === 0
            ? [0, height / 2, 0]           // top -> middle -> top
            : [height - shortHeight, height / 2, height - shortHeight]; // bottom -> middle -> bottom
        }

        return (
          <motion.rect
            key={index}
            x={bar.x}
            width={barWidth}
            fill={color}
            animate={{
              height: isAnimating ? [tallHeight, shortHeight] : tallHeight,
              y: yPositions
            }}
            transition={{
              height: {
                duration: 0.5,
                repeat: isAnimating ? Infinity : 0,
                repeatType: "reverse",
                ease: easeInOutQuad
              },
              y: {
                duration: 2,
                repeat: isAnimating ? Infinity : 0,
                ease: easeInOutQuad,
                times: [0, 0.5, 1]
              }
            }}
          />
        );
      })}
    </svg>
  );
}