"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type PixelDissolveSlide = {
  image: string;
  imageAlt?: string;
  heading: string;
};

export interface PixelDissolveCardProps {
  slides?: PixelDissolveSlide[];
  /** Grid resolution of the dissolve — `size` × `size` tiles. */
  size?: number;
  /** Seconds between each tile group vanishing. */
  revealStep?: number;
  className?: string;
}

const DEFAULT_SIZE = 14;
const DEFAULT_REVEAL_STEP = 0.045;
/** Tail added after the last group starts, so the timer outlives the animation. */
const SETTLE_S = 0.4;

const DEFAULT_SLIDES: PixelDissolveSlide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=900&auto=format&fit=crop",
    imageAlt: "Layered gradient light study",
    heading:
      "A moment where care flows freely between beings. An experience you are familiar with, but perhaps forgotten.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=900&auto=format&fit=crop",
    imageAlt: "Abstract fluid shapes in warm tones",
    heading:
      "A quiet signal beneath the noise. The shape of an idea before it has learned to speak its own name.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=900&auto=format&fit=crop",
    imageAlt: "Soft blue and pink light diffusion",
    heading:
      "Motion is memory in disguise. Every pixel that fades was once certain of its place in the whole. Perfectly imperfect.",
  },
];

type Tile = { x: number; y: number; delay: number };

function shuffle<T>(list: T[]): T[] {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Assigns every cell to one of `size` groups — exactly `size` cells each, in
 * random positions — then gives each group its own delay. Tiles vanish in
 * scattered clusters rather than row by row.
 */
function buildTiles(size: number, revealStep: number): Tile[] {
  const groups: number[] = [];
  for (let g = 0; g < size; g++) for (let i = 0; i < size; i++) groups.push(g);
  const shuffled = shuffle(groups);

  const order = shuffle(Array.from({ length: size }, (_, k) => k));
  const delayOf = new Map<number, number>();
  order.forEach((g, idx) => delayOf.set(g, idx * revealStep));

  const tiles: Tile[] = [];
  let i = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      tiles.push({ x, y, delay: delayOf.get(shuffled[i++])! });
    }
  }
  return tiles;
}

const EASE_OUT_QUART = [0.165, 0.84, 0.44, 1] as const;
const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const;

/** Per-word offset, so the line reads left to right as it resolves. */
const WORD_STAGGER_S = 0.02;
const WORD_DURATION_S = 0.2;
const HEADING_EXIT_S = 0.18;

export default function PixelDissolveCard({
  slides = DEFAULT_SLIDES,
  size = DEFAULT_SIZE,
  revealStep = DEFAULT_REVEAL_STEP,
  className = "",
}: PixelDissolveCardProps) {
  const [index, setIndex] = useState(0);
  // The image currently dissolving away; null while idle.
  const [outgoing, setOutgoing] = useState<{
    image: string;
    tiles: Tile[];
  } | null>(null);
  const timer = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const next = useCallback(() => {
    if (outgoing) return; // ignore input mid-transition
    const from = slides[index];
    setIndex((i) => (i + 1) % slides.length);

    if (reduceMotion) return;

    setOutgoing({ image: from.image, tiles: buildTiles(size, revealStep) });
    timer.current = window.setTimeout(
      () => setOutgoing(null),
      (size * revealStep + SETTLE_S) * 1000,
    );
  }, [index, outgoing, reduceMotion, revealStep, size, slides]);

  const slide = slides[index];

  return (
    // `flex flex-col` overrides the button UA layout, which would otherwise
    // centre the contents vertically and float the image off the top edge.
    <button
      type="button"
      onClick={next}
      aria-label="Show next slide"
      className={`flex h-auto md:h-[550px] w-full max-w-[380px] cursor-pointer flex-col items-stretch overflow-hidden rounded-[18px] sm:rounded-[22px] bg-[#fbfbfa] p-0 text-left shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)] transition-transform duration-150 select-none active:scale-[0.98] ${className}`}
    >
      <div
        className="relative h-56 sm:h-72 md:h-80 shrink-0 overflow-hidden"
        style={{ ["--pixcard-size" as string]: size }}
      >
        {/* Incoming image sits underneath and is revealed as tiles drop away. */}
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={slide.image}
          alt={slide.imageAlt ?? ""}
        />

        {outgoing && (
          <div
            key={index}
            className="pixcard-grid absolute inset-0 z-[1] grid"
            aria-hidden="true"
          >
            {outgoing.tiles.map((t) => (
              <div
                key={`${t.x}-${t.y}`}
                className="pixcard-tile"
                style={{
                  backgroundImage: `url("${outgoing.image}")`,
                  backgroundPosition: `${(t.x / (size - 1)) * 100}% ${
                    (t.y / (size - 1)) * 100
                  }%`,
                  animationDelay: `${t.delay}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative px-4 pt-5 pb-5 sm:px-6 sm:pt-6 md:px-[26px] md:pt-7 md:pb-[22px] text-[19px] sm:text-[22px] md:text-[27px] leading-[1.08] font-medium tracking-[-0.02em] text-[#131313]">
        <AnimatePresence mode="wait">
          <motion.h2
            key={index}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: HEADING_EXIT_S, ease: EASE_OUT_QUAD }}
          >
            {slide.heading.split(" ").map((word, i) => (
              <span key={`${i}-${word}`}>
                <span className="inline-block overflow-hidden pb-[0.14em] align-bottom mb-[-0.14em] text-pretty text-left">
                  <motion.span
                    className="inline-block"
                    initial={reduceMotion ? false : { y: "105%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      duration: WORD_DURATION_S,
                      delay: i * WORD_STAGGER_S,
                      ease: EASE_OUT_QUART,
                    }}
                  >
                    {word}
                  </motion.span>
                </span>{" "}
              </span>
            ))}
          </motion.h2>
        </AnimatePresence>
      </div>
    </button>
  );
}
