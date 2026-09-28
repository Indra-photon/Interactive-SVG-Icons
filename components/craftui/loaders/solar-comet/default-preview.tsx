"use client";

import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";
import { SolarComet } from "./default";

export default function SolarCometPreview() {
  return <SolarComet {...useLoaderProps()} />;
}
