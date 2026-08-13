import { notFound } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';
import type { LoaderRegistry } from '@/types/loader';
import { LoaderConfigurator } from '@/components/loader-gallery/LoaderConfigurator';
import { Container } from '@/components/Container';
import { PropsTable } from '@/components/PropsTable';
import { InstallCommand } from '@/components/InstallCommand';
import { installCommand, registryItemName } from '@/lib/registry';

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
            const cliCommand = installCommand(
              registryItemName(loader.slug, variation.name)
            );

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
                <InstallCommand command={cliCommand} className="mb-8" />

                {/* Props table */}
                {variation.props?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-400 mb-3">
                      Props
                    </h3>
                    <PropsTable
                      props={variation.props.map((prop: any) => ({
                        ...prop,
                        type: prop.type === 'ease' ? 'string | number[]' : prop.type,
                      }))}
                    />
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
