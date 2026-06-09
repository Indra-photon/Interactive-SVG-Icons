'use client';

import { useEffect, useRef, useState } from 'react';

interface BlockPreviewProps {
  blockSlug: string;
  variationName: string;
}

export function BlockPreview({ blockSlug, variationName }: BlockPreviewProps) {
  const [PreviewComponent, setPreviewComponent] = useState<React.ComponentType | null>(null);
  const [scale, setScale] = useState(1);
  const outerRef = useRef<HTMLDivElement>(null);

  // Render the block at this fixed width and scale it down to fit the container
  const RENDER_WIDTH = 1280;

  useEffect(() => {
    import(`@/components/craftui/blocks/${blockSlug}/examples/${variationName}-preview.tsx`)
      .then((mod) => {
        const exported = mod.default ?? mod[Object.keys(mod)[0]];
        setPreviewComponent(() => exported);
      })
      .catch((err) => {
        console.error('Failed to load block preview:', err);
      });
  }, [blockSlug, variationName]);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width;
      setScale(containerWidth / RENDER_WIDTH);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const outerHeight = 480;
  const innerHeight = scale > 0 ? outerHeight / scale : 640;

  return (
    <div
      ref={outerRef}
      className="relative w-full overflow-hidden rounded-xl border border-border bg-muted"
      style={{ height: outerHeight }}
    >
      {!PreviewComponent ? (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Loading preview…
        </div>
      ) : (
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{
            width: RENDER_WIDTH,
            height: innerHeight,
            transform: `scale(${scale})`,
          }}
        >
          <PreviewComponent />
        </div>
      )}
    </div>
  );
}
