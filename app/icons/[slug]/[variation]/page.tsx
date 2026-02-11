import { notFound } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';
import type { IconRegistry } from '@/types/icon';
import { CopyButton } from '@/components/icon-gallery/CopyButton';
import { LiveIconPreview } from '@/components/icon-gallery/LiveIconPreview';
import { ButtonCodeDisplay } from '@/components/icon-gallery/ButtonCodeDisplay';
import { Container } from '@/components/Container';

// async function getVariation(slug: string, variationName: string) {
//   try {
//     const registryPath = path.join(process.cwd(), 'public/r/icons.json');
//     const content = await fs.readFile(registryPath, 'utf-8');
//     const registry: IconRegistry = JSON.parse(content);
    
//     const icon = registry.icons.find(i => i.slug === slug);
//     if (!icon) return null;
    
//     const variation = icon.variations.find(v => v.name === variationName);
//     if (!variation) return null;
    
//     return { icon, variation };
//   } catch (error) {
//     return null;
//   }
// }

async function getVariation(slug: string, variationName: string) {
  try {
    const registryPath = path.join(process.cwd(), 'public/r/icons.json');
    const content = await fs.readFile(registryPath, 'utf-8');
    const registry: IconRegistry = JSON.parse(content);
    
    const icon = registry.icons.find(i => i.slug === slug);
    if (!icon) return null;
    
    const variation = icon.variations.find(v => v.name === variationName);
    if (!variation) return null;
    
    // Try to read button example code
    let buttonCode = '';
    try {
      const buttonPath = path.join(
        process.cwd(), 
        'components/icons', 
        slug, 
        'examples', 
        `${variationName}-button.tsx`
      );
      buttonCode = await fs.readFile(buttonPath, 'utf-8');
    } catch (error) {
      buttonCode = '// Button example not available';
    }
    
    return { icon, variation, buttonCode };
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
  
  const { icon, variation, buttonCode } = data;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const registryUrl = `${baseUrl}/r/${icon.slug}-${variation.name}.json`;
  const installCommand = `npx shadcn@latest add ${registryUrl}`;
  
  return (
    <Container className=" px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/icons" className="hover:text-stone-900">Icons</Link>
          <span>/</span>
          <Link href={`/icons/${icon.slug}`} className="hover:text-stone-900">
            {icon.name}
          </Link>
          <span>/</span>
          <span className="text-stone-900">{variation.displayName}</span>
        </div>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-sans text-stone-900 mb-2">
            {icon.name} - {variation.displayName}
          </h1>
          <p className="text-stone-600 font-sans">{variation.description}</p>
          {variation.designNote && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Design Note:</strong> {variation.designNote}
              </p>
            </div>
          )}
        </div>
        
        {/* Live Preview */}
        {/* <div className="bg-gray-50 rounded-lg p-16 mb-8">
          <LiveIconPreview 
            iconSlug={icon.slug}
            variationName={variation.name}
            animationType={variation.animationType}
          />
        </div> */}
        
        {/* Installation Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-sans mb-4">Installation</h2>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              {installCommand}
            </div>
            <CopyButton text={installCommand} />
          </div>
          
          {/* <div>
            <h3 className="text-xl font-sans mb-4">Usage</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre">
            {`import { TrashIcon } from '@/components/icons/${icon.slug}/${variation.name}';

            export default function App() {
              return <TrashIcon size={32} />;
            }`}
            </div>
          </div> */}
          
          {/* Props Documentation */}
          {variation.props && variation.props.length > 0 ? (
            <div>
              <h3 className="text-xl font-sans mb-4">Props</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Prop</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Default</th>
                      <th className="px-4 py-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variation.props.map((prop) => (
                      <tr key={prop.name} className="border-t">
                        <td className="px-4 py-2 font-mono text-sm">{prop.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{prop.type}</td>
                        <td className="px-4 py-2 font-mono text-sm">
                          {typeof prop.default === 'string' && prop.default !== '' 
                            ? `"${prop.default}"` 
                            : String(prop.default)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {prop.description || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {data.buttonCode && data.buttonCode !== '// Button example not available' && (
            <ButtonCodeDisplay
              iconSlug={icon.slug}
              variationName={variation.name}
              buttonCode={data.buttonCode}
            />
          )}
          
          
        </div>
      </div>
    </Container>
  );
}