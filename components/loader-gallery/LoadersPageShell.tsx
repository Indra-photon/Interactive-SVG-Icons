"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Sidebar,
  type SidebarSectionConfig,
} from "@/components/sidebar/Sidebar";
import { LoaderContentPanel } from "./LoaderContentPanel";
import { PatternSection } from "@/components/PatternSection";
import type { Loader } from "@/types/loader";

interface LoadersPageShellProps {
  loaders: Loader[];
  sidebarSections: SidebarSectionConfig[];
}

export function LoadersPageShell({
  loaders,
  sidebarSections,
}: LoadersPageShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeSlug = searchParams.get("slug") ?? undefined;

  // No slug means nothing to show here — send visitors to the gallery.
  useEffect(() => {
    if (!activeSlug) {
      router.replace("/loader-gallery");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (slug: string) => {
    router.replace(`/loaders?slug=${slug}`, { scroll: false });
  };

  return (
    <div className="h-[calc(100vh-65px)] max-w-9xl mx-auto">
      <PatternSection
        hideTopBar={true}
        fillHeight
        className="h-full"
        contentClassName="flex h-full overflow-hidden"
      >
        <Sidebar
          sections={sidebarSections}
          activeSlug={activeSlug}
          onSelect={handleSelect}
        />

        <LoaderContentPanel
          loaders={loaders}
          activeSlug={activeSlug}
          onSelect={handleSelect}
        />
      </PatternSection>
    </div>
  );
}
