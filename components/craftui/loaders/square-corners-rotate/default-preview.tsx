"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 100;
const HEIGHT = 100;

export default function SquareCornersRotatePreview() {
  const { color = "currentColor", duration = 1.5, ease = [0.3, 1, 0, 1], strokeWidth = 3, strokeLinecap = "round" } = useLoaderProps();

  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const arcR = Math.min(WIDTH, HEIGHT) * 0.45;
  const inset = Math.min(WIDTH, HEIGHT) * 0.5;

  const topArc = `M ${cx - arcR * 0.707},${inset - arcR * 0.707} A ${arcR},${arcR} 0 0,1 ${cx + arcR * 0.707},${inset - arcR * 0.707}`;
  const rightArc = `M ${WIDTH - inset + arcR * 0.707},${cy - arcR * 0.707} A ${arcR},${arcR} 0 0,1 ${WIDTH - inset + arcR * 0.707},${cy + arcR * 0.707}`;
  const bottomArc = `M ${cx + arcR * 0.707},${HEIGHT - inset + arcR * 0.707} A ${arcR},${arcR} 0 0,1 ${cx - arcR * 0.707},${HEIGHT - inset + arcR * 0.707}`;
  const leftArc = `M ${inset - arcR * 0.707},${cy + arcR * 0.707} A ${arcR},${arcR} 0 0,1 ${inset - arcR * 0.707},${cy - arcR * 0.707}`;

  const arcs = [topArc, rightArc, bottomArc, leftArc];

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      scale: [1, 1.5, 1],
      rotate: [0, 180, 360],
      transition: { duration, repeat: Infinity, ease, times: [0, 0.5, 1] },
    });
  }, [duration, ease, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <motion.g animate={controls} style={{ originX: "50%", originY: "50%" }}>
        {arcs.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap={strokeLinecap as "round" | "butt" | "square"}
          />
        ))}
      </motion.g>
    </svg>
  );
}
