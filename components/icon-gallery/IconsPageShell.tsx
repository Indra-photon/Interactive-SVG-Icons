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
import { IconContentPanel } from "./IconContentPanel";
// import { PatternSection } from "@/components/PatternSection";
import type { Icon } from "@/types/icon";

interface IconsPageShellProps {
  icons: Icon[];
  buttonCodes: Record<string, string>;
  sidebarSections: SidebarSectionConfig[];
}

export function IconsPageShell({
  icons,
  buttonCodes,
  sidebarSections,
}: IconsPageShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeSlug = searchParams.get("slug") ?? undefined;
  const activeVariation = searchParams.get("variation") ?? undefined;

  // No slug means nothing to show here — send visitors to the gallery.
  useEffect(() => {
    if (!activeSlug) {
      router.replace("/icon-gallery");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (slug: string, variation?: string) => {
    const params = new URLSearchParams();
    params.set("slug", slug);
    if (variation) params.set("variation", variation);
    router.replace(`/icons?${params.toString()}`, { scroll: false });
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
          activeVariation={activeVariation}
          onSelect={handleSelect}
        />

        <SidebarInset className="min-w-0 overflow-hidden bg-transparent">
          <SidebarTrigger className="absolute top-3 left-3 z-20" />

          <IconContentPanel
            icons={icons}
            buttonCodes={buttonCodes}
            activeSlug={activeSlug}
            activeVariation={activeVariation}
            onVariationSelect={handleSelect}
          />
        </SidebarInset>
      </SidebarProvider>
      {/* </PatternSection> */}
    </div>
  );
}
