'use client';
import React from "react";
import { motion } from "framer-motion";

export const TrashIcon: React.FC<{ rotation: number }> = ({ rotation }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-2 -6 28 32" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className="icon icon-tabler icons-tabler-outline icon-tabler-trash">
        <g
        style = {{
            overflow: 'visible',
            transformOrigin: 'right bottom',
            transformBox: 'fill-box',
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease-out'
        }}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
            <path d="M4 7l16 0" />
        </g>
        <path d="M10 11l0 6" />
        <path d="M14 11l0 6" />
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
    </svg>
)

export const DownloadSvg: React.FC<{ downloadState: 'idle' | 'downloading' | 'downloaded' }> = ({ downloadState }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="icon icon-tabler icons-tabler-outline icon-tabler-download">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
            <motion.g
                animate={downloadState === 'downloading' ? { y: [0, 4, 0] } : { y: 0 }}
                transition={{ 
                    duration: 2,
                    repeat: downloadState === 'downloading' ? Infinity : 0,
                    ease: "easeInOut",
                    repeatDelay: 0.3
                }}
            >
                <path d="M7 11l5 5l5 -5" />
                <path d="M12 4l0 12" />
            </motion.g>
        </svg>
    )
}

export const CartSvg: React.FC<{ cartState: 'idle' | 'adding' | 'added' }> = ({ cartState }) => {
    return (
        <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 512 512" 
      className="w-full h-full"
    >
      {/* Cart Handle */}
      <path 
        d="M0 32 L96 32 C110 32 120 42 120 56 L140 140" 
        fill="none" 
        stroke="#ffffff" 
        strokeWidth="32" 
        strokeLinecap="round"
      />
      
      {/* Cart Body - Left Side (Pink) */}
      <path 
        d="M140 140 L480 140 L420 360 L160 360 Z" 
        fill="#ff5c7c"
      />
      
      {/* Cart Body - Right Side (Darker Red) */}
      <path 
        d="M310 140 L480 140 L420 360 L290 360 Z" 
        fill="#e94057"
      />
      
      {/* Cart Slots - Left */}
      <rect 
        x="230" 
        y="200" 
        width="30" 
        height="90" 
        rx="15" 
        fill="#e8f4f8"
      />
      
      {/* Cart Slots - Middle */}
      <rect 
        x="310" 
        y="200" 
        width="30" 
        height="90" 
        rx="15" 
        fill="#e8f4f8"
      />
      
      {/* Cart Slots - Right */}
      <rect 
        x="390" 
        y="200" 
        width="30" 
        height="90" 
        rx="15" 
        fill="#e8f4f8"
      />
      
      {/* Cart Base Bar */}
      <path 
        d="M130 380 C130 380 140 420 180 420 L420 420 C460 420 470 380 470 380" 
        fill="none" 
        stroke="#5d2e46" 
        strokeWidth="40" 
        strokeLinecap="round"
      />
      
      {/* Left Wheel - Outer */}
      <circle 
        cx="200" 
        cy="450" 
        r="40" 
        fill="#5d2e46"
      />
      
      {/* Left Wheel - Inner */}
      <circle 
        cx="200" 
        cy="450" 
        r="20" 
        fill="#e8f4f8"
      />
      
      {/* Right Wheel - Outer */}
      <circle 
        cx="410" 
        cy="450" 
        r="40" 
        fill="#5d2e46"
      />
      
      {/* Right Wheel - Inner */}
      <circle 
        cx="410" 
        cy="450" 
        r="20" 
        fill="#e8f4f8"
      />
    </svg>
    )
}

// export const CartIconSvg: React.FC = () => {
//   return (
//     <svg 
//       xmlns="http://www.w3.org/2000/svg" 
//       viewBox="0 0 512 512" 
//       className="w-full h-full"
//     >
//       {/* Cart Handle */}
//       <path 
//         d="M0 32 L96 32 C110 32 120 42 120 56 L140 140" 
//         fill="none" 
//         stroke="#ffffff" 
//         strokeWidth="32" 
//         strokeLinecap="round"
//       />
      
//       {/* Cart Body - Left Side (Pink) */}
//       <path 
//         d="M140 140 L480 140 L420 360 L160 360 Z" 
//         fill="#ff5c7c"
//       />
      
//       {/* Cart Body - Right Side (Darker Red) */}
//       <path 
//         d="M310 140 L480 140 L420 360 L290 360 Z" 
//         fill="#e94057"
//       />
      
//       {/* Yellow Box */}
//       <rect 
//         x="160" 
//         y="80" 
//         width="140" 
//         height="60" 
//         rx="8" 
//         fill="#ffd97d"
//       />
      
//       {/* Green Gift Box - Left Side */}
//       <rect 
//         x="310" 
//         y="50" 
//         width="80" 
//         height="90" 
//         rx="8" 
//         fill="#7ed957"
//       />
      
//       {/* Green Gift Box - Right Side */}
//       <rect 
//         x="350" 
//         y="50" 
//         width="80" 
//         height="90" 
//         rx="8" 
//         fill="#5fb946"
//       />
      
//       {/* Gift Ribbon - Vertical */}
//       <rect 
//         x="340" 
//         y="50" 
//         width="20" 
//         height="90" 
//         fill="#e94057"
//       />
      
//       {/* Gift Bow - Left */}
//       <ellipse 
//         cx="350" 
//         cy="40" 
//         rx="25" 
//         ry="20" 
//         fill="#ff5c7c"
//       />
      
//       {/* Gift Bow - Right */}
//       <ellipse 
//         cx="390" 
//         cy="40" 
//         rx="25" 
//         ry="20" 
//         fill="#e94057"
//       />
      
