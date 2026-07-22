"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  type SidebarSectionConfig,
} from "@/components/sidebar/Sidebar";
import { LoaderCard } from "./LoaderCard";
import { GallerySearch } from "@/components/gallery/GallerySearch";
// import { PatternSection } from "@/components/PatternSection";
import type { Loader } from "@/types/loader";

interface LoaderGalleryShellProps {
  loaders: Loader[];
  sidebarSections: SidebarSectionConfig[];
}

function matchesQuery(loader: Loader, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    loader.name.toLowerCase().includes(q) ||
    loader.slug.toLowerCase().includes(q) ||
    loader.category.toLowerCase().includes(q) ||
    loader.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

export function LoaderGalleryShell({
  loaders,
  sidebarSections,
}: LoaderGalleryShellProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const matchedSlugs = useMemo(
    () =>
      new Set(
        loaders
          .filter((loader) => matchesQuery(loader, query))
          .map((loader) => loader.slug),
      ),
    [loaders, query],
  );

  const handleSelect = (slug: string) => {
    router.push(`/loaders?slug=${slug}`);
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

        <div className="flex-1 overflow-y-auto px-5 rounded-[10px] py-10 bg-foreground/5 dark:bg-backgoround/5">
          <GallerySearch
            value={query}
            onChange={setQuery}
            resultCount={matchedSlugs.size}
            placeholder="Search loaders..."
            resultNoun="loader"
          />

          <div className="relative">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {loaders.map((loader) => (
                <LoaderCard
                  key={loader.slug}
                  loader={loader}
                  isMatched={matchedSlugs.has(loader.slug)}
                />
              ))}
            </div>

            {matchedSlugs.size === 0 && (
              <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-10">
                <span className="corner-squircle rounded-[8px] bg-background px-3 py-1.5 text-sm text-muted-foreground shadow-[var(--input-shadow-hover)]">
                  No loaders match &ldquo;{query}&rdquo;
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
