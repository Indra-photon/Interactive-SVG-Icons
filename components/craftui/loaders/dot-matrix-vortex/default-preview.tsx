"use client";

import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";
import { DotMatrixVortex } from "./default";

export default function DotMatrixVortexPreview() {
  const propValues = useLoaderProps();
  return <DotMatrixVortex {...propValues} isAnimating={true} />;
}
