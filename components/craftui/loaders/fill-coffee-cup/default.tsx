'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

interface FillCoffeeCupProps {
  width?: number;
  height?: number;
  color?: string;
  secondaryColor?: string;
  strokeColor?: string;
  backgroundColor?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

// All geometry lives in a fixed 100x100 viewBox; width/height scale the svg.
const VIEW = 100;
const FRONT_WAVELENGTH = 60;
const BACK_WAVELENGTH = 90;

// Repeating wave spanning -2*VIEW..2*VIEW so it stays inside the clip while
// translating horizontally by one wavelength (a seamless loop).
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

export function FillCoffeeCup({
  width = 60,
  height = 60,
  color = "#e8a33d",
  secondaryColor = "#f0d9aa",
  strokeColor = "#1f1f1f",
  backgroundColor = "#ffffff",
  isAnimating = true,
  duration = 2.0,
  ease = 'linear',
}: FillCoffeeCupProps) {
  const frontControls = useAnimation();
  const backControls = useAnimation();

  useEffect(() => {
    if (isAnimating) {
      frontControls.start({
        x: [0, -FRONT_WAVELENGTH],
        transition: { duration, repeat: Infinity, ease },
      });
      backControls.start({
        x: [0, BACK_WAVELENGTH],
        transition: { duration: duration * 1.6, repeat: Infinity, ease },
      });
    } else {
      frontControls.stop();
      backControls.stop();
      frontControls.set({ x: 0 });
      backControls.set({ x: 0 });
    }
  }, [isAnimating, duration, ease, frontControls, backControls]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
    >
      <defs>
        <clipPath id={`coffee-cup-clip-${width}`}>
          <rect x={23} y={21} width={46} height={52} rx={9} />
        </clipPath>
      </defs>
      {/* Cup interior */}
      <rect x={20} y={18} width={52} height={58} rx={12} fill={backgroundColor} />
      {/* Liquid */}
      <g clipPath={`url(#coffee-cup-clip-${width})`}>
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
      {/* Handle */}
      <path
        d="M 72 32 C 88 26 96 34 92 44 C 89 52 80 56 72 54"
        stroke={strokeColor}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
      {/* Cup outline */}
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
      {/* Saucer line */}
      <line x1={14} y1={86} x2={76} y2={86} stroke={strokeColor} strokeWidth={5} strokeLinecap="round" />
      <line x1={86} y1={86} x2={93} y2={86} stroke={strokeColor} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
}
