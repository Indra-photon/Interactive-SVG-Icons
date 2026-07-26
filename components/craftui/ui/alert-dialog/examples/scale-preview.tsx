"use client";

import { ScaleAlertDialog } from "../scale";
import { useUIProps } from "@/components/ui-gallery/UIPropsContext";

export default function ScalePreview() {
  const { duration = 200 } = useUIProps();

  return (
    <div className="flex h-full min-h-[420px] w-full items-center justify-center bg-background p-10 antialiased">
      <ScaleAlertDialog duration={duration} />
    </div>
  );
}
