"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Paragraph } from "@/components/Paragraph";
import { CopyButton } from "@/components/loader-gallery/CopyButton";
import { cardEntrance, MORPH_INSTANT, MORPH_OUT } from "@/lib/motion";
import { installCommand, registryItemName } from "@/lib/registry";
import type { CatalogItem, CatalogVariation } from "@/types/catalog";

/** Used when a variation declares no intrinsic size. Landscape, like most art. */
const FALLBACK_ASPECT = "3 / 2";

/**
 * The one string the card and the dialog have to agree on, derived in both
 * places from the same pair rather than passed between them.
 *
 * Keyed by slug *and* variation: a slug with two variations puts two cards in
 * the grid, and a layoutId shared between them would morph the wrong artwork.
 */
export function artworkLayoutId(slug: string, variation: string): string {
  return `artwork-well-${slug}-${variation}`;
}

/** Both boxes take this, which is what keeps the morph a pure scale. */
export function artworkAspect(variation: CatalogVariation): string {
  return variation.width && variation.height
    ? `${variation.width} / ${variation.height}`
    : FALLBACK_ASPECT;
}

interface ArtworkCardProps {
  item: CatalogItem;
  variation: CatalogVariation;
  /** Directory under components/craftui the artwork is imported from. */
  catalogDir: string;
  /** Resolved on the server so the copied command never says localhost. */
  baseUrl: string;
  /** True while this card's artwork is the one expanded. Drives aria-expanded. */
  expanded: boolean;
  /**
   * Hands the resolved component up to the gallery, which owns the single
   * dialog. The card cannot own it: a dialog rendered here would sit inside
   * this card's entrance `motion.div`, making that transformed element the
   * panel's projection parent even though the panel is not its DOM child.
   */
  onExpand: (Artwork: React.ComponentType) => void;
}

export function ArtworkCard({
  item,
  variation,
  catalogDir,
  baseUrl,
  expanded,
  onExpand,
}: ArtworkCardProps) {
  const [Artwork, setArtwork] = useState<React.ComponentType | null>(null);
  const reduced = useReducedMotion();

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

  const aspect = artworkAspect(variation);
  const wellId = artworkLayoutId(item.slug, variation.name);

  return (
    // mb-4 rather than a grid gap: CSS columns has no row gap, so the vertical
    // rhythm has to live on the item. break-inside-avoid stops a card being
    // split across a column boundary.
    <motion.div
      variants={cardEntrance}
      className="mb-4 break-inside-avoid sm:mb-5"
    >
      {/* Same knob pattern as ShowcaseCard: the well sits --card-pad (12px)
          inside the card on all four sides, so concentric radii require
          inner = outer - padding = 20 - 12 = 8px. `rounded-lg` is 10px in this
          project (globals.css sets --radius to 0.625rem), hence the literals. */}
      <Card className="[--card-pad:--spacing(3)] [--card-spacing:var(--card-pad)] gap-0 py-(--card-pad) text-left">
        <CardContent>
          {/* A real button, so Enter and Space open the preview and the card
              takes a focus ring in tab order. The copy command deliberately
              stays outside it — a button inside a button is invalid markup,
              and copying an install command is not "look at this bigger". */}
          <button
            type="button"
            onClick={() => Artwork && onExpand(Artwork)}
            aria-label={`Expand ${item.name}`}
            aria-haspopup="dialog"
            aria-expanded={expanded}
            disabled={!Artwork}
            className="block w-full cursor-zoom-in rounded-md outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-default"
          >
            <motion.div
              // The ratio comes from the variation's declared width/height, so the
              // well is reserved at the artwork's true proportion before its chunk
              // is even requested. Without it every card below this one in the
              // column would jump when the import resolves. The dialog's panel
              // takes the identical ratio, which is what keeps the morph a pure
              // scale with nothing distorting inside it.
              // borderRadius is inline, not a `rounded-*` class, because Motion
              // only counter-scales the radius when it owns the value — a class
              // radius stretches into ellipses under the morph's scale.
              style={{ aspectRatio: aspect, borderRadius: 12 }}
              // Shared with the expanded panel. Dropped under reduced motion so
              // the two states cut rather than travel across the screen.
              layoutId={reduced ? undefined : wellId}
              // This is the CLOSE timing, not a duplicate of the panel's.
              // Shared layout promotes whichever element survives, so the card
              // is what animates when the dialog unmounts.
              transition={reduced ? MORPH_INSTANT : MORPH_OUT}
              // outline (not border) keeps the ring out of layout, and the -1px
              // offset draws it just inside the edge so it hugs the corner radius.
              // Pure black/white only — a tinted neutral picks up the surface
              // underneath and reads as dirt on the artwork's edge.
              // bg-card matches the expanded panel exactly. Invisible here —
              // the Card underneath is already this colour — but without it the
              // morph starts by painting a background that wasn't there, which
              // reads as a swap rather than as one box moving.
              className="relative w-full overflow-hidden bg-card"
            >
              <motion.div
                // Paired with the panel's content box, not just carried by the
                // parent's scale. Without its own layoutId this box inherits the
                // parent transform, so the artwork is scaled like a flat image;
                // with one, Motion counter-scales it and the artwork re-lays-out
                // at every intermediate size instead.
                layoutId={reduced ? undefined : `${wellId}-content`}
                transition={reduced ? MORPH_INSTANT : MORPH_OUT}
                // Inset so the artwork breathes instead of bleeding to the well's
                // edge. That makes the inner box slightly off-ratio, which the
                // SVG's own preserveAspectRatio absorbs by letterboxing — the
                // reason the child is sized rather than the svg being asked to
                // stretch.
                className="absolute inset-0 flex items-center justify-center "
              >
                {Artwork && <Artwork />}
              </motion.div>
            </motion.div>
          </button>
        </CardContent>

        <CardContent className="mt-1 flex flex-col">
          {/* <Paragraph variant="title">{item.name}</Paragraph> */}
          {/* Unclamped on purpose: there is no detail route behind these cards,
              so a truncated description is information with nowhere to go. The
              masonry is built for uneven card heights anyway. */}
          {/* {variation.description && (
            <Paragraph variant="body" className="mt-1 line-clamp-3 ">
              {variation.description}
            </Paragraph>
          )} */}

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
