"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 200;
const HEIGHT = 60;

export default function SpotlightPreview() {
  const { color = "currentColor", duration = 2.0, ease = "easeInOut", repeatDelay = 0.6 } = useLoaderProps();

  const gradientId = "spotlight-gradient-preview";
  const spotW = WIDTH * 0.45;
  const spotH = HEIGHT * 0.7;

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      cx: [-spotW / 2, WIDTH + spotW / 2],
      transition: { duration, repeat: Infinity, ease, repeatDelay },
    });
  }, [duration, ease, repeatDelay, spotW, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="45%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.ellipse
        cy={HEIGHT / 2}
        rx={spotW / 2}
        ry={spotH / 2}
        fill={`url(#${gradientId})`}
        initial={{ cx: -spotW / 2 }}
        animate={controls}
      />
    </svg>
  );
}
