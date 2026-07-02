"use client";

import { useEffect, useState } from "react";
import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";

const SIZE = 100;

export default function SpinnerOrbitDotsPreview() {
  const { dotCount = 8, dotSize = 6, speed = 120 } = useLoaderProps();

  const centerX = SIZE / 2;
  const centerY = SIZE / 2;
  const radius = SIZE * 0.35;
  const [activeDot, setActiveDot] = useState(0);

  const dots = Array.from({ length: dotCount }).map((_, i) => {
    const angle = (360 / dotCount) * i - 90;
    const rad = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad),
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % dotCount);
    }, speed);
    return () => clearInterval(interval);
  }, [dotCount, speed]);

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img">
      {dots.map((dot, i) => (
        <circle
          key={i}
          cx={dot.x}
          cy={dot.y}
          r={dotSize / 2}
          fill={i === activeDot ? "transparent" : "#404040"}
        />
      ))}
    </svg>
  );
}
