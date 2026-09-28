'use client';

/* Solar Atom — shells on different axes, an electron on each.
 *
 * Every shell is its own 3D plane, yawed a share of 180° away from its
 * neighbours and tilted nearly edge-on, so the three rings read as separate
 * axes rather than one thick band. Each electron undoes its own shell's yaw to
 * stay facing the camera, which is why the yaw lives on the plane as a custom
 * property instead of being baked into the transform.
 *
 * Periods rise slightly per shell so the electrons never fall into a repeating
 * pattern with one another, and the nucleus sits outside the planes — it is not
 * in orbit, so it needs no counter-rotation.
 */

import type { CSSProperties } from 'react';

export interface SolarAtomProps {
  size?: number;
  /** Colour of the nucleus. */
  accent?: string;
  planetColor?: string;
  trailColor?: string;
  tilt?: number;
  /** Shell radius as a percentage of `size`. */
  orbitRadius?: number;
  /** Number of electron shells. */
  shellCount?: number;
  duration?: number;
  isAnimating?: boolean;
  withButton?: boolean;
  label?: string;
  className?: string;
}

const CSS = `
.solar-atom{display:inline-flex;align-items:center;gap:.5em;vertical-align:middle;font:600 17px/1.15 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--card-foreground,#18181b);}
.solar-atom--btn{padding:.45em .9em .45em .55em;border:1px solid var(--border,rgba(0,0,0,.1));border-radius:var(--radius-sm,6px);background:var(--card,#fff);box-shadow:0 0 0 1px rgba(0,0,0,.04),0 1px 2px -1px rgba(0,0,0,.12);}
.solar-atom__stage{position:relative;display:block;flex:none;width:var(--sl-size);height:var(--sl-size);font-size:var(--sl-size);line-height:0;perspective:2.4em;transform-style:preserve-3d;}
.solar-atom__plane{position:absolute;inset:0;transform:rotateZ(var(--sl-yaw)) rotateX(var(--sl-tilt));transform-style:preserve-3d;}
.solar-atom__ring{position:absolute;top:calc(50% - var(--sl-r));left:calc(50% - var(--sl-r));width:calc(var(--sl-r)*2);height:calc(var(--sl-r)*2);border-radius:50%;opacity:.2;background:conic-gradient(from 0deg,var(--sl-planet),var(--sl-c),var(--sl-planet));-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - .02em),#000 calc(100% - .02em + .5px));mask:radial-gradient(farthest-side,transparent calc(100% - .02em),#000 calc(100% - .02em + .5px));}
.solar-atom__orbit{position:absolute;inset:0;transform-style:preserve-3d;animation:solar-atom-spin var(--sl-dur) linear infinite;animation-delay:var(--sl-delay);}
.solar-atom__carrier{position:absolute;top:50%;left:50%;width:0;height:0;transform:translateX(var(--sl-r));transform-style:preserve-3d;}
.solar-atom__trail{position:absolute;top:calc(50% - var(--sl-r));left:calc(50% - var(--sl-r));width:calc(var(--sl-r)*2);height:calc(var(--sl-r)*2);border-radius:50%;background:conic-gradient(from 90deg,transparent 0deg 250deg,color-mix(in oklab,var(--sl-c) 0%,transparent) 250deg,var(--sl-c) 360deg);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - .025em),#000 calc(100% - .025em + .5px));mask:radial-gradient(farthest-side,transparent calc(100% - .025em),#000 calc(100% - .025em + .5px));}
.solar-atom__electron{position:absolute;top:-.045em;left:-.045em;width:.09em;height:.09em;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0%,transparent 22%),radial-gradient(circle at 40% 35%,var(--sl-c) 0%,color-mix(in oklab,var(--sl-c) 55%,#000) 70%,color-mix(in oklab,var(--sl-c) 25%,#000) 100%);box-shadow:0 0 .1em color-mix(in oklab,var(--sl-c) 60%,transparent);animation:solar-atom-face var(--sl-dur) linear infinite;animation-delay:var(--sl-delay);}
.solar-atom__nucleus{position:absolute;top:50%;left:50%;width:.16em;height:.16em;margin:-.08em 0 0 -.08em;border-radius:50%;background:radial-gradient(circle at 38% 32%,#fff6e0 0%,transparent 28%),radial-gradient(circle at 42% 38%,var(--sl-sun) 0%,color-mix(in oklab,var(--sl-sun) 55%,#000) 68%,color-mix(in oklab,var(--sl-sun) 28%,#000) 100%);box-shadow:0 0 .08em color-mix(in oklab,var(--sl-sun) 70%,transparent),0 0 .3em .02em color-mix(in oklab,var(--sl-sun) 35%,transparent);animation:solar-atom-pulse 2.4s ease-in-out infinite;}
.solar-atom__label{display:inline-flex;white-space:pre;letter-spacing:.005em;}
.solar-atom__label>span{display:inline-block;opacity:.58;animation:solar-atom-shimmer 1.9s ease-in-out infinite;animation-delay:calc(var(--sl-i)*.07s);}
.solar-atom--still *{animation-play-state:paused!important;}
.solar-atom--still .solar-atom__label>span{animation:none;opacity:.78;transform:none;}

@keyframes solar-atom-spin{to{transform:rotateZ(360deg)}}
@keyframes solar-atom-face{from{transform:rotateZ(0deg) rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)))}to{transform:rotateZ(-360deg) rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)))}}
@keyframes solar-atom-pulse{0%,100%{scale:1 1 1}50%{scale:.88 .88 .88}}
@keyframes solar-atom-shimmer{0%,100%{transform:translateY(0);opacity:.58}45%{transform:translateY(-.12em);opacity:1;color:var(--sl-lit)}}
@media (prefers-reduced-motion:reduce){.solar-atom *{animation-play-state:paused!important}.solar-atom__label>span{animation:none;opacity:.78;transform:none}}
/* Dimmed text is a known failure in forced-colors mode, where the
 * shimmer cannot express itself as colour at all. */
@media (forced-colors:active){.solar-atom__label>span{opacity:1}}
`;

