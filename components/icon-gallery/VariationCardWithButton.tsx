'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { IconExternalLink } from '@tabler/icons-react';

interface VariationCardWithButtonProps {
  iconSlug: string;
  variation: {
    name: string;
    displayName: string;
    description: string;
    tier: string;
  };
}

export function VariationCardWithButton({ iconSlug, variation }: VariationCardWithButtonProps) {
  // Load icon component
  const IconComponent = dynamic(
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

  // Load button example component
  const ButtonExample = dynamic(
    () => import(`@/components/icons/${iconSlug}/examples/${variation.name}-button.tsx`)
      .then(mod => {
        const exportedComponent = mod[Object.keys(mod)[0]];
        return { default: exportedComponent };
      })
      .catch(() => {
        return { 
          default: () => (
            <div className="text-sm text-gray-500">No example available</div>
          ) 
        };
      }),
    { ssr: false }
  );
  
  return (
    <Link
      href={`/icons/${iconSlug}/${variation.name}`}
      className="border rounded-lg p-6 transition-all group"
    >
      {/* Icon Preview */}
      {/* <div className="aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
        <IconComponent size={64} />
      </div> */}
      
      {/* Button Example */}
      <div className="mb-4 flex items-center justify-center py-10  relative overflow-hidden">
        <ButtonExample />
        <span className="px-2 py-1 bg-stone-100 text-stone-700 font-sans tracking-tighter rounded text-xs font-medium absolute top-0 right-0">
          {variation.tier}
        </span>
      </div>
      
      {/* Variation Info */}
      <div className="flex items-end justify-between border-t border-stone-300 mt-12 pt-4">
        <div>
          <h3 className="font-sans text-stone-900 text-lg mb-1">
            {variation.displayName}
          </h3>
          <p className="text-sm font-sans text-stone-600">
            {variation.description}
          </p>
        </div>
        <span className='pb-6'>
          <IconExternalLink className="text-stone-400" />
        </span>
      </div>
      
      {/* Hover hint */}
      {/* <div className="text-sm text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
        See details →
      </div> */}
    </Link>
  );
}