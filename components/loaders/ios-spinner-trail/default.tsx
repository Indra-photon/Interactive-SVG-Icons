"use client";

import { motion } from "framer-motion";

interface IosSpinnerTrailProps {
  width?: number;
  height?: number;
  color?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function IosSpinnerTrail({
  width = 100,
  height = 100,
  color = "currentColor",
  isAnimating = true,
  duration = 0.7,
  ease = 'linear',
}: IosSpinnerTrailProps) {
  const count = 12;
  const opacities = [
    1, 0.82, 0.64, 0.48, 0.34, 0.22, 0.13, 0.07, 0.03, 0.01, 0.005, 0.001,
  ];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
    >
      <motion.g
        style={{ transformOrigin: "50px 50px" }}
        animate={{ rotate: isAnimating ? 360 : 0 }}
        transition={{
          duration: duration,
          repeat: isAnimating ? Infinity : 0,
          ease: ease,
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <rect
            key={i}
            x={48.5}
            y={26}
            width={3}
            height={10}
            rx={1.5}
            fill={color}
            opacity={opacities[i]}
            transform={`rotate(${(360 / count) * i}, 50, 50)`}
          />
        ))}
      </motion.g>
    </svg>
  );
}
