"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const TAU = Math.PI * 2;
const INK = "#111111";

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const frac = (t: number) => t - Math.floor(t);

const tri = (t: number) => 1 - Math.abs(2 * frac(t) - 1);

const wrapDist = (t: number) => {
  const f = frac(t);
  return f < 0.5 ? f : 1 - f;
};

const smootherstep = (t: number) => {
  const x = clamp01(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

const impulse = (t: number, k = 12) => {
  const h = k * t;
  return h * Math.exp(1 - h);
};

function roundRect(
  p: Path2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rad = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  p.moveTo(x + rad, y);
  p.arcTo(x + w, y, x + w, y + h, rad);
  p.arcTo(x + w, y + h, x, y + h, rad);
  p.arcTo(x, y + h, x, y, rad);
  p.arcTo(x, y, x + w, y, rad);
  p.closePath();
}

function lazy<T>(make: () => T) {
  let v: T | undefined;
  return () => (v === undefined ? (v = make()) : v);
}

type Deriv = (t: number, y: Float64Array, out: Float64Array) => void;

function makeRK4(n: number, f: Deriv) {
  const k1 = new Float64Array(n);
  const k2 = new Float64Array(n);
  const k3 = new Float64Array(n);
  const k4 = new Float64Array(n);
  const yt = new Float64Array(n);
  return (y: Float64Array, t: number, dt: number) => {
    f(t, y, k1);
    for (let i = 0; i < n; i++) yt[i] = y[i] + (dt / 2) * k1[i];
    f(t + dt / 2, yt, k2);
    for (let i = 0; i < n; i++) yt[i] = y[i] + (dt / 2) * k2[i];
    f(t + dt / 2, yt, k3);
    for (let i = 0; i < n; i++) yt[i] = y[i] + dt * k3[i];
    f(t + dt, yt, k4);
    for (let i = 0; i < n; i++)
      y[i] += (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  };
}

function closeDrift(frames: Float64Array[]): Float64Array[] {
  const n = frames.length;
  const dim = frames[0].length;
  for (let j = 0; j < dim; j++) {
    const drift = frames[n - 1][j] - frames[0][j];
    for (let i = 0; i < n; i++) frames[i][j] -= (i / (n - 1)) * drift;
  }
  return frames.slice(0, n - 1);
}

function sampleFrames(frames: Float64Array[], tau: number, out: Float64Array) {
  const n = frames.length;
  const x = frac(tau) * n;
  const i0 = Math.floor(x) % n;
  const i1 = (i0 + 1) % n;
  const f = x - Math.floor(x);
  const a = frames[i0];
  const b = frames[i1];
  for (let j = 0; j < out.length; j++) out[j] = a[j] * (1 - f) + b[j] * f;
}

const lorenzDeriv: Deriv = (t, y, o) => {
  o[0] = 10 * (y[1] - y[0]);
  o[1] = y[0] * (28 - y[2]) - y[1];
  o[2] = y[0] * y[1] - (8 / 3) * y[2];
};

const lorenzUPO = lazy(() => {
  const step = makeRK4(3, lorenzDeriv);
  const y = Float64Array.from([1, 1, 20]);
  const dt = 0.002;
  for (let i = 0; i < 15000; i++) step(y, 0, dt);

  const sect: { x: number; y: number; t: number; s: Float64Array }[] = [];
  let t = 0;
  for (let i = 0; i < 900000 && sect.length < 2200; i++) {
    const pz = y[2];
    step(y, t, dt);
    t += dt;
    if (pz < 27 && y[2] >= 27)
      sect.push({ x: y[0], y: y[1], t, s: Float64Array.from(y) });
  }

  let best = 0;
  let bd = Infinity;
  for (let i = 0; i + 2 < sect.length; i++) {
    const d = Math.hypot(sect[i].x - sect[i + 2].x, sect[i].y - sect[i + 2].y);
    if (d < bd) {
      bd = d;
      best = i;
    }
  }

  const T = sect[best + 2].t - sect[best].t;
  const N = 900;
  const h = T / N;
  const s = Float64Array.from(sect[best].s);
  const raw: Float64Array[] = [];
  for (let i = 0; i <= N; i++) {
    raw.push(Float64Array.from(s));
    if (i < N) step(s, 0, h);
  }
  return { frames: closeDrift(raw), T, err: bd };
});

export type Art = {
  id: string;
  name: string;
  period: number;
  fps?: number;
  draw: (ctx: CanvasRenderingContext2D, size: number, tau: number) => void;
};

const flow: Art = {
  id: "flow",
  name: "Flow",
  period: 9,
  draw(ctx, size, tau) {
    const n = 30;
    const cell = size / n;
    const len = cell * 0.78;
    const path = new Path2D();

    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const xn = i / (n - 1);
        const yn = j / (n - 1);
        const a =
          TAU *
          (0.45 * Math.sin(TAU * (1.1 * xn - tau)) +
            0.35 * Math.cos(TAU * (1.3 * yn + tau)) +
            0.3 * Math.sin(TAU * (0.9 * (xn + yn) - 2 * tau)));
        const s = 0.45 + 0.55 * impulse(frac(tau + (xn + yn) * 0.5), 3);
        const l = (len / 2) * Math.min(1.3, s);
        const cx = (i + 0.5) * cell;
        const cy = (j + 0.5) * cell;
        path.moveTo(cx - l * Math.cos(a), cy - l * Math.sin(a));
        path.lineTo(cx + l * Math.cos(a), cy + l * Math.sin(a));
      }
    }
    ctx.lineCap = "round";
    ctx.lineWidth = cell * 0.2;
    ctx.strokeStyle = INK;
    ctx.stroke(path);
  },
};

const pulse: Art = {
  id: "pulse",
  name: "Pulse",
  period: 5,
  draw(ctx, size, tau) {
    const n = 16;
    const cell = size / n;
    const rMax = cell * 0.46;
    const sigma = 0.11;
    const path = new Path2D();

    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const u = (i + j) / (2 * (n - 1));
        const a = wrapDist(tau - u);
        const b = wrapDist(tau - u + 0.5);
        const g =
          Math.exp(-(a * a) / (2 * sigma * sigma)) +
          0.55 * Math.exp(-(b * b) / (2 * sigma * sigma));
        const r = rMax * (0.14 + 0.86 * Math.min(1, g));
        path.moveTo((i + 0.5) * cell + r, (j + 0.5) * cell);
        path.arc((i + 0.5) * cell, (j + 0.5) * cell, r, 0, TAU);
      }
    }
    ctx.fillStyle = INK;
    ctx.fill(path);
  },
};

