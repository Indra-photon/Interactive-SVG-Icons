"use client";

import { useRouter } from "next/navigation";
import {
  Sidebar,
  type SidebarSectionConfig,
} from "@/components/sidebar/Sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UIExplorer } from "./UIExplorer";
import type { UIComponent } from "@/types/ui-component";

interface UIGalleryShellProps {
  components: UIComponent[];
  sidebarSections: SidebarSectionConfig[];
}

export function UIGalleryShell({
  components,
  sidebarSections,
}: UIGalleryShellProps) {
  const router = useRouter();

  const handleSelect = (slug: string, variation?: string) => {
    const component = components.find((c) => c.slug === slug);
    const resolvedVariation = variation ?? component?.variations[0]?.name;
    const params = new URLSearchParams({ slug });
    if (resolvedVariation) params.set("variation", resolvedVariation);
    router.push(`/ui?${params.toString()}`);
  };

  return (
    <div className="h-[calc(100dvh-1.5rem)] w-full">
      <SidebarProvider className="h-full min-h-0 overflow-hidden rounded-(--page-radius) bg-card">
        <Sidebar sections={sidebarSections} onSelect={handleSelect} />

        <SidebarInset className="min-w-0 overflow-hidden bg-transparent">
          <SidebarTrigger className="absolute top-3 left-3 z-20" />

          <div className="flex-1 overflow-y-auto">
            <UIExplorer />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
