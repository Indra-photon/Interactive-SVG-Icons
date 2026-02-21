import { notFound } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';
import type { LoaderRegistry } from '@/types/loader';
import { CopyButton } from '@/components/loader-gallery/CopyButton';
import { LoaderPreview } from '@/components/loader-gallery/LoaderPreview';
import { Container } from '@/components/Container';

async function getLoader(slug: string) {
  try {
    const registryPath = path.join(process.cwd(), 'public/r/loaders.json');
    const content = await fs.readFile(registryPath, 'utf-8');
    const registry: LoaderRegistry = JSON.parse(content);
    
    const loader = registry.loaders.find(l => l.slug === slug);
    return loader;
  } catch (error) {
    return null;
  }
}

export default async function LoaderDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const loader = await getLoader(slug);
  
  if (!loader) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return (
    <Container className=" px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/loaders" className="hover:text-stone-900">Loaders</Link>
          <span>/</span>
          <span className="text-stone-900">{loader.name}</span>
        </div>
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl text-stone-900 font-sans mb-2">{loader.name}</h1>
          <p className="text-stone-600 font-sans mb-4 tracking-tighter">{loader.description}</p>
          <div className="flex gap-2">
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
        <div className="space-y-12">
          {loader.variations.map((variation: any) => {
            const cliCommand = `npx shadcn@latest add ${baseUrl}/r/${loader.slug}-${variation.name}.json`;
            const componentName = variation.displayName.replace(/\s+/g, '');
            
            // Generate usage example dynamically from props
            const propsString = variation.props && variation.props.length > 0
              ? '\n' + variation.props.map((prop: any) => {
                  const value = typeof prop.default === 'string' && prop.default !== 'currentColor'
                    ? `"${prop.default}"`
                    : prop.default;
                  return `  ${prop.name}={${value}}`;
                }).join('\n') + '\n'
              : '';
            
            const usageExample = `<${componentName}${propsString}/>`;

            return (
              <div key={variation.name} className="border-t pt-12 first:border-t-0 first:pt-0">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-sans text-stone-900">
                      {variation.displayName}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      variation.tier === 'free' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {variation.tier}
                    </span>
                  </div>
                  <p className="text-stone-600 font-sans tracking-tighter">
                    {variation.description}
                  </p>
                </div>
                
                {/* Live Preview */}
                <div className="bg-stone-50 rounded-lg p-12 mb-6 flex items-center justify-center border">
                  <LoaderPreview loaderSlug={loader.slug} variationName={variation.name} />
                </div>

                {/* Installation */}
                <div className="mb-8">
                  <h3 className="text-lg font-sans text-stone-900 mb-3">Installation</h3>
                  <div className="bg-stone-900 text-stone-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    {cliCommand}
                  </div>
                  <CopyButton text={cliCommand} />
                </div>

                {/* Usage */}
                <div className="mb-8">
                  <h3 className="text-lg font-sans text-stone-900 mb-3">Usage</h3>
                  <div className="bg-stone-900 text-stone-100 p-4 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre">
                    {usageExample}
                  </div>
                  <CopyButton text={usageExample} />
                </div>
                
                {/* Props Documentation */}
                {variation.props && variation.props.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-sans text-stone-900 mb-3">Props</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-stone-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-stone-900">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-stone-900">Type</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-stone-900">Default</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-stone-900">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                          {variation.props.map((prop: any) => (
                            <tr key={prop.name} className="hover:bg-stone-50">
                              <td className="px-4 py-3">
                                <code className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                  {prop.name}
                                </code>
                              </td>
                              <td className="px-4 py-3 text-sm text-stone-600 font-mono">
                                {prop.type}
                              </td>
                              <td className="px-4 py-3 text-sm text-stone-600 font-mono">
                                {typeof prop.default === 'string' && prop.default !== 'currentColor'
                                  ? `"${prop.default}"` 
                                  : String(prop.default)}
                              </td>
                              <td className="px-4 py-3 text-sm text-stone-600">
                                {prop.description || '-'}
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