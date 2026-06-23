"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ITEMS = [
  "Accordion",
  "Alert Dialog",
  "Autocomplete",
  "Avatar",
  "Button",
  "Checkbox",
  "Checkbox Group",
  "Collapsible",
  "Combobox",
  "Context Menu",
  "Dialog",
  "Drawer",
  "Field",
  "Fieldset",
  "Form",
  "Input",
  "Menu",
  "Menubar",
  "Meter",
  "Navigation Menu",
  "Number Field",
  "OTP Field",
  "Popover",
  "Preview Card",
  "Progress",
  "Radio",
  "Select",
  "Slider",
  "Switch",
  "Tabs",
  "Toast",
  "Toggle",
  "Tooltip",
  "Tree View",
];

const ROW_HEIGHT = 44;
const ACTIVE_ROW = 2;
const INTERVAL_MS = 1400;

export function HeroComponentTicker() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(ACTIVE_ROW);
  const isResetting = useRef(false);

  const extended = [...ITEMS, ...ITEMS.slice(0, ACTIVE_ROW + 2)];
  const totalItems = ITEMS.length;

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev + 1;
        if (next >= totalItems + ACTIVE_ROW) {
          isResetting.current = true;
          return ACTIVE_ROW;
        }
        isResetting.current = false;
        return next;
      });
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [totalItems]);

  const yOffset = -(activeIndex - ACTIVE_ROW) * ROW_HEIGHT;

  const scrollTransition =
    shouldReduceMotion || isResetting.current
      ? { duration: 0 }
      : {
          type: "tween" as const,
          ease: [0.645, 0.045, 0.355, 1] as const,
          duration: 0.5,
        };

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 w-[220px] opacity-[0.85]"
      style={{
        height: ROW_HEIGHT * 5,
        maskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 30%, transparent 100%)",
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={{ y: yOffset }}
        transition={scrollTransition}
        className="absolute top-0 left-0 w-full"
      >
        {extended.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={`${item}-${i}`}
              className="flex items-center px-3"
              style={{ height: ROW_HEIGHT }}
            >
              <motion.span
                animate={{
                  opacity: isActive ? 1 : 0.28,
                  fontWeight: isActive ? 600 : 400,
                }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.35, ease: "easeOut" }
                }
                className="text-2xl font-sans tracking-tighter text-foreground leading-none truncate w-full"
                style={
                  isActive
                    ? {
                        // boxShadow:
                        //   "0 0 0 1px rgba(38,38,38,0.18), 0 1px 3px rgba(38,38,38,0.06)",
                        borderRadius: 8,
                        padding: "6px 10px",
                        display: "block",
                      }
                    : { display: "block", padding: "6px 10px" }
                }
              >
                {item}
              </motion.span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
