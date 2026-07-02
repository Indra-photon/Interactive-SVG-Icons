"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 100;
const HEIGHT = 86; // ~100 * 0.866 (equilateral triangle ratio scaled)

export default function TriangleCascadePreview() {
  const { color = "currentColor", bars = 5, duration = 2.0, ease = "easeInOut", strokeWidth = 1, staggerDelay = 0.4 } = useLoaderProps();

  const barHeight = HEIGHT / bars + 1;

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      y: [-barHeight, HEIGHT - (i + 1) * barHeight],
      transition: { duration, repeat: Infinity, delay: i * staggerDelay, ease, times: [0, 1] },
    }));
  }, [duration, ease, staggerDelay, barHeight, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <defs>
        <clipPath id="triangleClipPreview">
          <polygon points={`${WIDTH / 2},0 ${WIDTH},${HEIGHT} 0,${HEIGHT}`} />
        </clipPath>
      </defs>
      <polygon
        points={`${WIDTH / 2},0 ${WIDTH},${HEIGHT} 0,${HEIGHT}`}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        opacity={0.2}
      />
      <g clipPath="url(#triangleClipPreview)">
        {Array.from({ length: bars }).map((_, i) => (
          <motion.rect
            key={i}
            x={0}
            width={WIDTH}
            height={barHeight}
            fill={color}
            custom={i}
            initial={{ y: -barHeight }}
            animate={controls}
          />
        ))}
      </g>
    </svg>
  );
}
