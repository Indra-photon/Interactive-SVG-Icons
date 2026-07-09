"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const SIZE = 100;
const VIEW = 100;
const FRONT_WAVELENGTH = 60;
const BACK_WAVELENGTH = 90;

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

export default function FillCoffeeCupPreview() {
  const {
    color = "#e8a33d",
    secondaryColor = "#f0d9aa",
    strokeColor = "#1f1f1f",
    backgroundColor = "#ffffff",
    duration = 2.0,
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
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
    >
      <defs>
        <clipPath id="coffeeCupClipPreview">
          <rect x={23} y={21} width={46} height={52} rx={9} />
        </clipPath>
      </defs>
      <rect x={20} y={18} width={52} height={58} rx={12} fill={backgroundColor} />
      <g clipPath="url(#coffeeCupClipPreview)">
        <motion.path
          fill={secondaryColor}
          initial={{ d: buildWavePath(42, 8, BACK_WAVELENGTH) }}
          d={buildWavePath(42, 8, BACK_WAVELENGTH)}
          animate={backControls}
        />
        <motion.path
          fill={color}
          initial={{ d: buildWavePath(46, 5, FRONT_WAVELENGTH) }}
          d={buildWavePath(46, 5, FRONT_WAVELENGTH)}
          animate={frontControls}
        />
      </g>
      <path
        d="M 72 32 C 88 26 96 34 92 44 C 89 52 80 56 72 54"
        stroke={strokeColor}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
      <rect
        x={20}
        y={18}
        width={52}
        height={58}
        rx={12}
        stroke={strokeColor}
        strokeWidth={5}
        fill="none"
      />
      <line x1={14} y1={86} x2={76} y2={86} stroke={strokeColor} strokeWidth={5} strokeLinecap="round" />
      <line x1={86} y1={86} x2={93} y2={86} stroke={strokeColor} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
}
