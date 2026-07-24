"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { CrossExpand } from "@/components/craftui/loaders/cross-expand/default";
import { BarsBounce } from "@/components/craftui/loaders/bars-bounce/default";
import { AudioBarsGlow } from "@/components/craftui/loaders/audio-bars-glow/default";
import { BarsWave } from "@/components/craftui/loaders/bars-wave/default";
import { DotsRotate } from "@/components/craftui/loaders/dots-rotate/default";
import { BarsCascade } from "@/components/craftui/loaders/bars-cascade/default";
import { DotsCompress } from "@/components/craftui/loaders/dots-compress/default";
import { PulseRing } from "@/components/craftui/loaders/pulse-ring/default";
import { InfinityLoop } from "@/components/craftui/loaders/infinity-loop/default";
import { HeartFill } from "@/components/craftui/loaders/heart-fill/default";
import { ConicSpinner } from "@/components/craftui/loaders/conic-spinner/default";
import { DotsBounce } from "@/components/craftui/loaders/dots-bounce/default";
import { HexagonRotate } from "@/components/craftui/loaders/hexagon-rotate/default";
import { DotMatrixRain } from "@/components/craftui/loaders/dot-matrix-rain/default";
import { DotMatrixVortex } from "@/components/craftui/loaders/dot-matrix-vortex/default";
import { IosSpinner } from "@/components/craftui/loaders/ios-spinner/default";
import { DockBounce } from "@/components/craftui/loaders/dock-bounce/default";
import { BallBounceBox } from "../craftui/loaders/ball-bounce-box/default";
import { Button } from "../ui/button";

// ─── Data ─────────────────────────────────────────────────────────────────────

type LoaderComponent = React.ComponentType<{
  width?: number;
  height?: number;
  isAnimating?: boolean;
}>;

// 16 loaders → 4 rows × 4 cols
const LOADERS: { name: string; component: LoaderComponent }[] = [
  { name: "Bars Bounce", component: BarsBounce },
  { name: "Audio Bars", component: AudioBarsGlow },
  { name: "Bars Wave", component: BarsWave },
  { name: "Dot Matrix", component: DotMatrixRain },
  { name: "Dots Rotate", component: DotsRotate },
  { name: "Bars Cascade", component: BarsCascade },
  { name: "Bouncing Loader", component: BallBounceBox },
  { name: "Dot Vortex", component: DotMatrixVortex },
  { name: "Pulse Ring", component: PulseRing },
  { name: "Infinity Loop", component: InfinityLoop },
  { name: "Heart Fill", component: HeartFill },
  { name: "iOS Spinner", component: IosSpinner },
  { name: "Conic Spinner", component: ConicSpinner },
  { name: "Dots Bounce", component: DotsBounce },
  { name: "Hexagon Rotate", component: HexagonRotate },
  { name: "Dock Bounce", component: DockBounce },
];

// ─── Section ──────────────────────────────────────────────────────────────────

export function LoaderSection() {
  return (
    <div className="px-10 py-18 flex items-center justify-between gap-28">
      {/* ── Left: loader grid ── */}
      <div className="grid grid-cols-4 gap-3">
        {LOADERS.map((item) => (
          <Link
            key={item.name}
            href={`/loaders/${item.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="flex flex-col items-center justify-center gap-1 w-[72px] h-[72px] bg-white/90 hover:bg-white/20 transition-colors duration-200"
          >
            <item.component width={40} height={40} isAnimating />
            <span className="text-[9px] text-black font-mono leading-none text-center w-full px-1 truncate">
              {item.name}
            </span>
          </Link>
        ))}
      </div>

      {/* ── Right: heading + paragraph ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="flex flex-col justify-start gap-24"
      >
        <div>
          <Heading as="h2" className="flex items-center gap-3">
            <CrossExpand
              width={64}
              height={64}
              color="var(--primary)"
              isAnimating
            />
            Loaders
          </Heading>
          <Paragraph className="text-foreground/60 max-w-md">
            Smooth, looping animations for every loading state. Drop into any
            React project with a single copy-paste.
          </Paragraph>
        </div>

        <div>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="corner-squircle rounded-[10px] w-full font-mono tracking-tighter"
          >
            <Link href="/illustrations">Browse Illustrations</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
