'use client';

/* Solar Swarm Belt — an asteroid belt of particles on a flattened ellipse.
 *
 * Canvas rather than CSS: a hundred-odd independently drifting bodies would be
 * a hundred-odd composited layers as DOM nodes, and the belt's whole character
 * comes from every particle having its own speed, radius and ellipse — which is
 * cheap to give each one here and expensive to give each one in CSS.
 *
 * The particle maths runs in a fixed 180×180 design space and the context is
 * scaled to `size` × devicePixelRatio, so every hard-coded number below keeps
 * meaning what it did whatever size the loader is drawn at. The canvas is
 * transparent — the core gradient ends on its own colour at alpha 0 rather than
 * on `transparent`, which is black in disguise and would grey out on a light
 * ground.
 */

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

export interface SolarSwarmBeltProps {
  size?: number;
  /** Colour of the hot core. */
  accent?: string;
  /** Colour of the belt particles. */
  planetColor?: string;
  /** Number of particles in the belt. */
  count?: number;
  /** Speed multiplier for the belt. */
  speed?: number;
  /** Height of the belt as a percentage of its width. */
  flatten?: number;
  isAnimating?: boolean;
  withButton?: boolean;
  label?: string;
  className?: string;
}

const DESIGN = 180;

const CSS = `
.solar-swarm-belt{display:inline-flex;align-items:center;gap:.5em;vertical-align:middle;font:600 17px/1.15 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--card-foreground,#18181b);}
.solar-swarm-belt--btn{padding:.45em .9em .45em .55em;border:1px solid var(--border,rgba(0,0,0,.1));border-radius:var(--radius-sm,6px);background:var(--card,#fff);box-shadow:0 0 0 1px rgba(0,0,0,.04),0 1px 2px -1px rgba(0,0,0,.12);}
.solar-swarm-belt__stage{position:relative;display:block;flex:none;width:var(--sl-size);height:var(--sl-size);line-height:0;}
.solar-swarm-belt__stage canvas{position:absolute;inset:0;width:100%;height:100%;}
.solar-swarm-belt__label{display:inline-flex;white-space:pre;letter-spacing:.005em;}
.solar-swarm-belt__label>span{display:inline-block;opacity:.58;animation:solar-swarm-belt-shimmer 1.9s ease-in-out infinite;animation-delay:calc(var(--sl-i)*.07s);}
.solar-swarm-belt--still *{animation-play-state:paused!important;}
.solar-swarm-belt--still .solar-swarm-belt__label>span{animation:none;opacity:.78;transform:none;}

@keyframes solar-swarm-belt-shimmer{0%,100%{transform:translateY(0);opacity:.58}45%{transform:translateY(-.12em);opacity:1;color:var(--sl-lit)}}
@media (prefers-reduced-motion:reduce){.solar-swarm-belt *{animation-play-state:paused!important}.solar-swarm-belt__label>span{animation:none;opacity:.78;transform:none}}
/* Dimmed text is a known failure in forced-colors mode, where the
 * shimmer cannot express itself as colour at all. */
@media (forced-colors:active){.solar-swarm-belt__label>span{opacity:1}}
`;

/* Canvas gradients need a colour with an alpha channel, so a hex prop has to
 * become rgba() before it can fade out. Non-hex values pass through as-is. */
function rgba(color: string, alpha: number): string {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!match) return color;
  const hex =
    match[1].length === 3
      ? match[1]
          .split('')
          .map(c => c + c)
          .join('')
      : match[1];
  const n = parseInt(hex, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export function SolarSwarmBelt({
  size = 48,
  accent = '#f6a53c',
  planetColor = '#ffc98a',
  count = 70,
  speed = 1,
  flatten = 32,
  isAnimating = true,
  withButton = true,
  label = 'Thinking',
  className,
}: SolarSwarmBeltProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const scale = (size / DESIGN) * dpr;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    const cx = DESIGN / 2;
    const cy = DESIGN / 2;
    const a = 70;
    const b = (70 * flatten) / 100;

    const parts = Array.from({ length: Math.max(1, Math.round(count)) }, () => ({
      t: Math.random() * Math.PI * 2,
      step: 0.018 * speed * (0.55 + Math.random() * 0.9),
      a: a * (0.75 + Math.random() * 0.4),
      b: b * (0.75 + Math.random() * 0.4),
      r: 0.5 + Math.random() * 1.1,
      alpha: 0.25 + Math.random() * 0.75,
    }));

    const still =
      !isAnimating || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const running = !still;

    const draw = () => {
      ctx.clearRect(0, 0, DESIGN, DESIGN);

      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 16);
      core.addColorStop(0, 'rgba(255,255,255,0.9)');
      core.addColorStop(0.4, rgba(accent, 0.85));
      core.addColorStop(1, rgba(accent, 0));
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowColor = rgba(planetColor, 0.6);
      ctx.shadowBlur = 8;
      for (const p of parts) {
        if (running) p.t += p.step;
        ctx.fillStyle = rgba(planetColor, p.alpha);
        ctx.beginPath();
        ctx.arc(cx + Math.cos(p.t) * p.a, cy + Math.sin(p.t) * p.b, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    let raf = 0;
    const loop = () => {
      draw();
      if (running) raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [size, accent, planetColor, count, speed, flatten, isAnimating]);

  const vars: CSSProperties = {
    '--sl-size': `${size}px`,
    '--sl-sun': accent,
    '--sl-lit': `color-mix(in oklab, ${accent} 55%, var(--card-foreground, #18181b))`,
  } as CSSProperties;

  return (
    <>
      <style href="solar-swarm-belt" precedence="medium">{CSS}</style>
      <span
        role="status"
        aria-label={label}
        aria-busy={isAnimating}
        style={vars}
        className={[
          'solar-swarm-belt',
          withButton && 'solar-swarm-belt--btn',
          !isAnimating && 'solar-swarm-belt--still',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="solar-swarm-belt__stage">
          <canvas ref={ref} />
        </span>
        {withButton && (
          <span className="solar-swarm-belt__label" aria-hidden="true">
            {label.split('').map((ch, i) => (
              <span key={i} style={{ '--sl-i': i } as CSSProperties}>
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
          </span>
        )}
      </span>
    </>
  );
}
