"use client";

import { useEffect, useRef, useState } from "react";

interface BlockPreviewProps {
  blockSlug: string;
  variationName: string;
  animationType?: string;
}

export function BlockPreview({
  blockSlug,
  variationName,
  animationType,
}: BlockPreviewProps) {
  const [PreviewComponent, setPreviewComponent] =
    useState<React.ComponentType | null>(null);
  const [scale, setScale] = useState(1);
  const outerRef = useRef<HTMLDivElement>(null);

  const RENDER_WIDTH = 1280;
  // Click-driven blocks need real interaction — skip scaling so layoutId animations work correctly
  const isInteractive = animationType === "click";

  useEffect(() => {
    import(
      `@/components/craftui/blocks/${blockSlug}/examples/${variationName}-preview.tsx`
    )
      .then((mod) => {
        const exported = mod.default ?? mod[Object.keys(mod)[0]];
        setPreviewComponent(() => exported);
      })
      .catch((err) => {
        console.error("Failed to load block preview:", err);
      });
  }, [blockSlug, variationName]);

  useEffect(() => {
    if (isInteractive) return;
    const el = outerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width;
      setScale(containerWidth / RENDER_WIDTH);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [isInteractive]);

  const outerHeight = 660;
  const innerHeight = scale > 0 ? outerHeight / scale : 640;

  return (
    <div
      ref={outerRef}
      className="relative w-full overflow-hidden corner-squircle rounded-[10px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_2px_-1px_rgba(0,0,0,0.06)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)] bg-muted"
      style={{ height: outerHeight }}
    >
      {!PreviewComponent ? (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Loading preview…
        </div>
      ) : isInteractive ? (
        // Render at natural size — no scale transform so animations work correctly
        <div className="h-full w-full">
          <PreviewComponent />
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
