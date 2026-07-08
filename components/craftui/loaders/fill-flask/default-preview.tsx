"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const SIZE = 100;
const VIEW = 100;
const FRONT_WAVELENGTH = 60;
const BACK_WAVELENGTH = 90;
const LIQUID_LEVEL = 58;

const FLASK_PATH = "M 44 14 L 44 34 L 27 72 Q 23 81 31 81 L 69 81 Q 77 81 73 72 L 56 34 L 56 14";
const BUBBLES = [
  { cx: 42, r: 3, from: 74, to: 60, delayFactor: 0 },
  { cx: 50, r: 2.5, from: 76, to: 61, delayFactor: 1 / 3 },
  { cx: 58, r: 3.5, from: 73, to: 60, delayFactor: 2 / 3 },
];

const buildWavePath = (level: number, amplitude: number, wavelength: number) => {
  let d = `M ${-VIEW * 2} ${level}`;
  let up = true;
  for (let x = -VIEW * 2; x < VIEW * 2; x += wavelength / 2) {
    const cpY = up ? level - amplitude : level + amplitude;
    d += ` Q ${x + wavelength / 4} ${cpY} ${x + wavelength / 2} ${level}`;
    up = !up;
  }
  d += ` L ${VIEW * 2} ${VIEW + 20} L ${-VIEW * 2} ${VIEW + 20} Z`;
  return d;
};

export default function FillFlaskPreview() {
  const {
    color = "#57c785",
    secondaryColor = "#ffffff",
    strokeColor = "#1f1f1f",
    backgroundColor = "#ffffff",
    duration = 2.5,
    ease = "linear",
  } = useLoaderProps();

  const frontControls = useAnimation();
  const backControls = useAnimation();

  useEffect(() => {
    frontControls.start({
      x: [0, -FRONT_WAVELENGTH],
      transition: { duration, repeat: Infinity, ease },
    });
    backControls.start({
      x: [0, BACK_WAVELENGTH],
      transition: { duration: duration * 1.6, repeat: Infinity, ease },
    });
  }, [duration, ease, frontControls, backControls]);

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${VIEW} ${VIEW}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <defs>
        <clipPath id="fillFlaskClipPreview">
          <path d="M 46.5 16 L 46.5 35 L 30 73 Q 27.5 78.5 32 78.5 L 68 78.5 Q 72.5 78.5 70 73 L 53.5 35 L 53.5 16 Z" />
        </clipPath>
      </defs>
      <path d={`${FLASK_PATH} Z`} fill={backgroundColor} />
      <g clipPath="url(#fillFlaskClipPreview)">
        <motion.path
          fill={color}
          opacity={0.45}
          initial={{ d: buildWavePath(LIQUID_LEVEL - 3, 5, BACK_WAVELENGTH) }}
          d={buildWavePath(LIQUID_LEVEL - 3, 5, BACK_WAVELENGTH)}
          animate={backControls}
        />
        <motion.path
          fill={color}
          initial={{ d: buildWavePath(LIQUID_LEVEL, 3.5, FRONT_WAVELENGTH) }}
          d={buildWavePath(LIQUID_LEVEL, 3.5, FRONT_WAVELENGTH)}
          animate={frontControls}
        />
        {BUBBLES.map((b, i) => (
          <motion.circle
            key={i}
            cx={b.cx}
            r={b.r}
            fill={secondaryColor}
            animate={{ cy: [b.from, b.to], opacity: [0.9, 0] }}
            transition={{ duration, repeat: Infinity, ease, delay: duration * b.delayFactor }}
          />
        ))}
      </g>
      <path
        d={FLASK_PATH}
        stroke={strokeColor}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1={40} y1={14} x2={60} y2={14} stroke={strokeColor} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
}
