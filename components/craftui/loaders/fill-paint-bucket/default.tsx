'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

interface FillPaintBucketProps {
  width?: number;
  height?: number;
  color?: string;
  strokeColor?: string;
  backgroundColor?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

// Fixed 100x100 viewBox; width/height scale the svg.
// Timeline: the stream pours in (0 → 0.15), the paint level rises while the
// stream holds (0.15 → 0.85), then the stream fades out (0.85 → 1).
const BODY_PATH = 'M 27 44 L 31 80 Q 31.5 84 35 84 L 65 84 Q 68.5 84 69 80 L 73 44 Z';

export function FillPaintBucket({
  width = 60,
  height = 60,
  color = "#8b5cf6",
  strokeColor = "#1f1f1f",
  backgroundColor = "#ffffff",
  isAnimating = true,
  duration = 3.0,
  ease = 'linear',
}: FillPaintBucketProps) {
  const streamControls = useAnimation();
  const levelControls = useAnimation();

  useEffect(() => {
    if (isAnimating) {
      streamControls.start({
        height: [0, 43, 43, 43],
        opacity: [1, 1, 1, 0],
        transition: { duration, repeat: Infinity, ease: 'linear', times: [0, 0.15, 0.85, 1] },
      });
      // The paint fades out with the stream so the loop restarts at empty
      // without a visible snap.
      levelControls.start({
        y: [82, 82, 50, 50],
        height: [0, 0, 32, 32],
        opacity: [1, 1, 1, 0],
        transition: { duration, repeat: Infinity, ease, times: [0, 0.15, 0.85, 1] },
      });
    } else {
      streamControls.stop();
      levelControls.stop();
      streamControls.set({ height: 0, opacity: 1 });
      levelControls.set({ y: 82, height: 0, opacity: 1 });
    }
  }, [isAnimating, duration, ease, streamControls, levelControls]);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
    >
      <defs>
        <clipPath id={`fill-paint-bucket-clip-${width}`}>
          <path d="M 30 47 L 33.7 79 Q 34 81.5 36.5 81.5 L 63.5 81.5 Q 66 81.5 66.3 79 L 70 47 Z" />
        </clipPath>
      </defs>
      {/* Pouring stream */}
      <motion.rect
        x={46}
        y={4}
        width={8}
        rx={3}
        fill={color}
        initial={{ height: 0, opacity: 1 }}
        animate={streamControls}
      />
      {/* Bucket interior */}
      <path d={BODY_PATH} fill={backgroundColor} />
      {/* Rising paint */}
      <g clipPath={`url(#fill-paint-bucket-clip-${width})`}>
        <motion.rect
          x={28}
          width={44}
          fill={color}
          initial={{ y: 82, height: 0 }}
          animate={levelControls}
        />
      </g>
      {/* Bucket outline */}
      <path
        d={BODY_PATH}
        stroke={strokeColor}
        strokeWidth={5}
        strokeLinejoin="round"
        fill="none"
      />
      {/* Rim */}
      <line x1={27} y1={44} x2={73} y2={44} stroke={strokeColor} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
}
