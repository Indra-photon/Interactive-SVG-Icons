"use client";

import TeletypeClock from "../default";

export default function DefaultPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background py-16">
      <TeletypeClock demo />
    </div>
  );
}
