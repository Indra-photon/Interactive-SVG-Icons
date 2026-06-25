"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 100;
const HEIGHT = 50;

export default function InfinityLoopPreview() {
  const {
    color = "currentColor",
    pathColor = "#cccccc",
    dotSize = 6,
    showPath = true,
    duration = 2.5,
    ease = "linear",
    strokeWidth = 2,
    strokeLinecap = "round",
  } = useLoaderProps();

  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const r = HEIGHT * 0.35;
  const dotR = dotSize / 2;

  const infinityPath = [
    `M ${cx},${cy}`,
    `C ${cx + r * 0.5},${cy - r * 1.2} ${cx + r * 2},${cy - r * 1.2} ${cx + r * 2},${cy}`,
    `C ${cx + r * 2},${cy + r * 1.2} ${cx + r * 0.5},${cy + r * 1.2} ${cx},${cy}`,
    `C ${cx - r * 0.5},${cy - r * 1.2} ${cx - r * 2},${cy - r * 1.2} ${cx - r * 2},${cy}`,
    `C ${cx - r * 2},${cy + r * 1.2} ${cx - r * 0.5},${cy + r * 1.2} ${cx},${cy}`,
  ].join(" ");

  const steps = 60;
  const xKeyframes: number[] = [];
  const yKeyframes: number[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = (2 * Math.PI * i) / steps;
    const scale = r * 1.8;
    const denom = 1 + Math.sin(t) * Math.sin(t);
    xKeyframes.push(cx + (scale * Math.cos(t)) / denom);
    yKeyframes.push(cy + (scale * Math.sin(t) * Math.cos(t)) / denom);
  }

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      cx: xKeyframes,
      cy: yKeyframes,
      transition: { duration, repeat: Infinity, ease },
    });
  }, [duration, ease, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {showPath && (
        <path
          d={infinityPath}
          stroke={pathColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap={strokeLinecap as "round" | "butt" | "square"}
        />
      )}
      <motion.circle
        r={dotR}
        fill={color}
        initial={{ cx: xKeyframes[0], cy: yKeyframes[0] }}
        animate={controls}
      />
    </svg>
  );
}
