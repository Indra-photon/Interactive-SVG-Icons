import Link from 'next/link';
import { Container } from '@/components/Container';
import type { Block } from '@/types/block';

async function getBlocks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/blocks`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch blocks');
  return res.json();
}

export default async function BlocksPage() {
  const { blocks } = await getBlocks();

  return (
    <Container className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-sans font-semibold text-foreground mb-2">Blocks</h1>
        <p className="text-muted-foreground font-sans">
          Ready-to-use full-section components. Copy the install command and drop into any project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blocks.map((block: Block) => (
          <Link
            key={block.slug}
            href={`/blocks/${block.slug}`}
            className="group block rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="font-sans text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {block.name}
              </h2>
              <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {block.category}
              </span>
            </div>

            <p className="font-sans text-sm text-muted-foreground mb-4 line-clamp-2">
              {block.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {block.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 text-xs text-muted-foreground font-sans">
              {block.variations.length} variation{block.variations.length !== 1 ? 's' : ''}
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
