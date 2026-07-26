"use client";

import { AlertDialog } from "@base-ui-components/react/alert-dialog";
import type { ReactNode } from "react";

export interface TerminalAlertDialogProps {
  triggerLabel?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  cancelLabel?: ReactNode;
  actionLabel?: ReactNode;
  onAction?: () => void;
  /** Clip-path unroll duration in ms. Default 350. */
  duration?: number;
  className?: string;
}

/**
 * Terminal — a CRT power-on. The popup opens from a center horizontal line via
 * clip-path inset, unrolling vertically. It's a self-contained "screen", so the
 * green-on-black identity stays constant regardless of the site theme; the
 * trigger uses theme tokens so it sits naturally on both.
 */
export function TerminalAlertDialog({
  triggerLabel = "Run command",
  title = "sudo rm -rf /production",
  description = "This operation will wipe 1,204 records. Type-safe confirmation required.",
  cancelLabel = "[esc] abort",
  actionLabel = "[y] execute",
  onAction,
  duration = 350,
  className = "",
}: TerminalAlertDialogProps = {}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger className="rounded-sm border border-border bg-foreground px-4 py-2 font-mono text-sm text-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        {triggerLabel}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-40 bg-black/80 transition-opacity duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <AlertDialog.Popup
          style={{
            transition: `clip-path ${duration}ms cubic-bezier(0.76,0,0.24,1), opacity ${Math.round(duration * 0.4)}ms`,
          }}
          className={`fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border border-green-500/40 bg-[#0a0f0a] font-mono shadow-[0_0_40px_-10px] shadow-green-500/40 [clip-path:inset(0_0_0_0)] data-[starting-style]:opacity-40 data-[starting-style]:[clip-path:inset(50%_0_50%_0)] data-[ending-style]:opacity-40 data-[ending-style]:[clip-path:inset(50%_0_50%_0)] ${className}`}
        >
          <div className="flex items-center gap-2 border-b border-green-500/20 px-4 py-2 text-xs text-green-500/60">
            <span className="size-2.5 rounded-full bg-red-500/70" />
            <span className="size-2.5 rounded-full bg-yellow-500/70" />
            <span className="size-2.5 rounded-full bg-green-500/70" />
            <span className="ml-2">root@system: ~/danger</span>
          </div>
          <div className="p-4 sm:p-5">
            <AlertDialog.Title className="text-sm text-green-400">
              <span className="text-green-600">$</span> {title}
              <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-green-400" />
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-xs leading-relaxed text-green-500/60">
              <span className="text-red-400">[WARN]</span> {description}
            </AlertDialog.Description>
            <div className="mt-5 flex justify-end gap-2 text-xs">
              <AlertDialog.Close className="rounded-sm border border-green-500/30 px-3 py-1.5 text-green-400 transition hover:bg-green-500/10">
                {cancelLabel}
              </AlertDialog.Close>
              <AlertDialog.Close
                onClick={onAction}
                className="rounded-sm border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-red-400 transition hover:bg-red-500/20"
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

export default TerminalAlertDialog;
