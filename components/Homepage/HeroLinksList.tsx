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
import { HeroCreatorCard } from "@/components/Homepage/HeroCreatorCard";
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

/**
 * One flat list, not two rows. Mobile renders every card in a single
 * uninterrupted scroll strip, which a pair of row containers can't produce —
 * so the desktop row break is expressed as an index into this list
 * (ROW_BREAK) rather than as a second array.
 */
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
  {
    label: "Sections",
    href: "/sections",
    subheading: "4 page-width layouts.",
    cta: "Browse sections",
    theme: "violet",
  },
  {
    label: "UI Components",
    href: "/ui-gallery",
    subheading: "4 interactive components.",
    cta: "Browse components",
    theme: "rose",
  },
  {
    label: "Designs",
    href: "/designs",
    subheading: "3 static artworks.",
    cta: "Browse designs",
    theme: "orange",
  },
];

/**
 * 4 cards on the `1fr` tracks, 3 separators on the `auto` ones — seven items,
 * which is exactly one grid row. The item stream below is built to land on that
 * multiple so both rows fill without any explicit placement.
 */
const ROW_COLUMNS = "md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]";

/**
 * Card index the md+ grid breaks to a second row at. The card here gets the
 * full-width rule before it instead of a vertical separator — that rule spans
 * all seven columns, which is what pushes it and everything after onto a fresh
 * row. Below md it's hidden and the strip just keeps scrolling.
 */
const ROW_BREAK = 4;

/**
 * Every card's outer wrapper.
 *
 * Below md the row is a flex scroller, so each card needs an explicit width and
 * must refuse to shrink — 78% leaves the next card peeking, which is what tells
 * the reader the strip scrolls at all. From md up the row is a grid and the
 * track sets the width, so all three are reset.
 */
const CARD_SLOT =
  "h-full w-[78%] shrink-0 snap-start sm:w-[62%] md:w-auto md:shrink md:snap-align-none";

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
 * Vertical divider between cards in the md+ grid. Negative margins let the line
 * outgrow the card, including crossing the rule above it.
 *
 * Hidden below md: the mobile row is a horizontal scroller, where a rule
 * between every card would be four extra flex items competing with the cards
 * for a narrow viewport. The gap carries the separation there instead.
 */
function HeroCardSeparator() {
  return (
    <div
      aria-hidden
      className="hidden items-stretch justify-center md:-my-8 md:flex md:h-auto"
    >
      <HeroRippleLine orientation="vertical" />
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
          <Paragraph variant="title" className="uppercase">
            {label}
          </Paragraph>
        </CardTitle>
        <CardDescription>
          <Paragraph variant="body" className="">
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
            variant="secondary"
            size="xs"
            className="corner-squircle rounded-[10px] tracking-normal whitespace-nowrap"
          >
            {cta}
            <span className="inline-flex items-center justify-center rounded-[6px] text-white">
              <MorphArrow isHovered={isHovered} size={14} />
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
        className={`group ${CARD_SLOT}`}
      >
        {card}
      </motion.div>
    );
  }

  return (
    <motion.div variants={cardVariants} className={CARD_SLOT}>
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

/** Full-bleed rule. Outdented so it overshoots the cards on both sides. */
function HeroRowRule({ className = "" }: { className?: string }) {
  return (
    <div className={`-mx-4 md:-mx-10 ${className}`}>
      <HeroRippleLine orientation="horizontal" className="w-full" />
    </div>
  );
}

/**
 * The eight cards in display order — seven catalogs plus the creator card,
 * which is a different component but occupies the same slot as the rest.
 */
function buildHeroCards() {
  return [
    ...HERO_LINKS.map((link) => ({
      key: link.label,
      node: <HeroLinkCardItem {...link} />,
    })),
    {
      key: "github",
      node: (
        <motion.div variants={cardVariants} className={CARD_SLOT}>
          <HeroCreatorCard />
        </motion.div>
      ),
    },
  ];
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
      <HeroRowRule className="mb-2" />

      {/*
        One container, two layouts.

        Below md: a horizontal snap scroller holding all eight cards in a single
        uninterrupted strip. Full-bleed via negative margins that cancel the
        parent's padding, with that padding re-applied inside so the first card
        still starts on the heading's left edge and the last one gets breathing
        room. Scrollbar hidden in both engines — same idiom as
        feature-gallery-01.

        From md up: a 7-track grid, two rows of four. The item stream is built
        so each row is exactly 7 items (4 cards + 3 separators) and the
        full-width rule at ROW_BREAK consumes a row of its own between them, so
        the rows fill by flow alone with no explicit placement.

        The wrappers between here and the cards don't break the stagger: Framer
        Motion propagates variants through React context, so all eight cards
        animate in source order off the one parent above.
      */}
      <div
        className={`-mx-8 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain px-8 [scrollbar-width:none] sm:-mx-4 sm:px-4 md:mx-0 md:grid md:gap-0 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden ${ROW_COLUMNS}`}
      >
        {buildHeroCards().map(({ key, node }, i) => (
          <Fragment key={key}>
            {i === ROW_BREAK && (
              // col-span-full is what forces the row break; hidden below md
              // because the strip has no second row to introduce.
              <HeroRowRule className="hidden md:col-span-full md:my-8 md:block" />
            )}
            {i > 0 && i !== ROW_BREAK && <HeroCardSeparator />}
            {node}
          </Fragment>
        ))}
      </div>
    </motion.div>
  );
}
