"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Sidebar,
  type SidebarSectionConfig,
} from "@/components/sidebar/Sidebar";
import { LoaderContentPanel } from "./LoaderContentPanel";
import { PatternSection } from "@/components/PatternSection";
import type { Loader } from "@/types/loader";

interface LoadersPageShellProps {
  loaders: Loader[];
  sidebarSections: SidebarSectionConfig[];
  firstSlug: string;
}

export function LoadersPageShell({
  loaders,
  sidebarSections,
  firstSlug,
}: LoadersPageShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawSlug = searchParams.get("slug") ?? undefined;
  const activeSlug = rawSlug ?? firstSlug;

  useEffect(() => {
    if (!rawSlug && firstSlug) {
      router.replace(`/loaders?slug=${firstSlug}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (slug: string) => {
    router.replace(`/loaders?slug=${slug}`, { scroll: false });
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
          onSelect={handleSelect}
        />

        <LoaderContentPanel loaders={loaders} activeSlug={activeSlug} />
      </PatternSection>
    </div>
  );
}
