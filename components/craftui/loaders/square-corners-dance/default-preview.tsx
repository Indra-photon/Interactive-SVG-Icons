"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 100;
const HEIGHT = 100;

export default function SquareCornersDancePreview() {
  const { color = "currentColor", cornerSize = 16, duration = 1.5, ease = [0.3, 1, 0, 1] } = useLoaderProps();

  const positions = [
    { x: 0, y: 0 },
    { x: WIDTH - cornerSize, y: 0 },
    { x: WIDTH - cornerSize, y: HEIGHT - cornerSize },
    { x: 0, y: HEIGHT - cornerSize },
  ];

  const rotatedPositions = [
    positions[1],
    positions[2],
    positions[3],
    positions[0],
  ];

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      x: [positions[i].x, positions[i].x, rotatedPositions[i].x, rotatedPositions[i].x],
      y: [positions[i].y, positions[i].y, rotatedPositions[i].y, rotatedPositions[i].y],
      transition: { duration, repeat: Infinity, times: [0, 0.33, 0.66, 1], ease },
    }));
  }, [duration, ease, cornerSize, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {positions.map((pos, i) => (
        <motion.rect
          key={i}
          width={cornerSize}
          height={cornerSize}
          fill={color}
          rx={2}
          custom={i}
          initial={{ x: pos.x, y: pos.y }}
          animate={controls}
        />
      ))}
    </svg>
  );
}
