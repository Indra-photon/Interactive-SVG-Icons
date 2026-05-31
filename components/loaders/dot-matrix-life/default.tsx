'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface DotMatrixLifeProps {
  width?: number;
  height?: number;
  color?: string;
  dotSize?: number;
  isAnimating?: boolean;
  duration?: number;
  gridSize?: number;
}

const BASE_OPACITY = 0.06;
const ALIVE_OPACITY = 0.95;

type Grid = boolean[][];

function nextGeneration(grid: Grid, n: number): Grid {
  return Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => {
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          // Toroidal wrapping
          if (grid[(r + dr + n) % n]![(c + dc + n) % n]) count++;
        }
      }
      if (grid[r]![c]) return count === 2 || count === 3;
      return count === 3;
    })
  );
}

function gridKey(grid: Grid): string {
  return grid.map(r => r.map(c => c ? '1' : '0').join('')).join('|');
}

function makeInitialGrid(n: number): Grid {
  const g: Grid = Array.from({ length: n }, () => Array(n).fill(false));
  const mid = Math.floor(n / 2);
  // Horizontal blinker in center row — reliable period-2 oscillator
  g[mid]![Math.max(0, mid - 1)] = true;
  g[mid]![mid] = true;
  g[mid]![Math.min(n - 1, mid + 1)] = true;
  // Add a second blinker offset to create more visual activity
  if (n >= 4) {
    const r2 = Math.floor(n / 4);
    const c2 = Math.floor((3 * n) / 4);
    g[r2]![Math.max(0, c2 - 1)] = true;
    g[r2]![c2] = true;
    g[r2]![Math.min(n - 1, c2 + 1)] = true;
  }
  // A third blinker for grids large enough
  if (n >= 5) {
    const r3 = Math.floor((3 * n) / 4);
    const c3 = Math.floor(n / 4);
    g[Math.max(0, r3 - 1)]![c3] = true;
    g[r3]![c3] = true;
    g[Math.min(n - 1, r3 + 1)]![c3] = true;
  }
  return g;
}

export function DotMatrixLife({
  width = 100,
  height = 100,
  color = 'currentColor',
  dotSize = 12,
  isAnimating = true,
  duration = 0.5,
  gridSize = 5,
}: DotMatrixLifeProps) {
  const n = Math.max(3, Math.min(6, gridSize));
  const stride = 100 / (n + 1);
  const r = Math.min(dotSize, stride * 0.82) / 2;

  const initial = useMemo(() => makeInitialGrid(n), [n]);
  const [grid, setGrid] = useState<Grid>(initial);
  const historyRef = useRef<Set<string>>(new Set([gridKey(initial)]));

  // Reset when n changes
  useEffect(() => {
    const g = makeInitialGrid(n);
    setGrid(g);
    historyRef.current = new Set([gridKey(g)]);
  }, [n]);

  const stepMs = Math.max(80, duration * 1000);

  useEffect(() => {
    if (!isAnimating) return;
    const id = setInterval(() => {
      setGrid(prev => {
        const next = nextGeneration(prev, n);
        const key = gridKey(next);
        // Dead grid or revisited state → reset
        const allDead = next.every(row => row.every(c => !c));
        if (allDead || historyRef.current.has(key)) {
          const fresh = makeInitialGrid(n);
          historyRef.current = new Set([gridKey(fresh)]);
          return fresh;
        }
        // Keep only last 16 states to avoid unbounded memory
        if (historyRef.current.size > 16) {
          const arr = Array.from(historyRef.current);
          historyRef.current = new Set(arr.slice(-8));
        }
        historyRef.current.add(key);
        return next;
      });
    }, stepMs);
    return () => clearInterval(id);
  }, [isAnimating, stepMs, n]);

  const opacities = useMemo(
    () => grid.flatMap(row => row.map(cell => (cell ? ALIVE_OPACITY : BASE_OPACITY))),
    [grid]
  );

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
          style={{ transition: 'opacity 120ms ease' }}
        />
      ))}
    </svg>
  );
}
