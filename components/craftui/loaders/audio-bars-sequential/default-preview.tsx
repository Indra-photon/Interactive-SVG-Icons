"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 100;
const HEIGHT = 100;
const BAR_COUNT = 6;

export default function AudioBarsSequentialPreview() {
  const { color = "currentColor", barWidth = 4, gap = 3, duration = 1.2, ease = "easeInOut" } = useLoaderProps();

  const totalWidth = BAR_COUNT * barWidth + (BAR_COUNT - 1) * gap;
  const startX = (WIDTH - totalWidth) / 2;
  const minHeight = HEIGHT * 0.3;
  const maxHeight = HEIGHT * 0.8;

  const controls = useAnimation();

  useEffect(() => {
    const delayPerBar = duration / BAR_COUNT;
    controls.start((i) => ({
      height: [minHeight, maxHeight, minHeight],
      y: [(HEIGHT - minHeight) / 2, (HEIGHT - maxHeight) / 2, (HEIGHT - minHeight) / 2],
      transition: { duration, repeat: Infinity, ease, delay: i * delayPerBar },
    }));
  }, [duration, ease, minHeight, maxHeight, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {Array.from({ length: BAR_COUNT }).map((_, index) => (
        <motion.rect
          key={index}
          x={startX + index * (barWidth + gap)}
          width={barWidth}
          fill={color}
          custom={index}
          initial={{ height: minHeight, y: (HEIGHT - minHeight) / 2 }}
          animate={controls}
        />
      ))}
    </svg>
  );
}
