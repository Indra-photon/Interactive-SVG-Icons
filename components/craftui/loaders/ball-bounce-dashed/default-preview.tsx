"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 90;
const HEIGHT = 45;

export default function BallBounceDashedPreview() {
  const { color = "currentColor", lineColor = "currentColor", duration = 0.75, ease = "linear", strokeWidth = 3 } = useLoaderProps();

  const ballRadius = HEIGHT * 0.15;
  const ballCY = HEIGHT - ballRadius - 1.5;
  const dashLength = WIDTH * 0.5;

  const controlsLine = useAnimation();
  const controlsBall = useAnimation();

  useEffect(() => {
    controlsLine.start({
      strokeDashoffset: [0, -WIDTH],
      transition: { duration, repeat: Infinity, ease },
    });
    controlsBall.start({
      y: [0, -HEIGHT * 0.15, 0],
      transition: { duration, repeat: Infinity, times: [0, 0.08, 1], ease: [0.455, 0.03, 0.515, 0.955] },
    });
  }, [duration, ease, controlsLine, controlsBall]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <motion.line
        x1={0}
        y1={HEIGHT - 1.5}
        x2={WIDTH}
        y2={HEIGHT - 1.5}
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dashLength} ${dashLength}`}
        initial={{ strokeDashoffset: 0 }}
        animate={controlsLine}
      />
      <motion.circle
        cx={WIDTH * 0.5}
        cy={ballCY}
        r={ballRadius}
        fill={color}
        initial={{ y: 0 }}
        animate={controlsBall}
      />
    </svg>
  );
}
