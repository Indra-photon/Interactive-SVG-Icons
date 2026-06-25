"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Sidebar,
  type SidebarSectionConfig,
} from "@/components/sidebar/Sidebar";
import { BlockContentPanel } from "./BlockContentPanel";
import { PatternSection } from "@/components/PatternSection";
import type { Block } from "@/types/block";

interface BlocksPageShellProps {
  blocks: Block[];
  sidebarSections: SidebarSectionConfig[];
  firstSlug: string;
}

export function BlocksPageShell({
  blocks,
  sidebarSections,
  firstSlug,
}: BlocksPageShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawSlug = searchParams.get("slug") ?? undefined;
  const rawVariation = searchParams.get("variation") ?? undefined;

  const activeSlug = rawSlug ?? firstSlug;
  const activeVariation = rawVariation;

  useEffect(() => {
    if (!rawSlug && firstSlug) {
      const firstVariation = blocks.find((b) => b.slug === firstSlug)
        ?.variations[0]?.name;
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
    <div className="h-[calc(100vh-65px)] max-w-9xl mx-auto">
      <PatternSection
        hideTopBar={true}
        hideBottomBar={false}
        fillHeight
        className="h-full"
        contentClassName="flex h-full overflow-hidden"
      >
        <Sidebar
          sections={sidebarSections}
          activeSlug={activeSlug}
          activeVariation={activeVariation}
          onSelect={handleSelect}
        />

        <BlockContentPanel
          blocks={blocks}
          activeSlug={activeSlug}
          activeVariation={activeVariation}
          onVariationSelect={handleSelect}
        />
      </PatternSection>
    </div>
  );
}
