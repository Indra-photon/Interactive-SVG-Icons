'use client';

import { useEffect, useMemo, useState } from 'react';

interface DotMatrixBitsProps {
  width?: number;
  height?: number;
  color?: string;
  dotSize?: number;
  isAnimating?: boolean;
  duration?: number;
  gridSize?: number;
}

const BASE_OPACITY = 0.06;
const ACTIVE_OPACITY = 0.96;

export function DotMatrixBits({
  width = 100,
  height = 100,
  color = 'currentColor',
  dotSize = 12,
  isAnimating = true,
  duration = 3,
  gridSize = 5,
}: DotMatrixBitsProps) {
  const n = Math.max(2, Math.min(6, gridSize));
  const stride = 100 / (n + 1);
  const r = Math.min(dotSize, stride * 0.82) / 2;

  // Row r counts at speed 2^(n-1-r): row 0 is slowest (MSB), row n-1 is fastest (LSB)
  // This gives a "waterfall" where the bottom row flickers fastest.
  // Full cycle of the bottom row = 2^n ticks.
  const stepMs = Math.max(16, (duration * 1000) / (1 << n));

  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isAnimating) { setTick(0); return; }
    const id = setInterval(() => setTick(t => t + 1), stepMs);
    return () => clearInterval(id);
  }, [isAnimating, stepMs]);

  const opacities = useMemo(() => {
    return Array.from({ length: n * n }, (_, i) => {
      const row = Math.floor(i / n);
      const col = i % n;
      // Row r sees a counter that increments every 2^r ticks
      // (row n-1 = fastest, row 0 = slowest — reversed from natural order)
      const speed = 1 << (n - 1 - row); // row 0 has speed 2^(n-1), row n-1 has speed 1
      const counter = Math.floor(tick / speed);
      // Column c shows bit (n-1-c) of this counter: leftmost col = MSB
      const bit = (counter >> (n - 1 - col)) & 1;
      return bit === 1 ? ACTIVE_OPACITY : BASE_OPACITY;
    });
  }, [tick, n]);

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
      {Array.from({ length: n * n }, (_, i) => (
        <circle
          key={i}
          cx={stride + (i % n) * stride}
          cy={stride + Math.floor(i / n) * stride}
          r={r}
          fill={color}
          opacity={opacities[i]}
        />
      ))}
    </svg>
  );
}
