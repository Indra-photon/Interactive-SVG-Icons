"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  Download01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import {
  AnimatePresence,
  MotionConfig,
  arc,
  motion,
  useAnimationControls,
  useMotionValue,
  useReducedMotion,
  type TargetAndTransition,
  type Transition,
} from "motion/react";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — profile gate
 *
 *  scene 1   five faces in a row. Hover lifts one and brightens its name.
 *  on pick   THE CHOSEN FACE ARCS TO THE CENTRE AND GROWS. It is one node the
 *            whole way: the roster slot goes invisible but keeps its place,
 *            and a single traveller flies between the two rectangles.
 *
 *            The curve is Motion's own `arc()`, handed to `transition.path`.
 *            x and y are given nothing but their destination; the path bends
 *            the line between. It also owns the lean — `rotate` follows the
 *            tangent, so the tilt is the curve's rather than a keyframe we
 *            keep in sync by hand.
 *
 *            The measuring is still hand-rolled FLIP, but that is now a
 *            choice rather than a constraint: `arc()` works on layout
 *            animations too, so this could be a `layoutId` pair with
 *            `transition.layout.path` and no measuring at all. The reason it
 *            is not is that the roster slot must keep its rectangle for the
 *            return, which means never unmounting it — and a layoutId pair
 *            wants exactly one of the two mounted at a time.
 *
 *            The other four do not leave at all. The picked face is removed
 *            from the row and popLayout pulls it out of flow on frame one, so
 *            the remaining four close the gap while the traveller is still
 *            climbing.
 *  scene 2   four boxes below the face, growing downward out of it from a
 *            top-edge origin. It starts at 80% OF THE ASCENT, not on landing:
 *            waiting for the face to stop would make scene 2 a screen that
 *            loads after an animation instead of the end of one. Four boxes,
 *            but ONE input — see the pad below for why. The fourth digit
 *            submits by itself.
 *  on wrong  the pad shakes, clears, and says so. The shake is imperative:
 *            the same PIN failing twice in a row is a value that did not
 *            change, and a declarative animate would do nothing the second
 *            time.
 *  on right  the pad crossfades to a welcome where it stands, and the whole
 *            bottom of the stage changes hands: the roster crossfades out, a
 *            three-tab bar crossfades in, and the face flies down into the
 *            Profile tab — all on the same clock, so it is one event and not
 *            three. The tab bar is mounted from the start at opacity 0 rather
 *            than swapped in, because the descent has to be AIMED at the
 *            Profile tab in the same commit the fade begins, and you cannot
 *            measure a rectangle that is not in the document yet.
 *
 *  scene 3   the pad leaves the moment the descent begins and is gone within
 *            the first fifth of it, so the face travels home over an empty
 *            stage rather than past a panel still fading.
 *
 *            The face arcs home and shrinks — and takes a different route
 *            back for free. `direction` is locked to the direction of TRAVEL,
 *            so the same "cw" on both legs bulges to opposite sides of the
 *            screen once the journey reverses. A path that retraces itself
 *            reads as a rewind; a different one reads as an object that went
 *            somewhere and came back. The row closes in behind it, nearest
 *            face last.
 *
 *  reduced   No arc at all. Arcs are precisely the vestibular trigger, so
 *  motion    under reduced motion the traveller cross-dissolves between the
 *            two rectangles and the row fades without moving. MotionConfig
 *            makes the transforms instant; the opacity the traveller starts
 *            at is what turns that jump into a dissolve.
 *
 * This component is the SCREEN only. The phone around it — body, bezel,
 * island, status bar, home indicator — lives in the preview, because it is
 * device chrome and not part of the interaction. The screen fills whatever
 * box it is given and measures everything against itself, so it works inside
 * a phone frame, a browser mock, or full-bleed without a line changing. The
 * one thing a host must not do is put a CSS transform on an ancestor: every
 * position here comes from getBoundingClientRect, and a scaled ancestor
 * would scale the measurements while leaving the traveller's own translate
 * in unscaled local space — the face would fly to a systematically wrong
 * place. Size the host in real pixels instead.
 * ───────────────────────────────────────────────────────── */

/* ── Geometry ─────────────────────────────────────────────
 * The avatar is rendered ONCE at its small size and scaled up, rather than
 * resized: scale is a composited transform, width/height is layout. The size
 * itself is the `avatarSize` prop; this is only its default. */
const DEFAULT_AVATAR = 50;
/* Corner radius as a FRACTION of the box, never a fixed px. The face is one
 * size in the row and another in the air, and a constant radius reads as a
 * different shape at each. Lower this for squarer corners: 0.5 is a circle,
 * ~0.25 is a squircle, 0 is a square. */
const RADIUS_RATIO = 0.18;
/* Focus rings sit 6px outside the face, so their radius is the face's plus
 * that offset — concentric, not merely similar. */
const RING_INSET = 6;
/* Clear air between the bottom of the grown face and the top of the pad. Small
 * on purpose: the pad unfolds FROM the face, and a wide gap makes it read as a
 * separate panel that happened to appear nearby. */
const PAD_GAP = 2;

/* ── The flight ───────────────────────────────────────────
 * The arc is Motion's own `arc()`, handed to `transition.path`. Everything
 * that used to be hand-keyframed here — an apex, two easings per leg, a
 * bow measured in pixels — is four options on a path factory now, and the
 * curve is a real arc rather than a y-channel bent until it looked like one.
 *
 * Reuse matters: the docs are explicit that a fresh `arc()` has no memory of
 * its own continuity, so each leg's instance is memoised on its options. */
type Bulge = "cw" | "ccw" | "auto";

type Leg = {
  /* How far the arc bulges perpendicular to the straight line, as a fraction
     of the distance travelled. 0 is a straight line; 1 peaks at the full
     travel distance. */
  strength: number;
  /* Where along the leg (0–1) the bulge peaks. 0.5 is symmetric; push it
     early and the face flings out and coasts in. */
  peak: number;
  /* Which side it bulges toward, LOCKED TO THE DIRECTION OF TRAVEL. This is
     what gives the return its own road for free: the same "cw" reverses in
     screen space when the journey does. */
  direction: Bulge;
  /* Tangent following, 0–1. The lean is no longer a keyframe we maintain —
     the path knows its own slope. */
  rotate: number;
  duration: number;
};

