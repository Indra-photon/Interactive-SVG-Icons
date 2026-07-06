'use client';

import { motion } from 'motion/react';

interface HexagonRotateProps {
  width?: number;
  height?: number;
  color?: string;
  thickness?: number;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function HexagonRotate({
  width = 50,
  height = 50,
  color = "currentColor",
  thickness = 3,
  isAnimating = true,
  duration = 2.0,
  ease = [0.4, 0, 0.6, 1],
}: HexagonRotateProps) {
  const centerX = width / 2;
  const centerY = height / 2;

  const getPoints = (r: number, rotation: number) =>
    Array.from({ length: 6 }).map((_, i) => {
      const angle = (60 * i + rotation) * (Math.PI / 180);
      return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
    }).join(' ');

  const radiusA = Math.min(width, height) * 0.42;
  const radiusB = Math.min(width, height) * 0.32;

  const pointsA = getPoints(radiusA, -30); // tall hexagon
  const pointsB = getPoints(radiusB, 0);   // squished / rotated hexagon

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
      {/* Outer static ghost hexagon */}
      <polygon
        points={pointsA}
        stroke={color}
        strokeWidth={thickness * 0.5}
        fill="none"
        opacity={0.02}
        strokeLinejoin="round"
      />

      {/* Morphing filled hexagon */}
      <motion.polygon
        strokeLinejoin="round"
        stroke={color}
        strokeWidth={thickness}
        fill={color}
        initial={{ points: pointsA, fillOpacity: 0.15, strokeOpacity: 1, scale: 1 }}
        animate={{
          points: [pointsA, pointsB, pointsA],
          fillOpacity: [0.15, 0.6, 0.15],
          strokeOpacity: [1, 0.4, 1],
          scale: [1, 0.88, 1],
        }}
        transition={{
          duration: duration,
          repeat: isAnimating ? Infinity : 0,
          ease: ease,
          times: [0, 0.5, 1],
        }}
        style={{ originX: `${centerX}px`, originY: `${centerY}px` }}
      />
    </svg>
  );
}