//       {/* Cart Slots - Left */}
//       <rect 
//         x="230" 
//         y="200" 
//         width="30" 
//         height="90" 
//         rx="15" 
//         fill="#e8f4f8"
//       />
      
//       {/* Cart Slots - Middle */}
//       <rect 
//         x="310" 
//         y="200" 
//         width="30" 
//         height="90" 
//         rx="15" 
//         fill="#e8f4f8"
//       />
      
//       {/* Cart Slots - Right */}
//       <rect 
//         x="390" 
//         y="200" 
//         width="30" 
//         height="90" 
//         rx="15" 
//         fill="#e8f4f8"
//       />
      
//       {/* Cart Base Bar */}
//       <path 
//         d="M130 380 C130 380 140 420 180 420 L420 420 C460 420 470 380 470 380" 
//         fill="none" 
//         stroke="#5d2e46" 
//         strokeWidth="40" 
//         strokeLinecap="round"
//       />
      
//       {/* Left Wheel - Outer */}
//       <circle 
//         cx="200" 
//         cy="450" 
//         r="40" 
//         fill="#5d2e46"
//       />
      
//       {/* Left Wheel - Inner */}
//       <circle 
//         cx="200" 
//         cy="450" 
//         r="20" 
//         fill="#e8f4f8"
//       />
      
//       {/* Right Wheel - Outer */}
//       <circle 
//         cx="410" 
//         cy="450" 
//         r="40" 
//         fill="#5d2e46"
//       />
      
//       {/* Right Wheel - Inner */}
//       <circle 
//         cx="410" 
//         cy="450" 
//         r="20" 
//         fill="#e8f4f8"
//       />
//     </svg>
//   )
// }


export const CartIconSvg: React.FC = () => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 512 512" 
      className="w-full h-full"
    >
      {/* Cart Handle */}
      <path 
        d="M0 32 L96 32 C110 32 120 42 120 56 L140 140" 
        fill="none" 
        stroke="#ffffff" 
        strokeWidth="32" 
        strokeLinecap="round"
      />
      
      {/* Cart Body - Left Side (Pink) */}
      <path 
        d="M140 140 L480 140 L420 360 L160 360 Z" 
        fill="#ff5c7c"
      />
      
      {/* Cart Body - Right Side (Darker Red) */}
      <path 
        d="M310 140 L480 140 L420 360 L290 360 Z" 
        fill="#e94057"
      />
      
      {/* ANIMATED Yellow Box */}
      <motion.rect 
        x="160" 
        y="80" 
        width="140" 
        height="60" 
        rx="8" 
        fill="#ffd97d"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 80, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.1
        }}
      />
      
      {/* ANIMATED Green Gift Box - Left Side */}
      <motion.rect 
        x="310" 
        y="50" 
        width="80" 
        height="90" 
        rx="8" 
        fill="#7ed957"
        initial={{ y: -150, opacity: 0 }}
        animate={{ y: 50, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.2
        }}
      />
      
      {/* ANIMATED Green Gift Box - Right Side */}
      <motion.rect 
        x="350" 
        y="50" 
        width="80" 
        height="90" 
        rx="8" 
        fill="#5fb946"
        initial={{ y: -150, opacity: 0 }}
        animate={{ y: 50, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.2
        }}
      />
      
      {/* ANIMATED Gift Ribbon - Vertical */}
      <motion.rect 
        x="340" 
        y="50" 
        width="20" 
        height="90" 
        fill="#e94057"
        initial={{ y: -150, opacity: 0 }}
        animate={{ y: 50, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.2
        }}
      />
      
      {/* ANIMATED Gift Bow - Left */}
      <motion.ellipse 
        cx="350" 
        cy="40" 
        rx="25" 
        ry="20" 
        fill="#ff5c7c"
        initial={{ cy: -60, opacity: 0 }}
        animate={{ cy: 40, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.2
        }}
      />
      
      {/* ANIMATED Gift Bow - Right */}
      <motion.ellipse 
        cx="390" 
        cy="40" 
        rx="25" 
        ry="20" 
        fill="#e94057"
        initial={{ cy: -60, opacity: 0 }}
        animate={{ cy: 40, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.2
        }}
      />
      
      {/* Cart Slots - Left */}
      <rect 
        x="230" 
        y="200" 
        width="30" 
        height="90" 
        rx="15" 
        fill="#e8f4f8"
      />
      
      {/* Cart Slots - Middle */}
      <rect 
        x="310" 
        y="200" 
        width="30" 
        height="90" 
        rx="15" 
        fill="#e8f4f8"
      />
      
      {/* Cart Slots - Right */}
      <rect 
        x="390" 
        y="200" 
        width="30" 
        height="90" 
        rx="15" 
        fill="#e8f4f8"
      />
      
      {/* Cart Base Bar */}
      <path 
        d="M130 380 C130 380 140 420 180 420 L420 420 C460 420 470 380 470 380" 
        fill="none" 
        stroke="#5d2e46" 
        strokeWidth="40" 
        strokeLinecap="round"
      />
      
      {/* Left Wheel - Outer */}
      <circle 
        cx="200" 
        cy="450" 
        r="40" 
        fill="#5d2e46"
      />
      
      {/* Left Wheel - Inner */}
      <circle 
        cx="200" 
        cy="450" 
        r="20" 
        fill="#e8f4f8"
      />
      
      {/* Right Wheel - Outer */}
      <circle 
        cx="410" 
        cy="450" 
        r="40" 
        fill="#5d2e46"
      />
      
      {/* Right Wheel - Inner */}
      <circle 
        cx="410" 
        cy="450" 
        r="20" 
        fill="#e8f4f8"
      />
    </svg>
  )
}

export const ResetSvg: React.FC = () => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="w-3 h-3"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  )
}
