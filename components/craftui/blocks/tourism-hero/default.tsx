"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarDaysIcon, MapIcon } from "@heroicons/react/20/solid";

const DEFAULT_NAV_LINKS = ["Explore", "Trails", "Guides", "About"];

const DEFAULT_STATS = [
  { value: "240+", label: "Trails Mapped" },
  { value: "48", label: "Mountain Huts" },
  { value: "12K+", label: "Trekkers Joined Us" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 8, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export interface TourismHero01NavbarProps {
  logoText?: string;
  logoIcon?: React.ReactNode;
  navLinks?: string[];
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export function TourismHero01Navbar({
  logoText = "Summit",
  logoIcon,
  navLinks = DEFAULT_NAV_LINKS,
  ctaLabel = "Book Now",
  onCtaClick,
}: TourismHero01NavbarProps) {
  const defaultLogoIcon = (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 3L26 23H2L14 3Z" fill="#2D6A4F" />
      <path d="M19 17L23 23H12L16 16L19 17Z" fill="#1B4332" />
    </svg>
  );

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="absolute top-6 left-1/2 box-border flex h-[60px] -translate-x-1/2 items-center justify-between rounded-2xl border border-[#FFFFFF59] bg-[#FFFFFF26] px-9 shadow-[#0000002E_0px_4px_24px] backdrop-blur-[18px]"
      style={{ width: "calc(100% - 2 * clamp(32px, 5.5vw, 80px))" }}
    >
      <div className="flex items-center gap-2">
        {logoIcon ?? defaultLogoIcon}
        <span className="font-sans text-[28px] leading-7 font-bold text-[#FFFFFFD1]">
          {logoText}
        </span>
      </div>

      <div className="flex items-center gap-9">
        {navLinks.map((link) => (
          <a
            key={link}
            href="#"
            className="font-sans text-[18px] leading-7 font-medium text-[#FFFFFFD1] no-underline"
          >
            {link}
          </a>
        ))}

        <div className="h-5 w-px shrink-0 bg-[#FFFFFF4D]" />

        <Button
          variant="ghost"
          onClick={onCtaClick}
          className="rounded-lg bg-[#2D6A4F] px-[22px] py-[11px] font-sans text-sm font-semibold leading-[18px] tracking-[0.01em] text-white transition-transform duration-150 hover:bg-[#2D6A4F]/90 hover:text-white active:scale-[0.96] flex items-center gap-1.5"
        >
          <CalendarDaysIcon className="size-4 shrink-0" />
          {ctaLabel}
        </Button>
      </div>
    </motion.nav>
  );
}

export interface TourismHero01Props {
  imageSrc: string;
  imageAlt?: string;
  heading?: string;
  subheading?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  onPrimaryCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
  stats?: { value: string; label: string }[];
  navbarProps?: TourismHero01NavbarProps;
  className?: string;
}

export function TourismHero01({
  imageSrc = "/blocks/TourismHero01.png",
  imageAlt = "Mountain landscape",
  heading = "Where the Path\nLeads Up",
  subheading = "Discover alpine trails, mountain refuges, and guided expeditions across the Dolomites.",
  primaryCtaLabel = "Plan Your Trek",
  secondaryCtaLabel = "Book Now",
  onPrimaryCtaClick,
  onSecondaryCtaClick,
  stats = DEFAULT_STATS,
  navbarProps,
  className,
}: TourismHero01Props) {
  return (
    <div
      className={cn(
        "relative h-screen min-h-[600px] w-full overflow-hidden antialiased",
        className,
      )}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        priority
      />

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(in oklab 90deg, oklab(17.6% -0.023 0.014 / 72%) 0%, oklab(17.6% -0.023 0.014 / 35%) 55%, oklab(17.6% -0.023 0.014 / 0%) 100%)",
        }}
      />

      <TourismHero01Navbar {...navbarProps} />

      {/* Hero content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="absolute inset-0 flex flex-col items-start justify-center gap-7 px-[clamp(32px,5.5vw,80px)] pt-[clamp(60px,12vh,140px)] pb-[clamp(140px,22vh,200px)]"
      >
        <motion.h1
          variants={item}
          className="m-0 max-w-[40%] font-sans text-[clamp(44px,5vw,72px)] leading-[1.05] font-semibold tracking-tight whitespace-pre-wrap text-white"
        >
          {heading}
        </motion.h1>

        <motion.p
          variants={item}
          className="text-wrap-pretty m-0 max-w-[35%] font-sans text-[clamp(16px,1.4vw,20px)] leading-7 font-normal text-[#FFFFFFF2]"
        >
          {subheading}
        </motion.p>

        <motion.div variants={item} className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onPrimaryCtaClick}
            className="flex items-center gap-2 rounded-[10px] bg-gradient-to-b from-[#2D6A4F] to-[#2D6A4F]/80 px-8 py-[9px] font-sans text-[18px] font-medium text-white ring ring-white/20 ring-inset transition-[background-color,transform] duration-150 hover:from-[#2D6A4F] hover:to-[#2D6A4F]/70 hover:text-white active:scale-[0.96]"
          >
            <MapIcon className="size-5 shrink-0" />
            {primaryCtaLabel}
          </Button>

          <Button
            variant="ghost"
            onClick={onSecondaryCtaClick}
            className="flex items-center gap-2 rounded-[10px] border border-white/50 bg-transparent px-8 py-[9px] font-sans text-[18px] font-medium tracking-[0.01em] text-white transition-[background-color,transform] duration-150 hover:bg-white/10 hover:text-white active:scale-[0.96]"
          >
            <CalendarDaysIcon className="size-5 shrink-0" />
            {secondaryCtaLabel}
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          delay: 0.5,
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="absolute right-0 bottom-0 left-0 flex h-[clamp(100px,16.5vh,148px)] items-center px-[clamp(32px,5.5vw,80px)]"
      >
        <div className="flex items-center">
          {stats.map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && (
                <div className="mx-[clamp(24px,2.8vw,40px)] h-14 w-px shrink-0 bg-[#FFFFFF4D]" />
              )}
              <div className="flex shrink-0 flex-col gap-1">
                <span className="font-sans text-[clamp(32px,3.3vw,48px)] leading-[52px] font-normal tracking-[-0.03em] text-white tabular-nums">
                  {stat.value}
                </span>
                <span className="font-sans text-[clamp(12px,1.25vw,18px)] leading-[22px] font-normal tracking-[0.03em] text-white uppercase">
                  {stat.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
