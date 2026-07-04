"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TrashIconBounce } from "../bounce";

const buttonCopy = {
  idle: "Delete",
  loading: "Deleting...",
  success: "Deleted!",
};

export function BounceDeleteButton() {
  const [buttonState, setButtonState] =
    useState<keyof typeof buttonCopy>("idle");

  const handleDelete = () => {
    if (buttonState === "success") return;

    setButtonState("loading");

    // ⚠️ DEMO ONLY: Using setTimeout to simulate backend API call
    // In your real application, replace this with your actual backend logic:
    //
    // Example with fetch:
    // const response = await fetch('/api/delete', { method: 'DELETE' });
    // setButtonState('success');
    //
    // Example with React Query:
    // const { mutate, isPending } = useMutation({ ... });
    // <TrashIconBounce isAnimating={isPending} />
    //
    setTimeout(() => {
      setButtonState("success");
    }, 1750);

    setTimeout(() => {
      setButtonState("idle");
    }, 3500);
  };

  return (
    <motion.button
      onClick={handleDelete}
      disabled={buttonState === "loading"}
      layout
      className="w-32 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 25 }}
          key={`icon-${buttonState}`}
          className="inline-flex"
        >
          <TrashIconBounce size={20} isAnimating={buttonState === "loading"} />
        </motion.span>
      </AnimatePresence>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 25 }}
          key={buttonState}
        >
          {buttonCopy[buttonState]}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
