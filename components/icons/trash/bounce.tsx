'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export interface TrashIconBounceProps {
  size?: number;
  color?: string;
  className?: string;
}

export function TrashIconBounce({
  size = 24,
  color = 'currentColor',
  className = ''
}: TrashIconBounceProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      onClick={handleClick}
      animate={isAnimating ? {
        y: [0, -10, 0, -5, 0],
        rotate: [0, -5, 5, -3, 0]
      } : {}}
      transition={{
        duration: 0.6,
        ease: "easeInOut"
      }}
      style={{ cursor: 'pointer' }}
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
    </motion.svg>
  );
}