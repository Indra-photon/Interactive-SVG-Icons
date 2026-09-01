/**
 * Siblings to offer in the detail rail's "related" list.
 *
 * Same category, current item dropped, capped — the point is one more thing
 * worth clicking, not a second sidebar. Falls back to any other item when the
 * category has nothing else in it, since an empty list just wastes the heading.
 */

export interface RelatedSource {
  slug: string;
  name: string;
  category: string;
}

export const RELATED_LIMIT = 4;

export function pickRelated<T extends RelatedSource>(
  items: T[],
  activeSlug: string,
  limit = RELATED_LIMIT,
): T[] {
  const others = items.filter((item) => item.slug !== activeSlug);
  const active = items.find((item) => item.slug === activeSlug);

  const sameCategory = active
    ? others.filter((item) => item.category === active.category)
    : [];

  return (sameCategory.length > 0 ? sameCategory : others).slice(0, limit);
}
