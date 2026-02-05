'use client';

import dynamic from 'next/dynamic';

interface LiveIconPreviewProps {
  iconSlug: string;
  variationName: string;
  animationType: string;
}

export function LiveIconPreview({ iconSlug, variationName, animationType }: LiveIconPreviewProps) {
  const IconComponent = dynamic(
    () => import(`@/components/icons/${iconSlug}/${variationName}.tsx`)
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
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4">
        <IconComponent size={128} />
      </div>
      <p className="text-sm text-stone-400 font-sans">
        {animationType === 'hover' ? 'Hover to see animation' : 'Click to see animation'}
      </p>
    </div>
  );
}