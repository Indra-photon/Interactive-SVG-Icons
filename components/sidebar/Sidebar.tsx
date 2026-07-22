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
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
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
  // When true, clicking a group node selects it (group overview page)
  // in addition to toggling expand.
  selectableGroups?: boolean;
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
    <SidebarRoot collapsible="offcanvas" variant="floating">
      <SidebarContent className="py-3">
        {sections.map((section) => {
          const SectionIcon = SECTION_ICON[section.id] ?? Image01Icon;
          const TopLinkIcon = section.topLink?.icon ?? LayoutGridIcon;
          const isTopLinkActive = section.topLink
            ? pathname === section.topLink.href
            : false;

          return (
            <SidebarGroup key={section.id}>
              <SidebarGroupLabel className="gap-1.5 text-[11px] font-semibold tracking-widest uppercase">
                <HugeiconsIcon
                  icon={SectionIcon}
                  size={13}
                  strokeWidth={1.5}
                  className="shrink-0 text-sidebar-icon-muted"
                />
                {section.label}
              </SidebarGroupLabel>

              <SidebarMenu>
                {section.topLink && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      size="sm"
                      isActive={isTopLinkActive}
                    >
                      <Link href={section.topLink.href}>
                        <span className="w-[12px] shrink-0" />
                        <HugeiconsIcon
                          icon={TopLinkIcon}
                          size={15}
                          strokeWidth={1.5}
                          className="shrink-0 text-sidebar-icon-accent"
                        />
                        <span>{section.topLink.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}

                {section.nodes.map((node) => (
                  <SidebarItem
                    key={node.id}
                    node={node}
                    activeSlug={activeSlug}
                    activeVariation={activeVariation}
                    onSelect={onSelect}
                    selectableGroups={section.selectableGroups}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarRail />
    </SidebarRoot>
  );
}
