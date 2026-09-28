'use client';

/* Solar Binary — two stars sharing one orbit around their barycentre.
 *
 * Two orbit groups on the same plane at the same radius, half a lap apart.
 * That is all the choreography there is: because the plane is tilted inside
 * `preserve-3d`, the browser depth-sorts the pair, so whichever star is on the
 * near side is drawn over the other and they swap on every half lap.
 *
 * Both bodies are drawn as stars — gradient plus a wide glow — rather than one
 * star and one planet, and the faint ring marks the shared orbit.
 */

import type { CSSProperties } from 'react';

export interface SolarBinaryProps {
  size?: number;
  /** Colour of the first star. */
  accent?: string;
  /** Colour of the second star. */
  planetColor?: string;
  /** Colour of the orbit trails and ring. */
  trailColor?: string;
  tilt?: number;
  orbitRadius?: number;
  duration?: number;
  isAnimating?: boolean;
  withButton?: boolean;
  label?: string;
  className?: string;
}

const CSS = `
.solar-binary{display:inline-flex;align-items:center;gap:.5em;vertical-align:middle;font:600 17px/1.15 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--card-foreground,#18181b);}
.solar-binary--btn{padding:.45em .9em .45em .55em;border:1px solid var(--border,rgba(0,0,0,.1));border-radius:var(--radius-sm,6px);background:var(--card,#fff);box-shadow:0 0 0 1px rgba(0,0,0,.04),0 1px 2px -1px rgba(0,0,0,.12);}
.solar-binary__stage{position:relative;display:block;flex:none;width:var(--sl-size);height:var(--sl-size);font-size:var(--sl-size);line-height:0;perspective:2.4em;transform-style:preserve-3d;}
.solar-binary__plane{position:absolute;inset:0;transform:rotateZ(var(--sl-yaw)) rotateX(var(--sl-tilt));transform-style:preserve-3d;}
.solar-binary__ring{position:absolute;top:calc(50% - var(--sl-r));left:calc(50% - var(--sl-r));width:calc(var(--sl-r)*2);height:calc(var(--sl-r)*2);border-radius:50%;opacity:.28;background:conic-gradient(from 0deg,var(--sl-sun),var(--sl-second),var(--sl-sun));-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - .02em),#000 calc(100% - .02em + .5px));mask:radial-gradient(farthest-side,transparent calc(100% - .02em),#000 calc(100% - .02em + .5px));}
.solar-binary__orbit{position:absolute;inset:0;transform-style:preserve-3d;animation:solar-binary-spin var(--sl-dur) linear infinite;animation-delay:var(--sl-delay);}
.solar-binary__carrier{position:absolute;top:50%;left:50%;width:0;height:0;transform:translateX(var(--sl-r));transform-style:preserve-3d;}
.solar-binary__trail{position:absolute;top:calc(50% - var(--sl-r));left:calc(50% - var(--sl-r));width:calc(var(--sl-r)*2);height:calc(var(--sl-r)*2);border-radius:50%;background:conic-gradient(from 90deg,transparent 0deg 270deg,color-mix(in oklab,var(--sl-c) 0%,transparent) 270deg,var(--sl-c) 360deg);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - .03em),#000 calc(100% - .03em + .5px));mask:radial-gradient(farthest-side,transparent calc(100% - .03em),#000 calc(100% - .03em + .5px));}
.solar-binary__star{position:absolute;top:-.1em;left:-.1em;width:.2em;height:.2em;border-radius:50%;background:radial-gradient(circle at 38% 32%,#fff6e0 0%,transparent 28%),radial-gradient(circle at 42% 38%,var(--sl-c) 0%,color-mix(in oklab,var(--sl-c) 55%,#000) 68%,color-mix(in oklab,var(--sl-c) 28%,#000) 100%);box-shadow:0 0 .08em color-mix(in oklab,var(--sl-c) 70%,transparent),0 0 .3em .02em color-mix(in oklab,var(--sl-c) 35%,transparent);animation:solar-binary-face var(--sl-dur) linear infinite;animation-delay:var(--sl-delay);}
.solar-binary__label{display:inline-flex;white-space:pre;letter-spacing:.005em;}
.solar-binary__label>span{display:inline-block;opacity:.58;animation:solar-binary-shimmer 1.9s ease-in-out infinite;animation-delay:calc(var(--sl-i)*.07s);}
.solar-binary--still *{animation-play-state:paused!important;}
.solar-binary--still .solar-binary__label>span{animation:none;opacity:.78;transform:none;}

@keyframes solar-binary-spin{to{transform:rotateZ(360deg)}}
@keyframes solar-binary-face{from{transform:rotateZ(0deg) rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)))}to{transform:rotateZ(-360deg) rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)))}}
@keyframes solar-binary-shimmer{0%,100%{transform:translateY(0);opacity:.58}45%{transform:translateY(-.12em);opacity:1;color:var(--sl-lit)}}
@media (prefers-reduced-motion:reduce){.solar-binary *{animation-play-state:paused!important}.solar-binary__label>span{animation:none;opacity:.78;transform:none}}
/* Dimmed text is a known failure in forced-colors mode, where the
 * shimmer cannot express itself as colour at all. */
@media (forced-colors:active){.solar-binary__label>span{opacity:1}}
`;

export function SolarBinary({
  size = 48,
  accent = '#f6a53c',
  planetColor = '#b57cf7',
  trailColor = '#4fd0e8',
  tilt = 60,
  orbitRadius = 22,
  duration = 1.9,
  isAnimating = true,
  withButton = true,
  label = 'Thinking',
  className,
}: SolarBinaryProps) {
  const vars: CSSProperties = {
    '--sl-size': `${size}px`,
    '--sl-sun': accent,
    '--sl-second': planetColor,
    '--sl-tilt': `${tilt}deg`,
    '--sl-yaw': '14deg',
    '--sl-r': `${orbitRadius / 100}em`,
    '--sl-dur': `${duration}s`,
    '--sl-lit': `color-mix(in oklab, ${accent} 55%, var(--card-foreground, #18181b))`,
  } as CSSProperties;

  /* Half a lap of delay is what makes them a pair rather than a queue. */
  const stars = [
    { colour: accent, trail: trailColor, delay: 0 },
    { colour: planetColor, trail: planetColor, delay: -duration / 2 },
  ];

  return (
    <>
      <style href="solar-binary" precedence="medium">{CSS}</style>
      <span
        role="status"
        aria-label={label}
        aria-busy={isAnimating}
        style={vars}
        className={[
          'solar-binary',
          withButton && 'solar-binary--btn',
          !isAnimating && 'solar-binary--still',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="solar-binary__stage">
          <span className="solar-binary__plane">
            <span className="solar-binary__ring" />
            {stars.map((s, i) => (
              <span
                key={i}
                className="solar-binary__orbit"
                style={
                  {
                    '--sl-delay': `${s.delay}s`,
                    '--sl-c': s.colour,
                  } as CSSProperties
                }
              >
                <span
                  className="solar-binary__trail"
                  style={{ '--sl-c': s.trail } as CSSProperties}
                />
                <span className="solar-binary__carrier">
                  <span className="solar-binary__star" />
                </span>
              </span>
            ))}
          </span>
        </span>
        {withButton && (
          <span className="solar-binary__label" aria-hidden="true">
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
