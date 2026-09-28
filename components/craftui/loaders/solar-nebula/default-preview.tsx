"use client";

import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";
import { SolarNebula } from "./default";

export default function SolarNebulaPreview() {
  return <SolarNebula {...useLoaderProps()} />;
}
