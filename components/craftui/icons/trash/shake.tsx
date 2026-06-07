"use client";

import { useState } from "react";
import { motion } from "motion/react";

export interface TrashIconShakeProps {
  size?: number;
  color?: string;
  className?: string;
  isAnimating?: boolean;
}

export function TrashIconShake({
  size = 5,
  color = "currentColor",
  className = "",
  isAnimating = false,
}: TrashIconShakeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Animated Lid - lifts up when deleting */}
      <motion.g
        animate={isAnimating ? "open" : "closed"}
        variants={{
          closed: {
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 15,
            },
          },
          open: {
            rotate: -20,
            transformOrigin: "left",
            scale: 0.85,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 35,
            },
          },
        }}
      >
        <path d="M4 7h16" />
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
      </motion.g>

      {/* Static trash body */}
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
    </svg>
  );
}
