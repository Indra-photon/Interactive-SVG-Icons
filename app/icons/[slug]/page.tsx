// import { notFound } from 'next/navigation';
// import Link from 'next/link';
// import fs from 'fs/promises';
// import path from 'path';
// import type { IconRegistry } from '@/types/icon';

// async function getIcon(slug: string) {
//   try {
//     const registryPath = path.join(process.cwd(), 'public/r/icons.json');
//     const content = await fs.readFile(registryPath, 'utf-8');
//     const registry: IconRegistry = JSON.parse(content);
    
//     const icon = registry.icons.find(i => i.slug === slug);
//     return icon;
//   } catch (error) {
//     return null;
//   }
// }

// export default async function IconVariationsPage({
//   params
// }: {
//   params: Promise<{ slug: string }>
// }) {
//   const { slug } = await params;
//   const icon = await getIcon(slug);
  
//   if (!icon) {
//     notFound();
//   }
  
//   return (
//     <div className="container mx-auto px-4 py-16">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="mb-12">
//           <h1 className="text-4xl font-bold mb-2">{icon.name}</h1>
//           <p className="text-gray-600 mb-4">{icon.description}</p>
//           <div className="flex gap-2">
//             {icon.tags.map(tag => (
//               <span
//                 key={tag}
//                 className="px-3 py-1 bg-gray-100 rounded-full text-sm"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>
//         </div>
        
//         {/* Variations Grid */}
//         <div>
//           <h2 className="text-2xl font-semibold mb-6">
//             {icon.variations.length} Variations
//           </h2>
          
//           <div className="grid md:grid-cols-2 gap-6">
//             {icon.variations.map(variation => (
//               <Link
//                 key={variation.name}
//                 href={`/icons/${icon.slug}/${variation.name}`}
//                 className="border rounded-lg p-6 hover:shadow-lg transition-all group"
//               >
//                 {/* Preview Area */}
//                 <div className="aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
//                   <div className="text-6xl">📦</div>
//                   {/* TODO: Replace with actual icon component */}
//                 </div>
                
//                 {/* Variation Info */}
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h3 className="font-semibold text-lg mb-1">
//                       {variation.displayName}
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       {variation.description}
//                     </p>
//                   </div>
//                   <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
//                     {variation.tier}
//                   </span>
//                 </div>
                
//                 {/* Hover hint */}
//                 <div className="mt-4 text-sm text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
//                   See in action →
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { notFound } from 'next/navigation';
import { VariationCard } from '@/components/icon-gallery/VariationCard';
import { VariationCardWithButton } from '@/components/icon-gallery/VariationCardWithButton';
import fs from 'fs/promises';
import path from 'path';
import type { IconRegistry } from '@/types/icon';
import { Container } from '@/components/Container';

async function getIcon(slug: string) {
  try {
    const registryPath = path.join(process.cwd(), 'public/r/icons.json');
    const content = await fs.readFile(registryPath, 'utf-8');
    const registry: IconRegistry = JSON.parse(content);
    
    const icon = registry.icons.find(i => i.slug === slug);
    return icon;
  } catch (error) {
    return null;
  }
}

export default async function IconVariationsPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const icon = await getIcon(slug);
  
  if (!icon) {
    notFound();
  }
  
  return (
    <Container className=" px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl text-stone-900 font-sans mb-2">{icon.name}</h1>
          <p className="text-stone-600 font-sans mb-4">{icon.description}</p>
          <div className="flex gap-2">
            {icon.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-stone-100 rounded-full text-sm font-sans text-stone-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* Variations Grid */}
        <div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {icon.variations.map(variation => (
              <VariationCardWithButton
                key={variation.name}
                iconSlug={icon.slug}
                variation={variation}
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}