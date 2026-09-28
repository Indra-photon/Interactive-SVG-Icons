"use client";

import { useLoaderProps } from "@/components/loader-gallery/LoaderPropsContext";
import { SolarNebulaDust } from "./default";

export default function SolarNebulaDustPreview() {
  return <SolarNebulaDust {...useLoaderProps()} />;
}
