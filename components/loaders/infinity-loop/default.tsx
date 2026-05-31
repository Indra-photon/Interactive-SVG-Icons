'use client';

import { motion } from 'framer-motion';

interface InfinityLoopProps {
  width?: number;
  height?: number;
  color?: string;
  pathColor?: string;
  dotSize?: number;
  showPath?: boolean;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  strokeWidth?: number;
  strokeLinecap?: 'round' | 'butt' | 'square';
}

export function InfinityLoop({
  width = 80,
  height = 40,
  color = "currentColor",
  pathColor = "#cccccc",
  dotSize = 6,
  showPath = true,
  isAnimating = true,
  duration = 2.5,
  ease = 'linear',
  strokeWidth = 2,
  strokeLinecap = 'round',
}: InfinityLoopProps) {
  const cx = width / 2;
  const cy = height / 2;
  const r = height * 0.35;
  const dotR = dotSize / 2;

  // Infinity path (lemniscate approximated with bezier curves)
  const infinityPath = [
    `M ${cx},${cy}`,
    `C ${cx + r * 0.5},${cy - r * 1.2} ${cx + r * 2},${cy - r * 1.2} ${cx + r * 2},${cy}`,
    `C ${cx + r * 2},${cy + r * 1.2} ${cx + r * 0.5},${cy + r * 1.2} ${cx},${cy}`,
    `C ${cx - r * 0.5},${cy - r * 1.2} ${cx - r * 2},${cy - r * 1.2} ${cx - r * 2},${cy}`,
    `C ${cx - r * 2},${cy + r * 1.2} ${cx - r * 0.5},${cy + r * 1.2} ${cx},${cy}`,
  ].join(' ');

  // Sample ~40 points along the infinity path using parametric lemniscate
  const steps = 60;
  const xKeyframes: number[] = [];
  const yKeyframes: number[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = (2 * Math.PI * i) / steps;
    const scale = r * 1.8;
    const denom = 1 + Math.sin(t) * Math.sin(t);
    const px = cx + (scale * Math.cos(t)) / denom;
    const py = cy + (scale * Math.sin(t) * Math.cos(t)) / denom;
    xKeyframes.push(px);
    yKeyframes.push(py);
  }

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
      {showPath && (
        <path
          d={infinityPath}
          stroke={pathColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap={strokeLinecap}
        />
      )}
      <motion.circle
        r={dotR}
        fill={color}
        animate={{
          cx: xKeyframes,
          cy: yKeyframes,
        }}
        transition={{
          duration: duration,
          repeat: isAnimating ? Infinity : 0,
          ease: ease,
        }}
      />
    </svg>
  );
}
