"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const SIZE = 100;

export default function ConicSpinnerPreview() {
  const { color = "currentColor", duration = 2.0, ease = "linear" } = useLoaderProps();

  const centerX = SIZE / 2;
  const centerY = SIZE / 2;
  const radius = SIZE / 2 - 2;

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      clipPath: [
        "polygon(50% 50%, 50% 0%, 50% 0%)",
        "polygon(50% 50%, 50% 0%, 100% 0%)",
        "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%)",
        "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%)",
        "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)",
        "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)",
      ],
      transition: { duration, repeat: Infinity, times: [0, 0.25, 0.5, 0.75, 0.875, 1], ease },
    });
  }, [duration, ease, controls]);

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <circle cx={centerX} cy={centerY} r={radius} fill="none" />
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill={color}
        stroke="none"
        initial={{ clipPath: "polygon(50% 50%, 50% 0%, 50% 0%)" }}
        animate={controls}
      />
    </svg>
  );
}
