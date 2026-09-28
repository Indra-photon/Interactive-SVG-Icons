"use client";

import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";
import { SolarDiffuse } from "./default";

export default function SolarDiffusePreview() {
  return <SolarDiffuse {...useLoaderProps()} />;
}
