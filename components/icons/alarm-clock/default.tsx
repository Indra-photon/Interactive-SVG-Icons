'use client';

import { motion, useAnimation } from 'motion/react';
import { useEffect } from 'react';

export interface AlarmRingProps {
  size?: number;
  color?: string;
  className?: string;
  isHovered?: boolean;
}

export function IconAlarmRing({
  size = 24,
  color = 'currentColor',
  className = '',
  isHovered = false,
}: AlarmRingProps) {
  const bodyControls = useAnimation();
  const leftEarControls = useAnimation();
  const rightEarControls = useAnimation();

  useEffect(() => {
    if (isHovered) {
      // Main body: damped rock oscillation, pivots from bottom-center of clock
      bodyControls.start({
        rotate: [0, -14, 14, -10, 10, -6, 6, -2, 2, 0],
        transition: {
          duration: 0.9,
          ease: 'easeInOut',
          times: [0, 0.1, 0.25, 0.38, 0.51, 0.62, 0.73, 0.82, 0.91, 1],
        },
      });
      // Left ear: counter-rocks slightly, feels like it's absorbing the swing
      leftEarControls.start({
        rotate: [0, 6, -6, 4, -4, 2, -2, 0],
        transition: {
          duration: 0.9,
          ease: 'easeInOut',
          times: [0, 0.1, 0.25, 0.38, 0.51, 0.62, 0.73, 1],
        },
      });
      // Right ear: opposite counter-rock
      rightEarControls.start({
        rotate: [0, -6, 6, -4, 4, -2, 2, 0],
        transition: {
          duration: 0.9,
          ease: 'easeInOut',
          times: [0, 0.1, 0.25, 0.38, 0.51, 0.62, 0.73, 1],
        },
      });
    } else {
      bodyControls.start({ rotate: 0, transition: { duration: 0.2 } });
      leftEarControls.start({ rotate: 0, transition: { duration: 0.2 } });
      rightEarControls.start({ rotate: 0, transition: { duration: 0.2 } });
    }
  }, [isHovered]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />

      {/* Whole icon rocks from bottom-center of clock face */}
      <motion.g
        animate={bodyControls}
        style={{ transformOrigin: '12px 19px' }}
      >
        {/* Clock face + hands */}
        <path d="M16 6.072a8 8 0 1 1 -11.995 7.213l-.005 -.285l.005 -.285a8 8 0 0 1 11.995 -6.643zm-4 2.928a1 1 0 0 0 -1 1v3l.007 .117a1 1 0 0 0 .993 .883h2l.117 -.007a1 1 0 0 0 .883 -.993l-.007 -.117a1 1 0 0 0 -.993 -.883h-1v-2l-.007 -.117a1 1 0 0 0 -.993 -.883z" />

        {/* Left ear — counter-rotates from its own mount point */}
        <motion.path
          animate={leftEarControls}
          style={{ transformOrigin: '7px 4px' }}
          d="M6.412 3.191a1 1 0 0 1 1.273 1.539l-.097 .08l-2.75 2a1 1 0 0 1 -1.273 -1.54l.097 -.08l2.75 -2z"
        />

        {/* Right ear — counter-rotates from its own mount point */}
        <motion.path
          animate={rightEarControls}
          style={{ transformOrigin: '17px 4px' }}
          d="M16.191 3.412a1 1 0 0 1 1.291 -.288l.106 .067l2.75 2a1 1 0 0 1 -1.07 1.685l-.106 -.067l-2.75 -2a1 1 0 0 1 -.22 -1.397z"
        />
      </motion.g>
    </svg>
  );
}