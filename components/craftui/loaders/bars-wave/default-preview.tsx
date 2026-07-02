"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

export default function BarsWavePreview() {
  const { color = "currentColor", barWidth = 3, duration = 1.0, ease = "easeInOut" } = useLoaderProps();

  const bars = [
    { x: 0, delay: 0 },
    { x: 10, delay: 0.1 },
    { x: 20, delay: 0.3 },
    { x: 30, delay: 0.5 },
    { x: 40, delay: 0.1 },
  ];

  const controls0 = useAnimation();
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();
  const controls4 = useAnimation();
  const controlsArr = [controls0, controls1, controls2, controls3, controls4];

  useEffect(() => {
    bars.forEach((bar, i) => {
      controlsArr[i].start({
        height: [30, 100, 30],
        y: [70, 0, 70],
        transition: { duration, repeat: Infinity, ease, delay: bar.delay },
      });
    });
  }, [duration, ease, controls0, controls1, controls2, controls3, controls4]);

  return (
    <svg width={100} height={100} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {bars.map((bar, index) => (
        <motion.rect
          key={index}
          x={bar.x}
          width={barWidth}
          fill={color}
          initial={{ height: 30, y: 70 }}
          animate={controlsArr[index]}
        />
      ))}
    </svg>
  );
}
