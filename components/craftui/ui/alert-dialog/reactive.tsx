"use client";

import { AlertDialog } from "@base-ui-components/react/alert-dialog";
import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

export interface ReactiveAlertDialogProps {
  triggerLabel?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Reject label — triggers the tumble-away exit. */
  disagreeLabel?: ReactNode;
  /** Accept label — triggers the snappy exit. */
  agreeLabel?: ReactNode;
  /** Fires when Agree is pressed (before the dialog closes). */
  onAction?: () => void;
  /** Enter / Agree-exit duration in ms. Default 200. */
  duration?: number;
  /** Disagree tumble-away duration in ms. Default 300. */
  disagreeDuration?: number;
  /** Disagree rotation in degrees. Default 12. */
  disagreeAngle?: number;
  /** Disagree vertical drop in px. Default 80. */
  disagreeShift?: number;
  className?: string;
}

/**
 * Reactive — the exit branches on the action. Agree mirrors the entry with a
 * snappy scale-and-fade; Disagree pivots from its top-left corner, rotating and
 * dropping on an ease-in "gravity" curve before fading out. Controlled Base UI
 * AlertDialog with a two-layer popup (outer centers + fades, inner carries the
 * transform) so the exit transform never fights the centering translate.
 * Theme-token driven and honors prefers-reduced-motion.
 */
export function ReactiveAlertDialog({
  triggerLabel = "Review terms",
  title = "Do you accept the terms?",
  description = "Agreeing continues to your account. Disagreeing discards this step and returns you to the start.",
  disagreeLabel = "Disagree",
  agreeLabel = "Agree",
  onAction,
  duration = 200,
  disagreeDuration = 150,
  disagreeAngle = 5,
  disagreeShift = 220,
  className = "",
}: ReactiveAlertDialogProps = {}) {
  const [open, setOpen] = useState(false);
  const [exit, setExit] = useState<"agree" | "disagree">("agree");

  // Every fresh open resets to the neutral mode, so the enter (and any
  // Escape/backdrop dismissal) always uses the snappy scale, never the tumble.
  const handleOpenChange = (next: boolean) => {
    if (next) setExit("agree");
    setOpen(next);
  };
  const handleAgree = () => {
    setExit("agree");
    onAction?.();
    setOpen(false);
  };
  const handleDisagree = () => {
    setExit("disagree");
    setOpen(false);
  };

  const isDisagree = exit === "disagree";
  // The enter always runs in "agree" mode, so this resolves to `duration` /
  // ease-out for the entrance; it only becomes the tumble values once Disagree
  // flips `exit`, right before the closing transition starts.
  const activeDuration = isDisagree ? disagreeDuration : duration;
  const ease = isDisagree
    ? "cubic-bezier(0.4,0,1,1)" // ease-in: accelerates like a drop
    : "cubic-bezier(0.22,1,0.36,1)"; // ease-out: snappy

  const innerStyle: CSSProperties = {
    transitionDuration: `${activeDuration}ms`,
    transitionTimingFunction: ease,
    transformOrigin: isDisagree ? "top left" : "center",
  };
  if (isDisagree) {
    (innerStyle as Record<string, string>)["--exit-transform"] =
      `rotate(${disagreeAngle}deg) translateY(${disagreeShift}px)`;
  }

  const layerStyle: CSSProperties = {
    transitionDuration: `${activeDuration}ms`,
    transitionTimingFunction: ease,
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={handleOpenChange}>
      <AlertDialog.Trigger className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        {triggerLabel}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop
          style={layerStyle}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none"
        />
        <AlertDialog.Popup
          style={layerStyle}
          className="group fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 transition-opacity data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none"
        >
          <div
            style={innerStyle}
            className={`rounded-2xl border border-border bg-popover p-5 text-popover-foreground shadow-xl [transition-property:transform] group-data-[starting-style]:scale-95 group-data-[ending-style]:[transform:var(--exit-transform,scale(0.95))] motion-reduce:!transition-none sm:p-6 ${className}`}
          >
            <AlertDialog.Title className="text-base font-semibold text-foreground sm:text-lg">
              {title}
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {description}
            </AlertDialog.Description>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={handleDisagree}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {disagreeLabel}
              </button>
              <button
                type="button"
                onClick={handleAgree}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {agreeLabel}
              </button>
            </div>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export default ReactiveAlertDialog;
