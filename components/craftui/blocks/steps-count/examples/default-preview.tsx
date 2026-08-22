"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  FootprintsIcon,
} from "@hugeicons/core-free-icons";

import StepsCountBlock from "../default";

/**
 * A fitness app home screen, skeletonised down to one live control.
 *
 * Everything except the Steps button is a grey box on purpose. The block being
 * demonstrated is the sheet, so the screen around it has to read as context
 * and nothing else — a preview with four plausible-looking buttons makes the
 * reader hunt for which one is the demo.
 *
 * The sheet is contained rather than viewport-fixed. `Drawer.Portal` forwards
 * Radix's `container`, and the block pairs that with switching its overlay and
 * content from `fixed` to `absolute` — both halves are required, since a
 * `fixed` child of a container is still laid out against the viewport. So the
 * frame just hands the block its own element and gets a sheet that rises
 * inside the phone.
 *
 * `modal={false}` drops the scroll lock. A documentation page that cannot be
 * scrolled because an inline example is open is a worse bug than anything the
 * example is showing.
 */
export default function DefaultPreview() {
  /* State, not a ref: the portal needs the element on a render *after* it
     exists, and a ref mutation never schedules one. */
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        ref={setFrame}
        className="relative h-full max-h-[620px] w-full max-w-[340px] overflow-hidden rounded-[15px] bg-[#F7F5F0]"
        style={{
          boxShadow:
            "0 0 0 1px rgba(35,30,25,0.08), 0 40px 80px rgba(35,30,25,0.28), 0 8px 24px rgba(35,30,25,0.12)",
        }}
      >
        {/* Status bar ------------------------------------------------------ */}
        <div className="absolute top-0 right-0 left-0 z-30 flex h-10 items-center justify-between px-7">
          <span className="text-xs font-semibold text-[#221F1C] antialiased">
            9:41
          </span>
          <div className="flex h-2.5 w-4 items-center rounded-sm border border-[#221F1C]/30 p-[1.5px]">
            <div className="h-full w-2/3 rounded-[1px] bg-[#221F1C]/40" />
          </div>
        </div>

        {/* Screen ---------------------------------------------------------- */}
        <div className="absolute inset-0 overflow-hidden px-5 pt-13 pb-20">
          {/* Greeting */}
          <div className="mb-5 flex items-center gap-3">
            <div className="flex flex-col gap-2">
              <div className="h-2.5 w-16 rounded-full bg-[#221F1C]/10" />
              <div className="h-4 w-32 rounded-full bg-[#221F1C]/15" />
            </div>
            <div className="ml-auto size-9 rounded-full bg-[#221F1C]/[0.08]" />
          </div>

          {/* Activity rings card */}
          <div className="mb-4 flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgb(35_30_25/0.05)]">
            <svg width="74" height="74" viewBox="0 0 74 74" aria-hidden="true">
              {[
                { r: 31, w: 7, dash: 0.72 },
                { r: 22, w: 7, dash: 0.54 },
                { r: 13, w: 7, dash: 0.38 },
              ].map((ring, i) => {
                const c = 2 * Math.PI * ring.r;
                return (
                  <g key={i} transform="rotate(-90 37 37)">
                    <circle
                      cx="37"
                      cy="37"
                      r={ring.r}
                      fill="none"
                      strokeWidth={ring.w}
                      stroke="rgb(35 30 25 / 0.07)"
                    />
                    <circle
                      cx="37"
                      cy="37"
                      r={ring.r}
                      fill="none"
                      strokeWidth={ring.w}
                      strokeLinecap="round"
                      stroke="rgb(35 30 25 / 0.16)"
                      strokeDasharray={`${c * ring.dash} ${c}`}
                    />
                  </g>
                );
              })}
            </svg>
            <div className="flex flex-1 flex-col gap-3">
              {[62, 44, 30].map((w) => (
                <div key={w} className="flex flex-col gap-1.5">
                  <div
                    className="h-2 rounded-full bg-[#221F1C]/12"
                    style={{ width: `${w}%` }}
                  />
                  <div className="h-1.5 w-10 rounded-full bg-[#221F1C]/[0.07]" />
                </div>
              ))}
            </div>
          </div>

          {/* The one live control on the screen. ---------------------------
              Inked, full-bleed and the only thing here with a label, because
              a preview should not make the reader guess where the demo is. */}
          <StepsCountBlock container={frame} modal={false}>
            <button
              type="button"
              className="mb-4 flex w-full items-center gap-3 rounded-2xl bg-[#221F1C] px-4 py-3.5 text-left text-white outline-none transition-[background-color,scale] duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:bg-[#332F2A] active:scale-[0.985] motion-reduce:transition-none"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10">
                <HugeiconsIcon
                  icon={FootprintsIcon}
                  size={18}
                  strokeWidth={1.8}
                />
              </span>
              <span className="text-[15px] font-medium tracking-[-0.01em]">
                Steps
              </span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={17}
                strokeWidth={1.8}
                className="ml-auto opacity-55"
              />
            </button>
          </StepsCountBlock>

          {/* This week */}
          <div className="mb-2.5 h-2.5 w-20 rounded-full bg-[#221F1C]/12" />
          <div className="overflow-hidden rounded-2xl bg-white">
            {[68, 46, 56].map((w, i, all) => (
              <div key={w}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="size-8 shrink-0 rounded-xl bg-[#221F1C]/[0.07]" />
                  <div className="flex flex-1 flex-col gap-1.5">
                    <div
                      className="h-2 rounded-full bg-[#221F1C]/12"
                      style={{ width: `${w}%` }}
                    />
                    <div className="h-1.5 w-12 rounded-full bg-[#221F1C]/[0.07]" />
                  </div>
                  <div className="h-2 w-7 rounded-full bg-[#221F1C]/[0.07]" />
                </div>
                {i < all.length - 1 && (
                  <div className="ml-[60px] h-px bg-[#221F1C]/[0.06]" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tab bar --------------------------------------------------------- */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-start justify-around border-t border-[#221F1C]/[0.06] bg-white/85 px-6 pt-3 pb-5 backdrop-blur-sm">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className="size-5 rounded-lg"
                style={{
                  background:
                    i === 0 ? "rgb(35 30 25 / 0.3)" : "rgb(35 30 25 / 0.1)",
                }}
              />
              <div
                className="h-1.5 w-6 rounded-full"
                style={{
                  background:
                    i === 0 ? "rgb(35 30 25 / 0.22)" : "rgb(35 30 25 / 0.08)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