type Flight = {
  /* Where the face comes to rest, as a fraction of stage height. */
  rise: number;
  /* How much bigger it gets. 2.19 = 50px → ~110px. */
  growth: number;
  out: Leg;
  home: Leg;
  /* Pacing ALONG the arc. The path decides the shape, this decides how fast
     you move over it. */
  ease: [number, number, number, number];
  /* The tap before the launch. Its own node and its own tween: a dip that has
     to be SEEN before the rise cannot be left to a spring, which would blend
     it into the climb. `handoff` is how long the growth waits for it. */
  anticipate: { scale: number; duration: number; handoff: number };
  /* Scale rides its own spring, independent of the journey. */
  grow: { visualDuration: number; bounce: number };
  shrink: { visualDuration: number; bounce: number };
  /* The pad is timed as a FRACTION of the leg it accompanies, not in seconds,
     so retiming a flight retimes the pad with it and the two can never drift
     apart. */
  pad: {
    /* How far into the ascent the pad starts arriving. 0.8 = it begins in the
       last fifth, as the face is already settling. */
    enterAt: number;
    /* How much of the descent it has to be gone by. 0.2 = it leaves in the
       first fifth, so the face travels home over an empty stage. */
    exitBy: number;
    visualDuration: number;
    bounce: number;
  };
};

/* Tuned live in a DialKit panel, then frozen here. Every value below was a
 * slider; the panel and its route are gone, and putting them back means
 * wrapping this object in useDialKit again — nothing else in the block knew
 * the panel existed, which is what made it removable in one commit. */
const FLIGHT: Flight = {
  rise: 0.25,
  growth: 2.19,
  /* An early peak: the face is flung out of the row and coasts into the
     centre, rather than sailing symmetrically. Its lean is stronger than the
     way home because it is travelling further off the straight line. */
  out: {
    strength: 0.38,
    peak: 0.21,
    direction: "cw",
    rotate: 0.5,
    duration: 0.62,
  },
  home: {
    strength: 0.5,
    peak: 0.5,
    direction: "cw",
    rotate: 0.35,
    duration: 0.58,
  },
  ease: [0.32, 0, 0.24, 1],
  anticipate: { scale: 0.86, duration: 0.3, handoff: 0.07 },
  /* Bouncier than a settle. The face is being thrown, and an overshoot on
     arrival is what says so. */
  grow: { visualDuration: 0.46, bounce: 0.34 },
  /* The shrink is quicker and bouncier than the grow: going home is not a
     decision, so it snaps rather than settles. */
  shrink: { visualDuration: 0.3, bounce: 0.4 },
  pad: { enterAt: 0.8, exitBy: 0.2, visualDuration: 0.34, bounce: 0.2 },
};

/* One instance per leg, built once. The docs are blunt about this: a fresh
 * arc() has no memory, so rebuilding it would throw away the continuity
 * closure that keeps an interrupted flight from snapping. Module scope is
 * exactly where they say to put it, now that the options are fixed. */
const ARC_OUT = arc({
  strength: FLIGHT.out.strength,
  peak: FLIGHT.out.peak,
  direction: FLIGHT.out.direction === "auto" ? undefined : FLIGHT.out.direction,
  rotate: FLIGHT.out.rotate,
});

const ARC_HOME = arc({
  strength: FLIGHT.home.strength,
  peak: FLIGHT.home.peak,
  direction:
    FLIGHT.home.direction === "auto" ? undefined : FLIGHT.home.direction,
  rotate: FLIGHT.home.rotate,
});

/* ── Transitions that are not the flight ──────────────────
 * A plain spring for everything that is neither the flight nor the pad. */
const PAD: Transition = {
  type: "spring",
  duration: 0.42,
  bounce: 0.16,
  delay: 0.08,
};

/* A digit landing in its box. The one place with real pop: it is the only
 * feedback that the keypress registered. */
const DIGIT: Transition = { type: "spring", duration: 0.28, bounce: 0.42 };

/* Leaving is always faster than arriving. */
const LEAVE: Transition = { type: "spring", duration: 0.16, bounce: 0 };

/* ── The faces ────────────────────────────────────────────
 * Hand-drawn on a 0 0 100 100 grid so they stay crisp through the 2.19×
 * scale-up — the whole reason these are vector rather than bitmap. */
function Ari({ ink }: { ink: string }) {
  return (
    <>
      <circle cx="36" cy="44" r="6.5" fill={ink} />
      <circle cx="64" cy="44" r="6.5" fill={ink} />
      <path
        d="M32 62 Q50 78 68 62"
        stroke={ink}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </>
  );
}

function Nova({ ink }: { ink: string }) {
  return (
    <>
      {/* One eye winking — a line where a circle should be is the cheapest
          way to give a face an attitude. */}
      <path
        d="M28 44 Q36 37 44 44"
        stroke={ink}
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="64" cy="43" r="6.5" fill={ink} />
      <path d="M38 62 Q50 74 62 62 Q50 68 38 62 Z" fill={ink} />
    </>
  );
}

function Pip({ ink }: { ink: string }) {
  return (
    <>
      <circle cx="35" cy="45" r="11" stroke={ink} strokeWidth="4" fill="none" />
      <circle cx="65" cy="45" r="11" stroke={ink} strokeWidth="4" fill="none" />
      <path d="M46 45 H54" stroke={ink} strokeWidth="4" strokeLinecap="round" />
      <circle cx="35" cy="45" r="3.5" fill={ink} />
      <circle cx="65" cy="45" r="3.5" fill={ink} />
      <path
        d="M40 66 Q50 72 60 66"
        stroke={ink}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
    </>
  );
}

function Wren({ ink }: { ink: string }) {
  return (
    <>
      {/* Lids, not eyes. Half-closed reads as calm at any size. */}
      <path
        d="M28 46 Q36 39 44 46"
        stroke={ink}
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M56 46 Q64 39 72 46"
        stroke={ink}
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="50" cy="66" r="5" fill={ink} />
      <circle cx="26" cy="58" r="4.5" fill={ink} opacity="0.28" />
      <circle cx="74" cy="58" r="4.5" fill={ink} opacity="0.28" />
    </>
  );
}

function Bo({ ink }: { ink: string }) {
  return (
    <>
      <path
        d="M27 38 Q35 33 43 37"
        stroke={ink}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M57 37 Q65 33 73 38"
        stroke={ink}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="35" cy="48" r="6" fill={ink} />
      <circle cx="65" cy="48" r="6" fill={ink} />
      {/* An open mouth with a tongue: the only face here that is mid-laugh. */}
      <path d="M34 62 Q50 60 66 62 Q60 78 50 78 Q40 78 34 62 Z" fill={ink} />
      <path d="M44 73 Q50 68 56 73 Q50 79 44 73 Z" fill="#fff" opacity="0.55" />
    </>
  );
}

