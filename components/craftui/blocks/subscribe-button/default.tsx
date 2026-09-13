"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useAnimationControls,
  useReducedMotion,
  type Transition,
} from "motion/react";
import { IconCheck, IconMail } from "@tabler/icons-react";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — email subscription bar
 *
 *  scene 1   one narrow pill: a mail glyph and the word "Subscribe".
 *  on click  THE PILL ITSELF STAYS AND STRETCHES — same node, so the mail
 *            glyph never blinks, it just holds its place at the left as the
 *            box grows around it. The field and the Join button mount into
 *            the room that opens up.
 *  on submit the pill holds its width. A small spinner pops in at the left of
 *            the label while the word GROWS — "Join" never remounts, the
 *            letters "i" "n" "g" mount onto the end of it one at a time. When
 *            the request resolves the spinner pops back out, "ing" is replaced
 *            by "ed", and a throw of ribbons fires from the button itself.
 *  then      the field and button leave and the pill pulls in around
 *            "You're subscribed", which drops in from above. Nothing to press:
 *            after a beat the pill simply returns to where it started, so the
 *            whole run is one round trip rather than a state you must dismiss.
 *  on undo   plays in reverse, flat and quick.
 *
 * Same architecture as FeedbackSwitch: one persistent node doing the morph
 * with `layout` (never `layoutId`), every child on `layout="position"` so the
 * box's scale correction cannot smear it, and only *content* mounting and
 * unmounting inside. The difference is that this pill morphs TWICE in a row —
 * idle → typing → done — which is why the box never unmounts at any point.
 * ───────────────────────────────────────────────────────── */

type Stage = "idle" | "typing" | "pending" | "joined" | "done";

/* Opening the field is a deliberate act and carries a little weight. */
const DECIDE: Transition = { type: "spring", duration: 0.42, bounce: 0.18 };
/* Submitting is the payoff, so it lands with slightly more life than the
 * pill opened with — the one place in the block that gets extra bounce. */
const SUBMIT: Transition = { type: "spring", duration: 0.38, bounce: 0.22 };
/* The return leg. Going home is not a decision, so it snaps back flat — the
 * same spring the pill would have used for an explicit undo. */
const UNDO: Transition = { type: "spring", duration: 0.3, bounce: 0 };

/* Content arrives on a lively spring — the label and the capsules overshoot
 * slightly and settle, so they land as objects rather than as values. */
const LIVELY: Transition = { type: "spring", duration: 0.4, bounce: 0.28 };

/* …but only the PHYSICAL values get that bounce. Opacity and blur ride a
 * flat spring instead: bounce on them would overshoot past opaque and past
 * zero blur, which the browser clamps into a visible hitch. */
const SWAP: Transition = { type: "spring", duration: 0.32, bounce: 0 };

/* Text takes a smaller bounce than the capsule: a word wobbling on its own
 * baseline reads as a glitch long before a moving box does. */
const TEXT: Transition = { type: "spring", duration: 0.4, bounce: 0.2 };

/* The letters. Written as stiffness/damping rather than this file's usual
 * duration/bounce because that is how it was authored and the numbers are
 * already right — it lands at roughly { duration: 0.36, bounce: 0.16 }. */
const LETTER: Transition = { type: "spring", damping: 20, stiffness: 350 };

/* The suffix each phase adds to the base word. The base is never in here:
 * "Join" is a persistent node, and only these letters mount and unmount. */
const SUFFIX: Record<string, string[]> = {
  pending: ["i", "n", "g"],
  joined: ["e", "d"],
};

/* The spinner is the only thing that appears from nothing mid-request, so it
 * arrives with real pop — it has to be noticed without the box moving. */
const SPINNER: Transition = { type: "spring", duration: 0.34, bounce: 0.4 };

/* The glyph swap is the fastest thing here — a crossfade inside a fixed-size
 * box, not a move. No bounce, so the icon lands rather than settles. */
