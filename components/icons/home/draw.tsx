'use client';

import { motion } from 'motion/react';

export interface HomeIconDrawProps {
  size?: number;
  color?: string;
  className?: string;
  isHovered?: boolean;
}

export function IconHome({
  size = 24,
  color = 'currentColor',
  className = '',
  isHovered = false
}: HomeIconDrawProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`icon icon-tabler ${className}`}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      
      {/* Door */}
      <motion.path 
        d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"
        animate={isHovered ? "hover" : "idle"}
        variants={{
          idle: { opacity: 0.3, strokeDasharray: "100 100", strokeDashoffset: 100 },
          hover: { opacity: 1, strokeDashoffset: 0 }
        }}
        transition={{ duration: 0.5, ease: "linear" }}
      />

      {/* House body */}
      <motion.path 
        d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"
        animate={isHovered ? "hover" : "idle"}
        variants={{
          idle: { opacity: 0.9, strokeDasharray: "100", strokeDashoffset: 0 },
          hover: { opacity: 1, strokeDashoffset: 0 }
        }}
        transition={{ duration: 0.5, delay: 0.1, ease: "linear" }}
      />

      {/* Roof */}
      <motion.path 
        d="M5 12l-2 0l9 -9l9 9l-2 0"
        animate={isHovered ? "hover" : "idle"}
        variants={{
          idle: { opacity: 0.9, strokeDasharray: "100", strokeDashoffset: 0 },
          hover: { opacity: 1, strokeDashoffset: 0 }
        }}
        transition={{ duration: 0.5, delay: 0.2, ease: "linear" }}
      />
    </svg>
  );
}