"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

export default function BarsScaleBottomPreview() {
  const { color = "currentColor", width = 40, height = 40, gap = 4, duration = 1.0, ease = "easeInOut", staggerDelay = 0.15 } = useLoaderProps();

  const barWidth = (width - gap * 2) / 3;
  const baseHeight = height / 2;
  const minHeight = height / 4;

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      height: [baseHeight, minHeight, baseHeight],
      y: [height / 4, height - minHeight, height / 4],
      transition: { duration, repeat: Infinity, ease, delay: i * staggerDelay },
    }));
  }, [duration, ease, staggerDelay, baseHeight, minHeight, height, controls]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {[0, 1, 2].map((index) => (
        <motion.rect
          key={index}
          x={index * (barWidth + gap)}
          width={barWidth}
          fill={color}
          custom={index}
          initial={{ height: baseHeight, y: height / 4 }}
          animate={controls}
        />
      ))}
    </svg>
  );
}
