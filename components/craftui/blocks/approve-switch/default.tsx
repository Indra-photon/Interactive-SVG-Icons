"use client";

import { useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";

/* ═════════════════════════════════════════════════════════
 * ANIMATION STORYBOARD — approve / reject switch
 *
 *  screen 1   two equal pills sit side by side: Reject, Approve.
 *  on click   THE PRESSED PILL EXPANDS IN PLACE — its colour floods, it
 *             stretches wide — while the other pill collapses into an undo
 *             circle.
 *  the word   "Reject" does not cross-fade into "Rejected". The base word is
 *             one text node that never unmounts, so it glides inside the
 *             widening pill; only the suffix — "ed", "d" — mounts, dropping
 *             in from above at the end of the word.
 *  undo       plays the whole thing in reverse.
 *
 * ONE NODE PER SLOT
 *   State changes a slot's size, colour and children — never its identity.
 *   So `layout` replaces `layoutId`: same element, Motion measures before and
 *   after and interpolates. The word needs no per-letter identity because it
 *   is never destroyed, and the badge recolours in place instead of
 *   cross-fading, because it is the same <svg> the whole way through.
 *
 * WHY popLayout
 *   During a swap the outgoing element leaves flow immediately, so the
 *   surviving sibling reflows to its final position on frame one and glides
 *   there, instead of waiting for the exit and then jumping.
 * ═════════════════════════════════════════════════════════ */

/* Deciding is a deliberate act, so it carries a little weight and a little
 * bounce; undo is a correction the user wants over with, so it snaps back
 * flat. Same family of spring either way — the block still reads as one
 * object, it just knows which direction it is travelling. */
const DECIDE: Transition = { type: "spring", duration: 0.42, bounce: 0.18 };
const UNDO: Transition = { type: "spring", duration: 0.3, bounce: 0 };

/* Content swaps are quicker and bounce-free: they are changes of substance,
 * not physical moves, and overshoot on text looks like a glitch. */
const SWAP: Transition = { type: "spring", duration: 0.32, bounce: 0 };

/* Leaving is shorter than arriving: while the pill shrinks, a label still
 * fading is wider than the box around it and reads as text escaping. */
const LEAVE: Transition = { type: "spring", duration: 0.16, bounce: 0 };

/* The glyph swap is the fastest thing in the block — a crossfade in a
 * fixed-size box, not a move. Short and bounce-free so the icon lands with
 * the pill instead of trailing it. */
const MARK: Transition = { type: "spring", duration: 0.2, bounce: 0 };

/* Colour is not a physical move, so it gets no bounce — but it is still a
 * spring, like everything else in the block: nothing here is a tween. A
 * bounce-free spring settles on a fill without the flicker an overshooting
 * one would give it. */
const TINT: Transition = { type: "spring", duration: 0.24, bounce: 0 };

/* Radius must be an inline pixel value: a layout animation scales the box,
 * and Motion can only undo the corner distortion when it knows the px. */
const RADIUS = 999;

/* ── Colour ────────────────────────────────────────────────
 * Every colour in the block is a `--as-*` token read through `var()`, so the
 * whole thing follows the theme with no JS in the loop.
 *
 * Motion drives the *shape* — that is where a spring earns its keep. It does
 * not drive the fills, for two reasons. It has to parse a colour to tween it,
 * and it cannot parse the `oklch()` the dark tokens are written in; and even
 * where it can, it resolves a `var()` target once, at the moment the
 * animation starts, then writes the literal into inline style — so a pill
 * that has already settled keeps the old theme's fill when the theme flips.
 *
 * Instead the resting pill is a plain painted background that never changes,
 * the decision tone is an overlay whose OPACITY Motion springs (opacity has
 * no parsing problem and no theme), and the two ink swaps are CSS transitions
 * on `color`, `fill` and `stroke` at the same 240ms.
 * ───────────────────────────────────────────────────────── */

/* Matches TINT's perceptual length, so the ink flips in step with the tone
 * flooding underneath it. */
const TINT_MS = "240ms";

/* The suffix is the whole point of the swap: it arrives from above and
 * leaves downward, so the past tense reads as dropping into place. */
const suffixVariants = {
  initial: { opacity: 0, y: "-0.55em", filter: "blur(4px)" },
  active: { opacity: 1, y: "0em", filter: "blur(0px)" },
  exit: { opacity: 0, y: "0.55em", filter: "blur(4px)", transition: LEAVE },
};

/* ── Reward layer ──────────────────────────────────────────
 * Two one-shot flourishes, mounted only while a slot is expanded and torn
 * down on undo, so they replay on every fresh decision.
 *
 * Approve gets confetti: a fan of particles thrown upward that arc over and
 * fall. Reject deliberately gets NO particles — a burst is a celebration, and
 * celebrating a rejection is the wrong feeling. It gets impact instead: a
 * short shake and a single ring pulsing out of the pill.
 *
 * Both are rare, deliberate, once-per-decision moments, which is the only
 * place this much motion is earned.
 * ───────────────────────────────────────────────────────── */

/* Deterministic pseudo-random: Math.random() would render different values on
 * the server and the client and blow up hydration. Seeded by index, this is
 * the same field every time — and a fixed field is easier to art-direct. */
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
  /* The sixth is the ink, and it is the one that has to flip: the particles
   * leave the pill and land on the page, so a white chip is invisible on a
   * light stage and a black one on a dark stage. A var() is fine here — this
   * is a static `background`, not something Motion is tweening. */
  "var(--as-confetti-ink)",
];

