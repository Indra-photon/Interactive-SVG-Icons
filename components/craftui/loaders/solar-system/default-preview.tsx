"use client";

import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";
import { SolarSystem } from "./default";

export default function SolarSystemPreview() {
  return <SolarSystem {...useLoaderProps()} />;
}
