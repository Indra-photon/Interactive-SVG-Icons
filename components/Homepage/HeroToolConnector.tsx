"use client";

import { ToolConnectorSVG } from "@/components/Homepage/ToolConnectorSVG";

export function HeroToolConnector() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-20 w-[260px] opacity-[0.45]"
      style={{ right: "calc(50% + 180px)" }}
    >
      <ToolConnectorSVG />
    </div>
  );
}
