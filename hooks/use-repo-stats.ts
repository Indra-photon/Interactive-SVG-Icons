"use client";

import { useEffect, useState } from "react";

export interface RepoStats {
  stars: number | null;
  views: number | null;
}

/**
 * GitHub star and view counts from /api/stats.
 *
 * Returns `null` while the request is in flight. Once it settles, either field
 * can still be null if its upstream was unavailable — callers are expected to
 * drop that half rather than render a zero, which would read as a real count.
 */
export function useRepoStats(): RepoStats | null {
  const [stats, setStats] = useState<RepoStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: RepoStats | null) => {
        if (!cancelled) setStats(data ?? { stars: null, views: null });
      })
      .catch(() => {
        if (!cancelled) setStats({ stars: null, views: null });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
}

/** 1240 → "1.2k", so a wide number can't stretch its row. */
export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
}
