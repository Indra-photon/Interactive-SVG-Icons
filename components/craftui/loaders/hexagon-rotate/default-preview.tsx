"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const WIDTH = 100;
const HEIGHT = 100;

export default function HexagonRotatePreview() {
  const { color = "currentColor", thickness = 3, duration = 2.0, ease = [0.4, 0, 0.6, 1] } = useLoaderProps();

  const centerX = WIDTH / 2;
  const centerY = HEIGHT / 2;

  const getPoints = (r: number, rotation: number) =>
    Array.from({ length: 6 })
      .map((_, i) => {
        const angle = (60 * i + rotation) * (Math.PI / 180);
        return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
      })
      .join(" ");

  const radiusA = Math.min(WIDTH, HEIGHT) * 0.42;
  const radiusB = Math.min(WIDTH, HEIGHT) * 0.32;

  const pointsA = getPoints(radiusA, -30);
  const pointsB = getPoints(radiusB, 0);

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      points: [pointsA, pointsB, pointsA],
      fillOpacity: [0.15, 0.6, 0.15],
      strokeOpacity: [1, 0.4, 1],
      scale: [1, 0.88, 1],
      transition: { duration, repeat: Infinity, ease, times: [0, 0.5, 1] },
    });
  }, [duration, ease, pointsA, pointsB, controls]);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      <polygon
        points={pointsA}
        stroke={color}
        strokeWidth={thickness * 0.5}
        fill="none"
        opacity={0.02}
        strokeLinejoin="round"
      />
      <motion.polygon
        strokeLinejoin="round"
        stroke={color}
        strokeWidth={thickness}
        fill={color}
        initial={{ points: pointsA, fillOpacity: 0.15, strokeOpacity: 1, scale: 1 }}
        animate={controls}
        style={{ originX: `${centerX}px`, originY: `${centerY}px` }}
      />
    </svg>
  );
}