const GLYPH: Transition = { type: "spring", duration: 0.26, bounce: 0 };

/* Applied together, so one element can bounce on its move and stay clean on
 * its fade. Every entry is a spring — the flat ones are springs with no
 * bounce, not tweens. */
const ARRIVE: Transition = {
  x: LIVELY,
  y: LIVELY,
  scale: LIVELY,
  opacity: SWAP,
  filter: SWAP,
};

const ARRIVE_TEXT: Transition = {
  y: TEXT,
  opacity: SWAP,
  filter: SWAP,
};

/* Leaving is shorter than arriving. The pill's resize is the star of every
 * transition, and a label still fading at 300ms is visibly wider than the box
 * it is inside — it reads as text escaping the pill. Gone in half the time. */
const LEAVE: Transition = { type: "spring", duration: 0.16, bounce: 0 };

/* Radius must be an inline pixel value: a layout animation scales the box,
 * and Motion can only undo the corner distortion when it knows the px. */
const RADIUS = 999;

/* Deliberately loose. The only thing worth rejecting in the browser is an
 * address that cannot possibly be one; anything stricter starts refusing
 * valid mail, and the server is the real authority either way. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ── Streamers ─────────────────────────────────────────────
 * Ribbons, not confetti squares. The throw is the same field the confetti
 * used — same fan, same launch/apex/fall arc, same 0.78–1.12s clock — but
 * each particle is a long curled strip that FLIPS as it falls. That flicker
 * between broad and edge-on is what makes a ribbon read as a ribbon rather
 * than a stretched rectangle; a strip that only spins in the plane is just a
 * longer piece of confetti.
 *
 * Deterministic pseudo-random — Math.random() would produce different values
 * on the server and the client and break hydration. Seeded by index, the
 * field is identical every render, which also makes it art-directable. */
