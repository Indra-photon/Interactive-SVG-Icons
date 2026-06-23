"use client";

import { BarsBounce } from "@/components/craftui/loaders/bars-bounce/default";
import { BarsWave } from "@/components/craftui/loaders/bars-wave/default";
import { DotsRotate } from "@/components/craftui/loaders/dots-rotate/default";
import { PulseRing } from "@/components/craftui/loaders/pulse-ring/default";
import { ConicSpinner } from "@/components/craftui/loaders/conic-spinner/default";
import { IosSpinner } from "@/components/craftui/loaders/ios-spinner/default";
import { HexagonRotate } from "@/components/craftui/loaders/hexagon-rotate/default";
import { DotsCompress } from "@/components/craftui/loaders/dots-compress/default";
import { DotMatrixRain } from "@/components/craftui/loaders/dot-matrix-rain/default";
import { CrossExpand } from "@/components/craftui/loaders/cross-expand/default";
import { BarsCascade } from "@/components/craftui/loaders/bars-cascade/default";
import { DotsBounce } from "@/components/craftui/loaders/dots-bounce/default";
import { InfinityLoop } from "@/components/craftui/loaders/infinity-loop/default";
import { HeartFill } from "@/components/craftui/loaders/heart-fill/default";
import { DotMatrixVortex } from "@/components/craftui/loaders/dot-matrix-vortex/default";
import { DockBounce } from "@/components/craftui/loaders/dock-bounce/default";
import { BallBounceBox } from "@/components/craftui/loaders/ball-bounce-box/default";
import { IosSpinnerPulse } from "@/components/craftui/loaders/ios-spinner-pulse/default";
import { AudioBarsOpacity } from "@/components/craftui/loaders/audio-bars-opacity/default";
import { TriangleCascade } from "@/components/craftui/loaders/triangle-cascade/default";
import { IosSpinnerDual } from "@/components/craftui/loaders/ios-spinner-dual/default";
import { GridSnake } from "@/components/craftui/loaders/grid-snake/default";
import { GridClock } from "@/components/craftui/loaders/grid-clock/default";
import { CircleSpinnerWipe } from "@/components/craftui/loaders/circle-spinner-wipe/default";
import { BarsFillSequential } from "@/components/craftui/loaders/bars-fill-sequential/default";

const CELL = 72;
const SIZE = 36;

const LOADERS = [
  <BarsBounce width={SIZE} height={SIZE} isAnimating />,
  <BarsWave width={SIZE} height={SIZE} isAnimating />,
  <DotsRotate width={SIZE} height={SIZE} isAnimating />,
  <PulseRing width={SIZE} height={SIZE} isAnimating />,
  <ConicSpinner width={SIZE} height={SIZE} isAnimating />,
  <IosSpinner width={SIZE} height={SIZE} isAnimating />,
  <HexagonRotate width={SIZE} height={SIZE} isAnimating />,
  <DotsCompress width={SIZE} isAnimating />,
  <DotMatrixRain width={SIZE} height={SIZE} isAnimating />,
  <CrossExpand width={SIZE} height={SIZE} isAnimating />,
  <BarsCascade width={SIZE} height={SIZE} isAnimating />,
  <DotsBounce width={SIZE} height={SIZE} isAnimating />,
  <InfinityLoop width={SIZE} height={SIZE} isAnimating />,
  <HeartFill width={SIZE} height={SIZE} isAnimating />,
  <DotMatrixVortex width={SIZE} height={SIZE} isAnimating />,
  <DockBounce width={SIZE} height={SIZE} isAnimating />,
  <BallBounceBox width={SIZE} height={SIZE} isAnimating />,
  <IosSpinnerPulse width={SIZE} height={SIZE} isAnimating />,
  <AudioBarsOpacity width={SIZE} height={SIZE} isAnimating />,
  <TriangleCascade width={SIZE} height={SIZE} isAnimating />,
  <IosSpinnerDual width={SIZE} height={SIZE} isAnimating />,
  <GridSnake width={SIZE} height={SIZE} isAnimating />,
  <GridClock width={SIZE} height={SIZE} isAnimating />,
  <CircleSpinnerWipe width={SIZE} height={SIZE} isAnimating />,
  <BarsFillSequential width={SIZE} height={SIZE} isAnimating />,
];

export function HeroLoaderGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-0 top-0 opacity-[0.850] mask-b-from-30% mask-l-from-30% "
      style={{
        maskImage:
          "linear-gradient(to left, black 40%, transparent 90%), linear-gradient(to bottom, black 40%, transparent 90%)",
        maskComposite: "intersect",
        WebkitMaskImage:
          "linear-gradient(to left, black 40%, transparent 90%), linear-gradient(to bottom, black 40%, transparent 90%)",
        WebkitMaskComposite: "source-in",
      }}
    >
      <div className="grid grid-cols-5 gap-5">
        {LOADERS.map((loader, i) => (
          <div
            key={i}
            className="flex items-center justify-center"
            style={{
              width: CELL,
              height: CELL,
              boxShadow:
                "0 0 0 1px rgba(38, 38, 38, 0.18), 0 1px 3px rgba(38, 38, 38, 0.06)",
            }}
          >
            {loader}
          </div>
        ))}
      </div>
    </div>
  );
}
