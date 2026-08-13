/**
 * Every shadcn install command shown on the site is built here.
 *
 * Seven pages used to build this string themselves, which meant the namespace
 * migration, the free/pro split and the paid-access check would each have to
 * touch seven files. They all go through installCommand() instead.
 */

/**
 * Registry item names are flat and globally unique across icons, loaders,
 * blocks, sections and UI components — enforced by assertNoDuplicateNames()
 * in scripts/build-registry.ts.
 */
export function registryItemName(slug: string, variation: string): string {
  return `${slug}-${variation}`;
}

/**
 * Env var first so previews and prod agree. window.location.origin keeps
 * deploys without NEXT_PUBLIC_SITE_URL from advertising localhost URLs.
 */
export function resolveBaseUrl(override?: string): string {
  if (override) return override;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:3000";
}

export function registryUrl(name: string, baseUrl?: string): string {
  return `${resolveBaseUrl(baseUrl)}/r/${name}.json`;
}

export function installCommand(name: string, baseUrl?: string): string {
  return `npx shadcn@latest add ${registryUrl(name, baseUrl)}`;
}
