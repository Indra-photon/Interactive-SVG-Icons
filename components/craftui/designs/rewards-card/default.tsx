// Static by design — no "use client", no hooks, no motion. Renders on the
// server and ships zero JS.
//
// Built on the "Nova" token set (shadcn Stone base, Blue primary, radius 0),
// shared with the Upgrade Modal. Tailwind only — tokens are stated once below
// as literal class strings, since Tailwind scans source text. The haze at the
// top is the "layer blur" trick: one ellipse in chart-1 pushed above the card
// and blurred by 90px, clipped by the card, so the blue fades into the white
// with no gradient stops to tune.
//
// The three tiles carry hand-drawn line illustrations — single-weight ink, one
// off-white paper shape behind each, exactly one accent per tile — drawn on a
// 96 grid so they scale with the tile. They read as: grow your earnings →
// the reward → the easy action.

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const NOVA = {
  fg: "text-[#0C0A09]",
  mutedFg: "text-[#79716B]",
  card: "bg-[#FFFFFF]",
  muted: "bg-[#F5F5F4]",
  primaryText: "text-[#1447E6]",
  primaryFgBg: "bg-[#EFF6FF]",
  chart1: "bg-[#8EC5FF]",
  chart5: "bg-[#193CB8]",
  cardRing:
    "shadow-[0_0_0_1px_rgb(12_10_9/0.10),0_24px_48px_-12px_rgb(12_10_9/0.14)]",
  text2xl: "text-[24px] leading-[32px] tracking-[-0.35px]",
  textBase: "text-[16px] leading-[24px]",
  textSm: "text-[14px] leading-[20px]",
} as const;

// Illustration colours — the same tokens as raw values, since SVG paint
// attributes cannot take a class.
const INK = {
  fg: "#0C0A09",
  card: "#FFFFFF",
  primary: "#1447E6",
  primaryFg: "#EFF6FF",
  chart1: "#8EC5FF",
} as const;

// Fixed-pixel composition scaled to the caller's width by a viewBox, with a
// 48px margin on the stage so the drop shadow is not clipped — see Upgrade
// Modal.
const STAGE = { width: 592, height: 500 } as const;

interface RewardsCardProps {
  title?: string;
  subtext?: string;
  ctaLabel?: string;
  className?: string;
}

const ink = (color: string, width: number) => ({
  fill: "none",
  stroke: color,
  strokeWidth: width,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

function WateringCan() {
  return (
    <svg viewBox="0 0 96 96" className="block size-full" aria-hidden="true">
      <circle cx="48" cy="50" r="32" fill={INK.primaryFg} />
      <path
        d="M30 73C40 72 50 74 60 73C64 72.5 68 73.5 70 73"
        {...ink(INK.fg, 1.5)}
      />
      <path
        d="M24 40C25 37.5 27.5 37 30.5 37L38 37C40 37 41 38.5 40.5 40.5L39 50.5C38.8 52.5 37.3 53.5 35.5 53.5L27.5 53.5C25.5 53.5 24.3 52 24.3 50Z"
        {...ink(INK.fg, 2)}
      />
      <path d="M29 37C28.5 30.5 37.5 30.5 37 37" {...ink(INK.fg, 2)} />
      <path
        d="M40.5 42 48 37M40 46.5 49 41.5M48 37C50.5 35.8 51.5 38.5 49 41.5"
        {...ink(INK.fg, 2)}
      />
      <path
        d="M51.5 40C56 44 58 50 57 56M54.5 37.5C60 41 63 48 62 55"
        {...ink(INK.chart1, 2.5)}
      />
      <path
        d="M48 73C48 69 48 66 48 63M57 73C57 68 57 65 57 61M66 73C66 69 66 66 66 63"
        {...ink(INK.fg, 1.5)}
      />
      <path
        d="M48 68C45 67.5 44 65.5 44.5 64C46.5 64.5 47.5 66 48 68M57 66.5C60 66 61 64 60.5 62.5C58.5 63 57.5 64.5 57 66.5M66 68C69 67.5 70 65.5 69.5 64C67.5 64.5 66.5 66 66 68"
        {...ink(INK.fg, 1.5)}
      />
      {[
        [48, 59],
        [57, 57],
        [66, 59],
      ].map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="4"
          fill={INK.primary}
          stroke={INK.fg}
          strokeWidth={1.5}
        />
      ))}
    </svg>
  );
}

function GiftBox() {
  return (
    <svg viewBox="0 0 96 96" className="block size-full" aria-hidden="true">
      {/* Figma's rotation is counter-clockwise, SVG's is clockwise — the sign
          flips so the paper tilts the same way and stays under the box. */}
      <rect
        x="22"
        y="22"
        width="58"
        height="58"
        fill={INK.primaryFg}
        transform="rotate(5 22 22)"
      />
      <path
        d="M29 47C42 46 55 46 67 45L69 74C56 75 43 75 31 76Z"
        {...ink(INK.fg, 2)}
      />
      <path
        d="M25 38C40 37 56 36 72 36L71 46C56 46 40 47 26 48Z"
        {...ink(INK.fg, 2)}
      />
      <path d="M48 47 48 75M30 61 68 60" {...ink(INK.primary, 2)} />
      <path
        d="M48 37C40 26 33 30 42 37M48 37C56 26 63 30 54 37M48 37C42 42 40 40 44 37M48 37C54 42 56 40 52 37"
        {...ink(INK.primary, 2)}
      />
      <path d="M78 18 78 26M74 22 82 22M20 20 23 23" {...ink(INK.card, 1.5)} />
    </svg>
  );
}

