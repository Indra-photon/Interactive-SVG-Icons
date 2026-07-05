"use client";

import { useRouter } from "next/navigation";
import {
  Sidebar,
  type SidebarSectionConfig,
} from "@/components/sidebar/Sidebar";
import { IconCard } from "./IconCard";
import { PatternSection } from "@/components/PatternSection";
import type { Icon } from "@/types/icon";

interface IconGalleryShellProps {
  icons: Icon[];
  sidebarSections: SidebarSectionConfig[];
}

export function IconGalleryShell({
  icons,
  sidebarSections,
}: IconGalleryShellProps) {
  const router = useRouter();

  const handleSelect = (slug: string, variation?: string) => {
    const params = new URLSearchParams();
    params.set("slug", slug);
    if (variation) params.set("variation", variation);
    router.push(`/icons?${params.toString()}`);
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
            {icons.map((icon) => (
              <IconCard key={icon.slug} icon={icon} />
            ))}
          </div>
        </div>
      </PatternSection>
    </div>
  );
}
