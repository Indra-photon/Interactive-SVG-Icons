"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon, StarIcon } from "@hugeicons/core-free-icons";
import { Paragraph } from "../Paragraph";

const REPO_URL = "https://github.com/Indra-photon/Interactive-SVG-Icons";

interface Stats {
  stars: number | null;
  views: number | null;
}

export default function HeroRepoStats() {
  // null while in flight; either field can stay null if its upstream is
  // unavailable, in which case that half simply doesn't render.
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Stats | null) => {
        if (!cancelled) setStats(data ?? { stars: null, views: null });
      })
      .catch(() => {
        if (!cancelled) setStats({ stars: null, views: null });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Em dash while loading, at the same tabular width as a real count, so the
  // pill doesn't resize under the user once the number lands.
  const starLabel =
    stats === null
      ? "—"
      : stats.stars === null
        ? null
        : formatCount(stats.stars);

  return (
    <div className="flex flex-col items-start gap-2">
      <Paragraph
        variant="body"
        className="uppercase text-xs tracking-widest"
      >
        Star the repo
      </Paragraph>

      <div className="flex flex-row items-center gap-4">
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Star Interactive SVG Icons on GitHub"
          className="flex h-9 items-center gap-2 rounded-[10px] border border-primary/60 bg-background/60 px-3 text-foreground/50 transition-colors duration-150 hover:border-primary hover:bg-background hover:text-foreground"
        >
          <HugeiconsIcon
            icon={GithubIcon}
            size={16}
            strokeWidth={1.9}
            className="text-primary"
          />
          {starLabel !== null && (
            <span className="flex items-center gap-1 text-[13px] tabular-nums">
              <HugeiconsIcon
                icon={StarIcon}
                size={13}
                strokeWidth={1.9}
                className="text-primary"
              />
              {starLabel}
            </span>
          )}
        </a>

        {stats?.views != null && (
          <Paragraph
            variant="body"
            className="text-xs tabular-nums"
          >
            {formatCount(stats.views)} views this month
          </Paragraph>
        )}
      </div>
    </div>
  );
}

/** 1240 → "1.2k", so a wide number can't stretch the row. */
function formatCount(n: number): string {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
}
