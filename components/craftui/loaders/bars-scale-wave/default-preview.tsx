"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 100;
const HEIGHT = 100;

export default function BarsScaleWavePreview() {
  const { color = "currentColor", barCount = 5, barWidth = 8, duration = 1.0, ease = "easeInOut", staggerDelay = 0.1 } = useLoaderProps();

  const totalBarsWidth = barCount * barWidth;
  const spacing = (WIDTH - totalBarsWidth) / (barCount + 1);
  const minHeightRatio = 0.3;

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      scaleY: [minHeightRatio, 1, minHeightRatio],
      y: [HEIGHT * (1 - minHeightRatio) / 2, 0, HEIGHT * (1 - minHeightRatio) / 2],
      transition: { duration, repeat: Infinity, delay: i * staggerDelay, ease },
    }));
  }, [duration, ease, staggerDelay, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {Array.from({ length: barCount }).map((_, i) => {
        const x = spacing * (i + 1) + barWidth * i;
        return (
          <motion.rect
            key={i}
            x={x}
            y={0}
            width={barWidth}
            height={HEIGHT}
            fill={color}
            rx={barWidth / 2}
            custom={i}
            initial={{ scaleY: minHeightRatio, y: HEIGHT * (1 - minHeightRatio) / 2 }}
            animate={controls}
            style={{ originY: "center", transformOrigin: `${x + barWidth / 2}px ${HEIGHT / 2}px` }}
          />
        );
      })}
    </svg>
  );
}
