'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

interface DockBounceProps {
  width?: number;
  height?: number;
  color?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
  repeatDelay?: number;
}

export function DockBounce({
  width = 100,
  height = 100,
  color = 'currentColor',
  isAnimating = true,
  duration = 1.4,
  ease = 'easeOut',
  repeatDelay = 1.0,
}: DockBounceProps) {
  const controlsShadow = useAnimation();
  const controlsIcon = useAnimation();

  useEffect(() => {
    if (isAnimating) {
      controlsShadow.start({
        rx: [10, 14, 10, 12, 10, 11, 10],
        ry: [3, 4.5, 3, 3.8, 3, 3.3, 3],
        opacity: [0.25, 0.1, 0.25, 0.15, 0.25, 0.2, 0.25],
        transition: { duration, repeat: Infinity, repeatDelay: 1, times: [0, 0.25, 0.5, 0.65, 0.8, 0.9, 1], ease },
      });
      controlsIcon.start({
        y: [0, -38, 0, -14, 0, -5, 0],
        scaleX: [1, 1, 1.14, 1, 1.06, 1, 1],
        scaleY: [1, 1, 0.82, 1, 0.92, 1, 1],
        transition: { duration, repeat: Infinity, repeatDelay: 1, times: [0, 0.25, 0.5, 0.65, 0.8, 0.9, 1], ease },
      });
    } else {
      controlsShadow.stop();
      controlsShadow.set({ rx: 10, ry: 3, opacity: 0.15 });
      controlsIcon.stop();
      controlsIcon.set({ y: 0, scaleX: 1, scaleY: 1 });
    }
  }, [isAnimating, duration, ease, controlsShadow, controlsIcon]);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
    >
      {/* Shadow under the icon — squishes when icon lands */}
      <motion.ellipse
        cx={50}
        cy={84}
        fill={color}
        initial={{ rx: 10, ry: 3, opacity: 0.15 }}
        animate={controlsShadow}
      />

      {/* App icon — rounded square that bounces */}
      <motion.rect
        x={25}
        y={25}
        width={50}
        height={50}
        rx={12}
        fill={color}
        style={{ transformOrigin: '50px 75px' }}
        initial={{ y: 0, scaleX: 1, scaleY: 1 }}
        animate={controlsIcon}
      />
    </svg>
  );
}
