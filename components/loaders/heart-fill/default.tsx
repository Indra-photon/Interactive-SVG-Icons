'use client';

import { motion } from 'framer-motion';

interface HeartFillProps {
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  isAnimating?: boolean;
}

export function HeartFill({
  width = 60,
  height = 60,
  color = "#dc1818",
  backgroundColor = "#cccccc",
  isAnimating = true,
}: HeartFillProps) {
  const scaleX = width / 60;
  const scaleY = height / 60;

  // Heart path scaled to 60x60 viewbox
  const heartPath = "M30,50 C10,35 5,25 5,18 C5,10 12,5 20,5 C24,5 28,7 30,10 C32,7 36,5 40,5 C48,5 55,10 55,18 C55,25 50,35 30,50 Z";

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
    >
      <defs>
        <clipPath id={`heart-clip-${width}`}>
          <path d={heartPath} />
        </clipPath>
      </defs>
      {/* Background heart */}
      <path d={heartPath} fill={backgroundColor} />
      {/* Animated fill rect clipped to heart shape */}
      <g clipPath={`url(#heart-clip-${width})`}>
        <motion.rect
          x={0}
          width={60}
          height={60}
          fill={color}
          animate={{
            y: [60, 60, 0],
          }}
          transition={{
            duration: 2,
            repeat: isAnimating ? Infinity : 0,
            times: [0, 0.2, 1],
            ease: 'easeOut',
          }}
        />
      </g>
    </svg>
  );
}
