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
  previewMode: "auto" | "responsive";
  /**
   * Width cap on the detail pane. Component-scale items read better in a
   * measure-limited column; page-width sections need the full pane or they
   * preview at a width nobody will ever ship them at.
   */
  detailWidthClass: string;
  /** Column count for the variations grid on the overview screen. */
  overviewGridClass: string;
  /**
   * Whether the detail screen renders the variation's `features` list under
   * "Design decisions taken here". Blocks are small enough that the rationale
   * is the interesting part; sections are read as finished page furniture, so
   * the list is noise there. `features` stays in the data either way.
   */
  showFeatures: boolean;
  /**
   * Whether the detail screen renders the sticky right rail (install, meta,
   * copy actions, related). Only worth it for catalogs whose detail column is
   * width-capped and therefore leaves the right of a wide screen empty —
   * sections already use the whole pane, and a rail there would narrow the one
   * thing that has to be page-width.
   */
  showDetailRail: boolean;
  /** Shown when the catalog has no published items yet. */
  empty: {
    title: string;
    body: string;
  };
}

export const BLOCKS_CATALOG: CatalogUIConfig = {
  basePath: "/blocks",
  catalogDir: "blocks",
  registryName: "blocks",
  sidebarLabel: "Blocks",
  breadcrumbRoot: "blocks",
  previewMode: "auto",
  detailWidthClass: "max-w-5xl",
  overviewGridClass: "grid-cols-1 md:grid-cols-2",
  showFeatures: true,
  showDetailRail: true,
  empty: {
    title: "No blocks yet",
    body: "Blocks are composable UI pieces — cards, navbars, forms. Add one under components/craftui/blocks and run the registry build.",
  },
};

export const SECTIONS_CATALOG: CatalogUIConfig = {
  basePath: "/sections",
  catalogDir: "sections",
  registryName: "sections",
  sidebarLabel: "Sections",
  breadcrumbRoot: "sections",
  previewMode: "responsive",
  // Sections are page-width by definition, so both screens give them the whole
  // pane — a section previewed in a half-width column is a section previewed at
  // a size it will never be used at.
  detailWidthClass: "max-w-none",
  overviewGridClass: "grid-cols-1",
  showFeatures: false,
  showDetailRail: false,
  empty: {
    title: "No sections yet",
    body: "Sections are page-width layouts — feature, footer, pricing. Add one under components/craftui/sections and run the registry build.",
  },
};

/**
 * Per-catalog UI configuration for the *artwork* galleries — illustrations and
 * designs.
 *
 * Deliberately not CatalogUIConfig. Two thirds of that interface (sidebarLabel,
 * breadcrumbRoot, previewMode, detailWidthClass, overviewGridClass,
 * showFeatures) describes the sidebar-and-detail gallery, and artwork has none
 * of those things: one masonry page, no sidebar, no detail route, no props
 * table. Sharing the interface would mean six permanently dead fields, which is
 * worse than a second, smaller one.
 */
export interface ArtworkCatalogConfig {
  /** Route the gallery lives at. */
  basePath: string;
  /** Directory under components/craftui the artwork is imported from. */
  catalogDir: string;
  /** Registry file under public/r, without the extension. */
  registryName: string;
  /** Page <h2>. */
  heading: string;
  /** Standfirst under the heading. */
  intro: string;
  /** Shown when the catalog has no published items yet. */
  empty: {
    title: string;
    body: string;
  };
}

export const ILLUSTRATIONS_CATALOG: ArtworkCatalogConfig = {
  basePath: "/illustrations",
  catalogDir: "illustrations",
  registryName: "illustrations",
  heading: "Illustrations that move",
  intro:
    "Self-contained SVG artwork with hand-crafted motion. Each one is a single component with no configuration to do — copy the install command under it and it lands in your project ready to render.",
  empty: {
    title: "No illustrations yet",
    body: "Illustrations are self-contained SVG artwork. Add one under components/craftui/illustrations and run the registry build.",
  },
};

export const DESIGNS_CATALOG: ArtworkCatalogConfig = {
  basePath: "/designs",
  catalogDir: "designs",
  registryName: "designs",
  heading: "Designs that hold still",
  intro:
    "Static artwork — mockups, empty states, spot illustrations. One installable .tsx, no animation and no runtime, so they render on the server and ship no JavaScript at all.",
  empty: {
    title: "No designs yet",
    body: "Designs are static artwork — one .tsx, no animation. Add one under components/craftui/designs and run the registry build.",
  },
};
