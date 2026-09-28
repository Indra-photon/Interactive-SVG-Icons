'use client';

/* Solar Comet — a hot head on a long light trail, shedding sparks.
 *
 * The tail is not one stretched shape: every spark is its own orbit group,
 * started a fraction of a lap earlier than the one ahead of it. Because each
 * spark therefore sits at its own point on the same path, the tail bends along
 * the orbit instead of sticking out straight, and it bunches at perihelion the
 * way the Kepler timing makes the head bunch too.
 *
 * Only the leading orbit carries the conic-gradient trail; the rest are bare
 * bodies, shrinking and dimming with index.
 */

import type { CSSProperties } from 'react';

export interface SolarCometProps {
  size?: number;
  accent?: string;
  planetColor?: string;
  trailColor?: string;
  tilt?: number;
  orbitRadius?: number;
  /** Number of sparks shed behind the head. */
  sparkCount?: number;
  /** Length of the light trail, in degrees of arc. */
  trailLength?: number;
  duration?: number;
  isAnimating?: boolean;
  withButton?: boolean;
  label?: string;
  className?: string;
}

const CSS = `
.solar-comet{display:inline-flex;align-items:center;gap:.5em;vertical-align:middle;font:600 17px/1.15 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--card-foreground,#18181b);}
.solar-comet--btn{padding:.45em .9em .45em .55em;border:1px solid var(--border,rgba(0,0,0,.1));border-radius:var(--radius-sm,6px);background:var(--card,#fff);box-shadow:0 0 0 1px rgba(0,0,0,.04),0 1px 2px -1px rgba(0,0,0,.12);}
.solar-comet__stage{position:relative;display:block;flex:none;width:var(--sl-size);height:var(--sl-size);font-size:var(--sl-size);line-height:0;perspective:2.4em;transform-style:preserve-3d;}
.solar-comet__plane{position:absolute;inset:0;transform:rotateZ(var(--sl-yaw)) rotateX(var(--sl-tilt));transform-style:preserve-3d;}
.solar-comet__orbit{position:absolute;inset:0;transform-style:preserve-3d;animation:solar-comet-spin var(--sl-dur) infinite;animation-delay:var(--sl-delay);}
.solar-comet__carrier{position:absolute;top:50%;left:50%;width:0;height:0;transform:translateX(var(--sl-r));transform-style:preserve-3d;}
.solar-comet__trail{position:absolute;top:calc(50% - var(--sl-r));left:calc(50% - var(--sl-r));width:calc(var(--sl-r)*2);height:calc(var(--sl-r)*2);border-radius:50%;background:conic-gradient(from 90deg,transparent 0deg calc(360deg - var(--sl-len)),color-mix(in oklab,var(--sl-trail) 0%,transparent) calc(360deg - var(--sl-len)),var(--sl-trail) 360deg);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - .05em),#000 calc(100% - .05em + .5px));mask:radial-gradient(farthest-side,transparent calc(100% - .05em),#000 calc(100% - .05em + .5px));}
.solar-comet__spark{position:absolute;top:calc(var(--sl-d)/-2);left:calc(var(--sl-d)/-2);width:var(--sl-d);height:var(--sl-d);border-radius:50%;opacity:var(--sl-o);background:radial-gradient(circle at 35% 30%,#fff 0%,transparent 22%),radial-gradient(circle at 40% 35%,var(--sl-c) 0%,color-mix(in oklab,var(--sl-c) 55%,#000) 70%,color-mix(in oklab,var(--sl-c) 25%,#000) 100%);box-shadow:0 0 .1em color-mix(in oklab,var(--sl-c) 60%,transparent);animation:solar-comet-face var(--sl-dur) infinite;animation-delay:var(--sl-delay);}
.solar-comet__sun{position:absolute;top:50%;left:50%;width:.12em;height:.12em;margin:-.06em 0 0 -.06em;border-radius:50%;opacity:.85;background:radial-gradient(circle at 38% 32%,#fff6e0 0%,transparent 28%),radial-gradient(circle at 42% 38%,var(--sl-sun) 0%,color-mix(in oklab,var(--sl-sun) 55%,#000) 68%,color-mix(in oklab,var(--sl-sun) 28%,#000) 100%);box-shadow:0 0 .08em color-mix(in oklab,var(--sl-sun) 70%,transparent),0 0 .28em .02em color-mix(in oklab,var(--sl-sun) 35%,transparent);transform:rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)));}
.solar-comet__label{display:inline-flex;white-space:pre;letter-spacing:.005em;}
.solar-comet__label>span{display:inline-block;opacity:.58;animation:solar-comet-shimmer 1.9s ease-in-out infinite;animation-delay:calc(var(--sl-i)*.07s);}
.solar-comet--still *{animation-play-state:paused!important;}
.solar-comet--still .solar-comet__label>span{animation:none;opacity:.78;transform:none;}

@keyframes solar-comet-spin{0%{transform:rotateZ(0deg);animation-timing-function:cubic-bezier(.35,0,.65,1)}50%{transform:rotateZ(180deg);animation-timing-function:cubic-bezier(.35,0,.65,1)}100%{transform:rotateZ(360deg)}}
@keyframes solar-comet-face{0%{transform:rotateZ(0deg) rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)));animation-timing-function:cubic-bezier(.35,0,.65,1)}50%{transform:rotateZ(-180deg) rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)));animation-timing-function:cubic-bezier(.35,0,.65,1)}100%{transform:rotateZ(-360deg) rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)))}}
@keyframes solar-comet-shimmer{0%,100%{transform:translateY(0);opacity:.58}45%{transform:translateY(-.12em);opacity:1;color:var(--sl-lit)}}
@media (prefers-reduced-motion:reduce){.solar-comet *{animation-play-state:paused!important}.solar-comet__label>span{animation:none;opacity:.78;transform:none}}
/* Dimmed text is a known failure in forced-colors mode, where the
 * shimmer cannot express itself as colour at all. */
@media (forced-colors:active){.solar-comet__label>span{opacity:1}}
`;

