"use client";

import { AlertDialog } from "@base-ui-components/react/alert-dialog";
import type { ReactNode } from "react";

export interface ScaleAlertDialogProps {
  /** Trigger button label. */
  triggerLabel?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Dismiss / "keep editing" label. */
  cancelLabel?: ReactNode;
  /** Confirm / destructive label. */
  actionLabel?: ReactNode;
  /** Fires when the action button is pressed (before the dialog closes). */
  onAction?: () => void;
  /** Enter/exit transition duration in ms. Default 200. */
  duration?: number;
  className?: string;
}

/**
 * Scale — the workhorse. Popup scales up from 95% while fading in; backdrop
 * cross-fades. Everything is driven by theme tokens so it flips cleanly between
 * light and dark, and the type scale steps up on ≥sm screens.
 */
export function ScaleAlertDialog({
  triggerLabel = "Discard changes",
  title = "Discard changes?",
  description = "Your edits haven't been saved. If you leave now, everything you typed will be lost.",
  cancelLabel = "Keep editing",
  actionLabel = "Discard",
  onAction,
  duration = 200,
  className = "",
}: ScaleAlertDialogProps = {}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        {triggerLabel}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
        />
        <AlertDialog.Popup
          style={{ transitionDuration: `${duration}ms` }}
          className={`fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-popover p-5 text-popover-foreground shadow-xl transition-all ease-out data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 sm:p-6 ${className}`}
        >
          <AlertDialog.Title className="text-base font-semibold text-foreground sm:text-lg">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </AlertDialog.Description>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <AlertDialog.Close className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground">
              {cancelLabel}
            </AlertDialog.Close>
            <AlertDialog.Close
              onClick={onAction}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              {actionLabel}
            </AlertDialog.Close>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export default ScaleAlertDialog;
