"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

export default function GridClockPreview() {
  const { color = "currentColor", dotSize = 16, duration = 1.4, ease = "easeInOut", gridSize = 3 } = useLoaderProps();

  const n = Math.max(2, Math.min(6, gridSize));
  const stride = 100 / (n + 1);
  const dotRadius = Math.min(dotSize, stride * 0.85) / 2;

  const mid = (n - 1) / 2;
  const maxDelay = duration * 0.69;
  const delays = Array.from({ length: n * n }, (_, i) => {
    const row = Math.floor(i / n), col = i % n;
    const dr = -(row - mid), dc = col - mid;
    if (dr === 0 && dc === 0) return maxDelay;
    const angle = (Math.atan2(dc, dr) + 2 * Math.PI) % (2 * Math.PI);
    return (angle / (2 * Math.PI)) * maxDelay;
  });

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      r: [dotRadius * 0.4, dotRadius, dotRadius * 0.4],
      opacity: [0.15, 1, 0.15],
      transition: { duration, repeat: Infinity, delay: delays[i], ease, times: [0, 0.35, 1] },
    }));
  }, [duration, ease, dotRadius, n, controls]);

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
