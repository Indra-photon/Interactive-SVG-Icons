import { notFound } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';
import type { IconRegistry } from '@/types/icon';
import { CopyButton } from '@/components/icon-gallery/CopyButton';

async function getVariation(slug: string, variationName: string) {
  try {
    const registryPath = path.join(process.cwd(), 'public/r/icons.json');
    const content = await fs.readFile(registryPath, 'utf-8');
    const registry: IconRegistry = JSON.parse(content);
    
    const icon = registry.icons.find(i => i.slug === slug);
    if (!icon) return null;
    
    const variation = icon.variations.find(v => v.name === variationName);
    if (!variation) return null;
    
    return { icon, variation };
  } catch (error) {
    return null;
  }
}

export default async function VariationDetailPage({
  params
}: {
  params: Promise<{ slug: string; variation: string }>
}) {
  const { slug, variation: variationName } = await params;
  const data = await getVariation(slug, variationName);
  
  if (!data) {
    notFound();
  }
  
  const { icon, variation } = data;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const registryUrl = `${baseUrl}/r/${icon.slug}-${variation.name}.json`;
  const installCommand = `npx shadcn@latest add ${registryUrl}`;
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/icons" className="hover:text-gray-900">Icons</Link>
          <span>/</span>
          <Link href={`/icons/${icon.slug}`} className="hover:text-gray-900">
            {icon.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{variation.displayName}</span>
        </div>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {icon.name} - {variation.displayName}
          </h1>
          <p className="text-gray-600">{variation.description}</p>
        </div>
        
        {/* Live Preview */}
        <div className="bg-gray-50 rounded-lg p-16 mb-8">
          <div className="flex flex-col items-center justify-center">
            <div className="text-8xl mb-4">
              {/* TODO: Replace with actual animated icon */}
              <svg width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M4 7h16" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">
              Hover or click to see animation
            </p>
          </div>
        </div>
        
        {/* Installation Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Installation</h2>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              {installCommand}
            </div>
            <CopyButton text={installCommand} />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Usage</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre">
{`import { TrashIcon } from '@/components/icons/${icon.slug}/${variation.name}';

export default function App() {
  return <TrashIcon size={32} />;
}`}
            </div>
          </div>
          
          {/* Props Documentation */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Props</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Prop</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Default</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-mono text-sm">size</td>
                    <td className="px-4 py-2 text-sm text-gray-600">number</td>
                    <td className="px-4 py-2 font-mono text-sm">24</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-mono text-sm">color</td>
                    <td className="px-4 py-2 text-sm text-gray-600">string</td>
                    <td className="px-4 py-2 font-mono text-sm">currentColor</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-mono text-sm">className</td>
                    <td className="px-4 py-2 text-sm text-gray-600">string</td>
                    <td className="px-4 py-2 font-mono text-sm">""</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}