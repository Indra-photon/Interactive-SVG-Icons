import fs from 'fs';
import path from 'path';
import type { IconRegistry } from '@/types/icon';
import { buildIconSidebarNodes } from '@/lib/sidebar-data';
import { IconGalleryShell } from '@/components/icon-gallery/IconGalleryShell';

function loadIconData() {
  const registryPath = path.join(process.cwd(), 'public/r/icons.json');
  const registry: IconRegistry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  return registry.icons;
}

export default function IconGalleryPage() {
  const icons = loadIconData();
  const sidebarNodes = buildIconSidebarNodes(icons);

  const sidebarSections = [
    {
      id: 'icons',
      label: 'Icons',
      nodes: sidebarNodes,
      topLink: { label: 'Gallery', href: '/icon-gallery' },
    },
  ];

  return <IconGalleryShell icons={icons} sidebarSections={sidebarSections} />;
}
