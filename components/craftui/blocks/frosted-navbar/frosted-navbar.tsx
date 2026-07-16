import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

export interface StickyFrostedNavProps {
  /** Element/tag to render as — defaults to <nav>, use "header" for page chrome. */
  as?: ElementType;
  /** Your actual content: nav links, icons, a search input, a card title, etc. */
  children?: ReactNode;
  /** Blur strength in px for the fade-out region. */
  blur?: number;
  /** Brightness % applied to the main blur region. */
  brightness?: number;
  /** Saturation % applied to the main blur region. */
  saturate?: number;
  /** Blur strength in px for the thin edge-highlight rim. */
  edgeBlur?: number;
  /** Brightness % applied to the edge-highlight rim. */
  edgeBrightness?: number;
  /** Saturation % applied to the edge-highlight rim. */
  edgeSaturate?: number;
  /** Set false to omit the edge-highlight rim. */
  edgeHighlight?: boolean;
  /** Thickness of the edge-highlight rim in px. */
  edgeThickness?: number;
  className?: string;
}

type StickyFrostedNavExtraProps = Omit<
  ComponentPropsWithoutRef<"nav">,
  keyof StickyFrostedNavProps
>;

export default function StickyFrostedNav({
  as: Tag = "nav",
  children,
  blur = 12,
  brightness = 110,
  saturate = 110,
  edgeBlur = 6,
  edgeBrightness = 120,
  edgeSaturate = 110,
  edgeHighlight = true,
  edgeThickness = 1,
  className,
  ...rest
}: StickyFrostedNavProps & StickyFrostedNavExtraProps) {
  return (
    <Tag className={`sticky top-0 z-10 ${className ?? ""}`}>
      {/* Blur extends past the nav's real bottom edge so the filter has
          geometry to sample against right up to the cutoff (avoids a
          truncation seam). `overflow-hidden` on the wrapper — not a mask —
          is what guarantees that extended part never actually paints, since
          mask-image's alpha vs. luminance interpretation isn't reliable
          across browsers for this. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 h-[200%]"
          style={{
            backdropFilter: `blur(${blur}px) brightness(${brightness}%) saturate(${saturate}%)`,
            WebkitBackdropFilter: `blur(${blur}px) brightness(${brightness}%) saturate(${saturate}%)`,
          }}
        />
      </div>

      {/* Thin light rim along the bottom edge, so the panel reads as a
          physical, lit sheet of glass rather than a flat blurred tint. */}
      {edgeHighlight && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-white/10"
          style={{
            height: edgeThickness,
            backdropFilter: `blur(${edgeBlur}px) brightness(${edgeBrightness}%) saturate(${edgeSaturate}%)`,
            WebkitBackdropFilter: `blur(${edgeBlur}px) brightness(${edgeBrightness}%) saturate(${edgeSaturate}%)`,
          }}
        />
      )}

      {/* Your content, rendered above both layers */}
      <div className="relative">{children}</div>
    </Tag>
  );
}
