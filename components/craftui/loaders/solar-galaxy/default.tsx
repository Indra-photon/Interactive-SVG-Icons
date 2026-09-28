'use client';

/* Solar Galaxy — spiral arms of particles falling toward a bright bulge.
 *
 * One orbit group rotates the whole disc; inside it the arms are rotated copies
 * of the same particle chain, and each particle sits a little further round and
 * a little further in than the one before it — that offset per index is the
 * spiral. On top of the shared rotation every particle also falls inward on its
 * own delay, so the arms keep feeding the core instead of emptying out.
 *
 * `translate`/`scale` carry the infall while `transform` keeps each particle
 * billboarded against the disc's rotation and the plane's tilt.
 */

import type { CSSProperties } from 'react';

export interface SolarGalaxyProps {
  size?: number;
  /** Colour of the bulge at the centre. */
  accent?: string;
  /** Colour of the particles nearest the core. */
  planetColor?: string;
  /** Colour of the particles out at the rim. */
  trailColor?: string;
  tilt?: number;
  /** Radius of the outermost particle as a percentage of `size`. */
  orbitRadius?: number;
  /** Number of spiral arms. */
  armCount?: number;
  /** Particles per arm. */
  armLength?: number;
  duration?: number;
  isAnimating?: boolean;
  withButton?: boolean;
  label?: string;
  className?: string;
}

const CSS = `
.solar-galaxy{display:inline-flex;align-items:center;gap:.5em;vertical-align:middle;font:600 17px/1.15 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--card-foreground,#18181b);}
.solar-galaxy--btn{padding:.45em .9em .45em .55em;border:1px solid var(--border,rgba(0,0,0,.1));border-radius:var(--radius-sm,6px);background:var(--card,#fff);box-shadow:0 0 0 1px rgba(0,0,0,.04),0 1px 2px -1px rgba(0,0,0,.12);}
.solar-galaxy__stage{position:relative;display:block;flex:none;width:var(--sl-size);height:var(--sl-size);font-size:var(--sl-size);line-height:0;perspective:2.4em;transform-style:preserve-3d;}
.solar-galaxy__plane{position:absolute;inset:0;transform:rotateZ(var(--sl-yaw)) rotateX(var(--sl-tilt));transform-style:preserve-3d;}
.solar-galaxy__disc{position:absolute;inset:0;transform-style:preserve-3d;animation:solar-galaxy-spin var(--sl-dur) linear infinite;}
.solar-galaxy__arm{position:absolute;inset:0;transform:rotateZ(var(--sl-arm));transform-style:preserve-3d;}
.solar-galaxy__carrier{position:absolute;top:50%;left:50%;width:0;height:0;transform:rotateZ(var(--sl-ang)) translateX(var(--sl-r));transform-style:preserve-3d;}
.solar-galaxy__dot{position:absolute;top:calc(var(--sl-d)/-2);left:calc(var(--sl-d)/-2);width:var(--sl-d);height:var(--sl-d);border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0%,transparent 24%),radial-gradient(circle at 40% 35%,var(--sl-c) 0%,color-mix(in oklab,var(--sl-c) 55%,#000) 75%,color-mix(in oklab,var(--sl-c) 25%,#000) 100%);box-shadow:0 0 .08em color-mix(in oklab,var(--sl-c) 55%,transparent);animation:solar-galaxy-face var(--sl-dur) linear infinite,solar-galaxy-infall var(--sl-dur) cubic-bezier(.5,0,.75,.5) infinite;animation-delay:0s,var(--sl-delay);}
.solar-galaxy__bulge{position:absolute;top:50%;left:50%;width:.5em;height:.5em;translate:-50% -50%;border-radius:50%;background:radial-gradient(circle,#fff 0%,var(--sl-sun) 25%,color-mix(in oklab,var(--sl-planet) 50%,transparent) 55%,transparent 72%);animation:solar-galaxy-pulse var(--sl-dur) ease-in-out infinite;}
.solar-galaxy__label{display:inline-flex;white-space:pre;letter-spacing:.005em;}
.solar-galaxy__label>span{display:inline-block;opacity:.58;animation:solar-galaxy-shimmer 1.9s ease-in-out infinite;animation-delay:calc(var(--sl-i)*.07s);}
.solar-galaxy--still *{animation-play-state:paused!important;}
.solar-galaxy--still .solar-galaxy__label>span{animation:none;opacity:.78;transform:none;}

@keyframes solar-galaxy-spin{to{transform:rotateZ(360deg)}}
@keyframes solar-galaxy-face{from{transform:rotateZ(calc(0deg - var(--sl-ang) - var(--sl-arm))) rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)))}to{transform:rotateZ(calc(-360deg - var(--sl-ang) - var(--sl-arm))) rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)))}}
@keyframes solar-galaxy-infall{0%{translate:0 0;scale:1 1 1;opacity:0}20%{opacity:1}100%{translate:calc(-1*var(--sl-fall)) 0;scale:.2 .2 .2;opacity:0}}
@keyframes solar-galaxy-pulse{0%,100%{scale:1 1 1}50%{scale:.9 .9 .9}}
@keyframes solar-galaxy-shimmer{0%,100%{transform:translateY(0);opacity:.58}45%{transform:translateY(-.12em);opacity:1;color:var(--sl-lit)}}
@media (prefers-reduced-motion:reduce){.solar-galaxy *{animation-play-state:paused!important}.solar-galaxy__label>span{animation:none;opacity:.78;transform:none}}
/* Dimmed text is a known failure in forced-colors mode, where the
 * shimmer cannot express itself as colour at all. */
@media (forced-colors:active){.solar-galaxy__label>span{opacity:1}}
`;

