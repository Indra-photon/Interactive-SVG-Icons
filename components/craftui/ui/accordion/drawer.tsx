"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionItem } from "@/components/ui/accordion";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AccordionItemData {
  value: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
}

export interface DrawerAccordionProps {
  items: AccordionItemData[];
  spring?: { stiffness: number; damping: number };
  className?: string;
}

// ── Plus / × icon ─────────────────────────────────────────────────────────────

const PLUS_PATHS = {
  closed: {
    h: "M 4 12 L 20 12",
    v: "M 12 4 L 12 20",
  },
  open: {
    h: "M 4 4 L 20 20",
    v: "M 20 4 L 4 20",
  },
};

function PlusIcon({ isOpen }: { isOpen: boolean }) {
  const prefersReduced = useReducedMotion();
  const transition = prefersReduced
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.645, 0.045, 0.355, 1] as any };

  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
    >
      <motion.path
        animate={{ d: isOpen ? PLUS_PATHS.open.h : PLUS_PATHS.closed.h }}
        transition={transition}
      />
      <motion.path
        animate={{ d: isOpen ? PLUS_PATHS.open.v : PLUS_PATHS.closed.v }}
        transition={transition}
      />
    </svg>
  );
}

// ── Content panel ─────────────────────────────────────────────────────────────

function DrawerContentPanel({
  children,
  isOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  spring: { stiffness: number; damping: number };
}) {
  const prefersReduced = useReducedMotion();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: isOpen ? "1fr" : "0fr",
        transition: prefersReduced
          ? "none"
          : "grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={
          prefersReduced
            ? { duration: 0 }
            : isOpen
              ? { delay: 0.08, duration: 0.2 }
              : { duration: 0.08 }
        }
        style={{ overflow: "hidden", minHeight: 0 }}
      >
        <div className="pb-8 text-sm text-muted-foreground leading-relaxed antialiased text-pretty">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// ── Per-item row ──────────────────────────────────────────────────────────────

function DrawerCard({
  item,
  isOpen,
  spring,
}: {
  item: AccordionItemData;
  isOpen: boolean;
  spring: { stiffness: number; damping: number };
}) {
  return (
    <div className="border-b border-border">
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className={cn(
            "group flex w-full cursor-pointer items-center justify-between py-7 text-left",
            "outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          <span className="text-lg font-semibold text-foreground antialiased text-balance pr-6">
            {item.trigger}
          </span>
          <div className="shrink-0 transition-transform group-active:scale-[0.96]">
            <PlusIcon isOpen={isOpen} />
          </div>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      <AccordionPrimitive.Content forceMount>
        <DrawerContentPanel isOpen={isOpen} spring={spring}>
          {item.content}
        </DrawerContentPanel>
      </AccordionPrimitive.Content>
    </div>
  );
}

// ── Root component ─────────────────────────────────────────────────────────────

export function DrawerAccordion({
  items,
  spring = { stiffness: 220, damping: 22 },
  className,
}: DrawerAccordionProps) {
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
          <DrawerCard
            item={item}
            isOpen={openValue === item.value}
            spring={spring}
          />
        </AccordionItem>
      ))}
    </Accordion>
  );
}
