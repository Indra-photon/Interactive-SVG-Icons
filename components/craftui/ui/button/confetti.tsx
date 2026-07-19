"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ConfettiButtonProps
  extends React.ComponentProps<typeof Button> {
  /** Number of confetti pieces launched per click. */
  particleCount?: number;
  /** Base hue (0-360) — the palette spans a fixed spread of hues from here. */
  baseHue?: number;
  /** Max travel distance in px before gravity pulls pieces back down. */
  spread?: number;
  /** Total burst duration in seconds. */
  duration?: number;
}

interface Particle {
  id: number;
  hue: number;
  shape: "rect" | "circle";
  angle: number;
  distance: number;
  rotateTarget: number;
  size: number;
  delay: number;
}

interface Burst {
  id: number;
  particles: Particle[];
}

// Hue offsets applied to baseHue, cycled across particles — gives a
// multi-color confetti mix instead of monochrome dots.
const HUE_OFFSETS = [0, 40, 90, 150, 200, 280];

function createBurst(
  id: number,
  count: number,
  baseHue: number,
  spread: number,
): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    // Degrees, screen coords (0=right, 90=down) — 200..340 fans mostly
    // upward, matching how confetti pops off a click before falling.
    const angle = 200 + Math.random() * 140;
    return {
      id: id * 1000 + i,
      hue: (baseHue + HUE_OFFSETS[i % HUE_OFFSETS.length]) % 360,
      shape: i % 2 === 0 ? "rect" : "circle",
      angle,
      distance: spread * (0.5 + Math.random() * 0.5),
      rotateTarget:
        (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360),
      size: 5 + Math.random() * 4,
      delay: Math.random() * 0.05,
    };
  });
}

function ConfettiParticle({
  particle,
  spread,
  duration,
}: {
  particle: Particle;
  spread: number;
  duration: number;
}) {
  const rad = (particle.angle * Math.PI) / 180;
  const targetX = Math.cos(rad) * particle.distance;
  const peakY = Math.sin(rad) * particle.distance;
  const fallY = peakY + spread * 0.9; // gravity: keeps falling past the peak

  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{
        width: particle.size,
        height:
          particle.shape === "rect" ? particle.size * 1.8 : particle.size,
        borderRadius: particle.shape === "circle" ? "50%" : 2,
        background: `hsl(${particle.hue} 75% 60%)`,
        translate: "-50% -50%",
      }}
      initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
      animate={{
        x: [0, targetX],
        y: [0, peakY, fallY],
        rotate: [0, particle.rotateTarget],
        opacity: [1, 1, 0],
        scale: [1, 1, 0.6],
      }}
      transition={{
        x: { duration, delay: particle.delay, ease: "easeOut" },
        y: {
          duration,
          delay: particle.delay,
          ease: ["easeOut", "easeIn"],
          times: [0, 0.4, 1],
        },
        rotate: { duration, delay: particle.delay, ease: "easeOut" },
        opacity: { duration, delay: particle.delay, times: [0, 0.7, 1] },
        scale: { duration, delay: particle.delay, times: [0, 0.7, 1] },
      }}
    />
  );
}

export const ConfettiButton = React.forwardRef<
  HTMLButtonElement,
  ConfettiButtonProps
>(function ConfettiButton(
  {
    particleCount = 14,
    baseHue = 200,
    spread = 60,
    duration = 0.8,
    className,
    children = "Confetti",
    onClick,
    ...props
  },
  ref,
) {
  const reduced = useReducedMotion();
  const [bursts, setBursts] = React.useState<Burst[]>([]);
  const nextId = React.useRef(0);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  React.useEffect(() => {
    const active = timers.current;
    return () => active.forEach(clearTimeout);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!reduced) {
      const id = nextId.current++;
      setBursts((b) => [
        ...b,
        { id, particles: createBurst(id, particleCount, baseHue, spread) },
      ]);
      timers.current.push(
        setTimeout(() => {
          setBursts((b) => b.filter((burst) => burst.id !== id));
        }, (duration + 0.2) * 1000),
      );
    }
    onClick?.(e);
  };

  return (
    <Button
      ref={ref}
      className={cn("relative isolate overflow-visible rounded-[12px]", className)}
      onClick={handleClick}
      {...props}
    >
      {children}
      {bursts.flatMap((burst) =>
        burst.particles.map((particle) => (
          <ConfettiParticle
            key={particle.id}
            particle={particle}
            spread={spread}
            duration={duration}
          />
        )),
      )}
    </Button>
  );
});
