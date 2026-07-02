"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  LockPasswordIcon,
  EyeIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import useMeasure from "react-use-measure";

type HugeIcon = React.ComponentProps<typeof HugeiconsIcon>["icon"];

export type SubItem = {
  label: string;
  icon: HugeIcon;
};

export type NavItemWithSubs = {
  label: string;
  icon: HugeIcon;
  subs: SubItem[];
};

export type NavItemWithPanel = {
  label: string;
  icon: HugeIcon;
  panel: React.ReactNode;
};

export type NavItem = NavItemWithSubs | NavItemWithPanel;

function hasPanel(item: NavItem): item is NavItemWithPanel {
  return "panel" in item;
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function LoginPanel() {
  const prefersReducedMotion = useReducedMotion();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="flex flex-col gap-2.5 px-3 pt-3 pb-3">
      <div
        className="flex min-h-[44px] items-center gap-2.5 rounded-lg px-3.5 py-2.5 transition-[box-shadow] duration-150 focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.18)]"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <HugeiconsIcon icon={Mail01Icon} size={14} color="rgba(255,255,255,0.7)" strokeWidth={1.5} />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-transparent text-[12px] text-white antialiased outline-none placeholder:text-white/30"
        />
      </div>

      <div
        className="flex min-h-[44px] items-center gap-2.5 rounded-lg px-3.5 py-2.5 transition-[box-shadow] duration-150 focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.18)]"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <HugeiconsIcon icon={LockPasswordIcon} size={14} color="rgba(255,255,255,0.7)" strokeWidth={1.5} />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="flex-1 bg-transparent text-[12px] text-white antialiased outline-none placeholder:text-white/30"
        />
        <motion.button
          onClick={() => setShowPassword((p) => !p)}
          className="relative flex h-8 w-8 cursor-pointer items-center justify-center select-none"
          whileTap={{ scale: 0.96 }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={showPassword ? "hide" : "show"}
              initial={{ opacity: 0, scale: 0.25, filter: "blur(2px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.25, filter: "blur(2px)" }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: "easeInOut" }}
              className="flex items-center justify-center"
            >
              <HugeiconsIcon
                icon={showPassword ? ViewOffIcon : EyeIcon}
                size={14}
                color="rgba(255,255,255,0.7)"
                strokeWidth={1.5}
              />
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      <motion.button
        whileTap={{ scale: 0.96 }}
        className="w-full cursor-pointer rounded-lg py-3 text-[12px] font-semibold text-black antialiased transition-[opacity] duration-150 select-none hover:opacity-90"
        style={{ background: "rgba(255,255,255,0.92)" }}
      >
        Sign in
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.96 }}
        className="w-full cursor-pointer py-1 text-center text-[11px] text-white/30 antialiased transition-[color] duration-150 select-none hover:text-white/50"
      >
        Forgot password?
      </motion.button>
    </div>
  );
}

export default function BottomNavbar({ items }: { items: NavItem[] }) {
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = React.useState<string | null>(null);
  const [activeSub, setActiveSub] = React.useState<string>("");
  const [subRef, { height: subHeight }] = useMeasure();

  const handleTabClick = (label: string) => {
    if (activeTab === label) {
      setActiveTab(null);
    } else {
      setActiveTab(label);
      const item = items.find((i) => i.label === label);
      if (item && !hasPanel(item) && item.subs.length > 0) {
        setActiveSub(item.subs[0].label);
      }
    }
  };

  const currentItem = items.find((i) => i.label === activeTab);

  return (
    <div className="pointer-events-none absolute inset-0">
      <AnimatePresence initial={false}>
        {activeTab && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => setActiveTab(null)}
            className="pointer-events-auto absolute inset-0 z-10"
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              background: "rgba(200,200,210,0.3)",
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        layout
        transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
        style={{
          borderRadius: 17,
          boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px rgba(0,0,0,0.6)",
        }}
        className="pointer-events-auto absolute right-4 bottom-5 left-4 z-20 overflow-hidden bg-[#0e0e0e]"
      >
        <motion.div
          animate={{ height: activeTab ? subHeight : 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: EASE_OUT }}
          style={{ overflow: "hidden" }}
        >
          <div ref={subRef}>
            <AnimatePresence initial={false} mode="popLayout">
              {currentItem && !hasPanel(currentItem) && (
                <motion.div
                  key={currentItem.label}
                  initial={{ opacity: 0, filter: "blur(4px)", y: 8 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{
                    opacity: 0,
                    filter: "blur(2px)",
                    transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.12, ease: EASE_OUT },
                  }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: EASE_OUT }}
                  className="px-3 pt-3 pb-3"
                >
                  <div className="flex flex-wrap gap-2">
                    {currentItem.subs.map((sub) => {
                      const isSubActive = activeSub === sub.label;
                      return (
                        <motion.button
                          key={sub.label}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setActiveSub(sub.label)}
                          className="flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 antialiased transition-[background-color,color] duration-150 select-none"
                          style={{
                            background: isSubActive ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.05)",
                            color: isSubActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.7)",
                          }}
                        >
                          <HugeiconsIcon icon={sub.icon} size={11} color="currentColor" strokeWidth={isSubActive ? 2 : 1.5} />
                          <span className="text-[11px]" style={{ fontWeight: isSubActive ? 600 : 400 }}>
                            {sub.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {currentItem && hasPanel(currentItem) && (
                <motion.div
                  key={currentItem.label}
                  initial={{ opacity: 0, filter: "blur(2px)", y: 8 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{
                    opacity: 0,
                    filter: "blur(2px)",
                    transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.1, ease: EASE_OUT },
                  }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: EASE_OUT }}
                >
                  {currentItem.panel}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="mx-4 h-px bg-white/[0.07]" />
          </div>
        </motion.div>

        <div className="flex h-14 items-center">
          {items.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <motion.button
                key={item.label}
                onClick={() => handleTabClick(item.label)}
                whileTap={{ scale: 0.96 }}
                className="relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 py-2 select-none"
              >
                <span
                  className="relative transition-[color] duration-150"
                  style={{ color: isActive ? "white" : "rgba(255,255,255,0.7)" }}
                >
                  <HugeiconsIcon icon={item.icon} size={17} color="currentColor" strokeWidth={isActive ? 2 : 1.5} />
                </span>
                <span
                  className="relative text-[10px] antialiased transition-[color,font-weight] duration-150"
                  style={{ fontWeight: isActive ? 600 : 400, color: isActive ? "white" : "rgba(255,255,255,0.7)" }}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
