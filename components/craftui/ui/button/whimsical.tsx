"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface WhimsicalButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  "variant"
> {
  /** Hue (0-360) driving --main-color, from which every deco particle's color is derived. */
  mainHue?: number;
  /** Base width of each deco particle, in px (scaled per-particle). */
  decoSize?: number;
  /** Base travel duration in seconds — each particle applies its own speed multiplier on top. */
  timing?: number;
}

interface DecoConfig {
  color: string;
  scale: number;
  endOffset: string;
  endTranslate: string;
  speed: number;
}

const DECOS: DecoConfig[] = [
  {
    color: "oklch(from var(--main-color) 80% c h)",
    scale: 1,
    endOffset: "80%",
    endTranslate: "0px 30px",
    speed: 1,
  },
  {
    color: "oklch(from var(--main-color) 80% c calc(h + 50))",
    scale: 0.85,
    endOffset: "60%",
    endTranslate: "0px -30px",
    speed: 1,
  },
  {
    color: "oklch(from var(--main-color) 70% c calc(h + 20))",
    scale: 1.15,
    endOffset: "70%",
    endTranslate: "0px -10px",
    speed: 0.85,
  },
  {
    color: "oklch(from var(--main-color) 80% c calc(h - 20))",
    scale: 0.7,
    endOffset: "75%",
    endTranslate: "-20px 50px",
    speed: 1.2,
  },
  {
    color: "oklch(from var(--main-color) 80% c calc(h - 200))",
    scale: 1,
    endOffset: "70%",
    endTranslate: "0px 0px",
    speed: 1,
  },
];

function DecoParticle({
  deco,
  size,
  hovered,
  timing,
}: {
  deco: DecoConfig;
  size: number;
  hovered: boolean;
  timing: number;
}) {
  const width = size * deco.scale;
  const travelDuration = timing * deco.speed;
  const fadeDuration = travelDuration * 0.85;

  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{
        offsetPath: "border-box",
        offsetRotate: "0deg",
        width,
        aspectRatio: "1 / 3",
        borderRadius: "50%",
        background: deco.color,
        filter: "blur(3px)",
      }}
      initial={false}
      animate={
        hovered
          ? {
              offsetDistance: deco.endOffset,
              translate: deco.endTranslate,
              opacity: [0, 1, 1, 0],
            }
          : { offsetDistance: "0%", translate: "0px 0px", opacity: 0 }
      }
      transition={
        hovered
          ? {
              offsetDistance: { duration: travelDuration, ease: "easeOut" },
              translate: { duration: travelDuration, ease: "easeOut" },
              opacity: {
                duration: fadeDuration,
                times: [0, 0.2, 0.7, 1],
              },
            }
          : { duration: 0 }
      }
    >
      {/* The two wings fan out from center, recreating the CSS ::before/::after sparkle. */}
      <span
        style={{
          position: "absolute",
          width: "inherit",
          aspectRatio: "inherit",
          borderRadius: "inherit",
          background: "inherit",
          translate: "-50%",
          rotate: "55deg",
        }}
      />
      <span
        style={{
          position: "absolute",
          width: "inherit",
          aspectRatio: "inherit",
          borderRadius: "inherit",
          background: "inherit",
          translate: "-50%",
          rotate: "-55deg",
        }}
      />
    </motion.span>
  );
}

export const WhimsicalButton = React.forwardRef<
  HTMLButtonElement,
  WhimsicalButtonProps
>(function WhimsicalButton(
  {
    mainHue = 260,
    decoSize = 7,
    timing = 1.5,
    className,
    children = "Whimsy",
    style,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    ...props
  },
  ref,
) {
  const [hovered, setHovered] = React.useState(false);
  const reduced = useReducedMotion();

  return (
    <Button
      ref={ref}
      variant="ghost"
      className={cn(
        "relative isolate overflow-visible rounded-[12px] bg-background text-black",
        "bg-[var(--main-color)]/70 hover:bg-[var(--main-color)]/80",
        "border-2 transition-colors duration-[400ms]",
        hovered ? "border-[var(--main-color)]" : "border-border",
        className,
      )}
      style={
        {
          "--main-color": `hsl(${mainHue} 80% 70%)`,
          ...style,
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        setHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        onMouseLeave?.(e);
      }}
      onFocus={(e) => {
        setHovered(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setHovered(false);
        onBlur?.(e);
      }}
      {...props}
    >
      {children}

      {/* Deco particles travel along the button's own border on hover. Skipped
          entirely under prefers-reduced-motion — border/glow color still transitions. */}
      {!reduced &&
        DECOS.map((deco, i) => (
          <DecoParticle
            key={i}
            deco={deco}
            size={decoSize}
            hovered={hovered}
            timing={timing}
          />
        ))}
    </Button>
  );
});
