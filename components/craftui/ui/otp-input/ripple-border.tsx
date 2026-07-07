"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useReducedMotion } from "motion/react";

export type RippleColorState =
  | "idle"
  | "primary"
  | "success"
  | "destructive"
  | "pending";

export interface RippleBorderHandle {
  /** Fire a scripted, decaying ripple that travels around the box's own outline. `from`/`to` are 0..1 fractions of the perimeter. */
  pulse: (opts?: { from?: number; to?: number; magnitude?: number }) => void;
  /** Two ripples in quick succession — a sharper "wrong answer" bounce, held in place. */
  pulseDouble: (opts?: {
    from?: number;
    to?: number;
    magnitude?: number;
  }) => void;
  /** Live per-keystroke nudge — accumulates into the current envelope. */
  nudge: (dy: number) => void;
  /** Non-decaying low-amplitude ring, for an async "checking…" state. */
  startIdle: (magnitude?: number) => void;
  /** Lets the idle ring decay back to flat. */
  stopIdle: () => void;
  setColorState: (state: RippleColorState) => void;
}

interface RippleBorderProps {
  className?: string;
  /** Corner radius in px — should match the input's own rounded-* class. */
  radius?: number;
  /** Border stroke width in px. */
  strokeWidth?: number;
  /** Ripple height ceiling in px — pulses and nudges clamp to this. */
  maxAmplitude?: number;
  /** How localized the bulge is, as a fraction of the perimeter (0.05 tight … 0.25 wide). */
  bumpWidth?: number;
  /** Envelope decay per frame (0.02 lingering … 0.2 snappy). */
  decay?: number;
}

const SAMPLES = 96;
const IDLE_AMPLITUDE = 1.5;
const TIME_STEP = 0.4;
const DRIFT_RATE = 0.045;
const STOP_THRESHOLD = 0.03;
const DOUBLE_PULSE_GAP_MS = 90;
const DEFAULT_X = 0.12; // resting bulge position, along the top edge

const COLOR_VAR: Record<Exclude<RippleColorState, "idle">, string> = {
  primary: "var(--primary)",
  success: "var(--success, oklch(0.723 0.219 149.579))",
  destructive: "var(--destructive)",
  pending: "var(--muted-foreground)",
};

type Seg =
  | {
      kind: "line";
      x0: number;
      y0: number;
      x1: number;
      y1: number;
      len: number;
      nx: number;
      ny: number;
    }
  | {
      kind: "arc";
      cx: number;
      cy: number;
      r: number;
      a0: number;
      a1: number;
      len: number;
    };

function buildPerimeter(w: number, h: number, radius: number) {
  const r = Math.max(Math.min(radius, w / 2, h / 2), 0);
  const straightW = Math.max(w - 2 * r, 0);
  const straightH = Math.max(h - 2 * r, 0);
  const cornerArc = (Math.PI / 2) * r;
  const segs: Seg[] = [
    { kind: "line", x0: r, y0: 0, x1: w - r, y1: 0, len: straightW, nx: 0, ny: -1 },
    { kind: "arc", cx: w - r, cy: r, r, a0: -90, a1: 0, len: cornerArc },
    { kind: "line", x0: w, y0: r, x1: w, y1: h - r, len: straightH, nx: 1, ny: 0 },
    { kind: "arc", cx: w - r, cy: h - r, r, a0: 0, a1: 90, len: cornerArc },
    { kind: "line", x0: w - r, y0: h, x1: r, y1: h, len: straightW, nx: 0, ny: 1 },
    { kind: "arc", cx: r, cy: h - r, r, a0: 90, a1: 180, len: cornerArc },
    { kind: "line", x0: 0, y0: h - r, x1: 0, y1: r, len: straightH, nx: -1, ny: 0 },
    { kind: "arc", cx: r, cy: r, r, a0: 180, a1: 270, len: cornerArc },
  ];
  const total = segs.reduce((sum, s) => sum + s.len, 0) || 1;
  return { segs, total };
}

function pointAt(segs: Seg[], total: number, sFrac: number) {
  let d = (((sFrac % 1) + 1) % 1) * total;
  for (const seg of segs) {
    if (d <= seg.len || seg === segs[segs.length - 1]) {
      const t = seg.len === 0 ? 0 : d / seg.len;
      if (seg.kind === "line") {
        return {
          x: seg.x0 + (seg.x1 - seg.x0) * t,
          y: seg.y0 + (seg.y1 - seg.y0) * t,
          nx: seg.nx,
          ny: seg.ny,
        };
      }
      const angle = ((seg.a0 + (seg.a1 - seg.a0) * t) * Math.PI) / 180;
      return {
        x: seg.cx + seg.r * Math.cos(angle),
        y: seg.cy + seg.r * Math.sin(angle),
        nx: Math.cos(angle),
        ny: Math.sin(angle),
      };
    }
    d -= seg.len;
  }
  const first = segs[0] as Extract<Seg, { kind: "line" }>;
  return { x: first.x0, y: first.y0, nx: first.nx, ny: first.ny };
}

