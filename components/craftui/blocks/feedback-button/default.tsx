"use client";

import { useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import {
  IconArrowBackUp,
  IconThumbDownFilled,
  IconThumbUpFilled,
} from "@tabler/icons-react";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — feedback switch
 *
 *  scene 1   two identical thumb pills, no labels.
 *  on vote   THE PRESSED PILL STAYS AND STRETCHES — same node, so its thumb
 *            never blinks, it just slides left as the pill grows around it.
 *            The other pill is the only thing that unmounts, popping out of
 *            flow so the survivor glides into the space rather than waiting.
 *  arriving  "Feedback Received!" drops in from above, blurred; the Undo
 *            capsule slides in from the right edge it is anchored to.
 *  undo      plays in reverse and the second pill returns.
 *
 * Same architecture as ApproveSwitch v2: one persistent node per option,
 * `layout` (not `layoutId`) doing the morph, and only *content* mounting and
 * unmounting inside it.
 * ───────────────────────────────────────────────────────── */

type Vote = "up" | "down";

/* Voting is deliberate and carries a little weight; undo is a correction the
 * user wants over with, so it snaps back flat. */
const DECIDE: Transition = { type: "spring", duration: 0.42, bounce: 0.18 };
const UNDO: Transition = { type: "spring", duration: 0.3, bounce: 0 };

/* Content arrives on a lively spring — the label and the Undo capsule
 * overshoot slightly and settle, so they land as objects rather than as
 * values fading in. */
const LIVELY: Transition = { type: "spring", duration: 0.4, bounce: 0.28 };

/* …but only the PHYSICAL values get that bounce. Opacity and blur ride a
 * flat spring instead: bounce on them would overshoot past opaque and past
 * zero blur, which the browser clamps into a visible hitch. */
const SWAP: Transition = { type: "spring", duration: 0.32, bounce: 0 };

/* Text takes a smaller bounce than the capsule: a word wobbling on its own
 * baseline reads as a glitch long before a moving box does. */
const TEXT: Transition = { type: "spring", duration: 0.4, bounce: 0.2 };

/* Applied together, so one element can bounce on its move and stay clean on
 * its fade. Every entry here is a spring — the flat ones are springs with no
 * bounce, not tweens. */
const ARRIVE: Transition = {
  x: LIVELY,
  y: LIVELY,
  scale: LIVELY,
  opacity: SWAP,
  filter: SWAP,
};

/* Leaving is shorter than arriving. The pill's shrink is the star of the
 * undo, and a label still fading at 300ms is visibly wider than the box it is
 * inside — it reads as text escaping the pill. Gone in half the time. */
const LEAVE: Transition = { type: "spring", duration: 0.16, bounce: 0 };

const ARRIVE_TEXT: Transition = {
  y: TEXT,
  opacity: SWAP,
  filter: SWAP,
};

/* Radius must be an inline pixel value: a layout animation scales the box,
 * and Motion can only undo the corner distortion when it knows the px. */
const RADIUS = 999;

const OPTIONS = [
  { id: "up" as const, Icon: IconThumbUpFilled, label: "Good response" },
  { id: "down" as const, Icon: IconThumbDownFilled, label: "Bad response" },
];

/* ── Confetti ──────────────────────────────────────────────
 * Deliberately duplicated from ApproveSwitch rather than imported: that copy
 * is driven by classes in approve-switch.css, and this block is Tailwind-only.
 * Same field, same maths.
 *
 * Deterministic pseudo-random — Math.random() would produce different values
 * on the server and the client and break hydration. Seeded by index, the
 * field is identical every render, which also makes it art-directable. */
function frac(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

const CONFETTI_COLORS = [
  "#4cc85c",
  "#2fa8ff",
  "#ffc531",
  "#ff6f91",
  "#8b5cf6",
  /* Theme-flipping ink: a var() is legal in the inline `background` these
   * particles are painted with, and a fixed #0b0b0b would vanish in dark. */
  "var(--fb-confetti-ink)",
];

const CONFETTI = Array.from({ length: 18 }, (_, i) => {
  /* Fan the throw across the upper half only — particles leaving downward out
   * of a pill look like debris rather than celebration. */
  const angle = (-166 + (142 * i) / 17 + frac(i) * 12) * (Math.PI / 180);
  const dist = 68 + frac(i + 9) * 78;
  const round = frac(i + 3) > 0.55;
  return {
    dx: Math.cos(angle) * dist,
    dy: Math.sin(angle) * dist,
    drift: (frac(i + 5) - 0.5) * 46,
    fall: 96 + frac(i + 7) * 92,
    spin: (frac(i + 11) - 0.5) * 620,
    w: round ? 7 + frac(i + 2) * 3 : 5 + frac(i + 4) * 4,
    h: round ? 7 + frac(i + 2) * 3 : 9 + frac(i + 6) * 5,
    round,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    dur: 0.78 + frac(i + 13) * 0.34,
    delay: frac(i + 17) * 0.06,
  };
});

function Confetti() {
  return (
    /* A zero-size origin pinned to the pill's centre, so every particle's
       translation is measured from one point and nothing can clip. */
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-0 w-0"
    >
      {CONFETTI.map((p, i) => (
        <motion.span
          key={i}
          className="absolute top-0 left-0 block"
          style={{
            width: p.w,
            height: p.h,
            background: p.color,
            borderRadius: p.round ? "50%" : 2,
          }}
          initial={{ x: 0, y: 0, scale: 0.4, rotate: 0, opacity: 0 }}
          /* Three keyframes per axis — launch, apex, fall — with x and y on
             separate curves so gravity lives only on y: the throw keeps its
             ease-out while the drop eases IN, which is what reads as weight.
             Keyframed arcs are the one thing a spring cannot express, so
             these stay tweens. */
          animate={{
            x: [0, p.dx, p.dx + p.drift],
            y: [0, p.dy, p.dy + p.fall],
            scale: [0.4, 1, 0.92],
            rotate: [0, p.spin],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            delay: p.delay,
            x: {
              duration: p.dur,
              times: [0, 0.42, 1],
              ease: [0.16, 1, 0.3, 1],
            },
            y: {
              duration: p.dur,
              times: [0, 0.42, 1],
              ease: ["easeOut", "easeIn"],
            },
            scale: { duration: p.dur, times: [0, 0.24, 1], ease: "easeOut" },
            rotate: { duration: p.dur, ease: "linear" },
            opacity: {
              duration: p.dur,
              times: [0, 0.06, 0.62, 1],
              ease: "linear",
            },
          }}
        />
      ))}
    </span>
  );
}

export default function FeedbackSwitch({ className }: { className?: string }) {
  const [vote, setVote] = useState<Vote | null>(null);
  /* Confetti is decoration, so under reduced motion it is not softened — it
   * simply never mounts. The pill and the sentence still carry the state. */
  const reduced = useReducedMotion();
  /* Returning to null IS the undo, whichever thumb it came from. */
  const travel = vote === null ? UNDO : DECIDE;

  return (
    <MotionConfig transition={travel} reducedMotion="user">
      <div
        className={`flex h-full w-full items-center justify-center bg-[var(--fb-bg)] px-4 py-10 ${className ?? ""}`}
      >
        <div className="flex w-full items-center justify-center gap-3 text-[var(--fb-fg)]">
          {/* popLayout: the losing pill leaves flow on frame one, so the
              survivor starts gliding immediately instead of after the fade. */}
          <AnimatePresence mode="popLayout" initial={false}>
            {OPTIONS.filter(
              (option) => vote === null || vote === option.id,
            ).map((option) => {
              const expanded = vote === option.id;

              return (
                /* The wrapper is the AnimatePresence child now, and it never
                   runs a layout animation — which is exactly why the burst
                   hangs off it. An absolutely-positioned child of a `layout`
                   element gets scaled and smeared by that element's morph. */
                <motion.span
                  key={option.id}
                  className="relative inline-flex shrink-0"
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                  transition={ARRIVE}
                >
                  <AnimatePresence>
                    {/* Positive only — a burst is applause, and applauding a
                        thumbs-down is the wrong feeling. */}
                    {expanded && option.id === "up" && !reduced && (
                      <Confetti key="confetti" />
                    )}
                  </AnimatePresence>
                  <motion.div
                    layout
                    style={{ borderRadius: RADIUS }}
                    /* Not a <button>: expanded, this box CONTAINS the Undo
                     button, and a button inside a button is invalid. Idle it
                     takes the role instead, keyboard behaviour included. */
                    role={expanded ? "status" : "button"}
                    tabIndex={expanded ? undefined : 0}
                    aria-label={expanded ? undefined : option.label}
                    onClick={expanded ? undefined : () => setVote(option.id)}
                    onKeyDown={(event) => {
                      if (expanded) return;
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setVote(option.id);
                      }
                    }}
                    whileTap={expanded ? undefined : { scale: 0.97 }}
                    transition={{ layout: travel, ...ARRIVE }}
                    className={[
                      "flex h-[92px] shrink-0 items-center overflow-hidden bg-[var(--fb-pill)] select-none",
                      "outline-none focus-visible:ring-2 focus-visible:ring-[var(--fb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fb-bg)]",
                      expanded
                        ? "w-full max-w-[560px] gap-4 pr-3 pl-8"
                        : "w-[min(200px,40vw)] cursor-pointer justify-center hover:bg-[var(--fb-pill-hover)]",
                    ].join(" ")}
                  >
                    {/* layout="position" keeps the thumb its true size while the
                      pill's width morphs — without it the parent's scale
                      correction stretches it for the length of the move. */}
                    <motion.span layout="position" className="flex shrink-0">
                      <option.Icon size={34} stroke={0} />
                    </motion.span>

                    <AnimatePresence mode="popLayout" initial={false}>
                      {expanded && (
                        <motion.span
                          key="label"
                          layout="position"
                          className="text-[26px] font-bold tracking-tight whitespace-nowrap"
                          initial={{
                            opacity: 0,
                            y: "-0.5em",
                            filter: "blur(4px)",
                          }}
                          animate={{
                            opacity: 1,
                            y: "0em",
                            filter: "blur(0px)",
                          }}
                          exit={{
                            opacity: 0,
                            y: "0.5em",
                            filter: "blur(4px)",
                            transition: LEAVE,
                          }}
                          transition={ARRIVE_TEXT}
                        >
                          Feedback Received!
                        </motion.span>
                      )}
                    </AnimatePresence>

                    <AnimatePresence mode="popLayout" initial={false}>
                      {expanded && (
                        /* Anchored to the right edge, so it enters from the edge
                         it lives on rather than from nowhere. */
                        <motion.button
                          key="undo"
                          type="button"
                          layout="position"
                          style={{ borderRadius: RADIUS }}
                          onClick={() => setVote(null)}
                          whileTap={{ scale: 0.97 }}
                          initial={{ opacity: 0, x: 16, filter: "blur(4px)" }}
                          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                          exit={{
                            opacity: 0,
                            x: 16,
                            filter: "blur(4px)",
                            transition: LEAVE,
                          }}
                          transition={ARRIVE}
                          className="ml-auto flex h-[68px] shrink-0 cursor-pointer items-center gap-2 bg-[var(--fb-undo)] px-6 text-[24px] font-bold tracking-tight whitespace-nowrap outline-none hover:bg-[var(--fb-undo-hover)] focus-visible:ring-2 focus-visible:ring-[var(--fb-ring)]"
                        >
                          <IconArrowBackUp size={28} stroke={2.6} />
                          Undo
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.span>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