const CONFETTI = Array.from({ length: 18 }, (_, i) => {
  /* Fan the throw across the upper half only — particles leaving downward
   * out of a pill look like debris, not celebration. */
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
       translation is measured from one point and nothing is clipped. */
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-1/2 z-[1] h-0 w-0"
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
          /* Three keyframes per axis: launch, apex, fall. Splitting x and y
           * lets gravity live only on y — the horizontal throw keeps its
           * ease-out while the vertical leg eases IN on the way down, which
           * is what makes it read as weight rather than a fade. */
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

/* The rejection's answer to confetti: one ring leaving the pill and gone.
 * `boxShadow` rather than a border so it costs no layout and can be scaled.
 * The tone is passed as a token name, not a literal — nothing animates the
 * colour here, so it can stay live against the theme. */
function ImpactRing({ toneVar }: { toneVar: string }) {
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ borderRadius: RADIUS, boxShadow: `0 0 0 2px var(${toneVar})` }}
      initial={{ opacity: 0.5, scale: 1 }}
      animate={{ opacity: 0, scale: 1.14 }}
      transition={{ type: "spring", duration: 0.45, bounce: 0 }}
    />
  );
}

type SlotId = "reject" | "approve";
type Clicked = SlotId | null;

const SLOTS: {
  id: SlotId;
  label: string;
  suffix: string;
  toneVar: "--as-reject" | "--as-approve";
  glyph: "cross" | "check";
}[] = [
  {
    id: "reject",
    label: "Reject",
    suffix: "ed",
    toneVar: "--as-reject",
    glyph: "cross",
  },
  {
    id: "approve",
    label: "Approve",
    suffix: "d",
    toneVar: "--as-approve",
    glyph: "check",
  },
];

/* Shared sizing. The badge box and the collapsed circle have to be the same
 * measurement as the pill's height, so the three clamps are written once. */
const PILL_H = "clamp(56px,6.4vw,72px)";
const MARK_SIZE = "clamp(26px,2.9vw,38px)";

/* One <svg> for the life of the slot. Idle it is a tinted disc with a white
 * glyph; expanded the two swap — animated, not re-rendered, so the badge
 * never blinks. Only the slot that LOSES has to change glyph, and that one
 * swap is the single crossfade left in the component. */
