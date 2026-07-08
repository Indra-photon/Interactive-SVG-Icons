import type { Icon } from '@/types/icon';
import type { Loader } from '@/types/loader';
import type { Block } from '@/types/block';
import type { UIComponent } from '@/types/ui-component';

export type SidebarNode = {
  id: string;
  label: string;
  slug: string;
  variation?: string;
  isGroup?: boolean; // grouping node — clicking toggles expand; also selects (overview page) when the section sets selectableGroups
  children?: SidebarNode[];
};

export type SectionId = 'icons' | 'loaders' | 'blocks' | 'ui';

export function buildIconSidebarNodes(icons: Icon[]): SidebarNode[] {
  return icons.map(icon => ({
    id: icon.slug,
    label: icon.name.replace(/ Icon$/i, ''),
    slug: icon.slug,
    isGroup: true,
    children: icon.variations.map(v => ({
      id: `${icon.slug}--${v.name}`,
      label: v.displayName,
      slug: icon.slug,
      variation: v.name,
    })),
  }));
}

// ── Loader grouping ───────────────────────────────────────────────────────────
// Each entry matches loaders by slug. Unmatched loaders fall into "Other".

const LOADER_GROUPS: { id: string; label: string; match: (slug: string) => boolean }[] = [
  { id: 'grid',       label: 'Grid',        match: s => s.startsWith('grid-') },
  { id: 'bars',       label: 'Bars',        match: s => s.startsWith('bars-') },
  { id: 'ios',        label: 'iOS Spinner', match: s => s.startsWith('ios-') },
  { id: 'dot-matrix', label: 'Dot Matrix',  match: s => s.startsWith('dot-matrix') },
  { id: 'audio',      label: 'Audio',       match: s => s.startsWith('audio-') },
  { id: 'ball',       label: 'Ball Bounce', match: s => s.startsWith('ball-bounce') },
  { id: 'fill',       label: 'Liquid Fill', match: s => s.startsWith('fill-') },
  { id: 'spinner',    label: 'Spinner',     match: s => ['circle-spinner-wipe', 'circular-wave-fill', 'conic-spinner', 'spinner-orbit-dots'].includes(s) },
  { id: 'dots',       label: 'Dots',        match: s => s.startsWith('dots-') },
  { id: 'square',     label: 'Square',      match: s => s.startsWith('square-') },
];

export const LOADER_GROUP_SLUG_PREFIX = 'group--';

// Resolves a sidebar group slug ("group--fill") to its label and member
// loaders. Returns null for regular loader slugs.
export function resolveLoaderGroup(
  slug: string,
  loaders: Loader[]
): { id: string; label: string; loaders: Loader[] } | null {
  if (!slug.startsWith(LOADER_GROUP_SLUG_PREFIX)) return null;
  const id = slug.slice(LOADER_GROUP_SLUG_PREFIX.length);
  const group = LOADER_GROUPS.find(g => g.id === id);
  if (!group) return null;
  return { id, label: group.label, loaders: loaders.filter(l => group.match(l.slug)) };
}

export function buildLoaderSidebarNodes(loaders: Loader[]): SidebarNode[] {
  const buckets = new Map<string, Loader[]>(LOADER_GROUPS.map(g => [g.id, []]));
  const other: Loader[] = [];

  for (const loader of loaders) {
    const group = LOADER_GROUPS.find(g => g.match(loader.slug));
    if (group) {
      buckets.get(group.id)!.push(loader);
    } else {
      other.push(loader);
    }
  }

  const nodes: SidebarNode[] = [];

  for (const group of LOADER_GROUPS) {
    const members = buckets.get(group.id)!;
    if (members.length === 0) continue;

    nodes.push({
      id: `group--${group.id}`,
      label: group.label,
      slug: `group--${group.id}`,
      isGroup: true,
      children: members.map(l => ({ id: l.slug, label: l.name, slug: l.slug })),
    });
  }

  // Singles that didn't match any group
  for (const loader of other) {
    nodes.push({ id: loader.slug, label: loader.name, slug: loader.slug });
  }

  return nodes;
}

