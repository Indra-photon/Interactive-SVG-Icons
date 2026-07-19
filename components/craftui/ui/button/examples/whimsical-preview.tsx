"use client";

import { WhimsicalButton } from "../whimsical";
import { useUIProps } from "@/components/ui-gallery/UIPropsContext";

export default function WhimsicalPreview() {
  const { mainHue = 260, decoSize = 7, timing = 1.5 } = useUIProps();

  return (
    <div className="flex min-h-[420px] w-full items-center justify-center bg-background p-10 antialiased">
      <WhimsicalButton
        mainHue={mainHue}
        decoSize={decoSize}
        timing={timing}
        className="h-14 w-48 text-lg"
      >
        Whimsy Button
      </WhimsicalButton>
    </div>
  );
}