export function SolarComet({
  size = 48,
  accent = '#f6a53c',
  planetColor = '#b57cf7',
  trailColor = '#4fd0e8',
  tilt = 58,
  orbitRadius = 40,
  sparkCount = 5,
  trailLength = 200,
  duration = 1.8,
  isAnimating = true,
  withButton = true,
  label = 'Thinking',
  className,
}: SolarCometProps) {
  const count = Math.max(1, Math.round(sparkCount));

  const vars: CSSProperties = {
    '--sl-size': `${size}px`,
    '--sl-sun': accent,
    '--sl-trail': trailColor,
    '--sl-tilt': `${tilt}deg`,
    '--sl-yaw': '-28deg',
    '--sl-r': `${orbitRadius / 100}em`,
    '--sl-len': `${trailLength}deg`,
    '--sl-dur': `${duration}s`,
    '--sl-lit': `color-mix(in oklab, ${accent} 55%, var(--card-foreground, #18181b))`,
  } as CSSProperties;

  return (
    <>
      <style href="solar-comet" precedence="medium">{CSS}</style>
      <span
        role="status"
        aria-label={label}
        aria-busy={isAnimating}
        style={vars}
        className={[
          'solar-comet',
          withButton && 'solar-comet--btn',
          !isAnimating && 'solar-comet--still',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="solar-comet__stage">
          <span className="solar-comet__plane">
            <span className="solar-comet__sun" />
            {Array.from({ length: count }, (_, i) => (
              <span
                key={i}
                className="solar-comet__orbit"
                style={
                  {
                    '--sl-delay': `${(-duration * 0.042 * i).toFixed(3)}s`,
                    '--sl-d': `${Math.max(0.04, 0.14 - i * 0.024).toFixed(3)}em`,
                    '--sl-o': Math.max(0.2, 1 - i * 0.17).toFixed(2),
                    '--sl-c': `color-mix(in oklab, ${accent}, ${planetColor} ${Math.min(100, i * 25)}%)`,
                  } as CSSProperties
                }
              >
                {i === 0 && <span className="solar-comet__trail" />}
                <span className="solar-comet__carrier">
                  <span className="solar-comet__spark" />
                </span>
              </span>
            ))}
          </span>
        </span>
        {withButton && (
          <span className="solar-comet__label" aria-hidden="true">
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
