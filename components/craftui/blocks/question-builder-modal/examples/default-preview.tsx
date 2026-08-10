"use client";

import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";

import QuestionBuilderModal, { type QuestionDraft } from "../default";

/**
 * Preview-only containment.
 *
 * shadcn's DialogContent hard-codes its DialogPortal with no `container`, so
 * the panel and its `fixed inset-0` overlay always land in document.body —
 * outside this subtree, where no className or ancestor style can reach them.
 * The one channel that does reach them is inheritance: custom properties set
 * on the root element flow down through body into the portal.
 *
 * So the box publishes its own viewport rect as --qdp-* properties, the panel
 * reads them through the block's existing `className` prop, and the overlay —
 * which takes no props at all — is pinned by a rule scoped to a data attribute
 * that only exists while this preview's modal is open.
 *
 * None of this ships with the block. Installed anywhere else the modal is a
 * normal viewport-centered dialog.
 */
export default function DefaultPreview() {
  const [drafts, setDrafts] = useState<QuestionDraft[]>([]);
  const [open, setOpen] = useState(false);

  // scroll: true so the coordinates follow the docs page scrolling underneath.
  const [boxRef, bounds] = useMeasure({ scroll: true });

  useEffect(() => {
    const root = document.documentElement;
    // Centre point for the panel, which keeps its -translate-1/2 centering.
    root.style.setProperty("--qdp-cx", `${bounds.left + bounds.width / 2}px`);
    root.style.setProperty("--qdp-cy", `${bounds.top + bounds.height / 2}px`);
    // Panel width, less a gutter so it never touches the box edges.
    root.style.setProperty(
      "--qdp-mw",
      `${Math.max(0, Math.min(700, bounds.width - 48))}px`,
    );
    // Rect for the overlay.
    root.style.setProperty("--qdp-l", `${bounds.left}px`);
    root.style.setProperty("--qdp-t", `${bounds.top}px`);
    root.style.setProperty("--qdp-w", `${bounds.width}px`);
    root.style.setProperty("--qdp-h", `${bounds.height}px`);
  }, [bounds.left, bounds.top, bounds.width, bounds.height]);

  // Scopes the overlay rule to this preview, and only while it is open, so no
  // other dialog on the docs page is affected.
  //
  // The attribute is added instantly but dropped on a delay: the overlay is
  // still animating out for ~100ms after `open` flips (the base dialog's
  // duration-100), and unpinning it mid-fade snaps it from the box rect back
  // to inset:0 — a full-page dark flash on the last frames of every close.
  // 200ms clears that fade and the block's own 180ms view reset.
  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      root.setAttribute("data-qdp-open", "");
      return;
    }
    const timer = window.setTimeout(
      () => root.removeAttribute("data-qdp-open"),
      200,
    );
    return () => window.clearTimeout(timer);
  }, [open]);

  // Unmount safety: the delayed removal above is cancelled on cleanup, so the
  // attribute would otherwise outlive this preview if it unmounted while open.
  useEffect(
    () => () => document.documentElement.removeAttribute("data-qdp-open"),
    [],
  );

  return (
    <div
      ref={boxRef}
      className="relative flex h-full w-full flex-col items-center justify-center gap-6 bg-muted px-6"
    >
      <style>{`
        html[data-qdp-open] [data-slot="dialog-overlay"] {
          inset: auto;
          top: var(--qdp-t);
          left: var(--qdp-l);
          width: var(--qdp-w);
          height: var(--qdp-h);
        }
      `}</style>

      <QuestionBuilderModal
        open={open}
        onOpenChange={setOpen}
        onAddQuestion={(draft) => setDrafts((current) => [...current, draft])}
        // tailwind-merge drops the base top-1/2 / left-1/2 / sm:max-w-* in
        // favour of these, since the block appends `className` last.
        className="top-[var(--qdp-cy)] left-[var(--qdp-cx)] sm:max-w-[var(--qdp-mw)]"
      >
        <button
          type="button"
          // h-11 → 14px, the same rung the block's inputs sit on. A pill here
          // was the one radius in the shot that belonged to no ladder.
          className="flex h-11 items-center gap-2 rounded-[14px] bg-background pr-5 pl-4 text-[15px] font-medium text-foreground shadow-[var(--shadow-border)] transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} />
          Add Question
        </button>
      </QuestionBuilderModal>

      {drafts.length > 0 && (
        <ul className="w-full max-w-sm space-y-1.5">
          {drafts.map((draft, index) => (
            <li
              key={index}
              className="flex items-center justify-between gap-3 rounded-[14px] bg-background px-3.5 py-2.5 text-[14px] shadow-[var(--shadow-border)]"
            >
              <span className="truncate text-foreground">
                {draft.question || <em className="opacity-60">Untitled</em>}
              </span>
              <span className="shrink-0 text-[12px] text-muted-foreground uppercase">
                {draft.type}
                {draft.required && " · required"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
