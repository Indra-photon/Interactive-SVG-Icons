"use client";

import { ReactiveAlertDialog } from "../reactive";
import { useUIProps } from "@/components/ui-gallery/UIPropsContext";

export default function ReactivePreview() {
  const {
    duration = 200,
    disagreeDuration = 300,
    disagreeAngle = 12,
    disagreeShift = 80,
  } = useUIProps();

  return (
    <div className="flex h-full min-h-[420px] w-full items-center justify-center bg-background p-10 antialiased">
      <ReactiveAlertDialog
        duration={duration}
        disagreeDuration={disagreeDuration}
        disagreeAngle={disagreeAngle}
        disagreeShift={disagreeShift}
      />
    </div>
  );
}
