"use client";

import { useEffect, useState } from "react";

/**
 * A 32px live thumbnail of a catalog item, for the related list in the detail
 * rail. Only worth using where the item is genuinely small — loaders and icons
 * render at this size natively, so four of them cost about what one gallery
 * card does. Blocks and sections don't; they list by name instead.
 *
 * 32 rather than 40 so a related row stays on the sidebar's 28px row rhythm
 * instead of standing a third taller than every row around it, and the well is
 * `sidebar-accent` because it is drawn on the rail's `bg-sidebar` card — the
 * old `muted/60` was mixed for the page background and read as a grey hole.
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
    <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-sidebar-accent">
      {Component && (
        <div className="flex size-6 items-center justify-center">
          <Component />
        </div>
      )}
    </div>
  );
}
