"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

export default function BarsScalePreview() {
  const { color = "currentColor", width = 40, height = 40, gap = 4, duration = 1.0, ease = "easeInOut", staggerDelay = 0.15 } = useLoaderProps();

  const barWidth = (width - gap * 2) / 3;

  const controls0 = useAnimation();
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controlsArr = [controls0, controls1, controls2];

  useEffect(() => {
    [0, 1, 2].forEach((i) => {
      controlsArr[i].start({
        scaleY: [1, 0.5, 1],
        y: [height / 4, height / 2 - height / 8, height / 4],
        transition: { duration, repeat: Infinity, ease, delay: i * staggerDelay },
      });
    });
  }, [duration, ease, staggerDelay, height, controls0, controls1, controls2]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {[0, 1, 2].map((index) => (
        <motion.rect
          key={index}
          x={index * (barWidth + gap)}
          y={height / 4}
          width={barWidth}
          height={height / 2}
          fill={color}
          animate={controlsArr[index]}
        />
      ))}
    </svg>
  );
}
