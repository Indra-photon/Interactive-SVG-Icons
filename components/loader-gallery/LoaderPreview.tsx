"use client";

import { useEffect, useState } from "react";

interface LoaderPreviewProps {
  loaderSlug: string;
  variationName: string;
}

export function LoaderPreview({ loaderSlug, variationName }: LoaderPreviewProps) {
  const [PreviewComponent, setPreviewComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    setPreviewComponent(null);
    import(`@/components/craftui/loaders/${loaderSlug}/${variationName}-preview.tsx`)
      .then((mod) => {
        const exported = mod.default ?? mod[Object.keys(mod)[0]];
        setPreviewComponent(() => exported);
      })
      .catch(() => {
        setPreviewComponent(() => () => <div className="text-sm text-muted-foreground">Not found</div>);
      });
  }, [loaderSlug, variationName]);

  if (!PreviewComponent) {
    return <div className="w-16 h-16 rounded-xl bg-stone-200 dark:bg-stone-700 animate-pulse" />;
  }

  return <PreviewComponent />;
}