const columns: Art = {
  id: "columns",
  name: "Columns",
  period: 6,
  draw(ctx, size, tau) {
    const n = 13;
    const cell = size / n;
    const bw = cell * 0.46;
    const path = new Path2D();

    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const u = (i + j) / (2 * (n - 1));
        const h = 0.1 + 0.9 * smootherstep(tri(tau - u));
        const bh = cell * 0.9 * h;
        const x = i * cell + (cell - bw) / 2;
        const y = j * cell + cell * 0.95 - bh;
        roundRect(path, x, y, bw, bh, bw * 0.5);
      }
    }
    ctx.fillStyle = INK;
    ctx.fill(path);
  },
};

const lorenzOrbit: Art = {
  id: "lorenz-upo",
  name: "Lorenz orbit",
  period: 7,
  draw(ctx, size, tau) {
    const { frames } = lorenzUPO();
    const s = size / 60;
    const px = (v: number) => size / 2 + v * s;
    const pz = (v: number) => size * 0.95 - v * s * 0.86;

    ctx.strokeStyle = INK;
    ctx.lineWidth = Math.max(0.6, size * 0.0035);
    ctx.globalAlpha = 0.28;
    ctx.beginPath();
    for (let i = 0; i < frames.length; i++) {
      const f = frames[i];
      if (i === 0) ctx.moveTo(px(f[0]), pz(f[2]));
      else ctx.lineTo(px(f[0]), pz(f[2]));
    }
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 1;

    const M = 26;
    const p = new Float64Array(3);
    const path = new Path2D();
    for (let k = 0; k < M; k++) {
      sampleFrames(frames, tau + k / M, p);
      const sp = Math.hypot(10 * (p[1] - p[0]), p[0] * p[1] - (8 / 3) * p[2]);
      const r = size * 0.006 + size * 0.016 * clamp01(sp / 260);
      path.moveTo(px(p[0]) + r, pz(p[2]));
      path.arc(px(p[0]), pz(p[2]), r, 0, TAU);
    }
    ctx.fillStyle = INK;
    ctx.fill(path);
  },
};

