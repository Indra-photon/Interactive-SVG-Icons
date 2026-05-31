'use client';

import { motion } from 'framer-motion';

interface CircularWaveFillProps {
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function CircularWaveFill({
  width = 60,
  height = 60,
  color = "#269af2",
  backgroundColor = "#cccccc",
  isAnimating = true,
  duration = 2.0,
  ease = 'linear',
}: CircularWaveFillProps) {
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 2;
  const amplitude = r * 0.12;
  const waveWidth = width;

  // Wave path: goes from left to right with a sine-like curve, then fills down
  const getWavePath = (yOffset: number) => {
    const y = cy + r - yOffset;
    const cp1 = y - amplitude;
    const cp2 = y + amplitude;
    return `M ${-waveWidth},${y} Q ${cx / 2},${cp1} ${cx},${y} Q ${cx * 1.5},${cp2} ${waveWidth * 2},${y} L ${waveWidth * 2},${cy + r + 10} L ${-waveWidth},${cy + r + 10} Z`;
  };

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
      <defs>
        <clipPath id={`circle-clip-${width}`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      {/* Background circle */}
      <circle cx={cx} cy={cy} r={r} fill={backgroundColor} />
      {/* Animated wave fill */}
      <g clipPath={`url(#circle-clip-${width})`}>
        <motion.path
          fill={color}
          animate={{
            d: [
              getWavePath(0),
              getWavePath(r),
              getWavePath(r * 2),
            ],
          }}
          transition={{
            duration: 2,
            repeat: isAnimating ? Infinity : 0,
            ease: ease,
            times: [0, 0.5, 1],
          }}
        />
      </g>
    </svg>
  );
}
