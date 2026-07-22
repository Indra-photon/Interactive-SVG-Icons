"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { MorphArrow } from "@/components/ui/morph-arrow";
import { HeroRippleLine } from "@/components/Homepage/HeroRippleLine";
import HeroSocialLinks from "@/components/Homepage/HeroSocialLinks";
import HeroRepoStats from "@/components/Homepage/HeroRepoStats";
import {
  HeroPixelGrid,
  type HeroPixelTheme,
} from "@/components/Homepage/HeroPixelGrid";
import { Paragraph } from "../Paragraph";

interface HeroLinkCard {
  label: string;
  href: string;
  subheading: string;
  cta: string;
  theme: HeroPixelTheme;
  comingSoon?: boolean;
}

const HERO_LINKS: HeroLinkCard[] = [
  {
    label: "Loaders",
    href: "/loaders",
    subheading: "66 animated loaders.",
    cta: "Browse loaders",
    theme: "sky",
  },
  {
    label: "Icons",
    href: "/icons",
    subheading: "14 interactive SVG icons.",
    cta: "Browse icons",
    theme: "green",
  },
  {
    label: "Blocks",
    href: "/blocks",
    subheading: "6 composable UI blocks.",
    cta: "Browse blocks",
    theme: "black",
  },
  {
    label: "Illustrations",
    href: "/illustrations",
    subheading: "Hand-drawn scenes.",
    cta: "Browse illustrations",
    theme: "yellow",
    comingSoon: true,
  },
];

const cardVariants = {
  hidden: { y: 18, opacity: 0, filter: "blur(8px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] as const },
  },
};

/**
 * Divider between cards. Orientation is a JS prop rather than a media query,
 * so both axes are rendered and CSS picks one — vertical in the desktop row,
 * horizontal once the grid collapses to a single column. Negative margins let
 * the line outgrow the card, including crossing the rule above it.
 */
function HeroCardSeparator() {
  return (
    <div
      aria-hidden
      className="flex items-stretch justify-center md:-my-8 md:h-auto"
    >
      <HeroRippleLine orientation="vertical" className="hidden md:block" />
      <HeroRippleLine orientation="horizontal" className="w-full md:hidden" />
    </div>
  );
}

function HeroLinkCardItem({
  label,
  href,
  subheading,
  cta,
  theme,
  comingSoon,
}: HeroLinkCard) {
  const [isHovered, setIsHovered] = useState(false);

  const card = (
    // Five independent knobs, all tuned from this one line:
    //   --card-pad     edge padding (shadcn's own --card-spacing drives px)
    //   --card-py      card's own top and bottom padding
    //   --preview-h    minimum height of the preview box
    //   --text-gap     preview → title
    //   --cta-gap      description → CTA
    // gap-0 kills card.tsx's shared gap so each space is set by its own
    // margin below; otherwise every gap moves together.
    // Concentric radii: the preview sits 12px (--card-pad) inside the card, so
    // the card's 20px matches the preview's 8px + that 12px gap.
    <Card className="[--card-pad:--spacing(3)] [--card-py:--spacing(3)] [--preview-h:--spacing(36)] [--text-gap:--spacing(4)] [--cta-gap:--spacing(2)] [--card-spacing:var(--card-pad)] h-full gap-0 py-(--card-py) text-left transition-shadow duration-200 corner-squircle rounded-[20px] group-hover:ring-foreground/20">
      {/* flex-1: the preview soaks up any extra height, so the text and CTA
          stay tight together and the CTAs still align across cards. */}
      <CardContent className="flex-1">
        <div className="relative h-full min-h-(--preview-h) w-full overflow-hidden rounded-lg bg-muted">
          <HeroPixelGrid theme={theme} />
        </div>
      </CardContent>

      <CardContent className="mt-(--text-gap) flex flex-col pt-10">
        <CardTitle>
          <Paragraph variant="card-Heading" className="uppercase">
            {label}
          </Paragraph>
        </CardTitle>
        <CardDescription>
          <Paragraph variant="card-Description" className="">
            {subheading}
          </Paragraph>
        </CardDescription>
      </CardContent>

      <CardFooter className="mt-(--cta-gap)">
        {comingSoon ? (
          <Badge variant="outline" className="rounded-lg">
            Coming soon
          </Badge>
        ) : (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="corner-squircle rounded-lg tracking-tighter"
          >
            <span>
              {cta}
              <span className="ml-2 rounded-[6px] bg-primary/70 p-1 text-white">
                <MorphArrow isHovered={isHovered} size={14} />
              </span>
            </span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  if (comingSoon) {
    return (
      // `group` so the pixel mosaic blinks on this card too — it has no Link
      // wrapper to carry the class.
      <motion.div
        variants={cardVariants}
        aria-disabled
        className="group h-full"
      >
        {card}
      </motion.div>
    );
  }

  return (
    <motion.div variants={cardVariants} className="h-full">
      {/* Link wraps the whole card, so the Button inside is a span, not a
          nested anchor. */}
      <Link
        href={href}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group block h-full rounded-[20px] focus-visible:outline-none"
      >
        {card}
      </Link>
    </motion.div>
  );
}

export function HeroLinksList() {
  return (
    <motion.div
      className="mx-auto w-full max-w-6xl px-8 sm:px-4 pt-4"
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.09, delayChildren: 0.3 },
        },
      }}
      initial="hidden"
      animate="show"
    >
      {/* 4 cards + 3 separators share one row on md+; on mobile the single
          column stacks all seven in source order, so the horizontal
          separators land between cards without any reordering. */}
      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:gap-0">
        <div className="col-span-full -mx-4 mb-2 md:-mx-10">
          <HeroRippleLine orientation="horizontal" className="w-full" />
        </div>

        {HERO_LINKS.map((link, i) => (
          <Fragment key={link.label}>
            {i > 0 && <HeroCardSeparator />}
            <HeroLinkCardItem {...link} />
          </Fragment>
        ))}

        {/* Sits in the same grid as the cards so the two blocks line up with
            the outer cards' edges rather than the viewport. items-end puts
            both bottom rows on one baseline despite the differing labels. */}
        <div className="col-span-full mt-18 flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
          <HeroRepoStats />
          <HeroSocialLinks />
        </div>
      </div>
    </motion.div>
  );
}
