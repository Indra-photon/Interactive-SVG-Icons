"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { MorphArrow } from "@/components/ui/morph-arrow";
import {
  HeroRippleLine,
  type HeroRippleLineHandle,
} from "@/components/Homepage/HeroRippleLine";

interface HeroLinkRow {
  label: string;
  href: string;
  meta: string;
  comingSoon?: boolean;
}

const HERO_LINKS: HeroLinkRow[] = [
  { label: "Loaders", href: "/loaders", meta: "66 Loaders" },
  { label: "Icons", href: "/icons", meta: "14 Icons" },
  { label: "Blocks", href: "/blocks", meta: "6 Blocks" },
  {
    label: "Illustrations",
    href: "/illustrations",
    meta: "",
    comingSoon: true,
  },
];

const rowVariants = {
  hidden: { y: 18, opacity: 0, filter: "blur(8px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] as const },
  },
};

function HeroLinkRowItem({ label, href, meta, comingSoon }: HeroLinkRow) {
  const [isHovered, setIsHovered] = useState(false);
  const rippleRef = useRef<HeroRippleLineHandle>(null);

  const content = (
    <>
      <span
        onMouseEnter={() => rippleRef.current?.pulse()}
        className="font-mono tracking-tighter text-sm sm:text-base text-foreground shrink-0"
      >
        {label}
      </span>

      <HeroRippleLine ref={rippleRef} active={isHovered} />

      {comingSoon ? (
        <Badge variant="outline" className="shrink-0">
          Coming soon
        </Badge>
      ) : (
        <span
          onMouseEnter={() => rippleRef.current?.pulse()}
          className="flex items-center gap-2 shrink-0 font-mono tracking-tighter text-xs sm:text-sm text-neutral-500"
        >
          {meta}
          <span className="bg-primary/70 p-1 rounded-[6px] text-white">
            <MorphArrow isHovered={isHovered} size={14} />
          </span>
        </span>
      )}
    </>
  );

  const rowClassName = "flex items-center gap-3 w-full py-2.5 group";

  if (comingSoon) {
    return (
      <motion.div variants={rowVariants} className={rowClassName} aria-disabled>
        {content}
      </motion.div>
    );
  }

  return (
    <motion.div variants={rowVariants}>
      <Link
        href={href}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={rowClassName}
      >
        {content}
      </Link>
    </motion.div>
  );
}

export function HeroLinksList() {
  return (
    <motion.div
      className="flex flex-col w-full max-w-md mx-auto pt-4"
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.09, delayChildren: 0.3 },
        },
      }}
      initial="hidden"
      animate="show"
    >
      {HERO_LINKS.map((link) => (
        <HeroLinkRowItem key={link.label} {...link} />
      ))}
    </motion.div>
  );
}
