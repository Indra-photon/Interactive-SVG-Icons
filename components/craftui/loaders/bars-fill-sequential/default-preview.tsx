"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 45;
const HEIGHT = 45;

export default function BarsFillSequentialPreview() {
  const { color = "currentColor", barWidth = 9, gap = 9, duration = 0.5, ease = [0.215, 0.61, 0.355, 1], repeatDelay = 0.5 } = useLoaderProps();

  const bars = [
    { x: 0, delay: 0 },
    { x: barWidth + gap, delay: 0.17 },
    { x: (barWidth + gap) * 2, delay: 0.33 },
  ];

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      y: [HEIGHT, 0],
      transition: { duration, delay: bars[i].delay, repeat: Infinity, repeatDelay, ease },
    }));
  }, [duration, ease, repeatDelay, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {bars.map((bar, index) => (
        <motion.rect
          key={index}
          x={bar.x}
          width={barWidth}
          height={HEIGHT}
          fill={color}
          custom={index}
          initial={{ y: HEIGHT }}
          animate={controls}
        />
      ))}
    </svg>
  );
}
