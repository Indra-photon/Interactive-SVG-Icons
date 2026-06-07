'use client';

import { motion } from 'motion/react';

export interface MailIconProps {
  size?: number;
  color?: string;
  className?: string;
  isOpen?: boolean;
}

export function IconMail({
  size = 24,
  color = 'currentColor',
  className = '',
  isOpen = false
}: MailIconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      className={`icon icon-tabler ${className}`}
      style={{ perspective: '2000px' }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      
      {/* Envelope body - static */}
      <path d="M22 7.535v9.465a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-9.465l9.445 6.297l.116 .066a1 1 0 0 0 .878 0l.116 -.066l9.445 -6.297z" />
      
      {/* Top flap - rotates to open */}
      <motion.path 
        d="M19 4c1.08 0 2.027 .57 2.555 1.427l-9.555 6.37l-9.555 -6.37a2.999 2.999 0 0 1 2.354 -1.42l.201 -.007h14z"
        style={{
          transformBox: "fill-box",
          transformOrigin: "50% 0%"
        }}
        animate={isOpen ? "open" : "closed"}
        variants={{
          closed: {
            rotate: 0,
            y: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          },
          open: {
            rotateX: -180,
            y: -4,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          }
        }}
      />
    </svg>
  );
}