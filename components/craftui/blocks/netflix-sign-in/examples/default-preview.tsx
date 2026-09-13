"use client";

import NetflixSignIn from "../default";

/* ── The phone ────────────────────────────────────────────
 * Device chrome only — body, bezel, island, status bar, home indicator. The
 * block is the SCREEN and knows nothing about what is around it.
 *
 * Fixed pixels, NOT a scaled-down mock: every position in the block comes
 * from getBoundingClientRect, and a CSS transform on an ancestor would scale
 * those measurements while leaving the traveller's own translate in its
 * unscaled local space — the face would fly to a systematically wrong place.
 *
 * The width is what constrains the roster: five faces plus their gaps and
 * the screen's own padding have to fit inside it. */
const PHONE_W = 340;
const PHONE_H = 640;
/* Bezel thickness. The screen's radius is the body's minus this, so the two
 * curves are concentric rather than merely both round. */
const BEZEL = 10;
const BODY_RADIUS = 46;

/* ── Status bar ──────────────────────────────────────────
 * Hand-drawn at 1x rather than pulled from an icon set: at 11px the shapes an
 * icon library gives you are the wrong weight next to real iOS glyphs, and
 * these are three trivial paths. The time is frozen at the traditional 9:41 —
 * a live clock would differ between the server render and the client one and
 * break hydration for no benefit. */
function Signal() {
  return (
    <svg
      width="17"
      height="11"
      viewBox="0 0 17 11"
      fill="currentColor"
      aria-hidden="true"
    >
      {[0, 1, 2, 3].map((bar) => (
        <rect
          key={bar}
          x={bar * 4.5}
          y={8 - bar * 2.4}
          width="3"
          height={3 + bar * 2.4}
          rx="1"
          opacity={bar === 3 ? 0.35 : 1}
        />
      ))}
    </svg>
  );
}

function Wifi() {
  return (
    <svg
      width="15"
      height="11"
      viewBox="0 0 15 11"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 3.6a9.5 9.5 0 0 1 13 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M3.6 6.4a5.8 5.8 0 0 1 7.8 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="7.5" cy="9.2" r="1.3" fill="currentColor" />
    </svg>
  );
}

function Battery() {
  return (
    <svg
      width="25"
      height="12"
      viewBox="0 0 25 12"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="0.6"
        y="0.6"
        width="21"
        height="10.8"
        rx="3.2"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1.2"
      />
      <rect
        x="2.2"
        y="2.2"
        width="14"
        height="7.6"
        rx="2"
        fill="currentColor"
      />
      <path
        d="M23.2 4.2v3.6a2 2 0 0 0 0-3.6Z"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  );
}

export default function DefaultPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center py-10">
      <div className="relative" style={{ width: PHONE_W, height: PHONE_H }}>
        {/* Side hardware. Purely decorative, and outside the body so it
            cannot end up inside the screen's overflow clip. */}
        <span
          aria-hidden="true"
          className="absolute top-[118px] -left-[3px] h-[26px] w-[3px] rounded-l-sm bg-[#26262a]"
        />
        <span
          aria-hidden="true"
          className="absolute top-[162px] -left-[3px] h-[46px] w-[3px] rounded-l-sm bg-[#26262a]"
        />
        <span
          aria-hidden="true"
          className="absolute top-[222px] -left-[3px] h-[46px] w-[3px] rounded-l-sm bg-[#26262a]"
        />
        <span
          aria-hidden="true"
          className="absolute top-[186px] -right-[3px] h-[72px] w-[3px] rounded-r-sm bg-[#26262a]"
        />

        <div
          className="h-full w-full bg-[#141416] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.75)] ring-1 ring-white/10"
          style={{ borderRadius: BODY_RADIUS, padding: BEZEL }}
        >
          {/* The screen well. Rounded and clipped here so the block's own
              overflow clip and the bezel's curve are the same rectangle, and
              the island / status bar / home indicator can sit on top of the
              block without being part of it. */}
          <div
            className="relative h-full w-full overflow-hidden"
            style={{ borderRadius: BODY_RADIUS - BEZEL }}
          >
            {/* showHint leaks the demo PINs into a margin note. Only the
                preview wants that; an installed block leaves it off. */}
            <NetflixSignIn showHint />

            {/* The island. Above everything, because the face flies under
                it on its way to the centre. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-2.5 left-1/2 z-30 h-[24px] w-[88px] -translate-x-1/2 rounded-full bg-black"
            />

            {/* Status bar, split around the island rather than laid across
                it — which is what the hardware forces on a real device and
                the only arrangement that reads as one. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-[15px] z-30 flex items-center justify-between px-6 text-[#0b0b0b]"
            >
              <span className="text-[12px] font-semibold tracking-tight tabular-nums">
                9:41
              </span>
              <span className="flex items-center gap-1.5">
                <Signal />
                <Wifi />
                <Battery />
              </span>
            </div>

            {/* Home indicator. Sits below the bars, where the hardware
                would put it. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[7px] left-1/2 z-30 h-[4px] w-[112px] -translate-x-1/2 rounded-full bg-black/25"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
