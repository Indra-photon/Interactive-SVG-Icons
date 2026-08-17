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
  /** Headline over the artwork — the place being sold, not the airport. */
  destination?: string;
  from?: FlightEndpoint;
  to?: FlightEndpoint;
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
 * The base layer under the photograph — and the whole artwork when `image` is
 * explicitly cleared.
 *
 * Three stacked gradients rather than one: a linear for the vertical run from
 * dusk blue down through haze to warm cloud, then two radials to pool the light
 * low and off-centre the way a sun below the horizon actually lights cloud. A
 * single linear reads as a colour ramp; the radials are what make it read as
 * weather.
 */
const PAINTED_SKY = [
  "radial-gradient(90% 55% at 22% 88%, rgba(244,226,190,0.95) 0%, rgba(244,226,190,0) 60%)",
  "radial-gradient(120% 75% at 55% 104%, #E9D5A9 0%, #CDBA92 30%, rgba(205,186,146,0) 66%)",
  "linear-gradient(180deg, #2F5165 0%, #456A7E 42%, #7C8A85 70%, #C4B48E 100%)",
].join(", ");

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

/**
 * A mask that is fully transparent at `from`% down the element and fully opaque
 * by `to`%, measured from its top edge.
 *
 * This is the only way to fade a backdrop-filter. The filter itself has one
 * radius for the whole element — you cannot ramp it — so what ramps instead is
 * how much of the filtered layer is composited, and a mask is what does that.
 */
const rampUp = (from: number, to: number) =>
  `linear-gradient(to bottom, transparent ${from}%, #000 ${to}%)`;

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
  "repeating-linear-gradient(to right, rgba(255,255,255,0.6) 0 0.7cqw, transparent 0.7cqw 2cqw)";

const BLUR_LAYERS = [
  { blur: "0.5cqw", from: 0, to: 32 },
  { blur: "0.9cqw", from: 20, to: 58 },
  { blur: "1.6cqw", from: 44, to: 86 },
];

export function FlightCard({
  image = DEFAULT_IMAGE,
  destination = "San Francisco",
  from = DEFAULT_FROM,
  to = DEFAULT_TO,
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
        // Keep this radius in sync with the rounded-b-[1cqw] on the blur stack
        // below. backdrop-filter escapes an ancestor's overflow-hidden clip in
        // every current engine, so a square-cornered blur layer paints over the
        // card's rounded corners with whatever sits *behind* the card — which
        // on a dark page is two black wedges at the bottom. The blur layers
        // have to round themselves; the clip will not do it for them.
        "rounded-[1cqw] bg-slate-700 shadow-[0_2cqw_5cqw_-1cqw_rgba(0,0,0,0.35)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
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
          alt={destination}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* ── Scrims ──
          Two, because the card sets white type against both ends of the
          artwork and a photograph guarantees neither. The bottom one is the
          load-bearing one: it carries four lines of text, so it runs to 60% and
          leans darker than it looks like it needs to. */}
      <div
        className="absolute inset-x-0 top-0 h-[26%] bg-gradient-to-b from-black/35 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black/60 via-black/28 to-transparent"
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

      {/* ── Title ── */}
      <div className="relative px-[6cqw] pt-[6.5cqw] text-white">
        <p className="text-center text-[4.8cqw] font-semibold leading-none tracking-tight">
          {destination}
        </p>
      </div>

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
          className="pointer-events-none absolute inset-x-0 bottom-0 top-1/2 rounded-b-[4cqw]"
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
        className="pointer-events-none absolute inset-x-0 bottom-0 top-1/2 "
        style={{ maskImage: rampUp(4, 46), WebkitMaskImage: rampUp(4, 46) }}
      />

      {/* ── Content ──
          Unmasked and unblurred, sitting over the stack. Positioned rather than
          laid out in flow: `top-1/2 bottom-0 inset-x-0` is the brief — full
          bleed to the card's edges, rising to the exact half. A flow element
          with negative margins could fake the bleed, but its height would be
          whatever the type happened to measure, and the half-and-half split is
          the composition here, not a side effect of it. */}
      <div className="absolute inset-x-0 bottom-[5%] flex flex-col gap-8 px-[6cqw] text-white ">
        <div className="flex items-end justify-between gap-[2cqw]">
          <div className="min-w-0">
            <p className="text-[7.4cqw] font-semibold leading-none tracking-tight">
              {from.code}
            </p>
            <p className="mt-[1.1cqw] text-[3.4cqw] leading-none text-white/70">
              {from.city}
            </p>
            <p className="mt-[3cqw] text-[4.3cqw] font-medium leading-none">
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
          <div
            className="flex flex-1 items-center gap-[1.6cqw] translate-x-[2.2cqw] translate-y-[2cqw]"
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

          <div className="min-w-0 text-right">
            <p className="text-[7.4cqw] font-semibold leading-none tracking-tight">
              {to.code}
            </p>
            <p className="mt-[1.1cqw] text-[3.4cqw] leading-none text-white/70">
              {to.city}
            </p>
            <p className="mt-[3cqw] text-[4.3cqw] font-medium leading-none">
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
        <div className="flex rounded-[6px] bg-white/15 p-[1.1cqw] ring-1 ring-inset ring-white/25">
          {options.map((option, i) => (
            <span
              key={option}
              className={[
                "flex-1 rounded-[5px] px-[2cqw] py-[2.4cqw] text-center text-[3.4cqw] font-medium leading-none",
                i === activeOption
                  ? "bg-white text-neutral-900 shadow-[0_0.4cqw_1.2cqw_rgba(0,0,0,0.18)]"
                  : "text-white/85",
              ].join(" ")}
            >
              {option}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
