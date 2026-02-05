'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

interface IconCardProps {
  icon: {
    slug: string;
    name: string;
    variations: any[];
  };
}

export function IconCard({ icon }: IconCardProps) {
  const IconComponent = dynamic(
    () => import(`@/components/icons/${icon.slug}/default.tsx`)
      .then(mod => {
        const exportedComponent = mod[Object.keys(mod)[0]];
        return { default: exportedComponent };
      })
      .catch(() => {
        return { 
          default: ({ size }: { size?: number }) => (
            <div className="text-6xl">📦</div>
          ) 
        };
      }),
    { ssr: false }
  );
  
  return (
    <Link
      href={`/icons/${icon.slug}`}
      className="border rounded-lg p-6 hover:shadow-lg transition-shadow group"
    >
      <div className="aspect-square flex items-center justify-center mb-4">
        <IconComponent size={64} />
      </div>
      
      <h3 className="font-semibold text-center mb-2">
        {icon.name}
      </h3>
      
      <p className="text-sm text-gray-600 text-center">
        {icon.variations.length} variations
      </p>
    </Link>
  );
}