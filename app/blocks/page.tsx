import fs from 'fs';
import path from 'path';
import { Suspense } from 'react';
import type { BlockRegistry } from '@/types/block';
import { buildBlockSidebarNodes } from '@/lib/sidebar-data';
import { BlocksPageShell } from '@/components/block-gallery/BlocksPageShell';

function loadBlockData() {
  const registryPath = path.join(process.cwd(), 'public/r/blocks.json');
  const registry: BlockRegistry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  return { blocks: registry.blocks };
}

export default function BlocksPage() {
  const { blocks } = loadBlockData();
  const sidebarNodes = buildBlockSidebarNodes(blocks);

  const sidebarSections = [
    { id: 'blocks', label: 'Blocks', nodes: sidebarNodes },
  ];

  const firstSlug = blocks[0]?.slug ?? '';

  return (
    <Suspense>
      <BlocksPageShell
        blocks={blocks}
        sidebarSections={sidebarSections}
        firstSlug={firstSlug}
      />
    </Suspense>
  );
}
