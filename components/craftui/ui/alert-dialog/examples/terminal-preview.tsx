"use client";

import { TerminalAlertDialog } from "../terminal";
import { useUIProps } from "@/components/ui-gallery/UIPropsContext";

export default function TerminalPreview() {
  const { duration = 350 } = useUIProps();

  return (
    <div className="flex h-full min-h-[420px] w-full items-center justify-center bg-background p-10 antialiased">
      <TerminalAlertDialog duration={duration} />
    </div>
  );
}
