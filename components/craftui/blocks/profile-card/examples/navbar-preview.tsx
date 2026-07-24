"use client";

import {
  CheckmarkBadge01Icon,
  Notification01Icon,
  PaintBoardIcon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import ProfileCard, { type MenuItem } from "../navbar";

const MENU_ITEMS: MenuItem[] = [
  { label: "Profile", icon: CheckmarkBadge01Icon, active: true },
  {
    label: "Notifications",
    icon: Notification01Icon,
    badge: (
      <span className="flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
        3
      </span>
    ),
  },
  { label: "Appearance", icon: PaintBoardIcon, dividerAfter: true },
  {
    label: "Sign out",
    icon: Logout01Icon,
    onClick: () => console.log("Sign out clicked"),
  },
];

export default function NavbarPreview() {
  return (
    <div className="flex h-full w-full items-start justify-center bg-[#f2f2f7] p-4 sm:p-6 dark:bg-neutral-900">
      {/* A minimal navbar so the avatar has a home — the card drops from it. */}
      <div className="relative h-16 w-full max-w-[560px] rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-800">
        {/* Dummy nav links so it reads as a real navbar. */}
        <nav className="absolute inset-y-0 left-5 items-center gap-6 text-sm hidden sm:flex">
          <span className="font-semibold text-black/80 dark:text-white/80">
            Dashboard
          </span>
          <span className="text-black/45 dark:text-white/45">Projects</span>
        </nav>

        <ProfileCard
          name="Sophie Bennett"
          email="sophie@ui.live"
          menuItems={MENU_ITEMS}
        />
      </div>
    </div>
  );
}
