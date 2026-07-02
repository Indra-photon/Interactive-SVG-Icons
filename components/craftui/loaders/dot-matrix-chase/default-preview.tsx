"use client";

import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";
import { DotMatrixChase } from "./default";

export default function DotMatrixChasePreview() {
  const propValues = useLoaderProps();
  return <DotMatrixChase {...propValues} isAnimating={true} />;
}
