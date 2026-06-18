import type { Icon } from '@/types/icon';
import type { Loader } from '@/types/loader';

export type SidebarNode = {
  id: string;
  label: string;
  slug: string;
  variation?: string;
  isGroup?: boolean; // pure grouping node — clicking only toggles expand, never selects content
  children?: SidebarNode[];
};

export type SectionId = 'icons' | 'loaders' | 'blocks';

export function buildIconSidebarNodes(icons: Icon[]): SidebarNode[] {
  return icons.map(icon => ({
    id: icon.slug,
    label: icon.name.replace(/ Icon$/i, ''),
    slug: icon.slug,
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
  { id: 'spinner',    label: 'Spinner',     match: s => ['circle-spinner-wipe', 'circular-wave-fill', 'conic-spinner', 'spinner-orbit-dots'].includes(s) },
  { id: 'dots',       label: 'Dots',        match: s => s.startsWith('dots-') },
  { id: 'square',     label: 'Square',      match: s => s.startsWith('square-') },
];

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

// When blocks are wired up, add:
// export function buildBlockSidebarNodes(blocks: Block[]): SidebarNode[] { ... }
