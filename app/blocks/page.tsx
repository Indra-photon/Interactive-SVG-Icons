import fs from 'fs';
import path from 'path';
import { Suspense } from 'react';
import type { BlockRegistry } from '@/types/block';
import { buildBlockSidebarNodes } from '@/lib/sidebar-data';
import { BlocksPageShell } from '@/components/block-gallery/BlocksPageShell';
import { BLOCKS_CATALOG } from '@/lib/catalog-config';
import { loadDesignDocs } from '@/lib/design-docs';

function loadBlockData() {
  const registryPath = path.join(process.cwd(), 'public/r/blocks.json');
  const registry: BlockRegistry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  // Blocks flagged `published: false` are hidden from the gallery/sidebar
  // (files are kept — this is just a visibility flag).
  return { blocks: registry.blocks.filter((b) => b.published !== false) };
}

export default function BlocksPage() {
  const { blocks } = loadBlockData();
  const sidebarNodes = buildBlockSidebarNodes(blocks);

  const sidebarSections = [
    { id: 'blocks', label: 'Blocks', nodes: sidebarNodes },
  ];

  const firstSlug = blocks[0]?.slug ?? '';
  const firstVariation = blocks[0]?.variations[0]?.name ?? '';
  const designDocs = loadDesignDocs(
    BLOCKS_CATALOG.catalogDir,
    blocks.map((b) => b.slug),
  );

  return (
    <Suspense>
      <BlocksPageShell
        blocks={blocks}
        sidebarSections={sidebarSections}
        firstSlug={firstSlug}
        firstVariation={firstVariation}
        designDocs={designDocs}
      />
    </Suspense>
  );
}
