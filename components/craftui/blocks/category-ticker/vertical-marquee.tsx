"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

const DEFAULT_ITEMS = [
  "Garden",
  "Toys",
  "Antiques",
  "Comics",
  "Sports",
  "Electronics",
  "Fashion",
  "Motors",
  "Collectibles",
  "Home & Garden",
  "Business & Industrial",
  "Health & Beauty",
];

const ACTIVE_ROW = 2;
const ARROW_OFFSET = 88;

interface CategoryTickerProps {
  items?: string[];
  backgroundColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  intervalMs?: number;
  rowHeight?: number;
}

export default function CategoryTickerVerticalMarquee({
  items = DEFAULT_ITEMS,
  backgroundColor = "#F5C518",
  activeColor = "#1a0f00",
  inactiveColor = "#b38a00",
  intervalMs = 1800,
  rowHeight = 110,
}: CategoryTickerProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(ACTIVE_ROW);
  const isResetting = useRef(false);

  const extended = [...items, ...items.slice(0, ACTIVE_ROW + 2)];
  const totalItems = items.length;

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
    }, intervalMs);
    return () => clearInterval(id);
  }, [totalItems, intervalMs]);

  const yOffset = -(activeIndex - ACTIVE_ROW) * rowHeight;

  const scrollTransition =
    shouldReduceMotion || isResetting.current
      ? { duration: 0 }
      : {
          type: "tween" as const,
          ease: [0.645, 0.045, 0.355, 1] as const,
          duration: 0.55,
        };

  const wordTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        type: "tween" as const,
        ease: [0.645, 0.045, 0.355, 1] as const,
        duration: 0.55,
      };

  const activeFontSize = Math.round(rowHeight * 0.655);
  const inactiveFontSize = Math.round(rowHeight * 0.582);

  return (
    <div
      className="box-border flex min-h-screen w-full flex-col overflow-hidden px-8 py-6 font-sans"
      style={{ backgroundColor }}
    >
      <div className="flex flex-1 gap-8 overflow-hidden">
        <div
          className="relative flex-1 overflow-hidden"
          style={{ height: rowHeight * 5 }}
        >
          {/* Arrow — fixed at the active row, never moves */}
          <div
            className="pointer-events-none absolute left-0 z-10 flex items-center"
            style={{
              top: ACTIVE_ROW * rowHeight,
              height: rowHeight,
              width: ARROW_OFFSET,
            }}
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={64}
              color={activeColor}
              strokeWidth={2}
            />
          </div>

          {/* Scrolling word list */}
          <motion.div
            animate={{ y: yOffset }}
            transition={scrollTransition}
            className="absolute top-0 left-0 w-full"
            aria-live="polite"
            aria-atomic="true"
          >
            {extended.map((item, i) => {
              const isActive = i === activeIndex;
              return (
                <div
                  key={`${item}-${i}`}
                  className="flex items-center overflow-visible"
                  style={{ height: rowHeight }}
                  aria-hidden={!isActive}
                >
                  <motion.span
                    animate={{
                      x: isActive ? ARROW_OFFSET : 0,
                      color: isActive ? activeColor : inactiveColor,
                      opacity: isActive ? 1 : 0.58,
                      fontSize: isActive ? activeFontSize : inactiveFontSize,
                      fontWeight: isActive ? 800 : 500,
                    }}
                    transition={wordTransition}
                    className="block leading-none tracking-tight whitespace-nowrap"
                  >
                    {item}
                  </motion.span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
