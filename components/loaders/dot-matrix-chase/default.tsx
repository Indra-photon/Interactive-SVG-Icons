'use client';

import { useEffect, useMemo, useState } from 'react';

interface DotMatrixChaseProps {
  width?: number;
  height?: number;
  color?: string;
  dotSize?: number;
  isAnimating?: boolean;
  duration?: number;
  gridSize?: number;
}

const BASE_OPACITY = 0.07;
const LEADER_TAIL = [1, 0.80, 0.62, 0.46, 0.32, 0.20, 0.12, 0.06] as const;
const CHASER_TAIL = [0.55, 0.40, 0.27, 0.17, 0.09] as const;

function buildSpiralPath(n: number): number[] {
  const path: number[] = [];
  let top = 0, bottom = n - 1, left = 0, right = n - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) path.push(top * n + c);
    top++;
    for (let r = top; r <= bottom; r++) path.push(r * n + right);
    right--;
    if (top <= bottom) { for (let c = right; c >= left; c--) path.push(bottom * n + c); bottom--; }
    if (left <= right) { for (let r = bottom; r >= top; r--) path.push(r * n + left); left++; }
  }
  return path;
}

export function DotMatrixChase({
  width = 100,
  height = 100,
  color = 'currentColor',
  dotSize = 12,
  isAnimating = true,
  duration = 2.5,
  gridSize = 5,
}: DotMatrixChaseProps) {
  const n = Math.max(3, Math.min(6, gridSize));
  const stride = 100 / (n + 1);
  const r = Math.min(dotSize, stride * 0.82) / 2;

  const path = useMemo(() => buildSpiralPath(n), [n]);
  const pathLen = path.length;
  const stepMs = Math.max(16, (duration * 1000) / pathLen);

  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isAnimating) { setTick(0); return; }
    const id = setInterval(() => setTick(t => t + 1), stepMs);
    return () => clearInterval(id);
  }, [isAnimating, stepMs]);

  // Leader runs ahead; chaser is ~55% of path behind, always pursuing
  const leaderHead = tick % pathLen;
  const chaserHead = (tick + Math.floor(pathLen * 0.55)) % pathLen;

  const opacities = useMemo(() => {
    const ops = new Array(n * n).fill(BASE_OPACITY);
    for (let d = 0; d < LEADER_TAIL.length; d++) {
      const idx = path[(leaderHead - d + pathLen) % pathLen]!;
      ops[idx] = Math.max(ops[idx], LEADER_TAIL[d]);
    }
    for (let d = 0; d < CHASER_TAIL.length; d++) {
      const idx = path[(chaserHead - d + pathLen) % pathLen]!;
      ops[idx] = Math.max(ops[idx], CHASER_TAIL[d]);
    }
    return ops;
  }, [leaderHead, chaserHead, path, pathLen, n]);

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
          style={{ transition: 'opacity 60ms linear' }}
        />
      ))}
    </svg>
  );
}
