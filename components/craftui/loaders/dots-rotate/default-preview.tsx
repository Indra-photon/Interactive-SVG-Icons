"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 100;
const HEIGHT = 115; // aspect ratio ~1.154 scaled to 100

export default function DotsRotatePreview() {
  const { color = "currentColor", dotSize = 14, duration = 1.0, ease = [0.645, 0.045, 0.355, 1] } = useLoaderProps();

  const positions = [
    { x: WIDTH / 2, y: dotSize / 2 },
    { x: dotSize / 2, y: HEIGHT - dotSize / 2 },
    { x: WIDTH - dotSize / 2, y: HEIGHT - dotSize / 2 },
  ];

  const dots = [
    { id: 0, startPos: 0 },
    { id: 1, startPos: 1 },
    { id: 2, startPos: 2 },
  ];

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => {
      const startPos = dots[i].startPos;
      const nextPos = (startPos + 2) % 3;
      return {
        cx: [positions[startPos].x, positions[nextPos].x],
        cy: [positions[startPos].y, positions[nextPos].y],
        transition: { duration, repeat: Infinity, ease, times: [0, 1] },
      };
    });
  }, [duration, ease, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {dots.map((dot) => (
        <motion.circle
          key={dot.id}
          r={dotSize / 2}
          fill={color}
          custom={dot.id}
          initial={{ cx: positions[dot.startPos].x, cy: positions[dot.startPos].y }}
          animate={controls}
        />
      ))}
    </svg>
  );
}
