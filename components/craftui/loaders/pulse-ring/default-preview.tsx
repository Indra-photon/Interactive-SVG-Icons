"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const SIZE = 100;

export default function PulseRingPreview() {
  const { color = "currentColor", ringCount = 3, thickness = 3, duration = 1.5, ease = "easeOut" } = useLoaderProps();

  const centerX = SIZE / 2;
  const centerY = SIZE / 2;
  const baseRadius = SIZE * 0.15;
  const maxRadius = SIZE * 0.45;

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      r: [baseRadius, maxRadius],
      opacity: [1, 0],
      transition: { duration, repeat: Infinity, delay: (duration / ringCount) * i, ease },
    }));
  }, [duration, ease, ringCount, baseRadius, maxRadius, controls]);

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {Array.from({ length: ringCount }).map((_, i) => (
        <motion.circle
          key={i}
          cx={centerX}
          cy={centerY}
          stroke={color}
          strokeWidth={thickness}
          fill="none"
          custom={i}
          initial={{ r: baseRadius, opacity: 1 }}
          animate={controls}
        />
      ))}
    </svg>
  );
}
