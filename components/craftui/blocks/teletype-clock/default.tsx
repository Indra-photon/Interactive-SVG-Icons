"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Split-flap physics: the top half falls first, hinged on the center seam;
// only once it's fully down does the bottom half swing up to meet it and
// bounce-settle — fast and snappy, like a real mechanical flap.
const FALL_DURATION = 0.14;
const LAND_DURATION = 0.16;
const FALL_EASE = [0.55, 0.055, 0.675, 0.19] as const; // ease-in-cubic (gravity)

interface TeletypeClockProps {
  /** Advance the clock by one minute on an interval so flips happen constantly */
  demo?: boolean;
  /** Milliseconds between demo flips */
  demoIntervalMs?: number;
  /** 12-hour format instead of 24-hour */
  hour12?: boolean;
  className?: string;
}

function formatDigits(date: Date, hour12: boolean): string[] {
  let hours = date.getHours();
  if (hour12) {
    hours = hours % 12 || 12;
  }
  const hh = String(hours).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return [...hh, ...mm];
}

/** Full-height numeral clipped to one half of the card by an overflow-hidden window */
function DigitHalf({
  digit,
  half,
}: {
  digit: string;
  half: "top" | "bottom";
}) {
  return (
    <div
      className={`absolute left-0 flex h-[200%] w-full items-center justify-center font-bold tabular-nums ${
        half === "top"
          ? "top-0 text-neutral-400"
          : "bottom-0 text-neutral-100"
      }`}
    >
      {digit}
    </div>
  );
}

function FlipDigit({ digit }: { digit: string }) {
  const reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(digit);
  const isFlipping = digit !== current && !reduceMotion;
  const flipId = `${current}-${digit}`;

  useEffect(() => {
    if (reduceMotion) setCurrent(digit);
  }, [digit, reduceMotion]);

  return (
    <div
      className="relative h-24 w-16 text-6xl sm:h-28 sm:w-20 sm:text-7xl"
      style={{ perspective: "350px" }}
    >
      {/* Static top half — the digit being revealed as the flap falls */}
      <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-t-lg bg-neutral-800">
        <DigitHalf digit={isFlipping ? digit : current} half="top" />
      </div>

      {/* Static bottom half — keeps showing the old digit until the flap lands */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rounded-b-lg bg-[#1f1f1f]">
        <DigitHalf digit={current} half="bottom" />
      </div>

      <AnimatePresence>
        {isFlipping && (
          <motion.div key={flipId} className="contents">
            {/* Falling top flap — old digit, hinged on the center seam */}
            <motion.div
              className="absolute inset-x-0 top-0 z-20 h-1/2 overflow-hidden rounded-t-lg bg-neutral-800"
              style={{
                transformOrigin: "bottom",
                backfaceVisibility: "hidden",
              }}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -90 }}
              exit={{ rotateX: -90 }}
              transition={{ duration: FALL_DURATION, ease: FALL_EASE }}
            >
              <DigitHalf digit={current} half="top" />
              {/* Darkens as it turns away from the light */}
              <motion.div
                className="absolute inset-0 bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.55 }}
                transition={{ duration: FALL_DURATION, ease: FALL_EASE }}
              />
            </motion.div>

            {/* Landing bottom flap — new digit, waits for the fall to finish, then hits 0°, bounces, settles */}
            <motion.div
              className="absolute inset-x-0 bottom-0 z-20 h-1/2 overflow-hidden rounded-b-lg bg-[#1f1f1f]"
              style={{
                transformOrigin: "top",
                backfaceVisibility: "hidden",
              }}
              initial={{ rotateX: 90 }}
              animate={{ rotateX: [90, 0, -8, 0] }}
              exit={{ rotateX: 0 }}
              transition={{
                delay: FALL_DURATION,
                duration: LAND_DURATION,
                times: [0, 0.6, 0.8, 1],
                ease: ["easeIn", "easeOut", "easeInOut"],
              }}
              onAnimationComplete={() => setCurrent(digit)}
            >
              <DigitHalf digit={digit} half="bottom" />
              {/* Catches light as it swings toward the viewer */}
              <motion.div
                className="absolute inset-0 bg-black"
                initial={{ opacity: 0.45 }}
                animate={{ opacity: 0 }}
                transition={{ delay: FALL_DURATION, duration: LAND_DURATION }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center seam */}
      <div className="absolute inset-x-0 top-1/2 z-30 h-[2px] -translate-y-1/2 bg-black/70" />
    </div>
  );
}

export default function TeletypeClock({
  demo = false,
  demoIntervalMs = 3000,
  hour12 = false,
  className = "",
}: TeletypeClockProps) {
  // Starts at 00:00 (matches the server render), then flips to the real time
  // on mount — doubles as an entrance animation.
  const [digits, setDigits] = useState(["0", "0", "0", "0"]);
  const demoOffsetRef = useRef(0);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      now.setMinutes(now.getMinutes() + demoOffsetRef.current);
      setDigits(formatDigits(now, hour12));
    };
    update();

    const id = setInterval(
      () => {
        if (demo) demoOffsetRef.current += 1;
        update();
      },
      demo ? demoIntervalMs : 1000,
    );
    return () => clearInterval(id);
  }, [demo, demoIntervalMs, hour12]);

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <div className="flex gap-1.5">
        <FlipDigit digit={digits[0]} />
        <FlipDigit digit={digits[1]} />
      </div>
      <div className="flex gap-1.5">
        <FlipDigit digit={digits[2]} />
        <FlipDigit digit={digits[3]} />
      </div>
    </div>
  );
}
