"use client";

import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";
import { SolarEllipse } from "./default";

export default function SolarEllipsePreview() {
  return <SolarEllipse {...useLoaderProps()} />;
}
