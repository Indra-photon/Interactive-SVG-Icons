"use client";

import { ScrambleButton } from "../scramble";
import { useUIProps } from "@/components/ui-gallery/UIPropsContext";

export default function ScramblePreview() {
  const {
    label = "Whimsy",
    frameDuration = 35,
    staggerFrames = 3,
  } = useUIProps();

  return (
    <div className="flex min-h-[420px] w-full items-center justify-center bg-background p-10 antialiased">
      <ScrambleButton
        label={label}
        frameDuration={frameDuration}
        staggerFrames={staggerFrames}
        variant="outline"
        className="h-14 px-8 text-lg"
      />
    </div>
  );
}