const dipole: Art = {
  id: "dipole",
  name: "Dipole field",
  period: 10,
  draw(ctx, size, tau) {
    const n = 24;
    const cell = size / n;
    const a = TAU * tau;
    const poles = [
      { x: size * 0.32, y: size * 0.38, mx: Math.cos(a), my: Math.sin(a) },
      {
        x: size * 0.68,
        y: size * 0.64,
        mx: Math.cos(-2 * a),
        my: Math.sin(-2 * a),
      },
    ];
    const path = new Path2D();
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const px = (i + 0.5) * cell;
        const py = (j + 0.5) * cell;
        let bx = 0;
        let by = 0;
        for (const p of poles) {
          const dx = (px - p.x) / size;
          const dy = (py - p.y) / size;
          const r = Math.max(0.04, Math.hypot(dx, dy));
          const rx = dx / r;
          const ry = dy / r;
          const mr = p.mx * rx + p.my * ry;
          const k = 1 / (r * r * r);
          bx += k * (3 * mr * rx - p.mx);
          by += k * (3 * mr * ry - p.my);
        }
        const ang = Math.atan2(by, bx);
        const mag = Math.hypot(bx, by);
        const L = cell * 0.46 * clamp01(0.25 + Math.log1p(mag) / 6);
        path.moveTo(px - L * Math.cos(ang), py - L * Math.sin(ang));
        path.lineTo(px + L * Math.cos(ang), py + L * Math.sin(ang));
      }
    }
    ctx.lineCap = "round";
    ctx.lineWidth = cell * 0.19;
    ctx.strokeStyle = INK;
    ctx.stroke(path);
  },
};

const lorenzSlice: Art = {
  id: "lorenz-slice",
  name: "Lorenz slice",
  period: 13,
  draw(ctx, size, tau) {
    const n = 26;
    const cell = size / n;
    const phi = TAU * tau;
    const cf = Math.cos(phi);
    const sf = Math.sin(phi);
    const S = 46;
    const d = new Float64Array(3);
    const s = new Float64Array(3);
    const path = new Path2D();

    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const p = ((i + 0.5) / n - 0.5) * S;
        const q = (0.5 - (j + 0.5) / n) * S + 25 + 7 * (1 - Math.cos(phi));
        s[0] = p * cf;
        s[1] = p * sf;
        s[2] = q;
        lorenzDeriv(0, s, d);
        const vp = d[0] * cf + d[1] * sf;
        const vq = d[2];
        const ang = Math.atan2(-vq, vp);
        const mag = Math.hypot(vp, vq);
        const L = cell * 0.46 * clamp01(0.2 + Math.log1p(mag) / 6);
        const cx = (i + 0.5) * cell;
        const cy = (j + 0.5) * cell;
        path.moveTo(cx - L * Math.cos(ang), cy - L * Math.sin(ang));
        path.lineTo(cx + L * Math.cos(ang), cy + L * Math.sin(ang));
      }
    }
    ctx.lineCap = "round";
    ctx.lineWidth = cell * 0.18;
    ctx.strokeStyle = INK;
    ctx.stroke(path);
  },
};

function OpCanvas({
  draw,
  period,
  fps,
  label,
  className,
}: {
  draw: Art["draw"];
  period: number;
  fps?: number;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let size = 0;
    let raf = 0;
    let last = -Infinity;
    const start = performance.now();
    const interval = fps ? 1000 / fps : 0;

    const render = (now: number) => {
      raf = window.requestAnimationFrame(render);
      if (now - last < interval) return;
      last = now;
      const tau = reducedMotion ? 0 : frac((now - start) / 1000 / period);
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      draw(ctx, size, tau);
      ctx.restore();
    };

    const stop = () => {
      if (raf !== 0) window.cancelAnimationFrame(raf);
      raf = 0;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const box = Math.min(rect.width, rect.height);
      if (box === 0) {
        size = 0;
        stop();
        return;
      }
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      size = box;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      last = -Infinity;
      if (raf === 0) raf = window.requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    return () => {
      stop();
      observer.disconnect();
    };
  }, [draw, period, fps, reducedMotion]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={label}
      className={cn("block h-full w-full", className)}
    />
  );
}

