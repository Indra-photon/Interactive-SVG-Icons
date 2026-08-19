"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon, StarIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { MorphArrow } from "@/components/ui/morph-arrow";
import { SOCIAL_LINKS, MagneticIcon } from "@/components/Homepage/HeroSocialLinks";
import { useRepoStats, formatCount } from "@/hooks/use-repo-stats";
import { Paragraph } from "../Paragraph";

const REPO_URL = "https://github.com/Indra-photon/Interactive-SVG-Icons";

/**
 * Eighth card, closing the second row.
 *
 * Same shell as HeroLinkCardItem — identical knob block, so it shares the row's
 * preview height, text gaps and CTA baseline — but the preview slot holds the
 * social links instead of a HeroPixelGrid. No mosaic here by design: this card
 * points at people rather than a catalog, and a twinkling grid would file it
 * alongside the seven that do.
 *
 * Deliberately NOT wrapped in a single link, unlike its neighbours. The social
 * icons are anchors, and an outer anchor around them would nest interactive
 * elements — so only the footer button navigates.
 */
export function HeroCreatorCard() {
  const [isHovered, setIsHovered] = useState(false);
  const stats = useRepoStats();

  // Em dash while in flight, at the same tabular width a real count will take,
  // so the line doesn't reflow under the reader once the number lands.
  const starLabel =
    stats === null
      ? "—"
      : stats.stars === null
        ? null
        : formatCount(stats.stars);

  return (
    <Card className="[--card-pad:--spacing(3)] [--card-py:--spacing(3)] [--preview-h:--spacing(36)] [--text-gap:--spacing(4)] [--cta-gap:--spacing(2)] [--card-spacing:var(--card-pad)] h-full gap-0 py-(--card-py) text-left transition-shadow duration-200 corner-squircle rounded-[20px]">
      <CardContent className="flex-1">
        {/* justify-end anchors the icons to the bottom of the slot, where the
            mosaic sits on the other cards. */}
        <div className="relative flex h-full min-h-(--preview-h) w-full flex-col justify-end gap-3 overflow-hidden rounded-lg bg-muted p-4">
          <Paragraph
            variant="body"
            className="text-xs tracking-widest uppercase"
          >
            Meet the creator
          </Paragraph>
          <div className="flex flex-row flex-wrap gap-3">
            {SOCIAL_LINKS.map(({ icon, href, label }) => (
              <MagneticIcon key={label} icon={icon} href={href} label={label} />
            ))}
          </div>
        </div>
      </CardContent>

      <CardContent className="mt-(--text-gap) flex flex-col pt-10">
        <CardTitle>
          <Paragraph variant="title" className="uppercase">
            GitHub
          </Paragraph>
        </CardTitle>
        <CardDescription>
          <Paragraph variant="body" className="flex items-center gap-1.5">
            {starLabel !== null && (
              <span className="inline-flex items-center gap-1 tabular-nums">
                <HugeiconsIcon
                  icon={StarIcon}
                  size={13}
                  strokeWidth={1.9}
                  className="text-primary"
                />
                {starLabel} stars
              </span>
            )}
            {/* Both halves are independently optional, so the separator has to
                depend on both being present. */}
            {starLabel !== null && stats?.views != null && <span>·</span>}
            {stats?.views != null && (
              <span className="tabular-nums">
                {formatCount(stats.views)} views
              </span>
            )}
          </Paragraph>
        </CardDescription>
      </CardContent>

      <CardFooter className="mt-(--cta-gap)">
        <Button
          asChild
          variant="secondary"
          size="xs"
          className="corner-squircle rounded-[10px] tracking-normal whitespace-nowrap"
        >
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Star Interactive SVG Icons on GitHub"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <HugeiconsIcon icon={GithubIcon} size={14} strokeWidth={1.9} />
            Star the repo
            <span className="inline-flex items-center justify-center rounded-[6px] text-white">
              <MorphArrow isHovered={isHovered} size={14} />
            </span>
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
