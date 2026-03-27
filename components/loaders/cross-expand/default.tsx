'use client';

import { motion } from 'framer-motion';

interface CrossExpandProps {
  width?: number;
  height?: number;
  color?: string;
  crossThickness?: number;
  cornerSize?: number;
  isAnimating?: boolean;
}

export function CrossExpand({
  width = 40,
  height = 40,
  color = "#25b09b",
  crossThickness = 8,
  cornerSize = 12,
  isAnimating = true,
}: CrossExpandProps) {
  const cx = width / 2;
  const cy = height / 2;

  const cornerPositions = [
    { x: 0, y: 0 },
    { x: width - cornerSize, y: 0 },
    { x: 0, y: height - cornerSize },
    { x: width - cornerSize, y: height - cornerSize },
  ];

  // Total cycle = 2s
  // Each box fills in over 0.2s, staggered 0.25s apart
  // All visible from ~1s, hold until 1.5s, disappear together by 1.7s, gap to 2s
  const stagger = 0.125; // 0.25s / 2s cycle
  const fillDuration = 0.1; // 0.2s / 2s cycle
  const holdEnd = 0.75;    // 1.5s / 2s
  const fadeEnd = 0.85;    // 1.7s / 2s

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
      {/* Static center cross */}
      <rect
        x={0}
        y={cy - crossThickness / 2}
        width={width}
        height={crossThickness}
        fill={color}
        rx={crossThickness / 2}
      />
      <rect
        x={cx - crossThickness / 2}
        y={0}
        width={crossThickness}
        height={height}
        fill={color}
        rx={crossThickness / 2}
      />

      {/* Corner squares — fill in one by one, all disappear together */}
      {cornerPositions.map((pos, i) => {
        const start = i * stagger;
        const end = start + fillDuration;
        const times = [0, start, end, holdEnd, fadeEnd, 1];
        const centerX = pos.x + cornerSize / 2;
        const centerY = pos.y + cornerSize / 2;

        return (
          <motion.rect
            key={i}
            x={pos.x}
            y={pos.y}
            width={cornerSize}
            height={cornerSize}
            fill={color}
            rx={2}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={isAnimating ? {
              opacity: [0, 0, 1, 1, 0, 0],
              scale: [0.3, 0.3, 1, 1, 0.3, 0.3],
            } : { opacity: 0, scale: 0.3 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              times,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: `${centerX}px ${centerY}px` }}
          />
        );
      })}
    </svg>
  );
}
