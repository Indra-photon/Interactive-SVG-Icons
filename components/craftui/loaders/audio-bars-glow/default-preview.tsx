"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 100;
const HEIGHT = 100;
const BAR_COUNT = 6;

export default function AudioBarsGlowPreview() {
  const { color = "#3b82f6", barWidth = 4, gap = 3, duration = 0.8, ease = "easeInOut" } = useLoaderProps();

  const totalWidth = BAR_COUNT * barWidth + (BAR_COUNT - 1) * gap;
  const startX = (WIDTH - totalWidth) / 2;
  const minHeight = HEIGHT * 0.3;
  const maxHeight = HEIGHT * 0.8;

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => {
      const isOdd = i % 2 === 0;
      return {
        height: isOdd ? [minHeight, maxHeight, minHeight] : [maxHeight, minHeight, maxHeight],
        y: isOdd
          ? [(HEIGHT - minHeight) / 2, (HEIGHT - maxHeight) / 2, (HEIGHT - minHeight) / 2]
          : [(HEIGHT - maxHeight) / 2, (HEIGHT - minHeight) / 2, (HEIGHT - maxHeight) / 2],
        opacity: isOdd ? [0.5, 1, 0.5] : [1, 0.5, 1],
        transition: { duration, repeat: Infinity, ease },
      };
    });
  }, [duration, ease, minHeight, maxHeight, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <defs>
        <linearGradient id="barGradientGlowPreview" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="50%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
        <filter id="glowFilterPreview">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {Array.from({ length: BAR_COUNT }).map((_, index) => {
        const isOdd = index % 2 === 0;
        return (
          <motion.rect
            key={index}
            x={startX + index * (barWidth + gap)}
            width={barWidth}
            fill="url(#barGradientGlowPreview)"
            filter="url(#glowFilterPreview)"
            custom={index}
            initial={{
              height: isOdd ? minHeight : maxHeight,
              y: isOdd ? (HEIGHT - minHeight) / 2 : (HEIGHT - maxHeight) / 2,
              opacity: isOdd ? 0.5 : 1,
            }}
            animate={controls}
          />
        );
      })}
    </svg>
  );
}
