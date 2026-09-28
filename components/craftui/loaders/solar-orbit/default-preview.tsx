"use client";

import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";
import { SolarOrbit } from "./default";

export default function SolarOrbitPreview() {
  return <SolarOrbit {...useLoaderProps()} />;
}
