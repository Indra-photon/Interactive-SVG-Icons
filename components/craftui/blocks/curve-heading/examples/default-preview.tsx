"use client";

import { useRef } from "react";
import CurveHeading from "../default";

export default function DefaultPreview() {
  /* The gallery well is a fixed-height, clipped box, so the block is given
     its own scroller and told to measure against it. On a real page you drop
     <CurveHeading /> in with no props and it reads the window instead. */
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={scrollRef} className="h-full w-full overflow-y-auto">
      <CurveHeading scrollRoot={scrollRef} hint="Scroll me" />
    </div>
  );
}