function TapChecklist() {
  return (
    <svg viewBox="0 0 96 96" className="block size-full" aria-hidden="true">
      <rect
        x="20"
        y="18"
        width="46"
        height="56"
        fill={INK.card}
        transform="rotate(-3 20 18)"
      />
      <path
        d="M27 27 35 26.5 35.5 34.5 27.5 35ZM27 41 35 40.5 35.5 48.5 27.5 49ZM27 55 35 54.5 35.5 62.5 27.5 63Z"
        {...ink(INK.fg, 1.5)}
      />
      <path
        d="M40 30C46 29 52 30 58 29M40 44C45 43 50 44 56 43M40 58C46 57 50 58 54 57"
        {...ink(INK.fg, 1.5)}
      />
      <path d="M28.5 30.5 31 33.5 36 27" {...ink(INK.primary, 2)} />
      <path
        d="M58 48 59 76 65 70 69 80 73 78 69 68 77 67Z"
        {...ink(INK.fg, 2)}
      />
      <path d="M52 44 55 47M58 40 58 44M64 44 61 47" {...ink(INK.fg, 1.5)} />
    </svg>
  );
}

const TILES: {
  name: string;
  fill: string;
  Art: () => ReactNode;
  lifted?: boolean;
}[] = [
  { name: "Watering can", fill: NOVA.chart1, Art: WateringCan },
  { name: "Gift box", fill: NOVA.chart5, Art: GiftBox, lifted: true },
  { name: "Tap checklist", fill: NOVA.muted, Art: TapChecklist },
];

function Tile({
  fill,
  lifted,
  children,
}: {
  fill: string;
  lifted?: boolean;
  children: ReactNode;
}) {
  // The white border is real padding, not an inset shadow: the artwork sits
  // inside it rather than painting over it, which is how the Figma tile is
  // built (stroke inside, art clipped to the fill). The middle tile is lifted
  // by giving its neighbours the 8px it lacks.
  return (
    <div
      className={cn(
        "size-24 shrink-0 rounded-none p-1 shadow-[0_8px_20px_-4px_rgb(12_10_9/0.16)]",
        NOVA.card,
        lifted ? "mt-0" : "mt-2",
      )}
    >
      <div className={cn("size-full overflow-hidden", fill)}>{children}</div>
    </div>
  );
}

function Card({
  title = "Get rewarded fast",
  subtext = "Choose and earn fast with these simple offers.",
  ctaLabel = "Show 10 easy offers",
}: Omit<RewardsCardProps, "className">) {
  return (
    <article
      className={cn(
        "relative flex w-[496px] shrink-0 flex-col items-center gap-10 overflow-hidden rounded-none px-8 pt-16 pb-8 font-sans",
        NOVA.card,
        NOVA.fg,
        NOVA.cardRing,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-[230px] left-1/2 h-[340px] w-[720px] -translate-x-1/2 rounded-full opacity-55 blur-[90px]",
          NOVA.chart1,
        )}
      />

      <div className="relative flex items-start gap-6">
        {TILES.map(({ name, fill, Art, lifted }) => (
          <Tile key={name} fill={fill} lifted={lifted}>
            <Art />
          </Tile>
        ))}
      </div>

      <div className="relative flex flex-col items-center gap-1 text-center">
        <h2 className={cn("font-medium", NOVA.text2xl)}>{title}</h2>
        <p className={cn("w-full", NOVA.textBase, NOVA.mutedFg)}>{subtext}</p>
      </div>

      <span
        className={cn(
          "relative flex h-9 w-full items-center justify-center rounded-none font-medium whitespace-nowrap",
          NOVA.primaryFgBg,
          NOVA.primaryText,
          NOVA.textSm,
        )}
      >
        {ctaLabel}
      </span>
    </article>
  );
}

export default function RewardsCard({ className, ...props }: RewardsCardProps) {
  return (
    <svg
      viewBox={`0 0 ${STAGE.width} ${STAGE.height}`}
      width={STAGE.width}
      height={STAGE.height}
      // 592px is STAGE.width spelled out: Tailwind scans source text, so a
      // class built from the constant would never be generated.
      className={cn("h-auto w-full max-w-[592px]", className)}
    >
      <foreignObject width={STAGE.width} height={STAGE.height}>
        <div className="flex size-full items-start justify-center p-12">
          <Card {...props} />
        </div>
      </foreignObject>
    </svg>
  );
}
