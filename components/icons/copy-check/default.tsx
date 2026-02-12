'use client';

import { motion } from 'motion/react';

export interface CopyCheckIconProps {
  size?: number;
  color?: string;
  className?: string;
  isCopied?: boolean;
}

export function IconCopyCheck({
  size = 24,
  color = 'currentColor',
  className = '',
  isCopied = false
}: CopyCheckIconProps) {
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
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      
      {/* Outer box - fills when copied */}
      <motion.path 
        d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666"
        animate={isCopied ? "copied" : "idle"}
        variants={{
          idle: {
            fill: "none",
            transition: {
              duration: 0.3,
              ease: "easeInOut"
            }
          },
          copied: {
            fill: color,
            transition: {
              duration: 0.3,
              ease: "easeInOut"
            }
          }
        }}
      />
      
      {/* Back/inner box - static */}
      <path d="M4.012 16.737a2 2 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
      
      {/* Checkmark - draws in after box fills */}
      <motion.path 
        d="M11 14l2 2l4 -4"
        stroke="black"  // ← Add this
        animate={isCopied ? "copied" : "idle"}
        variants={{
            idle: {
            strokeDasharray: "20 20",
            strokeDashoffset: 20,
            opacity: 0,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
            },
            copied: {
            strokeDashoffset: 0,
            opacity: 1,
            transition: {
                duration: 0.4,
                delay: 0.1,
                ease: "easeOut"
            }
            }
        }}
        />
    </svg>
  );
}