export function SolarAtom({
  size = 48,
  accent = '#f6a53c',
  planetColor = '#b57cf7',
  trailColor = '#4fd0e8',
  tilt = 74,
  orbitRadius = 44,
  shellCount = 3,
  duration = 1.5,
  isAnimating = true,
  withButton = true,
  label = 'Thinking',
  className,
}: SolarAtomProps) {
  const count = Math.max(1, Math.round(shellCount));

  const vars: CSSProperties = {
    '--sl-size': `${size}px`,
    '--sl-sun': accent,
    '--sl-planet': planetColor,
    '--sl-tilt': `${tilt}deg`,
    '--sl-r': `${orbitRadius / 100}em`,
    '--sl-lit': `color-mix(in oklab, ${accent} 55%, var(--card-foreground, #18181b))`,
  } as CSSProperties;

  return (
    <>
      <style href="solar-atom" precedence="medium">{CSS}</style>
      <span
        role="status"
        aria-label={label}
        aria-busy={isAnimating}
        style={vars}
        className={[
          'solar-atom',
          withButton && 'solar-atom--btn',
          !isAnimating && 'solar-atom--still',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="solar-atom__stage">
          {Array.from({ length: count }, (_, i) => {
            const period = duration * (1 + i * 0.16);
            return (
              <span
                key={i}
                className="solar-atom__plane"
                style={
                  {
                    '--sl-yaw': `${((i * 180) / count).toFixed(2)}deg`,
                    '--sl-dur': `${period.toFixed(3)}s`,
                    '--sl-delay': `${(-period * 0.37 * i).toFixed(3)}s`,
                    '--sl-c': i % 2 === 0 ? trailColor : planetColor,
                  } as CSSProperties
                }
              >
                <span className="solar-atom__ring" />
                <span className="solar-atom__orbit">
                  <span className="solar-atom__trail" />
                  <span className="solar-atom__carrier">
                    <span className="solar-atom__electron" />
                  </span>
                </span>
              </span>
            );
          })}
          <span className="solar-atom__nucleus" />
        </span>
        {withButton && (
          <span className="solar-atom__label" aria-hidden="true">
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
