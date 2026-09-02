"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { HeroRippleLine } from "@/components/Homepage/HeroRippleLine";
import {
  ArtworkCard,
  artworkAspect,
  artworkLayoutId,
} from "@/components/artwork-gallery/ArtworkCard";
import { ArtworkPreviewDialog } from "@/components/artwork-gallery/ArtworkPreviewDialog";
import { installCommand, registryItemName } from "@/lib/registry";
import type { ArtworkCatalogConfig } from "@/lib/catalog-config";
import type { CatalogItem, CatalogVariation } from "@/types/catalog";

interface ArtworkGalleryProps {
  items: CatalogItem[];
  catalog: ArtworkCatalogConfig;
  /** Resolved server-side so copied commands never advertise localhost. */
  baseUrl: string;
}

/** Which card is expanded, plus the component it already had loaded. */
interface ActiveArtwork {
  item: CatalogItem;
  variation: CatalogVariation;
  Artwork: React.ComponentType;
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

  // Two pieces of state rather than one nullable object: `active` is never
  // cleared on close, because nulling it would unmount the dialog mid-exit and
  // the artwork would vanish instead of travelling back to its card.
  const [active, setActive] = useState<ActiveArtwork | null>(null);
  const [open, setOpen] = useState(false);

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
              expanded={
                open &&
                active?.item.slug === item.slug &&
                active?.variation.name === variation.name
              }
              onExpand={(Artwork) => {
                setActive({ item, variation, Artwork });
                setOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* One dialog for the whole gallery, and a sibling of the masonry rather
          than a child of a card.

          Both ends of the morph now hang off this section, which carries no
          transform of its own — the card's entrance div does, and while the
          dialog lived inside it that transformed node was the panel's
          projection parent despite not being its DOM ancestor. Motion computed
          the panel's box against an origin that was not where the panel
          actually was, so the morph started from the wrong place and read as a
          cut. */}
      {active && (
        <ArtworkPreviewDialog
          open={open}
          onOpenChange={setOpen}
          item={active.item}
          variation={active.variation}
          Artwork={active.Artwork}
          layoutId={artworkLayoutId(active.item.slug, active.variation.name)}
          aspect={artworkAspect(active.variation)}
          installCommand={installCommand(
            registryItemName(active.item.slug, active.variation.name),
            baseUrl,
          )}
        />
      )}
    </motion.section>
  );
}
