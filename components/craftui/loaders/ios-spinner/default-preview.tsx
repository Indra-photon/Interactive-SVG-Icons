"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const SPOKES = 12;

export default function IosSpinnerPreview() {
  const { color = "currentColor", duration = 1.0, ease = "linear" } = useLoaderProps();

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      rotate: 360,
      transition: { duration, repeat: Infinity, ease, repeatType: "loop" },
    });
  }, [duration, ease, controls]);

  return (
    <svg width={100} height={100} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <motion.g style={{ transformOrigin: "50px 50px" }} animate={controls}>
        {Array.from({ length: SPOKES }).map((_, i) => (
          <rect
            key={i}
            x={48.5}
            y={26}
            width={3}
            height={10}
            rx={1.5}
            fill={color}
            opacity={1 - (i / SPOKES) * 0.85}
            transform={`rotate(${(360 / SPOKES) * i}, 50, 50)`}
          />
        ))}
      </motion.g>
    </svg>
  );
}
