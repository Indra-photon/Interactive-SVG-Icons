'use client';

import { motion } from 'framer-motion';

interface BarsScaleWaveProps {
  width?: number;
  height?: number;
  color?: string;
  barCount?: number;
  barWidth?: number;
  isAnimating?: boolean;
}

export function BarsScaleWave({
  width = 60,
  height = 60,
  color = "currentColor",
  barCount = 5,
  barWidth = 8,
  isAnimating = true,
}: BarsScaleWaveProps) {
  const totalBarsWidth = barCount * barWidth;
  const spacing = (width - totalBarsWidth) / (barCount + 1);
  const minHeightRatio = 0.3;

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
      {Array.from({ length: barCount }).map((_, i) => {
        const x = spacing * (i + 1) + barWidth * i;
        const barHeight = height * (1 - minHeightRatio);
        const minH = height * minHeightRatio;

        return (
          <motion.rect
            key={i}
            x={x}
            y={0}
            width={barWidth}
            height={height}
            fill={color}
            rx={barWidth / 2}
            animate={{
              scaleY: [minHeightRatio, 1, minHeightRatio],
              y: [height * (1 - minHeightRatio) / 2, 0, height * (1 - minHeightRatio) / 2],
            }}
            transition={{
              duration: 1,
              repeat: isAnimating ? Infinity : 0,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
            style={{ originY: 'center', transformOrigin: `${x + barWidth / 2}px ${height / 2}px` }}
          />
        );
      })}
    </svg>
  );
}
