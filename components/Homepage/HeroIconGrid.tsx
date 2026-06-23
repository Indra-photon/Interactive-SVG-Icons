"use client";

import { TrashIcon } from "@/components/craftui/icons/trash/default";
import { IconHome } from "@/components/craftui/icons/home/default";
import { IconRefresh } from "@/components/craftui/icons/refresh/default";
import { IconMail } from "@/components/craftui/icons/mail/default";
import { IconAlarmRing } from "@/components/craftui/icons/alarm-clock/default";
import { IconBulb } from "@/components/craftui/icons/bulb/default";
import { IconLayoutDashboard } from "@/components/craftui/icons/layout/default";
import { IconShoppingCart } from "@/components/craftui/icons/shopping-cart/default";
import { IconDownload } from "@/components/craftui/icons/download/default";
import { IconExternalLinkDefault } from "@/components/craftui/icons/external-link/default";
import { IconLockShowPassword } from "@/components/craftui/icons/lock-glass/default";
import { IconTabOpenDefault } from "@/components/craftui/icons/tab-open/default";
import { IconMessagesWiggle } from "@/components/craftui/icons/msg-glass/wiggle";
import { IconCalendarPageFlip } from "@/components/craftui/icons/calendar/page-flip";

const CELL = 72;
const SIZE = 28;

const ICONS = [
  <TrashIcon size={SIZE} isAnimating />,
  <IconHome size={SIZE} isSelected />,
  <IconRefresh size={SIZE} isAnimating />,
  <IconMail size={SIZE} isOpen />,
  <IconAlarmRing size={SIZE} isHovered />,
  <IconBulb size={SIZE} isActive />,
  <IconLayoutDashboard size={SIZE} isHovered />,
  <IconShoppingCart size={SIZE} isAdding />,
  <IconDownload size={SIZE} isAnimating />,
  <IconExternalLinkDefault size={SIZE} isHovered />,
  <IconLockShowPassword size={SIZE} isUnlocked />,
  <IconTabOpenDefault size={SIZE} isHovered />,
  <IconMessagesWiggle size={SIZE} isHovered />,
  <IconCalendarPageFlip size={SIZE} isFlipping />,
];

const GRID = Array.from({ length: 25 }, (_, i) => ICONS[i % ICONS.length]);

export function HeroIconGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 opacity-[0.850] mask-b-from-30% mask-r-from-30%"
      style={{
        maskImage:
          "linear-gradient(to right, black 40%, transparent 90%), linear-gradient(to bottom, black 40%, transparent 90%)",
        maskComposite: "intersect",
        WebkitMaskImage:
          "linear-gradient(to right, black 40%, transparent 90%), linear-gradient(to bottom, black 40%, transparent 90%)",
        WebkitMaskComposite: "source-in",
      }}
    >
      <div className="grid grid-cols-5 gap-5">
        {GRID.map((icon, i) => (
          <div
            key={i}
            className="flex items-center justify-center"
            style={{
              width: CELL,
              height: CELL,
              boxShadow:
                "0 0 0 1px rgba(38, 38, 38, 0.18), 0 1px 3px rgba(38, 38, 38, 0.06)",
            }}
          >
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
}
