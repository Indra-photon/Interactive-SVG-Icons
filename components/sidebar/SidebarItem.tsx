"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChevronRightIcon,
  Folder01Icon,
  File01Icon,
} from "@hugeicons/core-free-icons";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { SidebarNode } from "@/lib/sidebar-data";

interface SidebarItemProps {
  node: SidebarNode;
  activeSlug?: string;
  activeVariation?: string;
  onSelect: (slug: string, variation?: string) => void;
  selectableGroups?: boolean;
}

export function SidebarItem({
  node,
  activeSlug,
  activeVariation,
  onSelect,
  selectableGroups,
}: SidebarItemProps) {
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isLeaf = !hasChildren;

  const isChildActive =
    hasChildren && node.children!.some((child) => child.slug === activeSlug);

  const [isOpen, setIsOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) setIsOpen(true);
  }, [isChildActive]);

  const isGroupSelectable = Boolean(selectableGroups && node.isGroup);

  const isActive =
    (isLeaf &&
      node.slug === activeSlug &&
      node.variation === activeVariation) ||
    (isGroupSelectable && node.slug === activeSlug && !activeVariation);

  const handleClick = () => {
    if (hasChildren) {
      if (isGroupSelectable) {
        // First click selects the group (and expands it); clicking the
        // already-active group toggles expand like a normal folder.
        setIsOpen((prev) => (node.slug === activeSlug ? !prev : true));
        onSelect(node.slug);
      } else {
        setIsOpen((prev) => !prev);
      }
    } else {
      onSelect(node.slug, node.variation);
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        size="sm"
        isActive={isActive}
        onClick={handleClick}
        aria-expanded={hasChildren ? isOpen : undefined}
        className={
          hasChildren
            ? "tracking-tighter text-sidebar-foreground" // main category
            : "tracking-tight text-xs text-sidebar-foreground/90" // children
        }
      >
        {hasChildren ? (
          <motion.span
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="flex shrink-0"
          >
            <HugeiconsIcon icon={ChevronRightIcon} size={12} strokeWidth={2} />
          </motion.span>
        ) : (
          <span className="w-[12px] shrink-0" />
        )}

        {hasChildren ? (
          <HugeiconsIcon
            icon={Folder01Icon}
            size={15}
            strokeWidth={1.5}
            className="shrink-0 text-sidebar-icon-accent"
          />
        ) : (
          <HugeiconsIcon
            icon={File01Icon}
            size={15}
            strokeWidth={1.5}
            className="shrink-0 text-sidebar-icon-muted"
          />
        )}

        <span>{node.label}</span>
      </SidebarMenuButton>

      <AnimatePresence>
        {isOpen && hasChildren && (
          // Kept as a motion.ul (rather than SidebarMenuSub) so the height
          // spring survives — the sub styling is applied by hand instead.
          <motion.ul
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="mx-3.5 flex min-w-0 translate-x-px flex-col overflow-hidden border-l border-sidebar-border px-2.5 group-data-[collapsible=icon]:hidden"
          >
            {node.children!.map((child) => (
              <SidebarItem
                key={child.id}
                node={child}
                activeSlug={activeSlug}
                activeVariation={activeVariation}
                onSelect={onSelect}
                selectableGroups={selectableGroups}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </SidebarMenuItem>
  );
}
