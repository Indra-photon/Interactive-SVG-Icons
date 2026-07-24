"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import React from "react";

export interface ThemeOption {
  id: string;
  label: string;
  /** 1–3 hex colors — the first is the collapsed swatch, all render as a stack. */
  dots: string[];
}

export interface FontOption {
  id: string;
  label: string;
  /** A CSS font-family stack; used both to preview the glyph and as the value. */
  stack: string;
}

export interface ThemeButtonProps {
  /** Theme list, or a function returning it. Falls back to the built-in set. */
  themes?: ThemeOption[] | (() => ThemeOption[]);
  /** Font list, or a function returning it. Falls back to the built-in set. */
  fonts?: FontOption[] | (() => FontOption[]);

  /** Uncontrolled initial selection (by id). */
  defaultThemeId?: string;
  defaultFontId?: string;

  /** Controlled selection (by id). When set, that dimension is controlled. */
  themeId?: string;
  fontId?: string;

  /** Fires with the full option after a pick. Do whatever you want with it. */
  onThemeChange?: (theme: ThemeOption) => void;
  onFontChange?: (font: FontOption) => void;
  /** Fires when the menu opens ("font" | "theme") or closes (null). */
  onOpenChange?: (mode: Mode | null) => void;

  /** Label next to the spinner. Default "Process". */
  processLabel?: string;
  /** Hide the spinner + label segment entirely. Default true. */
  showProcess?: boolean;
  /** Extra classes merged onto the pill shell. */
  className?: string;
}

const DEFAULT_THEMES: ThemeOption[] = [
  { id: "brand", label: "Brand", dots: ["#2f6bff", "#4f8bff", "#1f4fd8"] },
  { id: "indigo", label: "Indigo", dots: ["#4f46e5", "#6366f1", "#3730a3"] },
  { id: "yellow", label: "Yellow", dots: ["#eab308", "#facc15", "#ca8a04"] },
  { id: "pink", label: "Pink", dots: ["#ec4899", "#f472b6", "#db2777"] },
  { id: "rose", label: "Rose", dots: ["#f43f5e", "#fb7185", "#e11d48"] },
];

const DEFAULT_FONTS: FontOption[] = [
  {
    id: "geist",
    label: "Geist",
    stack: "'Geist', ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "inter",
    label: "Inter",
    stack: "'Inter', ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "grotesk",
    label: "Space Grotesk",
    stack: "'Space Grotesk', ui-sans-serif, sans-serif",
  },
  {
    id: "playfair",
    label: "Playfair",
    stack: "'Playfair Display', ui-serif, Georgia, serif",
  },
  {
    id: "merriweather",
    label: "Merriweather",
    stack: "'Merriweather', ui-serif, Georgia, serif",
  },
];

// ease-out-cubic: content is entering/exiting, so it should feel instant then settle
const EASE_OUT = [0.215, 0.61, 0.355, 1] as const;

// Apple-style spring config: perceptual duration + bounce, rather than mass/stiffness/damping.
// The shell grows (bigger element, longer travel) so expand is slower; collapse is ~30% faster.
const EXPAND_SPRING = { type: "spring", duration: 0.4, bounce: 0.16 } as const;
const COLLAPSE_SPRING = { type: "spring", duration: 0.28, bounce: 0 } as const;

// Content crossfade: enter reads at full length, exit is ~25% faster so it clears the morph.
const CONTENT_IN = { duration: 0.2, ease: EASE_OUT } as const;
const CONTENT_OUT = { duration: 0.15, ease: EASE_OUT } as const;

const SHELL_ID = "theme-morph-shell";

export type Mode = "font" | "theme";

function resolveList<T>(
  input: T[] | (() => T[]) | undefined,
  fallback: T[],
): T[] {
  if (!input) return fallback;
  const list = typeof input === "function" ? input() : input;
  return list.length > 0 ? list : fallback;
}

