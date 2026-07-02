"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const COUNT = 12;
const ORBIT_RADIUS = 22;

export default function IosSpinnerDotsPreview() {
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
        {Array.from({ length: COUNT }).map((_, i) => {
          const angle = (2 * Math.PI * i) / COUNT - Math.PI / 2;
          const cx = 50 + ORBIT_RADIUS * Math.cos(angle);
          const cy = 50 + ORBIT_RADIUS * Math.sin(angle);
          return (
            <circle key={i} cx={cx} cy={cy} r={3.5} fill={color} opacity={1 - (i / COUNT) * 0.88} />
          );
        })}
      </motion.g>
    </svg>
  );
}
