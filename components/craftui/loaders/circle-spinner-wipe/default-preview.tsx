"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const SIZE = 100;

export default function CircleSpinnerWipePreview() {
  const {
    color = "currentColor",
    backgroundColor = "#dddddd",
    thickness = 10,
    duration = 2.0,
    ease = "linear",
    strokeLinecap = "butt",
  } = useLoaderProps();

  const centerX = SIZE / 2;
  const centerY = SIZE / 2;
  const radius = SIZE / 2 - thickness / 2;
  const circumference = 2 * Math.PI * radius;

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      strokeDashoffset: [circumference, 0],
      transition: { duration, repeat: Infinity, ease },
    });
  }, [duration, ease, circumference, controls]);

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <circle cx={centerX} cy={centerY} r={radius} stroke={backgroundColor} strokeWidth={thickness} fill="none" />
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={radius}
        stroke={color}
        strokeWidth={thickness}
        fill="none"
        strokeLinecap={strokeLinecap as "round" | "butt" | "square"}
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={controls}
        style={{ transformOrigin: `${centerX}px ${centerY}px`, rotate: -90 }}
      />
    </svg>
  );
}
