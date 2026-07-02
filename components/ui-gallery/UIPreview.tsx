"use client";

import { useEffect, useState } from "react";

interface UIPreviewProps {
  componentSlug: string;
  variationName: string;
}

export function UIPreview({ componentSlug, variationName }: UIPreviewProps) {
  const [PreviewComponent, setPreviewComponent] =
    useState<React.ComponentType | null>(null);

  useEffect(() => {
    setPreviewComponent(null);
    import(
      `@/components/craftui/ui/${componentSlug}/examples/${variationName}-preview.tsx`
    )
      .then((mod) => {
        const exported = mod.default ?? mod[Object.keys(mod)[0]];
        setPreviewComponent(() => exported);
      })
      .catch(() => {
        setPreviewComponent(
          () => () => (
            <div className="text-sm text-muted-foreground">Preview not found</div>
          ),
        );
      });
  }, [componentSlug, variationName]);

  if (!PreviewComponent) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  // UI components are always interactive — no scale transform
  return (
    <div className="h-full w-full overflow-auto">
      <PreviewComponent />
    </div>
  );
}
