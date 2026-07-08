import fs from 'fs';
import path from 'path';
import { Suspense } from 'react';
import type { IconRegistry } from '@/types/icon';
import { buildIconSidebarNodes } from '@/lib/sidebar-data';
import { IconsPageShell } from '@/components/icon-gallery/IconsPageShell';

function loadIconData() {
  const registryPath = path.join(process.cwd(), 'public/r/icons.json');
  const registry: IconRegistry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

  const buttonCodes: Record<string, string> = {};
  for (const icon of registry.icons) {
    for (const variation of icon.variations) {
      const buttonPath = path.join(
        process.cwd(),
        'components/craftui/icons',
        icon.slug,
        'examples',
        `${variation.name}-button.tsx`
      );
      try {
        buttonCodes[`${icon.slug}-${variation.name}`] = fs.readFileSync(buttonPath, 'utf-8');
      } catch {
        // no button example for this variation
      }
    }
  }

  return { icons: registry.icons, buttonCodes };
}

export default function IconsPage() {
  const { icons, buttonCodes } = loadIconData();
  const sidebarNodes = buildIconSidebarNodes(icons);

  const sidebarSections = [
    {
      id: 'icons',
      label: 'Icons',
      nodes: sidebarNodes,
      topLink: { label: 'Gallery', href: '/icon-gallery' },
      selectableGroups: true,
    },
    // When loaders are ready: { id: 'loaders', label: 'Loaders', nodes: loaderNodes },
  ];

  return (
    <Suspense>
      <IconsPageShell
        icons={icons}
        buttonCodes={buttonCodes}
        sidebarSections={sidebarSections}
      />
    </Suspense>
  );
}
