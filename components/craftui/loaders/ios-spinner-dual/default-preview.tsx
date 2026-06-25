"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

export default function IosSpinnerDualPreview() {
  const { color = "currentColor", duration = 1.2, ease = "linear" } = useLoaderProps();

  const outer = { count: 12, y: 26, height: 10, width: 3 };
  const inner = { count: 8, y: 34, height: 6, width: 2.5 };

  const controlsOuter = useAnimation();
  const controlsInner = useAnimation();

  useEffect(() => {
    controlsOuter.start({
      rotate: 360,
      transition: { duration, repeat: Infinity, ease, repeatType: "loop" },
    });
    controlsInner.start({
      rotate: -360,
      transition: { duration: duration * 0.75, repeat: Infinity, ease, repeatType: "loop" },
    });
  }, [duration, ease, controlsOuter, controlsInner]);

  return (
    <svg width={100} height={100} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <motion.g style={{ transformOrigin: "50px 50px" }} animate={controlsOuter}>
        {Array.from({ length: outer.count }).map((_, i) => (
          <rect
            key={i}
            x={50 - outer.width / 2}
            y={outer.y}
            width={outer.width}
            height={outer.height}
            rx={outer.width / 2}
            fill={color}
            opacity={1 - (i / outer.count) * 0.88}
            transform={`rotate(${(360 / outer.count) * i}, 50, 50)`}
          />
        ))}
      </motion.g>
      <motion.g style={{ transformOrigin: "50px 50px" }} animate={controlsInner}>
        {Array.from({ length: inner.count }).map((_, i) => (
          <rect
            key={i}
            x={50 - inner.width / 2}
            y={inner.y}
            width={inner.width}
            height={inner.height}
            rx={inner.width / 2}
            fill={color}
            opacity={1 - (i / inner.count) * 0.88}
            transform={`rotate(${(360 / inner.count) * i}, 50, 50)`}
          />
        ))}
      </motion.g>
    </svg>
  );
}
