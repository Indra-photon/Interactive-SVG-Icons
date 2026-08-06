"use client";

import { motion } from "framer-motion";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { HeroRippleLine } from "@/components/Homepage/HeroRippleLine";
import { ShowcaseCard } from "@/components/Homepage/ShowcaseCard";
import { SHOWCASE_ITEMS } from "@/constants/showcase";

/** Cards above this index wait for the viewport before they start loading. */
const EAGER_COUNT = 3;

export function ShowcaseSection() {
  if (SHOWCASE_ITEMS.length === 0) return null;

  return (
    // Matches HeroLinksList's rail exactly, so the grid's outer edges land on
    // the same vertical as the hero cards above it.
    <motion.section
      className="mx-auto w-full max-w-6xl px-8 sm:px-4 pb-24 pt-8"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.07 } },
      }}
    >
      {/* Negative margin lets the rule outgrow the rail, echoing the divider
          above the hero cards. */}
      <div className="-mx-4 mb-10 md:-mx-10">
        <HeroRippleLine orientation="horizontal" className="w-full" />
      </div>

      <Heading as="h2" className="sm:text-left">
        Components to make your UI shine
      </Heading>

      <Paragraph variant="body" className="mt-4 max-w-2xl">
        Each icon, loaders and illustrations are designed to be interactive,
        engaging, and visually appealing. Explore the showcase below to see how
        these elements come to life in real-world applications.
      </Paragraph>

      {/* CSS multi-column is the actual Pinterest mechanism: it balances by
          content height, so mixed aspect ratios settle on their own with no
          measurement pass and no layout shift. Order flows down each column
          rather than across rows. Row rhythm is the cards' own mb-4/mb-5,
          since columns have no row gap. */}
      <div className="mt-10 columns-1 gap-4 sm:columns-2 sm:gap-5 xl:columns-3">
        {SHOWCASE_ITEMS.map((item, i) => (
          <ShowcaseCard key={item.id} {...item} eager={i < EAGER_COUNT} />
        ))}
      </div>
    </motion.section>
  );
}
