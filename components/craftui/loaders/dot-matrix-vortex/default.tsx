'use client';

import { useEffect, useMemo, useState } from 'react';

interface DotMatrixVortexProps {
  width?: number;
  height?: number;
  color?: string;
  dotSize?: number;
  isAnimating?: boolean;
  duration?: number;
  gridSize?: number;
}

const BASE_OPACITY = 0.07;
const VORTEX_TAIL = [1, 0.72, 0.48, 0.28, 0.14, 0.07] as const;

/**
 * Build clockwise perimeter cells for each concentric ring.
 * Ring 0 = outermost, ring maxDepth = center.
 */
function buildRings(n: number): number[][] {
  const rings: number[][] = [];
  const maxDepth = Math.floor((n - 1) / 2);

  for (let depth = 0; depth <= maxDepth; depth++) {
    const top = depth, bottom = n - 1 - depth;
    const left = depth, right = n - 1 - depth;
    const cells: number[] = [];

    if (top === bottom && left === right) {
      // Single center cell
      cells.push(top * n + left);
    } else if (top + 1 === bottom && left + 1 === right) {
      // 2×2 center — treat as a mini ring
      cells.push(top * n + left);
      cells.push(top * n + right);
      cells.push(bottom * n + right);
      cells.push(bottom * n + left);
    } else {
      for (let c = left; c <= right; c++) cells.push(top * n + c);
      for (let r = top + 1; r <= bottom; r++) cells.push(r * n + right);
      for (let c = right - 1; c >= left; c--) cells.push(bottom * n + c);
      for (let r = bottom - 1; r >= top + 1; r--) cells.push(r * n + left);
    }

    rings.push(cells);
  }
  return rings;
}

export function DotMatrixVortex({
  width = 100,
  height = 100,
  color = 'currentColor',
  dotSize = 12,
  isAnimating = true,
  duration = 2,
  gridSize = 5,
}: DotMatrixVortexProps) {
  const n = Math.max(3, Math.min(6, gridSize));
  const stride = 100 / (n + 1);
  const r = Math.min(dotSize, stride * 0.82) / 2;

  const rings = useMemo(() => buildRings(n), [n]);

  // Outer ring completes one revolution in `duration` seconds.
  // Each inner ring is 2× faster than the one outside it (gyroscope effect).
  const outerPerimeter = rings[0]?.length ?? 1;
  const stepMs = Math.max(16, (duration * 1000) / outerPerimeter);

  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isAnimating) { setTick(0); return; }
    const id = setInterval(() => setTick(t => t + 1), stepMs);
    return () => clearInterval(id);
  }, [isAnimating, stepMs]);

  const opacities = useMemo(() => {
    const ops = new Array(n * n).fill(BASE_OPACITY);

    rings.forEach((ring, depth) => {
      const ringLen = ring.length;
      // Speed doubles with each inner ring
      const speed = 1 << depth; // 1, 2, 4, 8…

      if (ringLen === 1) {
        // Single center cell — pulse on/off at its speed
        const pulseOn = Math.floor(tick * speed / 3) % 2 === 0;
        ops[ring[0]!] = pulseOn ? 0.85 : BASE_OPACITY;
        return;
      }

      const headPos = (tick * speed) % ringLen;
      for (let d = 0; d < VORTEX_TAIL.length && d < ringLen; d++) {
        const pos = (headPos - d + ringLen) % ringLen;
        const idx = ring[pos]!;
        ops[idx] = Math.max(ops[idx], VORTEX_TAIL[d]);
      }
    });

    return ops;
  }, [tick, rings, n]);

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
          style={{ transition: 'opacity 50ms linear' }}
        />
      ))}
    </svg>
  );
}
