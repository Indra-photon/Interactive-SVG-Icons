"use client";

import { useRouter } from "next/navigation";
import {
  Sidebar,
  type SidebarSectionConfig,
} from "@/components/sidebar/Sidebar";
import { LoaderCard } from "./LoaderCard";
import { PatternSection } from "@/components/PatternSection";
import type { Loader } from "@/types/loader";

interface LoaderGalleryShellProps {
  loaders: Loader[];
  sidebarSections: SidebarSectionConfig[];
}

export function LoaderGalleryShell({
  loaders,
  sidebarSections,
}: LoaderGalleryShellProps) {
  const router = useRouter();

  const handleSelect = (slug: string) => {
    router.push(`/loaders?slug=${slug}`);
  };

  return (
    <div className="h-[calc(100vh-65px)] max-w-9xl mx-auto">
      <PatternSection
        hideTopBar={true}
        fillHeight
        className="h-full"
        contentClassName="flex h-full overflow-hidden"
      >
        <Sidebar sections={sidebarSections} onSelect={handleSelect} />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {loaders.map((loader) => (
              <LoaderCard key={loader.slug} loader={loader} />
            ))}
          </div>
        </div>
      </PatternSection>
    </div>
  );
}
