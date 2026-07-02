"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionItem } from "@/components/ui/accordion";

// ── Path constants ─────────────────────────────────────────────────────────────

const PATHS = {
  closed: {
    left: "M 4 9 L 12 17",
    right: "M 20 9 L 12 17",
  },
  open: {
    left: "M 4 4 L 20 20",
    right: "M 20 4 L 4 20",
  },
};

// Icon uses ease-in-out: it's morphing in place (not entering/exiting the screen).
// Content uses the user-controlled ease-out curve: it's entering/exiting.
const ICON_EASE = [0.645, 0.045, 0.355, 1];

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AccordionItemData {
  value: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
}

export interface EaseAccordionProps {
  items: AccordionItemData[];
  duration?: number;
  ease?: number[];
  className?: string;
}

// ── Morphing icon ─────────────────────────────────────────────────────────────

function MorphIcon({
  isOpen,
  duration,
}: {
  isOpen: boolean;
  duration: number;
  ease: number[];
}) {
  const prefersReduced = useReducedMotion();
  const transition = prefersReduced
    ? { duration: 0 }
    : { duration, ease: ICON_EASE as any };

  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className="shrink-0 text-muted-foreground"
    >
      <motion.path
        animate={{ d: isOpen ? PATHS.open.left : PATHS.closed.left }}
        transition={transition}
      />
      <motion.path
        animate={{ d: isOpen ? PATHS.open.right : PATHS.closed.right }}
        transition={transition}
      />
    </svg>
  );
}

// ── Custom trigger ────────────────────────────────────────────────────────────

function EaseTrigger({
  children,
  isOpen,
  duration,
  ease,
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  isOpen: boolean;
  duration: number;
  ease: number[];
}) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-center justify-between",
          "rounded-md border border-transparent py-4 text-left text-sm font-medium",
          "cursor-pointer outline-none transition-[color,box-shadow,border-color] active:scale-[0.96] transition-transform",
          "hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        <MorphIcon isOpen={isOpen} duration={duration} ease={ease} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

// ── Motion content ─────────────────────────────────────────────────────────────

function MotionContent({
  children,
  className,
  duration,
  ease,
  "data-state": dataState,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  duration: number;
  ease: number[];
  "data-state"?: string;
  [key: string]: unknown;
}) {
  const isOpen = dataState === "open";
  const prefersReduced = useReducedMotion();

  const EXIT_DURATION = 0.12;

  // Open: two beats — height snaps first, content fades in after.
  // Opacity starts at 180ms (after height has mostly landed) and completes at 300ms.
  // Close: reverse — content vanishes instantly, then space collapses.
  const variants = prefersReduced
    ? {
        open: {
          height: "auto" as const,
          opacity: 1,
          transition: { duration: 0 },
        },
        closed: { height: 0, opacity: 0, transition: { duration: 0 } },
      }
    : {
        open: {
          height: "auto" as const,
          opacity: 1,
          transition: {
            height: { duration, ease: ease as any },
            opacity: { duration: duration * 0.45, delay: 0.1, ease: "linear" as any },
          },
        },
        closed: {
          height: 0,
          opacity: 0,
          transition: {
            height: { duration: EXIT_DURATION, ease: ease as any },
            opacity: { duration: EXIT_DURATION * 0.2, ease: "linear" as any },
          },
        },
      };

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial="closed"
          animate="open"
          exit="closed"
          variants={variants}
          style={{ overflow: "hidden" }}
          className={cn("text-sm text-muted-foreground", className)}
          {...rest}
        >
          <div className="pb-4 pt-0">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EaseAccordionContent({
  children,
  className,
  duration,
  ease,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content> & {
  duration: number;
  ease: number[];
}) {
  return (
    <AccordionPrimitive.Content forceMount asChild {...props}>
      <MotionContent duration={duration} ease={ease} className={className}>
        {children}
      </MotionContent>
    </AccordionPrimitive.Content>
  );
}

// ── Root component ─────────────────────────────────────────────────────────────

export function EaseAccordion({
  items,
  duration = 0.26,
  ease = [0.215, 0.61, 0.355, 1],
  className,
}: EaseAccordionProps) {
  const [openValue, setOpenValue] = React.useState<string>("");

  return (
    <Accordion
      type="single"
      collapsible
      value={openValue}
      onValueChange={setOpenValue}
      className={cn("w-full", className)}
    >
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <EaseTrigger
            isOpen={openValue === item.value}
            duration={duration}
            ease={ease}
          >
            {item.trigger}
          </EaseTrigger>
          <EaseAccordionContent duration={duration} ease={ease}>
            {item.content}
          </EaseAccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
