"use client";

import { useEffect, useState, useCallback } from "react";

export function useDialKitPanel() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const inner = document.querySelector(".dialkit-panel-inner");
    if (!inner) return;

    // Read initial state
    setIsOpen(inner.getAttribute("data-collapsed") !== "true");

    const observer = new MutationObserver(() => {
      setIsOpen(inner.getAttribute("data-collapsed") !== "true");
    });

    observer.observe(inner, {
      attributes: true,
      attributeFilter: ["data-collapsed"],
    });

    return () => observer.disconnect();
  }, []);

  const toggle = useCallback(() => {
    const header = document.querySelector(
      ".dialkit-panel-header",
    ) as HTMLElement | null;
    header?.click();
  }, []);

  return { isOpen, toggle };
}
