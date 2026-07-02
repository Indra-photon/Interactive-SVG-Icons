"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { motion, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AddIcon,
  ArrowLeft01Icon,
  ArrowUp01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Accordion, AccordionItem } from "@/components/ui/accordion";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AccordionItemData {
  value: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
}

export type ClipDirection = "horizontal" | "vertical";

export interface ClipAccordionProps {
  items: AccordionItemData[];
  direction?: ClipDirection;
  duration?: number;
  ease?: number[];
  className?: string;
}

// ── Clip-path constants ───────────────────────────────────────────────────────
// Question layer starts fully visible and clips away in the chosen direction.
// "horizontal" → wipes right-to-left  +  slight x shift for momentum.
// "vertical"   → wipes bottom-to-top  +  slight y shift for momentum.

const PEEK = "20px";

const CLIP = {
  horizontal: {
    closed: { clipPath: "inset(0 0px 0 0px)", x: "0%" },
    open: { clipPath: `inset(0 calc(100% - ${PEEK}) 0 0px)`, x: "0%" },
  },
  vertical: {
    closed: { clipPath: "inset(0px 0 0px 0)", y: "0%" },
    open: { clipPath: `inset(0px 0 calc(100% - ${PEEK}) 0)`, y: "0%" },
  },
} as const;

// ── Icons ─────────────────────────────────────────────────────────────────────

function PlusIcon() {
  return <HugeiconsIcon icon={AddIcon} size={16} strokeWidth={2} />;
}

function BackIcon({ direction }: { direction: ClipDirection }) {
  return (
    <HugeiconsIcon
      icon={direction === "horizontal" ? ArrowLeft01Icon : ArrowUp01Icon}
      size={16}
      strokeWidth={2}
    />
  );
}

// ── Per-item clip card ────────────────────────────────────────────────────────
//
// Layout:
//   Container  — relative, overflow:hidden, rounded card
//   └─ Answer  — in normal flow → sets the card's height
//   └─ Question — position:absolute, inset:0, bg-card → covers the answer
//                 clips away via clip-path to reveal the answer beneath.
//
// Clicking the question triggers Radix which sets openValue → isOpen = true.
// Clicking the answer calls onClose → openValue = "" → isOpen = false.

function ClipCard({
  item,
  isOpen,
  onClose,
  direction,
  duration,
  ease,
}: {
  item: AccordionItemData;
  isOpen: boolean;
  onClose: () => void;
  direction: ClipDirection;
  duration: number;
  ease: number[];
}) {
  const prefersReduced = useReducedMotion();
  const clip = CLIP[direction];

  // Question exits fast (clip away should feel decisive).
  // Question re-enters at full duration (return is deliberate).
  const exitT = prefersReduced
    ? { duration: 0 }
    : { duration: duration * 0.6, ease: ease as any };
  const enterT = prefersReduced
    ? { duration: 0 }
    : { duration, ease: ease as any };

  return (
    <div className="relative overflow-hidden border-b border-border">
      {/* ── Answer layer ──────────────────────────────────────────────────────
          Stays in normal flow — its rendered height sets the card height.
          Fades in after the question has started to exit (delay).               */}
      <motion.div
        aria-hidden={!isOpen}
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={
          prefersReduced
            ? { duration: 0 }
            : isOpen
              ? { delay: duration * 0.3, duration: duration * 0.5 }
              : { duration: 0.08 }
        }
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
        onClick={isOpen ? onClose : undefined}
        className="flex w-full cursor-pointer select-none items-start justify-between gap-4 p-6 text-left"
      >
        <p className="text-md text-foreground leading-relaxed text-pretty antialiased">
          {item.content}
        </p>
        <span className="mt-0.5 shrink-0 text-foreground">
          <BackIcon direction={direction} />
        </span>
      </motion.div>

      {/* ── Question layer ─────────────────────────────────────────────────────
          Absolute overlay, same bg as card — completely covers the answer.
          Clips away in the chosen direction when isOpen becomes true.            */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          ...(isOpen ? clip.open : clip.closed),
          backgroundColor: isOpen ? "var(--color-muted)" : "var(--color-card)",
        }}
        transition={isOpen ? exitT : enterT}
        style={{ pointerEvents: isOpen ? "none" : "auto" }}
      >
        <AccordionPrimitive.Header className="flex h-full">
          <AccordionPrimitive.Trigger
            className={cn(
              "flex h-full w-full cursor-pointer items-start justify-between gap-4 p-6 text-left",
              "outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              "disabled:pointer-events-none disabled:opacity-50",
              "active:scale-[0.96] transition-transform",
            )}
          >
            <span className="text-md text-balance antialiased">
              {item.trigger}
            </span>
            <span className="mt-0.5 shrink-0 text-foreground">
              <PlusIcon />
            </span>
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
      </motion.div>
    </div>
  );
}

// ── Root component ─────────────────────────────────────────────────────────────

export function ClipAccordion({
  items,
  direction = "horizontal",
  duration = 0.3,
  ease = [0.33, 0.55, 0.17, 0.9],
  className,
}: ClipAccordionProps) {
  const [openValue, setOpenValue] = React.useState<string>("");

  return (
    <Accordion
      type="single"
      collapsible
      value={openValue}
      onValueChange={setOpenValue}
      className={cn("w-full border-t border-border", className)}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          className="border-none"
        >
          <ClipCard
            item={item}
            isOpen={openValue === item.value}
            onClose={() => setOpenValue("")}
            direction={direction}
            duration={duration}
            ease={ease}
          />
        </AccordionItem>
      ))}
    </Accordion>
  );
}
