import { BLOCKS_CATALOG, SECTIONS_CATALOG } from "@/lib/catalog-config";

/**
 * Singular catalog labels for the showcase card badges, keyed by the route the
 * card links to.
 *
 * Blocks and sections read their key off CatalogUIConfig so renaming a basePath
 * moves the label with it. The other three have no config object yet, so they
 * are spelled out — add them to catalog-config if they ever grow one.
 */
const CATALOG_LABELS: Record<string, string> = {
  [BLOCKS_CATALOG.basePath]: "Block",
  [SECTIONS_CATALOG.basePath]: "Section",
  "/ui": "UI",
  "/loaders": "Loader",
  "/icons": "Icon",
};

/**
 * Which catalog a showcase card points at, derived from its href rather than
 * stored beside it.
 *
 * The href already encodes the answer, so a second `kind` field on
 * ShowcaseItem could only ever agree with it or be wrong. Deriving also means
 * `npm run build:showcase` needs no changes to keep badges working.
 *
 * Returns null for an unlinked card or a route with no label, so the caller
 * renders no badge rather than an empty one.
 */
export function showcaseKind(href?: string): string | null {
  if (!href) return null;
  // Take the first path segment only — hrefs carry ?slug=&variation= behind it.
  const segment = href.replace(/^\//, "").split(/[/?#]/)[0];
  return CATALOG_LABELS[`/${segment}`] ?? null;
}
