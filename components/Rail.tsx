import { cn } from "@/lib/utils";

/**
 * The measure as a class string, for callers that must own their own element —
 * chiefly `motion.div` / `motion.section`, which can't be wrapped in <Rail>
 * without either losing their variants or adding a redundant DOM node.
 * Prefer <Rail> for plain markup; reach for this only when the element is
 * already something else.
 */
export const RAIL = "mx-auto w-full max-w-6xl px-8 sm:px-4";

/**
 * The page measure.
 *
 * `max-w-6xl` with `px-8 sm:px-4` was retyped in three places, and two of them
 * carried comments explaining that they had to agree — ShowcaseSection's said
 * "Matches HeroLinksList's rail exactly, so the grid's outer edges land on the
 * same vertical as the hero cards above it." That alignment is now structural
 * instead of remembered.
 *
 * Note the padding shrinks as the viewport grows: 32px on phones, 16px from sm
 * up. That is deliberate and predates this component — narrow screens need the
 * larger gutter because content runs edge to edge, while at sm+ the max-width
 * is already doing the work.
 *
 * `as` exists so a section can be a <section> and a wrapper a <div> without
 * nesting an extra element purely to carry the measure.
 */
export function Rail({
  as: Tag = "div",
  className,
  children,
}: {
  as?: "div" | "section" | "header" | "main";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag className={cn(RAIL, className)}>{children}</Tag>
  );
}
