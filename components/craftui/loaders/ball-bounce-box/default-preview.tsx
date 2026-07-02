"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 60;
const HEIGHT = 60;

export default function BallBounceBoxPreview() {
  const { color = "currentColor", boxColor = "currentColor", duration = 0.5, ease = "easeOut", strokeWidth = 3 } = useLoaderProps();

  const ballRadius = WIDTH * 0.15;
  const ballX = WIDTH * 0.35 + ballRadius;
  const ballY = HEIGHT - ballRadius - strokeWidth;
  const viewBoxPadding = WIDTH * 0.2;
  const viewBoxSize = WIDTH + viewBoxPadding * 2;
  const offset = viewBoxPadding;

  const controlsBox = useAnimation();
  const controlsBall = useAnimation();

  useEffect(() => {
    controlsBox.start({
      rotate: [0, 0, 90, 90],
      transition: { duration, repeat: Infinity, times: [0, 0.2, 0.8, 1], ease },
    });
    controlsBall.start({
      y: [0, -HEIGHT * 0.4, 0],
      transition: { duration, repeat: Infinity, times: [0, 0.08, 1], ease },
    });
  }, [duration, ease, controlsBox, controlsBall]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`${-offset} ${-offset} ${viewBoxSize} ${viewBoxSize}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <motion.rect
        x={strokeWidth / 2}
        y={strokeWidth / 2}
        width={WIDTH - strokeWidth}
        height={HEIGHT - strokeWidth}
        stroke={boxColor}
        strokeWidth={strokeWidth}
        fill="none"
        initial={{ rotate: 0 }}
        animate={controlsBox}
        style={{ originX: `${WIDTH / 2}px`, originY: `${HEIGHT / 2}px` }}
      />
      <motion.circle
        cx={ballX}
        cy={ballY}
        r={ballRadius}
        fill={color}
        initial={{ y: 0 }}
        animate={controlsBall}
      />
    </svg>
  );
}
