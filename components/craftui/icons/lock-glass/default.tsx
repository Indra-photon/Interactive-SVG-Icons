'use client';

import { motion } from 'motion/react';

export interface LockShowPasswordProps {
  size?: number;
  className?: string;
  isUnlocked?: boolean;
  duration?: number;
  ease?: string | number[];
  distance?: number;
}

export function IconLockShowPassword({
  size = 24,
  className = '',
  isUnlocked = false,
  duration = 0.3,
  ease = 'easeInOut',
  distance = 3,
}: LockShowPasswordProps) {
  // When unlocked: shackle slides up, body slides down
  const shackleVariants = {
    locked: { y: 0 },
    unlocked: {
      y: -distance,
      transition: { duration, ease: ease as any },
    },
  };

  const bodyVariants = {
    locked: { y: 0 },
    unlocked: {
      y: distance,
      transition: { duration, ease: ease as any },
    },
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24"
      overflow={"visible"}
      className={className}
    >
      <title>lock</title>
      <g fill="none">
        {/* Shackle (top circular part) - slides up-right when unlocked */}
        <motion.g
          animate={isUnlocked ? 'unlocked' : 'locked'}
          variants={shackleVariants}
        >
          <path 
            d="M16 12V6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6V12C8 12.5523 7.55228 13 7 13C6.44772 13 6 12.5523 6 12V6C6 2.68629 8.68629 0 12 0C15.3137 0 18 2.68629 18 6V12C18 12.5523 17.5523 13 17 13C16.4477 13 16 12.5523 16 12Z" 
            fill="url(#lock_shackle)" 
            data-glass="origin" 
            mask="url(#lock_mask)" 
          />
          <path 
            d="M16 12V6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6V12C8 12.5523 7.55228 13 7 13C6.44772 13 6 12.5523 6 12V6C6 2.68629 8.68629 0 12 0C15.3137 0 18 2.68629 18 6V12C18 12.5523 17.5523 13 17 13C16.4477 13 16 12.5523 16 12Z" 
            fill="url(#lock_shackle)" 
            data-glass="clone" 
            filter="url(#lock_filter)" 
            clipPath="url(#lock_clipPath)" 
          />
        </motion.g>

        {/* Lock body - slides down-left when unlocked */}
        <motion.g
          animate={isUnlocked ? 'unlocked' : 'locked'}
          variants={bodyVariants}
        >
          <path 
            d="M3 15.4V16.6C3 18.8402 3 19.9603 3.43597 20.816C3.81947 21.5686 4.43139 22.1805 5.18404 22.564C6.03969 23 7.15979 23 9.4 23H14.6C16.8402 23 17.9603 23 18.816 22.564C19.5686 22.1805 20.1805 21.5686 20.564 20.816C21 19.9603 21 18.8402 21 16.6V15.4C21 13.1598 21 12.0397 20.564 11.184C20.1805 10.4314 19.5686 9.81947 18.816 9.43597C17.9603 9 16.8402 9 14.6 9H9.4C7.15979 9 6.03969 9 5.18404 9.43597C4.43139 9.81947 3.81947 10.4314 3.43597 11.184C3 12.0397 3 13.1598 3 15.4Z" 
            fill="url(#lock_body)" 
            data-glass="blur" 
          />
          <path 
            d="M9.40039 9.375H14.5996C15.7257 9.375 16.5481 9.37578 17.1963 9.42871C17.8401 9.48131 18.2794 9.58395 18.6455 9.77051C19.3276 10.118 19.882 10.6724 20.2295 11.3545C20.4161 11.7206 20.5187 12.1599 20.5713 12.8037C20.6242 13.4519 20.625 14.2743 20.625 15.4004V16.5996C20.625 17.7257 20.6242 18.5481 20.5713 19.1963C20.5187 19.8401 20.4161 20.2794 20.2295 20.6455C19.882 21.3276 19.3276 21.882 18.6455 22.2295C18.2794 22.4161 17.8401 22.5187 17.1963 22.5713C16.5481 22.6242 15.7257 22.625 14.5996 22.625H9.40039C8.27429 22.625 7.45186 22.6242 6.80371 22.5713C6.15989 22.5187 5.72064 22.4161 5.35449 22.2295C4.6724 21.882 4.11805 21.3276 3.77051 20.6455C3.58395 20.2794 3.48131 19.8401 3.42871 19.1963C3.37578 18.5481 3.375 17.7257 3.375 16.5996V15.4004C3.375 14.2743 3.37578 13.4519 3.42871 12.8037C3.48131 12.1599 3.58395 11.7206 3.77051 11.3545C4.11805 10.6724 4.6724 10.118 5.35449 9.77051C5.72064 9.58395 6.15989 9.48131 6.80371 9.42871C7.45186 9.37578 8.27429 9.375 9.40039 9.375Z" 
            stroke="url(#lock_outline)" 
            strokeWidth=".75" 
          />
        </motion.g>

        <defs>
          <linearGradient id="lock_shackle" x1="12" y1="0" x2="12" y2="13" gradientUnits="userSpaceOnUse">
            <stop stopColor="#575757" />
            <stop offset="1" stopColor="#151515" />
          </linearGradient>
          <linearGradient id="lock_body" x1="12" y1="9" x2="12" y2="23" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E3E3E5" stopOpacity=".6" />
            <stop offset="1" stopColor="#BBBBC0" stopOpacity=".6" />
          </linearGradient>
          <linearGradient id="lock_outline" x1="12" y1="9" x2="12" y2="17.108" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <filter id="lock_filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="2" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur" />
          </filter>
          <clipPath id="lock_clipPath">
            <path d="M3 15.4V16.6C3 18.8402 3 19.9603 3.43597 20.816C3.81947 21.5686 4.43139 22.1805 5.18404 22.564C6.03969 23 7.15979 23 9.4 23H14.6C16.8402 23 17.9603 23 18.816 22.564C19.5686 22.1805 20.1805 21.5686 20.564 20.816C21 19.9603 21 18.8402 21 16.6V15.4C21 13.1598 21 12.0397 20.564 11.184C20.1805 10.4314 19.5686 9.81947 18.816 9.43597C17.9603 9 16.8402 9 14.6 9H9.4C7.15979 9 6.03969 9 5.18404 9.43597C4.43139 9.81947 3.81947 10.4314 3.43597 11.184C3 12.0397 3 13.1598 3 15.4Z" fill="url(#lock_body)" />
          </clipPath>
          <mask id="lock_mask">
            <rect width="100%" height="100%" fill="#FFF" />
            <path d="M3 15.4V16.6C3 18.8402 3 19.9603 3.43597 20.816C3.81947 21.5686 4.43139 22.1805 5.18404 22.564C6.03969 23 7.15979 23 9.4 23H14.6C16.8402 23 17.9603 23 18.816 22.564C19.5686 22.1805 20.1805 21.5686 20.564 20.816C21 19.9603 21 18.8402 21 16.6V15.4C21 13.1598 21 12.0397 20.564 11.184C20.1805 10.4314 19.5686 9.81947 18.816 9.43597C17.9603 9 16.8402 9 14.6 9H9.4C7.15979 9 6.03969 9 5.18404 9.43597C4.43139 9.81947 3.81947 10.4314 3.43597 11.184C3 12.0397 3 13.1598 3 15.4Z" fill="#000" />
          </mask>
        </defs>
      </g>
    </svg>
  );
}