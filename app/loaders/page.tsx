import fs from 'fs';
import path from 'path';
import { Suspense } from 'react';
import type { LoaderRegistry } from '@/types/loader';
import { buildLoaderSidebarNodes } from '@/lib/sidebar-data';
import { LoadersPageShell } from '@/components/loader-gallery/LoadersPageShell';

function loadLoaderData() {
  const registryPath = path.join(process.cwd(), 'public/r/loaders.json');
  const registry: LoaderRegistry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  return registry.loaders;
}

export default function LoadersPage() {
  const loaders = loadLoaderData();
  const sidebarNodes = buildLoaderSidebarNodes(loaders);

  const sidebarSections = [
    { id: 'loaders', label: 'Loaders', nodes: sidebarNodes },
  ];

  const firstSlug = loaders[0]?.slug ?? '';

  return (
    <Suspense>
      <LoadersPageShell
        loaders={loaders}
        sidebarSections={sidebarSections}
        firstSlug={firstSlug}
      />
    </Suspense>
  );
}
