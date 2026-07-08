'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

interface FillHourglassProps {
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
// Sand drains from the top bulb to the bottom one, then the whole
// hourglass flips 180° — the loop restart lands on an identical frame.
const TOP_SAND_START = 30;
const TOP_SAND_END = 47;
const BOTTOM_SAND_START = 80;
const BOTTOM_SAND_END = 62;

export function FillHourglass({
  width = 60,
  height = 60,
  color = "#e8a33d",
  strokeColor = "#1f1f1f",
  backgroundColor = "#ffffff",
  isAnimating = true,
  duration = 4.0,
  ease = 'linear',
}: FillHourglassProps) {
  const rotateControls = useAnimation();
  const topControls = useAnimation();
  const bottomControls = useAnimation();
  const streamControls = useAnimation();

  useEffect(() => {
    if (isAnimating) {
      rotateControls.start({
        rotate: [0, 0, 180],
        transition: { duration, repeat: Infinity, ease: 'easeInOut', times: [0, 0.8, 1] },
      });
      topControls.start({
        y: [TOP_SAND_START, TOP_SAND_END, TOP_SAND_END],
        transition: { duration, repeat: Infinity, ease, times: [0, 0.78, 1] },
      });
      bottomControls.start({
        y: [BOTTOM_SAND_START, BOTTOM_SAND_END, BOTTOM_SAND_END],
        transition: { duration, repeat: Infinity, ease, times: [0, 0.78, 1] },
      });
      streamControls.start({
        opacity: [1, 1, 0, 0],
        transition: { duration, repeat: Infinity, ease: 'linear', times: [0, 0.72, 0.78, 1] },
      });
    } else {
      rotateControls.stop();
      topControls.stop();
      bottomControls.stop();
      streamControls.stop();
      rotateControls.set({ rotate: 0 });
      topControls.set({ y: TOP_SAND_START });
      bottomControls.set({ y: BOTTOM_SAND_START });
      streamControls.set({ opacity: 1 });
    }
  }, [isAnimating, duration, ease, rotateControls, topControls, bottomControls, streamControls]);

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
        <clipPath id={`fill-hourglass-top-clip-${width}`}>
          <path d="M 36 20 L 64 20 L 51.5 46.5 L 48.5 46.5 Z" />
        </clipPath>
        <clipPath id={`fill-hourglass-bottom-clip-${width}`}>
          <path d="M 48.5 53.5 L 51.5 53.5 L 64 80 L 36 80 Z" />
        </clipPath>
      </defs>
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        initial={{ rotate: 0 }}
        animate={rotateControls}
      >
        {/* Glass interior */}
        <path
          d="M 34 18 L 66 18 L 53 46 L 53 54 L 66 82 L 34 82 L 47 54 L 47 46 Z"
          fill={backgroundColor}
        />
        {/* Top sand */}
        <g clipPath={`url(#fill-hourglass-top-clip-${width})`}>
          <motion.rect
            x={34}
            width={32}
            height={16}
            fill={color}
            initial={{ y: TOP_SAND_START }}
            animate={topControls}
          />
        </g>
        {/* Falling stream */}
        <motion.line
          x1={50}
          y1={54}
          x2={50}
          y2={78}
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ opacity: 1 }}
          animate={streamControls}
        />
        {/* Bottom sand */}
        <g clipPath={`url(#fill-hourglass-bottom-clip-${width})`}>
          <motion.rect
            x={34}
            width={32}
            height={17}
            fill={color}
            initial={{ y: BOTTOM_SAND_START }}
            animate={bottomControls}
          />
        </g>
        {/* Glass outline */}
        <path
          d="M 34 18 L 66 18 L 53 46 L 53 54 L 66 82 L 34 82 L 47 54 L 47 46 Z"
          stroke={strokeColor}
          strokeWidth={5}
          strokeLinejoin="round"
          fill="none"
        />
        {/* Frame bars */}
        <line x1={30} y1={14} x2={70} y2={14} stroke={strokeColor} strokeWidth={5} strokeLinecap="round" />
        <line x1={30} y1={86} x2={70} y2={86} stroke={strokeColor} strokeWidth={5} strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}
