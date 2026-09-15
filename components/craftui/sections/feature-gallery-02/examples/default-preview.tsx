"use client";

import FeatureGallery02 from "../default";

/* The section sizes itself in cqh/cqw and scrolls against its nearest
 * scrollable ancestor, so the preview frame is both: a size container one
 * viewport high, scrollable, in the inline card and in fullscreen alike. */
export default function DefaultPreview() {
  return (
    <div className="h-dvh w-full overflow-y-auto overscroll-contain [container-type:size]">
      <FeatureGallery02 />
    </div>
  );
}
