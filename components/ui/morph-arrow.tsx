"use client";

import { motion } from "framer-motion";

// ArrowRight02Icon (→) paths — shaft expressed as M C C to match chevron structure
const REST = {
  p0: "M18.5 12C18.5 12 11.75 12 11.75 12C11.75 12 5 12 5 12",
  p1: "M13 18C13 18 19 13.5811 19 12C19 10.4188 13 6 13 6",
};

// ArrowRightDoubleIcon (>>) paths
const HOVER = {
  p0: "M5.50005 18C5.50005 18 11.5 13.5811 11.5 12C11.5 10.4188 5.5 6 5.5 6",
  p1: "M12.5 18C12.5 18 18.5 13.5811 18.5 12C18.5 10.4188 12.5 6 12.5 6",
};

const transition = { duration: 0.28, ease: "easeInOut" } as const;

interface MorphArrowProps {
  isHovered: boolean;
  size?: number;
  className?: string;
}

export function MorphArrow({ isHovered, size = 24, className }: MorphArrowProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <motion.path
        animate={{ d: isHovered ? HOVER.p0 : REST.p0 }}
        transition={transition}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <motion.path
        animate={{ d: isHovered ? HOVER.p1 : REST.p1 }}
        transition={transition}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
