"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const heartPath = "M30,50 C10,35 5,25 5,18 C5,10 12,5 20,5 C24,5 28,7 30,10 C32,7 36,5 40,5 C48,5 55,10 55,18 C55,25 50,35 30,50 Z";

export default function HeartFillPreview() {
  const { color = "#dc1818", backgroundColor = "#cccccc", duration = 2.0, ease = "easeOut" } = useLoaderProps();

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      y: [60, 60, 0],
      transition: { duration, repeat: Infinity, times: [0, 0.2, 1], ease },
    });
  }, [duration, ease, controls]);

  return (
    <svg width={100} height={100} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <defs>
        <clipPath id="heartClipPreview">
          <path d={heartPath} />
        </clipPath>
      </defs>
      <path d={heartPath} fill={backgroundColor} />
      <g clipPath="url(#heartClipPreview)">
        <motion.rect x={0} width={60} height={60} fill={color} initial={{ y: 60 }} animate={controls} />
      </g>
    </svg>
  );
}
