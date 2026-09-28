'use client';

/* Solar Ellipse — an eccentric orbit with the star at one focus.
 *
 * The bodies ride a real `offset-path: ellipse(...)`, not a circle squashed by
 * a scale, so the path keeps its shape while the plane is tilted underneath
 * them. The star sits at the focus, offset by c = √(a² − b²) from the centre,
 * and the travel keyframes ease out of perihelion and back into it — that
 * speed change is what reads as gravity rather than a wobble.
 *
 * Each body is one step further back along the same path (a negative delay per
 * index), shrinking and dimming as it goes, so the string behind the leader
 * bends along the ellipse instead of sticking out straight.
 */

import type { CSSProperties } from 'react';

export interface SolarEllipseProps {
  size?: number;
  accent?: string;
  planetColor?: string;
  trailColor?: string;
  tilt?: number;
  /** Number of bodies strung along the path. */
  tailCount?: number;
  duration?: number;
  isAnimating?: boolean;
  withButton?: boolean;
  label?: string;
  className?: string;
}

const CSS = `
.solar-ellipse{display:inline-flex;align-items:center;gap:.5em;vertical-align:middle;font:600 17px/1.15 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--card-foreground,#18181b);}
.solar-ellipse--btn{padding:.45em .9em .45em .55em;border:1px solid var(--border,rgba(0,0,0,.1));border-radius:var(--radius-sm,6px);background:var(--card,#fff);box-shadow:0 0 0 1px rgba(0,0,0,.04),0 1px 2px -1px rgba(0,0,0,.12);}
.solar-ellipse__stage{position:relative;display:block;flex:none;width:var(--sl-size);height:var(--sl-size);font-size:var(--sl-size);line-height:0;perspective:2.4em;transform-style:preserve-3d;}
.solar-ellipse__plane{position:absolute;inset:0;transform:rotateZ(var(--sl-yaw)) rotateX(var(--sl-tilt));transform-style:preserve-3d;}
.solar-ellipse__guide{position:absolute;top:50%;left:50%;width:.92em;height:.76em;translate:-50% -50%;border-radius:50%;opacity:.25;background:conic-gradient(from 0deg,var(--sl-planet),var(--sl-trail),var(--sl-planet));-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - .02em),#000 calc(100% - .02em + .5px));mask:radial-gradient(farthest-side,transparent calc(100% - .02em),#000 calc(100% - .02em + .5px));}
.solar-ellipse__focus{position:absolute;top:50%;left:50%;width:0;height:0;transform:translateX(.26em);transform-style:preserve-3d;}
.solar-ellipse__sun{position:absolute;top:-.1em;left:-.1em;width:.2em;height:.2em;border-radius:50%;background:radial-gradient(circle at 38% 32%,#fff6e0 0%,transparent 28%),radial-gradient(circle at 42% 38%,var(--sl-sun) 0%,color-mix(in oklab,var(--sl-sun) 55%,#000) 68%,color-mix(in oklab,var(--sl-sun) 28%,#000) 100%);box-shadow:0 0 .08em color-mix(in oklab,var(--sl-sun) 70%,transparent),0 0 .3em .02em color-mix(in oklab,var(--sl-sun) 35%,transparent);transform:rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)));animation:solar-ellipse-pulse 2.4s ease-in-out infinite;}
.solar-ellipse__path{position:absolute;top:0;left:0;width:0;height:0;transform-style:preserve-3d;offset-path:ellipse(.46em .38em at 50% 50%);offset-rotate:0deg;animation:solar-ellipse-travel var(--sl-dur) infinite;animation-delay:var(--sl-delay);}
.solar-ellipse__body{position:absolute;top:calc(var(--sl-d)/-2);left:calc(var(--sl-d)/-2);width:var(--sl-d);height:var(--sl-d);border-radius:50%;opacity:var(--sl-o);background:radial-gradient(circle at 35% 30%,#fff 0%,transparent 22%),radial-gradient(circle at 40% 35%,var(--sl-c) 0%,color-mix(in oklab,var(--sl-c) 55%,#000) 70%,color-mix(in oklab,var(--sl-c) 25%,#000) 100%);box-shadow:0 0 .1em color-mix(in oklab,var(--sl-c) 55%,transparent);transform:rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)));}
.solar-ellipse__label{display:inline-flex;white-space:pre;letter-spacing:.005em;}
.solar-ellipse__label>span{display:inline-block;opacity:.58;animation:solar-ellipse-shimmer 1.9s ease-in-out infinite;animation-delay:calc(var(--sl-i)*.07s);}
.solar-ellipse--still *{animation-play-state:paused!important;}
.solar-ellipse--still .solar-ellipse__label>span{animation:none;opacity:.78;transform:none;}

/* Perihelion is the 0% point — 3 o'clock, where the focus star sits. Ease out
 * of it, ease back into it. */
@keyframes solar-ellipse-travel{0%{offset-distance:0%;animation-timing-function:cubic-bezier(.1,.4,.5,1)}50%{offset-distance:50%;animation-timing-function:cubic-bezier(.5,0,.9,.6)}100%{offset-distance:100%}}
@keyframes solar-ellipse-pulse{0%,100%{scale:1 1 1}50%{scale:.88 .88 .88}}
@keyframes solar-ellipse-shimmer{0%,100%{transform:translateY(0);opacity:.58}45%{transform:translateY(-.12em);opacity:1;color:var(--sl-lit)}}
@media (prefers-reduced-motion:reduce){.solar-ellipse *{animation-play-state:paused!important}.solar-ellipse__label>span{animation:none;opacity:.78;transform:none}}
/* Dimmed text is a known failure in forced-colors mode, where the
 * shimmer cannot express itself as colour at all. */
@media (forced-colors:active){.solar-ellipse__label>span{opacity:1}}
`;

