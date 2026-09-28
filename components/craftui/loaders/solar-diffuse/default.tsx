'use client';

/* Solar Diffuse — particles born at the core and thrown out across the plane.
 *
 * Each arm is a zero-size carrier rotated to its own angle; the particle on it
 * animates `translate`, which happens in the carrier's rotated frame, so one
 * set of keyframes throws every particle straight out along its own arm. The
 * arms all run the same throw on a delay of one slot each, so the burst reads
 * as continuous emission rather than a pulse that restarts.
 *
 * The particles animate `translate` and `scale` — the individual properties,
 * not `transform` — because `transform` is already spent billboarding each
 * particle back toward the camera.
 */

import type { CSSProperties } from 'react';

export interface SolarDiffuseProps {
  size?: number;
  accent?: string;
  planetColor?: string;
  trailColor?: string;
  tilt?: number;
  /** How far particles travel, as a percentage of `size`. */
  orbitRadius?: number;
  /** Number of particle arms around the plane. */
  rayCount?: number;
  duration?: number;
  isAnimating?: boolean;
  withButton?: boolean;
  label?: string;
  className?: string;
}

const CSS = `
.solar-diffuse{display:inline-flex;align-items:center;gap:.5em;vertical-align:middle;font:600 17px/1.15 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--card-foreground,#18181b);}
.solar-diffuse--btn{padding:.45em .9em .45em .55em;border:1px solid var(--border,rgba(0,0,0,.1));border-radius:var(--radius-sm,6px);background:var(--card,#fff);box-shadow:0 0 0 1px rgba(0,0,0,.04),0 1px 2px -1px rgba(0,0,0,.12);}
.solar-diffuse__stage{position:relative;display:block;flex:none;width:var(--sl-size);height:var(--sl-size);font-size:var(--sl-size);line-height:0;perspective:2.4em;transform-style:preserve-3d;}
.solar-diffuse__plane{position:absolute;inset:0;transform:rotateZ(var(--sl-yaw)) rotateX(var(--sl-tilt));transform-style:preserve-3d;}
.solar-diffuse__ring{position:absolute;top:calc(50% - var(--sl-far));left:calc(50% - var(--sl-far));width:calc(var(--sl-far)*2);height:calc(var(--sl-far)*2);border-radius:50%;opacity:0;background:conic-gradient(from 0deg,var(--sl-planet),var(--sl-trail),var(--sl-planet));-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - .02em),#000 calc(100% - .02em + .5px));mask:radial-gradient(farthest-side,transparent calc(100% - .02em),#000 calc(100% - .02em + .5px));animation:solar-diffuse-ripple var(--sl-dur) cubic-bezier(.1,.7,.3,1) infinite;}
.solar-diffuse__sun{position:absolute;top:50%;left:50%;width:.22em;height:.22em;margin:-.11em 0 0 -.11em;border-radius:50%;background:radial-gradient(circle at 38% 32%,#fff6e0 0%,transparent 28%),radial-gradient(circle at 42% 38%,var(--sl-sun) 0%,color-mix(in oklab,var(--sl-sun) 55%,#000) 68%,color-mix(in oklab,var(--sl-sun) 28%,#000) 100%);box-shadow:0 0 .08em color-mix(in oklab,var(--sl-sun) 70%,transparent),0 0 .3em .02em color-mix(in oklab,var(--sl-sun) 35%,transparent);transform:rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)));animation:solar-diffuse-pulse 2.4s ease-in-out infinite;}
.solar-diffuse__arm{position:absolute;top:50%;left:50%;width:0;height:0;transform:rotateZ(var(--sl-ang));transform-style:preserve-3d;}
.solar-diffuse__dot{position:absolute;top:-.05em;left:-.05em;width:.1em;height:.1em;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0%,transparent 22%),radial-gradient(circle at 40% 35%,var(--sl-c) 0%,color-mix(in oklab,var(--sl-c) 55%,#000) 70%,color-mix(in oklab,var(--sl-c) 25%,#000) 100%);box-shadow:0 0 .1em color-mix(in oklab,var(--sl-c) 55%,transparent);transform:rotateZ(calc(-1*var(--sl-ang))) rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)));animation:solar-diffuse-throw var(--sl-dur) cubic-bezier(.1,.7,.3,1) infinite;animation-delay:var(--sl-delay);}
.solar-diffuse__label{display:inline-flex;white-space:pre;letter-spacing:.005em;}
.solar-diffuse__label>span{display:inline-block;opacity:.58;animation:solar-diffuse-shimmer 1.9s ease-in-out infinite;animation-delay:calc(var(--sl-i)*.07s);}
.solar-diffuse--still *{animation-play-state:paused!important;}
.solar-diffuse--still .solar-diffuse__label>span{animation:none;opacity:.78;transform:none;}

@keyframes solar-diffuse-throw{0%{translate:.06em 0;scale:.5 .5 .5;opacity:0}10%{opacity:1;scale:1.1 1.1 1.1}60%{opacity:.9}100%{translate:var(--sl-far) 0;scale:.15 .15 .15;opacity:0}}
@keyframes solar-diffuse-ripple{0%{scale:.15 .15 .15;opacity:.9}100%{scale:1 1 1;opacity:0}}
@keyframes solar-diffuse-pulse{0%,100%{scale:1 1 1}50%{scale:.88 .88 .88}}
@keyframes solar-diffuse-shimmer{0%,100%{transform:translateY(0);opacity:.58}45%{transform:translateY(-.12em);opacity:1;color:var(--sl-lit)}}
@media (prefers-reduced-motion:reduce){.solar-diffuse *{animation-play-state:paused!important}.solar-diffuse__label>span{animation:none;opacity:.78;transform:none}}
/* Dimmed text is a known failure in forced-colors mode, where the
 * shimmer cannot express itself as colour at all. */
@media (forced-colors:active){.solar-diffuse__label>span{opacity:1}}
`;

