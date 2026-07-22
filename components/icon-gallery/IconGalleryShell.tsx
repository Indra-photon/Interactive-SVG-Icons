"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  type SidebarSectionConfig,
} from "@/components/sidebar/Sidebar";
import { IconCard } from "./IconCard";
import { GallerySearch } from "@/components/gallery/GallerySearch";
// import { PatternSection } from "@/components/PatternSection";
import type { Icon } from "@/types/icon";

interface IconGalleryShellProps {
  icons: Icon[];
  sidebarSections: SidebarSectionConfig[];
}

function matchesQuery(icon: Icon, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    icon.name.toLowerCase().includes(q) ||
    icon.slug.toLowerCase().includes(q) ||
    icon.category.toLowerCase().includes(q) ||
    icon.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

export function IconGalleryShell({
  icons,
  sidebarSections,
}: IconGalleryShellProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const matchedSlugs = useMemo(
    () =>
      new Set(
        icons
          .filter((icon) => matchesQuery(icon, query))
          .map((icon) => icon.slug),
      ),
    [icons, query],
  );

  const handleSelect = (slug: string, variation?: string) => {
    const params = new URLSearchParams();
    params.set("slug", slug);
    if (variation) params.set("variation", variation);
    router.push(`/icons?${params.toString()}`);
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
        <Sidebar sections={sidebarSections} onSelect={handleSelect} />

        <div className="flex-1 overflow-y-auto px-5 corner-squircle rounded-[10px] py-10 bg-foreground/5 dark:bg-backgoround/5">
          <GallerySearch
            value={query}
            onChange={setQuery}
            resultCount={matchedSlugs.size}
            placeholder="Search icons..."
            resultNoun="icon"
          />

          <div className="relative">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {icons.map((icon) => (
                <IconCard
                  key={icon.slug}
                  icon={icon}
                  isMatched={matchedSlugs.has(icon.slug)}
                />
              ))}
            </div>

            {matchedSlugs.size === 0 && (
              <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-10">
                <span className="corner-squircle rounded-[8px] bg-background px-3 py-1.5 text-sm text-muted-foreground shadow-[var(--input-shadow-hover)]">
                  No icons match &ldquo;{query}&rdquo;
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* </PatternSection> */}
    </div>
  );
}
