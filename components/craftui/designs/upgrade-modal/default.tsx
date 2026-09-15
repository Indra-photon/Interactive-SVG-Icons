// Static by design — no "use client", no hooks, no motion. The dialog is drawn
// in its open state as a still picture of an upsell, not a working modal: the
// close button and both actions are inert so the piece ships zero JS.
//
// Built on the "Nova" token set (shadcn Stone base, Blue primary, radius 0).
// Tailwind only — the tokens are stated once below as class strings so every
// colour, gap, size and type value on the card reads from the same source; the
// Figma and Paper originals bind the identical variables. Values are literal
// (not built from constants) because Tailwind scans source text.

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const NOVA = {
  fg: "text-[#0C0A09]",
  mutedFg: "text-[#79716B]",
  card: "bg-[#FFFFFF]",
  primary: "bg-[#1447E6]",
  primaryFg: "text-[#EFF6FF]",
  primaryFgBg: "bg-[#EFF6FF]",
  border: "border-[#E7E5E4]",
  // Card outline — 1px ring at foreground/10 rather than a border, plus the
  // dialog's elevation.
  cardRing: "shadow-[0_0_0_1px_rgb(12_10_9/0.10),0_24px_48px_-12px_rgb(12_10_9/0.18)]",
  // Type pairs: size with its line-height, never set separately.
  text2xl: "text-[24px] leading-[32px] tracking-[-0.35px]",
  textBase: "text-[16px] leading-[24px]",
  textSm: "text-[14px] leading-[20px]",
  textXs: "text-[12px] leading-[16px]",
} as const;

// The dialog is laid out in fixed pixels — the composition is drawn against a
// 496px card and does not reflow — so it is scaled to the caller's width by a
// viewBox rather than by rewriting its measurements (the same device as the
// Notes Card). The stage is the card plus a 48px margin wide enough to hold
// the drop shadow, since nothing may paint outside the viewBox.
const STAGE = { width: 592, height: 718 } as const;

interface Feature {
  title: string;
  description: string;
}

interface UpgradeModalProps {
  title?: string;
  description?: ReactNode;
  /** Pill beside the title. Pass "" to drop it. */
  badge?: string;
  features?: Feature[];
  ctaLabel?: string;
  dismissLabel?: string;
  className?: string;
}

function CloseMark() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute top-4 right-4 flex size-7 items-center justify-center rounded-none border",
        NOVA.card,
        NOVA.border,
      )}
    >
      <svg
        width="8"
        height="8"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        className={NOVA.fg}
      >
        <path d="M2 2 10 10M10 2 2 10" />
      </svg>
    </span>
  );
}

function Check() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-none",
        NOVA.primaryFgBg,
      )}
    >
      <svg
        width="12"
        height="8"
        viewBox="0 0 14 11"
        fill="none"
        stroke="#1447E6"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 6.5 5 10.5 13 2.5" />
      </svg>
    </span>
  );
}

function Dialog({
  title = "Upgrade to Paper Pro",
  description = "Unlock unlimited files, shared libraries, and hand-off tools built for teams that ship.",
  badge = "2 months free",
  features = [
    {
      title: "Unlimited files and pages",
      description: "No caps on projects, artboards, or version history",
    },
    {
      title: "Shared design tokens",
      description: "Publish one token set and sync it across every file",
    },
    {
      title: "Developer hand-off",
      description: "Export clean JSX and CSS with exact values, no guesswork",
    },
  ],
  ctaLabel = "Upgrade now · $12/mo",
  dismissLabel = "Maybe later",
}: Omit<UpgradeModalProps, "className">) {
  return (
    <article
      role="dialog"
      aria-label={title}
      className={cn(
        "flex w-[496px] shrink-0 flex-col overflow-hidden rounded-none text-left font-sans",
        NOVA.card,
        NOVA.fg,
        NOVA.cardRing,
      )}
    >
      {/* Hero — the one surface that is not a token: the mesh shader from the
          Paper original flattened to a linear ramp, indigo at the bottom-left
          to violet at the top-right. */}
      <div className="relative h-[200px] shrink-0 bg-[linear-gradient(60deg,#241D9A_0%,#3A2FB0_45%,#9F50D3_100%)]">
        <CloseMark />
      </div>

      <div className="flex flex-col gap-6 px-5 pt-6 pb-5">
        <header className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-4">
            <h2 className={cn("font-medium", NOVA.text2xl)}>{title}</h2>
            {badge && (
              <span
                className={cn(
                  "flex h-5 shrink-0 items-center rounded-none px-2 font-medium whitespace-nowrap",
                  NOVA.primary,
                  NOVA.primaryFg,
                  NOVA.textXs,
                )}
              >
                {badge}
              </span>
            )}
          </div>
          <p className={cn(NOVA.textBase, NOVA.mutedFg)}>{description}</p>
        </header>

        <ul className="flex flex-col gap-4">
          {features.map((feature) => (
            <li key={feature.title} className="flex items-start gap-3">
              <Check />
              <div className={cn("flex min-w-0 flex-1 flex-col gap-0.5", NOVA.textSm)}>
                <span className="font-medium">{feature.title}</span>
                <span className={NOVA.mutedFg}>{feature.description}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center gap-3 pt-2">
          <span
            className={cn(
              "flex h-9 w-full items-center justify-center rounded-none px-2.5 font-medium whitespace-nowrap",
              NOVA.primary,
              NOVA.primaryFg,
              NOVA.textSm,
            )}
          >
            {ctaLabel}
          </span>
          <span
            className={cn(
              "flex h-8 items-center justify-center px-2.5 font-medium whitespace-nowrap",
              NOVA.mutedFg,
              NOVA.textSm,
            )}
          >
            {dismissLabel}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function UpgradeModal({ className, ...props }: UpgradeModalProps) {
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
          <Dialog {...props} />
        </div>
      </foreignObject>
    </svg>
  );
}