export function SolarDiffuse({
  size = 48,
  accent = '#f6a53c',
  planetColor = '#b57cf7',
  trailColor = '#4fd0e8',
  tilt = 56,
  orbitRadius = 46,
  rayCount = 10,
  duration = 1.7,
  isAnimating = true,
  withButton = true,
  label = 'Thinking',
  className,
}: SolarDiffuseProps) {
  const count = Math.max(2, Math.round(rayCount));

  const vars: CSSProperties = {
    '--sl-size': `${size}px`,
    '--sl-sun': accent,
    '--sl-planet': planetColor,
    '--sl-trail': trailColor,
    '--sl-tilt': `${tilt}deg`,
    '--sl-yaw': '0deg',
    '--sl-far': `${orbitRadius / 100}em`,
    '--sl-dur': `${duration}s`,
    '--sl-lit': `color-mix(in oklab, ${accent} 55%, var(--card-foreground, #18181b))`,
  } as CSSProperties;

  return (
    <>
      <style href="solar-diffuse" precedence="medium">{CSS}</style>
      <span
        role="status"
        aria-label={label}
        aria-busy={isAnimating}
        style={vars}
        className={[
          'solar-diffuse',
          withButton && 'solar-diffuse--btn',
          !isAnimating && 'solar-diffuse--still',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="solar-diffuse__stage">
          <span className="solar-diffuse__plane">
            <span className="solar-diffuse__ring" />
            <span className="solar-diffuse__sun" />
            {Array.from({ length: count }, (_, i) => (
              <span
                key={i}
                className="solar-diffuse__arm"
                style={
                  {
                    '--sl-ang': `${((i * 360) / count).toFixed(2)}deg`,
                    '--sl-delay': `${(-(duration / count) * i).toFixed(3)}s`,
                    '--sl-c': `color-mix(in oklab, ${planetColor}, ${trailColor} ${Math.round((i / count) * 100)}%)`,
                  } as CSSProperties
                }
              >
                <span className="solar-diffuse__dot" />
              </span>
            ))}
          </span>
        </span>
        {withButton && (
          <span className="solar-diffuse__label" aria-hidden="true">
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
