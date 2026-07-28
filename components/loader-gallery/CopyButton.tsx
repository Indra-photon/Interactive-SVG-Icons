"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "motion/react";
import { CheckIcon, CopyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface CopyButtonProps {
  /** Static content to copy. Ignored when `getText` is provided. */
  text?: string;
  /** Shown on the button instead of `text` (e.g. "copy usage"). */
  label?: string;
  /** Async resolver for content that must be built on click (e.g. source). */
  getText?: () => Promise<string>;
  /** Button height. Defaults to "lg" (installation); "xs" for compact copy actions. */
  size?: "lg" | "xs";
}

export function CopyButton({
  text,
  label,
  getText,
  size = "lg",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const value = getText ? await getText() : (text ?? "");
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const display = label ?? text ?? "";
  const compact = size === "xs";

  const icon = (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={copied ? "check" : "copy"}
        initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
        transition={{ type: "spring", duration: 0.3, bounce: 0 }}
      >
        {copied ? (
          <HugeiconsIcon icon={CheckIcon} className="text-white" />
        ) : (
          <HugeiconsIcon icon={CopyIcon} className="text-white" />
        )}
      </motion.div>
    </AnimatePresence>
  );

  // Compact (xs): text and icon sit together, centered — no pinned chip.
  if (compact) {
    return (
      <Button
        asChild
        size={size}
        variant="ghost"
        onClick={handleCopy}
        className="corner-squircle rounded-[10px] font-mono text-xs tracking-tighter"
      >
        <div className="flex items-center justify-center gap-1.5">
          <span className="whitespace-nowrap">{display}</span>
          <span className="corner-squircle inline-flex items-center justify-center rounded-[6px] p-0.5 text-white">
            {icon}
          </span>
        </div>
      </Button>
    );
  }

  return (
    <Button
      asChild
      size={size}
      variant="ghost"
      onClick={handleCopy}
      className="corner-squircle w-full min-w-0 rounded-[10px] font-mono text-left text-xs tracking-tighter relative overflow-hidden"
    >
      <div className="w-full min-w-0">
        <span
          className="flex-1 overflow-hidden whitespace-nowrap block"
          style={{
            maskImage: "linear-gradient(to right, black 55%, transparent 90%)",
          }}
        >
          {display}
        </span>
        <span className="corner-squircle rounded-[10px] absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold bg-white/20 p-2 tracking-normal text-white">
          {icon}
        </span>
      </div>
    </Button>
  );
}
