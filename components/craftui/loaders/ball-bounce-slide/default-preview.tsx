"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 90;
const HEIGHT = 45;

export default function BallBounceSlidePreview() {
  const { color = "currentColor", lineColor = "currentColor", duration = 2.0, ease = "linear", strokeWidth = 3 } = useLoaderProps();

  const ballRadius = HEIGHT * 0.15;
  const ballCY = HEIGHT - ballRadius - 1.5;

  const controlsX = useAnimation();
  const controlsY = useAnimation();

  useEffect(() => {
    controlsX.start({
      x: [-WIDTH * 5, WIDTH * 5],
      transition: { duration, repeat: Infinity, ease },
    });
    controlsY.start({
      y: [0, -HEIGHT * 0.15, 0],
      transition: { duration: duration * 0.25, repeat: Infinity, times: [0, 0.08, 1], ease: [0.455, 0.03, 0.515, 0.955] },
    });
  }, [duration, ease, controlsX, controlsY]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img" style={{ overflow: "hidden" }}>
      <line x1={0} y1={HEIGHT - 1.5} x2={WIDTH} y2={HEIGHT - 1.5} stroke={lineColor} strokeWidth={strokeWidth} />
      <motion.g animate={controlsX}>
        <motion.circle cx={WIDTH * 0.425} cy={ballCY} r={ballRadius} fill={color} animate={controlsY} />
      </motion.g>
    </svg>
  );
}
