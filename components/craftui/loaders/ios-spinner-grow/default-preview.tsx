"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const COUNT = 12;

export default function IosSpinnerGrowPreview() {
  const { color = "currentColor", duration = 1.0, ease = "easeInOut" } = useLoaderProps();

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      y: [34, 26, 34],
      height: [4, 12, 4],
      opacity: [0.1, 1, 0.1],
      transition: { duration, repeat: Infinity, delay: i * (duration / COUNT), ease, times: [0, 0.3, 1] },
    }));
  }, [duration, ease, controls]);

  return (
    <svg width={100} height={100} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {Array.from({ length: COUNT }).map((_, i) => (
        <g key={i} transform={`rotate(${(360 / COUNT) * i}, 50, 50)`}>
          <motion.rect
            x={48.5}
            width={3}
            rx={1.5}
            fill={color}
            custom={i}
            initial={{ y: 34, height: 4, opacity: 0.1 }}
            animate={controls}
          />
        </g>
      ))}
    </svg>
  );
}
