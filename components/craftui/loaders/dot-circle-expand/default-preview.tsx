"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 100;
const HEIGHT = 100;

export default function DotCircleExpandPreview() {
  const { color = "currentColor", centerDotSize = 10, cornerDotSize = 9, duration = 1.5, ease = [0.3, 1, 0, 1] } = useLoaderProps();

  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const cornerR = cornerDotSize / 2;

  const quarterX = WIDTH * 0.25;
  const quarterY = HEIGHT * 0.25;
  const threeQuarterX = WIDTH * 0.75;
  const threeQuarterY = HEIGHT * 0.75;

  const cornerPositions = [
    { x: quarterX, y: quarterY },
    { x: threeQuarterX, y: quarterY },
    { x: threeQuarterX, y: threeQuarterY },
    { x: quarterX, y: threeQuarterY },
  ];

  const expandOffset = WIDTH * 0.18;
  const expandedPositions = [
    { x: quarterX - expandOffset, y: quarterY - expandOffset },
    { x: threeQuarterX + expandOffset, y: quarterY - expandOffset },
    { x: threeQuarterX + expandOffset, y: threeQuarterY + expandOffset },
    { x: quarterX - expandOffset, y: threeQuarterY + expandOffset },
  ];

  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      cx: [cornerPositions[i].x, expandedPositions[i].x, expandedPositions[i].x, cornerPositions[i].x],
      cy: [cornerPositions[i].y, expandedPositions[i].y, expandedPositions[i].y, cornerPositions[i].y],
      transition: { duration, repeat: Infinity, times: [0, 0.33, 0.66, 1], ease },
    }));
  }, [duration, ease, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <circle cx={cx} cy={cy} r={centerDotSize / 2} fill={color} />
      {cornerPositions.map((pos, i) => (
        <motion.circle
          key={i}
          r={cornerR}
          fill={color}
          custom={i}
          initial={{ cx: pos.x, cy: pos.y }}
          animate={controls}
        />
      ))}
    </svg>
  );
}
