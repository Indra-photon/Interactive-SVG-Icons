// Static by design — no "use client", no hooks, no motion. This renders on the
// server and ships zero JS, which is the whole point of the designs catalog.
// The segment control is drawn in a fixed state rather than wired to a handler:
// a still picture of a chosen destination, not a working toggle.
//
// HugeiconsIcon is safe here despite the above: it is a plain forwardRef that
// maps icon data to <path> elements, with no "use client" and no hooks, so it
// renders on the server like everything else and adds nothing to the bundle.

import { Airplane02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface FlightEndpoint {
  /** Airport code, the largest type on the card. */
  code: string;
  /** Departure or arrival time, already formatted for the traveller's locale. */
  time: string;
  /** City the code belongs to. */
  city: string;
}

interface FlightCardProps {
  /** Background photograph. Pass "" to fall through to the painted sky. */
  image?: string;
  from?: FlightEndpoint;
  to?: FlightEndpoint;
  /**
   * Time in the air, shown under the route mark. Written, not computed: the two
   * endpoint times are display strings in unknown timezones, so there is
   * nothing here to subtract them from.
   */
  duration?: string;
  /** The two destinations in the segment control. */
  options?: [string, string];
  /** Which of the two reads as chosen. */
  activeOption?: 0 | 1;
  className?: string;
}

/**
 * Default photograph: a San Francisco bridge, from Pexels.
 *
 * The `?auto=compress&cs=tinysrgb&w=1200` suffix is not decoration — the raw
 * original is a 4.0MB JPEG and the transformed one is 287KB for the same
 * on-screen result, since nothing here is ever rendered above ~1200px wide.
 * Keep the query string if you swap the photo for another Pexels URL.
 *
 * A remote default is a deliberate trade: the card renders as a finished poster
 * out of the box, at the cost of one third-party request and a URL that is
 * outside our control. Pass your own `image` to own it — that is the prop's
 * whole purpose, and any project shipping this seriously should.
 */
const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/15883139/pexels-photo-15883139.jpeg?auto=compress&cs=tinysrgb&w=1200";

// The defaults describe the flight the photograph depicts. A San Francisco
// bridge under a "New York" headline is a card that contradicts itself, so the
// route, the headline and the chosen segment all move together.
const DEFAULT_FROM: FlightEndpoint = {
  code: "LHR",
  time: "10:30 AM",
  city: "London",
};

const DEFAULT_TO: FlightEndpoint = {
  code: "SFO",
  time: "1:20 PM",
  city: "San Francisco",
};

/**
 * Film grain, laid over the whole card.
 *
 * Inline feTurbulence rather than a texture file for the reason everything else
 * here is inline: the registry ships one .tsx, so an asset reference would be a
 * broken URL in the consumer's project. Same technique the feature-ai-01
 * section uses for its noise.
 *
 * Two details that separate this from noise-for-its-own-sake:
 *
 *  · feColorMatrix desaturates the turbulence to pure luminance. Raw
 *    feTurbulence is *colour* noise — red, green and blue channels each get
 *    their own field — and under `overlay` that lands on a photograph as
 *    chromatic speckle rather than grain. Flattening it to grey is what makes
 *    it read as film.
 *  · stitchTiles keeps the 180px tile seamless where it repeats, so the card
 *    doesn't show a grid of edges at large sizes.
 *
 * The tile is sized in px, not cqw, on purpose: grain is a property of the
 * emulsion, not of the subject, so it should stay the same size on screen no
 * matter how large the card is drawn. Scaling it would turn grain into gravel.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)'/%3E%3C/svg%3E\")";

// ─── Eased gradients ──────────────────────────────────────────────────────────
//
// A CSS gradient interpolates its stops linearly, and the eye does not read
// that as linear. The tell is always the transparent end: alpha descends at a
// constant rate and then simply stops, so what should dissolve instead reads as
// a soft band with a definite edge. Every fade on this card — both scrims and
// all four masks — was showing that edge.
//
// The fix is Andreas Larsen's (larsenwork.com/easing-gradients): approximate an
// easing curve by emitting a dozen intermediate stops along it. His PostCSS
// plugin does this at build time; that is not available to us, because this
// file has to install into a stranger's project as one self-contained .tsx with
// no pipeline of its own. So the stops are generated here instead — at module
// scope, so each gradient is computed once into a constant string and costs
// nothing per render.

// ─── Radius ───────────────────────────────────────────────────────────────────
//
// Two systems, deliberately not connected.
//
// The card is a frame: near-square, its own decision, nothing derived from it
// and nothing deriving from it. The segment control is a component sitting on
// that frame, and it carries its own concentric pair. This is the same
// two-language reading as the route track's `rounded-full` dots — round marks
// on a square print — rather than a nesting chain, so the control being softer
// than the frame is the contrast, not a mismatch.
//
// What the split buys: the card's shape and the control's shape can each be
// tuned without the other moving, which is exactly what a chain prevents.
// What it costs: nothing keeps them in proportion automatically, so if the card
// is ever taken somewhere genuinely round, the control has to be revisited by
// hand.
//
// These are inline styles rather than Tailwind classes on purpose. Tailwind
// scans source text for complete class names, so `rounded-[${R.card}]` produces
// no CSS at all; wiring values from the top means they cannot live in a class.
//
// The blur stack is absent from both systems: it uses `border-radius: inherit`
// and takes the card's computed corners directly, because it *is* the card's
// shape rather than something sitting on it.

/** The frame. Independent — nothing below is computed from this. */
const CARD_RADIUS = "0.5cqw";

/** Padding inside the segment control, and the inset the track derives across. */
const CONTROL_PAD = "0.7cqw";

/**
 * The chosen chip, and the root of the control's own system.
 *
 * The chip is the number worth choosing by eye — it is the filled shape you
 * actually read — so it is the input, and the track is derived outward from it
 * rather than the other way round.
 */
const CHIP_RADIUS = "1.1cqw";

const RADIUS = {
  card: CARD_RADIUS,
  /**
   * The track, concentric *outward* from the chip: outer = inner + padding, so
   * the two curves stay parallel instead of one tightening inside the other.
   * Change CHIP_RADIUS and this follows on its own.
   */
  control: `calc(${CHIP_RADIUS} + ${CONTROL_PAD})`,
  segment: CHIP_RADIUS,
} as const;

/** Cubic-bezier control points, in CSS order: x1, y1, x2, y2. */
type Bezier = readonly [number, number, number, number];

/** CSS `ease-in-out`. Gentle at both ends, which is what kills the edge. */
const EASE_IN_OUT: Bezier = [0.42, 0, 0.58, 1];

/**
 * CSS `ease-out`. No shoulder at the start, long tail at the end — right for a
 * glow, wrong for a scrim. The two are the only curves this card needs; adding
 * more would be tuning for its own sake.
 */
const EASE_OUT: Bezier = [0, 0, 0.58, 1];

/** Larsen's editor defaults to around 15; below ~8 the curve reads as facets. */
const STOP_COUNT = 12;

/**
 * Samples `curve` and returns colour-stops spanning `from`% to `to`%.
 *
 * The curve is walked *parametrically* rather than solved for y at evenly
 * spaced x. A gradient stop list is nothing but (colour, position) pairs, so
 * both coordinates of a sample can be used directly — x becomes the position, y
 * becomes the value. That sidesteps the Newton iteration a cubic-bezier easing
 * implementation normally needs to invert x, and it puts the stops closest
 * together exactly where the curve bends hardest, which is where they matter.
 */
function easedStops(
  curve: Bezier,
  from: number,
  to: number,
  color: (value: number) => string,
) {
  const [x1, y1, x2, y2] = curve;
  const stops: string[] = [];

  for (let i = 0; i <= STOP_COUNT; i++) {
    const s = i / STOP_COUNT;
    const u = 1 - s;
    // Bezier from (0,0) to (1,1): the two implicit anchors drop out of the
    // usual four-term form, leaving only the control-point terms and s³.
    const x = 3 * u * u * s * x1 + 3 * u * s * s * x2 + s ** 3;
    const y = 3 * u * u * s * y1 + 3 * u * s * s * y2 + s ** 3;
    stops.push(`${color(y)} ${(from + (to - from) * x).toFixed(2)}%`);
  }

  return stops;
}

// ─── Painted sky ──────────────────────────────────────────────────────────────
//
// The base layer under the photograph — and the whole artwork when `image` is
// explicitly cleared.
//
// Three stacked gradients rather than one: a linear for the vertical run from
// dusk blue down through haze to warm cloud, then two radials to pool the light
// low and off-centre the way a sun below the horizon actually lights cloud. A
// single linear reads as a colour ramp; the radials are what make it read as
// weather.

/** The vertical run, as OKLCH anchors rather than a finished gradient string. */
const SKY_ANCHORS = [
  { l: 0.418, c: 0.052, h: 235.7, at: 0 },
  { l: 0.505, c: 0.053, h: 232.9, at: 42 },
  { l: 0.621, c: 0.018, h: 172.3, at: 70 },
  { l: 0.774, c: 0.055, h: 87.9, at: 100 },
];

/** Intermediate stops emitted between each pair of anchors. */
const SKY_STEPS = 5;

/**
 * The sky's vertical run, interpolated between the anchors *in OKLCH* rather
 * than handed to the browser as four stops.
 *
 * This is the only gradient on the card that crosses hue — 148° from dusk blue
 * to lit cloud — and a browser interpolating that in sRGB drags the transit
 * through desaturated mud around the midpoint. `linear-gradient(180deg in
 * oklab, …)` would fix it in one token, but an engine that doesn't understand
 * the interpolation keyword discards the entire gradient rather than degrading,
 * and this file installs into projects whose browser matrix we don't know.
 * Sampling the curve ourselves gets the same result with no such cliff — and it
 * is what the rest of this file already does for easing.
 */
const SKY_LINEAR = `linear-gradient(180deg, ${SKY_ANCHORS.flatMap((a, i) => {
  const b = SKY_ANCHORS[i + 1];
  if (!b) return [`oklch(${a.l} ${a.c} ${a.h}) ${a.at}%`];

  return Array.from({ length: SKY_STEPS }, (_, k) => {
    const t = k / SKY_STEPS;
    const mix = (from: number, to: number) => from + (to - from) * t;
    return (
      `oklch(${mix(a.l, b.l).toFixed(3)} ${mix(a.c, b.c).toFixed(3)} ` +
      `${mix(a.h, b.h).toFixed(1)}) ${mix(a.at, b.at).toFixed(1)}%`
    );
  });
}).join(", ")})`;

/**
 * The two light pools, eased.
 *
 * `ease-out` rather than the `ease-in-out` the scrims use: a pool of light has
 * no shoulder. It is brightest at its centre and decays with a long tail, so a
 * curve that eases *into* its start would give it a defined edge it should not
 * have. These two were the last linear ramps left on the card, and the longer
 * of them runs 90% of its width — the most banding-prone gradient here was the
 * one still doing it the naive way.
 */
const SKY_GLOW = `radial-gradient(90% 55% at 22% 88%, ${easedStops(
  EASE_OUT,
  0,
  60,
  (v) => `oklch(0.918 0.051 84.5 / ${(0.95 * (1 - v)).toFixed(3)})`,
).join(", ")})`;

const SKY_POOL = `radial-gradient(120% 75% at 55% 104%, oklch(0.879 0.062 86.4) 0%, ${easedStops(
  EASE_OUT,
  30,
  66,
  (v) => `oklch(0.795 0.058 85.5 / ${(1 - v).toFixed(3)})`,
).join(", ")})`;

const PAINTED_SKY = [SKY_GLOW, SKY_POOL, SKY_LINEAR].join(", ");

/**
 * A mask that is fully transparent at `from`% down the element and fully opaque
 * by `to`%, measured from its top edge.
 *
 * This is the only way to fade a backdrop-filter. The filter itself has one
 * radius for the whole element — you cannot ramp it — so what ramps instead is
 * how much of the filtered layer is composited, and a mask is what does that.
 * Which means the easing matters twice over here: a banded mask is a banded
 * blur, and three of these are stacked.
 */
const rampUp = (from: number, to: number) =>
  `linear-gradient(to bottom, oklch(0 0 0 / 0) 0%, ${easedStops(
    EASE_IN_OUT,
    from,
    to,
    (v) => `oklch(0 0 0 / ${v.toFixed(3)})`,
  ).join(", ")}, oklch(0 0 0) 100%)`;

/**
 * A black scrim at `peak` alpha where the gradient starts, easing to nothing at
 * its end. The old form needed a hand-placed midpoint (`via-black/28`) to fake
 * the curve; the curve makes it unnecessary.
 */
const scrim = (direction: string, peak: number) =>
  `linear-gradient(${direction}, ${easedStops(
    EASE_IN_OUT,
    0,
    100,
    (v) => `oklch(0 0 0 / ${(peak * (1 - v)).toFixed(3)})`,
  ).join(", ")})`;

const TOP_SCRIM = scrim("to bottom", 0.35);
const BOTTOM_SCRIM = scrim("to top", 0.6);

/**
 * The progressive blur stack, sharp at the card's midline and deepening to the
 * bottom edge.
 *
 * Radii are small because they accumulate: each layer's backdrop already
 * contains the output of the ones before it, so the effective blur at the
 * bottom is the whole column, not the last entry. Set any one of these to what
 * you want the *final* blur to be and the lower half turns to soup.
 */
/**
 * The dashes either side of the plane. Sized in cqw like everything else, so
 * the dash rhythm stays constant relative to the card rather than turning into
 * a solid rule at thumbnail size.
 */
const TRACK_DASH =
  "repeating-linear-gradient(to right, oklch(1 0 0 / 0.6) 0 0.7cqw, oklch(1 0 0 / 0) 0.7cqw 2cqw)";

const BLUR_LAYERS = [
  { blur: "0.5cqw", from: 0, to: 32 },
  { blur: "0.9cqw", from: 20, to: 58 },
  { blur: "1.6cqw", from: 44, to: 86 },
];

export function FlightCard({
  image = DEFAULT_IMAGE,
  from = DEFAULT_FROM,
  to = DEFAULT_TO,
  duration = "10h 50m",
  options = ["San Francisco", "New York"],
  activeOption = 0,
  className,
}: FlightCardProps) {
  return (
    // @container plus cqw units throughout: every measurement on this card is a
    // fraction of its own width, so it holds its proportions from a 320px
    // masonry column up to a full-width hero without a single breakpoint. Type
    // sized in cqw is the part that makes it work — a card that scales its box
    // but not its type stops looking like the same card.
    <div
      className={[
        "@container relative aspect-[3/4] w-full overflow-hidden",
        // Radius comes from RADIUS.card via the style prop below. backdrop-filter
        // escapes an ancestor's overflow-hidden clip in every current engine, so
        // a square-cornered blur layer would paint over the card's rounded
        // corners with whatever sits *behind* the card — two black wedges on a
        // dark page. The blur layers round themselves with `inherit`; the clip
        // will not do it for them.
        "bg-[oklch(0.418_0.052_235.7)] shadow-[0_2cqw_5cqw_-1cqw_oklch(0_0_0_/_0.35)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ borderRadius: RADIUS.card }}
    >
      {/* ── Artwork ──
          The painted sky is always rendered, underneath rather than instead of
          the photograph. It costs nothing (three gradients, no request) and it
          is what the card shows while a remote image is still in flight — the
          alternative is a grey box resolving into a photo, which is the most
          obvious way for a poster to look broken on first paint. It is also the
          fallback if the URL ever dies. */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: PAINTED_SKY }}
      />
      {image && (
        // Plain <img>, not next/image: the registry installs this file into
        // projects that may not be Next, and a framework import would be a hard
        // failure there rather than a missing optimisation.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* ── Scrims ──
          The bottom one is load-bearing: it carries every line of type on the
          card, so it runs to 58% and leans darker than it looks like it needs
          to, because the photograph is a prop and guarantees nothing.

          The top one carries no text since the title came off. It stays as a
          vignette — it weights the frame and stops a bright sky from bleaching
          the top edge — but it is now composition, not legibility, so it is the
          first thing to delete if the top reads too heavy.

          Both are eased rather than written with Tailwind's from/via/to, which
          is a three-stop hand-approximation of a curve — `via-black/28` existed
          only to bend a straight line, and the real curve retires it. */}
      <div
        className="absolute inset-x-0 top-0 h-[26%]"
        style={{ backgroundImage: TOP_SCRIM }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[58%]"
        style={{ backgroundImage: BOTTOM_SCRIM }}
        aria-hidden="true"
      />

      {/* Grain sits *above* the scrims, not between them and the photograph.
          Two reasons. It grains the whole card as one surface, the way an
          emulsion would, instead of leaving the scrimmed third conspicuously
          clean. And a long black-to-transparent gradient is exactly the thing
          8-bit colour renders as visible bands — dithering it with noise is the
          standard fix, so the grain earns its place twice.

          It stays below the content, so the glass pane's backdrop-filter
          samples it and smooths it away under the type. Grain that survived
          the blur would read as dirt on the glass rather than as film. */}
      <div
        className="absolute inset-0 opacity-[0.26] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
        aria-hidden="true"
      />

      {/* ── Progressive blur ──
          The blur is its own stack of empty layers, separate from the text,
          because the fade is done with a mask and a mask applied to the pane
          would fade the type along with it.

          Each layer is masked to ramp in slightly lower than the one before, so
          what you get is not one blurred rectangle with a soft edge but a blur
          that genuinely deepens as it descends — layer n blurs the composite
          that layers 1..n-1 already produced, so the radii compound downward.
          Three layers is where the ramp stops reading as steps. */}
      {BLUR_LAYERS.map(({ blur, from, to }) => (
        <div
          key={blur}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 top-1/2 rounded-b-[inherit]"
          style={{
            backdropFilter: `blur(${blur}) saturate(1.15)`,
            WebkitBackdropFilter: `blur(${blur}) saturate(1.15)`,
            maskImage: rampUp(from, to),
            WebkitMaskImage: rampUp(from, to),
          }}
        />
      ))}

      {/* The tint, on the same ramp. It is what makes the bottom read as a pane
          of glass rather than as a soft photograph, but it has to arrive with
          the blur or it draws its own edge across the card. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 top-1/2 rounded-b-[inherit]"
        style={{
          // Dark, not the white it started as. The pane carries four rows of
          // white type over a photograph the component does not choose, and a
          // white tint lightens exactly the surface that type has to stand on:
          // measured, it dropped the airport codes to Lc 55 on a bright sky.
          // Frosted dark glass is a real material and it is the one that makes
          // every pair on this pane pass.
          backgroundColor: "oklch(0 0 0 / 0.22)",
          // 16–62 rather than 4–46. The blur layers run 0–32, 20–58 and 44–86,
          // so a tint that finished at 46% announced the pane as glass while
          // the deepest blur was still ramping — tint over a sharp photograph
          // in the upper third. This lands it with the middle layer.
          maskImage: rampUp(16, 62),
          WebkitMaskImage: rampUp(16, 62),
        }}
      />

      {/* ── Content ──
          Unmasked and unblurred, sitting over the stack. Positioned rather than
          laid out in flow: `top-1/2 bottom-0 inset-x-0` is the brief — full
          bleed to the card's edges, rising to the exact half. A flow element
          with negative margins could fake the bleed, but its height would be
          whatever the type happened to measure, and the half-and-half split is
          the composition here, not a side effect of it. */}
      <div className="absolute inset-x-0 bottom-0 top-1/2 flex flex-col justify-end gap-[6cqw] px-[6cqw] pb-[6.7cqw] text-white">
        <div className="flex items-end justify-between gap-[2cqw]">
          <div className="min-w-0">
            <p className="text-[7.4cqw] font-semibold leading-none tracking-tight">
              {from.code}
            </p>
            <p className="mt-[1.1cqw] text-[max(12px,3.4cqw)] leading-tight text-white/85">
              {from.city}
            </p>
            <p className="mt-[3cqw] text-[4.3cqw] font-medium leading-none tabular-nums">
              {from.time}
            </p>
          </div>

          {/* ── Route track ──
              Sits low against the codes' baseline rather than centred in the
              row — the mark belongs under the flight, not beside it.

              The plane alone was a third object floating between two columns
              with nothing tying it to either. A terminal dot at each end and a
              dashed run into the plane makes the row read left-to-right as one
              journey instead of as three separate things.

              Built from flex children rather than one SVG on purpose: the two
              dashed runs are `flex-1`, so the gap around the plane is whatever
              is left over and the track fits its column exactly at any width.
              A single SVG would need either a fixed viewBox — wrong gap once
              the codes change length — or preserveAspectRatio="none", which
              would squash the terminal dots into ellipses.

              The plane is sized and stroked through className, not the
              `size`/`strokeWidth` props: those write width/height/stroke-width
              *attributes*, which take numbers, and every measurement here is in
              cqw. CSS beats a presentation attribute, so the class wins and the
              icon scales with the card like the type does. */}
          <div className="ms-[2.2cqw] flex flex-1 translate-y-[2cqw] flex-col items-center gap-[1.6cqw]">
            {/* The track is decoration and stays hidden from the accessibility
                tree; the duration under it is not, so aria-hidden sits on the
                row rather than on the whole column. */}
            <div
              className="flex w-full items-center gap-[1.6cqw]"
              aria-hidden="true"
            >
              <span className="size-[1.3cqw] shrink-0 rounded-full bg-white/85" />
              <span
                className="h-[0.35cqw] flex-1"
                style={{ backgroundImage: TRACK_DASH }}
              />
              <HugeiconsIcon
                icon={Airplane02Icon}
                className="size-[7.5cqw] shrink-0 [stroke-width:1.1] text-white/95"
              />
              <span
                className="h-[0.35cqw] flex-1"
                style={{ backgroundImage: TRACK_DASH }}
              />
              <span className="size-[1.3cqw] shrink-0 rounded-full bg-white/85" />
            </div>

            {/* Duration under the track, which is where every flight interface
                puts it — it is the one number that makes two clock times mean
                something, and without it the reader has to do timezone
                arithmetic to know whether this is a hop or a haul. Sits in the
                middle column because it belongs to the journey, not to either
                end of it. */}
            <p className="whitespace-nowrap text-[max(11px,2.9cqw)] leading-none text-white/85 tabular-nums">
              {duration}
            </p>
          </div>

          <div className="min-w-0 text-end">
            <p className="text-[7.4cqw] font-semibold leading-none tracking-tight">
              {to.code}
            </p>
            <p className="mt-[1.1cqw] text-[max(12px,3.4cqw)] leading-tight text-white/85">
              {to.city}
            </p>
            <p className="mt-[3cqw] text-[4.3cqw] font-medium leading-none tabular-nums">
              {to.time}
            </p>
          </div>
        </div>

        {/* No rule between the two: justify-between already opens a gap of most
            of the pane's height, and a divider inside a gap that wide separates
            nothing that isn't separated. The pane's own top edge is the only
            line the composition needs.

            Segment control, drawn not wired. The track carries no blur of its
            own: its backdrop is the pane, which is already a flat wash, so a
            second backdrop-filter would cost a compositing layer and change
            nothing you can see. The chosen segment is opaque white against a
            translucent track — that contrast is what says "chosen", and it
            survives whatever photograph sits underneath. */}
        <div
          className="flex bg-white/10 ring-1 ring-inset ring-white/45"
          style={{ borderRadius: RADIUS.control, padding: CONTROL_PAD }}
        >
          {options.map((option, i) => (
            <span
              key={option}
              className={[
                "flex-1 px-[2cqw] py-[2.1cqw] text-center text-[max(12px,3.2cqw)] font-medium leading-none",
                i === activeOption
                  ? // Demoted. It was solid white with a drop shadow, which made
                    // the brightest, most elevated object on the card the one
                    // carrying the least information. Dropping the fill to 88%
                    // and removing the shadow lets the airport codes lead again;
                    // the fill still reads as chosen because nothing else here
                    // is filled at all.
                    "bg-[oklch(1_0_0_/_0.88)] text-[oklch(0.205_0_0)]"
                  : "text-white/85",
              ].join(" ")}
              style={{ borderRadius: RADIUS.segment }}
            >
              {option}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
