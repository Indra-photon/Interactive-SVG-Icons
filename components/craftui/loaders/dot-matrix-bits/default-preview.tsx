"use client";

import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";
import { DotMatrixBits } from "./default";

export default function DotMatrixBitsPreview() {
  const propValues = useLoaderProps();
  return <DotMatrixBits {...propValues} isAnimating={true} />;
}
