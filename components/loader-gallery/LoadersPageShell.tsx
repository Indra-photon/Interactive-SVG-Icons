"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Sidebar,
  type SidebarSectionConfig,
} from "@/components/sidebar/Sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LoaderContentPanel } from "./LoaderContentPanel";
// import { PatternSection } from "@/components/PatternSection";
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
    <div className="h-[calc(100dvh-1.5rem)] w-full">
      {/* <PatternSection
        hideTopBar={true}
        fillHeight
        className="h-full"
        contentClassName="flex h-full overflow-hidden"
      > */}
      <SidebarProvider className="h-full min-h-0 overflow-hidden rounded-(--page-radius) bg-card">
        <Sidebar
          sections={sidebarSections}
          activeSlug={activeSlug}
          onSelect={handleSelect}
        />

        <SidebarInset className="min-w-0 overflow-hidden bg-transparent">
          <SidebarTrigger className="absolute top-3 left-3 z-20" />

          <LoaderContentPanel
            loaders={loaders}
            activeSlug={activeSlug}
            onSelect={handleSelect}
          />
        </SidebarInset>
      </SidebarProvider>
      {/* </PatternSection> */}
    </div>
  );
}
