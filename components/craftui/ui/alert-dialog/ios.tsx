"use client";

import { AlertDialog } from "@base-ui-components/react/alert-dialog";
import type { ReactNode } from "react";

export interface IosAlertDialogProps {
  triggerLabel?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  cancelLabel?: ReactNode;
  actionLabel?: ReactNode;
  onAction?: () => void;
  /** Spring settle duration in ms. Default 350. */
  duration?: number;
  className?: string;
}

/**
 * iOS — the system-alert zoom. The card enters at 118% and springs down to rest
 * with a back-out curve, exiting shrunk to 92%. Frosted surface and stacked
 * full-width buttons use theme tokens so it reads on light and dark.
 */
export function IosAlertDialog({
  triggerLabel = "Allow location",
  title = "Allow Location Access",
  description = "This lets the app show nearby results while you use it.",
  cancelLabel = "Don't Allow",
  actionLabel = "Allow",
  onAction,
  duration = 350,
  className = "",
}: IosAlertDialogProps = {}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        {triggerLabel}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <AlertDialog.Popup className="group fixed left-1/2 top-1/2 z-50 w-[270px] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0">
          <div
            style={{
              transitionDuration: `${duration}ms`,
              transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
            }}
            className={`overflow-hidden rounded-[14px] border border-border bg-popover/80 text-center shadow-xl backdrop-blur-xl [transition-property:transform] group-data-[starting-style]:[transform:scale(1.18)] group-data-[ending-style]:[transform:scale(0.92)] ${className}`}
          >
            <div className="px-4 pb-4 pt-5">
              <AlertDialog.Title className="text-[17px] font-semibold text-foreground">
                {title}
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-1 text-[13px] leading-snug text-muted-foreground">
                {description}
              </AlertDialog.Description>
            </div>
            <div className="flex flex-col divide-y divide-border border-t border-border text-[17px] text-blue-500">
              <AlertDialog.Close className="py-2.5 transition active:bg-accent">
                {cancelLabel}
              </AlertDialog.Close>
              <AlertDialog.Close
                onClick={onAction}
                className="py-2.5 font-semibold transition active:bg-accent"
              >
                {actionLabel}
              </AlertDialog.Close>
            </div>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export default IosAlertDialog;
