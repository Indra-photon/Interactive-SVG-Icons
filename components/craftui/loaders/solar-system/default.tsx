'use client';

/* Solar System — three coplanar orbits at Kepler periods.
 *
 * One perspective camera, one tilted plane, three orbit groups inside it. The
 * periods are not hand-picked: each is the outer lap scaled by r^1.5, which is
 * Kepler's third law, so the inner planet laps the outer one and the three
 * drift in and out of alignment forever instead of marching in lockstep.
 *
 * Each orbit owns `--sl-dur`, `--sl-r`, `--sl-d`, `--sl-c` and `--sl-delay`;
 * its trail and its planet read those from the same element, so one entry in
 * the ORBITS table below describes a whole planet. Bodies undo the orbit spin
 * and the plane's tilt/yaw to stay facing the camera.
 */

import type { CSSProperties } from 'react';

export interface SolarSystemProps {
  size?: number;
  /** Colour of the star, and of the innermost planet. */
  accent?: string;
  /** Colour of the outermost planet. */
  planetColor?: string;
  /** Colour of the middle planet and the trails. */
  trailColor?: string;
  tilt?: number;
  /** Radius of the outermost orbit as a percentage of `size`. */
  orbitRadius?: number;
  /** Seconds for the outermost lap; the inner two follow from Kepler. */
  duration?: number;
  isAnimating?: boolean;
  withButton?: boolean;
  label?: string;
  className?: string;
}

/* radius ratio → period ratio is r^1.5; phase is a fraction of own lap. */
const ORBITS = [
  { ratio: 0.43, dot: 0.08, phase: 0.17 },
  { ratio: 0.72, dot: 0.1, phase: 0.52 },
  { ratio: 1, dot: 0.09, phase: 0.71 },
];

const CSS = `
.solar-system{display:inline-flex;align-items:center;gap:.5em;vertical-align:middle;font:600 17px/1.15 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--card-foreground,#18181b);}
.solar-system--btn{padding:.45em .9em .45em .55em;border:1px solid var(--border,rgba(0,0,0,.1));border-radius:var(--radius-sm,6px);background:var(--card,#fff);box-shadow:0 0 0 1px rgba(0,0,0,.04),0 1px 2px -1px rgba(0,0,0,.12);}
.solar-system__stage{position:relative;display:block;flex:none;width:var(--sl-size);height:var(--sl-size);font-size:var(--sl-size);line-height:0;perspective:2.4em;transform-style:preserve-3d;}
.solar-system__plane{position:absolute;inset:0;transform:rotateZ(var(--sl-yaw)) rotateX(var(--sl-tilt));transform-style:preserve-3d;}
.solar-system__orbit{position:absolute;inset:0;transform-style:preserve-3d;animation:solar-system-spin var(--sl-dur) infinite;animation-delay:var(--sl-delay);}
.solar-system__carrier{position:absolute;top:50%;left:50%;width:0;height:0;transform:translateX(var(--sl-r));transform-style:preserve-3d;}
.solar-system__trail{position:absolute;top:calc(50% - var(--sl-r));left:calc(50% - var(--sl-r));width:calc(var(--sl-r)*2);height:calc(var(--sl-r)*2);border-radius:50%;opacity:.9;background:conic-gradient(from 90deg,transparent 0deg 290deg,color-mix(in oklab,var(--sl-c) 0%,transparent) 290deg,var(--sl-c) 360deg);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - .02em),#000 calc(100% - .02em + .5px));mask:radial-gradient(farthest-side,transparent calc(100% - .02em),#000 calc(100% - .02em + .5px));}
.solar-system__planet{position:absolute;top:calc(var(--sl-d)/-2);left:calc(var(--sl-d)/-2);width:var(--sl-d);height:var(--sl-d);border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0%,transparent 22%),radial-gradient(circle at 40% 35%,var(--sl-c) 0%,color-mix(in oklab,var(--sl-c) 55%,#000) 70%,color-mix(in oklab,var(--sl-c) 25%,#000) 100%);box-shadow:0 0 .1em color-mix(in oklab,var(--sl-c) 55%,transparent);animation:solar-system-face var(--sl-dur) infinite;animation-delay:var(--sl-delay);}
.solar-system__sun{position:absolute;top:50%;left:50%;width:.16em;height:.16em;margin:-.08em 0 0 -.08em;border-radius:50%;background:radial-gradient(circle at 38% 32%,#fff6e0 0%,transparent 28%),radial-gradient(circle at 42% 38%,var(--sl-sun) 0%,color-mix(in oklab,var(--sl-sun) 55%,#000) 68%,color-mix(in oklab,var(--sl-sun) 28%,#000) 100%);box-shadow:0 0 .08em color-mix(in oklab,var(--sl-sun) 70%,transparent),0 0 .3em .02em color-mix(in oklab,var(--sl-sun) 35%,transparent);transform:rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)));animation:solar-system-pulse 2.4s ease-in-out infinite;}
.solar-system__label{display:inline-flex;white-space:pre;letter-spacing:.005em;}
.solar-system__label>span{display:inline-block;opacity:.58;animation:solar-system-shimmer 1.9s ease-in-out infinite;animation-delay:calc(var(--sl-i)*.07s);}
.solar-system--still *{animation-play-state:paused!important;}
.solar-system--still .solar-system__label>span{animation:none;opacity:.78;transform:none;}

@keyframes solar-system-spin{0%{transform:rotateZ(0deg);animation-timing-function:cubic-bezier(.35,0,.65,1)}50%{transform:rotateZ(180deg);animation-timing-function:cubic-bezier(.35,0,.65,1)}100%{transform:rotateZ(360deg)}}
@keyframes solar-system-face{0%{transform:rotateZ(0deg) rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)));animation-timing-function:cubic-bezier(.35,0,.65,1)}50%{transform:rotateZ(-180deg) rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)));animation-timing-function:cubic-bezier(.35,0,.65,1)}100%{transform:rotateZ(-360deg) rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)))}}
@keyframes solar-system-pulse{0%,100%{scale:1 1 1}50%{scale:.88 .88 .88}}
@keyframes solar-system-shimmer{0%,100%{transform:translateY(0);opacity:.58}45%{transform:translateY(-.12em);opacity:1;color:var(--sl-lit)}}
@media (prefers-reduced-motion:reduce){.solar-system *{animation-play-state:paused!important}.solar-system__label>span{animation:none;opacity:.78;transform:none}}
/* Dimmed text is a known failure in forced-colors mode, where the
 * shimmer cannot express itself as colour at all. */
@media (forced-colors:active){.solar-system__label>span{opacity:1}}
`;

