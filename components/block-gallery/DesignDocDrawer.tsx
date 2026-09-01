"use client";

import { useState } from "react";
import { Drawer } from "vaul";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { IconFileText, IconX } from "@tabler/icons-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { CopyButton } from "@/components/loader-gallery/CopyButton";
import { cn } from "@/lib/utils";

/**
 * Shows an item's `design.md` in a drawer — from the right on desktop, from the
 * bottom on mobile.
 *
 * The markdown arrives as a prop, read off disk by the gallery page on the
 * server. Fetching it here instead would make the trigger's very existence
 * depend on a request in flight, and most items ship no design doc at all.
 */

interface DesignDocDrawerProps {
  /** Raw markdown to render. */
  content: string;
  /** Shown as the drawer's subtitle. */
  title: string;
}

// ── Markdown → themed elements ───────────────────────────────────────────────
// Every colour is a globals.css token, so the doc follows the site theme rather
// than carrying a palette of its own. There is no typography plugin installed,
// hence the explicit map.

const mdComponents: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  h1: ({ children }) => (
    <h1 className="mt-8 mb-3 text-[17px] font-semibold tracking-tight text-foreground first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-8 mb-2.5 border-b border-border pb-1.5 text-[15px] font-semibold tracking-tight text-foreground first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 mb-2 text-[13px] font-semibold tracking-tight text-foreground">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-5 mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="my-3 text-[13px] leading-relaxed text-muted-foreground">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground underline underline-offset-2 decoration-border hover:decoration-foreground"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="my-3 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-muted-foreground marker:text-border">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-muted-foreground marker:text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-2 border-border pl-4 text-[13px] italic text-muted-foreground/80">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-7 border-border" />,
  // `pre` carries the block styling; `code` only needs to tell the two cases
  // apart, which it does by whether it sits inside a fence.
  code: ({ className, children }) => {
    const isBlock = /language-/.test(className ?? "");
    if (isBlock) {
      return (
        <code className="font-mono text-[12px] leading-relaxed text-foreground">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded-[4px] bg-muted px-1 py-0.5 font-mono text-[11.5px] text-foreground">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-lg border border-border bg-muted/50 p-3.5">
      {children}
    </pre>
  ),
  // Tables in these docs are wide (device / rationale grids), so the wrapper
  // scrolls on its own rather than letting the drawer body scroll sideways.
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-left text-[12px]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted/60">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-border px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-border px-3 py-2 align-top text-muted-foreground last:border-b-0">
      {children}
    </td>
  ),
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === "string" ? src : undefined}
      alt={alt ?? ""}
      className="my-4 w-full rounded-lg border border-border"
    />
  ),
};

export function DesignDocDrawer({ content, title }: DesignDocDrawerProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const direction = isMobile ? "bottom" : "right";

  return (
    // Vaul reads `direction` at mount to set up its gesture and animation, so
    // a resize across the breakpoint has to remount the root rather than just
    // re-render it.
    <Drawer.Root
      key={direction}
      direction={direction}
      open={open}
      onOpenChange={setOpen}
    >
      <Drawer.Trigger className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-mono tracking-tight text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
        <IconFileText className="size-3.5" aria-hidden="true" />
        Design.md
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-[2px]" />

        <Drawer.Content
          className={cn(
            "fixed z-[210] flex flex-col bg-background text-foreground outline-none",
            direction === "bottom"
              ? "inset-x-0 bottom-0 h-[88vh] rounded-t-2xl border-t border-border"
              : "inset-y-0 right-0 h-full w-[min(92vw,560px)] border-l border-border lg:w-[680px]",
          )}
        >
          {/* Drag handle — only meaningful on the bottom sheet. */}
          {direction === "bottom" && (
            <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-border" />
          )}

          {/* Header */}
          <div className="flex shrink-0 items-start justify-between gap-3 px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <Drawer.Title className="font-mono text-[13px] font-medium tracking-tight text-foreground">
                design.md
              </Drawer.Title>
              <Drawer.Description className="mt-0.5 truncate text-xs text-muted-foreground">
                {title}
              </Drawer.Description>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <CopyButton text={content} label="copy" size="xs" />
              <Drawer.Close
                aria-label="Close design notes"
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <IconX className="size-4" aria-hidden="true" />
              </Drawer.Close>
            </div>
          </div>

          <div className="h-px shrink-0 bg-border" />

          {/* Body */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-16 pt-2 sm:px-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {content}
            </ReactMarkdown>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