export function SolarGalaxy({
  size = 48,
  accent = '#f6a53c',
  planetColor = '#b57cf7',
  trailColor = '#4fd0e8',
  tilt = 62,
  orbitRadius = 46,
  armCount = 4,
  armLength = 3,
  duration = 3.2,
  isAnimating = true,
  withButton = true,
  label = 'Thinking',
  className,
}: SolarGalaxyProps) {
  const arms = Math.max(1, Math.round(armCount));
  const perArm = Math.max(1, Math.round(armLength));
  /* One particle's slot along its arm, in percent of size. */
  const step = orbitRadius / (perArm + 1);

  const vars: CSSProperties = {
    '--sl-size': `${size}px`,
    '--sl-sun': accent,
    '--sl-planet': planetColor,
    '--sl-tilt': `${tilt}deg`,
    '--sl-yaw': '16deg',
    '--sl-dur': `${duration}s`,
    '--sl-fall': `${(orbitRadius * 0.65) / 100}em`,
    '--sl-lit': `color-mix(in oklab, ${accent} 55%, var(--card-foreground, #18181b))`,
  } as CSSProperties;

  return (
    <>
      <style href="solar-galaxy" precedence="medium">{CSS}</style>
      <span
        role="status"
        aria-label={label}
        aria-busy={isAnimating}
        style={vars}
        className={[
          'solar-galaxy',
          withButton && 'solar-galaxy--btn',
          !isAnimating && 'solar-galaxy--still',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="solar-galaxy__stage">
          <span className="solar-galaxy__plane">
            <span className="solar-galaxy__bulge" />
            <span className="solar-galaxy__disc">
              {Array.from({ length: arms }, (_, i) => (
                <span
                  key={i}
                  className="solar-galaxy__arm"
                  style={{ '--sl-arm': `${((i * 360) / arms).toFixed(2)}deg` } as CSSProperties}
                >
                  {Array.from({ length: perArm }, (_, j) => (
                    <span
                      key={j}
                      className="solar-galaxy__carrier"
                      style={
                        {
                          '--sl-ang': `${(j * -28).toFixed(2)}deg`,
                          '--sl-r': `${((orbitRadius - j * step) / 100).toFixed(4)}em`,
                          '--sl-d': `${Math.max(0.03, 0.08 - j * 0.012).toFixed(3)}em`,
                          '--sl-c': `color-mix(in oklab, ${trailColor}, ${planetColor} ${Math.min(100, Math.round((j / perArm) * 100))}%)`,
                          '--sl-delay': `${(-(i * 0.25 + j * 0.34) * duration).toFixed(3)}s`,
                        } as CSSProperties
                      }
                    >
                      <span className="solar-galaxy__dot" />
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </span>
        </span>
        {withButton && (
          <span className="solar-galaxy__label" aria-hidden="true">
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
