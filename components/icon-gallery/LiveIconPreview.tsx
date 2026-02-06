// 'use client';

// import dynamic from 'next/dynamic';

// interface LiveIconPreviewProps {
//   iconSlug: string;
//   variationName: string;
//   animationType: string;
// }

// export function LiveIconPreview({ iconSlug, variationName, animationType }: LiveIconPreviewProps) {
//   const IconComponent = dynamic(
//     () => import(`@/components/icons/${iconSlug}/${variationName}.tsx`)
//       .then(mod => {
//         const exportedComponent = mod[Object.keys(mod)[0]];
//         return { default: exportedComponent };
//       })
//       .catch(() => {
//         return { 
//           default: ({ size }: { size?: number }) => (
//             <div className="text-6xl">📦</div>
//           ) 
//         };
//       }),
//     { ssr: false }
//   );
  
//   return (
//     <div className="flex flex-col items-center justify-center">
//       <div className="mb-4">
//         <IconComponent size={128} />
//       </div>
//       <p className="text-sm text-stone-400 font-sans">
//         {animationType === 'hover' ? 'Hover to see animation' : 'Click to see animation'}
//       </p>
//     </div>
//   );
// }

'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

interface LiveIconPreviewProps {
  iconSlug: string;
  variationName: string;
  animationType: string;
}

export function LiveIconPreview({ iconSlug, variationName, animationType }: LiveIconPreviewProps) {
  const [isAnimating, setIsAnimating] = useState(false);

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
  
  const handleInteraction = () => {
    if (animationType === 'click') {
      setIsAnimating(false);
      setTimeout(() => setIsAnimating(true), 10);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className="mb-4 cursor-pointer"
        onClick={handleInteraction}
        onMouseEnter={() => animationType === 'hover' && setIsAnimating(true)}
        onMouseLeave={() => animationType === 'hover' && setIsAnimating(false)}
      >
        <IconComponent 
          size={128} 
          {...(iconSlug === 'refresh' && { isAnimating })}
        />
      </div>
      <p className="text-sm text-gray-500">
        {animationType === 'hover' ? 'Hover to see animation' : 'Click to see animation'}
      </p>
    </div>
  );
}