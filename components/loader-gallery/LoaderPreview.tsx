'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

interface LoaderPreviewProps {
  loaderSlug: string;
  variationName: string;
  propValues?: Record<string, any>;
  animationKey?: string;
}

export function LoaderPreview({ loaderSlug, variationName, propValues = {}, animationKey }: LoaderPreviewProps) {
  const LoaderComponent = useMemo(
    () =>
      dynamic(
        () =>
          import(`@/components/craftui/loaders/${loaderSlug}/${variationName}.tsx`)
            .then((mod) => {
              const exported = mod[Object.keys(mod)[0]];
              return { default: exported };
            })
            .catch(() => ({
              default: () => <div className="text-sm text-stone-400">Not found</div>,
            })),
        {
          ssr: false,
          loading: () => (
            <div className="w-16 h-16 rounded-xl bg-stone-200 dark:bg-stone-700 animate-pulse" />
          ),
        }
      ),
    [loaderSlug, variationName],
  );

  return <LoaderComponent key={animationKey} {...propValues} />;
}
