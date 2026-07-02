"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkBadge01Icon,
  UserGroupIcon,
  CreditCardIcon,
  Settings01Icon,
  HelpCircleIcon,
  Logout01Icon,
  FlashIcon,
} from "@hugeicons/core-free-icons";

// ── Constants ─────────────────────────────────────────────────────────────────

const MENU_GROUP_1 = [
  { label: "Profile", icon: CheckmarkBadge01Icon, badge: null, active: true },
  {
    label: "Community",
    icon: UserGroupIcon,
    badge: (
      <span className="flex size-5 items-center justify-center rounded-full border border-black/15 text-[10px] font-semibold text-black/50">
        +
      </span>
    ),
    active: false,
  },
  {
    label: "Subscription",
    icon: CreditCardIcon,
    badge: (
      <span className="flex items-center gap-0.5 rounded-full bg-green-400 px-2 py-0.5 text-[10px] font-bold text-black">
        <HugeiconsIcon
          icon={FlashIcon}
          size={10}
          color="black"
          strokeWidth={2.5}
        />
        PRO
      </span>
    ),
    active: false,
  },
  { label: "Settings", icon: Settings01Icon, badge: null, active: false },
];

const MENU_GROUP_2 = [
  { label: "Help center", icon: HelpCircleIcon, badge: null, active: false },
  { label: "Sign out", icon: Logout01Icon, badge: null, active: false },
];

const SPRING = { type: "spring", duration: 0.5, bounce: 0.25 } as const;

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ size }: { size: number }) {
  return (
    <div
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className="flex flex-shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-400 via-purple-400 to-pink-300"
    >
      <svg viewBox="0 0 60 60" width={size * 0.8} height={size * 0.8}>
        <ellipse cx="30" cy="34" rx="18" ry="16" fill="#5b7be9" />
        <ellipse cx="30" cy="20" rx="14" ry="14" fill="#6b8ef0" />
        <circle cx="24" cy="20" r="3.5" fill="white" />
        <circle cx="36" cy="20" r="3.5" fill="white" />
        <circle cx="25" cy="21" r="1.8" fill="#1a1a2e" />
        <circle cx="37" cy="21" r="1.8" fill="#1a1a2e" />
        <ellipse cx="30" cy="29" rx="5" ry="3" fill="#f87171" />
      </svg>
    </div>
  );
}

// ── MenuRow ───────────────────────────────────────────────────────────────────

function MenuRow({
  item,
}: {
  item: (typeof MENU_GROUP_1)[0] | (typeof MENU_GROUP_2)[0];
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors select-none ${
        item.active ? "bg-black/[0.06]" : "hover:bg-black/[0.04]"
      }`}
    >
      <span className="flex-shrink-0 text-black/50">
        <HugeiconsIcon
          icon={item.icon}
          size={18}
          color="currentColor"
          strokeWidth={1.6}
        />
      </span>
      <span className="flex-1 text-[15px] font-medium text-black/85 antialiased">
        {item.label}
      </span>
      {item.badge}
    </motion.button>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function ProfileCard() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [menuReady, setMenuReady] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) { setMenuReady(false); return; }
    // delay + duration of the fade wrapper animation (0.18 + 0.2 = 0.38s)
    const id = setTimeout(() => setMenuReady(true), 400);
    return () => clearTimeout(id);
  }, [isOpen]);

  return (
    <div className="relative h-full w-full">
      {/* Dismiss overlay — scoped to whatever container this is placed in */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 z-10"
          />
        )}
      </AnimatePresence>

      {/* Avatar trigger — top-right of the container */}
      <div className="absolute top-3 right-5 z-20">
        <motion.div
          layoutId="profile-card"
          onClick={() => setIsOpen(true)}
          transition={SPRING}
          style={{ borderRadius: 20, pointerEvents: isOpen ? "none" : "auto" }}
          className="cursor-pointer"
        >
          <div style={{ width: 40, height: 40, position: "relative" }}>
            <motion.div
              layoutId="profile-avatar"
              transition={SPRING}
              className="absolute inset-[2px] overflow-hidden rounded-full"
            >
              <Avatar size={36} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Expanded profile card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="profile-card"
            key="profile-card-expanded"
            onClick={() => setIsOpen(false)}
            transition={SPRING}
            style={{ borderRadius: 20 }}
            className="absolute top-3 right-5 z-20 w-[310px] cursor-pointer bg-white shadow-[0_8px_40px_rgba(0,0,0,0.14)]"
          >
            {/* Avatar — outside fade wrapper so it animates independently */}
            <div
              className="absolute top-4 right-4 cursor-pointer"
              style={{ width: 48, height: 48 }}
            >
              <motion.div
                layoutId="profile-avatar"
                transition={SPRING}
                className="absolute inset-[3px] overflow-hidden rounded-full"
              >
                <Avatar size={42} />
              </motion.div>
            </div>

            {/* Fade wrapper — text + menus only */}
            <motion.div
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.2, ease: "easeOut", delay: 0.18 }}
            >
              <div className="px-4 pt-4 pr-16 pb-3">
                <p className="text-[16px] font-bold tracking-tight text-black antialiased">
                  Sophie Bennett
                </p>
                <p className="mt-0.5 text-xs text-black/40 antialiased">
                  sophie@ui.live
                </p>
              </div>

              <div className="mx-1 h-px bg-black/[0.06]" />

              <div className={menuReady ? undefined : "pointer-events-none"}>
                <div className="flex flex-col p-2">
                  {MENU_GROUP_1.map((item) => (
                    <MenuRow key={item.label} item={item} />
                  ))}
                </div>

                <div className="mx-1 h-px bg-black/[0.06]" />

                <div className="flex flex-col p-2">
                  {MENU_GROUP_2.map((item) => (
                    <MenuRow key={item.label} item={item} />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
