"use client";

import { AlertDialog } from "@base-ui-components/react/alert-dialog";
import type { ReactNode } from "react";

export interface CurtainAlertDialogProps {
  triggerLabel?: ReactNode;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  cancelLabel?: ReactNode;
  actionLabel?: ReactNode;
  onAction?: () => void;
  /** Clip-path curtain (enter) duration in ms. Default 400. */
  duration?: number;
  className?: string;
}

/**
 * Curtain — editorial. The popup opens horizontally from its center line via a
 * clip-path inset on an ease-out curve, like a stage curtain parting, then draws
 * shut faster on close. Serif type, a hairline rule, and full theme-token
 * surfaces so the paper flips to ink in dark mode. Type scales up on ≥sm
 * screens. Honors prefers-reduced-motion.
 */
export function CurtainAlertDialog({
  triggerLabel = "Cancel subscription",
  eyebrow = "Confirmation",
  title = "Cancel your subscription?",
  description = "Your access continues until the end of the billing period. After that, premium features will no longer be available.",
  cancelLabel = "Never mind",
  actionLabel = "Confirm cancellation",
  onAction,
  duration = 400,
  className = "",
}: CurtainAlertDialogProps = {}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger className="border border-foreground px-5 py-2 text-sm tracking-wide text-foreground transition hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        {triggerLabel}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[ending-style]:duration-[250ms] motion-reduce:transition-none" />
        <AlertDialog.Popup
          style={{
            transition: `clip-path ${duration}ms cubic-bezier(0.22,1,0.36,1)`,
          }}
          className={`fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 border border-border bg-card p-6 text-card-foreground shadow-2xl [clip-path:inset(0_0_0_0)] data-[starting-style]:[clip-path:inset(0_50%_0_50%)] data-[ending-style]:[clip-path:inset(0_50%_0_50%)] data-[ending-style]:!duration-[300ms] motion-reduce:!transition-none sm:p-8 ${className}`}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {eyebrow}
          </p>
          <AlertDialog.Title className="mt-3 font-serif text-xl leading-tight text-foreground sm:text-2xl">
            {title}
          </AlertDialog.Title>
          <div className="my-4 h-px w-12 bg-border" />
          <AlertDialog.Description className="font-serif text-[15px] leading-relaxed text-muted-foreground">
            {description}
          </AlertDialog.Description>
          <div className="mt-7 flex items-center justify-between gap-4">
            <AlertDialog.Close className="text-sm tracking-wide text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline">
              {cancelLabel}
            </AlertDialog.Close>
            <AlertDialog.Close
              onClick={onAction}
              className="bg-foreground px-5 py-2 text-sm tracking-wide text-background transition hover:opacity-90"
            >
              {actionLabel}
            </AlertDialog.Close>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export default CurtainAlertDialog;
