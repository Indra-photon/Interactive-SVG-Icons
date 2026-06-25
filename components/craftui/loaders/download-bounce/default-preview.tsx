"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

export default function DownloadBouncePreview() {
  const { color = "currentColor", strokeWidth = 1.5, duration = 1.0, ease = "easeInOut" } = useLoaderProps();

  const controlsArrow = useAnimation();
  const controlsBar = useAnimation();

  useEffect(() => {
    controlsArrow.start({
      y: [0, 5, 0],
      transition: { duration, repeat: Infinity, ease, times: [0, 0.5, 1] },
    });
    controlsBar.start({
      y: [0, 0, 1.5, -0.4, 0],
      transition: { duration, repeat: Infinity, ease: "easeOut", times: [0, 0.5, 0.65, 0.82, 1] },
    });
  }, [duration, ease, controlsArrow, controlsBar]);

  return (
    <svg
      width={100}
      height={100}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
    >
      <motion.g animate={controlsArrow}>
        <line x1="12" y1="14" x2="12" y2="4" />
        <polyline points="9,11 12,14 15,11" />
      </motion.g>
      <motion.polyline points="5,15 5,19 19,19 19,15" animate={controlsBar} />
    </svg>
  );
}
