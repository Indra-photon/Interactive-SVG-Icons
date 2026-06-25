"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 100;
const HEIGHT = 100;

export default function CrossExpandPreview() {
  const { color = "#25b09b", crossThickness = 8, cornerSize = 12, duration = 2.0, ease = "easeInOut" } = useLoaderProps();

  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;

  const cornerPositions = [
    { x: 0, y: 0 },
    { x: WIDTH - cornerSize, y: 0 },
    { x: 0, y: HEIGHT - cornerSize },
    { x: WIDTH - cornerSize, y: HEIGHT - cornerSize },
  ];

  const stagger = 0.125;
  const fillDuration = 0.1;
  const holdEnd = 0.75;
  const fadeEnd = 0.85;

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => {
      const start = i * stagger;
      const end = start + fillDuration;
      const times = [0, start, end, holdEnd, fadeEnd, 1];
      return {
        opacity: [0, 0, 1, 1, 0, 0],
        scale: [0.3, 0.3, 1, 1, 0.3, 0.3],
        transition: { duration, repeat: Infinity, times, ease },
      };
    });
  }, [duration, ease, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <rect x={0} y={cy - crossThickness / 2} width={WIDTH} height={crossThickness} fill={color} rx={crossThickness / 2} />
      <rect x={cx - crossThickness / 2} y={0} width={crossThickness} height={HEIGHT} fill={color} rx={crossThickness / 2} />
      {cornerPositions.map((pos, i) => {
        const centerX = pos.x + cornerSize / 2;
        const centerY = pos.y + cornerSize / 2;
        return (
          <motion.rect
            key={i}
            x={pos.x}
            y={pos.y}
            width={cornerSize}
            height={cornerSize}
            fill={color}
            rx={2}
            custom={i}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={controls}
            style={{ transformOrigin: `${centerX}px ${centerY}px` }}
          />
        );
      })}
    </svg>
  );
}
