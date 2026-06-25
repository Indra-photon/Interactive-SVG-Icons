"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 45;
const HEIGHT = 45;

export default function BarsCascadePreview() {
  const { color = "currentColor", duration = 1.5, ease = [0.455, 0.03, 0.515, 0.955] } = useLoaderProps();

  const barHeight = HEIGHT * 0.26;
  const stripeWidth = WIDTH * 0.2;

  const bars = [
    { id: 0, ySequence: [-20, -20, -20, -20, 0, 0, 0, 0, 50] },
    { id: 1, ySequence: [-20, -20, -20, HEIGHT / 3, HEIGHT / 3, HEIGHT / 3, HEIGHT / 3, 50, 50] },
    { id: 2, ySequence: [-20, -20, (HEIGHT * 2) / 3, (HEIGHT * 2) / 3, (HEIGHT * 2) / 3, (HEIGHT * 2) / 3, 50, 50, 50] },
    { id: 3, ySequence: [-20, HEIGHT, HEIGHT, HEIGHT, HEIGHT, 50, 50, 50, 50] },
  ];

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      y: bars[i].ySequence,
      transition: { duration, repeat: Infinity, ease, times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1] },
    }));
  }, [duration, ease, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <defs>
        <pattern id="stripePatternPreview" patternUnits="userSpaceOnUse" width={stripeWidth * 2} height={barHeight}>
          <rect x="0" y="0" width={stripeWidth} height={barHeight} fill={color} />
          <rect x={stripeWidth} y="0" width={stripeWidth} height={barHeight} fill="transparent" />
        </pattern>
      </defs>
      {bars.map((bar, i) => (
        <motion.rect
          key={bar.id}
          x={0}
          width={WIDTH}
          height={barHeight}
          fill="url(#stripePatternPreview)"
          custom={i}
          initial={{ y: -20 }}
          animate={controls}
        />
      ))}
    </svg>
  );
}
