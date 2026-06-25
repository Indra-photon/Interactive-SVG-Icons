"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

export default function DotsCompressPreview() {
  const { color = "currentColor", width = 60, dotSize = 12, duration = 1.0, ease = [0.455, 0.03, 0.515, 0.955] } = useLoaderProps();

  const startHeight = width / 4;
  const endWidth = 25;
  const endHeight = 25;

  const dots = [
    { id: 0, startX: 6, startY: startHeight / 2, endX: endWidth / 2, endY: dotSize / 2 + 1 },
    { id: 1, startX: width / 2, startY: startHeight / 2, endX: endWidth / 2, endY: endHeight / 2 },
    { id: 2, startX: width - 6, startY: startHeight / 2, endX: endWidth / 2, endY: endHeight - dotSize / 2 - 1 },
  ];

  const controlsSvg = useAnimation();
  const controlsDots = useAnimation();

  useEffect(() => {
    controlsSvg.start({
      width: [width, endWidth],
      height: [startHeight, endHeight],
      transition: { duration, repeat: Infinity, repeatType: "reverse", ease },
    });
    controlsDots.start((i) => ({
      cx: [dots[i].startX, dots[i].endX],
      cy: [dots[i].startY, dots[i].endY],
      transition: { duration, repeat: Infinity, repeatType: "reverse", ease },
    }));
  }, [duration, ease, controlsSvg, controlsDots]);

  return (
    <motion.svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
      animate={controlsSvg}
      initial={{ width, height: startHeight }}
    >
      {dots.map((dot) => (
        <motion.circle
          key={dot.id}
          r={dotSize / 2}
          fill={color}
          custom={dot.id}
          initial={{ cx: dot.startX, cy: dot.startY }}
          animate={controlsDots}
        />
      ))}
    </motion.svg>
  );
}
