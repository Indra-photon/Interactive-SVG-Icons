"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

export default function BarsFadePreview() {
  const { color = "currentColor", size = 40, gap = 4, duration = 1.2, ease = "easeInOut", staggerDelay = 0.2 } = useLoaderProps();

  const barWidth = (size - gap * 2) / 3;

  const controls0 = useAnimation();
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controlsArr = [controls0, controls1, controls2];

  useEffect(() => {
    [0, 1, 2].forEach((i) => {
      controlsArr[i].start({
        opacity: [1, 0.3, 1],
        transition: { duration, repeat: Infinity, ease, delay: i * staggerDelay },
      });
    });
  }, [duration, ease, staggerDelay, controls0, controls1, controls2]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {[0, 1, 2].map((index) => (
        <motion.rect
          key={index}
          x={index * (barWidth + gap)}
          y={size / 4}
          width={barWidth}
          height={size / 2}
          fill={color}
          animate={controlsArr[index]}
        />
      ))}
    </svg>
  );
}
