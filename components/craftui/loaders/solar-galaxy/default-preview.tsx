"use client";

import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";
import { SolarGalaxy } from "./default";

export default function SolarGalaxyPreview() {
  return <SolarGalaxy {...useLoaderProps()} />;
}
