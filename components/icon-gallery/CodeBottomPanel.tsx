"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { CopyButton } from "./CopyButton";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface CodeBottomPanelProps {
  open: boolean;
  onClose: () => void;
  code: string;
  title?: string;
  left?: number;
  width?: number;
}

export function CodeBottomPanel({
  open,
  onClose,
  code,
  title = "Component Code",
  left,
  width,
}: CodeBottomPanelProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence initial={false}>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { ease: EASE, duration: 0.2 } }}
            exit={{
              opacity: 0,
              transition: { type: "spring", bounce: 0, duration: 0.35 },
            }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            className="fixed bottom-2 z-50 flex flex-col corner-squircle rounded-[10px] bg-background shadow-[0_-4px_32px_rgba(0,0,0,0.12)] max-h-[70vh]"
            style={
              left !== undefined && width !== undefined
                ? { left, width }
                : { left: 0, right: 0 }
            }
            initial={{ y: "100%", opacity: 0, filter: "blur(2px)" }}
            animate={{
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              transition: { ease: EASE, duration: 0.2 },
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              filter: "blur(2px)",
              transition: { type: "spring", bounce: 0, duration: 0.35 },
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-stone-600" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-end px-6 py-3 shrink-0">
              <button
                onClick={onClose}
                className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={15}
                  strokeWidth={1.5}
                  className="text-stone-900 dark:text-stone-300"
                />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-stone-100 dark:bg-stone-800 shrink-0 mx-6" />

            {/* Code block */}
            <div className="overflow-y-auto px-6 py-4 flex-1 min-h-0 relative">
              <div className="bg-background border border-border text-foreground corner-squircle rounded-[15px] font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre p-5">
                {code}
              </div>
              <div className="absolute top-8 right-10 w-[120px]">
                <CopyButton buttonText="Copy Code" text={code} />
              </div>
            </div>

            {/* Footer */}
            {/* <div className="px-6 py-4 shrink-0">
              <CopyButton text={code} />
            </div> */}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
