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
import { RAIL } from "@/components/Rail";
import { rowEntrance } from "@/lib/motion";
import { cn } from "@/lib/utils";
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
 *
 * ORDER MATCHES THE INTRO. app/page.tsx names the catalogs in prose — Blocks,
 * Illustrations, UI components, Designs, Loaders, Interactive icons — and the
 * grid repeats that sequence, so a reader who scans the sentence then drops to
 * the cards finds them where the sentence left them. Reorder one and reorder
 * the other.
 */
const HERO_LINKS: HeroLinkCard[] = [
  {
    label: "Blocks",
    href: "/blocks",
    subheading:
      "Self-contained pieces of interface with the interaction already designed. Drop one in and it works the way it looks.",
    cta: "Browse blocks",
    theme: "black",
  },
  {
    label: "Illustrations",
    href: "/illustrations",
    subheading:
      "Animated SVG artwork for the places a page needs a picture. Drawn by hand and built to move on its own.",
    cta: "Browse illustrations",
    theme: "yellow",
  },
  {
    label: "UI Components",
    href: "/ui-gallery",
    subheading:
      "The everyday building blocks of an interface, rebuilt around motion. Small, focused and considered on every press.",
    cta: "Browse components",
    theme: "rose",
  },
  {
    label: "Designs",
    href: "/designs",
    subheading:
      "Finished compositions to study and reuse. How type, spacing and colour hold together when the whole thing is done.",
    cta: "Browse designs",
    theme: "orange",
  },
  {
    label: "Loaders",
    href: "/loaders",
    subheading:
      "Waiting states worth watching. Lightweight SVG animations you can recolour, resize and drop wherever something is loading.",
    cta: "Browse loaders",
    theme: "sky",
  },
  {
    label: "Icons",
    href: "/icons",
    subheading:
      "Icons that respond to what the user does. Each one animates from the state you pass in, not on a timer.",
    cta: "Browse icons",
    theme: "green",
  },
  // Sections is the one catalog the intro doesn't name, so it has no place in
  // that sequence — it trails the six that do.
  {
    label: "Sections",
    href: "/sections",
    subheading:
      "Full-width page sections ready to stack into a landing page. Bring your copy and images, the layout is done.",
    cta: "Browse sections",
    theme: "violet",
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
  row,
}: HeroLinkCard & { row: number }) {
  const [isHovered, setIsHovered] = useState(false);

  const card = (
    // Five independent knobs, all tuned from this one line:
    //   --card-pad     edge padding (shadcn's own --card-spacing drives px)
    //   --card-py      card's own top and bottom padding
    //   --preview-h    minimum height of the preview box
    //   --text-gap     preview → title
    //   --cta-gap      minimum description → CTA; the text block is flex-1 so
    //                  the CTA sits at the bottom and this gap only grows
    // gap-0 kills card.tsx's shared gap so each space is set by its own
    // margin below; otherwise every gap moves together.
    // Concentric radii: the preview sits 12px (--card-pad) inside the card, so
    // the card's 20px matches the preview's 8px + that 12px gap.
    <Card className="[--card-pad:--spacing(3)] [--card-py:--spacing(3)] [--preview-h:--spacing(36)] [--text-gap:--spacing(4)] [--cta-gap:--spacing(6)] [--card-spacing:var(--card-pad)] h-full gap-0 py-(--card-py) text-left transition-shadow duration-200 corner-squircle rounded-[20px] group-hover:ring-foreground/20">
      {/* Fixed preview height, and the TEXT block below is the flex-1 one. If
          the preview flexed instead, a 3-line description would hand its spare
          line to the mosaic and push that card's title lower than its
          neighbours'. This way every title lands on the same y, and a shorter
          description just leaves more slack above the CTA. */}
      <CardContent>
        <div className="relative h-(--preview-h) w-full overflow-hidden rounded-lg bg-muted">
          <HeroPixelGrid theme={theme} />
        </div>
      </CardContent>

      <CardContent className="mt-(--text-gap) flex flex-1 flex-col">
        <CardTitle>
          {/* h2: the page has one h1 and these cards are its section index,
              so they're the next heading level for screen-reader navigation.
              Size still comes from the variant. */}
          <Paragraph as="h2" variant="title" className="">
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
        variants={rowEntrance}
        custom={row}
        aria-disabled
        className={`group ${CARD_SLOT}`}
      >
        {card}
      </motion.div>
    );
  }

  return (
    <motion.div variants={rowEntrance} custom={row} className={CARD_SLOT}>
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
    ...HERO_LINKS.map((link, i) => ({
      key: link.label,
      node: <HeroLinkCardItem {...link} row={i < ROW_BREAK ? 0 : 1} />,
    })),
    {
      key: "github",
      // Last card of the second row, so it arrives with its neighbours.
      node: (
        <motion.div variants={rowEntrance} custom={1} className={CARD_SLOT}>
          <HeroCreatorCard />
        </motion.div>
      ),
    },
  ];
}

export function HeroLinksList() {
  return (
    <motion.div
      className={cn(RAIL, "pt-4")}
      // Timing lives in rowEntrance, keyed off each card's row. The parent
      // only propagates the hidden/show state — no staggerChildren, or the
      // eight cards would queue up again underneath the row grouping.
      variants={{ hidden: {}, show: {} }}
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
