'use client';

import { useId } from 'react';
import { motion } from 'motion/react';

export interface DeskLampIconProps {
  size?: number;
  className?: string;
  isActive?: boolean;
  duration?: number;
  ease?: string | number[];
  color?: string;
  accentColor?: string;
  glowColor?: string;
}

// Illustrated desk lamp in a fixed 100x100 viewBox; size scales the svg.
// isActive turns the light on: the shade interior warms up and a soft halo
// fades in beneath the opening.
export function IconDeskLamp({
  size = 24,
  className = '',
  isActive = false,
  duration = 0.4,
  ease = 'easeOut',
  color = '#7ba3ec',
  accentColor = '#e8836f',
  glowColor = '#f7c877',
}: DeskLampIconProps) {
  const uid = useId();
  const hlId = `lamp-hl-${uid}`;
  const glowId = `lamp-glow-${uid}`;
  const haloId = `lamp-halo-${uid}`;
  const lightTransition = { duration, ease: ease as any };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-label="Desk lamp"
      role="img"
    >
      <defs>
        {/* Top-left sheen reused across body parts */}
        <linearGradient id={hlId} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {/* Warm lit interior */}
        <radialGradient id={glowId} cx="0.5" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#fffdf4" />
          <stop offset="0.55" stopColor="#ffedc4" />
          <stop offset="1" stopColor={glowColor} />
        </radialGradient>
        {/* Soft halo cast below the opening */}
        <radialGradient id={haloId} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={glowColor} stopOpacity="0.55" />
          <stop offset="1" stopColor={glowColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Base */}
      <ellipse cx={52} cy={86} rx={20} ry={6.5} fill={color} />
      <ellipse cx={52} cy={86} rx={20} ry={6.5} fill="#000000" opacity={0.18} />
      <rect x={32} y={80} width={40} height={6} fill={color} />
      <ellipse cx={52} cy={80} rx={20} ry={6.5} fill={color} />
      <ellipse cx={52} cy={80} rx={20} ry={6.5} fill={`url(#${hlId})`} />
      <ellipse cx={52} cy={80} rx={16.5} ry={5} fill="#ffffff" opacity={0.92} />

      {/* Base button */}
      <ellipse cx={44} cy={78.5} rx={3} ry={1.5} fill={accentColor} />
      <ellipse cx={44} cy={78.5} rx={3} ry={1.5} fill="#000000" opacity={0.2} />
      <rect x={41} y={76} width={6} height={2.5} fill={accentColor} />
      <ellipse cx={44} cy={76} rx={3} ry={1.5} fill={accentColor} />
      <ellipse cx={44} cy={76} rx={3} ry={1.5} fill="#ffffff" opacity={0.3} />

      {/* Arm: base -> elbow -> shade hinge */}
      <line x1={64} y1={77} x2={71} y2={50} stroke={color} strokeWidth={7} strokeLinecap="round" />
      <line x1={62.8} y1={76} x2={69.6} y2={50} stroke="#ffffff" strokeWidth={2} strokeLinecap="round" opacity={0.3} />
      <line x1={71} y1={50} x2={62} y2={30} stroke={color} strokeWidth={7} strokeLinecap="round" />
      <line x1={69.6} y1={50.5} x2={60.8} y2={31} stroke="#ffffff" strokeWidth={2} strokeLinecap="round" opacity={0.3} />
      {/* Elbow joint */}
      <circle cx={71} cy={50} r={4.8} fill={color} />
      <circle cx={71} cy={50} r={4.8} fill="#000000" opacity={0.12} />
      <circle cx={69.8} cy={48.8} r={1.6} fill="#ffffff" opacity={0.35} />
      {/* Base hinge pin */}
      <circle cx={64} cy={76} r={3} fill={accentColor} />
      <circle cx={63.2} cy={75.2} r={1} fill="#ffffff" opacity={0.4} />

      {/* Halo cast by the light (under the shade, above the arm) */}
      <motion.ellipse
        cx={41}
        cy={48}
        rx={21}
        ry={12}
        fill={`url(#${haloId})`}
        initial={false}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={lightTransition}
      />

      {/* Shade, tilted toward lower-left */}
      <g transform="translate(54 17) rotate(32)">
        {/* Dome cap */}
        <circle cx={0} cy={1} r={6.5} fill={color} />
        <circle cx={0} cy={1} r={6.5} fill={`url(#${hlId})`} />
        {/* Bell */}
        <path d="M -14 26 Q -12.5 7 0 4 Q 12.5 7 14 26 Z" fill={color} />
        <path d="M -14 26 Q -12.5 7 0 4 Q 12.5 7 14 26 Z" fill={`url(#${hlId})`} />
        {/* Opening rim */}
        <ellipse cx={0} cy={26} rx={14} ry={5} fill={color} />
        <ellipse cx={0} cy={26} rx={14} ry={5} fill="#000000" opacity={0.15} />
        {/* Interior, off state: pale */}
        <ellipse cx={0} cy={26} rx={12} ry={4.1} fill="#f0e9df" />
        {/* Interior, on state: warm glow + bulb */}
        <motion.g
          initial={false}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={lightTransition}
        >
          <ellipse cx={0} cy={26} rx={12} ry={4.1} fill={`url(#${glowId})`} />
          <circle cx={0} cy={23} r={4.2} fill="#fffdf0" />
        </motion.g>
      </g>

      {/* Shade hinge pin (over the shade edge) */}
      <circle cx={62} cy={29} r={3.2} fill={accentColor} />
      <circle cx={61.2} cy={28.2} r={1.1} fill="#ffffff" opacity={0.4} />
    </svg>
  );
}
