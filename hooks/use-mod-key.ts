"use client";

import { useSyncExternalStore } from "react";

// Server renders the pre-hydration snapshot; the client renders `true`.
// useSyncExternalStore rather than useEffect(setMounted) — the React Compiler
// lint rules reject setState inside an effect body.
const subscribeToNothing = () => () => {};
const getMounted = () => true;
const getMountedOnServer = () => false;

/**
 * Whether the component has hydrated. Use it to gate anything that reads from
 * `navigator`, `window`, or resolved theme, so SSR and first client render match.
 */
export function useMounted() {
  return useSyncExternalStore(
    subscribeToNothing,
    getMounted,
    getMountedOnServer
  );
}

/** The label for the platform's shortcut modifier: "⌘" on Apple, "Ctrl" elsewhere. */
export function useModKey() {
  const mounted = useMounted();
  const isMac = mounted ? /Mac|iPhone|iPad/.test(navigator.userAgent) : true;

  return { modKey: isMac ? "⌘" : "Ctrl", mounted };
}
