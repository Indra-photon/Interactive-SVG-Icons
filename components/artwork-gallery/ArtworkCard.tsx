"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Paragraph } from "@/components/Paragraph";
import { CopyButton } from "@/components/loader-gallery/CopyButton";
import { installCommand, registryItemName } from "@/lib/registry";
import type { CatalogItem, CatalogVariation } from "@/types/catalog";

// Lifted from ShowcaseCard so the two grids enter identically — this gallery is
// the same masonry with artwork where the videos are.
const cardVariants = {
  hidden: { y: 18, opacity: 0, filter: "blur(8px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] as const },
  },
};

/** Used when a variation declares no intrinsic size. Landscape, like most art. */
const FALLBACK_ASPECT = "3 / 2";

interface ArtworkCardProps {
  item: CatalogItem;
  variation: CatalogVariation;
  /** Directory under components/craftui the artwork is imported from. */
  catalogDir: string;
  /** Resolved on the server so the copied command never says localhost. */
  baseUrl: string;
}

export function ArtworkCard({
  item,
  variation,
  catalogDir,
  baseUrl,
}: ArtworkCardProps) {
  const [Artwork, setArtwork] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    // No examples/ harness the way BlockPreview has one: artwork takes no props
    // worth demonstrating, so the registry file *is* the preview.
    //
    // catalogDir stays a variable rather than being branched into two literal
    // paths, for the reason BlockPreview:45 documents: a literal `designs/`
    // prefix stops resolving the moment that directory is empty, because the
    // bundler cannot build an import context with no matches — so deleting the
    // last design would break the build rather than showing an empty gallery.
    // The cost is that the context also matches icons/loaders/blocks/sections;
    // that grows the module map, not the chunk, since context modules are
    // code-split per file.
    let cancelled = false;

    import(
      `@/components/craftui/${catalogDir}/${item.slug}/${variation.name}.tsx`
    )
      .then((mod) => {
        if (cancelled) return;
        const exported = mod.default ?? mod[Object.keys(mod)[0]];
        setArtwork(() => exported);
      })
      .catch((err) => {
        console.error(`Failed to load ${catalogDir}/${item.slug}:`, err);
      });

    return () => {
      cancelled = true;
    };
  }, [catalogDir, item.slug, variation.name]);

  const command = installCommand(
    registryItemName(item.slug, variation.name),
    baseUrl,
  );

  const aspect =
    variation.width && variation.height
      ? `${variation.width} / ${variation.height}`
      : FALLBACK_ASPECT;

  return (
    // mb-4 rather than a grid gap: CSS columns has no row gap, so the vertical
    // rhythm has to live on the item. break-inside-avoid stops a card being
    // split across a column boundary.
    <motion.div
      variants={cardVariants}
      className="mb-4 break-inside-avoid sm:mb-5"
    >
      {/* Same knob pattern as ShowcaseCard: the well sits --card-pad (12px)
          inside the card on all four sides, so concentric radii require
          inner = outer - padding = 20 - 12 = 8px. `rounded-lg` is 10px in this
          project (globals.css sets --radius to 0.625rem), hence the literals. */}
      <Card className="[--card-pad:--spacing(3)] [--card-spacing:var(--card-pad)] gap-0 py-(--card-pad) text-left">
        <CardContent>
          <div
            // The ratio comes from the variation's declared width/height, so the
            // well is reserved at the artwork's true proportion before its chunk
            // is even requested. Without it every card below this one in the
            // column would jump when the import resolves.
            style={{ aspectRatio: aspect }}
            // outline (not border) keeps the ring out of layout, and the -1px
            // offset draws it just inside the edge so it hugs the corner radius.
            // Pure black/white only — a tinted neutral picks up the surface
            // underneath and reads as dirt on the artwork's edge.
            className="relative w-full overflow-hidden rounded-[8px] bg-muted outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
          >
            <div
              // Inset so the artwork breathes instead of bleeding to the well's
              // edge. That makes the inner box slightly off-ratio, which the
              // SVG's own preserveAspectRatio absorbs by letterboxing — the
              // reason the child is sized rather than the svg being asked to
              // stretch.
              className="absolute inset-0 flex items-center justify-center p-5 sm:p-6 [&>svg]:h-full [&>svg]:w-full"
            >
              {Artwork && <Artwork />}
            </div>
          </div>
        </CardContent>

        <CardContent className="mt-4 flex flex-col">
          <Paragraph variant="title">{item.name}</Paragraph>
          {/* Unclamped on purpose: there is no detail route behind these cards,
              so a truncated description is information with nowhere to go. The
              masonry is built for uneven card heights anyway. */}
          {variation.description && (
            <Paragraph variant="body" className="mt-1 line-clamp-3 ">
              {variation.description}
            </Paragraph>
          )}

          {/* The whole configurator, replaced by one line. size="lg" (the
              default) is the full-width variant that masks the overflowing URL
              and pins the copy icon right; size="xs" sets whitespace-nowrap and
              would push a 70-character command out of the column. */}
          <div className="mt-4">
            <CopyButton text={command} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
