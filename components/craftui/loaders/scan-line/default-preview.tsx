"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 200;
const HEIGHT = 4;

export default function ScanLinePreview() {
  const { color = "currentColor", trailLength = 80, duration = 1.4, ease = "linear", repeatDelay = 0.4 } = useLoaderProps();

  const gradientId = "scan-gradient-preview";
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      x: [-trailLength, WIDTH],
      transition: { duration, repeat: Infinity, ease, repeatDelay },
    });
  }, [duration, ease, repeatDelay, trailLength, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="60%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill={color} opacity={0.12} rx={HEIGHT / 2} />
      <motion.rect
        y={0}
        width={trailLength}
        height={HEIGHT}
        rx={HEIGHT / 2}
        fill={`url(#${gradientId})`}
        initial={{ x: -trailLength }}
        animate={controls}
      />
    </svg>
  );
}
