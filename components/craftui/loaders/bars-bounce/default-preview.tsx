"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 45;
const HEIGHT = 45;

export default function BarsBouncePreview() {
  const { color = "currentColor", barWidth = 9, gap = 9, duration = 1.0, ease = "easeInOut" } = useLoaderProps();

  const bars = [
    { x: 0 },
    { x: barWidth + gap },
    { x: (barWidth + gap) * 2 },
  ];
  const tallHeight = HEIGHT;
  const shortHeight = HEIGHT * 0.4;

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => {
      const isFirstOrLast = i === 0 || i === 2;
      return {
        height: [tallHeight, shortHeight, tallHeight],
        y: isFirstOrLast
          ? [0, HEIGHT - shortHeight, HEIGHT - tallHeight]
          : [HEIGHT - tallHeight, 0, HEIGHT - tallHeight],
        transition: { duration, repeat: Infinity, ease, times: [0, 0.5, 1] },
      };
    });
  }, [duration, ease, tallHeight, shortHeight, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {bars.map((bar, index) => {
        const isFirstOrLast = index === 0 || index === 2;
        return (
          <motion.rect
            key={index}
            x={bar.x}
            width={barWidth}
            fill={color}
            custom={index}
            initial={{ height: tallHeight, y: isFirstOrLast ? 0 : HEIGHT - tallHeight }}
            animate={controls}
          />
        );
      })}
    </svg>
  );
}
