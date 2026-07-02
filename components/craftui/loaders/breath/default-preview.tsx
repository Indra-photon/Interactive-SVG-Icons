"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

export default function BreathPreview() {
  const { color = "currentColor", duration = 4.0, ease = "easeInOut" } = useLoaderProps();

  const controlsGlow = useAnimation();
  const controlsCore = useAnimation();

  useEffect(() => {
    controlsGlow.start({
      r: [14, 28, 14],
      opacity: [0, 0.25, 0],
      transition: { duration, repeat: Infinity, ease, delay: 0.3, times: [0, 0.5, 1] },
    });
    controlsCore.start({
      r: [8, 20, 8],
      opacity: [0.25, 1, 0.25],
      transition: { duration, repeat: Infinity, ease, times: [0, 0.5, 1] },
    });
  }, [duration, ease, controlsGlow, controlsCore]);

  return (
    <svg width={100} height={100} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <motion.circle cx={50} cy={50} stroke={color} strokeWidth={1} fill="none" initial={{ r: 14, opacity: 0 }} animate={controlsGlow} />
      <motion.circle cx={50} cy={50} fill={color} initial={{ r: 8, opacity: 0.25 }} animate={controlsCore} />
    </svg>
  );
}
