import fs from 'fs';
import path from 'path';
import type { LoaderRegistry } from '@/types/loader';
import { buildLoaderSidebarNodes } from '@/lib/sidebar-data';
import { LoaderGalleryShell } from '@/components/loader-gallery/LoaderGalleryShell';

function loadLoaderData() {
  const registryPath = path.join(process.cwd(), 'public/r/loaders.json');
  const registry: LoaderRegistry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  return registry.loaders;
}

export default function LoaderGalleryPage() {
  const loaders = loadLoaderData();
  const sidebarNodes = buildLoaderSidebarNodes(loaders);

  const sidebarSections = [
    {
      id: 'loaders',
      label: 'Loaders',
      nodes: sidebarNodes,
      topLink: { label: 'Gallery', href: '/loader-gallery' },
      selectableGroups: true,
    },
  ];

  return (
    <LoaderGalleryShell loaders={loaders} sidebarSections={sidebarSections} />
  );
}
