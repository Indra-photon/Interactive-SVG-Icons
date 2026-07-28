"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "motion/react";
import { CheckIcon, CopyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

interface CopyButtonProps {
  buttonText?: string;
  text: string;
}

export function CopyButton({ text, buttonText = text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      asChild
      size="lg"
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
          {buttonText || "Copy to Clipboard"}
        </span>
        <span className="corner-squircle rounded-[10px] absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold bg-primary/30 p-2 tracking-normal text-neutral-900 dark:text-stone-500">
          {/* {copied ? "Copied!" : "Copy"} */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={copied ? "check" : "copy"}
              initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              transition={{
                type: "spring",
                duration: 0.3,
                bounce: 0,
              }}
            >
              {copied ? (
                <HugeiconsIcon icon={CheckIcon} className="text-white/70" />
              ) : (
                <HugeiconsIcon icon={CopyIcon} className="text-white/70" />
              )}
            </motion.div>
          </AnimatePresence>
        </span>
      </div>
    </Button>
  );
}
