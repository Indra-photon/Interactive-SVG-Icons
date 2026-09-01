"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import {
  IconBrandGithub,
  IconAlertCircle,
  IconChevronRight,
} from "@tabler/icons-react";
import { CopyButton } from "@/components/loader-gallery/CopyButton";
import { Paragraph } from "@/components/Paragraph";
import { ShareButton } from "./ShareButton";
import { repoFileUrl, repoIssueUrl } from "@/constants/repo";

/**
 * The right column on the gallery detail screens — blocks, sections, icons and
 * loaders all render the same one.
 *
 * It exists because the install command, the tier and the dependencies used to
 * sit *below* the preview: the single most-wanted line on the page was under
 * the fold on every item. Those move up here and stay put while the centre
 * column scrolls.
 *
 * Only above `xl`. Below that the rail is hidden and each panel keeps rendering
 * the same content inline in the centre column — the alternative is that a
 * laptop loses the install command altogether.
 */

export interface RailRelatedItem {
  label: string;
  href: string;
  /** Live thumbnail, where the item is small enough to be worth one. */
  preview?: ReactNode;
}

export interface DetailRailProps {
  /**
   * Registry item name, used to pull the item's own source out of
   * `/r/<name>.json` for the copy actions. Omit to drop those actions.
   */
  registryName?: string;
  /** Item label used in the AI prompt and the issue title. */
  itemLabel: string;
  /** One-liner describing the item, for the AI prompt. */
  description?: string;
  /** Label/value rows — tier, dependencies, animation type. */
  meta?: { label: string; value: string }[];
  /** Siblings worth jumping to. Rendered only when non-empty. */
  related?: RailRelatedItem[];
  /** Heading over the related list, e.g. "More in loops". */
  relatedLabel?: string;
  /** Repo-relative path to the item's own file, for the GitHub link. */
  sourcePath?: string;
}

/**
 * `crumb` rather than `display`: these are eyebrows over a 320px column, and
 * `display` — the variant Paragraph reserves for in-panel section headings — is
 * 24px, which would outweigh everything under it here. `crumb` is already the
 * small mono grey step, so this reuses it rather than adding a seventh variant,
 * and only adds case and weight at the call site, never a size.
 */
function RailHeading({ children }: { children: ReactNode }) {
  return (
    <Paragraph
      as="h3"
      variant="crumb"
      className="mb-2 font-semibold uppercase tracking-widest"
    >
      {children}
    </Paragraph>
  );
}

/**
 * Pulls the item's source files out of its registry JSON. That file is already
 * built and served statically from /r, so this needs no API route — and it is
 * the same content the shadcn CLI would install, which is what makes it the
 * honest answer to "copy the source".
 */
async function fetchSource(registryName: string): Promise<string> {
  const res = await fetch(`/r/${registryName}.json`);
  if (!res.ok) throw new Error(`Registry item ${registryName} not found`);
  const data = await res.json();
  const files: { path: string; content: string }[] = data.files ?? [];
  return files
    .map((file) => `// ${file.path}\n\n${file.content}`)
    .join("\n\n");
}

export function DetailRail({
  registryName,
  itemLabel,
  description,
  meta = [],
  related = [],
  relatedLabel = "Related",
  sourcePath,
}: DetailRailProps) {
  const copySource = async () => {
    if (!registryName) return "";
    return fetchSource(registryName);
  };

  const copyPrompt = async () => {
    if (!registryName) return "";
    const source = await fetchSource(registryName);
    return [
      `Here is a React component called "${itemLabel}".`,
      description ? `\n${description}` : "",
      meta.length
        ? `\n${meta.map((m) => `${m.label}: ${m.value}`).join("\n")}`
        : "",
      "\nSource:\n",
      "```tsx",
      source,
      "```",
      "\nUse it as the starting point for the change I describe next. Keep its",
      "existing animation behaviour and prop names unless I ask otherwise.",
    ]
      .filter(Boolean)
      .join("\n");
  };

  return (
    // Fixed width and never shrinks. The centre column is the flexible one —
    // it grows to take every pixel this doesn't, so the two sit flush with no
    // gutter between them at any viewport width.
    <aside className="hidden w-[320px] shrink-0 flex-col overflow-y-auto border-l border-border px-5 py-12 xl:flex">
      {/* Related. First in the rail now that the install command sits in the
          centre column, directly above the props table. */}
      {related.length > 0 && (
        <div>
          <RailHeading>{relatedLabel}</RailHeading>
          <div className="flex flex-col gap-0.5">
            {related.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-2.5 rounded-md px-1.5 py-1.5 transition-colors hover:bg-accent"
              >
                {item.preview}
                <Paragraph
                  as="span"
                  variant="caption"
                  className="min-w-0 flex-1 truncate"
                >
                  {item.label}
                </Paragraph>
                <IconChevronRight
                  className="size-3 shrink-0 text-muted-foreground/50"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Take it elsewhere */}
      {registryName && (
        <div className="mt-7">
          <RailHeading>Use it</RailHeading>
          <div className="flex flex-col gap-1">
            <CopyButton label="Copy source" getText={copySource} size="xs" />
            <CopyButton label="Copy as AI prompt" getText={copyPrompt} size="xs" />
            {sourcePath && (
              <a
                href={repoFileUrl(sourcePath)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-[10px] px-3 py-2 transition-colors hover:bg-accent"
              >
                <IconBrandGithub
                  className="size-3.5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <Paragraph as="span" variant="caption">
                  View on GitHub
                </Paragraph>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Meta */}
      {meta.length > 0 && (
        <dl className="mt-7 space-y-2">
          {meta.map(({ label, value }) => (
            <div key={label} className="flex items-baseline gap-3">
              <Paragraph
                as="dt"
                variant="crumb"
                className="w-16 shrink-0 uppercase tracking-widest"
              >
                {label}
              </Paragraph>
              <Paragraph as="dd" variant="caption" className="min-w-0 break-words">
                {value}
              </Paragraph>
            </div>
          ))}
        </dl>
      )}

      {/* Share and report, side by side. Deliberately following the content
          rather than pinned to the bottom edge: a spacer pushed them down past
          a screen of nothing on every item whose rail was short, which read as
          a broken column rather than as breathing room. */}
      <div className="mt-8 flex items-center gap-2 border-t border-border pt-4">
        <ShareButton title={itemLabel} />

        {/* A button rather than a link: the issue URL has to carry the page the
            reader is actually on, and that isn't known until the click. */}
        <button
          type="button"
          onClick={() =>
            window.open(
              repoIssueUrl({
                title: `[${itemLabel}] `,
                itemLabel,
                itemUrl: window.location.href,
              }),
              "_blank",
              "noopener,noreferrer",
            )
          }
          className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <IconAlertCircle
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <Paragraph as="span" variant="crumb" className="whitespace-nowrap">
            Report
          </Paragraph>
        </button>
      </div>
    </aside>
  );
}
