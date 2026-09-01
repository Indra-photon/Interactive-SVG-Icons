"use client";

import { useEffect, useState } from "react";

/**
 * A 40px live thumbnail of a catalog item, for the related list in the detail
 * rail. Only worth using where the item is genuinely small — loaders and icons
 * render at this size natively, so four of them cost about what one gallery
 * card does. Blocks and sections don't; they list by name instead.
 */
export function RailMiniPreview({
  catalogDir,
  slug,
  variation,
}: {
  catalogDir: string;
  slug: string;
  variation: string;
}) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let active = true;
    // One template literal, matching the other dynamic preview imports: a
    // per-catalog literal path can't resolve while a catalog directory is empty.
    import(`@/components/craftui/${catalogDir}/${slug}/${variation}.tsx`)
      .then((mod) => {
        const exported = mod.default ?? mod[Object.keys(mod)[0]];
        if (active) setComponent(() => exported);
      })
      .catch(() => {
        // A missing thumbnail leaves the empty well behind it — the row is a
        // link with a label either way.
      });
    return () => {
      active = false;
    };
  }, [catalogDir, slug, variation]);

  return (
    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted/60">
      {Component && (
        <div className="flex size-7 items-center justify-center">
          <Component />
        </div>
      )}
    </div>
  );
}
