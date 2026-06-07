'use client';

import { motion } from 'framer-motion';

interface SquareFlipProps {
  width?: number;
  height?: number;
  color?: string;
  isAnimating?: boolean;
  duration?: number;
  ease?: any;
}

export function SquareFlip({
  width = 40,
  height = 40,
  color = "currentColor",
  isAnimating = true,
  duration = 1.2,
  ease = 'easeInOut',
}: SquareFlipProps) {
  const size = Math.min(width, height) * 0.6;
  const x = (width - size) / 2;
  const y = (height - size) / 2;

  return (
    <div style={{ width, height, perspective: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
  style={{
    width: size,
    height: size,
    borderRadius: 2,
    transformStyle: 'preserve-3d',
    position: 'relative',
  }}
  animate={{ rotateY: [0, 180, 360] }}
  transition={{ duration: duration, repeat: isAnimating ? Infinity : 0, ease: ease }}
>
  {/* Front face */}
  <div style={{ position: 'absolute', inset: 0, borderRadius: 2, backgroundColor: color, backfaceVisibility: 'hidden' }} />
  
  {/* Back face */}
  <div style={{ position: 'absolute', inset: 0, borderRadius: 2, border: `2.5px solid ${color}`, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }} />
</motion.div>
    </div>
  );
}
