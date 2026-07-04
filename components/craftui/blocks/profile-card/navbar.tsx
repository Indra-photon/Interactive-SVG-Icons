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

// ── Types ─────────────────────────────────────────────────────────────────────

type HugeIcon = React.ComponentProps<typeof HugeiconsIcon>["icon"];

export type MenuItem = {
  label: string;
  icon: HugeIcon;
  badge?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  /** Renders a divider below this item — used to visually group rows. */
  dividerAfter?: boolean;
};

export interface ProfileCardProps {
  name?: string;
  email?: string;
  /** Avatar slot — defaults to DefaultAvatar. Pass an <img>, next/image, or any node. */
  avatar?: React.ReactNode;
  menuItems?: MenuItem[];
  className?: string;
}

// ── Default content ──────────────────────────────────────────────────────────

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { label: "Profile", icon: CheckmarkBadge01Icon, active: true },
  {
    label: "Community",
    icon: UserGroupIcon,
    badge: (
      <span className="flex size-5 items-center justify-center rounded-full border border-black/15 text-[10px] font-semibold text-black/50">
        +
      </span>
    ),
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
  },
  { label: "Settings", icon: Settings01Icon, dividerAfter: true },
  { label: "Help center", icon: HelpCircleIcon },
  { label: "Sign out", icon: Logout01Icon },
];

const SPRING = { type: "spring", duration: 0.5, bounce: 0.25 } as const;

/** Splits a flat item list into groups, breaking after each `dividerAfter` item. */
function splitIntoSegments(items: MenuItem[]): MenuItem[][] {
  const segments: MenuItem[][] = [[]];
  for (const item of items) {
    segments[segments.length - 1].push(item);
    if (item.dividerAfter) segments.push([]);
  }
  return segments.filter((segment) => segment.length > 0);
}

// ── Avatar ────────────────────────────────────────────────────────────────────

export function DefaultAvatar({ size }: { size: number }) {
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

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={item.onClick}
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

export default function ProfileCard({
  name = "Sophie Bennett",
  email = "sophie@ui.live",
  avatar,
  menuItems = DEFAULT_MENU_ITEMS,
  className,
}: ProfileCardProps = {}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [menuReady, setMenuReady] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setMenuReady(false);
      return;
    }
    // delay + duration of the fade wrapper animation (0.18 + 0.2 = 0.38s)
    const id = setTimeout(() => setMenuReady(true), 400);
    return () => clearTimeout(id);
  }, [isOpen]);

  const collapsedAvatar = avatar ?? <DefaultAvatar size={36} />;
  const expandedAvatar = avatar ?? <DefaultAvatar size={42} />;

  return (
    <div className={`relative h-full w-full ${className ?? ""}`}>
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
              {collapsedAvatar}
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
                {expandedAvatar}
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
                  {name}
                </p>
                <p className="mt-0.5 text-xs text-black/40 antialiased">
                  {email}
                </p>
              </div>

              <div className="mx-1 h-px bg-black/[0.06]" />

              <div className={menuReady ? undefined : "pointer-events-none"}>
                {splitIntoSegments(menuItems).map((segment, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <div className="mx-1 h-px bg-black/[0.06]" />}
                    <div className="flex flex-col p-2">
                      {segment.map((item) => (
                        <MenuRow key={item.label} item={item} />
                      ))}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
