import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import type { DesignRegistry } from '@/types/design';
import { ArtworkGallery } from '@/components/artwork-gallery/ArtworkGallery';
import { DESIGNS_CATALOG } from '@/lib/catalog-config';
import { resolveBaseUrl } from '@/lib/registry';

export const metadata: Metadata = {
  title: 'Designs',
  description: DESIGNS_CATALOG.intro,
};

function loadDesigns() {
  const registryPath = path.join(process.cwd(), 'public/r/designs.json');
  // The file only exists once the registry build has run at least once, and an
  // empty catalog is a valid state — the gallery renders its own empty view.
  if (!fs.existsSync(registryPath)) return [];

  const registry: DesignRegistry = JSON.parse(
    fs.readFileSync(registryPath, 'utf-8'),
  );
  // Designs flagged `published: false` are hidden from the gallery
  // (files are kept — this is just a visibility flag).
  return registry.designs.filter((d) => d.published !== false);
}

export default function DesignsPage() {
  return (
    <ArtworkGallery
      items={loadDesigns()}
      catalog={DESIGNS_CATALOG}
      // Resolved here rather than in the card: on the client this would fall
      // through to window.location.origin, which is right in production and
      // wrong in every preview deploy that lacks NEXT_PUBLIC_SITE_URL.
      baseUrl={resolveBaseUrl()}
    />
  );
}
