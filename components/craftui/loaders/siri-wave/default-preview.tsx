"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const barWidth = 6;
const barRx = 3;
const minH = 6;

const bars = [
  { cx: 26, maxH: 22, delay: 0.2 },
  { cx: 38, maxH: 32, delay: 0.1 },
  { cx: 50, maxH: 40, delay: 0 },
  { cx: 62, maxH: 32, delay: 0.1 },
  { cx: 74, maxH: 22, delay: 0.2 },
];

export default function SiriWavePreview() {
  const { color = "currentColor", duration = 1.2, ease = "easeInOut" } = useLoaderProps();

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      height: [minH, bars[i].maxH, minH],
      y: [50 - minH / 2, 50 - bars[i].maxH / 2, 50 - minH / 2],
      transition: { duration, repeat: Infinity, delay: bars[i].delay, ease, times: [0, 0.5, 1] },
    }));
  }, [duration, ease, controls]);

  return (
    <svg width={100} height={100} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {bars.map(({ cx, maxH }, i) => (
        <motion.rect
          key={i}
          x={cx - barWidth / 2}
          rx={barRx}
          width={barWidth}
          fill={color}
          custom={i}
          initial={{ height: minH, y: 50 - minH / 2 }}
          animate={controls}
        />
      ))}
    </svg>
  );
}
