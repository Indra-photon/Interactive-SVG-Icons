/**
 * Per-catalog UI configuration for the shared gallery.
 *
 * Blocks and sections are rendered by the same shell, panel and preview — these
 * are the only things that differ between them. Adding another catalog means
 * adding an entry here plus a route, not another copy of the gallery.
 */
export interface CatalogUIConfig {
  /** Route the gallery lives at, used for the ?slug= query updates. */
  basePath: string;
  /** Directory under components/craftui the preview files are imported from. */
  catalogDir: string;
  /** Registry file under public/r, without the extension. */
  registryName: string;
  /** Sidebar section heading. */
  sidebarLabel: string;
  /** First crumb in the detail breadcrumb. */
  breadcrumbRoot: string;
  /**
   * 'auto'       — scale a 1280px canvas down to fit, unless the variation
   *                opts out via `responsive` or is click-driven. Right for
   *                component-scale items previewed larger than their container.
   * 'responsive' — always render at the container's real width so the item's
   *                own sm/md/xl breakpoints do the reflowing, and let its own
   *                content set the height. Right for page-width sections.
   */
  previewMode: 'auto' | 'responsive';
  /**
   * Width cap on the detail pane. Component-scale items read better in a
   * measure-limited column; page-width sections need the full pane or they
   * preview at a width nobody will ever ship them at.
   */
  detailWidthClass: string;
  /** Column count for the variations grid on the overview screen. */
  overviewGridClass: string;
  /** Shown when the catalog has no published items yet. */
  empty: {
    title: string;
    body: string;
  };
}

export const BLOCKS_CATALOG: CatalogUIConfig = {
  basePath: '/blocks',
  catalogDir: 'blocks',
  registryName: 'blocks',
  sidebarLabel: 'Blocks',
  breadcrumbRoot: 'blocks',
  previewMode: 'auto',
  detailWidthClass: 'max-w-5xl',
  overviewGridClass: 'grid-cols-1 md:grid-cols-2',
  empty: {
    title: 'No blocks yet',
    body: 'Blocks are composable UI pieces — cards, navbars, forms. Add one under components/craftui/blocks and run the registry build.',
  },
};

export const SECTIONS_CATALOG: CatalogUIConfig = {
  basePath: '/sections',
  catalogDir: 'sections',
  registryName: 'sections',
  sidebarLabel: 'Sections',
  breadcrumbRoot: 'sections',
  previewMode: 'responsive',
  // Sections are page-width by definition, so both screens give them the whole
  // pane — a section previewed in a half-width column is a section previewed at
  // a size it will never be used at.
  detailWidthClass: 'max-w-none',
  overviewGridClass: 'grid-cols-1',
  empty: {
    title: 'No sections yet',
    body: 'Sections are page-width layouts — feature, footer, pricing. Add one under components/craftui/sections and run the registry build.',
  },
};
