import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import type { BlockRegistry } from '@/types/block';
import { BlockPageClient } from '@/components/block-gallery/BlockPageClient';

async function getBlock(slug: string) {
  try {
    const registryPath = path.join(process.cwd(), 'public/r/blocks.json');
    const content = await fs.readFile(registryPath, 'utf-8');
    const registry: BlockRegistry = JSON.parse(content);
    return registry.blocks.find((b) => b.slug === slug) ?? null;
  } catch {
    return null;
  }
}

export default async function BlockDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const block = await getBlock(slug);

  if (!block) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return <BlockPageClient block={block} baseUrl={baseUrl} />;
}
