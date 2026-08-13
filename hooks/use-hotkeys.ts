"use client";

import { useEffect, useRef } from "react";

export type Hotkey = {
  /** Single character, compared case-insensitively (e.g. "k", "d"). */
  key: string;
  /** Require ⌘ on macOS / Ctrl elsewhere. */
  mod?: boolean;
  shift?: boolean;
  /**
   * Bare keys are ignored while the user is typing. Mod-combos fire anywhere
   * (⌘K should still work from inside the gallery search box).
   */
  handler: (event: KeyboardEvent) => void;
};

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return (
    el?.tagName === "INPUT" ||
    el?.tagName === "TEXTAREA" ||
    el?.isContentEditable === true
  );
}

export function useHotkeys(hotkeys: Hotkey[]) {
  // Ref so callers don't have to memoize the array on every render.
  const hotkeysRef = useRef(hotkeys);

  useEffect(() => {
    hotkeysRef.current = hotkeys;
  });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat) return;

      for (const hotkey of hotkeysRef.current) {
        if (event.key.toLowerCase() !== hotkey.key.toLowerCase()) continue;

        const mod = event.metaKey || event.ctrlKey;
        if (Boolean(hotkey.mod) !== mod) continue;
        if (Boolean(hotkey.shift) !== event.shiftKey) continue;
        if (event.altKey) continue;
        if (!hotkey.mod && isTypingTarget(event.target)) continue;

        event.preventDefault();
        hotkey.handler(event);
        return;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