export function buildBlockSidebarNodes(blocks: Block[]): SidebarNode[] {
  const categoryMap = new Map<string, Block[]>();
  for (const block of blocks) {
    const cat = block.category;
    if (!categoryMap.has(cat)) categoryMap.set(cat, []);
    categoryMap.get(cat)!.push(block);
  }

  // For a block with one variation: variation displayName is the folder,
  // block name is the leaf child.
  // For a block with multiple variations: block name is the folder,
  // variation displayNames are the leaves (the usual icon pattern).
  function blockToNode(block: Block): SidebarNode {
    if (block.variations.length === 1) {
      const v = block.variations[0];
      return {
        id: block.slug,
        label: v.displayName,
        slug: block.slug,
        children: [
          {
            id: `${block.slug}--${v.name}`,
            label: block.name,
            slug: block.slug,
            variation: v.name,
          },
        ],
      };
    }
    return {
      id: block.slug,
      label: block.name,
      slug: block.slug,
      children: block.variations.map((v) => ({
        id: `${block.slug}--${v.name}`,
        label: v.displayName,
        slug: block.slug,
        variation: v.name,
      })),
    };
  }

  const nodes: SidebarNode[] = [];
  for (const [category, members] of categoryMap) {
    if (members.length === 1) {
      nodes.push(blockToNode(members[0]));
    } else {
      // Multiple blocks in the same category — wrap in a group
      nodes.push({
        id: `group--${category}`,
        label: category.charAt(0).toUpperCase() + category.slice(1),
        slug: `group--${category}`,
        isGroup: true,
        children: members.map((block) => {
          if (block.variations.length === 1) {
            const v = block.variations[0];
            return {
              id: `${block.slug}--${v.name}`,
              label: block.name,
              slug: block.slug,
              variation: v.name,
            };
          }
          return blockToNode(block);
        }),
      });
    }
  }

  return nodes;
}

// ── UI Components grouping ────────────────────────────────────────────────────

export function buildUISidebarNodes(components: UIComponent[]): SidebarNode[] {
  const categoryMap = new Map<string, UIComponent[]>();
  for (const component of components) {
    const cat = component.category;
    if (!categoryMap.has(cat)) categoryMap.set(cat, []);
    categoryMap.get(cat)!.push(component);
  }

  // A component with a single variation collapses to one leaf labelled with
  // the component name (Input → OTP Input, no variation level).
  function componentToNode(component: UIComponent): SidebarNode {
    if (component.variations.length === 1) {
      const v = component.variations[0];
      return {
        id: component.slug,
        label: component.name,
        slug: component.slug,
        variation: v.name,
      };
    }
    return {
      id: component.slug,
      label: component.name,
      slug: component.slug,
      children: component.variations.map((v) => ({
        id: `${component.slug}--${v.name}`,
        label: v.displayName,
        slug: component.slug,
        variation: v.name,
      })),
    };
  }

  const nodes: SidebarNode[] = [];
  for (const [category, members] of categoryMap) {
    if (members.length === 1) {
      const node = componentToNode(members[0]);
      if (node.children) {
        // Multi-variation single component (e.g. Accordion) — the component
        // itself is the top-level folder, no category wrapper.
        nodes.push(node);
      } else {
        // Single-variation single component — wrap the leaf in its category
        // folder so it still reads Input → OTP Input.
        nodes.push({
          id: `group--${category}`,
          label: category.charAt(0).toUpperCase() + category.slice(1),
          slug: `group--${category}`,
          isGroup: true,
          children: [node],
        });
      }
    } else {
      nodes.push({
        id: `group--${category}`,
        label: category.charAt(0).toUpperCase() + category.slice(1),
        slug: `group--${category}`,
        isGroup: true,
        children: members.map(componentToNode),
      });
    }
  }

  return nodes;
}
