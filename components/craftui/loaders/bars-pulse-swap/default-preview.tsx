"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 45;
const HEIGHT = 45;

export default function BarsPulseSwapPreview() {
  const { color = "currentColor", barWidth = 9, gap = 9, duration = 0.5, ease = "easeInOut" } = useLoaderProps();

  const easeInOutQuad = [0.785, 0.135, 0.15, 0.86] as const;
  const tallHeight = HEIGHT;
  const shortHeight = HEIGHT * 0.2;

  const bars = [
    { x: 0, pairIndex: 0, barInPair: 0 },
    { x: 0, pairIndex: 0, barInPair: 1 },
    { x: barWidth + gap, pairIndex: 1, barInPair: 0 },
    { x: barWidth + gap, pairIndex: 1, barInPair: 1 },
    { x: (barWidth + gap) * 2, pairIndex: 2, barInPair: 0 },
    { x: (barWidth + gap) * 2, pairIndex: 2, barInPair: 1 },
  ];

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => {
      const { pairIndex, barInPair } = bars[i];
      let yPositions: number[];
      if (pairIndex === 0) {
        yPositions = barInPair === 0
          ? [0, HEIGHT / 2, 0]
          : [HEIGHT - shortHeight, HEIGHT / 2, HEIGHT - shortHeight];
      } else if (pairIndex === 1) {
        yPositions = barInPair === 0
          ? [HEIGHT / 2, 0, HEIGHT / 2]
          : [HEIGHT / 2, HEIGHT - shortHeight, HEIGHT / 2];
      } else {
        yPositions = barInPair === 0
          ? [0, HEIGHT / 2, 0]
          : [HEIGHT - shortHeight, HEIGHT / 2, HEIGHT - shortHeight];
      }
      return {
        height: [tallHeight, shortHeight],
        y: yPositions,
        transition: {
          height: { duration, repeat: Infinity, repeatType: "reverse", ease: easeInOutQuad },
          y: { duration, repeat: Infinity, ease: easeInOutQuad, times: [0, 0.5, 1] },
        },
      };
    });
  }, [duration, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {bars.map((bar, index) => {
        const { pairIndex, barInPair } = bar;
        let initialY: number;
        if (pairIndex === 0 || pairIndex === 2) {
          initialY = barInPair === 0 ? 0 : HEIGHT - shortHeight;
        } else {
          initialY = HEIGHT / 2;
        }
        return (
          <motion.rect
            key={index}
            x={bar.x}
            width={barWidth}
            fill={color}
            custom={index}
            initial={{ height: tallHeight, y: initialY }}
            animate={controls}
          />
        );
      })}
    </svg>
  );
}
