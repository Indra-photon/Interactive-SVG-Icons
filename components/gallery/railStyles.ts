/**
 * The right rail borrows the left sidebar's visual language rather than
 * inventing its own. These three strings are the seam: each one restates a
 * class list that lives in `components/ui/sidebar.tsx` (or its call sites in
 * `components/sidebar/`), because the rail is a plain <aside> — deliberately
 * not a second `SidebarRoot side="right"`, which would drag in the provider,
 * the collapse state and a mobile sheet the rail has no use for.
 *
 * If a sidebar token or size changes over there, change it here too. That is
 * the whole cost of keeping the rail out of the provider.
 */

/** Mirrors the floating `sidebar-inner` surface — ui/sidebar.tsx:249. */
export const RAIL_SURFACE =
  "no-scrollbar flex size-full min-h-0 flex-col gap-2 overflow-y-auto corner-squircle rounded-[10px] bg-sidebar py-3 text-sidebar-foreground ring-1 ring-sidebar-border";

/** Mirrors `SidebarGroup` — ui/sidebar.tsx:391. */
export const RAIL_GROUP = "relative flex w-full min-w-0 flex-col p-2";

/**
 * Mirrors `SidebarGroupLabel` (ui/sidebar.tsx:409) plus the type the gallery
 * sidebar puts on it at Sidebar.tsx:78. Sans, not the mono `crumb` variant the
 * rail used to reach for — the left column has no mono anywhere.
 *
 * `[&>svg]:size-4` is carried over from the sidebar for parity, but the rail
 * doesn't lean on it: its labels take a `RailIcon`, which does the sizing
 * itself. See RAIL_ICON_SIZE below.
 */
export const RAIL_GROUP_LABEL =
  "flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 text-[11px] font-semibold tracking-widest uppercase text-sidebar-foreground/70 [&>svg]:size-4 [&>svg]:shrink-0";

/**
 * Mirrors `sidebarMenuButtonVariants({ size: "sm" })` (ui/sidebar.tsx:474) plus
 * the leaf-row type from SidebarItem.tsx:74. `min-h-7` rather than `h-7`: a
 * related row can carry a 32px thumbnail, which a fixed height would clip.
 *
 * No `[&_svg]` rule here, unlike the sidebar button it mirrors: a related row
 * can contain a live `RailMiniPreview`, and a descendant selector would clamp
 * that component's own SVG to 16px inside its 24px well. The rail sizes its
 * icons at the call site instead, via RAIL_ICON_SIZE/RAIL_ICON_STROKE below.
 */
export const RAIL_ROW =
  "flex min-h-7 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-xs tracking-tight text-sidebar-foreground/90 ring-sidebar-ring outline-hidden transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>span:last-child]:truncate";

/**
 * Every icon in the rail — group labels, row icons and the related chevron
 * alike — is drawn at exactly this size and stroke. Hugeicons glyphs come from
 * families with different natural weights, so a column mixing 13px/1.5 labels
 * with 15px/1.5 rows and a 12px/2 chevron read as four different icon sets
 * stacked on each other. The left sidebar reaches the same uniformity by
 * accident: its `[&_svg]:size-4` rule overrides whatever `size` its call sites
 * pass, so 13 and 15 both land on 16.
 */
export const RAIL_ICON_SIZE = 16;
export const RAIL_ICON_STROKE = 1.5;