/* The five drawn faces, cycled by index for any profile that brings no
 * `avatar` of its own. A custom avatar replaces the drawing but keeps the
 * ground colour unless the profile sets `color`. */
const DRAWN = [
  { ground: "#e8503a", ink: "#2a0b06", Face: Ari },
  { ground: "#2fa8ff", ink: "#04213b", Face: Nova },
  { ground: "#f0a03c", ink: "#3b2405", Face: Pip },
  { ground: "#4cc85c", ink: "#062c11", Face: Wren },
  { ground: "#8b5cf6", ink: "#1c0a44", Face: Bo },
];

type HugeIcon = ComponentProps<typeof HugeiconsIcon>["icon"];

export interface Profile {
  /* Label under the face. Also read into "Enter {name}'s PIN" and the
     Profile tab's accessible name. */
  name: string;
  /* The answer the default verifier checks against. A profile with no `pin`
     is unlocked: pick it and it flies, pauses, and signs in — no pad. Pass
     `locked` to keep the pad while checking the PIN somewhere else. */
  pin?: string;
  /* Whether the gate asks for a PIN at all. Defaults to `pin !== undefined`,
     so it only needs setting when the answer lives on a server. */
  locked?: boolean;
  /* Ground colour of the avatar box, and of the glow it throws on the screen
     while it is up. Defaults to the drawn face's own colour. */
  color?: string;
  /* Replaces the drawn face. An <img> is sized to fill the box; anything
     else is your own concern. Rendered at `avatarSize` and scaled, never
     resized, so keep it vector or comfortably above 2× that size. */
  avatar?: ReactNode;
}

export interface Tab {
  name: string;
  icon: HugeIcon;
  onClick?: () => void;
}

export interface NetflixSignInProps {
  /* The roster. Five fit a 340px-wide host; more need a wider one. */
  profiles?: Profile[];
  /* The tabs AFTER Profile. Profile is always first — it is the landing pad
     the face flies into, so it is not the consumer's to move. */
  tabs?: Tab[];
  /* Decides whether a PIN is right. Replace the default comparison against
     `profile.pin` with a request; the pad stays locked until it resolves.
     A rejection or a throw counts as wrong. */
  onVerify?: (
    pin: string,
    profile: Profile,
    index: number,
  ) => boolean | Promise<boolean>;
  /* Fires when the face lands in the Profile tab — the flow is over. */
  onSignIn?: (profile: Profile, index: number) => void;
  /* Fires when Back or Escape has returned the face to the row. */
  onDismiss?: () => void;
  heading?: string;
  /* A function, not a string, because the name is interpolated. */
  pinLabel?: (name: string) => string;
  errorMessage?: string;
  welcome?: { title: string; subtitle?: string };
  backLabel?: string;
  profileTabLabel?: string;
  /* The margin note that leaks each profile's PIN. Demo scaffolding — the
     preview turns it on, an installed block should not. */
  showHint?: boolean;
  /* Number of PIN boxes. The last one submits by itself. */
  pinLength?: number;
  /* Face size in the row, in px. Everything else — radius, ring offset, the
     grown size — derives from it. */
  avatarSize?: number;
  /* Appended to the screen's classes. The block fills its container. */
  className?: string;
}

const DEFAULT_PROFILES: Profile[] = [
  { name: "Ari", pin: "1234" },
  { name: "Nova", pin: "2580" },
  { name: "Pip", pin: "1379" },
  { name: "Wren", pin: "4321" },
  { name: "Bo", pin: "0000" },
];

/* The bar that replaces the roster once you are through the gate. Profile is
 * first because it is the one with a destination in it — the other two are
 * here to make it a bar rather than a button. */
const DEFAULT_TABS: Tab[] = [
  { name: "Search", icon: Search01Icon },
  { name: "Downloads", icon: Download01Icon },
];

/* How long the default verifier pretends to think. Only used when no
 * `onVerify` is passed — a real request sets its own pace. */
const FAKE_VERIFY_MS = 900;

/* An unlocked profile still pauses at the centre before it is let through,
 * so the pick reads as a pick and not as a face that bounced off. */
const UNLOCKED_HOLD_MS = 320;

function isLocked(profile: Profile) {
  return profile.locked ?? profile.pin !== undefined;
}

function groundOf(profile: Profile, index: number) {
  return profile.color ?? DRAWN[index % DRAWN.length].ground;
}

type Phase =
  "idle" | "rising" | "pin" | "verifying" | "granted" | "falling" | "home";

type Travel = {
  from: { x: number; y: number };
  stage: { w: number; h: number };
};

/* The avatar itself. Rendered at `size` px everywhere and scaled by
 * transform, so the roster slot and the traveller are provably the same
 * object. */
function Avatar({
  profile,
  index,
  size,
  elementRef,
}: {
  profile: Profile;
  index: number;
  size: number;
  elementRef?: React.Ref<HTMLSpanElement>;
}) {
  const { ink, Face } = DRAWN[index % DRAWN.length];

  return (
    <span
      ref={elementRef}
      className="block overflow-hidden [&>img]:h-full [&>img]:w-full [&>img]:object-cover"
      style={{
        width: size,
        height: size,
        background: groundOf(profile, index),
        borderRadius: size * RADIUS_RATIO,
      }}
    >
      {profile.avatar ?? (
        <svg viewBox="0 0 100 100" className="block h-full w-full">
          <Face ink={ink} />
        </svg>
      )}
    </span>
  );
}

