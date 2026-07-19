"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ScrambleButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "children"> {
  /** The label — scrambled on hover, then revealed character-by-character. */
  label?: string;
  /** Characters shown in place of not-yet-revealed characters. */
  charset?: string;
  /** Milliseconds between scramble frames. */
  frameDuration?: number;
  /** Frames each subsequent character waits before locking in — creates the left-to-right reveal. */
  staggerFrames?: number;
}

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!<>-_\\/[]{}=+*^?#";

function randomChar(charset: string) {
  return charset[Math.floor(Math.random() * charset.length)];
}

export const ScrambleButton = React.forwardRef<
  HTMLButtonElement,
  ScrambleButtonProps
>(function ScrambleButton(
  {
    label = "Whimsy",
    charset = DEFAULT_CHARSET,
    frameDuration = 35,
    staggerFrames = 3,
    className,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    ...props
  },
  ref,
) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = React.useState(label);
  const frameRef = React.useRef(0);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const stop = React.useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const scramble = React.useCallback(() => {
    if (reduced) return;
    stop();
    frameRef.current = 0;
    const totalFrames = label.length * staggerFrames + staggerFrames * 2;

    intervalRef.current = setInterval(() => {
      const frame = frameRef.current++;
      let next = "";
      for (let i = 0; i < label.length; i++) {
        const char = label[i];
        if (char === " ") {
          next += " ";
          continue;
        }
        const revealFrame = i * staggerFrames;
        next += frame >= revealFrame ? char : randomChar(charset);
      }
      setDisplay(next);

      if (frame >= totalFrames) stop();
    }, frameDuration);
  }, [label, charset, frameDuration, staggerFrames, reduced, stop]);

  React.useEffect(() => {
    setDisplay(label);
    return stop;
  }, [label, stop]);

  return (
    <Button
      ref={ref}
      className={cn("font-mono rounded-[12px]", className)}
      onMouseEnter={(e) => {
        scramble();
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        stop();
        setDisplay(label);
        onMouseLeave?.(e);
      }}
      onFocus={(e) => {
        scramble();
        onFocus?.(e);
      }}
      onBlur={(e) => {
        stop();
        setDisplay(label);
        onBlur?.(e);
      }}
      {...props}
    >
      {display}
    </Button>
  );
});
