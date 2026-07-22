"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Sun01Icon,
  Moon02Icon,
  Settings01Icon,
  Archive02Icon,
} from "@hugeicons/core-free-icons";
import { navlinks } from "@/constants/navlinks";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-8 h-8" />;

  // resolvedTheme, not theme — under "system" the icon must reflect the OS choice
  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center w-8 h-8 rounded-md text-nav-foreground-muted hover:text-nav-foreground transition-colors"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      whileTap={{ scale: 0.96 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{
              opacity: 0,
              rotate: -90,
              scale: 0.5,
              filter: "blur(6px)",
            }}
            animate={{ opacity: 1, rotate: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5, filter: "blur(6px)" }}
            transition={{ duration: 0.1 }}
          >
            <HugeiconsIcon
              icon={Sun01Icon}
              size={16}
              strokeWidth={1.5}
              color="currentColor"
            />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{
              opacity: 0,
              rotate: 90,
              scale: 0.5,
              filter: "blur(6px)",
            }}
            animate={{ opacity: 1, rotate: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5, filter: "blur(6px)" }}
            transition={{ duration: 0.1 }}
          >
            <HugeiconsIcon
              icon={Moon02Icon}
              size={16}
              strokeWidth={1.5}
              color="currentColor"
            />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function NavBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  const activeItem = navlinks.find((l) => l.url === pathname) ?? navlinks[0];

  useEffect(() => {
    setIsExpanded(false);
  }, [pathname]);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-nav-surface w-full overflow-visible">
        {/* h-10 = the visible black strip height. Pill and card hang below via top-full */}
        <div className="relative h-6 w-full">
          {/* Collapsed pill — always in DOM, exact same pattern as BottomFilterBar */}
          <motion.div
            layoutId="nav-pill"
            layout
            onClick={() => setIsExpanded(true)}
            transition={{ type: "spring", duration: 0.25, bounce: 0.2 }}
            style={{
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18,
              width: isExpanded
                ? "min(300px, calc(100vw - 48px))"
                : "min(240px, calc(100vw - 48px))",
              pointerEvents: isExpanded ? "none" : "auto",
            }}
            className="corner-squircle absolute top-[-2px] right-0 left-0 z-20 mx-auto flex h-12 cursor-pointer items-center justify-between gap-2 bg-nav-surface px-4 shadow-2xl select-none"
          >
            <AnimatePresence mode="wait" initial={false}>
              {!isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 2, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 2, filter: "blur(6px)" }}
                  transition={{ type: "spring", duration: 0.15, bounce: 0.1 }}
                  className="flex w-full items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      layoutId="nav-active-icon"
                      transition={{
                        type: "spring",
                        duration: 0.25,
                        bounce: 0.2,
                      }}
                      className="flex-shrink-0 text-nav-foreground bg-nav-surface"
                    >
                      <HugeiconsIcon
                        icon={Archive02Icon}
                        size={18}
                        className="text-nav-foreground"
                        strokeWidth={2}
                      />
                    </motion.div>
                    <motion.span
                      layoutId="nav-active-label"
                      transition={{
                        type: "spring",
                        duration: 0.25,
                        bounce: 0.2,
                      }}
                      className="text-sm font-regular  tracking-tighter text-nav-foreground antialiased"
                    >
                      Explore Craft UI
                    </motion.span>
                  </div>

                  {/* stopPropagation: the pill itself expands the nav on click */}
                  <motion.div
                    layoutId="nav-theme-toggle"
                    transition={{ type: "spring", duration: 0.25, bounce: 0.2 }}
                    className="flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ThemeToggle />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Expanded card */}
          <AnimatePresence mode="popLayout">
            {isExpanded && (
              <motion.div
                layoutId="nav-pill"
                key="expanded"
                transition={{ type: "spring", duration: 0.35, bounce: 0.3 }}
                style={{
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                }}
                className="absolute top-[-2px] right-0 left-0 mx-auto z-20 w-[min(300px,calc(100vw-48px))] overflow-hidden bg-nav-surface"
              >
                {/* Single fade wrapper around everything — exact same as BottomFilterBar */}
                <motion.div
                  initial={{ opacity: 0, filter: "blur(6px)" }}
                  animate={{
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: {
                      duration: 0.24,
                      ease: "easeOut",
                      delay: 0.08,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    filter: "blur(6px)",
                    transition: { duration: 0.06, ease: "easeOut" },
                  }}
                >
                  {/* Header row — layoutId elements match pill, same as reference */}
                  <div
                    className="flex h-12 cursor-pointer items-center gap-2 px-4"
                    onClick={() => setIsExpanded(false)}
                  >
                    <motion.div
                      layoutId="nav-active-icon"
                      transition={{
                        type: "spring",
                        duration: 0.25,
                        bounce: 0.2,
                      }}
                      className="flex-shrink-0 text-nav-foreground"
                    >
                      <HugeiconsIcon
                        icon={Archive02Icon}
                        size={18}
                        color="currentColor"
                        strokeWidth={2}
                      />
                    </motion.div>
                    <motion.span
                      layoutId="nav-active-label"
                      transition={{
                        type: "spring",
                        duration: 0.25,
                        bounce: 0.2,
                      }}
                      className="text-sm font-sans font-regular tracking-tighter text-nav-foreground antialiased"
                    >
                      Explore Craft UI
                    </motion.span>

                    <div className="flex-1" />

                    {/* stopPropagation: the header row collapses the nav on click */}
                    <motion.div
                      layoutId="nav-theme-toggle"
                      transition={{
                        type: "spring",
                        duration: 0.25,
                        bounce: 0.2,
                      }}
                      className="flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ThemeToggle />
                    </motion.div>
                  </div>

                  {/* Divider */}
                  <div className="mx-4 h-px bg-nav-border" />

                  {/* Nav list */}
                  <motion.div className="flex flex-col px-2.5 pt-2 pb-2">
                    {navlinks.map((item) => {
                      const isActive = item.url === pathname;
                      return (
                        <motion.div
                          key={item.label}
                          whileTap={{ scale: 0.97 }}
                          className="group relative flex cursor-pointer items-center gap-1 hover:bg-nav-hover rounded-[13px] px-3 py-2.5 text-left select-none"
                        >
                          <Link
                            href={item.url}
                            onClick={() => setIsExpanded(false)}
                            className="relative flex w-full items-center gap-3"
                          >
                            <span
                              className={cn(
                                "relative flex-shrink-0 transition-colors",
                                isActive
                                  ? "text-nav-foreground"
                                  : "text-nav-foreground-muted group-hover:text-nav-foreground",
                              )}
                            >
                              <HugeiconsIcon
                                icon={item.icon}
                                size={20}
                                strokeWidth={1.5}
                                color="currentColor"
                              />
                            </span>
                            <span className="relative antialiased transition-colors font-sans text-sm font-regular tracking-tighter text-nav-foreground antialiased">
                              {item.label}
                            </span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
}
