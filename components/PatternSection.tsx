import { PatternRailShader } from "@/components/PatternRailShader";

// bg-fixed only from md up: background-attachment: fixed repaints on every
// scroll frame in iOS Safari, and buys nothing on a rail that is hidden anyway.
const HATCH =
  "bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] md:bg-fixed";

// The rails are decoration, and 2.5rem a side is a quarter of a 320px viewport.
// Below md they collapse entirely; --rail drives the grid template so the
// breakpoint ladder lives in one place.
const RAIL_WIDTH =
  "[--rail:0px] md:[--rail:2rem] lg:[--rail:2.5rem] xl:[--rail:3rem]";

// hidden, not just zero-width: a 0px track still paints its 1px border.
// This also keeps the shader idle on phones — IntersectionObserver reports a
// display:none element as non-intersecting, so its rAF loop never starts.
// Removing `hidden` here silently switches two animation loops back on.
const RAIL_BASE =
  "hidden md:block relative overflow-hidden row-span-full row-start-1";

export function PatternSection({
  children,
  className = "",
  contentClassName = "",
  hideTopBar = false,
  hideBottomBar = false,
  fillHeight = false,
  shader = false,
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  hideTopBar?: boolean;
  hideBottomBar?: boolean;
  fillHeight?: boolean;
  /** Animated flow field in the rails. Opt-in: costs a rAF loop per rail. */
  shader?: boolean;
}) {
  return (
    <div
      className={`relative grid ${RAIL_WIDTH} grid-cols-[var(--rail)_minmax(0,1fr)_var(--rail)] ${fillHeight ? "grid-rows-[1px_minmax(0,1fr)_1px]" : "grid-rows-[1px_auto_1px]"} bg-pattern-surface ${className}`}
    >
      {/* minmax(0,1fr) above, not 1fr: a bare 1fr track has an auto minimum, so
          a wide child would push the whole grid past the viewport. */}
      <div
        className={`col-start-2 row-start-2 px-4 md:px-0 ${contentClassName}`}
      >
        {children}
      </div>

      <div
        className={`${RAIL_BASE} col-start-1 border-r border-r-(--pattern-fg) ${HATCH}`}
      >
        {shader && <PatternRailShader />}
      </div>
      <div
        className={`${RAIL_BASE} col-start-3 border-l border-l-(--pattern-fg) ${HATCH}`}
      >
        {shader && <PatternRailShader />}
      </div>

      {!hideTopBar && (
        <div className="col-span-full col-start-1 row-start-1 h-px bg-pattern-accent" />
      )}
      {!hideBottomBar && (
        <div className="col-span-full col-start-1 row-start-3 h-px bg-pattern-accent" />
      )}

      {/* Diamonds mark the rail/bar intersections, so they follow the rails out. */}
      {!hideTopBar && (
        <div className="hidden md:block col-start-1 row-start-1 relative z-20">
          <div className="absolute size-2.5 rotate-45 -translate-y-1/2 translate-x-1/2 right-0 top-0 border border-(--pattern-fg) bg-pattern-diamond" />
        </div>
      )}
      {!hideTopBar && (
        <div className="hidden md:block col-start-3 row-start-1 relative z-20">
          <div className="absolute size-2.5 rotate-45 -translate-y-1/2 -translate-x-1/2 left-0 top-0 border border-(--pattern-fg) bg-pattern-diamond" />
        </div>
      )}
      {!hideBottomBar && (
        <div className="hidden md:block col-start-1 row-start-3 relative z-20">
          <div className="absolute size-2.5 rotate-45 translate-y-1/2 bg-pattern-diamond translate-x-1/2 right-0 bottom-0 border border-(--pattern-fg)" />
        </div>
      )}
      {!hideBottomBar && (
        <div className="hidden md:block col-start-3 row-start-3 relative z-20">
          <div className="absolute size-2.5 rotate-45 translate-y-1/2 -translate-x-1/2 left-0 bottom-0 border border-(--pattern-fg) bg-pattern-diamond" />
        </div>
      )}
    </div>
  );
}
