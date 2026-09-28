'use client';

/* Solar Orbit — one planet on a tilted plane, trailing light.
 *
 * The 3D is real, not faked with z-index. The stage is a perspective camera
 * looking at one orbital plane tilted with rotateX/rotateZ inside
 * `preserve-3d`, so the browser depth-sorts the planet against the sun: it
 * passes in front on the near side and behind on the far side with no
 * choreography from us. The trail is drawn flat in the plane, so the camera
 * foreshortens it into an ellipse on its own.
 *
 * Every value the configurator can touch arrives as a CSS custom property on
 * the root, so DialKit retunes the scene without React re-running any motion.
 * Geometry is expressed in `em` against the stage font-size, which is the
 * loader's own size — one number scales the whole thing.
 *
 * Bodies must FACE THE CAMERA, so each undoes every rotation above it
 * (its orbit's spin, then the plane's tilt and yaw) — hence the `-face`
 * keyframes mirroring the `-spin` ones with identical timing. Both laps use a
 * Kepler-ish ease: the near half runs fast, the far half slow.
 */

import type { CSSProperties } from 'react';

export interface SolarOrbitProps {
  /** Overall size of the scene, in pixels. */
  size?: number;
  /** Colour of the star at the centre. */
  accent?: string;
  /** Colour of the orbiting planet. */
  planetColor?: string;
  /** Colour of the trail behind the planet. */
  trailColor?: string;
  /** Camera tilt of the orbital plane, in degrees. */
  tilt?: number;
  /** Orbit radius as a percentage of `size`. */
  orbitRadius?: number;
  /** Length of the trail, in degrees of arc. */
  trailLength?: number;
  /** Seconds for one full lap. */
  duration?: number;
  isAnimating?: boolean;
  /** Wraps the scene in the AI-agent "Thinking" button shell. */
  withButton?: boolean;
  /** Shimmering text shown in the button shell. */
  label?: string;
  className?: string;
}

