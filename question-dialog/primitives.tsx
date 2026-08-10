"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import type { QuestionType } from "./question-types";

/**
 * Shared feel: a soft spring with just enough settle to read as physical.
 *
 * `visualDuration` rather than `duration` so the spring *arrives* in step with
 * the height and the body crossfade (both `SWAP_DURATION`), with the bounce
 * resolving quietly afterwards. Matching `duration` instead would squeeze the
 * settle into the same window and turn the overshoot into a twitch.
 */
export const SPRING = {
  type: "spring",
  bounce: 0.18,
  visualDuration: 0.27,
} as const;

/**
 * Anything entering or leaving the screen rides this. The first control point
 * sits above the diagonal, so the move starts fast and settles — which is what
 * makes a transition feel responsive rather than hesitant. The container height
 * already used this curve; now the content inside it agrees.
 */
export const EASE_OUT = [0.25, 1, 0.5, 1] as const;

export const FADE = { duration: 0.18, ease: EASE_OUT } as const;

/**
 * Two stroke weights, not five. Optical weight should read constant across
 * sizes, which means small glyphs need a heavier stroke than large ones —
 * a single shared value looks thin at 16px and heavy at 32px.
 */
export const ICON_STROKE_SMALL = 2; // 16-18px
export const ICON_STROKE_LARGE = 1.6; // 22px and up

/* ------------------------------------------------------------------ layout */

export function Section({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("px-7", className)}>{children}</div>;
}

/** Full-bleed hairline — sits outside Section so it reaches both edges. */
export function Divider() {
  return <div className="bg-border h-px w-full" />;
}

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-muted-foreground text-[13px]">
        {label}
      </Label>
      {children}
    </div>
  );
}

/**
 * Height-animating reveal for optional sub-fields. The dialog shell measures
 * its content, so growing in here makes the whole dialog spring taller.
 */
export function Reveal({
  show,
  children,
}: {
  show: boolean;
  children: ReactNode;
}) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={FADE}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ controls */

export function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
  id,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-foreground text-[15px] font-medium">
          {label}
        </Label>
        {description && (
          <p className="text-muted-foreground text-[13px]">{description}</p>
        )}
      </div>
      {/* Scaled rather than re-sized so the thumb's own travel math still holds. */}
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="focus-visible:ring-foreground/15 origin-right scale-[1.35] focus-visible:ring-2 focus-visible:ring-offset-0"
      />
    </div>
  );
}

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  icon?: IconSvgElement;
};

/**
 * `name` namespaces the sliding pill's layoutId so two segmented controls in
 * different views never try to morph into one another.
 */
export function SegmentedControl<T extends string>({
  name,
  value,
  onValueChange,
  options,
}: {
  name: string;
  value: T;
  onValueChange: (value: T) => void;
  options: SegmentedOption<T>[];
}) {
  return (
    <div role="radiogroup" className="bg-muted flex gap-1 rounded-2xl p-1">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onValueChange(option.value)}
            className="focus-visible:ring-foreground/15 relative flex h-10 flex-1 items-center justify-center gap-2 rounded-[14px] text-[15px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-offset-0"
          >
            {selected && (
              <motion.span
                layoutId={`segment-${name}`}
                transition={SPRING}
                className="bg-background absolute inset-0 rounded-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]"
              />
            )}
            <span
              className={cn(
                "relative z-10 flex items-center gap-2 transition-colors",
                selected ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {option.icon && (
                <HugeiconsIcon
                  icon={option.icon}
                  size={18}
                  strokeWidth={ICON_STROKE_SMALL}
                />
              )}
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function SubmitButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      className="focus-visible:ring-foreground/25 h-12 w-full rounded-2xl bg-[#3A3A3A] text-[16px] font-semibold text-white hover:bg-[#2B2B2B] focus-visible:ring-2 focus-visible:ring-offset-0 dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-white"
    >
      {children}
    </Button>
  );
}

/* ------------------------------------------------------------------ pickers */

/** One cell of the 2-column type grid on the first screen. */
export function TypeTile({
  type,
  onSelect,
}: {
  type: QuestionType;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="bg-muted text-foreground hover:bg-accent focus-visible:ring-foreground/15 flex h-14 items-center gap-3 rounded-2xl px-4 text-left text-[16px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-0 active:translate-y-px"
    >
      <HugeiconsIcon
        icon={type.icon}
        size={22}
        strokeWidth={ICON_STROKE_LARGE}
        className="text-muted-foreground shrink-0"
      />
      {type.label}
    </button>
  );
}

/** The icon + name + description strip at the top of every step screen. */
export function TypeSummary({ type }: { type: QuestionType }) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-xl">
        <HugeiconsIcon
          icon={type.icon}
          size={22}
          strokeWidth={ICON_STROKE_LARGE}
          className="text-muted-foreground"
        />
      </div>
      <div className="min-w-0">
        <p className="text-foreground text-[15px] font-medium">{type.label}</p>
        <p className="text-muted-foreground truncate text-[14px]">
          {type.description}
        </p>
      </div>
    </div>
  );
}
