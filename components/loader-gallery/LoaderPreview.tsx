'use client';

import { useEffect, useState } from 'react';

interface LoaderPreviewProps {
  loaderSlug: string;
  variationName: string;
}

export function LoaderPreview({ loaderSlug, variationName }: LoaderPreviewProps) {
  const [LoaderComponent, setLoaderComponent] = useState<any>(null);

  useEffect(() => {
    import(`@/components/loaders/${loaderSlug}/${variationName}.tsx`)
      .then((mod) => {
        const exportedComponent = mod[Object.keys(mod)[0]];
        setLoaderComponent(() => exportedComponent);
      })
      .catch((err) => {
        console.error('Failed to load loader component:', err);
      });
  }, [loaderSlug, variationName]);

  if (!LoaderComponent) {
    return <div className="text-sm text-gray-500">Loading preview...</div>;
  }

  return <LoaderComponent />;
}