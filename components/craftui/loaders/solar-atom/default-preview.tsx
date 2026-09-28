"use client";

import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";
import { SolarAtom } from "./default";

export default function SolarAtomPreview() {
  return <SolarAtom {...useLoaderProps()} />;
}
