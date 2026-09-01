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
import { FullscreenPreview } from "./FullscreenPreview";
// import { PatternSection } from "@/components/PatternSection";
import type { Block } from "@/types/block";
import { BLOCKS_CATALOG, type CatalogUIConfig } from "@/lib/catalog-config";

interface BlocksPageShellProps {
  blocks: Block[];
  sidebarSections: SidebarSectionConfig[];
  firstSlug: string;
  firstVariation: string;
  /** Which catalog is being rendered. Defaults to blocks. */
  catalog?: CatalogUIConfig;
  /** Raw `design.md` per item slug, for items that ship one. */
  designDocs?: Record<string, string>;
}

export function BlocksPageShell({
  blocks,
  sidebarSections,
  firstSlug,
  firstVariation,
  catalog = BLOCKS_CATALOG,
  designDocs,
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
      router.replace(`${catalog.basePath}?${params.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (slug: string, variation?: string) => {
    const params = new URLSearchParams();
    params.set("slug", slug);
    if (variation) params.set("variation", variation);
    router.replace(`${catalog.basePath}?${params.toString()}`, { scroll: false });
  };

  /* Full-screen view is a query param on this same route rather than a route of
   * its own: the URL stays deep-linkable, back and forward work without extra
   * wiring, and `/sections/[slug]` keeps its dynamic segment — a static
   * `/sections/preview` would shadow any item whose slug happened to be
   * "preview". */
  const isFullscreen = searchParams.get("view") === "full";

  if (isFullscreen && activeSlug) {
    const params = new URLSearchParams();
    params.set("slug", activeSlug);
    if (activeVariation) params.set("variation", activeVariation);

    return (
      <FullscreenPreview
        blockSlug={activeSlug}
        variationName={activeVariation}
        catalogDir={catalog.catalogDir}
        exitHref={`${catalog.basePath}?${params.toString()}`}
      />
    );
  }

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
            catalog={catalog}
            designDocs={designDocs}
          />
        </SidebarInset>
      </SidebarProvider>
      {/* </PatternSection> */}
    </div>
  );
}
