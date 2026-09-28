"use client";

import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";
import { SolarBinary } from "./default";

export default function SolarBinaryPreview() {
  return <SolarBinary {...useLoaderProps()} />;
}
