'use client';

/* Solar Nebula Dust — a particle cloud spiralling inward onto a bright core.
 *
 * Canvas, for the same reason as the swarm belt: the effect is eighty particles
 * each with its own spin, infall rate and radius, plus a per-frame trail that
 * only exists because the previous frame is faded rather than cleared.
 *
 * That fade is done with `destination-out` instead of painting a translucent
 * dark rectangle over the frame: the decay is identical, but the canvas stays
 * transparent, so the cloud sits on the page's own background instead of
 * carrying a dark square around with it. Particles that reach the core are
 * reseeded out at the rim, which is what keeps the cloud from emptying.
 */

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

export interface SolarNebulaDustProps {
  size?: number;
  /** Colour of the core and the inner dust. */
  accent?: string;
  /** Colour of the dust out at the rim. */
  planetColor?: string;
  /** Number of dust particles. */
  count?: number;
  /** Speed multiplier for the infall. */
  speed?: number;
  /** How fast the previous frame fades, as a percentage. */
  trail?: number;
  isAnimating?: boolean;
  withButton?: boolean;
  label?: string;
  className?: string;
}

const DESIGN = 180;

const CSS = `
.solar-nebula-dust{display:inline-flex;align-items:center;gap:.5em;vertical-align:middle;font:600 17px/1.15 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--card-foreground,#18181b);}
.solar-nebula-dust--btn{padding:.45em .9em .45em .55em;border:1px solid var(--border,rgba(0,0,0,.1));border-radius:var(--radius-sm,6px);background:var(--card,#fff);box-shadow:0 0 0 1px rgba(0,0,0,.04),0 1px 2px -1px rgba(0,0,0,.12);}
.solar-nebula-dust__stage{position:relative;display:block;flex:none;width:var(--sl-size);height:var(--sl-size);line-height:0;}
.solar-nebula-dust__stage canvas{position:absolute;inset:0;width:100%;height:100%;}
.solar-nebula-dust__label{display:inline-flex;white-space:pre;letter-spacing:.005em;}
.solar-nebula-dust__label>span{display:inline-block;opacity:.58;animation:solar-nebula-dust-shimmer 1.9s ease-in-out infinite;animation-delay:calc(var(--sl-i)*.07s);}
.solar-nebula-dust--still *{animation-play-state:paused!important;}
.solar-nebula-dust--still .solar-nebula-dust__label>span{animation:none;opacity:.78;transform:none;}

@keyframes solar-nebula-dust-shimmer{0%,100%{transform:translateY(0);opacity:.58}45%{transform:translateY(-.12em);opacity:1;color:var(--sl-lit)}}
@media (prefers-reduced-motion:reduce){.solar-nebula-dust *{animation-play-state:paused!important}.solar-nebula-dust__label>span{animation:none;opacity:.78;transform:none}}
/* Dimmed text is a known failure in forced-colors mode, where the
 * shimmer cannot express itself as colour at all. */
@media (forced-colors:active){.solar-nebula-dust__label>span{opacity:1}}
`;

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

export function SolarNebulaDust({
  size = 48,
  accent = '#8ab4ff',
  planetColor = '#c9b6ff',
  count = 80,
  speed = 1,
  trail = 18,
  isAnimating = true,
  withButton = true,
  label = 'Thinking',
  className,
}: SolarNebulaDustProps) {
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

    const parts = Array.from({ length: Math.max(1, Math.round(count)) }, () => ({
      ang: Math.random() * Math.PI * 2,
      rad: 8 + Math.random() * 70,
      spin: (0.004 + Math.random() * 0.01) * speed,
      inward: (0.04 + Math.random() * 0.08) * speed,
      r: 0.6 + Math.random() * 1.8,
      tint: Math.random(),
    }));

    const still =
      !isAnimating || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const running = !still;

    const draw = () => {
      /* Fade the previous frame instead of clearing it — same decay as a
       * translucent fill, but it keeps the canvas transparent. */
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0,0,0,${trail / 100})`;
      ctx.fillRect(0, 0, DESIGN, DESIGN);
      ctx.globalCompositeOperation = 'source-over';

      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14);
      core.addColorStop(0, '#fff');
      core.addColorStop(0.5, accent);
      core.addColorStop(1, rgba(accent, 0));
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();

      for (const p of parts) {
        if (running) {
          p.ang += p.spin;
          p.rad -= p.inward;
          if (p.rad < 6) p.rad = 8 + Math.random() * 70;
        }
        ctx.fillStyle = rgba(p.tint > 0.5 ? planetColor : accent, 0.7);
        ctx.beginPath();
        ctx.arc(
          cx + Math.cos(p.ang) * p.rad * 1.15,
          cy + Math.sin(p.ang) * p.rad * 0.55,
          p.r,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    };

    let raf = 0;
    const loop = () => {
      draw();
      if (running) raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [size, accent, planetColor, count, speed, trail, isAnimating]);

  const vars: CSSProperties = {
    '--sl-size': `${size}px`,
    '--sl-sun': accent,
    '--sl-lit': `color-mix(in oklab, ${accent} 55%, var(--card-foreground, #18181b))`,
  } as CSSProperties;

  return (
    <>
      <style href="solar-nebula-dust" precedence="medium">{CSS}</style>
      <span
        role="status"
        aria-label={label}
        aria-busy={isAnimating}
        style={vars}
        className={[
          'solar-nebula-dust',
          withButton && 'solar-nebula-dust--btn',
          !isAnimating && 'solar-nebula-dust--still',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="solar-nebula-dust__stage">
          <canvas ref={ref} />
        </span>
        {withButton && (
          <span className="solar-nebula-dust__label" aria-hidden="true">
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
