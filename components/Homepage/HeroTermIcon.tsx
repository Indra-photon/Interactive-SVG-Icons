import {
  BookImageIcon,
  BounceRightIcon,
  CellsIcon,
  LayoutGridIcon,
  LoaderPinwheelIcon,
  ShapeCollectionIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

/**
 * Marks for the catalog terms in the hero intro.
 *
 * Each one is the same Hugeicons glyph the navbar uses for that destination
 * (see constants/navlinks.tsx), so a term in the prose, its card below, and its
 * nav entry all show the reader the same symbol.
 *
 * Imported directly rather than looked up from `navlinks` by route: the lookup
 * would be a runtime find() that silently returns undefined if a URL is ever
 * renamed, where an import breaks the build. If you re-icon a nav entry, change
 * it here too.
 */
export type HeroTermMark =
  | "blocks"
  | "illustrations"
  | "ui"
  | "designs"
  | "loaders"
  | "icons";

const MARKS: Record<HeroTermMark, IconSvgElement> = {
  blocks: CellsIcon,
  illustrations: BookImageIcon,
  ui: LayoutGridIcon,
  designs: ShapeCollectionIcon,
  loaders: LoaderPinwheelIcon,
  icons: BounceRightIcon,
};

export function HeroTermIcon({
  mark,
  className,
}: {
  mark: HeroTermMark;
  className?: string;
}) {
  return (
    <HugeiconsIcon
      icon={MARKS[mark]}
      // No `size` prop. HugeiconsIcon renders it as width/height presentation
      // attributes, which any author class outranks — so with a sizing
      // className passed in it would be dead weight that reads as
      // authoritative. Callers size this through `className`.
      //
      // 1.5 is the navbar's weight. At badge scale the glyph is smaller than it
      // ever is in the nav, so anything lighter starts to break up.
      strokeWidth={1.8}
      color="currentColor"
      className={className}
      aria-hidden="true"
    />
  );
}
