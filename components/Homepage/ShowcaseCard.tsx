"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StackedArrow } from "@/components/ui/stacked-arrow";
import { Paragraph } from "@/components/Paragraph";
import { useShowcaseVideo } from "@/hooks/use-showcase-video";
import { showcaseKind } from "@/lib/showcase-kind";
import type { ShowcaseItem } from "@/constants/showcase";
import { cn } from "@/lib/utils";

const cardVariants = {
  hidden: { y: 18, opacity: 0, filter: "blur(8px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] as const },
  },
};

interface ShowcaseCardProps extends ShowcaseItem {
  /** First row skips the intersection gate and starts loading immediately. */
  eager?: boolean;
}

export function ShowcaseCard({
  title,
  description,
  src,
  aspect,
  href,
  eager,
}: ShowcaseCardProps) {
  const { cardRef, videoRef, mounted, playing, deferred, onPlaying } =
    useShowcaseVideo({ eager });
  // Read off the href, not a field of its own — see lib/showcase-kind.ts.
  const kind = showcaseKind(href);

  const card = (
    // Same knob pattern as HeroLinksList so the two sections share one system:
    // the media well sits --card-pad (12px) inside the card on all four sides,
    // so concentric radii require inner = outer - padding = 20 - 12 = 8px.
    // Note `rounded-lg` is 10px in this project (globals.css sets --radius to
    // 0.625rem), not Tailwind's stock 8px — hence the explicit value below.
    <Card className="[--card-pad:--spacing(3)] [--card-spacing:var(--card-pad)] gap-0 py-(--card-pad) text-left transition-shadow duration-200 corner-squircle rounded-[20px] group-hover:ring-foreground/20">
      <CardContent>
        <div
          // aspect-ratio comes from the MP4's own tkhd box, so the box is
          // reserved at its true proportion before a byte is fetched. Without
          // it the card would be 0px tall until metadata landed and every card
          // below it in the column would jump.
          style={{ aspectRatio: aspect }}
          // outline (not border) keeps the ring out of layout, and the -1px
          // offset draws it just inside the edge so it hugs the corner radius.
          // Pure black/white only — a tinted neutral picks up the surface
          // underneath and reads as dirt on the video edge.
          className="relative w-full overflow-hidden rounded-[8px] bg-muted outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
        >
          {mounted && (
            <video
              ref={videoRef}
              src={src}
              // Enough to decode and paint frame one — that frame *is* the
              // placeholder, blurred below until playback starts. No poster
              // asset, no build-time thumbnail extraction.
              preload="metadata"
              muted
              loop
              playsInline
              onPlaying={onPlaying}
              className={cn(
                "absolute inset-0 h-full w-full object-cover",
                // Tailwind v4 emits `scale: 105%` as its own property rather
                // than folding it into `transform`, so the list names `scale`
                // directly — `transform` here would never match and the settle
                // would snap instead of easing.
                "transition-[filter,scale] duration-500 ease-(--ease-out-quart)",
                playing
                  ? "scale-100 blur-0"
                  : // Blurring a bitmap softens its edges, so the slight
                    // upscale keeps the frame edge flush with the well.
                    "scale-105 blur-[20px] saturate-[1.4]",
              )}
            />
          )}

          {deferred && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-background/80 text-foreground ring-1 ring-foreground/10 backdrop-blur-sm">
                {/* A triangle's geometric centre sits left of its visual
                    centre, so nudge it 2px along the inline axis. */}
                <IconPlayerPlayFilled size={16} className="ms-[2px]" />
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardContent className="mt-4 flex flex-col">
        <div className="flex items-center justify-between gap-3">
          <Paragraph variant="title" className="">
            {title}
          </Paragraph>
          {/* Badge then arrow, both only on linkable cards — an arrow on a card
              that goes nowhere promises navigation the click won't deliver, and
              a catalog badge on one implies a destination it doesn't have. */}
          {href && (
            <div className="flex shrink-0 items-center gap-2">
              {kind && (
                <Badge
                  variant="outline"
                  className="text-white py-1 bg-[image:var(--gradient-button)]"
                >
                  {kind}
                </Badge>
              )}
              <StackedArrow size={26} className="text-[#24a0ed] " />
            </div>
          )}
        </div>
        {description && (
          <Paragraph variant="body" className="mt-1">
            {description}
          </Paragraph>
        )}
      </CardContent>
    </Card>
  );

  return (
    // mb-4 rather than a grid gap: CSS columns has no row gap, so the vertical
    // rhythm has to live on the item. break-inside-avoid stops a card being
    // split across a column boundary.
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      className="mb-4 break-inside-avoid sm:mb-5"
    >
      {href ? (
        <Link
          href={href}
          className="group block rounded-[20px] focus-visible:outline-none"
        >
          {card}
        </Link>
      ) : (
        <div className="group">{card}</div>
      )}
    </motion.div>
  );
}
