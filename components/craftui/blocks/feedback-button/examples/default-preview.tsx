"use client";

import FeedbackSwitch from "../default";

// The block already owns its own centering and white ground, so the preview
// only reserves the height the expanded pill needs and hands the rest over.
export default function DefaultPreview() {
  return (
    <div className="flex h-full w-full bg-stone-200 items-center justify-center">
      <FeedbackSwitch />
    </div>
  );
}
