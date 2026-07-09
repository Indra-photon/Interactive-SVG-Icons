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
