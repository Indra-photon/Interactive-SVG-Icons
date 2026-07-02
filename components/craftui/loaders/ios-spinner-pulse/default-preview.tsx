"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const COUNT = 12;

export default function IosSpinnerPulsePreview() {
  const { color = "currentColor", duration = 1.0, ease = "easeOut" } = useLoaderProps();

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      opacity: [0.1, 1, 0.35, 0.1],
      transition: { duration, repeat: Infinity, delay: i * (duration / COUNT), ease, times: [0, 0.08, 0.3, 1] },
    }));
  }, [duration, ease, controls]);

  return (
    <svg width={100} height={100} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {Array.from({ length: COUNT }).map((_, i) => (
        <motion.rect
          key={i}
          x={48.5}
          y={26}
          width={3}
          height={10}
          rx={1.5}
          fill={color}
          transform={`rotate(${(360 / COUNT) * i}, 50, 50)`}
          custom={i}
          initial={{ opacity: 0.1 }}
          animate={controls}
        />
      ))}
    </svg>
  );
}
