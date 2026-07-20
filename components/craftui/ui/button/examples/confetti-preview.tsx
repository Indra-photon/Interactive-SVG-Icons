"use client";

import { ConfettiButton } from "../confetti";
import { useUIProps } from "@/components/ui-gallery/UIPropsContext";

export default function ConfettiPreview() {
  const {
    particleCount = 14,
    baseHue = 200,
    spread = 60,
    duration = 0.8,
  } = useUIProps();

  return (
    <div className="flex min-h-[420px] w-full items-center justify-center bg-background p-10 antialiased">
      <ConfettiButton
        particleCount={particleCount}
        baseHue={baseHue}
        spread={spread}
        duration={duration}
        className="h-14 px-8 text-lg"
      >
        Confetti
      </ConfettiButton>
    </div>
  );
}
