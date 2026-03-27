'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SpinnerOrbitDotsProps {
  width?: number;
  height?: number;
  dotCount?: number;
  dotSize?: number;
  isAnimating?: boolean;
}

export function SpinnerOrbitDots({
  width = 60,
  height = 60,
  dotCount = 8,
  dotSize = 6,
  isAnimating = true,
}: SpinnerOrbitDotsProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;
  const [activeDot, setActiveDot] = useState(0);

  const dots = Array.from({ length: dotCount }).map((_, i) => {
    const angle = (360 / dotCount) * i - 90;
    const rad = (angle * Math.PI) / 180;
    const x = centerX + radius * Math.cos(rad);
    const y = centerY + radius * Math.sin(rad);
    return { x, y };
  });

  useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % dotCount);
    }, 120);
    return () => clearInterval(interval);
  }, [isAnimating, dotCount]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
    >
      {/* Static dim dots */}
      {dots.map((dot, i) => (
        <circle
          key={i}
          cx={dot.x}
          cy={dot.y}
          r={dotSize / 2}
          fill={i === activeDot ? 'transparent' : '#404040'}
        />
      ))}
    </svg>
  );
}