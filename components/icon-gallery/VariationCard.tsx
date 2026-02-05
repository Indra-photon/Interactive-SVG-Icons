'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

interface VariationCardProps {
  iconSlug: string;
  variation: {
    name: string;
    displayName: string;
    description: string;
    tier: string;
  };
}

export function VariationCard({ iconSlug, variation }: VariationCardProps) {
  const VariationComponent = dynamic(
    () => import(`@/components/icons/${iconSlug}/${variation.name}.tsx`)
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
      href={`/icons/${iconSlug}/${variation.name}`}
      className="border rounded-lg p-6 hover:shadow-lg transition-all group"
    >
      {/* Preview Area */}
      <div className="aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
        <VariationComponent size={64} />
      </div>
      
      {/* Variation Info */}
      <div className="flex items-start justify-between ">
        <div>
          <h3 className="font-sans text-stone-900 text-lg mb-1">
            {variation.displayName}
          </h3>
          <p className="text-sm font-sans text-stone-600">
            {variation.description}
          </p>
        </div>
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
          {variation.tier}
        </span>
      </div>
      
      {/* Hover hint */}
      <div className="mt-4 text-sm text-blue-600  transition-opacity">
        See in action →
      </div>
    </Link>
  );
}