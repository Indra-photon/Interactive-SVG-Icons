"use client";

import { AlertDialog } from "@base-ui-components/react/alert-dialog";
import type { ReactNode } from "react";

export interface SlamAlertDialogProps {
  triggerLabel?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  cancelLabel?: ReactNode;
  actionLabel?: ReactNode;
  onAction?: () => void;
  /** Overshoot slam (enter) duration in ms. Default 320. */
  duration?: number;
  className?: string;
}

/**
 * Slam — neo-brutalist. The card drops in with a back-out spring, scaling from
 * 80% with a vertical offset so it overshoots and settles, then dismisses fast
 * with a plain ease-out (no overshoot on the way out). Hard offset shadows and
 * borders are drawn with the theme's foreground color, so the whole block
 * inverts correctly in dark mode. Honors prefers-reduced-motion.
 */
export function SlamAlertDialog({
  triggerLabel = "Delete it",
  title = "Are you sure?!",
  description = "Once you hit that button there's no going back. No takesies backsies.",
  cancelLabel = "Nope",
  actionLabel = "Do it!",
  onAction,
  duration = 320,
  className = "",
}: SlamAlertDialogProps = {}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger className="border-[3px] border-foreground bg-yellow-300 px-4 py-2 text-sm font-black uppercase tracking-tight text-black shadow-[4px_4px_0_0_var(--foreground)] transition active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        {triggerLabel}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-40 bg-black/60 transition-opacity duration-[250ms] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[ending-style]:duration-[160ms] motion-reduce:transition-none" />
        <AlertDialog.Popup className="group fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 transition-opacity duration-[250ms] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[ending-style]:duration-[160ms] motion-reduce:transition-none">
          <div
            style={{
              transitionDuration: `${duration}ms`,
              transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
            }}
            className={`border-[3px] border-foreground bg-card p-5 text-card-foreground shadow-[8px_8px_0_0_var(--foreground)] [transition-property:transform] group-data-[starting-style]:[transform:scale(0.8)_translateY(-40px)] group-data-[ending-style]:[transform:scale(0.96)] group-data-[ending-style]:!duration-[160ms] group-data-[ending-style]:![transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:!transition-none sm:p-6 ${className}`}
          >
            <AlertDialog.Title className="text-lg font-black uppercase text-foreground sm:text-xl">
              {title}
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm font-semibold text-muted-foreground">
              {description}
            </AlertDialog.Description>
            <div className="mt-6 flex gap-3">
              <AlertDialog.Close className="flex-1 border-[3px] border-foreground bg-background px-4 py-2 text-sm font-black uppercase text-foreground shadow-[3px_3px_0_0_var(--foreground)] transition active:translate-x-1 active:translate-y-1 active:shadow-none">
                {cancelLabel}
              </AlertDialog.Close>
              <AlertDialog.Close
                onClick={onAction}
                className="flex-1 border-[3px] border-foreground bg-lime-400 px-4 py-2 text-sm font-black uppercase text-black shadow-[3px_3px_0_0_var(--foreground)] transition active:translate-x-1 active:translate-y-1 active:shadow-none"
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

export default SlamAlertDialog;
