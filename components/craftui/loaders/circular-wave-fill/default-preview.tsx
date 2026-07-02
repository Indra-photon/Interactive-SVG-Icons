"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const SIZE = 100;

export default function CircularWaveFillPreview() {
  const { color = "#269af2", backgroundColor = "#cccccc", duration = 2.0, ease = "linear" } = useLoaderProps();

  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const r = SIZE / 2;
  const amplitude = r * 0.12;
  const waveWidth = SIZE;

  const getWavePath = (yOffset: number) => {
    const y = cy + r - yOffset;
    const cp1 = y - amplitude;
    const cp2 = y + amplitude;
    return `M ${-waveWidth},${y} Q ${cx / 2},${cp1} ${cx},${y} Q ${cx * 1.5},${cp2} ${waveWidth * 2},${y} L ${waveWidth * 2},${cy + r + 10} L ${-waveWidth},${cy + r + 10} Z`;
  };

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      d: [getWavePath(0), getWavePath(r), getWavePath(r * 2)],
      transition: { duration, repeat: Infinity, ease, times: [0, 0.5, 1] },
    });
  }, [duration, ease, controls]);

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <defs>
        <clipPath id="circleClipPreview">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={backgroundColor} />
      <g clipPath="url(#circleClipPreview)">
        <motion.path fill={color} initial={{ d: getWavePath(0) }} animate={controls} />
      </g>
    </svg>
  );
}
