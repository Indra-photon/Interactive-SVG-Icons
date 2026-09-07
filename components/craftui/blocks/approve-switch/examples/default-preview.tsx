"use client";

import ApproveSwitch from "../default";

// The block already owns its own centring and themed ground, so the preview
// only reserves the height the expanded pill needs and hands the rest over.
export default function DefaultPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <ApproveSwitch />
    </div>
  );
}
