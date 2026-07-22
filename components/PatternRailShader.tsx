"use client";

import { useEffect, useRef } from "react";

// Quarter-res buffer, upscaled by the browser. The rails are only 2.5rem wide,
// so this is plenty of detail and keeps the per-pixel loop cheap.
const BUF_W = 24;
const BUF_H = 100;

const FALLBACK_RGB: [number, number, number] = [253, 85, 29];
const FALLBACK_ALPHA = 0.6;
const FALLBACK_WARM = 90;

type Palette = {
  rgb: [number, number, number];
  alpha: number;
  /** How far the wave peaks lift the green channel, i.e. how much they glow. */
  warm: number;
};

function readPalette(el: HTMLElement): Palette {
  const style = getComputedStyle(el);

  const num = (prop: string, fallback: number) => {
    const parsed = parseFloat(style.getPropertyValue(prop).trim());
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const parts = style
    .getPropertyValue("--pattern-shader-rgb")
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  const rgb =
    parts.length === 3 && parts.every((n) => Number.isFinite(n))
      ? (parts as [number, number, number])
      : FALLBACK_RGB;

  return {
    rgb,
    alpha: num("--pattern-shader-alpha", FALLBACK_ALPHA),
    warm: num("--pattern-shader-warm", FALLBACK_WARM),
  };
}

/**
 * Animated flow field for the PatternSection rails. Opt-in via the `shader`
 * prop on PatternSection — it is deliberately not on by default, since running
 * it on every gallery shell would mean several always-animating canvases.
 */
export function PatternRailShader() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = BUF_W;
    canvas.height = BUF_H;

    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    let palette = readPalette(canvas);
    let t = 0;
    let raf = 0;
    let running = false;

    const image = ctx.createImageData(BUF_W, BUF_H);

    const paint = () => {
      const [r, g, b] = palette.rgb;
      const peak = palette.alpha * 255;
      const warm = palette.warm;
      for (let y = 0; y < BUF_H; y++) {
        for (let x = 0; x < BUF_W; x++) {
          const v =
            Math.sin(x * 0.28 + t) * Math.cos(y * 0.09 - t * 0.7) +
            Math.sin((x + y) * 0.13 + t * 1.3);
          const a = Math.max(0, v) * 0.5;
          const i = (y * BUF_W + x) * 4;
          image.data[i] = r;
          image.data[i + 1] = g + a * warm; // warms toward yellow at the peaks
          image.data[i + 2] = b;
          image.data[i + 3] = a * peak;
        }
      }
      ctx.putImageData(image, 0, 0);
    };

    const frame = () => {
      paint();
      t += 0.025;
      if (running) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || motionQuery.matches) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Never burn frames on a hero that has been scrolled past.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    io.observe(canvas);

    // The accent is theme-scoped, so re-read it when the theme class flips.
    const mo = new MutationObserver(() => {
      palette = readPalette(canvas);
      if (!running) paint();
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const onMotionChange = () => {
      if (motionQuery.matches) {
        stop();
        paint();
      } else {
        start();
      }
    };
    motionQuery.addEventListener("change", onMotionChange);

    paint(); // static first paint, and the only paint under reduced motion

    return () => {
      stop();
      io.disconnect();
      mo.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
