"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export interface SidebarTopLink {
  label: string;
  href: string;
  icon?: IconSvgElement;
}

export interface SidebarSectionConfig {
  id: SectionId | string;
  label: string;
  nodes: SidebarNode[];
  topLink?: SidebarTopLink;
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
  const pathname = usePathname();

  return (
    <aside className="w-[290px] shrink-0 h-full overflow-y-auto py-5 px-3 flex flex-col gap-6 shadow-[1px_0_0_rgba(0,0,0,0.06),4px_0_12px_rgba(0,0,0,0.03)] dark:shadow-[1px_0_0_rgba(255,255,255,0.06)]">
      {sections.map((section) => {
        const SectionIcon = SECTION_ICON[section.id] ?? Image01Icon;
        const TopLinkIcon = section.topLink?.icon ?? LayoutGridIcon;
        const isTopLinkActive = section.topLink
          ? pathname === section.topLink.href
          : false;

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

            {section.topLink && (
              <Link
                href={section.topLink.href}
                className={`w-full flex items-center gap-1.5 py-1 px-2 mb-1 rounded-md text-sm text-left transition-colors ${
                  isTopLinkActive
                    ? "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                    : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800/50"
                }`}
              >
                <span className="w-[12px] shrink-0" />
                <HugeiconsIcon
                  icon={TopLinkIcon}
                  size={15}
                  strokeWidth={1.5}
                  className="shrink-0 text-sky-500"
                />
                <span className="truncate">{section.topLink.label}</span>
              </Link>
            )}

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
