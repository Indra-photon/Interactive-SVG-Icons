'use client';

import { motion } from 'motion/react';

export interface BulbIconProps {
  size?: number;
  color?: string;
  className?: string;
  isActive?: boolean;
}

export function IconBulb({
  size = 24,
  color = 'currentColor',
  className = '',
  isActive = false
}: BulbIconProps) {
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
      
      {/* Left ray */}
      <motion.path 
        d="M4 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z"
        fill={color}
        stroke="none"
        animate={isActive ? "active" : "idle"}
        variants={{
          idle: { opacity: 0, scale: 0.5 },
          active: { opacity: 1, scale: 1 }
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />
      
      {/* Top ray */}
      <motion.path 
        d="M12 2a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z"
        fill={color}
        stroke="none"
        animate={isActive ? "active" : "idle"}
        variants={{
          idle: { opacity: 0, scale: 0.5 },
          active: { opacity: 1, scale: 1 }
        }}
        transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
        style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />
      
      {/* Right ray */}
      <motion.path 
        d="M21 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z"
        fill={color}
        stroke="none"
        animate={isActive ? "active" : "idle"}
        variants={{
          idle: { opacity: 0, scale: 0.5 },
          active: { opacity: 1, scale: 1 }
        }}
        transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
        style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />
      
      {/* Top-left diagonal ray */}
      <motion.path 
        d="M4.893 4.893a1 1 0 0 1 1.32 -.083l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 0 -1.414z"
        fill={color}
        stroke="none"
        animate={isActive ? "active" : "idle"}
        variants={{
          idle: { opacity: 0, scale: 0.5 },
          active: { opacity: 1, scale: 1 }
        }}
        transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
        style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />
      
      {/* Top-right diagonal ray */}
      <motion.path 
        d="M17.693 4.893a1 1 0 0 1 1.497 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7z"
        fill={color}
        stroke="none"
        animate={isActive ? "active" : "idle"}
        variants={{
          idle: { opacity: 0, scale: 0.5 },
          active: { opacity: 1, scale: 1 }
        }}
        transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
        style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />
      
      {/* Bulb body - fills on hover */}
      <motion.path 
        d="M12 6a6 6 0 0 1 3.6 10.8a1 1 0 0 1 -.471 .192l-.129 .008h-6a1 1 0 0 1 -.6 -.2a6 6 0 0 1 3.6 -10.8z"
        animate={isActive ? "active" : "idle"}
        variants={{
          idle: { fill: "none" },
          active: { fill: color }
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
      
      {/* Base/socket - always filled */}
      <path 
        d="M14 18a1 1 0 0 1 1 1a3 3 0 0 1 -6 0a1 1 0 0 1 .883 -.993l.117 -.007h4z"
        fill={color}
        stroke="none"
      />
    </svg>
  );
}