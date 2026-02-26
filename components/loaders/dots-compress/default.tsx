'use client';

import { motion } from 'framer-motion';

interface DotsCompressProps {
  width?: number;
  color?: string;
  dotSize?: number;
  isAnimating?: boolean;
}

export function DotsCompress({ 
  width = 60,
  color = "currentColor",
  dotSize = 12,
  isAnimating = true
}: DotsCompressProps) {
  const easeInOutQuad = [0.455, 0.03, 0.515, 0.955] as const;

  // Start state: horizontal layout (aspect 4:1)
  const startHeight = width / 4;
  const endWidth = 25;
  const endHeight = 25; // aspect 1:1

  // Dot positions
  const dots = [
    { 
      id: 0, 
      startX: 6, 
      startY: startHeight / 2,
      endX: endWidth / 2,
      endY: dotSize / 2 + 1
    },
    { 
      id: 1, 
      startX: width / 2, 
      startY: startHeight / 2,
      endX: endWidth / 2,
      endY: endHeight / 2
    },
    { 
      id: 2, 
      startX: width - 6, 
      startY: startHeight / 2,
      endX: endWidth / 2,
      endY: endHeight - dotSize / 2 - 1
    }
  ];

  return (
    <motion.svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{
        width: [width, endWidth],
        height: [startHeight, endHeight]
      }}
      transition={{
        duration: 1,
        repeat: isAnimating ? Infinity : 0,
        repeatType: "reverse",
        ease: easeInOutQuad
      }}
    >
      <motion.g
        animate={{
          viewBox: [`0 0 ${width} ${startHeight}`, `0 0 ${endWidth} ${endHeight}`]
        }}
        transition={{
          duration: 1,
          repeat: isAnimating ? Infinity : 0,
          repeatType: "reverse",
          ease: easeInOutQuad
        }}
      >
        {dots.map((dot) => (
          <motion.circle
            key={dot.id}
            r={dotSize / 2}
            fill={color}
            animate={{
              cx: [dot.startX, dot.endX],
              cy: [dot.startY, dot.endY]
            }}
            transition={{
              duration: 1,
              repeat: isAnimating ? Infinity : 0,
              repeatType: "reverse",
              ease: easeInOutQuad
            }}
          />
        ))}
      </motion.g>
    </motion.svg>
  );
}