const ISO_K = 0.8660254;
const ISO_S = 13;
const ISO_OX = 190;
const ISO_OY = 250;

type Pt = readonly [number, number];

const p = (x: number, y: number, z = 0): Pt => [
  (x - y) * ISO_K * ISO_S + ISO_OX,
  ((x + y) / 2 - z) * ISO_S + ISO_OY,
];

const poly = (pts: Pt[], close = true) =>
  pts
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ") + (close ? "Z" : "");

const roundPoly = (pts: Pt[], r = 4) => {
  const n = pts.length;
  const lerp = (a: Pt, b: Pt, t: number): Pt => [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
  ];
  const at = (a: Pt, b: Pt) => {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    return Math.min(0.5, r / (len || 1));
  };
  let d = "";
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n];
    const cur = pts[i];
    const next = pts[(i + 1) % n];
    const a = lerp(cur, prev, at(cur, prev));
    const b = lerp(cur, next, at(cur, next));
    d +=
      i === 0
        ? `M${a[0].toFixed(2)} ${a[1].toFixed(2)}`
        : `L${a[0].toFixed(2)} ${a[1].toFixed(2)}`;
    d += `Q${cur[0].toFixed(2)} ${cur[1].toFixed(2)} ${b[0].toFixed(2)} ${b[1].toFixed(2)}`;
  }
  return d + "Z";
};

const quad = (x: number, y: number, z: number, w: number, d: number) =>
  [p(x, y, z), p(x + w, y, z), p(x + w, y + d, z), p(x, y + d, z)] as Pt[];

const boxFaces = (
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number,
) => ({
  top: quad(x, y, z + h, w, d),
  front: [
    p(x, y + d, z),
    p(x + w, y + d, z),
    p(x + w, y + d, z + h),
    p(x, y + d, z + h),
  ] as Pt[],
  flank: [
    p(x + w, y, z),
    p(x + w, y + d, z),
    p(x + w, y + d, z + h),
    p(x + w, y, z + h),
  ] as Pt[],
});

const onFront = (yc: number, x0: number, x1: number, z0: number, z1: number) =>
  [p(x0, yc, z0), p(x1, yc, z0), p(x1, yc, z1), p(x0, yc, z1)] as Pt[];

const onFlank = (xc: number, y0: number, y1: number, z0: number, z1: number) =>
  [p(xc, y0, z0), p(xc, y1, z0), p(xc, y1, z1), p(xc, y0, z1)] as Pt[];

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

const ISO_INK = "#243027";
const ACCENT = "#6f7a62";
const TOP = "#ffffff";
const FRONT = "#f3f4f0";
const FLANK = "#e3e5de";

const LINE = {
  stroke: ISO_INK,
  fill: "none",
  strokeLinejoin: "round",
} as const;

