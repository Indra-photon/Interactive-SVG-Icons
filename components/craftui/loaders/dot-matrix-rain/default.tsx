'use client';

import { useEffect, useMemo, useState } from 'react';

interface DotMatrixRainProps {
  width?: number;
  height?: number;
  color?: string;
  dotSize?: number;
  isAnimating?: boolean;
  duration?: number;
  gridSize?: number;
}

const BASE_OPACITY = 0.06;
// Opacity of drop head + trail: index 0 = head (brightest), trailing up
const RAIN_TAIL = [1, 0.65, 0.38, 0.18, 0.08] as const;
// Ticks the drop "rests" invisible after reaching the bottom
const COOLDOWN = 5;

export function DotMatrixRain({
  width = 100,
  height = 100,
  color = 'currentColor',
  dotSize = 12,
  isAnimating = true,
  duration = 1.8,
  gridSize = 5,
}: DotMatrixRainProps) {
  const n = Math.max(2, Math.min(6, gridSize));
  const stride = 100 / (n + 1);
  const r = Math.min(dotSize, stride * 0.82) / 2;

  // Each column cycles independently: fall (n ticks) + cooldown (COOLDOWN ticks)
  const cycleTicks = n + COOLDOWN;
  // Stagger columns so they don't all start together
  const colOffsets = useMemo(
    () => Array.from({ length: n }, (_, c) => Math.round((c / n) * cycleTicks * 0.85)),
    [n, cycleTicks]
  );

  const stepMs = Math.max(16, (duration * 1000) / cycleTicks);

  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isAnimating) { setTick(0); return; }
    const id = setInterval(() => setTick(t => t + 1), stepMs);
    return () => clearInterval(id);
  }, [isAnimating, stepMs]);

  const opacities = useMemo(() => {
    const ops = new Array(n * n).fill(BASE_OPACITY);
    for (let col = 0; col < n; col++) {
      const phase = (tick + colOffsets[col]) % cycleTicks;
      if (phase >= n) continue; // in cooldown — no active drop
      const dropRow = phase; // current head row (0 = top, n-1 = bottom)
      for (let row = 0; row < n; row++) {
        const dist = dropRow - row; // positive = row is above head
        if (dist >= 0 && dist < RAIN_TAIL.length) {
          const idx = row * n + col;
          ops[idx] = Math.max(ops[idx], RAIN_TAIL[dist]);
        }
      }
    }
    return ops;
  }, [tick, n, colOffsets, cycleTicks]);

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
          style={{ transition: 'opacity 55ms linear' }}
        />
      ))}
    </svg>
  );
}
