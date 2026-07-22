"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export interface HeroRippleLineHandle {
  /** Fire a scripted, decaying wave that travels left → right along the line. */
  pulse: () => void;
}

interface HeroRippleLineProps {
  /** Row-level hover state — lifts the resting brightness of the line. */
  active?: boolean;
  /**
   * Axis the line runs along. Vertical is not a CSS rotation — the drag maths
   * swaps axes too, so the bow still follows the pointer the right way.
   */
  orientation?: "horizontal" | "vertical";
  className?: string;
}

// Abstract coordinate space. The short side maps 1:1 to rendered pixels
// (see the h-6 / w-6 wrapper below), so amplitudes below are effectively px.
const VIEW_LONG = 200; // along the line
const VIEW_SHORT = 24; // across it
const MID = VIEW_SHORT / 2;

const DRAG_MAX_AMPLITUDE = 5; // live mouse-follow clamp
const DRAG_SENSITIVITY = 0.16;
const PULSE_AMPLITUDE = 9; // scripted label-triggered pulse peak
const PULSE_START_X = 0.12; // originates near the label side
const PULSE_TRAVEL_X = 0.85; // travels toward the arrow side

const ENVELOPE_DECAY = 0.055; // how fast the wave settles
const TIME_STEP = 0.4; // oscillation speed while decaying
const DRIFT_RATE = 0.05; // how fast the bow position chases its target
const STOP_THRESHOLD = 0.04;

export const HeroRippleLine = forwardRef<
  HeroRippleLineHandle,
  HeroRippleLineProps
>(function HeroRippleLine(
  { active = false, orientation = "horizontal", className = "" },
  ref,
) {
  const isVertical = orientation === "vertical";
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const envelope = useRef(0); // decaying magnitude
  const time = useRef(Math.PI / 2); // oscillation phase
  const xPos = useRef(0.5); // bow position, 0..1
  const xTarget = useRef(0.5); // where xPos drifts toward
  const rafId = useRef<number | null>(null);
  const isDragging = useRef(false);
  const activeRef = useRef(active);
  const reducedMotion = useRef(false);

  useEffect(() => {
    activeRef.current = active;
    draw(lastValue.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const lastValue = useRef(0);

  const draw = (value: number) => {
    const path = pathRef.current;
    if (!path) return;
    lastValue.current = value;

    const along = VIEW_LONG * xPos.current; // travel down/across the line
    const bow = MID + value; // perpendicular displacement
    path.setAttribute(
      "d",
      isVertical
        ? `M${MID},0 Q${bow},${along} ${MID},${VIEW_LONG}`
        : `M0,${MID} Q${along},${bow} ${VIEW_LONG},${MID}`,
    );

    const magnitude = Math.min(Math.abs(value) / PULSE_AMPLITUDE, 1);
    const baseOpacity = activeRef.current ? 0.7 : 0.25;
    path.style.opacity = String(Math.min(baseOpacity + magnitude * 0.3, 1));
    path.style.stroke = magnitude > 0.12 ? "var(--primary)" : "currentColor";
  };

  const stopLoop = () => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  };

  const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

  const decayLoop = () => {
    const value = envelope.current * Math.sin(time.current);
    envelope.current = lerp(envelope.current, 0, ENVELOPE_DECAY);
    time.current += TIME_STEP;
    xPos.current = lerp(xPos.current, xTarget.current, DRIFT_RATE);
    draw(value);

    if (Math.abs(envelope.current) > STOP_THRESHOLD) {
      rafId.current = requestAnimationFrame(decayLoop);
    } else {
      envelope.current = 0;
      time.current = Math.PI / 2;
      xTarget.current = 0.5;
      draw(0);
      rafId.current = null;
    }
  };

  useImperativeHandle(ref, () => ({
    pulse: () => {
      if (reducedMotion.current || isDragging.current) return;
      stopLoop();
      envelope.current = PULSE_AMPLITUDE;
      time.current = Math.PI / 2; // sin() starts at 1 — immediate snap outward
      xPos.current = PULSE_START_X;
      xTarget.current = PULSE_TRAVEL_X;
      rafId.current = requestAnimationFrame(decayLoop);
    },
  }));

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    draw(0);
    return () => stopLoop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseEnter = () => {
    if (reducedMotion.current) return;
    stopLoop();
    isDragging.current = true;
    time.current = Math.PI / 2;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (reducedMotion.current || !isDragging.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // Position tracks the pointer along the line; amplitude comes from motion
    // across it — so both swap with the orientation.
    const alongRatio = isVertical
      ? (e.clientY - rect.top) / rect.height
      : (e.clientX - rect.left) / rect.width;
    const acrossDelta = isVertical ? e.movementX : e.movementY;

    xPos.current = Math.min(Math.max(alongRatio, 0), 1);
    envelope.current = Math.min(
      Math.max(
        envelope.current + acrossDelta * DRAG_SENSITIVITY,
        -DRAG_MAX_AMPLITUDE,
      ),
      DRAG_MAX_AMPLITUDE,
    );
    draw(envelope.current);
  };

  const handleMouseLeave = () => {
    if (reducedMotion.current) return;
    isDragging.current = false;
    xTarget.current = 0.5;
    rafId.current = requestAnimationFrame(decayLoop);
  };

  return (
    <svg
      ref={svgRef}
      className={`${isVertical ? "h-full w-6 min-h-8" : "h-6 min-w-8 flex-1"} ${className}`}
      preserveAspectRatio="none"
      viewBox={
        isVertical
          ? `0 0 ${VIEW_SHORT} ${VIEW_LONG}`
          : `0 0 ${VIEW_LONG} ${VIEW_SHORT}`
      }
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <path
        ref={pathRef}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className="text-neutral-400 dark:text-neutral-600 transition-[stroke] duration-200 ease-out"
      />
    </svg>
  );
});
