'use client';

import { motion } from 'framer-motion';

interface SquareCornersRotateProps {
  width?: number;
  height?: number;
  color?: string;
  isAnimating?: boolean;
}

export function SquareCornersRotate({
  width = 40,
  height = 40,
  color = "currentColor",
  isAnimating = true,
}: SquareCornersRotateProps) {
  const cx = width / 2;
  const cy = height / 2;
  
  // Arc radius - positioned at 20px from edge for 40px container
  // This scales proportionally: 50% of container size
  const arcR = Math.min(width, height) * 0.45;
  
  // Distance from edge to arc center (scales with container)
  const inset = Math.min(width, height) * 0.5;

  // Four 90° arc paths positioned at the midpoint of each side
  // Each arc opens AWAY from the center (outward)
  
  // Top arc: positioned at top-center [cx, inset], opens DOWNWARD
  // Starts from left, sweeps right (clockwise 90°)
  const topArc = `M ${cx - arcR * 0.707},${inset - arcR * 0.707} A ${arcR},${arcR} 0 0,1 ${cx + arcR * 0.707},${inset - arcR * 0.707}`;
  
  // Right arc: positioned at right-center [width - inset, cy], opens LEFTWARD
  // Starts from top, sweeps down (clockwise 90°)
  const rightArc = `M ${width - inset + arcR * 0.707},${cy - arcR * 0.707} A ${arcR},${arcR} 0 0,1 ${width - inset + arcR * 0.707},${cy + arcR * 0.707}`;
  
  // Bottom arc: positioned at bottom-center [cx, height - inset], opens UPWARD
  // Starts from right, sweeps left (clockwise 90°)
  const bottomArc = `M ${cx + arcR * 0.707},${height - inset + arcR * 0.707} A ${arcR},${arcR} 0 0,1 ${cx - arcR * 0.707},${height - inset + arcR * 0.707}`;
  
  // Left arc: positioned at left-center [inset, cy], opens RIGHTWARD
  // Starts from bottom, sweeps up (clockwise 90°)
  const leftArc = `M ${inset - arcR * 0.707},${cy + arcR * 0.707} A ${arcR},${arcR} 0 0,1 ${inset - arcR * 0.707},${cy - arcR * 0.707}`;

  const arcs = [topArc, rightArc, bottomArc, leftArc];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
    >
      <motion.g
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 1.5,
          repeat: isAnimating ? Infinity : 0,
          ease: [0.3, 1, 0, 1],
          times: [0, 0.5, 1],
        }}
        style={{ 
          originX: '50%', 
          originY: '50%' 
        }}
      >
        {arcs.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={color}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
        ))}
      </motion.g>
    </svg>
  );
}