"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconArrowsMinimize } from "@tabler/icons-react";

interface FullscreenPreviewProps {
  blockSlug: string;
  variationName: string;
  /** Directory under components/craftui to import the preview from. */
  catalogDir: string;
  /** Where the floating button and Escape return to. */
  exitHref: string;
}

/**
 * The item on its own, with no gallery chrome around it — the only way to see a
 * page-width section at the width it actually ships at.
 *
 * It deliberately does not reuse `BlockPreview`: that wrapper adds a rounded
 * border, a muted ground and `overflow-hidden` so an item reads as a specimen
 * inside the gallery. Here the item *is* the page, so it gets none of that. The
 * dynamic import is the same one, so both paths load the same preview file.
 *
 * `fixed inset-0` rather than a plain block, because the app's NavBar is
 * rendered by the root layout and would otherwise sit above the section.
 */
export function FullscreenPreview({
  blockSlug,
  variationName,
  catalogDir,
  exitHref,
}: FullscreenPreviewProps) {
  const router = useRouter();
  const [Preview, setPreview] = useState<React.ComponentType | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    import(
      `@/components/craftui/${catalogDir}/${blockSlug}/examples/${variationName}-preview.tsx`
    )
      .then((mod) => {
        if (!live) return;
        setPreview(() => mod.default ?? mod[Object.keys(mod)[0]]);
      })
      .catch((err) => {
        console.error("Failed to load fullscreen preview:", err);
        if (live) setFailed(true);
      });
    return () => {
      live = false;
    };
  }, [catalogDir, blockSlug, variationName]);

  /* Escape leaves, and the page behind is locked while this is open so a scroll
   * gesture that runs past the end of the preview doesn't move the gallery
   * underneath it. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push(exitHref);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [router, exitHref]);

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-background">
      {failed ? (
        <div className="flex h-dvh items-center justify-center px-6 text-center text-sm text-muted-foreground">
          Could not load the preview for{" "}
          <span className="mx-1 font-mono">{blockSlug}</span>.
        </div>
      ) : Preview ? (
        <Preview />
      ) : (
        <div className="flex h-dvh items-center justify-center text-sm text-muted-foreground">
          Loading preview…
        </div>
      )}

      {/* Floating exit. Centred rather than in a corner: every corner already
          belongs to something — the dev DialRoot bottom-right, and a section's
          own content top-left. */}
      <Link
        href={exitHref}
        aria-label="Exit full screen preview"
        className="fixed bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2 text-xs font-mono tracking-tight text-foreground shadow-lg backdrop-blur transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <IconArrowsMinimize className="size-4" aria-hidden="true" />
        Exit full screen
        <kbd className="ml-1 rounded border border-border px-1 py-0.5 text-[10px] text-muted-foreground">
          Esc
        </kbd>
      </Link>
    </div>
  );
}
