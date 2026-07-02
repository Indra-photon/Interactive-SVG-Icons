"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

export default function GridWaveRowPreview() {
  const { color = "currentColor", dotSize = 16, duration = 1.4, ease = "easeInOut", gridSize = 3 } = useLoaderProps();

  const n = Math.max(2, Math.min(6, gridSize));
  const stride = 100 / (n + 1);
  const dotRadius = Math.min(dotSize, stride * 0.85) / 2;
  const totalCells = n * n;
  const waveStep = totalCells > 1 ? (duration * 0.57) / (totalCells - 1) : 0;

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      r: [dotRadius * 0.4, dotRadius, dotRadius * 0.4],
      opacity: [0.15, 1, 0.15],
      transition: { duration, repeat: Infinity, delay: i * waveStep, ease, times: [0, 0.35, 1] },
    }));
  }, [duration, ease, dotRadius, waveStep, controls]);

  return (
    <svg width={100} height={100} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {Array.from({ length: n }).map((_, row) =>
        Array.from({ length: n }).map((_, col) => (
          <motion.circle
            key={`${row}-${col}`}
            cx={stride + col * stride}
            cy={stride + row * stride}
            fill={color}
            custom={row * n + col}
            initial={{ r: dotRadius * 0.4, opacity: 0.15 }}
            animate={controls}
          />
        ))
      )}
    </svg>
  );
}
