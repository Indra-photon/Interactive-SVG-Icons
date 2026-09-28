'use client';

/* Solar Nebula — gradient rings breathing outward from a pulsing core.
 *
 * Each ring carries two animations at once: a scale-and-fade ripple and a slow
 * spin. The spin is what keeps the conic gradient moving while the ring grows,
 * so the cloud looks like it is turning rather than merely inflating. Both are
 * offset per ring by a share of their own duration, which is why the rings stay
 * evenly spaced however many there are.
 *
 * The ripple animates the `scale` property (not `transform`), leaving each
 * ring's transform free for the spin.
 */

import type { CSSProperties } from 'react';

export interface SolarNebulaProps {
  size?: number;
  accent?: string;
  planetColor?: string;
  trailColor?: string;
  tilt?: number;
  /** Outer radius of the rings as a percentage of `size`. */
  orbitRadius?: number;
  /** Number of rings in flight at once. */
  ringCount?: number;
  duration?: number;
  isAnimating?: boolean;
  withButton?: boolean;
  label?: string;
  className?: string;
}

const CSS = `
.solar-nebula{display:inline-flex;align-items:center;gap:.5em;vertical-align:middle;font:600 17px/1.15 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--card-foreground,#18181b);}
.solar-nebula--btn{padding:.45em .9em .45em .55em;border:1px solid var(--border,rgba(0,0,0,.1));border-radius:var(--radius-sm,6px);background:var(--card,#fff);box-shadow:0 0 0 1px rgba(0,0,0,.04),0 1px 2px -1px rgba(0,0,0,.12);}
.solar-nebula__stage{position:relative;display:block;flex:none;width:var(--sl-size);height:var(--sl-size);font-size:var(--sl-size);line-height:0;perspective:2.4em;transform-style:preserve-3d;}
.solar-nebula__plane{position:absolute;inset:0;transform:rotateZ(var(--sl-yaw)) rotateX(var(--sl-tilt));transform-style:preserve-3d;}
.solar-nebula__ring{position:absolute;top:calc(50% - var(--sl-far));left:calc(50% - var(--sl-far));width:calc(var(--sl-far)*2);height:calc(var(--sl-far)*2);border-radius:50%;background:conic-gradient(from 0deg,var(--sl-planet),var(--sl-trail),var(--sl-planet));-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - .035em),#000 calc(100% - .035em + .5px));mask:radial-gradient(farthest-side,transparent calc(100% - .035em),#000 calc(100% - .035em + .5px));animation:solar-nebula-ripple var(--sl-dur) cubic-bezier(.2,.6,.3,1) infinite,solar-nebula-spin calc(var(--sl-dur)*2.5) linear infinite;animation-delay:var(--sl-delay),var(--sl-spin-delay);}
.solar-nebula__sun{position:absolute;top:50%;left:50%;width:.22em;height:.22em;margin:-.11em 0 0 -.11em;border-radius:50%;background:radial-gradient(circle at 38% 32%,#fff6e0 0%,transparent 28%),radial-gradient(circle at 42% 38%,var(--sl-sun) 0%,color-mix(in oklab,var(--sl-sun) 55%,#000) 68%,color-mix(in oklab,var(--sl-sun) 28%,#000) 100%);box-shadow:0 0 .08em color-mix(in oklab,var(--sl-sun) 70%,transparent),0 0 .32em .02em color-mix(in oklab,var(--sl-sun) 35%,transparent);transform:rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)));animation:solar-nebula-pulse 2.4s ease-in-out infinite;}
.solar-nebula__label{display:inline-flex;white-space:pre;letter-spacing:.005em;}
.solar-nebula__label>span{display:inline-block;opacity:.58;animation:solar-nebula-shimmer 1.9s ease-in-out infinite;animation-delay:calc(var(--sl-i)*.07s);}
.solar-nebula--still *{animation-play-state:paused!important;}
.solar-nebula--still .solar-nebula__label>span{animation:none;opacity:.78;transform:none;}

@keyframes solar-nebula-ripple{0%{scale:.15 .15 .15;opacity:.9}100%{scale:1 1 1;opacity:0}}
@keyframes solar-nebula-spin{to{transform:rotateZ(360deg)}}
@keyframes solar-nebula-pulse{0%,100%{scale:1 1 1}50%{scale:.88 .88 .88}}
@keyframes solar-nebula-shimmer{0%,100%{transform:translateY(0);opacity:.58}45%{transform:translateY(-.12em);opacity:1;color:var(--sl-lit)}}
@media (prefers-reduced-motion:reduce){.solar-nebula *{animation-play-state:paused!important}.solar-nebula__label>span{animation:none;opacity:.78;transform:none}}
/* Dimmed text is a known failure in forced-colors mode, where the
 * shimmer cannot express itself as colour at all. */
@media (forced-colors:active){.solar-nebula__label>span{opacity:1}}
`;

export function SolarNebula({
  size = 48,
  accent = '#f6a53c',
  planetColor = '#b57cf7',
  trailColor = '#4fd0e8',
  tilt = 62,
  orbitRadius = 48,
  ringCount = 3,
  duration = 2.4,
  isAnimating = true,
  withButton = true,
  label = 'Thinking',
  className,
}: SolarNebulaProps) {
  const count = Math.max(1, Math.round(ringCount));

  const vars: CSSProperties = {
    '--sl-size': `${size}px`,
    '--sl-sun': accent,
    '--sl-planet': planetColor,
    '--sl-trail': trailColor,
    '--sl-tilt': `${tilt}deg`,
    '--sl-yaw': '-10deg',
    '--sl-far': `${orbitRadius / 100}em`,
    '--sl-dur': `${duration}s`,
    '--sl-lit': `color-mix(in oklab, ${accent} 55%, var(--card-foreground, #18181b))`,
  } as CSSProperties;

  return (
    <>
      <style href="solar-nebula" precedence="medium">{CSS}</style>
      <span
        role="status"
        aria-label={label}
        aria-busy={isAnimating}
        style={vars}
        className={[
          'solar-nebula',
          withButton && 'solar-nebula--btn',
          !isAnimating && 'solar-nebula--still',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="solar-nebula__stage">
          <span className="solar-nebula__plane">
            {Array.from({ length: count }, (_, i) => (
              <span
                key={i}
                className="solar-nebula__ring"
                style={
                  {
                    '--sl-delay': `${(-(duration / count) * i).toFixed(3)}s`,
                    '--sl-spin-delay': `${(-(duration * 2.5 * i) / count).toFixed(3)}s`,
                  } as CSSProperties
                }
              />
            ))}
            <span className="solar-nebula__sun" />
          </span>
        </span>
        {withButton && (
          <span className="solar-nebula__label" aria-hidden="true">
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