function DataBox({ z, index }: { z: number; index: number }) {
  const x = 0,
    y = 0,
    w = 11,
    d = 8,
    h = 2.3;
  const f = boxFaces(x, y, z, w, d, h);
  const yf = y + d;

  return (
    <g>
      <path d={roundPoly(f.flank)} fill={FLANK} />
      <path d={roundPoly(f.front)} fill={FRONT} />
      <path d={roundPoly(f.top)} fill={TOP} />

      <g {...LINE} strokeWidth={0.75} opacity={0.45}>
        {range(16).map((i) => {
          const gx = 0.7 + i * 0.42;
          return (
            <path
              key={i}
              d={poly(onFront(yf, gx, gx + 0.2, z + 0.5, z + 1.8))}
            />
          );
        })}
        <path d={roundPoly(onFront(yf, 7.9, 9.1, z + 0.5, z + 1.8), 2)} />
        <path d={roundPoly(onFront(yf, 9.4, 10.4, z + 0.5, z + 1.8), 2)} />
        <path
          d={roundPoly(
            onFlank(x + w, y + 1.1, y + d - 1.1, z + 0.6, z + 1.7),
            2,
          )}
        />
        <path d={roundPoly(quad(x + 0.5, y + 0.5, z + h, w - 1, d - 1), 3)} />
      </g>

      <path
        d={poly(onFront(yf, 0.7, 7.1, z + 2.0, z + 2.15))}
        fill={ACCENT}
        opacity={0.85 - index * 0.25}
      />

      <g {...LINE} strokeWidth={1.3}>
        <path d={roundPoly(f.flank)} />
        <path d={roundPoly(f.front)} />
        <path d={roundPoly(f.top)} />
      </g>
    </g>
  );
}

function GpuInfrastructure({ className }: { className?: string }) {
  const w = 11,
    d = 8;
  const edges = [
    [0, d],
    [w, d],
    [w, 0],
  ] as const;
  const levels = [0, 6, 12];
  const plinth = boxFaces(-2.2, -2.2, -0.9, w + 4.4, d + 4.4, 0.9);

  return (
    <svg
      viewBox="0 0 420 450"
      className={cn("h-auto w-full", className)}
      fill="none"
      stroke={ISO_INK}
      strokeLinecap="round"
      role="img"
      aria-label="Isometric diagram: three stacked GPU compute units on a plinth"
    >
      <path
        d={roundPoly(quad(-4, -4, 0, w + 8, d + 8), 14)}
        strokeWidth={1}
        strokeDasharray="6 7"
        opacity={0.3}
      />

      <g>
        <path d={roundPoly(plinth.flank)} fill={FLANK} />
        <path d={roundPoly(plinth.front)} fill={FRONT} />
        <path d={roundPoly(plinth.top)} fill={TOP} />
        <g {...LINE} strokeWidth={1.3}>
          <path d={roundPoly(plinth.flank)} />
          <path d={roundPoly(plinth.front)} />
          <path d={roundPoly(plinth.top)} />
        </g>
      </g>

      <g strokeWidth={1} strokeDasharray="4 6" opacity={0.32}>
        {edges.map(([ex, ey], i) => {
          const a = p(ex, ey, 0);
          const b = p(ex, ey, levels[2] + 2.3);
          return <path key={i} d={`M${a[0]} ${a[1]}V${b[1]}`} />;
        })}
      </g>

      {levels.map((z, i) => (
        <DataBox key={z} z={z} index={levels.length - 1 - i} />
      ))}

      <g fill={ACCENT} stroke="none" opacity={0.6}>
        {[4.4, 10.4].map((z) => {
          const a = p(0, d, z);
          return <circle key={z} cx={a[0]} cy={a[1]} r={2.6} />;
        })}
      </g>
    </svg>
  );
}

export type Capability = {
  word: string;
  art: Art;
  copy: string;
};

export const FEATURE_AI_ART = {
  flow,
  pulse,
  columns,
  lorenzOrbit,
  dipole,
  lorenzSlice,
} as const;

export const DEFAULT_CAPABILITIES: Capability[] = [
  {
    word: "Throughput",
    art: flow,
    copy: "Continuous batching, paged attention, and speculative decoding land more tokens per GPU-second. Same weights, same hardware — up to 3.4× the requests served before you add a single node.",
  },
  {
    word: "Latency",
    art: pulse,
    copy: "Weights stay resident and KV cache stays warm, so there is no cold start to pay for. Sub-200ms time-to-first-token at p99, measured under load rather than on an idle cluster.",
  },
  {
    word: "Scale",
    art: columns,
    copy: "Autoscaling that reads queue depth instead of CPU, from one replica to four hundred across regions. Traffic spikes are absorbed in seconds, and idle capacity is released just as fast.",
  },
  {
    word: "Reliability",
    art: lorenzOrbit,
    copy: "99.99% uptime, multi-region failover, and automatic node drain on hardware faults. In-flight requests are rescheduled, not dropped — an unhealthy GPU never becomes your incident.",
  },
  {
    word: "Observability",
    art: dipole,
    copy: "Every request traced end to end: token counts, cache hit rate, queue time, and per-tenant spend. You see exactly which prompt shape is costing you, down to the individual call.",
  },
  {
    word: "Sovereignty",
    art: lorenzSlice,
    copy: "Run in our cloud, your VPC, or fully air-gapped on your own metal — one control plane, one API. Your weights and your data never leave the perimeter you define.",
  },
];

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)'/%3E%3C/svg%3E\")";

