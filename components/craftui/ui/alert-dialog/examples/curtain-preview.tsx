"use client";

import { CurtainAlertDialog } from "../curtain";
import { useUIProps } from "@/components/ui-gallery/UIPropsContext";

export default function CurtainPreview() {
  const { duration = 600 } = useUIProps();

  return (
    <div className="flex h-full min-h-[420px] w-full items-center justify-center bg-background p-10 antialiased">
      <CurtainAlertDialog duration={duration} />
    </div>
  );
}
