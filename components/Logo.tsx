import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string;
  /** Rendered size in px. Defaults to 1em so it tracks surrounding text. */
  size?: number;
}

/**
 * Hand-drawn toggle mark — the CraftUI brand mark.
 *
 * Strokes are currentColor, so colour comes from the parent. Callers that want
 * the brand blue set `text-[var(--brand-mark)]`; callers on a coloured surface
 * (a filled button, say) can inherit that surface's foreground instead.
 */
export function LogoMark({ className, size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={cn("size-[1em]", className)}
      role="img"
      aria-label="CraftUI"
    >
      {/* Toggle track */}
      <path d="M20.4 22.3c8.4-.6 15.7-.5 23.7.2 6.1.5 9.4 4.4 9.3 9.6-.1 5.4-3.5 9.2-9.6 9.6-7.8.5-15.4.5-23.3-.1-6-.5-9.3-4.3-9.2-9.6.1-5.2 3.3-9.2 9.1-9.7Z" />
      {/* Sketch double-stroke along the track, top and bottom */}
      <path
        d="M21.6 24.1c7.6-.4 14.5-.4 21.6.1M43.2 39.9c-7.4.5-14.6.4-21.8 0"
        strokeWidth={0.9}
        opacity={0.55}
      />
      {/* Knob, resting in the "on" position */}
      <path d="M43.6 25.6a6.3 6.3 0 0 1 .3 12.6 6.3 6.3 0 0 1-.3-12.6Z" />
      {/* Two shorthand "label" ticks inside the track */}
      <path d="M15.7 30.1c1.9-.3 4.2-.3 6.1 0" strokeWidth={1.2} opacity={0.7} />
      <path d="M15.9 34c1.8-.2 4-.2 5.8 0" strokeWidth={1.2} opacity={0.7} />
      {/* Width annotation beneath — the "spec drawing" conceit */}
      <path d="M11.3 48.6c13.4-.8 28.4-.7 41.8.1" strokeWidth={1.1} />
      <path d="M11.1 46.4v4.4M53.1 46.6v4.4" strokeWidth={1.1} />
      <path d="M13.7 47.3l-2.5 1.3 2.5 1.4M50.6 47.5l2.4 1.3-2.5 1.4" strokeWidth={0.9} />
      {/* Dashed leader line */}
      <path d="M47.5 20.1l5-4.6" strokeWidth={0.9} strokeDasharray="2 2.2" />
    </svg>
  );
}

/**
 * Mark plus wordmark, for the nav notch and anywhere else the brand is named.
 * The mark carries the brand blue; the word inherits the surrounding text
 * colour so it stays legible on the nav's near-white and pure-black surfaces.
 */
export function Logo({
  className,
  markClassName,
  labelClassName,
}: {
  className?: string;
  markClassName?: string;
  labelClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <LogoMark
        className={cn("size-[22px] shrink-0 text-[var(--brand-mark)]", markClassName)}
      />
      <span
        className={cn(
          "font-sans text-sm font-medium tracking-tight antialiased",
          labelClassName
        )}
      >
        CraftUI
      </span>
    </span>
  );
}

export default LogoMark;