function Dots({ colors, size = 18 }: { colors: string[]; size?: number }) {
  return (
    <span className="flex items-center" aria-hidden="true">
      {colors.map((c, i) => (
        <span
          key={c + i}
          // ring color tracks the popover surface so the dots read on both themes
          className="rounded-full shadow-[0_0_0_2px_var(--popover)]"
          style={{
            width: size,
            height: size,
            background: c,
            marginLeft: i === 0 ? 0 : -size * 0.28,
          }}
        />
      ))}
    </span>
  );
}

// Font swatch — the "Ag" is rendered in the option's own family so the glyph
// previews the typeface, mirroring how Dots previews a color.
function FontGlyph({ stack }: { stack: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-border text-[13px] leading-none"
      style={{ fontFamily: stack }}
    >
      Ag
    </span>
  );
}

// ── Inlined iOS "pulse" spinner (full loader code, no external import) ────────
// Copied in verbatim so the block is self-contained on download.
function IosSpinnerPulse({
  width = 18,
  height = 18,
  color = "currentColor",
  isAnimating = true,
  duration = 1.0,
  ease = "easeOut",
}: {
  width?: number;
  height?: number;
  color?: string;
  isAnimating?: boolean;
  duration?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ease?: any;
}) {
  const count = 12;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="img"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.rect
          key={i}
          x={48.5}
          y={26}
          width={3}
          height={10}
          rx={1.5}
          fill={color}
          transform={`rotate(${(360 / count) * i}, 50, 50)`}
          initial={{ opacity: 0.1 }}
          animate={{ opacity: isAnimating ? [0.1, 1, 0.35, 0.1] : 0.35 }}
          transition={{
            duration,
            repeat: isAnimating ? Infinity : 0,
            delay: i * (duration / count),
            ease,
            times: [0, 0.08, 0.3, 1],
          }}
        />
      ))}
    </svg>
  );
}

