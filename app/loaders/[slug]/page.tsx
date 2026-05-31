import { notFound } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';
import type { LoaderRegistry } from '@/types/loader';
import { CopyButton } from '@/components/loader-gallery/CopyButton';
import { LoaderConfigurator } from '@/components/loader-gallery/LoaderConfigurator';
import { Container } from '@/components/Container';

async function getLoader(slug: string) {
  try {
    const registryPath = path.join(process.cwd(), 'public/r/loaders.json');
    const content = await fs.readFile(registryPath, 'utf-8');
    const registry: LoaderRegistry = JSON.parse(content);
    return registry.loaders.find(l => l.slug === slug);
  } catch {
    return null;
  }
}

export default async function LoaderDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loader = await getLoader(slug);

  if (!loader) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return (
    <Container className="px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-stone-500">
          <Link href="/loaders" className="hover:text-stone-900 transition-colors">
            Loaders
          </Link>
          <span>/</span>
          <span className="text-stone-900">{loader.name}</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl text-stone-900 font-sans mb-2">{loader.name}</h1>
          <p className="text-stone-600 font-sans mb-4 tracking-tighter">{loader.description}</p>
          <div className="flex flex-wrap gap-2">
            {loader.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-stone-100 rounded-full text-sm font-sans tracking-tighter text-stone-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Variations */}
        <div className="space-y-16">
          {loader.variations.map((variation: any) => {
            const cliCommand = `npx shadcn@latest add ${baseUrl}/r/${loader.slug}-${variation.name}.json`;

            return (
              <div key={variation.name} className="border-t pt-12 first:border-t-0 first:pt-0">
                {/* Variation header */}
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-sans text-stone-900 mb-1">
                      {variation.displayName}
                    </h2>
                    <p className="text-stone-500 font-sans tracking-tighter text-sm">
                      {variation.description}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
                      variation.tier === 'free'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-violet-50 text-violet-700 border border-violet-200'
                    }`}
                  >
                    {variation.tier}
                  </span>
                </div>

                {/* Configurator — preview + config controls + code */}
                <div className="mb-10">
                  <LoaderConfigurator
                    loaderSlug={loader.slug}
                    variation={variation}
                  />
                </div>

                {/* Installation */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-400 mb-3">
                    Installation
                  </h3>
                  <div className="bg-stone-950 text-stone-100 px-4 py-3.5 rounded-lg font-mono text-sm overflow-x-auto">
                    {cliCommand}
                  </div>
                  <CopyButton text={cliCommand} />
                </div>

                {/* Props table */}
                {variation.props?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-400 mb-3">
                      Props
                    </h3>
                    <div className="border border-stone-200 rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-stone-50 border-b border-stone-200">
                            <th className="px-4 py-3 text-left font-medium text-stone-700">Name</th>
                            <th className="px-4 py-3 text-left font-medium text-stone-700">Type</th>
                            <th className="px-4 py-3 text-left font-medium text-stone-700">Default</th>
                            <th className="px-4 py-3 text-left font-medium text-stone-700">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {variation.props.map((prop: any) => (
                            <tr key={prop.name} className="hover:bg-stone-50 transition-colors">
                              <td className="px-4 py-3">
                                <code className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                  {prop.name}
                                </code>
                              </td>
                              <td className="px-4 py-3 text-xs font-mono text-stone-500">
                                {prop.type === 'ease' ? 'string | number[]' : prop.type}
                              </td>
                              <td className="px-4 py-3 text-xs font-mono text-stone-500">
                                {Array.isArray(prop.default)
                                  ? `[${(prop.default as number[]).join(', ')}]`
                                  : typeof prop.default === 'string'
                                  ? `"${prop.default}"`
                                  : String(prop.default)}
                              </td>
                              <td className="px-4 py-3 text-xs text-stone-500">
                                {prop.description || '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
