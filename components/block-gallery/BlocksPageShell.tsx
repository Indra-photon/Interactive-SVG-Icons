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
import { BlockContentPanel } from "./BlockContentPanel";
// import { PatternSection } from "@/components/PatternSection";
import type { Block } from "@/types/block";

interface BlocksPageShellProps {
  blocks: Block[];
  sidebarSections: SidebarSectionConfig[];
  firstSlug: string;
  firstVariation: string;
}

export function BlocksPageShell({
  blocks,
  sidebarSections,
  firstSlug,
  firstVariation,
}: BlocksPageShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawSlug = searchParams.get("slug") ?? undefined;
  const rawVariation = searchParams.get("variation") ?? undefined;

  const activeSlug = rawSlug ?? firstSlug;
  const activeVariation = rawVariation ?? firstVariation;

  useEffect(() => {
    if (!rawSlug && firstSlug) {
      const params = new URLSearchParams();
      params.set("slug", firstSlug);
      if (firstVariation) params.set("variation", firstVariation);
      router.replace(`/blocks?${params.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (slug: string, variation?: string) => {
    const params = new URLSearchParams();
    params.set("slug", slug);
    if (variation) params.set("variation", variation);
    router.replace(`/blocks?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="h-[calc(100dvh-1.5rem)] w-full">
      {/* <PatternSection
        hideTopBar={true}
        hideBottomBar={false}
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

          <BlockContentPanel
            blocks={blocks}
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
