"use client";

import { motion } from "framer-motion";
import { useId } from "react";

// Perfect circle: 4-segment cubic bezier approximation, center(12,12) r=5
// k = r × 0.5523 = 2.76
const CIRCLE =
  "M 12 7 C 14.76 7 17 9.24 17 12 C 17 14.76 14.76 17 12 17 C 9.24 17 7 14.76 7 12 C 7 9.24 9.24 7 12 7 Z";

// Arrow: same 4 anchors as the circle — only the right anchor extends (17→19)
// and the left-side control points flip concave, creating the notch silhouette.
// All three non-right anchors are stationary during the morph, so only the
// right side lunges forward while the left side tightens into the arrow indent.
const ARROW =
  "M 12 7 C 17 7 19 9.5 19 12 C 19 14.5 17 17 12 17 C 9.5 17.5 6.5 15 7 12 C 6.5 9 9.5 6.5 12 7 Z";

// Underdamped spring — overshoot past target creates the stretch-and-snap-back
const spring = {
  type: "spring",
  stiffness: 200,
  damping: 12,
  mass: 0.8,
} as const;

interface GooeyLoaderIconProps {
  isHovered: boolean;
  size?: number;
  className?: string;
}

export function GooeyLoaderIcon({
  isHovered,
  size = 24,
  className,
}: GooeyLoaderIconProps) {
  // Unique filter id per instance — avoids id collisions if icon is reused
  const id = useId().replace(/:/g, "");

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        {/* Goo filter: blur then threshold — creates organic liquid-edge quality */}
        <filter id={id} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.7" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
          />
        </filter>
      </defs>
      <g filter={`url(#${id})`}>
        <motion.path
          animate={{ d: isHovered ? ARROW : CIRCLE }}
          transition={spring}
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
