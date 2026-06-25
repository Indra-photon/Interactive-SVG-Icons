"use client";

import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";
import { DotMatrixRain } from "./default";

export default function DotMatrixRainPreview() {
  const propValues = useLoaderProps();
  return <DotMatrixRain {...propValues} isAnimating={true} />;
}
