'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ChevronRightIcon,
  Folder01Icon,
  File01Icon,
} from '@hugeicons/core-free-icons';
import type { SidebarNode } from '@/lib/sidebar-data';

interface SidebarItemProps {
  node: SidebarNode;
  activeSlug?: string;
  activeVariation?: string;
  onSelect: (slug: string, variation?: string) => void;
}

export function SidebarItem({
  node,
  activeSlug,
  activeVariation,
  onSelect,
}: SidebarItemProps) {
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isLeaf = !hasChildren;

  const isChildActive = hasChildren &&
    node.children!.some(child => child.slug === activeSlug);

  const [isOpen, setIsOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) setIsOpen(true);
  }, [isChildActive]);

  const isActive =
    isLeaf &&
    node.slug === activeSlug &&
    node.variation === activeVariation;

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(prev => !prev);
    } else {
      onSelect(node.slug, node.variation);
    }
  };

  return (
    <li>
      <button
        onClick={handleClick}
        className={`w-full flex items-center gap-1.5 py-1 px-2 rounded-md text-sm text-left transition-colors ${
          isActive
            ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium'
            : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800/50'
        }`}
      >
        {hasChildren ? (
          <motion.span
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
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
            className="shrink-0 text-sky-500"
          />
        ) : (
          <HugeiconsIcon
            icon={File01Icon}
            size={15}
            strokeWidth={1.5}
            className="shrink-0 text-stone-400 dark:text-stone-500"
          />
        )}

        <span className="truncate">{node.label}</span>
      </button>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.ul
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="pl-5 overflow-hidden flex flex-col"
          >
            {node.children!.map(child => (
              <SidebarItem
                key={child.id}
                node={child}
                activeSlug={activeSlug}
                activeVariation={activeVariation}
                onSelect={onSelect}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}
