"use client";

import { useEffect, useState } from "react";
import { NetworkDiagramSVG } from "@/components/Homepage/NetworkDiagramSVG";

// 600ms initial delay + 4 cubes × (450ms arrive + 2200ms hold) = ~11.2s per cycle
const CYCLE_MS = 12000;

export function HeroNetworkDiagram() {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCycle((c) => c + 1), CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-20 left-1/2 -translate-x-1/2 opacity-[0.45] w-[320px]"
    >
      <NetworkDiagramSVG key={cycle} />
    </div>
  );
}
