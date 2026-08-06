import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import type { SectionRegistry } from '@/types/section';
import { BlockPageClient } from '@/components/block-gallery/BlockPageClient';
import { SECTIONS_CATALOG } from '@/lib/catalog-config';

async function getSection(slug: string) {
  try {
    const registryPath = path.join(process.cwd(), 'public/r/sections.json');
    const content = await fs.readFile(registryPath, 'utf-8');
    const registry: SectionRegistry = JSON.parse(content);
    return registry.sections.find((s) => s.slug === slug) ?? null;
  } catch {
    return null;
  }
}

export default async function SectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const section = await getSection(slug);

  if (!section) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return (
    <BlockPageClient
      block={section}
      baseUrl={baseUrl}
      catalog={SECTIONS_CATALOG}
    />
  );
}