export default function NetflixSignIn({
  profiles = DEFAULT_PROFILES,
  tabs = DEFAULT_TABS,
  onVerify,
  onSignIn,
  onDismiss,
  heading = "Who’s watching?",
  pinLabel = (name) => `Enter ${name}’s PIN`,
  errorMessage = "That PIN doesn’t match.",
  welcome = { title: "Welcome back!", subtitle: "Enjoy your weekend." },
  backLabel = "← Back",
  profileTabLabel = "Profile",
  showHint = false,
  pinLength = 4,
  avatarSize = DEFAULT_AVATAR,
  className,
}: NetflixSignInProps) {
  const reduced = useReducedMotion();
  const AVATAR = avatarSize;
  const RADIUS = AVATAR * RADIUS_RATIO;

  /* Callbacks live in a ref so the flight effect below can call them at
     landing without listing them as deps — a consumer passing a fresh arrow
     function every render must not restart a leg in progress. */
  const callbacks = useRef({ onSignIn, onDismiss });
  callbacks.current = { onSignIn, onDismiss };
  /* Bumped whenever a verification is superseded — a dismiss, a new pick —
     so a slow `onVerify` resolving late cannot act on a gate that has moved
     on. */
  const verifyId = useRef(0);

  const [phase, setPhase] = useState<Phase>("idle");
  const [chosen, setChosen] = useState<number | null>(null);
  const [travel, setTravel] = useState<Travel | null>(null);
  /* Where the descent ENDS. Usually the slot the face came from, but a
     correct PIN sends it somewhere else entirely, so it cannot be baked into
     the measurement the way the origin is. */
  const [homePoint, setHomePoint] = useState<{ x: number; y: number } | null>(
    null,
  );
  /* The bar that is showing. Both bars stay mounted and crossfade, which is
     also what keeps the Profile tab measurable before it is ever visible —
     you cannot fly something to a rectangle that is not in the document. */
  const [signedIn, setSignedIn] = useState(false);
  const [pin, setPin] = useState("");
  /* Whether the hidden input holds focus the user can SEE. Tailwind's `peer-*`
     only reaches siblings, and the boxes are grandchildren of the input's
     sibling, so the ring cannot be expressed in CSS from here — the state has
     to come back into React to land on one box.

     `:focus-visible` is the right test even though the boxes should light up
     on a click: the spec matches it on text inputs however focus arrived, so
     this stays true for the mouse and still suppresses nothing a keyboard user
     needs. */
  const [showFocus, setShowFocus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const slots = useRef<(HTMLButtonElement | null)[]>([]);
  /* The FACE, not the button around it. The button is a flex column holding
     the avatar and its name, so its centre sits well below the avatar's — fly
     from that and the face drops ~13px before it has gone anywhere. */
  const faceSlots = useRef<(HTMLSpanElement | null)[]>([]);
  const profileSlot = useRef<HTMLSpanElement | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);

  /* The shake lives on the pad's wrapper, never on the traveller: a keyframed
     x and the flight's own x would be the same transform fighting. */
  const shake = useAnimationControls();

  /* Owned rather than left to Motion, so the ascent can be seeded at the
     slot it is leaving before the leg starts. */
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const gating = phase !== "idle";
  const locked = phase === "verifying" || phase === "granted";
  /* The phases the pad belongs to, listed rather than expressed as "not
     falling". `home` is also not falling, and testing for the absence of one
     phase quietly re-mounted the whole pad the moment the face landed in the
     tab bar — the welcome played once on the way out and then a second time
     after it had already gone. */
  const needsPin = chosen !== null && isLocked(profiles[chosen]);
  const padOpen =
    needsPin &&
    (phase === "rising" ||
      phase === "pin" ||
      phase === "verifying" ||
      phase === "granted");

  /* Big only while it is up at the centre. Listed rather than derived from
     `gating`, because `home` is also a gated phase and is emphatically not
     big — it is a 50px face sitting in a tab bar. */
  const grown =
    phase === "rising" ||
    phase === "pin" ||
    phase === "verifying" ||
    phase === "granted";

  /* Measured against the STAGE, not the viewport, so the block works at any
     panel size — and would work full-bleed without a line changing.

     Only MEASUREMENTS are stored. Where the face lands is derived below from
     the flight, so dragging a dial moves it without re-measuring anything. */
  /* Any element's centre, in stage coordinates. */
  function centreOf(element: Element | null) {
    const stage = stageRef.current?.getBoundingClientRect();
    const box = element?.getBoundingClientRect();
    if (!stage || !box) return null;
    return {
      x: box.left - stage.left + box.width / 2,
      y: box.top - stage.top + box.height / 2,
    };
  }

  function measure(index: number): Travel | null {
    const stage = stageRef.current?.getBoundingClientRect();
    const slot = faceSlots.current[index]?.getBoundingClientRect();
    if (!stage || !slot) return null;

    return {
      from: {
        x: slot.left - stage.left + slot.width / 2,
        y: slot.top - stage.top + slot.height / 2,
      },
      stage: { w: stage.width, h: stage.height },
    };
  }

  const big = AVATAR * FLIGHT.growth;

  const target = useMemo(() => {
    if (!travel) return null;
    const to = {
      x: travel.stage.w / 2,
      /* Held off the top edge so the face never crowds the heading, and low
         enough that the pad below it stays inside the stage. */
      y: Math.max(24 + big / 2, travel.stage.h * FLIGHT.rise),
    };
    return { to, padTop: to.y + big / 2 + PAD_GAP };
  }, [travel, big]);

  /* A measured FLIP is only correct for the size it was measured at, so the
     geometry is recomputed whenever the stage changes shape mid-flight. */
  useEffect(() => {
    if (chosen === null) return;
    const onResize = () => {
      /* While the face is away its slot is not in the row to be measured, so
         a resize mid-flight keeps the home point it already has rather than
         clearing it and stranding the traveller. */
      const next = measure(chosen);
      if (next) setTravel(next);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [chosen]);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
      verifyId.current += 1;
    },
    [],
  );

  function later(fn: () => void, ms: number) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  function pick(index: number) {
    if (gating) return;
    const next = measure(index);
    if (!next) return;
    verifyId.current += 1;
    setTravel(next);
    setChosen(index);
    setPin("");
    setError(null);
    setPhase("rising");
  }

  function dismiss() {
    if (!gating || locked || phase === "home") return;
    verifyId.current += 1;
    setHomePoint(null);
    setPhase("falling");
  }

  /* Let the face through. `hold` is how long it stays put first: long enough
     for the boxes to go green and be read as the reason the face is leaving,
     or — with no pad — just long enough to register as a pause. */
  function grant(hold: number) {
    setPhase("granted");
    later(() => {
      /* All three in one commit: the bars begin crossfading on exactly the
         frame the face starts down, and the descent already knows it is
         aiming at the Profile tab rather than the row it came from. */
      const profile = centreOf(profileSlot.current);
      if (profile) setHomePoint(profile);
      setSignedIn(true);
      setPhase("falling");
    }, hold);
  }

  function refuse() {
    setPhase("pin");
    setPin("");
    /* Focus returns to the field below, which is also what puts this in
       front of a screen reader: it is wired to the input through
       aria-describedby rather than shouted as an alert, because it is
       validation for one field and not a page-level event. */
    setError(errorMessage);
    shake.start({
      x: [0, -8, 7, -4, 0],
      transition: { duration: 0.3, ease: "easeOut" },
    });
    input.current?.focus();
  }

  async function verify(value: string) {
    if (chosen === null) return;
    const id = ++verifyId.current;
    setPhase("verifying");

    let ok = false;
    try {
      ok = onVerify
        ? await onVerify(value, profiles[chosen], chosen)
        : /* No verifier: compare locally, after a pause that stands in for
             the round trip a real one would take. */
          await new Promise<boolean>((resolve) =>
            later(
              () => resolve(value === profiles[chosen].pin),
              FAKE_VERIFY_MS,
            ),
          );
    } catch {
      ok = false;
    }
    /* Superseded while waiting — dismissed, or unmounted. Say nothing. */
    if (id !== verifyId.current) return;

    if (ok) grant(720);
    else refuse();
  }

  function onPin(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, pinLength);
    setPin(digits);
    if (error) setError(null);
    if (digits.length === pinLength) verify(digits);
  }

  /* Focus lands only once the face has finished flying. Focusing mid-flight
     makes the browser scroll to a rectangle that is still moving. */
  useEffect(() => {
    if (phase === "pin") input.current?.focus();
  }, [phase]);

  /* Handing Motion the POSE OBJECT rather than a variant label is what makes
     the dials live. Motion re-runs a variant only when the label changes —
     "up" is still "up" no matter what the numbers underneath it say — so with
     labels, turning a dial rebuilt the pose and nothing moved. Against an
     object it diffs the values, and the memo below keeps the identity stable
     so unrelated re-renders cannot restart the flight.

     Two plain targets. No keyframes, no apex, no second easing: x and y go
     straight to their destination and `path` bends the line between. */
  const poses = useMemo<
    { up: TargetAndTransition; down: TargetAndTransition } | undefined
  >(() => {
    if (!travel || !target) return undefined;
    const { from } = travel;
    const { to } = target;
    const half = AVATAR / 2;

    return {
      /* x, y and nothing else. `arc()` takes the whole target object, drives
         x and y off a single progress value, and then DELETES them from it —
         the source does this literally — so anything else riding along in
         there is at the mercy of that handshake. Scale is animated on its own
         motion value below instead, which is also more honest: the size is
         not part of the journey. */
      up: {
        x: to.x - half,
        y: to.y - half,
        opacity: 1,
        transition: {
          duration: FLIGHT.out.duration,
          ease: FLIGHT.ease,
          path: ARC_OUT,
          opacity: { duration: 0.2 },
        },
      },
      down: {
        x: (homePoint ?? from).x - half,
        y: (homePoint ?? from).y - half,
        opacity: 1,
        transition: {
          duration: FLIGHT.home.duration,
          ease: FLIGHT.ease,
          path: ARC_HOME,
        },
      },
    };
  }, [travel, target, homePoint]);

  /* The flight is driven imperatively, and it has to be. Handing Motion a
     target object only re-animates when the VALUES change — and every dial on
     the arc changes the transition, not the destination. Turning `strength`
     would have moved the face to exactly where it already was. Starting the
     leg by hand means any change to the path replays it. */
  const fly = useAnimationControls();
  /* Null while nothing is travelling. Without this, arriving in the nav bar
     (`home`) would read as "not falling" and fly the face straight back up. */
  const leg: "up" | "down" | null =
    phase === "idle" || phase === "home"
      ? null
      : phase === "falling"
        ? "down"
        : "up";

  useEffect(() => {
    if (!poses || !travel || chosen === null || !leg) return;
    let stale = false;

    /* Seed the ascent at the slot it is leaving. These motion values belong to
       the block, not to the traveller, so they OUTLIVE a flight — without this
       a second pick starts from wherever the last face came to rest, which is
       the previous slot, not this one. Seeding is also what makes a dial
       change replay the whole leg rather than re-aiming from mid-air.

       The descent is deliberately not seeded: it has to start from wherever
       the face actually is, so an interrupted ascent turns round instead of
       snapping to the centre first. */
    if (leg === "up") {
      x.set(travel.from.x - AVATAR / 2);
      y.set(travel.from.y - AVATAR / 2);
    }

    /* Spread, because `arc()` mutates the target it is handed. Passing the
       memoised pose straight in would let the first flight strip x and y out
       of it, and every flight after that would animate nothing. */
    fly.start({ ...poses[leg] }).then(() => {
      /* A leg that was interrupted resolves too, so the guard is what stops
         a replaced flight from reporting that it landed. */
      if (stale) return;
      if (leg === "up") {
        /* An unlocked profile has nothing to type: it pauses where it is and
           goes straight through. */
        if (!isLocked(profiles[chosen])) {
          grant(UNLOCKED_HOLD_MS);
          return;
        }
        setPhase((current) => (current === "rising" ? "pin" : current));
        return;
      }
      /* Landing in the nav bar is not a reset: the face stays, the Profile
         tab takes it over, and `chosen` is what tells the tab whose face to
         render. One commit either way, so the traveller unmounts in the same
         frame its destination becomes visible — no flash of two faces or
         none. */
      if (signedIn) {
        setPhase("home");
        callbacks.current.onSignIn?.(profiles[chosen], chosen);
        return;
      }
      setPhase("idle");
      setChosen(null);
      setTravel(null);
      setHomePoint(null);
      setPin("");
      setError(null);
      callbacks.current.onDismiss?.();
    });

    return () => {
      stale = true;
    };
    // `phase` is deliberately absent: rising → pin must not restart the leg,
    // and `signedIn` is read at landing time rather than subscribed to: it is
    // set in the same commit that starts the descent and must not restart it.
    // `profiles` is read at landing too — a consumer rebuilding the array
    // each render must not replay the flight.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poses, leg, chosen, fly, travel, x, y]);

  /* The row closes and reopens on exactly the clock of the leg in flight, so
     the gap and the face are one movement rather than two that happen to
     overlap. */
  const rowTravel: Transition = {
    duration: phase === "falling" ? FLIGHT.home.duration : FLIGHT.out.duration,
    ease: FLIGHT.ease,
  };

  /* One bar out, one bar in, over exactly the descent. Not a hand-off with a
     gap in it: the face is in the air for this whole duration, so both bars
     being half-visible under it is what makes the swap feel like one event
     rather than two. */
  const barFade: Transition = {
    duration: FLIGHT.home.duration,
    ease: FLIGHT.ease,
  };

  /* The pad arrives in the last fifth of the ascent — late enough that the
     face is already settling under it, early enough that the two read as one
     movement rather than a screen that loads after an animation. */
  const padIn: Transition = {
    type: "spring",
    visualDuration: FLIGHT.pad.visualDuration,
    bounce: FLIGHT.pad.bounce,
    delay: FLIGHT.pad.enterAt * FLIGHT.out.duration,
  };

  /* And leaves in the first fifth of the descent, with no delay at all: the
     moment the face starts for home the pad is already going, so the journey
     back happens over an empty stage. A pad still fading at the halfway point
     would be a thing the face has to fly past. */
  const padOut: Transition = {
    duration: FLIGHT.pad.exitBy * FLIGHT.home.duration,
    ease: "easeIn",
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={stageRef}
        onKeyDown={(event) => {
          /* Escape backs out of the gate. Past it there is nothing to back
             out of — signing in is the end of the flow. */
          if (event.key !== "Escape") return;
          dismiss();
        }}
        /* A white screen. Everything on it is therefore INK on paper: the
           faces keep their colour and carry the whole palette, and every
           other element is a value of near-black. The top ~50px is left
           clear for whatever status bar the host draws over it. */
        className={`relative h-full w-full overflow-hidden bg-white text-[#0b0b0b] ${className ?? ""}`}
      >
        {/* ── The glow ──
            The face's own colour, thrown onto the screen behind it. It is
            what stops the middle of the screen from being an empty white
            field while the pad is open, and it costs one static gradient —
            no blur filter, so nothing is recomputed per frame. */}
        {chosen !== null && target && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{
              top: target.to.y,
              left: "50%",
              width: 440,
              height: 440,
              x: "-50%",
              y: "-50%",
              background: `radial-gradient(closest-side, ${groundOf(profiles[chosen], chosen)}24, transparent 72%)`,
            }}
            animate={{ opacity: grown ? 1 : 0 }}
            transition={barFade}
          />
        )}

        {/* ── Heading ── */}
        <motion.h3
          animate={{ opacity: gating ? 0 : 1, y: gating ? -8 : 0 }}
          transition={gating ? LEAVE : { ...PAD, delay: 0.12 }}
          className="absolute inset-x-0 top-[54px] text-center text-[22px] font-bold tracking-tight"
        >
          {heading}
        </motion.h3>

        {/* ── The row ──
            The chosen face LEAVES the row rather than fading in place, and
            popLayout is what makes that read correctly: the exiting item is
            pulled out of flow on frame one, so the rest close the gap while
            the traveller is still climbing instead of after it.

            Coming home it is re-inserted the moment the descent STARTS, not
            when it ends — held at opacity 0, so all it does is take its slot
            back and push the others apart. The face lands into a space that
            has already been made for it, which is the difference between the
            row reacting to the landing and the row being part of it. */}
        <motion.ul
          animate={{ opacity: signedIn ? 0 : 1 }}
          transition={barFade}
          style={{ pointerEvents: signedIn ? "none" : "auto" }}
          aria-hidden={signedIn}
          className="absolute inset-x-0 bottom-10 flex items-start justify-center gap-3"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {profiles.map((face, index) => {
              /* Away means the traveller is carrying it. It is only absent on
                 the way out and while parked — on the way home it is back in
                 the list, invisible, holding its rectangle. */
              if (index === chosen && !(phase === "falling" && !signedIn))
                return null;
              const returning = index === chosen && !signedIn;

              return (
                <motion.li
                  key={face.name}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: returning ? 0 : 1 }}
                  /* No exit animation at all. The traveller takes over on the
                     same frame, and two copies of one face crossfading past
                     each other is the one thing that would give the trick
                     away. */
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{
                    layout: rowTravel,
                    opacity: { duration: 0 },
                  }}
                >
                  <motion.button
                    ref={(node) => {
                      slots.current[index] = node;
                    }}
                    type="button"
                    onClick={() => pick(index)}
                    disabled={gating}
                    aria-label={
                      isLocked(face)
                        ? `${face.name}. Locked profile, enter a PIN.`
                        : face.name
                    }
                    whileHover={gating ? undefined : { scale: 1.06 }}
                    whileTap={gating ? undefined : { scale: 0.97 }}
                    style={{ borderRadius: RADIUS + RING_INSET }}
                    className="group flex cursor-pointer flex-col items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-[#0b0b0b] focus-visible:ring-offset-4 focus-visible:ring-offset-white disabled:pointer-events-none"
                  >
                    <Avatar
                      profile={face}
                      index={index}
                      size={AVATAR}
                      elementRef={(node) => {
                        faceSlots.current[index] = node;
                      }}
                    />
                    <span className="text-[12px] font-medium text-[#0b0b0b]/40 transition-colors duration-150 ease-out group-hover:text-[#0b0b0b]">
                      {face.name}
                    </span>
                  </motion.button>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>

        {/* ── The greeting ──
            Its own section, not something the pad turns into. It is tied to
            `signedIn`, which is the same flag the two bars read, and it runs
            on the same `barFade` — so the roster leaving, the tab bar
            arriving and this appearing are one event with one clock rather
            than three things that were each given the same number.

            It takes the place the face is vacating: anchored to the centre
            the face has just left, so the greeting arrives where you were
            already looking. */}
        <AnimatePresence>
          {signedIn && target && (
            <motion.div
              key="greeting"
              className="absolute inset-x-0 flex -translate-y-1/2 flex-col items-center gap-1.5 text-center"
              style={{ top: target.to.y }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: barFade }}
              transition={barFade}
            >
              <p className="text-[22px] font-bold tracking-tight">
                {welcome.title}
              </p>
              {welcome.subtitle && (
                <p className="text-[15px] font-medium text-[#0b0b0b]/45">
                  {welcome.subtitle}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── The bar on the other side ──
            Mounted from the very start at opacity 0, never conditionally
            rendered. Two reasons: the crossfade is a true dissolve rather
            than one bar waiting for the other to leave, and the Profile tab
            has a rectangle to measure BEFORE it is visible — the descent is
            aimed at it in the same commit that starts the fade, and you
            cannot fly something to an element that is not in the document. */}
        <motion.nav
          aria-label="Profile navigation"
          aria-hidden={!signedIn}
          animate={{ opacity: signedIn ? 1 : 0 }}
          transition={barFade}
          style={{ pointerEvents: signedIn ? "auto" : "none" }}
          className="absolute inset-x-0 bottom-10 flex items-start justify-center gap-8"
        >
          <button
            type="button"
            /* The tab you are already on. Activating it is a no-op by
               design — the same as pressing the current tab anywhere else —
               which is why it announces a state and not an action. */
            aria-current="page"
            aria-label={
              chosen === null
                ? profileTabLabel
                : `${profileTabLabel}, signed in as ${profiles[chosen].name}`
            }
            style={{ borderRadius: RADIUS + RING_INSET }}
            className="group flex cursor-pointer flex-col items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-[#0b0b0b] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
          >
            {/* The landing pad. Fixed at AVATAR so it holds the rectangle
                whether or not there is a face in it yet. */}
            <span
              ref={profileSlot}
              className="grid place-items-center"
              style={{ width: AVATAR, height: AVATAR }}
            >
              {/* Instant, not a fade: the traveller unmounts in the same
                  commit this appears, and a crossfade between two copies of
                  one face is the one thing that would give it away. */}
              <motion.span
                animate={{ opacity: phase === "home" ? 1 : 0 }}
                transition={{ duration: 0 }}
              >
                {chosen !== null && (
                  <Avatar
                    profile={profiles[chosen]}
                    index={chosen}
                    size={AVATAR}
                  />
                )}
              </motion.span>
            </span>
            <span className="text-[12px] font-medium text-[#0b0b0b] transition-colors duration-150 ease-out">
              {profileTabLabel}
            </span>
          </button>

          {tabs.map(({ name, icon, onClick }) => (
            <button
              key={name}
              type="button"
              onClick={onClick}
              style={{ borderRadius: RADIUS + RING_INSET }}
              className="group flex cursor-pointer flex-col items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-[#0b0b0b] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
            >
              <span
                className="grid place-items-center bg-[#0b0b0b]/[0.055] transition-colors duration-150 ease-out group-hover:bg-[#0b0b0b]/[0.1]"
                style={{
                  width: AVATAR,
                  height: AVATAR,
                  borderRadius: RADIUS,
                }}
              >
                <HugeiconsIcon icon={icon} size={22} strokeWidth={2} />
              </span>
              <span className="text-[12px] font-medium text-[#0b0b0b]/40 transition-colors duration-150 ease-out group-hover:text-[#0b0b0b]">
                {name}
              </span>
            </button>
          ))}
        </motion.nav>

        {/* ── The traveller ──
            One node from the moment you click to the moment it is home. */}
        <AnimatePresence>
          {chosen !== null && travel && target && poses && phase !== "home" && (
            <motion.div
              key="traveller"
              className="pointer-events-none absolute top-0 left-0 origin-center"
              /* x and y are OUR motion values, not Motion's internal ones,
                   so anything that wants to know where the face is on a given
                   frame can read them — the path drawn is the path flown. */
              style={{ width: AVATAR, height: AVATAR, x, y }}
              initial={{ opacity: reduced ? 0 : 1 }}
              animate={fly}
            >
              {/* THREE nodes, three jobs, and the scales multiply.
                      x/y  — the journey, owned by arc()
                      dip  — the tap: a quick squash and release
                      grow — the size, on a bouncy spring

                    They are separate because they are different physics. One
                    scale carrying both would have to blend a fixed-length dip
                    into an open-ended spring, and whichever won, the squash
                    would stop being its own beat. Multiplied, the dip happens
                    underneath the climb without either knowing about the
                    other.

                    (The size was split off the journey for a different
                    reason: it used to ride in the same target as x and y,
                    which arc() takes ownership of and mutates.) */}
              <motion.div
                className="h-full w-full"
                initial={{ scale: 1 }}
                /* Down and back. The release is not a separate beat — by
                     the time it returns to 1 the spring below has taken over,
                     so what you see is a press that turns into a launch. */
                animate={{
                  scale: grown ? [1, FLIGHT.anticipate.scale, 1] : 1,
                }}
                transition={{
                  duration: FLIGHT.anticipate.duration,
                  times: [0, 0.3, 1],
                  ease: ["easeOut", "easeOut"],
                }}
              >
                <motion.div
                  className="h-full w-full"
                  initial={{ scale: 1 }}
                  animate={{ scale: grown ? FLIGHT.growth : 1 }}
                  transition={{
                    type: "spring",
                    ...(grown ? FLIGHT.grow : FLIGHT.shrink),
                    /* Long enough for the dip to be its own beat. Without
                         it the rise starts on the same frame as the squash
                         and cancels it. */
                    delay: grown ? FLIGHT.anticipate.handoff : 0,
                  }}
                >
                  <Avatar
                    profile={profiles[chosen]}
                    index={chosen}
                    size={AVATAR}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── The pad ──
            Scene 2. It grows out of the face rather than fading up into
            place: transform-origin is the TOP EDGE, so it unfolds downward
            from directly under the avatar and the two read as one object.
            Origin anywhere else and the pad appears to arrive from somewhere
            the face is not. */}
        <AnimatePresence>
          {padOpen && chosen !== null && travel && target && (
            <motion.div
              key="pad"
              animate={shake}
              className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-4"
              style={{ top: target.padTop }}
            >
              <motion.div
                style={{ transformOrigin: "top center" }}
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: 1 }}
                /* Exit fires the instant `falling` unmounts this, which is
                   the same instant the descent starts — the pad and the face
                   leave together, the pad just finishes first. */
                exit={{ opacity: 0, scale: 0.88, transition: padOut }}
                transition={padIn}
                className="flex flex-col items-center gap-4"
              >
                <p
                  id="gate-pin-label"
                  className="text-[15px] font-medium text-[#0b0b0b]/50"
                >
                  {pinLabel(profiles[chosen].name)}
                </p>

                {/* FOUR BOXES, ONE INPUT. Four inputs is the usual answer and
                    it is the wrong one: paste breaks, backspace needs manual
                    focus juggling, mobile keyboards fight the focus moves, and
                    a screen reader is handed four unlabelled fields instead of
                    one. The boxes below are pure decoration over this. */}
                <div className="relative">
                  <input
                    ref={input}
                    value={pin}
                    onChange={(event) => onPin(event.target.value)}
                    disabled={locked}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={pinLength}
                    /* The VISIBLE label, not a duplicate of it in an
                       aria-label — the accessible name has to contain the
                       text a sighted user is reading. */
                    aria-labelledby="gate-pin-label"
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? "gate-pin-error" : undefined}
                    onFocus={(event) =>
                      setShowFocus(
                        event.currentTarget.matches(":focus-visible"),
                      )
                    }
                    onBlur={() => setShowFocus(false)}
                    className="absolute inset-0 z-10 w-full cursor-pointer text-transparent caret-transparent opacity-0 outline-none"
                  />

                  {/* Decoration over the real field. Hidden from assistive
                      tech so the value is announced once, by the input,
                      rather than as four loose digits. It holds nothing
                      focusable, which is what makes aria-hidden safe here. */}
                  <div aria-hidden="true" className="flex gap-3 p-1">
                    {Array.from({ length: pinLength }, (_, slot) => {
                      const digit = pin[slot];
                      const active = pin.length === slot && !locked;

                      return (
                        <div
                          key={slot}
                          /* An outline, not a Tailwind ring: rings are
                             box-shadows, and box-shadows are dropped entirely
                             in forced-colors mode. 2px solid at full ink is
                             the minimum perimeter the guidelines ask for, and
                             it only ever sits on the box the next keypress
                             lands in. */
                          style={
                            showFocus && active
                              ? {
                                  outline: "2px solid #0b0b0b",
                                  outlineOffset: 2,
                                }
                              : undefined
                          }
                          /* The verdict lands ON the digits, where you were
                             looking: green while the face is being let
                             through, red when it is not. Both are the same
                             tint-and-ink treatment, so a right answer and a
                             wrong one read as two values of one thing. */
                          className={[
                            "grid h-[62px] w-[52px] place-items-center rounded-xl text-[22px] font-bold tabular-nums transition-colors duration-150 ease-out",
                            phase === "granted"
                              ? "bg-[#4cc85c]/15 text-[#2f9a3e]"
                              : error
                                ? "bg-[#c0392b]/10 text-[#c0392b]"
                                : active
                                  ? "bg-[#0b0b0b]/[0.1] text-[#0b0b0b]"
                                  : "bg-[#0b0b0b]/[0.055] text-[#0b0b0b]",
                          ].join(" ")}
                        >
                          <AnimatePresence mode="popLayout" initial={false}>
                            {digit ? (
                              <motion.span
                                key={`d-${slot}`}
                                initial={{ opacity: 0, scale: 0.4, y: 6 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{
                                  opacity: 0,
                                  scale: 0.6,
                                  transition: LEAVE,
                                }}
                                transition={DIGIT}
                              >
                                {digit}
                              </motion.span>
                            ) : active ? (
                              /* A caret, not a placeholder: it says where the
                                 next key goes without pretending to be one. */
                              <motion.span
                                key={`c-${slot}`}
                                className="block h-6 w-[2px] rounded-full bg-[#0b0b0b]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [1, 1, 0, 0, 1] }}
                                exit={{ opacity: 0, transition: LEAVE }}
                                transition={{
                                  duration: 1.1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                            ) : null}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* A STABLE region, already in the document before its text
                    changes — a live region created at the same moment as its
                    content is announced inconsistently. Polite, because the
                    message is not urgent enough to interrupt. */}
                <div aria-live="polite" className="relative h-5">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={error ?? phase}
                      id={error ? "gate-pin-error" : undefined}
                      className={`absolute inset-x-0 flex items-center justify-center gap-1.5 text-[12px] whitespace-nowrap ${
                        error
                          ? "font-medium text-[#c0392b]"
                          : "text-[#0b0b0b]/35"
                      }`}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4, transition: LEAVE }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                      {/* Errors only. "Checking…" used to live here and said
                          nothing the interface was not already saying — the
                          boxes are full and the field has gone disabled. The
                          PIN hint is a note ABOUT the demo, not product copy,
                          so it lives in the margin below instead. */}
                      {/* The glyph is decoration on a message the live region
                          already reads out; aria-hidden keeps it from being
                          announced as a stray "alert circle". */}
                      {error && (
                        <HugeiconsIcon
                          icon={AlertCircleIcon}
                          size={14}
                          strokeWidth={2.2}
                          aria-hidden="true"
                          className="shrink-0"
                        />
                      )}
                      {error ?? ""}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* ── The hint ──
                    Drawn as a margin note rather than set as UI copy: a
                    dashed leader and a monospaced label read as something
                    written ON the mock, which is what it is. It hangs off the
                    pad's own box, so it arrives and leaves with the pad and
                    needs no timing of its own. */}
                {showHint && profiles[chosen].pin !== undefined && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 176 112"
                    /* Inline, not a Tailwind arbitrary value: `calc()` needs
                     whitespace around its operator, and
                     `top-[calc(100%-6px)]` is invalid CSS that is silently
                     dropped. The 56px lifts the box so the arrowhead lands
                     just under the row of boxes rather than 50px adrift below
                     the status line. */
                    style={{ top: "calc(100% - 56px)", right: -44 }}
                    className="pointer-events-none absolute h-28 w-44 overflow-visible text-[#0b0b0b]/40"
                  >
                    <defs>
                      <marker
                        id="gate-hint-arrow"
                        markerHeight="8"
                        markerWidth="8"
                        orient="auto"
                        refX="6"
                        refY="4"
                      >
                        <path
                          d="M1 1L7 4L1 7"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </marker>
                    </defs>
                    {/* Runs from the label UP to the boxes — the reverse of the
                      usual leader, because the thing being pointed at is
                      above the note. */}
                    <path
                      d="M74 84C48 76 22 58 16 22"
                      fill="none"
                      markerEnd="url(#gate-hint-arrow)"
                      stroke="currentColor"
                      strokeDasharray="3 4"
                      strokeLinecap="round"
                      strokeWidth="1.5"
                    />
                    <text
                      className="font-mono text-[11px]"
                      fill="currentColor"
                      x="46"
                      y="100"
                    >
                      PIN · {profiles[chosen].pin}
                    </text>
                  </svg>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Escape is the mouse-free way out, and this is how anyone finds out
            it exists. */}
        <AnimatePresence>
          {gating && !locked && phase !== "home" && (
            <motion.button
              key="back"
              type="button"
              onClick={dismiss}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: LEAVE }}
              transition={{ ...PAD, delay: 0.24 }}
              className="absolute top-[50px] left-4 cursor-pointer rounded-full px-3 py-1.5 text-[12px] font-medium text-[#0b0b0b]/45 transition-colors duration-150 ease-out hover:text-[#0b0b0b] focus-visible:ring-2 focus-visible:ring-[#0b0b0b] focus-visible:outline-none"
            >
              {backLabel}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