function frac(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

const STREAMER_COLORS = [
  "#4cc85c",
  "#2fa8ff",
  "#ffc531",
  "#ff6f91",
  "#8b5cf6",
  /* Theme-flipping ink: a var() is legal in the inline `stroke` these ribbons
   * are drawn with, and a fixed #0b0b0b would vanish in dark. */
  "var(--sb-ink)",
];

/* One S-curve, drawn once in a 6×36 box and scaled per ribbon. Fixed curl
 * rather than per-ribbon geometry: the variety comes from length, spin and
 * flip phase, and a field of eighteen differently-shaped paths reads as
 * noise instead of as one kind of thing thrown eighteen times. */
const CURL = "M3 0 C 6.5 6, -0.5 12, 3 18 S 6.5 30, 3 36";

const STREAMERS = Array.from({ length: 18 }, (_, i) => {
  /* Fan the throw across the upper half only — ribbons leaving downward out
   * of a pill look like debris rather than celebration. */
  const angle = (-166 + (142 * i) / 17 + frac(i) * 12) * (Math.PI / 180);
  const dist = 68 + frac(i + 9) * 78;
  return {
    dx: Math.cos(angle) * dist,
    dy: Math.sin(angle) * dist,
    drift: (frac(i + 5) - 0.5) * 46,
    fall: 96 + frac(i + 7) * 92,
    /* In-plane spin is gentler than the confetti's: a ribbon is long, and a
     * long thing turning 300° reads as a propeller. The flip carries the
     * energy instead. */
    spin: (frac(i + 11) - 0.5) * 260,
    /* Full turns about the ribbon's own axis over the fall — two to three and
     * a half, so no two flicker in step. Odd multiples of 180 land edge-on at
     * the very end, which is the least visible way to leave. */
    flips: 2 + frac(i + 3) * 1.5,
    /* Where in the flip each one starts, so the field is not all broadside
     * on frame one. */
    phase: frac(i + 15) * 360,
    /* The curl is 6 wide and 36 tall; this scales its length. Ribbons are the
     * one particle where a wide size range helps — a couple of long ones
     * among short ones is what gives the fall its layers. */
    length: 18 + frac(i + 2) * 18,
    color: STREAMER_COLORS[i % STREAMER_COLORS.length],
    dur: 0.78 + frac(i + 13) * 0.34,
    delay: frac(i + 17) * 0.06,
  };
});

function Streamers({ origin }: { origin: { x: number; y: number } }) {
  return (
    /* A zero-size origin, so every ribbon's translation is measured from one
       point. It is offset to the BUTTON's centre — measured, not guessed —
       but it lives out here on the wrapper because the pill is
       overflow-hidden and would clip a throw from inside it. */
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-0 w-0"
      style={{
        transform: `translate(${origin.x}px, ${origin.y}px)`,
        perspective: 240,
      }}
    >
      {STREAMERS.map((p, i) => {
        const w = (6 * p.length) / 36;
        return (
          <motion.svg
            key={i}
            viewBox="0 0 6 36"
            className="absolute top-0 left-0 block overflow-visible"
            style={{
              width: w,
              height: p.length,
              marginLeft: -w / 2,
              marginTop: -p.length / 2,
              /* Flip about the ribbon's own vertical axis, from its centre —
                 the default origin is the top-left corner, which would swing
                 the strip around a hinge instead of turning it over. */
              transformOrigin: "50% 50%",
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 0.4,
              rotate: 0,
              rotateX: p.phase,
              opacity: 0,
            }}
            /* Same three-keyframe arc as the confetti — launch, apex, fall —
               with x and y on separate curves so gravity lives only on y: the
               throw keeps its ease-out while the drop eases IN. The flip is a
               fourth track: linear rotateX for the whole flight, so the strip
               flickers wide → edge-on → wide at an even rate as it falls.
               Keyframed arcs are the one thing a spring cannot express, so
               these stay tweens. */
            animate={{
              x: [0, p.dx, p.dx + p.drift],
              y: [0, p.dy, p.dy + p.fall],
              scale: [0.4, 1, 0.94],
              rotate: [0, p.spin],
              rotateX: [p.phase, p.phase + 360 * p.flips],
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
              rotateX: { duration: p.dur, ease: "linear" },
              opacity: {
                duration: p.dur,
                times: [0, 0.06, 0.62, 1],
                ease: "linear",
              },
            }}
          >
            <path
              d={CURL}
              fill="none"
              stroke={p.color}
              /* Thick relative to the 6-unit box so the strip has body when
                 broadside and still leaves a visible hairline near edge-on. */
              strokeWidth={4.2}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </motion.svg>
        );
      })}
    </span>
  );
}

/* The word is one continuous object: "Join" is a plain span that outlives
 * every phase, so it never blinks, and the suffix letters arrive on its end
 * one after another. layout="position" on the row lets the whole word glide
 * back to centre as it grows instead of jumping. */
function ButtonLabel({ phase }: { phase: string }) {
  const suffix = SUFFIX[phase];

  return (
    <motion.span
      layout="position"
      transition={LETTER}
      className="relative z-[1] flex"
    >
      <span>Join</span>
      {/* popLayout so the outgoing "ing" leaves flow on frame one and "ed"
          does not wait for it to finish fading before taking its place. */}
      <AnimatePresence mode="popLayout" initial={false}>
        {suffix?.map((char, index) => (
          <motion.span
            /* Keyed by phase as well as index: two suffixes that shared a
               glyph would otherwise reuse the same node and teleport. */
            key={`${phase}-${char}-${index}`}
            layout
            /* inline-block, or the y offset silently does nothing — transforms
               do not apply to inline boxes. */
            className="inline-block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: LEAVE }}
            transition={{ ...LETTER, delay: 0.06 * index }}
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </motion.span>
  );
}

export default function SubscribeButton({ className }: { className?: string }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  /* Where the throw comes from, measured off the button at the moment it
     resolves. A hard-coded offset would be right at one pill width only. */
  const [burst, setBurst] = useState<{ x: number; y: number } | null>(null);

  /* The streamers are decoration, so under reduced motion they are not
   * softened — they simply never mount. The pill and the sentence still
   * carry the state. */
  const reduced = useReducedMotion();
  /* The shake is imperative because it must be able to fire twice in a row on
   * the same value: a declarative `animate` would see no change and do
   * nothing the second time an address is rejected. */
  const shake = useAnimationControls();

  const open = stage === "typing" || stage === "pending" || stage === "joined";
  const done = stage === "done";
  const expanded = open || done;

  /* Returning to idle IS the undo, whichever stage it came from. */
  const travel = stage === "idle" ? UNDO : done ? SUBMIT : DECIDE;

  function reject(message: string) {
    setError(message);
    /* The shake lives on the WRAPPER, never on the pill: a keyframed x and a
     * layout animation on the same node fight over the same transform, and
     * the pill wins by snapping. Same reason the streamers hang off here. */
    shake.start({
      x: [0, -7, 6, -4, 0],
      transition: { duration: 0.28, ease: "easeOut" },
    });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (stage !== "typing") return;

    const value = email.trim();
    if (!value) return reject("Enter your email address.");
    if (!EMAIL.test(value))
      return reject("That doesn't look like an email address.");

    setError(null);
    setStage("pending");

    /* Stand-in for the real request. Held long enough that the spinner reads
     * as a state rather than a flicker — it has to finish popping in, spin a
     * couple of full turns, and be seen. The pill deliberately does NOT resize
     * here — pending is a change of substance inside a box that already has
     * its final width, so nothing moves while we wait. */
    window.setTimeout(() => {
      const wrapper = wrapperRef.current?.getBoundingClientRect();
      const button = buttonRef.current?.getBoundingClientRect();
      if (wrapper && button) {
        setBurst({
          x:
            button.left + button.width / 2 - (wrapper.left + wrapper.width / 2),
          y:
            button.top + button.height / 2 - (wrapper.top + wrapper.height / 2),
        });
      }
      setStage("joined");
      /* Long enough for the spinner to leave, "ed" to land and the ribbons
         to clear the button. Any shorter and the throw reads as debris from
         a box that is already vanishing. */
      window.setTimeout(() => {
        setStage("done");
        /* The confirmation dismisses itself. It is a receipt, not a decision,
           so leaving a control there would ask the user to tidy up after an
           action that already succeeded — long enough to read the sentence
           twice, then the pill goes home. */
        window.setTimeout(reset, 1900);
      }, 700);
    }, 2000);
  }

  function reset() {
    setStage("idle");
    setEmail("");
    setError(null);
    setBurst(null);
  }

  return (
    <MotionConfig transition={travel} reducedMotion="user">
      <div
        className={`flex h-full w-full items-center justify-center bg-[var(--sb-bg)] px-4 py-10 ${className ?? ""}`}
      >
        <div className="flex w-full items-center justify-center text-[var(--sb-fg)]">
          <motion.span
            ref={wrapperRef}
            animate={shake}
            className="relative inline-flex w-full shrink-0 justify-center"
          >
            {/* Fires the moment the request resolves, and stays mounted
                through the pill's collapse so the throw is never cut off
                mid-arc. */}
            <AnimatePresence>
              {burst && (done || stage === "joined") && !reduced && (
                <Streamers key="streamers" origin={burst} />
              )}
            </AnimatePresence>

            <motion.div
              layout
              style={{ borderRadius: RADIUS }}
              /* Not a <button>: open, this box CONTAINS the submit button,
                 and a button inside a button is invalid. Idle it takes the
                 role instead, keyboard behaviour included; done it is a
                 receipt, so it takes role="status" and nothing is pressable. */
              role={done ? "status" : expanded ? undefined : "button"}
              tabIndex={expanded ? undefined : 0}
              aria-label={expanded ? undefined : "Subscribe to the newsletter"}
              onClick={expanded ? undefined : () => setStage("typing")}
              onKeyDown={(event) => {
                if (expanded) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setStage("typing");
                }
              }}
              /* Focus lands only once the box has finished growing. Focusing
                 an input mid-morph makes the browser scroll to a rectangle
                 that is still moving, which yanks the page. */
              onLayoutAnimationComplete={() => {
                if (stage === "typing") inputRef.current?.focus();
              }}
              whileTap={expanded ? undefined : { scale: 0.96 }}
              transition={{ layout: travel, ...ARRIVE }}
              className={[
                "flex h-[92px] shrink-0 items-center overflow-hidden bg-[var(--sb-pill)]",
                "transition-colors duration-150 ease-out",
                "outline-none focus-visible:ring-2 focus-visible:ring-[var(--sb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sb-bg)]",
                /* Three widths, not two: the pill opens wide for the field,
                   pulls IN around the confirmation, then goes home. Each leg
                   is the same node resizing, so the shrink reads as one object
                   settling rather than three screens. */
                open
                  ? "w-full max-w-[560px] gap-4 pr-3 pl-8"
                  : done
                    ? "w-[min(360px,82vw)] justify-center gap-3 px-8"
                    : "w-[min(260px,64vw)] cursor-pointer justify-center gap-3 hover:bg-[var(--sb-pill-hover)]",
              ].join(" ")}
            >
              {/* A fixed-size slot, so the glyph swap is a pure crossfade and
                  the pill's width never depends on which icon is showing.
                  layout="position" keeps the glyph its true size while the
                  pill morphs — without it the parent's scale correction
                  stretches it for the length of the move. */}
              <motion.span
                layout="position"
                className="relative block h-[34px] w-[34px] shrink-0"
              >
                <AnimatePresence initial={false}>
                  <motion.span
                    key={done ? "check" : "mail"}
                    className="absolute inset-0 grid place-items-center"
                    initial={{ opacity: 0, scale: 0.7, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.7, filter: "blur(4px)" }}
                    transition={GLYPH}
                  >
                    {done ? (
                      <IconCheck size={34} stroke={3} />
                    ) : (
                      <IconMail size={34} stroke={2.2} />
                    )}
                  </motion.span>
                </AnimatePresence>
              </motion.span>

              {/* popLayout: the outgoing content leaves flow on frame one, so
                  the surviving children reflow to their final positions
                  immediately instead of after the fade. */}
              <AnimatePresence mode="popLayout" initial={false}>
                {stage === "idle" && (
                  <motion.span
                    key="cta"
                    layout="position"
                    className="text-[26px] font-bold tracking-tight whitespace-nowrap"
                    initial={{ opacity: 0, y: "-0.5em", filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
                    exit={{
                      opacity: 0,
                      y: "0.5em",
                      filter: "blur(4px)",
                      transition: LEAVE,
                    }}
                    transition={ARRIVE_TEXT}
                  >
                    Subscribe
                  </motion.span>
                )}

                {open && (
                  /* The form wraps only the field group, not the pill: the
                     pill outlives it. Enter still submits, which is the whole
                     reason this is a <form> and not two divs. */
                  <motion.form
                    key="field"
                    layout="position"
                    onSubmit={submit}
                    className="flex min-w-0 flex-1 items-center gap-3"
                    initial={{ opacity: 0, x: -12, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{
                      opacity: 0,
                      x: -12,
                      filter: "blur(4px)",
                      transition: LEAVE,
                    }}
                    transition={ARRIVE}
                  >
                    <input
                      ref={inputRef}
                      type="email"
                      name="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (error) setError(null);
                      }}
                      disabled={stage !== "typing"}
                      placeholder="you@example.com"
                      aria-label="Email address"
                      aria-invalid={error ? true : undefined}
                      autoComplete="email"
                      /* min-w-0 lets the field claim its track from frame one
                         and shrink honestly inside the flex row; the pill
                         grows around it rather than the field pushing it. */
                      className="min-w-0 flex-1 bg-transparent text-[26px] font-medium tracking-tight outline-none placeholder:text-[var(--sb-placeholder)]"
                    />

                    {/* A fixed min-width, so the spinner mounting and the word
                        growing from "Join" to "Joining" both recentre inside a
                        button that never resizes — the pill above it stays
                        perfectly still through the whole request. */}
                    <button
                      ref={buttonRef}
                      type="submit"
                      disabled={stage !== "typing"}
                      className="flex h-[68px] min-w-[152px] shrink-0 cursor-pointer items-center justify-center gap-2 bg-[var(--sb-button)] px-6 text-[24px] font-bold tracking-tight whitespace-nowrap text-[var(--sb-on-button)] transition-colors duration-150 ease-out outline-none hover:bg-[var(--sb-button-hover)] focus-visible:ring-2 focus-visible:ring-[var(--sb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sb-pill)] disabled:cursor-default"
                      style={{ borderRadius: RADIUS }}
                    >
                      {/* Only ever on screen while the request is in flight.
                          popLayout so the label starts sliding back to centre
                          on the frame the spinner leaves, not after it fades. */}
                      <AnimatePresence mode="popLayout" initial={false}>
                        {stage === "pending" && (
                          <motion.span
                            key="spinner"
                            layout
                            aria-hidden="true"
                            className="relative z-[1] block h-[18px] w-[18px] shrink-0"
                            initial={{ opacity: 0, scale: 0.3 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{
                              opacity: 0,
                              scale: 0.3,
                              transition: LEAVE,
                            }}
                            /* Bounce on the scale only. Opacity riding a
                               bouncy spring overshoots past opaque, which the
                               browser clamps into a visible hitch. */
                            transition={{ scale: SPINNER, opacity: SWAP }}
                          >
                            {/* The rotation is a CSS animation on an INNER
                                node: `animate-spin` writes `transform`, and a
                                CSS animation beats an inline style, so sharing
                                a node with Motion's scale would silently drop
                                the pop. Reduced motion keeps the ring and
                                stops the spin. The ring is drawn in
                                currentColor so it inherits the button's ink
                                and flips with the theme. */}
                            <span className="block h-full w-full animate-spin rounded-full border-2 border-current/25 border-t-current motion-reduce:animate-none motion-reduce:border-current/45 motion-reduce:border-t-current/45" />
                          </motion.span>
                        )}
                      </AnimatePresence>

                      <ButtonLabel phase={stage} />
                    </button>
                  </motion.form>
                )}

                {done && (
                  <motion.span
                    key="done"
                    layout="position"
                    aria-live="polite"
                    className="text-[26px] font-bold tracking-tight whitespace-nowrap"
                    initial={{ opacity: 0, y: "-0.5em", filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
                    exit={{
                      opacity: 0,
                      y: "0.5em",
                      filter: "blur(4px)",
                      transition: LEAVE,
                    }}
                    transition={ARRIVE_TEXT}
                  >
                    You&rsquo;re subscribed!
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Absolutely positioned: a validation message that pushes layout
                would move the pill it is complaining about. */}
            <AnimatePresence>
              {error && (
                <motion.p
                  key="error"
                  role="alert"
                  className="absolute top-full left-1/2 mt-3 w-max -translate-x-1/2 text-[14px] font-medium text-[var(--sb-error)]"
                  initial={{ opacity: 0, y: -4, filter: "blur(3px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{
                    opacity: 0,
                    y: -4,
                    filter: "blur(3px)",
                    transition: LEAVE,
                  }}
                  transition={ARRIVE_TEXT}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.span>
        </div>
      </div>
    </MotionConfig>
  );
}
