"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  NewTwitterIcon,
  PinterestIcon,
  GlobeIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";
import { Paragraph } from "../Paragraph";

export const SOCIAL_LINKS = [
  { icon: NewTwitterIcon, href: "https://x.com/Nil_phy_dreamer", label: "X" },
  {
    icon: PinterestIcon,
    href: "https://pl.pinterest.com/nildev022/",
    label: "Pinterest",
  },
  {
    icon: YoutubeIcon,
    href: "https://www.youtube.com/@indranilmaiti842",
    label: "YouTube",
  },
  {
    icon: GlobeIcon,
    href: "https://www.indrabuildswebsites.com/",
    label: "Website",
  },
];

export function MagneticIcon({
  icon,
  href,
  label,
}: {
  icon: (typeof SOCIAL_LINKS)[0]["icon"];
  href: string;
  label: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.35;
    const y = (clientY - (top + height / 2)) * 0.35;
    setPos({ x, y });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 25, mass: 0.1 }}
      className="flex items-center justify-center w-9 h-9 rounded-[10px] border border-primary/60 hover:border-primary bg-background/60 text-foreground/50 hover:text-foreground hover:bg-background transition-colors duration-150 cursor-pointer"
    >
      <HugeiconsIcon
        icon={icon}
        size={16}
        strokeWidth={1.9}
        className="text-primary"
      />
    </motion.a>
  );
}

export default function HeroSocialLinks() {
  return (
    // Static flow, not absolute — the caller decides where this sits.
    <div className="flex flex-col items-start gap-2">
      <Paragraph
        variant="body"
        className="uppercase text-xs tracking-widest"
      >
        Meet the creator
      </Paragraph>
      <div className="flex flex-row gap-4">
        {SOCIAL_LINKS.map(({ icon, href, label }) => (
          <MagneticIcon key={label} icon={icon} href={href} label={label} />
        ))}
      </div>
    </div>
  );
}
