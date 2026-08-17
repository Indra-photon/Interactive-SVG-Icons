/**
 * Shared shape for the config-driven catalogs (blocks, sections,
 * illustrations, designs).
 *
 * All four are built by the same convention — a folder under components/craftui
 * holding a config.json and one component file per variation — so they carry
 * identical metadata off one builder. Blocks and sections add a matching
 * preview under examples/ and render in the sidebar gallery; illustrations and
 * designs are their own preview and render in the masonry gallery. The per-
 * catalog aliases (`types/block.ts`, `types/section.ts`, `types/illustration.ts`,
 * `types/design.ts`) exist so they can diverge later without a rename sweep.
 */

export interface CatalogInspirationLink {
  label: string;
  url: string;
  type: 'twitter' | 'pinterest' | 'dribbble' | 'website';
}

export interface CatalogPropDefinition {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface CatalogVariation {
  name: string;
  displayName: string;
  tier: 'free' | 'premium';
  description: string;
  animationType: string;
  dependencies: string[];
  registryDependencies: string[];
  props: CatalogPropDefinition[];
  features?: string[];
  inspiration?: CatalogInspirationLink[];
  componentName?: string;
  previewHint?: string;
  /**
   * When true, the preview renders the item directly at the container's real
   * width (so its own `sm:`/`md:` breakpoints reflow it) instead of the fixed
   * 1280px scale-to-fit canvas. Sections always render this way regardless —
   * see `previewMode` on the gallery.
   */
  responsive?: boolean;
  /**
   * Intrinsic size of an artwork item (illustrations, designs), used by the
   * masonry card to reserve `aspect-ratio: width / height` before the component
   * is dynamically imported — the same no-layout-shift trick ShowcaseCard uses
   * with the MP4's own tkhd ratio. Unused by blocks and sections, which are
   * previewed on a scaled or full-width canvas instead.
   */
  width?: number;
  height?: number;
}

export interface CatalogItem {
  slug: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  createdAt: string;
  variations: CatalogVariation[];
  /** Set false to hide from the gallery/sidebar without deleting the item. */
  published?: boolean;
}

export interface CatalogRegistryFile {
  name: string;
  type: string;
  tier: 'free' | 'premium';
  dependencies: string[];
  registryDependencies: string[];
  cssVars?: {
    theme?: Record<string, string>;
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  /**
   * Raw CSS shipped with the item, as shadcn's nested selector→declaration
   * object (not a string). Written into the consumer's stylesheet on install.
   */
  css?: Record<string, unknown>;
  files: {
    path: string;
    content: string;
    type: string;
    target: string;
  }[];
  meta: {
    displayName: string;
    description: string;
    category: string;
    tags: string[];
    animationType: string;
  };
}
