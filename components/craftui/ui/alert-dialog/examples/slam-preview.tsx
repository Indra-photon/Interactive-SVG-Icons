"use client";

import { SlamAlertDialog } from "../slam";
import { useUIProps } from "@/components/ui-gallery/UIPropsContext";

export default function SlamPreview() {
  const { duration = 500 } = useUIProps();

  return (
    <div className="flex h-full min-h-[420px] w-full items-center justify-center bg-background p-10 antialiased">
      <SlamAlertDialog duration={duration} />
    </div>
  );
}