function SlotMark({
  glyph,
  expanded,
  collapsed,
}: {
  glyph: "cross" | "check";
  expanded: boolean;
  collapsed: boolean;
}) {
  /* --as-tone is set on the button, so the disc reads its slot's own colour
   * without either being passed down as a literal. Expanded, the disc and
   * the glyph trade places. */
  const disc = expanded ? "var(--as-on)" : "var(--as-tone)";
  const ink = expanded ? "var(--as-tone)" : "var(--as-on)";
  const path =
    glyph === "check"
      ? "M6.8 12.4 10.4 16 17.2 8.8"
      : "M8.2 8.2 15.8 15.8M15.8 8.2 8.2 15.8";

  /* No `mode` — the two glyphs are stacked in the same fixed box and fade
     through each other. `mode="wait"` would hold the incoming one back until
     the outgoing had finished leaving, which reads as a late-arriving icon. */
  return (
    <AnimatePresence initial={false}>
      {collapsed ? (
        <motion.svg
          key="undo"
          className="absolute inset-0 block h-full w-full"
          viewBox="0 0 24 24"
          aria-hidden="true"
          initial={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
          transition={MARK}
        >
          <path
            d="M9 6 4.5 10.5 9 15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 10.5h9a5.5 5.5 0 0 1 0 11H10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      ) : (
        <motion.svg
          key="glyph"
          className="absolute inset-0 block h-full w-full"
          viewBox="0 0 24 24"
          aria-hidden="true"
          initial={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
          transition={MARK}
        >
          <circle
            cx="12"
            cy="12"
            r="12"
            className="transition-[fill] ease-out"
            style={{ fill: disc, transitionDuration: TINT_MS }}
          />
          <path
            d={path}
            fill="none"
            className="transition-[stroke] ease-out"
            style={{ stroke: ink, transitionDuration: TINT_MS }}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      )}
    </AnimatePresence>
  );
}

export default function ApproveSwitch({ className }: { className?: string }) {
  const [clicked, setClicked] = useState<Clicked>(null);
  /* Confetti and a shake are decoration, so under reduced motion they are not
   * softened — they are simply not mounted. The decision still reads without
   * them; the pill and the word carry it. */
  const reduced = useReducedMotion();
  /* Returning to idle IS the undo, whichever slot the press came from. */
  const travel = clicked === null ? UNDO : DECIDE;

  return (
    <MotionConfig transition={travel} reducedMotion="user">
      <div
        className={`flex min-h-full w-full items-center justify-center p-[clamp(16px,3vw,36px)] ${className ?? ""}`}
      >
        {/* The row is the shared frame both screens live in: the two slots
            keep their order across states, so the morph only ever has to
            change size and colour. */}
        <div className="flex items-center gap-[clamp(10px,1.4vw,18px)]">
          {SLOTS.map((slot) => {
            const expanded = clicked === slot.id;
            const collapsed = clicked !== null && !expanded;

            const celebrate = expanded && slot.id === "approve" && !reduced;
            const rebuff = expanded && slot.id === "reject" && !reduced;

            return (
              /* The wrapper does not participate in the layout animation, so
                 it is a stable frame to hang the flourishes on — and shaking
                 it leaves the button's own transform free for `layout`, which
                 would otherwise fight an `x` animation on the same node. */
              <motion.span
                key={slot.id}
                className="relative inline-flex"
                animate={{ x: rebuff ? [0, -7, 6, -4, 3, -1.5, 0] : 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <AnimatePresence>
                  {rebuff && <ImpactRing key="ring" toneVar={slot.toneVar} />}
                </AnimatePresence>
                <AnimatePresence>
                  {celebrate && <Confetti key="confetti" />}
                </AnimatePresence>
                <motion.button
                  type="button"
                  layout
                  style={{
                    borderRadius: RADIUS,
                    height: PILL_H,
                    /* The slot's own decision colour, published to every
                       descendant — the tone overlay and the badge disc both
                       read it, so neither has to be handed a literal. */
                    ["--as-tone" as string]: `var(${slot.toneVar})`,
                    color: expanded ? "var(--as-on)" : "var(--as-pill-ink)",
                    transitionDuration: TINT_MS,
                  }}
                  transition={{ layout: travel }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setClicked(clicked === null ? slot.id : null)}
                  aria-label={collapsed ? "Undo decision" : undefined}
                  aria-pressed={expanded}
                  className={[
                    /* The resting pill is painted here and never changes —
                       the decision tone floods in as an overlay on top of it,
                       so this background is what is visible at rest, before
                       hydration, and behind every state. */
                    "relative flex cursor-pointer items-center justify-center gap-3 border-0 bg-[var(--as-pill)] transition-[color] ease-out select-none",
                    "text-[clamp(18px,1.9vw,26px)] leading-none font-bold tracking-[-0.01em] whitespace-nowrap",
                    /* Clips the label on its way out, so nothing is ever
                       visible outside the pill while the pill shrinks. */
                    "overflow-hidden [-webkit-tap-highlight-color:transparent]",
                    "outline-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-current",
                    /* A fixed expanded width keeps the morph from snapping to
                       content width when the suffix lands a beat after the
                       pill has finished growing. Collapsed is a circle, so
                       width has to equal the shared height. */
                    expanded
                      ? "w-[clamp(280px,34vw,420px)] p-0"
                      : collapsed
                        ? "w-[clamp(56px,6.4vw,72px)] gap-0 p-0"
                        : "px-[clamp(22px,2.6vw,34px)]",
                  ].join(" ")}
                >
                  {/* The decision tone. An overlay rather than a background
                      on the button itself: opacity is the one visual channel
                      Motion can spring without parsing a colour, which keeps
                      the fill a live `var()` and the flood a real spring.
                      rounded-[inherit] picks up the pill's px radius, so it
                      is corrected by the same layout projection. */}
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[var(--as-tone)]"
                    initial={false}
                    animate={{ opacity: expanded ? 1 : 0 }}
                    transition={TINT}
                  />

                  {/* A fixed box the two glyphs are stacked inside, so they
                      fade through each other simultaneously instead of taking
                      turns, and neither reflows the pill while swapping.
                      layout="position" keeps it centred while the pill grows
                      instead of being stretched by the parent's morph. */}
                  <motion.span
                    layout="position"
                    className="relative z-10 flex flex-none items-center justify-center"
                    style={{ width: MARK_SIZE, height: MARK_SIZE }}
                  >
                    <SlotMark
                      glyph={slot.glyph}
                      expanded={expanded}
                      collapsed={collapsed}
                    />
                  </motion.span>

                  {/* popLayout takes the label out of flow the instant it
                      starts leaving, so the collapsing pill shrinks around it
                      instead of waiting for the fade and then snapping. */}
                  <AnimatePresence mode="popLayout" initial={false}>
                    {!collapsed && (
                      <motion.span
                        key="label"
                        layout="position"
                        className="relative z-10 inline-flex items-baseline whitespace-pre"
                        initial={{ opacity: 0, filter: "blur(4px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{
                          opacity: 0,
                          filter: "blur(4px)",
                          transition: LEAVE,
                        }}
                        transition={SWAP}
                      >
                        {slot.label}
                        <AnimatePresence mode="popLayout" initial={false}>
                          {expanded && (
                            /* inline-block so the suffix can be moved on y;
                               overflow stays visible so descenders are never
                               clipped. */
                            <motion.span
                              key="suffix"
                              className="inline-block whitespace-pre"
                              variants={suffixVariants}
                              initial="initial"
                              animate="active"
                              exit="exit"
                              transition={SWAP}
                            >
                              {slot.suffix}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.span>
            );
          })}
        </div>
      </div>
    </MotionConfig>
  );
}
