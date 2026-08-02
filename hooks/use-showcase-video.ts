"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Drives one showcase video through three stages, each gated on a different
 * signal so the expensive ones stay off the critical path:
 *
 *   mounted  — the <video> element exists and may begin fetching. Triggered
 *              500px before the card scrolls into view.
 *   playing  — a real frame has been composited. This is what un-blurs the
 *              card; `loadedmetadata` is too early (dimensions are known but
 *              nothing is decoded) and would fade in on an empty element.
 *   inView   — at least half the card is visible, so playback should run.
 *              Everything else is paused to cap concurrent decoders.
 *
 * `deferred` collapses all of it for users on reduced-motion or a metered
 * connection: nothing is ever fetched and the card stays on its poster frame.
 */
export function useShowcaseVideo({ eager = false }: { eager?: boolean } = {}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [deferred, setDeferred] = useState(false);
  // Eager cards start mounted rather than being switched on from an effect, so
  // their <video> is in the server-rendered markup and starts fetching without
  // waiting for hydration.
  const [mounted, setMounted] = useState(eager);
  const [playing, setPlaying] = useState(false);

  // Read once on the client. Both checks are unavailable during SSR, so the
  // first paint always assumes full playback and steps down if needed — that
  // way the markup is identical on both sides and hydration stays clean.
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;

    const metered =
      connection?.saveData === true ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g";

    const update = () => setDeferred(motionQuery.matches || metered);
    update();

    motionQuery.addEventListener("change", update);
    return () => motionQuery.removeEventListener("change", update);
  }, []);

  // Stage 1 — mount the element ahead of the viewport so the first frames are
  // already in flight by the time the card is actually on screen.
  useEffect(() => {
    if (deferred || mounted) return;

    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "500px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [deferred, mounted, eager]);

  // Stage 3 — play only while genuinely visible.
  useEffect(() => {
    if (!mounted || deferred) return;

    const node = videoRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          // Autoplay can still be refused (low power mode, platform policy).
          // Swallowing it leaves the card on its blurred frame, which is a
          // reasonable resting state rather than an error.
          void node.play().catch(() => {});
        } else {
          node.pause();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [mounted, deferred]);

  return {
    cardRef,
    videoRef,
    /** Render the <video> element at all. */
    mounted,
    /** A frame has painted — safe to drop the blur. */
    playing,
    /** No video will be fetched; show the static affordance instead. */
    deferred,
    /** Wire to the element's `onPlaying`. */
    onPlaying: () => setPlaying(true),
  };
}
