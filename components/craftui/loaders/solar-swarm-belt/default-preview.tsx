"use client";

import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";
import { SolarSwarmBelt } from "./default";

export default function SolarSwarmBeltPreview() {
  return <SolarSwarmBelt {...useLoaderProps()} />;
}
