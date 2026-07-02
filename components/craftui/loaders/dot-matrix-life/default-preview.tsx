"use client";

import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";
import { DotMatrixLife } from "./default";

export default function DotMatrixLifePreview() {
  const propValues = useLoaderProps();
  return <DotMatrixLife {...propValues} isAnimating={true} />;
}
