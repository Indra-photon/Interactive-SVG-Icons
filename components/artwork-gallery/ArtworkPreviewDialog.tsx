"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Dialog,
  DialogContentPanel,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Paragraph } from "@/components/Paragraph";
import { CopyButton } from "@/components/loader-gallery/CopyButton";
import { MORPH_IN, morphChrome, morphChromeInstant } from "@/lib/motion";
import type { CatalogItem, CatalogVariation } from "@/types/catalog";

interface ArtworkPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: CatalogItem;
  variation: CatalogVariation;
  /**
   * The already-resolved artwork, handed up by the card that owns the chunk.
   * Loading it again here would mean the panel morphs open around an empty box.
   */
  Artwork: React.ComponentType;
  /** Same string the card puts on its well — this is the whole morph. */
  layoutId: string;
  /** CSS aspect-ratio, identical to the card's well. */
  aspect: string;
  installCommand: string;
}

/**
 * The expanded state of an artwork card.
 *
 * Radix owns the behaviour — focus trap, Escape, scroll lock, and returning
 * focus to the card that opened it — while Framer owns the geometry. The panel
 * carries the same `layoutId` as the card's well, so opening is one box
 * travelling rather than a new box appearing.
 *
 * The panel keeps the card's aspect ratio exactly, which is what makes the
 * morph read as a zoom: same shape, new size, so nothing inside it distorts on
 * the way.
 */
export function ArtworkPreviewDialog({
  open,
  onOpenChange,
  item,
  variation,
  Artwork,
  layoutId,
  aspect,
  installCommand,
}: ArtworkPreviewDialogProps) {
  const reduced = useReducedMotion();
  const chrome = reduced ? morphChromeInstant : morphChrome;

  // Widest of: the viewport, the height budget at this ratio, and a cap so a
  // small design is not blown up past the size it was composed at.
  const width = `min(92vw, calc(80vh * ${aspect.replace(" / ", "/")}), 1100px)`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* AnimatePresence sits outside the conditional so it still holds the
       * subtree during exit; forceMount stops Radix unmounting the overlay and
       * panel the moment `open` flips, before the exit has played.
       *
       * No DialogPortal, deliberately.
       *
       * A portal puts the panel in `body` while its Motion projection parent
       * stays this component's place in the React tree — two different
       * ancestors, and the shared-layout maths is computed against the wrong
       * one, so the morph starts from an origin the panel is not at. Rendered
       * in place, the DOM tree and the React tree agree. Nothing is lost: the
       * gallery section creates no stacking or containing block, so `fixed`
       * still resolves against the viewport. */}
      <AnimatePresence>
        {open && (
          <>
            <DialogOverlay asChild forceMount>
              <motion.div
                variants={chrome}
                initial="hidden"
                animate="show"
                exit="exit"
                // No click handler here: the content frame covers this and
                // takes every pointer event, so a handler on the overlay would
                // be dead code. Dismissal lives on the frame instead.
                className="fixed inset-0 z-50 bg-background/70 supports-backdrop-filter:backdrop-blur-sm"
              />
            </DialogOverlay>

            <DialogContentPanel asChild forceMount>
              {/* Dismissal is handled here, not by Radix's outside-click.
               *
               * While a modal layer is open Radix disables pointer events on
               * the body and writes `pointer-events: auto` inline onto this
               * node — an inline style the `pointer-events-none` class cannot
               * beat. So this full-screen frame swallows every click, the
               * overlay beneath it never receives one, and nothing Radix
               * considers "outside" is ever clicked.
               *
               * The target check is what keeps it honest: only a hit on the
               * frame itself closes. Clicks on the artwork or the caption have
               * those elements as their target and bubble through untouched. */}
              <motion.div
                onClick={(e) => {
                  if (e.target === e.currentTarget) onOpenChange(false);
                }}
                className="fixed inset-0 z-50 flex cursor-zoom-out flex-col items-center justify-center gap-5 p-4 outline-none sm:p-8"
              >
                <DialogTitle className="sr-only">{item.name}</DialogTitle>
                <DialogDescription className="sr-only">
                  {variation.description ?? item.description}
                </DialogDescription>

                <motion.div
                  layoutId={reduced ? undefined : layoutId}
                  transition={MORPH_IN}
                  // Identical to the card's well: same radius, same surface,
                  // same source. The ring is gone rather than matched — it is a
                  // box-shadow, so it thickens with the scale unless Motion
                  // owns it too, and an edge is not worth that here.
                  style={{ aspectRatio: aspect, width, borderRadius: 12 }}
                  className="relative max-h-[80vh] overflow-hidden bg-card"
                >
                  {/* Its own layoutId, paired with the card's content box, so
                      the artwork is counter-scaled and re-lays-out at each
                      intermediate size rather than riding the parent's scale
                      as a flat image. */}
                  <motion.div
                    layoutId={reduced ? undefined : `${layoutId}-content`}
                    transition={MORPH_IN}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Artwork />
                  </motion.div>
                </motion.div>

                {/* Caption and install command are not part of the morph: they
                 * belong to the expanded state only, so they fade in over the
                 * box rather than stretching out of a card that never had
                 * them at this size. */}
                <motion.div
                  variants={chrome}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  // w-auto, not w-full: a full-width wrapper swallows the
                  // empty space either side of the caption, and a tap there
                  // looks like a tap on the backdrop but never reaches it.
                  className="pointer-events-auto flex w-auto max-w-xl flex-col items-center gap-3 text-center"
                >
                  <Paragraph variant="title">{item.name}</Paragraph>
                  <CopyButton text={installCommand} />
                </motion.div>
              </motion.div>
            </DialogContentPanel>
          </>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
