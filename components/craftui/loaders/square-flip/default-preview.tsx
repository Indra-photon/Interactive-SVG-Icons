"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

export default function SquareFlipPreview() {
  const { color = "currentColor", width = 40, height = 40, duration = 1.2, ease = "easeInOut" } = useLoaderProps();

  const size = Math.min(width, height) * 0.6;

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      rotateY: [0, 180, 360],
      transition: { duration, repeat: Infinity, ease },
    });
  }, [duration, ease, controls]);

  return (
    <div style={{ width, height, perspective: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div
        style={{
          width: size,
          height: size,
          borderRadius: 2,
          transformStyle: "preserve-3d",
          position: "relative",
        }}
        animate={controls}
      >
        <div style={{ position: "absolute", inset: 0, borderRadius: 2, backgroundColor: color, backfaceVisibility: "hidden" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 2, border: `2.5px solid ${color}`, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }} />
      </motion.div>
    </div>
  );
}
