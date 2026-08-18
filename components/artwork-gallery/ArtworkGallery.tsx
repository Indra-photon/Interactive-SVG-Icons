"use client";

import { motion } from "framer-motion";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { HeroRippleLine } from "@/components/Homepage/HeroRippleLine";
import { ArtworkCard } from "@/components/artwork-gallery/ArtworkCard";
import type { ArtworkCatalogConfig } from "@/lib/catalog-config";
import type { CatalogItem } from "@/types/catalog";

interface ArtworkGalleryProps {
  items: CatalogItem[];
  catalog: ArtworkCatalogConfig;
  /** Resolved server-side so copied commands never advertise localhost. */
  baseUrl: string;
}

export function ArtworkGallery({
  items,
  catalog,
  baseUrl,
}: ArtworkGalleryProps) {
  // One card per variation, not per item: artwork almost always has a single
  // `default`, but a slug with two takes two cards rather than hiding one
  // behind a switcher that this gallery deliberately does not have.
  const cards = items.flatMap((item) =>
    item.variations.map((variation) => ({ item, variation })),
  );

  return (
    // Matches ShowcaseSection's rail exactly, so both grids sit on the same
    // vertical wherever they appear on the site.
    <motion.section
      className="mx-auto w-full max-w-7xl px-8 sm:px-4 pb-24 pt-8"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.07 } },
      }}
    >
      {/* <Heading as="h1" className="sm:text-left">
        {catalog.heading}
      </Heading>

      <Paragraph variant="body" className="mt-4 max-w-2xl">
        {catalog.intro}
      </Paragraph> */}

      {cards.length === 0 ? (
        <div className="mt-16 max-w-xl">
          <Paragraph variant="title">{catalog.empty.title}</Paragraph>
          <Paragraph variant="body" className="mt-2">
            {catalog.empty.body}
          </Paragraph>
        </div>
      ) : (
        // CSS multi-column is the actual Pinterest mechanism: it balances by
        // content height, so mixed aspect ratios settle on their own with no
        // measurement pass and no layout shift. Order flows down each column
        // rather than across rows. Row rhythm is the cards' own mb-4/mb-5,
        // since columns have no row gap.
        <div className="mt-10 columns-1 gap-4 sm:columns-2 sm:gap-5 xl:columns-3">
          {cards.map(({ item, variation }) => (
            <ArtworkCard
              key={`${item.slug}-${variation.name}`}
              item={item}
              variation={variation}
              catalogDir={catalog.catalogDir}
              baseUrl={baseUrl}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}
