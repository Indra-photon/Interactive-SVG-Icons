"use client";

import HeroRoster from "../default";

// The roster needs real height to read — the dossier is a tall pane and the
// square thumbnails carry a two-line caption below them.
export default function DefaultPreview() {
  return (
    <div className="h-full min-h-[420px] w-full">
      <HeroRoster />
    </div>
  );
}
