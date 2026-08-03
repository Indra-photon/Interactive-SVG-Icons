"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface BlockPreviewProps {
  blockSlug: string;
  variationName: string;
  animationType?: string;
  /** Render at real width (reflow) instead of the 1280px scale-to-fit canvas. */
  responsive?: boolean;
  /** Directory under components/craftui to import the preview from. */
  catalogDir?: string;
  /** 'responsive' forces real-width rendering for every item in the catalog. */
  previewMode?: "auto" | "responsive";
}

export function BlockPreview({
  blockSlug,
  variationName,
  animationType,
  responsive,
  catalogDir = "blocks",
  previewMode = "auto",
}: BlockPreviewProps) {
  const [PreviewComponent, setPreviewComponent] =
    useState<React.ComponentType | null>(null);
  const [scale, setScale] = useState(1);
  // Measured container height — drives the scaled-block inner height so it stays
  // correct as the responsive container height changes across breakpoints.
  const [containerHeight, setContainerHeight] = useState(660);
  const outerRef = useRef<HTMLDivElement>(null);

  const RENDER_WIDTH = 1280;
  // Click-driven blocks need real interaction — skip scaling so layoutId
  // animations work correctly. Blocks marked `responsive` also render directly
  // so their own breakpoints reflow at the container's real width.
  const isInteractive = animationType === "click";
  // Sections are page-width layouts, so they always render at the container's
  // real width — scaling a 1280px canvas down would defeat the breakpoints the
  // section is written against.
  const alwaysResponsive = previewMode === "responsive";
  const renderDirect = alwaysResponsive || isInteractive || Boolean(responsive);

  useEffect(() => {
    // One template literal rather than a branch per catalog: a literal
    // `sections/` path fails to resolve while that directory is still empty,
    // because the bundler cannot build an import context with no matches. The
    // wider glob also matches components/craftui/ui/**, which is harmless —
    // context modules are code-split per file, so the extra entries grow the
    // module map, not the chunk that loads here.
    import(
      `@/components/craftui/${catalogDir}/${blockSlug}/examples/${variationName}-preview.tsx`
    )
      .then((mod) => {
        const exported = mod.default ?? mod[Object.keys(mod)[0]];
        setPreviewComponent(() => exported);
      })
      .catch((err) => {
        console.error("Failed to load block preview:", err);
      });
  }, [catalogDir, blockSlug, variationName]);

  useEffect(() => {
    if (renderDirect) return;
    const el = outerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / RENDER_WIDTH);
      setContainerHeight(entry.contentRect.height);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [renderDirect]);

  const innerHeight = scale > 0 ? containerHeight / scale : 640;

  return (
    <div
      ref={outerRef}
      className={cn(
        "relative w-full overflow-hidden corner-squircle rounded-[10px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_2px_-1px_rgba(0,0,0,0.06)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)] bg-muted",
        // The scale-to-fit canvas needs a known height to compute its ratio
        // against. Sections size themselves from their own content instead —
        // a footer shouldn't be padded out to 660px, and a tall feature
        // section shouldn't be clipped by it.
        alwaysResponsive
          ? "min-h-[240px]"
          : "h-[460px] sm:h-[560px] md:h-[660px]",
      )}
    >
      {!PreviewComponent ? (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Loading preview…
        </div>
      ) : renderDirect ? (
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
