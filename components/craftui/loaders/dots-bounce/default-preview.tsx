"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 100;
const HEIGHT = 50;

export default function DotsBouncePreview() {
  const { color = "currentColor", dotSize = 8, dotCount = 3, duration = 0.8, ease = "easeInOut", staggerDelay = 0.15 } = useLoaderProps();

  const dotRadius = dotSize / 2;
  const centerY = HEIGHT / 2;
  const bounceHeight = HEIGHT * 0.3;
  const totalDotsWidth = dotCount * dotSize;
  const spacing = (WIDTH - totalDotsWidth) / (dotCount + 1);

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      y: [0, -bounceHeight, 0],
      transition: { duration, repeat: Infinity, delay: i * staggerDelay, ease },
    }));
  }, [duration, ease, staggerDelay, bounceHeight, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {Array.from({ length: dotCount }).map((_, i) => {
        const cx = spacing * (i + 1) + dotSize * i + dotRadius;
        return (
          <motion.circle
            key={i}
            cx={cx}
            cy={centerY}
            r={dotRadius}
            fill={color}
            custom={i}
            animate={controls}
          />
        );
      })}
    </svg>
  );
}
