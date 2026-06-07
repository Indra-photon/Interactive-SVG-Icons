'use client';

import { motion } from 'motion/react';

export interface ShoppingCartIconProps {
  size?: number;
  className?: string;
  isAdding?: boolean;
}

export function IconShoppingCart({
  size = 24,
  className = '',
  isAdding = false
}: ShoppingCartIconProps) {
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24"
        className={className}
      >
        <title>cart</title>
        <g fill="none">
          {/* Wheels - static */}
          <path d="M3 21C3 19.8954 3.89543 19 5 19C6.10457 19 7 19.8954 7 21C7 22.1046 6.10457 23 5 23C3.89543 23 3 22.1046 3 21Z" fill="url(#cart_wheel_left)" />
          <path d="M17 21C17 19.8954 17.8954 19 19 19C20.1046 19 21 19.8954 21 21C21 22.1046 20.1046 23 19 23C17.8954 23 17 22.1046 17 21Z" fill="url(#cart_wheel_right)" />
          
          {/* Cart body - shakes when handle lands */}
          <motion.g
            animate={isAdding ? "shake" : "idle"}
            variants={{
              idle: { x: 0, rotate: 0 },
              shake: {
                x: [0, -1, 1, -1, 1, 0],
                rotate: [0, -1, 1, -1, 1, 0],
                transition: {
                  duration: 0.4,
                  times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                  delay: 0.5, // Shake starts when handle lands
                  ease: "easeInOut"
                }
              }
            }}
            style={{ transformOrigin: 'center center' }}
          >
            {/* Main cart body */}
            <path d="M1.26562 1C2.75848 1.00011 4.02423 2.0983 4.23535 3.57617L4.43848 5H19.9834C21.2703 5.00015 22.2224 6.19845 21.9316 7.45215L20.4629 13.7842C20.0889 15.6539 18.4468 17 16.54 17H7.60156C5.61111 16.9998 3.9231 15.5359 3.6416 13.5654L2.58105 6.1416C2.58027 6.13608 2.5798 6.13052 2.5791 6.125L2.25488 3.8584C2.18441 3.36594 1.7631 3.00011 1.26562 3H1C0.447715 3 0 2.55228 0 2C0 1.44772 0.447715 1 1 1H1.26562Z" fill="url(#cart_body)" data-glass="blur" />
            
            {/* Cart rim highlight */}
            <path d="M19.9827 5C21.2697 5 22.2217 6.19837 21.9309 7.45215L20.4622 13.7842C20.0882 15.6538 18.446 17 16.5393 17H7.60084C5.61063 16.9996 3.92235 15.5357 3.64088 13.5654L2.58033 6.1416C2.5394 5.85488 2.6251 5.56364 2.81471 5.34473C3.00449 5.12591 3.28094 5.00021 3.57057 5H19.9827ZM3.51686 5.75586C3.46456 5.76741 3.41619 5.79471 3.38111 5.83496C3.33377 5.8896 3.31338 5.96357 3.3235 6.03516L4.38404 13.459C4.61272 15.0597 5.98376 16.2496 7.60084 16.25H16.5393C18.0885 16.25 19.423 15.1558 19.7268 13.6367C19.7283 13.6293 19.73 13.6216 19.7317 13.6143L21.2005 7.28223C21.3819 6.4986 20.7868 5.75 19.9827 5.75H3.57154L3.51686 5.75586Z" fill="url(#cart_rim)" />
          </motion.g>

          {/* Handle/lid - drops from above with spring bounce */}
          <motion.g
            animate={isAdding ? "drop" : "idle"}
            variants={{
              idle: { y: 0, opacity: 1 },
              drop: {
                y: [
                  -20,      // Start above
                  2,        // Overshoot slightly
                  0         // Settle at normal position
                ],
                opacity: 1,
                transition: {
                  duration: 0.6,
                  times: [0, 0.7, 1],
                  ease: [0.34, 1.56, 0.64, 1], // Spring bounce
                }
              }
            }}
          >
            <path d="M17.9003 4.87875C19.0617 6.05204 19.0569 7.94319 17.8895 9.11055L15.1214 11.8787C13.9498 13.0503 12.0503 13.0503 10.8787 11.8787L8.13209 9.13207C6.95634 7.95631 6.96116 6.04855 8.14284 4.87875L10.939 2.11073C12.1165 0.94505 14.016 0.954691 15.1816 2.13226L17.9003 4.87875Z" fill="url(#cart_handle)" data-glass="origin" mask="url(#cart_mask)" />
            <path d="M17.9003 4.87875C19.0617 6.05204 19.0569 7.94319 17.8895 9.11055L15.1214 11.8787C13.9498 13.0503 12.0503 13.0503 10.8787 11.8787L8.13209 9.13207C6.95634 7.95631 6.96116 6.04855 8.14284 4.87875L10.939 2.11073C12.1165 0.94505 14.016 0.954691 15.1816 2.13226L17.9003 4.87875Z" fill="url(#cart_handle)" data-glass="clone" filter="url(#cart_filter)" clipPath="url(#cart_clipPath)" />
          </motion.g>

          <defs>
            <linearGradient id="cart_handle" x1="13.011" y1="1.243" x2="13.011" y2="12.757" gradientUnits="userSpaceOnUse">
              <stop stopColor="#575757" />
              <stop offset="1" stopColor="#151515" />
            </linearGradient>
            <linearGradient id="cart_wheel_left" x1="5" y1="19" x2="5" y2="23" gradientUnits="userSpaceOnUse">
              <stop stopColor="#575757" />
              <stop offset="1" stopColor="#151515" />
            </linearGradient>
            <linearGradient id="cart_wheel_right" x1="19" y1="19" x2="19" y2="23" gradientUnits="userSpaceOnUse">
              <stop stopColor="#575757" />
              <stop offset="1" stopColor="#151515" />
            </linearGradient>
            <linearGradient id="cart_body" x1="10.992" y1="1" x2="10.992" y2="17" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E3E3E5" stopOpacity=".6" />
              <stop offset="1" stopColor="#BBBBC0" stopOpacity=".6" />
            </linearGradient>
            <linearGradient id="cart_rim" x1="14" y1="5" x2="11.5" y2="9.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <filter id="cart_filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="2" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur" />
            </filter>
            <clipPath id="cart_clipPath">
              <path d="M1.26562 1C2.75848 1.00011 4.02423 2.0983 4.23535 3.57617L4.43848 5H19.9834C21.2703 5.00015 22.2224 6.19845 21.9316 7.45215L20.4629 13.7842C20.0889 15.6539 18.4468 17 16.54 17H7.60156C5.61111 16.9998 3.9231 15.5359 3.6416 13.5654L2.58105 6.1416C2.58027 6.13608 2.5798 6.13052 2.5791 6.125L2.25488 3.8584C2.18441 3.36594 1.7631 3.00011 1.26562 3H1C0.447715 3 0 2.55228 0 2C0 1.44772 0.447715 1 1 1H1.26562Z" fill="url(#cart_body)" />
            </clipPath>
            <mask id="cart_mask">
              <rect width="100%" height="100%" fill="#FFF" />
              <path d="M1.26562 1C2.75848 1.00011 4.02423 2.0983 4.23535 3.57617L4.43848 5H19.9834C21.2703 5.00015 22.2224 6.19845 21.9316 7.45215L20.4629 13.7842C20.0889 15.6539 18.4468 17 16.54 17H7.60156C5.61111 16.9998 3.9231 15.5359 3.6416 13.5654L2.58105 6.1416C2.58027 6.13608 2.5798 6.13052 2.5791 6.125L2.25488 3.8584C2.18441 3.36594 1.7631 3.00011 1.26562 3H1C0.447715 3 0 2.55228 0 2C0 1.44772 0.447715 1 1 1H1.26562Z" fill="#000" />
            </mask>
          </defs>
        </g>
      </svg>
    </div>
  );
}