export function SolarSystem({
  size = 48,
  accent = '#f6a53c',
  planetColor = '#b57cf7',
  trailColor = '#4fd0e8',
  tilt = 66,
  orbitRadius = 46,
  duration = 3.4,
  isAnimating = true,
  withButton = true,
  label = 'Thinking',
  className,
}: SolarSystemProps) {
  const vars: CSSProperties = {
    '--sl-size': `${size}px`,
    '--sl-sun': accent,
    '--sl-tilt': `${tilt}deg`,
    '--sl-yaw': '18deg',
    '--sl-lit': `color-mix(in oklab, ${accent} 55%, var(--card-foreground, #18181b))`,
  } as CSSProperties;

  const hues = [accent, trailColor, planetColor];

  return (
    <>
      <style href="solar-system" precedence="medium">{CSS}</style>
      <span
        role="status"
        aria-label={label}
        aria-busy={isAnimating}
        style={vars}
        className={[
          'solar-system',
          withButton && 'solar-system--btn',
          !isAnimating && 'solar-system--still',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="solar-system__stage">
          <span className="solar-system__plane">
            <span className="solar-system__sun" />
            {ORBITS.map((o, i) => {
              const period = duration * Math.pow(o.ratio, 1.5);
              return (
                <span
                  key={i}
                  className="solar-system__orbit"
                  style={
                    {
                      '--sl-dur': `${period.toFixed(3)}s`,
                      '--sl-delay': `${(-period * o.phase).toFixed(3)}s`,
                      '--sl-r': `${((orbitRadius * o.ratio) / 100).toFixed(4)}em`,
                      '--sl-d': `${o.dot}em`,
                      '--sl-c': hues[i],
                    } as CSSProperties
                  }
                >
                  <span className="solar-system__trail" />
                  <span className="solar-system__carrier">
                    <span className="solar-system__planet" />
                  </span>
                </span>
              );
            })}
          </span>
        </span>
        {withButton && (
          <span className="solar-system__label" aria-hidden="true">
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
