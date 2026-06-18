"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Sidebar,
  type SidebarSectionConfig,
} from "@/components/sidebar/Sidebar";
import { IconContentPanel } from "./IconContentPanel";
import { PatternSection } from "@/components/PatternSection";
import type { Icon } from "@/types/icon";

interface IconsPageShellProps {
  icons: Icon[];
  buttonCodes: Record<string, string>;
  sidebarSections: SidebarSectionConfig[];
  firstSlug: string;
}

export function IconsPageShell({
  icons,
  buttonCodes,
  sidebarSections,
  firstSlug,
}: IconsPageShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawSlug = searchParams.get("slug") ?? undefined;
  const rawVariation = searchParams.get("variation") ?? undefined;

  const activeSlug = rawSlug ?? firstSlug;
  const activeVariation = rawVariation;

  useEffect(() => {
    if (!rawSlug && firstSlug) {
      const firstVariation = icons.find((i) => i.slug === firstSlug)?.variations[0]?.name;
      const params = new URLSearchParams();
      params.set("slug", firstSlug);
      if (firstVariation) params.set("variation", firstVariation);
      router.replace(`/icons?${params.toString()}`, { scroll: false });
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
    <div className="h-[calc(100vh-65px)] overflow-hidden max-w-9xl mx-auto">
      <PatternSection
        hideTopBar={true}
        className="h-full"
        contentClassName="flex h-full"
      >
        <Sidebar
          sections={sidebarSections}
          activeSlug={activeSlug}
          activeVariation={activeVariation}
          onSelect={handleSelect}
        />

        <IconContentPanel
          icons={icons}
          buttonCodes={buttonCodes}
          activeSlug={activeSlug}
          activeVariation={activeVariation}
          onVariationSelect={handleSelect}
        />
      </PatternSection>
    </div>
  );
}