export const RippleBorder = forwardRef<RippleBorderHandle, RippleBorderProps>(
  function RippleBorder(
    {
      className = "",
      radius = 14,
      strokeWidth = 1.5,
      maxAmplitude = 5,
      bumpWidth = 0.1,
      decay = 0.06,
    },
    ref,
  ) {
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const geometry = useRef<{ segs: Seg[]; total: number } | null>(null);

    // Tunables live in a ref so the rAF loop always reads the latest prop
    // values without re-creating the loop on every render.
    const cfg = useRef({ maxAmplitude, bumpWidth, decay });
    useEffect(() => {
      cfg.current = { maxAmplitude, bumpWidth, decay };
    }, [maxAmplitude, bumpWidth, decay]);

    const envelope = useRef(0);
    const time = useRef(Math.PI / 2);
    const xPos = useRef(DEFAULT_X);
    const xTarget = useRef(DEFAULT_X);
    const idleMode = useRef(false);
    const colorState = useRef<RippleColorState>("idle");
    const lastValue = useRef(0);
    const rafId = useRef<number | null>(null);
    const doubleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const reducedMotion = useReducedMotion();

    const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

    const draw = (value: number) => {
      const path = pathRef.current;
      const geo = geometry.current;
      if (!path || !geo) return;
      lastValue.current = value;
      const { maxAmplitude: maxAmp, bumpWidth: bw } = cfg.current;

      let d = "";
      for (let i = 0; i <= SAMPLES; i++) {
        const s = i / SAMPLES;
        let dist = Math.abs(s - xPos.current);
        if (dist > 0.5) dist = 1 - dist;
        const falloff = Math.exp(-(dist * dist) / (2 * bw * bw));
        const pt = pointAt(geo.segs, geo.total, s);
        const bulge = value * falloff;
        const x = pt.x + pt.nx * bulge;
        const y = pt.y + pt.ny * bulge;
        d += `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)} `;
      }
      d += "Z";
      path.setAttribute("d", d);

      const magnitude = Math.min(Math.abs(value) / maxAmp, 1);
      const baseOpacity = colorState.current === "idle" ? 0.35 : 0.55;
      path.style.opacity = String(Math.min(baseOpacity + magnitude * 0.45, 1));
      path.style.stroke =
        colorState.current === "idle"
          ? "currentColor"
          : COLOR_VAR[colorState.current];
    };

    const stopLoop = () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      if (doubleTimeout.current !== null) {
        clearTimeout(doubleTimeout.current);
        doubleTimeout.current = null;
      }
    };

    const decayLoop = () => {
      const value = envelope.current * Math.sin(time.current);
      if (!idleMode.current) {
        envelope.current = lerp(envelope.current, 0, cfg.current.decay);
        xPos.current = lerp(xPos.current, xTarget.current, DRIFT_RATE);
      }
      time.current += TIME_STEP;
      draw(value);

      if (idleMode.current || Math.abs(envelope.current) > STOP_THRESHOLD) {
        rafId.current = requestAnimationFrame(decayLoop);
      } else {
        envelope.current = 0;
        time.current = Math.PI / 2;
        xTarget.current = DEFAULT_X;
        draw(0);
        rafId.current = null;
      }
    };

    const firePulse = (magnitude: number, fromX: number, toX: number) => {
      idleMode.current = false;
      envelope.current = magnitude;
      time.current = Math.PI / 2; // sin() starts at 1 — immediate snap outward
      xPos.current = fromX;
      xTarget.current = toX;
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(decayLoop);
      }
    };

    /** Reduced-motion fallback: instant, non-oscillating shape + color change. */
    const instantState = (magnitude: number) => {
      stopLoop();
      idleMode.current = false;
      envelope.current = 0;
      time.current = Math.PI / 2;
      xPos.current = DEFAULT_X;
      xTarget.current = DEFAULT_X;
      const bow =
        Math.min(Math.abs(magnitude), cfg.current.maxAmplitude) * 0.35;
      draw(magnitude === 0 ? 0 : bow);
    };

    useImperativeHandle(ref, () => ({
      pulse: (opts = {}) => {
        const magnitude = opts.magnitude ?? cfg.current.maxAmplitude;
        if (reducedMotion) {
          instantState(magnitude);
          return;
        }
        stopLoop();
        firePulse(magnitude, opts.from ?? 0, opts.to ?? 1);
      },
      pulseDouble: (opts = {}) => {
        const magnitude = opts.magnitude ?? cfg.current.maxAmplitude * 1.2;
        if (reducedMotion) {
          instantState(magnitude);
          return;
        }
        stopLoop();
        const from = opts.from ?? DEFAULT_X;
        const to = opts.to ?? DEFAULT_X;
        firePulse(magnitude, from, to);
        doubleTimeout.current = setTimeout(() => {
          firePulse(magnitude, from, to);
          doubleTimeout.current = null;
        }, DOUBLE_PULSE_GAP_MS);
      },
      nudge: (dy) => {
        if (reducedMotion) {
          instantState(envelope.current + dy);
          return;
        }
        idleMode.current = false;
        envelope.current = Math.min(
          Math.max(envelope.current + dy, -cfg.current.maxAmplitude),
          cfg.current.maxAmplitude,
        );
        time.current = Math.PI / 2;
        if (rafId.current === null) {
          rafId.current = requestAnimationFrame(decayLoop);
        }
      },
      startIdle: (magnitude = IDLE_AMPLITUDE) => {
        if (reducedMotion) {
          instantState(magnitude);
          return;
        }
        stopLoop();
        idleMode.current = true;
        envelope.current = magnitude;
        time.current = Math.PI / 2;
        rafId.current = requestAnimationFrame(decayLoop);
      },
      stopIdle: () => {
        idleMode.current = false;
      },
      setColorState: (state) => {
        colorState.current = state;
        draw(lastValue.current);
      },
    }));

    useEffect(() => {
      const svg = svgRef.current;
      if (!svg) return;
      const ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const { width, height } = entry.contentRect;
        if (width <= 0 || height <= 0) return;
        geometry.current = buildPerimeter(width, height, radius);
        draw(lastValue.current);
      });
      ro.observe(svg);
      return () => {
        ro.disconnect();
        stopLoop();
      };
    }, [radius]);

    return (
      <svg
        ref={svgRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`}
      >
        <path
          ref={pathRef}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          className="text-neutral-300 dark:text-neutral-700 transition-[stroke,opacity] duration-150 ease-out"
        />
      </svg>
    );
  },
);
