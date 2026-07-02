"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 100;
const HEIGHT = 100;
const BAR_COUNT = 6;

export default function AudioBarsHorizontalPreview() {
  const { color = "currentColor", barWidth = 4, gap = 3, duration = 0.8, ease = "easeInOut" } = useLoaderProps();

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
        transition: { duration, repeat: Infinity, ease },
      };
    });
  }, [duration, ease, minHeight, maxHeight, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {Array.from({ length: BAR_COUNT }).map((_, index) => {
        const isOdd = index % 2 === 0;
        return (
          <motion.rect
            key={index}
            x={startX + index * (barWidth + gap)}
            width={barWidth}
            fill={color}
            custom={index}
            initial={{
              height: isOdd ? minHeight : maxHeight,
              y: isOdd ? (HEIGHT - minHeight) / 2 : (HEIGHT - maxHeight) / 2,
            }}
            animate={controls}
          />
        );
      })}
    </svg>
  );
}
