"use client";

import { useEffect, useMemo } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 100;
const HEIGHT = 100;

export default function AudioWaveVerticalPreview() {
  const {
    color = "currentColor",
    barWidth = 3,
    gap = 3,
    barCount = 5,
    duration = 0.6,
    ease = "easeInOut",
    staggerDelay = 0.1,
  } = useLoaderProps();

  const totalWidth = barCount * barWidth + (barCount - 1) * gap;
  const startX = (WIDTH - totalWidth) / 2;

  const bars = useMemo(
    () =>
      Array.from({ length: barCount }, (_, i) => {
        const distanceFromCenter = Math.abs(i - Math.floor(barCount / 2));
        const minHeight = HEIGHT * 0.2;
        const maxHeight = HEIGHT * (0.9 - distanceFromCenter * 0.15);
        return {
          minHeight,
          maxHeight,
          duration: 0.6 + i * 0.08,
          delay: i * 0.1,
        };
      }),
    [barCount]
  );

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      height: [bars[i].minHeight, bars[i].maxHeight, bars[i].minHeight],
      y: [(HEIGHT - bars[i].minHeight) / 2, (HEIGHT - bars[i].maxHeight) / 2, (HEIGHT - bars[i].minHeight) / 2],
      transition: { duration: bars[i].duration, repeat: Infinity, ease, delay: bars[i].delay },
    }));
  }, [ease, bars, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {bars.map((bar, index) => (
        <motion.rect
          key={index}
          x={startX + index * (barWidth + gap)}
          width={barWidth}
          fill={color}
          custom={index}
          initial={{ height: bar.minHeight, y: (HEIGHT - bar.minHeight) / 2 }}
          animate={controls}
        />
      ))}
    </svg>
  );
}