const CARD_GRADIENT = [
  "radial-gradient(72% 92% at 6% 6%, rgba(255,255,255,0.28), rgba(255,255,255,0) 62%)",
  "linear-gradient(148deg, #5d6a4f 0%, #414b39 40%, #2b3425 74%, #1f271b 100%)",
].join(",");

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;
const ROLL = { type: "spring", visualDuration: 0.35, bounce: 0 } as const;

const STAGGER = { art: 0, label: 0.06, copy: 0.14 };

const AUTOPLAY_MS = 4000;

function Marker({ active }: { active: boolean }) {
  return (
    <span className="relative mr-4 inline-flex h-1.5 w-1.5 shrink-0 items-center justify-center sm:mr-6">
      {active && (
        <motion.span
          layoutId="feature-ai-01-marker"
          transition={{
            type: "spring",
            stiffness: 520,
            damping: 42,
            mass: 0.6,
          }}
          className="absolute inset-0 rounded-full bg-neutral-900"
        />
      )}
    </span>
  );
}

export type FeatureAi01Props = {
  capabilities?: Capability[];
  autoplayMs?: number;
  className?: string;
};

export default function FeatureAi01({
  capabilities = DEFAULT_CAPABILITIES,
  autoplayMs = AUTOPLAY_MS,
  className,
}: FeatureAi01Props = {}) {
  const items = capabilities.length > 0 ? capabilities : DEFAULT_CAPABILITIES;
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const restTimer = useRef<number | null>(null);
  const clearRest = () => {
    if (restTimer.current !== null) window.clearTimeout(restTimer.current);
    restTimer.current = null;
  };
  const previewOnRest = (i: number) => {
    clearRest();
    restTimer.current = window.setTimeout(() => setHovered(i), 100);
  };
  useEffect(() => clearRest, []);

  const [engaged, setEngaged] = useState(false);
  const engage = () => setEngaged(true);

  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.35 });
  const reducedMotion = useReducedMotion();
  const autoplaying = !engaged && inView && !reducedMotion;

  useEffect(() => {
    if (!autoplaying) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      autoplayMs,
    );
    return () => window.clearInterval(id);
  }, [autoplaying, items.length, autoplayMs]);

  const safeIndex = index < items.length ? index : 0;
  const shown =
    hovered !== null && hovered < items.length ? hovered : safeIndex;
  const current = items[shown];

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        className={cn(
          "relative overflow-x-clip bg-[#f1f1ef] py-16 text-neutral-900 lg:py-24",
          className,
        )}
      >
        <div className="relative mx-auto max-w-7xl border-x border-neutral-900/[0.14]">
          <Separator className="absolute top-0 left-1/2 w-screen -translate-x-1/2 bg-neutral-900/[0.14]" />
          <Separator className="absolute bottom-0 left-1/2 w-screen -translate-x-1/2 bg-neutral-900/[0.14]" />

          <header className="grid items-center gap-8 border-b border-neutral-900/[0.08] px-6 py-10 sm:px-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-10 lg:py-10">
            <div>
              <h2 className="text-[clamp(2rem,4.6vw,3.15rem)] leading-[1.04] font-normal tracking-[-0.035em] text-balance">
                Inference infrastructure that holds up in production.
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-tight text-neutral-800">
                Serve open and custom models on dedicated GPUs without
                assembling the stack yourself — scheduling, autoscaling,
                caching, and observability arrive as one system, behind a single
                API.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className={cn(
                    "inline-flex items-center justify-center",
                    "h-auto px-6 py-3.5",
                    "text-[15px] font-medium text-white",
                    "rounded-[6px]",
                    "border-t border-r border-b border-l border-t-[#7E8675] border-r-[rgba(8,20,0,0.07)] border-b-[rgba(6,13,2,0.69)] border-l-[rgba(8,20,0,0.07)]",
                    "bg-clip-border bg-transparent hover:bg-transparent bg-[linear-gradient(180deg,#7E8675_0%,rgba(61,69,53,0.87)_50%,#2F3927_100%)]",
                    "shadow-[inset_1px_1px_5px_rgba(255,255,255,0.25),inset_-1px_-1px_5px_rgba(255,255,255,0.22)]",
                    "active:not-aria-[haspopup]:translate-y-0 active:not-aria-[haspopup]:scale-100",
                    "outline-none focus-visible:ring-2 focus-visible:ring-[#5f6b52]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f1f1ef] focus-visible:border-[rgba(8,20,0,0.07)] focus-visible:border-t-[#7E8675] focus-visible:border-b-[rgba(6,13,2,0.69)]",
                  )}
                >
                  <motion.a
                    href="#"
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                  >
                    Start building
                  </motion.a>
                </Button>

                <Button
                  asChild
                  className={cn(
                    "inline-flex items-center justify-center",
                    "h-auto px-6 py-3.5",
                    "text-[15px] font-medium text-[#59654F]",
                    "rounded-[6px] border-transparent",
                    "bg-clip-border bg-transparent hover:bg-transparent bg-[linear-gradient(180deg,#FFFFFF_0%,rgba(10,14,5,0.13)_100%)]",
                    "shadow-[inset_0_0_0_1px_rgba(131,127,126,0.09),1px_1px_0px_0px_rgba(4,0,0,0.12),-1px_1px_0px_0px_rgba(4,0,0,0.12)]",
                    "active:not-aria-[haspopup]:translate-y-0 active:not-aria-[haspopup]:scale-100",
                    "outline-none focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[#5f6b52]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f1f1ef]",
                  )}
                >
                  <motion.a
                    href="#"
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                  >
                    Talk to an engineer
                  </motion.a>
                </Button>
              </div>
            </div>
            <GpuInfrastructure className="mx-auto max-w-[420px] lg:-my-8" />
          </header>

          <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-neutral-900/[0.08]">
            <Accordion
              type="multiple"
              defaultValue={["0"]}
              className="px-6 py-8 sm:px-10 lg:hidden"
            >
              {items.map((c, i) => (
                <AccordionItem
                  key={c.word}
                  value={String(i)}
                  className="not-last:border-b not-last:border-neutral-900/[0.08]"
                >
                  <AccordionTrigger
                    className={cn(
                      "items-center gap-4 py-4 font-light text-[#6f6f6b] hover:no-underline",
                      "text-[clamp(1.5rem,5.2vw,2rem)] leading-[1.32] tracking-[-0.02em]",
                      "data-[state=open]:font-normal data-[state=open]:text-[#111111]",
                      "focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-neutral-900/20",
                      "**:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:self-center **:data-[slot=accordion-trigger-icon]:text-neutral-900/40",
                    )}
                  >
                    {c.word}.
                  </AccordionTrigger>
                  <AccordionContent className="max-w-[54ch] pb-5 text-[14px] leading-[1.55] text-neutral-700">
                    {c.copy}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <ul
              className="hidden flex-col gap-1 px-6 py-12 sm:px-10 lg:flex lg:gap-2 lg:py-16"
              onMouseLeave={() => {
                clearRest();
                setHovered(null);
              }}
            >
              {items.map((c, i) => (
                <li key={c.word}>
                  <Button
                    variant="ghost"
                    onMouseEnter={() => {
                      engage();
                      previewOnRest(i);
                    }}
                    onFocus={() => {
                      engage();
                      setHovered(i);
                    }}
                    onClick={() => {
                      engage();
                      clearRest();
                      setIndex(i);
                    }}
                    aria-current={i === safeIndex}
                    className={cn(
                      "group -mx-3 flex h-auto w-full cursor-pointer items-center justify-start rounded-[12px] bg-none px-3 py-1 text-left shadow-none",
                      "transition-colors duration-150 ease-out outline-none hover:bg-neutral-900/[0.035] hover:brightness-100",
                      "focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-neutral-900/20",
                    )}
                  >
                    <Marker active={i === shown} />
                    <motion.span
                      animate={{
                        color: i === shown ? "#111111" : "#6f6f6b",
                        x: i === shown ? 2 : 0,
                      }}
                      transition={{ duration: 0.32, ease: EASE_OUT }}
                      className={cn(
                        "text-[clamp(1.5rem,3.2vw,2.2rem)] leading-[1.32] tracking-[-0.02em]",
                        i === shown ? "font-normal" : "font-light",
                      )}
                    >
                      {c.word}.
                    </motion.span>
                  </Button>
                </li>
              ))}
            </ul>

            <div className="hidden px-6 sm:px-10 lg:block lg:py-16">
              <Card
                className={cn(
                  "relative flex aspect-[16/11] w-full flex-col justify-end gap-0 overflow-hidden rounded-[12px] border-0 bg-transparent p-6 text-inherit ring-0",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(12,18,10,0.3),inset_0_0_0_1px_rgba(12,18,10,0.12)]",
                )}
                style={{ backgroundImage: CARD_GRADIENT }}
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={current.art.id}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 0.88, scale: 1 }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.22, ease: EASE_IN },
                    }}
                    transition={{
                      opacity: {
                        duration: 0.32,
                        ease: EASE_OUT,
                        delay: STAGGER.art,
                      },
                      scale: {
                        duration: 0.56,
                        ease: EASE_OUT,
                        delay: STAGGER.art,
                      },
                    }}
                    className="pointer-events-none absolute -top-[7%] -right-[6%] aspect-square w-[50%] [mask-image:radial-gradient(125%_125%_at_100%_0%,#000_58%,transparent_92%)] mix-blend-screen"
                  >
                    <div className="h-full w-full [filter:invert(1)]">
                      <OpCanvas
                        draw={current.art.draw}
                        period={current.art.period}
                        fps={current.art.fps}
                        label={current.art.name}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
                  style={{
                    backgroundImage: GRAIN,
                    backgroundSize: "320px 320px",
                  }}
                />

                <CardContent className="relative px-0">
                  <div className="flex items-baseline gap-3">
                    <div className="overflow-hidden">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={shown}
                          initial={{ y: "100%", opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{
                            y: "-100%",
                            opacity: 0,
                            transition: { duration: 0.2, ease: EASE_IN },
                          }}
                          transition={{
                            y: { ...ROLL, delay: STAGGER.label },
                            opacity: { duration: 0.22, delay: STAGGER.label },
                          }}
                          className="block text-[28px] leading-none font-normal tracking-tight text-[#eef1e7] tabular-nums"
                        >
                          {String(shown + 1).padStart(2, "0")}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <div className="overflow-hidden">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <Badge
                          key={shown}
                          asChild
                          variant="ghost"
                          className={cn(
                            "h-auto rounded-none border-0 bg-transparent px-0 py-0 font-mono text-[10px] font-normal tracking-[0.18em] text-[#eef1e7]/65 uppercase",
                            "hover:bg-transparent hover:text-[#eef1e7]/65",
                          )}
                        >
                          <motion.span
                            initial={{ y: "110%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{
                              y: "-110%",
                              opacity: 0,
                              transition: { duration: 0.2, ease: EASE_IN },
                            }}
                            transition={{
                              y: { ...ROLL, delay: STAGGER.label },
                              opacity: { duration: 0.2, delay: STAGGER.label },
                            }}
                          >
                            {current.word}
                          </motion.span>
                        </Badge>
                      </AnimatePresence>
                    </div>
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={shown}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: -6,
                        transition: { duration: 0.2, ease: EASE_IN },
                      }}
                      transition={{
                        duration: 0.3,
                        ease: EASE_OUT,
                        delay: STAGGER.copy,
                      }}
                      className="mt-3 max-w-[54ch] text-[13px] leading-[1.55] text-[#eef1e7]/75"
                    >
                      {current.copy}
                    </motion.p>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
