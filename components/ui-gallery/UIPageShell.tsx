"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Sidebar,
  type SidebarSectionConfig,
} from "@/components/sidebar/Sidebar";
import { UIContentPanel } from "./UIContentPanel";
// import { PatternSection } from "@/components/PatternSection";
import type { UIComponent } from "@/types/ui-component";

interface UIPageShellProps {
  components: UIComponent[];
  sidebarSections: SidebarSectionConfig[];
  firstSlug: string;
  firstVariation: string;
}

export function UIPageShell({
  components,
  sidebarSections,
  firstSlug,
  firstVariation,
}: UIPageShellProps) {
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
      router.replace(`/ui?${params.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (slug: string, variation?: string) => {
    const params = new URLSearchParams();
    params.set("slug", slug);
    if (variation) params.set("variation", variation);
    router.replace(`/ui?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="h-[calc(100dvh-1.5rem)] w-full">
      {/* <PatternSection
        hideTopBar={true}
        fillHeight
        className="h-full"
        contentClassName="flex h-full overflow-hidden"
      > */}
      <div className="flex h-full overflow-hidden">
        <Sidebar
          sections={sidebarSections}
          activeSlug={activeSlug}
          activeVariation={activeVariation}
          onSelect={handleSelect}
        />

        <UIContentPanel
          components={components}
          activeSlug={activeSlug}
          activeVariation={activeVariation}
        />
      </div>
      {/* </PatternSection> */}
    </div>
  );
}
