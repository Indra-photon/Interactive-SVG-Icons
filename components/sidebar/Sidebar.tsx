"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Image01Icon,
  Loading03Icon,
  GridViewIcon,
  LayoutGridIcon,
} from "@hugeicons/core-free-icons";
import { SidebarItem } from "./SidebarItem";
import type { SidebarNode, SectionId } from "@/lib/sidebar-data";

// Add a new entry here when wiring up a new section.
const SECTION_ICON: Record<string, IconSvgElement> = {
  icons: Image01Icon,
  loaders: Loading03Icon,
  blocks: GridViewIcon,
  ui: LayoutGridIcon,
};

export interface SidebarSectionConfig {
  id: SectionId | string;
  label: string;
  nodes: SidebarNode[];
}

interface SidebarProps {
  sections: SidebarSectionConfig[];
  activeSlug?: string;
  activeVariation?: string;
  onSelect: (slug: string, variation?: string) => void;
}

export function Sidebar({
  sections,
  activeSlug,
  activeVariation,
  onSelect,
}: SidebarProps) {
  return (
    <aside className="w-[290px] shrink-0 h-full overflow-y-auto py-5 px-3 flex flex-col gap-6 shadow-[1px_0_0_rgba(0,0,0,0.06),4px_0_12px_rgba(0,0,0,0.03)] dark:shadow-[1px_0_0_rgba(255,255,255,0.06)]">
      {sections.map((section) => {
        const SectionIcon = SECTION_ICON[section.id] ?? Image01Icon;
        return (
          <div key={section.id}>
            <div className="flex items-center gap-1.5 px-2 mb-1.5">
              <HugeiconsIcon
                icon={SectionIcon}
                size={13}
                strokeWidth={1.5}
                className="text-stone-400 shrink-0"
              />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                {section.label}
              </span>
            </div>

            <ul className="flex flex-col">
              {section.nodes.map((node) => (
                <SidebarItem
                  key={node.id}
                  node={node}
                  activeSlug={activeSlug}
                  activeVariation={activeVariation}
                  onSelect={onSelect}
                />
              ))}
            </ul>
          </div>
        );
      })}
    </aside>
  );
}
