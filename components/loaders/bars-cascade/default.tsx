'use client';

import { motion } from 'framer-motion';

interface BarsCascadeProps {
  width?: number;
  height?: number;
  color?: string;
  isAnimating?: boolean;
}

export function BarsCascade({ 
  width = 45,
  height = 45, 
  color = "currentColor",
  isAnimating = true
}: BarsCascadeProps) {
  const easeInOutQuad = [0.455, 0.03, 0.515, 0.955] as const;

  const barHeight = height * 0.26; // 26% of container
  const stripeWidth = width * 0.2; // 20% for stripe pattern

  // 4 bars with their animation sequences
  const bars = [
    { id: 0, ySequence: [-20, -20, -20, -20, 0, 0, 0, 0, 50] },
    { id: 1, ySequence: [-20, -20, -20, height/3, height/3, height/3, height/3, 50, 50] },
    { id: 2, ySequence: [-20, -20, (height*2)/3, (height*2)/3, (height*2)/3, (height*2)/3, 50, 50, 50] },
    { id: 3, ySequence: [-20, height, height, height, height, 50, 50, 50, 50] }
  ];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Striped pattern */}
        <pattern 
          id="stripePattern" 
          patternUnits="userSpaceOnUse" 
          width={stripeWidth * 2} 
          height={barHeight}
        >
          <rect x="0" y="0" width={stripeWidth} height={barHeight} fill={color} />
          <rect x={stripeWidth} y="0" width={stripeWidth} height={barHeight} fill="transparent" />
        </pattern>
      </defs>

      {bars.map((bar) => (
        <motion.rect
          key={bar.id}
          x={0}
          width={width}
          height={barHeight}
          fill="url(#stripePattern)"
          animate={{
            y: bar.ySequence
          }}
          transition={{
            duration: 1.5,
            repeat: isAnimating ? Infinity : 0,
            ease: easeInOutQuad,
            times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
          }}
        />
      ))}
    </svg>
  );
}