export function SolarEllipse({
  size = 48,
  accent = '#f6a53c',
  planetColor = '#b57cf7',
  trailColor = '#4fd0e8',
  tilt = 70,
  tailCount = 4,
  duration = 2.2,
  isAnimating = true,
  withButton = true,
  label = 'Thinking',
  className,
}: SolarEllipseProps) {
  const count = Math.max(1, Math.round(tailCount));

  const vars: CSSProperties = {
    '--sl-size': `${size}px`,
    '--sl-sun': accent,
    '--sl-planet': planetColor,
    '--sl-trail': trailColor,
    '--sl-tilt': `${tilt}deg`,
    '--sl-yaw': '-22deg',
    '--sl-dur': `${duration}s`,
    '--sl-lit': `color-mix(in oklab, ${accent} 55%, var(--card-foreground, #18181b))`,
  } as CSSProperties;

  return (
    <>
      <style href="solar-ellipse" precedence="medium">{CSS}</style>
      <span
        role="status"
        aria-label={label}
        aria-busy={isAnimating}
        style={vars}
        className={[
          'solar-ellipse',
          withButton && 'solar-ellipse--btn',
          !isAnimating && 'solar-ellipse--still',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="solar-ellipse__stage">
          <span className="solar-ellipse__plane">
            <span className="solar-ellipse__guide" />
            <span className="solar-ellipse__focus">
              <span className="solar-ellipse__sun" />
            </span>
            {Array.from({ length: count }, (_, i) => (
              <span
                key={i}
                className="solar-ellipse__path"
                style={
                  {
                    '--sl-delay': `${(-duration * 0.04 * i).toFixed(3)}s`,
                    '--sl-d': `${(0.13 - i * 0.02).toFixed(3)}em`,
                    '--sl-o': Math.max(0.2, 1 - i * 0.2).toFixed(2),
                    '--sl-c': i === 0 ? trailColor : planetColor,
                  } as CSSProperties
                }
              >
                <span className="solar-ellipse__body" />
              </span>
            ))}
          </span>
        </span>
        {withButton && (
          <span className="solar-ellipse__label" aria-hidden="true">
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
