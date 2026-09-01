import fs from 'fs';
import path from 'path';
import { Suspense } from 'react';
import type { SectionRegistry } from '@/types/section';
import { buildBlockSidebarNodes } from '@/lib/sidebar-data';
import { BlocksPageShell } from '@/components/block-gallery/BlocksPageShell';
import { SECTIONS_CATALOG } from '@/lib/catalog-config';
import { loadDesignDocs } from '@/lib/design-docs';

function loadSectionData() {
  const registryPath = path.join(process.cwd(), 'public/r/sections.json');
  // The file only exists once the registry build has run at least once, and an
  // empty catalog is a valid state — the gallery renders its own empty view.
  if (!fs.existsSync(registryPath)) return { sections: [] };

  const registry: SectionRegistry = JSON.parse(
    fs.readFileSync(registryPath, 'utf-8'),
  );
  // Sections flagged `published: false` are hidden from the gallery/sidebar
  // (files are kept — this is just a visibility flag).
  return { sections: registry.sections.filter((s) => s.published !== false) };
}

export default function SectionsPage() {
  const { sections } = loadSectionData();
  const sidebarNodes = buildBlockSidebarNodes(sections);

  const sidebarSections = [
    { id: 'sections', label: SECTIONS_CATALOG.sidebarLabel, nodes: sidebarNodes },
  ];

  const firstSlug = sections[0]?.slug ?? '';
  const firstVariation = sections[0]?.variations[0]?.name ?? '';
  const designDocs = loadDesignDocs(
    SECTIONS_CATALOG.catalogDir,
    sections.map((s) => s.slug),
  );

  return (
    <Suspense>
      <BlocksPageShell
        blocks={sections}
        sidebarSections={sidebarSections}
        firstSlug={firstSlug}
        firstVariation={firstVariation}
        catalog={SECTIONS_CATALOG}
        designDocs={designDocs}
      />
    </Suspense>
  );
}
