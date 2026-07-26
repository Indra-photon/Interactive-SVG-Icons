"use client";

import { AlertDialog } from "@base-ui-components/react/alert-dialog";
import type { ReactNode } from "react";

export interface BlurAlertDialogProps {
  triggerLabel?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  cancelLabel?: ReactNode;
  actionLabel?: ReactNode;
  onAction?: () => void;
  /** Blur focus-in duration in ms. Default 400. */
  duration?: number;
  className?: string;
}

/**
 * Blur — the popup resolves out of a 16px blur while fading in, like a lens
 * pulling focus. Glass surface tuned for both themes: a light frost over dark,
 * a soft white frost over light, with two ambient color blobs behind the glass.
 */
export function BlurAlertDialog({
  triggerLabel = "End session",
  title = "End your session?",
  description = "You'll be signed out on this device and any unsaved drafts will stay in the cloud.",
  cancelLabel = "Stay",
  actionLabel = "Sign out",
  onAction,
  duration = 400,
  className = "",
}: BlurAlertDialogProps = {}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger className="rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium text-foreground backdrop-blur transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        {triggerLabel}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md transition-opacity duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <AlertDialog.Popup
          style={{
            transition: `filter ${duration}ms ease, opacity ${duration}ms ease`,
          }}
          className={`fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/20 bg-white/70 p-6 shadow-2xl backdrop-blur-2xl [filter:blur(0px)] data-[starting-style]:opacity-0 data-[starting-style]:[filter:blur(16px)] data-[ending-style]:opacity-0 data-[ending-style]:[filter:blur(16px)] dark:border-white/10 dark:bg-white/10 sm:p-7 ${className}`}
        >
          <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-fuchsia-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-sky-500/30 blur-3xl" />
          <AlertDialog.Title className="relative text-base font-semibold text-foreground sm:text-lg">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </AlertDialog.Description>
          <div className="relative mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <AlertDialog.Close className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground">
              {cancelLabel}
            </AlertDialog.Close>
            <AlertDialog.Close
              onClick={onAction}
              className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90"
            >
              {actionLabel}
            </AlertDialog.Close>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export default BlurAlertDialog;
