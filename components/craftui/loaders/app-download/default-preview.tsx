"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

export default function AppDownloadPreview() {
  const {
    color = "currentColor",
    trackOpacity = 0.12,
    duration = 1.5,
    ease = "easeInOut",
    strokeWidth = 5,
    strokeLinecap = "round",
    repeatDelay = 0.4,
  } = useLoaderProps();

  const r = 38;
  const circumference = 2 * Math.PI * r;
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      strokeDashoffset: [circumference, 0],
      transition: { duration, repeat: Infinity, ease, repeatDelay },
    });
  }, [duration, ease, repeatDelay, circumference, controls]);

  return (
    <svg width={100} height={100} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <circle cx={50} cy={50} r={r} stroke={color} strokeWidth={strokeWidth} fill="none" opacity={trackOpacity} />
      <motion.circle
        cx={50}
        cy={50}
        r={r}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap as "round" | "butt" | "square"}
        fill="none"
        transform="rotate(-90, 50, 50)"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={controls}
      />
    </svg>
  );
}