const CSS = `
.solar-orbit{display:inline-flex;align-items:center;gap:.5em;vertical-align:middle;font:600 17px/1.15 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--card-foreground,#18181b);}
.solar-orbit--btn{padding:.45em .9em .45em .55em;border:1px solid var(--border,rgba(0,0,0,.1));border-radius:var(--radius-sm,6px);background:var(--card,#fff);box-shadow:0 0 0 1px rgba(0,0,0,.04),0 1px 2px -1px rgba(0,0,0,.12);}
.solar-orbit__stage{position:relative;display:block;flex:none;width:var(--sl-size);height:var(--sl-size);font-size:var(--sl-size);line-height:0;perspective:2.4em;transform-style:preserve-3d;}
.solar-orbit__plane{position:absolute;inset:0;transform:rotateZ(var(--sl-yaw)) rotateX(var(--sl-tilt));transform-style:preserve-3d;}
.solar-orbit__orbit{position:absolute;inset:0;transform-style:preserve-3d;animation:solar-orbit-spin var(--sl-dur) infinite;}
.solar-orbit__carrier{position:absolute;top:50%;left:50%;width:0;height:0;transform:translateX(var(--sl-r));transform-style:preserve-3d;}
.solar-orbit__trail{position:absolute;top:calc(50% - var(--sl-r));left:calc(50% - var(--sl-r));width:calc(var(--sl-r)*2);height:calc(var(--sl-r)*2);border-radius:50%;background:conic-gradient(from 90deg,transparent 0deg calc(360deg - var(--sl-len)),color-mix(in oklab,var(--sl-trail) 0%,transparent) calc(360deg - var(--sl-len)),var(--sl-trail) 360deg);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - .03em),#000 calc(100% - .03em + .5px));mask:radial-gradient(farthest-side,transparent calc(100% - .03em),#000 calc(100% - .03em + .5px));}
.solar-orbit__planet{position:absolute;top:-.06em;left:-.06em;width:.12em;height:.12em;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0%,transparent 22%),radial-gradient(circle at 40% 35%,var(--sl-planet) 0%,color-mix(in oklab,var(--sl-planet) 55%,#000) 70%,color-mix(in oklab,var(--sl-planet) 25%,#000) 100%);box-shadow:0 0 .1em color-mix(in oklab,var(--sl-planet) 55%,transparent);animation:solar-orbit-face var(--sl-dur) infinite;}
.solar-orbit__sun{position:absolute;top:50%;left:50%;width:.26em;height:.26em;margin:-.13em 0 0 -.13em;border-radius:50%;background:radial-gradient(circle at 38% 32%,#fff6e0 0%,transparent 28%),radial-gradient(circle at 42% 38%,var(--sl-sun) 0%,color-mix(in oklab,var(--sl-sun) 55%,#000) 68%,color-mix(in oklab,var(--sl-sun) 28%,#000) 100%);box-shadow:0 0 .08em color-mix(in oklab,var(--sl-sun) 70%,transparent),0 0 .3em .02em color-mix(in oklab,var(--sl-sun) 35%,transparent);transform:rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)));animation:solar-orbit-pulse 2.4s ease-in-out infinite;}
.solar-orbit__label{display:inline-flex;white-space:pre;letter-spacing:.005em;}
.solar-orbit__label>span{display:inline-block;opacity:.58;animation:solar-orbit-shimmer 1.9s ease-in-out infinite;animation-delay:calc(var(--sl-i)*.07s);}
.solar-orbit--still *{animation-play-state:paused!important;}
.solar-orbit--still .solar-orbit__label>span{animation:none;opacity:.78;transform:none;}

/* Kepler-ish: the near half of the lap runs fast, the far half slow. The face
 * keyframes must carry identical timing or the planet visibly wobbles. */
@keyframes solar-orbit-spin{0%{transform:rotateZ(0deg);animation-timing-function:cubic-bezier(.35,0,.65,1)}50%{transform:rotateZ(180deg);animation-timing-function:cubic-bezier(.35,0,.65,1)}100%{transform:rotateZ(360deg)}}
@keyframes solar-orbit-face{0%{transform:rotateZ(0deg) rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)));animation-timing-function:cubic-bezier(.35,0,.65,1)}50%{transform:rotateZ(-180deg) rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)));animation-timing-function:cubic-bezier(.35,0,.65,1)}100%{transform:rotateZ(-360deg) rotateX(calc(-1*var(--sl-tilt))) rotateZ(calc(-1*var(--sl-yaw)))}}
/* Scales on bodies are 3-axis on purpose: the scale property applies before
 * transform, i.e. in the parent's frame, and a 2D scale would squash a
 * billboarded sphere into a line. */
@keyframes solar-orbit-pulse{0%,100%{scale:1 1 1}50%{scale:.88 .88 .88}}
@keyframes solar-orbit-shimmer{0%,100%{transform:translateY(0);opacity:.58}45%{transform:translateY(-.12em);opacity:1;color:var(--sl-lit)}}
@media (prefers-reduced-motion:reduce){.solar-orbit *{animation-play-state:paused!important}.solar-orbit__label>span{animation:none;opacity:.78;transform:none}}
/* Dimmed text is a known failure in forced-colors mode, where the
 * shimmer cannot express itself as colour at all. */
@media (forced-colors:active){.solar-orbit__label>span{opacity:1}}
`;

export function SolarOrbit({
  size = 48,
  accent = '#f6a53c',
  planetColor = '#b57cf7',
  trailColor = '#4fd0e8',
  tilt = 64,
  orbitRadius = 42,
  trailLength = 140,
  duration = 1.7,
  isAnimating = true,
  withButton = true,
  label = 'Thinking',
  className,
}: SolarOrbitProps) {
  const vars: CSSProperties = {
    '--sl-size': `${size}px`,
    '--sl-sun': accent,
    '--sl-planet': planetColor,
    '--sl-trail': trailColor,
    '--sl-tilt': `${tilt}deg`,
    '--sl-yaw': '-12deg',
    '--sl-r': `${orbitRadius / 100}em`,
    '--sl-len': `${trailLength}deg`,
    '--sl-dur': `${duration}s`,
    '--sl-lit': `color-mix(in oklab, ${accent} 55%, var(--card-foreground, #18181b))`,
  } as CSSProperties;

  return (
    <>
      <style href="solar-orbit" precedence="medium">{CSS}</style>
      <span
        role="status"
        aria-label={label}
        aria-busy={isAnimating}
        style={vars}
        className={[
          'solar-orbit',
          withButton && 'solar-orbit--btn',
          !isAnimating && 'solar-orbit--still',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="solar-orbit__stage">
          <span className="solar-orbit__plane">
            <span className="solar-orbit__sun" />
            <span className="solar-orbit__orbit">
              <span className="solar-orbit__trail" />
              <span className="solar-orbit__carrier">
                <span className="solar-orbit__planet" />
              </span>
            </span>
          </span>
        </span>
        {withButton && (
          <span className="solar-orbit__label" aria-hidden="true">
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
