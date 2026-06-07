'use client';

import dynamic from 'next/dynamic';
import { CopyButton } from './CopyButton';

interface ButtonCodeDisplayProps {
  iconSlug: string;
  variationName: string;
  buttonCode: string;
}

export function ButtonCodeDisplay({ iconSlug, variationName, buttonCode }: ButtonCodeDisplayProps) {
  // Dynamically load button example
  const ButtonExample = dynamic(
    () => import(`@/components/craftui/icons/${iconSlug}/examples/${variationName}-button.tsx`)
      .then(mod => {
        const exportedComponent = mod[Object.keys(mod)[0]];
        return { default: exportedComponent };
      })
      .catch(() => {
        return { 
          default: () => (
            <div className="text-sm text-gray-500">Button example not available</div>
          ) 
        };
      }),
    { ssr: false }
  );

  return (
    <div>
      <h3 className="text-xl font-sans text-stone-900">Example Component</h3>
      <p className="text-stone-600 font-sans mb-4">
        Ready-to-use button component with the icon
      </p>
      
      {/* Live Button Preview */}
      <div className="bg-gray-50 rounded-lg p-8 mb-4 flex items-center justify-center">
        <ButtonExample />
      </div>
      
      {/* Button Code */}
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre">
        {buttonCode}
      </div>
      <CopyButton text={buttonCode} />
    </div>
  );
}