function ThemeButton({
  themes: themesProp,
  fonts: fontsProp,
  defaultThemeId,
  defaultFontId,
  themeId,
  fontId,
  onThemeChange,
  onFontChange,
  onOpenChange,
  processLabel = "Process",
  showProcess = true,
  className = "",
}: ThemeButtonProps = {}) {
  const themes = React.useMemo(
    () => resolveList(themesProp, DEFAULT_THEMES),
    [themesProp],
  );
  const fonts = React.useMemo(
    () => resolveList(fontsProp, DEFAULT_FONTS),
    [fontsProp],
  );

  const [expanded, setExpanded] = React.useState<Mode | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const reduceMotion = useReducedMotion();

  const menuRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const fontTriggerRef = React.useRef<HTMLButtonElement>(null);
  const themeTriggerRef = React.useRef<HTMLButtonElement>(null);
  // Which trigger to return focus to when the menu closes (null = don't steal
  // focus, e.g. on outside-pointer dismissal where focus already moved).
  const restoreFocusRef = React.useRef<Mode | null>(null);

  // Per-dimension controllable state: controlled when the *Id prop is passed,
  // otherwise uncontrolled starting from default*Id (or the first option).
  const isThemeControlled = themeId !== undefined;
  const isFontControlled = fontId !== undefined;
  const [themeIdState, setThemeIdState] = React.useState(
    defaultThemeId ?? themes[0]?.id,
  );
  const [fontIdState, setFontIdState] = React.useState(
    defaultFontId ?? fonts[0]?.id,
  );

  const currentThemeId = isThemeControlled ? themeId : themeIdState;
  const currentFontId = isFontControlled ? fontId : fontIdState;
  const selectedTheme =
    themes.find((t) => t.id === currentThemeId) ?? themes[0];
  const selectedFont = fonts.find((f) => f.id === currentFontId) ?? fonts[0];

  // The list currently shown in the open menu.
  const items = expanded === "theme" ? themes : fonts;

  const openMenu = (mode: Mode) => {
    // Seed the roving index at the current selection so focus lands on it.
    const idx =
      mode === "theme"
        ? themes.findIndex((t) => t.id === currentThemeId)
        : fonts.findIndex((f) => f.id === currentFontId);
    setActiveIndex(idx >= 0 ? idx : 0);
    restoreFocusRef.current = mode; // return focus here on close
    setExpanded(mode);
    onOpenChange?.(mode);
  };

  const closeMenu = (restore: boolean) => {
    if (!restore) restoreFocusRef.current = null;
    setExpanded(null);
    onOpenChange?.(null);
  };

  const selectTheme = (theme: ThemeOption) => {
    if (!isThemeControlled) setThemeIdState(theme.id);
    onThemeChange?.(theme);
    closeMenu(true);
  };

  const selectFont = (font: FontOption) => {
    if (!isFontControlled) setFontIdState(font.id);
    onFontChange?.(font);
    closeMenu(true);
  };

  const isExpanded = expanded !== null;

  // Dismiss on outside click (no focus restore) or Escape (restore to trigger).
  // Listeners attach only while open, after the opening click has resolved.
  React.useEffect(() => {
    if (!isExpanded) return;
    const onPointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu(true);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  // On open: move focus into the menu (onto the active item). APG menu pattern.
  React.useEffect(() => {
    if (expanded === null) return;
    const raf = requestAnimationFrame(() => {
      itemRefs.current[activeIndex]?.focus();
    });
    return () => cancelAnimationFrame(raf);
    // Runs when the menu opens; activeIndex is already seeded by openMenu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  // On close: return focus to the trigger that opened the menu (Escape / select),
  // unless dismissal explicitly opted out (outside pointer).
  React.useEffect(() => {
    if (expanded !== null) return;
    const mode = restoreFocusRef.current;
    if (!mode) return;
    restoreFocusRef.current = null;
    const raf = requestAnimationFrame(() => {
      (mode === "font" ? fontTriggerRef : themeTriggerRef).current?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [expanded]);

  // Roving arrow-key navigation inside the open menu.
  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const count = items.length;
    if (count === 0) return;
    let next = activeIndex;
    switch (e.key) {
      case "ArrowDown":
        next = (activeIndex + 1) % count;
        break;
      case "ArrowUp":
        next = (activeIndex - 1 + count) % count;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = count - 1;
        break;
      default:
        return; // Enter/Space handled by the focused <button> natively
    }
    e.preventDefault();
    setActiveIndex(next);
    itemRefs.current[next]?.focus();
  };

  const shellTransition = reduceMotion
    ? { duration: 0 }
    : isExpanded
      ? EXPAND_SPRING
      : COLLAPSE_SPRING;
  const contentIn = reduceMotion ? { duration: 0 } : CONTENT_IN;
  const contentOut = reduceMotion ? { duration: 0 } : CONTENT_OUT;

  return (
    <>
      {/* ---------- COLLAPSED ---------- */}
      <AnimatePresence mode="popLayout">
        {!isExpanded && (
          <motion.div
            key="collapsed"
            layoutId={SHELL_ID}
            transition={shellTransition}
            // No overflow-hidden here: at rest nothing overflows the pill, and
            // it would clip the focus ring on the edge-filling triggers.
            className={`flex select-none items-center gap-5 rounded-[34px] border border-border bg-popover text-popover-foreground shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] ${className}`}
            // morph-driven values stay inline so layoutId can interpolate them
            style={{ borderRadius: 34, padding: "16px 26px" }}
          >
            <motion.div
              layout="position"
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)", transition: contentOut }}
              transition={contentIn}
              className="flex items-center gap-5 text-base"
            >
              {/* Font segment — opens the typeface picker. The -my-4/py-4 +
                  -mx-2/px-2 grow the hit area to fill the segment (full pill
                  height) without shifting the visible layout. */}
              <button
                ref={fontTriggerRef}
                onClick={() => openMenu("font")}
                aria-haspopup="menu"
                aria-expanded={expanded === "font"}
                aria-label={`Font: ${selectedFont?.label}`}
                translate="no"
                className="-mx-2 -my-4 cursor-pointer touch-manipulation rounded-full px-2 py-4 transition-opacity hover:opacity-70"
                style={{ fontFamily: selectedFont?.stack }}
              >
                {selectedFont?.label}
              </button>
              {showProcess && (
                <>
                  <Divider />
                  <span className="flex items-center gap-1">
                    <span aria-hidden="true" className="inline-flex">
                      <IosSpinnerPulse
                        isAnimating={!reduceMotion}
                        width={40}
                        height={40}
                      />
                    </span>
                    <span>{processLabel}</span>
                  </span>
                </>
              )}
              <Divider />
              {/* Theme segment — opens the color picker (same enlarged hit area) */}
              <button
                ref={themeTriggerRef}
                onClick={() => openMenu("theme")}
                aria-haspopup="menu"
                aria-expanded={expanded === "theme"}
                aria-label={`Theme: ${selectedTheme?.label}`}
                className="-mx-2 -my-4 flex cursor-pointer touch-manipulation items-center gap-3 rounded-full px-2 py-4 transition-opacity hover:opacity-70"
              >
                <span
                  aria-hidden="true"
                  className="h-4 w-4 rounded-full"
                  style={{ background: selectedTheme?.dots[0] }}
                />
                <span>{selectedTheme?.label}</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- EXPANDED ---------- */}
      <AnimatePresence mode="popLayout">
        {isExpanded && (
          <motion.div
            key="expanded"
            ref={menuRef}
            role="menu"
            aria-label={
              expanded === "theme" ? "Select a theme" : "Select a font"
            }
            aria-orientation="vertical"
            onKeyDown={onMenuKeyDown}
            layoutId={SHELL_ID}
            transition={shellTransition}
            className={`flex flex-col gap-0.5 overflow-hidden rounded-[34px] border border-border bg-popover text-popover-foreground shadow-[0_30px_60px_-20px_rgba(0,0,0,0.65)] ${className}`}
            // morph-driven values stay inline so layoutId can interpolate them
            style={{ borderRadius: 34, padding: 14, width: 300 }}
          >
            <motion.div
              layout="position"
              initial={{ opacity: 0, filter: "blur(6px)", scale: 0.96 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{
                opacity: 0,
                filter: "blur(6px)",
                scale: 0.96,
                transition: contentOut,
              }}
              transition={contentIn}
              className="flex flex-col gap-0.5"
            >
              {expanded === "theme"
                ? themes.map((theme, i) => {
                    const isActive = theme.id === selectedTheme?.id;
                    return (
                      <button
                        key={theme.id}
                        ref={(el) => {
                          itemRefs.current[i] = el;
                        }}
                        role="menuitemradio"
                        aria-checked={isActive}
                        tabIndex={i === activeIndex ? 0 : -1}
                        onClick={() => selectTheme(theme)}
                        className={`flex w-full touch-manipulation items-center gap-4 rounded-[20px] px-3.5 py-3 text-left transition-colors ${
                          isActive
                            ? "border border-border bg-accent"
                            : "border border-transparent hover:bg-accent/50"
                        }`}
                      >
                        <Dots colors={theme.dots} />
                        <span className="flex-1 text-[17px]" translate="no">
                          {theme.label}
                        </span>
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: theme.dots[0] }}
                          />
                        )}
                      </button>
                    );
                  })
                : fonts.map((font, i) => {
                    const isActive = font.id === selectedFont?.id;
                    return (
                      <button
                        key={font.id}
                        ref={(el) => {
                          itemRefs.current[i] = el;
                        }}
                        role="menuitemradio"
                        aria-checked={isActive}
                        tabIndex={i === activeIndex ? 0 : -1}
                        onClick={() => selectFont(font)}
                        className={`flex w-full touch-manipulation items-center gap-4 rounded-[20px] px-3.5 py-2.5 text-left transition-colors ${
                          isActive
                            ? "border border-border bg-accent"
                            : "border border-transparent hover:bg-accent/50"
                        }`}
                      >
                        <FontGlyph stack={font.stack} />
                        <span
                          className="flex-1 text-[16px]"
                          style={{ fontFamily: font.stack }}
                          translate="no"
                        >
                          {font.label}
                        </span>
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="h-2.5 w-2.5 rounded-full bg-primary"
                          />
                        )}
                      </button>
                    );
                  })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Divider() {
  return (
    <span
      aria-hidden="true"
      className="h-[26px] w-0.5 rounded-full"
      style={{
        backgroundImage:
          "repeating-linear-gradient(var(--border) 0 2px, transparent 2px 6px)",
      }}
    />
  );
}

export default ThemeButton;
