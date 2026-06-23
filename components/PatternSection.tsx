const HATCH =
  "bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed";

export function PatternSection({
  children,
  className = "",
  contentClassName = "",
  hideTopBar = false,
  hideBottomBar = false,
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  hideTopBar?: boolean;
  hideBottomBar?: boolean;
}) {
  return (
    <div
      className={`relative grid grid-cols-[2.5rem_1fr_2.5rem] grid-rows-[1px_auto_1px] bg-white [--pattern-fg:var(--color-gray-950)]/10 dark:bg-gray-950 dark:[--pattern-fg:var(--color-white)]/10 ${className}`}
    >
      <div className={`col-start-2 row-start-2 ${contentClassName}`}>
        {children}
      </div>

      <div
        className={`col-start-1 row-span-full row-start-1 border-r border-r-(--pattern-fg) ${HATCH}`}
      />
      <div
        className={`col-start-3 row-span-full row-start-1 border-l border-l-(--pattern-fg) ${HATCH}`}
      />

      {!hideTopBar && (
        <div className="col-span-full col-start-1 row-start-1 h-px bg-[#fd551d]" />
      )}
      {!hideBottomBar && (
        <div className="col-span-full col-start-1 row-start-3 h-px bg-[#fd551d]" />
      )}

      {!hideTopBar && (
        <div className="col-start-1 row-start-1 relative z-20">
          <div className="absolute size-2.5 rotate-45 -translate-y-1/2 translate-x-1/2 right-0 top-0 border border-(--pattern-fg) bg-[#fd551d] dark:bg-gray-950" />
        </div>
      )}
      {!hideTopBar && (
        <div className="col-start-3 row-start-1 relative z-20">
          <div className="absolute size-2.5 rotate-45 -translate-y-1/2 -translate-x-1/2 left-0 top-0 border border-(--pattern-fg) bg-[#fd551d] dark:bg-gray-950" />
        </div>
      )}
      {!hideBottomBar && (
        <div className="col-start-1 row-start-3 relative z-20">
          <div className="absolute size-2.5 rotate-45 translate-y-1/2 translate-x-1/2 right-0 bottom-0 border border-(--pattern-fg) bg-white dark:bg-gray-950" />
        </div>
      )}
      {!hideBottomBar && (
        <div className="col-start-3 row-start-3 relative z-20">
          <div className="absolute size-2.5 rotate-45 translate-y-1/2 -translate-x-1/2 left-0 bottom-0 border border-(--pattern-fg) bg-white dark:bg-gray-950" />
        </div>
      )}
    </div>
  );
}
