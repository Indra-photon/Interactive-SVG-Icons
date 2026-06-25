"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

export default function ActivityRingsPreview() {
  const { color = "currentColor", duration = 2.4, ease = "linear", strokeWidth = 5, strokeLinecap = "round" } = useLoaderProps();

  const rings = [
    { r: 38, speed: duration, opacity: 1 },
    { r: 27, speed: duration * 0.75, opacity: 0.7 },
    { r: 16, speed: duration * 0.5, opacity: 0.4 },
  ];

  const controls0 = useAnimation();
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controlsArr = [controls0, controls1, controls2];

  useEffect(() => {
    rings.forEach(({ speed }, i) => {
      controlsArr[i].start({
        rotate: 360,
        transition: { duration: speed, repeat: Infinity, ease, repeatType: "loop" },
      });
    });
  }, [duration, ease, controls0, controls1, controls2]);

  return (
    <svg width={100} height={100} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {rings.map(({ r, opacity }, i) => {
        const circumference = 2 * Math.PI * r;
        const dashArray = `${circumference * 0.75} ${circumference * 0.25}`;
        return (
          <g key={i}>
            <circle cx={50} cy={50} r={r} stroke={color} strokeWidth={strokeWidth} fill="none" opacity={0.1} />
            <motion.g style={{ transformOrigin: "50px 50px" }} initial={{ rotate: -90 }} animate={controlsArr[i]}>
              <circle
                cx={50}
                cy={50}
                r={r}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                strokeLinecap={strokeLinecap as "round" | "butt" | "square"}
                fill="none"
                opacity={opacity}
              />
            </motion.g>
          </g>
        );
      })}
    </svg>
  );
}
