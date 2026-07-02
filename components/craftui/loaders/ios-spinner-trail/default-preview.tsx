"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const COUNT = 12;
const OPACITIES = [1, 0.82, 0.64, 0.48, 0.34, 0.22, 0.13, 0.07, 0.03, 0.01, 0.005, 0.001];

export default function IosSpinnerTrailPreview() {
  const { color = "currentColor", duration = 0.7, ease = "linear" } = useLoaderProps();
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      rotate: 360,
      transition: { duration, repeat: Infinity, ease, repeatType: "loop" },
    });
  }, [duration, ease, controls]);

  return (
    <svg
      width={100}
      height={100}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
    >
      <motion.g style={{ transformOrigin: "50px 50px" }} animate={controls}>
        {OPACITIES.map((opacity, i) => (
          <rect
            key={i}
            x={48.5}
            y={26}
            width={3}
            height={10}
            rx={1.5}
            fill={color}
            opacity={opacity}
            transform={`rotate(${(360 / COUNT) * i}, 50, 50)`}
          />
        ))}
      </motion.g>
    </svg>
  );
}
